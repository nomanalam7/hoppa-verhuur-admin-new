import React, { useMemo, useRef, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import exportIcon from "../../../assets/icons/export-icon.svg";
import deleteIcon from "../../../assets/icons/delete.svg";
import CustomButton from "../../../components/customButton";
import TableWrapper from "../../../components/tableWrapper";
import PaginatedTable from "../../../components/dynamicTable";
import Filter from "../../../components/filter";
import { FILTER_MODES } from "../../../utils/filterConfig";
import TransportSettings from "./transportSettings";
import VATSettings from "./vatSettings";
import { useOrders } from "../../../hooks/features/orders";
import { useNavigate } from "react-router-dom";
import { transformOrdersForTable } from "../../../helper/orderHelperData";
import { exportToCSV, exportToExcel } from "../../../helper";
import ConfirmationDialog from "../../../components/popups/confirmation";
import { downloadOrderPdf } from "../../../helper/orderDownlaodPdf";

export default function OrderManagementPage() {
  const transportSettingsRef = useRef(null);
  const confirmationDialogRef = useRef(null);
  const navigate = useNavigate();
  const {
    orders,
    loading,
    page,
    limit,
    total,
    totalPages,
    handleMarkAsConfirmed: apiMarkAsConfirmed,
    handleMarkAsDelivered: apiMarkAsDelivered,
    handleMarkAsPickedUp: apiMarkAsPickedUp,
    handleMarkAsCompleted: apiMarkAsCompleted,
    handleDeleteOrder,
    handlePageChange,
    handleLimitChange,
  } = useOrders();
  const OrderData = transformOrdersForTable(orders);
  const vatSettingsRef = useRef(null);
  const tabs = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
  ];
  const [activeTab, setActiveTab] = useState("today");
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const orderRowsForExport = useMemo(() => {
    if (selectedOrderIds.length === 0) return OrderData;
    return OrderData.filter((row) =>
      selectedOrderIds.includes(row?._id ?? row?.id)
    );
  }, [OrderData, selectedOrderIds]);

  const tableHeader = [
    { id: "orderId", label: "Klant & ID" },
    // { id: "products", label: "Producten" },
    { id: "orderDate", label: "Leveringsdatum" },
    { id: "pickupDate", label: "Ophaaldatum" },
    { id: "createdAt", label: "Aanmaakdatum" },
    { id: "deliveryMethod", label: "Leveringswijze" },
    { id: "totalAmount", label: "Totaalbedrag (incl. BTW)" },
    { id: "status", label: "Status" },
    { id: "paymentStatus", label: "Betalingsstatus" },
    { id: "actions", label: "Acties" },
  ];

  const displayRows = [
    "customerDetails",
    // "products",
    "deliveryDate",
    "pickupDate",
    "createdAt",
    "deliveryMethod",
    "totalAmount",
    "status",
    "paymentStatus",
    "actions",
  ];

  const handleTransportSettings = () => {
    transportSettingsRef.current?.openDrawer();
  };
  const handleVATSettings = () => {
    vatSettingsRef.current?.openDrawer();
  };

  const handleViewDetail = (order) => {
    navigate(`/order-details/${order._id}`);
  };
  const handleDelete = (order) => {
    handleActionWithConfirmation(
      () => handleDeleteOrder(order._id),
      "Bestelling verwijderen",
      "Weet u zeker dat u deze bestelling wilt verwijderen?",
      deleteIcon
    );
  };

  const handleActionWithConfirmation = (action, title, description) => {
    confirmationDialogRef.current.open({
      title,
      description,
      onConfirm: action,
      confirmText: "Ja",
      cancelText: "Nee",
    });
  };

  const handleMarkAsConfirmed = (order) => {
    handleActionWithConfirmation(
      () => apiMarkAsConfirmed(order._id),
      "Bevestig Bestelling",
      "Weet u zeker dat u deze bestelling wilt bevestigen?"
    );
  };
  const handleMarkAsDelivered = (order) => {
    handleActionWithConfirmation(
      () => apiMarkAsDelivered(order._id),
      "Markeren als Geleverd",
      "Weet u zeker dat u deze bestelling als geleverd wilt markeren?"
    );
  };

  const handleMarkAsPickup = (order) => {
    handleActionWithConfirmation(
      () => apiMarkAsPickedUp(order._id),
      "Markeren als Opgehaald",
      "Weet u zeker dat u deze bestelling als opgehaald wilt markeren?"
    );
  };
  const handleMarkAsCompleted = (order) => {
    handleActionWithConfirmation(
      () => apiMarkAsCompleted(order._id),
      "Markeren als Voltooid",
      "Weet u zeker dat u deze bestelling als voltooid wilt markeren?"
    );
  };

  const getOrderTableHeaderForExport = () => [
    {
      id: "customerName",
      label: "Klantnaam",
      value: (row) => row.orderId?.customerName || "",
    },
    {
      id: "orderCode",
      label: "Bestelnummer",
      value: (row) => row.orderId?.orderId || "",
    },
    { id: "deliveryDate", label: "Leveringsdatum" },
    { id: "pickupDate", label: "Ophaaldatum" },
    { id: "totalAmount", label: "Totaalbedrag (incl. BTW)" },
    { id: "status", label: "Bestelstatus" },
    { id: "paymentStatus", label: "Betalingsstatus" },
  ];

  const handleExportOrders = () => {
    const headers = getOrderTableHeaderForExport();
    // exportToCSV(orderRowsForExport, headers, "orders.csv");
    exportToExcel(orderRowsForExport, headers, "orders.xlsx", "Orders");
  };

  const handleDownlaod = (row) => {
    downloadOrderPdf(row._id);
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        gap={2}

      >
        <Typography variant="h4" component="h1" gutterBottom>
          Bestellingen Beheren
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-end", sm: "center" }}
          gap={2}
          width={{ xs: "100%", sm: "auto" }}
        >
          <CustomButton
            btnLabel="Exporteren"
            handlePressBtn={handleExportOrders}
            variant="grayButton"
            startIcon={<img src={exportIcon} alt="export" />}
            width={{ xs: "100%", sm: "auto" }}
          />
          <CustomButton
            btnLabel="VAT Instellingen"
            handlePressBtn={handleVATSettings}
            variant="mainButton"
            width={{ xs: "100%", sm: "auto" }}
          />
          <CustomButton
            btnLabel="Transport Instellingen"
            handlePressBtn={handleTransportSettings}
            variant="mainButton"
            width={{ xs: "100%", sm: "auto" }}
          />
        </Stack>
      </Box>

      <TableWrapper
        title="Bestelbeheer"
        isToggleTabs={false}
        tabs={tabs}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
      >
        <Filter mode={FILTER_MODES.ORDER_MANAGEMENT} />

        <PaginatedTable
          tableHeader={tableHeader}
          isLoading={loading}
          tableData={OrderData}
          displayRows={displayRows}
          showDownload={true}
          onDownload={handleDownlaod}
          showViewDetail={true}
          showDelete={true}
          onViewDetail={handleViewDetail}
          showMarkasConfirmed={true}
          onMarkAsConfirmed={handleMarkAsConfirmed}
          showMarkasDelivered={true}
          onMarkAsDelivered={handleMarkAsDelivered}
          showMarkAsPickup={true}
          onMarkAsPickup={handleMarkAsPickup}
          showMarkasCompleted={true}
          onMarkAsCompleted={handleMarkAsCompleted}
          onDelete={handleDelete}
          onSelectionChange={setSelectedOrderIds}
          showPagination={true}
          paginationMode="server"
          count={total}
          page={page - 1}
          rowsPerPage={limit}
          onPageChange={(newPage) => handlePageChange(newPage + 1)}
          onRowsPerPageChange={handleLimitChange}
        />
      </TableWrapper>

      <TransportSettings ref={transportSettingsRef} />
      <VATSettings ref={vatSettingsRef} />
      <ConfirmationDialog ref={confirmationDialogRef} />
    </>
  );
}
