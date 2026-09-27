function EvidenceCard({ evidence, onSelect }) {
  if (!evidence) return null

  const title = evidence.title ?? evidence.Title ?? ''
  const location = evidence.location ?? evidence.Location ?? ''
  const description = evidence.description ?? evidence.Description ?? ''

  return (
    <div className="evidence-card">
      <h3>{title}</h3>
      <p>Location: {location}</p>
      <p>{description}</p>
      <button type="button" onClick={() => onSelect?.(evidence)}>
        [ Examine Evidence ]
      </button>
    </div>
  )
}

export default EvidenceCard
