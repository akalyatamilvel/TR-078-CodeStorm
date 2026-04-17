import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../types'

const LoginPage: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<UserRole>('Judge')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Email and password are required.')
      return
    }

    if (mode === 'register' && password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    // Simulate async auth (replace with real auth service as needed)
    await new Promise((r) => setTimeout(r, 600))
    login(email, password, role)
    setLoading(false)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gov-navy flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="text-[20rem] text-white select-none absolute -right-20 -top-10 leading-none">⚖</div>
      </div>

      {/* Top brand strip */}
      <div className="mb-6 text-center z-10">
        <div className="w-16 h-16 bg-gov-gold rounded-full flex items-center justify-center text-gov-navy text-3xl mx-auto mb-3">
          ⚖
        </div>
        <h1 className="text-white text-2xl font-bold tracking-tight">
          Court Case Prioritization System
        </h1>
        <p className="text-blue-200 text-sm mt-1">Ministry of Law and Justice — India</p>
      </div>

      {/* Card */}
      <div className="z-10 w-full max-w-md bg-white rounded-sm shadow-2xl overflow-hidden">
        {/* Card header */}
        <div className="bg-gov-blue py-4 px-6 flex gap-1">
          {(['login', 'register'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError('') }}
              className={`flex-1 py-2 text-sm font-semibold rounded-sm transition-colors ${
                mode === m ? 'bg-white text-gov-blue' : 'text-blue-100 hover:text-white'
              }`}
            >
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div>
            <label className="form-label" htmlFor="email">Official Email Address</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="judge@judiciary.gov.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="form-label" htmlFor="confirm-password">Confirm Password</label>
                <input
                  id="confirm-password"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label" htmlFor="role">Role</label>
                <select
                  id="role"
                  className="form-input"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                >
                  <option value="Judge">Judge</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </>
          )}

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 text-sm px-3 py-2 rounded-sm">
              ⚠ {error}
            </div>
          )}

          <button
            id="submit-btn"
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-base font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          <p className="text-center text-xs text-gray-400 mt-2">
            Authorised Personnel Only • Judicial Department
          </p>
        </form>
      </div>

      <p className="text-blue-300 text-xs mt-6 z-10">
        © {new Date().getFullYear()} Government of India
      </p>
    </div>
  )
}

export default LoginPage
