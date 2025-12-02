import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';

const SalesOrderDetailModal = ({ isOpen, onClose, salesOrder }) => {
  if (!isOpen || !salesOrder) return null;

  const formatCurrency = (amount) => {
    if (amount == null) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTags = (tags) => {
    if (!tags) return 'N/A';
    return tags.split(',').map(tag => tag.trim()).join(', ');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Draft': { color: 'gray' },
      'Confirmed': { color: 'blue' },
      'Shipped': { color: 'yellow' },
      'Delivered': { color: 'green' },
      'Cancelled': { color: 'red' }
    };

    const config = statusConfig[status] || statusConfig['Draft'];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        {status || 'Draft'}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Sales Order Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <ApperIcon name="X" size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header Info */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {salesOrder.Name || `Order #${salesOrder.Id}`}
              </h3>
              <p className="text-sm text-gray-500">ID: {salesOrder.Id}</p>
            </div>
            <div className="text-right">
              {getStatusBadge(salesOrder.status_c)}
            </div>
          </div>
{/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Date
                </label>
                <p className="text-sm text-gray-900">
                  {formatDate(salesOrder.order_date_c)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Amount
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(salesOrder.total_amount_c)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <p className="text-sm text-gray-900">
                  {formatTags(salesOrder.Tags)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer
                </label>
                <p className="text-sm text-gray-900">
                  {salesOrder.customer_id_c?.Name || 'N/A'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner
                </label>
                <p className="text-sm text-gray-900">
                  {salesOrder.Owner?.Name || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="border-t pt-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Address Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shipping Address
                </label>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {salesOrder.shipping_address_c || 'No shipping address provided'}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Billing Address
                </label>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {salesOrder.billing_address_c || 'No billing address provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {salesOrder.notes_c && (
            <div className="border-t pt-6">
              <h4 className="text-md font-medium text-gray-900 mb-3">Notes</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                  {salesOrder.notes_c}
                </p>
              </div>
            </div>
          )}

          {/* System Information */}
          <div className="border-t pt-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">System Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Created On
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDateTime(salesOrder.CreatedOn)}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Created By
                  </label>
                  <p className="text-sm text-gray-900">
                    {salesOrder.CreatedBy?.Name || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Last Modified
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDateTime(salesOrder.ModifiedOn)}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Modified By
                  </label>
                  <p className="text-sm text-gray-900">
                    {salesOrder.ModifiedBy?.Name || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
{/* Order Summary */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <ApperIcon name="Info" size={16} className="text-blue-600 mt-0.5" />
              <div>
                <h5 className="text-sm font-medium text-blue-900">Order Summary</h5>
                <p className="text-xs text-blue-700 mt-1">
                  This sales order was created on {formatDate(salesOrder.order_date_c)}
                  {salesOrder.customer_id_c?.Name && ` for ${salesOrder.customer_id_c.Name}`}.
                  Current status: {salesOrder.status_c || 'Draft'}.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <Button
            onClick={onClose}
            variant="outline"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SalesOrderDetailModal;