import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Typography, Stack, Grid } from "@mui/material";
import { CustomButton } from "../../../components";
import TallyCard from "../../../components/cards/tallyCard";
import exportIcon from "../../../assets/icons/export-icon.svg";
import blueCheckIcon from "../../../assets/icons/blue-checked.svg";
import yellowItemIcon from "../../../assets/icons/yellow-items.svg";
import bookedIcon from "../../../assets/icons/booked.svg";
import purpleAlertIcon from "../../../assets/icons/alert.svg";
import { Plus } from "lucide-react";
import TableWrapper from "../../../components/tableWrapper";
import PaginatedTable from "../../../components/dynamicTable";
import Filter from "../../../components/filter";
import { FILTER_MODES } from "../../../utils/filterConfig";
import AddEditTentInventoryDrawer from "./addEdit";
import { useInventory } from "../../../hooks/features/inventory";
import {
  exportToCSV,
  exportToExcel,
  formatInventoryForTable,
} from "../../../helper";
import TallyCardSkeleton from "../../../components/skeleton/CardSkeleton";
import ConfirmationDialog from "../../../components/popups/confirmation";
import deleteIcon from "../../../assets/icons/delete.svg";

export default function TentInventoryPage() {
  const drawerRef = useRef(null);
  const confirmationDialogRef = useRef(null);
  const [selectedInventoryIds, setSelectedInventoryIds] = useState([]);
  const {
    handleGetInventoryById,
    handleAddInventory,
    handleUpdateInventory,
    handleFetchCategories,
    handleDeleteInventory,
    categories,
    inventoryData,
    loading,
    handleGetInventoryStats,
    inventoryStats,
    updateOrder,
  } = useInventory();

  console.log(inventoryStats, "inventoryStats");

  // Handle Add New Item - Opens drawer for new item
  const handleAddNewItem = () => {
    drawerRef.current?.openDrawer(null, {
      onSave: handleAddInventory,
      categories,
      loading,
    });
  };

  // Handle Edit Item - Fetch data and open drawer
  const handleEditItem = async (row) => {
    const itemId = row._id || row.id || row;
    try {
      const response = await handleGetInventoryById(itemId);
      if (response.success && response.data) {
        drawerRef.current?.openDrawer(response.data, {
          onSave: (payload) => handleUpdateInventory(itemId, payload),
          categories,
          loading,
        });
      }
    } catch (error) {
      console.error("Failed to fetch item:", error);
    }
  };

  useEffect(() => {
    handleGetInventoryStats();
  }, [handleGetInventoryStats]);

  const tallyData = [
    {
      id: 1,
      icon: blueCheckIcon,
      count: inventoryStats?.totalItems,
      label: "Totaal aantal items",
      iconBgColor: "#E3F2FD",
      iconColor: "#1976D2",
    },
    {
      id: 2,
      icon: yellowItemIcon,
      count: inventoryStats?.availableItems,
      label: "Beschikbare items",
      iconBgColor: "#FFF9E6",
      iconColor: "#F59E0B",
    },
    {
      id: 3,
      icon: bookedIcon,
      count: inventoryStats?.bookedItems,
      label: "Gereserveerde items",
      iconBgColor: "#FFF4E6",
      iconColor: "#F97316",
    },
    {
      id: 4,
      icon: purpleAlertIcon,
      count: inventoryStats?.unavailableItems,
      label: "Niet-beschikbare items",
      iconBgColor: "#F3E8FF",
      iconColor: "#9333EA",
    },
  ];

  const tableHeader = [
    { id: "itemName", label: "Artikelnaam" },
    { id: "category", label: "Categorie" },
    { id: "quantity", label: "Beschikbare hoeveelheid" },
    { id: "bookedQuantity", label: "Gereserveerde hoeveelheid" },
    { id: "price", label: "Prijs per dag (incl. BTW)" },
    { id: "pricePerdayexculudingVat", label: "Prijs per dag (excl. BTW)" },
    { id: "availability", label: "Beschikbaarheid" },
    { id: "actions", label: "Acties" },
  ];

  // Format inventory data for table
  const tableData = React.useMemo(() => {
    return formatInventoryForTable(inventoryData);
  }, [inventoryData]);

  const inventoryRowsForExport = useMemo(() => {
    if (selectedInventoryIds.length === 0) return tableData;
    return tableData.filter((row) =>
      selectedInventoryIds.includes(row?._id ?? row?.id)
    );
  }, [selectedInventoryIds, tableData]);

  const getInventoryColumnsForExport = () => [
    { id: "itemName", label: "Artikelnaam" },
    { id: "category", label: "Categorie" },
    { id: "quantity", label: "Beschikbare hoeveelheid" },
    { id: "price", label: "Prijs per dag" },
    {
      id: "availability",
      label: "Beschikbaarheid",
      value: (row) => (row?.availability ? "Beschikbaar" : "Niet beschikbaar"),
    },
  ];

  const handleExportInventory = () => {
    const columns = getInventoryColumnsForExport();
    exportToCSV(inventoryRowsForExport, columns, "tent-inventory.csv");
    exportToExcel(
      inventoryRowsForExport,
      columns,
      "tent-inventory.xlsx",
      "Tent Inventory"
    );
  };

  const handleAvailabilityChange = async (checked, row) => {
    console.log(row, "rowssssssssssssssssss");

    const response = await handleUpdateInventory(row._id, {
      isAvailable: checked,
    });

    if (response.success) {
      showSuccess({
        title: "Availability updated successfully",
      });
    }
  };

  const handleDeleteItem = async (row) => {
    const itemId = row._id || row.id;
    confirmationDialogRef.current.open({
      title: "Weet je zeker dat je dit item wilt verwijderen?",
      description: "Dit item zal niet meer beschikbaar zijn in de vooraad.",
      onConfirm: () => handleDeleteInventory(itemId),
      icon: deleteIcon,
    });
  };

  const tableDataWithHandlers = tableData.map((item) => ({
    ...item,
    // onAvailabilityChange: handleAvailabilityChange,
  }));

  const DISPLAY_ROWS = [
    "itemName",
    "category",
    "quantity",
    "quantityBooked",
    "price",
    "pricePerdayexculudingVat",
    "availability",
    "actions",
  ];
  return (
    <>
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        gap={2}
        mb={3}
      >
        <Typography variant="h4" component="h1">
          Vooraad
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          width={{ xs: "100%", sm: "auto" }}
        >
          <CustomButton
            variant="grayButton"
            btnLabel="Excel exporteren"
            handlePressBtn={handleExportInventory}
            startIcon={<img src={exportIcon} alt="export" />}
            width={{ xs: "100%", sm: "auto" }}
          />
          <CustomButton
            variant="mainButton"
            btnLabel="Nieuw item toevoegen"
            handlePressBtn={handleAddNewItem}
            startIcon={<Plus />}
            width={{ xs: "100%", sm: "auto" }}
          />
        </Stack>
      </Box>

      {/* Tally Cards Grid */}
      <Grid container spacing={3}>
        {loading
          ? Array.from(new Array(4)).map((_, index) => (
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

      <TableWrapper title="Tentvoorraad">
        <Box mb={3}>
          <Filter mode={FILTER_MODES.TENT_INVENTORY} />
        </Box>

        <PaginatedTable
          tableData={tableDataWithHandlers}
          displayRows={DISPLAY_ROWS}
          tableHeader={tableHeader}
          showViewDetail={true}
          showInventoryDelete={true}
          onViewDetail={handleEditItem}
          onInventoryDelete={handleDeleteItem}
          handleAvailabilityChange={handleAvailabilityChange}
          isLoading={loading}
          onSelectionChange={setSelectedInventoryIds}
        />
      </TableWrapper>

      {/* Add/Edit Drawer */}
      <AddEditTentInventoryDrawer ref={drawerRef} />
      <ConfirmationDialog ref={confirmationDialogRef} />  
    </>
  );
}
