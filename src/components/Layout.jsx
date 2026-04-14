import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const Layout = () => {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/20 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 min-h-screen transition-colors">
      <Navbar />
      <div className="flex pt-14">
        <Sidebar />
        <main className="flex-1 ml-56 p-6 min-h-[calc(100vh-56px)]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
