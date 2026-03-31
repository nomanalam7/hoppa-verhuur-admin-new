import React, { useEffect, useMemo, useState } from "react";
import { Alert, Box, Checkbox, CircularProgress, FormControlLabel, Grid, IconButton, Paper, Typography } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { format as formatDateFns } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import GlobalStyle from "../../../../style/style";
import { CustomButton, CustomInputLabel, TextInput } from "../../../../components";
import GooglePlacesInput from "../../../../components/googlePlaceInput";
import RadioButtonGroup from "../../../../components/radioButtonGroup";
import AddItemsDialog from "../../orderDetails/addItemsDialog";
import { getOrderById, updateOrderAdmin } from "../../../../api/modules/order";
import { useErrorDialog } from "../../../../lib/context/errorDialogContext";
import { useSuccessDialog } from "../../../../lib/context/successDialogContext";
import useVatStore from "../../../../zustand/useVatStore";
const toDateInputValue = (value) => {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
};
const dateFromYmd = (v) => (!v ? null : new Date(`${v}T00:00:00`));
const ymdFromDate = (d) => (!d || Number.isNaN(d.getTime()) ? "" : formatDateFns(d, "yyyy-MM-dd"));
const timeToDate = (hhMm) => (!hhMm ? null : new Date(`2000-01-01T${hhMm}:00`));
const hhMmFromDate = (d) => (!d || Number.isNaN(d.getTime()) ? "" : formatDateFns(d, "HH:mm"));
const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
const toFixed2 = (v) => toNumber(v).toFixed(2);
const safeString = (v) => (v ?? "").toString();
const deepEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const extractOrder = (res) => res?.data?.order || res?.data?.data?.order || res?.data?.data || res?.data || null;

const parseTimeWindow = (value) => {
  if (!value || typeof value !== "string") return { start: "", end: "" };
  if (!value.includes("-")) return { start: value.trim(), end: "" };
  const [start, end] = value.split("-");
  return { start: (start || "").trim(), end: (end || "").trim() };
};
const buildTimeWindow = (start, end) => {
  const s = (start || "").trim();
  const e = (end || "").trim();
  if (s && e) return `${s}-${e}`;
  return s;
};

const normalizeOrder = (raw) => {
  const order = raw || {};
  const serviceFees = order?.serviceFees || {};
  return {
    orderId: safeString(order?.orderId || order?._id || ""),
    customerDetails: {
      firstName: safeString(order?.customerDetails?.firstName),
      lastName: safeString(order?.customerDetails?.lastName),
      email: safeString(order?.customerDetails?.email),
      phoneNumber: safeString(order?.customerDetails?.phoneNumber),
    },
    city: safeString(order?.city),
    pickupDeliveryType: safeString(order?.pickupDeliveryType || "self"),
    deliveryAddress: safeString(order?.deliveryAddress),
    deliveryLat: toNumber(order?.deliveryLat),
    deliveryLong: toNumber(order?.deliveryLong),
    deliveryDate: toDateInputValue(order?.deliveryDate),
    deliveryTime: safeString(order?.deliveryTime),
    pickupAddress: safeString(order?.pickupAddress),
    pickupLat: toNumber(order?.pickupLat),
    pickupLong: toNumber(order?.pickupLong),
    pickupDate: toDateInputValue(order?.pickupDate),
    pickupTime: safeString(order?.pickupTime),
    includeServiceFee: Boolean(order?.includeServiceFee ?? true),
    rentalItems: Array.isArray(order?.rentalItems)
      ? order.rentalItems.map((item, idx) => ({
          productId: safeString(item?.productId || item?._id || `new-${idx}`),
          productName: safeString(item?.productName || item?.name),
          quantity: toNumber(item?.quantity || 1),
          pricePerDay: toNumber(item?.pricePerDay || 0),
          pricePerDayExclVAT: toNumber(
            item?.pricePerDayExclVAT ??
              item?.pricePerDayExclVat ??
              item?.pricePerDayExcl ??
              item?.pricePerDay
          ),
        }))
      : [],
    transportCost: toNumber(order?.transportCost),
    transportCostExclVAT: toNumber(order?.transportCostExclVAT),
    serviceFees: {
      baseServiceFee: toNumber(serviceFees?.baseServiceFee),
      eveningServiceFee: toNumber(serviceFees?.eveningServiceFee),
      morningServiceFee: toNumber(serviceFees?.morningServiceFee),
      total: toNumber(serviceFees?.total),
      breakdown: Array.isArray(serviceFees?.breakdown) ? serviceFees.breakdown : [],
    },
    distance: toNumber(order?.distance),
    originalDistance: toNumber(order?.originalDistance),
    freeDeliveryRadius: toNumber(order?.freeDeliveryRadius),
  };
};

const getFeeTypeFromPickupTime = (pickupTime) => {
  const hour = Number((safeString(pickupTime).split("-")[0] || "").split(":")[0]);
  if (!Number.isFinite(hour)) return "baseServiceFee";
  if (hour >= 18) return "eveningServiceFee";
  if (hour < 12) return "morningServiceFee";
  return "baseServiceFee";
};

const EditOrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showError } = useErrorDialog();
  const { showSuccess } = useSuccessDialog();

  const vatPercentage = Number(useVatStore.getState().getVatPercentage() || 21);
  const vatMultiplier = useMemo(() => 1 + vatPercentage / 100, [vatPercentage]);

  const [loading, setLoading] = useState(true);
  const [sameAsDelivery, setSameAsDelivery] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [savingField, setSavingField] = useState("");
  const [order, setOrder] = useState(normalizeOrder(null));
  const [baselineOrder, setBaselineOrder] = useState(normalizeOrder(null));

  const deliveryParts = parseTimeWindow(order.deliveryTime);
  const pickupParts = parseTimeWindow(order.pickupTime);
  const hasDeliveryRange = order.deliveryTime.includes("-");
  const hasPickupRange = order.pickupTime.includes("-");
  const applicableFeeType = useMemo(() => getFeeTypeFromPickupTime(order.pickupTime), [order.pickupTime]);

  useEffect(() => {
    const run = async () => {
      if (!id) return;
      setLoading(true);
      const response = await getOrderById(id);
      const normalized = normalizeOrder(extractOrder(response));
      if (!normalized.orderId) {
        showError({ title: response?.data?.message || "Bestelgegevens ophalen mislukt" });
        setLoading(false);
        return;
      }
      setOrder(normalized);
      setBaselineOrder(normalized);
      setLoading(false);
    };
    run();
  }, [id, showError]);

  useEffect(() => {
    if (order.deliveryAddress && order.pickupAddress && order.deliveryAddress === order.pickupAddress) {
      setSameAsDelivery(true);
    }
  }, [order.deliveryAddress, order.pickupAddress]);

  const setValue = (key, value) => setOrder((p) => ({ ...p, [key]: value }));
  const setCustomer = (key, value) => setOrder((p) => ({ ...p, customerDetails: { ...p.customerDetails, [key]: value } }));
  const setItem = (index, key, value) =>
    setOrder((p) => {
      const next = [...p.rentalItems];
      if (key === "pricePerDayExclVAT") {
        const excl = toNumber(value);
        next[index] = {
          ...next[index],
          pricePerDayExclVAT: excl,
          pricePerDay: Number((excl * vatMultiplier).toFixed(2)),
        };
      } else {
        next[index] = { ...next[index], [key]: key === "quantity" || key === "pricePerDay" ? toNumber(value) : value };
      }
      return { ...p, rentalItems: next };
    });
  const setServiceFeeExcl = (key, value) =>
    setOrder((p) => {
      const excl = toNumber(value);
      const next = { ...p.serviceFees, [key]: Number((excl * vatMultiplier).toFixed(2)) };
      next.total = toNumber(next.baseServiceFee) + toNumber(next.eveningServiceFee) + toNumber(next.morningServiceFee);
      return { ...p, serviceFees: next };
    });

  const handleAddItemsConfirm = (newItems = []) => {
    setOrder((prev) => {
      const next = [...prev.rentalItems];
      newItems.forEach((item) => {
        const idx = next.findIndex((x) => String(x.productId) === String(item.productId));
        if (idx >= 0) {
          next[idx] = {
            ...next[idx],
            quantity: toNumber(next[idx].quantity) + toNumber(item.quantity),
            pricePerDayExclVAT: toNumber(item.pricePerDay),
            pricePerDay: Number((toNumber(item.pricePerDay) * vatMultiplier).toFixed(2)),
          };
        } else {
          next.push({
            productId: safeString(item.productId),
            productName: safeString(item.productName),
            quantity: toNumber(item.quantity),
            pricePerDayExclVAT: toNumber(item.pricePerDay),
            pricePerDay: Number((toNumber(item.pricePerDay) * vatMultiplier).toFixed(2)),
          });
        }
      });
      return { ...prev, rentalItems: next };
    });
    setAddOpen(false);
  };

  const mergeUnsaved = (serverOrder, updatedSection) => {
    const next = { ...serverOrder };
    if (updatedSection !== "s1" && !deepEqual(order.customerDetails, baselineOrder.customerDetails)) next.customerDetails = order.customerDetails;
    const s2Keys = ["pickupDeliveryType", "city", "deliveryAddress", "deliveryLat", "deliveryLong", "deliveryDate", "deliveryTime", "pickupAddress", "pickupLat", "pickupLong", "pickupDate", "pickupTime", "includeServiceFee"];
    if (updatedSection !== "s2" && s2Keys.some((k) => !deepEqual(order[k], baselineOrder[k]))) s2Keys.forEach((k) => (next[k] = order[k]));
    if (updatedSection !== "s3" && !deepEqual(order.rentalItems, baselineOrder.rentalItems)) next.rentalItems = order.rentalItems;
    if (
      updatedSection !== "s4" &&
      (!deepEqual(order.transportCost, baselineOrder.transportCost) || !deepEqual(order.transportCostExclVAT, baselineOrder.transportCostExclVAT) || !deepEqual(order.serviceFees, baselineOrder.serviceFees))
    ) {
      next.transportCost = order.transportCost;
      next.transportCostExclVAT = order.transportCostExclVAT;
      next.serviceFees = order.serviceFees;
    }
    return next;
  };

  const saveField = async (fieldKey, sectionKey, payload) => {
    if (!id) return;
    setSavingField(fieldKey);
    const response = await updateOrderAdmin(id, payload);
    setSavingField("");
    if (!(response?.status === 200 || response?.status === 201)) {
      showError({ title: response?.data?.message || "Opslaan mislukt" });
      return;
    }
    const freshOrderResponse = await getOrderById(id);
    const server = normalizeOrder(extractOrder(freshOrderResponse));
    setOrder(mergeUnsaved(server, sectionKey));
    setBaselineOrder(server);
    showSuccess({ title: response?.data?.message || "Opgeslagen" });
  };

  const validateSection = (sectionKey) => {
    if (sectionKey === "s1") {
      if (!order.customerDetails.firstName?.trim()) return "Voornaam is verplicht";
      if (!order.customerDetails.lastName?.trim()) return "Achternaam is verplicht";
      if (!order.customerDetails.email?.trim()) return "E-mail is verplicht";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(order.customerDetails.email)) return "Voer een geldig e-mailadres in";
      if (!order.customerDetails.phoneNumber?.trim()) return "Telefoonnummer is verplicht";
      return "";
    }

    if (sectionKey === "s2") {
      if (!order.deliveryAddress?.trim()) return "Leveradres is verplicht";
      if (!order.deliveryDate) return "Leverdatum is verplicht";
      if (!order.deliveryTime?.trim()) return "Levertijd is verplicht";
      if (!order.pickupAddress?.trim()) return "Ophaaladres is verplicht";
      if (!order.pickupDate) return "Ophaaldatum is verplicht";
      if (!order.pickupTime?.trim()) return "Ophaaltijd is verplicht";
      return "";
    }

    if (sectionKey === "s3") {
      if (!order.rentalItems?.length) return "Voeg minimaal een verhuurartikel toe";
      const hasInvalid = order.rentalItems.some(
        (item) =>
          !item.productName?.trim() ||
          toNumber(item.quantity) <= 0 ||
          toNumber(item.pricePerDayExclVAT) < 0
      );
      if (hasInvalid) return "Controleer productnaam, aantal en prijs";
      return "";
    }

    if (sectionKey === "s4") {
      if (toNumber(order.transportCostExclVAT) < 0) return "Transportkosten (excl. btw) moeten 0 of hoger zijn";
      const feeKeys = ["baseServiceFee", "eveningServiceFee", "morningServiceFee"];
      const hasInvalidFee = feeKeys.some((key) => toNumber(order.serviceFees?.[key]) < 0);
      if (hasInvalidFee) return "Servicekosten moeten 0 of hoger zijn";
    }
    return "";
  };

  const saveSection = (sectionKey, payload) => {
    const error = validateSection(sectionKey);
    if (error) {
      showError({ title: error });
      return;
    }
    saveField(`section.${sectionKey}`, sectionKey, payload);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </IconButton>
        <Typography variant="h5">Bestelling bewerken</Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item size={{ xs: 12 }}>
          <Paper sx={{ p: 2, borderRadius: 3, boxShadow: "none" }}>
            <Typography fontSize="16px" fontWeight={600} mb={2}>Klantgegevens</Typography>
            <Grid container spacing={1.5}>
              {[
                ["firstName", "Voornaam"],
                ["lastName", "Achternaam"],
                ["email", "E-mail"],
                ["phoneNumber", "Telefoonnummer"],
              ].map(([key, label]) => (
                <Grid key={key} item size={{ xs: 12, md: 4 }}>
                  <Box>
                    <TextInput showLabel={label} value={order.customerDetails[key]} onChange={(e) => setCustomer(key, e.target.value)} inputBgColor="#f5f5f5" />
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <CustomButton
                btnLabel="Sectie opslaan"
                variant="gradient"
                loading={savingField === "section.s1"}
                handlePressBtn={() => saveSection("s1", { customerDetails: order.customerDetails })}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item size={{ xs: 12 }}>
          <Paper sx={{ p: 2, borderRadius: 3, boxShadow: "none" }}>
            <Typography fontSize="16px" fontWeight={600} mb={2}>Levering / Ophaling</Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box mb={1.5}>
                <RadioButtonGroup
                  label="Leveringstype"
                  name="pickupDeliveryType"
                  value={order.pickupDeliveryType}
                  onChange={(e) => setValue("pickupDeliveryType", e.target.value)}
                  options={[{ label: "Zelf", value: "self" }, { label: "Hoppa", value: "hoppa" }]}
                />
              </Box>

              {/* <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr auto" }} gap={1} mb={1.5} alignItems="center"  >
                <TextInput showLabel="City" value={order.city} onChange={(e) => setValue("city", e.target.value)} inputBgColor="#f5f5f5" />
              </Box> */}

              <Box mb={1.5} alignItems="bottom" >
                <CustomInputLabel label="Leveradres" />
                <GooglePlacesInput
                  name="deliveryAddress"
                  value={order.deliveryAddress}
                  onChange={(e) => {
                    setValue("deliveryAddress", e.target.value);
                    if (sameAsDelivery) setValue("pickupAddress", e.target.value);
                  }}
                  onPlaceSelected={(place) => {
                    setValue("deliveryLat", toNumber(place?.latitude));
                    setValue("deliveryLong", toNumber(place?.longitude));
                  }}
                  inputBgColor="#f5f5f5"
                />
                <Alert severity="info" sx={{ mt: 1 }}>Let op: wijziging van het leveradres beinvloedt de transportprijs omdat de kilometers wijzigen. Klik op Opslaan om correcte prijzen te herberekenen.</Alert>
              </Box>

              <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr auto" }} gap={1} alignItems="end" mb={1.5}>
                <Box><CustomInputLabel label="Leverdatum" /><DatePicker format="dd/MM/yyyy" value={dateFromYmd(order.deliveryDate)} onChange={(v) => setValue("deliveryDate", ymdFromDate(v))} sx={GlobalStyle.datePickerStyle} /></Box>
              </Box>

              <Box mb={1.5}>
                <Grid container spacing={2}>
                  {hasDeliveryRange ? (
                    <>
                      <Grid item size={{ xs: 12, sm: 6 }}>
                        <CustomInputLabel label="Levertijd (start)" />
                        <TimePicker value={timeToDate(deliveryParts.start)} onChange={(v) => setValue("deliveryTime", buildTimeWindow(hhMmFromDate(v), deliveryParts.end))} format="HH:mm" ampm={false} sx={GlobalStyle.datePickerStyle} />
                      </Grid>
                      <Grid item size={{ xs: 12, sm: 6 }}>
                        <CustomInputLabel label="Levertijd (einde)" />
                        <TimePicker value={timeToDate(deliveryParts.end)} onChange={(v) => setValue("deliveryTime", buildTimeWindow(deliveryParts.start, hhMmFromDate(v)))} format="HH:mm" ampm={false} sx={GlobalStyle.datePickerStyle} />
                      </Grid>
                    </>
                  ) : (
                    <Grid item size={{ xs: 12 }}>
                      <CustomInputLabel label="Levertijdvenster" />
                      <TimePicker value={timeToDate(deliveryParts.start)} onChange={(v) => setValue("deliveryTime", hhMmFromDate(v))} format="HH:mm" ampm={false} sx={GlobalStyle.datePickerStyle} />
                    </Grid>
                  )}
                </Grid>
              </Box>

              <Box mb={1.5}>


              <FormControlLabel
                  control={
                    <Checkbox
                      checked={sameAsDelivery}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSameAsDelivery(checked);
                        if (checked) {
                          setValue("pickupAddress", order.deliveryAddress);
                          setValue("pickupLat", order.deliveryLat);
                          setValue("pickupLong", order.deliveryLong);
                        }
                      }}
                    />
                  }
                  label="Ophaaladres gelijk aan leveradres"
                />
                <CustomInputLabel label="Ophaaladres" />
                <GooglePlacesInput
                  name="pickupAddress"
                  value={order.pickupAddress}
                  onChange={(e) => setValue("pickupAddress", e.target.value)}
                  onPlaceSelected={(place) => {
                    setValue("pickupLat", toNumber(place?.latitude));
                    setValue("pickupLong", toNumber(place?.longitude));
                  }}
                  inputBgColor="#f5f5f5"
                />
               
                <Alert severity="info" sx={{ mt: 1 }}>Let op: wijziging van lever-/ophaaladres beinvloedt de transportprijs omdat de kilometers wijzigen. Klik op Opslaan om correcte prijzen te herberekenen.</Alert>
              </Box>

              <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr auto" }} gap={1} alignItems="end" mb={1.5}>
                <Box><CustomInputLabel label="Ophaaldatum" /><DatePicker format="dd/MM/yyyy" value={dateFromYmd(order.pickupDate)} onChange={(v) => setValue("pickupDate", ymdFromDate(v))} sx={GlobalStyle.datePickerStyle} /></Box>
              </Box>

              <Box mb={1.5}>
                <Grid container spacing={2}>
                  {hasPickupRange ? (
                    <>
                      <Grid item size={{ xs: 12, sm: 6 }}>
                        <CustomInputLabel label="Ophaaltijd (start)" />
                        <TimePicker value={timeToDate(pickupParts.start)} onChange={(v) => setValue("pickupTime", buildTimeWindow(hhMmFromDate(v), pickupParts.end))} format="HH:mm" ampm={false} sx={GlobalStyle.datePickerStyle} />
                      </Grid>
                      <Grid item size={{ xs: 12, sm: 6 }}>
                        <CustomInputLabel label="Ophaaltijd (einde)" />
                        <TimePicker value={timeToDate(pickupParts.end)} onChange={(v) => setValue("pickupTime", buildTimeWindow(pickupParts.start, hhMmFromDate(v)))} format="HH:mm" ampm={false} sx={GlobalStyle.datePickerStyle} />
                      </Grid>
                    </>
                  ) : (
                    <Grid item size={{ xs: 12 }}>
                      <CustomInputLabel label="Ophaaltijdvenster" />
                      <TimePicker value={timeToDate(pickupParts.start)} onChange={(v) => setValue("pickupTime", hhMmFromDate(v))} format="HH:mm" ampm={false} sx={GlobalStyle.datePickerStyle} />
                    </Grid>
                  )}
                </Grid>
                <Alert severity="info" sx={{ mt: 1 }}>Let op: tijdswijziging kan een andere servicekost toepassen. Klik op Opslaan om de bijgewerkte servicekost te zien.</Alert>
              </Box>

              <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr auto" }} gap={1} alignItems="center">
                <FormControlLabel control={<Checkbox checked={order.includeServiceFee} onChange={(e) => setValue("includeServiceFee", e.target.checked)} />} label="Servicekosten meenemen" />
              </Box>
            </LocalizationProvider>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <CustomButton
                btnLabel="Sectie opslaan"
                variant="gradient"
                loading={savingField === "section.s2"}
                handlePressBtn={() =>
                  saveSection("s2", {
                    pickupDeliveryType: order.pickupDeliveryType,
                    city: order.city,
                    deliveryAddress: order.deliveryAddress,
                    deliveryLat: order.deliveryLat,
                    deliveryLong: order.deliveryLong,
                    deliveryDate: order.deliveryDate,
                    deliveryTime: order.deliveryTime,
                    pickupAddress: order.pickupAddress,
                    pickupLat: order.pickupLat,
                    pickupLong: order.pickupLong,
                    pickupDate: order.pickupDate,
                    pickupTime: order.pickupTime,
                    includeServiceFee: order.includeServiceFee,
                  })
                }
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item size={{ xs: 12 }}>
          <Paper sx={{ p: 2, borderRadius: 3, boxShadow: "none" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography fontSize="16px" fontWeight={600}>Verhuurartikelen</Typography>
              <Box display="flex" gap={1}>
                <CustomButton
                  btnLabel="Item toevoegen"
                  variant="grayButton"
                  startIcon={<Plus size={16} />}
                  handlePressBtn={() => setAddOpen(true)}
                />
              </Box>
            </Box>

            {order.rentalItems.map((item, index) => (
              <Paper key={`${item.productId || "item"}-${index}`} sx={{ p: 2, mb: 1.5, bgcolor: "#fafafa", boxShadow: "none" }}>
                <Grid container spacing={2}>
                  {/* <Grid item size={{ xs: 12, md: 3 }}><TextInput showLabel="Product ID" value={item.productId} onChange={(e) => setItem(index, "productId", e.target.value)} inputBgColor="#f5f5f5" /></Grid> */}
                  <Grid item size={{ xs: 12, md: 4 }}><TextInput showLabel="Productnaam" value={item.productName} onChange={(e) => setItem(index, "productName", e.target.value)} inputBgColor="#f5f5f5" /></Grid>
                  <Grid item size={{ xs: 12, md: 2 }}><TextInput showLabel="Aantal" type="number" value={item.quantity} onChange={(e) => setItem(index, "quantity", e.target.value)} inputBgColor="#f5f5f5" /></Grid>
                  <Grid item size={{ xs: 12, md: 2 }}><TextInput showLabel="Prijs / dag (excl. btw)" type="number" value={toFixed2(item.pricePerDayExclVAT)} onChange={(e) => setItem(index, "pricePerDayExclVAT", e.target.value)} inputBgColor="#f5f5f5" /></Grid>
                  <Grid item size={{ xs: 12, md: 2 }}><TextInput showLabel="Prijs / dag (incl. btw)" type="number" value={toFixed2(item.pricePerDay)} disabled inputBgColor="#f5f5f5" /></Grid>
                  <Grid item size={{ xs: 12, md: 1 }}>
                    <Box display="flex" justifyContent="flex-end" alignItems="flex-end" gap={1} height="100%">
                      <IconButton color="error" onClick={() => setOrder((p) => ({ ...p, rentalItems: p.rentalItems.filter((_, i) => i !== index) }))}>
                        <Trash2 size={18} />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            ))}
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <CustomButton
                btnLabel="Sectie opslaan"
                variant="gradient"
                loading={savingField === "section.s3"}
                handlePressBtn={() => saveSection("s3", { rentalItems: order.rentalItems })}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item size={{ xs: 12 }}>
          <Paper sx={{ p: 2, borderRadius: 3, boxShadow: "none" }}>
            <Typography fontSize="16px" fontWeight={600} mb={2}>Transportkosten / Servicekosten</Typography>


            <Grid container spacing={1.5}>
              <Grid item size={{ xs: 12, md: 4 }}>
                <Box>
                   <TextInput
                     showLabel="Totale berekende afstand (km)"
                     type="number"
                     value={toFixed2(toNumber(order.originalDistance) * 4)}
                     disabled
                     inputBgColor="#f5f5f5"
                   />
                </Box>
              </Grid>
              <Grid item size={{ xs: 12, md: 4 }}>
                <Box>
                   <TextInput
                     showLabel="Gratis afstand (km)"
                     type="number"
                     value={toNumber(order.freeDeliveryRadius).toFixed(2)}
                     disabled
                     inputBgColor="#f5f5f5"
                   />
                </Box>
              </Grid>
              <Grid item size={{ xs: 12, md: 4 }}>
                <Box>
                   <TextInput
                     showLabel="Berekende afstand (km)"
                     type="number"
                     value={toNumber(order.distance).toFixed(2)}
                     disabled
                     inputBgColor="#f5f5f5"
                   />
                </Box>
              </Grid>
            </Grid>


            <Grid container spacing={1.5} mt={2}>
              <Grid item size={{ xs: 12, md: 6 }}>
                <Box>
                  <TextInput showLabel="Transportkosten (incl. btw)" type="number" value={toFixed2(order.transportCost)} disabled inputBgColor="#f5f5f5" />
                </Box>
              </Grid>
              <Grid item size={{ xs: 12, md: 6 }}>
                <Box>
                  <TextInput
                    showLabel="Transportkosten (excl. btw)"
                    type="number"
                    value={toFixed2(order.transportCostExclVAT)}
                    onChange={(e) => {
                      const excl = toNumber(e.target.value);
                      setValue("transportCostExclVAT", excl);
                      setValue("transportCost", Number((excl * vatMultiplier).toFixed(2)));
                    }}
                    inputBgColor="#f5f5f5"
                  />
                </Box>
              </Grid>
              {[
                ["baseServiceFee", "Basis"],
                ["eveningServiceFee", "Avond"],
                ["morningServiceFee", "Ochtend"],
              ].map(([key, label]) => (
                <Grid key={key} item size={{ xs: 12, md: 4 }}>
                  <Box>
                    <TextInput
                      showLabel={label}
                      type="number"
                      value={toFixed2(toNumber(order.serviceFees[key]) / vatMultiplier)}
                      disabled={applicableFeeType !== key}
                      onChange={(e) => setServiceFeeExcl(key, e.target.value)}
                      inputBgColor="#f5f5f5"
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>

            <TextInput
              showLabel="Totale servicekosten"
              type="number"
              value={toFixed2(toNumber(order.serviceFees.total) / vatMultiplier)}
              disabled
              inputBgColor="#f5f5f5"
            />
            {/* <Box mt={1.5}><TextInput showLabel="Distance (km)" value={order.distance} disabled inputBgColor="#f5f5f5" /></Box> */}
            <Alert severity="warning" sx={{ mt: 1.5 }}>
              Let op: servicekosten worden bepaald op basis van de opgeslagen ophaaltijd. Pas hierboven de ophaaltijd aan om een ander veld bewerkbaar te maken.
            </Alert>
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <CustomButton
                btnLabel="Sectie opslaan"
                variant="gradient"
                loading={savingField === "section.s4"}
                handlePressBtn={() =>
                  saveSection("s4", {
                    transportCost: order.transportCost,
                    transportCostExclVAT: order.transportCostExclVAT,
                    serviceFees: order.serviceFees,
                  })
                }
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <AddItemsDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onConfirm={handleAddItemsConfirm}
        actionLoading={savingField.startsWith("i.")}
      />
    </Box>
  );
};

export default EditOrderDetailsPage;
