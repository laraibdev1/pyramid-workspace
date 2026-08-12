function initialsFor(name: string) {
  if (name === '+') return '+'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

export function Avatar({ name = 'Admin', large = false }: { name?: string; large?: boolean }) {
  return (
    <span className={large ? 'avatar avatar-large avatar-initials' : 'avatar avatar-initials'} title={name}>
      {initialsFor(name)}
    </span>
  )
}
