import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Product, ProductVariant, VariantAttribute } from '../../types';
import { 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Upload, 
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface ProductFormProps {
  mode: 'create' | 'edit';
}

const ProductForm: React.FC<ProductFormProps> = ({ mode }) => {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [product, setProduct] = useState<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    category: '',
    price: 0,
    compareAtPrice: 0,
    sku: '',
    status: 'draft',
    images: [],
    variants: [],
    tags: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && id) {
      const existingProduct = state.products.find(p => p.id === id);
      if (existingProduct) {
        setProduct({
          name: existingProduct.name,
          description: existingProduct.description,
          category: existingProduct.category,
          price: existingProduct.price,
          compareAtPrice: existingProduct.compareAtPrice,
          sku: existingProduct.sku,
          status: existingProduct.status,
          images: existingProduct.images,
          variants: existingProduct.variants,
          tags: existingProduct.tags
        });
      }
    }
  }, [mode, id, state.products]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!product.name.trim()) {
      newErrors.name = 'Ürün adı gereklidir';
    }

    if (!product.sku.trim()) {
      newErrors.sku = 'SKU gereklidir';
    }

    if (product.price <= 0) {
      newErrors.price = 'Fiyat 0\'dan büyük olmalıdır';
    }

    if (!product.category) {
      newErrors.category = 'Kategori seçilmelidir';
    }

    if (product.variants.length === 0) {
      newErrors.variants = 'En az bir varyant eklemelisiniz';
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
      const newProduct: Product = {
        ...product,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now
      };
      dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
    } else if (mode === 'edit' && id) {
      const updatedProduct: Product = {
        ...product,
        id,
        createdAt: state.products.find(p => p.id === id)?.createdAt || now,
        updatedAt: now
      };
      dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
    }

    navigate('/products');
  };

  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: Date.now().toString(),
      productId: id || 'new',
      name: '',
      sku: '',
      inventory: 0,
      lowStockThreshold: 5,
      attributes: [],
      status: 'active'
    };

    setProduct(prev => ({
      ...prev,
      variants: [...prev.variants, newVariant]
    }));
  };

  const updateVariant = (index: number, updatedVariant: ProductVariant) => {
    setProduct(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => i === index ? updatedVariant : variant)
    }));
  };

  const removeVariant = (index: number) => {
    setProduct(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      // Simulating file upload - in real app, upload to server
      const fileUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setProduct(prev => ({
        ...prev,
        images: [...prev.images, ...fileUrls]
      }));
    }
  };

  const removeImage = (index: number) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const generateVariantName = (attributes: VariantAttribute[]) => {
    return attributes.map(attr => attr.value).join(' - ');
  };

  const generateVariantSKU = (attributes: VariantAttribute[]) => {
    const basesku = product.sku || 'SKU';
    const attrCodes = attributes.map(attr => 
      attr.value.substring(0, 2).toUpperCase()
    ).join('-');
    return `${basesku}-${attrCodes}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? 'Yeni Ürün' : 'Ürünü Düzenle'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {mode === 'create' ? 'Yeni bir ürün oluşturun' : 'Mevcut ürünü düzenleyin'}
          </p>
        </div>
        <button
          onClick={() => navigate('/products')}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Temel Bilgiler</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ürün Adı *
              </label>
              <input
                type="text"
                className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                value={product.name}
                onChange={(e) => setProduct(prev => ({ ...prev, name: e.target.value }))}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                SKU *
              </label>
              <input
                type="text"
                className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.sku ? 'border-red-300' : 'border-gray-300'
                }`}
                value={product.sku}
                onChange={(e) => setProduct(prev => ({ ...prev, sku: e.target.value }))}
              />
              {errors.sku && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.sku}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Açıklama
              </label>
              <textarea
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={product.description}
                onChange={(e) => setProduct(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Kategori *
              </label>
              <select
                className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                }`}
                value={product.category}
                onChange={(e) => setProduct(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="">Kategori Seçin</option>
                {state.categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.category}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Durum
              </label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={product.status}
                onChange={(e) => setProduct(prev => ({ ...prev, status: e.target.value as Product['status'] }))}
              >
                <option value="draft">Taslak</option>
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fiyat (₺) *
              </label>
              <input
                type="number"
                step="0.01"
                className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.price ? 'border-red-300' : 'border-gray-300'
                }`}
                value={product.price}
                onChange={(e) => setProduct(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.price}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Karşılaştırma Fiyatı (₺)
              </label>
              <input
                type="number"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={product.compareAtPrice || ''}
                onChange={(e) => setProduct(prev => ({ ...prev, compareAtPrice: parseFloat(e.target.value) || undefined }))}
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Ürün Görselleri</h2>
          
          {/* Image Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
            }`}
            onDragEnter={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragActive(false);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              handleImageUpload(e.dataTransfer.files);
            }}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label className="cursor-pointer">
                <span className="text-primary-600 hover:text-primary-500">Dosya seçin</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e.target.files)}
                />
              </label>
              <span className="text-gray-500"> veya buraya sürükleyip bırakın</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              PNG, JPG, GIF dosyaları kabul edilir
            </p>
          </div>

          {/* Image Preview */}
          {product.images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Ürün ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Variants */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Ürün Varyantları</h2>
            <button
              type="button"
              onClick={addVariant}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
            >
              <Plus className="h-4 w-4 mr-1" />
              Varyant Ekle
            </button>
          </div>

          {errors.variants && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.variants}
              </p>
            </div>
          )}

          <div className="space-y-4">
            {product.variants.map((variant, index) => (
              <VariantForm
                key={variant.id}
                variant={variant}
                index={index}
                attributeDefinitions={state.attributeDefinitions}
                onUpdate={(updatedVariant) => updateVariant(index, updatedVariant)}
                onRemove={() => removeVariant(index)}
                generateName={() => generateVariantName(variant.attributes)}
                generateSKU={() => generateVariantSKU(variant.attributes)}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            İptal
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {mode === 'create' ? 'Ürünü Oluştur' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Variant Form Component
interface VariantFormProps {
  variant: ProductVariant;
  index: number;
  attributeDefinitions: any[];
  onUpdate: (variant: ProductVariant) => void;
  onRemove: () => void;
  generateName: () => string;
  generateSKU: () => string;
}

const VariantForm: React.FC<VariantFormProps> = ({
  variant,
  index,
  attributeDefinitions,
  onUpdate,
  onRemove,
  generateName,
  generateSKU
}) => {
  const addAttribute = () => {
    const newAttribute: VariantAttribute = { name: '', value: '' };
    onUpdate({
      ...variant,
      attributes: [...variant.attributes, newAttribute]
    });
  };

  const updateAttribute = (attrIndex: number, attribute: VariantAttribute) => {
    const updatedAttributes = variant.attributes.map((attr, i) => 
      i === attrIndex ? attribute : attr
    );
    
    const updatedVariant = {
      ...variant,
      attributes: updatedAttributes,
      name: generateName(),
      sku: generateSKU()
    };
    
    onUpdate(updatedVariant);
  };

  const removeAttribute = (attrIndex: number) => {
    onUpdate({
      ...variant,
      attributes: variant.attributes.filter((_, i) => i !== attrIndex)
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-900">
          Varyant {index + 1}: {variant.name || 'Yeni Varyant'}
        </h3>
        <button
          type="button"
          onClick={onRemove}
          className="text-red-600 hover:text-red-800"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">SKU</label>
          <input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            value={variant.sku}
            onChange={(e) => onUpdate({ ...variant, sku: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Stok</label>
          <input
            type="number"
            min="0"
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            value={variant.inventory}
            onChange={(e) => onUpdate({ ...variant, inventory: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Düşük Stok Uyarısı</label>
          <input
            type="number"
            min="0"
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            value={variant.lowStockThreshold}
            onChange={(e) => onUpdate({ ...variant, lowStockThreshold: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      {/* Attributes */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">Özellikler</label>
          <button
            type="button"
            onClick={addAttribute}
            className="text-sm text-primary-600 hover:text-primary-500"
          >
            + Özellik Ekle
          </button>
        </div>

        {variant.attributes.map((attribute, attrIndex) => (
          <div key={attrIndex} className="flex items-center space-x-2">
            <select
              className="flex-1 border border-gray-300 rounded-md px-3 py-2"
              value={attribute.name}
              onChange={(e) => updateAttribute(attrIndex, { ...attribute, name: e.target.value })}
            >
              <option value="">Özellik Seçin</option>
              {attributeDefinitions.map(def => (
                <option key={def.id} value={def.name}>{def.name}</option>
              ))}
            </select>

            <select
              className="flex-1 border border-gray-300 rounded-md px-3 py-2"
              value={attribute.value}
              onChange={(e) => updateAttribute(attrIndex, { ...attribute, value: e.target.value })}
            >
              <option value="">Değer Seçin</option>
              {attributeDefinitions
                .find(def => def.name === attribute.name)
                ?.values.map((value: string) => (
                  <option key={value} value={value}>{value}</option>
                ))}
            </select>

            <button
              type="button"
              onClick={() => removeAttribute(attrIndex)}
              className="text-red-600 hover:text-red-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductForm;
