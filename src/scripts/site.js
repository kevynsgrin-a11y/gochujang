const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
let toastTimer;
function toast(message) { const element = $('.toast'); element.textContent = message; element.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => element.classList.remove('visible'), 3200); }
function read(key, fallback) { try { const value=JSON.parse(localStorage.getItem(key)); return value ?? fallback; } catch { return fallback; } }
function write(key, value) { try {localStorage.setItem(key,JSON.stringify(value));return true;} catch {toast('Your browser could not save this. You can still use the recipe.');return false;} }
const savedKey='gochujang-saved-v1';
function savedRecipes() {const value=read(savedKey,[]);return Array.isArray(value)?value:[];}
function updateSaveButtons() {const saved=savedRecipes(); $$('[data-save]').forEach(button=>{const active=saved.includes(button.dataset.save);button.setAttribute('aria-pressed',String(active));$('[data-save-label]',button).textContent=active?'Recipe saved':'Save recipe';});$$('[data-saved-count]').forEach(el=>el.textContent=saved.length);}
$$('[data-save]').forEach(button=>button.addEventListener('click',()=>{const saved=savedRecipes();const slug=button.dataset.save;const active=saved.includes(slug);if(write(savedKey,active?saved.filter(s=>s!==slug):[...saved,slug])){updateSaveButtons();toast(active?'Recipe removed from your saved collection.':'Recipe saved in this browser.');}}));
updateSaveButtons();
const search=$('#search-dialog');
$$('.search-open').forEach(button=>button.addEventListener('click',()=>{search.showModal();$('#global-search').focus();}));
$('.search-close').addEventListener('click',()=>search.close());
search.addEventListener('click',event=>{if(event.target===search){const r=search.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)search.close();}});
const menu=$('.menu-toggle'), mobile=$('#mobile-menu');
menu.addEventListener('click',()=>{const opening=mobile.hidden;mobile.hidden=!opening;menu.setAttribute('aria-expanded',String(opening));menu.setAttribute('aria-label',opening?'Close menu':'Open menu');});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!mobile.hidden){mobile.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open menu');menu.focus();}});
$$('[data-print]').forEach(button=>button.addEventListener('click',()=>window.print()));
const collection=$('[data-collection]');
if(collection){
  const params=new URLSearchParams(location.search), query=$('#collection-query'), tiles=$$('[data-recipe]',collection);
  let filter=params.get('saved')==='1'?'saved':params.get('lane')||'all';
  if(!['all','traditional','modern','fusion','saved'].includes(filter))filter='all';
  query.value=params.get('q')||'';
  function apply(updateURL=true){const value=query.value.trim().toLowerCase();const words=value.split(/\s+/).filter(Boolean);const saved=savedRecipes();let count=0;
    for(const tile of tiles){const visible=(filter==='all'||(filter==='saved'?saved.includes(tile.dataset.slug):tile.dataset.lane===filter))&&words.every(w=>tile.dataset.search.includes(w));tile.hidden=!visible;if(visible)count++;}
    $$('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===filter)));
    $('[data-result-count]').textContent=`${count} ${count===1?'recipe':'recipes'}${filter==='saved'?' saved in this browser':' to explore'}`;
    $('.no-results').hidden=count>0;$('[data-clear]').hidden=filter==='all'&&!value;
    if(updateURL){const next=new URLSearchParams();if(filter==='saved')next.set('saved','1');else if(filter!=='all')next.set('lane',filter);if(query.value.trim())next.set('q',query.value.trim());history.replaceState(null,'',`${location.pathname}${next.size?'?'+next:''}`);}
  }
  $$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;apply();}));query.addEventListener('input',()=>apply());
  $$('[data-clear],[data-reset]').forEach(button=>button.addEventListener('click',()=>{filter='all';query.value='';apply();query.focus();}));
  addEventListener('storage',()=>{updateSaveButtons();apply(false);});apply(false);
}
const recipe=$('[data-recipe-slug]');
if(recipe){const key=`gochujang-checklist-${recipe.dataset.recipeSlug}`;const checks=$$('[data-ingredient]');let checked=read(key,[]);if(!Array.isArray(checked))checked=[];checks.forEach(input=>{input.checked=checked.includes(input.dataset.ingredient);input.addEventListener('change',()=>write(key,checks.filter(i=>i.checked).map(i=>i.dataset.ingredient)));});$('[data-reset-ingredients]').addEventListener('click',()=>{checks.forEach(i=>i.checked=false);write(key,[]);toast('Ingredient checklist reset.');});const cook=$('[data-cook-mode]');cook.addEventListener('click',()=>{const active=recipe.classList.toggle('larger-recipe');cook.setAttribute('aria-pressed',String(active));cook.textContent=active?'Standard text −':'Larger text ＋';});}
addEventListener('beforeprint',()=>{$$('details').forEach(d=>{d.dataset.wasOpen=String(d.open);d.open=true;});});
addEventListener('afterprint',()=>{$$('details').forEach(d=>{d.open=d.dataset.wasOpen==='true';delete d.dataset.wasOpen;});});
