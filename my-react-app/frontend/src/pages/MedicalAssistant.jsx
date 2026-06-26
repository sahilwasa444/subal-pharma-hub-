import { useState } from "react";
import api from "../services/api";

function MedicalAssistant() {
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!message.trim()) return;

    try {
      setLoading(true);

      const response = await api.post(
        "/medical-assistant/chat",
        { message }
      );

      setAnswer(response.data.answer);
    } catch (error) {
      console.error(error);
      setAnswer("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>PharmaHub Medical Assistant</h1>

      <textarea
        rows="5"
        cols="50"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask about medicines..."
      />

      <br />

      <button
        onClick={handleAsk}
        disabled={loading}
        style={{ marginTop: 8 }}
      >
        {loading ? "Thinking..." : "Ask"}
      </button>

      <hr />

      <h3>Answer:</h3>
      <p>{answer}</p>
    </div>
  );
}

export default MedicalAssistant;
