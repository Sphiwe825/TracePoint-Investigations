import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import Navigation from '../components/Navigation'
import { deleteCase, getCase, saveCase, updateCase } from '../services/caseServiceApi'
import '../styles/case.css'

const defaultForm = {
  name: '',
  description: '',
  status: 'OPEN'
}

function CasePage() {
  const [caseItem, setCaseItem] = useState(null)
  const [formData, setFormData] = useState(defaultForm)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const loadCase = async () => {
    setIsLoading(true)
    const result = await getCase()
    setCaseItem(result)

    if (result) {
      setFormData({
        name: result.name ?? '',
        description: result.description ?? '',
        status: result.status ?? 'OPEN'
      })
    } else {
      setFormData(defaultForm)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    loadCase()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.description.trim()) return

    await saveCase({
      caseName: formData.name,
      description: formData.description,
      status: formData.status
    })

    setMessage('Case saved successfully')
    await loadCase()
  }

  const handleUpdate = async () => {
    if (!caseItem?.id) return

    await updateCase(caseItem.id, {
      caseName: formData.name,
      description: formData.description,
      status: formData.status
    })

    setMessage('Case updated successfully')
    await loadCase()
  }

  const handleDelete = async () => {
    if (!caseItem?.id) return

    await deleteCase(caseItem.id)
    setMessage('Case deleted successfully')
    setCaseItem(null)
    setFormData(defaultForm)
  }

  return (
    <main className="page-shell page-container">
      <Navigation />

      <section className="content-panel case-layout">
        <div className="case-header-row">
          <div>
            <p className="eyebrow">Case details</p>
            <h1 className="page-title">{caseItem ? caseItem.name : 'Case management'}</h1>
          </div>
          {caseItem && (
            <span className="status-line">{caseItem.status}</span>
          )}
        </div>

        {isLoading && <p className="page-intro">Loading case...</p>}

        {caseItem && (
          <article className="case-detail-card">
            <h2>{caseItem.name}</h2>
            <p className="case-status">Status: {caseItem.status}</p>
            <p>{caseItem.description}</p>

            <div className="case-actions">
              <Link to="/suspects" className="btn-secondary">View Suspects</Link>
              <Link to="/evidence" className="btn-secondary">View Evidence</Link>
            </div>
          </article>
        )}

        <div className="case-card">
          <h2>Case management</h2>
          <form className="investigation-form" onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="case-name">Case name</label>
            <input id="case-name" name="name" value={formData.name} onChange={handleChange} />

            <label htmlFor="case-status">Status</label>
            <select id="case-status" name="status" value={formData.status} onChange={handleChange}>
              <option value="OPEN">OPEN</option>
              <option value="CLOSED">CLOSED</option>
              <option value="Standard">Standard</option>
            </select>

            <label htmlFor="case-description">Description</label>
            <textarea id="case-description" name="description" rows={4} value={formData.description} onChange={handleChange} />

            <div className="action-row">
              <button type="button" onClick={handleSave}>Save Case</button>
              <button type="button" onClick={handleUpdate}>Update Case</button>
              <button type="button" onClick={handleDelete}>Delete Case</button>
            </div>

            {message && <p>{message}</p>}
          </form>
        </div>
      </section>
    </main>
  )
}

export default CasePage
