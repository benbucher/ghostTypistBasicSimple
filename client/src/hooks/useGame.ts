import { useState, useEffect, useRef, ChangeEvent } from "react";
import { getRandomWord, saveHighScore, loadHighScore } from "@/lib/utils";

// Define possible game states
type GameState = 'idle' | 'playing' | 'gameOver';

// Interface for tracking typing state and letter-by-letter feedback
export interface TypedWordState {
  targetWord: string;    // The word the player needs to type
  typedText: string;     // What the player has typed so far
  letterStates: ('correct' | 'incorrect' | 'pending')[];  // Status of each letter
}

export function useGame() {
  // Game state management
  const [gameState, setGameState] = useState<GameState>('idle');
  
  // Core game data including scores, timing, and progression
  const [gameData, setGameData] = useState({
    currentWord: '',      // Current word to type
    currentScore: 0,      // Player's current score
    highScore: 0,         // Best score achieved
    gameTime: 0,          // Time elapsed in seconds
    currentLevel: 1,      // Current difficulty level
    progressValue: 100,   // Progress bar value (0-100)
    finalScore: 0,        // Score when game ends
    decreaseRate: 1       // Rate at which progress decreases
  });

  // State for tracking typing progress and letter states
  const [typedWordState, setTypedWordState] = useState<TypedWordState>({
    targetWord: '',
    typedText: '',
    letterStates: []
  });
  
  // Refs for managing game and progress timers
  const timerRef = useRef<{ progress: number | null; game: number | null }>({
    progress: null,
    game: null
  });
  
  // Load high score from local storage on initial render
  useEffect(() => {
    const localHighScore = loadHighScore();
    setGameData(prev => ({ ...prev, highScore: localHighScore }));
  }, []);

  // Clear all active timers
  const clearTimers = () => {
    if (timerRef.current.progress) {
      window.clearInterval(timerRef.current.progress);
      timerRef.current.progress = null;
    }
    if (timerRef.current.game) {
      window.clearInterval(timerRef.current.game);
      timerRef.current.game = null;
    }
  };

  // Initialize and start a new game
  const startGame = () => {
    clearTimers();
    const newWord = getRandomWord();
    
    setGameState('playing');
    setGameData({
      currentWord: newWord,
      currentScore: 0,
      highScore: gameData.highScore,
      gameTime: 0,
      currentLevel: 1,
      progressValue: 100,
      finalScore: 0,
      decreaseRate: 1.0
    });
    
    setTypedWordState({
      targetWord: newWord.toLowerCase(),
      typedText: '',
      letterStates: Array(newWord.length).fill('pending')
    });
    
    startProgressDecrease();
    updateGameTimer();
  };
  
  // End the current game and handle high score updates
  const endGame = () => {
    const finalScoreValue = gameData.currentScore;
    
    setGameState('gameOver');
    setGameData(prev => ({ ...prev, finalScore: finalScoreValue }));
    clearTimers();
    
    // Update high score if current score is higher
    if (finalScoreValue > gameData.highScore) {
      const newHighScore = finalScoreValue;
      setGameData(prev => ({ ...prev, highScore: newHighScore }));
      saveHighScore(newHighScore);
    }
  };
  
  // Start the progress bar decrease timer
  const startProgressDecrease = () => {
    timerRef.current.progress = window.setInterval(() => {
      setGameData(prev => {
        const newValue = prev.progressValue - prev.decreaseRate / 5;
        
        if (newValue <= 0) {
          endGame();
          return { ...prev, progressValue: 0 };
        }
        
        return { ...prev, progressValue: newValue };
      });
    }, 100);
  };
  
  // Update game timer and handle difficulty progression
  const updateGameTimer = () => {
    timerRef.current.game = window.setInterval(() => {
      setGameData(prev => {
        const newTime = prev.gameTime + 1;
        const levelNumber = Math.floor(newTime / 40);  // Level up every 40 seconds
        const newDecreaseRate = 3.0 + (levelNumber * 0.5);  // Increase difficulty with level
        
        return {
          ...prev,
          gameTime: newTime,
          currentLevel: levelNumber,
          decreaseRate: newDecreaseRate
        };
      });
    }, 1000);
  };

  // Handle player typing input
  const handleTyping = (e: ChangeEvent<HTMLInputElement>) => {
    if (gameState !== 'playing') return;
    
    const typedText = e.target.value.toLowerCase();
    const targetWord = gameData.currentWord.toLowerCase();
    
    // Update letter states based on typing accuracy
    const letterStates = targetWord.split('').map((letter, index) => {
      if (index >= typedText.length) return 'pending';
      return typedText[index] === letter ? 'correct' : 'incorrect';
    });
    
    setTypedWordState({
      targetWord,
      typedText,
      letterStates
    });
    
    // Check if word is complete
    if (typedText.length >= targetWord.length) {
      // Calculate score
      const correctChars = typedText.split('').filter((char, i) => char === targetWord[i]).length;
      const progressRecovery = correctChars + (typedText === targetWord ? 2: 0);  // Bonus for perfect typing
      
      setGameData(prev => ({
        ...prev,
        currentScore: prev.currentScore + correctChars,
        progressValue: Math.min(100, prev.progressValue + progressRecovery)
      }));
      
      // Generate new word and reset typing state
      const newWord = getRandomWord();
      setGameData(prev => ({ ...prev, currentWord: newWord }));
      setTypedWordState({
        targetWord: newWord.toLowerCase(),
        typedText: '',
        letterStates: Array(newWord.length).fill('pending')
      });
      
      e.target.value = '';
    }
  };
  
  // Cleanup timers when component unmounts
  useEffect(() => {
    return clearTimers;
  }, []);
  
  // Return game state and control functions
  return {
    gameState,
    currentWord: gameData.currentWord,
    currentScore: gameData.currentScore,
    highScore: gameData.highScore,
    gameTime: gameData.gameTime,
    currentLevel: gameData.currentLevel,
    progressValue: gameData.progressValue,
    finalScore: gameData.finalScore,
    handleTyping,
    startGame,
    restartGame: startGame,
    typedWordState
  };
}
