import { useState } from "react";
import UserHeader from "../../components/user/UserHeader";
import UserNavbar from "../../components/user/UserNavbar";
import "./Contact.css";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.placeholder.includes("Name")
        ? "name"
        : e.target.placeholder.includes("Email")
        ? "email"
        : "message"]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      setSuccess("Message sent successfully 🎉");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div>
      <UserHeader />
      <UserNavbar />

      <div className="contact-page">
        <div className="contact-card">
          <h2>Contact Us</h2>
          <p className="contact-subtitle">
            We'd love to hear from you. Reach out for queries, orders, or support.
          </p>

          <div className="contact-grid">
            {/* LEFT: INFO */}
            <div className="contact-info">
              <h4>Zora Store</h4>
              <p>📍 D.No: 5-97-12, Lakshmipuram,</p>
              <p>Guntur, India</p>
              <p>📞 +91 98765 43210</p>
              <p>✉️ support@zorastore.com</p>

              <p className="contact-note">
                Our team usually responds within 24 hours.
              </p>
            </div>

            {/* RIGHT: FORM */}
            <form className="contact-form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Your Name"
                required
                value={form.name}
                onChange={handleChange}
              />

              <input
                type="email"
                placeholder="Your Email"
                required
                value={form.email}
                onChange={handleChange}
              />

              <textarea
                placeholder="Your Message"
                rows="4"
                required
                value={form.message}
                onChange={handleChange}
              />

              <button type="submit">Send Message</button>

              {success && <p className="success-msg">{success}</p>}
              {error && <p className="error-msg">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;