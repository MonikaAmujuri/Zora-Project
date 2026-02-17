import { Link } from "react-router-dom";
import RecentProducts from "../../components/user/RecentProducts";
import Hero from "../../components/user/Hero";

import "./Home.css";

function Home() {
  return (
    <div className="home">
      <Hero />

      <section className="categories">
        <h2>Shop by Category</h2>

        <div className="category-grid">
          <Link to="/sarees/pattu" className="category-card">
            Pattu Sarees
          </Link>

          <Link to="/sarees/fancy" className="category-card">
            Fancy Sarees
          </Link>

          <Link to="/sarees/dresses" className="category-card">
            Dresses
          </Link>

          <Link to="/sarees/croptops" className="category-card">
            Crop Tops
          </Link>
        </div>
      </section>

      <section className="festival-banner">
  <div className="festival-content">
    <span className="festival-tag">Festival Sale</span>

    <h2>
      Up to <span>30% OFF</span>
    </h2>

    <p>
      Celebrate elegance with exclusive handloom sarees
    </p>

    <div className="festival-actions">
      <a href="/sarees" className="festival-btn primary">
        Shop Sarees
      </a>

      <a href="/sarees" className="festival-btn outline">
        Explore Collection
      </a>
    </div>
  </div>
</section>

<section className="brand-story">
  <div className="brand-story-content">
    <h2>Rooted in Tradition</h2>

    <p>
      ZORA celebrates the timeless beauty of Indian handlooms.
      Every saree is carefully curated from skilled artisans,
      blending heritage craftsmanship with modern elegance.
    </p>

    <p className="brand-highlight">
      Woven with love. Designed to last.
    </p>
  </div>
</section>


      {/* Divider */}
      <div className="section-divider">
  <span></span>
</div>

      {/* Collections */}
      <section className="collections-section">
        <h3 className="section-title">Collections</h3>
        <p className="section-subtitle">New arrivals just for you</p>

        <RecentProducts />
      </section>

    </div>
  );
}

export default Home;
