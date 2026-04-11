import React from 'react'
import { Link } from 'react-router-dom'

const Logo = ({ className = '' }) => {
  return (
    <Link
      to="/"
      className={`text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity ${className}`}
    >
      VidTube
    </Link>
  )
}

export default Logo
