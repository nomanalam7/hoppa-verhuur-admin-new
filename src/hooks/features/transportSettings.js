import { useState, useCallback, useEffect } from "react";
import {
  getTransportSetting,
  updateTransportSetting,
} from "../../api/modules/transportSetting";
import { useSuccessDialog } from "../../lib/context/successDialogContext";
import { useErrorDialog } from "../../lib/context/errorDialogContext";

const isSuccessStatus = (status) => status >= 200 && status < 300;

const useTransportSettings = () => {
  const [transportSettings, setTransportSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { showSuccess } = useSuccessDialog();
  const { showError } = useErrorDialog();

  const fetchTransportSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getTransportSetting();

      if (isSuccessStatus(response?.status)) {
        const settings = response.data.data;
        setTransportSettings(settings);
        return { success: true, data: settings };
      }

      return { success: false, message: response?.data?.message };
    } catch (error) {
      return { success: false, message: error?.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransportSettings();
  }, [fetchTransportSettings]);

  const updateTransportSettings = useCallback(
    async (payload) => {
      try {
        setIsSaving(true);
        const response = await updateTransportSetting(payload);

        if (isSuccessStatus(response?.status)) {
          // Refresh data after update
          await fetchTransportSettings();
          showSuccess({
            title: "Transportinstellingen opgeslagen.",
            subtitle: "Bezorgtarieven zijn bijgewerkt voor toekomstige orders.",
          });
          return { success: true, data: response?.data };
        }

        const message =
          response?.data?.message ||
          "Er is een fout opgetreden bij het opslaan van de instellingen.";
        showError({ title: message });
        return { success: false, message };
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Er is een fout opgetreden bij het opslaan van de instellingen.";
        showError({ title: errorMessage });
        return { success: false, message: errorMessage };
      } finally {
        setIsSaving(false);
      }
    },
    [fetchTransportSettings, showSuccess, showError]
  );

  return {
    transportSettings,
    isLoading,
    isSaving,
    updateTransportSettings,
  };
};

export default useTransportSettings;

