import { useEffect, useState } from "react";
import "./Experience.css";

const Experience = () => {

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const experienceSection = document.getElementById('experience');

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (experienceSection) {
      observer.observe(experienceSection);
    }

    return () => {
      if (experienceSection) {
        observer.unobserve(experienceSection);
      }
    };
  }, []);

  return (
    <section
      className={`section experience-section ${isVisible ? 'visible' : ''}`}
      id="experience"
    >
      <div className="demo">
        <div className="container">
          <div className="row text-center">
            <h1 className="heading-title">EXPERIENCE</h1>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="main-timeline">
                <div className="timeline">
                  <div className="timeline-content">
                    <span className="year">Feb 2024 - Oct 2024</span>
                    <span className="post">IoT, Backend, & Mobile Developer (Part-time)</span>
                    <h4 className="title">BINUS University (BSI Maslahat Project) Jakarta, Indonesia</h4>
                    <p className="description">
                      I led the development of an integrated aquaculture monitoring system, focusing on IoT device integration, back-end architecture, and mobile application development. My responsibilities included designing and deploying sensor-based monitoring hardware, building robust server-side APIs, and delivering a user-friendly mobile interface to help SME farmers track and improve water quality and operational efficiency.
                    </p>
                  </div>
                </div>

                <div className="timeline">
                  <div className="timeline-content">
                    <span className="year">Feb 2024 - Aug 2024</span>
                    <span className="post">Full Stack Engineer (Intern)</span>
                    <h4 className="title">Haus Indonesia (PT. Inspirasi Bisnis Nusantara) - Jakarta, Indonesia</h4>
                    <p className="description">
                      Contributed to the development of an internal internship management platform using Go and the Gin framework. Built and integrated RESTful microservices, implemented secure authentication with JWT blacklisting, and handled file storage via Amazon S3. Additional responsibilities included crafting HTML/CSS email templates, performing manual app testing, writing SQL queries, and completing assigned development tasks.
                    </p>
                  </div>
                </div>
                <div className="timeline">
                  <div className="timeline-content">
                    <span className="year">Sept 2023 - Feb 2024</span>
                    <span className="post">Application Developer (Intern)</span>
                    <h4 className="title">BINUS University (KEDAIREKA Project) – Jakarta, Indonesia</h4>
                    <p className="description">
                      Developed web and mobile applications to enhance SME productivity under the IMON Anda-Mantau platform. Conducted research and implementation of Machine Learning (Computer Vision) models including Image Captioning to assist digital commerce. Built dashboards, PoS, LMS, and Web-Commerce solutions tailored for SMEs mentored by BSI Maslahat.
                    </p>
                  </div>
                </div>

                <div className="timeline">
                  <div className="timeline-content">
                    <span className="year">Mar 2023 - Sep 2023</span>
                    <span className="post">Backend Developer</span>
                    <h4 className="title">E-Commerce Website (Self-Learning Project) – Jakarta, Indonesia</h4>
                    <p className="description">
                      Designed and implemented the backend of an e-commerce platform using Java Spring Boot. Worked on API development, debugging, testing, and integration with Amazon S3 for media storage. Focused on building scalable server-side logic and robust data handling workflows.
                    </p>
                  </div>
                </div>

                <div className="timeline">
                  <div className="timeline-content">
                    <span className="year">Oct 2018 - Aug 2023</span>
                    <span className="post">Embedded Developer / Engine Tuner / 3D Designer</span>
                    <h4 className="title">iTune Engineering – Bandung, Indonesia</h4>
                    <p className="description">
                      Developed embedded systems for automotive performance using Arduino Uno and ESP32. Engineered digital dashboards and PID-controlled bypass valves. Tuned engine performance for racing clients and designed custom parts such as MAF sensor housings using SOLIDWORKS.
                    </p>
                  </div>
                </div>

                <div className="timeline">
                  <div className="timeline-content">
                    <span className="year">Nov 2021</span>
                    <span className="post">Stunt Driver</span>
                    <h4 className="title">Visinema – Jakarta, Indonesia</h4>
                    <p className="description">
                      Performed precision driving and drifting scenes as a stunt driver for the film "Mencuri Raden Saleh."
                    </p>
                  </div>
                </div>
                <div className="timeline"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;