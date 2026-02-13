import { Box, Typography } from "@mui/material";
import {
  forwardRef,
  useState,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import useVATSettings from "../../../../hooks/features/vatSettings";
import { CustomButton, CustomDrawer, TextInput } from "../../../../components";

const VATSettingDrawer = forwardRef((props, ref) => {
  const drawerRef = useRef(null);
  const [vatPercentage, setVatPercentage] = useState("");

  const { vatTransportSettings, isLoading, isSaving, updateVatTransportSettings } =
    useVATSettings();

  let vatSettings = vatTransportSettings

  console.log(vatSettings, "vattttttttttttttttttttttttt")

  useEffect(() => {
    if (vatSettings) {
      setVatPercentage(vatSettings?.vatPercentage ?? "");
    }
  }, [vatSettings]);

  const handleSave = async () => {
    const payload = {
      ...vatSettings,
      vatPercentage: Number(vatPercentage) || 0,
    };

    const result = await updateVatTransportSettings(payload);

    if (result.success) {
      drawerRef.current?.closeDrawer();
    }
  };

  useImperativeHandle(ref, () => ({
    openDrawer: () => drawerRef.current?.openDrawer(),
    closeDrawer: () => drawerRef.current?.closeDrawer(),
  }));

  const exampleBase = 100;
  const exampleDelivery = 25;
  const exampleService = 26;
  const exampleTotal = exampleBase + exampleDelivery + exampleService;
  const exampleVAT = (exampleTotal * (Number(vatPercentage) || 21)) / 100;

  return (
    <CustomDrawer
      title="VAT Instellingen"
      ref={drawerRef}
      handleClose={() => drawerRef.current?.closeDrawer()}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pb: 4 }}>
        <Box>
          {/* <Typography fontSize="16px" fontWeight={600} mb={2}>
            VAT Percentage
          </Typography> */}
          <TextInput
            showLabel="Percentage"
            type="number"
            placeholder="21"
            value={vatPercentage}
            onChange={(e) => {
              const value = e.target.value;
              if (value >= 0) {
                setVatPercentage(value);
              }
            }}
            min={0} // ye HTML input ko bhi restrict karega
            disabled={isLoading || isSaving}
          />

          <Typography fontSize="12px" color="#6B7280" mt={1}>
            Dit VAT wordt automatisch toegepast op alle boekingen.
          </Typography>

          <Box
            sx={{
              backgroundColor: "#F3F4F6",
              padding: 2,
              borderRadius: 1,
              mt: 2,
            }}
          >
            <Typography fontSize="12px" color="#374151" mb={1}>
              <strong>Voorbeeld:</strong> Een BTW van {vatPercentage || "21"}%
              wordt toegepast op het totale boekingsbedrag, inclusief service- en
              bezorgkosten.
            </Typography>
            <Typography fontSize="12px" color="#374151">
              Bijvoorbeeld: €{exampleBase} basisprijs + €{exampleDelivery} bezorging + €
              {exampleService} service = €{exampleTotal} totaal, dus €
              {exampleVAT.toFixed(2)} BTW wordt toegevoegd
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CustomButton
            btnLabel="Instellingen opslaan"
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

VATSettingDrawer.displayName = "VATSettingDrawer";

export default VATSettingDrawer;
