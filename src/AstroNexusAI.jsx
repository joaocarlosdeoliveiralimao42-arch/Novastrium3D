import { useState } from "react";
import {
  Bot,
  X,
  Send,
  Sparkles,
  LoaderCircle
} from "lucide-react";

export default function AstroNexusAI() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Olá! Sou a AstroNexus AI. Posso ajudar você a explorar Marte, entender dados científicos e conhecer as missões espaciais. O que deseja descobrir?"
    }
  ]);

  async function sendMessage(event) {
    event.preventDefault();

    const question = input.trim();
    if (!question || loading) return;

    const updatedMessages = [
      ...messages,
      { role: "user", content: question }
    ];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: updatedMessages
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Falha ao consultar a IA.");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.reply
        }
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "Não consegui conectar à inteligência artificial. Verifique a configuração do servidor e tente novamente."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        className="astro-ai-trigger"
        onClick={() => setOpen(!open)}
        aria-label="Abrir AstroNexus AI"
      >
        {open ? <X size={24} /> : <Bot size={25} />}
      </button>

      {open && (
        <section className="astro-ai-window">
          <header className="astro-ai-header">
            <div className="astro-ai-avatar">
              <Sparkles size={21} />
            </div>

            <div>
              <strong>ASTRONEXUS AI</strong>
              <span>Assistente de exploração marciana</span>
            </div>

            <button onClick={() => setOpen(false)}>
              <X size={19} />
            </button>
          </header>

          <div className="astro-ai-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`astro-ai-message ${message.role}`}
              >
                {message.content}
              </div>
            ))}

            {loading && (
              <div className="astro-ai-message assistant">
                <LoaderCircle className="astro-ai-spinner" size={18} />
                Analisando sua pergunta...
              </div>
            )}
          </div>

          <form
            className="astro-ai-form"
            onSubmit={sendMessage}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Pergunte sobre Marte..."
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
            >
              <Send size={18} />
            </button>
          </form>
        </section>
      )}
    </>
  );
}
