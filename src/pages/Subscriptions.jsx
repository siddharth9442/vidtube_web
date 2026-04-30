import { Link } from 'react-router-dom'
import VideoCard from '../components/VideoCard'
import { useAuth } from '../store/store'

const MOCK_CHANNELS = [
  { _id: 'u1', username: 'reactdev', videos: 24, color: 'from-violet-400 to-purple-600' },
  { _id: 'u2', username: 'cssmaster', videos: 18, color: 'from-sky-400 to-indigo-500' },
  { _id: 'u3', username: 'backendpro', videos: 31, color: 'from-emerald-400 to-teal-600' },
  { _id: 'u5', username: 'designcodes', videos: 12, color: 'from-fuchsia-400 to-pink-600' },
  { _id: 'u6', username: 'statewizard', videos: 9, color: 'from-amber-400 to-orange-500' },
]

const MOCK_FEED = [
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
    _id: '2',
    title: 'Tailwind CSS Crash Course 2024 — Build Anything Fast',
    thumbnail: null,
    owner: { _id: 'u2', username: 'cssmaster' },
    views: 128000,
    duration: '28:12',
    createdAt: new Date(Date.now() - 5 * 86_400_000).toISOString(),
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
    _id: '5',
    title: 'Building a Full-Stack App with React + Node in 1 Hour',
    thumbnail: null,
    owner: { _id: 'u1', username: 'reactdev' },
    views: 210000,
    duration: '58:22',
    createdAt: new Date(Date.now() - 30 * 86_400_000).toISOString(),
  },
]

const Subscriptions = () => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-100 to-purple-200 flex items-center justify-center mb-6 shadow-md">
          <svg className="w-10 h-10 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.845v6.31a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Sign in to see subscriptions</h2>
        <p className="text-gray-500 text-sm mb-6 max-w-xs">
          Videos from channels you subscribe to will appear here.
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
      <div className="relative rounded-2xl overflow-hidden mb-8 p-7 bg-gradient-to-r from-teal-100 via-cyan-50 to-sky-100 dark:from-teal-900/40 dark:via-cyan-900/30 dark:to-sky-900/40 border border-cyan-100/80 dark:border-cyan-800/40">
        <div className="absolute -top-8 -right-8 w-52 h-52 rounded-full bg-teal-200/50 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-6 left-6 w-36 h-36 rounded-full bg-sky-200/40 blur-2xl pointer-events-none" />

        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              Subscriptions
              <span className="text-2xl">📺</span>
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Latest videos from channels you follow
            </p>
          </div>

          <div className="flex gap-3">
            {[
              { value: '5', label: 'Channels', color: 'text-teal-600' },
              { value: '94', label: 'Videos', color: 'text-cyan-600' },
              { value: '6', label: 'New', color: 'text-sky-600' },
            ].map(({ value, label, color }) => (
              <div key={label} className="bg-white/80 backdrop-blur-sm rounded-xl px-5 py-3 text-center shadow-sm border border-white">
                <p className={`text-xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Channel Avatars Row */}
      <div className="mb-7">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-teal-500 to-cyan-500" />
          <h2 className="text-base font-semibold text-gray-600 dark:text-gray-400">Channels</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {MOCK_CHANNELS.map((channel) => (
            <Link
              key={channel._id}
              to={`/channel/${channel._id}`}
              className="flex flex-col items-center gap-2 shrink-0 group"
            >
              <div
                className={`w-14 h-14 rounded-full bg-gradient-to-br ${channel.color} flex items-center justify-center text-white text-lg font-bold shadow-md group-hover:scale-105 transition-transform duration-200`}
              >
                {channel.username[0].toUpperCase()}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium text-center w-16 truncate group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                {channel.username}
              </span>
              <span className="text-[10px] text-gray-400">{channel.videos} videos</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Section Heading */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-5 rounded-full bg-gradient-to-b from-teal-500 to-cyan-500" />
        <h2 className="text-base font-semibold text-gray-600 dark:text-gray-400">Latest uploads</h2>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {MOCK_FEED.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  )
}

export default Subscriptions
