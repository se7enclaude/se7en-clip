(()=>{
const STEPS=[56,40,28,18,12,7,4,2,1];
const RES=['144p','240p','360p','480p','720p','1080p','1440p','2160p','4K'];
const T0=520,STEP=190,CRISP=T0+STEPS.length*STEP,EXIT=3700,END=4500;
const TAG='DOWNLOAD EVERYTHING — UPSCALE ANYTHING';
const RED=[242,43,43],FOG=[244,243,241];
const mix=(a,b,k)=>'rgb('+a.map((v,i)=>Math.round(v+(b[i]-v)*k)).join(',')+')';
function drawParts(x,fs,w,h,cSe,c7){
  x.font='800 '+fs+'px Syne';x.textBaseline='alphabetic';
  const parts=[['se',cSe],['7',c7],['en',cSe]];const tr=-fs*.05;
  const ws=parts.map(p=>x.measureText(p[0]).width);const tot=ws.reduce((a,b)=>a+b,0)+tr*2;
  let cx=(w-tot)/2;const by=h/2+fs*.34;
  parts.forEach((p,i)=>{x.fillStyle=p[1];x.fillText(p[0],cx,by);cx+=ws[i]+tr});
}
function renderWord(si,W,H,d){
  const b=STEPS[si];const k=si/(STEPS.length-1);const fs=Math.round(H*.3);
  const c=document.createElement('canvas');c.width=W*d;c.height=H*d;const x=c.getContext('2d');
  if(b===1){x.scale(d,d);drawParts(x,fs,W,H,mix(RED,FOG,1),'rgb(242,43,43)');return c}
  const lw=Math.ceil(W/b),lh=Math.ceil(H/b);const o=document.createElement('canvas');o.width=lw;o.height=lh;const ox=o.getContext('2d');
  drawParts(ox,fs/b,lw,lh,'#ffffff','#ff0000');const px=ox.getImageData(0,0,lw,lh).data;
  const g=b>=4?Math.max(1,Math.round(b*.14)):0;const se=mix(RED,FOG,Math.pow(k,1.4));
  for(let yy=0;yy<lh;yy++)for(let xx=0;xx<lw;xx++){const i=(yy*lw+xx)*4;if(px[i+3]<90)continue;
    x.fillStyle=(px[i+1]<130&&px[i]>150)?'rgb(242,43,43)':se;x.fillRect(xx*b*d,yy*b*d,(b-g)*d,(b-g)*d)}
  return c;
}
function Splash({onDone,loop}){
  const wrapRef=React.useRef(null);const cv=React.useRef(null);const [t,setT]=React.useState(0);
  const done=React.useRef(false);const finish=()=>{if(done.current||loop)return;done.current=true;onDone&&onDone()};
  React.useEffect(()=>{let raf,st,alive=true;const cache={};
    const draw=e=>{const c=cv.current;if(!c)return;const W=wrapRef.current.clientWidth,H=wrapRef.current.clientHeight,d=window.devicePixelRatio||1;
      if(c.width!==W*d||c.height!==H*d){c.width=W*d;c.height=H*d;for(const k in cache)delete cache[k]}
      const x=c.getContext('2d');x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,c.width,c.height);
      if(e<T0){if(Math.floor(e/150)%2===0){x.fillStyle='rgb(242,43,43)';x.shadowColor='rgba(242,43,43,.8)';x.shadowBlur=30*d;x.fillRect((W/2-9)*d,(H/2-9)*d,18*d,18*d);x.shadowBlur=0}return}
      const si=Math.min(STEPS.length-1,Math.floor((e-T0)/STEP));const img=cache[si]||(cache[si]=renderWord(si,W,H,d));
      const xp=e>EXIT?Math.min(1,(e-EXIT)/(END-EXIT)):0;const sc=1+.07*xp*xp;
      x.globalAlpha=1-xp;x.setTransform(sc,0,0,sc,c.width*(1-sc)/2,c.height*(1-sc)/2);x.drawImage(img,0,0);
      if(e>=CRISP&&e<CRISP+900){const p=(e-CRISP)/900;const bx=(-.2+p*1.4)*W*d;const gr=x.createLinearGradient(bx-120*d,0,bx+120*d,0);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(.5,'rgba(255,255,255,.95)');gr.addColorStop(1,'rgba(255,255,255,0)');x.globalCompositeOperation='source-atop';x.fillStyle=gr;x.fillRect(0,0,c.width,c.height);x.globalCompositeOperation='source-over'}
      x.setTransform(1,0,0,1,0,0);x.globalAlpha=1;
      if(e<CRISP){const y=(((e-T0)/(STEP*3))%1)*H*d;const gr=x.createLinearGradient(0,y-60*d,0,y);gr.addColorStop(0,'rgba(242,43,43,0)');gr.addColorStop(1,'rgba(242,43,43,.22)');x.fillStyle=gr;x.fillRect(0,y-60*d,c.width,60*d);x.fillStyle='rgba(255,90,90,.9)';x.fillRect(0,y,c.width,1.5*d)}
    };
    Promise.race([document.fonts.load('800 200px Syne'),new Promise(r=>setTimeout(r,900))]).then(()=>{if(!alive)return;window.__splashAt=e=>{alive=false;setT(e);draw(e)};st=performance.now();
      const tick=n=>{if(!alive)return;let e=n-st;if(e>=END){if(loop){st=n;e=0}else{finish();return}}setT(e);draw(e);raf=requestAnimationFrame(tick)};raf=requestAnimationFrame(tick);window.__splashTick=()=>tick(performance.now())});
    return()=>{alive=false;cancelAnimationFrame(raf)}},[]);
  const si=t<T0?-1:Math.min(STEPS.length-1,Math.floor((t-T0)/STEP));
  const xp=t>EXIT?Math.min(1,(t-EXIT)/(END-EXIT)):0;const hud=t>T0?1-xp:0;
  const typed=t>CRISP+120?TAG.slice(0,Math.floor((t-CRISP-120)/26)):'';
  const mono={font:'var(--weight-medium) 10px/1 var(--font-mono)',letterSpacing:'var(--tracking-label)',textTransform:'uppercase',color:'var(--text-tertiary)'};
  const corner=(pos,rot)=><span style={{position:'absolute',width:16,height:16,borderTop:'1px solid var(--border-strong)',borderLeft:'1px solid var(--border-strong)',transform:'rotate('+rot+'deg)',...pos}}></span>;
  return <div ref={wrapRef} onClick={finish} style={{position:'absolute',inset:0,zIndex:100,background:'var(--ink-0)',cursor:loop?'default':'pointer',overflow:'hidden',opacity:loop?1:1-Math.max(0,(t-END+260)/260)}}>
    <canvas ref={cv} style={{position:'absolute',inset:0,width:'100%',height:'100%'}}></canvas>
    <div style={{position:'absolute',inset:0,background:'var(--scanlines)',pointerEvents:'none'}}></div>
    <div style={{position:'absolute',inset:0,background:'radial-gradient(80% 70% at 50% 50%,transparent 40%,rgba(0,0,0,.7))',pointerEvents:'none'}}></div>
    <div style={{position:'absolute',inset:28,opacity:hud,transition:'opacity .3s',pointerEvents:'none'}}>
      {corner({left:0,top:0},0)}{corner({right:0,top:0},90)}{corner({right:0,bottom:0},180)}{corner({left:0,bottom:0},270)}
      <div style={{position:'absolute',left:28,top:26,display:'flex',gap:18,...mono}}><span style={{color:'var(--text-primary)'}}>se7en</span><span>v1.0</span><span>init</span></div>
      <div style={{position:'absolute',right:28,top:26,display:'flex',alignItems:'center',gap:12,...mono}}><span>Résolution</span><span style={{minWidth:52,textAlign:'right',color:si===STEPS.length-1?'var(--accent)':'var(--text-primary)',fontSize:12}}>{si>=0?RES[si]:''}</span></div>
      <div style={{position:'absolute',left:'50%',top:'calc(50% + 24%)',transform:'translateX(-50%)',whiteSpace:'nowrap',...mono,fontSize:12,letterSpacing:'.32em',color:'var(--text-secondary)'}}>{typed}<span style={{display:'inline-block',width:8,height:12,marginLeft:4,verticalAlign:-1,background:'var(--accent)',animation:'se7en-blink .9s steps(1) infinite',opacity:typed&&typed.length<TAG.length?1:0}}></span></div>
      <div style={{position:'absolute',left:28,right:220,bottom:30,height:1,background:'var(--border-subtle)'}}><div style={{height:1,width:Math.min(100,t/EXIT*100)+'%',background:'var(--text-primary)'}}></div></div>
      {!loop&&<div style={{position:'absolute',right:28,bottom:26,...mono}}>Cliquer pour passer</div>}
    </div>
  </div>;
}
window.Splash=Splash;
})();
