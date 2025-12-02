import { getApperClient } from '@/services/apperClient';

const STAGE_FIELDS = [
  { "field": { "Name": "name_c" } },
  { "field": { "Name": "description_c" } },
  { "field": { "Name": "order_c" } },
  { "field": { "Name": "color_c" } },
  { "field": { "Name": "probability_c" } },
  { "field": { "Name": "is_active_c" } },
  { "field": { "Name": "is_won_c" } },
  { "field": { "Name": "is_lost_c" } },
  { "field": { "Name": "created_date_c" } },
  { "field": { "Name": "modified_date_c" } }
];

class StageService {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('stage_c', {
        fields: STAGE_FIELDS,
        where: [{
          "FieldName": "is_active_c",
          "Operator": "EqualTo",
          "Values": [true],
          "Include": true
        }],
        orderBy: [{ "fieldName": "order_c", "sorttype": "ASC" }],
        pagingInfo: { "limit": 100, "offset": 0 }
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching stages:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById('stage_c', parseInt(id), {
        fields: STAGE_FIELDS
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching stage ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(stageData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Filter out read-only fields and empty values
      const updateableData = {};
      if (stageData.name_c) updateableData.name_c = stageData.name_c;
      if (stageData.description_c) updateableData.description_c = stageData.description_c;
      if (stageData.order_c) updateableData.order_c = parseInt(stageData.order_c);
      if (stageData.color_c) updateableData.color_c = stageData.color_c;
      if (stageData.probability_c) updateableData.probability_c = parseFloat(stageData.probability_c);
      if (stageData.is_active_c !== undefined) updateableData.is_active_c = stageData.is_active_c;
      if (stageData.is_won_c !== undefined) updateableData.is_won_c = stageData.is_won_c;
      if (stageData.is_lost_c !== undefined) updateableData.is_lost_c = stageData.is_lost_c;

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('stage_c', params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} stages:`, failed);
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
      console.error("Error creating stage:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, stageData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Filter out read-only fields and empty values
      const updateableData = { Id: parseInt(id) };
      if (stageData.name_c) updateableData.name_c = stageData.name_c;
      if (stageData.description_c) updateableData.description_c = stageData.description_c;
      if (stageData.order_c) updateableData.order_c = parseInt(stageData.order_c);
      if (stageData.color_c) updateableData.color_c = stageData.color_c;
      if (stageData.probability_c) updateableData.probability_c = parseFloat(stageData.probability_c);
      if (stageData.is_active_c !== undefined) updateableData.is_active_c = stageData.is_active_c;
      if (stageData.is_won_c !== undefined) updateableData.is_won_c = stageData.is_won_c;
      if (stageData.is_lost_c !== undefined) updateableData.is_lost_c = stageData.is_lost_c;

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('stage_c', params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} stages:`, failed);
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
      console.error(`Error updating stage ${id}:`, error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('stage_c', params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} stages:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return true;
      }

      return true;
    } catch (error) {
      console.error(`Error deleting stage ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const stageService = new StageService();