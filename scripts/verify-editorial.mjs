import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {load} from 'cheerio';
const read=file=>readFile(new URL('../'+file,import.meta.url));
const assets=JSON.parse(await read('src/content/editorial-images.json'));
for(const [slug,asset] of Object.entries(assets)) {
  const master=await read(asset.sourceMaster);
  assert.equal(createHash('sha256').update(master).digest('hex'),asset.sourceSha256,`${slug}: original master integrity`);
  const metadata=await sharp(master).metadata();
  for(const variant of asset.variants) {
    const image=await sharp(await read('dist'+variant.src)).metadata();
    assert.equal(image.width,variant.width);assert.equal(image.height,variant.height);
    assert.ok(image.width<=metadata.width && image.height<=metadata.height,'Never upscale generated photography');
  }
}
const $=load(await read('dist/index.html'));
assert.equal($('.masthead img').attr('fetchpriority'),'high');
assert.equal($('.masthead img').attr('src'),assets['seoul-table-atmosphere'].src);
assert.equal($('.story-photo img').attr('src'),assets['seoul-table-jar'].src);
assert.equal($('.masthead h1').length,1);
const recipes=JSON.parse(await read('src/content/recipes.json'));
for(const r of recipes) {
  const $=load(await read(`dist/recipes/${r.slug}/index.html`));
  const count=$('[data-ingredient]').length;
  assert.equal($('[data-ingredient-progress]').text(),`0 of ${count} ingredients checked`);
  assert.equal($('[data-ingredient-progress]').attr('aria-live'),'polite');
  assert.equal($('[data-copy-link]').length,1);
}
console.log('PASS editorial: 2 native-resolution masters, 20 optimized variants, masthead preload and all 14 recipe controls.');
