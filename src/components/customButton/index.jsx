import { Button, CircularProgress } from "@mui/material";
import React from "react";

const CustomButton = ({
  btnLabel,
  handlePressBtn,
  btnBgColor,
  btnTextColor,
  btnHoverColor,
  btnTextTransform,
  endIcon,
  textWeight,
  borderColor,
  variant,
  width,
  height,
  btnTextSize,
  borderRadius,
  isBorder,
  sx,
  startIcon,
  disabled,
  loading,
}) => {
  return (
    <Button
      sx={{
        borderColor: borderColor,
        border: isBorder,
        width: width ? width : "auto",
        height: height ? height : "100%",
        backgroundColor: btnBgColor,
        color: btnTextColor, // Text color fix
        fontWeight: textWeight ? textWeight : "300",
        borderRadius: borderRadius,
        fontSize: btnTextSize ? btnTextSize : "14px",
        padding: "10px 15px",
        textTransform: btnTextTransform ? btnTextTransform : "capitalize",
        opacity: disabled ? 0.5 : 1, // Opacity change on disable
        "&:hover": {
          backgroundColor: btnHoverColor,
          borderColor: borderColor,
        },
        "&.Mui-disabled": {
          color: btnTextColor ? btnTextColor : "#fff", // Force text color on disable
          opacity: 0.7, // Keep opacity low
          backgroundColor: "#eee",
        },
        ...sx,
      }}
      onClick={handlePressBtn}
      endIcon={endIcon}
      startIcon={startIcon}
      variant={variant ? variant : ""}
      disabled={disabled || loading}
      loading={loading}
    >
      {loading ? <CircularProgress size={20} color="white" /> : btnLabel}
    </Button>
  );
};

export default CustomButton;
