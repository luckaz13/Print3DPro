import { Switch, Route, Router } from "wouter";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/toaster";

// Configure base path for GitHub Pages
const basePath = import.meta.env.PROD ? "/Print3DPro" : "";

function App() {
  return (
    <ErrorBoundary>
      <Router base={basePath}>
        <Switch>
          <Route path="/" component={Home} />
          <Route component={NotFound} />
        </Switch>
      </Router>
      <Toaster />
    </ErrorBoundary>
  );
}

export default App;
