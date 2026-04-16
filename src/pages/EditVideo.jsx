import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../store/store'
import { getVideoById, updateVideo } from '../api/videos'

const EditVideo = () => {
  const { videoId } = useParams()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [currentThumbnail, setCurrentThumbnail] = useState(null)
  const [isPublished, setIsPublished] = useState(true)
  const [thumbDragging, setThumbDragging] = useState(false)

  const [saving, setSaving] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const thumbInputRef = useRef(null)

  useEffect(() => {
    const controller = new AbortController()
    const fetchVideo = async () => {
      setLoading(true)
      setFetchError(null)
      try {
        const res = await getVideoById(videoId, controller.signal)
        const video = res.data?.data
        if (!video) throw new Error('Video not found')
        setTitle(video.title || '')
        setDescription(video.description || '')
        setCurrentThumbnail(video.thumbnail || null)
        setIsPublished(video.isPublished ?? true)
      } catch (err) {
        if (err.code === 'ERR_CANCELED' || err.name === 'CanceledError') return
        setFetchError(err.response?.data?.message || 'Failed to load video.')
      } finally {
        setLoading(false)
      }
    }
    fetchVideo()
    return () => controller.abort()
  }, [videoId])

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-100 to-purple-200 flex items-center justify-center mb-6 shadow-md">
          <svg className="w-10 h-10 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Sign in to edit videos</h2>
        <p className="text-gray-500 text-sm mb-6 max-w-xs">You need to be signed in to edit your videos.</p>
        <Link
          to="/login"
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-semibold shadow-md shadow-purple-200/60 hover:opacity-90 transition-opacity"
        >
          Sign In
        </Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-3xl space-y-6 animate-pulse">
        <div className="h-28 rounded-2xl bg-gray-100" />
        <div className="h-64 rounded-2xl bg-gray-100" />
        <div className="h-48 rounded-2xl bg-gray-100" />
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-700 font-medium mb-2">{fetchError}</p>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-violet-600 hover:underline"
        >
          Go back
        </button>
      </div>
    )
  }

  const handleThumbnailDrop = (e) => {
    e.preventDefault()
    setThumbDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setThumbnailFile(file)
      setThumbnailPreview(URL.createObjectURL(file))
    }
  }

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setThumbnailFile(file)
      setThumbnailPreview(URL.createObjectURL(file))
    }
  }

  const removeThumbnail = (e) => {
    e.stopPropagation()
    setThumbnailFile(null)
    setThumbnailPreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return setError('Please enter a title.')
    if (!description.trim()) return setError('Please enter a description.')

    setSaving(true)
    setError(null)
    setProgress(0)

    const formData = new FormData()
    formData.append('title', title.trim())
    formData.append('description', description.trim())
    formData.append('isPublished', isPublished)
    if (thumbnailFile) formData.append('thumbnail', thumbnailFile)

    try {
      await updateVideo(videoId, formData, (e) => {
        if (e.total) setProgress(Math.round((e.loaded * 100) / e.total))
      })
      setSuccess(true)
      setTimeout(() => navigate(`/video/${videoId}`), 1200)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save changes. Please try again.')
      setSaving(false)
      setProgress(0)
    }
  }

  const displayThumbnail = thumbnailPreview || currentThumbnail

  return (
    <div>
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-8 p-7 bg-gradient-to-r from-indigo-100 via-violet-50 to-purple-100 border border-purple-100/80">
        <div className="absolute -top-8 -right-8 w-52 h-52 rounded-full bg-indigo-200/50 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-6 left-6 w-36 h-36 rounded-full bg-violet-200/40 blur-2xl pointer-events-none" />
        <div className="relative flex items-center gap-4">
          <button
            onClick={() => navigate(`/video/${videoId}`)}
            className="w-9 h-9 rounded-full bg-white/70 flex items-center justify-center hover:bg-white transition-colors shadow-sm"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Edit Video</h1>
            <p className="text-gray-500 mt-0.5 text-sm">Update your video details</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">

        {/* Details Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-violet-500 to-purple-600" />
            Video Details
          </h2>

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your video a title"
              maxLength={100}
              disabled={saving}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all disabled:opacity-60"
            />
            <p className="text-right text-xs text-gray-400 mt-1">{title.length}/100</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell viewers about your video"
              maxLength={5000}
              rows={5}
              disabled={saving}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all resize-none disabled:opacity-60"
            />
            <p className="text-right text-xs text-gray-400 mt-1">{description.length}/5000</p>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Thumbnail
              <span className="ml-1.5 text-gray-400 font-normal">(optional — leave unchanged to keep current)</span>
            </label>
            <div
              onDragOver={(e) => { e.preventDefault(); setThumbDragging(true) }}
              onDragLeave={() => setThumbDragging(false)}
              onDrop={handleThumbnailDrop}
              onClick={() => !saving && thumbInputRef.current?.click()}
              className={`relative rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden max-w-xs ${
                saving
                  ? 'opacity-60 cursor-not-allowed'
                  : thumbDragging
                  ? 'border-violet-400 bg-violet-50 cursor-copy'
                  : 'border-gray-200 hover:border-violet-300 hover:bg-violet-50/30 cursor-pointer'
              }`}
              style={{ aspectRatio: '16/9' }}
            >
              <input
                ref={thumbInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleThumbnailChange}
              />
              {displayThumbnail ? (
                <>
                  <img
                    src={displayThumbnail}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                  />
                  {/* "Current" badge when showing existing thumbnail */}
                  {!thumbnailPreview && currentThumbnail && (
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/50 text-white text-xs font-medium">
                      Current
                    </div>
                  )}
                  {/* "New" badge + remove button when a new file is picked */}
                  {thumbnailPreview && (
                    <>
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-violet-600/80 text-white text-xs font-medium">
                        New
                      </div>
                      <button
                        type="button"
                        onClick={removeThumbnail}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </>
                  )}
                  {/* Click overlay hint */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                    <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded-full">
                      Click to replace
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-8 gap-2">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs text-gray-400 text-center px-4">
                    {thumbDragging ? 'Drop image here' : 'Click or drag to upload thumbnail'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Visibility Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-4">
            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-teal-500 to-emerald-500" />
            Visibility
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">
                {isPublished ? 'Published' : 'Private'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {isPublished
                  ? 'Your video is visible to everyone'
                  : 'Only you can see this video'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsPublished((v) => !v)}
              disabled={saving}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-60 ${
                isPublished ? 'bg-gradient-to-r from-teal-500 to-emerald-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                  isPublished ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-100 text-green-700 text-sm">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Changes saved! Redirecting to your video…
          </div>
        )}

        {/* Save Progress */}
        {saving && !success && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-medium text-gray-700">Saving changes…</p>
              </div>
              {thumbnailFile && (
                <span className="text-sm font-semibold text-violet-600">{progress}%</span>
              )}
            </div>
            {thumbnailFile && (
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 pb-8">
          <button
            type="submit"
            disabled={saving || success}
            className="flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-semibold shadow-md shadow-purple-200/60 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/video/${videoId}`)}
            disabled={saving}
            className="px-6 py-3 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditVideo
