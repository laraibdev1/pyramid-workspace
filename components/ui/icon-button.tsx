import type React from 'react'

export function IconButton({
  label,
  children,
  onClick,
  active,
}: {
  label: string
  children: React.ReactNode
  onClick?: () => void
  active?: boolean
}) {
  return (
    <button className={`icon-button ${active ? 'is-active' : ''}`} aria-label={label} onClick={onClick}>
      {children}
    </button>
  )
}
