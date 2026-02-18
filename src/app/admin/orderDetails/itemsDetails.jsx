import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import { Plus as AddIcon } from "lucide-react";
import TextInput from "../../../components/textInput";
import PaginatedTable from "../../../components/dynamicTable";
import { CustomButton } from "../../../components";
import AddItemsDialog from "./addItemsDialog";
import EditItemsDialog from "./editItemsDialog";
import ConfirmationDialog from "../../../components/popups/confirmation";
import deleteIcon from "../../../assets/icons/delete.svg";
import moment from "moment";
import { formatNLCurrency } from "../../../helper";

const safeNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const buildUpdatePayload = (items) => {
  return items.map((x) => ({
    productId: x.productId,
    quantity: safeNumber(x.quantity, 0),
    pricePerDay: safeNumber(x.pricePerDay, 0),
  }));
};

const ItemsDetails = ({ isEditMode, order, onUpdateOrder, actionLoading }) => {
  console.log(actionLoading, "actionLoadingItem");
  const [rentalItems, setRentalItems] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const confirmationDialogRef = useRef(null);
  useEffect(() => {
    if (order?.rentalItems) {
      setRentalItems(order.rentalItems);
    }
  }, [order]);

  const loading = false;

  const subtotal = order?.itemsSubtotal || 0;
  const total = order?.total || 0;
  const serviceFees = order?.serviceFees || {
    baseServiceFee: 0,
    eveningServiceFee: 0,
    morningServiceFee: 0,
  };
  const transportCost = order?.transportCost || 0;
  const distance = order?.distance.toFixed(2) || 0;
  const originalDistance = order?.originalDistance.toFixed(2) || 0;

  const tableHeader = [
    {
      id: "product",
      label: "Product",
    },
    {
      id: "qty",
      label: "Aantal",
    },
    {
      id: "price",
      label: "Prijs",
    },
    {
      id: "rentalDuration",
      label: "Uitgeleverde duur",
    },
  ];

  if (isEditMode) {
    tableHeader.push({
      id: "actionOrder",
      label: "Actie",
    });
  }

  const displayRows = ["product", "qty", "price", "rentalDuration"];
  if (isEditMode) {
    displayRows.push("actionOrder");
  }
  console.log(rentalItems, "RentalItems");
  const tableData = useMemo(() => {
    return rentalItems.map((x) => {
      // const rentalDuration = moment(x.deliveryDate).diff(moment(x.pickupDate), "days");
      // console.log(rentalDuration, "rentalDurationssssssssssssssss");
      return {
        id: x.productId,
        product: x.productName || "-",
        qty: x.quantity,
        price: formatNLCurrency(x.pricePerDay),
        rentalDuration: x.rentalDuration,
        _original: x,
      };
    });
  }, [rentalItems]);

  const updateOrderRentalItems = async (nextItems) => {
    if (!order?._id || typeof onUpdateOrder !== "function") {
      setRentalItems(nextItems);
      return;
    }
    const payload = { rentalItems: buildUpdatePayload(nextItems) };
    const res = await onUpdateOrder(order._id, payload);
  };

  const handleAddConfirm = async (newItems) => {
    console.log(newItems, "newwwwwwwwwwwwwwwww");
    const next = [...rentalItems];
    newItems?.forEach((x) => {
      const idx = next.findIndex(
        (i) => String(i.productId) === String(x.productId)
      );
      if (idx >= 0) {
        next[idx] = {
          ...next[idx],
          quantity:
            safeNumber(next[idx].quantity, 0) + safeNumber(x.quantity, 0),
          pricePerDay: safeNumber(x.pricePerDay, next[idx].pricePerDay),
        };
      } else {
        next.push({
          productId: x.productId,
          productName: x.productName,
          quantity: safeNumber(x.quantity, 0),
          pricePerDay: safeNumber(x.pricePerDay, 0),
        });
      }
    });
    const res = await updateOrderRentalItems(next);
    if (res) {
      setAddOpen(false);
    }
  };

  const handleEdit = (row) => {
    const original = row?._original;
    if (!original) return;
    setEditItem(original);
    setEditOpen(true);
  };

  const handleEditConfirm = async (updated) => {
    const next = rentalItems.map((x) => (x._id === updated._id ? updated : x));
    await updateOrderRentalItems(next);
    setEditOpen(false);
    setEditItem(null);
  };

  const handleDeleteConfirm = async (row) => {
    console.log(row, "row");
    confirmationDialogRef.current.open({
      title: "Delete Item",
      description: "Are you sure you want to delete this item?",
      icon: deleteIcon,
      onConfirm: () => handleDelete(row),
      confirmText: "Delete",
      cancelText: "Cancel",
    });
  };

  const handleDelete = async (row) => {
    const original = row?._original;
    if (!original) return;
    const next = rentalItems.filter((x) => x._id !== original._id);
    await updateOrderRentalItems(next);
  };

  return (
    <Box sx={{ margin: "40px 0px" }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600, color: "#4a5568" }}>
            Verhuurartikelen
          </Typography>
          {isEditMode && (
            <CustomButton
              btnLabel={"Add"}
              variant={"mainButton"}
              handlePressBtn={() => setAddOpen(true)}
              startIcon={<AddIcon />}
              loading={actionLoading}
            />
          )}
        </Box>

        <PaginatedTable
          tableHeader={tableHeader}
          isLoading={loading}
          tableData={tableData}
          displayRows={displayRows}
          onEdit={handleEdit}
          onDelete={handleDeleteConfirm}
        />

        {/* Delivery & Cost Details */}
        <Box sx={{ mt: 6 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, color: "#4a5568", mb: 3 }}
          >
            Levering & Kosten
          </Typography>
          <Grid container spacing={2}>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Typography
                color="#6b7280"
                fontSize="15px"
                fontWeight={500}
                mb={1}
              >
                Afstand (km)
              </Typography>
              <TextInput fullWidth value={distance} disabled={true} />
              {/* <Typography fontSize="10px" color="primary.darkGray" mt={1}>
                Originele afstand: {originalDistance} km
              </Typography> */}

              <Typography fontSize="10px" color="primary.darkGray" mt={1}>
                Dit is de afstand die wordt gebruikt voor de facturering. De originele afstand ({originalDistance} km) wordt vier keer vermenigvuldigd en verminderd met de gratis bezorgafstand.
              </Typography>
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Typography
                color="#6b7280"
                fontSize="15px"
                fontWeight={500}
                mb={1}
              >
                Transportkosten (Auto)
              </Typography>
              <TextInput
                fullWidth
                value={`${formatNLCurrency(transportCost)}`}
                disabled={true}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Service Fee Information */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" fontWeight={600} color="primary.text" mb={3}>
            Servicekosten informatie
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              py: 2,
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <Typography color="primary.text" fontSize="16px" fontWeight={600}>
              Basis servicekosten (opbouw + afbouw)
            </Typography>
            <Typography color="primary.text" fontSize="16px" fontWeight={600}>
              {serviceFees.baseServiceFee}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", py: 2 }}>
            <Typography color="primary.text" fontSize="16px" fontWeight={600}>
              Morning Service Kosten
            </Typography>
            <Typography color="primary.text" fontSize="16px" fontWeight={600}>
              {serviceFees.morningServiceFee}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", py: 2 }}>
            <Typography color="primary.text" fontSize="16px" fontWeight={600}>
              Avondtoeslag
            </Typography>
            <Typography color="primary.text" fontSize="16px" fontWeight={600}>
              {serviceFees.eveningServiceFee}
            </Typography>
          </Box>
        </Box>

        {/* Totals */}
        <Box sx={{ mt: 4, pt: 3, borderTop: "2px solid #e5e7eb" }}>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", py: 1.5 }}
          >
            <Typography color="primary.text" fontSize="17px" fontWeight={600}>
              Subtotaal:
            </Typography>
            <Typography color="primary.text" fontSize="17px" fontWeight={600}>
              {formatNLCurrency(subtotal)}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography color="primary.text" fontSize="19px" fontWeight={600}>
              Totaal: (incl. BTW)
            </Typography>
            <Typography color="primary.text" fontSize="24px" fontWeight={700}>
              {formatNLCurrency(total)}
            </Typography>
          </Box>
        </Box>

      </Paper>

      <AddItemsDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onConfirm={handleAddConfirm}
        order={order}
        actionLoading={actionLoading}
      />
      <EditItemsDialog
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditItem(null);
        }}
        item={editItem}
        onConfirm={handleEditConfirm}
        loading={actionLoading}
      />
      <ConfirmationDialog ref={confirmationDialogRef} />
    </Box>
  );
};

export default ItemsDetails;
