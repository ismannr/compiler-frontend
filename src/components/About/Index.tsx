import { useState, useEffect } from 'react';
import './About.css';

const AboutSection = () => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const aboutMainSection = document.getElementById('about-main');
    const captionSection = document.getElementById('about-caption');
    const header = document.getElementById('header');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id === 'about-caption') {
                setFadeOut(true); 
            } else if (entry.target.id === 'about-main') {
              setFadeOut(false);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    if (aboutMainSection) {
      observer.observe(aboutMainSection);
    }
    if (captionSection) {
      observer.observe(captionSection);
    }

    return () => {
      if (aboutMainSection) {
        observer.unobserve(aboutMainSection);
      }
      if (captionSection) {
        observer.unobserve(captionSection);
      }
    };
  }, []);

  return (
    <>
      <section
        className={`section about-section ${fadeOut ? 'fade-out' : ''}`}
        id="about-main"
      >
        <h2 className="about-title">About Me</h2>
        <div className="about-content">
          <img src="/images/profile.png" alt="About Me" className="about-image" />
          <div className="about-text">
            <p>
              Ever since I can remember, I've been driven by a simple question: <strong>"How does this work?"</strong>.
            </p>
            <p>
              That curiosity led me to study Computer Science at Bina Nusantara University, where I discovered my passion for backend development.
            </p>
          </div>
        </div>
      </section>
      <div className="section about-caption-section" id="about-caption">
        <div className="about-caption">
          <p>
            <strong>"Great code doesn't just run.<br />
            It defies the logical fallacies we bring from thought into creation."</strong>
          </p>
        </div>
      </div>
    </>
  );
};

export default AboutSection;