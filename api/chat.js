export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Chave Gemini não configurada." });
  }

  try {
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "Mensagens inválidas." });
    }

    const contents = messages.slice(-12).map(message => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: String(message.content || "").slice(0, 4000) }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: "Você é a AstroNexus AI, assistente científica do NOVASTRIUM. Responda em português brasileiro, explique Marte, geologia planetária, missões espaciais e exploração espacial. Seja educativa e nunca invente informações."
            }]
          },
          contents,
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 1000
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro Gemini:", data);
      return res.status(502).json({
        error: data.error?.message || "Erro ao consultar o Gemini."
      });
    }

    const reply = data.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("")
      .trim();

    if (!reply) {
      return res.status(502).json({ error: "Resposta vazia do Gemini." });
    }

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("Erro AstroNexus:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
}
