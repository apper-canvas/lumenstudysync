import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found",
  description = "There's nothing here yet",
  icon = "Inbox",
  action,
  actionLabel = "Get Started",
  onAction,
  className,
  type = "default"
}) => {
  if (type === "inline") {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <div className="text-center space-y-4">
          <ApperIcon name={icon} size={48} className="text-gray-300 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-600">{title}</h3>
            <p className="text-gray-500">{description}</p>
          </div>
          {action && onAction && (
            <Button variant="primary" onClick={onAction}>
              <ApperIcon name="Plus" size={16} className="mr-2" />
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    );
  }

  const emptyStates = {
    courses: {
      icon: "BookOpen",
      title: "No courses yet",
      description: "Add your first course to start organizing your academic life",
      actionLabel: "Add Course",
    },
    assignments: {
      icon: "FileText",
      title: "No assignments yet", 
      description: "Create your first assignment to start tracking your work",
      actionLabel: "Add Assignment",
    },
    calendar: {
      icon: "Calendar",
      title: "Your calendar is empty",
      description: "Add assignments and courses to see them on your calendar",
      actionLabel: "Quick Add",
    },
    grades: {
      icon: "Award",
      title: "No grades recorded",
      description: "Start adding grades to track your academic progress",
      actionLabel: "Add Grade",
    },
  };

  const config = emptyStates[type] || { icon, title, description, actionLabel };

  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <Card className="max-w-md w-full mx-4">
        <CardContent className="text-center py-12">
          <div className="space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-50 to-accent-50 rounded-full flex items-center justify-center mx-auto">
              <ApperIcon name={config.icon} size={40} className="text-primary-400" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">{config.title}</h3>
              <p className="text-gray-600 max-w-sm mx-auto">{config.description}</p>
            </div>

            {(action || onAction) && (
              <div className="space-y-3">
                <Button 
                  variant="primary" 
                  onClick={onAction || action} 
                  className="bg-gradient-primary hover:shadow-glow"
                >
                  <ApperIcon name="Plus" size={16} className="mr-2" />
                  {config.actionLabel}
                </Button>
                <p className="text-sm text-gray-500">
                  Get started by adding your academic information
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Empty;