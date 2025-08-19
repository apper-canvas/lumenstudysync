import { toast } from "react-toastify";

class CourseService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'course_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "code_c" } },
          { field: { Name: "instructor_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "room_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "schedule_c" } }
        ],
        orderBy: [
          {
            fieldName: "Name",
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
      return response.data.map(course => ({
        Id: course.Id,
        name: course.Name,
        code: course.code_c,
        instructor: course.instructor_c,
        color: course.color_c,
        room: course.room_c,
        credits: course.credits_c,
        schedule: course.schedule_c ? JSON.parse(course.schedule_c) : []
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching courses:", error?.response?.data?.message);
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
          { field: { Name: "code_c" } },
          { field: { Name: "instructor_c" } },
          { field: { Name: "color_c" } },
          { field: { Name: "room_c" } },
          { field: { Name: "credits_c" } },
          { field: { Name: "schedule_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response || !response.data) {
        return null;
      }

      const course = response.data;
      return {
        Id: course.Id,
        name: course.Name,
        code: course.code_c,
        instructor: course.instructor_c,
        color: course.color_c,
        room: course.room_c,
        credits: course.credits_c,
        schedule: course.schedule_c ? JSON.parse(course.schedule_c) : []
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching course with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async create(courseData) {
    try {
      const params = {
        records: [
          {
            Name: courseData.name,
            code_c: courseData.code,
            instructor_c: courseData.instructor,
            color_c: courseData.color,
            room_c: courseData.room,
            credits_c: parseInt(courseData.credits) || 3,
            schedule_c: JSON.stringify(courseData.schedule || [])
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
          console.error(`Failed to create ${failedRecords.length} courses:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const newCourse = successfulRecords[0].data;
          return {
            Id: newCourse.Id,
            name: newCourse.Name,
            code: newCourse.code_c,
            instructor: newCourse.instructor_c,
            color: newCourse.color_c,
            room: newCourse.room_c,
            credits: newCourse.credits_c,
            schedule: newCourse.schedule_c ? JSON.parse(newCourse.schedule_c) : []
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating course:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async update(id, courseData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: courseData.name,
            code_c: courseData.code,
            instructor_c: courseData.instructor,
            color_c: courseData.color,
            room_c: courseData.room,
            credits_c: parseInt(courseData.credits) || 3,
            schedule_c: JSON.stringify(courseData.schedule || [])
          }
        ]
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
          console.error(`Failed to update ${failedUpdates.length} courses:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const updatedCourse = successfulUpdates[0].data;
          return {
            Id: updatedCourse.Id,
            name: updatedCourse.Name,
            code: updatedCourse.code_c,
            instructor: updatedCourse.instructor_c,
            color: updatedCourse.color_c,
            room: updatedCourse.room_c,
            credits: updatedCourse.credits_c,
            schedule: updatedCourse.schedule_c ? JSON.parse(updatedCourse.schedule_c) : []
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating course:", error?.response?.data?.message);
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
          console.error(`Failed to delete ${failedDeletions.length} courses:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting course:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }
}

export const courseService = new CourseService();