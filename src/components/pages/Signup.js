import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const API_URL = "http://localhost:8080/CSCI201Project";

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  
  useEffect(() => {
    const loggedIn = Cookies.get('loggedIn');
    if (loggedIn) {
      console.log('User is already logged in');
      alert('You are already logged in');
      navigate('/');
    }
  }, [navigate]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const isValidUSCEmail = (email) => {
    const uscEmailRegex = /^[a-zA-Z0-9._%+-]+@usc\.edu$/;
    return uscEmailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate USC email
    if (!isValidUSCEmail(formData.email)) {
      setError("Please use a valid USC email address (@usc.edu)");
      return;
    }
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('Signup data:', formData);
      
      // Actual API call to the RegisterServlet
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.email,
          password: formData.password,
        }),
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setSuccess("Account created successfully! Redirecting to login...");
        // Reset form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
        
        // Redirect to login page after a delay, passing along the original referrer
        setTimeout(() => {
          navigate('/login', { state: { from } });
        }, 2000);
      } else {
        throw new Error(data.message || 'Registration failed');
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f8f8] to-[#fff5e6] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your TrojanTaste account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-[#990000] hover:text-[#800000]">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {from !== '/' && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <div className="flex">
                <div>
                  <p className="text-sm text-blue-700">
                    You'll be able to access the page you were trying to view after registration and login
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
              <div className="flex">
                <div>
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                USC Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#990000] focus:border-[#990000] sm:text-sm"
                  placeholder="username@usc.edu"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#990000] focus:border-[#990000] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#990000] focus:border-[#990000] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#990000] hover:bg-[#800000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#990000] disabled:opacity-50"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 