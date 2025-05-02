import React, { useState, useEffect, useCallback } from 'react';
import '../css/searchitem.css';

const initialKeywords = [
  "McCarthy", "Parkside", "EVK", "Dairy", "Eggs", "Fish",
  "Food Not Analyzed for Allergens", "Halal Ingredients", "Peanuts",
  "Pork", "Sesame", "Shellfish", "Soy", "Tree Nuts", "Vegan",
  "Vegetarian", "Wheat / Gluten"
];

const allergensList = [
  "Dairy", "Eggs", "Fish", "Food Not Analyzed for Allergens", "Halal Ingredients",
  "Peanuts", "Pork", "Sesame", "Shellfish", "Soy", "Tree Nuts",
  "Vegan", "Vegetarian", "Wheat / Gluten"
];

const diningHallsList = ["McCarthy", "Parkside", "EVK"];
const sortOptions = [];

export default function Searchitem() {
  const [keywords, setKeywords] = useState(
    initialKeywords.map(k => ({ text: k, active: false }))
  );
  const [searchText, setSearchText] = useState('');
  const [diningHall, setDiningHall] = useState([]);
  const [allergen, setAllergen] = useState([]);
  const [sortLabel, setSortLabel] = useState('');
  const [results, setResults] = useState([]);

  const handleKeywordClick = (text) => {
    console.log("Keyword clicked:", text);
    setKeywords(prev =>
      prev.map(k =>
        k.text === text ? { ...k, active: !k.active } : k
      )
    );

    if (diningHallsList.includes(text)) {
      setDiningHall(prev =>
        prev.includes(text) ? prev.filter(k => k !== text) : [...prev, text]
      );
    } else if (allergensList.includes(text)) {
      setAllergen(prev =>
        prev.includes(text) ? prev.filter(k => k !== text) : [...prev, text]
      );
    }
  };

  const handleRemoveKeyword = (text) => {
    setKeywords(prev =>
      prev.map(k =>
        k.text === text ? { ...k, active: false } : k
      )
    );
    setDiningHall(prev => prev.filter(k => k !== text));
    setAllergen(prev => prev.filter(k => k !== text));
  };

  const handleSortClick = (label) => {
    setSortLabel(prev => (prev === label ? "" : label));
  };

  const fetchData = useCallback(async () => {
    console.log("fetchData() entered");
    try {
      const params = new URLSearchParams();
      diningHall.forEach(h => params.append("DiningHall", h));
      allergen.forEach(a => params.append("allergens", a));
      if (searchText.trim() !== '') {
        params.append("search", searchText.trim());
      }

      const query = params.toString();
      console.log("Query:", query);

      const response = await fetch(`http://localhost:8080/CSCI201Project/searchServlet?${query}`);
      const json = await response.json();
      console.log("Response:", json);

      setResults(Array.isArray(json) ? json : [json]);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }, [diningHall, allergen, searchText]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearchInput = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchData();
    }
  };

  const sortedKeywords = [...keywords].sort((a, b) => b.active - a.active);

  return (
    <div>
      <div className="container">
        {/* Sidebar */}
        <div className="sidebar">
          <h4>Keywords</h4>
          <div className="keywords">
            {sortedKeywords.map((keyword) => (
              <div
                key={keyword.text}
                className={`keyword ${keyword.active ? 'active' : ''}`}
                onClick={() => handleKeywordClick(keyword.text)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  handleRemoveKeyword(keyword.text);
                }}
              >
                <span>{keyword.text}</span>
                {keyword.active && (
                  <button
                    className="remove-button"
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

        {/* Main content */}
        <div className="main">
          <div className="top-controls">
            <input
              className="search-box"
              type="text"
              placeholder="Search"
              value={searchText}
              onChange={handleSearchInput}
              onKeyDown={handleSearchKeyPress}
              autoComplete="off"
            />
            <div className="sort-buttons">
              {sortOptions.map(option => (
                <button
                  key={option}
                  className={`sort-button ${sortLabel === option ? 'active' : ''}`}
                  onClick={() => handleSortClick(option)}
                >
                  {sortLabel === option ? `✓ ${option}` : option}
                </button>
              ))}
            </div>
          </div>

          {/* Results grid */}
          <div className="grid">
            {results.length > 0 ? (
              results.map((item, i) => (
                <div key={i} className="item-card">
                  <strong>{item.foodItem.name}</strong>
                  <br />
                  Rating: {item.review.numericalRating.toFixed(1)}
                </div>
              ))
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
