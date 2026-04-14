import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import VideoCard from '../components/VideoCard';
import { getChannel } from '../api/channel';
import { getAllVideos } from '../api/videos';

const MOCK_CHANNEL = {
  _id: 'u1',
  username: 'reactdev',
  fullName: 'React Developer',
  bio: 'Sharing everything I know about modern web development. React, Node.js, and beyond.',
  subscribers: 12400,
  totalVideos: 24,
  joinedAt: '2022-03-15',
}

const MOCK_VIDEOS = [
  {
    _id: '1',
    title: 'Getting Started with React — A Complete Beginner\'s Guide',
    thumbnail: null,
    owner: { _id: 'u1', username: 'reactdev' },
    views: 45200,
    duration: '12:34',
    createdAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
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
  {
    _id: '9',
    title: 'React Hooks Explained — useState, useEffect, useContext',
    thumbnail: null,
    owner: { _id: 'u1', username: 'reactdev' },
    views: 87600,
    duration: '22:10',
    createdAt: new Date(Date.now() - 60 * 86_400_000).toISOString(),
  },
  {
    _id: '10',
    title: 'Advanced React Patterns — HOCs, Render Props, Compound Components',
    thumbnail: null,
    owner: { _id: 'u1', username: 'reactdev' },
    views: 31200,
    duration: '35:48',
    createdAt: new Date(Date.now() - 90 * 86_400_000).toISOString(),
  },
]

const formatSubs = (n) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

const TABS = ['Videos', 'About']

const Profile = () => {
  const { channelId } = useParams(); // get channelId from params
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('Videos')
  const [subscribed, setSubscribed] = useState(false)
  const [channel, setChannel] = useState({});
  const [error, setError] = useState(null);

  console.log("inside profile", channelId);
  useEffect(() => {
    const controller = new AbortController();

    const fetchVideos = async () => {
      setError(null);
      try {
        setLoading(true);
        let payload = { skip: 0, limit: 10, userId: channelId }
        const res = await getAllVideos(payload, controller.signal);

        const videos = res.data?.data?.videos ?? [];
        setVideos(Array.isArray(videos) ? videos : []);
      } catch (error) {
        if (error.name !== 'CanceledError' && error.code !== 'ERR_CANCELED') {
          setError(error.response?.data?.message || 'Failed to load videos.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
    return () => controller.abort();
  }, [channelId]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    const getChannelDetails = async () => {
      try {
        const res = await getChannel(channelId, controller.signal);

        const data = res?.data?.data;
        setChannel(data ? data : {});
      } catch (error) {
        if (error.name !== 'CanceledError' && error.code !== 'ERR_CANCELED') {
          setError(error.response?.data?.message || 'Failed to load videos.');
        }
      } finally {
        setLoading(false);
      }
    }

    getChannelDetails();
    return () =>  controller.abort()
  }, [])

  console.log("videos: ", videos);
  console.log("channel: ", channel);

  return (
    <div className="max-w-5xl">
      {/* Banner */}
      <div className="h-36 rounded-xl bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500" />

      {/* Channel Header */}
      <div className="flex items-end gap-5 mt-4 flex-wrap">
        <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white -mt-12 shrink-0">
          {channel?.avatar ? (
            <img
              src={channel.avatar}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-500 font-bold">
              {channel?.username?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 pb-1">
          <h1 className="text-2xl font-bold text-gray-900">{channel.fullName}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            @{channel.username} &nbsp;·&nbsp; {formatSubs(channel.subscribersCount)} subscribers &nbsp;·&nbsp; {channel.totalVideos} videos
          </p>
        </div>
        <button
          onClick={() => setSubscribed((s) => !s)}
          className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-colors ${
            subscribed
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              : 'bg-gray-900 text-white hover:bg-gray-700'
          }`}
        >
          {subscribed ? 'Subscribed' : 'Subscribe'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200 mt-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'Videos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}

        {activeTab === 'About' && (
          <div className="max-w-lg space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Description</h3>
              <p className="text-gray-600 text-sm">{channel.bio}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Stats</h3>
              <p className="text-gray-600 text-sm">Joined {new Date(channel.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
              <p className="text-gray-600 text-sm">{formatSubs(channel.subscribersCount)} subscribers</p>
              <p className="text-gray-600 text-sm">{channel.totalVideos} videos</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
