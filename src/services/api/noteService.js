import { getApperClient } from '@/services/apperClient';

const NOTE_FIELDS = [
  { "field": { "Name": "title_c" } },
  { "field": { "Name": "content_c" } },
  { "field": { "Name": "category_c" } },
  { "field": { "Name": "priority_c" } },
  { "field": { "Name": "is_private_c" } },
  { "field": { "Name": "company_c" }, "referenceField": { "field": { "Name": "name_c" } } },
  { "field": { "Name": "contact_c" }, "referenceField": { "field": { "Name": "first_name_c" } } },
  { "field": { "Name": "deal_c" }, "referenceField": { "field": { "Name": "name_c" } } },
  { "field": { "Name": "task_c" }, "referenceField": { "field": { "Name": "title_c" } } },
  { "field": { "Name": "activity_c" }, "referenceField": { "field": { "Name": "title_c" } } },
  { "field": { "Name": "author_c" } },
  { "field": { "Name": "tags_c" } },
  { "field": { "Name": "attachments_c" } },
  { "field": { "Name": "created_date_c" } },
  { "field": { "Name": "modified_date_c" } }
];

class NoteService {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('note_c', {
        fields: NOTE_FIELDS,
        orderBy: [{ "fieldName": "created_date_c", "sorttype": "DESC" }],
        pagingInfo: { "limit": 100, "offset": 0 }
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching notes:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById('note_c', parseInt(id), {
        fields: NOTE_FIELDS
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching note ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(noteData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Filter out read-only fields and empty values
      const updateableData = {};
      if (noteData.title_c) updateableData.title_c = noteData.title_c;
      if (noteData.content_c) updateableData.content_c = noteData.content_c;
      if (noteData.category_c) updateableData.category_c = noteData.category_c;
      if (noteData.priority_c) updateableData.priority_c = noteData.priority_c;
      if (noteData.is_private_c !== undefined) updateableData.is_private_c = noteData.is_private_c;
      if (noteData.company_c) updateableData.company_c = parseInt(noteData.company_c);
      if (noteData.contact_c) updateableData.contact_c = parseInt(noteData.contact_c);
      if (noteData.deal_c) updateableData.deal_c = parseInt(noteData.deal_c);
      if (noteData.task_c) updateableData.task_c = parseInt(noteData.task_c);
      if (noteData.activity_c) updateableData.activity_c = parseInt(noteData.activity_c);
      if (noteData.author_c) updateableData.author_c = noteData.author_c;
      if (noteData.tags_c) updateableData.tags_c = noteData.tags_c;
      if (noteData.attachments_c) updateableData.attachments_c = noteData.attachments_c;

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('note_c', params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} notes:`, failed);
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
      console.error("Error creating note:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, noteData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Filter out read-only fields and empty values
      const updateableData = { Id: parseInt(id) };
      if (noteData.title_c) updateableData.title_c = noteData.title_c;
      if (noteData.content_c) updateableData.content_c = noteData.content_c;
      if (noteData.category_c) updateableData.category_c = noteData.category_c;
      if (noteData.priority_c) updateableData.priority_c = noteData.priority_c;
      if (noteData.is_private_c !== undefined) updateableData.is_private_c = noteData.is_private_c;
      if (noteData.company_c) updateableData.company_c = parseInt(noteData.company_c);
      if (noteData.contact_c) updateableData.contact_c = parseInt(noteData.contact_c);
      if (noteData.deal_c) updateableData.deal_c = parseInt(noteData.deal_c);
      if (noteData.task_c) updateableData.task_c = parseInt(noteData.task_c);
      if (noteData.activity_c) updateableData.activity_c = parseInt(noteData.activity_c);
      if (noteData.author_c) updateableData.author_c = noteData.author_c;
      if (noteData.tags_c) updateableData.tags_c = noteData.tags_c;
      if (noteData.attachments_c) updateableData.attachments_c = noteData.attachments_c;

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('note_c', params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} notes:`, failed);
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
      console.error(`Error updating note ${id}:`, error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('note_c', params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} notes:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return true;
      }

      return true;
    } catch (error) {
      console.error(`Error deleting note ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const noteService = new NoteService();