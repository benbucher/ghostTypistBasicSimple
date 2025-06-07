/**
 * Main application component that sets up the core routing structure.
 * This file serves as the root component of the application.
 */

import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import GamePage from "@/pages/GamePage";

/**
 * Router component that handles application routing using wouter.
 * Defines the main routes of the application:
 * - "/" -> GamePage (main game interface)
 * - Any other route -> NotFound page
 */
function Router() {
  return (
    <Switch>
      <Route path="/ghostTypistBasicSimple/" component={GamePage} />
      <Route path="/ghostTypistBasicSimple/*" component={NotFound} />
      <Route path="/" component={GamePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <TooltipProvider>
      <Router />
      <Toaster />
    </TooltipProvider>
  );
}
