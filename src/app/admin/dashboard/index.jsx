import React, { useState, useMemo, useEffect, useRef } from "react";
import { Box, Typography, Grid, Stack } from "@mui/material";
import moment from "moment";
import blueCheckIcon from "../../../assets/icons/planned.svg";
import yellowItemIcon from "../../../assets/icons/yellow-items.svg";
import revenueIcon from "../../../assets/icons/orange-check.svg";
import redAlertIcon from "../../../assets/icons/red-alert.svg";
import TallyCard from "../../../components/cards/tallyCard";
import OrdersOverviewChart from "./orderCharts";
import OverdueOrders from "./overdueOrders";
import TableWrapper from "../../../components/tableWrapper";
import PaginatedTable from "../../../components/dynamicTable";
import Filter from "../../../components/filter";
import { FILTER_MODES } from "../../../utils/filterConfig";
import { useDashboard } from "../../../hooks/features/dashboard";
import DateRange from "./dateRange";
import useFilterSliceKey from "../../../zustand/filter_slice_key";
import { useNavigate } from "react-router-dom";
import ConfirmationDialog from "../../../components/popups/confirmation";
import ChartSkeleton from "../../../components/skeleton/ChartSkeleton";
import TallyCardSkeleton from "../../../components/skeleton/CardSkeleton";
import OverdueOrdersSkeleton from "../../../components/skeleton/OverdueOrdersSkeleton";
import { downloadOrderPdf } from "../../../helper/orderDownlaodPdf";
import { formatNLCurrency } from "../../../helper";

export default function DashboardPage() {
  const {
    dashboard,
    orders,
    loading,
    ordersLoading,
    dashboardFilters,
    refetchAll,
    handleMarkAsConfirmed: apiMarkAsConfirmed,
    handleMarkAsDelivered: apiMarkAsDelivered,
    handleMarkAsPickedUp: apiMarkAsPickedUp,
    handleMarkAsCompleted: apiMarkAsCompleted,
  } = useDashboard();
  const setFilterValue = useFilterSliceKey((state) => state.setFilterValue);
  const [activeTab, setActiveTab] = useState("today");
  const navigate = useNavigate();
  const confirmationDialogRef = useRef();
  const tabs = [
    {
      label: "Vandaag",
      value: "today",
    },
    {
      label: "Deze week",
      value: "week",
    },
  ];

  // Transform mainStats to tally cards data
  const tallyData = useMemo(() => {
    if (!dashboard?.mainStats) {
      return [
        {
          id: 1,
          icon: blueCheckIcon,
          count: 0,
          label: "Planned Orders",
          iconBgColor: "#E3F2FD",
          iconColor: "#1976D2",
        },
        {
          id: 2,
          icon: yellowItemIcon,
          count: 0,
          label: "Active Rentals",
          iconBgColor: "#FFF9E6",
          iconColor: "#F59E0B",
        },
        {
          id: 3,
          icon: revenueIcon,
          count: 0,
          label: "Completed",
          iconBgColor: "#FFF4E6",
          iconColor: "#F97316",
        },
        {
          id: 4,
          icon: redAlertIcon,
          count: 0,
          label: "Overdue Pickups",
          iconBgColor: "rgba(249, 22, 64, 0.1)",
          iconColor: "#F97316",
        },
      ];
    }

    return [
      {
        id: 1,
        icon: blueCheckIcon,
        count: dashboard.mainStats.plannedOrders || 0,
        label: "Geplande bestellingen",
        iconBgColor: "#E3F2FD",
        iconColor: "#1976D2",
      },
      {
        id: 2,
        icon: yellowItemIcon,
        count: dashboard.mainStats.activeRentals || 0,
        label: "Actieve verhuur",
        iconBgColor: "#FFF9E6",
        iconColor: "#F59E0B",
      },
      {
        id: 3,
        icon: revenueIcon,
        count: dashboard.mainStats.completed || 0,
        label: "Voltooid",
        iconBgColor: "#FFF4E6",
        iconColor: "#F97316",
      },
      {
        id: 4,
        icon: redAlertIcon,
        count: dashboard.mainStats.overduePickups || 0,
        label: "Te late afhalingen",
        iconBgColor: "rgba(249, 22, 64, 0.1)",
        iconColor: "#F97316",
      },
    ];
  }, [dashboard?.mainStats]);

  // Transform overdueOrders for OverdueOrders component
  const overdueOrdersData = useMemo(() => {
    if (!dashboard?.overdueOrders || !Array.isArray(dashboard.overdueOrders)) {
      return [];
    }

    return dashboard.overdueOrders.map((order) => ({
      name: order.customerName || order.name || "N/A",
      item: order.productName || order.item || "N/A",
      pickup: order.pickupDate
        ? moment(order.pickupDate).format("DD-MM-YYYY")
        : order.pickup || "N/A",
      overdue: order.daysOverdue,
    }));
  }, [dashboard?.overdueOrders]);

  const tableHeader = [
    { id: "customer", label: "Klant & ID" },
    // { id: "products", label: "Producten" },
    { id: "eventDate", label: "Evenementdatum" },
    { id: "date", label: "Datum" },
    { id: "pickupDate", label: "Ophaaldatum" },
    { id: "total", label: "Totaalbedrag (incl. BTW)" },
    { id: "status", label: "Status" },
    { id: "paymentStatus", label: "Betalingsstatus" },
    { id: "actions", label: "Acties" },
  ];

  const displayRows = [
    "customer",
    // "products",
    "eventDate",
    "date",
    "pickupDate",
    "total",
    "status",
    "paymentStatus",
    "actions",
  ];

  // Transform orders data for table
  const tableData = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];

    return orders.map((order, index) => ({
      id: order._id || index + 1,
      _id: order._id,
      customer: order.customer?.name
        ? `${order.customer.name} ${order.orderId || order.customer.id || ""}`
        : order.orderId || "N/A",
      products: order.products || "N/A",
      eventDate: order.eventDate
        ? moment(order.eventDate).format("DD-MM-YYYY")
        : "N/A",
      date: order.deliveryDate
        ? moment(order.deliveryDate).format("DD-MM-YYYY")
        : order.eventDate
          ? moment(order.eventDate).format("DD-MM-YYYY")
          : "N/A",
      pickupDate: order.pickupDate
      ,
      total: formatNLCurrency(order.total) || 0,
      status: order.status || "N/A",
      paymentStatus: order.paymentStatus || "N/A",
      originalData: order, // Keep original data for handlers
    }));
  }, [orders]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFilterValue(FILTER_MODES.DASHBOARD, "period", tab);
  };

  useEffect(() => {
    if (dashboardFilters?.period && dashboardFilters.period !== activeTab) {
      setActiveTab(dashboardFilters.period);
    } else if (!dashboardFilters?.period) {
      setFilterValue(FILTER_MODES.DASHBOARD, "period", activeTab);
    }
  }, [dashboardFilters?.period]);
  const handleViewDetail = (order) => {
    navigate(`/order-details/${order._id}`);
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

  const handleDownlaod = (row) => {
    downloadOrderPdf(row._id);
  };

  return (
    <>
      <Box
        display={"flex"}
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent={"space-between"}
        mb={2}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>

        <DateRange />
      </Box>
      <Grid container spacing={3}>
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
            <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <TallyCardSkeleton />
            </Grid>
          ))
          : tallyData.map((item) => (
            <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={item.id}>
              <TallyCard
                icon={item.icon}
                count={item.count}
                label={item.label}
                iconBgColor={item.iconBgColor}
                iconColor={item.iconColor}
              />
            </Grid>
          ))}
      </Grid>
      <Grid container spacing={3}>
        <Grid item size={{ xs: 12, sm: 6, md: 8 }}>
          {loading ? (
            <ChartSkeleton />
          ) : (
            <OrdersOverviewChart
              sevenDayOverview={dashboard?.sevenDayOverview || []}
            />
          )}
        </Grid>

        <Grid item size={{ xs: 12, sm: 6, md: 4 }}>
          {loading ? (
            <OverdueOrdersSkeleton />
          ) : (
            <OverdueOrders orders={overdueOrdersData} />
          )}
        </Grid>
      </Grid>

      <TableWrapper
        title="Aankomende bestellingen"
        isToggleTabs={true}
        tabs={tabs}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
      >
        <Filter mode={FILTER_MODES.DASHBOARD} />

        <PaginatedTable
          tableHeader={tableHeader}
          tableData={tableData}
          displayRows={displayRows}
          isLoading={ordersLoading}
          showDownload={true}
          onDownload={handleDownlaod}
          showViewDetail={true}
          onViewDetail={handleViewDetail}
          showMarkasConfirmed={true}
          onMarkAsConfirmed={handleMarkAsConfirmed}
          showMarkasDelivered={true}
          onMarkAsDelivered={handleMarkAsDelivered}
          showMarkAsPickup={true}
          onMarkAsPickup={handleMarkAsPickup}
          showMarkasCompleted={true}
          onMarkAsCompleted={handleMarkAsCompleted}
        />
      </TableWrapper>
      <ConfirmationDialog ref={confirmationDialogRef} />
    </>
  );
}
