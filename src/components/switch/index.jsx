import { FormControlLabel, Switch } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 44,
  height: 22,
  padding: 0,
  margin: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(20px)", // Move to right when ON
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#385A9C", // Orange when ON
        opacity: 1,
        border: 0,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#385A9C",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: theme.palette.grey[100],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.5,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 18,
    height: 18,
    backgroundColor: "#fff", // White thumb
  },
  "& .MuiSwitch-switchBase:not(.Mui-checked) .MuiSwitch-thumb": {
    backgroundColor: "#fff", // Orange thumb when OFF
  },
  "& .MuiSwitch-track": {
    borderRadius: 28 / 2,
    backgroundColor: "#B8B8B8", // Light orange when OFF
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 300,
    }),
  },
}));

export default function CustomSwitch({ label, onChange, checked = false, showLabel = false }) {
  if (showLabel && label) {
    return (
      <FormControlLabel
        control={<IOSSwitch size="small" checked={checked} onChange={onChange} />}
        label={label}
      />
    );
  }
  
  // Return just the switch without label for table usage
  return <IOSSwitch size="small" checked={checked} onChange={onChange} />;
}
