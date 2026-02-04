import { useState } from 'react'
import XOGame from './games/XOGame'
import SnakeGame from './games/SnakeGame'
import RPSGame from './games/RPSGame'

export default function GameSelector() {
  const [activeGame, setActiveGame] = useState('xo')

  return (
    <div className="game-container">
      <div className="game-buttons">
        <button 
          className={`game-btn ${activeGame === 'xo' ? 'active' : ''}`}
          onClick={() => setActiveGame('xo')}
        >
          XO Game
        </button>
        <button 
          className={`game-btn ${activeGame === 'snake' ? 'active' : ''}`}
          onClick={() => setActiveGame('snake')}
        >
          Snake Game
        </button>
        <button 
          className={`game-btn ${activeGame === 'rps' ? 'active' : ''}`}
          onClick={() => setActiveGame('rps')}
        >
          Stone Paper Scissors
        </button>
      </div>

      {activeGame === 'xo' && <XOGame />}
      {activeGame === 'snake' && <SnakeGame />}
      {activeGame === 'rps' && <RPSGame />}
    </div>
  )
}