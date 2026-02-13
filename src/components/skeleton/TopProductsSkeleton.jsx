import React from "react";
import { Box, Skeleton, Stack, Divider } from "@mui/material";

const TopProductsSkeleton = () => {
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        borderRadius: "16px",
        p: 3,
        width: "100%",
        boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
        my: 3,
      }}
    >
      <Skeleton variant="text" width={180} height={24} sx={{ mb: 2 }} />

      <Stack spacing={2}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Box key={index}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Skeleton variant="text" width={120} height={20} />
                <Skeleton variant="text" width={80} height={16} />
              </Box>

              <Skeleton variant="rounded" width={40} height={24} sx={{ borderRadius: "20px" }} />
            </Stack>

            {index !== 4 && <Divider sx={{ mt: 2 }} />}
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default TopProductsSkeleton;
