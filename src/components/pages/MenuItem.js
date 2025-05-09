import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaStar, FaRegStar, FaArrowLeft } from "react-icons/fa";

// Star Rating Component
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
  const { id } = useParams(); // id = food name from URL
  const [menuItem, setMenuItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    const fetchMenuItem = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/CSCI201Project/searchServlet?search=${encodeURIComponent(
            id
          )}`
        );
        if (!response.ok) throw new Error("Server error");

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
          setError("Menu item not found.");
          setIsLoading(false);
          return;
        }

        // Extract core food info
        const food = data[0].foodItem;

        // Extract all associated reviews
        const reviews = data.map((entry) => ({
          id: entry.review.created_at + entry.review.user,
          user: entry.review.user,
          rating: entry.review.numericalRating,
          comment: entry.review.ratingDescription,
          timestamp: entry.review.created_at,
        }));
        const imageKeyword = food.name.split(" ").slice(0, 2).join(" ");

        const menuData = {
          name: food.name,
          diningHall: food.diningHall,
          // image: `https://source.unsplash.com/random/400x300/?${encodeURIComponent(
          //   food.name
          // )}`,

          image: `https://source.unsplash.com/random/400x300/?${encodeURIComponent(
            imageKeyword
          )}`,

          averageRating:
            reviews.length > 0
              ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
              : 0,
          nutritionalInfo: {},
          availability: [],
          reviews,
        };

        setMenuItem(menuData);
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

  const handleSubmitReview = (e) => {
    e.preventDefault();
    console.log("Submitting review:", newReview);
    alert("Thank you for your review!");
    setNewReview({ rating: 5, comment: "" });
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
      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-6"
        >
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
                <span className="ml-2 text-gray-600">
                  {menuItem.averageRating.toFixed(1)}
                </span>
                <span className="ml-2 text-gray-500">
                  ({menuItem.reviews.length} reviews)
                </span>
              </div>
              <p className="mt-4 text-gray-700">
                {/* Optionally add a description field here if you extend backend */}
                This is a featured item served at {menuItem.diningHall}.
              </p>
            </div>
          </div>

          <div className="p-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>

            <div className="mb-10">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Write a Review
              </h3>
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
            </div>

            <div className="space-y-6">
              {menuItem.reviews.map((review) => (
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
