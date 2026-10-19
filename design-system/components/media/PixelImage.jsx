import React from 'react';
function rng(seed){let s=seed*9301+49297;return()=>{s=(s*9301+49297)%233280;return s/233280}}
function paintProcedural(c,w,h,seed){
  const x=c.getContext('2d');const r=rng(seed);x.fillStyle='#0B0B0C';x.fillRect(0,0,w,h);
  const blob=(cx,cy,rad,col)=>{const g=x.createRadialGradient(cx,cy,0,cx,cy,rad);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,w,h)};
  blob(w*(.55+r()*.3),h*(.3+r()*.4),Math.max(w,h)*(.35+r()*.2),'rgba(242,43,43,.95)');
  blob(w*(.1+r()*.4),h*(.5+r()*.4),Math.max(w,h)*(.3+r()*.2),'rgba(120,70,60,.55)');
  blob(w*(.3+r()*.5),h*(.2+r()*.3),Math.max(w,h)*.12,'rgba(255,240,230,.85)');
  const hz=h*(.62+r()*.15);const g=x.createLinearGradient(0,hz-h*.2,0,h);g.addColorStop(0,'rgba(5,5,5,0)');g.addColorStop(.35,'rgba(5,5,5,.85)');g.addColorStop(1,'#050505');x.fillStyle=g;x.fillRect(0,0,w,h);
}
export function PixelImage({src,block=1,animateFrom,duration=1400,seed=7,ratio='16/9',grid=true,radius='var(--radius-md)',children,style}){
  const wrap=React.useRef(null);const cv=React.useRef(null);const srcCv=React.useRef(null);
  const [size,setSize]=React.useState([0,0]);const [img,setImg]=React.useState(null);const [b,setB]=React.useState(animateFrom||block);
  React.useEffect(()=>{const ro=new ResizeObserver(([e])=>setSize([Math.round(e.contentRect.width),Math.round(e.contentRect.height)]));ro.observe(wrap.current);return()=>ro.disconnect()},[]);
  React.useEffect(()=>{if(!src){setImg(null);return}const i=new Image();i.onload=()=>setImg(i);i.src=src},[src]);
  React.useEffect(()=>{if(!animateFrom||animateFrom<=block){setB(block);return}let raf;const st=performance.now();
    const tick=n=>{const p=Math.min(1,(n-st)/duration);const e=1-Math.pow(1-p,2.2);setB(Math.max(block,Math.round(animateFrom*Math.pow(block/animateFrom,e))));if(p<1)raf=requestAnimationFrame(tick)};
    raf=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf)},[animateFrom,block,duration]);
  React.useEffect(()=>{const [w,h]=size;if(!w||!h)return;const s=document.createElement('canvas');s.width=w;s.height=h;
    if(img){const x=s.getContext('2d');const k=Math.max(w/img.width,h/img.height);x.drawImage(img,(w-img.width*k)/2,(h-img.height*k)/2,img.width*k,img.height*k)}else paintProcedural(s,w,h,seed);
    srcCv.current=s;draw()},[size,img,seed]);
  const draw=()=>{const c=cv.current,s=srcCv.current;if(!c||!s)return;const [w,h]=size;const d=window.devicePixelRatio||1;c.width=w*d;c.height=h*d;const x=c.getContext('2d');
    const bb=Math.max(1,b);if(bb<=1){x.imageSmoothingEnabled=true;x.drawImage(s,0,0,w*d,h*d);return}
    const ow=Math.max(1,Math.ceil(w/bb)),oh=Math.max(1,Math.ceil(h/bb));const o=document.createElement('canvas');o.width=ow;o.height=oh;const ox=o.getContext('2d');ox.imageSmoothingEnabled=true;ox.drawImage(s,0,0,ow,oh);
    x.imageSmoothingEnabled=false;x.drawImage(o,0,0,ow*bb*d,oh*bb*d);
    if(grid&&bb>=6){x.fillStyle='rgba(5,5,5,.6)';for(let i=0;i<ow;i++)x.fillRect(i*bb*d,0,Math.max(1,d),h*d);for(let j=0;j<oh;j++)x.fillRect(0,j*bb*d,w*d,Math.max(1,d))}};
  React.useEffect(draw,[b]);
  return <div ref={wrap} style={{position:'relative',aspectRatio:ratio,borderRadius:radius,overflow:'hidden',background:'var(--ink-1)',...style}}>
    <canvas ref={cv} style={{position:'absolute',inset:0,width:'100%',height:'100%',display:'block'}}></canvas>{children}
  </div>;
}
