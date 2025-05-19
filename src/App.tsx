import { useEffect, useState } from 'react';
import './App.css';
import TypewriterHeader from './components/Type-writer/Index';
import Experience from './components/Experience/Index';
import AboutSection from './components/About/Index';
import Publication from './components/Publication/Index';
import Playground from './components/Playground/Index';
import Contact from './components/Contact/Index';

function App() {
  const [showLegend, setShowLegend] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isScrollEnabled, setIsScrollEnabled] = useState(false);
  const [, setIsManualScroll] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isScrollEnabled ? 'auto' : 'hidden';
  }, [isScrollEnabled]);

  useEffect(() => {
    const header = document.getElementById('header');
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowLegend(entry.intersectionRatio < 0.1);
      },
      { threshold: 0.1 }
    );

    if (header) {
      observer.observe(header);
    }

    return () => {
      if (header) {
        observer.unobserve(header);
      }
    };
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
  
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
              setActiveSection(sectionId);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40% 0px',
      }
    );
  
    sections.forEach((section) => sectionObserver.observe(section));
  
    return () => {
      sections.forEach((section) => sectionObserver.unobserve(section));
    };
  }, []);

  const handleScrollToAbout = () => {
    const aboutSection = document.getElementById('about-main');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleNavClick = async (sectionId: string) => {
    setIsManualScroll(true);
    const targetSection = document.getElementById(sectionId);

    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });

      await waitForScrollToComplete(targetSection);

      setIsManualScroll(false);
    }
  };

  const waitForScrollToComplete = (target: HTMLElement): Promise<void> => {
    return new Promise((resolve) => {
      const checkIfScrolled = () => {
        const rect = target.getBoundingClientRect();
        if (Math.abs(rect.top) < 5) {
          resolve();
        } else {
          requestAnimationFrame(checkIfScrolled);
        }
      };
      checkIfScrolled();
    });
  };

  return (
    <div>
      <nav className={`legend ${showLegend ? 'visible' : ''}`}>
        <ul>
          <li className={activeSection === 'about-main' ? 'active' : ''}>
            <a href="#about-main" onClick={() => handleNavClick('about-main')}>About</a>
          </li>
          <li className={activeSection === 'experience' ? 'active' : ''}>
            <a href="#experience" onClick={() => handleNavClick('experience')}>Experience</a>
          </li>
          <li className={activeSection === 'publication' ? 'active' : ''}>
            <a href="#publication" onClick={() => handleNavClick('publication')}>Publication</a>
          </li>
          <li className={activeSection === 'playground' ? 'active' : ''}>
            <a href="#playground" onClick={() => handleNavClick('playground')}>Playground</a>
          </li>
          <li className={activeSection === 'contact' ? 'active' : ''}>
            <a href="#contact" onClick={() => handleNavClick('contact')}>Contact</a>
          </li>
        </ul>
      </nav>
      <section id="header">
        <TypewriterHeader enableScroll={() => setIsScrollEnabled(true)} onArrowClick={handleScrollToAbout} />
      </section>
      <AboutSection />
      <section id="experience">
        <Experience />
      </section>
      <section id="publication">
        <Publication />
      </section>
      <section id="playground">
        <Playground />
      </section>
      <section id="contact">
        <Contact />
      </section>
    </div>
  );
}

export default App;