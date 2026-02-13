import { Box, Container, Divider, Grid, Stack, Typography } from "@mui/material";
import logo from "../../assets/images/web-logo.png";

const AuthContainer = ({ children }) => {
  return (
    <Box
      width={"100%"}
      display={"flex"}
      height={{ xs: "100vh", md: "100vh" }}
      justifyContent={"center"}
      padding={"14px"}
      bgcolor={"secondary.light"}
      overflow={ {xs: "auto", md: "hidden"}}
    >
      <Grid container width={"100%"}>
        <Grid size={{ xs: 12, md: 6 }} width={"100%"}>
          <Box
            bgcolor={"primary.main"}
            minHeight={{ md: "100%" }}
            borderRadius={6}
            padding={3}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Stack gap={1.5} direction={"row"} alignItems={"center"}>
              <Box display={"flex"} flexDirection={"row"} gap={4} width={"100%"} alignItems={"center"}>
                <Typography
                  variant="h1"
                  fontSize={{ xs: "1rem", md: "1.5rem" }}
                  color={"secondary.light"}
                  fontWeight={500}
                >
                  Een wijze uitspraak
                </Typography>
              <Box width={"40%"} mt={ {xs: 0, md: 0}}>
                  <Divider color={"#f5f5f5"} />
                </Box>
              </Box>

            </Stack>

            <Stack gap={2}>
              <Typography
                variant="h1"
                fontSize={{ xs: "2rem", md: "3rem" }}
                color={"secondary.light"}
                fontWeight={600}
                mt={{ xs: 8, md: 0 }}
              >
                Beheer uw evenementen met gemak
              </Typography>
              <Typography
                variant="body1"
                color={"secondary.light"}
                fontWeight={300}
                fontSize={"12px"}
              >
                Gebruik je dashboard om boekingen te bevestigen, leveringen  <br /> te volgen en de planning in de gaten te houden.
              </Typography>
            </Stack>

          </Box>
        </Grid>
        <Grid
          size={{ xs: 12, md: 6 }}
          bgcolor={"secondary.light"}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Container
            maxWidth={"sm"}
            sx={{ maxWidth: "500px !important", height: "100%" }}
            height={"100%"}
          >
            <Box textAlign={"left"}>
              <img src={logo} alt="logo" width={200} />
            </Box>
            <Box
              height={"80%"}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"center"}
            >
              {children}
            </Box>
          </Container>
        </Grid>
      </Grid>
    </Box>
    // </Box>
  );
};

export default AuthContainer;
