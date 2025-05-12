import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { FaUtensils, FaStar, FaRegStar, FaUser, FaSearch } from 'react-icons/fa';

const API_URL = "http://localhost:8080/CSCI201Project";

// Simple star rating component
const StarRating = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => (
        <span key={index} className="text-xs">
          {index + 1 <= rating ? (
            <FaStar className="text-yellow-400" />
          ) : (
            <FaRegStar className="text-yellow-400" />
          )}
        </span>
      ))}
    </div>
  );
};

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [topItems, setTopItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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

  // Fetch top rated items
  useEffect(() => {
    const fetchTopItems = async () => {
      setIsLoading(true);
      try {
        // Fetch all items using the search endpoint with no filters
        const response = await fetch(`${API_URL}/searchServlet`);
        const data = await response.json();

        console.log("home data", data);
        
        // Sort by rating and take top 4
        const items = Array.isArray(data) ? data : [data];
        const sortedItems = items
          .filter(item => item.review && item.review.numericalRating)
          .sort((a, b) => b.review.numericalRating - a.review.numericalRating)
          .slice(0, 4);
        
        setTopItems(sortedItems);

        console.log("home sorted items", sortedItems);
      } catch (error) {
        console.error("Failed to fetch top items:", error);
        // Fallback sample data if fetch fails
        setTopItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopItems();
  }, []);

  // Helper function to extract dietary tags
  const extractTags = (foodItem) => {
    const tags = [];
    if (foodItem.vegetarian) tags.push("Vegetarian");
    if (foodItem.vegan) tags.push("Vegan");
    if (foodItem.halal) tags.push("Halal");
    if (!foodItem["Wheat/Gluten"] && !foodItem.wheat_gluten) tags.push("Gluten Free");
    
    // Add at most 2 more diet options
    const allTags = [
      { name: "Dairy", value: foodItem.dairy },
      { name: "Shellfish", value: foodItem.shellfish },
      { name: "Fish", value: foodItem.fish },
      { name: "Eggs", value: foodItem.eggs },
      { name: "Peanuts", value: foodItem.peanuts },
      { name: "Tree Nuts", value: foodItem.treeNuts || foodItem.tree_nuts },
      { name: "Soy", value: foodItem.soy }
    ];
    
    for (const tag of allTags) {
      if (tag.value === false && tags.length < 3) {
        tags.push(`No ${tag.name}`);
      }
    }
    
    return tags.slice(0, 3); // Show at most 3 tags
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Minimalist Header */}
      <div className="w-full py-16 px-6 bg-white shadow-sm">
        <div className="max-w-3xl mx-auto">
          <h1 className={`text-3xl font-light mb-2 ${isAuthenticated ? 'text-[#990000]' : 'text-gray-800'}`}>
            {isAuthenticated ? `Hello, ${userName}` : 'USC Dining'}
          </h1>
          <p className="text-gray-500 mb-6 font-light">
            {isAuthenticated 
              ? "What are you hungry for today?" 
              : "Discover and review USC dining options"}
          </p>
          
          {/* Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              to="/search"
              className="group bg-white border border-gray-200 hover:border-[#990000] rounded-lg p-5 flex items-center transition-all shadow-sm hover:shadow"
            >
              <div className={`w-10 h-10 rounded-full ${isAuthenticated ? 'bg-[#990000]/10' : 'bg-gray-100'} flex items-center justify-center mr-4 group-hover:bg-[#990000]/10 transition-colors`}>
                <FaSearch className={`${isAuthenticated ? 'text-[#990000]' : 'text-gray-500'} group-hover:text-[#990000] transition-colors`} />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-800">Find Food</h2>
                <p className="text-sm text-gray-500">Browse USC dining options</p>
              </div>
            </Link>

            <Link 
              to={isAuthenticated ? "/profile" : "/login"}
              className="group bg-white border border-gray-200 hover:border-[#990000] rounded-lg p-5 flex items-center transition-all shadow-sm hover:shadow"
            >
              <div className={`w-10 h-10 rounded-full ${isAuthenticated ? 'bg-[#990000]/10' : 'bg-gray-100'} flex items-center justify-center mr-4 group-hover:bg-[#990000]/10 transition-colors`}>
                <FaStar className={`${isAuthenticated ? 'text-[#990000]' : 'text-gray-500'} group-hover:text-[#990000] transition-colors`} />
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

      {/* Top Rated Items Section */}
      <div className="flex-grow w-full py-10 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-800">Top Rated Items</h2>
            <Link to="/search" className="text-sm text-[#990000] hover:text-[#800000]">
              View all →
            </Link>
          </div>
          
          {/* Loading state */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#990000]"></div>
            </div>
          ) : topItems.length > 0 ? (
            /* Top rated item cards */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topItems.map(item => (
                <Link 
                  key={item.foodItem.food_id} 
                  to={`/menu-item/${encodeURIComponent(item.foodItem.food_id)}`}
                  className="bg-white p-4 rounded-lg border border-gray-200 hover:border-[#990000] transition-all shadow-sm hover:shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800">{item.foodItem.name}</h3>
                      <p className="text-sm text-gray-500">{item.foodItem.diningHall}</p>
                    </div>
                    <div className="flex items-center bg-[#990000]/10 px-2 py-1 rounded text-sm">
                      <FaStar className="text-[#FFCC00] mr-1" size={12} />
                      <span className="text-gray-700">{item.review.numericalRating.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  {/* Star rating */}
                  <div className="mt-2">
                    <StarRating rating={Math.round(item.review.numericalRating)} />
                  </div>
                  
                  {/* Tags */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {extractTags(item.foodItem).map(tag => (
                      <span key={tag} className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* No items state */
            <div className="text-center py-6 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">No food items found</p>
              <Link to="/search" className="text-sm text-[#990000] hover:text-[#800000] mt-2 inline-block">
                Search for food →
              </Link>
            </div>
          )}
          
          {/* Login/Signup CTA for non-authenticated users */}
          {!isAuthenticated && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link 
                  to="/login" 
                  className="inline-block px-6 py-2 bg-[#990000] text-white text-center rounded hover:bg-[#800000] transition-colors"
                >
                  Log in
                </Link>
                <Link 
                  to="/signup" 
                  className="inline-block px-6 py-2 border border-[#990000] text-[#990000] text-center rounded hover:bg-[#990000]/10 transition-colors"
                >
                  Sign up
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 