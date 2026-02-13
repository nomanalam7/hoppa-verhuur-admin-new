import { Typography } from "@mui/material";
import LoginForm from "./loginForm";
import AuthContainer from "../../../components/authLayout/auth";
const LoginPage = () => {
  return (
    <AuthContainer>
      <Typography
        variant={"h1"}
        fontSize={{ xs: "2rem", md: "3rem" }}
        fontWeight={600}
        textAlign={"left"}
        color="primary.text"
      >
        Welkom Terug!
      </Typography>
      <Typography
        variant={"body1"}
        fontWeight={300}
        color={"primary.text"}
        textAlign={"left"}
        fontSize={{ xs: "14px", md: "16px" }}
      >
        Voer hieronder uw inloggegevens in
      </Typography>

      <LoginForm />
    </AuthContainer>
  );
};

export default LoginPage;
