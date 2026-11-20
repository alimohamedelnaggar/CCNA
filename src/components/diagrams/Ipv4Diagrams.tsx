import { motion } from 'framer-motion'
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { RichText } from '../ui/RichText'
import { LinkLine, Node, Packet } from './ArchitectureDiagrams'
import { SvgText } from './FiberDiagrams'

interface StepPlayback {
  stage: number
  playing: boolean
  toggle: () => void
  next: () => void
  previous: () => void
  reset: () => void
  goTo: (stage: number) => void
}

function useStepPlayback(length: number): StepPlayback {
  const [stage, setStage] = useState(0)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => setStage((current) => (current + 1) % length), 1900)
    return () => window.clearInterval(timer)
  }, [playing, length])

  return {
    stage,
    playing,
    toggle: () => setPlaying((value) => !value),
    next: () => setStage((current) => (current + 1) % length),
    previous: () => setStage((current) => (current - 1 + length) % length),
    reset: () => {
      setPlaying(false)
      setStage(0)
    },
    goTo: (value) => setStage(Math.max(0, Math.min(length - 1, value))),
  }
}

function StepControls({ playback }: { playback: StepPlayback }) {
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
        onClick={playback.previous}
        className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}
      >
        <SkipBack size={13} /> السابق
      </button>
      <button
        type="button"
        onClick={playback.next}
        className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}
      >
        <SkipForward size={13} /> التالي
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

function StepShell({
  title,
  playback,
  legend,
  children,
}: {
  title: string
  playback: StepPlayback
  legend: string
  children: ReactNode
}) {
  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-sky-400/12 bg-navy-950/70">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-400/10 px-4 py-3">
        <span className="font-display text-[0.78rem] font-bold text-slate-300" dir="ltr">
          {title}
        </span>
        <StepControls playback={playback} />
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

const BIT_WEIGHTS = [128, 64, 32, 16, 8, 4, 2, 1]

function BitCell({
  x,
  y,
  bit,
  weight,
  active,
  onClick,
  color = '#38bdf8',
}: {
  x: number
  y: number
  bit: number
  weight: number
  active: boolean
  onClick?: () => void
  color?: string
}) {
  return (
    <g onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <title>{`Bit value ${bit}, position weight ${weight}`}</title>
      <motion.rect
        x={x}
        y={y}
        width="66"
        height="58"
        rx="10"
        fill={active ? color : '#0b1224'}
        fillOpacity={active ? 0.26 : 0.9}
        stroke={active ? color : '#1e3a5f'}
        strokeWidth={active ? 2.4 : 1.2}
        animate={{ opacity: active ? 1 : 0.78 }}
        transition={{ duration: 0.25 }}
      />
      <SvgText x={x + 33} y={y + 25} color={active ? '#f8fafc' : '#94a3b8'} size={14} bold>
        {String(bit)}
      </SvgText>
      <SvgText x={x + 33} y={y + 46} color={active ? color : '#64748b'} size={10}>
        {String(weight)}
      </SvgText>
    </g>
  )
}

const structureStages = [
  'الـ `IPv4 address` نتاج 32 بت، يعني أربعة octets كل واحد فيهم 8 بتات.',
  'كل octet يتحوّل لـ decimal بين 0 و255، وبنفصلهم بنقاط — دي `dotted-decimal notation`.',
  'أمثلة صحيحة: `192.168.1.10` و `8.8.8.8`. أمثلة غلط: `192.168.1.256` أو `192.168.1`.',
  'الـ `IP address` عنوان منطقي Layer 3 بيتغير مع الشبكة؛ الـ `MAC address` عنوان فيزيائي Layer 2 للرابط المحلي.',
]

export function Ipv4StructureDiagram() {
  const playback = useStepPlayback(structureStages.length)
  const stage = playback.stage
  const octets = [
    { label: 'OCTET 1', value: '192' },
    { label: 'OCTET 2', value: '168' },
    { label: 'OCTET 3', value: '1' },
    { label: 'OCTET 4', value: '10' },
  ]

  return (
    <StepShell title="IPv4 ADDRESS / 32 BITS = 4 OCTETS" playback={playback} legend={structureStages[stage]}>
      <svg viewBox="0 0 820 330" className="h-auto w-full min-w-[720px]" role="img" aria-label="IPv4 32-bit address divided into four octets">
        <title>IPv4 address structure with four octets and dotted decimal notation</title>

        <SvgText x={410} y={36} color="#7dd3fc" size={13} bold>32-BIT IPv4 ADDRESS</SvgText>
        <SvgText x={410} y={58} color="#94a3b8" size={10}>4 OCTETS × 8 BITS = 32 BITS</SvgText>

        {octets.map((octet, octetIndex) => (
          <g key={octet.label}>
            <SvgText x={100 + octetIndex * 205} y={90} color="#64748b" size={9} bold>{octet.label}</SvgText>
            {BIT_WEIGHTS.map((_weight, bitIndex) => {
              const x = 42 + octetIndex * 205 + bitIndex * 22
              const bit = ['11000000', '10101000', '00000001', '00001010'][octetIndex][bitIndex]
              return (
                <motion.rect
                  key={`${octetIndex}-${bitIndex}`}
                  x={x}
                  y="102"
                  width="18"
                  height="30"
                  rx="4"
                  fill={bit === '1' ? '#38bdf8' : '#0b1224'}
                  fillOpacity={bit === '1' ? 0.8 : 0.95}
                  stroke={stage === 0 ? '#38bdf8' : '#1e3a5f'}
                  strokeWidth={stage === 0 ? 1.8 : 1}
                  animate={{ opacity: stage === 0 ? 1 : 0.72 }}
                />
              )
            })}
            <motion.rect
              x={42 + octetIndex * 205}
              y="146"
              width="176"
              height="42"
              rx="9"
              fill={stage >= 1 ? '#38bdf8' : '#0b1224'}
              fillOpacity={stage >= 1 ? 0.16 : 0.8}
              stroke={stage >= 1 ? '#38bdf8' : '#1e3a5f'}
              animate={{ scale: stage === 1 ? 1.02 : 1 }}
            />
            <SvgText x={130 + octetIndex * 205} y={173} color={stage >= 1 ? '#e0f2fe' : '#94a3b8'} size={16} bold>
              {octet.value}
            </SvgText>
            {octetIndex < 3 && (
              <SvgText x={218 + octetIndex * 205} y={173} color="#64748b" size={18} bold>.</SvgText>
            )}
          </g>
        ))}

        {stage >= 2 && (
          <g>
            <SvgText x={170} y={224} color="#6ee7b7" size={11} bold>VALID: 192.168.1.10 · 8.8.8.8</SvgText>
            <SvgText x={650} y={224} color="#fda4af" size={11} bold>INVALID: 192.168.1.256 · 192.168.1</SvgText>
          </g>
        )}

        {stage === 3 && (
          <g>
            <Node x={70} y={250} w={300} h={58} label="IP ADDRESS" sub="32-bit logical / Layer 3" color="#38bdf8" tooltip="Logical address used by routing" active />
            <Node x={450} y={250} w={300} h={58} label="MAC ADDRESS" sub="48-bit physical / Layer 2" color="#a78bfa" tooltip="Local link hardware address" active />
          </g>
        )}
      </svg>
    </StepShell>
  )
}

const conversionExamples = [
  { binary: '11000000', decimal: 192, label: '192 = 11000000' },
  { binary: '10101000', decimal: 168, label: '168 = 10101000' },
  { binary: '00001010', decimal: 10, label: '10 = 00001010' },
  { binary: '11111111', decimal: 255, label: '255 = 11111111' },
]

const conversionStages = [
  'اضغط على أي بت لتقلبه بين 0 و 1، أو استخدم `التالي` لعرض أمثلة جاهزة. كل بت له weight ثابت.',
  'المجموع: اجمع الـ weights اللي البت بتاعها = 1. لو البت 0 فالـ weight مش بيدخل في المجموع.',
  'مثال `192`: البتات 1 في مواضع 128 و 64، فالمجموع `128 + 64 = 192`.',
  'التحويل العكسي من decimal لـ binary: قارن العدد بكل weight من الأكبر للأصغر واكتب 1 أو 0.',
]

export function BinaryConversionDiagram() {
  const playback = useStepPlayback(conversionStages.length)
  const stage = playback.stage
  const [bits, setBits] = useState<number[]>(conversionExamples[0].binary.split('').map(Number))

  useEffect(() => {
    setBits(conversionExamples[stage].binary.split('').map(Number))
  }, [stage])

  const decimal = bits.reduce((sum, bit, index) => sum + bit * BIT_WEIGHTS[index], 0)
  const parts = bits.map((bit, index) => (bit === 1 ? BIT_WEIGHTS[index] : 0)).filter((value) => value > 0)
  const calculation = parts.length > 0 ? `${parts.join(' + ')} = ${decimal}` : '0'

  return (
    <StepShell title="BINARY ↔ DECIMAL / BIT WEIGHTS" playback={playback} legend={conversionStages[stage]}>
      <svg viewBox="0 0 820 300" className="h-auto w-full min-w-[720px]" role="img" aria-label="Interactive binary to decimal conversion with bit weights">
        <title>Binary to decimal conversion using bit weights 128 64 32 16 8 4 2 1</title>

        <SvgText x={410} y={34} color="#7dd3fc" size={13} bold>BIT WEIGHTS: 128 · 64 · 32 · 16 · 8 · 4 · 2 · 1</SvgText>
        <SvgText x={410} y={56} color="#94a3b8" size={10}>CLICK ANY BIT TO TOGGLE IT</SvgText>

        {BIT_WEIGHTS.map((weight, index) => (
          <BitCell
            key={weight}
            x={38 + index * 96}
            y={86}
            bit={bits[index]}
            weight={weight}
            active={bits[index] === 1}
            onClick={() => setBits((current) => current.map((bit, i) => (i === index ? (bit === 1 ? 0 : 1) : bit)))}
          />
        ))}

        <SvgText x={410} y={180} color="#64748b" size={10}>BINARY</SvgText>
        <SvgText x={410} y={204} color="#e0f2fe" size={18} bold>{bits.join('')}</SvgText>

        <rect x="205" y="222" width="410" height="52" rx="10" fill="#0b1224" stroke="#34d399" strokeOpacity="0.6" />
        <SvgText x={410} y={244} color="#6ee7b7" size={11} bold>{`${calculation}`}</SvgText>
        <SvgText x={410} y={264} color="#94a3b8" size={10}>{`DECIMAL = ${decimal}`}</SvgText>
      </svg>
    </StepShell>
  )
}

const networkHostStages = [
  'الجهاز بياخد `IP address` و `subnet mask`. الماسك بيقول: أنهي جزء network وأنهي جزء host.',
  'بعمل `AND` بين الـ IP والماسك: 1 AND 1 = 1، وغير كده = 0. النتيجة هي `Network ID`.',
  'الجزء اللي الماسك سابته صفر هو `Host ID`. في المثال ده الـ network `192.168.1.0` والـ host `10`.',
  'قبل الإرسال الجهاز بيقارن destination بالـ network بتاعته: نفس الشبكة = ARP مباشر، شبكة تانية = default gateway.',
]

export function NetworkHostDiagram() {
  const playback = useStepPlayback(networkHostStages.length)
  const stage = playback.stage

  return (
    <StepShell title="NETWORK ID vs HOST ID / 192.168.1.10 + /24" playback={playback} legend={networkHostStages[stage]}>
      <svg viewBox="0 0 820 330" className="h-auto w-full min-w-[720px]" role="img" aria-label="Network ID and Host ID derived from IP address and subnet mask">
        <title>Network portion and host portion separated by the subnet mask</title>

        <SvgText x={410} y={34} color="#7dd3fc" size={12} bold>IP   192 . 168 . 1 . 10</SvgText>
        <SvgText x={410} y={58} color="#6ee7b7" size={12} bold>MASK 255 . 255 . 255 . 0</SvgText>

        {[0, 1, 2, 3].map((index) => (
          <g key={index}>
            <motion.rect
              x={110 + index * 155}
              y="80"
              width="140"
              height="52"
              rx="9"
              fill={index < 3 ? '#38bdf8' : '#a78bfa'}
              fillOpacity={stage >= 1 ? 0.2 : 0.08}
              stroke={index < 3 ? '#38bdf8' : '#a78bfa'}
              animate={{ opacity: stage >= 1 ? 1 : 0.65 }}
            />
            <SvgText x={180 + index * 155} y={112} color={index < 3 ? '#7dd3fc' : '#c4b5fd'} size={11} bold>
              {index < 3 ? 'NETWORK BITS' : 'HOST BITS'}
            </SvgText>
          </g>
        ))}

        <SvgText x={410} y={164} color="#94a3b8" size={10}>AND RESULT → NETWORK ID = 192.168.1.0</SvgText>

        {stage >= 2 && (
          <g>
            <rect x="250" y="184" width="320" height="40" rx="9" fill="#0b1224" stroke="#a78bfa" />
            <SvgText x={410} y={210} color="#c4b5fd" size={11} bold>HOST ID = 10</SvgText>
          </g>
        )}

        {stage === 3 && (
          <g>
            <Node x={35} y={248} w={210} h={58} label="PC1" sub="192.168.1.10" color="#38bdf8" tooltip="Local host" active />
            <Node x={300} y={248} w={210} h={58} label="PC2" sub="192.168.1.20" color="#34d399" tooltip="Same /24 subnet" active />
            <Node x={570} y={248} w={210} h={58} label="PC3" sub="192.168.2.10" color="#fb7185" tooltip="Different subnet" active />
            <LinkLine x1={245} y1={277} x2={300} y2={277} color="#34d399" active />
            <LinkLine x1={510} y1={277} x2={570} y2={277} color="#fb7185" active />
            <SvgText x={272} y={238} color="#6ee7b7" size={9}>LOCAL</SvgText>
            <SvgText x={540} y={238} color="#fda4af" size={9}>GATEWAY</SvgText>
          </g>
        )}
      </svg>
    </StepShell>
  )
}

const maskStages = [
  '/8 = 255.0.0.0 — أول 8 بتات network، والباقي host.',
  '/16 = 255.255.0.0 — أول 16 بت network، والباقي host.',
  '/24 = 255.255.255.0 — أول 24 بت network، والبايت الأخير host.',
  '/26 = 255.255.255.192 — استلفنا بتّين من الـ host للـ network.',
  '/30 = 255.255.255.252 — 30 network بت و 2 host بت بس.',
]

const maskExamples = [
  { prefix: 8, mask: '255.0.0.0' },
  { prefix: 16, mask: '255.255.0.0' },
  { prefix: 24, mask: '255.255.255.0' },
  { prefix: 26, mask: '255.255.255.192' },
  { prefix: 30, mask: '255.255.255.252' },
]

export function SubnetMaskCidrDiagram() {
  const playback = useStepPlayback(maskStages.length)
  const stage = playback.stage
  const current = maskExamples[stage]

  return (
    <StepShell title="SUBNET MASK + CIDR / PREFIX LENGTH" playback={playback} legend={maskStages[stage]}>
      <svg viewBox="0 0 820 280" className="h-auto w-full min-w-[720px]" role="img" aria-label="Subnet mask and CIDR prefix length with 32 bits">
        <title>CIDR prefix length and subnet mask binary representation</title>

        <SvgText x={410} y={36} color="#7dd3fc" size={13} bold>{`/${current.prefix} → ${current.mask}`}</SvgText>
        <SvgText x={410} y={60} color="#94a3b8" size={10}>{`NETWORK BITS = ${current.prefix} · HOST BITS = ${32 - current.prefix}`}</SvgText>

        {Array.from({ length: 32 }).map((_, index) => {
          const isNetwork = index < current.prefix
          const isBoundary = index === current.prefix
          return (
            <g key={index}>
              <motion.rect
                x={28 + index * 24}
                y="92"
                width="20"
                height="40"
                rx="4"
                fill={isNetwork ? '#38bdf8' : '#0b1224'}
                fillOpacity={isNetwork ? 0.78 : 0.95}
                stroke={isBoundary ? '#fbbf24' : isNetwork ? '#38bdf8' : '#1e3a5f'}
                strokeWidth={isBoundary ? 2.6 : 1}
                animate={{ opacity: isNetwork ? 1 : 0.75 }}
              />
              <SvgText x={38 + index * 24} y={118} color={isNetwork ? '#f8fafc' : '#64748b'} size={9} bold>
                {isNetwork ? '1' : '0'}
              </SvgText>
            </g>
          )
        })}

        <SvgText x={410} y={168} color="#64748b" size={10}>VALID MASK = CONTINUOUS 1s FOLLOWED BY CONTINUOUS 0s</SvgText>

        <g>
          <rect x="180" y="196" width="200" height="46" rx="9" fill="#38bdf8" fillOpacity="0.12" stroke="#38bdf8" />
          <SvgText x={280} y={225} color="#7dd3fc" size={11} bold>NETWORK / PREFIX</SvgText>
          <rect x="440" y="196" width="200" height="46" rx="9" fill="#a78bfa" fillOpacity="0.12" stroke="#a78bfa" />
          <SvgText x={540} y={225} color="#c4b5fd" size={11} bold>HOST / RANGE</SvgText>
        </g>
      </svg>
    </StepShell>
  )
}

const rangeStages = [
  '`Network Address` = أول عنوان في الشبكة، كل الـ host bits بصفر. مش بيتخصّص لجهاز عادي.',
  '`First Usable Host` = العنوان اللي بعد الـ network مباشرة: 192.168.1.1.',
  '`Last Usable Host` = العنوان اللي قبل الـ broadcast مباشرة: 192.168.1.254.',
  '`Broadcast Address` = آخر عنوان، كل الـ host bits بـ 1. مش بيتخصّص لجهاز عادي.',
]

export function IpRangeDiagram() {
  const playback = useStepPlayback(rangeStages.length)
  const stage = playback.stage
  const points = [
    { x: 120, label: '.0', color: '#fb7185', title: 'NETWORK' },
    { x: 320, label: '.1', color: '#34d399', title: 'FIRST HOST' },
    { x: 610, label: '.254', color: '#34d399', title: 'LAST HOST' },
    { x: 760, label: '.255', color: '#fb7185', title: 'BROADCAST' },
  ]
  const current = points[stage]

  return (
    <StepShell title="NETWORK / BROADCAST / USABLE RANGE /24" playback={playback} legend={rangeStages[stage]}>
      <svg viewBox="0 0 820 290" className="h-auto w-full min-w-[720px]" role="img" aria-label="Network, broadcast and usable host range for 192.168.1.0/24">
        <title>Network address, broadcast address and usable host range</title>

        <SvgText x={410} y={38} color="#7dd3fc" size={13} bold>192.168.1.0 /24</SvgText>

        <line x1="90" y1="120" x2="780" y2="120" stroke="#1e3a5f" strokeWidth="16" strokeLinecap="round" />
        <line x1="130" y1="120" x2="750" y2="120" stroke="#34d399" strokeOpacity="0.45" strokeWidth="12" strokeLinecap="round" />

        {points.map((point, index) => (
          <g key={point.label}>
            <motion.circle
              cx={point.x}
              cy="120"
              r={stage === index ? 15 : 9}
              fill={point.color}
              fillOpacity={stage === index ? 0.95 : 0.45}
              animate={{ scale: stage === index ? 1.1 : 1 }}
            />
            <SvgText x={point.x} y={96} color={stage === index ? point.color : '#64748b'} size={10} bold>{point.title}</SvgText>
            <SvgText x={point.x} y={162} color={stage === index ? point.color : '#64748b'} size={11} bold>{point.label}</SvgText>
          </g>
        ))}

        <Packet point={{ x: current.x, y: 120 }} color={current.color} label={current.title} />

        <g>
          <rect x="150" y="198" width="520" height="56" rx="10" fill="#0b1224" stroke="#38bdf8" strokeOpacity="0.4" />
          <SvgText x={410} y={222} color="#e0f2fe" size={11} bold>TOTAL ADDRESSES = 256 · USABLE HOSTS = 254</SvgText>
          <SvgText x={410} y={242} color="#94a3b8" size={10}>NETWORK .0 · FIRST .1 · LAST .254 · BROADCAST .255</SvgText>
        </g>
      </svg>
    </StepShell>
  )
}

const subnet26Data = [
  { network: '192.168.1.0/26', broadcast: '.63', first: '.1', last: '.62' },
  { network: '192.168.1.64/26', broadcast: '.127', first: '.65', last: '.126' },
  { network: '192.168.1.128/26', broadcast: '.191', first: '.129', last: '.190' },
  { network: '192.168.1.192/26', broadcast: '.255', first: '.193', last: '.254' },
]

const subnet26Stages = [
  'الأصل `192.168.1.0/24`: 8 host bits، 256 عنوان، 254 usable.',
  'الجديد `/26`: استلفنا `26 - 24 = 2` bits، فالـ host bits بقوا `32 - 26 = 6`.',
  'عدد الشبكات `2^2 = 4`، وعناوين كل شبكة `2^6 = 64`، والـ usable `64 - 2 = 62`.',
  'Block size = `256 - 192 = 64`، فالشبكات تبدأ عند 0 و 64 و 128 و 192.',
]

export function Subnet26Diagram() {
  const playback = useStepPlayback(subnet26Stages.length)
  const stage = playback.stage
  const current = subnet26Data[Math.min(stage, 3)]

  return (
    <StepShell title="SUBNETTING /24 → /26 / FOUR SUBNETS" playback={playback} legend={subnet26Stages[stage]}>
      <svg viewBox="0 0 820 320" className="h-auto w-full min-w-[720px]" role="img" aria-label="Dividing 192.168.1.0/24 into four /26 subnets">
        <title>Subnetting a /24 into four /26 networks with block size 64</title>

        <SvgText x={410} y={36} color="#7dd3fc" size={13} bold>/24 → /26 · BORROWED = 2 · HOST BITS = 6 · BLOCK = 64</SvgText>

        {subnet26Data.map((subnet, index) => {
          const x = 45 + index * 190
          const active = stage === index || (stage === 2 && true)
          return (
            <g key={subnet.network}>
              <motion.rect
                x={x}
                y="82"
                width="170"
                height="86"
                rx="10"
                fill={active ? '#38bdf8' : '#0b1224'}
                fillOpacity={active ? 0.16 : 0.9}
                stroke={active ? '#38bdf8' : '#1e3a5f'}
                strokeWidth={active ? 2.4 : 1}
                animate={{ opacity: active ? 1 : 0.7 }}
              />
              <SvgText x={x + 85} y={108} color={active ? '#e0f2fe' : '#94a3b8'} size={10} bold>{`SUBNET ${index + 1}`}</SvgText>
              <SvgText x={x + 85} y={132} color={active ? '#7dd3fc' : '#64748b'} size={10}>{subnet.network}</SvgText>
              <SvgText x={x + 85} y={153} color="#94a3b8" size={9}>{`BC ${subnet.broadcast} · ${subnet.first}-${subnet.last}`}</SvgText>
            </g>
          )
        })}

        {stage >= 2 && (
          <g>
            <rect x="180" y="206" width="460" height="70" rx="10" fill="#0b1224" stroke="#34d399" strokeOpacity="0.5" />
            <SvgText x={410} y={232} color="#6ee7b7" size={12} bold>{`SELECTED: ${current.network}`}</SvgText>
            <SvgText x={410} y={256} color="#cbd5e1" size={10}>{`BROADCAST ${current.broadcast} · USABLE ${current.first} → ${current.last} · 62 HOSTS`}</SvgText>
          </g>
        )}
      </svg>
    </StepShell>
  )
}

const blockStages = [
  'في `/26` الماسك `255.255.255.192`. آخر octet فيه 192.',
  'Block size = `256 - 192 = 64`. يعني كل شبكة تكبر 64 عنوان.',
  'ابدأ من صفر واقفز: `0 → 64 → 128 → 192`. دول عناوين الشبكات.',
  'الـ broadcast لكل شبكة هو العنوان اللي قبل الشبكة اللي بعدها: 63، 127، 191، 255.',
]

export function BlockSizeDiagram() {
  const playback = useStepPlayback(blockStages.length)
  const stage = playback.stage
  const jumps = [0, 64, 128, 192, 256]

  return (
    <StepShell title="BLOCK SIZE METHOD / 256 − 192 = 64" playback={playback} legend={blockStages[stage]}>
      <svg viewBox="0 0 820 290" className="h-auto w-full min-w-[720px]" role="img" aria-label="Block size method jumping by 64 in the last octet">
        <title>Block size method for subnetting with mask 255.255.255.192</title>

        <SvgText x={410} y={36} color="#7dd3fc" size={13} bold>LAST OCTET: 256 − 192 = 64</SvgText>

        <line x1="70" y1="110" x2="770" y2="110" stroke="#1e3a5f" strokeWidth="14" strokeLinecap="round" />

        {jumps.map((jump, index) => {
          const x = 70 + (jump / 256) * 700
          return (
            <g key={jump}>
              <motion.circle
                cx={x}
                cy="110"
                r={stage >= 2 && index <= Math.min(stage - 2, 4) ? 12 : 8}
                fill={index === 4 ? '#fb7185' : '#38bdf8'}
                fillOpacity={stage >= 2 && index <= Math.min(stage - 2, 4) ? 0.95 : 0.45}
              />
              <SvgText x={x} y={146} color={stage >= 2 ? '#7dd3fc' : '#64748b'} size={11} bold>{String(jump)}</SvgText>
            </g>
          )
        })}

        {[0, 64, 128, 192].map((start, index) => (
          <motion.rect
            key={start}
            x={70 + (start / 256) * 700}
            y="176"
            width={(64 / 256) * 700}
            height="38"
            rx="7"
            fill={index === stage - 2 ? '#34d399' : '#0b1224'}
            fillOpacity={index === stage - 2 ? 0.22 : 0.9}
            stroke={index === stage - 2 ? '#34d399' : '#1e3a5f'}
            animate={{ opacity: index === stage - 2 ? 1 : 0.6 }}
          />
        ))}

        <SvgText x={410} y={250} color="#94a3b8" size={10}>BROADCAST = ONE LESS THAN THE NEXT NETWORK ADDRESS</SvgText>
      </svg>
    </StepShell>
  )
}

const flsmVlsmStages = [
  '`FLSM`: كل الـ subnets ليها نفس الـ mask ونفس عدد العناوين — بسيط لكن ممكن يضيّع عناوين.',
  '`VLSM`: كل subnet بياخد prefix مناسب لحجمه — توزيع أدق وأقل هدر.',
  'القاعدة: رتّب الاحتياجات من الأكبر للأصغر، وابدأ التخصيص من أول عنوان متاح.',
]

export function FlsmVlsmDiagram() {
  const playback = useStepPlayback(flsmVlsmStages.length)
  const stage = playback.stage

  return (
    <StepShell title="FLSM vs VLSM / SAME MASK vs MIXED MASKS" playback={playback} legend={flsmVlsmStages[stage]}>
      <svg viewBox="0 0 820 300" className="h-auto w-full min-w-[720px]" role="img" aria-label="Comparison between FLSM and VLSM address allocation">
        <title>Fixed Length Subnet Mask compared with Variable Length Subnet Mask</title>

        <SvgText x={220} y={40} color="#7dd3fc" size={12} bold>FLSM — ALL /26</SvgText>
        <SvgText x={600} y={40} color="#6ee7b7" size={12} bold>VLSM — MIXED PREFIXES</SvgText>

        {[0, 1, 2, 3].map((index) => (
          <motion.rect
            key={`flsm-${index}`}
            x={40 + index * 90}
            y="66"
            width="84"
            height="54"
            rx="8"
            fill={stage === 0 ? '#38bdf8' : '#0b1224'}
            fillOpacity={stage === 0 ? 0.2 : 0.9}
            stroke={stage === 0 ? '#38bdf8' : '#1e3a5f'}
            animate={{ opacity: stage === 0 ? 1 : 0.7 }}
          />
        ))}
        {[0, 1, 2, 3].map((index) => (
          <SvgText key={`flsm-t-${index}`} x={82 + index * 90} y={99} color={stage === 0 ? '#e0f2fe' : '#64748b'} size={10} bold>64</SvgText>
        ))}

        {(() => {
          let x = 430
          return [
            { w: 160, label: '/25' },
            { w: 96, label: '/26' },
            { w: 56, label: '/27' },
            { w: 32, label: '/28' },
          ].map((item) => {
            const rect = (
              <motion.rect
                key={`vlsm-${item.label}`}
                x={x}
                y="66"
                width={item.w - 4}
                height="54"
                rx="8"
                fill={stage >= 1 ? '#34d399' : '#0b1224'}
                fillOpacity={stage >= 1 ? 0.2 : 0.9}
                stroke={stage >= 1 ? '#34d399' : '#1e3a5f'}
                animate={{ opacity: stage >= 1 ? 1 : 0.7 }}
              />
            )
            const label = (
              <SvgText key={`vlsm-t-${item.label}`} x={x + (item.w - 4) / 2} y={99} color={stage >= 1 ? '#d1fae5' : '#64748b'} size={10} bold>
                {item.label}
              </SvgText>
            )
            x += item.w
            return [rect, label]
          })
        })()}

        <g>
          <rect x="40" y="168" width="340" height="90" rx="10" fill="#0b1224" stroke="#38bdf8" strokeOpacity="0.35" />
          <SvgText x={210} y={196} color="#7dd3fc" size={11} bold>FLSM</SvgText>
          <SvgText x={210} y={220} color="#cbd5e1" size={10}>SAME MASK · EQUAL BLOCKS</SvgText>
          <SvgText x={210} y={242} color="#94a3b8" size={9}>EASY BUT CAN WASTE ADDRESSES</SvgText>

          <rect x="430" y="168" width="350" height="90" rx="10" fill="#0b1224" stroke="#34d399" strokeOpacity="0.35" />
          <SvgText x={605} y={196} color="#6ee7b7" size={11} bold>VLSM</SvgText>
          <SvgText x={605} y={220} color="#cbd5e1" size={10}>DIFFERENT PREFIXES · RIGHT-SIZED</SvgText>
          <SvgText x={605} y={242} color="#94a3b8" size={9}>EFFICIENT · PLAN LARGEST FIRST</SvgText>
        </g>
      </svg>
    </StepShell>
  )
}

const vlsmAllocations = [
  { label: 'A', hosts: 100, prefix: 25, mask: '.128', network: '192.168.10.0', first: '.1', last: '.126', broadcast: '.127', start: 0, size: 128, color: '#38bdf8' },
  { label: 'B', hosts: 50, prefix: 26, mask: '.192', network: '192.168.10.128', first: '.129', last: '.190', broadcast: '.191', start: 128, size: 64, color: '#34d399' },
  { label: 'C', hosts: 20, prefix: 27, mask: '.224', network: '192.168.10.192', first: '.193', last: '.222', broadcast: '.223', start: 192, size: 32, color: '#a78bfa' },
  { label: 'D', hosts: 10, prefix: 28, mask: '.240', network: '192.168.10.224', first: '.225', last: '.238', broadcast: '.239', start: 224, size: 16, color: '#fbbf24' },
]

const vlsmStages = [
  'المطلوب: A = 100، B = 50، C = 20، D = 10 hosts من `192.168.10.0/24`.',
  'ابدأ بالأكبر: 100 محتاج 7 host bits لأن `2^7 = 128`. يعني `/25` والماسك `255.255.255.128`.',
  'باقي `.128/25`. لـ 50 host محتاج 6 bits (`2^6 = 64`) → `/26` والماسك `.192`.',
  'باقي `.192/26`. لـ 20 host محتاج 5 bits (`2^5 = 32`) → `/27` والماسك `.224`.',
  'باقي `.224/27`. لـ 10 host محتاج 4 bits (`2^4 = 16`) → `/28` والماسك `.240`. الفاضل `.240/28`.',
]

export function VlsmAllocationDiagram() {
  const playback = useStepPlayback(vlsmStages.length)
  const stage = playback.stage
  const current = vlsmAllocations[Math.min(stage, 3)]

  return (
    <StepShell title="VLSM ALLOCATION / 192.168.10.0/24" playback={playback} legend={vlsmStages[stage]}>
      <svg viewBox="0 0 820 330" className="h-auto w-full min-w-[720px]" role="img" aria-label="VLSM allocation from 192.168.10.0/24 for four departments">
        <title>VLSM allocation example from 192.168.10.0/24</title>

        <SvgText x={410} y={36} color="#7dd3fc" size={13} bold>ALLOCATE LARGEST FIRST · 192.168.10.0/24</SvgText>

        {vlsmAllocations.map((item, index) => {
          const x = 45 + (item.start / 256) * 720
          const width = (item.size / 256) * 720
          const visible = stage >= index + 1
          return (
            <motion.g key={item.label} animate={{ opacity: visible ? 1 : 0.18 }}>
              <rect x={x} y="72" width={width} height="62" rx="7" fill={item.color} fillOpacity={visible ? 0.22 : 0.06} stroke={item.color} />
              <SvgText x={x + width / 2} y={98} color={visible ? '#f8fafc' : '#64748b'} size={11} bold>{`DEPT ${item.label}`}</SvgText>
              <SvgText x={x + width / 2} y={118} color={visible ? item.color : '#475569'} size={9}>{`/1${item.prefix}`}</SvgText>
            </motion.g>
          )
        })}

        <motion.g animate={{ opacity: stage >= 4 ? 1 : 0.18 }}>
          <rect x={45 + (240 / 256) * 720} y="72" width={(16 / 256) * 720} height="62" rx="7" fill="#0b1224" stroke="#64748b" strokeDasharray="5 4" />
          <SvgText x={45 + (248 / 256) * 720} y={110} color="#94a3b8" size={8}>FREE</SvgText>
        </motion.g>

        {stage >= 1 && (
          <g>
            <rect x="150" y="174" width="520" height="112" rx="10" fill="#0b1224" stroke={current.color} strokeOpacity="0.6" />
            <SvgText x={410} y={200} color={current.color} size={12} bold>{`DEPT ${current.label}: ${current.hosts} HOSTS → /1${current.prefix}`}</SvgText>
            <SvgText x={410} y={226} color="#cbd5e1" size={10}>{`MASK 255.255.255${current.mask} · NETWORK ${current.network}/1${current.prefix}`}</SvgText>
            <SvgText x={410} y={248} color="#94a3b8" size={10}>{`USABLE ${current.first} → ${current.last} · BROADCAST ${current.broadcast}`}</SvgText>
            <SvgText x={410} y={270} color="#64748b" size={9}>NEXT FREE RANGE STARTS IMMEDIATELY AFTER THIS BLOCK</SvgText>
          </g>
        )}
      </svg>
    </StepShell>
  )
}

const labStages = [
  'التوبولوجيا: R1 متصل بـ SW1، والـ SW1 فيه VLAN 10 لـ Department A و VLAN 20 لـ Department B.',
  'PC1 في `192.168.10.0/25` والـ gateway بتاعه `R1 G0/0.10 = 192.168.10.1`.',
  'PC2 و PC3 في `192.168.10.128/26` والـ gateway بتاعهم `R1 G0/0.20 = 192.168.10.129`.',
  'الراوتر بيوجّه بين الشبكتين من جدول `show ip route` والـ ping لازم ينجح في الاتجاهين.',
]

export function Ipv4LabTopologyDiagram() {
  const playback = useStepPlayback(labStages.length)
  const stage = playback.stage
  const points = [
    { x: 250, y: 152, label: 'PC1' },
    { x: 600, y: 152, label: 'PC2/PC3' },
  ]
  const current = points[Math.min(stage, 1)]

  return (
    <StepShell title="PACKET TRACER LAB / R1 + SW1 + PC1–PC3" playback={playback} legend={labStages[stage]}>
      <svg viewBox="0 0 820 330" className="h-auto w-full min-w-[720px]" role="img" aria-label="Packet Tracer lab topology with router, switch and three PCs">
        <title>Packet Tracer topology for IPv4 addressing and VLSM lab</title>

        <Node x={40} y={42} w={230} h={68} label="R1" sub="G0/0.10 + G0/0.20" color="#38bdf8" tooltip="Router with two subinterfaces" active />
        <Node x={300} y={42} w={220} h={68} label="SW1" sub="VLAN 10 + VLAN 20" color="#a78bfa" tooltip="Layer 2 switch with trunk to R1" active={stage >= 0} />
        <LinkLine x1={270} y1={76} x2={300} y2={76} color="#38bdf8" active />

        <Node x={90} y={200} w={190} h={72} label="PC1" sub="192.168.10.10/25" color="#34d399" tooltip="Department A host" active={stage >= 1} />
        <Node x={540} y={130} w={190} h={60} label="PC2" sub="192.168.10.130/26" color="#fbbf24" tooltip="Department B host" active={stage >= 2} />
        <Node x={540} y={220} w={190} h={60} label="PC3" sub="192.168.10.131/26" color="#fbbf24" tooltip="Department B host" active={stage >= 2} />

        <LinkLine x1={185} y1={200} x2={380} y2={110} color="#34d399" active={stage >= 1} />
        <LinkLine x1={520} y1={110} x2={540} y2={160} color="#fbbf24" active={stage >= 2} />
        <LinkLine x1={520} y1={110} x2={540} y2={250} color="#fbbf24" active={stage >= 2} />

        <SvgText x={185} y={288} color="#6ee7b7" size={9}>VLAN 10 · GW .1</SvgText>
        <SvgText x={635} y={300} color="#fde68a" size={9}>VLAN 20 · GW .129</SvgText>

        {stage >= 1 && stage <= 2 && <Packet point={current} color={stage === 1 ? '#34d399' : '#fbbf24'} label={stage === 1 ? '.10' : '.130'} />}

        {stage === 3 && (
          <g>
            <rect x="250" y="255" width="320" height="46" rx="9" fill="#0b1224" stroke="#38bdf8" strokeOpacity="0.5" />
            <SvgText x={410} y={283} color="#7dd3fc" size={10} bold>ROUTE: .0/25 + .128/26 · PING OK</SvgText>
          </g>
        )}
      </svg>
    </StepShell>
  )
}
