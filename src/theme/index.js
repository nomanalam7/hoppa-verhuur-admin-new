import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00295C", // Primary Blue
      maintwo: "#1D4E89", // Secondary Blue
      text: "#4F4E6A",
      light: "#1D4E89",
      lightGray: "#F5F5F5",
      darkGray: "#4B4B4B",
      dark: "#00295C",
      contrastText: "#151515",
      lightOrange: "#1D4E891A",
      lightText: "#000000B2",
    },
    secondary: {
      main: "#1D4E89",
      light: "#fff",
      dark: "#00295C",
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
      dark: "#ffff",
      card: "#ffffff",
    },
    gradient: {
      primary: "linear-gradient(90deg, #00295C, #1D4E89)",
      secondary: "linear-gradient(135deg, #151515, #1D4E89)",
      card: "linear-gradient(135deg, #00295C, #1D4E89)",
      auth: "linear-gradient(135deg, #151515, #1D4E89)",
    },
    text: {
      primary: "#000",
      secondary: "#B0B0B0",
      disabled: "#666666",
      white: "#ffffff",
      dark: "#151515",
    },
    error: {
      main: "#d32f2f",
      light: "#ef5350",
      dark: "#c62828",
    },
    success: {
      main: "#1D4E89",
      light: "#1D4E89",
      dark: "#00295C",
    },
  },
  typography: {
    fontFamily: '"Poppins", sans-serif',
    h1: {
      fontSize: 48,
      fontWeight: 700,
      color: "#000",
      fontFamily: '"Poppins", sans-serif',
    },
    h2: {
      fontSize: 40,
      fontWeight: 700,
      color: "#000",
      fontFamily: '"Poppins", sans-serif',
    },
    h3: {
      fontSize: 32,
      fontWeight: 700,
      color: "#000",
      fontFamily: '"Poppins", sans-serif',
    },
    h4: {
      fontSize: 28,
      fontWeight: 600,
      color: "#030229",
      fontFamily: '"Poppins", sans-serif',
    },
    h5: {
      fontSize: 24,
      fontWeight: 600,
      color: "#000",
      fontFamily: '"Poppins", sans-serif',
    },
    h6: {
      fontSize: 20,
      fontWeight: 600,
      color: "#000",
      fontFamily: '"Poppins", sans-serif',
    },
    subtitle1: {
      fontSize: 16,
      fontWeight: 500,
      color: "#67768B",
      fontFamily: '"Poppins", sans-serif',
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: 14,
      fontWeight: 400,
      color: "#67768B",
      fontFamily: '"Poppins", sans-serif',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: 16,
      fontWeight: 400,
      color: "#000",
      fontFamily: '"Poppins", sans-serif',
    },
    body2: {
      fontSize: 14,
      fontWeight: 400,
      color: "#67768B",
      fontFamily: '"Poppins", sans-serif',
    },
    caption: {
      fontSize: 12,
      fontWeight: 400,
      color: "#67768B",
      fontFamily: '"Poppins", sans-serif',
    },
    primaryText: {
      fontSize: 16,
      fontWeight: 500,
      color: "#000",
      fontFamily: '"Poppins", sans-serif',
    },
    secondaryText: {
      fontSize: 12,
      fontWeight: 400,
      color: "#666666",
      fontFamily: '"Poppins", sans-serif',
    },
    button: {
      fontSize: 16,
      fontWeight: 500,
      color: "#000",
      fontFamily: '"Poppins", sans-serif',
      textTransform: "none",
      small2: {
        fontSize: 10,
        fontWeight: 400,
        color: "#67768B",
        fontFamily: '"Poppins", sans-serif',
        lineHeight: 1.5,
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 12,
          fontWeight: 400,
          fontFamily: '"Poppins", sans-serif',
        },
      },
      variants: [
        {
          props: { variant: "gradient" },
          style: {
            background: "linear-gradient(90deg, #00295C, #1D4E89)",
            color: "#ffffff",
            padding: "12px",
            fontSize: "16px",
            "&:hover": {
              background: "linear-gradient(90deg, #1D4E89, #00295C)",
              transform: "translateY(-2px)",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            },
          },
        },
        {
          props: { variant: "authbutton" },
          style: {
            background: "linear-gradient(90deg, #00295C, #1D4E89)",
            color: "#fff",
            padding: "30px 30px",
            fontSize: "18px",
            borderRadius: "8px",
            fontWeight: 700,
            "&:hover": {
              background: "linear-gradient(90deg, #1D4E89, #00295C)",
              transform: "translateY(-2px)",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            },
          },
        },
        {
          props: { variant: "webbutton" },
          style: {
            background: "linear-gradient(90deg, #00295C, #1D4E89)",
            color: "#ffffff",
            padding: "30px 30px",
            fontSize: "18px",
            borderRadius: "12px",
            fontWeight: 500,
            "&:hover": {
              background: "linear-gradient(90deg, #1D4E89, #00295C)",
              transform: "translateY(-2px)",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            },
          },
        },

        {
          props: { variant: "gradientbtn" },
          style: {
            background:
              "linear-gradient(135deg, #00295C 0%, #1D4E89 50%, #00295C 100%)", // Multi-stop gradient
            color: "#ffffff",
            padding: "12px 24px", // �� Better padding
            fontSize: "16px",
            fontWeight: "600", // 🟢 Bold text
            borderRadius: "12px",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", // 🟢 Smooth transition

            "&::before": {
              // �� Shine effect
              content: '""',
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "100%",
              height: "100%",
              // background:
              //   "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
              transition: "left 0.5s",
            },

            "&:hover": {
              // background:
              //   "linear-gradient(135deg, #F97316 0%, #F97316 50%, #F97316 100%)", // �� Brighter on hover
              transform: "translateY(-3px) scale(1.02)", // 🟢 Enhanced lift effect
              // boxShadow:
              //   "0 8px 25px rgba(0, 41, 92, 0.4), 0 0 0 1px rgba(29, 78, 137, 0.1)", // Glowing shadow

              "&::before": {
                left: "100%", // 🟢 Shine animation
              },
            },

            "&:active": {
              transform: "translateY(-1px) scale(0.98)", // 🟢 Press effect
            },
          },
        },
        {
          props: { variant: "errorbtn" },
          style: {
            background: "linear-gradient(to top, #FDA1A1, #FF0000)",
            color: "#ffff",
            padding: "30px 30px",
            fontSize: "18px",
            borderRadius: "8px",
            fontWeight: 500,
            "&:hover": {
              background: "linear-gradient(to top, #FDA1A1, #FF0000)",
              transform: "translateY(-2px)",
              boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
            },
          },
        },
        {
          props: { variant: "customOutlined" },
          style: {
            backgroundColor: "#fff",
            fontSize: 12,
            height: 34,
            width: 150,
            borderRadius: "16px",
            textTransform: "none",
            border: "2px solid #1D4E89",
            borderColor: "#1D4E89",
            color: "#1D4E89",
          },
        },
        {
          props: { variant: "grayButton" },
          style: {
            backgroundColor: "#F2F2F499",
            color: "rgba(95, 91, 91, 0.74)",
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: 500,
            borderRadius: "12px",
            textTransform: "none",
            border: "none",
            "&:hover": {
              backgroundColor: "#F5F5F5",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              transform: "translateY(-1px)",
            },
          },
        },
        {
          props: { variant: "mainButton" },
          style: {
            backgroundColor: "#1D4E89",
            color: "#ffffff",
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: 500,
            borderRadius: "12px",
            textTransform: "none",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 5px 15px rgba(0, 41, 92, 0.3)",
            },
            "&:active": {
              transform: "translateY(0)",
            },
          },
        },
      ],
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: '"Poppins", sans-serif',
        },
      },
    },
  },
});

export default theme;
