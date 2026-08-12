import { ChevronDown, FolderKanban, LayoutList, Settings } from 'lucide-react'
import { ProfilePopover } from './profile-popover'
import type { Accent, Profile, Screen } from './types'
import { Avatar } from './ui/avatar'

export function Sidebar({
  screen,
  setScreen,
  onProfile,
  profileOpen,
  onCloseProfile,
  onSettings,
  theme,
  setTheme,
  accent,
  setAccent,
  profile,
}: {
  screen: Screen
  setScreen: (screen: Screen) => void
  onProfile: () => void
  profileOpen: boolean
  onCloseProfile: () => void
  onSettings: () => void
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  accent: Accent
  setAccent: (accent: Accent) => void
  profile: Profile
}) {
  return (
    <aside className="sidebar" onClick={onCloseProfile}>
      <button className="workspace-profile" onClick={(event) => { event.stopPropagation(); onProfile() }}>
        <Avatar name={profile.fullName} />
        <strong>{profile.fullName}</strong>
        <ChevronDown size={14} />
      </button>
      {profileOpen && (
        <ProfilePopover
          onClose={onCloseProfile}
          onSettings={onSettings}
          theme={theme}
          setTheme={setTheme}
          accent={accent}
          setAccent={setAccent}
          profile={profile}
        />
      )}
      <div className="workspace-label">
        Workspace <ChevronDown size={14} />
      </div>
      <button className={`nav-item ${screen === 'tasks' || screen === 'detail' ? 'selected' : ''}`} onClick={() => setScreen('tasks')}>
        <LayoutList size={16} /> Tasks
      </button>
      <button className={`nav-item ${screen === 'projects' ? 'selected' : ''}`} onClick={() => setScreen('projects')}>
        <FolderKanban size={16} /> Projects
      </button>
      <div className="sidebar-bottom">
        <button className="nav-item" onClick={onSettings}>
          <Settings size={16} /> Settings
        </button>
      </div>
    </aside>
  )
}
