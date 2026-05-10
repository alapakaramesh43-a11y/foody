import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FoodCard from "../components/FoodCard";
import foods from "../data/foods";
import { useApp } from "../context/AppContext";

const CATEGORIES = ["All", "Burgers", "Pizza", "Pasta", "Chicken", "Biryani", "Snacks"];

function Menu() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const { cartCount } = useApp();
  const navigate = useNavigate();

  const filtered = foods.filter((food) => {
    const matchSearch = food.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || food.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <main className="page" id="menu-page">
      <div className="section">
        {/* Header */}
        <div className="section-header">
          <h1 className="section-title">
            Our <span style={{ color: "var(--color-primary)" }}>Menu</span>
          </h1>
          <p className="section-subtitle">
            Fresh ingredients, bold flavors — pick what you love 🍽️
          </p>
        </div>

        {/* Search */}
        <div className="search-bar" id="menu-search">
          <span className="search-icon">🔍</span>
          <input
            id="search-input"
            className="input"
            type="text"
            placeholder="Search for burgers, pizza, biryani..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category chips */}
        <div className="category-filter" id="category-filter">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-chip ${activeCategory === cat ? "category-chip--active" : ""}`}
              onClick={() => setActiveCategory(cat)}
              id={`cat-${cat.toLowerCase()}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="menu-grid" id="menu-grid">
            {filtered.map((food, i) => (
              <FoodCard
                key={food.id}
                food={food}
                style={{ animationDelay: `${i * 60}ms` }}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "var(--space-4xl) 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "var(--space-md)" }}>🍽️</div>
            <p style={{ color: "var(--color-text-muted)" }}>
              No items found for "<strong>{search}</strong>"
            </p>
          </div>
        )}

        {/* Floating cart button */}
        {cartCount > 0 && (
          <div style={{
            position: "fixed",
            bottom: "var(--space-xl)",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 200,
            animation: "fadeInUp 0.4s ease",
          }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate("/cart")}
              id="view-cart-fab"
              style={{
                boxShadow: "0 8px 32px var(--color-primary-glow)",
                paddingInline: "var(--space-2xl)",
              }}
            >
              🛒 View Cart · {cartCount} {cartCount === 1 ? "item" : "items"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default Menu;