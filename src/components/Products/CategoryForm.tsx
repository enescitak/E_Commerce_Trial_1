import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { Category } from '../../types';
import { 
  Save, 
  ArrowLeft
} from 'lucide-react';

interface CategoryFormProps {
  mode: 'create' | 'edit';
}

const CategoryForm: React.FC<CategoryFormProps> = ({ mode }) => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams();

  const [category, setCategory] = useState<Omit<Category, 'id' | 'createdAt'>>({
    name: '',
    description: '',
    parentId: '',
    status: 'active'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === 'edit' && id) {
      const existingCategory = state.categories.find(c => c.id === id);
      if (existingCategory) {
        setCategory({
          name: existingCategory.name,
          description: existingCategory.description || '',
          parentId: existingCategory.parentId || '',
          status: existingCategory.status
        });
      }
    }
  }, [mode, id, state.categories]);

  // Ana kategorileri getir (parentId olmayan)
  const mainCategories = state.categories.filter(cat => !cat.parentId);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!category.name.trim()) {
      newErrors.name = 'Kategori adı gereklidir';
    }

    // Aynı isimde kategori kontrolü
    const existingCategory = state.categories.find(cat => 
      cat.name.toLowerCase() === category.name.toLowerCase() && 
      cat.id !== id
    );
    
    if (existingCategory) {
      newErrors.name = 'Bu isimde bir kategori zaten mevcut';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const now = new Date();
    
    if (mode === 'create') {
      const newCategory: Category = {
        ...category,
        id: Date.now().toString(),
        createdAt: now
      };
      dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
    } else if (mode === 'edit' && id) {
      const updatedCategory: Category = {
        ...category,
        id,
        createdAt: state.categories.find(c => c.id === id)?.createdAt || now
      };
      dispatch({ type: 'UPDATE_CATEGORY', payload: updatedCategory });
    }

    navigate('/products/categories');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/products/categories')}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {mode === 'create' ? 'Yeni Kategori' : 'Kategoriyi Düzenle'}
            </h1>
            <p className="text-sm text-gray-500">
              {mode === 'create' ? 'Yeni bir kategori oluşturun' : 'Kategori bilgilerini güncelleyin'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Kategori Bilgileri</h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Kategori Adı */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori Adı *
            </label>
            <input
              type="text"
              value={category.name}
              onChange={(e) => setCategory(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Örn: Kadın Giyim, Erkek Ayakkabı"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Ana Kategori */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ana Kategori
            </label>
            <select
              value={category.parentId}
              onChange={(e) => setCategory(prev => ({ ...prev, parentId: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Ana Kategori (Üst düzey)</option>
              {mainCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Boş bırakırsanız ana kategori olarak oluşturulur
            </p>
          </div>

          {/* Açıklama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama
            </label>
            <textarea
              value={category.description}
              onChange={(e) => setCategory(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Kategori hakkında kısa bir açıklama..."
            />
          </div>

          {/* Durum */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durum
            </label>
            <select
              value={category.status}
              onChange={(e) => setCategory(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="active">Aktif</option>
              <option value="inactive">Pasif</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/products/categories')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            İptal
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {mode === 'create' ? 'Kategoriyi Oluştur' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
