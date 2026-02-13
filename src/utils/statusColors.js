// Status Colors Constants - Dynamic reusable colors for all status types

export const STATUS_COLORS = {
  // Payment Status Colors
  paymentStatus: {
    Unpaid: {
      backgroundColor: "#FFF7E5",
      color: "#C99700",
    },
    Paid: {
      backgroundColor: "#04C3731A",
      color: "#04C373",
    },
  },

  // Order Status Colors
  status: {
    New: {
      backgroundColor: "#757575",
      color: "#ffffff",
    },
    Overdue: {
      backgroundColor: "#FF00041A",
      color: "#FF0004",
    },
  "Picked Up": {
      backgroundColor: "#FF9D001A",
      color: "#FF9D00",
    },
    Delivered: {
      backgroundColor: "#04C3731A",
      color: "#04C373",
    },
    Planned: {
      backgroundColor: "#9898001A",
      color: "#989800",
    },
    Confirmed: {
      backgroundColor: "#0421C31A",
      color: "#0421C3",
    },
    Completed: {
      backgroundColor: "#4caf50",
      color: "#ffffff",
    },
  },
};

export const getStatusColor = (statusType, statusValue) => {
  const normalizedValue = statusValue?.trim();

  if (!STATUS_COLORS[statusType]) {
    return {
      backgroundColor: "#757575",
      color: "#ffffff",
    };
  }

  const colorConfig = STATUS_COLORS[statusType][normalizedValue];

  return (
    colorConfig || {
      backgroundColor: "#757575",
      color: "#ffffff",
    }
  );
};

export const getStatusBadgeStyles = (statusType, statusValue) => {
  const colorConfig = getStatusColor(statusType, statusValue);

  return {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "16px",
    fontSize: "10px",
    fontWeight: 600,
    backgroundColor: colorConfig.backgroundColor,
    color: colorConfig.color,
    textAlign: "center",
    minWidth: "80px",
  };
};
