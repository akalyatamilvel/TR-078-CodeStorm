import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import axiosClient from '../api/axiosClient'
import type { CaseInput, CaseResult } from '../types'

const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Not Disclosed']

const IPC_SUGGESTIONS = [
  'IPC 302', 'IPC 376', 'IPC 307', 'IPC 395', 'IPC 364A',
  'IPC 396', 'IPC 120B', 'IPC 121', 'IPC 392', 'IPC 323',
  'IPC 420', 'IPC 379', 'IPC 498A', 'IPC 324', 'IPC 506',
  'IPC 406', 'IPC 425', 'IPC 447', 'IPC 436', 'IPC 467',
  'NDPS 21', 'Civil',
]

const generateCaseId = (): string => {
  const year = new Date().getFullYear()
  const rand = Math.floor(Math.random() * 900 + 100)
  return `CC-${year}-${rand}`
}

interface FormState {
  case_id: string
  summary: string
  ipc_section: string
  detention_duration: string
  expected_sentence: string
  age: string
  gender: string
}

const INITIAL_FORM: FormState = {
  case_id: generateCaseId(),
  summary: '',
  ipc_section: '',
  detention_duration: '',
  expected_sentence: '',
  age: '',
  gender: 'Male',
}

const AddCase: React.FC = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const validate = (): string => {
    if (!form.summary.trim() || form.summary.trim().length < 20)
      return 'Case summary must be at least 20 characters.'
    if (!form.ipc_section.trim()) return 'IPC Section is required.'
    if (isNaN(Number(form.detention_duration)) || Number(form.detention_duration) < 0)
      return 'Detention duration must be a non-negative number.'
    if (isNaN(Number(form.expected_sentence)) || Number(form.expected_sentence) < 0)
      return 'Expected sentence must be a non-negative number.'
    if (isNaN(Number(form.age)) || Number(form.age) < 0 || Number(form.age) > 120)
      return 'Age must be between 0 and 120.'
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) { setError(validationError); return }

    setError('')
    setLoading(true)

    const payload: CaseInput = {
      case_id: form.case_id,
      summary: form.summary.trim(),
      ipc_section: form.ipc_section.trim(),
      detention_duration: parseFloat(form.detention_duration),
      expected_sentence: parseFloat(form.expected_sentence),
      age: parseInt(form.age, 10),
      gender: form.gender,
    }

    try {
      const res = await axiosClient.post<CaseResult>('/analyze-case', payload)
      navigate('/results', { state: { result: res.data } })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to analyze case. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setForm({ ...INITIAL_FORM, case_id: generateCaseId() })
    setError('')
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gov-navy">📝 Register New Case</h2>
          <span className="text-sm text-gray-400 font-mono">ID: {form.case_id}</span>
        </div>

        <div className="gov-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Case ID (read-only) */}
            <div>
              <label className="form-label" htmlFor="case_id">Case ID (Auto-generated)</label>
              <input
                id="case_id"
                name="case_id"
                className="form-input bg-gray-50 font-mono"
                value={form.case_id}
                readOnly
              />
            </div>

            {/* Summary */}
            <div>
              <label className="form-label" htmlFor="summary">
                Case Summary <span className="text-red-500">*</span>
              </label>
              <textarea
                id="summary"
                name="summary"
                rows={5}
                className="form-input resize-none"
                placeholder="Describe the case in detail — include the nature of crime, victim details, evidence, urgency factors..."
                value={form.summary}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-gray-400 mt-1">{form.summary.length} / min 20 characters</p>
            </div>

            {/* IPC Section */}
            <div>
              <label className="form-label" htmlFor="ipc_section">
                IPC Section <span className="text-red-500">*</span>
              </label>
              <input
                id="ipc_section"
                name="ipc_section"
                list="ipc-list"
                className="form-input"
                placeholder="e.g. IPC 302, IPC 420, Civil..."
                value={form.ipc_section}
                onChange={handleChange}
                required
              />
              <datalist id="ipc-list">
                {IPC_SUGGESTIONS.map((ipc) => <option key={ipc} value={ipc} />)}
              </datalist>
            </div>

            {/* Duration and Sentence */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label" htmlFor="detention_duration">
                  Detention Duration (months) <span className="text-red-500">*</span>
                </label>
                <input
                  id="detention_duration"
                  name="detention_duration"
                  type="number"
                  min="0"
                  step="0.5"
                  className="form-input"
                  placeholder="e.g. 18"
                  value={form.detention_duration}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="form-label" htmlFor="expected_sentence">
                  Expected Sentence (months) <span className="text-red-500">*</span>
                </label>
                <input
                  id="expected_sentence"
                  name="expected_sentence"
                  type="number"
                  min="0"
                  step="0.5"
                  className="form-input"
                  placeholder="e.g. 24"
                  value={form.expected_sentence}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Age and Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label" htmlFor="age">
                  Age of Accused/Victim <span className="text-red-500">*</span>
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="0"
                  max="120"
                  className="form-input"
                  placeholder="e.g. 35"
                  value={form.age}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="form-label" htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  className="form-input"
                  value={form.gender}
                  onChange={handleChange}
                >
                  {GENDER_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-300 text-red-700 text-sm px-4 py-3 rounded-sm flex items-start gap-2">
                <span>⚠</span>
                <span>{error}</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                id="analyze-btn"
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 py-3 text-base flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Analyzing Case...
                  </>
                ) : (
                  '⚡ Analyze Case'
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="btn-secondary px-6"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Info box */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-sm p-4 text-sm text-blue-800">
          <p className="font-semibold mb-1">ℹ How it works</p>
          <ul className="space-y-1 text-xs text-blue-700 list-disc list-inside">
            <li>The system uses AI (TF-IDF + Logistic Regression) to classify the case</li>
            <li>A 0–100 priority score is computed based on detention ratio, severity, age, and urgency</li>
            <li>Cases where detention exceeds expected sentence are flagged as undertrial overstay</li>
            <li>All results are stored in the MongoDB database</li>
          </ul>
        </div>
      </div>
    </Layout>
  )
}

export default AddCase
