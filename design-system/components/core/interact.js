import React from 'react';
export function useInteract(){
  const [hover,setHover]=React.useState(false);const [press,setPress]=React.useState(false);
  return {hover,press,bind:{onMouseEnter:()=>setHover(true),onMouseLeave:()=>{setHover(false);setPress(false)},onMouseDown:()=>setPress(true),onMouseUp:()=>setPress(false)}};
}
