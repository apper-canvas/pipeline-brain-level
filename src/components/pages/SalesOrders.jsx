import React, { useEffect, useState } from 'react'
import { salesOrderService } from '@/services/api/salesOrderService'
import { getAll as getAllCompanies } from '@/services/api/companyService'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import ErrorView from '@/components/ui/ErrorView'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import AddSalesOrderModal from '@/components/organisms/AddSalesOrderModal'
import SalesOrderDetailModal from '@/components/organisms/SalesOrderDetailModal'
import SearchBar from '@/components/molecules/SearchBar'

export default function SalesOrders() {
  const [salesOrders, setSalesOrders] = useState([])
  const [filteredSalesOrders, setFilteredSalesOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [companies, setCompanies] = useState([])
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedSalesOrder, setSelectedSalesOrder] = useState(null)
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    loadSalesOrders()
    loadCompanies()
  }, [])

  async function loadSalesOrders() {
    try {
      setLoading(true)
      setError(null)
      const data = await salesOrderService.getAll()
      setSalesOrders(data)
      setFilteredSalesOrders(data)
    } catch (err) {
      setError(err.message)
      setSalesOrders([])
      setFilteredSalesOrders([])
    } finally {
      setLoading(false)
    }
  }

  async function loadCompanies() {
    try {
      const companyData = await getAllCompanies()
      setCompanies(companyData)
    } catch (err) {
      console.error('Error loading companies:', err)
    }
  }

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

  function handleSearch(query) {
    if (!query.trim()) {
      setFilteredSalesOrders(salesOrders)
      return
    }

    const filtered = salesOrders.filter(order =>
      order.Name?.toLowerCase().includes(query.toLowerCase()) ||
      order.customer_id_c?.Name?.toLowerCase().includes(query.toLowerCase()) ||
      order.status_c?.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredSalesOrders(filtered)
  }

  function handleAddSalesOrder() {
    setSelectedSalesOrder(null)
    setEditMode(false)
    setIsAddModalOpen(true)
  }

  function handleEditSalesOrder(salesOrder) {
    setSelectedSalesOrder(salesOrder)
    setEditMode(true)
    setIsAddModalOpen(true)
  }

  function handleViewSalesOrder(salesOrder) {
    setSelectedSalesOrder(salesOrder)
    setIsDetailModalOpen(true)
  }

  async function handleDeleteSalesOrder(salesOrderId) {
    if (!window.confirm('Are you sure you want to delete this sales order?')) {
      return
    }

    try {
      await salesOrderService.delete(salesOrderId)
      toast.success('Sales order deleted successfully')
      await loadSalesOrders()
    } catch (error) {
      toast.error('Failed to delete sales order')
      console.error('Delete error:', error)
    }
  }

  async function handleSuccess() {
    setIsAddModalOpen(false)
    setIsDetailModalOpen(false)
    setSelectedSalesOrder(null)
    setEditMode(false)
    await loadSalesOrders()
    toast.success(editMode ? 'Sales order updated successfully' : 'Sales order created successfully')
  }

  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadSalesOrders} />

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Orders</h1>
          <p className="text-gray-600 mt-1">Manage your sales orders and track deliveries</p>
        </div>
        <Button onClick={handleAddSalesOrder} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          New Sales Order
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchBar
          placeholder="Search sales orders..."
          onSearch={handleSearch}
        />
      </div>

      {/* Sales Orders List */}
      {filteredSalesOrders.length === 0 ? (
        <Empty
          title="No sales orders found"
          description="Create your first sales order to get started"
          actionLabel="New Sales Order"
          onAction={handleAddSalesOrder}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Order</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Customer</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Order Date</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Total Amount</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Created</th>
                  <th className="text-right py-3 px-6 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSalesOrders.map((order) => (
                  <tr key={order.Id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium text-gray-900">{order.Name}</div>
                        {order.Tags && (
                          <div className="flex gap-1 mt-1">
                            {order.Tags.split(',').slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" size="sm">
                                {tag.trim()}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-900">
                        {order.customer_id_c?.Name || 'No Customer'}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-900">
                        {order.order_date_c ? new Date(order.order_date_c).toLocaleDateString() : 'Not set'}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">
                        {formatCurrency(order.total_amount_c)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge className={getStatusColor(order.status_c)} size="sm">
                        {order.status_c || 'Draft'}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {order.CreatedOn ? formatDistanceToNow(new Date(order.CreatedOn), { addSuffix: true }) : 'Unknown'}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewSalesOrder(order)}
                          className="text-gray-600 hover:text-gray-900 p-1"
                          title="View details"
                        >
                          <ApperIcon name="Eye" size={16} />
                        </button>
                        <button
                          onClick={() => handleEditSalesOrder(order)}
                          className="text-gray-600 hover:text-gray-900 p-1"
                          title="Edit"
                        >
                          <ApperIcon name="Pencil" size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteSalesOrder(order.Id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {isAddModalOpen && (
        <AddSalesOrderModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={handleSuccess}
          salesOrder={selectedSalesOrder}
          editMode={editMode}
          companies={companies}
        />
      )}

      {isDetailModalOpen && selectedSalesOrder && (
        <SalesOrderDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          salesOrder={selectedSalesOrder}
          onEdit={handleEditSalesOrder}
          onDelete={handleDeleteSalesOrder}
        />
      )}
    </div>
  )
}