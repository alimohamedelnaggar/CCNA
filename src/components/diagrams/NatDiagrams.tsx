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
function Badge({ x, y, text, color = '#38bdf8', active = true, w = 220 }: { x: number; y: number; text: string; color?: string; active?: boolean; w?: number }) {
  return <g opacity={active ? 1 : 0.4}><rect x={x} y={y} width={w} height={24} rx="7" fill="#0a1730" stroke={color} strokeWidth={active ? 1.8 : 1} /><SvgText x={x + w / 2} y={y + 16} color={color} size={8.2} bold>{text}</SvgText></g>
}

const conceptStages = [
  'داخل LAN، الأجهزة تستخدم Private IPs مثل 192.168.1.10.',
  'عند الخروج للإنترنت، الـ Router يترجم Source IP إلى Public/Global IP.',
  'الإنترنت يرى العنوان العام فقط، لا يرى Private IP الداخلي.',
  'عند عودة الرد، الراوتر يترجم العنوان ويعيده للجهاز الداخلي الصحيح.',
  'NAT يحل مشكلة IPv4 exhaustion جزئياً ويسمح بمشاركة Public addresses، لكنه ليس Firewall.',
]
export function NatConceptDiagram() {
  const p = useStepPlayback(conceptStages.length); const s = p.stage
  return <StepShell title="NAT CONCEPT" playback={p} legend={conceptStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="NAT concept translating private IP to public IP">
    <Box x={60} y={160} w={160} h={80} title="PC1" sub="192.168.1.10" color="#38bdf8" active />
    <Box x={360} y={150} w={170} h={100} title="NAT Router" sub={s>=1 ? 'Translates SRC' : 'Inside/Outside'} color="#f59e0b" active />
    <Box x={690} y={160} w={160} h={80} title="Internet/Server" sub="198.51.100.20" color="#94a3b8" active />
    <LinkLine x1={220} y1={200} x2={360} y2={200} color="#38bdf8" active />
    <LinkLine x1={530} y1={200} x2={690} y2={200} color="#34d399" active={s>=1} />
    {s>=1 && <Badge x={350} y={290} text="SRC becomes 203.0.113.10" color="#34d399" active />}
    {s>=3 && <Badge x={350} y={320} text="Reply translated back to 192.168.1.10" color="#f59e0b" active w={300} />}
  </svg></StepShell>
}

const privPubStages = [
  'Private IPv4 ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16.',
  'Private addresses قابلة لإعادة الاستخدام داخل الشبكات الخاصة.',
  'Public addresses قابلة للتوجيه على الإنترنت (عالمياً فريدة حسب التخصيص).',
  'Private IPs لا تُوجَّه مباشرة عبر Public Internet.',
  'NAT يترجم بين Private داخل الشبكة وPublic على الإنترنت.',
]
export function NatPrivateVsPublicIpDiagram() {
  const p = useStepPlayback(privPubStages.length); const s = p.stage
  return <StepShell title="PRIVATE vs PUBLIC IP" playback={p} legend={privPubStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Private versus public IP address ranges and NAT boundary">
    <Box x={80} y={90} w={320} h={240} title="Private Network" sub="RFC 1918" color="#38bdf8" active={s<=1||s===4} />
    <Box x={520} y={90} w={320} h={240} title="Public Internet" sub="Routable Public IPs" color="#34d399" active={s>=2} />
    <SvgText x={240} y={170} color="#cbd5e1" size={9}>10.0.0.0/8</SvgText>
    <SvgText x={240} y={195} color="#cbd5e1" size={9}>172.16.0.0/12</SvgText>
    <SvgText x={240} y={220} color="#cbd5e1" size={9}>192.168.0.0/16</SvgText>
    <Box x={420} y={170} w={80} h={60} title="NAT" sub="Router" color="#f59e0b" active={s>=4} />
  </svg></StepShell>
}

const flowStages = [
  'Outbound: PC1 (192.168.1.10) sends packet to server 198.51.100.20.',
  'Router receives packet on inside interface G0/0.',
  'NAT checks rules and translates source to Inside Global (203.0.113.10).',
  'Packet forwarded to internet with translated source.',
  'Inbound reply: router matches NAT table and translates destination back to 192.168.1.10.',
]
export function NatPacketFlowDiagram() {
  const p = useStepPlayback(flowStages.length); const s = p.stage
  return <StepShell title="NAT PACKET FLOW" playback={p} legend={flowStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="NAT outbound and inbound packet flow">
    <Box x={40} y={170} w={150} h={80} title="PC1" sub="192.168.1.10" color="#38bdf8" active />
    <Box x={360} y={150} w={170} h={120} title="R1 NAT" sub="G0/0 in / G0/1 out" color="#f59e0b" active />
    <Box x={700} y={170} w={160} h={80} title="Server" sub="198.51.100.20" color="#94a3b8" active />
    <LinkLine x1={190} y1={210} x2={360} y2={210} color="#38bdf8" active={s<=1} />
    <LinkLine x1={530} y1={210} x2={700} y2={210} color="#34d399" active={s>=2 && s<4} />
    {s>=2 && <Badge x={320} y={300} text="SRC: 192.168.1.10 -> 203.0.113.10" color="#34d399" active w={320} />}
    {s>=4 && <Badge x={320} y={330} text="DST reply: 203.0.113.10 -> 192.168.1.10" color="#f59e0b" active w={340} />}
  </svg></StepShell>
}

const inStages = [
  'Inside Local: عنوان الجهاز الداخلي كما يظهر داخل LAN (192.168.1.10).',
  'Inside Global: نفس الجهاز كما يُرى من الخارج (203.0.113.10).',
  'الترجمة تربط Inside Local بـ Inside Global.',
  'Outbound packet source changes from Inside Local to Inside Global.',
  'Inbound reply destination changes from Inside Global back to Inside Local.',
]
export function NatInsideLocalGlobalDiagram() {
  const p = useStepPlayback(inStages.length); const s = p.stage
  return <StepShell title="INSIDE LOCAL vs INSIDE GLOBAL" playback={p} legend={inStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Inside local and inside global NAT terminology">
    <Box x={90} y={150} w={250} h={100} title="Inside Local" sub="192.168.1.10" color="#38bdf8" active={s===0||s>=3} />
    <Box x={580} y={150} w={250} h={100} title="Inside Global" sub="203.0.113.10" color="#34d399" active={s>=1} />
    <LinkLine x1={340} y1={200} x2={580} y2={200} color="#f59e0b" active={s>=2} />
    <Badge x={360} y={280} text="Same internal host, different viewpoint" color="#f59e0b" active w={260} />
  </svg></StepShell>
}

const outStages = [
  'Outside Global: العنوان الحقيقي للجهاز الخارجي على الإنترنت (198.51.100.20).',
  'Outside Local: كيف يظهر الجهاز الخارجي للشبكة الداخلية.',
  'في كثير من السيناريوهات البسيطة يكون Outside Local = Outside Global.',
  'NAT table يمكن أن يعرض الاثنين كأعمدة منفصلة.',
  'افهم المصطلح من منظور الشبكة الداخلية/الخارجية، وليس فقط قيمة IP.',
]
export function NatOutsideLocalGlobalDiagram() {
  const p = useStepPlayback(outStages.length); const s = p.stage
  return <StepShell title="OUTSIDE LOCAL vs OUTSIDE GLOBAL" playback={p} legend={outStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Outside local and outside global NAT terminology">
    <Box x={90} y={150} w={250} h={100} title="Outside Local" sub="198.51.100.20" color="#a78bfa" active={s>=1} />
    <Box x={580} y={150} w={250} h={100} title="Outside Global" sub="198.51.100.20" color="#94a3b8" active />
    {s>=2 && <Badge x={330} y={290} text="Often equal in simple scenarios" color="#34d399" active w={260} />}
  </svg></StepShell>
}

const termStages = [
  'Inside Local 192.168.1.10 sends to Outside Global 198.51.100.20.',
  'Router translates to Inside Global 203.0.113.10.',
  'Outside Local often same as Outside Global in basic NAT.',
  'NAT table tracks all four perspectives when relevant.',
  'Direction matters: outbound changes source; inbound reply changes destination.',
]
export function NatTerminologyCompleteDiagram() {
  const p = useStepPlayback(termStages.length); const s = p.stage
  return <StepShell title="NAT TERMINOLOGY COMPLETE" playback={p} legend={termStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Complete NAT terminology diagram with all four address types">
    <Box x={50} y={150} w={180} h={90} title="Inside Local" sub="192.168.1.10" color="#38bdf8" active={s>=0} />
    <Box x={270} y={60} w={180} h={80} title="Inside Global" sub="203.0.113.10" color="#34d399" active={s>=1} />
    <Box x={500} y={250} w={180} h={80} title="Outside Local" sub="198.51.100.20" color="#a78bfa" active={s>=2} />
    <Box x={720} y={150} w={170} h={90} title="Outside Global" sub="198.51.100.20" color="#94a3b8" active={s>=0} />
    <Box x={390} y={170} w={140} h={80} title="NAT Router" sub="Translation" color="#f59e0b" active />
  </svg></StepShell>
}

const staticStages = [
  'Static NAT creates a permanent one-to-one mapping.',
  'Inside Local 192.168.1.10 maps to Inside Global 203.0.113.10.',
  'Useful for internal servers needing a fixed public address.',
  'Mapping exists even before traffic (static/configured).',
  'Not the same as PAT: no port multiplexing by default.',
]
export function StaticNatMappingDiagram() {
  const p = useStepPlayback(staticStages.length); const s = p.stage
  return <StepShell title="STATIC NAT ONE-TO-ONE" playback={p} legend={staticStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Static NAT one-to-one mapping">
    <Box x={110} y={170} w={220} h={90} title="Inside Local" sub="192.168.1.10" color="#38bdf8" active />
    <Box x={590} y={170} w={220} h={90} title="Inside Global" sub="203.0.113.10" color="#34d399" active />
    <LinkLine x1={330} y1={215} x2={590} y2={215} color="#f59e0b" active />
    <Badge x={360} y={290} text="Static 1:1 mapping" color="#f59e0b" active w={200} />
  </svg></StepShell>
}

const dynStages = [
  'Dynamic NAT uses a pool of public addresses.',
  'Inside host gets a temporary mapping when traffic matches ACL.',
  'Mapping is dynamic and can time out when idle.',
  'Still generally one-to-one per active translation, but from pool.',
  'If pool is exhausted, new translations may fail until addresses free up.',
]
export function DynamicNatMappingDiagram() {
  const p = useStepPlayback(dynStages.length); const s = p.stage
  return <StepShell title="DYNAMIC NAT MAPPING" playback={p} legend={dynStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Dynamic NAT mapping from inside hosts to pool addresses">
    <Box x={70} y={110} w={180} h={70} title="PC1" sub="192.168.1.10" color="#38bdf8" active />
    <Box x={70} y={220} w={180} h={70} title="PC2" sub="192.168.1.20" color="#38bdf8" active={s>=1} />
    <Box x={640} y={110} w={200} h={70} title="Pool IP" sub="203.0.113.10" color="#34d399" active={s>=1} />
    <Box x={640} y={220} w={200} h={70} title="Pool IP" sub="203.0.113.11" color="#34d399" active={s>=2} />
    <LinkLine x1={250} y1={145} x2={640} y2={145} color="#f59e0b" active={s>=1} />
    <LinkLine x1={250} y1={255} x2={640} y2={255} color="#f59e0b" active={s>=2} />
  </svg></StepShell>
}

const poolStages = [
  'NAT pool defines a range of inside global addresses.',
  'Example: 203.0.113.10 - 203.0.113.20.',
  'ACL selects which inside local addresses can use the pool.',
  'Each active translation consumes a pool address in traditional dynamic NAT.',
  'Pool exhaustion causes new flows to fail until entries expire/clear.',
]
export function NatPoolDiagram() {
  const p = useStepPlayback(poolStages.length); const s = p.stage
  return <StepShell title="NAT POOL" playback={p} legend={poolStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="NAT pool address range and allocation">
    <Box x={360} y={80} w={220} h={220} title="NAT Pool" sub="203.0.113.10-.20" color="#f59e0b" active />
    {['.10','.11','.12','...','.20'].map((x,i)=><Badge key={x} x={390} y={130+i*30} text={`203.0.113${x}`} color={s>i? '#34d399':'#64748b'} active={s>i} w={160} />)}
    {s>=4 && <Badge x={330} y={330} text="Pool exhausted => new translations fail" color="#fb7185" active w={300} />}
  </svg></StepShell>
}

const patStages = [
  'PAT (NAT Overload) allows many inside hosts to share one public IP.',
  'Router differentiates sessions using transport-layer port numbers.',
  'PC1, PC2, PC3 can all map to 203.0.113.1 with different ports.',
  'NAT table stores inside local IP:port to inside global IP:port.',
  'PAT conserves public IPv4 addresses much more than one-to-one NAT.',
]
export function PatNatOverloadDiagram() {
  const p = useStepPlayback(patStages.length); const s = p.stage
  return <StepShell title="PAT / NAT OVERLOAD" playback={p} legend={patStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="PAT overload mapping multiple hosts to one public IP with ports">
    <Box x={60} y={90} w={200} h={60} title="PC1" sub="192.168.1.10:50001" color="#38bdf8" active />
    <Box x={60} y={170} w={200} h={60} title="PC2" sub="192.168.1.20:50002" color="#38bdf8" active={s>=1} />
    <Box x={60} y={250} w={200} h={60} title="PC3" sub="192.168.1.30:50003" color="#38bdf8" active={s>=2} />
    <Box x={630} y={150} w={230} h={120} title="Public IP" sub="203.0.113.1" color="#34d399" active />
    {s>=1 && <Badge x={350} y={120} text="203.0.113.1:30001" color="#f59e0b" active w={170} />}
    {s>=2 && <Badge x={350} y={190} text="203.0.113.1:30002" color="#f59e0b" active w={170} />}
    {s>=3 && <Badge x={350} y={260} text="203.0.113.1:30003" color="#f59e0b" active w={170} />}
  </svg></StepShell>
}

const portStages = [
  'Port translation tracks sessions, not just IP addresses.',
  'Same public IP can carry many conversations simultaneously.',
  'Return traffic uses translated destination IP:port to find original host.',
  'Ports shown are examples; actual ports are allocated dynamically by NAT/device.',
  'PAT relies on NAT translation table state.',
]
export function NatPortTranslationDiagram() {
  const p = useStepPlayback(portStages.length); const s = p.stage
  return <StepShell title="PORT TRANSLATION" playback={p} legend={portStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="NAT port translation for multiple sessions">
    <Box x={90} y={160} w={220} h={90} title="Inside Session" sub="192.168.1.10:50001" color="#38bdf8" active />
    <Box x={610} y={160} w={220} h={90} title="Translated Session" sub="203.0.113.1:30001" color="#34d399" active={s>=1} />
    <LinkLine x1={310} y1={205} x2={610} y2={205} color="#f59e0b" active={s>=1} />
    {s>=3 && <Badge x={330} y={290} text="IP:Port mapping stored in NAT table" color="#f59e0b" active w={280} />}
  </svg></StepShell>
}

const tableStages = [
  'NAT translation table stores active mappings.',
  'Columns include protocol, inside global/local, outside local/global.',
  'PAT entries include port numbers.',
  'Static entries are configured; dynamic entries created by traffic/timeouts.',
  'Use show ip nat translations / statistics for verification.',
]
export function NatTranslationTableDiagram() {
  const p = useStepPlayback(tableStages.length); const s = p.stage
  const rows = [
    ['tcp','203.0.113.1:30001','192.168.1.10:50001','198.51.100.20:80','198.51.100.20:80'],
    ['tcp','203.0.113.1:30002','192.168.1.20:50002','198.51.100.20:80','198.51.100.20:80'],
  ]
  return <StepShell title="NAT TRANSLATION TABLE" playback={p} legend={tableStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="NAT translation table example">
    <rect x={40} y={90} width={840} height={220} rx="12" fill="#0b1224" stroke="#334155" />
    <SvgText x={70} y={120} color="#38bdf8" size={8.5} bold>Pro</SvgText>
    <SvgText x={140} y={120} color="#38bdf8" size={8.5} bold>Inside Global</SvgText>
    <SvgText x={300} y={120} color="#38bdf8" size={8.5} bold>Inside Local</SvgText>
    <SvgText x={470} y={120} color="#38bdf8" size={8.5} bold>Outside Local</SvgText>
    <SvgText x={660} y={120} color="#38bdf8" size={8.5} bold>Outside Global</SvgText>
    {rows.map((r,i)=><g key={i} opacity={s>=i?1:0.35}>{r.map((c,j)=><SvgText key={j} x={[70,140,300,470,660][j]} y={170+i*45} color="#cbd5e1" size={8.2}>{c}</SvgText>)}</g>)}
  </svg></StepShell>
}

const cmpStages = [
  'Static NAT: permanent one-to-one mapping.',
  'Dynamic NAT: temporary one-to-one mapping from a pool.',
  'PAT: many-to-one using ports (overload).',
  'Static good for servers; PAT common for internet access.',
  'Choose based on address availability, inbound needs, and design.',
]
export function NatTypesComparisonDiagram() {
  const p = useStepPlayback(cmpStages.length); const s = p.stage
  return <StepShell title="STATIC vs DYNAMIC vs PAT" playback={p} legend={cmpStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Comparison of static NAT dynamic NAT and PAT">
    <Box x={60} y={120} w={240} h={170} title="Static NAT" sub="1:1 fixed" color="#38bdf8" active={s===0||s===4} />
    <Box x={340} y={120} w={240} h={170} title="Dynamic NAT" sub="1:1 from pool" color="#f59e0b" active={s===1||s===4} />
    <Box x={620} y={120} w={240} h={170} title="PAT" sub="Many:1 ports" color="#34d399" active={s>=2} />
  </svg></StepShell>
}

const cfgStages = [
  'Inside LAN connects to R1 G0/0 (inside).',
  'R1 G0/1 connects to ISP/outside network (outside).',
  'Configure inside/outside interfaces first.',
  'Apply static, dynamic pool, or PAT rule depending on scenario.',
  'Verify with show ip nat translations/statistics and traffic tests.',
]
export function NatConfigurationTopologyDiagram() {
  const p = useStepPlayback(cfgStages.length); const s = p.stage
  return <StepShell title="NAT CONFIGURATION TOPOLOGY" playback={p} legend={cfgStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="NAT configuration topology with inside outside interfaces">
    <Box x={40} y={120} w={150} h={70} title="PC1" sub="192.168.1.10" color="#38bdf8" active />
    <Box x={40} y={230} w={150} h={70} title="PC2" sub="192.168.1.20" color="#38bdf8" active />
    <Box x={250} y={170} w={120} h={70} title="Switch" sub="LAN" color="#64748b" active />
    <Box x={440} y={150} w={170} h={110} title="R1 NAT" sub="G0/0 inside G0/1 outside" color="#f59e0b" active />
    <Box x={700} y={170} w={160} h={70} title="ISP/Server" sub="198.51.100.20" color="#94a3b8" active />
    <LinkLine x1={190} y1={155} x2={250} y2={205} color="#38bdf8" active /><LinkLine x1={190} y1={265} x2={250} y2={205} color="#38bdf8" active />
    <LinkLine x1={370} y1={205} x2={440} y2={205} color="#38bdf8" active /><LinkLine x1={610} y1={205} x2={700} y2={205} color="#34d399" active={s>=1} />
  </svg></StepShell>
}

const troubleStages = [
  'Check inside/outside interface roles are correct.',
  'Verify ACL matches intended inside local addresses.',
  'Verify NAT pool/rule/overload and interface IPs.',
  'Check routing/return path; NAT alone does not fix routing.',
  'Use show ip nat translations/statistics and clear dynamic entries carefully.',
]
export function NatTroubleshootingFlowDiagram() {
  const p = useStepPlayback(troubleStages.length); const s = p.stage
  const steps = ['Inside/Outside','ACL Match','NAT Rule/Pool','Routing Return','Verify/Clear']
  return <StepShell title="NAT TROUBLESHOOTING FLOW" playback={p} legend={troubleStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="NAT troubleshooting flow">
    {steps.map((t,i)=><g key={t} opacity={s>=i?1:0.35}><rect x={30+i*175} y={170} width={150} height={70} rx="10" fill="#0b1224" stroke={s===i?'#f59e0b':'#475569'} strokeWidth={s===i?2.2:1}/><SvgText x={105+i*175} y={210} color={s===i?'#f59e0b':'#cbd5e1'} size={8.8} bold>{t}</SvgText></g>)}
  </svg></StepShell>
}

const beforeAfterStages = [
  'Before NAT: packet leaves PC with source 192.168.1.10.',
  'Router applies NAT rule on inside-to-outside flow.',
  'After NAT: source becomes 203.0.113.10 (and port for PAT).',
  'Server replies to 203.0.113.10:translated-port.',
  'Router reverses translation back to 192.168.1.10:original-port.',
]
export function NatBeforeAfterTranslationDiagram() {
  const p = useStepPlayback(beforeAfterStages.length); const s = p.stage
  return <StepShell title="NAT BEFORE AND AFTER TRANSLATION" playback={p} legend={beforeAfterStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Packet fields before and after NAT translation">
    <Box x={90} y={140} w={280} h={120} title="Before NAT" sub={s<2 ? 'SRC 192.168.1.10:50001' : 'DST 203.0.113.1:30001 (reply)'} color="#38bdf8" active={s<=1||s>=3} />
    <Box x={550} y={140} w={280} h={120} title="After NAT" sub={s<4 ? 'SRC 203.0.113.1:30001' : 'DST 192.168.1.10:50001'} color="#34d399" active={s>=2} />
    <LinkLine x1={370} y1={200} x2={550} y2={200} color="#f59e0b" active={s>=1} />
  </svg></StepShell>
}
