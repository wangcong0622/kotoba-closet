const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium,webkit}=require(process.env.KOTOBA_PLAYWRIGHT||'C:/Users/m1585/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),output=path.resolve(root,'outputs/round-one');
let release='v9',browser,server;
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.webmanifest':'application/manifest+json','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.mp3':'audio/mpeg'};
async function main(){
 fs.mkdirSync(output,{recursive:true});
 server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost'),prefix='/kotoba-closet/';
  if(!url.pathname.startsWith(prefix)){res.writeHead(404).end();return;}
  const relative=decodeURIComponent(url.pathname.slice(prefix.length))||'index.html',file=path.resolve(root,relative);
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  try{
   let data=fs.readFileSync(file);
  if(relative==='sw.js')data=Buffer.from(release==='legacy'?"const cache='kotoba-closet-v8';self.addEventListener('install',event=>event.waitUntil(caches.open(cache).then(c=>c.addAll(['./index.html'])).then(()=>self.skipWaiting())));self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));":data.toString().replaceAll('v9-',release+'-'));
   if(relative==='index.html')data=Buffer.from(data.toString().replace('<body>',`<body data-test-release="${release}">`));
   res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);
  }catch{res.writeHead(404).end();}
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const url=`http://127.0.0.1:${server.address().port}/kotoba-closet/`;
 let engine;try{browser=await webkit.launch({headless:true});engine='WebKit';}catch{browser=await chromium.launch({channel:'msedge',headless:true});engine='Edge mobile emulation';}
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2});
 const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
 const ready=async()=>{await page.waitForFunction(()=>document.body.dataset.appReady==='true');await page.waitForFunction(()=>{const save=JSON.parse(localStorage.getItem('kotoba-closet-v1')),canvas=document.querySelector('#outfitCanvas');return canvas.dataset.look===JSON.stringify(save.look)&&canvas.dataset.scene===save.scene;});};
 await page.goto(url);await ready();await page.waitForFunction(()=>document.body.dataset.offlineReady==='true',{timeout:60000});
 await page.locator('[data-view=study]').click();await page.locator('[data-study-level=advanced]').click();
 const cloze=page.locator('#wordCard').getByRole('button',{name:'填空自测',exact:true});await cloze.click();
 assert.equal(await page.locator('#wordCard').getByRole('button',{name:'显示答案',exact:true}).count(),1);
 assert(!await page.locator('#wordCard').innerText().then(text=>text.includes('だけでなく')));
 await page.locator('#slowSetting').check();assert.equal(await page.locator('#wordCard').getByRole('button',{name:'显示答案',exact:true}).count(),1);
 await page.locator('#wordCard').getByRole('button',{name:/换个句型/}).click();
 const sentence=await page.locator('#wordCard .sentence').innerText();
 await page.locator('#slowSetting').uncheck();assert.equal(await page.locator('#wordCard .sentence').innerText(),sentence);
 await page.evaluate(()=>speechSynthesis?.dispatchEvent(new Event('voiceschanged')));assert.equal(await page.locator('#wordCard .sentence').innerText(),sentence);
 await page.reload();await ready();assert(await page.locator('#learnPanel').isVisible());
 assert.equal(await page.locator('[data-study-level=advanced]').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('#wordCard .sentence').innerText(),sentence);
 await page.locator('[data-learning-tab=scene]').click();await page.locator('#sceneBrief').getByRole('button',{name:/换一句场景表达/}).click();
 const sceneLine=await page.locator('#sceneBrief .scene-line').innerText();
 await page.reload();await ready();assert(await page.locator('#learningScene').isVisible());assert.equal(await page.locator('#sceneBrief .scene-line').innerText(),sceneLine);
 await page.locator('[data-learning-tab=practice]').click();await page.locator('[data-practice-mode=listening]').click();await page.reload();await ready();
 assert.equal(await page.locator('[data-practice-mode=listening]').getAttribute('aria-pressed'),'true');
 const preserved=await page.evaluate(()=>localStorage.getItem('kotoba-closet-v1'));
 await page.evaluate(async()=>{await caches.open('another-app-cache');});release='v10';
 await page.evaluate(async()=>{const reg=await navigator.serviceWorker.getRegistration();await reg.update();});
 await page.waitForSelector('#appUpdateNotice');await page.reload();await ready();
 assert.equal(await page.locator('body').getAttribute('data-test-release'),'v9');
 await page.waitForSelector('#appUpdateNotice');await page.locator('#appUpdateNotice button').click();
 await page.waitForFunction(()=>document.body.dataset.testRelease==='v10'&&document.body.dataset.appReady==='true');await ready();
 assert.equal(await page.locator('[data-practice-mode=listening]').getAttribute('aria-pressed'),'true');
 assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('kotoba-closet-v1')).look),JSON.parse(preserved).look);
 const keys=await page.evaluate(()=>caches.keys());assert(keys.includes('another-app-cache'));assert(!keys.some(key=>key.startsWith('kotoba-closet-v9-')));
 await context.setOffline(true);await page.reload();await ready();
 await page.locator('[data-learning-tab=word]').click();assert.equal(await page.locator('#wordCard .sentence').innerText(),sentence);
 const range=await page.evaluate(async()=>{const key=(await caches.keys()).find(key=>key.startsWith('kotoba-closet-v10-')&&key.endsWith('-core')),core=await caches.open(key),requests=await core.keys(),audio=requests.find(request=>request.url.endsWith('.mp3'));const response=await fetch(audio.url,{headers:{Range:'bytes=0-31'}});return {status:response.status,length:(await response.arrayBuffer()).byteLength};});
 assert.deepEqual(range,{status:206,length:32});await context.setOffline(false);
 await page.locator('[data-view=wardrobe]').click();
 await page.waitForFunction(()=>Array.from(document.querySelectorAll('#itemGrid img')).filter(img=>{const rect=img.getBoundingClientRect();return rect.top<innerHeight&&rect.bottom>0;}).every(img=>img.complete&&img.naturalWidth>0&&!img.dataset.retrySrc));
 for(const [width,height] of [[375,667],[390,844],[430,932],[844,390]]){
  await page.setViewportSize({width,height});
  const bounds=await page.evaluate(()=>({width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight}));assert.deepEqual(bounds,{width,height});
  await page.screenshot({path:path.join(output,`${width}-wardrobe.png`)});
 }
 await page.setViewportSize({width:390,height:844});
 await page.locator('[data-item-id=top_polo]').click();await ready();
 await page.locator('#undoBtn').click();await ready();await page.locator('#redoBtn').click();await ready();
 for(let i=0;i<3;i++){await page.locator('#randomBtn').click();await ready();await page.locator('#saveLookBtn').click();}
 await page.locator('#albumBtn').click();await page.waitForFunction(()=>document.querySelector('#albumDialog canvas')?.getContext('2d').getImageData(0,0,1,1).data[3]>0);
 await page.getByRole('button',{name:'恢复穿搭',exact:true}).first().click();await ready();
 const pixels=await page.locator('#outfitCanvas').evaluate(canvas=>canvas.toDataURL());
 await page.locator('#exportBtn').click();await page.waitForSelector('#mobileExport[open] img');await page.waitForFunction(()=>{const img=document.querySelector('#mobileExport img');return img.complete&&img.naturalWidth===1024;});
 const exported=await page.locator('#mobileExport img').evaluate(async img=>{const blob=await fetch(img.src).then(response=>response.blob());return new Promise(resolve=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.readAsDataURL(blob);});});assert.equal(exported,pixels);
 await page.locator('#mobileExport .dialog-close').click();
 const cache=await page.evaluate(async()=>{const renderer=await import('./src/render-plan.js');return renderer.imageCacheStats();});assert(cache.entries<=cache.maxEntries);assert(cache.bytes<=cache.maxBytes);
 assert.deepEqual(errors,[]);
 const report={passed:true,engine,checks:['no cloze answer leak','settings and voice events preserve sentence','reload restores level, tabs, practice and scene position','release stays consistent until accepted','update preserves save and other app caches','offline restart under GitHub Pages subpath','offline audio Range playback','four phone layouts','equip, undo, redo and lazy album','export equals stage','bounded image cache'],cache,errors};
 fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 await context.close();
 release='legacy';const legacyContext=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),legacy=await legacyContext.newPage();
 await legacy.goto(url);await legacy.waitForFunction(()=>navigator.serviceWorker.controller&&document.body.dataset.appReady==='true');
 await legacy.locator('#saveLookBtn').click();const legacyLook=await legacy.evaluate(()=>JSON.parse(localStorage.getItem('kotoba-closet-v1')).look);
 release='v9';await legacy.evaluate(async()=>{const registration=await navigator.serviceWorker.getRegistration();await registration.update();});
 await legacy.waitForFunction(()=>document.body.dataset.testRelease==='v9'&&document.body.dataset.appReady==='true');
 assert.deepEqual(await legacy.evaluate(()=>JSON.parse(localStorage.getItem('kotoba-closet-v1')).look),legacyLook);
 assert.equal(await legacy.evaluate(()=>JSON.parse(localStorage.getItem('kotoba-closet-v1')).albums.length),1);
 assert(!(await legacy.evaluate(()=>caches.keys())).includes('kotoba-closet-v8'));
 report.checks.push('legacy v8 migration preserves outfit and album');fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2));console.log('Legacy v8 migration PASS');await legacyContext.close();
}
main().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{await browser?.close();await new Promise(resolve=>server?server.close(resolve):resolve());});
