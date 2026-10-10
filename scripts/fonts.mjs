import { mkdir, writeFile } from 'node:fs/promises';
const dir = new URL('../public/fonts/', import.meta.url);
await mkdir(dir,{recursive:true});
const fonts = [
  ['newsreader','Newsreader:opsz,wght@6..72,400;6..72,500'],
  ['newsreader-italic','Newsreader:ital,opsz,wght@1,6..72,400'],
  ['dm-sans','DM+Sans:wght@400;500;600;700']
];
for(const [name,query] of fonts){
  const response=await fetch(`https://fonts.googleapis.com/css2?family=${query}&display=swap`,{headers:{'User-Agent':'Mozilla/5.0 Chrome/130.0.0.0'}});
  if(!response.ok)throw new Error(`Font CSS: ${response.status}`);
  const css=await response.text();
  const section=css.split('/* latin */').at(-1);
  const url=section.match(/url\((https[^)]+)\)/)?.[1];
  if(!url)throw new Error(`No latin font found: ${name}`);
  const font=await fetch(url);if(!font.ok)throw new Error(`Font download ${font.status}`);
  await writeFile(new URL(`${name}.woff2`,dir),Buffer.from(await font.arrayBuffer()));
  console.log(`Saved ${name}`);
}
for(const name of ['newsreader','dmsans']){
  const response=await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${name}/OFL.txt`);
  if(!response.ok)throw new Error(`Font license ${response.status}`);
  await writeFile(new URL(`${name}-OFL.txt`,dir),await response.text());
}
