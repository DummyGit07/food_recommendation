import defaultImage from '../assets/Image_not_available.png';
function FoodCard({ food, onSelect }) {
  return (
    <div
      onClick={() => onSelect(food)}
      style={{
        cursor: "pointer",
        marginBottom: 20,
        border: "1px solid #ddd",
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        textAlign: "center"
      }}
    >
      
      <img 
        src={food.img? food.img : defaultImage} 
        alt={food.name} 
        style={{ width: "100%", height: 200, objectFit: "cover" }}
        onError={e => {
          e.target.onerror = null;
          e.target.src = defaultImage;
        }}
      />
      <div style={{ padding: 10, fontWeight: "bold", fontSize: 16, color: "#333" }}>
        Name: {food.name}<br/>
        Price: ${food.price.toFixed(2)}<br/>
        Rating: {food.rate} / 5
      </div>
    </div>
  );
}

export default FoodCard;
