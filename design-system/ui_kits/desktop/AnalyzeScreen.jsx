(()=>{
const { Button, Badge, PixelImage, Segmented, Checkbox, GlassPanel, Icon, IconButton } = window.DownloadEverythingDesignSystem_620170;
const QUALITIES={Vidéo:[['2160p','4K · 60 fps','1.24 GB'],['1440p','QHD · 60 fps','680 MB'],['1080p','Full HD · 30 fps','212 MB'],['720p','HD · 30 fps','96 MB']],Audio:[['320k','MP3 · 320 kbps','9.8 MB'],['flac','FLAC · sans perte','41 MB']]};
const LOG=['Connexion à vimeo.com','Métadonnées reçues','1 vidéo · 04:12','6 formats disponibles','Qualité max : 2160p'];
function AnalyzeScreen({url,onBack,onDownload}){
  const [lines,setLines]=React.useState(0);const [ready,setReady]=React.useState(false);
  const [type,setType]=React.useState('Vidéo');const [q,setQ]=React.useState('2160p');const [up,setUp]=React.useState(false);const [subs,setSubs]=React.useState(true);
  React.useEffect(()=>{const ts=LOG.map((_,i)=>setTimeout(()=>setLines(i+1),250+i*320));ts.push(setTimeout(()=>setReady(true),2100));return()=>ts.forEach(clearTimeout)},[]);
  React.useEffect(()=>{setQ(QUALITIES[type][0][0])},[type]);
  const list=QUALITIES[type];const sel=list.find(x=>x[0]===q)||list[0];
  const lab={font:'var(--type-label)',letterSpacing:'var(--tracking-label)',textTransform:'uppercase',color:'var(--text-tertiary)'};
  return <div style={{display:'flex',height:'100%'}}>
    <div style={{flex:1,minWidth:0,padding:'32px 40px 32px 48px',display:'flex',flexDirection:'column',gap:22}}>
      <div style={{display:'flex',alignItems:'center',gap:14}}><IconButton icon="arrow-left" size={36} onClick={onBack} label="Retour"/><span style={{font:'var(--type-mono)',color:'var(--text-tertiary)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{url}</span></div>
      <PixelImage animateFrom={56} block={1} duration={1900} seed={21} radius="var(--radius-lg)" style={{border:'1px solid var(--border-default)'}}>
        {!ready&&<div style={{position:'absolute',left:0,right:0,height:90,background:'linear-gradient(180deg,rgba(242,43,43,0),rgba(242,43,43,.28))',borderBottom:'1px solid rgba(255,90,90,.9)',animation:'kscan 1.1s linear infinite'}}></div>}
        <Ticks inset={14}/>
        <div style={{position:'absolute',left:30,top:28,display:'flex',gap:6}}>{ready?<Badge tone="inverse">Prêt</Badge>:<Badge tone="solid"><span style={{width:6,height:6,background:'#fff',animation:'se7en-blink .7s steps(1) infinite'}}></span>Analyse</Badge>}</div>
        <div style={{position:'absolute',right:30,bottom:26,...lab,color:'var(--text-primary)'}}>{ready?'3840×2160 · 60 fps':'—'}</div>
      </PixelImage>
      <div style={{display:'flex',flexDirection:'column',gap:10,opacity:ready?1:.25,transition:'opacity var(--dur-slow)'}}>
        <span style={{display:'inline-flex',alignItems:'center',gap:6,...lab}}><Icon name="globe" size={12}/>vimeo.com · Studio Nord · 04:12</span>
        <h2 style={{margin:0,font:'var(--weight-bold) 34px/1 var(--font-display)',letterSpacing:'var(--tracking-heading)'}}>Coucher de soleil — Lisbonne</h2>
      </div>
    </div>
    <div style={{width:392,flexShrink:0,padding:'32px 32px 32px 0'}}>
      <GlassPanel tone="solid" padding={22} style={{height:'100%',display:'flex',flexDirection:'column',gap:16,position:'relative',overflow:'hidden'}}>
        {!ready?<div style={{display:'flex',flexDirection:'column',gap:12,font:'var(--type-mono)',fontSize:12}}>
          <span style={lab}>Journal</span>
          {LOG.slice(0,lines).map((l,i)=><div key={i} style={{display:'flex',justifyContent:'space-between',gap:12,animation:'se7en-rise .35s var(--ease-out) both'}}><span style={{color:'var(--text-secondary)'}}><span style={{color:'var(--accent)'}}>›</span> {l}</span><span style={{color:'var(--success)'}}>ok</span></div>)}
          <span style={{width:8,height:14,background:'var(--accent)',animation:'se7en-blink .8s steps(1) infinite'}}></span>
        </div>:<>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',animation:'se7en-rise .5s var(--ease-out) both'}}><span style={lab}>Format</span><Segmented size="sm" options={['Vidéo','Audio']} value={type} onChange={setType}/></div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {list.map(([k,d,s],i)=>{const on=k===q;return <button key={k} onClick={()=>setQ(k)} style={{display:'flex',alignItems:'center',gap:14,padding:'12px 14px',borderRadius:'var(--radius-sm)',border:'1px solid '+(on?'var(--accent)':'var(--border-subtle)'),background:on?'var(--accent-soft)':'transparent',boxShadow:on?'inset 3px 0 0 var(--accent)':'none',color:'var(--text-primary)',cursor:'pointer',textAlign:'left',animation:'se7en-rise .5s var(--ease-out) both',animationDelay:(60+i*50)+'ms',transition:'background var(--dur-fast),border-color var(--dur-fast)'}}>
              <span style={{flex:1,display:'flex',flexDirection:'column',gap:4}}><span style={{font:'var(--weight-bold) 17px/1 var(--font-display)'}}>{k}</span><span style={{font:'var(--type-body-sm)',color:'var(--text-tertiary)'}}>{d}</span></span>
              <Badge mono>{s}</Badge></button>})}
          </div>
          <div style={{height:1,background:'var(--border-subtle)'}}></div>
          <Checkbox checked={up} onChange={setUp} label={<span style={{display:'inline-flex',alignItems:'center',gap:8}}>Upscaler ensuite <Badge tone="accent">4×</Badge></span>}/>
          {type==='Vidéo'&&<Checkbox checked={subs} onChange={setSubs} label="Inclure les sous-titres"/>}
          <div style={{flex:1}}></div>
          <Button size="lg" icon="download" fullWidth onClick={()=>onDownload({title:'Coucher de soleil — Lisbonne',source:'vimeo.com',kind:type==='Audio'?'audio':'video',specs:[type==='Audio'?'MP3':'MP4',sel[0],sel[2]],upscale:up})}>Télécharger · {sel[2]}</Button>
        </>}
      </GlassPanel>
    </div>
  </div>;
}
window.AnalyzeScreen=AnalyzeScreen;
})();
