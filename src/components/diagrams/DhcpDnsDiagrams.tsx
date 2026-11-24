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

const dhcpConceptStages = [
  'كل جهاز يحتاج IP address, subnet mask, default gateway وDNS server ليستطيع العمل على الشبكة.',
  'الإعداد اليدوي لكل جهاز بطيء ويزيد الأخطاء خصوصاً مع أجهزة كثيرة.',
  'DHCP يوزّع IP configuration تلقائياً من DHCP server.',
  'العميل يحصل على Lease لفترة محددة ثم يجددها بشكل دوري.',
  'DHCP لا يحل محل DNS؛ يوفر network settings ومن ضمنها عنوان DNS server.',
]
export function DhcpConceptDiagram() {
  const p = useStepPlayback(dhcpConceptStages.length); const s = p.stage
  return <StepShell title="DHCP CONCEPT" playback={p} legend={dhcpConceptStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="DHCP concept providing automatic IP configuration">
    <Box x={80} y={160} w={190} h={90} title="DHCP Client" sub="No IP yet" color="#38bdf8" active />
    <Box x={650} y={160} w={190} h={90} title="DHCP Server" sub="Pool + options" color="#34d399" active />
    <LinkLine x1={270} y1={205} x2={650} y2={205} color="#f59e0b" active={s>=2} />
    {s>=2 && <Badge x={310} y={290} text="IP + Mask + Gateway + DNS + Lease" color="#f59e0b" active w={300} />}
  </svg></StepShell>
}

const rolesStages = [
  'DHCP Server يملك scope/pool يحتوي على العناوين والخيارات.',
  'DHCP Client يطلب configuration عند بدء الاتصال.',
  'الخادم يختار عنواناً متاحاً ويرسله مع options.',
  'العميل يستخدم العنوان خلال مدة الـ lease ويجددها قبل انتهائها.',
  'UDP server port 67 وclient port 68.',
]
export function DhcpClientServerDiagram() {
  const p = useStepPlayback(rolesStages.length); const s = p.stage
  return <StepShell title="DHCP CLIENT vs SERVER" playback={p} legend={rolesStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="DHCP client and server roles">
    <Box x={100} y={160} w={220} h={90} title="Client :68" sub="Requests settings" color="#38bdf8" active />
    <Box x={600} y={160} w={220} h={90} title="Server :67" sub="Provides settings" color="#34d399" active />
    <LinkLine x1={320} y1={205} x2={600} y2={205} color="#f59e0b" active />
    {s>=4 && <Badge x={350} y={280} text="UDP 67 server / UDP 68 client" color="#f59e0b" active w={260} />}
  </svg></StepShell>
}

const doraStages = [
  'Discover: عميل بلا IP يرسل broadcast لاكتشاف DHCP servers.',
  'Offer: سيرفر يعرض عنواناً متاحاً وخيارات التكوين.',
  'Request: العميل يختار عرضاً ويُخبر باقي السيرفرات.',
  'Acknowledgment: السيرفر يؤكد الـ lease.',
  'العميل يبدأ استخدام IP configuration ويجدد الـ lease لاحقاً.',
]
export function DoraProcessDiagram() {
  const p = useStepPlayback(doraStages.length); const s = p.stage
  const labels = ['Discover','Offer','Request','ACK','Use IP']
  return <StepShell title="DORA PROCESS" playback={p} legend={doraStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="DHCP DORA process animation">
    <Box x={80} y={180} w={180} h={70} title="Client" sub="00:11:22:33" color="#38bdf8" active />
    <Box x={660} y={180} w={180} h={70} title="Server" sub="192.168.1.100" color="#34d399" active />
    {labels.map((t,i)=><g key={t} opacity={s>=i?1:0.3}><rect x={300+i*75} y={100} width={65} height={40} rx="8" fill="#0b1224" stroke={s===i?'#f59e0b':'#475569'} strokeWidth={s===i?2:1}/><SvgText x={332+i*75} y={125} color={s===i?'#f59e0b':'#cbd5e1'} size={7.5} bold>{t}</SvgText></g>)}
    {s<=0 && <Badge x={330} y={300} text="Broadcast 0.0.0.0 -> 255.255.255.255" color="#f59e0b" active w={300} />}
    {s===1 && <Badge x={350} y={300} text="Offered IP 192.168.1.50" color="#34d399" active w={240} />}
    {s===2 && <Badge x={350} y={300} text="Request chosen server" color="#f59e0b" active w={220} />}
    {s>=3 && <Badge x={350} y={300} text="DHCPACK confirms lease" color="#34d399" active w={220} />}
  </svg></StepShell>
}

const discoverStages = [
  'Client لا يملك IP صالحاً بعد.',
  'Source IP غالباً 0.0.0.0.',
  'Destination IP 255.255.255.255 (limited broadcast).',
  'UDP src 68 → dst 67.',
  'Transaction ID وClient MAC يساعدان على مطابقة الردود.',
]
export function DhcpDiscoverPacketDiagram() {
  const p = useStepPlayback(discoverStages.length); const s = p.stage
  return <StepShell title="DHCP DISCOVER PACKET" playback={p} legend={discoverStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="DHCP Discover packet fields">
    <Box x={280} y={140} w={360} h={160} title="DHCP Discover" sub="Broadcast" color="#38bdf8" active />
    {discoverStages.slice(1).map((t,i)=><Badge key={t} x={310} y={170+i*26} text={t} color={s>=i+1?'#34d399':'#64748b'} active={s>=i+1} w={300} />)}
  </svg></StepShell>
}

const offerStages = [
  'Server يختار عنواناً متاحاً من scope/pool.',
  'يضع العنوان في حقل yiaddr (Your Client IP Address).',
  'يرسل Subnet mask, gateway, DNS, lease time كخيارات DHCP.',
  'قد يُرسل Offer broadcast أو unicast حسب حالة العميل والـ flags والبيئة.',
  'Transaction ID يطابقطلب الـ Discover.',
]
export function DhcpOfferPacketDiagram() {
  const p = useStepPlayback(offerStages.length); const s = p.stage
  return <StepShell title="DHCP OFFER PACKET" playback={p} legend={offerStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="DHCP Offer packet fields">
    <Box x={80} y={160} w={200} h={90} title="DHCP Server" sub="Selects IP" color="#34d399" active />
    <Box x={640} y={160} w={200} h={90} title="Client" sub="Receives offer" color="#38bdf8" active={s>=2} />
    <LinkLine x1={280} y1={205} x2={640} y2={205} color="#f59e0b" active={s>=2} />
    {s>=1 && <Badge x={300} y={280} text="yiaddr = 192.168.1.50" color="#f59e0b" active w={300} />}
  </svg></StepShell>
}

const requestStages = [
  'العميل يختار أحد العروض ويطلب استخدامه.',
  'Server Identifier يوضح أي DHCP server تم اختياره.',
  'Requested IP Address يوضح العنوان المطلوب.',
  'في initial lease غالباً تكون الرسالة broadcast لإبلاغ السيرفرات الأخرى.',
  'هذا يساعد على منع سيرفر آخر من تخصيص نفس العنوان.',
]
export function DhcpRequestPacketDiagram() {
  const p = useStepPlayback(requestStages.length); const s = p.stage
  return <StepShell title="DHCP REQUEST PACKET" playback={p} legend={requestStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="DHCP Request packet fields">
    <Box x={250} y={140} w={420} h={160} title="DHCP Request" sub="Broadcast (initial lease)" color="#f59e0b" active />
    {requestStages.slice(1,4).map((t,i)=><Badge key={t} x={280} y={170+i*30} text={t} color={s>=i+1?'#34d399':'#64748b'} active={s>=i+1} w={360} />)}
  </svg></StepShell>
}

const ackStages = [
  'Server يرسل DHCPACK لتأكيد الـ lease.',
  'العميل يستلم IP mask gateway DNS وlease time.',
  'العميل يبدأ استخدام التكوين.',
  'DHCPNAK ممكن إذا كان الطلب غير صالح أو تعارض.',
  'قبل انتهاء الـ lease يحاول العميل التجديد عند T1 ثم T2.',
]
export function DhcpAckPacketDiagram() {
  const p = useStepPlayback(ackStages.length); const s = p.stage
  return <StepShell title="DHCP ACK PACKET" playback={p} legend={ackStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="DHCP acknowledgment and lease confirmation">
    <Box x={250} y={150} w={420} h={120} title={s===3 ? 'DHCPNAK' : 'DHCPACK'} sub={s===3?'Request rejected':'Lease confirmed'} color={s===3?'#fb7185':'#34d399'} active />
    {s>=1 && <Badge x={300} y={300} text="IP: 192.168.1.50 / Lease: 86400s" color="#f59e0b" active w={300} />}
  </svg></StepShell>
}

const leaseStages = [
  'Server يمنح lease لفترة محددة (مثلاً 86400 ثانية).',
  'T1 = 50% من الlease: يحاول العميل تجديد الـ lease مع نفس السيرفر.',
  'T2 = 87.5%: يحاول مع أي سيرفر متاح إذا فشل التجديد الأول.',
  'إذا انتهى الlease بدون تجديد يجب على العميل التوقف عن استخدام العنوان.',
  'Lease time يوازن بين استقرار العناوين ومرونة إعادة الاستخدام.',
]
export function DhcpLeaseLifecycleDiagram() {
  const p = useStepPlayback(leaseStages.length); const s = p.stage
  return <StepShell title="DHCP LEASE LIFECYCLE" playback={p} legend={leaseStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="DHCP lease lifecycle with T1 and T2 renewal">
    <rect x={100} y={190} width={720} height={24} rx="12" fill="#0b1224" stroke="#475569" />
    <rect x={100} y={190} width={Math.max(60,(s+1)*140)} height={24} rx="12" fill="#34d399" opacity={0.5} />
    <Badge x={100} y={240} text="Lease granted" color="#34d399" active={s>=0} w={140} />
    <Badge x={320} y={240} text="T1 50%" color="#f59e0b" active={s>=1} w={120} />
    <Badge x={560} y={240} text="T2 87.5%" color="#fb7185" active={s>=2} w={120} />
  </svg></StepShell>
}

const fieldsStages = [
  'رسائل DHCP مبنية على BOOTP message format تعريفياً.',
  'Transaction ID يربط request وreply.',
  'Client MAC Address يحدد الجهاز.',
  'yiaddr يحمل Your Client IP Address المعروض.',
  'DHCP Options تحمل subnet mask, router, DNS, lease time وغيرها.',
]
export function DhcpPacketFieldsDiagram() {
  const p = useStepPlayback(fieldsStages.length); const s = p.stage
  const f = ['Transaction ID','Client MAC','yiaddr','Requested IP','Server ID','Lease Time','Mask/GW/DNS Options']
  return <StepShell title="DHCP PACKET FIELDS" playback={p} legend={fieldsStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="DHCP packet fields and options">
    {f.map((t,i)=><g key={t} opacity={s>=Math.min(i,4)?1:0.35}><rect x={60+(i%4)*210} y={110+Math.floor(i/4)*110} width={190} height={70} rx="10" fill="#0b1224" stroke={s===i?'#f59e0b':'#38bdf8'} strokeWidth={s===i?2.2:1}/><SvgText x={155+(i%4)*210} y={150+Math.floor(i/4)*110} color="#cbd5e1" size={8.5} bold>{t}</SvgText></g>)}
  </svg></StepShell>
}

const dnsStages = [
  'المستخدم يكتب www.example.com بدلاً من IP address.',
  'Stub resolver على الجهاز يفحص cache المحلية.',
  'يرسل query إلى DNS resolver المكوّن.',
  'Resolver يفحص cache؛ إذا لم يجد يكمل البحث في الـ hierarchy عند الحاجة.',
  'يعيد IP address للعميل الذي يتصل بالوجهة.',
]
export function DnsResolutionOverviewDiagram() {
  const p = useStepPlayback(dnsStages.length); const s = p.stage
  return <StepShell title="DNS RESOLUTION OVERVIEW" playback={p} legend={dnsStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="DNS resolution overview from name to IP">
    <Box x={60} y={170} w={180} h={80} title="Client" sub="www.example.com" color="#38bdf8" active />
    <Box x={360} y={170} w={200} h={80} title="DNS Resolver" sub={s>=2?'Cache / Query':'Configured'} color="#f59e0b" active />
    <Box x={700} y={170} w={170} h={80} title="IP Address" sub="Result" color="#34d399" active={s>=4} />
    <LinkLine x1={240} y1={210} x2={360} y2={210} color="#38bdf8" active={s>=2} />
    <LinkLine x1={560} y1={210} x2={700} y2={210} color="#34d399" active={s>=4} />
  </svg></StepShell>
}

const dnsHierarchyStages = [
  'Root DNS Servers يعرفون أين توجد TLD servers.',
  '.com TLD server يعرف authoritative servers للنطاق.',
  'Authoritative server يملك السجلات الفعلية مثل A record.',
  'المثال www.example.com يوضح المسار التقليدي عند absence of cache.',
  'ليس كل query يمر بالكامل؛ cache قد يجيب مباشرة.',
]
export function DnsHierarchyDiagram() {
  const p = useStepPlayback(dnsHierarchyStages.length); const s = p.stage
  const levels = [['Root DNS','Root'],['.com TLD','TLD'],['Authoritative','example.com'],['Name','www.example.com']]
  return <StepShell title="DNS HIERARCHY" playback={p} legend={dnsHierarchyStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="DNS hierarchy root TLD authoritative">
    {levels.map((l,i)=>{
      const w = 200+i*30; const x=(920-w)/2
      return <g key={l[0]} opacity={s>=i?1:0.3}><rect x={x} y={40+i*80} width={w} height={55} rx="10" fill="#0b1224" stroke={i===0?'#f59e0b':'#34d399'} strokeWidth={1.8}/><SvgText x={460} y={75+i*80} color="#cbd5e1" size={9} bold>{l[0]}</SvgText></g>
    })}
  </svg></StepShell>
}

const queryStages = [
  'Recursive query: العميل يطلب من resolver أن يجيب بالكامل.',
  'Resolver يتحقق من cache أولاً.',
  'Iterative query: قد يحصل resolver على referral إلى server آخر.',
  'Resolver يكرر حتى يصل إلى authoritative answer.',
  'العميل يستلم answer ولا يرى كل الخطوات الداخلية.',
]
export function RecursiveVsIterativeDiagram() {
  const p = useStepPlayback(queryStages.length); const s = p.stage
  return <StepShell title="RECURSIVE vs ITERATIVE QUERIES" playback={p} legend={queryStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Recursive versus iterative DNS queries">
    <Box x={70} y={170} w={170} h={80} title="Client" sub="Recursive ask" color="#38bdf8" active />
    <Box x={360} y={170} w={190} h={80} title="Resolver" sub="Iterative steps" color="#f59e0b" active={s>=1} />
    <Box x={700} y={170} w={170} h={80} title="DNS Servers" sub="Referrals/Answer" color="#34d399" active={s>=2} />
    <LinkLine x1={240} y1={210} x2={360} y2={210} color="#38bdf8" active />
    <LinkLine x1={550} y1={210} x2={700} y2={210} color="#34d399" active={s>=2} />
    {s>=4 && <Badge x={330} y={290} text="Client receives final answer" color="#34d399" active w={250} />}
  </svg></StepShell>
}

const cacheStages = [
  'Stub resolver يفحص cache الجهاز أولاً.',
  'Recursive resolver يفحص cache الخاص به.',
  'إذا وُجد سجل صالح وغير منتهي الصلاحية يُعاد مباشرة.',
  'TTL يحدد مدة صلاحية الإجابة في cache.',
  '`ipconfig /flushdns` يمسح cache على Windows حسب الصلاحيات/المنصة.',
]
export function DnsCacheDiagram() {
  const p = useStepPlayback(cacheStages.length); const s = p.stage
  return <StepShell title="DNS CACHE" playback={p} legend={cacheStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="DNS cache and TTL behavior">
    <Box x={320} y={150} w={280} h={110} title="DNS Cache" sub={s>=2?'Hit -> answer':'Miss -> query'} color={s>=2?'#34d399':'#f59e0b'} active />
    {s>=3 && <Badge x={330} y={290} text="TTL controls freshness" color="#f59e0b" active w={250} />}
  </svg></StepShell>
}

const recordStages = [
  'A يربط الاسم بـ IPv4 address.',
  'AAAA يربط الاسم بـ IPv6 address.',
  'CNAME يعمل كـ alias لاسم آخر.',
  'MX يحدد mail servers، NS يحدد authoritative servers.',
  'PTR للـ reverse lookup وTXT لنصوص مثل verification/SPF.',
]
export function DnsRecordTypesDiagram() {
  const p = useStepPlayback(recordStages.length); const s = p.stage
  const records = [['A','IPv4'],['AAAA','IPv6'],['CNAME','Alias'],['MX','Mail'],['NS','Name Server'],['PTR','Reverse'],['TXT','Text']]
  return <StepShell title="DNS RECORD TYPES" playback={p} legend={recordStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="DNS record types selection">
    {records.map((r,i)=><g key={r[0]} opacity={s>=Math.min(i,4)?1:0.35}><rect x={50+(i%4)*210} y={110+Math.floor(i/4)*110} width={190} height={70} rx="10" fill="#0b1224" stroke={s===i?'#f59e0b':'#38bdf8'} strokeWidth={s===i?2.2:1}/><SvgText x={145+(i%4)*210} y={145+Math.floor(i/4)*110} color="#cbd5e1" size={10} bold>{r[0]}</SvgText><SvgText x={145+(i%4)*210} y={165+Math.floor(i/4)*110} color="#94a3b8" size={8}>{r[1]}</SvgText></g>)}
  </svg></StepShell>
}

const lookupStages = [
  'Forward lookup يحوّل name إلى IP address (مثل A/AAAA).',
  'Reverse lookup يحوّل IP address إلى name باستخدام PTR.',
  'كل اتجاه يستخدم سجلات مختلفة.',
  'أمثلة العناوين هنا للتوثيق فقط.',
  'لا تفترض أن كل عنوان IP له PTR صالح.',
]
export function ForwardVsReverseLookupDiagram() {
  const p = useStepPlayback(lookupStages.length); const s = p.stage
  return <StepShell title="FORWARD vs REVERSE LOOKUP" playback={p} legend={lookupStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Forward and reverse DNS lookup">
    <Box x={80} y={160} w={220} h={90} title="Name" sub="example.com" color="#38bdf8" active />
    <Box x={640} y={160} w={220} h={90} title="IP" sub="192.0.2.10 (doc)" color="#34d399" active />
    <LinkLine x1={300} y1={190} x2={640} y2={190} color="#f59e0b" active={s>=0} />
    <LinkLine x1={640} y1={225} x2={300} y2={225} color="#a78bfa" active={s>=1} />
    {s>=1 && <Badge x={340} y={290} text="PTR used for reverse lookup" color="#a78bfa" active w={260} />}
  </svg></StepShell>
}

const interactStages = [
  'Laptop connects to Wi-Fi and starts DHCP.',
  'DHCP assigns IP address and default gateway.',
  'DHCP also provides DNS server address.',
  'User opens www.example.com.',
  'DNS resolves name to IP and client connects.',
]
export function DhcpDnsInteractionDiagram() {
  const p = useStepPlayback(interactStages.length); const s = p.stage
  return <StepShell title="DHCP and DNS INTERACTION" playback={p} legend={interactStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="DHCP and DNS interaction from network join to website access">
    <Box x={60} y={170} w={150} h={80} title="Laptop" sub="Wi-Fi" color="#38bdf8" active />
    <Box x={290} y={170} w={160} h={80} title="DHCP" sub="IP + GW + DNS" color="#f59e0b" active={s>=1} />
    <Box x={530} y={170} w={160} h={80} title="DNS" sub="Name -> IP" color="#34d399" active={s>=3} />
    <Box x={760} y={170} w={130} h={80} title="Server" sub="Web" color="#94a3b8" active={s>=4} />
    <LinkLine x1={210} y1={210} x2={290} y2={210} color="#38bdf8" active />
    <LinkLine x1={450} y1={210} x2={530} y2={210} color="#f59e0b" active={s>=2} />
    <LinkLine x1={690} y1={210} x2={760} y2={210} color="#34d399" active={s>=4} />
  </svg></StepShell>
}

const lifecycleStages = [
  'Device joins network with no IP configuration.',
  'DORA obtains IP, mask, gateway and DNS server.',
  'DNS resolves the requested domain name.',
  'Client opens connection to resolved IP through gateway/routing.',
  'Lease renewal and DNS cache continue in background.',
]
export function CompleteConnectionLifecycleDiagram() {
  const p = useStepPlayback(lifecycleStages.length); const s = p.stage
  const labels = ['Join','DORA','DNS','Connect','Maintain']
  return <StepShell title="COMPLETE CONNECTION LIFECYCLE" playback={p} legend={lifecycleStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Complete DHCP DNS and connection lifecycle">
    {labels.map((t,i)=><g key={t} opacity={s>=i?1:0.3}><rect x={40+i*175} y={170} width={150} height={70} rx="10" fill="#0b1224" stroke={s===i?'#f59e0b':'#475569'} strokeWidth={s===i?2.2:1}/><SvgText x={115+i*175} y={210} color={s===i?'#f59e0b':'#cbd5e1'} size={9} bold>{t}</SvgText></g>)}
  </svg></StepShell>
}

const troubleSteps = ['Check IP Config','Check Gateway','Check DNS IP','Test DNS Query','Check Records/Cache','Verify Fix']
const troubleStages = [
  'ابدأ بـ ipconfig /all أو ip addr وتأكد من IP/mask/gateway/DNS.',
  'اختبر gateway وrouting؛ وجود IP لا يعني connectivity صحيحاً.',
  'تحقق من عنوان DNS server الموزّع أو المكوّن.',
  'استخدم nslookup/dig/resolvectl query لاختبار الاستعلام.',
  'راجع السجل أو الـ cache القديم.',
  'بعد الإصلاح أعد الاختبار وتأكد من resolution و-connectivity.',
]
export function DhcpDnsTroubleshootingFlowDiagram() {
  const p = useStepPlayback(troubleStages.length); const s = p.stage
  return <StepShell title="DHCP/DNS TROUBLESHOOTING FLOW" playback={p} legend={troubleStages[s]}><svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="DHCP and DNS troubleshooting flow">
    {troubleSteps.map((t,i)=><g key={t} opacity={s>=Math.min(i,5)?1:0.3}><rect x={20+i*148} y={170} width={130} height={65} rx="9" fill="#0b1224" stroke={s===i?'#f59e0b':'#475569'} strokeWidth={s===i?2.2:1}/><SvgText x={85+i*148} y={208} color={s===i?'#f59e0b':'#cbd5e1'} size={8} bold>{t}</SvgText></g>)}
  </svg></StepShell>
}
