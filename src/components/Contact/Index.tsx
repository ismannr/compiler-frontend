import { useState } from "react";
import "./Contact.css";
import { toast, ToastContainer } from "react-toastify";

const Contact = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_MAIL_SENDER || "";

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient: email,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to send email.");
      }

      toast.success(result.message || "Email sent successfully!", {
        style: { color: "black" }
      });
    } catch (err) {
      toast.error("Failed to send email.");
    }
    setLoading(false);
    setEmail("");
  };

  const bannerItems = Array.from({ length: 10 });

  return (
    <section className="section contact-section" id="contact">
      <h2 className="contact-title">Contact</h2>
      <div className="contact-banner">
        Ready to create a little magic together? <br />
        Let’s connect!
      </div>
      <div className="banner">
        <div className="banner-track">
          {bannerItems.map((_, idx) => (
            <span className="banner-text-slide" key={idx}>
              Open To Work
            </span>
          ))}
        </div>
      </div>
      { }
      <div className="email-container">
        <form className="contact-email-form" onSubmit={handleSendEmail}>
          <input
            type="email"
            className="contact-email-input"
            placeholder="I'll hit you up!"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="submit"
            className="contact-email-send"
            disabled={loading}
            style={{ position: "relative", minWidth: 80 }}
          >
            {loading ? (
              <span className="spinner" />
            ) : (
              "Send"
            )}
          </button>
        </form>
      </div>
      {error && <div style={{ color: "#ff5252", textAlign: "center", marginTop: 8 }}>{error}</div>}
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar aria-label={undefined} />
      <footer className="contact-footer">
        <div className="contact-icons">
          <a
            href="https://drive.google.com/uc?id=1ynSndyY31vNjKcAdddorFMObE01d3c-R&export=download"
            className="contact-icon"
            title="CV"
            download
          >
            <img src="/images/cv.png" alt="CV" className="contact-img-icon" />
          </a>
          <a href="mailto:ismannurfauzann@gmail.com" className="contact-icon" title="Email">
            <img src="/images/email.png" alt="Email" className="contact-img-icon" />
          </a>
          <a href="https://wa.me/6287821224748" className="contact-icon" title="WhatsApp" target="_blank" rel="noopener noreferrer">
            <img src="/images/wa.png" alt="WhatsApp" className="contact-img-icon" />
          </a>
          <a href="https://github.com/ismannr" className="contact-icon" title="GitHub" target="_blank" rel="noopener noreferrer">
            <img src="/images/git.png" alt="GitHub" className="contact-img-icon" />
          </a>
          <a href="https://www.linkedin.com/in/isyman-nurfauzan-rustama" className="contact-icon" title="LinkedIn" target="_blank" rel="noopener noreferrer">
            <img src="/images/linkedin.png" alt="LinkedIn" className="contact-img-icon" />
          </a>
        </div>
      </footer>
    </section>
  );
};

export default Contact;