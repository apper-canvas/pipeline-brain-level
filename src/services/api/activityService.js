import { getApperClient } from '@/services/apperClient';

const ACTIVITY_FIELDS = [
  { "field": { "Name": "title_c" } },
  { "field": { "Name": "type_c" } },
  { "field": { "Name": "description_c" } },
  { "field": { "Name": "status_c" } },
  { "field": { "Name": "priority_c" } },
  { "field": { "Name": "scheduled_date_c" } },
  { "field": { "Name": "duration_minutes_c" } },
  { "field": { "Name": "location_c" } },
  { "field": { "Name": "company_c" }, "referenceField": { "field": { "Name": "name_c" } } },
  { "field": { "Name": "contact_c" }, "referenceField": { "field": { "Name": "first_name_c" } } },
  { "field": { "Name": "deal_c" }, "referenceField": { "field": { "Name": "name_c" } } },
  { "field": { "Name": "assigned_to_c" } },
  { "field": { "Name": "outcome_c" } },
  { "field": { "Name": "notes_c" } },
  { "field": { "Name": "tags_c" } },
  { "field": { "Name": "created_date_c" } },
  { "field": { "Name": "modified_date_c" } }
];

class ActivityService {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('activity_c', {
        fields: ACTIVITY_FIELDS,
        orderBy: [{ "fieldName": "scheduled_date_c", "sorttype": "DESC" }],
        pagingInfo: { "limit": 100, "offset": 0 }
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById('activity_c', parseInt(id), {
        fields: ACTIVITY_FIELDS
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching activity ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(activityData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Filter out read-only fields and empty values
      const updateableData = {};
      if (activityData.title_c) updateableData.title_c = activityData.title_c;
      if (activityData.type_c) updateableData.type_c = activityData.type_c;
      if (activityData.description_c) updateableData.description_c = activityData.description_c;
      if (activityData.status_c) updateableData.status_c = activityData.status_c;
      if (activityData.priority_c) updateableData.priority_c = activityData.priority_c;
      if (activityData.scheduled_date_c) updateableData.scheduled_date_c = activityData.scheduled_date_c;
      if (activityData.duration_minutes_c) updateableData.duration_minutes_c = parseInt(activityData.duration_minutes_c);
      if (activityData.location_c) updateableData.location_c = activityData.location_c;
      if (activityData.company_c) updateableData.company_c = parseInt(activityData.company_c);
      if (activityData.contact_c) updateableData.contact_c = parseInt(activityData.contact_c);
      if (activityData.deal_c) updateableData.deal_c = parseInt(activityData.deal_c);
      if (activityData.assigned_to_c) updateableData.assigned_to_c = activityData.assigned_to_c;
      if (activityData.outcome_c) updateableData.outcome_c = activityData.outcome_c;
      if (activityData.notes_c) updateableData.notes_c = activityData.notes_c;
      if (activityData.tags_c) updateableData.tags_c = activityData.tags_c;

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('activity_c', params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} activities:`, failed);
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
      console.error("Error creating activity:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, activityData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Filter out read-only fields and empty values
      const updateableData = { Id: parseInt(id) };
      if (activityData.title_c) updateableData.title_c = activityData.title_c;
      if (activityData.type_c) updateableData.type_c = activityData.type_c;
      if (activityData.description_c) updateableData.description_c = activityData.description_c;
      if (activityData.status_c) updateableData.status_c = activityData.status_c;
      if (activityData.priority_c) updateableData.priority_c = activityData.priority_c;
      if (activityData.scheduled_date_c) updateableData.scheduled_date_c = activityData.scheduled_date_c;
      if (activityData.duration_minutes_c) updateableData.duration_minutes_c = parseInt(activityData.duration_minutes_c);
      if (activityData.location_c) updateableData.location_c = activityData.location_c;
      if (activityData.company_c) updateableData.company_c = parseInt(activityData.company_c);
      if (activityData.contact_c) updateableData.contact_c = parseInt(activityData.contact_c);
      if (activityData.deal_c) updateableData.deal_c = parseInt(activityData.deal_c);
      if (activityData.assigned_to_c) updateableData.assigned_to_c = activityData.assigned_to_c;
      if (activityData.outcome_c) updateableData.outcome_c = activityData.outcome_c;
      if (activityData.notes_c) updateableData.notes_c = activityData.notes_c;
      if (activityData.tags_c) updateableData.tags_c = activityData.tags_c;

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('activity_c', params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} activities:`, failed);
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
      console.error(`Error updating activity ${id}:`, error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('activity_c', params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} activities:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return true;
      }

      return true;
    } catch (error) {
      console.error(`Error deleting activity ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const activityService = new ActivityService();