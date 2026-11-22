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
      <button
        type="button"
        onClick={playback.toggle}
        className={`${base} border-accent-400/30 bg-accent-500/10 font-bold text-accent-300 hover:bg-accent-500/20`}
      >
        {playback.playing ? <Pause size={13} /> : <Play size={13} />}
        {playback.playing ? 'إيقاف' : 'شغّل'}
      </button>
      <button type="button" onClick={playback.previous} className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}>
        <SkipBack size={13} /> السابق
      </button>
      <button type="button" onClick={playback.next} className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}>
        <SkipForward size={13} /> التالي
      </button>
      <button type="button" onClick={playback.reset} className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}>
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

function Panel({
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
    <g opacity={active ? 1 : 0.48}>
      <rect x={x} y={y} width={w} height={h} rx="12" fill="#0b1224" stroke={color} strokeWidth={active ? 2.2 : 1.1} />
      <SvgText x={x + w / 2} y={y + 21} color={color} size={10} bold>
        {title}
      </SvgText>
      {lines.map((line, index) => (
        <SvgText key={index} x={x + w / 2} y={y + 40 + index * 15} color="#cbd5e1" size={9}>
          {line}
        </SvgText>
      ))}
    </g>
  )
}

function CodePanel({
  x,
  y,
  w,
  h,
  title,
  lines,
  color = '#38bdf8',
  active = false,
  highlight = [],
}: {
  x: number
  y: number
  w: number
  h: number
  title: string
  lines: string[]
  color?: string
  active?: boolean
  highlight?: number[]
}) {
  return (
    <g opacity={active ? 1 : 0.5}>
      <rect x={x} y={y} width={w} height={h} rx="12" fill="#0b1224" stroke={color} strokeWidth={active ? 2.2 : 1.1} />
      <rect x={x} y={y} width={w} height={26} rx="12" fill={color} opacity="0.08" />
      <SvgText x={x + 14} y={y + 18} color={color} size={10} anchor="start" bold>
        {title}
      </SvgText>
      {lines.map((line, index) => (
        <SvgText
          key={index}
          x={x + 14}
          y={y + 46 + index * 15}
          color={highlight.includes(index) ? color : '#cbd5e1'}
          size={9}
          anchor="start"
          bold={highlight.includes(index)}
        >
          {line}
        </SvgText>
      ))}
    </g>
  )
}

function Note({ x, y, text, color = '#64748b', size = 9.5 }: { x: number; y: number; text: string; color?: string; size?: number }) {
  return (
    <SvgText x={x} y={y} color={color} size={size}>
      {text}
    </SvgText>
  )
}

const configStages = [
  'الـ client محتاج أكتر من IPv4 address. لازم يعرف الـ mask والـ gateway والـ DNS والـ DHCP state وحتى الـ MAC بتاع الواجهة.',
  '`IPv4 Address + Subnet Mask` بيحددوا شبكة الـ client. هنا `192.168.1.100/24` يعني الـ network `192.168.1.0/24`.',
  'أي destination بره الـ /24 لازم يروح للـ `Default Gateway 192.168.1.1`.',
  'الـ `DNS Server 8.8.8.8` بيترجم اسم زي `example.com` لـ IP عشان الـ client يقدر يتصل بالـ remote server.',
  'لو VPN حاجة ناقصة: مفيش gateway = مفيش وصول لخارج الشبكة، ومفيش DNS = الاسم مش هيتترجم، ومفيش DHCP = غالباً APIPA.',
]

export function ClientConfigOverviewDiagram() {
  const playback = useStepPlayback(configStages.length)
  const s = playback.stage
  return (
    <StepShell title="CLIENT IP CONFIGURATION OVERVIEW" playback={playback} legend={configStages[s]}>
      <svg viewBox="0 0 900 410" className="h-auto w-full min-w-[860px]" role="img" aria-label="Client IP configuration overview with gateway DNS and remote server">
        <Note x={450} y={25} text="192.168.1.100/24 | GW 192.168.1.1 | DNS 8.8.8.8 | DHCP 192.168.1.1" color="#94a3b8" size={10.5} />
        <Node x={45} y={155} w={150} h={70} label="CLIENT" sub="192.168.1.100" color="#38bdf8" tooltip="Client PC" active />
        <Node x={275} y={85} w={150} h={62} label="SW1" sub="L2 switch" color="#64748b" tooltip="Local switch" active={s <= 2} />
        <Node x={490} y={85} w={165} h={62} label="GW / DHCP" sub="192.168.1.1" color="#f59e0b" tooltip="Default gateway and DHCP server" active={s !== 3} />
        <Node x={700} y={85} w={155} h={62} label="DNS" sub="8.8.8.8" color="#a78bfa" tooltip="DNS server" active={s >= 3} />
        <Node x={700} y={255} w={155} h={62} label="REMOTE" sub="web server" color="#34d399" tooltip="Remote server" active={s >= 3} />

        <LinkLine x1={195} y1={180} x2={275} y2={116} color="#38bdf8" active={s <= 2} />
        <LinkLine x1={425} y1={116} x2={490} y2={116} color="#f59e0b" active={s === 0 || s === 2 || s === 4} />
        <LinkLine x1={655} y1={116} x2={700} y2={116} color="#a78bfa" active={s >= 3} />
        <LinkLine x1={777} y1={147} x2={777} y2={255} color="#34d399" active={s >= 3} />

        {(s === 0 || s === 1) && <Packet point={{ x: 235, y: 145 }} color="#38bdf8" label="local" />}
        {(s === 2 || s === 4) && <Packet point={{ x: 460, y: 116 }} color="#f59e0b" label="remote" />}
        {s >= 3 && <Packet point={{ x: 777, y: 205 }} color="#a78bfa" label="lookup" />}

        <Panel
          x={60}
          y={270}
          w={330}
          h={108}
          title={s === 0 ? 'PARAMETERS TO CHECK' : s === 1 ? 'LOCAL SUBNET' : s === 2 ? 'DEFAULT GATEWAY' : 'DNS + RESULT'}
          lines={
            s === 0
              ? ['IPv4 / IPv6', 'Mask / prefix', 'Gateway / DNS / DHCP', 'MAC + adapter state']
              : s === 1
                ? ['Address: 192.168.1.100', 'Mask: 255.255.255.0', 'Network: 192.168.1.0/24', 'Local destinations use ARP']
                : s === 2
                  ? ['Remote network? send to 192.168.1.1', 'Gateway must be in the same /24', 'Without it: local only']
                  : ['DNS 8.8.8.8 resolves names', 'example.com -> IP address', 'Then connect to remote server']
          }
          color={s === 2 ? '#f59e0b' : s >= 3 ? '#a78bfa' : '#38bdf8'}
          active
        />
        <Note x={450} y={398} text={s === 4 ? 'Missing or wrong parameter = specific symptom' : 'IP + mask + gateway + DNS work together'} color="#94a3b8" />
      </svg>
    </StepShell>
  )
}

const windowsStages = [
  'في Windows، `ipconfig` سريع ويوري IPv4 و Subnet Mask و Default Gateway بس. `ipconfig /all` يوري التفاصيل الكاملة.',
  'الـ output الأساسي: `IPv4 Address` و`Subnet Mask` و`Default Gateway`. مفيد لفحص سريع.',
  'اللي مش موجود في `ipconfig`: Host Name و Physical Address و DHCP state والـ lease times والـ DNS servers.',
  '`ipconfig /all` بيضيف Host Name و MAC وDHCP Enabled و Lease Obtained / Expires و DHCP Server و DNS Servers و IPv6.',
  '`ipconfig /release` و`/renew` للت DHCP IPv4 فقط حسب حالة Adapter. `/flushdns` بيطهّر DNS cache ومش بيجدّد IP.',
]

export function WindowsIpconfigCompareDiagram() {
  const playback = useStepPlayback(windowsStages.length)
  const s = playback.stage
  return (
    <StepShell title="WINDOWS ipconfig vs ipconfig /all" playback={playback} legend={windowsStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Comparison of Windows ipconfig and ipconfig all output fields">
        <Note x={460} y={24} text="SAME ADAPTER - TWO LEVELS OF DETAIL" color="#94a3b8" size={11} />
        <CodePanel
          x={35}
          y={55}
          w={400}
          h={220}
          title="ipconfig"
          lines={[
            'Windows IP Configuration',
            'Ethernet adapter Ethernet:',
            '   IPv4 Address . . . : 192.168.1.100',
            '   Subnet Mask . . . . : 255.255.255.0',
            '   Default Gateway . . : 192.168.1.1',
          ]}
          color="#38bdf8"
          active={s <= 2}
          highlight={s === 1 ? [2, 3, 4] : []}
        />
        <CodePanel
          x={485}
          y={55}
          w={400}
          h={270}
          title="ipconfig /all"
          lines={[
            'Host Name . . . . . . : PC1',
            'Physical Address . . : 00-1A-2B-3C-4D-5E',
            'DHCP Enabled . . . . : Yes',
            'IPv4 Address . . . . : 192.168.1.100',
            'Subnet Mask . . . . . : 255.255.255.0',
            'Lease Obtained . . . : 21 November 2026 09:10',
            'Lease Expires . . . . : 22 November 2026 09:10',
            'Default Gateway . . . : 192.168.1.1',
            'DHCP Server . . . . . : 192.168.1.1',
            'DNS Servers . . . . . : 8.8.8.8',
          ]}
          color="#a78bfa"
          active={s >= 3}
          highlight={s === 3 ? [0, 1, 2, 5, 6, 8, 9] : []}
        />
        <Panel
          x={35}
          y={300}
          w={400}
          h={82}
          title={s === 2 ? 'MISSING FROM BASIC OUTPUT' : 'DHCP COMMANDS'}
          lines={
            s === 2
              ? ['Host name / MAC / DHCP state', 'Lease times / DHCP server', 'DNS servers / IPv6 details']
              : ['release -> give up DHCP lease', 'renew -> request a new lease', 'flushdns -> clear name cache only']
          }
          color={s === 2 ? '#fb7185' : '#f59e0b'}
          active
        />
        <Note x={460} y={408} text={s === 4 ? 'flushdns does not change the IP address' : 'Use /all when you need proof of source and lease'} color="#94a3b8" />
      </svg>
    </StepShell>
  )
}

const linuxAddrStages = [
  '`ip addr` هو أول أمر في Linux لفحص الواجهات والعناوين. كل واجهة ليها index واسم وحالة و MAC وعناوين IPv4 و IPv6.',
  'السطر الأول بيوري اسم الواجهة وحالتها: `eth0` و `state UP` يعني الواجهة شغالة. لو `DOWN` يبقى فيها مشكلة.',
  '`link/ether` بيوري الـ MAC Address. ده نفس مفهوم Physical Address في Windows.',
  '`inet 192.168.1.100/24` يعني IPv4 address و prefix length. الـ /24 يعني Subnet Mask 255.255.255.0.',
  '`inet6 fe80::...` Link-Local، و`inet6 2001:...` GUA. الـ `lo` هو loopback مش واجهة شبكة خارجية.',
]

export function LinuxIpAddrDiagram() {
  const playback = useStepPlayback(linuxAddrStages.length)
  const s = playback.stage
  return (
    <StepShell title="LINUX ip addr OUTPUT BREAKDOWN" playback={playback} legend={linuxAddrStages[s]}>
      <svg viewBox="0 0 920 410" className="h-auto w-full min-w-[880px]" role="img" aria-label="Linux ip addr representative output annotated line by line">
        <Note x={460} y={24} text="REPRESENTATIVE OUTPUT - NAMES AND FORMAT VARY BY DISTRO" color="#94a3b8" size={10} />
        <CodePanel
          x={35}
          y={52}
          w={500}
          h={300}
          title="$ ip addr"
          lines={[
            '1: lo: <LOOPBACK,UP> mtu 65536',
            '    inet 127.0.0.1/8 scope host lo',
            '    inet6 ::1/128 scope host',
            '2: eth0: <BROADCAST,UP> mtu 1500',
            '    link/ether 00:1a:2b:3c:4d:5e brd ff:ff:ff:ff:ff:ff',
            '    inet 192.168.1.100/24 brd 192.168.1.255',
            '    inet6 fe80::21a:2bff:fe3c:4d5e/64 scope link',
            '    inet6 2001:db8:1::100/64 scope global',
          ]}
          color="#38bdf8"
          active
          highlight={s === 1 ? [3] : s === 2 ? [4] : s === 3 ? [5] : s === 4 ? [6, 7] : []}
        />
        <Panel
          x={565}
          y={52}
          w={320}
          h={300}
          title={s === 0 ? 'WHAT TO READ' : s === 1 ? 'INTERFACE + STATE' : s === 2 ? 'MAC ADDRESS' : s === 3 ? 'IPv4 + PREFIX' : 'IPv6 + LOOPBACK'}
          lines={
            s === 0
              ? ['Interface name', 'State (UP / DOWN)', 'MAC address', 'IPv4 / IPv6 + prefix']
              : s === 1
                ? ['eth0 = interface name', '<UP> = link is active', 'lo = loopback interface', 'mtu = max frame size']
                : s === 2
                  ? ['link/ether = MAC', '00:1a:2b:3c:4d:5e', 'Used for local L2 delivery', 'Same idea as getmac on Windows']
                  : s === 3
                    ? ['inet = IPv4 address', '/24 = prefix length', '= mask 255.255.255.0', 'brd = broadcast address']
                    : ['fe80:: = link-local IPv6', '2001:db8:: = global IPv6', '::1 = loopback IPv6', 'scope shows reachability']
          }
          color={s >= 4 ? '#a78bfa' : '#34d399'}
          active
        />
        <Note x={460} y={390} text={s === 4 ? 'Do not treat lo as a real LAN adapter' : 'ip addr combines address, mask, MAC and state in one command'} color="#94a3b8" />
      </svg>
    </StepShell>
  )
}

const linuxRouteStages = [
  '`ip route` بيوري جدول التوجيه. أهم سطر هو `default via ...` لأنه بيقول مين الـ Default Gateway.',
  '`default` يعني أي destination مش موجود في route أخص. `via 192.168.1.1` هو الـ gateway.',
  '`dev eth0` يعني اخرج من الواجهة eth0. لو الواجهة غلط، الـ packet مش هيوصل.',
  'السطر التاني `192.168.1.0/24 dev eth0` معناه الشبكة المتصلة مباشرة؛ مفيش gateway محتاج هنا.',
  '`metric` بيُستخدم للمقارنة بين أكتر من route. الأقل metric غالباً يتفضّل. الاعتماد على الإصدار والتوزيعة.',
]

export function LinuxIpRouteDiagram() {
  const playback = useStepPlayback(linuxRouteStages.length)
  const s = playback.stage
  return (
    <StepShell title="LINUX ip route BREAKDOWN" playback={playback} legend={linuxRouteStages[s]}>
      <svg viewBox="0 0 900 380" className="h-auto w-full min-w-[860px]" role="img" aria-label="Linux ip route representative output showing default gateway and connected route">
        <Note x={450} y={24} text="ROUTING TABLE - READ THE DEFAULT LINE FIRST" color="#94a3b8" size={11} />
        <CodePanel
          x={40}
          y={55}
          w={500}
          h={150}
          title="$ ip route"
          lines={[
            'default via 192.168.1.1 dev eth0 metric 100',
            '192.168.1.0/24 dev eth0 proto kernel scope link',
            '169.254.0.0/16 dev eth0 scope link metric 1000',
          ]}
          color="#38bdf8"
          active
          highlight={s === 1 ? [0] : s === 2 ? [0] : s === 3 ? [1] : s === 4 ? [0, 2] : []}
        />
        <Panel
          x={570}
          y={55}
          w={300}
          h={150}
          title={s === 0 ? 'TWO MAIN LINES' : s === 1 ? 'DEFAULT' : s === 2 ? 'DEV' : s === 3 ? 'CONNECTED' : 'METRIC'}
          lines={
            s === 0
              ? ['default via ...', 'connected network route', 'optional APIPA route']
              : s === 1
                ? ['default = all unknown dst', 'via = next-hop gateway', '192.168.1.1 is the router']
                : s === 2
                  ? ['dev = outgoing interface', 'eth0 must be UP', 'Wrong dev = wrong path']
                  : s === 3
                    ? ['192.168.1.0/24 is local', 'No gateway needed', 'proto kernel = added by kernel']
                    : ['Lower metric is preferred', 'Used when routes overlap', 'Check with multiple NICs / VPN']
          }
          color={s === 3 ? '#34d399' : '#f59e0b'}
          active
        />
        <Panel
          x={40}
          y={235}
          w={830}
          h={100}
          title="QUICK QUESTION: WHERE DOES A PACKET TO 8.8.8.8 GO?"
          lines={['Not in 192.168.1.0/24 -> match default route -> send to 192.168.1.1 out of eth0']}
          color="#a78bfa"
          active
        />
        <Note x={450} y={362} text="ip -6 route shows the IPv6 routing table" color="#94a3b8" />
      </svg>
    </StepShell>
  )
}

const macStages = [
  'في macOS في أكتر من أمر؛ كل أمر بيعطي جزء مختلف. لازم تتأكد من اسم الواجهة قبل ما تفترض إنها `en0`.',
  '`ifconfig` يوري interface state و MAC والـ IPv4 و IPv6. شكله قريب من `ip addr` في Linux.',
  '`ipconfig getifaddr en0` يرجّع IPv4 بس. `ipconfig getpacket en0` يوري DHCP details زي server و lease.',
  '`networksetup -getinfo Wi-Fi` يوري IP و Subnet Mask و Router و DNS. اسم الخدمة `Wi-Fi` مش مضمون في كل جهاز.',
  '`scutil --dns` و`route -n get default` و`arp -a` بيكملوا الصورة: DNS والـ default gateway والـ neighbor cache.',
]

export function MacOsConfigOverviewDiagram() {
  const playback = useStepPlayback(macStages.length)
  const s = playback.stage
  return (
    <StepShell title="macOS NETWORK CONFIGURATION OVERVIEW" playback={playback} legend={macStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="macOS network configuration commands overview">
        <Note x={460} y={24} text="CHECK INTERFACE NAME FIRST - en0 IS NOT ALWAYS Wi-Fi" color="#94a3b8" size={10.5} />
        <CodePanel
          x={35}
          y={55}
          w={410}
          h={250}
          title="$ ifconfig en0"
          lines={[
            'en0: flags=8863<UP,BROADCAST> mtu 1500',
            '    ether 00:1a:2b:3c:4d:5e',
            '    inet 192.168.1.100 netmask 0xffffff00',
            '    inet6 fe80::21a:2bff:fe3c:4d5e%en0',
            '    status: active',
          ]}
          color="#38bdf8"
          active={s <= 1}
          highlight={s === 1 ? [0, 1, 2, 3, 4] : []}
        />
        <CodePanel
          x={475}
          y={55}
          w={410}
          h={250}
          title="$ networksetup -getinfo Wi-Fi"
          lines={[
            'DHCP Configuration',
            'IP address: 192.168.1.100',
            'Subnet mask: 255.255.255.0',
            'Router: 192.168.1.1',
            'DNS Servers: 8.8.8.8',
          ]}
          color="#a78bfa"
          active={s >= 3}
          highlight={s === 3 ? [0, 1, 2, 3, 4] : []}
        />
        <Panel
          x={35}
          y={320}
          w={410}
          h={58}
          title="ipconfig (macOS specific)"
          lines={['getifaddr en0 -> IPv4 only | getpacket en0 -> DHCP data']}
          color="#f59e0b"
          active={s === 2 || s === 0}
        />
        <Panel
          x={475}
          y={320}
          w={410}
          h={58}
          title="Extra checks"
          lines={['scutil --dns | route -n get default | arp -a']}
          color="#34d399"
          active={s === 4 || s === 0}
        />
        <Note x={460} y={392} text={s === 4 ? 'Service names and interface names vary by Mac model and configuration' : 'Do not assume en0 or Wi-Fi without listing them'} color="#94a3b8" />
      </svg>
    </StepShell>
  )
}

const gatewayStages = [
  'الـ client بيقارن الـ destination بـ `192.168.1.0/24`. لو الهدف جوّه الشبكة يبقى local، ولو بره يروح للـ gateway.',
  'مثال `192.168.1.50` جوّه نفس الـ /24: الـ client يعمل ARP مباشرة ويرسل للـ MAC بتاع PC2.',
  'مثال `8.8.8.8` بره الـ /24: الـ client يعمل ARP للـ gateway `192.168.1.1` ويحطه كـ next hop.',
  'الراوتر يستلم الـ packet، يقلّل TTL، ويوجّهه ناحية الإنترنت. الـ source IP يفضل IP بتاع الـ client غالباً behind NAT.',
  'لو الـ gateway ناقص: الـ client يقدر يوصل للمحليين بس، وأي ping لعنوان بعيد هيقول Destination host unreachable أو timeout.',
  'لو الـ gateway في subnet تانية أو unreachable: الـ ARP للـ gateway ما بينجحش، فمفيش packet هيتخرج من الـ LAN.',
]

export function DefaultGatewayPathDiagram() {
  const playback = useStepPlayback(gatewayStages.length)
  const s = playback.stage
  return (
    <StepShell title="DEFAULT GATEWAY PACKET PATH" playback={playback} legend={gatewayStages[s]}>
      <svg viewBox="0 0 900 420" className="h-auto w-full min-w-[860px]" role="img" aria-label="Default gateway packet path for local and remote destinations">
        <Note x={450} y={24} text="CLIENT 192.168.1.100/24 - GATEWAY 192.168.1.1 - REMOTE 8.8.8.8" color="#94a3b8" size={10.5} />
        <Node x={45} y={150} w={165} h={74} label="CLIENT" sub="192.168.1.100" color="#38bdf8" tooltip="Client" active />
        <Node x={280} y={75} w={140} h={60} label="PC2" sub="192.168.1.50" color="#34d399" tooltip="Local host" active={s === 1} />
        <Node x={280} y={235} w={140} h={60} label="SW1" sub="Layer 2" color="#64748b" tooltip="Switch" active={s <= 3} />
        <Node x={500} y={150} w={150} h={74} label="R1" sub="192.168.1.1" color="#f59e0b" tooltip="Default gateway" active={s !== 4} />
        <Node x={730} y={150} w={130} h={74} label="REMOTE" sub="8.8.8.8" color="#a78bfa" tooltip="Remote server" active={s === 3} />

        <LinkLine x1={210} y1={175} x2={280} y2={105} color="#34d399" active={s === 1} />
        <LinkLine x1={210} y1={195} x2={280} y2={265} color="#38bdf8" active={s === 0 || s === 2 || s === 4 || s === 5} />
        <LinkLine x1={420} y1={265} x2={500} y2={200} color="#f59e0b" active={s === 2 || s === 3 || s === 5} />
        <LinkLine x1={650} y1={187} x2={730} y2={187} color="#a78bfa" active={s === 3} />

        {(s === 0 || s === 1) && <Packet point={{ x: 245, y: 135 }} color="#34d399" label="local ARP" />}
        {(s === 2 || s === 3) && <Packet point={{ x: 460, y: 230 }} color="#f59e0b" label="via GW" />}
        {(s === 4 || s === 5) && <Packet point={{ x: 245, y: 245 }} color="#fb7185" label="blocked" />}

        <Panel
          x={55}
          y={325}
          w={790}
          h={70}
          title={s === 0 ? 'ON-LINK CHECK WITH /24' : s === 1 ? 'LOCAL DESTINATION' : s === 2 ? 'REMOTE DESTINATION' : s === 3 ? 'ROUTER FORWARDS' : 'GATEWAY PROBLEM'}
          lines={
            s === 0
              ? ['Client network = 192.168.1.0/24. Compare destination with this range.']
              : s === 1
                ? ['Destination 192.168.1.50 is inside /24 -> ARP for PC2 MAC directly.']
                : s === 2
                  ? ['8.8.8.8 is outside /24 -> ARP for 192.168.1.1 and use it as next hop.']
                  : s === 3
                    ? ['R1 receives the frame, decrements TTL, forwards toward 8.8.8.8.']
                    : s === 4
                      ? ['No gateway configured -> remote IP unreachable. Local LAN may still work.']
                      : ['Wrong subnet or unreachable gateway -> ARP for gateway fails -> no remote traffic.']
          }
          color={s >= 4 ? '#fb7185' : '#38bdf8'}
          active
        />
      </svg>
    </StepShell>
  )
}

const dnsStages = [
  'DNS بيحوّل الاسم اللي الإنسان بيفهمه زي `example.com` لـ IP يقدر الـ client يستخدمه. ده غير الـ default gateway تماماً.',
  'التطبيق يسأل الـ resolver المحلي: «إيه IP بتاع example.com؟». لو الاسم في الـ cache يرجع فوراً.',
  'لو مش في الـ cache، الـ client يبعت استعلام DNS للـ server `8.8.8.8`. الـ server يرجع A record بالـ IP.',
  'الـ client ياخد الـ IP ويبدأ اتصال حقيقي بالـ remote server. هنا يظهر الفرق بين name resolution و connectivity.',
  'لو `ping 8.8.8.8` شغال بس `ping example.com` فاشل، فالـ IP connectivity تمام والـ DNS عنده مشكلة.',
  'DNS server ممكن يجي من DHCP أو يتكتب manual. افحص المصدر في `ipconfig /all` أو `resolvectl status` أو `scutil --dns`.',
]

export function DnsResolutionFlowDiagram() {
  const playback = useStepPlayback(dnsStages.length)
  const s = playback.stage
  return (
    <StepShell title="DNS RESOLUTION FLOW" playback={playback} legend={dnsStages[s]}>
      <svg viewBox="0 0 900 400" className="h-auto w-full min-w-[860px]" role="img" aria-label="DNS resolution flow from hostname to IP address">
        <Note x={450} y={24} text="example.com -> DNS QUERY -> IP ADDRESS -> CONNECTION" color="#94a3b8" size={11} />
        <Node x={45} y={120} w={150} h={70} label="CLIENT" sub="ping example.com" color="#38bdf8" tooltip="Client" active />
        <Node x={265} y={120} w={150} h={70} label="RESOLVER" sub="local cache" color="#64748b" tooltip="Stub resolver" active={s <= 1} />
        <Node x={485} y={120} w={150} h={70} label="DNS" sub="8.8.8.8" color="#a78bfa" tooltip="DNS server" active={s >= 2} />
        <Node x={710} y={120} w={145} h={70} label="WEB" sub="returned IP" color="#34d399" tooltip="Remote web server" active={s >= 3} />

        <LinkLine x1={195} y1={155} x2={265} y2={155} color="#38bdf8" active={s <= 1} />
        <LinkLine x1={415} y1={155} x2={485} y2={155} color="#a78bfa" active={s >= 2} />
        <LinkLine x1={635} y1={155} x2={710} y2={155} color="#34d399" active={s >= 3} />

        {(s === 1 || s === 2) && <Packet point={{ x: 230, y: 155 }} color="#38bdf8" label="query" />}
        {(s === 2 || s === 3) && <Packet point={{ x: 560, y: 155 }} color="#a78bfa" label="A record" />}
        {s === 3 && <Packet point={{ x: 672, y: 155 }} color="#34d399" label="connect" />}

        <Panel
          x={60}
          y={245}
          w={360}
          h={105}
          title={s === 4 ? 'SYMPTOM TO REMEMBER' : 'DNS ANSWER'}
          lines={
            s === 4
              ? ['ping 8.8.8.8 works', 'ping example.com fails', 'Investigate DNS server / suffix']
              : ['A record: example.com -> IP', 'IP shown here is representative', 'Then TCP connection starts']
          }
          color={s === 4 ? '#fb7185' : '#a78bfa'}
          active
        />
        <Panel
          x={480}
          y={245}
          w={360}
          h={105}
          title="VERIFY COMMANDS"
          lines={['Windows: nslookup example.com', 'Linux/macOS: nslookup example.com', 'Also: resolvectl status / scutil --dns']}
          color="#34d399"
          active
        />
        <Note x={450} y={382} text={s === 5 ? 'DNS source can be DHCP or manual configuration' : 'Name resolution happens before the real connection'} color="#94a3b8" />
      </svg>
    </StepShell>
  )
}

const dhcpStages = [
  'لما DHCP Enabled = Yes، الـ client ياخد IP وmask وgateway وDNS من الـ DHCP server. زي ما اتكلمنا في 1.7: DORA.',
  '`DHCP Enabled: Yes` معناه الواجهة تطلب إعدادات تلقائي. لو `No` يبقى العنوان غالباً manual/static.',
  '`DHCP Server: 192.168.1.1` بيقول مين اللي قدّم الـ lease. لو APIPA، غالباً مفيش DHCP server رد.',
  '`Lease Obtained` و`Lease Expires` بيوريوا بداية ونهاية الـ lease. قبل نهايته الـ client يحاول يجدّده.',
  '`ipconfig /release` يتخلى عن الـ lease، و`/renew` يطلب واحد جديد. ده مش زي `/flushdns` اللي بيطهّر DNS cache بس.',
  'في Linux و macOS، الـ IP Commands بتوري العنوان، بس تفاصيل الـ DHCP بتظهر في أدوات زي `nmcli device show` أو `ipconfig getpacket`.',
]

export function DhcpLeaseDiagram() {
  const playback = useStepPlayback(dhcpStages.length)
  const s = playback.stage
  const dora = [
    { label: 'DISCOVER', x: 60, color: '#38bdf8' },
    { label: 'OFFER', x: 260, color: '#a78bfa' },
    { label: 'REQUEST', x: 460, color: '#f59e0b' },
    { label: 'ACK', x: 660, color: '#34d399' },
  ]
  return (
    <StepShell title="DHCP LEASE INFORMATION AND RENEWAL" playback={playback} legend={dhcpStages[s]}>
      <svg viewBox="0 0 900 400" className="h-auto w-full min-w-[860px]" role="img" aria-label="DHCP lease fields DORA and renewal behavior">
        <Note x={450} y={24} text="DORA RECAP + FIELDS YOU MUST VERIFY" color="#94a3b8" size={11} />
        {dora.map((item, index) => (
          <g key={item.label} opacity={s === 0 || s === 4 ? 1 : 0.55}>
            <rect x={item.x} y={55} width={160} height={54} rx="10" fill="#0b1224" stroke={item.color} strokeWidth={s === 0 ? 2.4 : 1.2} />
            <SvgText x={item.x + 80} y={88} color={item.color} size={11} bold>{item.label}</SvgText>
            {index < dora.length - 1 && <Note x={item.x + 185} y={88} text="→" color="#64748b" size={16} />}
          </g>
        ))}
        <CodePanel
          x={45}
          y={145}
          w={420}
          h={175}
          title="Windows ipconfig /all"
          lines={[
            'DHCP Enabled . . . . : Yes',
            'DHCP Server . . . . . : 192.168.1.1',
            'Lease Obtained . . . : 21 November 2026 09:10',
            'Lease Expires . . . . : 22 November 2026 09:10',
          ]}
          color="#38bdf8"
          active
          highlight={s === 1 ? [0] : s === 2 ? [1] : s === 3 ? [2, 3] : []}
        />
        <Panel
          x={500}
          y={145}
          w={355}
          h={175}
          title={s === 0 ? 'LEASE = TEMPORARY' : s === 4 ? 'RELEASE / RENEW' : s === 5 ? 'OTHER OS' : 'LEASE TIMES'}
          lines={
            s === 0
              ? ['IP is borrowed for a time', 'Client renews before expiry', 'DORA happens at start']
              : s === 4
                ? ['release -> drop current lease', 'renew -> send DHCP request', 'Works for DHCP IPv4 adapters']
                : s === 5
                  ? ['Linux: nmcli device show', 'macOS: ipconfig getpacket en0', 'Check service / interface name']
                  : ['Obtained = start time', 'Expires = end time', 'Renewal starts before expiry']
          }
          color={s === 4 ? '#f59e0b' : '#34d399'}
          active
        />
        <Note x={450} y={355} text={s === 1 ? 'DHCP Enabled = No usually means static configuration' : 'APIPA is not a normal DHCP lease'} color="#94a3b8" />
      </svg>
    </StepShell>
  )
}

const apipaStages = [
  'APIPA يعني `Automatic Private IP Addressing`. Windows يختار عنوان من `169.254.0.0/16` لما مفيش DHCP متاح.',
  'مثال `169.254.12.34`. العنوان يسمح باتصال محدود جداً على نفس الـ link، لكنه مش بديل عن DHCP.',
  'الأعراض: مفيش gateway صحيح، مفيش إنترنت، وغالباً DNS هيبقى غير مفيد. `ipconfig` هيوري العنوان ده.',
  'الأسباب: كابل/واي فاي مش متصل، DHCP server down، VLAN أو scope كامل، أو DHCP relay مش شغال.',
  'التشخيص: افحص الواجهة، أعد `ipconfig /renew`، افحص DHCP server والـ scope، وبعدين راجع الـ gateway.',
]

export function ApipaTroubleshootingDiagram() {
  const playback = useStepPlayback(apipaStages.length)
  const s = playback.stage
  return (
    <StepShell title="APIPA TROUBLESHOOTING" playback={playback} legend={apipaStages[s]}>
      <svg viewBox="0 0 900 390" className="h-auto w-full min-w-[860px]" role="img" aria-label="APIPA address 169.254.12.34 troubleshooting flow">
        <Note x={450} y={24} text="169.254.0.0/16 - LINK-LOCAL FALLBACK, NOT A DHCP LEASE" color="#94a3b8" size={10.5} />
        <CodePanel
          x={45}
          y={55}
          w={360}
          h={130}
          title="ipconfig"
          lines={['IPv4 Address . . . : 169.254.12.34', 'Subnet Mask . . . . : 255.255.0.0', 'Default Gateway . . : (blank)']}
          color="#f59e0b"
          active
          highlight={s === 2 ? [0, 1, 2] : []}
        />
        <Node x={470} y={65} w={160} h={64} label="CLIENT" sub="169.254.12.34" color="#f59e0b" tooltip="Client with APIPA" active />
        <Node x={700} y={65} w={150} h={64} label="DHCP" sub="no reply" color="#64748b" tooltip="DHCP server" active={s === 3} />
        <LinkLine x1={630} y1={97} x2={700} y2={97} color="#fb7185" active={s === 3 || s === 4} dashed />

        <Panel
          x={45}
          y={210}
          w={810}
          h={130}
          title={s === 0 ? 'WHAT IS APIPA?' : s === 1 ? 'WHAT IT CAN DO' : s === 2 ? 'WHAT YOU SEE' : s === 3 ? 'LIKELY CAUSES' : 'FIX PATH'}
          lines={
            s === 0
              ? ['Windows picks 169.254.x.y when no DHCP offer arrives', 'Range: 169.254.0.0/16']
              : s === 1
                ? ['Limited local-link communication only', 'No default gateway, no normal internet access']
                : s === 2
                  ? ['IPv4 starts with 169.254', 'Mask 255.255.0.0', 'Default gateway usually empty']
                  : s === 3
                    ? ['Cable / Wi-Fi down, DHCP server down', 'VLAN mismatch, scope full, relay missing']
                    : ['Check link -> renew IP -> check DHCP', 'Then verify gateway and DNS again']
          }
          color={s >= 3 ? '#fb7185' : '#f59e0b'}
          active
        />
        <Note x={450} y={370} text={s === 4 ? 'Never report APIPA as a healthy DHCP lease' : 'APIPA points you toward DHCP or Layer 2 problems'} color="#94a3b8" />
      </svg>
    </StepShell>
  )
}

const workflowStages = [
  'التشخيص المنظّم بيمنع التخبط. ابدأ من الطبقة 1 واصعد للـ IP والـ gateway والـ DNS. كل خطوة بتثبت حاجة وبتنفي حاجة تانية.',
  '1-4: الواجهة شغالة؟ العنوان موجود؟ الماسك صح؟ الجateway في نفس الشبكة؟',
  '5-8: DNS مكتوب؟ ping 127.0.0.1 يثبت الـ TCP/IP stack؟ ping IP بتاعك؟ ping جهاز في نفس الـ subnet؟',
  '9-12: ping الجateway؟ ping IP بعيد زي 8.8.8.8؟ nslookup للاسم؟ tracert لو لسه فيه مشكلة؟',
  'لو وقفت عند خطوة، متدخلش في خطوات بعدها. مثال: لو مفيش gateway، مفيش داعي تلوم DNS.',
  'سجّل النتيجة بعد كل اختبار. ده اللي بيخليك تحدد السبب بسرعة في الامتحان وفي الشغل.',
]

export function ConnectivityWorkflowDiagram() {
  const playback = useStepPlayback(workflowStages.length)
  const s = playback.stage
  const tests = [
    '1 Interface UP?', '2 IP assigned?', '3 Mask / prefix?', '4 Gateway in subnet?',
    '5 DNS server?', '6 ping 127.0.0.1', '7 ping own IP', '8 ping same subnet',
    '9 ping gateway', '10 ping remote IP', '11 nslookup name', '12 tracert / traceroute',
  ]
  const groupColor = (index: number) => (index < 4 ? '#38bdf8' : index < 8 ? '#a78bfa' : '#34d399')
  const activeGroup = s <= 1 ? 0 : s === 2 ? 1 : s >= 3 && s <= 4 ? 2 : 3
  return (
    <StepShell title="END-TO-END CONNECTIVITY TROUBLESHOOTING" playback={playback} legend={workflowStages[s]}>
      <svg viewBox="0 0 920 410" className="h-auto w-full min-w-[880px]" role="img" aria-label="Twelve step client connectivity troubleshooting workflow">
        <Note x={460} y={24} text="PHYSICAL -> IP -> MASK -> GATEWAY -> DNS -> PATH" color="#94a3b8" size={11} />
        {tests.map((test, index) => {
          const col = index % 4
          const row = Math.floor(index / 4)
          const x = 35 + col * 220
          const y = 60 + row * 85
          const group = index < 4 ? 0 : index < 8 ? 1 : 2
          const active = s === 0 || group === activeGroup
          return (
            <g key={test} opacity={active ? 1 : 0.38}>
              <rect x={x} y={y} width={195} height={58} rx="10" fill="#0b1224" stroke={groupColor(index)} strokeWidth={active ? 2.4 : 1.1} />
              <SvgText x={x + 97} y={y + 25} color={groupColor(index)} size={10} bold>{test.split(' ')[0]}</SvgText>
              <SvgText x={x + 97} y={y + 43} color="#cbd5e1" size={8.5}>{test.slice(test.indexOf(' ') + 1)}</SvgText>
            </g>
          )
        })}
        <Panel
          x={35}
          y={305}
          w={850}
          h={72}
          title={s === 0 ? 'RULE: FIX THE LOWEST FAILING LAYER FIRST' : s === 5 ? 'STOP AT THE FIRST FAILURE' : 'WHAT EACH STEP PROVES'}
          lines={
            s === 0
              ? ['Do not jump to DNS before you know the interface and gateway are healthy.']
              : s === 5
                ? ['If ping gateway fails, remote IP and DNS tests cannot fix the real problem.']
                : ['Loopback = stack, own IP = stack + address, gateway = L3 path, nslookup = name service.']
          }
          color={activeGroup === 2 ? '#34d399' : '#38bdf8'}
          active
        />
        <Note x={460} y={400} text={s === 3 ? 'remote IP works + name fails = DNS problem' : 'Record results; do not change many things at once'} color="#94a3b8" />
      </svg>
    </StepShell>
  )
}

const compareRows = [
  { task: 'IP + mask', win: 'ipconfig /all', linux: 'ip addr', mac: 'ifconfig en0' },
  { task: 'Gateway', win: 'ipconfig /all', linux: 'ip route', mac: 'route -n get default' },
  { task: 'DNS', win: 'ipconfig /all / nslookup', linux: 'resolvectl status', mac: 'scutil --dns' },
  { task: 'MAC / neighbors', win: 'getmac / arp -a', linux: 'ip link / ip neigh', mac: 'arp -a / ifconfig' },
  { task: 'Connectivity', win: 'ping / tracert', linux: 'ping / traceroute', mac: 'ping / traceroute' },
]

export function OsCommandCompareDiagram() {
  const playback = useStepPlayback(compareRows.length + 1)
  const s = playback.stage
  return (
    <StepShell title="WINDOWS vs LINUX vs macOS COMMAND MAP" playback={playback} legend={s === 0 ? 'نفس المعلومة ليها أمر مختلف في كل نظام. ابدأ بالـ task، وبعدين اختار الأمر.' : `${compareRows[s - 1].task}: Windows → ${compareRows[s - 1].win} | Linux → ${compareRows[s - 1].linux} | macOS → ${compareRows[s - 1].mac}.`}>
      <svg viewBox="0 0 920 390" className="h-auto w-full min-w-[880px]" role="img" aria-label="Command comparison table for Windows Linux and macOS client IP verification">
        <Note x={460} y={24} text="SAME TASK - DIFFERENT COMMAND" color="#94a3b8" size={11} />
        <SvgText x={60} y={52} color="#64748b" size={9} anchor="start">TASK</SvgText>
        <SvgText x={245} y={52} color="#64748b" size={9} anchor="start">WINDOWS</SvgText>
        <SvgText x={465} y={52} color="#64748b" size={9} anchor="start">LINUX</SvgText>
        <SvgText x={685} y={52} color="#64748b" size={9} anchor="start">macOS</SvgText>
        {compareRows.map((row, index) => {
          const active = s === 0 || s === index + 1
          const y = 62 + index * 56
          return (
            <g key={row.task} opacity={active ? 1 : 0.36}>
              <rect x={45} y={y} width={830} height={48} rx="8" fill={active ? '#0f1d38' : '#0b1224'} stroke={active ? '#38bdf8' : '#1e293b'} strokeWidth={active ? 1.6 : 1} />
              <SvgText x={60} y={y + 29} color="#e2e8f0" size={9.5} anchor="start">{row.task}</SvgText>
              <SvgText x={245} y={y + 29} color="#38bdf8" size={9.5} anchor="start">{row.win}</SvgText>
              <SvgText x={465} y={y + 29} color="#a78bfa" size={9.5} anchor="start">{row.linux}</SvgText>
              <SvgText x={685} y={y + 29} color="#34d399" size={9.5} anchor="start">{row.mac}</SvgText>
            </g>
          )
        })}
        <Panel
          x={45}
          y={350}
          w={830}
          h={34}
          title="EXAM TIP"
          lines={['Command names differ; the parameters you verify are the same everywhere.']}
          color="#f59e0b"
          active
        />
      </svg>
    </StepShell>
  )
}
