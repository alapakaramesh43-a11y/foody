import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useApp } from "../context/AppContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, cartCount } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const links = user
    ? [
        { to: "/menu", label: "Menu", icon: "🍽️" },
        { to: "/cart", label: "Cart", icon: "🛒", badge: cartCount },
        { to: "/checkout", label: "Checkout", icon: "💳" },
      ]
    : [];

  return (
    <nav className="navbar" id="main-navbar">
      <Link to={user ? "/menu" : "/login"} className="navbar-brand">
        🍔 Foody<span className="brand-dot">.</span>
      </Link>

      {user && (
        <button
          className="nav-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          id="nav-toggle-btn"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      )}

      <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`nav-link ${location.pathname === link.to ? "nav-link--active" : ""}`}
            onClick={() => setMenuOpen(false)}
            id={`nav-${link.label.toLowerCase()}`}
          >
            <span className="nav-icon">{link.icon}</span>
            {link.label}
            {link.badge > 0 && (
              <span style={{
                marginLeft: 6,
                background: 'var(--color-primary)',
                color: 'white',
                borderRadius: '999px',
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 7px',
                lineHeight: 1.6,
              }}>
                {link.badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      <div className="navbar-cta">
        {user ? (
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleLogout}
            id="logout-btn"
          >
            Sign Out
          </button>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm" id="login-nav-btn">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;