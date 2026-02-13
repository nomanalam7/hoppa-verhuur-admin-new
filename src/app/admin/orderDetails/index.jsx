import React, { useState, useEffect, useRef } from "react";
import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import backIcon from "../../../assets/icons/arrow-left.svg";
import deleteIcon from "../../../assets/icons/delete.svg";
import { useNavigate, useParams } from "react-router-dom";
import ImageSection from "./imageSection";
import ClientDetails from "./clientDetails";
import Actions from "./actions";
import OrderActions from "./actions";
import ItemsDetails from "./itemsDetails";
import { CustomButton } from "../../../components";
import { useOrderDetails } from "../../../hooks/features/orderDetails";
import moment from "moment";
import ConfirmationDialog from "../../../components/popups/confirmation";
import Notes from "./notes";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const confirmationDialogRef = useRef();
  const {
    selectedOrder,
    loading,
    actionLoading,
    fetchOrderById,
    handleUpdateOrder,
    handleMarkAsPickedUp,
    handleMarkAsDelivered,
    handleMarkAsConfirmed,
    handleMarkAsCompleted,
    handleDeleteOrder,
    handleAddAdminNotes,
  } = useOrderDetails();

  useEffect(() => {
    if (id) {
      fetchOrderById(id);
    }
  }, [id, fetchOrderById]);

  if (loading || !selectedOrder) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const handleActionWithConfirmation = (action, title, description) => {
    confirmationDialogRef.current.open({
      title,
      description,
      onConfirm: action,
      confirmText: "Ja",
      cancelText: "Nee",
    });
  };

  const clientData = {
    name:
      `${selectedOrder?.customerDetails?.firstName || ""} ${selectedOrder?.customerDetails?.lastName || ""
        }`.trim() || "---",
    email: selectedOrder?.customerDetails?.email || "---",
    phone: selectedOrder?.customerDetails?.phoneNumber || "---",
    deliveryMethod: selectedOrder?.pickupDeliveryType || "---",
    deliveryAddress: selectedOrder?.deliveryAddress || "---",
    pickupAddress: selectedOrder?.pickupAddress || "---",
    orderId: selectedOrder?.orderId || "---",
    deliveryDate: selectedOrder?.deliveryDate
      ? moment(selectedOrder.deliveryDate).format("DD-MM-YYYY")
      : "---",
    deliveryTime: selectedOrder?.deliveryTime || "---",
    pickupDate: selectedOrder?.pickupDate
      ? moment(selectedOrder.pickupDate).format("DD-MM-YYYY")
      : "---",
    pickupTime: selectedOrder?.pickupTime || "---",
    status: selectedOrder?.status || "Planned",
  };

  const handleAddAdminNotesFunction = (note) => {
    handleAddAdminNotes(selectedOrder._id, { note });
  };

  return (
    <>
      <Box display="flex" alignItems="center" gap={1}>
        <img src={backIcon} alt="order-details" style={{ cursor: "pointer" }} onClick={() => navigate(-1)} />
        <Typography variant="h6">Bestelgegevens</Typography>
      </Box>

      <Grid container spacing={2} mt={2}>
        <Grid item size={{ xs: 12, md: 7 }}>
          <ClientDetails clientData={clientData} />
        </Grid>
        <Grid item size={{ xs: 12, md: 5 }}>
          <OrderActions
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
            order={selectedOrder}
            loading={loading}
            onConfirm={() =>
              handleActionWithConfirmation(
                () => handleMarkAsConfirmed(selectedOrder._id),
                "Bevestig bestelling",
                "Weet u zeker dat u deze bestelling wilt bevestigen?"
              )
            }
            onDeliver={() =>
              handleActionWithConfirmation(
                () => handleMarkAsDelivered(selectedOrder._id),
                "Markeer als geleverd",
                "Weet u zeker dat u deze bestelling als geleverd wilt markeren?"
              )
            }
            onPickup={() =>
              handleActionWithConfirmation(
                () => handleMarkAsPickedUp(selectedOrder._id),
                "Markeer als opgehaald",
                "Weet u zeker dat u deze bestelling als opgehaald wilt markeren?"
              )
            }
            onComplete={() =>
              handleActionWithConfirmation(
                () => handleMarkAsCompleted(selectedOrder._id),
                "Markeer als voltooid",
                "Weet u zeker dat u deze bestelling als voltooid wilt markeren?"
              )
            }
            onDelete={() =>
              handleActionWithConfirmation(
                async () => {
                  const res = await handleDeleteOrder(selectedOrder._id);
                  if (res) {
                    navigate("/order-management");
                  }
                },
                "Bestelling verwijderen",
                "Weet u zeker dat u deze bestelling wilt verwijderen?",
                deleteIcon
              )
            }
          />
        </Grid>
      </Grid>

      <ItemsDetails
        isEditMode={isEditMode}
        order={selectedOrder}
        onUpdateOrder={handleUpdateOrder}
        actionLoading={actionLoading}
      />

      <Notes
        adminNotes={selectedOrder?.adminNotes}
        addAdminNotes={handleAddAdminNotesFunction}
      />


      {/* {isEditMode && (
        <Box width="100%" display="flex" justifyContent="flex-end" gap={2} mt={2}>
          <CustomButton
            btnLabel={"Annuleren"}
            handlePressBtn={() => setIsEditMode(!isEditMode)}
            variant="grayButton"
          />
          <CustomButton
            btnLabel={"Opslaan"}
            handlePressBtn={() => setIsEditMode(!isEditMode)}
            variant="mainButton"
          />
        </Box>
      )} */}
      <ConfirmationDialog ref={confirmationDialogRef} />
    </>
  );
};

export default OrderDetailsPage;
