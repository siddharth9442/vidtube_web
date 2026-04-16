import { createContext, useContext, useReducer, useEffect, useState, createElement } from 'react'
import { getCurrentUser } from '../api/auth'

// Theme Context
const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = () => setIsDark(prev => !prev)

  return createElement(ThemeContext.Provider, { value: { isDark, toggleTheme } }, children)
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}


const AuthContext = createContext(null)

const initialState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,   // true while we verify the existing session cookie
}

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { isAuthenticated: true, user: action.payload, isLoading: false }
    case 'LOGOUT':
      return { isAuthenticated: false, user: null, isLoading: false }
    case 'INIT_DONE':
      return { ...state, isLoading: false }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Restore session on page load only when a prior login is recorded in localStorage.
  // If the HTTP-only cookie is still valid the backend returns the current user;
  // otherwise we clear the flag and mark loading as done.
  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      dispatch({ type: 'INIT_DONE' })
      return
    }

    getCurrentUser()
      .then(res => dispatch({ type: 'LOGIN', payload: res.data.data }))
      .catch(() => {
        localStorage.removeItem('isLoggedIn')
        dispatch({ type: 'INIT_DONE' })
      })
  }, [])

  const login = (userData) => {
    localStorage.setItem('isLoggedIn', 'true')
    dispatch({ type: 'LOGIN', payload: userData })
  }

  const logout = () => {
    localStorage.removeItem('isLoggedIn')
    dispatch({ type: 'LOGOUT' })
  }

  return createElement(AuthContext.Provider, { value: { ...state, login, logout } }, children)
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
