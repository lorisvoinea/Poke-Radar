import { useState, useEffect } from 'react'
import { api } from './services/api'

interface HealthResponse {
  ok: boolean
  db: string
  version: string
}

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.get<HealthResponse>('/health')
      .then(setHealth)
      .catch((e: Error) => setError(e.message))
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Poke-Radar</h1>

      {error && (
        <div style={{ color: '#ef4444', padding: '1rem', background: '#1a1a2e', borderRadius: 8 }}>
          ⚠️ Backend unreachable: {error}
        </div>
      )}

      {health && (
        <div style={{ padding: '1rem', background: '#1a1a2e', borderRadius: 8, color: '#e0e0e0' }}>
          <p>✅ API: <strong>{health.ok ? 'Ready' : 'Error'}</strong></p>
          <p>🗄️ Database: <strong>{health.db}</strong></p>
          <p>📦 Version: <strong>{health.version}</strong></p>
        </div>
      )}

      {!health && !error && (
        <p>Connecting to backend...</p>
      )}
    </div>
  )
}

export default App
