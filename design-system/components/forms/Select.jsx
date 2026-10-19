import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Select({label,value,options=[],onChange,icon,style}){
  const [open,setOpen]=React.useState(false);const cur=options.find(o=>(o.value??o)===value);const lab=cur?(cur.label??cur):'—';
  return <div style={{position:'relative',display:'inline-block',...style}}>
    <button onClick={()=>setOpen(!open)} style={{display:'flex',alignItems:'center',gap:10,height:46,padding:'0 14px 0 16px',width:'100%',borderRadius:'var(--radius-sm)',background:'var(--surface-2)',border:'1px solid '+(open?'var(--border-strong)':'var(--border-default)'),color:'var(--text-primary)',cursor:'pointer',textAlign:'left'}}>
      {icon&&<Icon name={icon} size={15} color="var(--text-tertiary)"/>}
      <span style={{display:'flex',flexDirection:'column',gap:3,flex:1,minWidth:0}}>
        {label&&<span style={{font:'var(--weight-medium) 9px/1 var(--font-mono)',letterSpacing:'var(--tracking-label)',textTransform:'uppercase',color:'var(--text-tertiary)'}}>{label}</span>}
        <span style={{font:'var(--weight-semibold) 14px/1 var(--font-sans)'}}>{lab}</span>
      </span>
      <Icon name="chevron-down" size={16} color="var(--text-secondary)" style={{transform:open?'rotate(180deg)':'none',transition:'transform var(--dur-base) var(--ease-out)'}}/>
    </button>
    {open&&<div style={{position:'absolute',top:'calc(100% + 6px)',left:0,right:0,zIndex:20,padding:6,borderRadius:'var(--radius-md)',background:'var(--surface-glass)',backdropFilter:'var(--blur-glass)',border:'1px solid var(--border-default)',boxShadow:'var(--shadow-3)'}}>
      {options.map(o=>{const v=o.value??o;const l=o.label??o;const sel=v===value;return <div key={v} onClick={()=>{onChange&&onChange(v);setOpen(false)}} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'9px 10px',borderRadius:'var(--radius-xs)',cursor:'pointer',font:'var(--weight-medium) 13px/1 var(--font-sans)',color:sel?'var(--text-primary)':'var(--text-secondary)',background:sel?'var(--surface-glass-light)':'transparent'}}>{l}{sel&&<Icon name="check" size={14} color="var(--accent)"/>}</div>})}
    </div>}
  </div>;
}
