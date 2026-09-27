import { useState } from 'react'

function InvestigationForm({ selectedSuspect, onSubmit }) {
  const [conclusion, setConclusion] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!selectedSuspect) {
      alert('An investigation cannot be submitted if no suspect has been selected.')
      return
    }

    if (!conclusion.trim()) {
      alert('An investigation cannot be submitted if the conclusion is empty.')
      return
    }

    onSubmit?.({ suspect: selectedSuspect, conclusion })
    setConclusion('')
  }

  return (
    <form className="investigation-form" onSubmit={handleSubmit}>
      <div className="selected-suspect-box">
        <strong>Selected suspect:</strong> {selectedSuspect ? selectedSuspect.name : 'No suspect selected'}
      </div>

      <label htmlFor="conclusion">Investigation conclusion</label>
      <textarea
        id="conclusion"
        value={conclusion}
        onChange={(event) => setConclusion(event.target.value)}
        placeholder="Enter your conclusion"
        rows={5}
      />

      <button type="submit" className="submit-button">Submit Investigation</button>
    </form>
  )
}

export default InvestigationForm
