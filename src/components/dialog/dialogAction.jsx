import { DialogActions, Button } from "@mui/material";
import React from "react";
import CustomButton from "../customButton";

const DialogActionButtons = ({
  onConfirm,
  onCancel,
  showConfirmBtn = true,
  showCancelBtn = true,
  confirmText = "save",
  cancelText = "close",
  isConfirmBtnDisable = false,
  cancelBtnProps,
  confirmBtnProps,
  confirmLoading = false,
  fullWidth = false,
}) => {
  return (
    <DialogActions
      sx={{
        padding: "16px",
        display: "flex",
        justifyContent: "flex-end",
        gap: 1,
      }}
    >
      {showCancelBtn && (
        <CustomButton
          variant={"customOutlined"}
          handlePressBtn={onCancel}
          btnLabel={cancelText}
          disabled={confirmLoading}
          loading={confirmLoading}
          {...cancelBtnProps}
        />
      )}
      {showConfirmBtn && (
        <CustomButton
          variant={"gradient"}
          handlePressBtn={onConfirm}
          btnLabel={confirmText}
          disabled={isConfirmBtnDisable}
          loading={confirmLoading}
          fullWidth={fullWidth}
          {...confirmBtnProps}
        />
      )}
    </DialogActions>
  );
};

export default DialogActionButtons;
