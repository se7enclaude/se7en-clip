(()=>{
const { UrlInput, Button } = window.DownloadEverythingDesignSystem_620170;
const SOURCES=['youtube.com','vimeo.com','instagram.com','tiktok.com','x.com','pinterest.com','reddit.com','soundcloud.com','dailymotion.com','twitch.tv','flickr.com','behance.net'];
function Kbd({children}){return <span style={{display:'inline-flex',alignItems:'center',justifyContent:'center',minWidth:22,height:22,padding:'0 6px',borderRadius:3,border:'1px solid var(--border-default)',background:'var(--surface-2)',font:'var(--weight-medium) 11px/1 var(--font-mono)',color:'var(--text-secondary)'}}>{children}</span>}
function HomeScreen({onAnalyze}){
  const [url,setUrl]=React.useState('');
  const go=()=>onAnalyze(url||'https://vimeo.com/824117301');
  const rise=i=>({animation:'se7en-rise .8s var(--ease-out) both',animationDelay:(i*90)+'ms'});
  return <div style={{position:'relative',height:'100%',overflow:'hidden'}}>
    <PixelField/>
    <div style={{position:'absolute',inset:0,background:'radial-gradient(70% 80% at 30% 45%,rgba(5,5,5,.92) 20%,rgba(5,5,5,.2) 80%)',pointerEvents:'none'}}></div>
    <div style={{position:'relative',height:'100%',display:'flex',flexDirection:'column',padding:'72px 64px 0'}}>
      <span style={{...rise(0),font:'var(--type-label)',letterSpacing:'var(--tracking-label)',textTransform:'uppercase',color:'var(--accent-text)'}}>01 — Coller un lien</span>
      <h1 style={{...rise(1),margin:'22px 0 0',font:'var(--weight-black) 108px/.9 var(--font-display)',letterSpacing:'var(--tracking-display)'}}>Un lien.<br/><span style={{color:'var(--text-disabled)'}}>Tout le reste.</span></h1>
      <p style={{...rise(2),margin:'28px 0 0',maxWidth:460,font:'var(--type-body)',color:'var(--text-secondary)'}}>Vidéos, photos, audio, galeries entières. Choisissez la qualité, puis montez-la jusqu'en 4K.</p>
      <div style={{...rise(3),marginTop:32,maxWidth:780}}><UrlInput size="lg" value={url} onChange={setUrl} onKeyDown={e=>e.key==='Enter'&&go()} placeholder="https://" action={<Button size="lg" icon="scan-line" onClick={go}>Analyser</Button>}/></div>
      <div style={{...rise(4),display:'flex',alignItems:'center',gap:18,marginTop:16,font:'var(--type-body-sm)',color:'var(--text-tertiary)'}}>
        <span style={{display:'flex',alignItems:'center',gap:6}}><Kbd>⌘</Kbd><Kbd>V</Kbd> coller</span><span style={{display:'flex',alignItems:'center',gap:6}}><Kbd>↵</Kbd> analyser</span>
      </div>
      <div style={{flex:1}}></div>
      <div style={{margin:'0 -64px',height:52,borderTop:'1px solid var(--border-subtle)',overflow:'hidden',display:'flex',alignItems:'center',maskImage:'linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)',WebkitMaskImage:'linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)'}}>
        <div style={{display:'flex',gap:44,whiteSpace:'nowrap',animation:'se7en-marquee 40s linear infinite',font:'var(--type-label)',letterSpacing:'var(--tracking-label)',textTransform:'uppercase',color:'var(--text-tertiary)'}}>
          {[...SOURCES,...SOURCES].map((s,i)=><span key={i} style={{display:'flex',alignItems:'center',gap:44}}>{s}<span style={{width:4,height:4,background:i%3===0?'var(--accent)':'var(--text-disabled)'}}></span></span>)}
        </div>
      </div>
    </div>
  </div>;
}
window.HomeScreen=HomeScreen;
})();
