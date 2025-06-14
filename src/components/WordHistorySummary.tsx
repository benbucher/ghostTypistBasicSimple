import React, { useState } from 'react';
import { WordHistory } from "@/hooks/useGame";

interface WordHistorySummaryProps {
  wordHistory: WordHistory[];
}

export default function WordHistorySummary({ wordHistory }: WordHistorySummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (wordHistory.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center text-xl font-semibold text-primary mb-4 hover:text-primary/80 transition-colors"
      >
        <span className="transform transition-transform duration-200 mr-2">
          {isExpanded ? '▼' : '▶'}
        </span>
        <span>Typing History</span>
      </button>
      
      <div className={`
        bg-gray-200 backdrop-blur-sm rounded-lg overflow-hidden
        transition-all duration-300 ease-in-out
        ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="p-4">
          {wordHistory.map((word, index) => (
            <div 
              key={index} 
              className="flex justify-between items-center text-sm md:text-base
                hover:bg-gray-200/50 rounded-md p-2 transition-colors"
            >
              <div className="text-primary font-medium">{word.targetWord}</div>
              <div className="flex items-center gap-0.5">
                {word.targetWord.split('').map((letter, i) => (
                  <span
                    key={i}
                    className={`
                      ${word.letterStates[i] === 'correct' 
                        ? 'text-green-600' 
                        : 'text-red-500'
                      }
                      transition-colors
                    `}
                  >
                    {word.typedWord[i] || ''}
                  </span>
                ))}
                {word.typedWord.length > word.targetWord.length && (
                  <span className="text-red-500">
                    {word.typedWord.slice(word.targetWord.length)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 