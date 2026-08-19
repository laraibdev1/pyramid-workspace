import { ChevronLeft, Filter, Menu, Plus, Search, SlidersHorizontal, X } from 'lucide-react'
import type { Screen, View } from './types'
import { IconButton } from './ui/icon-button'

export function Topbar({
  screen,
  setScreen,
  view,
  onMenu,
  search,
  setSearch,
  onAdd,
  activeFilterCount,
}: {
  screen: Screen
  setScreen: (screen: Screen) => void
  view: View
  setView: (view: View) => void
  onMenu: (menu: string) => void
  search: string
  setSearch: (value: string) => void
  onAdd: () => void
  activeFilterCount: number
}) {
  return (
    <header className="topbar">
      <button className="sidebar-toggle" aria-label="Toggle sidebar">
        <Menu size={16} />
      </button>
      {screen === 'detail' && (
        <button className="breadcrumb-button" onClick={() => setScreen('tasks')}>
          <ChevronLeft size={15} /> Tasks
        </button>
      )}
      <div className="topbar-spacer" />
      {screen !== 'settings' && screen !== 'login' && (
        <>
          {screen === 'tasks' && (
            <div className={`search-control ${search ? 'search-open' : ''}`}>
              <Search size={15} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search" />
              {search ? (
                <button onClick={() => setSearch('')} aria-label="Clear search">
                  <X size={14} />
                </button>
              ) : (
                <kbd className="search-kbd">⌘F</kbd>
              )}
            </div>
          )}
          {screen === 'tasks' && (
            <IconButton label="Fields" active={view === 'board'} onClick={() => onMenu('fields')}>
              <SlidersHorizontal size={15} />
            </IconButton>
          )}
          {screen === 'tasks' && (
            <IconButton label="Filter" active={activeFilterCount > 0} onClick={() => onMenu('filter')}>
              <Filter size={15} />
              {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}
            </IconButton>
          )}
          <button className="dark-button" onClick={() => onAdd()}>
            <Plus size={14} /> {screen === 'projects' ? 'Add Project' : 'Add Task'}
          </button>
        </>
      )}
    </header>
  )
}
