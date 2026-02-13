import {
  Box,
  Typography,
  Stack,
  Button,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import React, { useState } from "react";

const formatTime = (date) => {
  if (!date) return "";
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${period}`;
};

const getStatusLabel = (event) => {
  if (event?.status === "Completed") {
    return "Completed";
  }
  if (event?.status === "Overdue") {
    return "Overdue";
  }
  if (event?.type === "Delivery") {
    return "Deliver";
  }
  if (event?.type === "Pickup") {
    return "To Pick Up";
  }
  return "Planned";
};

const getStatusColors = (event) => {
  const status = event?.status;
  const eventType = event?.type;

  if (status === "Completed") {
    return {
      bgColor: "#F3F4F6",
      badgeBg: "#9CA3AF",
      badgeText: "#FFFFFF",
    };
  }
  if (status === "Overdue") {
    return {
      bgColor: "#FEE2E2",
      badgeBg: "#EF4444",
      badgeText: "#FFFFFF",
    };
  }
  if (eventType === "Delivery") {
    return {
      bgColor: "#DBEAFE",
      badgeBg: "#3B82F6",
      badgeText: "#FFFFFF",
    };
  }
  if (eventType === "Pickup") {
    return {
      bgColor: "#D1FAE5",
      badgeBg: "#10B981",
      badgeText: "#FFFFFF",
    };
  }
  return {
    bgColor: "#FEF3C7",
    badgeBg: "#F59E0B",
    badgeText: "#FFFFFF",
  };
};

// Tooltip content component
const EventTooltip = ({ event }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: "16px",
        padding: "16px",
        width: "260px",
        boxShadow: "0px 6px 16px rgba(0,0,0,0.15)",
      }}
    >
      {/* Order Header */}
      <Typography fontSize="15px" fontWeight={700} color="#111827">
        Order {event?.orderId || "#R789"}
      </Typography>

      <Typography fontSize="13px" color="#6B7280" mb={2}>
        {event?.customerName || "N/A"}
      </Typography>

      {/* Address */}
      {event?.address && (
        <>
          <Typography fontSize="13px" fontWeight={600} color="#111827">
            Address
          </Typography>
          <Typography fontSize="12px" color="#6B7280" mb={2}>
            {event.address}
          </Typography>
        </>
      )}

      {/* Product Name */}
      {event?.items?.length > 0 && (
        <>
          <Typography fontSize="13px" fontWeight={600} color="#111827">
            Product Name
          </Typography>

          {event.items.map((item, index) => (
            <Typography
              key={index}
              fontSize="12px"
              color="#2563EB"
              sx={{ cursor: "pointer" }}
            >
              {item.name} ({item.quantity})
            </Typography>
          ))}
        </>
      )}

      {/* Footer hint */}
      <Typography fontSize="11px" color="#9CA3AF" mt={2}>
        Opens right-side detail panel with full order details.
      </Typography>
    </Box>
  );
};

const TaskEvent = ({
  event,
  onMarkDelivered,
  onMarkPickedUp,
  onMarkCompleted,
}) => {
  console.log(event, "eventsssssssssssssssssss");
  const [loading, setLoading] = useState(false);
  const statusLabel = getStatusLabel(event);
  const colors = getStatusColors(event);
  const isCompleted = event?.status === "Completed";
  const isPickup = event?.type === "Pickup";
  const isDelivery = event?.type === "Delivery";

  const timeRange =
    event?.start && event?.end
      ? `${formatTime(event.start)} - ${formatTime(event.end)}`
      : "";

  const handleAction = async (e) => {
    e.stopPropagation();
    setLoading(true);

    if (
      isPickup &&
      (event?.status === "Confirmed" || event?.status === "Delivered" || event?.status === "Overdue")
    ) {
      await onMarkPickedUp?.(event.id);
    } else if (isDelivery && event?.status === "Confirmed" || event?.status === "Overdue") {
      await onMarkDelivered?.(event.id);
    } else if (
      isPickup &&
      (event?.status === "Picked Up" || event?.status === "PickedUp" || event?.status === "Overdue")
    ) {
      await onMarkCompleted?.(event.id);
    }

    setLoading(false);
  };

  const getButtonLabel = () => {
    if (
      isPickup &&
      (event?.status === "Confirmed" || event?.status === "Delivered")
    ) {
      return "Mark Picked Up";
    }

    if (isDelivery && event?.status === "Confirmed") {
      return "Mark Delivered";
    }

    if (
      isPickup &&
      (event?.status === "Picked Up" || event?.status === "PickedUp")
    ) {
      return "Mark Completed";
    }

    return "";
  };

  const buttonLabel = getButtonLabel();

  return (
    <Tooltip
      title={<EventTooltip event={event} />}
      arrow
      placement="top"
      enterDelay={300}
      leaveDelay={100}
      componentsProps={{
        tooltip: {
          sx: {
            backgroundColor: "transparent",
            padding: 0,
            boxShadow: "none",
          },
        },
      }}
    >
      <Box
        sx={{
          backgroundColor: colors.bgColor,
          borderRadius: "12px",
          padding: "8px",
          width: "100%",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          gap: "3px",
          boxSizing: "border-box",
        }}
      >
        {/* Header: Order ID and Status Badge */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          gap={1}
        >
          <Typography
            fontSize="10px"
            fontWeight={700}
            color="#1F2937"
            sx={{ lineHeight: 1.2 }}
          >
            {event?.orderId ? event.orderId.slice(0, 8) : "#R789"}
          </Typography>

          <Box
            sx={{
              backgroundColor: colors.badgeBg,
              borderRadius: "22px",
              padding: "4px 6px",
              flexShrink: 0,
            }}
          >
            <Typography
              fontSize="10px"
              fontWeight={500}
              color={colors.badgeText}
            >
              {statusLabel}
            </Typography>
          </Box>
        </Stack>

        {/* Time */}
        <Typography fontSize="12px" fontWeight={400} color="#6B7280">
          {event?.pickupTime || event?.deliveryTime}
        </Typography>

        {/* Action Button */}
        {!isCompleted && buttonLabel && (
          <Button
            onClick={handleAction}
            disabled={loading}
            sx={{
              backgroundColor: "#1E063E",
              color: "#FFFFFF",
              borderRadius: "8px",
              padding: "4px 12px",
              fontSize: "12px",
              fontWeight: 500,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#1E063E",
                opacity: 0.9,
              },
            }}
          >
            {loading ? (
              <CircularProgress size={16} sx={{ color: "white" }} />
            ) : (
              buttonLabel
            )}
          </Button>
        )}
      </Box>
    </Tooltip>
  );
};

export default TaskEvent;
