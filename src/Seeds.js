import React, { useState, useEffect } from 'react';

const newPosition = (h, w, x, y, radius)=>{
  return [
    radius + x + Math.floor( Math.random()* (w-2*radius) ),
    radius + y + Math.floor( Math.random()* (h-2*radius) ),
  ];
};

const checkCollision = (next, old, h, w, x, y, radius, buffer = 10)=>{
  for( let i=0; i<old.length; i++)
    if( (
      (next[0] - old[i][0])**2 + (next[1] - old[i][1])**2
    ) < (2*radius + buffer) ** 2 )
      return true;

  // assumes rounded end of radius w/2
  if(
    (next[0] - x - w/2)**2 + (Math.max(Math.abs(next[1] - y - h/2) - h/2 + w/2, 0))**2 >
    (w/2 - radius)**2
  )
    return true;
  
  return false;
};

const newPositions = (old, n, h, w, x, y, radius)=>{
  const r = [];
  let next;
  let tries = 10 ** 3;

  while( (r.length < n) && (tries--)) {
    while( !next || checkCollision(next, [...old, ...r], h, w, x, y, radius) )
      next = newPosition(h, w, x, y, radius);
    r.push(next);
    next = null;
  }

  return r;
};

const Seeds = ({
  total=3,
  x=0,
  y=0,
  h=100,
  w=100,
  radius = 10,
})=>{
  const [positions, setPositions] = useState([]);

  useEffect(()=> {
    if( total > positions.length ){
      setPositions(
        [
          ...positions,
          ...newPositions(positions, total - positions.length, h, w, x, y, radius),
        ]);
      
    } else if(total < positions.length) {
      setPositions( positions.slice(0, total) );
    }
  }, [total, positions, h, w, x, y, radius]);
  
  return (
    positions.map(([x, y], i) => (
      <circle r={radius} fill='#008' cx={x} cy={y} key={i} />
    ))
  );
};

export default Seeds;
