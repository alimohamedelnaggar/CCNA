import type { Lesson } from '../types'

const vpnTermRows: string[][] = [
  ['VPN Endpoint', 'One end of a VPN tunnel', 'A VPN client on a laptop or a VPN gateway at a site'],
  ['VPN Gateway', 'Network-side device that terminates tunnels', 'Router, firewall, or dedicated VPN appliance at the network edge'],
  ['VPN Client', 'Software that initiates a VPN session', 'Client installed on a remote user laptop or mobile device'],
  ['Public Network', 'Untrusted shared transport network', 'The Internet or any shared network you do not control'],
  ['Private Network', 'Network whose access is controlled by the organization', 'Branch LAN or headquarters LAN with internal servers'],
  ['VPN Tunnel', 'Logical protected path between endpoints', 'Protected communication over a shared public network'],
]

const archRows: string[][] = [
  ['Connection participants', 'A single remote user and a network', 'Two or more networks at different sites'],
  ['VPN endpoints', 'VPN client software and a VPN gateway', 'A VPN gateway at each participating site'],
  ['Typical authentication', 'User and/or device authentication, often combined with MFA', 'Peer authentication between gateways, using PSK or certificates'],
  ['Deployment', 'Client software installed on remote devices; gateway at the office', 'Gateways configured at each site with matching protected networks'],
  ['Use cases', 'Home worker, traveling employee, remote administrator', 'Branch-to-headquarters, branch-to-branch, partner site links'],
  ['Traffic scope', 'User traffic through full-tunnel or split-tunnel policy', 'Traffic between the defined LANs behind the gateways'],
  ['Operational considerations', 'Client management, user identity, MFA, split-tunnel policy', 'Routing, protected network definitions, NAT/firewall traversal, gateway capacity'],
]

const protectionRows: string[][] = [
  ['Encapsulation', 'Wrapping a packet inside another packet', 'Carries the original packet across an intermediate network'],
  ['Encryption', 'Turning readable plaintext into ciphertext', 'Provides confidentiality when keys are not exposed'],
  ['Authentication', 'Proving the identity of the communicating peer', 'Answers "who are you talking to?" — different from encryption'],
  ['Integrity', 'Detecting modification of data in transit', 'A changed packet fails the integrity check'],
  ['Confidentiality', 'Keeping data unreadable to unauthorized parties', 'Achieved with encryption, not with authentication alone'],
  ['Key exchange', 'Agreeing session keys without sending them in cleartext', 'Supported by IKE in an IPsec VPN'],
]

const goalRows: string[][] = [
  ['Confidentiality', 'Prevents unauthorized parties from reading traffic', 'Encryption with compatible algorithms and keys'],
  ['Integrity', 'Detects changes made to packets in transit', 'Hash-based integrity check such as an ICV'],
  ['Data origin authentication', 'Confirms the packet came from the expected peer', 'Peer authentication and per-packet authentication data'],
  ['Anti-replay protection', 'Rejects old or duplicated packets', 'Sequence numbers and a replay window'],
]

const componentRows: string[][] = [
  ['AH (Authentication Header)', 'IPsec protocol for integrity and data origin authentication', 'Does not encrypt the payload'],
  ['ESP (Encapsulating Security Payload)', 'IPsec protocol that can encrypt and authenticate', 'Capabilities depend on chosen algorithms and configuration'],
  ['IKE (Internet Key Exchange)', 'Negotiates parameters, authenticates peers, establishes keys', 'Creates and manages IPsec Security Associations'],
  ['Security Association (SA)', 'Agreed one-way security context between peers', 'Usually one SA is needed in each direction'],
  ['SPI (Security Parameters Index)', 'Identifier that selects the correct SA', 'Carried in the IPsec header'],
  ['Sequence Number', 'Per-packet counter inside the SA', 'Supports anti-replay protection'],
  ['Cryptographic keys', 'Secret values used by encryption and integrity algorithms', 'Derived during IKE and refreshed by rekeying'],
]

const ahEspRows: string[][] = [
  ['Encryption / confidentiality', 'No', 'Yes, when an encryption algorithm is selected'],
  ['Integrity', 'Yes', 'Yes, when an integrity algorithm is selected'],
  ['Data origin authentication', 'Yes', 'Yes, when suitable authentication is configured'],
  ['Effect of NAT', 'NAT changes the IP header that AH protects, so integrity can fail', 'Generally preferred where NAT is present'],
  ['Modern CCNA guidance', 'Know that AH never encrypts', 'Common choice for modern IPsec VPN deployments'],
]

const ikeRows: string[][] = [
  ['Why negotiate', 'Peers must agree on algorithms, keys and lifetime before protecting data', 'Mismatch prevents the SA from forming'],
  ['Peer authentication', 'Each peer proves its identity with a PSK or certificate', 'Certificate designs rely on PKI validation'],
  ['Key establishment', 'Session keys are derived without sending them in cleartext', 'Keys are used by IPsec, not typed into every packet'],
  ['IKEv1 vs IKEv2', 'IKEv2 is the newer, commonly deployed version with a simpler exchange', 'Verification command names differ between versions'],
  ['SA management', 'IKE establishes and refreshes SAs', 'Successful IKE SA does not prove user traffic is flowing'],
]

const modeRows: string[][] = [
  ['Original IP header visibility', 'Hidden inside the protected packet', 'Remains visible on the wire'],
  ['Encapsulation', 'New outer IP header is added', 'No new outer IP header is added'],
  ['Protection boundary', 'Entire original IP packet (header + payload)', 'Payload only, not the original IP header'],
  ['Typical deployment', 'Common in gateway-to-gateway Site-to-Site VPNs', 'Generally host-to-host protection'],
  ['Common use case', 'Branch LAN to headquarters LAN over the Internet', 'Protection between two specific hosts'],
]

const encryptionRows: string[][] = [
  ['Plaintext', 'Readable original data', 'A file or packet before encryption'],
  ['Ciphertext', 'Unreadable data after encryption', 'Looks meaningless without the correct key'],
  ['AES', 'Modern symmetric encryption algorithm family', 'Commonly used in IPsec; selected by policy'],
  ['3DES', 'Legacy symmetric algorithm', 'Do not present it as a modern recommended default'],
  ['Authenticated encryption', 'Combines confidentiality with integrity in one mode', 'Conceptual example: AES-GCM, when supported'],
  ['Symmetric keys', 'Compatible algorithms and keys at both endpoints', 'Session keys come from IKE, not from a typed constant'],
]

const authRows: string[][] = [
  ['Pre-Shared Key (PSK)', 'Shared secret configured on both peers', 'Simple, but the secret must be protected and distributed safely'],
  ['Digital certificates', 'Identity bound to a public key and validated through PKI', 'Scales better; the private key stays with the owner'],
  ['Mutual authentication', 'Each peer verifies the other', 'One-way proof leaves the initiator unsure of the peer'],
  ['Authentication vs encryption', 'Authentication proves identity; encryption hides content', 'Both are needed in a well-designed VPN'],
]

const integrityRows: string[][] = [
  ['Message integrity', 'Detects whether packet content changed', 'A modified packet fails the integrity check'],
  ['Anti-replay', 'Detects repeated or old packets', 'Sequence numbers and a replay window reject duplicates'],
  ['Encryption alone', 'Hides content but does not prove identity by itself', 'Combine with peer authentication and integrity'],
  ['Rekeying', 'Refreshes session keys and SA parameters', 'Limits how long one set of keys is used'],
]

const planningRows: string[][] = [
  ['VPN endpoints', 'Which client and gateway or which pair of gateways', 'Defines where tunnels start and end'],
  ['Protected networks', 'Which LAN subnets must be reachable through the tunnel', 'Mismatch here is a common cause of no traffic'],
  ['Peer addresses', 'Public addresses used to reach each peer', 'Must be reachable before IKE can start'],
  ['Authentication method', 'PSK or certificate-based peer authentication', 'Must match on both peers'],
  ['Algorithms', 'Encryption, integrity, DH/group and lifetime parameters', 'Must be compatible on both peers'],
  ['Mode', 'Tunnel Mode or Transport Mode as appropriate', 'Most gateway-based Site-to-Site designs use Tunnel Mode'],
  ['Routing', 'Routes that send interesting traffic toward the VPN', 'Without routes, traffic may leave unprotected'],
  ['Firewall / NAT', 'Allowed IKE and IPsec traffic and NAT behavior', 'Blocks negotiation or breaks integrity checks'],
]

const verifyCommandRows: string[][] = [
  ['show crypto ikev2 sa', 'IKEv2 Security Association status', 'Established IKEv2 SA means peers completed IKEv2 negotiation'],
  ['show crypto isakmp sa', 'IKEv1 Security Association status', 'Associated with IKEv1, not a universal IKEv2 command'],
  ['show crypto ipsec sa', 'IPsec SA details and packet counters', 'Counters show encrypt/decapsulate activity, not application success'],
  ['show crypto session', 'Session summary on platforms that support it', 'Useful high-level view; command availability varies'],
]

const troubleRows: string[][] = [
  ['Incorrect PSK', 'No IKE SA; authentication fails', 'Authentication settings and debug reason on both peers', 'Verify the configured secret out-of-band; never paste a real secret into notes'],
  ['Authentication mismatch', 'Peer identity is rejected', 'PSK vs certificate settings and identity values', 'Align authentication methods and trust on both sides'],
  ['Algorithm mismatch', 'IKE negotiation fails', 'Encryption, integrity, DH group and lifetime proposals', 'Choose one mutually supported policy set'],
  ['IKE negotiation failure', 'No usable IKE SA or phase 1', 'Peer reachability, UDP port access, clock and identity', 'Check transport and identity before changing crypto'],
  ['Incorrect protected network', 'SA exists but interesting traffic does not enter the tunnel', 'Proxy IDs / protected subnets on both peers', 'Correct the defined networks symmetrically'],
  ['Routing problem', 'Traffic takes the wrong path or is dropped', 'Routing table and next hop for remote subnets', 'Add or correct routes so traffic reaches the VPN'],
  ['Firewall blocking traffic', 'IKE or IPsec packets do not arrive', 'ACLs and allowed protocols/ports on the path', 'Permit required VPN traffic only between known peers'],
  ['NAT-related problem', 'Negotiation fails or integrity checks fail', 'NAT device position and encapsulation support', 'Account for NAT-T or redesign the path where supported'],
  ['Traffic not matching policy', 'Counters stay low although the tunnel is up', 'Which source/destination pairs are defined as interesting', 'Adjust the policy so intended traffic is protected'],
  ['One-way traffic / failed return', 'Requests arrive but replies do not', 'Return routes, ACLs and NAT in the reverse direction', 'Validate both directions independently'],
]

const summaryArchRows: string[][] = [
  ['Participants', 'Remote user + VPN gateway', 'Gateway + gateway for two networks'],
  ['Endpoints', 'VPN client and gateway', 'VPN gateways at each site'],
  ['Authentication', 'User/device, often with MFA', 'Peer authentication with PSK or certificates'],
  ['Traffic scope', 'Full tunnel or split tunnel for one user', 'Traffic between protected LANs'],
]

const summaryAhEspRows: string[][] = [
  ['Encryption', 'None', 'Yes, when configured with an encryption algorithm'],
  ['Integrity and origin auth', 'Yes', 'Yes, when suitable algorithms are selected'],
  ['NAT consideration', 'Can break AH integrity checks', 'Generally used where NAT exists'],
]

const summaryModeRows: string[][] = [
  ['Original IP header', 'Carried inside the protected packet', 'Visible on the wire'],
  ['Outer IP header', 'Added', 'Not added'],
  ['Protected portion', 'Whole original IP packet', 'Payload only'],
]

const summaryCryptoRows: string[][] = [
  ['Question answered', 'Is the content unreadable to others?', 'Am I talking to the expected peer?'],
  ['Mechanism', 'Symmetric encryption such as AES', 'PSK or certificate-based peer authentication'],
  ['Failure if missing', 'Data can be read in transit', 'An impostor can be accepted'],
]

const summaryPskCertRows: string[][] = [
  ['Credential', 'Same shared secret on both peers', 'Certificate + private key owned by each peer'],
  ['Trust model', 'Both sides must hold the same secret safely', 'Chain validated through PKI to a trusted CA'],
  ['Trade-off', 'Simple, but distribution and rotation are harder', 'More scalable, needs certificate lifecycle management'],
]

export const topic55Lesson: Lesson = {
  topicId: '5.5',
  title: 'Describe IPsec remote access and site-to-site VPNs',
  description:
    'Topic 5.5 يشرح الـ VPN والـ IPsec: Remote Access وSite-to-Site، وIKE والـ Security Associations، وTunnel Mode مقابل Transport Mode، والتشفير والمصادقة. الشرح بالعربية المصرية البسيطة والمصطلحات التقنية بالإنجليزي. كل الأمثلة والطوبولوجيات تعليمية وهمية، ومفيش أي مفاتيح أو كلمات سر حقيقية.',
  estimatedTime: '~140 دقيقة',
  steps: [
    {
      id: 'what',
      title: 'What Is a VPN and Why Do We Need It?',
      short: 'إيه الـ VPN وليه بنستخدمه؟',
      blocks: [
        { type: 'paragraph', text: '**Virtual Private Network (VPN)** يعني اتصال «خاص» منطقي بين نقطتين فوق شبكة مشتركة زي الإنترنت. الشبكة نفسها مش مملوكة لنا، بس الاتصال بين الـ endpoints بيكون محمي، فالبيانات اللي بتمر بينهم ما تتقراش أو تتعدل بسهولة.' },
        { type: 'diagram', id: 'vpn-overview', caption: 'من شبكة خاصة physical لاتصال منطقي محمي فوق شبكة مشتركة.' },
        { type: 'paragraph', text: 'الفرق المهم: **Private physical network** يعني إنك تملك العتاد والأسلاك وتتحكم في الوصول فعلياً. الـ VPN ما بيخلّيش الإنترنت ملكك؛ بيخلّي المسار بين نقطتين محددتين **logically private** عن طريق التغليف والتشفير والتحقق.' },
        { type: 'diagram', id: 'vpn-tunnel-path', caption: 'إزاي الحزمة المحمية بتمر على شبكة غير موثوقة.' },
        { type: 'paragraph', text: 'Sending sensitive traffic over an untrusted network without protection means any device on the path may be able to read or modify it. الـ VPN بيعمل **protected communication path** بين الـ endpoints، مش بين كل الأجهزة في الشبكة.' },
        { type: 'diagram', id: 'vpn-endpoints', caption: 'VPN Endpoint وGateway وClient وPublic وPrivate Network — اختر وشوف الفرق.' },
        { type: 'table', headers: ['Term', 'Meaning', 'Example'], rows: vpnTermRows },
        { type: 'list', items: [
          'موظف شغال من البيت: بيفتح VPN client عشان يوصل لبريد الشركة وملفاتها.',
          'فرعان بعيدان: gateway في كل فرع بيعمل tunnel بين الـ LANs عبر الإنترنت.',
          'مسؤول شبكة بيدخل من بره: بيتصل بـ VPN gateway عشان يدير الأجهزة داخلياً.',
          'الـ VPN بيحمي الترافيك بين الـ endpoints المتفق عليها؛ ما بيحميش كل جهاز أو كل تطبيق لوحده.',
        ]},
        { type: 'callout', tone: 'warning', title: 'حد الـ VPN', text: 'الـ VPN مش «سحر» بيخلي كل حاجة آمنة. لسه محتاج تصالحيات، وتحقق من الهوية، وتحديثات، وتحكم في الوصول بعد ما الاتصال يتم.' },
      ],
    },
    {
      id: 'how',
      title: 'How VPN Tunnels Work',
      short: 'إزاي الـ tunnel بيشتغل؟',
      blocks: [
        { type: 'paragraph', text: 'تخيّل إنك بترسل رسالة جوّه ظرف مقفول، وبعدين تحط الظرف ده جوّه ظرف تاني وعنوانه لعنوان وسيط. الوسيط يشوف العنوان الخارجي بس، مش الرسالة اللي جوّه. ده تقريباً الـ **tunnel**: تغليف وحماية فوق شبكة مش موثوقة.' },
        { type: 'diagram', id: 'vpn-workflow', caption: 'خطوات الاتصال من أول initiation لحد تسليم الحزمة الأصلية.' },
        { type: 'list', ordered: true, items: [
          'جهاز أو شبكة بيبدأ اتصال VPN.',
          'الـ endpoints بيتفقوا على إعدادات أمنية متوافقة.',
          'كل طرف بيتحقق من هوية الطرف التاني.',
          'بيتم إنشاء مفاتيح وبارامترات التشفير.',
          'الترافيك يتغلف ويتحمي حسب تصميم الـ VPN.',
          'الترافيك يمر على الشبكة غير الموثوقة.',
          'الـ endpoint المستقبل بيتحقق ويفك التغليف.',
          'الحزمة الأصلية تتحول لوجهتها النهائية.',
        ]},
        { type: 'diagram', id: 'vpn-protection-functions', caption: 'Encapsulation وEncryption وAuthentication وIntegrity وKey exchange — اختر وشوف.' },
        { type: 'table', headers: ['Function', 'What it does', 'CCNA takeaway'], rows: protectionRows },
        { type: 'callout', tone: 'tip', title: 'Encryption مش Authentication', text: 'التشفير بيخلي المحتوى غير مقروء. المصادقة بتأكد مين الطرف التاني. ممكن تشفّر بيانات لطرف انتحل هوية حد تاني، فالاثنين مكمّلين لبعض ومش نفس الحاجة.' },
        { type: 'paragraph', text: 'مش كل تقنيات VPN بتستخدم نفس البروتوكولات أو نفس الـ handshake. هنا بنركّز على **IPsec** لأنه المطلوب في CCNA، بس في عالم الواقع فيه كمان حلول تانية زي SSL/TLS VPNs بآليات مختلفة.' },
      ],
    },
    {
      id: 'packet',
      title: 'Remote Access VPN vs Site-to-Site VPN',
      short: 'مستخدم بعيد ولا شبكتين؟',
      blocks: [
        { type: 'paragraph', text: '**Remote Access VPN** يربط مستخدم فردي بشبكة المؤسسة. المستخدم بيشغّل **VPN client** أو يستخدم وصول clientless مدعوم، والاتصال بينه وبين **remote VPN gateway**. الـ gateway بيتحقق من المستخدم أو الجهاز وبعدين يسمح بالوصول للموارد الداخلية حسب السياسة.' },
        { type: 'diagram', id: 'vpn-remote-topology', caption: 'Remote User → Internet → VPN Gateway → Corporate Network.' },
        { type: 'diagram', id: 'vpn-remote-auth', caption: 'خطوات مصادقة المستخدم وإنشاء الجلسة في Remote Access VPN.' },
        { type: 'paragraph', text: 'في الـ Remote Access، ترافيك المستخدم ممكن يتعامل معاه بـ **full tunnel** يعني كل الترافيك يمر على الـ VPN gateway، أو **split tunnel** يعني ترافيك الشركة بس يمر عليه والباقي يخرج مباشرة. الاختيار بيتبع السياسة والـ configuration.' },
        { type: 'diagram', id: 'vpn-tunnel-split', caption: 'Full tunnel مقابل Split tunnel — اختار وشوف الفرق في المسار.' },
        { type: 'paragraph', text: '**Site-to-Site VPN** يربط شبكتين أو أكتر جغرافياً. كل موقع عنده **VPN gateway** على الحافة، والـ gateways بيعملوا tunnel يحمي الترافيك بين الـ LANs. في التصميم الـ gateway-based، أجهزة كل LAN ما بتبعتش VPN session منفصلة لكل جهاز؛ الـ gateway بيمثل الشبكة كلها.' },
        { type: 'diagram', id: 'vpn-site-topology', caption: 'Branch LAN → Branch VPN Gateway → Internet → HQ VPN Gateway → HQ LAN.' },
        { type: 'diagram', id: 'vpn-site-flow', caption: 'رحلة حزمة من فرع للمقر والرد في الاتجاه العكسي.' },
        { type: 'diagram', id: 'vpn-architecture-compare', caption: 'Remote Access مقابل Site-to-Site — اختار وشوف الفرق.' },
        { type: 'table', headers: ['Aspect', 'Remote Access VPN', 'Site-to-Site VPN'], rows: archRows },
        { type: 'callout', tone: 'danger', title: 'ما تخلطش الطوبولوجيتين', text: 'Remote Access = مستخدم واحد → شبكة. Site-to-Site = شبكة → شبكة عبر gateways. لو السؤال بيقول «موظف من البيت» فده Remote Access، ولو بيقول «فرعين» فده Site-to-Site.' },
      ],
    },
    {
      id: 'config',
      title: 'IPsec Fundamentals and Cisco Context',
      short: 'أساسيات IPsec وسياق Cisco',
      blocks: [
        { type: 'paragraph', text: '**IPsec** مش بروتوكول واحد؛ ده **suite** من بروتوكولات وآليات بتحمي اتصال IP. بيشتغل عند طبقة IP ويقدر يخدم Remote Access وSite-to-Site. الأهداف الأربعة: **Confidentiality**، **Integrity**، **Data origin authentication**، و**Anti-replay protection**.' },
        { type: 'diagram', id: 'vpn-ipsec-goals', caption: 'أهداف IPsec الأربعة — اختر وشوف إيه اللي بيحميه كل هدف.' },
        { type: 'table', headers: ['Goal', 'What it protects against', 'How it is achieved'], rows: goalRows },
        { type: 'diagram', id: 'vpn-ipsec-components', caption: 'مكوّنات IPsec: AH وESP وIKE وSA وSPI وSequence Number.' },
        { type: 'table', headers: ['Component', 'Role', 'Important detail'], rows: componentRows },
        { type: 'paragraph', text: '**AH (Authentication Header)** بيدي integrity وتحقق من مصدر البيانات، لكنه **ما بيشفّرش** الحمولة. كمان لأنه بيحمي ترويسة IP نفسها، أي تعديل من **NAT** للعناوين بيكسر فحص الـ integrity. **ESP (Encapsulating Security Payload)** بيشفّر الحمولة، ومع خوارزميات مناسبة بيضيف كمان integrity وتحقق من المصدر. عشان كده ESP هو المعتاد في IPsec الحديث.' },
        { type: 'diagram', id: 'vpn-ah-protection', caption: 'AH: الحزمة قبل وبعد — لاحظ إن الحمولة مقروءة.' },
        { type: 'diagram', id: 'vpn-esp-protection', caption: 'ESP: تشفير الحمولة مع integrity وorigin auth حسب الخوارزميات.' },
        { type: 'diagram', id: 'vpn-ah-vs-esp', caption: 'AH مقابل ESP — اختر خاصية وشوف الفرق.' },
        { type: 'table', headers: ['Aspect', 'AH', 'ESP'], rows: ahEspRows },
        { type: 'paragraph', text: '**IKE (Internet Key Exchange)** بيتم الاتفاق على البارامترات، والتحقق من الـ peers، وإنشاء المفاتيح والـ **Security Associations**. الـ SA هو اتفاقية أحادية الاتجاه بتحدد الخوارزميات والمفاتيح والـ SPI والمدة؛ غالباً محتاج SA لكل اتجاه. **IKEv2** هو الأحدث والأكثر استخداماً، و**IKEv1** لسه موجود في أنظمة قديمة وأوامر التحقق مختلفة.' },
        { type: 'diagram', id: 'vpn-ike-negotiation', caption: 'تفاوض IKE والتحقق من الـ peer وإنشاء الـ SAs.' },
        { type: 'diagram', id: 'vpn-sa-concept', caption: 'SA وSPI وSequence Number والفرق بين IKEv1 وIKEv2.' },
        { type: 'table', headers: ['IKE topic', 'What happens', 'Exam note'], rows: ikeRows },
        { type: 'paragraph', text: '**Cisco context:** Administrators plan endpoints, protected networks, peer addresses, authentication method, encryption and integrity algorithms, mode, routing, and firewall/NAT behavior before configuration. ما فيش «كونفيج عالمي» ينطبق على كل الأجهزة.' },
        { type: 'table', headers: ['Planning item', 'Decision needed', 'Why it matters'], rows: planningRows },
        { type: 'code', label: 'Conceptual planning outline - placeholders only, not a universal Cisco configuration', language: 'text', code: 'peer public address: <PEER_PUBLIC_IP>\nprotected local network: <LOCAL_LAN_SUBNET>\nprotected remote network: <REMOTE_LAN_SUBNET>\nauthentication: <PSK_OR_CERTIFICATE>\nIKE version: <IKEv1_OR_IKEv2>\nIPsec mode: <TUNNEL_OR_TRANSPORT>\nencryption / integrity: <SUPPORTED_ALGORITHMS>' },
        { type: 'callout', tone: 'warning', title: 'Commands depend on the platform', text: 'الأوامر والميزات المدعومة بتختلف حسب Cisco platform وIOS/IOS XE version وVPN architecture وIKE version والخوارزميات المدعومة. هنا بنشرح المفاهيم، مش بنقدّم كونفيج قابل للتنفيذ على كل جهاز.' },
      ],
    },
    {
      id: 'verify',
      title: 'IPsec Modes, Verification and Troubleshooting',
      short: 'المودات والتحقق والاستكشاف',
      blocks: [
        { type: 'paragraph', text: 'في **Tunnel Mode** الحزمة الأصلية كلها تتحمي وتتغلف جوّه حزمة جديدة ليها **New Outer IP Header**. العنوان الأصلي موجود جوّه الجزء المحمي. ده المعتاد في Site-to-Site بين gateways.' },
        { type: 'paragraph', text: 'في **Transport Mode** الترويسة الأصلية تفضل ظاهرة على الشبكة، والحمولة بس اللي تتحمي. بيدي حماية host-to-host غالباً، مش نفس نمط gateway-to-gateway المعتاد.' },
        { type: 'diagram', id: 'vpn-packet-modes', caption: 'Original packet وTunnel Mode وTransport Mode — اختار وشوف حدود الحماية بالظبط.' },
        { type: 'diagram', id: 'vpn-mode-compare', caption: 'مقارنة المودات: ظهور الترويسة والتغليف وحدود الحماية.' },
        { type: 'table', headers: ['Aspect', 'Tunnel Mode', 'Transport Mode'], rows: modeRows },
        { type: 'callout', tone: 'danger', title: 'حدود الحماية', text: 'في Tunnel Mode الحزمة الأصلية كلها محمية جوّه غلاف جديد. في Transport Mode الترويسة الأصلية ظاهرة والحمولة بس محمية. ما تقولش إن الحزمة كلها مشفّرة في المودين.' },
        { type: 'paragraph', text: '**Verification:** الأوامر هنا أمثلة مفاهيمية لمشاهدة الحالة، ومفيش output حقيقي تم جمعه من جهاز حقيقي. توفر الأوامر وبياناتها بيختلف حسب المنصة والإصدار.' },
        { type: 'code', label: 'Conceptual verification commands - platform and version dependent', language: 'cisco', code: 'show crypto ikev2 sa\nshow crypto isakmp sa\nshow crypto ipsec sa\nshow crypto session' },
        { type: 'table', headers: ['Command', 'Intended display', 'Interpretation'], rows: verifyCommandRows },
        { type: 'callout', tone: 'warning', title: 'IKE SA مش معناه كل حاجة تمام', text: 'وجود IKE SA يعني إن التفاوض والمصادقة نجحوا. لازم كمان تشوف IPsec SA، وعدادات encapsulation/decapsulation، والـ routing، والـ ACLs عشان تحكم إن الترافيك فعلاً بيوصل للتطبيق. `show crypto isakmp sa` مرتبط بـ IKEv1 مش أمر IKEv2 عام.' },
        { type: 'paragraph', text: '**Troubleshooting approach:** ابدأ بالطبقة اللي فشلت: هل فيه IKE SA؟ لو لا راجع المصادقة واتفاق الخوارزميات والوصول. لو IKE تمام بس مفيش IPsec SA راجع تعريف الشبكات المحمية وبارامترات IPsec. لو الـ SA موجود والعدادات بتزيد بس المستخدمين بيشتكوا، راجع الـ routing والـ policy والتطبيق.' },
        { type: 'diagram', id: 'vpn-troubleshooting-tree', caption: 'شجرة قرار استكشاف الأخطاء — اختر حالة وشوف أول فحص مناسب.' },
        { type: 'table', headers: ['Scenario', 'Typical symptom', 'What to inspect', 'Safe approach'], rows: troubleRows },
        { type: 'callout', tone: 'tip', title: 'إعادة قراءة مفيدة', text: 'المشاكل العشرة في الجدول كلها فرضية تعليمية. مفيش أي output حقيقي تم جمعه من Cisco device أو Packet Tracer، ومفيش أي مفتاح أو سر حقيقي مستخدم.' },
      ],
    },
    {
      id: 'mistakes',
      title: 'VPN Encryption, Authentication and Key Management',
      short: 'التشفير والمصادقة وإدارة المفاتيح',
      blocks: [
        { type: 'paragraph', text: '**Encryption** بيحوّل **plaintext** مقروء لـ **ciphertext** غير مفهوم، والطرف التاني بيفكه بالمفتاح المتوافق. الـ symmetric encryption زي **AES** بيستخدم نفس المفتاح للطرفين. **3DES** من الخوارزميات القديمة، وما ينصحش بيه كخيار حديث.' },
        { type: 'list', items: [
          '**Modern authenticated encryption** بيجمع بين confidentiality وintegrity في نفس الـ mode زي AES-GCM لما المنصة والسياسة يدعموا ده.',
          'لازم يتفق الطرفين على الخوارزمية والمفتاح؛ أي اختلاف يمنع فك التشفير أو من أوله يمنع إنشاء الـ SA.',
          'المفاتيح بتاعة الجلسة بتيجي من IKE، مش قيمة ثابتة بنكتبها في كل حزمة.',
        ]},
        { type: 'diagram', id: 'vpn-encryption-flow', caption: 'من plaintext لتشفير ومرور على الشبكة ثم فك التشفير.' },
        { type: 'table', headers: ['Idea', 'Meaning', 'CCNA note'], rows: encryptionRows },
        { type: 'paragraph', text: '**Peer authentication** معناة إن كل طرف يثبت هوية الطرف التاني. في IPsec ممكن يتعمل بـ **Pre-Shared Key (PSK)** يعني سر مشترك متضبط على الطرفين، أو بـ **Digital Certificates** اللي بتربط الهوية بمفتاح عام وتتحقق عبر PKI. لو استخدمنا شهادات، بنستخدم الـ validation اللي اتشرح في Topic 5.4 من غير إعادة درس PKI كامل.' },
        { type: 'diagram', id: 'vpn-psk-auth', caption: 'مصادقة الـ PSK على الطرفين — لاحظ إن السر ما بيتsendesh كنص واضح.' },
        { type: 'diagram', id: 'vpn-cert-auth', caption: 'مصادقة بالشهادات: CA والـ chain والمفتاح الخاص عند صاحب الشهادة.' },
        { type: 'table', headers: ['Aspect', 'PSK', 'Certificates'], rows: authRows },
        { type: 'paragraph', text: '**Integrity** بتكشف أي تعديل في الحزمة، و**Anti-replay** بيستخدم **Sequence Numbers** عشان يرفض الحزم القديمة أو المكررة. التشفير لوحده مش كفاية لأنه ما بيقولش مين المرسل ولا بيمنع إعادة إرسال حزمة قديمة صالحة.' },
        { type: 'diagram', id: 'vpn-anti-replay', caption: 'Sequence numbers ورفض الحزمة المكررة.' },
        { type: 'table', headers: ['Concept', 'Purpose', 'Why it matters'], rows: integrityRows },
        { type: 'callout', tone: 'danger', title: 'أخطاء امتحانية متكررة', text: '١) AH ما بيشفّرش. ٢) Transport Mode ما بيخبيش الترويسة الأصلية. ٣) التشفير مش مصادقة. ٤) نجاح IKE SA مش دليل على وصول ترافيك التطبيق. ٥) PSK وCertificate طريقتانDifferent للمصادقة، مشшемا خطوتين تشفير.' },
      ],
    },
    {
      id: 'lab',
      title: 'Interactive VPN Labs',
      short: 'لابرات VPN تفاعلية',
      blocks: [
        { type: 'paragraph', text: '**Labs (Interactive Simulation / Conceptual).** كل الطوبولوجيات والأمثلة educational وهمية، ومفيش أوامر اتنفذت فعلاً على Cisco hardware أو Packet Tracer. اضغط على الخيارات وجرّب الحالات المختلفة.' },
        { type: 'paragraph', text: '**Lab 1 — Choose the Right VPN Architecture**' },
        { type: 'code', label: 'Starting topology - fictional', language: 'text', code: 'Remote user ---- Internet ---- <CORPORATE_GATEWAY> ---- Internal LAN\nBranch A LAN ---- <GW_A> ---- Internet ---- <GW_B> ---- HQ LAN' },
        { type: 'steps', items: [
          { title: 'Learning objectives', text: 'تختار Remote Access أو Site-to-Site لكل سيناريو، وتحدد الـ VPN endpoints، وتكمل مسار الاتصال، وتبرر الاختيار.' },
          { title: 'Scenario', text: 'أربع حالات: موظف من البيت، فرعان عبر الإنترنت، مسؤول بيدخل من بره، وشبكتان مؤسسيتان تتبادلان ترافيك.' },
          { title: 'Starting topology', text: 'طوبولوجيا وهمية في كتلة الـ code أعلاه: VPN gateway للموارد الداخلية، وGateway لكل فرع من الفروع.' },
          { title: 'Task 1 — Select architecture', text: 'في كل حالة اختر Remote Access VPN أو Site-to-Site VPN واقرأ التغذية الراجعة.' },
          { title: 'Task 2 — Identify endpoints', text: 'اكتب في ملاحظاتك: في Remote Access الـ endpoints هما client وgateway، وفي Site-to-Site هما gateway وgateway.' },
          { title: 'Task 3 — Complete the path', text: 'رتّب المسار: Remote User → Internet → VPN Gateway → Corporate Network، أو Branch LAN → Branch Gateway → Internet → HQ Gateway → HQ LAN.' },
          { title: 'Task 4 — Explain the fit', text: 'علّل الاختيار: مستخدم فردي يعني Remote Access، وشبكة لشبكة تعني Site-to-Site.' },
          { title: 'Cisco context', text: 'الأوامر والتفاصيل بتختلف حسب المنصة; ركّز على اختيار المعمارية قبل أي configuration.' },
          { title: 'Hint', text: 'اسأل: هل الطرف مستخدم واحد ولا شبكة كاملة ورا gateway؟' },
          { title: 'Solution / explanation', text: 'الحالات ١ و٣ Remote Access، والحالتان ٢ و٤ Site-to-Site. الـ endpoints بتاعة Site-to-Site هما الـ gateways مش أجهزة المستخدمين.' },
          { title: 'Completion criteria', text: 'اخترت الأربع حالات صح، وحددت الـ endpoints، وبررت كل اختيار بمصطلح من الدرس.' },
        ]},
        { type: 'diagram', id: 'vpn-lab-architecture', caption: 'Lab 1 — تنقّل بين الحالات واختر معمارية VPN المناسبة.' },

        { type: 'paragraph', text: '**Lab 2 — Tunnel Mode vs Transport Mode**' },
        { type: 'code', label: 'Conceptual packet formats - not byte-accurate', language: 'text', code: 'ORIGINAL:  [Original IP Header][Original Payload]\nTUNNEL:    [New Outer IP Header][Protected Original IP Packet]\nTRANSPORT: [Original IP Header][Protected Payload]' },
        { type: 'steps', items: [
          { title: 'Learning objectives', text: 'تختار المود المناسب، وتحدد الترويسة الظاهرة، وتحدد الجزء المحمي، وتقارن أنماط النشر.' },
          { title: 'Scenario', text: 'أربع حالات: Site-to-Site بين فرعين، host-to-host، سؤال عن العنوان الظاهر على الشبكة، وسؤال عن الجزء غير المحمي.' },
          { title: 'Starting topology', text: 'رسم الحزمة في كتلة الـ code أعلاه، مع المودات المتاحة بالتجربة في الرسم التفاعلي.' },
          { title: 'Task 1 — Select the mode', text: 'اختر Tunnel Mode أو Transport Mode لكل حالة واقرأ النتيجة.' },
          { title: 'Task 2 — Visible header', text: 'في Tunnel Mode العنوان الخارجي بس بيظهر؛ في Transport Mode الترويسة الأصلية تفضل ظاهرة.' },
          { title: 'Task 3 — Protection boundary', text: 'قارن: Tunnel Mode يحمي الحزمة الأصلية كلها، وTransport Mode يحمي الحمولة بس.' },
          { title: 'Task 4 — Deployment pattern', text: 'اربط Tunnel Mode بـ gateway-to-gateway، وTransport Mode بـ host-to-host.' },
          { title: 'Hint', text: 'لو السؤال بيقول «العنوان الأصلي مخفي» فده Tunnel Mode.' },
          { title: 'Solution / explanation', text: 'الإجابات بالترتيب: Tunnel Mode، Transport Mode، New outer IP header، Original IP header. مفيش مود بيشفّر الحزمة كلها في كل الحالات.' },
          { title: 'Completion criteria', text: 'أجبت على الحالات الأربع صح، وبقيت قادر ترسم حدود الحماية بنفسك.' },
        ]},
        { type: 'diagram', id: 'vpn-lab-modes', caption: 'Lab 2 — اختر المود وافحص الحزمة.' },

        { type: 'paragraph', text: '**Lab 3 — IPsec VPN Troubleshooting**' },
        { type: 'code', label: 'Conceptual diagnostic context - no real device output', language: 'cisco', code: 'show crypto ikev2 sa\nshow crypto ipsec sa\nshow crypto session\n<DEBUG_REASON_PLACEHOLDER>' },
        { type: 'steps', items: [
          { title: 'Learning objectives', text: 'تحدد السبب المحتمل، وتختار خطوة تشخيص مناسبة، وتتوقع النتيجة، وتقترح تصحيحاً آمناً.' },
          { title: 'Scenario', text: 'نشر وهمي فيه PSK غلط، واختلاف إعدادات IKE، وشبكة محمية غلط، و route ناقص، و firewall مسدود، و SA شغال بس التطبيق مش شغال.' },
          { title: 'Starting topology', text: 'Peer A وPeer B عبر شبكة عامة، مع LAN خلف كل peer. كل الأوامر في الكتلة مفاهيمية.' },
          { title: 'Task 1 — No IKE SA', text: 'اختر Incorrect PSK واذكر إن فشل مصادقة الـ peer بيمنع إنشاء الـ IKE SA.' },
          { title: 'Task 2 — Mismatched settings', text: 'اختر Mismatched IKE settings وتوقع إن التفاوض ما يكملش.' },
          { title: 'Task 3 — SA up, no traffic', text: 'اختر Incorrect protected network وراجع تعريف الشبكات على الطرفين.' },
          { title: 'Task 4 — Return path', text: 'اختر Missing return route وتأكد من الاتجاهين.' },
          { title: 'Task 5 — Blocked IKE', text: 'اختر IKE negotiation fails وراجع الـ firewall بين الـ peers.' },
          { title: 'Task 6 — SA is not enough', text: 'اختر إن الـ SA شغال بس لازم تفحص الـ routing والـ ACLs والتطبيق كمان.' },
          { title: 'Hint', text: 'ابدأ من أول طبقة فشلت: IKE، وبعدين IPsec SA، وبعدين العدادات والـ routing.' },
          { title: 'Solution / explanation', text: 'كل حالة ليها سبب مباشر في الرسم التفاعلي. نجاح الـ SA وحده مش إثبات إن الترافيك وصل للتطبيق.' },
          { title: 'Completion criteria', text: 'شخّصت الحالات الستة صح، وذكرت خطوة فحص ونتائجها المتوقعة لكل حالة.' },
        ]},
        { type: 'diagram', id: 'vpn-lab-troubleshoot', caption: 'Lab 3 — شخّص كل حالة واقرأ التغذية الراجعة.' },
        { type: 'callout', tone: 'warning', title: 'Simulation boundary', text: 'اللابرات تعليمية داخل الصفحة، ومش اختبار على أجهزة حقيقية. مفيش أي secrets أو كلمات سر حقيقية مطلوبة.' },
      ],
    },
    {
      id: 'exam',
      title: 'CCNA Exam Quiz',
      short: 'اختبار CCNA',
      blocks: [
        { type: 'paragraph', text: '**اختبار CCNA:** 5 أسئلة، 4 خيارات لكل سؤال، مزيج من single وmultiple. مفيش feedback قبل الضغط على Submit.' },
        { type: 'quiz', questions: [
          {
            id: 'q1',
            prompt: 'An employee works from home and needs secure access to internal mail and file servers. Which VPN architecture fits this scenario?',
            options: [
              'Remote Access VPN with a VPN client connecting to a VPN gateway.',
              'Site-to-Site VPN between the home LAN and the office LAN.',
              'Transport Mode only, because the original IP header must stay visible.',
              'No VPN is needed because the Internet is a private network.',
            ],
            correctIndex: 0,
            requireSubmit: true,
            explanation: 'الصح هو **(A)**: مستخدم فردي بيتصل بشبكة المؤسسة عبر VPN client وVPN gateway. (B) غلط لأن مفيش شبكتين؛ Site-to-Site بيربط networks عبر gateways. (C) غلط لأن المود بيحدد حماية الحزمة مش اختيار المعمارية، وTransport Mode مش الحل هنا. (D) غلط لأن الإنترنت شبكة مشتركة وغير موثوقة.',
          },
          {
            id: 'q2',
            kind: 'multiple',
            prompt: 'Which statements about a gateway-based Site-to-Site VPN are correct? (Choose more than one.)',
            options: [
              'The VPN endpoints are the gateways at the participating sites.',
              'Individual hosts usually do not establish separate VPN sessions for the gateway-based design.',
              'It protects traffic between the defined LANs behind the gateways.',
              'It is designed for one remote user running VPN client software.',
            ],
            correctIndices: [0, 1, 2],
            requireSubmit: true,
            explanation: 'الصح هو **(A) و(B) و(C)**: الـ gateways هما الـ endpoints والـ tunnel بيحمي الترافيك بين الـ LANs، وأجهزة كل LAN ما بتبعتش session منفصلة. (D) غلط لأن ده وصف Remote Access VPN، مش Site-to-Site.',
          },
          {
            id: 'q3',
            kind: 'multiple',
            prompt: 'Which statements about IPsec are correct? (Choose more than one.)',
            options: [
              'ESP can provide confidentiality when an encryption algorithm is configured.',
              'Integrity checks detect modification of packets in transit.',
              'An established IKE SA alone does not prove that application traffic is passing.',
              'Encryption by itself proves the identity of the remote peer.',
            ],
            correctIndices: [0, 1, 2],
            requireSubmit: true,
            explanation: 'الصح هو **(A) و(B) و(C)**: ESP بيشفّر حسب الخوارزمية، والـ integrity بتكشف التعديل، ونجاح IKE SA مش معناه إن بيانات التطبيق وصلت. (D) غلط لأن التشفير بيخفي المحتوى بس؛ إثبات هوية الـ peer بيجي من المصادقة بـ PSK أو certificates.',
          },
          {
            id: 'q4',
            prompt: 'A colleague says "AH encrypts the payload and is the best choice where NAT is present." What is the correct response?',
            options: [
              'Incorrect: AH provides integrity and origin authentication but no encryption, and NAT can break its integrity check.',
              'Correct: AH always encrypts and ignores NAT changes.',
              'Incorrect: AH encrypts only the IP header, not the payload.',
              'Correct: AH and ESP are identical in encryption and NAT behavior.',
            ],
            correctIndex: 0,
            requireSubmit: true,
            explanation: 'الصح هو **(A)**: AH بيدي integrity وتحقق من المصدر من غير تشفير، وتعديل NAT لترويسة IP بيكسر الفحص. (B) و(C) غلط لأن AH ما بيشفّرش الحمولة ولا الترويسة. (D) غلط لأن ESP بيشفّر وبيُفضّل غالباً في وجود NAT.',
          },
          {
            id: 'q5',
            prompt: 'Two branch gateways want to protect an entire original IP packet, including its original source and destination addresses, across the Internet. Which combination is correct?',
            options: [
              'Tunnel Mode, because the whole original packet is protected inside a new outer IP header.',
              'Transport Mode, because it hides the original IP header inside a new header.',
              'AH only, because AH encrypts the original header and payload.',
              'Encryption only, because it also authenticates both gateways.',
            ],
            correctIndex: 0,
            requireSubmit: true,
            explanation: 'الصح هو **(A)**: Tunnel Mode بيضيف outer header ويحمي الحزمة الأصلية كلها. (B) غلط لأن Transport Mode يسيب الترويسة الأصلية ظاهرة وما بيضيفش header جديد. (C) غلط لأن AH ما بيشفّرش. (D) غلط لأن التشفير مش مصادقة؛ محتاج peer authentication كمان.',
          },
        ]},
      ],
    },
    {
      id: 'summary',
      title: 'Summary and Key Takeaways',
      short: 'ملخص ونقاط للمراجعة',
      blocks: [
        { type: 'paragraph', text: 'VPN يعني اتصال منطقي محمي بين endpoints فوق شبكة مشتركة. IPsec بيقدّم الأهداف الأربعة، وIKE بيتفاوض وينشئ الـ SAs، والمود بيحدد حدود حماية الحزمة. التشفير والمصادقة وظيفتان منفصلتان ومكمّلتان.' },
        { type: 'paragraph', text: '**1. Remote Access VPN vs Site-to-Site VPN:**' },
        { type: 'table', headers: ['Aspect', 'Remote Access VPN', 'Site-to-Site VPN'], rows: summaryArchRows },
        { type: 'paragraph', text: '**2. AH vs ESP:**' },
        { type: 'table', headers: ['Aspect', 'AH', 'ESP'], rows: summaryAhEspRows },
        { type: 'paragraph', text: '**3. Tunnel Mode vs Transport Mode:**' },
        { type: 'table', headers: ['Aspect', 'Tunnel Mode', 'Transport Mode'], rows: summaryModeRows },
        { type: 'paragraph', text: '**4. Encryption vs Authentication:**' },
        { type: 'table', headers: ['Aspect', 'Encryption', 'Authentication'], rows: summaryCryptoRows },
        { type: 'paragraph', text: '**5. PSK vs Certificate-based authentication:**' },
        { type: 'table', headers: ['Aspect', 'PSK', 'Certificate-based'], rows: summaryPskCertRows },
        { type: 'list', items: [
          'VPN بيحمي الترافيك بين endpoints محددين، مش كل جهاز أو تطبيق.',
          'Remote Access = مستخدم واحد؛ Site-to-Site = شبكة لشبكة عبر gateways.',
          'IPsec goals: confidentiality، integrity، data origin authentication، anti-replay.',
          'AH integrity من غير تشفير؛ ESP تشفير وintegrity حسب الخوارزميات.',
          'IKE بيتفاوض ويتحقق من الـ peers وينشئ SAs؛ نجاح IKE SA مش دليل وصول التطبيق.',
          'Tunnel Mode يحمي الحزمة الأصلية كلها؛ Transport Mode يحمي الحمولة بس.',
          'PSK سر مشترك؛ الشهادات بتستخدم PKI والمفتاح الخاص يفضل عند صاحبه.',
          'الاستكشاف: IKE SA ← IPsec SA ← العدادات ← routing/policy ← التطبيق.',
        ]},
        { type: 'diagram', id: 'vpn-summary', caption: 'خريطة مراجعة CCNA للـ VPN من المعمارية لحد الاستكشاف.' },
        { type: 'callout', tone: 'tip', title: 'CCNA revision checklist', text: '١) عرّف VPN والـ endpoints. ٢) فرّق Remote Access وSite-to-Site. ٣) اذكر أهداف IPsec الأربعة. ٤) قارن AH وESP، وقل إن AH ما بيشفّرش. ٥) اشرح دور IKE والـ SA وSPI. ٦) ارسم حدود Tunnel وTransport. ٧) فرّق التشفير عن المصادقة وPSK عن certificates. ٨) ابدأ الـ troubleshooting من IKE SA وبعدين IPsec SA وبعدين العدادات.' },
      ],
    },
  ],
}
