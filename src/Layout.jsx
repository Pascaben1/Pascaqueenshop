import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Home, 
  Info, 
  Phone, 
  Youtube,
  MapPin,
  Mail,
  MessageCircle,
  Search,
  User,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import SearchBar from './components/search/SearchBar';
import AuthModal from './components/auth/AuthModal';
import { useAuth } from './lib/AuthContext';

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  const navigation = [
    { name: 'Home', href: createPageUrl('Home'), icon: Home },
    { name: 'About Us', href: '#about', icon: Info },
    { name: 'Contact', href: '#contact', icon: Phone },
  ];

  const quickLinks = [
    { name: 'Home', href: createPageUrl('Home') },
    { name: 'About Us', href: '#about' },
    { name: 'Contact Us', href: '#contact' },
    { name: 'YouTube Channel', href: 'https://youtube.com/@pascaqueenfoods?si=mt1FlBzKpqu5SGFv', external: true },
  ];

  const scrollToSection = (href) => {
    if (href.startsWith('#')) {
      // Close mobile menu first
      setMobileMenuOpen(false);
      // Small delay to let menu close, then scroll
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6969c1601d12e386e36e0823/2cffb33c5_29674222-7C50-4AB0-A4E2-63D00CC9BD65.png"
                alt="Pascaqueen Logo"
                className="h-12 w-auto"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">Pascaqueen</h1>
                <p className="text-xs text-emerald-600 -mt-1">Formula Foods</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navigation.map((item) => (
                item.href.startsWith('#') ? (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className="text-gray-700 hover:text-emerald-700 font-medium transition-colors"
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-gray-700 hover:text-emerald-700 font-medium transition-colors"
                  >
                    {item.name}
                  </Link>
                )
              ))}
              <a
                href="https://youtube.com/@pascaqueenfoods?si=mt1FlBzKpqu5SGFv"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                <Youtube className="w-5 h-5" />
                Videos
              </a>
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center hover:bg-emerald-100 transition-colors"
              >
                {showSearch ? (
                  <X className="w-5 h-5 text-emerald-700" />
                ) : (
                  <Search className="w-5 h-5 text-emerald-700" />
                )}
              </button>

              {/* Account */}
              <div className="relative">
                {isAuthenticated ? (
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center hover:bg-emerald-700 transition-colors text-white font-semibold"
                  >
                    {user?.email?.[0]?.toUpperCase() || <User className="w-5 h-5" />}
                  </button>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center hover:bg-emerald-100 transition-colors"
                  >
                    <User className="w-5 h-5 text-emerald-700" />
                  </button>
                )}

                <AnimatePresence>
                  {showUserMenu && isAuthenticated && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-emerald-100 py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-100 mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                      </div>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50"
                        >
                          <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Mobile menu buttons */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center"
              >
                {showSearch ? (
                  <X className="w-5 h-5 text-emerald-700" />
                ) : (
                  <Search className="w-5 h-5 text-emerald-700" />
                )}
              </button>
              {isAuthenticated ? (
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-semibold"
                >
                  {user?.email?.[0]?.toUpperCase() || <User className="w-5 h-5" />}
                </button>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center"
                >
                  <User className="w-5 h-5 text-emerald-700" />
                </button>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-emerald-700" />
                ) : (
                  <Menu className="w-5 h-5 text-emerald-700" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile user menu */}
          <AnimatePresence>
            {showUserMenu && isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-white border-t border-emerald-100 overflow-hidden"
              >
                <div className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900 truncate mb-2">{user?.email}</p>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 py-2 text-sm text-gray-700"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="flex items-center gap-2 py-2 text-sm text-red-600"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border-t border-emerald-100"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="max-w-2xl mx-auto">
                  <SearchBar
                    value={window.searchQuery || ''}
                    onChange={(value) => {
                      window.searchQuery = value;
                      window.dispatchEvent(new CustomEvent('searchChange', { detail: value }));
                    }}
                    onClear={() => {
                      window.searchQuery = '';
                      window.dispatchEvent(new CustomEvent('searchChange', { detail: '' }));
                      setShowSearch(false);
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-emerald-100"
            >
              <div className="px-4 py-4 space-y-2">
                {navigation.map((item) => (
                  item.href.startsWith('#') ? (
                    <button
                      key={item.name}
                      onClick={() => scrollToSection(item.href)}
                      className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-emerald-50 text-gray-700 transition-colors"
                    >
                      <item.icon className="w-5 h-5 text-emerald-600" />
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-emerald-50 text-gray-700 transition-colors"
                    >
                      <item.icon className="w-5 h-5 text-emerald-600" />
                      {item.name}
                    </Link>
                  )
                ))}
                <a
                  href="https://youtube.com/@pascaqueenfoods?si=mt1FlBzKpqu5SGFv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                  Watch Videos
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="pt-16 md:pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-emerald-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6969c1601d12e386e36e0823/2cffb33c5_29674222-7C50-4AB0-A4E2-63D00CC9BD65.png"
                  alt="Pascaqueen Logo"
                  className="w-16 h-16 object-contain"
                />
                <div>
                  <h2 className="text-2xl font-bold">Pascaqueen</h2>
                  <p className="text-emerald-300 text-sm">Formula Foods</p>
                </div>
              </div>
              <p className="text-emerald-200/80 leading-relaxed mb-6">
                Your trusted source for premium herbal products rooted in African traditional medicine.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://wa.me/2347062823828"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center hover:bg-green-500 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a
                  href="https://youtube.com/@pascaqueenfoods?si=mt1FlBzKpqu5SGFv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-500 transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-200/80 hover:text-white transition-colors"
                      >
                        {link.name}
                      </a>
                    ) : link.href.startsWith('#') ? (
                      <button
                        onClick={() => scrollToSection(link.href)}
                        className="text-emerald-200/80 hover:text-white transition-colors"
                      >
                        {link.name}
                      </button>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-emerald-200/80 hover:text-white transition-colors"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Contact Info</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-emerald-200/80">
                    TIC OFFICE HARBOR ROAD<br />
                    CALABAR CRS<br />
                    Nigeria
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <a href="tel:+2347062823828" className="text-emerald-200/80 hover:text-white transition-colors">
                    +234 706 282 3828
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <a href="mailto:support@pascaqueen.shop" className="text-emerald-200/80 hover:text-white transition-colors">
                    support@pascaqueen.shop
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-emerald-800/50 text-center">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-4 text-sm">
              <Link to={createPageUrl('FAQ')} className="text-emerald-200/70 hover:text-white transition-colors">FAQ</Link>
              <Link to={createPageUrl('ShippingReturns')} className="text-emerald-200/70 hover:text-white transition-colors">Shipping & Returns</Link>
              <Link to={createPageUrl('PrivacyPolicy')} className="text-emerald-200/70 hover:text-white transition-colors">Privacy Policy</Link>
              <Link to={createPageUrl('TermsOfService')} className="text-emerald-200/70 hover:text-white transition-colors">Terms of Service</Link>
            </div>
            <p className="text-emerald-300/60 text-sm">
              © {new Date().getFullYear()} Pascaqueen. All rights reserved.
            </p>
            <p className="text-emerald-300/60 text-sm mt-1">
              A product of HSPR TECHNOLOGIES
            </p>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}