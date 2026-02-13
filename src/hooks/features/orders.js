import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import {
  getOrders,
  getOrderById,
  updateOrder,
  markAsPickedUpOrder,
  markAsDeliveredOrder,
  markAsCompletedOrder,
  markAsConfirmedOrder,
  deleteOrder,
} from "../../api/modules/order";
import useFilterSliceKey from "../../zustand/filter_slice_key";
import { FILTER_MODES } from "../../utils/filterConfig";
import { useErrorDialog } from "../../lib/context/errorDialogContext";
import { useSuccessDialog } from "../../lib/context/successDialogContext";
import moment from "moment";
import useOrderSlice from "../../zustand/orderPaginationSlice";

export const useOrders = () => {
  const { showError } = useErrorDialog();
  const { showSuccess } = useSuccessDialog();

  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const {
    page,
    limit,
    total,
    totalPages,
    setPage,
    setLimit,
    setPagination: setOrderPagination,
  } = useOrderSlice();

  const { filters } = useFilterSliceKey();
  const ordersFilters = useMemo(
    () => filters[FILTER_MODES.ORDER_MANAGEMENT] || {},
    [filters]
  );

  const isFirstLoad = useRef(true);
  const prevFiltersRef = useRef({});

  const formatDate = useCallback((date) => {
    if (!date) return null;
    if (date instanceof Date) return moment(date).format("DD-MM-YYYY");
    if (typeof date === "string") return moment(date).format("DD-MM-YYYY");
    return null;
  }, []);

  const buildOrdersParams = useCallback(
    (overridePage, overrideLimit) => {
      const params = {
        page: overridePage ?? page,
        limit: overrideLimit ?? limit,
      };

      const { date, search, status } = ordersFilters;

      if (date) params.date = formatDate(date);
      if (search) params.search = search;
      if (status !== undefined && status !== "") params.status = status;

      return params;
    },
    [ordersFilters, formatDate, page, limit]
  );

  const fetchOrders = useCallback(
    async (overridePage, overrideLimit) => {
      setLoading(true);
      try {
        const params = buildOrdersParams(overridePage, overrideLimit);
        const response = await getOrders(params);
        setOrders(response?.data?.data.orders || []);
        const apiPagination = response?.data?.data?.pagination || {};
        setOrderPagination({
          page: apiPagination.currentPage ?? apiPagination.page ?? 1,
          limit: apiPagination.itemsPerPage ?? apiPagination.limit ?? 10,
          total: apiPagination.totalItems ?? apiPagination.total ?? 0,
          totalPages: apiPagination.totalPages ?? 0,
        });
      } catch (err) {
        showError({
          title: err?.response?.data?.message || "Failed to fetch orders",
        });
      } finally {
        setLoading(false);
      }
    },
    [buildOrdersParams, showError, setOrderPagination]
  );

  // Fetch single order by ID
  const fetchOrderById = useCallback(
    async (id) => {
      setLoading(true);
      try {
        const response = await getOrderById(id);
        setSelectedOrder(response?.data?.data || null);
        return response?.data?.data;
      } catch (err) {
        showError({
          title:
            err?.response?.data?.message || "Failed to fetch order details",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [showError]
  );

  // Update order
  const handleUpdateOrder = useCallback(
    async (id, payload) => {
      setLoading(true);
      try {
        const response = await updateOrder(id, payload);
        await fetchOrders(); // Refresh list
        return response?.data;
      } catch (err) {
        showError({
          title: err?.response?.data?.message || "Failed to update order",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchOrders, showError]
  );

  // Mark as Picked Up
  const handleMarkAsPickedUp = useCallback(
    async (id) => {
      setLoading(true);
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
        setLoading(false);
      }
    },
    [fetchOrders, showError, showSuccess]
  );

  // Mark as Delivered
  const handleMarkAsDelivered = useCallback(
    async (id) => {
      setLoading(true);
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
        setLoading(false);
      }
    },
    [fetchOrders, showError, showSuccess]
  );

  // Mark as Completed
  const handleMarkAsCompleted = useCallback(
    async (id) => {
      setLoading(true);
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
        setLoading(false);
      }
    },
    [fetchOrders, showError, showSuccess]
  );

  // Mark as Confirmed
  const handleMarkAsConfirmed = useCallback(
    async (id) => {
      setLoading(true);
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
        setLoading(false);
      }
    },
    [fetchOrders, showError, showSuccess]
  );

  // Delete Order
  const handleDeleteOrder = useCallback(
    async (id) => {
      setLoading(true);
      try {
        const response = await deleteOrder(id);
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
          title: err?.response?.data?.message || "Failed to delete order",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchOrders, showError, showSuccess]
  );

  const handlePageChange = useCallback(
    (nextPage) => {
      setPage(nextPage);
      fetchOrders(nextPage, limit);
    },
    [fetchOrders, setPage, limit]
  );

  const handleLimitChange = useCallback(
    (nextLimit) => {
      setLimit(nextLimit);
      setPage(1);
      fetchOrders(1, nextLimit);
    },
    [fetchOrders, setLimit, setPage]
  );

  useEffect(() => {
    if (isFirstLoad.current) {
      fetchOrders();
      prevFiltersRef.current = { ...ordersFilters };
      isFirstLoad.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isFirstLoad.current) return;

    const prev = prevFiltersRef.current;
    const current = ordersFilters;

    const hasChanged =
      prev.date !== current.date ||
      prev.search !== current.search ||
      prev.status !== current.status;

    prevFiltersRef.current = { ...current };

    if (!hasChanged) return;

    const timeoutId = setTimeout(() => {
      fetchOrders();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [ordersFilters, fetchOrders]);

  return {
    orders,
    selectedOrder,
    page,
    limit,
    total,
    totalPages,
    loading,
    // actionLoading,
    ordersFilters,
    fetchOrders,
    fetchOrderById,
    handleUpdateOrder,
    handleMarkAsPickedUp,
    handleMarkAsDelivered,
    handleMarkAsCompleted,
    handleMarkAsConfirmed,
    handleDeleteOrder,
    handlePageChange,
    handleLimitChange,
  };
};
