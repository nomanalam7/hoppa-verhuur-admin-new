import { Dialog } from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled component ko function ke bahar rakho
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: "16px",
    padding: "10px",
  },
}));

const DialogContainer = ({
  children,
  open,
  onClose,
  maxWidth = "600px",
  ...props
}) => {
  return (
    <BootstrapDialog
      open={open}
      onClose={onClose}
      {...props}
      sx={{
        "& .MuiPaper-root": {
          // width:600,
          maxWidth: maxWidth,
          width: maxWidth,
        },
      }}
    >
      {children}
    </BootstrapDialog>
  );
};

export default DialogContainer;
