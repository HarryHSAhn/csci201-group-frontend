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
      {[...Array(5)].map((_, index) => (
        <span key={index} className="text-xl">
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
      : d.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
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
        <div className="bg-red-100 text-red-700 p-6 rounded-md max-w-md">
          <h2 className="text-xl font-bold mb-4">Error</h2>
          <p>{error}</p>
          <Link
            to="/"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="max-w-5xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-6"
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
          <div className="md:col-span-2">
            <div className="uppercase tracking-wide text-sm text-purple-600 font-semibold">
              {menuItem.diningHall}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 whitespace-normal break-words leading-tight">
              {menuItem.name}
            </h1>
            <div className="mt-2 flex items-center">
              <StarRating rating={Math.round(menuItem.averageRating)} />
              <span className="ml-2 text-gray-600">
                {menuItem.averageRating.toFixed(1)}
              </span>
              <span className="ml-2 text-gray-500">
                ({menuItem.reviews.length} reviews)
              </span>
            </div>
            <p className="mt-4 text-gray-700">{menuItem.description}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Dietary Attributes
            </h2>
            {menuItem.keywords.length > 0 ? (
              <ul className="list-disc list-inside text-sm text-gray-700">
                {menuItem.keywords.map((kw) => (
                  <li key={kw}>{kw}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">None specified</p>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="p-8 border-t border-gray-200 bg-white rounded-b-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>

          <div className="mb-10">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Write a Review
            </h3>
            {isAuthenticated ? (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((r) => (
                      <button
                        key={r}
                        type="button"
                        className="text-2xl focus:outline-none"
                        onClick={() => handleRatingChange(r)}
                      >
                        {r <= newReview.rating ? (
                          <FaStar className="text-yellow-400" />
                        ) : (
                          <FaRegStar className="text-yellow-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="comment"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    rows={4}
                    value={newReview.comment}
                    onChange={handleReviewChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Share your thoughts about this dish..."
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <p className="text-gray-700 mb-3">Please log in to submit a review</p>
                <button
                  onClick={() => navigate('/login', { state: { from: `/menu-item/${id}` } })}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Log In
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {menuItem.reviews.length > 0 ? (
              menuItem.reviews.map((review) => (
                <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-gray-900">{review.user}</p>
                  <div className="mt-1 flex items-center">
                    <StarRating rating={review.rating} />
                    <span className="ml-2 text-sm text-gray-500">
                      {formatDate(review.timestamp)}
                    </span>
                  </div>
                  <p className="mt-3 text-gray-700">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-6">
                No reviews yet. Be the first to review this item!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
