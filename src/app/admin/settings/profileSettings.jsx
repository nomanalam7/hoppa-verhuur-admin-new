import { Box, Typography, Grid } from "@mui/material";
import TextInput from "../../../components/textInput";
import CustomButton from "../../../components/customButton";
import CustomInputLabel from "../../../components/customInputLabel";

const ProfileSettings = ({ formData, loading, onChange, onSave, onCancel }) => {
  return (
    <Box>
      <Typography variant="primaryText" fontSize={20} mb={3}>
        Beheerderprofiel
      </Typography>

      {/* FORM GRID */}
      <Grid container spacing={3}>
        {/* Naam */}
        <Grid item size={{ xs: 12, sm: 6 }}>
          <CustomInputLabel label="Naam" />
          <TextInput
            name="fullName"
            value={formData.fullName}
            onChange={onChange}
            placeholder="Vul je naam in"
            fullWidth
          />
        </Grid>

        {/* E-mail */}
        <Grid item size={{ xs: 12, sm: 6 }}>
          <CustomInputLabel label="E-mail" />
          <TextInput name="email" value={formData.email} disabled fullWidth />
        </Grid>

        {/* Telefoon */}
        <Grid item size={{ xs: 12, sm: 6 }}>
          <CustomInputLabel label="Telefoon" />
          <TextInput
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={onChange}
            placeholder="Vul je telefoonnummer in"
            fullWidth
          />
        </Grid>
      </Grid>

      {/* ACTION BUTTONS */}
      <Box
        display="flex"
        justifyContent={{ xs: "flex-start", sm: "flex-end" }}
        gap={2}
        mt={4}
      >
        <CustomButton
          btnLabel="Annuleren"
          variant="customOutlined"
          width={120}
          height={40}
          handlePressBtn={onCancel}
        />

        <CustomButton
          btnLabel={loading ? "Opslaan..." : "Profiel opslaan"}
          variant="gradient"
          width={150}
          height={40}
          disabled={loading}
          handlePressBtn={onSave}
        />
      </Box>
    </Box>
  );
};

export default ProfileSettings;
