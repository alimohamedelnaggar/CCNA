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

function Layer({
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
      <rect x={x} y={y} width={w} height={h} rx="10" fill="#0b1224" stroke={color} strokeWidth={active ? 2.4 : 1.2} />
      <SvgText x={x + w / 2} y={y + 24} color={color} size={11} bold>
        {title}
      </SvgText>
      <SvgText x={x + w / 2} y={y + 43} color="#cbd5e1" size={9}>
        {sub}
      </SvgText>
    </g>
  )
}

function VlanTag({
  x,
  y,
  text,
  color = '#38bdf8',
  active = true,
  w = 92,
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
      <rect x={x} y={y} width={w} height={24} rx="12" fill="#0b1224" stroke={color} strokeWidth={active ? 2 : 1} />
      <SvgText x={x + w / 2} y={y + 16} color={color} size={9} bold>
        {text}
      </SvgText>
    </g>
  )
}

function FrameBadge({
  x,
  y,
  text,
  color = '#38bdf8',
  active = true,
  w = 116,
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
      <SvgText x={x + w / 2} y={y + 17} color={color} size={8.6} bold>
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

const twoSwitchesStages = [
  'مجموعتين PCs متصلين بسويتشين مختلفين، بس كل PC لازم يوصل لزميله في نفس الـ VLAN.',
  'VLAN 10 موجود على SW1 وSW2، وكمان VLAN 20 موجود على الاتنين.',
  'الرابط بين SW1 وSW2 لازم يحمل VLAN 10 وVLAN 20 في نفس الوقت.',
  'لو الرابط كان access عادي، هيحمل VLAN واحد بس وهتضيع حركة الـ VLAN التاني.',
  'الحل هو trunk port بين السويتشين: رابط فيزيائي واحد يحمل عدة VLANs ويحافظ على فصلها.',
]

export function TwoSwitchesConnectedDiagram() {
  const playback = useStepPlayback(twoSwitchesStages.length)
  const s = playback.stage
  const both = s >= 2
  const trunk = s >= 4
  return (
    <StepShell title="TWO SWITCHES CONNECTED TOGETHER" playback={playback} legend={twoSwitchesStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Two switches connected by an inter-switch trunk link">
        <Note x={460} y={24} text="ONE PHYSICAL LINK MUST CARRY MULTIPLE VLANs" color="#94a3b8" size={10} />
        <Layer x={300} y={105} w={140} h={150} title="SW1" sub="access + trunk" color="#38bdf8" active />
        <Layer x={480} y={105} w={140} h={150} title="SW2" sub="access + trunk" color="#a78bfa" active={both} />
        <Node x={55} y={95} w={145} h={54} label="PC-A" sub="VLAN 10 | Gi0/1" color="#38bdf8" tooltip="Source VLAN 10" active />
        <Node x={55} y={205} w={145} h={54} label="PC-C" sub="VLAN 20 | Gi0/2" color="#34d399" tooltip="Source VLAN 20" active={both} />
        <Node x={720} y={95} w={145} h={54} label="PC-B" sub="VLAN 10 | Gi0/1" color="#38bdf8" tooltip="Destination VLAN 10" active={both} />
        <Node x={720} y={205} w={145} h={54} label="PC-D" sub="VLAN 20 | Gi0/2" color="#34d399" tooltip="Destination VLAN 20" active={both} />
        <LinkLine x1={200} y1={122} x2={300} y2={150} color="#38bdf8" active={s >= 1} />
        <LinkLine x1={200} y1={232} x2={300} y2={210} color="#34d399" active={both} />
        <LinkLine x1={440} y1={180} x2={480} y2={180} color={trunk ? '#f59e0b' : '#64748b'} active={both} />
        <LinkLine x1={620} y1={180} x2={720} y2={122} color="#38bdf8" active={both} />
        <LinkLine x1={620} y1={180} x2={720} y2={232} color="#34d399" active={both} />
        {s === 3 && <CrossMark x={460} y={180} color="#fb7185" />}
        {s === 3 && <Note x={560} y={190} text="ACCESS LINK = ONE VLAN" color="#fb7185" size={9} />}
        {trunk && <FrameBadge x={405} y={142} text="TRUNK Gi0/24" color="#f59e0b" active />}
        {trunk && <VlanTag x={400} y={210} text="10 + 20" color="#f59e0b" active />}
        <Panel
          x={55}
          y={330}
          w={810}
          h={65}
          title={trunk ? 'TRUNK SOLUTION' : 'THE PROBLEM'}
          lines={
            trunk
              ? ['A trunk carries tagged frames for VLAN 10 and VLAN 20 while keeping them logically separate.']
              : ['PCs in the same VLAN across two switches need an inter-switch link that carries more than one VLAN.']
          }
          color={trunk ? '#34d399' : '#f59e0b'}
          active
        />
      </svg>
    </StepShell>
  )
}

const accessVsTrunkStages = [
  'Access port بيربط جهاز نهائي زي PC أو printer بسويتش، وغالباً يحمل Data VLAN واحد.',
  'إطار الـ PC بيوصل untagged؛ السويتش يعرف الـ VLAN من عضوية المنفذ.',
  'Trunk port بيربط سويتش بسويتش، ويحمل أكتر من VLAN على نفس الرابط.',
  'على الـ trunk، الإطار بياخد 802.1Q tag عشان الطرف التاني يعرف رقم الـ VLAN.',
  'الخلاصة: access = VLAN واحد وuntagged؛ trunk = VLANs متعددة وtagged.',
]

export function AccessVsTrunkPortDiagram() {
  const playback = useStepPlayback(accessVsTrunkStages.length)
  const s = playback.stage
  const trunkSide = s >= 2
  return (
    <StepShell title="ACCESS PORT vs TRUNK PORT" playback={playback} legend={accessVsTrunkStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Access port compared with trunk port">
        <Note x={460} y={24} text="END DEVICE LINK vs INTER-SWITCH LINK" color="#94a3b8" size={10} />
        <g opacity={!trunkSide ? 1 : 0.55}>
          <Layer x={285} y={105} w={170} h={145} title="SWITCH" sub="access port" color="#38bdf8" active={!trunkSide} />
          <Node x={55} y={145} w={145} h={62} label="PC-A" sub="Gi0/1 | VLAN 10" color="#38bdf8" tooltip="End device" active />
          <LinkLine x1={200} y1={176} x2={285} y2={176} color="#38bdf8" active={!trunkSide} />
          {!trunkSide && <FrameBadge x={215} y={150} text="UNTAGGED" color="#38bdf8" active />}
          {!trunkSide && <Packet point={{ x: 245, y: 176 }} color="#38bdf8" label="frame" />}
        </g>
        <g opacity={trunkSide ? 1 : 0.4}>
          <Layer x={285} y={105} w={170} h={145} title="SW1" sub="trunk port" color="#f59e0b" active={trunkSide} />
          <Layer x={535} y={105} w={170} h={145} title="SW2" sub="trunk port" color="#a78bfa" active={trunkSide} />
          <LinkLine x1={455} y1={176} x2={535} y2={176} color="#f59e0b" active={trunkSide} />
          {trunkSide && <FrameBadge x={460} y={145} text="TAGGED VID 10" color="#f59e0b" active />}
          {trunkSide && <Packet point={{ x: 495, y: 176 }} color="#f59e0b" label="802.1Q" />}
          {trunkSide && <VlanTag x={470} y={215} text="10 / 20 / 99" color="#f59e0b" active />}
        </g>
        <Panel
          x={55}
          y={320}
          w={810}
          h={72}
          title={s === 4 ? 'CCNA COMPARISON' : 'PORT ROLE'}
          lines={
            s === 4
              ? ['Access: one data VLAN, usually untagged to an end device.', 'Trunk: multiple VLANs, tagged frames between network devices.']
              : ['The frame format on the link depends on the port role and the device on the other end.']
          }
          color={s === 4 ? '#34d399' : '#38bdf8'}
          active
          size={9.4}
        />
      </svg>
    </StepShell>
  )
}

const frameTagStages = [
  'Ethernet frame عادي فيه Destination MAC وSource MAC وEtherType وباقي الـ payload وFCS.',
  'على الـ trunk، السويتش يضيف 802.1Q tag بين Source MAC والـ EtherType الأصلي.',
  'الـ tag بيضيف 4 bytes لطول الإطار، فالإطار المُوسوم أكبر من العادي.',
  'جوه الـ tag فيه TPID وPCP وDEI وVID، وده اللي بيحدد نوع الإطار ورقم الـ VLAN.',
  'سويتش الاستقبال بيقرأ الـ tag ويعرف إن الإطار تابع لأي VLAN قبل ما يوجّهه.',
]

export function Frame8021qTaggingDiagram() {
  const playback = useStepPlayback(frameTagStages.length)
  const s = playback.stage
  const tagged = s >= 1
  const exploded = s >= 3
  return (
    <StepShell title="ETHERNET FRAME BEFORE and AFTER 802.1Q TAGGING" playback={playback} legend={frameTagStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Ethernet frame before and after IEEE 802.1Q tagging">
        <Note x={460} y={24} text="802.1Q TAG = 4 BYTES INSERTED INTO THE FRAME" color="#94a3b8" size={9.8} />
        <SvgText x={55} y={90} color="#94a3b8" size={10} bold anchor="start">BEFORE</SvgText>
        <rect x={55} y={105} width={810} height={62} rx="10" fill="#0b1224" stroke="#334155" strokeWidth={1.4} />
        <rect x={65} y={115} width={130} height={42} rx="6" fill="#0f2745" stroke="#64748b" />
        <SvgText x={130} y={141} color="#cbd5e1" size={9}>DMAC</SvgText>
        <rect x={200} y={115} width={130} height={42} rx="6" fill="#0f2745" stroke="#64748b" />
        <SvgText x={265} y={141} color="#cbd5e1" size={9}>SMAC</SvgText>
        <rect x={335} y={115} width={180} height={42} rx="6" fill="#0f2745" stroke="#64748b" />
        <SvgText x={425} y={141} color="#cbd5e1" size={9}>ETHERTYPE</SvgText>
        <rect x={520} y={115} width={240} height={42} rx="6" fill="#0f2745" stroke="#64748b" />
        <SvgText x={640} y={141} color="#cbd5e1" size={9}>PAYLOAD</SvgText>
        <rect x={765} y={115} width={90} height={42} rx="6" fill="#0f2745" stroke="#64748b" />
        <SvgText x={810} y={141} color="#cbd5e1" size={9}>FCS</SvgText>
        <SvgText x={460} y={200} color={tagged ? '#f59e0b' : '#475569'} size={11} bold>
          {tagged ? '↓ INSERT 802.1Q TAG AFTER SOURCE MAC ↓' : 'UNTAGGED FRAME'}
        </SvgText>
        <SvgText x={55} y={245} color="#94a3b8" size={10} bold anchor="start">AFTER</SvgText>
        <rect x={55} y={260} width={810} height={62} rx="10" fill="#0b1224" stroke={tagged ? '#f59e0b' : '#334155'} strokeWidth={tagged ? 2.2 : 1.4} />
        <rect x={65} y={270} width={130} height={42} rx="6" fill="#0f2745" stroke="#64748b" />
        <SvgText x={130} y={296} color="#cbd5e1" size={9}>DMAC</SvgText>
        <rect x={200} y={270} width={130} height={42} rx="6" fill="#0f2745" stroke="#64748b" />
        <SvgText x={265} y={296} color="#cbd5e1" size={9}>SMAC</SvgText>
        <rect x={335} y={270} width={120} height={42} rx="6" fill="#3b2a08" stroke="#f59e0b" strokeWidth={tagged ? 2 : 1} />
        <SvgText x={395} y={296} color="#f59e0b" size={9} bold>802.1Q TAG</SvgText>
        <rect x={460} y={270} width={140} height={42} rx="6" fill="#0f2745" stroke="#64748b" />
        <SvgText x={530} y={296} color="#cbd5e1" size={9}>ETHERTYPE</SvgText>
        <rect x={605} y={270} width={155} height={42} rx="6" fill="#0f2745" stroke="#64748b" />
        <SvgText x={682} y={296} color="#cbd5e1" size={9}>PAYLOAD</SvgText>
        <rect x={765} y={270} width={90} height={42} rx="6" fill="#0f2745" stroke="#64748b" />
        <SvgText x={810} y={296} color="#cbd5e1" size={9}>FCS</SvgText>
        {exploded && (
          <FrameBadge x={335} y={338} text="TPID | PCP | DEI | VID" color="#f59e0b" active w={170} />
        )}
        {s === 4 && <CheckMark x={545} y={360} color="#34d399" />}
        <Panel
          x={55}
          y={375}
          w={810}
          h={35}
          title="RECEIVING SWITCH"
          lines={s === 4 ? ['Reads the VID, then removes the tag before sending to an access port.'] : ['The tag is used on trunk links, not on ordinary end-device access links.']}
          color="#34d399"
          active
          size={8.7}
        />
      </svg>
    </StepShell>
  )
}

const tagFieldsStages = [
  'TPID هو أول جزء في الـ tag وقيمته الشائعة 0x8100، وبيقول إن الإطار 802.1Q tagged.',
  'PCP أو Priority Code Point طوله 3 bits وبيستخدم لـ Class of Service وترتيب الأولوية.',
  'DEI طوله 1 bit وبيوضح لو الإطار قابل للإسقاط تحت الازدحام.',
  'VID طوله 12 bits وبيحمل رقم الـ VLAN، وده أهم حقل في الـ tag.',
  'VLAN 0 و4095 محجوزين، وغالباً الـ usable IDs من 1 إلى 4094 مع مراعاة رنجات محجوزة ودعم المنصة.',
]

export function Dot1qTagFieldsDiagram() {
  const playback = useStepPlayback(tagFieldsStages.length)
  const s = playback.stage
  return (
    <StepShell title="IEEE 802.1Q TAG FIELD BREAKDOWN" playback={playback} legend={tagFieldsStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="IEEE 802.1Q tag field breakdown">
        <Note x={460} y={24} text="4-BYTE TAG = TPID (2 BYTES) + TCI (2 BYTES)" color="#94a3b8" size={9.8} />
        <rect x={55} y={70} width={810} height={90} rx="12" fill="#0b1224" stroke="#334155" strokeWidth={1.4} />
        <rect x={70} y={88} width={375} height={54} rx="8" fill="#3b2a08" stroke="#f59e0b" strokeWidth={s === 0 ? 2.4 : 1.2} opacity={s === 0 ? 1 : 0.6} />
        <SvgText x={257} y={112} color="#f59e0b" size={12} bold>TPID</SvgText>
        <SvgText x={257} y={131} color="#cbd5e1" size={9}>0x8100 | 16 bits</SvgText>
        <rect x={455} y={88} width={395} height={54} rx="8" fill="#0f2745" stroke="#38bdf8" strokeWidth={s >= 1 ? 2.4 : 1.2} opacity={s >= 1 ? 1 : 0.5} />
        <SvgText x={652} y={112} color="#38bdf8" size={12} bold>TCI - TAG CONTROL INFORMATION</SvgText>
        <SvgText x={652} y={131} color="#cbd5e1" size={9}>16 bits total</SvgText>
        <LinkLine x1={652} y1={160} x2={652} y2={202} color="#38bdf8" active={s >= 1} />
        <rect x={70} y={205} width={250} height={80} rx="10" fill="#0b1224" stroke="#a78bfa" strokeWidth={s === 1 ? 2.4 : 1.2} opacity={s === 1 ? 1 : 0.55} />
        <SvgText x={195} y={235} color="#a78bfa" size={11} bold>PCP - 3 bits</SvgText>
        <SvgText x={195} y={258} color="#cbd5e1" size={9}>Priority / Class of Service</SvgText>
        <rect x={335} y={205} width={250} height={80} rx="10" fill="#0b1224" stroke="#34d399" strokeWidth={s === 2 ? 2.4 : 1.2} opacity={s === 2 ? 1 : 0.55} />
        <SvgText x={460} y={235} color="#34d399" size={11} bold>DEI - 1 bit</SvgText>
        <SvgText x={460} y={258} color="#cbd5e1" size={9}>Drop Eligible Indicator</SvgText>
        <rect x={600} y={205} width={250} height={80} rx="10" fill="#0b1224" stroke="#f59e0b" strokeWidth={s >= 3 ? 2.4 : 1.2} opacity={s >= 3 ? 1 : 0.55} />
        <SvgText x={725} y={235} color="#f59e0b" size={11} bold>VID - 12 bits</SvgText>
        <SvgText x={725} y={258} color="#cbd5e1" size={9}>VLAN ID 1 - 4094</SvgText>
        <Panel
          x={70}
          y={315}
          w={780}
          h={70}
          title={s === 4 ? 'RESERVED VALUES' : 'WHY THE FIELDS MATTER'}
          lines={
            s === 4
              ? ['VID 0 and VID 4095 are reserved. Usable IDs are generally 1-4094, subject to platform support.']
              : ['TPID identifies the tag. PCP marks priority. DEI hints at drop eligibility. VID identifies the VLAN.']
          }
          color={s === 4 ? '#fb7185' : '#38bdf8'}
          active
          size={9}
        />
      </svg>
    </StepShell>
  )
}

const vlan10TrunkStages = [
  'PC-A في VLAN 10 على access port Gi0/1 في SW1.',
  'SW1 استلم الإطار untagged وربطه بـ VLAN 10 من عضوية المنفذ.',
  'SW1 بعت الإطار على trunk Gi0/24 مع 802.1Q tag VID 10.',
  'SW2 قرأ الـ tag وعرف إن الإطار جوّه VLAN 10.',
  'SW2 شال الـ tag وبعته untagged من access port لـ PC-B في نفس الـ VLAN.',
]

export function Vlan10CrossingTrunkDiagram() {
  const playback = useStepPlayback(vlan10TrunkStages.length)
  const s = playback.stage
  return (
    <StepShell title="VLAN 10 CROSSING A TRUNK" playback={playback} legend={vlan10TrunkStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="VLAN 10 frame crossing a trunk link">
        <Note x={460} y={24} text="SOURCE VLAN 10 | Gi0/1 -> SW1 -> TRUNK Gi0/24 -> SW2 -> Gi0/1 | DESTINATION VLAN 10" color="#94a3b8" size={8.7} />
        <Node x={45} y={145} w={150} h={64} label="PC-A" sub="VLAN 10 | Gi0/1" color="#38bdf8" tooltip="Source in VLAN 10" active />
        <Layer x={275} y={120} w={170} h={125} title="SW1" sub="access Gi0/1" color="#38bdf8" active />
        <Layer x={475} y={120} w={170} h={125} title="SW2" sub="access Gi0/1" color="#a78bfa" active={s >= 3} />
        <Node x={725} y={145} w={150} h={64} label="PC-B" sub="VLAN 10 | Gi0/1" color="#38bdf8" tooltip="Destination in VLAN 10" active={s >= 4} />
        <LinkLine x1={195} y1={177} x2={275} y2={177} color="#38bdf8" active={s >= 1} />
        <LinkLine x1={445} y1={182} x2={475} y2={182} color="#f59e0b" active={s >= 2} />
        <LinkLine x1={645} y1={177} x2={725} y2={177} color="#38bdf8" active={s >= 4} />
        {s <= 1 && <FrameBadge x={210} y={150} text="UNTAGGED" color="#38bdf8" active />}
        {s >= 2 && s <= 3 && <FrameBadge x={440} y={145} text="TAG VID 10" color="#f59e0b" active />}
        {s >= 4 && <FrameBadge x={645} y={150} text="UNTAGGED" color="#38bdf8" active />}
        {s >= 2 && <Packet point={{ x: 460, y: 182 }} color="#f59e0b" label="802.1Q" />}
        {s >= 4 && <CheckMark x={690} y={177} color="#34d399" />}
        <Panel
          x={55}
          y={300}
          w={810}
          h={90}
          title={s >= 4 ? 'LAYER 2 FORWARDING SUCCEEDED' : 'STEP BY STEP'}
          lines={
            s >= 4
              ? ['PC-A and PC-B are in VLAN 10 on different switches. The trunk preserved VLAN membership.']
              : ['Access side is untagged. Trunk side is tagged with VID 10. Receiving switch removes the tag before the access port.']
          }
          color="#34d399"
          active
          size={9.4}
        />
      </svg>
    </StepShell>
  )
}

const multiVlanTrunkStages = [
  'نفس الـ trunk بين SW1 وSW2 يحمل VLAN 10 وVLAN 20 في نفس الوقت.',
  'إطار VLAN 10 عليه VID 10، وإطار VLAN 20 عليه VID 20.',
  'سويتش الاستقبال بيقرأ الـ VID ويفصل الإطارات عن بعضها.',
  'VLAN 10 بيتوجّه لمنفذ Gi0/1، وVLAN 20 لمنفذ Gi0/2 في SW2.',
  'الـ tag بيمنع خلط الحركة حتى لو الرابط فيزيائي واحد.',
]

export function MultipleVlansOneTrunkDiagram() {
  const playback = useStepPlayback(multiVlanTrunkStages.length)
  const s = playback.stage
  const separated = s >= 2
  return (
    <StepShell title="MULTIPLE VLANs CROSSING ONE TRUNK" playback={playback} legend={multiVlanTrunkStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Multiple VLANs carried over one trunk link">
        <Note x={460} y={24} text="ONE PHYSICAL TRUNK - MANY TAGGED VLANs" color="#94a3b8" size={10} />
        <Layer x={285} y={120} w={170} h={145} title="SW1" sub="trunk Gi0/24" color="#f59e0b" active />
        <Layer x={465} y={120} w={170} h={145} title="SW2" sub="trunk Gi0/24" color="#f59e0b" active />
        <VlanTag x={55} y={110} text="VLAN 10" color="#38bdf8" active />
        <VlanTag x={55} y={210} text="VLAN 20" color="#34d399" active />
        <FrameBadge x={175} y={105} text="TAG VID 10" color="#38bdf8" active={s >= 1} />
        <FrameBadge x={175} y={205} text="TAG VID 20" color="#34d399" active={s >= 1} />
        <LinkLine x1={290} y1={105} x2={455} y2={105} color="#38bdf8" active={s >= 1} />
        <LinkLine x1={290} y1={205} x2={455} y2={205} color="#34d399" active={s >= 1} />
        {separated && <CheckMark x={660} y={105} color="#38bdf8" />}
        {separated && <CheckMark x={660} y={205} color="#34d399" />}
        <Node x={700} y={80} w={165} h={52} label="PC-A" sub="VLAN 10 | Gi0/1" color="#38bdf8" tooltip="VLAN 10 destination" active={separated} />
        <Node x={700} y={180} w={165} h={52} label="PC-C" sub="VLAN 20 | Gi0/2" color="#34d399" tooltip="VLAN 20 destination" active={separated} />
        <LinkLine x1={635} y1={105} x2={700} y2={106} color="#38bdf8" active={separated} />
        <LinkLine x1={635} y1={205} x2={700} y2={206} color="#34d399" active={separated} />
        <Panel
          x={55}
          y={315}
          w={810}
          h={75}
          title="VLAN SEPARATION"
          lines={['The VID in each tag tells SW2 which access port should receive the frame after the tag is removed.']}
          color="#34d399"
          active
        />
      </svg>
    </StepShell>
  )
}

const nativeUntaggedStages = [
  'على الـ trunk، أغلب الإطارات تكون tagged وتحمل VID.',
  'بس إطارات الـ Native VLAN بتتبعت untagged افتراضياً في إعداد Cisco شائع.',
  'لما SW2 يستلم إطار untagged على الـ trunk، بيربطه بالـ Native VLAN المكوّن عنده.',
  'في المثال ده Native VLAN = 99 على الطرفين.',
  'عشان كده لازم الطرفين يتفقوا على نفس رقم الـ Native VLAN.',
]

export function NativeVlanUntaggedDiagram() {
  const playback = useStepPlayback(nativeUntaggedStages.length)
  const s = playback.stage
  const assigned = s >= 2
  return (
    <StepShell title="NATIVE VLAN UNTAGGED TRAFFIC" playback={playback} legend={nativeUntaggedStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Native VLAN untagged traffic on a trunk">
        <Note x={460} y={24} text="UNTAGGED FRAME RECEIVED ON A TRUNK = NATIVE VLAN" color="#94a3b8" size={9.6} />
        <Layer x={250} y={105} w={180} h={155} title="SW1" sub="native vlan 99" color="#38bdf8" active />
        <Layer x={490} y={105} w={180} h={155} title="SW2" sub="native vlan 99" color="#a78bfa" active={assigned} />
        <LinkLine x1={430} y1={180} x2={490} y2={180} color="#f59e0b" active={s >= 1} />
        <FrameBadge x={420} y={140} text="UNTAGGED" color="#f59e0b" active={s >= 1} />
        <VlanTag x={300} y={285} text="NATIVE 99" color="#38bdf8" active={s >= 1} />
        {assigned && <VlanTag x={540} y={285} text="NATIVE 99" color="#a78bfa" active />}
        {assigned && <CheckMark x={460} y={285} color="#34d399" />}
        <Panel
          x={55}
          y={335}
          w={810}
          h={65}
          title="MATCH BOTH ENDS"
          lines={['SW1 sends the native VLAN untagged; SW2 assigns the untagged frame to its configured native VLAN.']}
          color="#34d399"
          active
        />
      </svg>
    </StepShell>
  )
}

const nativeMismatchStages = [
  'SW1 مكوّن `switchport trunk native vlan 99`.',
  'SW2 مكوّن `switchport trunk native vlan 100` بالغلط.',
  'SW1 بيرسل إطار untagged جوّه VLAN 99 على الـ trunk.',
  'SW2 يستلمه untagged ويعتبره جوّه VLAN 100.',
  'النتيجة: تسريب منطقي بين VLANs ومشاكل connectivity وSTP؛ لازم يتطابقوا.',
]

export function NativeVlanMismatchDiagram() {
  const playback = useStepPlayback(nativeMismatchStages.length)
  const s = playback.stage
  const mismatch = s >= 1
  const leaked = s >= 3
  return (
    <StepShell title="NATIVE VLAN MISMATCH" playback={playback} legend={nativeMismatchStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Native VLAN mismatch between two trunk ports">
        <Note x={460} y={24} text="BOTH ENDS OF A TRUNK MUST AGREE ON THE NATIVE VLAN" color="#94a3b8" size={9.4} />
        <Layer x={255} y={105} w={185} h={155} title="SW1" sub="native vlan 99" color="#38bdf8" active />
        <Layer x={480} y={105} w={185} h={155} title="SW2" sub={mismatch ? 'native vlan 100' : 'native vlan 99'} color={mismatch ? '#fb7185' : '#a78bfa'} active />
        <LinkLine x1={440} y1={180} x2={480} y2={180} color="#f59e0b" active={s >= 2} />
        <FrameBadge x={410} y={140} text="UNTAGGED" color="#f59e0b" active={s >= 2} />
        <VlanTag x={290} y={290} text="VLAN 99" color="#38bdf8" active={s >= 2} />
        {mismatch && <CrossMark x={460} y={180} color="#fb7185" />}
        {leaked && <VlanTag x={565} y={290} text="VLAN 100" color="#fb7185" active />}
        {leaked && <Note x={460} y={345} text="FRAME LANDED IN THE WRONG VLAN" color="#fb7185" size={9.4} />}
        <Panel
          x={55}
          y={355}
          w={810}
          h={45}
          title="FIX"
          lines={['Configure the same native VLAN on both sides and consider pruning it from the trunk.']}
          color="#34d399"
          active
          size={8.8}
        />
      </svg>
    </StepShell>
  )
}

const allowedVlanStages = [
  'على أغلب Cisco switches، الـ trunk يسمح بكل الـ VLANs افتراضياً.',
  'Allowed VLAN list بيحدد أنهي VLANs مسموح لها تمر على الـ trunk.',
  'في المثال ده المسموح `10,20,99` بس.',
  'VLAN 30 مش في القائمة، فالإطار بتاعها بيتوقف عند الـ trunk.',
  '`add` يضيف VLAN للقائمة، و`remove` يشيل VLAN منها من غير إعادة كتابة القائمة كلها.',
]

const allowedVlanRows = [
  { vlan: '10', color: '#38bdf8' },
  { vlan: '20', color: '#34d399' },
  { vlan: '99', color: '#a78bfa' },
  { vlan: '30', color: '#fb7185' },
]

export function AllowedVlanFilteringDiagram() {
  const playback = useStepPlayback(allowedVlanStages.length)
  const s = playback.stage
  const filtered = s >= 2
  return (
    <StepShell title="ALLOWED VLAN LIST FILTERING" playback={playback} legend={allowedVlanStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Allowed VLAN list filtering on a trunk">
        <Note x={460} y={24} text="TRUNK ONLY FORWARDS VLANs IN THE ALLOWED LIST" color="#94a3b8" size={9.5} />
        <Layer x={55} y={100} w={150} h={215} title="SW1" sub="source VLANs" color="#38bdf8" active />
        <Layer x={715} y={100} w={150} h={215} title="SW2" sub="destination" color="#a78bfa" active={filtered} />
        <rect x={350} y={85} width={180} height={250} rx="12" fill="#0b1224" stroke="#f59e0b" strokeWidth={filtered ? 2.3 : 1.2} />
        <SvgText x={440} y={112} color="#f59e0b" size={10} bold>TRUNK FILTER</SvgText>
        <SvgText x={440} y={132} color="#cbd5e1" size={8.8}>allowed: 10,20,99</SvgText>
        {allowedVlanRows.map((row, index) => {
          const allowed = row.vlan !== '30' || !filtered
          const y = 160 + index * 45
          return (
            <g key={row.vlan} opacity={allowed ? 1 : 0.45}>
              <LinkLine x1={205} y1={y} x2={350} y2={y} color={row.color} active={allowed} />
              {allowed ? <CheckMark x={440} y={y} color="#34d399" /> : <CrossMark x={440} y={y} color="#fb7185" />}
              <LinkLine x1={530} y1={y} x2={715} y2={y} color={row.color} active={allowed} />
              <VlanTag x={555} y={y - 12} text={`VID ${row.vlan}`} color={row.color} active={allowed} w={78} />
            </g>
          )
        })}
        <Panel
          x={55}
          y={360}
          w={810}
          h={45}
          title="COMMAND FORMS"
          lines={['`allowed vlan 10,20,99` replaces the list. `add 30` and `remove 20` modify it safely.']}
          color="#f59e0b"
          active
          size={8.8}
        />
      </svg>
    </StepShell>
  )
}

const dtpNegotiationStages = [
  'DTP هو بروتوكول خاص بشركة Cisco وبيعمل negotiation لتكوين الـ trunk تلقائياً بين منفذين.',
  'Dynamic Desirable بيبادر بمحاولة عمل trunk.',
  'Dynamic Auto بيستنتظر الطرف التاني يبادر.',
  'Desirable + Auto = trunk، وAuto + Auto = غالباً access.',
  ' explicit trunk مع `switchport nonegotiate` بيدي سلوك متوقع خصوصاً مع أجهزة غير Cisco.',
]

export function DtpNegotiationDiagram() {
  const playback = useStepPlayback(dtpNegotiationStages.length)
  const s = playback.stage
  const negotiating = s >= 1
  const trunk = s >= 3
  return (
    <StepShell title="DTP NEGOTIATION BETWEEN SWITCHES" playback={playback} legend={dtpNegotiationStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="DTP negotiation between two switch ports">
        <Note x={460} y={24} text="DTP = CISCO PROPRIETARY TRUNK NEGOTIATION" color="#94a3b8" size={9.6} />
        <Layer x={230} y={105} w={185} h={150} title="SW1" sub={s <= 1 ? 'dynamic desirable' : 'dynamic auto'} color="#38bdf8" active />
        <Layer x={505} y={105} w={185} h={150} title="SW2" sub="dynamic auto" color="#a78bfa" active={negotiating} />
        <LinkLine x1={415} y1={180} x2={505} y2={180} color={trunk ? '#34d399' : '#f59e0b'} active={negotiating} />
        {s === 1 && <Packet point={{ x: 460, y: 180 }} color="#f59e0b" label="DTP" />}
        {s === 2 && <Note x={460} y={150} text="WAITING..." color="#f59e0b" size={9} />}
        {trunk && <FrameBadge x={420} y={140} text="TRUNK UP" color="#34d399" active />}
        {trunk && <CheckMark x={460} y={220} color="#34d399" />}
        <Panel
          x={55}
          y={300}
          w={810}
          h={85}
          title={s === 4 ? 'PREFERRED OPERATION' : 'NEGOTIATION RESULT'}
          lines={
            s === 4
              ? ['Explicit `switchport mode trunk` plus `switchport nonegotiate` is predictable when supported.']
              : ['A desirable port actively proposes trunking. An auto port waits and responds rather than initiating.']
          }
          color={s === 4 ? '#f59e0b' : '#34d399'}
          active
          size={9.3}
        />
      </svg>
    </StepShell>
  )
}

const dtpMatrixStages = [
  'access بيفرض وضع access، ومفيش trunk حتى لو الطرف التاني حاول.',
  'trunk بيفرض trunk، لكن لازم الطرف التاني يكون متوافق عشان الرابط يشتغل صح.',
  'auto + auto: مفيش طرف يبادر، فالنتيجة غالباً access.',
  'auto + desirable: الـ desirable يبادر والنتيجة trunk.',
  'الدعم بيختلف حسب المنصة؛ explicit config مع nonegotiate غالباً أفضل.',
]

export function DtpModeMatrixDiagram() {
  const playback = useStepPlayback(dtpMatrixStages.length)
  const s = playback.stage
  const rows = [
    { a: 'access', b: 'any', result: 'ACCESS', ok: false, stage: 0 },
    { a: 'trunk', b: 'compatible trunk', result: 'TRUNK', ok: true, stage: 1 },
    { a: 'auto', b: 'auto', result: 'ACCESS', ok: false, stage: 2 },
    { a: 'auto', b: 'desirable', result: 'TRUNK', ok: true, stage: 3 },
  ]
  return (
    <StepShell title="DTP MODE COMPATIBILITY MATRIX" playback={playback} legend={dtpMatrixStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="DTP mode compatibility matrix">
        <Note x={460} y={24} text="COMMON DTP OUTCOMES - PLATFORM SUPPORT VARIES" color="#94a3b8" size={9.6} />
        <rect x={70} y={70} width={780} height={270} rx="12" fill="#0b1224" stroke="#334155" strokeWidth={1.4} />
        <SvgText x={215} y={100} color="#94a3b8" size={10} bold>SW1 MODE</SvgText>
        <SvgText x={460} y={100} color="#94a3b8" size={10} bold>SW2 MODE</SvgText>
        <SvgText x={720} y={100} color="#94a3b8" size={10} bold>RESULT</SvgText>
        {rows.map((row, index) => {
          const y = 130 + index * 48
          const active = s >= row.stage
          return (
            <g key={row.a + row.b} opacity={active ? 1 : 0.35}>
              <rect x={90} y={y - 22} width={740} height={38} rx="8" fill={active ? '#0f2745' : 'transparent'} stroke={row.ok ? '#34d399' : '#fb7185'} strokeWidth={active ? 1.6 : 0.8} />
              <SvgText x={215} y={y + 2} color="#cbd5e1" size={10}>{row.a}</SvgText>
              <SvgText x={460} y={y + 2} color="#cbd5e1" size={10}>{row.b}</SvgText>
              <SvgText x={720} y={y + 2} color={row.ok ? '#34d399' : '#fb7185'} size={10} bold>{row.result}</SvgText>
              {row.ok ? <CheckMark x={805} y={y - 2} color="#34d399" /> : <CrossMark x={805} y={y - 2} color="#fb7185" />}
            </g>
          )
        })}
        <Panel
          x={70}
          y={355}
          w={780}
          h={45}
          title={s === 4 ? 'EXPLICIT IS PREDICTABLE' : 'REMEMBER'}
          lines={s === 4 ? ['DTP may be unavailable or disabled; always verify the operational trunk state.'] : ['Desirable initiates. Auto waits. Access and trunk force their mode.']}
          color={s === 4 ? '#f59e0b' : '#38bdf8'}
          active
          size={8.8}
        />
      </svg>
    </StepShell>
  )
}

const endToEndStages = [
  'PC-A (VLAN 10, Gi0/1 على SW1) عايز يوصل لـ PC-B (VLAN 10, Gi0/1 على SW2).',
  'SW1 بيبعت الإطار على الـ trunk Gi0/24 مع 802.1Q tag VID 10.',
  'SW2 بيقرأ VID 10، يشيل الـ tag، ويبعت الإطار من access port لـ PC-B.',
  'PC-C في VLAN 20 على SW1 مش هيقدر يتكلم مع PC-B في VLAN 20 من غير Layer 3 routing.',
  'النتيجة: نفس الـ VLAN عبر سويتشات بيشتغل على Layer 2، والـ VLANs المختلفة لسه محتاجة routing.',
]

export function EndToEndTwoSwitchesDiagram() {
  const playback = useStepPlayback(endToEndStages.length)
  const s = playback.stage
  const delivered = s >= 2
  const differentVlan = s >= 3
  return (
    <StepShell title="END-TO-END COMMUNICATION ACROSS TWO SWITCHES" playback={playback} legend={endToEndStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="End-to-end communication across two switches over a trunk">
        <Note x={460} y={24} text="SAME VLAN ACROSS SWITCHES = LAYER 2 SUCCESS" color="#94a3b8" size={9.5} />
        <Node x={45} y={90} w={150} h={58} label="PC-A" sub="VLAN 10 | Gi0/1" color="#38bdf8" tooltip="Source VLAN 10" active />
        <Node x={45} y={205} w={150} h={58} label="PC-C" sub="VLAN 20 | Gi0/2" color="#34d399" tooltip="Different VLAN source" active={differentVlan} />
        <Layer x={275} y={110} w={155} h={135} title="SW1" sub="trunk Gi0/24" color="#38bdf8" active />
        <Layer x={490} y={110} w={155} h={135} title="SW2" sub="trunk Gi0/24" color="#a78bfa" active />
        <Node x={725} y={90} w={150} h={58} label="PC-B" sub="VLAN 10 | Gi0/1" color="#38bdf8" tooltip="Destination VLAN 10" active={delivered} />
        <Node x={725} y={205} w={150} h={58} label="PC-D" sub="VLAN 20 | Gi0/2" color="#34d399" tooltip="VLAN 20 destination" active={differentVlan} />
        <LinkLine x1={195} y1={119} x2={275} y2={145} color="#38bdf8" active />
        <LinkLine x1={430} y1={178} x2={490} y2={178} color="#f59e0b" active={s >= 1} />
        <LinkLine x1={645} y1={145} x2={725} y2={119} color="#38bdf8" active={delivered} />
        {s >= 1 && <FrameBadge x={420} y={135} text="TAG VID 10" color="#f59e0b" active />}
        {delivered && <CheckMark x={685} y={119} color="#34d399" />}
        {differentVlan && <CrossMark x={580} y={234} color="#fb7185" />}
        {differentVlan && <Note x={460} y={280} text="VLAN 20 -> VLAN 10 NEEDS LAYER 3 ROUTING" color="#fb7185" size={9.2} />}
        <Panel
          x={55}
          y={330}
          w={810}
          h={65}
          title="FINAL RESULT"
          lines={['The trunk extends VLANs across switches. It does not route between different VLANs.']}
          color="#34d399"
          active
        />
      </svg>
    </StepShell>
  )
}
