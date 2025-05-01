import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaStar } from 'react-icons/fa';

// Mock data for dining halls
const mockDiningHalls = [
  {
    id: 1,
    name: "North Campus Dining Hall",
    image: "https://source.unsplash.com/random/400x300/?cafeteria",
    rating: 4.2,
    reviewCount: 156,
    location: "North Campus",
    hours: "7:00 AM - 9:00 PM",
    description: "A spacious dining hall offering a variety of cuisines including vegetarian and vegan options."
  },
  {
    id: 2,
    name: "South Campus Café",
    image: "https://source.unsplash.com/random/400x300/?cafe",
    rating: 4.5,
    reviewCount: 210,
    location: "South Campus",
    hours: "7:30 AM - 8:00 PM",
    description: "Modern café with specialty coffee and freshly prepared sandwiches and salads."
  },
  {
    id: 3,
    name: "Central Dining Commons",
    image: "https://source.unsplash.com/random/400x300/?dining",
    rating: 3.9,
    reviewCount: 124,
    location: "Central Campus",
    hours: "7:00 AM - 10:00 PM",
    description: "Large dining hall with international food stations and late-night options."
  },
  {
    id: 4,
    name: "West Side Eatery",
    image: "https://source.unsplash.com/random/400x300/?restaurant",
    rating: 4.0,
    reviewCount: 178,
    location: "West Campus",
    hours: "8:00 AM - 8:00 PM",
    description: "Cozy dining spot featuring comfort food and a salad bar with fresh ingredients."
  },
  {
    id: 5,
    name: "Graduate Center Bistro",
    image: "https://source.unsplash.com/random/400x300/?bistro",
    rating: 4.7,
    reviewCount: 92,
    location: "Graduate Center",
    hours: "11:00 AM - 7:00 PM",
    description: "Upscale bistro serving gourmet meals in an elegant atmosphere."
  }
];

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDiningHalls, setFilteredDiningHalls] = useState(mockDiningHalls);
  const [locationFilter, setLocationFilter] = useState('all');

  // Get unique locations for filter dropdown
  const locations = [...new Set(mockDiningHalls.map(hall => hall.location))];

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterDiningHalls(value, locationFilter);
  };

  // Handle location filter change
  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocationFilter(value);
    filterDiningHalls(searchTerm, value);
  };

  // Filter dining halls based on search term and location
  const filterDiningHalls = (term, location) => {
    let results = mockDiningHalls;
    
    // Filter by search term
    if (term) {
      const lowerCaseTerm = term.toLowerCase();
      results = results.filter(hall => 
        hall.name.toLowerCase().includes(lowerCaseTerm) ||
        hall.description.toLowerCase().includes(lowerCaseTerm)
      );
    }
    
    // Filter by location
    if (location !== 'all') {
      results = results.filter(hall => hall.location === location);
    }
    
    setFilteredDiningHalls(results);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-purple-800 mb-8">
          Find Dining Halls
        </h1>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search dining halls..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div className="md:w-1/3">
              <select
                value={locationFilter}
                onChange={handleLocationChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {filteredDiningHalls.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No dining halls found</h2>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredDiningHalls.map(hall => (
              <div key={hall.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="md:flex">
                  <div className="md:flex-shrink-0">
                    <img 
                      className="h-48 w-full object-cover md:w-48" 
                      src={hall.image} 
                      alt={hall.name} 
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">{hall.name}</h2>
                        <p className="text-sm text-gray-600 mb-2">{hall.location}</p>
                      </div>
                      <div className="flex items-center">
                        <FaStar className="text-yellow-400 mr-1" />
                        <span className="text-gray-700">{hall.rating}</span>
                        <span className="text-gray-500 text-sm ml-1">({hall.reviewCount})</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{hall.description}</p>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <span className="font-medium">Hours:</span>
                      <span className="ml-2">{hall.hours}</span>
                    </div>
                    
                    <div className="mt-4">
                      <Link
                        to={`/menu-item/${hall.id}`}
                        className="inline-block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 