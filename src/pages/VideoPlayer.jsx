import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import VideoCard from '../components/VideoCard'
import { getVideoById, getAllVideos } from '../api/videos'

const formatViews = (n) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return String(n)
}

const VideoPlayer = () => {
  const { videoId } = useParams()
  const [video, setVideo] = useState(null)
  const [relatedVideos, setRelatedVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [liked, setLiked] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [descExpanded, setDescExpanded] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [videoRes, allRes] = await Promise.all([
          getVideoById(videoId, controller.signal),
          getAllVideos({}, controller.signal),
        ])

        setVideo(videoRes.data?.data ?? null)

        const docs = allRes.data?.data?.docs ?? []
        setRelatedVideos(docs.filter((v) => v._id !== videoId))
      } catch (err) {
        if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
          setError(err.response?.data?.message || 'Failed to load video.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    return () => controller.abort()
  }, [videoId])

  if (loading) {
    return (
      <div className="flex gap-6 max-w-[1400px] animate-pulse">
        <div className="flex-1 min-w-0">
          <div className="aspect-video bg-gray-200 rounded-xl" />
          <div className="h-6 bg-gray-200 rounded mt-4 w-3/4" />
          <div className="flex gap-3 mt-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
          <div className="mt-4 bg-gray-100 rounded-xl p-4 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-1/4" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-5/6" />
          </div>
        </div>
        <div className="w-96 shrink-0 hidden lg:flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-2xl h-24" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-700 dark:text-gray-300 font-medium text-sm">{error || 'Video not found.'}</p>
        <Link
          to="/"
          className="mt-4 px-5 py-2 rounded-full border border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Go home
        </Link>
      </div>
    )
  }

  // owner may be a populated object or just an ID string
  const owner = video.owner && typeof video.owner === 'object'
    ? video.owner
    : { _id: video.owner, username: 'Unknown' }

  return (
    <div className="flex gap-6 max-w-[1400px]">
      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Video Player */}
        <div className="aspect-video bg-black rounded-xl overflow-hidden">
          <video
            src={video.videoFile}
            poster={video.thumbnail}
            controls
            className="w-full h-full"
          />
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold mt-4 text-gray-900 dark:text-white">{video.title}</h1>

        {/* Channel info + actions */}
        <div className="flex items-center justify-between mt-4 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Link
              to={`/channel/${owner._id}`}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm hover:opacity-80 transition-opacity"
            >
              {owner.username[0].toUpperCase()}
            </Link>
            <div>
              <Link
                to={`/channel/${owner._id}`}
                className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {owner.username}
              </Link>
              {owner.subscribers != null && (
                <p className="text-sm text-gray-500">
                  {formatViews(owner.subscribers)} subscribers
                </p>
              )}
            </div>
            <button
              onClick={() => setSubscribed((s) => !s)}
              className={`ml-3 px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                subscribed
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'
                  : 'bg-gray-900 text-white hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white'
              }`}
            >
              {subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLiked((l) => !l)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                liked ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <svg className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              {formatViews((video.likes ?? 0) + (liked ? 1 : 0))}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4 bg-gray-100 dark:bg-gray-800 rounded-xl p-4 text-sm">
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {formatViews(video.views)} views &nbsp;·&nbsp;{' '}
            {new Date(video.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className={`mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-line ${descExpanded ? '' : 'line-clamp-3'}`}>
            {video.description}
          </p>
          {video.description?.length > 150 && (
            <button
              onClick={() => setDescExpanded((e) => !e)}
              className="mt-2 text-xs font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {descExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      </div>

      {/* Sidebar — Related Videos */}
      {relatedVideos.length > 0 && (
        <div className="w-96 shrink-0 hidden lg:block">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Related Videos</h2>
          <div className="flex flex-col gap-4">
            {relatedVideos.map((v) => (
              <VideoCard key={v._id} video={v} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoPlayer
