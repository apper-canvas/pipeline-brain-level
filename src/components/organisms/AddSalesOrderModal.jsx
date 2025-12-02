import React, { useEffect, useState } from "react";
import { companyService } from "@/services/api/companyService";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Label from "@/components/atoms/Label";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import FormField from "@/components/molecules/FormField";

const AddSalesOrderModal = ({ isOpen, onClose, onSubmit }) => {
const [formData, setFormData] = useState({
    Name: '',
    Tags: '',
    order_date_c: new Date().toISOString().split('T')[0],
    total_amount_c: '',
    status_c: 'Draft',
    customer_id_c: '',
    shipping_address_c: '',
    billing_address_c: '',
    notes_c: ''
  });
  const [loading, setLoading] = useState(false);
const [companies, setCompanies] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadOptions();
    }
  }, [isOpen]);

const loadOptions = async () => {
    setLoadingOptions(true);
    try {
      const companiesData = await companyService.getAll().catch(() => []);
      setCompanies(companiesData || []);
    } catch (error) {
      console.error('Error loading options:', error);
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.Name.trim()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
setFormData({
        Name: '',
        Tags: '',
        order_date_c: new Date().toISOString().split('T')[0],
        customer_id_c: '',
        total_amount_c: '',
        status_c: 'Draft',
        shipping_address_c: '',
        billing_address_c: '',
        notes_c: ''
      });
    } catch (error) {
      console.error('Error creating sales order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

const statusOptions = [
    { value: 'Draft', label: 'Draft' },
    { value: 'Confirmed', label: 'Confirmed' },
    { value: 'Shipped', label: 'Shipped' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Create Sales Order</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <ApperIcon name="X" size={24} />
          </button>
        </div>

<form onSubmit={handleSubmit} className="p-6 space-y-6">
          <FormField label="Order Name" required>
            <Input
              value={formData.Name}
              onChange={(e) => handleChange('Name', e.target.value)}
              placeholder="Enter sales order name"
              required
            />
          </FormField>

          <FormField label="Tags">
            <Input
              value={formData.Tags}
              onChange={(e) => handleChange('Tags', e.target.value)}
              placeholder="Enter tags (comma-separated)"
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Order Date" required>
              <Input
                type="date"
                value={formData.order_date_c}
                onChange={(e) => handleChange('order_date_c', e.target.value)}
                required
              />
            </FormField>

            <FormField label="Total Amount">
              <Input
                type="number"
                step="0.01"
                value={formData.total_amount_c}
                onChange={(e) => handleChange('total_amount_c', e.target.value)}
                placeholder="0.00"
              />
            </FormField>
          </div>

          <FormField label="Status" required>
            <Select
              value={formData.status_c}
              onValueChange={(value) => handleChange('status_c', value)}
              placeholder="Select status"
            >
              {statusOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </FormField>
<FormField label="Customer">
            <Select
              value={formData.customer_id_c}
              onValueChange={(value) => handleChange('customer_id_c', value)}
              placeholder={loadingOptions ? "Loading companies..." : "Select customer"}
              disabled={loadingOptions}
            >
              {companies.map((company) => (
                <Select.Option key={company.Id} value={company.Id.toString()}>
                  {company.Name}
                </Select.Option>
              ))}
            </Select>
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Shipping Address">
              <textarea
                className="min-h-[80px] w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent resize-vertical"
                value={formData.shipping_address_c}
                onChange={(e) => handleChange('shipping_address_c', e.target.value)}
                placeholder="Enter shipping address"
                rows={3}
              />
            </FormField>

            <FormField label="Billing Address">
              <textarea
                className="min-h-[80px] w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent resize-vertical"
                value={formData.billing_address_c}
                onChange={(e) => handleChange('billing_address_c', e.target.value)}
                placeholder="Enter billing address"
                rows={3}
              />
            </FormField>
          </div>

          <FormField label="Notes">
            <textarea
              className="min-h-[80px] w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent resize-vertical"
              value={formData.notes_c}
              onChange={(e) => handleChange('notes_c', e.target.value)}
              placeholder="Enter any additional notes"
              rows={3}
            />
          </FormField>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.Name.trim()}
              className="flex items-center gap-2"
            >
              {loading && <ApperIcon name="Loader2" size={16} className="animate-spin" />}
              Create Sales Order
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSalesOrderModal;