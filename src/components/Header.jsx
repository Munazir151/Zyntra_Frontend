import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trees, BarChart3, MessageCircle, PlusCircle, Menu, X, User, LogOut, LayoutDashboard, Briefcase } from 'lucide-react';
import Logo from '../images/Logo.png';

const Header = ({ currentPage, onNavigate, onAuthClick }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const authToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    const userDataStr = localStorage.getItem('user_data') || sessionStorage.getItem('user_data');
    
    if (authToken && userDataStr) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(userDataStr));
    }
  }, []);
  
  const getInitials = () => {
    if (!userData) return 'U';
    if (userData.full_name) {
      const names = userData.full_name.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      }
      return userData.full_name.substring(0, 2).toUpperCase();
    }
    if (userData.username) {
      return userData.username.substring(0, 2).toUpperCase();
    }
    if (userData.email) {
      return userData.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };
  
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('user_type');
    localStorage.removeItem('user_data');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user_data');
    setIsLoggedIn(false);
    setUserData(null);
    setShowDropdown(false);
    onNavigate('home');
  };
  
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'home', icon: Trees, label: 'Forest' },
    { id: 'workplace', icon: Briefcase, label: 'Workplace' },
    { id: 'analytics', icon: BarChart3, label: 'Stats' },
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'log', icon: PlusCircle, label: 'Log' },
  ];
  
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-40 glass-card mx-4 mt-4 rounded-2xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-3 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={() => onNavigate('home')}
        >
          <div className="w-10 h-10 flex items-center justify-center">
            <img src={Logo} alt="Zyntra Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-white text-xl font-medium">Zyntra</h1>
            <p className="text-forest-light text-xs">Your Digital Forest</p>
          </div>
        </motion.div>
        
        {/* Navigation Items */}
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'bg-forest-green text-white'
                    : 'text-forest-light hover:text-white hover:bg-white hover:bg-opacity-10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={20} />
                <span className="text-sm font-light">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
        
        {/* Auth Buttons / User Profile */}
        <div className="flex items-center gap-3 relative">
          {!isLoggedIn ? (
            <>
              <motion.button
                onClick={() => onAuthClick('signin')}
                className="px-6 py-2 text-white hover:text-forest-light transition-colors font-light"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.button>
              <motion.button
                onClick={() => onAuthClick('signup')}
                className="px-6 py-2 bg-forest-green text-white rounded-full font-medium hover:bg-forest-dark transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Up
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-forest-green to-sunlight-yellow flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-semibold">{getInitials()}</span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-white text-sm font-medium">{userData?.full_name || userData?.username || 'User'}</p>
                  <p className="text-forest-light text-xs">{userData?.email}</p>
                </div>
              </motion.button>
              
              {/* Dropdown Menu */}
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-16 right-0 glass-card rounded-xl p-2 min-w-[200px] shadow-xl"
                >
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-white hover:bg-red-500 hover:bg-opacity-20 rounded-lg transition-all"
                  >
                    <LogOut size={18} />
                    <span className="text-sm">Logout</span>
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center justify-around px-4 py-3 border-t border-white border-opacity-10">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                isActive
                  ? 'text-forest-green'
                  : 'text-forest-light'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon size={22} />
              <span className="text-xs">{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.header>
  );
};

export default Header;
