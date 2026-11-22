import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { RichText } from '../ui/RichText'
import { LinkLine, Packet } from './ArchitectureDiagrams'
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
      <button
        type="button"
        onClick={playback.toggle}
        className={`${base} border-accent-400/30 bg-accent-500/10 font-bold text-accent-300 hover:bg-accent-500/20`}
      >
        {playback.playing ? <Pause size={13} /> : <Play size={13} />}
        {playback.playing ? 'إيقاف' : 'شغّل'}
      </button>
      <button type="button" onClick={playback.previous} className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}>
        <SkipBack size={13} /> السابق
      </button>
      <button type="button" onClick={playback.next} className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}>
        <SkipForward size={13} /> التالي
      </button>
      <button type="button" onClick={playback.reset} className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}>
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

function Panel({
  x,
  y,
  w,
  h,
  title,
  lines,
  color = '#38bdf8',
  active = false,
  size = 9,
}: {
  x: number
  y: number
  w: number
  h: number
  title: string
  lines: string[]
  color?: string
  active?: boolean
  size?: number
}) {
  return (
    <g opacity={active ? 1 : 0.45}>
      <rect x={x} y={y} width={w} height={h} rx="12" fill="#0b1224" stroke={color} strokeWidth={active ? 2.2 : 1.1} />
      <SvgText x={x + w / 2} y={y + 21} color={color} size={10} bold>
        {title}
      </SvgText>
      {lines.map((line, index) => (
        <SvgText key={index} x={x + w / 2} y={y + 40 + index * 15} color="#cbd5e1" size={size}>
          {line}
        </SvgText>
      ))}
    </g>
  )
}

function Note({ x, y, text, color = '#64748b', size = 9.5 }: { x: number; y: number; text: string; color?: string; size?: number }) {
  return (
    <SvgText x={x} y={y} color={color} size={size}>
      {text}
    </SvgText>
  )
}

function Device({
  x,
  y,
  w,
  h,
  title,
  sub,
  color,
  active = false,
}: {
  x: number
  y: number
  w: number
  h: number
  title: string
  sub: string
  color: string
  active?: boolean
}) {
  return (
    <g opacity={active ? 1 : 0.45}>
      <rect x={x} y={y} width={w} height={h} rx="11" fill="#0b1224" stroke={color} strokeWidth={active ? 2.4 : 1.2} />
      <SvgText x={x + w / 2} y={y + 25} color={color} size={11} bold>
        {title}
      </SvgText>
      <SvgText x={x + w / 2} y={y + 45} color="#cbd5e1" size={9}>
        {sub}
      </SvgText>
    </g>
  )
}

function Badge({
  x,
  y,
  text,
  color = '#38bdf8',
  active = true,
  w = 130,
}: {
  x: number
  y: number
  text: string
  color?: string
  active?: boolean
  w?: number
}) {
  return (
    <g opacity={active ? 1 : 0.4}>
      <rect x={x} y={y} width={w} height={26} rx="7" fill="#0a1730" stroke={color} strokeWidth={active ? 2 : 1} />
      <SvgText x={x + w / 2} y={y + 17} color={color} size={8.7} bold>
        {text}
      </SvgText>
    </g>
  )
}

function CrossMark({ x, y, color = '#fb7185' }: { x: number; y: number; color?: string }) {
  return (
    <g stroke={color} strokeWidth="2.6" strokeLinecap="round">
      <line x1={x - 8} y1={y - 8} x2={x + 8} y2={y + 8} />
      <line x1={x + 8} y1={y - 8} x2={x - 8} y2={y + 8} />
    </g>
  )
}

function CheckMark({ x, y, color = '#34d399' }: { x: number; y: number; color?: string }) {
  return (
    <g stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d={`M ${x - 8} ${y} l 5 5 l 10 -12`} />
    </g>
  )
}

function TableRow({
  y,
  values,
  widths,
  x = 70,
  color = '#38bdf8',
  active = true,
  size = 8.6,
}: {
  y: number
  values: string[]
  widths: number[]
  x?: number
  color?: string
  active?: boolean
  size?: number
}) {
  let cursor = x
  return (
    <g opacity={active ? 1 : 0.35}>
      {values.map((value, index) => {
        const center = cursor + widths[index] / 2
        cursor += widths[index]
        return (
          <SvgText key={index} x={center} y={y} color={index === 0 ? color : '#cbd5e1'} size={size} bold={index === 0}>
            {value}
          </SvgText>
        )
      })}
    </g>
  )
}

const wlanStages = [
  'عملاء لاسلكيون يتصلون بـ SSID عبر AP باستخدام RF.',
  'الـ APs متصلة بمفاتيح الوصول عبر كابل Ethernet.',
  'الـ WLC يدير الـ APs ويرسل السياسات والتكوين.',
  'حركة العميل تُمرَّر إلى الشبكة السلكية والـ core.',
  'كل مكوّن له دور: client، AP، switch، WLC، core.',
]

export function BasicWlanArchitectureDiagram() {
  const playback = useStepPlayback(wlanStages.length)
  const s = playback.stage
  return (
    <StepShell title="BASIC WLAN ARCHITECTURE" playback={playback} legend={wlanStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Enterprise WLAN topology with clients, APs, access switch, WLC, and core network">
        <Note x={460} y={24} text="WIRELESS CLIENTS, ACCESS POINTS, SWITCHES, WLC, CORE" color="#94a3b8" size={9.1} />
        <Device x={25} y={100} w={140} h={100} title="CLIENTS" sub="laptop / phone" color="#94a3b8" active />
        <Device x={225} y={75} w={150} h={85} title="AP 1" sub="SSID: CORP" color="#38bdf8" active={s >= 0} />
        <Device x={225} y={225} w={150} h={85} title="AP 2" sub="SSID: CORP" color="#38bdf8" active={s >= 0} />
        <Device x={445} y={145} w={150} h={95} title="ACCESS SWITCH" sub="PoE / VLANs" color="#a78bfa" active={s >= 1} />
        <Device x={660} y={70} w={175} h={90} title="WLC" sub="control + policy" color="#f59e0b" active={s >= 2} />
        <Device x={660} y={265} w={175} h={90} title="CORE NETWORK" sub="routing / services" color="#34d399" active={s >= 3} />
        <LinkLine x1={165} y1={135} x2={225} y2={115} color="#38bdf8" active={s >= 0} />
        <LinkLine x1={165} y1={170} x2={225} y2={265} color="#38bdf8" active={s >= 0} />
        <LinkLine x1={375} y1={115} x2={445} y2={170} color="#34d399" active={s >= 1} />
        <LinkLine x1={375} y1={265} x2={445} y2={215} color="#34d399" active={s >= 1} />
        <LinkLine x1={595} y1={180} x2={660} y2={115} color="#f59e0b" active={s >= 2} />
        <LinkLine x1={595} y1={210} x2={660} y2={305} color="#34d399" active={s >= 3} />
        {s >= 0 && <Packet point={{ x: 195, y: 125 }} color="#38bdf8" label="RF" />}
        {s >= 2 && <Packet point={{ x: 625, y: 150 }} color="#f59e0b" label="CTRL" />}
        {s >= 3 && <Packet point={{ x: 625, y: 260 }} color="#34d399" label="DATA" />}
        <Badge x={230} y={320} text="AP = RF + 802.11" color="#38bdf8" active={s >= 1} w={160} />
        <Badge x={660} y={180} text="POLICY / RRM" color="#f59e0b" active={s >= 2} w={175} />
        <Panel
          x={55}
          y={360}
          w={810}
          h={48}
          title={s >= 4 ? "ROLE SUMMARY" : "CONNECTION FLOW"}
          lines={[s >= 4 ? 'WLC manages and controls; switches carry traffic; core routes client data.' : 'Client RF to AP, AP over Ethernet to switch, then control to WLC and data toward core.']}
          color={s >= 4 ? '#34d399' : '#38bdf8'}
          active
          size={8.8}
        />
      </svg>
    </StepShell>
  )
}

const autonomousStages = [
  'Autonomous AP يعمل كجهاز مستقل قبل أي تحكم مركزي.',
  'التكوين مثل SSID وWPA والقناة موجود على كل AP نفسه.',
  'كل AP له عنوان إدارة خاص وتكوين محلي منفصل.',
  'سويتش واحد يربط الـ APs بالشبكة، لكن الإدارة متفرقة.',
  'ما فيش WLC مطلوب للتشغيل الطبيعي في هذا النموذج.',
]

export function AutonomousApArchitectureDiagram() {
  const playback = useStepPlayback(autonomousStages.length)
  const s = playback.stage
  return (
    <StepShell title="AUTONOMOUS AP ARCHITECTURE" playback={playback} legend={autonomousStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Autonomous access points configured independently without a WLC">
        <Note x={460} y={24} text="EVERY AP STORES ITS OWN CONFIGURATION" color="#94a3b8" size={9.2} />
        <Device x={40} y={150} w={130} h={85} title="PC" sub="wired client" color="#94a3b8" active />
        <Device x={230} y={80} w={200} h={115} title="AUTONOMOUS AP 1" sub="local config + management" color="#38bdf8" active={s >= 1} />
        <Device x={230} y={235} w={200} h={115} title="AUTONOMOUS AP 2" sub="separate local config" color="#38bdf8" active={s >= 2} />
        <Device x={500} y={155} w={170} h={100} title="ACCESS SWITCH" sub="connectivity only" color="#a78bfa" active={s >= 3} />
        <Device x={735} y={150} w={140} h={105} title="WLC" sub="not required" color="#64748b" active={false} />
        <LinkLine x1={170} y1={192} x2={230} y2={137} color="#34d399" active />
        <LinkLine x1={430} y1={137} x2={500} y2={190} color="#34d399" active={s >= 3} />
        <LinkLine x1={430} y1={292} x2={500} y2={220} color="#34d399" active={s >= 3} />
        <Badge x={235} y={118} text="SSID + WPA + CHANNEL" color="#38bdf8" active={s >= 1} w={190} />
        <Badge x={235} y={270} text="CONFIG STORED ON AP" color="#38bdf8" active={s >= 2} w={190} />
        <CrossMark x={805} y={200} color="#fb7185" />
        <Badge x={700} y={275} text="NO CENTRAL WLC" color="#fb7185" active={s >= 4} w={180} />
        <Panel
          x={55}
          y={365}
          w={810}
          h={45}
          title={s >= 4 ? "SMALL-NETWORK FIT" : "DISTRIBUTED MANAGEMENT"}
          lines={[s >= 4 ? 'Simple for a few APs, but repetitive and harder to keep consistent as the network grows.' : 'Each AP is configured and managed individually; there is no controller pushing one policy.']}
          color={s >= 4 ? '#34d399' : '#f59e0b'}
          active
          size={8.8}
        />
      </svg>
    </StepShell>
  )
}

const lightweightStages = [
  'Lightweight AP يبدأ بدون SSID كامل مُعد محلياً للتشغيل الطبيعي.',
  'الـ AP يكتشف WLC ويرسل طلب join.',
  'الـ WLC يرسل التكوين وسياسات WLAN إلى الـ AP.',
  'الـ WLC يراقب الـ APs والعملاء مركزياً.',
  'الـ AP يتعامل مع RF والـ 802.11، والـ WLC يتعامل مع التحكم والإدارة.',
]

export function LightweightApWlcDiagram() {
  const playback = useStepPlayback(lightweightStages.length)
  const s = playback.stage
  return (
    <StepShell title="LIGHTWEIGHT AP AND WLC ARCHITECTURE" playback={playback} legend={lightweightStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Lightweight APs discovering and joining a WLC that pushes configuration">
        <Note x={460} y={24} text="CENTRALIZED CONFIGURATION AND MONITORING" color="#94a3b8" size={9.1} />
        <Device x={40} y={100} w={140} h={90} title="CLIENT" sub="SSID: CORP" color="#94a3b8" active={s >= 3} />
        <Device x={230} y={80} w={175} h={95} title="LWAP 1" sub="minimal local config" color="#38bdf8" active />
        <Device x={230} y={235} w={175} h={95} title="LWAP 2" sub="minimal local config" color="#38bdf8" active={s >= 1} />
        <Device x={470} y={150} w={150} h={100} title="ACCESS SWITCH" sub="IP connectivity" color="#a78bfa" active={s >= 1} />
        <Device x={690} y={140} w={190} h={120} title="WLC" sub="config + policy + monitor" color="#f59e0b" active={s >= 2} />
        <LinkLine x1={180} y1={140} x2={230} y2={125} color="#38bdf8" active={s >= 3} />
        <LinkLine x1={405} y1={125} x2={470} y2={180} color="#f59e0b" active={s >= 1} />
        <LinkLine x1={405} y1={280} x2={470} y2={220} color="#f59e0b" active={s >= 1} />
        <LinkLine x1={620} y1={200} x2={690} y2={200} color="#f59e0b" active={s >= 2} />
        {s >= 1 && <Packet point={{ x: 645, y: 200 }} color="#f59e0b" label="JOIN" />}
        {s >= 2 && <Packet point={{ x: 645, y: 235 }} color="#34d399" label="CONFIG" />}
        <Badge x={245} y={340} text="AP: RF + REAL-TIME 802.11" color="#38bdf8" active={s >= 4} w={235} />
        <Badge x={640} y={285} text="WLC: CONTROL + MANAGEMENT" color="#f59e0b" active={s >= 4} w={245} />
        <Panel
          x={55}
          y={365}
          w={810}
          h={45}
          title={s >= 4 ? "SPLIT-MAC CONCEPT" : "CENTRALIZED MODEL"}
          lines={[s >= 4 ? 'AP handles radio functions; WLC supplies control, policy, configuration, and monitoring.' : 'The WLC is the single source of WLAN configuration and policy for its joined APs.']}
          color={s >= 4 ? '#34d399' : '#38bdf8'}
          active
          size={8.8}
        />
      </svg>
    </StepShell>
  )
}

const centralizedStages = [
  'المعمارية المركزية تستخدم عدة LWAPs تحت WLC واحد.',
  'حركة التحكم تسري بين AP والـ WLC عبر CAPWAP control.',
  'حركة عملاء Wi-Fi تُرسل إلى الـ WLC عبر CAPWAP data.',
  'الـ WLC يمرر حركة العميل إلى الشبكة السلكية والـ core.',
  'السياسة موحدة، لكن الـ WLC يصبح نقطة تحكم مركزية مهمة.',
]

export function CentralizedWirelessDeploymentDiagram() {
  const playback = useStepPlayback(centralizedStages.length)
  const s = playback.stage
  return (
    <StepShell title="CENTRALIZED WIRELESS DEPLOYMENT" playback={playback} legend={centralizedStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Centralized wireless deployment with CAPWAP control and centrally switched client data">
        <Note x={460} y={24} text="AP TO WLC CONTROL, CLIENT DATA THROUGH WLC" color="#94a3b8" size={9} />
        <Device x={30} y={115} w={125} h={90} title="CLIENTS" sub="Wi-Fi devices" color="#94a3b8" active />
        <Device x={220} y={75} w={155} h={85} title="LWAP 1" sub="Local mode" color="#38bdf8" active />
        <Device x={220} y={245} w={155} h={85} title="LWAP 2" sub="Local mode" color="#38bdf8" active={s >= 1} />
        <Device x={440} y={150} w={145} h={100} title="ACCESS SWITCH" sub="PoE / VLAN" color="#a78bfa" active={s >= 1} />
        <Device x={640} y={145} w={160} h={110} title="WLC" sub="central policy" color="#f59e0b" active={s >= 2} />
        <Device x={810} y={155} w={90} h={90} title="CORE" sub="LAN" color="#34d399" active={s >= 3} />
        <LinkLine x1={155} y1={150} x2={220} y2={120} color="#38bdf8" active />
        <LinkLine x1={155} y1={180} x2={220} y2={285} color="#38bdf8" active={s >= 1} />
        <LinkLine x1={375} y1={120} x2={440} y2={180} color="#f59e0b" active={s >= 1} />
        <LinkLine x1={375} y1={285} x2={440} y2={220} color="#f59e0b" active={s >= 2} />
        <LinkLine x1={585} y1={200} x2={640} y2={200} color="#f59e0b" active={s >= 2} />
        <LinkLine x1={800} y1={200} x2={810} y2={200} color="#34d399" active={s >= 3} />
        {s >= 1 && <Packet point={{ x: 610, y: 180 }} color="#f59e0b" label="CTRL" />}
        {s >= 2 && <Packet point={{ x: 610, y: 225 }} color="#34d399" label="DATA" />}
        {s >= 3 && <Packet point={{ x: 805, y: 175 }} color="#34d399" label="LAN" />}
        <Badge x={455} y={285} text="CAPWAP 5246 / 5247" color="#38bdf8" active={s >= 2} w={200} />
        <Panel
          x={55}
          y={365}
          w={810}
          h={45}
          title={s >= 4 ? "TRADE-OFF" : "CENTRAL SWITCHING"}
          lines={[s >= 4 ? 'One policy point is easier to manage; WLC capacity and path design matter.' : 'Client frames travel from AP to WLC, then from WLC into the wired LAN.']}
          color={s >= 4 ? '#f59e0b' : '#34d399'}
          active
          size={8.8}
        />
      </svg>
    </StepShell>
  )
}

const cloudStages = [
  'AP في الموقع متصل بالإنترنت عبر المفتاح المحلي.',
  'الـ AP يسجّل في منصة إدارة سحابية.',
  'السياسات والتكوين تُنزل من السحابة إلى الـ AP.',
  'حركة العميل قد تخرج محلياً أو تمر عبر مسار محدد حسب النموذج.',
  'إدارة مركزية عبر السحابة لا تعني دائماً أن بيانات العملاء تمر عبر السحابة.',
]

export function CloudBasedWirelessDiagram() {
  const playback = useStepPlayback(cloudStages.length)
  const s = playback.stage
  return (
    <StepShell title="CLOUD-BASED WIRELESS MANAGEMENT" playback={playback} legend={cloudStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Cloud-managed APs with management plane in the cloud and deployment-dependent data forwarding">
        <Note x={460} y={24} text="MANAGEMENT IN CLOUD, DATA PATH DEPENDS ON DEPLOYMENT" color="#94a3b8" size={8.8} />
        <Device x={40} y={105} w={125} h={85} title="CLIENT" sub="Wi-Fi device" color="#94a3b8" active={s >= 3} />
        <Device x={210} y={95} w={160} h={100} title="CLOUD-MANAGED AP" sub="site AP" color="#38bdf8" active />
        <Device x={420} y={115} w={140} h={90} title="SITE SWITCH" sub="local LAN" color="#a78bfa" active={s >= 0} />
        <Device x={420} y={245} w={140} h={85} title="LOCAL LAN" sub="internet gateway" color="#34d399" active={s >= 0} />
        <Device x={690} y={75} w={190} h={105} title="CLOUD MANAGEMENT" sub="config + monitoring" color="#f59e0b" active={s >= 1} />
        <LinkLine x1={165} y1={140} x2={210} y2={140} color="#38bdf8" active />
        <LinkLine x1={370} y1={145} x2={420} y2={150} color="#34d399" active={s >= 0} />
        <LinkLine x1={490} y1={245} x2={690} y2={150} color="#f59e0b" active={s >= 1} />
        <LinkLine x1={370} y1={175} x2={420} y2={275} color="#34d399" active={s >= 3} />
        {s >= 1 && <Packet point={{ x: 590, y: 185 }} color="#f59e0b" label="MGMT" />}
        {s >= 3 && <Packet point={{ x: 395, y: 230 }} color="#34d399" label="DATA?" />}
        <Badge x={650} y={210} text="CLOUD CONTROL PLANE" color="#f59e0b" active={s >= 2} w={225} />
        <Badge x={205} y={310} text="LOCAL BREAKOUT POSSIBLE" color="#34d399" active={s >= 3} w={230} />
        <Panel
          x={55}
          y={360}
          w={810}
          h={50}
          title={s >= 4 ? "IMPORTANT DISTINCTION" : "CLOUD MODEL"}
          lines={[s >= 4 ? 'Cloud management and client data forwarding are separate design decisions.' : 'The management platform is reached through the network; APs receive policy from the cloud.']}
          color={s >= 4 ? '#fb7185' : '#38bdf8'}
          active
          size={8.8}
        />
      </svg>
    </StepShell>
  )
}

const embeddedStages = [
  'بعض APs المدعومة تستضيف وظيفة WLC داخلياً.',
  'لا يوجد جهاز WLC خارجي منفصل في هذا المثال.',
  'العميل يتصل بالـ SSID الذي تقدمه الـ AP.',
  'وظيفة التحكم والإدارة تعمل داخل المنصة المدعومة.',
  'الدعم يعتمد على طراز الـ AP وإصدار البرنامج وحجم النشر.',
]

export function EmbeddedWirelessControllerDiagram() {
  const playback = useStepPlayback(embeddedStages.length)
  const s = playback.stage
  return (
    <StepShell title="EMBEDDED WIRELESS CONTROLLER ARCHITECTURE" playback={playback} legend={embeddedStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Embedded wireless controller running inside a supported access point">
        <Note x={460} y={24} text="WLC FUNCTION INSIDE A SUPPORTED DEVICE" color="#94a3b8" size={9} />
        <Device x={40} y={125} w={125} h={85} title="CLIENT" sub="Wi-Fi device" color="#94a3b8" active={s >= 2} />
        <Device x={240} y={90} w={300} h={185} title="SUPPORTED ACCESS POINT" sub="radio + embedded controller" color="#38bdf8" active={s >= 0} />
        <Device x={290} y={150} w={200} h={85} title="EMBEDDED WLC" sub="config + policy + monitor" color="#f59e0b" active={s >= 1} />
        <Device x={620} y={135} w={150} h={100} title="SWITCH" sub="local LAN" color="#a78bfa" active={s >= 2} />
        <Device x={800} y={150} w={95} h={80} title="LAN" sub="services" color="#34d399" active={s >= 3} />
        <LinkLine x1={165} y1={165} x2={240} y2={165} color="#38bdf8" active={s >= 2} />
        <LinkLine x1={540} y1={180} x2={620} y2={180} color="#34d399" active={s >= 2} />
        <LinkLine x1={770} y1={180} x2={800} y2={180} color="#34d399" active={s >= 3} />
        {s >= 2 && <Packet point={{ x: 580, y: 175 }} color="#34d399" label="DATA" />}
        <Badge x={260} y={300} text="NO SEPARATE EXTERNAL WLC" color="#34d399" active={s >= 1} w={260} />
        <Badge x={600} y={270} text="PLATFORM / RELEASE DEPENDENT" color="#fb7185" active={s >= 4} w={290} />
        <Panel
          x={55}
          y={360}
          w={810}
          h={50}
          title={s >= 4 ? "SCOPE" : "SMALL / MEDIUM SITES"}
          lines={[s >= 4 ? 'Verify the exact AP model, controller software, licensing, and supported scale.' : 'Embedded WLC is useful where a separate controller is unnecessary or unavailable.']}
          color={s >= 4 ? '#f59e0b' : '#34d399'}
          active
          size={8.8}
        />
      </svg>
    </StepShell>
  )
}

const discoveryStages = [
  'Lightweight AP يبدأ بلا WLC معروف ويرسل discovery request.',
  'DHCP option 43 يمكن أن يعطي عنوان WLC للـ AP.',
  'DNS أو broadcast محلي أو عنوان ثابت طرق اكتشاف أخرى.',
  'WLC يستقبل الطلب ويرسل discovery response.',
  'الـ AP يختار WLC مناسباً وينتقل لمرحلة الجوان.',
]

export function CapwapDiscoveryDiagram() {
  const playback = useStepPlayback(discoveryStages.length)
  const s = playback.stage
  return (
    <StepShell title="CAPWAP AP DISCOVERY" playback={playback} legend={discoveryStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Lightweight AP discovering a WLC using DHCP option 43, DNS, broadcast, or static configuration">
        <Note x={460} y={24} text="DISCOVERY METHODS LEAD THE AP TO A WLC" color="#94a3b8" size={9.2} />
        <Device x={50} y={145} w={170} h={110} title="LIGHTWEIGHT AP" sub="booting" color="#38bdf8" active />
        <Device x={360} y={145} w={155} h={110} title="ACCESS SWITCH" sub="IP / DHCP" color="#a78bfa" active={s >= 1} />
        <Device x={650} y={75} w={190} h={95} title="WLC 1" sub="candidate controller" color="#f59e0b" active={s >= 3} />
        <Device x={650} y={235} w={190} h={95} title="WLC 2" sub="candidate controller" color="#f59e0b" active={s >= 3} />
        <LinkLine x1={220} y1={200} x2={360} y2={200} color="#f59e0b" active={s >= 1} />
        <LinkLine x1={515} y1={180} x2={650} y2={125} color="#f59e0b" active={s >= 3} />
        <LinkLine x1={515} y1={220} x2={650} y2={280} color="#f59e0b" active={s >= 3} />
        {s >= 0 && <Packet point={{ x: 290, y: 200 }} color="#f59e0b" label="DISCOVER" />}
        {s >= 3 && <Packet point={{ x: 590, y: 155 }} color="#34d399" label="RESPONSE" />}
        <Badge x={45} y={285} text="DHCP OPTION 43" color="#38bdf8" active={s >= 1} w={175} />
        <Badge x={245} y={285} text="DNS LOOKUP" color="#38bdf8" active={s >= 2} w={150} />
        <Badge x={420} y={285} text="L2 BROADCAST / STATIC" color="#38bdf8" active={s >= 2} w={220} />
        <Panel
          x={55}
          y={365}
          w={810}
          h={45}
          title={s >= 4 ? "NEXT STEP" : "DISCOVERY"}
          lines={[s >= 4 ? 'After discovery, the AP starts the CAPWAP join process with the selected WLC.' : 'Discovery only finds candidate WLCs; it does not by itself complete configuration.']}
          color={s >= 4 ? '#34d399' : '#f59e0b'}
          active
          size={8.8}
        />
      </svg>
    </StepShell>
  )
}

const joinStages = [
  'Step 1: AP discovers an available WLC.',
  'Step 2: AP and WLC set up a secure control channel using DTLS where supported.',
  'Step 3: AP sends a join request; WLC validates compatibility and state.',
  'Step 4: WLC sends configuration, WLAN policy, and software information.',
  'Step 5: AP reaches joined/operational state and begins normal service.',
]

export function CapwapJoinDiagram() {
  const playback = useStepPlayback(joinStages.length)
  const s = playback.stage
  const steps = [
    { label: '1 DISCOVER', detail: 'find WLC' },
    { label: '2 DTLS', detail: 'secure control' },
    { label: '3 JOIN', detail: 'validate' },
    { label: '4 CONFIG', detail: 'policy + image' },
    { label: '5 JOINED', detail: 'operational' },
  ]
  return (
    <StepShell title="CAPWAP JOIN PROCESS" playback={playback} legend={joinStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="CAPWAP join process from discovery to joined operational state">
        <Note x={460} y={24} text="DISCOVER, SECURE, JOIN, DOWNLOAD, OPERATE" color="#94a3b8" size={9.2} />
        <Device x={50} y={105} w={175} h={100} title="LWAP" sub="starting" color="#38bdf8" active />
        <Device x={695} y={105} w={175} h={100} title="WLC" sub="controller" color="#f59e0b" active={s >= 1} />
        <LinkLine x1={225} y1={155} x2={695} y2={155} color="#f59e0b" active={s >= 1} />
        {s >= 1 && <Packet point={{ x: 460, y: 150 }} color="#f59e0b" label="UDP 5246" />}
        {steps.map((step, index) => (
          <g key={step.label}>
            <Badge x={55 + index * 170} y={255} text={step.label} color={index <= s ? '#34d399' : '#64748b'} active={index <= s} w={160} />
            <Note x={135 + index * 170} y={305} text={step.detail} color={index <= s ? '#cbd5e1' : '#475569'} size={8.8} />
            {index < steps.length - 1 && (
              <SvgText x={215 + index * 170} y={268} color="#64748b" size={13} bold>
                ›
              </SvgText>
            )}
          </g>
        ))}
        <Panel
          x={55}
          y={345}
          w={810}
          h={60}
          title={s >= 4 ? "OPERATIONAL" : "JOIN STATE"}
          lines={[
            s >= 4 ? 'The AP now serves WLANs using configuration from the WLC.' : 'Join validates that the AP and WLC can work together before policy is applied.',
            'Exact messages and state names vary by controller platform and release.',
          ]}
          color={s >= 4 ? '#34d399' : '#38bdf8'}
          active
          size={8.8}
        />
      </svg>
    </StepShell>
  )
}

const channelStages = [
  'CAPWAP control uses UDP port 5246 and is protected with DTLS where supported.',
  'CAPWAP data uses UDP port 5247 for client traffic between AP and WLC.',
  'Data-channel encryption behavior depends on platform and configuration.',
  'In central switching, client traffic leaves the WLC toward the wired LAN.',
  'In local switching, client traffic can leave the AP locally instead.',
]

export function CapwapControlVsDataDiagram() {
  const playback = useStepPlayback(channelStages.length)
  const s = playback.stage
  return (
    <StepShell title="CAPWAP CONTROL vs DATA CHANNELS" playback={playback} legend={channelStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="CAPWAP control on UDP 5246 and data on UDP 5247 with central and local switching paths">
        <Note x={460} y={24} text="CONTROL AND DATA ARE DIFFERENT PATHS" color="#94a3b8" size={9.3} />
        <Device x={30} y={140} w={130} h={95} title="CLIENT" sub="802.11 association" color="#94a3b8" active />
        <Device x={225} y={135} w={165} h={105} title="LWAP" sub="CAPWAP endpoint" color="#38bdf8" active />
        <Device x={555} y={135} w={165} h={105} title="WLC" sub="CAPWAP endpoint" color="#f59e0b" active={s >= 1} />
        <Device x={790} y={145} w={110} h={85} title="CORE" sub="wired LAN" color="#34d399" active={s >= 3} />
        <LinkLine x1={160} y1={185} x2={225} y2={185} color="#38bdf8" active />
        <LinkLine x1={390} y1={165} x2={555} y2={165} color="#f59e0b" active={s >= 0} />
        <LinkLine x1={390} y1={215} x2={555} y2={215} color="#34d399" active={s >= 1} />
        <LinkLine x1={720} y1={185} x2={790} y2={185} color="#34d399" active={s >= 3} />
        {s >= 0 && <Packet point={{ x: 470, y: 160 }} color="#f59e0b" label="5246 CTRL" />}
        {s >= 1 && <Packet point={{ x: 470, y: 220 }} color="#34d399" label="5247 DATA" />}
        {s >= 3 && <Packet point={{ x: 755, y: 180 }} color="#34d399" label="LAN" />}
        <Badge x={225} y={285} text="DTLS PROTECTS CONTROL" color="#f59e0b" active={s >= 0} w={250} />
        <Badge x={535} y={285} text="DATA ENCRYPTION VARIES" color="#fb7185" active={s >= 2} w={240} />
        {s >= 4 && <Badge x={200} y={330} text="LOCAL SWITCHING: EXIT AT AP" color="#34d399" active w={290} />}
        <Panel
          x={55}
          y={365}
          w={810}
          h={45}
          title="SPLIT-MAC CONCEPT"
          lines={['AP handles real-time 802.11; WLC handles control and management. Data path depends on switching mode.']}
          color="#38bdf8"
          active
          size={8.8}
        />
      </svg>
    </StepShell>
  )
}

const localModeStages = [
  'Local mode هو الوضع الطبيعي لتقديم خدمة العملاء في نشر مركزي.',
  'الـ AP يبث SSID ويستقبل العملاء على القنوات المخططة.',
  'حركة العميل تمر عبر الـ AP والـ WLC إلى الشبكة السلكية.',
  'الـ AP يستطيع أداء بعض وظائف المراقبة بجانب خدمة العملاء.',
  'هذا الوضع شائع في المكاتب والحرم الجامعي مع WLC مركزي.',
]

export function LocalModeApDiagram() {
  const playback = useStepPlayback(localModeStages.length)
  const s = playback.stage
  return (
    <StepShell title="LOCAL MODE AP" playback={playback} legend={localModeStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Local mode AP serving clients and forwarding traffic through the WLC">
        <Note x={460} y={24} text="NORMAL CLIENT-SERVING MODE IN CENTRALIZED DEPLOYMENTS" color="#94a3b8" size={8.8} />
        <Device x={35} y={120} w={130} h={95} title="CLIENTS" sub="SSID: CORP" color="#94a3b8" active={s >= 1} />
        <Device x={245} y={120} w={190} h={110} title="AP - LOCAL MODE" sub="client access + monitoring" color="#38bdf8" active={s >= 0} />
        <Device x={515} y={135} w={145} h={95} title="SWITCH" sub="PoE / VLAN" color="#a78bfa" active={s >= 2} />
        <Device x={740} y={130} w={150} h={105} title="WLC" sub="central policy" color="#f59e0b" active={s >= 2} />
        <LinkLine x1={165} y1={165} x2={245} y2={165} color="#38bdf8" active={s >= 1} />
        <LinkLine x1={435} y1={175} x2={515} y2={175} color="#34d399" active={s >= 2} />
        <LinkLine x1={660} y1={180} x2={740} y2={180} color="#34d399" active={s >= 2} />
        {s >= 1 && <Packet point={{ x: 205, y: 160 }} color="#38bdf8" label="802.11" />}
        {s >= 2 && <Packet point={{ x: 700, y: 175 }} color="#34d399" label="CAPWAP" />}
        <Badge x={250} y={265} text="SERVES CLIENTS" color="#34d399" active={s >= 1} w={180} />
        <Badge x={455} y={265} text="OFF-CHANNEL SCAN" color="#a78bfa" active={s >= 3} w={220} />
        <Panel
          x={55}
          y={360}
          w={810}
          h={50}
          title={s >= 4 ? "COMMON ENTERPRISE MODE" : "LOCAL MODE BEHAVIOR"}
          lines={[s >= 4 ? 'Use Local mode when APs are connected to a controller-managed campus LAN.' : 'The AP is actively associated with clients while still supporting monitoring functions where configured.']}
          color={s >= 4 ? '#34d399' : '#38bdf8'}
          active
          size={8.8}
        />
      </svg>
    </StepShell>
  )
}

const flexStages = [
  'FlexConnect يُستخدم غالباً في فروع بعيدة عن الـ WLC.',
  'في central switching تمر حركة العميل عبر CAPWAP إلى الـ WLC.',
  'في local switching تخرج حركة العميل من الـ AP إلى المفتاح المحلي.',
  'الـ WLC يبقى مسؤولاً عن السياسة والتكوين عند توفر الاتصال.',
  'عند فقدان WLC يمكن استمرار خدمات محلية معينة حسب التكوين والمنصة.',
]

export function FlexConnectSwitchingDiagram() {
  const playback = useStepPlayback(flexStages.length)
  const s = playback.stage
  const central = s <= 1
  return (
    <StepShell title="FLEXCONNECT LOCAL vs CENTRAL SWITCHING" playback={playback} legend={flexStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="FlexConnect local switching compared with centralized CAPWAP data forwarding">
        <Note x={460} y={24} text="SAME AP MODE, DIFFERENT CLIENT DATA PATH" color="#94a3b8" size={9.1} />
        <g opacity={central ? 1 : 0.4}>
          <rect x={45} y={70} width={385} height={260} rx="12" fill="#0b1224" stroke="#f59e0b" strokeWidth="2" />
          <SvgText x={237} y={98} color="#f59e0b" size={10} bold>CENTRAL SWITCHING</SvgText>
          <Device x={70} y={130} w={95} h={75} title="CLIENT" sub="Wi-Fi" color="#94a3b8" active={central} />
          <Device x={200} y={125} w={120} h={85} title="FLEX AP" sub="remote site" color="#38bdf8" active={central} />
          <Device x={70} y={250} w={110} h={55} title="WLC" sub="data path" color="#f59e0b" active={central} />
          <LinkLine x1={165} y1={165} x2={200} y2={165} color="#38bdf8" active={central} />
          <LinkLine x1={260} y1={210} x2={125} y2={250} color="#34d399" active={central} />
          {central && <Packet point={{ x: 185, y: 225 }} color="#34d399" label="DATA" />}
        </g>
        <g opacity={!central ? 1 : 0.4}>
          <rect x={490} y={70} width={385} height={260} rx="12" fill="#0b1224" stroke="#34d399" strokeWidth="2" />
          <SvgText x={682} y={98} color="#34d399" size={10} bold>LOCAL SWITCHING</SvgText>
          <Device x={515} y={130} w={95} h={75} title="CLIENT" sub="Wi-Fi" color="#94a3b8" active={!central} />
          <Device x={645} y={125} w={120} h={85} title="FLEX AP" sub="local breakout" color="#38bdf8" active={!central} />
          <Device x={765} y={250} w={90} h={55} title="LAN" sub="local" color="#34d399" active={!central} />
          <LinkLine x1={610} y1={165} x2={645} y2={165} color="#38bdf8" active={!central} />
          <LinkLine x1={705} y1={210} x2={790} y2={250} color="#34d399" active={!central} />
          {!central && <Packet point={{ x: 750, y: 225 }} color="#34d399" label="DATA" />}
        </g>
        <Badge x={120} y={345} text="WLC CONNECTIVITY MATTERS" color="#f59e0b" active={central} w={260} />
        <Badge x={560} y={345} text="LOCAL SERVICES MAY CONTINUE" color="#34d399" active={s >= 4} w={300} />
        <Panel
          x={55}
          y={375}
          w={810}
          h={35}
          title="CCNA VIEW"
          lines={['Local switching depends on configuration, VLAN design, and platform support.']}
          color="#38bdf8"
          active
          size={8.6}
        />
      </svg>
    </StepShell>
  )
}

const monitorSnifferStages = [
  'Monitor mode يراقب البيئة اللاسلكية ولا يقدّم خدمة عملاء عادةً.',
  'Sniffer mode يلتقط إطارات على قناة محددة للتحليل.',
  'Monitor يركّز على RF والكشف والتحليلات الأمنية.',
  'Sniffer يرسل الإطارات إلى نظام تحليل مثل WLC أو أداة packet analysis.',
  'الوضعان مخصصان للمراقبة وليسا بديلاً عن AP خدمة العملاء.',
]

export function MonitorVsSnifferDiagram() {
  const playback = useStepPlayback(monitorSnifferStages.length)
  const s = playback.stage
  return (
    <StepShell title="MONITOR MODE vs SNIFFER MODE" playback={playback} legend={monitorSnifferStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Monitor mode versus sniffer mode access points">
        <Note x={460} y={24} text="MONITORING MODES DO NOT NORMALLY SERVE CLIENTS" color="#94a3b8" size={8.9} />
        <g opacity={s <= 2 ? 1 : 0.4}>
          <rect x={45} y={70} width={385} height={260} rx="12" fill="#0b1224" stroke="#a78bfa" strokeWidth="2" />
          <SvgText x={237} y={98} color="#a78bfa" size={10} bold>MONITOR MODE</SvgText>
          <Device x={180} y={140} w={130} h={95} title="AP - MONITOR" sub="RF scanning" color="#a78bfa" active={s <= 2} />
          <SvgText x={245} y={275} color="#fb7185" size={9} bold>NO CLIENT SSID</SvgText>
          <Note x={245} y={300} text="channel / security monitoring" color="#94a3b8" size={8.8} />
        </g>
        <g opacity={s >= 1 ? 1 : 0.4}>
          <rect x={490} y={70} width={385} height={260} rx="12" fill="#0b1224" stroke="#38bdf8" strokeWidth="2" />
          <SvgText x={682} y={98} color="#38bdf8" size={10} bold>SNIFFER MODE</SvgText>
          <Device x={520} y={140} w={130} h={95} title="AP - SNIFFER" sub="capture on channel" color="#38bdf8" active={s >= 1} />
          <Device x={735} y={145} w={120} h={85} title="ANALYZER" sub="packet capture" color="#34d399" active={s >= 3} />
          <LinkLine x1={650} y1={185} x2={735} y2={185} color="#34d399" active={s >= 3} />
          {s >= 3 && <Packet point={{ x: 695, y: 180 }} color="#34d399" label="CAPTURE" />}
        </g>
        <Panel
          x={55}
          y={355}
          w={810}
          h={55}
          title={s >= 4 ? "USAGE" : "DIFFERENCE"}
          lines={[s >= 4 ? 'Use dedicated APs for monitoring or capture; use Local/FlexConnect modes for client access.' : 'Monitor watches the RF environment; Sniffer collects frames for deeper packet analysis.']}
          color={s >= 4 ? '#34d399' : '#38bdf8'}
          active
          size={8.9}
        />
      </svg>
    </StepShell>
  )
}

const rogueStages = [
  'Rogue Detector يراقب الشبكة اللاسلكية بحثاً عن APs غير مصرح بها.',
  'السويتش السلكي يرى عناوين MAC على المنافذ.',
  'المراقبة اللاسلكية ترى APs وبث SSID.',
  'النظام يربط معلومات الشبكة السلكية واللاسلكية لتحديد الـ rogue.',
  'الهدف كشف ومساعدة تحديد مصدر التهديد، وليس تقديم خدمة عملاء.',
]

export function RogueDetectorModeDiagram() {
  const playback = useStepPlayback(rogueStages.length)
  const s = playback.stage
  return (
    <StepShell title="ROGUE DETECTOR MODE" playback={playback} legend={rogueStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Rogue detector mode correlating wired and wireless information to identify rogue access points">
        <Note x={460} y={24} text="CORRELATE WIRED MACs AND WIRELESS RF OBSERVATIONS" color="#94a3b8" size={8.8} />
        <Device x={55} y={130} w={180} h={100} title="ROGUE DETECTOR AP" sub="wireless monitoring" color="#fb7185" active={s >= 0} />
        <Device x={330} y={130} w={170} h={100} title="ACCESS SWITCH" sub="wired MAC table" color="#a78bfa" active={s >= 1} />
        <Device x={600} y={130} w={220} h={100} title="CORRELATION ENGINE" sub="compare wired + wireless" color="#f59e0b" active={s >= 3} />
        <Device x={600} y={275} w={220} h={80} title="ROGUE AP FOUND" sub="unauthorized device" color="#fb7185" active={s >= 4} />
        <LinkLine x1={235} y1={180} x2={330} y2={180} color="#f59e0b" active={s >= 2} />
        <LinkLine x1={500} y1={180} x2={600} y2={180} color="#f59e0b" active={s >= 3} />
        <LinkLine x1={710} y1={230} x2={710} y2={275} color="#fb7185" active={s >= 4} />
        <Badge x={70} y={270} text="RF: SSID / BSSID SEEN" color="#fb7185" active={s >= 2} w={220} />
        <Badge x={335} y={270} text="WIRED: MAC ON PORT" color="#a78bfa" active={s >= 1} w={210} />
        {s >= 4 && <CheckMark x={835} y={315} color="#34d399" />}
        <Panel
          x={55}
          y={370}
          w={810}
          h={40}
          title="MONITORING ROLE"
          lines={['Rogue Detector is a security monitoring function, not a normal client-access mode.']}
          color="#38bdf8"
          active
          size={8.8}
        />
      </svg>
    </StepShell>
  )
}

const bridgeStages = [
  'Bridge mode يربط شبكتين سلكيتين عبر رابط لاسلكي.',
  'مثال point-to-point: مبنيان بينهما APs في وضع bridge.',
  'حركة من LAN الأيسر تعبر الرابط اللاسلكي إلى LAN الأيمن.',
  'بعض المنصات تدعم point-to-multipoint حسب الجهاز والبرنامج.',
  'الوضع مخصص للربط وليس لتقديم خدمة عملاء عادية عادةً.',
]

export function WirelessBridgeModeDiagram() {
  const playback = useStepPlayback(bridgeStages.length)
  const s = playback.stage
  return (
    <StepShell title="WIRELESS BRIDGE MODE" playback={playback} legend={bridgeStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Wireless bridge mode connecting two wired LANs across a point-to-point radio link">
        <Note x={460} y={24} text="WIRELESS LINK EXTENDS A WIRELESS DOMAIN BETWEEN LANs" color="#94a3b8" size={8.8} />
        <Device x={40} y={140} w={150} h={95} title="LAN A" sub="building A" color="#34d399" active />
        <Device x={235} y={130} w={165} h={110} title="BRIDGE AP A" sub="root bridge" color="#38bdf8" active={s >= 1} />
        <Device x={520} y={130} w={165} h={110} title="BRIDGE AP B" sub="non-root bridge" color="#38bdf8" active={s >= 1} />
        <Device x={735} y={140} w={150} h={95} title="LAN B" sub="building B" color="#34d399" active={s >= 2} />
        <LinkLine x1={190} y1={185} x2={235} y2={185} color="#34d399" active />
        <LinkLine x1={400} y1={185} x2={520} y2={185} color="#f59e0b" active={s >= 1} />
        <LinkLine x1={685} y1={185} x2={735} y2={185} color="#34d399" active={s >= 2} />
        {s >= 2 && <Packet point={{ x: 460, y: 180 }} color="#34d399" label="BRIDGE LINK" />}
        <Badge x={260} y={285} text="POINT-TO-POINT EXAMPLE" color="#38bdf8" active={s >= 1} w={240} />
        <Badge x={535} y={285} text="P2MP: PLATFORM DEPENDENT" color="#fb7185" active={s >= 3} w={260} />
        <Panel
          x={55}
          y={360}
          w={810}
          h={50}
          title={s >= 4 ? "MODE PURPOSE" : "TRAFFIC FLOW"}
          lines={[s >= 4 ? 'Bridge mode connects networks; it is not the same as Local mode client access.' : 'Frames from LAN A cross the wireless bridge to LAN B at Layer 2.']}
          color={s >= 4 ? '#f59e0b' : '#34d399'}
          active
          size={8.8}
        />
      </svg>
    </StepShell>
  )
}

const apModeStages = [
  'LOCAL: يقدّم خدمة العملاء في الشبكة المركزية.',
  'FLEXCONNECT: يدعم local switching للفروع البعيدة.',
  'MONITOR: مراقبة RF ولا يقدّم خدمة عملاء عادةً.',
  'SNIFFER: التقاط إطارات على قناة محددة للتحليل.',
  'ROGUE DETECTOR: يكشف APs غير المصرح بها.',
  'BRIDGE: يربط شبكات عبر رابط لاسلكي.',
  'SE-CONNECT: تحليل طيف على منصات Cisco مدعومة.',
]

export function ApModesComparisonDiagram() {
  const playback = useStepPlayback(apModeStages.length)
  const s = playback.stage
  const widths = [140, 120, 170, 380]
  const rows = [
    ['LOCAL', 'yes', 'via WLC usually', 'normal client access + monitoring'],
    ['FLEXCONNECT', 'yes', 'local or central', 'remote sites, local switching'],
    ['MONITOR', 'no', 'n/a', 'RF monitoring and security'],
    ['SNIFFER', 'no', 'capture', 'packet capture to analyzer'],
    ['ROGUE DETECTOR', 'no', 'n/a', 'rogue AP detection'],
    ['BRIDGE', 'no', 'wireless link', 'connect wired LANs'],
    ['SE-CONNECT', 'no', 'n/a', 'spectrum analysis on supported APs'],
  ]
  return (
    <StepShell title="AP MODES COMPARISON" playback={playback} legend={apModeStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Comparison table of Cisco access point modes and their roles">
        <Note x={460} y={24} text="MODE AVAILABILITY VARIES BY AP, CONTROLLER, AND SOFTWARE" color="#94a3b8" size={8.7} />
        <rect x={55} y={60} width={810} height={300} rx="12" fill="#0b1224" stroke="#334155" strokeWidth="1.4" />
        <TableRow x={70} y={90} values={['MODE', 'CLIENTS?', 'DATA PATH', 'PRIMARY PURPOSE']} widths={widths} color="#f59e0b" size={8.6} />
        <line x1={70} y1={103} x2={850} y2={103} stroke="#334155" />
        {rows.map((row, index) => (
          <g key={row[0]}>
            <TableRow
              x={70}
              y={133 + index * 31}
              values={row}
              widths={widths}
              color={index === s ? '#34d399' : '#38bdf8'}
              active={index === s}
              size={8.3}
            />
            {index === s && <CheckMark x={845} y={130 + index * 31} color="#34d399" />}
          </g>
        ))}
        <Panel
          x={55}
          y={370}
          w={810}
          h={40}
          title="EXAM TIP"
          lines={['Match the mode to the job: serving clients, local switching, monitoring, capture, detection, bridging, or spectrum.']}
          color="#38bdf8"
          active
          size={8.8}
        />
      </svg>
    </StepShell>
  )
}
