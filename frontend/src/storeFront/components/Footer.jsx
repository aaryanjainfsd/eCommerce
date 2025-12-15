
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import "../../assets/css/footer.css"; // ✅ correct CSS path

export default function Footer() {
  return (
    <footer className="footer">
      {/* Top Line Text */}
      <div className="footer-top-text">
        At <span className="brand">Rita Design</span>, Every Thread Of Khadi
        Tells A Story Of Heritage, Sustainability, And Timeless Beauty.
      </div>

      <hr className="divider" />

      {/* Main Footer Content */}
      <div className="footer-container">
        {/* Logo & Address */}
        <div className="footer-section">
          <h2 className="footer-logo">
            Rita <span>Design</span>
          </h2>
          <p className="footer-subtext">(Design House)</p>

          <h4>Design House</h4>
          <p>11/28, Kaveri Path<br />Mansarover, Jaipur<br />302020 (Rajasthan)</p>

          <h4>Join Us</h4>
          <div className="social-icons">
            <a href="#"><Facebook size={18} /></a>
            <a href="#"><Twitter size={18} /></a>
            <a href="#"><Instagram size={18} /></a>
            <a href="#"><Linkedin size={18} /></a>
          </div>
        </div>

        {/* Products */}
        <div className="footer-section">
          <h4>Products</h4>
          <ul>
            <li>Duppatas</li>
            <li>Quilted Jackets</li>
            <li>Waist Coat</li>
            <li>Kurtas</li>
            <li>Crafted Bags</li>
            <li>Stalls</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4>Contacts</h4>
          <p><a href="tel:+919314507053">+91 9314507053</a></p>
          <p><a href="mailto:ritadas3@gmail.com">ritadas3@gmail.com</a></p>
        </div>

        {/* Map */}
        <div className="footer-map">
          <iframe
            title="Rita Design Location"
            
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>

      {/* Bottom Footer */}
      <hr className="divider" />
      <div className="footer-bottom">
        <p>
          RitaDesign © 2025. All Rights Reserved. Powered By{" "}
          <span className="highlight">TheFreelancerGroup</span>
        </p>

        <div className="footer-links">
          <a href="#">Privacy Policies</a>
          <a href="#">Refund Policies</a>
          <a href="#">Shipping Policies</a>
          <a href="#">Terms & Conditions</a>
        </div>

        <a href="#" className="footer-whatsapp">💬 Talk to an Expert</a>
      </div>
    </footer>
  );
}
