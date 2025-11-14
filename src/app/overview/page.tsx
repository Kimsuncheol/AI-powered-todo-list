import { Box, Typography } from "@mui/material";

export default function OverviewPage() {
  return (
    <Box sx={{ py: 6, px: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Progress Overview
      </Typography>
      <Typography color="text.secondary">
        This is a placeholder page. Later we will show charts and stats for completed and upcoming tasks.
      </Typography>
    </Box>
  );
}
