import { useState, useEffect, useRef } from 'react';
import '../games.css';

export default function SnakeGame() {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Game constants
  const GRID_SIZE = 20;
  const TILE_COUNT = 20;
  const GAME_SPEED = 150;

  // Game state refs
  const snakeRef = useRef([{ x: 10, y: 10 }]);
  const foodRef = useRef({ x: 15, y: 10 }); // Start food in different position
  const directionRef = useRef({ dx: 1, dy: 0 }); // Start moving right
  const animationRef = useRef(null);
  const lastUpdateTimeRef = useRef(0);

  // Initialize canvas
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = GRID_SIZE * TILE_COUNT;
    canvas.height = GRID_SIZE * TILE_COUNT;
    draw();
  };

  // Generate random food position
  const generateFood = () => {
    const food = {
      x: Math.floor(Math.random() * TILE_COUNT),
      y: Math.floor(Math.random() * TILE_COUNT)
    };
    
    // Make sure food doesn't spawn on snake
    const isOnSnake = snakeRef.current.some(
      segment => segment.x === food.x && segment.y === food.y
    );
    return isOnSnake ? generateFood() : food;
  };

  // Draw game state
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= TILE_COUNT; i++) {
      ctx.beginPath();
      ctx.moveTo(i * GRID_SIZE, 0);
      ctx.lineTo(i * GRID_SIZE, canvas.height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, i * GRID_SIZE);
      ctx.lineTo(canvas.width, i * GRID_SIZE);
      ctx.stroke();
    }

    // Draw food (red)
    const food = foodRef.current;
    ctx.fillStyle = '#ff5252';
    ctx.beginPath();
    ctx.arc(
      food.x * GRID_SIZE + GRID_SIZE / 2,
      food.y * GRID_SIZE + GRID_SIZE / 2,
      GRID_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw snake (green)
    const snake = snakeRef.current;
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#4CAF50' : '#8BC34A';
      ctx.beginPath();
      ctx.arc(
        segment.x * GRID_SIZE + GRID_SIZE / 2,
        segment.y * GRID_SIZE + GRID_SIZE / 2,
        GRID_SIZE / 2 - 1,
        0,
        Math.PI * 2
      );
      ctx.fill();
      
      // Add border
      ctx.strokeStyle = '#2E7D32';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  };

  // Reset game state
  const resetGame = () => {
    snakeRef.current = [{ x: 10, y: 10 }];
    foodRef.current = { x: 15, y: 10 }; // Fixed food position
    directionRef.current = { dx: 1, dy: 0 }; // Start moving right
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    lastUpdateTimeRef.current = 0;
  };

  // Start new game
  const startGame = () => {
    resetGame();
    initCanvas();
    setGameStarted(true);
  };

  // Handle keyboard input
  const handleKeyDown = (e) => {
    if (isPaused && e.key !== 'p') return;

    const { dx, dy } = directionRef.current;
    
    switch (e.key) {
      case 'ArrowUp':
        if (dy !== 1) directionRef.current = { dx: 0, dy: -1 };
        break;
      case 'ArrowDown':
        if (dy !== -1) directionRef.current = { dx: 0, dy: 1 };
        break;
      case 'ArrowLeft':
        if (dx !== 1) directionRef.current = { dx: -1, dy: 0 };
        break;
      case 'ArrowRight':
        if (dx !== -1) directionRef.current = { dx: 1, dy: 0 };
        break;
      case 'p':
        setIsPaused(prev => !prev);
        break;
    }
  };

  // Game loop
  useEffect(() => {
    if (!gameStarted) return;

    const update = (currentTime) => {
      if (!lastUpdateTimeRef.current) {
        lastUpdateTimeRef.current = currentTime;
      }
      
      const deltaTime = currentTime - lastUpdateTimeRef.current;
      if (deltaTime < GAME_SPEED) return;
      
      lastUpdateTimeRef.current = currentTime;

      const snake = [...snakeRef.current];
      const food = foodRef.current;
      const { dx, dy } = directionRef.current;

      // Calculate new head position
      const head = { 
        x: snake[0].x + dx,
        y: snake[0].y + dy
      };

      // Check wall collisions (only after first move)
      if (snake.length > 1 && (
        head.x < 0 || head.x >= TILE_COUNT ||
        head.y < 0 || head.y >= TILE_COUNT
      )) {
        setGameOver(true);
        return;
      }

      // Check self collision (only if snake has length > 4)
      if (snake.length > 4 && 
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
        return;
      }

      // Add new head
      snake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 1);
        foodRef.current = generateFood();
      } else {
        // Remove tail if no food eaten
        snake.pop();
      }

      snakeRef.current = snake;
      draw();
    };

    const gameLoop = (currentTime) => {
      if (!isPaused && !gameOver) {
        update(currentTime);
      }
      animationRef.current = requestAnimationFrame(gameLoop);
    };

    // Start the game loop
    animationRef.current = requestAnimationFrame(gameLoop);

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animationRef.current);
    };
  }, [gameStarted, isPaused, gameOver]);

  return (
    <div className="game snake-game">
      <h2>Snake Game</h2>
      
      {!gameStarted ? (
        <div className="start-screen">
          <p>Use arrow keys to move. Press P to pause.</p>
          <button className="start-btn" onClick={startGame}>Start Game</button>
        </div>
      ) : gameOver ? (
        <div className="game-over">
          <p>Game Over! Your score: {score}</p>
          <button className="restart-btn" onClick={startGame}>Play Again</button>
        </div>
      ) : (
        <>
          <div className="game-info">
            <p>Score: {score}</p>
            <p>Status: {isPaused ? 'Paused' : 'Playing'}</p>
          </div>
          
          <canvas 
            ref={canvasRef}
            width={GRID_SIZE * TILE_COUNT}
            height={GRID_SIZE * TILE_COUNT}
          />
          
          <div className="controls">
            <button onClick={() => setIsPaused(prev => !prev)}>
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button onClick={startGame} className="restart-btn">
              Restart
            </button>
          </div>
        </>
      )}
    </div>
  );
}