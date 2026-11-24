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
function Badge({ x, y, text, color = '#38bdf8', active = true, w = 150 }: { x: number; y: number; text: string; color?: string; active?: boolean; w?: number }) {
  return <g opacity={active ? 1 : 0.4}><rect x={x} y={y} width={w} height={24} rx="7" fill="#0a1730" stroke={color} strokeWidth={active ? 1.8 : 1} /><SvgText x={x + w / 2} y={y + 16} color={color} size={8.2} bold>{text}</SvgText></g>
}

const conceptStages = ['المسؤول يحدد المسار يدوياً على الراوتر.', 'Static route تُضاف إلى Routing Table.', 'عند وصول packet لوجهة مطابقة، الراوتر يستخدم المسار.', 'لا يوجد بروتوكول Routing يعلن أو يتعلم المسار تلقائياً.', 'إذا تغيرت الشبكة، المسؤول يجب أن يحدّث المسار.']
export function StaticRoutingConceptDiagram() {
  const p = useStepPlayback(conceptStages.length); const s = p.stage
  return <StepShell title="STATIC ROUTING CONCEPT" playback={p} legend={conceptStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Static routing concept where administrator manually configures routes">
    <Box x={60} y={150} w={180} h={100} title="Admin" sub="manual config" color="#38bdf8" active={s===0||s===4} />
    <Box x={360} y={150} w={200} h={100} title="Router R1" sub="Routing Table" color="#f59e0b" active={s>=1} />
    <Box x={700} y={150} w={160} h={100} title="Network" sub="192.168.2.0/24" color="#34d399" active={s>=2} />
    <LinkLine x1={240} y1={200} x2={360} y2={200} color="#38bdf8" active={s>=0} />
    <LinkLine x1={560} y1={200} x2={700} y2={200} color="#34d399" active={s>=2} />
    {s>=1 && <Badge x={390} y={270} text="ip route 192.168.2.0 ..." color="#f59e0b" active w={180} />}
  </svg></StepShell>
}

const vsStages = ['Static: المسؤول يضيف المسارات يدوياً.', 'Dynamic: بروتوكولات التوجيه تتعلم المسارات تلقائياً.', 'Static أبسط وأقل استهلاكاً للموارد في الشبكات الصغيرة.', 'Dynamic يتكيف مع التغييرات لكنه أعقد.', 'كلاهما يمكن أن يوجد في Routing Table مع اختلاف AD.']
export function StaticVsDynamicRoutingDiagram() {
  const p = useStepPlayback(vsStages.length); const s = p.stage
  return <StepShell title="STATIC vs DYNAMIC ROUTING" playback={p} legend={vsStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Comparison between static and dynamic routing">
    <Box x={80} y={110} w={330} h={210} title="STATIC" sub="manual / predictable" color="#38bdf8" active={s===0||s===2||s===4} />
    <Box x={510} y={110} w={330} h={210} title="DYNAMIC" sub="protocol learned" color="#34d399" active={s===1||s===3||s===4} />
    <SvgText x={245} y={190} color="#cbd5e1" size={9}>Admin configures routes</SvgText>
    <SvgText x={245} y={215} color="#cbd5e1" size={9}>No routing protocol overhead</SvgText>
    <SvgText x={245} y={240} color="#cbd5e1" size={9}>No automatic adaptation</SvgText>
    <SvgText x={675} y={190} color="#cbd5e1" size={9}>OSPF/EIGRP/RIP learn routes</SvgText>
    <SvgText x={675} y={215} color="#cbd5e1" size={9}>Adapts to topology changes</SvgText>
    <SvgText x={675} y={240} color="#cbd5e1" size={9}>Uses CPU/bandwidth</SvgText>
  </svg></StepShell>
}

const netRouteStages = ['Network route تستهدف شبكة كاملة، ليس host واحد.', 'المثال: 192.168.2.0 255.255.255.0 via 10.0.0.2.', 'أي packet لوجهة داخل 192.168.2.0/24 يطابق هذا المسار.', 'Subnet mask تحدد حجم الشبكة الوجهة.', 'هذا النوع شائع لربط LANs ببعضها.']
export function NetworkStaticRouteDiagram() {
  const p = useStepPlayback(netRouteStages.length); const s = p.stage
  return <StepShell title="NETWORK STATIC ROUTE" playback={p} legend={netRouteStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Network static route targets an entire destination network">
    <Box x={60} y={170} w={140} h={80} title="R1" sub="source router" color="#38bdf8" active />
    <Box x={360} y={120} w={220} h={180} title="LAN 2" sub="192.168.2.0/24" color="#34d399" active={s>=2} />
    <SvgText x={470} y={190} color="#cbd5e1" size={9}>PC2 .10</SvgText>
    <SvgText x={470} y={215} color="#cbd5e1" size={9}>PC3 .20</SvgText>
    <SvgText x={470} y={240} color="#cbd5e1" size={9}>Any host in /24</SvgText>
    <LinkLine x1={200} y1={210} x2={360} y2={210} color="#f59e0b" active={s>=1} />
    {s>=1 && <Badge x={210} y={130} text="ip route 192.168.2.0 255.255.255.0 10.0.0.2" color="#f59e0b" active w={360} />}
  </svg></StepShell>
}

const hostRouteStages = ['Host route تستهدف عنوان IP واحد فقط.', 'تستخدم mask 255.255.255.255 أو /32 في IPv4.', 'المثال: ip route 192.168.2.10 255.255.255.255 10.0.0.2.', 'أكثر تحديداً من network route لنفس الشبكة.', 'مفيدة للوصول لجهاز محدد أو إدارة/سياسة خاصة.']
export function HostStaticRouteDiagram() {
  const p = useStepPlayback(hostRouteStages.length); const s = p.stage
  return <StepShell title="HOST STATIC ROUTE (/32)" playback={p} legend={hostRouteStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Host static route targets a single host using /32 mask">
    <Box x={60} y={170} w={140} h={80} title="R1" sub="source router" color="#38bdf8" active />
    <Box x={520} y={170} w={200} h={80} title="Host" sub="192.168.2.10/32" color="#34d399" active={s>=2} />
    <LinkLine x1={200} y1={210} x2={520} y2={210} color="#f59e0b" active={s>=1} />
    {s>=1 && <Badge x={210} y={120} text="ip route 192.168.2.10 255.255.255.255 10.0.0.2" color="#f59e0b" active w={390} />}
    {s>=3 && <Badge x={300} y={290} text="/32 = single host only" color="#a78bfa" active w={220} />}
  </svg></StepShell>
}

const defaultStages = ['Default route تُستخدم عندما لا يوجد route أكثر تحديداً.', 'في IPv4: 0.0.0.0 0.0.0.0 تعني أي وجهة.', 'تُعرف أيضاً كـ Gateway of Last Resort.', 'مفيدة للاتصال بالإنترنت أو الخروج من stub network.', 'Specific routes تُفضل عليها بسبب LPM.']
export function DefaultStaticRouteDiagram() {
  const p = useStepPlayback(defaultStages.length); const s = p.stage
  return <StepShell title="DEFAULT STATIC ROUTE" playback={p} legend={defaultStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Default static route acts as gateway of last resort">
    <Box x={70} y={170} w={150} h={90} title="R1" sub="no specific match" color="#38bdf8" active />
    <Box x={390} y={170} w={170} h={90} title="R2 / ISP" sub="next hop" color="#f59e0b" active={s>=2} />
    <Box x={700} y={170} w={150} h={90} title="Any Network" sub="unknown destinations" color="#94a3b8" active={s>=1} />
    <LinkLine x1={220} y1={215} x2={390} y2={215} color="#f59e0b" active={s>=1} />
    <LinkLine x1={560} y1={215} x2={700} y2={215} color="#f59e0b" active={s>=2} />
    {s>=1 && <Badge x={290} y={110} text="ip route 0.0.0.0 0.0.0.0 10.0.0.2" color="#f59e0b" active w={300} />}
    {s>=3 && <Badge x={340} y={300} text="Gateway of Last Resort" color="#34d399" active w={240} />}
  </svg></StepShell>
}

const floatStages = ['Primary static route لها AD افتراضي 1.', 'Floating static route تُضبط بـ AD أعلى، مثل 10.', 'طالما primary route صالحة، هي الموجودة في routing table.', 'عند فشل/اختفاء primary route، floating route يمكن أن تدخل الجدول.', 'اكتشاف الفشل يعتمد على صلاحية المسار؛ فشل الوصول لا يعني دائماً إزالة route تلقائياً.']
export function FloatingStaticRouteDiagram() {
  const p = useStepPlayback(floatStages.length); const s = p.stage
  const primaryActive = s < 3
  return <StepShell title="FLOATING STATIC ROUTE" playback={p} legend={floatStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Floating static route provides backup with higher administrative distance">
    <Box x={60} y={170} w={120} h={80} title="R1" sub="source" color="#38bdf8" active />
    <Box x={760} y={170} w={120} h={80} title="LAN 2" sub="dest" color="#34d399" active />
    <Box x={400} y={70} w={160} h={70} title="Primary Path" sub="AD 1" color={primaryActive ? '#34d399' : '#64748b'} active={primaryActive} />
    <Box x={400} y={270} w={160} h={70} title="Backup Path" sub="AD 10" color={!primaryActive ? '#f59e0b' : '#64748b'} active={!primaryActive} />
    <LinkLine x1={180} y1={190} x2={400} y2={105} color="#34d399" active={primaryActive} />
    <LinkLine x1={560} y1={105} x2={760} y2={190} color="#34d399" active={primaryActive} />
    <LinkLine x1={180} y1={230} x2={400} y2={305} color="#f59e0b" active={!primaryActive} />
    <LinkLine x1={560} y1={305} x2={760} y2={230} color="#f59e0b" active={!primaryActive} />
    {s>=4 && <Badge x={260} y={370} text="Failure detection depends on route validity" color="#fb7185" active w={400} />}
  </svg></StepShell>
}

const backupStages = ['المسار الأساسي يعمل ويوجد في routing table.', 'المسار الاحتياطي مُكوّن لكن غير مركّب.', 'عند فقدان primary route، الراوتر يعيد تقييم الجدول.', 'floating static route تدخل كبديل.', 'عند عودة primary، قد يعود حسب حالة المسارات.']
export function PrimaryVsBackupPathDiagram() {
  const p = useStepPlayback(backupStages.length); const s = p.stage
  return <StepShell title="PRIMARY vs BACKUP PATH" playback={p} legend={backupStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Primary and backup path behavior with floating static route">
    <Box x={50} y={170} w={120} h={80} title="R1" sub="" color="#38bdf8" active />
    <Box x={750} y={170} w={120} h={80} title="R2" sub="LAN 2" color="#34d399" active />
    <path d="M170 185 C300 80, 620 80, 750 185" fill="none" stroke={s<2?'#34d399':'#475569'} strokeWidth={s<2?3:1.5} strokeDasharray={s<2?'0':'6 6'} />
    <path d="M170 235 C300 340, 620 340, 750 235" fill="none" stroke={s>=3?'#f59e0b':'#475569'} strokeWidth={s>=3?3:1.5} strokeDasharray={s>=3?'0':'6 6'} />
    <Badge x={390} y={70} text="Primary AD 1" color="#34d399" active={s<2} w={140} />
    <Badge x={390} y={330} text="Floating AD 10" color="#f59e0b" active={s>=3} w={140} />
  </svg></StepShell>
}

const recStages = ['Recursive route تحدد next-hop IP ولكن ليس exit interface.', 'الراوتر يحتاج lookup إضافي لمعرفة كيف يصل للـ next hop.', 'إذا وجد route للـ next hop، يستخدم exit interface من تلك route.', 'إذا لم يستطع حل next hop، المسار لا يصبح usable.', 'Directly connected static route يتجنب هذه الخطوة الإضافية.']
export function RecursiveStaticRouteDiagram() {
  const p = useStepPlayback(recStages.length); const s = p.stage
  return <StepShell title="RECURSIVE STATIC ROUTE" playback={p} legend={recStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Recursive static route requires additional lookup to resolve next hop">
    <Box x={60} y={160} w={150} h={90} title="R1" sub="lookup 1" color="#38bdf8" active />
    <Box x={380} y={160} w={160} h={90} title="Next Hop" sub="10.0.0.2" color="#f59e0b" active={s>=1} />
    <Box x={700} y={160} w={160} h={90} title="Dest Net" sub="192.168.2.0/24" color="#34d399" active={s>=3} />
    <LinkLine x1={210} y1={205} x2={380} y2={205} color="#38bdf8" active={s>=1} />
    <LinkLine x1={540} y1={205} x2={700} y2={205} color="#34d399" active={s>=3} />
    {s>=0 && <Badge x={60} y={90} text="ip route 192.168.2.0/24 10.0.0.2" color="#38bdf8" active w={300} />}
    {s>=2 && <Badge x={330} y={280} text="lookup 2: how to reach 10.0.0.2?" color="#f59e0b" active w={280} />}
  </svg></StepShell>
}

const directStages = ['Directly connected static route تحدد exit interface.', 'مثال: ip route 192.168.2.0 255.255.255.0 GigabitEthernet0/1.', 'الراوتر يعرف منفذ الخروج مباشرة.', 'على multiaccess Ethernet، قد يحتاج ARP لكل وجهة أو يتأثر بسلوك proxy ARP/CEF.', 'على point-to-point، exit interface غالباً أبسط وأوضح.']
export function DirectlyConnectedStaticRouteDiagram() {
  const p = useStepPlayback(directStages.length); const s = p.stage
  return <StepShell title="DIRECTLY CONNECTED STATIC ROUTE" playback={p} legend={directStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Directly connected static route uses exit interface instead of next hop">
    <Box x={80} y={160} w={170} h={100} title="R1" sub="G0/1 exit" color="#38bdf8" active />
    <Box x={450} y={160} w={170} h={100} title="Link" sub="Ethernet/P2P" color="#f59e0b" active={s>=1} />
    <Box x={720} y={160} w={150} h={100} title="Remote LAN" sub="192.168.2.0/24" color="#34d399" active={s>=2} />
    <LinkLine x1={250} y1={210} x2={450} y2={210} color="#38bdf8" active={s>=1} />
    <LinkLine x1={620} y1={210} x2={720} y2={210} color="#34d399" active={s>=2} />
    {s>=1 && <Badge x={250} y={100} text="ip route 192.168.2.0 255.255.255.0 G0/1" color="#f59e0b" active w={360} />}
    {s>=3 && <Badge x={250} y={310} text="Multiaccess caution: ARP/forwarding behavior" color="#fb7185" active w={360} />}
  </svg></StepShell>
}

const nhVsExitStages = ['Next-hop route: يحدد IP الراوتر التالي.', 'Exit-interface route: يحدد منفذ الخروج المحلي.', 'Next-hop مناسب خاصة على multiaccess networks.', 'Exit-interface بسيط على point-to-point links.', 'يمكن الجمع بينهما، لكن افهم آثار ARP وrecursive lookup.']
export function NextHopVsExitInterfaceDiagram() {
  const p = useStepPlayback(nhVsExitStages.length); const s = p.stage
  return <StepShell title="NEXT-HOP vs EXIT INTERFACE" playback={p} legend={nhVsExitStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Comparison between next hop and exit interface static route configuration">
    <Box x={90} y={120} w={320} h={190} title="NEXT-HOP" sub="via 10.0.0.2" color="#38bdf8" active={s===0||s===2||s===4} />
    <Box x={510} y={120} w={320} h={190} title="EXIT INTERFACE" sub="G0/1" color="#f59e0b" active={s===1||s===3||s===4} />
    <SvgText x={250} y={200} color="#cbd5e1" size={9}>ip route ... 10.0.0.2</SvgText>
    <SvgText x={250} y={225} color="#cbd5e1" size={9}>Good for multiaccess</SvgText>
    <SvgText x={670} y={200} color="#cbd5e1" size={9}>ip route ... G0/1</SvgText>
    <SvgText x={670} y={225} color="#cbd5e1" size={9}>Simple on point-to-point</SvgText>
  </svg></StepShell>
}

const ipv4TopStages = ['LAN1: 192.168.1.0/24 خلف R1، LAN2: 192.168.2.0/24 خلف R2.', 'رابط R1-R2: 10.0.0.0/30 (.1 و .2).', 'R1 يحتاج static route إلى 192.168.2.0/24.', 'R2 يحتاج return route إلى 192.168.1.0/24.', 'بدون return route، ping يفشل في الاتجاه العكسي.']
export function Ipv4StaticRoutingTopologyDiagram() {
  const p = useStepPlayback(ipv4TopStages.length); const s = p.stage
  return <StepShell title="IPv4 STATIC ROUTING TOPOLOGY" playback={p} legend={ipv4TopStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="IPv4 static routing topology with two LANs and static routes on both routers">
    <Box x={20} y={170} w={100} h={70} title="PC1" sub=".10" color="#38bdf8" active />
    <Box x={150} y={170} w={100} h={70} title="R1" sub=".1/.1" color="#f59e0b" active />
    <Box x={410} y={170} w={100} h={70} title="R2" sub=".2/.1" color="#f59e0b" active />
    <Box x={670} y={170} w={100} h={70} title="PC2" sub=".10" color="#34d399" active />
    <LinkLine x1={120} y1={205} x2={150} y2={205} color="#38bdf8" active />
    <LinkLine x1={250} y1={205} x2={410} y2={205} color="#94a3b8" active />
    <LinkLine x1={510} y1={205} x2={670} y2={205} color="#34d399" active />
    <Badge x={140} y={120} text="192.168.1.0/24" color="#38bdf8" active w={120} />
    <Badge x={270} y={120} text="10.0.0.0/30" color="#94a3b8" active w={120} />
    <Badge x={530} y={120} text="192.168.2.0/24" color="#34d399" active w={120} />
    {s>=2 && <Badge x={120} y={290} text="R1: ip route 192.168.2.0/24 10.0.0.2" color="#f59e0b" active w={320} />}
    {s>=3 && <Badge x={480} y={290} text="R2: ip route 192.168.1.0/24 10.0.0.1" color="#f59e0b" active w={320} />}
  </svg></StepShell>
}

const ipv6TopStages = ['IPv6 LANs تستخدم prefixes مثل 2001:DB8:1::/64 و 2001:DB8:2::/64.', 'رابط inter-router يمكن أن يكون 2001:DB8:12::/64.', 'يجب تفعيل ipv6 unicast-routing على الراوترات.', 'Static route: ipv6 route 2001:DB8:2::/64 2001:DB8:12::2.', 'التحقق عبر show ipv6 route و ping ipv6.']
export function Ipv6StaticRoutingTopologyDiagram() {
  const p = useStepPlayback(ipv6TopStages.length); const s = p.stage
  return <StepShell title="IPv6 STATIC ROUTING TOPOLOGY" playback={p} legend={ipv6TopStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="IPv6 static routing topology with IPv6 prefixes and static routes">
    <Box x={30} y={170} w={120} h={70} title="LAN 1" sub="2001:DB8:1::/64" color="#38bdf8" active />
    <Box x={200} y={170} w={110} h={70} title="R1" sub="::1" color="#f59e0b" active />
    <Box x={430} y={170} w={110} h={70} title="R2" sub="::2" color="#f59e0b" active />
    <Box x={700} y={170} w={150} h={70} title="LAN 2" sub="2001:DB8:2::/64" color="#34d399" active />
    <LinkLine x1={150} y1={205} x2={200} y2={205} color="#38bdf8" active />
    <LinkLine x1={310} y1={205} x2={430} y2={205} color="#94a3b8" active />
    <LinkLine x1={540} y1={205} x2={700} y2={205} color="#34d399" active />
    {s>=2 && <Badge x={250} y={110} text="ipv6 unicast-routing" color="#a78bfa" active w={180} />}
    {s>=3 && <Badge x={180} y={290} text="ipv6 route 2001:DB8:2::/64 2001:DB8:12::2" color="#f59e0b" active w={360} />}
  </svg></StepShell>
}

const llStages = ['Link-local address تبدأ بـ FE80:: وتكون صالحة على الرابط فقط.', 'عند استخدامها كـ next hop في static route، الراوتر يحتاج معرفة exit interface.', 'بدون exit interface، الراوتر لا يعرف أي رابط يقصد.', 'مثال: ipv6 route 2001:DB8:2::/64 G0/1 FE80::2.', 'هذا سلوك مهم في IPv6 ومصدر شائع للأخطاء.']
export function Ipv6LinkLocalNextHopDiagram() {
  const p = useStepPlayback(llStages.length); const s = p.stage
  return <StepShell title="IPv6 LINK-LOCAL NEXT HOP" playback={p} legend={llStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="IPv6 static route using link-local next hop requires exit interface">
    <Box x={80} y={160} w={160} h={90} title="R1" sub="G0/1" color="#38bdf8" active />
    <Box x={680} y={160} w={160} h={90} title="R2" sub="FE80::2" color="#f59e0b" active={s>=1} />
    <LinkLine x1={240} y1={205} x2={680} y2={205} color="#94a3b8" active />
    {s>=1 && <Badge x={350} y={120} text="Next hop: FE80::2 (link-local)" color="#f59e0b" active w={240} />}
    {s>=3 && <Badge x={210} y={290} text="ipv6 route 2001:DB8:2::/64 G0/1 FE80::2" color="#34d399" active w={500} />}
    {s>=2 && <Badge x={360} y={330} text="Exit interface required" color="#fb7185" active w={200} />}
  </svg></StepShell>
}

const beforeAfterStages = ['قبل الإعداد: routing table تحتوي connected/local فقط.', 'المسؤول يضيف static route للشبكة البعيدة.', 'بعد الإعداد: يظهر رمز S مع الشبكة والـ next hop.', 'يمكن للراوتر الآن اتخاذ قرار forwarding للوجهة البعيدة.', 'غياب return route على الطرف الآخر ما زال قد يسبب فشل ping.']
export function RoutingTableBeforeAfterStaticDiagram() {
  const p = useStepPlayback(beforeAfterStages.length); const s = p.stage
  return <StepShell title="ROUTING TABLE BEFORE/AFTER STATIC" playback={p} legend={beforeAfterStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Routing table before and after adding a static route">
    <Box x={70} y={90} w={340} h={250} title="BEFORE" sub="no remote route" color="#fb7185" active={s<=1} />
    <Box x={510} y={90} w={340} h={250} title="AFTER" sub="static route installed" color="#34d399" active={s>=2} />
    <SvgText x={240} y={170} color="#cbd5e1" size={9}>C 192.168.1.0/24</SvgText>
    <SvgText x={240} y={195} color="#cbd5e1" size={9}>L 192.168.1.1/32</SvgText>
    <SvgText x={240} y={220} color="#94a3b8" size={9}>No route to 192.168.2.0/24</SvgText>
    <SvgText x={680} y={170} color="#cbd5e1" size={9}>C 192.168.1.0/24</SvgText>
    <SvgText x={680} y={195} color="#cbd5e1" size={9}>L 192.168.1.1/32</SvgText>
    {s>=2 && <SvgText x={680} y={225} color="#34d399" size={9} bold>S 192.168.2.0/24 [1/0] via 10.0.0.2</SvgText>}
  </svg></StepShell>
}

const flowStages = ['Packet arrives at router.', 'Router checks destination IP against routing table.', 'A matching static route is selected (considering LPM/AD as needed).', 'Router resolves next hop/exit interface and L2 info.', 'Router forwards packet; return path must also exist.']
export function CompleteStaticRoutingFlowDiagram() {
  const p = useStepPlayback(flowStages.length); const s = p.stage
  const labels = ['Receive Packet','Lookup Route','Select Static Route','Resolve Next Hop','Forward']
  return <StepShell title="COMPLETE STATIC ROUTING FLOW" playback={p} legend={flowStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Complete static routing decision and forwarding flow">
    {labels.map((t,i)=><g key={t} opacity={s>=i?1:0.35}><rect x={330} y={35+i*72} width={260} height={46} rx="10" fill="#0b1224" stroke={s===i?'#34d399':'#475569'} strokeWidth={s===i?2.2:1}/><SvgText x={460} y={63+i*72} color={s===i?'#34d399':'#cbd5e1'} size={9.5} bold>{t}</SvgText></g>)}
    {[0,1,2,3].map(i=><LinkLine key={i} x1={460} y1={81+i*72} x2={460} y2={107+i*72} color="#34d399" active={s>i} />)}
  </svg></StepShell>
}