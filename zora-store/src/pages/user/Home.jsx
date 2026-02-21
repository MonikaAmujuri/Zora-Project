import { Link } from "react-router-dom";
import RecentProducts from "../../components/user/RecentProducts";
import Hero from "../../components/user/Hero";
import { useNavigate } from "react-router-dom";

import "./Home.css";

function Home() {
  const navigate = useNavigate();
  return (
    <div className="home">
      <Hero />

      <div className="category-section">
        <h2>Shop by Category</h2>

        <div className="category-grid">
          <div className="category-card" onClick={() => navigate("/sarees/pattu")}>
            <div className="category-image">
              <img src="/images/pattu.jpg" alt="Pattu" />
            </div>
            <p>Pattu Sarees</p>
          </div>

          <div className="category-card" onClick={() => navigate("/sarees/fancy")}>
            <div className="category-image">
              <img src="/images/fancy.jpg" alt="Fancy" />
            </div>
            <p>Fancy Sarees</p>
          </div>

          <div className="category-card" onClick={() => navigate("/sarees/dresses")}>
            <div className="category-image">
              <img src="/images/dresses.jpg" alt="Dresses" />
            </div>
            <p>Dresses</p>
          </div>

          <div className="category-card" onClick={() => navigate("/sarees/croptops")}>
            <div className="category-image">
              <img src="/images/croptops.jpg" alt="Crop Tops" />
            </div>
            <p>Crop Tops</p>
          </div>
        </div>
      </div>

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
