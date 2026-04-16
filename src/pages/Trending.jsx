import { useState } from 'react'
import VideoCard from '../components/VideoCard'

const TIME_FILTERS = ['Today', 'This Week', 'This Month']

const MOCK_TRENDING = [
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
    _id: '2',
    title: 'Tailwind CSS Crash Course 2024 — Build Anything Fast',
    thumbnail: null,
    owner: { _id: 'u2', username: 'cssmaster' },
    views: 128000,
    duration: '28:12',
    createdAt: new Date(Date.now() - 5 * 86_400_000).toISOString(),
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
    _id: '1',
    title: `Getting Started with React — A Complete Beginner's Guide`,
    thumbnail: null,
    owner: { _id: 'u1', username: 'reactdev' },
    views: 45200,
    duration: '12:34',
    createdAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
  },
  {
    _id: '7',
    title: 'MongoDB Aggregation Pipelines — Deep Dive',
    thumbnail: null,
    owner: { _id: 'u3', username: 'backendpro' },
    views: 8900,
    duration: '33:41',
    createdAt: new Date(Date.now() - 14 * 86_400_000).toISOString(),
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
]

const RANK_STYLES = [
  'text-amber-400',   // #1
  'text-gray-400',    // #2
  'text-orange-400',  // #3
]

const Trending = () => {
  const [activeFilter, setActiveFilter] = useState('Today')

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-8 p-7 bg-gradient-to-r from-orange-100 via-rose-50 to-pink-100 border border-rose-100/80">
        <div className="absolute -top-8 -right-8 w-52 h-52 rounded-full bg-orange-200/50 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-6 left-6 w-36 h-36 rounded-full bg-rose-200/40 blur-2xl pointer-events-none" />

        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              Trending Now
              <span className="text-2xl">🔥</span>
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              The most-watched videos right now
            </p>
          </div>

          <div className="flex gap-3">
            {[
              { value: '8', label: 'Videos', color: 'text-orange-500' },
              { value: '940K', label: 'Views', color: 'text-rose-500' },
              { value: '#1', label: 'Chart', color: 'text-pink-500' },
            ].map(({ value, label, color }) => (
              <div key={label} className="bg-white/80 backdrop-blur-sm rounded-xl px-5 py-3 text-center shadow-sm border border-white">
                <p className={`text-xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time Filter Pills */}
      <div className="flex gap-2 pb-3">
        {TIME_FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              activeFilter === filter
                ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md shadow-orange-200/60'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Section Heading */}
      <div className="flex items-center gap-3 mt-7 mb-5">
        <div className="w-1 h-5 rounded-full bg-gradient-to-b from-orange-500 to-rose-500" />
        <h2 className="text-base font-semibold text-gray-600">Top Videos</h2>
      </div>

      {/* Ranked Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {MOCK_TRENDING.map((video, index) => (
          <div key={video._id} className="relative">
            {/* Rank badge */}
            <div
              className={`absolute -top-2 -left-2 z-10 w-8 h-8 rounded-full bg-white border-2 flex items-center justify-center text-sm font-black shadow-md ${
                RANK_STYLES[index] ?? 'text-gray-300'
              } border-current`}
            >
              {index + 1}
            </div>
            <VideoCard video={video} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Trending
