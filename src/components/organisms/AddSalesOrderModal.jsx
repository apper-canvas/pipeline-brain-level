import React, { useState, useEffect } from 'react';
import { ApperIcon } from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Select from '@/components/atoms/Select';
import FormField from '@/components/molecules/FormField';
import { companyService } from '@/services/api/companyService';
import { contactService } from '@/services/api/contactService';
import { quoteService } from '@/services/api/quoteService';

const AddSalesOrderModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    Name: '',
    order_date_c: new Date().toISOString().split('T')[0],
    total_amount_c: '',
    status_c: 'Draft',
    company_id_c: '',
    contact_id_c: '',
    quote_id_c: ''
  });
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadOptions();
    }
  }, [isOpen]);

  const loadOptions = async () => {
    setLoadingOptions(true);
    try {
      const [companiesData, contactsData, quotesData] = await Promise.all([
        companyService.getAll().catch(() => []),
        contactService.getAll().catch(() => []),
        quoteService.getAll().catch(() => [])
      ]);
      
      setCompanies(companiesData || []);
      setContacts(contactsData || []);
      setQuotes(quotesData || []);
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
        order_date_c: new Date().toISOString().split('T')[0],
        total_amount_c: '',
        status_c: 'Draft',
        company_id_c: '',
        contact_id_c: '',
        quote_id_c: ''
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
    { value: 'In Progress', label: 'In Progress' },
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Company">
              <Select
                value={formData.company_id_c}
                onValueChange={(value) => handleChange('company_id_c', value)}
                placeholder={loadingOptions ? "Loading companies..." : "Select company"}
                disabled={loadingOptions}
              >
                {companies.map((company) => (
                  <Select.Option key={company.Id} value={company.Id.toString()}>
                    {company.Name}
                  </Select.Option>
                ))}
              </Select>
            </FormField>

            <FormField label="Contact">
              <Select
                value={formData.contact_id_c}
                onValueChange={(value) => handleChange('contact_id_c', value)}
                placeholder={loadingOptions ? "Loading contacts..." : "Select contact"}
                disabled={loadingOptions}
              >
                {contacts.map((contact) => (
                  <Select.Option key={contact.Id} value={contact.Id.toString()}>
                    {contact.Name}
                  </Select.Option>
                ))}
              </Select>
            </FormField>
          </div>

          <FormField label="Quote">
            <Select
              value={formData.quote_id_c}
              onValueChange={(value) => handleChange('quote_id_c', value)}
              placeholder={loadingOptions ? "Loading quotes..." : "Select quote (optional)"}
              disabled={loadingOptions}
            >
              {quotes.map((quote) => (
                <Select.Option key={quote.Id} value={quote.Id.toString()}>
                  {quote.Name}
                </Select.Option>
              ))}
            </Select>
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