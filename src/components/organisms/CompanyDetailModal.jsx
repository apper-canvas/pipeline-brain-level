import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const CompanyDetailModal = ({ isOpen, onClose, company, onEdit, onDelete }) => {
  if (!isOpen || !company) return null

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

// Format employees count
  const formatEmployees = (count) => {
    if (!count) return 'N/A'
    return new Intl.NumberFormat('en-US').format(count)
  }

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
<h2 className="text-xl font-semibold text-gray-900">
            {company.Name || company.name_c || 'Company Details'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-navy-500 mb-3">Company Information</h3>
              
              {(company.industry || company.industry_c) && (
                <div>
                  <span className="text-sm text-gray-500">Industry</span>
                  <div className="mt-1">
                    <span className="inline-block px-2 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                      {company.industry || company.industry_c}
                    </span>
                  </div>
                </div>
              )}

              <div>
<span className="text-sm text-gray-500">Created Date</span>
                <div className="mt-1 text-navy-500">{formatDate(company.CreatedOn || company.createdAt || company.created_date)}</div>
              </div>

              <div>
                <span className="text-sm text-gray-500">Employees</span>
                <div className="mt-1 text-navy-500 font-semibold">{formatEmployees(company.employees || company.employees_c)}</div>
              </div>

              <div>
                <span className="text-sm text-gray-500">Annual Revenue</span>
                <div className="mt-1 text-navy-500 font-semibold">{formatCurrency(company.revenue || company.revenue_c)}</div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-navy-500 mb-3">Contact Details</h3>
              
              {(company.email || company.email_c) && (
                <div className="flex items-center gap-3">
                  <ApperIcon name="Mail" className="w-4 h-4 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-500">Email</span>
                    <div className="text-navy-500">{company.email || company.email_c}</div>
                  </div>
                </div>
              )}

              {(company.phone || company.phone_c) && (
                <div className="flex items-center gap-3">
                  <ApperIcon name="Phone" className="w-4 h-4 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-500">Phone</span>
                    <div className="text-navy-500">{company.phone || company.phone_c}</div>
                  </div>
                </div>
              )}

              {(company.website || company.website_c) && (
                <div className="flex items-center gap-3">
                  <ApperIcon name="Globe" className="w-4 h-4 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-500">Website</span>
                    <div className="text-navy-500">
                      <a href={company.website || company.website_c} target="_blank" rel="noopener noreferrer" 
                         className="hover:text-coral-500 transition-colors">
                        {company.website || company.website_c}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {(company.address || company.address_c) && (
                <div className="flex items-start gap-3">
                  <ApperIcon name="MapPin" className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <span className="text-sm text-gray-500">Address</span>
                    <div className="text-navy-500">{company.address || company.address_c}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {(company.notes || company.notes_c) && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-navy-500 mb-3">Notes</h3>
              <div className="text-gray-700 bg-gray-50 p-4 rounded-lg">{company.notes || company.notes_c}</div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
            <Button onClick={() => onEdit(company)} className="flex-1">
              <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
              Edit Company
            </Button>
            <Button
              variant="outline"
              onClick={() => onDelete(company)}
              className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
            >
              <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
              Delete Company
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyDetailModal