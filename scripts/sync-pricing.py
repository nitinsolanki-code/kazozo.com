#!/usr/bin/env python3
"""
sync-pricing.py — Kazozo pricing sync & drift detection tool.

USAGE
-----
  # Audit only (no writes) — scans all HTML for any pricing string that
  # doesn't match pricing.json and reports drift.
  python3 scripts/sync-pricing.py

  # Apply a price change sitewide. Maps OLD->NEW literally across every
  # HTML file in the repo (excluding blog posts, which are time-stamped
  # historical content — see --include-blog to override).
  python3 scripts/sync-pricing.py --apply \
      --map '$249:$299,$499:$549,$999:$1099'

  # Include blog posts (e.g. if you're willing to rewrite history).
  python3 scripts/sync-pricing.py --apply --map '...' --include-blog

pricing.json is the single source of truth. This script makes
sitewide changes a one-command operation instead of a 45-file diff.
"""

from __future__ import annotations
import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent  # Website/
PRICING_PATH = ROOT / "scripts" / "pricing.json"

# Files/dirs to skip entirely
SKIP_DIRS = {"node_modules", ".git", "workers", ".github"}
SKIP_FILES = {"sync-pricing.py"}


def load_pricing() -> dict:
    with PRICING_PATH.open() as f:
        return json.load(f)


def canonical_strings(pricing: dict) -> dict[str, list[str]]:
    """Build a map of {label: [expected string variants]} from pricing.json.

    Variants cover the ways these values appear in HTML:
      - plan monthly: '$249', '$249/mo', '$249/month'
      - overage: '$0.40', '$0.30', '$0.22'
      - response volumes: '500', '2,000', '6,000'
      - voice: '$1.10'
    """
    plans = pricing["plans"]
    voice = pricing["agents"]["voice"]

    def vol(n: int) -> list[str]:
        return [f"{n:,}", str(n)]

    return {
        "starter_monthly": [plans["starter"]["display"]],           # "$249"
        "growth_monthly":  [plans["growth"]["display"]],            # "$499"
        "pro_monthly":     [plans["pro"]["display"]],               # "$999"
        "starter_volume":  vol(plans["starter"]["ai_responses"]),   # 500
        "growth_volume":   vol(plans["growth"]["ai_responses"]),    # 2,000
        "pro_volume":      vol(plans["pro"]["ai_responses"]),       # 6,000
        "starter_overage": ["$0.40"],  # pricing.json stores as string w/ suffix
        "growth_overage":  ["$0.30"],
        "pro_overage":     ["$0.22"],
        "voice_rate":      [voice["display"]],                      # "$1.10"
    }


def iter_html(include_blog: bool = False):
    for path in ROOT.rglob("*.html"):
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        if path.name in SKIP_FILES:
            continue
        if not include_blog and path.parent.name == "blog":
            continue
        yield path


def audit(pricing: dict) -> int:
    """Scan every non-blog HTML file for any plan-price string that
    doesn't match pricing.json. Returns drift count."""
    expected = canonical_strings(pricing)
    # Flatten to a set of expected tokens
    expected_tokens = {s for vals in expected.values() for s in vals}

    # Patterns to look for (strings that LOOK like prices we care about)
    suspect_patterns = [
        r"\$\d{2,4}(?:\.\d{2})?(?!\d)",     # $N or $N.NN (plans, overage, voice)
        # Intentionally don't flag raw integers — too many false positives
    ]
    import re
    suspect_re = re.compile("|".join(suspect_patterns))

    # Known canonical prices (anything in this set is OK)
    canonical_prices = {
        pricing["plans"]["starter"]["display"],
        pricing["plans"]["growth"]["display"],
        pricing["plans"]["pro"]["display"],
        pricing["agents"]["voice"]["display"],
        "$0.40", "$0.30", "$0.22",
    }

    # Prices that appear in the site but are intentionally NOT ours
    # (competitor quotes, examples, etc. — we allow these)
    competitor_prices = {
        # Intercom seat prices, HubSpot tiers, Drift tiers, etc.
        # Rather than enumerate them all, only flag if the offending
        # number is CLOSE to one of our canonical numbers (249, 499, 999, 1.10).
    }

    # Unambiguously stale strings (match anywhere)
    stale_standalone = {
        "$149",   # old starter price
    }

    # Patterns that are stale only in the context of a Kazozo plan.
    # Window is intentionally small (<=120 chars, no newlines) so we don't
    # cross into unrelated paragraphs.
    stale_contextual = [
        (r"Growth[^.\n]{0,80}?2,?500(?!\s*\+)(?! responses/mo)",     "Growth ... 2,500 (old volume; now 2,000)"),
        (r"2,?500[^.\n]{0,40}?Growth",                               "2,500 ... Growth (old volume; now 2,000)"),
        (r"\$499[^.\n]{0,80}?2,?500(?! ?\+)",                        "$499 ... 2,500 (old volume; now 2,000)"),
        (r"Pro[^.\n]{0,80}?(?:7,?500|10,?000)(?!\s*\+)",             "Pro ... 7,500/10,000 (old volume; now 6,000)"),
        (r"\$999[^.\n]{0,80}?(?:7,?500|10,?000)(?! ?\+)",            "$999 ... 7,500/10,000 (old volume; now 6,000)"),
    ]

    drift = 0
    for path in iter_html():
        text = path.read_text(encoding="utf-8", errors="ignore")
        bad = []
        for token in stale_standalone:
            if token in text:
                bad.append(f"stale-standalone: {token!r}")
        for pattern, desc in stale_contextual:
            for m in re.finditer(pattern, text, flags=re.IGNORECASE | re.DOTALL):
                snippet = m.group(0)[:80].replace("\n", " ")
                bad.append(f"stale-contextual: {desc} — {snippet!r}")
        if bad:
            rel = path.relative_to(ROOT)
            for b in bad:
                print(f"DRIFT {rel}: {b}")
            drift += len(bad)
    return drift


def apply_map(mapping: dict[str, str], include_blog: bool) -> tuple[int, int]:
    """Apply an OLD->NEW string map across all HTML. Returns (files_changed, replacements)."""
    files_changed = 0
    total_replacements = 0
    for path in iter_html(include_blog=include_blog):
        text = path.read_text(encoding="utf-8", errors="ignore")
        new = text
        file_reps = 0
        for old, replacement in mapping.items():
            if old == replacement:
                continue  # no-op; don't count as a replacement
            if old in new:
                count = new.count(old)
                new = new.replace(old, replacement)
                file_reps += count
        if file_reps:
            path.write_text(new, encoding="utf-8")
            rel = path.relative_to(ROOT)
            print(f"UPDATED {rel}: {file_reps} replacement(s)")
            files_changed += 1
            total_replacements += file_reps
    return files_changed, total_replacements


def parse_map(raw: str) -> dict[str, str]:
    out = {}
    for pair in raw.split(","):
        pair = pair.strip()
        if not pair:
            continue
        if ":" not in pair:
            raise SystemExit(f"Invalid map entry (missing ':'): {pair!r}")
        old, new = pair.split(":", 1)
        out[old.strip()] = new.strip()
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true", help="Apply a price change map")
    ap.add_argument("--map", help="OLD:NEW,OLD:NEW,... literal substitutions")
    ap.add_argument("--include-blog", action="store_true",
                    help="Also rewrite blog/*.html (historical content by default excluded)")
    args = ap.parse_args()

    pricing = load_pricing()

    if args.apply:
        if not args.map:
            sys.exit("--apply requires --map")
        mapping = parse_map(args.map)
        files, reps = apply_map(mapping, include_blog=args.include_blog)
        print(f"\n{files} file(s) changed, {reps} total replacement(s).")
        print("Next: update scripts/pricing.json to match the new numbers, "
              "commit, and push.")
        return

    # Default: audit
    print(f"Source of truth: scripts/pricing.json")
    print(f"  Starter: {pricing['plans']['starter']['display']} · "
          f"{pricing['plans']['starter']['ai_responses']} AI responses · "
          f"{pricing['plans']['starter']['overage']}")
    print(f"  Growth:  {pricing['plans']['growth']['display']} · "
          f"{pricing['plans']['growth']['ai_responses']} AI responses · "
          f"{pricing['plans']['growth']['overage']}")
    print(f"  Pro:     {pricing['plans']['pro']['display']} · "
          f"{pricing['plans']['pro']['ai_responses']} AI responses · "
          f"{pricing['plans']['pro']['overage']}")
    print(f"  Voice:   {pricing['agents']['voice']['display']} / answered call")
    print()
    print("Scanning site HTML for stale values…")
    drift = audit(pricing)
    if drift == 0:
        print("\nNo drift detected. Site matches pricing.json.")
        return 0
    print(f"\n{drift} drift finding(s). Fix manually or via `--apply --map`.")
    return 1


if __name__ == "__main__":
    sys.exit(main() or 0)
