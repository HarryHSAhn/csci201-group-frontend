import React, { useState } from 'react';
import Taskbar from '../components/Taskbar';
import '../css/index.css';

const initialKeywords = [
  "McCarthy", "Parkside", "EVK", "Dairy", "Eggs", "Fish",
  "Food Not Analyzed for Allergens", "Halal Ingredients", "Peanuts",
  "Pork", "Sesame", "Shellfish", "Soy", "Tree Nuts", "Vegan",
  "Vegetarian", "Wheat / Gluten"
];

const sortOptions = ["New", "Rating descending", "Rating ascending"];

function Searchitem() {
  const [keywords, setKeywords] = useState(
    initialKeywords.map(k => ({ text: k, active: false }))
  );
  const [sortLabel, setSortLabel] = useState("");

  const handleKeywordClick = (text) => {
    setKeywords(prev =>
      prev.map(k =>
        k.text === text ? { ...k, active: !k.active } : k
      )
    );
  };

  const handleRemoveKeyword = (text) => {
    setKeywords(prev =>
      prev.map(k =>
        k.text === text ? { ...k, active: false } : k
      )
    );
  };

  const handleSortClick = (label) => {
    setSortLabel(prev => (prev === label ? "" : label));
  };

  const sortedKeywords = [...keywords].sort((a, b) => {
    if (a.active === b.active) return 0;
    return a.active ? -1 : 1;
  });

  return (
    <div>
      <Taskbar />
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

          <div className="grid">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="item-card">
                ITEM {i + 1}
                <br />
                <b>Rating</b>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Searchitem;
