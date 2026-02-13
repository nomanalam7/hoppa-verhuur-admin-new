import { Grid, Stack } from "@mui/material";
const ImageSection = ({ images }) => {
  return (
    <Grid container spacing={2}>
      <Grid item size={{ xs: 12, md: 8 }}>
        <img
          src={images[0]}
          alt="order-details"
          style={{
            width: "100%",
            height: "420px",
            objectFit: "cover",
            borderRadius: "22px",
          }}
        />
      </Grid>

      <Grid item size={{ xs: 12, md: 4 }}>
        <Stack direction="column" spacing={2}>
          <img
            src={images[1]}
            alt="order-details"
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              borderRadius: "22px",
            }}
          />
          <img
            src={images[2]}
            alt="order-details"
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              borderRadius: "22px",
            }}
          />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default ImageSection;
