const PALETTE = ['#d97706', '#2563eb', '#db2777', '#e11d48', '#059669', '#7c3aed', '#0891b2']

function colorFor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return PALETTE[Math.abs(hash) % PALETTE.length]
}

function initialsFor(name: string) {
  if (name === '+') return '+'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

export function Avatar({ name = 'Admin', large = false }: { name?: string; large?: boolean }) {
  return (
    <span
      className={large ? 'avatar avatar-large avatar-initials' : 'avatar avatar-initials'}
      style={{ background: colorFor(name) }}
      title={name}
    >
      {initialsFor(name)}
    </span>
  )
}
