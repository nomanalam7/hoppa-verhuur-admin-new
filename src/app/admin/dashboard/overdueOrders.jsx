import { Box, Typography, Stack, Card, Chip } from "@mui/material";

export default function OverdueOrders({ orders }) {
  return (
    <Card
      sx={{
        p: 2,
        borderRadius: 3,
        boxShadow: "0px 8px 30px rgba(0,0,0,0.05)",
        mt: "20px",
        height: "470px",
        overflowY: "auto",
      }}
    >
      <Typography fontWeight={700} mb={2}>
        Overdue Bestellingen
      </Typography>

      <Stack spacing={2}>
        {orders.map((order, index) => (
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
              "&:hover": {
                backgroundColor: "#F7F7F7",
              },
            }}
          >
            {/* Left Content */}
            <Box>
              <Typography fontWeight={600} fontSize={13}>
                {order.name}
              </Typography>

              <Typography variant="body2" fontSize={10} color="text.secondary">
                {order.item}
              </Typography>

              <Typography
                variant="caption"
                fontSize={10}
                color="text.secondary"
                mt={0.5}
                display="block"
              >
                Ophaaldatum: {order.pickup}
              </Typography>
            </Box>

            {/* Right Chip */}
            <Chip
              label={`${order.overdue} dagen`}
              sx={{
                bgcolor: "#FF00041A",
                color: "#FF0004",
                fontWeight: 600,
                borderRadius: "16px",
                fontSize: "12px",
              }}
            />
          </Box>
        ))}
      </Stack>
    </Card>
  );
}
