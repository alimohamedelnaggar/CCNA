import { motion } from 'framer-motion'

const nodes = [
  { x: 80, label: 'PC0', ip: '192.0.2.10', type: 'Endpoint', color: '#38bdf8' },
  { x: 270, label: 'SW1', ip: 'Vlan10 192.0.2.2', type: 'L2 Switch', color: '#60a5fa' },
  { x: 460, label: 'R1', ip: 'G0/0 192.0.2.1', type: 'Router', color: '#a78bfa' },
  { x: 650, label: 'Server0', ip: '198.51.100.80', type: 'Server', color: '#34d399' },
]

export function LabTopology() {
  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-sky-400/12 bg-navy-950/70 px-2 py-4" dir="ltr">
      <svg viewBox="0 0 740 220" className="h-auto min-w-[640px] w-full" role="img" aria-label="Packet Tracer lab topology">
        <defs>
          <linearGradient id="wan-link" x1="0" x2="1">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>

        {[0, 1, 2].map((index) => (
          <g key={index}>
            <line x1={nodes[index].x + 46} y1="80" x2={nodes[index + 1].x - 46} y2="80" stroke="rgba(96,165,250,0.22)" strokeWidth="3" />
            <motion.line
              x1={nodes[index].x + 46}
              y1="80"
              x2={nodes[index + 1].x - 46}
              y2="80"
              stroke={index === 2 ? 'url(#wan-link)' : '#38bdf8'}
              strokeWidth="2"
              strokeDasharray="5 7"
              animate={{ strokeDashoffset: [0, -24] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
            />
          </g>
        ))}

        {nodes.map((node) => (
          <g key={node.label}>
            <rect x={node.x - 46} y="48" width="92" height="64" rx="12" fill="#0a1730" stroke={node.color} strokeOpacity="0.7" strokeWidth="1.5" />
            <text x={node.x} y="75" textAnchor="middle" fill={node.color} fontFamily="JetBrains Mono, monospace" fontSize="12" fontWeight="700">
              {node.label}
            </text>
            <text x={node.x} y="93" textAnchor="middle" fill="#94a3b8" fontFamily="JetBrains Mono, monospace" fontSize="9">
              {node.type}
            </text>
            <text x={node.x} y="140" textAnchor="middle" fill="#cbd5e1" fontFamily="JetBrains Mono, monospace" fontSize="10">
              {node.ip}
            </text>
          </g>
        ))}

        <text x="550" y="185" fill="#64748b" fontFamily="JetBrains Mono, monospace" fontSize="10">
          WAN / 198.51.100.0/24
        </text>
        <text x="170" y="185" fill="#64748b" fontFamily="JetBrains Mono, monospace" fontSize="10">
          LAN / 192.0.2.0/24
        </text>
      </svg>
    </div>
  )
}
