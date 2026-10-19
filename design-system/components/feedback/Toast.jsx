import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Toast({tone='neutral',title,message,action,onClose,style}){
  const ic={neutral:['info','var(--text-secondary)'],success:['circle-check','var(--success)'],error:['circle-alert','var(--danger)'],accent:['sparkles','var(--accent)']}[tone];
  return <div style={{display:'flex',alignItems:'flex-start',gap:12,width:360,padding:'14px 14px 14px 16px',borderRadius:'var(--radius-md)',background:'var(--surface-glass)',backdropFilter:'var(--blur-glass)',border:'1px solid var(--border-default)',boxShadow:'var(--shadow-3)',...style}}>
    <Icon name={ic[0]} size={18} color={ic[1]} style={{marginTop:1}}/>
    <div style={{flex:1,minWidth:0,display:'flex',flexDirection:'column',gap:3}}>
      <span style={{font:'var(--weight-bold) 14px/1.3 var(--font-sans)',color:'var(--text-primary)'}}>{title}</span>
      {message&&<span style={{font:'var(--type-body-sm)',color:'var(--text-secondary)'}}>{message}</span>}
      {action&&<div style={{marginTop:6}}>{action}</div>}
    </div>
    {onClose&&<button onClick={onClose} aria-label="Fermer" style={{background:'transparent',border:0,color:'var(--text-tertiary)',cursor:'pointer',padding:2}}><Icon name="x" size={16}/></button>}
  </div>;
}
