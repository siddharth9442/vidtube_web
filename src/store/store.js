import { createContext, useContext, useReducer, createElement } from 'react'

const AuthContext = createContext(null)

const initialState = {
  isAuthenticated: false,
  user: null,
}

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { isAuthenticated: true, user: action.payload }
    case 'LOGOUT':
      return { isAuthenticated: false, user: null }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const login = (userData) => dispatch({ type: 'LOGIN', payload: userData })
  const logout = () => dispatch({ type: 'LOGOUT' })

  return createElement(AuthContext.Provider, { value: { ...state, login, logout } }, children)
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
