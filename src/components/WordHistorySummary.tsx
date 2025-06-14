import React from 'react';
import { WordHistory } from "@/hooks/useGame";

interface WordHistorySummaryProps {
  wordHistory: WordHistory[];
}

export default function WordHistorySummary({ wordHistory }: WordHistorySummaryProps) {
  if (wordHistory.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <h3 className="text-xl font-semibold text-primary mb-4">&gt; Typing History</h3>
      <div className="bg-gray-200  rounded-lg p-4 ">
        <div className="space-y-2">
          {wordHistory.map((word, index) => (
            <div key={index} className="flex justify-between items-center text-sm md:text-lg">
              <div className="text-primary">{word.targetWord}</div>
              <div className="flex items-center">
                {word.targetWord.split('').map((letter, i) => (
                  <span
                    key={i}
                    className={
                      word.letterStates[i] === 'correct'
                        ? 'correct-letter'
                        : 'incorrect-letter'
                    }
                  >
                    {word.typedWord[i] || ''}
                  </span>
                ))}
                {word.typedWord.length > word.targetWord.length && (
                  <span className="incorrect-letter">
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