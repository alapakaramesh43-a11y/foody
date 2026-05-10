import { useState } from "react";
import { useApp } from "../context/AppContext";

function FoodCard({ food, style }) {
  const { addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(food, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="card food-card" style={style} id={`food-card-${food.id}`}>
      <div className="food-card-image">
        <img src={food.image} alt={food.name} loading="lazy" />
        {food.tag && <span className="food-tag">{food.tag}</span>}
      </div>

      <div className="food-card-body">
        <h3 className="food-card-title">{food.name}</h3>

        {food.description && (
          <p style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-muted)",
            lineHeight: 1.5,
          }}>
            {food.description}
          </p>
        )}

        <div className="food-card-meta">
          {food.rating && (
            <span className="food-card-rating">⭐ {food.rating}</span>
          )}
          {food.time && <span>🕐 {food.time}</span>}
        </div>

        <div className="food-card-footer">
          <div className="food-card-price">
            <span className="currency">₹</span>{food.price}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
            <div className="qty-control">
              <button
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              className="btn btn-primary btn-sm"
              onClick={handleAdd}
              id={`add-btn-${food.id}`}
              style={{
                minWidth: 80,
                background: added
                  ? "linear-gradient(135deg, var(--color-success), #16a34a)"
                  : undefined,
              }}
            >
              {added ? "✓ Added" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;