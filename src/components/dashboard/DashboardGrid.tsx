"use client";

import { Box } from "@mui/material";
import TodayIcon from "@mui/icons-material/Today";
import EventIcon from "@mui/icons-material/Event";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import InsightsIcon from "@mui/icons-material/Insights";
import DashboardCard from "./DashboardCard";
import { MotivationCard } from "@/components/motivation/MotivationCard";

const cards = [
  {
    title: "Tasks for Today",
    description: "Focus on the work that needs to be finished before the day ends.",
    href: "/tasks?view=today",
    icon: <TodayIcon fontSize="large" />,
  },
  {
    title: "Upcoming Tasks",
    description: "Scan ahead and plan for what's coming in the next few days.",
    href: "/tasks?view=upcoming",
    icon: <EventIcon fontSize="large" />,
  },
  {
    title: "Quick Actions",
    description: "Capture new tasks, ideas, or reminders in seconds.",
    href: "/tasks/new",
    icon: <AddCircleOutlineIcon fontSize="large" />,
  },
  {
    title: "Progress Overview",
    description: "See how you are trending across completed work and goals.",
    href: "/overview",
    icon: <InsightsIcon fontSize="large" />,
  },
  {
    title: "Recommended Tasks",
    description: "See personalized task suggestions based on your priorities, deadlines, and recent activity to help you focus on what matters most.",
    href: "/tasks?view=recommended",
    icon: <InsightsIcon fontSize="large" />,
  },
];

export default function DashboardGrid() {
  return (
    <Box
      sx={{
        mt: 3,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 2,
        alignItems: "stretch",
      }}
    >
      {cards.map((card) => (
        <DashboardCard
          key={card.title}
          title={card.title}
          description={card.description}
          href={card.href}
          icon={card.icon}
        />
      ))}
      <MotivationCard />
    </Box>
  );
}
