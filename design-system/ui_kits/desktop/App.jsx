(()=>{
const { Toast } = window.DownloadEverythingDesignSystem_620170;
const SEED=[
 {id:1,title:'Interview complète — Épisode 12',source:'youtube.com',kind:'audio',specs:['MP3','320 kbps','9.8 MB'],status:'done',progress:100},
 {id:2,title:'portrait_studio_01',source:'instagram.com',kind:'photo',specs:['PNG','4×'],status:'upscaling',progress:58},
 {id:3,title:'Timelapse Alpes — source 8K',source:'vimeo.com',kind:'video',specs:['MP4','2160p','1.24 GB'],status:'downloading',progress:31,speed:'22.6 MB/s'},
 {id:4,title:'Galerie — Architecture brutaliste (24)',source:'pinterest.com',kind:'photo',specs:['JPG','24 fichiers'],status:'queued',progress:0},
];
function useFit(w,h){const [s,setS]=React.useState(1);React.useEffect(()=>{const f=()=>setS(Math.min(1,(window.innerWidth-32)/w,(window.innerHeight-32)/h));f();window.addEventListener('resize',f);return()=>window.removeEventListener('resize',f)},[]);return s}
function App(){
  const scale=useFit(1280,800);
  const [splash,setSplash]=React.useState(true);
  const [screen,setScreen]=React.useState(()=>localStorage.getItem('se7en-screen')||'home');
  const [url,setUrl]=React.useState('');const [items,setItems]=React.useState(SEED);const [toast,setToast]=React.useState(null);
  React.useEffect(()=>{localStorage.setItem('se7en-screen',screen==='analyze'?'home':screen)},[screen]);
  React.useEffect(()=>{const t=setInterval(()=>setItems(list=>list.map(i=>{
    if(i.status==='downloading'||i.status==='upscaling'){const p=Math.min(100,i.progress+Math.random()*3.5);if(p>=100){if(i.upscale&&i.status==='downloading')return {...i,status:'upscaling',progress:0,upscale:false,speed:undefined};return {...i,progress:100,status:'done',speed:undefined}}return {...i,progress:p}}
    return i;})),400);return()=>clearInterval(t)},[]);
  React.useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(null),3200);return()=>clearTimeout(t)},[toast]);
  const add=job=>{setItems(l=>[{id:Date.now(),status:'downloading',progress:0,speed:'18.2 MB/s',...job},...l]);setScreen('queue');setToast({tone:'neutral',title:'Ajouté à la file',message:job.title})};
  let body;
  if(screen==='home') body=<HomeScreen onAnalyze={u=>{setUrl(u);setScreen('analyze')}}/>;
  if(screen==='analyze') body=<AnalyzeScreen url={url} onBack={()=>setScreen('home')} onDownload={add}/>;
  if(screen==='queue') body=<QueueScreen items={items} onClear={()=>setItems(l=>l.filter(i=>i.status!=='done'))}/>;
  if(screen==='upscale') body=<UpscaleScreen onDone={n=>setToast({tone:'accent',title:'Upscale terminé',message:n})}/>;
  if(screen==='settings') body=<SettingsScreen/>;
  return <div style={{width:1280*scale,height:800*scale}}>
    <div style={{width:1280,height:800,transform:'scale('+scale+')',transformOrigin:'0 0',position:'relative',display:'flex',flexDirection:'column',borderRadius:12,overflow:'hidden',background:'var(--bg-app)',border:'1px solid var(--border-default)',boxShadow:'var(--shadow-3)'}}>
      <TopBar screen={screen} onNav={setScreen} onLogo={()=>setSplash(true)} queueCount={items.filter(i=>i.status!=='done').length}/>
      <main key={screen} style={{flex:1,position:'relative',minHeight:0,background:'radial-gradient(90% 70% at 85% 0%,#140B0B,var(--ink-0) 55%)'}}>
        {body}
        {toast&&<Toast {...toast} onClose={()=>setToast(null)} style={{position:'absolute',right:24,bottom:24,zIndex:40,animation:'se7en-rise .4s var(--ease-out) both'}}/>}
      </main>
      <div style={{position:'absolute',inset:0,background:'var(--scanlines)',pointerEvents:'none',zIndex:90}}></div>
      {splash&&<Splash onDone={()=>setSplash(false)}/>}
    </div>
  </div>;
}
window.App=App;
})();
