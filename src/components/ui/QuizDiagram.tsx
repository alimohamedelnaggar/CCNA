/** Small diagram embedded inside an exam question. Kept deliberately compact. */
export function QuizDiagram({ variant }: { variant: 'hybrid-cloud' }) {
  if (variant !== 'hybrid-cloud') return null

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-sky-400/12 bg-navy-950/70 px-2 py-3" dir="ltr">
      <svg viewBox="0 0 560 150" className="h-auto w-full min-w-[420px]" role="img" aria-label="Hybrid cloud diagram">
        <g>
          <rect x="20" y="30" width="190" height="90" rx="12" fill="#0a1730" stroke="#38bdf8" strokeOpacity="0.7" strokeWidth="1.5" />
          <text x="115" y="55" textAnchor="middle" fill="#7dd3fc" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="700">
            ON-PREMISES
          </text>
          <text x="115" y="77" textAnchor="middle" fill="#cbd5e1" fontFamily="JetBrains Mono, monospace" fontSize="10">
            Servers · Storage · Switches
          </text>
          <text x="115" y="100" textAnchor="middle" fill="#64748b" fontFamily="JetBrains Mono, monospace" fontSize="9">
            Your team manages hardware
          </text>
        </g>

        <line x1="210" y1="75" x2="350" y2="75" stroke="#a78bfa" strokeWidth="2" strokeDasharray="6 5" />
        <text x="280" y="65" textAnchor="middle" fill="#a78bfa" fontFamily="JetBrains Mono, monospace" fontSize="9">
          VPN / dedicated link
        </text>

        <g>
          <rect x="350" y="30" width="190" height="90" rx="12" fill="#0a1730" stroke="#a78bfa" strokeOpacity="0.7" strokeWidth="1.5" />
          <text x="445" y="55" textAnchor="middle" fill="#c4b5fd" fontFamily="JetBrains Mono, monospace" fontSize="11" fontWeight="700">
            CLOUD PROVIDER
          </text>
          <text x="445" y="77" textAnchor="middle" fill="#cbd5e1" fontFamily="JetBrains Mono, monospace" fontSize="10">
            VMs · Virtual Network · Storage
          </text>
          <text x="445" y="100" textAnchor="middle" fill="#64748b" fontFamily="JetBrains Mono, monospace" fontSize="9">
            Provider manages hardware
          </text>
        </g>
      </svg>
    </div>
  )
}
