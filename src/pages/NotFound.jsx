import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <p className="text-8xl font-extrabold text-gray-200 select-none">404</p>
      <h1 className="text-2xl font-bold text-gray-800 mt-4">Page not found</h1>
      <p className="text-gray-500 mt-2 text-center">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-8 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold text-sm hover:shadow-lg hover:scale-105 transition-all duration-200"
      >
        Back to Home
      </Link>
    </div>
  )
}

export default NotFound
