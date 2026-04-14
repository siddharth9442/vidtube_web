import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, ThemeProvider } from './store/store'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import OAuthCallback from './pages/OAuthCallback'
import VideoPlayer from './pages/VideoPlayer'
import Profile from './pages/Profile'
import Trending from './pages/Trending'
import Subscriptions from './pages/Subscriptions'
import Library from './pages/Library'
import Upload from './pages/Upload'
import NotFound from './pages/NotFound'

const App = () => {
  return (
    <ThemeProvider>
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
            <Route path="/trending" element={<Trending />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/library" element={<Library />} />
            <Route path="/upload" element={<Upload />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  )
}

export default App