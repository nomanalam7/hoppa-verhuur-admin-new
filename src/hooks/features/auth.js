// src/hooks/useAuth.js
import { useState } from "react";
import {
  loginUser,
  forgotPassword,
  verifyOTP,
  resetPassword,
  getUser,
  updateUser,
  getAdminSettings,
  updateAdminSettings,
  changePassword,
} from "../../api/modules/authentication";
import useUserStore from "../../zustand/useUserStore";
import { useErrorDialog } from "../../lib/context/errorDialogContext";
import { useSuccessDialog } from "../../lib/context/successDialogContext";

export const useAuth = () => {
  const { setUserData } = useUserStore();
  const { showError } = useErrorDialog();
  const { showSuccess } = useSuccessDialog();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ===============================
  // 🔹 LOGIN HANDLER
  // ===============================
  const handleLogin = async (values) => {
    setError("");
    setLoading(true);
    try {
      const response = await loginUser(values);
      const isSuccess = response?.status >= 200 && response?.status < 300;

      if (!isSuccess) {
        throw new Error(response?.data?.message || "Login failed");
      }

      const payload = response?.data?.data;
      setUserData({ admin: payload?.admin });
      localStorage.setItem("token", payload?.token);

      return {
        success: true,
        message: response?.data?.message,
        data: payload,
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
  };

  // ===============================
  // 🔹 FORGOT PASSWORD HANDLER
  // ===============================
  const handleForgotPassword = async (email) => {
    setError("");
    setLoading(true);
    try {
      const response = await forgotPassword({ email });
      const isSuccess = response?.status >= 200 && response?.status < 300;

      if (!isSuccess) {
        throw new Error(response?.data?.message || "Failed to send reset link");
      }

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
  };

  // ===============================
  // 🔹 VERIFY OTP HANDLER
  // ===============================
  const handleVerifyOTP = async (values) => {
    setError("");
    setLoading(true);
    try {
      const response = await verifyOTP(values);
      const isSuccess = response?.status >= 200 && response?.status < 300;

      if (!isSuccess) {
        throw new Error(response?.data?.message || "OTP verification failed");
      }

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
  };

  // ===============================
  // 🔹 RESET PASSWORD HANDLER
  // ===============================
  const handleResetPassword = async (values) => {
    setError("");
    setLoading(true);
    try {
      const response = await resetPassword(values);
      const isSuccess = response?.status >= 200 && response?.status < 300;

      if (!isSuccess) {
        throw new Error(response?.data?.message || "Password reset failed");
      }

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
  };

  // ===============================
  // 🔹 GET USER DETAILS HANDLER
  // ===============================
  const handleGetUserDetails = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await getUser();
      const isSuccess = response?.status >= 200 && response?.status < 300;

      if (!isSuccess) {
        throw new Error(
          response?.data?.message || "Failed to get user details"
        );
      }

      const payload = response?.data?.data;
      return {
        success: true,
        message: response?.data?.message,
        data: payload,
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
  };

  // ===============================
  // 🔹 UPDATE USER HANDLER
  // ===============================
  const handleUserUpdate = async (values) => {
    setError("");
    setLoading(true);
    try {
      const response = await updateUser(values);
      const isSuccess = response?.status >= 200 && response?.status < 300;

      if (!isSuccess) {
        throw new Error(response?.data?.message || "Failed to update user");
      }

      const payload = response?.data?.data;
      handleGetUserDetails();

      showSuccess({
        title: response?.data?.message || "User updated successfully",
      });

      return {
        success: true,
        message: response?.data?.message,
        data: payload,
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
  };

  // ===============================
  // 🔹 GET ADMIN SETTINGS HANDLER
  // ===============================
  const handleGetAdminSettings = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await getAdminSettings();
      const isSuccess = response?.status >= 200 && response?.status < 300;

      if (!isSuccess) {
        throw new Error(
          response?.data?.message || "Failed to get admin settings"
        );
      }

      const payload = response?.data?.data;
      return {
        success: true,
        message: response?.data?.message,
        data: payload,
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
  };

  // ===============================
  // 🔹 UPDATE ADMIN SETTINGS HANDLER
  // ===============================
  const handleUpdateAdminSettings = async (values) => {
    setError("");
    setLoading(true);
    try {
      const response = await updateAdminSettings(values);
      const isSuccess = response?.status >= 200 && response?.status < 300;

      if (!isSuccess) {
        throw new Error(
          response?.data?.message || "Failed to update admin settings"
        );
      }

      const payload = response?.data?.data;

      showSuccess({
        title: response?.data?.message || "Admin settings updated successfully",
      });

      return {
        success: true,
        message: response?.data?.message,
        data: payload,
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
  };

  // ===============================
  // 🔹 CHANGE PASSWORD HANDLER
  // ===============================
  const handleChangePassword = async (values) => {
    setError("");
    setLoading(true);
    try {
      const response = await changePassword(values);
      const isSuccess = response?.status >= 200 && response?.status < 300;

      if (!isSuccess) {
        throw new Error(
          response?.data?.message || "Failed to change password"
        );
      }

      const payload = response?.data?.data;

      showSuccess({
        title: response?.data?.message || "Wachtwoord bijgewerkt.",
        subtitle: "Je kunt nu inloggen met je nieuwe gegevens.",
      });

      return {
        success: true,
        message: response?.data?.message,
        data: payload,
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
  };

  // ===============================
  // 🔹 RETURN ALL AUTH HANDLERS
  // ===============================
  return {
    handleLogin,
    handleForgotPassword,
    handleVerifyOTP,
    handleResetPassword,
    handleGetUserDetails,
    handleUserUpdate,
    handleGetAdminSettings,
    handleUpdateAdminSettings,
    handleChangePassword,
    loading,
    error,
  };
};
