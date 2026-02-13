import React from "react";
import { Box, Typography, Stack, Divider } from "@mui/material";

const TopProducts = ({ topProducts }) => {
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
      <Typography fontSize={14} fontWeight={600} mb={2}>
        Top Verhuurde Producten
      </Typography>

      <Stack spacing={2}>
        {topProducts.map((item, index) => (
          <Box key={item.id}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography fontWeight={600} fontSize={12}>
                  {item.name}
                </Typography>
                <Typography fontSize={10} color="text.secondary">
                  {item.rentals} rentals
                </Typography>
              </Box>

              <Box
                sx={{
                  bgcolor: "#FFECEC",
                  color: "#FF4D4F",
                  fontSize: 12,
                  fontWeight: 600,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "20px",
                }}
              >
                {item.percent}%
              </Box>
            </Stack>

            {index !== topProducts.length - 1 && <Divider sx={{ mt: 2 }} />}
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default TopProducts;
