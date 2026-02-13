import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Drawer, Box, Typography, IconButton, Divider } from "@mui/material";
import closeIcon from "../../assets/icons/close-icon.svg";
import HeaderText from "../headerText";

const DynamicDrawer = forwardRef(
  ({ title = "Details", subtitle = "", children }, ref) => {
    const [open, setOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      openDrawer: () => setOpen(true),
      closeDrawer: () => setOpen(false),
    }));

    return (
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: { width: { xs: "100%", sm: 700 }, borderRadius: "30px 0 0 30px" },
        }}
      >
        <Box p={2} mt={2} px={4}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <HeaderText
              title={title}
              subtitle={subtitle}
              fontSize={14}
              subtitleFontSize={12}
            />
            <IconButton onClick={() => setOpen(false)}>
              <img src={closeIcon} alt="close" width={30} height={30} />
            </IconButton>
          </Box>
          <Divider sx={{ my: 1 }} />

          <Box>{children}</Box>
        </Box>
      </Drawer>
    );
  }
);

DynamicDrawer.displayName = "DynamicDrawer";

export default DynamicDrawer;
