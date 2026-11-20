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
    const timer = window.setInterval(() => setStage((current) => (current + 1) % length), 1800)
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

function MessageBubble({ x, y, w, title, detail, color }: { x: number; y: number; w: number; title: string; detail: string; color: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height="44" rx="9" fill="#0b1224" stroke={color} strokeOpacity="0.8" />
      <SvgText x={x + w / 2} y={y + 18} color={color} size={10} bold>{title}</SvgText>
      <SvgText x={x + w / 2} y={y + 34} color="#cbd5e1" size={9}>{detail}</SvgText>
    </g>
  )
}

const communicationStages = [
  '`IP` بيوصل الـ packet لعنوان الجهاز الصح، بس لوحده **مش عارف** يقول أي تطبيق جوه الجهاز هو المقصود.',
  'في مسار `TCP`: العميل والسيرفر بيعملوا handshake، وبعدين البيانات تمشي كـ **byte stream** مرتب مع acknowledgments.',
  'في مسار `UDP`: كل `datagram` بيتإرسل مستقل — مفيش handshake ومفيش acknowledgment جوه UDP.',
  'الـ `port number` بيسمح بـ **multiplexing**: أكتر من تطبيق يشارك نفس الـ IP، وكل تطبيق له منفذ أو socket خاص.',
  'الخلاصة: `TCP` بيقدّم reliability وترتيب على حساب overhead؛ `UDP` خفيف وسريع البدء بس مفيش ضمانات مدمجة.',
]

export function TcpUdpCommunicationDiagram() {
  const playback = useStepPlayback(communicationStages.length)
  const stage = playback.stage

  return (
    <StepShell title="TCP vs UDP / PROCESS-TO-PROCESS" playback={playback} legend={communicationStages[stage]}>
      <svg viewBox="0 0 820 340" className="h-auto w-full min-w-[720px]" role="img" aria-label="TCP reliable stream compared with UDP independent datagrams">
        <title>TCP and UDP communication between client and server applications</title>

        <SvgText x={205} y={28} color="#34d399" size={11} bold>TCP PATH · CONNECTION + RELIABLE STREAM</SvgText>
        <SvgText x={205} y={198} color="#fbbf24" size={11} bold>UDP PATH · INDEPENDENT DATAGRAMS</SvgText>

        <Node x={20} y={45} w={130} h={62} label="CLIENT APP" sub="HTTP / DNS" color="#38bdf8" tooltip="Application process on the client" active={stage <= 2} />
        <Node x={255} y={45} w={135} h={62} label="TCP" sub="RELIABLE STREAM" color="#34d399" tooltip="Connection-oriented transport protocol" active={stage === 1 || stage === 4} />
        <Node x={665} y={45} w={130} h={62} label="SERVER APP" sub="PORT 443" color="#34d399" tooltip="Server application listening on a port" active={stage === 1 || stage === 3 || stage === 4} />
        <LinkLine x1={150} y1={76} x2={255} y2={76} color="#34d399" active={stage === 1} />
        <LinkLine x1={390} y1={76} x2={665} y2={76} color="#34d399" active={stage === 1} />

        <Node x={20} y={215} w={130} h={62} label="CLIENT APP" sub="DNS / VOICE" color="#38bdf8" tooltip="Application process using UDP" active={stage <= 2} />
        <Node x={255} y={215} w={135} h={62} label="UDP" sub="DATAGRAMS" color="#fbbf24" tooltip="Connectionless transport protocol" active={stage === 2 || stage === 4} />
        <Node x={665} y={215} w={130} h={62} label="SERVER APP" sub="PORT 53" color="#fbbf24" tooltip="Server application listening on a UDP port" active={stage === 2 || stage === 3 || stage === 4} />
        <LinkLine x1={150} y1={246} x2={255} y2={246} color="#fbbf24" active={stage === 2} />
        <LinkLine x1={390} y1={246} x2={665} y2={246} color="#fbbf24" active={stage === 2} />

        {stage === 0 && (
          <>
            <MessageBubble x={285} y={130} w={250} title="IP ADDRESS = HOST" detail="needs port to reach the app" color="#38bdf8" />
            <SvgText x={410} y={320} color="#94a3b8" size={10}>`IP` identifies the host · `port` identifies the application endpoint</SvgText>
          </>
        )}
        {stage === 1 && (
          <>
            <Packet point={{ x: 460, y: 76 }} color="#34d399" label="SYN / BYTES" />
            <Packet point={{ x: 560, y: 110 }} color="#6ee7b7" label="ACK" />
            <MessageBubble x={420} y={125} w={200} title="ORDERED STREAM" detail="seq + ack + retransmit" color="#34d399" />
          </>
        )}
        {stage === 2 && (
          <>
            <Packet point={{ x: 480, y: 246 }} color="#fbbf24" label="DATAGRAM 1" />
            <Packet point={{ x: 585, y: 275 }} color="#fde68a" label="DATAGRAM 2" />
            <SvgText x={410} y={315} color="#fde68a" size={10}>NO HANDSHAKE · NO BUILT-IN ACK · NO BUILT-IN ORDERING</SvgText>
          </>
        )}
        {stage === 3 && (
          <>
            <MessageBubble x={245} y={125} w={330} title="MULTIPLEX / DEMULTIPLEX" detail="TCP 443 → web · UDP 53 → DNS" color="#a78bfa" />
            <SvgText x={410} y={315} color="#c4b5fd" size={10}>SOCKET = IP ADDRESS + PORT NUMBER + PROTOCOL</SvgText>
          </>
        )}
        {stage === 4 && (
          <>
            <MessageBubble x={60} y={125} w={330} title="TCP" detail="overhead + state + reliability" color="#34d399" />
            <MessageBubble x={430} y={125} w={330} title="UDP" detail="low overhead + app controls reliability" color="#fbbf24" />
          </>
        )}
      </svg>
    </StepShell>
  )
}

interface HeaderField {
  name: string
  x: number
  y: number
  w: number
  h: number
  size: string
  detail: string
  color: string
}

const tcpHeaderFields: HeaderField[] = [
  { name: 'Source Port', x: 20, y: 70, w: 120, h: 48, size: '16 bits', detail: 'بيحدد تطبيق/عملية المرسل. غالباً يبقى ephemeral port من العميل.', color: '#38bdf8' },
  { name: 'Destination Port', x: 140, y: 70, w: 140, h: 48, size: '16 bits', detail: 'بيحدد التطبيق المستقبل على السيرفر، زي 443 لـ HTTPS أو 22 لـ SSH.', color: '#38bdf8' },
  { name: 'Sequence Number', x: 280, y: 70, w: 170, h: 48, size: '32 bits', detail: 'بيرقّم البايتات المرسلة. بيسمح بترتيب البيانات وكشف الفقد.', color: '#34d399' },
  { name: 'Acknowledgment Number', x: 450, y: 70, w: 190, h: 48, size: '32 bits', detail: 'التالي بايت متوقع استقباله. يعني ACK بيأكد كل اللي قبله.', color: '#34d399' },
  { name: 'Header Length', x: 20, y: 145, w: 120, h: 48, size: '4 bits', detail: 'طول الـ header بـ 32-bit words. الحد الأدنى 20 byte بدون options.', color: '#a78bfa' },
  { name: 'Flags', x: 140, y: 145, w: 120, h: 48, size: '6+ bits', detail: 'SYN, ACK, FIN, RST, PSH, URG وغيرها. بتتحكم في حالة الاتصال.', color: '#fb7185' },
  { name: 'Window Size', x: 260, y: 145, w: 150, h: 48, size: '16 bits', detail: 'الـ receive window المعلن من المستقبل — أداة flow control.', color: '#fbbf24' },
  { name: 'Checksum', x: 410, y: 145, w: 130, h: 48, size: '16 bits', detail: 'بيكتشف تلف في الـ header والـ data. لو فشل الإطار/الـ segment يتسقط.', color: '#fbbf24' },
  { name: 'Urgent Pointer', x: 540, y: 145, w: 140, h: 48, size: '16 bits', detail: 'بيستخدم لما URG مفعّل؛ بيشير لموضع البيانات العاجلة.', color: '#c084fc' },
  { name: 'Options', x: 20, y: 220, w: 250, h: 48, size: 'variable', detail: 'زي MSS و window scale و timestamps.Options بتزود حجم الـ header.', color: '#94a3b8' },
  { name: 'Payload', x: 270, y: 220, w: 410, h: 48, size: 'variable', detail: 'بيانات التطبيق الفعلية. TCP بيتعامل معاها كـ byte stream مش رسائل منفصلة.', color: '#64748b' },
]

export function TcpSegmentHeaderDiagram() {
  const playback = useStepPlayback(tcpHeaderFields.length)
  const stage = playback.stage

  return (
    <StepShell title="TCP SEGMENT HEADER / INTERACTIVE FIELDS" playback={playback} legend={tcpHeaderFields[stage].detail}>
      <div className="min-w-[900px]">
        <svg viewBox="0 0 980 310" className="h-auto w-full" role="img" aria-label="Interactive TCP segment header field diagram">
          <title>TCP segment header fields with selectable explanations</title>
          <SvgText x={490} y={35} color="#e2e8f0" size={12} bold>TCP SEGMENT · MINIMUM HEADER 20 BYTES (WITHOUT OPTIONS)</SvgText>
          {tcpHeaderFields.map((field, index) => {
            const active = index === stage
            return (
              <HeaderFieldBox
                key={field.name}
                field={field}
                active={active}
                onClick={() => playback.goTo(index)}
              />
            )
          })}
          <SvgText x={490} y={292} color="#64748b" size={9}>
            SELECT A FIELD ABOVE OR USE THE BUTTONS BELOW · SIMPLIFIED EDUCATIONAL LAYOUT
          </SvgText>
        </svg>
        <div className="mt-2 flex flex-wrap justify-center gap-1.5" dir="rtl">
          {tcpHeaderFields.map((field, index) => (
            <button
              key={field.name}
              type="button"
              onClick={() => playback.goTo(index)}
              className={`rounded-md border px-2 py-1 text-[0.7rem] transition ${
                index === stage
                  ? 'border-accent-400/60 bg-accent-500/15 text-accent-100'
                  : 'border-sky-400/10 bg-navy-850/70 text-slate-400 hover:border-accent-400/30'
              }`}
            >
              {field.name}
            </button>
          ))}
        </div>
      </div>
    </StepShell>
  )
}

function HeaderFieldBox({ field, active, onClick }: { field: HeaderField; active: boolean; onClick: () => void }) {
  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }}>
      <title>{field.detail}</title>
      <rect
        x={field.x}
        y={field.y}
        width={field.w}
        height={field.h}
        rx="8"
        fill={field.color}
        fillOpacity={active ? 0.24 : 0.08}
        stroke={field.color}
        strokeOpacity={active ? 1 : 0.45}
        strokeWidth={active ? 2.5 : 1.2}
      />
      <SvgText x={field.x + field.w / 2} y={field.y + 20} color={field.color} size={9} bold>{field.name}</SvgText>
      <SvgText x={field.x + field.w / 2} y={field.y + 37} color="#94a3b8" size={8}>{field.size}</SvgText>
    </g>
  )
}

const udpHeaderFields: HeaderField[] = [
  { name: 'Source Port', x: 25, y: 85, w: 180, h: 70, size: '16 bits', detail: 'منفذ التطبيق المرسل. غالباً ephemeral port.', color: '#38bdf8' },
  { name: 'Destination Port', x: 205, y: 85, w: 190, h: 70, size: '16 bits', detail: 'منفذ التطبيق المستقبل، زي 53 لـ DNS أو 123 لـ NTP.', color: '#38bdf8' },
  { name: 'Length', x: 395, y: 85, w: 160, h: 70, size: '16 bits', detail: 'طول الـ UDP datagram كله: header + data.', color: '#fbbf24' },
  { name: 'Checksum', x: 555, y: 85, w: 170, h: 70, size: '16 bits', detail: 'كشف أخطاء اختياري في IPv4 وإلزامي في IPv6؛ UDP مش بيعيد الإرسال لو فشل.', color: '#fb7185' },
  { name: 'Payload', x: 25, y: 190, w: 700, h: 70, size: 'variable', detail: 'بيانات التطبيق. UDP بيحافظ على حدود الرسالة: كل datagram مستقل.', color: '#64748b' },
]

export function UdpDatagramHeaderDiagram() {
  const playback = useStepPlayback(udpHeaderFields.length)
  const stage = playback.stage

  return (
    <StepShell title="UDP DATAGRAM HEADER / 8 BYTES" playback={playback} legend={udpHeaderFields[stage].detail}>
      <div className="min-w-[760px]">
        <svg viewBox="0 0 820 300" className="h-auto w-full" role="img" aria-label="Interactive UDP datagram header diagram">
          <title>UDP datagram header fields and 8-byte size</title>
          <SvgText x={410} y={35} color="#e2e8f0" size={12} bold>UDP DATAGRAM · FIXED HEADER = 8 BYTES</SvgText>
          {udpHeaderFields.map((field, index) => (
            <HeaderFieldBox key={field.name} field={field} active={index === stage} onClick={() => playback.goTo(index)} />
          ))}
          <line x1="25" y1="175" x2="725" y2="175" stroke="#38bdf8" strokeWidth="2" />
          <SvgText x={375} y={172} color="#7dd3fc" size={10} bold>8-BYTE HEADER</SvgText>
          <SvgText x={375} y={285} color="#94a3b8" size={9}>MINIMUM TCP HEADER = 20 BYTES · UDP HEADER = 8 BYTES</SvgText>
        </svg>
        <div className="mt-2 flex flex-wrap justify-center gap-1.5" dir="rtl">
          {udpHeaderFields.map((field, index) => (
            <button
              key={field.name}
              type="button"
              onClick={() => playback.goTo(index)}
              className={`rounded-md border px-2 py-1 text-[0.7rem] transition ${
                index === stage
                  ? 'border-accent-400/60 bg-accent-500/15 text-accent-100'
                  : 'border-sky-400/10 bg-navy-850/70 text-slate-400 hover:border-accent-400/30'
              }`}
            >
              {field.name}
            </button>
          ))}
        </div>
      </div>
    </StepShell>
  )
}

const handshakeStages = [
  'العميل بيرسل `SYN` بـ `Seq = 1000` عشان يبدأ الاتصال ويععلن الـ ISN بتاعه.',
  'السيرفر استقبل الـ SYN وعرف إن العميل عايز يتصل. الـ SYN بيستهلك seq number واحد.',
  'السيرفر بيرد بـ `SYN-ACK`: `Seq = 5000` و `Ack = 1001` — يعني \"أنا مستني البايت 1001\".',
  'العميل استلم الـ SYN-ACK وتأكد إن السيرفر سليم وجاهز للاتصال.',
  'العميل بيرسل `ACK`: `Seq = 1001` و `Ack = 5001` — بيأكد استلام SYN السيرفر.',
  'الاتنين دخلوا `ESTABLISHED` والبيانات ابتدت تمشي في الاتجاهين.',
]

export function TcpHandshakeDiagram() {
  const playback = useStepPlayback(handshakeStages.length)
  const stage = playback.stage
  const clientState = stage === 0 ? 'CLOSED → SYN-SENT' : stage >= 4 ? 'ESTABLISHED' : stage >= 1 ? 'SYN-SENT' : 'CLOSED'
  const serverState = stage <= 1 ? 'LISTEN → SYN-RECEIVED' : stage >= 4 ? 'ESTABLISHED' : 'SYN-RECEIVED'

  const position = [
    { x: 430, y: 105 },
    { x: 635, y: 105 },
    { x: 430, y: 185 },
    { x: 205, y: 185 },
    { x: 430, y: 265 },
    { x: 430, y: 265 },
  ][stage]

  return (
    <StepShell title="TCP THREE-WAY HANDSHAKE / ISN 1000 ↔ 5000" playback={playback} legend={handshakeStages[stage]}>
      <svg viewBox="0 0 820 350" className="h-auto w-full min-w-[720px]" role="img" aria-label="TCP three-way handshake with client ISN 1000 and server ISN 5000">
        <title>TCP three-way handshake sequence and acknowledgment numbers</title>

        <line x1="170" y1="55" x2="170" y2="320" stroke="#1e3a5f" strokeWidth="2" strokeDasharray="6 6" />
        <line x1="650" y1="55" x2="650" y2="320" stroke="#1e3a5f" strokeWidth="2" strokeDasharray="6 6" />

        <Node x={35} y={25} w={270} h={62} label="CLIENT" sub="ISN = 1000" color="#38bdf8" tooltip="Client starts the connection" active={stage <= 4} />
        <Node x={515} y={25} w={270} h={62} label="SERVER" sub="ISN = 5000" color="#34d399" tooltip="Server listens and responds" active={stage >= 1} />

        <SvgText x={170} y={108} color="#7dd3fc" size={9} bold>{clientState}</SvgText>
        <SvgText x={650} y={108} color="#6ee7b7" size={9} bold>{serverState}</SvgText>

        <LinkLine x1={170} y1={stage === 0 || stage === 1 ? 105 : stage === 2 || stage === 3 ? 185 : 265} x2={650} y2={stage === 0 || stage === 1 ? 105 : stage === 2 || stage === 3 ? 185 : 265} color={stage === 2 || stage === 3 ? '#34d399' : '#38bdf8'} active={stage <= 4} />

        {stage <= 4 && (
          <Packet
            point={position}
            color={stage === 2 || stage === 3 ? '#34d399' : '#38bdf8'}
            label={stage === 0 || stage === 1 ? 'SYN' : stage === 2 || stage === 3 ? 'SYN-ACK' : 'ACK'}
          />
        )}

        {stage === 0 && <MessageBubble x={270} y={135} w={280} title="CLIENT → SERVER" detail="SYN · Seq = 1000 · ACK not set" color="#38bdf8" />}
        {stage === 1 && <MessageBubble x={270} y={135} w={280} title="SERVER RECEIVES SYN" detail="SYN consumes one sequence number" color="#38bdf8" />}
        {stage === 2 && <MessageBubble x={270} y={215} w={280} title="SERVER → CLIENT" detail="SYN-ACK · Seq = 5000 · Ack = 1001" color="#34d399" />}
        {stage === 3 && <MessageBubble x={270} y={215} w={280} title="CLIENT RECEIVES SYN-ACK" detail="Ack = 1001 = next expected byte" color="#34d399" />}
        {stage === 4 && <MessageBubble x={270} y={295} w={280} title="CLIENT → SERVER" detail="ACK · Seq = 1001 · Ack = 5001" color="#a78bfa" />}
        {stage === 5 && (
          <>
            <MessageBubble x={240} y={160} w={340} title="ESTABLISHED ↔ ESTABLISHED" detail="seq/ack continue for application data" color="#34d399" />
            <SvgText x={410} y={330} color="#6ee7b7" size={10} bold>REMEMBER: ACK NUMBER = NEXT SEQUENCE NUMBER EXPECTED</SvgText>
          </>
        )}
      </svg>
    </StepShell>
  )
}

const terminationStages = [
  'الاتصال `ESTABLISHED`. التطبيق بيقرر يقفل، والـ TCP هيبدأ sequence من أربع رسائل غالباً.',
  'العميل بيرسل `FIN` ويدخل `FIN-WAIT-1` — معناه \"خلصت الإرسال\".',
  'السيرفر يستلم الـ FIN ويرسل `ACK` ويدخل `CLOSE-WAIT`.',
  'العميل يستلم الـ ACK ويدخل `FIN-WAIT-2` وينتظر FIN من السيرفر.',
  'السيرفر بيرسل `FIN` ويدخل `LAST-ACK`.',
  'العميل يستلم FIN ويرسل ACK ويدخل `TIME-WAIT` — بيفضل شوية عشان يتأكد إن الـ ACK وصل.',
  'السيرفر يستلم الـ ACK ويدخل `CLOSED`.',
  'بعد انتهاء زمن `TIME-WAIT` العميل كمان بيدخل `CLOSED`.',
]

export function TcpTerminationDiagram() {
  const playback = useStepPlayback(terminationStages.length)
  const stage = playback.stage
  const clientStates = ['ESTABLISHED', 'FIN-WAIT-1', 'FIN-WAIT-1', 'FIN-WAIT-2', 'FIN-WAIT-2', 'TIME-WAIT', 'TIME-WAIT', 'CLOSED']
  const serverStates = ['ESTABLISHED', 'ESTABLISHED', 'CLOSE-WAIT', 'CLOSE-WAIT', 'LAST-ACK', 'LAST-ACK', 'CLOSED', 'CLOSED']
  const messages = ['—', 'FIN', 'ACK', '—', 'FIN', 'ACK', '—', '—']
  const active = stage === 1 || stage === 2 || stage === 4 || stage === 5
  const y = stage === 1 ? 105 : stage === 2 ? 170 : stage === 4 ? 235 : 300
  const point = stage === 2 || stage === 5 ? { x: 650, y } : { x: 170, y }

  return (
    <StepShell title="TCP FOUR-WAY TERMINATION / COMMON SEQUENCE" playback={playback} legend={terminationStages[stage]}>
      <svg viewBox="0 0 820 360" className="h-auto w-full min-w-[720px]" role="img" aria-label="TCP four-segment connection termination with state transitions">
        <title>TCP connection termination FIN ACK FIN ACK and TCP states</title>

        <line x1="170" y1="50" x2="170" y2="340" stroke="#1e3a5f" strokeWidth="2" strokeDasharray="6 6" />
        <line x1="650" y1="50" x2="650" y2="340" stroke="#1e3a5f" strokeWidth="2" strokeDasharray="6 6" />

        <Node x={35} y={18} w={270} h={56} label="CLIENT" sub="ACTIVE CLOSE" color="#38bdf8" tooltip="Client initiates the close" active />
        <Node x={515} y={18} w={270} h={56} label="SERVER" sub="PASSIVE CLOSE" color="#34d399" tooltip="Server responds to the close" active={stage >= 2} />

        <SvgText x={170} y={96} color="#7dd3fc" size={9} bold>{clientStates[stage]}</SvgText>
        <SvgText x={650} y={96} color="#6ee7b7" size={9} bold>{serverStates[stage]}</SvgText>

        {[105, 170, 235, 300].map((lineY, index) => (
          <line key={lineY} x1="170" y1={lineY} x2="650" y2={lineY} stroke={index + 1 === Math.ceil(stage / 1) && active ? '#38bdf8' : '#1e3a5f'} strokeOpacity={active ? 0.35 : 0.18} strokeWidth="2" strokeDasharray="6 7" />
        ))}

        {active && <Packet point={point} color="#a78bfa" label={messages[stage]} />}

        <MessageBubble x={270} y={stage <= 2 ? 125 : stage <= 5 ? 255 : 150} w={280} title={`SEGMENT: ${messages[stage]}`} detail="FIN and ACK may be combined in practice" color="#a78bfa" />
        <SvgText x={410} y={352} color="#64748b" size={8}>SIMPLIFIED COMMON FOUR-SEGMENT CLOSE · TIMING AND COMBINED FLAGS CAN VARY</SvgText>
      </svg>
    </StepShell>
  )
}

const flagStages = [
  '`SYN` = synchronize. بيبدأ handshake ويعلن ISN. مثال: العميل بيرسل SYN, Seq=1000.',
  '`ACK` = acknowledgment. بيأكد استلام بيانات. مثال: Ack=1001 يعني البايت 1001 هو التالي المتوقع.',
  '`FIN` = finish. بيطلب إغلاق الاتصال بشكل منظّم. مثال: FIN من العميل في بداية الـ four-way close.',
  '`RST` = reset. بيقطع الاتصال فوراً. مثال: وصول بيانات لمنفذ مفيش عليه listening socket.',
  '`PSH` = push. بيقول \"ادفع البيانات للتطبيق دلوقتي\" بدل ما تستنى الـ buffer.',
  '`URG` = urgent مع `Urgent Pointer`. بيعلّم بيانات عاجلة جوه الـ stream.',
  ' combinations: SYN · SYN-ACK · ACK · FIN-ACK · RST. في ECN.flags كمان، بس دول مش محور CCNA Fundamentals.',
]

export function TcpFlagsDiagram() {
  const playback = useStepPlayback(flagStages.length)
  const stage = playback.stage
  const flags = ['SYN', 'ACK', 'FIN', 'RST', 'PSH', 'URG']

  return (
    <StepShell title="TCP FLAGS / CONTROL BITS" playback={playback} legend={flagStages[stage]}>
      <svg viewBox="0 0 820 330" className="h-auto w-full min-w-[720px]" role="img" aria-label="TCP flags SYN ACK FIN RST PSH URG and common combinations">
        <title>TCP control flags and their purposes</title>
        <SvgText x={410} y={35} color="#e2e8f0" size={12} bold>TCP HEADER FLAGS</SvgText>

        {flags.map((flag, index) => {
          const active = index === stage
          return (
            <FlagBox
              key={flag}
              label={flag}
              x={25 + index * 130}
              y={70}
              w={115}
              h={58}
              active={active}
              color={index === 3 ? '#fb7185' : '#38bdf8'}
            />
          )
        })}

        <rect x="25" y="165" width="770" height="62" rx="12" fill="#0b1224" stroke="#1e3a5f" />
        <SvgText x={410} y={190} color={stage < 6 ? '#7dd3fc' : '#c4b5fd'} size={11} bold>
          {stage < 6 ? `${flags[stage]} · ${flagStages[stage].split('.')[0]}` : 'COMMON COMBINATIONS'}
        </SvgText>
        <SvgText x={410} y={212} color="#94a3b8" size={9}>
          {stage < 6 ? 'Meaning · purpose · when it is used' : 'SYN · SYN-ACK · ACK · FIN-ACK · RST'}
        </SvgText>

        {stage === 6 && (
          <>
            {['SYN', 'SYN-ACK', 'ACK', 'FIN-ACK', 'RST'].map((label, index) => (
              <FlagBox key={label} label={label} x={45 + index * 150} y={250} w={135} h={42} active={index % 2 === 0} color="#a78bfa" />
            ))}
          </>
        )}

        <SvgText x={410} y={320} color="#64748b" size={8}>ECN-RELATED FLAGS EXIST · FOCUS HERE ON THE FLAGS RELEVANT TO CCNA FUNDAMENTALS</SvgText>
      </svg>
    </StepShell>
  )
}

function FlagBox({ label, x, y, w, h, active, color }: { label: string; x: number; y: number; w: number; h: number; active: boolean; color: string }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="9"
        fill={color}
        fillOpacity={active ? 0.25 : 0.08}
        stroke={color}
        strokeOpacity={active ? 1 : 0.4}
        strokeWidth={active ? 2.5 : 1.2}
      />
      <SvgText x={x + w / 2} y={y + h / 2 + 4} color={color} size={11} bold>{label}</SvgText>
    </g>
  )
}

const sequenceStages = [
  'الـ ISN بتاع العميل = 1000 والسيرفر = 5000. الأرقام دي هي نقطة البداية لكل اتجاه.',
  'العميل بيرسل 100 byte: `Seq = 1000`. السيرفر يرد `Ack = 1100` — يعني استلم لحد 1099.',
  'العميل يرسل 100 byte تانية: `Seq = 1100`. الـ ACK يبقى `1200`.',
  'السيغمنت `Seq = 1200` اتضاع. السيرفر لسه مستني البايت 1200.',
  'سيغمنت `Seq = 1300` وصل قبل المفقود → **out of order**. السيرفر يرسل `duplicate ACK = 1200`.',
  'إعادة إرسال `Seq = 1200` توصل → السيرفر يقدر يأكد `Ack = 1400` لأن الـ 1300 كان وصل بالفعل.',
]

export function TcpSequenceAckDiagram() {
  const playback = useStepPlayback(sequenceStages.length)
  const stage = playback.stage
  const segments = [
    { seq: '1000', color: '#38bdf8' },
    { seq: '1100', color: '#34d399' },
    { seq: '1200', color: '#fb7185' },
    { seq: '1300', color: '#a78bfa' },
  ]
  const ack = ['—', '1100', '1200', '1200', '1200 (dup)', '1400'][stage]

  return (
    <StepShell title="TCP SEQUENCE / ACK NUMBERS / BYTE STREAM" playback={playback} legend={sequenceStages[stage]}>
      <svg viewBox="0 0 820 330" className="h-auto w-full min-w-[720px]" role="img" aria-label="TCP sequence numbers acknowledgments out-of-order and duplicate ACK example">
        <title>TCP sequence and acknowledgment number example</title>

        <Node x={25} y={35} w={150} h={60} label="SENDER" sub="ISN 1000" color="#38bdf8" tooltip="Sender byte-stream sequence numbers" active />
        <Node x={645} y={35} w={150} h={60} label="RECEIVER" sub="ISN 5000" color="#34d399" tooltip="Receiver acknowledges next expected byte" active />
        <LinkLine x1={175} y1={65} x2={645} y2={65} color="#38bdf8" active={stage >= 1} />

        <SvgText x={410} y={140} color="#94a3b8" size={10} bold>BYTE STREAM SEGMENTS</SvgText>
        {segments.map((segment, index) => {
          const lost = index === 2 && stage === 3
          const arrived = index === 3 && stage >= 4
          return (
            <g key={segment.seq}>
              <rect
                x={60 + index * 180}
                y={165}
                width="160"
                height="58"
                rx="9"
                fill={segment.color}
                fillOpacity={lost ? 0.06 : arrived || index < stage ? 0.2 : 0.08}
                stroke={segment.color}
                strokeOpacity={lost ? 0.35 : 0.8}
                strokeDasharray={lost ? '6 6' : undefined}
              />
              <SvgText x={140 + index * 180} y={190} color={segment.color} size={10} bold>{`Seq = ${segment.seq}`}</SvgText>
              <SvgText x={140 + index * 180} y={210} color={lost ? '#fb7185' : '#94a3b8'} size={9}>{lost ? 'LOST' : index === 2 && stage >= 5 ? 'RETRANSMITTED' : '100 bytes'}</SvgText>
            </g>
          )
        })}

        {stage === 4 && <SvgText x={410} y={255} color="#fda4af" size={11} bold>OUT-OF-ORDER ARRIVAL → DUPLICATE ACK = 1200</SvgText>}
        {stage === 5 && <SvgText x={410} y={255} color="#6ee7b7" size={11} bold>RETRANSMIT 1200 → CUMULATIVE ACK = 1400</SvgText>}

        <rect x="270" y="275" width="280" height="38" rx="9" fill="#0b1224" stroke="#a78bfa" />
        <SvgText x={410} y={299} color="#c4b5fd" size={10} bold>{`ACK NEXT EXPECTED BYTE = ${ack}`}</SvgText>
      </svg>
    </StepShell>
  )
}

const retransmissionStages = [
  'حالة طبيعية: المرسل بيرسل `Seq=1000` والمستقبل يرد `Ack=1100`.',
  'السيغمنت اتضاع في الشبكة — مفيش ACK رجع.',
  'الـ retransmission timeout (RTO) انتهى. TCP بيعيد إرسال نفس الـ `Seq=1000`. RTO مش قيمة ثابتة؛ TCP بيحدّثه ديناميكياً.',
  'النسخة المعادة وصلت والمستقبل رد `Ack=1100`.',
  'Fast retransmit: ثلاثة `duplicate ACKs` بيسمحوا بإعادة الإرسال قبل ما الـ RTO يخلص.',
  'تنبيه: الرسم تعليمي مبسّط؛ السلوك التفصيلي بيختلف حسب إصدار TCP والتنفيذ.',
]

export function TcpRetransmissionDiagram() {
  const playback = useStepPlayback(retransmissionStages.length)
  const stage = playback.stage
  const showOriginal = stage === 0 || stage === 1 || stage === 3
  const lost = stage === 1
  const retransmit = stage === 2 || stage === 3 || stage === 4
  const ack = stage === 0 || stage === 3

  return (
    <StepShell title="TCP RETRANSMISSION / RTO + DUPLICATE ACK" playback={playback} legend={retransmissionStages[stage]}>
      <svg viewBox="0 0 820 330" className="h-auto w-full min-w-[720px]" role="img" aria-label="TCP retransmission after timeout and after duplicate acknowledgments">
        <title>TCP lost segment retransmission and fast retransmit</title>

        <Node x={25} y={35} w={150} h={60} label="SENDER" sub="TCP" color="#38bdf8" tooltip="Sender retransmits the unacknowledged segment" active />
        <Node x={645} y={35} w={150} h={60} label="RECEIVER" sub="TCP" color="#34d399" tooltip="Receiver sends acknowledgments" active />
        <LinkLine x1={175} y1={110} x2={645} y2={110} color="#38bdf8" active={showOriginal || retransmit} />
        <LinkLine x1={645} y1={205} x2={175} y2={205} color="#34d399" active={ack || stage === 4} />

        {showOriginal && (
          <Packet point={{ x: 410, y: 110 }} color={lost ? '#fb7185' : '#38bdf8'} label={lost ? 'LOST' : 'Seq=1000'} />
        )}
        {lost && <SvgText x={410} y={160} color="#fb7185" size={11} bold>NO ACK RETURNED</SvgText>}
        {retransmit && <Packet point={{ x: 410, y: 145 }} color="#fbbf24" label="RETX Seq=1000" />}
        {ack && <Packet point={{ x: 410, y: 205 }} color="#34d399" label="Ack=1100" />}

        {stage === 4 && (
          <>
            <SvgText x={410} y={250} color="#fda4af" size={11} bold>DUP ACK · DUP ACK · DUP ACK → FAST RETRANSMIT</SvgText>
            <SvgText x={410} y={272} color="#c4b5fd" size={9}>THREE DUPLICATE ACKS SUGGEST A SEGMENT WAS LOST</SvgText>
          </>
        )}
        <SvgText x={410} y={312} color="#64748b" size={8}>SIMPLIFIED EDUCATIONAL ILLUSTRATION · ADAPTIVE RTO AND IMPLEMENTATION DETAILS NOT SHOWN</SvgText>
      </svg>
    </StepShell>
  )
}

const windowStages = [
  'المستقبل بيعلن `receive window (rwnd) = 400 bytes` — يعني عنده مساحة 400 بايت في الـ buffer.',
  'المرسل يقدر يبعت 4 سيغمنتات من 100 بايت: `1000–1399` من غير ما ينتظر ACK لكل واحد.',
  'وصل `Ack=1100`، فالـ window يتزحزق: المسموح دلوقتي `1100–1499`. ده اسمه **sliding window**.',
  'المستقبل اتزحم وعلن `rwnd=100`. المرسل يقدر يبعت سيغمنت واحد بس وينتظر تحديث.',
  'مهم: `rwnd` بيحمي المستقبل (flow control). أمّا `cwnd` فبيحمي الشبكة من الازدحام (congestion control).',
]

export function TcpSlidingWindowDiagram() {
  const playback = useStepPlayback(windowStages.length)
  const stage = playback.stage
  const rwnd = ['400', '400', '400', '100', '100'][stage]
  const windowStart = stage === 0 || stage === 1 ? 1000 : stage === 2 ? 1100 : 1300
  const windowSize = stage === 3 || stage === 4 ? 100 : 400
  const windowEnd = windowStart + windowSize - 1

  return (
    <StepShell title="TCP SLIDING WINDOW / FLOW CONTROL" playback={playback} legend={windowStages[stage]}>
      <svg viewBox="0 0 820 330" className="h-auto w-full min-w-[720px]" role="img" aria-label="TCP sliding window showing receive window and flow control">
        <title>TCP sliding window and receive window flow control</title>

        <Node x={25} y={30} w={160} h={58} label="SENDER" sub="cwnd" color="#38bdf8" tooltip="Sender respects receiver window and congestion window" active />
        <Node x={635} y={30} w={160} h={58} label="RECEIVER" sub="rwnd" color="#34d399" tooltip="Receiver advertises available buffer space" active />
        <LinkLine x1={185} y1={60} x2={635} y2={60} color="#38bdf8" active={stage === 1 || stage === 2 || stage === 3} />
        <LinkLine x1={635} y1={105} x2={185} y2={105} color="#a78bfa" active={stage === 0 || stage === 2 || stage === 3} />

        <SvgText x={410} y={155} color="#94a3b8" size={10} bold>BYTE NUMBER WINDOW</SvgText>
        <line x1="60" y1="195" x2="760" y2="195" stroke="#334155" strokeWidth="4" />
        {[1000, 1100, 1200, 1300, 1400, 1500].map((value, index) => (
          <g key={value}>
            <line x1={60 + index * 140} y1="185" x2={60 + index * 140} y2="205" stroke="#64748b" strokeWidth="2" />
            <SvgText x={60 + index * 140} y={225} color="#64748b" size={9}>{String(value)}</SvgText>
          </g>
        ))}

        <motion.rect
          x={60 + ((windowStart - 1000) / 100) * 140}
          y="178"
          width={(windowSize / 100) * 140}
          height="34"
          rx="8"
          fill="#38bdf8"
          fillOpacity="0.2"
          stroke="#38bdf8"
          animate={{ x: [60 + ((windowStart - 1000) / 100) * 140, 60 + ((windowStart - 1000) / 100) * 140 + 8, 60 + ((windowStart - 1000) / 100) * 140] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
        <SvgText x={410} y={265} color="#7dd3fc" size={11} bold>{`ALLOWED: ${windowStart} – ${windowEnd}`}</SvgText>

        <rect x="245" y="285" width="330" height="34" rx="9" fill="#0b1224" stroke="#a78bfa" />
        <SvgText x={410} y={307} color="#c4b5fd" size={10} bold>{`rwnd = ${rwnd} bytes · cwnd = network protection`}</SvgText>
      </svg>
    </StepShell>
  )
}

const portStages = [
  'الـ IP بيوصل الـ packet لعنوان `192.168.20.10`، بس محتاج port عشان يعرف أي تطبيق.',
  '`TCP 443` بيتوجّه لـ web service، و`UDP 53` بيتوجّه لـ DNS service على نفس السيرفر.',
  'العميل بيختار `ephemeral source port` عشان يفرّق بين أكتر من جلسة على نفس الجهاز.',
  'الـ **five-tuple**: source IP · source port · destination IP · destination port · protocol — بيعرّف الجلسة.',
  'تنبيه: رقم المنفذ لوحده مش ضمانة للتطبيق؛ لازم تعرف البروتوكول والسياق والخدمة الفعلية.',
]

export function TcpUdpPortDiagram() {
  const playback = useStepPlayback(portStages.length)
  const stage = playback.stage

  return (
    <StepShell title="TCP / UDP PORTS / MULTIPLEXING" playback={playback} legend={portStages[stage]}>
      <svg viewBox="0 0 820 350" className="h-auto w-full min-w-[720px]" role="img" aria-label="TCP and UDP port numbers directing traffic to server applications">
        <title>TCP and UDP port communication and the five-tuple</title>

        <Node x={25} y={45} w={190} h={62} label="PC1" sub="192.168.10.10" color="#38bdf8" tooltip="Client one with an ephemeral source port" active={stage <= 3} />
        <Node x={25} y={170} w={190} h={62} label="PC2" sub="192.168.10.11" color="#a78bfa" tooltip="Client two with a different ephemeral source port" active={stage <= 3} />
        <Node x={610} y={100} w={185} h={80} label="SERVER" sub="192.168.20.10" color="#34d399" tooltip="Server offering TCP 443 and UDP 53" active />

        <LinkLine x1={215} y1={76} x2={610} y2={125} color="#34d399" active={stage === 1 || stage === 2} />
        <LinkLine x1={215} y1={201} x2={610} y2={160} color="#fbbf24" active={stage === 1 || stage === 2} />

        {stage === 0 && <MessageBubble x={275} y={125} w={280} title="DESTINATION IP" detail="192.168.20.10 identifies the host" color="#38bdf8" />}
        {stage === 1 && (
          <>
            <Packet point={{ x: 430, y: 105 }} color="#34d399" label="TCP → 443" />
            <Packet point={{ x: 430, y: 180 }} color="#fbbf24" label="UDP → 53" />
          </>
        )}
        {stage === 2 && (
          <>
            <MessageBubble x={250} y={110} w={150} title="PC1" detail="src 49152" color="#38bdf8" />
            <MessageBubble x={250} y={205} w={150} title="PC2" detail="src 49153" color="#a78bfa" />
            <SvgText x={520} y={255} color="#c4b5fd" size={10}>EPHEMERAL SOURCE PORTS DISTINGUISH SESSIONS</SvgText>
          </>
        )}
        {stage === 3 && (
          <g>
            <rect x="185" y="245" width="450" height="70" rx="10" fill="#0b1224" stroke="#a78bfa" />
            <SvgText x={410} y={266} color="#c4b5fd" size={10} bold>FIVE-TUPLE</SvgText>
            <SvgText x={410} y={286} color="#cbd5e1" size={9}>192.168.10.10 : 49152 → 192.168.20.10 : 443 · TCP</SvgText>
            <SvgText x={410} y={304} color="#94a3b8" size={8}>source IP · source port · dest IP · dest port · protocol</SvgText>
          </g>
        )}
        {stage === 4 && <MessageBubble x={240} y={260} w={340} title="PORT ALONE IS NOT IDENTITY" detail="protocol + context + service matter" color="#fb7185" />}

        <SvgText x={410} y={342} color="#64748b" size={8}>WELL-KNOWN 0–1023 · REGISTERED 1024–49151 · DYNAMIC/PRIVATE 49152–65535</SvgText>
      </svg>
    </StepShell>
  )
}
