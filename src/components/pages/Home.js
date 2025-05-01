import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="max-w-3xl w-full p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold text-center text-purple-800 mb-6">
          Campus Dining Reviews
        </h1>
        <p className="text-lg text-gray-700 text-center mb-8">
          Find the best food on campus with reviews from your fellow students!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-blue-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">Discover Dining Halls</h2>
            <p className="text-gray-600 mb-4">
              Browse all campus dining options and see what's on the menu today.
            </p>
            <Link 
              to="/search" 
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Browse Dining Halls
            </Link>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-purple-800 mb-2">Share Your Experience</h2>
            <p className="text-gray-600 mb-4">
              Rate and review the food you've tried to help other students.
            </p>
            <Link 
              to="/profile" 
              className="inline-block bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
            >
              My Reviews
            </Link>
          </div>
        </div>
        
        <div className="text-center">
          <Link 
            to="/login" 
            className="inline-block text-purple-600 hover:text-purple-800 font-medium"
          >
            Log in
          </Link>
          <span className="text-gray-400 mx-2">|</span>
          <Link 
            to="/signup" 
            className="inline-block text-purple-600 hover:text-purple-800 font-medium"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
} 