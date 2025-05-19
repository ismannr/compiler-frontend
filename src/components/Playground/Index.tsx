import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import Editor from "@monaco-editor/react";
import "./Playground.css";
import codeSamples from "./codeSamples";

const Playground = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const [language, setLanguage] = useState<keyof typeof codeSamples>("c");
  const [terminalOutput, setTerminalOutput] = useState<string>("");
  const [code, setCode] = useState(codeSamples["c"]);
  const [isRunning, setIsRunning] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [runHovered, setRunHovered] = useState(false);
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);


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
      const res = await fetch(`http://${API_BASE_URL}/api/compiler/start`, {
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

      const socket = new WebSocket(`ws://${API_BASE_URL}/ws/session/${sessionId}`);
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
        <div className="browser-frame">
          <div className="browser-frame-header">
            <span className="browser-dot red"></span>
            <span className="browser-dot yellow"></span>
            <span className="browser-dot green"></span>
          </div>
          <div style={{ textAlign: "center", marginTop: 14, marginBottom: 10 }}>
            <label htmlFor="language-select" style={{ color: "white", fontWeight: "bold", fontFamily: "monospace", marginRight: 8 }}>
              Language:
            </label>
            <select
              id="language-select"
              value={language}
              onChange={handleLanguageChange}
              style={{ padding: "6px 12px", borderRadius: 6, fontWeight: "bold", fontFamily: "monospace", color: "white" }}
            >
              <option value="java">Java</option>
              <option value="go">Go</option>
              <option value="c">C</option>
              <option value="node">Node.js</option>
            </select>
            <button
              onClick={handleRun}
              disabled={false}
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
                cursor: "pointer",
                width: "80px",
              }}
            >
              {isRunning
                ? runHovered
                  ? "Stop"
                  : "Running"
                : "Run"}
            </button>
          </div>
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
              {
                (() => {
                  const lines = terminalOutput.split("\n");
                  let highlightNextPrompt = false;
                  return lines.map((line, idx) => {
                    line = line.trimStart();
                    const userTagIndex = line.indexOf("[USER]");
                    const isPromptLine = line.startsWith(">");

                    if (line.includes("Process exited with code 0")) {
                      highlightNextPrompt = true;
                      return (
                        <span key={idx} style={{ color: "#4fc3f7" }}>
                          {line}
                          {"\n"}
                        </span>
                      );
                    }

                    if (line.includes("WebSocket connected!")) {
                      return (
                        <span key={idx} style={{ color: "limegreen" }}>
                          {line}
                          {"\n"}
                        </span>
                      );
                    }

                    if (line.includes("This process is running inside a container.")) {
                      return (
                        <span key={idx} style={{ color: "white" }}>
                          {line}
                          {"\n"}
                        </span>
                      );
                    }

                    if (highlightNextPrompt && isPromptLine) {
                      highlightNextPrompt = false;
                      return (
                        <span key={idx} style={{ color: "#4fc3f7" }}>
                          {line}
                          {"\n"}
                        </span>
                      );
                    }

                    if (userTagIndex !== -1) {
                      const beforeUser = line.slice(0, userTagIndex);
                      const userInput = line.slice(userTagIndex + "[USER]".length);

                      return (
                        <span key={idx}>
                          {beforeUser}
                          <span style={{ color: "limegreen" }}>{userInput}</span>
                          {"\n"}
                        </span>
                      );
                    }

                    if (isPromptLine) {
                      return (
                        <span key={idx} style={{ color: "red" }}>
                          {line}
                          {"\n"}
                        </span>
                      );
                    }

                    return (
                      <span key={idx}>
                        {line}
                        {"\n"}
                      </span>
                    );
                  });
                })()
              }
            </div>
          </div>
          <input
            type="text"
            placeholder="Standard input (optional)"
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter" && userInput.trim() !== "") {
                setTerminalOutput(prev => prev + "[USER] " + userInput + "\n");
                const socket = socketRef.current;
                if (socket && socket.readyState === WebSocket.OPEN) {
                  socket.send(userInput);
                } else {
                  setTerminalOutput(prev => prev + "Socket not open" + "\n");
                }

                setUserInput("");
              }
            }}

            className="playground-stdin-input"
          />
        </div>
      </div>
    </section>
  );
};

export default Playground;