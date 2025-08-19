import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import Button from "@/components/atoms/Button";
import { Card, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const CalendarView = ({ assignments = [], courses = [], onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month"); // month | week

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get assignments for a specific date
  const getAssignmentsForDate = (date) => {
    return assignments.filter(assignment => 
      isSameDay(new Date(assignment.dueDate), date)
    );
  };

  // Get course by ID
  const getCourseById = (courseId) => {
    return courses.find(course => course.Id.toString() === courseId.toString());
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => 
      direction === "next" ? addMonths(prev, 1) : subMonths(prev, 1)
    );
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth("prev")}
            >
              <ApperIcon name="ChevronLeft" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth("next")}
            >
              <ApperIcon name="ChevronRight" size={16} />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={view === "month" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setView("month")}
          >
            Month
          </Button>
          <Button
            variant={view === "week" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setView("week")}
          >
            Week
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          {/* Days of week header */}
          <div className="grid grid-cols-7 border-b border-gray-200">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="py-4 px-2 text-center text-sm font-medium text-gray-600 border-r border-gray-200 last:border-r-0"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7">
            {daysInMonth.map((day) => {
              const dayAssignments = getAssignmentsForDate(day);
              const isToday = isSameDay(day, new Date());
              const isCurrentMonth = isSameMonth(day, currentDate);

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "min-h-[120px] p-2 border-r border-b border-gray-200 last:border-r-0 cursor-pointer hover:bg-gray-50 transition-colors",
                    !isCurrentMonth && "bg-gray-50 text-gray-400"
                  )}
                  onClick={() => onDateSelect?.(day)}
                >
                  <div className="space-y-2">
                    {/* Date number */}
                    <div className="flex justify-between items-start">
                      <span
                        className={cn(
                          "text-sm font-medium",
                          isToday && "w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs"
                        )}
                      >
                        {format(day, "d")}
                      </span>
                      {dayAssignments.length > 0 && (
                        <Badge variant="accent" size="sm">
                          {dayAssignments.length}
                        </Badge>
                      )}
                    </div>

                    {/* Assignments */}
                    <div className="space-y-1">
{dayAssignments.slice(0, 2).map((assignment) => {
                        const course = getCourseById(assignment.courseId);
                        return (
                          <div
                            key={assignment.Id}
                            className="p-1 rounded text-xs truncate"
                            style={{
                              backgroundColor: course?.color ? `${course.color}20` : "#F3F4F6",
                              color: course?.color || "#6B7280",
                            }}
                          >
                            <div className="flex items-center space-x-1">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: course?.color || "#6B7280" }}
                              />
                              <span className="truncate font-medium">
                                {assignment.title}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      {dayAssignments.length > 2 && (
                        <div className="text-xs text-gray-500 font-medium">
                          +{dayAssignments.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-sm font-medium text-gray-600">Course Colors:</span>
        {courses.slice(0, 6).map((course) => (
          <div key={course.Id} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: course.color }}
            />
            <span className="text-sm text-gray-600">{course.code}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;