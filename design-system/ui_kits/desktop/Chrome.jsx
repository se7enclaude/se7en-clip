(()=>{
const { IconButton, Icon } = window.DownloadEverythingDesignSystem_620170;
function Wordmark({size=24,onClick}){return <span onClick={onClick} style={{font:'var(--weight-black) '+size+'px/1 var(--font-display)',letterSpacing:'-.05em',cursor:onClick?'pointer':'default',userSelect:'none'}}>se<span style={{color:'var(--accent)'}}>7</span>en</span>}
function TopBar({screen,onNav,queueCount,onLogo}){
  const tabs=[['home','01','Télécharger'],['queue','02','File'],['upscale','03','Upscale']];
  return <div style={{height:'var(--topbar-h)',flexShrink:0,display:'flex',alignItems:'center',gap:28,padding:'0 24px 0 28px',borderBottom:'1px solid var(--border-subtle)',position:'relative',zIndex:5,background:'rgba(5,5,5,.7)',backdropFilter:'var(--blur-glass)'}}>
    <Wordmark size={26} onClick={onLogo}/>
    <nav style={{display:'flex',gap:2,marginLeft:20,height:'100%'}}>{tabs.map(([k,n,l])=>{const on=screen===k||(k==='home'&&screen==='analyze');return <button key={k} onClick={()=>onNav(k)} style={{position:'relative',display:'flex',alignItems:'center',gap:9,padding:'0 16px',background:'transparent',border:0,cursor:'pointer',color:on?'var(--text-primary)':'var(--text-tertiary)',font:'var(--weight-medium) 13px/1 var(--font-sans)',transition:'color var(--dur-fast)'}}>
      <span style={{font:'var(--weight-medium) 10px/1 var(--font-mono)',color:on?'var(--accent)':'var(--text-disabled)'}}>{n}</span>{l}
      {k==='queue'&&queueCount>0&&<span style={{minWidth:18,height:18,padding:'0 5px',borderRadius:2,background:'var(--accent)',color:'#fff',font:'500 10px/18px var(--font-mono)',textAlign:'center'}}>{queueCount}</span>}
      <span style={{position:'absolute',left:16,right:16,bottom:-1,height:2,background:'var(--accent)',boxShadow:'var(--glow-accent)',transform:on?'scaleX(1)':'scaleX(0)',transformOrigin:'left',transition:'transform var(--dur-base) var(--ease-out)'}}></span></button>})}</nav>
    <div style={{flex:1}}></div>
    <span style={{display:'flex',alignItems:'center',gap:8,font:'var(--type-label)',letterSpacing:'var(--tracking-label)',textTransform:'uppercase',color:'var(--text-tertiary)'}}><span style={{width:6,height:6,background:'var(--success)',boxShadow:'0 0 10px var(--success)'}}></span>GPU prêt</span>
    <IconButton icon="settings" size={36} active={screen==='settings'} onClick={()=>onNav('settings')} label="Réglages"/>
  </div>;
}
function PageHead({eyebrow,title,right}){
  return <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:24,marginBottom:28,animation:'se7en-rise .6s var(--ease-out) both'}}>
    <div style={{display:'flex',flexDirection:'column',gap:14}}>
      {eyebrow&&<span style={{font:'var(--type-label)',letterSpacing:'var(--tracking-label)',textTransform:'uppercase',color:'var(--accent-text)'}}>{eyebrow}</span>}
      <h1 style={{margin:0,font:'var(--weight-black) 60px/.9 var(--font-display)',letterSpacing:'var(--tracking-display)'}}>{title}</h1>
    </div>{right}
  </div>;
}
function Ticks({inset=0,size=14,color='var(--border-strong)'}){
  const b='1px solid '+color;const s={position:'absolute',width:size,height:size,pointerEvents:'none'};
  return <><span style={{...s,left:inset,top:inset,borderLeft:b,borderTop:b}}></span><span style={{...s,right:inset,top:inset,borderRight:b,borderTop:b}}></span><span style={{...s,right:inset,bottom:inset,borderRight:b,borderBottom:b}}></span><span style={{...s,left:inset,bottom:inset,borderLeft:b,borderBottom:b}}></span></>;
}
function PixelField(){
  const cv=React.useRef(null);
  React.useEffect(()=>{const c=cv.current;const x=c.getContext('2d');const d=window.devicePixelRatio||1;let W=0,H=0;
    const rs=()=>{W=c.clientWidth;H=c.clientHeight;c.width=W*d;c.height=H*d};rs();const ro=new ResizeObserver(rs);ro.observe(c);
    let mx=-999,my=-999,tx=-999,ty=-999;const mv=e=>{const r=c.getBoundingClientRect();const k=r.width/W||1;tx=(e.clientX-r.left)/k;ty=(e.clientY-r.top)/k};
    window.addEventListener('mousemove',mv);let raf;const G=16;
    const tick=n=>{mx+=(tx-mx)*.1;my+=(ty-my)*.1;x.setTransform(d,0,0,d,0,0);x.clearRect(0,0,W,H);
      for(let yy=G/2;yy<H;yy+=G)for(let xx=G/2;xx<W;xx+=G){const k=Math.max(0,1-Math.hypot(xx-mx,yy-my)/230);const w=.5+.5*Math.sin(n/1100+xx*.011+yy*.017);
        const a=.035+w*.045+k*k*.8;const s=2+k*k*6;x.fillStyle=k>.55?'rgba(242,43,43,'+a+')':'rgba(244,243,241,'+a+')';x.fillRect(xx-s/2,yy-s/2,s,s)}
      raf=requestAnimationFrame(tick)};raf=requestAnimationFrame(tick);
    return()=>{cancelAnimationFrame(raf);ro.disconnect();window.removeEventListener('mousemove',mv)}},[]);
  return <canvas ref={cv} style={{position:'absolute',inset:0,width:'100%',height:'100%'}}></canvas>;
}
Object.assign(window,{Wordmark,TopBar,PageHead,Ticks,PixelField});
})();
