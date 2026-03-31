import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { CustomButton, CustomDrawer, CustomInputLabel, TextInput } from "../../../../components";
import { getOrderById, updateOrderAdmin } from "../../../../api/modules/order";
import { useErrorDialog } from "../../../../lib/context/errorDialogContext";
import { useSuccessDialog } from "../../../../lib/context/successDialogContext";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { format as formatDateFns } from "date-fns";
import GlobalStyle from "../../../../style/style";
import GooglePlacesInput from "../../../../components/googlePlaceInput";
import useVatStore from "../../../../zustand/useVatStore";
const toDateInputValue = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 10); // YYYY-MM-DD
};

const dateFromYmd = (yyyyMmDd) => {
    if (!yyyyMmDd) return null;
    const d = new Date(`${yyyyMmDd}T00:00:00`);
    if (Number.isNaN(d.getTime())) return null;
    return d;
};

const ymdFromDate = (date) => {
    if (!date || !(date instanceof Date) || Number.isNaN(date.getTime())) return "";
    return formatDateFns(date, "yyyy-MM-dd");
};

const timeToDate = (hhMm) => {
    if (!hhMm) return null;
    const d = new Date(`2000-01-01T${hhMm}:00`);
    if (Number.isNaN(d.getTime())) return null;
    return d;
};

const hhMmFromDate = (date) => {
    if (!date || !(date instanceof Date) || Number.isNaN(date.getTime())) return "";
    return formatDateFns(date, "HH:mm");
};

const toISODateFromInput = (yyyyMmDd) => {
    if (!yyyyMmDd) return null;
    // Use Z to avoid timezone shifting.
    return new Date(`${yyyyMmDd}T00:00:00.000Z`).toISOString();
};

const toNumber = (v) => {
    if (v === "" || v === null || v === undefined) return 0;
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};

const toFixedMoney = (v, decimals = 2) => {
    if (v === "" || v === null || v === undefined) return "";
    const n = Number(v);
    if (!Number.isFinite(n)) return "";
    return n.toFixed(decimals);
};

const EditOrderDrawer = forwardRef((props, ref) => {
    const drawerRef = useRef(null);
    const { onUpdated } = props;
    const { showError } = useErrorDialog();
    const { showSuccess } = useSuccessDialog();
    const { getVatPercentage } = useVatStore();

    const [saving, setSaving] = useState(false);

    const [orderId, setOrderId] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [fetchedOrder, setFetchedOrder] = useState(null);

    const initialForm = useMemo(
        () => ({
            customerDetails: {
                firstName: "",
                lastName: "",
                email: "",
                phoneNumber: "",
            },
            pickupDeliveryType: "",
            deliveryAddress: "",
            deliveryDate: "",
            deliveryTime: "",
            pickupAddress: "",
            pickupDate: "",
            pickupTime: "",
            transportCost: "",
            transportCostExclVAT: "",
            serviceFees: {
                baseServiceFee: "",
                eveningServiceFee: "",
                morningServiceFee: "",
                total: "",
                breakdown: [],
            },
        }),
        []
    );

    const [form, setForm] = useState(initialForm);
    const [serviceFeeDisplay, setServiceFeeDisplay] = useState({
        baseServiceFee: "",
        morningServiceFee: "",
        eveningServiceFee: "",
    });

    const parseTimeWindow = (value) => {
        if (!value || typeof value !== "string") return { start: "", end: "" };
        // Expected format: "HH:mm-HH:mm"
        if (value.includes("-")) {
            const [startRaw, endRaw] = value.split("-");
            return {
                start: (startRaw || "").trim(),
                end: (endRaw || "").trim(),
            };
        }
        return { start: value.trim(), end: "" };
    };

    const buildTimeWindow = (start, end) => {
        const s = (start || "").trim();
        const e = (end || "").trim();
        if (s && e) return `${s}-${e}`;
        if (s) return s;
        if (e) return e;
        return "";
    };

    const deliveryTimeParts = parseTimeWindow(form?.deliveryTime);
    const pickupTimeParts = parseTimeWindow(form?.pickupTime);
  const hasDeliveryTimeRange = Boolean((form?.deliveryTime || "").includes("-"));
  const hasPickupTimeRange = Boolean((form?.pickupTime || "").includes("-"));

    const openDrawer = (id) => {
        if (!id) return;
        setOrderId(id);
        drawerRef.current?.openDrawer();
    };

    const closeDrawer = () => {
        setOrderId(null);
        setFetchedOrder(null);
        setForm(initialForm);
        setServiceFeeDisplay({
            baseServiceFee: "",
            morningServiceFee: "",
            eveningServiceFee: "",
        });
        drawerRef.current?.closeDrawer();
    };

    useImperativeHandle(ref, () => ({
        openDrawer,
        closeDrawer,
    }));

    useEffect(() => {
        if (!orderId) return;

        let mounted = true;
        const run = async () => {
            setFetching(true);
            try {
                const response = await getOrderById(orderId);
                const data = response?.data?.data || response?.data || response;
                if (!mounted) return;
                setFetchedOrder(data || null);
            } catch (e) {
                if (!mounted) return;
                setFetchedOrder(null);
            } finally {
                if (!mounted) return;
                setFetching(false);
            }
        };

        run();
        return () => {
            mounted = false;
        };
    }, [orderId]);

    useEffect(() => {
        if (!fetchedOrder) return;
        const serviceFees = fetchedOrder?.serviceFees || {};

        const baseServiceFee = serviceFees?.baseServiceFee ?? 0;
        const morningServiceFee = serviceFees?.morningServiceFee ?? 0;
        const eveningServiceFee = serviceFees?.eveningServiceFee ?? 0;
        const total =
            Number(serviceFees?.total ?? 0) ||
            Number(baseServiceFee + morningServiceFee + eveningServiceFee);

        setForm({
            customerDetails: {
                firstName: fetchedOrder?.customerDetails?.firstName ?? "",
                lastName: fetchedOrder?.customerDetails?.lastName ?? "",
                email: fetchedOrder?.customerDetails?.email ?? "",
                phoneNumber: fetchedOrder?.customerDetails?.phoneNumber ?? "",
            },
            pickupDeliveryType: fetchedOrder?.pickupDeliveryType ?? "",
            deliveryAddress: fetchedOrder?.deliveryAddress ?? "",
            deliveryDate: toDateInputValue(fetchedOrder?.deliveryDate),
            deliveryTime: fetchedOrder?.deliveryTime ?? "",
            pickupAddress: fetchedOrder?.pickupAddress ?? "",
            pickupDate: toDateInputValue(fetchedOrder?.pickupDate),
            pickupTime: fetchedOrder?.pickupTime ?? "",
            transportCost: toFixedMoney(fetchedOrder?.transportCost, 2),
            transportCostExclVAT: toFixedMoney(fetchedOrder?.transportCostExclVAT, 2),
            serviceFees: {
                baseServiceFee: toFixedMoney(baseServiceFee, 2),
                eveningServiceFee: toFixedMoney(eveningServiceFee, 2),
                morningServiceFee: toFixedMoney(morningServiceFee, 2),
                total: toFixedMoney(total, 2),
                breakdown: serviceFees?.breakdown ?? [],
            },
        });

        const vatPercentage = Number(getVatPercentage?.() ?? 21);
        const vatMultiplier = Number.isFinite(vatPercentage) ? 1 + vatPercentage / 100 : 1.21;
        const toExclDisplay = (incl) => {
            const n = Number(incl);
            if (!Number.isFinite(n) || vatMultiplier <= 0) return "";
            return (n / vatMultiplier).toFixed(2);
        };
        setServiceFeeDisplay({
            baseServiceFee: toExclDisplay(baseServiceFee),
            morningServiceFee: toExclDisplay(morningServiceFee),
            eveningServiceFee: toExclDisplay(eveningServiceFee),
        });
    }, [fetchedOrder, getVatPercentage]);

  const handleAddressChange = (e) => {
    const { name, value } = e?.target || {};
    if (!name) return;
    setForm((p) => ({ ...p, [name]: value }));
  };

    const serviceTotalComputed = useMemo(() => {
        const base = toNumber(form?.serviceFees?.baseServiceFee);
        const morning = toNumber(form?.serviceFees?.morningServiceFee);
        const evening = toNumber(form?.serviceFees?.eveningServiceFee);
        return (base + morning + evening).toFixed(2);
    }, [form?.serviceFees?.baseServiceFee, form?.serviceFees?.eveningServiceFee, form?.serviceFees?.morningServiceFee]);

    const vatPercentage = Number(getVatPercentage?.() ?? 21);
    const vatMultiplier = Number.isFinite(vatPercentage) ? 1 + vatPercentage / 100 : 1.21;

    const storeInclFromDisplayedExcl = (value) => {
        if (value === "" || value === null || value === undefined) return "";
        const excl = Number(value);
        if (!Number.isFinite(excl)) return "";
        return String(excl * vatMultiplier);
    };

    const transportInclFromExcl = (value) => {
        if (value === "" || value === null || value === undefined) return "";
        const excl = Number(value);
        if (!Number.isFinite(excl)) return "";
        return String(excl * vatMultiplier);
    };

    const serviceTotalDisplayExclVAT = useMemo(() => {
        const totalInclVat = toNumber(serviceTotalComputed);
        if (!Number.isFinite(vatMultiplier) || vatMultiplier <= 0) return totalInclVat.toFixed(2);
        return (totalInclVat / vatMultiplier).toFixed(2);
    }, [serviceTotalComputed, vatMultiplier]);

    const handleSave = async () => {
        if (!orderId) return;

        const payload = {
            customerDetails: {
                firstName: form?.customerDetails?.firstName ?? "",
                lastName: form?.customerDetails?.lastName ?? "",
                email: form?.customerDetails?.email ?? "",
                phoneNumber: form?.customerDetails?.phoneNumber ?? "",
            },
            pickupDeliveryType: form?.pickupDeliveryType ?? "",
            deliveryAddress: form?.deliveryAddress ?? "",
            deliveryDate: toISODateFromInput(form?.deliveryDate),
            deliveryTime: form?.deliveryTime ?? "",
            pickupAddress: form?.pickupAddress ?? "",
            pickupDate: toISODateFromInput(form?.pickupDate),
            pickupTime: form?.pickupTime ?? "",
            transportCost: toNumber(form?.transportCost),
            transportCostExclVAT: toNumber(form?.transportCostExclVAT),
            serviceFees: {
                baseServiceFee: toNumber(form?.serviceFees?.baseServiceFee),
                eveningServiceFee: toNumber(form?.serviceFees?.eveningServiceFee),
                morningServiceFee: toNumber(form?.serviceFees?.morningServiceFee),
                total: serviceTotalComputed,
                breakdown: [],
            },
        };

        try {
            setSaving(true);
            const response = await updateOrderAdmin(orderId, payload);
            if (response?.status === 200 || response?.status === 201) {
                showSuccess({
                    title: response?.data?.message || "Order updated successfully",
                });
                await onUpdated?.();
                closeDrawer();
                return;
            }

            showError({
                title: response?.data?.message || "Failed to update order",
            });
        } catch (e) {
            showError({
                title: e?.response?.data?.message || "Failed to update order",
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <CustomDrawer title="Bestelling bewerken" ref={drawerRef} handleClose={closeDrawer}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pb: 4 }}>
                {fetching ? (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Box>
                            <Typography fontSize="16px" fontWeight={600} mb={2} color="#030229">
                                Klantgegevens
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item size={{ xs: 12, sm: 6 }}>
                                    <TextInput
                                        showLabel="Voornaam"
                                        placeholder="staging"
                                        value={form?.customerDetails?.firstName}
                                        onChange={(e) =>
                                            setForm((p) => ({
                                                ...p,
                                                customerDetails: { ...p.customerDetails, firstName: e.target.value },
                                            }))
                                        }
                                        fullWidth
                                        inputBgColor="#f5f5f5"
                                    />
                                </Grid>
                                <Grid item size={{ xs: 12, sm: 6 }}>
                                    <TextInput
                                        showLabel="Achternaam"
                                        placeholder="Khan"
                                        value={form?.customerDetails?.lastName}
                                        onChange={(e) =>
                                            setForm((p) => ({
                                                ...p,
                                                customerDetails: { ...p.customerDetails, lastName: e.target.value },
                                            }))
                                        }
                                        fullWidth
                                        inputBgColor="#f5f5f5"
                                    />
                                </Grid>
                                <Grid item size={{ xs: 12 }}>
                                    <TextInput
                                        showLabel="E-mail"
                                        placeholder="staging@gmail.com"
                                        value={form?.customerDetails?.email}
                                        onChange={(e) =>
                                            setForm((p) => ({
                                                ...p,
                                                customerDetails: { ...p.customerDetails, email: e.target.value },
                                            }))
                                        }
                                        fullWidth
                                        inputBgColor="#f5f5f5"
                                    />
                                </Grid>
                                            <Grid item size={{ xs: 12 }}>
                                    <TextInput
                                        showLabel="Telefoonnummer"
                                        placeholder="0612345678"
                                        value={form?.customerDetails?.phoneNumber}
                                        onChange={(e) =>
                                            setForm((p) => ({
                                                ...p,
                                                customerDetails: { ...p.customerDetails, phoneNumber: e.target.value },
                                            }))
                                        }
                                        fullWidth
                                        inputBgColor="#f5f5f5"
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        <Box>
                            <Typography fontSize="16px" fontWeight={600} mb={2} color="#030229">
                                Bezorging / Ophaling
                            </Typography>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Grid container spacing={2}>
                                    <Grid item size={{ xs: 12 }}>
                                        <TextInput
                                            showLabel="Bezorgtype"
                                            placeholder="hoppa"
                                            value={form?.pickupDeliveryType}
                                            onChange={(e) => setForm((p) => ({ ...p, pickupDeliveryType: e.target.value }))}
                                            fullWidth
                                            inputBgColor="#f5f5f5"
                                        />
                                    </Grid>
                                    <Grid item size={{ xs: 12 }}>
                                        <CustomInputLabel label="Bezorgadres" />
                                        <GooglePlacesInput
                                            name="deliveryAddress"
                                            value={form?.deliveryAddress || ""}
                                            placeholder="Test Street 123"
                                            onChange={handleAddressChange}
                                            fullWidth={true}
                                            inputBgColor="#f5f5f5"
                                        />
                                    </Grid>
                                    <Grid item size={{ xs: 12, sm: 6 }}>
                                        <CustomInputLabel label="Bezorgdatum" />
                                        <DatePicker
                                          format="dd/MM/yyyy"
                                            value={dateFromYmd(form?.deliveryDate)}
                                            onChange={(newValue) =>
                                                setForm((p) => ({
                                                    ...p,
                                                    deliveryDate: ymdFromDate(newValue),
                                                }))
                                            }
                                            sx={GlobalStyle.datePickerStyle}
                                        />
                                    </Grid>
                                    {hasDeliveryTimeRange ? (
                                        <>
                                            <Grid item size={{ xs: 12, sm: 3 }}>
                                                <CustomInputLabel label="Bezorgtijd (start)" />
                                                <TimePicker
                                                    value={timeToDate(deliveryTimeParts.start)}
                                                    onChange={(newValue) => {
                                                        const time = hhMmFromDate(newValue);
                                                        setForm((p) => {
                                                            const { end } = parseTimeWindow(p.deliveryTime);
                                                            return {
                                                                ...p,
                                                                deliveryTime: buildTimeWindow(time, end),
                                                            };
                                                        });
                                                    }}
                                                    format="HH:mm"
                                                    ampm={false}
                                                    sx={GlobalStyle.datePickerStyle}
                                                />
                                            </Grid>
                                            <Grid item size={{ xs: 12, sm: 3 }}>
                                                <CustomInputLabel label="Bezorgtijd (einde)" />
                                                <TimePicker
                                                    value={timeToDate(deliveryTimeParts.end)}
                                                    onChange={(newValue) => {
                                                        const time = hhMmFromDate(newValue);
                                                        setForm((p) => {
                                                            const { start } = parseTimeWindow(p.deliveryTime);
                                                            return {
                                                                ...p,
                                                                deliveryTime: buildTimeWindow(start, time),
                                                            };
                                                        });
                                                    }}
                                                    format="HH:mm"
                                                    ampm={false}
                                                    sx={GlobalStyle.datePickerStyle}
                                                />
                                            </Grid>
                                        </>
                                    ) : (
                                        <Grid item size={{ xs: 12, sm: 6 }}>
                                            <CustomInputLabel label="Bezorgtijd" />
                                            <TimePicker
                                                value={timeToDate(deliveryTimeParts.start)}
                                                onChange={(newValue) => {
                                                    const time = hhMmFromDate(newValue);
                                                    setForm((p) => ({
                                                        ...p,
                                                        deliveryTime: time || "",
                                                    }));
                                                }}
                                                format="HH:mm"
                                                ampm={false}
                                                sx={GlobalStyle.datePickerStyle}
                                            />
                                        </Grid>
                                    )}
                                    <Grid item size={{ xs: 12 }}>
                                    <CustomInputLabel label="Ophaaladres" />
                                        <GooglePlacesInput
                                            name="pickupAddress"
                                            value={form?.pickupAddress || ""}
                                            placeholder="Pickup Street 9"
                                            onChange={handleAddressChange}
                                            fullWidth={true}
                                            inputBgColor="#f5f5f5"
                                        />
                                    </Grid>
                                    <Grid item size={{ xs: 12, sm: 6 }}>
                                        <CustomInputLabel label="Ophaaldatum" />
                                        <DatePicker
                                          format="dd/MM/yyyy"
                                            value={dateFromYmd(form?.pickupDate)}
                                            onChange={(newValue) =>
                                                setForm((p) => ({
                                                    ...p,
                                                    pickupDate: ymdFromDate(newValue),
                                                }))
                                            }
                                            sx={GlobalStyle.datePickerStyle}
                                        />
                                    </Grid>
                                    {hasPickupTimeRange ? (
                                        <>
                                            <Grid item size={{ xs: 12, sm: 3 }}>
                                                <CustomInputLabel label="Ophaaltijd (start)" />
                                                <TimePicker
                                                    value={timeToDate(pickupTimeParts.start)}
                                                    onChange={(newValue) => {
                                                        const time = hhMmFromDate(newValue);
                                                        setForm((p) => {
                                                            const { end } = parseTimeWindow(p.pickupTime);
                                                            return {
                                                                ...p,
                                                                pickupTime: buildTimeWindow(time, end),
                                                            };
                                                        });
                                                    }}
                                                    format="HH:mm"
                                                    ampm={false}
                                                    sx={GlobalStyle.datePickerStyle}
                                                />
                                            </Grid>
                                            <Grid item size={{ xs: 12, sm: 3 }}>
                                                <CustomInputLabel label="Ophaaltijd (einde)" />
                                                <TimePicker
                                                    value={timeToDate(pickupTimeParts.end)}
                                                    onChange={(newValue) => {
                                                        const time = hhMmFromDate(newValue);
                                                        setForm((p) => {
                                                            const { start } = parseTimeWindow(p.pickupTime);
                                                            return {
                                                                ...p,
                                                                pickupTime: buildTimeWindow(start, time),
                                                            };
                                                        });
                                                    }}
                                                    format="HH:mm"
                                                    ampm={false}
                                                    sx={GlobalStyle.datePickerStyle}
                                                />
                                            </Grid>
                                        </>
                                    ) : (
                                        <Grid item size={{ xs: 12, sm: 6 }}>
                                            <CustomInputLabel label="Ophaaltijd" />
                                            <TimePicker
                                                value={timeToDate(pickupTimeParts.start)}
                                                onChange={(newValue) => {
                                                    const time = hhMmFromDate(newValue);
                                                    setForm((p) => ({
                                                        ...p,
                                                        pickupTime: time || "",
                                                    }));
                                                }}
                                                format="HH:mm"
                                                ampm={false}
                                                sx={GlobalStyle.datePickerStyle}
                                            />
                                        </Grid>
                                    )}
                                </Grid>
                            </LocalizationProvider>
                        </Box>

                        <Box>
                            <Typography fontSize="16px" fontWeight={600} mb={2} color="#030229">
                                Transportkosten / Servicekosten
                            </Typography>
                            <Grid container spacing={2}>
                                        <Grid item size={{ xs: 12, sm: 6 }}>
                                    <TextInput
                                        showLabel="Transportkosten (incl. btw)"
                                        type="number"
                                        step={0.01}
                                        value={form?.transportCost}
                                        disabled={true}
                                        fullWidth
                                        inputBgColor="#f5f5f5"
                                    />
                                </Grid>
                                <Grid item size={{ xs: 12, sm: 6 }}>
                                    <TextInput
                                        showLabel="Transportkosten (excl. btw)"
                                        type="number"
                                        step={0.01}
                                        value={form?.transportCostExclVAT}
                                        onChange={(e) => {
                                            const exclValue = e.target.value;
                                            setForm((p) => ({
                                                ...p,
                                                transportCostExclVAT: exclValue,
                                                transportCost: transportInclFromExcl(exclValue),
                                            }));
                                        }}
                                        fullWidth
                                        inputBgColor="#f5f5f5"
                                    />
                                </Grid>

                                <Grid item size={{ xs: 12, sm: 4 }}>
                                    <TextInput
                                        showLabel="Basis servicekosten"
                                        type="number"
                                        step={0.01}
                                        value={serviceFeeDisplay?.baseServiceFee}
                                        onChange={(e) => {
                                            const typedValue = e.target.value;
                                            setServiceFeeDisplay((p) => ({ ...p, baseServiceFee: typedValue }));
                                            setForm((p) => ({
                                                ...p,
                                                serviceFees: {
                                                    ...p.serviceFees,
                                                    baseServiceFee: storeInclFromDisplayedExcl(typedValue),
                                                },
                                            }));
                                        }}
                                        fullWidth
                                        inputBgColor="#f5f5f5"
                                    />
                                </Grid>
                                <Grid item size={{ xs: 12, sm: 4 }}>
                                    <TextInput
                                        showLabel="Ochtendservicekosten"
                                        type="number"
                                        step={0.01}
                                        value={serviceFeeDisplay?.morningServiceFee}
                                        onChange={(e) => {
                                            const typedValue = e.target.value;
                                            setServiceFeeDisplay((p) => ({ ...p, morningServiceFee: typedValue }));
                                            setForm((p) => ({
                                                ...p,
                                                serviceFees: {
                                                    ...p.serviceFees,
                                                    morningServiceFee: storeInclFromDisplayedExcl(typedValue),
                                                },
                                            }));
                                        }}
                                        fullWidth
                                        inputBgColor="#f5f5f5"
                                    />
                                </Grid>
                                <Grid item size={{ xs: 12, sm: 4 }}>
                                    <TextInput
                                        showLabel="Avondservicekosten"
                                        type="number"
                                        step={0.01}
                                        value={serviceFeeDisplay?.eveningServiceFee}
                                        onChange={(e) => {
                                            const typedValue = e.target.value;
                                            setServiceFeeDisplay((p) => ({ ...p, eveningServiceFee: typedValue }));
                                            setForm((p) => ({
                                                ...p,
                                                serviceFees: {
                                                    ...p.serviceFees,
                                                    eveningServiceFee: storeInclFromDisplayedExcl(typedValue),
                                                },
                                            }));
                                        }}
                                        fullWidth
                                        inputBgColor="#f5f5f5"
                                    />
                                </Grid>
                                    <Grid item size={{ xs: 12 }}>
                                    <TextInput
                                        showLabel="Servicekosten totaal"
                                        type="number"
                                        value={serviceTotalDisplayExclVAT}
                                        disabled={true}
                                        fullWidth
                                        inputBgColor="#f5f5f5"
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                            <CustomButton
                                btnLabel="Annuleren"
                                handlePressBtn={closeDrawer}
                                variant="grayButton"
                                disabled={saving}
                                sx={{ width: "50%" }}
                            />
                            <CustomButton
                                btnLabel="Opslaan"
                                handlePressBtn={handleSave}
                                variant="gradient"
                                loading={saving}
                                disabled={saving || fetching}
                                sx={{ width: "50%" }}
                            />
                        </Box>
                    </>
                )}
            </Box>
        </CustomDrawer>
    );
});

EditOrderDrawer.displayName = "EditOrderDrawer";

export default EditOrderDrawer;

