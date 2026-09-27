import { Link } from "react-router"
function CaseCard({ caseItem }) {
  if (!caseItem) return null

  const name = caseItem.caseName ?? caseItem.CaseName ?? caseItem.name ?? ''
  const status = caseItem.status ?? caseItem.Status ?? 'OPEN'
  const description = caseItem.description ?? caseItem.Description ?? ''

  return (
    <article className="case-card">
      <h2>{name}</h2>
      <p className="case-status">Status: {status}</p>
      <p>{description}</p>

      <div className="case-actions">
        <Link to="/suspects" className="btn-secondary">View Suspects</Link>
        <Link to="/evidence" className="btn-secondary">View Evidence</Link>
      </div>
    </article>
  )
}

export default CaseCard
