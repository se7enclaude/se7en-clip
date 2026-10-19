import React from 'react';
import { PixelImage } from './PixelImage.jsx';
export function MediaFrame({src,label,ratio='16/9',radius='var(--radius-md)',kind='video',block=1,seed,children,style}){
  const sd=seed??((label||kind).split('').reduce((a,c)=>a+c.charCodeAt(0),0));
  return <PixelImage src={src} block={block} seed={sd} ratio={ratio} radius={radius} style={{border:'1px solid var(--border-subtle)',...style}}>
    {label&&<span style={{position:'absolute',right:8,bottom:7,font:'var(--weight-medium) 9px/1 var(--font-mono)',letterSpacing:'.08em',color:'var(--text-secondary)',textTransform:'uppercase'}}>{label}</span>}
    {children}
  </PixelImage>;
}
