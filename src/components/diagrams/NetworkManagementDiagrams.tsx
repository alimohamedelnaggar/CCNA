import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { RichText } from '../ui/RichText'
import { LinkLine, Packet } from './ArchitectureDiagrams'
import { SvgText } from './FiberDiagrams'

interface StepPlayback { stage: number; playing: boolean; toggle: () => void; next: () => void; previous: () => void; reset: () => void }
function useStepPlayback(length: number): StepPlayback {
  const [stage, setStage] = useState(0)
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => setStage((c) => (c + 1) % length), 2300)
    return () => window.clearInterval(timer)
  }, [playing, length])
  return { stage, playing, toggle: () => setPlaying((v) => !v), next: () => setStage((c) => (c + 1) % length), previous: () => setStage((c) => (c - 1 + length) % length), reset: () => { setPlaying(false); setStage(0) } }
}
function StepControls({ playback }: { playback: StepPlayback }) {
  const base = 'flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[0.75rem] transition'
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={playback.toggle} className={`${base} border-accent-400/30 bg-accent-500/10 font-bold text-accent-300 hover:bg-accent-500/20`}>{playback.playing ? <Pause size={13} /> : <Play size={13} />}{playback.playing ? 'إيقاف' : 'شغّل'}</button>
      <button type="button" onClick={playback.previous} className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}><SkipBack size={13} /> السابق</button>
      <button type="button" onClick={playback.next} className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}><SkipForward size={13} /> التالي</button>
      <button type="button" onClick={playback.reset} className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}><RotateCcw size={13} /> إعادة</button>
    </div>
  )
}
function StepShell({ title, playback, legend, children }: { title: string; playback: StepPlayback; legend: string; children: ReactNode }) {
  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-sky-400/12 bg-navy-950/70">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-400/10 px-4 py-3"><span className="font-display text-[0.78rem] font-bold text-slate-300" dir="ltr">{title}</span><StepControls playback={playback} /></div>
      <div className="diagram-grid overflow-x-auto px-2 py-4" dir="ltr">{children}</div>
      <div className="border-t border-sky-400/10 bg-sky-400/[0.03] px-4 py-3 text-[0.85rem] leading-[1.9] text-slate-300" dir="rtl"><span className="ml-2 rounded bg-accent-500/15 px-1.5 py-0.5 font-display text-[0.7rem] font-bold text-accent-300" dir="ltr">{playback.stage + 1}</span><RichText>{legend}</RichText></div>
    </div>
  )
}
function Note({ x, y, text, color = '#94a3b8', size = 9 }: { x: number; y: number; text: string; color?: string; size?: number }) { return <SvgText x={x} y={y} color={color} size={size}>{text}</SvgText> }
function Device({ x, y, w, h, title, sub, color, active = false }: { x: number; y: number; w: number; h: number; title: string; sub: string; color: string; active?: boolean }) {
  return <g opacity={active ? 1 : 0.45}><rect x={x} y={y} width={w} height={h} rx="11" fill="#0b1224" stroke={color} strokeWidth={active ? 2.3 : 1.2} /><SvgText x={x + w / 2} y={y + 24} color={color} size={10.5} bold>{title}</SvgText><SvgText x={x + w / 2} y={y + 43} color="#cbd5e1" size={8.8}>{sub}</SvgText></g>
}
function Badge({ x, y, text, color = '#38bdf8', active = true, w = 140 }: { x: number; y: number; text: string; color?: string; active?: boolean; w?: number }) {
  return <g opacity={active ? 1 : 0.4}><rect x={x} y={y} width={w} height={25} rx="7" fill="#0a1730" stroke={color} strokeWidth={active ? 1.9 : 1} /><SvgText x={x + w / 2} y={y + 17} color={color} size={8.5} bold>{text}</SvgText></g>
}
function Panel({ x, y, w, h, title, lines, color = '#38bdf8', active = true, size = 8.7 }: { x: number; y: number; w: number; h: number; title: string; lines: string[]; color?: string; active?: boolean; size?: number }) {
  return <g opacity={active ? 1 : 0.5}><rect x={x} y={y} width={w} height={h} rx="11" fill="#0b1224" stroke={color} strokeWidth={active ? 1.9 : 1} /><SvgText x={x + 14} y={y + 19} color={color} size={9.3} bold anchor="start">{title}</SvgText>{lines.map((line, i) => <SvgText key={i} x={x + 14} y={y + 36 + i * 14} color="#cbd5e1" size={size} anchor="start">{line}</SvgText>)}</g>
}
function LockIcon({ x, y, color = '#34d399', open = false }: { x: number; y: number; color?: string; open?: boolean }) {
  return <g stroke={color} strokeWidth="2" fill="none"><rect x={x - 8} y={y - 2} width="16" height="13" rx="2" fill="#0b1224" /><path d={open ? `M ${x - 5} ${y - 2} v -5 a 5 5 0 0 1 10 0` : `M ${x - 5} ${y - 2} v -5 a 5 5 0 0 1 10 0 v 5`} /></g>
}

const overviewStages = [
  'المسؤول يحتاج وصولاً للجهاز لتهيئته ومراقبته واستكشاف الأخطاء.',
  'Management plane يتحكم بالجهاز؛ data plane يمرر حركة المستخدمين.',
  'الإدارة قد تكون محلية عبر Console أو عن بُعد عبر SSH/HTTPS.',
  'يمكن إدارة Switch أو Router أو WLC من محطة مسؤول.',
  'حركة الإدارة لا يجب الخلط بينها وبين حركة المستخدم الممرّرة.',
]
export function NetworkDeviceManagementOverviewDiagram() {
  const p = useStepPlayback(overviewStages.length); const s = p.stage
  return <StepShell title="NETWORK DEVICE MANAGEMENT OVERVIEW" playback={p} legend={overviewStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Network device management overview showing admin workstation managing switch router and WLC through management plane separate from user data plane">
    <Note x={460} y={24} text="MANAGING THE DEVICE IS DIFFERENT FROM FORWARDING USER TRAFFIC" color="#94a3b8" size={8.5} />
    <Device x={40} y={130} w={170} h={110} title="ADMIN PC" sub="workstation" color="#38bdf8" active={s >= 0} />
    <Device x={360} y={70} w={150} h={90} title="SWITCH" sub="managed device" color="#34d399" active={s >= 1} />
    <Device x={360} y={190} w={150} h={90} title="ROUTER" sub="managed device" color="#34d399" active={s >= 1} />
    <Device x={360} y={310} w={150} h={90} title="WLC" sub="managed device" color="#34d399" active={s >= 3} />
    <Device x={700} y={150} w={170} h={110} title="USERS" sub="data traffic" color="#94a3b8" active={s >= 4} />
    <LinkLine x1={210} y1={170} x2={360} y2={115} color="#38bdf8" active={s >= 2} />
    <LinkLine x1={210} y1={185} x2={360} y2={235} color="#38bdf8" active={s >= 2} />
    <LinkLine x1={210} y1={205} x2={360} y2={350} color="#38bdf8" active={s >= 3} />
    <LinkLine x1={510} y1={165} x2={700} y2={200} color="#94a3b8" active={s >= 4} />
    {s >= 2 && <Packet point={{ x: 285, y: 150 }} color="#38bdf8" label="MGMT" />}
    {s >= 4 && <Packet point={{ x: 610, y: 185 }} color="#94a3b8" label="DATA" />}
    <Badge x={560} y={90} text="MANAGEMENT PLANE" color="#38bdf8" active={s >= 1} w={190} />
    <Badge x={560} y={255} text="DATA PLANE" color="#94a3b8" active={s >= 4} w={190} />
  </svg></StepShell>
}

const inBandStages = [
  'In-band management يستخدم شبكة الإنتاج نفسها.',
  'حركة الإدارة تمر عبر نفس interfaces وVLANs وrouting.',
  'يتطلب IP connectivity عاملة على مسار الإنتاج.',
  'مناسب للإدارة اليومية عن بُعد.',
  'إذا فشلت شبكة الإنتاج، قد تفقد الوصول الإداري.',
]
export function InBandManagementPathDiagram() {
  const p = useStepPlayback(inBandStages.length); const s = p.stage
  return <StepShell title="IN-BAND MANAGEMENT PATH" playback={p} legend={inBandStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="In-band management path using the production network for SSH or HTTPS management traffic">
    <Note x={460} y={24} text="MANAGEMENT TRAFFIC RIDES ON THE PRODUCTION NETWORK" color="#94a3b8" size={8.6} />
    <Device x={40} y={150} w={160} h={100} title="ADMIN PC" sub="10.10.10.50" color="#38bdf8" active />
    <Device x={300} y={150} w={160} h={100} title="PROD SWITCH" sub="VLAN 10/99" color="#a78bfa" active={s >= 1} />
    <Device x={560} y={150} w={160} h={100} title="ROUTER" sub="production path" color="#34d399" active={s >= 2} />
    <Device x={760} y={150} w={120} h={100} title="SW1" sub="mgmt SVI" color="#f59e0b" active={s >= 0} />
    <LinkLine x1={200} y1={200} x2={300} y2={200} color="#38bdf8" active={s >= 1} />
    <LinkLine x1={460} y1={200} x2={560} y2={200} color="#38bdf8" active={s >= 2} />
    <LinkLine x1={720} y1={200} x2={760} y2={200} color="#38bdf8" active={s >= 2} />
    {s >= 1 && <Packet point={{ x: 250, y: 195 }} color="#38bdf8" label="SSH" />}
    {s >= 3 && <Packet point={{ x: 510, y: 195 }} color="#38bdf8" label="MGMT" />}
    <Badge x={330} y={285} text="PRODUCTION NETWORK" color="#a78bfa" active={s >= 1} w={260} />
    {s >= 4 && <Badge x={330} y={325} text="NETWORK FAILURE = ACCESS RISK" color="#fb7185" active w={260} />}
  </svg></StepShell>
}

const outOfBandStages = [
  'Out-of-band management يستخدم مساراً منفصلاً عن إنتاج المستخدمين.',
  'قد يكون عبر منفذ إدارة مخصص أو console server أو شبكة management منفصلة.',
  'يبقى الوصول ممكناً أحياناً عند تعطل شبكة الإنتاج.',
  'مفيد للاسترداد والطوارئ والإعداد الأولي.',
  'ما زال يحتاج كهرباء وبنية تحتية فيزيائية عاملة للمسار المنفصل.',
]
export function OutOfBandManagementPathDiagram() {
  const p = useStepPlayback(outOfBandStages.length); const s = p.stage
  return <StepShell title="OUT-OF-BAND MANAGEMENT PATH" playback={p} legend={outOfBandStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Out-of-band management using a separate management network or console server independent from production traffic">
    <Note x={460} y={24} text="SEPARATE MANAGEMENT PATH, SEPARATE FAILURE DOMAIN" color="#94a3b8" size={8.6} />
    <Device x={40} y={80} w={160} h={95} title="ADMIN PC" sub="mgmt station" color="#38bdf8" active />
    <Device x={300} y={80} w={170} h={95} title="MGMT SWITCH" sub="dedicated path" color="#34d399" active={s >= 1} />
    <Device x={590} y={80} w={150} h={95} title="SW1 MGMT" sub="OOB interface" color="#f59e0b" active={s >= 2} />
    <Device x={300} y={250} w={170} h={95} title="PROD NETWORK" sub="user traffic" color="#94a3b8" active />
    <Device x={590} y={250} w={150} h={95} title="SW1 DATA" sub="production ports" color="#94a3b8" active />
    <LinkLine x1={200} y1={127} x2={300} y2={127} color="#34d399" active={s >= 1} />
    <LinkLine x1={470} y1={127} x2={590} y2={127} color="#34d399" active={s >= 1} />
    <LinkLine x1={470} y1={297} x2={590} y2={297} color="#94a3b8" active />
    {s >= 2 && <Packet point={{ x: 530, y: 122 }} color="#34d399" label="OOB" />}
    {s >= 3 && <Badge x={320} y={360} text="PROD DOWN, OOB MAY STILL WORK" color="#34d399" active w={300} />}
    {s >= 4 && <Badge x={320} y={390} text="STILL NEEDS POWER + PHYSICAL PATH" color="#fb7185" active w={300} />}
  </svg></StepShell>
}

const consoleStages = [
  'Console port يوفر وصولاً محلياً مباشراً للجهاز.',
  'يستخدم للإعداد الأولي والاسترداد عندما لا يوجد IP.',
  'الاتصال يكون بكابل console أو USB console حسب الجهاز.',
  'برنامج terminal emulator يفتح جلسة serial.',
  'الإعدادات الشائعة: 9600 8N1 بدون flow control.',
]
export function ConsoleConnectionDiagram() {
  const p = useStepPlayback(consoleStages.length); const s = p.stage
  return <StepShell title="CONSOLE CONNECTION" playback={p} legend={consoleStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Console cable connection from admin laptop terminal emulator to device console port with serial settings">
    <Note x={460} y={24} text="LOCAL, DIRECT ACCESS - NO IP REQUIRED" color="#94a3b8" size={9} />
    <Device x={60} y={140} w={210} h={120} title="ADMIN LAPTOP" sub="Terminal Emulator" color="#38bdf8" active />
    <Device x={650} y={140} w={210} h={120} title="CISCO SWITCH" sub="Console Port" color="#f59e0b" active />
    <LinkLine x1={270} y1={200} x2={650} y2={200} color="#34d399" active={s >= 2} />
    {s >= 2 && <Packet point={{ x: 460, y: 195 }} color="#34d399" label="CONSOLE" />}
    <Badge x={360} y={230} text="RJ-45 / USB CONSOLE" color="#34d399" active={s >= 2} w={200} />
    <Panel x={120} y={300} w={680} h={90} title="COMMON SERIAL SETTINGS" lines={["9600 baud  |  8 data bits  |  No parity  |  1 stop bit  |  No flow control", "Defaults are common on Cisco, but device/configuration can vary.", s >= 4 ? "Use console for initial setup, recovery, or when remote access is broken." : "Connect physically before opening the terminal session."]} color="#38bdf8" active={s >= 3} size={8.8} />
  </svg></StepShell>
}

const auxStages = [
  'AUX port هو منفذ إدارة تاريخي على بعض الأجهزة.',
  'كان يُستخدم أحياناً مع modem للوصول عن بُعد out-of-band.',
  'يختلف عن Console port في الغرض والاستخدام الشائع.',
  'العديد من الأجهزة الحديثة لا تحتوي AUX port.',
  'لا تفترض وجود AUX في كل منصة Cisco.',
]
export function AuxModemAccessDiagram() {
  const p = useStepPlayback(auxStages.length); const s = p.stage
  return <StepShell title="AUX MODEM-BASED ACCESS" playback={p} legend={auxStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Historical AUX port remote access through modem compared with local console access">
    <Note x={460} y={24} text="AUX IS PLATFORM-DEPENDENT AND OFTEN ABSENT ON MODERN DEVICES" color="#94a3b8" size={8.2} />
    <Device x={40} y={120} w={160} h={95} title="REMOTE ADMIN" sub="dial-in" color="#38bdf8" active={s >= 1} />
    <Device x={260} y={120} w={140} h={95} title="MODEM" sub="PSTN/analog" color="#a78bfa" active={s >= 1} />
    <Device x={500} y={90} w={180} h={150} title="ROUTER" sub="legacy platform" color="#f59e0b" active />
    <Badge x={530} y={150} text="AUX PORT" color="#f59e0b" active={s >= 0} w={120} />
    <Badge x={530} y={190} text="CONSOLE PORT" color="#34d399" active={s >= 2} w={120} />
    <Device x={740} y={200} w={140} h={90} title="LOCAL ADMIN" sub="direct cable" color="#34d399" active={s >= 2} />
    <LinkLine x1={200} y1={167} x2={260} y2={167} color="#38bdf8" active={s >= 1} />
    <LinkLine x1={400} y1={167} x2={530} y2={162} color="#38bdf8" active={s >= 1} />
    <LinkLine x1={650} y1={202} x2={740} y2={245} color="#34d399" active={s >= 2} />
    {s >= 4 && <Badge x={250} y={320} text="NOT A UNIVERSAL FEATURE" color="#fb7185" active w={420} />}
  </svg></StepShell>
}

const telnetStages = [
  'Telnet يوفر وصول CLI عن بُعد عبر الشبكة.',
  'يستخدم TCP port 23 وVTY lines.',
  'البيانات وبيانات الاعتماد تُرسل بدون تشفير.',
  'يمكن اعتراض الجلسة وقراءتها على شبكة غير موثوقة.',
  'استخدم SSH بدلاً منه للإدارة الآمنة.',
]
export function TelnetPlaintextCommunicationDiagram() {
  const p = useStepPlayback(telnetStages.length); const s = p.stage
  return <StepShell title="TELNET PLAINTEXT COMMUNICATION" playback={p} legend={telnetStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Telnet session over TCP port 23 showing plaintext credentials and commands visible to attacker">
    <Note x={460} y={24} text="PLAINTEXT - NO ENCRYPTION" color="#fb7185" size={9.5} />
    <Device x={40} y={150} w={170} h={100} title="ADMIN PC" sub="Telnet client" color="#38bdf8" active />
    <Device x={390} y={70} w={150} h={90} title="ATTACKER" sub="can sniff traffic" color="#fb7185" active={s >= 3} />
    <Device x={710} y={150} w={170} h={100} title="SWITCH" sub="VTY lines" color="#f59e0b" active />
    <LinkLine x1={210} y1={200} x2={710} y2={200} color="#fb7185" active />
    <LinkLine x1={465} y1={160} x2={465} y2={200} color="#fb7185" active={s >= 3} />
    {s >= 1 && <Packet point={{ x: 350, y: 195 }} color="#fb7185" label="TCP 23" />}
    {s >= 2 && <Badge x={320} y={240} text="username admin / password ..." color="#fb7185" active w={280} />}
    {s >= 3 && <Badge x={390} y={175} text="READABLE" color="#fb7185" active w={150} />}
    <Panel x={120} y={320} w={680} h={75} title="WHY TELNET IS INSECURE" lines={["Credentials and commands are transmitted without encryption.", "Use Telnet only in legacy/testing contexts; prefer SSH for remote administration."]} color="#fb7185" active={s >= 4} size={8.8} />
  </svg></StepShell>
}

const sshStages = [
  'SSH يوفر وصول CLI آمن عن بُعد.',
  'يستخدم TCP port 22 وجلسة مشفرة.',
  'بيانات الاعتماد والأوامر محمية داخل النفق المشفر.',
  'يوفر confidentiality وintegrity والتحقق من الهوية.',
  'SSH version 2 هو الخيار الموصى به.',
]
export function SshEncryptedCommunicationDiagram() {
  const p = useStepPlayback(sshStages.length); const s = p.stage
  return <StepShell title="SSH ENCRYPTED COMMUNICATION" playback={p} legend={sshStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="SSH encrypted management session over TCP port 22 protecting credentials and commands">
    <Note x={460} y={24} text="ENCRYPTED MANAGEMENT SESSION" color="#34d399" size={9.5} />
    <Device x={40} y={150} w={170} h={100} title="ADMIN PC" sub="SSH client" color="#38bdf8" active />
    <Device x={390} y={70} w={150} h={90} title="ATTACKER" sub="sniffer sees ciphertext" color="#94a3b8" active={s >= 3} />
    <Device x={710} y={150} w={170} h={100} title="SWITCH" sub="SSHv2 enabled" color="#f59e0b" active />
    <LinkLine x1={210} y1={200} x2={710} y2={200} color="#34d399" active />
    <LinkLine x1={465} y1={160} x2={465} y2={200} color="#94a3b8" active={s >= 3} />
    {s >= 1 && <Packet point={{ x: 350, y: 195 }} color="#34d399" label="TCP 22" />}
    {s >= 2 && <Badge x={330} y={240} text="encrypted session data" color="#34d399" active w={260} />}
    <LockIcon x={465} y={185} color="#34d399" />
    {s >= 3 && <Badge x={390} y={175} text="CIPHERTEXT" color="#94a3b8" active w={150} />}
    <Panel x={120} y={320} w={680} h={75} title="SSH BENEFITS" lines={["Confidentiality, integrity, and secure authentication for remote CLI.", "Use SSH version 2; exact key/cipher support depends on platform and IOS."]} color="#34d399" active={s >= 4} size={8.8} />
  </svg></StepShell>
}

const httpHttpsStages = [
  'HTTP يوفر إدارة عبر المتصفح لكنه غير مشفر.',
  'HTTP يستخدم TCP port 80.',
  'HTTPS يضيف TLS encryption ويستخدم TCP port 443.',
  'بيانات الاعتماد في HTTP يمكن اعتراضها؛ HTTPS يحمي الجلسة.',
  'HTTPS هو الخيار المفضل عندما تتوفر إدارة ويب.',
]
export function HttpVsHttpsManagementDiagram() {
  const p = useStepPlayback(httpHttpsStages.length); const s = p.stage
  const showHttps = s >= 2
  return <StepShell title="HTTP vs HTTPS" playback={p} legend={httpHttpsStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Comparison of HTTP plaintext web management on port 80 and HTTPS TLS protected web management on port 443">
    <Note x={460} y={24} text="WEB GUI: USE HTTPS, NOT HTTP" color="#94a3b8" size={9} />
    <g opacity={!showHttps ? 1 : 0.45}><rect x={45} y={80} width={390} height={250} rx="12" fill="#0b1224" stroke="#fb7185" strokeWidth="2" /><SvgText x={240} y={108} color="#fb7185" size={10} bold>HTTP</SvgText>
      <Device x={75} y={150} w={130} h={90} title="BROWSER" sub="admin" color="#38bdf8" active={!showHttps} />
      <Device x={285} y={150} w={130} h={90} title="DEVICE GUI" sub="port 80" color="#f59e0b" active={!showHttps} />
      <LinkLine x1={205} y1={195} x2={285} y2={195} color="#fb7185" active={!showHttps} />
      {!showHttps && <Packet point={{ x: 245, y: 190 }} color="#fb7185" label="PLAIN" />}
      <Note x={240} y={280} text="no encryption" color="#fb7185" size={9} />
    </g>
    <g opacity={showHttps ? 1 : 0.45}><rect x={485} y={80} width={390} height={250} rx="12" fill="#0b1224" stroke="#34d399" strokeWidth="2" /><SvgText x={680} y={108} color="#34d399" size={10} bold>HTTPS</SvgText>
      <Device x={515} y={150} w={130} h={90} title="BROWSER" sub="admin" color="#38bdf8" active={showHttps} />
      <Device x={725} y={150} w={130} h={90} title="DEVICE GUI" sub="port 443" color="#f59e0b" active={showHttps} />
      <LinkLine x1={645} y1={195} x2={725} y2={195} color="#34d399" active={showHttps} />
      {showHttps && <Packet point={{ x: 685, y: 190 }} color="#34d399" label="TLS" />}
      <LockIcon x={685} y={185} color="#34d399" />
      <Note x={680} y={280} text="TLS encrypted session" color="#34d399" size={9} />
    </g>
  </svg></StepShell>
}

const cliGuiStages = [
  'CLI توفر تحكماً دقيقاً عبر أوامر نصية.',
  'Web GUI توفر إدارة مرئية عبر المتصفح.',
  'CLI مناسبة للـ automation وtroubleshooting المتقدم.',
  'GUI مناسبة للمهام المرئية لكن قدراتها تختلف حسب المنصة.',
  'كلاهما يصل إلى جهاز الإدارة نفسه؛ الأمان يعتمد على البروتوكول.',
]
export function CliVsWebGuiManagementDiagram() {
  const p = useStepPlayback(cliGuiStages.length); const s = p.stage
  return <StepShell title="CLI vs WEB GUI MANAGEMENT" playback={p} legend={cliGuiStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Comparison between CLI management and web GUI management for the same network device">
    <Note x={460} y={24} text="SAME DEVICE, DIFFERENT MANAGEMENT INTERFACE" color="#94a3b8" size={8.8} />
    <Device x={60} y={110} w={220} h={120} title="CLI" sub="SSH / Console" color="#38bdf8" active={s <= 2} />
    <Device x={640} y={110} w={220} h={120} title="WEB GUI" sub="HTTPS browser" color="#a78bfa" active={s >= 1} />
    <Device x={360} y={260} w={200} h={110} title="NETWORK DEVICE" sub="switch / router / WLC" color="#f59e0b" active />
    <LinkLine x1={280} y1={190} x2={360} y2={290} color="#38bdf8" active={s <= 2} />
    <LinkLine x1={640} y1={190} x2={560} y2={290} color="#a78bfa" active={s >= 1} />
    <Badge x={75} y={250} text="PRECISE / SCRIPTABLE" color="#38bdf8" active={s === 2} w={190} />
    <Badge x={655} y={250} text="VISUAL / PLATFORM-DEPENDENT" color="#a78bfa" active={s === 3} w={190} />
    {s >= 4 && <Badge x={335} y={385} text="SECURE THE TRANSPORT: SSH/HTTPS" color="#34d399" active w={250} />}
  </svg></StepShell>
}

const aaaFlowStages = [
  'المسؤول يحاول تسجيل الدخول إلى الجهاز.',
  'Authentication يتحقق: من أنت؟',
  'Authorization يحدد: ماذا يُسمح لك أن تفعل؟',
  'Accounting يسجل: ماذا فعلت؟',
  'النتيجة قد تكون وصولاً محلياً أو مركزياً عبر AAA server.',
]
export function AaaAuthenticationFlowDiagram() {
  const p = useStepPlayback(aaaFlowStages.length); const s = p.stage
  return <StepShell title="AAA AUTHENTICATION FLOW" playback={p} legend={aaaFlowStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="AAA authentication flow from administrator through network device to AAA server and back">
    <Note x={460} y={24} text="WHO ARE YOU? WHAT CAN YOU DO? WHAT DID YOU DO?" color="#94a3b8" size={8.7} />
    <Device x={40} y={160} w={150} h={100} title="ADMIN" sub="login attempt" color="#38bdf8" active />
    <Device x={300} y={160} w={170} h={100} title="NETWORK DEVICE" sub="AAA client" color="#f59e0b" active={s >= 1} />
    <Device x={640} y={160} w={170} h={100} title="AAA SERVER" sub="TACACS+/RADIUS" color="#34d399" active={s >= 1} />
    <LinkLine x1={190} y1={210} x2={300} y2={210} color="#38bdf8" active />
    <LinkLine x1={470} y1={195} x2={640} y2={195} color="#a78bfa" active={s >= 1} />
    <LinkLine x1={640} y1={225} x2={470} y2={225} color="#34d399" active={s >= 2} />
    {s >= 1 && <Packet point={{ x: 555, y: 190 }} color="#a78bfa" label="AUTH?" />}
    {s >= 2 && <Packet point={{ x: 555, y: 230 }} color="#34d399" label="ALLOW" />}
    <Badge x={315} y={290} text="AUTHENTICATION" color="#38bdf8" active={s === 1} w={140} />
    <Badge x={470} y={290} text="AUTHORIZATION" color="#a78bfa" active={s === 2} w={140} />
    <Badge x={625} y={290} text="ACCOUNTING" color="#34d399" active={s === 3} w={140} />
  </svg></StepShell>
}

const aaaCompareStages = [
  'Authentication يتحقق من الهوية.',
  'Authorization يحدد الصلاحيات والأوامر المسموحة.',
  'Accounting يسجل الجلسات والأحداث للمراجعة.',
  'الثلاث مراحل مختلفة لكنها قد تعمل معاً.',
  'الخادم المركزي قد يطبقها جميعاً أو جزئياً حسب البروتوكول والتصميم.',
]
export function AaaAuthnAuthzAcctDiagram() {
  const p = useStepPlayback(aaaCompareStages.length); const s = p.stage
  return <StepShell title="AUTHENTICATION vs AUTHORIZATION vs ACCOUNTING" playback={p} legend={aaaCompareStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Three AAA components authentication authorization and accounting with distinct roles">
    <Note x={460} y={24} text="THREE DISTINCT AAA FUNCTIONS" color="#94a3b8" size={9} />
    <Panel x={60} y={90} w={240} h={230} title="AUTHENTICATION" lines={["Who are you?", "Username/password", "Certificates/tokens (platform)", "Identity verified before access"]} color="#38bdf8" active={s === 0 || s >= 3} />
    <Panel x={340} y={90} w={240} h={230} title="AUTHORIZATION" lines={["What can you do?", "Privilege/commands", "Allowed resources", "Policy enforcement"]} color="#a78bfa" active={s === 1 || s >= 3} />
    <Panel x={620} y={90} w={240} h={230} title="ACCOUNTING" lines={["What did you do?", "Session start/stop", "Command logging", "Audit trail"]} color="#34d399" active={s === 2 || s >= 3} />
    {s >= 4 && <Badge x={310} y={350} text="CAN BE LOCAL OR CENTRALIZED" color="#f59e0b" active w={300} />}
  </svg></StepShell>
}

const tacacsStages = [
  'TACACS+ هو بروتوكول AAA شائع لإدارة أجهزة الشبكة.',
  'يستخدم TCP port 49.',
  'يفصل Authentication وAuthorization وAccounting.',
  'يدعم command authorization بشكل دقيق.',
  'يشفر جسم الحزمة؛ الرأس يبقى مرئياً.',
]
export function TacacsPlusArchitectureDiagram() {
  const p = useStepPlayback(tacacsStages.length); const s = p.stage
  return <StepShell title="TACACS+ ARCHITECTURE" playback={p} legend={tacacsStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="TACACS plus centralized device administration architecture using TCP port 49 with separated AAA">
    <Note x={460} y={24} text="TACACS+ - DEVICE ADMINISTRATION, TCP 49" color="#94a3b8" size={8.8} />
    <Device x={45} y={150} w={150} h={100} title="ADMIN" sub="CLI/SSH" color="#38bdf8" active />
    <Device x={280} y={150} w={170} h={100} title="SWITCH/ROUTER" sub="TACACS+ client" color="#f59e0b" active />
    <Device x={620} y={130} w={240} h={140} title="TACACS+ SERVER" sub="central AAA policy" color="#34d399" active={s >= 1} />
    <LinkLine x1={195} y1={200} x2={280} y2={200} color="#38bdf8" active />
    <LinkLine x1={450} y1={200} x2={620} y2={200} color="#34d399" active={s >= 1} />
    {s >= 1 && <Packet point={{ x: 535, y: 195 }} color="#34d399" label="TCP 49" />}
    <Badge x={640} y={290} text="SEPARATE AAA" color="#34d399" active={s >= 2} w={200} />
    <Badge x={640} y={325} text="COMMAND AUTHORIZATION" color="#a78bfa" active={s >= 3} w={200} />
    {s >= 4 && <Badge x={280} y={290} text="ENCRYPTED BODY / VISIBLE HEADER" color="#f59e0b" active w={290} />}
  </svg></StepShell>
}

const radiusStages = [
  'RADIUS هو معيار AAA شائع للوصول للشبكة.',
  'يستخدم UDP ports 1812 و1813.',
  'Authentication وAuthorization مرتبطان أكثر تقليدياً.',
  'يحمي حقل كلمة المرور تقليدياً، وليس كامل الحزمة.',
  'الانتشار الحديث قد يضيف حماية إضافية حسب التصميم.',
]
export function RadiusArchitectureDiagram() {
  const p = useStepPlayback(radiusStages.length); const s = p.stage
  return <StepShell title="RADIUS ARCHITECTURE" playback={p} legend={radiusStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="RADIUS AAA architecture using UDP 1812 and 1813 with coupled authentication and authorization">
    <Note x={460} y={24} text="RADIUS - NETWORK ACCESS AAA, UDP 1812/1813" color="#94a3b8" size={8.7} />
    <Device x={45} y={150} w={150} h={100} title="USER/ADMIN" sub="access request" color="#38bdf8" active />
    <Device x={280} y={150} w={170} h={100} title="NAS/DEVICE" sub="RADIUS client" color="#f59e0b" active />
    <Device x={620} y={130} w={240} h={140} title="RADIUS SERVER" sub="central AAA" color="#a78bfa" active={s >= 1} />
    <LinkLine x1={195} y1={200} x2={280} y2={200} color="#38bdf8" active />
    <LinkLine x1={450} y1={200} x2={620} y2={200} color="#a78bfa" active={s >= 1} />
    {s >= 1 && <Packet point={{ x: 535, y: 190 }} color="#a78bfa" label="UDP 1812" />}
    {s >= 1 && <Packet point={{ x: 535, y: 220 }} color="#34d399" label="UDP 1813" />}
    <Badge x={640} y={290} text="AUTH+AUTHZ COUPLED" color="#a78bfa" active={s >= 2} w={200} />
    {s >= 3 && <Badge x={280} y={290} text="PASSWORD PROTECTED TRADITIONALLY" color="#fb7185" active w={290} />}
    {s >= 4 && <Badge x={280} y={325} text="MODERN DEPLOYMENTS MAY ADD PROTECTION" color="#34d399" active w={290} />}
  </svg></StepShell>
}

const compareStages = [
  'TACACS+ يستخدم TCP 49؛ RADIUS يستخدم UDP 1812/1813.',
  'TACACS+ يفصل AAA؛ RADIUS يقرن AuthN/AuthZ تقليدياً أكثر.',
  'TACACS+ يشفر جسم الحزمة؛ RADIUS التقليدي يحمي كلمة المرور أساساً.',
  'TACACS+ شائع لإدارة الأجهزة؛ RADIUS شائع لوصول الشبكة.',
  'لا تعمم: كلاهما يمكن استخدامه في سيناريوهات متعددة حسب التصميم.',
]
export function TacacsVsRadiusComparisonDiagram() {
  const p = useStepPlayback(compareStages.length); const s = p.stage
  return <StepShell title="TACACS+ vs RADIUS COMPARISON" playback={p} legend={compareStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Comparison table diagram between TACACS plus and RADIUS transport ports encryption AAA separation and common use">
    <Note x={460} y={24} text="CHOOSE BASED ON REQUIREMENTS, NOT MYTHS" color="#94a3b8" size={8.8} />
    <rect x={60} y={60} width={800} height={290} rx="12" fill="#0b1224" stroke="#334155" />
    <SvgText x={260} y={90} color="#34d399" size={10} bold>TACACS+</SvgText>
    <SvgText x={660} y={90} color="#a78bfa" size={10} bold>RADIUS</SvgText>
    <SvgText x={110} y={125} color="#94a3b8" size={8.8} anchor="start">Transport</SvgText>
    <SvgText x={110} y={160} color="#94a3b8" size={8.8} anchor="start">Ports</SvgText>
    <SvgText x={110} y={195} color="#94a3b8" size={8.8} anchor="start">AAA separation</SvgText>
    <SvgText x={110} y={230} color="#94a3b8" size={8.8} anchor="start">Encryption</SvgText>
    <SvgText x={110} y={265} color="#94a3b8" size={8.8} anchor="start">Common use</SvgText>
    <SvgText x={110} y={300} color="#94a3b8" size={8.8} anchor="start">Origin</SvgText>
    <g opacity={s >= 0 ? 1 : 0.35}><SvgText x={260} y={125} color="#cbd5e1" size={8.8}>TCP</SvgText><SvgText x={660} y={125} color="#cbd5e1" size={8.8}>UDP</SvgText></g>
    <g opacity={s >= 0 ? 1 : 0.35}><SvgText x={260} y={160} color="#cbd5e1" size={8.8}>49</SvgText><SvgText x={660} y={160} color="#cbd5e1" size={8.8}>1812 / 1813</SvgText></g>
    <g opacity={s >= 1 ? 1 : 0.35}><SvgText x={260} y={195} color="#cbd5e1" size={8.8}>Separate</SvgText><SvgText x={660} y={195} color="#cbd5e1" size={8.8}>More coupled</SvgText></g>
    <g opacity={s >= 2 ? 1 : 0.35}><SvgText x={260} y={230} color="#cbd5e1" size={8.8}>Body encrypted</SvgText><SvgText x={660} y={230} color="#cbd5e1" size={8.8}>Password protected traditionally</SvgText></g>
    <g opacity={s >= 3 ? 1 : 0.35}><SvgText x={260} y={265} color="#cbd5e1" size={8.8}>Device admin</SvgText><SvgText x={660} y={265} color="#cbd5e1" size={8.8}>Network access</SvgText></g>
    <g opacity={s >= 4 ? 1 : 0.35}><SvgText x={260} y={300} color="#cbd5e1" size={8.8}>Cisco-developed</SvgText><SvgText x={660} y={300} color="#cbd5e1" size={8.8}>IETF standard</SvgText></g>
  </svg></StepShell>
}

const localCentralStages = [
  'Local authentication يخزن المستخدمين على الجهاز نفسه.',
  'Centralized authentication يستخدم خادم AAA خارجي.',
  'المركزي يسهل إدارة العديد من الأجهزة والمستخدمين.',
  'يجب التخطيط لـ fallback عند تعطل خادم AAA.',
  'الاختيار يعتمد على حجم الشبكة وسياسة الأمان.',
]
export function LocalVsCentralizedAuthenticationDiagram() {
  const p = useStepPlayback(localCentralStages.length); const s = p.stage
  return <StepShell title="LOCAL vs CENTRALIZED AUTHENTICATION" playback={p} legend={localCentralStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Local authentication on device versus centralized authentication with AAA server and fallback consideration">
    <Note x={460} y={24} text="SCALE AND POLICY DRIVE THE CHOICE" color="#94a3b8" size={8.8} />
    <g opacity={s <= 1 || s === 4 ? 1 : 0.45}><rect x={45} y={75} width={390} height={255} rx="12" fill="#0b1224" stroke="#38bdf8" strokeWidth="2" /><SvgText x={240} y={102} color="#38bdf8" size={10} bold>LOCAL</SvgText>
      <Device x={75} y={145} w={140} h={90} title="ADMIN" sub="credentials" color="#38bdf8" active />
      <Device x={260} y={145} w={150} h={90} title="DEVICE" sub="local user DB" color="#f59e0b" active />
      <LinkLine x1={215} y1={190} x2={260} y2={190} color="#38bdf8" active />
      <Note x={240} y={285} text="simple, per-device" color="#cbd5e1" size={8.7} />
    </g>
    <g opacity={s >= 1 ? 1 : 0.45}><rect x={485} y={75} width={390} height={255} rx="12" fill="#0b1224" stroke="#34d399" strokeWidth="2" /><SvgText x={680} y={102} color="#34d399" size={10} bold>CENTRALIZED</SvgText>
      <Device x={505} y={125} w={120} h={80} title="ADMIN" sub="login" color="#38bdf8" active={s >= 1} />
      <Device x={655} y={125} w={120} h={80} title="DEVICE" sub="AAA client" color="#f59e0b" active={s >= 1} />
      <Device x={655} y={235} w={120} h={80} title="AAA SERVER" sub="policy" color="#34d399" active={s >= 1} />
      <LinkLine x1={625} y1={165} x2={655} y2={165} color="#38bdf8" active={s >= 1} />
      <LinkLine x1={715} y1={205} x2={715} y2={235} color="#34d399" active={s >= 1} />
      {s >= 3 && <Badge x={505} y={285} text="PLAN FALLBACK" color="#fb7185" active w={140} />}
    </g>
  </svg></StepShell>
}