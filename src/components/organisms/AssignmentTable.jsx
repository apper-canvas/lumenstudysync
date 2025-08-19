import React, { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import PriorityIndicator from "@/components/molecules/PriorityIndicator";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const AssignmentTable = ({ 
  assignments = [], 
  courses = [], 
  onStatusChange, 
  onEdit, 
  onDelete,
  className 
}) => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("dueDate");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCourse, setFilterCourse] = useState("all");

  // Get course by ID
  const getCourseById = (courseId) => {
    return courses.find(course => course.Id.toString() === courseId.toString());
  };

  // Filter and sort assignments
  const filteredAssignments = assignments
    .filter((assignment) => {
      const matchesSearch = assignment.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === "all" || assignment.status === filterStatus;
      const matchesCourse = filterCourse === "all" || assignment.courseId.toString() === filterCourse;
      return matchesSearch && matchesStatus && matchesCourse;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "dueDate":
          aValue = new Date(a.dueDate);
          bValue = new Date(b.dueDate);
          break;
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority] || 1;
          bValue = priorityOrder[b.priority] || 1;
          break;
        case "course":
          const aCourse = getCourseById(a.courseId);
          const bCourse = getCourseById(b.courseId);
          aValue = aCourse?.name?.toLowerCase() || "";
          bValue = bCourse?.name?.toLowerCase() || "";
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "not-started", label: "Not Started" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  const courseOptions = [
    { value: "all", label: "All Courses" },
    ...courses.map(course => ({
      value: course.Id.toString(),
      label: `${course.code} - ${course.name}`,
    })),
  ];

  const statusConfig = {
    "not-started": { label: "Not Started", variant: "default" },
    "in-progress": { label: "In Progress", variant: "warning" },
    "completed": { label: "Completed", variant: "success" },
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search assignments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              >
                {courseOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6">
                    <button
                      onClick={() => handleSort("title")}
                      className="flex items-center space-x-1 font-medium text-gray-700 hover:text-gray-900"
                    >
                      <span>Assignment</span>
                      <ApperIcon 
                        name={sortBy === "title" && sortOrder === "desc" ? "ChevronDown" : "ChevronUp"} 
                        size={14} 
                      />
                    </button>
                  </th>
                  <th className="text-left py-4 px-6">
                    <button
                      onClick={() => handleSort("course")}
                      className="flex items-center space-x-1 font-medium text-gray-700 hover:text-gray-900"
                    >
                      <span>Course</span>
                      <ApperIcon 
                        name={sortBy === "course" && sortOrder === "desc" ? "ChevronDown" : "ChevronUp"} 
                        size={14} 
                      />
                    </button>
                  </th>
                  <th className="text-left py-4 px-6">
                    <button
                      onClick={() => handleSort("dueDate")}
                      className="flex items-center space-x-1 font-medium text-gray-700 hover:text-gray-900"
                    >
                      <span>Due Date</span>
                      <ApperIcon 
                        name={sortBy === "dueDate" && sortOrder === "desc" ? "ChevronDown" : "ChevronUp"} 
                        size={14} 
                      />
                    </button>
                  </th>
                  <th className="text-left py-4 px-6">
                    <button
                      onClick={() => handleSort("priority")}
                      className="flex items-center space-x-1 font-medium text-gray-700 hover:text-gray-900"
                    >
                      <span>Priority</span>
                      <ApperIcon 
                        name={sortBy === "priority" && sortOrder === "desc" ? "ChevronDown" : "ChevronUp"} 
                        size={14} 
                      />
                    </button>
                  </th>
                  <th className="text-left py-4 px-6">Status</th>
                  <th className="text-right py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.map((assignment) => {
                  const course = getCourseById(assignment.courseId);
                  const status = statusConfig[assignment.status] || statusConfig["not-started"];
                  
                  return (
                    <tr key={assignment.Id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <PriorityIndicator priority={assignment.priority} />
                            <span className="font-medium text-gray-900">{assignment.title}</span>
                          </div>
                          {assignment.description && (
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {assignment.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: course?.color || "#6B7280" }}
                          />
                          <span className="text-sm text-gray-700">
                            {course?.code || "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-700">
                          {format(new Date(assignment.dueDate), "MMM dd, yyyy")}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant={assignment.priority} size="sm">
                          {assignment.priority}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant={status.variant} size="sm">
                          {status.label}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end space-x-2">
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
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredAssignments.length === 0 && (
            <div className="text-center py-12">
              <ApperIcon name="FileText" size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No assignments found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AssignmentTable;