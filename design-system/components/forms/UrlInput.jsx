import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function UrlInput({value,onChange,placeholder='Collez un lien…',icon='link',action,size='md',error,disabled,style,...rest}){
  const [focus,setFocus]=React.useState(false);const h=size==='lg'?72:size==='sm'?36:46;
  return <div style={{display:'flex',alignItems:'center',gap:10,height:h,padding:size==='lg'?'0 8px 0 22px':'0 6px 0 16px',borderRadius:'var(--radius-control)',background:'var(--surface-2)',border:'1px solid '+(error?'var(--danger)':focus?'var(--border-strong)':'var(--border-default)'),boxShadow:focus?'0 0 0 4px var(--focus-ring)':'var(--inset-top)',transition:'all var(--dur-base) var(--ease-out)',opacity:disabled?.5:1,...style}}>
    {icon&&<Icon name={icon} size={size==='lg'?20:16} color="var(--text-tertiary)"/>}
    <input value={value} onChange={e=>onChange&&onChange(e.target.value)} placeholder={placeholder} disabled={disabled} onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)} {...rest} style={{flex:1,minWidth:0,height:'100%',background:'transparent',border:0,outline:0,color:'var(--text-primary)',font:(size==='lg'?'var(--weight-medium) 17px':'var(--weight-regular) 14px')+'/1 var(--font-mono)'}}/>
    {action}
  </div>;
}
