import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import './i18n'; // Import static localization

const AppContent: React.FC = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<PlaceholderView title="Courses Academy Catalog" />} />
        <Route path="/store" element={<PlaceholderView title="E-Commerce Storefront" />} />
        <Route path="/about" element={<PlaceholderView title="About Us & Business History" />} />
        <Route path="/contact" element={<PlaceholderView title="Contact Us & WhatsApp Link" />} />
        <Route path="/cart" element={<PlaceholderView title="Shopping Cart Details" />} />
        <Route path="/wishlist" element={<PlaceholderView title="My Wishlist Items" />} />
        <Route path="/login" element={<PlaceholderView title="Secure Login Screen" />} />
        <Route path="/portal" element={<PlaceholderView title="Student Dashboard Portal" />} />
        <Route path="/pos" element={<PlaceholderView title="POS Billing System Console" />} />
        <Route path="/admin" element={<PlaceholderView title="Administrative Analytics Dashboard" />} />
        <Route path="*" element={<PlaceholderView title="Page Not Found" />} />
      </Routes>
    </MainLayout>
  );
};

const PlaceholderView: React.FC<{ title: string }> = ({ title }) => (
  <div className="text-center py-20 bg-slate-800/40 rounded-3xl border border-slate-700/50 max-w-4xl mx-auto my-10 animate-fade-in-up">
    <h2 className="text-2xl font-bold mb-2 font-display">{title}</h2>
    <p className="text-slate-400">This module is part of the next milestone implementations.</p>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
