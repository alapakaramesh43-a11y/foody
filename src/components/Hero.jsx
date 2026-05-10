import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero" id="hero-section">
      <div className="hero-content">
        <div className="hero-badge">🔥 #1 Food Delivery App</div>

        <h1>
          Delicious Food,
          <br />
          <span className="highlight">Delivered Fast</span>
        </h1>

        <p className="hero-subtitle">
          From the best local restaurants to your door in minutes.
          Fresh ingredients, bold flavors, zero hassle.
        </p>

        <div className="hero-actions">
          <Link to="/menu" className="btn btn-primary btn-lg" id="hero-order-btn">
            🍕 Explore Menu
          </Link>
          <Link to="/login" className="btn btn-secondary btn-lg" id="hero-signin-btn">
            Get Started
          </Link>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-value">500+</div>
            <div className="hero-stat-label">Restaurants</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">15k+</div>
            <div className="hero-stat-label">Happy Users</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">15 min</div>
            <div className="hero-stat-label">Avg. Delivery</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;