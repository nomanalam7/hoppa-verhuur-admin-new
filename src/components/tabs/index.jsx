import React, { Activity } from "react";
import { Box, Typography } from "@mui/material";

const CustomTabs = ({
  tabs,
  activeTab,
  onTabChange,
  containerProps = {},
  tabProps = {},
  tabTextProps = {},
}) => {
  return (
    <Box
      mt={2}
      mb={2}
      gap={0.5}
      display={"flex"}
      backgroundColor={"#fff"}
      borderRadius={"18px"}
      padding={"6px"}
      {...containerProps}
    >
      {tabs.map((tab) => (
        <Box
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          flex={1}
          textAlign={"center"}
          padding={"16px 2px"}
          borderRadius={"18px"}
          backgroundColor={
            activeTab === tab.id ? "primary.main" : "transparent"
          }
          color={activeTab === tab.id ? "#fff" : "#4B4B4B"}
          fontWeight={activeTab === tab.id ? 700 : 400}
          sx={{
            cursor: "pointer",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "secondary.lightWhite",
              // activeTab === tab.id ? "customColor.aquaGreen" : "#e0e0e0",
            },
          }}
          {...tabProps}
        >
          <Typography
            fontSize={"0.975rem"}
            fontWeight={activeTab === tab.id ? 600 : 400}
            color={activeTab === tab.id ? "#fff" : "#4B4B4B"}
            {...tabTextProps}
          >
            {tab.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default CustomTabs;
