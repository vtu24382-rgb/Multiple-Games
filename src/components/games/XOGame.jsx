import { useState } from 'react'
import '../games.css'

export default function XOGame() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ]

    for (let line of lines) {
      const [a, b, c] = line
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return null
  }

  const handleClick = (i) => {
    if (board[i] || calculateWinner(board)) return
    
    const newBoard = board.slice()
    newBoard[i] = isXNext ? 'X' : 'O'
    setBoard(newBoard)
    setIsXNext(!isXNext)
  }

  const winner = calculateWinner(board)
  const status = winner 
    ? `Winner: ${winner}`
    : board.every(square => square) 
      ? 'Draw!'
      : `Next player: ${isXNext ? 'X' : 'O'}`

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
  }

  return (
    <div className="game xo-game">
      <h2>XO Game (Tic-Tac-Toe)</h2>
      <div className="status">{status}</div>
      <div className="board">
        {board.map((square, i) => (
          <button 
            key={i} 
            className="square" 
            onClick={() => handleClick(i)}
          >
            {square}
          </button>
        ))}
      </div>
      <button className="reset-btn" onClick={resetGame}>Reset Game</button>
    </div>
  )
}