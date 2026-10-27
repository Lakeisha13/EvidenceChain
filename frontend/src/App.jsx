
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [caseName, setCaseName] = useState('')
  const [evidenceName, setEvidenceName] = useState('')
  const [file, setFile] = useState(null)
  const [evidence, setEvidence] = useState([])
  const [auditLogs, setAuditLogs] = useState([])
  const [message, setMessage] = useState('')

  const [verifyFile, setVerifyFile] = useState(null)
const [verifyId, setVerifyId] = useState('')
const [verifyResult, setVerifyResult] = useState(null)
const [verifyMessage, setVerifyMessage] = useState('')
async function loadAuditLogs() {
  try {
    const response = await fetch('/api/audit')
    if (!response.ok) throw new Error('Failed to load audit log')
    const logs = await response.json()
    setAuditLogs(logs)
  } catch (error) {
    console.error('Could not load audit log:', error)
  }
}

  useEffect(() => {
  fetch('/api/evidence')
    .then(response => {
      if (!response.ok) throw new Error('Failed to load evidence')
      return response.json()
    })
    .then(records => {
      setEvidence(records.map(record => ({
        ...record,
        time: new Date(record.createdAt).toLocaleString(),
        status: 'Registered',
      })))
    })
    .catch(error => console.error('Could not load evidence:', error))
}, [])

useEffect(() => {
  fetch('/api/audit')
    .then(response => {
      if (!response.ok) throw new Error('Failed to load audit log')
      return response.json()
    })
    .then(logs => setAuditLogs(logs))
    .catch(error => console.error('Could not load audit log:', error))
}, [])

async function registerEvidence(e) {
  e.preventDefault()

  if (!caseName.trim() || !evidenceName.trim() || !file) {
    setMessage('Please complete all fields and select a file.')
    return
  }

  setMessage('Registering evidence and calculating SHA-256...')

  try {
    const formData = new FormData()
    formData.append('caseName', caseName)
    formData.append('evidenceName', evidenceName)
    formData.append('file', file)

    const response = await fetch('/api/evidence', {
      method: 'POST',
      body: formData,
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Registration failed.')
    }

    const record = {
      ...result,
      time: new Date(result.createdAt).toLocaleString(),
      status: 'Registered',
    }

    setEvidence(previous => [record, ...previous])
    await loadAuditLogs()

    setMessage(
      `Evidence registered successfully! SHA-256: ${result.sha256}`
    )

    setCaseName('')
    setEvidenceName('')
    setFile(null)
    e.target.reset()
  } catch (error) {
    setMessage(`Error: ${error.message}`)
  }
}

async function verifyEvidence(e) {
  e.preventDefault()

  if (!verifyId || !verifyFile) {
    setVerifyMessage('Select an evidence record and a file.')
    return
  }

  setVerifyMessage('Verifying file integrity...')
  setVerifyResult(null)

  try {
    const formData = new FormData()
    formData.append('file', verifyFile)

    const response = await fetch(
      `/api/evidence/${verifyId}/verify`,
      { method: 'POST', body: formData }
    )

    const result = await response.json()
    if (!response.ok) throw new Error(result.error || 'Verification failed.')

    setVerifyResult(result)
    setVerifyMessage(result.message)
    setVerifyResult(result)
setVerifyMessage(result.message)
await loadAuditLogs()
  } catch (error) {
    setVerifyMessage(`Error: ${error.message}`)
  }
}



  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand"><span className="brand-icon">E</span><div>EvidenceChain<small>DIGITAL FORENSICS</small></div></div>
        <p className="nav-label">WORKSPACE</p>
        <div className="nav-item active">▦ &nbsp; Overview</div>
        <div className="nav-item">▤ &nbsp; Evidence Registry</div>
        <div className="nav-item">◷ &nbsp; Chain of Custody</div>
        <div className="nav-item">✓ &nbsp; Integrity Verification</div>
        <div className="sidebar-bottom">
  <span className="status-dot" /> Demo workspace
  <small>Cloud backend connected</small>
</div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div><span className="breadcrumb">Workspace /</span> Overview</div>
          <div className="user"><span className="avatar">DF</span><div>Demo Forensic Officer<small>Investigation team</small></div></div>
        </header>

        <section className="welcome">
          <div><p className="eyebrow">DIGITAL EVIDENCE MANAGEMENT</p><h1>Evidence overview</h1><p className="subheading">Register, track and verify digital evidence with integrity-focused records.</p></div>
          <div className="secure-pill"><span className="status-dot"/> Evidence workspace</div>
        </section>

        <section className="stats">
  <div className="stat-card">
    <span className="stat-icon purple">▤</span>
    <p>Total evidence records</p>
    <h2>{evidence.length}</h2>
    <small>Records from the database</small>
  </div>

  <div className="stat-card">
    <span className="stat-icon green">✓</span>
    <p>Integrity verified</p>
    <h2>
      {auditLogs.filter(log => log.action === 'INTEGRITY_VERIFIED').length}
    </h2>
    <small>Successful verification events</small>
  </div>

  <div className="stat-card">
    <span className="stat-icon orange">◷</span>
    <p>Custody events</p>
    <h2>{auditLogs.length}</h2>
    <small>Recorded audit events</small>
  </div>
</section>

        <section className="content-grid">
          <div className="panel">
            <div className="panel-heading"><div><h2>Register evidence</h2><p>Add a file to the demonstration registry</p></div><span className="step-badge">NEW RECORD</span></div>
            <form onSubmit={registerEvidence}>
              <label>Case name / ID</label>
              <input value={caseName} onChange={e => setCaseName(e.target.value)} placeholder="e.g. CASE-2026-001" required />
              <label>Evidence description</label>
              <input value={evidenceName} onChange={e => setEvidenceName(e.target.value)} placeholder="e.g. Suspicious application log" required />
              <label>Evidence file</label>
              <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} required />
              <div className="file-note">Use a small, fictional sample file for your demo.</div>
              <button type="submit" className="primary-btn">＋ &nbsp; Add evidence record</button>
              {message && <p className="message">{message}</p>}
            </form>
          </div>

          <div className="panel integrity-panel">
            <div className="panel-heading"><div><h2>Integrity protection</h2><p>Evidence verification workflow</p></div><span className="shield">◇</span></div>
            <div className="workflow">
              <div className="workflow-step"><span>1</span><div><b>Evidence submitted</b><small>Select a file and case</small></div></div>
              <div className="workflow-line"/>
              <div className="workflow-step"><span>2</span><div><b>SHA-256 fingerprint</b><small>Backend hash generation</small></div></div>
              <div className="workflow-line"/>
              <div className="workflow-step"><span>3</span><div><b>Integrity verification</b><small>Compare current and trusted hashes</small></div></div>
              <div className="workflow-line"/>
              <div className="workflow-step"><span>4</span><div><b>Custody audit trail</b><small>Record action and timestamp</small></div></div>
            </div>
            <div className="notice">
  <b>Cloud integration active</b>
  <p>Evidence is stored in Amazon S3, metadata and audit events are persisted in MySQL, and SHA-256 hashes are used for integrity verification.</p>
</div>
          </div>
        </section>

<section className="panel records-panel">
  <div className="panel-heading">
    <div>
      <h2>Integrity Verification</h2>
      <p>Compare a file against its registered SHA-256 fingerprint.</p>
    </div>
    <span className="shield">✓</span>
  </div>

  <form onSubmit={verifyEvidence}>
    <label>Select registered evidence</label>
    <select
      value={verifyId}
      onChange={e => setVerifyId(e.target.value)}
      required
    >
      <option value="">Choose an evidence record</option>
      {evidence.map(item => (
        <option key={item.id} value={item.id}>
          {item.id} — {item.evidenceName}
        </option>
      ))}
    </select>

    <label>Select file to verify</label>
    <input
      type="file"
      onChange={e => {
        setVerifyFile(e.target.files?.[0] || null)
        setVerifyResult(null)
      }}
      required
    />

    <button type="submit" className="primary-btn">
      Verify Evidence Integrity
    </button>
  </form>

  {verifyMessage && (
    <div className="notice" aria-live="polite">
      <b>Verification result</b>
      <p>{verifyMessage}</p>

      {verifyResult && (
        <>
          <p>
            <b>Status: </b>
            {verifyResult.integrity === 'MATCH'
              ? 'INTEGRITY MATCH'
              : 'TAMPERING DETECTED'}
          </p>
          <p><b>Registered SHA-256:</b></p>
          <code>{verifyResult.originalHash}</code>
          <p><b>Uploaded file SHA-256:</b></p>
          <code>{verifyResult.currentHash}</code>
        </>
      )}
    </div>
  )}
</section>

        <section className="panel records-panel">
          <div className="panel-heading">
  <div>
    <h2>Recent evidence records</h2>
    <p>Evidence records retrieved from the database</p>
  </div>
  <span className="record-count">{evidence.length} records</span>
</div>
          {evidence.length === 0 ? <div className="empty-state"><span>▤</span><b>No evidence registered yet</b><p>Add a fictional sample file using the form above to see a record here.</p></div> :
            <div className="table-wrap"><table><thead><tr><th>RECORD ID</th><th>CASE</th><th>EVIDENCE</th><th>FILE</th><th>STATUS</th><th>REGISTERED</th></tr></thead><tbody>{evidence.map(item => <tr key={item.id}><td>{item.id}</td><td>{item.caseName}</td><td>{item.evidenceName}</td><td>{item.fileName}</td><td><span className="pending">{item.status}</span></td><td>{item.time}</td></tr>)}</tbody></table></div>
          }
        </section>

<section className="panel records-panel">
  <div className="panel-heading">
    <div>
      <h2>Chain of Custody</h2>
      <p>Recorded evidence actions and timestamps</p>
    </div>
    <span className="record-count">{auditLogs.length} events</span>
  </div>

  {auditLogs.length === 0 ? (
    <div className="empty-state">
      <b>No audit events found</b>
      <p>Register or verify evidence to create audit events.</p>
    </div>
  ) : (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>EVIDENCE ID</th>
            <th>ACTION</th>
            <th>TIMESTAMP</th>
            <th>DETAILS</th>
          </tr>
        </thead>
        <tbody>
          {auditLogs.map((log, index) => (
            <tr key={`${log.evidenceId}-${log.timestamp}-${index}`}>
              <td>{log.evidenceId}</td>
              <td>{log.action.replaceAll('_', ' ')}</td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td>{log.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</section>

        <footer>
  EvidenceChain · Digital Evidence Collection &amp; Chain of Custody
  <span>Cloud-deployed demo · SHA-256 integrity verification</span>
</footer>
      </main>
    </div>
  )
}

export default App
