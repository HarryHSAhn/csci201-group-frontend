import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaStar, FaRegStar, FaArrowLeft } from "react-icons/fa";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://localhost:8080/CSCI201Project";

const StarRating = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        const fillPercentage = Math.max(0, Math.min(100, (rating - index) * 100));
        
        return (
          <span key={index} className="text-xl relative">
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

export default function MenuItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menuItem, setMenuItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Check authentication status
  useEffect(() => {
    const loggedIn = Cookies.get('loggedIn') === 'true';
    const email = Cookies.get('userEmail');
    
    setIsAuthenticated(loggedIn);
    if (loggedIn && email) {
      setUserEmail(email);
    }
  }, []);

  useEffect(() => {
    const fetchMenuItem = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/GetMenuItem`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            food_id: id
          })
        });
        
        if (!response.ok) throw new Error("Server error");

        const data = await response.json();

        console.log(data);
        
        if (data.error) {
          setError(data.error);
          setIsLoading(false);
          return;
        }

        const food = data.food_item;
        const reviews = data.reviews.map((review) => ({
          id: review.review_id,
          user: review.user_email,
          rating: review.numerical_rating,
          comment: review.rating_description,
          timestamp: review.created_at,
        }));

        // Sort reviews by timestamp (newest first)
        reviews.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        const allergenFields = [
          { label: "Wheat/Gluten", value: food.wheat_gluten },
          { label: "Dairy", value: food.dairy },
          { label: "Halal Ingredients", value: food.halal },
          { label: "Vegetarian", value: food.vegetarian },
          { label: "Sesame", value: food.sesame },
          { label: "Soy", value: food.soy },
          { label: "Eggs", value: food.eggs },
          { label: "Pork", value: food.pork },
          { label: "Food Not Analyzed for Allergens", value: food.not_analyzed },
          { label: "Tree Nuts", value: food.tree_nuts },
          { label: "Shellfish", value: food.shellfish },
          { label: "Vegan", value: food.vegan },
          { label: "Fish", value: food.fish },
          { label: "Peanuts", value: food.peanuts },
        ];

        const keywords = allergenFields
          .filter((f) => f.value)
          .map((f) => f.label);

        setMenuItem({
          name: food.food_name,
          diningHall: food.dining_hall,
          averageRating: food.avg_rating || 0,
          description: `This is a featured item served at ${food.dining_hall}.`,
          nutritionalInfo: {},
          availability: [],
          reviews,
          keywords,
          foodItemId: food.id, // Store the UUID for review submission
        });
        setError(null);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load menu item.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenuItem();
  }, [id]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating) => {
    setNewReview((prev) => ({ ...prev, rating }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
  
    if (!isAuthenticated) {
      toast.error("Please log in to submit a review");
      navigate('/login', { state: { from: `/menu-item/${id}` } });
      return;
    }
  
    try {
      const response = await fetch(API_URL + "/NewReview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userEmail,
          item_id: menuItem.foodItemId,
          review_rating: newReview.rating.toString(),
          review_content: newReview.comment,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to submit review");
      }
  
      toast.success("Thank you for your review!");
      
      // Create new review object
      const currentDate = new Date().toISOString();
      const newReviewObj = {
        id: Date.now(), // temporary id
        user: userEmail,
        rating: newReview.rating,
        comment: newReview.comment,
        timestamp: currentDate
      };
      
      // Update menuItem state with new review
      setMenuItem(prevMenuItem => {
        // Calculate new average rating
        const totalRatings = prevMenuItem.reviews.reduce((sum, r) => sum + r.rating, 0) + newReview.rating;
        const newAvgRating = totalRatings / (prevMenuItem.reviews.length + 1);
        
        return {
          ...prevMenuItem,
          reviews: [newReviewObj, ...prevMenuItem.reviews],
          averageRating: newAvgRating
        };
      });
      
      // Reset review form
      setNewReview({ rating: 5, comment: "" });
  
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit your review. Please try again.");
    }
  };

  const formatDate = (timestamp) => {
    const d = new Date(timestamp);
    return isNaN(d)
      ? "Unknown date"
      : d.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#990000]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-[#990000] mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center text-[#990000] hover:text-[#800000] font-medium"
          >
            <FaArrowLeft className="mr-2" /> Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb and Back Button */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-[#990000] hover:text-[#800000] font-medium"
          >
            <FaArrowLeft className="mr-2" /> Back to Search
          </Link>
          <div className="text-sm text-gray-500">
            USC Dining Halls / {menuItem.diningHall}
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          {/* Header Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="text-sm font-medium text-[#990000] bg-[#990000]/10 px-3 py-1 rounded-full">
                    {menuItem.diningHall}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {menuItem.name}
                </h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <StarRating rating={menuItem.averageRating} />
                    <span className="ml-2 text-lg font-medium text-gray-900">
                      {menuItem.averageRating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-gray-500">
                    {menuItem.reviews.length} {menuItem.reviews.length === 1 ? 'review' : 'reviews'}
                  </span>
                </div>
              </div>
              
              {/* Dietary Attributes */}
              <div className="mt-4 md:mt-0 md:ml-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-2">
                  Dietary Information
                </h2>
                {menuItem.keywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {menuItem.keywords.map((kw) => (
                      <span key={kw} className="inline-block bg-[#990000]/10 text-[#990000] text-sm px-3 py-1 rounded-full">
                        {kw}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No dietary information available</p>
                )}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Reviews</h2>
              {isAuthenticated && (
                <button
                  onClick={() => document.getElementById('review-form').scrollIntoView({ behavior: 'smooth' })}
                  className="px-4 py-2 bg-[#990000] text-white rounded-md hover:bg-[#800000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#990000]"
                >
                  Write a Review
                </button>
              )}
            </div>

            {/* Review Form */}
            <div id="review-form" className="mb-10">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {isAuthenticated ? 'Write a Review' : 'Sign in to write a review'}
              </h3>
              {isAuthenticated ? (
                <form onSubmit={handleSubmitReview} className="space-y-4 bg-gray-50 p-6 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((r) => (
                        <button
                          key={r}
                          type="button"
                          className="text-3xl focus:outline-none transform hover:scale-110 transition-transform"
                          onClick={() => handleRatingChange(r)}
                        >
                          {r <= newReview.rating ? (
                            <FaStar className="text-[#FFCC00]" />
                          ) : (
                            <FaRegStar className="text-[#FFCC00]" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="comment"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Your Review
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      rows={4}
                      value={newReview.comment}
                      onChange={handleReviewChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#990000] focus:border-[#990000]"
                      placeholder="Share your experience with this dish..."
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#990000] text-white rounded-lg hover:bg-[#800000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#990000] font-medium"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <p className="text-gray-700 mb-4">Please sign in to share your experience</p>
                  <button
                    onClick={() => navigate('/login', { state: { from: `/menu-item/${id}` } })}
                    className="px-6 py-3 bg-[#990000] text-white rounded-lg hover:bg-[#800000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#990000] font-medium"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {menuItem.reviews.length > 0 ? (
                menuItem.reviews.map((review) => (
                  <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{review.user}</p>
                        <div className="mt-1 flex items-center">
                          <StarRating rating={review.rating} />
                          <span className="ml-2 text-sm text-gray-500">
                            {formatDate(review.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 text-gray-700">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 mb-2">No reviews yet</p>
                  <p className="text-gray-400">Be the first to review this dish!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
