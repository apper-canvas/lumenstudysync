import React from "react";
import { cn } from "@/utils/cn";

const PriorityIndicator = ({ priority, className }) => {
  const priorityConfig = {
    high: {
      color: "bg-red-500",
      label: "High Priority",
    },
    medium: {
      color: "bg-amber-500",
      label: "Medium Priority",
    },
    low: {
      color: "bg-green-500",
      label: "Low Priority",
    },
  };

  const config = priorityConfig[priority] || priorityConfig.low;

  return (
    <div 
      className={cn("w-3 h-3 rounded-full", config.color, className)}
      title={config.label}
    />
  );
};

export default PriorityIndicator;