import { useState, useEffect } from 'react'
import VideoCard from '../components/VideoCard'
import { getAllVideos } from '../api/videos'
import { useAuth } from '../store/store'

const CATEGORIES = [
  { label: 'All' },
  { label: 'JavaScript', emoji: '⚡' },
  { label: 'React', emoji: '⚛️' },
  { label: 'Tailwind CSS', emoji: '🎨' },
  { label: 'Node.js', emoji: '🟢' },
  { label: 'Python', emoji: '🐍' },
  { label: 'Design', emoji: '✏️' },
  { label: 'Gaming', emoji: '🎮' },
  { label: 'Music', emoji: '🎵' },
]

const VideoCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100/80 dark:border-gray-700 animate-pulse">
    <div className="aspect-video bg-gray-100" />
    <div className="flex gap-3 p-3">
      <div className="w-9 h-9 rounded-full bg-gray-100 shrink-0" />
      <div className="flex-1 space-y-2 py-0.5">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-3/4" />
        <div className="h-2.5 bg-gray-100 rounded w-1/2 mt-1" />
      </div>
    </div>
  </div>
)

const Home = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [activeCategory, setActiveCategory] = useState('All');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return

    const controller = new AbortController()
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAllVideos(controller.signal);
        const data = res.data?.data?.videos ?? [];
        setVideos(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
          setError(err.response?.data?.message || 'Failed to load videos.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchVideos()
    return () => controller.abort()
  }, [isAuthenticated, authLoading])

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-8 p-7 bg-gradient-to-r from-violet-100 via-purple-50 to-indigo-100 dark:from-violet-900/40 dark:via-purple-900/30 dark:to-indigo-900/40 border border-purple-100/80 dark:border-purple-800/40">
        {/* Decorative blobs */}
        <div className="absolute -top-8 -right-8 w-52 h-52 rounded-full bg-purple-200/50 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-6 left-6 w-36 h-36 rounded-full bg-indigo-200/40 blur-2xl pointer-events-none" />

        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Explore &amp; Discover ✨
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Trending videos from creators you&apos;ll love
            </p>
          </div>

          <div className="flex gap-3">
            {[
              { value: '2.4K', label: 'Videos', color: 'text-violet-600' },
              { value: '18K', label: 'Creators', color: 'text-purple-600' },
              { value: '940K', label: 'Viewers', color: 'text-indigo-600' },
            ].map(({ value, label, color }) => (
              <div key={label} className="bg-white/80 backdrop-blur-sm rounded-xl px-5 py-3 text-center shadow-sm border border-white">
                <p className={`text-xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-hide">
        {CATEGORIES.map(({ label, emoji }) => (
          <button
            key={label}
            onClick={() => setActiveCategory(label)}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === label
                ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md shadow-purple-200/60'
                : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-gray-600 dark:hover:text-purple-300'
            }`}
          >
            {emoji && <span>{emoji}</span>}
            {label}
          </button>
        ))}
      </div>

      {/* Section heading */}
      <div className="flex items-center gap-3 mt-7 mb-5">
        <div className="w-1 h-5 rounded-full bg-gradient-to-b from-violet-500 to-purple-600" />
        <h2 className="text-base font-semibold text-gray-600 dark:text-gray-400">Recommended for you</h2>
      </div>

      {/* Error state */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-700 dark:text-gray-300 font-medium text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-5 py-2 rounded-full border border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Try again
          </button>
        </div>
      )}

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <VideoCardSkeleton key={i} />)
          : videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))
        }
      </div>

      {/* Empty state */}
      {!loading && !error && videos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-100 to-purple-200 flex items-center justify-center mb-6 shadow-md">
            <svg className="w-10 h-10 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">No videos yet</h2>
          <p className="text-gray-400 text-sm">Be the first to upload a video!</p>
        </div>
      )}
    </div>
  )
}

export default Home
