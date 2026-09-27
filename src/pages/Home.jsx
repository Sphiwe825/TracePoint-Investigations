import { Link } from 'react-router'
import Navigation from '../components/Navigation'
import { getCase } from '../services/caseServiceApi'
import { getEvidence } from '../services/evidenceServiceApi'
import { getSuspects } from '../services/suspectServiceApi'
import '../styles/home.css'
import { useEffect, useState } from 'react'

function Home() {
  const [overview, setOverview] = useState({ status: 'OPEN', evidenceCount: 0, suspectCount: 0 })

  useEffect(() => {
    Promise.all([getCase(), getEvidence(), getSuspects()]).then(([caseItem, evidence, suspects]) => {
      setOverview({
        status: caseItem?.status ?? 'No active case',
        evidenceCount: evidence.length,
        suspectCount: suspects.length
      })
    })
  }, [])
  return (
    <main className="page-shell home-shell">
      <Navigation />

      <section className="content-panel hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Case intelligence dashboard</p>
          <h1>TRACEPOINT INVESTIGATIONS</h1>
          <h2>Missing prototype. Critical timeline. One decisive lead.</h2>
          <p>
            A high-value prototype vanished from a restricted research lab overnight.
            Review the report, assess the suspect pool, inspect the evidence, and conclude
            the case with a structured investigation outcome.
          </p>

          <div className="hero-actions">
            <Link className="primary-action" to="/case">Start investigation</Link>
            <Link className="secondary-action" to="/suspects">Review suspects</Link>
          </div>
        </div>

        <div className="hero-metrics" aria-label="Case overview stats">
          <div className="metric-card">
            <span className="metric-label">Status</span>
            <strong>{overview.status}</strong>
          </div>
          <div className="metric-card highlight">
            <span className="metric-label">Priority</span>
            <strong>High</strong>
          </div>
          <div className="metric-card">
            <span className="metric-label">Evidence</span>
            <strong>{overview.evidenceCount} Items</strong>
          </div>
          <div className="metric-card">
            <span className="metric-label">Suspects</span>
            <strong>{overview.suspectCount} Profiles</strong>
          </div>
        </div>
      </section>

      <section className="content-panel info-panel">
        <div className="section-heading">
          <p className="eyebrow">Workflow</p>
          <h3>Built for fast, clear investigative decisions</h3>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <div className="feature-icon">01</div>
            <h4>Case review</h4>
            <p>Open the incident report and validate the timeline before collecting leads.</p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">02</div>
            <h4>Assess suspects</h4>
            <p>Compare motives, access points, and behavior to narrow the most probable suspect.</p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">03</div>
            <h4>Evaluate evidence</h4>
            <p>Inspect direct and indirect evidence to determine which facts really matter.</p>
          </article>
        </div>
      </section>

      <section className="content-panel process-panel">
        <div className="section-heading">
          <p className="eyebrow">Investigation flow</p>
          <h3>Navigate the case the way investigators do</h3>
        </div>

        <div className="timeline">
          <div className="timeline-step">
            <span>1</span>
            <div>
              <h4>Review the incident</h4>
              <p>Confirm what was taken, where it was secured, and the chain of events.</p>
            </div>
          </div>

          <div className="timeline-step">
            <span>2</span>
            <div>
              <h4>Inspect suspect profiles</h4>
              <p>Compare opportunities, behavioral patterns, and likely access routes.</p>
            </div>
          </div>

          <div className="timeline-step">
            <span>3</span>
            <div>
              <h4>Document the conclusion</h4>
              <p>Submit the final findings using the structured investigation form.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
