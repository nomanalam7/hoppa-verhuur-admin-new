import { Box, Typography } from "@mui/material";
import {
  forwardRef,
  useState,
  useEffect,
  useImperativeHandle,
  useRef,
  useCallback,
} from "react";
import useTransportSettings from "../../../../hooks/features/transportSettings";
import { CustomButton, CustomDrawer, TextInput } from "../../../../components";
import useVatStore from "../../../../zustand/useVatStore";

const TransportSettingDrawer = forwardRef((props, ref) => {
  const drawerRef = useRef(null);
  const [deliveryRate, setDeliveryRate] = useState("");
  const [freeRadius, setFreeRadius] = useState("");

  const { transportSettings, isLoading, isSaving, updateTransportSettings } =
    useTransportSettings();
  const { getVatPercentage } = useVatStore();

  const calculatePriceWithVat = useCallback((price) => {
    if (!price || price === "") return null;

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) return null;

    const vatPercentage = getVatPercentage(); // 21

    return priceNum * (1 + vatPercentage / 100);
  }, [getVatPercentage]);


  useEffect(() => {
    if (transportSettings) {
      // Load the rate WITHOUT VAT for the input field
      setDeliveryRate(transportSettings?.deliveryRateExculudingVat ?? transportSettings?.deliveryRateExcludingVat ?? "");
      setFreeRadius(transportSettings?.freeDeliveryRadius ?? "");
    }
  }, [transportSettings]);

  const handleSave = async () => {
    const payload = {
      deliveryRate: calculatePriceWithVat(deliveryRate) || 0,  // including vat
      freeDeliveryRadius: freeRadius || 0, // including vat
      deliveryRateExculudingVat: Number(deliveryRate) || 0, // excluding vat
    };

    const result = await updateTransportSettings(payload);

    if (result.success) {
      drawerRef.current?.closeDrawer();
    }
  };

  useImperativeHandle(ref, () => ({
    openDrawer: () => drawerRef.current?.openDrawer(),
    closeDrawer: () => drawerRef.current?.closeDrawer(),
  }));

  return (
    <CustomDrawer
      title="Transportinstellingen"
      ref={drawerRef}
      handleClose={() => drawerRef.current?.closeDrawer()}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pb: 4 }}>
        <Box>
          <TextInput
            showLabel="Bezorgtarief per KM instellen"
            type="number"
            placeholder="0.75"
            value={deliveryRate}
            onChange={(e) => {
              const value = parseFloat(e.target.value); 
              if (!isNaN(value) && value >= 0) {        // negative value ya invalid number block kare
                setDeliveryRate(value);
              } else if (e.target.value === '') {       // input clear karne par allow kare
                setDeliveryRate('');
              }
            }}
            min={0}
            step={0.01}   // decimal support ke liye
            disabled={isLoading || isSaving}
          />

          <Typography fontSize="12px" color="#6B7280" mt={1}>
            Dit tarief wordt automatisch toegepast op alle bezorgbestellingen.
          </Typography>

          {deliveryRate && calculatePriceWithVat(deliveryRate) && (
            <Typography fontSize="12px" color="#6B7280" mt={0.5} ml={1.5}>
              Inclusief BTW: €{calculatePriceWithVat(deliveryRate).toFixed(2)}/km
            </Typography>
          )}

          <Box
            sx={{
              backgroundColor: "#F3F4F6",
              padding: 2,
              borderRadius: 1,
              mt: 2,
            }}
          >
            <Typography fontSize="12px" color="#374151">
              <strong>Voorbeeld:</strong> Voor een bezorging van 15 km met
              tarief €{deliveryRate || "0.75"}/km:
            </Typography>
            <Typography fontSize="12px" color="#374151">
              Bezorgkosten = €
              {((Number(deliveryRate) || 0.75) * 15).toFixed(2)} (retour)
            </Typography>
            {deliveryRate && calculatePriceWithVat(deliveryRate) && (
              <Typography fontSize="12px" color="#374151" mt={0.5}>
                Inclusief BTW: €
                {(calculatePriceWithVat(deliveryRate) * 15).toFixed(2)} (retour)
              </Typography>
            )}
          </Box>
        </Box>

        <Box>
          <Typography fontSize="16px" fontWeight={600} mb={2} color="#030229">
            Gratis Bezorgradius
          </Typography>
          <TextInput
            // showLabel="Km"
            type="number"
            placeholder="5"
            value={freeRadius}
            onChange={(e) => {
              const value = parseFloat(e.target.value); // string ko number me convert kare
              if (!isNaN(value) && value >= 0) {        // negative value block kare
                setFreeRadius(value);
              } else if (e.target.value === '') {       // input clear karne par allow kare
                setFreeRadius('');
              }
            }}
            min={0}
            step={0.01}   // decimal input allow kare, optional
            disabled={isLoading || isSaving}
          />

          <Typography fontSize="12px" color="#6B7280" mt={1}>
            Opmerking: Gratis bezorging geldt voor alle klanten binnen de
            ingevoerde KM-straal.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CustomButton
            btnLabel="Instelling opslaan"
            handlePressBtn={handleSave}
            variant="gradient"
            loading={isSaving}
            disabled={isSaving || isLoading}
            sx={{ width: "100%" }}
          />
        </Box>
      </Box>
    </CustomDrawer>
  );
});

TransportSettingDrawer.displayName = "TransportSettingDrawer";

export default TransportSettingDrawer;
