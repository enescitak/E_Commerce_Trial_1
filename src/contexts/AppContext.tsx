import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Product, Order, Category, AttributeDefinition, DashboardStats } from '../types';

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Kış Kazağı',
    description: 'Yumuşak yün karışımı kış kazağı',
    category: 'kadin-giyim',
    price: 299.99,
    compareAtPrice: 399.99,
    sku: 'KAZ-001',
    status: 'active',
    images: ['/api/placeholder/300/400'],
    variants: [
      {
        id: '1-1',
        productId: '1',
        name: 'Siyah - S',
        sku: 'KAZ-001-S-SY',
        inventory: 15,
        lowStockThreshold: 5,
        attributes: [
          { name: 'Renk', value: 'Siyah' },
          { name: 'Beden', value: 'S' }
        ],
        status: 'active'
      },
      {
        id: '1-2',
        productId: '1',
        name: 'Siyah - M',
        sku: 'KAZ-001-M-SY',
        inventory: 3,
        lowStockThreshold: 5,
        attributes: [
          { name: 'Renk', value: 'Siyah' },
          { name: 'Beden', value: 'M' }
        ],
        status: 'active'
      }
    ],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    tags: ['kış', 'kazak', 'yün']
  },
  {
    id: '2',
    name: 'Denim Pantolon',
    description: 'Klasik kesim denim pantolon',
    category: 'kadin-giyim',
    price: 199.99,
    sku: 'DEN-001',
    status: 'active',
    images: ['/api/placeholder/300/400'],
    variants: [
      {
        id: '2-1',
        productId: '2',
        name: 'Mavi - 28',
        sku: 'DEN-001-28-MV',
        inventory: 12,
        lowStockThreshold: 3,
        attributes: [
          { name: 'Renk', value: 'Mavi' },
          { name: 'Beden', value: '28' }
        ],
        status: 'active'
      }
    ],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    tags: ['denim', 'pantolon', 'casual']
  }
];

const mockCategories: Category[] = [
  { id: 'kadin-giyim', name: 'Kadın Giyim', status: 'active', createdAt: new Date() },
  { id: 'erkek-giyim', name: 'Erkek Giyim', status: 'active', createdAt: new Date() },
  { id: 'aksesuar', name: 'Aksesuar', status: 'active', createdAt: new Date() }
];

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    customerId: 'cust-1',
    customerEmail: 'ayse@email.com',
    customerName: 'Ayşe Yılmaz',
    status: 'processing',
    items: [
      {
        id: 'item-1',
        productId: '1',
        variantId: '1-1',
        productName: 'Kış Kazağı',
        variantName: 'Siyah - S',
        sku: 'KAZ-001-S-SY',
        quantity: 1,
        price: 299.99,
        total: 299.99
      }
    ],
    subtotal: 299.99,
    tax: 54.00,
    shipping: 25.00,
    total: 378.99,
    shippingAddress: {
      firstName: 'Ayşe',
      lastName: 'Yılmaz',
      address1: 'Bahçelievler Mahallesi',
      city: 'İstanbul',
      province: 'İstanbul',
      country: 'Türkiye',
      zip: '34180'
    },
    billingAddress: {
      firstName: 'Ayşe',
      lastName: 'Yılmaz',
      address1: 'Bahçelievler Mahallesi',
      city: 'İstanbul',
      province: 'İstanbul',
      country: 'Türkiye',
      zip: '34180'
    },
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  }
];

interface AppState {
  products: Product[];
  orders: Order[];
  categories: Category[];
  attributeDefinitions: AttributeDefinition[];
  dashboardStats: DashboardStats | null;
  loading: boolean;
  error: string | null;
}

type AppAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'UPDATE_ORDER'; payload: Order }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'SET_DASHBOARD_STATS'; payload: DashboardStats };

const initialState: AppState = {
  products: mockProducts,
  orders: mockOrders,
  categories: mockCategories,
  attributeDefinitions: [
    {
      id: 'color',
      name: 'Renk',
      type: 'color',
      values: ['Siyah', 'Beyaz', 'Mavi', 'Kırmızı', 'Yeşil', 'Sarı'],
      required: true
    },
    {
      id: 'size',
      name: 'Beden',
      type: 'size',
      values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36'],
      required: true
    }
  ],
  dashboardStats: null,
  loading: false,
  error: null
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p => p.id === action.payload.id ? action.payload : p)
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload)
      };
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    case 'UPDATE_ORDER':
      return {
        ...state,
        orders: state.orders.map(o => o.id === action.payload.id ? action.payload : o)
      };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'SET_DASHBOARD_STATS':
      return { ...state, dashboardStats: action.payload };
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
