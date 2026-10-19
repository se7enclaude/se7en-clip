import React from 'react';
import { IconButton } from '../core/IconButton.jsx';
export function Dialog({open=true,title,eyebrow,children,footer,onClose,width=460,style}){
  if(!open) return null;
  return <div style={{position:'absolute',inset:0,zIndex:50,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(5,5,6,.6)',backdropFilter:'blur(6px)'}}>
    <div role="dialog" style={{width,maxWidth:'calc(100% - 32px)',borderRadius:'var(--radius-lg)',background:'var(--surface-1)',border:'1px solid var(--border-default)',boxShadow:'var(--shadow-3)',overflow:'hidden',...style}}>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:16,padding:'24px 24px 0'}}>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {eyebrow&&<span style={{font:'var(--type-label)',letterSpacing:'var(--tracking-label)',textTransform:'uppercase',color:'var(--accent-text)'}}>{eyebrow}</span>}
          <span style={{font:'var(--weight-bold) 26px/1.1 var(--font-display)',letterSpacing:'var(--tracking-heading)',color:'var(--text-primary)'}}>{title}</span>
        </div>
        {onClose&&<IconButton icon="x" size={34} label="Fermer" onClick={onClose}/>}
      </div>
      <div style={{padding:'16px 24px 24px',font:'var(--type-body)',color:'var(--text-secondary)'}}>{children}</div>
      {footer&&<div style={{display:'flex',justifyContent:'flex-end',gap:10,padding:'16px 24px',borderTop:'1px solid var(--border-subtle)',background:'var(--surface-2)'}}>{footer}</div>}
    </div>
  </div>;
}
