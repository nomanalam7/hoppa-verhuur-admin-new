import React from "react";
import { Card, Box, Skeleton, Stack } from "@mui/material";

const OverdueOrdersSkeleton = () => {
  return (
    <Card
      sx={{
        p: 2,
        borderRadius: 3,
        boxShadow: "0px 8px 30px rgba(0,0,0,0.05)",
        mt: "20px",
        height: "470px",
        overflow: "hidden",
      }}
    >
      <Skeleton variant="text" width={150} height={32} sx={{ mb: 2 }} />

      <Stack spacing={2}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderRadius: 2,
              backgroundColor: "#FFFFFF",
              borderBottom: "1px solid #E0E0E0",
            }}
          >
            {/* Left Content */}
            <Box width="60%">
              <Skeleton variant="text" width="80%" height={20} />
              <Skeleton variant="text" width="60%" height={16} sx={{ mt: 0.5 }} />
              <Skeleton variant="text" width="40%" height={16} sx={{ mt: 0.5 }} />
            </Box>

            {/* Right Chip */}
            <Skeleton variant="rounded" width={60} height={24} sx={{ borderRadius: "16px" }} />
          </Box>
        ))}
      </Stack>
    </Card>
  );
};

export default OverdueOrdersSkeleton;
