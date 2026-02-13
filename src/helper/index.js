import axios from "axios";
import * as XLSX from "xlsx";

export const uploadMedia = async (file) => {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", "hoppa-verhuur");
  form.append("cloud_name", "dohbvewd2");

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/dohbvewd2/image/upload`,
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
      return response.data.secure_url;
    } else {
      throw new Error("Image uploading failed.");
    }
  } catch (error) {
    throw new Error("Image uploading failed.");
  }
};

const normalizeExportColumns = (columns) =>
  (columns || []).map((col) => {
    if (typeof col === "string") return { id: col, label: col };
    return {
      id: col?.id,
      label: col?.label || col?.title || col?.id,
      value: typeof col?.value === "function" ? col.value : undefined,
    };
  });

const getCellValue = (row, col) => {
  if (col?.value) return col.value(row);
  if (!col?.id) return "";
  const key = col.id === "id" ? "itemId" : col.id;
  if (key === "rentalPricePerDay") return `€${row?.rentalPrice || "0.00"}`;
  if (key === "salePrice") return `€${row?.salePrice || "0.00"}`;
  const value = row?.[key];
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return value;
};

const escapeCSVValue = (value) => {
  const str = value === null || value === undefined ? "" : String(value);
  const escaped = str.replace(/"/g, '""');
  if (/[",\n\r]/.test(escaped)) return `"${escaped}"`;
  return escaped;
};

export const exportToCSV = (data, headers, filename = "export.csv") => {
  if (!data || !Array.isArray(data) || data.length === 0) return;

  const columns = normalizeExportColumns(headers);
  const csvHeaders = columns.map((c) => escapeCSVValue(c.label || c.id || ""));
  const csvData = data.map((row) =>
    columns.map((col) => escapeCSVValue(getCellValue(row, col)))
  );

  const csv = [
    csvHeaders.join(","),
    ...csvData.map((row) => row.join(",")),
  ].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportToExcel = (
  data,
  columns,
  filename = "export.xlsx",
  sheetName = "Sheet1"
) => {
  if (!data || !Array.isArray(data) || data.length === 0) return;

  const normalizedColumns = normalizeExportColumns(columns);
  const headerRow = normalizedColumns.map((c) => c.label || c.id || "");
  const dataRows = data.map((row) =>
    normalizedColumns.map((col) => getCellValue(row, col))
  );

  const ws = XLSX.utils.aoa_to_sheet([headerRow, ...dataRows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename);
};

export const formatNLCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return "€0,00";

  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};


// Re-export inventory helper functions for backward compatibility
export {
  transformApiResponseToFormData,
  transformFormDataToApiPayload,
  formatInventoryForTable,
} from "./inventoryHelper";
