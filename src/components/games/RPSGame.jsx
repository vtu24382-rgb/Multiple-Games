import { useState } from "react";
import "../games.css";

// Correct relative paths to images
import rockImg from "./assets/rock.png";
import paperImg from "./assets/paper.png";
import scissorsImg from "./assets/scissors.png";
import questionImg from "./assets/question.png";

export default function RPSGame() {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ player: 0, computer: 0 });

  const choices = [
    { name: "rock", image: rockImg },
    { name: "paper", image: paperImg },
    { name: "scissors", image: scissorsImg },
  ];

  const playGame = (choice) => {
    const computerSelection = choices[Math.floor(Math.random() * choices.length)];
    
    setPlayerChoice(choice);
    setComputerChoice(computerSelection);
    
    const gameResult = determineWinner(choice, computerSelection.name);
    setResult(gameResult);
    
    setScore(prev => ({
      player: gameResult === "win" ? prev.player + 1 : prev.player,
      computer: gameResult === "lose" ? prev.computer + 1 : prev.computer
    }));
  };

  const determineWinner = (player, computer) => {
    if (player === computer) return "draw";
    
    if (
      (player === "rock" && computer === "scissors") ||
      (player === "paper" && computer === "rock") ||
      (player === "scissors" && computer === "paper")
    ) {
      return "win";
    }
    
    return "lose";
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setScore({ player: 0, computer: 0 });
  };

  return (
    <div className="game rps-game">
      <h2>Rock Paper Scissors</h2>
      
      <div className="scoreboard">
        <div className="score">
          <span>You: {score.player}</span>
          <span>Computer: {score.computer}</span>
        </div>
      </div>
      
      <div className="choices">
        {choices.map((choice) => (
          <button 
            key={choice.name}
            className={`choice-btn ${choice.name}`}
            onClick={() => playGame(choice.name)}
          >
            <img 
              src={choice.image} 
              alt={choice.name} 
              className="hand-image"
            />
            <span>{choice.name.charAt(0).toUpperCase() + choice.name.slice(1)}</span>
          </button>
        ))}
      </div>
      
      <div className="results-container">
        <div className="hands-display">
          <div className="hand player-hand">
            <h3>Your Choice</h3>
            <img 
              src={playerChoice ? choices.find(c => c.name === playerChoice).image : questionImg} 
              alt="Player choice" 
              className="hand-result-image"
            />
          </div>
          
          <div className="vs-circle">
            {result && <span className={`result ${result}`}>
              {result === "win" && "You Win!"}
              {result === "lose" && "You Lose!"}
              {result === "draw" && "Draw!"}
            </span>}
          </div>
          
          <div className="hand computer-hand">
            <h3>Computer</h3>
            <img 
              src={computerChoice ? computerChoice.image : questionImg} 
              alt="Computer choice" 
              className="hand-result-image"
            />
          </div>
        </div>
      </div>
      
      <button className="reset-btn" onClick={resetGame}>
        Reset Game
      </button>
    </div>
  );
}