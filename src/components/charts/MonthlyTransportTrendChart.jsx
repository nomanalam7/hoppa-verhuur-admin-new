import { Box, Typography, Card } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MonthlyTransportTrendChart = () => {
  // Chart Data
  const data = [
    { month: "Jan", value: 130 },
    { month: "Feb", value: 550 },
    { month: "Mar", value: 370 },
    { month: "Apr", value: 750 },
    { month: "May", value: 190 },
    { month: "Jun", value: 370 },
    { month: "Jul", value: 550 },
    { month: "Aug", value: 370 },
    { month: "Sep", value: 130 },
    { month: "Oct", value: 550 },
    { month: "Nov", value: 370 },
    { month: "Dec", value: 750 },
  ];

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: "white",
            padding: "10px 14px",
            border: "1px solid #e0e0e0",
            borderRadius: "6px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            minWidth: "120px",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              fontSize: "13px",
              color: "#000",
              mb: 1,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            {label}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: "12px",
              color: "#666",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            <span style={{ color: "#F97316", fontWeight: 600 }}>Transport:</span>{" "}
            <span style={{ color: "#000", fontWeight: 500 }}>
              {payload[0].value}
            </span>
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Card
      sx={{
        padding: "16px",
        borderRadius: "16px",
        backgroundColor: "#fff",
        boxShadow: "none",
      }}
    >
      {/* Header */}
      <Box>
        <Typography
          variant="h6"
          fontSize="18px"
          fontWeight={600}
          color="#000"
          mb={0.5}
          fontFamily="Poppins, sans-serif"
        >
          Monthly Transport Trend
        </Typography>
      </Box>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 5,
          }}
          barCategoryGap="15%"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e0e0e0"
            vertical={true}
          />
          <XAxis
            dataKey="month"
            tick={{
              fontSize: 12,
              fill: "#666",
              fontWeight: 500,
              fontFamily: "Poppins, sans-serif",
            }}
            axisLine={{ stroke: "#e0e0e0" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 800]}
            tick={{
              fontSize: 12,
              fill: "#666",
              fontWeight: 500,
              fontFamily: "Poppins, sans-serif",
            }}
            axisLine={false}
            tickLine={false}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.02)" }} />
          <Bar
            dataKey="value"
            fill="#F97316"
            radius={[8, 8, 0, 0]}
            barSize={38}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default MonthlyTransportTrendChart;

