import { getApperClient } from '@/services/apperClient';

const TASK_FIELDS = [
  { "field": { "Name": "title_c" } },
  { "field": { "Name": "description_c" } },
  { "field": { "Name": "status_c" } },
  { "field": { "Name": "priority_c" } },
  { "field": { "Name": "due_date_c" } },
  { "field": { "Name": "assigned_to_c" } },
  { "field": { "Name": "company_c" }, "referenceField": { "field": { "Name": "name_c" } } },
  { "field": { "Name": "contact_c" }, "referenceField": { "field": { "Name": "first_name_c" } } },
  { "field": { "Name": "deal_c" }, "referenceField": { "field": { "Name": "name_c" } } },
  { "field": { "Name": "category_c" } },
  { "field": { "Name": "estimated_hours_c" } },
  { "field": { "Name": "actual_hours_c" } },
  { "field": { "Name": "tags_c" } },
  { "field": { "Name": "notes_c" } },
  { "field": { "Name": "created_date_c" } },
  { "field": { "Name": "modified_date_c" } }
];

class TaskService {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('task_c', {
        fields: TASK_FIELDS,
        orderBy: [{ "fieldName": "created_date_c", "sorttype": "DESC" }],
        pagingInfo: { "limit": 100, "offset": 0 }
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById('task_c', parseInt(id), {
        fields: TASK_FIELDS
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(taskData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Filter out read-only fields and empty values
      const updateableData = {};
      if (taskData.title_c) updateableData.title_c = taskData.title_c;
      if (taskData.description_c) updateableData.description_c = taskData.description_c;
      if (taskData.status_c) updateableData.status_c = taskData.status_c;
      if (taskData.priority_c) updateableData.priority_c = taskData.priority_c;
      if (taskData.due_date_c) updateableData.due_date_c = taskData.due_date_c;
      if (taskData.assigned_to_c) updateableData.assigned_to_c = taskData.assigned_to_c;
      if (taskData.company_c) updateableData.company_c = parseInt(taskData.company_c);
      if (taskData.contact_c) updateableData.contact_c = parseInt(taskData.contact_c);
      if (taskData.deal_c) updateableData.deal_c = parseInt(taskData.deal_c);
      if (taskData.category_c) updateableData.category_c = taskData.category_c;
      if (taskData.estimated_hours_c) updateableData.estimated_hours_c = parseFloat(taskData.estimated_hours_c);
      if (taskData.actual_hours_c) updateableData.actual_hours_c = parseFloat(taskData.actual_hours_c);
      if (taskData.tags_c) updateableData.tags_c = taskData.tags_c;
      if (taskData.notes_c) updateableData.notes_c = taskData.notes_c;

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('task_c', params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
          });
        }
        return successful[0]?.data;
      }

      return response.data;
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, taskData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Filter out read-only fields and empty values
      const updateableData = { Id: parseInt(id) };
      if (taskData.title_c) updateableData.title_c = taskData.title_c;
      if (taskData.description_c) updateableData.description_c = taskData.description_c;
      if (taskData.status_c) updateableData.status_c = taskData.status_c;
      if (taskData.priority_c) updateableData.priority_c = taskData.priority_c;
      if (taskData.due_date_c) updateableData.due_date_c = taskData.due_date_c;
      if (taskData.assigned_to_c) updateableData.assigned_to_c = taskData.assigned_to_c;
      if (taskData.company_c) updateableData.company_c = parseInt(taskData.company_c);
      if (taskData.contact_c) updateableData.contact_c = parseInt(taskData.contact_c);
      if (taskData.deal_c) updateableData.deal_c = parseInt(taskData.deal_c);
      if (taskData.category_c) updateableData.category_c = taskData.category_c;
      if (taskData.estimated_hours_c) updateableData.estimated_hours_c = parseFloat(taskData.estimated_hours_c);
      if (taskData.actual_hours_c) updateableData.actual_hours_c = parseFloat(taskData.actual_hours_c);
      if (taskData.tags_c) updateableData.tags_c = taskData.tags_c;
      if (taskData.notes_c) updateableData.notes_c = taskData.notes_c;

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('task_c', params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
            record.errors?.forEach(error => {
              throw new Error(`${error.fieldLabel}: ${error.message}`);
            });
          });
        }
        return successful[0]?.data;
      }

      return response.data;
    } catch (error) {
      console.error(`Error updating task ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('task_c', params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return true;
      }

      return true;
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const taskService = new TaskService();