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

const failStages = ['PC uses R1 as default gateway.', 'R1 fails or loses connectivity.', 'PC still points to the same dead gateway.', 'Traffic to remote networks fails.', 'Single gateway = single point of failure.']
export function SingleGatewayFailureDiagram() {
  const p = useStepPlayback(failStages.length); const s = p.stage
  return <StepShell title="SINGLE GATEWAY FAILURE" playback={p} legend={failStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Single default gateway failure causing loss of remote connectivity">
    <Box x={80} y={170} w={140} h={80} title="PC1" sub="GW 192.168.1.1" color="#38bdf8" active />
    <Box x={390} y={170} w={140} h={80} title="R1" sub={s>=1 ? 'FAILED' : 'Gateway'} color={s>=1 ? '#fb7185' : '#34d399'} active />
    <Box x={700} y={170} w={140} h={80} title="Internet" sub="Remote" color="#94a3b8" active={s<2} />
    <LinkLine x1={220} y1={210} x2={390} y2={210} color="#38bdf8" active={s<2} />
    <LinkLine x1={530} y1={210} x2={700} y2={210} color={s>=1 ? '#fb7185' : '#34d399'} active={s<2} />
    {s>=3 && <Badge x={330} y={300} text="Remote traffic fails" color="#fb7185" active w={260} />}
  </svg></StepShell>
}

const redStages = ['Add a second router for redundancy.', 'Two physical routers alone are not enough for hosts.', 'FHRP creates one virtual gateway shared by routers.', 'Hosts keep one default gateway IP.', 'If active fails, standby takes over.']
export function GatewayRedundancyConceptDiagram() {
  const p = useStepPlayback(redStages.length); const s = p.stage
  return <StepShell title="GATEWAY REDUNDANCY CONCEPT" playback={p} legend={redStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Gateway redundancy concept using two routers and one virtual gateway">
    <Box x={390} y={60} w={140} h={70} title="R1" sub="Physical" color="#38bdf8" active={s>=0} />
    <Box x={390} y={290} w={140} h={70} title="R2" sub="Physical" color="#38bdf8" active={s>=0} />
    <Box x={80} y={170} w={140} h={80} title="PC1" sub="GW 192.168.1.1" color="#34d399" active />
    <Box x={700} y={170} w={140} h={80} title="Internet" sub="Remote" color="#94a3b8" active />
    {s>=2 && <Badge x={380} y={190} text="Virtual IP 192.168.1.1" color="#f59e0b" active w={180} />}
    <LinkLine x1={220} y1={210} x2={390} y2={95} color="#94a3b8" active={s>=1} />
    <LinkLine x1={220} y1={210} x2={390} y2={325} color="#94a3b8" active={s>=1} />
  </svg></StepShell>
}

const vipStages = ['Each router has its own physical IP address.', 'FHRP group creates a shared virtual IP.', 'Hosts configure virtual IP as default gateway.', 'Active router answers/forwards for virtual IP.', 'Physical IPs are used for management and protocol operation.']
export function PhysicalVsVirtualIpDiagram() {
  const p = useStepPlayback(vipStages.length); const s = p.stage
  return <StepShell title="PHYSICAL vs VIRTUAL IP" playback={p} legend={vipStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Physical IP addresses versus shared virtual IP in FHRP">
    <Box x={120} y={120} w={220} h={90} title="R1 Physical" sub="192.168.1.2" color="#38bdf8" active={s>=0} />
    <Box x={580} y={120} w={220} h={90} title="R2 Physical" sub="192.168.1.3" color="#38bdf8" active={s>=0} />
    <Box x={350} y={260} w={220} h={90} title="Virtual Gateway" sub="192.168.1.1" color="#f59e0b" active={s>=1} />
    {s>=2 && <Badge x={360} y={360} text="PC default gateway = 192.168.1.1" color="#34d399" active w={240} />}
  </svg></StepShell>
}

const vmacStages = ['Virtual IP needs a MAC address on LAN.', 'FHRP provides a virtual MAC associated with the virtual gateway.', 'Active/Master router responds for that virtual identity.', 'On failover, new active device takes over forwarding role.', 'Switch MAC table/ARP behavior is updated as needed.']
export function VirtualMacAddressDiagram() {
  const p = useStepPlayback(vmacStages.length); const s = p.stage
  return <StepShell title="VIRTUAL MAC ADDRESS" playback={p} legend={vmacStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Virtual MAC address used by FHRP virtual gateway">
    <Box x={140} y={160} w={180} h={90} title="PC1 ARP" sub="Who has 192.168.1.1?" color="#38bdf8" active />
    <Box x={560} y={160} w={220} h={90} title="Virtual Gateway" sub="VIP + Virtual MAC" color="#f59e0b" active={s>=1} />
    <LinkLine x1={320} y1={205} x2={560} y2={205} color="#f59e0b" active={s>=1} />
    {s>=2 && <Badge x={330} y={290} text="Active router answers for virtual identity" color="#34d399" active w={300} />}
  </svg></StepShell>
}

const opStages = ['Hosts send traffic to virtual IP default gateway.', 'Routers in FHRP group exchange hello/advertisement messages.', 'One router is Active/Master; another Standby/Backup.', 'Active forwards traffic.', 'On failure, backup takes over and hosts keep same gateway.']
export function FhrpOperationDiagram() {
  const p = useStepPlayback(opStages.length); const s = p.stage
  return <StepShell title="FHRP OPERATION" playback={p} legend={opStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="FHRP operation with active standby and failover">
    <Box x={70} y={170} w={120} h={80} title="PC1" sub="GW VIP" color="#38bdf8" active />
    <Box x={360} y={80} w={150} h={80} title="R1" sub={s<4 ? 'Active/Master' : 'Failed'} color={s<4 ? '#34d399' : '#fb7185'} active />
    <Box x={360} y={260} w={150} h={80} title="R2" sub={s<4 ? 'Standby/Backup' : 'Active/Master'} color={s<4 ? '#94a3b8' : '#34d399'} active />
    <Box x={700} y={170} w={140} h={80} title="Remote" sub="Network" color="#94a3b8" active />
    <LinkLine x1={190} y1={210} x2={360} y2={120} color="#34d399" active={s<4} />
    <LinkLine x1={510} y1={120} x2={700} y2={210} color="#34d399" active={s<4} />
    <LinkLine x1={190} y1={210} x2={360} y2={300} color="#34d399" active={s>=4} />
    <LinkLine x1={510} y1={300} x2={700} y2={210} color="#34d399" active={s>=4} />
  </svg></StepShell>
}

const hsrpRolesStages = ['R1 and R2 in same HSRP group share VIP 192.168.1.1.', 'R1 has higher priority (110) and becomes Active.', 'R2 becomes Standby.', 'PC sends traffic to VIP; Active router forwards.', 'If Active fails, Standby can become Active.']
export function HsrpActiveStandbyDiagram() {
  const p = useStepPlayback(hsrpRolesStages.length); const s = p.stage
  return <StepShell title="HSRP ACTIVE/STANDBY" playback={p} legend={hsrpRolesStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="HSRP active and standby roles with virtual IP">
    <Box x={110} y={90} w={220} h={90} title="R1" sub="Priority 110 - Active" color="#34d399" active={s<4} />
    <Box x={590} y={90} w={220} h={90} title="R2" sub="Priority 100 - Standby" color={s<4 ? '#94a3b8' : '#34d399'} active />
    <Badge x={380} y={220} text="VIP 192.168.1.1 / Group 10" color="#f59e0b" active w={200} />
    <Box x={390} y={290} w={140} h={70} title="PC1" sub="GW .1" color="#38bdf8" active />
  </svg></StepShell>
}

const hsrpStates = ['Initial: interface/group starts.', 'Learn: waiting to hear VIP/hellos.', 'Listen: knows VIP, not Active/Standby.', 'Speak: sends hellos and participates in election.', 'Standby/Active: standby ready, active forwards traffic.']
export function HsrpStateMachineDiagram() {
  const p = useStepPlayback(hsrpStates.length); const s = p.stage
  const states = ['Initial','Learn','Listen','Speak','Standby','Active']
  return <StepShell title="HSRP STATE MACHINE" playback={p} legend={hsrpStates[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="HSRP state machine progression">
    {states.map((t,i)=><g key={t} opacity={s>=Math.min(i,4)?1:0.35}><rect x={20+i*145} y={170} width={125} height={70} rx="10" fill="#0b1224" stroke={i===5 && s===4?'#34d399':'#38bdf8'} strokeWidth={1.7}/><SvgText x={82+i*145} y={210} color="#cbd5e1" size={9} bold>{t}</SvgText></g>)}
  </svg></StepShell>
}

const helloHoldStages = ['Active router sends HSRP hello messages.', 'Standby listens and tracks hellos.', 'Hold time defines how long to wait before declaring failure.', 'If hellos stop and hold expires, standby can become active.', 'Timers affect failover detection speed.']
export function HsrpHelloHoldTimersDiagram() {
  const p = useStepPlayback(helloHoldStages.length); const s = p.stage
  return <StepShell title="HSRP HELLO & HOLD TIMERS" playback={p} legend={helloHoldStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="HSRP hello and hold timers for failover detection">
    <Box x={120} y={160} w={180} h={90} title="R1 Active" sub="sends hellos" color="#34d399" active={s<3} />
    <Box x={620} y={160} w={180} h={90} title="R2 Standby" sub="monitors" color={s>=4?'#34d399':'#94a3b8'} active />
    <LinkLine x1={300} y1={205} x2={620} y2={205} color={s<3?'#34d399':'#fb7185'} active />
    {s>=2 && <Badge x={370} y={270} text="Hold timer expired -> failover" color="#f59e0b" active w={220} />}
  </svg></StepShell>
}

const prioStages = ['HSRP election compares priority first.', 'Higher priority is preferred for Active role.', 'Default priority is 100.', 'Tie is resolved by higher IP address (per election rules).', 'Priority alone does not force takeover without preemption when router returns.']
export function HsrpPriorityElectionDiagram() {
  const p = useStepPlayback(prioStages.length); const s = p.stage
  return <StepShell title="HSRP PRIORITY ELECTION" playback={p} legend={prioStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="HSRP priority election with higher priority preferred">
    <Box x={160} y={140} w={220} h={90} title="R1" sub="Priority 110" color="#34d399" active={s>=1} />
    <Box x={540} y={140} w={220} h={90} title="R2" sub="Priority 100" color="#94a3b8" active />
    {s>=1 && <Badge x={360} y={280} text="R1 wins Active role" color="#34d399" active w={200} />}
  </svg></StepShell>
}

const preemptStages = ['R1 was Active but went down; R2 became Active.', 'R1 comes back online with higher priority.', 'Without preemption, R2 may remain Active.', 'With preemption enabled, R1 can reclaim Active role.', 'Preemption is explicit; priority and preemption work together.']
export function HsrpPreemptionDiagram() {
  const p = useStepPlayback(preemptStages.length); const s = p.stage
  return <StepShell title="HSRP PREEMPTION" playback={p} legend={preemptStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="HSRP preemption allowing higher priority router to reclaim active role">
    <Box x={140} y={150} w={220} h={90} title="R1" sub="Priority 110" color={s>=3 ? '#34d399' : '#94a3b8'} active />
    <Box x={560} y={150} w={220} h={90} title="R2" sub="Current Active?" color={s>=3 ? '#94a3b8' : '#34d399'} active />
    {s>=2 && <Badge x={330} y={280} text={s>=3 ? 'Preempt enabled: R1 reclaims Active' : 'No preempt: R2 may stay Active'} color={s>=3 ? '#34d399' : '#f59e0b'} active w={320} />}
  </svg></StepShell>
}

const failTimeline = ['R1 Active sends hellos.', 'R1 fails; hellos stop.', 'R2 hold timer expires.', 'R2 becomes Active and uses virtual gateway identity.', 'PCs keep same default gateway VIP.']
export function HsrpFailoverTimelineDiagram() {
  const p = useStepPlayback(failTimeline.length); const s = p.stage
  const labels = ['Hellos OK','Failure','Hold Expires','R2 Active','VIP Unchanged']
  return <StepShell title="HSRP FAILOVER TIMELINE" playback={p} legend={failTimeline[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="HSRP failover timeline from failure detection to standby becoming active">
    {labels.map((t,i)=><g key={t} opacity={s>=i?1:0.35}><rect x={40+i*175} y={170} width={150} height={75} rx="10" fill="#0b1224" stroke={s===i?'#f59e0b':'#475569'} strokeWidth={s===i?2.2:1}/><SvgText x={115+i*175} y={212} color={s===i?'#f59e0b':'#cbd5e1'} size={9} bold>{t}</SvgText></g>)}
    {[0,1,2,3].map(i=><LinkLine key={i} x1={190+i*175} y1={207} x2={215+i*175} y2={207} color="#f59e0b" active={s>i} />)}
  </svg></StepShell>
}

const trackStages = ['R1 is Active with priority 110.', 'R1 upstream/tracked interface fails.', 'Tracking decrements R1 priority (e.g., -20 => 90).', 'R2 priority 100 is now higher.', 'With proper conditions/preemption, R2 can become Active.']
export function InterfaceTrackingDiagram() {
  const p = useStepPlayback(trackStages.length); const s = p.stage
  return <StepShell title="HSRP INTERFACE TRACKING" playback={p} legend={trackStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="HSRP interface tracking reducing priority after tracked interface failure">
    <Box x={120} y={120} w={240} h={90} title="R1 Active" sub={s>=2 ? 'Priority 90' : 'Priority 110'} color={s>=4 ? '#94a3b8' : '#34d399'} active />
    <Box x={560} y={120} w={240} h={90} title="R2 Standby" sub="Priority 100" color={s>=4 ? '#34d399' : '#94a3b8'} active />
    {s>=1 && <Badge x={170} y={250} text="Tracked interface fails" color="#fb7185" active w={200} />}
    {s>=2 && <Badge x={170} y={290} text="standby 10 track 1 decrement 20" color="#f59e0b" active w={260} />}
  </svg></StepShell>
}

const vrrpStages = ['VRRP uses Master and Backup roles.', 'Virtual router has virtual IP shared by group.', 'Higher priority preferred; default 100.', 'Master sends advertisements; backups monitor.', 'If master fails, backup takes over.']
export function VrrpMasterBackupDiagram() {
  const p = useStepPlayback(vrrpStages.length); const s = p.stage
  return <StepShell title="VRRP MASTER/BACKUP" playback={p} legend={vrrpStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="VRRP master and backup roles with virtual router IP">
    <Box x={130} y={120} w={220} h={90} title="R1 Master" sub="Priority 120" color="#34d399" active={s<4} />
    <Box x={570} y={120} w={220} h={90} title="R2 Backup" sub="Priority 100" color={s<4 ? '#94a3b8' : '#34d399'} active />
    <Badge x={360} y={260} text="VRRP VIP 192.168.1.1" color="#f59e0b" active w={220} />
  </svg></StepShell>
}

const cmpStages = ['HSRP is Cisco-developed; VRRP is open standard.', 'HSRP uses Active/Standby; VRRP uses Master/Backup.', 'HSRP hellos use UDP 1985, multicast 224.0.0.2.', 'VRRP uses IP protocol 112, multicast 224.0.0.18.', 'Both provide virtual gateway failover; config/terms differ.']
export function HsrpVsVrrpComparisonDiagram() {
  const p = useStepPlayback(cmpStages.length); const s = p.stage
  return <StepShell title="HSRP vs VRRP COMPARISON" playback={p} legend={cmpStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Comparison between HSRP and VRRP roles and protocol characteristics">
    <Box x={90} y={90} w={330} h={240} title="HSRP" sub="Cisco" color="#38bdf8" active={s<=2||s===4} />
    <Box x={500} y={90} w={330} h={240} title="VRRP" sub="Open Standard" color="#34d399" active={s===0||s>=1} />
    <SvgText x={255} y={170} color="#cbd5e1" size={9}>Active / Standby</SvgText>
    <SvgText x={255} y={195} color="#cbd5e1" size={9}>UDP 1985, 224.0.0.2</SvgText>
    <SvgText x={665} y={170} color="#cbd5e1" size={9}>Master / Backup</SvgText>
    <SvgText x={665} y={195} color="#cbd5e1" size={9}>IP 112, 224.0.0.18</SvgText>
  </svg></StepShell>
}

const completeStages = ['Two routers connect to same LAN with hosts.', 'FHRP group provides VIP as default gateway.', 'Active/Master forwards normal traffic.', 'Failure triggers failover to standby/backup.', 'Hosts keep same gateway; connectivity continues.']
export function CompleteGatewayRedundancyTopologyDiagram() {
  const p = useStepPlayback(completeStages.length); const s = p.stage
  return <StepShell title="COMPLETE GATEWAY REDUNDANCY TOPOLOGY" playback={p} legend={completeStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Complete gateway redundancy topology with FHRP virtual IP failover">
    <Box x={70} y={170} w={120} h={80} title="PC1" sub="GW VIP" color="#38bdf8" active />
    <Box x={360} y={70} w={160} h={80} title="R1" sub={s<3?'Active/Master':'Standby/Backup'} color={s<3?'#34d399':'#94a3b8'} active />
    <Box x={360} y={270} w={160} h={80} title="R2" sub={s<3?'Standby/Backup':'Active/Master'} color={s<3?'#94a3b8':'#34d399'} active />
    <Box x={730} y={170} w={120} h={80} title="Remote" sub="Network" color="#94a3b8" active />
    <LinkLine x1={190} y1={210} x2={360} y2={110} color="#34d399" active={s<3} />
    <LinkLine x1={520} y1={110} x2={730} y2={210} color="#34d399" active={s<3} />
    <LinkLine x1={190} y1={210} x2={360} y2={310} color="#34d399" active={s>=3} />
    <LinkLine x1={520} y1={310} x2={730} y2={210} color="#34d399" active={s>=3} />
    <Badge x={380} y={200} text="VIP 192.168.1.1" color="#f59e0b" active w={140} />
  </svg></StepShell>
}