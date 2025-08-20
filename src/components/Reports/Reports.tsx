import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Users,
  Download,
  Calendar,
  BarChart3,
  PieChart
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  LineChart,
  Line
} from 'recharts';

const Reports: React.FC = () => {
  const { state } = useAppContext();
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');

  // Calculate date range
  const getDateRange = () => {
    const end = new Date();
    const start = new Date();
    
    switch (dateRange) {
      case '7d':
        start.setDate(end.getDate() - 7);
        break;
      case '30d':
        start.setDate(end.getDate() - 30);
        break;
      case '90d':
        start.setDate(end.getDate() - 90);
        break;
      case '1y':
        start.setFullYear(end.getFullYear() - 1);
        break;
    }
    
    return { start, end };
  };

  // Calculate metrics
  const metrics = useMemo(() => {
    const { start, end } = getDateRange();
    
    const ordersInRange = state.orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= start && orderDate <= end;
    });

    const totalRevenue = ordersInRange.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = ordersInRange.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Product performance
    const productSales = new Map<string, { name: string; quantity: number; revenue: number }>();
    
    ordersInRange.forEach(order => {
      order.items.forEach(item => {
        const key = `${item.productId}-${item.variantId}`;
        const existing = productSales.get(key) || { name: item.productName, quantity: 0, revenue: 0 };
        existing.quantity += item.quantity;
        existing.revenue += item.total;
        productSales.set(key, existing);
      });
    });

    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Category performance
    const categoryStats = new Map<string, { revenue: number; orders: number }>();
    
    ordersInRange.forEach(order => {
      order.items.forEach(item => {
        const product = state.products.find(p => p.id === item.productId);
        if (product) {
          const category = state.categories.find(c => c.id === product.category)?.name || 'Diğer';
          const existing = categoryStats.get(category) || { revenue: 0, orders: 0 };
          existing.revenue += item.total;
          existing.orders += item.quantity;
          categoryStats.set(category, existing);
        }
      });
    });

    const categoryData = Array.from(categoryStats.entries()).map(([name, data]) => ({
      name,
      value: data.revenue,
      orders: data.orders
    }));

    // Daily sales trend
    const dailySales = new Map<string, { sales: number; orders: number }>();
    const currentDate = new Date(start);
    
    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0];
      dailySales.set(dateStr, { sales: 0, orders: 0 });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    ordersInRange.forEach(order => {
      const dateStr = new Date(order.createdAt).toISOString().split('T')[0];
      const existing = dailySales.get(dateStr) || { sales: 0, orders: 0 };
      existing.sales += order.total;
      existing.orders += 1;
      dailySales.set(dateStr, existing);
    });

    const salesTrend = Array.from(dailySales.entries())
      .map(([date, data]) => ({
        date: new Date(date).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' }),
        sales: data.sales,
        orders: data.orders
      }))
      .slice(-30); // Son 30 gün

    // Low stock products
    const lowStockProducts = state.products.filter(product =>
      product.variants.some(variant => variant.inventory <= variant.lowStockThreshold)
    );

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      topProducts,
      categoryData,
      salesTrend,
      lowStockProducts: lowStockProducts.length,
      totalProducts: state.products.length
    };
  }, [state.orders, state.products, state.categories, dateRange]);

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

  const exportData = () => {
    // Bu gerçek uygulamada CSV/PDF export olacak
    const data = {
      dateRange,
      metrics,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapor-${dateRange}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Raporlar & Analitik</h1>
          <p className="mt-1 text-sm text-gray-500">
            İşletmenizin performansını analiz edin
          </p>
        </div>
        
        <div className="flex space-x-3">
          {/* Date Range Selector */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
          >
            <option value="7d">Son 7 Gün</option>
            <option value="30d">Son 30 Gün</option>
            <option value="90d">Son 90 Gün</option>
            <option value="1y">Son 1 Yıl</option>
          </select>
          
          <button
            onClick={exportData}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Dışa Aktar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Genel Bakış', icon: BarChart3 },
            { id: 'products', name: 'Ürün Analizi', icon: Package },
            { id: 'orders', name: 'Sipariş Analizi', icon: ShoppingBag }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Toplam Gelir
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        ₺{metrics.totalRevenue.toFixed(2)}
                      </dd>
                    </dl>
                  </div>
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
                        Toplam Sipariş
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {metrics.totalOrders}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Ortalama Sipariş Değeri
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        ₺{metrics.averageOrderValue.toFixed(2)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Package className="h-6 w-6 text-orange-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Düşük Stok Uyarısı
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {metrics.lowStockProducts}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sales Trend Chart */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Satış Trendi</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.salesTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'sales' ? `₺${value}` : value,
                      name === 'sales' ? 'Satış' : 'Sipariş'
                    ]}
                  />
                  <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">En Çok Satan Ürünler</h2>
              <div className="space-y-3">
                {metrics.topProducts.slice(0, 5).map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {product.quantity} adet satıldı
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ₺{product.revenue.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Kategori Dağılımı</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Tooltip formatter={(value) => [`₺${value}`, 'Gelir']} />
                    <RechartsPieChart
                      data={metrics.categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {metrics.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </RechartsPieChart>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {metrics.categoryData.map((category, index) => (
                  <div key={category.name} className="flex items-center text-sm">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="truncate">{category.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Sipariş Durumu Dağılımı</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { status: 'Beklemede', count: state.orders.filter(o => o.status === 'pending').length },
                  { status: 'İşlemde', count: state.orders.filter(o => o.status === 'processing').length },
                  { status: 'Kargoda', count: state.orders.filter(o => o.status === 'shipped').length },
                  { status: 'Teslim Edildi', count: state.orders.filter(o => o.status === 'delivered').length },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
