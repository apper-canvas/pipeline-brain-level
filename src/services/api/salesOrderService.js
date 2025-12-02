import { getApperClient } from '@/services/apperClient';

class SalesOrderService {
  constructor() {
    // Identify lookup fields for proper handling
    this.lookupFields = ['company_id_c', 'contact_id_c', 'quote_id_c'];
  }

  // Prepare lookup fields for create/update operations
  prepareLookupFields(data) {
    const prepared = { ...data };
    this.lookupFields.forEach(fieldName => {
      if (prepared[fieldName] !== undefined && prepared[fieldName] !== null) {
        // Handle both object and direct ID inputs
        prepared[fieldName] = prepared[fieldName]?.Id || prepared[fieldName];
        // Ensure integer conversion
        if (prepared[fieldName]) {
          prepared[fieldName] = parseInt(prepared[fieldName]);
        }
      }
    });
    return prepared;
  }

  async getAll() {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          { field: { Name: 'Id' } },
          { field: { Name: 'Name' } },
          { field: { Name: 'order_date_c' } },
          { field: { Name: 'total_amount_c' } },
          { field: { Name: 'status_c' } },
          { field: { Name: 'company_id_c' } },
          { field: { Name: 'contact_id_c' } },
          { field: { Name: 'quote_id_c' } }
        ],
        orderBy: [{ fieldName: 'Id', sorttype: 'DESC' }],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await apperClient.fetchRecords('sales_order_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching sales orders:', error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async getById(id) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          { field: { Name: 'Id' } },
          { field: { Name: 'Name' } },
          { field: { Name: 'order_date_c' } },
          { field: { Name: 'total_amount_c' } },
          { field: { Name: 'status_c' } },
          { field: { Name: 'company_id_c' } },
          { field: { Name: 'contact_id_c' } },
          { field: { Name: 'quote_id_c' } }
        ]
      };

      const response = await apperClient.getRecordById('sales_order_c', parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching sales order ${id}:`, error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async create(salesOrderData) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Prepare lookup fields
      const preparedData = this.prepareLookupFields(salesOrderData);

      // Only include updateable fields with non-empty values
      const record = {};
      if (preparedData.Name && preparedData.Name.trim()) record.Name = preparedData.Name.trim();
      if (preparedData.order_date_c) record.order_date_c = preparedData.order_date_c;
      if (preparedData.total_amount_c !== undefined && preparedData.total_amount_c !== null) {
        record.total_amount_c = parseFloat(preparedData.total_amount_c);
      }
      if (preparedData.status_c && preparedData.status_c.trim()) record.status_c = preparedData.status_c.trim();
      if (preparedData.company_id_c) record.company_id_c = preparedData.company_id_c;
      if (preparedData.contact_id_c) record.contact_id_c = preparedData.contact_id_c;
      if (preparedData.quote_id_c) record.quote_id_c = preparedData.quote_id_c;

      const params = { records: [record] };

      const response = await apperClient.createRecord('sales_order_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} sales orders:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                throw new Error(`${error.fieldLabel}: ${error.message}`);
              });
            }
            if (record.message) throw new Error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error('Error creating sales order:', error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async update(id, salesOrderData) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Prepare lookup fields
      const preparedData = this.prepareLookupFields(salesOrderData);

      // Only include updateable fields with non-empty values
      const record = { Id: parseInt(id) };
      if (preparedData.Name && preparedData.Name.trim()) record.Name = preparedData.Name.trim();
      if (preparedData.order_date_c) record.order_date_c = preparedData.order_date_c;
      if (preparedData.total_amount_c !== undefined && preparedData.total_amount_c !== null) {
        record.total_amount_c = parseFloat(preparedData.total_amount_c);
      }
      if (preparedData.status_c && preparedData.status_c.trim()) record.status_c = preparedData.status_c.trim();
      if (preparedData.company_id_c) record.company_id_c = preparedData.company_id_c;
      if (preparedData.contact_id_c) record.contact_id_c = preparedData.contact_id_c;
      if (preparedData.quote_id_c) record.quote_id_c = preparedData.quote_id_c;

      const params = { records: [record] };

      const response = await apperClient.updateRecord('sales_order_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} sales orders:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                throw new Error(`${error.fieldLabel}: ${error.message}`);
              });
            }
            if (record.message) throw new Error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error('Error updating sales order:', error?.response?.data?.message || error.message);
      throw error;
    }
  }

  async delete(id) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = { RecordIds: [parseInt(id)] };

      const response = await apperClient.deleteRecord('sales_order_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} sales orders:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        return response.results.every(r => r.success);
      }

      return true;
    } catch (error) {
      console.error('Error deleting sales order:', error?.response?.data?.message || error.message);
      throw error;
    }
  }
}

const salesOrderService = new SalesOrderService();
export default salesOrderService;