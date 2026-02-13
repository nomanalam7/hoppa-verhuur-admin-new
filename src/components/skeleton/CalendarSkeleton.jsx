import { Box, Skeleton } from "@mui/material";

const CalendarSkeleton = () => {
  return (
    <Box
      height={"calc(100vh - 200px)"}
      minHeight={"900px"}
      sx={{
        my: 2,
        backgroundColor: "secondary.light",
        borderRadius: "15px",
        border: "1px solid #E7E7E7",
        p: 2,
      }}
    >
      {/* Tabs Skeleton */}
      <Box display="flex" gap={2} mb={2}>
        <Skeleton variant="rounded" width={80} height={40} />
        <Skeleton variant="rounded" width={80} height={40} />
        <Skeleton variant="rounded" width={80} height={40} />
      </Box>

      {/* Toolbar Skeleton */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} p={2}>
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="text" width={200} height={30} />
        <Box display="flex" gap={1}>
          <Skeleton variant="rounded" width={80} height={40} />
          <Skeleton variant="circular" width={40} height={40} />
        </Box>
      </Box>

      {/* Calendar Grid Skeleton */}
      <Box>
        {/* Weekday Headers */}
        <Box display="flex" gap={1} mb={1}>
          {Array.from({ length: 7 }).map((_, i) => (
            <Box key={i} flex={1}>
              <Skeleton variant="text" width="100%" height={30} />
            </Box>
          ))}
        </Box>

        {/* Calendar Days */}
        {Array.from({ length: 6 }).map((_, weekIndex) => (
          <Box key={weekIndex} display="flex" gap={1} mb={1}>
            {Array.from({ length: 7 }).map((_, dayIndex) => {
              const showEvent1 = (weekIndex * 7 + dayIndex) % 3 === 0;
              const showEvent2 = (weekIndex * 7 + dayIndex) % 5 === 0;
              return (
                <Box
                  key={dayIndex}
                  flex={1}
                  sx={{
                    minHeight: "120px",
                    border: "1px solid #E7E7E7",
                    borderRadius: "8px",
                    p: 1,
                  }}
                >
                  <Skeleton variant="text" width={30} height={20} />
                  {showEvent1 && (
                    <Box mt={1}>
                      <Skeleton variant="rounded" width="100%" height={40} mb={0.5} />
                    </Box>
                  )}
                  {showEvent2 && (
                    <Box>
                      <Skeleton variant="rounded" width="100%" height={40} />
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CalendarSkeleton;

