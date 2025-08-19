import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, isToday, isTomorrow, addDays, isBefore } from "date-fns";
import StatCard from "@/components/molecules/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ProgressRing from "@/components/molecules/ProgressRing";
import PriorityIndicator from "@/components/molecules/PriorityIndicator";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import StudyTimerWidget from "@/components/organisms/StudyTimerWidget";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import { toast } from "react-toastify";

const Dashboard = ({ onQuickAdd }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [coursesData, assignmentsData] = await Promise.all([
        courseService.getAll(),
        assignmentService.getAll(),
      ]);
      
      setCourses(coursesData);
      setAssignments(assignmentsData);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
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

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  // Calculate statistics
const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.status === "completed").length;
  const pendingAssignments = assignments.filter(a => a.status !== "completed").length;
  const overdueAssignments = assignments.filter(a => 
    isBefore(new Date(a.dueDate), new Date()) && a.status !== "completed"
  ).length;

  // Today's assignments
  const todayAssignments = assignments.filter(a => 
    isToday(new Date(a.dueDate)) && a.status !== "completed"
  );

  // Upcoming assignments (next 7 days)
  const upcomingAssignments = assignments.filter(a => {
    const dueDate = new Date(a.dueDate);
    const now = new Date();
    const sevenDaysFromNow = addDays(now, 7);
    return dueDate >= now && dueDate <= sevenDaysFromNow && a.status !== "completed";
  }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  // Recent grades
  const recentGrades = assignments
    .filter(a => a.grade !== null && a.grade !== undefined)
    .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
    .slice(0, 5);

  // Progress calculation
  const completionRate = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;

  // Get course by ID
  const getCourseById = (courseId) => {
    return courses.find(course => course.Id.toString() === courseId.toString());
  };

  const getNextStatus = (currentStatus) => {
    if (currentStatus === "not-started") return "in-progress";
    if (currentStatus === "in-progress") return "completed";
    return "not-started";
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-600">Here's what's happening with your studies today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Courses"
          value={courses.length}
          icon="BookOpen"
          color="primary"
        />
        <StatCard
          title="Total Assignments"
          value={totalAssignments}
          icon="FileText"
          color="secondary"
        />
        <StatCard
          title="Completed"
          value={completedAssignments}
          icon="CheckCircle2"
          color="success"
          trend={completedAssignments > 0 ? "up" : "neutral"}
          trendValue={`${completionRate}% completion rate`}
        />
        <StatCard
          title="Overdue"
          value={overdueAssignments}
          icon="AlertTriangle"
          color={overdueAssignments > 0 ? "danger" : "success"}
          trend={overdueAssignments > 0 ? "down" : "neutral"}
          trendValue={overdueAssignments > 0 ? "Action needed" : "All caught up!"}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Assignments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <ApperIcon name="Calendar" size={20} className="mr-2" />
                  Today's Assignments
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/assignments")}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {todayAssignments.length === 0 ? (
                <div className="text-center py-6">
                  <ApperIcon name="CheckCircle2" size={48} className="text-green-400 mx-auto mb-3" />
                  <p className="text-gray-500">No assignments due today! 🎉</p>
                </div>
              ) : (
                <div className="space-y-3">
{todayAssignments.slice(0, 3).map((assignment) => {
                    const course = getCourseById(assignment.courseId);
                    return (
                      <div
                        key={assignment.Id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <PriorityIndicator priority={assignment.priority} />
                          <div>
                            <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                            <p className="text-sm text-gray-600 flex items-center">
                              <span
                                className="w-2 h-2 rounded-full mr-2"
                                style={{ backgroundColor: course?.color || "#6B7280" }}
                              />
                              {course?.name || "Unknown Course"}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleStatusChange(assignment, getNextStatus(assignment.status))}
                        >
                          {assignment.status === "completed" ? "Reset" : "Mark " + getNextStatus(assignment.status).replace("-", " ")}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Assignments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ApperIcon name="Clock" size={20} className="mr-2" />
                Upcoming This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingAssignments.length === 0 ? (
                <div className="text-center py-6">
                  <ApperIcon name="Calendar" size={48} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No upcoming assignments this week</p>
                </div>
              ) : (
                <div className="space-y-3">
{upcomingAssignments.slice(0, 5).map((assignment) => {
                    const course = getCourseById(assignment.courseId);
                    const dueDate = new Date(assignment.dueDate);
                    const isUpcoming = isTomorrow(dueDate);
                    
                    return (
                      <div
                        key={assignment.Id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <PriorityIndicator priority={assignment.priority} />
                          <div>
                            <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                            <div className="flex items-center space-x-3 text-sm text-gray-600">
                              <span className="flex items-center">
                                <span
                                  className="w-2 h-2 rounded-full mr-1"
                                  style={{ backgroundColor: course?.color || "#6B7280" }}
                                />
                                {course?.code || "Unknown"}
                              </span>
                              <span className="flex items-center">
                                <ApperIcon name="Calendar" size={12} className="mr-1" />
                                {format(dueDate, "MMM dd")}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isUpcoming && (
                            <Badge variant="warning" size="sm">Tomorrow</Badge>
                          )}
                          <Badge variant={assignment.priority} size="sm">
                            {assignment.priority}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ApperIcon name="TrendingUp" size={20} className="mr-2" />
                Progress Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <ProgressRing
                  progress={completionRate}
                  size={120}
                  strokeWidth={8}
                  color="primary"
                  className="mx-auto"
                />
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-gray-900">
                    {completedAssignments} of {totalAssignments} completed
                  </p>
                  <p className="text-sm text-gray-600">
                    Keep up the great work! 💪
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

{/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="primary"
                className="w-full"
                onClick={onQuickAdd}
                icon="Plus"
              >
                Add Assignment
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => navigate("/courses")}
                icon="BookOpen"
              >
                Manage Courses
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => navigate("/calendar")}
                icon="Calendar"
              >
                View Calendar
              </Button>
            </CardContent>
          </Card>

          {/* Study Timer */}
          <StudyTimerWidget />

          {/* Recent Grades */}
          {recentGrades.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <ApperIcon name="Award" size={20} className="mr-2" />
                    Recent Grades
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/grades")}
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
{recentGrades.map((assignment) => {
                    const course = getCourseById(assignment.courseId);
                    const gradeColor = assignment.grade >= 90 ? "success" :
                                    assignment.grade >= 80 ? "primary" : 
                                    assignment.grade >= 70 ? "warning" : "danger";
                    
                    return (
                      <div key={assignment.Id} className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {assignment.title}
                          </p>
                          <p className="text-xs text-gray-600">{course?.code}</p>
                        </div>
                        <Badge variant={gradeColor} size="sm">
                          {assignment.grade}%
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;