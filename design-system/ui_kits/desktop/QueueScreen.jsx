(()=>{
const { DownloadItem, Segmented, Button } = window.DownloadEverythingDesignSystem_620170;
function QueueScreen({items,onClear}){
  const [f,setF]=React.useState('Tout');
  const shown=items.filter(i=>f==='Tout'||(f==='En cours'?i.status!=='done':i.status==='done'));
  return <div style={{padding:'48px 48px 32px',height:'100%',overflow:'auto'}}>
    <PageHead eyebrow={'02 — '+items.filter(i=>i.status!=='done').length+' en cours'} title="File d'attente" right={<div style={{display:'flex',gap:12,alignItems:'center'}}><Segmented options={['Tout','En cours','Terminés']} value={f} onChange={setF}/><Button variant="outline" icon="trash-2" onClick={onClear}>Vider</Button></div>}/>
    <div style={{display:'flex',flexDirection:'column',gap:8}}>{shown.map((i,n)=><div key={i.id} style={{animation:'se7en-rise .5s var(--ease-out) both',animationDelay:(n*60)+'ms'}}><DownloadItem {...i}/></div>)}</div>
    {shown.length===0&&<div style={{padding:60,textAlign:'center',font:'var(--type-body)',color:'var(--text-tertiary)'}}>Rien ici pour l'instant.</div>}
  </div>;
}
window.QueueScreen=QueueScreen;
})();
