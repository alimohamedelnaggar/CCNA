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
function Badge({ x, y, text, color = '#38bdf8', active = true, w = 160 }: { x: number; y: number; text: string; color?: string; active?: boolean; w?: number }) {
  return <g opacity={active ? 1 : 0.4}><rect x={x} y={y} width={w} height={24} rx="7" fill="#0a1730" stroke={color} strokeWidth={active ? 1.8 : 1} /><SvgText x={x + w / 2} y={y + 16} color={color} size={8.2} bold>{text}</SvgText></g>
}

const dynStages = ['Static routing: admin configures routes manually.', 'Dynamic routing: routers exchange routing information automatically.', 'OSPF is a dynamic link-state IGP.', 'Dynamic routing adapts faster to failures but adds protocol overhead.', 'Static can still be used alongside OSPF for specific cases.']
export function DynamicVsStaticRoutingDiagram() {
  const p = useStepPlayback(dynStages.length); const s = p.stage
  return <StepShell title="DYNAMIC vs STATIC ROUTING" playback={p} legend={dynStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Dynamic routing compared to static routing with OSPF as dynamic example">
    <Box x={80} y={110} w={330} h={210} title="STATIC" sub="manual routes" color="#94a3b8" active={s===0||s===4} />
    <Box x={510} y={110} w={330} h={210} title="DYNAMIC (OSPF)" sub="automatic learning" color="#34d399" active={s>=1} />
    <SvgText x={245} y={190} color="#cbd5e1" size={9}>Admin adds/removes routes</SvgText>
    <SvgText x={245} y={215} color="#cbd5e1" size={9}>Simple, predictable</SvgText>
    <SvgText x={675} y={190} color="#cbd5e1" size={9}>Neighbors exchange LSAs</SvgText>
    <SvgText x={675} y={215} color="#cbd5e1" size={9}>Adapts to topology changes</SvgText>
  </svg></StepShell>
}

const archStages = ['OSPF routers in an area share link-state information.', 'Each router builds the same LSDB view for the area.', 'SPF calculates shortest paths from that LSDB.', 'Best routes are installed in the routing table.', 'OSPF is an IGP commonly used inside an Autonomous System.']
export function OspfArchitectureOverviewDiagram() {
  const p = useStepPlayback(archStages.length); const s = p.stage
  return <StepShell title="OSPF ARCHITECTURE OVERVIEW" playback={p} legend={archStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="OSPF architecture overview showing area LSDB SPF and routing table">
    <rect x={70} y={70} width={780} height={280} rx="16" fill="#071226" stroke="#38bdf8" strokeWidth="1.5" />
    <SvgText x={460} y={100} color="#38bdf8" size={11} bold>OSPF Area 0 (Single Area)</SvgText>
    <Box x={110} y={140} w={130} h={70} title="R1" sub="Router ID" color="#38bdf8" active={s>=0} />
    <Box x={395} y={140} w={130} h={70} title="R2" sub="LSDB" color="#f59e0b" active={s>=1} />
    <Box x={680} y={140} w={130} h={70} title="R3" sub="SPF" color="#34d399" active={s>=2} />
    <LinkLine x1={240} y1={175} x2={395} y2={175} color="#38bdf8" active={s>=1} />
    <LinkLine x1={525} y1={175} x2={680} y2={175} color="#34d399" active={s>=2} />
    {s>=3 && <Badge x={360} y={270} text="Best routes -> Routing Table" color="#a78bfa" active w={220} />}
  </svg></StepShell>
}

const lifeStages = ['Start OSPF process on router.', 'Select Router ID.', 'Send Hello packets and discover neighbors.', 'Form adjacencies and exchange LSAs.', 'Build LSDB, run SPF, install best routes.']
export function OspfOperationLifecycleDiagram() {
  const p = useStepPlayback(lifeStages.length); const s = p.stage
  const labels = ['Start OSPF','Router ID','Hello/Neighbors','Exchange LSAs','LSDB/SPF/Routes']
  return <StepShell title="OSPF OPERATION LIFECYCLE" playback={p} legend={lifeStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="OSPF operation lifecycle from process start to route installation">
    {labels.map((t,i)=><g key={t} opacity={s>=i?1:0.35}><rect x={40+i*175} y={170} width={150} height={80} rx="10" fill="#0b1224" stroke={s===i?'#34d399':'#475569'} strokeWidth={s===i?2.2:1}/><SvgText x={115+i*175} y={205} color={s===i?'#34d399':'#cbd5e1'} size={8.8} bold>{t}</SvgText></g>)}
    {[0,1,2,3].map(i=><LinkLine key={i} x1={190+i*175} y1={210} x2={215+i*175} y2={210} color="#34d399" active={s>i} />)}
  </svg></StepShell>
}

const ridStages = ['Router ID identifies the OSPF router in the domain.', 'Manual router-id is preferred if configured.', 'Otherwise highest IP on eligible loopback is used.', 'If no loopback, highest IP on eligible active physical interface.', 'Changing RID after OSPF start may need process reset/reload depending on platform.']
export function RouterIdSelectionDiagram() {
  const p = useStepPlayback(ridStages.length); const s = p.stage
  return <StepShell title="ROUTER ID SELECTION" playback={p} legend={ridStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="OSPF router ID selection priority order">
    <Badge x={300} y={70} text="1. Manual router-id" color={s===0?'#34d399':'#38bdf8'} active={s>=0} w={320} />
    <Badge x={300} y={130} text="2. Highest loopback IP" color={s===2?'#34d399':'#38bdf8'} active={s>=2} w={320} />
    <Badge x={300} y={190} text="3. Highest active physical IP" color={s===3?'#34d399':'#38bdf8'} active={s>=3} w={320} />
    <Badge x={300} y={270} text="Example: router-id 1.1.1.1" color="#f59e0b" active={s>=1} w={320} />
  </svg></StepShell>
}

const helloStages = ['R1 sends Hello on OSPF-enabled interface.', 'R2 receives Hello and checks compatibility.', 'If parameters match, R2 includes R1 in its Hello.', 'Seeing own Router ID in received Hello indicates 2-way communication.', 'Hello packets also maintain neighbor relationship.']
export function HelloPacketExchangeDiagram() {
  const p = useStepPlayback(helloStages.length); const s = p.stage
  return <StepShell title="HELLO PACKET EXCHANGE" playback={p} legend={helloStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="OSPF hello packet exchange between neighbors">
    <Box x={120} y={160} w={180} h={90} title="R1" sub="RID 1.1.1.1" color="#38bdf8" active />
    <Box x={620} y={160} w={180} h={90} title="R2" sub="RID 2.2.2.2" color="#34d399" active />
    <LinkLine x1={300} y1={205} x2={620} y2={205} color="#94a3b8" active />
    {s>=0 && <Badge x={360} y={120} text="Hello →" color="#38bdf8" active={s>=0} w={120} />}
    {s>=2 && <Badge x={440} y={260} text="← Hello (sees R1)" color="#34d399" active={s>=2} w={160} />}
    {s>=3 && <Badge x={360} y={320} text="2-Way possible" color="#a78bfa" active w={200} />}
  </svg></StepShell>
}

const timerStages = ['Hello interval: how often Hellos are sent.', 'Dead interval: how long before neighbor declared down.', 'Broadcast/P2P common Cisco defaults: 10/40 seconds.', 'Timers must match for neighbors to form.', 'Values can vary by network type/platform/config.']
export function HelloAndDeadIntervalsDiagram() {
  const p = useStepPlayback(timerStages.length); const s = p.stage
  return <StepShell title="HELLO & DEAD INTERVALS" playback={p} legend={timerStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="OSPF hello and dead interval timers">
    <Badge x={220} y={120} text="Broadcast: Hello 10s / Dead 40s" color="#38bdf8" active={s>=2} w={480} />
    <Badge x={220} y={170} text="Point-to-Point: Hello 10s / Dead 40s" color="#34d399" active={s>=2} w={480} />
    {s>=3 && <Badge x={280} y={250} text="Mismatch = neighbor may fail" color="#fb7185" active w={360} />}
  </svg></StepShell>
}

const stateStages = ['Down: no Hellos received yet.', 'Init: Hello received, but 2-way not confirmed.', '2-Way: bidirectional seen; DR/BDR election on multiaccess.', 'ExStart/Exchange: DBD exchange and master/slave negotiation.', 'Loading/Full: request missing LSAs then fully synchronized.']
export function OspfNeighborStatesDiagram() {
  const p = useStepPlayback(stateStages.length); const s = p.stage
  const states = ['Down','Init','2-Way','ExStart','Exchange','Loading','Full']
  return <StepShell title="OSPF NEIGHBOR STATES" playback={p} legend={stateStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="OSPF neighbor state progression from Down to Full">
    {states.map((t,i)=><g key={t} opacity={s>=Math.min(i,4)?1:0.35}><rect x={20+i*128} y={170} width={110} height={70} rx="10" fill="#0b1224" stroke={i===6 && s===4?'#34d399':(s>=Math.min(i,4)?'#38bdf8':'#475569')} strokeWidth={1.8}/><SvgText x={75+i*128} y={210} color="#cbd5e1" size={9} bold>{t}</SvgText></g>)}
  </svg></StepShell>
}

const adjStages = ['Neighbors see each other via Hellos.', '2-Way means bidirectional communication established.', 'On broadcast networks, not all neighbors become Full with everyone.', 'DROTHER-DROTHER may stay at 2-Way - normal.', 'Full adjacency means LSDB synchronized.']
export function NeighborVsFullAdjacencyDiagram() {
  const p = useStepPlayback(adjStages.length); const s = p.stage
  return <StepShell title="NEIGHBOR vs FULL ADJACENCY" playback={p} legend={adjStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Difference between neighbor relationship and full adjacency especially on broadcast networks">
    <Box x={120} y={150} w={180} h={80} title="DR" sub="Full with others" color="#34d399" active={s>=2} />
    <Box x={620} y={80} w={180} h={80} title="BDR" sub="Full with DR" color="#38bdf8" active={s>=2} />
    <Box x={620} y={240} w={180} h={80} title="DROTHER" sub="2-Way with DROTHER" color="#f59e0b" active={s>=3} />
    <LinkLine x1={300} y1={175} x2={620} y2={120} color="#34d399" active={s>=2} />
    <LinkLine x1={300} y1={205} x2={620} y2={280} color="#34d399" active={s>=2} />
    {s>=3 && <Badge x={430} y={320} text="DROTHER-DROTHER can stay 2-Way" color="#f59e0b" active w={320} />}
  </svg></StepShell>
}

const lsdbStages = ['Routers generate LSAs describing links/state.', 'LSAs are flooded within the area (per OSPF rules).', 'Each router stores LSAs in LSDB.', 'Routers in same area should have synchronized LSDB view.', 'SPF uses LSDB to compute shortest path tree.']
export function LinkStateDatabaseDiagram() {
  const p = useStepPlayback(lsdbStages.length); const s = p.stage
  return <StepShell title="LINK-STATE DATABASE (LSDB)" playback={p} legend={lsdbStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="OSPF link state database built from LSAs and used by SPF">
    <Box x={100} y={120} w={220} h={180} title="R1 LSDB" sub="area view" color="#38bdf8" active={s>=2} />
    <Box x={350} y={120} w={220} h={180} title="R2 LSDB" sub="synchronized" color="#38bdf8" active={s>=3} />
    <Box x={600} y={120} w={220} h={180} title="R3 LSDB" sub="same area" color="#38bdf8" active={s>=3} />
    {s>=4 && <Badge x={350} y={330} text="LSDB feeds SPF algorithm" color="#34d399" active w={220} />}
  </svg></StepShell>
}

const spfStages = ['SPF (Dijkstra) uses LSDB as input.', 'Each router calculates shortest path from itself.', 'Path cost is sum of interface costs.', 'Lowest total cost path is preferred.', 'Best routes installed into routing table.']
export function SpfAlgorithmDiagram() {
  const p = useStepPlayback(spfStages.length); const s = p.stage
  return <StepShell title="SPF ALGORITHM" playback={p} legend={spfStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="OSPF SPF Dijkstra algorithm calculating shortest path based on cost">
    <Box x={90} y={170} w={140} h={80} title="R1" sub="root" color="#38bdf8" active />
    <Box x={390} y={90} w={140} h={80} title="R2" sub="cost 10" color={s>=3?'#34d399':'#94a3b8'} active={s>=1} />
    <Box x={390} y={250} w={140} h={80} title="R3" sub="cost 20" color="#94a3b8" active={s>=1} />
    <Box x={690} y={170} w={140} h={80} title="R4" sub="dest" color="#34d399" active={s>=4} />
    <LinkLine x1={230} y1={190} x2={390} y2={130} color="#34d399" active={s>=2} />
    <LinkLine x1={230} y1={230} x2={390} y2={290} color="#64748b" active={s>=2} />
    <LinkLine x1={530} y1={130} x2={690} y2={190} color="#34d399" active={s>=3} />
    <LinkLine x1={530} y1={290} x2={690} y2={230} color="#64748b" active={s>=3} />
  </svg></StepShell>
}

const p2pStages = ['Point-to-point connects exactly two routers.', 'No DR/BDR election needed.', 'Routers form adjacency directly.', 'Common on serial links or P2P-configured Ethernet.', 'Hello/dead defaults often 10/40.']
export function PointToPointOspfDiagram() {
  const p = useStepPlayback(p2pStages.length); const s = p.stage
  return <StepShell title="POINT-TO-POINT OSPF NETWORK" playback={p} legend={p2pStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="OSPF point to point network with direct adjacency and no DR BDR">
    <Box x={150} y={170} w={180} h={90} title="R1" sub="OSPF" color="#38bdf8" active />
    <Box x={590} y={170} w={180} h={90} title="R2" sub="OSPF" color="#34d399" active />
    <LinkLine x1={330} y1={215} x2={590} y2={215} color="#34d399" active={s>=2} />
    {s>=1 && <Badge x={390} y={130} text="No DR/BDR" color="#f59e0b" active w={140} />}
  </svg></StepShell>
}

const bcastStages = ['Broadcast multiaccess can have many routers on one segment.', 'DR/BDR elected to reduce adjacencies/LSA flooding.', 'DR forms Full adjacency with routers; BDR backup.', 'DROTHERs usually Full with DR/BDR, 2-Way with each other.', 'Ethernet is a common broadcast network type.']
export function BroadcastMultiaccessOspfDiagram() {
  const p = useStepPlayback(bcastStages.length); const s = p.stage
  return <StepShell title="BROADCAST MULTIACCESS OSPF" playback={p} legend={bcastStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="OSPF broadcast multiaccess network with DR BDR and DROTHER routers">
    <Box x={400} y={70} w={140} h={70} title="DR" sub="R2" color="#34d399" active={s>=1} />
    <Box x={220} y={200} w={140} h={70} title="BDR" sub="R3" color="#38bdf8" active={s>=1} />
    <Box x={580} y={200} w={140} h={70} title="DROTHER" sub="R1" color="#94a3b8" active={s>=3} />
    <Box x={400} y={300} w={140} h={70} title="DROTHER" sub="R4" color="#94a3b8" active={s>=3} />
    <LinkLine x1={450} y1={140} x2={320} y2={200} color="#34d399" active={s>=2} />
    <LinkLine x1={490} y1={140} x2={620} y2={200} color="#34d399" active={s>=2} />
    <LinkLine x1={470} y1={140} x2={470} y2={300} color="#34d399" active={s>=2} />
  </svg></StepShell>
}

const drStages = ['All routers start; election considers priority then Router ID.', 'Highest interface priority wins DR/BDR election.', 'If priority tied, highest Router ID wins.', 'Priority 0 means router will not become DR/BDR.', 'Election is non-preemptive; new higher-priority router does not take over immediately.']
export function DrBdrElectionDiagram() {
  const p = useStepPlayback(drStages.length); const s = p.stage
  return <StepShell title="DR/BDR ELECTION" playback={p} legend={drStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="OSPF DR and BDR election based on priority and router ID">
    <Box x={90} y={120} w={200} h={80} title="R1" sub="Pri 1, RID 1.1.1.1" color="#94a3b8" active={s>=0} />
    <Box x={360} y={120} w={200} h={80} title="R2" sub="Pri 100, RID 2.2.2.2" color="#34d399" active={s>=1} />
    <Box x={630} y={120} w={200} h={80} title="R3" sub="Pri 50, RID 3.3.3.3" color="#38bdf8" active={s>=1} />
    {s>=2 && <Badge x={390} y={250} text="DR = R2 (highest priority)" color="#34d399" active w={240} />}
    {s>=2 && <Badge x={390} y={290} text="BDR = R3 (next highest)" color="#38bdf8" active w={240} />}
    {s>=4 && <Badge x={300} y={340} text="Non-preemptive election" color="#f59e0b" active w={320} />}
  </svg></StepShell>
}

const costStages = ['OSPF cost is based on interface bandwidth.', 'Cisco classic formula: Reference BW / Interface BW.', 'Default reference BW commonly 100 Mbps.', 'Fast interfaces may get same cost unless reference BW adjusted.', 'Lowest total path cost wins.']
export function OspfCostCalculationDiagram() {
  const p = useStepPlayback(costStages.length); const s = p.stage
  return <StepShell title="OSPF COST CALCULATION" playback={p} legend={costStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="OSPF cost calculation using reference bandwidth divided by interface bandwidth">
    <Badge x={270} y={80} text="Cost = Reference BW / Interface BW" color="#38bdf8" active w={380} />
    <Badge x={180} y={150} text="10 Mbps -> 10" color="#94a3b8" active={s>=1} w={180} />
    <Badge x={380} y={150} text="100 Mbps -> 1" color="#94a3b8" active={s>=1} w={180} />
    <Badge x={580} y={150} text="1 Gbps -> 1*" color="#f59e0b" active={s>=3} w={180} />
    {s>=3 && <Badge x={250} y={230} text="*with default 100 Mbps ref BW, 1G may look like 1" color="#fb7185" active w={420} />}
    {s>=4 && <Badge x={300} y={290} text="Use auto-cost reference-bandwidth consistently" color="#34d399" active w={320} />}
  </svg></StepShell>
}

const bestPathStages = ['R1 can reach LAN X via two paths.', 'Path A total cost = 20, Path B total cost = 30.', 'OSPF chooses lowest total cost.', 'Route with best cost installed in routing table.', 'If cost changes, SPF can recalculate and update routes.']
export function OspfBestPathSelectionDiagram() {
  const p = useStepPlayback(bestPathStages.length); const s = p.stage
  return <StepShell title="OSPF BEST PATH SELECTION" playback={p} legend={bestPathStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="OSPF best path selection based on lowest total cost">
    <Box x={80} y={170} w={120} h={70} title="R1" sub="source" color="#38bdf8" active />
    <Box x={400} y={80} w={120} h={70} title="R2" sub="path A" color={s>=3?'#34d399':'#94a3b8'} active={s>=1} />
    <Box x={400} y={260} w={120} h={70} title="R3" sub="path B" color="#94a3b8" active={s>=1} />
    <Box x={720} y={170} w={120} h={70} title="LAN X" sub="dest" color="#34d399" active />
    <LinkLine x1={200} y1={190} x2={400} y2={115} color="#34d399" active={s>=1} />
    <LinkLine x1={520} y1={115} x2={720} y2={190} color="#34d399" active={s>=1} />
    <LinkLine x1={200} y1={220} x2={400} y2={295} color="#64748b" active={s>=1} />
    <LinkLine x1={520} y1={295} x2={720} y2={220} color="#64748b" active={s>=1} />
    <Badge x={250} y={80} text="Total 20" color="#34d399" active={s>=2} w={100} />
    <Badge x={250} y={320} text="Total 30" color="#94a3b8" active={s>=2} w={100} />
  </svg></StepShell>
}

const topoStages = ['Single-area OSPF topology in Area 0.', 'R1, R2, R3 share routing info.', 'Each router advertises connected networks.', 'OSPF calculates best paths by cost.', 'All LANs become reachable via OSPF routes.']
export function SingleAreaOspfTopologyDiagram() {
  const p = useStepPlayback(topoStages.length); const s = p.stage
  return <StepShell title="SINGLE-AREA OSPF TOPOLOGY" playback={p} legend={topoStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Single area OSPF topology with three routers and three LANs in area 0">
    <Box x={400} y={40} w={120} h={60} title="LAN 1" sub=".1.0/24" color="#38bdf8" active />
    <Box x={400} y={140} w={120} h={70} title="R1" sub="Area 0" color="#f59e0b" active />
    <Box x={180} y={260} w={120} h={70} title="R2" sub="LAN 2" color="#f59e0b" active={s>=1} />
    <Box x={620} y={260} w={120} h={70} title="R3" sub="LAN 3" color="#f59e0b" active={s>=1} />
    <LinkLine x1={460} y1={100} x2={460} y2={140} color="#38bdf8" active />
    <LinkLine x1={430} y1={210} x2={270} y2={260} color="#94a3b8" active={s>=1} />
    <LinkLine x1={490} y1={210} x2={650} y2={260} color="#94a3b8" active={s>=1} />
    <LinkLine x1={300} y1={295} x2={620} y2={295} color="#94a3b8" active={s>=1} />
  </svg></StepShell>
}

const configStages = ['Set interface IPs and bring them up.', 'Create OSPF process and router-id.', 'Advertise networks with network statements or interface config.', 'Use passive-interface on LAN-facing interfaces as needed.', 'Verify neighbors, routes, and OSPF database.']
export function OspfConfigurationFlowDiagram() {
  const p = useStepPlayback(configStages.length); const s = p.stage
  const labels = ['IPs/Up','router ospf','network/area','passive-intf','verify']
  return <StepShell title="OSPF CONFIGURATION FLOW" playback={p} legend={configStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="OSPF configuration flow from interface setup to verification">
    {labels.map((t,i)=><g key={t} opacity={s>=i?1:0.35}><rect x={40+i*175} y={170} width={150} height={75} rx="10" fill="#0b1224" stroke={s===i?'#34d399':'#475569'} strokeWidth={s===i?2.2:1}/><SvgText x={115+i*175} y={212} color={s===i?'#34d399':'#cbd5e1'} size={9} bold>{t}</SvgText></g>)}
    {[0,1,2,3].map(i=><LinkLine key={i} x1={190+i*175} y1={207} x2={215+i*175} y2={207} color="#34d399" active={s>i} />)}
  </svg></StepShell>
}

const tshootStages = ['Check neighbor state: is it Full or stuck?', 'Verify timers, area, RID, network type, auth.', 'Check interfaces, network statements, passive-interface.', 'Inspect OSPF routes and cost/path selection.', 'Fix mismatch and re-verify with show commands and ping.']
export function OspfTroubleshootingFlowDiagram() {
  const p = useStepPlayback(tshootStages.length); const s = p.stage
  const labels = ['Neighbor State','Match Params','Interfaces/Config','Routes/Cost','Fix & Verify']
  return <StepShell title="OSPF TROUBLESHOOTING FLOW" playback={p} legend={tshootStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="OSPF troubleshooting flow for neighbor route and configuration issues">
    {labels.map((t,i)=><g key={t} opacity={s>=i?1:0.35}><rect x={40+i*175} y={170} width={150} height={75} rx="10" fill="#0b1224" stroke={s===i?'#f59e0b':'#475569'} strokeWidth={s===i?2.2:1}/><SvgText x={115+i*175} y={212} color={s===i?'#f59e0b':'#cbd5e1'} size={9} bold>{t}</SvgText></g>)}
    {[0,1,2,3].map(i=><LinkLine key={i} x1={190+i*175} y1={207} x2={215+i*175} y2={207} color="#f59e0b" active={s>i} />)}
  </svg></StepShell>
}