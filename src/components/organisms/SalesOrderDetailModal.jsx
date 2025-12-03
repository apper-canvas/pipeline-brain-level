import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

export default function SalesOrderDetailModal({
  isOpen,
  onClose,
  salesOrder,
  onEdit,
  onDelete
}) {
  if (!isOpen || !salesOrder) return null

  function formatCurrency(amount) {
    if (!amount) return '$0.00'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  function getStatusColor(status) {
    switch (status?.toLowerCase()) {
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-orange-100 text-orange-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  function handleDelete() {
    onDelete(salesOrder.Id)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lifted w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{salesOrder.Name}</h2>
            <p className="text-gray-600 text-sm mt-1">Sales Order Details</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status and Basic Info */}
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(salesOrder.status_c)} size="lg">
              {salesOrder.status_c || 'Draft'}
            </Badge>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(salesOrder.total_amount_c)}
              </div>
              <div className="text-sm text-gray-600">Total Amount</div>
            </div>
          </div>

          {/* Customer and Date Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Customer</h3>
              <div className="text-gray-900">
                {salesOrder.customer_id_c?.Name || 'No Customer'}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Order Date</h3>
              <div className="text-gray-900">
                {salesOrder.order_date_c 
                  ? new Date(salesOrder.order_date_c).toLocaleDateString() 
                  : 'Not set'
                }
              </div>
            </div>
          </div>

          {/* Addresses */}
          {(salesOrder.shipping_address_c || salesOrder.billing_address_c) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {salesOrder.shipping_address_c && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Shipping Address</h3>
                  <div className="text-gray-900 whitespace-pre-wrap">
                    {salesOrder.shipping_address_c}
                  </div>
                </div>
              )}
              {salesOrder.billing_address_c && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Billing Address</h3>
                  <div className="text-gray-900 whitespace-pre-wrap">
                    {salesOrder.billing_address_c}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          {salesOrder.notes_c && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Notes</h3>
              <div className="text-gray-900 bg-gray-50 p-3 rounded-md whitespace-pre-wrap">
                {salesOrder.notes_c}
              </div>
            </div>
          )}

          {/* Tags */}
          {salesOrder.Tags && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {salesOrder.Tags.split(',').map((tag, index) => (
                  <Badge key={index} variant="outline" size="sm">
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* System Info */}
          <div className="pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Created:</span>{' '}
                {salesOrder.CreatedOn 
                  ? formatDistanceToNow(new Date(salesOrder.CreatedOn), { addSuffix: true })
                  : 'Unknown'
                }
              </div>
              <div>
                <span className="font-medium">Modified:</span>{' '}
                {salesOrder.ModifiedOn 
                  ? formatDistanceToNow(new Date(salesOrder.ModifiedOn), { addSuffix: true })
                  : 'Never'
                }
              </div>
              {salesOrder.CreatedBy?.Name && (
                <div>
                  <span className="font-medium">Created by:</span>{' '}
                  {salesOrder.CreatedBy.Name}
                </div>
              )}
              {salesOrder.ModifiedBy?.Name && (
                <div>
                  <span className="font-medium">Modified by:</span>{' '}
                  {salesOrder.ModifiedBy.Name}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <Button
            variant="outline"
            onClick={handleDelete}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <ApperIcon name="Trash2" size={16} className="mr-2" />
            Delete
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => onEdit(salesOrder)}>
              <ApperIcon name="Pencil" size={16} className="mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}