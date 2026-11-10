
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

    const contents = messages.slice(-6).map(message => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: String(message.content || "").slice(0, 2000) }]
    }));

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    let response;

    try {
      response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey
          },
          signal: controller.signal,
          body: JSON.stringify({
            systemInstruction: {
              parts: [{
                text: "Você é a AstroNexus AI do NOVASTRIUM. Responda em português brasileiro, de forma clara, científica e objetiva. Explique Marte e exploração espacial. Responda preferencialmente em até 150 palavras."
              }]
            },
            contents,
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 500
            }
          })
        }
      );
    } finally {
      clearTimeout(timeout);
    }

    const data = await response.json();

    if (!response.ok) {
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

  }  } catch (error) {
    console.error("Erro na AstroNexus AI:", error);

    return res.status(error.name === "AbortError" ? 504 : 500).json({
      error: error.message || "Erro desconhecido ao consultar o Gemini."
    });
  }
}
