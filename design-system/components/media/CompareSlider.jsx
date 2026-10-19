import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { PixelImage } from './PixelImage.jsx';
export function CompareSlider({src,beforeBlock=14,afterBlock=1,seed=7,beforeLabel='Original',afterLabel='Upscale 4×',ratio='16/9',initial=50,style}){
  const [x,setX]=React.useState(initial);const ref=React.useRef(null);const drag=React.useRef(false);
  React.useEffect(()=>{const mv=e=>{if(!drag.current||!ref.current)return;const r=ref.current.getBoundingClientRect();setX(Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100)))};const up=()=>drag.current=false;window.addEventListener('mousemove',mv);window.addEventListener('mouseup',up);return()=>{window.removeEventListener('mousemove',mv);window.removeEventListener('mouseup',up)}},[]);
  const tag={position:'absolute',top:14,padding:'6px 9px',borderRadius:'var(--radius-xs)',font:'var(--weight-medium) 10px/1 var(--font-mono)',letterSpacing:'var(--tracking-label)',textTransform:'uppercase'};
  return <div ref={ref} onMouseDown={e=>{drag.current=true;const r=ref.current.getBoundingClientRect();setX(Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100)))}} style={{position:'relative',aspectRatio:ratio,borderRadius:'var(--radius-lg)',overflow:'hidden',cursor:'ew-resize',userSelect:'none',border:'1px solid var(--border-default)',...style}}>
    <PixelImage src={src} seed={seed} block={afterBlock} ratio={ratio} radius="0" style={{position:'absolute',inset:0,aspectRatio:'auto'}}/>
    <div style={{position:'absolute',inset:0,clipPath:'inset(0 '+(100-x)+'% 0 0)'}}><PixelImage src={src} seed={seed} block={beforeBlock} ratio={ratio} radius="0" style={{position:'absolute',inset:0,aspectRatio:'auto'}}/></div>
    <span style={{...tag,left:14,background:'var(--surface-glass)',backdropFilter:'var(--blur-glass)',color:'var(--text-primary)'}}>{beforeLabel}</span>
    <span style={{...tag,right:14,background:'var(--accent)',color:'#fff'}}>{afterLabel}</span>
    <div style={{position:'absolute',top:0,bottom:0,left:x+'%',width:1,background:'#fff',boxShadow:'0 0 18px rgba(255,255,255,.6)'}}>
      <div style={{position:'absolute',top:'50%',left:'50%',width:36,height:36,marginLeft:-18,marginTop:-18,borderRadius:'var(--radius-control)',background:'#fff',color:'var(--ink-0)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'var(--shadow-2)'}}><Icon name="chevrons-left-right" size={16}/></div>
    </div>
  </div>;
}
