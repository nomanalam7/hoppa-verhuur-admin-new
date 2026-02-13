import { Box, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TextInput from "../../../components/textInput";
import CustomButton from "../../../components/customButton";
import { validateResetPasswordForm } from "../../../utils/validations";
import { useAuth } from "../../../hooks/features/auth";
import { useSuccessDialog } from "../../../lib/context/successDialogContext";

const NewPassForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleResetPassword, loading } = useAuth();
  const { showSuccess } = useSuccessDialog();
  
  // Get email and OTP from navigation state
  const email = location.state?.email || "";
  const otp = location.state?.otp || "";

  const [values, setValues] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // If confirming password, also validate against new password
    if (name === "confirmPassword" && values.newPassword) {
      const formErrors = validateResetPasswordForm({
        newPassword: values.newPassword,
        confirmPassword: value,
      });
      if (formErrors.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: formErrors.confirmPassword,
        }));
      }
    }
  };

  const handleSubmit = async () => {
    const formErrors = validateResetPasswordForm(values);

    if (formErrors.newPassword || formErrors.confirmPassword) {
      setErrors(formErrors);
      return;
    }

    // If validation passes, submit the form
    const result = await handleResetPassword({
      email: email,
      otp: otp,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    });

    if (result.success) {
      showSuccess({
        title: "Wachtwoord Bijgewerkt",
        subtitle: "Uw wachtwoord is succesvol bijgewerkt.",
      });
      // After successful password reset, navigate to login
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };

  return (
    <Box component="form" mt={2}>
      <Grid container spacing={2}>
        <Grid item size={{ xs: 12, md: 12 }}>
          <TextInput
            showLabel={"Nieuw Wachtwoord"}
            id="new-password"
            type="password"
            name="newPassword"
            placeholder="Voer nieuw wachtwoord in"
            value={values.newPassword}
            onChange={handleChange}
            showPassIcon={true}
            error={!!errors.newPassword}
            helperText={errors.newPassword}
          />
        </Grid>

        <Grid item size={{ xs: 12, md: 12 }}>
          <TextInput
            showLabel={"Bevestig Nieuw Wachtwoord"}
            id="confirm-password"
            type="password"
            name="confirmPassword"
            placeholder="Voer nieuw wachtwoord opnieuw in"
            value={values.confirmPassword}
            onChange={handleChange}
            showPassIcon={true}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />
        </Grid>
      </Grid>

      <Box mt={3}>
        <CustomButton
          btnLabel="Wachtwoord Bijwerken"
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

export default NewPassForm;

