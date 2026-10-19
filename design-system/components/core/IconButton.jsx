import React from 'react';
import { useInteract } from './interact.js';
import { Icon } from './Icon.jsx';
export function IconButton({icon,variant='outline',size=44,label,active,disabled,style,...rest}){
  const {hover,press,bind}=useInteract();
  const v={
    outline:{bg:hover?'var(--surface-glass-light)':'transparent',fg:'var(--text-primary)',bd:hover?'var(--text-primary)':'var(--border-strong)'},
    solid:{bg:hover?'var(--accent-hover)':'var(--accent)',fg:'#fff',bd:'transparent'},
    glass:{bg:hover?'var(--surface-3)':'var(--surface-glass)',fg:'var(--text-primary)',bd:'var(--border-subtle)'},
    light:{bg:'var(--fog-0)',fg:'var(--ink-0)',bd:'transparent'},
  }[variant];
  const act=active?{bg:'var(--text-primary)',fg:'var(--bg-app)',bd:'transparent'}:v;
  return <button aria-label={label} title={label} disabled={disabled} {...bind} {...rest} style={{width:size,height:size,borderRadius:'var(--radius-control)',display:'inline-flex',alignItems:'center',justifyContent:'center',background:act.bg,color:act.fg,border:'1px solid '+act.bd,backdropFilter:variant==='glass'?'var(--blur-glass)':undefined,cursor:disabled?'not-allowed':'pointer',opacity:disabled?.4:1,transform:press?'scale(.94)':'none',transition:'all var(--dur-base) var(--ease-out)',flexShrink:0,padding:0,...style}}>
    <Icon name={icon} size={Math.round(size*.4)}/>
  </button>;
}
