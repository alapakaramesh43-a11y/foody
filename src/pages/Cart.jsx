import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

function Cart() {
  const { cart, removeFromCart, updateQty, cartTotal } = useApp();
  const navigate = useNavigate();

  const deliveryFee = cartTotal > 0 ? 29 : 0;
  const tax = Math.round(cartTotal * 0.05);
  const grandTotal = cartTotal + deliveryFee + tax;

  if (cart.length === 0) {
    return (
      <main className="page cart-page" id="cart-page">
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <h2 style={{ marginBottom: "var(--space-sm)" }}>Your cart is empty</h2>
          <p style={{ color: "var(--color-text-muted)", marginBottom: "var(--space-xl)" }}>
            Looks like you haven't added anything yet.
          </p>
          <Link to="/menu" className="btn btn-primary btn-lg" id="browse-menu-btn">
            🍕 Browse Menu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page cart-page" id="cart-page">
      <h1 style={{ marginBottom: "var(--space-xl)" }}>
        Your <span style={{ color: "var(--color-primary)" }}>Cart</span>
        <span style={{
          marginLeft: "var(--space-sm)",
          fontSize: "var(--text-base)",
          fontWeight: 400,
          color: "var(--color-text-muted)"
        }}>
          ({cart.length} {cart.length === 1 ? "item" : "items"})
        </span>
      </h1>

      {/* Cart Items */}
      <div id="cart-items">
        {cart.map((item, i) => (
          <div
            className="cart-item"
            key={item.id}
            id={`cart-item-${item.id}`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <img
              src={item.image}
              alt={item.name}
              className="cart-item-image"
            />

            <div className="cart-item-details">
              <div className="cart-item-name">{item.name}</div>
              <div className="cart-item-price">₹{item.price} each</div>
            </div>

            {/* Qty control */}
            <div className="qty-control">
              <button
                onClick={() => updateQty(item.id, item.quantity - 1)}
                aria-label="Decrease"
              >−</button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQty(item.id, item.quantity + 1)}
                aria-label="Increase"
              >+</button>
            </div>

            {/* Item subtotal */}
            <div style={{
              minWidth: 70,
              textAlign: "right",
              fontWeight: 700,
              color: "var(--color-text-heading)",
              fontSize: "var(--text-lg)",
            }}>
              ₹{item.price * item.quantity}
            </div>

            {/* Remove */}
            <button
              className="cart-item-remove"
              onClick={() => removeFromCart(item.id)}
              aria-label={`Remove ${item.name}`}
              id={`remove-${item.id}`}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="cart-summary" id="cart-summary">
        <h3 style={{ marginBottom: "var(--space-md)" }}>Order Summary</h3>

        <div className="cart-summary-row">
          <span>Subtotal</span>
          <span>₹{cartTotal}</span>
        </div>
        <div className="cart-summary-row">
          <span>Delivery fee</span>
          <span>₹{deliveryFee}</span>
        </div>
        <div className="cart-summary-row">
          <span>Taxes (5%)</span>
          <span>₹{tax}</span>
        </div>
        <div className="cart-summary-row total">
          <span>Total</span>
          <span style={{ color: "var(--color-primary)" }}>₹{grandTotal}</span>
        </div>

        <button
          className="btn btn-primary"
          style={{ width: "100%", marginTop: "var(--space-lg)" }}
          onClick={() => navigate("/checkout")}
          id="proceed-checkout-btn"
        >
          Proceed to Checkout →
        </button>

        <Link
          to="/menu"
          className="btn btn-ghost"
          style={{ width: "100%", marginTop: "var(--space-sm)" }}
          id="add-more-btn"
        >
          + Add more items
        </Link>
      </div>
    </main>
  );
}

export default Cart;