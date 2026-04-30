import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import VideoCard from '../components/VideoCard';
import { getChannel } from '../api/channel';
import { getAllVideos } from '../api/videos';


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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{channel.fullName}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            @{channel.username} &nbsp;·&nbsp; {formatSubs(channel.subscribersCount)} subscribers &nbsp;·&nbsp; {channel.totalVideos} videos
          </p>
        </div>
        <button
          onClick={() => setSubscribed((s) => !s)}
          className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-colors ${
            subscribed
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'
              : 'bg-gray-900 text-white hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white'
          }`}
        >
          {subscribed ? 'Subscribed' : 'Subscribe'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200 dark:border-gray-700 mt-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-gray-900 text-gray-900 dark:border-white dark:text-white'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
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
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Description</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{channel.bio}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Stats</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Joined {new Date(channel.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{formatSubs(channel.subscribersCount)} subscribers</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{channel.totalVideos} videos</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
