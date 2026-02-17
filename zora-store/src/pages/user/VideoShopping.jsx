import UserHeader from "../../components/user/UserHeader";
import UserNavbar from "../../components/user/UserNavbar";
import {
  FaInstagram,
  FaWhatsapp,
  FaYoutube
} from "react-icons/fa";
import "./VideoShopping.css";

const videos = [
  {
    title: "Pure Georgette Sarees",
    embedUrl: "https://www.youtube.com/embed/10I0jfufI-A?"
  },
  {
    title: "Shigori Print Cotton Sarees",
    embedUrl: "https://www.youtube.com/embed/3TP0-faXCCY?"
  },
  {
    title: "Kanchi Pattu Handloom Sarees",
    embedUrl: "https://www.youtube.com/embed/HDOHzOwHYqc?"
  },
  {
    title: "Handloom Lenin Tishu Sarees",
    embedUrl: "https://www.youtube.com/embed/PfnJm_3ePjs?"
  },
  {
    title: "Banaras Soft Pattu Sarees",
    embedUrl: "https://www.youtube.com/embed/8Ribn65moNk?"
  },
  {
    title: "Pure Tussar Pattu Organza Sarees",
    embedUrl: "https://www.youtube.com/embed/iWEk7ooakfI?"
  },
  {
    title: "Khathan Silk Sarees",
    embedUrl: "https://www.youtube.com/embed/C5eROgW_7E8?"
  },
  {
    title: "Zari Kota Sarees",
    embedUrl: "https://www.youtube.com/embed/Tehbl8LjE4g?"
  }
];

function VideoShopping() {
  return (
    <div>
      <UserHeader/>
      <UserNavbar/>
    
    <div className="video-page">
      <div className="video-header">
        <h1>Video Shopping</h1>
        <p>WATCH. DISCOVER. SHOP THROUGH VIDEOS</p>
        <div className="video-divider"></div>
      </div>

      <div className="social-buttons">
        <a href="https://www.instagram.com/zorawomenshopee?" target="_blank">
        <FaInstagram />
        </a>
        <a href="https://wa.me/919876543210" target="_blank">
        <FaWhatsapp />
        </a>
        <a href="https://youtube.com/@zorawomensshop4078?" target="_blank">
        <FaYoutube/>
        </a>
      </div>

      <div className="video-grid">
        {videos.map((video, index) => (
          <div className="video-card" key={index}>
            <iframe
              src={video.embedUrl}
              title={video.title}
              frameBorder="0"
              allowFullScreen
            ></iframe>
            <p>{video.title}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
}

export default VideoShopping;
