import React from 'react';
import { useInteract } from './interact.js';
import { Icon } from './Icon.jsx';
const SIZES={sm:{h:'var(--control-sm)',px:14,fs:'11px',ic:14},md:{h:'var(--control-md)',px:20,fs:'12px',ic:16},lg:{h:'var(--control-lg)',px:28,fs:'13px',ic:18}};
export function Button({variant='primary',size='md',icon,iconRight,disabled,fullWidth,children,style,...rest}){
  const {hover,press,bind}=useInteract();const s=SIZES[size]||SIZES.md;
  const v={
    primary:{bg:hover?'var(--accent-hover)':'var(--accent)',fg:'var(--text-on-accent)',bd:'transparent',sh:hover?'var(--shadow-accent)':'var(--inset-top)'},
    secondary:{bg:hover?'var(--surface-3)':'var(--surface-2)',fg:'var(--text-primary)',bd:'var(--border-default)',sh:'var(--inset-top)'},
    ghost:{bg:hover?'var(--surface-glass-light)':'transparent',fg:'var(--text-primary)',bd:'transparent',sh:'none'},
    outline:{bg:'transparent',fg:'var(--text-primary)',bd:hover?'var(--text-primary)':'var(--border-strong)',sh:'none'},
    light:{bg:hover?'var(--fog-1)':'var(--fog-0)',fg:'var(--ink-0)',bd:'transparent',sh:'none'},
  }[variant];
  return <button disabled={disabled} {...bind} {...rest} style={{display:fullWidth?'flex':'inline-flex',width:fullWidth?'100%':undefined,alignItems:'center',justifyContent:'center',gap:8,height:s.h,padding:'0 '+s.px+'px',borderRadius:'var(--radius-control)',border:'1px solid '+v.bd,background:v.bg,color:v.fg,boxShadow:v.sh,font:'var(--weight-medium) '+s.fs+'/1 var(--font-mono)',letterSpacing:'.12em',textTransform:'uppercase',cursor:disabled?'not-allowed':'pointer',opacity:disabled?.4:1,transform:press&&!disabled?'scale(var(--press-scale))':'none',transition:'all var(--dur-base) var(--ease-out)',whiteSpace:'nowrap',...style}}>
    {icon&&<Icon name={icon} size={s.ic}/>}{children}{iconRight&&<Icon name={iconRight} size={s.ic}/>}
  </button>;
}
