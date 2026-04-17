import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = [
  { to: '/dashboard', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/cases', label: 'Cases' },
  { to: '/add-case', label: 'Add Case' },
  { to: '/analytics', label: 'Analytics' },
]

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <header className="bg-gov-navy text-white">
        {/* Top strip */}
        <div className="bg-gov-gold text-gov-navy text-xs text-center py-1 font-semibold tracking-wider">
          GOVERNMENT OF INDIA — MINISTRY OF LAW AND JUSTICE
        </div>

        {/* Main header */}
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Emblem placeholder */}
            <div className="w-12 h-12 bg-gov-gold rounded-full flex items-center justify-center text-gov-navy font-bold text-lg select-none">
              ⚖
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight leading-tight">
                Court Case Prioritization System
              </h1>
              <p className="text-blue-200 text-xs mt-0.5">
                AI-Powered Judicial Backlog Management • v1.0
              </p>
            </div>
          </div>

          {user && (
            <div className="text-right text-sm">
              <p className="text-blue-100 font-medium">{user.name}</p>
              <span className="text-xs bg-gov-gold text-gov-navy px-2 py-0.5 rounded-full font-semibold">
                {user.role}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* ── NAVBAR ─────────────────────────────────────────────────── */}
      <nav className="bg-gov-blue shadow-md">
        <div className="max-w-screen-xl mx-auto px-6 flex items-center justify-between">
          <div className="flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `px-5 py-3 text-sm font-medium transition-colors duration-150 border-b-2 ${
                    isActive
                      ? 'border-gov-gold text-white bg-gov-navy'
                      : 'border-transparent text-blue-100 hover:text-white hover:bg-blue-700'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="text-sm text-blue-200 hover:text-white px-4 py-3 transition-colors duration-150 border-b-2 border-transparent hover:border-red-400"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* ── PAGE CONTENT ───────────────────────────────────────────── */}
      <main className="flex-1 max-w-screen-xl mx-auto w-full px-6 py-6">
        {children}
      </main>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="bg-gov-navy text-blue-200 text-xs py-4 mt-4">
        <div className="max-w-screen-xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p>Content owned by the <strong className="text-white">Judicial Department</strong>. Last updated: {new Date().getFullYear()}.</p>
          <div className="flex gap-4">
            {['Contact', 'Help', 'Disclaimer', 'Privacy Policy'].map((item) => (
              <a key={item} href="#" className="hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
