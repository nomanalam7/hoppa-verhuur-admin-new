import { Box, Typography, Grid } from "@mui/material";
import { useState } from "react";
import TextInput from "../../../components/textInput";
import CustomButton from "../../../components/customButton";
import CustomInputLabel from "../../../components/customInputLabel";
import { useAuth } from "../../../hooks/features/auth";
import { validateChangePasswordForm } from "../../../utils/validations";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const { handleChangePassword } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleUpdatePassword = async () => {
    const validationErrors = validateChangePasswordForm(formData);
    setErrors(validationErrors);

    const hasErrors = Object.values(validationErrors).some(
      (error) => error !== ""
    );
    if (hasErrors) return;

    setLoading(true);
    try {
      const response = await handleChangePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (response?.success) {
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setErrors({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      console.error("Error updating password:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="primaryText" fontSize={24} mb={3}>
        Wachtwoord wijzigen
      </Typography>

      {/* Form */}
      <Grid container spacing={3}>
        <Grid item size={{ xs: 12, md: 6 }}>
          <CustomInputLabel label="Huidig wachtwoord" />
          <TextInput
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleInputChange}
            placeholder="Voer je huidige wachtwoord in"
            showPassIcon
            error={!!errors.currentPassword}
            helperText={errors.currentPassword}
          />
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
          <CustomInputLabel label="Nieuw wachtwoord" />
          <TextInput
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleInputChange}
            placeholder="Voer je nieuwe wachtwoord in"
            showPassIcon
            error={!!errors.newPassword}
            helperText={errors.newPassword}
          />
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
          <CustomInputLabel label="Bevestig nieuw wachtwoord" />
          <TextInput
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Bevestig je nieuwe wachtwoord"
            showPassIcon
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />
        </Grid>
      </Grid>

      {/* Button */}
      <Box
        display="flex"
        justifyContent={{ xs: "flex-start", sm: "flex-end" }}
        mt={4}
      >
        <CustomButton
          btnLabel={loading ? "Bijwerken..." : "Wachtwoord bijwerken"}
          variant="gradient"
          width="fit-content"
          height={40}
          disabled={loading}
          handlePressBtn={handleUpdatePassword}
        />
      </Box>
    </Box>
  );
};

export default ChangePassword;
