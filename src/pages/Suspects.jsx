import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'
import Navigation from '../components/Navigation'
import SuspectCard from '../components/SuspectCard'
import { deleteSuspect, getSuspects, saveSuspect, updateSuspect } from '../services/suspectServiceApi'
import '../styles/suspects.css'


const defaultForm = {
  name: '',
  occupation: '',
  description: ''
}

function SuspectsPage() {
  const [suspects, setSuspects] = useState([])
  const [selectedSuspect, setSelectedSuspect] = useState(null)
  const [formData, setFormData] = useState(defaultForm)

  const loadSuspects = useCallback(async () => {
    const data = await getSuspects()
    setSuspects(data)
  }, [])

  useEffect(() => {
    loadSuspects()
  }, [loadSuspects])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const populateForm = (suspect) => {
    setSelectedSuspect(suspect)
    setFormData({
      name: suspect.name ?? '',
      occupation: suspect.occupation ?? '',
      description: suspect.description ?? ''
    })
  }

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.occupation.trim() || !formData.description.trim()) return

    await saveSuspect(formData)
    setFormData(defaultForm)
    await loadSuspects()
  }

  const handleUpdate = async () => {
    if (!selectedSuspect?.id) return

    await updateSuspect(selectedSuspect.id, formData)
    setSelectedSuspect(null)
    setFormData(defaultForm)
    await loadSuspects()
  }

  const handleDelete = async () => {
    if (!selectedSuspect?.id) return

    await deleteSuspect(selectedSuspect.id)
    setSelectedSuspect(null)
    setFormData(defaultForm)
    await loadSuspects()
  }

  return (
    <main className="page-shell page-container">
      <Navigation />

      <section className="content-panel suspect-layout">
        <div className="page-header">
          <div>
            <p className="eyebrow">Personnel review</p>
            <h1 className="page-title">Suspects</h1>
          </div>
        </div>

        <p className="page-intro">
          Three individuals had legitimate access to the research laboratory. Review each suspect carefully before making your conclusion.
        </p>

        <div className="case-card suspects-manager">
          <h2>Suspect management</h2>
          <form className="investigation-form" onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="suspect-name">Name</label>
            <input id="suspect-name" name="name" value={formData.name} onChange={handleChange} />

            <label htmlFor="suspect-occupation">Occupation</label>
            <input id="suspect-occupation" name="occupation" value={formData.occupation} onChange={handleChange} />

            <label htmlFor="suspect-description">Description</label>
            <textarea id="suspect-description" name="description" rows={4} value={formData.description} onChange={handleChange} />

            <div className="action-row">
              <button type="button" onClick={handleSave}>Save Suspect</button>
              <button type="button" onClick={handleUpdate}>Update Suspect</button>
              <button type="button" onClick={handleDelete}>Delete Suspect</button>
            </div>
          </form>
        </div>

        <div className="suspect-list suspects-grid">
          {suspects.map((suspect) => (
            <SuspectCard key={suspect.id} suspect={suspect} onSelect={populateForm} />
          ))}
        </div>

        {selectedSuspect && (
          <div className="selected-suspect-box">
            <p className="detail-label">Selected suspect</p>
            <h3>{selectedSuspect.name}</h3>
            <p>{selectedSuspect.occupation}</p>
            <p>{selectedSuspect.description}</p>
            <Link to="/investigation" state={{ suspect: selectedSuspect }} className="btn-secondary">Select Suspect</Link>
          </div>
        )}
      </section>
    </main>
  )
}

export default SuspectsPage
