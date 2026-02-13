import { useState, useCallback, useEffect } from "react";
import {
  getVatTransportSetting,
  updateVatTransportSetting,
} from "../../api/modules/transportSetting";
import { useSuccessDialog } from "../../lib/context/successDialogContext";
import { useErrorDialog } from "../../lib/context/errorDialogContext";
import useVatStore from "../../zustand/useVatStore";

const isSuccessStatus = (status) => status >= 200 && status < 300;

const useVatTransportSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { showSuccess } = useSuccessDialog();
  const { showError } = useErrorDialog();
  const { vatSettings, setVatSettings } = useVatStore();

  const fetchVatTransportSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getVatTransportSetting();

      if (isSuccessStatus(response?.status)) {
        const settings = response.data.data;
        // Update Zustand store
        setVatSettings(settings);
        return { success: true, data: settings };
      }

      return { success: false, message: response?.data?.message };
    } catch (error) {
      return { success: false, message: error?.message };
    } finally {
      setIsLoading(false);
    }
  }, [setVatSettings]);

  useEffect(() => {
    // If we don't have VAT settings in store, fetch from API
    if (!vatSettings) {
      fetchVatTransportSettings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const updateVatTransportSettings = useCallback(
    async (payload) => {
      try {
        setIsSaving(true);
        const response = await updateVatTransportSetting(payload);

        if (isSuccessStatus(response?.status)) {
          // Refresh data from API after update to ensure consistency
          await fetchVatTransportSettings();
          showSuccess({
            title: "BTW transportinstellingen opgeslagen.",
            subtitle:
              "BTW bezorgtarieven zijn bijgewerkt voor toekomstige orders.",
          });
          return { success: true, data: response?.data };
        }

        const message =
          response?.data?.message ||
          "Er is een fout opgetreden bij het opslaan van de BTW instellingen.";
        showError({ title: message });
        return { success: false, message };
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Er is een fout opgetreden bij het opslaan van de BTW instellingen.";
        showError({ title: errorMessage });
        return { success: false, message: errorMessage };
      } finally {
        setIsSaving(false);
      }
    },
    [fetchVatTransportSettings, showSuccess, showError]
  );

  return {
    vatTransportSettings: vatSettings,
    isLoading,
    isSaving,
    updateVatTransportSettings,
  };
};

export default useVatTransportSettings;
