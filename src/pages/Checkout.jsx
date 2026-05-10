import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

/* ── Payment method config ── */
const UPI_APPS = [
  { id: "gpay",    label: "Google Pay",  emoji: "🟢", color: "#4285F4" },
  { id: "phonepe", label: "PhonePe",     emoji: "🟣", color: "#5f259f" },
  { id: "paytm",   label: "Paytm",       emoji: "🔵", color: "#002970" },
  { id: "amazon",  label: "Amazon Pay",  emoji: "🟠", color: "#FF9900" },
  { id: "bhim",    label: "BHIM UPI",    emoji: "🇮🇳", color: "#138808" },
];

const PAY_METHODS = [
  { id: "upi",   label: "UPI Apps",           icon: "📱", desc: "GPay, PhonePe, Paytm & more" },
  { id: "card",  label: "Credit / Debit Card", icon: "💳", desc: "Visa, Mastercard, RuPay" },
  { id: "netbanking", label: "Net Banking",    icon: "🏦", desc: "All major banks supported" },
  { id: "cod",   label: "Cash on Delivery",    icon: "💵", desc: "Pay when your order arrives" },
];

function Checkout() {
  const { cart, cartTotal, clearCart } = useApp();
  const navigate = useNavigate();

  const deliveryFee = cartTotal > 0 ? 29 : 0;
  const tax = Math.round(cartTotal * 0.05);
  const grandTotal = cartTotal + deliveryFee + tax;

  const [form, setForm] = useState({
    name: "", address: "", city: "", pincode: "",
    payMethod: "upi",
    selectedUpiApp: "",
    upiId: "",
    cardNumber: "", cardExpiry: "", cardCvv: "", cardName: "",
    bank: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState({});
  const [payStep, setPayStep] = useState("form"); // "form" | "confirm"

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = "Enter a valid 6-digit pincode";
    if (form.payMethod === "upi" && !form.selectedUpiApp) e.upiApp = "Select a UPI app";
    if (form.payMethod === "card") {
      if (!/^\d{16}$/.test(form.cardNumber.replace(/\s/g, ""))) e.cardNumber = "Enter valid 16-digit card number";
      if (!form.cardExpiry) e.cardExpiry = "Enter expiry date";
      if (!/^\d{3,4}$/.test(form.cardCvv)) e.cardCvv = "Enter valid CVV";
      if (!form.cardName.trim()) e.cardName = "Enter name on card";
    }
    return e;
  };

  const handleProceedToPay = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setPayStep("confirm");
  };

  const handleConfirmPayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      clearCart();
    }, 2000);
  };

  /* ── Success screen ── */
  if (done) {
    return (
      <main className="page checkout-page" id="checkout-success">
        <div style={{ textAlign: "center", padding: "var(--space-4xl) 0" }}>
          <div style={{ fontSize: "4.5rem", marginBottom: "var(--space-lg)", animation: "float 2s ease-in-out infinite" }}>🎉</div>
          <h2 style={{ marginBottom: "var(--space-sm)" }}>Order Placed Successfully!</h2>
          <p style={{ color: "var(--color-text-muted)", marginBottom: "var(--space-xs)" }}>
            Your food is being prepared 🍳
          </p>
          <p style={{ color: "var(--color-success)", fontWeight: 600, marginBottom: "var(--space-xl)" }}>
            ✓ Payment confirmed via {PAY_METHODS.find(m => m.id === form.payMethod)?.label}
          </p>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "var(--space-sm)",
            padding: "var(--space-sm) var(--space-lg)",
            background: "var(--color-surface-2)", borderRadius: "var(--radius-full)",
            marginBottom: "var(--space-2xl)", fontSize: "var(--text-sm)", color: "var(--color-text-muted)",
          }}>
            🚴 Estimated delivery: <strong style={{ color: "var(--color-text-heading)" }}>25–30 minutes</strong>
          </div>
          <br />
          <button className="btn btn-primary btn-lg" onClick={() => navigate("/menu")} id="order-again-btn">
            🍕 Order Again
          </button>
        </div>
      </main>
    );
  }

  /* ── Payment confirmation screen ── */
  if (payStep === "confirm") {
    const selectedApp = UPI_APPS.find(a => a.id === form.selectedUpiApp);
    return (
      <main className="page checkout-page" id="payment-confirm-page">
        <h1 style={{ marginBottom: "var(--space-xl)" }}>
          Confirm <span style={{ color: "var(--color-primary)" }}>Payment</span>
        </h1>

        <div className="cart-summary" style={{ maxWidth: 480, margin: "0 auto" }}>
          {/* Amount display */}
          <div style={{ textAlign: "center", padding: "var(--space-xl) 0" }}>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginBottom: "var(--space-sm)" }}>
              Total Amount
            </div>
            <div style={{ fontSize: "var(--text-5xl)", fontWeight: 900, color: "var(--color-text-heading)" }}>
              ₹{grandTotal}
            </div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-xs)" }}>
              incl. delivery & taxes
            </div>
          </div>

          {/* Payment method summary */}
          {form.payMethod === "upi" && selectedApp && (
            <div style={{
              display: "flex", alignItems: "center", gap: "var(--space-md)",
              padding: "var(--space-md)", background: "var(--color-surface-2)",
              borderRadius: "var(--radius-lg)", marginBottom: "var(--space-lg)",
              border: "1px solid var(--color-border)",
            }}>
              <span style={{ fontSize: "2rem" }}>{selectedApp.emoji}</span>
              <div>
                <div style={{ fontWeight: 700, color: "var(--color-text-heading)" }}>{selectedApp.label}</div>
                <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
                  Opening {selectedApp.label} app to confirm payment...
                </div>
              </div>
            </div>
          )}

          {form.payMethod === "card" && (
            <div style={{
              padding: "var(--space-md)", background: "var(--color-surface-2)",
              borderRadius: "var(--radius-lg)", marginBottom: "var(--space-lg)",
              border: "1px solid var(--color-border)",
            }}>
              <div style={{ fontWeight: 700, color: "var(--color-text-heading)", marginBottom: 4 }}>💳 Card Payment</div>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
                **** **** **** {form.cardNumber.replace(/\s/g, "").slice(-4)} · {form.cardName}
              </div>
            </div>
          )}

          {form.payMethod === "cod" && (
            <div style={{
              padding: "var(--space-md)", background: "var(--color-surface-2)",
              borderRadius: "var(--radius-lg)", marginBottom: "var(--space-lg)",
              border: "1px solid var(--color-border)",
            }}>
              <div style={{ fontWeight: 700, color: "var(--color-text-heading)", marginBottom: 4 }}>💵 Cash on Delivery</div>
              <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
                Keep ₹{grandTotal} ready at your door.
              </div>
            </div>
          )}

          {/* Delivery summary */}
          <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginBottom: "var(--space-lg)" }}>
            📍 Delivering to: <strong style={{ color: "var(--color-text-heading)" }}>{form.address}, {form.city} – {form.pincode}</strong>
          </div>

          <button
            id="confirm-pay-btn"
            className="btn btn-primary"
            style={{ width: "100%" }}
            onClick={handleConfirmPayment}
            disabled={loading}
          >
            {loading ? (
              <span>Processing payment<span style={{ animation: "pulse 1s infinite" }}>...</span></span>
            ) : (
              `✓ Confirm & Pay ₹${grandTotal}`
            )}
          </button>

          <button
            className="btn btn-ghost"
            style={{ width: "100%", marginTop: "var(--space-sm)" }}
            onClick={() => setPayStep("form")}
            id="back-to-form-btn"
          >
            ← Edit details
          </button>
        </div>
      </main>
    );
  }

  /* ── Main checkout form ── */
  return (
    <main className="page checkout-page" id="checkout-page">
      <h1 style={{ marginBottom: "var(--space-xl)" }}>
        <span style={{ color: "var(--color-primary)" }}>Checkout</span>
      </h1>

      <form onSubmit={handleProceedToPay}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>

          {/* ── 1. Delivery Details ── */}
          <section className="cart-summary" id="delivery-section">
            <h3 style={{ marginBottom: "var(--space-lg)" }}>📍 Delivery Details</h3>
            <div className="checkout-form">
              <div className="form-group">
                <label className="form-label" htmlFor="checkout-name">Full Name</label>
                <input id="checkout-name" className={`input ${errors.name ? "input-error" : ""}`}
                  placeholder="Ramesh Kumar" value={form.name}
                  onChange={(e) => set("name", e.target.value)} />
                {errors.name && <span style={{ color: "var(--color-error)", fontSize: "var(--text-xs)" }}>{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="checkout-address">Delivery Address</label>
                <input id="checkout-address" className={`input ${errors.address ? "input-error" : ""}`}
                  placeholder="Flat 4B, Rose Apartments, MG Road" value={form.address}
                  onChange={(e) => set("address", e.target.value)} />
                {errors.address && <span style={{ color: "var(--color-error)", fontSize: "var(--text-xs)" }}>{errors.address}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="checkout-city">City</label>
                  <input id="checkout-city" className={`input ${errors.city ? "input-error" : ""}`}
                    placeholder="Hyderabad" value={form.city}
                    onChange={(e) => set("city", e.target.value)} />
                  {errors.city && <span style={{ color: "var(--color-error)", fontSize: "var(--text-xs)" }}>{errors.city}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="checkout-pincode">Pincode</label>
                  <input id="checkout-pincode" className={`input ${errors.pincode ? "input-error" : ""}`}
                    placeholder="500001" maxLength={6} value={form.pincode}
                    onChange={(e) => set("pincode", e.target.value.replace(/\D/g, ""))} />
                  {errors.pincode && <span style={{ color: "var(--color-error)", fontSize: "var(--text-xs)" }}>{errors.pincode}</span>}
                </div>
              </div>
            </div>
          </section>

          {/* ── 2. Payment Method ── */}
          <section className="cart-summary" id="payment-section">
            <h3 style={{ marginBottom: "var(--space-lg)" }}>💳 Payment Method</h3>

            {/* Method selector tabs */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-sm)", marginBottom: "var(--space-lg)" }}>
              {PAY_METHODS.map((method) => (
                <label key={method.id} htmlFor={`pay-${method.id}`} style={{
                  display: "flex", flexDirection: "column", gap: 4,
                  padding: "var(--space-md)",
                  background: form.payMethod === method.id ? "var(--color-primary-glow)" : "var(--color-surface-2)",
                  border: `1px solid ${form.payMethod === method.id ? "var(--color-primary)" : "var(--color-border)"}`,
                  borderRadius: "var(--radius-lg)", cursor: "pointer",
                  transition: "all var(--transition-fast)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                    <input type="radio" id={`pay-${method.id}`} name="payMethod"
                      value={method.id} checked={form.payMethod === method.id}
                      onChange={() => set("payMethod", method.id)}
                      style={{ accentColor: "var(--color-primary)" }} />
                    <span style={{ fontSize: "var(--text-lg)" }}>{method.icon}</span>
                    <span style={{ fontWeight: 600, color: "var(--color-text-heading)", fontSize: "var(--text-sm)" }}>
                      {method.label}
                    </span>
                  </div>
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", paddingLeft: 24 }}>
                    {method.desc}
                  </span>
                </label>
              ))}
            </div>

            {/* UPI App selector */}
            {form.payMethod === "upi" && (
              <div id="upi-apps-section">
                <div style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-heading)", marginBottom: "var(--space-sm)" }}>
                  Choose UPI App
                </div>
                <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap", marginBottom: "var(--space-md)" }}>
                  {UPI_APPS.map((app) => (
                    <button key={app.id} type="button" id={`upi-${app.id}`}
                      onClick={() => set("selectedUpiApp", app.id)}
                      style={{
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                        padding: "var(--space-sm) var(--space-md)",
                        background: form.selectedUpiApp === app.id ? "var(--color-primary-glow)" : "var(--color-surface-2)",
                        border: `2px solid ${form.selectedUpiApp === app.id ? "var(--color-primary)" : "var(--color-border)"}`,
                        borderRadius: "var(--radius-lg)", cursor: "pointer",
                        transition: "all var(--transition-fast)", minWidth: 80,
                      }}>
                      <span style={{ fontSize: "1.75rem" }}>{app.emoji}</span>
                      <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-heading)" }}>
                        {app.label}
                      </span>
                    </button>
                  ))}
                </div>
                {errors.upiApp && <span style={{ color: "var(--color-error)", fontSize: "var(--text-xs)" }}>{errors.upiApp}</span>}

                {form.selectedUpiApp && (
                  <div style={{ marginTop: "var(--space-sm)" }}>
                    <label className="form-label" htmlFor="upi-id-input" style={{ fontSize: "var(--text-sm)" }}>
                      UPI ID <span style={{ color: "var(--color-text-muted)", fontWeight: 400 }}>(optional)</span>
                    </label>
                    <input id="upi-id-input" className="input" placeholder="yourname@upi"
                      value={form.upiId} onChange={(e) => set("upiId", e.target.value)}
                      style={{ marginTop: "var(--space-xs)" }} />
                  </div>
                )}
              </div>
            )}

            {/* Card form */}
            {form.payMethod === "card" && (
              <div id="card-section" style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="card-number">Card Number</label>
                  <input id="card-number" className={`input ${errors.cardNumber ? "input-error" : ""}`}
                    placeholder="1234 5678 9012 3456" maxLength={19}
                    value={form.cardNumber}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 16);
                      set("cardNumber", v.replace(/(.{4})/g, "$1 ").trim());
                    }} />
                  {errors.cardNumber && <span style={{ color: "var(--color-error)", fontSize: "var(--text-xs)" }}>{errors.cardNumber}</span>}
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="card-expiry">Expiry</label>
                    <input id="card-expiry" className={`input ${errors.cardExpiry ? "input-error" : ""}`}
                      placeholder="MM/YY" maxLength={5} value={form.cardExpiry}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                        if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                        set("cardExpiry", v);
                      }} />
                    {errors.cardExpiry && <span style={{ color: "var(--color-error)", fontSize: "var(--text-xs)" }}>{errors.cardExpiry}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="card-cvv">CVV</label>
                    <input id="card-cvv" className={`input ${errors.cardCvv ? "input-error" : ""}`}
                      placeholder="•••" maxLength={4} type="password"
                      value={form.cardCvv}
                      onChange={(e) => set("cardCvv", e.target.value.replace(/\D/g, ""))} />
                    {errors.cardCvv && <span style={{ color: "var(--color-error)", fontSize: "var(--text-xs)" }}>{errors.cardCvv}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="card-name">Name on Card</label>
                  <input id="card-name" className={`input ${errors.cardName ? "input-error" : ""}`}
                    placeholder="Ramesh Kumar" value={form.cardName}
                    onChange={(e) => set("cardName", e.target.value)} />
                  {errors.cardName && <span style={{ color: "var(--color-error)", fontSize: "var(--text-xs)" }}>{errors.cardName}</span>}
                </div>
              </div>
            )}

            {/* Net banking */}
            {form.payMethod === "netbanking" && (
              <div id="netbanking-section">
                <label className="form-label" htmlFor="bank-select">Select Your Bank</label>
                <select id="bank-select" className="input" style={{ marginTop: "var(--space-xs)", cursor: "pointer" }}
                  value={form.bank} onChange={(e) => set("bank", e.target.value)}>
                  <option value="">-- Choose Bank --</option>
                  {["SBI", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra", "Punjab National Bank", "Bank of Baroda", "Canara Bank"].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            )}

            {form.payMethod === "cod" && (
              <div style={{
                padding: "var(--space-md)", background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.2)", borderRadius: "var(--radius-lg)",
                fontSize: "var(--text-sm)", color: "var(--color-text-muted)",
              }}>
                ✅ Pay ₹{grandTotal} in cash when your order arrives at your door.
              </div>
            )}
          </section>

          {/* ── 3. Order Summary ── */}
          <section className="cart-summary" id="checkout-summary">
            <h3 style={{ marginBottom: "var(--space-md)" }}>🧾 Order Summary</h3>
            {cart.map((item) => (
              <div key={item.id} className="cart-summary-row" style={{ fontSize: "var(--text-sm)" }}>
                <span>{item.name} × {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="cart-summary-row"><span>Delivery</span><span>₹{deliveryFee}</span></div>
            <div className="cart-summary-row"><span>Taxes (5%)</span><span>₹{tax}</span></div>
            <div className="cart-summary-row total">
              <span>Grand Total</span>
              <span style={{ color: "var(--color-primary)" }}>₹{grandTotal}</span>
            </div>

            <button id="proceed-pay-btn" type="submit" className="btn btn-primary"
              style={{ width: "100%", marginTop: "var(--space-lg)" }}>
              Review &amp; Pay ₹{grandTotal} →
            </button>
          </section>
        </div>
      </form>
    </main>
  );
}

export default Checkout;