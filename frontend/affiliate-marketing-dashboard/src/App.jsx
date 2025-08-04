import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css'

// Import components
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import ContentGenerator from './components/ContentGenerator'
import SocialMediaManager from './components/SocialMediaManager'
import AffiliateLinks from './components/AffiliateLinks'
import Analytics from './components/Analytics'
import Subscription from './components/Subscription'
import Settings from './components/Settings'
import LandingPage from './components/LandingPage'
import Login from './components/Login'
import Register from './components/Register'

function App() {
  const [user, setUser] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
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
            element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/dashboard" /> : <Register onLogin={handleLogin} />} 
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
                        <Route path="content" element={<ContentGenerator user={user} />} />
                        <Route path="social" element={<SocialMediaManager user={user} />} />
                        <Route path="affiliates" element={<AffiliateLinks user={user} />} />
                        <Route path="analytics" element={<Analytics user={user} />} />
                        <Route path="subscription" element={<Subscription user={user} />} />
                        <Route path="settings" element={<Settings user={user} />} />
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
        <Toaster />
      </div>
    </Router>
  )
}

export default App

