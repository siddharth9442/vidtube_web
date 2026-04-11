import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import { useAuth } from '../store/store'

const Navbar = () => {
  const [query, setQuery] = useState('')
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-14 flex items-center px-4 gap-4">
      {/* Hamburger + Logo */}
      <div className="flex items-center gap-3 w-56 shrink-0">
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Logo />
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex flex-1 max-w-2xl mx-auto">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-full text-sm focus:outline-none focus:border-blue-400"
        />
        <button
          type="submit"
          className="px-5 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-200 transition-colors"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>

      {/* Auth area */}
      <div className="flex items-center gap-3 ml-auto shrink-0">
        {isAuthenticated ? (
          <>
            <Link
              to={`/channel/${user?._id}`}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
            </Link>
            <button
              onClick={logout}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors px-3 py-1.5 hover:bg-gray-100 rounded-lg"
            >
              Sign out
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 px-4 py-1.5 border border-blue-500 text-blue-500 rounded-full text-sm font-medium hover:bg-blue-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Sign in
          </Link>
        )}
      </div>
    </header>
  )
}

export default Navbar
