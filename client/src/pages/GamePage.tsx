/**
 * GamePage Component
 * 
 * The main game page that serves as the entry point for the Ghost Typist game.
 * This component sets up the page metadata for SEO and renders the core game component.
 */

import { Helmet } from "react-helmet";
import GhostTypist from "@/components/GhostTypist";

export default function GamePage() {
  return (
    <>
      {/* SEO and metadata configuration for the game page */}
      <Helmet>
        <title>Ghost Typist</title>
        <meta name="description" content="Type words correctly and fast to push back the ghost in this typing game. How long can you survive?" />
        <meta property="og:title" content="Ghost Typist" />
        <meta property="og:description" content="A fun typing game where you have to type words correctly to push back a ghost. Test your typing speed and accuracy!" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
      </Helmet>
      {/* Main game component that handles the core gameplay mechanics */}
      <GhostTypist />
    </>
  );
}
