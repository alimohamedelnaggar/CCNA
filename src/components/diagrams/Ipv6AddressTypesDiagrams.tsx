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
}: {
  x: number
  y: number
  w: number
  h: number
  title: string
  lines: string[]
  color?: string
  active?: boolean
}) {
  return (
    <g opacity={active ? 1 : 0.48}>
      <rect x={x} y={y} width={w} height={h} rx="12" fill="#0b1224" stroke={color} strokeWidth={active ? 2.2 : 1.1} />
      <SvgText x={x + w / 2} y={y + 21} color={color} size={10} bold>
        {title}
      </SvgText>
      {lines.map((line, index) => (
        <SvgText key={index} x={x + w / 2} y={y + 40 + index * 15} color="#cbd5e1" size={9}>
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

const deliveryStages = [
  'نفس المرسل بيقدر يوصل لثلاثة أنواع مختلفة من الـ destination: Unicast و Multicast و Anycast. الفرق مش في شكل العنوان بس، الفرق في „مين هيستلم“.',
  'في `Unicast` العنوان بيحدّد واجهة واحدة بس. الـ packet يوصل لـ PC2 والباقي ما بياخدش حاجة.',
  'في `Multicast` العنوان بيحدّد مجموعة. كل Interfaces اللي انضمت للمجموعة تستلم نفس الـ packet — هنا PC3 و PC4 و PC5.',
  'في `Anycast` نفس العنوان متوزّع على أكتر من واجهة. الـ routing يختار „الأقرب“ حسب الجدول والمقاييس؛ هنا Server-A هيستلم.',
]

export function Ipv6DeliveryTypesDiagram() {
  const playback = useStepPlayback(deliveryStages.length)
  const s = playback.stage
  return (
    <StepShell title="UNICAST vs MULTICAST vs ANYCAST" playback={playback} legend={deliveryStages[s]}>
      <svg viewBox="0 0 900 390" className="h-auto w-full min-w-[840px]" role="img" aria-label="Unicast multicast and anycast delivery comparison with one sender">
        <Note x={450} y={26} text="ONE SENDER - THREE DELIVERY MODELS" color="#94a3b8" size={11} />
        <Node x={40} y={165} w={150} h={58} label="PC1" sub="2001:DB8:19:1::10" color="#38bdf8" tooltip="Sender" active />
        <Note x={115} y={245} text="SRC" color="#38bdf8" />

        <Panel x={650} y={48} w={210} h={74} title="UNICAST" lines={['PC2 only', 'one interface']} color="#38bdf8" active={s === 1 || s === 0} />
        <Panel x={650} y={158} w={210} h={86} title="MULTICAST" lines={['PC3 + PC4 + PC5', 'all group members']} color="#a78bfa" active={s === 2 || s === 0} />
        <Panel x={650} y={282} w={210} h={76} title="ANYCAST" lines={['Server-A / Server-B', 'nearest one only']} color="#f59e0b" active={s === 3 || s === 0} />

        <LinkLine x1={190} y1={190} x2={650} y2={84} color="#38bdf8" active={s === 0 || s === 1} />
        <LinkLine x1={190} y1={195} x2={650} y2={196} color="#a78bfa" active={s === 0 || s === 2} />
        <LinkLine x1={190} y1={204} x2={650} y2={318} color="#f59e0b" active={s === 0 || s === 3} />

        {(s === 0 || s === 1) && <Packet point={{ x: 430, y: 128 }} color="#38bdf8" label="1 dst" />}
        {(s === 0 || s === 2) && <Packet point={{ x: 430, y: 205 }} color="#a78bfa" label="group" />}
        {(s === 0 || s === 3) && <Packet point={{ x: 430, y: 268 }} color="#f59e0b" label="nearest" />}

        {s === 3 && (
          <>
            <Node x={650} y={282} w={100} h={50} label="Server-A" sub="metric 10" color="#f59e0b" tooltip="Nearest anycast node" active />
            <Node x={765} y={282} w={100} h={50} label="Server-B" sub="metric 40" color="#f59e0b" tooltip="Farther anycast node" />
          </>
        )}
        <Note x={450} y={370} text={s === 0 ? 'Unicast = one | Multicast = many | Anycast = nearest one' : deliveryStages[s].replace(/`/g, '').slice(0, 88)} color="#94a3b8" />
      </svg>
    </StepShell>
  )
}

const unicastStages = [
  'الـ Unicast في IPv6 ليه خمس فئات مهمة في CCNA: GUA و LLA و ULA و Loopback و Unspecified. كل فئة ليها نطاق واستخدام مختلف.',
  '`GUA` — Global Unicast: عنوان عام قابل للتوجيه على الإنترنت، نطاقه `2000::/3`.',
  '`LLA` — Link-Local: عنوان للرابط المحلي فقط، نطاقه `FE80::/10`، وبيتم توليده تلقائياً على كل واجهة IPv6.',
  '`ULA` — Unique Local: عنوان داخلي للمؤسسة، نطاقه `FC00::/7`، والجزء الشائع `FD00::/8`.',
  '`::1/128` Loopback للاختبار على نفس الجهاز، و`::/128` Unspecified معناه „مفيش عنوان“ في إجراءات معيّنة.',
]

export function Ipv6UnicastCategoriesDiagram() {
  const playback = useStepPlayback(unicastStages.length)
  const s = playback.stage
  const cards = [
    { title: 'GUA', lines: ['2000::/3', 'Internet'], color: '#38bdf8' },
    { title: 'LLA', lines: ['FE80::/10', 'one link'], color: '#f59e0b' },
    { title: 'ULA', lines: ['FC00::/7', 'site local'], color: '#a78bfa' },
    { title: 'LOOPBACK', lines: ['::1/128', 'host itself'], color: '#34d399' },
    { title: 'UNSPEC', lines: ['::/128', 'no address'], color: '#fb7185' },
  ]
  return (
    <StepShell title="FIVE IMPORTANT UNICAST CATEGORIES" playback={playback} legend={unicastStages[s]}>
      <svg viewBox="0 0 900 360" className="h-auto w-full min-w-[840px]" role="img" aria-label="Five IPv6 unicast address categories GUA LLA ULA loopback unspecified">
        <Note x={450} y={26} text="IPv6 UNICAST FAMILY" color="#94a3b8" size={11} />
        {cards.map((card, index) => (
          <Panel
            key={card.title}
            x={22 + index * 175}
            y={62}
            w={160}
            h={96}
            title={card.title}
            lines={card.lines}
            color={card.color}
            active={s === 0 || s === index + 1}
          />
        ))}
        <Panel
          x={150}
          y={190}
          w={600}
          h={120}
          title={s === 0 ? 'PICK A CATEGORY' : cards[s - 1].title}
          lines={
            s === 0
              ? ['Use the controls to step through each category', 'Prefix - scope - example']
              : [
                  `Range: ${cards[s - 1].lines[0]}`,
                  `Scope: ${cards[s - 1].lines[1]}`,
                  s === 1 ? 'Example: 2001:DB8:19:1::10' : s === 2 ? 'Example: FE80::1' : s === 3 ? 'Example: FD00:1234:5678::1' : s === 4 ? 'Example: ::1' : 'Example: ::',
                ]
          }
          color={s === 0 ? '#64748b' : cards[s - 1].color}
          active
        />
      </svg>
    </StepShell>
  )
}

const guaLlaUlaStages = [
  'ثلاث فئات بتظهر كل وقت في الراوترات: GUA للتوجيه العام، LLA للرابط، ULA للشبكة الداخلية. الفرق بيبدأ من أول بتات في العنوان.',
  '`GUA 2000::/3`: أول 3 بتات `001`. المدى من `2000::` لـ `3FFF:...`. مثال: `2001:DB8:19:1::10`.',
  '`LLA FE80::/10`: أول 10 بتات `1111111010`. المدى `FE80::` لـ `FEBF:...`. الراوتر ما يعبّريش الـ packet ده لرابط تاني.',
  '`ULA FC00::/7`: المدى `FC00::` لـ `FDFF:...`. العملياً بنشوف `FD00::/8` لأنه الـ locally assigned part.',
  'قاعدة سريعة: `2` أو `3` في أول hextet غالباً GUA · `FE8x`–`FEBx` LLA · `FC` أو `FD` ULA.',
]

export function Ipv6GuaLlaUlaDiagram() {
  const playback = useStepPlayback(guaLlaUlaStages.length)
  const s = playback.stage
  const focus = s === 0 ? null : s === 1 ? 0 : s === 2 ? 1 : s === 3 ? 2 : 3
  const items = [
    { title: 'GUA', range: '2000::/3', bits: '001', use: 'global routing', color: '#38bdf8' },
    { title: 'LLA', range: 'FE80::/10', bits: '1111111010', use: 'local link only', color: '#f59e0b' },
    { title: 'ULA', range: 'FC00::/7', bits: '1111110', use: 'organization', color: '#a78bfa' },
  ]
  return (
    <StepShell title="GUA vs LLA vs ULA" playback={playback} legend={guaLlaUlaStages[s]}>
      <svg viewBox="0 0 900 370" className="h-auto w-full min-w-[840px]" role="img" aria-label="Comparison of GUA 2000::/3 LLA FE80::/10 and ULA FC00::/7">
        <Note x={450} y={26} text="FIRST BITS DECIDE THE SCOPE" color="#94a3b8" size={11} />
        {items.map((item, index) => (
          <Panel
            key={item.title}
            x={35 + index * 285}
            y={58}
            w={260}
            h={170}
            title={item.title}
            lines={[item.range, `prefix bits: ${item.bits}`, `scope: ${item.use}`, index === 0 ? ' routable on Internet' : index === 1 ? ' not forwarded by routers' : ' filter at site edge']}
            color={item.color}
            active={focus === null || focus === index || focus === 3}
          />
        ))}
        <Panel
          x={150}
          y={255}
          w={600}
          h={84}
          title="EXAM QUICK CHECK"
          lines={[
            '2001... = GUA    FE80... = LLA    FD00... = ULA',
            focus === 3 ? 'Same interface can hold GUA + LLA together.' : 'Read the first hextet, then confirm the prefix length.',
          ]}
          color="#34d399"
          active
        />
      </svg>
    </StepShell>
  )
}

const multicastStructureStages = [
  'عنوان الـ multicast يبدأ بـ `FF00::/8`. يعني أول 8 بتات كلها 1. بعدها في deferent حقول: Flags و Scope و Group ID.',
  'أول 8 بتات = `11111111`، وبتتكتب `FF` في أول hextet. ده اللي بيقول „ده multicast مش unicast“.',
  'الـ 4 بتات اللي بعده هي `Flags`. `0000` معناها well-known / permanent، و`0001` معناها transient / dynamically assigned.',
  'الـ 4 بتات اللي بعده هي `Scope`. في `FF02::1` الرقم `2` معناه link-local scope.',
  'الباقي 112 bit هو `Group ID`. في `FF02::1` الـ group ID = `1` يعني all nodes. في `FF02::2` يعني all routers.',
]

export function Ipv6MulticastStructureDiagram() {
  const playback = useStepPlayback(multicastStructureStages.length)
  const s = playback.stage
  const highlight = s === 0 ? 0 : s
  return (
    <StepShell title="IPv6 MULTICAST ADDRESS STRUCTURE" playback={playback} legend={multicastStructureStages[s]}>
      <svg viewBox="0 0 900 360" className="h-auto w-full min-w-[840px]" role="img" aria-label="IPv6 multicast address structure FF flags scope and group ID">
        <Note x={450} y={26} text="11111111 | FLAGS | SCOPE | GROUP ID (112 bits)" color="#94a3b8" size={11} />
        <g>
          <rect x={40} y={70} width={130} height={80} rx="10" fill="#0b1224" stroke={highlight === 1 ? '#38bdf8' : '#334155'} strokeWidth={highlight === 1 ? 3 : 1.2} />
          <SvgText x={105} y={102} color="#38bdf8" size={13} bold>FF</SvgText>
          <SvgText x={105} y={124} color="#94a3b8" size={9}>8 bits = 11111111</SvgText>

          <rect x={180} y={70} width={130} height={80} rx="10" fill="#0b1224" stroke={highlight === 2 ? '#a78bfa' : '#334155'} strokeWidth={highlight === 2 ? 3 : 1.2} />
          <SvgText x={245} y={102} color="#a78bfa" size={13} bold>FLAGS</SvgText>
          <SvgText x={245} y={124} color="#94a3b8" size={9}>4 bits</SvgText>

          <rect x={320} y={70} width={130} height={80} rx="10" fill="#0b1224" stroke={highlight === 3 ? '#f59e0b' : '#334155'} strokeWidth={highlight === 3 ? 3 : 1.2} />
          <SvgText x={385} y={102} color="#f59e0b" size={13} bold>SCOPE</SvgText>
          <SvgText x={385} y={124} color="#94a3b8" size={9}>4 bits</SvgText>

          <rect x={460} y={70} width={390} height={80} rx="10" fill="#0b1224" stroke={highlight === 4 ? '#34d399' : '#334155'} strokeWidth={highlight === 4 ? 3 : 1.2} />
          <SvgText x={655} y={102} color="#34d399" size={13} bold>GROUP ID</SvgText>
          <SvgText x={655} y={124} color="#94a3b8" size={9}>112 bits</SvgText>
        </g>
        <Panel
          x={110}
          y={190}
          w={680}
          h={128}
          title="READ THE FAMOUS EXAMPLE: FF02::1"
          lines={['FF = multicast prefix', '0 = flags (well-known)', '2 = scope (link-local)', '::1 = group ID (all nodes)']}
          color="#38bdf8"
          active
        />
      </svg>
    </StepShell>
  )
}

const scopeRows = [
  { value: '1', name: 'Interface-local', note: 'same interface only' },
  { value: '2', name: 'Link-local', note: 'one link / one L2 domain' },
  { value: '3', name: 'Realm-local', note: 'routing realm or VPN' },
  { value: '4', name: 'Admin-local', note: 'administratively bounded' },
  { value: '5', name: 'Site-local', note: 'one site' },
  { value: '8', name: 'Organization-local', note: 'one organization' },
  { value: 'E', name: 'Global', note: 'global scope' },
]

export function Ipv6MulticastScopeDiagram() {
  const playback = useStepPlayback(scopeRows.length + 1)
  const s = playback.stage
  return (
    <StepShell title="MULTICAST SCOPE VALUES" playback={playback} legend={s === 0 ? 'الـ nibble الرابع في العنوان بيحدد الـ scope. القيمة `0` محجوزة، والقيم `1` لـ `E` هي scopes معروفة. مش كل scopes بنشوفهم في CCNA، بس لازم تعرف الترتيب.' : `${scopeRows[s - 1].name}: scope value ${scopeRows[s - 1].value} — ${scopeRows[s - 1].note}.`}>
      <svg viewBox="0 0 900 390" className="h-auto w-full min-w-[860px]" role="img" aria-label="IPv6 multicast scope values from interface local to global">
        <Note x={450} y={26} text="SCOPE NIBBLE IN FF0s::" color="#94a3b8" size={11} />
        <line x1={70} y1={95} x2={830} y2={95} stroke="#334155" strokeWidth="3" />
        {scopeRows.map((row, index) => {
          const x = 78 + index * 107
          const active = s === 0 || s === index + 1
          return (
            <g key={row.value} opacity={active ? 1 : 0.42}>
              <circle cx={x} cy={95} r={active ? 14 : 10} fill="#0b1224" stroke="#38bdf8" strokeWidth={active ? 3 : 1.4} />
              <SvgText x={x} y={99} color="#38bdf8" size={11} bold>{row.value}</SvgText>
              <SvgText x={x} y={132} color="#e2e8f0" size={8.5}>{row.name.split('-')[0]}</SvgText>
            </g>
          )
        })}
        <Panel
          x={150}
          y={180}
          w={600}
          h={150}
          title={s === 0 ? 'SCOPE CONTROLS THE INTENDED REACH' : `SCOPE ${scopeRows[s - 1].value} - ${scopeRows[s - 1].name.toUpperCase()}`}
          lines={
            s === 0
              ? ['1 interface | 2 link | 3 realm | 4 admin', '5 site | 8 organization | E global']
              : [
                  `Meaning: ${scopeRows[s - 1].note}`,
                  scopeRows[s - 1].value === '2' ? 'Link-local examples: FF02::1 and FF02::2' : `Prefix example: FF0${scopeRows[s - 1].value}::...`,
                  'Actual forwarding still depends on MLD + router config.',
                ]
          }
          color={s === 0 ? '#64748b' : '#f59e0b'}
          active
        />
      </svg>
    </StepShell>
  )
}

const groupRows = [
  { address: 'FF02::1', purpose: 'All Nodes', who: 'every IPv6 interface on link' },
  { address: 'FF02::2', purpose: 'All Routers', who: 'routers only' },
  { address: 'FF02::5', purpose: 'OSPFv3 Routers', who: 'all OSPFv3 routers' },
  { address: 'FF02::6', purpose: 'OSPF DR/BDR', who: 'DR and BDR only' },
  { address: 'FF02::9', purpose: 'RIPng Routers', who: 'RIPng routers' },
  { address: 'FF02::A', purpose: 'EIGRP Routers', who: 'EIGRP routers' },
  { address: 'FF02::1:FFxx:xxxx', purpose: 'Solicited-Node', who: 'interfaces with matching last 24 bits' },
]

export function Ipv6MulticastGroupsDiagram() {
  const playback = useStepPlayback(groupRows.length + 1)
  const s = playback.stage
  return (
    <StepShell title="IMPORTANT IPv6 MULTICAST GROUPS" playback={playback} legend={s === 0 ? 'كل العنوانين دول بيبدأوا بـ `FF02` يعني link-local scope. اضغط التالي عشان تركّز على مجموعة واحدة.' : `${groupRows[s - 1].address} → ${groupRows[s - 1].purpose}. بيسمعه: ${groupRows[s - 1].who}.`}>
      <svg viewBox="0 0 900 430" className="h-auto w-full min-w-[850px]" role="img" aria-label="Important IPv6 multicast groups all nodes all routers OSPF RIPng EIGRP solicited node">
        <Note x={450} y={24} text="WELL-KNOWN LINK-LOCAL MULTICAST GROUPS" color="#94a3b8" size={11} />
        <SvgText x={70} y={52} color="#64748b" size={9} anchor="start">ADDRESS</SvgText>
        <SvgText x={290} y={52} color="#64748b" size={9} anchor="start">PURPOSE</SvgText>
        <SvgText x={550} y={52} color="#64748b" size={9} anchor="start">WHO LISTENS</SvgText>
        {groupRows.map((row, index) => {
          const active = s === 0 || s === index + 1
          const y = 64 + index * 45
          return (
            <g key={row.address} opacity={active ? 1 : 0.35}>
              <rect x={55} y={y} width={790} height={38} rx="8" fill={active ? '#0f1d38' : '#0b1224'} stroke={active ? '#38bdf8' : '#1e293b'} strokeWidth={active ? 1.6 : 1} />
              <SvgText x={70} y={y + 24} color="#38bdf8" size={10} anchor="start">{row.address}</SvgText>
              <SvgText x={290} y={y + 24} color="#e2e8f0" size={10} anchor="start">{row.purpose}</SvgText>
              <SvgText x={550} y={y + 24} color="#cbd5e1" size={9} anchor="start">{row.who}</SvgText>
            </g>
          )
        })}
        <Note x={450} y={417} text={s === groupRows.length ? 'General: ::1 / ::2    Protocol-specific: OSPF / RIPng / EIGRP' : 'FF02 = link-local scope'} color="#94a3b8" />
      </svg>
    </StepShell>
  )
}

const solicitedStages = [
  'المثال: `2001:DB8:1234:5678:021A:2BFF:FE3C:4D5E`. الـ Solicited-Node Multicast بياخد آخر 24 bit بس من العنوان.',
  'آخر 24 bit = آخر 6 hex digits = `3C:4D:5E`. لازم ناخدهم من آخر hextetين `FE3C:4D5E`.',
  'الـ prefix الثابت `FF02::1:FF00:0/104` يعني أول 104 bit مكتوبين، وآخر 24 bit بيتحط مكانهم.',
  'النتيجة: `FF02::1:FF3C:4D5E`. دور الـ `FFxx:xxxx` إن آخر 6 digits بيتكتبوا بعد `FF02::1:FF`.',
  'ليه ممكن أكتر من عنوان يطلع نفس المجموعة؟ لأننا بنستخدم آخر 24 bit بس؛ أي عنوانين متشابهين في آخر 6 digits هيشتركوا في نفس الـ group.',
]

export function Ipv6SolicitedNodeDiagram() {
  const playback = useStepPlayback(solicitedStages.length)
  const s = playback.stage
  const hextets = ['2001', 'DB8', '1234', '5678', '021A', '2BFF', 'FE3C', '4D5E']
  return (
    <StepShell title="SOLICITED-NODE MULTICAST CALCULATOR" playback={playback} legend={solicitedStages[s]}>
      <svg viewBox="0 0 900 400" className="h-auto w-full min-w-[860px]" role="img" aria-label="Solicited node multicast calculation from 2001 DB8 1234 5678 021A 2BFF FE3C 4D5E to FF02::1:FF3C:4D5E">
        <Note x={450} y={26} text="UNICAST ADDRESS -> SOLICITED-NODE GROUP" color="#94a3b8" size={11} />
        {hextets.map((h, index) => {
          const isTail = index >= 6
          return (
            <g key={h}>
              <rect x={42 + index * 102} y={62} width={92} height={54} rx="8" fill="#0b1224" stroke={isTail ? '#f59e0b' : '#334155'} strokeWidth={isTail ? 2.4 : 1.2} />
              <SvgText x={88 + index * 102} y={95} color={isTail ? '#f59e0b' : '#cbd5e1'} size={12} bold>{h}</SvgText>
            </g>
          )
        })}
        <Note x={450} y={142} text="H7 + H8 contain the last 24 bits: FE3C:4D5E -> 3C:4D:5E" color="#f59e0b" />

        <Panel
          x={55}
          y={175}
          w={370}
          h={100}
          title="FIXED PREFIX /104"
          lines={['FF02:0000:0000:0000:', '0000:0001:FF00:0000', 'first 104 bits are fixed']}
          color="#38bdf8"
          active={s >= 2}
        />
        <Panel
          x={475}
          y={175}
          w={370}
          h={100}
          title="LAST 24 BITS"
          lines={['from unicast: 3C:4D:5E', 'copy into the final 6 hex digits', 'prefix + tail = group address']}
          color="#f59e0b"
          active={s >= 1}
        />

        <rect x={205} y={300} width={490} height={62} rx="10" fill="#0b1224" stroke={s >= 3 ? '#34d399' : '#334155'} strokeWidth={s >= 3 ? 3 : 1.4} />
        <SvgText x={450} y={338} color={s >= 3 ? '#34d399' : '#64748b'} size={16} bold>{s >= 3 ? 'FF02::1:FF3C:4D5E' : 'FF02::1:FF??:????'}</SvgText>
        <Note x={450} y={385} text={s === 4 ? 'Same last 24 bits -> same Solicited-Node Multicast group' : 'NDP sends NS here, not to a broadcast address'} color="#94a3b8" />
      </svg>
    </StepShell>
  )
}

const ndpStages = [
  'PC1 عايز يبعت لـ PC2 على نفس الـ link. أول خطوة: يتأكد إن الـ destination داخل نفس الـ network / same prefix.',
  'PC1 لازم يعرف الـ MAC Address لـ PC2. في IPv6 مفيش ARP؛ هنا بيستخدم Neighbor Discovery Protocol.',
  'PC1 بيبعت `Neighbor Solicitation (NS, Type 135)`. المصدر LLA، والـ destination هو Solicited-Node Multicast الخاص بـ PC2.',
  'PC2 بيسمع الـ group، يرد بـ `Neighbor Advertisement (NA, Type 136)` ويحط MAC Address بتاعه جوّه الـ message.',
  'PC1 يحدّث الـ Neighbor Cache: IPv6 address → MAC address. من هنا يقدر يبعت الـ frame.',
  'الخلاصة: NS بيسأل „مين عنده العنوان ده؟“ والـ NA بيجاوب „أنا، وده الـ MAC بتاعي“.',
]

export function Ipv6NdpNsNaDiagram() {
  const playback = useStepPlayback(ndpStages.length)
  const s = playback.stage
  return (
    <StepShell title="NDP - NEIGHBOR SOLICITATION AND ADVERTISEMENT" playback={playback} legend={ndpStages[s]}>
      <svg viewBox="0 0 900 410" className="h-auto w-full min-w-[850px]" role="img" aria-label="NDP neighbor solicitation and advertisement packet flow between PC1 and PC2">
        <Note x={450} y={24} text="SAME LINK - LAYER 2 ADDRESS DISCOVERY" color="#94a3b8" size={11} />
        <Node x={55} y={120} w={210} h={76} label="PC1" sub="FE80::1 / GUA ...::10" color="#38bdf8" tooltip="Initiator" active />
        <Node x={635} y={120} w={210} h={76} label="PC2" sub="FE80::2 / GUA ...::20" color="#34d399" tooltip="Target" active={s >= 3} />
        <Node x={400} y={140} w={100} h={52} label="SW1" sub="L2 only" color="#64748b" tooltip="Switch" />

        <LinkLine x1={265} y1={158} x2={400} y2={166} color="#38bdf8" active={s === 2} />
        <LinkLine x1={500} y1={166} x2={635} y2={158} color="#38bdf8" active={s === 2 || s === 3} />
        <LinkLine x1={635} y1={185} x2={265} y2={185} color="#34d399" active={s === 3 || s === 4} />

        {(s === 2 || s === 3) && <Packet point={{ x: 335, y: 158 }} color="#38bdf8" label="NS 135" />}
        {(s === 3 || s === 4) && <Packet point={{ x: 560, y: 200 }} color="#34d399" label="NA 136" />}

        <Panel
          x={90}
          y={245}
          w={340}
          h={120}
          title="NS - Type 135"
          lines={['SRC FE80::1', 'DST FF02::1:FF3C:4D5E', 'Target = PC2 IPv6', 'Option: PC1 MAC']}
          color="#38bdf8"
          active={s === 2 || s === 3}
        />
        <Panel
          x={470}
          y={245}
          w={340}
          h={120}
          title="NA - Type 136"
          lines={['SRC FE80::2', 'DST FE80::1', 'Target = PC2 IPv6', 'Option: PC2 MAC']}
          color="#34d399"
          active={s === 3 || s === 4}
        />
        <Note x={450} y={395} text={s === 1 ? 'Needs the destination link-layer address' : 'Neighbor Cache stores IPv6 -> MAC on the same link'} color="#94a3b8" />
      </svg>
    </StepShell>
  )
}

const arpNdpStages = [
  'نفس المشكلة: „مين عنده العنوان ده؟“. IPv4 بيحلها بـ ARP، وIPv6 بيحلها بـ NDP. الاختلاف الأهم في طريقة الإرسال.',
  'في IPv4، ARP بيبعت `Broadcast` للكل: كل device على الـ LAN بيستلم السؤال وبيفحصه.',
  'في IPv6، NDP بيبعت `Neighbor Solicitation` لـ Solicited-Node Multicast. اللي بيسمعه هو بس اللي آخر 24 bit بتاعه مطابق.',
  'كمان NDP بيستخدم ICMPv6 وLink-Local addresses، وبيعمل Router Discovery وRedirect؛ ARP مبيعملش كده.',
]

export function Ipv6ArpVsNdpDiagram() {
  const playback = useStepPlayback(arpNdpStages.length)
  const s = playback.stage
  return (
    <StepShell title="IPv4 ARP vs IPv6 NDP" playback={playback} legend={arpNdpStages[s]}>
      <svg viewBox="0 0 900 380" className="h-auto w-full min-w-[840px]" role="img" aria-label="Comparison of IPv4 ARP broadcast and IPv6 NDP solicited node multicast">
        <Note x={450} y={24} text="HOW A HOST FINDS A NEIGHBOR'S MAC" color="#94a3b8" size={11} />
        <Node x={45} y={70} w={150} h={58} label="Host A" sub="IPv4" color="#38bdf8" tooltip="IPv4 host" active />
        <Node x={45} y={230} w={150} h={58} label="Host A" sub="IPv6" color="#34d399" tooltip="IPv6 host" active />

        <Panel x={240} y={58} w={250} h={82} title="ARP REQUEST" lines={['L2 broadcast FF:FF:FF:FF:FF:FF', 'everyone receives it']} color="#fb7185" active={s === 0 || s === 1} />
        <Panel x={560} y={58} w={290} h={82} title="RESULT" lines={['ARP reply (unicast)', 'all hosts processed the request']} color="#64748b" active={s === 0 || s === 1} />

        <Panel x={240} y={218} w={250} h={82} title="NS - TYPE 135" lines={['Solicited-Node Multicast', 'only matching interfaces listen']} color="#38bdf8" active={s === 0 || s === 2 || s === 3} />
        <Panel x={560} y={218} w={290} h={82} title="RESULT" lines={['NA - Type 136 (unicast)', 'cache updated: IPv6 -> MAC']} color="#34d399" active={s === 0 || s === 2 || s === 3} />

        <LinkLine x1={195} y1={100} x2={240} y2={100} color="#fb7185" active={s === 0 || s === 1} />
        <LinkLine x1={490} y1={100} x2={560} y2={100} color="#fb7185" active={s === 0 || s === 1} />
        <LinkLine x1={195} y1={258} x2={240} y2={258} color="#38bdf8" active={s === 0 || s === 2} />
        <LinkLine x1={490} y1={258} x2={560} y2={258} color="#34d399" active={s === 0 || s === 3} />

        <Note x={450} y={350} text={s === 3 ? 'NDP = ICMPv6 + multicast + LLA + cache + router discovery' : 'Broadcast wastes attention; multicast targets the right group'} color="#94a3b8" />
      </svg>
    </StepShell>
  )
}

const anycastStages = [
  'في الـ Anycast، نفس العنوان `2001:DB8:19:53::53` متكتب على أكتر من سيرفر في مواقع مختلفة. للعميل العنوان شكله unicast عادي.',
  'الـ routing يختار أقرب نسخة حسب الـ metric. هنا.Client في Site 1 هيوصل لـ Server-A.',
  'لو Server-A أو مساره اتكسر، الـ routing يتقارب ويرسل العميل لـ Server-B من غير تغيير عنوان الـ DNS في العميل.',
  'Anycast ≠ Multicast: الـ multicast يوصل لكل أعضاء المجموعة؛ الـ anycast يوصل لواحدة بس „الأقرب“. Anycast ≠ Unicast: هنا أكتر من واجهة بنفس العنوان.',
]

export function Ipv6AnycastRoutingDiagram() {
  const playback = useStepPlayback(anycastStages.length)
  const s = playback.stage
  return (
    <StepShell title="ANYCAST ROUTING BEHAVIOR" playback={playback} legend={anycastStages[s]}>
      <svg viewBox="0 0 900 400" className="h-auto w-full min-w-[840px]" role="img" aria-label="Anycast routing choosing nearest server and reconverging after failure">
        <Note x={450} y={24} text="SAME ADDRESS ON MULTIPLE INTERFACES" color="#94a3b8" size={11} />
        <Node x={45} y={155} w={160} h={70} label="Client" sub="2001:DB8:19:1::10" color="#38bdf8" tooltip="Client" active />
        <Node x={330} y={80} w={190} h={70} label="R-A" sub="Site 1 router" color="#64748b" tooltip="Site A router" active={s !== 2} />
        <Node x={330} y={255} w={190} h={70} label="R-B" sub="Site 2 router" color="#64748b" tooltip="Site B router" active={s === 2} />
        <Node x={660} y={80} w={190} h={70} label="Server-A" sub="...53::53" color="#a78bfa" tooltip="Anycast copy A" active={s === 1} />
        <Node x={660} y={255} w={190} h={70} label="Server-B" sub="...53::53" color="#a78bfa" tooltip="Anycast copy B" active={s === 2} />

        <LinkLine x1={205} y1={180} x2={330} y2={115} color="#38bdf8" active />
        <LinkLine x1={205} y1={195} x2={330} y2={280} color="#38bdf8" active={s === 2} />
        <LinkLine x1={520} y1={115} x2={660} y2={115} color="#a78bfa" active={s === 1} />
        <LinkLine x1={520} y1={280} x2={660} y2={280} color="#a78bfa" active={s === 2} />

        {(s === 0 || s === 1) && <Packet point={{ x: 590, y: 115 }} color="#a78bfa" label="nearest" />}
        {s === 2 && <Packet point={{ x: 590, y: 280 }} color="#a78bfa" label="reconverged" />}
        {s === 2 && <Note x={755} y={175} text="Server-A down" color="#fb7185" />}

        <Panel
          x={175}
          y={340}
          w={550}
          h={48}
          title="NO DEDICATED ANYCAST PREFIX"
          lines={['Uses normal unicast address space; routing makes the choice.']}
          color="#f59e0b"
          active
        />
      </svg>
    </StepShell>
  )
}

const labStages = [
  'التوبولوجيا compromise بين اللابين: R1 و R2، SW1، وثلاثة PCs. اللاب 1 يستخدم R1 + SW1 + PCs، واللاب 2 يضيف الرابط بين الراوترين.',
  'Lab 1 — Unicast and Multicast: GUA على PC1/PC2/PC3، و R1 هو الـ gateway. هنا بنشوف All-Nodes و All-Routers و Neighbor Cache.',
  'Lab 2 — NDP: R1 و R2 و PC1 و PC2. بنولّد traffic وبنتتبع NS/NA و Solicited-Node Multicast.',
  'عنوان Plan: `2001:DB8:19:1::/64` للـ LAN، `2001:DB8:19:12::/64` للرابط، `2001:DB8:19:2::/64` للـ LAN التانية.',
]

export function Ipv6TypesLabTopologyDiagram() {
  const playback = useStepPlayback(labStages.length)
  const s = playback.stage
  return (
    <StepShell title="PACKET TRACER LAB TOPOLOGY" playback={playback} legend={labStages[s]}>
      <svg viewBox="0 0 900 420" className="h-auto w-full min-w-[850px]" role="img" aria-label="Complete Packet Tracer topology with R1 R2 SW1 PC1 PC2 and PC3">
        <Note x={450} y={24} text="R1 - R2 | SW1 | PC1 - PC2 - PC3" color="#94a3b8" size={11} />
        <Node x={60} y={70} w={160} h={66} label="R1" sub="2001:DB8:19:1::1" color="#38bdf8" tooltip="Router R1" active />
        <Node x={680} y={70} w={160} h={66} label="R2" sub="2001:DB8:19:12::2" color="#38bdf8" tooltip="Router R2" active={s === 2} />
        <Node x={370} y={205} w={160} h={62} label="SW1" sub="Layer 2" color="#64748b" tooltip="Switch SW1" active />
        <Node x={70} y={330} w={160} h={60} label="PC1" sub="...1::10" color="#34d399" tooltip="PC1" active />
        <Node x={370} y={330} w={160} h={60} label="PC2" sub="...1::20" color="#34d399" tooltip="PC2" active />
        <Node x={670} y={330} w={160} h={60} label="PC3" sub="...1::30" color="#34d399" tooltip="PC3" active={s !== 2} />

        <LinkLine x1={220} y1={103} x2={680} y2={103} color="#a78bfa" active={s === 0 || s === 2 || s === 3} />
        <LinkLine x1={140} y1={136} x2={420} y2={205} color="#38bdf8" active />
        <LinkLine x1={450} y1={267} x2={150} y2={330} color="#34d399" active={s !== 2} />
        <LinkLine x1={450} y1={267} x2={450} y2={330} color="#34d399" active />
        <LinkLine x1={480} y1={267} x2={750} y2={330} color="#34d399" active={s !== 2} />

        <Panel
          x={180}
          y={360}
          w={540}
          h={48}
          title="CHECKPOINTS"
          lines={['GUA / LLA / MLD groups / Neighbor Cache / NS + NA']}
          color={s === 2 ? '#a78bfa' : '#38bdf8'}
          active
        />
      </svg>
    </StepShell>
  )
}
