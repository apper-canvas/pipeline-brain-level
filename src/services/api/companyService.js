import { getApperClient } from "@/services/apperClient";

const COMPANY_FIELDS = [
  { "field": { "Name": "name_c" } },
  { "field": { "Name": "industry_c" } },
  { "field": { "Name": "phone_c" } },
  { "field": { "Name": "email_c" } },
  { "field": { "Name": "website_c" } },
  { "field": { "Name": "address_c" } },
  { "field": { "Name": "city_c" } },
  { "field": { "Name": "state_c" } },
  { "field": { "Name": "postal_code_c" } },
  { "field": { "Name": "country_c" } },
  { "field": { "Name": "founded_year_c" } },
  { "field": { "Name": "employee_count_c" } },
  { "field": { "Name": "annual_revenue_c" } },
  { "field": { "Name": "description_c" } },
  { "field": { "Name": "status_c" } },
  { "field": { "Name": "tags_c" } },
  { "field": { "Name": "created_date_c" } },
  { "field": { "Name": "modified_date_c" } }
];

class CompanyService {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('company_c', {
        fields: COMPANY_FIELDS,
        orderBy: [{ "fieldName": "created_date_c", "sorttype": "DESC" }],
        pagingInfo: { "limit": 100, "offset": 0 }
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching companies:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById('company_c', parseInt(id), {
        fields: COMPANY_FIELDS
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching company ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(companyData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Filter out read-only fields and empty values
      const updateableData = {};
      if (companyData.name_c) updateableData.name_c = companyData.name_c;
      if (companyData.industry_c) updateableData.industry_c = companyData.industry_c;
      if (companyData.phone_c) updateableData.phone_c = companyData.phone_c;
      if (companyData.email_c) updateableData.email_c = companyData.email_c;
      if (companyData.website_c) updateableData.website_c = companyData.website_c;
      if (companyData.address_c) updateableData.address_c = companyData.address_c;
      if (companyData.city_c) updateableData.city_c = companyData.city_c;
      if (companyData.state_c) updateableData.state_c = companyData.state_c;
      if (companyData.postal_code_c) updateableData.postal_code_c = companyData.postal_code_c;
      if (companyData.country_c) updateableData.country_c = companyData.country_c;
      if (companyData.founded_year_c) updateableData.founded_year_c = parseInt(companyData.founded_year_c);
      if (companyData.employee_count_c) updateableData.employee_count_c = parseInt(companyData.employee_count_c);
      if (companyData.annual_revenue_c) updateableData.annual_revenue_c = parseFloat(companyData.annual_revenue_c);
      if (companyData.description_c) updateableData.description_c = companyData.description_c;
      if (companyData.status_c) updateableData.status_c = companyData.status_c;
      if (companyData.tags_c) updateableData.tags_c = companyData.tags_c;

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('company_c', params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} companies:`, failed);
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
      console.error("Error creating company:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, companyData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Filter out read-only fields and empty values
      const updateableData = { Id: parseInt(id) };
      if (companyData.name_c) updateableData.name_c = companyData.name_c;
      if (companyData.industry_c) updateableData.industry_c = companyData.industry_c;
      if (companyData.phone_c) updateableData.phone_c = companyData.phone_c;
      if (companyData.email_c) updateableData.email_c = companyData.email_c;
      if (companyData.website_c) updateableData.website_c = companyData.website_c;
      if (companyData.address_c) updateableData.address_c = companyData.address_c;
      if (companyData.city_c) updateableData.city_c = companyData.city_c;
      if (companyData.state_c) updateableData.state_c = companyData.state_c;
      if (companyData.postal_code_c) updateableData.postal_code_c = companyData.postal_code_c;
      if (companyData.country_c) updateableData.country_c = companyData.country_c;
      if (companyData.founded_year_c) updateableData.founded_year_c = parseInt(companyData.founded_year_c);
      if (companyData.employee_count_c) updateableData.employee_count_c = parseInt(companyData.employee_count_c);
      if (companyData.annual_revenue_c) updateableData.annual_revenue_c = parseFloat(companyData.annual_revenue_c);
      if (companyData.description_c) updateableData.description_c = companyData.description_c;
      if (companyData.status_c) updateableData.status_c = companyData.status_c;
      if (companyData.tags_c) updateableData.tags_c = companyData.tags_c;

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('company_c', params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} companies:`, failed);
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
      console.error(`Error updating company ${id}:`, error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('company_c', params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} companies:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return true;
      }

      return true;
    } catch (error) {
      console.error(`Error deleting company ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }
}
export const companyService = new CompanyService();