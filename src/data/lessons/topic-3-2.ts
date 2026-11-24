import type { Lesson } from '../types'

const processRows: string[][] = [
  ['1', 'Receive Ethernet frame', 'الراوتر يستقبل frame على واجهة الدخول'],
  ['2', 'Check destination MAC', 'إذا كان MAC للراوتر، يقبل frame ويفك L2'],
  ['3', 'Process IP packet', 'يفحص IP header وdestination IP'],
  ['4', 'Routing table lookup', 'يبحث عن أفضل route مطابقة'],
  ['5', 'Select best route', 'LPM ثم AD ثم Metric حسب الحالة'],
  ['6', 'Determine next hop/exit interface', 'يحدد أين يرسل packet'],
  ['7', 'Resolve next-hop L2', 'ARP في IPv4 إذا لزم الأمر'],
  ['8', 'Re-encapsulate L2', 'يبني Ethernet header جديد للواجهة الخارجة'],
  ['9', 'Forward packet', 'يرسل packet إلى next hop'],
]

const lpmRows: string[][] = [
  ['192.168.0.0/16', 'يطابق', 'أقل تحديداً من /24 و/25'],
  ['192.168.1.0/24', 'يطابق', 'أفضل من /16 لكن أقل من /25'],
  ['192.168.1.128/25', 'يطابق', 'الأطول/الأكثر تحديداً — **الفائز**'],
  ['0.0.0.0/0', 'يطابق كل شيء', 'Default route — أقل تحديداً'],
]

const binaryRows: string[][] = [
  ['Destination IP', '192.168.1.130', '11000000.10101000.00000001.10000010'],
  ['/16', '192.168.0.0/16', 'أول 16 بت تطابق — عام'],
  ['/24', '192.168.1.0/24', 'أول 24 بت تطابق — أدق'],
  ['/25', '192.168.1.128/25', 'أول 25 بت تطابق — الأدق بين المطابقين'],
  ['/0', '0.0.0.0/0', '0 بت مطلوبة — يطابق أي شيء'],
]

const decisionRows: string[][] = [
  ['1. Longest Prefix Match', 'مقارنة أطوال prefix بين routes المطابقة للوجهة', 'الفائز: الأكثر تحديداً (أطول prefix)'],
  ['2. Administrative Distance', 'فقط إذا كان نفس destination prefix تماماً لكن من مصادر مختلفة', 'الفائز: الأقل AD'],
  ['3. Metric', 'فقط إذا كان نفس prefix ونفس routing protocol', 'الفائز: الأقل metric داخل ذلك البروتوكول'],
]

const adRows: string[][] = [
  ['Connected', '0'],
  ['Static', '1'],
  ['EIGRP Internal', '90'],
  ['OSPF', '110'],
  ['RIP', '120'],
]

const troubleRows: string[][] = [
  ['اعتقاد أن أقل AD يفوز دائماً', 'LPM يأتي أولاً. Prefix مختلف الأطول يفوز حتى لو AD أعلى.'],
  ['الخلط بين LPM وAD', 'LPM يقارن دقة المطابقة؛ AD يقارن ثقة المصدر لنفس prefix.'],
  ['الخلط بين AD وMetric', 'AD بين مصادر مختلفة؛ Metric داخل نفس البروتوكول.'],
  ['Next hop غير قابل للوصول', 'تحقق من route للـ next hop، ARP، وinterface status.'],
  ['لا يوجد matching route', 'تحقق من routing table؛ أضف route أو default route.'],
  ['لا يوجد default route', 'الوجهات غير المعروفة تُسقط إذا لم يوجد 0.0.0.0/0.'],
  ['ARP resolution failure', 'تحقق من L2 connectivity وARP cache وnext hop.'],
  ['Interface down / wrong mask', 'افحص `show ip interface brief` والأقنعة/العناوين.'],
]

const workflowRows = [
  { title: '1', text: 'حدد Destination IP من الـ packet.' },
  { title: '2', text: 'نفّذ `show ip route` أو `show ip route <destination>` لرؤية المطابقات.' },
  { title: '3', text: 'طبّق LPM: اختر أطول prefix مطابق.' },
  { title: '4', text: 'إذا نفس prefix من مصادر مختلفة، قارن AD.' },
  { title: '5', text: 'إذا نفس البروتوكول، قارن metric.' },
  { title: '6', text: 'تحقق من next hop/exit interface وARP/CEF حسب المنصة.' },
  { title: '7', text: 'استخدم `ping` و`traceroute` للتحقق من المسار الفعلي.' },
]

export const topic32Lesson: Lesson = {
  topicId: '3.2',
  title: 'Determine how a router makes a forwarding decision by default',
  description:
    'Topic 3.2 يشرح كيف يتخذ الراوتر قرار Forwarding: عملية تمرير الحزمة، Longest Prefix Match، Administrative Distance، Routing Protocol Metrics، واختيار أفضل Route. الدرس يبني على Routing Table من Topic 3.1. الأمثلة والمخرجات تعليمية وتمثيلية. Topic 3.3 لم يُفتح.',
  estimatedTime: '~125 دقيقة',
  steps: [
    {
      id: 'what',
      title: 'What It Is & Why It Exists',
      short: 'قرار التوجيه',
      blocks: [
        { type: 'paragraph', text: '**Routing Decision** هي العملية التي يقرر بها الراوتر ماذا يفعل بـ packet وارد: إلى أي next hop أو exit interface يرسله، بناءً على Destination IP ومعلومات Routing Table. الهدف هو إيصال الـ packet إلى شبكته الوجهة بأفضل مسار متاح حسب قواعد الراوتر.' },
        { type: 'diagram', id: 'routing-vs-forwarding', caption: 'Routing يبني المعرفة بالمسارات؛ Forwarding ينفذ إرسال packet فعلياً.' },
        { type: 'diagram', id: 'control-plane-vs-data-plane', caption: 'Control plane يبني routing؛ Data plane ينفذ forwarding.' },
        { type: 'list', items: [
          '**Routing**: عملية تعلم وبناء المسارات (static, connected, dynamic protocols) وتعبئة Routing Table.',
          '**Forwarding**: عملية تمرير packet فعلياً بناءً على قرار lookup.',
          'عندما يستقبل الراوتر packet، يفحص Destination IP ويبحث في Routing Table عن أفضل match.',
          'Routing Table توفر الخيارات؛ forwarding decision تختار المسار المستخدم الآن.',
          'Control Plane يهتم ببناء معلومات التوجيه؛ Data Plane يهتم بتمرير الحزم بسرعة.',
        ]},
        { type: 'table', headers: ['المفهوم', 'الدور', 'مثال'], rows: [
          ['Routing', 'بناء/تعلم المسارات', 'OSPF يتعلم شبكة بعيدة'],
          ['Routing Table', 'قاعدة بيانات المسارات', 'O 172.16.1.0/24 [110/20] via ...'],
          ['Forwarding Decision', 'اختيار المسار لـ packet محدد', 'إرسال packet إلى G0/1'],
          ['Data Plane', 'تنفيذ التمرير', 'إعادة تغليف L2 وإرسال frame'],
        ]},
      ],
    },
    {
      id: 'how',
      title: 'How It Works + Real-Life Analogy',
      short: 'كيف يعمل؟',
      blocks: [
        { type: 'paragraph', text: 'تخيل ساعي بريد في مركز توزيع. وصل طرد عليه عنوان نهائي. الساعي لا يغير العنوان النهائي، لكنه ينظر في دفتر التوجيه ليقرر: "أي فرع توزيع التالي يأخذ هذا الطرد؟". عند كل محطة، يوضع الطرد في غلاف/ملصق نقل جديد مناسب للمرحلة التالية، لكن عنوان المستلم النهائي يبقى نفسه. هذا يشبه IP forwarding مع L2 re-encapsulation.' },
        { type: 'diagram', id: 'packet-forwarding-lifecycle', caption: 'دورة حياة forwarding من استقبال frame إلى إعادة الإرسال.' },
        { type: 'steps', items: [
          { title: '1', text: 'Router receives an Ethernet Frame على واجهة الدخول.' },
          { title: '2', text: 'Router checks Destination MAC Address؛ إذا كان frame موجه للراوتر، يستمر.' },
          { title: '3', text: 'Router processes the IP Packet ويفك تغليف Layer 2.' },
          { title: '4', text: 'Router examines Destination IP Address في IP header.' },
          { title: '5', text: 'Router searches the Routing Table عن routes مطابقة.' },
          { title: '6', text: 'Router selects the best matching route (LPM ثم AD ثم Metric حسب الحالة).' },
          { title: '7', text: 'Router determines Next Hop or Exit Interface.' },
          { title: '8', text: 'Router performs Layer 2 encapsulation جديد للواجهة الخارجة؛ قد يستخدم ARP في IPv4 لمعرفة MAC الـ next hop.' },
          { title: '9', text: 'Router forwards the packet.' },
        ]},
        { type: 'callout', tone: 'info', title: 'IP vs MAC أثناء التوجيه', text: 'عادةً يظل **Destination IP** في IP packet كما هو من المصدر إلى الوجهة النهائية، بينما تتغير **Source/Destination MAC** عند كل hop لأن L2 frame جديد يُبنى لكل شبكة محلية. استثناءات خاصة مثل NAT يمكن أن تغيّر عناوين IP، لكن هذا ليس السلوك الافتراضي للـ forwarding البسيط.' },
      ],
    },
    {
      id: 'packet',
      title: 'Packet Forwarding Process',
      short: 'عملية Forwarding',
      blocks: [
        { type: 'paragraph', text: 'لنأخذ مساراً بسيطاً: `PC1 ---- R1 ---- R2 ---- R3 ---- Server`. عند كل راوتر، القرار يعتمد على Destination IP والـ Routing Table المحلية لذلك الراوتر. الـ router لا يحتاج معرفة كل hop في العالم داخل الـ packet؛ يكفي معرفة next hop الصحيح.' },
        { type: 'diagram', id: 'router-hop-by-hop-forwarding', caption: 'Hop-by-hop forwarding: كل راوتر يتخذ قراراً محلياً.' },
        { type: 'diagram', id: 'layer2-reencapsulation', caption: 'إعادة تغليف Layer 2 عند كل hop.' },
        { type: 'diagram', id: 'arp-next-hop-resolution', caption: 'ARP في IPv4 لحل MAC الخاص بالـ next hop.' },
        { type: 'table', headers: ['المرحلة', 'ما يحدث', 'ملاحظة'], rows: processRows },
        { type: 'table', headers: ['الحقل', 'يتغير عند كل hop؟', 'الشرح'], rows: [
          ['Source IP', 'عادة لا', 'يبقى عنوان المرسل الأصلي'],
          ['Destination IP', 'عادة لا', 'يبقى عنوان الوجهة النهائية'],
          ['Source MAC', 'نعم', 'MAC واجهة الراوتر الخارجة'],
          ['Destination MAC', 'نعم', 'MAC next hop أو الوجهة المتصلة مباشرة'],
          ['Next Hop', 'نعم', 'يتحدد من routing table لكل راوتر'],
          ['Exit Interface', 'نعم', 'واجهة الخروج من الراوتر الحالي'],
        ]},
        { type: 'list', items: [
          '**Directly connected destination**: الوجهة في شبكة متصلة مباشرة بالراوتر؛ يرسل مباشرة بعد ARP للوجهة إن لزم.',
          '**Remote destination**: الوجهة خلف راوتر آخر؛ يرسل إلى next hop.',
          '**Next-Hop Forwarding**: الراوتر يمرر packet للراوتر التالي الأقرب على المسار وفق routing table.',
          'في IPv4، إذا لم يكن MAC الخاص بالـ next hop في ARP cache، الراوتر يرسل ARP Request قبل بناء frame.',
        ]},
        { type: 'callout', tone: 'warning', title: 'CEF وPlatform', text: 'بعض أوامر التحقق مثل `show ip cef` تعتمد على Platform/IOS version ودعم CEF. مفهوم forwarding موجود، لكن تفاصيل التنفيذ الداخلي قد تختلف.' },
      ],
    },
    {
      id: 'config',
      title: 'Longest Prefix Match (LPM)',
      short: 'Longest Prefix Match',
      blocks: [
        { type: 'paragraph', text: '**Longest Prefix Match (LPM)** هي القاعدة الأولى والأهم عند اختيار route. عندما يطابق أكثر من route نفس Destination IP، الراوتر يختار route ذات **أطول prefix** أي الأكثر تحديداً. هذا يحدث **قبل** مقارنة AD أو Metric عند اختلاف أطوال prefix.' },
        { type: 'diagram', id: 'longest-prefix-match-concept', caption: 'الأطول prefix المطابق يفوز: /25 أفضل من /24 أفضل من /16.' },
        { type: 'diagram', id: 'binary-prefix-matching', caption: 'مقارنة binary تشرح لماذا /25 يطابق 192.168.1.130 بشكل أدق.' },
        { type: 'diagram', id: 'multiple-prefix-comparison', caption: 'مقارنة /0 إلى /25: الأكثر تحديداً يفوز.' },
        { type: 'paragraph', text: 'مثال مطلوب:' },
        { type: 'code', label: 'Destination and routing table - educational example', language: 'text', code: `Destination IP: 192.168.1.130

Routing Table:
192.168.0.0/16
192.168.1.0/24
192.168.1.128/25
0.0.0.0/0` },
        { type: 'table', headers: ['Route', 'Match?', 'السبب'], rows: lpmRows },
        { type: 'paragraph', text: '**Binary explanation (simplified):**' },
        { type: 'table', headers: ['Item', 'Value', 'Meaning'], rows: binaryRows },
        { type: 'list', items: [
          '192.168.1.130 يقع داخل 192.168.0.0/16، و192.168.1.0/24، و192.168.1.128/25، وأيضاً 0.0.0.0/0.',
          'لكن /25 هو الأطول (25 بت مطابقة للشبكة) لذلك هو الأكثر تحديداً ويتم اختياره.',
          'Default route 0.0.0.0/0 يطابق أي عنوان لكنه الأقل تحديداً، فيُستخدم فقط إذا لم يوجد match أطول.',
          'LPM يعتمد على أطول prefix مطابق للـ Destination IP، **ليس** على أقل AD أو أقل Metric عند مقارنة prefixes مختلفة الأطوال.',
        ]},
        { type: 'callout', tone: 'danger', title: 'قاعدة ذهبية', text: 'لا تقارن AD قبل LPM. إذا كان أحد المسارات /25 والآخر /24 لنفس الوجهة، /25 يفوز لأنه أكثر تحديداً حتى لو جاء من مصدر AD أعلى — طالما أنه route صالح ومركب في الجدول.' },
      ],
    },
    {
      id: 'verify',
      title: 'Administrative Distance & Routing Protocol Metrics',
      short: 'AD وMetrics',
      blocks: [
        { type: 'paragraph', text: 'بعد LPM، قد يبقى أكثر من route بنفس prefix length لنفس الوجهة. هنا يأتي دور AD ثم Metric. هذا يكمل ما تعلمته في Topic 3.1 لكن في سياق قرار forwarding.' },
        { type: 'diagram', id: 'ad-route-source-comparison', caption: 'نفس prefix من مصادر مختلفة: AD يحسم الاختيار.' },
        { type: 'diagram', id: 'routing-protocol-metrics-comparison', caption: 'نفس البروتوكول ونفس prefix: Metric تحسم الاختيار.' },
        { type: 'diagram', id: 'ad-metric-decision-process', caption: 'ترتيب القرار: LPM → AD → Metric.' },
        { type: 'table', headers: ['المرحلة', 'متى؟', 'النتيجة'], rows: decisionRows },
        { type: 'paragraph', text: '**Administrative Distance (AD)**' },
        { type: 'table', headers: ['Route Source', 'Common Cisco Default AD'], rows: adRows },
        { type: 'list', items: [
          'AD تقارن **مصادر routes مختلفة** لنفس destination prefix.',
          'الأقل AD هو الأكثر تفضيلاً.',
          'القيم أعلاه شائعة في Cisco افتراضياً، وقد تتغير بالإعداد.',
          'AD لا تقارن جودة المسار داخل نفس البروتوكول؛ هي ثقة في مصدر التعلم.',
        ]},
        { type: 'paragraph', text: '**Routing Protocol Metric**' },
        { type: 'list', items: [
          'Metric تُستخدم عند المقارنة بين routes من **نفس routing protocol** لنفس destination prefix.',
          'كل بروتوكول له طريقة حساب metric مختلفة: OSPF يستخدم cost، RIP يستخدم hop count.',
          'الأقل metric يفوز داخل نفس البروتوكول، لكن لا تفترض أن كل البروتوكولات تحسب metric بنفس الطريقة.',
          'لا تقارن metric OSPF مع metric RIP مباشرة لاتخاذ قرار بين بروتوكولين مختلفين؛ AD هو الفيصل عند اختلاف المصدر.',
        ]},
        { type: 'callout', tone: 'warning', title: 'ترتيب القرار', text: '1) Longest Prefix Match. 2) إذا نفس prefix: AD. 3) إذا نفس البروتوكول: Metric. الخلط بين هذه المراحل سبب شائع لأخطاء CCNA.' },
      ],
    },
    {
      id: 'mistakes',
      title: 'Best Route Selection',
      short: 'اختيار أفضل Route',
      blocks: [
        { type: 'paragraph', text: 'أمثلة متدرجة توضح كيف يختار الراوتر أفضل route.' },
        { type: 'diagram', id: 'best-route-selection-flowchart', caption: 'Flowchart لاختيار أفضل route.' },
        { type: 'paragraph', text: '**Example A — Different Prefix Lengths**' },
        { type: 'code', label: 'Example A - LPM', language: 'text', code: `Destination: 192.168.1.130

Routes in table:
192.168.0.0/16
192.168.1.0/24
192.168.1.128/25

Result: 192.168.1.128/25 wins (Longest Prefix Match).` },
        { type: 'paragraph', text: 'كلها تطابق الوجهة، لكن /25 أكثر تحديداً لأنه يطابق 25 بت. لذلك يتم اختياره بغض النظر عن AD/Metric مقارنة بين أطوال مختلفة.' },
        { type: 'paragraph', text: '**Example B — Same Prefix, Different AD**' },
        { type: 'code', label: 'Example B - AD decides', language: 'text', code: `Destination prefix: 10.10.10.0/24

Route learned via OSPF:  O 10.10.10.0/24 [110/20] via 192.168.1.2
Route configured static: S 10.10.10.0/24 [1/0]   via 192.168.1.5

Result: Static route wins (AD 1 < AD 110).` },
        { type: 'paragraph', text: 'نفس prefix تماماً، مصادر مختلفة. نقارن AD: Static 1 أفضل من OSPF 110، لذلك static يُركّب افتراضياً.' },
        { type: 'paragraph', text: '**Example C — Same Protocol, Different Metrics**' },
        { type: 'code', label: 'Example C - Metric decides', language: 'text', code: `Destination prefix: 172.16.1.0/24 (learned via OSPF)

O 172.16.1.0/24 [110/20] via 192.168.1.2
O 172.16.1.0/24 [110/50] via 192.168.1.6

Result: First OSPF route wins (lower cost 20 < 50).` },
        { type: 'paragraph', text: 'نفس prefix ونفس البروتوكول OSPF ونفس AD. إذن نقارن metric/cost داخل OSPF: 20 أفضل من 50.' },
        { type: 'paragraph', text: '**Example D — Default Route**' },
        { type: 'diagram', id: 'default-route-gateway-last-resort', caption: 'Default route 0.0.0.0/0 تستخدم عند عدم وجود match أكثر تحديداً.' },
        { type: 'code', label: 'Example D - Default route', language: 'text', code: `Destination: 8.8.8.8

Routing table has no specific match, but has:
S* 0.0.0.0/0 [1/0] via 192.168.1.254

Gateway of last resort is 192.168.1.254 to network 0.0.0.0

Result: Default route is used.` },
        { type: 'callout', tone: 'info', title: 'Gateway of Last Resort', text: 'Default route هي شبكة الأمان. لا تُستخدم إذا وجد route أكثر تحديداً مطابق للوجهة. إذا لم يوجد أي match ولا default route، الراوتر يسقط الـ packet.' },
      ],
    },
    {
      id: 'lab',
      title: 'Common Mistakes & Troubleshooting',
      short: 'أخطاء واستكشاف',
      blocks: [
        { type: 'diagram', id: 'complete-routing-decision-scenario', caption: 'سيناريو كامل: LPM يختار /25 ثم forwarding عبر next hop.' },
        { type: 'table', headers: ['المشكلة', 'التصحيح/التشخيص'], rows: troubleRows },
        { type: 'paragraph', text: '**أوامر التحقق**' },
        { type: 'code', label: 'Verification commands - educational', language: 'text', code: `show ip route
show ip route 192.168.1.130
show ip cef 192.168.1.130
show ip interface brief
show arp
ping 192.168.1.130
traceroute 192.168.1.130` },
        { type: 'list', items: [
          '`show ip route` يعرض الجدول الكامل؛ `show ip route <destination>` يساعد في رؤية المسار المختار لوجهة محددة.',
          '`show ip cef` يعرض معلومات forwarding في CEF، لكن توفره/خرجه يعتمد على platform وIOS version.',
          '`show arp` يساعد عند فشل حل MAC الخاص بالـ next hop في IPv4.',
          '`ping` و`traceroute` يختبران المسار الفعلي ويكشفان أين يتوقف.',
        ]},
        { type: 'paragraph', text: '**Troubleshooting workflow**' },
        { type: 'steps', items: workflowRows },
        { type: 'callout', tone: 'warning', title: 'سيناريو واقعي', text: 'لو packet متجه إلى 192.168.1.130 ويوجد /24 و/25، فاختيار /16 أو /24 خطأ. السبب ليس AD ولا Metric، بل LPM. تحقق دائماً من prefix length أولاً.' },
      ],
    },
    {
      id: 'exam',
      title: 'Hands-on Packet Tracer Labs',
      short: 'لابات عملية',
      blocks: [
        { type: 'paragraph', text: 'اللابات التالية **Interactive Simulation / Conceptual Packet Tracer-style** وليست تنفيذاً فعلياً على Packet Tracer حقيقي أو أجهزة حقيقية.' },
        { type: 'paragraph', text: '**Lab 1 — Packet Forwarding**' },
        { type: 'steps', items: [
          { title: 'Topology', text: 'PC1 ---- R1 ---- R2 ---- PC2.' },
          { title: 'Task 1', text: 'هيئ عناوين IP على PC1 وR1 وR2 وPC2.' },
          { title: 'Task 2', text: 'هيئ routing مناسب (static أو connected + static) ليصل الطرفان.' },
          { title: 'Task 3', text: 'نفّذ ping من PC1 إلى PC2 وتحقق من النجاح.' },
          { title: 'Task 4', text: 'تتبع packet hop-by-hop ولاحظ أن Destination IP يبقى ثابتاً بينما MAC يتغير عند كل hop.' },
          { title: 'Expected result', text: 'Ping succeeds؛ L2 headers تتغير كل hop، IP destination يبقى PC2.' },
        ]},
        { type: 'paragraph', text: '**Lab 2 — Longest Prefix Match**' },
        { type: 'steps', items: [
          { title: 'Scenario', text: 'Routing table تحتوي: 192.168.0.0/16, 192.168.1.0/24, 192.168.1.128/25, 0.0.0.0/0. الوجهة 192.168.1.130.' },
          { title: 'Task 1', text: 'حدد كل routes المطابقة.' },
          { title: 'Task 2', text: 'قارن prefix lengths.' },
          { title: 'Task 3', text: 'اختر best match.' },
          { title: 'Task 4', text: 'فسّر لماذا /25 يفوز ولماذا 0.0.0.0/0 لا يُستخدم هنا.' },
          { title: 'Expected result', text: 'أفضل route هي 192.168.1.128/25 لأنها الأطول مطابقة.' },
        ]},
        { type: 'paragraph', text: '**Lab 3 — Best Route Selection**' },
        { type: 'steps', items: [
          { title: 'Scenario', text: 'أكثر من route لنفس الوجهة في حالات مختلفة: prefixes مختلفة، نفس prefix مع AD مختلفة، نفس البروتوكول مع metrics مختلفة.' },
          { title: 'Task 1', text: 'قارن Prefix أولاً.' },
          { title: 'Task 2', text: 'إذا تساوى prefix، قارن AD.' },
          { title: 'Task 3', text: 'إذا نفس البروتوكول، قارن Metric.' },
          { title: 'Task 4', text: 'حدد route المختار وتحقق مفاهيمياً بـ `show ip route` / `show ip route <destination>`.' },
          { title: 'Expected result', text: 'الطالب يطبق ترتيب القرار الصحيح: LPM → AD → Metric.' },
        ]},
      ],
    },
    {
      id: 'summary',
      title: 'Summary & CCNA Exam Quiz',
      short: 'ملخص واختبار',
      blocks: [
        { type: 'paragraph', text: '**ملخص سريع**' },
        { type: 'list', items: [
          '**Routing vs Forwarding**: Routing يبني المسارات؛ Forwarding يمرر packets.',
          '**Packet forwarding**: receive frame → check DMAC → examine destination IP → lookup → best route → next hop/exit → L2 re-encapsulation → forward.',
          '**Longest Prefix Match**: الأطول prefix المطابق يفوز أولاً.',
          '**Administrative Distance**: عند نفس prefix ومصادر مختلفة، الأقل AD يفوز.',
          '**Metric**: عند نفس prefix ونفس البروتوكول، الأقل metric يفوز.',
          '**Default route 0.0.0.0/0**: Gateway of Last Resort عند عدم وجود match أكثر تحديداً.',
          '**Verification**: `show ip route`, `show ip route <dest>`, `show ip cef` (platform dependent), `show ip interface brief`, `show arp`, `ping`, `traceroute`.',
        ]},
        { type: 'callout', tone: 'tip', title: 'ترتيب CCNA الذهبي', text: 'Longest Prefix Match أولاً. ثم AD إذا نفس prefix ومصدر مختلف. ثم Metric إذا نفس البروتوكول. لا تعكس الترتيب.' },
        { type: 'paragraph', text: '**اختبار CCNA**' },
        { type: 'paragraph', text: '5 أسئلة، 4 خيارات لكل سؤال، ومزيج single-choice وmultiple-select. لا تظهر الإجابة قبل الإرسال.' },
        { type: 'quiz', questions: [
          {
            id: 'q1',
            prompt: 'A router receives a packet destined for 192.168.1.130. The routing table contains 192.168.0.0/16, 192.168.1.0/24, 192.168.1.128/25, and 0.0.0.0/0. Which route will be selected?',
            options: [
              '192.168.1.128/25',
              '192.168.1.0/24',
              '192.168.0.0/16',
              '0.0.0.0/0',
            ],
            correctIndex: 0,
            requireSubmit: true,
            explanation: 'الصح هو **(A)**. كل المسارات تطابق الوجهة، لكن 192.168.1.128/25 هو الأطول prefix مطابق (الأكثر تحديداً)، لذلك يفوز حسب Longest Prefix Match.',
          },
          {
            id: 'q2',
            prompt: 'A router has two routes to 10.10.10.0/24: one learned via OSPF [110/20] and one static route [1/0]. Which route is installed by default?',
            options: [
              'The static route because it has the lower administrative distance',
              'The OSPF route because it has the lower metric',
              'Both routes because they have the same prefix length',
              'The OSPF route because dynamic routes are always preferred',
            ],
            correctIndex: 0,
            requireSubmit: true,
            explanation: 'الصح هو **(A)**. نفس prefix length ونفس الوجهة، لكن المصدر مختلف. لذلك نقارن AD: static AD 1 أقل من OSPF AD 110، فتُركّب static route افتراضياً.',
          },
          {
            id: 'q3',
            prompt: 'Which statement best describes what usually changes when a router forwards an IPv4 packet from one interface to another?',
            options: [
              'The Layer 2 source and destination MAC addresses change, while the destination IP usually remains the same',
              'The destination IP address changes at every hop, while MAC addresses remain the same',
              'Both destination IP and destination MAC always remain unchanged',
              'The router replaces the IP packet with a new packet and discards the destination IP',
            ],
            correctIndex: 0,
            requireSubmit: true,
            explanation: 'الصح هو **(A)**. في forwarding العادي، الراوتر يعيد تغليف L2 لكل hop فتتغير MAC addresses، بينما Destination IP يبقى عادة كما هو. استثناءات مثل NAT ليست السلوك الافتراضي.',
          },
          {
            id: 'q4',
            kind: 'multiple',
            prompt: 'Which statements about route selection are correct? (Choose more than one.)',
            options: [
              'Longest Prefix Match is evaluated before administrative distance when prefix lengths differ.',
              'Administrative distance is used when the same prefix is learned from different sources.',
              'Metric is compared between routes from the same routing protocol for the same destination prefix.',
              'A lower metric always beats a longer prefix match, even across different routing protocols.',
            ],
            correctIndices: [0, 1, 2],
            requireSubmit: true,
            explanation: 'الصح هو **(A) و(B) و(C)**. LPM أولاً، ثم AD لنفس prefix من مصادر مختلفة، ثم Metric داخل نفس البروتوكول. الخيار (D) خطأ لأن أطول prefix match يفوز قبل AD/Metric عند اختلاف أطوال prefix.',
          },
          {
            id: 'q5',
            kind: 'multiple',
            prompt: 'Which issues can prevent a router from successfully forwarding packets to a remote destination? (Choose more than one.)',
            options: [
              'No matching route and no default route in the routing table',
              'ARP failure for the next hop on an IPv4 network',
              'The exit interface is down',
              'A longer prefix match exists in the routing table',
            ],
            correctIndices: [0, 1, 2],
            requireSubmit: true,
            explanation: 'الصح هو **(A) و(B) و(C)**. غياب route مطابق/default route، فشل ARP للـ next hop، أو واجهة خروج down كلها تمنع forwarding الناجح. وجود أطول prefix match ليس مشكلة؛ بل هو سلوك صحيح يساعد على اختيار أفضل route.',
          },
        ]},
      ],
    },
  ],
}