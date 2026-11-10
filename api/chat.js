export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Chave da IA não configurada." });
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: "Você é a AstroNexus AI, assistente científica do NOVASTRIUM. Responda em português brasileiro e ajude a compreender Marte, geologia planetária, NASA e exploração espacial. Nunca invente dados científicos."
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
      return res.status(502).json({ error: "Falha ao consultar o Gemini." });
    }

    const reply = data.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("")
      .trim();

    if (!reply) {
      return res.status(502).json({ error: "A IA não retornou resposta." });
    }

    return res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno da IA." });
  }
}
