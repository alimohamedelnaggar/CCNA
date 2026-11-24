import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { RichText } from '../ui/RichText'
import { LinkLine } from './ArchitectureDiagrams'
import { SvgText } from './FiberDiagrams'

interface StepPlayback { stage: number; playing: boolean; toggle: () => void; next: () => void; previous: () => void; reset: () => void }
function useStepPlayback(length: number): StepPlayback {
  const [stage, setStage] = useState(0)
  const [playing, setPlaying] = useState(false)
  useEffect(() => { if (!playing) return; const t = window.setInterval(() => setStage((c) => (c + 1) % length), 2300); return () => window.clearInterval(t) }, [playing, length])
  return { stage, playing, toggle: () => setPlaying((v) => !v), next: () => setStage((c) => (c + 1) % length), previous: () => setStage((c) => (c - 1 + length) % length), reset: () => { setPlaying(false); setStage(0) } }
}
function StepControls({ playback }: { playback: StepPlayback }) {
  const base = 'flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[0.75rem] transition'
  return <div className="flex flex-wrap items-center gap-2">
    <button type="button" onClick={playback.toggle} className={`${base} border-accent-400/30 bg-accent-500/10 font-bold text-accent-300 hover:bg-accent-500/20`}>{playback.playing ? <Pause size={13} /> : <Play size={13} />}{playback.playing ? 'إيقاف' : 'شغّل'}</button>
    <button type="button" onClick={playback.previous} className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}><SkipBack size={13} /> السابق</button>
    <button type="button" onClick={playback.next} className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}><SkipForward size={13} /> التالي</button>
    <button type="button" onClick={playback.reset} className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}><RotateCcw size={13} /> إعادة</button>
  </div>
}
function StepShell({ title, playback, legend, children }: { title: string; playback: StepPlayback; legend: string; children: ReactNode }) {
  return <div className="my-6 overflow-hidden rounded-2xl border border-sky-400/12 bg-navy-950/70">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-400/10 px-4 py-3"><span className="font-display text-[0.78rem] font-bold text-slate-300" dir="ltr">{title}</span><StepControls playback={playback} /></div>
    <div className="diagram-grid overflow-x-auto px-2 py-4" dir="ltr">{children}</div>
    <div className="border-t border-sky-400/10 bg-sky-400/[0.03] px-4 py-3 text-[0.85rem] leading-[1.9] text-slate-300" dir="rtl"><span className="ml-2 rounded bg-accent-500/15 px-1.5 py-0.5 font-display text-[0.7rem] font-bold text-accent-300" dir="ltr">{playback.stage + 1}</span><RichText>{legend}</RichText></div>
  </div>
}
function Box({ x, y, w, h, title, sub, color, active = false }: { x: number; y: number; w: number; h: number; title: string; sub: string; color: string; active?: boolean }) {
  return <g opacity={active ? 1 : 0.45}><rect x={x} y={y} width={w} height={h} rx="11" fill="#0b1224" stroke={color} strokeWidth={active ? 2.2 : 1.2} /><SvgText x={x + w / 2} y={y + 24} color={color} size={10} bold>{title}</SvgText><SvgText x={x + w / 2} y={y + 43} color="#cbd5e1" size={8.5}>{sub}</SvgText></g>
}
function Badge({ x, y, text, color = '#38bdf8', active = true, w = 220 }: { x: number; y: number; text: string; color?: string; active?: boolean; w?: number }) {
  return <g opacity={active ? 1 : 0.4}><rect x={x} y={y} width={w} height={24} rx="7" fill="#0a1730" stroke={color} strokeWidth={active ? 1.8 : 1} /><SvgText x={x + w / 2} y={y + 16} color={color} size={8.2} bold>{text}</SvgText></g>
}

const conceptStages = [
  'كل جهاز في الشبكة يحتاج وقت دقيق ومتزامن للـ logs والمراقبة والأمان.',
  'بدون مزامنة، نفس الحدث قد يظهر ب timestamps مختلفة على أجهزة مختلفة.',
  'NTP يزامن أجهزة الشبكة مع مصدر وقت موثوق عبر UDP port 123.',
  'العميل يضبط ساعته بناءً على معلومات الخادم مع حساب تأخير الشبكة.',
  'NTP يحسّن الاتساق لكنه لا يضمن دقة مطلقة في كل الظروف.',
]
export function NtpConceptDiagram() {
  const p = useStepPlayback(conceptStages.length); const s = p.stage
  return <StepShell title="NTP CONCEPT" playback={p} legend={conceptStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="NTP clock synchronization concept">
    <Box x={70} y={160} w={180} h={80} title="R1" sub="Local clock" color="#38bdf8" active />
    <Box x={370} y={150} w={180} h={100} title="NTP" sub="UDP 123" color="#f59e0b" active />
    <Box x={690} y={160} w={180} h={80} title="Time Source" sub="Trusted" color="#34d399" active />
    <LinkLine x1={250} y1={200} x2={370} y2={200} color="#38bdf8" active />
    <LinkLine x1={550} y1={200} x2={690} y2={200} color="#34d399" active={s>=2} />
    {s>=3 && <Badge x={330} y={290} text="Offset + delay -> adjusted clock" color="#f59e0b" active w={260} />}
  </svg></StepShell>
}

const clientServerStages = [
  'NTP Server يوفر الوقت لأجهزة أخرى، وغالباً يكون متزامناً مع مصدر أعلى.',
  'NTP Client يرسل request ويستقبل time information من الخادم.',
  'نفس الجهاز قد يكون Client لـ upstream وServer لـ downstream في نفس الوقت.',
  'Client يحدد أفضل مصدر عبر NTP selection process، ليس لمجرد ترتيب الأوامر.',
  'UDP port 123 تستخدمه خدمة NTP للطلبات والردود.',
]
export function NtpClientVsServerDiagram() {
  const p = useStepPlayback(clientServerStages.length); const s = p.stage
  return <StepShell title="NTP CLIENT vs SERVER" playback={p} legend={clientServerStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="NTP client and server roles">
    <Box x={90} y={160} w={220} h={90} title="NTP Client" sub="Sends request" color="#38bdf8" active />
    <Box x={610} y={160} w={220} h={90} title="NTP Server" sub="Provides time" color="#34d399" active />
    <LinkLine x1={310} y1={205} x2={610} y2={205} color="#f59e0b" active={s>=1} />
    {s>=3 && <Badge x={350} y={290} text="UDP 123 / selection process" color="#f59e0b" active w={240} />}
  </svg></StepShell>
}

const reqRespStages = [
  'Client يرسل NTP request مع timestamp محلي.',
  'Server يستقبل الطلب ويسجل أوقات الاستقبال والإرسال.',
  'Server يرسل response يحتوي معلومات الوقت.',
  'Client يحسب clock offset وnetwork delay.',
  'Client يضبط ساعته تدريجياً ويستمر polling بشكل دوري.',
]
export function NtpRequestResponseDiagram() {
  const p = useStepPlayback(reqRespStages.length); const s = p.stage
  return <StepShell title="NTP REQUEST AND RESPONSE" playback={p} legend={reqRespStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="NTP request and response exchange">
    <Box x={100} y={170} w={190} h={80} title="Client" sub="T1 send" color="#38bdf8" active />
    <Box x={630} y={170} w={190} h={80} title="Server" sub="T2/T3" color="#34d399" active />
    <LinkLine x1={290} y1={190} x2={630} y2={190} color="#38bdf8" active={s>=0} />
    <LinkLine x1={630} y1={235} x2={290} y2={235} color="#34d399" active={s>=2} />
    {s>=3 && <Badge x={340} y={290} text="offset + delay" color="#f59e0b" active w={220} />}
  </svg></StepShell>
}

const lifecycleStages = [
  'Configure NTP server address on client.',
  'Send requests and receive responses periodically.',
  'Calculate offset/delay and select best peer.',
  'Adjust system clock gradually (slew/step depending on platform).',
  'Continuous polling keeps clock synchronized.',
]
export function NtpSynchronizationLifecycleDiagram() {
  const p = useStepPlayback(lifecycleStages.length); const s = p.stage
  const labels = ['Configure','Exchange','Calculate','Adjust','Poll Again']
  return <StepShell title="NTP SYNCHRONIZATION LIFECYCLE" playback={p} legend={lifecycleStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="NTP synchronization lifecycle">
    {labels.map((t,i)=><g key={t} opacity={s>=i?1:0.35}><rect x={35+i*175} y={170} width={150} height={70} rx="10" fill="#0b1224" stroke={s===i?'#f59e0b':'#475569'} strokeWidth={s===i?2.2:1}/><SvgText x={110+i*175} y={210} color={s===i?'#f59e0b':'#cbd5e1'} size={9} bold>{t}</SvgText></g>)}
  </svg></StepShell>
}

const strata = ['Stratum 0','Stratum 1','Stratum 2','Stratum 3','Clients']
const hierarchyStages = [
  'Stratum 0 = reference clock such as GPS/atomic clock.',
  'Stratum 1 server is directly connected to Stratum 0.',
  'Stratum 2 synchronizes from Stratum 1; Stratum 3 from Stratum 2.',
  'Lower stratum number means closer logically to reference clock.',
  'Stratum 16 means unsynchronized and not a valid source.',
]
export function StratumHierarchyDiagram() {
  const p = useStepPlayback(hierarchyStages.length); const s = p.stage
  return <StepShell title="STRATUM HIERARCHY" playback={p} legend={hierarchyStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="NTP stratum hierarchy pyramid">
    {strata.map((t,i)=>{
      const width = 130 + i*35
      const x = (920-width)/2
      return <g key={t} opacity={s>=Math.min(i,4)?1:0.3}><rect x={x} y={40+i*68} width={width} height={52} rx="10" fill="#0b1224" stroke={i===0?'#f59e0b':i===4?'#38bdf8':'#34d399'} strokeWidth={1.8}/><SvgText x={460} y={72+i*68} color={i===0?'#f59e0b':'#cbd5e1'} size={9} bold>{t}</SvgText></g>
    })}
  </svg></StepShell>
}

const s01Stages = [
  'Stratum 0 is the reference clock itself (GPS/atomic).',
  'Stratum 0 devices usually are not normal NTP servers on the network.',
  'Stratum 1 NTP server is directly attached to Stratum 0.',
  'Stratum 1 is closer to the reference than Stratum 2.',
  'The stratum number is logical distance, not router hop count.',
]
export function Stratum0Vs1Diagram() {
  const p = useStepPlayback(s01Stages.length); const s = p.stage
  return <StepShell title="STRATUM 0 vs STRATUM 1" playback={p} legend={s01Stages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Stratum 0 reference clock versus stratum 1 NTP server">
    <Box x={120} y={150} w={260} h={100} title="Stratum 0" sub="GPS / Atomic Clock" color="#f59e0b" active={s<=2} />
    <Box x={560} y={150} w={260} h={100} title="Stratum 1" sub="NTP Server" color="#34d399" active={s>=2} />
    <LinkLine x1={380} y1={200} x2={560} y2={200} color="#f59e0b" active={s>=2} />
    {s>=4 && <Badge x={330} y={290} text="Not a router hop count" color="#38bdf8" active w={230} />}
  </svg></StepShell>
}

const s215Stages = [
  'Stratum 2 servers get time from Stratum 1.',
  'Stratum 3 servers get time from Stratum 2, and so on.',
  'Hierarchy can continue up to Stratum 15.',
  'A lower number is generally preferred but not always best in every condition.',
  'Network delay and source quality also matter.',
]
export function Stratum2To15Diagram() {
  const p = useStepPlayback(s215Stages.length); const s = p.stage
  return <StepShell title="STRATUM 2-15" playback={p} legend={s215Stages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="NTP stratum 2 through 15 hierarchy">
    {['S2','S3','S4','...','S15'].map((t,i)=><g key={t} opacity={s>=Math.min(i,4)?1:0.35}><rect x={90+i*155} y={170} width={120} height={65} rx="10" fill="#0b1224" stroke="#34d399" strokeWidth={1.6}/><SvgText x={150+i*155} y={210} color="#cbd5e1" size={10} bold>{t}</SvgText></g>)}
  </svg></StepShell>
}

const s16Stages = [
  'Stratum 16 indicates unsynchronized.',
  'A device at stratum 16 should not be trusted as a time source.',
  'Check server reachability, UDP 123, and NTP status.',
  'After synchronization succeeds, stratum should become 1-15.',
  'Use `show ntp status` and `show ntp associations` to verify.',
]
export function Stratum16UnsynchronizedDiagram() {
  const p = useStepPlayback(s16Stages.length); const s = p.stage
  return <StepShell title="STRATUM 16 UNSYNCHRONIZED" playback={p} legend={s16Stages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Stratum 16 unsynchronized state">
    <Box x={330} y={150} w={260} h={110} title="Stratum 16" sub={s>=3 ? 'Sync restored' : 'Unsynchronized'} color={s>=3?'#34d399':'#fb7185'} active />
    {s>=1 && <Badge x={330} y={290} text="Not a valid trusted time source" color="#fb7185" active w={260} />}
  </svg></StepShell>
}

const topoStages = [
  'Authoritative time source feeds an NTP server.',
  'R1 is an NTP client of the server.',
  'R2 can be another client or downstream server depending on role.',
  'Switches and PCs can also synchronize via NTP if supported.',
  'All devices use reachable IP connectivity and UDP 123.',
]
export function NtpNetworkTopologyDiagram() {
  const p = useStepPlayback(topoStages.length); const s = p.stage
  return <StepShell title="NTP NETWORK TOPOLOGY" playback={p} legend={topoStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="NTP network topology with server routers switches and PCs">
    <Box x={380} y={30} w={160} h={60} title="Time Source" sub="Authoritative" color="#f59e0b" active />
    <Box x={380} y={125} w={160} h={60} title="NTP Server" sub="Core" color="#34d399" active />
    <Box x={200} y={230} w={160} h={60} title="R1" sub="Client" color="#38bdf8" active />
    <Box x={560} y={230} w={160} h={60} title="R2" sub="Client/Server" color="#38bdf8" active={s>=2} />
    <Box x={200} y={330} w={160} h={50} title="SW1/PC1" sub="NTP capable" color="#64748b" active={s>=3} />
    <Box x={560} y={330} w={160} h={50} title="SW2/PC2" sub="NTP capable" color="#64748b" active={s>=3} />
    <LinkLine x1={460} y1={90} x2={460} y2={125} color="#f59e0b" active />
    <LinkLine x1={420} y1={185} x2={280} y2={230} color="#34d399" active={s>=1} />
    <LinkLine x1={500} y1={185} x2={640} y2={230} color="#34d399" active={s>=2} />
  </svg></StepShell>
}

const clientCfgStages = [
  'Topology: NTP Server 192.168.1.100 connected via R1 to LAN.',
  'Set IP connectivity before expecting NTP synchronization.',
  'Use `ntp server 192.168.1.100` to configure R1 as NTP client.',
  'Optionally configure multiple NTP servers for redundancy.',
  'Verify with `show ntp status` and `show ntp associations`.',
]
export function NtpClientConfigurationDiagram() {
  const p = useStepPlayback(clientCfgStages.length); const s = p.stage
  return <StepShell title="NTP CLIENT CONFIGURATION" playback={p} legend={clientCfgStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="NTP client configuration topology and command">
    <Box x={90} y={160} w={210} h={90} title="NTP Server" sub="192.168.1.100" color="#34d399" active />
    <Box x={630} y={160} w={210} h={90} title="R1 Client" sub="LAN gateway" color="#38bdf8" active />
    <LinkLine x1={300} y1={205} x2={630} y2={205} color="#f59e0b" active={s>=1} />
    {s>=2 && <Badge x={330} y={280} text="ntp server 192.168.1.100" color="#f59e0b" active w={250} />}
  </svg></StepShell>
}

const serverCfgStages = [
  'NTP server provides time to clients.',
  'A router can synchronize from upstream and also serve downstream clients.',
  '`ntp master 3` uses local clock as a lab/example source with stratum 3.',
  'Local clock is not automatically accurate or trustworthy in production.',
  'Do not present `ntp master` as a replacement for a reliable production time source.',
]
export function NtpServerConfigurationDiagram() {
  const p = useStepPlayback(serverCfgStages.length); const s = p.stage
  return <StepShell title="NTP SERVER CONFIGURATION" playback={p} legend={serverCfgStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="NTP server configuration and ntp master concept">
    <Box x={340} y={140} w={240} h={110} title="R1 NTP Server" sub={s>=2?'ntp master 3':'Provides time'} color="#34d399" active />
    {s>=2 && <Badge x={340} y={280} text="Local clock = conceptual lab source" color={s>=4?'#fb7185':'#f59e0b'} active w={260} />}
  </svg></StepShell>
}

const clockSyncStages = [
  'System clock is the time used by the IOS system processes.',
  'Hardware clock/calendar may persist time across reloads on supported platforms.',
  'UTC is the global time reference; time zone changes how time is displayed.',
  'NTP continuously adjusts the system clock.',
  'Manual `clock set` is a point-in-time change, not ongoing synchronization.',
]
export function ClockSynchronizationDiagram() {
  const p = useStepPlayback(clockSyncStages.length); const s = p.stage
  return <StepShell title="CLOCK SYNCHRONIZATION" playback={p} legend={clockSyncStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="System clock hardware clock UTC and NTP synchronization">
    <Box x={80} y={150} w={200} h={90} title="System Clock" sub="Used by IOS" color="#38bdf8" active />
    <Box x={360} y={150} w={200} h={90} title="Hardware Clock" sub="Calendar (platform)" color="#64748b" active={s>=1} />
    <Box x={640} y={150} w={200} h={90} title="NTP Sync" sub="Continuous adjust" color="#34d399" active={s>=3} />
    {s>=2 && <Badge x={330} y={280} text="UTC + timezone = displayed local time" color="#f59e0b" active w={260} />}
  </svg></StepShell>
}

const utcStages = [
  'UTC is the common global time reference used by networks and logs.',
  'Time zone offsets change displayed local time, for example UTC+2 (EET).',
  'The underlying synchronized clock remains based on UTC/internal time.',
  'Daylight Saving Time may change display offset depending on configuration/region.',
  'Always document time zone when analyzing logs across devices.',
]
export function UtcVsLocalTimeZoneDiagram() {
  const p = useStepPlayback(utcStages.length); const s = p.stage
  return <StepShell title="UTC vs LOCAL TIME ZONE" playback={p} legend={utcStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="UTC versus local time zone display">
    <Box x={120} y={160} w={230} h={90} title="UTC" sub="15:30 UTC" color="#38bdf8" active />
    <Box x={570} y={160} w={230} h={90} title="EET (UTC+2)" sub="17:30 local" color="#34d399" active={s>=1} />
    <LinkLine x1={350} y1={205} x2={570} y2={205} color="#f59e0b" active={s>=1} />
    {s>=3 && <Badge x={350} y={280} text="Display changes; reference time stays UTC-based" color="#f59e0b" active w={300} />}
  </svg></StepShell>
}

const assocStages = [
  '`*` marks the selected system peer.',
  '`+` marks a candidate peer that could be selected.',
  '`-` marks an outlier/combination candidate depending on implementation/output.',
  'Other symbols may appear; check platform documentation.',
  'Reach, delay, and offset values help judge synchronization quality.',
]
export function NtpAssociationStatesDiagram() {
  const p = useStepPlayback(assocStages.length); const s = p.stage
  const rows = [
    ['* 192.168.1.100','Selected system peer'],
    ['+ 192.168.1.101','Candidate'],
    ['- 192.168.1.102','Outlier'],
  ]
  return <StepShell title="NTP ASSOCIATION STATES" playback={p} legend={assocStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="NTP association state symbols">
    {rows.map((r,i)=><g key={r[0]} opacity={s>=i?1:0.35}><rect x={150} y={110+i*80} width={620} height={55} rx="10" fill="#0b1224" stroke={i===0?'#34d399':'#475569'} strokeWidth={i===0?2.2:1}/><SvgText x={190} y={145+i*80} color={i===0?'#34d399':'#cbd5e1'} size={10} bold>{r[0]}</SvgText><SvgText x={430} y={145+i*80} color="#94a3b8" size={9}>{r[1]}</SvgText></g>)}
  </svg></StepShell>
}

const troubleSteps = ['Not Synchronized','Check Config','Check Server Reachability','Check UDP 123','Check Server Status','Verify']
const troubleStages = [
  'Start from `show ntp status`: is the clock synchronized?',
  'Verify `ntp server` addresses and running-config.',
  'Check reachability and routing to the NTP server.',
  'Confirm UDP port 123 is not blocked; ping alone is not enough.',
  'Ensure the upstream server is synchronized and not stratum 16.',
  'Use `show ntp associations` and `show clock detail` for final verification.',
]
export function NtpTroubleshootingFlowDiagram() {
  const p = useStepPlayback(troubleStages.length); const s = p.stage
  return <StepShell title="NTP TROUBLESHOOTING FLOW" playback={p} legend={troubleStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="NTP troubleshooting flow">
    {troubleSteps.map((t,i)=><g key={t} opacity={s>=Math.min(i,5)?1:0.3}><rect x={35+i*145} y={170} width={125} height={65} rx="9" fill="#0b1224" stroke={s===i?'#f59e0b':'#475569'} strokeWidth={s===i?2.2:1}/><SvgText x={97+i*145} y={208} color={s===i?'#f59e0b':'#cbd5e1'} size={8.5} bold>{t}</SvgText></g>)}
    {[0,1,2,3,4].map(i=><LinkLine key={i} x1={160+i*145} y1={202} x2={180+i*145} y2={202} color="#f59e0b" active={s>i} />)}
  </svg></StepShell>
}
