#!/usr/bin/env node
/**
 * Docs integrity guard.
 *
 * 1. Every LibertAI docs URL listed in public/llms.txt must resolve to a page in
 *    the built site. VitePress runs with `cleanUrls` disabled (Aleph hosting), so
 *    leaf pages live at `<name>.html` while section indexes live at `<dir>/index.html`.
 *    llms.txt once pointed 11 of 15 links at 404s — this makes that impossible.
 * 2. Every model id referenced in markdown must exist in scripts/known-models.json
 *    (kept in sync with GET /v1/models), so a removed model can't linger in the
 *    quickstart.
 *
 * Run after `npm run build`.
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(root, ".vitepress", "dist");
const DOCS_HOST = "https://docs.libertai.io";

const errors = [];

function walk(dir, ext, out = []) {
	for (const entry of readdirSync(dir)) {
		if (entry === "node_modules" || entry === ".vitepress" || entry.startsWith(".")) continue;
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) walk(full, ext, out);
		else if (full.endsWith(ext)) out.push(full);
	}
	return out;
}

function urlToDistFile(pathname) {
	const clean = pathname.replace(/[#?].*$/, "");
	if (clean.endsWith("/")) return join(DIST, clean, "index.html");
	return join(DIST, clean);
}

// ── 1. llms.txt links ────────────────────────────────────────────────
const llms = readFileSync(join(root, "public", "llms.txt"), "utf8");
const urls = [...llms.matchAll(/https:\/\/docs\.libertai\.io[^\s)\]"']*/g)].map((m) => m[0]);

if (!existsSync(DIST)) {
	console.error(`✗ Build output not found at ${DIST}. Run \`npm run build\` first.`);
	process.exit(1);
}

for (const url of urls) {
	const pathname = new URL(url).pathname;
	const file = urlToDistFile(pathname);
	if (!existsSync(file)) {
		errors.push(`llms.txt link 404s in build: ${url}  (expected ${relative(DIST, file)})`);
	}
}

// ── 2. Model ids in markdown ─────────────────────────────────────────
const { models } = JSON.parse(readFileSync(join(root, "scripts", "known-models.json"), "utf8"));
const known = new Set(models);
const modelPatterns = [
	/[["']?model["']?\s*[:=]\s*["']([^"'\s$<`]+)["']/g,
	/ANTHROPIC_DEFAULT_(?:OPUS|SONNET|HAIKU)_MODEL=([^\s\\`]+)/g,
];
// The "before" half of a migration diff names a competitor's model on purpose.
const externalModel = /^(gpt|claude|o[1-9]|text-|grok|gemini|mistral|llama)/i;

for (const file of walk(root, ".md")) {
	const lines = readFileSync(file, "utf8").split("\n");
	for (const [i, line] of lines.entries()) {
		if (line.trimStart().startsWith("-")) continue; // removed diff line
		for (const pattern of modelPatterns) {
			for (const match of line.matchAll(pattern)) {
				const id = match[1];
				if (id.startsWith("$") || id.startsWith("<") || /^(YOUR|MODEL|model)/i.test(id)) continue;
				if (externalModel.test(id)) continue;
				if (!known.has(id)) {
					errors.push(`${relative(root, file)}:${i + 1}: unknown model id "${id}" (not in known-models.json)`);
				}
			}
		}
	}
}

if (errors.length) {
	console.error(`✗ docs integrity check failed (${errors.length}):`);
	for (const e of errors) console.error(`  - ${e}`);
	process.exit(1);
}
console.log(`✓ docs integrity OK (${urls.length} llms.txt links, model ids valid)`);
