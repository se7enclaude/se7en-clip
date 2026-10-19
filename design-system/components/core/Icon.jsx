import React from 'react';
export function Icon({name,size=18,color,style,...rest}){
  return <i className={'icon-'+name} aria-hidden="true" style={{fontSize:size,width:size,height:size,alignItems:'center',justifyContent:'center',color,flexShrink:0,...style}} {...rest}></i>;
}
