import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trees, BarChart3, MessageCircle, PlusCircle, Menu, X, User, LogOut, LayoutDashboard, Briefcase, Video } from 'lucide-react';
import Logo from '../images/Logo.png';

const Header = ({ currentPage, onNavigate, onAuthClick, onLogout }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const authToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    const userDataStr = localStorage.getItem('user_data') || sessionStorage.getItem('user_data');
    const userType = localStorage.getItem('user_type') || sessionStorage.getItem('user_type');
    
    if (authToken && userDataStr) {
      setIsLoggedIn(true);
      const parsedUserData = JSON.parse(userDataStr);
      setUserData(parsedUserData);
      
      // Check if user is admin
      if (userType === 'admin' || parsedUserData.email?.toLowerCase().includes('admin')) {
        setIsAdmin(true);
      }
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
  
  const handleLogoutClick = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('user_type');
    localStorage.removeItem('user_data');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user_data');
    setIsLoggedIn(false);
    setUserData(null);
    setIsAdmin(false);
    setShowDropdown(false);
    if (onLogout) {
      onLogout();
    } else {
      onNavigate('branding');
    }
  };
  
  // Define navigation items based on user role
  const adminNavItems = [
    { id: 'gait', icon: User, label: 'Profile' },
    { id: 'home', icon: Trees, label: 'Forest' },
    { id: 'workplace', icon: Briefcase, label: 'Workplace' },
    { id: 'analytics', icon: BarChart3, label: 'Stats' },
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'log', icon: PlusCircle, label: 'Log' },
  ];
  
  const userNavItems = [
    { id: 'gait', icon: User, label: 'Profile' },
    { id: 'home', icon: Trees, label: 'Forest' },
  ];
  
  // Use appropriate nav items based on user role
  const navItems = isAdmin ? adminNavItems : userNavItems;
  
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-40 glass-card mx-2 md:mx-4 mt-2 md:mt-4 rounded-2xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="px-3 md:px-6 py-3 md:py-4 flex items-center justify-between gap-2">
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-2 md:gap-3 cursor-pointer flex-shrink-0"
          whileHover={{ scale: 1.05 }}
          onClick={() => onNavigate('home')}
        >
          <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
            <img src={Logo} alt="Zyntra Logo" className="w-full h-full object-contain" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-white text-lg md:text-xl font-medium">Zyntra</h1>
            <p className="text-forest-light text-xs">Your Digital Forest</p>
          </div>
        </motion.div>
        
        {/* Mobile Menu Button */}
        <motion.button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="md:hidden p-2 text-forest-light hover:text-white transition-colors"
          whileTap={{ scale: 0.95 }}
        >
          {showMobileMenu ? (
            <X size={24} />
          ) : (
            <div className="flex flex-col gap-1.5 w-6">
              <div className="h-0.5 w-full bg-current border border-current rounded-full"></div>
              <div className="h-0.5 w-full bg-current border border-current rounded-full"></div>
              <div className="h-0.5 w-full bg-current border border-current rounded-full"></div>
            </div>
          )}
        </motion.button>

        {/* Navigation Items - Desktop */}
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
        <div className="flex items-center gap-2 md:gap-3 relative flex-shrink-0">
          {!isLoggedIn ? (
            <>
              <motion.button
                onClick={() => onAuthClick('signin')}
                className="hidden sm:inline-block px-3 md:px-6 py-2 text-white hover:text-forest-light transition-colors font-light text-sm md:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.button>
              <motion.button
                onClick={() => onAuthClick('signup')}
                className="px-4 md:px-6 py-2 bg-forest-green text-white rounded-full font-medium hover:bg-forest-dark transition-all text-xs md:text-base"
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
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-forest-green to-sunlight-yellow flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs md:text-sm font-semibold">{getInitials()}</span>
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-white text-sm font-medium truncate max-w-[150px]">{userData?.full_name || userData?.username || 'User'}</p>
                  <p className="text-forest-light text-xs truncate max-w-[150px]">{userData?.email}</p>
                </div>
              </motion.button>
              
              {/* Dropdown Menu */}
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-16 right-0 glass-card rounded-xl p-2 min-w-[200px] shadow-xl border-2 border-white/30 z-50"
                >
                  <button
                    onClick={handleLogoutClick}
                    className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-red-500 hover:bg-opacity-30 rounded-lg transition-all font-semibold"
                  >
                    <LogOut size={20} />
                    <span className="text-base">Sign Out</span>
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Mobile Dropdown Menu */}
      {showMobileMenu && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-white border-opacity-10 bg-gradient-to-b from-forest-900/50 to-transparent"
        >
          <div className="px-3 py-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center justify-start gap-3 px-4 py-2.5 rounded-lg transition-all text-left ${
                    isActive
                      ? 'bg-forest-green text-white shadow-lg'
                      : 'text-forest-light hover:bg-white hover:bg-opacity-10 hover:text-white'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
