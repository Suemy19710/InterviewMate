import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { FileSearch, FileText } from 'lucide-react'

const MainLayout = () => {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              InterviewMate
            </h1>
            <div className="flex gap-4 ">
              <Link
                to="/"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg  ${
                  isActive('/')
                    ? 'bg-gray-200 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FileSearch size={20} />
                Bulk Matcher
              </Link>
              <Link
                to="/single-match"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isActive('/single-match')
                    ? 'bg-gray-200 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FileText size={20} />
                Single Match
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <Outlet />
    </div>
  )
}

export default MainLayout