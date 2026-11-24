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
  x,
  y,
  w,
  h,
  title,
  sub,
  color,
  selected,
  onClick,
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

const serverArchitectureStages = [
  'DHCP Server يوزّع network configuration على Clients: IP address وMask وGateway وDNS وLease time.',
  'Client يرسل DHCP Discover كـ Broadcast داخل نفس الـ Broadcast Domain.',
  'Server يرد بـ Offer من DHCP Pool مع احترام Excluded Addresses.',
  'Client يطلب العنوان وServer يرسل Acknowledgment، ثم يُنشأ DHCP Binding.',
  'السيرفر يراقب الـ Pool والـ Conflicts والـ Lease lifecycle.',
]

export function DhcpServerArchitectureDiagram() {
  const playback = useStepPlayback(serverArchitectureStages.length)
  const s = playback.stage
  return (
    <StepShell title="DHCP SERVER ARCHITECTURE" playback={playback} legend={serverArchitectureStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="DHCP server architecture with clients switch pool and bindings">
        <Box x={55} y={160} w={190} h={95} title="Clients" sub="PC1 / PC2" color="#38bdf8" active={s >= 1} />
        <Box x={330} y={160} w={190} h={95} title="Switch" sub="Same broadcast domain" color="#64748b" active={s >= 1} />
        <Box x={605} y={160} w={250} h={95} title="DHCP Server" sub="Router / external server" color="#34d399" active={s >= 2} />
        <LinkLine x1={245} y1={207} x2={330} y2={207} color="#38bdf8" active={s >= 1} />
        <LinkLine x1={520} y1={207} x2={605} y2={207} color="#a78bfa" active={s >= 1} />
        <FlowDot x1={245} y1={207} x2={605} y2={207} color="#f59e0b" active={s >= 1} />
        <Box x={605} y={300} w={250} h={65} title="DHCP Pool" sub="Range + options + lease" color="#a78bfa" active={s >= 2} />
        <LinkLine x1={730} y1={255} x2={730} y2={300} color="#a78bfa" active={s >= 2} />
        {s >= 3 && <Badge x={250} y={330} text="Binding / Conflict / Statistics" color="#f59e0b" active w={300} />}
      </svg>
    </StepShell>
  )
}

interface PoolInfo {
  id: string
  label: string
  network: string
  mask: string
  excluded: string
  gateway: string
  dns: string
  lease: string
}

const pools: PoolInfo[] = [
  { id: 'lan', label: 'LAN-POOL', network: '192.168.1.0', mask: '255.255.255.0', excluded: '192.168.1.1–20', gateway: '192.168.1.1', dns: '8.8.8.8', lease: '7 days' },
  { id: 'lan1', label: 'LAN-1', network: '10.1.1.0', mask: '255.255.255.0', excluded: '10.1.1.1–10', gateway: '10.1.1.1', dns: '8.8.8.8', lease: '1 day' },
  { id: 'lan2', label: 'LAN-2', network: '10.2.2.0', mask: '255.255.255.0', excluded: '10.2.2.1–10', gateway: '10.2.2.1', dns: '8.8.8.8', lease: '1 day' },
]

export function DhcpPoolExplorerDiagram() {
  const [selected, setSelected] = useState('lan')
  const pool = pools.find((item) => item.id === selected) ?? pools[0]
  const controls = <ChoiceButtons items={pools.map((item) => ({ id: item.id, label: item.label }))} selected={selected} onSelect={setSelected} />
  const legend = `**${pool.label}** — Network \`${pool.network} ${pool.mask}\`; Excluded \`${pool.excluded}\`; Gateway \`${pool.gateway}\`; DNS \`${pool.dns}\`; Lease \`${pool.lease}\`. الـ Pool يحدد الإعدادات، والـ Excluded Addresses تُستبعد قبل التوزيع.`
  return (
    <ChoiceShell title="INTERACTIVE DHCP POOL EXPLORER" controls={controls} legend={legend}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Interactive DHCP pool explorer">
        <Box x={60} y={80} w={340} h={110} title={pool.label} sub={`${pool.network} ${pool.mask}`} color="#a78bfa" active />
        <Box x={450} y={80} w={410} h={110} title="Excluded Addresses" sub={pool.excluded} color="#fb7185" active />
        <Box x={60} y={240} w={250} h={90} title="Default Router" sub={pool.gateway} color="#38bdf8" active />
        <Box x={335} y={240} w={250} h={90} title="DNS Server" sub={pool.dns} color="#34d399" active />
        <Box x={610} y={240} w={250} h={90} title="Lease Time" sub={pool.lease} color="#f59e0b" active />
        <Badge x={250} y={365} text="Pool = network + options + lease; excluded addresses are never leased" color="#a78bfa" active w={430} />
      </svg>
    </ChoiceShell>
  )
}

interface ExcludedRange {
  id: string
  label: string
  from: number
  to: number
}

const excludedRanges: ExcludedRange[] = [
  { id: 'r1', label: '1–20', from: 1, to: 20 },
  { id: 'r2', label: '1–10', from: 1, to: 10 },
  { id: 'r3', label: '1–23', from: 1, to: 23 },
]

export function ExcludedAddressVisualizerDiagram() {
  const [selected, setSelected] = useState('r1')
  const range = excludedRanges.find((item) => item.id === selected) ?? excludedRanges[0]
  const leased = [21, 22, 23, 24]
  const controls = <ChoiceButtons items={excludedRanges.map((item) => ({ id: item.id, label: `.1–.${item.to}` }))} selected={selected} onSelect={setSelected} />
  const excludedCount = range.to - range.from + 1
  const availableCount = 24 - excludedCount - leased.filter((n) => n < range.from || n > range.to).length
  const legend = `النطاق المستبعد \`192.168.1.${range.from}–192.168.1.${range.to}\` = ${excludedCount} عنوان. العناوين المحجوزة لا تُوزّع، والمتاح للمشهد التعليمي = ${availableCount}. استبعاد Gateway والخوادم يمنع تضارب العناوين.`
  return (
    <ChoiceShell title="EXCLUDED ADDRESS VISUALIZER" controls={controls} legend={legend}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Excluded address range visualizer">
        <SvgText x={460} y={45} color="#cbd5e1" size={11} bold>192.168.1.0/24 — first 24 addresses</SvgText>
        {Array.from({ length: 24 }, (_, index) => {
          const n = index + 1
          const excluded = n >= range.from && n <= range.to
          const isLeased = leased.includes(n)
          const color = excluded ? '#fb7185' : isLeased ? '#f59e0b' : '#34d399'
          const x = 40 + (index % 12) * 70
          const y = 90 + Math.floor(index / 12) * 90
          return (
            <g key={n}>
              <rect x={x} y={y} width={58} height={50} rx="8" fill="#0b1224" stroke={color} strokeWidth={excluded ? 2.2 : 1.4} opacity={excluded ? 0.9 : 0.75} />
              <SvgText x={x + 29} y={y + 22} color={color} size={9} bold>{`.${n}`}</SvgText>
              <SvgText x={x + 29} y={y + 39} color="#cbd5e1" size={6.5}>{excluded ? 'EXCLUDED' : isLeased ? 'LEASED' : 'AVAILABLE'}</SvgText>
            </g>
          )
        })}
        <Badge x={140} y={310} text="Excluded = never offered" color="#fb7185" active w={240} />
        <Badge x={420} y={310} text="Leased = active binding" color="#f59e0b" active w={240} />
        <Badge x={690} y={310} text="Available = pool range" color="#34d399" active w={200} />
      </svg>
    </ChoiceShell>
  )
}

const serverConfigStages = [
  'Step 1: اضبط Interface بعنوان IP داخل الشبكة التي سيخدمهاDHCP Server.',
  'Step 2: استبعد Gateway والخوادم والعناوين المحجوزة بـ `ip dhcp excluded-address`.',
  'Step 3: أنشئ Pool باسم واضح وحدد `network` و`default-router` و`dns-server` و`domain-name` و`lease`.',
  'Step 4: تحقق بـ `show ip dhcp pool` و`show ip dhcp binding` و`show ip dhcp conflict`.',
  'السيرفر يوزّع من الـ Pool مع احترام الاستبعادات والتضاربات والـ Bindings الحالية.',
]

export function DhcpServerConfigFlowDiagram() {
  const playback = useStepPlayback(serverConfigStages.length)
  const s = playback.stage
  const commands = [
    'interface Gi0/0 → ip address 192.168.1.1 255.255.255.0',
    'ip dhcp excluded-address 192.168.1.1 192.168.1.20',
    'ip dhcp pool LAN-POOL → network / default-router / dns-server / lease',
    'show ip dhcp pool · binding · conflict · statistics',
    'Pool + exclusions + conflicts → valid lease',
  ]
  return (
    <StepShell title="DHCP SERVER CONFIGURATION FLOW" playback={playback} legend={serverConfigStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Cisco IOS DHCP server configuration flow">
        <Box x={60} y={160} w={220} h={100} title="Router" sub="DHCP Server" color="#38bdf8" active />
        <Box x={640} y={160} w={220} h={100} title="LAN Clients" sub="PC1 / PC2" color="#34d399" active={s >= 2} />
        <LinkLine x1={280} y1={210} x2={640} y2={210} color="#f59e0b" active={s >= 1} />
        <FlowDot x1={280} y1={210} x2={640} y2={210} color="#f59e0b" active={s >= 1} />
        {commands.map((command, index) => (
          <g key={command} opacity={s >= index ? 1 : 0.28}>
            <rect x={300} y={35 + index * 68} width={340} height={46} rx="8" fill="#0b1224" stroke={s === index ? '#f59e0b' : '#475569'} strokeWidth={s === index ? 2.2 : 1} />
            <SvgText x={470} y={63 + index * 68} color={s === index ? '#fbbf24' : '#cbd5e1'} size={7.6} bold>{command}</SvgText>
          </g>
        ))}
      </svg>
    </StepShell>
  )
}

export function DhcpConfigBuilderDiagram() {
  const [gateway, setGateway] = useState('wrong')
  const [mask, setMask] = useState('correct')
  const validGateway = gateway === 'correct'
  const validMask = mask === 'correct'
  const valid = validGateway && validMask
  const controls = (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <ChoiceButtons items={[{ id: 'correct', label: 'GW 192.168.1.1' }, { id: 'wrong', label: 'GW 192.168.2.1' }]} selected={gateway} onSelect={setGateway} />
      <ChoiceButtons items={[{ id: 'correct', label: 'Mask /24' }, { id: 'wrong', label: 'Mask /25' }]} selected={mask} onSelect={setMask} />
    </div>
  )
  const legend = valid
    ? '**VALID:** `default-router 192.168.1.1` ينتمي إلى `192.168.1.0/24` والـ Mask متوافق مع الـ network statement.'
    : `**INVALID:** ${validGateway ? '' : 'الـ Default Gateway outside subnet — استخدم `192.168.1.1`. '}${validMask ? '' : 'الـ Mask لا يطابق الـ network statement — استخدم `255.255.255.0`.'}`
  return (
    <ChoiceShell title="DHCP CONFIGURATION BUILDER" controls={controls} legend={legend}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Interactive DHCP configuration builder">
        <Box x={60} y={90} w={390} h={200} title="Current Pool" sub="ip dhcp pool LAN-POOL" color="#38bdf8" active />
        <SvgText x={255} y={170} color={validGateway ? '#34d399' : '#fb7185'} size={9} bold>{`default-router ${validGateway ? '192.168.1.1' : '192.168.2.1'}`}</SvgText>
        <SvgText x={255} y={210} color={validMask ? '#34d399' : '#fb7185'} size={9} bold>{`network 192.168.1.0 ${validMask ? '255.255.255.0' : '255.255.255.128'}`}</SvgText>
        <Box x={500} y={90} w={360} h={200} title={valid ? 'VALID CONFIG' : 'CONFIG ERROR'} sub={valid ? 'Ready for clients' : 'Fix highlighted fields'} color={valid ? '#34d399' : '#fb7185'} active />
        <Badge x={220} y={345} text={valid ? 'Clients receive correct gateway and mask' : 'Wrong gateway/mask breaks off-subnet access'} color={valid ? '#34d399' : '#fb7185'} active w={470} />
      </svg>
    </ChoiceShell>
  )
}

const clientConfigStages = [
  'على Interface الخاصة بالعميل: `ip address dhcp`.',
  'الجهاز يرسل DHCP Discover من هذه الواجهة.',
  'يستقبل Offer ويطلب(Request) العنوان ثم يستقبل ACK.',
  'الواجهة تحصل على IP وMask والخيارات المتاحة مثل Gateway وDNS.',
  'تحقق بـ `show ip interface brief` و`show dhcp lease` و`show ip route`.',
]

export function DhcpClientConfigDiagram() {
  const playback = useStepPlayback(clientConfigStages.length)
  const s = playback.stage
  return (
    <StepShell title="DHCP CLIENT CONFIGURATION" playback={playback} legend={clientConfigStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Cisco IOS DHCP client configuration on an interface">
        <Box x={60} y={160} w={220} h={100} title="Server" sub="192.168.1.100" color="#34d399" active />
        <Box x={380} y={160} w={160} h={100} title="Switch" sub="L2 path" color="#64748b" active={s >= 1} />
        <Box x={640} y={160} w={220} h={100} title="Router Client" sub="Gi0/1 → ip address dhcp" color="#38bdf8" active={s >= 0} />
        <LinkLine x1={280} y1={210} x2={380} y2={210} color="#a78bfa" active={s >= 1} />
        <LinkLine x1={540} y1={210} x2={640} y2={210} color="#38bdf8" active={s >= 1} />
        <FlowDot x1={640} y1={210} x2={280} y2={210} color="#f59e0b" active={s >= 1} />
        {s >= 3 && <Badge x={260} y={320} text="IP + Mask + Gateway + DNS options" color="#f59e0b" active w={410} />}
      </svg>
    </StepShell>
  )
}

const leaseStages = [
  'DISCOVER: Client يبحث عن DHCP Server عبر Broadcast.',
  'OFFER: Server يقترح عنواناً من Pool.',
  'REQUEST: Client يطلب العنوان المقترح.',
  'ACK: Server يؤكد ويرسل Lease والخيارات.',
  'الـ Binding يُنشأ، ومع اقتراب انتهاء الـ Lease يتم التجديد حسب المنصة.',
]

export function DhcpClientLeaseAcquisitionDiagram() {
  const playback = useStepPlayback(leaseStages.length)
  const s = playback.stage
  const labels = ['DISCOVER', 'OFFER', 'REQUEST', 'ACK', 'BINDING']
  return (
    <StepShell title="DHCP CLIENT LEASE ACQUISITION" playback={playback} legend={leaseStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="DORA DHCP lease acquisition flow">
        <Box x={80} y={70} w={220} h={90} title="DHCP Client" sub="Gi0/1" color="#38bdf8" active />
        <Box x={620} y={70} w={220} h={90} title="DHCP Server" sub="Pool + options" color="#34d399" active />
        {labels.map((label, index) => {
          const y = 200 + index * 38
          const toServer = index === 0 || index === 2
          const x1 = toServer ? 300 : 620
          const x2 = toServer ? 620 : 300
          const color = s === index ? '#f59e0b' : '#475569'
          return (
            <g key={label} opacity={s >= index ? 1 : 0.35}>
              <LinkLine x1={x1} y1={y} x2={x2} y2={y} color={color} active={s >= index} />
              <Badge x={390} y={y - 12} text={`${label} ${toServer ? '→' : '←'}`} color={color} active={s === index} w={150} />
              {s === index && <FlowDot x1={x1} y1={y} x2={x2} y2={y} color="#f59e0b" active />}
            </g>
          )
        })}
      </svg>
    </StepShell>
  )
}

interface RoleInfo {
  id: string
  label: string
  detail: string
}

const roles: Record<string, RoleInfo> = {
  server: { id: 'server', label: 'Server', detail: 'يملك الـ Pool ويوزّع العناوين ويحدد Gateway وDNS وLease ويتحقق من Conflicts.' },
  client: { id: 'client', label: 'Client', detail: 'يطلب إعدادات الشبكة تلقائياً بـ `ip address dhcp` ويستخدم العنوان والخيارات التي يحصل عليها.' },
}

export function DhcpServerVsClientDiagram() {
  const [selected, setSelected] = useState('server')
  const item = roles[selected]
  const controls = <ChoiceButtons items={Object.values(roles).map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="DHCP SERVER vs CLIENT" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="DHCP server responsibilities compared with DHCP client">
        <Box x={70} y={130} w={330} h={150} title="DHCP Server" sub="Pool · exclusions · bindings" color="#34d399" active={selected === 'server'} />
        <Box x={520} y={130} w={330} h={150} title="DHCP Client" sub="ip address dhcp · DORA" color="#38bdf8" active={selected === 'client'} />
        <LinkLine x1={400} y1={205} x2={520} y2={205} color="#f59e0b" active />
        <FlowDot x1={400} y1={205} x2={520} y2={205} color="#f59e0b" active />
        <Badge x={260} y={330} text="Server offers · Client requests · Server acknowledges" color="#a78bfa" active w={400} />
      </svg>
    </ChoiceShell>
  )
}

const relayArchitectureStages = [
  'Client في LAN 1 يرسل DHCP Discover كـ Broadcast.',
  'Router يمنع مرور Broadcast بين Interfaces افتراضياً.',
  'Relay Agent على الواجهة القريبة من Client يستقبل الرسالة.',
  'Relay يرسل الرسالة كـ Unicast إلى DHCP Server ويضيف giaddr.',
  'Server يختار Pool المناسب ويرد للـ Relay، والـ Relay يوصّل الرد للعميل.',
]

export function DhcpRelayArchitectureDiagram() {
  const playback = useStepPlayback(relayArchitectureStages.length)
  const s = playback.stage
  return (
    <StepShell title="DHCP RELAY ARCHITECTURE" playback={playback} legend={relayArchitectureStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="DHCP relay architecture across two LANs and a remote server">
        <Box x={55} y={250} w={170} h={85} title="PC1 LAN 1" sub="10.1.1.0/24" color="#38bdf8" active={s >= 0} />
        <Box x={55} y={85} w={170} h={85} title="PC2 LAN 2" sub="10.2.2.0/24" color="#38bdf8" active={s >= 0} />
        <Box x={340} y={160} w={230} h={110} title="Relay Router" sub="Gi0/0 · Gi0/1" color="#f59e0b" active={s >= 2} />
        <Box x={680} y={160} w={210} h={110} title="DHCP Server" sub="192.168.100.10" color="#34d399" active={s >= 3} />
        <LinkLine x1={225} y1={292} x2={340} y2={225} color="#38bdf8" active={s >= 0} />
        <LinkLine x1={225} y1={127} x2={340} y2={205} color="#38bdf8" active={s >= 0} />
        <LinkLine x1={570} y1={215} x2={680} y2={215} color="#f59e0b" active={s >= 3} />
        <FlowDot x1={225} y1={292} x2={680} y2={215} color="#f59e0b" active={s >= 2} />
        {s >= 3 && <Badge x={370} y={320} text="giaddr helps server pick the right pool" color="#a78bfa" active w={330} />}
      </svg>
    </StepShell>
  )
}

interface ScopeMode {
  id: string
  label: string
  detail: string
}

const scopeModes: Record<string, ScopeMode> = {
  same: { id: 'same', label: 'Same LAN', detail: 'Client وServer في نفس Broadcast Domain: الـ Broadcast يصل مباشرة ولا يحتاج Relay.' },
  remote: { id: 'remote', label: 'Remote LAN', detail: 'الراوتر لا يمرّر Broadcast بين Interfaces؛ لازم `ip helper-address` على الواجهة ناحية العميل.' },
}

export function DhcpBroadcastLimitationDiagram() {
  const [selected, setSelected] = useState('remote')
  const item = scopeModes[selected]
  const controls = <ChoiceButtons items={Object.values(scopeModes).map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="DHCP BROADCAST LIMITATION" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="DHCP broadcast same LAN compared with remote LAN relay">
        <Box x={60} y={160} w={190} h={100} title="Client" sub="Broadcast DHCP" color="#38bdf8" active />
        <Box x={360} y={160} w={190} h={100} title="Router" sub={selected === 'remote' ? 'Blocks broadcast' : 'Not in path'} color={selected === 'remote' ? '#fb7185' : '#64748b'} active />
        <Box x={670} y={160} w={190} h={100} title="Server" sub="DHCP listener" color="#34d399" active />
        <LinkLine x1={250} y1={210} x2={360} y2={210} color="#38bdf8" active />
        <LinkLine x1={550} y1={210} x2={670} y2={210} color={selected === 'remote' ? '#fb7185' : '#34d399'} active={selected === 'same'} dashed={selected === 'remote'} />
        {selected === 'remote' && <Badge x={430} y={310} text="Broadcast stops here → use relay" color="#fb7185" active w={330} />}
        {selected === 'same' && <Badge x={430} y={310} text="Broadcast reaches server directly" color="#34d399" active w={320} />}
      </svg>
    </ChoiceShell>
  )
}

const relayMessageStages = [
  'Client يرسل Discover داخل LAN 1.',
  'الواجهة Gi0/0 تستقبل Broadcast وتحوّله إلى Unicast نحو السيرفر.',
  'Relay يضيف giaddr = عنوان واجهة العميل.',
  'Server يقرأ giaddr ويختار Pool 10.1.1.0/24.',
  'الرد يرجع للـ Relay ثم يصل إلى Client.',
]

export function DhcpRelayMessageFlowDiagram() {
  const playback = useStepPlayback(relayMessageStages.length)
  const s = playback.stage
  return (
    <StepShell title="DHCP RELAY MESSAGE FLOW" playback={playback} legend={relayMessageStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="DHCP relay message flow with giaddr and pool selection">
        <Box x={60} y={165} w={190} h={90} title="Client" sub="10.1.1.x" color="#38bdf8" active />
        <Box x={340} y={165} w={220} h={90} title="Relay Gi0/0" sub="10.1.1.1 → giaddr" color="#f59e0b" active={s >= 1} />
        <Box x={660} y={165} w={200} h={90} title="Server" sub="192.168.100.10" color="#34d399" active={s >= 2} />
        <LinkLine x1={250} y1={210} x2={340} y2={210} color="#38bdf8" active={s >= 0} />
        <LinkLine x1={560} y1={210} x2={660} y2={210} color="#f59e0b" active={s >= 2} />
        <FlowDot x1={250} y1={210} x2={660} y2={210} color="#f59e0b" active={s >= 1} />
        {s >= 3 && <Badge x={320} y={310} text="Pool selected from giaddr / relay info" color="#a78bfa" active w={340} />}
      </svg>
    </StepShell>
  )
}

interface PlacementChoice {
  id: string
  label: string
  ok: boolean
  detail: string
}

const placements: PlacementChoice[] = [
  { id: 'client', label: 'Client-facing Gi0/0', ok: true, detail: 'صح: الـ Broadcast من العميل يصل إلى هذه الواجهة، لذلك يُضبط عليها `ip helper-address`.' },
  { id: 'server', label: 'Server-facing Gi0/1', ok: false, detail: 'خطأ شائع: ضبط الـ helper على واجهة السيرفر لن يلتقط Broadcast القادم من شبكة العميل.' },
]

export function HelperAddressPlacementDiagram() {
  const [selected, setSelected] = useState('client')
  const item = placements.find((entry) => entry.id === selected) ?? placements[0]
  const controls = <ChoiceButtons items={placements.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="ip helper-address INTERFACE PLACEMENT" controls={controls} legend={item.detail}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="ip helper-address placement on client facing versus server facing interface">
        <Box x={60} y={165} w={190} h={90} title="Client LAN" sub="10.1.1.0/24" color="#38bdf8" active />
        <Box x={450} y={165} w={200} h={90} title="Relay Router" sub="ip helper-address" color="#f59e0b" active />
        <Box x={730} y={165} w={160} h={90} title="Server" sub="192.168.100.10" color="#34d399" active />
        <ClickNode x={330} y={80} w={200} h={65} title="Gi0/0" sub="Client-facing" color="#38bdf8" selected={selected === 'client'} onClick={() => setSelected('client')} />
        <ClickNode x={330} y={280} w={200} h={65} title="Gi0/1" sub="Server-facing" color="#64748b" selected={selected === 'server'} onClick={() => setSelected('server')} />
        <LinkLine x1={250} y1={210} x2={450} y2={210} color="#38bdf8" active />
        <LinkLine x1={650} y1={210} x2={730} y2={210} color="#34d399" active />
        <Badge x={270} y={375} text={item.ok ? 'Correct placement — DHCP broadcast is relayed' : 'Wrong placement — client broadcast is not relayed'} color={item.ok ? '#34d399' : '#fb7185'} active w={390} />
      </svg>
    </ChoiceShell>
  )
}

const giaddrStages = [
  'Client لا يعرف عنوان السيرفر؛ يرسل Broadcast داخل subnet الخاص به.',
  'Relay يستقبل الرسالة على الواجهة المتصلة بالعميل.',
  'Relay يضع giaddr (Gateway IP Address) = عنوان تلك الواجهة.',
  'Server يستخدم giaddr لتحديد أي Pool يخدم هذا الـ subnet.',
  'بدون giaddr صحيح قد يُختار Pool خاطئ أو لا يُوجد Pool مطابق.',
]

export function GiaddrExplanationDiagram() {
  const playback = useStepPlayback(giaddrStages.length)
  const s = playback.stage
  return (
    <StepShell title="giaddr EXPLANATION" playback={playback} legend={giaddrStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="giaddr inserted by DHCP relay used for pool selection">
        <Box x={60} y={160} w={190} h={95} title="Client" sub="10.1.1.x" color="#38bdf8" active={s >= 0} />
        <Box x={350} y={160} w={210} h={95} title="Relay" sub="Gi0/0 = 10.1.1.1" color="#f59e0b" active={s >= 1} />
        <Box x={660} y={160} w={210} h={95} title="Server" sub="Pool lookup" color="#34d399" active={s >= 3} />
        <LinkLine x1={250} y1={207} x2={350} y2={207} color="#38bdf8" active={s >= 0} />
        <LinkLine x1={560} y1={207} x2={660} y2={207} color="#f59e0b" active={s >= 2} />
        {s >= 2 && <Badge x={320} y={300} text="giaddr = 10.1.1.1" color="#a78bfa" active w={270} />}
        {s >= 3 && <Badge x={610} y={300} text="Match pool 10.1.1.0/24" color="#34d399" active w={270} />}
      </svg>
    </StepShell>
  )
}

interface RemotePool {
  id: string
  label: string
  subnet: string
  gateway: string
  helper: string
}

const remotePools: RemotePool[] = [
  { id: 'lan1', label: 'LAN 1', subnet: '10.1.1.0/24', gateway: '10.1.1.1', helper: '192.168.100.10' },
  { id: 'lan2', label: 'LAN 2', subnet: '10.2.2.0/24', gateway: '10.2.2.1', helper: '192.168.100.10' },
]

export function DhcpPoolSelectionDiagram() {
  const [selected, setSelected] = useState('lan1')
  const item = remotePools.find((entry) => entry.id === selected) ?? remotePools[0]
  const controls = <ChoiceButtons items={remotePools.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  const legend = `**${item.label}** — giaddr يشير إلى \`${item.subnet}\`; السيرفر يختار Pool الذي يطابق الشبكة ويرسل Gateway \`${item.gateway}\`. الـ helper على الواجهة ناحية العميل هو \`${item.helper}\`.`
  return (
    <ChoiceShell title="DHCP POOL SELECTION FOR REMOTE NETWORKS" controls={controls} legend={legend}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Remote DHCP pool selection using relay information">
        {remotePools.map((pool, index) => (
          <ClickNode key={pool.id} x={60} y={90 + index * 110} w={220} h={80} title={pool.label} sub={pool.subnet} color="#38bdf8" selected={selected === pool.id} onClick={() => setSelected(pool.id)} />
        ))}
        <Box x={360} y={145} w={190} h={100} title="Relay" sub={`giaddr → ${item.gateway}`} color="#f59e0b" active />
        <Box x={650} y={145} w={220} h={100} title="Server Pools" sub={`Match ${item.subnet}`} color="#34d399" active />
        <LinkLine x1={280} y1={selected === 'lan1' ? 130 : 240} x2={360} y2={195} color="#38bdf8" active />
        <LinkLine x1={550} y1={195} x2={650} y2={195} color="#a78bfa" active />
        <Badge x={300} y={320} text="One matching pool per remote subnet avoids wrong gateway" color="#a78bfa" active w={420} />
      </svg>
    </ChoiceShell>
  )
}

interface VerifyInfo {
  id: string
  label: string
  detail: string
}

const verifyCommands: VerifyInfo[] = [
  { id: 'pool', label: 'show ip dhcp pool', detail: 'يعرض اسم الـ Pool والشبكة وعدد العناوين المستأجرة والمتاحة.' },
  { id: 'binding', label: 'show ip dhcp binding', detail: 'يعرض الـ bindings: IP وMAC وLease expiration و نوع الـ binding.' },
  { id: 'conflict', label: 'show ip dhcp conflict', detail: 'يعرض عناوين فيها تعارض؛ السيرفر يتجنب توزيعها حتى تُحل.' },
  { id: 'stats', label: 'show ip dhcp server statistics', detail: 'يعرض عدّاد الرسائل مثل DISCOVER وOFFER وREQUEST وACK حسب المنصة.' },
]

export function DhcpServerVerificationDiagram() {
  const [selected, setSelected] = useState('pool')
  const item = verifyCommands.find((entry) => entry.id === selected) ?? verifyCommands[0]
  const controls = <ChoiceButtons items={verifyCommands.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="DHCP SERVER VERIFICATION" controls={controls} legend={`**\`${item.label}\`** — ${item.detail} الأرقام المعروضة هنا تعليمية وليست output من جهاز حقيقي.`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Interactive Cisco IOS DHCP server verification commands">
        <Box x={70} y={90} w={340} h={110} title="Command" sub={item.label} color="#38bdf8" active />
        <Box x={480} y={90} w={370} h={110} title="Expected Information" sub={item.id === 'binding' ? 'IP / MAC / lease time' : item.id === 'conflict' ? 'Conflicting addresses' : item.id === 'stats' ? 'Message counters' : 'Pool / subnet / utilization'} color="#34d399" active />
        <Badge x={110} y={260} text="show running-config → confirm pool + helper commands" color="#a78bfa" active w={380} />
        <Badge x={510} y={330} text="Educational output only" color="#f59e0b" active w={260} />
      </svg>
    </ChoiceShell>
  )
}

interface RelayIssue {
  id: string
  label: string
  detail: string
}

const relayIssues: RelayIssue[] = [
  { id: 'helper', label: 'Missing helper', detail: 'لا يوجد `ip helper-address` على واجهة العميل؛ أضفه وأعد DORA.' },
  { id: 'ip', label: 'Wrong server IP', detail: 'الـ helper يشير لعنوان خاطئ؛ صحّحه إلى IP السيرفر الحقيقي.' },
  { id: 'route', label: 'No route', detail: 'لا يوجد route من Relay إلى السيرفر؛ أصلح Routing ثم اختبر.' },
  { id: 'interface', label: 'Wrong interface', detail: 'الـ helper على واجهة السيرفر بدل واجهة العميل؛ انقله للواجهة الصحيحة.' },
  { id: 'pool', label: 'No matching pool', detail: 'السيرفر لا يملك Pool يطابق giaddr؛ أضف Pool للـ remote subnet.' },
  { id: 'acl', label: 'ACL / firewall', detail: 'تقطيع UDP 67/68 أو المسار يمنع الرسائل؛ اسمح بالترافيك وأعد المحاولة.' },
]

export function DhcpRelayTroubleshootingDiagram() {
  const [selected, setSelected] = useState('helper')
  const item = relayIssues.find((entry) => entry.id === selected) ?? relayIssues[0]
  const controls = <ChoiceButtons items={relayIssues.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="DHCP RELAY TROUBLESHOOTING" controls={controls} legend={item.detail}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="DHCP relay troubleshooting selector">
        <Box x={350} y={30} w={220} h={60} title="Relay Failure" sub="No remote lease" color="#f59e0b" active />
        <LinkLine x1={460} y1={90} x2={460} y2={125} color="#f59e0b" active />
        <LinkLine x1={120} y1={125} x2={800} y2={125} color="#475569" active />
        {relayIssues.map((entry, index) => {
          const x = 20 + (index % 3) * 300
          const y = 155 + Math.floor(index / 3) * 125
          const cx = x + 100
          return (
            <g key={entry.id}>
              <LinkLine x1={cx} y1={125} x2={cx} y2={y} color={selected === entry.id ? '#f59e0b' : '#475569'} active={selected === entry.id} />
              <ClickNode x={x} y={y} w={200} h={85} title={entry.label} sub="Check / fix" color="#38bdf8" selected={selected === entry.id} onClick={() => setSelected(entry.id)} />
            </g>
          )
        })}
      </svg>
    </ChoiceShell>
  )
}

export function DhcpPoolExhaustionDiagram() {
  const [usedId, setUsedId] = useState('23')
  const used = Number(usedId)
  const available = Math.max(0, 24 - used)
  const controls = <ChoiceButtons items={[{ id: '20', label: '20 used' }, { id: '23', label: '23 used' }, { id: '24', label: '24 used' }]} selected={usedId} onSelect={setUsedId} />
  const legend = `مع ${used} عنوان مستأجر من نطاق صغير، المتبقي = ${available}. عند النفاد لا يستطيع السيرفر تقديم Offer جديد؛ راجع \`show ip dhcp pool\` وعدّل النطاق أو Lease time.`
  return (
    <ChoiceShell title="DHCP POOL EXHAUSTION" controls={controls} legend={legend}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="DHCP pool exhaustion visualizer">
        <rect x={80} y={130} width={760} height={80} rx="12" fill="#0b1224" stroke="#1e3a5f" />
        {Array.from({ length: 24 }, (_, index) => (
          <rect key={index} x={95 + index * 30} y={155} width={22} height={30} rx="4" fill={index < used ? '#f59e0b' : '#34d399'} opacity={index < used ? 0.95 : 0.7} />
        ))}
        <SvgText x={460} y={265} color={available === 0 ? '#fb7185' : '#34d399'} size={13} bold>{`USED ${used} / 24 · AVAILABLE ${available}`}</SvgText>
        <Badge x={250} y={330} text={available === 0 ? 'Pool exhausted → no new Offer' : 'Pool has addresses to offer'} color={available === 0 ? '#fb7185' : '#34d399'} active w={430} />
      </svg>
    </ChoiceShell>
  )
}

interface TroubleBranch {
  id: string
  label: string
  detail: string
}

const troubleBranches: TroubleBranch[] = [
  { id: 'physical', label: 'Physical', detail: 'افحص الكابل/المنفذ والـ link status بـ `show interfaces` و`show ip interface brief`. النتيجة: interface up/up.' },
  { id: 'interface', label: 'Interface', detail: 'تأكد أن الواجهة ليست administratively down؛ استخدم `no shutdown`. النتيجة: الواجهة تشارك في DORA.' },
  { id: 'pool', label: 'DHCP Pool', detail: `راجع \`show ip dhcp pool\`؛ هل يوجد Pool ونطاقه صحيح؟ أصلح الـ network statement. النتيجة: Offer يصل للعميل.` },
  { id: 'excluded', label: 'Excluded', detail: 'تأكد أن نطاق الاستبعاد لا يغطي كل العناوين. قلّل النطاق؛ النتيجة: عناوين متاحة للتوزيع.' },
  { id: 'relay', label: 'DHCP Relay', detail: 'للشبكات البعيدة تحقق من `ip helper-address` على واجهة العميل. النتيجة: الرسالة تصل للسيرفر.' },
  { id: 'routing', label: 'Routing', detail: 'افحص `show ip route`؛ لازم يوجد مسار من Relay إلى السيرفر. النتيجة: Unicast يصل للسيرفر.' },
  { id: 'reach', label: 'Server reach', detail: 'تأكد من عنوان السيرفر وحالته؛ تحقق من الخدمة والـ counters. النتيجة: استجابة DHCP ACK.' },
]

export function DhcpTroubleshootingTreeDiagram() {
  const [selected, setSelected] = useState('pool')
  const item = troubleBranches.find((entry) => entry.id === selected) ?? troubleBranches[0]
  const controls = <ChoiceButtons items={troubleBranches.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="DHCP TROUBLESHOOTING DECISION TREE" controls={controls} legend={`**Client did not receive an IP Address** → ${item.detail}`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Interactive DHCP troubleshooting decision tree">
        <Box x={330} y={20} w={260} h={60} title="No IP Address" sub="Start here" color="#f59e0b" active />
        <LinkLine x1={460} y1={80} x2={460} y2={118} color="#f59e0b" active />
        <LinkLine x1={120} y1={118} x2={800} y2={118} color="#475569" active />
        {troubleBranches.map((entry, index) => {
          const x = 20 + (index % 4) * 225
          const y = 150 + Math.floor(index / 4) * 125
          const cx = x + 100
          return (
            <g key={entry.id}>
              <LinkLine x1={cx} y1={118} x2={cx} y2={y} color={selected === entry.id ? '#f59e0b' : '#475569'} active={selected === entry.id} />
              <ClickNode x={x} y={y} w={200} h={85} title={entry.label} sub="Check" color="#38bdf8" selected={selected === entry.id} onClick={() => setSelected(entry.id)} />
            </g>
          )
        })}
      </svg>
    </ChoiceShell>
  )
}

const lifecycleStages = [
  'Client يرسل Discover؛ Relay ينقله إن لزم الأمر.',
  'Server يختار Pool مناسباً ويقدم Offer.',
  'Client يطلب(Request) والسيرفر يرسل ACK.',
  'يُنشأ Binding ويُثبّت Lease والخيارات مثل Gateway وDNS.',
  'Client يستخدم العنوان؛ السيرفر يراقب Conflicts وPool utilization.',
  'عند انتهاء Lease يتم التجديد أو إعادة العملية حسب المنصة.',
]

export function CompleteDhcpLifecycleDiagram() {
  const playback = useStepPlayback(lifecycleStages.length)
  const s = playback.stage
  const labels = ['Discover', 'Offer', 'Request', 'ACK', 'Binding', 'Renew']
  return (
    <StepShell title="COMPLETE DHCP NETWORK LIFECYCLE" playback={playback} legend={lifecycleStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Complete DHCP lifecycle from discover to renew">
        {labels.map((label, index) => (
          <g key={label} opacity={s >= index ? 1 : 0.3}>
            <rect x={30 + index * 150} y={170} width={130} height={72} rx="9" fill="#0b1224" stroke={s === index ? '#f59e0b' : '#38bdf8'} strokeWidth={s === index ? 2.3 : 1.2} />
            <SvgText x={95 + index * 150} y={212} color={s === index ? '#fbbf24' : '#cbd5e1'} size={8.5} bold>{label}</SvgText>
            {index < labels.length - 1 && <LinkLine x1={160 + index * 150} y1={206} x2={180 + index * 150} y2={206} color="#475569" active={s > index} />}
          </g>
        ))}
        {s >= 5 && <Badge x={250} y={315} text="Relay + correct pool + routing = successful lease" color="#34d399" active w={420} />}
      </svg>
    </StepShell>
  )
}

interface BeforeAfter {
  id: string
  label: string
  bad: string
  good: string
  issue: string
}

const beforeAfter: BeforeAfter[] = [
  { id: 'gateway', label: 'Gateway', bad: 'default-router 192.168.2.1', good: 'default-router 192.168.1.1', issue: 'الـ Gateway خارج الـ subnet.' },
  { id: 'excluded', label: 'Excluded', bad: 'excluded 192.168.1.1 192.168.1.254', good: 'excluded 192.168.1.1 192.168.1.20', issue: 'الاستبعاد يغطي كل النطاق.' },
  { id: 'helper', label: 'Relay', bad: 'helper on server-facing interface', good: 'helper on client-facing interface', issue: 'Broadcast العميل لم يُلتقط.' },
]

export function DhcpBeforeAfterDiagram() {
  const [selected, setSelected] = useState('gateway')
  const item = beforeAfter.find((entry) => entry.id === selected) ?? beforeAfter[0]
  const controls = <ChoiceButtons items={beforeAfter.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="DHCP BEFORE vs AFTER CONFIGURATION" controls={controls} legend={`**${item.issue}** — قبل: \`${item.bad}\`; بعد: \`${item.good}\`.`}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Before and after DHCP configuration comparison">
        <Box x={60} y={100} w={360} h={150} title="BEFORE (incorrect)" sub={item.bad} color="#fb7185" active />
        <Box x={500} y={100} w={360} h={150} title="AFTER (correct)" sub={item.good} color="#34d399" active />
        <LinkLine x1={420} y1={175} x2={500} y2={175} color="#f59e0b" active />
        <FlowDot x1={420} y1={175} x2={500} y2={175} color="#f59e0b" active />
        <Badge x={260} y={310} text={`Fix: ${item.issue}`} color="#a78bfa" active w={400} />
      </svg>
    </ChoiceShell>
  )
}
