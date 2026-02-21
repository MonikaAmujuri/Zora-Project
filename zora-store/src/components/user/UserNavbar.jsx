import { Link } from "react-router-dom";
import { useState } from "react";
import "./UserNavbar.css";

function UserNavbar() {
  const [showDropdown, setShowDropdown] = useState(false);

  const subcategoryOptions = {
  pattu: [
    { value: "kanchi", label: "Kanchi Pattu" },
    { value: "uppada", label: "Uppada Pattu" },
    { value: "mangalagiri", label: "Mangalagiri Pattu" },
  ],
  fancy: [
    { value: "banaras", label: "Banaras" },
    { value: "victoria", label: "Victoria" },
    { value: "glass-tissue", label: "Glass Tissue" },
  ],
  cotton: [
    { value: "bengal", label: "Bengal Cotton" },
    { value: "meena", label: "Meena Cotton" },
    { value: "printed", label: "Printed Cotton" },
  ],
  work: [
    { value: "jimmy", label: "Jimmy silk" },
    { value: "georgette", label: "Georgette" },
    { value: "chiffon", label: "Chiffon" },
  ],
  dresses: [
    { value: "long-frock", label: "Long Frocks" },
    { value: "three-piece", label: "3 Piece Set" },
    { value: "dress-material", label: "Dress Materials" },
  ],
  croptops: [
    { value: "half-sarees", label: "Half Sarees" },
    { value: "chunnies", label: "Chunnies" },
    { value: "readymade-blouses", label: "Readymade Blouses" },
    { value: "leggings", label: "Leggings" },
    { value: "western-wear", label: "Western Wear" },
  ],
};

  return (
    <nav className="user-navbar">
      <Link to="/">Home</Link>

      {/* ALL COLLECTION DROPDOWN */}
      <div
        className="dropdown"
        onMouseEnter={() => setShowDropdown(true)}
        onMouseLeave={() => setShowDropdown(false)}
      >
        <span className="dropdown-title">All Collection ▾</span>

        {showDropdown && (
          <div className="dropdown-menu">
            <div className="mega-menu">
              {Object.keys(subcategoryOptions).map((category) => (
                <div key={category} className="mega-column">
                  <h4 className="mega-title">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </h4>

                  {subcategoryOptions[category].map((sub) => (
                    <Link
                      key={sub.value}
                      to={`/sarees/${category}?type=${sub.value}`}
                      className="mega-link"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Link to="/sarees/pattu">Pattu Sarees</Link>
      <Link to="/sarees/fancy">Fancy Sarees</Link>
      <Link to="/sarees/cotton">Cotton Sarees</Link>
      <Link to="/sarees/work">Work Sarees</Link>
      <Link to="/sarees/dresses">Dresses</Link>
      <Link to="/sarees/croptops">Crop Tops</Link>
      <Link to="/video-shopping">Video Shopping</Link>
      <Link to="/contact">Contact</Link>
    </nav>
  );
}

export default UserNavbar;