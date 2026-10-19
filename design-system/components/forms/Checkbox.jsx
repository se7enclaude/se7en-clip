import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Checkbox({checked,onChange,label,disabled,style}){
  return <label onClick={()=>!disabled&&onChange&&onChange(!checked)} style={{display:'inline-flex',alignItems:'center',gap:10,cursor:disabled?'not-allowed':'pointer',opacity:disabled?.45:1,font:'var(--weight-medium) 14px/1.3 var(--font-sans)',color:'var(--text-primary)',...style}}>
    <span style={{width:20,height:20,borderRadius:2,display:'inline-flex',alignItems:'center',justifyContent:'center',background:checked?'var(--accent)':'transparent',border:'1.5px solid '+(checked?'var(--accent)':'var(--border-strong)'),color:'#fff',transition:'all var(--dur-fast) var(--ease-out)',flexShrink:0}}>{checked&&<Icon name="check" size={13}/>}</span>
    {label}
  </label>;
}
