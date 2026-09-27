function SuspectCard({ suspect, onSelect }) {
  const name = suspect.name
  const occupation = suspect.occupation
  const description = suspect.description
  // const initials = name.trim().split(/\s+/).filter(Boolean).map((part) => part[0]).join('')

  return (
    <div className="suspect-card">
      <h3 className="suspect-name">{name}</h3>
      <span className="suspect-role">{occupation}</span>
      <p className="suspect-description">{description}</p>
      <button type="button" onClick={() => onSelect?.(suspect)}>
        Select Suspect
      </button>
    </div>
  )
}

export default SuspectCard
