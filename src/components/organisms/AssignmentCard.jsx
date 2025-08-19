import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import PriorityIndicator from "@/components/molecules/PriorityIndicator";
import { cn } from "@/utils/cn";
import { format, isAfter, isBefore, addDays } from "date-fns";

const AssignmentCard = ({ 
  assignment, 
  course, 
  onStatusChange, 
  onEdit, 
  onDelete, 
  className 
}) => {
  const dueDate = new Date(assignment.dueDate);
  const now = new Date();
  const isOverdue = isBefore(dueDate, now) && assignment.status !== "completed";
  const isDueSoon = isAfter(dueDate, now) && isBefore(dueDate, addDays(now, 3));

  const statusConfig = {
    "not-started": { label: "Not Started", variant: "default", icon: "Circle" },
    "in-progress": { label: "In Progress", variant: "warning", icon: "Clock" },
    "completed": { label: "Completed", variant: "success", icon: "CheckCircle2" },
  };

  const currentStatus = statusConfig[assignment.status] || statusConfig["not-started"];

  const getNextStatus = () => {
    if (assignment.status === "not-started") return "in-progress";
    if (assignment.status === "in-progress") return "completed";
    return "not-started";
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      {/* Course color indicator */}
      <div 
        className="h-1 w-full"
        style={{ backgroundColor: course?.color || "#6B7280" }}
      />
      
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Assignment header */}
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center space-x-2">
                <PriorityIndicator priority={assignment.priority} />
                <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                  {assignment.title}
                </h3>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <ApperIcon name="BookOpen" size={14} className="mr-1" />
                  {course?.name || "Unknown Course"}
                </span>
                <span className="flex items-center">
                  <ApperIcon name="Calendar" size={14} className="mr-1" />
                  {format(dueDate, "MMM dd, yyyy")}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge 
                variant={currentStatus.variant}
                size="sm"
                className="flex items-center"
              >
                <ApperIcon name={currentStatus.icon} size={12} className="mr-1" />
                {currentStatus.label}
              </Badge>
            </div>
          </div>

          {/* Description */}
          {assignment.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {assignment.description}
            </p>
          )}

          {/* Due date warning */}
          {isOverdue && (
            <div className="flex items-center px-3 py-2 bg-red-50 rounded-lg">
              <ApperIcon name="AlertTriangle" size={16} className="text-red-600 mr-2" />
              <span className="text-sm text-red-800 font-medium">Overdue</span>
            </div>
          )}
          
          {isDueSoon && assignment.status !== "completed" && (
            <div className="flex items-center px-3 py-2 bg-amber-50 rounded-lg">
              <ApperIcon name="Clock" size={16} className="text-amber-600 mr-2" />
              <span className="text-sm text-amber-800 font-medium">Due soon</span>
            </div>
          )}

          {/* Grade */}
          {assignment.grade !== null && assignment.grade !== undefined && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Grade</span>
              <span className="text-lg font-bold text-gray-900">{assignment.grade}%</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit?.(assignment)}
              >
                <ApperIcon name="Edit" size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete?.(assignment)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <ApperIcon name="Trash2" size={16} />
              </Button>
            </div>

            <Button
              variant={assignment.status === "completed" ? "success" : "primary"}
              size="sm"
              onClick={() => onStatusChange?.(assignment, getNextStatus())}
            >
              {assignment.status === "completed" ? "Reset" : "Mark " + getNextStatus().replace("-", " ")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssignmentCard;