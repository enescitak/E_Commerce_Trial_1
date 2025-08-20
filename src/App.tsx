import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import ProductList from './components/Products/ProductList';
import ProductForm from './components/Products/ProductForm';
import CategoryForm from './components/Products/CategoryForm';
import ProductCategoryManager from './components/Products/ProductCategoryManager';
import OrderList from './components/Orders/OrderList';
import Reports from './components/Reports/Reports';
import Settings from './components/Settings/Settings';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<ProductForm mode="create" />} />
            <Route path="products/:id/edit" element={<ProductForm mode="edit" />} />
            <Route path="products/categories" element={<ProductCategoryManager />} />
            <Route path="products/categories/new" element={<CategoryForm mode="create" />} />
            <Route path="products/categories/:id/edit" element={<CategoryForm mode="edit" />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
