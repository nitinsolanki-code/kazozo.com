# Update Agent Pages Script

Updates all 11 agent HTML pages with data from a manifest (tool count and capabilities).

## Usage

```bash
# From local manifest file
node scripts/update-agent-pages.js ./agents-manifest.json

# From API (default)
node scripts/update-agent-pages.js --from-api

# From API (without arguments)
node scripts/update-agent-pages.js
```

## Manifest Format

The manifest should be a JSON file with this structure:

```json
{
  "agents": [
    {
      "id": "frontline-agent",
      "name": "Frontline Agent",
      "toolCount": 21,
      "capabilities": [
        {
          "emoji": "💬",
          "title": "Answer Questions",
          "description": "Instant FAQ matching...",
          "isNew": false
        }
      ]
    }
  ]
}
```

### Agent ID Mapping

The script maps agent IDs in the manifest to HTML filenames:

- `frontline-agent` → `agents/frontline-agent.html`
- `sales-agent` → `agents/sales-agent.html`
- `customer-support` → `agents/customer-support.html`
- `lead-qualifier` → `agents/lead-qualifier.html`
- `service-operations` → `agents/service-operations.html`
- `employee-agent` → `agents/employee-agent.html`
- `it-helpdesk` → `agents/it-helpdesk.html`
- `content-agent` → `agents/content-agent.html`
- `finance-agent` → `agents/finance-agent.html`
- `review-manager` → `agents/review-manager.html`
- `weekly-report` → `agents/weekly-report.html`

## What It Updates

### 1. Tool Count
Finds and updates: `<div class="stat-num">NUMBER</div><div class="stat-label">integrated tools</div>`

### 2. Capabilities Grid
Replaces the entire `<div class="cap-grid">` section with new capability cards.

Each capability becomes:
```html
<div class="cap-card">
  <div class="cap-icon">EMOJI</div>
  <div class="cap-title">TITLE</div>
  <div class="cap-desc">DESCRIPTION</div>
</div>
```

If `isNew: true`, adds a green NEW badge:
```html
<div class="cap-title">
  TITLE 
  <span style="background:rgba(123,234,142,0.15);color:#7BEA8E;...">NEW</span>
</div>
```

## Notes

- Only modifies the tool count and capabilities sections
- Does not touch any other part of the HTML (hero, styles, nav, footer, etc.)
- Uses Node.js built-in modules only (no npm dependencies)
- Prints a summary of what was changed
- Gracefully handles missing files with warnings
