import { Box, Typography, Card } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const MonthlyRevenueTrendChart = () => {
  // Chart Data
  const data = [
    { month: "Jan", Rentals: 300, Sales: 350 },
    { month: "Feb", Rentals: 280, Sales: 340 },
    { month: "Mar", Rentals: 180, Sales: 300 },
    { month: "Apr", Rentals: 750, Sales: 500 },
    { month: "May", Rentals: 650, Sales: 350 },
    { month: "Jun", Rentals: 680, Sales: 360 },
    { month: "Jul", Rentals: 800, Sales: 600 },
    { month: "Aug", Rentals: 900, Sales: 850 },
    { month: "Sep", Rentals: 1000, Sales: 1100 },
    { month: "Oct", Rentals: 1100, Sales: 1250 },
  ];

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: "white",
            padding: "12px 16px",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            minWidth: "140px",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              fontSize: "13px",
              color: "#000",
              mb: 1.5,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 0.5,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: entry.color,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontSize: "12px",
                  color: entry.color,
                  fontWeight: 600,
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                {entry.name}: €{entry.value.toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  // Custom Legend Component
  const CustomLegend = ({ payload }) => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 3,
          mt: 1,
        }}
      >
        {payload.map((entry, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 2,
                backgroundColor: entry.color,
                borderRadius: "1px",
              }}
            />
            <Typography
              variant="body2"
              sx={{
                fontSize: "12px",
                color: "#666",
                fontWeight: 500,
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {entry.value}
            </Typography>
          </Box>
        ))}
      </Box>
    );
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
          Monthly Revenue Trend
        </Typography>
      </Box>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e0e0e0"
            vertical={false}
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
            domain={[0, 1400]}
            tick={{
              fontSize: 12,
              fill: "#666",
              fontWeight: 500,
              fontFamily: "Poppins, sans-serif",
            }}
            axisLine={false}
            tickLine={false}
            width={50}
            tickFormatter={(value) => {
              if (value === 0) return "€0k";
              return value.toString();
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
          <Line
            type="monotone"
            dataKey="Rentals"
            stroke="#F97316"
            strokeWidth={2.5}
            dot={{ fill: "#F97316", r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="Sales"
            stroke="#10B981"
            strokeWidth={2.5}
            dot={{ fill: "#10B981", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default MonthlyRevenueTrendChart;
