import React, { useEffect, useMemo, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import DialogContainer from "../../../components/dialog/dialogContainer";
import DialogHeader from "../../../components/dialog/dialogHeader";
import DialogBody from "../../../components/dialog/dialogBody";
import DialogActionButtons from "../../../components/dialog/dialogAction";
import TextInput from "../../../components/textInput";

const safeNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const EditItemsDialog = ({ open, onClose, item, onConfirm, actionLoading }) => {
  const initialQty = useMemo(() => safeNumber(item?.quantity, 1), [item]);
  const initialPrice = useMemo(() => safeNumber(item?.pricePerDay.toFixed(2), 0), [item]);

  const [quantity, setQuantity] = useState(initialQty);
  const [pricePerDay, setPricePerDay] = useState(initialPrice);

  useEffect(() => {
    if (!open) return;
    setQuantity(initialQty);
    setPricePerDay(initialPrice);
  }, [open, initialQty, initialPrice]);

  const hasInvalid = quantity <= 0 || pricePerDay < 0;

  const handleSave = () => {
    onConfirm?.({
      ...item,
      quantity: safeNumber(quantity, 0),
      pricePerDay: safeNumber(pricePerDay, 0),
    });
  };

  const title = "Edit Rental Items";
  const name = item?.productName || item?.productId?.name || "-";

  return (
    <DialogContainer open={open} onClose={onClose} maxWidth="520px">
      <DialogHeader title={title} onClose={onClose} />
      <DialogBody>
        <Stack spacing={2} sx={{ py: 2 }}>
          <Typography fontSize={20} fontWeight={700} color="primary.text">
            {name}
          </Typography>

          <Box display="flex" gap={2}>
            <Box flex={1}>
              <Typography
                fontSize={12}
                fontWeight={600}
                color="primary.lightText"
                mb={0.5}
              >
                Qty
              </Typography>
              <TextInput
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(safeNumber(e.target.value, 0))}
              />
            </Box>
            <Box flex={1}>
              <Typography
                fontSize={12}
                fontWeight={600}
                color="primary.lightText"
                mb={0.5}
              >
                Price
              </Typography>
              <TextInput
                type="number"
                value={pricePerDay}
                onChange={(e) => setPricePerDay(safeNumber(e.target.value, 0))}
              />
            </Box>
          </Box>
        </Stack>
      </DialogBody>

      <DialogActionButtons
        onCancel={onClose}
        onConfirm={handleSave}
        confirmText="Save"
        cancelText="Cancel"
        isConfirmBtnDisable={hasInvalid}
        confirmLoading={actionLoading}
      />
    </DialogContainer>
  );
};

export default EditItemsDialog;
