import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import Empty from '@/components/ui/Empty';
import ErrorView from '@/components/ui/ErrorView';
import AddSalesOrderModal from '@/components/organisms/AddSalesOrderModal';
import SalesOrderDetailModal from '@/components/organisms/SalesOrderDetailModal';
import salesOrderService from '@/services/api/salesOrderService';

const SalesOrders = () => {
  const [salesOrders, setSalesOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadSalesOrders();
  }, []);

  const loadSalesOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await salesOrderService.getAll();
      setSalesOrders(data || []);
    } catch (err) {
      setError(err.message);
      setSalesOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrder = async (orderData) => {
    try {
      await salesOrderService.create(orderData);
      toast.success('Sales order created successfully');
      setShowAddModal(false);
      loadSalesOrders();
    } catch (err) {
      toast.error(err.message || 'Failed to create sales order');
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleDeleteOrder = async (order) => {
    if (window.confirm(`Are you sure you want to delete "${order.Name}"?`)) {
      try {
        await salesOrderService.delete(order.Id);
        toast.success('Sales order deleted successfully');
        loadSalesOrders();
      } catch (err) {
        toast.error(err.message || 'Failed to delete sales order');
      }
    }
  };

  const filteredOrders = salesOrders.filter(order =>
    order?.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order?.company_id_c?.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order?.contact_id_c?.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order?.status_c?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount) => {
    if (amount == null) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'Draft': 'bg-gray-100 text-gray-800',
      'Confirmed': 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };

    const colorClass = statusColors[status] || 'bg-gray-100 text-gray-800';

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}>
        {status || 'Draft'}
      </span>
    );
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadSalesOrders} />;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Orders</h1>
          <p className="text-gray-600">Manage your sales orders and track their progress</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          New Sales Order
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Input
            type="text"
            placeholder="Search sales orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <ApperIcon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      {/* Content */}
      {filteredOrders.length === 0 ? (
        <Empty 
          title="No sales orders found"
          description={searchTerm ? "No sales orders match your search criteria." : "Get started by creating your first sales order."}
          action={{
            label: "Create Sales Order",
            onClick: () => setShowAddModal(true)
          }}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.Id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.Name || `Order #${order.Id}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.company_id_c?.Name || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.contact_id_c?.Name || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(order.order_date_c)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(order.total_amount_c)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status_c)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="text-navy-600 hover:text-navy-800 p-1"
                          title="View Details"
                        >
                          <ApperIcon name="Eye" size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order)}
                          className="text-red-600 hover:text-red-800 p-1"
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
      {showAddModal && (
        <AddSalesOrderModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddOrder}
        />
      )}

      {showDetailModal && selectedOrder && (
        <SalesOrderDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          salesOrder={selectedOrder}
        />
      )}
    </div>
  );
};

export default SalesOrders;