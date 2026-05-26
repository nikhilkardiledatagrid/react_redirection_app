import { useEffect, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'deviceInfo'

const emptyForm = {
  deviceName: '',
  deviceId: '',
  tableNo: '',
  venueName: '',
}

function App() {
  const [deviceInfo, setDeviceInfo] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setDeviceInfo(JSON.parse(stored))
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = {}
    Object.keys(emptyForm).forEach((key) => {
      if (!form[key].trim()) {
        nextErrors[key] = 'Required'
      }
    })
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }
    const trimmed = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v.trim()])
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
    setDeviceInfo(trimmed)
  }

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY)
    setDeviceInfo(null)
    setForm(emptyForm)
    setErrors({})
  }

  if (isLoading) {
    return (
      <section className="screen">
        <div className="loader" role="status" aria-live="polite">
          <div className="spinner" aria-hidden="true"></div>
          <p>Loading...</p>
        </div>
      </section>
    )
  }

  if (deviceInfo) {
    return (
      <section className="screen">
        <div className="card">
          <h1>Device Information</h1>
          <p className="subtitle">Saved details for this device.</p>
          <dl className="info-list">
            <div>
              <dt>Device Name</dt>
              <dd>{deviceInfo.deviceName}</dd>
            </div>
            <div>
              <dt>Device Id</dt>
              <dd>{deviceInfo.deviceId}</dd>
            </div>
            <div>
              <dt>Table No</dt>
              <dd>{deviceInfo.tableNo}</dd>
            </div>
            <div>
              <dt>Venue Name</dt>
              <dd>{deviceInfo.venueName}</dd>
            </div>
          </dl>
          <button type="button" className="secondary-btn" onClick={handleReset}>
            Reset
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="screen">
      <form className="card" onSubmit={handleSubmit} noValidate>
        <h1>Onboarding</h1>
        <p className="subtitle">Set up this device to continue.</p>

        <label className="field">
          <span>Device Name</span>
          <input
            type="text"
            name="deviceName"
            value={form.deviceName}
            onChange={handleChange}
            placeholder="e.g. Front Counter iPad"
          />
          {errors.deviceName && <em className="error">{errors.deviceName}</em>}
        </label>

        <label className="field">
          <span>Device Id</span>
          <input
            type="text"
            name="deviceId"
            value={form.deviceId}
            onChange={handleChange}
            placeholder="e.g. DEV-0001"
          />
          {errors.deviceId && <em className="error">{errors.deviceId}</em>}
        </label>

        <label className="field">
          <span>Table No</span>
          <input
            type="text"
            name="tableNo"
            value={form.tableNo}
            onChange={handleChange}
            placeholder="e.g. 12"
          />
          {errors.tableNo && <em className="error">{errors.tableNo}</em>}
        </label>

        <label className="field">
          <span>Venue Name</span>
          <input
            type="text"
            name="venueName"
            value={form.venueName}
            onChange={handleChange}
            placeholder="e.g. Sunset Cafe"
          />
          {errors.venueName && <em className="error">{errors.venueName}</em>}
        </label>

        <button type="submit" className="primary-btn">
          Submit
        </button>
      </form>
    </section>
  )
}

export default App
