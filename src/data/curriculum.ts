import type { CurriculumDomain, CurriculumTopic } from './types'

/**
 * The full CCNA 200-301 v1.1 blueprint (effective August 2024).
 * Objectives are listed in the official Cisco order.
 * Source: https://learningcontent.cisco.com/documents/marketing/exam-topics/200-301-CCNA-v1.1.pdf
 */
export const domains: CurriculumDomain[] = [
  {
    id: '1',
    titleAr: 'أساسيات الشبكات',
    titleEn: 'Network Fundamentals',
    weight: 20,
    description: 'الأجهزة، الطوبولوجيات، الكابلات، النماذج، وعناوين IP.',
    accent: '#38bdf8',
    topics: [
      {
        id: '1.1',
        titleAr: 'دور ووظيفة مكوّنات الشبكة',
        titleEn: 'Explain the role and function of network components',
        objectives: [
          { code: '1.1.a', text: 'Routers' },
          { code: '1.1.b', text: 'Layer 2 and Layer 3 switches' },
          { code: '1.1.c', text: 'Next-generation firewalls and IPS' },
          { code: '1.1.d', text: 'Access points' },
          { code: '1.1.e', text: 'Controllers (Cisco DNA Center and WLC)' },
          { code: '1.1.f', text: 'Endpoints' },
          { code: '1.1.g', text: 'Servers' },
          { code: '1.1.h', text: 'PoE' },
        ],
      },
      {
        id: '1.2',
        titleAr: 'خصائص معماريات طوبولوجيا الشبكة',
        titleEn: 'Describe characteristics of network topology architectures',
        objectives: [
          { code: '1.2.a', text: 'Two-tier' },
          { code: '1.2.b', text: 'Three-tier' },
          { code: '1.2.c', text: 'Spine-leaf' },
          { code: '1.2.d', text: 'WAN' },
          { code: '1.2.e', text: 'Small office/home office (SOHO)' },
          { code: '1.2.f', text: 'On-premises and cloud' },
        ],
      },
      {
        id: '1.3',
        titleAr: 'مقارنة الواجهات وأنواع الكابلات',
        titleEn: 'Compare physical interface and cabling types',
        objectives: [
          { code: '1.3.a', text: 'Single-mode fiber, multimode fiber, copper' },
          { code: '1.3.b', text: 'Connections (Ethernet shared media and point-to-point)' },
        ],
      },
      {
        id: '1.4',
        titleAr: 'تحديد مشاكل الواجهة والكابل',
        titleEn: 'Identify interface and cable issues (collisions, errors, mismatch duplex, and/or speed)',
        objectives: [],
      },
      {
        id: '1.5',
        titleAr: 'مقارنة TCP بـ UDP',
        titleEn: 'Compare TCP to UDP',
        objectives: [],
      },
      {
        id: '1.6',
        titleAr: 'إعداد والتحقق من IPv4 والـ subnetting',
        titleEn: 'Configure and verify IPv4 addressing and subnetting',
        objectives: [],
      },
      {
        id: '1.7',
        titleAr: 'عنونة IPv4 الخاصة',
        titleEn: 'Describe private IPv4 addressing',
        objectives: [],
      },
      {
        id: '1.8',
        titleAr: 'إعداد والتحقق من IPv6 والـ prefix',
        titleEn: 'Configure and verify IPv6 addressing and prefix',
        objectives: [],
      },
      {
        id: '1.9',
        titleAr: 'أنواع عناوين IPv6',
        titleEn: 'Describe IPv6 address types',
        objectives: [
          { code: '1.9.a', text: 'Unicast (global, unique local, and link local)' },
          { code: '1.9.b', text: 'Anycast' },
          { code: '1.9.c', text: 'Multicast' },
          { code: '1.9.d', text: 'Modified EUI 64' },
        ],
      },
      {
        id: '1.10',
        titleAr: 'التحقق من إعدادات IP على أجهزة العميل',
        titleEn: 'Verify IP parameters for Client OS (Windows, Mac OS, Linux)',
        objectives: [],
      },
      {
        id: '1.11',
        titleAr: 'مبادئ الشبكات اللاسلكية',
        titleEn: 'Describe wireless principles',
        objectives: [
          { code: '1.11.a', text: 'Nonoverlapping Wi-Fi channels' },
          { code: '1.11.b', text: 'SSID' },
          { code: '1.11.c', text: 'RF' },
          { code: '1.11.d', text: 'Encryption' },
        ],
      },
      {
        id: '1.12',
        titleAr: 'أساسيات الافتراضية',
        titleEn: 'Explain virtualization fundamentals (server virtualization, containers, and VRFs)',
        objectives: [],
      },
      {
        id: '1.13',
        titleAr: 'مفاهيم الـ switching',
        titleEn: 'Describe switching concepts',
        objectives: [
          { code: '1.13.a', text: 'MAC learning and aging' },
          { code: '1.13.b', text: 'Frame switching' },
          { code: '1.13.c', text: 'Frame flooding' },
          { code: '1.13.d', text: 'MAC address table' },
        ],
      },
    ],
  },
  {
    id: '2',
    titleAr: 'الوصول للشبكة',
    titleEn: 'Network Access',
    weight: 20,
    description: 'VLANs، trunks، EtherChannel، STP، والشبكات اللاسلكية.',
    accent: '#60a5fa',
    topics: [
      {
        id: '2.1',
        titleAr: 'إعداد VLANs عبر سوّيتشات متعددة',
        titleEn: 'Configure and verify VLANs (normal range) spanning multiple switches',
        objectives: [
          { code: '2.1.a', text: 'Access ports (data and voice)' },
          { code: '2.1.b', text: 'Default VLAN' },
          { code: '2.1.c', text: 'InterVLAN connectivity' },
        ],
      },
      {
        id: '2.2',
        titleAr: 'إعداد الاتصال بين السوّيتشات',
        titleEn: 'Configure and verify interswitch connectivity',
        objectives: [
          { code: '2.2.a', text: 'Trunk ports' },
          { code: '2.2.b', text: '802.1Q' },
          { code: '2.2.c', text: 'Native VLAN' },
        ],
      },
      {
        id: '2.3',
        titleAr: 'بروتوكولات اكتشاف الطبقة 2',
        titleEn: 'Configure and verify Layer 2 discovery protocols (Cisco Discovery Protocol and LLDP)',
        objectives: [],
      },
      {
        id: '2.4',
        titleAr: 'EtherChannel و LACP',
        titleEn: 'Configure and verify (Layer 2/Layer 3) EtherChannel (LACP)',
        objectives: [],
      },
      {
        id: '2.5',
        titleAr: 'تشغيل Rapid PVST+ Spanning Tree',
        titleEn: 'Interpret basic operations of Rapid PVST+ Spanning Tree Protocol',
        objectives: [
          { code: '2.5.a', text: 'Root port, root bridge (primary/secondary), and other port names' },
          { code: '2.5.b', text: 'Port states and roles' },
          { code: '2.5.c', text: 'PortFast' },
          { code: '2.5.d', text: 'Root guard, loop guard, BPDU filter, and BPDU guard' },
        ],
      },
      {
        id: '2.6',
        titleAr: 'معماريات Cisco اللاسلكية وأوضاع AP',
        titleEn: 'Describe Cisco Wireless Architectures and AP modes',
        objectives: [],
      },
      {
        id: '2.7',
        titleAr: 'الوصلات الفعلية لمكوّنات WLAN',
        titleEn: 'Describe physical infrastructure connections of WLAN components (AP, WLC, access/trunk ports, and LAG)',
        objectives: [],
      },
      {
        id: '2.8',
        titleAr: 'الوصول الإداري لأجهزة الشبكة',
        titleEn: 'Describe network device management access (Telnet, SSH, HTTP, HTTPS, console, TACACS+/RADIUS, and cloud managed)',
        objectives: [],
      },
      {
        id: '2.9',
        titleAr: 'إعداد WLAN من الـ GUI',
        titleEn: 'Interpret the wireless LAN GUI configuration for client connectivity, such as WLAN creation, security settings, QoS profiles, and advanced settings',
        objectives: [],
      },
    ],
  },
  {
    id: '3',
    titleAr: 'اتصال IP',
    titleEn: 'IP Connectivity',
    weight: 25,
    description: 'جداول التوجيه، القرارات الافتراضية، المسارات الثابتة، و OSPF.',
    accent: '#818cf8',
    topics: [
      {
        id: '3.1',
        titleAr: 'مكوّنات جدول التوجيه',
        titleEn: 'Interpret the components of routing table',
        objectives: [
          { code: '3.1.a', text: 'Routing protocol code' },
          { code: '3.1.b', text: 'Prefix' },
          { code: '3.1.c', text: 'Network mask' },
          { code: '3.1.d', text: 'Next hop' },
          { code: '3.1.e', text: 'Administrative distance' },
          { code: '3.1.f', text: 'Metric' },
          { code: '3.1.g', text: 'Gateway of last resort' },
        ],
      },
      {
        id: '3.2',
        titleAr: 'كيف يقرّر الراوتر إعادة التوجيه',
        titleEn: 'Determine how a router makes a forwarding decision by default',
        objectives: [
          { code: '3.2.a', text: 'Longest prefix match' },
          { code: '3.2.b', text: 'Administrative distance' },
          { code: '3.2.c', text: 'Routing protocol metric' },
        ],
      },
      {
        id: '3.3',
        titleAr: 'المسارات الثابتة IPv4 و IPv6',
        titleEn: 'Configure and verify IPv4 and IPv6 static routing',
        objectives: [
          { code: '3.3.a', text: 'Default route' },
          { code: '3.3.b', text: 'Network route' },
          { code: '3.3.c', text: 'Host route' },
          { code: '3.3.d', text: 'Floating static' },
        ],
      },
      {
        id: '3.4',
        titleAr: 'OSPFv2 في منطقة واحدة',
        titleEn: 'Configure and verify single area OSPFv2',
        objectives: [
          { code: '3.4.a', text: 'Neighbor adjacencies' },
          { code: '3.4.b', text: 'Point-to-point' },
          { code: '3.4.c', text: 'Broadcast (DR/BDR selection)' },
          { code: '3.4.d', text: 'Router ID' },
        ],
      },
      {
        id: '3.5',
        titleAr: 'بروتوكولات التكرار لأول hop',
        titleEn: 'Describe the purpose, functions, and concepts of first hop redundancy protocols',
        objectives: [],
      },
    ],
  },
  {
    id: '4',
    titleAr: 'خدمات IP',
    titleEn: 'IP Services',
    weight: 10,
    description: 'NAT، NTP، DHCP، DNS، SNMP، Syslog، QoS و SSH.',
    accent: '#2dd4bf',
    topics: [
      {
        id: '4.1',
        titleAr: 'إعداد inside source NAT',
        titleEn: 'Configure and verify inside source NAT using static and pools',
        objectives: [],
      },
      {
        id: '4.2',
        titleAr: 'إعداد NTP client و server',
        titleEn: 'Configure and verify NTP operating in a client and server mode',
        objectives: [],
      },
      {
        id: '4.3',
        titleAr: 'دور DHCP و DNS في الشبكة',
        titleEn: 'Explain the role of DHCP and DNS within the network',
        objectives: [],
      },
      {
        id: '4.4',
        titleAr: 'وظيفة SNMP في إدارة الشبكة',
        titleEn: 'Explain the function of SNMP in network operations',
        objectives: [],
      },
      {
        id: '4.5',
        titleAr: 'خصائص Syslog والـ facilities والـ severity levels',
        titleEn: 'Describe the use of syslog features, including facilities and severity levels',
        objectives: [],
      },
      {
        id: '4.6',
        titleAr: 'إعداد DHCP client و relay',
        titleEn: 'Configure and verify DHCP client and relay',
        objectives: [],
      },
      {
        id: '4.7',
        titleAr: 'Per-hop behavior في QoS',
        titleEn: 'Explain the forwarding per-hop behavior (PHB) for QoS such as classification, marking, queuing, congestion, policing, and shaping',
        objectives: [],
      },
      {
        id: '4.8',
        titleAr: 'الوصول عن بُعد باستخدام SSH',
        titleEn: 'Configure network devices for remote access using SSH',
        objectives: [],
      },
      {
        id: '4.9',
        titleAr: 'قدرات TFTP و FTP في الشبكة',
        titleEn: 'Describe the capabilities and functions of TFTP/FTP in the network',
        objectives: [],
      },
    ],
  },
  {
    id: '5',
    titleAr: 'أساسيات الأمان',
    titleEn: 'Security Fundamentals',
    weight: 15,
    description: 'المفاهيم الأمنية، كلمات المرور، VPN، ACLs، وأمان الطبقة 2.',
    accent: '#fb7185',
    topics: [
      {
        id: '5.1',
        titleAr: 'مفاهيم الأمان الأساسية',
        titleEn: 'Define key security concepts (threats, vulnerabilities, exploits, and mitigation techniques)',
        objectives: [],
      },
      {
        id: '5.2',
        titleAr: 'عناصر البرنامج الأمني',
        titleEn: 'Describe security program elements (user awareness, training, and physical access control)',
        objectives: [],
      },
      {
        id: '5.3',
        titleAr: 'التحكم في الوصول بكلمات المرور المحلية',
        titleEn: 'Configure and verify device access control using local passwords',
        objectives: [],
      },
      {
        id: '5.4',
        titleAr: 'سياسات كلمات المرور',
        titleEn: 'Describe security password policy elements, such as management, complexity, and password alternatives (multifactor authentication, certificates, and biometrics)',
        objectives: [],
      },
      {
        id: '5.5',
        titleAr: 'IPsec VPN عن بُعد ومن موقع إلى موقع',
        titleEn: 'Describe IPsec remote access and site-to-site VPNs',
        objectives: [],
      },
      {
        id: '5.6',
        titleAr: 'إعداد والتحقق من access control lists',
        titleEn: 'Configure and verify access control lists',
        objectives: [],
      },
      {
        id: '5.7',
        titleAr: 'أمان الطبقة 2',
        titleEn: 'Configure and verify Layer 2 security features (DHCP snooping, dynamic ARP inspection, and port security)',
        objectives: [],
      },
      {
        id: '5.8',
        titleAr: 'Authentication و Authorization و Accounting',
        titleEn: 'Compare authentication, authorization, and accounting concepts',
        objectives: [],
      },
      {
        id: '5.9',
        titleAr: 'بروتوكولات الأمان اللاسلكي',
        titleEn: 'Describe wireless security protocols (WPA, WPA2, and WPA3)',
        objectives: [],
      },
      {
        id: '5.10',
        titleAr: 'إعداد WLAN بـ WPA2 PSK من الـ GUI',
        titleEn: 'Configure and verify WLAN within the GUI using WPA2 PSK',
        objectives: [],
      },
    ],
  },
  {
    id: '6',
    titleAr: 'الأتمتة والبرمجة',
    titleEn: 'Automation and Programmability',
    weight: 10,
    description: 'الشبكات المعرّفة بالبرمجيات، واجهات REST، Ansible و Terraform و JSON.',
    accent: '#f0abfc',
    topics: [
      {
        id: '6.1',
        titleAr: 'أثر الأتمتة على إدارة الشبكات',
        titleEn: 'Explain how automation impacts network management',
        objectives: [],
      },
      {
        id: '6.2',
        titleAr: 'الشبكات التقليدية مقابل الشبكات المعتمدة على الـ controller',
        titleEn: 'Compare traditional networks with controller-based networking',
        objectives: [],
      },
      {
        id: '6.3',
        titleAr: 'معمارية SDN والـ controller',
        titleEn: 'Describe controller-based, software defined architecture (overlay, underlay, and fabric)',
        objectives: [
          { code: '6.3.a', text: 'Separation of control plane and data plane' },
          { code: '6.3.b', text: 'Northbound and Southbound APIs' },
        ],
      },
      {
        id: '6.4',
        titleAr: 'الذكاء الاصطناعي وتعلّم الآلة في عمليات الشبكة',
        titleEn: 'Explain AI (generative and predictive) and machine learning in network operations',
        objectives: [],
      },
      {
        id: '6.5',
        titleAr: 'خصائص واجهات REST-based APIs',
        titleEn: 'Describe characteristics of REST-based APIs (authentication types, CRUD, HTTP verbs, and data encoding)',
        objectives: [],
      },
      {
        id: '6.6',
        titleAr: 'أدوات إدارة الإعدادات',
        titleEn: 'Recognize the capabilities of configuration management mechanisms such as Ansible and Terraform',
        objectives: [],
      },
      {
        id: '6.7',
        titleAr: 'مكوّنات بيانات JSON',
        titleEn: 'Recognize components of JSON-encoded data',
        objectives: [],
      },
    ],
  },
]

export const allTopics: CurriculumTopic[] = domains.flatMap((domain) =>
  domain.topics.map((topic) => ({ ...topic, domainId: domain.id }) as CurriculumTopic & { domainId: string }),
)

export const totalTopics = allTopics.length

export function getDomain(topicId: string): CurriculumDomain | undefined {
  return domains.find((domain) => domain.id === topicId.split('.')[0])
}

export function getTopic(topicId: string): CurriculumTopic | undefined {
  return allTopics.find((topic) => topic.id === topicId)
}

export function getTopicIndex(topicId: string): number {
  return allTopics.findIndex((topic) => topic.id === topicId)
}

export function getNextTopic(topicId: string): CurriculumTopic | undefined {
  return allTopics[getTopicIndex(topicId) + 1]
}

export function getPreviousTopic(topicId: string): CurriculumTopic | undefined {
  const index = getTopicIndex(topicId)
  return index > 0 ? allTopics[index - 1] : undefined
}
