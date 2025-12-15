
import profileImg from "../../assets/react.svg";
import "../../assets/css/aboutus.css"; // ✅ correct CSS path

export default function AboutUs() {
  return (
    <section className="about-container">
      {/* Heading */}
      <h2 className="about-heading">The Person Behind The Threads.</h2>

      {/* Profile + Intro */}
      <div className="about-intro">
        <div className="about-profile">
          <img src={profileImg} alt="Rita Das" className="about-image" />
          <p className="about-name">– Rita Das –</p>
          <p className="about-quote">
            Every thread of Khadi tells a story of heritage, reimagined with Rita Das.
          </p>
        </div>

        <div className="about-values">
          <div>
            <p>🎀 Craftsmanship</p>
            <p>🧵 Artisanal Heritage</p>
          </div>
          <div>
            <p>🌿 Sustainability</p>
            <p>💠 Modern Elegance</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="about-stats">
        <div className="stat-card">
          <h3>10+ Years</h3>
          <p>Experience</p>
        </div>
        <div className="stat-card">
          <h3>30+</h3>
          <p>Artisans</p>
        </div>
        <div className="stat-card">
          <h3>All</h3>
          <p>India</p>
        </div>
      </div>

      {/* Section Divider */}
      <h3 className="about-subheading">The Visionary Behind Rita Design</h3>

      {/* Details Section */}
      <div className="about-details">
        <section>
          <h4>Journey & Passion For Khadi</h4>
          <ul>
            <li>
              Over three decades of experience in garment design, with a deep-rooted love for Khadi since her student days at South Delhi Polytechnic for Women.
            </li>
            <li>
              In 2002, she ventured into the Khadi industry with a mission to innovate and uplift artisans.
            </li>
          </ul>
        </section>

        <section>
          <h4>Entrepreneurial Milestones</h4>
          <ul>
            <li>
              Started independently with <b>PRADIP</b> and <b>SFURTI</b> projects under <b>KVIC, Govt. of India</b>.
            </li>
            <li>
              Established a <b>production unit in Jaipur</b>, employing local artisans, particularly women.
            </li>
            <li>
              Recognized under the <b>Prime Minister’s Employment Generation Programme (2014–2015)</b>.
            </li>
            <li>
              Earned the prestigious <b>Khadi Mark (2018)</b>, allowing her to brand and market Khadi products independently.
            </li>
          </ul>
        </section>

        <section>
          <h4>National & International Recognition</h4>
          <ul>
            <li>
              Served as a <b>judge for the National Awards for Artisans (Handloom & Handicrafts)</b>.
            </li>
            <li>
              Contributed to a <b>design studio in Jakarta, Indonesia</b>.
            </li>
            <li>
              Showcased her work at <b>Vibrant Gujarat 2019</b>, attracting international buyers.
            </li>
          </ul>
        </section>

        <section>
          <h4>Impact & Vision</h4>
          <ul>
            <li>
              Employs around <b>30 artisans</b>, empowering rural communities in Rajasthan.
            </li>
            <li>
              Continues to modernize Khadi with <b>bold, contemporary designs</b> under Rita Design.
            </li>
            <li>
              Committed to sustaining livelihoods and promoting Khadi on a global scale.
            </li>
          </ul>
        </section>
      </div>
    </section>
  );
}
