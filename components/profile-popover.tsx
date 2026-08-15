'use client'

import { Check, ChevronRight, Settings, Sparkles, Sun } from 'lucide-react'
import { useState } from 'react'
import { accents } from './data'
import type { Accent, Profile } from './types'
import { Avatar } from './ui/avatar'

export function ProfilePopover({
  onClose,
  onSettings,
  theme,
  setTheme,
  accent,
  setAccent,
  profile,
}: {
  onClose: () => void
  onSettings: () => void
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  accent: Accent
  setAccent: (accent: Accent) => void
  profile: Profile
}) {
  const [submenu, setSubmenu] = useState<'theme' | 'color' | null>(null)

  return (
    <div className="profile-popover" onClick={(event) => event.stopPropagation()}>
      <div className="profile-card">
        <Avatar name={profile.fullName} large />
        <strong>{profile.fullName}</strong>
        <small>{profile.email}</small>
      </div>

      <button className="profile-menu-row" onClick={() => setSubmenu(submenu === 'theme' ? null : 'theme')}>
        <span>
          <Sun size={15} /> Change Theme
        </span>
        <ChevronRight size={14} />
      </button>
      {submenu === 'theme' && (
        <div className="profile-submenu theme-submenu">
          <button className="profile-menu-row" onClick={() => { setTheme('light'); onClose() }}>
            <span>
              <Sun size={14} /> Light
            </span>
            {theme === 'light' && <Check size={14} />}
          </button>
          <button className="profile-menu-row" onClick={() => { setTheme('dark'); onClose() }}>
            <span>
              <Sun size={14} /> Dark
            </span>
            {theme === 'dark' && <Check size={14} />}
          </button>
        </div>
      )}

      <button className="profile-menu-row" onClick={() => setSubmenu(submenu === 'color' ? null : 'color')}>
        <span>
          <Sparkles size={15} /> Color Mode
        </span>
        <ChevronRight size={14} />
      </button>
      {submenu === 'color' && (
        <div className="profile-submenu color-submenu">
          {accents.map((item) => (
            <button className="accent-button" key={item.id} onClick={() => { setAccent(item.id); onClose() }}>
              <span className="accent-swatch" style={{ '--swatch': item.swatch } as React.CSSProperties} />
              {item.label}
              {accent === item.id && <Check size={14} className="ml-auto" />}
            </button>
          ))}
        </div>
      )}

      <button className="profile-menu-row" onClick={onSettings}>
        <span>
          <Settings size={15} /> Settings
        </span>
      </button>
    </div>
  )
}
