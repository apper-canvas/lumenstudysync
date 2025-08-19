import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import CourseCard from "@/components/organisms/CourseCard";
import FormField from "@/components/molecules/FormField";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { motion, AnimatePresence } from "framer-motion";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import { toast } from "react-toastify";

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    instructor: "",
    color: "#4F46E5",
    room: "",
    credits: 3,
    schedule: [],
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
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
      console.error("Error loading courses:", err);
      setError("Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const errors = {};
    if (!formData.name.trim()) errors.name = "Course name is required";
    if (!formData.code.trim()) errors.code = "Course code is required";
    if (!formData.instructor.trim()) errors.instructor = "Instructor name is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const newCourse = await courseService.create(formData);
      setCourses(prev => [...prev, newCourse]);
      setShowAddForm(false);
      setFormData({
        name: "",
        code: "",
        instructor: "",
        color: "#4F46E5",
        room: "",
        credits: 3,
        schedule: [],
      });
      setFormErrors({});
      toast.success("Course added successfully!");
    } catch (err) {
      console.error("Error creating course:", err);
      toast.error("Failed to add course");
    }
  };

  const handleDelete = async (course) => {
    if (!confirm(`Are you sure you want to delete "${course.name}"?`)) {
      return;
    }

    try {
      await courseService.delete(course.Id);
      setCourses(prev => prev.filter(c => c.Id !== course.Id));
      toast.success("Course deleted successfully!");
    } catch (err) {
      console.error("Error deleting course:", err);
      toast.error("Failed to delete course");
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.name.toLowerCase().includes(search.toLowerCase()) ||
                         course.code.toLowerCase().includes(search.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const courseColors = [
    "#4F46E5", "#7C3AED", "#EC4899", "#EF4444", "#F59E0B", 
    "#10B981", "#06B6D4", "#8B5CF6", "#F97316", "#84CC16"
  ];

  if (loading) return <Loading type="skeleton" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600">Manage your academic courses</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowAddForm(true)}
          icon="Plus"
        >
          Add Course
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="all">All Semesters</option>
              <option value="current">Current Semester</option>
              <option value="previous">Previous Semesters</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <Empty
          type="courses"
          action={() => setShowAddForm(true)}
          actionLabel="Add Your First Course"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <motion.div
              key={course.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CourseCard
                course={course}
                assignments={assignments}
                onClick={() => navigate(`/courses/${course.Id}`)}
                className="group"
              />
              <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center space-x-2">
                <Button variant="ghost" size="sm">
                  <ApperIcon name="Edit" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(course)}
                  className="text-red-600 hover:text-red-700"
                >
                  <ApperIcon name="Trash2" size={16} />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Course Modal */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={() => setShowAddForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
            >
              <Card className="shadow-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-gray-900">
                      Add New Course
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAddForm(false)}
                      className="p-2"
                    >
                      <ApperIcon name="X" size={20} />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Course Name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Introduction to Psychology"
                        error={formErrors.name}
                        required
                      />

                      <FormField
                        label="Course Code"
                        value={formData.code}
                        onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                        placeholder="e.g., PSY101"
                        error={formErrors.code}
                        required
                      />
                    </div>

                    <FormField
                      label="Instructor"
                      value={formData.instructor}
                      onChange={(e) => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
                      placeholder="e.g., Dr. Jane Smith"
                      error={formErrors.instructor}
                      required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Room"
                        value={formData.room}
                        onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
                        placeholder="e.g., Building A, Room 101"
                      />

                      <FormField
                        label="Credits"
                        type="number"
                        value={formData.credits}
                        onChange={(e) => setFormData(prev => ({ ...prev, credits: parseInt(e.target.value) || 0 }))}
                        min="1"
                        max="6"
                      />
                    </div>

                    {/* Color Picker */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 block">
                        Course Color
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {courseColors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, color }))}
                            className={`w-8 h-8 rounded-full border-2 transition-all ${
                              formData.color === color ? "border-gray-400 scale-110" : "border-transparent"
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setShowAddForm(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        className="flex-1"
                      >
                        Add Course
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Courses;