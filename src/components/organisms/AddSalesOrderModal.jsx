import React, { useState, useEffect } from 'react'
import salesOrderService from '@/services/api/salesOrderService'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Label from '@/components/atoms/Label'
import FormField from '@/components/molecules/FormField'
import ApperIcon from '@/components/ApperIcon'

const statusOptions = [
  { value: 'Draft', label: 'Draft' },
  { value: 'Confirmed', label: 'Confirmed' },
  { value: 'Shipped', label: 'Shipped' },
  { value: 'Delivered', label: 'Delivered' },
  { value: 'Cancelled', label: 'Cancelled' }
]

export default function AddSalesOrderModal({
  isOpen,
  onClose,
  onSuccess,
  salesOrder = null,
  editMode = false,
  companies = []
}) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    Name: '',
    order_date_c: '',
    customer_id_c: '',
    total_amount_c: '',
    status_c: 'Draft',
    shipping_address_c: '',
    billing_address_c: '',
    notes_c: '',
    Tags: ''
  })

  useEffect(() => {
    if (editMode && salesOrder) {
      setFormData({
        Name: salesOrder.Name || '',
        order_date_c: salesOrder.order_date_c ? salesOrder.order_date_c.split('T')[0] : '',
        customer_id_c: salesOrder.customer_id_c?.Id || '',
        total_amount_c: salesOrder.total_amount_c || '',
        status_c: salesOrder.status_c || 'Draft',
        shipping_address_c: salesOrder.shipping_address_c || '',
        billing_address_c: salesOrder.billing_address_c || '',
        notes_c: salesOrder.notes_c || '',
        Tags: salesOrder.Tags || ''
      })
    } else {
      // Reset form for new sales order
      setFormData({
        Name: '',
        order_date_c: '',
        customer_id_c: '',
        total_amount_c: '',
        status_c: 'Draft',
        shipping_address_c: '',
        billing_address_c: '',
        notes_c: '',
        Tags: ''
      })
    }
  }, [editMode, salesOrder, isOpen])

  const companyOptions = companies.map(company => ({
    value: company.Id,
    label: company.Name
  }))

  function handleInputChange(field, value) {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (!formData.Name.trim()) {
      toast.error('Sales order name is required')
      return
    }

    if (!formData.customer_id_c) {
      toast.error('Customer is required')
      return
    }

    if (!formData.total_amount_c || isNaN(parseFloat(formData.total_amount_c))) {
      toast.error('Valid total amount is required')
      return
    }

    setLoading(true)

    try {
      const salesOrderData = {
        ...formData,
        customer_id_c: parseInt(formData.customer_id_c),
        total_amount_c: parseFloat(formData.total_amount_c),
        order_date_c: formData.order_date_c ? new Date(formData.order_date_c).toISOString() : null
      }

      if (editMode && salesOrder) {
        await salesOrderService.update(salesOrder.Id, salesOrderData)
      } else {
        await salesOrderService.create(salesOrderData)
      }

      onSuccess()
    } catch (error) {
      toast.error(editMode ? 'Failed to update sales order' : 'Failed to create sales order')
      console.error('Submit error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lifted w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {editMode ? 'Edit Sales Order' : 'New Sales Order'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Sales Order Name" required>
              <Input
                value={formData.Name}
                onChange={(e) => handleInputChange('Name', e.target.value)}
                placeholder="Enter sales order name"
                disabled={loading}
                required
              />
            </FormField>

            <FormField label="Customer" required>
              <Select
                value={formData.customer_id_c}
                onChange={(e) => handleInputChange('customer_id_c', e.target.value)}
                disabled={loading}
                required
              >
                <option value="">Select customer</option>
                {companyOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Order Date">
              <Input
                type="date"
                value={formData.order_date_c}
                onChange={(e) => handleInputChange('order_date_c', e.target.value)}
                disabled={loading}
              />
            </FormField>

            <FormField label="Total Amount" required>
              <Input
                type="number"
                step="0.01"
                value={formData.total_amount_c}
                onChange={(e) => handleInputChange('total_amount_c', e.target.value)}
                placeholder="0.00"
                disabled={loading}
                required
              />
            </FormField>

            <FormField label="Status">
              <Select
                value={formData.status_c}
                onChange={(e) => handleInputChange('status_c', e.target.value)}
                disabled={loading}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Tags">
              <Input
                value={formData.Tags}
                onChange={(e) => handleInputChange('Tags', e.target.value)}
                placeholder="Enter tags (comma-separated)"
                disabled={loading}
              />
            </FormField>
          </div>

          <div className="space-y-4">
            <FormField label="Shipping Address">
              <textarea
                value={formData.shipping_address_c}
                onChange={(e) => handleInputChange('shipping_address_c', e.target.value)}
                placeholder="Enter shipping address"
                disabled={loading}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </FormField>

            <FormField label="Billing Address">
              <textarea
                value={formData.billing_address_c}
                onChange={(e) => handleInputChange('billing_address_c', e.target.value)}
                placeholder="Enter billing address"
                disabled={loading}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </FormField>

            <FormField label="Notes">
              <textarea
                value={formData.notes_c}
                onChange={(e) => handleInputChange('notes_c', e.target.value)}
                placeholder="Enter any additional notes"
                disabled={loading}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </FormField>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
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
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {editMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                editMode ? 'Update Sales Order' : 'Create Sales Order'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}