import { motion } from 'framer-motion'
import { useState } from 'react'
import { LinkLine, Node, Packet, Shell, usePlayback } from './ArchitectureDiagrams'
import { SvgText } from './FiberDiagrams'

function CollisionMark({ x, y, label = 'COLLISION' }: { x: number; y: number; label?: string }) {
  return (
    <motion.g animate={{ opacity: [0.45, 1, 0.45] }} transition={{ duration: 0.8, repeat: Infinity }}>
      <path
        d={`M ${x - 32} ${y} L ${x - 18} ${y - 18} L ${x - 7} ${y + 16} L ${x + 7} ${y - 18} L ${x + 19} ${y + 16} L ${x + 32} ${y}`}
        fill="none"
        stroke="#fb7185"
        strokeWidth="3"
      />
      <SvgText x={x} y={y + 34} color="#fb7185" size={10} bold>
        {label}
      </SvgText>
    </motion.g>
  )
}

const ethernetCollisionStages = [
  '`PC1` يسمع الـ shared medium فاضي ويبدأ يرسل الـ frame',
  '`PC2` يبدأ يرسل قبل ما يسمع إرسال PC1 — الاتنين شغالين half-duplex',
  'الإشارتين يتقابلوا جوه الـ hub وبيحصل `collision`',
  'الاتنين يكتشفوا التداخل ويرسلوا `jam signal` عشان الكل يعرف',
  'كل جهاز ينتظر `random backoff` مختلف قبل المحاولة',
  '`PC1` يعيد الإرسال — دي سلوكية Ethernet مشتركة قديمة',
]

export function EthernetCollisionDiagram() {
  const playback = usePlayback(ethernetCollisionStages.length)
  const stage = playback.stage

  return (
    <Shell title="ETHERNET COLLISION / SHARED HALF-DUPLEX" playback={playback} legend={ethernetCollisionStages[stage]}>
      <svg viewBox="0 0 820 330" className="h-auto w-full min-w-[720px]" role="img" aria-label="Ethernet collision on a shared half-duplex hub link">
        <title>Ethernet collision, jam signal and retransmission on a hub</title>

        <LinkLine x1={130} y1={70} x2={365} y2={145} color="#38bdf8" active={stage === 0 || stage === 1 || stage === 5} />
        <LinkLine x1={130} y1={250} x2={365} y2={185} color="#fbbf24" active={stage === 1 || stage === 4} />
        <LinkLine x1={455} y1={165} x2={680} y2={165} color="#34d399" active={stage === 2 || stage === 5} />

        <Node x={20} y={45} w={110} h={52} label="PC1" sub="SENDER" color="#38bdf8" tooltip="First station transmitting on the shared medium" active={stage === 0 || stage === 5} />
        <Node x={20} y={225} w={110} h={52} label="PC2" sub="SENDER" color="#fbbf24" tooltip="Second station transmitting before detecting PC1" active={stage === 1 || stage === 3 || stage === 4} />
        <Node x={360} y={132} w={100} h={66} label="HUB" sub="L1 REPEAT" color="#a78bfa" tooltip="Hub repeats every signal to all ports, creating one collision domain" active={stage === 2 || stage === 3} />
        <Node x={680} y={138} w={120} h={56} label="PC3" sub="SAME DOMAIN" color="#60a5fa" tooltip="Every hub port hears the same collision domain" active={stage === 2 || stage === 3} />

        {stage === 0 && <Packet point={{ x: 235, y: 92 }} color="#38bdf8" label="FRAME" />}
        {stage === 1 && (
          <>
            <Packet point={{ x: 250, y: 95 }} color="#38bdf8" label="PC1" />
            <Packet point={{ x: 250, y: 230 }} color="#fbbf24" label="PC2" />
          </>
        )}
        {stage === 2 && (
          <>
            <Packet point={{ x: 410, y: 137 }} color="#38bdf8" label="SIGNAL 1" />
            <Packet point={{ x: 410, y: 190 }} color="#fbbf24" label="SIGNAL 2" />
          </>
        )}
        {stage === 3 && <CollisionMark x={410} y={165} />}
        {stage === 4 && (
          <>
            <motion.g animate={{ x: [0, -110, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
              <rect x="390" y="120" width="110" height="26" rx="7" fill="#fb7185" fillOpacity="0.18" stroke="#fb7185" />
              <SvgText x={445} y={137} color="#fda4af" size={9} bold>JAM →</SvgText>
            </motion.g>
            <SvgText x={410} y={235} color="#a78bfa" size={10} bold>RANDOM BACKOFF TIMER</SvgText>
          </>
        )}
        {stage === 5 && <Packet point={{ x: 570, y: 165 }} color="#34d399" label="RETRY" />}

        <SvgText x={410} y={305} color="#64748b" size={9}>
          LEGACY SHARED ETHERNET · ONE COLLISION DOMAIN · CSMA/CD · NOT NORMAL ON MODERN FULL-DUPLEX LINKS
        </SvgText>
      </svg>
    </Shell>
  )
}

const backoffStages = [
  'بعد الـ jam، كل جهاز يختار زمن عشوائي من نافذة backoff',
  'أول collision: النافذة `0..1 slot times` — PC1 يختار 0 و PC2 يختار 1',
  'PC1 يعيد الإرسال أولاً وينجح، وPC2 ينتظر دوره',
  'لو حصل collision تاني، النافذة تتضاعف: `0..3 slot times`',
  'Binary exponential backoff يقلّل احتمال تصادم متكرر — والـ retransmission في النهاية بتاعت الطبقات الأعلى',
]

export function BackoffProcessDiagram() {
  const playback = usePlayback(backoffStages.length)
  const stage = playback.stage
  const slots = Array.from({ length: 8 }, (_, index) => index)

  return (
    <Shell title="CSMA/CD BACKOFF / BINARY EXPONENTIAL" playback={playback} legend={backoffStages[stage]}>
      <svg viewBox="0 0 820 320" className="h-auto w-full min-w-[720px]" role="img" aria-label="Binary exponential backoff slot selection timeline">
        <title>Binary exponential backoff after Ethernet collisions</title>

        <SvgText x={20} y={42} anchor="start" color="#38bdf8" size={11} bold>PC1</SvgText>
        <SvgText x={20} y={92} anchor="start" color="#fbbf24" size={11} bold>PC2</SvgText>
        <line x1="90" y1="65" x2="770" y2="65" stroke="#1e3a5f" strokeWidth="2" />
        <line x1="90" y1="115" x2="770" y2="115" stroke="#1e3a5f" strokeWidth="2" />

        {slots.map((slot) => (
          <g key={slot}>
            <rect x={100 + slot * 82} y="42" width="70" height="46" rx="8" fill="#0b1224" stroke="#1e3a5f" />
            <SvgText x={135 + slot * 82} y={72} color="#64748b" size={9}>
              {String(slot)}
            </SvgText>
          </g>
        ))}

        <SvgText x={20} y={165} anchor="start" color="#94a3b8" size={10} bold>BACKOFF WINDOW</SvgText>

        {stage === 0 && <SvgText x={430} y={205} color="#a78bfa" size={12} bold>JAM RECEIVED → CHOOSE A RANDOM SLOT</SvgText>}

        {stage === 1 && (
          <>
            <motion.rect x="100" y="42" width="70" height="46" rx="8" fill="#38bdf8" fillOpacity="0.28" stroke="#38bdf8" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity }} />
            <motion.rect x="182" y="92" width="70" height="46" rx="8" fill="#fbbf24" fillOpacity="0.28" stroke="#fbbf24" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity }} />
            <SvgText x={430} y={205} color="#7dd3fc" size={11} bold>FIRST COLLISION → k = 1 → RANDOM 0..1 SLOT TIMES</SvgText>
          </>
        )}

        {stage === 2 && (
          <>
            <motion.rect x="100" y="42" width="70" height="46" rx="8" fill="#38bdf8" fillOpacity="0.3" stroke="#38bdf8" />
            <motion.line x1="170" y1="65" x2="740" y2="65" stroke="#34d399" strokeWidth="4" strokeDasharray="10 7" animate={{ strokeDashoffset: [0, -34] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }} />
            <SvgText x={470} y={55} color="#6ee7b7" size={10} bold>PC1 RETRANSMITS · PC2 DEFERS</SvgText>
            <SvgText x={430} y={205} color="#6ee7b7" size={11} bold>SUCCESS — FRAME SENT WITHOUT A SECOND COLLISION</SvgText>
          </>
        )}

        {stage === 3 && (
          <>
            <CollisionMark x={410} y={135} label="SECOND COLLISION" />
            <SvgText x={430} y={205} color="#fda4af" size={11} bold>k = 2 → WINDOW DOUBLES TO 0..3 SLOT TIMES</SvgText>
          </>
        )}

        {stage === 4 && (
          <>
            <motion.rect x="346" y="42" width="70" height="46" rx="8" fill="#fbbf24" fillOpacity="0.25" stroke="#fbbf24" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity }} />
            <SvgText x={430} y={205} color="#fde68a" size={11} bold>RANDOM CHOICE MAKES REPEATED COLLISIONS LESS LIKELY</SvgText>
          </>
        )}

        <SvgText x={410} y={270} color="#94a3b8" size={10}>
          WINDOW = 0..(2^k − 1), WHERE k INCREASES AFTER EACH COLLISION (WITH A LIMIT)
        </SvgText>
        <SvgText x={410} y={300} color="#64748b" size={9}>
          SIMULATED EDUCATIONAL TIMELINE · LEGACY HALF-DUPLEX ETHERNET ONLY
        </SvgText>
      </svg>
    </Shell>
  )
}

const crcStages = [
  'الـ sender بيجهّز `frame data` قبل حساب الـ FCS',
  'الـ sender بيحسب `CRC` على محتوى الإطار',
  'الـ CRC بيتحط في حقل `FCS` في آخر الإطار',
  'الإطار بيمشي على الـ network medium',
  'الـ receiver يعيد حساب CRC ويقارن النتيجة بالـ FCS',
  'لو النتيجة متطابقة → `valid frame` والإطار يتقبل',
]

export function CrcFcsValidationDiagram() {
  const playback = usePlayback(crcStages.length)
  const stage = playback.stage
  const positions = [80, 190, 300, 420, 545, 660]

  return (
    <Shell title="CRC / FCS VALIDATION" playback={playback} legend={crcStages[stage]}>
      <svg viewBox="0 0 820 320" className="h-auto w-full min-w-[720px]" role="img" aria-label="CRC calculation and FCS validation at the receiver">
        <title>Ethernet CRC calculation, FCS field and receiver validation</title>

        <Node x={15} y={105} w={100} h={60} label="SENDER" sub="NIC" color="#38bdf8" tooltip="Transmitter calculates the CRC and appends the FCS" active={stage <= 2} />
        <Node x={700} y={105} w={105} h={60} label="RECEIVER" sub="NIC" color="#34d399" tooltip="Receiver recalculates CRC and compares with FCS" active={stage >= 4} />
        <LinkLine x1={115} y1={135} x2={700} y2={135} color="#60a5fa" active={stage === 3} />

        <motion.g animate={{ x: positions[stage], y: 135 }} transition={{ type: 'spring', stiffness: 150, damping: 22 }}>
          <rect x="-100" y="-28" width="200" height="56" rx="10" fill="#0b1224" stroke="#38bdf8" strokeOpacity={0.85} />
          <rect x="-92" y="-20" width="132" height="40" rx="6" fill="#38bdf8" fillOpacity={stage >= 1 ? 0.2 : 0.08} stroke="#38bdf8" strokeOpacity="0.45" />
          <rect x="48" y="-20" width="44" height="40" rx="6" fill="#fbbf24" fillOpacity={stage >= 2 ? 0.28 : 0.08} stroke="#fbbf24" strokeOpacity="0.6" />
          <SvgText x={-26} y={4} color="#7dd3fc" size={10} bold>FRAME DATA</SvgText>
          <SvgText x={70} y={4} color="#fde68a" size={9} bold>FCS</SvgText>
        </motion.g>

        {stage === 1 && <SvgText x={205} y={70} color="#a78bfa" size={11} bold>CRC CALCULATION → 32-BIT VALUE</SvgText>}
        {stage === 2 && <SvgText x={300} y={205} color="#fbbf24" size={11} bold>CRC VALUE WRITTEN INTO FCS FIELD</SvgText>}
        {stage === 4 && (
          <>
            <rect x="570" y="205" width="180" height="46" rx="9" fill="#0b1224" stroke="#a78bfa" />
            <SvgText x={660} y={233} color="#c4b5fd" size={10} bold>COMPARE: CALC = FCS ?</SvgText>
          </>
        )}
        {stage === 5 && (
          <>
            <motion.circle cx="752" cy="105" r="18" fill="#34d399" fillOpacity="0.18" stroke="#34d399" animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 0.9, repeat: Infinity }} />
            <path d="M 744 105 L 751 112 L 762 98" fill="none" stroke="#6ee7b7" strokeWidth="3" />
            <SvgText x={410} y={275} color="#6ee7b7" size={12} bold>MATCH → ACCEPT FRAME · CRC DETECTS ERRORS, IT DOES NOT REPAIR THEM</SvgText>
          </>
        )}

        <SvgText x={410} y={305} color="#64748b" size={9}>
          SIMULATED EDUCATIONAL EXAMPLE · RECEIVER RECALCULATES CRC OVER RECEIVED DATA AND COMPARES IT WITH THE FCS
        </SvgText>
      </svg>
    </Shell>
  )
}

const corruptStages = [
  'إطار سليم بيرسل من الـ sender ومعاه FCS',
  '`EMI` أو كابل تالف بيقلّب bit جوه الـ data',
  'الـ FCS القديم لسه مكتوب في الإطار',
  'الـ receiver يحسب CRC مختلف ويقارنه بالـ FCS',
  '`mismatch` → الإطار يتسقط ويزيد عدّاد الـ CRC',
]

export function CorruptedFrameDiagram() {
  const playback = usePlayback(corruptStages.length)
  const stage = playback.stage

  return (
    <Shell title="CORRUPTED FRAME / FCS MISMATCH" playback={playback} legend={corruptStages[stage]}>
      <svg viewBox="0 0 820 320" className="h-auto w-full min-w-[720px]" role="img" aria-label="Corrupted Ethernet frame fails FCS validation and is discarded">
        <title>Corrupted frame detection and discard with CRC counter increment</title>

        <Node x={15} y={90} w={95} h={58} label="SENDER" sub="TX" color="#38bdf8" tooltip="Sends a valid frame with FCS" active={stage === 0} />
        <Node x={700} y={90} w={100} h={58} label="RX" sub="CHECK" color="#34d399" tooltip="Receiver validates the frame" active={stage >= 3} />

        <rect x="145" y="80" width="490" height="78" rx="12" fill="#0b1224" stroke="#1e3a5f" />
        <rect x="165" y="96" width="350" height="46" rx="7" fill="#38bdf8" fillOpacity="0.12" stroke="#38bdf8" strokeOpacity="0.5" />
        <rect x="525" y="96" width="90" height="46" rx="7" fill="#fbbf24" fillOpacity={stage >= 2 ? 0.22 : 0.08} stroke="#fbbf24" strokeOpacity="0.6" />

        <SvgText x={340} y={124} color="#7dd3fc" size={11} bold>DATA: 1 0 1 1 0 0 1 0</SvgText>
        <SvgText x={570} y={124} color="#fde68a" size={10} bold>FCS: A7</SvgText>

        {stage === 1 && (
          <motion.g animate={{ opacity: [0.4, 1, 0.4], y: [0, -5, 0] }} transition={{ duration: 0.8, repeat: Infinity }}>
            <path d="M 330 50 L 350 20 L 365 55 L 385 20" fill="none" stroke="#fb7185" strokeWidth="3" />
            <SvgText x={390} y={40} anchor="start" color="#fb7185" size={10} bold>EMI BIT FLIP 1 → 0</SvgText>
          </motion.g>
        )}

        {stage === 2 && <SvgText x={410} y={185} color="#fbbf24" size={11} bold>FCS STILL CONTAINS THE OLD CRC VALUE</SvgText>}

        {stage === 3 && (
          <>
            <rect x="570" y="205" width="180" height="48" rx="9" fill="#0b1224" stroke="#fb7185" />
            <SvgText x={660} y={225} color="#fda4af" size={10} bold>CALC CRC ≠ FCS</SvgText>
            <SvgText x={660} y={242} color="#fda4af" size={9} bold>VALIDATION FAILED</SvgText>
          </>
        )}

        {stage === 4 && (
          <>
            <motion.g animate={{ x: [0, -40, 0] }} transition={{ duration: 1, repeat: Infinity }}>
              <rect x="300" y="215" width="190" height="46" rx="9" fill="#fb7185" fillOpacity="0.14" stroke="#fb7185" />
              <SvgText x={395} y={243} color="#fda4af" size={11} bold>DISCARD FRAME</SvgText>
            </motion.g>
            <rect x="530" y="215" width="210" height="46" rx="9" fill="#0b1224" stroke="#fb7185" />
            <SvgText x={635} y={243} color="#fda4af" size={10} bold>CRC COUNTER +1</SvgText>
            <SvgText x={410} y={295} color="#94a3b8" size={10}>
              CRC DETECTS THE DAMAGE · THE FRAME IS NOT CORRECTED BY CRC
            </SvgText>
          </>
        )}

        <SvgText x={410} y={310} color="#64748b" size={8}>
          SIMULATED EDUCATIONAL EXAMPLE
        </SvgText>
      </svg>
    </Shell>
  )
}

const duplexModeStages = [
  '`half-duplex`: الـ interface يرسل أو يستقبل، مش الاتنين في نفس اللحظة',
  '`full-duplex`: فيه مسار TX ومسار RX منفصلين — الإرسال والاستقبال معاً',
  'في half-duplex لازم CSMA/CD؛ في full-duplex مفيش collisions طبيعية',
]

export function DuplexModeDiagram() {
  const playback = usePlayback(duplexModeStages.length)
  const stage = playback.stage

  return (
    <Shell title="HALF-DUPLEX vs FULL-DUPLEX" playback={playback} legend={duplexModeStages[stage]}>
      <svg viewBox="0 0 820 310" className="h-auto w-full min-w-[720px]" role="img" aria-label="Half-duplex compared with full-duplex Ethernet">
        <title>Half-duplex shared medium versus full-duplex dedicated paths</title>

        <motion.g animate={{ opacity: stage === 2 ? 0.48 : 1 }}>
          <rect x="20" y="30" width="375" height="240" rx="16" fill="#0a1730" stroke="#fb7185" strokeOpacity={stage <= 1 ? 0.7 : 0.3} />
          <SvgText x={207} y={60} color="#fb7185" size={12} bold>HALF-DUPLEX</SvgText>
          <Node x={45} y={120} w={90} h={50} label="NODE A" sub="TX / RX" color="#fb7185" tooltip="Can transmit or receive, but not at the same time" active={stage === 0} />
          <Node x={285} y={120} w={90} h={50} label="NODE B" sub="TX / RX" color="#fb7185" tooltip="Shares the same medium with node A" active={stage === 0} />
          <line x1="135" y1="145" x2="285" y2="145" stroke="#fb7185" strokeWidth="6" strokeOpacity="0.25" />
          <motion.line x1="135" y1="145" x2="285" y2="145" stroke="#fb7185" strokeWidth="3" strokeDasharray="8 7" animate={{ strokeDashoffset: stage === 0 ? [0, -30] : 0, opacity: stage === 0 ? 1 : 0.25 }} transition={{ duration: 1.1, repeat: stage === 0 ? Infinity : 0, ease: 'linear' }} />
          <SvgText x={207} y={205} color="#fda4af" size={10} bold>ONE SHARED PATH → COLLISION DOMAIN</SvgText>
          <SvgText x={207} y={235} color="#94a3b8" size={9}>CSMA/CD REQUIRED ON LEGACY SHARED ETHERNET</SvgText>
        </motion.g>

        <motion.g animate={{ opacity: stage === 0 ? 0.48 : 1 }}>
          <rect x="425" y="30" width="375" height="240" rx="16" fill="#0a1730" stroke="#34d399" strokeOpacity={stage >= 1 ? 0.7 : 0.3} />
          <SvgText x={612} y={60} color="#34d399" size={12} bold>FULL-DUPLEX</SvgText>
          <Node x={450} y={120} w={90} h={50} label="NODE A" sub="TX + RX" color="#34d399" tooltip="Separate transmit and receive paths" active={stage >= 1} />
          <Node x={690} y={120} w={90} h={50} label="NODE B" sub="TX + RX" color="#34d399" tooltip="Can send and receive simultaneously" active={stage >= 1} />
          <motion.line x1="540" y1="135" x2="690" y2="135" stroke="#38bdf8" strokeWidth="3" strokeDasharray="8 7" animate={{ strokeDashoffset: stage >= 1 ? [0, -30] : 0, opacity: stage >= 1 ? 1 : 0.2 }} transition={{ duration: 1.1, repeat: stage >= 1 ? Infinity : 0, ease: 'linear' }} />
          <motion.line x1="690" y1="160" x2="540" y2="160" stroke="#a78bfa" strokeWidth="3" strokeDasharray="8 7" animate={{ strokeDashoffset: stage >= 1 ? [0, 30] : 0, opacity: stage >= 1 ? 1 : 0.2 }} transition={{ duration: 1.1, repeat: stage >= 1 ? Infinity : 0, ease: 'linear' }} />
          <SvgText x={612} y={205} color="#6ee7b7" size={10} bold>TWO DIRECTIONS AT ONCE → NO NORMAL COLLISIONS</SvgText>
          <SvgText x={612} y={235} color="#94a3b8" size={9}>TYPICAL OF MODERN SWITCHED ETHERNET LINKS</SvgText>
        </motion.g>

        <SvgText x={410} y={295} color="#64748b" size={9}>
          DUPLEX MUST MATCH ON BOTH ENDS · AUTO-NEGOTIATION IS THE NORMAL CHOICE
        </SvgText>
      </svg>
    </Shell>
  )
}

const duplexMismatchStages = [
  '`SW1` شغال full-duplex وبيقدر يرسل متى ما عنده إطار',
  '`SW2` شغال half-duplex، فبيسمع الـ medium قبل الإرسال',
  'SW2 يرسل في وقت SW1 لسه بيرسل — الطرف الـ half بيعتبر ده collision',
  'SW2 يبعت `jam signal` ويسجّل `late collisions`',
  'SW1 الـ full-duplex مش متوقع collisions، فتظهر CRC/frame errors عنده',
  'الـ link لسه `up/up` بس الـ throughput منهار وبيحصل retransmit من الطبقات الأعلى',
]

export function DuplexMismatchDiagram() {
  const playback = usePlayback(duplexMismatchStages.length)
  const stage = playback.stage

  return (
    <Shell title="DUPLEX MISMATCH / FULL vs HALF" playback={playback} legend={duplexMismatchStages[stage]}>
      <svg viewBox="0 0 820 330" className="h-auto w-full min-w-[720px]" role="img" aria-label="Duplex mismatch between a full-duplex switch and a half-duplex switch">
        <title>Full-duplex to half-duplex mismatch causing late collisions and CRC errors</title>

        <Node x={20} y={105} w={150} h={75} label="SW1" sub="FULL-DUPLEX" color="#34d399" tooltip="Transmits immediately without carrier sense" active={stage === 0 || stage === 4} />
        <Node x={650} y={105} w={150} h={75} label="SW2" sub="HALF-DUPLEX" color="#fb7185" tooltip="Uses CSMA/CD and detects collisions" active={stage >= 2} />
        <LinkLine x1={170} y1={130} x2={650} y2={130} color="#34d399" active={stage === 0 || stage === 2 || stage === 5} />
        <LinkLine x1={650} y1={162} x2={170} y2={162} color="#fbbf24" active={stage === 2 || stage === 4} />

        {stage === 0 && <Packet point={{ x: 360, y: 130 }} color="#34d399" label="SW1 TX" />}
        {stage === 1 && <SvgText x={410} y={105} color="#fda4af" size={11} bold>SW2 SENSES BUSY MEDIUM → DEFERS</SvgText>}
        {stage === 2 && (
          <>
            <Packet point={{ x: 320, y: 130 }} color="#34d399" label="SW1 TX" />
            <Packet point={{ x: 500, y: 162 }} color="#fbbf24" label="SW2 TX" />
          </>
        )}
        {stage === 3 && <CollisionMark x={635} y={215} label="LATE COLLISION AT SW2" />}
        {stage === 4 && (
          <>
            <rect x="35" y="225" width="210" height="48" rx="9" fill="#0b1224" stroke="#fb7185" />
            <SvgText x={140} y={245} color="#fda4af" size={10} bold>SW1: CRC / FRAME ERRORS</SvgText>
            <SvgText x={140} y={262} color="#94a3b8" size={9} bold>FRAMES ARRIVE CORRUPTED</SvgText>
            <rect x="575" y="225" width="210" height="48" rx="9" fill="#0b1224" stroke="#fb7185" />
            <SvgText x={680} y={245} color="#fda4af" size={10} bold>SW2: LATE COLLISIONS</SvgText>
            <SvgText x={680} y={262} color="#94a3b8" size={9} bold>HALF-DUPLEX SIDE DETECTS THEM</SvgText>
          </>
        )}
        {stage === 5 && (
          <SvgText x={410} y={300} color="#fbbf24" size={11} bold>
            STATUS up/up + POOR THROUGHPUT + TCP/UPPER-LAYER RETRANSMISSIONS → FIX DUPLEX ON BOTH ENDS
          </SvgText>
        )}

        <SvgText x={410} y={320} color="#64748b" size={8}>
          SIMULATED EDUCATIONAL EXAMPLE
        </SvgText>
      </svg>
    </Shell>
  )
}

const speedStages = [
  'كل interface بيعلن السرعات والـ duplex اللي بيدعمها',
  'الطرفين يقارنوا القدرات ويختاروا أعلى قيمة مشتركة',
  'القدرات المختلفة مش بالضرورة مشكلة — لو فيه قيمة مشتركة الـ link بيقوم',
  'مثال: 10/100/1000 على الطرفين → `1000Mb/s` و `a-full`',
  'لو مفيش قيمة مشتركة (مثلاً طرف متثبت 1000 والتاني 100 بس) الـ link مش هيقوم',
]

export function SpeedNegotiationDiagram() {
  const playback = usePlayback(speedStages.length)
  const stage = playback.stage
  const speeds = ['10', '100', '1000', '10000']
  const sw1Supported = [true, true, true, false]

  const chipColor = (index: number) => {
    if (stage === 4) return index === 2 ? '#fb7185' : '#334155'
    if (stage === 2 || stage === 3) return index === 1 ? '#34d399' : '#334155'
    return sw1Supported[index] ? '#38bdf8' : '#334155'
  }

  return (
    <Shell title="SPEED AUTO-NEGOTIATION / COMMON PARAMETERS" playback={playback} legend={speedStages[stage]}>
      <svg viewBox="0 0 820 320" className="h-auto w-full min-w-[720px]" role="img" aria-label="Ethernet speed auto-negotiation finding a common supported speed">
        <title>Speed auto-negotiation and incompatible speed scenario</title>

        <rect x="30" y="35" width="350" height="210" rx="16" fill="#0a1730" stroke="#38bdf8" strokeOpacity="0.6" />
        <SvgText x={205} y={65} color="#38bdf8" size={12} bold>SW1 Gi0/1</SvgText>
        <SvgText x={205} y={88} color="#94a3b8" size={9}>SUPPORTED: 10 / 100 / 1000 Mb/s</SvgText>

        <rect x="440" y="35" width="350" height="210" rx="16" fill="#0a1730" stroke="#fbbf24" strokeOpacity="0.6" />
        <SvgText x={615} y={65} color="#fbbf24" size={12} bold>SW2 Gi0/1</SvgText>
        <SvgText x={615} y={88} color="#94a3b8" size={9}>SUPPORTED: 10 / 100 Mb/s</SvgText>

        {speeds.map((speed, index) => (
          <g key={speed}>
            <motion.rect
              x={55 + index * 78}
              y={120}
              width="66"
              height="42"
              rx="8"
              fill={chipColor(index)}
              fillOpacity={stage === 4 && index === 2 ? 0.25 : 0.16}
              stroke={chipColor(index)}
              animate={{ opacity: stage === 1 ? [0.45, 1, 0.45] : 1 }}
              transition={{ duration: 1, repeat: stage === 1 ? Infinity : 0 }}
            />
            <SvgText x={88 + index * 78} y={146} color={chipColor(index)} size={10} bold>{speed}</SvgText>

            <motion.rect
              x={465 + index * 78}
              y={120}
              width="66"
              height="42"
              rx="8"
              fill={index <= 1 ? '#34d399' : '#334155'}
              fillOpacity="0.16"
              stroke={index <= 1 ? '#34d399' : '#334155'}
              animate={{ opacity: stage === 1 ? [0.45, 1, 0.45] : 1 }}
              transition={{ duration: 1, repeat: stage === 1 ? Infinity : 0 }}
            />
            <SvgText x={498 + index * 78} y={146} color={index <= 1 ? '#6ee7b7' : '#475569'} size={10} bold>{speed}</SvgText>
          </g>
        ))}

        {stage >= 2 && stage !== 4 && (
          <motion.rect x="330" y="272" width="160" height="34" rx="9" fill="#34d399" fillOpacity="0.18" stroke="#34d399" animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 1, repeat: Infinity }}>
            <SvgText x={410} y={294} color="#6ee7b7" size={10} bold>COMMON = 100 Mb/s</SvgText>
          </motion.rect>
        )}

        {stage === 3 && <SvgText x={410} y={220} color="#6ee7b7" size={11} bold>LINK UP · 100Mb/s · FULL-DUPLEX · DIFFERENT CAPABILITIES ARE NOT AUTOMATICALLY A MISMATCH</SvgText>}

        {stage === 4 && (
          <>
            <SvgText x={205} y={205} color="#fda4af" size={10} bold>FORCED 1000Mb/s</SvgText>
            <SvgText x={615} y={205} color="#fda4af" size={10} bold>ONLY 100Mb/s</SvgText>
            <CollisionMark x={410} y={220} label="NO COMPATIBLE OPERATING PARAMETERS" />
          </>
        )}

        <SvgText x={410} y={312} color="#64748b" size={8}>
          SIMULATED EDUCATIONAL EXAMPLE · AVAILABLE SPEEDS DEPEND ON HARDWARE, TRANSCEIVER AND STANDARD
        </SvgText>
      </svg>
    </Shell>
  )
}

const interfaceStateStages = [
  'حالتين متقابلتين: link سليم و link فيه أخطاء متزايدة',
  'الـ healthy interface: `up/up` · `a-full` · `a-1000` والعدّادات صفر',
  'الـ faulty interface: `up/up` لسه، بس CRC و input errors بيزيدوا',
  'في الحالة الفاشلة الـ ping بيقطع رغم إن الـ link شغال',
  'المقارنة الصحيحة: الحالة + السرعة/الدوبلكس + العدّادات مع بعض',
]

export function HealthyFaultyInterfaceDiagram() {
  const playback = usePlayback(interfaceStateStages.length)
  const stage = playback.stage
  const faulty = stage >= 2 ? (stage === 2 ? 24 : stage === 3 ? 87 : 156) : 0
  const late = stage >= 3 ? (stage === 3 ? 8 : 19) : 0

  return (
    <Shell title="HEALTHY vs FAULTY INTERFACE" playback={playback} legend={interfaceStateStages[stage]}>
      <svg viewBox="0 0 820 320" className="h-auto w-full min-w-[720px]" role="img" aria-label="Healthy interface compared with a faulty interface with increasing error counters">
        <title>Healthy and faulty Ethernet interface status and counters</title>

        <motion.g animate={{ opacity: stage === 4 ? 0.72 : 1 }}>
          <rect x="25" y="30" width="365" height="250" rx="16" fill="#0a1730" stroke="#34d399" strokeOpacity={stage <= 1 || stage === 4 ? 0.8 : 0.3} />
          <SvgText x={207} y={60} color="#34d399" size={12} bold>HEALTHY Gi0/1</SvgText>
          <rect x="55" y="82" width="305" height="42" rx="8" fill="#0b1224" stroke="#34d399" strokeOpacity="0.5" />
          <SvgText x={207} y={108} color="#6ee7b7" size={11} bold>up/up · a-full · a-1000</SvgText>
          {['input errors', 'CRC', 'late collisions'].map((label, index) => (
            <g key={label}>
              <SvgText x={60} y={150 + index * 34} anchor="start" color="#94a3b8" size={10}>{label}</SvgText>
              <SvgText x={350} y={150 + index * 34} anchor="end" color="#6ee7b7" size={11} bold>0</SvgText>
              <line x1="55" y1={160 + index * 34} x2="360" y2={160 + index * 34} stroke="#1e3a5f" />
            </g>
          ))}
          <SvgText x={207} y={262} color="#64748b" size={9}>CLEAN COUNTERS · STABLE PING</SvgText>
        </motion.g>

        <motion.g animate={{ opacity: stage === 4 ? 1 : 0.95 }}>
          <rect x="430" y="30" width="365" height="250" rx="16" fill="#0a1730" stroke="#fb7185" strokeOpacity={stage >= 2 ? 0.85 : 0.3} />
          <SvgText x={612} y={60} color="#fb7185" size={12} bold>FAULTY Gi0/1</SvgText>
          <rect x="460" y="82" width="305" height="42" rx="8" fill="#0b1224" stroke="#fb7185" strokeOpacity={stage >= 2 ? 0.6 : 0.25} />
          <SvgText x={612} y={108} color={stage >= 2 ? '#fda4af' : '#94a3b8'} size={11} bold>up/up · a-full · a-1000</SvgText>
          <motion.g animate={{ opacity: stage >= 2 ? 1 : 0.4 }}>
            <SvgText x={465} y={150} anchor="start" color="#94a3b8" size={10}>input errors</SvgText>
            <SvgText x={755} y={150} anchor="end" color="#fda4af" size={11} bold>{String(faulty)}</SvgText>
            <line x1="460" y1="160" x2="765" y2="160" stroke="#1e3a5f" />
            <SvgText x={465} y={184} anchor="start" color="#94a3b8" size={10}>CRC</SvgText>
            <SvgText x={755} y={184} anchor="end" color="#fda4af" size={11} bold>{String(Math.max(0, faulty - 3))}</SvgText>
            <line x1="460" y1="194" x2="765" y2="194" stroke="#1e3a5f" />
            <SvgText x={465} y={218} anchor="start" color="#94a3b8" size={10}>late collisions</SvgText>
            <SvgText x={755} y={218} anchor="end" color="#fda4af" size={11} bold>{String(late)}</SvgText>
          </motion.g>
          <SvgText x={612} y={262} color={stage >= 3 ? '#fda4af' : '#64748b'} size={9}>
            {stage >= 3 ? 'INTERMITTENT PING · UPPER-LAYER RETRIES' : 'CLEAR COUNTERS THEN GENERATE TRAFFIC'}
          </SvgText>
        </motion.g>

        <SvgText x={410} y={305} color="#64748b" size={9}>
          SIMULATED EDUCATIONAL EXAMPLE · LINK STATUS ALONE DOES NOT PROVE A HEALTHY LINK
        </SvgText>
      </svg>
    </Shell>
  )
}

interface CounterDefinition {
  label: string
  color: string
  hint: string
}

const dashboardCounters: Record<string, CounterDefinition> = {
  inputErrors: { label: 'Input Errors', color: '#fb7185', hint: 'sum of inbound errors' },
  crc: { label: 'CRC', color: '#f97316', hint: 'FCS validation failed' },
  runts: { label: 'Runts', color: '#fbbf24', hint: 'undersized frames' },
  giants: { label: 'Giants', color: '#a78bfa', hint: 'oversized frames' },
  collisions: { label: 'Collisions', color: '#38bdf8', hint: 'shared-medium collisions' },
  lateCollisions: { label: 'Late Collisions', color: '#f43f5e', hint: 'collision after frame start' },
  outputDrops: { label: 'Output Drops', color: '#34d399', hint: 'tx queue congestion' },
  frame: { label: 'Frame Errors', color: '#c084fc', hint: 'framing / alignment faults' },
  inputDrops: { label: 'Input Drops', color: '#60a5fa', hint: 'rx queue full' },
}

export function InterfaceCountersDashboard() {
  const playback = usePlayback(3)
  const [counts, setCounts] = useState<Record<string, number>>(() =>
    Object.keys(dashboardCounters).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
  )
  const [lastEvent, setLastEvent] = useState('لم يتم تشغيل أي حدث بعد — العدّادات كلها `0`.')

  const addEvent = (label: string, changes: Record<string, number>) => {
    setCounts((current) => {
      const next = { ...current }
      Object.entries(changes).forEach(([key, value]) => {
        next[key] = (next[key] ?? 0) + value
      })
      return next
    })
    setLastEvent(label)
  }

  const reset = () => {
    setCounts(Object.keys(dashboardCounters).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}))
    setLastEvent('تم محاكاة `clear counters` — كل العدّادات رجعت `0`.')
  }

  return (
    <Shell
      title="INTERFACE COUNTERS DASHBOARD / SIMULATED"
      playback={playback}
      legend={lastEvent}
    >
      <div className="min-w-[720px]">
        <div className="mb-3 flex flex-wrap gap-2" dir="rtl">
          <button type="button" onClick={() => addEvent('CRC burst: EMI / damaged cable / dirty connector', { crc: 3, inputErrors: 4, frame: 1 })} className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-1.5 text-[0.75rem] text-rose-200 hover:bg-rose-400/20">
            أضف CRC burst
          </button>
          <button type="button" onClick={() => addEvent('Late collision: suspected duplex mismatch', { lateCollisions: 2, collisions: 2, inputErrors: 2 })} className="rounded-lg border border-orange-400/30 bg-orange-400/10 px-3 py-1.5 text-[0.75rem] text-orange-200 hover:bg-orange-400/20">
            أضف late collision
          </button>
          <button type="button" onClick={() => addEvent('Output congestion: tx queue pressure', { outputDrops: 5 })} className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-[0.75rem] text-emerald-200 hover:bg-emerald-400/20">
            أضف output drops
          </button>
          <button type="button" onClick={() => addEvent('Size errors: runts and giants observed', { runts: 2, giants: 1, inputErrors: 3 })} className="rounded-lg border border-violet-400/30 bg-violet-400/10 px-3 py-1.5 text-[0.75rem] text-violet-200 hover:bg-violet-400/20">
            أضف runts / giants
          </button>
          <button type="button" onClick={reset} className="rounded-lg border border-sky-400/30 bg-sky-400/10 px-3 py-1.5 text-[0.75rem] text-sky-200 hover:bg-sky-400/20">
            clear counters
          </button>
        </div>

        <svg viewBox="0 0 820 340" className="h-auto w-full" role="img" aria-label="Interactive simulated dashboard of Ethernet interface error counters">
          <title>Simulated interface counter dashboard with trigger buttons</title>
          <rect x="10" y="10" width="800" height="320" rx="16" fill="#07111f" stroke="#1e3a5f" />
          <SvgText x={410} y={38} color="#e2e8f0" size={12} bold>Gi0/1 COUNTERS</SvgText>
          <SvgText x={410} y={58} color="#fbbf24" size={9} bold>SIMULATED EDUCATIONAL EXAMPLE — NOT LIVE DEVICE DATA</SvgText>

          {Object.entries(dashboardCounters).map(([key, def], index) => {
            const col = index % 3
            const row = Math.floor(index / 3)
            const x = 32 + col * 262
            const y = 78 + row * 78
            const value = counts[key] ?? 0
            return (
              <motion.g key={key} animate={{ opacity: value > 0 ? 1 : 0.68 }} transition={{ duration: 0.25 }}>
                <rect x={x} y={y} width="242" height="64" rx="10" fill="#0b1224" stroke={def.color} strokeOpacity={value > 0 ? 0.75 : 0.3} />
                <SvgText x={x + 14} y={y + 22} anchor="start" color={def.color} size={10} bold>{def.label}</SvgText>
                <SvgText x={x + 228} y={y + 26} anchor="end" color={value > 0 ? '#f8fafc' : '#64748b'} size={16} bold>{String(value)}</SvgText>
                <SvgText x={x + 14} y={y + 47} anchor="start" color="#64748b" size={8}>{def.hint}</SvgText>
              </motion.g>
            )
          })}

          <rect x="32" y="292" width="756" height="26" rx="8" fill="#0b1224" stroke="#334155" />
          <SvgText x={410} y={309} color="#94a3b8" size={9}>
            INTERPRET: PHYSICAL ERRORS (CRC / RUNTS / GIANTS) vs CONGESTION (OUTPUT DROPS) vs LEGACY COLLISIONS
          </SvgText>
        </svg>
      </div>
    </Shell>
  )
}

const cableFlowStages = [
  'ابدأ بالأسباب الأسرع: LED/status والـ `up/up`',
  'افحص الكابل والـ connectors بالعين — شدّ، شرخ، غبار، RJ-45',
  'جرّب كابل معروف أنه شغال — أسرع اختبار عزل',
  'راجع `speed` و `duplex` على الطرفين',
  `امسح العدّادات، ولّد traffic، وراقب إذا الأخطاء رجعت`,
  'اختبر الـ hardware أو loopback لو المنصة بتدعمه',
  'استبدل الجزء المسبب أو اطلب تصعيد — وتأكد بالـ ping والعدّادات',
]

export function CableTroubleshootingFlowDiagram() {
  const playback = usePlayback(cableFlowStages.length)
  const stage = playback.stage
  const steps = [
    '1 · CHECK LEDs / show interfaces status',
    '2 · VISUAL CABLE + CONNECTOR INSPECTION',
    '3 · SWAP WITH KNOWN-GOOD CABLE',
    '4 · COMPARE SPEED / DUPLEX ON BOTH ENDS',
    '5 · clear counters → GENERATE TRAFFIC → MONITOR',
    '6 · LOOPBACK / HARDWARE TEST IF SUPPORTED',
    '7 · REPLACE, ESCALATE, VERIFY PING + COUNTERS',
  ]

  return (
    <Shell title="PHYSICAL CABLE TROUBLESHOOTING FLOW" playback={playback} legend={cableFlowStages[stage]}>
      <svg viewBox="0 0 820 430" className="h-auto w-full min-w-[720px]" role="img" aria-label="Step-by-step physical cable troubleshooting flow chart">
        <title>Physical cable troubleshooting workflow</title>
        {steps.map((step, index) => {
          const y = 22 + index * 58
          const active = index === stage
          return (
            <g key={step}>
              <Node
                x={245}
                y={y}
                w={330}
                h={40}
                label={step}
                sub=""
                color={active ? '#38bdf8' : '#475569'}
                tooltip={cableFlowStages[index]}
                active={active}
              />
              {index < steps.length - 1 && (
                <motion.line
                  x1="410"
                  y1={y + 40}
                  x2="410"
                  y2={y + 56}
                  stroke={active ? '#38bdf8' : '#334155'}
                  strokeWidth="2"
                  animate={{ opacity: active ? [0.35, 1, 0.35] : 0.4 }}
                  transition={{ duration: 0.9, repeat: active ? Infinity : 0 }}
                />
              )}
            </g>
          )
        })}
        <SvgText x={410} y={418} color="#64748b" size={9}>
          WORK TOP-DOWN: STATE → CABLE → SETTINGS → ACTIVE ERROR RATE → HARDWARE
        </SvgText>
      </svg>
    </Shell>
  )
}
