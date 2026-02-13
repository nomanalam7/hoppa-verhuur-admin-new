import { InputLabel } from "@mui/material";
import React from "react";

function CustomInputLabel({ label }) {
  return (
    <InputLabel
      sx={{ fontFamily: "Poppins", mb: 1, color: "#030229", fontWeight: 500 , fontSize: "14px" }}
    >
      {label}
    </InputLabel>
  );
}

export default CustomInputLabel;
