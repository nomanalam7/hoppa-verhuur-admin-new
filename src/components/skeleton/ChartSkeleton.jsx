import React from "react";
import { Box, Skeleton, Card } from "@mui/material";

const ChartSkeleton = () => {
  return (
    <Box
      sx={{
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        marginTop: "20px",
        height: "430px", // Approximate height of chart + padding
      }}
    >
      <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={350} sx={{ borderRadius: "8px" }} />
    </Box>
  );
};

export default ChartSkeleton;
