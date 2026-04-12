import { createContext, useContext, useReducer, useEffect, createElement } from 'react'
import { getCurrentUser } from '../api/auth'

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

  // Restore session on every page load — if the HTTP-only cookie is still valid
  // the backend returns the current user; otherwise we just mark loading as done.
  useEffect(() => {
    getCurrentUser()
      .then(res => dispatch({ type: 'LOGIN', payload: res.data.data }))
      .catch(() => dispatch({ type: 'INIT_DONE' }))
  }, [])

  const login  = (userData) => dispatch({ type: 'LOGIN',  payload: userData });
  const logout = () => dispatch({ type: 'LOGOUT' })

  return createElement(AuthContext.Provider, { value: { ...state, login, logout } }, children)
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
