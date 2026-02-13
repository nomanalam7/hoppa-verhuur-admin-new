import React, { useState } from "react";
import { Box, Button, Card, Stack, Typography } from "@mui/material";
import { CustomButton } from "../../../components";
import { downloadOrderPdf } from "../../../helper/orderDownlaodPdf";

const OrderActions = ({
  isEditMode,
  setIsEditMode,
  order,
  onConfirm,
  onDeliver,
  onPickup,
  onComplete,
  loading,
  onDelete 
}) => {
  const status = order?.status || "Planned";
  const paymentStatus = order?.paymentStatus || "Unpaid";
  const isDelivered = order?.isDelivered || false;
  const isPickedUp = order?.isPickedUp || false;

  const getPrimaryAction = () => {
    // Payment unpaid -> Confirm order
    if (paymentStatus === "Unpaid") {
      return {
        label: "Bestelling bevestigen",
        action: onConfirm,
      };
    }
    
    // Payment paid and not delivered yet -> Mark as delivered
    if (paymentStatus === "Paid" && !isDelivered) {
      return {
        label: "Markeren als geleverd",
        action: onDeliver,
      };
    }
    
    // Delivered but not picked up yet -> Mark as picked up
    if (isDelivered && !isPickedUp) {
      return {
        label: "Markeren als opgehaald",
        action: onPickup,
      };
    }
    
    // Picked up -> Mark as complete
    if (isPickedUp && status === "Picked Up" || status === "Overdue") {
      return {
        label: "Markeren als voltooid",
        action: onComplete,
      };
    }
    
    return null;
  };
  
  const primaryAction = getPrimaryAction();

  const showEditDelete = paymentStatus === "Unpaid";
  const openWhatsApp = () => {
    const phone = order?.customerDetails?.phoneNumber?.replace(/^0/, "92");

    if (!phone) return;

    const itemsText = order?.rentalItems
      ?.map(
        (item, index) =>
          `${index + 1}. ${item.productName}
Qty: ${item.quantity}
Days: ${item.rentalDuration}
Price: ${item.totalPrice}`
      )
      .join("\n\n");

    const message = `
 *Order Details*
Order ID: ${order?.orderId}

Customer:
${order?.customerDetails?.firstName} ${order?.customerDetails?.lastName}
 Delivery Address:
${order?.deliveryAddress}

Delivery:
${order?.deliveryDate?.slice(0, 10)} at ${order?.deliveryTime}

 Pickup:
${order?.pickupDate?.slice(0, 10)} at ${order?.pickupTime}

 Items:
${itemsText}

 Total: ${order?.total}
 Payment: ${order?.paymentStatus}
  `;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };


  const openGoogleMaps = () => {
    const lat = order?.deliveryLat;
    const lng = order?.deliveryLong;

    if (!lat || !lng) return;

    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, "_blank");
  };



  return (
    <Box bgcolor="#ffff" height="100%" p={3} borderRadius="16px">
      <Box>
        <Typography variant="h6" fontWeight={600} mb={3}>
          Acties
        </Typography>

        <Stack spacing={1.5} justifyContent="center">
          {/* Primary Action */}
          {primaryAction && (
            <CustomButton
              btnLabel={primaryAction.label}
              handlePressBtn={primaryAction.action}
              variant="mainButton"
              loading={loading}
            />
          )}

          {/* Common Actions */}
          <CustomButton
            btnLabel="PDF downloaden"
            handlePressBtn={() => downloadOrderPdf(order?._id)}
            variant="grayButton"
          />

          {showEditDelete && (
            <CustomButton
              btnLabel={isEditMode ? "Klaar" : "Bestelling bewerken"}
              handlePressBtn={() => setIsEditMode(!isEditMode)}
              variant="grayButton"
            />
          )}

          <CustomButton
            btnLabel="WhatsApp"
            handlePressBtn={openWhatsApp}
            variant="grayButton"
          />

          <CustomButton
            btnLabel="Openen in Google Maps"
            handlePressBtn={openGoogleMaps}
            variant="grayButton"
          />

          {showEditDelete && (
            <CustomButton
              btnLabel="Verwijderen"
              handlePressBtn={onDelete}
              btnBgColor={"#FF00041A"}
              btnTextColor={"#FF0004"}
            />
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default OrderActions;
