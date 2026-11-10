export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Use GET para este diagnóstico." });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "GEMINI_API_KEY não encontrada na Vercel."
    });
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models",
      {
        headers: {
          "x-goog-api-key": apiKey
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "Erro ao consultar modelos."
      });
    }

    const models = (data.models || [])
      .filter(model =>
        model.supportedGenerationMethods?.includes("generateContent")
      )
      .map(model => model.name);

    return res.status(200).json({
      success: true,
      models
    });

  } catch (error) {
    return res.status(500).json({
      error: "Falha na conexão com o Google."
    });
  }
}
