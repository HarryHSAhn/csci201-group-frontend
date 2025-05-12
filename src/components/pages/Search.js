import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaRegStar, FaSearch, FaFilter, FaSort, FaSortAmountDown, FaSortAmountDownAlt } from "react-icons/fa";

// Component for displaying star ratings
const StarRating = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        const fillPercentage = Math.max(0, Math.min(100, (rating - index) * 100));
        
        return (
          <span key={index} className="text-sm relative">
            <FaRegStar className="text-yellow-400" />
            {fillPercentage > 0 && (
              <div 
                className="absolute top-0 left-0 overflow-hidden" 
                style={{ width: `${fillPercentage}%` }}
              >
                <FaStar className="text-yellow-400" />
              </div>
            )}
          </span>
        );
      })}
    </div>
  );
};

const initialKeywords = [
  "McCarthy",
  "Parkside",
  "EVK",
  "Dairy",
  "Eggs",
  "Fish",
  "Food Not Analyzed for Allergens",
  "Halal Ingredients",
  "Peanuts",
  "Pork",
  "Sesame",
  "Shellfish",
  "Soy",
  "Tree Nuts",
  "Vegan",
  "Vegetarian",
  "Wheat / Gluten",
];

const allergensList = [
  "Dairy",
  "Eggs",
  "Fish",
  "Food Not Analyzed for Allergens",
  "Halal Ingredients",
  "Peanuts",
  "Pork",
  "Sesame",
  "Shellfish",
  "Soy",
  "Tree Nuts",
  "Vegan",
  "Vegetarian",
  "Wheat / Gluten",
];

const diningHallsList = ["McCarthy", "Parkside", "EVK"];
const sortOptions = [
  { id: "rating_high", label: "Rating (High to Low)", icon: <FaSortAmountDown className="mr-2" /> },
  { id: "rating_low", label: "Rating (Low to High)", icon: <FaSortAmountDownAlt className="mr-2" /> },
  { id: "name_asc", label: "Name (A to Z)", icon: <FaSort className="mr-2" /> },
  { id: "name_desc", label: "Name (Z to A)", icon: <FaSort className="mr-2" /> },
  { id: "dining_hall", label: "Dining Hall", icon: <FaSort className="mr-2" /> },
  { id: "newest", label: "Newest First", icon: <FaSort className="mr-2" /> }
];

export default function Searchitem() {
  const [keywords, setKeywords] = useState(
    initialKeywords.map((k) => ({ text: k, active: false }))
  );
  const [searchText, setSearchText] = useState("");
  const [diningHall, setDiningHall] = useState([]);
  const [allergen, setAllergen] = useState([]);
  const [sortOption, setSortOption] = useState("rating_high");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortedResults, setSortedResults] = useState([]);

  const handleKeywordClick = (text) => {
    setKeywords((prev) =>
      prev.map((k) => (k.text === text ? { ...k, active: !k.active } : k))
    );

    if (diningHallsList.includes(text)) {
      setDiningHall((prev) =>
        prev.includes(text) ? prev.filter((k) => k !== text) : [...prev, text]
      );
    } else if (allergensList.includes(text)) {
      setAllergen((prev) =>
        prev.includes(text) ? prev.filter((k) => k !== text) : [...prev, text]
      );
    }
  };

  const handleRemoveKeyword = (text) => {
    setKeywords((prev) =>
      prev.map((k) => (k.text === text ? { ...k, active: false } : k))
    );
    setDiningHall((prev) => prev.filter((k) => k !== text));
    setAllergen((prev) => prev.filter((k) => k !== text));
  };

  const handleSortClick = (sortId) => {
    setSortOption(sortId);
    setShowSortMenu(false);
  };

  // Apply sorting to results
  useEffect(() => {
    if (!results.length) {
      setSortedResults([]);
      return;
    }

    let sorted = [...results];

    switch (sortOption) {
      case "rating_high":
        sorted.sort((a, b) => {
          const ratingA = a.review ? a.review.numericalRating : 0;
          const ratingB = b.review ? b.review.numericalRating : 0;
          return ratingB - ratingA;
        });
        break;
      case "rating_low":
        sorted.sort((a, b) => {
          const ratingA = a.review ? a.review.numericalRating : 0;
          const ratingB = b.review ? b.review.numericalRating : 0;
          return ratingA - ratingB;
        });
        break;
      case "name_asc":
        sorted.sort((a, b) => a.foodItem.name.localeCompare(b.foodItem.name));
        break;
      case "name_desc":
        sorted.sort((a, b) => b.foodItem.name.localeCompare(a.foodItem.name));
        break;
      case "dining_hall":
        sorted.sort((a, b) => a.foodItem.diningHall.localeCompare(b.foodItem.diningHall));
        break;
      case "newest":
        sorted.sort((a, b) => {
          const dateA = a.review ? new Date(a.review.created_at) : new Date(0);
          const dateB = b.review ? new Date(b.review.created_at) : new Date(0);
          return dateB - dateA;
        });
        break;
      default:
        // Default sort by rating if no sort option selected
        sorted.sort((a, b) => {
          const ratingA = a.review ? a.review.numericalRating : 0;
          const ratingB = b.review ? b.review.numericalRating : 0;
          return ratingB - ratingA;
        });
    }

    setSortedResults(sorted);
  }, [results, sortOption]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      diningHall.forEach((h) => params.append("DiningHall", h));
      allergen.forEach((a) => params.append("allergens", a));
      if (searchText.trim() !== "") {
        params.append("search", searchText.trim());
      }

      const query = params.toString();

      const response = await fetch(
        `http://localhost:8080/CSCI201Project/searchServlet?${query}`
      );
      const json = await response.json();

      const data = Array.isArray(json) ? json : [json];
      setResults(data);

      console.log("search results", data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [diningHall, allergen, searchText]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Initialize sortedResults with results
  useEffect(() => {
    if (results.length > 0) {
      // Apply initial high-to-low sorting
      const sorted = [...results].sort((a, b) => {
        const ratingA = a.review ? a.review.numericalRating : 0;
        const ratingB = b.review ? b.review.numericalRating : 0;
        return ratingB - ratingA;
      });
      setSortedResults(sorted);
    } else {
      setSortedResults([]);
    }
  }, [results]);

  console.log("sorted results", sortedResults);

  const handleSearchInput = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchData();
    }
  };

  const sortedKeywords = [...keywords].sort((a, b) => b.active - a.active);

  // Group active keywords by category
  const activeKeywords = sortedKeywords.filter(k => k.active);
  const activeDiningHalls = activeKeywords.filter(k => diningHallsList.includes(k.text));
  const activeDietary = activeKeywords.filter(k => allergensList.includes(k.text));

  // Get current sort option label
  const currentSortOption = sortOptions.find(opt => opt.id === sortOption) || sortOptions[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row h-full">
        {/* Sidebar */}
        <div className="md:w-1/4 bg-white p-4 md:p-6 border-r border-gray-200 md:min-h-screen">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Filters</h3>
          
          {/* Dining Hall Section */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Dining Halls</h4>
            <div className="space-y-2">
              {sortedKeywords.filter(k => diningHallsList.includes(k.text)).map((keyword) => (
                <div
                  key={keyword.text}
                  onClick={() => handleKeywordClick(keyword.text)}
                  className={`px-3 py-2 rounded-md cursor-pointer flex items-center justify-between transition-colors ${
                    keyword.active 
                      ? "bg-[#990000]/10 text-[#990000] font-medium" 
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span>{keyword.text}</span>
                  {keyword.active && (
                    <button
                      className="text-[#990000] hover:text-[#800000]"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveKeyword(keyword.text);
                      }}
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Dietary Restrictions Section */}
          <div>
            <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">Dietary Options</h4>
            <div className="grid grid-cols-1 gap-2">
              {sortedKeywords.filter(k => allergensList.includes(k.text)).map((keyword) => (
                <div
                  key={keyword.text}
                  onClick={() => handleKeywordClick(keyword.text)}
                  className={`px-3 py-2 rounded-md cursor-pointer flex items-center justify-between transition-colors ${
                    keyword.active 
                      ? "bg-[#990000]/10 text-[#990000] font-medium" 
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span>{keyword.text}</span>
                  {keyword.active && (
                    <button
                      className="text-[#990000] hover:text-[#800000]"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveKeyword(keyword.text);
                      }}
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 md:p-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for food items..."
                value={searchText}
                onChange={handleSearchInput}
                onKeyDown={handleSearchKeyPress}
                className="w-full px-4 py-3 pl-10 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#990000] focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <button 
                onClick={fetchData}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#990000] text-white px-2 py-1 rounded-md text-sm hover:bg-[#800000]"
              >
                Search
              </button>
            </div>
            
            {/* Active filters display */}
            {activeKeywords.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {activeDiningHalls.length > 0 && (
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-gray-600">Dining Halls:</span>
                    {activeDiningHalls.map(k => (
                      <span key={k.text} className="bg-[#990000]/10 text-[#990000] px-2 py-1 rounded-md flex items-center">
                        {k.text}
                        <button 
                          className="ml-1 text-[#990000] hover:text-[#800000]" 
                          onClick={() => handleRemoveKeyword(k.text)}
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                
                {activeDietary.length > 0 && (
                  <div className="flex items-center gap-1 text-sm flex-wrap">
                    <span className="text-gray-600">Dietary:</span>
                    {activeDietary.map(k => (
                      <span key={k.text} className="bg-[#990000]/10 text-[#990000] px-2 py-1 rounded-md flex items-center">
                        {k.text}
                        <button 
                          className="ml-1 text-[#990000] hover:text-[#800000]" 
                          onClick={() => handleRemoveKeyword(k.text)}
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Results count and sorting */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-medium text-gray-800">
              {results.length} {results.length === 1 ? 'Result' : 'Results'}
            </h2>
            
            <div className="flex items-center">
              {/* Sort dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#990000] focus:ring-opacity-50"
                >
                  <FaSort className="mr-2 text-gray-500" />
                  <span>Sort: {currentSortOption.label}</span>
                </button>
                
                {showSortMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    {sortOptions.map(option => (
                      <button
                        key={option.id}
                        onClick={() => handleSortClick(option.id)}
                        className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                          sortOption === option.id 
                            ? 'bg-[#990000]/10 text-[#990000]' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {option.icon}
                        {option.label}
                        {sortOption === option.id && (
                          <span className="ml-auto text-[#990000]">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#990000]"></div>
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedResults.map((item) => (
                <Link
                  key={item.foodItem.food_id}
                  to={`/menu-item/${encodeURIComponent(item.foodItem.food_id)}`}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-[#990000] transition-all overflow-hidden flex flex-col"
                >
                  <div className="p-4 flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 text-lg mb-1">{item.foodItem.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{item.foodItem.diningHall}</p>
                      </div>
                    </div>
                    
                    {/* Star Rating */}
                    {item.review ? (
                      <div className="mt-2 flex items-center gap-2">
                        <StarRating rating={item.review.numericalRating} />
                        <span className="text-sm text-gray-600">
                          {item.review.numericalRating.toFixed(1)} ({item.review.reviewCount || 1} {item.review.reviewCount === 1 ? 'review' : 'reviews'})
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic mt-2">No reviews yet</p>
                    )}
                  </div>
                  
                  {/* Dietary tags */}
                  {item.foodItem.allergens && (
                    <div className="border-t border-gray-100 p-3 bg-gray-50">
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(item.foodItem)
                          .filter(([key, value]) => 
                            allergensList.some(a => a.toLowerCase() === key.toLowerCase()) && value === true
                          )
                          .map(([key]) => (
                            <span key={key} className="inline-block bg-[#990000]/10 text-[#990000] text-xs px-2 py-1 rounded">
                              {key}
                            </span>
                          ))
                        }
                      </div>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="text-gray-500">No results found</div>
              <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
