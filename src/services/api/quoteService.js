import { getApperClient } from '@/services/apperClient';

const QUOTE_FIELDS = [
  { "field": { "Name": "quoteNumber_c" } },
  { "field": { "Name": "status_c" } },
  { "field": { "Name": "subtotal_c" } },
  { "field": { "Name": "taxRate_c" } },
  { "field": { "Name": "taxAmount_c" } },
  { "field": { "Name": "total_c" } },
  { "field": { "Name": "validUntil_c" } },
  { "field": { "Name": "notes_c" } },
  { "field": { "Name": "customerId_c" }, "referenceField": { "field": { "Name": "Name" } } },
  { "field": { "Name": "CreatedOn" } },
  { "field": { "Name": "ModifiedOn" } }
];

const QUOTE_ITEM_FIELDS = [
  { "field": { "Name": "quote_c" } },
  { "field": { "Name": "product_name_c" } },
  { "field": { "Name": "description_c" } },
  { "field": { "Name": "quantity_c" } },
  { "field": { "Name": "unit_price_c" } },
  { "field": { "Name": "discount_c" } },
  { "field": { "Name": "line_total_c" } },
  { "field": { "Name": "notes_c" } }
];

class QuoteService {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

const response = await apperClient.fetchRecords('quote_c', {
        fields: QUOTE_FIELDS,
        orderBy: [{ "fieldName": "CreatedOn", "sorttype": "DESC" }],
        pagingInfo: { "limit": 100, "offset": 0 }
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      // Transform data to match UI expectations
      const transformedData = (response.data || []).map(quote => ({
        ...quote,
        quoteNumber: quote.quoteNumber_c,
        status: quote.status_c,
        total: quote.total_c,
        validUntil: quote.validUntil_c,
        customerName: quote.customerId_c_Name || 'N/A',
        createdAt: quote.CreatedOn
      }));

      return transformedData;
    } catch (error) {
      console.error("Error fetching quotes:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById('quote_c', parseInt(id), {
        fields: QUOTE_FIELDS
      });

      if (!response.success) {
        throw new Error(response.message);
      }

// Transform data to match UI expectations
      const transformedData = {
        ...response.data,
        quoteNumber: response.data.quoteNumber_c,
        status: response.data.status_c,
        total: response.data.total_c,
        validUntil: response.data.validUntil_c,
        customerName: response.data.customerId_c_Name || 'N/A',
        createdAt: response.data.CreatedOn
      };

      return transformedData;
    } catch (error) {
      console.error(`Error fetching quote ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async getQuoteItems(quoteId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('quote_item_c', {
        fields: QUOTE_ITEM_FIELDS,
        where: [{
          "FieldName": "quote_c",
          "Operator": "EqualTo",
          "Values": [parseInt(quoteId)],
          "Include": true
        }],
        orderBy: [{ "fieldName": "Id", "sorttype": "ASC" }],
        pagingInfo: { "limit": 100, "offset": 0 }
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error(`Error fetching quote items for quote ${quoteId}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(quoteData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Filter out read-only fields and empty values
const updateableData = {};
      if (quoteData.quoteNumber_c) updateableData.quoteNumber_c = quoteData.quoteNumber_c;
      if (quoteData.status_c) updateableData.status_c = quoteData.status_c;
      if (quoteData.subtotal_c) updateableData.subtotal_c = parseFloat(quoteData.subtotal_c);
      if (quoteData.taxRate_c) updateableData.taxRate_c = parseFloat(quoteData.taxRate_c);
      if (quoteData.taxAmount_c) updateableData.taxAmount_c = parseFloat(quoteData.taxAmount_c);
      if (quoteData.total_c) updateableData.total_c = parseFloat(quoteData.total_c);
      if (quoteData.validUntil_c) updateableData.validUntil_c = quoteData.validUntil_c;
      if (quoteData.notes_c) updateableData.notes_c = quoteData.notes_c;
      if (quoteData.customerId_c) updateableData.customerId_c = parseInt(quoteData.customerId_c);

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('quote_c', params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} quotes:`, failed);
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
      console.error("Error creating quote:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async createQuoteItem(quoteItemData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Filter out read-only fields and empty values
      const updateableData = {};
      if (quoteItemData.quote_c) updateableData.quote_c = parseInt(quoteItemData.quote_c);
      if (quoteItemData.product_name_c) updateableData.product_name_c = quoteItemData.product_name_c;
      if (quoteItemData.description_c) updateableData.description_c = quoteItemData.description_c;
      if (quoteItemData.quantity_c) updateableData.quantity_c = parseInt(quoteItemData.quantity_c);
      if (quoteItemData.unit_price_c) updateableData.unit_price_c = parseFloat(quoteItemData.unit_price_c);
      if (quoteItemData.discount_c) updateableData.discount_c = parseFloat(quoteItemData.discount_c);
      if (quoteItemData.line_total_c) updateableData.line_total_c = parseFloat(quoteItemData.line_total_c);
      if (quoteItemData.notes_c) updateableData.notes_c = quoteItemData.notes_c;

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('quote_item_c', params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} quote items:`, failed);
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
      console.error("Error creating quote item:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, quoteData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Filter out read-only fields and empty values
const updateableData = { Id: parseInt(id) };
      if (quoteData.quoteNumber_c) updateableData.quoteNumber_c = quoteData.quoteNumber_c;
      if (quoteData.status_c) updateableData.status_c = quoteData.status_c;
      if (quoteData.subtotal_c) updateableData.subtotal_c = parseFloat(quoteData.subtotal_c);
      if (quoteData.taxRate_c) updateableData.taxRate_c = parseFloat(quoteData.taxRate_c);
      if (quoteData.taxAmount_c) updateableData.taxAmount_c = parseFloat(quoteData.taxAmount_c);
      if (quoteData.total_c) updateableData.total_c = parseFloat(quoteData.total_c);
      if (quoteData.validUntil_c) updateableData.validUntil_c = quoteData.validUntil_c;
      if (quoteData.notes_c) updateableData.notes_c = quoteData.notes_c;
      if (quoteData.customerId_c) updateableData.customerId_c = parseInt(quoteData.customerId_c);

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('quote_c', params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} quotes:`, failed);
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
      console.error(`Error updating quote ${id}:`, error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('quote_c', params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} quotes:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        return true;
      }

      return true;
    } catch (error) {
      console.error(`Error deleting quote ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const quoteService = new QuoteService();