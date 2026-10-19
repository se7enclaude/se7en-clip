(()=>{
const { Switch, Select, Button, GlassPanel } = window.DownloadEverythingDesignSystem_620170;
function SettingsScreen(){
  const [s,setS]=React.useState({auto:false,notif:true,meta:true,gpu:true});const [dir,setDir]=React.useState('dl');const [q,setQ]=React.useState('best');
  const tog=k=>v=>setS({...s,[k]:v});
  const Row=({children})=><div style={{padding:'18px 0',borderBottom:'1px solid var(--border-subtle)'}}>{children}</div>;
  return <div style={{padding:'48px 48px 32px',height:'100%',overflow:'auto'}}>
    <PageHead eyebrow="04 — Préférences" title="Réglages"/>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,maxWidth:980}}>
      <GlassPanel tone="solid" padding="6px 22px">
        <Row><Select label="Dossier de destination" icon="folder" value={dir} onChange={setDir} options={[{value:'dl',label:'~/Téléchargements'},{value:'mov',label:'~/Vidéos'},{value:'ask',label:'Demander à chaque fois'}]} style={{width:'100%'}}/></Row>
        <Row><Select label="Qualité par défaut" icon="gauge" value={q} onChange={setQ} options={[{value:'best',label:'Meilleure disponible'},{value:'1080',label:'1080p'},{value:'720',label:'720p'}]} style={{width:'100%'}}/></Row>
        <Row><Switch checked={s.meta} onChange={tog('meta')} label="Conserver les métadonnées" description="Titre, auteur, date de publication"/></Row>
        <div style={{padding:'18px 0'}}><Switch checked={s.notif} onChange={tog('notif')} label="Notifications" description="À la fin de chaque tâche"/></div>
      </GlassPanel>
      <GlassPanel tone="solid" padding="6px 22px">
        <Row><Switch checked={s.auto} onChange={tog('auto')} label="Upscale automatique" description="Améliorer chaque fichier après téléchargement"/></Row>
        <Row><Switch checked={s.gpu} onChange={tog('gpu')} label="Accélération GPU" description="Plus rapide, consomme plus d'énergie"/></Row>
        <div style={{padding:'18px 0',display:'flex',gap:10}}><Button variant="secondary" icon="rotate-ccw">Réinitialiser</Button><Button variant="ghost" icon="external-link">Journal</Button></div>
      </GlassPanel>
    </div>
  </div>;
}
window.SettingsScreen=SettingsScreen;

})();
