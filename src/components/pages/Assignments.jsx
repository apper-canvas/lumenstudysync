import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import AssignmentTable from "@/components/organisms/AssignmentTable";
import AssignmentCard from "@/components/organisms/AssignmentCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";
import { toast } from "react-toastify";

const Assignments = ({ onQuickAdd }) => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("table"); // table | cards

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [assignmentsData, coursesData] = await Promise.all([
        assignmentService.getAll(),
        courseService.getAll(),
      ]);
      
      setAssignments(assignmentsData);
      setCourses(coursesData);
    } catch (err) {
      console.error("Error loading assignments:", err);
      setError("Failed to load assignments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

const handleStatusChange = async (assignment, newStatus) => {
    try {
      const updatedAssignment = await assignmentService.update(assignment.Id, { status: newStatus });
      if (updatedAssignment) {
        setAssignments(prev =>
          prev.map(item => (item.Id === assignment.Id ? { ...assignment, status: newStatus } : item))
        );
        
        toast.success(`Assignment marked as ${newStatus.replace("-", " ")}`);
      }
    } catch (err) {
      console.error("Error updating assignment:", err);
      toast.error("Failed to update assignment status");
    }
  };

  const handleEdit = (assignment) => {
    // TODO: Open edit modal
    console.log("Edit assignment:", assignment);
  };

  const handleDelete = async (assignment) => {
    if (!confirm(`Are you sure you want to delete "${assignment.title}"?`)) {
      return;
    }

    try {
      await assignmentService.delete(assignment.Id);
      setAssignments(prev => prev.filter(a => a.Id !== assignment.Id));
      toast.success("Assignment deleted successfully!");
    } catch (err) {
      console.error("Error deleting assignment:", err);
      toast.error("Failed to delete assignment");
    }
  };

  const getCourseById = (courseId) => {
    return courses.find(course => course.Id.toString() === courseId.toString());
  };

  if (loading) return <Loading type={viewMode === "table" ? "table" : "cards"} />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600">Track and manage your coursework</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === "table" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="px-3 py-1.5"
            >
              <ApperIcon name="List" size={16} />
            </Button>
            <Button
              variant={viewMode === "cards" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="px-3 py-1.5"
            >
              <ApperIcon name="Grid3X3" size={16} />
            </Button>
          </div>
          
          <Button
            variant="primary"
            onClick={onQuickAdd}
            icon="Plus"
          >
            Add Assignment
          </Button>
        </div>
      </div>

      {/* Content */}
      {assignments.length === 0 ? (
        <Empty
          type="assignments"
          action={onQuickAdd}
          actionLabel="Add Your First Assignment"
        />
      ) : viewMode === "table" ? (
        <AssignmentTable
          assignments={assignments}
          courses={courses}
          onStatusChange={handleStatusChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{assignments.map((assignment) => {
            const course = getCourseById(assignment.courseId);
            return (
              <AssignmentCard
                key={assignment.Id}
                assignment={assignment}
                course={course}
                onStatusChange={handleStatusChange}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Assignments;