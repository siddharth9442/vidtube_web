import React from 'react'
import { NavLink } from 'react-router-dom'

const navItems = [
  {
    to: '/',
    label: 'Home',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    to: '/trending',
    label: 'Trending',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    to: '/subscriptions',
    label: 'Subscriptions',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.845v6.31a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    to: '/library',
    label: 'Library',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
]

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-14 h-[calc(100vh-56px)] w-56 overflow-y-auto py-3">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            `flex items-center gap-4 px-4 py-2.5 mx-2 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
            }`
          }
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}

      <div className="mx-4 my-3 border-t border-gray-200 dark:border-gray-700" />

      <p className="px-6 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
        Explore
      </p>

      {[
        { label: 'JavaScript', emoji: '⚡' },
        { label: 'React', emoji: '⚛️' },
        { label: 'Design', emoji: '🎨' },
        { label: 'Gaming', emoji: '🎮' },
        { label: 'Music', emoji: '🎵' },
      ].map((cat) => (
        <button
          key={cat.label}
          className="flex items-center gap-4 w-full px-4 py-2.5 mx-2 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
          style={{ width: 'calc(100% - 16px)' }}
        >
          <span className="text-base">{cat.emoji}</span>
          <span>{cat.label}</span>
        </button>
      ))}
    </aside>
  )
}

export default Sidebar
