import { Box, Typography } from "@mui/material";
import ToggleTabs from "../toggleTabs";

const TableWrapper = ({
  title,
  children,
  isToggleTabs = false,
  tabs = [],
  activeTab = "",
  handleTabChange = () => {},
}) => {
  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "none",
        my: 3,
      }}
    >
      <Box
        py={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexDirection={{ xs: "column", sm: "row" }}
        gap={2}
      >
        <Typography fontSize={18} color="primary.main" fontWeight={600}>
          {title}
        </Typography>
        {isToggleTabs && (
          <ToggleTabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={handleTabChange}
          />
        )}
      </Box>
      {children}
    </Box>
  );
};

export default TableWrapper;
