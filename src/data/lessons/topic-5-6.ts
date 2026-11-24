import type { Lesson } from '../types'

const aclTermRows: string[][] = [
  ['ACL', 'Access Control List', 'Ordered list of rules that permits or denies packets on a Layer 3 device'],
  ['ACE', 'Access Control Entry', 'One line inside an ACL, for example: permit tcp ... eq 443'],
  [' permit', 'Allow the matching packet', 'The packet continues through the router'],
  [' deny', 'Drop the matching packet', 'The packet does not continue'],
  ['Implicit deny', 'Last invisible rule', 'If no ACE matches, the packet is denied'],
  ['Wildcard mask', 'Bit-matching tool for ACLs', '0 means the bit must match, 1 means ignore the bit'],
  ['Stateless filter', 'Filter without tracking connection state', 'An ACL inspects the packet in front of it, not a whole session'],
]

const scenarioRows: string[][] = [
  ['Allow one network to a server', 'LAN1 reaches the internal server, other sources do not', 'Extended ACL with source network, host destination and port'],
  ['Block one source', 'A specific host or subnet is prevented from reaching a protected LAN', 'ACL with deny for that source, then permit for required traffic'],
  ['Allow HTTP/HTTPS only', 'Users reach web services but not other applications', 'Extended ACL matching tcp eq 80 or eq 443'],
  ['Separate departments', 'HR and Guest networks cannot reach each other directly', 'ACL between Layer 3 interfaces, applied in the correct direction'],
  ['Control entering or leaving traffic', 'Filter packets on arrival or before they exit an interface', 'ip access-group with in or out on the chosen interface'],
]

const typeRows: string[][] = [
  ['Matching criteria', 'Source IPv4 address (primarily)', 'Source and destination IPv4, protocol, TCP/UDP ports, ICMP type where supported'],
  ['Flexibility', 'Limited; broad decisions', 'Granular; can target one service between two networks'],
  ['Typical use case', 'Quickly allow or block a whole source network', 'Allow one application while denying other traffic'],
  ['Numbered support', 'Yes, for example access-list 10', 'Yes, for example access-list 101'],
  ['Named support', 'Yes, ip access-list standard NAME', 'Yes, ip access-list extended NAME'],
  ['Placement guideline', 'Commonly closer to the destination', 'Commonly closer to the source'],
  ['Important limitation', 'Cannot distinguish destination, protocol or port like an extended ACL', 'Needs correct source, destination, protocol and port values'],
]

const numberRows: string[][] = [
  ['1 - 99', 'Standard IPv4 ACL', 'access-list 10 permit 192.168.10.0 0.0.0.255'],
  ['100 - 199', 'Extended IPv4 ACL', 'access-list 101 permit ip any any'],
  ['1300 - 1999', 'Standard IPv4 expanded range', 'Traditional IOS range; support depends on platform and version'],
  ['2000 - 2699', 'Extended IPv4 expanded range', 'Traditional IOS range; support depends on platform and version'],
  ['Name', 'Standard or Extended depends on keyword', 'ip access-list standard OFFICE-FILTER / ip access-list extended WEB-ACCESS'],
]

const wildcardRows: string[][] = [
  ['192.168.10.0/24', '255.255.255.0', '0.0.0.255', 'Last 8 bits ignored'],
  ['192.168.10.0/25', '255.255.255.128', '0.0.0.127', 'Last 7 bits ignored; first bit must match'],
  ['192.168.10.0/26', '255.255.255.192', '0.0.0.63', 'Last 6 bits ignored; first two bits must match'],
  ['Single host 192.168.10.5', '255.255.255.255', '0.0.0.0', 'Every bit must match'],
  ['All addresses', '0.0.0.0', '255.255.255.255', 'Every bit ignored; the any keyword'],
]

const wildcardConceptRows: string[][] = [
  ['Question answered', 'Which part is network and which part is host?', 'Which bits must match and which bits are ignored?'],
  ['Bit 0', 'Can be part of the network prefix', 'The corresponding address bit MUST match exactly'],
  ['Bit 1', 'Can be a host bit', 'The corresponding address bit is IGNORED'],
  ['Used in', 'IP addressing and subnetting', 'ACL comparisons against a source or destination address'],
  ['Common /24 value', '255.255.255.0', '0.0.0.255'],
  ['Other possibilities', 'Contiguous subnet masks', 'Non-contiguous wildcards exist for special policies; match bits, do not just subtract'],
]

const directionRows: string[][] = [
  ['Point of check', 'Packets ENTERING the interface', 'Packets LEAVING the interface'],
  ['Routing decision', 'Before the router forwards the packet', 'After the router chooses the outgoing interface'],
  ['Example command', 'interface GigabitEthernet0/0 + ip access-group 101 in', 'interface GigabitEthernet0/1 + ip access-group 101 out'],
  ['Typical use', 'Stop unwanted traffic as soon as it arrives', 'Filter traffic just before it reaches a protected LAN'],
  ['Perspective', 'Relative to the router interface, not the user', 'Relative to the router interface, not the user'],
]

const workflowRows: string[][] = [
  ['1', 'Identify the traffic to control', 'Write the policy in one sentence before touching the CLI'],
  ['2', 'Identify source and destination networks', 'Note addresses and prefixes on the topology'],
  ['3', 'Identify protocol and ports', 'HTTPS = TCP 443, DNS = UDP 53, ICMP for ping'],
  ['4', 'Choose Standard or Extended', 'Source only, or source plus destination and service'],
  ['5', 'Write ACEs in the correct order', 'Specific permits before broader denies'],
  ['6', 'Account for implicit deny', 'Add explicit permits for traffic that must pass'],
  ['7', 'Choose the interface', 'Follow the actual path of the packets'],
  ['8', 'Choose in or out', 'Decide from the router interface perspective'],
  ['9', 'Apply the ACL', 'ip access-group <number-or-name> in|out'],
  ['10', 'Verify behavior', 'Use show commands and test representative packets'],
]

const verifyRows: string[][] = [
  ['show access-lists', 'Lists configured ACLs and their ACEs', 'Confirms the ACL exists and shows hit counters where supported'],
  ['show ip access-lists', 'IPv4 ACL details and match counters', 'Shows which ACEs are being matched by traffic'],
  ['show running-config', 'Full running configuration', 'Confirms ACE text and the ip access-group line under the interface'],
  ['show ip interface', 'Interface details including applied ACLs', 'Confirms the ACL is applied to the right interface and direction'],
  ['Traffic test', 'Ping, HTTPS or a lab packet simulation', 'Confirms real behavior matches the written policy'],
]

const troubleRows: string[][] = [
  ['Wrong wildcard mask', 'Expected source never matches the permit', 'show ip access-lists: compare address and wildcard', 'Recalculate bits and replace the ACL or ACE carefully'],
  ['Incorrect ACE order', 'Permitted traffic is dropped by an earlier deny', 'show access-lists: read lines top to bottom', 'Put specific permits before broader denies'],
  ['Forgotten implicit deny', 'Required extra services are dropped', 'Check whether any permit matches that traffic', 'Add an explicit permit for the required traffic'],
  ['Wrong interface', 'ACL has no effect on the traffic', 'show ip interface on both paths', 'Apply the ACL on an interface the packets actually cross'],
  ['Wrong direction', 'Traffic still passes or is dropped unexpectedly', 'show running-config: check in or out', 'Choose the direction relative to the router interface'],
  ['Standard used where Extended is needed', 'Cannot match the destination or the port', 'show ip access-lists: inspect matching fields', 'Replace with an Extended ACL that matches the required fields'],
  ['Missing ip access-group', 'ACL exists but nothing changes', 'show ip interface: no ACL listed', 'Apply the ACL under the correct interface'],
  ['Legitimate traffic blocked', 'Users lose access after applying the ACL', 'Hit counters and traffic tests', 'Add a narrow permit for the required traffic, not a blanket permit'],
  ['Incorrect source or destination', 'Wrong packets match the ACE', 'show access-lists plus topology addressing table', 'Correct the address and wildcard on both ends of the policy'],
  ['Incorrect protocol or port', 'Application still fails while other traffic works', 'show access-lists: check tcp, udp, icmp and eq values', 'Match the actual application port and protocol'],
  ['Order not rechecked after editing', 'New ACE is ignored', 'show access-lists after every change', 'Confirm final sequence numbers and hit counters'],
  ['Management access affected', 'SSH or Telnet session drops during change', 'Check which traffic the ACL matches before applying', 'Plan a management exception and a fallback access path first'],
]

const summaryTypeRows: string[][] = [
  ['Matches', 'Source IPv4 mainly', 'Source, destination, protocol, ports, ICMP type'],
  ['Granularity', 'Broad', 'Fine'],
  ['Placement guideline', 'Near destination', 'Near source, but follow the policy and topology'],
]

const summaryNumberRows: string[][] = [
  ['Identity', 'Number such as 10 or 101', 'Meaningful name such as WEB-ACCESS'],
  ['Readability', 'Shorter but less descriptive', 'Easier to read and maintain'],
  ['Editing', 'Platform-dependent; traditional numbered edits are limited', 'Sequence numbers support inserting or removing ACEs where supported'],
]

const summaryDirectionRows: string[][] = [
  ['When checked', 'On arrival, before forwarding', 'After routing, before exit'],
  ['Command', 'ip access-group 101 in', 'ip access-group 101 out'],
  ['Meaning', 'Entering this router interface', 'Leaving this router interface'],
]

const summaryMaskRows: string[][] = [
  ['Purpose', 'Defines network and host bits', 'Defines match and ignore bits for ACL comparison'],
  ['/24 value', '255.255.255.0', '0.0.0.255'],
  ['Bit meaning', '1 is part of the network prefix', '0 must match, 1 is ignored'],
]

const summaryActionRows: string[][] = [
  ['permit', 'Explicit ACE allowing a match', 'Packet continues'],
  ['deny', 'Explicit ACE dropping a match', 'Packet is discarded'],
  ['Implicit deny', 'Invisible final rule when nothing matched', 'Packet is discarded; add explicit permits for required traffic'],
]

export const topic56Lesson: Lesson = {
  topicId: '5.6',
  title: 'Configure and verify access control lists',
  description:
    'Topic 5.6 يشرح الـ Access Control Lists: إزاي الـ ACEs بتتقيم، والفرق بين Standard وExtended، وNumbered وNamed، والـ wildcard masks، واتجاه in وout، والتهيئة والتحقق وحل المشكلات. الشرح بالعربية المصرية البسيطة والمصطلحات التقنية بالإنجليزي. كل الأمثلة والطوبولوجيات تعليمية وهمية.',
  estimatedTime: '~160 دقيقة',
  steps: [
    {
      id: 'what',
      title: 'What Are Access Control Lists?',
      short: 'إيه الـ ACL وليه بنستخدمه؟',
      blocks: [
        { type: 'paragraph', text: '**Access Control List (ACL)** هي قائمة قواعد مرتبة على جهاز Layer 3، زي الراوتر أو Layer 3 switch. كل قاعدة بتتسمى **Access Control Entry (ACE)**، وبتفحص الحزمة وتقرر **permit** أو **deny**.' },
        { type: 'diagram', id: 'acl-overview', caption: 'من وصول حزمة لقرار permit أو deny — شغّل الخطوات وشوف مكان الـ ACL.' },
        { type: 'paragraph', text: 'الراوتر بيستخدم الـ ACL عشان يتحكم في الترافيك اللي بيدخل أو بيخرج من interface، أو ترافيك بيتم توجيهه بين الشبكات. الـ ACL مش بروتوكول توجيه؛ هو **packet filter** بيفحص الحزمة حسب القواعد المكتوبة.' },
        { type: 'table', headers: ['Term', 'Meaning', 'Example'], rows: aclTermRows },
        { type: 'paragraph', text: 'الـ ACL بيراجع معلومات زي **source address** و**destination address** والـ protocol والمنفذ في الـ Extended ACL. يعني ممكن نقول: «اسمح لـ LAN1 توصل HTTPS للسيرفر بس»، أو «امنع مصدر معين من دخول شبكة محمية».' },
        { type: 'table', headers: ['Practical scenario', 'Policy', 'Typical ACL approach'], rows: scenarioRows },
        { type: 'diagram', id: 'acl-packet-entry', caption: 'الحزمة بتوصل الـ interface والراوتر بيسأل: هل فيه ACL مطبّق هنا؟' },
        { type: 'callout', tone: 'warning', title: 'ACL مش stateful firewall', text: 'الـ ACL **stateless packet filter**: بيفحص كل حزمة لوحدها وما بيتتبعش حالة الاتصال بالكامل. مش لازم يكون stateful firewall، ومش بياخد قرار بناءً على «الجلسة» زي جدار ناري stateful. كمان Created ACL لوحده ما بيشتغلش؛ لازم يتطبّق على interface أو feature مناسب بـ ip access-group.' },
      ],
    },
    {
      id: 'how',
      title: 'How ACL Processing Works',
      short: 'إزاي الـ ACL بيقرر؟',
      blocks: [
        { type: 'paragraph', text: 'فكر في الـ ACL كقائمة أسئلة مرتبة. الحزمة بتوصل، والراوتر بيقرأ السطر الأول، بعدين اللي بعده، لحد ما يلاقي سطر بيطابقها. أول سطر بيطابق بيحدد القرار، والفحص بيوقف فوراً.' },
        { type: 'diagram', id: 'acl-processing-flow', caption: 'تدفق الفحص من الأعلى لأسفل لحد أول match أو الـ implicit deny.' },
        { type: 'list', ordered: true, items: [
          'حزمة بتوصل ل interface.',
          'الراوتر بيفحص هل فيه ACL مطبّق في الاتجاه المناسب على الـ interface ده.',
          'الـ ACEs بتتقيم بالترتيب من الأعلى للأسفل (top-down).',
          'أول ACE بيطابق الحزمة بيحدد القرار: permit أو deny.',
          'الـ processing بيوقف بعد أول match؛ السطور اللي بعده ما تتقرأش.',
          'لو مفيش أي ACE طابق الحزمة، قاعدة **implicit deny** في الآخر بترفضها.',
        ]},
        { type: 'diagram', id: 'acl-first-match', caption: 'اختر حزمة وشوف أي ACE بيطابقها أولاً والقرار النهائي.' },
        { type: 'paragraph', text: 'الـ **order** مهم جداً. لو كتبنا deny عام في أول القائمة، هيطابق كل حزمة ويمنع الـ permit المحدد اللي تحته من إنه يتفحص أصلاً.' },
        { type: 'diagram', id: 'acl-order-mistake', caption: 'قارن ترتيب deny أولاً بترتيب permit أولاً لنفس الحزمة.' },
        { type: 'code', label: 'ترتيب غلط — HTTPS هيترفض', language: 'cisco', code: 'access-list 101 deny ip 192.168.10.0 0.0.0.255 any\naccess-list 101 permit tcp 192.168.10.0 0.0.0.255 host 192.168.20.10 eq 443\naccess-list 101 permit ip any any' },
        { type: 'code', label: 'ترتيب صح — HTTPS يوصل', language: 'cisco', code: 'access-list 101 permit tcp 192.168.10.0 0.0.0.255 host 192.168.20.10 eq 443\naccess-list 101 deny ip 192.168.10.0 0.0.0.255 any\naccess-list 101 permit ip any any' },
        { type: 'diagram', id: 'acl-implicit-deny', caption: 'جرّب حزمة مطابقة وحزمة غير مطابقة وشوف الـ implicit deny.' },
        { type: 'callout', tone: 'danger', title: 'قاعدة ذهبية', text: 'الـ ACL بيبدأ بـ first match، وينتهي بـ implicit deny. أي ترافيك عايز يوصل لازم له permit صريح قبل أي deny عام، وإلا هيقع في الرفض في الآخر.' },
      ],
    },
    {
      id: 'packet',
      title: 'Standard ACLs vs Extended ACLs',
      short: 'Standard ولا Extended؟',
      blocks: [
        { type: 'paragraph', text: 'الـ **Standard ACL** بيطابق الـ source IPv4 address غالباً. ما بيفرقش بين destination أو protocol أو port، فقراره عام. الـ **Extended ACL** بيطابق source وdestination والبروتوكول والمنفذ، فبيسمح بسياسة أدق.' },
        { type: 'diagram', id: 'acl-standard-match', caption: 'Standard ACL: نفس القرار لأي وجهة أو خدمة من نفس المصدر.' },
        { type: 'code', label: 'Standard ACL example', language: 'cisco', code: 'access-list 10 permit 192.168.10.0 0.0.0.255\naccess-list 10 deny any' },
        { type: 'list', items: [
          '`access-list 10`: رقم ACL 10، وهو Standard لأن الرقم داخل النطاق التقليدي 1-99.',
          '`permit`: السماح للحزم المطابقة.',
          '`192.168.10.0 0.0.0.255`: الشبكة + wildcard، يعني أي source داخل 192.168.10.x.',
          '`deny any`: رفض صريح للباقي، وبيوضّح نية السياسة.' ,
        ]},
        { type: 'diagram', id: 'acl-extended-match', caption: 'Extended ACL: اختر حزمة وشوف تأثير المصدر والوجهة والبروتوكول والمنفذ.' },
        { type: 'code', label: 'Extended ACL example', language: 'cisco', code: 'access-list 101 permit tcp 192.168.10.0 0.0.0.255 host 192.168.20.10 eq 443\naccess-list 101 deny ip any any' },
        { type: 'list', items: [
          '`tcp`: البروتوكول لازم يكون TCP.',
          '`192.168.10.0 0.0.0.255`: شبكة المصدر والـ wildcard.',
          '`host 192.168.20.10`: عنوان destination واحد بالظبط.',
          '`eq 443`: منفذ الوجهة يساوي 443 (HTTPS).',
          '`permit` / `deny`: القرار عند أول تطابق.',
        ]},
        { type: 'diagram', id: 'acl-type-compare', caption: 'قارن المعايير والمرونة والاستخدام والتطبيق.' },
        { type: 'table', headers: ['Aspect', 'Standard ACL', 'Extended ACL'], rows: typeRows },
        { type: 'paragraph', text: 'قاعدة التطبيق الشائعة: الـ **Standard** غالباً قريب من الـ destination، والـ **Extended** غالباً قريب من الـ source. السبب إن Standard ما بيعرفش الوجهة، فلو حطيناه قرب المصدر ممكن يمنع ترافيك مسموح لوجهات تانية. الـ Extended بيعرف الوجهة والخدمة، فبيفضل يتطبّق بدري. ده **guideline عام مش قانون**؛ السياسة والطوبولوجيا هما اللي بيحددوا مكان التطبيق.' },
        { type: 'diagram', id: 'acl-standard-placement', caption: 'Standard ACL قرب الشبكة المحمية، واتجاه out ناحيتها.' },
        { type: 'diagram', id: 'acl-extended-placement', caption: 'Extended ACL قرب المصدر، واتجاه in على واجهة الدخول.' },
      ],
    },
    {
      id: 'config',
      title: 'Numbered ACLs vs Named ACLs',
      short: 'بالرقم ولا بالاسم؟',
      blocks: [
        { type: 'paragraph', text: 'الـ **Numbered ACL** بيتعرف برقم. الرقم التقليدي بيقول نوع الـ ACL: الأرقام 1-99 لـ Standard IPv4، و100-199 لـ Extended IPv4. فيه نطاقات موسعة كمان، والتوفر بيختلف حسب المنصة والإصدار.' },
        { type: 'diagram', id: 'acl-numbered-id', caption: 'اختر نطاق رقم وشوف النوع والمثال.' },
        { type: 'code', label: 'Numbered standard ACL', language: 'cisco', code: 'access-list 10 permit 192.168.10.0 0.0.0.255' },
        { type: 'code', label: 'Numbered extended ACL', language: 'cisco', code: 'access-list 101 permit ip any any' },
        { type: 'table', headers: ['Number / name', 'Meaning', 'Example or note'], rows: numberRows },
        { type: 'paragraph', text: 'الـ **Named ACL** بيتعرف باسم واضح زي `OFFICE-FILTER` أو `WEB-ACCESS`. أسهل في القراءة والصيانة، بيستخدم كلمة `standard` أو `extended` لتحديد النوع، وغالباً بيدعم **sequence numbers** تسمح بإدراج أو حذف ACE معين. مش كل المنصات أو الإصدارات بتدعم نفس سلوك التعديل، فدايماً راجع المنصة.' },
        { type: 'code', label: 'Named standard ACL', language: 'cisco', code: 'ip access-list standard OFFICE-FILTER\n 10 permit 192.168.10.0 0.0.0.255\n 20 deny any' },
        { type: 'code', label: 'Named extended ACL', language: 'cisco', code: 'ip access-list extended WEB-ACCESS\n 10 permit tcp 192.168.10.0 0.0.0.255 host 192.168.20.10 eq 443\n 20 deny ip any any' },
        { type: 'diagram', id: 'acl-named-sequence', caption: 'اختر ACE وشوف الترتيب داخل named ACL.' },
        { type: 'diagram', id: 'acl-editing-sequence', caption: 'جرّب إدراج ACE وحذفه وراجعة الترتيب النهائي.' },
        { type: 'callout', tone: 'info', title: 'بعد أي تعديل', text: 'استخدم `show access-lists` أو `show ip access-lists` عشان تتأكد من الترتيب الفعلي ومن الـ hit counters. الـ sequence number بيحدد مكان السطر في الفحص.' },
      ],
    },
    {
      id: 'verify',
      title: 'Wildcard Masks and Interface Direction',
      short: 'Wildcard و in / out',
      blocks: [
        { type: 'paragraph', text: 'الـ **wildcard mask** بيقول للـ ACL إيه البتات اللي لازم تتطابق وإيه البتات اللي يتجاهلها وقت مقارنة العنوان. **`0` يعني البت لازم يتطابق بالظبط، و`1` يعني البت يتجاهل.** ده مش نفس فكرة الـ subnet mask.' },
        { type: 'diagram', id: 'acl-mask-vs-wildcard', caption: 'قارن Subnet mask بـ Wildcard mask واختار المعنى.' },
        { type: 'table', headers: ['Concept', 'Subnet mask', 'Wildcard mask'], rows: wildcardConceptRows },
        { type: 'diagram', id: 'acl-wildcard-bits', caption: 'مقارنة على مستوى البت بين عنوان ACL والـ wildcard وعنوان الحزمة.' },
        { type: 'paragraph', text: 'مثال على /25: عنوان ACL `192.168.10.0` والـ wildcard `0.0.0.127`. في الأوكتت الأخير الـ wildcard `01111111`: أول بت لازم يساوي 0، والباقي متجاهل. العنوان `192.168.10.100` (= `01100100`) بيطابق، لكن `192.168.10.140` (= `10001100`) ما بيطابقش لأن أول بت 1.' },
        { type: 'diagram', id: 'acl-wildcard-24', caption: 'احسب wildcard الخاص بـ /24 خطوة بخطوة.' },
        { type: 'diagram', id: 'acl-wildcard-2526', caption: 'قارن /25 و/26 وشوف أي عنوان داخل النطاق.' },
        { type: 'table', headers: ['Network', 'Subnet mask', 'Wildcard mask', 'Meaning'], rows: wildcardRows },
        { type: 'code', label: 'host and any shortcuts', language: 'cisco', code: 'access-list 10 permit host 192.168.10.5\naccess-list 10 permit any' },
        { type: 'diagram', id: 'acl-host-any', caption: 'اختار host أو any أو 0.0.0.255 وشوف الفرق.' },
        { type: 'diagram', id: 'acl-wildcard-match', caption: 'اختار source وشوف هل بيطابق 192.168.10.0 0.0.0.255.' },
        { type: 'callout', tone: 'tip', title: 'مفيش قاعدة «دائماً العكس»', text: 'في أمثلة الشبكات المتجاورة الـ wildcard غالباً بيساوي مقلوب الـ subnet mask، زي /24 → 0.0.0.255. بس في وصف البتات هو أداة matching مستقلة، وفي سياسات متقدمة ممكن يتستخدم wildcard غير مت contiguous. احسب البتات، وما تفترضش العكس في كل حالة.' },
        { type: 'paragraph', text: 'الاتجاه **in** و**out** نسبي للراوتر والـ interface， مش وجهة نظر المستخدم. `in` يعني الحزمة داخلة للـ interface قبل قرار التوجيه. `out` يعني الحزمة خارجة من الـ interface بعد ما الراوتر اختار المسار، وقبل ما تخرج فعلياً.' },
        { type: 'code', label: 'Inbound ACL on Gi0/0', language: 'cisco', code: 'interface GigabitEthernet0/0\n ip access-group 101 in' },
        { type: 'code', label: 'Outbound ACL on Gi0/1', language: 'cisco', code: 'interface GigabitEthernet0/1\n ip access-group 101 out' },
        { type: 'diagram', id: 'acl-inbound-flow', caption: 'Inbound: الفحص قبل قرار التوجيه.' },
        { type: 'diagram', id: 'acl-outbound-flow', caption: 'Outbound: الفحص بعد التوجيه وقبل الخروج.' },
        { type: 'diagram', id: 'acl-direction-compare', caption: 'قارن in وout واختبر فهمك لوجهة نظر الراوتر.' },
        { type: 'table', headers: ['Aspect', 'Inbound (in)', 'Outbound (out)'], rows: directionRows },
      ],
    },
    {
      id: 'mistakes',
      title: 'ACL Configuration, Verification, and Troubleshooting',
      short: 'تهيئة وتحقق وحل مشكلات',
      blocks: [
        { type: 'paragraph', text: 'الطريقة المنهجية: حدد الترافيك، حدد المصدر والوجهة، حدد البروتوكول والمنفذ، اختر Standard أو Extended، اكتب الـ ACEs بالترتيب، احسب الـ implicit deny، اختر الـ interface والاتجاه، طبّق، وبعدين تحقق.' },
        { type: 'diagram', id: 'acl-config-workflow', caption: 'خطوات التهيئة من أول تحليل للسياسة لحد التحقق.' },
        { type: 'table', headers: ['Step', 'Action', 'Practical note'], rows: workflowRows },
        { type: 'paragraph', text: '**طوبولوجيا مشتركة للأمثلة التالية:** الراوتر R1 عنده `Gi0/0` ناحية `LAN1: 192.168.10.0/24`، و`Gi0/1` ناحية `LAN2: 192.168.20.0/24` (فيها السيرفر `192.168.20.10`)، و`Gi0/2` ناحية `LAN3: 192.168.30.0/24`. كل الأمثلة بدائل منفصلة، مش ACLs شغالة في نفس الوقت.' },
        { type: 'paragraph', text: '**Scenario 1 — Standard ACL:** السياسة: «مفيش غير LAN1 يوصل لـ LAN3». الوجهة المحمية LAN3، فبنطبّق الـ ACL قرب الوجهة باتجاه `out` على `Gi0/2`. Addressing: LAN1 `192.168.10.0/24`، LAN2 `192.168.20.0/24`، LAN3 `192.168.30.0/24`.' },
        { type: 'code', label: 'Scenario 1 — standard ACL', language: 'cisco', code: 'access-list 10 permit 192.168.10.0 0.0.0.255\naccess-list 10 deny any\n!\ninterface GigabitEthernet0/2\n ip access-group 10 out' },
        { type: 'list', items: [
          'ACE 10 يسمح بأي source داخل 192.168.10.x.',
          'ACE 20 يرفض صراحةً الباقي، وبيوضّح نية السياسة.',
          '`ip access-group 10 out` على Gi0/2 معناة إن الفحص بيحصل على الحزم الخارجة ناحية LAN3.',
          'السلوك المتوقع: LAN1 → LAN3 permit؛ LAN2 → LAN3 deny؛ LAN1 → LAN2 مش متأثر لأنها بتخرج من Gi0/1.',
        ]},
        { type: 'paragraph', text: '**Scenario 2 — Extended ACL:** السياسة: «من LAN1: اسمح HTTPS للسيرفر 192.168.20.10 واسمح ICMP لـ LAN3، وارفض باقي IP القادم من LAN1. الترافيك من مصادر تانية مش تحت سياسة الـ ACL ده.» بنطبّق `in` على `Gi0/0` قرب المصدر.' },
        { type: 'code', label: 'Scenario 2 — extended ACL', language: 'cisco', code: 'access-list 101 permit tcp 192.168.10.0 0.0.0.255 host 192.168.20.10 eq 443\naccess-list 101 permit icmp 192.168.10.0 0.0.0.255 192.168.30.0 0.0.0.255\naccess-list 101 deny ip 192.168.10.0 0.0.0.255 any\naccess-list 101 permit ip any any\n!\ninterface GigabitEthernet0/0\n ip access-group 101 in' },
        { type: 'list', items: [
          'ACE 10: HTTPS فقط من LAN1 للسيرفر المحدد — TCP 443.',
          'ACE 20: ICMP من LAN1 إلى LAN3 لاختبار الوصول.',
          'ACE 30: رفض باقي IP القادم من LAN1، وجاي بعد الـ permits المحددة.',
          'ACE 40: permit صريح لما تبقى من ترافيك المصادر التانية حسب السياسة المذكورة.',
          'السلوك المتوقع: TCP 443 → permit؛ TCP 80 للسيرفر → deny؛ ICMP لـ LAN3 → permit.',
        ]},
        { type: 'paragraph', text: '**Scenario 3 — Named Extended ACL:** السياسة: «من LAN1 اسمح HTTPS وHTTP للسيرفر 192.168.20.10، واسمح DNS لخادم 192.168.20.53، وارفض باقي IP من LAN1، وسيب الترافيك التاني زي ما هو». بنستخدم sequence numbers وبنطبّق `in` على `Gi0/0`.' },
        { type: 'code', label: 'Scenario 3 — named extended ACL', language: 'cisco', code: 'ip access-list extended WEB-ACCESS\n 10 permit tcp 192.168.10.0 0.0.0.255 host 192.168.20.10 eq 443\n 20 permit tcp 192.168.10.0 0.0.0.255 host 192.168.20.10 eq 80\n 30 permit udp 192.168.10.0 0.0.0.255 host 192.168.20.53 eq 53\n 40 deny ip 192.168.10.0 0.0.0.255 any\n 50 permit ip any any\n!\ninterface GigabitEthernet0/0\n ip access-group WEB-ACCESS in' },
        { type: 'list', items: [
          'ACE 10 و20 يسمحوا HTTPS وHTTP للسيرفر المحدد فقط.',
          'ACE 30 يسمح UDP/53 لخادم DNS المحدد.',
          'ACE 40 يرفض باقي IP من LAN1 بعد الاستثناءات.',
          'ACE 50 يسمح صراحةً بترافيك المصادر التانية زي ما السياسة قالت.',
          'لو احتجنا نضيف خدمة، ممكن ندرج ACE برقم بين السطور حيث تدعم المنصة، وبعدين نراجع الترتيب.',
        ]},
        { type: 'table', headers: ['Command', 'What it verifies', 'Troubleshooting use'], rows: verifyRows },
        { type: 'paragraph', text: 'الـ **hit counters** في `show access-lists` و`show ip access-lists` بيورّوا أي ACE طابق حزم. لو العداد بيزيد على سطر deny متوقع، معناة إن ترافيك حقيقي بيوصل له. دعم العدادات وطريقة عرضها ممكن تختلف حسب المنصة والإصدار.' },
        { type: 'diagram', id: 'acl-hit-counter', caption: 'اختر ACE وشوف إزاي الـ hit counters بتساعد في التشخيص.' },
        { type: 'diagram', id: 'acl-troubleshooting-tree', caption: 'شجرة قرار: اختر عرض وشوف السبب المحتمل.' },
        { type: 'table', headers: ['Issue', 'Symptom', 'Verification', 'Safe correction'], rows: troubleRows },
        { type: 'callout', tone: 'warning', title: 'تغيير آمن', text: 'ما تشيل ACL من جهاز إنتاجي عشوائياً. راجع الترتيب والـ hit counters، خطّط لاستثناء محدد، واتأكد إن الوصول البديل للإدارة متاح قبل التطبيق.' },
      ],
    },
    {
      id: 'lab',
      title: 'Hands-on Interactive ACL Labs',
      short: '3 لابرات تفاعلية',
      blocks: [
        { type: 'paragraph', text: 'اللابرات تعليمية جوه الصفحة: تقدر تختار قرار الحزمة وتقرأ التغذية الراجعة فوراً. **ما اتعملش أي تنفيذ على أجهزة Cisco حقيقية أو Packet Tracer.**' },
        { type: 'paragraph', text: '**Lab 1 — Build a Standard ACL.** الطوبولوجيا: R1 بين LAN1 `192.168.10.0/24` على Gi0/0، LAN2 `192.168.20.0/24` على Gi0/1، وLAN3 `192.168.30.0/24` على Gi0/2 (شبكة محمية). السياسة: LAN1 بس يوصل لـ LAN3. الهدف: تحديد المصدر، اختيار ACL standard واتجاه التطبيق، وتوقّع قرار الحزمة.' },
        { type: 'code', label: 'Lab 1 starting configuration', language: 'cisco', code: 'access-list 10 permit 192.168.10.0 0.0.0.255\naccess-list 10 deny any\n!\ninterface GigabitEthernet0/2\n ip access-group 10 out' },
        { type: 'diagram', id: 'acl-lab-standard', caption: 'Lab 1 — تنقّل بين الحزم واختار Permit أو Deny أو Not filtered.' },
        { type: 'paragraph', text: '**Lab 2 — Build an Extended ACL.** الطوبولوجيا: LAN1 `192.168.10.0/24` عملاء، سيرفر `192.168.20.10` في `192.168.20.0/24`، و`LAN3: 192.168.30.0/24` خدمات داخلية. السياسة: HTTPS من LAN1 للسيرفر مسموح، ICMP من LAN1 لـ LAN3 مسموح، وباقي IP من LAN1 مرفوض. الهدف: تحديد المصدر والوجهة، اختيار TCP والمنفذ 443، ترتيب الـ ACEs، واختيار `in` على Gi0/0.' },
        { type: 'code', label: 'Lab 2 starting configuration', language: 'cisco', code: 'access-list 101 permit tcp 192.168.10.0 0.0.0.255 host 192.168.20.10 eq 443\naccess-list 101 permit ip 192.168.10.0 0.0.0.255 192.168.30.0 0.0.0.255\naccess-list 101 deny ip any any\n!\ninterface GigabitEthernet0/0\n ip access-group 101 in' },
        { type: 'diagram', id: 'acl-lab-extended', caption: 'Lab 2 — اختبر أربع حزم وشوف نتيجة كل قرار.' },
        { type: 'paragraph', text: '**Lab 3 — ACL Troubleshooting Challenge.** الـ ACL فيه أخطاء مقصودة: wildcard غلط، deny عام قبل permit محدد، اتجاه تطبيق غلط، permit مفقود، ومنفذ غلط. الهدف: تفحص القائمة، تحدد المشكلة، تتوقع أثرها، ترتب الحل، وتتحقق بالأوامر.' },
        { type: 'diagram', id: 'acl-lab-troubleshoot', caption: 'Lab 3 — شخّص ست حالات واقرأ التلميح قبل الاختيار.' },
        { type: 'list', items: [
          'معايير الإكمال: كل حزمة في Lab 1 وLab 2 ليها قرار صحيح، وكل حالة في Lab 3 تم تشخيصها.',
          'استخدم زر «السابق» و«التالي» للتنقل، وزر «إعادة» لبدء اللاب من أول سيناريو.',
          'التلميح متاح قبل الاختيار، والتغذية الراجعة بتظهر بعد اختيارك.',
        ]},
        { type: 'callout', tone: 'info', title: 'Simulation boundary', text: 'اللابرات محاكاة تعليمية داخل الصفحة. ما بيتنفّذش أي أمر_on physical hardware أو Packet Tracer، ومفيش أي كلمات سر أو أسرار حقيقية.' },
      ],
    },
    {
      id: 'exam',
      title: 'CCNA Exam Quiz',
      short: 'اختبار CCNA',
      blocks: [
        { type: 'paragraph', text: '**اختبار CCNA:** 5 أسئلة، 4 خيارات لكل سؤال، مزيج من single وmultiple. مفيش feedback قبل الضغط على Submit، والإجابات بتتقفل بعد الإرسال.' },
        { type: 'quiz', questions: [
          {
            id: 'q1',
            prompt: 'A router must allow only traffic from 192.168.10.0/24 to reach a protected LAN. Destination address, protocol, and port do not need to be distinguished. Which ACL type fits best?',
            options: [
              'A Standard ACL, because it primarily matches the source IPv4 address.',
              'An Extended ACL, because every ACL must match the destination port.',
              'A Named ACL only, because numbered ACLs cannot permit a whole subnet.',
              'No ACL is needed because implicit deny already permits matching traffic.',
            ],
            correctIndex: 0,
            requireSubmit: true,
            explanation: 'الصح هو **(A)**: Standard ACL بيطابق المصدر غالباً ويناسب قرار عام زي ده. (B) غلط لأن Extended مش إلزامي هنا. (C) غلط لأن Numbered ACL يقدر يسمح subnet كامل. (D) غلط لأن implicit deny بيرفض، مش يسمح.',
          },
          {
            id: 'q2',
            kind: 'multiple',
            prompt: 'Which statements about numbered and named ACLs are correct? (Choose more than one.)',
            options: [
              'Traditional IOS numbered ranges identify the ACL type, such as 10 for standard IPv4 and 101 for extended IPv4.',
              'Named ACLs are often easier to read and maintain because the name describes the purpose.',
              'Named ACLs commonly use sequence numbers that help when inserting or removing ACEs, subject to platform support.',
              'A named ACL can never be an extended ACL; names are only for standard ACLs.',
            ],
            correctIndices: [0, 1, 2],
            requireSubmit: true,
            explanation: 'الصح هو **(A) و(B) و(C)**: الأرقام التقليدية بتدل على النوع، والاسم بيوضّح الغرض، والـ sequence numbers بتساعد في التعديل حيث مدعومة. (D) غلط لأن فيه `ip access-list standard` و`ip access-list extended`.',
          },
          {
            id: 'q3',
            kind: 'multiple',
            prompt: 'Which statements about wildcard masks are correct? (Choose more than one.)',
            options: [
              'A wildcard bit of 0 means the corresponding address bit must match exactly.',
              'A wildcard bit of 1 means the corresponding address bit is ignored.',
              'For 192.168.10.0/25 the wildcard mask is 0.0.0.127, so addresses .0 through .127 match.',
              'A wildcard mask is identical in purpose to a subnet mask and uses the value 255.255.255.0 for every /24 ACL.',
            ],
            correctIndices: [0, 1, 2],
            requireSubmit: true,
            explanation: 'الصح هو **(A) و(B) و(C)**: 0 يعني لازم يتطابق، 1 يعني يتجاهل، و/25 بيغطي .0 لـ .127 بالـ wildcard 0.0.0.127. (D) غلط لأن الـ subnet mask بيحدد network/host والـ wildcard بيحدد match/ignore، و/24 ACL بيستخدم 0.0.0.255.',
          },
          {
            id: 'q4',
            prompt: 'An ACL has these ACEs in order: 10 deny ip 192.168.10.0 0.0.0.255 any; 20 permit tcp 192.168.10.0 0.0.0.255 host 192.168.20.10 eq 443. What happens to an HTTPS packet from 192.168.10.20 to 192.168.20.10?',
            options: [
              'It is denied by ACE 10 because first-match processing stops before ACE 20 is evaluated.',
              'It is permitted by ACE 20 because a specific permit always overrides an earlier deny.',
              'It is denied by the implicit deny because ACE 10 does not match TCP traffic.',
              'It is not filtered because HTTPS is not IP traffic.',
            ],
            correctIndex: 0,
            requireSubmit: true,
            explanation: 'الصح هو **(A)**: الفحص من الأعلى وأول match بيوقف؛ deny ip بيطابق كل IP من الشبكة، فالـ permit اللي بعده ما يتفحصش. (B) غلط لأن مفيش override بعد أول match. (C) غلط لأن ACE 10 بيطابق بالفعل. (D) غلط لأن TCP جزء من IP.',
          },
          {
            id: 'q5',
            prompt: 'On R1, LAN1 is on Gi0/0 and the server LAN is on Gi0/1. ACL 101 is applied with `ip access-group 101 out` on Gi0/1. When a packet from LAN1 travels to the server, when is ACL 101 evaluated?',
            options: [
              'After R1 chooses Gi0/1 as the outgoing interface and before the packet leaves it.',
              'As soon as the packet arrives on Gi0/0, before R1 makes any routing decision.',
              'Only if the packet is denied by the implicit deny on Gi0/0.',
              'Never, because out ACLs do not inspect packets that came from another interface.',
            ],
            correctIndex: 0,
            requireSubmit: true,
            explanation: 'الصح هو **(A)**: `out` يعني الفحص بعد قرار التوجيه وقبل خروج الحزمة من الـ interface. (B) وصف الـ `in` على Gi0/0. (C) غلط لأن الـ implicit deny مش شرط لتفعيل ACL تاني. (D) غلط لأن out ACL بيفحص الحزم الخارجة مهما كان مصدرها.',
          },
        ]},
      ],
    },
    {
      id: 'summary',
      title: 'Summary and CCNA Revision Checklist',
      short: 'ملخص وقائمة مراجعة',
      blocks: [
        { type: 'paragraph', text: 'الـ ACL قائمة ACEs مرتبة بيفحصوا الحزم على Layer 3. الفحص top-down، وأول match يحدد permit أو deny ويوقف، وإن مفيش match الـ implicit deny بيرفض. الـ ACL stateless packet filter، وبيشتغل بس لما يتطبّق على interface أو feature مناسب.' },
        { type: 'diagram', id: 'acl-summary', caption: 'خريطة مراجعة سريعة لأهم أفكار الـ ACL.' },
        { type: 'paragraph', text: '**1. Standard vs Extended ACL:**' },
        { type: 'table', headers: ['Aspect', 'Standard ACL', 'Extended ACL'], rows: summaryTypeRows },
        { type: 'paragraph', text: '**2. Numbered vs Named ACL:**' },
        { type: 'table', headers: ['Aspect', 'Numbered ACL', 'Named ACL'], rows: summaryNumberRows },
        { type: 'paragraph', text: '**3. Inbound vs Outbound ACL:**' },
        { type: 'table', headers: ['Aspect', 'Inbound (in)', 'Outbound (out)'], rows: summaryDirectionRows },
        { type: 'paragraph', text: '**4. Subnet mask vs Wildcard mask:**' },
        { type: 'table', headers: ['Aspect', 'Subnet mask', 'Wildcard mask'], rows: summaryMaskRows },
        { type: 'paragraph', text: '**5. Permit, Deny, and Implicit Deny:**' },
        { type: 'table', headers: ['Action', 'Meaning', 'Result'], rows: summaryActionRows },
        { type: 'steps', items: [
          { title: 'ACL fundamentals', text: 'اعرف إن الـ ACL packet filter على Layer 3، وإن الـ ACE هو سطر واحد، وإنه مش stateful firewall.' },
          { title: 'Processing', text: 'احفظ: top-down، أول match يوقف، وimplicit deny في الآخر.' },
          { title: 'Type and placement', text: 'Standard بالـ source غالباً وقرب الوجهة؛ Extended بالمصدر والوجهة والخدمة وقرب المصدر، ك guideline مش قانون.' },
          { title: 'Identity and editing', text: 'Numbered بالأرقام، Named بالاسم وsequence numbers؛ راجع الترتيب بعد كل تعديل.' },
          { title: 'Wildcards', text: '0 لازم يتطابق، 1 يتجاهل؛ /24 = 0.0.0.255، /25 = 0.0.0.127، /26 = 0.0.0.63، host = 0.0.0.0، any = 255.255.255.255.' },
          { title: 'Direction', text: 'in يعني دخول الـ interface قبل التوجيه، out يعني الخروج بعد التوجيه.' },
          { title: 'Configuration workflow', text: 'سياسة → مصدر/وجهة → بروتوكول/منفذ → نوع ACL → ترتيب ACEs → implicit deny → interface → اتجاه → ip access-group → تحقق.' },
          { title: 'Verification', text: 'show access-lists، show ip access-lists، show running-config، show ip interface، واختبار الحزم.' },
          { title: 'Troubleshooting', text: 'راجع الـ wildcard، والترتيب، والـ permits المفقودة، والـ interface، والاتجاه، والـ protocol/port، وتأثير الإدارة.' },
        ]},
        { type: 'callout', tone: 'tip', title: 'فكرة أخيرة قبل الامتحان', text: 'لو سُئلت عن ACL: اسأل «إيه الحقول اللي بيطابقها؟»، «إيه ترتيب السطور؟»، «إيه الاتجاه والـ interface؟»، و«هل الترافيك المطلوب له permit قبل الـ deny؟». أغلب أسئلة CCNA بتدور حولين دول.' },
      ],
    },
  ],
}
