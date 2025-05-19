import './Publication.css'
import { useState } from 'react';

const ARTICLE_URL = "https://bsimaslahat.or.id/bsi-maslahat-dan-binus-university-lakukan-serah-terima-alat-rekacipta-iot-di-pondok-pesantren-al-mahfudz-desa-cijayanti-kab-bogor-2/";

const Publication = () => {
  const [iframeError, setIframeError] = useState(false);
  return (
    <section className="section publication-section" id="publication">
      <h2 className="publication-title">Publications</h2>
      <div className="publication-embeds">
        <div className="browser-frame">
          <div className="browser-frame-header">
            <span className="browser-dot red"></span>
            <span className="browser-dot yellow"></span>
            <span className="browser-dot green"></span>
          </div>
          <div className="iframe-container">
            <iframe
              src={ARTICLE_URL}
              title="BSI Maslahat Article"
              width="1000"
              height="600"
              style={{ border: '1px solid #ccc' }}
              onError={() => setIframeError(true)}
            ></iframe>
            {iframeError && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'rgba(255,255,255,0.95)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                  textAlign: 'center'
                }}
              >
                <p>
                  This article requires human verification (CAPTCHA) and cannot be embedded.<br />
                  Please open it in a new tab and complete the verification.
                </p>
                <a
                  href={ARTICLE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    marginTop: 16,
                    color: '#007bff',
                    textDecoration: 'underline',
                    fontWeight: 'bold'
                  }}
                >
                  Open Article on bsimaslahat.or.id
                </a>
              </div>
            )}
            <a
              href={ARTICLE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="iframe-overlay-link"
            >
              View Article on bsimaslahat.or.id
            </a>
          </div>
        </div>
        <div className="browser-frame">
          <div className="browser-frame-header">
            <span className="browser-dot red"></span>
            <span className="browser-dot yellow"></span>
            <span className="browser-dot green"></span>
          </div>
          <iframe
            width="1000"
            height="600"
            src="https://www.youtube.com/embed/LRPiRlCXy9M"
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Publication;