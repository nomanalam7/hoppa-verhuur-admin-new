import { Box, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "../../../components/textInput";
import CustomButton from "../../../components/customButton";
import { useAuth } from "../../../hooks/features/auth";
import { validateLoginForm } from "../../../utils/validations";

const LoginForm = () => {
  const navigate = useNavigate();
  const { handleLogin, loading } = useAuth();

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async () => {
    const formErrors = validateLoginForm(values);
    
    if (formErrors.email || formErrors.password) {
      setErrors(formErrors);
      return;
    }

    const result = await handleLogin(values);
    if (result.success) {
      navigate("/dashboard");
    }
  };

  return (
    <Box component="form" mt={2}>
      <Grid container spacing={2}>
        <Grid item size={{ xs: 12, md: 12 }}>
          <TextInput
            showLabel={"E-mailadres"}
            id="login-email"
            type="email"
            name="email"
            placeholder="Voer uw e-mailadres in"
            value={values.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
        </Grid>

        <Grid item size={{ xs: 12, md: 12 }}>
          <TextInput
            showLabel={"Wachtwoord"}
            id="password"
            type="password"
            name="password"
            placeholder="Voer uw wachtwoord in"
            value={values.password}
            onChange={handleChange}
            showPassIcon={true}
            error={!!errors.password}
            helperText={errors.password}
          />
        </Grid>
      </Grid>

      <Box mt={1} textAlign="right">
        <Typography
          variant="body2"
          color="secondary.main"
          my={2}
          sx={{ cursor: "pointer", textDecoration: "underline" }}
          onClick={() => navigate("/forgot-password")}
        >
          Wachtwoord Vergeten?
        </Typography>
      </Box>
      <Box>
        <CustomButton
          btnLabel="Inloggen"
          handlePressBtn={handleSubmit}
          variant="gradient"
          fullWidth={true}
          width="100%"
          disabled={loading}
          loading={loading}
        />
      </Box>
    </Box>
  );
};

export default LoginForm;
