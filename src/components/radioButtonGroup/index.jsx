import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";

const RadioButtonGroup = ({
  label,
  name,
  value,
  onChange,
  options = [],
  row = true,
}) => {
  return (
    <>
      {label && (
        <Typography
          variant="label"
          mb={2}
          fontSize={12}
          fontWeight={600}
        >
          {label}
        </Typography>
      )}
      <FormControl fullWidth>
        <RadioGroup
          row={row}
          name={name}
          value={value}
          onChange={onChange}
          sx={{ gap: 2 }}
        >
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={
                <Radio
                  sx={{
                    color: "#1D4E89",
                    "&.Mui-checked": {
                      color: "#1D4E89",
                    },
                  }}
                />
              }
              label={option.label}
              sx={{
                flex: 1,
                border: "none",
                borderRadius: "14px",
                padding: "2px",
                backgroundColor: "#F5F5F5",
                margin: 0,
                "&:hover": {
                  borderColor: "#1D4E89",
                },
                "& .MuiFormControlLabel-label": {
                  fontSize: "14px",
                  color: "#000",
                  fontWeight: 500,
                  fontFamily: "Helvetica",
                },
              }}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </>
  );
};

export default RadioButtonGroup;
