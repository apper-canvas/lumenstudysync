import assignmentsData from "@/services/mockData/assignments.json";

class AssignmentService {
  constructor() {
    this.assignments = [...assignmentsData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.assignments];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const assignment = this.assignments.find(item => item.Id === parseInt(id));
    if (!assignment) {
      throw new Error("Assignment not found");
    }
    return { ...assignment };
  }

  async getByCourseId(courseId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.assignments.filter(item => item.courseId === parseInt(courseId)).map(item => ({ ...item }));
  }

  async create(assignmentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newId = Math.max(...this.assignments.map(a => a.Id), 0) + 1;
    const newAssignment = {
      Id: newId,
      ...assignmentData,
      courseId: parseInt(assignmentData.courseId),
      status: assignmentData.status || "not-started",
      grade: assignmentData.grade || null,
      weight: assignmentData.weight || 10
    };
    
    this.assignments.push(newAssignment);
    return { ...newAssignment };
  }

  async update(id, assignmentData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const index = this.assignments.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    
    this.assignments[index] = { 
      ...this.assignments[index], 
      ...assignmentData, 
      Id: parseInt(id),
      courseId: parseInt(assignmentData.courseId || this.assignments[index].courseId)
    };
    return { ...this.assignments[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = this.assignments.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    
    this.assignments.splice(index, 1);
    return true;
  }

  async updateStatus(id, status) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = this.assignments.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Assignment not found");
    }
    
    this.assignments[index].status = status;
    return { ...this.assignments[index] };
  }
}

export const assignmentService = new AssignmentService();