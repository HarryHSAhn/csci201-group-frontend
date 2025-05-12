import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUser, FaHome, FaUtensils, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import Cookies from 'js-cookie';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(Cookies.get('loggedIn') === 'true');

  useEffect(() => {
    const interval = setInterval(() => {
      setLoggedIn(Cookies.get('loggedIn') === 'true');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogOut = () => {
    Cookies.remove('loggedIn');
    Cookies.remove('userEmail');
    navigate('/');
    alert('You have been logged out');
  };

  return (
    <nav className="bg-white shadow-md w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left side: Logo and Links */}
          <div className="flex items-center space-x-6 flex-1">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity">
              <img 
                src="/usclogo.png" 
                alt="USC Logo" 
                className="h-10 w-auto"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-[#990000] leading-tight">TrojanTaste</span>
                <span className="text-xs text-gray-500">USC Dining Reviews</span>
              </div>
            </Link>
            
            <div className="hidden sm:flex space-x-8 ml-4">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/') 
                    ? 'border-[#990000] text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <FaHome className="mr-2" /> Home
              </Link>

              {loggedIn && (
                <Link
                  to="/search"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/search') 
                      ? 'border-[#990000] text-gray-900' 
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <FaUtensils className="mr-2" /> USC Dining Halls
                </Link>
              )}
            </div>
          </div>

          {/* Right side: Profile / Login / Logout */}
          <div className="hidden sm:flex items-center space-x-6">
            {loggedIn ? (
              <>
                <Link
                  to="/profile"
                  className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md ${
                    isActive('/profile') 
                      ? 'bg-[#990000]/10 text-[#990000]' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <FaUser className="mr-1" /> Profile
                </Link>
                <button
                  onClick={handleLogOut}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-[#990000] hover:bg-[#800000]"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md ${
                    isActive('/login') 
                      ? 'bg-[#990000]/10 text-[#990000]' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-[#990000] hover:bg-[#800000]"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#990000]"
            >
              <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/') 
                  ? 'bg-[#990000]/10 border-[#990000] text-[#990000]' 
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <FaHome className="mr-2" /> <span>Home</span>
              </div>
            </Link>

            {loggedIn && (
              <Link
                to="/search"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive('/search') 
                    ? 'bg-[#990000]/10 border-[#990000] text-[#990000]' 
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <FaUtensils className="mr-2" /> <span>USC Dining Halls</span>
                </div>
              </Link>
            )}

            {loggedIn ? (
              <>
                <Link
                  to="/profile"
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive('/profile') 
                      ? 'bg-[#990000]/10 border-[#990000] text-[#990000]' 
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <FaUser className="mr-2" /> <span>Profile</span>
                  </div>
                </Link>
                <div className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-[#990000] hover:bg-gray-50 hover:border-gray-300">
                  <button
                    onClick={() => {
                      handleLogOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full text-left"
                  >
                    <FaSignOutAlt className="mr-2" /> Log out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive('/login') 
                      ? 'bg-[#990000]/10 border-[#990000] text-[#990000]' 
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <FaUser className="mr-2" /> Login
                  </div>
                </Link>
                <Link
                  to="/signup"
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive('/signup') 
                      ? 'bg-[#990000]/10 border-[#990000] text-[#990000]' 
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <FaUser className="mr-2" /> Sign up
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
