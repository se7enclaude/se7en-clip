import React from 'react';
export function ProgressBar({value=0,tone='accent',height=3,showValue,style}){
  const c=tone==='success'?'var(--success)':tone==='neutral'?'var(--text-primary)':'var(--accent)';const p=Math.max(0,Math.min(100,value));
  return <div style={{display:'flex',alignItems:'center',gap:12,...style}}>
    <div style={{flex:1,height,borderRadius:999,background:'var(--border-default)',overflow:'hidden'}}><div style={{width:p+'%',height:'100%',background:c,borderRadius:999,transition:'width var(--dur-slow) var(--ease-out)'}}></div></div>
    {showValue&&<span style={{font:'var(--weight-medium) 11px/1 var(--font-mono)',color:'var(--text-secondary)',minWidth:34,textAlign:'right'}}>{Math.round(p)}%</span>}
  </div>;
}
