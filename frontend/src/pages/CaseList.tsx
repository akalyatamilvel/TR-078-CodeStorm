import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import CaseTable from '../components/CaseTable'
import LoadingSpinner from '../components/LoadingSpinner'
import axiosClient from '../api/axiosClient'
import type { CaseResult } from '../types'

type SortField = 'priority_score' | 'detention_duration' | 'age'
type FilterType = 'All' | 'Criminal (Major)' | 'Criminal (Minor)' | 'Civil' | 'Bail Eligible' | 'Fast Track'

const CaseList: React.FC = () => {
  const [cases, setCases] = useState<CaseResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('All')
  const [sortField, setSortField] = useState<SortField>('priority_score')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await axiosClient.get<{ total: number; cases: CaseResult[] }>('/cases')
        setCases(res.data.cases)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch cases')
      } finally {
        setLoading(false)
      }
    }
    fetchCases()
  }, [])

  const filtered = cases
    .filter((c) => filter === 'All' || c.classification === filter)
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      return (a[sortField] - b[sortField]) * dir
    })

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  const FILTERS: FilterType[] = ['All', 'Criminal (Major)', 'Criminal (Minor)', 'Civil', 'Bail Eligible', 'Fast Track']

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gov-navy">📋 Case Registry</h2>
        <span className="text-sm text-gray-500">{filtered.length} cases</span>
      </div>

      {/* Controls */}
      <div className="gov-card p-4 mb-4 flex flex-col md:flex-row gap-3">
        {/* Search */}
        <input
          id="case-search"
          type="text"
          placeholder="🔍 Search by Case ID, IPC, Classification..."
          className="form-input flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filter */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                filter === f
                  ? 'bg-gov-blue text-white border-gov-blue'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-gov-blue hover:text-gov-blue'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Sort:</span>
          {(['priority_score', 'detention_duration', 'age'] as SortField[]).map((f) => (
            <button
              key={f}
              onClick={() => toggleSort(f)}
              className={`px-2 py-1 text-xs rounded border transition-colors ${
                sortField === f
                  ? 'bg-gov-navy text-white border-gov-navy'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {f === 'priority_score' ? 'Priority' : f === 'detention_duration' ? 'Detention' : 'Age'}
              {sortField === f ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="gov-card p-0 overflow-hidden">
        {loading ? (
          <LoadingSpinner message="Loading cases from database..." />
        ) : error ? (
          <div className="p-6 text-red-600 text-sm">⚠ {error}</div>
        ) : (
          <CaseTable cases={filtered} searchQuery={search} />
        )}
      </div>
    </Layout>
  )
}

export default CaseList
