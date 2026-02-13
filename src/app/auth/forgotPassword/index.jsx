import { Typography } from "@mui/material";
import ForgotForm from "./forgotForm";
import AuthContainer from "../../../components/authLayout/auth";

const ForgotPasswordPage = () => {
  return (
    <AuthContainer>
      <Typography
        variant={"h1"}
        fontSize={"3rem"}
        fontWeight={600}
        textAlign={"left"}
        color="primary.text"
      >
        Verificatie
      </Typography>
      <Typography
        variant={"body1"}
        fontWeight={300}
        color={"primary.text"}
        textAlign={"left"}
        fontSize={"16px"}
      >
        Voltooi uw verificatie
      </Typography>

      <ForgotForm />
    </AuthContainer>
  );
};

export default ForgotPasswordPage;

