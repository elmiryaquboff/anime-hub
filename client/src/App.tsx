/*
 * AnimeHub App — Route Configuration
 * Design: "Dijital Akış" Cyberpunk Theme
 * Routes: / (Home), /anime/:id (Detail), /recommend (Recommendations), /elmir (Secret Page)
 * Note: Using hash-based routing for GitHub Pages compatibility
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Router, Route, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AnimeDetail from "./pages/AnimeDetail";
import Recommend from "./pages/Recommend";
import ElmirPage from "./pages/ElmirPage";

function AppRouter() {
  return (
    <Router hook={useHashLocation}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/anime/:id" component={AnimeDetail} />
        <Route path="/recommend" component={Recommend} />
        <Route path="/elmir" component={ElmirPage} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <AppRouter />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
