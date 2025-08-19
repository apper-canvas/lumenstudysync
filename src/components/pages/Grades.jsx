import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import StatCard from "@/components/molecules/StatCard";
import ProgressRing from "@/components/molecules/ProgressRing";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";

const Grades = () => {
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
      console.error("Error loading grades:", err);
      setError("Failed to load grades. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getCourseById = (courseId) => {
    return courses.find(course => course.Id.toString() === courseId.toString());
  };

  // Calculate grade statistics
  const gradedAssignments = assignments.filter(a => 
    a.grade !== null && a.grade !== undefined && a.grade !== ""
  );

  const calculateCourseGrades = () => {
    return courses.map(course => {
      const courseAssignments = gradedAssignments.filter(a => 
        a.courseId.toString() === course.Id.toString()
      );
      
      if (courseAssignments.length === 0) {
        return { ...course, average: null, assignments: [] };
      }

      const totalPoints = courseAssignments.reduce((sum, a) => sum + parseFloat(a.grade), 0);
      const average = totalPoints / courseAssignments.length;
      
      return { 
        ...course, 
        average: Math.round(average * 10) / 10,
        assignments: courseAssignments 
      };
    });
  };

  const courseGrades = calculateCourseGrades();
  const overallAverage = gradedAssignments.length > 0 
    ? Math.round((gradedAssignments.reduce((sum, a) => sum + parseFloat(a.grade), 0) / gradedAssignments.length) * 10) / 10
    : 0;

  // Calculate GPA (assuming 4.0 scale)
  const calculateGPA = () => {
    const coursesWithGrades = courseGrades.filter(c => c.average !== null);
    if (coursesWithGrades.length === 0) return 0;
    
    const gradePoints = coursesWithGrades.map(course => {
      const grade = course.average;
      if (grade >= 97) return 4.0;
      if (grade >= 93) return 3.7;
      if (grade >= 90) return 3.3;
      if (grade >= 87) return 3.0;
      if (grade >= 83) return 2.7;
      if (grade >= 80) return 2.3;
      if (grade >= 77) return 2.0;
      if (grade >= 73) return 1.7;
      if (grade >= 70) return 1.3;
      if (grade >= 67) return 1.0;
      if (grade >= 65) return 0.7;
      return 0.0;
    });

    const totalCredits = coursesWithGrades.reduce((sum, course) => sum + (course.credits || 3), 0);
    const weightedPoints = coursesWithGrades.reduce((sum, course, index) => 
      sum + (gradePoints[index] * (course.credits || 3)), 0
    );

    return Math.round((weightedPoints / totalCredits) * 100) / 100;
  };

  const gpa = calculateGPA();

  const getGradeColor = (grade) => {
    if (grade >= 90) return "success";
    if (grade >= 80) return "primary";
    if (grade >= 70) return "warning";
    return "danger";
  };

  const getLetterGrade = (grade) => {
    if (grade >= 97) return "A+";
    if (grade >= 93) return "A";
    if (grade >= 90) return "A-";
    if (grade >= 87) return "B+";
    if (grade >= 83) return "B";
    if (grade >= 80) return "B-";
    if (grade >= 77) return "C+";
    if (grade >= 73) return "C";
    if (grade >= 70) return "C-";
    if (grade >= 67) return "D+";
    if (grade >= 65) return "D";
    return "F";
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Grades</h1>
        <p className="text-gray-600">Track your academic performance</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Overall Average"
          value={`${overallAverage}%`}
          icon="TrendingUp"
          color={getGradeColor(overallAverage)}
        />
        <StatCard
          title="Current GPA"
          value={gpa.toFixed(2)}
          icon="Award"
          color="primary"
        />
        <StatCard
          title="Graded Assignments"
          value={gradedAssignments.length}
          icon="FileCheck"
          color="secondary"
        />
        <StatCard
          title="Letter Grade"
          value={getLetterGrade(overallAverage)}
          icon="Star"
          color={getGradeColor(overallAverage)}
        />
      </div>

      {/* Content */}
      {gradedAssignments.length === 0 ? (
        <Empty
          type="grades"
          title="No grades recorded yet"
          description="Start completing assignments to see your grades here"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Grades */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Course Performance</h2>
            
            <div className="space-y-4">
              {courseGrades.filter(course => course.average !== null).map((course) => (
                <Card key={course.Id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: course.color }}
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">{course.name}</h3>
                          <p className="text-sm text-gray-600">{course.code}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {course.average}%
                        </div>
                        <Badge variant={getGradeColor(course.average)}>
                          {getLetterGrade(course.average)}
                        </Badge>
                      </div>
                    </div>

                    {/* Recent Assignments */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Assignments</h4>
                      {course.assignments.slice(-3).map((assignment) => (
                        <div key={assignment.Id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700 truncate">
                            {assignment.title}
                          </span>
                          <Badge variant={getGradeColor(assignment.grade)} size="sm">
                            {assignment.grade}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            {/* GPA Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ApperIcon name="Target" size={20} className="mr-2" />
                  GPA Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <ProgressRing
                  progress={(gpa / 4.0) * 100}
                  size={120}
                  strokeWidth={8}
                  color="primary"
                  className="mx-auto mb-4"
                />
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900">{gpa.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">out of 4.00</p>
                </div>
              </CardContent>
            </Card>

            {/* Grade Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["A", "B", "C", "D", "F"].map((letter) => {
                    const count = gradedAssignments.filter(a => {
                      const letterGrade = getLetterGrade(a.grade);
                      return letterGrade.charAt(0) === letter;
                    }).length;
                    
                    const percentage = gradedAssignments.length > 0 ? 
                      Math.round((count / gradedAssignments.length) * 100) : 0;

                    return (
                      <div key={letter} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{letter}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                letter === "A" ? "bg-green-500" :
                                letter === "B" ? "bg-blue-500" :
                                letter === "C" ? "bg-yellow-500" :
                                letter === "D" ? "bg-orange-500" : "bg-red-500"
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-8">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Grades */}
            <Card>
              <CardHeader>
                <CardTitle>Latest Grades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {gradedAssignments
                    .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
                    .slice(0, 5)
                    .map((assignment) => {
                      const course = getCourseById(assignment.courseId);
                      return (
                        <div key={assignment.Id} className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {assignment.title}
                            </p>
                            <p className="text-xs text-gray-600">{course?.code}</p>
                          </div>
                          <Badge variant={getGradeColor(assignment.grade)} size="sm">
                            {assignment.grade}%
                          </Badge>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Grades;