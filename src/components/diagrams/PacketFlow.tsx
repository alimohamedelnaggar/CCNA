import { motion } from 'framer-motion'
import { Pause, Play, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'

const stops = [96, 250, 404, 558, 706]
const route = [0, 1, 2, 3, 4, 3, 2, 1, 0]

const stages = [
  'الـ PC بيجهّز الـ packet: بيدخل `Source IP` و `Destination IP`',
  'الـ switch بيقرأ الـ destination MAC وبيوجّه الـ frame للميناء الصح',
  'الراوتر بيقلّل الـ TTL وبيختار الـ next hop من جدول التوجيه',
  'الـ firewall بيفحص الـ packet مقابل الـ security policy',
  'السيرفر بيستقبل الطلب ويرجّع الـ response',
  'الرد بيرجع عبر الـ firewall بعد ما اتأكد إنه مسموح',
  'الراوتر بيبني frame جديد: الـ MAC بيتغيّر والـ IP بيفضل زي ما هو',
  'السوّيتش بيوجّه الـ frame للـ PC باستخدام جدول الـ MAC',
  'الـ PC استلم الرد وخلص الاتصال',
]

const nodes = [
  { label: 'PC0', sub: 'Endpoint', color: '#38bdf8' },
  { label: 'SW1', sub: 'L2 Switch', color: '#60a5fa' },
  { label: 'R1', sub: 'Router', color: '#a78bfa' },
  { label: 'FW', sub: 'Firewall', color: '#fb7185' },
  { label: 'SERVER', sub: 'Server', color: '#34d399' },
]

export function PacketFlow() {
  const [stage, setStage] = useState(0)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => setStage((current) => (current + 1) % stages.length), 1350)
    return () => window.clearInterval(timer)
  }, [playing])

  const goingOut = stage <= 4
  const color = goingOut ? '#38bdf8' : '#34d399'

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-sky-400/12 bg-navy-950/70">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-400/10 px-4 py-3">
        <span className="font-display text-[0.8rem] font-bold text-slate-300" dir="ltr">
          PC0 → SW1 → R1 → FW → SERVER
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPlaying((value) => !value)}
            className="flex items-center gap-1.5 rounded-lg border border-accent-400/30 bg-accent-500/10 px-3 py-1.5 text-[0.78rem] font-bold text-accent-300 transition hover:bg-accent-500/20"
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
            {playing ? 'إيقاف' : 'شغّل'}
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false)
              setStage(0)
            }}
            className="flex items-center gap-1.5 rounded-lg border border-sky-400/15 px-3 py-1.5 text-[0.78rem] text-slate-300 transition hover:border-sky-400/40"
          >
            <RotateCcw size={14} /> إعادة
          </button>
        </div>
      </div>

      <div className="diagram-grid overflow-x-auto px-2 py-4" dir="ltr">
        <svg viewBox="0 0 780 190" className="h-auto min-w-[660px] w-full" role="img" aria-label="Animated packet journey through switch, router, firewall and server">
          <defs>
            <filter id="packet-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {stops.slice(0, -1).map((x, index) => (
            <g key={index}>
              <line x1={x + 44} y1="70" x2={stops[index + 1] - 44} y2="70" stroke="rgba(96,165,250,0.18)" strokeWidth="3" />
              <motion.line
                x1={x + 44}
                y1="70"
                x2={stops[index + 1] - 44}
                y2="70"
                stroke={color}
                strokeWidth="2"
                strokeDasharray="6 8"
                animate={{ opacity: [0.2, 0.9, 0.2] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: index * 0.15 }}
              />
            </g>
          ))}

          {nodes.map((node, index) => (
            <g key={node.label}>
              <rect
                x={stops[index] - 35}
                y="40"
                width="70"
                height="60"
                rx="12"
                fill="#0b1a38"
                stroke={node.color}
                strokeOpacity={stage === index || stage === route.indexOf(index) ? 0.9 : 0.35}
                strokeWidth="1.5"
              />
              <text x={stops[index]} y="68" textAnchor="middle" fill={node.color} fontFamily="JetBrains Mono, monospace" fontSize="12" fontWeight="700">
                {node.label}
              </text>
              <text x={stops[index]} y="86" textAnchor="middle" fill="#94a3b8" fontFamily="JetBrains Mono, monospace" fontSize="9">
                {node.sub}
              </text>
              <line x1={stops[index]} y1="100" x2={stops[index]} y2="122" stroke="rgba(96,165,250,0.2)" strokeDasharray="3 4" />
              <text x={stops[index]} y="138" textAnchor="middle" fill="#64748b" fontFamily="JetBrains Mono, monospace" fontSize="9">
                {index === 2 ? 'TTL -1' : index === 1 ? 'MAC table' : index === 3 ? 'Policy' : 'IP: ' + ['192.0.2.10', '—', '192.0.2.1', '—', '198.51.100.80'][index]}
              </text>
            </g>
          ))}

          <motion.g animate={{ x: stops[route[stage]] }} transition={{ duration: 0.85, ease: 'easeInOut' }}>
            <circle cx="0" cy="70" r="13" fill={color} opacity="0.2" filter="url(#packet-glow)" />
            <circle cx="0" cy="70" r="6" fill={color} filter="url(#packet-glow)" />
            <text x="0" y="48" textAnchor="middle" fill={color} fontFamily="JetBrains Mono, monospace" fontSize="9">
              {goingOut ? 'PACKET' : 'REPLY'}
            </text>
          </motion.g>
        </svg>
      </div>

      <div className="flex items-start gap-3 border-t border-sky-400/10 bg-sky-400/[0.03] px-4 py-3">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent-500/15 font-display text-[0.72rem] font-bold text-accent-300">
          {stage + 1}
        </span>
        <p className="text-[0.88rem] leading-relaxed text-slate-300">
          {stages[stage].split('`').map((part, index) =>
            index % 2 === 1 ? (
              <code key={index} className="tech">
                {part}
              </code>
            ) : (
              <span key={index}>{part}</span>
            ),
          )}
        </p>
      </div>
    </div>
  )
}
