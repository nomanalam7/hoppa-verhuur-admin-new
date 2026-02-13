import React from "react";
import { Box, Typography } from "@mui/material";
import DialogContainer from "./dialogContainer";
import DialogHeader from "./dialogHeader";
import DialogBody from "./dialogBody";
import DialogActionButtons from "./dialogAction";

const LowInventoryDialog = ({ open, onClose, description }) => {
  return (
    <DialogContainer open={open} onClose={onClose} maxWidth="600px">
      <DialogHeader
        title="Lage voorraad melding"
        secondaryHeading="Volledige beschrijving"
        onClose={onClose}
      />

      <DialogBody
        sx={{
          maxHeight: "500px",
          overflowY: "auto",
        }}
      >
        <Box sx={{ py: 2 }}>
          <Typography
            sx={{
              color: "#FF0004",
              fontSize: "12px",
              fontWeight: 400,
              lineHeight: 1.5,
              whiteSpace: "pre-wrap",
            }}
          >
            {description || "Geen beschrijving beschikbaar"}
          </Typography>
        </Box>
      </DialogBody>

      <DialogActionButtons
        onCancel={onClose}
        showConfirmBtn={false}
        cancelText="Sluiten"
      />
    </DialogContainer>
  );
};

export default LowInventoryDialog;

