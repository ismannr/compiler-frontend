import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import "./Playground.css";
import codeSamples from "./codeSamples";

const Playground = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const [language, setLanguage] = useState<keyof typeof codeSamples>("java");
  const [terminalOutput, setTerminalOutput] = useState<string>("");
  const [code, setCode] = useState(codeSamples["java"]);
  const [isRunning, setIsRunning] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [runHovered, setRunHovered] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch(`https://${API_BASE_URL}`, { method: "HEAD" });
        if (response.ok) {
          setIsBlocked(false);
        } else {
          setIsBlocked(true);
        }
      } catch (error) {
        setIsBlocked(true);
      } finally {
        setIsChecking(false);
      }
    };

    checkApiStatus();
  }, []);

  useEffect(() => {
    if (showInfo) {
      const timer = setTimeout(() => setShowInfo(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showInfo]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value as keyof typeof codeSamples;
    if (isRunning) {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        const msg = "\n> ====== Execution stopped by user ======\n";
        socketRef.current.close();
        setTerminalOutput(prev => prev + msg);
      }
      setIsRunning(false);
      return;
    }
    setLanguage(lang);
    setCode(codeSamples[lang]);
    setTerminalOutput("\n");
  };

  const handleRun = async () => {
    if (isRunning) {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        const msg = "\n> ====== Execution stopped by user ======\n";
        socketRef.current.close();
        setTerminalOutput(prev => prev + msg);
      }
      setIsRunning(false);
      return;
    }
    setIsRunning(true);
    setTerminalOutput(`> Running ${language} code...\n`);
    try {
      const res = await fetch(`https://${API_BASE_URL}/api/compiler/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          code,
          input: userInput,
        }),
      });

      const json = await res.json();

      if (!json.data) {
        const msg = json.message || "Failed to get session ID.";
        setTerminalOutput(prev => prev + "\n> " + msg + "\n");
        setIsRunning(false);
        return;
      }

      const sessionId = json.data;

      const socket = new WebSocket(`wss://${API_BASE_URL}/ws/session/${sessionId}`);
      socketRef.current = socket;

      socket.onopen = () => {
        setTerminalOutput(prev => prev + "WebSocket connected!\n");
        setTerminalOutput(prev => prev + "This process is running inside a container.\n");
      };

      socket.onmessage = (event) => {
        let msg = event.data;
        if (msg.includes("terminated")) {
          msg = "\n\n" + msg;
        }
        setTerminalOutput(prev => prev + msg);
      };

      socket.onerror = () => {
        setTerminalOutput(prev => prev + "\n> Session error." + "\n");
      };

      socket.onclose = () => {
        setTerminalOutput(prev => prev + "\n> Session closed." + "\n");
        setIsRunning(false);
      };

    } catch (err) {
      console.error("Fetch error:", err);
      setTerminalOutput(prev => prev + "\n> Error connecting to backend." + "\n");
      setIsRunning(false);
    }
  };

  return (
    <section className="section playground-section" id="playground">
      <h2 className="playground-title">Playground</h2>
      <div className="playground-container">
        <div className="browser-frame" style={{ position: "relative" }}>
          <div className="browser-frame-header">
            <span className="browser-dot red"></span>
            <span className="browser-dot yellow"></span>
            <span className="browser-dot green"></span>
          </div>
          <div>
            {(isBlocked || isChecking) && (
              <div
                style={{
                  position: "absolute",
                  top: "35px",
                  left: 0,
                  width: "100%",
                  height: "calc(100% - 40px)",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  zIndex: 10,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  fontFamily: "monospace",
                  fontSize: "16px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    fontFamily: "monospace",
                    fontSize: "16px",
                    textAlign: "center",
                    maxWidth: "400px",
                  }}
                >
                  {isChecking
                    ? "Checking backend service status..."
                    : "The compiler backend service is not reachable. Please try again later at 9AM-5PM on Mon-Fri (GMT+7)."}
                </div>
              </div>
            )}
            <div style={{ textAlign: "center", marginTop: 14, marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <label htmlFor="language-select" style={{ color: "white", fontWeight: "bold", fontFamily: "monospace", marginRight: 8 }}>
                Language:
              </label>
              <select
                id="language-select"
                value={language}
                onChange={handleLanguageChange}
                style={{ padding: "6px 12px", borderRadius: 6, fontWeight: "bold", fontFamily: "monospace", color: "white" }}
                disabled={isBlocked || isChecking}
              >
                <option value="java">Java</option>
                <option value="go">Go</option>
                <option value="c">C</option>
                <option value="node">Node.js</option>
              </select>
              <button
                onClick={handleRun}
                disabled={isBlocked || isChecking}
                onMouseEnter={() => setRunHovered(true)}
                onMouseLeave={() => setRunHovered(false)}
                style={{
                  marginLeft: 16,
                  padding: "6px 6px",
                  borderRadius: 6,
                  fontWeight: "bold",
                  fontFamily: "monospace",
                  background: runHovered && isRunning ? "#ff4d4f" : "#ffe66d",
                  color: "#232324",
                  border: "none",
                  cursor: isBlocked || isChecking ? "not-allowed" : "pointer",
                  width: "80px",
                }}
              >
                {isRunning
                  ? runHovered
                    ? "Stop"
                    : "Running"
                  : "Run"}
              </button>
              <span
                onClick={() => setShowInfo(true)}
                style={{
                  marginLeft: 8,
                  display: "inline-block",
                  width: "24px",
                  height: "24px",
                  cursor: "pointer",
                }}
                title="Info"
              >
                <img
                  src="https://img.icons8.com/ios/50/info--v1.png"
                  alt="Info"
                  style={{
                    width: "24px",
                    height: "24px",
                    filter: "invert(100%)",
                  }}
                />
              </span>
            </div>
            {showInfo && (
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  background: "#232324",
                  color: "white",
                  padding: "10px",
                  borderRadius: "6px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  animation: "fadeIn 0.5s",
                  zIndex: 1000,
                  fontFamily: "monospace",
                }}
              >
                The compiler backend service is only available from 9 AM to 5 PM, Monday to Friday.
              </div>
            )}
            <Editor
              height="500px"
              defaultLanguage={language === "node" ? "javascript" : language}
              language={language === "node" ? "javascript" : language}
              value={code}
              onChange={(v: string | undefined) => setCode(v || "")}
              theme="vs-dark"
              options={{ fontSize: 14 }}
            />
            <div className="playground-terminal">
              <div
                className="playground-terminal-output"
                ref={terminalRef}
                style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}
              >
                {terminalOutput}
              </div>
            </div>
            <input
              type="text"
              placeholder="Standard input (optional)"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              disabled={isBlocked || isChecking}
              className="playground-stdin-input"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Playground;