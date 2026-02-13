import { Box, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "../../../components/textInput";
import CustomButton from "../../../components/customButton";
import DialogContainer from "../../../components/dialog/dialogContainer";
import DialogHeader from "../../../components/dialog/dialogHeader";
import DialogBody from "../../../components/dialog/dialogBody";
import DialogActionButtons from "../../../components/dialog/dialogAction";
import OtpInput from "react-otp-input";
import {
  validateForgotPasswordForm,
  validateOtp,
} from "../../../utils/validations";
import { useAuth } from "../../../hooks/features/auth";
import { useSuccessDialog } from "../../../lib/context/successDialogContext";

const ForgotForm = () => {
  const navigate = useNavigate();
  const { handleForgotPassword, handleVerifyOTP, loading } = useAuth();
  const { showSuccess } = useSuccessDialog();
  
  const [values, setValues] = useState({
    email: "",
  });

  const [errors, setErrors] = useState({
    email: "",
  });

  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async () => {
    const formErrors = validateForgotPasswordForm(values);
    
    if (formErrors.email) {
      setErrors(formErrors);
      return;
    }

    // If validation passes, call API and open OTP dialog
    const result = await handleForgotPassword(values.email);
    if (result.success) {
      showSuccess({
        title: "Code Verzonden",
        subtitle: "De verificatiecode is naar uw e-mailadres verzonden.",
      });
      setOtpDialogOpen(true);
    }
  };

  const handleOtpChange = (otpValue) => {
    setOtp(otpValue);
    if (otpError) {
      setOtpError("");
    }
  };

  const handleVerifyOtp = async () => {
    const otpErrorMsg = validateOtp(otp, 6);
    
    if (otpErrorMsg) {
      setOtpError(otpErrorMsg);
      return;
    }

    setOtpLoading(true);
    // If OTP is valid, verify with API
    const result = await handleVerifyOTP({
      email: values.email,
      otp: otp,
    });

    if (result.success) {
      setOtpDialogOpen(false);
      showSuccess({
        title: "OTP Geverifieerd",
        subtitle: "Uw OTP is succesvol geverifieerd.",
      });
      // Navigate to reset password page with email and OTP
      navigate("/set-new-password", {
        state: {
          email: values.email,
          otp: otp,
        },
      });
    }
    setOtpLoading(false);
  };

  const handleResendCode = async () => {
    setOtp("");
    setOtpError("");
    const result = await handleForgotPassword(values.email);
    if (result.success) {
      showSuccess({
        title: "Code Opnieuw Verzonden",
        subtitle: "De verificatiecode is opnieuw naar uw e-mailadres verzonden.",
      });
    }
  };

  const handleCloseOtpDialog = () => {
    setOtpDialogOpen(false);
    setOtp("");
    setOtpError("");
  };

  return (
    <>
      <Box component="form" mt={2}>
        <Grid container spacing={2}>
          <Grid item size={{ xs: 12, md: 12 }}>
            <TextInput
              showLabel={"E-mailadres"}
              id="forgot-email"
              type="email"
              name="email"
              placeholder="Voer uw e-mailadres in"
              value={values.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
        </Grid>

        <Box mt={3}>
          <CustomButton
            btnLabel="Code Versturen"
            handlePressBtn={handleSubmit}
            variant="gradient"
            fullWidth={true}
            width="100%"
            disabled={loading}
            loading={loading}
          />
        </Box>
      </Box>

      {/* OTP Dialog */}
      <DialogContainer
        open={otpDialogOpen}
        onClose={handleCloseOtpDialog}
        maxWidth="450px"
      >
        <DialogHeader
          title="Voer OTP-code in"
          onClose={handleCloseOtpDialog}
        />
        <DialogBody>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={3}
            py={2}
          >
            <Box
              display="flex"
              justifyContent="center"
              flexWrap="wrap"
              width="100%"
              sx={{
                "& .otp-container": {
                  display: "flex",
                  gap: "2px",
                  justifyContent: "center",
                  flexWrap: "wrap",
                },
                "& .otp-input": {
                  width: "45px !important",
                  height: "90px",
                  borderRadius: "12px",
                  border: otpError
                    ? "2px solid #d32f2f"
                    : "1px solid #E0E0E0",
                  fontSize: "18px",
                  fontWeight: 600,
                  fontFamily: "Poppins",
                  backgroundColor: "#F7F7F8",
                  color: "#000",
                  "&:focus": {
                    border: "2px solid #1D4E89",
                    outline: "none",
                  },
                },
              }}
            >
              <OtpInput
                value={otp}
                onChange={handleOtpChange}
                numInputs={6}
                renderSeparator={<span style={{ width: "8px" }}></span>}
                renderInput={(props) => <input {...props} />}
                inputStyle="otp-input"
                containerStyle="otp-container"
              />
            </Box>

            {otpError && (
              <Typography
                variant="body2"
                color="error.main"
                sx={{ fontSize: "12px", fontFamily: "Poppins" }}
              >
                {otpError}
              </Typography>
            )}

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                cursor: "pointer",
                textDecoration: "underline",
                fontSize: "14px",
                fontFamily: "Poppins",
              }}
              onClick={handleResendCode}
            >
              Code Opnieuw Versturen
            </Typography>
          </Box>
        </DialogBody>
        <DialogActionButtons
          onConfirm={handleVerifyOtp}
          onCancel={handleCloseOtpDialog}
          confirmText="Code Verifiëren"
          cancelText="Annuleren"
          showCancelBtn={false}
          fullWidth={true}
          confirmLoading={otpLoading}
          isConfirmBtnDisable={otpLoading}
        />
      </DialogContainer>
    </>
  );
};

export default ForgotForm;

