import React, { useState, useEffect, useCallback } from 'react';
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
    if( (c === 7 && turn !== 'me') ||
        (c === 0 && turn === 'me') ) c = (c+13) % 14;

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

const calculateLegalMoves = (seeds, turn)=>
  [...Array(14)].map((o, i)=> i)
                .filter(i=> seeds[i] && isMine(turn, i));

const initSeeds = [0, 4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4];

function App() {
  const [seeds, setSeeds] = useState(initSeeds);
  const [turn, setTurn] = useState('me');
  const [animating, setAnimating] = useState(false);

  const [score, setScore] = useState(null);
  
  const reset = ()=>{
    setSeeds(initSeeds);
    setTurn('me');
    setAnimating(false);
    setScore(null);
  };
  
  const playMove = useCallback((i)=>{
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
  }, [animating, seeds, turn]);

  useEffect(()=> {
    if(!animating) {
      // move just ended, it is now `turn`'s move

      const legalMoves = calculateLegalMoves(seeds, turn);
      if( !legalMoves.length ) {
        // if turn has no moves, game is over
        const myScore = seeds.slice(7).reduce((p, c)=> p+c, 0);
        const theirScore = seeds.slice(0, 7).reduce((p, c)=> p+c, 0);

        setScore([myScore, theirScore]);

      } else if( turn === 'them' ) {
        const boardOutcomes = legalMoves
          .map(i=> calculateNextBoard(seeds, i, seeds[i], turn, true));
        const maxBank = Math.max(...boardOutcomes.map(bo=> bo.seeds[0]));
        const maxBankMove = boardOutcomes.findIndex(bo=> bo.seeds[0] === maxBank);
        
        // const randomMoveIndex = Math.floor(
        //   legalMoves.length * Math.random()
        // );
        
        playMove( legalMoves[maxBankMove] );
      }
    }
  }, [animating, turn, seeds, playMove]);
  
  return (
    <div className="App">
      <Board seeds={seeds} onClick={playMove} turn={turn}/>
      {
        !score ? null : (
          <div className='winner'>
            <div>{ score[0] > score[1] ? 'You' : 'The Opponent'} Won</div>
            <div>You scored: { score[0] }; The Opponent scored {score[1]}</div>
            <button onClick={reset}>Play Again</button>
          </div>
        )
      }
    </div>
  );
}

export default App;
