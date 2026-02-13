import { formatNLCurrency } from "./index";
import useVatStore from "../zustand/useVatStore";

/**
 * Convert including VAT price to excluding VAT
 */
const convertIncludingVatToExcluding = (priceIncludingVat, vatPercentage) => {
  if (!priceIncludingVat || priceIncludingVat === "" || priceIncludingVat === 0) return "";
  const priceNum = parseFloat(priceIncludingVat);
  if (isNaN(priceNum) || priceNum <= 0) return "";
  if (!vatPercentage || vatPercentage <= 0) return priceNum.toString();
  // Formula: excluding = including / (1 + vat/100)
  const excludingVat = priceNum / (1 + vatPercentage / 100);
  return excludingVat.toFixed(2);
};

/**
 * Convert API response to form data format
 * All prices are converted from including VAT to excluding VAT for display
 */
export const transformApiResponseToFormData = (apiData) => {
  if (!apiData) return null;

  const serviceFeeSettings = apiData.serviceFeeSettings || {};
  const categoryId =
    typeof apiData.category === "string"
      ? apiData.category
      : apiData.category?._id || "";

  // Get VAT percentage from store
  const { getVatPercentage } = useVatStore.getState();
  const vatPercentage = getVatPercentage();

  const convertTimeString = (timeStr) => {
    if (!timeStr) return null;
    if (timeStr instanceof Date) return timeStr;
    const [hours, minutes] = timeStr.split(":");
    if (hours && minutes) {
      const date = new Date();
      date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      return date;
    }
    return null;
  };

  // Convert pricePerDay: use pricePerdayexculudingVat if available, otherwise convert from including VAT
  let pricePerDayExcluding = "";
  if (apiData.pricePerdayexculudingVat !== undefined && apiData.pricePerdayexculudingVat !== null) {
    pricePerDayExcluding = apiData.pricePerdayexculudingVat.toString();
  } else if (apiData.pricePerDay) {
    pricePerDayExcluding = convertIncludingVatToExcluding(apiData.pricePerDay, vatPercentage);
  }

  return {
    itemName: apiData.name || "",
    category: categoryId,
    quantityAvailable: apiData.quantity?.toString() || "",
    pricePerDay: pricePerDayExcluding,
    description: apiData.description || "",
    warehouseLocation: apiData.warehouseLocation || "",
    warehouseLat: apiData.lat?.toString() || "",
    warehouseLng: apiData.long?.toString() || "",
    image: Array.isArray(apiData.images) ? apiData.images : [],
    serviceFeeEnabled: serviceFeeSettings.isServiceFeeEnabled ?? true,
    baseService: convertIncludingVatToExcluding(serviceFeeSettings.serviceFee, vatPercentage),
    isServiceFeeAlwaysIncluded:
      serviceFeeSettings.isServiceFeeAlwaysIncluded ?? false,
    eveningServiceEnabled:
      serviceFeeSettings.isEveningServiceFeeEnabled ?? false,
    eveningServiceFee: convertIncludingVatToExcluding(serviceFeeSettings.eveningServiceFee, vatPercentage),
    eveningTimeWindow: convertTimeString(
      serviceFeeSettings.eveningTimeWindow
    ),
    morningServiceEnabled:
      serviceFeeSettings.isMorningServiceFeeEnabled ?? false,
    morningServiceFee: convertIncludingVatToExcluding(serviceFeeSettings.morningServiceFee, vatPercentage),
    morningTimeWindow: convertTimeString(
      serviceFeeSettings.morningTimeWindow
    ),
    availableForRental: apiData.isAvailable ?? true,
  };
};

/**
 * Convert form data to API payload format
 */
export const transformFormDataToApiPayload = (formData) => {
  const formatTime = (date) => {
    if (!date) return "";
    if (typeof date === "string") return date;
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return {
    name: formData.itemName.trim(),
    category: formData.category,
    description: formData.description?.trim() || "",
    quantity: parseInt(formData.quantityAvailable, 10) || 0,
    pricePerDay: parseFloat(formData.pricePerDay) || 0,
    pricePerdayexculudingVat: formData.pricePerdayexculudingVat !== undefined 
      ? parseFloat(formData.pricePerdayexculudingVat) || 0 
      : undefined,
    warehouseLocation: formData.warehouseLocation.trim(),
    lat: parseFloat(formData.warehouseLat) || 0,
    long: parseFloat(formData.warehouseLng) || 0,
    images: Array.isArray(formData.image) ? formData.image : [],
    serviceFeeSettings: {
      isServiceFeeEnabled: formData.serviceFeeEnabled,
      // Send excluding VAT for services - backend will convert to including
      serviceFee: formData.serviceFeeEnabled
        ? parseFloat(formData.baseService) || 0
        : 0,
      isEveningServiceFeeEnabled: formData.eveningServiceEnabled,
      eveningServiceFee: formData.eveningServiceEnabled
        ? parseFloat(formData.eveningServiceFee) || 0
        : 0,
      eveningTimeWindow: formData.eveningServiceEnabled
        ? formatTime(formData.eveningTimeWindow)
        : "",
      isMorningServiceFeeEnabled: formData.morningServiceEnabled,
      morningServiceFee: formData.morningServiceEnabled
        ? parseFloat(formData.morningServiceFee) || 0
        : 0,
      morningTimeWindow: formData.morningServiceEnabled
        ? formatTime(formData.morningTimeWindow)
        : "",
      isServiceFeeAlwaysIncluded: formData.isServiceFeeAlwaysIncluded,
    },
    isAvailable: formData.availableForRental,
  };
};

/**
 * Convert API inventory data to table format
 */
export const formatInventoryForTable = (inventoryData) => {
  if (!inventoryData || !Array.isArray(inventoryData)) return [];

  return inventoryData.map((item) => ({
    _id: item._id,
    itemName: item.name || "",
    category:
      typeof item.category === "string"
        ? item.category
        : item.category?.name || "",
    quantity: item.quantity?.toString() || "0",
    quantityBooked: item.quantityBooked?.toString() || "0",
    price: formatNLCurrency(item.pricePerDay) || "0.00",
    pricePerdayexculudingVat: formatNLCurrency(item.pricePerdayexculudingVat) || "0.00",
    availability: item.isAvailable ?? true,
  }));
};

