import type { Lesson } from '../types'

const cidrRows: string[][] = [
  ['/8', '255.0.0.0'],
  ['/16', '255.255.0.0'],
  ['/24', '255.255.255.0'],
  ['/25', '255.255.255.128'],
  ['/26', '255.255.255.192'],
  ['/27', '255.255.255.224'],
  ['/28', '255.255.255.240'],
  ['/29', '255.255.255.248'],
  ['/30', '255.255.255.252'],
]

const cidrDetailRows: string[][] = [
  ['/8', '8', '24', '16,777,216', '16,777,214', '255.0.0.0'],
  ['/16', '16', '16', '65,536', '65,534', '255.255.0.0'],
  ['/24', '24', '8', '256', '254', '255.255.255.0'],
  ['/25', '25', '7', '128', '126', '255.255.255.128'],
  ['/26', '26', '6', '64', '62', '255.255.255.192'],
  ['/27', '27', '5', '32', '30', '255.255.255.224'],
  ['/28', '28', '4', '16', '14', '255.255.255.240'],
  ['/29', '29', '3', '8', '6', '255.255.255.248'],
  ['/30', '30', '2', '4', '2', '255.255.255.252'],
]

const classfulRows: string[][] = [
  ['Class A', '1–126', '0', '255.0.0.0', '/8', 'شبكات كبيرة جداً — أول octet network والباقي host'],
  ['Class B', '128–191', '10', '255.255.0.0', '/16', 'شبكات متوسطة — أول octets network والباقي host'],
  ['Class C', '192–223', '110', '255.255.255.0', '/24', 'شبكات صغيرة — أول 3 octets network والباقي host'],
  ['Class D', '224–239', '1110', 'مفيش', 'مفيش', 'Multicast — مش network/host عادي'],
  ['Class E', '240–255', '1111', 'مفيش', 'مفيش', 'Experimental / reserved — مش للاستخدام العام'],
]

const subnet26Rows: string[][] = [
  ['1', '192.168.1.0/26', '255.255.255.192', '192.168.1.63', '192.168.1.1', '192.168.1.62', '62'],
  ['2', '192.168.1.64/26', '255.255.255.192', '192.168.1.127', '192.168.1.65', '192.168.1.126', '62'],
  ['3', '192.168.1.128/26', '255.255.255.192', '192.168.1.191', '192.168.1.129', '192.168.1.190', '62'],
  ['4', '192.168.1.192/26', '255.255.255.192', '192.168.1.255', '192.168.1.193', '192.168.1.254', '62'],
]

const subnet27Rows: string[][] = [
  ['1', '.0/27', '.31', '.1 – .30'],
  ['2', '.32/27', '.63', '.33 – .62'],
  ['3', '.64/27', '.95', '.65 – .94'],
  ['4', '.96/27', '.127', '.97 – .126'],
  ['5', '.128/27', '.159', '.129 – .158'],
  ['6', '.160/27', '.191', '.161 – .190'],
  ['7', '.192/27', '.223', '.193 – .222'],
  ['8', '.224/27', '.255', '.225 – .254'],
]

const subnet20Rows: string[][] = [
  ['1', '172.16.0.0/20', '172.16.15.255', '172.16.0.1 – 172.16.15.254'],
  ['2', '172.16.16.0/20', '172.16.31.255', '172.16.16.1 – 172.16.31.254'],
  ['3', '172.16.32.0/20', '172.16.47.255', '172.16.32.1 – 172.16.47.254'],
  ['4', '172.16.48.0/20', '172.16.63.255', '172.16.48.1 – 172.16.63.254'],
  ['5', '172.16.64.0/20', '172.16.79.255', '172.16.64.1 – 172.16.79.254'],
  ['6', '172.16.80.0/20', '172.16.95.255', '172.16.80.1 – 172.16.95.254'],
  ['7', '172.16.96.0/20', '172.16.111.255', '172.16.96.1 – 172.16.111.254'],
  ['8', '172.16.112.0/20', '172.16.127.255', '172.16.112.1 – 172.16.127.254'],
  ['9', '172.16.128.0/20', '172.16.143.255', '172.16.128.1 – 172.16.143.254'],
  ['10', '172.16.144.0/20', '172.16.159.255', '172.16.144.1 – 172.16.159.254'],
  ['11', '172.16.160.0/20', '172.16.175.255', '172.16.160.1 – 172.16.175.254'],
  ['12', '172.16.176.0/20', '172.16.191.255', '172.16.176.1 – 172.16.191.254'],
  ['13', '172.16.192.0/20', '172.16.207.255', '172.16.192.1 – 172.16.207.254'],
  ['14', '172.16.208.0/20', '172.16.223.255', '172.16.208.1 – 172.16.223.254'],
  ['15', '172.16.224.0/20', '172.16.239.255', '172.16.224.1 – 172.16.239.254'],
  ['16', '172.16.240.0/20', '172.16.255.255', '172.16.240.1 – 172.16.255.254'],
]

const vlsmRows: string[][] = [
  ['A', '100', '7', '2^7 = 128', '/25', '255.255.255.128', '192.168.10.0/25', '192.168.10.1', '192.168.10.126', '192.168.10.127'],
  ['B', '50', '6', '2^6 = 64', '/26', '255.255.255.192', '192.168.10.128/26', '192.168.10.129', '192.168.10.190', '192.168.10.191'],
  ['C', '20', '5', '2^5 = 32', '/27', '255.255.255.224', '192.168.10.192/27', '192.168.10.193', '192.168.10.222', '192.168.10.223'],
  ['D', '10', '4', '2^4 = 16', '/28', '255.255.255.240', '192.168.10.224/28', '192.168.10.225', '192.168.10.238', '192.168.10.239'],
]

const verifyCommandRows: string[][] = [
  ['`show ip interface brief`', 'Cisco IOS', 'حالة الواجهة وعنوان IP و up/up أو down'],
  ['`show running-config`', 'Cisco IOS', 'الإعداد الفعلي المكتوب على الراوتر'],
  ['`show ip route`', 'Cisco IOS', 'جدول التوجيه والشبكات المتصلة مباشرة'],
  ['`show interfaces`', 'Cisco IOS', 'تفاصيل الواجهة، العدّادات، والأخطاء'],
  ['`ping`', 'PC / IOS', 'اختبار وصول بسيط وزمن استجابة تقريبي'],
  ['`traceroute`', 'PC / IOS', 'مسار الحزم قفزة بقفزة'],
]

const troubleshootRows: string[][] = [
  [
    'Incorrect subnet mask',
    'PC1 يقدر ي ping PC2 لكن PC2 مش قادر يرد، أو الاتصال يقطع بعد دقائق',
    'ماسك مختلف على طرفين في نفس الـ LAN',
    'قارن الماسك على PC1 و PC2 والـ gateway',
    '`ipconfig` · `show ip interface brief`',
    'وحّد الماسك الصح للشبكة المطلوبة',
  ],
  [
    'Incorrect IP address',
    'مفيش ping أصلاً أو عنوان يظهر في شبكة غلط',
    'رقم IP مكتوب غلط أو خارج الـ range',
    'احسب Network ID والـ broadcast وتأكد إن العنوان داخل الـ range',
    '`ipconfig` · `show ip route`',
    'صحّح العنوان واختار أول/آخر usable صحيح',
  ],
  [
    'Duplicate IP address',
    'اتصال متقطع، رسائل duplicate address، أو ARP يتغير فجأة',
    'جهازين على نفس الـ IP',
    'دوّر على نفس العنوان في الـ ARP table والـ logs',
    '`arp -a` · `show ip arp` · `show logging`',
    'غيّر واحد منهم وامسح الـ ARP cache',
  ],
  [
    'Incorrect default gateway',
    'ping داخل الـ LAN شغال بس الوصول للشبكة التانية فاشل',
    'الـ gateway عنوان غلط أو مش موجود',
    'قارن gateway على الـ PC بعنوان الـ subinterface',
    '`ipconfig` · `show ip interface brief`',
    'اضبط الـ gateway على عنوان الراوتر الصحيح',
  ],
  [
    'Devices in different subnets accidentally',
    'جهازين متصلين بنفس السوّيتش بس مش بيشوفوا بعض',
    'ماسك قسمهم لشبكتين أو PC في VLAN غلط',
    'احسب الشبكة لكل جهاز وراجع الـ VLAN',
    '`show vlan brief` · `ipconfig`',
    'وحّد الماسك أو انقل الجهاز للـ VLAN الصح',
  ],
  [
    'Interface administratively down',
    'الواجهة `administratively down/down` ومفيش أي ترافيك',
    'الـ interface متقفول بـ `shutdown`',
    'شوف حالة الواجهة في `show ip interface brief`',
    '`show ip interface brief` · `show running-config`',
    'ادخل الواجهة واكتب `no shutdown`',
  ],
  [
    'Missing encapsulation dot1q',
    'الـ subinterface `down/down` والماسك صح',
    'الـ router مش عارف أي VLAN يربط بالـ subinterface',
    'راجع إعداد الـ subinterface والـ trunk',
    '`show running-config` · `show ip interface brief`',
    'أضف `encapsulation dot1q <vlan>` وتأكد من الـ trunk',
  ],
  [
    'Wrong subnet in show ip route',
    'الـ ping فاشل رغم إن الواجهة up',
    'عنوان أو ماسك الـ subinterface غلط فطلع route مختلف',
    'قارن الـ connected route بالمخطط',
    '`show ip route` · `show ip interface brief`',
    'صحّح `ip address` على الـ subinterface',
  ],
]

export const topic16Lesson: Lesson = {
  topicId: '1.6',
  title: 'IPv4 Addressing & Subnetting',
  description:
    'في الدرس ده هنتعلّم إزاي الـ IPv4 بيتكوّن من 32 بت، وإزاي نحوّل binary لـ decimal خطوة بخطوة، ونفرّق بين Network ID و Host ID. هشوف Subnet Mask و CIDR، ونحسب Network و Broadcast و Usable Hosts، ونتقن Subnetting بالـ Block Size Method، ونقارن FLSM بـ VLSM، ونطبّق كل ده على Cisco IOS ولابَين Packet Tracer.',
  estimatedTime: '~110 دقيقة',
  steps: [
    {
      id: 'what',
      title: 'إيه اللي إحنا بندرسه وليه وجوده مهم؟',
      short: 'مفهوم الدرس',
      blocks: [
        {
          type: 'paragraph',
          text: 'لحد دلوقتي عرفنا إزاي البيانات تتنقل بين تطبيقات بـ `TCP` و `UDP`. السؤال اللي جه دلوقتي: **إزاي الـ Device يحدد مين المرسل ومين المستقبل على مستوى الشبكة؟** الإجابة هي `IPv4 addressing`: نظام عناوين منطقي بيسمح لأي جهاز يتعرّف عليه وعلى الشبكة اللي هو فيها.',
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'مكان الدرس في الـ blueprint',
          text: 'الموضوع ده هو Objective `1.6` في دومين `Network Fundamentals`: `Configure and verify IPv4 addressing and subnetting`. الامتحان بيجيب أسئلة حسابية على الـ mask والـ prefix، و network address و broadcast، وتقسيم شبكة كبيرة لـ subnets، و VLSM، وقراءة مخرجات أوامر Cisco IOS.',
        },
        {
          type: 'table',
          headers: ['المصطلح', 'معناه', 'مثال'],
          rows: [
            ['`IPv4 address`', 'عنوان منطقي من 32 bit بيعرّف واجهة جهاز على شبكة IP', '`192.168.10.10`'],
            ['`Bit`', 'أصغر وحدة معلومات: 0 أو 1', '`1`'],
            ['`Octet`', '8 بتات جنب بعض', '`11000000`'],
            ['`Dotted decimal`', 'كتابة الأربعة octets كأرقام عشرية مفصولة بنقاط', '`192.168.10.10`'],
            ['`Subnet Mask`', 'القناع اللي بيفصل network bits عن host bits', '`255.255.255.0`'],
            ['`CIDR / Prefix`', 'طريقة مختصرة لكتابة عدد الـ network bits', '`/24`'],
            ['`Network ID`', 'عنوان الشبكة نفسه، أول عنوان في الـ range', '`192.168.10.0`'],
            ['`Broadcast Address`', 'آخر عنوان في الشبكة، مخصص للبث', '`192.168.10.255`'],
          ],
        },
        { type: 'diagram', id: 'ipv4-32bit', caption: 'العنوان 32 bit: أربعة octets، كل octet 8 بتات، والكتابة النهائية dotted decimal.' },
        {
          type: 'paragraph',
          text: 'القاعدة الحسابية الأساسية: `1 byte = 8 bits`، و`IPv4 = 4 bytes = 32 bits`. كل octet ممكن يمثّل رقم من 0 لـ 255 لأن أكبر قيمة بـ 8 بتات هي `11111111` يعني 255. عشان كده مفيش octet أكبر من 255 في عنوان IPv4 صحيح.',
        },
        {
          type: 'table',
          headers: ['المثال', 'صحيح؟', 'السبب'],
          rows: [
            ['`192.168.10.10`', 'نعم', 'أربعة octets، كل واحد بين 0 و255'],
            ['`8.8.8.8`', 'نعم', 'صيغة صحيحة حتى لو الأرقام متكررة'],
            ['`172.16.0.1`', 'نعم', 'أربعة octets صحيحة'],
            ['`192.168.1.256`', 'لا', '256 أكبر من 255'],
            ['`192.168.1`', 'لا', 'تلات octets بس'],
            ['`300.1.1.1`', 'لا', 'أول octet أكبر من 255'],
            ['`192.168.1.1.1`', 'لا', 'خمسة octets'],
          ],
        },
        {
          type: 'table',
          headers: ['الفرق', '`IP Address`', '`MAC Address`'],
          rows: [
            ['الطبقة', 'Layer 3 — Network Layer', 'Layer 2 — Data Link Layer'],
            ['الحجم', '32 bit (4 bytes)', '48 bit (6 bytes)'],
            ['الوظيفة', 'توجيه الـ packet بين الشبكات', 'توجيه الـ frame داخل نفس الرابط'],
            ['بيتغير؟', 'بيختلف حسب الشبكة اللي الجهاز فيها', 'ثابت تقريباً للـ NIC'],
            ['مثال', '`192.168.10.10`', `00:1A:2B:3C:4D:5E`],
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'تشبيه بسيط',
          text: 'تخيّل `IP address` زي عنوان البيت: بيدلّك على مكان البيت في المدينة وبيتغير لو نقلت حارة. أمّا `MAC address` زي رقم البطاقة الشخصية بتاعة الجهاز: بيفضل معاه في أي مكان. الراوتر بيقرأ الـ IP، والسوّيتش بيقرأ الـ MAC.',
        },
      ],
    },
    {
      id: 'how',
      title: 'إزاي بيشتغل الـ IPv4 بالتفصيل',
      short: 'الآلية',
      blocks: [
        {
          type: 'paragraph',
          text: 'الـ decimal نظام بيستخدم الأرقام 0–9، أمّا الـ binary نظام بيستخدم 0 و1 بس. الكمبيوتر بيشتغل بـ binary، وإحنا بنكتب عناوين IP بـ decimal عشان سهولة القراءة. لازم نعرف نترجم بينهم بالضبط، مش بالتخمين.',
        },
        { type: 'diagram', id: 'ipv4-binary-conversion', caption: 'اضغط على أي بت لتقلبه وشوف إزاي الـ weight بتاعه بيضيف للنتيجة. استخدم التالي لعرض أمثلة 192 و 168 و 10 و 255.' },
        {
          type: 'steps',
          items: [
            { title: '1 — اكتب الـ weights', text: 'من اليسار لليمين: `128, 64, 32, 16, 8, 4, 2, 1`. كل واحد يساوي ضعف اللي بعده.' },
            { title: '2 — اضرب البت في الـ weight', text: 'لو البت = 1 خد الـ weight، ولو 0 اعتبره صفر. في `11000000`: `1×128 + 1×64 + 0×32 + ...`.' },
            { title: '3 — اجمع', text: '`128 + 64 + 0 + 0 + 0 + 0 + 0 + 0 = 192`. يعني `11000000 = 192`.' },
          ],
        },
        {
          type: 'steps',
          items: [
            { title: '1 — قارن بـ 128', text: '168 أكبر من 128 → اكتب 1 واطرح: `168 - 128 = 40`. البت الأول = 1.' },
            { title: '2 — قارن بـ 64', text: '40 أصغر من 64 → اكتب 0. البت التاني = 0.' },
            { title: '3 — قارن بـ 32', text: '40 أكبر من 32 → اكتب 1 واطرح: `40 - 32 = 8`. البت التالت = 1.' },
            { title: '4 — قارن بـ 16', text: '8 أصغر من 16 → اكتب 0.' },
            { title: '5 — قارن بـ 8', text: '8 يساوي 8 → اكتب 1 والباقي صفر.' },
            { title: '6 — اكتب النتيجة', text: 'الباقي بعد 8 صفر، فكل اللي بعده أصفار: `10101000 = 168`.' },
          ],
        },
        {
          type: 'table',
          headers: ['Decimal', 'Binary', 'الحساب'],
          rows: [
            ['`192`', '`11000000`', '128 + 64'],
            ['`168`', '`10101000`', '128 + 32 + 8'],
            ['`10`', '`00001010`', '8 + 2'],
            ['`255`', '`11111111`', '128 + 64 + 32 + 16 + 8 + 4 + 2 + 1'],
          ],
        },
        {
          type: 'paragraph',
          text: 'دلوقتي نجيب السؤال الأهم: بعد ما الـ packet وصل للجهاز، إزاي يعرف لو الـ destination في نفس الشبكة ولا في شبكة تانية؟ هنا بيدخل `Subnet Mask`. الجهاز بيعمل `AND` بين الـ IP بتاعه وبين الـ destination IP بعد تطبيق نفس الـ mask. لو النتيجتين متساويتين يبقى local، لو مختلفتين يبعت لـ `default gateway`.',
        },
        { type: 'diagram', id: 'ipv4-network-host', caption: 'الماسك يفصل الـ 24 بت الأولى network والـ 8 بت الأخيرة host؛ الـ AND بيطلع Network ID.' },
        {
          type: 'paragraph',
          text: 'في المثال `192.168.1.10` مع ماسك `255.255.255.0` (/24): الـ network portion هو `192.168.1` والـ host portion هو `10`. أي جهاز عنوانه `192.168.1.X` في نفس الشبكة، وأي جهاز عنوانه `192.168.2.X` في شبكة تانية محتاج راوتر.',
        },
        { type: 'diagram', id: 'ipv4-subnet-mask-cidr', caption: 'الـ prefix بيقول عدد الـ network bits؛ استخدم التالي لتشوف /8 و /16 و /24 و /26 و /30.' },
        {
          type: 'callout',
          tone: 'warning',
          title: 'قاعدة الماسك الصحيح',
          text: 'في `Subnet Mask` الصحيح الـ 1s لازم يكونوا متتابعين من اليسار والـ 0s متتابعين من اليمين. يعني `11111111.11111111.11111111.11000000` صح، أمّا `11111111.11111111.11111111.10111111` غلط لأن فيه 0 بعده 1.',
        },
        {
          type: 'table',
          headers: ['CIDR', 'Subnet Mask'],
          rows: cidrRows,
        },
        {
          type: 'table',
          headers: ['Prefix', 'Network bits', 'Host bits', 'Total addresses', 'Usable hosts', 'Mask'],
          rows: cidrDetailRows,
        },
        {
          type: 'paragraph',
          text: 'علشان تحسب: `network bits = prefix` و`host bits = 32 - prefix`. مثال `/26`: network bits = 26، host bits = 6، عدد العناوين `2^6 = 64`، والـ usable في الشبكة العادية `64 - 2 = 62`. الـ prefix بيتكتب بعد العنوان ب slash زي `192.168.1.0/26` وده اسمه `CIDR notation`.',
        },
      ],
    },
    {
      id: 'packet',
      title: 'التحويل والعنونة على مستوى البتّات',
      short: 'الحسابات',
      blocks: [
        { type: 'diagram', id: 'ipv4-range', caption: 'في /24: Network .0، First Host .1، Last Host .254، Broadcast .255.' },
        {
          type: 'table',
          headers: ['العنصر', 'القيمة', 'إزاي اتحسبت؟'],
          rows: [
            ['Network Address', '`192.168.1.0`', 'كل الـ host bits = 0'],
            ['Broadcast Address', '`192.168.1.255`', 'كل الـ host bits = 1'],
            ['First Usable Host', '`192.168.1.1`', 'Network + 1'],
            ['Last Usable Host', '`192.168.1.254`', 'Broadcast - 1'],
            ['Total Addresses', '`256`', '`2^8`'],
            ['Usable Hosts', '`254`', '`256 - 2`'],
          ],
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'استثناءات لازم تعرفها',
          text: 'في الشبكة العادية الـ network address والـ broadcast address مش بيتخصّصوا لأجهزة. بس في `/31` (نقطتين point-to-point) غالباً الاتنين usable، وفي `/32` العنوان كله host route واحد. دول حالات خاصة، وميخلّوش القاعدة `2^h - 2` غلط — بس لازم تفرّق بينهم في الامتحان.',
        },
        { type: 'diagram', id: 'ipv4-subnet-26', caption: 'تقسيم /24 لـ /26: أربع شبكات، كل واحدة 64 عنوان و 62 usable.' },
        {
          type: 'steps',
          items: [
            { title: 'Example 1 — الأصل', text: '`192.168.1.0/24`: الـ prefix الأصلي 24، host bits = 8، إجمالي 256 عنوان.' },
            { title: 'New prefix', text: 'الجديد `/26`. Borrowed bits = `26 - 24 = 2`. Host bits = `32 - 26 = 6`.' },
            { title: 'عدد الشبكات', text: '`2^n = 2^2 = 4` subnets.' },
            { title: 'عدد العناوين', text: '`2^h = 2^6 = 64` عنوان لكل subnet، والـ usable `64 - 2 = 62`.' },
            { title: 'Block size', text: 'الماسك `/26` = `255.255.255.192`. Block size = `256 - 192 = 64`. فالشبكات تبدأ 0، 64، 128، 192.' },
            { title: 'النتيجة', text: 'الـ broadcast لكل subnet قبل بداية التالي: .63، .127، .191، .255.' },
          ],
        },
        {
          type: 'table',
          headers: ['#', 'Network', 'Mask', 'Broadcast', 'First Host', 'Last Host', 'Usable'],
          rows: subnet26Rows,
        },
        { type: 'diagram', id: 'ipv4-block-size', caption: 'الـ Block Size Method: اطرح آخر octet في الماسك من 256 واقفز بالنتيجة.' },
        {
          type: 'steps',
          items: [
            { title: 'Example 2 — الأصل والجديد', text: '`192.168.1.0/24` → `/27`. Borrowed = `27 - 24 = 3`. Host bits = `32 - 27 = 5`.' },
            { title: 'الكميات', text: '`2^3 = 8` subnets. `2^5 = 32` عنوان لكل subnet، usable = `30`.' },
            { title: 'Block size', text: '`/27` = `255.255.255.224`. `256 - 224 = 32`، فالقفزة 32.' },
            { title: 'البدايات', text: '0، 32، 64، 96، 128، 160، 192، 224.' },
          ],
        },
        {
          type: 'table',
          headers: ['#', 'Network', 'Broadcast', 'Usable Range'],
          rows: subnet27Rows,
        },
        {
          type: 'steps',
          items: [
            { title: 'Example 3 — الأصل والجديد', text: '`172.16.0.0/16` → `/20`. Borrowed = `20 - 16 = 4`. Host bits = `32 - 20 = 12`.' },
            { title: 'الكميات', text: '`2^4 = 16` subnets. `2^12 = 4096` عنوان لكل subnet، usable = `4094`.' },
            { title: 'الماسك', text: '`/20` = `255.255.240.0`. التغيير حصل في الـ third octet.' },
            { title: 'Block size', text: 'في الـ octet اللي اتغير: `256 - 240 = 16`. يعني الـ third octet يقفز 16: 0، 16، 32 ... 240.' },
          ],
        },
        {
          type: 'table',
          headers: ['#', 'Network', 'Broadcast', 'Usable Range'],
          rows: subnet20Rows,
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'فخ مهم',
          text: 'الـ Block Size بتاعك دايماً في الـ octet اللي اتغير فيه الـ mask، مش آخر octet دايماً. في `/26` التغيير في الرابع فـ `256 - 192`. في `/20` التغيير في التالت فـ `256 - 240 = 16` في الـ third octet.',
        },
        { type: 'diagram', id: 'ipv4-flsm-vlsm', caption: 'FLSM: كل الشبكات بنفس الحجم. VLSM: كل شبكة بالحجم اللي يناسبها.' },
        {
          type: 'table',
          headers: ['النوع', 'المعنى', 'الميزة', 'العيب'],
          rows: [
            ['`FLSM` — Fixed Length Subnet Mask', 'كل الـ subnets ليها نفس الـ mask ونفس عدد الـ hosts', 'سهل الحساب والإدارة', 'بيهدر عناوين لو الاحتياجات مختلفة'],
            ['`VLSM` — Variable Length Subnet Mask', 'كل subnet بياخد prefix مختلف حسب حجمه', 'توفير كبير في العناوين وواقعي أكتر', 'محتاج تخطيط دقيق وترتيب من الأكبر للأصغر'],
          ],
        },
        {
          type: 'paragraph',
          text: 'مثال VLSM: شركة محتاجة A = 100، B = 50، C = 20، D = 10 hosts من `192.168.10.0/24`. نرتب من الأكبر: A محتاج 7 host bits لأن `2^7 = 128` → `/25`. B محتاج 6 لأن `2^6 = 64` → `/26`. C محتاج 5 لأن `2^5 = 32` → `/27`. D محتاج 4 لأن `2^4 = 16` → `/28`.',
        },
        { type: 'diagram', id: 'ipv4-vlsm-allocation', caption: 'التخصيص من الأكبر للأصغر: /25 ثم /26 ثم /27 ثم /28، والباقي `.240/28`.' },
        {
          type: 'table',
          headers: ['Dept', 'Hosts', 'Host bits', 'Power', 'Prefix', 'Mask', 'Network', 'First', 'Last', 'Broadcast'],
          rows: vlsmRows,
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'الفاضل',
          text: 'بعد D انتهت الشبكات عند `192.168.10.239`. المتبقي هو `192.168.10.240/28`: الـ network `.240`، الـ broadcast `.255`، والـ usable `.241 – .254`. ده احتياطي للتوسع.',
        },
        {
          type: 'table',
          headers: ['Class', 'First octet', 'Binary prefix', 'Default mask', 'CIDR', 'ملاحظة'],
          rows: classfulRows,
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Classful مقابل Classless',
          text: 'الـ classes دي معلومات تاريخية/مفاهيمية في CCNA. قديم كان الـ router بياخد default mask حسب أول octet، لكن ده بيضيّع عناوين: شركة محتاجة 100 host كانت هتاخد Class C كامل (254 usable). دلوقتي الشبكات الحديثة بتستخدم `CIDR` و `VLSM`، يعني `classless` — الماسك بيتكتب صراحة ومش مفروض من الـ class.',
        },
      ],
    },
    {
      id: 'config',
      title: 'إعداد Cisco IOS لـ IPv4 والـ subnetting',
      short: 'أوامر الإعداد',
      blocks: [
        {
          type: 'callout',
          tone: 'info',
          title: 'التوبولوجيا',
          text: 'عشان عندنا Switch واحد بس وعايزين شبكتين، هنستخدم `router-on-a-stick`: الـ R1 عنده subinterfaces على G0/0، والـ SW1 بيفصلهم بـ VLAN 10 و VLAN 20. دول منافذ افتراضية على نفس الكابل، وكل subinterface هو الـ default gateway لشبكة. ده أسلوب قياسي في CCNA.',
        },
        {
          type: 'table',
          headers: ['الجهاز / الواجهة', 'VLAN', 'IP Address', 'Mask', 'الدور'],
          rows: [
            ['`R1 G0/0.10`', '10', '`192.168.10.1`', '`255.255.255.128`', 'Gateway لـ Department A (/25)'],
            ['`R1 G0/0.20`', '20', '`192.168.10.129`', '`255.255.255.192`', 'Gateway لـ Department B (/26)'],
            ['`PC1`', '10', '`192.168.10.10`', '`255.255.255.128`', 'Department A'],
            ['`PC2`', '20', '`192.168.10.130`', '`255.255.255.192`', 'Department B'],
            ['`PC3`', '20', '`192.168.10.131`', '`255.255.255.192`', 'Department B'],
          ],
        },
        {
          type: 'code',
          label: 'R1 — subinterfaces',
          language: 'ios',
          code: `enable
configure terminal
hostname R1
!
interface gigabitEthernet 0/0
 no shutdown
!
interface gigabitEthernet 0/0.10
 encapsulation dot1q 10
 ip address 192.168.10.1 255.255.255.128
!
interface gigabitEthernet 0/0.20
 encapsulation dot1q 20
 ip address 192.168.10.129 255.255.255.192
!
end
copy running-config startup-config`,
        },
        {
          type: 'table',
          headers: ['الأمر', 'بيعمل إيه؟'],
          rows: [
            ['`interface gigabitEthernet 0/0`', 'يدخل إعداد الواجهة الفعلية، و`no shutdown` يفتحها إدارياً.'],
            ['`interface gigabitEthernet 0/0.10`', 'ينشئ subinterface رقم 10 فوق نفس الواجهة الفعلية.'],
            ['`encapsulation dot1q 10`', 'بيقول للراوتر إن الـ subinterface ده بيخدم VLAN 10 (802.1Q tagging).'],
            ['`ip address 192.168.10.1 255.255.255.128`', 'يدي الـ subinterface عنوان Gateway بتاع /25.'],
            ['`interface gigabitEthernet 0/0.20`', 'ينشئ subinterface تاني لـ VLAN 20.'],
            ['`ip address 192.168.10.129 255.255.255.192`', 'يدي Gateway بتاع /26.'],
            ['`copy running-config startup-config`', 'يحفظ الإعداد عشان يفضل بعد إعادة التشغيل.'],
          ],
        },
        {
          type: 'code',
          label: 'SW1 — VLANs + access + trunk',
          language: 'ios',
          code: `enable
configure terminal
hostname SW1
!
vlan 10
 name DEPT-A
vlan 20
 name DEPT-B
!
interface fastEthernet 0/1
 switchport mode access
 switchport access vlan 10
!
interface range fastEthernet 0/2 - 3
 switchport mode access
 switchport access vlan 20
!
interface gigabitEthernet 0/1
 switchport mode trunk
!
end
copy running-config startup-config`,
        },
        {
          type: 'table',
          headers: ['الأمر', 'بيعمل إيه؟'],
          rows: [
            ['`vlan 10` / `vlan 20`', 'ينشئ الـ VLANs على السوّيتش.'],
            ['`switchport mode access`', 'يخلي المنفذ access لجهاز واحد.'],
            ['`switchport access vlan 10`', 'يحط PC1 في VLAN 10.'],
            ['`interface range fastEthernet 0/2 - 3`', 'يعدّل PC2 و PC3 في نفس الوقت.'],
            ['`switchport mode trunk`', 'يسمح بمرور VLAN 10 و 20 على الكابل بين SW1 و R1.'],
          ],
        },
        {
          type: 'table',
          headers: ['الجهاز', 'IP Address', 'Subnet Mask', 'Default Gateway'],
          rows: [
            ['`PC1`', '`192.168.10.10`', '`255.255.255.128`', '`192.168.10.1`'],
            ['`PC2`', '`192.168.10.130`', '`255.255.255.192`', '`192.168.10.129`'],
            ['`PC3`', '`192.168.10.131`', '`255.255.255.192`', '`192.168.10.129`'],
          ],
        },
        {
          type: 'code',
          label: 'مثال Layer 3 Switch SVI (بديل للراوتر)',
          language: 'ios',
          code: `enable
configure terminal
!
interface vlan 10
 ip address 192.168.10.1 255.255.255.128
 no shutdown
!
interface vlan 20
 ip address 192.168.10.129 255.255.255.192
 no shutdown
!
ip routing`,
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'مهم قبل أي ping',
          text: 'لو استخدمت router-on-a-stick لازم يكون الـ trunk شغال والـ encapsulation مطابق للـ VLAN. لو استخدمت Layer 3 Switch لازم `ip routing` يكون مفعّل. كمان الـ PC لازم الـ gateway بتاعه يبقى عنوان الـ SVI أو الـ subinterface الصح.',
        },
      ],
    },
    {
      id: 'verify',
      title: 'أوامر التحقق وتفسير مخرجاتها',
      short: 'التحقق',
      blocks: [
        {
          type: 'paragraph',
          text: 'الـ verification هنا معناه ثلاث حاجات: الواجهة شغالة `up/up`، العنوان والماسك مكتوبين صح، والـ route موجود في الجدول. بعدين تختبر بـ `ping` و `traceroute`. صيغة المخرجات مختلفة بين Cisco IOS و Windows، فركز على المعنى.',
        },
        {
          type: 'table',
          headers: ['الأمر', 'البيئة', 'بيوضّح إيه؟'],
          rows: verifyCommandRows,
        },
        {
          type: 'code',
          label: 'R1 — مخرجات تمثيلية',
          language: 'ios',
          code: `R1# show ip interface brief
Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0     unassigned      YES unset  up                    up
GigabitEthernet0/0.10  192.168.10.1    YES manual up                    up
GigabitEthernet0/0.20  192.168.10.129  YES manual up                    up

R1# show ip route
Codes: C - connected, S - static, L - local
Gateway of last resort is not set

C    192.168.10.0/25 is directly connected, GigabitEthernet0/0.10
L    192.168.10.1/32 is directly connected, GigabitEthernet0/0.10
C    192.168.10.128/26 is directly connected, GigabitEthernet0/0.20
L    192.168.10.129/32 is directly connected, GigabitEthernet0/0.20

R1# show interfaces gigabitEthernet 0/0.10
GigabitEthernet0/0.10 is up, line protocol is up
  Internet address is 192.168.10.1/25
  Broadcast address is 255.255.255.255
  Last input 00:00:03, output 00:00:01, output hang never`,
        },
        {
          type: 'table',
          headers: ['اللي تشوفه', 'Correct', 'Incorrect / معناه'],
          rows: [
            ['`up / up`', 'الواجهة شغالة فيزيائياً وبروتوكولياً', '`administratively down` = محتاجة `no shutdown`؛ `down/down` = كابل/طرف تاني'],
            ['`C 192.168.10.0/25`', 'شبكة Department A متصلة صح', 'مفيش Route يعني العنوان أو الماسك غلط'],
            ['`C 192.168.10.128/26`', 'شبكة Department B متصلة صح', 'ظهور `.128/25` بدل `/26` معناه ماسك غلط'],
            ['`ping` 100% success', 'الاتصال والـ gateway تمام', '`Request timed out` = route أو mask أو gateway أو firewall'],
            ['`traceroute`', 'بيوري كل hop', 'توقف عند أول hop = المشكلة في الـ gateway أو المسار'],
          ],
        },
        {
          type: 'code',
          label: 'من PC1 — Windows / IOS',
          language: 'powershell',
          code: `C:\\> ipconfig
IPv4 Address . . . . . . . . . . . : 192.168.10.10
Subnet Mask . . . . . . . . . . . : 255.255.255.128
Default Gateway . . . . . . . . . : 192.168.10.1

C:\\> ping 192.168.10.130
Reply from 192.168.10.130: bytes=32 time=1ms TTL=127
Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)

R1# traceroute 192.168.10.130
Type escape sequence to abort.
Tracing the route to 192.168.10.130
  1  192.168.10.129 2 msec 1 msec 1 msec`,
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'دقة في مخرجات Cisco',
          text: 'الـ `Broadcast address is 255.255.255.255` في `show interfaces` مش دايماً معناها إن الـ directed broadcast بتاع الشبكة غلط — دي طريقة عرض في بعض الإصدارات. اللي تركّز عليه في الحسابات هو `Internet address is .../25` وخطوط `show ip route`.',
        },
      ],
    },
    {
      id: 'mistakes',
      title: 'أخطاء وتشخيص في الـ IPv4 والـ subnetting',
      short: 'التشخيص',
      blocks: [
        {
          type: 'callout',
          tone: 'info',
          title: 'منهجية ثابتة',
          text: '`1)` احسب الشبكة والـ broadcast من العنوان والماسك · `2)` قارن الماسك على كل الأجهزة · `3)` تأكد من الـ gateway · `4)` شوف الـ interface `up/up` · `5)` افحص `show ip route` · `6)` اعمل ping من أقرب نقطة · `7)` غيّر حاجة واحدة بس وأعد الاختبار.',
        },
        {
          type: 'table',
          headers: ['المشكلة', 'الأعراض', 'السبب', 'التحقق', 'الأوامر', 'الحل'],
          rows: troubleshootRows,
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'مثال عملي 1 — ماسك غلط',
          text: 'PC1 = `192.168.10.10/25` و PC2 = `192.168.10.130/24`. PC1 يشوف PC2 في شبكة تانية ويروح للـ gateway. PC2 يشوف PC1 في نفس الـ /24 ويحاول ARP مباشر. النتيجة ping غير متناظر أو فاشل. الحل: PC2 يبقى `/26` لأنه في `192.168.10.128/26`.',
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'مثال عملي 2 — gateway غلط',
          text: 'PC1 عنده gateway `192.168.10.2` بدل `192.168.10.1`. الـ ping لـ PC2 في نفس الـ LAN شغال، بس ping لـ PC3 في VLAN 20 فاشل. راجع `ipconfig` وقارنه بـ `show ip interface brief` على R1.',
        },
      ],
    },
    {
      id: 'lab',
      title: 'لاب Packet Tracer: عنونة وتقسيم شبكات',
      short: 'لاب عملي',
      blocks: [
        {
          type: 'paragraph',
          text: 'هعمل لابين: الأول أساسي عشان تتأكد من الـ addressing والـ gateway وتشخّص ماسك غلط. والتاني VLSM عشان تقسّم `192.168.10.0/24` وتوصل شبكتين فعلياً عبر R1 و SW1.',
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Lab 1 — Basic IPv4 Addressing',
          text: 'الأجهزة: `1 Router` + `1 Switch` + `3 PCs`. كلهم في نفس الـ LAN على `192.168.10.0/24` في البداية. الهدف: ضبط ipconfig صح، ping بين كل الأجهزة، وبعدين نكسر الماسك عشان نتعلّم التشخيص.',
        },
        {
          type: 'table',
          headers: ['الجهاز', 'الواجهة', 'IP Address', 'Mask', 'Gateway'],
          rows: [
            ['`R1`', 'G0/0', '`192.168.10.1`', '`255.255.255.0`', '—'],
            ['`PC1`', 'NIC', '`192.168.10.10`', '`255.255.255.0`', '`192.168.10.1`'],
            ['`PC2`', 'NIC', '`192.168.10.20`', '`255.255.255.0`', '`192.168.10.1`'],
            ['`PC3`', 'NIC', '`192.168.10.30`', '`255.255.255.0`', '`192.168.10.1`'],
          ],
        },
        {
          type: 'code',
          label: 'Lab 1 — R1 basic config',
          language: 'ios',
          code: `enable
configure terminal
hostname R1
!
interface gigabitEthernet 0/0
 ip address 192.168.10.1 255.255.255.0
 no shutdown
end
copy running-config startup-config`,
        },
        {
          type: 'steps',
          items: [
            { title: 'المهمة 1', text: 'اربط PC1 و PC2 و PC3 بمنافذ SW1، واربط G0/0 على R1 بمنفذ على SW1. شوف إن الـ link أخضر.' },
            { title: 'المهمة 2', text: 'اضبط العناوين في الجدول اللي فوق من تبويب Desktop → IP Configuration على كل PC.' },
            { title: 'المهمة 3', text: 'من PC1 اعمل `ping 192.168.10.20` و `ping 192.168.10.30`. المفروض 4 من 4 يرجعوا.' },
            { title: 'المهمة 4 — Fault', text: 'غيّر ماسك PC2 لـ `255.255.255.240` (/28) وسيب العنوان `.20`. اعمل ping تاني من PC1 ل PC2. هيفشل لأن PC2 يشوف PC1 في subnet تانية ويروح للـ gateway.' },
            { title: 'المهمة 5', text: 'ارجّع الماسك `255.255.255.0` وأعد الـ ping. دوّن الفرق في `show ip arp` قبل وبعد.' },
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'النتيجة المتوقعة للـ Lab 1',
          text: 'بعد الإصلاح: PC1 ↔ PC2 ↔ PC3 كلهم بيشوفوا بعض، والـ gateway `192.168.10.1` قابل للـ ping. لو مفيش ping، راجع أولاً إن الـ links لونها أخضر وإن الماسك متطابق على كل الأجهزة.',
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Lab 2 — Subnetting and VLSM',
          text: 'نفس الأجهزة، بس دلوقتي هنقسّم `192.168.10.0/24`: Department A ياخد /25 و Department B ياخد /26. Fاضل /26 للتوسع. R1 هيبقى gateway للشبكتين عبر subinterfaces، و SW1 هيفصلهم بـ VLAN 10 و VLAN 20.',
        },
        {
          type: 'table',
          headers: ['Department', 'Prefix', 'Mask', 'Network', 'Gateway', 'Devices'],
          rows: [
            ['`Department A`', '/25', '`255.255.255.128`', '`192.168.10.0/25`', '`192.168.10.1`', '`PC1: .10`'],
            ['`Department B`', '/26', '`255.255.255.192`', '`192.168.10.128/26`', '`192.168.10.129`', '`PC2: .130`, `PC3: .131`'],
            ['`Future`', '/26', '`255.255.255.192`', '`192.168.10.192/26`', '—', 'احتياطي'],
          ],
        },
        { type: 'diagram', id: 'ipv4-lab-topology', caption: 'R1 بـ subinterfaces، SW1 بـ VLANs، وثلاثة PCs موزّعين على شبكتين VLSM.' },
        {
          type: 'steps',
          items: [
            { title: 'المهمة 1 — احسب', text: 'اكتب معادلات /25 و /26: الـ block size، أول/آخر usable، والـ broadcast. راجع جدول Lab 2.' },
            { title: 'المهمة 2 — R1', text: 'طبّق إعداد الـ subinterfaces من Step 04: `.10` بـ `.1/25` و `.20` بـ `.129/26`. اكتب `no shutdown` على G0/0.' },
            { title: 'المهمة 3 — SW1', text: 'اعمل VLAN 10 و VLAN 20، وخلي F0/1 access في VLAN 10، و F0/2–3 access في VLAN 20، و G0/1 trunk.' },
            { title: 'المهمة 4 — PCs', text: 'PC1: `192.168.10.10/25` gateway `.1`. PC2: `.130/26` gateway `.129`. PC3: `.131/26` gateway `.129`.' },
            { title: 'المهمة 5 — ping', text: 'من PC1 اعمل ping لـ PC2 ولـ PC3. ومن PC2 اعمل ping لـ PC1. كلهم لازم ينجحوا.' },
            { title: 'المهمة 6 — route', text: 'على R1 اكتب `show ip route` ولازم تشوف `C 192.168.10.0/25` و `C 192.168.10.128/26`. جرّب `show ip interface brief` كمان.' },
            { title: 'المهمة 7 — تحدي', text: 'غيّر ماسك PC2 لـ `255.255.255.128` غلط، وشوف إزاي الـ ping يقطع. أصلحه وأعد التحقق.' },
          ],
        },
        {
          type: 'code',
          label: 'نتائج متوقعة — تحقق سريع',
          language: 'ios',
          code: `R1# show ip route | include 192.168.10
C    192.168.10.0/25 is directly connected, GigabitEthernet0/0.10
C    192.168.10.128/26 is directly connected, GigabitEthernet0/0.20

PC1> ping 192.168.10.130
Reply from 192.168.10.130: bytes=32 time=1ms TTL=127
Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)`,
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'حدود المحاكاة',
          text: 'Packet Tracer بيحاكي الـ addressing والـ routing بشكل تعليمي، ومش بيوريك كل تفاصيل الـ ARP والـ ASIC implementation. اللي هنا كافي إنك تتدرب على الحساب والأوامر وتفسير المخرجات.',
        },
      ],
    },
    {
      id: 'exam',
      title: 'خمسة أسئلة بصيغة اختبار CCNA',
      short: 'أسئلة تدريب',
      blocks: [
        {
          type: 'paragraph',
          text: 'كل سؤال فيه زر **تحقق من الإجابة**؛ الإجابة والشرح مخفيين لحد ما تضغط. اقرأ خطوات الحساب في الشرح — ده أهم من حفظ رقم الإجابة.',
        },
        {
          type: 'quiz',
          questions: [
            {
              id: 'q1',
              prompt: 'أي وصف صحيح لـ IPv4 address؟',
              options: [
                'عنوان 32 bit مكتوب كأربعة octets بالـ dotted decimal، وكل octet بين 0 و255',
                'عنوان 48 bit مكتوب بـ hexadecimal ومستخدم في الـ MAC layer',
                'عنوان 64 bit بيستخدمه IPv6 فقط',
                'أربعة octets ممكن أي واحد فيهم يكون 256 لو الباقي صغار',
              ],
              correctIndex: 0,
              requireSubmit: true,
              explanation:
                'الصح هو **(A)**: IPv4 = 32 bit = 4 octets × 8 bits، وكل octet بين 0 و255. **(B)** وصف الـ MAC address. **(C)** غلط لأن IPv6 هو 128 bit. **(D)** غلط لأن 256 مستحيل في octet واحد.',
            },
            {
              id: 'q2',
              prompt: 'شبكة `192.168.1.0/24` عايزة تنقسم لـ subnets كل واحدة فيها 62 usable host على الأقل. إيه الـ prefix والماسك الصح؟',
              options: [
                '`/25` و `255.255.255.128` — 126 usable لكل شبكة',
                '`/26` و `255.255.255.192` — 64 عنوان و 62 usable لكل شبكة',
                '`/27` و `255.255.255.224` — 30 usable بس',
                '`/28` و `255.255.255.240` — 14 usable بس',
              ],
              correctIndex: 1,
              requireSubmit: true,
              explanation:
                'الصح هو **(B)**: `/26` يعني 6 host bits، يعني `2^6 = 64` عنوان و`64 - 2 = 62` usable. الـ mask هو `255.255.255.192` والـ block size `256 - 192 = 64`. **(A)** أكبر من المطلوب، **(C)** و **(D)** أقل من 62.',
            },
            {
              id: 'q3',
              prompt: 'للشبكة `192.168.1.0/24`، إيه الـ Network Address والـ Broadcast والـ usable range؟',
              options: [
                'Network `.1`، Broadcast `.254`، Usable `.2 – .253`',
                'Network `.0`، Broadcast `.255`، Usable `.1 – .254`',
                'Network `.0`، Broadcast `.254`، Usable `.1 – .253`',
                'Network `.255`، Broadcast `.0`، Usable `.1 – .254`',
              ],
              correctIndex: 1,
              requireSubmit: true,
              explanation:
                'الصح هو **(B)**: في /24 كل الـ host bits في الـ network address بصفر (`.0`)، وفي الـ broadcast بـ 1 (`.255`). أول usable بعد الـ network (`.1`) وآخر usable قبل الـ broadcast (`.254`). الإجمالي 256 والـ usable 254.',
            },
            {
              id: 'q4',
              prompt: 'لو قسّمنا `192.168.1.0/24` لـ `/27`، إيه عدد الشبكات وعدد الـ usable hosts في كل شبكة والـ block size؟',
              options: [
                '4 subnets · 62 usable · block 64',
                '16 subnets · 14 usable · block 16',
                '8 subnets · 30 usable · block 32',
                '2 subnets · 126 usable · block 128',
              ],
              correctIndex: 2,
              requireSubmit: true,
              explanation:
                'الصح هو **(C)**: Borrowed = `27 - 24 = 3` فالعدد `2^3 = 8`. Host bits = `32 - 27 = 5` فالعنوان `2^5 = 32` والـ usable `30`. الماسك `255.255.255.224` والـ block size `256 - 224 = 32`.',
            },
            {
              id: 'q5',
              prompt: 'VLSM من `192.168.10.0/24`: Department A محتاج 100 host. إيه أول subnet صح، وليه؟',
              options: [
                '`192.168.10.0/25` بماسك `255.255.255.128`، لأن 7 host bits بتدي 128 عنوان (126 usable)',
                '`192.168.10.0/26` بماسك `255.255.255.192`، لأن 64 عنوان كافية لـ 100',
                '`192.168.10.128/25`، لأن لازم نبدأ من نص النطاق دايماً',
                '`192.168.10.0/24`، لأن VLSM مش بيغيّر الماسك',
              ],
              correctIndex: 0,
              requireSubmit: true,
              explanation:
                'الصح هو **(A)**: في VLSM نبدأ بالأكبر. 100 host محتاجين `2^h >= 102`، فـ `h = 7` لأن `2^7 = 128` و`126 usable` — يعني prefix `32 - 7 = 25`. نبدأ من أول عنوان متاح `.0`، فالشبكة `192.168.10.0/25`. **(B)** مش كفاية، **(C)** غلط في نقطة البداية، **(D)** غلط لأن VLSM بيغيّر الماسك.',
            },
          ],
        },
      ],
    },
    {
      id: 'summary',
      title: 'الخلاصة والنقاط المهمة',
      short: 'خلاصة',
      blocks: [
        {
          type: 'table',
          headers: ['المفهوم', 'احفظ كده'],
          rows: [
            ['IPv4 structure', '32 bit = 4 octets × 8 bits، dotted decimal، كل octet 0–255'],
            ['Binary weights', '128 · 64 · 32 · 16 · 8 · 4 · 2 · 1'],
            ['Conversion', 'Binary → decimal: اجمع weights للبتات 1. Decimal → binary: قارن من الأكبر.'],
            ['Network ID', 'نتيجة AND بين IP والماسك؛ كل الـ host bits = 0'],
            ['Host ID', 'الجزء اللي الماسك سابه host'],
            ['Subnet Mask', '1s متتابعة للـ network و 0s متتابعة للـ host'],
            ['CIDR', '`/p` يعني p network bits و `32 - p` host bits'],
            ['Total addresses', '`2^h`'],
            ['Usable hosts', '`2^h - 2` في الشبكات العادية، مع استثناء /31 و /32'],
            ['Network / Broadcast', 'أول وآخر عنوان في الـ subnet'],
            ['Block size', '`256 - last mask octet` في الـ octet اللي اتغير'],
            ['Subnetting', 'Borrowed `n` → `2^n` subnets، host bits `h` → `2^h` عناوين'],
            ['FLSM', 'نفس الماسك لكل الشبكات — بسيط بس ممكن يضيّع عناوين'],
            ['VLSM', 'ماسك مختلف لكل شبكة — رتّب من الأكبر للأصغر'],
            ['Classful', 'A /8، B /16، C /24، D multicast، E محجوز — معلومات تاريخية'],
          ],
        },
        {
          type: 'table',
          headers: ['الأمر', 'الاستخدام'],
          rows: [
            ['`show ip interface brief`', 'حالة الواجهة وعنوان IP'],
            ['`show running-config`', 'الإعداد الفعلي'],
            ['`show ip route`', 'الشبكات المتصلة والمسارات'],
            ['`show interfaces`', 'تفاصيل وعدّادات الواجهة'],
            ['`ping`', 'اختبار الوصول الأساسي'],
            ['`traceroute`', 'تتبع المسار hop بـ hop'],
            ['`encapsulation dot1q <vlan>`', 'ربط subinterface بـ VLAN في router-on-a-stick'],
            ['`ip routing`', 'تفعيل التوجيه على Layer 3 switch'],
          ],
        },
        {
          type: 'table',
          headers: ['فخ امتحاني', 'الإجابة الصح'],
          rows: [
            ['"IPv4.address 48 bit"', 'لا — IPv4 32 bit و MAC 48 bit'],
            ['"Octet ممكن يكون 256"', 'لا — أقصى قيمة 255'],
            ['"الماسك يبدأ بـ 0 وبعدين 1"', 'لا — 1s متتابعة ثم 0s متتابعة'],
            ['"ACK number" في IP', 'مفيش — ACK/tcp concept، هنا بنحسب network/broadcast'],
            ['"Broadcast = 254 في /24"', 'لا — 254 آخر usable، والـ broadcast 255'],
            ['"Network address بتتخصّص لPC"', 'لا — في الشبكة العادية مش بتتخصّص'],
            ['"2^h - 2 دايماً حتى /31 و /32"', 'لا — دول استثناءات'],
            ['"Block size دايماً في آخر octet"', 'لا — في الـ octet اللي اتغير في الماسك'],
            ['"VLSM يبدأ بالأصغر"', 'لا — يبدأ بالأكبر'],
            ['"Class C يعني /26 دايماً"', 'لا — Class C الافتراضي /24، و CIDR بيسمح بأي prefix'],
            ['"Ping فاشل يعني ماسك غلط دايماً"', 'لا — ممكن gateway أو VLAN أو interface down أو duplicate IP'],
            ['"Router-on-a-stick محتاج كابلين"', 'لا — كابل trunk واحد ومعاه subinterfaces'],
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'جملة تلخّص بيها الدرس كله',
          text: 'الـ IP بيقول لمين Packet رايح، والماسك بيقول أنهي جزء من العنوان network وأنهي جزء host. من الـ prefix نحسب حجم الشبكة، ومن حجم الشبكة نحسب الـ block size، ومنه نطلع كل الشبكات والـ broadcast والـ usable range. لو حجم الشبكات مختلف، استخدم VLSM وابدأ بالأكبر.',
        },
      ],
    },
  ],
}
