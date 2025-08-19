import { toast } from "react-toastify";

class AssignmentService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'assignment_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "weight_c" } }
        ],
        orderBy: [
          {
            fieldName: "due_date_c",
            sorttype: "ASC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform database fields to UI format
      return response.data.map(assignment => ({
        Id: assignment.Id,
        title: assignment.title_c,
        courseId: assignment.course_id_c?.Id || assignment.course_id_c,
        dueDate: assignment.due_date_c,
        priority: assignment.priority_c,
        status: assignment.status_c,
        description: assignment.description_c,
        grade: assignment.grade_c,
        weight: assignment.weight_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignments:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "weight_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response || !response.data) {
        return null;
      }

      const assignment = response.data;
      return {
        Id: assignment.Id,
        title: assignment.title_c,
        courseId: assignment.course_id_c?.Id || assignment.course_id_c,
        dueDate: assignment.due_date_c,
        priority: assignment.priority_c,
        status: assignment.status_c,
        description: assignment.description_c,
        grade: assignment.grade_c,
        weight: assignment.weight_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching assignment with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async getByCourseId(courseId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "course_id_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "grade_c" } },
          { field: { Name: "weight_c" } }
        ],
        where: [
          {
            FieldName: "course_id_c",
            Operator: "EqualTo",
            Values: [parseInt(courseId)]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(assignment => ({
        Id: assignment.Id,
        title: assignment.title_c,
        courseId: assignment.course_id_c?.Id || assignment.course_id_c,
        dueDate: assignment.due_date_c,
        priority: assignment.priority_c,
        status: assignment.status_c,
        description: assignment.description_c,
        grade: assignment.grade_c,
        weight: assignment.weight_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching assignments by course ID:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async create(assignmentData) {
    try {
      const params = {
        records: [
          {
            title_c: assignmentData.title,
            course_id_c: parseInt(assignmentData.courseId),
            due_date_c: assignmentData.dueDate,
            priority_c: assignmentData.priority || "medium",
            status_c: assignmentData.status || "not-started",
            description_c: assignmentData.description || "",
            grade_c: assignmentData.grade || null,
            weight_c: parseInt(assignmentData.weight) || 10
          }
        ]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} assignments:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const newAssignment = successfulRecords[0].data;
          return {
            Id: newAssignment.Id,
            title: newAssignment.title_c,
            courseId: newAssignment.course_id_c?.Id || newAssignment.course_id_c,
            dueDate: newAssignment.due_date_c,
            priority: newAssignment.priority_c,
            status: newAssignment.status_c,
            description: newAssignment.description_c,
            grade: newAssignment.grade_c,
            weight: newAssignment.weight_c
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating assignment:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async update(id, assignmentData) {
    try {
      const updateData = {
        Id: parseInt(id)
      };

      // Only include fields that are being updated
      if (assignmentData.title !== undefined) updateData.title_c = assignmentData.title;
      if (assignmentData.courseId !== undefined) updateData.course_id_c = parseInt(assignmentData.courseId);
      if (assignmentData.dueDate !== undefined) updateData.due_date_c = assignmentData.dueDate;
      if (assignmentData.priority !== undefined) updateData.priority_c = assignmentData.priority;
      if (assignmentData.status !== undefined) updateData.status_c = assignmentData.status;
      if (assignmentData.description !== undefined) updateData.description_c = assignmentData.description;
      if (assignmentData.grade !== undefined) updateData.grade_c = assignmentData.grade;
      if (assignmentData.weight !== undefined) updateData.weight_c = parseInt(assignmentData.weight);

      const params = {
        records: [updateData]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} assignments:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const updatedAssignment = successfulUpdates[0].data;
          return {
            Id: updatedAssignment.Id,
            title: updatedAssignment.title_c,
            courseId: updatedAssignment.course_id_c?.Id || updatedAssignment.course_id_c,
            dueDate: updatedAssignment.due_date_c,
            priority: updatedAssignment.priority_c,
            status: updatedAssignment.status_c,
            description: updatedAssignment.description_c,
            grade: updatedAssignment.grade_c,
            weight: updatedAssignment.weight_c
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating assignment:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} assignments:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting assignment:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }

  async updateStatus(id, status) {
    return await this.update(id, { status });
  }
}

export const assignmentService = new AssignmentService();