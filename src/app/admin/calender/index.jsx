import { Box, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { CustomButton } from "../../../components";
import { HeaderText } from "../../../components";
import exportIcon from "../../../assets/icons/export-icon.svg";

// import Filter from "./filter";
import CalendarComponent from "../../../components/calendar";
import useCalendar from "../../../hooks/features/calenderHooks";
import { useNavigate } from "react-router-dom";
import { exportToCSV, exportToExcel } from "../../../helper";
import { getNotificationbyType } from "../../../api/modules/notificationApi";
import LowInventoryBanner from "../../../components/lowInventoryBanner";


const Calender = () => {
  const {
    events,
    isLoading,
    fetchData,
    handleMarkAsDelivered,
    handleMarkAsPickedUp,
    handleMarkAsCompleted,
  } = useCalendar();
  console.log(events, "eventsssssssssssssssssssssssssssssss");
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();
  const [bannerNotifications, setBannerNotifications] = useState([]);

  console.log(events, "fetchData");

  useEffect(() => {
    fetchData(currentDate.getMonth() + 1, currentDate.getFullYear());
  }, [currentDate]);

  useEffect(() => {
    const fetchBannerNotifications = async () => {
      try {
        const response = await getNotificationbyType("banner");
        if (response?.status >= 200 && response?.status < 300) {
          console.log(response?.data?.data, "response?.data?.data");
          const notifications = response?.data?.data || [];
          setBannerNotifications(notifications);
        }
      } catch (error) {
        console.error("Error fetching banner notifications:", error);
        setBannerNotifications([]);
      }
    };
    fetchBannerNotifications();
  }, []);

  const handleEventSelect = (event) => {
    console.log("Event selected:", event);
    navigate(`/order-details/${event.id}`);
  };

  const handleExport = () => {
    const columns = [
      { id: "orderId", label: "Bestelnummer", value: (row) => row.orderId || "" },
      {
        id: "customerName",
        label: "Klantnaam",
        value: (row) => row.customerName || "",
      },
      { id: "type", label: "Type", value: (row) => row.type || "" },
      { id: "status", label: "Bestelstatus", value: (row) => row.status || "" },
      {
        id: "start",
        label: "Startdatum",
        value: (row) => (row.start ? new Date(row.start).toISOString() : ""),
      },
      {
        id: "end",
        label: "Einddatum",
        value: (row) => (row.end ? new Date(row.end).toISOString() : ""),
      },
      {
        id: "deliveryTime",
        label: "Leveringsdatum",
        value: (row) => row.deliveryTime || "",
      },
      {
        id: "pickupTime",
        label: "Ophaaldatum",
        value: (row) => row.pickupTime || "",
      },
      { id: "address", label: "Adres", value: (row) => row.address || "" },
      { id: "city", label: "Plaats", value: (row) => row.city || "" },
      {
        id: "paymentStatus",
        label: "Betalingsstatus",
        value: (row) => row.paymentStatus || "",
      },
      {
        id: "totalAmount",
        label: "Totaalbedrag",
        value: (row) => row.totalAmount ?? "",
      },
      {
        id: "itemCount",
        label: "Aantal items",
        value: (row) => row.itemCount ?? "",
      },
    ];

    // exportToCSV(events, columns, "calendar-events.csv");
    exportToExcel(events, columns, "calendar-events.xlsx", "Calendar");
  };

  return (
    <Box height={"auto"}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
      >
        <HeaderText
          title="Kalender"
          subtitle="Visueel overzicht van alle leveringen, ophalingen en achterstallige taken"
        />

        <Box display="flex" gap={2} my={{xs: 2, md: 0}} width={{ xs: "100%", sm: "auto" }}>
          <CustomButton
            btnLabel="Export"
            handlePressBtn={handleExport}
            variant="grayButton"
            startIcon={<img src={exportIcon} alt="export" />}
            width={{ xs: "100%", sm: "auto" }}
          />
        </Box>
      </Stack>
      {/* notification  */}
      <LowInventoryBanner notifications={bannerNotifications} />

      <Box height={"140vh"}>
        <CalendarComponent
          data={events}
          onSelectEvent={handleEventSelect}
          onNavigate={(date) => {
            setCurrentDate(date);
            fetchData(date.getMonth() + 1, date.getFullYear());
          }}
          title=""
          isLoading={isLoading}
          onMarkDelivered={handleMarkAsDelivered}
          onMarkPickedUp={handleMarkAsPickedUp}
          onMarkCompleted={handleMarkAsCompleted}
        />
      </Box>

    </Box>
  );
};

export default Calender;
