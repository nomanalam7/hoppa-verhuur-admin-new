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

const UpcomingWorkloadChart = () => {
  // Chart Data
  const data = [
    {
      day: "Ma",
      Leveringen: 45,
      Ophalen: 30,
      "Actieve verhuur": 15,
    },
    {
      day: "Di",
      Leveringen: 85,
      Ophalen: 50,
      "Actieve verhuur": 60,
    },
    {
      day: "Wo",
      Leveringen: 35,
      Ophalen: 40,
      "Actieve verhuur": 25,
    },
    {
      day: "Do",
      Leveringen: 55,
      Ophalen: 65,
      "Actieve verhuur": 20,
    },
    {
      day: "Vr",
      Leveringen: 70,
      Ophalen: 91,
      "Actieve verhuur": 10,
    },
    {
      day: "Za",
      Leveringen: 25,
      Ophalen: 30,
      "Actieve verhuur": 5,
    },
    {
      day: "Zo",
      Leveringen: 20,
      Ophalen: 15,
      "Actieve verhuur": 8,
    },
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
              mb: 1.5,
            }}
          >
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Typography
              key={index}
              variant="body2"
              sx={{
                fontSize: "12px",
                color: "#666",
                mb: 0.5,
              }}
            >
              <span style={{ color: entry.color, fontWeight: 600 }}>
                {entry.name}:
              </span>{" "}
              <span style={{ color: "#000", fontWeight: 500 }}>
                {entry.value}
              </span>
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Card
      sx={{
        padding: "24px",
        borderRadius: "12px",
        backgroundColor: "#fff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      {/* Header */}
      <Box mb={2}>
        <Typography
          variant="h6"
          sx={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#000",
            mb: 0.5,
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Aankomende werklast
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: "14px",
            color: "#666",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Overzicht komende 7 dagen
        </Typography>
      </Box>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            left: 0,
            bottom: 10,
          }}
          barCategoryGap="20%"
          barGap={8}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e0e0e0"
            vertical={false}
          />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 12, fill: "#666", fontWeight: 500 }}
            axisLine={{ stroke: "#e0e0e0" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 12, fill: "#666", fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.02)" }} />
          <Bar
            dataKey="Leveringen"
            fill="#F97316"
            radius={[8, 8, 0, 0]}
            barSize={24}
          />
          <Bar
            dataKey="Ophalen"
            fill="#10B981"
            radius={[8, 8, 0, 0]}
            barSize={24}
          />
          <Bar
            dataKey="Actieve verhuur"
            fill="#DC2626"
            radius={[8, 8, 0, 0]}
            barSize={24}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default UpcomingWorkloadChart;
