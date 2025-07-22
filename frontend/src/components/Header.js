import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from './Icon';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/appointments', label: 'Appointments', icon: 'calendar' },
    { path: '/doctors', label: 'Find Doctors', icon: 'user-md' },
    { path: '/clinics', label: 'Clinics', icon: 'hospital' },
    { path: '/profile', label: 'Profile', icon: 'user' },
    { path: '/notifications', label: 'Notifications', icon: 'bell' }
  ];

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              <div className="bg-blue-600 p-2 rounded-lg mr-3">
                <Icon name="hospital" className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DigitalClinic</h1>
                <p className="text-xs text-gray-500">Healthcare Made Simple</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon name={item.icon} className="mr-2" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Book Appointment Button */}
            <button
              onClick={() => navigate('/book-appointment')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center text-sm font-medium"
            >
              <Icon name="plus" className="mr-2" />
              Book Appointment
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="bg-gray-300 rounded-full p-2 mr-2">
                  <Icon name="user" className="text-gray-600" />
                </div>
                <span className="hidden md:block text-gray-700 font-medium">
                  {user?.name || 'User'}
                </span>
                <Icon name="chevron-down" className="ml-1 text-gray-500" />
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Icon name="user" className="mr-2" />
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate('/notifications');
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Icon name="bell" className="mr-2" />
                    Notifications
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Icon name="sign-out" className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Icon name="bars" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-2">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                    isActive(item.path)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon name={item.icon} className="mr-3" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Close dropdown when clicking outside */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
}

export default Header;
