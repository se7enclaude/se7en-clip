import React from 'react';
export function Switch({checked,onChange,label,description,disabled,style}){
  return <label style={{display:'flex',alignItems:'center',gap:12,cursor:disabled?'not-allowed':'pointer',opacity:disabled?.45:1,...style}}>
    <span onClick={()=>!disabled&&onChange&&onChange(!checked)} style={{position:'relative',width:40,height:24,borderRadius:999,background:checked?'var(--accent)':'var(--surface-3)',border:'1px solid '+(checked?'transparent':'var(--border-default)'),transition:'background var(--dur-base) var(--ease-out)',flexShrink:0}}>
      <span style={{position:'absolute',top:2,left:checked?18:2,width:18,height:18,borderRadius:'50%',background:'#fff',boxShadow:'var(--shadow-1)',transition:'left var(--dur-base) var(--ease-out)'}}></span>
    </span>
    {(label||description)&&<span style={{display:'flex',flexDirection:'column',gap:2}}>
      {label&&<span style={{font:'var(--weight-semibold) 14px/1.3 var(--font-sans)',color:'var(--text-primary)'}}>{label}</span>}
      {description&&<span style={{font:'var(--type-body-sm)',color:'var(--text-tertiary)'}}>{description}</span>}
    </span>}
  </label>;
}
