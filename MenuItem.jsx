import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Taskbar from "../components/Taskbar";

function MenuItem() {
  const { foodName } = useParams();
  const [foodItem, setFoodItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const baseUrl = "http://localhost:8080/CSCI201Project/searchServlet";

    const queryParams = new URLSearchParams({ search: foodName });

    fetch(`${baseUrl}?${queryParams.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) {
          setError("No results found.");
          setLoading(false);
          return;
        }

        const firstItem = data[0];
        setFoodItem(firstItem.foodItem);

        const matchingReviews = data
          .filter(
            (item) =>
              item.foodItem?.name === firstItem.foodItem.name &&
              item.review?.ratingDescription
          )
          .map((item) => item.review);

        setReviews(matchingReviews);
        setLoading(false);
      })
      .catch((err) => {
        setError("Could not fetch data from server.");
        setLoading(false);
      });
  }, [foodName]);

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2 style={{ color: "red" }}>{error}</h2>;

  return (
    <>
      <Taskbar />
      <div style={{ fontFamily: "Arial", margin: "30px" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h2>{foodItem.name}</h2>
          <p>Rating: {foodItem.avgRating}</p>
          <p>{foodItem.diningHall}</p>
        </div>

        <div style={{ borderTop: "1px solid black", margin: "30px 0" }}></div>

        <div>
          {reviews.map((review, index) => (
            <div key={index} style={{ marginBottom: "30px" }}>
              <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
                Review {index + 1}
              </div>
              <div
                style={{
                  backgroundColor: "#888",
                  color: "#fff",
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                {review.ratingDescription}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default MenuItem;
