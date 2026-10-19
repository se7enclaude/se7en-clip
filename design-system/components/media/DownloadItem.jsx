import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Badge } from '../core/Badge.jsx';
import { IconButton } from '../core/IconButton.jsx';
import { ProgressBar } from '../feedback/ProgressBar.jsx';
import { MediaFrame } from './MediaFrame.jsx';
export function DownloadItem({title,source,kind='video',specs=[],status='downloading',progress=0,speed,onAction,style}){
  const st={queued:['neutral','En attente'],downloading:['accent','Téléchargement'],upscaling:['info','Upscale'],done:['success','Terminé'],error:['warning','Échec']}[status];
  const act=status==='done'?'folder-open':status==='error'?'rotate-cw':'pause';
  return <div style={{display:'flex',alignItems:'center',gap:16,padding:12,borderRadius:'var(--radius-md)',background:'var(--surface-1)',border:'1px solid var(--border-subtle)',...style}}>
    <MediaFrame kind={kind} ratio="16/10" radius="var(--radius-sm)" style={{width:112,flexShrink:0}}/>
    <div style={{flex:1,minWidth:0,display:'flex',flexDirection:'column',gap:8}}>
      <div style={{display:'flex',alignItems:'center',gap:8,minWidth:0}}>
        <span style={{font:'var(--weight-bold) 15px/1.2 var(--font-sans)',color:'var(--text-primary)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{title}</span>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>
        {source&&<span style={{display:'inline-flex',alignItems:'center',gap:5,font:'var(--weight-regular) 12px/1 var(--font-mono)',color:'var(--text-tertiary)',marginRight:4}}><Icon name="globe" size={12}/>{source}</span>}
        {specs.map(s=><Badge key={s} mono>{s}</Badge>)}
      </div>
      {(status==='downloading'||status==='upscaling')&&<div style={{display:'flex',alignItems:'center',gap:12}}><ProgressBar value={progress} tone={status==='upscaling'?'neutral':'accent'} showValue style={{flex:1}}/>{speed&&<span style={{font:'var(--weight-regular) 11px/1 var(--font-mono)',color:'var(--text-tertiary)'}}>{speed}</span>}</div>}
    </div>
    <Badge tone={st[0]}>{st[1]}</Badge>
    <IconButton icon={act} size={38} onClick={onAction} label="Action"/>
  </div>;
}
