import { DialogTitle, IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import closeIcon from "../../assets/icons/close-icon.svg";

const DialogHeader = ({ title, secondaryHeading, onClose, icon }) => {
  return (
    <DialogTitle
      sx={{
        m: 0,
        p: 2,
        fontWeight: 600,
        border: "none",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        {icon && (
          <IconButton
            aria-label="icon"
            sx={{
              color: "secondary.dark",
              backgroundColor: "customColor.softGrey",
            }}
          >
            {icon}
          </IconButton>
        )}
        <Stack>
          <Typography
            variant="h6"
            fontWeight={700}
            lineHeight={"normal"}
            textTransform={"capitalize"}
          >
            {title}
          </Typography>
          {secondaryHeading && (
            <Typography
              variant="body2"
              color="customColor.coolGrey"
              lineHeight={"normal"}
            >
              {secondaryHeading}
            </Typography>
          )}
        </Stack>
      </Stack>
      {onClose ? (
        <IconButton aria-label="close" onClick={onClose}>
          <img src={closeIcon} alt="close" width={30} height={30} />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export default DialogHeader;
