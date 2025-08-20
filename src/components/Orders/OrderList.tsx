import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Order } from '../../types';
import { 
  Search, 
  Filter, 
  Eye, 
  Truck, 
  CheckCircle, 
  XCircle,
  ArrowUpDown,
  Calendar,
  User,
  CreditCard
} from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderList: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'total' | 'customer'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredOrders = state.orders
    .filter(order => {
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'total':
          comparison = a.total - b.total;
          break;
        case 'customer':
          comparison = a.customerName.localeCompare(b.customerName);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const getStatusBadge = (status: Order['status']) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      returned: 'bg-gray-100 text-gray-800'
    };

    const labels = {
      pending: 'Beklemede',
      processing: 'İşlemde',
      shipped: 'Kargoda',
      delivered: 'Teslim Edildi',
      cancelled: 'İptal',
      returned: 'İade'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const order = state.orders.find(o => o.id === orderId);
    if (order) {
      const updatedOrder = { ...order, status: newStatus, updatedAt: new Date() };
      dispatch({ type: 'UPDATE_ORDER', payload: updatedOrder });
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Siparişler</h1>
          <p className="mt-1 text-sm text-gray-500">
            {filteredOrders.length} sipariş görüntüleniyor
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Sipariş no, müşteri ara..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tüm Durumlar</option>
            <option value="pending">Beklemede</option>
            <option value="processing">İşlemde</option>
            <option value="shipped">Kargoda</option>
            <option value="delivered">Teslim Edildi</option>
            <option value="cancelled">İptal</option>
            <option value="returned">İade</option>
          </select>

          {/* Sort By */}
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="date">Tarihe Göre</option>
            <option value="total">Tutara Göre</option>
            <option value="customer">Müşteriye Göre</option>
          </select>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            {sortOrder === 'asc' ? 'Artan' : 'Azalan'}
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredOrders.map((order) => (
            <li key={order.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Order Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-sm font-medium text-gray-900">
                          #{order.orderNumber}
                        </h3>
                        {getStatusBadge(order.status)}
                      </div>
                      
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          <div>
                            <div className="font-medium text-gray-900">{order.customerName}</div>
                            <div>{order.customerEmail}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                            </div>
                            <div>{new Date(order.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2" />
                          <div>
                            <div className="font-medium text-gray-900">₺{order.total.toFixed(2)}</div>
                            <div>{order.items.length} ürün</div>
                          </div>
                        </div>
                      </div>

                      {/* Order Items Preview */}
                      <div className="mt-2">
                        <div className="text-sm text-gray-600">
                          {order.items.slice(0, 3).map((item, index) => (
                            <span key={item.id}>
                              {item.productName} ({item.quantity}x)
                              {index < Math.min(order.items.length, 3) - 1 && ', '}
                            </span>
                          ))}
                          {order.items.length > 3 && (
                            <span className="text-gray-500"> ve {order.items.length - 3} ürün daha...</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {/* Quick Status Updates */}
                    <div className="flex space-x-1">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'processing')}
                          className="text-blue-600 hover:text-blue-800 text-xs bg-blue-50 px-2 py-1 rounded"
                          title="İşleme Al"
                        >
                          İşleme Al
                        </button>
                      )}
                      
                      {order.status === 'processing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'shipped')}
                          className="text-purple-600 hover:text-purple-800 text-xs bg-purple-50 px-2 py-1 rounded flex items-center"
                          title="Kargoya Ver"
                        >
                          <Truck className="h-3 w-3 mr-1" />
                          Kargoya Ver
                        </button>
                      )}
                      
                      {order.status === 'shipped' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="text-green-600 hover:text-green-800 text-xs bg-green-50 px-2 py-1 rounded flex items-center"
                          title="Teslim Et"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Teslim Et
                        </button>
                      )}
                    </div>

                    {/* View Details */}
                    <Link
                      to={`/orders/${order.id}`}
                      className="text-gray-400 hover:text-gray-600"
                      title="Detayları Görüntüle"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="mx-auto h-12 w-12" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Sipariş bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500">
              Arama kriterlerinize uygun sipariş bulunamadı.
            </p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['pending', 'processing', 'shipped', 'delivered'].map(status => {
          const count = state.orders.filter(order => order.status === status).length;
          const labels = {
            pending: 'Beklemede',
            processing: 'İşlemde', 
            shipped: 'Kargoda',
            delivered: 'Teslim Edildi'
          };
          
          return (
            <div key={status} className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {getStatusIcon(status as Order['status'])}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">
                    {labels[status as keyof typeof labels]}
                  </p>
                  <p className="text-lg font-semibold text-gray-900">{count}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderList;
