import { Link } from "react-router-dom";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <span className="hero-subtitle">
          Handwoven Elegance
        </span>

        <h1 className="hero-title">
          Timeless Indian Sarees
        </h1>

        <p className="hero-text">
          Discover premium silk, pattu & festive sarees crafted for
          celebrations that last forever.
        </p>

        <div className="hero-actions">
          <Link to="/sarees/pattu" className="hero-btn primary">
            Shop Pattu
          </Link>

          <Link to="/sarees" className="hero-btn secondary">
            Explore Collection
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
