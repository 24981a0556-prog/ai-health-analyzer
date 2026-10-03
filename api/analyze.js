/**
 * Vercel Serverless Function: /api/analyze
 * Safe server-side AI integration supporting OpenAI-compatible or Gemini API.
 * Never exposes AI_API_KEY to the client.
 */

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { payload } = req.body || {};
  if (!payload) {
    return res.status(400).json({ error: 'Missing analysis payload' });
  }

  const apiKey = process.env.AI_API_KEY || req.body.apiKey;
  if (!apiKey) {
    return res.status(400).json({ error: 'No AI API Key provided' });
  }

  try {
    const systemPrompt = `You are a medical informatics communication assistant for an educational prototype called AI Health Analyzer.
Your task is to provide plain-language, non-diagnostic explanations of health parameters, symptoms, and lab reports.
STRICT SAFETY RULES:
1. You MUST NEVER diagnose conditions (e.g. NEVER say "You have diabetes" or "You have anemia").
2. State findings cautiously (e.g., "The fasting glucose level of 108 mg/dL is above the reference interval of 70-100 mg/dL, which may warrant further discussion with a doctor").
3. Emphasize that results have multiple possible causes and require clinical context.
4. Output JSON strictly with these exact keys:
{
  "summary": "Short 2-3 sentence overview of findings",
  "findings": [{"title": "Parameter/Symptom name", "description": "Explanation", "category": "Category"}],
  "possibleReasons": ["List of general, non-diagnostic possibilities"],
  "nextSteps": ["Actionable, safe informational guidance"]
}`;

    // Call OpenAI API or compatible endpoint
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: JSON.stringify(payload) }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(502).json({ error: 'AI provider error', details: errText });
    }

    const completion = await response.json();
    const content = completion.choices[0].message.content;
    const parsed = JSON.parse(content);

    return res.status(200).json(parsed);
  } catch (error) {
    console.error('Serverless AI error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
