import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './store/store'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import OAuthCallback from './pages/OAuthCallback'
import VideoPlayer from './pages/VideoPlayer'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth pages — no Navbar/Sidebar */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<OAuthCallback />} />

          {/* Main app pages — wrapped with Navbar + Sidebar */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/video/:videoId" element={<VideoPlayer />} />
            <Route path="/channel/:channelId" element={<Profile />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App