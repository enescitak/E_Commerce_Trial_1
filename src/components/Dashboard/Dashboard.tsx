import React, { useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  AlertTriangle, 
  Plus,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    // Calculate dashboard stats
    const today = new Date();
    const todayOrders = state.orders.filter(order => 
      new Date(order.createdAt).toDateString() === today.toDateString()
    );

    const todaySales = todayOrders.reduce((sum, order) => sum + order.total, 0);

    const lowStockProducts = state.products.filter(product =>
      product.variants.some(variant => variant.inventory <= variant.lowStockThreshold)
    );

    const recentOrders = [...state.orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    // Mock top selling products - in real app, this would come from analytics
    const topSellingProducts = [
      {
        productId: '1',
        productName: 'Kış Kazağı',
        variantName: 'Siyah - S',
        quantitySold: 15,
        revenue: 4499.85,
        image: '/api/placeholder/50/50'
      },
      {
        productId: '2',
        productName: 'Denim Pantolon',
        variantName: 'Mavi - 28',
        quantitySold: 8,
        revenue: 1599.92,
        image: '/api/placeholder/50/50'
      }
    ];

    // Mock sales chart data
    const salesChart = [
      { date: '2024-01-15', sales: 1200, orders: 5 },
      { date: '2024-01-16', sales: 800, orders: 3 },
      { date: '2024-01-17', sales: 1500, orders: 7 },
      { date: '2024-01-18', sales: 2100, orders: 9 },
      { date: '2024-01-19', sales: 1800, orders: 6 },
      { date: '2024-01-20', sales: todaySales, orders: todayOrders.length },
    ];

    const dashboardStats = {
      todaySales,
      todayOrders: todayOrders.length,
      lowStockProducts: lowStockProducts.length,
      totalProducts: state.products.length,
      recentOrders,
      topSellingProducts,
      salesChart
    };

    dispatch({ type: 'SET_DASHBOARD_STATS', payload: dashboardStats });
  }, [state.orders, state.products, dispatch]);

  if (!state.dashboardStats) {
    return <div>Yükleniyor...</div>;
  }

  const stats = state.dashboardStats;

  const getOrderStatusBadge = (status: string) => {
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
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Mağazanızın genel durumuna göz atın
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/products/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Yeni Ürün
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Bugünkü Satışlar
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ₺{stats.todaySales.toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-green-600 font-medium flex items-center">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                12%
              </span>
              <span className="text-gray-500 ml-2">önceki güne göre</span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingBag className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Bugünkü Siparişler
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.todayOrders}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-blue-600 font-medium flex items-center">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                8%
              </span>
              <span className="text-gray-500 ml-2">önceki güne göre</span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Toplam Ürünler
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalProducts}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/products" className="text-purple-600 hover:text-purple-500 font-medium">
                Ürünleri Görüntüle
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className={`h-6 w-6 ${stats.lowStockProducts > 0 ? 'text-orange-400' : 'text-gray-400'}`} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Düşük Stok Uyarıları
                  </dt>
                  <dd className={`text-lg font-medium ${stats.lowStockProducts > 0 ? 'text-orange-600' : 'text-gray-900'}`}>
                    {stats.lowStockProducts}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              {stats.lowStockProducts > 0 ? (
                <Link to="/products?filter=low-stock" className="text-orange-600 hover:text-orange-500 font-medium">
                  Stokları Kontrol Et
                </Link>
              ) : (
                <span className="text-gray-500">Tüm stoklar yeterli</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Hızlı İşlemler</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/products/new"
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Plus className="h-8 w-8 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Yeni Ürün</span>
          </Link>
          
          <Link
            to="/orders"
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ShoppingBag className="h-8 w-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Siparişleri Görüntüle</span>
          </Link>
          
          <Link
            to="/products"
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Package className="h-8 w-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Stok Yönetimi</span>
          </Link>
          
          <Link
            to="/reports"
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Raporlar</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Son Siparişler</h2>
              <Link
                to="/orders"
                className="text-sm text-primary-600 hover:text-primary-500 font-medium"
              >
                Tümünü Görüntüle
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        #{order.orderNumber}
                      </p>
                      {getOrderStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {order.customerName} • ₺{order.total.toFixed(2)}
                    </p>
                  </div>
                  <Link
                    to={`/orders/${order.id}`}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">En Çok Satılan Ürünler</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {stats.topSellingProducts.map((product) => (
              <div key={product.productId} className="px-6 py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-lg object-cover"
                      src={product.image}
                      alt={product.productName}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.productName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {product.variantName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {product.quantitySold} adet
                    </p>
                    <p className="text-sm text-gray-500">
                      ₺{product.revenue.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
