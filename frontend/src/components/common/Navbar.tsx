import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Menu, X, ShoppingCart, Heart, User, Globe, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItems, wishlist } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isOpen, setIsOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.courses'), path: '/courses' },
    { name: t('nav.store'), path: '/store' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  return (
    <header className="glassmorphism sticky top-0 z-50 px-4 md:px-8 py-3 shadow-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-sky-500 p-2 rounded-xl text-slate-900 font-bold transition-transform duration-300 group-hover:scale-110 shadow-lg shadow-sky-500/20">
            PR
          </div>
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-bold tracking-wider text-sky-400 font-display group-hover:text-sky-300 transition-colors">
              Pradeepa Info Tech
            </span>
            <span className="text-[10px] text-slate-400 tracking-widest uppercase">
              Academy & Store
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-250 ${
                isActive(link.path)
                  ? 'text-sky-400 bg-sky-500/10'
                  : 'text-slate-300 hover:text-sky-300 hover:bg-slate-800/40'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          {/* Admin / POS Role Navigation */}
          {isAuthenticated && user?.role === 'admin' && (
            <Link
              to="/admin"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-250 ${
                isActive('/admin') ? 'text-amber-400 bg-amber-500/10' : 'text-amber-400/90 hover:text-amber-300 hover:bg-amber-500/10'
              }`}
            >
              {t('nav.admin')}
            </Link>
          )}

          {isAuthenticated && user?.role === 'cashier' && (
            <Link
              to="/pos"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-250 ${
                isActive('/pos') ? 'text-emerald-400 bg-emerald-500/10' : 'text-emerald-400/90 hover:text-emerald-300 hover:bg-emerald-500/10'
              }`}
            >
              {t('nav.pos.title', 'POS')}
            </Link>
          )}
        </nav>

        {/* Action Controls */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-700 hover:border-sky-500 hover:bg-slate-800 text-slate-300 hover:text-sky-400 transition-all cursor-pointer"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
          </button>

          {/* Wishlist Icon */}
          <Link
            to="/wishlist"
            className="relative p-2 text-slate-300 hover:text-rose-400 hover:bg-slate-800 rounded-full transition-all"
            title={t('nav.wishlist')}
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-[10px] w-4.5 h-4.5 flex items-center justify-center rounded-full font-bold text-white shadow-md animate-pulse-subtle">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative p-2 text-slate-300 hover:text-sky-400 hover:bg-slate-800 rounded-full transition-all"
            title={t('nav.cart')}
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-sky-500 text-[10px] w-4.5 h-4.5 flex items-center justify-center rounded-full font-bold text-slate-900 shadow-md">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth Button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
              <Link to="/portal" className="flex items-center gap-2 text-slate-300 hover:text-sky-400 group">
                <div className="p-1.5 bg-slate-800 rounded-lg group-hover:bg-sky-500/10 transition-colors">
                  <User className="w-4 h-4 text-sky-400" />
                </div>
                <span className="text-sm font-medium max-w-[120px] truncate">{user?.full_name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-2 px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-sky-600/20 hover:shadow-sky-500/30 transition-all hover:-translate-y-0.5"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 lg:hidden">
          {/* Wishlist & Cart icons for mobile header */}
          <Link to="/wishlist" className="relative p-1.5 text-slate-300 hover:text-rose-400">
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative p-1.5 text-slate-300 hover:text-sky-400">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-sky-500 text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold text-slate-900">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-300 hover:text-sky-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden mt-3 px-2 py-4 bg-slate-900/95 border-t border-slate-800 rounded-2xl flex flex-col gap-3 animate-fade-in-up">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`px-4 py-2.5 rounded-xl text-base font-medium transition-all ${
                isActive(link.path)
                  ? 'text-sky-400 bg-sky-500/10'
                  : 'text-slate-300 hover:text-sky-300 hover:bg-slate-800/40'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {isAuthenticated && user?.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2.5 rounded-xl text-base font-semibold text-amber-400 hover:bg-amber-500/10 transition-all"
            >
              {t('nav.admin')}
            </Link>
          )}

          {isAuthenticated && user?.role === 'cashier' && (
            <Link
              to="/pos"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2.5 rounded-xl text-base font-semibold text-emerald-400 hover:bg-emerald-500/10 transition-all"
            >
              {t('nav.pos.title', 'POS')}
            </Link>
          )}

          <hr className="border-slate-800 my-1" />

          {/* Mobile Language Switcher */}
          <button
            onClick={() => {
              toggleLanguage();
              setIsOpen(false);
            }}
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-sky-400" />
              <span>Language / மொழி</span>
            </div>
            <span className="text-xs bg-slate-800 px-2 py-1 rounded border border-slate-700 text-sky-400">
              {language === 'en' ? 'தமிழ்' : 'English'}
            </span>
          </button>

          {/* Mobile User Section */}
          {isAuthenticated ? (
            <>
              <Link
                to="/portal"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800"
              >
                <User className="w-5 h-5 text-sky-400" />
                <span>My Portal ({user?.full_name})</span>
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="mx-4 my-2 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-center font-bold shadow-lg transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
