const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const MODELS = [
  'claude-sonnet-4-6',
  'claude-sonnet-4-5-20250514',
  'claude-3-5-sonnet-20241022',
  'claude-3-5-sonnet-latest',
];

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) {
    return jsonResponse({ error: 'Report generation is not configured' }, 500);
  }

  let prompt = '';
  try {
    const body = await req.json();
    prompt = typeof body.prompt === 'string' ? body.prompt : '';
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  if (prompt.length < 100 || prompt.length > 25000) {
    return jsonResponse({ error: 'Invalid report prompt' }, 400);
  }

  let lastError = 'No available model found';

  try {
    for (const model of MODELS) {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model,
          max_tokens: 8192,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (res.ok) {
        const body = await res.json();
        const text = body.content?.[0]?.text;
        if (typeof text !== 'string' || !text.trim()) {
          return jsonResponse({ error: 'Empty report response' }, 502);
        }
        return jsonResponse({ text });
      }

      if (res.status === 404) {
        lastError = `Model ${model} not available`;
        continue;
      }

      const errBody = await res.text();
      return jsonResponse({ error: `Report API error ${res.status}: ${errBody.slice(0, 200)}` }, 502);
    }

    return jsonResponse({ error: lastError }, 502);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate report';
    return jsonResponse({ error: message }, 500);
  }
});
