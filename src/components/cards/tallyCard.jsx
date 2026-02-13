import React from "react";
import { Box, Typography, Card } from "@mui/material";

const TallyCard = ({ icon: Icon, count, label, iconBgColor, iconColor }) => {
  return (
    <Card
      sx={{
        padding: "30px",
        borderRadius: "12px",
        backgroundColor: "#ffffff",
        boxShadow: "none",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 2,

      }}
    >
      {/* Icon Circle */}
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          backgroundColor: iconBgColor || "#E3F2FD",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {Icon && (
          <img
            src={Icon}
            alt={label}
            width={24}
            height={24}
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        )}
      </Box>

      {/* Count and Label */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="h4"
          sx={{
            fontSize: "28px",
            fontWeight: 700,
            color: "#4B4B4B",
            lineHeight: 1.2,
            mb: 0.5,
            fontFamily: '"Poppins", sans-serif',
          }}
        >
          {count}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: "12px",
            fontWeight: 400,
            color: "#67768B",
            fontFamily: '"Poppins", sans-serif',
          }}
        >
          {label}
        </Typography>
      </Box>
    </Card>
  );
};

export default TallyCard;
