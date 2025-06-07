import { useState, useEffect, useRef } from "react";
import GhostImage from "./GhostImage";
import { useGame } from "@/hooks/useGame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    typedWordState
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
      // Only handle space and enter keys when not typing in the input
      if (document.activeElement !== inputRef.current) {
        if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          if (gameState === "idle") {
            startGame();
          } else if (gameState === "gameOver") {
            restartGame();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, startGame, restartGame]);

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center fade-in">
      <div className="w-full max-w-2xl mx-auto flex flex-col">
        {/* Header + Score Display Combined */}
        <div className="flex justify-between items-center w-full py-4 gap-x-8">
          {/* Title */}
          <h1 className="text-4xl text-primary">Ghost Typist</h1>

          {/* Compact Score Display with aligned labels/values */}
          <div className="flex flex-col gap-1 text-xs font-medium text-primary w-40">
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
            <GhostImage className="w-48 h-48 opacity-90" />
          </div>

          {/* Progress Bar */}
          <div className="w-full h-5 bg-gray-200 rounded-full mb-8 border-2 border-primary overflow-hidden">
            <div
              className={`h-full bg-primary rounded-l-full transition-all duration-300 ${progressValue <= 30 ? "bg-opacity-80" : ""}`}
              style={{ width: `${progressValue}%` }}
            ></div>
          </div>

          {/* Word Display or Game Over */}
          <div className="mb-4 text-center min-h-[3rem]">
            {gameState === "gameOver" ? (
              <div className="text-3xl mb-4 text-primary word-display">
                GAME OVER!
              </div>
            ) : typedWordState?.letterStates?.length ? (
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
            ) : (
              // Invisible placeholder for layout stability
              <div className="text-3xl mb-4 text-transparent select-none">
                PLACEHOLDER
              </div>
            )}
          </div>

          {/* Typing Input */}
          <div className="w-full max-w-md mb-8">
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
              spellCheck={false}
            />
          </div>

          {/* Game Controls */}
          <div className="text-center h-[64px] mb-4 fade-in">
            {gameState === "idle" && (
              <Button
                className="bg-primary text-background font-medium py-3 px-8 rounded-full hover:bg-opacity-90 transition-all text-lg"
                onClick={startGame}
              >
                Start Game
              </Button>
            )}

            {gameState === "gameOver" && (
              <Button
                className="bg-primary text-background font-medium py-3 px-8 rounded-full hover:bg-opacity-90 transition-all text-lg"
                onClick={restartGame}
              >
                Play Again
              </Button>
            )}

            {/* Invisible placeholder to maintain layout when no button is shown */}
            {(gameState !== "idle" && gameState !== "gameOver") && (
              <div className="opacity-0 pointer-events-none select-none">
                <Button className="bg-primary text-background font-medium py-3 px-8 rounded-full hover:bg-opacity-90 transition-all text-lg">Placeholder</Button>
              </div>
            )}
          </div>

        </div>
      </div>
      {/* Footer */}
      <div className="w-full text-center py-4">
        <p className="text-xs text-primary opacity-70">
          Ghost Typist | Type to survive!
        </p>
      </div>
    </div>
  );
}
