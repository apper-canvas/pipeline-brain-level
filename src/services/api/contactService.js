import { getApperClient } from '@/services/apperClient';

const CONTACT_FIELDS = [
  { "field": { "Name": "first_name_c" } },
  { "field": { "Name": "last_name_c" } },
  { "field": { "Name": "email_c" } },
  { "field": { "Name": "phone_c" } },
  { "field": { "Name": "title_c" } },
  { "field": { "Name": "department_c" } },
  { "field": { "Name": "company_c" }, "referenceField": { "field": { "Name": "name_c" } } },
  { "field": { "Name": "address_c" } },
  { "field": { "Name": "city_c" } },
  { "field": { "Name": "state_c" } },
  { "field": { "Name": "postal_code_c" } },
  { "field": { "Name": "country_c" } },
  { "field": { "Name": "date_of_birth_c" } },
  { "field": { "Name": "linkedin_profile_c" } },
  { "field": { "Name": "twitter_handle_c" } },
  { "field": { "Name": "status_c" } },
  { "field": { "Name": "source_c" } },
  { "field": { "Name": "tags_c" } },
  { "field": { "Name": "notes_c" } },
  { "field": { "Name": "created_date_c" } },
  { "field": { "Name": "modified_date_c" } }
];

class ContactService {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('contact_c', {
        fields: CONTACT_FIELDS,
        orderBy: [{ "fieldName": "created_date_c", "sorttype": "DESC" }],
        pagingInfo: { "limit": 100, "offset": 0 }
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching contacts:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById('contact_c', parseInt(id), {
        fields: CONTACT_FIELDS
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(contactData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Filter out read-only fields and empty values
      const updateableData = {};
      if (contactData.first_name_c) updateableData.first_name_c = contactData.first_name_c;
      if (contactData.last_name_c) updateableData.last_name_c = contactData.last_name_c;
      if (contactData.email_c) updateableData.email_c = contactData.email_c;
      if (contactData.phone_c) updateableData.phone_c = contactData.phone_c;
      if (contactData.title_c) updateableData.title_c = contactData.title_c;
      if (contactData.department_c) updateableData.department_c = contactData.department_c;
      if (contactData.company_c) updateableData.company_c = parseInt(contactData.company_c);
      if (contactData.address_c) updateableData.address_c = contactData.address_c;
      if (contactData.city_c) updateableData.city_c = contactData.city_c;
      if (contactData.state_c) updateableData.state_c = contactData.state_c;
      if (contactData.postal_code_c) updateableData.postal_code_c = contactData.postal_code_c;
      if (contactData.country_c) updateableData.country_c = contactData.country_c;
      if (contactData.date_of_birth_c) updateableData.date_of_birth_c = contactData.date_of_birth_c;
      if (contactData.linkedin_profile_c) updateableData.linkedin_profile_c = contactData.linkedin_profile_c;
      if (contactData.twitter_handle_c) updateableData.twitter_handle_c = contactData.twitter_handle_c;
      if (contactData.status_c) updateableData.status_c = contactData.status_c;
      if (contactData.source_c) updateableData.source_c = contactData.source_c;
      if (contactData.tags_c) updateableData.tags_c = contactData.tags_c;
      if (contactData.notes_c) updateableData.notes_c = contactData.notes_c;

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('contact_c', params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} contacts:`, failed);
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
      console.error("Error creating contact:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, contactData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Filter out read-only fields and empty values
      const updateableData = { Id: parseInt(id) };
      if (contactData.first_name_c) updateableData.first_name_c = contactData.first_name_c;
      if (contactData.last_name_c) updateableData.last_name_c = contactData.last_name_c;
      if (contactData.email_c) updateableData.email_c = contactData.email_c;
      if (contactData.phone_c) updateableData.phone_c = contactData.phone_c;
      if (contactData.title_c) updateableData.title_c = contactData.title_c;
      if (contactData.department_c) updateableData.department_c = contactData.department_c;
      if (contactData.company_c) updateableData.company_c = parseInt(contactData.company_c);
      if (contactData.address_c) updateableData.address_c = contactData.address_c;
      if (contactData.city_c) updateableData.city_c = contactData.city_c;
      if (contactData.state_c) updateableData.state_c = contactData.state_c;
      if (contactData.postal_code_c) updateableData.postal_code_c = contactData.postal_code_c;
      if (contactData.country_c) updateableData.country_c = contactData.country_c;
      if (contactData.date_of_birth_c) updateableData.date_of_birth_c = contactData.date_of_birth_c;
      if (contactData.linkedin_profile_c) updateableData.linkedin_profile_c = contactData.linkedin_profile_c;
      if (contactData.twitter_handle_c) updateableData.twitter_handle_c = contactData.twitter_handle_c;
      if (contactData.status_c) updateableData.status_c = contactData.status_c;
      if (contactData.source_c) updateableData.source_c = contactData.source_c;
      if (contactData.tags_c) updateableData.tags_c = contactData.tags_c;
      if (contactData.notes_c) updateableData.notes_c = contactData.notes_c;

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('contact_c', params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} contacts:`, failed);
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
      console.error(`Error updating contact ${id}:`, error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('contact_c', params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} contacts:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return true;
      }

      return true;
    } catch (error) {
      console.error(`Error deleting contact ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const contactService = new ContactService();