import { motion } from 'framer-motion'
import { LinkLine, Node, Packet, Shell, usePlayback } from './ArchitectureDiagrams'
import { SvgText } from './FiberDiagrams'

const hubStages = [
  '`PC1` بعت frame — الـ hub استقبل الإشارة على منفذه',
  'الـ `hub` أعاد الإشارة لكل المنافذ — كل الأجهزة في نفس الـ shared medium',
  '`PC2` و `PC3` و `PC4` استلموا نفس الـ frame وكل واحد بيفحص الـ destination MAC',
  'لو `PC2` بعت في نفس اللحظة، الإشارتين يتداخلوا و يحصل `collision`',
  'كل الأجهزة في نفس الـ `collision domain` وغالباً شغالة `half-duplex` — ده legacy',
]

export function HubSharedDiagram() {
  const playback = usePlayback(hubStages.length)

  const broadcastPackets = playback.stage === 1
    ? [
        { point: { x: 240, y: 105 }, label: 'FRAME' },
        { point: { x: 560, y: 105 }, label: 'FRAME' },
        { point: { x: 240, y: 235 }, label: 'FRAME' },
      ]
    : playback.stage === 2
      ? [
          { point: { x: 640, y: 65 }, label: 'RX' },
          { point: { x: 20, y: 275 }, label: 'RX' },
          { point: { x: 640, y: 275 }, label: 'RX' },
        ]
      : []

  return (
    <Shell title="ETHERNET HUB / SHARED MEDIA" playback={playback} legend={hubStages[playback.stage]}>
      <svg viewBox="0 0 780 340" className="h-auto w-full min-w-[700px]" role="img" aria-label="Ethernet hub shared medium with four PCs and a collision">
        <title>Hub repeating frames to all ports and creating one collision domain</title>

        <LinkLine x1={340} y1={158} x2={130} y2={68} color="#38bdf8" active={playback.stage === 0 || playback.stage === 1} />
        <LinkLine x1={460} y1={158} x2={640} y2={68} color="#60a5fa" active={playback.stage === 1 || playback.stage === 2 || playback.stage === 3} />
        <LinkLine x1={340} y1={182} x2={130} y2={278} color="#60a5fa" active={playback.stage === 1 || playback.stage === 2} />
        <LinkLine x1={460} y1={182} x2={640} y2={278} color="#60a5fa" active={playback.stage === 1 || playback.stage === 2} />

        <Node x={20} y={40} w={110} h={50} label="PC1" sub="SENDER" color="#38bdf8" tooltip="Source PC transmitting a frame" active={playback.stage === 0} />
        <Node x={640} y={40} w={110} h={50} label="PC2" sub="RECEIVER" color="#60a5fa" tooltip="Receives the repeated frame — may also transmit" active={playback.stage === 2 || playback.stage === 3} />
        <Node x={20} y={250} w={110} h={50} label="PC3" sub="RECEIVER" color="#60a5fa" tooltip="Receives the repeated frame" active={playback.stage === 2} />
        <Node x={640} y={250} w={110} h={50} label="PC4" sub="RECEIVER" color="#60a5fa" tooltip="Receives the repeated frame" active={playback.stage === 2} />

        <Node x={340} y={140} w={100} h={60} label="HUB" sub="LAYER 1" color="#fb7185" tooltip="Repeats electrical signals to every port — no MAC learning" active={playback.stage === 1 || playback.stage === 3 || playback.stage === 4} />

        {playback.stage === 0 && <Packet point={{ x: 170, y: 93 }} color="#38bdf8" label="FRAME" />}
        {broadcastPackets.map((packet) => (
          <Packet key={`${packet.label}-${packet.point.x}-${packet.point.y}`} point={packet.point} color="#38bdf8" label={packet.label} />
        ))}

        {playback.stage >= 3 && (
          <motion.g animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.8, repeat: Infinity }}>
            <path d="M 370 170 L 385 150 L 395 178 L 410 150 L 420 170" fill="none" stroke="#fb7185" strokeWidth="3" />
            <SvgText x={400} y={205} color="#fb7185" size={10} bold>COLLISION</SvgText>
          </motion.g>
        )}

        <SvgText x={390} y={322} color="#64748b" size={9}>
          ONE COLLISION DOMAIN · HALF-DUPLEX · HUB REPEATS TO ALL PORTS · LEGACY ETHERNET
        </SvgText>
      </svg>
    </Shell>
  )
}

const csmacdStages = [
  '`Carrier Sense`: PC1 يسمع الـ medium قبل الإرسال — لو فاضي يبدأ',
  '`Transmit`: PC1 بيبعت الـ frame على الـ shared medium',
  'PC2 كمان لقى الـ medium فاضي وبعت في نفس الوقت → `collision`',
  '`Collision Detection`: الاتنين لاحظوا التداخل وبعتوا `jam signal`',
  '`Backoff`: كل جهاز يختار زمن عشوائي وينتظر قبل ما يعيد المحاولة',
  '`Retransmit`: PC1 يعيد الإرسال — دي آلية قديمة في shared `half-duplex` Ethernet',
]

export function CsmacdDiagram() {
  const playback = usePlayback(csmacdStages.length)

  return (
    <Shell title="CSMA/CD / COLLISION DEMONSTRATION" playback={playback} legend={csmacdStages[playback.stage]}>
      <svg viewBox="0 0 820 340" className="h-auto w-full min-w-[720px]" role="img" aria-label="CSMA/CD collision detection and backoff timeline">
        <title>CSMA/CD listen, transmit, collision, jam, backoff and retransmit timeline</title>

        <SvgText x={20} y={72} anchor="start" color="#38bdf8" size={10} bold>PC1</SvgText>
        <SvgText x={20} y={212} anchor="start" color="#fbbf24" size={10} bold>PC2</SvgText>
        <line x1="80" y1="140" x2="780" y2="140" stroke="#1e3a5f" strokeWidth="4" />
        <SvgText x={430} y={132} color="#64748b" size={9}>SHARED MEDIUM / COLLISION DOMAIN</SvgText>

        <line x1="80" y1="90" x2="780" y2="90" stroke="#1e3a5f" strokeDasharray="4 6" />
        <line x1="80" y1="230" x2="780" y2="230" stroke="#1e3a5f" strokeDasharray="4 6" />

        {playback.stage === 0 && (
          <motion.g animate={{ opacity: [0.4, 1, 0.4] }}>
            <rect x="120" y="75" width="90" height="30" rx="8" fill="#38bdf8" fillOpacity="0.16" stroke="#38bdf8" />
            <SvgText x={165} y={95} color="#7dd3fc" size={9}>LISTEN</SvgText>
          </motion.g>
        )}

        {playback.stage >= 1 && (
          <motion.rect x="180" y="76" width={playback.stage >= 5 ? 520 : 300} height="28" rx="8" fill="#38bdf8" fillOpacity="0.2" stroke="#38bdf8" initial={{ width: 0 }} animate={{ width: playback.stage >= 5 ? 520 : 300 }} transition={{ duration: 0.4 }} />
        )}
        {playback.stage >= 1 && <SvgText x={330} y={95} color="#7dd3fc" size={9} bold>PC1 FRAME</SvgText>}
        {playback.stage >= 5 && <SvgText x={690} y={95} color="#7dd3fc" size={9} bold>RETRY</SvgText>}

        {playback.stage === 2 && (
          <motion.rect x="280" y="216" width="220" height="28" rx="8" fill="#fbbf24" fillOpacity="0.2" stroke="#fbbf24" initial={{ width: 0 }} animate={{ width: 220 }} transition={{ duration: 0.4 }} />
        )}
        {playback.stage === 2 && <SvgText x={390} y={235} color="#fde68a" size={9} bold>PC2 FRAME</SvgText>}

        {playback.stage >= 3 && (
          <motion.g animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.8, repeat: Infinity }}>
            <path d="M 340 140 L 355 118 L 370 160 L 385 118 L 400 160 L 415 118 L 430 140" fill="none" stroke="#fb7185" strokeWidth="3" />
            <SvgText x={385} y={182} color="#fb7185" size={10} bold>JAM SIGNAL</SvgText>
          </motion.g>
        )}

        {playback.stage === 4 && (
          <motion.g animate={{ x: [0, 20, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
            <rect x="470" y="76" width="120" height="28" rx="8" fill="#a78bfa" fillOpacity="0.18" stroke="#a78bfa" />
            <SvgText x={530} y={95} color="#c4b5fd" size={9}>RANDOM BACKOFF</SvgText>
          </motion.g>
        )}

        {[0, 1, 2, 3, 4, 5].map((stage) => (
          <SvgText key={stage} x={130 + stage * 125} y={285} color={stage === playback.stage ? '#38bdf8' : '#475569'} size={9} bold={stage === playback.stage}>
            {['SENSE', 'SEND', 'COLLIDE', 'DETECT', 'BACKOFF', 'RETRY'][stage]}
          </SvgText>
        ))}

        <SvgText x={410} y={318} color="#64748b" size={9}>
          LEGACY SHARED ETHERNET ONLY · MODERN SWITCHED FULL-DUPLEX LINKS DO NOT USE CSMA/CD NORMALLY
        </SvgText>
      </svg>
    </Shell>
  )
}

const p2pStages = [
  'Link مخصص بين طرفين بس — مفيش جهاز تالت بيشارك الـ medium',
  '`Full-duplex`: كل طرف يقدر يرسل ويستقبل في نفس اللحظة',
  'الـ `bandwidth` بتاع الـ link مخصص للطرفين — مفيش تنافس من أجهزة تانية',
  'الإطار لسه فيه `Source MAC` و `Destination MAC` حتى لو الـ link point-to-point',
  'أمثلة: Switch↔Switch · Router↔Router · Switch↔Router · dedicated fiber',
]

export function PointToPointDiagram() {
  const playback = usePlayback(p2pStages.length)

  return (
    <Shell title="POINT-TO-POINT / DEDICATED LINK" playback={playback} legend={p2pStages[playback.stage]}>
      <svg viewBox="0 0 780 290" className="h-auto w-full min-w-[700px]" role="img" aria-label="Dedicated point-to-point full-duplex Ethernet link">
        <title>Point-to-point dedicated link between two endpoints</title>

        <LinkLine x1={180} y1={118} x2={600} y2={118} color="#38bdf8" active />
        <LinkLine x1={600} y1={158} x2={180} y2={158} color="#34d399" active={playback.stage === 1} />

        <Node x={30} y={100} w={150} h={78} label="DEVICE A" sub="SW1 / R1 / PC" color="#38bdf8" tooltip="One endpoint of the dedicated link" active />
        <Node x={600} y={100} w={150} h={78} label="DEVICE B" sub="SW2 / R2 / PC" color="#34d399" tooltip="The only other endpoint on this link" active />

        <SvgText x={390} y={105} color="#7dd3fc" size={9}>A → B · TX PAIR</SvgText>
        <SvgText x={390} y={183} color="#6ee7b7" size={9}>B → A · RX PAIR</SvgText>

        {playback.stage === 0 && <Packet point={{ x: 250, y: 118 }} color="#38bdf8" label="FRAME" />}
        {playback.stage === 1 && (
          <>
            <Packet point={{ x: 390, y: 118 }} color="#38bdf8" label="TX" />
            <Packet point={{ x: 390, y: 158 }} color="#34d399" label="RX" />
          </>
        )}
        {playback.stage === 2 && <SvgText x={390} y={220} color="#38bdf8" size={10} bold>DEDICATED BANDWIDTH — NO OTHER STATION SHARES IT</SvgText>}
        {playback.stage === 3 && <SvgText x={390} y={220} color="#fbbf24" size={10} bold>SRC MAC → DST MAC STILL EXISTS IN THE FRAME</SvgText>}
        {playback.stage === 4 && <SvgText x={390} y={220} color="#34d399" size={10} bold>SWITCH ↔ SWITCH · ROUTER ↔ ROUTER · SWITCH ↔ ROUTER · FIBER</SvgText>}

        {playback.stage >= 2 && (
          <motion.g animate={{ opacity: playback.stage === 3 ? 0.9 : 0.25 }}>
            <circle cx="390" cy="138" r="18" fill="none" stroke="#fb7185" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="378" y1="126" x2="402" y2="150" stroke="#fb7185" strokeWidth="2.5" />
            <SvgText x={390} y={255} color="#fb7185" size={9}>NO COLLISION ON A FULL-DUPLEX POINT-TO-POINT LINK</SvgText>
          </motion.g>
        )}
      </svg>
    </Shell>
  )
}

const labStages = [
  'وصل `PC0` و `PC1` بـ `SW1`، و`PC2` و `PC3` بـ `SW2` بكابل copper',
  'وصل `SW1` و `SW2` على `GigabitEthernet0/1` — auto-MDIX بيسمح بـ straight-through غالباً',
  'اضبط IP والماسك على الـ PCs — كلهم في نفس الشبكة',
  'اعمل ping جوه نفس السوّيتش وبين السوّيتشين',
  'افحص `show interfaces status` والـ counters لاكتشاف كابل أو منفذ مقطوع',
]

export function MediaLabDiagram() {
  const playback = usePlayback(labStages.length)
  const path = [
    { x: 85, y: 272 },
    { x: 200, y: 92 },
    { x: 560, y: 92 },
    { x: 485, y: 272 },
    { x: 485, y: 272 },
  ]

  return (
    <Shell title="LAB TOPOLOGY / COPPER ETHERNET" playback={playback} legend={labStages[playback.stage]}>
      <svg viewBox="0 0 760 320" className="h-auto w-full min-w-[680px]" role="img" aria-label="Packet Tracer lab with two switches and four PCs connected by copper Ethernet">
        <title>Packet Tracer two-switch four-PC copper Ethernet lab topology</title>

        <LinkLine x1={260} y1={68} x2={500} y2={68} color="#a78bfa" active={playback.stage === 1 || playback.stage === 3} />
        <LinkLine x1={180} y1={100} x2={85} y2={250} color="#38bdf8" active={playback.stage === 0} />
        <LinkLine x1={220} y1={100} x2={250} y2={250} color="#38bdf8" />
        <LinkLine x1={540} y1={100} x2={470} y2={250} color="#34d399" active={playback.stage === 3} />
        <LinkLine x1={580} y1={100} x2={630} y2={250} color="#34d399" />

        <Node x={140} y={35} w={120} h={66} label="SW1" sub="Gi0/1 ↔ SW2" color="#a78bfa" tooltip="Cisco switch SW1" active={playback.stage === 0 || playback.stage === 1} />
        <Node x={500} y={35} w={120} h={66} label="SW2" sub="Gi0/1 ↔ SW1" color="#a78bfa" tooltip="Cisco switch SW2" active={playback.stage === 1 || playback.stage === 3} />

        <Node x={30} y={250} w={110} h={48} label="PC0" sub="192.168.10.10" color="#38bdf8" tooltip="Sales PC on SW1 Fa0/1" active={playback.stage === 0} />
        <Node x={195} y={250} w={110} h={48} label="PC1" sub="192.168.10.11" color="#38bdf8" tooltip="PC on SW1 Fa0/2" />
        <Node x={415} y={250} w={110} h={48} label="PC2" sub="192.168.10.12" color="#34d399" tooltip="PC on SW2 Fa0/1" active={playback.stage === 3} />
        <Node x={580} y={250} w={110} h={48} label="PC3" sub="192.168.10.13" color="#34d399" tooltip="PC on SW2 Fa0/2" />

        <SvgText x={380} y={145} color="#94a3b8" size={9}>COPPER PATCH CABLES · Fa0/1–2 · Gi0/1 INTER-SWITCH LINK</SvgText>
        <SvgText x={380} y={305} color="#64748b" size={9}>SAME SUBNET 192.168.10.0/24 · NO ROUTER NEEDED FOR LOCAL LAB PING</SvgText>
        <Packet point={path[playback.stage]} color={playback.stage > 1 ? '#34d399' : '#38bdf8'} label="ICMP" />
      </svg>
    </Shell>
  )
}
