import { Link } from 'react-router-dom'
import VideoCard from '../components/VideoCard'
import { useAuth } from '../store/store'

const MOCK_HISTORY = [
  {
    _id: '5',
    title: 'Building a Full-Stack App with React + Node in 1 Hour',
    thumbnail: null,
    owner: { _id: 'u1', username: 'reactdev' },
    views: 210000,
    duration: '58:22',
    createdAt: new Date(Date.now() - 30 * 86_400_000).toISOString(),
  },
  {
    _id: '1',
    title: `Getting Started with React — A Complete Beginner's Guide`,
    thumbnail: null,
    owner: { _id: 'u1', username: 'reactdev' },
    views: 45200,
    duration: '12:34',
    createdAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
  },
  {
    _id: '4',
    title: 'JavaScript ES2024 Features You Need to Know',
    thumbnail: null,
    owner: { _id: 'u4', username: 'jsweekly' },
    views: 19500,
    duration: '8:47',
    createdAt: new Date(Date.now() - 1 * 86_400_000).toISOString(),
  },
  {
    _id: '2',
    title: 'Tailwind CSS Crash Course 2024 — Build Anything Fast',
    thumbnail: null,
    owner: { _id: 'u2', username: 'cssmaster' },
    views: 128000,
    duration: '28:12',
    createdAt: new Date(Date.now() - 5 * 86_400_000).toISOString(),
  },
]

const MOCK_LIKED = [
  {
    _id: '8',
    title: 'React State Management in 2024 — Context vs Zustand vs Redux',
    thumbnail: null,
    owner: { _id: 'u6', username: 'statewizard' },
    views: 62100,
    duration: '24:17',
    createdAt: new Date(Date.now() - 21 * 86_400_000).toISOString(),
  },
  {
    _id: '3',
    title: 'Node.js REST API Tutorial — Build a Full Backend',
    thumbnail: null,
    owner: { _id: 'u3', username: 'backendpro' },
    views: 73400,
    duration: '45:00',
    createdAt: new Date(Date.now() - 10 * 86_400_000).toISOString(),
  },
  {
    _id: '6',
    title: 'UI Design Fundamentals Every Developer Should Know',
    thumbnail: null,
    owner: { _id: 'u5', username: 'designcodes' },
    views: 34800,
    duration: '19:05',
    createdAt: new Date(Date.now() - 7 * 86_400_000).toISOString(),
  },
]

const MOCK_PLAYLISTS = [
  { _id: 'p1', name: 'React Learning Path', count: 12, color: 'from-violet-400 to-purple-600' },
  { _id: 'p2', name: 'CSS & Design', count: 7, color: 'from-sky-400 to-indigo-500' },
  { _id: 'p3', name: 'Backend Development', count: 9, color: 'from-emerald-400 to-teal-600' },
]

const SectionHeading = ({ color, title, linkTo, linkLabel }) => (
  <div className="flex items-center justify-between mb-5">
    <div className="flex items-center gap-3">
      <div className={`w-1 h-5 rounded-full bg-gradient-to-b ${color}`} />
      <h2 className="text-base font-semibold text-gray-600 dark:text-gray-400">{title}</h2>
    </div>
    {linkTo && (
      <Link to={linkTo} className="text-xs text-violet-500 font-medium hover:text-violet-700 transition-colors">
        {linkLabel}
      </Link>
    )}
  </div>
)

const Library = () => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-100 to-purple-200 flex items-center justify-center mb-6 shadow-md">
          <svg className="w-10 h-10 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Sign in to view your library</h2>
        <p className="text-gray-500 text-sm mb-6 max-w-xs">
          Your watch history, liked videos, and playlists will appear here.
        </p>
        <Link
          to="/login"
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-semibold shadow-md shadow-purple-200/60 hover:opacity-90 transition-opacity"
        >
          Sign In
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-8 p-7 bg-gradient-to-r from-violet-100 via-purple-50 to-indigo-100 dark:from-violet-900/40 dark:via-purple-900/30 dark:to-indigo-900/40 border border-purple-100/80 dark:border-purple-800/40">
        <div className="absolute -top-8 -right-8 w-52 h-52 rounded-full bg-violet-200/50 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-6 left-6 w-36 h-36 rounded-full bg-indigo-200/40 blur-2xl pointer-events-none" />

        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              Your Library
              <span className="text-2xl">📚</span>
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              History, liked videos, and playlists
            </p>
          </div>

          <div className="flex gap-3">
            {[
              { value: '4', label: 'Watched', color: 'text-violet-600' },
              { value: '3', label: 'Liked', color: 'text-purple-600' },
              { value: '3', label: 'Playlists', color: 'text-indigo-600' },
            ].map(({ value, label, color }) => (
              <div key={label} className="bg-white/80 backdrop-blur-sm rounded-xl px-5 py-3 text-center shadow-sm border border-white">
                <p className={`text-xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Playlists */}
      <SectionHeading
        color="from-violet-500 to-purple-600"
        title="Playlists"
        linkTo="#"
        linkLabel="View all"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {MOCK_PLAYLISTS.map((playlist) => (
          <div
            key={playlist._id}
            className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
          >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${playlist.color} flex items-center justify-center shrink-0 shadow-sm`}>
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate">{playlist.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{playlist.count} videos</p>
            </div>
            <svg className="w-4 h-4 text-gray-300 ml-auto shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        ))}

        {/* Create new playlist */}
        <button className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-600 hover:border-violet-300 hover:bg-violet-50 dark:hover:bg-gray-700 transition-all duration-200 group">
          <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-700 group-hover:bg-violet-100 dark:group-hover:bg-violet-900/40 flex items-center justify-center shrink-0 transition-colors">
            <svg className="w-6 h-6 text-gray-400 group-hover:text-violet-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-400 group-hover:text-violet-600 transition-colors">New playlist</span>
        </button>
      </div>

      {/* Watch History */}
      <SectionHeading
        color="from-indigo-500 to-violet-600"
        title="Watch History"
        linkTo="#"
        linkLabel="View all"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
        {MOCK_HISTORY.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>

      {/* Liked Videos */}
      <SectionHeading
        color="from-rose-500 to-pink-500"
        title="Liked Videos"
        linkTo="#"
        linkLabel="View all"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {MOCK_LIKED.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  )
}

export default Library
