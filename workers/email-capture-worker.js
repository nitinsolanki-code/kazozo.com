/**
 * Kazozo Email Capture — Cloudflare Worker
 *
 * This worker receives form submissions from kazozo.com and creates
 * leads in the Notion CRM database. Deploy on Cloudflare Workers (free tier).
 *
 * SETUP:
 * 1. Go to https://workers.cloudflare.com and sign up (free)
 * 2. Create a new Worker
 * 3. Paste this entire file as the worker code
 * 4. Add these environment variables (Settings → Variables):
 *    - NOTION_API_KEY: Your Notion integration token (starts with ntn_)
 *    - NOTION_DATABASE_ID: e29e21ce-d1b7-409d-8f13-06e2af9a298e
 * 5. Update ALLOWED_ORIGINS below if needed
 * 6. Deploy the worker
 * 7. Copy the worker URL (e.g. https://kazozo-capture.YOUR_SUBDOMAIN.workers.dev)
 * 8. Update CAPTURE_ENDPOINT in index.html with the worker URL
 *
 * NOTION INTEGRATION SETUP:
 * 1. Go to https://www.notion.so/my-integrations
 * 2. Create a new integration (name: "Kazozo Email Capture")
 * 3. Copy the "Internal Integration Secret" — that's your NOTION_API_KEY
 * 4. Go to the "Kazozo CRM — Leads" database in Notion
 * 5. Click ••• → Connections → Connect to "Kazozo Email Capture"
 */

const ALLOWED_ORIGINS = [
  'https://kazozo.com',
  'https://www.kazozo.com',
  'http://localhost:3000',  // for local dev — remove in production if desired
];

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleCORS(request);
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // CORS check
    const origin = request.headers.get('Origin') || '';
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return new Response('Forbidden', { status: 403 });
    }

    try {
      const { email, source, page } = await request.json();

      // Basic email validation
      if (!email || !email.includes('@') || !email.includes('.')) {
        return jsonResponse({ error: 'Invalid email' }, 400, origin);
      }

      // Create lead in Notion
      const notionRes = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parent: { database_id: env.NOTION_DATABASE_ID },
          properties: {
            'Lead Name': {
              title: [{ text: { content: email.split('@')[0] } }]
            },
            'Email': {
              email: email
            },
            'Source': {
              select: { name: source || 'Email Capture' }
            },
            'Status': {
              select: { name: 'New' }
            },
            'Notes': {
              rich_text: [{ text: { content: `Signed up via ${page || 'homepage'} email capture form` } }]
            }
          }
        })
      });

      if (!notionRes.ok) {
        const err = await notionRes.text();
        console.error('Notion API error:', err);
        return jsonResponse({ error: 'Failed to save' }, 500, origin);
      }

      return jsonResponse({ success: true }, 200, origin);

    } catch (err) {
      console.error('Worker error:', err);
      return jsonResponse({ error: 'Server error' }, 500, origin);
    }
  }
};

function handleCORS(request) {
  const origin = request.headers.get('Origin') || '';
  const headers = {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : '',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
  return new Response(null, { status: 204, headers });
}

function jsonResponse(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : '',
    }
  });
}
