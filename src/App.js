import React, { useState, useEffect } from 'react';
import './App.css';

import Board from './Board';

const isMine = (turn, i)=> (
  (turn === 'me' && [8, 9, 10, 11, 12, 13].includes(i) ) ||
  (turn !== 'me' && [1, 2, 3, 4, 5, 6].includes(i) )
);

const calculateNextBoard = (seeds, whence, howMany, turn, captures)=>{
  let nextSeeds = [...seeds];

  nextSeeds[whence] = 0;

  let r = howMany;
  let c = whence;
  
  while(r){
    c = (c + 13) % 14;
    if( (c === 7 && turn !== 'me') || (c === 0 && turn === 'me') ) c = (c+13) % 14;

    r--;
    nextSeeds[c]++;
  }

  if(
    captures &&
    (nextSeeds[c] === 1) &&
    isMine(turn, c) &&
    nextSeeds[14-c] > 0 &&
    ![0,7].includes(c)
  ) {
    // this is a capture, move seeds to my bank
    const bank = turn === 'me' ? 7 : 0;

    nextSeeds[bank] += 1 + nextSeeds[14-c];
    nextSeeds[c] = 0;
    nextSeeds[14-c] = 0;
  }
  
  return {
    seeds: nextSeeds,
    turn: [0,7].includes(c) ? turn : turn === 'me' ? 'them' : 'me',
  };
};

function App() {
  const [seeds, setSeeds] = useState([0, 4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4]);
  const [turn, setTurn] = useState('me');
  const [animating, setAnimating] = useState(false);
  
  const playMove = (i)=>{
    if(
      animating ||
      !seeds[i] ||
      !isMine(turn, i)
    ) return;

    setAnimating(true);

    for( let j=0; j < seeds[i]; j++ ){
      setTimeout(()=> (
        setSeeds( calculateNextBoard(seeds, i, j+1, turn, false).seeds )
      ), 300 + j*500);
    }

    setTimeout(()=> {
      const next = calculateNextBoard(seeds, i, seeds[i], turn, true);
      
      setSeeds( next.seeds );
      setTurn( next.turn );
      
      setAnimating(false);
    }, 400 + 500 * seeds[i]);
  };

  useEffect(()=> {
    if(!animating) {
      // move just ended, it is now `turn`'s move

      // if turn has no moves, game is over
    }
  }, [animating, turn]);
  
  return (
    <div className="App">
      <Board seeds={seeds} onClick={playMove} turn={turn}/>
    </div>
  );
}

export default App;
