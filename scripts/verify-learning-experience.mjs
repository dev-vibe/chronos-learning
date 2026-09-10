import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
// Local-only interaction audit; seeded progress belongs to this disposable browser context.
const base = 'http://127.0.0.1:4318';
const output = 'tmp/learning-review';
await fs.mkdir(output, {recursive:true});
const server = spawn(process.execPath,[fileURLToPath(new URL('../../bin/vite.js',import.meta.resolve('vite'))),'--host','127.0.0.1','--port','4318','--strictPort'],{stdio:'ignore'});
let browser;
const errors=[];
const results=[];
try {
  for(let i=0;i<40;i++){try{if((await fetch(base)).ok)break;}catch{} await new Promise(r=>setTimeout(r,250));}
  browser=await chromium.launch({headless:true});
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const page=await context.newPage();page.setDefaultTimeout(12000);
  page.on('pageerror',error=>errors.push(error.message));
  const visit=async path=>{await page.goto(base+path);await page.locator('main h1').waitFor();console.log('Review',path);};
  const settle=async()=>{await page.evaluate(async()=>{await document.fonts.ready;await Promise.race([Promise.all([...document.images].filter(i=>{const r=i.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0;}).map(i=>i.decode().catch(()=>{}))),new Promise(r=>setTimeout(r,5000))]);});};
  const capture=async name=>{await settle();await page.screenshot({path:output+'/'+name+'.png'});};
  const reflow=async()=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Horizontal page overflow');
  await visit('/learn/lesson.humans.homo-sapiens-origins');
  await page.locator('.lesson-orientation').waitFor();
  await capture('origins-desktop-light');
  await page.locator('.lesson-orientation').screenshot({path:output+'/orientation-light.png'});
  const trigger=page.locator('.evidence-module .evidence-enlarge').first();
  await trigger.focus(); await page.keyboard.press('Enter');
  const viewer=page.locator('dialog.evidence-viewer[open]');
  assert(await viewer.count()===1);
  assert(await page.getByRole('button',{name:'Close enlarged image'}).evaluate(e=>e===document.activeElement));
  await page.keyboard.press('Shift+Tab');
  assert(await viewer.evaluate(e=>e.contains(document.activeElement)));
  await page.getByRole('button',{name:'Show more detail'}).click();
  assert(await viewer.locator('img.is-zoomed').count()===1);
  await capture('evidence-desktop');
  await page.keyboard.press('Escape');
  assert(await trigger.evaluate(e=>e===document.activeElement));
  results.push('Keyboard enlargement, detail zoom, modal focus containment and Escape focus return');
  const textarea=page.getByRole('textbox').first();
  await textarea.fill('A short draft');
  assert(await page.locator('.prompt .feedback').count()===0);
  await page.reload(); await page.locator('.lesson-orientation').waitFor();
  assert(await page.evaluate(()=>scrollY)===0,'Reopening must start at top');
  assert(await textarea.inputValue()==='A short draft');
  assert(await page.locator('.prompt .feedback').count()===0);
  for(const check of await page.locator('.prompt').all()){
    if(await check.locator('textarea').count()) await check.locator('textarea').fill('Fossils and objects provide evidence, but one find cannot tell us every part of the story. We compare finds and keep uncertainty visible.');
    else await check.getByRole('radio').last().check();
    await check.getByRole('button',{name:'Compare your thinking'}).click();
    await check.locator('.feedback').waitFor();
  }
  await page.getByRole('button',{name:'Complete lesson',exact:true}).click();
  await page.getByRole('heading',{name:'Lesson explored'}).waitFor();
  assert(await page.locator('.card-reveal').count()>0);
  await page.locator('.completion-panel').screenshot({path:output+'/completion.png'});
  await page.reload();await page.locator('.lesson-orientation').waitFor();
  assert(await page.evaluate(()=>scrollY)===0);
  assert(await page.getByText('In your Knowledge Cards',{exact:true}).count()>0);
  results.push('Draft reload, explicit comparison, sincere completion with a non-target choice, retained progress/cards, revisit at top');
  const catalogue=await page.evaluate(async()=>{const {chronosContent:c}=await import('/content/chronos.ts');return c.lessons.filter(l=>l.status==='published').map(l=>({id:l.id,prompts:l.promptIds}));});
  await page.evaluate(items=>{for(const item of items)localStorage.setItem('chronos.learn.preview.v1:'+item.id,JSON.stringify({learnerId:'anonymous-preview',lessonId:item.id,status:'completed',attemptedPromptIds:item.prompts,exploredSectionIds:[],responses:{},version:1,completedAt:'2026-09-10T00:00:00Z'}));},catalogue);
  for(const size of [{width:1440,height:1000},{width:390,height:844}]){
    await page.setViewportSize(size);
    for(const theme of ['light','dark']){
      await page.evaluate(t=>localStorage.setItem('chronos.theme.v1',t),theme);
      for(const [name,path] of [['home','/home'],['library','/library'],['origins','/learn/lesson.humans.homo-sapiens-origins'],['uruk','/learn/lesson.uruk.first-city'],['companion','/educators/lesson.humans.homo-sapiens-origins']]){
        await visit(path);await reflow();await capture(name+'-'+size.width+'-'+theme);
        if(name==='origins'||name==='uruk'){
          await page.getByRole('button',{name:'Largest',exact:true}).click();
          await reflow();
          await page.locator('.lesson-orientation').screenshot({path:output+'/'+name+'-orientation-'+size.width+'-'+theme+'.png'});
          await page.getByRole('button',{name:'Standard',exact:true}).click();
        }
      }
    }
  }
  await page.setViewportSize({width:320,height:700});
  await visit('/learn/lesson.humans.homo-sapiens-origins');
  await page.getByRole('button',{name:'Largest',exact:true}).click();
  await reflow();await capture('origins-320-largest');
  await page.locator('.lesson-orientation .evidence-enlarge').click();
  await page.getByRole('button',{name:'Show more detail'}).click();await capture('evidence-mobile');
  await page.keyboard.press('Escape');
  results.push('Home/Library/Human Origins/Uruk/companion at 1440 and 390, light/dark; largest text and 320px reflow');
  for(const item of catalogue){await visit('/learn/'+item.id);await page.locator('.lesson-orientation').waitFor();await reflow();}
  assert(catalogue.length===10);results.push('All ten published lessons render with stable identities');
  await visit('/educators/lesson.humans.homo-sapiens-origins');
  await page.emulateMedia({media:'print'});
  assert(await page.locator('.global-rail').isHidden());
  await page.pdf({path:output+'/human-origins-companion.pdf',format:'A4',printBackground:true});
  results.push('Public companion print rendering with navigation omitted');
  assert.deepEqual(errors,[],'Browser page errors');
  await fs.writeFile(output+'/results.json',JSON.stringify({results,errors,scope:'Local disposable preview data; no participant observations'},null,2));
  console.log(results.join('\n'));
} finally {await browser?.close();server.kill();}
