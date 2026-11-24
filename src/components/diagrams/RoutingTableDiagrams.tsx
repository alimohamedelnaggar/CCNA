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
function Device({ x, y, w, h, title, sub, color, active = false }: { x: number; y: number; w: number; h: number; title: string; sub: string; color: string; active?: boolean }) {
  return <g opacity={active ? 1 : 0.45}><rect x={x} y={y} width={w} height={h} rx="11" fill="#0b1224" stroke={color} strokeWidth={active ? 2.3 : 1.2} /><SvgText x={x + w / 2} y={y + 24} color={color} size={10.5} bold>{title}</SvgText><SvgText x={x + w / 2} y={y + 43} color="#cbd5e1" size={8.8}>{sub}</SvgText></g>
}
function Badge({ x, y, text, color = '#38bdf8', active = true, w = 140 }: { x: number; y: number; text: string; color?: string; active?: boolean; w?: number }) {
  return <g opacity={active ? 1 : 0.4}><rect x={x} y={y} width={w} height={25} rx="7" fill="#0a1730" stroke={color} strokeWidth={active ? 1.9 : 1} /><SvgText x={x + w / 2} y={y + 17} color={color} size={8.5} bold>{text}</SvgText></g>
}
function Row({ x, y, w, code, prefix, adMetric, nextHop, iface, color, active }: { x: number; y: number; w: number; code: string; prefix: string; adMetric: string; nextHop: string; iface: string; color: string; active: boolean }) {
  return <g opacity={active ? 1 : 0.35}><rect x={x} y={y} width={w} height={28} rx="6" fill="#0b1224" stroke={color} strokeWidth={active ? 1.8 : 1} /><SvgText x={x + 18} y={y + 18} color={color} size={8.8} bold>{code}</SvgText><SvgText x={x + 95} y={y + 18} color="#e2e8f0" size={8.5}>{prefix}</SvgText><SvgText x={x + 240} y={y + 18} color="#f59e0b" size={8.3}>{adMetric}</SvgText><SvgText x={x + 340} y={y + 18} color="#38bdf8" size={8.3}>{nextHop}</SvgText><SvgText x={x + 470} y={y + 18} color="#34d399" size={8.3}>{iface}</SvgText></g>
}

const conceptStages = [
  'الراوتر يستقبل Packet ويحتاج قرار forwarding.',
  'يفحص Destination IP ويبحث في Routing Table.',
  'يختار أفضل route مطابق (longest prefix match لاحقاً).',
  'يرسل الـ packet عبر next hop أو exit interface.',
  'بدون route مناسب قد يُسقط packet أو يستخدم default route.',
]
export function RoutingTableConceptDiagram() {
  const p = useStepPlayback(conceptStages.length); const s = p.stage
  return <StepShell title="ROUTER ROUTING TABLE CONCEPT" playback={p} legend={conceptStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Router using routing table to forward packets to destination networks">
    <Device x={40} y={160} w={130} h={90} title="PC" sub="192.168.1.10" color="#38bdf8" active={s>=0} />
    <Device x={360} y={130} w={180} h={150} title="ROUTER R1" sub="Routing Table" color="#f59e0b" active={s>=1} />
    <Device x={740} y={80} w={140} h={80} title="LAN A" sub="10.10.10.0/24" color="#34d399" active={s>=3} />
    <Device x={740} y={260} w={140} h={80} title="LAN B" sub="172.16.1.0/24" color="#a78bfa" active={s>=3} />
    <LinkLine x1={170} y1={205} x2={360} y2={205} color="#38bdf8" active={s>=0} />
    <LinkLine x1={540} y1={175} x2={740} y2={120} color="#34d399" active={s>=3} />
    <LinkLine x1={540} y1={235} x2={740} y2={300} color="#a78bfa" active={s>=2} />
    {s>=0 && <Packet point={{x:260,y:200}} color="#38bdf8" label="PKT" />}
    {s>=3 && <Packet point={{x:640,y:145}} color="#34d399" label="OUT" />}
    <Badge x={385} y={300} text="LOOKUP DESTINATION" color="#f59e0b" active={s>=1} w={150} />
  </svg></StepShell>
}

const anatomyStages = [
  'Route code يوضح مصدر الـ route مثل C, L, S, O.',
  'Prefix/network mask يحدد شبكة الوجهة.',
  '[AD/Metric] يظهر للـ routes المتعلمة/المُهيأة بحسب النوع.',
  'Next hop هو عنوان الراوتر التالي.',
  'Exit interface هو منفذ الخروج من الراوتر المحلي.',
]
export function RoutingTableEntryAnatomyDiagram() {
  const p = useStepPlayback(anatomyStages.length); const s = p.stage
  return <StepShell title="ROUTING TABLE ENTRY ANATOMY" playback={p} legend={anatomyStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Anatomy of a routing table entry showing code prefix AD metric next hop and exit interface">
    <rect x={50} y={120} width={820} height={70} rx="12" fill="#0b1224" stroke="#334155" />
    <SvgText x={70} y={160} color="#e2e8f0" size={11} anchor="start">O    172.16.1.0/24 [110/20] via 192.168.1.3, 00:10:22, GigabitEthernet0/1</SvgText>
    <Badge x={55} y={220} text="Code" color="#34d399" active={s===0} w={70} />
    <Badge x={140} y={220} text="Prefix/Mask" color="#38bdf8" active={s===1} w={120} />
    <Badge x={290} y={220} text="[AD/Metric]" color="#f59e0b" active={s===2} w={120} />
    <Badge x={440} y={220} text="Next Hop" color="#a78bfa" active={s===3} w={110} />
    <Badge x={700} y={220} text="Exit Interface" color="#fb7185" active={s===4} w={140} />
    <LinkLine x1={90} y1={190} x2={90} y2={220} color="#34d399" active={s===0} />
    <LinkLine x1={200} y1={190} x2={200} y2={220} color="#38bdf8" active={s===1} />
    <LinkLine x1={350} y1={190} x2={350} y2={220} color="#f59e0b" active={s===2} />
    <LinkLine x1={495} y1={190} x2={495} y2={220} color="#a78bfa" active={s===3} />
    <LinkLine x1={770} y1={190} x2={770} y2={220} color="#fb7185" active={s===4} />
  </svg></StepShell>
}

const connectedStages = [
  'تضبط IP address وmask على interface.',
  'تجعل الـ interface UP/UP باستخدام no shutdown.',
  'الراوتر يضيف Connected route للشبكة مباشرة.',
  'Connected route لا تحتاج next hop؛ الشبكة directly connected.',
  'إذا سقطت interface تختفي connected route من الجدول.',
]
export function ConnectedRouteDiagram() {
  const p = useStepPlayback(connectedStages.length); const s = p.stage
  return <StepShell title="CONNECTED ROUTE" playback={p} legend={connectedStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Connected route created when interface has IP address and is up">
    <Device x={120} y={160} w={170} h={100} title="R1 G0/0" sub="192.168.1.1/24" color="#34d399" active={s>=0} />
    <Device x={620} y={160} w={170} h={100} title="LAN" sub="192.168.1.0/24" color="#38bdf8" active={s>=2} />
    <LinkLine x1={290} y1={210} x2={620} y2={210} color={s>=1 ? '#34d399' : '#475569'} active={s>=1} />
    <Badge x={360} y={250} text={s>=1 ? 'UP / UP' : 'DOWN'} color={s>=1 ? '#34d399' : '#fb7185'} active w={200} />
    {s>=2 && <Badge x={300} y={110} text="C 192.168.1.0/24 is directly connected, G0/0" color="#34d399" active w={420} />}
  </svg></StepShell>
}

const localStages = [
  'Local route تمثل IP address الخاص بالراوتر نفسه.',
  'في IPv4 تكون عادة /32.',
  'تظهر مع Connected route للشبكة.',
  'الـ packets الموجهة لهذا IP تُعالج محلياً بواسطة الراوتر.',
  'Local ليست شبكة بعيدة؛ إنها عنوان الواجهة نفسه.',
]
export function LocalRouteDiagram() {
  const p = useStepPlayback(localStages.length); const s = p.stage
  return <StepShell title="LOCAL ROUTE" playback={p} legend={localStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Local route representing router interface IP address as /32">
    <Device x={360} y={150} w={200} h={120} title="ROUTER R1" sub="G0/0: 192.168.1.1/24" color="#f59e0b" active />
    <Badge x={250} y={90} text="C 192.168.1.0/24 directly connected" color="#38bdf8" active={s>=2} w={420} />
    <Badge x={250} y={320} text="L 192.168.1.1/32 directly connected" color="#34d399" active={s>=0} w={420} />
    {s>=3 && <Packet point={{x:460,y:140}} color="#34d399" label="TO ME" />}
  </svg></StepShell>
}

const staticStages = [
  'المسؤول يضيف static route يدوياً.',
  'الأمر يحدد network/prefix وnext-hop أو exit interface.',
  'الراوتر يضعها في الجدول برمز S وAD افتراضي عادة 1.',
  'Static route لا تتغير تلقائياً عند تغير topology.',
  'إذا كان next hop غير قابل للوصول قد لا تُثبت route كما تتوقع.',
]
export function StaticRouteDiagram() {
  const p = useStepPlayback(staticStages.length); const s = p.stage
  return <StepShell title="STATIC ROUTE" playback={p} legend={staticStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Static route manually configured with next hop">
    <Device x={50} y={170} w={130} h={90} title="R1" sub="admin config" color="#38bdf8" active />
    <Device x={390} y={170} w={130} h={90} title="R2" sub="next hop" color="#f59e0b" active={s>=2} />
    <Device x={720} y={170} w={150} h={90} title="10.10.10.0/24" sub="remote LAN" color="#34d399" active={s>=2} />
    <LinkLine x1={180} y1={215} x2={390} y2={215} color="#38bdf8" active={s>=1} />
    <LinkLine x1={520} y1={215} x2={720} y2={215} color="#34d399" active={s>=2} />
    <Badge x={170} y={100} text="ip route 10.10.10.0 255.255.255.0 192.168.1.2" color="#f59e0b" active={s>=1} w={580} />
    {s>=2 && <Badge x={250} y={300} text="S 10.10.10.0/24 [1/0] via 192.168.1.2" color="#34d399" active w={420} />}
  </svg></StepShell>
}

const dynamicStages = [
  'Routing protocol يتبادل معلومات الشبكات بين الراوترات.',
  'الراوتر يتعلم routes ديناميكياً بدون كتابة ip route لكل شبكة.',
  'كل protocol له code وAD افتراضي وطريقة metric مختلفة.',
  'OSPF يستخدم cost، RIP يستخدم hop count كمثال مبسط.',
  'Dynamic routes تتكيف مع تغييرات topology أسرع من static.',
]
export function DynamicRouteDiagram() {
  const p = useStepPlayback(dynamicStages.length); const s = p.stage
  return <StepShell title="DYNAMIC ROUTE" playback={p} legend={dynamicStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Dynamic routing protocols learning routes automatically">
    <Device x={70} y={160} w={140} h={100} title="R1" sub="OSPF/RIP/EIGRP" color="#38bdf8" active />
    <Device x={390} y={160} w={140} h={100} title="R2" sub="routing updates" color="#f59e0b" active={s>=0} />
    <Device x={710} y={160} w={140} h={100} title="R3" sub="remote networks" color="#34d399" active={s>=1} />
    <LinkLine x1={210} y1={210} x2={390} y2={210} color="#a78bfa" active={s>=0} />
    <LinkLine x1={530} y1={210} x2={710} y2={210} color="#a78bfa" active={s>=0} />
    {s>=1 && <Packet point={{x:300,y:205}} color="#a78bfa" label="UPDATE" />}
    {s>=2 && <Badge x={260} y={300} text="O 172.16.1.0/24 [110/20] via 192.168.1.3" color="#34d399" active w={400} />}
  </svg></StepShell>
}

const codeStages = [
  'C تعني Connected network.',
  'L تعني Local interface address (/32 في IPv4).',
  'S تعني Static route يضيفها المسؤول.',
  'O تعني OSPF، D EIGRP، R RIP، وغيرها حسب البروتوكول.',
  'الكود يساعدك تعرف مصدر route بسرعة أثناء troubleshooting.',
]
export function RouteCodesDiagram() {
  const p = useStepPlayback(codeStages.length); const s = p.stage
  const rows: [string,string,string,boolean][] = [['C','Connected','Directly connected network',s>=0],['L','Local','Router interface IP (/32)',s>=1],['S','Static','Manually configured',s>=2],['O','OSPF','Dynamic protocol route',s>=3],['D/R','EIGRP/RIP','Other dynamic codes',s>=4]]
  return <StepShell title="ROUTE CODES" playback={p} legend={codeStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Common routing table codes such as C L S O D R">
    {rows.map((r,i)=><g key={r[0]} opacity={r[3]?1:0.35}><rect x={120} y={70+i*58} width={680} height={44} rx="10" fill="#0b1224" stroke={r[3]?'#38bdf8':'#475569'} /><SvgText x={160} y={97+i*58} color="#34d399" size={11} bold>{r[0]}</SvgText><SvgText x={280} y={97+i*58} color="#e2e8f0" size={10}>{r[1]}</SvgText><SvgText x={620} y={97+i*58} color="#94a3b8" size={9}>{r[2]}</SvgText></g>)}
  </svg></StepShell>
}

const prefixStages = [
  'Destination prefix يحدد شبكة الوجهة.',
  'Subnet mask أو /prefix length يحدد حجم الشبكة.',
  '/24 يعني 255.255.255.0 كمثال.',
  '/32 في Local route يعني عنوان host واحد فقط.',
  'Prefix أطول يطابق نطاقاً أدق (longest prefix match - تفصيله في 3.2).',
]
export function PrefixAndNetworkMaskDiagram() {
  const p = useStepPlayback(prefixStages.length); const s = p.stage
  return <StepShell title="PREFIX AND NETWORK MASK" playback={p} legend={prefixStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Prefix length and subnet mask determining destination network range">
    <Badge x={220} y={120} text="192.168.1.0/24" color="#38bdf8" active={s>=0} w={220} />
    <Badge x={480} y={120} text="255.255.255.0" color="#34d399" active={s>=2} w={220} />
    <Badge x={350} y={210} text="/32 = single host (Local)" color="#f59e0b" active={s>=3} w={220} />
    <Badge x={290} y={300} text="Longer prefix = more specific match" color="#a78bfa" active={s>=4} w={340} />
  </svg></StepShell>
}

const nextHopStages = [
  'Next hop هو IP address للراوتر التالي على الطريق.',
  'يظهر في routes البعيدة مثل static/dynamic.',
  'الراوتر يحتاج معرفة كيف يصل للـ next hop نفسه.',
  'Next hop خاطئ أو غير قابل للوصول يسبب فشل forwarding.',
  'Connected routes قد لا تحتاج next hop لأنها directly connected.',
]
export function NextHopDiagram() {
  const p = useStepPlayback(nextHopStages.length); const s = p.stage
  return <StepShell title="NEXT HOP" playback={p} legend={nextHopStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Next hop IP address used to reach remote destination network">
    <Device x={60} y={170} w={140} h={90} title="R1" sub="source router" color="#38bdf8" active />
    <Device x={360} y={170} w={160} h={90} title="R2" sub="192.168.1.2" color="#f59e0b" active={s>=0} />
    <Device x={680} y={170} w={160} h={90} title="Remote LAN" sub="10.10.10.0/24" color="#34d399" active={s>=1} />
    <LinkLine x1={200} y1={215} x2={360} y2={215} color="#38bdf8" active /><LinkLine x1={520} y1={215} x2={680} y2={215} color="#34d399" active={s>=1} />
    {s>=0 && <Badge x={250} y={120} text="via 192.168.1.2" color="#f59e0b" active w={180} />}
    {s>=3 && <Badge x={250} y={300} text="WRONG/UNREACHABLE NEXT HOP = FAIL" color="#fb7185" active w={320} />}
  </svg></StepShell>
}

const exitStages = [
  'Exit interface هو المنفذ الذي يخرج منه الـ packet محلياً.',
  'بعض routes تعرض exit interface مثل directly connected.',
  'Static route يمكن أن تستخدم next-hop أو exit-interface أو كليهما.',
  'اختيار exit interface الصحيح مهم للتوجيه.',
  'في troubleshooting افحص interface state باستخدام show ip interface brief.',
]
export function ExitInterfaceDiagram() {
  const p = useStepPlayback(exitStages.length); const s = p.stage
  return <StepShell title="EXIT INTERFACE" playback={p} legend={exitStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Exit interface used by router to forward packet out of local interface">
    <Device x={300} y={140} w={220} h={140} title="ROUTER R1" sub="forwarding decision" color="#f59e0b" active />
    <Badge x={345} y={235} text="G0/0" color="#38bdf8" active={s>=1} w={60} />
    <Badge x={420} y={235} text="G0/1" color="#34d399" active={s>=1} w={60} />
    <LinkLine x1={375} y1={280} x2={250} y2={340} color="#38bdf8" active={s>=1} />
    <LinkLine x1={450} y1={280} x2={580} y2={340} color="#34d399" active={s>=2} />
    <Device x={140} y={340} w={140} h={60} title="LAN A" sub="" color="#38bdf8" active={s>=1} />
    <Device x={520} y={340} w={140} h={60} title="LAN B" sub="" color="#34d399" active={s>=2} />
    {s>=3 && <Badge x={320} y={90} text="show ip interface brief" color="#a78bfa" active w={200} />}
  </svg></StepShell>
}

const adStages = [
  'AD يقيس ثقة الراوتر في مصدر route.',
  'عند اختلاف مصدر route لنفس destination prefix، الأقل AD يفوز.',
  'Connected 0، Static 1، EIGRP internal 90، OSPF 110، RIP 120 (افتراضي شائع).',
  'AD ليس مقياس جودة المسار داخل نفس البروتوكول.',
  'القيم افتراضية شائعة وقد تتغير بالإعداد.',
]
export function AdministrativeDistanceComparisonDiagram() {
  const p = useStepPlayback(adStages.length); const s = p.stage
  const rows: [string,string,string,boolean][] = [['Connected','0','#34d399',s>=2],['Static','1','#38bdf8',s>=2],['EIGRP internal','90','#a78bfa',s>=2],['OSPF','110','#f59e0b',s>=2],['RIP','120','#fb7185',s>=2]]
  return <StepShell title="ADMINISTRATIVE DISTANCE COMPARISON" playback={p} legend={adStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Administrative distance comparison among connected static EIGRP OSPF and RIP">
    <SvgText x={460} y={50} color="#94a3b8" size={9}>LOWER AD = MORE TRUSTED SOURCE (different sources, same prefix)</SvgText>
    {rows.map((r,i)=>{const w=560-Number(r[1])*4; return <g key={r[0]} opacity={r[3]?1:0.3}><SvgText x={110} y={105+i*55} color="#e2e8f0" size={9.5} anchor="start">{r[0]}</SvgText><rect x={260} y={88+i*55} width={Math.max(40,w)} height={24} rx="6" fill="#0b1224" stroke={r[2]} /><SvgText x={280+Math.max(40,w)} y={105+i*55} color={r[2]} size={9} anchor="start">{`AD ${r[1]}`}</SvgText></g>})}
  </svg></StepShell>
}

const metricStages = [
  'Metric يقارن routes داخل نفس routing protocol.',
  'OSPF يستخدم cost (مرتبط bandwidth بشكل شائع).',
  'RIP يستخدم hop count كمثال مبسط.',
  'الأقل metric أفضل داخل نفس البروتوكول.',
  'Metric لا يقارن بين OSPF وRIP مباشرة؛ AD يفعل ذلك أولاً عند اختلاف المصدر.',
]
export function MetricComparisonDiagram() {
  const p = useStepPlayback(metricStages.length); const s = p.stage
  return <StepShell title="METRIC COMPARISON" playback={p} legend={metricStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Metric comparison within the same routing protocol such as OSPF cost or RIP hop count">
    <Device x={70} y={150} w={140} h={90} title="R1" sub="source" color="#38bdf8" active />
    <Device x={390} y={70} w={140} h={80} title="Path A" sub="OSPF cost 20" color={s>=3? '#34d399':'#f59e0b'} active={s>=1} />
    <Device x={390} y={250} w={140} h={80} title="Path B" sub="OSPF cost 50" color="#94a3b8" active={s>=1} />
    <Device x={710} y={150} w={140} h={90} title="R4" sub="destination" color="#a78bfa" active />
    <LinkLine x1={210} y1={180} x2={390} y2={110} color={s>=3?'#34d399':'#f59e0b'} active={s>=1} />
    <LinkLine x1={210} y1={220} x2={390} y2={290} color="#94a3b8" active={s>=1} />
    <LinkLine x1={530} y1={110} x2={710} y2={180} color={s>=3?'#34d399':'#f59e0b'} active={s>=1} />
    <LinkLine x1={530} y1={290} x2={710} y2={220} color="#94a3b8" active={s>=1} />
    {s>=3 && <Badge x={350} y={360} text="SAME PROTOCOL: LOWER METRIC WINS" color="#34d399" active w={260} />}
  </svg></StepShell>
}

const adMetricStages = [
  'AD يجيب: من أثق أكثر؟ (مصدر مختلف).',
  'Metric يجيب: أي مسار أفضل؟ (داخل نفس البروتوكول).',
  'مثال: OSPF route وRIP route لنفس الشبكة — AD يُقارن أولاً.',
  'مثال: مساران OSPF لنفس الشبكة — Metric/cost يُقارن.',
  'لا تخلط بينهما: AD = trust, Metric = path cost.',
]
export function AdVsMetricDiagram() {
  const p = useStepPlayback(adMetricStages.length); const s = p.stage
  return <StepShell title="AD vs METRIC" playback={p} legend={adMetricStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Difference between administrative distance and metric">
    <rect x={60} y={90} width={360} height={240} rx="14" fill="#0b1224" stroke={s===0||s===2?'#38bdf8':'#475569'} strokeWidth={s===0||s===2?2.2:1} />
    <SvgText x={240} y={125} color="#38bdf8" size={12} bold>Administrative Distance</SvgText>
    <SvgText x={240} y={170} color="#cbd5e1" size={9.5}>Trustworthiness of route source</SvgText>
    <SvgText x={240} y={195} color="#cbd5e1" size={9.5}>Different sources, same prefix</SvgText>
    <SvgText x={240} y={220} color="#cbd5e1" size={9.5}>Lower AD wins</SvgText>
    <SvgText x={240} y={255} color="#94a3b8" size={8.5}>Example: OSPF 110 vs RIP 120</SvgText>
    <rect x={500} y={90} width={360} height={240} rx="14" fill="#0b1224" stroke={s===1||s===3?'#34d399':'#475569'} strokeWidth={s===1||s===3?2.2:1} />
    <SvgText x={680} y={125} color="#34d399" size={12} bold>Metric</SvgText>
    <SvgText x={680} y={170} color="#cbd5e1" size={9.5}>Path quality inside same protocol</SvgText>
    <SvgText x={680} y={195} color="#cbd5e1" size={9.5}>Same protocol, same destination</SvgText>
    <SvgText x={680} y={220} color="#cbd5e1" size={9.5}>Lower metric wins</SvgText>
    <SvgText x={680} y={255} color="#94a3b8" size={8.5}>Example: OSPF cost 20 vs 50</SvgText>
    {s>=4 && <Badge x={340} y={355} text="AD = TRUST SOURCE | METRIC = PATH COST" color="#f59e0b" active w={240} />}
  </svg></StepShell>
}

const gwStages = [
  'Gateway of last resort هو المسار الافتراضي عند عدم وجود match محدد.',
  'يظهر في show ip route كـ default route candidate.',
  'Static default route مثال: ip route 0.0.0.0 0.0.0.0 next-hop.',
  'بدون default route قد تُسقط packets المجهولة الوجهة.',
  'Gateway of last resort مفيد للحافة/الإنترنت لكنه ليس بديلاً عن routes المحددة.',
]
export function GatewayOfLastResortDiagram() {
  const p = useStepPlayback(gwStages.length); const s = p.stage
  return <StepShell title="GATEWAY OF LAST RESORT" playback={p} legend={gwStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Gateway of last resort default route used when no specific route matches">
    <Device x={80} y={170} w={150} h={90} title="R1" sub="no specific route" color="#38bdf8" active />
    <Device x={390} y={170} w={150} h={90} title="EDGE R2" sub="gateway of last resort" color="#f59e0b" active={s>=0} />
    <Device x={700} y={170} w={150} h={90} title="INTERNET" sub="unknown networks" color="#94a3b8" active={s>=2} />
    <LinkLine x1={230} y1={215} x2={390} y2={215} color="#38bdf8" active />
    <LinkLine x1={540} y1={215} x2={700} y2={215} color="#f59e0b" active={s>=2} />
    {s>=1 && <Badge x={270} y={110} text="Gateway of last resort is 192.168.1.2 to network 0.0.0.0" color="#f59e0b" active w={380} />}
    {s>=3 && <Badge x={300} y={300} text="NO DEFAULT ROUTE = DROP UNKNOWN" color="#fb7185" active w={320} />}
  </svg></StepShell>
}

const completeStages = [
  'اطلع على header: Gateway of last resort status.',
  'اقرأ C/L routes للشبكات المتصلة مباشرة.',
  'اقرأ S static routes مع [AD/Metric] وnext hop.',
  'اقرأ O dynamic routes وتحقق من المصدر.',
  'استخدم الجدول كاملاً لاتخاذ قرار forwarding واستكشاف الأخطاء.',
]
export function CompleteRoutingTableExampleDiagram() {
  const p = useStepPlayback(completeStages.length); const s = p.stage
  return <StepShell title="COMPLETE ROUTING TABLE EXAMPLE" playback={p} legend={completeStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Complete routing table example showing gateway of last resort connected local static and dynamic routes">
    <rect x={40} y={55} width={840} height={320} rx="12" fill="#0b1224" stroke="#334155" />
    <SvgText x={60} y={82} color="#94a3b8" size={8.8} anchor="start">Gateway of last resort is 192.168.1.254 to network 0.0.0.0</SvgText>
    <Row x={60} y={110} w={800} code="C" prefix="192.168.1.0/24" adMetric="" nextHop="directly connected" iface="GigabitEthernet0/0" color="#34d399" active={s>=1} />
    <Row x={60} y={145} w={800} code="L" prefix="192.168.1.1/32" adMetric="" nextHop="directly connected" iface="GigabitEthernet0/0" color="#38bdf8" active={s>=1} />
    <Row x={60} y={180} w={800} code="S" prefix="10.10.10.0/24" adMetric="[1/0]" nextHop="via 192.168.1.2" iface="" color="#f59e0b" active={s>=2} />
    <Row x={60} y={215} w={800} code="O" prefix="172.16.1.0/24" adMetric="[110/20]" nextHop="via 192.168.1.3" iface="GigabitEthernet0/1" color="#a78bfa" active={s>=3} />
    <Row x={60} y={250} w={800} code="S*" prefix="0.0.0.0/0" adMetric="[1/0]" nextHop="via 192.168.1.254" iface="" color="#fb7185" active={s>=0} />
  </svg></StepShell>
}