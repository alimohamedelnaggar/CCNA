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

function Note({ x, y, text, color = '#94a3b8', size = 9 }: { x: number; y: number; text: string; color?: string; size?: number }) {
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
      <rect x={x} y={y} width={w} height={h} rx="11" fill="#0b1224" stroke={color} strokeWidth={active ? 2.3 : 1.2} />
      <SvgText x={x + w / 2} y={y + 24} color={color} size={10.5} bold>
        {title}
      </SvgText>
      <SvgText x={x + w / 2} y={y + 43} color="#cbd5e1" size={8.8}>
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
  w = 140,
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
      <rect x={x} y={y} width={w} height={25} rx="7" fill="#0a1730" stroke={color} strokeWidth={active ? 1.9 : 1} />
      <SvgText x={x + w / 2} y={y + 17} color={color} size={8.5} bold>
        {text}
      </SvgText>
    </g>
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
  active = true,
  size = 8.7,
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
    <g opacity={active ? 1 : 0.5}>
      <rect x={x} y={y} width={w} height={h} rx="11" fill="#0b1224" stroke={color} strokeWidth={active ? 1.9 : 1} />
      <SvgText x={x + 14} y={y + 19} color={color} size={9.3} bold anchor="start">
        {title}
      </SvgText>
      {lines.map((line, index) => (
        <SvgText key={index} x={x + 14} y={y + 36 + index * 14} color="#cbd5e1" size={size} anchor="start">
          {line}
        </SvgText>
      ))}
    </g>
  )
}

function Port({ x, y, label, color = '#38bdf8', active = true }: { x: number; y: number; label: string; color?: string; active?: boolean }) {
  return (
    <g opacity={active ? 1 : 0.4}>
      <rect x={x} y={y} width={54} height={22} rx="5" fill="#081426" stroke={color} strokeWidth={active ? 1.8 : 1} />
      <SvgText x={x + 27} y={y + 15} color={color} size={7.8} bold>
        {label}
      </SvgText>
    </g>
  )
}

function CrossMark({ x, y, color = '#fb7185' }: { x: number; y: number; color?: string }) {
  return (
    <g stroke={color} strokeWidth="2.7" strokeLinecap="round">
      <line x1={x - 8} y1={y - 8} x2={x + 8} y2={y + 8} />
      <line x1={x + 8} y1={y - 8} x2={x - 8} y2={y + 8} />
    </g>
  )
}



const enterpriseStages = [
  'العملاء اللاسلكيون يرتبطون بـ APs عبر RF، لكن الـ APs نفسها متصلة بكابلات Ethernet.',
  'كل AP يتصل بمنفذ على access switch؛ السويتش يوفر Layer 2 connectivity وربما PoE.',
  'Access switches تتصل بـ distribution switch عبر uplinks.',
  'الـ WLC يتصل بشبكة الـ distribution ليصل إليه CAPWAP وحركة الإدارة.',
  'فرّق بين كابل Ethernet فعلي، وSSID/VLAN منطقي، وارتباط العميل اللاسلكي.',
]

export function EnterpriseWlanPhysicalTopologyDiagram() {
  const playback = useStepPlayback(enterpriseStages.length)
  const s = playback.stage
  return (
    <StepShell title="ENTERPRISE WLAN PHYSICAL TOPOLOGY" playback={playback} legend={enterpriseStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Enterprise WLAN physical topology with clients, access points, access switches, distribution switch, WLC, and core network">
        <Note x={460} y={24} text="RF ASSOCIATION IS NOT THE SAME AS THE AP ETHERNET UPLINK" color="#94a3b8" size={8.8} />
        <Device x={25} y={115} w={125} h={95} title="CLIENTS" sub="laptop / phone" color="#94a3b8" active />
        <Device x={205} y={70} w={145} h={85} title="AP 1" sub="Ethernet uplink" color="#38bdf8" active={s >= 0} />
        <Device x={205} y={235} w={145} h={85} title="AP 2" sub="Ethernet uplink" color="#38bdf8" active={s >= 0} />
        <Device x={420} y={120} w={150} h={95} title="ACCESS SW" sub="PoE + VLANs" color="#a78bfa" active={s >= 1} />
        <Device x={635} y={80} w={160} h={90} title="DISTRIBUTION" sub="uplinks / routing" color="#34d399" active={s >= 2} />
        <Device x={635} y={265} w={160} h={90} title="WLC" sub="CAPWAP + mgmt" color="#f59e0b" active={s >= 3} />
        <Device x={820} y={115} w={80} h={105} title="CORE" sub="services" color="#34d399" active={s >= 2} />
        <LinkLine x1={150} y1={145} x2={205} y2={112} color="#38bdf8" active={s >= 0} />
        <LinkLine x1={150} y1={180} x2={205} y2={275} color="#38bdf8" active={s >= 0} />
        <LinkLine x1={350} y1={112} x2={420} y2={160} color="#38bdf8" active={s >= 1} />
        <LinkLine x1={350} y1={275} x2={420} y2={195} color="#38bdf8" active={s >= 1} />
        <LinkLine x1={570} y1={165} x2={635} y2={125} color="#34d399" active={s >= 2} />
        <LinkLine x1={570} y1={190} x2={635} y2={305} color="#f59e0b" active={s >= 3} />
        <LinkLine x1={795} y1={125} x2={820} y2={160} color="#34d399" active={s >= 2} />
        {s >= 0 && <Packet point={{ x: 180, y: 128 }} color="#38bdf8" label="RF" />}
        {s >= 1 && <Packet point={{ x: 390, y: 140 }} color="#34d399" label="ETH" />}
        {s >= 3 && <Packet point={{ x: 605, y: 250 }} color="#f59e0b" label="CAPWAP" />}
        <Badge x={205} y={335} text="COPPER ETHERNET CABLE" color="#38bdf8" active={s >= 1} w={240} />
        <Badge x={635} y={370} text="LOGICAL SSID / VLAN / TUNNEL" color="#a78bfa" active={s >= 4} w={280} />
        <Panel
          x={55}
          y={385}
          w={810}
          h={28}
          title={s >= 4 ? 'KEEP THE LAYERS SEPARATE' : 'PHYSICAL BUILDING BLOCKS'}
          lines={[s >= 4 ? 'Cable, VLAN, SSID association, and CAPWAP tunnel are different concepts.' : 'Clients, APs, access switches, distribution, WLC, and core form the enterprise WLAN path.']}
          color={s >= 4 ? '#fb7185' : '#38bdf8'}
          size={8.1}
        />
      </svg>
    </StepShell>
  )
}

const apConnectionStages = [
  'الـ AP فيه Ethernet interface غالباً يُسمى Gi0 أو Eth0 حسب الطراز.',
  'كابل copper Ethernet يربط الـ AP بمنفذ على access switch.',
  'السويتش يوفر اتصال IP، وممكن يوفر PoE لو المنفذ والسويتش يدعمان ذلك.',
  'الـ AP يحصل على IP ويصل إلى الـ WLC لاكتشافه والانضمام.',
  'حركة الإدارة وحركة العملاء قد تمر على نفس الكابل أو عبر VLANs مختلفة.',
]

export function ApToAccessSwitchConnectionDiagram() {
  const playback = useStepPlayback(apConnectionStages.length)
  const s = playback.stage
  return (
    <StepShell title="AP TO ACCESS SWITCH CONNECTION" playback={playback} legend={apConnectionStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Access point Ethernet interface connected by copper cable to an access switch port with PoE and IP connectivity">
        <Note x={460} y={24} text="ONE ETHERNET UPLINK CAN CARRY DATA AND POWER" color="#94a3b8" size={9} />
        <Device x={55} y={115} w={240} h={165} title="ACCESS POINT" sub="Ethernet interface: Gi0 / Eth0" color="#38bdf8" active />
        <Port x={105} y={225} label="ETH0" color="#38bdf8" active={s >= 0} />
        <Device x={620} y={110} w={245} h={175} title="ACCESS SWITCH" sub="port Gi0/1 + PoE capable" color="#a78bfa" active={s >= 1} />
        <Port x={670} y={220} label="Gi0/1" color="#a78bfa" active={s >= 1} />
        <LinkLine x1={159} y1={236} x2={670} y2={231} color="#38bdf8" active={s >= 1} />
        <LinkLine x1={159} y1={248} x2={670} y2={243} color="#f59e0b" active={s >= 2} />
        {s >= 1 && <Packet point={{ x: 420, y: 225 }} color="#38bdf8" label="DATA" />}
        {s >= 2 && <Packet point={{ x: 420, y: 255 }} color="#f59e0b" label="PWR" />}
        <Badge x={80} y={310} text="PD: POWERED DEVICE" color="#f59e0b" active={s >= 2} w={230} />
        <Badge x={640} y={310} text="PSE: POWER SOURCE" color="#f59e0b" active={s >= 2} w={230} />
        <Badge x={250} y={345} text="DHCP / IP ADDRESS" color="#34d399" active={s >= 3} w={210} />
        <Badge x={500} y={345} text="DISCOVER WLC" color="#34d399" active={s >= 3} w={210} />
        <Panel
          x={55}
          y={380}
          w={810}
          h={30}
          title={s >= 4 ? 'SHARED PHYSICAL LINK, DIFFERENT LOGICAL FLOWS' : 'TYPICAL ENTERPRISE AP CONNECTION'}
          lines={[s >= 4 ? 'Management and client traffic can be separated by VLANs over the same Ethernet cable.' : 'An AP usually plugs into an access switch; the switch provides network connectivity and, where supported, power.']}
          color={s >= 4 ? '#a78bfa' : '#38bdf8'}
          size={8.1}
        />
      </svg>
    </StepShell>
  )
}

const poeDeliveryStages = [
  'PSE يinject DC power على أزواج من كابل Ethernet.',
  'نفس الكابل يحمل بيانات Ethernet وقدرة كهربائية في نفس الوقت.',
  'الـ PD وهو الـ AP يتفاوض على مستوى القدرة المطلوب.',
  'فقد القدرة في الكابل يعني أن PSE output أكبر من المتاح عند الـ AP.',
  'لو الـ switch مش قادر يوفر كفاية، الـ AP قد لا يقلع أو يعمل بوظائف محدودة.',
]

export function PoePowerDeliveryDiagram() {
  const playback = useStepPlayback(poeDeliveryStages.length)
  const s = playback.stage
  return (
    <StepShell title="POE POWER DELIVERY" playback={playback} legend={poeDeliveryStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="PoE power delivery from a PSE switch over Ethernet cable to a powered device access point">
        <Note x={460} y={24} text="POWER AND DATA SHARE THE SAME ETHERNET CABLE" color="#94a3b8" size={8.9} />
        <Device x={55} y={125} w={245} h={165} title="PSE SWITCH" sub="PoE power source" color="#f59e0b" active />
        <Device x={620} y={125} w={245} h={165} title="PD ACCESS POINT" sub="powered device" color="#38bdf8" active />
        <LinkLine x1={300} y1={190} x2={620} y2={190} color="#f59e0b" active={s >= 0} />
        <LinkLine x1={300} y1={240} x2={620} y2={240} color="#38bdf8" active={s >= 1} />
        {s >= 0 && <Packet point={{ x: 460, y: 185 }} color="#f59e0b" label="DC PWR" />}
        {s >= 1 && <Packet point={{ x: 460, y: 245 }} color="#38bdf8" label="DATA" />}
        <Badge x={80} y={315} text="802.3af / at / bt" color="#f59e0b" active={s >= 2} w={210} />
        <Badge x={325} y={315} text="CABLE LOSS" color="#fb7185" active={s >= 3} w={190} />
        <Badge x={650} y={315} text="POWER NEGOTIATION" color="#34d399" active={s >= 2} w={210} />
        <Panel
          x={55}
          y={360}
          w={810}
          h={50}
          title={s >= 4 ? "WHEN POWER IS INSUFFICIENT" : "PSE OUTPUT IS NOT PD AVAILABLE POWER"}
          lines={[
            s >= 4 ? 'The AP may not boot, may reboot, or may disable radios/features depending on the platform.' : 'PSE output is specified at the source; cable loss reduces the power delivered to the PD.',
            'Actual available power depends on standard, equipment implementation, cable, and budget.',
          ]}
          color={s >= 4 ? '#fb7185' : '#f59e0b'}
          size={8.5}
        />
      </svg>
    </StepShell>
  )
}

const poeSourceStages = [
  'PoE switch يوفر بيانات Ethernet وقدرة من نفس الجهاز.',
  'PoE injector يضيف قدرة إلى كابل قادم من سويتش غير PoE.',
  ' Injector يُوضع بين السويتش والـ AP.',
  'الـ injector لا يوفر switching؛ السويتش يظل مسؤول عن البيانات.',
  'لازم يتوافق standard والقدرة مع احتياجات الـ AP.',
]

export function PoeInjectorVsPoeSwitchDiagram() {
  const playback = useStepPlayback(poeSourceStages.length)
  const s = playback.stage
  const left = s <= 2
  return (
    <StepShell title="POE INJECTOR vs POE SWITCH" playback={playback} legend={poeSourceStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Comparison of a PoE switch and a PoE injector powering an access point">
        <Note x={460} y={24} text="BOTH SOURCES CAN POWER AN AP; THE DATA PATH IS DIFFERENT" color="#94a3b8" size={8.8} />
        <g opacity={left ? 1 : 0.42}>
          <rect x={45} y={70} width={385} height={260} rx="12" fill="#0b1224" stroke="#f59e0b" strokeWidth="2" />
          <SvgText x={237} y={98} color="#f59e0b" size={10} bold>POE SWITCH</SvgText>
          <Device x={80} y={135} w={150} h={95} title="POE SWITCH" sub="data + power" color="#f59e0b" active={left} />
          <Device x={285} y={135} w={120} h={95} title="AP" sub="PD" color="#38bdf8" active={left} />
          <LinkLine x1={230} y1={182} x2={285} y2={182} color="#f59e0b" active={left} />
          {left && <Packet point={{ x: 258, y: 178 }} color="#f59e0b" label="PWR+DATA" />}
          <Note x={237} y={275} text="single device provides both functions" color="#cbd5e1" size={8.6} />
        </g>
        <g opacity={!left ? 1 : 0.42}>
          <rect x={490} y={70} width={385} height={260} rx="12" fill="#0b1224" stroke="#a78bfa" strokeWidth="2" />
          <SvgText x={682} y={98} color="#a78bfa" size={10} bold>POE INJECTOR</SvgText>
          <Device x={510} y={135} w={110} h={95} title="SWITCH" sub="data only" color="#a78bfa" active={!left} />
          <Device x={640} y={135} w={105} h={95} title="INJECTOR" sub="adds power" color="#f59e0b" active={!left} />
          <Device x={765} y={135} w={90} h={95} title="AP" sub="PD" color="#38bdf8" active={!left} />
          <LinkLine x1={620} y1={182} x2={640} y2={182} color="#38bdf8" active={!left} />
          <LinkLine x1={745} y1={196} x2={765} y2={196} color="#f59e0b" active={!left} />
          {!left && <Packet point={{ x: 755, y: 188 }} color="#f59e0b" label="PWR" />}
          <Note x={685} y={275} text="switch still handles Ethernet data" color="#cbd5e1" size={8.6} />
        </g>
        <Panel
          x={55}
          y={355}
          w={810}
          h={55}
          title={s >= 4 ? "COMPATIBILITY CHECK" : "WHERE POWER IS ADDED"}
          lines={[s >= 4 ? 'Match the injector or switch standard and available budget to the AP power requirement.' : 'A PoE switch is an all-in-one source; an injector inserts power on an existing Ethernet link.']}
          color={s >= 4 ? '#34d399' : '#38bdf8'}
          size={8.8}
        />
      </svg>
    </StepShell>
  )
}

const powerBudgetStages = [
  'السويتش له total PoE power budget محدد.',
  'كل منفذ يُخصّص power حسب class والتفاوض.',
  'مجموع استهلاك الـ APs لازم يبقى أقل من ميزانية السويتش.',
  'PSE output أعلى من المتاح عند الـ AP بسبب فقد الكابل.',
  'لو زوّدنا الأحمال، السويتش يرفض منفذ أو يوقف جهاز حسب السياسة.',
]

export function PoePowerBudgetDiagram() {
  const playback = useStepPlayback(powerBudgetStages.length)
  const s = playback.stage
  return (
    <StepShell title="POE POWER BUDGET" playback={playback} legend={powerBudgetStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="PoE power budget showing total switch capacity, per-port allocation, and AP power consumption">
        <Note x={460} y={24} text="TOTAL BUDGET, PER-PORT ALLOCATION, AND CABLE LOSS" color="#94a3b8" size={8.8} />
        <Device x={55} y={115} w={285} h={185} title="POE SWITCH" sub="370 W total budget" color="#f59e0b" active />
        <rect x={85} y={205} width={225} height={22} rx="5" fill="#081426" stroke="#334155" />
        <rect x={85} y={205} width={s >= 3 ? 200 : s >= 2 ? 165 : 110} height={22} rx="5" fill="#f59e0b" opacity="0.65" />
        <SvgText x={197} y={220} color="#0b1224" size={8.5} bold>{s >= 3 ? 'ALLOCATED' : 'AVAILABLE'}</SvgText>
        <Port x={90} y={160} label="Gi0/1 15.4W" color="#34d399" active={s >= 1} />
        <Port x={160} y={160} label="Gi0/2 30W" color="#34d399" active={s >= 1} />
        <Port x={230} y={160} label="Gi0/3 60W" color="#34d399" active={s >= 1} />
        <Device x={430} y={105} w={180} h={75} title="AP 1" sub="802.3af / 15.4 W" color="#38bdf8" active={s >= 1} />
        <Device x={430} y={200} w={180} h={75} title="AP 2" sub="802.3at / 30 W" color="#38bdf8" active={s >= 2} />
        <Device x={430} y={295} w={180} h={75} title="AP 3" sub="802.3bt / 60 W" color="#38bdf8" active={s >= 3} />
        <LinkLine x1={340} y1={175} x2={430} y2={142} color="#f59e0b" active={s >= 1} />
        <LinkLine x1={340} y1={185} x2={430} y2={235} color="#f59e0b" active={s >= 2} />
        <LinkLine x1={340} y1={195} x2={430} y2={330} color="#f59e0b" active={s >= 3} />
        <Badge x={660} y={125} text="PSE OUTPUT" color="#f59e0b" active w={190} />
        <Badge x={660} y={180} text="CABLE LOSS" color="#fb7185" active={s >= 3} w={190} />
        <Badge x={660} y={235} text="PD AVAILABLE" color="#34d399" active={s >= 3} w={190} />
        <Badge x={660} y={290} text="BUDGET EXCEEDED" color="#fb7185" active={s >= 4} w={190} />
        {s >= 4 && <CrossMark x={790} y={333} />}
        <Panel
          x={55}
          y={382}
          w={810}
          h={32}
          title="EXAM VIEW"
          lines={['Check per-port allocation, total switch capacity, standard support, and actual AP consumption.']}
          color="#38bdf8"
          size={8.2}
        />
      </svg>
    </StepShell>
  )
}

const wlcPhysicalStages = [
  'WLC له منافذ Ethernet فيزيائية للاتصال بالشبكة السلكية.',
  'uplink يربط الـ WLC بـ distribution أو core switch.',
  'منفذ أو VLAN للإدارة يسمح بوصول GUI/SSH/SNMP.',
  'الـ APs تصل إلى الـ WLC عبر IP network ومنطق CAPWAP.',
  'حركة عملاء central switching تمر عبر الـ WLC؛ روابط احتياطية مدعومة حسب المنصة.',
]

export function WlcPhysicalConnectivityDiagram() {
  const playback = useStepPlayback(wlcPhysicalStages.length)
  const s = playback.stage
  return (
    <StepShell title="WLC PHYSICAL CONNECTIVITY" playback={playback} legend={wlcPhysicalStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="WLC physical Ethernet ports connected to distribution, management network, APs, and core">
        <Note x={460} y={24} text="PHYSICAL PORT LAYOUT VARIES BY CONTROLLER GENERATION" color="#94a3b8" size={8.7} />
        <Device x={330} y={120} w={255} h={180} title="WLC" sub="multiple Ethernet ports" color="#f59e0b" active />
        <Port x={350} y={205} label="MGMT" color="#a78bfa" active={s >= 2} />
        <Port x={415} y={205} label="DATA1" color="#38bdf8" active={s >= 1} />
        <Port x={480} y={205} label="DATA2" color="#38bdf8" active={s >= 4} />
        <Port x={545} y={205} label="RED" color="#34d399" active={s >= 4} />
        <Device x={45} y={105} w={190} h={100} title="MGMT STATION" sub="GUI / SSH / SNMP" color="#a78bfa" active={s >= 2} />
        <Device x={45} y={250} w={190} h={100} title="ACCESS SW + APs" sub="CAPWAP endpoints" color="#38bdf8" active={s >= 3} />
        <Device x={700} y={100} w={170} h={100} title="DISTRIBUTION" sub="uplink VLANs" color="#34d399" active={s >= 1} />
        <Device x={700} y={250} w={170} h={100} title="CORE / LAN" sub="client destination" color="#34d399" active={s >= 4} />
        <LinkLine x1={235} y1={155} x2={350} y2={215} color="#a78bfa" active={s >= 2} />
        <LinkLine x1={235} y1={300} x2={350} y2={225} color="#f59e0b" active={s >= 3} />
        <LinkLine x1={585} y1={220} x2={700} y2={150} color="#34d399" active={s >= 1} />
        <LinkLine x1={585} y1={235} x2={700} y2={295} color="#34d399" active={s >= 4} />
        {s >= 2 && <Packet point={{ x: 292, y: 185 }} color="#a78bfa" label="MGMT" />}
        {s >= 3 && <Packet point={{ x: 292, y: 265 }} color="#f59e0b" label="5246/7" />}
        {s >= 4 && <Packet point={{ x: 645, y: 265 }} color="#34d399" label="DATA" />}
        <Panel
          x={55}
          y={375}
          w={810}
          h={38}
          title={s >= 4 ? "DO NOT GENERALIZE THE PORT LAYOUT" : "PHYSICAL VS FUNCTIONAL ROLE"}
          lines={[s >= 4 ? 'Some controllers use separate management ports; others use logical interfaces on shared uplinks.' : 'A physical port is a connector; its role is defined by controller configuration and network design.']}
          color={s >= 4 ? '#fb7185' : '#38bdf8'}
          size={8.4}
        />
      </svg>
    </StepShell>
  )
}

const wlcInterfaceStages = [
  'Physical port هو منفذ Ethernet فعلي على الجهاز.',
  'Logical interface هو Layer 3/VLAN mapping داخل الـ WLC.',
  'AireOS القديمة تستخدم Management وDynamic وService Port وAP Manager حسب الإصدار.',
  'Catalyst 9800 IOS XE يستخدم نموذج واجهات مختلف مثل VLAN/SVI وwireless management interface.',
  'ما تفترضش إن كل Controller فيه كل أنواع الواجهات دي.',
]

export function WlcPhysicalVsLogicalInterfacesDiagram() {
  const playback = useStepPlayback(wlcInterfaceStages.length)
  const s = playback.stage
  return (
    <StepShell title="WLC PHYSICAL vs LOGICAL INTERFACES" playback={playback} legend={wlcInterfaceStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="WLC physical ports mapped to logical management, dynamic, service port, and AP manager interfaces in legacy and modern platforms">
        <Note x={460} y={24} text="LEGACY AIREOS TERMS ARE NOT UNIVERSAL ON CATALYST 9800" color="#94a3b8" size={8.6} />
        <Device x={45} y={105} w={260} h={210} title="PHYSICAL PORTS" sub="actual Ethernet connectors" color="#38bdf8" active={s >= 0} />
        <Port x={75} y={175} label="ETH0" color="#38bdf8" active={s >= 0} />
        <Port x={145} y={175} label="ETH1" color="#38bdf8" active={s >= 0} />
        <Port x={215} y={175} label="ETH2" color="#38bdf8" active={s >= 0} />
        <Device x={380} y={105} w={280} h={210} title="LOGICAL INTERFACES" sub="Layer 3 / VLAN mapping" color="#a78bfa" active={s >= 1} />
        <Badge x={400} y={165} text="MANAGEMENT INTERFACE" color="#a78bfa" active={s >= 1} w={235} />
        <Badge x={400} y={205} text="DYNAMIC INTERFACE" color="#f59e0b" active={s >= 2} w={235} />
        <Badge x={400} y={245} text="SERVICE PORT" color="#34d399" active={s >= 2} w={235} />
        <Badge x={400} y={285} text="AP MANAGER (LEGACY)" color="#fb7185" active={s >= 2} w={235} />
        <Device x={735} y={105} w={150} h={210} title="PLATFORM MODEL" sub="AireOS / IOS XE" color="#f59e0b" active={s >= 3} />
        <LinkLine x1={305} y1={205} x2={380} y2={205} color="#38bdf8" active={s >= 0} />
        <LinkLine x1={660} y1={205} x2={735} y2={205} color="#a78bfa" active={s >= 3} />
        <Badge x={90} y={340} text="CABLE GOES HERE" color="#38bdf8" active={s >= 0} w={190} />
        <Badge x={410} y={340} text="IP / VLAN GOES HERE" color="#a78bfa" active={s >= 1} w={220} />
        {s >= 4 && <CrossMark x={840} y={345} color="#fb7185" />}
        <Panel
          x={55}
          y={375}
          w={810}
          h={38}
          title="CCNA-FRIENDLY SUMMARY"
          lines={['Use physical connectivity language for cables and ports; use logical interface language for IP/VLAN roles.']}
          color="#38bdf8"
          size={8.4}
        />
      </svg>
    </StepShell>
  )
}

const accessPortStages = [
  'Access port ينتمي لـ Data VLAN واحدة، مثال VLAN 10.',
  'إطارات الـ AP على الكابل تكون untagged.',
  'في تصميم بسيط، إدارة الـ AP وحركة العملاء ممكن يتشاركوا نفس VLAN.',
  'مناسب لموقع صغير أو WLAN واحد ومتطلبات بسيطة.',
  'تحقق بـ show interfaces GigabitEthernet0/1 switchport وshow vlan brief.',
]

export function ApAccessPortDiagram() {
  const playback = useStepPlayback(accessPortStages.length)
  const s = playback.stage
  return (
    <StepShell title="AP VIA ACCESS PORT" playback={playback} legend={accessPortStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Access point connected to a switch access port in VLAN 10 with untagged Ethernet frames">
        <Note x={460} y={24} text="ONE DATA VLAN, UNTAGGED FRAMES ON THE AP SEGMENT" color="#94a3b8" size={8.9} />
        <Device x={55} y={125} w={190} h={120} title="AP" sub="SSID: CORP" color="#38bdf8" active />
        <Device x={370} y={110} w={190} h={150} title="ACCESS SWITCH" sub="Gi0/1 access VLAN 10" color="#a78bfa" active={s >= 0} />
        <Port x={430} y={205} label="Gi0/1" color="#a78bfa" active={s >= 0} />
        <Device x={700} y={120} w={165} h={100} title="WLC / CORE" sub="VLAN 10 path" color="#f59e0b" active={s >= 2} />
        <LinkLine x1={245} y1={185} x2={370} y2={185} color="#38bdf8" active={s >= 1} />
        <LinkLine x1={560} y1={185} x2={700} y2={170} color="#34d399" active={s >= 2} />
        {s >= 1 && <Packet point={{ x: 310, y: 180 }} color="#38bdf8" label="UNTAGGED" />}
        <Badge x={60} y={280} text="AP IP: VLAN 10" color="#34d399" active={s >= 2} w={190} />
        <Badge x={385} y={280} text="ACCESS MODE" color="#a78bfa" active={s >= 0} w={190} />
        <Badge x={700} y={250} text="SIMPLE DESIGN" color="#34d399" active={s >= 3} w={165} />
        <Panel
          x={55}
          y={360}
          w={810}
          h={50}
          title={s >= 4 ? "VERIFY THE SWITCHPORT" : "WHEN ACCESS MODE IS SUITABLE"}
          lines={[s >= 4 ? 'Check mode, access VLAN, interface status, and VLAN existence in the switch database.' : 'Use access mode when the AP uplink only needs one VLAN for management and client traffic.']}
          color={s >= 4 ? '#f59e0b' : '#38bdf8'}
          size={8.6}
        />
      </svg>
    </StepShell>
  )
}

const trunkPortStages = [
  'Trunk port يحمل VLANs متعددة على نفس الرابط.',
  '802.1Q tag يحدد VLAN لكل إطار على uplink.',
  'Native VLAN غالباً تُرسل بدون tag؛ لازم تتطابق على الطرفين.',
  'Allowed VLAN list تتحكم في أي VLANs مسموح بمرورها.',
  'الـ AP والسويتش والـ WLC لازم يتفقوا على تصميم الـ VLAN.',
]

export function ApTrunkPortDiagram() {
  const playback = useStepPlayback(trunkPortStages.length)
  const s = playback.stage
  return (
    <StepShell title="AP VIA TRUNK PORT" playback={playback} legend={trunkPortStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Access point connected to a switch trunk port carrying VLAN 10, VLAN 20, and native VLAN 99 with 802.1Q tags">
        <Note x={460} y={24} text="802.1Q TAGS IDENTIFY MULTIPLE WLAN VLANS ON ONE UPLINK" color="#94a3b8" size={8.6} />
        <Device x={45} y={125} w={205} h={130} title="AP" sub="CORP + GUEST + MGMT" color="#38bdf8" active />
        <Device x={385} y={110} w={185} h={160} title="ACCESS SWITCH" sub="Gi0/1 trunk" color="#a78bfa" active={s >= 0} />
        <Port x={445} y={205} label="Gi0/1" color="#a78bfa" active={s >= 0} />
        <Device x={710} y={115} w={165} h={100} title="WLC / LAN" sub="VLAN 10,20,99" color="#f59e0b" active={s >= 4} />
        <LinkLine x1={250} y1={190} x2={385} y2={190} color="#38bdf8" active={s >= 0} />
        <LinkLine x1={570} y1={190} x2={710} y2={165} color="#34d399" active={s >= 4} />
        {s >= 1 && <Packet point={{ x: 320, y: 175 }} color="#f59e0b" label="TAG 10" />}
        {s >= 1 && <Packet point={{ x: 320, y: 220 }} color="#a78bfa" label="TAG 20" />}
        {s >= 2 && <Packet point={{ x: 320, y: 260 }} color="#34d399" label="NATIVE 99" />}
        <Badge x={45} y={285} text="ALLOWED: 10,20,99" color="#38bdf8" active={s >= 3} w={220} />
        <Badge x={390} y={295} text="NATIVE VLAN MUST MATCH" color="#fb7185" active={s >= 2} w={230} />
        <Panel
          x={55}
          y={365}
          w={810}
          h={45}
          title="NOT EVERY AP REQUIRES A TRUNK"
          lines={['Trunking depends on WLAN-to-VLAN mapping, AP capabilities, controller architecture, and switch design.']}
          color="#38bdf8"
          size={8.7}
        />
      </svg>
    </StepShell>
  )
}

const multiVlanStages = [
  'WLAN CORP يُقابل VLAN 10.',
  'WLAN GUEST يُقابل VLAN 20.',
  'إدارة AP أو network management ممكن تكون VLAN 99.',
  'كل الإطارات تمر على uplink فيزيائي واحد مع tags مختلفة.',
  'السويتش والـ WLC لازم يطبقوا نفس الـ mapping.',
]

export function MultipleWlanVlansAcrossApUplinkDiagram() {
  const playback = useStepPlayback(multiVlanStages.length)
  const s = playback.stage
  return (
    <StepShell title="MULTIPLE WLANs AND VLANs ACROSS AP UPLINK" playback={playback} legend={multiVlanStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Multiple WLANs mapped to VLAN 10, VLAN 20, and management VLAN 99 across one tagged AP uplink">
        <Note x={460} y={24} text="ONE PHYSICAL UPLINK, SEVERAL LOGICAL VLANS" color="#94a3b8" size={8.8} />
        <Device x={40} y={110} w={230} h={185} title="ACCESS POINT" sub="3 SSIDs / WLAN profiles" color="#38bdf8" active />
        <Badge x={60} y={165} text="SSID CORP" color="#34d399" active={s >= 0} w={190} />
        <Badge x={60} y={205} text="SSID GUEST" color="#a78bfa" active={s >= 1} w={190} />
        <Badge x={60} y={245} text="MGMT VLAN 99" color="#f59e0b" active={s >= 2} w={190} />
        <Device x={400} y={125} w={150} h={150} title="TRUNK" sub="802.1Q tags" color="#a78bfa" active={s >= 3} />
        <Device x={680} y={110} w={190} h={105} title="SWITCH" sub="allowed VLANs" color="#34d399" active={s >= 3} />
        <Device x={680} y={255} w={190} h={105} title="WLC" sub="WLAN mapping" color="#f59e0b" active={s >= 4} />
        <LinkLine x1={270} y1={200} x2={400} y2={200} color="#38bdf8" active={s >= 3} />
        <LinkLine x1={550} y1={200} x2={680} y2={160} color="#34d399" active={s >= 3} />
        <LinkLine x1={550} y1={215} x2={680} y2={300} color="#f59e0b" active={s >= 4} />
        <Badge x={415} y={290} text="VLAN 10 TAG" color="#34d399" active={s >= 3} w={135} />
        <Badge x={415} y={325} text="VLAN 20 TAG" color="#a78bfa" active={s >= 3} w={135} />
        <Panel
          x={55}
          y={382}
          w={810}
          h={32}
          title="DESIGN RULE"
          lines={["Physical path is the same; VLAN tags and controller mapping decide where each WLAN's traffic goes."]}
          color="#38bdf8"
          size={8.2}
        />
      </svg>
    </StepShell>
  )
}

const capwapPathStages = [
  'الـ AP متصل بـ Ethernet ب-access switch.',
  'Access switch يوصل الـ AP بشبكة distribution عبر IP.',
  'الـ WLC callable عبر IP على نفس الشبكة.',
  'CAPWAP control يستخدم UDP 5246 وDTLS حيث مدعوم.',
  'CAPWAP data يستخدم UDP 5247؛ النفق منطقي مش كابل فيزيائي.',
]

export function ApToWlcCapwapPhysicalPathDiagram() {
  const playback = useStepPlayback(capwapPathStages.length)
  const s = playback.stage
  return (
    <StepShell title="AP TO WLC CAPWAP PHYSICAL PATH" playback={playback} legend={capwapPathStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Physical path from AP to access switch, distribution network, and WLC with logical CAPWAP control and data tunnels">
        <Note x={460} y={24} text="THE TUNNEL RIDES OVER THE IP NETWORK; IT IS NOT A SEPARATE CABLE" color="#94a3b8" size={8.4} />
        <Device x={35} y={130} w={150} h={105} title="AP" sub="CAPWAP endpoint" color="#38bdf8" active />
        <Device x={250} y={130} w={175} h={105} title="ACCESS SW" sub="Ethernet + VLAN" color="#a78bfa" active={s >= 0} />
        <Device x={490} y={130} w={175} h={105} title="DISTRIBUTION" sub="IP routing / L2 path" color="#34d399" active={s >= 1} />
        <Device x={735} y={130} w={150} h={105} title="WLC" sub="CAPWAP endpoint" color="#f59e0b" active={s >= 2} />
        <LinkLine x1={185} y1={182} x2={250} y2={182} color="#38bdf8" active={s >= 0} />
        <LinkLine x1={425} y1={182} x2={490} y2={182} color="#34d399" active={s >= 1} />
        <LinkLine x1={665} y1={182} x2={735} y2={182} color="#f59e0b" active={s >= 2} />
        {s >= 3 && <Packet point={{ x: 570, y: 165 }} color="#f59e0b" label="5246 CTRL" />}
        {s >= 4 && <Packet point={{ x: 570, y: 215 }} color="#34d399" label="5247 DATA" />}
        <Badge x={60} y={270} text="PHYSICAL CABLE PATH" color="#38bdf8" active={s >= 0} w={230} />
        <Badge x={340} y={270} text="IP CONNECTIVITY" color="#34d399" active={s >= 1} w={220} />
        <Badge x={640} y={270} text="LOGICAL CAPWAP TUNNEL" color="#f59e0b" active={s >= 3} w={250} />
        <Panel
          x={55}
          y={355}
          w={810}
          h={55}
          title="LINK TO TOPIC 2.6"
          lines={['Control and data are CAPWAP concepts; Ethernet cables and switchports are physical infrastructure.', 'Troubleshooting starts with the physical path before inspecting CAPWAP ports and join state.']}
          color="#38bdf8"
          size={8.5}
        />
      </svg>
    </StepShell>
  )
}

const lagStages = [
  'WLC has multiple physical Ethernet ports.',
  'Supported controllers group them into one logical LAG interface.',
  'The switch groups the same links into a Port-Channel.',
  'The bundle gives higher aggregate capacity and member-link resilience.',
  'Load distribution depends on the controller and switch implementation.',
]

export function WlcLagArchitectureDiagram() {
  const playback = useStepPlayback(lagStages.length)
  const s = playback.stage
  return (
    <StepShell title="WLC LAG ARCHITECTURE" playback={playback} legend={lagStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="WLC link aggregation with multiple physical ports forming one logical LAG connected to a switch Port-Channel">
        <Note x={460} y={24} text="MANY PHYSICAL LINKS, ONE LOGICAL INTERFACE" color="#94a3b8" size={9} />
        <Device x={45} y={100} w={260} h={215} title="WLC" sub="supported model + software" color="#f59e0b" active />
        <Port x={75} y={165} label="ETH1" color="#38bdf8" active={s >= 0} />
        <Port x={145} y={165} label="ETH2" color="#38bdf8" active={s >= 0} />
        <Port x={215} y={165} label="ETH3" color="#38bdf8" active={s >= 0} />
        <Port x={75} y={205} label="ETH4" color="#38bdf8" active={s >= 0} />
        <Badge x={75} y={260} text="LOGICAL LAG INTERFACE" color="#a78bfa" active={s >= 1} w={250} />
        <Device x={620} y={100} w={250} h={215} title="SWITCH" sub="Port-Channel" color="#a78bfa" active={s >= 2} />
        <Port x={650} y={165} label="Gi0/1" color="#38bdf8" active={s >= 0} />
        <Port x={720} y={165} label="Gi0/2" color="#38bdf8" active={s >= 0} />
        <Port x={790} y={165} label="Gi0/3" color="#38bdf8" active={s >= 0} />
        <Port x={650} y={205} label="Gi0/4" color="#38bdf8" active={s >= 0} />
        <Badge x={650} y={260} text="PORT-CHANNEL 1" color="#a78bfa" active={s >= 2} w={250} />
        <LinkLine x1={129} y1={176} x2={677} y2={176} color="#38bdf8" active={s >= 0} />
        <LinkLine x1={199} y1={176} x2={747} y2={176} color="#38bdf8" active={s >= 0} />
        <LinkLine x1={269} y1={176} x2={817} y2={176} color="#38bdf8" active={s >= 0} />
        <LinkLine x1={102} y1={216} x2={677} y2={216} color="#38bdf8" active={s >= 0} />
        <LinkLine x1={305} y1={273} x2={620} y2={273} color="#a78bfa" active={s >= 2} />
        {s >= 3 && <Packet point={{ x: 460, y: 245 }} color="#34d399" label="AGGREGATE" />}
        <Panel
          x={55}
          y={360}
          w={810}
          h={50}
          title={s >= 4 ? "IMPORTANT CAVEATS" : "LAG IS NOT CONTROLLER REDUNDANCY"}
          lines={[s >= 4 ? 'Support, maximum member count, and load distribution vary by WLC platform and release.' : 'A LAG survives a member link failure, but it does not replace a second WLC for controller redundancy.']}
          color={s >= 4 ? '#fb7185' : '#34d399'}
          size={8.5}
        />
      </svg>
    </StepShell>
  )
}

const portChannelStages = [
  'Switch has physical ports Gi0/1 to Gi0/4 toward the WLC.',
  'Speed, duplex, VLAN, and trunk settings must be compatible.',
  'LACP, PAgP, or static aggregation must match both sides.',
  'Port-channel1 appears as one logical switch interface.',
  'Verify with show etherchannel summary and show interfaces port-channel 1.',
]

export function SwitchPortChannelToWlcDiagram() {
  const playback = useStepPlayback(portChannelStages.length)
  const s = playback.stage
  return (
    <StepShell title="SWITCH PORT-CHANNEL TO WLC" playback={playback} legend={portChannelStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Switch ports bundled into Port-Channel connected to a WLC logical LAG with compatible settings">
        <Note x={460} y={24} text="BOTH SIDES MUST AGREE ON AGGREGATION SETTINGS" color="#94a3b8" size={8.8} />
        <Device x={45} y={100} w={275} h={220} title="SWITCH" sub="physical members" color="#a78bfa" active />
        <Port x={75} y={160} label="Gi0/1" color="#38bdf8" active={s >= 0} />
        <Port x={155} y={160} label="Gi0/2" color="#38bdf8" active={s >= 0} />
        <Port x={235} y={160} label="Gi0/3" color="#38bdf8" active={s >= 0} />
        <Port x={75} y={200} label="Gi0/4" color="#38bdf8" active={s >= 0} />
        <Badge x={75} y={255} text="PORT-CHANNEL 1 (Po1)" color="#a78bfa" active={s >= 3} w={250} />
        <Device x={635} y={100} w={240} h={220} title="WLC" sub="logical LAG" color="#f59e0b" active />
        <Badge x={665} y={165} text="LAG INTERFACE" color="#a78bfa" active={s >= 3} w={180} />
        <Badge x={665} y={210} text="MEMBER PORTS" color="#38bdf8" active={s >= 0} w={180} />
        <LinkLine x1={129} y1={171} x2={665} y2={180} color="#38bdf8" active={s >= 0} />
        <LinkLine x1={209} y1={171} x2={705} y2={180} color="#38bdf8" active={s >= 0} />
        <LinkLine x1={289} y1={171} x2={745} y2={180} color="#38bdf8" active={s >= 0} />
        <LinkLine x1={102} y1={211} x2={685} y2={220} color="#38bdf8" active={s >= 0} />
        <LinkLine x1={320} y1={270} x2={635} y2={270} color="#a78bfa" active={s >= 3} />
        {s >= 2 && <Packet point={{ x: 470, y: 240 }} color="#34d399" label="LACP/STATIC" />}
        <Badge x={60} y={345} text="SAME VLAN / TRUNK SETTINGS" color="#34d399" active={s >= 1} w={260} />
        <Badge x={365} y={345} text="COMPATIBLE MODE BOTH SIDES" color="#f59e0b" active={s >= 2} w={250} />
        <Badge x={650} y={345} text="VERIFY Po1 STATE" color="#a78bfa" active={s >= 4} w={205} />
        <Panel
          x={55}
          y={382}
          w={810}
          h={30}
          title="CCNA CHECKPOINT"
          lines={['An unbundled member is not providing aggregated capacity or resilience; inspect flags and port status.']}
          color="#38bdf8"
          size={8.1}
        />
      </svg>
    </StepShell>
  )
}

const redundancyStages = [
  'Single physical uplink failure can isolate an AP, switch, or WLC.',
  'Redundant Ethernet links give an alternate physical path.',
  'EtherChannel/LAG can lose one member and keep the logical link up.',
  'A second WLC is controller redundancy, not the same as extra links.',
  'High Availability is conceptual and depends on supported platforms and software.',
]

export function PhysicalLinkFailureRedundancyDiagram() {
  const playback = useStepPlayback(redundancyStages.length)
  const s = playback.stage
  return (
    <StepShell title="PHYSICAL LINK FAILURE AND REDUNDANCY" playback={playback} legend={redundancyStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Physical link failure compared with redundant uplinks, LAG member resilience, and redundant WLC devices">
        <Note x={460} y={24} text="LINK REDUNDANCY, LAG, AND CONTROLLER REDUNDANCY ARE DIFFERENT" color="#94a3b8" size={8.4} />
        <g opacity={s <= 1 ? 1 : 0.45}>
          <rect x={45} y={70} width={385} height={260} rx="12" fill="#0b1224" stroke="#fb7185" strokeWidth="2" />
          <SvgText x={237} y={98} color="#fb7185" size={10} bold>SINGLE LINK FAILURE</SvgText>
          <Device x={85} y={140} w={120} h={90} title="AP" sub="edge" color="#38bdf8" active={s <= 1} />
          <Device x={300} y={140} w={120} h={90} title="SWITCH" sub="uplink" color="#a78bfa" active={s <= 1} />
          <LinkLine x1={205} y1={185} x2={300} y2={185} color="#fb7185" active={s <= 1} />
          <CrossMark x={252} y={185} color="#fb7185" />
          <Note x={237} y={275} text="no alternate physical path" color="#cbd5e1" size={8.7} />
        </g>
        <g opacity={s >= 2 ? 1 : 0.45}>
          <rect x={490} y={70} width={385} height={260} rx="12" fill="#0b1224" stroke="#34d399" strokeWidth="2" />
          <SvgText x={682} y={98} color="#34d399" size={10} bold>REDUNDANT DESIGN</SvgText>
          <Device x={520} y={135} w={105} h={85} title="AP" sub="dual uplink" color="#38bdf8" active={s >= 2} />
          <Device x={685} y={115} w={105} h={65} title="SW1" sub="path A" color="#a78bfa" active={s >= 2} />
          <Device x={685} y={205} w={105} h={65} title="SW2" sub="path B" color="#a78bfa" active={s >= 3} />
          <Device x={815} y={160} w={45} h={65} title="WLC" sub="primary" color="#f59e0b" active={s >= 2} />
          <LinkLine x1={625} y1={160} x2={685} y2={145} color="#34d399" active={s >= 2} />
          <LinkLine x1={625} y1={195} x2={685} y2={235} color="#34d399" active={s >= 3} />
          <LinkLine x1={790} y1={145} x2={815} y2={180} color="#34d399" active={s >= 2} />
          <Note x={682} y={300} text="LAG member failure != second WLC" color="#cbd5e1" size={8.5} />
        </g>
        <Panel
          x={55}
          y={355}
          w={810}
          h={55}
          title={s >= 4 ? "PLATFORM DEPENDENCE" : "NAME THE FAILURE DOMAIN"}
          lines={[s >= 4 ? 'HA and controller failover require specific controller models, licensing, and software support.' : 'Ask what failed: cable, switch uplink, LAG member, WLC, or the controller itself.']}
          color={s >= 4 ? '#fb7185' : '#38bdf8'}
          size={8.5}
        />
      </svg>
    </StepShell>
  )
}
