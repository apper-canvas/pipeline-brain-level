import { getApperClient } from "@/services/apperClient";

const COMPANY_FIELDS = [
  { "field": { "Name": "Name" } },
  { "field": { "Name": "Tags" } },
  { "field": { "Name": "industry_c" } },
  { "field": { "Name": "website_c" } },
  { "field": { "Name": "phone_c" } },
  { "field": { "Name": "email_c" } },
  { "field": { "Name": "address_c" } },
  { "field": { "Name": "employees_c" } },
  { "field": { "Name": "revenue_c" } },
  { "field": { "Name": "notes_c" } },
  { "field": { "Name": "Owner" } },
  { "field": { "Name": "CreatedOn" } },
  { "field": { "Name": "CreatedBy" } },
  { "field": { "Name": "ModifiedOn" } },
  { "field": { "Name": "ModifiedBy" } }
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
orderBy: [{ "fieldName": "CreatedOn", "sorttype": "DESC" }],
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

      // Map form field names to database field names and filter out empty values
      const updateableData = {};
      
      // Handle both form field names and database field names
      if (companyData.name || companyData.Name) updateableData.Name = companyData.name || companyData.Name;
      if (companyData.industry || companyData.industry_c) updateableData.industry_c = companyData.industry || companyData.industry_c;
      if (companyData.phone || companyData.phone_c) updateableData.phone_c = companyData.phone || companyData.phone_c;
      if (companyData.email || companyData.email_c) updateableData.email_c = companyData.email || companyData.email_c;
      if (companyData.website || companyData.website_c) updateableData.website_c = companyData.website || companyData.website_c;
      if (companyData.address || companyData.address_c) updateableData.address_c = companyData.address || companyData.address_c;
      if (companyData.employees || companyData.employees_c) updateableData.employees_c = parseInt(companyData.employees || companyData.employees_c);
      if (companyData.revenue || companyData.revenue_c) updateableData.revenue_c = parseFloat(companyData.revenue || companyData.revenue_c);
      if (companyData.notes || companyData.notes_c) updateableData.notes_c = companyData.notes || companyData.notes_c;
      if (companyData.Tags) updateableData.Tags = companyData.Tags;

      // Ensure at least one field is provided
      if (Object.keys(updateableData).length === 0) {
        throw new Error("At least one field must be provided to create a company");
      }

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('company_c', params);

      if (!response.success) {
        console.error(response.message);
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

      // Map form field names to database field names and filter out empty values
      const updateableData = { Id: parseInt(id) };
      
      // Handle both form field names and database field names
      if (companyData.name || companyData.Name) updateableData.Name = companyData.name || companyData.Name;
      if (companyData.industry || companyData.industry_c) updateableData.industry_c = companyData.industry || companyData.industry_c;
      if (companyData.phone || companyData.phone_c) updateableData.phone_c = companyData.phone || companyData.phone_c;
      if (companyData.email || companyData.email_c) updateableData.email_c = companyData.email || companyData.email_c;
      if (companyData.website || companyData.website_c) updateableData.website_c = companyData.website || companyData.website_c;
      if (companyData.address || companyData.address_c) updateableData.address_c = companyData.address || companyData.address_c;
      if (companyData.employees || companyData.employees_c) updateableData.employees_c = parseInt(companyData.employees || companyData.employees_c);
      if (companyData.revenue || companyData.revenue_c) updateableData.revenue_c = parseFloat(companyData.revenue || companyData.revenue_c);
      if (companyData.notes || companyData.notes_c) updateableData.notes_c = companyData.notes || companyData.notes_c;
      if (companyData.Tags) updateableData.Tags = companyData.Tags;

      // Ensure at least one updateable field is provided (besides Id)
      if (Object.keys(updateableData).length <= 1) {
        throw new Error("At least one field must be provided to update a company");
      }

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('company_c', params);

      if (!response.success) {
        console.error(response.message);
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