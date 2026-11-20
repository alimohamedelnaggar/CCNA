import type { ReactNode } from 'react'

const TOKEN = /(`[^`]+`|\*\*[^*]+\*\*)/g

/** Renders `technical terms` and **bold** inside Arabic lesson copy. */
export function RichText({ children, className = '' }: { children: string; className?: string }): ReactNode {
  return (
    <span className={className}>
      {children.split(TOKEN).filter(Boolean).map((part, index) => {
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={index} className="tech">
              {part.slice(1, -1)}
            </code>
          )
        }
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={index}>{part.slice(2, -2)}</strong>
        }
        return <span key={index}>{part}</span>
      })}
    </span>
  )
}
