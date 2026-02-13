import { Box, Typography, Card } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend as RechartsLegend,
} from "recharts";

const RevenueSplitChart = () => {
  // Chart Data
  const data = [
    { name: "Rental", value: 28450, percentage: 62, color: "#04C373" },
    { name: "Sale", value: 17230, percentage: 38, color: "#F97316" },
    { name: "Transport", value: 7035, percentage: 17, color: "#FF0004" },
  ];

  // Custom Label for segments with lines
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    // Line starts from outer edge of segment
    const lineStartX = cx + outerRadius * Math.cos(-midAngle * RADIAN);
    const lineStartY = cy + outerRadius * Math.sin(-midAngle * RADIAN);

    // Label position - further out from chart
    const labelDistance = outerRadius + 25;
    const labelX = cx + labelDistance * Math.cos(-midAngle * RADIAN);
    const labelY = cy + labelDistance * Math.sin(-midAngle * RADIAN);

    const item = data[index];

    // Determine text anchor based on position
    const textAnchor = labelX > cx ? "start" : "end";
    const offsetX = labelX > cx ? 5 : -5;

    return (
      <g>
        <line
          x1={lineStartX}
          y1={lineStartY}
          x2={labelX}
          y2={labelY}
          stroke={item.color}
          strokeWidth={1}
        />
        <text
          x={labelX + offsetX}
          y={labelY}
          textAnchor={textAnchor}
          dominantBaseline="middle"
          fill={item.color}
          fontSize={13}
          fontWeight={500}
          fontFamily="Poppins, sans-serif"
        >
          {item.percentage}% (€{item.value.toLocaleString()})
        </text>
      </g>
    );
  };

  // Custom Legend Component - Simple with just colored circle and category name
  const CustomLegend = ({ payload }) => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 3,
          mt: 1.5,
          flexWrap: "wrap",
        }}
      >
        {payload.map((entry, index) => {
          return (
            <Box key={index} display="flex" alignItems="center" gap={1}>
              <Box
                width={10}
                height={10}
                borderRadius="50%"
                backgroundColor={entry.color}
                flexShrink={0}
              />
              <Typography
                variant="body2"
                fontSize="13px"
                color="#000"
                fontWeight={500}
                whiteSpace="nowrap"
                fontFamily="Poppins, sans-serif"
              >
                {entry.value}
              </Typography>
            </Box>
          );
        })}
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
        <Typography variant="h6" fontSize="18px" fontWeight={600} color="#000">
          Revenue Split
        </Typography>
      </Box>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={280}>
        <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={1}
            dataKey="value"
            label={renderCustomLabel}
            labelLine={false}
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

export default RevenueSplitChart;
