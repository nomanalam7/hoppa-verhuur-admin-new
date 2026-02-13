import { useState, forwardRef, useImperativeHandle } from "react";
import { Stack, Box } from "@mui/material";
import DialogContainer from "../dialog/dialogContainer";
import DialogHeader from "../dialog/dialogHeader";
import DialogBody from "../dialog/dialogBody";
import DialogActionButtons from "../dialog/dialogAction";
import TextInput from "../textInput";
import CustomInputLabel from "../customInputLabel";
import { useSuccessDialog } from "../../lib/context/successDialogContext";

const AddStock = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const [addStock, setAddStock] = useState(0);
  const [outStock, setOutStock] = useState(0);
  const [selectedRow, setSelectedRow] = useState(null);
  const { showSuccess } = useSuccessDialog();

  useImperativeHandle(ref, () => ({
    openDialog: (row) => {
      setSelectedRow(row);
      setAddStock(0);
      setOutStock(0);
      setOpen(true);
    },
  }));

  const handleClose = () => {
    setOpen(false);
    setAddStock(0);
    setOutStock(0);
    setSelectedRow(null);
  };

  const handleAddStock = () => {
    // Yahan pe aap API call kar sakte hain ya koi aur logic
    console.log("Add Stock:", addStock);
    console.log("Out Stock:", outStock);
    console.log("Selected Row:", selectedRow);

    // TODO: API call yahan karein
    // Example: await updateStock(selectedRow.id, { addStock, outStock });

    handleClose();
    showSuccess({
      title: "Successfully Updated Stock.",
      subtitle: `${selectedRow?.nameCharacter ?? "Inventory item"} quantities are refreshed.`,
    });
  };

  return (
    <DialogContainer open={open} onClose={handleClose} maxWidth="500px">
      <DialogHeader title="Add & Out Stock" onClose={handleClose} />

      <DialogBody>
        <Stack spacing={3}>
          {/* Add Stock Input */}
          <Box>
            <CustomInputLabel label="Add Stock" />
            <TextInput
              type="number"
              value={addStock}
              onChange={(e) => setAddStock(Number(e.target.value) || 0)}
              placeholder="0"
            />
          </Box>

          {/* Out Stock Input */}
          <Box>
            <CustomInputLabel label="Out Stock" />
            <TextInput
              type="number"
              value={outStock}
              onChange={(e) => setOutStock(Number(e.target.value) || 0)}
              placeholder="0"
            />
          </Box>
        </Stack>
      </DialogBody>

      <DialogActionButtons
        onConfirm={handleAddStock}
        onCancel={handleClose}
        confirmText="Add Stock"
        cancelText="Cancel"
      />
    </DialogContainer>
  );
});

AddStock.displayName = "AddStock";

export default AddStock;
