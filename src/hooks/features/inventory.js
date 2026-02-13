import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getInventory,
  getInventoryById,
  addInventory,
  updateInventory,
  deleteInventory,
  fetchCategories,
  getInventoryStats,
} from "../../api/modules/inventoryApi";
import { useErrorDialog } from "../../lib/context/errorDialogContext";
import { useSuccessDialog } from "../../lib/context/successDialogContext";
import useInventorySlice from "../../zustand/inventorySlice";
import useFilterSliceKey from "../../zustand/filter_slice_key";
import { FILTER_MODES } from "../../utils/filterConfig";

export const useInventory = () => {
  const { showError } = useErrorDialog();
  const { showSuccess } = useSuccessDialog();
  const { setPagination, page, limit } = useInventorySlice();
  const { filters } = useFilterSliceKey();

  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [error, setError] = useState("");
  const [inventoryData, setInventoryData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [inventoryStats, setInventoryStats] = useState({});

  // Memoize inventory filters to prevent unnecessary re-renders
  const inventoryFilters = useMemo(
    () => filters[FILTER_MODES.TENT_INVENTORY] || {},
    [filters]
  );

  // ===============================
  // 🔹 GET INVENTORY (with filters & pagination)
  // ===============================
  const handleGetInventory = useCallback(
    async (customParams = {}) => {
      setError("");
      setLoading(true);
      try {
        // Build params with filters and pagination
        const params = {
          page: customParams.page ?? page,
          limit: customParams.limit ?? limit,

          ...(inventoryFilters.search && {
            search: inventoryFilters.search,
          }),

          ...(inventoryFilters.category && {
            category: inventoryFilters.category,
          }),

          ...(inventoryFilters.status !== undefined && {
            status: inventoryFilters.status,
          }),

          ...customParams, // Allow override
        };


        const response = await getInventory(params);
        const isSuccess = response?.status >= 200 && response?.status < 300;

        if (!isSuccess) {
          throw new Error(
            response?.data?.message || "Failed to fetch inventory"
          );
        }

        const data = response?.data.data || {};
        console.log("data", data);
        const items = data;

        if (data.pagination) {
          setPagination({
            page: data.pagination.page ?? page,
            limit: data.pagination.limit ?? limit,
            total: data.pagination.total ?? items.length,
            totalPages:
              data.pagination.totalPages ??
              Math.ceil(
                (data.pagination.total ?? items.length) /
                (data.pagination.limit ?? limit)
              ),
          });
        }

        setInventoryData(items);

        return {
          success: true,
          message: response?.data?.message,
          data: items,
          pagination: data.pagination,
        };
      } catch (err) {
        const message = err?.response?.data?.message || err.message;
        setError(message);
        showError({
          title: message,
        });
        return { success: false, message, data: [] };
      } finally {
        setLoading(false);
      }
    },
    [page, limit, inventoryFilters, setPagination, showError]
  );

  // ===============================
  // 🔹 ADD INVENTORY
  // ===============================
  const handleAddInventory = useCallback(
    async (payload) => {
      setError("");
      setLoading(true);
      try {
        const response = await addInventory(payload);
        const isSuccess = response?.status >= 200 && response?.status < 300;

        if (!isSuccess) {
          throw new Error(response?.data?.message || "Failed to add inventory");
        }

        showSuccess({
          title: response?.data?.message || "Item successfully added",
        });

        // Refetch inventory after adding
        await handleGetInventory();

        return {
          success: true,
          message: response?.data?.message,
          data: response?.data?.data,
        };
      } catch (err) {
        const message = err?.response?.data?.message || err.message;
        setError(message);
        showError({
          title: message,
        });
        return { success: false, message };
      } finally {
        setLoading(false);
      }
    },
    [handleGetInventory, showSuccess, showError]
  );

  // ===============================
  // 🔹 UPDATE INVENTORY
  // ===============================
  const handleUpdateInventory = useCallback(
    async (id, payload) => {
      setError("");
      setLoading(true);
      try {
        const response = await updateInventory(id, payload);
        const isSuccess = response?.status >= 200 && response?.status < 300;

        if (!isSuccess) {
          throw new Error(
            response?.data?.message || "Failed to update inventory"
          );
        }

        showSuccess({
          title: response?.data?.message || "Item successfully updated",
        });

        // Refetch inventory after updating
        await handleGetInventory();

        return {
          success: true,
          message: response?.data?.message,
          data: response?.data?.data,
        };
      } catch (err) {
        const message = err?.response?.data?.message || err.message;
        setError(message);
        showError({
          title: message,
        });
        return { success: false, message };
      } finally {
        setLoading(false);
      }
    },
    [handleGetInventory, showSuccess, showError]
  );

  // ===============================
  // 🔹 DELETE INVENTORY
  // ===============================
  const handleDeleteInventory = useCallback(
    async (id) => {
      setError("");
      setLoading(true);
      try {
        const response = await deleteInventory(id);
        const isSuccess = response?.status >= 200 && response?.status < 300;

        if (!isSuccess) {
          throw new Error(
            response?.data?.message || "Failed to delete inventory"
          );
        }

        showSuccess({
          title: response?.data?.message || "Item successfully deleted",
        });

        // Refetch inventory after deleting
        await handleGetInventory();

        return {
          success: true,
          message: response?.data?.message,
        };
      } catch (err) {
        const message = err?.response?.data?.message || err.message;
        setError(message);
        showError({
          title: message,
        });
        return { success: false, message };
      } finally {
        setLoading(false);
      }
    },
    [handleGetInventory, showSuccess, showError]
  );

  // ===============================
  // 🔹 GET INVENTORY BY ID
  // ===============================

  const handleGetInventoryById = useCallback(
    async (id) => {
      setError("");
      setLoading(true);
      try {
        const response = await getInventoryById(id);
        const isSuccess = response?.status >= 200 && response?.status < 300;

        if (!isSuccess) {
          throw new Error(
            response?.data?.message || "Failed to fetch inventory item"
          );
        }

        const data = response?.data?.data || {};

        return {
          success: true,
          message: response?.data?.message,
          data: data,
        };
      } catch (err) {
        const message = err?.response?.data?.message || err.message;
        setError(message);
        showError({
          title: message,
        });
        return { success: false, message, data: null };
      } finally {
        setLoading(false);
      }
    },
    [showError]
  );

  // ===============================
  // 🔹 FETCH CATEGORIES
  // ===============================
  const handleFetchCategories = useCallback(async () => {
    setError("");
    setCategoriesLoading(true);
    try {
      const response = await fetchCategories();
      const isSuccess = response?.status >= 200 && response?.status < 300;

      if (!isSuccess) {
        throw new Error(
          response?.data?.message || "Failed to fetch categories"
        );
      }

      const data = response?.data?.data || [];
      setCategories(data);

      return {
        success: true,
        message: response?.data?.message,
        data: data,
      };
    } catch (err) {
      const message = err?.response?.data?.message || err.message;
      setError(message);
      showError({
        title: message,
      });
      return { success: false, message, data: [] };
    } finally {
      setCategoriesLoading(false);
    }
  }, [showError]);

  const handleGetInventoryStats = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const response = await getInventoryStats();
      const isSuccess = response?.status >= 200 && response?.status < 300;

      if (!isSuccess) {
        throw new Error(
          response?.data?.message || "Failed to fetch inventory stats"
        );
      }

      const data = response?.data?.data || {};
      setInventoryStats(data);

      return {
        success: true,
        message: response?.data?.message,
        data: data,
      };
    } catch (err) {
      const message = err?.response?.data?.message || err.message;
      setError(message);
      showError({
        title: message,
      });
      return { success: false, message, data: [] };
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // ===============================
  // 🔹 AUTO FETCH ON MOUNT & FILTER/PAGINATION CHANGE
  // ===============================
  useEffect(() => {
    handleGetInventory();
  }, [handleGetInventory]);

  useEffect(() => {
    handleFetchCategories();
  }, [handleFetchCategories]);

  // ===============================
  // 🔹 RETURN ALL INVENTORY HANDLERS
  // ===============================
  return {
    handleGetInventory,
    handleGetInventoryById,
    handleAddInventory,
    handleUpdateInventory,
    handleDeleteInventory,
    handleFetchCategories,
    inventoryData,
    categories,
    loading,
    categoriesLoading,
    error,
    inventoryStats,
    handleGetInventoryStats,
  };
};
