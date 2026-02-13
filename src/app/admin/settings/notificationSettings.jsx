import { useState } from "react";
import { Box, Typography } from "@mui/material";
import CustomSwitch from "../../../components/switch";
const NotificationSettings = ({ checked, onToggle }) => {
  const handleChange = (e) => {
    onToggle(e.target.checked);
  };
  return (
    <Box>
      <Typography fontSize={18} color="primary.main" fontWeight={600}>
        Notification Settings
      </Typography>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        backgroundColor="#F7F7F8"
        borderRadius="16px"
        padding="20px"
      >
        <Typography fontSize={12} color="primary.main" fontWeight={600}>
          Notification Settings
        </Typography>
        <CustomSwitch checked={checked} onChange={handleChange} />
      </Box>

      <Box></Box>

      <Box mt={2}>
        <Typography fontSize={14} color="primary.main" fontWeight={600}>
          Affects alerts for:
        </Typography>
        <ul>
          <li>
            <Typography fontSize={13} color="primary.darkGray" fontWeight={600}>
              New Orders
            </Typography>
          </li>
        </ul>
        <ul>
          <li>
            <Typography fontSize={13} color="primary.darkGray" fontWeight={600}>
              Reminders Pickup
            </Typography>
          </li>
        </ul>
        <ul>
          <li>
            <Typography fontSize={13} color="primary.darkGray" fontWeight={600}>
              Overdue Pickups
            </Typography>
          </li>
        </ul>
      </Box>
    </Box>
  );
};

export default NotificationSettings;
