import { useState } from "react";
import "./App.css";
import robotIcon from "../public/robot.jpg";

function App() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [isChatVisible, setIsChatVisible] = useState(false);

  const backendUrl = "http://localhost:3030/gemini";

  const sendChat = async () => {
    if (!prompt.trim()) {
      alert("Prompt cannot be empty!");
      return;
    }
    setLoading(true);
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          history,
          prompt,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(backendUrl, options);
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const data = await response.json();
      setHistory((oldHistory) => [
        ...oldHistory,
        { role: "user", parts: [{ text: prompt }] },
        { role: "model", parts: [{ text: data.text }] },
      ]);
      setPrompt("");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container">
        <div
          className="robot-icon"
          onClick={() => setIsChatVisible(!isChatVisible)}
        >
          <img src={robotIcon} alt="Robot" />
        </div>

        {isChatVisible && (
          <div className="chat-container">
            <input
              className="input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your message..."
            />
            <button className="button" disabled={loading} onClick={sendChat}>
              {loading ? "loading..." : "SEND!"}
            </button>
            {history.map((chat, index) => (
              <div className="chat" key={index}>
                <h3>{chat.role}</h3>
                <p>{chat.parts[0].text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
