import {
  LinkLine,
  Node,
  Packet,
  Shell,
  usePlayback,
} from './ArchitectureDiagrams'

const wanStages = [
  '`HQ Cairo` بيعت packet للـ WAN connection بتاع الشركة',
  'شبكة الـ WAN (MPLS / VPN / Internet) بتوجّه الـ packet للموقع التاني',
  'فرع `Alexandria` استلم الـ packet وردّ',
  'فرع `Aswan` بيوصل بنفس الـ WAN — أو بـ backup VPN لو المسار الأساسي فشل',
  'الرد بيرجع لـ `HQ Cairo` عبر نفس الـ provider أو المسار الاحتياطي',
]

export function WanDiagram() {
  const playback = usePlayback(wanStages.length)
  const path = [
    { x: 110, y: 125 },
    { x: 410, y: 165 },
    { x: 110, y: 270 },
    { x: 710, y: 270 },
    { x: 410, y: 165 },
  ]

  return (
    <Shell title="WAN / CAIRO · ALEXANDRIA · ASWAN" playback={playback} legend={wanStages[playback.stage]}>
      <svg viewBox="0 0 820 330" className="h-auto w-full min-w-[720px]" role="img" aria-label="WAN connecting three branches">
        <LinkLine x1={180} y1={125} x2={330} y2={155} active={playback.stage === 0} />
        <LinkLine x1={490} y1={165} x2={640} y2={125} active={playback.stage === 1} />
        <LinkLine x1={490} y1={175} x2={640} y2={268} active={playback.stage === 2} />
        <LinkLine x1={180} y1={280} x2={640} y2={280} color="#34d399" dashed active={playback.stage === 3} />
        <LinkLine x1={330} y1={155} x2={180} y2={125} color="#34d399" active={playback.stage === 4} />

        <Node x={40} y={95} w={140} h={60} label="HQ CAIRO" sub="Headquarters" color="#38bdf8" tooltip="Main office — the central site for branch traffic" active={playback.stage === 0 || playback.stage === 4} />
        <Node x={330} y={120} w={160} h={90} label="WAN CLOUD" sub="MPLS · VPN · Internet" color="#a78bfa" tooltip="Carrier or provider network that connects geographically separated LANs" active={playback.stage === 1 || playback.stage === 4} />
        <Node x={640} y={95} w={140} h={60} label="ALEXANDRIA" sub="Branch office" color="#60a5fa" tooltip="Branch LAN connected over the WAN" active={playback.stage === 1} />
        <Node x={640} y={240} w={140} h={60} label="ASWAN" sub="Branch office" color="#34d399" tooltip="Second branch — can use a backup IPsec VPN over the Internet" dashed active={playback.stage === 2 || playback.stage === 3} />

        <text x="410" y="245" textAnchor="middle" fill="#64748b" fontFamily="JetBrains Mono, monospace" fontSize="10">
          PRIVATE WAN (MPLS / LEASED LINE)  OR  IPSEC VPN OVER INTERNET  OR  SD-WAN
        </text>
        <text x="410" y="315" textAnchor="middle" fill="#64748b" fontFamily="JetBrains Mono, monospace" fontSize="10">
          WAN connects LANs in different cities — it is not the same thing as the public Internet
        </text>
        <Packet point={path[playback.stage]} color={playback.stage === 3 ? '#34d399' : '#38bdf8'} label="PACKET" />
      </svg>
    </Shell>
  )
}

const sohoStages = [
  '`Laptop` بعت request للـ `Wireless Router` (هو الـ default gateway)',
  'الراوتر عمل `NAT` للعنوان الداخلي وطبّق الـ `firewall`',
  'الـ `ISP` وصل الـ packet بالإنترنت',
  'الـ `Internet Server` ردّ على الطلب',
  'الراوتر فكّ الـ NAT ووجّه الرد للّابتوب',
  'نفس الراوتر كمان بيشغّل `DHCP` و`switch` و`access point` لكل أجهزة البيت',
]

export function SohoDiagram() {
  const playback = usePlayback(sohoStages.length)
  const path = [
    { x: 85, y: 269 },
    { x: 415, y: 150 },
    { x: 615, y: 70 },
    { x: 755, y: 70 },
    { x: 415, y: 150 },
    { x: 85, y: 269 },
  ]
  const endpoints = [
    { x: 30, label: 'Laptop', color: '#38bdf8' },
    { x: 180, label: 'Smartphone', color: '#60a5fa' },
    { x: 330, label: 'Smart TV', color: '#a78bfa' },
    { x: 480, label: 'Printer', color: '#fbbf24' },
  ]

  return (
    <Shell title="SOHO / ONE ROUTER · MANY FUNCTIONS" playback={playback} legend={sohoStages[playback.stage]}>
      <svg viewBox="0 0 820 330" className="h-auto w-full min-w-[720px]" role="img" aria-label="SOHO home network topology">
        {endpoints.map((endpoint) => (
          <LinkLine
            key={endpoint.label}
            x1={415}
            y1={180}
            x2={endpoint.x + 55}
            y2={245}
            color={endpoint.color}
            active={playback.stage === 0 || playback.stage === 5}
          />
        ))}
        <LinkLine x1={500} y1={140} x2={560} y2={85} active={playback.stage === 1 || playback.stage === 4} />
        <LinkLine x1={670} y1={70} x2={700} y2={70} active={playback.stage === 2 || playback.stage === 3} />

        <Node x={30} y={245} w={110} h={48} label="Laptop" sub="Wi-Fi client" color="#38bdf8" tooltip="Wireless endpoint in the home LAN" active={playback.stage === 0 || playback.stage === 5} />
        <Node x={180} y={245} w={110} h={48} label="Phone" sub="Wi-Fi client" color="#60a5fa" tooltip="Smartphone receives an IP address from DHCP" active={playback.stage === 5} />
        <Node x={330} y={245} w={110} h={48} label="Smart TV" sub="Wi-Fi client" color="#a78bfa" tooltip="Streaming device on the same home network" active={playback.stage === 5} />
        <Node x={480} y={245} w={110} h={48} label="Printer" sub="Shared device" color="#fbbf24" tooltip="Network printer shared by the home LAN" active={playback.stage === 5} />

        <Node x={330} y={120} w={170} h={60} label="Wireless Router" sub="NAT · DHCP · FW · AP" color="#34d399" tooltip="A SOHO router commonly combines routing, NAT, DHCP, firewall, switch ports, and Wi-Fi access point" active={playback.stage === 1 || playback.stage === 4 || playback.stage === 5} />
        <Node x={560} y={45} w={110} h={50} label="ISP" sub="Internet access" color="#fb7185" tooltip="Internet Service Provider — the link to the public Internet" active={playback.stage === 2} />
        <Node x={700} y={45} w={110} h={50} label="SERVER" sub="Internet" color="#a78bfa" tooltip="Remote server on the public Internet" active={playback.stage === 3} />

        <text x="415" y="315" textAnchor="middle" fill="#64748b" fontFamily="JetBrains Mono, monospace" fontSize="10">
          ONE SOHO DEVICE = ROUTER + SWITCH + ACCESS POINT + FIREWALL + NAT + DHCP
        </text>
        <Packet point={path[playback.stage]} color={playback.stage > 2 ? '#34d399' : '#38bdf8'} label={playback.stage === 5 ? 'DHCP' : 'PACKET'} />
      </svg>
    </Shell>
  )
}

const cloudStages = [
  '`Users` بيفتحوا تطبيق مستضاف جوه الـ data center بتاع الشركة',
  'سيرفر الـ `On-Premises` بيردّ — الشركة مالكة الهاردوير ومسؤولة عن صيانته',
  'نفس المستخدم بيفتح تطبيق في الـ `Cloud` عبر Internet أو `VPN`',
  'الـ `VM` في الـ cloud بيردّ — الـ provider بيدير الهاردوير والـ virtual network',
  '`Hybrid Cloud`: الـ on-prem بيعمل backup أو نسخ بيانات للـ cloud',
  'الأمان مش "cloud دايماً أأمن": المسؤولية بتعتمد على `IaaS / PaaS / SaaS` و`shared responsibility`',
]

export function CloudOnPremDiagram() {
  const playback = usePlayback(cloudStages.length)
  const path = [
    { x: 410, y: 275 },
    { x: 135, y: 130 },
    { x: 685, y: 130 },
    { x: 410, y: 275 },
    { x: 685, y: 130 },
    { x: 135, y: 130 },
  ]

  return (
    <Shell title="ON-PREMISES vs CLOUD / HYBRID" playback={playback} legend={cloudStages[playback.stage]}>
      <svg viewBox="0 0 820 340" className="h-auto w-full min-w-[720px]" role="img" aria-label="On-premises, cloud, and hybrid topology">
        <LinkLine x1={240} y1={140} x2={330} y2={255} active={playback.stage === 0 || playback.stage === 1} />
        <LinkLine x1={490} y1={255} x2={580} y2={140} color="#a78bfa" active={playback.stage === 2 || playback.stage === 3} />
        <LinkLine x1={240} y1={130} x2={580} y2={130} color="#34d399" dashed active={playback.stage === 4 || playback.stage === 5} />

        <Node x={30} y={80} w={210} h={100} label="ON-PREMISES" sub="Servers · Storage · Switches" color="#38bdf8" tooltip="Locally owned infrastructure in your own data center" active={playback.stage === 1 || playback.stage === 5} />
        <Node x={580} y={80} w={210} h={100} label="CLOUD PROVIDER" sub="VMs · Virtual Network · Storage" color="#a78bfa" tooltip="Provider-hosted infrastructure reached over the network" active={playback.stage === 2 || playback.stage === 4} />
        <Node x={330} y={250} w={160} h={55} label="USERS" sub="Branches / Internet" color="#fbbf24" tooltip="Employees accessing applications in either location" active={playback.stage === 0 || playback.stage === 3} />

        <text x="410" y="115" textAnchor="middle" fill="#34d399" fontFamily="JetBrains Mono, monospace" fontSize="9">
          VPN / DEDICATED LINK
        </text>
        <text x="410" y="325" textAnchor="middle" fill="#64748b" fontFamily="JetBrains Mono, monospace" fontSize="10">
          SECURITY DEPENDS ON THE DEPLOYMENT MODEL · SHARED RESPONSIBILITY · NOT AUTOMATICALLY "SAFER"
        </text>
        <Packet point={path[playback.stage]} color={playback.stage > 1 ? '#a78bfa' : '#38bdf8'} label={playback.stage === 4 ? 'BACKUP' : 'REQUEST'} />
      </svg>
    </Shell>
  )
}

interface Journey {
  tab: string
  nodes: { x: number; w: number; label: string; sub: string; color: string; tooltip: string }[]
  path: number[]
  legends: string[]
}

const journeys: Journey[] = [
  {
    tab: 'TWO-TIER',
    nodes: [
      { x: 20, w: 120, label: 'PC', sub: 'Endpoint', color: '#38bdf8', tooltip: 'Source endpoint' },
      { x: 200, w: 130, label: 'Access', sub: 'L2 switch', color: '#60a5fa', tooltip: 'Access layer — port and VLAN' },
      { x: 390, w: 150, label: 'Collapsed Core', sub: 'L3 routing', color: '#a78bfa', tooltip: 'Distribution + Core in one layer' },
      { x: 610, w: 140, label: 'Server', sub: 'Destination', color: '#fb7185', tooltip: 'Destination endpoint' },
    ],
    path: [0, 1, 2, 3],
    legends: [
      '`PC` بيجهّز الطلب ويبعت الـ frame للـ `default gateway`',
      'الـ `Access` بيوجّه الـ frame على الـ uplink',
      'الـ `Collapsed Core` بيعمل routing بين الـ VLANs',
      'السيرفر استلم الطلب — والرد يرجع بنفس المنطق',
    ],
  },
  {
    tab: 'THREE-TIER',
    nodes: [
      { x: 10, w: 110, label: 'PC', sub: 'Endpoint', color: '#38bdf8', tooltip: 'Source endpoint' },
      { x: 150, w: 120, label: 'Access', sub: 'Ports / VLAN', color: '#60a5fa', tooltip: 'Connects end devices' },
      { x: 300, w: 130, label: 'Distribution', sub: 'Policy / L3', color: '#a78bfa', tooltip: 'Routing, policies, and L2/L3 boundary' },
      { x: 460, w: 110, label: 'Core', sub: 'Fast transport', color: '#fbbf24', tooltip: 'High-speed backbone' },
      { x: 600, w: 140, label: 'Server', sub: 'Data center', color: '#fb7185', tooltip: 'Destination endpoint' },
    ],
    path: [0, 1, 2, 3, 4],
    legends: [
      '`PC` متصل بمنفذ الـ `Access Layer`',
      'الـ `Access` بيوجّه الـ frame داخل الـ VLAN',
      'الـ `Distribution` بيطبّق السياسات ويعمل routing',
      'الـ `Core` بيمرّر الـ packet بأقصى سرعة',
      'السيرفر استلم الطلب',
    ],
  },
  {
    tab: 'SPINE-LEAF',
    nodes: [
      { x: 10, w: 110, label: 'Server A', sub: 'Source', color: '#38bdf8', tooltip: 'Source server' },
      { x: 155, w: 105, label: 'Leaf 1', sub: 'Access', color: '#60a5fa', tooltip: 'Leaf switch connected to every spine' },
      { x: 295, w: 105, label: 'Spine', sub: 'Fabric', color: '#a78bfa', tooltip: 'One of several equal-cost paths' },
      { x: 435, w: 105, label: 'Leaf 2', sub: 'Access', color: '#60a5fa', tooltip: 'Destination leaf switch' },
      { x: 575, w: 140, label: 'Server B', sub: 'Destination', color: '#fb7185', tooltip: 'Destination server' },
    ],
    path: [0, 1, 2, 3, 4],
    legends: [
      '`Server A` بيعت East-West traffic لسيرفر تاني في الـ data center',
      '`Leaf 1` بيستقبل الـ frame ويختار spine',
      '`ECMP` بيوزّع على مسارات متساوية التكلفة',
      '`Leaf 2` بيستقبل على طرف الـ fabric',
      '`Server B` استلم — مفيش leaf-to-leaf مباشر',
    ],
  },
  {
    tab: 'WAN',
    nodes: [
      { x: 50, w: 150, label: 'Cairo', sub: 'HQ LAN', color: '#38bdf8', tooltip: 'Geographically separated headquarters' },
      { x: 330, w: 160, label: 'WAN', sub: 'Provider cloud', color: '#a78bfa', tooltip: 'MPLS, VPN, leased line, or SD-WAN' },
      { x: 610, w: 160, label: 'Alexandria', sub: 'Branch LAN', color: '#34d399', tooltip: 'Remote branch network' },
    ],
    path: [0, 1, 2],
    legends: [
      '`Cairo` بيعت packet للموقع التاني',
      'الـ `WAN` بيحمل الـ packet بين المدن',
      '`Alexandria` استلمت الـ packet',
    ],
  },
  {
    tab: 'SOHO',
    nodes: [
      { x: 20, w: 120, label: 'Laptop', sub: 'Home LAN', color: '#38bdf8', tooltip: 'Home endpoint' },
      { x: 190, w: 150, label: 'Router', sub: 'NAT · DHCP', color: '#34d399', tooltip: 'SOHO wireless router' },
      { x: 390, w: 120, label: 'ISP', sub: 'Internet', color: '#fb7185', tooltip: 'Internet Service Provider' },
      { x: 560, w: 160, label: 'Server', sub: 'Public Internet', color: '#a78bfa', tooltip: 'Remote Internet server' },
    ],
    path: [0, 1, 2, 3],
    legends: [
      'اللابتوب بعت طلب للـ `default gateway`',
      'الراوتر عمل `NAT` وطبّق الـ `firewall`',
      'الـ `ISP` وصّل لشبكة الإنترنت',
      'السيرفر ردّ والراوتر أعاد التوجيه للجهاز',
    ],
  },
  {
    tab: 'CLOUD',
    nodes: [
      { x: 20, w: 160, label: 'On-Prem', sub: 'Local servers', color: '#38bdf8', tooltip: 'Locally owned infrastructure' },
      { x: 300, w: 160, label: 'VPN / Link', sub: 'Hybrid connection', color: '#34d399', tooltip: 'Connection between on-premises and cloud' },
      { x: 580, w: 170, label: 'Cloud VM', sub: 'Provider network', color: '#a78bfa', tooltip: 'Virtual machine in the cloud provider network' },
    ],
    path: [0, 1, 2],
    legends: [
      'الشركة عندها تطبيق محلي ونسخة في الـ `cloud`',
      'الـ `VPN` أو dedicated link بيربط الـ hybrid environment',
      'الـ `VM` بيردّ — المسؤولية مقسّمة حسب نموذج الخدمة',
    ],
  },
]

const totalJourneyStages = journeys.reduce((sum, journey) => sum + journey.legends.length, 0)

export function ArchitecturePacketJourney() {
  const playback = usePlayback(totalJourneyStages)

  let cursor = playback.stage
  let activeIndex = -1
  for (let index = 0; index < journeys.length; index += 1) {
    if (cursor < journeys[index].legends.length) {
      activeIndex = index
      break
    }
    cursor -= journeys[index].legends.length
  }
  const journey = journeys[activeIndex] ?? journeys[0]
  const localStage = Math.min(cursor, journey.legends.length - 1)
  const nodeIndex = journey.path[localStage]
  const currentNode = journey.nodes[nodeIndex]
  const point = { x: currentNode.x + currentNode.w / 2, y: 130 }

  return (
    <Shell
      title="PACKET JOURNEY / SIX ARCHITECTURES"
      playback={playback}
      legend={`[${journey.tab}] ${journey.legends[localStage]}`}
    >
      <svg viewBox="0 0 800 300" className="h-auto w-full min-w-[720px]" role="img" aria-label="Packet journey through all six topology architectures">
        {journey.nodes.slice(0, -1).map((node, index) => {
          const next = journey.nodes[index + 1]
          return (
            <LinkLine
              key={`${journey.tab}-${index}`}
              x1={node.x + node.w}
              y1={130}
              x2={next.x}
              y2={130}
              color={index === localStage - 1 ? '#38bdf8' : '#60a5fa'}
              active={index === localStage - 1}
            />
          )
        })}

        {journey.nodes.map((node, index) => (
          <Node
            key={`${journey.tab}-${node.label}`}
            x={node.x}
            y={105}
            w={node.w}
            h={50}
            label={node.label}
            sub={node.sub}
            color={node.color}
            tooltip={node.tooltip}
            active={index === nodeIndex}
          />
        ))}

        {journeys.map((item, index) => {
          const tabWidth = 118
          const x = 10 + index * (tabWidth + 8)
          const active = index === activeIndex
          return (
            <g key={item.tab}>
              <title>{item.tab} packet path</title>
              <rect
                x={x}
                y={215}
                width={tabWidth}
                height={34}
                rx="8"
                fill={active ? '#0e7490' : '#0a1730'}
                fillOpacity={active ? 0.28 : 1}
                stroke={active ? '#38bdf8' : '#1e3a5f'}
                strokeWidth={active ? 2 : 1}
              />
              <text
                x={x + tabWidth / 2}
                y={237}
                textAnchor="middle"
                fill={active ? '#7dd3fc' : '#64748b'}
                fontFamily="JetBrains Mono, monospace"
                fontSize="9"
                fontWeight="700"
              >
                {item.tab}
              </text>
            </g>
          )
        })}

        <Packet point={point} color="#38bdf8" label={journey.tab} />
      </svg>
    </Shell>
  )
}
