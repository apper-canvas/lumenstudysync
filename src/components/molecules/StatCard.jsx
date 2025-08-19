import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = "primary",
  className 
}) => {
  const colorClasses = {
    primary: "text-primary-600 bg-primary-50",
    secondary: "text-secondary-600 bg-secondary-50",
    accent: "text-accent-600 bg-accent-50",
    success: "text-emerald-600 bg-emerald-50",
    warning: "text-amber-600 bg-amber-50",
    danger: "text-red-600 bg-red-50",
  };

  const trendClasses = {
    up: "text-emerald-600",
    down: "text-red-600",
    neutral: "text-gray-600",
  };

  return (
    <Card hover className={cn("p-6", className)}>
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {trend && trendValue && (
              <div className={cn("flex items-center text-sm", trendClasses[trend])}>
                <ApperIcon 
                  name={trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus"} 
                  size={16} 
                  className="mr-1" 
                />
                {trendValue}
              </div>
            )}
          </div>
          <div className={cn("p-3 rounded-xl", colorClasses[color])}>
            <ApperIcon name={icon} size={24} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;