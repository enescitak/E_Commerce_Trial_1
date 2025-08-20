import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { 
  Save, 
  Plus, 
  Trash2, 
  Edit, 
  Settings as SettingsIcon,
  Store,
  Palette,
  Bell,
  Shield,
  Tag,
  Folder,
  X
} from 'lucide-react';

const Settings: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [activeTab, setActiveTab] = useState<'store' | 'categories' | 'attributes' | 'notifications'>('store');
  
  // Store settings
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'Moda Mağazam',
    currency: 'TRY',
    timezone: 'Europe/Istanbul',
    language: 'tr'
  });

  // New category form
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  
  // New attribute form
  const [newAttribute, setNewAttribute] = useState({
    name: '',
    type: 'text' as 'color' | 'size' | 'text' | 'number',
    values: [] as string[],
    required: false
  });
  const [newAttributeValue, setNewAttributeValue] = useState('');

  const saveStoreSettings = () => {
    // Store settings save logic
    console.log('Store settings saved:', storeSettings);
    alert('Mağaza ayarları kaydedildi!');
  };

  const addCategory = () => {
    if (newCategory.name.trim()) {
      const category = {
        id: Date.now().toString(),
        name: newCategory.name,
        description: newCategory.description,
        status: 'active' as const,
        createdAt: new Date()
      };
      
      dispatch({ type: 'ADD_CATEGORY', payload: category });
      setNewCategory({ name: '', description: '' });
    }
  };

  const addAttributeValue = () => {
    if (newAttributeValue.trim() && !newAttribute.values.includes(newAttributeValue)) {
      setNewAttribute(prev => ({
        ...prev,
        values: [...prev.values, newAttributeValue]
      }));
      setNewAttributeValue('');
    }
  };

  const removeAttributeValue = (value: string) => {
    setNewAttribute(prev => ({
      ...prev,
      values: prev.values.filter(v => v !== value)
    }));
  };

  const addAttribute = () => {
    if (newAttribute.name.trim()) {
      // Add to attribute definitions logic would go here
      console.log('New attribute:', newAttribute);
      setNewAttribute({
        name: '',
        type: 'text',
        values: [],
        required: false
      });
      alert('Özellik eklendi!');
    }
  };

  const tabs = [
    { id: 'store', name: 'Mağaza Ayarları', icon: Store },
    { id: 'categories', name: 'Kategoriler', icon: Folder },
    { id: 'attributes', name: 'Ürün Özellikleri', icon: Tag },
    { id: 'notifications', name: 'Bildirimler', icon: Bell }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <SettingsIcon className="h-8 w-8 text-gray-400" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ayarlar</h1>
          <p className="mt-1 text-sm text-gray-500">
            Mağaza ve sistem ayarlarınızı yönetin
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
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

      {/* Store Settings Tab */}
      {activeTab === 'store' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Mağaza Bilgileri</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mağaza Adı
              </label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={storeSettings.storeName}
                onChange={(e) => setStoreSettings(prev => ({ ...prev, storeName: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Para Birimi
              </label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={storeSettings.currency}
                onChange={(e) => setStoreSettings(prev => ({ ...prev, currency: e.target.value }))}
              >
                <option value="TRY">Türk Lirası (₺)</option>
                <option value="USD">Amerikan Doları ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Saat Dilimi
              </label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={storeSettings.timezone}
                onChange={(e) => setStoreSettings(prev => ({ ...prev, timezone: e.target.value }))}
              >
                <option value="Europe/Istanbul">İstanbul</option>
                <option value="Europe/London">Londra</option>
                <option value="America/New_York">New York</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Dil
              </label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={storeSettings.language}
                onChange={(e) => setStoreSettings(prev => ({ ...prev, language: e.target.value }))}
              >
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={saveStoreSettings}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Ayarları Kaydet
            </button>
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          {/* Add New Category */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Yeni Kategori Ekle</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Kategori Adı
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="örn: Kadın Giyim"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Açıklama
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Kategori açıklaması"
                />
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={addCategory}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Kategori Ekle
              </button>
            </div>
          </div>

          {/* Categories List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Mevcut Kategoriler</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {state.categories.map((category) => (
                <div key={category.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-gray-500">{category.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Attributes Tab */}
      {activeTab === 'attributes' && (
        <div className="space-y-6">
          {/* Add New Attribute */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Yeni Ürün Özelliği Ekle</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Özellik Adı
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={newAttribute.name}
                  onChange={(e) => setNewAttribute(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="örn: Materyal, Stil"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Özellik Tipi
                </label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={newAttribute.type}
                  onChange={(e) => setNewAttribute(prev => ({ ...prev, type: e.target.value as any }))}
                >
                  <option value="text">Metin</option>
                  <option value="color">Renk</option>
                  <option value="size">Beden</option>
                  <option value="number">Sayı</option>
                </select>
              </div>
            </div>

            {/* Attribute Values */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Özellik Değerleri
              </label>
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={newAttributeValue}
                  onChange={(e) => setNewAttributeValue(e.target.value)}
                  placeholder="Değer girin ve Enter'a basın"
                  onKeyPress={(e) => e.key === 'Enter' && addAttributeValue()}
                />
                <button
                  onClick={addAttributeValue}
                  className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {newAttribute.values.map((value, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                  >
                    {value}
                    <button
                      onClick={() => removeAttributeValue(value)}
                      className="ml-1 text-primary-600 hover:text-primary-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={newAttribute.required}
                  onChange={(e) => setNewAttribute(prev => ({ ...prev, required: e.target.checked }))}
                />
                <span className="ml-2 text-sm text-gray-700">Zorunlu özellik</span>
              </label>

              <button
                onClick={addAttribute}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Özellik Ekle
              </button>
            </div>
          </div>

          {/* Attributes List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Mevcut Özellikler</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {state.attributeDefinitions.map((attr) => (
                <div key={attr.id} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{attr.name}</h3>
                      <p className="text-sm text-gray-500">
                        Tip: {attr.type} • {attr.required ? 'Zorunlu' : 'İsteğe bağlı'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {attr.values.slice(0, 5).map((value, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800"
                      >
                        {value}
                      </span>
                    ))}
                    {attr.values.length > 5 && (
                      <span className="text-xs text-gray-500">
                        +{attr.values.length - 5} daha
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Bildirim Ayarları</h2>
          
          <div className="space-y-4">
            {[
              { id: 'low-stock', label: 'Düşük stok uyarıları', description: 'Ürün stokları azaldığında bildirim al' },
              { id: 'new-orders', label: 'Yeni sipariş bildirimleri', description: 'Yeni sipariş geldiğinde bildirim al' },
              { id: 'order-updates', label: 'Sipariş durum güncellemeleri', description: 'Sipariş durumu değiştiğinde bildirim al' },
              { id: 'daily-reports', label: 'Günlük raporlar', description: 'Günlük satış raporu e-postası al' },
            ].map((notification) => (
              <div key={notification.id} className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{notification.label}</h3>
                  <p className="text-sm text-gray-500">{notification.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700">
              <Save className="h-4 w-4 mr-2" />
              Bildirim Ayarlarını Kaydet
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
