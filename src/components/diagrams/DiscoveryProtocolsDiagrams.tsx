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

function CheckMark({ x, y, color = '#34d399' }: { x: number; y: number; color?: string }) {
  return (
    <g stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d={`M ${x - 8} ${y} l 5 5 l 10 -12`} />
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

function TableRow({
  y,
  values,
  widths,
  x = 70,
  color = '#38bdf8',
  active = true,
  size = 8.8,
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

const directlyConnectedStages = [
  'Device A والـ Device B متصلين ببعض مباشرة على Layer 2 من غير راوتر بينهم.',
  'كل جهاز عنده local interface مكوّن عليه الـ discovery protocol.',
  'المنفذ البعيد يظهر كـ remote port ID في معلومات الجار.',
  'الغاية من discovery إنك تعرف مين متصل بك من الـ direct neighbors فقط.',
  'المعلومات بتشمل Device ID وCapabilities وPlatform وSoftware وManagement IP لو متاحة.',
  'الـ discovery protocols غالباً ما بيشوفوش أجهزة عبر شبكة routing كاملة.',
]

export function DirectlyConnectedDevicesDiagram() {
  const playback = useStepPlayback(directlyConnectedStages.length)
  const s = playback.stage
  const detailed = s >= 4
  return (
    <StepShell title="TWO DIRECTLY CONNECTED NETWORK DEVICES" playback={playback} legend={directlyConnectedStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Two directly connected network devices exchanging discovery information">
        <Note x={460} y={24} text="DIRECTLY CONNECTED LAYER 2 NEIGHBORS" color="#94a3b8" size={10} />
        <Node x={80} y={120} w={210} h={80} label="Device A" sub="Gi0/1 | local interface" color="#38bdf8" tooltip="Local device" active />
        <Node x={630} y={120} w={210} h={80} label="Device B" sub="Gi0/2 | remote port ID" color="#a78bfa" tooltip="Directly connected neighbor" active={s >= 1} />
        <LinkLine x1={290} y1={160} x2={630} y2={160} color={s >= 2 ? '#34d399' : '#64748b'} active={s >= 2} />
        {s >= 2 && <Badge x={390} y={128} text="DIRECT LAYER 2 LINK" color="#34d399" active w={150} />}
        {s === 3 && <CrossMark x={460} y={225} color="#fb7185" />}
        {s === 3 && <Note x={460} y={255} text="NO ROUTER BETWEEN THESE DEVICES" color="#fb7185" size={9} />}
        <Panel
          x={55}
          y={310}
          w={810}
          h={85}
          title={detailed ? 'INFORMATION LEARNED' : 'NEIGHBOR DISCOVERY'}
          lines={
            detailed
              ? ['Device ID / System Name, Capabilities, Local Interface, Remote Port ID, Platform, Software Version, Management IP, VLAN where advertised.']
              : ['A discovery protocol identifies the device on the other end of the same Layer 2 link, not every device in the routed network.']
          }
          color={detailed ? '#34d399' : '#38bdf8'}
          active
          size={8.8}
        />
      </svg>
    </StepShell>
  )
}

const cdpAdvertisementStages = [
  'Device A يجهّز CDP advertisement ويحط فيه معلوماته.',
  'الإعلان بيتبعت على interface متوافق مع CDP.',
  'الوجهة multicast MAC للـ CDP هي `01:00:0C:CC:CC:CC`.',
  'Directly connected Device B يستلم الـ advertisement.',
  'Device B يعالج البيانات ويسجّل Device A كـ neighbor.',
  'CDP Layer 2 ومش بيتعمله routing زي حزمة IP عادية.',
]

export function CdpAdvertisementFlowDiagram() {
  const playback = useStepPlayback(cdpAdvertisementStages.length)
  const s = playback.stage
  const sent = s >= 1
  const received = s >= 3
  return (
    <StepShell title="CDP ADVERTISEMENT FLOW" playback={playback} legend={cdpAdvertisementStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="CDP advertisement flow between two directly connected devices">
        <Note x={460} y={24} text="CDP = CISCO PROPRIETARY, LAYER 2, DIRECT NEIGHBORS" color="#94a3b8" size={9.5} />
        <Node x={70} y={130} w={210} h={82} label="Device A" sub="CDP enabled" color="#38bdf8" tooltip="CDP sender" active />
        <Node x={640} y={130} w={210} h={82} label="Device B" sub="CDP neighbor table" color="#a78bfa" tooltip="CDP receiver" active={received} />
        <LinkLine x1={280} y1={171} x2={640} y2={171} color="#f59e0b" active={sent} />
        {sent && <Badge x={365} y={112} text="CDP ADVERTISEMENT" color="#f59e0b" active w={180} />}
        {sent && <Badge x={365} y={205} text="DMAC 01:00:0C:CC:CC:CC" color="#f59e0b" active w={185} />}
        {s >= 2 && s <= 4 && <Packet point={{ x: 460, y: 171 }} color="#f59e0b" label="CDP" />}
        {received && <CheckMark x={840} y={171} color="#34d399" />}
        <Panel
          x={55}
          y={300}
          w={810}
          h={95}
          title={s === 5 ? 'LAYER 2 BEHAVIOR' : 'PROCESS'}
          lines={
            s === 5
              ? ['CDP is not routed like ordinary IP traffic. It works on supported interfaces with or without an IP address.']
              : ['A sends the advertisement. B receives, processes the fields, and stores a neighbor entry.']
          }
          color={s === 5 ? '#f59e0b' : '#34d399'}
          active
          size={9.2}
        />
      </svg>
    </StepShell>
  )
}

const cdpTableStages = [
  'كل جهاز بيحفظ الـ neighbors في CDP neighbor table محلي.',
  'Device ID بيعرّف الجهاز المجاور.',
  'Local Interface وPort ID بيحددوا المنفذ المحلي والمنفذ البعيد.',
  'Capabilities بيوصف وظيفة الجهاز زي router أو switch.',
  'Platform وSoftware Version بيوضحوا نوع الجهاز وإصدار البرنامج.',
  'IP Address وNative VLAN بيظهروا لو الاتنين متاحين ومُعلنين.',
]

export function CdpNeighborTableDiagram() {
  const playback = useStepPlayback(cdpTableStages.length)
  const s = playback.stage
  const widths = [110, 115, 115, 130, 120, 120]
  const headers = ['DEVICE ID', 'LOCAL IF', 'PORT ID', 'CAPABILITIES', 'PLATFORM', 'IP / VLAN']
  const row1 = ['R1', 'Gi0/1', 'Gi0/0', 'Router', 'ISR4331', '10.0.0.1 / --']
  const row2 = ['SW2', 'Gi0/24', 'Gi0/24', 'Switch', 'C2960', '192.0.2.2 / 99']
  return (
    <StepShell title="CDP NEIGHBOR TABLE" playback={playback} legend={cdpTableStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="CDP neighbor table with learned device fields">
        <Note x={460} y={24} text="LOCAL TABLE LEARNED FROM DIRECT CDP NEIGHBORS" color="#94a3b8" size={9.6} />
        <rect x={55} y={75} width={810} height={220} rx="12" fill="#0b1224" stroke="#334155" strokeWidth={1.4} />
        <TableRow y={110} values={headers} widths={widths} color="#f59e0b" size={8.2} />
        <line x1={70} y1={122} x2={850} y2={122} stroke="#334155" />
        <TableRow y={160} values={row1} widths={widths} active={s >= 1} size={8.6} />
        <TableRow y={215} values={row2} widths={widths} active={s >= 3} size={8.6} />
        {s >= 2 && <CheckMark x={820} y={160} color="#34d399" />}
        {s >= 4 && <CheckMark x={820} y={215} color="#34d399" />}
        <Panel
          x={55}
          y={320}
          w={810}
          h={75}
          title={s === 5 ? 'FIELD AVAILABILITY' : 'READING THE TABLE'}
          lines={
            s === 5
              ? ['Not every field appears on every platform. IP address and native VLAN depend on what the neighbor advertises.']
              : ['Local Interface is your port. Port ID is the remote port. Capabilities and Platform identify the neighbor.']
          }
          color={s === 5 ? '#fb7185' : '#38bdf8'}
          active
          size={8.9}
        />
      </svg>
    </StepShell>
  )
}

const cdpTimingStages = [
  'CDP بيبعت advertisement دورياً على المنفذ المدعوم.',
  'القيم الشائعة: advertisement interval 60 ثانية وholdtime 180 ثانية.',
  'كل advertisement جديد بيحدّث الـ neighbor entry ويعيد ضبط الـ holdtime.',
  'لو الإعلانات وقفت، الـ holdtime بيعد تنازلياً.',
  'لما الـ holdtime يوصل لصفر، الـ neighbor entry بتتمسح.',
  'القيم قابلة للضبط وممكن تختلف حسب المنصة والإصدار.',
]

export function CdpTimingDiagram() {
  const playback = useStepPlayback(cdpTimingStages.length)
  const s = playback.stage
  const marks = [0, 60, 120, 180, 240]
  const colorFor = (index: number) => {
    if (s <= 1) return index <= 1 ? '#f59e0b' : '#475569'
    if (s === 2) return index <= 2 ? '#f59e0b' : '#475569'
    if (s === 3) return index <= 2 ? '#f59e0b' : '#fb7185'
    return index <= 2 ? '#f59e0b' : '#fb7185'
  }
  return (
    <StepShell title="CDP INTERVAL and HOLDTIME TIMELINE" playback={playback} legend={cdpTimingStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="CDP advertisement interval and holdtime timeline">
        <Note x={460} y={24} text="COMMON DEFAULTS: 60s UPDATE, 180s HOLDTIME - CONFIGURABLE" color="#94a3b8" size={9.4} />
        <line x1={90} y1={190} x2={830} y2={190} stroke="#475569" strokeWidth="3" />
        {marks.map((mark, index) => {
          const x = 90 + index * 185
          return (
            <g key={mark}>
              <circle cx={x} cy={190} r="7" fill={colorFor(index)} />
              <SvgText x={x} y={225} color="#94a3b8" size={9}>{`${mark}s`}</SvgText>
              {index <= (s >= 2 ? 2 : 1) && <Badge x={x - 55} y={135} text="CDP AD" color="#f59e0b" active w={110} />}
            </g>
          )
        })}
        {s >= 3 && <CrossMark x={645} y={190} color="#fb7185" />}
        {s >= 3 && <Note x={645} y={275} text="ADS STOPPED" color="#fb7185" size={9.4} />}
        {s >= 4 && <Note x={460} y={305} text="HOLDTIME EXPIRED: NEIGHBOR ENTRY REMOVED" color="#fb7185" size={10} />}
        <Panel
          x={55}
          y={335}
          w={810}
          h={65}
          title="INTERVAL vs HOLDTIME"
          lines={['Interval controls how often ads are sent. Holdtime controls how long the neighbor entry survives without a refresh.']}
          color="#34d399"
          active
          size={8.9}
        />
      </svg>
    </StepShell>
  )
}

const lldpAdvertisementStages = [
  'Device A يجهّز LLDP advertisement على شكل TLVs.',
  'الإطار بيتبعت من interface متوافق مع LLDP.',
  'أشهر وجهة في بيئات Ethernet هي nearest bridge: `01:80:C2:00:00:0E`.',
  'Device B يستلم الإطار ويعالج الـ TLVs.',
  'Device B بيخزّن معلومات الجار في LLDP neighbor table.',
  'LLDP معيار مفتوح ومش مقصور على بائع واحد.',
]

export function LldpAdvertisementFlowDiagram() {
  const playback = useStepPlayback(lldpAdvertisementStages.length)
  const s = playback.stage
  const sent = s >= 1
  const received = s >= 3
  return (
    <StepShell title="LLDP ADVERTISEMENT FLOW" playback={playback} legend={lldpAdvertisementStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="LLDP advertisement flow between compatible devices">
        <Note x={460} y={24} text="LLDP = IEEE 802.1AB, VENDOR-NEUTRAL, LAYER 2" color="#94a3b8" size={9.6} />
        <Node x={70} y={130} w={210} h={82} label="Device A" sub="LLDP transmit on" color="#38bdf8" tooltip="LLDP sender" active />
        <Node x={640} y={130} w={210} h={82} label="Device B" sub="LLDP receive on" color="#a78bfa" tooltip="LLDP receiver" active={received} />
        <LinkLine x1={280} y1={171} x2={640} y2={171} color="#34d399" active={sent} />
        {sent && <Badge x={345} y={108} text="LLDP ADVERTISEMENT (TLVs)" color="#34d399" active w={200} />}
        {s >= 2 && <Badge x={330} y={207} text="DMAC 01:80:C2:00:00:0E" color="#34d399" active w={225} />}
        {s >= 2 && s <= 4 && <Packet point={{ x: 460, y: 171 }} color="#34d399" label="LLDP" />}
        {received && <CheckMark x={840} y={171} color="#34d399" />}
        <Panel
          x={55}
          y={300}
          w={810}
          h={95}
          title={s === 5 ? 'WHY LLDP MATTERS' : 'PROCESS'}
          lines={
            s === 5
              ? ['A Cisco device can learn about a non-Cisco neighbor because LLDP is a multi-vendor standard.']
              : ['A sends TLVs. B reads Chassis ID, Port ID, TTL, System Name, Capabilities, and Management Address when present.']
          }
          color={s === 5 ? '#38bdf8' : '#34d399'}
          active
          size={9.1}
        />
      </svg>
    </StepShell>
  )
}

const lldpTlvStages = [
  'TLV يعني Type Length Value؛ كل حقل في LLDP مفهوم بين البائعين.',
  'Chassis ID وPort ID بيعرّفوا الجهاز والمنفذ.',
  'TTL بيقول لسويتش الاستقبال لمدة إيه يفضل الجار موجود.',
  'Port Description وSystem Name وSystem Description بيضيفوا وصف أوضح.',
  'System Capabilities بيوضح دور الجهاز زي switch أو router أو phone.',
  'Management Address بيظهر لو الجهاز بيعلنه، وده مش مضمون في كل الحالات.',
]

export function LldpTlvStructureDiagram() {
  const playback = useStepPlayback(lldpTlvStages.length)
  const s = playback.stage
  const tlvs = [
    { name: 'Chassis ID', color: '#38bdf8', stage: 1 },
    { name: 'Port ID', color: '#38bdf8', stage: 1 },
    { name: 'TTL', color: '#f59e0b', stage: 2 },
    { name: 'Port Desc', color: '#a78bfa', stage: 3 },
    { name: 'System Name', color: '#a78bfa', stage: 3 },
    { name: 'Sys Desc', color: '#a78bfa', stage: 3 },
    { name: 'Capabilities', color: '#34d399', stage: 4 },
    { name: 'Mgmt Addr', color: '#34d399', stage: 5 },
  ]
  return (
    <StepShell title="LLDP TLV STRUCTURE" playback={playback} legend={lldpTlvStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="LLDP TLV field structure">
        <Note x={460} y={24} text="LLDP ADVERTISEMENTS ARE BUILT FROM TLV FIELDS" color="#94a3b8" size={9.6} />
        <rect x={55} y={75} width={810} height="70" rx="12" fill="#0b1224" stroke="#334155" strokeWidth={1.4} />
        <SvgText x={460} y={105} color="#94a3b8" size={10} bold>LLDP FRAME</SvgText>
        <SvgText x={460} y={127} color="#64748b" size={8.8}>Type Length Value fields carry standardized neighbor information</SvgText>
        <g>
          {tlvs.map((tlv, index) => {
            const x = 55 + index * 102
            const active = s >= tlv.stage
            return (
              <g key={tlv.name} opacity={active ? 1 : 0.35}>
                <rect x={x} y={185} width="92" height="70" rx="9" fill="#0b1224" stroke={tlv.color} strokeWidth={active ? 2.2 : 1} />
                <SvgText x={x + 46} y={215} color={tlv.color} size={9} bold>{`TLV ${index + 1}`}</SvgText>
                <SvgText x={x + 46} y={237} color="#cbd5e1" size={8.2}>{tlv.name}</SvgText>
              </g>
            )
          })}
        </g>
        <Panel
          x={55}
          y={300}
          w={810}
          h={95}
          title={s === 5 ? 'OPTIONAL INFORMATION' : 'CORE FIELDS'}
          lines={
            s === 5
              ? ['Management Address and some descriptive fields depend on vendor support and device configuration.']
              : ['Chassis ID, Port ID, and TTL are central. Descriptive TLVs make the neighbor easier to identify.']
          }
          color={s === 5 ? '#fb7185' : '#34d399'}
          active
          size={9}
        />
      </svg>
    </StepShell>
  )
}

const lldpTableStages = [
  'LLDP neighbor table بيسجّل المعلومات اللي وصلت من TLVs.',
  'Chassis ID وPort ID بيحددوا هوية الجار والمنفذ.',
  'System Name وCapabilities بيساعدوا في تحديد دور الجهاز.',
  'Management Address بيظهر لو مُعلن.',
  'TTL بيوضح المدة المتبقية قبل انتهاء صلاحية الإدخال.',
  'الجدول محلي لكل جهاز وبيتحدّث مع كل advertisement.',
]

export function LldpNeighborTableDiagram() {
  const playback = useStepPlayback(lldpTableStages.length)
  const s = playback.stage
  const widths = [125, 110, 140, 140, 140, 85]
  const headers = ['CHASSIS ID', 'PORT ID', 'SYSTEM NAME', 'CAPABILITIES', 'MGMT ADDRESS', 'TTL']
  const row1 = ['00:11:22...', 'Gi0/0', 'R1', 'Router', '10.0.0.1', '118']
  const row2 = ['aabb.cc...', 'Gi0/24', 'SW2', 'Switch', '192.0.2.2', '121']
  return (
    <StepShell title="LLDP NEIGHBOR TABLE" playback={playback} legend={lldpTableStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="LLDP neighbor table with TLV-derived fields">
        <Note x={460} y={24} text="INFORMATION STORED FROM RECEIVED LLDP TLVS" color="#94a3b8" size={9.5} />
        <rect x={55} y={75} width={810} height="220" rx="12" fill="#0b1224" stroke="#334155" strokeWidth={1.4} />
        <TableRow y={110} values={headers} widths={widths} color="#34d399" size={8.1} />
        <line x1={70} y1={122} x2={850} y2={122} stroke="#334155" />
        <TableRow y={160} values={row1} widths={widths} active={s >= 1} size={8.6} />
        <TableRow y={215} values={row2} widths={widths} active={s >= 3} size={8.6} />
        {s >= 2 && <CheckMark x={820} y={160} color="#34d399" />}
        {s >= 4 && <CheckMark x={820} y={215} color="#34d399" />}
        <Panel
          x={55}
          y={320}
          w={810}
          h={75}
          title={s === 5 ? 'LOCAL AND DYNAMIC' : 'TTL MATTERS'}
          lines={
            s === 5
              ? ['Each device keeps its own table. Received advertisements refresh the entry.']
              : ['TTL counts down between advertisements. A refreshed TLV resets the timer.']
          }
          color={s === 5 ? '#38bdf8' : '#f59e0b'}
          active
          size={8.9}
        />
      </svg>
    </StepShell>
  )
}

const lldpTtlStages = [
  'LLDP advertisement interval وTTL حاجتان مختلفتان.',
  'مثال تعليمي: إعلان كل 30 ثانية وTTL 120 ثانية على سبيل المثال.',
  'كل advertisement جديد يعمل refresh للـ TTL.',
  'لو الإعلانات وقفت، الـ TTL بيقل.',
  'لما TTL يوصل لصفر، الـ neighbor entry بتختفي.',
  'القيم الفعلية بتعتمد على المنصة والإعداد.',
]

export function LldpTtlTimelineDiagram() {
  const playback = useStepPlayback(lldpTtlStages.length)
  const s = playback.stage
  const marks = [0, 30, 60, 90, 120]
  const activeMarks = s <= 1 ? 1 : s === 2 ? 2 : s === 3 ? 2 : 4
  return (
    <StepShell title="LLDP TTL EXPIRATION TIMELINE" playback={playback} legend={lldpTtlStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="LLDP TTL expiration timeline">
        <Note x={460} y={24} text="ADVERTISEMENT INTERVAL IS NOT THE SAME AS TTL" color="#94a3b8" size={9.6} />
        <line x1={90} y1={190} x2={830} y2={190} stroke="#475569" strokeWidth="3" />
        {marks.map((mark, index) => {
          const x = 90 + index * 185
          const active = index <= activeMarks
          return (
            <g key={mark}>
              <circle cx={x} cy={190} r="7" fill={active ? '#34d399' : '#475569'} />
              <SvgText x={x} y={225} color="#94a3b8" size={9}>{`${mark}s`}</SvgText>
              {index <= (s >= 2 ? 2 : 1) && <Badge x={x - 58} y={135} text="LLDP AD" color="#34d399" active w={116} />}
            </g>
          )
        })}
        {s >= 3 && <CrossMark x={645} y={190} color="#fb7185" />}
        {s >= 3 && <Note x={645} y={275} text="ADS STOPPED - TTL COUNTING DOWN" color="#fb7185" size={9.2} />}
        {s >= 4 && <Note x={460} y={305} text="TTL = 0: NEIGHBOR ENTRY REMOVED" color="#fb7185" size={10} />}
        <Panel
          x={55}
          y={335}
          w={810}
          h={65}
          title="KEY DIFFERENCE"
          lines={['Interval = how often LLDP ads are sent. TTL = how long the receiver keeps the information.']}
          color="#34d399"
          active
          size={9}
        />
      </svg>
    </StepShell>
  )
}

const comparisonStages = [
  'CDP وLLDP الاتنين بيشتغلوا على Layer 2 ومع directly connected neighbors.',
  'CDP Cisco proprietary؛ LLDP معيار IEEE 802.1AB.',
  'CDP بيستخدم CDP fields؛ LLDP بيستخدم TLVs.',
  'CDP مفيد في الشبكات اللي فيها أجهزة Cisco غالبة.',
  'LLDP أفضل في البيئات متعددة البائعين.',
  'مش ممنوع يعملوا الاتنين مع بعض؛ كل واحد بيطلع جدول منفصل.',
]

export function CdpVsLldpComparisonDiagram() {
  const playback = useStepPlayback(comparisonStages.length)
  const s = playback.stage
  const rows = [
    { label: 'Standard', cdp: 'Cisco proprietary', lldp: 'IEEE 802.1AB', stage: 1 },
    { label: 'Vendor support', cdp: 'Primarily Cisco devices', lldp: 'Multi-vendor', stage: 1 },
    { label: 'Layer', cdp: 'Layer 2', lldp: 'Layer 2', stage: 0 },
    { label: 'Neighbor scope', cdp: 'Directly connected', lldp: 'Directly connected', stage: 0 },
    { label: 'Info format', cdp: 'CDP fields', lldp: 'LLDP TLVs', stage: 2 },
    { label: 'IOS config', cdp: 'cdp run / show cdp', lldp: 'lldp run / show lldp', stage: 5 },
  ]
  return (
    <StepShell title="CDP vs LLDP COMPARISON" playback={playback} legend={comparisonStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="CDP compared with LLDP">
        <Note x={460} y={24} text="BOTH ARE LAYER 2 NEIGHBOR DISCOVERY TOOLS" color="#94a3b8" size={9.6} />
        <SvgText x={230} y={78} color="#f59e0b" size={11} bold>CDP</SvgText>
        <SvgText x={610} y={78} color="#34d399" size={11} bold>LLDP</SvgText>
        <rect x={70} y={92} width={780} height={255} rx="12" fill="#0b1224" stroke="#334155" strokeWidth={1.4} />
        {rows.map((row, index) => {
          const y = 125 + index * 38
          const active = s >= row.stage
          return (
            <g key={row.label} opacity={active ? 1 : 0.35}>
              <rect x={85} y={y - 17} width={750} height={30} rx="7" fill={active ? '#0f2745' : 'transparent'} />
              <SvgText x={175} y={y + 3} color="#94a3b8" size={8.8} bold>{row.label}</SvgText>
              <SvgText x={415} y={y + 3} color="#f59e0b" size={8.8}>{row.cdp}</SvgText>
              <SvgText x={725} y={y + 3} color="#34d399" size={8.8}>{row.lldp}</SvgText>
            </g>
          )
        })}
        <Panel
          x={70}
          y={358}
          w={780}
          h={45}
          title={s === 4 ? 'MULTI-VENDOR RULE' : 'PRACTICAL RULE'}
          lines={s === 4 ? ['Use LLDP when neighbors may be non-Cisco. CDP is still useful in Cisco-heavy networks.'] : ['CDP and LLDP can both be enabled without replacing each other.']}
          color={s === 4 ? '#34d399' : '#38bdf8'}
          active
          size={8.8}
        />
      </svg>
    </StepShell>
  )
}

const multiVendorStages = [
  'الطوبولوجيا فيها Cisco Switch وCisco Router وجهاز غير Cisco.',
  'CDP هيكون متاح بين الأجهزة اللي بتدعم CDP فقط.',
  'الجهاز غير Cisco غالباً مش هيظهر في CDP neighbor table.',
  'LLDP متاح على الأجهزة المتوافقة مهما كان البائع.',
  'لما LLDP شغال على الطرفين، الجار هيظهر في LLDP neighbor table.',
  'في الشبكات المختلطة، LLDP بيسد الفجوة اللي CDP مش بيغطيها.',
]

export function MultiVendorDiscoveryDiagram() {
  const playback = useStepPlayback(multiVendorStages.length)
  const s = playback.stage
  const cdpVisible = s >= 1
  const lldpVisible = s >= 3
  return (
    <StepShell title="MULTI-VENDOR NEIGHBOR DISCOVERY" playback={playback} legend={multiVendorStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Multi-vendor neighbor discovery using CDP and LLDP">
        <Note x={460} y={24} text="CDP MAY NOT EXIST ON NON-CISCO DEVICES - LLDP IS VENDOR-NEUTRAL" color="#94a3b8" size={9.2} />
        <Device x={60} y={130} w={190} h={92} title="Cisco SW1" sub="CDP + LLDP" color="#38bdf8" active />
        <Device x={365} y={130} w={190} h={92} title="non-Cisco SW2" sub="LLDP only" color="#f59e0b" active={s >= 2} />
        <Device x={670} y={130} w={190} h={92} title="Cisco R1" sub="CDP + LLDP" color="#a78bfa" active={cdpVisible} />
        <LinkLine x1={250} y1={176} x2={365} y2={176} color={lldpVisible ? '#34d399' : '#64748b'} active={lldpVisible} />
        <LinkLine x1={555} y1={176} x2={670} y2={176} color={cdpVisible ? '#f59e0b' : '#64748b'} active={cdpVisible} />
        {cdpVisible && <Badge x={565} y={105} text="CDP WORKS" color="#f59e0b" active w={100} />}
        {cdpVisible && <CrossMark x={307} y={176} color="#fb7185" />}
        {cdpVisible && <Note x={307} y={225} text="NO CDP" color="#fb7185" size={8.8} />}
        {lldpVisible && <Badge x={250} y={250} text="LLDP WORKS ACROSS VENDORS" color="#34d399" active w={215} />}
        <Panel
          x={55}
          y={330}
          w={810}
          h={65}
          title={s === 5 ? 'MULTI-VENDOR BENEFIT' : 'COMPATIBILITY'}
          lines={['LLDP can discover neighbors from different vendors when both sides support LLDP and it is enabled.']}
          color="#34d399"
          active
        />
      </svg>
    </StepShell>
  )
}

const topologyStages = [
  'ابدأ من جهاز واحد واسأل: مين متصل بيا مباشرة؟',
  'CDP أو LLDP بيقول لك Device ID والمنفذ المحلي والمنفذ البعيد.',
  'بكل neighbor جديد بتقدر ترسم link في خريطة الطوبولوجيا.',
  'كرر العملية من كل سويتش أو راوتر لبقية الـ directly connected links.',
  'الخريطة الناتجة بتساعد في التوثيق وتحديد الأخطاء.',
  'الاكتشاف بيفضل محلي لكل link؛ مش بديل عن بروتوكولات routing لاكتشاف الشبكة بالكامل.',
]

export function TopologyDiscoveryDiagram() {
  const playback = useStepPlayback(topologyStages.length)
  const s = playback.stage
  return (
    <StepShell title="NETWORK TOPOLOGY DISCOVERY USING CDP and LLDP" playback={playback} legend={topologyStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Building a network topology map from discovery neighbors">
        <Note x={460} y={24} text="EACH NEIGHBOR ENTRY ADDS ONE LINK TO THE MAP" color="#94a3b8" size={9.6} />
        <Device x={360} y={65} w={200} h={80} title="SW1" sub="start here" color="#38bdf8" active />
        <Device x={110} y={235} w={190} h={82} title="SW2" sub="Gi0/24 to SW1" color="#a78bfa" active={s >= 1} />
        <Device x={365} y={235} w={190} h={82} title="R1" sub="Gi0/1 to SW1" color="#f59e0b" active={s >= 2} />
        <Device x={620} y={235} w={190} h={82} title="Server" sub="via SW1 or SW2" color="#34d399" active={s >= 3} />
        <LinkLine x1={430} y1={145} x2={205} y2={235} color="#a78bfa" active={s >= 1} />
        <LinkLine x1={460} y1={145} x2={460} y2={235} color="#f59e0b" active={s >= 2} />
        <LinkLine x1={490} y1={145} x2={715} y2={235} color="#34d399" active={s >= 3} />
        {s >= 1 && <CheckMark x={205} y={235} color="#34d399" />}
        {s >= 2 && <CheckMark x={460} y={235} color="#34d399" />}
        {s >= 3 && <CheckMark x={715} y={235} color="#34d399" />}
        <Panel
          x={55}
          y={345}
          w={810}
          h={55}
          title={s === 5 ? 'SCOPE LIMIT' : 'RESULT'}
          lines={['Neighbor tables build a Layer 2 topology map, but they do not replace routing or a full network inventory system.']}
          color={s === 5 ? '#fb7185' : '#34d399'}
          active
          size={8.8}
        />
      </svg>
    </StepShell>
  )
}
