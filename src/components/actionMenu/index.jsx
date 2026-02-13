import React from "react";
import { Menu, MenuItem, Box, Typography } from "@mui/material";
import {
  Eye,
  Trash2,
  Download,
  Truck,
  Handshake,
  Package,
  Check,
  Edit,
} from "lucide-react";

export default function ActionMenu({
  anchorEl,
  open,
  onClose,
  selectedRow,
  showViewDetail = false,
  showEdit = false,
  showDownload = false,
  showMarkAsPaid = false,
  showDelete = false,
  showAddStock = false,
  onViewDetail,
  onEdit,
  onDownload,
  onMarkAsPaid,
  onDelete,
  showMarkasConfirmed = false,
  onMarkAsConfirmed,
  showMarkasDelivered = false,
  onMarkAsDelivered,
  showMarkAsPickup = false,
  onMarkAsPickup,
  showMarkasCompleted = false,
  onMarkAsCompleted,
  onAddStock,
  showInventoryDelete = false,
  onInventoryDelete,
  menuItems = [], // Optional custom menu items
}) {
  // Generate menu items from props
  const generateMenuItems = () => {
    // If custom menuItems provided, use those
    if (menuItems.length > 0) {
      return menuItems;
    }

    const items = [];

    // View Detail - always primary (blue background)
    if (showViewDetail) {
      items.push({
        label: "Detail bekijken",
        icon: Eye,
        onClick: onViewDetail,
        variant: "primary",
      });
    }

    // Edit
    if (showEdit) {
      items.push({
        label: "Bewerken",
        icon: Edit,
        onClick: onEdit,
        variant: "default",
      });
    }

    // Download PDF
    if (showDownload) {
      items.push({
        label: "PDF downloaden",
        icon: Download,
        onClick: onDownload,
        variant: "default",
      });
    }

    // Inventory Delete
    if (showInventoryDelete) {
      items.push({
        label: "Vooraad verwijderen",
        icon: Trash2,
        onClick: onInventoryDelete,
        variant: "default",
      });
    }

    // Mark as Paid
    if (showMarkAsPaid) {
      items.push({
        label: "Markeren als betaald",
        icon: Check,
        onClick: onMarkAsPaid,
        variant: "default",
      });
    }

    // Add Stock
    if (showAddStock) {
      items.push({
        label: "Voorraad toevoegen",
        icon: Package,
        onClick: onAddStock,
        variant: "default",
      });
    }

    // Delete - always last
    if (showDelete && selectedRow?.paymentStatus === "Unpaid") {
      items.push({
        label: "Verwijderen",
        icon: Trash2,
        onClick: onDelete,
        variant: "default",
      });
    }


    // Mark as Confirmed
    if (
      showMarkasConfirmed &&
      (
        (selectedRow?.status === "Planned" || selectedRow?.status === "Overdue") &&
        selectedRow?.paymentStatus === "Unpaid"
      )
    ) {
      items.push({
        label: "Bestelling bevestigen",
        icon: Handshake,
        onClick: onMarkAsConfirmed,
        variant: "default",
      });
    }

    // Mark as Delivered
    if (showMarkasDelivered && selectedRow?.paymentStatus === "Paid" && (selectedRow?.status === "Confirmed" || selectedRow?.status === "Overdue")) {
      items.push({
        label: "Markeren als geleverd",
        icon: Truck,
        onClick: onMarkAsDelivered,
        variant: "default",
      });
    }

    // Mark as Pickup
    if (showMarkAsPickup && selectedRow?.isDelivered === true && (selectedRow?.status === "Delivered" || selectedRow?.status === "Overdue")) {
      items.push({
        label: "Markeren als opgehaald",
        icon: Package,
        onClick: onMarkAsPickup,
        variant: "default",
      });
    }

    // Mark as Completed
    if (
      showMarkasCompleted &&
      selectedRow?.isPickedUp === true &&
      (selectedRow?.status === "Picked Up" || selectedRow?.status === "Overdue")
    ) {
      items.push({
        label: "Markeren als voltooid",
        icon: Check,
        onClick: onMarkAsCompleted,
        variant: "default",
      });
    }


    return items;
  };

  const items = generateMenuItems();

  const handleItemClick = (item) => {
    if (item.onClick) {
      item.onClick(selectedRow);
    }
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      PaperProps={{
        sx: {
          mt: 1,
          minWidth: 180,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          borderRadius: "8px",
          padding: "8px",
        },
      }}
    >
      {items.map((item, index) => {
        const IconComponent = item.icon;
        const isPrimary = item.variant === "primary";

        return (
          <MenuItem
            key={index}
            onClick={() => handleItemClick(item)}
            sx={{
              padding: isPrimary ? "10px 12px" : "8px 12px",
              borderRadius: "6px",
              marginBottom: index < items.length - 1 ? "4px" : 0,
              backgroundColor: isPrimary ? "#1976D2" : "transparent",
              color: isPrimary ? "#fff" : "#666",
              "&:hover": {
                backgroundColor: isPrimary ? "#1565C0" : "#f5f5f5",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                width: "100%",
              }}
            >
              {IconComponent && (
                <IconComponent size={18} color={isPrimary ? "#fff" : "#666"} />
              )}
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: isPrimary ? "#fff" : "#666",
                }}
              >
                {item.label}
              </Typography>
            </Box>
          </MenuItem>
        );
      })}
    </Menu>
  );
}
