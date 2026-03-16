import { useState, useEffect, useCallback } from "react";
import {
  getBlogs,
  getBlogById,
  addBlog,
  updateBlog,
  deleteBlog,
} from "../../api/modules/blogApi";
import { useErrorDialog } from "../../lib/context/errorDialogContext";
import { useSuccessDialog } from "../../lib/context/successDialogContext";

export const useBlog = () => {
  const { showError } = useErrorDialog();
  const { showSuccess } = useSuccessDialog();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [blogData, setBlogData] = useState([]);

  // ===============================
  // 🔹 GET BLOGS (fetch all)
  // ===============================
  const handleGetBlogs = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const response = await getBlogs();
      const isSuccess = response?.status >= 200 && response?.status < 300;

      if (!isSuccess) {
        throw new Error(response?.data?.message || "Failed to fetch blogs");
      }

      const data = response?.data?.data || [];
      setBlogData(Array.isArray(data) ? data : []);

      return {
        success: true,
        message: response?.data?.message,
        data: Array.isArray(data) ? data : [],
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
  // 🔹 GET BLOG BY ID
  // ===============================
  const handleGetBlogById = useCallback(
    async (id) => {
      setLoading(true);
      try {
        const response = await getBlogById(id);
        const isSuccess = response?.status >= 200 && response?.status < 300;

        if (!isSuccess) {
          throw new Error(response?.data?.message || "Failed to fetch blog");
        }

        return {
          success: true,
          data: response?.data?.data || null,
        };
      } catch (err) {
        const message = err?.response?.data?.message || err.message;
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
  // 🔹 ADD BLOG
  // ===============================
  const handleAddBlog = useCallback(
    async (payload) => {
      setError("");
      setLoading(true);
      try {
        const response = await addBlog(payload);
        const isSuccess = response?.status >= 200 && response?.status < 300;

        if (!isSuccess) {
          throw new Error(response?.data?.message || "Failed to add blog");
        }

        showSuccess({
          title: response?.data?.message || "Blog successfully added",
        });

        // Refetch blogs after adding
        await handleGetBlogs();

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
    [showError, showSuccess, handleGetBlogs]
  );

  // ===============================
  // 🔹 UPDATE BLOG
  // ===============================
  const handleUpdateBlog = useCallback(
    async (id, payload) => {
      setError("");
      setLoading(true);
      try {
        const response = await updateBlog(id, payload);
        const isSuccess = response?.status >= 200 && response?.status < 300;

        if (!isSuccess) {
          throw new Error(response?.data?.message || "Failed to update blog");
        }

        showSuccess({
          title: response?.data?.message || "Blog successfully updated",
        });

        // Refetch blogs after updating
        await handleGetBlogs();

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
    [showError, showSuccess, handleGetBlogs]
  );

  // ===============================
  // 🔹 DELETE BLOG
  // ===============================
  const handleDeleteBlog = useCallback(
    async (id) => {
      setError("");
      setLoading(true);
      try {
        const response = await deleteBlog(id);
        const isSuccess = response?.status >= 200 && response?.status < 300;

        if (!isSuccess) {
          throw new Error(response?.data?.message || "Failed to delete blog");
        }

        showSuccess({
          title: response?.data?.message || "Blog successfully deleted",
        });

        // Refetch blogs after deleting
        await handleGetBlogs();

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
    [showError, showSuccess, handleGetBlogs]
  );

  // Auto-fetch on mount
  useEffect(() => {
    handleGetBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    blogData,
    loading,
    error,
    handleGetBlogs,
    handleGetBlogById,
    handleAddBlog,
    handleUpdateBlog,
    handleDeleteBlog,
  };
};
