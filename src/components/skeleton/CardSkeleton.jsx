import React from "react";
import { Card, Box, Skeleton } from "@mui/material";

const TallyCardSkeleton = () => {
  return (
    <Card
      sx={{
        p: 2,
        borderRadius: 2,
        transition: "all 0.3s ease-in-out",
        boxShadow: "none",
      }}
    >
      {/* Icon skeleton */}
      <Skeleton
        variant="circular"
        width={42}
        height={42}
        animation="wave"
        sx={{ mb: 2 }}
      />

      {/* Count skeleton */}
      <Skeleton
        variant="text"
        width="55%"
        height={32}
        animation="wave"
        sx={{ mb: 1 }}
      />

      {/* Label skeleton */}
      <Skeleton variant="text" width="75%" height={22} animation="wave" />
    </Card>
  );
};

export default TallyCardSkeleton;
