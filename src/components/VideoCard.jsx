import { Link } from 'react-router-dom'

// Each video gets a unique soft gradient thumbnail
const THUMB_GRADIENTS = [
  'from-violet-400 to-purple-600',
  'from-rose-400 to-pink-500',
  'from-sky-400 to-indigo-500',
  'from-amber-400 to-orange-500',
  'from-teal-400 to-cyan-500',
  'from-emerald-400 to-teal-600',
  'from-fuchsia-400 to-pink-600',
  'from-blue-400 to-sky-600',
]

const getGradient = (id = '') =>
  THUMB_GRADIENTS[
    id.split('').reduce((sum, c) => sum + c.charCodeAt(0), 0) % THUMB_GRADIENTS.length
  ]

const formatViews = (n) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return String(n)
}

const formatDate = (dateStr) => {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000)
  if (days === 0) return 'Today'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

const VideoCard = ({ video }) => {
  const { _id, thumbnail, title, owner, views = 0, duration, createdAt } = video
  const gradient = getGradient(_id)

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100/80">
      <Link to={`/video/${_id}`} className="block">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
              {/* Play icon — fades in on hover */}
              <div className="w-12 h-12 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}

          {/* Duration badge */}
          {duration && (
            <span className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-md font-medium">
              {duration}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex gap-3 p-3">
          <Link
            to={`/channel/${owner?._id || '#'}`}
            onClick={(e) => e.stopPropagation()}
            className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} shrink-0 flex items-center justify-center text-white text-sm font-bold hover:opacity-80 transition-opacity shadow-sm`}
          >
            {owner?.username?.[0]?.toUpperCase() || 'U'}
          </Link>

          <div className="min-w-0">
            <h3 className="font-semibold text-sm line-clamp-2 leading-snug text-gray-800 group-hover:text-violet-600 transition-colors duration-200">
              {title}
            </h3>
            <p className="text-gray-400 text-xs mt-1 font-medium">{owner?.username || 'Unknown'}</p>
            <p className="text-gray-400 text-xs">
              {formatViews(views)} views
              {createdAt ? ` · ${formatDate(createdAt)}` : ''}
            </p>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default VideoCard
