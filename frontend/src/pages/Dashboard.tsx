import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import CaseTable from '../components/CaseTable'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../context/AuthContext'
import axiosClient from '../api/axiosClient'
import type { CaseResult } from '../types'

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [cases, setCases] = useState<CaseResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await axiosClient.get<{ total: number; cases: CaseResult[] }>('/cases')
        setCases(res.data.cases)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load cases')
      } finally {
        setLoading(false)
      }
    }
    fetchCases()
  }, [])

  const highPriority = cases.filter((c) => c.priority_score >= 75).length
  const undertrialAlerts = cases.filter((c) => c.flag).length
  const pending = cases.filter((c) => c.priority_score < 75 && !c.flag).length

  const recentCases = [...cases]
    .sort((a, b) => b.priority_score - a.priority_score)
    .slice(0, 8)

  return (
    <Layout>
      {/* Welcome Banner */}
      <div className="bg-gov-navy text-white rounded-sm px-6 py-4 mb-6 flex items-center justify-between shadow-md">
        <div>
          <h2 className="text-lg font-bold">
            Welcome back, {user?.name || 'Officer'}
          </h2>
          <p className="text-blue-200 text-sm mt-0.5">
            {user?.role} Dashboard • {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          id="add-case-btn"
          onClick={() => navigate('/add-case')}
          className="bg-gov-gold text-gov-navy font-semibold px-5 py-2 rounded-sm text-sm hover:bg-yellow-400 transition-colors"
        >
          + Add New Case
        </button>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <LoadingSpinner message="Loading dashboard..." />
      ) : error ? (
        <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-sm text-sm">
          ⚠ {error} — Make sure the backend is running at localhost:8000
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total Cases"
              value={cases.length}
              icon="📁"
              color="bg-gov-navy"
              subtitle="All registered cases"
            />
            <StatCard
              title="High Priority"
              value={highPriority}
              icon="🔴"
              color="bg-red-700"
              subtitle="Score ≥ 75"
            />
            <StatCard
              title="Undertrial Alerts"
              value={undertrialAlerts}
              icon="⚠️"
              color="bg-orange-600"
              subtitle="Detention exceeds sentence"
            />
            <StatCard
              title="Pending Review"
              value={pending}
              icon="⏳"
              color="bg-gov-blue"
              subtitle="Awaiting action"
            />
          </div>

          {/* Recent Cases */}
          <div className="gov-card p-5">
            <h3 className="section-title">Recent Cases (Top Priority)</h3>
            <CaseTable cases={recentCases} />
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => navigate('/cases')}
                className="btn-secondary"
              >
                View All Cases →
              </button>
            </div>
          </div>
        </>
      )}
    </Layout>
  )
}

export default Dashboard
