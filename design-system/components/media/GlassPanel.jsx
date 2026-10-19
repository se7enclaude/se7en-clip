import React from 'react';
export function GlassPanel({children,padding=20,radius='var(--radius-lg)',tone='dark',style,...rest}){
  return <div {...rest} style={{padding,borderRadius:radius,background:tone==='solid'?'var(--surface-1)':'var(--surface-glass)',backdropFilter:tone==='solid'?undefined:'var(--blur-glass)',WebkitBackdropFilter:tone==='solid'?undefined:'var(--blur-glass)',border:'1px solid var(--border-default)',boxShadow:'var(--shadow-2), var(--inset-top)',...style}}>{children}</div>;
}
