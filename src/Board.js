import React from 'react';

import Seeds from './Seeds';

const Board = ({
  seeds = [],
  turn = 'me',
  onClick=()=>0,
})=>{
  
  return (
    <svg viewBox='0 0 1600 1000'>
      <rect fill='#523' x={0} y={0} height={1000} width={1600}/>

      <g>
        <rect fill='#946' x={20} y={50} height={900} width={160} rx={80} />
        <Seeds total={seeds[0]}
               x={20}
               y={50}
               h={900}
               w={160}
        />
        <title>{seeds[0]}</title>
      </g>
      
      {[0,1,2,3,4,5].map((i)=> (
         <g key={i} onClick={()=> onClick(i+1)} className={'their-pits '+turn}>
           <rect fill='#b68'
                 x={220 + 200 * i}
                 y={80}
                 height={300}
                 width={160}
                 rx={80}
           />
           <Seeds total={seeds[i + 1]}
                  x={220 + 200 * i}
                  y={80}
                  h={300}
                  w={160}
           />
           <title>{seeds[i+1]}</title>
         </g>
       ))}
         
       <g>
         <rect fill='#946' x={1420} y={50} height={900} width={160} rx={80} />
         <Seeds total={seeds[7]}
                x={1420}
                y={50}
                h={900}
                w={160}
         />
         <title>{seeds[7]}</title>
       </g>
      
      {[0,1,2,3,4,5].map((i)=> (
         <g key={i} onClick={()=> onClick(i+8)} className={'my-pits '+turn}>
           <rect
              fill='#b68'
              x={1220 - 200 * i}
              y={620}
              height={300}
              width={160}
              rx={80}
           />
           <Seeds total={seeds[i + 8]}
                  x={1220 - 200 * i}
                  y={620}
                  h={300}
                  w={160}
           />
           <title>{seeds[i+8]}</title>
         </g>
       ))}
    </svg>
  );
};

export default Board;
