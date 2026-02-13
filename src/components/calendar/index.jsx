import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  addDays,
  addWeeks,
  addMonths,
  startOfToday,
  getHours,
} from "date-fns";
import { Box, Typography, IconButton } from "@mui/material";
import ToggleTabs from "../toggleTabs";
import TaskEvent from "./taskEvent";
import CalendarSkeleton from "../skeleton/CalendarSkeleton";
import DialogContainer from "../dialog/dialogContainer";
import closeIcon from "../../assets/icons/close-icon.svg";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";


// Constants
const TABS = [
  { value: "day", label: "Dag" },
  { value: "week", label: "Week" },
  { value: "month", label: "Maand" },
];

const CALENDAR_HEIGHT = {
  day: "calc(100vh - 250px)",
  week: "calc(100vh - 250px)",
  month: "calc(100vh - 150px)",
};

const MIN_HEIGHT = {
  day: "800px",
  week: "800px",
  month: "1000px",
};

// Helper Functions
const getEventsForDate = (data, date) => {
  if (!data || !Array.isArray(data)) return [];
  return data.filter((event) => {
    if (!event.start) return false;
    return isSameDay(new Date(event.start), date);
  });
};

const getEventsForWeek = (data, currentDate) => {
  if (!data || !Array.isArray(data)) return [];
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  return data.filter((event) => {
    if (!event.start) return false;
    const eventDate = new Date(event.start);
    return eventDate >= weekStart && eventDate <= weekEnd;
  });
};

const groupEventsByHour = (events) => {
  const grouped = {};
  events.forEach((event) => {
    if (event.start) {
      const hour = getHours(new Date(event.start));
      if (!grouped[hour]) grouped[hour] = [];
      grouped[hour].push(event);
    }
  });
  return grouped;
};

const getDateLabel = (view, currentDate) => {
  if (view === "day") {
    return format(currentDate, "EEEE, dd-MM-yyyy");
  } else if (view === "week") {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
    return `${format(weekStart, "dd-MM-yyyy")} - ${format(weekEnd, "dd-MM-yyyy")}`;
  }
  return format(currentDate, "MMMM yyyy");
};

// Reusable Components
const CalendarHeader = ({ title, dateLabel, onPrevious, onNext, onToday, showTodayButton, activeTab, onTabChange }) => (
  <Box
    py={2}
    display="flex"
    flexDirection={{xs: "column", md: "row"}}
    justifyContent="space-between"
    alignItems="center"
    bgcolor="primary.moonGlow"
    px={2}
  >
    <Box display="flex" alignItems="center" gap={2}>
      {/* Previous */}
      <Box
        onClick={onPrevious}
        sx={{
          width: 44,
          height: 44,
          borderRadius: "12px",
          backgroundColor: "#F3F4F6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <ChevronLeft size={20} color="#6B7280" />
      </Box>

      {/* Month Label */}
      <Box
        sx={{
          flex: 1,
          height: 44,
          borderRadius: "12px",
          backgroundColor: "#F9FAFB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          px: 2,
        }}
      >
        <CalendarDays  size={18} color="#9CA3AF" />
        <Typography
          fontSize={14}
          fontWeight={500}
          color="#6B7280"
        >
          {title} {dateLabel}
        </Typography>
      </Box>

      {/* Next */}
      <Box
        onClick={onNext}
        sx={{
          width: 44,
          height: 44,
          borderRadius: "12px",
          backgroundColor: "#1F4E8C",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <ChevronRight size={20} color="#FFFFFF" />
      </Box>
    </Box>

    <Box mt={{xs: 2, md: 0}}>
      {onTabChange && (
        <ToggleTabs
          tabs={TABS}
          activeTab={activeTab}
          onChange={onTabChange}
        />
      )}
    </Box>
  </Box>
);

const MoreEventsDialog = ({ open, onClose, events, date, onSelectEvent, onMarkDelivered, onMarkPickedUp, onMarkCompleted }) => (
  <DialogContainer open={open} onClose={onClose} maxWidth="500px">
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight={700}>
          Events for {date ? format(date, "MMMM d, yyyy") : ""}
        </Typography>
        <IconButton onClick={onClose} sx={{ padding: "4px" }}>
          <img src={closeIcon} alt="close" width={20} height={20} />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxHeight: "60vh",
          overflowY: "auto",
        }}
      >
        {events.map((event, index) => (
          <Box
            key={index}
            onClick={() => {
              if (onSelectEvent) onSelectEvent(event);
              onClose();
            }}
            sx={{ cursor: "pointer" }}
          >
            <TaskEvent event={event} onMarkDelivered={onMarkDelivered} onMarkPickedUp={onMarkPickedUp} onMarkCompleted={onMarkCompleted} />
          </Box>
        ))}
      </Box>
    </Box>
  </DialogContainer>
);

// View Components
const DayView = ({ currentDate, data, onSelectEvent, onNavigate, title, onTabChange, onMarkDelivered, onMarkPickedUp, onMarkCompleted }) => {
  const dayEvents = getEventsForDate(data, currentDate);
  const eventsByHour = groupEventsByHour(dayEvents);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const goToPrevious = () => onNavigate(addDays(currentDate, -1));
  const goToNext = () => onNavigate(addDays(currentDate, 1));
  const goToToday = () => onNavigate(startOfToday());
  const showTodayButton = !isSameDay(currentDate, startOfToday());

  return (
    <Box
      sx={{
        my: 2,
        backgroundColor: "secondary.light",
        borderRadius: "15px",
        border: "1px solid #E7E7E7",
        overflow: "hidden",
      }}
    >
      <CalendarHeader
        title={title}
        dateLabel={getDateLabel("day", currentDate)}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onToday={goToToday}
        showTodayButton={showTodayButton}
        activeTab="day"
        onTabChange={onTabChange}
      />
      <Box
        sx={{
          height: CALENDAR_HEIGHT.day,
          minHeight: MIN_HEIGHT.day,
          overflowY: "auto",
          p: 2,
        }}
      >
        {hours.map((hour) => (
          <Box
            key={hour}
            sx={{
              display: "flex",
              borderBottom: "1px solid #E7E7E7",
              minHeight: "80px",
            }}
          >
            <Box
              sx={{
                width: "80px",
                padding: "8px",
                borderRight: "1px solid #E7E7E7",
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <Typography fontSize="14px" fontWeight={500} color="#666">
                {format(new Date().setHours(hour, 0, 0, 0), "HH:mm")}
              </Typography>
            </Box>
            <Box sx={{ flex: 1, padding: "8px", position: "relative" }}>
              {eventsByHour[hour]?.map((event, index) => (
                <Box
                  key={index}
                  onClick={() => onSelectEvent && onSelectEvent(event)}
                  sx={{ mb: 1 }}
                >
                  <TaskEvent event={event} onMarkDelivered={onMarkDelivered} onMarkPickedUp={onMarkPickedUp} onMarkCompleted={onMarkCompleted} />
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const WeekView = ({ currentDate, data, onSelectEvent, onNavigate, title, onTabChange, onMarkDelivered, onMarkPickedUp, onMarkCompleted }) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) });
  const eventsByDay = {};
  weekDays.forEach((day) => {
    eventsByDay[format(day, "yyyy-MM-dd")] = getEventsForDate(data, day);
  });

  const goToPrevious = () => onNavigate(addWeeks(currentDate, -1));
  const goToNext = () => onNavigate(addWeeks(currentDate, 1));
  const goToToday = () => onNavigate(startOfToday());
  const showTodayButton = !isSameMonth(currentDate, startOfToday());

  return (
    <Box
      sx={{
        my: 2,
        backgroundColor: "secondary.light",
        borderRadius: "15px",
        border: "1px solid #E7E7E7",
        overflow: "hidden",
      }}
    >
      <CalendarHeader
        title={title}
        dateLabel={getDateLabel("week", currentDate)}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onToday={goToToday}
        showTodayButton={showTodayButton}
        activeTab="week"
        onTabChange={onTabChange}
      />
      <Box sx={{ display: "flex", borderBottom: "1px solid #E7E7E7" }}>
        <Box sx={{ width: "80px", padding: "12px", borderRight: "1px solid #E7E7E7" }}></Box>
        {weekDays.map((day) => (
          <Box
            key={format(day, "yyyy-MM-dd")}
            sx={{
              flex: 1,
              borderRight: "1px solid #E7E7E7",
              padding: "12px",
              textAlign: "center",
            }}
          >
            <Typography fontSize="12px" fontWeight={600} color="#374151">
              {format(day, "EEE")}
            </Typography>
            <Typography fontSize="14px" fontWeight={400} color="#374151">
              {format(day, "d")}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          height: CALENDAR_HEIGHT.week,
          minHeight: MIN_HEIGHT.week,
          overflowY: "auto",
        }}
      >
        {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
          <Box
            key={hour}
            sx={{
              display: "flex",
              borderBottom: "1px solid #E7E7E7",
              minHeight: "80px",
            }}
          >
            <Box
              sx={{
                width: "80px",
                padding: "8px",
                borderRight: "1px solid #E7E7E7",
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <Typography fontSize="14px" fontWeight={500} color="#666">
                {format(new Date().setHours(hour, 0, 0, 0), "HH:mm")}
              </Typography>
            </Box>
            {weekDays.map((day) => {
              const dayKey = format(day, "yyyy-MM-dd");
              const dayEvents = eventsByDay[dayKey] || [];
              const hourEvents = dayEvents.filter((event) => {
                if (!event.start) return false;
                return getHours(new Date(event.start)) === hour;
              });

              return (
                <Box
                  key={dayKey}
                  sx={{
                    flex: 1,
                    borderRight: "1px solid #E7E7E7",
                    padding: "4px",
                    position: "relative",
                  }}
                >
                  {hourEvents.map((event, index) => (
                    <Box
                      key={index}
                      onClick={() => onSelectEvent && onSelectEvent(event)}
                      sx={{ mb: 0.5 }}
                    >
                      <TaskEvent event={event} onMarkDelivered={onMarkDelivered} onMarkPickedUp={onMarkPickedUp} onMarkCompleted={onMarkCompleted} />
                    </Box>
                  ))}
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const MonthView = ({
  currentDate,
  data,
  onSelectEvent,
  onNavigate,
  title,
  onShowMore,
  onTabChange,
  onMarkDelivered,
  onMarkPickedUp,
  onMarkCompleted,
}) => {
  const goToPrevious = () => onNavigate(addMonths(currentDate, -1));
  const goToNext = () => onNavigate(addMonths(currentDate, 1));
  const goToToday = () => onNavigate(startOfToday());
  const showTodayButton = !isSameMonth(currentDate, startOfToday());

  const tileContent = ({ date, view: calendarView }) => {
    if (calendarView === "month") {
      const dayEvents = getEventsForDate(data, date);
      if (dayEvents.length > 0) {
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              width: "100%",
              mt: "4px",
            }}
          >
            {dayEvents.slice(0, 2).map((event, index) => (
              <Box
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectEvent) onSelectEvent(event);
                }}
              >
                <TaskEvent event={event} onMarkDelivered={onMarkDelivered} onMarkPickedUp={onMarkPickedUp} onMarkCompleted={onMarkCompleted} />
              </Box>
            ))}
            {dayEvents.length > 2 && (
              <Box
                sx={{
                  backgroundColor: "#1D4E89",
                  borderRadius: "10px",
                  padding: "5px",
                  marginTop: "10px",
                  textAlign: "center",
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#1D4E89" },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onShowMore(dayEvents, date);
                }}
              >
                <Typography fontSize="10px" fontWeight={600} color="#fff">
                  {dayEvents.length - 2}+ more
                </Typography>
              </Box>
            )}
          </Box>
        );
      }
    }
    return null;
  };

  const tileClassName = ({ date, view: calendarView }) => {
    if (calendarView === "month") {
      const dayEvents = getEventsForDate(data, date);
      return dayEvents.length > 0 ? "has-events" : null;
    }
    return null;
  };

  return (
    <Box
      height={CALENDAR_HEIGHT.month}
      minHeight={MIN_HEIGHT.month}
      sx={{
        my: 2,
        backgroundColor: "secondary.light",
        borderRadius: "15px",
        border: "1px solid #E7E7E7",
        overflow: "hidden",
        "& .react-calendar": {
          width: "100%",
          border: "none",
          backgroundColor: "transparent",
          fontFamily: "Helvetica, sans-serif",
        },
        "& .react-calendar__navigation": { display: "none" },
        "& .react-calendar__month-view__weekdays": {
          textAlign: "center",
          textTransform: "none",
          fontWeight: 400,
          fontSize: "0.875rem",
          padding: "14px 3px",
          borderBottom: "1px solid #E7E7E7",
          backgroundColor: "secondary.light",
          fontFamily: "Helvetica, sans-serif",
        },
        "& .react-calendar__month-view__weekdays__weekday": {
          padding: "0.5em",
          color: "#374151",
        },
        "& .react-calendar__month-view__weekdays__weekday abbr": {
          textDecoration: "none",
        },
        "& .react-calendar__month-view__days": {
          borderTop: "1px solid #E7E7E7",
        },
        "& .react-calendar__tile": {
          maxWidth: "100%",
          padding: "8px 4px",
          background: "none",
          textAlign: "left",
          lineHeight: "20px",
          fontSize: "16px",
          minHeight: "120px",
          border: "1px solid #E7E7E7",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          color:"#000"
        },
        "& .react-calendar__tile:enabled:hover": {
          backgroundColor: "#f9fafb",
        },
        "& .react-calendar__tile:enabled:focus": {
          backgroundColor: "#f9fafb",
        },
        "& .react-calendar__tile--now": {
          background: "#fff3cd",
        },
        "& .react-calendar__tile--now:enabled:hover": {
          background: "#fff3cd",
        },
        "& .react-calendar__tile--active": {
          background: "transparent",
          color: "#000",
        },
        "& .react-calendar__tile--active:enabled:hover": {
          background: "#f9fafb",
        },
        "& .react-calendar__tile--neighboringMonth": {
          color: "#9CA3AF",
          opacity: 0.5,
        },
        "& .react-calendar__tile abbr": {
          display: "block",
          marginBottom: "4px",
          fontWeight: 400,
        },
        "& .has-events": {
          backgroundColor: "#f9fafb",
        },
      }}
    >
      <CalendarHeader
        title={title}
        dateLabel={getDateLabel("month", currentDate)}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onToday={goToToday}
        showTodayButton={showTodayButton}
        activeTab="month"
        onTabChange={onTabChange}
      />
      <Calendar
        onChange={onNavigate}
        value={currentDate}
        tileContent={tileContent}
        tileClassName={tileClassName}
      />
    </Box>
  );
};

// Main Component
const CalendarComponent = ({
  data,
  onSelectEvent,
  title,
  onNavigate,
  isLoading,
  onMarkDelivered,
  onMarkPickedUp,
  onMarkCompleted,
}) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [view, setView] = React.useState("month");
  const [showMoreDialog, setShowMoreDialog] = React.useState(false);
  const [moreEvents, setMoreEvents] = React.useState([]);
  const [moreEventsDate, setMoreEventsDate] = React.useState(null);

  const handleTabChange = (tabId) => {
    setView(tabId);
  };

  const handleDateChange = (date) => {
    setCurrentDate(date);
    if (onNavigate) onNavigate(date);
  };

  const handleShowMore = (events, date) => {
    setMoreEvents(events);
    setMoreEventsDate(date);
    setShowMoreDialog(true);
  };

  if (isLoading) {
    return <CalendarSkeleton />;
  }

  return (
    <>
      {view === "day" && (
        <DayView
          currentDate={currentDate}
          data={data}
          onSelectEvent={onSelectEvent}
          onNavigate={handleDateChange}
          title={title}
          onTabChange={handleTabChange}
          onMarkDelivered={onMarkDelivered}
          onMarkPickedUp={onMarkPickedUp}
          onMarkCompleted={onMarkCompleted}
        />
      )}
      {view === "week" && (
        <WeekView
          currentDate={currentDate}
          data={data}
          onSelectEvent={onSelectEvent}
          onNavigate={handleDateChange}
          title={title}
          onTabChange={handleTabChange}
          onMarkDelivered={onMarkDelivered}
          onMarkPickedUp={onMarkPickedUp}
          onMarkCompleted={onMarkCompleted}
        />
      )}
      {view === "month" && (
        <MonthView
          currentDate={currentDate}
          data={data}
          onSelectEvent={onSelectEvent}
          onNavigate={handleDateChange}
          title={title}
          onShowMore={handleShowMore}
          onTabChange={handleTabChange}
          onMarkDelivered={onMarkDelivered}
          onMarkPickedUp={onMarkPickedUp}
          onMarkCompleted={onMarkCompleted}
        />
      )}
      <MoreEventsDialog
        open={showMoreDialog}
        onClose={() => setShowMoreDialog(false)}
        events={moreEvents}
        date={moreEventsDate}
        onSelectEvent={onSelectEvent}
        onMarkDelivered={onMarkDelivered}
        onMarkPickedUp={onMarkPickedUp}
        onMarkCompleted={onMarkCompleted}
      />
    </>
  );
};

export default CalendarComponent;
