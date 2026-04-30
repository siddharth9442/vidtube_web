import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../store/store'
import { loginUser } from '../api/auth'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [searchParams] = useSearchParams()

  const [email,   setEmail]   = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(
    searchParams.get('error') === 'oauth_failed'
      ? 'Google sign-in failed. Please try again.'
      : ''
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await loginUser({ email, password });

      login(res.data.data.user);
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message ?? 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left — Brand Panel ── */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex-col justify-between p-12 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/10" />
        <div className="absolute top-1/3 -right-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-24 -right-12 w-96 h-96 rounded-full bg-indigo-800/40" />
        <div className="absolute bottom-1/4 left-12 w-32 h-32 rounded-full bg-purple-400/20 blur-xl" />

        {/* Logo */}
        <div className="relative z-10">
          <span className="text-3xl font-extrabold text-white tracking-tight">VidTube</span>
        </div>

        {/* Main copy */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-white leading-snug">
              Your world of<br />videos awaits.
            </h2>
            <p className="mt-3 text-purple-200 text-base leading-relaxed">
              Discover, watch, and connect<br />with creators you love.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { icon: '🎬', text: 'Millions of videos at your fingertips' },
              { icon: '🌟', text: 'Support your favourite creators' },
              { icon: '🔔', text: 'Never miss a new upload' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-base shrink-0">
                  {icon}
                </span>
                <span className="text-purple-100 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-purple-400 text-xs relative z-10">© 2025 VidTube. All rights reserved.</p>
      </div>

      {/* ── Right — Form Panel ── */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50/30 dark:from-gray-900 dark:to-gray-800 px-6 py-12">
        <div className="w-full max-w-md">

          {/* Mobile-only logo */}
          <div className="lg:hidden text-center mb-8">
            <span className="text-3xl font-extrabold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              VidTube
            </span>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back! 👋</h1>
              <p className="text-gray-400 text-sm mt-1">Sign in to your account to continue</p>
            </div>

            {error && (
              <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-xl">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900/40 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                  <span className="text-xs text-violet-600 hover:text-purple-600 font-medium cursor-pointer transition-colors">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-11 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900/40 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPwd ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl shadow-md shadow-violet-200 hover:shadow-lg hover:shadow-violet-300 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium tracking-wide">OR CONTINUE WITH</span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
              </div>

              {/* Google */}
              <button
                type="button"
                onClick={() => window.location.href = `${import.meta.env.VITE_API_BASE_URL}/v1/users/auth/google`}
                className="w-full flex items-center justify-center gap-3 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-300 shadow-sm transition-all duration-200"
              >
                <svg viewBox="0 0 48 48" className="w-5 h-5 shrink-0">
                  <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.4 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.8-8.9 19.8-20 0-1.3-.1-2.5-.2-3.5z" />
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.4 6.5 29.5 4 24 4c-7.7 0-14.3 4.4-17.7 10.7z" />
                  <path fill="#4CAF50" d="M24 44c5.1 0 9.8-2 13.3-5.2l-6.1-5c-2 1.5-4.5 2.2-7.2 2.2-5.2 0-9.6-3.3-11.2-8l-6.5 5C9.6 39.7 16.3 44 24 44z" />
                  <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.3 5.4-6.1 6.8l6.1 5C39.9 36.4 43.8 30.7 43.8 24c0-1.3-.1-2.5-.2-3.5z" />
                </svg>
                Continue with Google
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-semibold text-violet-600 hover:text-purple-600 transition-colors">
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Login
