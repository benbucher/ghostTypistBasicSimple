import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

let wordList: string[] = [];

// Comprehensive backup word list
const backupWordList = [
  'ghost', 'spooky', 'type', 'keyboard', 'haunted', 
  'fast', 'quick', 'game', 'spirit', 'phantom',
  'monster', 'scary', 'boo', 'creepy', 'shadow',
  'danger', 'escape', 'survive', 'chase', 'eerie',
  'vanish', 'appear', 'float', 'supernatural', 'spectral',
  'dark', 'night', 'moon', 'howl', 'fear',
  'scream', 'terror', 'haunt', 'curse', 'mist',
  'fog', 'grave', 'tomb', 'crypt', 'dead',
  'undead', 'zombie', 'vampire', 'werewolf', 'witch',
  'wizard', 'magic', 'spell', 'potion', 'ritual'
];

export async function loadWords() {
  try {
    const response = await fetch('/ghostTypistBasicSimple/words.json');
    const data = await response.json();
    // The file contains an array of words directly
    wordList = data;
  } catch (error) {
    console.error('Failed to load words:', error);
    // Fallback to the comprehensive backup word list
    wordList = backupWordList;
  }
}

export function getRandomWord() {
  if (wordList.length === 0) {
    console.warn('Word list is empty, loading words...');
    loadWords();
    return 'ghost'; // Fallback word
  }
  return wordList[Math.floor(Math.random() * wordList.length)];
}

export function saveHighScore(score: number) {
  localStorage.setItem('ghostTypistHighScore', score.toString());
}

export function loadHighScore(): number {
  const savedHighScore = localStorage.getItem('ghostTypistHighScore');
  return savedHighScore ? parseInt(savedHighScore, 10) : 0;
}
