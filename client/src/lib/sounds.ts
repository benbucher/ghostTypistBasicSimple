// Sound effects for the game
const correctSound = new Audio('./sounds/correct.wav');
const mistakeSound = new Audio('./sounds/mistake.wav');

// Set default volume to 0.2 (20%)
const defaultVolume = 0.2;
correctSound.volume = defaultVolume;
mistakeSound.volume = defaultVolume;

export function playCorrectSound() {
  correctSound.currentTime = 0;
  correctSound.play().catch(error => console.log('Error playing sound:', error));
}

export function playMistakeSound() {
  mistakeSound.currentTime = 0;
  mistakeSound.play().catch(error => console.log('Error playing sound:', error));
} 