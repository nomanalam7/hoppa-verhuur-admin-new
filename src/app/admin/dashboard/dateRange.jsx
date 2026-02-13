import { Box, Grid, Popover } from "@mui/material";
import { TextInput, CustomButton } from "../../../components";
import { Download, Calendar } from "lucide-react";
import useFilterSliceKey from "../../../zustand/filter_slice_key";
import { DateRange as ReactDateRangePicker } from "react-date-range";
import { useState, useEffect } from "react";
import { format } from "date-fns";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { FILTER_MODES } from "../../../utils/filterConfig";

const DateRange = () => {
  const startDate = useFilterSliceKey(
    (state) => state.filters[FILTER_MODES.DASHBOARD]?.startDate
  );
  const endDate = useFilterSliceKey(
    (state) => state.filters[FILTER_MODES.DASHBOARD]?.endDate
  );
  const setFilterValue = useFilterSliceKey((state) => state.setFilterValue);

  const [anchorEl, setAnchorEl] = useState(null);
  const [dateRange, setDateRange] = useState([
    {
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : new Date(),
      key: "selection",
    },
  ]);

  // Update dateRange when startDate/endDate change from outside
  useEffect(() => {
    if (startDate || endDate) {
      setDateRange([
        {
          startDate: startDate ? new Date(startDate) : new Date(),
          endDate: endDate ? new Date(endDate) : new Date(),
          key: "selection",
        },
      ]);
    }
  }, [startDate, endDate]);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleApply = () => {
    const range = dateRange[0];
    setFilterValue(FILTER_MODES.DASHBOARD, "startDate", range.startDate);
    setFilterValue(FILTER_MODES.DASHBOARD, "endDate", range.endDate);
    handleClose();
  };

  const getDateRangeText = () => {
    if (startDate && endDate) {
      return `${format(new Date(startDate), "dd/MM/yyyy")} - ${format(
        new Date(endDate),
        "dd/MM/yyyy"
      )}`;
    }
    return "Selecteer datumbereik";
  };

  return (
    <Box>
      <Box onClick={handleOpen} sx={{ cursor: "pointer" }}>
        <TextInput
          fullWidth
          inputBgColor="#fff"
          placeholder="Selecteer datumbereik"
          value={getDateRangeText()}
          readonly
          InputStartIcon={<Calendar size={18} color="#808080" />}
        />
      </Box>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box p={2}>
          <ReactDateRangePicker
            ranges={dateRange}
            onChange={(item) => setDateRange([item.selection])}
            editableDateInputs
            moveRangeOnFirstSelection={false}
            months={2}
            direction="horizontal"
          />

          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <CustomButton
              btnLabel="Annuleren"
              handlePressBtn={handleClose}
              variant="customOutlined"
              height="35px"
            />
            <CustomButton
              btnLabel="Toepassen"
              handlePressBtn={handleApply}
              btnBgColor="#1D4E89"
              btnTextColor="#fff"
              height="35px"
            />
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default DateRange;
