import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const wordList = [
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

export function getRandomWord() {
  return wordList[Math.floor(Math.random() * wordList.length)];
}

export function saveHighScore(score: number) {
  localStorage.setItem('ghostTypistHighScore', score.toString());
}

export function loadHighScore(): number {
  const savedHighScore = localStorage.getItem('ghostTypistHighScore');
  return savedHighScore ? parseInt(savedHighScore, 10) : 0;
}
