import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import { format } from "date-fns";

const CourseCard = ({ course, assignments = [], onClick, className }) => {
  const pendingAssignments = assignments.filter(
    (assignment) => assignment.courseId === course.Id && assignment.status !== "completed"
  ).length;

  const nextClass = course.schedule && course.schedule.length > 0 ? course.schedule[0] : null;

  return (
    <Card 
      hover 
      onClick={onClick}
      className={cn("cursor-pointer overflow-hidden", className)}
    >
      {/* Color indicator */}
      <div 
        className="h-2 w-full"
        style={{ backgroundColor: course.color }}
      />
      
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Course header */}
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                  {course.name}
                </h3>
                <p className="text-sm text-gray-600">{course.code}</p>
              </div>
              <div className="flex items-center space-x-2">
                {pendingAssignments > 0 && (
                  <Badge variant="warning" size="sm">
                    {pendingAssignments} due
                  </Badge>
                )}
              </div>
            </div>
            
            {course.instructor && (
              <p className="text-sm text-gray-600 flex items-center">
                <ApperIcon name="User" size={14} className="mr-1" />
                {course.instructor}
              </p>
            )}
          </div>

          {/* Course info */}
          <div className="space-y-2">
            {course.room && (
              <div className="flex items-center text-sm text-gray-600">
                <ApperIcon name="MapPin" size={14} className="mr-2" />
                <span>{course.room}</span>
              </div>
            )}
            
            {nextClass && (
              <div className="flex items-center text-sm text-gray-600">
                <ApperIcon name="Clock" size={14} className="mr-2" />
                <span>
                  {nextClass.day} at {nextClass.time}
                </span>
              </div>
            )}
            
            {course.credits && (
              <div className="flex items-center text-sm text-gray-600">
                <ApperIcon name="BookOpen" size={14} className="mr-2" />
                <span>{course.credits} credits</span>
              </div>
            )}
          </div>

          {/* Progress section */}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">This Semester</span>
              <span className="font-medium text-gray-900">Active</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;