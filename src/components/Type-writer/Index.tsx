import { useTypewriter } from 'react-simple-typewriter';
import { useState } from 'react';
import './TypewriterHeader.css';

const TypewriterHeader = ({ enableScroll, onArrowClick }: { enableScroll: () => void; onArrowClick: () => void }) => {
  const [showArrow, setShowArrow] = useState(false);

  const [text] = useTypewriter({
    words: [
      'HEY there!',
      'i’m isyman',
      'a developer and lifelong learner',
      "let's turn lines of code into sparks of magic!",
    ],
    loop: 1,
    typeSpeed: 60,
    deleteSpeed: 30,
    delaySpeed: 1000,
    onLoopDone() {
      setShowArrow(true);
      enableScroll(); 
    },
  });

  return (
    <header className="highlited">
      <div className="typewriter-container">
        <h1>
          {text}
          <span className="cursor">|</span>
        </h1>
      </div>
      {showArrow && (
        <div className="arrow-container" onClick={onArrowClick}>
          <img src="/arrow/3.png" alt="Arrow 1" className="arrow arrow-1" />
          <img src="/arrow/3.png" alt="Arrow 2" className="arrow arrow-2" />
          <img src="/arrow/3.png" alt="Arrow 3" className="arrow arrow-3" />
        </div>
      )}
    </header>
  );
};

export default TypewriterHeader;