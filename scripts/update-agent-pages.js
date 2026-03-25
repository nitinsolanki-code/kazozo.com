#!/usr/bin/env node

/**
 * update-agent-pages.js
 *
 * Updates 11 agent HTML pages with data from a manifest.
 *
 * Usage:
 *   node scripts/update-agent-pages.js ./agents-manifest.json    (from local file)
 *   node scripts/update-agent-pages.js --from-api                 (from API)
 *   node scripts/update-agent-pages.js                            (default to API)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// ===== CONFIG =====
const DEFAULT_API_URL = 'https://api.kazozo.com/api/agents/manifest';
const AGENTS_DIR = path.join(__dirname, '..', 'agents');
const SCRIPT_DIR = __dirname;

// Map of agent ID patterns to HTML filenames
const AGENT_FILE_MAPPING = {
  'frontline-agent': 'frontline-agent.html',
  'customer-support': 'customer-support.html',
  'sales-agent': 'sales-agent.html',
  'lead-qualifier': 'lead-qualifier.html',
  'service-operations': 'service-operations.html',
  'employee-agent': 'employee-agent.html',
  'it-helpdesk': 'it-helpdesk.html',
  'content-agent': 'content-agent.html',
  'finance-agent': 'finance-agent.html',
  'review-manager': 'review-manager.html',
  'weekly-report': 'weekly-report.html',
};

// ===== HELPERS =====

/**
 * Fetch data from URL (HTTPS)
 */
function fetchFromUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse JSON from ${url}: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

/**
 * Load manifest from file or API
 */
async function loadManifest(source) {
  try {
    if (source === '--from-api' || !source) {
      console.log(`Fetching manifest from API: ${DEFAULT_API_URL}`);
      return await fetchFromUrl(DEFAULT_API_URL);
    }

    // Load from file
    const filePath = path.resolve(source);
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    console.log(`Loading manifest from file: ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error loading manifest: ${err.message}`);
    process.exit(1);
  }
}

/**
 * Generate a capability card HTML from a capability object
 */
function generateCapabilityCard(capability) {
  const hasNewBadge = capability.isNew;

  let titleHtml = `${capability.title}`;
  if (hasNewBadge) {
    titleHtml += `<span style="background:rgba(123,234,142,0.15);color:#7BEA8E;font-size:.65rem;padding:2px 8px;border-radius:100px;margin-left:6px;font-weight:600;vertical-align:middle;">NEW</span>`;
  }

  return `        <div class="cap-card">
          <div class="cap-icon">${capability.emoji || '✨'}</div>
          <div class="cap-title">${titleHtml}</div>
          <div class="cap-desc">${capability.description}</div>
        </div>`;
}

/**
 * Update tool count in the stats section
 */
function updateToolCount(htmlContent, toolCount) {
  // Find pattern: <div class="stat-num">NUMBER</div><div class="stat-label">integrated tools</div>
  const pattern = /(<div class="stat">)?<div class="stat-num">(\d+|[^<]+)<\/div>\s*<div class="stat-label">integrated tools<\/div>/;

  const replacement = `<div class="stat-num">${toolCount}</div><div class="stat-label">integrated tools</div>`;

  if (!pattern.test(htmlContent)) {
    console.warn('  ⚠️  Could not find tool count pattern (might not exist on this page)');
    return htmlContent;
  }

  return htmlContent.replace(pattern, replacement);
}

/**
 * Update capabilities grid with new cards from manifest
 */
function updateCapabilitiesGrid(htmlContent, capabilities) {
  // Find the <div class="cap-grid"> ... </div> section
  const capGridPattern = /(<div class="cap-grid">)([\s\S]*?)(<\/div>\s*<\/div>\s*<\/section>)/;

  if (!capGridPattern.test(htmlContent)) {
    console.warn('  ⚠️  Could not find capabilities grid pattern');
    return htmlContent;
  }

  // Generate new capability cards
  const capabilityCards = capabilities
    .map(cap => generateCapabilityCard(cap))
    .join('\n');

  // Replace: keep opening tag, replace inner cards, keep closing div
  return htmlContent.replace(
    capGridPattern,
    `$1\n${capabilityCards}\n      $3`
  );
}

/**
 * Update a single agent HTML file
 */
function updateAgentFile(filePath, agentData) {
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠️  File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Update tool count
  if (agentData.toolCount !== undefined) {
    content = updateToolCount(content, agentData.toolCount);
    console.log(`  ✓ Updated tool count: ${agentData.toolCount}`);
  }

  // Update capabilities grid
  if (agentData.capabilities && Array.isArray(agentData.capabilities)) {
    content = updateCapabilitiesGrid(content, agentData.capabilities);
    console.log(`  ✓ Updated capabilities grid (${agentData.capabilities.length} items)`);
  }

  // Write back to file
  fs.writeFileSync(filePath, content, 'utf8');
  return true;
}

/**
 * Main function
 */
async function main() {
  const manifestSource = process.argv[2];

  console.log('═══════════════════════════════════════════════════════');
  console.log('  Agent Pages Updater');
  console.log('═══════════════════════════════════════════════════════\n');

  // Load manifest
  const manifest = await loadManifest(manifestSource);

  if (!manifest.agents || !Array.isArray(manifest.agents)) {
    console.error('Error: Manifest does not contain an "agents" array.');
    process.exit(1);
  }

  console.log(`\nLoaded manifest with ${manifest.agents.length} agents.\n`);

  // Process each agent
  let updated = 0;
  let skipped = 0;

  for (const agentData of manifest.agents) {
    const agentId = agentData.id;
    const shortId = agentId.split("/").pop(); // "customer-facing/frontline-agent" → "frontline-agent"
    const fileName = AGENT_FILE_MAPPING[shortId];

    if (!fileName) {
      console.log(`⊘ Skipping unknown agent: ${agentId}`);
      skipped++;
      continue;
    }

    const filePath = path.join(AGENTS_DIR, fileName);

    console.log(`\n📄 ${agentId}`);
    const success = updateAgentFile(filePath, agentData);

    if (success) {
      updated++;
    } else {
      skipped++;
    }
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log(`  Summary: ${updated} updated, ${skipped} skipped`);
  console.log('═══════════════════════════════════════════════════════\n');

  process.exit(0);
}

// Run
main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
