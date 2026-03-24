export default async function handler(req, res) {
  // Solo permitimos peticiones POST
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const { message, lang } = req.body;
  
  // Le damos un contexto a la IA para que sepa quién es
  const systemPrompt = lang === 'es' 
    ? "Eres el asistente experto de LitzyFit Personal Trainer. Responde siempre en español. Sé amable, profesional y conciso." 
    : "És o assistente especialista da LitzyFit Personal Trainer. Responde sempre em português europeu. Sê simpático, profissional e conciso.";

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY, // Vercel pondrá tu clave secreta aquí
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022', // Modelo más inteligente y rápido
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await anthropicRes.json();
    
    // Devolvemos la respuesta al navegador
    res.status(200).json({ reply: data.content[0].text });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro de comunicação com a IA' });
  }
}