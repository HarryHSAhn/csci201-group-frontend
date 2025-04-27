function MenuItem() {
  return (
    <>
      <Taskbar />
      <div style={{ fontFamily: "Arial, sans-serif", margin: "20px" }}>
        <div
          className="food-info"
          style={{ textAlign: "center", marginBottom: "20px" }}
        >
          <h2 id="foodName">Food Item Name</h2>
          <p id="foodRating">Food Item Rating</p>
          <p id="foodDiningHall">Food Item Dining Hall</p>
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
              Review 1
            </div>
            <div
              className="review-content"
              style={{
                backgroundColor: "#cccccc",
                padding: "10px",
                textAlign: "center",
              }}
            >
              Review Content
            </div>
          </div>

          <div className="review" style={{ marginBottom: "20px" }}>
            <div
              className="review-title"
              style={{ fontWeight: "bold", marginBottom: "5px" }}
            >
              Review 2
            </div>
            <div
              className="review-content"
              style={{
                backgroundColor: "#cccccc",
                padding: "10px",
                textAlign: "center",
              }}
            >
              Review Content
            </div>
          </div>

          <div className="review" style={{ marginBottom: "20px" }}>
            <div
              className="review-title"
              style={{ fontWeight: "bold", marginBottom: "5px" }}
            >
              Review 3
            </div>
            <div
              className="review-content"
              style={{
                backgroundColor: "#cccccc",
                padding: "10px",
                textAlign: "center",
              }}
            >
              Review Content
            </div>
          </div>

          <div className="review" style={{ marginBottom: "20px" }}>
            <div
              className="review-title"
              style={{ fontWeight: "bold", marginBottom: "5px" }}
            >
              Review 4
            </div>
            <div
              className="review-content"
              style={{
                backgroundColor: "#cccccc",
                padding: "10px",
                textAlign: "center",
              }}
            >
              Review Content
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
