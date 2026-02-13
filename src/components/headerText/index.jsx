import { Box, Typography } from "@mui/material";
import React from "react";

const HeaderText = ({ title, subtitle, fontSize , subtitleFontSize }) => {
  return (
    <Box display="flex" flexDirection="column" mb={2}>
      <Typography variant="primaryText" fontSize={fontSize ? fontSize : 24} fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="secondaryText" fontSize={subtitleFontSize ? subtitleFontSize : 14}>{subtitle}</Typography>
    </Box>
  );
};

export default HeaderText;
