import { motion } from 'framer-motion'
import { Node, Shell, usePlayback } from './ArchitectureDiagrams'

const mono = 'JetBrains Mono, monospace'

export function SvgText({
  x,
  y,
  children,
  color = '#64748b',
  size = 10,
  anchor = 'middle',
  bold = false,
}: {
  x: number
  y: number
  children: string
  color?: string
  size?: number
  anchor?: 'start' | 'middle' | 'end'
  bold?: boolean
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} fill={color} fontFamily={mono} fontSize={size} fontWeight={bold ? 700 : 400}>
      {children}
    </text>
  )
}

const smfStages = [
  '`TX` بيحوّل الإشارة الكهربائية لـ light pulses باستخدام `laser`',
  'الـ laser بيدخل شعاع واحد في الـ `core` الرفيع — single propagation mode',
  'الـ `cladding` يفضل الضوء جوه الـ core عن طريق total internal reflection',
  'الـ `RX` بيحوّل الـ light pulses لـ electrical signal ويعيد بناء الـ bits',
]

export function SmfStructureDiagram() {
  const playback = usePlayback(smfStages.length)
  const positions = [120, 330, 520, 700]

  return (
    <Shell title="SINGLE-MODE FIBER / STRUCTURE + TRANSMISSION" playback={playback} legend={smfStages[playback.stage]}>
      <svg viewBox="0 0 820 290" className="h-auto w-full min-w-[720px]" role="img" aria-label="Single-mode fiber structure and laser transmission">
        <title>Single-mode fiber core, cladding, jacket, laser source and receiver</title>

        <rect x="165" y="120" width="490" height="60" rx="12" fill="#0b1224" stroke="#1e3a5f" />
        <rect x="165" y="132" width="490" height="36" fill="#102a4c" stroke="#2563eb" strokeOpacity="0.45" />
        <rect x="165" y="146" width="490" height="8" rx="4" fill="#0ea5e9" fillOpacity="0.9" />

        <Node x={15} y={110} w={130} h={80} label="TX" sub="LASER SOURCE" color="#38bdf8" tooltip="Optical transmitter — converts electrical bits into light pulses" active={playback.stage === 0} />
        <Node x={675} y={110} w={130} h={80} label="RX" sub="PHOTODIODE" color="#34d399" tooltip="Optical receiver — converts light pulses back into electrical bits" active={playback.stage === 3} />

        <motion.line
          x1="175"
          y1="150"
          x2="645"
          y2="150"
          stroke="#38bdf8"
          strokeWidth="2.5"
          strokeDasharray="6 8"
          animate={{ opacity: playback.stage === 1 || playback.stage === 2 ? 1 : 0.18, strokeDashoffset: playback.stage === 1 || playback.stage === 2 ? [0, -28] : 0 }}
          transition={{ duration: 1.1, repeat: playback.stage === 1 || playback.stage === 2 ? Infinity : 0, ease: 'linear' }}
        />

        <motion.g animate={{ x: positions[playback.stage], y: 150 }} transition={{ type: 'spring', stiffness: 150, damping: 22 }}>
          <circle r="13" fill="#38bdf8" opacity="0.22" />
          <circle r="5.5" fill="#7dd3fc" />
          <text x="0" y="-18" textAnchor="middle" fontFamily={mono} fontSize="9" fill="#7dd3fc">LIGHT</text>
        </motion.g>

        <line x1="250" y1="120" x2="250" y2="72" stroke="#475569" strokeDasharray="3 3" />
        <SvgText x={250} y={64}>PROTECTIVE JACKET</SvgText>
        <line x1="540" y1="146" x2="540" y2="72" stroke="#38bdf8" strokeDasharray="3 3" />
        <SvgText x={540} y={64} color="#7dd3fc" bold>CORE 8–10 µm</SvgText>
        <line x1="410" y1="168" x2="410" y2="222" stroke="#60a5fa" strokeDasharray="3 3" />
        <SvgText x={410} y={236} color="#93c5fd">CLADDING 125 µm</SvgText>

        <SvgText x={410} y={270} color="#64748b" size={9}>
          ONE MODE · LASER (1310 / 1550 NM) · LONG DISTANCE · IMMUNE TO EMI
        </SvgText>
      </svg>
    </Shell>
  )
}

const mmfStages = [
  '`LED` أو `VCSEL` بيطلق أكتر من زاوية ضوء جوه الـ fiber',
  'الضوء بيمشي في أكتر من `mode` داخل core أكبر (50 أو 62.5 µm)',
  'كل mode بياخد مسار مختلف الطول — دي `modal dispersion`',
  'الـ pulse بيوصل موسّع، فالـ bandwidth والـ distance بيقلّوا',
  'عشان كده MMF مناسب جوه المباني و data centers لمسافات قصيرة',
]

const mmfPaths = [
  'M 175 153 L 645 153',
  'M 175 153 Q 410 138 645 153',
  'M 175 153 Q 410 168 645 153',
]
const mmfPathY = [153, 145, 161]

export function MmfStructureDiagram() {
  const playback = usePlayback(mmfStages.length)

  return (
    <Shell title="MULTI-MODE FIBER / MODES + MODAL DISPERSION" playback={playback} legend={mmfStages[playback.stage]}>
      <svg viewBox="0 0 820 290" className="h-auto w-full min-w-[720px]" role="img" aria-label="Multimode fiber structure and modal dispersion">
        <title>Multimode fiber core, multiple light paths, LED or VCSEL source and modal dispersion</title>

        <rect x="165" y="116" width="490" height="68" rx="12" fill="#0b1224" stroke="#1e3a5f" />
        <rect x="165" y="130" width="490" height="40" fill="#132a4c" stroke="#2563eb" strokeOpacity="0.45" />
        <rect x="165" y="138" width="490" height="30" rx="4" fill="#0ea5e9" fillOpacity="0.16" stroke="#38bdf8" strokeOpacity="0.55" />

        <Node x={15} y={108} w={130} h={84} label="TX" sub="LED / VCSEL" color="#fbbf24" tooltip="Optical transmitter — LED or VCSEL launches several modes" active={playback.stage === 0} />
        <Node x={675} y={108} w={130} h={84} label="RX" sub="PHOTODIODE" color="#34d399" tooltip="Optical receiver — receives a spread-out pulse" active={playback.stage === 3 || playback.stage === 4} />

        {mmfPaths.map((path, index) => (
          <motion.path
            key={path}
            d={path}
            fill="none"
            stroke={index === 0 ? '#7dd3fc' : index === 1 ? '#fbbf24' : '#a78bfa'}
            strokeWidth="2.5"
            strokeDasharray="7 7"
            animate={{
              opacity: playback.stage >= 1 ? 1 : 0.18,
              strokeDashoffset: playback.stage >= 1 && playback.stage < 4 ? [0, -28] : 0,
            }}
            transition={{ duration: 1.2, repeat: playback.stage >= 1 && playback.stage < 4 ? Infinity : 0, ease: 'linear' }}
          />
        ))}

        {mmfPathY.map((y, index) => {
          const xs = [180, 350, 535, 600 + index * 22, 665]
          return (
            <motion.g key={y} animate={{ x: xs[playback.stage], y }} transition={{ type: 'spring', stiffness: 150, damping: 22 }}>
              <circle r="10" fill={index === 0 ? '#38bdf8' : index === 1 ? '#fbbf24' : '#a78bfa'} opacity="0.2" />
              <circle r="4" fill={index === 0 ? '#7dd3fc' : index === 1 ? '#fde68a' : '#c4b5fd'} />
            </motion.g>
          )
        })}

        <line x1="540" y1="138" x2="540" y2="72" stroke="#38bdf8" strokeDasharray="3 3" />
        <SvgText x={540} y={64} color="#7dd3fc" bold>CORE 50 / 62.5 µm</SvgText>
        <line x1="250" y1="170" x2="250" y2="222" stroke="#60a5fa" strokeDasharray="3 3" />
        <SvgText x={250} y={236} color="#93c5fd">CLADDING 125 µm</SvgText>

        <SvgText x={410} y={270} color="#64748b" size={9}>
          MULTIPLE MODES · MODAL DISPERSION · SHORT REACH · BUILDING / DATA CENTER
        </SvgText>
      </svg>
    </Shell>
  )
}

const fiberCompareStages = [
  '`SMF`: core رفيع + laser + mode واحد = مسافة أطول وتشتت أقل',
  '`MMF`: core أكبر + LED أو VCSEL + عدة modes = مسافة أقصر وتشتت modal',
  'المسافة والسرعة الفعلية بتعتمدوا على نوع الـ fiber والـ transceiver والـ wavelength ومعيار الـ Ethernet — مش على الاسم لوحده',
]

export function FiberCompareDiagram() {
  const playback = usePlayback(fiberCompareStages.length)

  const panels = [
    {
      x: 20,
      label: 'SINGLE-MODE FIBER',
      color: '#38bdf8',
      core: '8–10 µm',
      source: 'LASER',
      mode: 'ONE MODE',
      reach: 'LONG DISTANCE',
      active: playback.stage === 0 || playback.stage === 2,
    },
    {
      x: 430,
      label: 'MULTI-MODE FIBER',
      color: '#fbbf24',
      core: '50 / 62.5 µm',
      source: 'LED / VCSEL',
      mode: 'MULTIPLE MODES',
      reach: 'SHORT DISTANCE',
      active: playback.stage === 1 || playback.stage === 2,
    },
  ]

  return (
    <Shell title="SMF vs MMF / SIDE BY SIDE" playback={playback} legend={fiberCompareStages[playback.stage]}>
      <svg viewBox="0 0 820 300" className="h-auto w-full min-w-[720px]" role="img" aria-label="Single-mode and multimode fiber comparison">
        <title>Comparison of single-mode fiber and multimode fiber</title>

        {panels.map((panel) => (
          <motion.g key={panel.label} animate={{ opacity: panel.active ? 1 : 0.5 }} transition={{ duration: 0.3 }}>
            <rect x={panel.x} y="25" width="370" height="235" rx="16" fill="#0a1730" stroke={panel.color} strokeOpacity={panel.active ? 0.7 : 0.25} strokeWidth={panel.active ? 2 : 1} />
            <SvgText x={panel.x + 185} y={55} color={panel.color} size={12} bold>{panel.label}</SvgText>

            <rect x={panel.x + 35} y="85" width="300" height="46" rx="10" fill="#0b1224" stroke="#1e3a5f" />
            <rect x={panel.x + 35} y="98" width="300" height="20" fill="#102a4c" />
            <rect x={panel.x + 35} y="104" width="300" height={panel.core === '8–10 µm' ? 6 : 16} rx="3" fill={panel.color} fillOpacity="0.35" stroke={panel.color} strokeOpacity="0.6" />

            <motion.circle
              r="6"
              fill={panel.color}
              animate={{ cx: [panel.x + 55, panel.x + 315], cy: 107, opacity: panel.active ? [0.4, 1, 0.4] : 0.3 }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />

            <SvgText x={panel.x + 35} y={160} anchor="start" color="#94a3b8" size={9}>CORE</SvgText>
            <SvgText x={panel.x + 335} y={160} anchor="end" color={panel.color} size={9} bold>{panel.core}</SvgText>
            <line x1={panel.x + 35} y1={170} x2={panel.x + 335} y2={170} stroke="#1e3a5f" />

            <SvgText x={panel.x + 35} y={192} anchor="start" color="#94a3b8" size={9}>LIGHT SOURCE</SvgText>
            <SvgText x={panel.x + 335} y={192} anchor="end" color={panel.color} size={9} bold>{panel.source}</SvgText>
            <line x1={panel.x + 35} y1={202} x2={panel.x + 335} y2={202} stroke="#1e3a5f" />

            <SvgText x={panel.x + 35} y={224} anchor="start" color="#94a3b8" size={9}>PROPAGATION</SvgText>
            <SvgText x={panel.x + 335} y={224} anchor="end" color={panel.color} size={9} bold>{panel.mode}</SvgText>
            <SvgText x={panel.x + 185} y={250} color="#64748b" size={9}>{panel.reach}</SvgText>
          </motion.g>
        ))}

        <SvgText x={410} y={286} color="#64748b" size={9}>
          ACTUAL REACH DEPENDS ON FIBER TYPE · TRANSCEIVER · WAVELENGTH · ETHERNET STANDARD
        </SvgText>
      </svg>
    </Shell>
  )
}
