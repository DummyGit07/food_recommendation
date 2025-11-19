import React, { useState } from "react";
import defaultImage from "../assets/Image_not_available.png"; // 🔹 same fallback as FoodCard

function FoodDetailModal({ food, onClose }) {
  const [recipeData, setRecipeData] = useState(null);
  const [description, setDescription] = useState("");
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [descriptionLoading, setDescriptionLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(null); // 'recipe' or 'description'

  // local image source with fallback if missing or broken
  const [imgSrc, setImgSrc] = useState(food.img || defaultImage);

  const displayPrice =
    typeof food.price === "number"
      ? `$${food.price.toFixed(2)}`
      : String(food.price || "");

  async function generateRecipe() {
    setRecipeLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/generate_recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ food_name: food.name }),
      });
      const data = await res.json();
      if (!data.recipe) throw new Error("No recipe returned");
      const parsed = JSON.parse(data.recipe);
      setRecipeData(parsed);
      setActiveTab("recipe");
    } catch (e) {
      setError("Failed to generate recipe. " + e.message);
    }
    setRecipeLoading(false);
  }

  async function generateDescription() {
    setDescriptionLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/generate_description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ food_name: food.name }),
      });
      const data = await res.json();
      if (!data.description) throw new Error("No description returned");
      const parsed = JSON.parse(data.description);
      setDescription(parsed.description);
      setActiveTab("description");
    } catch (e) {
      setError("Failed to generate description. " + e.message);
    }
    setDescriptionLoading(false);
  }

  const orderUrl = `https://www.google.com/search?q=${encodeURIComponent(
    `order ${food.name} online`
  )}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button className="close-btn" onClick={onClose} aria-label="Close">
          ×
        </button>

        {/* Image with local fallback */}
        <img
          src={imgSrc}
          alt={food.name}
          className="modal-image"
          onError={() => setImgSrc(defaultImage)}
        />

        <h2>{food.name}</h2>
        <p className="price">💲 {displayPrice}</p>

        {/* Buttons row: generate actions on left, Order now on right */}
        <div className="button-group">
          <div className="button-group-left">
            <button onClick={generateRecipe} disabled={recipeLoading}>
              {recipeLoading ? "⏳ Loading..." : "🔥 Generate Recipe"}
            </button>
            <button onClick={generateDescription} disabled={descriptionLoading}>
              {descriptionLoading ? "⏳ Loading..." : "ℹ️ About Food"}
            </button>
          </div>

          <a
            href={orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="order-button"
          >
            🛒 Order now
          </a>
        </div>

        {error && <p className="error-text">{error}</p>}

        {(recipeData || description) && (
          <div className="toggle-buttons">
            {recipeData && (
              <button
                className={activeTab === "recipe" ? "active" : ""}
                onClick={() => setActiveTab("recipe")}
                aria-pressed={activeTab === "recipe"}
              >
                🍽️ Recipe Steps
              </button>
            )}
            {description && (
              <button
                className={activeTab === "description" ? "active" : ""}
                onClick={() => setActiveTab("description")}
                aria-pressed={activeTab === "description"}
              >
                📝 About Food
              </button>
            )}
          </div>
        )}

        <div className="content-section">
          {activeTab === "recipe" && recipeData && (
            <div className="recipe-section">
              <h3>Recipe Steps</h3>
              <div dangerouslySetInnerHTML={{ __html: recipeData.steps }} />
              {recipeData.video_link && (
                <iframe
                  width="100%"
                  height="300"
                  src={recipeData.video_link.replace("watch?v=", "embed/")}
                  title="YouTube video"
                  frameBorder="0"
                  allowFullScreen
                />
              )}
            </div>
          )}

          {activeTab === "description" && description && (
            <div className="description-section">
              <h3>About Food</h3>
              <p>{description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FoodDetailModal;
