import { motion } from 'framer-motion'
import { Pause, Play, RotateCcw, SkipForward } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { RichText } from '../ui/RichText'

export interface Playback {
  stage: number
  playing: boolean
  toggle: () => void
  next: () => void
  reset: () => void
}

export function usePlayback(length: number): Playback {
  const [stage, setStage] = useState(0)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => setStage((current) => (current + 1) % length), 1500)
    return () => window.clearInterval(timer)
  }, [playing, length])

  return {
    stage,
    playing,
    toggle: () => setPlaying((value) => !value),
    next: () => setStage((current) => (current + 1) % length),
    reset: () => {
      setPlaying(false)
      setStage(0)
    },
  }
}

export function Controls({ playback }: { playback: Playback }) {
  const base = 'flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[0.75rem] transition'
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={playback.toggle}
        className={`${base} border-accent-400/30 bg-accent-500/10 font-bold text-accent-300 hover:bg-accent-500/20`}
      >
        {playback.playing ? <Pause size={13} /> : <Play size={13} />}
        {playback.playing ? 'إيقاف' : 'شغّل'}
      </button>
      <button
        type="button"
        onClick={playback.next}
        className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}
      >
        <SkipForward size={13} /> الخطوة التالية
      </button>
      <button
        type="button"
        onClick={playback.reset}
        className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}
      >
        <RotateCcw size={13} /> إعادة
      </button>
    </div>
  )
}

export function Shell({
  title,
  playback,
  children,
  legend,
}: {
  title: string
  playback: Playback
  children: ReactNode
  legend: string
}) {
  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-sky-400/12 bg-navy-950/70">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-400/10 px-4 py-3">
        <span className="font-display text-[0.78rem] font-bold text-slate-300" dir="ltr">
          {title}
        </span>
        <Controls playback={playback} />
      </div>
      <div className="diagram-grid overflow-x-auto px-2 py-4" dir="ltr">
        {children}
      </div>
      <div className="border-t border-sky-400/10 bg-sky-400/[0.03] px-4 py-3 text-[0.85rem] leading-[1.9] text-slate-300" dir="rtl">
        <span className="ml-2 rounded bg-accent-500/15 px-1.5 py-0.5 font-display text-[0.7rem] font-bold text-accent-300" dir="ltr">
          {playback.stage + 1}
        </span>
        <RichText>{legend}</RichText>
      </div>
    </div>
  )
}

interface NodeProps {
  x: number
  y: number
  w: number
  h: number
  label: string
  sub: string
  color: string
  tooltip: string
  active?: boolean
  dashed?: boolean
}

export function Node({ x, y, w, h, label, sub, color, tooltip, active, dashed }: NodeProps) {
  return (
    <g>
      <title>{tooltip}</title>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="11"
        fill="#0a1730"
        stroke={color}
        strokeOpacity={active ? 1 : 0.55}
        strokeWidth={active ? 2.4 : 1.5}
        strokeDasharray={dashed ? '5 4' : undefined}
      />
      <text x={x + w / 2} y={y + h / 2 - 3} textAnchor="middle" fill={color} fontFamily="JetBrains Mono, monospace" fontSize="12" fontWeight="700">
        {label}
      </text>
      <text x={x + w / 2} y={y + h / 2 + 15} textAnchor="middle" fill="#94a3b8" fontFamily="JetBrains Mono, monospace" fontSize="9">
        {sub}
      </text>
    </g>
  )
}

export function LinkLine({
  x1,
  y1,
  x2,
  y2,
  color = '#38bdf8',
  active = false,
  dashed = false,
}: {
  x1: number
  y1: number
  x2: number
  y2: number
  color?: string
  active?: boolean
  dashed?: boolean
}) {
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeOpacity={dashed ? 0.22 : 0.28}
        strokeWidth="2.5"
        strokeDasharray={dashed ? '6 6' : undefined}
      />
      <motion.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={active ? 3 : 1.5}
        strokeDasharray="6 8"
        animate={{ opacity: active ? 1 : 0.18, strokeDashoffset: active ? [0, -28] : 0 }}
        transition={{ duration: 1.2, repeat: active ? Infinity : 0, ease: 'linear' }}
      />
    </g>
  )
}

export function Packet({ point, color, label }: { point: { x: number; y: number }; color: string; label: string }) {
  return (
    <motion.g animate={{ x: point.x, y: point.y }} transition={{ type: 'spring', stiffness: 150, damping: 22 }}>
      <circle r="13" fill={color} opacity="0.2" />
      <circle r="5.5" fill={color} />
      <text x="0" y="-17" textAnchor="middle" fill={color} fontFamily="JetBrains Mono, monospace" fontSize="9">
        {label}
      </text>
    </motion.g>
  )
}

const twoTierStages = [
  '`PC1` بيجهّز الطلب ويبعت الـ frame لعنوان الـ `default gateway`',
  '`SW-Access` بيقرأ الـ destination MAC وبيوجّه الـ frame على الـ uplink',
  '`SW-Core` يعمل Layer 3 routing ويقلّل الـ TTL — هنا اتدمجت وظائف Distribution و Core',
  'السيرفر في الـ VLAN التانية بيستقبل الـ packet',
  'الرد بيرجع على نفس المسار، أو على الرابط الاحتياطي لو الـ primary فشل',
  '`SW-Access` بيوجّه الرد لـ `PC1`',
]

export function TwoTierDiagram() {
  const playback = usePlayback(twoTierStages.length)
  const path = [
    { x: 70, y: 170 },
    { x: 250, y: 170 },
    { x: 450, y: 170 },
    { x: 660, y: 170 },
    { x: 450, y: 170 },
    { x: 70, y: 170 },
  ]

  return (
    <Shell title="TWO-TIER / COLLAPSED CORE" playback={playback} legend={twoTierStages[playback.stage]}>
      <svg viewBox="0 0 760 240" className="h-auto w-full min-w-[680px]" role="img" aria-label="Two-tier collapsed core topology">
        <LinkLine x1={120} y1={170} x2={190} y2={170} active={playback.stage === 0} />
        <LinkLine x1={310} y1={170} x2={390} y2={170} active={playback.stage === 1} />
        <LinkLine x1={510} y1={170} x2={600} y2={170} active={playback.stage === 2 || playback.stage === 3} />
        <LinkLine x1={310} y1={170} x2={390} y2={70} color="#34d399" dashed active={playback.stage === 4} />
        <LinkLine x1={510} y1={70} x2={600} y2={170} color="#34d399" dashed active={playback.stage === 4} />

        <Node x={20} y={145} w={100} h={50} label="PC1" sub="VLAN 10" color="#38bdf8" tooltip="Endpoint in VLAN 10" active={playback.stage === 0 || playback.stage === 5} />
        <Node x={190} y={145} w={120} h={50} label="SW-Access" sub="Access Layer" color="#60a5fa" tooltip="Layer 2 access switch — connects end devices" active={playback.stage === 1 || playback.stage === 5} />
        <Node x={390} y={145} w={120} h={50} label="SW-Core" sub="Dist + Core" color="#a78bfa" tooltip="Collapsed Core — routing and high-speed backbone in one layer" active={playback.stage === 2 || playback.stage === 4} />
        <Node x={390} y={45} w={120} h={50} label="SW-Core2" sub="Redundant" color="#34d399" tooltip="Second collapsed-core switch for redundancy" dashed active={playback.stage === 4} />
        <Node x={600} y={145} w={120} h={50} label="SERVER" sub="VLAN 20" color="#fb7185" tooltip="Destination server in VLAN 20" active={playback.stage === 3} />

        <text x="250" y="222" textAnchor="middle" fill="#64748b" fontFamily="JetBrains Mono, monospace" fontSize="10">
          ACCESS
        </text>
        <text x="450" y="222" textAnchor="middle" fill="#64748b" fontFamily="JetBrains Mono, monospace" fontSize="10">
          COLLAPSED CORE
        </text>
        <Packet point={path[playback.stage]} color={playback.stage > 2 ? '#34d399' : '#38bdf8'} label="FRAME" />
      </svg>
    </Shell>
  )
}

const threeTierStages = [
  '`PC` بيتصل بمنفذ الـ `Access Layer`',
  'الـ `Access Switch` بيوجّه الـ frame Within VLAN',
  'الـ `Distribution Layer` بيطبّق السياسات وبيعمل routing بين الـ VLANs',
  'الـ `Core Layer` بيمرّر الـ packet بأقصى سرعة من غير فحص زيادة',
  'السيرفر بيستقبل الطلب',
  'الرد بيرجع عبر الـ Core',
  'الـ Distribution بيرجّع الـ packet للـ VLAN الصح',
  'الـ Access بيوجّه الـ frame للـ PC',
  'الـ PC استلم الرد',
]

export function ThreeTierDiagram() {
  const playback = usePlayback(threeTierStages.length)
  const path = [
    { x: 55, y: 180 }, { x: 195, y: 180 }, { x: 370, y: 180 }, { x: 545, y: 180 },
    { x: 720, y: 180 }, { x: 545, y: 180 }, { x: 370, y: 180 }, { x: 195, y: 180 }, { x: 55, y: 180 },
  ]

  return (
    <Shell title="THREE-TIER / ACCESS · DISTRIBUTION · CORE" playback={playback} legend={threeTierStages[playback.stage]}>
      <svg viewBox="0 0 800 260" className="h-auto w-full min-w-[720px]" role="img" aria-label="Three-tier hierarchical topology">
        <LinkLine x1={100} y1={180} x2={140} y2={180} active={playback.stage === 0} />
        <LinkLine x1={250} y1={180} x2={310} y2={180} active={playback.stage === 1} />
        <LinkLine x1={430} y1={180} x2={490} y2={180} active={playback.stage === 2 || playback.stage === 6} />
        <LinkLine x1={600} y1={180} x2={660} y2={180} active={playback.stage === 3 || playback.stage === 5} />
        <LinkLine x1={310} y1={180} x2={310} y2={75} color="#34d399" dashed active={playback.stage === 6} />

        <Node x={10} y={155} w={90} h={50} label="PC" sub="Endpoint" color="#38bdf8" tooltip="End device connected to the access layer" active={playback.stage === 0 || playback.stage === 8} />
        <Node x={140} y={155} w={110} h={50} label="Access" sub="Layer 2" color="#60a5fa" tooltip="Access layer — ports, VLAN assignment, end devices" active={playback.stage === 1 || playback.stage === 7} />
        <Node x={310} y={155} w={120} h={50} label="Distribution" sub="Routing + policy" color="#a78bfa" tooltip="Distribution layer — routing, policies, L2/L3 boundary, redundancy" active={playback.stage === 2 || playback.stage === 6} />
        <Node x={310} y={50} w={120} h={50} label="Dist-2" sub="Redundant" color="#34d399" tooltip="Redundant distribution switch" dashed active={playback.stage === 6} />
        <Node x={490} y={155} w={110} h={50} label="Core" sub="Fast backbone" color="#fbbf24" tooltip="Core layer — high-speed transport between distribution blocks" active={playback.stage === 3 || playback.stage === 5} />
        <Node x={660} y={155} w={120} h={50} label="SERVER" sub="Data center" color="#fb7185" tooltip="Destination server" active={playback.stage === 4} />

        <text x="195" y="235" textAnchor="middle" fill="#64748b" fontFamily="JetBrains Mono, monospace" fontSize="10">
          ACCESS LAYER
        </text>
        <text x="370" y="235" textAnchor="middle" fill="#64748b" fontFamily="JetBrains Mono, monospace" fontSize="10">
          DISTRIBUTION LAYER
        </text>
        <text x="545" y="235" textAnchor="middle" fill="#64748b" fontFamily="JetBrains Mono, monospace" fontSize="10">
          CORE LAYER
        </text>
        <Packet point={path[playback.stage]} color={playback.stage > 3 ? '#34d399' : '#38bdf8'} label="PACKET" />
      </svg>
    </Shell>
  )
}

const leaves = [
  { x: 70, label: 'Leaf 1' },
  { x: 240, label: 'Leaf 2' },
  { x: 410, label: 'Leaf 3' },
  { x: 580, label: 'Leaf 4' },
]
const spines = [
  { x: 170, label: 'Spine 1' },
  { x: 350, label: 'Spine 2' },
  { x: 530, label: 'Spine 3' },
]

export function SpineLeafDiagram() {
  const playback = usePlayback(9)
  const pathIndex = Math.floor(playback.stage / 3)
  const hop = playback.stage % 3
  const path = [
    { x: leaves[0].x + 55, y: 245 },
    { x: spines[pathIndex].x + 55, y: 100 },
    { x: leaves[2].x + 55, y: 245 },
  ]

  return (
    <Shell
      title="SPINE-LEAF / ECMP FABRIC"
      playback={playback}
      legend={`ECMP: المسار ${pathIndex + 1} من 3 ليه نفس الـ cost — الـ fabric بيوزّع الترافيك على كل المسارات المتاحة`}
    >
      <svg viewBox="0 0 780 320" className="h-auto w-full min-w-[700px]" role="img" aria-label="Spine-leaf fabric with ECMP paths">
        {leaves.flatMap((leaf, leafIndex) =>
          spines.map((spine, spineIndex) => {
            const active = leafIndex === 0 && spineIndex === pathIndex
            return (
              <LinkLine
                key={`${leafIndex}-${spineIndex}`}
                x1={leaf.x + 55}
                y1={240}
                x2={spine.x + 55}
                y2={100}
                color={active ? '#38bdf8' : '#60a5fa'}
                active={active}
              />
            )
          }),
        )}

        {spines.map((spine, index) => (
          <Node
            key={spine.label}
            x={spine.x}
            y={50}
            w={110}
            h={50}
            label={spine.label}
            sub="Spine"
            color="#a78bfa"
            tooltip="Spine switch — connects to every leaf, carries traffic across the fabric"
            active={index === pathIndex}
          />
        ))}

        {leaves.map((leaf, index) => (
          <Node
            key={leaf.label}
            x={leaf.x}
            y={220}
            w={110}
            h={50}
            label={leaf.label}
            sub="Servers"
            color="#38bdf8"
            tooltip="Leaf switch — connects servers and endpoints; no direct leaf-to-leaf link"
            active={index === 0 || index === 2}
          />
        ))}

        <text x="390" y="295" textAnchor="middle" fill="#64748b" fontFamily="JetBrains Mono, monospace" fontSize="10">
          EVERY LEAF ↔ EVERY SPINE · NO LEAF↔LEAF · NO SPINE↔SPINE
        </text>
        <Packet point={path[hop]} color="#38bdf8" label="SERVER A → B" />
      </svg>
    </Shell>
  )
}

export function TopologyLabDiagram() {
  const playback = usePlayback(5)
  const path = [
    { x: 90, y: 272 }, { x: 210, y: 178 }, { x: 380, y: 68 },
    { x: 550, y: 178 }, { x: 630, y: 272 },
  ]
  const stages = [
    '`PC0` في VLAN 10 بيعت frame',
    '`SW-Access1` بيوجّه على الـ trunk لـ SW-Core',
    '`SW-Core` بيعمل inter-VLAN routing بين VLAN 10 و VLAN 20',
    'الـ trunk لـ `SW-Access2` بيوصل الـ frame لـ VLAN 20',
    '`PC3` استقبل الرد',
  ]

  return (
    <Shell title="LAB TOPOLOGY / TWO-TIER" playback={playback} legend={stages[playback.stage]}>
      <svg viewBox="0 0 760 320" className="h-auto w-full min-w-[680px]" role="img" aria-label="Packet Tracer two-tier lab topology">
        <LinkLine x1={380} y1={95} x2={210} y2={150} active={playback.stage === 1 || playback.stage === 3} />
        <LinkLine x1={380} y1={95} x2={550} y2={150} active={playback.stage === 3} />
        <LinkLine x1={210} y1={205} x2={90} y2={250} active={playback.stage === 0} />
        <LinkLine x1={210} y1={205} x2={250} y2={250} color="#a78bfa" />
        <LinkLine x1={550} y1={205} x2={470} y2={250} />
        <LinkLine x1={550} y1={205} x2={630} y2={250} color="#a78bfa" active={playback.stage === 4} />

        <Node x={320} y={40} w={120} h={55} label="SW-Core" sub="L3 Switch" color="#a78bfa" tooltip="Multilayer switch — SVIs and inter-VLAN routing" active={playback.stage === 2} />
        <Node x={150} y={150} w={120} h={55} label="SW-Access1" sub="L2" color="#60a5fa" tooltip="Access switch for Sales PCs" active={playback.stage === 0 || playback.stage === 1} />
        <Node x={490} y={150} w={120} h={55} label="SW-Access2" sub="L2" color="#60a5fa" tooltip="Access switch for IT PCs" active={playback.stage === 3} />

        <Node x={40} y={250} w={100} h={45} label="PC0" sub="VLAN 10" color="#38bdf8" tooltip="Sales PC — 192.168.10.10" active={playback.stage === 0} />
        <Node x={200} y={250} w={100} h={45} label="PC1" sub="VLAN 10" color="#38bdf8" tooltip="Sales PC — 192.168.10.11" />
        <Node x={420} y={250} w={100} h={45} label="PC2" sub="VLAN 20" color="#a78bfa" tooltip="IT PC — 192.168.20.10" />
        <Node x={580} y={250} w={100} h={45} label="PC3" sub="VLAN 20" color="#a78bfa" tooltip="IT PC — 192.168.20.11" active={playback.stage === 4} />

        <text x="380" y="310" textAnchor="middle" fill="#64748b" fontFamily="JetBrains Mono, monospace" fontSize="10">
          VLAN 10 Sales · VLAN 20 IT · Trunks between access and core
        </text>
        <Packet point={path[playback.stage]} color={playback.stage > 2 ? '#a78bfa' : '#38bdf8'} label="ICMP" />
      </svg>
    </Shell>
  )
}
