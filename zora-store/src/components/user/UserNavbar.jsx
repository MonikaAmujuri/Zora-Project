import { Link } from "react-router-dom";
import "./UserNavbar.css";

function UserNavbar() {

  return (
    <nav className="user-navbar">
      <Link to="/">Home</Link>
      <Link to="/sarees">All Collection</Link>
      <Link to="/sarees/pattu">Pattu Sarees</Link>
      <Link to="/sarees/fancy">Fancy Sarees</Link>
      <Link to="/sarees/cotton">Cotton Sarees</Link>
      <Link to="/sarees/work">Work Sarees</Link>
      <Link to="/video-shopping">Video Shopping</Link>
      <Link to="/contact">Contact</Link>
    </nav>
  );
}

export default UserNavbar;
