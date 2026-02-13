import { Box, Grid, MenuItem } from "@mui/material";
import { CustomSelect, TextInput } from "..";
import { Search } from "lucide-react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import GlobalStyle from "../../style/style";
import {
  getFilterConfig,
  FILTER_FIELD_TYPES,
  FILTER_MODES,
} from "../../utils/filterConfig";
import useFilterSliceKey from "../../zustand/filter_slice_key";
import DateRange from "../../app/admin/reports/dateRange";
  
const Filter = ({ mode = FILTER_MODES.DASHBOARD }) => {
  const config = getFilterConfig(mode);
  const { filters, setFilterValue } = useFilterSliceKey();
  
  // Get current filter values for this mode
  const values = filters[mode] || {};

  const handleFieldChange = (fieldId, newValue) => {
    setFilterValue(mode, fieldId, newValue);
  };

  const renderField = (field) => {
    const { type, id, placeholder, options, gridSize } = field;
    const fieldValue = values[id] || "";

    switch (type) {
      case FILTER_FIELD_TYPES.SEARCH:
        return (
          <Grid item size={gridSize || { xs: 9 }} key={id}>
            <TextInput
              placeholder={placeholder}
              fullWidth={true}
              InputStartIcon={<Search size={18} color="#808080" />}
              value={fieldValue}
              onChange={(event) => handleFieldChange(id, event.target.value)}
            />
          </Grid>
        );

      case FILTER_FIELD_TYPES.DATE:
        return (
          <Grid item size={gridSize || { xs: 12 }} key={id}>
            <DatePicker
              format="dd-MM-yyyy"
              value={fieldValue || null}
              onChange={(newValue) => handleFieldChange(id, newValue)}
              sx={GlobalStyle.datePickerStyle}
              slotProps={{
                textField: {
                  placeholder: placeholder,
                  fullWidth: true,
                },
              }}
            />
          </Grid>
        );

      case FILTER_FIELD_TYPES.SELECT:
        return (
          <Grid item size={gridSize || { xs: 12 }} key={id}>
            <CustomSelect
              placeholder={placeholder}
              fullWidth={true}
              height="45px"
              value={fieldValue}
              onChange={(event) => handleFieldChange(id, event.target.value)}
            >
              {options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </CustomSelect>
          </Grid>
        );

      case FILTER_FIELD_TYPES.DATE_RANGE:
        return (
          <Grid item size={gridSize || { xs: 12 }} key={id}>
            <DateRange />
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box display="flex" gap={2} alignItems="center">
        <Grid container spacing={2} width="100%">
          {config.fields.map((field) => renderField(field))}
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default Filter;
