"use client";

import { Box, Button } from "@mui/material";

const ToggleTabs = ({
  tabs = [], // [{ label: "Today", value: "today" }]
  activeTab, // "today"
  onChange, // (value) => {}
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "rgba(195, 198, 201, 0.05)",
        borderRadius: "16px",
        padding: "6px",
        width: "fit-content",
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;

        return (
          <Button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            sx={{
              textTransform: "none",
              borderRadius: "12px",
              px: 3,
              fontWeight: 500,
              transition: "all 0.25s ease",
              color: isActive ? "#FFFFFF" : "#1D4E89",
              backgroundColor: isActive ? "#1F4C8F" : "transparent",
              boxShadow: isActive ? "0px 2px 6px rgba(0,0,0,0.15)" : "none",
              "&:hover": {
                backgroundColor: isActive ? "#1F4C8F" : "transparent",
              },
            }}
          >
            {tab.label}
          </Button>
        );
      })}
    </Box>
  );
};

export default ToggleTabs;
