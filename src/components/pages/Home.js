import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { FaUtensils, FaStar, FaUser, FaSearch } from 'react-icons/fa';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = Cookies.get('loggedIn') === 'true';
    const email = Cookies.get('userEmail');
    
    setIsAuthenticated(loggedIn);
    if (loggedIn && email) {
      const name = email.split('@')[0].split('.').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      setUserName(name);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Minimalist Header */}
      <div className="w-full py-16 px-6 bg-white shadow-sm">
        <div className="max-w-3xl mx-auto">
          <h1 className={`text-3xl font-light mb-2 ${isAuthenticated ? 'text-purple-800' : 'text-gray-800'}`}>
            {isAuthenticated ? `Hello, ${userName}` : 'Campus Dining'}
          </h1>
          <p className="text-gray-500 mb-6 font-light">
            {isAuthenticated 
              ? "What are you hungry for today?" 
              : "Discover and review campus dining options"}
          </p>
          
          {/* Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              to="/search"
              className="group bg-white border border-gray-200 hover:border-purple-300 rounded-lg p-5 flex items-center transition-all shadow-sm hover:shadow"
            >
              <div className={`w-10 h-10 rounded-full ${isAuthenticated ? 'bg-purple-100' : 'bg-gray-100'} flex items-center justify-center mr-4 group-hover:bg-purple-100 transition-colors`}>
                <FaSearch className={`${isAuthenticated ? 'text-purple-600' : 'text-gray-500'} group-hover:text-purple-600 transition-colors`} />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-800">Find Food</h2>
                <p className="text-sm text-gray-500">Browse dining options across campus</p>
              </div>
            </Link>

            <Link 
              to={isAuthenticated ? "/profile" : "/login"}
              className="group bg-white border border-gray-200 hover:border-purple-300 rounded-lg p-5 flex items-center transition-all shadow-sm hover:shadow"
            >
              <div className={`w-10 h-10 rounded-full ${isAuthenticated ? 'bg-purple-100' : 'bg-gray-100'} flex items-center justify-center mr-4 group-hover:bg-purple-100 transition-colors`}>
                <FaStar className={`${isAuthenticated ? 'text-purple-600' : 'text-gray-500'} group-hover:text-purple-600 transition-colors`} />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-800">
                  {isAuthenticated ? "Your Reviews" : "Sign In"}
                </h2>
                <p className="text-sm text-gray-500">
                  {isAuthenticated ? "View and manage your ratings" : "Login to rate and review items"}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Items Section */}
      <div className="flex-grow w-full py-10 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-800">Top Rated Items</h2>
            <Link to="/search" className="text-sm text-purple-600 hover:text-purple-800">
              View all →
            </Link>
          </div>
          
          {/* Minimal Item Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: 1, name: "BBQ Chicken", rating: 4.8, hall: "McCarthy", tags: ["Protein", "Gluten Free"] },
              { id: 2, name: "Vegetable Stir Fry", rating: 4.5, hall: "EVK", tags: ["Vegan", "Healthy"] },
              { id: 3, name: "Chocolate Cake", rating: 4.7, hall: "Parkside", tags: ["Dessert", "Vegetarian"] },
              { id: 4, name: "Caesar Salad", rating: 4.2, hall: "McCarthy", tags: ["Vegetarian", "Fresh"] }
            ].map(item => (
              <Link 
                key={item.id} 
                to={`/menu-item/${item.id}`}
                className="bg-white p-4 rounded-lg border border-gray-200 hover:border-purple-200 transition-all shadow-sm hover:shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.hall}</p>
                  </div>
                  <div className="flex items-center bg-purple-50 px-2 py-1 rounded text-sm">
                    <FaStar className="text-yellow-500 mr-1" size={12} />
                    <span className="text-gray-700">{item.rating}</span>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.tags.map(tag => (
                    <span key={tag} className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
          
          {!isAuthenticated && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link 
                  to="/login" 
                  className="inline-block px-6 py-2 bg-purple-600 text-white text-center rounded hover:bg-purple-700 transition-colors"
                >
                  Log in
                </Link>
                <Link 
                  to="/signup" 
                  className="inline-block px-6 py-2 border border-purple-600 text-purple-600 text-center rounded hover:bg-purple-50 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Minimal Footer */}
      <div className="w-full py-4 px-6 border-t border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">© 2023 Campus Dining</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <Link to="/about" className="text-sm text-gray-500 hover:text-purple-600">About</Link>
            <Link to="/contact" className="text-sm text-gray-500 hover:text-purple-600">Contact</Link>
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-purple-600">Privacy</Link>
          </div>
        </div>
      </div>
    </div>
  );
} 