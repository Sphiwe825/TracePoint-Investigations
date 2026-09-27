import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import InvestigationForm from '../components/InvestigationForm'
import Navigation from '../components/Navigation'
import { getCase } from '../services/caseServiceApi'
import { getSuspects } from '../services/suspectServiceApi'
import { saveInvestigation } from '../services/investigationServiceApi'
import '../styles/investigation.css'

function InvestigationPage() {
  const location = useLocation()
  const [selectedSuspect, setSelectedSuspect] = useState(location.state?.suspect ?? null)
  const [caseId, setCaseId] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    getCase().then((currentCase) => setCaseId(currentCase?.id ?? null))
  }, [])

  useEffect(() => {
    if (selectedSuspect) return

    getSuspects().then((suspects) => {
      if (suspects[0]) setSelectedSuspect(suspects[0])
    })
  }, [selectedSuspect])

  const handleSubmit = async ({ suspect, conclusion }) => {
    setErrorMessage('')
    setSuccessMessage('')

    const cleanConclusion = conclusion?.trim()

    if (!caseId) {
      setErrorMessage('No active case was found. Please open the case page first.')
      return
    }

    if (!suspect?.id) {
      setErrorMessage('Please select a suspect before submitting the investigation.')
      return
    }

    if (!cleanConclusion) {
      setErrorMessage('Please enter an investigation conclusion before submitting.')
      return
    }

    try {
      const result = await saveInvestigation({
        caseId,
        suspectId: suspect.id,
        conclusion: cleanConclusion
      })

      if (result.success) {
        setSuccessMessage('Investigation Submitted Successfully')
        setSelectedSuspect(suspect)
      }
    } catch (error) {
      setErrorMessage(error.message || 'The investigation could not be submitted.')
    }
  }

  return (
    <main className="page-shell">
      <Navigation />
      <section className="content-panel investigation-layout">
        <h1>Investigation</h1>

        <div className="suspect-choice-box">
          <p>Selected suspect: {selectedSuspect ? selectedSuspect.name : 'No suspect selected'}</p>
          <Link to="/suspects">[ Select Suspect ]</Link>
        </div>

        <InvestigationForm selectedSuspect={selectedSuspect} onSubmit={handleSubmit} />

        {errorMessage && (
          <div className="success-panel" style={{ background: '#fff1f1', borderColor: 'rgba(197, 75, 75, 0.25)' }}>
            <h2 style={{ color: '#b42318' }}>{errorMessage}</h2>
          </div>
        )}

        {successMessage && (
          <div className="success-panel">
            <h2>{successMessage}</h2>
            <p>Your investigation has been recorded by TracePoint Investigations.</p>
          </div>
        )}
      </section>
    </main>
  )
}

export default InvestigationPage
