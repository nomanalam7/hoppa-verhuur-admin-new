import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import useFilterSliceKey from "../../zustand/filter_slice_key";
import { FILTER_MODES } from "../../utils/filterConfig";
import { useErrorDialog } from "../../lib/context/errorDialogContext";
import moment from "moment";
import { getReports, getReportsOrders } from "../../api/modules/reports";

export const useReports = () => {
  const { showError } = useErrorDialog();

  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [reports, setReports] = useState(null);
  const [orders, setOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [pagination, setPagination] = useState(null);

  const { filters } = useFilterSliceKey();
  const reportFilters = useMemo(
    () => filters[FILTER_MODES.REPORTS] || {},
    [filters]
  );

  const isFirstLoad = useRef(true);
  const prevFiltersRef = useRef({});

  // Format date value for API
  const formatDate = useCallback((date) => {
    if (!date) return null;
    if (date instanceof Date) return moment(date).format("DD-MM-YYYY");
    if (typeof date === "string") return moment(date).format("DD-MM-YYYY");
    return null;
  }, []);

  // Build params for getReports (ONLY period parameter)
  const buildReportsParams = useCallback(() => {
    const params = {};
    const { period } = reportFilters;
    
    if (period) params.period = period;

    return params;
  }, [reportFilters]);

  // Build params for getReportsOrders (search, date range - NO period)
  const buildOrdersParams = useCallback(() => {
    const params = {};
    const { search, date, startDate, endDate } = reportFilters;

    if (search) params.search = search;
    if (date) params.date = formatDate(date);
    if (startDate) params.startDate = formatDate(startDate);
    if (endDate) params.endDate = formatDate(endDate);

    return params;
  }, [reportFilters, formatDate]);

  // Fetch reports data
  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const params = buildReportsParams();
      const response = await getReports(params);
      setReports(response?.data?.data || null);
    } catch (err) {
      showError({
        title: err?.response?.data?.message || "Failed to load reports",
      });
    } finally {
      setLoading(false);
    }
  }, [buildReportsParams, showError]);

  // Fetch orders data
  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const params = buildOrdersParams();
      const response = await getReportsOrders(params);
      
      setOrders(response?.data?.data?.completedOrders?.orders || []);
      setPagination(response?.data?.data?.completedOrders?.pagination || null);
      setTopProducts(response?.data?.data?.topProducts || []);
    } catch (err) {
      showError({
        title: err?.response?.data?.message || "Failed to fetch orders",
      });
    } finally {
      setOrdersLoading(false);
    }
  }, [buildOrdersParams, showError]);

  // Initial load - both APIs
  const fetchInitial = useCallback(async () => {
    setLoading(true);
    try {
      const reportsParams = buildReportsParams();
      const ordersParams = buildOrdersParams();

      const [reportsRes, ordersRes] = await Promise.all([
        getReports(reportsParams),
        getReportsOrders(ordersParams),
      ]);

      setReports(reportsRes?.data?.data || null);
      setOrders(ordersRes?.data?.data?.completedOrders?.orders || []);
      setPagination(ordersRes?.data?.data?.completedOrders?.pagination || null);
      setTopProducts(ordersRes?.data?.data?.topProducts || []);
    } catch (err) {
      showError({
        title: err?.response?.data?.message || "Failed to load reports",
      });
    } finally {
      setLoading(false);
    }
  }, [buildReportsParams, buildOrdersParams, showError]);

  // Initial load - runs only once on mount
  useEffect(() => {
    if (isFirstLoad.current) {
      fetchInitial();
      prevFiltersRef.current = { ...reportFilters };
      isFirstLoad.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto refetch on filter change
  useEffect(() => {
    if (isFirstLoad.current) return;

    const prev = prevFiltersRef.current;
    const current = reportFilters;

    const periodChanged = prev.period !== current.period;
    const otherChanged =
      prev.search !== current.search || 
      prev.date !== current.date ||
      prev.startDate !== current.startDate ||
      prev.endDate !== current.endDate;

    prevFiltersRef.current = { ...current };

    if (!periodChanged && !otherChanged) return;

    const timeoutId = setTimeout(() => {
      if (periodChanged) {
        fetchReports();
      }
      if (otherChanged) {
        fetchOrders();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [reportFilters, fetchReports, fetchOrders]);

  return {
    reports,
    orders,
    topProducts,
    pagination,
    loading,
    ordersLoading,
    fetchOrders,
    refetchAll: fetchInitial,
    reportFilters,
  };
};