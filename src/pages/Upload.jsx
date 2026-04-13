import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../store/store'

const Upload = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [videoFile, setVideoFile] = useState(null)
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [videoDragging, setVideoDragging] = useState(false)
  const [thumbDragging, setThumbDragging] = useState(false)

  const videoInputRef = useRef(null)
  const thumbInputRef = useRef(null)

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-100 to-purple-200 flex items-center justify-center mb-6 shadow-md">
          <svg className="w-10 h-10 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Sign in to upload videos</h2>
        <p className="text-gray-500 text-sm mb-6 max-w-xs">
          You need to be signed in to upload and publish videos.
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

  const handleVideoDrop = (e) => {
    e.preventDefault()
    setVideoDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file)
      setError(null)
    }
  }

  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setVideoFile(file)
      setError(null)
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!videoFile) return setError('Please select a video file.')
    if (!thumbnailFile) return setError('Please select a thumbnail image.')
    if (!title.trim()) return setError('Please enter a title.')
    if (!description.trim()) return setError('Please enter a description.')

    setUploading(true)
    setError(null)
    setProgress(0)

    const formData = new FormData()
    formData.append('videoFile', videoFile)
    formData.append('thumbnail', thumbnailFile)
    formData.append('title', title.trim())
    formData.append('description', description.trim())

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/v1/videos/upload-video`,
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            if (e.total) setProgress(Math.round((e.loaded * 100) / e.total))
          },
        }
      )
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.')
      setUploading(false)
      setProgress(0)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }

  return (
    <div>
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-8 p-7 bg-gradient-to-r from-violet-100 via-purple-50 to-indigo-100 border border-purple-100/80">
        <div className="absolute -top-8 -right-8 w-52 h-52 rounded-full bg-violet-200/50 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-6 left-6 w-36 h-36 rounded-full bg-indigo-200/40 blur-2xl pointer-events-none" />
        <div className="relative">
          <h1 className="text-2xl font-bold text-gray-800">Upload Video</h1>
          <p className="text-gray-500 mt-1 text-sm">Share your content with the world</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">

        {/* Video Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setVideoDragging(true) }}
          onDragLeave={() => setVideoDragging(false)}
          onDrop={handleVideoDrop}
          onClick={() => !videoFile && videoInputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 ${
            videoFile
              ? 'border-violet-300 bg-violet-50/50 cursor-default'
              : videoDragging
              ? 'border-violet-400 bg-violet-50 scale-[1.01] cursor-copy'
              : 'border-gray-200 bg-white hover:border-violet-300 hover:bg-violet-50/30 cursor-pointer'
          }`}
        >
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleVideoChange}
          />

          {videoFile ? (
            <div className="flex items-center gap-4 p-5">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{videoFile.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{formatFileSize(videoFile.size)}</p>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setVideoFile(null) }}
                className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-200 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-base font-semibold text-gray-700 mb-1">
                {videoDragging ? 'Drop your video here' : 'Drag & drop your video'}
              </p>
              <p className="text-sm text-gray-400 mb-4">or click to browse files</p>
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity"
              >
                Select Video
              </button>
              <p className="text-xs text-gray-400 mt-4">MP4, MOV, AVI, MKV and more</p>
            </div>
          )}
        </div>

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
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
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
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all resize-none"
            />
            <p className="text-right text-xs text-gray-400 mt-1">{description.length}/5000</p>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Thumbnail <span className="text-rose-400">*</span>
            </label>
            <div
              onDragOver={(e) => { e.preventDefault(); setThumbDragging(true) }}
              onDragLeave={() => setThumbDragging(false)}
              onDrop={handleThumbnailDrop}
              onClick={() => thumbInputRef.current?.click()}
              className={`relative rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden cursor-pointer max-w-xs ${
                thumbDragging
                  ? 'border-violet-400 bg-violet-50'
                  : 'border-gray-200 hover:border-violet-300 hover:bg-violet-50/30'
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
              {thumbnailPreview ? (
                <>
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setThumbnailFile(null)
                      setThumbnailPreview(null)
                    }}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-8 gap-2">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs text-gray-400 text-center px-4">
                    {thumbDragging ? 'Drop image here' : 'Click or drag an image'}
                  </p>
                </div>
              )}
            </div>
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

        {/* Upload Progress */}
        {uploading && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-medium text-gray-700">Uploading video…</p>
              </div>
              <span className="text-sm font-semibold text-violet-600">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {progress < 100 ? 'Please keep this page open while uploading.' : 'Processing on server…'}
            </p>
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center gap-4 pb-8">
          <button
            type="submit"
            disabled={uploading}
            className="flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-semibold shadow-md shadow-purple-200/60 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            {uploading ? 'Uploading…' : 'Upload Video'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={uploading}
            className="px-6 py-3 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default Upload
