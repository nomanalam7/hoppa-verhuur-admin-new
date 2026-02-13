import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Skeleton,
} from "@mui/material";
import { Bell } from "lucide-react";

import moment from "moment";
import { useNotifications } from "../../../hooks/features/notification";

const NotificationSkeleton = () => {
  return (
    <Card sx={{ borderLeft: "4px solid #e0e0e0", boxShadow: "none" }}>
      <CardContent>
        <Stack spacing={1}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" gap={1} alignItems="center">
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="text" width={120} height={22} />
            </Box>
            <Skeleton variant="rounded" width={40} height={20} />
          </Box>

          <Skeleton variant="text" width="90%" />
          <Skeleton variant="text" width="60%" />
        </Stack>
      </CardContent>
    </Card>
  );
};

const NotificationsPage = () => {
  const { notifications, loading } = useNotifications();

  return (
    <Box p={2}>
      <Typography variant="h6" fontWeight={600} mb={3}>
        Notifications
      </Typography>

      <Stack spacing={2}>
        {loading ? (
          // 🔥 Skeletons
          Array.from(new Array(4)).map((_, index) => (
            <NotificationSkeleton key={index} />
          ))
        ) : notifications?.length > 0 ? (
          // ✅ Real Data
          notifications.map((item) => (
            <Card
              key={item._id}
              sx={{
                borderLeft: item.isRead
                  ? "4px solid #e0e0e0"
                  : "4px solid #1976d2",
                backgroundColor: item.isRead ? "#ffffffff" : "#fff",
                cursor: "pointer",
                boxShadow: "none",
                borderRadius: "8px",
                "&:hover": { boxShadow: 4 },
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box display="flex" gap={1} alignItems="center">
                    <Bell
                      size={20}
                      color={item.isRead ? "#9e9e9e" : "#1976d2"}
                    />
                    <Typography fontWeight={600}>{item.title}</Typography>
                  </Box>

                  {/* {!item.isRead && (
                                        <Chip label="New" size="small" color="primary" />
                                    )} */}
                </Box>

                <Typography mt={1} color="text.secondary" fontSize="12px">
                  {item.message}
                </Typography>

                <Typography mt={1} variant="caption" color="text.secondary">
                  {moment(item.createdAt).format("DD-MM-YYYY")}
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography color="text.secondary" textAlign="center">
            No notifications found
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default NotificationsPage;
