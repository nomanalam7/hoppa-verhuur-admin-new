import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { getDashboard, upcommingOrders } from "../../api/modules/dashboardApi";
import useFilterSliceKey from "../../zustand/filter_slice_key";
import { FILTER_MODES } from "../../utils/filterConfig";
import { useErrorDialog } from "../../lib/context/errorDialogContext";
import moment from "moment";
import { useSuccessDialog } from "../../lib/context/successDialogContext";
import {
  markAsCompletedOrder,
  markAsConfirmedOrder,
  markAsDeliveredOrder,
  markAsPickedUpOrder,
} from "../../api/modules/order";

export const useDashboard = () => {
  const { showError } = useErrorDialog();
  const { showSuccess } = useSuccessDialog();
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);

  const { filters } = useFilterSliceKey();
  const dashboardFilters = useMemo(
    () => filters[FILTER_MODES.DASHBOARD] || {},
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

  // Build params for getDashboard (NO period parameter)
  const buildDashboardParams = useCallback(() => {
    const params = {};
    const { startDate, endDate, search, status } = dashboardFilters;

    if (startDate) params.startDate = formatDate(startDate);
    if (endDate) params.endDate = formatDate(endDate);
    if (search) params.search = search;
    if (status) params.status = status;

    return params;
  }, [dashboardFilters, formatDate]);

  // Build params for upcommingOrders (WITH period parameter)
  const buildOrdersParams = useCallback(() => {
    const params = buildDashboardParams();
    const { period } = dashboardFilters;

    if (period) params.period = period;

    return params;
  }, [dashboardFilters, buildDashboardParams]);

  // Fetch dashboard data
  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const params = buildDashboardParams();
      const response = await getDashboard(params);
      setDashboard(response?.data?.data || null);
    } catch (err) {
      showError({
        title: err?.response?.data?.message || "Failed to load dashboard",
      });
    } finally {
      setLoading(false);
    }
  }, [buildDashboardParams, showError]);

  // Fetch orders data
  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const params = buildOrdersParams();
      const response = await upcommingOrders(params);
      setOrders(response?.data?.data?.orders || []);
      setPagination(response?.data?.data?.pagination || null);
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
      const dashboardParams = buildDashboardParams();
      const ordersParams = buildOrdersParams();

      const [dashboardRes, ordersRes] = await Promise.all([
        getDashboard(dashboardParams),
        upcommingOrders(ordersParams),
      ]);

      setDashboard(dashboardRes?.data?.data || null);
      setOrders(ordersRes?.data?.data?.orders || []);
      setPagination(ordersRes?.data?.data?.pagination || null);
    } catch (err) {
      showError({
        title: err?.response?.data?.message || "Failed to load dashboard",
      });
    } finally {
      setLoading(false);
    }
  }, [buildDashboardParams, buildOrdersParams, showError]);

  // Mark as Picked Up
  const handleMarkAsPickedUp = useCallback(
    async (id) => {
      setOrdersLoading(true);
      try {
        const response = await markAsPickedUpOrder(id);
        if (response?.status === 200 || response.status === 201) {
          await fetchOrders(); // Refresh list
          showSuccess({
            title: response.data.message,
          });
        } else {
          showError({
            title: response.data.message,
          });
        }
        return response?.data;
      } catch (err) {
        showError({
          title: err?.response?.data?.message || "Failed to mark as picked up",
        });
        return null;
      } finally {
        setOrdersLoading(false);
      }
    },
    [fetchOrders, showError, showSuccess]
  );

  // Mark as Delivered
  const handleMarkAsDelivered = useCallback(
    async (id) => {
      setOrdersLoading(true);
      try {
        const response = await markAsDeliveredOrder(id);
        if (response?.status === 200 || response.status === 201) {
          await fetchOrders(); // Refresh list
          showSuccess({
            title: response.data.message,
          });
        } else {
          showError({
            title: response.data.message,
          });
        }
        return response?.data;
      } catch (err) {
        showError({
          title: err?.response?.data?.message || "Failed to mark as delivered",
        });
        return null;
      } finally {
        setOrdersLoading(false);
      }
    },
    [fetchOrders, showError, showSuccess]
  );

  // Mark as Completed
  const handleMarkAsCompleted = useCallback(
    async (id) => {
      setOrdersLoading(true);
      try {
        const response = await markAsCompletedOrder(id);
        if (response?.status === 200 || response.status === 201) {
          await fetchOrders(); // Refresh list
          showSuccess({
            title: response.data.message,
          });
        } else {
          showError({
            title: response.data.message,
          });
        }
        return response?.data;
      } catch (err) {
        showError({
          title: err?.response?.data?.message || "Failed to mark as completed",
        });
        return null;
      } finally {
        setOrdersLoading(false);
      }
    },
    [fetchOrders, showError, showSuccess]
  );

  // Mark as Confirmed
  const handleMarkAsConfirmed = useCallback(
    async (id) => {
      setOrdersLoading(true);
      try {
        const response = await markAsConfirmedOrder(id);
        if (response?.status === 200 || response.status === 201) {
          await fetchOrders(); // Refresh list
          showSuccess({
            title: response.data.message,
          });
        } else {
          showError({
            title: response.data.message,
          });
        }
        return response?.data;
      } catch (err) {
        showError({
          title: err?.response?.data?.message || "Failed to mark as confirmed",
        });
        return null;
      } finally {
        setOrdersLoading(false);
      }
    },
    [fetchOrders, showError, showSuccess]
  );

  // Initial load - runs only once on mount
  useEffect(() => {
    if (isFirstLoad.current) {
      fetchInitial();
      prevFiltersRef.current = { ...dashboardFilters };
      isFirstLoad.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto refetch on filter change
  useEffect(() => {
    if (isFirstLoad.current) return;

    const prev = prevFiltersRef.current;
    const current = dashboardFilters;

    const dateChanged =
      prev.startDate !== current.startDate || prev.endDate !== current.endDate;

    const otherChanged =
      prev.search !== current.search ||
      prev.status !== current.status ||
      prev.period !== current.period;

    prevFiltersRef.current = { ...current };

    if (!dateChanged && !otherChanged) return;

    const timeoutId = setTimeout(() => {
      if (dateChanged) {
        fetchDashboard();
      }
      if (otherChanged) {
        fetchOrders();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [dashboardFilters, fetchDashboard, fetchOrders]);

  return {
    dashboard,
    orders,
    pagination,
    loading,
    ordersLoading,
    fetchOrders,
    refetchAll: fetchInitial,
    dashboardFilters,
    handleMarkAsConfirmed,
    handleMarkAsDelivered,
    handleMarkAsPickedUp,
    handleMarkAsCompleted,
  };
};
