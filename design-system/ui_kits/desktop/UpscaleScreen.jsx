(()=>{
const { CompareSlider, Segmented, Select, Button, Dialog, ProgressBar, GlassPanel } = window.DownloadEverythingDesignSystem_620170;
const BLOCK={'2×':6,'4×':12,'8×':20};
function UpscaleScreen({onDone}){
  const [factor,setFactor]=React.useState('4×');const [model,setModel]=React.useState('photo');const [confirm,setConfirm]=React.useState(false);const [p,setP]=React.useState(null);
  const [src,setSrc]=React.useState(null);const [name,setName]=React.useState('lisbonne_still.png');const [dim,setDim]=React.useState([960,540]);const [over,setOver]=React.useState(false);const file=React.useRef(null);
  React.useEffect(()=>{if(p===null||p>=100)return;const t=setTimeout(()=>setP(x=>Math.min(100,x+2.5)),60);return()=>clearTimeout(t)},[p]);
  React.useEffect(()=>{if(p===100)onDone(name)},[p]);
  const load=f=>{if(!f||!f.type.startsWith('image/'))return;const u=URL.createObjectURL(f);const i=new Image();i.onload=()=>setDim([i.naturalWidth,i.naturalHeight]);i.src=u;setSrc(u);setName(f.name);setP(null)};
  const k=parseInt(factor);const bb=BLOCK[factor];const after=p===null||p>=100?1:Math.max(1,Math.round(bb*(1-p/100)));
  const lab={font:'var(--type-label)',letterSpacing:'var(--tracking-label)',textTransform:'uppercase',color:'var(--text-tertiary)'};
  return <div style={{padding:'48px 48px 32px',height:'100%',display:'flex',flexDirection:'column'}}>
    <PageHead eyebrow="03 — Amélioration IA" title="Upscale" right={<Segmented options={['2×','4×','8×']} value={factor} onChange={v=>{setFactor(v);setP(null)}}/>}/>
    <div style={{display:'flex',gap:20,flex:1,minHeight:0}}>
      <div onDragOver={e=>{e.preventDefault();setOver(true)}} onDragLeave={()=>setOver(false)} onDrop={e=>{e.preventDefault();setOver(false);load(e.dataTransfer.files[0])}} style={{flex:1,minWidth:0,position:'relative',alignSelf:'flex-start'}}>
        <CompareSlider src={src} seed={33} beforeBlock={bb} afterBlock={after} afterLabel={p!==null&&p<100?'Traitement '+Math.round(p)+'%':'Upscale '+factor}/>
        {over&&<div style={{position:'absolute',inset:0,borderRadius:'var(--radius-lg)',border:'1px dashed var(--accent)',background:'rgba(242,43,43,.12)',display:'flex',alignItems:'center',justifyContent:'center',...lab,color:'var(--text-primary)'}}>Déposer l'image</div>}
      </div>
      <GlassPanel tone="solid" padding={22} style={{width:300,flexShrink:0,display:'flex',flexDirection:'column',gap:16,alignSelf:'flex-start'}}>
        <div style={{display:'flex',flexDirection:'column',gap:6}}><span style={lab}>Fichier</span><span style={{font:'var(--weight-bold) 17px/1.2 var(--font-display)',wordBreak:'break-all'}}>{name}</span></div>
        <div style={{display:'grid',gridTemplateColumns:'auto 1fr',gap:'10px 14px',font:'var(--type-mono)',fontSize:12}}>
          <span style={{color:'var(--text-tertiary)'}}>Entrée</span><span>{dim[0]}×{dim[1]}</span>
          <span style={{color:'var(--text-tertiary)'}}>Sortie</span><span style={{color:'var(--accent-text)'}}>{dim[0]*k}×{dim[1]*k}</span>
        </div>
        <Select label="Modèle" icon="cpu" value={model} onChange={setModel} options={[{value:'photo',label:'Photo réaliste'},{value:'video',label:'Vidéo (images clés)'},{value:'art',label:'Illustration'}]} style={{width:'100%'}}/>
        {p!==null&&<ProgressBar value={p} tone={p===100?'success':'accent'} showValue/>}
        <Button size="lg" icon="sparkles" fullWidth disabled={p!==null&&p<100} onClick={()=>setConfirm(true)}>{p===100?'Relancer':'Lancer'}</Button>
        <Button variant="ghost" icon="image-up" fullWidth onClick={()=>file.current.click()}>Importer une image</Button>
        <input ref={file} type="file" accept="image/*" style={{display:'none'}} onChange={e=>load(e.target.files[0])}/>
      </GlassPanel>
    </div>
    <Dialog open={confirm} eyebrow={'Upscale '+factor} title="Lancer l'amélioration ?" onClose={()=>setConfirm(false)} footer={<><Button variant="ghost" onClick={()=>setConfirm(false)}>Annuler</Button><Button icon="sparkles" onClick={()=>{setConfirm(false);setP(0)}}>Lancer</Button></>}>
      Le fichier sera enregistré en {dim[0]*k}×{dim[1]*k} à côté de l'original.
    </Dialog>
  </div>;
}
window.UpscaleScreen=UpscaleScreen;
})();
