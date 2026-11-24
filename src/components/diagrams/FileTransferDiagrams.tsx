import { motion } from 'framer-motion'
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { RichText } from '../ui/RichText'
import { LinkLine } from './ArchitectureDiagrams'
import { SvgText } from './FiberDiagrams'

interface StepPlayback {
  stage: number
  playing: boolean
  toggle: () => void
  next: () => void
  previous: () => void
  reset: () => void
}

function useStepPlayback(length: number): StepPlayback {
  const [stage, setStage] = useState(0)
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => setStage((current) => (current + 1) % length), 2300)
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
  }
}

function StepControls({ playback }: { playback: StepPlayback }) {
  const base = 'flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[0.75rem] transition'
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={playback.toggle} className={`${base} border-accent-400/30 bg-accent-500/10 font-bold text-accent-300 hover:bg-accent-500/20`}>
        {playback.playing ? <Pause size={13} /> : <Play size={13} />}
        {playback.playing ? 'إيقاف' : 'شغّل'}
      </button>
      <button type="button" onClick={playback.previous} className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}><SkipBack size={13} /> السابق</button>
      <button type="button" onClick={playback.next} className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}><SkipForward size={13} /> التالي</button>
      <button type="button" onClick={playback.reset} className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}><RotateCcw size={13} /> إعادة</button>
    </div>
  )
}

function StepShell({ title, playback, legend, children }: { title: string; playback: StepPlayback; legend: string; children: ReactNode }) {
  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-sky-400/12 bg-navy-950/70">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-400/10 px-4 py-3">
        <span className="font-display text-[0.78rem] font-bold text-slate-300" dir="ltr">{title}</span>
        <StepControls playback={playback} />
      </div>
      <div className="diagram-grid overflow-x-auto px-2 py-4" dir="ltr">{children}</div>
      <div className="border-t border-sky-400/10 bg-sky-400/[0.03] px-4 py-3 text-[0.85rem] leading-[1.9] text-slate-300" dir="rtl">
        <span className="ml-2 rounded bg-accent-500/15 px-1.5 py-0.5 font-display text-[0.7rem] font-bold text-accent-300" dir="ltr">{playback.stage + 1}</span>
        <RichText>{legend}</RichText>
      </div>
    </div>
  )
}

interface Choice {
  id: string
  label: string
}

function ChoiceButtons({ items, selected, onSelect }: { items: Choice[]; selected: string; onSelect: (id: string) => void }) {
  const base = 'rounded-lg border px-2.5 py-1.5 text-[0.74rem] transition'
  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item.id)}
          className={`${base} ${selected === item.id ? 'border-accent-400/50 bg-accent-500/15 font-bold text-accent-200' : 'border-sky-400/15 text-slate-300 hover:border-accent-400/40'}`}
          dir="ltr"
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

function ChoiceShell({ title, controls, legend, children }: { title: string; controls: ReactNode; legend: string; children: ReactNode }) {
  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-sky-400/12 bg-navy-950/70">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-400/10 px-4 py-3">
        <span className="font-display text-[0.78rem] font-bold text-slate-300" dir="ltr">{title}</span>
        <div dir="rtl">{controls}</div>
      </div>
      <div className="diagram-grid overflow-x-auto px-2 py-4" dir="ltr">{children}</div>
      <motion.div key={legend} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="border-t border-sky-400/10 bg-sky-400/[0.03] px-4 py-3 text-[0.85rem] leading-[1.9] text-slate-300" dir="rtl">
        <RichText>{legend}</RichText>
      </motion.div>
    </div>
  )
}

function Box({ x, y, w, h, title, sub, color, active = false }: { x: number; y: number; w: number; h: number; title: string; sub: string; color: string; active?: boolean }) {
  return (
    <g opacity={active ? 1 : 0.42}>
      <rect x={x} y={y} width={w} height={h} rx="11" fill="#0b1224" stroke={color} strokeWidth={active ? 2.2 : 1.2} />
      <SvgText x={x + w / 2} y={y + 24} color={color} size={10} bold>{title}</SvgText>
      <SvgText x={x + w / 2} y={y + 43} color="#cbd5e1" size={8.5}>{sub}</SvgText>
    </g>
  )
}

function Badge({ x, y, text, color = '#38bdf8', active = true, w = 220 }: { x: number; y: number; text: string; color?: string; active?: boolean; w?: number }) {
  return (
    <g opacity={active ? 1 : 0.38}>
      <rect x={x} y={y} width={w} height={24} rx="7" fill="#0a1730" stroke={color} strokeWidth={active ? 1.8 : 1} />
      <SvgText x={x + w / 2} y={y + 16} color={color} size={8.2} bold>{text}</SvgText>
    </g>
  )
}

function FlowDot({ x1, y1, x2, y2, color, active }: { x1: number; y1: number; x2: number; y2: number; color: string; active: boolean }) {
  return (
    <motion.circle
      r={7}
      fill={color}
      initial={false}
      animate={active ? { cx: [x1, x2], cy: [y1, y2], opacity: [0.25, 1, 0.25] } : { cx: x1, cy: y1, opacity: 0.22 }}
      transition={{ duration: 1.8, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
    />
  )
}

function ClickNode({
  x, y, w, h, title, sub, color, selected, onClick,
}: {
  x: number
  y: number
  w: number
  h: number
  title: string
  sub: string
  color: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <motion.g
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick()
        }
      }}
      className="cursor-pointer"
      animate={{ opacity: selected ? 1 : 0.58 }}
      transition={{ duration: 0.25 }}
    >
      <rect x={x} y={y} width={w} height={h} rx="9" fill="#0b1224" stroke={selected ? '#f59e0b' : color} strokeWidth={selected ? 2.5 : 1.2} />
      {selected && <rect x={x - 3} y={y - 3} width={w + 6} height={h + 6} rx="11" fill="none" stroke="#f59e0b" strokeOpacity="0.35" strokeWidth="1.5" />}
      <SvgText x={x + w / 2} y={y + 24} color={selected ? '#fbbf24' : color} size={9} bold>{title}</SvgText>
      <SvgText x={x + w / 2} y={y + h - 10} color="#cbd5e1" size={7.5}>{sub}</SvgText>
    </motion.g>
  )
}

const fundamentalsStages = [
  'File Transfer Protocol يعني نقل ملف بين Local Device وRemote Server عبر الشبكة.',
  'المسؤول يحتاج ينقل Running Configuration وStartup Configuration وCisco IOS Images وLog Files.',
  'Network Device ممكن يكون Client يرسل ملف إلى Server أو يستقبل ملف منه.',
  'Local Storage مثل RAM وNVRAM وFlash يختلف عن Remote Storage على TFTP أو FTP Server.',
  'النسخ الاحتياطي يساعد في Disaster Recovery والرجوع لتكوين سابق بعد تغيير فاشل.',
]

export function FileTransferFundamentalsDiagram() {
  const playback = useStepPlayback(fundamentalsStages.length)
  const s = playback.stage
  return (
    <StepShell title="FILE TRANSFER FUNDAMENTALS" playback={playback} legend={fundamentalsStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="File transfer fundamentals between administrator network devices and remote server">
        <Box x={60} y={160} w={200} h={90} title="Administrator" sub="PC / management host" color="#38bdf8" active />
        <Box x={360} y={160} w={180} h={90} title="Network" sub="IP path" color="#a78bfa" active={s >= 1} />
        <Box x={60} y={290} w={200} h={80} title="Router / Switch" sub="Local storage" color="#34d399" active={s >= 2} />
        <Box x={650} y={160} w={210} h={90} title="TFTP / FTP Server" sub="Remote storage" color="#f59e0b" active={s >= 3} />
        <LinkLine x1={260} y1={205} x2={360} y2={205} color="#38bdf8" active />
        <LinkLine x1={540} y1={205} x2={650} y2={205} color="#f59e0b" active={s >= 3} />
        <FlowDot x1={260} y1={205} x2={650} y2={205} color="#f59e0b" active={s >= 4} />
        {s >= 4 && <Badge x={240} y={380} text="Backup → verify → restore when needed" color="#34d399" active w={440} />}
      </svg>
    </StepShell>
  )
}

interface RoleItem {
  id: string
  label: string
  detail: string
  color: string
}

const roles: RoleItem[] = [
  { id: 'client', label: 'Client', detail: 'الجهاز الذي يبدأ الطلب؛ قد يكون Router أو Switch أو PC. يرسل RRQ/WRQ في TFTP أو أوامر مثل get/put في FTP.', color: '#38bdf8' },
  { id: 'server', label: 'Server', detail: 'الجهاز الذي يستقبل الطلب ويخزّن الملفات؛ مثل TFTP أو FTP Server. يرسل البيانات أو يستقبلها حسب نوع العملية.', color: '#34d399' },
]

export function ClientVsServerDiagram() {
  const [selected, setSelected] = useState('client')
  const item = roles.find((entry) => entry.id === selected) ?? roles[0]
  const controls = <ChoiceButtons items={roles.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="CLIENT vs SERVER ROLES" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Interactive client and server roles in file transfer">
        <Box x={60} y={110} w={360} h={160} title="CLIENT" sub="Initiates request" color="#38bdf8" active={selected === 'client'} />
        <Box x={500} y={110} w={360} h={160} title="SERVER" sub="Stores and serves files" color="#34d399" active={selected === 'server'} />
        <LinkLine x1={420} y1={190} x2={500} y2={190} color="#f59e0b" active />
        <FlowDot x1={420} y1={190} x2={500} y2={190} color="#f59e0b" active />
        <Badge x={220} y={330} text="A network device can be a client or a source of files" color="#a78bfa" active w={480} />
      </svg>
    </ChoiceShell>
  )
}

const tftpArchStages = [
  'TFTP — Trivial File Transfer Protocol — بروتوكول بسيط لنقل الملفات.',
  'يعمل ب-model Client/Server فوق UDP، ويبدأ الطلب على **UDP Port 69**.',
  'الطلب يكون RRQ للقراءة أو WRQ للكتابة.',
  'بعد بدء الطلب، بيانات TFTP والـ ACKs تستخدم UDP Transfer Identifiers (TIDs) على منافذ ديناميكية.',
  'TFTP خفيف لكنه بدون مصادقة مدمجة وتشفير مدمج، ويُستخدم في بيئات إدارة موثوقة.',
]

export function TftpArchitectureDiagram() {
  const playback = useStepPlayback(tftpArchStages.length)
  const s = playback.stage
  return (
    <StepShell title="TFTP ARCHITECTURE" playback={playback} legend={tftpArchStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="TFTP client server architecture with UDP port 69 and dynamic transfer identifiers">
        <Box x={60} y={160} w={230} h={95} title="TFTP Client" sub="Router / PC" color="#38bdf8" active />
        <Box x={640} y={160} w={230} h={95} title="TFTP Server" sub="File repository" color="#34d399" active={s >= 1} />
        <LinkLine x1={290} y1={207} x2={640} y2={207} color="#f59e0b" active={s >= 1} />
        {s >= 1 && <FlowDot x1={290} y1={207} x2={640} y2={207} color="#f59e0b" active />}
        {s >= 1 && <Badge x={300} y={100} text="Initial request: UDP 69" color="#a78bfa" active w={320} />}
        {s >= 3 && <Badge x={260} y={320} text="DATA / ACK → dynamic UDP TIDs, not always port 69" color="#f59e0b" active w={480} />}
        {s >= 4 && <Badge x={280} y={370} text="No built-in authentication · no built-in encryption" color="#fb7185" active w={440} />}
      </svg>
    </StepShell>
  )
}

const rrqStages = [
  'Client يريد ملفاً من الـ Server؛ يرسل **RRQ (Read Request)** إلى UDP Port 69.',
  'الطلب يحدد اسم الملف ووضع النقل وخيارات مثل block size إن دعمت.',
  'الخادم يختار Transfer Identifier (TID) ويبدأ إرسال DATA Block 1.',
  'العميل يرسل ACK لكل block ويستقبل التالي في نموذج Stop-and-Wait.',
  'عند استلام آخر block ينتهي النقل بنجاح.',
]

export function TftpRrqFlowDiagram() {
  const playback = useStepPlayback(rrqStages.length)
  const s = playback.stage
  return (
    <StepShell title="TFTP READ REQUEST (RRQ)" playback={playback} legend={rrqStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="TFTP read request RRQ download flow">
        <Box x={60} y={150} w={220} h={95} title="Client" sub="Wants a file" color="#38bdf8" active />
        <Box x={640} y={150} w={220} h={95} title="Server" sub="Has the file" color="#34d399" active />
        <LinkLine x1={280} y1={197} x2={640} y2={197} color="#f59e0b" active={s >= 0} />
        {s === 0 && <FlowDot x1={280} y1={197} x2={640} y2={197} color="#a78bfa" active />}
        {s >= 2 && <FlowDot x1={640} y1={230} x2={280} y2={230} color="#34d399" active />}
        {s >= 1 && <Badge x={300} y={70} text="RRQ → UDP 69 (initial)" color="#a78bfa" active w={330} />}
        {s >= 2 && <Badge x={300} y={300} text="DATA block 1 → ACK 1 → DATA block 2 ..." color="#f59e0b" active w={430} />}
        {s >= 4 && <Badge x={330} y={360} text="Download complete" color="#34d399" active w={280} />}
      </svg>
    </StepShell>
  )
}

const wrqStages = [
  'Client يريد إرسال ملف؛ يرسل **WRQ (Write Request)** إلى UDP Port 69.',
  'الخادم يستقبل الطلب ويرسل ACK للطلب للسماح ببدء الإرسال.',
  'العميل يرسل DATA Blocks، ويحتوي كل block على رقم تسلسلي.',
  'الخادم يرسل ACK لكل block المستلم.',
  'بعد ACK للـ block الأخير ينتهي الـ Upload.',
]

export function TftpWrqFlowDiagram() {
  const playback = useStepPlayback(wrqStages.length)
  const s = playback.stage
  return (
    <StepShell title="TFTP WRITE REQUEST (WRQ)" playback={playback} legend={wrqStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="TFTP write request WRQ upload flow">
        <Box x={60} y={150} w={220} h={95} title="Client" sub="Sends a file" color="#38bdf8" active />
        <Box x={640} y={150} w={220} h={95} title="Server" sub="Receives file" color="#34d399" active />
        <LinkLine x1={280} y1={197} x2={640} y2={197} color="#f59e0b" active />
        {s === 0 && <FlowDot x1={280} y1={197} x2={640} y2={197} color="#a78bfa" active />}
        {s === 1 && <FlowDot x1={640} y1={230} x2={280} y2={230} color="#34d399" active />}
        {s >= 2 && <FlowDot x1={280} y1={265} x2={640} y2={265} color="#f59e0b" active />}
        {s >= 1 && <Badge x={300} y={70} text="WRQ → UDP 69 → ACK request" color="#a78bfa" active w={370} />}
        {s >= 2 && <Badge x={280} y={330} text="DATA block N → ACK N (dynamic TIDs)" color="#f59e0b" active w={470} />}
        {s >= 4 && <Badge x={330} y={375} text="Upload complete" color="#34d399" active w={280} />}
      </svg>
    </StepShell>
  )
}

const dataAckStages = [
  'ابدأ الطلب: RRQ للتنزيل أو WRQ للرفع على UDP 69.',
  'DATA Block 1 ينتقل من Client إلى Server في حالة WRQ.',
  'Server يرسل ACK 1.',
  'DATA Block 2 ينتقل.',
  'Server يرسل ACK 2.',
  'DATA Block 3 وأخيراً ACK 3.',
  'آخر block معناه اكتمال النقل.',
  'لو ACK تأخر يحدث Timeout وRetransmission للـ block.',
]

export function TftpDataAckDiagram() {
  const playback = useStepPlayback(dataAckStages.length)
  const s = playback.stage
  const toServer = s === 1 || s === 3 || s === 5
  const toClient = s === 2 || s === 4 || s === 6
  const packet = s === 0 ? 'RRQ / WRQ' : s === 7 ? 'Timeout → retransmit' : s % 2 === 1 ? `DATA ${(s + 1) / 2}` : `ACK ${s / 2}`
  return (
    <StepShell title="TFTP DATA / ACK EXCHANGE" playback={playback} legend={dataAckStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Animated TFTP DATA and ACK stop-and-wait exchange">
        <Box x={60} y={160} w={220} h={95} title="TFTP Client" sub="Local device" color="#38bdf8" active />
        <Box x={640} y={160} w={220} h={95} title="TFTP Server" sub="Remote file" color="#34d399" active />
        <LinkLine x1={280} y1={207} x2={640} y2={207} color="#475569" active />
        <LinkLine x1={280} y1={250} x2={640} y2={250} color="#475569" active />
        {toServer && <FlowDot x1={280} y1={207} x2={640} y2={207} color="#f59e0b" active />}
        {toClient && <FlowDot x1={640} y1={250} x2={280} y2={250} color="#34d399" active />}
        <Badge x={350} y={90} text={`PACKET: ${packet}`} color={s === 7 ? '#fb7185' : '#a78bfa'} active w={300} />
        <Badge x={250} y={330} text="Stop-and-Wait: one block is acknowledged before the next" color="#f59e0b" active w={480} />
      </svg>
    </StepShell>
  )
}

const blockSizes: RoleItem[] = [
  { id: '512', label: '512 bytes (default)', detail: 'Default block size في TFTP الأساسي؛ كل DATA packet يحمل block number، والـ ACK يؤكد نفس الرقم.', color: '#a78bfa' },
  { id: '1024', label: '1024 bytes', detail: 'حجم أكبر يقلل عدد الرحلاتเมื่อ مقارنته بـ 512، ويعتمد دعمه على تفاوض الخيارات بين client وserver.', color: '#38bdf8' },
  { id: '1452', label: '1452 bytes', detail: 'مثال على حجم أكبر يستخدم عند دعم Options؛ قد يزيد أثر الفقد أو التجزئة على الـ link.', color: '#f59e0b' },
  { id: 'option', label: 'Negotiated option', detail: 'بعض التطبيقات تتفاوض على Block Size؛ المدعوم يعتمد على TFTP client/server، وليس قاعدة عالمية.', color: '#34d399' },
]

export function TftpBlockSizeDiagram() {
  const [selected, setSelected] = useState('512')
  const item = blockSizes.find((entry) => entry.id === selected) ?? blockSizes[0]
  const controls = <ChoiceButtons items={blockSizes.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="TFTP BLOCK SIZE EXPLORER" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="TFTP block size explorer with block numbers and ACKs">
        {blockSizes.map((entry, index) => {
          const x = 35 + index * 225
          const active = entry.id === selected
          return (
            <g key={entry.id} opacity={active ? 1 : 0.45}>
              <rect x={x} y={100} width={205} height={170} rx="10" fill="#0b1224" stroke={active ? '#f59e0b' : '#334155'} strokeWidth={active ? 2.4 : 1.2} />
              <SvgText x={x + 102} y={155} color={active ? '#fbbf24' : '#94a3b8'} size={9} bold>{entry.label}</SvgText>
              <rect x={x + 25} y={195} width={155} height={16} rx="6" fill="#0f2338" />
              <rect x={x + 25} y={195} width={30 + index * 42} height={16} rx="6" fill={entry.color} opacity={active ? 0.95 : 0.4} />
              <SvgText x={x + 102} y={240} color="#cbd5e1" size={8}>Block # + DATA + ACK</SvgText>
            </g>
          )
        })}
        <Badge x={210} y={330} text="Last block detection and retransmission on timeout" color="#a78bfa" active w={500} />
      </svg>
    </ChoiceShell>
  )
}

const ftpArchStages = [
  'FTP — File Transfer Protocol — يستخدم Client وServer لنقل الملفات.',
  'Control Connection تُفتح من العميل إلى Server على **TCP Port 21** وتحمل الأوامر والردود.',
  'Data Connection منفصلة وتحمل محتوى الملف أو قائمة الدليل.',
  'FTP يدعم Authentication وDirectory Navigation وFile Listing.',
  'Upload وDownload يتمان عبر أوامر مثل put وget حسب الـ FTP Client.',
]

export function FtpArchitectureDiagram() {
  const playback = useStepPlayback(ftpArchStages.length)
  const s = playback.stage
  return (
    <StepShell title="FTP ARCHITECTURE" playback={playback} legend={ftpArchStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="FTP client server architecture with control and data connections">
        <Box x={60} y={150} w={230} h={100} title="FTP Client" sub="User commands" color="#38bdf8" active />
        <Box x={640} y={150} w={230} h={100} title="FTP Server" sub="Files + directories" color="#34d399" active />
        <LinkLine x1={290} y1={180} x2={640} y2={180} color="#a78bfa" active={s >= 1} />
        <LinkLine x1={290} y1={225} x2={640} y2={225} color="#f59e0b" active={s >= 2} />
        {s >= 1 && <FlowDot x1={290} y1={180} x2={640} y2={180} color="#a78bfa" active />}
        {s >= 2 && <FlowDot x1={290} y1={225} x2={640} y2={225} color="#f59e0b" active />}
        {s >= 1 && <Badge x={280} y={75} text="Control: TCP 21" color="#a78bfa" active w={330} />}
        {s >= 2 && <Badge x={280} y={300} text="Data: mode-dependent connection" color="#f59e0b" active w={390} />}
      </svg>
    </StepShell>
  )
}

const ftpConnections: RoleItem[] = [
  { id: 'control', label: 'Control connection', detail: 'اتصال TCP من العميل إلى Server على Port 21؛ يبقى مفتوحاً لحمل أوامر مثل USER وPASS وPASV وQUIT وردود الخادم.', color: '#a78bfa' },
  { id: 'data', label: 'Data connection', detail: 'اتصال منفصل يحمل FILE أو directory listing. في Active FTP يبدأه الخادم من TCP 20؛ في Passive FTP يبدأه العميل إلى منفذ ديناميكي يعلنه الخادم.', color: '#f59e0b' },
]

export function FtpControlVsDataDiagram() {
  const [selected, setSelected] = useState('control')
  const item = ftpConnections.find((entry) => entry.id === selected) ?? ftpConnections[0]
  const controls = <ChoiceButtons items={ftpConnections.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="FTP CONTROL vs DATA CONNECTION" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="FTP control connection compared with data connection">
        <Box x={60} y={100} w={370} h={150} title="CONTROL CONNECTION" sub="TCP 21 · commands and replies" color="#a78bfa" active={selected === 'control'} />
        <Box x={490} y={100} w={370} h={150} title="DATA CONNECTION" sub="Mode-dependent · file contents" color="#f59e0b" active={selected === 'data'} />
        <Box x={60} y={300} w={370} h={65} title={selected === 'control' ? 'Stays open' : 'Separate session'} sub={selected === 'control' ? 'Used for the FTP command channel' : 'Opened when data is transferred'} color="#38bdf8" active />
        <Box x={490} y={300} w={370} h={65} title={selected === 'data' ? 'Active or Passive' : 'Not the file channel'} sub={selected === 'data' ? 'Direction depends on FTP mode' : 'Do not confuse with TCP 21'} color="#34d399" active />
      </svg>
    </ChoiceShell>
  )
}

const activeStages = [
  'العميل يفتح Control Connection إلى الخادم على TCP Port 21.',
  'العميل يرسل أمر PORT يخبر الخادم بعنوان ومنفذ استماع البيانات عند العميل.',
  'الخادم يبدأ Data Connection من **TCP Port 20** إلى منفذ العميل.',
  'بيانات الملف أو قائمة الدليل تنتقل عبر Data Connection.',
  'Active FTP قد يحتاج قواعد firewall إضافية لأن الخادم يبدأ اتصال البيانات.',
]

export function ActiveFtpDiagram() {
  const playback = useStepPlayback(activeStages.length)
  const s = playback.stage
  return (
    <StepShell title="ACTIVE FTP" playback={playback} legend={activeStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Active FTP control and data connection flow">
        <Box x={60} y={150} w={230} h={100} title="FTP Client" sub="Client data port" color="#38bdf8" active />
        <Box x={640} y={150} w={230} h={100} title="FTP Server" sub="Control + data" color="#34d399" active />
        <LinkLine x1={290} y1={180} x2={640} y2={180} color="#a78bfa" active={s >= 0} />
        {s >= 0 && <FlowDot x1={290} y1={180} x2={640} y2={180} color="#a78bfa" active />}
        {s >= 2 && <FlowDot x1={640} y1={225} x2={290} y2={225} color="#f59e0b" active />}
        {s >= 0 && <Badge x={280} y={75} text="Control → server TCP 21" color="#a78bfa" active w={340} />}
        {s >= 2 && <Badge x={255} y={300} text="Data ← server source TCP 20" color="#f59e0b" active w={420} />}
        {s >= 4 && <Badge x={260} y={360} text="Server-initiated data connection can complicate firewalls" color="#fb7185" active w={470} />}
      </svg>
    </StepShell>
  )
}

const passiveStages = [
  'العميل يفتح Control Connection إلى الخادم على TCP Port 21.',
  'العميل يطلب Passive Mode باستخدام أمر PASV.',
  'الخادم يرد بعنوان IP ومنفذ data **ديناميكي**.',
  'العميل يبدأ Data Connection إلى المنفذ الديناميكي الذي أعلنه الخادم.',
  'Passive FTP أسهل غالباً مع Firewalls وNAT لأن العميل هو من يبدأ الاتصالين.',
]

export function PassiveFtpDiagram() {
  const playback = useStepPlayback(passiveStages.length)
  const s = playback.stage
  return (
    <StepShell title="PASSIVE FTP" playback={playback} legend={passiveStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Passive FTP control and dynamic data port flow">
        <Box x={60} y={150} w={230} h={100} title="FTP Client" sub="Initiates both" color="#38bdf8" active />
        <Box x={640} y={150} w={230} h={100} title="FTP Server" sub="Dynamic data port" color="#34d399" active />
        <LinkLine x1={290} y1={180} x2={640} y2={180} color="#a78bfa" active={s >= 0} />
        {s >= 0 && <FlowDot x1={290} y1={180} x2={640} y2={180} color="#a78bfa" active />}
        {s >= 3 && <FlowDot x1={290} y1={225} x2={640} y2={225} color="#f59e0b" active />}
        {s >= 2 && <Badge x={260} y={300} text="Data → server dynamic port from PASV reply" color="#f59e0b" active w={470} />}
        {s >= 4 && <Badge x={260} y={360} text="Client-initiated data connection is firewall/NAT friendlier" color="#34d399" active w={500} />}
      </svg>
    </StepShell>
  )
}

const protocolItems: RoleItem[] = [
  { id: 'ftp', label: 'FTP', detail: 'TCP 21 control، واتصال data يعتمد على Active أو Passive. لا يوفر تشفيراً مدمجاً للـ credentials أو البيانات في FTP التقليدي.', color: '#f59e0b' },
  { id: 'ftps', label: 'FTPS', detail: 'FTP مع TLS. Explicit FTPS يبدأ عادةً على TCP 21 ثم يرقّي الاتصال؛ Implicit FTPS يستخدم عادةً TCP 990. Data Connections تعتمد على mode وإعداد الخادم.', color: '#a78bfa' },
  { id: 'sftp', label: 'SFTP', detail: 'بروتوكول مختلف يعمل فوق SSH على TCP 22؛ ليس FTP يعمل على Port 22. يعتمد على SSH للتشفير والمصادقة.', color: '#34d399' },
  { id: 'tftp', label: 'TFTP', detail: 'UDP Port 69 لبدء الطلب فقط، ثم UDP TIDs ديناميكية للبيانات والـ ACKs. خفيف، بدون مصادقة أو تشفير مدمجين.', color: '#38bdf8' },
]

export function ProtocolComparisonDiagram() {
  const [selected, setSelected] = useState('ftp')
  const item = protocolItems.find((entry) => entry.id === selected) ?? protocolItems[0]
  const controls = <ChoiceButtons items={protocolItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="FTP / FTPS / SFTP / TFTP" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Interactive comparison of FTP FTPS SFTP and TFTP">
        {protocolItems.map((entry, index) => {
          const x = 40 + index * 225
          const active = entry.id === selected
          return (
            <g key={entry.id} opacity={active ? 1 : 0.45}>
              <rect x={x} y={110} width={205} height={170} rx="10" fill="#0b1224" stroke={active ? '#f59e0b' : '#334155'} strokeWidth={active ? 2.4 : 1.2} />
              <SvgText x={x + 102} y={175} color={active ? '#fbbf24' : '#94a3b8'} size={15} bold>{entry.label}</SvgText>
              <SvgText x={x + 102} y={215} color="#cbd5e1" size={8}>{entry.id === 'ftp' ? 'TCP 21 / mode data' : entry.id === 'ftps' ? 'TLS secured' : entry.id === 'sftp' ? 'SSH · TCP 22' : 'UDP 69 initial'}</SvgText>
            </g>
          )
        })}
        <Badge x={200} y={345} text="SFTP ≠ FTP over port 22 · TFTP port 69 starts the request only" color="#f59e0b" active w={520} />
      </svg>
    </ChoiceShell>
  )
}

const directions: RoleItem[] = [
  { id: 'download', label: 'Download', detail: 'نقل ملف من Remote Server إلى Local Device؛ مثال: `copy tftp: running-config` أو الأمر `get backup.cfg`.', color: '#34d399' },
  { id: 'upload', label: 'Upload', detail: 'نقل ملف من Local Device إلى Remote Server؛ مثال: `copy running-config tftp:` أو الأمر `put backup.cfg`.', color: '#f59e0b' },
]

export function UploadVsDownloadDiagram() {
  const [selected, setSelected] = useState('download')
  const item = directions.find((entry) => entry.id === selected) ?? directions[0]
  const controls = <ChoiceButtons items={directions.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="UPLOAD vs DOWNLOAD" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Upload versus download direction selector">
        <Box x={60} y={160} w={280} h={100} title="LOCAL DEVICE" sub="Router / Switch / PC" color="#38bdf8" active />
        <Box x={580} y={160} w={280} h={100} title="REMOTE SERVER" sub="TFTP / FTP repository" color="#34d399" active />
        <LinkLine x1={340} y1={210} x2={580} y2={210} color="#475569" active />
        {selected === 'download' && <FlowDot x1={580} y1={210} x2={340} y2={210} color="#34d399" active />}
        {selected === 'upload' && <FlowDot x1={340} y1={210} x2={580} y2={210} color="#f59e0b" active />}
        <Badge x={260} y={320} text={selected === 'download' ? 'Remote Server → Local Device' : 'Local Device → Remote Server'} color={item.color} active w={430} />
      </svg>
    </ChoiceShell>
  )
}

const explorerProtocols: RoleItem[] = [
  { id: 'tftp', label: 'TFTP', detail: 'UDP 69 initial request · RRQ/WRQ · DATA/ACK · dynamic TIDs', color: '#38bdf8' },
  { id: 'ftp', label: 'FTP', detail: 'TCP 21 control · Active data from TCP 20 or Passive dynamic port · login required', color: '#a78bfa' },
]

export function FileTransferExplorerDiagram() {
  const [protocol, setProtocol] = useState('tftp')
  const [direction, setDirection] = useState('download')
  const p = explorerProtocols.find((entry) => entry.id === protocol) ?? explorerProtocols[0]
  const source = direction === 'download' ? 'Remote Server' : 'Local Device'
  const destination = direction === 'download' ? 'Local Device' : 'Remote Server'
  const steps = protocol === 'tftp'
    ? (direction === 'download' ? 'RRQ → DATA blocks → ACKs' : 'WRQ → ACK request → DATA blocks → ACKs')
    : (direction === 'download' ? 'Login → dir/get → data connection → bye' : 'Login → put → data connection → bye')
  const controls = (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <ChoiceButtons items={explorerProtocols.map((entry) => ({ id: entry.id, label: entry.label }))} selected={protocol} onSelect={setProtocol} />
      <ChoiceButtons items={[{ id: 'download', label: 'Download' }, { id: 'upload', label: 'Upload' }]} selected={direction} onSelect={setDirection} />
    </div>
  )
  return (
    <ChoiceShell title="FILE TRANSFER EXPLORER" controls={controls} legend={`**${p.label} · ${direction}** — Source: **${source}** → Destination: **${destination}**. Steps: ${steps}. Expected result: the selected file exists at the destination and its size/integrity is checked.`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Interactive file transfer explorer for protocol direction source destination and steps">
        <Box x={50} y={90} w={250} h={100} title="PROTOCOL" sub={p.label} color={p.color} active />
        <Box x={340} y={90} w={250} h={100} title="SOURCE" sub={source} color="#38bdf8" active />
        <Box x={630} y={90} w={240} h={100} title="DESTINATION" sub={destination} color="#34d399" active />
        <LinkLine x1={300} y1={140} x2={340} y2={140} color="#475569" active />
        <LinkLine x1={590} y1={140} x2={630} y2={140} color="#475569" active />
        <FlowDot x1={300} y1={140} x2={630} y2={140} color={p.color} active />
        <Badge x={180} y={250} text={`STEPS: ${steps}`} color="#f59e0b" active w={560} />
        <Badge x={260} y={325} text="Expected result: file transferred + verified" color="#34d399" active w={440} />
      </svg>
    </ChoiceShell>
  )
}

const configTypes: RoleItem[] = [
  { id: 'running', label: 'Running', detail: 'Running Configuration موجودة في **RAM** وتعكس الإعدادات الحالية الفعّالة. تتغير فور تنفيذ أوامر configuration وتُفقد عند إعادة التشغيل إن لم تُحفظ.', color: '#f59e0b' },
  { id: 'startup', label: 'Startup', detail: 'Startup Configuration محفوظة في **NVRAM** وتُحمّل عند بدء التشغيل. الأمر `copy running-config startup-config` ينسخ الحالية إليها.', color: '#34d399' },
]

export function RunningVsStartupConfigDiagram() {
  const [selected, setSelected] = useState('running')
  const item = configTypes.find((entry) => entry.id === selected) ?? configTypes[0]
  const controls = <ChoiceButtons items={configTypes.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="RUNNING vs STARTUP CONFIGURATION" controls={controls} legend={`**${item.label} Configuration** — ${item.detail}`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Running configuration compared with startup configuration">
        <Box x={60} y={110} w={360} h={150} title="RUNNING-CONFIG" sub="RAM · active configuration" color="#f59e0b" active={selected === 'running'} />
        <Box x={500} y={110} w={360} h={150} title="STARTUP-CONFIG" sub="NVRAM · loaded at boot" color="#34d399" active={selected === 'startup'} />
        <LinkLine x1={420} y1={185} x2={500} y2={185} color="#a78bfa" active />
        <FlowDot x1={420} y1={185} x2={500} y2={185} color="#a78bfa" active />
        <Badge x={230} y={320} text="copy running-config startup-config" color="#a78bfa" active w={460} />
        <Badge x={270} y={365} text="Local save is not a remote backup" color="#fb7185" active w={390} />
      </svg>
    </ChoiceShell>
  )
}

const backupStages = [
  'اختر المصدر: `running-config` أو `startup-config`.',
  '`copy running-config tftp:` أو `copy startup-config tftp:` يبدأ النقل إلى Remote Server.',
  'الأوامر التفاعلية تطلب Remote Host Address ثم Destination Filename ثم تأكيدًا.',
  'الملف يُخزَّن على TFTP/FTP Server كـ Remote Backup.',
  'تحقق من وجود الملف واسمه وحجمه، واحتفظ بعدة نسخ مؤرخة.',
]

export function ConfigBackupFlowDiagram() {
  const playback = useStepPlayback(backupStages.length)
  const s = playback.stage
  return (
    <StepShell title="CONFIGURATION BACKUP FLOW" playback={playback} legend={backupStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Cisco configuration backup flow to TFTP or FTP server">
        <Box x={50} y={150} w={230} h={100} title="Source config" sub="running or startup" color="#f59e0b" active={s <= 1} />
        <Box x={350} y={150} w={210} h={100} title="copy ... tftp:" sub="Prompts: host + filename" color="#a78bfa" active={s >= 1} />
        <Box x={640} y={150} w={230} h={100} title="Remote backup" sub="TFTP / FTP storage" color="#34d399" active={s >= 3} />
        <LinkLine x1={280} y1={200} x2={350} y2={200} color="#f59e0b" active />
        <LinkLine x1={560} y1={200} x2={640} y2={200} color="#34d399" active={s >= 3} />
        <FlowDot x1={280} y1={200} x2={640} y2={200} color="#f59e0b" active={s >= 2} />
        {s >= 4 && <Badge x={240} y={320} text="Verify file · keep multiple dated versions" color="#34d399" active w={480} />}
      </svg>
    </StepShell>
  )
}

const restoreStages = [
  'اختر وجهة الاستعادة: `running-config` أو `startup-config`.',
  '`copy tftp: running-config` يؤثر على Running Configuration الحالية وقد يدمج الإعدادات حسب المنصة.',
  '`copy tftp: startup-config` يستبدل Startup Configuration بالملف المنقول.',
  'تحقق من اسم الملف ومصدره قبل التأكيد؛ الاستعادة الخاطئة قد تقطع الوصول.',
  'بعد النقل راجع `show running-config` أو `show startup-config` وتأكد من النتيجة.',
]

export function ConfigRestoreFlowDiagram() {
  const playback = useStepPlayback(restoreStages.length)
  const s = playback.stage
  return (
    <StepShell title="CONFIGURATION RESTORE FLOW" playback={playback} legend={restoreStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Cisco configuration restore flow from TFTP or FTP server">
        <Box x={60} y={150} w={230} h={100} title="Remote backup" sub="TFTP / FTP file" color="#34d399" active />
        <Box x={350} y={150} w={210} h={100} title="copy tftp:" sub="Download operation" color="#a78bfa" active={s >= 1} />
        <Box x={630} y={150} w={230} h={100} title={s >= 2 ? 'startup-config' : 'running-config'} sub={s >= 2 ? 'Replaced on NVRAM' : 'Merged / applied'} color={s >= 2 ? '#fb7185' : '#f59e0b'} active={s >= 1} />
        <LinkLine x1={290} y1={200} x2={350} y2={200} color="#34d399" active />
        <LinkLine x1={560} y1={200} x2={630} y2={200} color="#f59e0b" active={s >= 1} />
        <FlowDot x1={290} y1={200} x2={630} y2={200} color="#f59e0b" active={s >= 2} />
        {s >= 3 && <Badge x={230} y={320} text="Confirm source + filename before overwrite" color="#fb7185" active w={500} />}
      </svg>
    </StepShell>
  )
}

const tftpConfigCommands: RoleItem[] = [
  { id: 'brt', label: 'copy running-config tftp:', detail: 'ينسخ Running Configuration الحالية إلى ملف على TFTP Server. لا يغيّر Startup Configuration على الجهاز.', color: '#f59e0b' },
  { id: 'bst', label: 'copy startup-config tftp:', detail: 'ينسخ Startup Configuration المحفوظة في NVRAM إلى TFTP Server. مفيد لأخذ نسخة من الإعداد الذي سيُحمّل عند الإقلاع.', color: '#34d399' },
  { id: 'tr', label: 'copy tftp: running-config', detail: 'يسترجع ملفاً من TFTP إلى Running Configuration. قد يدمج الإعدادات مع الحالية حسب platform؛ راجع النتيجة دائماً.', color: '#38bdf8' },
  { id: 'ts', label: 'copy tftp: startup-config', detail: 'يستبدل Startup Configuration بالملف المنقول. عملية عالية الخطورة؛ تحقق من الملف قبل التنفيذ.', color: '#fb7185' },
]

export function TftpConfigTransferDiagram() {
  const [selected, setSelected] = useState('brt')
  const item = tftpConfigCommands.find((entry) => entry.id === selected) ?? tftpConfigCommands[0]
  const controls = <ChoiceButtons items={tftpConfigCommands.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="TFTP CONFIGURATION TRANSFER" controls={controls} legend={`**\`${item.label}\`** — ${item.detail}`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Interactive TFTP configuration copy command selector">
        <Box x={60} y={110} w={330} h={150} title="SELECTED COMMAND" sub={item.label} color={item.color} active />
        <Box x={500} y={110} w={360} h={150} title="EFFECT" sub={selected === 'ts' ? 'Overwrites startup config' : selected === 'tr' ? 'Applies / merges into running' : 'Creates remote backup'} color={item.color} active />
        <FlowDot x1={390} y1={185} x2={500} y2={185} color={item.color} active />
        <Badge x={190} y={330} text="Always confirm source, destination and filename" color="#f59e0b" active w={540} />
      </svg>
    </ChoiceShell>
  )
}

const imageStages = [
  'Cisco IOS Image هو ملف النظام الذي يشغّل جهاز Cisco؛ يختلف عن Configuration File.',
  'تُخزَّن صور IOS عادةً في Flash Memory على الجهاز.',
  'قبل أي نقل افحص `show version` و`show flash:` و`dir flash:` والمساحة المتاحة.',
  '`copy flash: tftp:` يعمل Backup لصورة موجودة؛ `copy tftp: flash:` ينقل صورة من الخادم إلى Flash.',
  'تحقق من سلامة الملف بـ checksum، ثم راجع توافق imagen مع الطراز والذاكرة والمساحة.',
  'Boot Configuration مثل `show boot` و`boot system` تعريفية فقط وتختلف حسب Platform.',
]

export function IosImageTransferDiagram() {
  const playback = useStepPlayback(imageStages.length)
  const s = playback.stage
  return (
    <StepShell title="CISCO IOS IMAGE TRANSFER" playback={playback} legend={imageStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Cisco IOS image transfer between TFTP server and router flash memory">
        <Box x={60} y={160} w={230} h={100} title="TFTP Server" sub="IOS image file" color="#34d399" active />
        <Box x={360} y={160} w={180} h={100} title="Network" sub="IP path" color="#a78bfa" active={s >= 1} />
        <Box x={630} y={160} w={230} h={100} title="Router" sub="Flash memory" color="#f59e0b" active={s >= 2} />
        <LinkLine x1={290} y1={210} x2={360} y2={210} color="#34d399" active />
        <LinkLine x1={540} y1={210} x2={630} y2={210} color="#f59e0b" active={s >= 3} />
        <FlowDot x1={290} y1={210} x2={630} y2={210} color={s >= 3 && s <= 4 ? '#f59e0b' : '#34d399'} active />
        {s >= 2 && <Badge x={220} y={80} text="Check: model · memory · flash space · compatibility" color="#a78bfa" active w={520} />}
        {s >= 4 && <Badge x={280} y={320} text="Verify checksum before changing boot variables" color="#34d399" active w={460} />}
        {s >= 5 && <Badge x={300} y={370} text="No real upgrade is performed in this lesson" color="#fb7185" active w={400} />}
      </svg>
    </StepShell>
  )
}

const verifyCommands: RoleItem[] = [
  { id: 'version', label: 'show version', detail: 'يعرض IOS Version وSystem Image Filename وUptime ومعلومات الذاكرة حسب المنصة.', color: '#38bdf8' },
  { id: 'flash', label: 'show flash:', detail: 'يعرض محتويات Flash والمساحة المستخدمة والمتاحة؛ الصيغة تختلف بين المنصات.', color: '#a78bfa' },
  { id: 'dir', label: 'dir flash:', detail: 'يعرض قائمة الملفات في Flash ويساعد في تأكيد اسم الملف ومساحة التخزين.', color: '#f59e0b' },
  { id: 'md5', label: 'verify /md5', detail: 'يحسب MD5 checksum للمقارنة مع القيمة المتوقعة؛ مفيد لاكتشاف أخطاء النقل، لكنه ليس حماية حديثة ضد التلاعب المتعمد.', color: '#34d399' },
  { id: 'sha', label: 'SHA-256 (where supported)', detail: 'استخدم خوارزمية أقوى مثل SHA-256 عند دعم المنصة وتوفر Checksum موثوق من مصدر رسمي.', color: '#fb7185' },
]

export function FlashStorageVerificationDiagram() {
  const [selected, setSelected] = useState('md5')
  const item = verifyCommands.find((entry) => entry.id === selected) ?? verifyCommands[0]
  const controls = <ChoiceButtons items={verifyCommands.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="FLASH STORAGE & IMAGE VERIFICATION" controls={controls} legend={`**\`${item.label}\`** — ${item.detail}`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Interactive flash storage and image integrity verification commands">
        <Box x={60} y={100} w={360} h={150} title="SELECTED CHECK" sub={item.label} color={item.color} active />
        <Box x={500} y={100} w={360} h={150} title="RESULT" sub={selected === 'md5' ? 'Compare expected vs calculated hash' : selected === 'sha' ? 'Stronger integrity check' : 'Inventory / space / version info'} color="#34d399" active />
        <FlowDot x1={420} y1={175} x2={500} y2={175} color={item.color} active />
        <Badge x={180} y={320} text="Expected hash from trusted source = calculated hash" color="#f59e0b" active w={560} />
        <Badge x={250} y={370} text="Checksum detects corruption · trust comes from source" color="#a78bfa" active w={450} />
      </svg>
    </ChoiceShell>
  )
}

interface TroubleItem {
  id: string
  label: string
  detail: string
}

const troubleItems: TroubleItem[] = [
  { id: 'ip', label: 'IP connectivity', detail: 'ابدأ بـ `ping` و`show ip interface brief` و`show ip route`؛ نجاح Ping وحده لا يضمن نجاح TFTP أو FTP.' },
  { id: 'server', label: 'Server availability', detail: 'تأكد أن TFTP/FTP Service يعمل وأن العنوان الصحيح مستخدم وأن الخادم يستقبل اتصالات من الجهاز.' },
  { id: 'protocol', label: 'Correct protocol', detail: 'لا تستخدم أوامر TFTP مع خادم FTP والعكس. اختر RRQ/WRQ أو login/get/put حسب البروتوكول.' },
  { id: 'port', label: 'Correct port', detail: 'TFTP يبدأ على UDP 69؛ FTP Control على TCP 21؛ Active Data من TCP 20؛ Passive Data منفذ ديناميكي؛ SFTP على TCP 22.' },
  { id: 'filename', label: 'Filename', detail: 'راجع اسم الملف ومساره وحالة الحروف على الخادم؛ خطأ بسيط في الاسم يسبب File Not Found.' },
  { id: 'permissions', label: 'Permissions', detail: 'تحقق من صلاحيات الكتابة/القراءة على TFTP root أو FTP user، ومن إعدادات المستخدم على الخادم.' },
  { id: 'storage', label: 'Storage', detail: 'تحقق من مساحة Flash أو Remote Storage بـ `show flash:` و`dir flash:` قبل IOS Image Transfer.' },
  { id: 'integrity', label: 'File integrity', detail: 'قارن Checksum المتوقع بالمحسوب؛ عدم التطابق يعني ملفاً تالفاً أو مصدراً غير موثوق.' },
]

export function FileTransferTroubleshootingDiagram() {
  const [selected, setSelected] = useState('ip')
  const item = troubleItems.find((entry) => entry.id === selected) ?? troubleItems[0]
  const controls = <ChoiceButtons items={troubleItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="FILE TRANSFER TROUBLESHOOTING TREE" controls={controls} legend={`**File Transfer Failed** → ${item.detail}`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Interactive file transfer troubleshooting decision tree">
        <Box x={340} y={20} w={240} h={60} title="Transfer Failed" sub="Start here" color="#f59e0b" active />
        <LinkLine x1={460} y1={80} x2={460} y2={118} color="#f59e0b" active />
        <LinkLine x1={110} y1={118} x2={810} y2={118} color="#475569" active />
        {troubleItems.map((entry, index) => {
          const x = 15 + (index % 4) * 225
          const y = 150 + Math.floor(index / 4) * 105
          const cx = x + 100
          return (
            <g key={entry.id}>
              <LinkLine x1={cx} y1={118} x2={cx} y2={y} color={selected === entry.id ? '#f59e0b' : '#475569'} active={selected === entry.id} />
              <ClickNode x={x} y={y} w={200} h={70} title={entry.label} sub="Check" color="#38bdf8" selected={selected === entry.id} onClick={() => setSelected(entry.id)} />
            </g>
          )
        })}
      </svg>
    </ChoiceShell>
  )
}

const lifecycleStages = [
  '1 — حدد ما يجب نسخه: configuration files أو IOS images أو logs.',
  '2 — أنشئ نسخة احتياطية قبل أي تغيير باستخدام TFTP أو FTP.',
  '3 — خزّن الملف في Remote Storage واسمّه بتاريخ واضح.',
  '4 — تحقق من وجود الملف وحجمه وChecksum عند الإمكان.',
  '5 — احتفظ بعدة نسخknown-good ووثّق الإصدارات والتواريخ.',
  '6 — عند الحاجة استعد الملف مع التأكد من الوجهة والتأثير قبل التنفيذ.',
]

export function CompleteBackupLifecycleDiagram() {
  const playback = useStepPlayback(lifecycleStages.length)
  const s = playback.stage
  const labels = ['Identify', 'Backup', 'Store', 'Verify', 'Document', 'Restore']
  return (
    <StepShell title="COMPLETE NETWORK DEVICE BACKUP LIFECYCLE" playback={playback} legend={lifecycleStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Complete network device configuration and image backup lifecycle">
        {labels.map((label, index) => (
          <g key={label}>
            <motion.g animate={{ opacity: s >= index ? 1 : 0.32 }} transition={{ duration: 0.3 }}>
              <rect x={25 + index * 150} y={175} width={130} height={72} rx="9" fill="#0b1224" stroke={s === index ? '#f59e0b' : s > index ? '#34d399' : '#475569'} strokeWidth={s === index ? 2.4 : 1.2} />
              <SvgText x={90 + index * 150} y={217} color={s === index ? '#fbbf24' : s > index ? '#6ee7b7' : '#cbd5e1'} size={8.4} bold>{label}</SvgText>
            </motion.g>
            {index < labels.length - 1 && <LinkLine x1={155 + index * 150} y1={211} x2={175 + index * 150} y2={211} color="#475569" active={s > index} />}
          </g>
        ))}
        {s >= 4 && <Badge x={180} y={330} text="Backup before change · verify before restore · document versions" color="#34d399" active w={560} />}
      </svg>
    </StepShell>
  )
}
