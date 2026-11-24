import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { RichText } from '../ui/RichText'
import { LinkLine, Packet } from './ArchitectureDiagrams'
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
function Badge({ x, y, text, color = '#38bdf8', active = true, w = 140 }: { x: number; y: number; text: string; color?: string; active?: boolean; w?: number }) {
  return <g opacity={active ? 1 : 0.4}><rect x={x} y={y} width={w} height={24} rx="7" fill="#0a1730" stroke={color} strokeWidth={active ? 1.8 : 1} /><SvgText x={x + w / 2} y={y + 16} color={color} size={8.2} bold>{text}</SvgText></g>
}

const rvfStages = ['Routing يبني/يتعلم المسارات ويملأ Routing Table.', 'Forwarding يستخدم المعلومات الموجودة لإرسال packet فعلياً.', 'Routing = control/process; Forwarding = data plane action.', 'Routing table قد تتغير، لكن كل packet يُتخذ له قرار forwarding.', 'الاثنان مرتبطان لكنهما ليسا نفس الشيء.']
export function RoutingVsForwardingDiagram() {
  const p = useStepPlayback(rvfStages.length); const s = p.stage
  return <StepShell title="ROUTING vs FORWARDING" playback={p} legend={rvfStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Routing builds routes while forwarding moves packets using routing decisions">
    <Box x={80} y={130} w={300} h={170} title="ROUTING" sub="learn/build routes" color="#38bdf8" active={s<=1||s===4} />
    <Box x={540} y={130} w={300} h={170} title="FORWARDING" sub="move packet now" color="#34d399" active={s>=1} />
    <SvgText x={230} y={200} color="#cbd5e1" size={9}>Protocols, static routes, connected</SvgText>
    <SvgText x={230} y={225} color="#cbd5e1" size={9}>Populate routing table</SvgText>
    <SvgText x={690} y={200} color="#cbd5e1" size={9}>Lookup destination IP</SvgText>
    <SvgText x={690} y={225} color="#cbd5e1" size={9}>Send out exit interface</SvgText>
    <LinkLine x1={380} y1={215} x2={540} y2={215} color="#f59e0b" active={s>=1} />
    {s>=1 && <Badge x={420} y={235} text="ROUTING TABLE" color="#f59e0b" active w={120} />}
  </svg></StepShell>
}

const lifecycleStages = ['يستقبل الراوتر Ethernet frame على واجهة.', 'يفحص Destination MAC؛ إذا كان له، يفك التغليف.', 'يفحص Destination IP في IP header.', 'يبحث في routing table ويختار أفضل route.', 'يعيد تغليف L2 ويرسل للـ next hop/exit interface.']
export function PacketForwardingLifecycleDiagram() {
  const p = useStepPlayback(lifecycleStages.length); const s = p.stage
  const steps = ['Receive Frame','Check DMAC','Check Dest IP','Table Lookup','Re-encapsulate & Send']
  return <StepShell title="PACKET FORWARDING LIFECYCLE" playback={p} legend={lifecycleStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Packet forwarding lifecycle from frame receipt to L2 re-encapsulation and forwarding">
    {steps.map((t,i)=><g key={t} opacity={s>=i?1:0.35}><rect x={30+i*175} y={150} width={150} height={90} rx="10" fill="#0b1224" stroke={s===i?'#34d399':'#475569'} strokeWidth={s===i?2.2:1}/><SvgText x={105+i*175} y={188} color={s===i?'#34d399':'#cbd5e1'} size={8.8} bold>{t}</SvgText><SvgText x={105+i*175} y={208} color="#94a3b8" size={8}>{`Step ${i+1}`}</SvgText></g>)}
    {[0,1,2,3].map(i=><LinkLine key={i} x1={180+i*175} y1={195} x2={205+i*175} y2={195} color="#34d399" active={s>i} />)}
  </svg></StepShell>
}

const planeStages = ['Control plane يبني قرارات التوجيه وبنية routing.', 'Data plane ينفذ forwarding لحزم البيانات.', 'Routing table نتيجة control plane/process.', 'Forwarding decision تحدث لكل packet في data plane.', 'مشكلة control plane قد تؤثر لاحقاً على forwarding.']
export function ControlPlaneVsDataPlaneDiagram() {
  const p = useStepPlayback(planeStages.length); const s = p.stage
  return <StepShell title="CONTROL PLANE vs DATA PLANE" playback={p} legend={planeStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Control plane builds routing information and data plane forwards packets">
    <Box x={90} y={110} w={320} h={200} title="CONTROL PLANE" sub="routing intelligence" color="#38bdf8" active={s===0||s===2||s===4} />
    <Box x={510} y={110} w={320} h={200} title="DATA PLANE" sub="packet forwarding" color="#34d399" active={s===1||s===3||s===4} />
    <SvgText x={250} y={190} color="#cbd5e1" size={9}>OSPF/RIP/EIGRP/Static</SvgText>
    <SvgText x={250} y={215} color="#cbd5e1" size={9}>Builds routing table</SvgText>
    <SvgText x={670} y={190} color="#cbd5e1" size={9}>Lookup & forward packets</SvgText>
    <SvgText x={670} y={215} color="#cbd5e1" size={9}>Uses best route</SvgText>
    <LinkLine x1={410} y1={210} x2={510} y2={210} color="#f59e0b" active={s>=2} />
    {s>=2 && <Badge x={420} y={225} text="ROUTES" color="#f59e0b" active w={80} />}
  </svg></StepShell>
}

const hopStages = ['PC1 يرسل packet إلى default gateway R1.', 'R1 يختار next hop R2 ويعيد تغليف L2.', 'R2 يختار next hop R3 ويعيد تغليف L2.', 'R3 يرسل للشبكة المتصلة مباشرة بالخادم.', 'Destination IP يبقى كما هو؛ MAC يتغير عند كل hop.']
export function RouterHopByHopForwardingDiagram() {
  const p = useStepPlayback(hopStages.length); const s = p.stage
  return <StepShell title="ROUTER HOP-BY-HOP FORWARDING" playback={p} legend={hopStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Hop by hop forwarding through multiple routers while destination IP stays same">
    <Box x={20} y={170} w={110} h={80} title="PC1" sub="src" color="#38bdf8" active={s>=0} />
    <Box x={190} y={170} w={110} h={80} title="R1" sub="hop 1" color="#f59e0b" active={s>=0} />
    <Box x={360} y={170} w={110} h={80} title="R2" sub="hop 2" color="#f59e0b" active={s>=1} />
    <Box x={530} y={170} w={110} h={80} title="R3" sub="hop 3" color="#f59e0b" active={s>=2} />
    <Box x={720} y={170} w={140} h={80} title="Server" sub="dst" color="#34d399" active={s>=3} />
    <LinkLine x1={130} y1={210} x2={190} y2={210} color="#38bdf8" active={s>=0} />
    <LinkLine x1={300} y1={210} x2={360} y2={210} color="#38bdf8" active={s>=1} />
    <LinkLine x1={470} y1={210} x2={530} y2={210} color="#38bdf8" active={s>=2} />
    <LinkLine x1={640} y1={210} x2={720} y2={210} color="#34d399" active={s>=3} />
    {s>=4 && <Badge x={300} y={110} text="DEST IP SAME / L2 MAC CHANGES" color="#a78bfa" active w={320} />}
  </svg></StepShell>
}

const l2Stages = ['الراوتر يستقبل frame موجه إلى MAC الواجهة.', 'يزيل L2 header القديم بعد قبول الـ frame.', 'يتخذ قرار forwarding بناءً على destination IP.', 'يبني L2 header جديد مناسب للواجهة الخارجة.', 'يرسل frame جديد إلى next hop أو الوجهة المتصلة مباشرة.']
export function Layer2ReencapsulationDiagram() {
  const p = useStepPlayback(l2Stages.length); const s = p.stage
  return <StepShell title="LAYER 2 RE-ENCAPSULATION" playback={p} legend={l2Stages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Router removes old layer 2 header and creates a new one for next hop">
    <Badge x={80} y={160} text="Old L2 Header" color="#fb7185" active={s<=1} w={150} />
    <Badge x={250} y={160} text="IP Packet" color="#38bdf8" active w={150} />
    <Badge x={420} y={160} text="Payload" color="#94a3b8" active w={120} />
    <SvgText x={620} y={175} color="#f59e0b" size={12} bold>{s>=3 ? '→' : '...'}</SvgText>
    {s>=3 && <Badge x={660} y={160} text="New L2 Header" color="#34d399" active w={150} />}
    {s>=3 && <Badge x={660} y={200} text="Same IP Packet" color="#38bdf8" active w={150} />}
    {s>=4 && <Badge x={350} y={300} text="DEST IP UNCHANGED (usually)" color="#a78bfa" active w={220} />}
  </svg></StepShell>
}

const arpStages = ['الراوتر يحدد next hop IP من routing table.', 'يتحقق هل يعرف MAC address للـ next hop في ARP cache.', 'إذا لم يعرف، يرسل ARP Request في الشبكة المحلية.', 'Next hop يرد بـ ARP Reply يحتوي MAC address.', 'الراوتر يبني Ethernet frame ويعيد الإرسال.']
export function ArpNextHopResolutionDiagram() {
  const p = useStepPlayback(arpStages.length); const s = p.stage
  return <StepShell title="ARP NEXT-HOP RESOLUTION" playback={p} legend={arpStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Router uses ARP to resolve next hop MAC address before forwarding IPv4 packet">
    <Box x={100} y={160} w={180} h={100} title="R1" sub="needs next-hop MAC" color="#38bdf8" active />
    <Box x={640} y={160} w={180} h={100} title="R2 / Next Hop" sub="192.168.1.2" color="#34d399" active={s>=3} />
    <LinkLine x1={280} y1={210} x2={640} y2={210} color="#f59e0b" active={s>=2} />
    {s>=2 && <Badge x={360} y={140} text="ARP REQUEST (broadcast)" color="#f59e0b" active w={200} />}
    {s>=3 && <Badge x={360} y={250} text="ARP REPLY (unicast MAC)" color="#34d399" active w={200} />}
    {s>=4 && <Packet point={{x:460,y:205}} color="#38bdf8" label="FRAME" />}
  </svg></StepShell>
}

const lpmStages = ['الراوتر يقارن destination IP بكل routes المطابقة.', 'ليس المهم أول match، بل أكثر match تحديداً.', 'Prefix أطول = جزء شبكة أكبر مطابق = أكثر تحديداً.', '/25 أطول من /24، و/24 أطول من /16.', 'Longest Prefix Match يفوز قبل AD/Metric عند اختلاف prefix lengths.']
export function LongestPrefixMatchConceptDiagram() {
  const p = useStepPlayback(lpmStages.length); const s = p.stage
  return <StepShell title="LONGEST PREFIX MATCH CONCEPT" playback={p} legend={lpmStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Longest prefix match selects the most specific matching route">
    <Badge x={340} y={80} text="Destination: 192.168.1.130" color="#38bdf8" active w={240} />
    <Badge x={280} y={150} text="192.168.0.0/16  (matches)" color="#94a3b8" active={s>=1} w={360} />
    <Badge x={280} y={200} text="192.168.1.0/24  (better match)" color="#f59e0b" active={s>=2} w={360} />
    <Badge x={280} y={250} text="192.168.1.128/25 (longest match - WIN)" color="#34d399" active={s>=3} w={360} />
    <Badge x={280} y={300} text="0.0.0.0/0 default (matches, least specific)" color="#64748b" active={s>=1} w={360} />
  </svg></StepShell>
}

const binaryStages = ['حوّل destination IP إلى binary للمقارنة.', '192.168.1.130 = 11000000.10101000.00000001.10000010', '/24 يطابق أول 24 بت: 192.168.1.0-255.', '/25 يطابق أول 25 بت: 192.168.1.128-255.', '130 يقع ضمن /25، لذا /25 هو الأطول المطابق.']
export function BinaryPrefixMatchingDiagram() {
  const p = useStepPlayback(binaryStages.length); const s = p.stage
  return <StepShell title="BINARY PREFIX MATCHING" playback={p} legend={binaryStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Binary comparison showing why /25 is longer match than /24 for 192.168.1.130">
    <SvgText x={460} y={70} color="#38bdf8" size={10} bold>192.168.1.130 = 11000000.10101000.00000001.10000010</SvgText>
    <Badge x={120} y={120} text="/24 match: first 24 bits match" color="#f59e0b" active={s>=2} w={680} />
    <Badge x={120} y={170} text="/25 match: first 25 bits match" color="#34d399" active={s>=3} w={680} />
    <SvgText x={460} y={240} color="#cbd5e1" size={9}>/24 range: 192.168.1.0 - 192.168.1.255</SvgText>
    <SvgText x={460} y={265} color="#cbd5e1" size={9}>/25 range: 192.168.1.128 - 192.168.1.255</SvgText>
    {s>=4 && <Badge x={300} y={320} text="130 is inside /25 => /25 wins" color="#34d399" active w={320} />}
  </svg></StepShell>
}

const multiStages = ['كل routes قد "تطابق" جزئياً حسب prefix.', 'Default /0 يطابق كل شيء لكنه الأقل تحديداً.', '/8 و/16 و/24 و/25 تزيد التحديد.', 'الراوتر يختار الأطول بين المطابقين فقط.', 'LPM لا يستخدم AD هنا لأن المقارنة بين أطوال prefix مختلفة.']
export function MultiplePrefixComparisonDiagram() {
  const p = useStepPlayback(multiStages.length); const s = p.stage
  const rows = [['0.0.0.0/0','Default','Least specific'],['10.0.0.0/8','/8','Broad'],['192.168.0.0/16','/16','More specific'],['192.168.1.0/24','/24','Specific'],['192.168.1.128/25','/25','Most specific winner']]
  return <StepShell title="MULTIPLE PREFIX COMPARISON" playback={p} legend={multiStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Comparison of multiple matching prefixes from /0 to /25">
    {rows.map((r,i)=><g key={r[0]} opacity={s>=i?1:0.35}><rect x={120} y={65+i*62} width={680} height={46} rx="10" fill="#0b1224" stroke={i===4 && s>=4?'#34d399':'#475569'} strokeWidth={i===4&&s>=4?2.2:1}/><SvgText x={170} y={93+i*62} color="#38bdf8" size={9.5} anchor="start">{r[0]}</SvgText><SvgText x={450} y={93+i*62} color="#e2e8f0" size={9.5}>{r[1]}</SvgText><SvgText x={700} y={93+i*62} color={i===4?'#34d399':'#94a3b8'} size={9}>{r[2]}</SvgText></g>)}
  </svg></StepShell>
}

const adSelStages = ['نفس destination prefix تماماً: 10.10.10.0/24.', 'مصدر واحد: OSPF [110/20].', 'مصدر آخر: Static [1/0] أو RIP [120/2] حسب المثال.', 'عند تساوي prefix length، الراوتر يقارن AD.', 'الأقل AD يُركّب في routing table.']
export function AdRouteSourceComparisonDiagram() {
  const p = useStepPlayback(adSelStages.length); const s = p.stage
  return <StepShell title="ADMINISTRATIVE DISTANCE COMPARISON" playback={p} legend={adSelStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Administrative distance chooses best route source when prefix length is same">
    <Badge x={320} y={70} text="Same Prefix: 10.10.10.0/24" color="#38bdf8" active w={280} />
    <Box x={120} y={150} w={280} h={110} title="OSPF Route" sub="[110/20]" color={s>=4?'#94a3b8':'#f59e0b'} active={s>=1} />
    <Box x={520} y={150} w={280} h={110} title="Static Route" sub="[1/0]" color={s>=4?'#34d399':'#38bdf8'} active={s>=2} />
    {s>=3 && <Badge x={360} y={290} text="SAME PREFIX => COMPARE AD" color="#a78bfa" active w={220} />}
    {s>=4 && <Badge x={360} y={330} text="STATIC AD 1 WINS" color="#34d399" active w={220} />}
  </svg></StepShell>
}

const metricSelStages = ['نفس prefix ونفس routing protocol.', 'المسار A له metric أقل.', 'المسار B له metric أعلى.', 'البروتوكول يختار المسار الأقل metric.', 'طريقة حساب metric تختلف: OSPF cost, RIP hop count.']
export function RoutingProtocolMetricsComparisonDiagram() {
  const p = useStepPlayback(metricSelStages.length); const s = p.stage
  return <StepShell title="ROUTING PROTOCOL METRICS" playback={p} legend={metricSelStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Same protocol routes compared by metric such as OSPF cost or RIP hop count">
    <Badge x={300} y={60} text="Same Prefix, Same Protocol (OSPF)" color="#38bdf8" active w={320} />
    <Box x={140} y={150} w={260} h={100} title="Path A" sub="OSPF cost 20" color={s>=3?'#34d399':'#f59e0b'} active={s>=1} />
    <Box x={520} y={150} w={260} h={100} title="Path B" sub="OSPF cost 50" color="#94a3b8" active={s>=2} />
    {s>=4 && <Badge x={290} y={310} text="RIP uses hop count; OSPF uses cost" color="#a78bfa" active w={340} />}
  </svg></StepShell>
}

const adMetricDecisionStages = ['أولاً: هل prefix lengths مختلفة؟ استخدم LPM.', 'إذا نفس prefix: هل المصادر مختلفة؟ استخدم AD.', 'إذا نفس المصدر/protocol: استخدم Metric.', 'لا تقارن Metric قبل حل LPM/AD.', 'النتيجة: Route واحد أفضل يُركّب للاستخدام.']
export function AdMetricDecisionProcessDiagram() {
  const p = useStepPlayback(adMetricDecisionStages.length); const s = p.stage
  return <StepShell title="AD vs METRIC DECISION" playback={p} legend={adMetricDecisionStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Decision order between longest prefix match administrative distance and metric">
    <Badge x={330} y={70} text="1. Longest Prefix Match" color="#34d399" active={s>=0} w={260} />
    <Badge x={330} y={140} text="2. Administrative Distance" color="#38bdf8" active={s>=1} w={260} />
    <Badge x={330} y={210} text="3. Routing Protocol Metric" color="#f59e0b" active={s>=2} w={260} />
    <Badge x={330} y={290} text="Best Route Installed" color="#a78bfa" active={s>=4} w={260} />
    <LinkLine x1={460} y1={94} x2={460} y2={140} color="#94a3b8" active={s>=1} />
    <LinkLine x1={460} y1={164} x2={460} y2={210} color="#94a3b8" active={s>=2} />
    <LinkLine x1={460} y1={234} x2={460} y2={290} color="#94a3b8" active={s>=4} />
  </svg></StepShell>
}

const flowStages = ['Packet arrives: check destination IP.', 'Find matching prefixes in routing table.', 'Select longest prefix match.', 'If tie on prefix and different source, compare AD.', 'If same protocol, compare metric; then forward.']
export function BestRouteSelectionFlowchartDiagram() {
  const p = useStepPlayback(flowStages.length); const s = p.stage
  const labels = ['Dest IP','Match Prefixes','Longest Prefix','Compare AD','Compare Metric/Forward']
  return <StepShell title="BEST ROUTE SELECTION FLOWCHART" playback={p} legend={flowStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Flowchart for best route selection using longest prefix match AD and metric">
    {labels.map((t,i)=><g key={t} opacity={s>=i?1:0.35}><rect x={340} y={40+i*70} width={240} height={45} rx="10" fill="#0b1224" stroke={s===i?'#34d399':'#475569'} strokeWidth={s===i?2.2:1}/><SvgText x={460} y={67+i*70} color={s===i?'#34d399':'#cbd5e1'} size={9.2} bold>{t}</SvgText></g>)}
    {[0,1,2,3].map(i=><LinkLine key={i} x1={460} y1={85+i*70} x2={460} y2={110+i*70} color="#34d399" active={s>i} />)}
  </svg></StepShell>
}

const defaultStages = ['لا يوجد route محدد يطابق الوجهة.', 'الراوتر يبحث عن default route 0.0.0.0/0.', 'إذا وجدت، تُستخدم كـ Gateway of Last Resort.', 'إذا لم توجد، يتم إسقاط الـ packet.', 'Default route أقل تحديداً لكنها شبكة أمان.']
export function DefaultRouteGatewayLastResortDiagram() {
  const p = useStepPlayback(defaultStages.length); const s = p.stage
  return <StepShell title="DEFAULT ROUTE / GATEWAY OF LAST RESORT" playback={p} legend={defaultStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Default route used as gateway of last resort when no specific route matches">
    <Box x={70} y={170} w={160} h={90} title="R1" sub="unknown dest" color="#38bdf8" active />
    <Box x={380} y={170} w={170} h={90} title="Gateway" sub="0.0.0.0/0" color="#f59e0b" active={s>=2} />
    <Box x={700} y={170} w={150} h={90} title="External" sub="Internet/other" color="#94a3b8" active={s>=2} />
    <LinkLine x1={230} y1={215} x2={380} y2={215} color="#f59e0b" active={s>=1} />
    <LinkLine x1={550} y1={215} x2={700} y2={215} color="#f59e0b" active={s>=2} />
    {s>=3 && <Badge x={330} y={300} text={s===3 ? 'NO DEFAULT => DROP' : 'DEFAULT USED'} color={s===3?'#fb7185':'#34d399'} active w={260} />}
  </svg></StepShell>
}

const completeStages = ['يصل packet إلى R1 بوجهة 192.168.1.130.', 'R1 يجد عدة prefixes مطابقة.', 'يختار /25 لأنّه Longest Prefix Match.', 'يحدد next hop/exit interface ويعيد تغليف L2.', 'يرسل packet نحو الوجهة النهائية hop by hop.']
export function CompleteRoutingDecisionScenarioDiagram() {
  const p = useStepPlayback(completeStages.length); const s = p.stage
  return <StepShell title="COMPLETE ROUTING DECISION SCENARIO" playback={p} legend={completeStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Complete routing decision scenario selecting best route by longest prefix match and forwarding packet">
    <Box x={40} y={170} w={120} h={80} title="PC1" sub="send pkt" color="#38bdf8" active={s>=0} />
    <Box x={230} y={150} w={180} h={120} title="R1" sub="decision point" color="#f59e0b" active={s>=1} />
    <Box x={500} y={90} w={150} h={70} title="/16" sub="match" color="#94a3b8" active={s>=1} />
    <Box x={500} y={180} w={150} h={70} title="/24" sub="better" color="#f59e0b" active={s>=1} />
    <Box x={500} y={270} w={150} h={70} title="/25" sub="best" color={s>=2?'#34d399':'#64748b'} active={s>=2} />
    <Box x={730} y={270} w={140} h={70} title="Next Hop" sub="forward" color="#34d399" active={s>=3} />
    <LinkLine x1={160} y1={210} x2={230} y2={210} color="#38bdf8" active={s>=0} />
    <LinkLine x1={410} y1={210} x2={500} y2={305} color="#34d399" active={s>=2} />
    <LinkLine x1={650} y1={305} x2={730} y2={305} color="#34d399" active={s>=3} />
    {s>=0 && <Badge x={55} y={110} text="Dst 192.168.1.130" color="#38bdf8" active w={150} />}
  </svg></StepShell>
}