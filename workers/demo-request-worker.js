/**
 * Kazozo Demo Request — Cloudflare Worker
 *
 * Receives demo-request form submissions from kazozo.com/book-a-demo.html
 * and creates a "Demo Request" lead in the Notion CRM.
 *
 * SETUP (one-time):
 *   1. Go to https://workers.cloudflare.com and sign in
 *   2. Create a new Worker (e.g. "kazozo-demo-request")
 *   3. Paste this entire file as the worker code
 *   4. Add these environment variables (Settings → Variables):
 *        NOTION_API_KEY      — your Notion integration token (ntn_...)
 *        NOTION_DATABASE_ID  — the "Kazozo CRM — Leads" database ID
 *   5. Deploy. Copy the worker URL (e.g. https://kazozo-demo-request.YOUR_SUBDOMAIN.workers.dev)
 *   6. Paste that URL into DEMO_ENDPOINT inside book-a-demo.html
 *
 * Reuses the same Notion DB as email-capture-worker — leads are tagged
 * with Source = "Demo Request" so you can filter them in the CRM.
 */

const ALLOWED_ORIGINS = [
  'https://kazozo.com',
  'https://www.kazozo.com',
  'http://localhost:3000',
];

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return handleCORS(request);
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });

    const origin = request.headers.get('Origin') || '';
    if (!ALLOWED_ORIGINS.includes(origin)) return new Response('Forbidden', { status: 403 });

    try {
      const body = await request.json();
      const name = (body.name || '').trim();
      const email = (body.email || '').trim();
      const business = (body.business || '').trim();
      const website = (body.website || '').trim();
      const notes = (body.notes || '').trim();
      const source = body.source || 'Demo Request';
      const page = body.page || 'book-a-demo';

      if (!email || !email.includes('@') || !email.includes('.')) {
        return jsonResponse({ error: 'Invalid email' }, 400, origin);
      }
      if (!name) {
        return jsonResponse({ error: 'Name required' }, 400, origin);
      }

      const displayName = name || email.split('@')[0];
      const noteBody = [
        business ? `Business: ${business}` : null,
        website ? `Website: ${website}` : null,
        notes ? `Notes: ${notes}` : null,
        `Submitted via ${page}`,
      ].filter(Boolean).join('\n');

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
            'Lead Name': { title: [{ text: { content: displayName } }] },
            'Email': { email: email },
            'Source': { select: { name: source } },
            'Status': { select: { name: 'New' } },
            'Notes': { rich_text: [{ text: { content: noteBody } }] },
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
