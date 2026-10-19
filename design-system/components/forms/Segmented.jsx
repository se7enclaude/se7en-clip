import React from 'react';
export function Segmented({options=[],value,onChange,size='md',style}){
  const h=size==='sm'?30:38;
  return <div style={{display:'inline-flex',padding:3,gap:2,borderRadius:'var(--radius-control)',background:'var(--surface-2)',border:'1px solid var(--border-subtle)',...style}}>
    {options.map(o=>{const v=o.value??o;const l=o.label??o;const on=v===value;return <button key={v} onClick={()=>onChange&&onChange(v)} style={{height:h,padding:'0 16px',borderRadius:'var(--radius-xs)',border:0,cursor:'pointer',background:on?'var(--text-primary)':'transparent',color:on?'var(--bg-app)':'var(--text-secondary)',font:'var(--weight-bold) '+(size==='sm'?'10px':'11px')+'/1 var(--font-mono)',letterSpacing:'var(--tracking-label)',textTransform:'uppercase',transition:'all var(--dur-base) var(--ease-out)'}}>{l}</button>})}
  </div>;
}
