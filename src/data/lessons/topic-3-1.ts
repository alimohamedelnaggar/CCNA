import type { Lesson } from '../types'

const routeTypesRows: string[][] = [
  ['Connected (C)', 'تُضاف تلقائياً عندما يكون interface لديه IP/mask وهو UP/UP', 'الشبكات المتصلة مباشرة بالراوتر'],
  ['Local (L)', 'تُضاف تلقائياً لعنوان IP الخاص بالواجهة نفسها', 'تمثيل IP الراوتر على الواجهة؛ /32 في IPv4'],
  ['Static (S)', 'يضيفها المسؤول يدوياً بأمر `ip route`', 'مسارات ثابتة بسيطة أو default route'],
  ['Dynamic (O, D, R...)', 'يتعلمها الراوتر من Routing Protocol', 'شبكات تتغير أو كبيرة وتحتاج تحديث تلقائي'],
]

const entryRows: string[][] = [
  ['Route code', 'C, L, S, O, D, R ...', 'مصدر route وكيف تعلمه الراوتر'],
  ['Prefix / Network mask', '192.168.1.0/24', 'شبكة الوجهة التي يطابقها route'],
  ['[AD/Metric]', '[110/20]', 'الثقة في المصدر / تكلفة المسار داخل البروتوكول'],
  ['Next hop', 'via 192.168.1.2', 'الراوتر التالي الذي يجب إرسال الـ packet إليه'],
  ['Exit interface', 'GigabitEthernet0/1', 'منفذ الخروج المحلي من الراوتر'],
  ['Directly connected', 'is directly connected', 'الشبكة مرتبطة مباشرة بواجهة على الراوتر'],
]

const adRows: string[][] = [
  ['Connected', '0'],
  ['Static', '1'],
  ['EIGRP (internal)', '90'],
  ['OSPF', '110'],
  ['RIP', '120'],
]

const adMetricRows: string[][] = [
  ['السؤال', 'من أثق بمصدر الـ route أكثر؟', 'ما أفضل مسار داخل نفس البروتوكول؟'],
  ['متى يُستخدم؟', 'عند وجود نفس destination prefix من مصادر مختلفة', 'عند وجود عدة routes لنفس prefix داخل نفس البروتوكول'],
  ['القيمة الأقل', 'أفضل (أكثر ثقة)', 'أفضل (أقل تكلفة)'],
  ['أمثلة', 'Connected 0 أفضل من OSPF 110', 'OSPF cost 20 أفضل من cost 50'],
  ['خطأ شائع', 'اعتباره سرعة الرابط', 'مقارنته بين بروتوكولات مختلفة مباشرة'],
]

const commandRows: string[][] = [
  ['`show ip route`', 'يعرض جدول التوجيه الكامل', 'النقطة الأولى لفهم المسارات المتاحة'],
  ['`show ip route connected`', 'يعرض connected routes فقط', 'التحقق من الشبكات المتصلة مباشرة'],
  ['`show ip route static`', 'يعرض static routes فقط', 'التحقق من المسارات اليدوية'],
  ['`show ip interface brief`', 'ملخص حالة interfaces وعناوين IP', 'التحقق من up/down وIP'],
  ['`show running-config`', 'التكوين الجاري', 'مراجعة ip route وinterface config'],
  ['`show interfaces`', 'تفاصيل حالة/أخطاء الواجهة', 'تشخيص interface down/errors'],
  ['`ping`', 'اختبار reachability', 'هل الوجهة قابلة للوصول؟'],
  ['`traceroute`', 'مسار الـ packet عبر hops', 'أين يتوقف أو ينعطف المسار؟'],
]

const troubleRows: string[][] = [
  ['Interface Down', 'افحص `show ip interface brief` و`show interfaces`؛ تأكد من `no shutdown` والكابل/VLAN.'],
  ['Incorrect Subnet Mask', 'راجع IP/mask على الواجهة؛ mask خاطئ يخلق prefix خاطئ في routing table.'],
  ['Missing Route', 'تحقق من وجود C/L/S/Dynamic route مناسبة؛ أضف static أو أصلح routing protocol.'],
  ['Wrong Next Hop', 'راجع `ip route` و`show ip route`؛ تأكد أن next hop reachable وعلى الشبكة الصحيحة.'],
  ['Static route to unreachable next hop', 'تحقق من إمكانية الوصول للـ next hop؛ route قد لا تُركّب كما تتوقع.'],
  ['Misunderstanding AD vs Metric', 'AD يقارن مصادر مختلفة لنفس prefix؛ Metric يقارن مسارات داخل نفس البروتوكول.'],
  ['No Default Route', 'إذا لم يوجد match محدد ولا default route، الراوتر يسقط packet. أضف `ip route 0.0.0.0 0.0.0.0 ...` عند الحاجة.'],
  ['Confusing Connected vs Local', 'C هي الشبكة المتصلة /prefix؛ L هو IP الواجهة نفسها /32 في IPv4.'],
]

const workflowRows = [
  { title: '1', text: 'ابدأ بـ `show ip route` واعرف هل destination prefix موجود أم لا.' },
  { title: '2', text: 'افحص route code: C/L/S/O/D/R لمعرفة مصدر المسار.' },
  { title: '3', text: 'تحقق من prefix/mask وnext hop وexit interface.' },
  { title: '4', text: 'إذا route مفقود، افحص `show ip interface brief` وحالة الواجهات.' },
  { title: '5', text: 'راجع `show running-config` للـ interface IP وstatic routes.' },
  { title: '6', text: 'تحقق من AD/Metric عند وجود أكثر من route لنفس الوجهة.' },
  { title: '7', text: 'اختبر بـ `ping` و`traceroute` لتحديد أين يفشل المسار.' },
  { title: '8', text: 'تحقق من Gateway of Last Resort إذا كانت الوجهة خارج الشبكات المعروفة.' },
]

export const topic31Lesson: Lesson = {
  topicId: '3.1',
  title: 'Interpret the components of routing table',
  description:
    'Topic 3.1 يشرح Routing Table في Cisco IOS: بنية الجدول، أنواع routes (Connected/Local/Static/Dynamic)، رموز المسارات، Prefix/Mask، Next Hop، Exit Interface، Administrative Distance، Metric، وGateway of Last Resort. الأمثلة والمخرجات تعليمية وتمثيلية وليست من أجهزة حقيقية. Topic 3.2 لم يُفتح.',
  estimatedTime: '~120 دقيقة',
  steps: [
    {
      id: 'what',
      title: 'What It Is & Why It Exists',
      short: 'ما هو Routing Table؟',
      blocks: [
        { type: 'paragraph', text: '**Routing Table** هي قاعدة بيانات داخل الراوتر تحتوي على المسارات (routes) التي يعرفها للوصول إلى الشبكات. عندما يصل Packet إلى الراوتر، يبحث الراوتر في Routing Table ليقرر أين يرسله. بدون Routing Table، الراوتر لا يعرف الوجهة التالية لحركة IP خارج شبكاته المتصلة مباشرة.' },
        { type: 'diagram', id: 'routing-table-concept', caption: 'الراوتر يستخدم Routing Table لاتخاذ قرار forwarding.' },
        { type: 'list', items: [
          'Routing Table تخزن معلومات Layer 3: شبكات الوجهة وكيفية الوصول إليها.',
          'MAC Address Table في السويتش تخزن معلومات Layer 2: MAC address ↔ port داخل نفس LAN.',
          'الراوتر يوجّه بين شبكات مختلفة؛ السويتش يبدّل frames داخل الشبكة المحلية.',
          'لكل route قد يحتفظ الراوتر بـ: destination prefix/mask، route source/code، next hop أو exit interface، AD/metric (حسب النوع)، وحالة المسار.',
        ]},
        { type: 'table', headers: ['مقارنة', 'Routing Table (Router)', 'MAC Address Table (Switch)'], rows: [
          ['الطبقة', 'Layer 3', 'Layer 2'],
          ['المفتاح', 'IP network/prefix', 'MAC address'],
          ['الوظيفة', 'اختيار المسار للشبكة الوجهة', 'تحديد منفذ الإرسال داخل LAN'],
          ['مثال', '10.10.10.0/24 via 192.168.1.2', 'AA:BB:CC:DD:EE:FF -> Fa0/1'],
        ]},
        { type: 'callout', tone: 'info', title: 'الفكرة الأساسية', text: 'Routing Table ليست قائمة أجهزة مثل MAC table؛ هي خريطة شبكات ومسارات. كل إدخال يجيب: "للوصول إلى هذه الشبكة، أرسل عبر أين؟"' },
      ],
    },
    {
      id: 'how',
      title: 'How It Works + Real-Life Analogy',
      short: 'كيف يعمل؟',
      blocks: [
        { type: 'paragraph', text: 'تخيل الراوتر كمكتب توجيه في مركز شحن. كل طرد (packet) عليه عنوان وجهة (destination IP). مكتب التوجيه لا يحفظ عنوان كل منزل في العالم، لكنه يحفظ قواعد: "هذه المنطقة تذهب للطريق A، وهذه للطريق B، وأي شيء غير معروف ارسله للمركز الرئيسي". Routing Table هي دفتر هذه القواعد.' },
        { type: 'diagram', id: 'routing-table-entry-anatomy', caption: 'تشريح إدخال routing table: code، prefix، AD/metric، next hop، exit interface.' },
        { type: 'list', items: [
          '**Destination Network**: الشبكة التي يريد الـ packet الوصول إليها.',
          '**Prefix / Subnet Mask**: يحدد نطاق الشبكة الوجهة، مثل /24.',
          '**Next Hop**: عنوان الراوتر التالي الذي يستلم الـ packet.',
          '**Exit Interface**: المنفذ المحلي الذي يخرج منه الـ packet.',
          '**Route Source**: من أين تعلم الراوتر هذا route (Connected, Static, OSPF...).',
          '**Administrative Distance (AD)**: مدى الثقة في مصدر الـ route.',
          '**Metric**: تكلفة/جودة المسار داخل نفس بروتوكول التوجيه.',
        ]},
        { type: 'callout', tone: 'tip', title: 'قرار التوجيه', text: 'الراوتر يطابق destination IP مع prefix في الجدول. إذا وجد أكثر من match، يختار الأكثر تحديداً (longest prefix match — تفصيله في Topic 3.2). إذا لم يجد، يستخدم default route إن وجد، وإلا يسقط الـ packet.' },
      ],
    },
    {
      id: 'packet',
      title: 'Routing Table Structure',
      short: 'بنية Routing Table',
      blocks: [
        { type: 'paragraph', text: 'في Cisco IOS، الأمر الأساسي لعرض جدول التوجيه هو `show ip route`. المخرجات التالية **مثال تعليمي تمثيلي** وليست ناتجة من جهاز حقيقي؛ القيم تختلف حسب التكوين والبروتوكولات.' },
        { type: 'code', label: 'show ip route - educational example', language: 'text', code: `Router# show ip route

Gateway of last resort is not set

C    192.168.1.0/24 is directly connected, GigabitEthernet0/0
L    192.168.1.1/32 is directly connected, GigabitEthernet0/0
S    10.10.10.0/24 [1/0] via 192.168.1.2
O    172.16.1.0/24 [110/20] via 192.168.1.3` },
        { type: 'diagram', id: 'complete-routing-table-example', caption: 'مثال كامل لجدول توجيه مع C/L/S/O وGateway of Last Resort.' },
        { type: 'table', headers: ['الحقل', 'المثال', 'الشرح'], rows: entryRows },
        { type: 'list', items: [
          '**C**: Connected — شبكة متصلة مباشرة بواجهة الراوتر.',
          '**L**: Local — عنوان IP الخاص بالواجهة نفسها، عادة /32 في IPv4.',
          '**S**: Static — Route أضافه المسؤول يدوياً.',
          '**O**: OSPF — Route تعلمه الراوتر عبر OSPF.',
          '**[AD/Metric]**: مثل `[1/0]` للـ static أو `[110/20]` للـ OSPF؛ AD هو 1 أو 110، Metric هو 0 أو 20.',
          '**via 192.168.1.2**: next hop IP.',
          '**directly connected, GigabitEthernet0/0**: الشبكة على واجهة محلية مباشرة.',
          '**Gateway of last resort**: المسار الافتراضي عند عدم وجود match محدد؛ في هذا المثال "is not set".',
        ]},
        { type: 'callout', tone: 'warning', title: 'مخرجات تعليمية', text: 'الأرقام والعناوين والواجهات في المثال تمثيلية. في الشبكة الحقيقية تعتمد على إعدادات الجهاز والبروتوكولات المستخدمة.' },
      ],
    },
    {
      id: 'config',
      title: 'Route Types & Cisco Configuration',
      short: 'أنواع Routes والإعداد',
      blocks: [
        { type: 'paragraph', text: 'أهم أربعة أنواع يجب فهمها في بداية CCNA: Connected وLocal وStatic وDynamic. كل نوع يظهر في Routing Table بطريقة مختلفة وله سبب مختلف.' },
        { type: 'table', headers: ['النوع', 'متى يظهر؟', 'الاستخدام'], rows: routeTypesRows },
        { type: 'diagram', id: 'connected-route', caption: 'Connected route تظهر عندما الواجهة لديها IP وتكون UP/UP.' },
        { type: 'diagram', id: 'local-route', caption: 'Local route تمثل IP الواجهة نفسها /32 في IPv4.' },
        { type: 'paragraph', text: '**1. Connected Routes**' },
        { type: 'list', items: [
          'يضيفها الراوتر تلقائياً عندما تُهيئ IP address وsubnet mask على interface وتكون الواجهة UP/UP.',
          'أمر `no shutdown` يفعّل الواجهة إذا كانت administratively down.',
          'تظهر كـ `C` وتتضمن الشبكة المتصلة والمنفذ.',
          'إذا أصبحت الواجهة down، تختفي connected route (والـ local route المرتبطة بها) من الجدول.',
        ]},
        { type: 'code', label: 'Connected route - educational example', language: 'text', code: `Router(config)# interface GigabitEthernet0/0
Router(config-if)# ip address 192.168.1.1 255.255.255.0
Router(config-if)# no shutdown
Router(config-if)# end
Router# show ip route connected
C    192.168.1.0/24 is directly connected, GigabitEthernet0/0
L    192.168.1.1/32 is directly connected, GigabitEthernet0/0` },
        { type: 'paragraph', text: '**2. Local Routes**' },
        { type: 'list', items: [
          'تمثل عنوان IP المهيأ على واجهة الراوتر نفسه، وليس شبكة بعيدة.',
          'في IPv4 تكون `/32` لأنها تشير إلى host address واحد تحديداً.',
          'تظهر كـ `L` بجانب `C` للشبكة نفسها.',
          'الفرق: Connected = الشبكة/البادئة المتصلة؛ Local = عنوان الواجهة نفسه على الراوتر.',
        ]},
        { type: 'diagram', id: 'static-route', caption: 'Static route يضيفها المسؤول يدوياً باستخدام ip route.' },
        { type: 'paragraph', text: '**3. Static Routes**' },
        { type: 'list', items: [
          'يضيفها Administrator يدوياً. الراوتر لا يكتشفها تلقائياً.',
          'الصيغة الشائعة: `ip route <network> <mask> <next-hop-ip>` أو استخدام exit interface حسب السيناريو.',
          'تظهر كـ `S` ولها AD افتراضي عادة 1.',
          'مفيدة للشبكات الصغيرة أو المسارات المحددة أو default route، لكنها لا تتكيف تلقائياً مع تغيّر topology.',
        ]},
        { type: 'code', label: 'Static route - educational example', language: 'text', code: `Router(config)# ip route 10.10.10.0 255.255.255.0 192.168.1.2
Router(config)# ip route 0.0.0.0 0.0.0.0 192.168.1.254
Router# show ip route static
S    10.10.10.0/24 [1/0] via 192.168.1.2
S*   0.0.0.0/0 [1/0] via 192.168.1.254` },
        { type: 'diagram', id: 'dynamic-route', caption: 'Dynamic routes تتعلمها routing protocols تلقائياً.' },
        { type: 'paragraph', text: '**4. Dynamic Routes**' },
        { type: 'list', items: [
          'يتعلمها الراوتر عبر Routing Protocols مثل RIP وOSPF وEIGRP.',
          'الراوترات تتبادل معلومات الشبكات وتحدث الجداول تلقائياً عند تغير topology.',
          'تظهر بأكواد مثل `O` (OSPF), `R` (RIP), `D` (EIGRP).',
          'Dynamic أفضل للشبكات الكبيرة/المتغيرة؛ Static أبسط وأكثر تحكماً لكن يدوي.',
        ]},
        { type: 'callout', tone: 'info', title: 'مقدمة OSPF', text: 'ستدرس OSPF بالتفصيل لاحقاً في Topic 3.4. هنا يكفي فهم أن OSPF route تظهر كـ `O` ولها AD/Metric خاص بها، مثل `[110/20]` في المثال التعليمي.' },
      ],
    },
    {
      id: 'verify',
      title: 'Administrative Distance & Metric',
      short: 'AD وMetric',
      blocks: [
        { type: 'paragraph', text: 'هذه نقطة CCNA مهمة جداً. **Administrative Distance (AD)** و**Metric** رقمان يظهران غالباً كـ `[AD/Metric]`، لكنهما يجيبان عن سؤالين مختلفين تماماً.' },
        { type: 'diagram', id: 'administrative-distance-comparison', caption: 'مقارنة AD الافتراضية الشائعة: الأقل AD يعني مصدر أكثر ثقة.' },
        { type: 'paragraph', text: '**Administrative Distance (AD)**' },
        { type: 'list', items: [
          'تقيس **ثقة الراوتر في مصدر الـ route**، وليس جودة المسار.',
          'عند وجود نفس destination prefix من مصادر مختلفة، الراوتر يختار route ذات AD الأقل.',
          'القيم الافتراضية الشائعة في Cisco: Connected = 0, Static = 1, EIGRP internal = 90, OSPF = 110, RIP = 120.',
          'هذه قيم افتراضية شائعة وقد تتغير بالإعداد؛ لا تعتبرها ثابتة لا تتغير أبداً.',
        ]},
        { type: 'table', headers: ['Route Source', 'Default AD (common Cisco)'], rows: adRows },
        { type: 'diagram', id: 'metric-comparison', caption: 'Metric تقارن المسارات داخل نفس البروتوكول: الأقل metric أفضل.' },
        { type: 'paragraph', text: '**Metric**' },
        { type: 'list', items: [
          'تستخدمها Routing Protocols للمقارنة بين routes **داخل نفس البروتوكول** إلى نفس الوجهة.',
          'الأقل metric أفضل داخل نفس البروتوكول.',
          'طريقة الحساب تختلف حسب البروتوكول: OSPF يستخدم cost (يرتبط غالباً بـ bandwidth/reference bandwidth)، RIP يستخدم hop count بشكل مبسط.',
          'لا تقارن metric OSPF مع metric RIP مباشرة؛ إذا كانت المصادر مختلفة، AD هو عامل المقارنة الأول.',
        ]},
        { type: 'diagram', id: 'ad-vs-metric', caption: 'AD = ثقة المصدر؛ Metric = تكلفة المسار داخل نفس البروتوكول.' },
        { type: 'table', headers: ['جانب', 'Administrative Distance', 'Metric'], rows: adMetricRows },
        { type: 'callout', tone: 'danger', title: 'لا تخلط AD مع Metric', text: '`[110/20]` في route OSPF تعني AD=110 وMetric=20. AD يقارن بين مصادر مختلفة (مثلاً OSPF vs RIP). Metric يقارن بين مسارات OSPF المختلفة لنفس الوجهة.' },
      ],
    },
    {
      id: 'mistakes',
      title: 'Common Mistakes & Troubleshooting',
      short: 'أخطاء واستكشاف',
      blocks: [
        { type: 'paragraph', text: 'مشاكل Routing Table غالباً تكون بسبب interface down، إعداد IP/mask خاطئ، route مفقود، next hop خاطئ، أو سوء فهم AD vs Metric. ابدأ دائماً بـ `show ip route` ثم ضيق نطاق المشكلة.' },
        { type: 'diagram', id: 'gateway-of-last-resort', caption: 'Gateway of Last Resort يستخدم عند عدم وجود route محدد؛ بدونه قد تُسقط packets.' },
        { type: 'table', headers: ['المشكلة', 'كيف تشخصها/تعالجها'], rows: troubleRows },
        { type: 'paragraph', text: '**أوامر مفيدة**' },
        { type: 'table', headers: ['Command', 'ماذا يظهر', 'متى تستخدمه'], rows: commandRows },
        { type: 'code', label: 'Troubleshooting commands - educational examples', language: 'text', code: `Router# show ip route
Router# show ip route connected
Router# show ip route static
Router# show ip interface brief
Router# show running-config
Router# show interfaces GigabitEthernet0/0
Router# ping 10.10.10.1
Router# traceroute 10.10.10.1` },
        { type: 'paragraph', text: '**Troubleshooting workflow**' },
        { type: 'steps', items: workflowRows },
        { type: 'callout', tone: 'warning', title: 'Gateway of Last Resort', text: 'إذا كان `Gateway of last resort is not set` ولا يوجد route مطابق، الراوتر يسقط packet لوجهة غير معروفة. هذا طبيعي في بعض التصاميم، لكنه سبب شائع لفشل الوصول للإنترنت/الشبكات الخارجية.' },
      ],
    },
    {
      id: 'lab',
      title: 'Hands-on Packet Tracer Labs',
      short: 'لابات عملية',
      blocks: [
        { type: 'paragraph', text: 'اللابات التالية **Conceptual / Packet Tracer-style** وليست تنفيذاً فعلياً على أجهزة حقيقية. الهدف فهم كيف تتغير Routing Table مع الإعداد.' },
        { type: 'paragraph', text: '**Lab 1 — Connected & Local Routes**' },
        { type: 'steps', items: [
          { title: 'Topology', text: 'PC1 -------- R1 (G0/0). اتصال مباشر بسيط.' },
          { title: 'Task 1', text: 'هيئ IP على R1 G0/0: `192.168.1.1 255.255.255.0` ثم `no shutdown`.' },
          { title: 'Task 2', text: 'هيئ PC1 بعنوان `192.168.1.10/24` وgateway `192.168.1.1`.' },
          { title: 'Task 3', text: 'نفّذ `show ip route` ولاحظ ظهور `C 192.168.1.0/24` و`L 192.168.1.1/32`.' },
          { title: 'Task 4', text: 'غيّر subnet mask على الواجهة (مثلاً إلى /25 في بيئة lab) ولاحظ كيف يتغير prefix في جدول التوجيه.' },
          { title: 'Expected result', text: 'تظهر Connected route للشبكة وLocal route لعنوان الواجهة. تغيير mask يغير الـ prefix.' },
        ]},
        { type: 'paragraph', text: '**Lab 2 — Static & Dynamic Route Table**' },
        { type: 'steps', items: [
          { title: 'Topology', text: 'LAN1 --- R1 -------- R2 --- LAN2.' },
          { title: 'Task 1', text: 'هيئ عناوين IP على واجهات R1/R2 والـ LANs.' },
          { title: 'Task 2', text: 'أضف static route على R1 للوصول إلى LAN2 عبر next hop R2، والعكس على R2.' },
          { title: 'Task 3', text: 'افحص `show ip route` على الراوترين ولاحظ رمز `S` و[AD/Metric].' },
          { title: 'Task 4', text: 'أضف default route في سيناريو مناسب (مثلاً R1 نحو edge) وافحص Gateway of Last Resort.' },
          { title: 'Task 5', text: 'ناقش مفاهيمياً: عند تفعيل OSPF بدلاً من static، ستظهر routes كـ `O` مع AD/Metric مختلف (تمهيد لـ Topic 3.4).' },
          { title: 'Expected result', text: 'Static routes تظهر برمز S وAD افتراضي 1. Default route تظهر كـ S* عند استخدامها كـ gateway of last resort.' },
        ]},
        { type: 'callout', tone: 'warning', title: 'تنبيه', text: 'هذه محاكاة تعليمية/Conceptual. لم يتم تنفيذ Packet Tracer فعلياً داخل هذا الدرس. سلوك الأوامر قد يختلف قليلاً حسب إصدار IOS/Packet Tracer.' },
      ],
    },
    {
      id: 'exam',
      title: 'CCNA Exam Quiz',
      short: 'اختبار CCNA',
      blocks: [
        { type: 'paragraph', text: '5 أسئلة، 4 خيارات لكل سؤال. الأسئلة تغطي قراءة Routing Table، Connected vs Local، AD، Metric، وGateway of Last Resort. لا تظهر الإجابة قبل الإرسال.' },
        { type: 'quiz', questions: [
          {
            id: 'q1',
            prompt: 'A router shows `C 192.168.1.0/24 is directly connected, GigabitEthernet0/0` and `L 192.168.1.1/32 is directly connected, GigabitEthernet0/0`. What does the L route represent?',
            options: [
              'The router interface IP address itself on that interface',
              'A remote network learned from OSPF',
              'A static default route configured by an administrator',
              'The MAC address table entry for the connected switch',
            ],
            correctIndex: 0,
            requireSubmit: true,
            explanation: 'الصح هو **(A)**. `L` تعني Local route، وتمثل عنوان IP الخاص بواجهة الراوتر نفسها. في IPv4 تكون عادة /32. أما `C` فتمثل الشبكة المتصلة مباشرة.',
          },
          {
            id: 'q2',
            prompt: 'A router learns the same destination prefix 10.10.10.0/24 from OSPF [110/20] and from RIP [120/2]. Which route is installed in the routing table by default?',
            options: [
              'The OSPF route because its administrative distance is lower',
              'The RIP route because its metric is lower',
              'Both routes are installed and load-balanced by default',
              'Neither route is installed because AD and metric conflict',
            ],
            correctIndex: 0,
            requireSubmit: true,
            explanation: 'الصح هو **(A)**. عندما يختلف مصدر route لنفس prefix، يقارن الراوتر **AD** أولاً. OSPF AD 110 أقل من RIP AD 120، لذلك تُركّب route OSPF. لا نقارن metric 20 مع 2 هنا لأنهما من بروتوكولين مختلفين.',
          },
          {
            id: 'q3',
            prompt: 'Which field in a routing table entry identifies the next router IP address to forward packets toward a remote network?',
            options: [
              'Next hop',
              'Route code',
              'Metric',
              'Administrative distance',
            ],
            correctIndex: 0,
            requireSubmit: true,
            explanation: 'الصح هو **(A)**. Next hop هو عنوان IP للراوتر التالي على المسار، ويظهر عادة بصيغة `via 192.168.1.2`. Route code يحدد المصدر، وAD/Metric يحددان الثقة/التكلفة.',
          },
          {
            id: 'q4',
            kind: 'multiple',
            prompt: 'Which statements about connected and local routes are correct? (Choose more than one.)',
            options: [
              'A connected route is added when an interface has an IP address/mask and is up/up.',
              'A local route represents the router interface IP address, commonly /32 in IPv4.',
              'A local route is manually configured using the ip route command.',
              'If the interface goes down, the related connected/local routes may be removed from the routing table.',
            ],
            correctIndices: [0, 1, 3],
            requireSubmit: true,
            explanation: 'الصح هو **(A) و(B) و(D)**. Connected وLocal يضافان تلقائياً عند صحة إعداد الواجهة وحالتها UP/UP. Local تمثل IP الواجهة نفسها (/32 IPv4). الخيار (C) خطأ لأن Local ليست static route يدوية.',
          },
          {
            id: 'q5',
            kind: 'multiple',
            prompt: 'Which statements about Administrative Distance and Metric are correct? (Choose more than one.)',
            options: [
              'Administrative distance compares trustworthiness of different route sources for the same prefix.',
              'Metric compares paths within the same routing protocol.',
              'A lower metric is preferred within the same routing protocol.',
              'Metric is used to choose between OSPF and RIP routes before administrative distance.',
            ],
            correctIndices: [0, 1, 2],
            requireSubmit: true,
            explanation: 'الصح هو **(A) و(B) و(C)**. AD يقارن مصادر مختلفة لنفس prefix، وMetric يقارن مسارات داخل نفس البروتوكول والأقل أفضل. الخيار (D) خطأ: عند اختلاف المصدر يُقارن AD أولاً، وليس metric.',
          },
        ]},
      ],
    },
    {
      id: 'summary',
      title: 'Summary & Important Points',
      short: 'ملخص ونقاط مهمة',
      blocks: [
        { type: 'diagram', id: 'route-codes', caption: 'أهم رموز routing table: C, L, S, O, D, R.' },
        { type: 'diagram', id: 'prefix-and-network-mask', caption: 'Prefix/mask يحدد شبكة الوجهة ومدى تحديد route.' },
        { type: 'diagram', id: 'next-hop', caption: 'Next hop هو الراوتر التالي للوصول لشبكة بعيدة.' },
        { type: 'diagram', id: 'exit-interface', caption: 'Exit interface هو منفذ الخروج المحلي من الراوتر.' },
        { type: 'paragraph', text: '**Route Types**' },
        { type: 'list', items: [
          '**Connected (C)**: شبكة متصلة مباشرة؛ تظهر عندما الواجهة UP/UP ولها IP/mask.',
          '**Local (L)**: IP الواجهة نفسها؛ عادة /32 في IPv4.',
          '**Static (S)**: يضيفها المسؤول بـ `ip route`؛ AD افتراضي شائع 1.',
          '**Dynamic (O/R/D...)**: يتعلمها routing protocol ويتكيف مع topology.',
        ]},
        { type: 'paragraph', text: '**Routing Table Entry Components**' },
        { type: 'list', items: [
          'Route code, destination prefix/mask, [AD/Metric], next hop/via, exit interface/directly connected.',
          'Gateway of last resort: default path للشبكات غير المعروفة عندما يكون مضبوطاً.',
        ]},
        { type: 'paragraph', text: '**AD vs Metric**' },
        { type: 'list', items: [
          '**AD**: ثقة المصدر — مصادر مختلفة لنفس prefix — الأقل يفوز.',
          '**Metric**: تكلفة المسار — داخل نفس البروتوكول — الأقل يفوز.',
          'لا تقارن metric بين بروتوكولات مختلفة قبل AD.',
        ]},
        { type: 'paragraph', text: '**أهم أوامر Cisco IOS**' },
        { type: 'code', label: 'Key commands', language: 'text', code: `show ip route
show ip route connected
show ip route static
show ip interface brief
show running-config
show interfaces
ping
traceroute` },
        { type: 'callout', tone: 'tip', title: 'نقاط CCNA', text: 'احفظ معنى C/L/S/O، اقرأ [AD/Metric] بشكل صحيح، اعرف الفرق بين Connected وLocal، واذكر أن Gateway of Last Resort قد يكون not set. كل الأمثلة هنا تعليمية وتمثيلية.' },
      ],
    },
  ],
}