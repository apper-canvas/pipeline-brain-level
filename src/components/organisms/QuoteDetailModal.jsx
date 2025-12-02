import { formatDistanceToNow } from "date-fns";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

function QuoteDetailModal({ isOpen, onClose, quote, onEdit }) {
  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0)
  }

function getStatusColor(status) {
    const colors = {
      'Draft': 'text-gray-600 bg-gray-100',
      'Pending': 'text-yellow-700 bg-yellow-100',
      'Approved': 'text-green-700 bg-green-100',
      'Rejected': 'text-red-700 bg-red-100'
    };
    return colors[status] || colors['Draft'];
  }

  if (!isOpen || !quote) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Quote #{quote.quote_number_c}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name="X" className="w-6 h-6" />
            </button>
          </div>
            
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <p className="mt-1 text-sm text-gray-900">{quote.title_c}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <p className="mt-1 text-sm text-gray-900">{quote.company_c?.Name || quote.company_c}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact</label>
              <p className="mt-1 text-sm text-gray-900">{quote.contact_c?.Name || quote.contact_c}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Total Amount</label>
              <p className="mt-1 text-lg font-semibold text-navy-600">
                ${(quote.total_amount_c || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Valid Until</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(quote.valid_until_c).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <Badge 
                className={
                  quote.status_c === 'Approved' ? 'bg-green-100 text-green-800' :
                  quote.status_c === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }
              >
                {quote.status_c}
              </Badge>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <p className="text-sm text-gray-900">{quote.description_c}</p>
          </div>

          {/* Quote Items */}
          {quote.items && quote.items.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-navy-500 mb-4">Quote Items</h3>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {quote.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{item.description}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="text-sm text-gray-900">{item.quantity}</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="text-sm text-gray-900">{formatCurrency(item.unitPrice)}</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="text-sm font-medium text-gray-900">{formatCurrency(item.total)}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Quote Summary */}
          {(quote.subtotal || quote.taxAmount || quote.total) && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-navy-500 mb-4">Quote Summary</h3>
              <div className="space-y-3">
                {quote.subtotal && (
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(quote.subtotal)}</span>
                  </div>
                )}
                {quote.taxRate && quote.taxAmount && (
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Tax ({(quote.taxRate * 100).toFixed(2)}%):</span>
                    <span className="font-medium text-gray-900">{formatCurrency(quote.taxAmount)}</span>
                  </div>
                )}
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between text-xl">
                    <span className="font-medium text-navy-500">Total:</span>
                    <span className="font-bold text-navy-600">{formatCurrency(quote.total || quote.total_amount_c)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {quote.notes && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-navy-500 mb-3">Notes</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{quote.notes}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {onEdit && (
              <Button
                onClick={onEdit}
                className="bg-coral-500 hover:bg-coral-600 text-white"
              >
                <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
                Edit Quote
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuoteDetailModal