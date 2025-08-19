import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import QuickAddModal from "@/components/organisms/QuickAddModal";
import Dashboard from "@/components/pages/Dashboard";
import Courses from "@/components/pages/Courses";
import Assignments from "@/components/pages/Assignments";
import Calendar from "@/components/pages/Calendar";
import Grades from "@/components/pages/Grades";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import { toast } from "react-toastify";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [courses, setCourses] = useState([]);

  // Load courses for quick add modal
  React.useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const coursesData = await courseService.getAll();
      setCourses(coursesData);
    } catch (err) {
      console.error("Error loading courses:", err);
    }
  };

  const handleQuickAdd = async (formData) => {
    try {
      await assignmentService.create(formData);
      toast.success("Assignment added successfully!");
      // Refresh courses in case new course was referenced
      loadCourses();
    } catch (err) {
      console.error("Error adding assignment:", err);
      toast.error("Failed to add assignment");
    }
  };

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <Header onMenuClick={() => setSidebarOpen(true)} />

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 py-6 lg:px-8">
              <Routes>
                <Route 
                  path="/" 
                  element={<Dashboard onQuickAdd={() => setQuickAddOpen(true)} />} 
                />
                <Route path="/courses" element={<Courses />} />
                <Route 
                  path="/assignments" 
                  element={<Assignments onQuickAdd={() => setQuickAddOpen(true)} />} 
                />
                <Route 
                  path="/calendar" 
                  element={<Calendar onQuickAdd={() => setQuickAddOpen(true)} />} 
                />
                <Route path="/grades" element={<Grades />} />
              </Routes>
            </div>
          </main>
        </div>

        {/* Quick Add Modal */}
        <QuickAddModal
          isOpen={quickAddOpen}
          onClose={() => setQuickAddOpen(false)}
          courses={courses}
          onSubmit={handleQuickAdd}
        />

        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;