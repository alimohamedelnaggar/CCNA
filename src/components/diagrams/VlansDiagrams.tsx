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
  w = 88,
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

function CrossMark({ x, y, color = '#fb7185' }: { x: number; y: number; color?: string }) {
  return (
    <g stroke={color} strokeWidth="2.6" strokeLinecap="round">
      <line x1={x - 8} y1={y - 8} x2={x + 8} y2={y + 8} />
      <line x1={x + 8} y1={y - 8} x2={x - 8} y2={y + 8} />
    </g>
  )
}

const physicalVsVlanStages = [
  'في الـ physical LAN العادي، كل الأجهزة على نفس السويتش وفي نفس الـ broadcast domain.',
  'لو PC بعت broadcast، كل PCs التانية على السويتش تستلم copy.',
  'الـ VLAN بيقسّم السويتش منطقياً إلى broadcast domains منفصلة على نفس الهاردوير.',
  'IEEE 802.1Q بيضيف VLAN ID للإطار جوّه الـ trunk؛ هنا بنشوف الفكرة بس من غير إعداد trunk.',
  'النتيجة: HR وFinance وIT يتقاسموا السويتش وفي نفس الوقت حركتهم معزولة.',
]

export function PhysicalVsVlanSegmentationDiagram() {
  const playback = useStepPlayback(physicalVsVlanStages.length)
  const s = playback.stage
  const flat = s <= 1
  const segmented = s >= 2
  return (
    <StepShell title="PHYSICAL LAN vs VLAN SEGMENTATION" playback={playback} legend={physicalVsVlanStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Physical LAN compared with VLAN segmentation">
        <Note x={460} y={24} text="SAME SWITCH - DIFFERENT LOGICAL SEGMENTATION" color="#94a3b8" size={10} />
        <g opacity={flat ? 1 : 0.4}>
          <Layer x={35} y={60} w={410} h={265} title="PHYSICAL FLAT LAN" sub="one broadcast domain" color="#64748b" active={flat} />
          <Node x={180} y={165} w={130} h={58} label="SWITCH" sub="all ports" color="#64748b" tooltip="Flat switch" active={flat} />
          <Node x={55} y={90} w={95} h={46} label="PC-A" sub="HR" color="#38bdf8" tooltip="HR PC" />
          <Node x={55} y={245} w={95} h={46} label="PC-B" sub="FIN" color="#a78bfa" tooltip="Finance PC" />
          <Node x={330} y={90} w={95} h={46} label="PC-C" sub="IT" color="#34d399" tooltip="IT PC" />
          <LinkLine x1={180} y1={194} x2={150} y2={113} color="#94a3b8" active={flat} />
          <LinkLine x1={180} y1={194} x2={150} y2={268} color="#94a3b8" active={flat} />
          <LinkLine x1={310} y1={194} x2={330} y2={113} color="#94a3b8" active={flat} />
          {s === 1 && <Packet point={{ x: 245, y: 194 }} color="#f59e0b" label="broadcast" />}
        </g>
        <g opacity={segmented ? 1 : 0.4}>
          <Layer x={475} y={60} w={410} h={265} title="VLAN SEGMENTED LAN" sub="three broadcast domains" color="#34d399" active={segmented} />
          <Node x={620} y={165} w={130} h={58} label="SWITCH" sub="VLAN aware" color="#34d399" tooltip="VLAN switch" active={segmented} />
          <Node x={495} y={90} w={95} h={46} label="PC-A" sub="HR" color="#38bdf8" tooltip="HR PC" active={segmented} />
          <Node x={495} y={245} w={95} h={46} label="PC-B" sub="FIN" color="#a78bfa" tooltip="Finance PC" active={segmented} />
          <Node x={790} y={90} w={95} h={46} label="PC-C" sub="IT" color="#34d399" tooltip="IT PC" active={segmented} />
          <VlanTag x={595} y={82} text="VLAN 10" color="#38bdf8" active={segmented} />
          <VlanTag x={595} y={237} text="VLAN 20" color="#a78bfa" active={segmented} />
          <VlanTag x={770} y={138} text="VLAN 30" color="#34d399" active={segmented} />
          <LinkLine x1={620} y1={194} x2={590} y2={113} color="#38bdf8" active={segmented} />
          <LinkLine x1={620} y1={194} x2={590} y2={268} color="#a78bfa" active={segmented} />
          <LinkLine x1={750} y1={194} x2={790} y2={113} color="#34d399" active={segmented} />
        </g>
        <Panel
          x={35}
          y={345}
          w={850}
          h={58}
          title="CCNA POINT"
          lines={['A VLAN is a logical Layer 2 broadcast domain. It is not a new physical switch.']}
          color="#38bdf8"
          active
        />
      </svg>
    </StepShell>
  )
}

const multiVlanStages = [
  'سويتح فيزيائي واحد ممكن يحمل أكتر من VLAN في نفس الوقت.',
  'كل VLAN ليها ID، زي VLAN 10 وVLAN 20 وVLAN 30.',
  'كل منفذ access بيتبع VLAN واحد؛ المنفذ مش عضو في كل الـ VLANs.',
  'الإطار بيحتفظ بعضويته للـ VLAN، فمش مفروض يوصل لمنفذ في VLAN تاني.',
  'الفكرة: تنظيم أسهل وتقليل حركة broadcast من غير تغيير الكابلات.',
]

export function MultipleVlansOneSwitchDiagram() {
  const playback = useStepPlayback(multiVlanStages.length)
  const s = playback.stage
  const groups = [
    { name: 'VLAN 10', color: '#38bdf8', pcs: ['PC-A', 'PC-B'], y: 85 },
    { name: 'VLAN 20', color: '#a78bfa', pcs: ['PC-C', 'PC-D'], y: 180 },
    { name: 'VLAN 30', color: '#34d399', pcs: ['PC-E', 'PC-F'], y: 275 },
  ]
  return (
    <StepShell title="MULTIPLE VLANs ON ONE SWITCH" playback={playback} legend={multiVlanStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Multiple VLAN groups on one physical switch">
        <Note x={460} y={24} text="ONE PHYSICAL DEVICE - MULTIPLE LOGICAL NETWORKS" color="#94a3b8" size={10} />
        <Layer x={360} y={125} w={200} h={170} title="SWITCH" sub="VLAN database" color="#f59e0b" active />
        {groups.map((group, index) => {
          const active = s === 0 || s === index + 1 || s >= 4
          return (
            <g key={group.name} opacity={active ? 1 : 0.35}>
              <VlanTag x={55} y={group.y - 22} text={group.name} color={group.color} active={active} />
              <Node x={55} y={group.y} w={110} h={48} label={group.pcs[0]} sub="access" color={group.color} tooltip={group.pcs[0]} active={active} />
              <Node x={195} y={group.y} w={110} h={48} label={group.pcs[1]} sub="access" color={group.color} tooltip={group.pcs[1]} active={active} />
              <Node x={755} y={group.y} w={110} h={48} label={`PORT ${index + 1}`} sub={group.name} color={group.color} tooltip="Switch port" active={active} />
              <LinkLine x1={305} y1={group.y + 24} x2={360} y2={170 + index * 24} color={group.color} active={active} />
              <LinkLine x1={560} y1={170 + index * 24} x2={755} y2={group.y + 24} color={group.color} active={active} />
            </g>
          )
        })}
        <Panel
          x={55}
          y={348}
          w={810}
          h={56}
          title="MEMBERSHIP"
          lines={['A VLAN ID identifies the broadcast domain. Access ports belong to one data VLAN at a time.']}
          color="#34d399"
          active
        />
      </svg>
    </StepShell>
  )
}

const broadcastDomainStages = [
  'Broadcast domain هي المنطقة اللي وصول broadcast ليها بيحصل لكل أعضائها.',
  'من غير VLAN، كل PCs على السويتش في domain واحدة كبيرة.',
  'مع VLANs، كل VLAN بقت broadcast domain مستقلة.',
  'Broadcast من VLAN 10 مش هيوصل لـ VLAN 20 أو VLAN 30.',
  'عشان كده VLAN بيقلل حركة البroadcast وبيحسن التنظيم والأمان النسبي.',
]

export function VlansBroadcastDomainsDiagram() {
  const playback = useStepPlayback(broadcastDomainStages.length)
  const s = playback.stage
  const domains = [
    { name: 'BROADCAST DOMAIN - VLAN 10', color: '#38bdf8', x: 35, pc: 'PC-A', port: 'Gi0/1' },
    { name: 'BROADCAST DOMAIN - VLAN 20', color: '#a78bfa', x: 325, pc: 'PC-B', port: 'Gi0/2' },
    { name: 'BROADCAST DOMAIN - VLAN 30', color: '#34d399', x: 615, pc: 'PC-C', port: 'Gi0/3' },
  ]
  return (
    <StepShell title="VLANs AS BROADCAST DOMAINS" playback={playback} legend={broadcastDomainStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Each VLAN is a separate broadcast domain">
        <Note x={460} y={24} text="EACH VLAN = ONE LAYER 2 BROADCAST DOMAIN" color="#94a3b8" size={10} />
        {domains.map((domain, index) => {
          const active = s >= 2 || (s === 1 && index === 0)
          return (
            <g key={domain.name} opacity={active ? 1 : 0.35}>
              <rect x={domain.x} y={70} width={270} height={235} rx="16" fill="none" stroke={domain.color} strokeOpacity={0.4} strokeDasharray="7 6" strokeWidth={active ? 2 : 1} />
              <Note x={domain.x + 135} y={95} text={domain.name} color={domain.color} size={8.6} />
              <Node x={domain.x + 75} y={145} w={120} h={56} label={domain.pc} sub={domain.port} color={domain.color} tooltip={domain.pc} active={active} />
              <Node x={domain.x + 75} y={225} w={120} h={48} label={`PC-${index + 4}`} sub="member" color={domain.color} tooltip="Same VLAN member" active={active} />
              <LinkLine x1={domain.x + 135} y1={201} x2={domain.x + 135} y2={225} color={domain.color} active={active} />
              {s >= 3 && index === 0 && <Packet point={{ x: domain.x + 135, y: 212 }} color="#f59e0b" label="broadcast" />}
            </g>
          )
        })}
        <Panel
          x={35}
          y={330}
          w={850}
          h={72}
          title={s === 4 ? 'WHY IT MATTERS' : 'LAYER 2 BOUNDARY'}
          lines={
            s === 4
              ? ['Less broadcast traffic, clearer organization, and logical separation between departments.']
              : ['A switch does not forward a frame between VLANs at Layer 2. Layer 3 routing is required.']
          }
          color={s === 4 ? '#34d399' : '#f59e0b'}
          active
        />
      </svg>
    </StepShell>
  )
}

const departmentStages = [
  'شركة عندها HR وFinance وSales وIT على نفس السويتش الفيزيائي.',
  'من غير VLAN، كل الموظفين في نفس الـ broadcast domain.',
  'بنعمل VLAN لكل قسم: HR=10 وFinance=20 وSales=30 وIT=40.',
  'كل قسم يشوف حركة قسمه فقط في الـ Layer 2.',
  'ده بيدي تنظيم أوضح وعزل منطقي؛ السياسات والأمان التفصيلي بيجي في مواضيع تانية.',
]

export function DepartmentVlanSegmentationDiagram() {
  const playback = useStepPlayback(departmentStages.length)
  const s = playback.stage
  const depts = [
    { name: 'HR', vlan: 'VLAN 10', color: '#38bdf8', x: 55, y: 80 },
    { name: 'FINANCE', vlan: 'VLAN 20', color: '#a78bfa', x: 520, y: 80 },
    { name: 'SALES', vlan: 'VLAN 30', color: '#34d399', x: 55, y: 210 },
    { name: 'IT', vlan: 'VLAN 40', color: '#f59e0b', x: 520, y: 210 },
  ]
  return (
    <StepShell title="DEPARTMENT VLAN SEGMENTATION" playback={playback} legend={departmentStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Department VLAN segmentation on one switch">
        <Note x={460} y={24} text="ONE SWITCH INFRASTRUCTURE - FOUR LOGICAL DEPARTMENTS" color="#94a3b8" size={9.8} />
        <Layer x={370} y={155} w={180} h={105} title="SWITCH" sub="shared physical fabric" color="#64748b" active />
        {depts.map((dept, index) => {
          const active = s >= 2
          return (
            <g key={dept.name} opacity={active ? 1 : 0.4}>
              <rect x={dept.x} y={dept.y} width={345} height={105} rx="12" fill="#0b1224" stroke={dept.color} strokeWidth={active ? 2.2 : 1} />
              <SvgText x={dept.x + 172} y={dept.y + 26} color={dept.color} size={11} bold>{dept.name}</SvgText>
              <VlanTag x={dept.x + 120} y={dept.y + 66} text={dept.vlan} color={dept.color} active={active} />
              <LinkLine x1={dept.x + 345} y1={dept.y + 52} x2={460} y2={205 + (index % 2) * 12} color={dept.color} active={active} />
            </g>
          )
        })}
        <Panel
          x={55}
          y={340}
          w={810}
          h={62}
          title="RESULT"
          lines={['Departments share cabling and switch ports while their Layer 2 traffic stays logically separated.']}
          color="#34d399"
          active
        />
      </svg>
    </StepShell>
  )
}

const accessPortStages = [
  'Access port هو منفذ سويتش مخصص لجهاز end device زي PC أو Printer.',
  'في المثال ده PC-A على Gi0/1 وPC-B على Gi0/2، والاتنين في VLAN 10.',
  'الإطار القادم من PC بيكون untagged؛ السويتش يعرف VLAN من عضوية المنفذ.',
  'لأن الاتنين في نفس الـ VLAN، التوجيه المباشر على Layer 2 ممكن.',
  'Access port مش trunk port؛ الـ trunk بيحمل VLANs متعددة بين أجهزة الشبكة ويتفصل في Topic 2.2.',
]

export function DataVlanAccessPortDiagram() {
  const playback = useStepPlayback(accessPortStages.length)
  const s = playback.stage
  const sameVlan = s >= 3
  return (
    <StepShell title="DATA VLAN AND ACCESS PORT" playback={playback} legend={accessPortStages[s]}>
      <svg viewBox="0 0 920 410" className="h-auto w-full min-w-[860px]" role="img" aria-label="Two access ports assigned to data VLAN 10">
        <Note x={460} y={24} text="ONE DATA VLAN PER ACCESS PORT - UNTAGGED END DEVICE TRAFFIC" color="#94a3b8" size={9.6} />
        <Node x={55} y={135} w={150} h={70} label="PC-A" sub="Gi0/1 | VLAN 10" color="#38bdf8" tooltip="PC-A in VLAN 10" active />
        <Node x={715} y={135} w={150} h={70} label="PC-B" sub="Gi0/2 | VLAN 10" color="#38bdf8" tooltip="PC-B in VLAN 10" active />
        <Layer x={320} y={110} w={280} h={120} title="SWITCH" sub="access ports for VLAN 10" color="#34d399" active />
        <VlanTag x={370} y={155} text="DATA VLAN 10" color="#38bdf8" active />
        <LinkLine x1={205} y1={170} x2={320} y2={170} color="#38bdf8" active={s >= 2} />
        <LinkLine x1={600} y1={170} x2={715} y2={170} color="#38bdf8" active={sameVlan} />
        {s >= 2 && <Packet point={{ x: 260, y: 170 }} color="#38bdf8" label="untagged" />}
        {sameVlan && <Packet point={{ x: 655, y: 170 }} color="#34d399" label="L2 OK" />}
        <Panel
          x={55}
          y={270}
          w={810}
          h={118}
          title={s === 4 ? 'ACCESS vs TRUNK' : 'WHY IT WORKS'}
          lines={
            s === 4
              ? ['Access port = one data VLAN for an end device.', 'Trunk port = multiple VLANs between switches; covered in Topic 2.2.']
              : ['The switch associates the incoming untagged frame with the VLAN configured on the port.', 'PC-A and PC-B share VLAN 10, so they share a Layer 2 broadcast domain.']
          }
          color={s === 4 ? '#f59e0b' : '#34d399'}
          active
          size={9.5}
        />
      </svg>
    </StepShell>
  )
}

const vlanCreateStages = [
  'أدخل `enable` ثم `configure terminal` للوصول إلى وضع التكوين العام.',
  'أنشئ VLAN 10 باستخدام `vlan 10` وادخل VLAN configuration mode.',
  'أعطِ الـ VLAN اسماً واضحاً باستخدام `name SALES`.',
  'كرّر إنشاء VLAN 20 باسم HR وVLAN 30 باسم FINANCE.',
  '`end` يرجع إلى privileged EXEC. إنشاء الـ VLAN وإسناد المنافذ إليها خطوتان مختلفتان.',
]

export function VlanCreationProcessDiagram() {
  const playback = useStepPlayback(vlanCreateStages.length)
  const s = playback.stage
  const lines = [
    { text: 'enable', stage: 0 },
    { text: 'configure terminal', stage: 0 },
    { text: 'vlan 10', stage: 1 },
    { text: ' name SALES', stage: 2 },
    { text: 'vlan 20', stage: 3 },
    { text: ' name HR', stage: 3 },
    { text: 'vlan 30', stage: 3 },
    { text: ' name FINANCE', stage: 3 },
    { text: 'end', stage: 4 },
  ]
  const created = [
    { vlan: '10', name: 'SALES', color: '#38bdf8', stage: 1 },
    { vlan: '20', name: 'HR', color: '#a78bfa', stage: 3 },
    { vlan: '30', name: 'FINANCE', color: '#34d399', stage: 3 },
  ]
  return (
    <StepShell title="VLAN CREATION PROCESS" playback={playback} legend={vlanCreateStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Cisco IOS VLAN creation command sequence">
        <Note x={460} y={24} text="GLOBAL CONFIGURATION MODE CREATES THE VLAN DATABASE ENTRIES" color="#94a3b8" size={9.6} />
        <rect x={45} y={60} width={470} height={285} rx="12" fill="#0b1224" stroke="#334155" strokeWidth={1.3} />
        <Note x={280} y={87} text="CLI SEQUENCE" color="#94a3b8" size={9.5} />
        {lines.map((line, index) => {
          const active = s >= line.stage
          return (
            <SvgText key={index} x={70} y={120 + index * 24} color={active ? '#cbd5e1' : '#475569'} size={10.5} anchor="start" bold={active && line.text.startsWith('vlan')}>
              {`Switch# ${line.text}`}
            </SvgText>
          )
        })}
        <rect x={545} y={60} width={330} height={285} rx="12" fill="#0b1224" stroke="#334155" strokeWidth={1.3} />
        <Note x={710} y={87} text="VLAN DATABASE" color="#94a3b8" size={9.5} />
        {created.map((item, index) => {
          const active = s >= item.stage
          return (
            <g key={item.vlan} opacity={active ? 1 : 0.35}>
              <rect x={575} y={110 + index * 70} width={270} height={55} rx="9" fill="#0a1730" stroke={item.color} strokeWidth={active ? 2 : 1} />
              <SvgText x={710} y={134 + index * 70} color={item.color} size={11} bold>{`VLAN ${item.vlan}`}</SvgText>
              <SvgText x={710} y={153 + index * 70} color="#cbd5e1" size={9}>{`Name: ${item.name}`}</SvgText>
            </g>
          )
        })}
        <Panel
          x={45}
          y={360}
          w={830}
          h={45}
          title="SEPARATE STEP"
          lines={['Creating a VLAN does not place any port in it. Port assignment comes next.']}
          color="#f59e0b"
          active
        />
      </svg>
    </StepShell>
  )
}

const assignPortStages = [
  'ادخل إلى interface configuration mode وحدّد المنفذ الفيزيائي المطلوب.',
  '`switchport mode access` يضبط المنفذ في وضع access.',
  '`switchport access vlan 10` يجعل المنفذ عضواً في VLAN 10.',
  '`no shutdown` يضمن أن المنفذ administratively up، و`end` ينهي التكوين.',
  'لمجموعة منافذ استخدم `interface range GigabitEthernet0/1 - 4` لتطبيق الإعداد دفعة واحدة.',
]

export function PortVlanAssignmentDiagram() {
  const playback = useStepPlayback(assignPortStages.length)
  const s = playback.stage
  const lines = [
    { text: 'configure terminal', stage: 0 },
    { text: 'interface GigabitEthernet0/1', stage: 0 },
    { text: ' switchport mode access', stage: 1 },
    { text: ' switchport access vlan 10', stage: 2 },
    { text: ' no shutdown', stage: 3 },
    { text: 'end', stage: 3 },
    { text: 'interface range GigabitEthernet0/1 - 4', stage: 4 },
  ]
  return (
    <StepShell title="PORT-TO-VLAN ASSIGNMENT" playback={playback} legend={assignPortStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Assigning a switch access port to VLAN 10">
        <Note x={460} y={24} text="INTERFACE CONFIGURATION MODE APPLIES VLAN MEMBERSHIP TO A PORT" color="#94a3b8" size={9.2} />
        <rect x={45} y={60} width={500} height={285} rx="12" fill="#0b1224" stroke="#334155" strokeWidth={1.3} />
        <Note x={295} y={87} text="IOS COMMANDS" color="#94a3b8" size={9.5} />
        {lines.map((line, index) => {
          const active = s >= line.stage
          const isRange = index === 6
          return (
            <SvgText key={index} x={70} y={122 + index * 30} color={active ? (isRange ? '#f59e0b' : '#cbd5e1') : '#475569'} size={isRange ? 9.4 : 10.2} anchor="start" bold={active && line.text.includes('access vlan')}>
              {`Switch(config)# ${line.text}`}
            </SvgText>
          )
        })}
        <g opacity={s >= 2 ? 1 : 0.4}>
          <rect x={575} y={75} width={300} height={250} rx="12" fill="#0b1224" stroke="#38bdf8" strokeWidth={s >= 2 ? 2.2 : 1} />
          <Note x={725} y={104} text="PORT STATE" color="#38bdf8" size={9.5} />
          <SvgText x={725} y={140} color="#cbd5e1" size={10}>Interface: Gi0/1</SvgText>
          <SvgText x={725} y={168} color="#cbd5e1" size={10}>Mode: access</SvgText>
          <SvgText x={725} y={196} color="#38bdf8" size={10} bold>Access VLAN: 10</SvgText>
          <SvgText x={725} y={224} color="#cbd5e1" size={10}>Status: up / up</SvgText>
          {s >= 4 && <VlanTag x={650} y={260} text="Gi0/1 - Gi0/4" color="#f59e0b" w={150} />}
        </g>
        <Panel
          x={45}
          y={360}
          w={830}
          h={45}
          title="TWO DIFFERENT OPERATIONS"
          lines={['`vlan 10` creates the VLAN globally. `switchport access vlan 10` places this port into it.']}
          color="#34d399"
          active
        />
      </svg>
    </StepShell>
  )
}

const ipPhoneStages = [
  'Physical topology: PC connected to IP Phone، والفون متصل بمنفذ السويتش Gi0/5.',
  'الـ IP Phone فيه switch مدمج، فبيقدر يفصل بين حركة الـ PC وحركة الصوت.',
  'PC Data بيتجه لـ Data VLAN 10.',
  'IP Phone voice بيتجه لـ Voice VLAN 20.',
  'نفس المنفذ الفيزيائي يدعم VLANs اتنين، بس مش معناه إنه trunk عادي.',
]

export function IpPhoneDataVoiceDiagram() {
  const playback = useStepPlayback(ipPhoneStages.length)
  const s = playback.stage
  const data = s === 2 || s >= 4
  const voice = s === 3 || s >= 4
  return (
    <StepShell title="IP PHONE WITH DATA AND VOICE VLANs" playback={playback} legend={ipPhoneStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="PC connected behind an IP phone using data and voice VLANs">
        <Note x={460} y={24} text="PC -> IP PHONE -> SWITCH Gi0/5" color="#94a3b8" size={10} />
        <Node x={390} y={55} w={140} h={55} label="PC" sub="DATA VLAN 10" color="#38bdf8" tooltip="PC data VLAN" active={s >= 2} />
        <Layer x={350} y={150} w={220} h={72} title="IP PHONE" sub="integrated switch + voice" color="#a78bfa" active={s >= 1} />
        <Layer x={350} y={270} w={220} h={72} title="SWITCH Gi0/5" sub="access + voice VLAN" color="#34d399" active />
        <LinkLine x1={460} y1={110} x2={460} y2={150} color="#38bdf8" active={s >= 2} />
        <LinkLine x1={460} y1={222} x2={460} y2={270} color="#a78bfa" active={s >= 3} />
        {data && <Packet point={{ x: 460, y: 130 }} color="#38bdf8" label="PC data" />}
        {voice && <Packet point={{ x: 460, y: 246 }} color="#a78bfa" label="voice" />}
        <VlanTag x={610} y={95} text="DATA 10" color="#38bdf8" active={s >= 2} />
        <VlanTag x={610} y={180} text="VOICE 20" color="#a78bfa" active={s >= 3} />
        {s >= 4 && <CrossMark x={650} y={300} color="#f59e0b" />}
        {s >= 4 && <Note x={740} y={304} text="NOT A NORMAL TRUNK" color="#f59e0b" size={9.5} />}
        <Panel
          x={55}
          y={360}
          w={810}
          h={45}
          title="KEY IDEA"
          lines={['The IP phone separates voice and data traffic before it reaches the switch port.']}
          color="#34d399"
          active
        />
      </svg>
    </StepShell>
  )
}

const voiceTrafficStages = [
  'نفس الـ physical port على السويتش بيستقبل حركة من الفون ومن الـ PC خلفه.',
  'الـ PC data بيتسجل جوّه Data VLAN 10.',
  'حركة الصوت بتتسجل جوّه Voice VLAN 20.',
  'السويتش والفون المتوافقين بيستخدموا إعدادات زي CDP أو LLDP-MED غالباً لتحديد الـ voice VLAN.',
  '`switchport voice vlan 20` مش معناها إن المنفذ trunk عادي؛ دي إعداد خاص بالفون.',
]

export function VoiceVlanTrafficSeparationDiagram() {
  const playback = useStepPlayback(voiceTrafficStages.length)
  const s = playback.stage
  return (
    <StepShell title="VOICE VLAN TRAFFIC SEPARATION" playback={playback} legend={voiceTrafficStages[s]}>
      <svg viewBox="0 0 920 410" className="h-auto w-full min-w-[880px]" role="img" aria-label="Voice and data traffic separation on one switch port">
        <Note x={460} y={24} text="ONE PHYSICAL PORT - TWO LOGICAL TRAFFIC TYPES" color="#94a3b8" size={10} />
        <Node x={55} y={150} w={170} h={70} label="SWITCH Gi0/5" sub="access 10 / voice 20" color="#34d399" tooltip="Switch port" active />
        <Node x={385} y={80} w={160} h={62} label="IP PHONE" sub="voice endpoint" color="#a78bfa" tooltip="IP phone" active={s >= 2} />
        <Node x={700} y={150} w={165} h={70} label="PC" sub="behind phone" color="#38bdf8" tooltip="PC behind phone" active={s >= 1} />
        <LinkLine x1={225} y1={175} x2={385} y2={111} color="#a78bfa" active={s >= 2} />
        <LinkLine x1={545} y1={111} x2={700} y2={175} color="#38bdf8" active={s >= 1} />
        {s >= 1 && <Packet point={{ x: 620, y: 145 }} color="#38bdf8" label="data 10" />}
        {s >= 2 && <Packet point={{ x: 300, y: 145 }} color="#a78bfa" label="voice 20" />}
        <VlanTag x={235} y={245} text="VOICE VLAN 20" color="#a78bfa" active={s >= 2} />
        <VlanTag x={470} y={245} text="DATA VLAN 10" color="#38bdf8" active={s >= 1} />
        <Panel
          x={55}
          y={295}
          w={810}
          h={98}
          title={s === 4 ? 'IMPORTANT DISTINCTION' : 'CONFIGURATION ROLES'}
          lines={
            s === 4
              ? ['`switchport access vlan 10` = data VLAN. `switchport voice vlan 20` = voice VLAN.', 'Do not call this a normal trunk port just because two VLANs are involved.']
              : ['Voice VLAN operation depends on a compatible IP phone and matching switch/network configuration.', 'CDP or LLDP-MED may advertise voice VLAN information to compatible phones.']
          }
          color={s === 4 ? '#f59e0b' : '#34d399'}
          active
          size={9.3}
        />
      </svg>
    </StepShell>
  )
}

const vlan1Stages = [
  'على أغلب سويتشات Cisco Catalyst، المنافذ بتكون في VLAN 1 افتراضياً.',
  'يعني من غير أي إعداد، كل PCs المتصلين بيكونوا في نفس broadcast domain.',
  'VLAN 1 موجود في الأساس، بس مش معناها إنه أحسن اختيار لكل شبكة.',
  'في الشبكات المخططة بننقل المستخدمين لـ VLANs محددة زي 10 و20 ونقلل استخدام VLAN 1.',
  'Native VLAN وmanagement VLAN هما topic تاني؛ هنا بنعرف الفكرة بس من غير إعداد.',
]

export function Vlan1DefaultAssignmentDiagram() {
  const playback = useStepPlayback(vlan1Stages.length)
  const s = playback.stage
  const ports = ['Gi0/1', 'Gi0/2', 'Gi0/3', 'Gi0/4']
  return (
    <StepShell title="VLAN 1 AND DEFAULT PORT ASSIGNMENT" playback={playback} legend={vlan1Stages[s]}>
      <svg viewBox="0 0 920 410" className="h-auto w-full min-w-[860px]" role="img" aria-label="Default VLAN 1 assignment on Cisco switch ports">
        <Note x={460} y={24} text="TYPICAL CATALYST DEFAULT - PORTS START IN VLAN 1" color="#94a3b8" size={9.8} />
        <Layer x={330} y={70} w={260} h={240} title="SWITCH" sub="default configuration" color="#64748b" active />
        {ports.map((port, index) => {
          const active = s <= 1
          const x = 360 + (index % 2) * 125
          const y = 130 + Math.floor(index / 2) * 80
          return (
            <g key={port} opacity={active ? 1 : 0.35}>
              <rect x={x} y={y} width={105} height={50} rx="8" fill="#0b1224" stroke="#94a3b8" strokeWidth={1.5} />
              <SvgText x={x + 52} y={y + 21} color="#cbd5e1" size={9.5} bold>{port}</SvgText>
              <SvgText x={x + 52} y={y + 38} color="#94a3b8" size={8.5}>VLAN 1</SvgText>
            </g>
          )
        })}
        {s === 1 && <Packet point={{ x: 460, y: 200 }} color="#f59e0b" label="one domain" />}
        {s >= 3 && <VlanTag x={640} y={120} text="USERS -> VLAN 10" color="#38bdf8" active />}
        {s >= 3 && <VlanTag x={640} y={170} text="SERVERS -> VLAN 20" color="#a78bfa" active />}
        {s >= 3 && <VlanTag x={640} y={220} text="GUESTS -> VLAN 30" color="#34d399" active />}
        <Panel
          x={55}
          y={335}
          w={810}
          h={58}
          title="PLAN BEFORE CONFIGURING"
          lines={['VLAN 1 exists by default, but a deliberate VLAN plan is usually better than leaving everything there.']}
          color="#f59e0b"
          active
        />
      </svg>
    </StepShell>
  )
}

const intervlanRouterStages = [
  'PC-A في VLAN 10 على Gi0/1، وPC-B في VLAN 20 على Gi0/2.',
  'السويتش مش هيوصل الإطار مباشرة بين VLAN 10 وVLAN 20 على Layer 2.',
  'PC-A يبعت لعنوان الـ default gateway بتاع VLAN 10؛ هنا الراوتر هو الـ gateway.',
  'الراوتر يعمل routing بين الـ VLANs ويخرج الإطار جوّه VLAN 20.',
  'السويتش يسلّم الإطار لـ PC-B. إنشاء الـ VLANs وحده لا يوفّر اتصال Inter-VLAN.',
]

export function InterVlanRouterDiagram() {
  const playback = useStepPlayback(intervlanRouterStages.length)
  const s = playback.stage
  const toRouter = s >= 2
  const routed = s >= 3
  const delivered = s >= 4
  return (
    <StepShell title="INTER-VLAN COMMUNICATION THROUGH A ROUTER" playback={playback} legend={intervlanRouterStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Inter-VLAN communication through a router conceptual flow">
        <Note x={460} y={24} text="LAYER 2 CANNOT BRIDGE VLANs - LAYER 3 ROUTING IS REQUIRED" color="#94a3b8" size={9.3} />
        <Node x={55} y={105} w={165} h={70} label="PC-A" sub="VLAN 10 | Gi0/1" color="#38bdf8" tooltip="Source VLAN 10" active />
        <Node x={700} y={105} w={165} h={70} label="PC-B" sub="VLAN 20 | Gi0/2" color="#a78bfa" tooltip="Destination VLAN 20" active={delivered} />
        <Layer x={340} y={95} w={220} h={130} title="SWITCH" sub="VLAN 10/20" color="#34d399" active />
        <Layer x={390} y={275} w={180} h={70} title="ROUTER" sub="L3 gateway" color="#f59e0b" active={toRouter} />
        <LinkLine x1={220} y1={140} x2={340} y2={140} color="#38bdf8" active={s >= 1} />
        <LinkLine x1={560} y1={140} x2={700} y2={140} color="#a78bfa" active={delivered} />
        <LinkLine x1={450} y1={225} x2={450} y2={275} color="#f59e0b" active={toRouter} />
        {s === 1 && <CrossMark x={560} y={140} color="#fb7185" />}
        {s === 1 && <Note x={630} y={190} text="NO L2 PATH" color="#fb7185" size={9.5} />}
        {toRouter && <Packet point={{ x: 450, y: 250 }} color="#f59e0b" label="to gateway" />}
        {routed && <Packet point={{ x: 630, y: 140 }} color="#a78bfa" label="routed" />}
        <Panel
          x={55}
          y={360}
          w={810}
          h={45}
          title="ROUTER-ON-A-STICK"
          lines={['Concept only here: one router connection can carry multiple VLANs with subinterfaces. Details come later.']}
          color="#f59e0b"
          active
        />
      </svg>
    </StepShell>
  )
}

const intervlanL3Stages = [
  'PC-A في VLAN 10 وPC-B في VLAN 20 متصلان بنفس سويتش Layer 3.',
  'باعتباره Layer 2 فقط، السويتش لن يمرّر الإطار بين VLAN 10 وVLAN 20؛ نحتاج قرار Layer 3.',
  'SVI VLAN 10 وSVI VLAN 20 يمثلان الـ gateways لكل VLAN.',
  'محرك التوجيه داخل Layer 3 switch يختار المسار من SVI إلى SVI الآخر.',
  'يخرج الإطار في VLAN 20 ويصل إلى PC-B. خطوة Layer 3 ما زالت ضرورية.',
]

export function InterVlanL3SwitchDiagram() {
  const playback = useStepPlayback(intervlanL3Stages.length)
  const s = playback.stage
  const routed = s >= 3
  const delivered = s >= 4
  return (
    <StepShell title="INTER-VLAN COMMUNICATION THROUGH A LAYER 3 SWITCH" playback={playback} legend={intervlanL3Stages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Inter-VLAN communication through a Layer 3 switch using SVIs">
        <Note x={460} y={24} text="SVIs PROVIDE THE LAYER 3 GATEWAYS FOR EACH VLAN" color="#94a3b8" size={9.6} />
        <Node x={55} y={130} w={165} h={70} label="PC-A" sub="VLAN 10 | Gi0/1" color="#38bdf8" tooltip="Source VLAN 10" active />
        <Node x={700} y={130} w={165} h={70} label="PC-B" sub="VLAN 20 | Gi0/2" color="#a78bfa" tooltip="Destination VLAN 20" active={delivered} />
        <Layer x={280} y={80} w={360} h={245} title="LAYER 3 SWITCH" sub="routing + switching in one device" color="#34d399" active />
        <VlanTag x={330} y={135} text="SVI VLAN 10" color="#38bdf8" active={s >= 2} />
        <VlanTag x={500} y={135} text="SVI VLAN 20" color="#a78bfa" active={s >= 2} />
        <Layer x={390} y={205} w={140} h={55} title="ROUTING" sub="L3 decision" color="#f59e0b" active={routed} />
        <LinkLine x1={220} y1={165} x2={280} y2={165} color="#38bdf8" active={s >= 1} />
        <LinkLine x1={640} y1={165} x2={700} y2={165} color="#a78bfa" active={delivered} />
        <LinkLine x1={380} y1={180} x2={390} y2={220} color="#38bdf8" active={s >= 2} />
        <LinkLine x1={530} y1={220} x2={550} y2={180} color="#a78bfa" active={routed} />
        {routed && <Packet point={{ x: 460, y: 240 }} color="#f59e0b" label="L3 route" />}
        {delivered && <Packet point={{ x: 670, y: 165 }} color="#a78bfa" label="VLAN 20" />}
        <Panel
          x={55}
          y={355}
          w={810}
          h={48}
          title="KEY POINT"
          lines={['An SVI is a virtual Layer 3 interface for a VLAN. Detailed SVI configuration belongs to a later topic.']}
          color="#34d399"
          active
        />
      </svg>
    </StepShell>
  )
}
