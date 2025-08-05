import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import "./App.css";

// Import components
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ContentGenerator from "./components/ContentGenerator";
import SocialMediaManager from "./components/SocialMediaManager";
import AffiliateLinks from "./components/AffiliateLinks";
import Analytics from "./components/Analytics";
import Subscription from "./components/Subscription";
import Settings from "./components/Settings";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";
import TutorialSystem from "./components/TutorialSystem";
import DemoBot, { HelpButton, OnboardingChecklist } from "./components/DemoBot";

function App() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showTutorials, setShowTutorials] = useState(false);
  const [showDemoBot, setShowDemoBot] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);

      // Check if user needs onboarding
      const hasCompletedOnboarding = localStorage.getItem(
        "onboarding_completed"
      );
      if (!hasCompletedOnboarding && userData) {
        setShowOnboarding(true);
      }
    }
    setLoading(false);
  }, []);

  // Update current page based on route
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes("/content")) setCurrentPage("contentGenerator");
    else if (path.includes("/social")) setCurrentPage("socialMedia");
    else if (path.includes("/affiliates")) setCurrentPage("affiliateLinks");
    else if (path.includes("/analytics")) setCurrentPage("analytics");
    else setCurrentPage("dashboard");
  }, [window.location.pathname]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    // Show onboarding for new users
    const hasCompletedOnboarding = localStorage.getItem("onboarding_completed");
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("onboarding_completed");
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem("onboarding_completed", "true");
    setShowOnboarding(false);
    setShowDemoBot(true); // Show demo bot after onboarding
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" /> : <LandingPage />}
          />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/dashboard" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/register"
            element={
              user ? (
                <Navigate to="/dashboard" />
              ) : (
                <Register onLogin={handleLogin} />
              )
            }
          />

          {/* Protected routes */}
          <Route
            path="/dashboard/*"
            element={
              user ? (
                <div className="flex h-screen bg-gray-50">
                  <Sidebar
                    open={sidebarOpen}
                    setOpen={setSidebarOpen}
                    user={user}
                  />
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <Navbar
                      user={user}
                      onLogout={handleLogout}
                      sidebarOpen={sidebarOpen}
                      setSidebarOpen={setSidebarOpen}
                    />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                      <Routes>
                        <Route index element={<Dashboard user={user} />} />
                        <Route
                          path="content"
                          element={<ContentGenerator user={user} />}
                        />
                        <Route
                          path="social"
                          element={<SocialMediaManager user={user} />}
                        />
                        <Route
                          path="affiliates"
                          element={<AffiliateLinks user={user} />}
                        />
                        <Route
                          path="analytics"
                          element={<Analytics user={user} />}
                        />
                        <Route
                          path="subscription"
                          element={<Subscription user={user} />}
                        />
                        <Route
                          path="settings"
                          element={<Settings user={user} />}
                        />
                      </Routes>
                    </main>
                  </div>
                </div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>

        {/* Tutorial System */}
        <TutorialSystem
          isOpen={showTutorials}
          onClose={() => setShowTutorials(false)}
        />

        {/* Demo Bot */}
        <DemoBot
          isOpen={showDemoBot}
          onClose={() => setShowDemoBot(false)}
          currentPage={currentPage}
        />

        {/* Onboarding Checklist */}
        <OnboardingChecklist
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          onComplete={handleOnboardingComplete}
        />

        {/* Help Button - only show when user is logged in */}
        {user && <HelpButton onClick={() => setShowDemoBot(true)} />}

        <Toaster />
      </div>
    </Router>
  );
}

export default App;
