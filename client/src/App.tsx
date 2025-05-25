import { Switch, Route, Router } from "wouter";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import Analytics from "@/pages/Analytics";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/toaster";
import SEO from "@/components/SEO";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { PWANotifications } from "@/components/PWANotifications";

// Configure base path for GitHub Pages
const basePath = import.meta.env.PROD ? "/Print3DPro" : "";

function App() {
  return (
    <AnalyticsProvider enableScrollTracking={true} enableErrorTracking={true}>
      <ErrorBoundary>
        <SEO />
        <Router base={basePath}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/analytics" component={Analytics} />
            <Route component={NotFound} />
          </Switch>
        </Router>
        <Toaster />
        <PWANotifications />
      </ErrorBoundary>
    </AnalyticsProvider>
  );
}

export default App;
