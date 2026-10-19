(()=>{
const W=1920,H=1080;
const STEPS=[56,40,28,18,12,7,4,2,1];
const RES=['144p','240p','360p','480p','720p','1080p','1440p','2160p','4K'];
const TAG='DOWNLOAD EVERYTHING — UPSCALE ANYTHING';
const RED=[242,43,43],FOG=[244,243,241];
const MOTION={enter:Easing.easeOutCubic,sweep:Easing.easeInOutSine,exit:Easing.easeInCubic};
const mix=(a,b,k)=>'rgb('+a.map((v,i)=>Math.round(v+(b[i]-v)*k)).join(',')+')';
function drawParts(x,fs,w,h,cSe,c7){
  x.font='800 '+fs+'px Syne';x.textBaseline='alphabetic';
  const parts=[['se',cSe],['7',c7],['en',cSe]];const tr=-fs*.05;
  const ws=parts.map(p=>x.measureText(p[0]).width);const tot=ws.reduce((a,b)=>a+b,0)+tr*2;
  let cx=(w-tot)/2;const by=h/2+fs*.34;parts.forEach((p,i)=>{x.fillStyle=p[1];x.fillText(p[0],cx,by);cx+=ws[i]+tr});
}
function stepImage(si){
  const b=STEPS[si];const k=si/(STEPS.length-1);const fs=Math.round(H*.3);
  const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  if(b===1){drawParts(x,fs,W,H,mix(RED,FOG,1),'rgb(242,43,43)');return c.toDataURL()}
  const lw=Math.ceil(W/b),lh=Math.ceil(H/b);const o=document.createElement('canvas');o.width=lw;o.height=lh;const ox=o.getContext('2d');
  drawParts(ox,fs/b,lw,lh,'#ffffff','#ff0000');const px=ox.getImageData(0,0,lw,lh).data;
  const g=b>=4?Math.max(1,Math.round(b*.14)):0;const se=mix(RED,FOG,Math.pow(k,1.4));
  for(let yy=0;yy<lh;yy++)for(let xx=0;xx<lw;xx++){const i=(yy*lw+xx)*4;if(px[i+3]<90)continue;x.fillStyle=(px[i+1]<130&&px[i]>150)?'rgb(242,43,43)':se;x.fillRect(xx*b,yy*b,b-g,b-g)}
  return c.toDataURL();
}
function useSteps(){
  const [imgs,setImgs]=React.useState(null);
  React.useEffect(()=>{let ok=true;Promise.race([document.fonts.load('800 200px Syne'),new Promise(r=>setTimeout(r,1500))]).then(()=>{if(ok)setImgs(STEPS.map((_,i)=>stepImage(i)))});return()=>{ok=false}},[]);
  return imgs;
}
const mono={fontFamily:'"Geist Mono",monospace',fontWeight:500,letterSpacing:'.14em',textTransform:'uppercase',color:'#7D7C79'};
function Corner({pos,rot}){return <span style={{position:'absolute',width:24,height:24,borderTop:'1.5px solid rgba(255,255,255,.26)',borderLeft:'1.5px solid rgba(255,255,255,.26)',transform:'rotate('+rot+'deg)',...pos}}></span>}
function Launch(){
  const {T,CUES,authoredTotal}=useComposition();const imgs=useSteps();
  const t=window.TWEAKS||{};
  const rs=CUES.Resolve,sw=CUES.Sweep,tg=CUES.Tagline,ex=CUES.Exit;
  const stepDur=(sw-rs)/STEPS.length;
  const si=T<rs?-1:Math.min(STEPS.length-1,Math.floor((T-rs)/stepDur));
  const cursorOn=T<rs&&T>0.15&&Math.floor((T-0.15)/0.15)%2===0;
  const xp=animate({from:0,to:1,start:ex,end:authoredTotal,ease:MOTION.exit})(T);
  const hud=animate({from:0,to:1,start:rs-0.2,end:rs+0.3,ease:MOTION.enter})(T)*(1-xp);
  const sweepX=animate({from:-20,to:120,start:sw,end:tg,ease:MOTION.sweep})(T);
  const sweepOn=T>=sw&&T<tg;
  const scanY=T>=rs&&T<sw?(((T-rs)/0.6)%1)*H:-999;
  const nChars=Math.floor(animate({from:0,to:TAG.length,start:tg+0.1,end:tg+1.1,ease:Easing.linear})(T));
  const typed=TAG.slice(0,nChars);
  const breath=animate({from:1,to:1.02,start:sw,end:ex,ease:MOTION.enter})(T);
  const sc=breath*(1+.08*xp);
  const prog=Math.min(1,T/ex);
  const crisp=imgs&&imgs[STEPS.length-1];
  return <div data-screen-label={'t='+Math.floor(T)+'s'} style={{position:'absolute',inset:0,background:'#050505',overflow:'hidden'}}>
    <div style={{position:'absolute',inset:0,transform:'scale('+sc+')',opacity:1-xp}}>
      {imgs&&si>=0&&<img src={imgs[si]} style={{position:'absolute',inset:0,width:W,height:H}}/>}
      {crisp&&sweepOn&&<div style={{position:'absolute',inset:0,WebkitMaskImage:'url('+crisp+')',maskImage:'url('+crisp+')',WebkitMaskSize:'100% 100%',maskSize:'100% 100%',background:'linear-gradient(100deg,transparent '+(sweepX-12)+'%,rgba(255,255,255,.95) '+sweepX+'%,transparent '+(sweepX+12)+'%)'}}></div>}
    </div>
    {cursorOn&&<div style={{position:'absolute',left:W/2-14,top:H/2-14,width:28,height:28,background:'#F22B2B',boxShadow:'0 0 40px rgba(242,43,43,.8)'}}></div>}
    {scanY>-999&&<><div style={{position:'absolute',left:0,right:0,top:scanY-90,height:90,background:'linear-gradient(180deg,rgba(242,43,43,0),rgba(242,43,43,.22))'}}></div><div style={{position:'absolute',left:0,right:0,top:scanY,height:2,background:'rgba(255,90,90,.9)'}}></div></>}
    <div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(0deg,rgba(255,255,255,.028) 0 1px,transparent 1px 3px)'}}></div>
    <div style={{position:'absolute',inset:0,background:'radial-gradient(80% 70% at 50% 50%,transparent 40%,rgba(0,0,0,.7))'}}></div>
    {t.showHud!==false&&<div style={{position:'absolute',inset:42,opacity:hud}}>
      <Corner pos={{left:0,top:0}} rot={0}/><Corner pos={{right:0,top:0}} rot={90}/><Corner pos={{right:0,bottom:0}} rot={180}/><Corner pos={{left:0,bottom:0}} rot={270}/>
      <div style={{position:'absolute',left:42,top:40,display:'flex',gap:28,fontSize:15,...mono}}><span style={{color:'#F4F3F1'}}>se7en</span><span>v1.0</span><span>init</span></div>
      <div style={{position:'absolute',right:42,top:40,display:'flex',alignItems:'center',gap:18,fontSize:15,...mono}}><span>Résolution</span><span style={{minWidth:80,textAlign:'right',fontSize:18,color:si===STEPS.length-1?'#F22B2B':'#F4F3F1'}}>{si>=0?RES[si]:''}</span></div>
      <div style={{position:'absolute',left:42,right:320,bottom:46,height:1.5,background:'rgba(255,255,255,.07)'}}><div style={{height:'100%',width:(prog*100)+'%',background:'#F4F3F1'}}></div></div>
      <div style={{position:'absolute',right:42,bottom:38,fontSize:15,...mono}}>Chargement</div>
    </div>}
    <div style={{position:'absolute',left:0,right:0,top:H*.74,textAlign:'center',whiteSpace:'nowrap',fontSize:18,...mono,letterSpacing:'.32em',color:'#B9B8B5',opacity:1-xp}}>{typed}<span style={{display:'inline-block',width:12,height:18,marginLeft:6,verticalAlign:-2,background:'#F22B2B',opacity:nChars>0&&nChars<TAG.length?1:0}}></span></div>
  </div>;
}
function Root(){
  const [t,setTweak]=useTweaks(window.TWEAK_DEFAULTS);window.TWEAKS=t;
  return <>
    <CompositionStage width={W} height={H} bg="#050505" scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}><Launch/></CompositionStage>
    <TweaksPanel>
      <TweakSection label="Animation"/>
      <TweakToggle label="Motion editor" value={t.motionEditor} onChange={v=>setTweak('motionEditor',v)}/>
      <TweakToggle label="HUD (coins, résolution)" value={t.showHud} onChange={v=>setTweak('showHud',v)}/>
    </TweaksPanel>
  </>;
}
ReactDOM.createRoot(document.getElementById('root')).render(<Root/>);
})();
