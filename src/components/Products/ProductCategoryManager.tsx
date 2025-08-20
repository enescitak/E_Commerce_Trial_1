import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { Category } from '../../types';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Folder,
  FolderOpen,
  ChevronRight,
  Package
} from 'lucide-react';

const ProductCategoryManager: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Ana kategorileri getir
  const mainCategories = state.categories.filter(cat => !cat.parentId);
  
  // Alt kategorileri getir
  const getSubCategories = (parentId: string) => {
    return state.categories.filter(cat => cat.parentId === parentId);
  };

  // Arama filtresi
  const filteredCategories = mainCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpanded = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleDeleteCategory = (categoryId: string) => {
    // Alt kategorileri kontrol et
    const subCategories = getSubCategories(categoryId);
    if (subCategories.length > 0) {
      alert('Bu kategorinin alt kategorileri var. Önce alt kategorileri silin.');
      return;
    }

    // Ürünlerde kullanılıp kullanılmadığını kontrol et
    const productsInCategory = state.products.filter(product => 
      product.category === categoryId
    );
    
    if (productsInCategory.length > 0) {
      alert('Bu kategori ürünlerde kullanılıyor. Önce ürünleri başka kategoriye taşıyın.');
      return;
    }

    if (window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      dispatch({ type: 'DELETE_CATEGORY', payload: categoryId });
    }
  };

  const getStatusBadge = (status: Category['status']) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800'
    };
    
    const labels = {
      active: 'Aktif',
      inactive: 'Pasif'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const CategoryRow: React.FC<{ category: Category; level?: number }> = ({ category, level = 0 }) => {
    const subCategories = getSubCategories(category.id);
    const hasSubCategories = subCategories.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const productsInCategory = state.products.filter(p => p.category === category.id).length;

    return (
      <>
        <tr className="hover:bg-gray-50">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center" style={{ paddingLeft: `${level * 24}px` }}>
              {hasSubCategories ? (
                <button
                  onClick={() => toggleExpanded(category.id)}
                  className="mr-2 p-1 hover:bg-gray-200 rounded"
                >
                  <ChevronRight 
                    className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                  />
                </button>
              ) : (
                <div className="mr-2 w-6" />
              )}
              
              {level === 0 ? (
                <FolderOpen className="h-5 w-5 text-blue-500 mr-2" />
              ) : (
                <Folder className="h-5 w-5 text-gray-400 mr-2" />
              )}
              
              <div>
                <div className="text-sm font-medium text-gray-900">{category.name}</div>
                {category.description && (
                  <div className="text-sm text-gray-500">{category.description}</div>
                )}
              </div>
            </div>
          </td>
          
          <td className="px-6 py-4 whitespace-nowrap">
            {getStatusBadge(category.status)}
          </td>
          
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <div className="flex items-center">
              <Package className="h-4 w-4 mr-1" />
              {productsInCategory}
            </div>
          </td>
          
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {category.createdAt.toLocaleDateString('tr-TR')}
          </td>
          
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div className="flex items-center justify-end space-x-2">
              <Link
                to={`/products/categories/${category.id}/edit`}
                className="text-indigo-600 hover:text-indigo-900"
              >
                <Edit className="h-4 w-4" />
              </Link>
              <button
                onClick={() => handleDeleteCategory(category.id)}
                className="text-red-600 hover:text-red-900"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </td>
        </tr>
        
        {/* Alt Kategoriler */}
        {hasSubCategories && isExpanded && subCategories.map((subCategory) => (
          <CategoryRow key={subCategory.id} category={subCategory} level={level + 1} />
        ))}
      </>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kategori Yönetimi</h1>
          <p className="text-sm text-gray-500">
            Ürün kategorilerini yönetin ve organize edin
          </p>
        </div>
        <Link
          to="/products/categories/new"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Yeni Kategori
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Kategori ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category Table */}
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ürün Sayısı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Oluşturma Tarihi
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <Folder className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Kategori bulunamadı</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {searchTerm ? 'Arama kriterlerinize uygun kategori bulunamadı.' : 'Henüz kategori eklenmemiş.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <CategoryRow key={category.id} category={category} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FolderOpen className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Toplam Kategori
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {state.categories.length}
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
                <Folder className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Ana Kategori
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {mainCategories.length}
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
                <Package className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Aktif Kategori
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {state.categories.filter(c => c.status === 'active').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCategoryManager;
