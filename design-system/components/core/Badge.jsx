import React from 'react';
import { Icon } from './Icon.jsx';
export function Badge({tone='neutral',icon,mono,children,style}){
  const t={neutral:['var(--surface-3)','var(--text-secondary)'],accent:['var(--accent-soft)','var(--accent-text)'],success:['var(--success-soft)','var(--success)'],warning:['var(--warning-soft)','var(--warning)'],info:['var(--info-soft)','var(--info)'],solid:['var(--accent)','#fff'],inverse:['var(--text-primary)','var(--bg-app)']}[tone];
  return <span style={{display:'inline-flex',alignItems:'center',gap:5,height:22,padding:'0 9px',borderRadius:'var(--radius-xs)',background:t[0],color:t[1],font:mono?'var(--weight-medium) 11px/1 var(--font-mono)':'var(--weight-medium) 10px/1 var(--font-mono)',letterSpacing:mono?0:'var(--tracking-label)',textTransform:mono?'none':'uppercase',whiteSpace:'nowrap',...style}}>{icon&&<Icon name={icon} size={12}/>}{children}</span>;
}
