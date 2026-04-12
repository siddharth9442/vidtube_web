import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../store/store'

// The backend finishes OAuth and redirects to this route.
// AuthProvider already calls getCurrentUser() on mount to restore the session,
// so we just wait for that initialisation to finish and navigate accordingly.
const OAuthCallback = () => {
  const navigate = useNavigate()
  const { user, isLoading } = useAuth()
  console.log("user: ", user);
  console.log("isLoading: ", isLoading);
  
  useEffect(() => {
    if (isLoading) return
    if (user) {
      navigate('/', { replace: true })
    } else {
      navigate('/login?error=oauth_failed', { replace: true })
    }
  }, [isLoading, user])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50/30">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Signing you in…</p>
      </div>
    </div>
  )
}

export default OAuthCallback
