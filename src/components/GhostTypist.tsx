import React, { useEffect, useRef } from "react";
import GhostImage from "./GhostImage";
import { useGame } from "@/hooks/useGame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WordHistorySummary from "./WordHistorySummary";

export default function GhostTypist() {
  const {
    gameState,
    currentWord,
    currentScore,
    highScore,
    gameTime,
    progressValue,
    handleTyping,
    startGame,
    restartGame,
    typedWordState,
    gameData
  } = useGame();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the input when game is playing
    if (gameState === "playing" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState]);

  // Add keyboard event listener for space and enter keys
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (document.activeElement !== inputRef.current && (event.key === " " || event.key === "Enter")) {
        event.preventDefault();
        if (gameState === "idle") startGame();
        else if (gameState === "gameOver") restartGame(inputRef.current);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, startGame, restartGame]);

  const renderWordDisplay = () => {
    if (gameState === "gameOver") {
      return <div className="text-3xl mb-4 text-primary word-display">GAME OVER!</div>;
    }
    
    if (!typedWordState?.letterStates?.length) {
      return <div className="text-3xl mb-4 text-transparent select-none">PLACEHOLDER</div>;
    }

    return (
      <div className="text-3xl mb-4 text-primary word-display">
        {typedWordState.letterStates.map((state, index) => (
          <span
            key={index}
            className={
              index === typedWordState.typedText.length
                ? "current-letter"
                : state === "correct"
                ? "correct-letter"
                : state === "incorrect"
                ? "incorrect-letter"
                : ""
            }
          >
            {currentWord[index]}
          </span>
        ))}
      </div>
    );
  };

  const renderGameControls = () => {
    if (gameState === "idle") {
      return (
        <Button
          className="bg-primary text-background font-medium py-3 px-8 rounded-full hover:bg-opacity-90 transition-all text-lg"
          onClick={startGame}
        >
          Start Game
        </Button>
      );
    }

    if (gameState === "gameOver") {
      return (
        <Button
          className="bg-primary text-background font-medium py-3 px-8 rounded-full hover:bg-opacity-90 transition-all text-lg"
          onClick={() => restartGame(inputRef.current)}
        >
          Play Again
        </Button>
      );
    }

    return (
      <div className="opacity-0 pointer-events-none select-none">
        <Button className="bg-primary text-background font-medium py-3 px-8 rounded-full hover:bg-opacity-90 transition-all text-lg">
          Placeholder
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-start md:justify-center fade-in">
      <div className="w-full max-w-2xl mx-auto flex flex-col">
        
        {/* Header + Score Display Combined */}
        <div className="flex justify-between items-center w-full py-4 gap-x-24">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl text-primary">Ghost Typist</h1>

          {/* Compact Score Display with aligned labels/values */}
          <div className="flex flex-col gap-1 text-xs font-medium text-primary w-32">
            <div className="flex justify-between w-full">
              <span className="whitespace-nowrap">High Score:</span>
              <span>{highScore}</span>
            </div>
            <div className="flex justify-between w-full">
              <span>Score:</span>
              <span>{currentScore}</span>
            </div>
            <div className="flex justify-between w-full">
              <span>Time:</span>
              <span>{gameTime}</span>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex-grow flex flex-col items-center justify-center w-full">

          {/* Ghost Display */}
          <div className="flex justify-center items-center mb-4">
            <GhostImage className="w-32 h-32 md:w-48 md:h-48 opacity-90" />
          </div>

          {/* Progress Bar */}
          <div className="w-full h-5 bg-gray-200 rounded-full mb-6 md:mb-8 border-2 border-primary overflow-hidden">
            <div
              className={`h-full bg-primary rounded-l-full transition-all duration-300 ${progressValue <= 30 ? "bg-opacity-80" : ""}`}
              style={{ width: `${progressValue}%` }}
            />
          </div>

          {renderWordDisplay()}

          <div className="w-full max-w-md mb-6 md:mb-8">
            <Input
              ref={inputRef}
              type="text"
              className="w-full p-3 text-lg rounded border-2 border-primary bg-background text-primary transition-all"
              placeholder="Type here ..."
              onChange={handleTyping}
              disabled={gameState !== "playing"}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              inputMode="text"
              autoSave="off"
              // autoFocus={gameState === "playing"}
            />
          </div>

          <div className="text-center h-[64px] mb-4 fade-in">
            {renderGameControls()}
          </div>

          {gameState === "gameOver" && (
            <WordHistorySummary wordHistory={gameData.wordHistory} />
          )}
        </div>
      </div>

      <div className="w-full text-center py-4 mt-auto md:mt-0">
        <p className="text-xs text-primary opacity-70">
          Ghost Typist | Type to survive!
        </p>
      </div>
    </div>
  );
}
