import React from 'react';
export function StepIndex({current=1,total=3,style}){
  const pad=n=>String(n).padStart(2,'0');
  return <div style={{display:'flex',alignItems:'center',gap:14,font:'var(--weight-medium) 12px/1 var(--font-mono)',color:'var(--text-secondary)',...style}}>
    <span style={{color:'var(--text-primary)'}}>{pad(current)}</span>
    <span style={{position:'relative',width:140,height:1,background:'var(--border-default)'}}><span style={{position:'absolute',left:0,top:-0.5,height:2,width:(current/total*100)+'%',background:'var(--text-primary)',transition:'width var(--dur-slow) var(--ease-out)'}}></span></span>
    <span>{pad(total)}</span>
  </div>;
}
