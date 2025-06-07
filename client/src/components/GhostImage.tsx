import ghostImage from '@/assets/ghostIconNoBackgroung.png';

interface GhostImageProps {
  className?: string;
}

export default function GhostImage({ className = "" }: GhostImageProps) {
  return (
    <img 
      src={ghostImage} 
      alt="Ghost" 
      className={className} 
    />
  );
}