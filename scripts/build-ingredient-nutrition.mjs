#!/usr/bin/env node
/**
 * Build the ingredient nutrition reference for gochujang.net from the TrueAPI
 * portfolio ingredient dictionary (static USDA FoodData Central values,
 * resolved offline). Committed build-time artifact: no runtime API calls.
 *
 * Inputs:
 *   - src/data/catalog.json (dishes[].ingredients: free-text quantity-embedded
 *     strings such as "3 tbsp gochujang")
 *   - The portfolio dictionary via DICTIONARY_PATH (env) or argv[2], defaulting
 *     to the committed subset copy src/data/ingredient-dictionary.json.
 *
 * Outputs:
 *   - src/data/ingredient-nutrition.json: one entry per normalized ingredient
 *     name (quantity-stripped), with sourceLines, resolved flag, FDC
 *     provenance (fdcId, dataType, confidence), per-100 g nutrients, a
 *     dictionaryFetchedAt stamp, and coverage counts.
 *   - When reading a non-default dictionary path, the committed subset copy
 *     src/data/ingredient-dictionary.json is refreshed too.
 *
 * Refresh one-liner (after the portfolio bundle grows):
 *   DICTIONARY_PATH=<path-to-updated-bundle> node scripts/build-ingredient-nutrition.mjs
 *
 * The script fails loudly if any catalog ingredient line fails to normalize to
 * a dictionary key — unresolved entries are emitted with resolved:false and no
 * numbers, never invented values.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const catalogPath = resolve(repoRoot, 'src/data/catalog.json');
const subsetPath = resolve(repoRoot, 'src/data/ingredient-dictionary.json');
const outputPath = resolve(repoRoot, 'src/data/ingredient-nutrition.json');

const dictionaryPath = resolve(
  repoRoot,
  process.env.DICTIONARY_PATH ||
    process.argv[2] ||
    'src/data/ingredient-dictionary.json',
);

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

// Quantity-stripping normalizer: must stay in sync with the runtime copy in
// src/data/nutrition.ts (strip parentheticals, preparations, leading measures).
const QUANTITY = /^(?:\d+(?:\s+\d+\/\d+|\.\d+)?|\d+\/\d+)\s+/;
const UNITS = new Set([
  'block', 'blocks', 'can', 'cans', 'clove', 'cloves', 'cup', 'cups',
  'lb', 'lbs', 'oz', 'tbsp', 'tsp', 'thumb', 'thumbs', 'portion', 'portions',
  'slice', 'slices', 'large', 'small', 'bunch', 'bunches', 'head', 'heads',
]);

export function normalizeIngredientLine(line) {
  let s = String(line).trim();
  s = s.replace(/\s*\([^)]*\)\s*/g, ' ').trim();
  s = s.replace(/,.*$/, '').trim();
  let prev = null;
  while (prev !== s) {
    prev = s;
    const q = s.match(QUANTITY);
    if (q) s = s.slice(q[0].length);
    const first = s.split(' ')[0];
    if (UNITS.has(first.toLowerCase()) && s.split(' ').length > 1) {
      s = s.slice(first.length).trim();
    }
  }
  return s.replace(/\s+/g, ' ').trim();
}

const catalog = readJson(catalogPath);
const dictionary = readJson(dictionaryPath);
if (!dictionary || !dictionary.entries) {
  throw new Error(`Dictionary at ${dictionaryPath} has no entries object`);
}

const rawLines = [
  ...new Set(catalog.dishes.flatMap((dish) => dish.ingredients)),
].sort();

const dictByLower = new Map(
  Object.keys(dictionary.entries).map((key) => [key.toLowerCase(), key]),
);

const byName = new Map();
const unmatched = [];
const usedDictKeys = new Set();
for (const line of rawLines) {
  const name = normalizeIngredientLine(line);
  if (!name) continue;
  const dictKey = dictByLower.get(name.toLowerCase());
  if (!dictKey) {
    unmatched.push(`${line}  =>  [${name}]`);
    continue;
  }
  usedDictKeys.add(dictKey);
  const entry = dictionary.entries[dictKey];
  const current = byName.get(name);
  byName.set(name, {
    sourceLines: [...(current?.sourceLines ?? []), line].sort(),
    entry:
      current === undefined || betterEntry(entry, current.entry) === entry
        ? entry
        : current.entry,
  });
}

if (unmatched.length > 0) {
  throw new Error(
    `Ingredient lines that failed to normalize to a dictionary key:\n${unmatched.join('\n')}`,
  );
}

/** Prefer resolved matches, then higher confidence, then richer nutrients. */
function betterEntry(a, b) {
  if (Boolean(a.resolved) !== Boolean(b.resolved)) return a.resolved ? a : b;
  if ((a.confidence ?? 0) !== (b.confidence ?? 0)) {
    return (a.confidence ?? 0) > (b.confidence ?? 0) ? a : b;
  }
  const nutrients = Object.keys(a.per100g ?? {}).length - Object.keys(b.per100g ?? {}).length;
  if (nutrients !== 0) return nutrients > 0 ? a : b;
  return a;
}

const ingredients = {};
let resolvedCount = 0;
for (const name of [...byName.keys()].sort()) {
  const { sourceLines, entry } = byName.get(name);
  if (entry.resolved) resolvedCount += 1;
  ingredients[name] = {
    sourceLines,
    resolved: Boolean(entry.resolved),
    ...(entry.resolved
      ? {
          fdcId: entry.fdcId ?? null,
          fdcName: entry.name ?? null,
          dataType: entry.dataType ?? null,
          confidence: entry.confidence ?? null,
          per100g: entry.per100g ? { ...entry.per100g } : {},
        }
      : {}),
  };
}

const output = {
  version: 1,
  generatedBy: 'scripts/build-ingredient-nutrition.mjs',
  dictionarySource: dictionary.source ?? 'TrueAPI portfolio ingredient dictionary',
  dictionaryFetchedAt: dictionary.fetchedAt ?? null,
  fdcAttribution: {
    text: 'Nutrition data: USDA FoodData Central',
    url: 'https://fdc.nal.usda.gov',
  },
  note: 'Per-100 g reference values for raw ingredients from USDA FoodData Central via the TrueAPI portfolio ingredient dictionary, keyed on quantity-stripped ingredient names. Reference values for the raw ingredient, not a per-serving analysis of any dish. Entries with resolved:false are not yet verified against FoodData Central and carry no numbers by design.',
  counts: {
    ingredientNames: Object.keys(ingredients).length,
    sourceLines: rawLines.length,
    resolved: resolvedCount,
    unresolved: Object.keys(ingredients).length - resolvedCount,
  },
  ingredients,
};

writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');

if (dictionaryPath !== subsetPath) {
  const subsetEntries = {};
  for (const key of [...usedDictKeys].sort()) subsetEntries[key] = dictionary.entries[key];
  const subset = {
    bundle: dictionary.bundle ?? null,
    source: dictionary.source ?? 'TrueAPI portfolio ingredient dictionary',
    fetchedAt: dictionary.fetchedAt ?? null,
    note: `Subset of the TrueAPI portfolio ingredient dictionary filtered to the ${usedDictKeys.size} keys gochujang.net's catalog ingredient lines normalize to. Regenerated by scripts/build-ingredient-nutrition.mjs whenever DICTIONARY_PATH points at an updated full bundle.`,
    counts: { entries: Object.keys(subsetEntries).length },
    entries: subsetEntries,
  };
  writeFileSync(subsetPath, `${JSON.stringify(subset, null, 2)}\n`, 'utf8');
}

console.log(
  `Wrote ${outputPath}: ${output.counts.ingredientNames} ingredient names ` +
    `(${output.counts.sourceLines} source lines), ${output.counts.resolved} resolved, ` +
    `${output.counts.unresolved} unresolved` +
    (dictionaryPath !== subsetPath ? `; refreshed subset at ${subsetPath}` : ''),
);
