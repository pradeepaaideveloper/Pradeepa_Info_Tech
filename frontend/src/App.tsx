import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import './i18n'; // Import static localization

const AppContent: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Header / Navbar */}
      <header className="glassmorphism sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-lg">
        <Link to="/" className="text-xl font-bold tracking-wider text-sky-400">
          Pradeepa Info Tech
        </Link>
        
        <nav className="hidden md:flex gap-6 items-center">
          <Link to="/" className="hover:text-sky-400 transition-colors">Home</Link>
          <Link to="/courses" className="hover:text-sky-400 transition-colors">Courses</Link>
          <Link to="/store" className="hover:text-sky-400 transition-colors">Store</Link>
          <Link to="/contact" className="hover:text-sky-400 transition-colors">Contact</Link>
          
          {isAuthenticated && (
            <>
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-amber-400 hover:text-amber-300 font-medium">Admin</Link>
              )}
              {user?.role === 'cashier' && (
                <Link to="/pos" className="text-emerald-400 hover:text-emerald-300 font-medium">POS</Link>
              )}
              <Link to="/portal" className="text-sky-400 hover:text-sky-300">My Portal</Link>
            </>
          )}
        </nav>

        <div className="flex gap-4 items-center">
          {/* Language Switcher */}
          <button 
            onClick={toggleLanguage}
            className="px-3 py-1 text-sm border border-slate-700 rounded-md hover:bg-slate-800 transition-colors"
          >
            {language === 'en' ? 'தமிழ்' : 'English'}
          </button>

          {/* Cart Icon */}
          <Link to="/cart" className="relative p-2 hover:bg-slate-800 rounded-full transition-colors">
            🛒
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-sky-500 text-xs px-1.5 py-0.5 rounded-full font-bold">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </Link>

          {/* Authentication Action */}
          {isAuthenticated ? (
            <button 
              onClick={logout}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-semibold transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link 
              to="/login"
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-lg text-sm font-semibold transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/courses" element={<PlaceholderView title="Courses Academy Catalog" />} />
          <Route path="/store" element={<PlaceholderView title="E-Commerce Storefront" />} />
          <Route path="/contact" element={<PlaceholderView title="Contact Us & WhatsApp Link" />} />
          <Route path="/cart" element={<PlaceholderView title="Shopping Cart Details" />} />
          <Route path="/login" element={<PlaceholderView title="Secure Login Screen" />} />
          <Route path="/portal" element={<PlaceholderView title="Student Dashboard Portal" />} />
          <Route path="/pos" element={<PlaceholderView title="POS Billing System Console" />} />
          <Route path="/admin" element={<PlaceholderView title="Administrative Analytics Dashboard" />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-6 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} Pradeepa Info Tech. All rights reserved. (MSME & GSTIN Registered)
      </footer>
    </div>
  );
};

// Quick Mock Views
const HomeView: React.FC = () => (
  <div className="text-center py-20">
    <h1 className="text-5xl font-extrabold tracking-tight mb-4">
      Welcome to <span className="text-gradient">Pradeepa Info Tech</span>
    </h1>
    <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
      Your premier computer education academy and digital accessories center.
      Learn programming, hardware management, or buy premium IT products.
    </p>
    <div className="flex gap-4 justify-center">
      <Link to="/courses" className="px-6 py-3 bg-sky-600 hover:bg-sky-500 rounded-xl font-bold shadow-lg transition-transform transform hover:scale-105">
        Explore courses
      </Link>
      <Link to="/store" className="px-6 py-3 border border-slate-700 hover:bg-slate-800 rounded-xl font-bold transition-transform transform hover:scale-105">
        Shop computer parts
      </Link>
    </div>
  </div>
);

const PlaceholderView: React.FC<{ title: string }> = ({ title }) => (
  <div className="text-center py-20 bg-slate-800/40 rounded-3xl border border-slate-700/50">
    <h2 className="text-2xl font-bold mb-2">{title}</h2>
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
