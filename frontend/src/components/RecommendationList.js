import React, { useState } from "react";
import FoodCard from "./FoodCard";
import FoodDetailModal from "./FoodDetailModal";

function RecommendationList({ recommendations }) {
  const [selectedFood, setSelectedFood] = useState(null);

  return (
    <>
      <div
        className="food-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        {recommendations.map((item, index) => (
          <FoodCard
            key={`${item.name}-${index}`}
            food={item}
            onSelect={() => setSelectedFood(item)}
          />
        ))}
      </div>

      {selectedFood && (
        <FoodDetailModal
          food={selectedFood}
          onClose={() => setSelectedFood(null)}
        />
      )}
    </>
  );
}

export default RecommendationList;
