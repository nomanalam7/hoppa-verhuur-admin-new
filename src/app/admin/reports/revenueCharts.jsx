import { useMemo } from "react";
import Chart from "react-apexcharts";

const RevenueChart = ({ revenueOverview, loading }) => {
  const options = useMemo(
    () => ({
      chart: {
        type: "area",
        height: 350,
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      stroke: {
        curve: "smooth",
        width: 3,
        colors: ["#1E4ED8"],
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.35,
          opacityTo: 0,
          stops: [0, 90, 100],
        },
      },
      markers: {
        size: 6,
        colors: ["#1E4ED8"],
        strokeWidth: 2,
        strokeColors: "#fff",
        hover: { size: 7 },
      },
      grid: {
        strokeDashArray: 4,
        borderColor: "#E5E7EB",
      },
      dataLabels: { enabled: false },
      tooltip: {
        theme: "light",
        y: {
          formatter: (val) => `€${val.toLocaleString()}`,
        },
      },
      xaxis: {
        categories:
          revenueOverview?.chartData?.map((item) => item.month) || [],
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          formatter: (val) => `€${val / 1000}k`,
        },
      },
    }),
    [revenueOverview]
  );

  const series = useMemo(() => {
    if (!revenueOverview?.chartData || loading) {
      return [
        {
          name: "Revenue",
          data: [],
        },
      ];
    }

    return [
      {
        name: "Revenue",
        data: revenueOverview.chartData.map((item) => item.revenue || 0),
      },
    ];
  }, [revenueOverview, loading]);

  return <Chart options={options} series={series} type="area" height={350} />;
};

export default RevenueChart;
