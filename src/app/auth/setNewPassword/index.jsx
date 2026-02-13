import { Typography } from "@mui/material";
import NewPassForm from "./newPassForm";
import AuthContainer from "../../../components/authLayout/auth";

const SetNewPasswordPage = () => {
  return (
    <AuthContainer>
      <Typography
        variant={"h1"}
        fontSize={"3rem"}
        fontWeight={600}
        textAlign={"left"}
        color="primary.text"
      >
        Wachtwoord Opnieuw Instellen
      </Typography>
      <Typography
        variant={"body1"}
        fontWeight={300}
        color={"primary.text"}
        textAlign={"left"}
        fontSize={"16px"}
      >
        Voer hieronder uw nieuwe wachtwoord in
      </Typography>

      <NewPassForm />
    </AuthContainer>
  );
};

export default SetNewPasswordPage;

