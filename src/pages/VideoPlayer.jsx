import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import VideoCard from '../components/VideoCard'

const MOCK_VIDEO = {
  _id: '1',
  title: 'Getting Started with React — A Complete Beginner\'s Guide',
  description: `In this video we cover the absolute basics of React from scratch. You'll learn about components, props, state, and hooks. By the end you'll have a solid foundation to build modern web apps.

Topics covered:
• What is React and why use it
• JSX syntax
• Functional components
• useState and useEffect hooks
• Props and component communication
• Conditional rendering`,
  owner: { _id: 'u1', username: 'reactdev', subscribers: 12400 },
  views: 45200,
  likes: 3200,
  duration: '12:34',
  createdAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
}

const RELATED_VIDEOS = [
  {
    _id: '2',
    title: 'Tailwind CSS Crash Course 2024',
    thumbnail: null,
    owner: { _id: 'u2', username: 'cssmaster' },
    views: 128000,
    duration: '28:12',
    createdAt: new Date(Date.now() - 5 * 86_400_000).toISOString(),
  },
  {
    _id: '3',
    title: 'Node.js REST API Tutorial',
    thumbnail: null,
    owner: { _id: 'u3', username: 'backendpro' },
    views: 73400,
    duration: '45:00',
    createdAt: new Date(Date.now() - 10 * 86_400_000).toISOString(),
  },
  {
    _id: '4',
    title: 'JavaScript ES2024 Features',
    thumbnail: null,
    owner: { _id: 'u4', username: 'jsweekly' },
    views: 19500,
    duration: '8:47',
    createdAt: new Date(Date.now() - 1 * 86_400_000).toISOString(),
  },
  {
    _id: '5',
    title: 'Building a Full-Stack App with React + Node',
    thumbnail: null,
    owner: { _id: 'u1', username: 'reactdev' },
    views: 210000,
    duration: '58:22',
    createdAt: new Date(Date.now() - 30 * 86_400_000).toISOString(),
  },
]

const formatViews = (n) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return String(n)
}

const VideoPlayer = () => {
  const { videoId } = useParams()
  const [liked, setLiked] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [descExpanded, setDescExpanded] = useState(false)

  // In a real app you'd fetch the video by videoId from the API
  const video = MOCK_VIDEO

  return (
    <div className="flex gap-6 max-w-[1400px]">
      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Video Player */}
        <div className="aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
          <div className="text-center text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">Video player — connect your backend to stream video</p>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold mt-4 text-gray-900">{video.title}</h1>

        {/* Channel info + actions */}
        <div className="flex items-center justify-between mt-4 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Link
              to={`/channel/${video.owner._id}`}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm hover:opacity-80 transition-opacity"
            >
              {video.owner.username[0].toUpperCase()}
            </Link>
            <div>
              <Link
                to={`/channel/${video.owner._id}`}
                className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              >
                {video.owner.username}
              </Link>
              <p className="text-sm text-gray-500">
                {formatViews(video.owner.subscribers)} subscribers
              </p>
            </div>
            <button
              onClick={() => setSubscribed((s) => !s)}
              className={`ml-3 px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                subscribed
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-gray-900 text-white hover:bg-gray-700'
              }`}
            >
              {subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLiked((l) => !l)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                liked ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              {formatViews(video.likes + (liked ? 1 : 0))}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4 bg-gray-100 rounded-xl p-4 text-sm">
          <p className="font-medium text-gray-900">
            {formatViews(video.views)} views &nbsp;·&nbsp;{' '}
            {new Date(video.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p
            className={`mt-2 text-gray-700 whitespace-pre-line ${descExpanded ? '' : 'line-clamp-3'}`}
          >
            {video.description}
          </p>
          <button
            onClick={() => setDescExpanded((e) => !e)}
            className="mt-2 text-xs font-semibold text-gray-900 hover:text-blue-600 transition-colors"
          >
            {descExpanded ? 'Show less' : 'Show more'}
          </button>
        </div>
      </div>

      {/* Sidebar — Related Videos */}
      <div className="w-96 shrink-0 hidden lg:block">
        <h2 className="font-semibold text-gray-900 mb-4">Related Videos</h2>
        <div className="flex flex-col gap-4">
          {RELATED_VIDEOS.map((v) => (
            <VideoCard key={v._id} video={v} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer
