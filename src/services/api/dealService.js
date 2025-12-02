import { getApperClient } from '@/services/apperClient';

const DEAL_FIELDS = [
  { "field": { "Name": "name_c" } },
  { "field": { "Name": "value_c" } },
  { "field": { "Name": "stage_c" }, "referenceField": { "field": { "Name": "name_c" } } },
  { "field": { "Name": "probability_c" } },
  { "field": { "Name": "expected_close_date_c" } },
  { "field": { "Name": "company_c" }, "referenceField": { "field": { "Name": "name_c" } } },
  { "field": { "Name": "contact_c" }, "referenceField": { "field": { "Name": "first_name_c" } } },
  { "field": { "Name": "description_c" } },
  { "field": { "Name": "source_c" } },
  { "field": { "Name": "priority_c" } },
  { "field": { "Name": "status_c" } },
  { "field": { "Name": "tags_c" } },
  { "field": { "Name": "created_date_c" } },
  { "field": { "Name": "modified_date_c" } }
];

class DealService {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('deal_c', {
        fields: DEAL_FIELDS,
        orderBy: [{ "fieldName": "created_date_c", "sorttype": "DESC" }],
        pagingInfo: { "limit": 100, "offset": 0 }
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById('deal_c', parseInt(id), {
        fields: DEAL_FIELDS
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching deal ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async getByStage(stageId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('deal_c', {
        fields: DEAL_FIELDS,
        where: [{
          "FieldName": "stage_c",
          "Operator": "EqualTo",
          "Values": [parseInt(stageId)],
          "Include": true
        }],
        orderBy: [{ "fieldName": "created_date_c", "sorttype": "DESC" }],
        pagingInfo: { "limit": 100, "offset": 0 }
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching deals for stage ${stageId}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

async create(dealData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Filter out read-only fields and empty values - use correct field names from deal_c schema
      const updateableData = {};
      if (dealData.title_c && dealData.title_c.trim() !== '') updateableData.title_c = dealData.title_c;
      if (dealData.value_c !== undefined && dealData.value_c !== null && dealData.value_c !== '') updateableData.value_c = parseFloat(dealData.value_c);
      if (dealData.stage_c !== undefined && dealData.stage_c !== null && dealData.stage_c !== '') updateableData.stage_c = dealData.stage_c;
      if (dealData.notes_c && dealData.notes_c.trim() !== '') updateableData.notes_c = dealData.notes_c;
      if (dealData.contactId_c !== undefined && dealData.contactId_c !== null && dealData.contactId_c !== '') updateableData.contactId_c = parseInt(dealData.contactId_c);
      if (dealData.Tags && dealData.Tags.trim() !== '') updateableData.Tags = dealData.Tags;
      // Ensure we have at least one field
      if (Object.keys(updateableData).length === 0) {
        throw new Error("No valid fields provided for deal creation");
      }
      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('deal_c', params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} deals:`, failed);
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
      console.error("Error creating deal:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, dealData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Filter out read-only fields and empty values
      const updateableData = { Id: parseInt(id) };
      if (dealData.name_c) updateableData.name_c = dealData.name_c;
      if (dealData.value_c) updateableData.value_c = parseFloat(dealData.value_c);
      if (dealData.stage_c) updateableData.stage_c = parseInt(dealData.stage_c);
      if (dealData.probability_c) updateableData.probability_c = parseFloat(dealData.probability_c);
      if (dealData.expected_close_date_c) updateableData.expected_close_date_c = dealData.expected_close_date_c;
      if (dealData.company_c) updateableData.company_c = parseInt(dealData.company_c);
      if (dealData.contact_c) updateableData.contact_c = parseInt(dealData.contact_c);
      if (dealData.description_c) updateableData.description_c = dealData.description_c;
      if (dealData.source_c) updateableData.source_c = dealData.source_c;
      if (dealData.priority_c) updateableData.priority_c = dealData.priority_c;
      if (dealData.status_c) updateableData.status_c = dealData.status_c;
      if (dealData.tags_c) updateableData.tags_c = dealData.tags_c;

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('deal_c', params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} deals:`, failed);
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
      console.error(`Error updating deal ${id}:`, error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('deal_c', params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} deals:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return true;
      }

      return true;
    } catch (error) {
      console.error(`Error deleting deal ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const dealService = new DealService();