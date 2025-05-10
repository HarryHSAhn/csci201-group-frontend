import { useEffect, useState, useCallback, useMemo } from "react";
import { FaStar, FaRegStar, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Avatar from "boring-avatars";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080/CSCI201Project";

// API service for reviews
const reviewsService = {
  getReviews: async (userEmail) => {
    try {
      const res = await fetch(API_URL + "/userShowReview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: userEmail })
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch reviews: ${res.status}`);
      }

      const data = await res.json();

      // Map response into frontend format
      return data.map((item, index) => ({
        id: item.review_id || index + 1,
        menuItem: item.Food_Item_Name,
        rating: item.Numerical_Rating,
        comment: item.Rating_Description,
        diningHall: item.food_item?.dining_hall || "Unknown",
        timestamp: item.review_created_at || new Date().toISOString(),
        foodItemId: item.fooditem_uuid // Save the UUID of the food item
      }));
    } catch (err) {
      console.error("Error fetching reviews:", err);
      return [];
    }
  },

  updateReview: async (updates, username) => {
    try {
      const res = await fetch(API_URL + "/userEditReview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          review_rating: updates.rating.toString(),
          review_content: updates.comment,
          item_id: updates.foodItemId
        })
      });

      if (!res.ok) {
        throw new Error(`Failed to update review: ${res.status}`);
      }

      return { success: true };
    } catch (err) {
      console.error("Error updating review:", err);
      throw err;
    }
  },

  deleteReview: async (id) => {
    // TODO: Hook into your delete-review servlet (if implemented)
    console.log("Deleting review:", id);
    return { success: true };
  }
};

// User Profile Header Component (simplified to just show email)
const UserProfileHeader = ({ userEmail }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="flex-shrink-0">
          <Avatar
            size={120}
            name={userEmail}
            variant="beam"
            colors={['#6366F1', '#8B5CF6', '#D946EF', '#EC4899', '#F472B6']}
          />
        </div>
        
        <div className="flex-grow space-y-3 text-center md:text-left">
          <h1 className="text-2xl font-bold text-gray-800">User Profile</h1>
          <p className="text-gray-600">{userEmail}</p>
        </div>
      </div>
    </div>
  );
};

// Star Rating Component
const StarRating = ({ rating, editable = false, onChange }) => {
  const stars = Array(5).fill(0);
  
  return (
    <div className="flex">
      {stars.map((_, index) => {
        const ratingValue = index + 1;
        return (
          <span 
            key={index} 
            className={`cursor-${editable ? 'pointer' : 'default'} text-xl`}
            onClick={() => editable && onChange(ratingValue)}
          >
            {ratingValue <= rating ? (
              <FaStar className="text-yellow-400" />
            ) : (
              <FaRegStar className="text-yellow-400" />
            )}
          </span>
        );
      })}
    </div>
  );
};

export default function UserProfile() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [diningHallFilter, setDiningHallFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest"); // "newest" or "oldest"
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editStates, setEditStates] = useState({});
  const [editedReviews, setEditedReviews] = useState({});

  // Get unique dining halls for filter dropdown
  const uniqueDiningHalls = useMemo(() => {
    const halls = reviews.map(review => review.diningHall);
    return [...new Set(halls)];
  }, [reviews]);

  // Check if user is logged in
  useEffect(() => {
    const loggedIn = Cookies.get('loggedIn') === 'true';
    if (!loggedIn) {
      // Redirect to login if not logged in
      toast.error("Please log in to view your profile");
      navigate('/login');
      return;
    }
    
    // Get user email from cookies
    const email = Cookies.get('userEmail');
    if (!email) {
      toast.error("User information not found");
      navigate('/login');
      return;
    }
    
    setUserEmail(email);
  }, [navigate]);

  // Filter and sort reviews when filter or sort option changes
  useEffect(() => {
    let result = [...reviews];
    
    // Apply dining hall filter
    if (diningHallFilter !== "all") {
      result = result.filter(review => review.diningHall === diningHallFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      
      return sortOption === "newest" 
        ? dateB - dateA // Newest first
        : dateA - dateB; // Oldest first
    });
    
    setFilteredReviews(result);
  }, [reviews, diningHallFilter, sortOption]);

  // Fetch user reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!userEmail) return;
      
      setIsLoading(true);
      try {
        // Fetch reviews using the email from cookies
        const reviewsData = await reviewsService.getReviews(userEmail);
        setReviews(reviewsData);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        setError("Failed to load your reviews. Please try again later.");
        toast.error("Failed to load your reviews");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [userEmail]);

  // Handle edit mode toggle
  const handleEditClick = (id) => {
    setEditStates((prev) => ({ ...prev, [id]: true }));
    const review = reviews.find((r) => r.id === id);
    if (review) {
      setEditedReviews((prev) => ({
        ...prev,
        [id]: { 
          rating: review.rating, 
          comment: review.comment,
          // Preserve these fields but they won't be editable
          diningHall: review.diningHall,
          menuItem: review.menuItem,
          foodItemId: review.foodItemId
        },
      }));
    }
  };

  // Handle cancel edit
  const handleCancelEdit = (id) => {
    setEditStates((prev) => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
    
    setEditedReviews((prev) => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  // Handle field changes in edit mode
  const handleFieldChange = (id, field, value) => {
    setEditedReviews((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  // Handle save changes
  const handleSave = async (id) => {
    try {
      const review = reviews.find(r => r.id === id);
      const updatedReview = {
        id,
        // Preserve original dining hall and menu item
        diningHall: review.diningHall,
        menuItem: review.menuItem,
        // Only update rating and comment
        rating: editedReviews[id].rating,
        comment: editedReviews[id].comment,
        // Preserve original timestamp and foodItemId
        timestamp: review.timestamp,
        foodItemId: review.foodItemId
      };

      // API call to update review using the logged-in email
      const result = await reviewsService.updateReview(updatedReview, userEmail);
      
      if (result.success) {
        // Update local state
        setReviews(prevReviews => 
          prevReviews.map(review => 
            review.id === id ? { 
              ...review, 
              rating: editedReviews[id].rating,
              comment: editedReviews[id].comment
            } : review
          )
        );
        
        // Clear edit states
        handleCancelEdit(id);
        
        toast.success("Review updated successfully");
      }
    } catch (error) {
      console.error("Failed to save update:", error);
      toast.error("Failed to update review");
    }
  };

  // Handle delete review
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        // API call to delete review
        const result = await reviewsService.deleteReview(id);
        
        if (result.success) {
          // Update local state
          const updatedReviews = reviews.filter(review => review.id !== id);
          setReviews(updatedReviews);
          
          toast.success("Review deleted successfully");
        }
      } catch (error) {
        console.error("Failed to delete review:", error);
        toast.error("Failed to delete review");
      }
    }
  };

  // Format timestamp
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error}
          <button 
            onClick={() => window.location.reload()}
            className="ml-4 px-3 py-1 bg-red-200 text-red-800 rounded-md hover:bg-red-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-10 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen">
      <div className="w-full max-w-3xl px-4">
        <UserProfileHeader userEmail={userEmail} />
        
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-purple-800">Your Past Reviews</h2>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <select
                  value={diningHallFilter}
                  onChange={(e) => setDiningHallFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Dining Halls</option>
                  {uniqueDiningHalls.map((hall) => (
                    <option key={hall} value={hall}>
                      {hall}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  onClick={() => setSortOption("newest")}
                  className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                    sortOption === "newest"
                      ? "bg-purple-100 text-purple-700 border-purple-200"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Newest
                </button>
                <button
                  type="button"
                  onClick={() => setSortOption("oldest")}
                  className={`px-4 py-2 text-sm font-medium rounded-r-md border-t border-b border-r ${
                    sortOption === "oldest"
                      ? "bg-purple-100 text-purple-700 border-purple-200"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Oldest
                </button>
              </div>
            </div>
          </div>

          {filteredReviews.length === 0 ? (
            <p className="text-center text-gray-500 py-6">
              {reviews.length === 0 
                ? "You haven't submitted any reviews yet." 
                : "No reviews match your filter criteria."}
            </p>
          ) : (
            <div className="space-y-6">
              {filteredReviews.map((review) => (
                <div 
                  key={review.id} 
                  className="bg-white border border-gray-100 rounded-lg shadow-sm p-5 transition-all hover:shadow-md"
                >
                  <div className="flex flex-col space-y-2 mb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-purple-900">{review.menuItem}</h3>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Dining Hall:</span> {review.diningHall}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        {editStates[review.id] ? (
                          <>
                            <button
                              onClick={() => handleSave(review.id)}
                              className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full transition-colors"
                              title="Save"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => handleCancelEdit(review.id)}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                              title="Cancel"
                            >
                              <FaTimes />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditClick(review.id)}
                              className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full transition-colors"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(review.id)}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      {editStates[review.id] ? (
                        <div>
                          <StarRating 
                            rating={editedReviews[review.id]?.rating || 0} 
                            editable={true}
                            onChange={(newRating) => handleFieldChange(review.id, "rating", newRating)}
                          />
                        </div>
                      ) : (
                        <div>
                          <StarRating rating={review.rating} />
                        </div>
                      )}
                      <p className="text-xs text-gray-500">{formatDate(review.timestamp)}</p>
                    </div>
                  </div>

                  {editStates[review.id] ? (
                    <div className="mt-3">
                      <textarea
                        value={editedReviews[review.id]?.comment || ""}
                        onChange={(e) => handleFieldChange(review.id, "comment", e.target.value)}
                        placeholder="Your review"
                        className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[100px] text-gray-700"
                      />
                    </div>
                  ) : (
                    <p className="mt-3 text-gray-700">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}