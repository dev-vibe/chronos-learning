const sharp=require('sharp'),fs=require('fs'),crypto=require('crypto');
(async()=>{
const dir=__dirname, input=dir+'/DP-36495-001.jpg';
const {data,info}=await sharp(input).resize({width:1200}).greyscale().raw().toBuffer({resolveWithObject:true});
const W=info.width;
function corr(lag,y0=325,y1=537){let n=0,a=0,b=0,aa=0,bb=0,ab=0;for(let y=y0;y<y1;y+=2)for(let x=395;x<1080-lag;x++){let v=data[y*W+x+1]-data[y*W+x-1],u=data[y*W+x+lag+1]-data[y*W+x+lag-1];n++;a+=v;b+=u;aa+=v*v;bb+=u*u;ab+=v*u}return (ab-a*b/n)/Math.sqrt((aa-a*a/n)*(bb-b*b/n));}
let all=[];for(let lag=200;lag<=560;lag++)all.push({lag,r:corr(lag)});let peaks=all.filter((p,i)=>i&&i<all.length-1&&p.r>all[i-1].r&&p.r>=all[i+1].r).sort((a,b)=>b.r-a.r);
console.log(peaks.slice(0,10));
const orig=await sharp(input).blur(3).greyscale().raw().toBuffer({resolveWithObject:true});
let scale=orig.info.width/1200;const band={left:1205,top:1015,width:2245,height:710};
function fullCorr(lag){let n=0,a=0,b=0,aa=0,bb=0,ab=0;for(let y=band.top;y<band.top+band.height;y+=3)for(let x=band.left;x<band.left+band.width-lag-1;x+=2){let v=orig.data[y*orig.info.width+x+1]-orig.data[y*orig.info.width+x-1],u=orig.data[y*orig.info.width+x+lag+1]-orig.data[y*orig.info.width+x+lag-1];n++;a+=v;b+=u;aa+=v*v;bb+=u*u;ab+=v*u}return (ab-a*b/n)/Math.sqrt((aa-a*a/n)*(bb-b*b/n));}
let refined=[];for(let lag=Math.round(peaks[0].lag*scale)-15;lag<=Math.round(peaks[0].lag*scale)+15;lag++)refined.push({lag,r:fullCorr(lag)});refined.sort((a,b)=>b.r-a.r);console.log(refined.slice(0,5));
const repeat=refined[0].lag; const x0=1859, crop={left:x0,top:1005,width:repeat,height:740};
await sharp(input).extract(crop).png().toFile(dir+'/one-repeat.png');
const cropBytes=await sharp(input).extract(crop).resize({width:600}).png().toBuffer();
const pair=await sharp(input).extract({left:x0-repeat,top:1005,width:2*repeat,height:740}).resize({width:1200}).png().toBuffer().catch(()=>null);
await sharp({create:{width:1200,height:1500,channels:3,background:'#ffffff'}}).composite([{input:await sharp(input).resize({width:1200}).png().toBuffer(),left:0,top:0},{input:cropBytes,left:0,top:900},{input:cropBytes,left:600,top:900}]).png().toFile(dir+'/comparison.png');
let hashes={};for(const f of fs.readdirSync(dir).filter(f=>/^DP-.*jpg$/.test(f))){let m=await sharp(dir+'/'+f).metadata();hashes[f]={width:m.width,height:m.height,bytes:fs.statSync(dir+'/'+f).size,sha256:crypto.createHash('sha256').update(fs.readFileSync(dir+'/'+f)).digest('hex')};}
const report={source:'https://collectionapi.metmuseum.org/public/collection/v1/objects/327605',primaryImage:'https://images.metmuseum.org/CRDImages/an/original/DP-36495-001.jpg',hashes,band,coarseDerivativeCorrelationPeaks:peaks.slice(0,10),refinedDerivativeCorrelation:refined.slice(0,10),repeatPixels:repeat,crop,stoneBoundsApprox:{left:333,right:823,top:1025,bottom:1785},stoneWidthPixels:490,piStoneWidth:Math.PI*490,ratioRepeatToPiStoneWidth:repeat/(Math.PI*490),method:'Sharp grayscale; normalized Pearson correlation of horizontal central differences over overlapping band pixels; preview lags 200..560 every pixel, y stride 2; original refinement uses Gaussian sigma 3 px before derivatives, +/-15 pixels, y stride 3, x stride 2. Crop is untouched source RGB pixels, no resize or retouch. Comparison only resizes.',caveats:['Bounds are manually read photographic design extents, not metrology.','Modern clay roll scale, cylindrical stone perspective and tapered circumference need not match apparent widths exactly.','A photograph repeat is estimated to integer pixels; the impression is not mathematically periodic and differs from an ideal texture.','Do not claim one ancient impression or Urkesh provenance.','Comparison has a white spacer between source photo and tiled crop; crop itself has no spacer.']};
const raw=await sharp(input).greyscale().raw().toBuffer(); let diffs=[], internal=[]; for(let y=crop.top;y<crop.top+crop.height;y++){diffs.push(Math.abs(raw[y*3801+crop.left]-raw[y*3801+crop.left+crop.width-1])); for(let x=crop.left;x<crop.left+crop.width-1;x+=5)internal.push(Math.abs(raw[y*3801+x]-raw[y*3801+x+1]));} report.seam={meanAbsoluteEdgeJump:diffs.reduce((a,b)=>a+b,0)/diffs.length,meanInternalAdjacentJump:internal.reduce((a,b)=>a+b,0)/internal.length,scale:'0..255 grayscale',judgement:'No features blended or repaired. Tile join can show a vertical lighting/edge discontinuity; final visual judgement remains with owner.'}; fs.writeFileSync(dir+'/measurements.json',JSON.stringify(report,null,2));fs.writeFileSync(dir+'/correlation.csv','lag,r\n'+all.map(p=>p.lag+','+p.r).join('\n'));
})();



