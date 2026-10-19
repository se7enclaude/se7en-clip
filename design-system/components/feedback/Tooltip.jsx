import React from 'react';
export function Tooltip({label,children,placement='top',style}){
  const [show,setShow]=React.useState(false);
  const pos=placement==='bottom'?{top:'calc(100% + 8px)'}:placement==='right'?{left:'calc(100% + 10px)',top:'50%',transform:'translateY(-50%)'}:{bottom:'calc(100% + 8px)'};
  const center=placement==='right'?{}:{left:'50%',transform:'translateX(-50%)'};
  return <span onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)} style={{position:'relative',display:'inline-flex',...style}}>
    {children}
    {show&&<span style={{position:'absolute',...center,...pos,zIndex:60,padding:'6px 10px',borderRadius:'var(--radius-xs)',background:'var(--fog-1)',color:'var(--ink-0)',font:'var(--weight-semibold) 12px/1.2 var(--font-sans)',whiteSpace:'nowrap',pointerEvents:'none',boxShadow:'var(--shadow-2)'}}>{label}</span>}
  </span>;
}
