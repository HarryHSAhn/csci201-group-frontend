import { useEffect, useState, useCallback, useMemo } from "react";
import { FaStar, FaRegStar, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Avatar from "boring-avatars";

// Mock user data
const mockUser = {
  id: "u123456",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  joinDate: "2022-06-15T10:30:00Z",
  totalReviews: 4
};

// API service (mock implementation for now)
const userService = {
  getCurrentUser: async () => {
    // This will be replaced with actual API call later
    return mockUser;
  },
  
  updateUserProfile: async (updates) => {
    // This will be replaced with actual API call later
    console.log("Profile updates to send:", updates);
    return { success: true };
  }
};

const reviewsService = {
  getReviews: async () => {
    // This will be replaced with actual API call later
    return mockReviews;
  },
  
  updateReview: async (updates) => {
    // This will be replaced with actual API call later
    console.log("Updates to send:", updates);
    return { success: true };
  },
  
  deleteReview: async (id) => {
    // This will be replaced with actual API call later
    console.log("Deleting review:", id);
    return { success: true };
  }
};

// Mock data for reviews
const mockReviews = [
  {
    id: 1,
    diningHall: "North Campus Dining Hall",
    menuItem: "Chicken Parmesan",
    rating: 5,
    comment: "Excellent dish! Perfectly cooked and great flavor.",
    timestamp: "2023-10-15T14:30:00Z"
  },
  {
    id: 2,
    diningHall: "South Campus Café",
    menuItem: "Vegetarian Burrito Bowl",
    rating: 4,
    comment: "The quality was outstanding. Fresh ingredients and good portion size.",
    timestamp: "2023-11-02T09:45:00Z"
  },
  {
    id: 3,
    diningHall: "Central Dining Commons",
    menuItem: "Beef Stir Fry",
    rating: 5,
    comment: "So tasty! The beef was tender and the vegetables were crisp.",
    timestamp: "2023-12-10T16:20:00Z"
  },
  {
    id: 4,
    diningHall: "West Side Eatery",
    menuItem: "Classic Cheeseburger",
    rating: 5,
    comment: "Perfect burger! Juicy patty and melty cheese.",
    timestamp: "2024-01-05T11:15:00Z"
  }
];

// User Profile Component
const UserProfileHeader = ({ user, isEditingProfile, setIsEditingProfile, profileData, setProfileData }) => {
  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      // Call API service to update profile
      const result = await userService.updateUserProfile(profileData);
      
      if (result.success) {
        setIsEditingProfile(false);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  // Format join date
  const formatJoinDate = (dateString) => {
    const date = new Date(dateString);
    return `Joined ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="flex-shrink-0">
          <Avatar
            size={120}
            name={user.id}
            variant="beam"
            colors={['#6366F1', '#8B5CF6', '#D946EF', '#EC4899', '#F472B6']}
          />
        </div>
        
        <div className="flex-grow space-y-3 text-center md:text-left">
          {isEditingProfile ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={profileData.name || ''}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={profileData.email || ''}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex gap-2 justify-center md:justify-start mt-4">
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-800">{profileData.name}</h1>
              <p className="text-gray-600">{profileData.email}</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-500 mt-2">
                <span>{formatJoinDate(user.joinDate)}</span>
                <span className="hidden sm:inline">•</span>
                <span>{user.totalReviews} {user.totalReviews === 1 ? 'Review' : 'Reviews'}</span>
              </div>
              <button
                onClick={() => setIsEditingProfile(true)}
                className="mt-3 px-4 py-1.5 text-sm border border-purple-200 text-purple-600 rounded-md hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Edit Profile
              </button>
            </>
          )}
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
  const [user, setUser] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({});
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

  // Fetch user data and reviews
  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch user profile
      const userData = await userService.getCurrentUser();
      setUser(userData);
      setProfileData({
        name: userData.name,
        email: userData.email
      });
      
      // Fetch reviews
      const reviewsData = await reviewsService.getReviews();
      setReviews(reviewsData);
      // filteredReviews will be set by useEffect
      
      setError(null);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setError("Failed to load user data. Please try again later.");
      toast.error("Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

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
          menuItem: review.menuItem
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
        // Preserve original timestamp
        timestamp: review.timestamp
      };

      // API call to update review
      const result = await reviewsService.updateReview(updatedReview);
      
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
          
          // No need to manually update filteredReviews since the useEffect will handle it
          // when reviews state changes
          
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
            onClick={fetchUserData}
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
        {user && (
          <UserProfileHeader 
            user={user} 
            isEditingProfile={isEditingProfile}
            setIsEditingProfile={setIsEditingProfile}
            profileData={profileData}
            setProfileData={setProfileData}
          />
        )}
        
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