import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Taskbar from "../components/Taskbar";

function MenuItem() {
  const { foodName } = useParams(); // assuming route: /menuitem/:foodName
  const [foodData, setFoodData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Construct the search URL based on your backend structure
    const queryParams = new URLSearchParams({
      search: foodName,
    });

    fetch(`/searchServlet?${queryParams.toString()}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.length === 0) {
          setError("No food item found.");
        } else {
          setFoodData(data[0]); // use the first result
        }
      })
      .catch((err) => {
        console.error("Error fetching food data:", err);
        setError("Server error or data unavailable.");
      });
  }, [foodName]);

  if (error) return <h2>{error}</h2>;
  if (!foodData) return <h2>Loading...</h2>;

  const { foodItem, review } = foodData;

  return (
    <>
      <Taskbar />
      <div style={{ fontFamily: "Arial, sans-serif", margin: "20px" }}>
        <div
          className="food-info"
          style={{ textAlign: "center", marginBottom: "20px" }}
        >
          <h2 id="foodName">{foodItem.name}</h2>
          <p id="foodRating">Rating: {foodItem.avgRating ?? "N/A"}</p>
          <p id="foodDiningHall">{foodItem.diningHall}</p>
        </div>

        <div
          className="divider"
          style={{ borderTop: "1px solid #000", margin: "20px 0" }}
        ></div>

        <div id="reviewsContainer">
          <div className="review" style={{ marginBottom: "20px" }}>
            <div
              className="review-title"
              style={{ fontWeight: "bold", marginBottom: "5px" }}
            >
              {review.user} — {review.createdAt}
            </div>
            <div
              className="review-content"
              style={{
                backgroundColor: "#cccccc",
                padding: "10px",
                textAlign: "center",
              }}
            >
              {review.ratingDescription}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MenuItem;
