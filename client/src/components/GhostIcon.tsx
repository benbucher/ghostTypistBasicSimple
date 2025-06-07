import React from "react";

interface GhostIconProps {
  className?: string;
}

export default function GhostIcon({ className = "" }: GhostIconProps) {
  return (
    <svg
      width="128"
      height="128"
      viewBox="0 0 128 128"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M64 8C37.5 8 16 29.5 16 56v64c0 0 10-16 16-16s14 16 32 16c18 0 26-16 32-16s16 16 16 16V56c0-26.5-21.5-48-48-48z"
        fill="#E9EBEF"
        stroke="#5B5C5C"
        strokeWidth="4"
      />
      <ellipse
        cx="44"
        cy="56"
        rx="8"
        ry="12"
        fill="#5B5C5C"
      />
      <ellipse
        cx="84"
        cy="56"
        rx="8"
        ry="12"
        fill="#5B5C5C"
      />
      <path
        d="M64 88c-6 0-12-3-16-8 3 8 10 12 16 12s13-4 16-12c-4 5-10 8-16 8z"
        fill="#5B5C5C"
      />
    </svg>
  );
}
