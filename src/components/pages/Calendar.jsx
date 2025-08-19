import React, { useState, useEffect } from "react";
import CalendarView from "@/components/organisms/CalendarView";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";

const Calendar = ({ onQuickAdd }) => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      console.error("Error loading calendar data:", err);
      setError("Failed to load calendar data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date) => {
    console.log("Selected date:", date);
    // TODO: Show assignments for selected date
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600">View your academic schedule</p>
        </div>
        
        <Button
          variant="primary"
          onClick={onQuickAdd}
          icon="Plus"
        >
          Quick Add
        </Button>
      </div>

      {/* Calendar */}
      {assignments.length === 0 && courses.length === 0 ? (
        <Empty
          type="calendar"
          action={onQuickAdd}
          actionLabel="Add Your First Assignment"
        />
      ) : (
        <CalendarView
          assignments={assignments}
          courses={courses}
          onDateSelect={handleDateSelect}
        />
      )}
    </div>
  );
};

export default Calendar;