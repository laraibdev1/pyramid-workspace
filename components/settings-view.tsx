'use client'

import { ArrowLeft, Check, Pencil, Search, Sun, User } from 'lucide-react'
import { useState } from 'react'
import type { Profile, Screen } from './types'
import { Avatar } from './ui/avatar'

export function SettingsView({
  setScreen,
  profile,
  setProfile,
  onLeaveWorkspace,
}: {
  setScreen: (screen: Screen) => void
  profile: Profile
  setProfile: (profile: Profile) => void
  onLeaveWorkspace: () => void
}) {
  const [draft, setDraft] = useState(profile)
  const [saved, setSaved] = useState(false)

  const save = () => {
    setProfile(draft)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="settings-wrap">
      <aside className="settings-rail">
        <button className="back-app" onClick={() => setScreen('tasks')}>
          <ArrowLeft size={15} /> Back to app
        </button>
        <div className="settings-search">
          <Search size={15} /> Search
        </div>
        <button className="settings-item active">
          <User size={15} /> Profile
        </button>
        <button className="settings-item">
          <Sun size={15} /> Theme
        </button>
        <button className="settings-item">
          <span className="color-square" /> Color
        </button>
      </aside>
      <main className="settings-main">
        <h1>Profile</h1>
        <div className="settings-card">
          <div className="settings-row">
            <span>Profile picture</span>
            <Avatar name={draft.fullName || 'Admin'} large />
          </div>
          <div className="settings-row">
            <span>Email</span>
            <strong className="editable-value">
              <input
                value={draft.email}
                onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))}
              />
              <Pencil size={14} />
            </strong>
          </div>
          <div className="settings-row">
            <span>
              <strong>Full name</strong>
            </span>
            <input
              value={draft.fullName}
              onChange={(event) => setDraft((current) => ({ ...current, fullName: event.target.value }))}
            />
          </div>
          <div className="settings-row">
            <span>
              <strong>Title</strong>
              <small>Your job title or role</small>
            </span>
            <input
              value={draft.title}
              onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
            />
          </div>
          <div className="settings-row">
            <span>
              <strong>Username</strong>
              <small>One word, like a nickname or first name</small>
            </span>
            <input
              value={draft.username}
              onChange={(event) => setDraft((current) => ({ ...current, username: event.target.value }))}
            />
          </div>
          <div className="settings-save-row">
            <button className="dark-button" onClick={save} disabled={JSON.stringify(draft) === JSON.stringify(profile)}>
              {saved ? (
                <>
                  <Check size={14} /> Saved
                </>
              ) : (
                'Save changes'
              )}
            </button>
          </div>
        </div>
        <h2>Workspace access</h2>
        <div className="settings-card access-card">
          <span>Remove yourself from the workspace</span>
          <button onClick={onLeaveWorkspace}>Leave Workspace</button>
        </div>
      </main>
    </div>
  )
}
