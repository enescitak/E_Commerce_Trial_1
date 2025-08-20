import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Product } from '../../types';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  MoreVertical,
  AlertTriangle,
  Package
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductList: React.FC = () => {
  const { state } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'draft'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredProducts = state.products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getLowStockVariants = (product: Product) => {
    return product.variants.filter(variant => variant.inventory <= variant.lowStockThreshold);
  };

  const getTotalStock = (product: Product) => {
    return product.variants.reduce((total, variant) => total + variant.inventory, 0);
  };

  const getStatusBadge = (status: Product['status']) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      draft: 'bg-yellow-100 text-yellow-800'
    };
    
    const labels = {
      active: 'Aktif',
      inactive: 'Pasif',
      draft: 'Taslak'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ürünler</h1>
          <p className="mt-1 text-sm text-gray-500">
            {filteredProducts.length} ürün görüntüleniyor
          </p>
        </div>
        <Link
          to="/products/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Yeni Ürün
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Ürün adı veya SKU ara..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">Tüm Durumlar</option>
            <option value="active">Aktif</option>
            <option value="inactive">Pasif</option>
            <option value="draft">Taslak</option>
          </select>

          {/* Category Filter */}
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Tüm Kategoriler</option>
            {state.categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredProducts.map((product) => {
            const lowStockVariants = getLowStockVariants(product);
            const totalStock = getTotalStock(product);
            
            return (
              <li key={product.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        {product.images.length > 0 ? (
                          <img
                            className="h-16 w-16 rounded-lg object-cover"
                            src={product.images[0]}
                            alt={product.name}
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center">
                            <Package className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </h3>
                          {getStatusBadge(product.status)}
                          {lowStockVariants.length > 0 && (
                            <span className="inline-flex items-center text-xs text-orange-600">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Düşük Stok
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          <span>SKU: {product.sku}</span>
                          <span>•</span>
                          <span>{totalStock} adet stok</span>
                          <span>•</span>
                          <span>{product.variants.length} varyant</span>
                        </div>
                        <div className="mt-1 text-sm text-gray-900">
                          ₺{product.price.toFixed(2)}
                          {product.compareAtPrice && (
                            <span className="ml-2 text-gray-500 line-through">
                              ₺{product.compareAtPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/products/${product.id}`}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/products/${product.id}/edit`}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button className="text-gray-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Low Stock Warning */}
                  {lowStockVariants.length > 0 && (
                    <div className="mt-3 bg-orange-50 border border-orange-200 rounded-md p-3">
                      <div className="flex">
                        <AlertTriangle className="h-5 w-5 text-orange-400" />
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-orange-800">
                            Düşük Stok Uyarısı
                          </h4>
                          <div className="mt-1 text-sm text-orange-700">
                            {lowStockVariants.map((variant, index) => (
                              <span key={variant.id}>
                                {variant.name} ({variant.inventory} adet)
                                {index < lowStockVariants.length - 1 && ', '}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Ürün bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500">
              Arama kriterlerinize uygun ürün bulunamadı.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
