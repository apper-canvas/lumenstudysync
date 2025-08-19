import coursesData from "@/services/mockData/courses.json";

class CourseService {
  constructor() {
    this.courses = [...coursesData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.courses];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const course = this.courses.find(item => item.Id === parseInt(id));
    if (!course) {
      throw new Error("Course not found");
    }
    return { ...course };
  }

  async create(courseData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newId = Math.max(...this.courses.map(c => c.Id), 0) + 1;
    const newCourse = {
      Id: newId,
      ...courseData,
      schedule: courseData.schedule || []
    };
    
    this.courses.push(newCourse);
    return { ...newCourse };
  }

  async update(id, courseData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const index = this.courses.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Course not found");
    }
    
    this.courses[index] = { ...this.courses[index], ...courseData, Id: parseInt(id) };
    return { ...this.courses[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = this.courses.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Course not found");
    }
    
    this.courses.splice(index, 1);
    return true;
  }
}

export const courseService = new CourseService();