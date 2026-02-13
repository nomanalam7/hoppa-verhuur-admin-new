import { useCallback, useState } from "react";
import {
  getOrderById,
  updateOrder,
  markAsPickedUpOrder,
  markAsDeliveredOrder,
  markAsCompletedOrder,
  markAsConfirmedOrder,
  deleteOrder,
  addAdminNotes,
} from "../../api/modules/order";
import { useErrorDialog } from "../../lib/context/errorDialogContext";
import { useSuccessDialog } from "../../lib/context/successDialogContext";

export const useOrderDetails = () => {
  const { showError } = useErrorDialog();
  const { showSuccess } = useSuccessDialog();

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
      setActionLoading(true);
      try {
        const response = await updateOrder(id, payload);
        if (response?.status === 200 || response.status === 201) {
          await fetchOrderById(id); // Refresh selected order
          showSuccess({
            title: response.data.message,
          });
        } else {
          showError({
            title: response?.data?.error || "Failed to update order",
          });
        }
        return response?.data;
      } catch (err) {
        showError({
          title: err?.response?.data?.message || "Failed to update order",
        });
        return null;
      } finally {
        setActionLoading(false);
      }
    },
    [fetchOrderById, showError, showSuccess]
  );

  // Mark as Picked Up
  const handleMarkAsPickedUp = useCallback(
    async (id) => {
      setActionLoading(true);
      try {
        const response = await markAsPickedUpOrder(id);
        if (response?.status === 200 || response.status === 201) {
          await fetchOrderById(id); // Refresh selected order
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
        setActionLoading(false);
      }
    },
    [fetchOrderById, showError, showSuccess]
  );

  // Mark as Delivered
  const handleMarkAsDelivered = useCallback(
    async (id) => {
      setActionLoading(true);
      try {
        const response = await markAsDeliveredOrder(id);
        if (response?.status === 200 || response.status === 201) {
          await fetchOrderById(id); // Refresh selected order
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
        setActionLoading(false);
      }
    },
    [fetchOrderById, showError, showSuccess]
  );

  // Mark as Completed
  const handleMarkAsCompleted = useCallback(
    async (id) => {
      setActionLoading(true);
      try {
        const response = await markAsCompletedOrder(id);
        if (response?.status === 200 || response.status === 201) {
          await fetchOrderById(id); // Refresh selected order
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
        setActionLoading(false);
      }
    },
    [fetchOrderById, showError, showSuccess]
  );

  // Mark as Confirmed
  const handleMarkAsConfirmed = useCallback(
    async (id) => {
      setActionLoading(true);
      try {
        const response = await markAsConfirmedOrder(id);
        if (response?.status === 200 || response.status === 201) {
          await fetchOrderById(id); // Refresh selected order
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
        setActionLoading(false);
      }
    },
    [fetchOrderById, showError, showSuccess]
  );

  // Delete Order
  const handleDeleteOrder = useCallback(
    async (id) => {
      setActionLoading(true);
      try {
        const response = await deleteOrder(id);
        if (response?.status === 200 || response.status === 201) {
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
        setActionLoading(false);
      }
    },
    [showError, showSuccess, fetchOrderById]
  );

  // Add Admin Notes
  const handleAddAdminNotes = useCallback(
    async (id, payload) => {
      setActionLoading(true);
      try {
        const response = await addAdminNotes(id, payload);
        if (response?.status === 200 || response.status === 201) {
          await fetchOrderById(id); // Refresh selected order
          showSuccess({
            title: response.data.message,
          });
        } else {
          showError({
            title: response.data.message,
          });
        }
      } catch (err) {
        showError({
          title: err?.response?.data?.message || "Failed to add admin notes",
        });
        return null;
      } finally {
        setActionLoading(false);
      }
    },
    [showError, showSuccess, fetchOrderById]
  );

  return {
    selectedOrder,
    loading,
    actionLoading,
    fetchOrderById,
    handleUpdateOrder,
    handleMarkAsPickedUp,
    handleMarkAsDelivered,
    handleMarkAsCompleted,
    handleMarkAsConfirmed,
    handleDeleteOrder,
    handleAddAdminNotes,
  };
};
