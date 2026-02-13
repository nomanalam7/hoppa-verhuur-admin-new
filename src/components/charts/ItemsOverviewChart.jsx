import { Box, Typography, Card } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend as RechartsLegend,
} from "recharts";

const ItemsOverviewChart = () => {
  // Chart Data
  const data = [
    { name: "Verhuurd", value: 150, color: "#10B981" },
    { name: "Verkoop", value: 50, color: "#F97316" },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Custom Center Label
  const renderCustomLabel = ({ cx, cy }) => {
    return (
      <g>
        <text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontSize: "14px",
            fontWeight: 600,
            fill: "#666",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Totaal
        </text>
        <text
          x={cx}
          y={cy + 15}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontSize: "24px",
            fontWeight: 700,
            fill: "#000",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          {total}
        </text>
      </g>
    );
  };

  // Custom Legend Component
  const CustomLegend = ({ payload }) => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 3,
          mt: 2,
        }}
      >
        {payload.map((entry, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: entry.color,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                fontSize: "14px",
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
        padding: "24px",
        borderRadius: "12px",
        backgroundColor: "#fff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        position: "relative",
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
          Artikelenoverzicht
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: "14px",
            color: "#666",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Bekijk verhuurde en verkochte items.
        </Typography>
      </Box>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={75}
            outerRadius={115}
            paddingAngle={2}
            dataKey="value"
            label={renderCustomLabel}
            stroke="#fff"
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <RechartsLegend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ItemsOverviewChart;
