import { motion } from 'framer-motion'
import { Node, Shell, usePlayback } from './ArchitectureDiagrams'
import { SvgText } from './FiberDiagrams'

function twistPath(startX: number, endX: number, centerY: number, amplitude: number, turns: number) {
  const steps = turns * 2
  const dx = (endX - startX) / steps
  let path = `M ${startX} ${centerY}`
  for (let index = 0; index < steps; index += 1) {
    const controlX = startX + dx * (index + 0.5)
    const controlY = centerY + (index % 2 === 0 ? amplitude : -amplitude)
    const endPointX = startX + dx * (index + 1)
    path += ` Q ${controlX} ${controlY} ${endPointX} ${centerY}`
  }
  return path
}

const utpStages = [
  '`UTP` فيه أزواج أسلاك نحاسية مفتولة مع بعض من غير درع معدني إضافي',
  'كل pair بينقل إشارة كهربائية بقطبية معاكسة — differential signaling',
  'الـ twisting بيخلي الـ EMI يأثر على السلكين بالتقريب نفسه فيلغي معظم تأثيره',
  'الـ twisting كمان بيقلّل الـ crosstalk بين الأزواج جوه نفس الكابل',
]

export function UtpTwistDiagram() {
  const playback = usePlayback(utpStages.length)
  const pairOne = twistPath(165, 605, 120, 11, 9)
  const pairOneReturn = twistPath(165, 605, 120, -11, 9)
  const pairTwo = twistPath(165, 605, 195, 11, 9)
  const pairTwoReturn = twistPath(165, 605, 195, -11, 9)

  return (
    <Shell title="UTP / TWISTED PAIR STRUCTURE" playback={playback} legend={utpStages[playback.stage]}>
      <svg viewBox="0 0 780 290" className="h-auto w-full min-w-[700px]" role="img" aria-label="UTP twisted pair cable structure">
        <title>Unshielded twisted pair cables with two twisted pairs and RJ-45 connectors</title>

        <rect x="145" y="70" width="480" height="175" rx="18" fill="#0b1224" stroke="#1e3a5f" />
        <SvgText x={385} y={60} color="#94a3b8" size={9}>OUTER JACKET — NO METALLIC SHIELDING</SvgText>

        <motion.path d={pairOne} fill="none" stroke="#38bdf8" strokeWidth="2.6" strokeDasharray="7 7" animate={{ opacity: playback.stage >= 1 ? 1 : 0.35, strokeDashoffset: playback.stage >= 1 ? [0, -28] : 0 }} transition={{ duration: 1.2, repeat: playback.stage >= 1 ? Infinity : 0, ease: 'linear' }} />
        <motion.path d={pairOneReturn} fill="none" stroke="#7dd3fc" strokeWidth="2.6" strokeDasharray="7 7" animate={{ opacity: playback.stage >= 1 ? 1 : 0.35, strokeDashoffset: playback.stage >= 1 ? [0, -28] : 0 }} transition={{ duration: 1.2, repeat: playback.stage >= 1 ? Infinity : 0, ease: 'linear' }} />
        <motion.path d={pairTwo} fill="none" stroke="#fbbf24" strokeWidth="2.6" strokeDasharray="7 7" animate={{ opacity: playback.stage >= 1 ? 1 : 0.35, strokeDashoffset: playback.stage >= 1 ? [0, -28] : 0 }} transition={{ duration: 1.2, repeat: playback.stage >= 1 ? Infinity : 0, ease: 'linear' }} />
        <motion.path d={pairTwoReturn} fill="none" stroke="#fde68a" strokeWidth="2.6" strokeDasharray="7 7" animate={{ opacity: playback.stage >= 1 ? 1 : 0.35, strokeDashoffset: playback.stage >= 1 ? [0, -28] : 0 }} transition={{ duration: 1.2, repeat: playback.stage >= 1 ? Infinity : 0, ease: 'linear' }} />

        <Node x={15} y={115} w={115} h={60} label="RJ-45" sub="8P8C" color="#34d399" tooltip="Eight-position connector used for Ethernet twisted-pair cabling" />
        <Node x={650} y={115} w={115} h={60} label="RJ-45" sub="8P8C" color="#34d399" tooltip="Connector at the far end of the copper cable" />

        <SvgText x={175} y={95} anchor="start" color="#7dd3fc" size={9}>PAIR A · BLUE / WHITE-BLUE</SvgText>
        <SvgText x={175} y={170} anchor="start" color="#fde68a" size={9}>PAIR B · ORANGE / WHITE-ORANGE</SvgText>

        <motion.g animate={{ opacity: playback.stage === 2 ? 1 : 0.15 }}>
          <path d="M 300 270 L 320 245 L 305 245 L 330 218" fill="none" stroke="#fb7185" strokeWidth="2.5" />
          <SvgText x={345} y={235} anchor="start" color="#fb7185" size={10} bold>EMI</SvgText>
          <SvgText x={345} y={252} anchor="start" color="#94a3b8" size={9}>CANCELLED BY TWIST + DIFFERENTIAL SIGNAL</SvgText>
        </motion.g>

        <motion.g animate={{ opacity: playback.stage === 3 ? 1 : 0.15 }}>
          <path d="M 500 120 L 500 195" fill="none" stroke="#a78bfa" strokeWidth="2" strokeDasharray="4 4" />
          <SvgText x={515} y={162} anchor="start" color="#a78bfa" size={9}>CROSSTALK REDUCED</SvgText>
        </motion.g>

        <SvgText x={390} y={285} color="#64748b" size={9}>
          Cat5e · Cat6 · Cat6a USE TWISTED PAIRS · TYPICAL ETHERNET CHANNEL LIMIT IS 100 m
        </SvgText>
      </svg>
    </Shell>
  )
}

const stpStages = [
  '`UTP`: مفيش درع معدني — أخف وأرخص، لكن أقل مقاومة للـ EMI',
  '`STP`: درع معدني حول الـ pair أو الكابل كله — حماية أكبر من EMI',
  'الـ shielding لازم يتأرضي صح، وإلا ممكن يجمع noise زي هوائي',
  `الـ RJ-45 بيستخدم في الاتنين، لكن الـ STP محتاج موصل متوافق مع الأرضي`,
]

export function UtpStpDiagram() {
  const playback = usePlayback(stpStages.length)

  const panels = [
    { x: 20, label: 'UTP', color: '#38bdf8', shield: 'NO METALLIC SHIELD', note: 'LOWER COST · FLEXIBLE', active: playback.stage === 0 || playback.stage === 3 },
    { x: 430, label: 'STP', color: '#a78bfa', shield: 'FOIL / BRAID SHIELD', note: 'BETTER EMI PROTECTION', active: playback.stage === 1 || playback.stage === 2 || playback.stage === 3 },
  ]

  return (
    <Shell title="UTP vs STP / SHIELDING" playback={playback} legend={stpStages[playback.stage]}>
      <svg viewBox="0 0 820 300" className="h-auto w-full min-w-[720px]" role="img" aria-label="Unshielded and shielded twisted pair comparison">
        <title>UTP and STP cable shielding comparison</title>

        {panels.map((panel) => (
          <motion.g key={panel.label} animate={{ opacity: panel.active ? 1 : 0.5 }} transition={{ duration: 0.3 }}>
            <rect x={panel.x} y="25" width="370" height="225" rx="16" fill="#0a1730" stroke={panel.color} strokeOpacity={panel.active ? 0.7 : 0.25} strokeWidth={panel.active ? 2 : 1} />
            <SvgText x={panel.x + 185} y={55} color={panel.color} size={13} bold>{panel.label}</SvgText>

            <rect x={panel.x + 35} y="80" width="300" height="105" rx="12" fill="#0b1224" stroke="#1e3a5f" />
            {panel.label === 'STP' && (
              <>
                <rect x={panel.x + 42} y="87" width="286" height="91" rx="8" fill="none" stroke="#a78bfa" strokeWidth="2" strokeDasharray="6 5" />
                <rect x={panel.x + 55} y="97" width="260" height="28" rx="6" fill="none" stroke="#94a3b8" strokeOpacity="0.6" />
                <rect x={panel.x + 55} y="137" width="260" height="28" rx="6" fill="none" stroke="#94a3b8" strokeOpacity="0.6" />
              </>
            )}

            <motion.path d={twistPath(panel.x + 55, panel.x + 315, 111, 8, 8)} fill="none" stroke="#38bdf8" strokeWidth="2.2" animate={{ opacity: 0.9 }} />
            <motion.path d={twistPath(panel.x + 55, panel.x + 315, 111, -8, 8)} fill="none" stroke="#7dd3fc" strokeWidth="2.2" animate={{ opacity: 0.9 }} />
            <motion.path d={twistPath(panel.x + 55, panel.x + 315, 151, 8, 8)} fill="none" stroke="#fbbf24" strokeWidth="2.2" animate={{ opacity: 0.9 }} />
            <motion.path d={twistPath(panel.x + 55, panel.x + 315, 151, -8, 8)} fill="none" stroke="#fde68a" strokeWidth="2.2" animate={{ opacity: 0.9 }} />

            <SvgText x={panel.x + 35} y={210} anchor="start" color="#94a3b8" size={9}>SHIELDING</SvgText>
            <SvgText x={panel.x + 335} y={210} anchor="end" color={panel.color} size={9} bold>{panel.shield}</SvgText>
            <SvgText x={panel.x + 185} y={238} color="#64748b" size={9}>{panel.note}</SvgText>
          </motion.g>
        ))}

        <motion.g animate={{ opacity: playback.stage === 2 ? 1 : 0.12 }}>
          <path d="M 570 275 L 570 248" stroke="#34d399" strokeWidth="2.5" />
          <path d="M 562 248 L 578 248 L 562 238 L 578 238 Z" fill="#34d399" />
          <SvgText x={590} y={268} anchor="start" color="#34d399" size={10} bold>GROUND THE SHIELD CORRECTLY</SvgText>
        </motion.g>

        <SvgText x={410} y={290} color="#64748b" size={9}>
          RJ-45 IS COMMON TO BOTH · STP NEEDS A SHIELD-COMPATIBLE CONNECTOR AND PROPER GROUNDING
        </SvgText>
      </svg>
    </Shell>
  )
}

const copperFiberStages = [
  '`Copper`: electrical signals over twisted pairs · RJ-45 · EMI-sensitive · about 100 m channel',
  '`Fiber`: light pulses over glass · laser or LED · immune to EMI · much longer reach',
  'الـ copper أرخص وأسهل تركيب؛ الـ fiber أغلى بس أسرع وأبعد ومش بيتأثر بالـ EMI',
  'الاختيار بيعتمد على المسافة والـ bandwidth والـ EMI والتكلفة والـ transceiver المتاح',
]

export function CopperFiberDiagram() {
  const playback = usePlayback(copperFiberStages.length)

  return (
    <Shell title="COPPER vs FIBER / SIGNAL MEDIUM" playback={playback} legend={copperFiberStages[playback.stage]}>
      <svg viewBox="0 0 820 320" className="h-auto w-full min-w-[720px]" role="img" aria-label="Copper electrical transmission compared with fiber optic light transmission">
        <title>Copper electrical signals versus fiber optic light signals</title>

        <motion.g animate={{ opacity: playback.stage === 0 || playback.stage >= 2 ? 1 : 0.35 }}>
          <rect x="20" y="35" width="780" height="105" rx="14" fill="#0a1730" stroke="#38bdf8" strokeOpacity={playback.stage === 0 ? 0.7 : 0.3} />
          <Node x={40} y={60} w={100} h={55} label="DEVICE A" sub="NIC" color="#38bdf8" tooltip="Copper Ethernet interface" active={playback.stage === 0} />
          <Node x={680} y={60} w={100} h={55} label="DEVICE B" sub="NIC" color="#38bdf8" tooltip="Far-end copper Ethernet interface" active={playback.stage === 0} />
          <rect x="155" y="72" width="510" height="30" rx="8" fill="#0b1224" stroke="#1e3a5f" />
          <motion.path d="M 165 87 Q 195 62 225 87 T 285 87 T 345 87 T 405 87 T 465 87 T 525 87 T 585 87 T 645 87" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="7 6" animate={{ strokeDashoffset: playback.stage === 0 ? [0, -26] : 0, opacity: 1 }} transition={{ duration: 1.2, repeat: playback.stage === 0 ? Infinity : 0, ease: 'linear' }} />
          <SvgText x={410} y={125} color="#fbbf24" size={9}>ELECTRICAL SIGNAL · TWISTED PAIR · EMI / CROSSTALK POSSIBLE</SvgText>
          <SvgText x={745} y={88} color="#fb7185" size={9}>~100 m</SvgText>
        </motion.g>

        <motion.g animate={{ opacity: playback.stage === 1 || playback.stage >= 2 ? 1 : 0.35 }}>
          <rect x="20" y="170" width="780" height="105" rx="14" fill="#0a1730" stroke="#a78bfa" strokeOpacity={playback.stage === 1 ? 0.7 : 0.3} />
          <Node x={40} y={195} w={100} h={55} label="DEVICE A" sub="OPTICS" color="#a78bfa" tooltip="Optical Ethernet interface with transceiver" active={playback.stage === 1} />
          <Node x={680} y={195} w={100} h={55} label="DEVICE B" sub="OPTICS" color="#a78bfa" tooltip="Far-end optical interface" active={playback.stage === 1} />
          <rect x="155" y="207" width="510" height="30" rx="8" fill="#0b1224" stroke="#1e3a5f" />
          <motion.line x1="165" y1="222" x2="655" y2="222" stroke="#a78bfa" strokeWidth="2.5" strokeDasharray="7 8" animate={{ strokeDashoffset: playback.stage === 1 ? [0, -30] : 0, opacity: 1 }} transition={{ duration: 1.2, repeat: playback.stage === 1 ? Infinity : 0, ease: 'linear' }} />
          <motion.circle r="6" fill="#c4b5fd" animate={{ cx: [170, 650], cy: 222, opacity: playback.stage === 1 ? [0.3, 1, 0.3] : 0.4 }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} />
          <SvgText x={410} y={260} color="#c4b5fd" size={9}>LIGHT PULSES · GLASS FIBER · NO EMI · LONGER REACH</SvgText>
          <SvgText x={745} y={223} color="#34d399" size={9}>Km+</SvgText>
        </motion.g>

        <SvgText x={410} y={305} color="#64748b" size={9}>
          MEDIA CHOICE DEPENDS ON DISTANCE · BANDWIDTH · EMI · COST · TRANSCEIVER AVAILABILITY
        </SvgText>
      </svg>
    </Shell>
  )
}

const signalStages = [
  '`Device A` بيولّد bits كهربائية 0 و 1 على الـ NIC',
  'الـ `RJ-45` بيوصل الإشارة لزوج نحاسي ملفوف',
  'الإشارة بتمشي في الكابل وبيحصل `attenuation` تدريجي',
  '`EMI` أو `crosstalk` ممكن يضيفوا noise ويغيّروا الـ voltage',
  '`Device B` بيستقبل الإشارة ويعيد تشكيل الـ clock والـ bits',
  'لو الـ noise كتير، الـ `CRC` يفشل وتظهر `input errors` و `CRC errors`',
]

export function PhysicalSignalDiagram() {
  const playback = usePlayback(signalStages.length)
  const positions = [75, 180, 310, 430, 570, 700]

  return (
    <Shell title="PHYSICAL SIGNAL TRANSMISSION / COPPER" playback={playback} legend={signalStages[playback.stage]}>
      <svg viewBox="0 0 820 300" className="h-auto w-full min-w-[720px]" role="img" aria-label="Electrical signal transmission from device A through twisted-pair cable to device B">
        <title>Physical signal transmission over copper with attenuation, interference and error detection</title>

        <Node x={20} y={105} w={110} h={65} label="DEVICE A" sub="BITS 1 0 1 1" color="#38bdf8" tooltip="Source endpoint generating electrical bits" active={playback.stage === 0} />
        <Node x={690} y={105} w={110} h={65} label="DEVICE B" sub="RECOVER BITS" color="#34d399" tooltip="Destination endpoint reconstructing the bits" active={playback.stage === 4 || playback.stage === 5} />
        <Node x={145} y={115} w={70} h={45} label="RJ-45" sub="8P8C" color="#fbbf24" tooltip="Modular connector at the near end" active={playback.stage === 1} />
        <Node x={605} y={115} w={70} h={45} label="RJ-45" sub="8P8C" color="#fbbf24" tooltip="Modular connector at the far end" active={playback.stage === 4} />

        <rect x="225" y="118" width="370" height="42" rx="10" fill="#0b1224" stroke="#1e3a5f" />
        <motion.path d={twistPath(235, 585, 139, 8, 10)} fill="none" stroke="#38bdf8" strokeWidth="2.4" animate={{ opacity: 0.9 }} />
        <motion.path d={twistPath(235, 585, 139, -8, 10)} fill="none" stroke="#7dd3fc" strokeWidth="2.4" animate={{ opacity: 0.9 }} />

        <motion.g animate={{ x: positions[playback.stage], y: 139 }} transition={{ type: 'spring', stiffness: 150, damping: 22 }}>
          <circle r="12" fill={playback.stage === 5 ? '#fb7185' : '#fbbf24'} opacity="0.22" />
          <circle r="5" fill={playback.stage === 5 ? '#fda4af' : '#fde68a'} />
          <text x="0" y="-17" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill={playback.stage === 5 ? '#fda4af' : '#fde68a'}>
            {playback.stage === 5 ? 'BAD CRC' : 'BIT'}
          </text>
        </motion.g>

        <motion.g animate={{ opacity: playback.stage === 3 || playback.stage === 5 ? 1 : 0.12 }}>
          <path d="M 350 245 L 370 218 L 355 218 L 380 190" fill="none" stroke="#fb7185" strokeWidth="2.5" />
          <SvgText x={395} y={210} anchor="start" color="#fb7185" size={10} bold>EMI / CROSSTALK</SvgText>
        </motion.g>

        <motion.g animate={{ opacity: playback.stage === 2 ? 1 : 0.15 }}>
          <path d="M 260 108 L 550 108" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 5" />
          <SvgText x={405} y={98} color="#94a3b8" size={9}>ATTENUATION →</SvgText>
        </motion.g>

        <SvgText x={410} y={275} color="#64748b" size={9}>
          PHYSICAL LAYER PROBLEMS APPEAR AS CRC / INPUT ERRORS · CHECK CABLE · CONNECTORS · EMI · SPEED / DUPLEX
        </SvgText>
      </svg>
    </Shell>
  )
}
