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
    const timer = window.setInterval(() => setStage((current) => (current + 1) % length), 2100)
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
      <button
        type="button"
        onClick={playback.previous}
        className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}
      >
        <SkipBack size={13} /> السابق
      </button>
      <button
        type="button"
        onClick={playback.next}
        className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}
      >
        <SkipForward size={13} /> التالي
      </button>
      <button
        type="button"
        onClick={playback.reset}
        className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}
      >
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

function Box({
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
    <g opacity={active ? 1 : 0.62}>
      <rect x={x} y={y} width={w} height={h} rx="12" fill="#0b1224" stroke={color} strokeWidth={active ? 2.2 : 1.1} />
      <SvgText x={x + w / 2} y={y + 21} color={color} size={10} bold>
        {title}
      </SvgText>
      {lines.map((line, index) => (
        <SvgText key={index} x={x + w / 2} y={y + 39 + index * 15} color="#cbd5e1" size={10}>
          {line}
        </SvgText>
      ))}
    </g>
  )
}

function SectionLabel({ x, y, text, color = '#64748b' }: { x: number; y: number; text: string; color?: string }) {
  return (
    <SvgText x={x} y={y} color={color} size={10} bold>
      {text}
    </SvgText>
  )
}

const publicPrivateStages = [
  'داخل البيت كل جهاز عنده `Private IP` زي `192.168.1.10` و `.11` و `.12`. العنوان ده مش فريد عالمياً، بس لازم يكون فريد جوه الـ LAN.',
  'الـ ISP بيخصّص `Public IP` للراوتر فقط. كل الأجهزة في البيت بتخرج من نفس العنوان العام عن طريق NAT/PAT.',
  'الـ IANA بيدير توزيع العناوين عالمياً، وبعدين `RIRs` توزّع على `ISPs`، والـ ISP يخصّص عنوان عام للعميل.',
  'العناوين الخاصة مش قابلة للتوجيه على الإنترنت العام؛ لو وصل packet بمصدر `192.168.x.x` للـ ISP غالباً هيتم تجاهله.',
]

export function PublicVsPrivateDiagram() {
  const playback = useStepPlayback(publicPrivateStages.length)
  const stage = playback.stage

  return (
    <StepShell title="PUBLIC IPv4 vs PRIVATE IPv4 / HOME LAN" playback={playback} legend={publicPrivateStages[stage]}>
      <svg viewBox="0 0 900 330" className="h-auto w-full min-w-[760px]" role="img" aria-label="Private home LAN compared with the public Internet and ISP addressing">
        <title>Private home LAN devices sharing one ISP-assigned public IPv4 address</title>

        <SectionLabel x={135} y={30} text="PRIVATE LAN — REUSABLE" color="#38bdf8" />
        <SectionLabel x={455} y={30} text="ISP / PUBLIC INTERNET — GLOBALLY ROUTABLE" color="#34d399" />
        <rect x="35" y="42" width="310" height="230" rx="18" fill="#38bdf8" fillOpacity="0.04" stroke="#38bdf8" strokeOpacity="0.35" />
        <rect x="390" y="42" width="470" height="230" rx="18" fill="#34d399" fillOpacity="0.04" stroke="#34d399" strokeOpacity="0.3" />

        <Node x={55} y={70} w={120} h={50} label="LAPTOP" sub="192.168.1.10" color="#38bdf8" tooltip="Private host inside the home LAN" active={stage === 0} />
        <Node x={190} y={70} w={120} h={50} label="PHONE" sub="192.168.1.11" color="#38bdf8" tooltip="Second private host in the same LAN" active={stage === 0} />
        <Node x={125} y={145} w={120} h={50} label="SMART TV" sub="192.168.1.12" color="#38bdf8" tooltip="Third private host in the same LAN" active={stage === 0} />
        <Node x={105} y={220} w={150} h={50} label="HOME R1" sub="WAN 203.0.113.10" color="#fbbf24" tooltip="Edge router with private LAN interface and public WAN interface" active={stage === 0 || stage === 1} />

        <LinkLine x1={115} y1={120} x2={120} y2={220} active={stage === 0} />
        <LinkLine x1={250} y1={120} x2={230} y2={220} active={stage === 0} />
        <LinkLine x1={185} y1={195} x2={185} y2={220} active={stage === 0} />

        <Node x={420} y={92} w={120} h={54} label="ISP" sub="assigns public IP" color="#34d399" tooltip="Internet Service Provider assigns the public WAN address" active={stage === 1 || stage === 2} />
        <Node x={580} y={92} w={120} h={54} label="INTERNET" sub="public routing" color="#34d399" tooltip="Public IP network" active={stage === 2 || stage === 3} />
        <Node x={730} y={92} w={110} h={54} label="SERVER" sub="198.51.100.20" color="#a78bfa" tooltip="Public server on the Internet" active={stage === 3} />
        <LinkLine x1={255} y1={245} x2={420} y2={120} active={stage === 1 || stage === 3} />
        <LinkLine x1={540} y1={119} x2={580} y2={119} active={stage === 2} />
        <LinkLine x1={700} y1={119} x2={730} y2={119} active={stage === 3} />

        {stage === 1 && <Packet point={{ x: 340, y: 185 }} color="#fbbf24" label="PUBLIC IP" />}
        {stage === 3 && (
          <Box x={420} y={180} w={410} h={70} title="WHY PRIVATE IPs DO NOT ROUTE ON THE INTERNET" lines={['Source 192.168.1.10 is not globally unique', 'R1 must translate it to 203.0.113.10 first']} color="#fb7185" active />
        )}
        {stage === 2 && (
          <g>
            <Node x={410} y={190} w={110} h={50} label="IANA" sub="global pools" color="#a78bfa" tooltip="Internet Assigned Numbers Authority" active />
            <Node x={545} y={190} w={110} h={50} label="RIR" sub="regional allocation" color="#a78bfa" tooltip="Regional Internet Registries allocate address blocks to ISPs" active />
            <Node x={680} y={190} w={145} h={50} label="ISP" sub="customer assignment" color="#34d399" tooltip="ISP assigns one public address to the customer router" active />
            <LinkLine x1={520} y1={215} x2={545} y2={215} active />
            <LinkLine x1={655} y1={215} x2={680} y2={215} active />
          </g>
        )}
      </svg>
    </StepShell>
  )
}

const rfc1918Stages = [
  'RFC 1918 خصّص ثلاث نطاقات للاستخدام الخاص جوه الشبكات الداخلية. أي منظمة تقدر تستخدمها من غير ما تاخد عنوان عام من ISP.',
  '`10.0.0.0/8`: من `10.0.0.0` لـ `10.255.255.255`. الماسك `255.0.0.0` — أول octet ثابت 10 والباقي host bits.',
  '`172.16.0.0/12`: من `172.16.0.0` لـ `172.31.255.255`. الماسك `255.240.0.0` — الـ second octet من 16 لـ 31 بس.',
  '`192.168.0.0/16`: من `192.168.0.0` لـ `192.168.255.255`. الماسك `255.255.0.0` — أول اتنين octets ثابتين.',
  'حدود مهمة: `172.20.1.1` private · `172.15.1.1` public · `172.32.1.1` public · `192.168.1.1` private · `192.169.1.1` public.',
]

export function Rfc1918RangesDiagram() {
  const playback = useStepPlayback(rfc1918Stages.length)
  const stage = playback.stage
  const rows = [
    { label: 'CLASS A', range: '10.0.0.0 – 10.255.255.255', cidr: '/8', mask: '255.0.0.0', color: '#38bdf8' },
    { label: 'CLASS B', range: '172.16.0.0 – 172.31.255.255', cidr: '/12', mask: '255.240.0.0', color: '#a78bfa' },
    { label: 'CLASS C', range: '192.168.0.0 – 192.168.255.255', cidr: '/16', mask: '255.255.0.0', color: '#34d399' },
  ]

  return (
    <StepShell title="RFC 1918 / THREE PRIVATE IPv4 BLOCKS" playback={playback} legend={rfc1918Stages[stage]}>
      <svg viewBox="0 0 900 340" className="h-auto w-full min-w-[760px]" role="img" aria-label="RFC 1918 private IPv4 ranges and their boundaries">
        <title>RFC 1918 private ranges 10/8, 172.16/12 and 192.168/16</title>
        <SvgText x={450} y={28} color="#e2e8f0" size={13} bold>RFC 1918 — PRIVATE ADDRESS SPACE</SvgText>

        {rows.map((row, index) => (
          <g key={row.label} opacity={stage === 0 || stage === index + 1 ? 1 : 0.4}>
            <rect x={45} y={48 + index * 62} width={810} height={52} rx="11" fill="#0b1224" stroke={row.color} strokeWidth={stage === index + 1 ? 2.4 : 1.1} />
            <SvgText x={95} y={80 + index * 62} color={row.color} size={11} bold>{row.label}</SvgText>
            <SvgText x={340} y={80 + index * 62} color="#e2e8f0" size={12} bold>{row.range}</SvgText>
            <SvgText x={650} y={80 + index * 62} color={row.color} size={12} bold>{row.cidr}</SvgText>
            <SvgText x={745} y={80 + index * 62} color="#94a3b8" size={10}>{row.mask}</SvgText>
          </g>
        ))}

        {stage >= 1 && stage <= 3 && (
          <g>
            <Box
              x={70}
              y={260}
              w={760}
              h={58}
              title={stage === 1 ? '10/8 BOUNDARY' : stage === 2 ? '172.16/12 BOUNDARY — CHECK SECOND OCTET' : '192.168/16 BOUNDARY'}
              lines={
                stage === 1
                  ? ['10.0.0.0  →  10.255.255.255   |   inside = private, 11.x.x.x = public']
                  : stage === 2
                    ? ['172.15.x.x public  |  172.16–31.x.x private  |  172.32.x.x public']
                    : ['192.168.0.0 – 192.168.255.255 private  |  192.169.1.1 public']
              }
              color={stage === 1 ? '#38bdf8' : stage === 2 ? '#a78bfa' : '#34d399'}
              active
            />
          </g>
        )}

        {stage === 4 && (
          <g>
            <SectionLabel x={65} y={245} text="PRIVATE EXAMPLES" color="#34d399" />
            <SectionLabel x={505} y={245} text="PUBLIC / NOT RFC 1918" color="#fb7185" />
            {['10.1.1.1', '172.20.1.1', '192.168.1.1'].map((value, index) => (
              <Box key={value} x={65 + index * 140} y={258} w={130} h={54} title="PRIVATE" lines={[value]} color="#34d399" active />
            ))}
            {['172.15.1.1', '172.32.1.1', '192.169.1.1'].map((value, index) => (
              <Box key={value} x={505 + index * 125} y={258} w={115} h={54} title="PUBLIC" lines={[value]} color="#fb7185" active />
            ))}
          </g>
        )}
      </svg>
    </StepShell>
  )
}

const specialRangesStages = [
  '`127.0.0.0/8` هو `loopback`. أشهر مثال `127.0.0.1` ويسمّى `localhost`; بيختبر الـ TCP/IP stack جوه الجهاز من غير ما packet يخرج على الكابل.',
  '`169.254.0.0/16` هو `APIPA / link-local`. الجهاز بيختاره لو DHCP فشل; يقدر يتكلم مع جيران في نفس الرابط بس مفيش default gateway وبلا إنترنت طبيعي.',
  '`0.0.0.0` معناه `unspecified / any address` حسب السياق — مثلاً مصدر DHCP قبل ما الجهاز ياخد IP. أمّا `255.255.255.255` فهو `limited broadcast` جوه الـ local broadcast domain.',
  'في أي subnet: أول عنوان `network address` وآخر عنوان `directed broadcast`. في `192.168.1.0/24`: `.0` network و `.255` directed broadcast.',
  '`224.0.0.0/4` للـ multicast. ونطاقات زي `192.0.2.0/24` و `198.51.100.0/24` و `203.0.113.0/24` محجوزة للتوثيق والتدريب — مش عناوين إنترنت حقيقية.',
]

export function SpecialRangesDiagram() {
  const playback = useStepPlayback(specialRangesStages.length)
  const stage = playback.stage

  return (
    <StepShell title="SPECIAL IPv4 ADDRESSES / RESERVED RANGES" playback={playback} legend={specialRangesStages[stage]}>
      <svg viewBox="0 0 900 350" className="h-auto w-full min-w-[760px]" role="img" aria-label="Special IPv4 ranges including loopback, APIPA, broadcast, multicast and documentation ranges">
        <title>Special-use IPv4 addresses and their purposes</title>

        <Box x={45} y={45} w={250} h={85} title="127.0.0.0/8 · LOOPBACK" lines={['127.0.0.1 = localhost', 'Tests local TCP/IP stack']} color="#38bdf8" active={stage === 0} />
        <Box x={325} y={45} w={250} h={85} title="169.254.0.0/16 · APIPA" lines={['Automatic private address', 'DHCP failed · no default gateway']} color="#fbbf24" active={stage === 1} />
        <Box x={605} y={45} w={250} h={85} title="224.0.0.0/4 · MULTICAST" lines={['One packet to a group', 'Class D range 224–239']} color="#a78bfa" active={stage === 4} />

        <Box x={45} y={155} w={250} h={85} title="0.0.0.0 · UNSPECIFIED" lines={['No address yet / any address', 'DHCP client source = 0.0.0.0']} color="#94a3b8" active={stage === 2} />
        <Box x={325} y={155} w={250} h={85} title="255.255.255.255" lines={['Limited broadcast', 'Stays inside local broadcast domain']} color="#fb7185" active={stage === 2} />
        <Box x={605} y={155} w={250} h={85} title="DOCUMENTATION RANGES" lines={['192.0.2.0/24 · 198.51.100.0/24', '203.0.113.0/24 — for examples only']} color="#34d399" active={stage === 4} />

        <g opacity={stage === 3 ? 1 : 0.35}>
          <rect x={110} y={265} width={680} height={60} rx="12" fill="#0b1224" stroke="#38bdf8" strokeWidth={stage === 3 ? 2.2 : 1} />
          <SvgText x={450} y={286} color="#e2e8f0" size={12} bold>NETWORK 192.168.1.0/24 · MASK 255.255.255.0</SvgText>
          <SvgText x={185} y={310} color="#fb7185" size={11} bold>.0 NETWORK</SvgText>
          <SvgText x={450} y={310} color="#34d399" size={11} bold>.1 – .254 USABLE HOSTS</SvgText>
          <SvgText x={720} y={310} color="#fb7185" size={11} bold>.255 DIRECTED BCAST</SvgText>
        </g>
      </svg>
    </StepShell>
  )
}

const lanInternetStages = [
  'PC1 `192.168.1.10/24` يبعت request للسيرفر العام `198.51.100.20`. المصدر خاص، والـ destination عام.',
  'SW1 يمرّر الـ frame لمنفذ R1 لأن `192.168.1.1` هو الـ default gateway للـ LAN.',
  'R1 يقرأ الـ inside interface، يعمل PAT ويغيّر المصدر إلى `203.0.113.10` مع source port.',
  'الـ ISP والإنترنت يشوفوا مصدر الـ packet عنوان عام فقط، فيقدروا يوجّهوه ويستقبلوا الرد.',
  'الرد راجع لـ `203.0.113.10`; R1 يفحص الـ translation table ويرجّع الـ destination لـ `192.168.1.10`.',
]

export function LanToInternetDiagram() {
  const playback = useStepPlayback(lanInternetStages.length)
  const stage = playback.stage
  const points = [
    { x: 120, y: 150 },
    { x: 310, y: 150 },
    { x: 480, y: 150 },
    { x: 670, y: 150 },
    { x: 310, y: 150 },
  ]

  return (
    <StepShell title="PRIVATE LAN TO INTERNET / END-TO-END PATH" playback={playback} legend={lanInternetStages[stage]}>
      <svg viewBox="0 0 900 320" className="h-auto w-full min-w-[760px]" role="img" aria-label="Private LAN host sending traffic through a NAT router to an Internet server and back">
        <title>Private LAN to public Internet packet path with NAT and return traffic</title>
        <LinkLine x1={170} y1={150} x2={255} y2={150} active={stage === 0 || stage === 4} />
        <LinkLine x1={355} y1={150} x2={425} y2={150} active={stage === 1} />
        <LinkLine x1={545} y1={150} x2={615} y2={150} active={stage === 2 || stage === 3} />
        <LinkLine x1={735} y1={150} x2={765} y2={150} active={stage === 3} />

        <Node x={35} y={120} w={135} h={60} label="PC1" sub="192.168.1.10" color="#38bdf8" tooltip="Private inside host" active={stage === 0 || stage === 4} />
        <Node x={255} y={120} w={100} h={60} label="SW1" sub="Layer 2" color="#60a5fa" tooltip="Access switch forwards the frame toward the default gateway" active={stage === 1} />
        <Node x={425} y={120} w={120} h={60} label="R1 / NAT" sub="inside → outside" color="#fbbf24" tooltip="Edge router performing NAT/PAT" active={stage === 2 || stage === 4} />
        <Node x={615} y={120} w={120} h={60} label="ISP / IP" sub="public cloud" color="#34d399" tooltip="Public Internet routing domain" active={stage === 3} />
        <Node x={765} y={120} w={120} h={60} label="SERVER" sub="198.51.100.20" color="#a78bfa" tooltip="Public destination server" active={stage === 3} />

        <Box x={40} y={220} w={370} h={72} title={stage >= 2 ? 'AFTER PAT ON R1' : 'ORIGINAL PACKET'} lines={
          stage >= 2
            ? ['SRC 203.0.113.10:51500  →  DST 198.51.100.20:443', 'Translation entry stores inside local + global values']
            : ['SRC 192.168.1.10:51500  →  DST 198.51.100.20:443', 'Private source cannot be used as a public source']
        } color={stage >= 2 ? '#34d399' : '#38bdf8'} active />

        <Box x={490} y={220} w={370} h={72} title={stage === 4 ? 'RETURN PACKET' : 'PUBLIC-FACING VIEW'} lines={
          stage === 4
            ? ['SRC 198.51.100.20:443  →  DST 192.168.1.10:51500', 'R1 restored the private destination from the table']
            : ['SRC 198.51.100.20:443  →  DST 203.0.113.10:51500', 'Reply reaches the router public WAN address']
        } color={stage === 4 ? '#34d399' : '#94a3b8'} active={stage === 4 || stage === 3} />

        <Packet point={points[stage]} color={stage === 4 ? '#34d399' : '#38bdf8'} label={stage === 4 ? 'REPLY' : 'REQ'} />
      </svg>
    </StepShell>
  )
}

const staticNatStages = [
  '`Static NAT` يعمل mapping ثابت واحد لواحد: `192.168.1.10` ↔ `203.0.113.11`. كل طلب من الجهاز الداخلي يطلع بنفس العنوان العام.',
  'الـ mapping موجود في `show ip nat translations` حتى لو مفيش traffic شغال — عشان كده مناسب لخادم داخلي محتاج عنوان ثابت.',
  'جهاز خارجي يبعت لـ `203.0.113.11`; الراوتر يعرف إن العنوان ده مرتبط بـ `192.168.1.10`.',
  'الراوتر يغيّر `destination IP` من العام للخاص ويرسل الـ packet جوه الـ LAN. الرجوع بيستخدم نفس الإدخال الثابت.',
]

export function StaticNatDiagram() {
  const playback = useStepPlayback(staticNatStages.length)
  const stage = playback.stage

  return (
    <StepShell title="STATIC NAT / ONE-TO-ONE MAPPING" playback={playback} legend={staticNatStages[stage]}>
      <svg viewBox="0 0 900 330" className="h-auto w-full min-w-[760px]" role="img" aria-label="Static NAT one-to-one mapping between a private host and a public address">
        <title>Static NAT inside local to inside global one-to-one translation</title>

        <Node x={45} y={85} w={190} h={70} label="INSIDE LOCAL" sub="192.168.1.10" color="#38bdf8" tooltip="Private address configured on the internal host" active={stage === 0 || stage === 3} />
        <Node x={355} y={85} w={190} h={70} label="R1 NAT TABLE" sub="static entry" color="#fbbf24" tooltip="Router translation table holding the permanent mapping" active={stage === 1 || stage === 2 || stage === 3} />
        <Node x={665} y={85} w={190} h={70} label="INSIDE GLOBAL" sub="203.0.113.11" color="#34d399" tooltip="Public address representing the inside host" active={stage === 0 || stage === 2} />
        <LinkLine x1={235} y1={120} x2={355} y2={120} active={stage === 0 || stage === 3} color="#38bdf8" />
        <LinkLine x1={545} y1={120} x2={665} y2={120} active={stage === 0 || stage === 2} color="#34d399" />

        <Box x={210} y={195} w={480} h={80} title="SHOW IP NAT TRANSLATIONS — PERMANENT ENTRY" lines={['Pro Inside global      Inside local       Outside local      Outside global', '--- 203.0.113.11       192.168.1.10       ---                ---']} color="#a78bfa" active={stage === 1} />

        {stage === 2 && (
          <Box x={45} y={210} w={810} h={75} title="OUTSIDE HOST → INSIDE SERVER" lines={['SRC 198.51.100.20:443  →  DST 203.0.113.11:80', 'R1 finds the static entry before forwarding into the LAN']} color="#34d399" active />
        )}
        {stage === 3 && (
          <Box x={45} y={210} w={810} h={75} title="AFTER UNTRANSLATION" lines={['SRC 198.51.100.20:443  →  DST 192.168.1.10:80', 'No port translation is needed for basic static NAT']} color="#38bdf8" active />
        )}
      </svg>
    </StepShell>
  )
}

const dynamicNatStages = [
  '`Dynamic NAT` بيحتاج ACL يحدّد مين يتترجم: هنا `192.168.1.0/24` عبر `access-list 1 permit 192.168.1.0 0.0.0.255`.',
  'الراوتر عنده pool من عناوين عامة: `203.0.113.10 – 203.0.113.13`. كل عنوان هيستخدمه جهاز واحد في نفس الوقت.',
  'أول جهاز `192.168.1.10` ياخد `203.0.113.10` من الـ pool ويتسجّل في الـ translation table.',
  'جهاز تاني `192.168.1.11` ياخد `203.0.113.11`. الـ mapping مؤقت وبيختفي بعد ما الـ session تقفل.',
  'لو الـ pool خلص، أي جهاز جديد مفيش عنوان عام ياخده: الـ translation مش هيتعمل والاتصال هيفشل أو ينتظر لحد ما عنوان يتحرر.',
]

export function DynamicNatDiagram() {
  const playback = useStepPlayback(dynamicNatStages.length)
  const stage = playback.stage
  const pool = ['203.0.113.10', '203.0.113.11', '203.0.113.12', '203.0.113.13']

  return (
    <StepShell title="DYNAMIC NAT / PUBLIC ADDRESS POOL" playback={playback} legend={dynamicNatStages[stage]}>
      <svg viewBox="0 0 900 350" className="h-auto w-full min-w-[760px]" role="img" aria-label="Dynamic NAT allocating addresses from a public pool">
        <title>Dynamic NAT pool allocation and exhaustion</title>

        <Box x={40} y={45} w={260} h={78} title="ACL 1 — MATCH INSIDE NETWORK" lines={['permit 192.168.1.0 0.0.0.255', 'Deny / unmatched traffic is not translated']} color="#38bdf8" active={stage === 0} />
        <Node x={350} y={55} w={190} h={64} label="R1 NAT" sub="pool allocation" color="#fbbf24" tooltip="Dynamic NAT chooses an available global address" active={stage >= 1} />
        <SectionLabel x={600} y={65} text="PUBLIC POOL — 4 ADDRESSES" color="#34d399" />

        {pool.map((address, index) => {
          const used = (stage === 2 && index === 0) || (stage >= 3 && index <= 1)
          return (
            <g key={address} opacity={used ? 1 : 0.55}>
              <rect x={600} y={83 + index * 38} width={250} height={31} rx="8" fill={used ? '#34d399' : '#0b1224'} fillOpacity={used ? 0.18 : 1} stroke={used ? '#34d399' : '#1e3a5f'} strokeWidth={used ? 2 : 1} />
              <SvgText x={725} y={103 + index * 38} color={used ? '#d1fae5' : '#94a3b8'} size={10} bold>
                {`${address}${used ? '  ← ALLOCATED' : '  ← FREE'}`}
              </SvgText>
            </g>
          )
        })}

        <Box x={40} y={165} w={260} h={70} title="PC1 · 192.168.1.10" lines={[stage >= 2 ? '→ 203.0.113.10' : 'Waiting for matching traffic']} color="#38bdf8" active={stage >= 2} />
        <Box x={330} y={165} w={260} h={70} title="PC2 · 192.168.1.11" lines={[stage >= 3 ? '→ 203.0.113.11' : 'Not translated yet']} color="#38bdf8" active={stage >= 3} />
        <Box x={620} y={165} w={240} h={70} title="PC3 · 192.168.1.12" lines={[stage === 4 ? 'NO FREE ADDRESS' : 'Would use next free address']} color={stage === 4 ? '#fb7185' : '#94a3b8'} active={stage === 4} />

        <Box x={40} y={270} w={820} h={58} title="KEY LIMITATION" lines={stage === 4 ? ['Pool exhausted — dynamic NAT is one private IP per public IP at a time'] : ['Dynamic NAT does not multiplex sessions with ports; that is PAT / NAT overload']} color={stage === 4 ? '#fb7185' : '#a78bfa'} active />
      </svg>
    </StepShell>
  )
}

const patStages = [
  'PC1 `192.168.1.10:51500` يرسل طلب. الراوتر بيحفظ الـ inside local IP والـ source port.',
  'PC2 `192.168.1.11:52000` يرسل طلب تاني في نفس الوقت. الاتنين تحته نفس العنوان العام.',
  'PAT بيترجم العنوان لـ `203.0.113.10` ويستخدم `source port` مختلف لكل session: `51500` و `52000` لو متاحين.',
  'الـ translation table فيها IP + port، وده اللي بيخلّي الراوتر يفرّق بين الـ sessions رغم إن العنوان العام واحد.',
  'لما الرد يرجع على `203.0.113.10:51500` الراوتر يطابق/port ويرجّع الـ destination لـ `192.168.1.10:51500`.',
]

export function PatDiagram() {
  const playback = useStepPlayback(patStages.length)
  const stage = playback.stage

  return (
    <StepShell title="PAT / NAT OVERLOAD / MANY-TO-ONE" playback={playback} legend={patStages[stage]}>
      <svg viewBox="0 0 900 350" className="h-auto w-full min-w-[760px]" role="img" aria-label="PAT allowing multiple private clients to share one public IP using source ports">
        <title>PAT translation table with unique source ports for multiple inside hosts</title>

        <Node x={35} y={55} w={210} h={62} label="PC1" sub="192.168.1.10:51500" color="#38bdf8" tooltip="First inside client and TCP/UDP source port" active={stage === 0 || stage === 4} />
        <Node x={35} y={155} w={210} h={62} label="PC2" sub="192.168.1.11:52000" color="#38bdf8" tooltip="Second inside client and TCP/UDP source port" active={stage === 1} />
        <Node x={340} y={100} w={190} h={74} label="R1 / PAT" sub="one public IP" color="#fbbf24" tooltip="Overload translation using IP and port numbers" active={stage >= 2} />
        <Node x={660} y={100} w={200} h={74} label="203.0.113.10" sub="shared inside global" color="#34d399" tooltip="Single public IP used by both clients" active={stage >= 2} />

        <LinkLine x1={245} y1={86} x2={340} y2={125} active={stage === 0 || stage >= 2} />
        <LinkLine x1={245} y1={186} x2={340} y2={148} active={stage === 1 || stage >= 2} />
        <LinkLine x1={530} y1={137} x2={660} y2={137} active={stage >= 2} color="#34d399" />

        <Box x={45} y={245} w={810} h={82} title="PAT TRANSLATION TABLE — IP + PORT DISTINGUISH SESSIONS" lines={[
          'inside local 192.168.1.10:51500  →  inside global 203.0.113.10:51500  →  198.51.100.20:443',
          'inside local 192.168.1.11:52000  →  inside global 203.0.113.10:52000  →  198.51.100.20:443',
        ]} color={stage >= 3 ? '#34d399' : '#a78bfa'} active={stage >= 3} />

        {stage === 4 && (
          <Box x={320} y={190} w={380} h={48} title="RETURN LOOKUP" lines={['203.0.113.10:51500 → 192.168.1.10:51500']} color="#34d399" active />
        )}
      </svg>
    </StepShell>
  )
}

const natPacketStages = [
  'Outbound before NAT: `SRC 192.168.1.10:51500` و `DST 198.51.100.20:443`. الـ destination port 443 يعني HTTPS/TCP.',
  'الـ packet وصل على `GigabitEthernet0/0` — الـ inside interface. الراوتر يعرف إن المصدر جوه الـ LAN.',
  'الراوتر يفحص الـ NAT rules: الـ ACL يطابق `192.168.1.10`، ومفيش entry موجود فبيعمل translation جديدة.',
  'PAT يكتب `SRC 203.0.113.10:51500` في الـ IP header والتCP header. لازم يعمل update لـ `IP header checksum` و `TCP checksum` لأن الـ pseudo-header اتغير.',
  'السيرفر يرد لـ `203.0.113.10:51500`. الراوتر يطابق الـ entry بالـ outside address/port.',
  'الراوتر يرجّع `DST 192.168.1.10:51500` ويحدّث الـ checksums تاني قبل ما يبعت الـ packet جوه الـ LAN.',
]

export function NatPacketDiagram() {
  const playback = useStepPlayback(natPacketStages.length)
  const stage = playback.stage

  return (
    <StepShell title="PACKET-LEVEL NAT / HEADER REWRITE + RETURN" playback={playback} legend={natPacketStages[stage]}>
      <svg viewBox="0 0 900 370" className="h-auto w-full min-w-[760px]" role="img" aria-label="Packet-level NAT translation stages with IP header and checksum updates">
        <title>Packet-level PAT translation from 192.168.1.10 to 203.0.113.10 and return</title>

        <SectionLabel x={45} y={35} text="CLIENT / INSIDE" color="#38bdf8" />
        <SectionLabel x={350} y={35} text="R1 / NAT EDGE" color="#fbbf24" />
        <SectionLabel x={680} y={35} text="SERVER / OUTSIDE" color="#a78bfa" />
        <Node x={35} y={50} w={210} h={60} label="PC1" sub="192.168.1.10" color="#38bdf8" tooltip="Private source host" active={stage <= 1 || stage === 5} />
        <Node x={350} y={50} w={200} h={60} label="G0/0 INSIDE" sub="192.168.1.1" color="#fbbf24" tooltip="Inside NAT interface" active={stage === 1 || stage === 5} />
        <Node x={355} y={135} w={190} h={60} label="G0/1 OUTSIDE" sub="203.0.113.10" color="#34d399" tooltip="Outside NAT interface and translated public address" active={stage === 2 || stage === 3 || stage === 4} />
        <Node x={680} y={50} w={190} h={60} label="SERVER" sub="198.51.100.20" color="#a78bfa" tooltip="Public HTTPS server" active={stage === 3 || stage === 4} />

        <LinkLine x1={245} y1={80} x2={350} y2={80} active={stage === 0 || stage === 1 || stage === 5} />
        <LinkLine x1={450} y1={110} x2={450} y2={135} active={stage === 2 || stage === 4} color="#34d399" />
        <LinkLine x1={545} y1={165} x2={680} y2={80} active={stage === 3 || stage === 4} color="#34d399" />

        <Box x={35} y={210} w={390} h={110} title={stage <= 1 ? 'BEFORE NAT — OUTBOUND' : stage === 5 ? 'AFTER RESTORE — TO PC1' : 'AFTER PAT — ON THE WIRE'} lines={
          stage <= 1
            ? ['IP SRC  192.168.1.10', 'TCP SRC PORT  51500', 'IP DST  198.51.100.20 · DST PORT 443']
            : stage === 5
              ? ['IP DST  192.168.1.10', 'TCP DST PORT  51500', 'Checksums recalculated after rewrite']
              : ['IP SRC  203.0.113.10', 'TCP SRC PORT  51500 (or next free)', 'IP DST  198.51.100.20 · DST PORT 443']
        } color={stage <= 1 ? '#38bdf8' : '#34d399'} active />

        <Box x={475} y={210} w={390} h={110} title={stage >= 4 ? 'RETURN PACKET / TABLE MATCH' : 'TRANSLATION STATE'} lines={
          stage >= 4
            ? ['IP SRC 198.51.100.20:443', 'IP DST 203.0.113.10:51500', 'Lookup maps global → 192.168.1.10:51500']
            : ['inside local  192.168.1.10:51500', 'inside global 203.0.113.10:51500', 'outside global 198.51.100.20:443']
        } color={stage >= 4 ? '#34d399' : '#a78bfa'} active={stage >= 2} />

        {stage === 3 && (
          <Box x={300} y={330} w={300} h={30} title="CHECKSUM UPDATE" lines={['IP header + TCP pseudo-header checksum recalculated']} color="#fb7185" active />
        )}
      </svg>
    </StepShell>
  )
}

const doraStages = [
  '`D = DISCOVER`: الـ client مفيش IP، فبيبعت `0.0.0.0:68 → 255.255.255.255:67` كـ broadcast عشان يلاقي DHCP server.',
  '`O = OFFER`: الـ server يرد بعرض IP وماسك و gateway و DNS و lease. المصدر `192.168.1.1:67` والرد broadcast أو unicast حسب التنفيذ.',
  '`R = REQUEST`: الـ client لسه مصدره `0.0.0.0`؛ بيبعت broadcast requesting العنوان اللي اختاره ويحدّد الـ server.',
  '`A = ACKNOWLEDGMENT`: الـ server يأكّد الإعدادات والـ lease. بعد كده الـ client يقدر يستخدم العنوان ويعمل DAD/ARP حسب الحاجة.',
]

export function DoraDiagram() {
  const playback = useStepPlayback(doraStages.length)
  const stage = playback.stage
  const letters = ['D', 'O', 'R', 'A']
  const titles = ['DISCOVER', 'OFFER', 'REQUEST', 'ACK']
  const packets = [
    '0.0.0.0:68 → 255.255.255.255:67',
    '192.168.1.1:67 → client / broadcast',
    '0.0.0.0:68 → 255.255.255.255:67',
    '192.168.1.1:67 → client :68',
  ]

  return (
    <StepShell title="DHCP DORA / EXACT MESSAGE ORDER" playback={playback} legend={doraStages[stage]}>
      <svg viewBox="0 0 900 360" className="h-auto w-full min-w-[760px]" role="img" aria-label="DHCP DORA sequence Discover Offer Request Acknowledgment">
        <title>DHCP DORA sequence with source and destination reasoning</title>

        <SectionLabel x={90} y={30} text="DHCP CLIENT" color="#38bdf8" />
        <SectionLabel x={700} y={30} text="DHCP SERVER / POOL" color="#34d399" />
        <Node x={45} y={50} w={180} h={64} label="CLIENT" sub="no IP address yet" color="#38bdf8" tooltip="DHCP client starts with 0.0.0.0" active={stage === 0 || stage === 2} />
        <Node x={675} y={50} w={190} h={64} label="DHCP SERVER" sub="192.168.1.1" color="#34d399" tooltip="Server with scope, mask, gateway, DNS and lease" active={stage === 1 || stage === 3} />

        <line x1={235} y1={82} x2={675} y2={82} stroke="#1e3a5f" strokeWidth="2" strokeDasharray="5 6" />
        <line x1={235} y1={120} x2={675} y2={120} stroke="#1e3a5f" strokeWidth="2" strokeDasharray="5 6" />

        {letters.map((letter, index) => {
          const x = 120 + index * 185
          const active = index === stage
          return (
            <g key={letter} opacity={active ? 1 : 0.42}>
              <circle cx={x} cy={225} r={active ? 28 : 24} fill={active ? '#38bdf8' : '#0b1224'} fillOpacity={active ? 0.22 : 1} stroke={active ? '#38bdf8' : '#1e3a5f'} strokeWidth={active ? 2.5 : 1} />
              <SvgText x={x} y={233} color={active ? '#e0f2fe' : '#94a3b8'} size={18} bold>{letter}</SvgText>
              <SvgText x={x} y={276} color={active ? '#7dd3fc' : '#64748b'} size={10} bold>{titles[index]}</SvgText>
              <SvgText x={x} y={295} color="#64748b" size={8}>{`MESSAGE ${index + 1}`}</SvgText>
            </g>
          )
        })}

        {[0, 1, 2].map((index) => (
          <LinkLine key={index} x1={165 + index * 185} y1={225} x2={255 + index * 185} y2={225} active={stage === index} color={index % 2 === 0 ? '#38bdf8' : '#34d399'} />
        ))}

        <Box x={45} y={315} w={810} h={38} title={titles[stage]} lines={[packets[stage]]} color={stage % 2 === 0 ? '#38bdf8' : '#34d399'} active />
      </svg>
    </StepShell>
  )
}

const dhcpRelayStages = [
  'العميل في `192.168.10.0/24` والـ DHCP server في `192.168.20.10`. الـ broadcast من العميل مش بيعدّي الراوتر افتراضياً.',
  'الـ Discover بيوصل لواجهة R1 `G0/0` كـ broadcast؛ من غير مساعدة الـ server مش هيسمع الحاجة دي.',
  'أمر `ip helper-address 192.168.20.10` على الواجهة الداخلية بيخلّي R1 يبعت الـ request كـ unicast للـ server ويضيف `giaddr` عشان يعرف أنهي scope يستخدم.',
  'الـ server يرد للـ relay، والـ relay يسلّم الـ Offer/ACK للعميل. كده DHCP يشتغل عبر subnets مختلفة.',
]

export function DhcpRelayDiagram() {
  const playback = useStepPlayback(dhcpRelayStages.length)
  const stage = playback.stage

  return (
    <StepShell title="DHCP RELAY / IP HELPER-ADDRESS" playback={playback} legend={dhcpRelayStages[stage]}>
      <svg viewBox="0 0 900 340" className="h-auto w-full min-w-[760px]" role="img" aria-label="DHCP relay forwarding broadcast requests across subnets to a remote DHCP server">
        <title>DHCP relay using ip helper-address across different subnets</title>

        <SectionLabel x={45} y={30} text="CLIENT subnet 192.168.10.0/24" color="#38bdf8" />
        <SectionLabel x={350} y={30} text="R1 / RELAY AGENT" color="#fbbf24" />
        <SectionLabel x={640} y={30} text="SERVER subnet 192.168.20.0/24" color="#34d399" />

        <Node x={40} y={55} w={190} h={66} label="DHCP CLIENT" sub="0.0.0.0 → 255.255.255.255" color="#38bdf8" tooltip="Client on the remote LAN" active={stage <= 2} />
        <Node x={345} y={55} w={190} h={66} label="R1 G0/0" sub="192.168.10.1" color="#fbbf24" tooltip="Inside interface configured with ip helper-address" active={stage >= 1} />
        <Node x={650} y={55} w={210} h={66} label="DHCP SERVER" sub="192.168.20.10" color="#34d399" tooltip="Remote DHCP server with a scope for the client subnet" active={stage >= 2} />

        <LinkLine x1={230} y1={88} x2={345} y2={88} active={stage <= 2} />
        <LinkLine x1={535} y1={88} x2={650} y2={88} active={stage >= 2} color="#34d399" dashed={stage === 1} />

        <Box x={40} y={155} w={260} h={85} title="BROADCAST STAYS LOCAL" lines={['Routers do not forward UDP broadcasts', 'by default between Layer 3 networks']} color="#fb7185" active={stage === 1} />
        <Box x={330} y={155} w={260} h={85} title="RELAY CONFIG ON G0/0" lines={['ip helper-address 192.168.20.10', 'Adds giaddr = 192.168.10.1']} color="#fbbf24" active={stage === 2} />
        <Box x={620} y={155} w={250} h={85} title="SCOPE SELECTION" lines={['Server reads giaddr', 'Uses pool for 192.168.10.0/24']} color="#34d399" active={stage >= 2} />

        <Box x={40} y={270} w={830} h={54} title="RESULT" lines={stage === 3 ? ['DORA completes through the relay; client receives IP, mask, gateway, DNS and lease.'] : ['Without the helper, the client never reaches the DHCP server and may later fall back to APIPA.']} color={stage === 3 ? '#34d399' : '#fb7185'} active />
      </svg>
    </StepShell>
  )
}

const labTopologyStages = [
  'Lab 1: `R1 — SW1 — PC1/PC2`. R1 بيعمل DHCP server لـ `192.168.1.0/24`، والـ PCs بياخدوا IP أوتوماتيك.',
  'لو شيلنا الـ DHCP service، العميل هيحاول renewal؛ لو فشل هيظهر `169.254.x.x` APIPA، فمفيش gateway ولا إنترنت.',
  'Lab 2: نضيف `R-ISP` و `SERVER`. R1 بقى edge router: G0/0 inside و G0/1 outside.',
  'PC1 و PC2 بيولّدوا traffic؛ PAT على R1 يسمح لهم يشاركوا `203.0.113.10` ويطلعوا للسيرفر `198.51.100.20`.',
  'التحقق: `show ip nat translations` و `show ip dhcp binding` و ping/traceroute. بعدين نعمل خطأ متعمّد زي `no ip nat inside` ونشخّصه.',
]

export function PrivateLabTopologyDiagram() {
  const playback = useStepPlayback(labTopologyStages.length)
  const stage = playback.stage
  const showInternet = stage >= 2

  return (
    <StepShell title="PACKET TRACER LABS / DHCP + APIPA THEN NAT + PAT" playback={playback} legend={labTopologyStages[stage]}>
      <svg viewBox="0 0 900 370" className="h-auto w-full min-w-[760px]" role="img" aria-label="Complete Packet Tracer topology for DHCP APIPA and NAT PAT labs">
        <title>Complete lab topology with R1, SW1, PC1, PC2, ISP router and public server</title>

        <SectionLabel x={45} y={28} text="INSIDE LAN / 192.168.1.0/24" color="#38bdf8" />
        <Node x={40} y={55} w={145} h={62} label="PC1" sub={stage === 1 ? '169.254.x.x' : 'DHCP or .10'} color={stage === 1 ? '#fbbf24' : '#38bdf8'} tooltip="First DHCP client" active={stage <= 1 || stage >= 3} />
        <Node x={40} y={155} w={145} h={62} label="PC2" sub={stage === 1 ? '169.254.x.x' : 'DHCP or .11'} color={stage === 1 ? '#fbbf24' : '#38bdf8'} tooltip="Second DHCP client" active={stage <= 1 || stage >= 3} />
        <Node x={255} y={100} w={120} h={66} label="SW1" sub="access switch" color="#60a5fa" tooltip="Layer 2 switch connecting clients and router" active />
        <Node x={445} y={100} w={150} h={66} label="R1" sub={showInternet ? 'G0/0 inside' : 'DHCP server'} color="#fbbf24" tooltip="Router configured as DHCP server and NAT edge router" active />

        <LinkLine x1={185} y1={86} x2={255} y2={120} active />
        <LinkLine x1={185} y1={186} x2={255} y2={145} active />
        <LinkLine x1={375} y1={133} x2={445} y2={133} active />

        {showInternet && (
          <g>
            <SectionLabel x={650} y={28} text="OUTSIDE / PUBLIC LAB" color="#34d399" />
            <Node x={650} y={55} w={210} h={66} label="R-ISP" sub="203.0.113.1 /30" color="#34d399" tooltip="ISP router representing the public network" active={stage >= 2} />
            <Node x={650} y={170} w={210} h={66} label="SERVER" sub="198.51.100.20" color="#a78bfa" tooltip="Public test server" active={stage >= 3} />
            <Node x={445} y={240} w={150} h={58} label="G0/1" sub="203.0.113.10" color="#34d399" tooltip="Outside NAT interface on R1" active={stage >= 2} />
            <LinkLine x1={595} y1={133} x2={650} y2={88} active={stage >= 2} color="#34d399" />
            <LinkLine x1={755} y1={121} x2={755} y2={170} active={stage >= 3} color="#a78bfa" />
            <LinkLine x1={520} y1={166} x2={520} y2={240} active={stage >= 2} color="#34d399" />
          </g>
        )}

        <Box x={40} y={285} w={820} h={66} title={stage === 4 ? 'VERIFY + FAULT INJECTION' : stage === 1 ? 'DHCP FAILURE OBSERVATION' : stage >= 2 ? 'PAT CHECKPOINT' : 'LAB 1 CHECKPOINT'} lines={
          stage === 4
            ? ['Check show ip nat translations, show ip dhcp binding, ping, traceroute; remove ip nat inside and repeat.']
            : stage === 1
              ? ['ipconfig should show 169.254.x.x; no usable default gateway means LAN-only communication.']
              : stage >= 2
                ? ['Both clients share 203.0.113.10; translations differ by source port.']
                : ['PC1 and PC2 receive addresses from the R1 DHCP pool; ping 192.168.1.1.']
        } color={stage === 1 ? '#fbbf24' : '#34d399'} active />
      </svg>
    </StepShell>
  )
}
