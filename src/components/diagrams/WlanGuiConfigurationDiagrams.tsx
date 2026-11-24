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
function Panel({ x, y, w, h, title, lines, color = '#38bdf8', active = true }: { x: number; y: number; w: number; h: number; title: string; lines: string[]; color?: string; active?: boolean }) {
  return <g opacity={active ? 1 : 0.5}><rect x={x} y={y} width={w} height={h} rx="11" fill="#0b1224" stroke={color} strokeWidth={active ? 1.9 : 1} /><SvgText x={x + 14} y={y + 19} color={color} size={9.3} bold anchor="start">{title}</SvgText>{lines.map((line, i) => <SvgText key={i} x={x + 14} y={y + 36 + i * 14} color="#cbd5e1" size={8.5} anchor="start">{line}</SvgText>)}</g>
}

const archStages = ['المسؤول يهيئ WLC عبر GUI.', 'WLC ينشئ WLAN/SSID ويربطه بـ VLAN.', 'AP يبث SSID للعملاء.', 'العميل يرتبط ويتحقق بـ WPA2-PSK.', 'حركة العميل تدخل الشبكة السلكية عبر VLAN المعين.']
export function EnterpriseWlanArchitectureDiagram() {
  const p = useStepPlayback(archStages.length); const s = p.stage
  return <StepShell title="ENTERPRISE WLAN ARCHITECTURE" playback={p} legend={archStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Enterprise WLAN architecture showing admin configuring WLC, AP broadcasting SSID, client associating, and traffic mapped to VLAN">
    <Device x={30} y={150} w={140} h={90} title="ADMIN" sub="WLC GUI" color="#38bdf8" active={s>=0} />
    <Device x={230} y={150} w={150} h={90} title="WLC" sub="WLAN config" color="#f59e0b" active={s>=1} />
    <Device x={450} y={150} w={140} h={90} title="AP" sub="broadcast SSID" color="#34d399" active={s>=2} />
    <Device x={660} y={150} w={140} h={90} title="CLIENT" sub="802.11" color="#a78bfa" active={s>=3} />
    <Device x={450} y={300} w={180} h={80} title="WIRED LAN" sub="VLAN 10/20/30" color="#94a3b8" active={s>=4} />
    <LinkLine x1={170} y1={195} x2={230} y2={195} color="#38bdf8" active={s>=0} />
    <LinkLine x1={380} y1={195} x2={450} y2={195} color="#f59e0b" active={s>=1} />
    <LinkLine x1={590} y1={195} x2={660} y2={195} color="#34d399" active={s>=2} />
    <LinkLine x1={520} y1={240} x2={520} y2={300} color="#94a3b8" active={s>=4} />
    {s>=1 && <Packet point={{x:305,y:190}} color="#38bdf8" label="CFG" />}
    {s>=3 && <Packet point={{x:625,y:190}} color="#a78bfa" label="PSK" />}
    {s>=4 && <Packet point={{x:525,y:270}} color="#34d399" label="VLAN" />}
  </svg></StepShell>
}

const guiFlowStages = ['المسؤول يتصل بشبكة الإدارة ويفتح HTTPS إلى WLC.', 'يسجل الدخول ببيانات المدير.', 'ينتقل لقسم WLANs وينشئ WLAN جديد.', 'يضبط SSID وVLAN/security ثم يطبق.', 'يتحقق من الحالة والبث والعميل.']
export function WlcGuiConfigurationWorkflowDiagram() {
  const p = useStepPlayback(guiFlowStages.length); const s = p.stage
  return <StepShell title="WLC GUI CONFIGURATION WORKFLOW" playback={p} legend={guiFlowStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="WLC GUI workflow from HTTPS login to WLAN creation mapping security apply and verification">
    {['HTTPS Login','Open WLANs','Create WLAN','Map + Security','Apply/Verify'].map((t,i)=><g key={t} opacity={s>=i?1:0.4}><rect x={40+i*175} y={150} width={145} height={90} rx="11" fill="#0b1224" stroke={s===i?'#38bdf8':'#475569'} strokeWidth={s===i?2.2:1}/><SvgText x={112+i*175} y={185} color={s===i?'#38bdf8':'#cbd5e1'} size={9.5} bold>{t}</SvgText><SvgText x={112+i*175} y={205} color="#94a3b8" size={8}>{`Step ${i+1}`}</SvgText></g>)}
    {[0,1,2,3].map(i=><LinkLine key={i} x1={185+i*175} y1={195} x2={215+i*175} y2={195} color="#38bdf8" active={s>i} />)}
    <Badge x={320} y={290} text="AIREOS/9800 MENUS MAY DIFFER" color="#f59e0b" active w={280} />
  </svg></StepShell>
}

const profileStages = ['WLAN Profile Name هو اسم داخلي في WLC.', 'SSID هو الاسم الذي يراه المستخدم اللاسلكي.', 'يمكن أن يتشابها، لكنهما ليسا نفس الحقل دائماً.', 'الـ VLAN mapping مرتبط بالـ WLAN profile/interface.', 'خطأ التسمية يسبب ارتباكاً أثناء troubleshooting.']
export function WlanProfileVsSsidDiagram() {
  const p = useStepPlayback(profileStages.length); const s = p.stage
  return <StepShell title="WLAN PROFILE vs SSID" playback={p} legend={profileStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Difference between WLAN profile name internal controller object and SSID broadcast to wireless users">
    <Panel x={70} y={110} w={320} h={180} title="WLC INTERNAL" lines={["WLAN Profile Name: Company-Staff","WLAN ID: 10","Interface/VLAN: 10","Security: WPA2-PSK"]} color="#f59e0b" active={s!==1} />
    <Panel x={530} y={110} w={320} h={180} title="USER SEES" lines={["SSID: Company-Staff","Visible in Wi-Fi list","Client selects this name","Passphrase required"]} color="#38bdf8" active={s>=1} />
    <LinkLine x1={390} y1={200} x2={530} y2={200} color="#a78bfa" active={s>=2} />
    {s>=2 && <Badge x={395} y={230} text="RELATED BUT DIFFERENT" color="#a78bfa" active w={130} />}
  </svg></StepShell>
}

const mapStages = ['WLAN Company-Staff يُنشأ على WLC.', 'يُربط بـ VLAN 10 أو interface منطقي مناسب.', 'العميل بعد الارتباط يحصل على حركة داخل VLAN 10.', 'DHCP وgateway يجب أن يكونا صحيحين في VLAN 10.', 'إنشاء mapping في WLC لا ينشئ VLAN على السويتشات تلقائياً.']
export function WlanToVlanMappingDiagram() {
  const p = useStepPlayback(mapStages.length); const s = p.stage
  return <StepShell title="WLAN TO VLAN MAPPING" playback={p} legend={mapStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="WLAN mapped to VLAN 10 with client traffic entering wired network through mapped VLAN">
    <Device x={60} y={150} w={160} h={95} title="SSID" sub="Company-Staff" color="#38bdf8" active />
    <Device x={300} y={150} w={160} h={95} title="WLC WLAN" sub="Profile mapped" color="#f59e0b" active={s>=1} />
    <Device x={540} y={150} w={160} h={95} title="VLAN 10" sub="wired segment" color="#34d399" active={s>=1} />
    <Device x={760} y={150} w={120} h={95} title="DHCP/GW" sub="10.10.10.0/24" color="#a78bfa" active={s>=3} />
    <LinkLine x1={220} y1={197} x2={300} y2={197} color="#38bdf8" active={s>=1} /><LinkLine x1={460} y1={197} x2={540} y2={197} color="#f59e0b" active={s>=1} /><LinkLine x1={700} y1={197} x2={760} y2={197} color="#34d399" active={s>=3} />
    {s>=4 && <Badge x={250} y={290} text="SWITCHES MUST ALSO SUPPORT VLAN 10" color="#fb7185" active w={420} />}
  </svg></StepShell>
}

const multiStages = ['Company-Staff يربط بـ VLAN 10.', 'Company-Guest يربط بـ VLAN 20.', 'Company-IT يربط بـ VLAN 30.', 'كل SSID يضع العميل في شريحة شبكة مختلفة.', 'Trunk/allowed VLANs يجب أن تدعم كل VLANs المطلوبة.']
export function MultipleWlansVlansDiagram() {
  const p = useStepPlayback(multiStages.length); const s = p.stage
  const rows = [['Company-Staff','VLAN 10','#38bdf8'],['Company-Guest','VLAN 20','#34d399'],['Company-IT','VLAN 30','#a78bfa']]
  return <StepShell title="MULTIPLE WLANs AND VLANs" playback={p} legend={multiStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Multiple SSIDs mapped to different VLANs for staff guest and IT segmentation">
    <Device x={60} y={120} w={220} h={190} title="WLC / AP" sub="multiple SSIDs" color="#f59e0b" active />
    {rows.map((r,i)=><g key={r[0]}><Badge x={85} y={175+i*40} text={r[0]} color={r[2]} active={s>=i} w={170} /><Badge x={560} y={175+i*40} text={r[1]} color={r[2]} active={s>=i} w={170} /><LinkLine x1={255} y1={187+i*40} x2={560} y2={187+i*40} color={r[2]} active={s>=i} /></g>)}
    {s>=4 && <Badge x={300} y={340} text="TRUNK MUST ALLOW 10,20,30" color="#fb7185" active w={320} />}
  </svg></StepShell>
}

const wpaStages = ['WPA2-Personal يستخدم PSK مشترك.', 'AES-CCMP يوفر تشفيراً لإطارات البيانات.', 'العميل يجب أن يدعم نفس إعدادات الأمان.', 'PSK خاطئ = فشل authentication.', 'PSK مناسب للبيئات الصغيرة؛ Enterprise أفضل للهويات الفردية.']
export function Wpa2PskSecurityArchitectureDiagram() {
  const p = useStepPlayback(wpaStages.length); const s = p.stage
  return <StepShell title="WPA2-PSK SECURITY ARCHITECTURE" playback={p} legend={wpaStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="WPA2 personal PSK architecture showing shared passphrase and AES CCMP encrypted communication">
    <Device x={70} y={150} w={170} h={100} title="CLIENT" sub="enters PSK" color="#38bdf8" active />
    <Device x={370} y={150} w={170} h={100} title="AP/WLC WLAN" sub="WPA2-Personal" color="#f59e0b" active />
    <Device x={670} y={150} w={170} h={100} title="WIRED LAN" sub="mapped VLAN" color="#34d399" active={s>=4} />
    <LinkLine x1={240} y1={200} x2={370} y2={200} color={s===3?'#fb7185':'#38bdf8'} active />
    <LinkLine x1={540} y1={200} x2={670} y2={200} color="#34d399" active={s>=4} />
    <Badge x={255} y={240} text={s===3?'WRONG PSK = FAIL':'SHARED PSK'} color={s===3?'#fb7185':'#38bdf8'} active w={130} />
    <Badge x={390} y={280} text="AES-CCMP ENCRYPTION" color="#a78bfa" active={s>=1} w={170} />
  </svg></StepShell>
}

const authFlowStages = ['العميل يكتشف SSID ويطلب الارتباط.', 'تتم مصادقة WPA2-PSK وتأسيس المفاتيح.', 'نجاح المصادقة لا يعني IP جاهز.', 'بعد النجاح يبدأ association/data protection.', 'ثم DHCP يعطي IP configuration.']
export function Wpa2AuthenticationFlowDiagram() {
  const p = useStepPlayback(authFlowStages.length); const s = p.stage
  return <StepShell title="WPA2 AUTHENTICATION FLOW" playback={p} legend={authFlowStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="WPA2 PSK authentication flow from SSID selection to key establishment and association">
    {['Select SSID','PSK Auth','Key Setup','Associated','DHCP'].map((t,i)=><g key={t} opacity={s>=i?1:0.4}><rect x={45+i*175} y={155} width={140} height={80} rx="10" fill="#0b1224" stroke={s===i?'#34d399':'#475569'} strokeWidth={s===i?2.2:1}/><SvgText x={115+i*175} y={190} color={s===i?'#34d399':'#cbd5e1'} size={9} bold>{t}</SvgText></g>)}
    {[0,1,2,3].map(i=><LinkLine key={i} x1={185+i*175} y1={195} x2={220+i*175} y2={195} color="#34d399" active={s>i} />)}
    {s>=1 && <Badge x={350} y={280} text="AUTH != IP CONNECTIVITY" color="#f59e0b" active w={220} />}
  </svg></StepShell>
}

const discoveryStages = ['العميل يمسح قنوات الراديو.', 'APs تبث Beacons/تستجيب لـ Probe.', 'العميل يرى SSID Company-Staff.', 'يختار SSID المناسب.', 'لو WLAN معطل أو غير مبثوث لن يظهر كما هو متوقع.']
export function WirelessClientSsidDiscoveryDiagram() {
  const p = useStepPlayback(discoveryStages.length); const s = p.stage
  return <StepShell title="WIRELESS CLIENT SSID DISCOVERY" playback={p} legend={discoveryStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Client scanning radio channels discovering broadcast SSID from access point">
    <Device x={80} y={150} w={170} h={100} title="CLIENT" sub="Wi-Fi scan" color="#38bdf8" active />
    <Device x={650} y={110} w={160} h={90} title="AP 1" sub="Company-Staff" color="#34d399" active={s>=1} />
    <Device x={650} y={240} w={160} h={90} title="AP 2" sub="Other SSIDs" color="#94a3b8" active={s>=1} />
    <LinkLine x1={250} y1={185} x2={650} y2={155} color="#38bdf8" active={s>=1} />
    <LinkLine x1={250} y1={215} x2={650} y2={285} color="#94a3b8" active={s>=1} />
    {s>=2 && <Badge x={330} y={120} text="SSID DISCOVERED" color="#34d399" active w={180} />}
  </svg></StepShell>
}

const assocStages = ['العميل يختار SSID.', 'يرسل طلب association/authentication.', 'AP/WLC يتحققان من إعدادات الأمان.', 'عند النجاح يصبح العميل Associated.', 'بعدها يحتاج DHCP وrouting للوصول للشبكة.']
export function WirelessClientAssociationDiagram() {
  const p = useStepPlayback(assocStages.length); const s = p.stage
  return <StepShell title="WIRELESS CLIENT ASSOCIATION" playback={p} legend={assocStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Wireless client association process with access point and WLC after security checks">
    <Device x={60} y={160} w={160} h={95} title="CLIENT" sub="supplicant" color="#38bdf8" active />
    <Device x={360} y={160} w={160} h={95} title="AP" sub="radio edge" color="#34d399" active={s>=1} />
    <Device x={660} y={160} w={160} h={95} title="WLC" sub="policy" color="#f59e0b" active={s>=2} />
    <LinkLine x1={220} y1={207} x2={360} y2={207} color="#38bdf8" active={s>=1} /><LinkLine x1={520} y1={207} x2={660} y2={207} color="#34d399" active={s>=2} />
    {s>=3 && <Badge x={380} y={290} text="ASSOCIATED / AUTHENTICATED" color="#34d399" active w={240} />}
  </svg></StepShell>
}

const dhcpStages = ['العميل مرتبط بالـ SSID لكنه بلا IP بعد.', 'يرسل DHCP Discover داخل VLAN المعين.', 'DHCP Server يرد بـ Offer/Ack.', 'العميل يحصل على IP/Gateway/DNS.', 'لو DHCP أو VLAN خاطئ، الاتصال اللاسلكي قد ينجح لكن الشبكة تفشل.']
export function DhcpAfterAssociationDiagram() {
  const p = useStepPlayback(dhcpStages.length); const s = p.stage
  return <StepShell title="DHCP AFTER SUCCESSFUL ASSOCIATION" playback={p} legend={dhcpStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="After wireless association client obtains IP address from DHCP through mapped VLAN">
    <Device x={50} y={160} w={150} h={95} title="CLIENT" sub="associated" color="#38bdf8" active />
    <Device x={280} y={160} w={140} h={95} title="AP/WLC" sub="forwarding" color="#f59e0b" active={s>=1} />
    <Device x={500} y={160} w={140} h={95} title="VLAN 10" sub="L2 segment" color="#34d399" active={s>=1} />
    <Device x={720} y={160} w={150} h={95} title="DHCP SERVER" sub="offers IP" color="#a78bfa" active={s>=2} />
    <LinkLine x1={200} y1={207} x2={280} y2={207} color="#38bdf8" active={s>=1} /><LinkLine x1={420} y1={207} x2={500} y2={207} color="#f59e0b" active={s>=1} /><LinkLine x1={640} y1={207} x2={720} y2={207} color="#34d399" active={s>=2} />
    {s>=3 && <Badge x={330} y={290} text="IP / MASK / GW / DNS" color="#34d399" active w={260} />}
    {s>=4 && <Badge x={330} y={325} text="AUTH OK != NETWORK OK" color="#fb7185" active w={260} />}
  </svg></StepShell>
}

const trafficStages = ['العميل يرسل بيانات مشفرة عبر RF.', 'AP يستقبلها ويحولها للشبكة السلكية.', 'WLC/switch path يمررها حسب التصميم المركزي/المحلي.', 'الحركة تخرج إلى VLAN المعين ثم إلى الوجهة.', 'المشكلة قد تكون في WLAN أو VLAN أو DHCP أو routing.']
export function WirelessClientTrafficThroughWlcDiagram() {
  const p = useStepPlayback(trafficStages.length); const s = p.stage
  return <StepShell title="WIRELESS CLIENT TRAFFIC THROUGH THE WLC" playback={p} legend={trafficStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Client traffic flowing from wireless client through AP and WLC architecture into mapped wired VLAN">
    <Device x={40} y={160} w={140} h={95} title="CLIENT" sub="Wi-Fi data" color="#38bdf8" active />
    <Device x={240} y={160} w={140} h={95} title="AP" sub="802.11->Ethernet" color="#34d399" active={s>=1} />
    <Device x={440} y={160} w={150} h={95} title="WLC/SW PATH" sub="platform dependent" color="#f59e0b" active={s>=2} />
    <Device x={660} y={160} w={140} h={95} title="VLAN/LAN" sub="wired network" color="#a78bfa" active={s>=3} />
    <LinkLine x1={180} y1={207} x2={240} y2={207} color="#38bdf8" active={s>=1} /><LinkLine x1={380} y1={207} x2={440} y2={207} color="#34d399" active={s>=2} /><LinkLine x1={590} y1={207} x2={660} y2={207} color="#f59e0b" active={s>=3} />
    {s>=1 && <Packet point={{x:210,y:202}} color="#38bdf8" label="DATA" />}
  </svg></StepShell>
}

const completeStages = ['Create WLAN profile/SSID.', 'Map to VLAN/interface and set security.', 'Apply/save and verify WLAN enabled.', 'Verify AP broadcast and client association.', 'Verify DHCP, gateway, and end-to-end connectivity.']
export function CompleteWlanConfigVerificationWorkflowDiagram() {
  const p = useStepPlayback(completeStages.length); const s = p.stage
  return <StepShell title="COMPLETE WLAN CONFIGURATION AND VERIFICATION WORKFLOW" playback={p} legend={completeStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Complete WLAN configuration and verification workflow from creation to DHCP and end-to-end connectivity">
    {['Create','Secure/Map','Apply','Associate','DHCP/Test'].map((t,i)=><g key={t} opacity={s>=i?1:0.4}><rect x={35+i*175} y={150} width={145} height={90} rx="11" fill="#0b1224" stroke={s===i?'#34d399':'#475569'} strokeWidth={s===i?2.2:1}/><SvgText x={107+i*175} y={190} color={s===i?'#34d399':'#cbd5e1'} size={9.5} bold>{t}</SvgText></g>)}
    {[0,1,2,3].map(i=><LinkLine key={i} x1={180+i*175} y1={195} x2={210+i*175} y2={195} color="#34d399" active={s>i} />)}
  </svg></StepShell>
}

const failureStages = ['WLAN disabled أو SSID غير ظاهر.', 'PSK خاطئ أو security mismatch.', 'WLAN مربوط بـ VLAN خاطئ.', 'VLAN مفقود على trunk أو DHCP غير متاح.', 'Authentication نجحت لكن لا يوجد Internet بسبب gateway/DNS/routing.']
export function CommonWlanConfigurationFailuresDiagram() {
  const p = useStepPlayback(failureStages.length); const s = p.stage
  const items = ['WLAN disabled','Wrong PSK / security','Wrong VLAN mapping','Missing VLAN / DHCP','Auth OK but no route']
  return <StepShell title="COMMON WLAN CONFIGURATION FAILURES" playback={p} legend={failureStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Common WLAN configuration failures including disabled WLAN wrong PSK VLAN mismatch DHCP failure and routing issues">
    {items.map((t,i)=><g key={t} opacity={s===i?1:0.45}><rect x={80} y={65+i*62} width={760} height={45} rx="10" fill="#0b1224" stroke={s===i?'#fb7185':'#475569'} strokeWidth={s===i?2:1}/><SvgText x={110} y={92+i*62} color={s===i?'#fb7185':'#cbd5e1'} size={10} bold anchor="start">{`${i+1}. ${t}`}</SvgText></g>)}
  </svg></StepShell>
}