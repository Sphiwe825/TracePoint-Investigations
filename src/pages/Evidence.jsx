import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import EvidenceCard from '../components/EvidenceCard'
import Navigation from '../components/Navigation'
import { deleteEvidence, getEvidence, saveEvidence, updateEvidence } from '../services/evidenceServiceApi'
import '../styles/evidence.css'

const defaultForm = {
  title: '',
  description: '',
  location: ''
}

function EvidencePage() {
  const [evidenceItems, setEvidenceItems] = useState([])
  const [selectedEvidence, setSelectedEvidence] = useState(null)
  const [formData, setFormData] = useState(defaultForm)

  useEffect(() => {
    getEvidence().then(setEvidenceItems)
  }, [])

  const loadEvidence = async () => {
    const data = await getEvidence()
    setEvidenceItems(data)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const populateForm = (item) => {
    setSelectedEvidence(item)
    setFormData({
      title: item.title ?? '',
      description: item.description ?? '',
      location: item.location ?? ''
    })
  }

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) return

    await saveEvidence(formData)
    setFormData(defaultForm)
    await loadEvidence()
  }

  const handleUpdate = async () => {
    if (!selectedEvidence?.id) return

    await updateEvidence(selectedEvidence.id, formData)
    setSelectedEvidence(null)
    setFormData(defaultForm)
    await loadEvidence()
  }

  const handleDelete = async () => {
    if (!selectedEvidence?.id) return

    await deleteEvidence(selectedEvidence.id)
    setSelectedEvidence(null)
    setFormData(defaultForm)
    await loadEvidence()
  }

  return (
    <main className="page-shell">
      <Navigation />
      <section className="content-panel evidence-layout">
        <h1>Evidence</h1>

        <div className="case-card">
          <h2>Evidence management</h2>
          <form className="investigation-form" onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="evidence-title">Title</label>
            <input id="evidence-title" name="title" value={formData.title} onChange={handleChange} />

            <label htmlFor="evidence-location">Location</label>
            <input id="evidence-location" name="location" value={formData.location} onChange={handleChange} />

            <label htmlFor="evidence-description">Description</label>
            <textarea id="evidence-description" name="description" rows={4} value={formData.description} onChange={handleChange} />

            <div className="action-row">
              <button type="button" onClick={handleSave}>Save Evidence</button>
              <button type="button" onClick={handleUpdate}>Update Evidence</button>
              <button type="button" onClick={handleDelete}>Delete Evidence</button>
            </div>
          </form>
        </div>

        <div className="evidence-list">
          {evidenceItems.map((item) => (
            <EvidenceCard key={item.id} evidence={item} onSelect={populateForm} />
          ))}
        </div>

        {selectedEvidence && (
          <div className="selected-evidence-box">
            <h3>{selectedEvidence.title}</h3>
            <p>Location: {selectedEvidence.location}</p>
            <p>{selectedEvidence.description}</p>
            <Link to="/investigation">[ Examine Evidence ]</Link>
          </div>
        )}
      </section>
    </main>
  )
}

export default EvidencePage
