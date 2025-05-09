import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaRegStar, FaArrowLeft } from 'react-icons/fa';

// Star Rating Component
const StarRating = ({ rating }) => {
  const stars = Array(5).fill(0);
  
  return (
    <div className="flex">
      {stars.map((_, index) => {
        const ratingValue = index + 1;
        return (
          <span key={index} className="text-xl">
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

// Mock data for a menu item
const mockMenuItem = {
  id: 1,
  name: "Chicken Parmesan",
  description: "Breaded chicken breast topped with marinara sauce and melted mozzarella cheese, served with spaghetti pasta.",
  diningHall: "North Campus Dining Hall",
  image: "https://source.unsplash.com/random/400x300/?chicken-parmesan",
  nutritionalInfo: {
    calories: 650,
    protein: "42g",
    carbs: "68g",
    fat: "22g"
  },
  availability: ["Monday", "Wednesday", "Friday"],
  averageRating: 4.2,
  reviews: [
    {
      id: 101,
      user: "Alex J.",
      rating: 5,
      comment: "Excellent dish! Perfectly cooked and great flavor.",
      timestamp: "2023-10-15T14:30:00Z"
    },
    {
      id: 102,
      user: "Taylor S.",
      rating: 4,
      comment: "Very good. Sauce was a bit too salty for my taste.",
      timestamp: "2023-11-05T18:21:00Z"
    },
    {
      id: 103,
      user: "Jamie L.",
      rating: 4,
      comment: "One of the better options at North Campus.",
      timestamp: "2023-12-10T12:15:00Z"
    }
  ]
};

export default function MenuItem() {
  const { id } = useParams();
  const [menuItem, setMenuItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ""
  });

  useEffect(() => {
    const fetchMenuItem = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call using the id from params
        // For now, we'll use our mock data
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        setMenuItem(mockMenuItem);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch menu item:", error);
        setError("Failed to load menu item. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMenuItem();
  }, [id]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (newRating) => {
    setNewReview(prev => ({
      ...prev,
      rating: newRating
    }));
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    // In a real app, this would be an API call
    console.log("Submitting review:", newReview);
    alert("Thank you for your review! It will appear after moderation.");
    setNewReview({
      rating: 5,
      comment: ""
    });
  };

  // Format date
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
        <div className="bg-red-100 text-red-700 p-6 rounded-md max-w-md">
          <h2 className="text-xl font-bold mb-4">Error</h2>
          <p>{error}</p>
          <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (!menuItem) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-yellow-100 text-yellow-800 p-6 rounded-md max-w-md">
          <h2 className="text-xl font-bold mb-4">Item Not Found</h2>
          <p>The menu item you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-6">
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img 
                className="h-64 w-full object-cover md:w-64" 
                src={menuItem.image} 
                alt={menuItem.name} 
              />
            </div>
            <div className="p-8">
              <div className="uppercase tracking-wide text-sm text-purple-600 font-semibold">
                {menuItem.diningHall}
              </div>
              <h1 className="mt-1 text-3xl font-bold text-gray-900">
                {menuItem.name}
              </h1>
              <div className="mt-2 flex items-center">
                <StarRating rating={Math.round(menuItem.averageRating)} />
                <span className="ml-2 text-gray-600">{menuItem.averageRating.toFixed(1)}</span>
                <span className="ml-2 text-gray-500">({menuItem.reviews.length} reviews)</span>
              </div>
              <p className="mt-4 text-gray-700">
                {menuItem.description}
              </p>
              
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900">Nutritional Information</h2>
                <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-500">Calories:</span> {menuItem.nutritionalInfo.calories}
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Protein:</span> {menuItem.nutritionalInfo.protein}
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Carbs:</span> {menuItem.nutritionalInfo.carbs}
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Fat:</span> {menuItem.nutritionalInfo.fat}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900">Available On</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {menuItem.availability.map((day) => (
                    <span key={day} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
            
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        className="text-2xl focus:outline-none"
                        onClick={() => handleRatingChange(rating)}
                      >
                        {rating <= newReview.rating ? (
                          <FaStar className="text-yellow-400" />
                        ) : (
                          <FaRegStar className="text-yellow-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
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
            </div>
            
            <div className="space-y-6">
              {menuItem.reviews.map((review) => (
                <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
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
                  <p className="mt-3 text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
