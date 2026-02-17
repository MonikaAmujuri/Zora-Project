import {
  FaInstagram,
  FaFacebookF,
  FaPinterestP,
  FaYoutube
} from "react-icons/fa";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">

        <div className="footer-brand">
          <h3>ZORA</h3>
          <p>
            Premium handloom sarees crafted with tradition
            and elegance.
          </p>
        </div>
        
        <div className="footer-newsletter">
          <h4>Join Our Newsletter</h4>
          <p>Get updates on new arrivals & exclusive offers</p>

          <form>
            <input
              type="email"
              placeholder="Enter your email"
              required
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>
        <div className="social-icons">
            <a href="https://www.instagram.com/zorawomenshopee?" 
            target="_blank" rel="noreferrer">
              <FaInstagram />
            </a>

            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <FaFacebookF />
            </a>

            <a href="https://pinterest.com" target="_blank" rel="noreferrer">
              <FaPinterestP />
            </a>

            <a href="https://youtube.com/@zorawomensshop4078?" 
            target="_blank" rel="noreferrer">
              <FaYoutube />
            </a>
          </div>

      </div>
      
     
      <div className="footer-bottom">
        © {new Date().getFullYear()} ZORA. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
