import React, { useState, useMemo, useEffect } from "react";
import { Box, Typography, Grid, Stack } from "@mui/material";
import moment from "moment";
import CustomButton from "../../../components/customButton";
import exportIcon from "../../../assets/icons/export-icon.svg";
import blueCheckIcon from "../../../assets/icons/blue-checked.svg";
import yellowItemIcon from "../../../assets/icons/yellow-items.svg";
import revenueIcon from "../../../assets/icons/reveneu.svg";
import TallyCard from "../../../components/cards/tallyCard";
import RevenueChart from "./revenueCharts";
import TableWrapper from "../../../components/tableWrapper";
import PaginatedTable from "../../../components/dynamicTable";
import TopProducts from "./topProducts";
import { FILTER_MODES } from "../../../utils/filterConfig";
import Filter from "../../../components/filter";
import ToggleTabs from "../../../components/toggleTabs";
import { useReports } from "../../../hooks/features/reports";
import useFilterSliceKey from "../../../zustand/filter_slice_key";
import { useNavigate } from "react-router-dom";
import { exportToCSV, exportToExcel, formatNLCurrency } from "../../../helper";
import TopProductsSkeleton from "../../../components/skeleton/TopProductsSkeleton";
import { downloadOrderPdf } from "../../../helper/orderDownlaodPdf";
import TallyCardSkeleton from "../../../components/skeleton/CardSkeleton";
import ChartSkeleton from "../../../components/skeleton/ChartSkeleton";

export default function ReportsPage() {
  const {
    reports,
    orders,
    topProducts,
    loading,
    ordersLoading,
    reportFilters,
  } = useReports();
  const navigate = useNavigate();
  const setFilterValue = useFilterSliceKey((state) => state.setFilterValue);
  const [activeTab, setActiveTab] = useState("month");
  const [selectedReportOrderIds, setSelectedReportOrderIds] = useState([]);
  const tabs = [
    {
      label: "Vandaag",
      value: "today",
    },
    {
      label: "Deze week",
      value: "week",
    },
    {
      label: "Deze maand",
      value: "month",
    },
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFilterValue(FILTER_MODES.REPORTS, "period", tab);
  };

  // Sync activeTab with filter period
  useEffect(() => {
    if (reportFilters?.period && reportFilters.period !== activeTab) {
      setActiveTab(reportFilters.period);
    } else if (!reportFilters?.period && activeTab) {
      setFilterValue(FILTER_MODES.REPORTS, "period", activeTab);
    }
  }, [reportFilters?.period]);

  // Transform reportingStats to tally cards data
  const tallyData = useMemo(() => {
    if (!reports?.reportingStats) {
      return [
        {
          id: 1,
          icon: blueCheckIcon,
          count: 0,
          label: "Totale Bestellingen",
          iconBgColor: "#E3F2FD",
          iconColor: "#1976D2",
        },
        {
          id: 2,
          icon: yellowItemIcon,
          count: 0,
          label: "Voltooide Bestellingen",
          iconBgColor: "#FFF9E6",
          iconColor: "#F59E0B",
        },
        {
          id: 3,
          icon: revenueIcon,
          count: "€0.00",
          label: "Totale Omzet (Excl. BTW)",
          iconBgColor: "#FFF4E6",
          iconColor: "#F97316",
        },
      ];
    }

    const stats = reports.reportingStats;
    return [
      {
        id: 1,
        icon: blueCheckIcon,
        count: stats.totalOrders || 0,
        label: "Totale Bestellingen",
        iconBgColor: "#E3F2FD",
        iconColor: "#1976D2",
      },
      {
        id: 2,
        icon: yellowItemIcon,
        count: stats.completedOrders || 0,
        label: "Voltooide Bestellingen",
        iconBgColor: "#FFF9E6",
        iconColor: "#F59E0B",
      },
      {
        id: 3,
        icon: revenueIcon,
        count:  formatNLCurrency(stats?.totalRevenueExclVAT) || 0,
        label: "Totale Omzet (Excl. BTW)",
        iconBgColor: "#FFF4E6",
        iconColor: "#F97316",
      },
    ];
  }, [reports?.reportingStats]);

  const tableHeader = [
    { id: "customerId", label: "Klant & ID" },
    // { id: "customerName", label: "Klantnaam" },
    // { id: "product", label: "Producten" },
    { id: "deliveryDate", label: "Leverdatum" },
    { id: "pickupDate", label: "Ophaaldatum" },
    { id: "priceVat", label: "Prijs (incl. btw)" },
    { id: "priceExVat", label: "Prijs (excl. btw)" },
    { id: "total", label: "Totaal" },
    { id: "status", label: "Status" },
    { id: "actions", label: "Acties" },
  ];

  // Transform orders data for table
  const tableData = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];

    return orders.map((order, index) => ({
      id: order._id || index + 1,
      _id: order._id,
      customer: order.customer,
      customerId: order.orderId || "N/A",
      customerName: order.customer?.name || "N/A",
      product: order.products || "N/A",
      deliveryDate: order.deliveryDate,
      pickupDate: order.pickupDate
      ,
      priceVat: formatNLCurrency(order.inclVat), // Not in API response
      priceExVat: formatNLCurrency(order.exclVat), // Not in API response
      total: formatNLCurrency(order?.total) || 0,
      status: order.status || "N/A",
      originalData: order,
    }));
  }, [orders]);

  const reportRowsForExport = useMemo(() => {
    if (selectedReportOrderIds.length === 0) return tableData;
    return tableData.filter((row) =>
      selectedReportOrderIds.includes(row?._id ?? row?.id)
    );
  }, [selectedReportOrderIds, tableData]);

  const getReportColumnsForExport = () => [
    {
      id: "customerName",
      label: "Klantnaam",
      value: (row) => row.customerName,
    },
    {
      id: "customerId",
      label: "Bestelnummer",
      value: (row) => row.customerId,
    },
    { id: "deliveryDate", label: "Leveringsdatum" },
    { id: "pickupDate", label: "Ophaaldatum" },
    { id: "priceVat", label: "Prijs (incl. btw)" },
    { id: "priceExVat", label: "Prijs (excl. btw)" },
    { id: "total", label: "Totaalbedrag (incl. BTW)" },
    { id: "status", label: "Bestelstatus" },
  ];

  const handleExportReportOrders = () => {
    const columns = getReportColumnsForExport();
    // exportToCSV(reportRowsForExport, columns, "completed-orders.csv");
    exportToExcel(
      reportRowsForExport,
      columns,
      "completed-orders.xlsx",
      "Completed Orders"
    );
  };

  const displayRows = [
    "reportCustomer",
    // "customerName",
    // "product",
    "deliveryDate",
    "pickupDate",
    "priceVat",
    "priceExVat",
    "total",
    "status",
    "actions",
  ];

  // Transform topProducts data
  const transformedTopProducts = useMemo(() => {
    if (!topProducts || !Array.isArray(topProducts)) return [];

    return topProducts.map((product, index) => ({
      id: product._id || index + 1,
      name: product.productName || product.name || "N/A",
      rentals: product.rentals || 0,
      percent: product.percentage || product.percent || 0,
    }));
  }, [topProducts]);

  const handleViewDetail = (order) => {
    navigate(`/order-details/${order._id}`);
  };

  const handleDownlaod = (row) => {
    downloadOrderPdf(row._id);
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        mb={3}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Rapporten
        </Typography>

      </Box>

      <Grid container spacing={3}>
        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
            <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <TallyCardSkeleton />
            </Grid>
          ))
          : tallyData.map((item) => (
            <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
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

      <Box mt={3} bgcolor="#fff" p={3} borderRadius="16px">
        {loading ? (
          <ChartSkeleton />
        ) : (
          <>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent={{ xs: "flex-start", sm: "space-between" }}
              alignItems={{ xs: "flex-start", sm: "center" }}
              gap={2}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                Omzetgrafiek
              </Typography>

              <ToggleTabs
                tabs={tabs}
                activeTab={activeTab}
                onChange={handleTabChange}
              />
            </Stack>

            <RevenueChart
              revenueOverview={reports?.revenueOverview || null}
              loading={loading}
            />
          </>
        )}
      </Box>
      <Box my={3}>
        <Grid container spacing={3}>
          <Grid item size={{ xs: 12, sm: 6, md: 10 }}>
            <Filter mode={FILTER_MODES.REPORTS} />
          </Grid>
          <Grid item size={{ xs: 12, sm: 6, md: 2 }}>
            <CustomButton
              variant="grayButton"
              btnLabel="Export Excel"
              handlePressBtn={handleExportReportOrders}
              startIcon={<img src={exportIcon} alt="export" />}
              width="100%"
            />
          </Grid>
        </Grid>

      </Box>
      <Grid container spacing={3}>
        <Grid item size={{ xs: 12, sm: 6, md: 9 }}>
          <TableWrapper title="Overzicht Voltooide Bestellingen">
            <PaginatedTable
              tableHeader={tableHeader}
              tableData={tableData}
              displayRows={displayRows}
              isLoading={ordersLoading}
              showPagination={true}
              showViewDetail={true}
              showDownload={true}
              onViewDetail={handleViewDetail}
              onDownload={handleDownlaod}
              onSelectionChange={setSelectedReportOrderIds}
            />
          </TableWrapper>
        </Grid>
        <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
          {loading ? (
            <TopProductsSkeleton />
          ) : (
            <TopProducts topProducts={transformedTopProducts} />
          )}
        </Grid>
      </Grid>
    </>
  );
}
