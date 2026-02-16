import { Box, Typography, Chip, Grid } from "@mui/material";
import { getStatusBadgeStyles } from "../../../utils/statusColors";
import moment from "moment";

const ClientDetails = ({ clientData }) => {
  const statusMap = {
    Planned: "Gepland",
    Confirmed: "Bevestigd",
    Delivered: "Geleverd",
    "Picked Up": "Opgehaald",
    PickedUp: "Opgehaald",
    Overdue: "Te laat",
    Completed: "Voltooid",
    Cancelled: "Geannuleerd",
    New: "Nieuw",
  };

  const DetailItem = ({ label, value }) => (
    <Box sx={{ mb: 1 }}>
      <Typography
        variant="body2"
        color="primary.text"
        fontSize="14px"
        fontWeight={600}
        mb={0.5}
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        color="primary.lightText"
        fontSize="15px"
        fontWeight={400}
      >
        {value}
      </Typography>
    </Box>
  );

  return (
    <Box backgroundColor="#fff" borderRadius="16px" p={3}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography
          variant="h6"
          fontSize="18px"
          fontWeight={600}
          color="primary.main"
        >
          Klantgegevens
        </Typography>
        <Chip
          label={statusMap[clientData?.status] || clientData?.status || "Gepland"}
          sx={{
            ...getStatusBadgeStyles("status", clientData?.status || "Planned"),
            height: "28px",
            fontSize: "13px",
            borderRadius: "8px",
          }}
        />
      </Box>

      {/* MUI Grid - Two Columns */}
      <Grid container spacing={4}>
        <Grid item size={{ xs: 12, md: 6 }}>
          <DetailItem label="Naam" value={clientData.name} />
        </Grid>
        <Grid item size={{ xs: 12, md: 6 }}>
          <DetailItem label="E-mailadres" value={clientData.email} />
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
          <DetailItem label="Telefoonnummer" value={clientData.phone} />
        </Grid>
        <Grid item size={{ xs: 12, md: 6 }}>
          <DetailItem label="Leveringswijze" value={clientData.deliveryMethod} />
        </Grid>
        <Grid item size={{ xs: 12, md: 6 }}>
          <DetailItem
            label="Afleveradres"
            value={clientData.deliveryAddress}
          />
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
          <DetailItem label="Ophaaladres" value={clientData.pickupAddress} />
        </Grid>
        <Grid item size={{ xs: 12, md: 6 }}>
          <DetailItem label="Bestelnummer" value={clientData.orderId} />
        </Grid>


        <Grid item size={{ xs: 12, md: 6 }}>
          <DetailItem label="Leverdatum" value={clientData.deliveryDate} />
        </Grid>
        <Grid item size={{ xs: 12, md: 6 }}>
          <DetailItem label="Tijdvenster" value={clientData.deliveryTime} />
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
          <DetailItem label="Ophaaldatum" value={clientData.pickupDate} />
        </Grid>
        <Grid item size={{ xs: 12, md: 6 }}>
          <DetailItem label="Tijdvenster" value={clientData.pickupTime} />
        </Grid>
        <Grid item size={{ xs: 12, md: 6 }}>
          <DetailItem label="Aanmaakdatum" value={moment(clientData.createdAt).format("DD-MM-YYYY")} />
        </Grid>
        <Grid item size={{ xs: 12, md: 12 }}>
          <DetailItem label="Notities" value={clientData.notes} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClientDetails;
