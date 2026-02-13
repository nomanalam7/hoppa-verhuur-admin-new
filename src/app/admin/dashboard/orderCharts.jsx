import React, { useMemo } from "react";
import Chart from "react-apexcharts";

const OrdersOverviewChart = ({ sevenDayOverview = [] }) => {
  // Dutch day names mapping
  const dayNamesInDutch = {
    "Sunday": "Zondag",
    "Monday": "Maandag",
    "Tuesday": "Dinsdag",
    "Wednesday": "Woensdag",
    "Thursday": "Donderdag",
    "Friday": "Vrijdag",
    "Saturday": "Zaterdag"
  };

  const chartOptions = {
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: false },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    markers: {
      size: 5,
      hover: { size: 7 },
    },
    colors: [
      "#6B7280", // Planned
      "#3B82F6", // Confirmed
      "#22C55E", // Delivered
      "#F59E0B", // Picked Up
      "#10B981", // Completed
      "#EF4444", // Overdue
    ],
    xaxis: {
      categories: sevenDayOverview.map((day) => dayNamesInDutch[day.day] || day.day) || [
        "Zondag",
        "Maandag",
        "Dinsdag",
        "Woensdag",
        "Donderdag",
        "Vrijdag",
        "Zaterdag",
      ],
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val) => `${val}`,
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
    },
    grid: {
      strokeDashArray: 4,
    },
  };

  const series = useMemo(() => {
    if (!sevenDayOverview || sevenDayOverview.length === 0) {
      return [
        { name: "Gepland", data: [0, 0, 0, 0, 0, 0, 0] },
        { name: "Bevestigd", data: [0, 0, 0, 0, 0, 0, 0] },
        { name: "Afgehandeld", data: [0, 0, 0, 0, 0, 0, 0] },
        { name: "Opgehaald", data: [0, 0, 0, 0, 0, 0, 0] },
        { name: "Voltooid", data: [0, 0, 0, 0, 0, 0, 0] },
        { name: "Te laat", data: [0, 0, 0, 0, 0, 0, 0] },
      ];
    }

    return [
      {
        name: "Gepland",
        data: sevenDayOverview.map((day) => day.Planned || 0),
      },
      {
        name: "Bevestigd",
        data: sevenDayOverview.map((day) => day.Confirmed || 0),
      },
      {
        name: "Afgehandeld",
        data: sevenDayOverview.map((day) => day.Delivered || 0),
      },
      {
        name: "Opgehaald",
        data: sevenDayOverview.map((day) => day["Picked Up"] || 0),
      },
      {
        name: "Voltooid",
        data: sevenDayOverview.map((day) => day.Completed || 0),
      },
      {
        name: "Te laat",
        data: sevenDayOverview.map((day) => day.Overdue || 0),
      },
    ];
  }, [sevenDayOverview]);

  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        marginTop: "20px",
      }}
    >
      <h3>7-Dag overzicht van bestellingen</h3>
      <Chart options={chartOptions} series={series} type="line" height={350} />
    </div>
  );
};

export default OrdersOverviewChart;