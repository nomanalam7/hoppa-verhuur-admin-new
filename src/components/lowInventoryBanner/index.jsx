import { Box, Typography, IconButton } from "@mui/material";
import { useState } from "react";
import closeIcon from "../../assets/icons/close-icon.svg";
import LowInventoryDialog from "../dialog/lowInventoryDialog";

const LowInventoryBanner = ({ notifications }) => {
  console.log(notifications, "notificationswwwwwwwwwwwwwwwwww");
  const [dismissedIds, setDismissedIds] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  console.log(notifications, "notifications");

  if (notifications.length === 0) {
    return null;
  }

  const latestNotification = notifications;

  const fullDescription = latestNotification?.message || "";
  console.log(fullDescription, "fullDescription");
  // Split description by ". " to get all parts
  const descriptionParts = fullDescription.split(". ").filter(part => part.trim().length > 0);
  console.log(descriptionParts, "descriptionParts");
  // Join all parts with line breaks for display
  const description = descriptionParts.join(". ");

  const showViewMore = description.length > 100;

  console.log(description, "description");

  const handleDismiss = (notificationId) => {
    setDismissedIds((prev) => [...prev, notificationId]);
  };

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            backgroundColor: "rgba(255, 0, 4, 0.12)",
            border: "1px solid #FF0004",
            borderRadius: "22px",
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography
            sx={{
              color: "#FF0004",
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: 1.5,
              flex: 1,
              pr: 1,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "pre-line",
            }}
          >
            {description}
          </Typography>

          <IconButton
            onClick={() => handleDismiss(latestNotification._id)}
            sx={{
              width: 24,
              height: 24,
              padding: 0,
            }}
          >
            <img
              src={closeIcon}
              alt="close"
              style={{
                width: 20,
                height: 20,
              }}
            />
          </IconButton>
        </Box>
        {showViewMore && (
          <Box>
            <Typography
              onClick={() => setDialogOpen(true)}
              sx={{
                color: "#FF0004",
                fontSize: "12px",
                fontWeight: 500,
                cursor: "pointer",
                textAlign: "end",
                textDecoration: "underline",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            >
              View More
            </Typography>
          </Box>
        )}
      </Box>

      <LowInventoryDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        description={fullDescription}
      />
    </>
  );
};

export default LowInventoryBanner;
