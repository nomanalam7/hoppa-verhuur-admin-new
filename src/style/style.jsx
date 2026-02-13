const GlobalStyle = {
  datePickerStyle: {
    width: "100%",

    "& .MuiPickersInputBase-root": {
      borderRadius: "8px",
      backgroundColor: "#F7F7F8",
      borderRadius: "14px",
      border: "none",

      "& .MuiPickersSectionList-root": {
        padding: "11px",
      },

      "& .MuiPickersOutlinedInput-notchedOutline": {
        border: `1px solid #EFEFEF`,
        "&:hover": {
          border: `1px solid #EFEFEF !important`,
        },
        "&.Mui-focused": {
          border: `1px solid #EFEFEF`,
        },
      },
    },
    "&.MuiFormControl-root": {
      "& .MuiFormHelperText-root": {
        marginLeft: "0px",
      },
    },
  },
};

export default GlobalStyle;
