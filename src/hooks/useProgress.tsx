import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'ccna-roadmap-progress-v1'

interface ProgressState {
  completed: string[]
  lastTopicId: string | null
}

interface ProgressContextValue extends ProgressState {
  completedSet: Set<string>
  isComplete: (topicId: string) => boolean
  toggleComplete: (topicId: string) => void
  setLastTopic: (topicId: string) => void
  completedCount: number
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

function readStoredState(): ProgressState {
  if (typeof window === 'undefined') return { completed: [], lastTopicId: null }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { completed: [], lastTopicId: null }
    const parsed = JSON.parse(raw) as Partial<ProgressState>
    return {
      completed: Array.isArray(parsed.completed) ? parsed.completed.filter((id) => typeof id === 'string') : [],
      lastTopicId: typeof parsed.lastTopicId === 'string' ? parsed.lastTopicId : null,
    }
  } catch {
    return { completed: [], lastTopicId: null }
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(readStoredState)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Private browsing or full storage: progress simply stays in memory for this session.
    }
  }, [state])

  const toggleComplete = useCallback((topicId: string) => {
    setState((current) => ({
      ...current,
      completed: current.completed.includes(topicId)
        ? current.completed.filter((id) => id !== topicId)
        : [...current.completed, topicId],
    }))
  }, [])

  const setLastTopic = useCallback((topicId: string) => {
    setState((current) => ({ ...current, lastTopicId: topicId }))
  }, [])

  const value = useMemo<ProgressContextValue>(
    () => ({
      ...state,
      completedSet: new Set(state.completed),
      completedCount: state.completed.length,
      isComplete: (topicId) => state.completed.includes(topicId),
      toggleComplete,
      setLastTopic,
    }),
    [state, toggleComplete, setLastTopic],
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress(): ProgressContextValue {
  const context = useContext(ProgressContext)
  if (!context) throw new Error('useProgress must be used inside ProgressProvider')
  return context
}
