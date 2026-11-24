import type { Lesson } from '../types'

const mgmtFundRows: string[][] = [
  ['Local management', 'وصول مباشر إلى الجهاز', 'Console cable عند الإعداد الأولي', 'لا يحتاج IP'],
  ['Remote management', 'وصول عبر الشبكة', 'SSH من محطة مسؤول', 'يحتاج IP ومساراً عاملاً'],
  ['Configuration', 'تغيير إعدادات الجهاز', 'إضافة VLAN أو user', 'يؤثر على سلوك الجهاز'],
  ['Monitoring', 'مراقبة الحالة والأداء', 'show commands / syslog', 'لا يغيّر الإعداد عادةً'],
  ['Troubleshooting', 'تشخيص الأعطال', 'فحص SSH/AAA/interfaces', 'قد يستخدم local أو remote'],
]

const inBandOutRows: string[][] = [
  ['Network path', 'Production network', 'Separate management path'],
  ['IP connectivity', 'Uses production network connectivity', 'Uses dedicated management connectivity where applicable'],
  ['Availability', 'May be affected by production network failure', 'Can remain available if the separate path is operational'],
  ['Use case', 'Normal remote administration', 'Recovery and emergency access'],
]

const telnetSshRows: string[][] = [
  ['TCP Port', '23', '22'],
  ['Encryption', 'No', 'Yes'],
  ['Credentials', 'Transmitted without encryption', 'Protected by encrypted session'],
  ['Security', 'Insecure', 'Secure when properly configured'],
  ['Recommended use', 'Legacy/testing environments', 'Secure remote administration'],
]

const httpHttpsRows: string[][] = [
  ['Protocol', 'HTTP', 'HTTPS'],
  ['TCP Port', '80', '443'],
  ['Encryption', 'No', 'Yes (TLS)'],
  ['GUI use', 'Legacy or lab only', 'Preferred for browser management'],
  ['Risk', 'Credentials/data readable', 'Protected session when configured correctly'],
]

const aaaRows: string[][] = [
  ['Authentication', 'Who are you?', 'Username/password or other supported method', 'Login success/fail'],
  ['Authorization', 'What are you allowed to do?', 'Privilege level, commands, resources', 'Can run show but not configure'],
  ['Accounting', 'What did you do?', 'Session and command records', 'Audit trail for changes'],
]

const tacacsRadiusRows: string[][] = [
  ['Transport', 'TCP', 'UDP'],
  ['Common Ports', 'TCP 49', 'UDP 1812 / 1813'],
  ['Origin', 'Cisco-developed', 'IETF standard'],
  ['Encryption', 'Encrypts the packet body; header remains visible', 'Traditionally protects the password field rather than the entire packet'],
  ['AAA Separation', 'Separates Authentication, Authorization, Accounting', 'Authentication and authorization are more closely coupled'],
  ['Common Use', 'Network device administration', 'Network access authentication'],
]

const verificationRows: string[][] = [
  ['`show users`', 'يعرض الجلسات النشطة وخطوط الدخول', 'معرفة من المتصل الآن عبر console/VTY'],
  ['`show line`', 'يعرض حالة خطوط console/VTY/AUX', 'التحقق من توفر خطوط VTY'],
  ['`show ip ssh`', 'يعرض حالة SSH والإصدار', 'التأكد من تفعيل SSHv2'],
  ['`show ssh`', 'يعرض جلسات SSH النشطة', 'التحقق من اتصال مسؤول فعلي'],
  ['`show running-config`', 'يعرض التكوين الجاري', 'مراجعة username وVTY وAAA وHTTP/SSH'],
  ['`show aaa servers`', 'يعرض حالة خوادم AAA', 'التحقق من الوصول لخادم TACACS+/RADIUS'],
  ['`show tacacs`', 'إحصاءات TACACS+ حسب المنصة', 'تشخيص مشاكل TACACS+'],
  ['`show radius statistics`', 'إحصاءات RADIUS', 'تشخيص فشل/نجاح طلبات RADIUS'],
]

const troubleRows: string[][] = [
  ['Using Telnet instead of SSH', 'استخدم `transport input ssh` وتحقق بـ `show ip ssh`'],
  ['Missing hostname/domain before RSA key', 'اضبط `hostname` و`ip domain-name` ثم أنشئ المفاتيح'],
  ['Missing RSA keys', 'نفّذ `crypto key generate rsa modulus 2048`'],
  ['SSH version mismatch', 'اضبط `ip ssh version 2` وتحقق من دعم العميل'],
  ['Incorrect VTY config', 'راجع `line vty 0 15`, `login local`, `transport input`'],
  ['Missing local username', 'أضف `username ... secret ...` أو أصلح AAA'],
  ['Accidentally permitting Telnet', 'احذف telnet من `transport input`'],
  ['Incorrect HTTP/HTTPS config', 'راجع `ip http secure-server` ودعم المنصة'],
  ['AAA server unreachable', 'تحقق من IP/route/ports و`show aaa servers`'],
  ['Auth succeeds but authorization fails', 'راجع سياسات authorization على الخادم والجهاز'],
]

const workflowSteps = [
  { title: '1', text: 'تحقق من IP connectivity لإدارة الجهاز.' },
  { title: '2', text: 'تحقق من الاتصال الفيزيائي وVLAN/SVI المناسب للإدارة.' },
  { title: '3', text: 'حدد طريقة الوصول: Console أو SSH أو HTTPS.' },
  { title: '4', text: 'تحقق من إعداد SSH ومفاتيح RSA والإصدار.' },
  { title: '5', text: 'افحص إعداد VTY lines وtransport input.' },
  { title: '6', text: 'تحقق من حسابات المستخدم المحلية أو طريقة login.' },
  { title: '7', text: 'افحص إمكانية الوصول لخادم AAA.' },
  { title: '8', text: 'راجع فشل authentication وauthorization.' },
  { title: '9', text: 'تحقق من المنافذ والبروتوكولات: 22/23/80/443/49/1812/1813.' },
  { title: '10', text: 'راجع إعدادات أمان الإدارة ووقت انتهاء الجلسة.' },
]

export const topic28Lesson: Lesson = {
  topicId: '2.8',
  title: 'Describe network device management access (Telnet, SSH, HTTP, HTTPS, console, TACACS+/RADIUS, and cloud managed)',
  description:
    'Topic 2.8 يغطي وصول إدارة أجهزة الشبكة: in-band وout-of-band، Console/AUX، Telnet وSSH، HTTP وHTTPS، AAA، TACACS+ وRADIUS، مع أمثلة Cisco IOS تعليمية وتمارين مفاهيمية. الأوامر والمخرجات أمثلة تمثيلية وليست من أجهزة حقيقية. Topic 2.9 لم يُفتح.',
  estimatedTime: '~120 دقيقة',
  steps: [
    {
      id: 'what',
      title: 'Network Device Management Fundamentals',
      short: 'أساسيات إدارة الأجهزة',
      blocks: [
        { type: 'paragraph', text: '**Network Device Management** هو الوصول إلى أجهزة الشبكة لتهيئتها ومراقبتها واستكشاف أخطائها وتأمينها. هذا مختلف عن تمرير حركة المستخدمين عبر الجهاز. إدارة الجهاز تعني التعامل مع **management plane**، بينما تمرير بيانات المستخدمين يحدث في **data plane** أو forwarding plane بشكل مفاهيمي.' },
        { type: 'diagram', id: 'network-device-management-overview', caption: 'نظرة عامة: مسؤول يدير Switch وRouter وWLC، بينما حركة المستخدمين شيء منفصل.' },
        { type: 'table', headers: ['المفهوم', 'المعنى', 'مثال', 'ملاحظة'], rows: mgmtFundRows },
        { type: 'list', items: [
          '**Local management**: وصول مباشر بجانب الجهاز، غالباً Console.',
          '**Remote management**: وصول عبر الشبكة باستخدام SSH أو HTTPS أو أدوات مركزية.',
          '**Device configuration**: تغيير hostname أو VLANs أو users أو policies.',
          '**Monitoring and troubleshooting**: فحص الحالة، السجلات، الجلسات، والأخطاء.',
          'يمكن تطبيق هذه المفاهيم على Cisco Switch أو Router أو WLC، وقد تختلف الواجهة والأوامر حسب المنصة.',
        ]},
        { type: 'callout', tone: 'info', title: 'Cloud managed', text: 'بعض الأجهزة تُدار عبر لوحة سحابية. هذا يبقى وصول إدارة device management، لكنه يعتمد على اتصال الجهاز بخدمة السحابة وسياسات المنصة؛ وهو مختلف عن تمرير حركة بيانات المستخدمين.' },
      ],
    },
    {
      id: 'how',
      title: 'In-Band vs Out-of-Band Management',
      short: 'In-band وOut-of-band',
      blocks: [
        { type: 'paragraph', text: 'هناك طريقتان شائعتان للوصول الإداري: **In-Band** عبر شبكة الإنتاج نفسها، و**Out-of-Band (OOB)** عبر مسار منفصل. In-band مناسب للإدارة اليومية لكنه يعتمد على صحة شبكة الإنتاج. OOB مفيد للاسترداد والطوارئ، لكنه لا يزال يحتاج إلى مسار فيزيائي وكهرباء عاملين.' },
        { type: 'diagram', id: 'in-band-management-path', caption: 'In-band: SSH/HTTPS يمران عبر شبكة الإنتاج.' },
        { type: 'diagram', id: 'out-of-band-management-path', caption: 'Out-of-band: مسار إدارة منفصل يمكن أن يبقى متاحاً عند تعطل الإنتاج.' },
        { type: 'table', headers: ['Feature', 'In-Band', 'Out-of-Band'], rows: inBandOutRows },
        { type: 'callout', tone: 'warning', title: 'OOB ليس سحراً', text: 'Out-of-band management يحتاج أيضاً بنية تحتية عاملة: كابل، منفذ إدارة، console server، شبكة management، وطاقة. إذا تعطل المسار المنفصل نفسه فلن يعمل.' },
      ],
    },
    {
      id: 'packet',
      title: 'Console and AUX Access',
      short: 'Console وAUX',
      blocks: [
        { type: 'paragraph', text: '**Console port** هو منفذ وصول محلي مباشر للجهاز. يستخدم للإعداد الأولي والاسترداد عندما لا يكون للجهاز IP أو عندما يفشل الوصول البعيد. الاتصال يكون بكابل console أو USB console حيثما كان مدعوماً، مع برنامج Terminal Emulator.' },
        { type: 'diagram', id: 'console-connection', caption: 'اتصال Console محلي عبر كابل console وterminal emulator.' },
        { type: 'list', items: [
          'إعدادات serial شائعة: **9600 baud, 8 data bits, no parity, 1 stop bit, no flow control** (9600 8N1).',
          'هذه قيم افتراضية شائعة في Cisco، لكنها قد تختلف حسب الجهاز أو الإعداد.',
          'Console مفيد عند: عدم وجود IP configuration، تعطل remote access، خطأ في إعداد الشبكة، أو الحاجة للاسترداد الأولي.',
        ]},
        { type: 'paragraph', text: '**Auxiliary Port (AUX port)** هو منفذ إدارة كان يستخدم تاريخياً للوصول عن بُعد عبر modem كنوع من out-of-band access. يختلف عن Console لأنه لم يكن اتصالاً محلياً مباشراً عادةً، بل عبر خط dial-up/modem في التصاميم القديمة.' },
        { type: 'diagram', id: 'aux-modem-access', caption: 'AUX وصول تاريخي عبر modem؛ توفره يعتمد على المنصة.' },
        { type: 'callout', tone: 'warning', title: 'AUX ليس عاماً', text: 'ليس كل جهاز Cisco يحتوي AUX port. كثير من الأجهزة الحديثة لا توفره، لذلك لا تقدمه كميزة موجودة دائماً.' },
      ],
    },
    {
      id: 'config',
      title: 'Telnet and SSH Remote Management',
      short: 'Telnet وSSH',
      blocks: [
        { type: 'paragraph', text: '**Telnet** يوفر وصول CLI عن بُعد عبر **TCP port 23** باستخدام VTY lines. المشكلة أنه يرسل البيانات وبيانات الاعتماد بدون تشفير، لذلك هو غير آمن على الشبكات غير الموثوقة. **SSH** يوفر نفس فكرة الوصول البعيد للـ CLI لكن عبر جلسة مشفرة على **TCP port 22**.' },
        { type: 'diagram', id: 'telnet-plaintext-communication', caption: 'Telnet: بيانات الاعتماد والأوامر يمكن قراءتها بدون تشفير.' },
        { type: 'diagram', id: 'ssh-encrypted-communication', caption: 'SSH: جلسة مشفرة تحمي confidentiality وintegrity.' },
        { type: 'table', headers: ['Feature', 'Telnet', 'SSH'], rows: telnetSshRows },
        { type: 'list', items: [
          'SSH version 2 هو الموصى به.',
          'SSH يوفر confidentiality وintegrity ومصادقة آمنة للجلسة.',
          'Public-key cryptography يستخدم في تأسيس هوية/مفاتيح بشكل مفاهيمي؛ التفاصيل تعتمد على المنصة.',
          'لا تستخدم Telnet للإدارة الآمنة عبر شبكات غير موثوقة؛ استخدم SSH.',
        ]},
        { type: 'callout', tone: 'danger', title: 'أمان Telnet', text: 'Telnet ينقل username وpassword والأوامر بدون تشفير. أي شخص يلتقط الحركة قد يقرأها. في الشبكات الحديثة استخدم SSH.' },
      ],
    },
    {
      id: 'verify',
      title: 'HTTP and HTTPS Management',
      short: 'HTTP وHTTPS',
      blocks: [
        { type: 'paragraph', text: 'بعض أجهزة الشبكة توفر إدارة عبر المتصفح **Web GUI**. **HTTP** يستخدم TCP port 80 ولا يشفر الجلسة، بينما **HTTPS** يستخدم TCP port 443 ويحمي الاتصال باستخدام **TLS**. لذلك HTTPS هو الخيار المفضل.' },
        { type: 'diagram', id: 'http-vs-https-management', caption: 'HTTP غير مشفر؛ HTTPS محمي بـ TLS.' },
        { type: 'diagram', id: 'cli-vs-web-gui-management', caption: 'CLI مقابل Web GUI: واجهتان لإدارة نفس الجهاز.' },
        { type: 'table', headers: ['Protocol', 'HTTP', 'HTTPS'], rows: httpHttpsRows },
        { type: 'list', items: [
          'CLI مناسب للأوامر الدقيقة، automation، وtroubleshooting.',
          'Web GUI مناسب للمهام المرئية والإعدادات السريعة حسب المنصة.',
          'ليس كل جهاز Cisco IOS يوفر نفس قدرات Web management.',
          'توفر أوامر `ip http server` و`ip http secure-server` يعتمد على المنصة والميزات.',
        ]},
        { type: 'callout', tone: 'warning', title: 'اعتماد المنصة', text: 'لا تفترض أن كل جهاز Cisco لديه GUI إدارة ويب أو نفس خيارات HTTP/HTTPS. تحقق من قدرات الجهاز والإصدار.' },
      ],
    },
    {
      id: 'mistakes',
      title: 'Authentication, Authorization, and Accounting (AAA)',
      short: 'AAA',
      blocks: [
        { type: 'paragraph', text: '**AAA** هو إطار أمني لإدارة الوصول: **Authentication** يثبت الهوية، **Authorization** يحدد الصلاحيات، و**Accounting** يسجل النشاط. يمكن تنفيذ AAA محلياً على الجهاز أو مركزياً عبر خادم AAA.' },
        { type: 'diagram', id: 'aaa-authentication-flow', caption: 'تدفق AAA: طلب دخول، تحقق، صلاحيات، وتسجيل.' },
        { type: 'diagram', id: 'aaa-authn-authz-acct', caption: 'الفرق بين Authentication وAuthorization وAccounting.' },
        { type: 'table', headers: ['AAA Component', 'Question', 'Example', 'Outcome'], rows: aaaRows },
        { type: 'list', items: [
          '**Local authentication**: المستخدمون وكلمات المرور مخزنة على الجهاز نفسه.',
          '**Centralized authentication**: الجهاز يرسل طلبات AAA إلى خادم مركزي مثل TACACS+ أو RADIUS.',
          'المؤسسات تستخدم AAA لتوحيد السياسة، تقليل أخطاء الإدارة، وتحسين التدقيق.',
          'يجب التخطيط لتوفر خادم AAA وخيارات fallback عند تعطل الخادم.',
        ]},
        { type: 'callout', tone: 'info', title: 'مثال واقعي', text: 'مسؤول يدخل بـ SSH: Authentication يتحقق من كلمة المرور، Authorization يسمح له بتشغيل أوامر show فقط، Accounting يسجل أنه دخل الساعة 10:05 ونفّذ `show running-config`.' },
      ],
    },
    {
      id: 'lab',
      title: 'TACACS+ vs RADIUS',
      short: 'TACACS+ وRADIUS',
      blocks: [
        { type: 'paragraph', text: '**TACACS+** و**RADIUS** بروتوكولا AAA مركزيان. TACACS+ شائع لإدارة أجهزة الشبكة ويستخدم TCP port 49 ويفصل AAA. RADIUS شائع لمصادقة الوصول للشبكة ويستخدم UDP 1812/1813، وله سلوك تقليدي مختلف في التشفير واقتران AuthN/AuthZ.' },
        { type: 'diagram', id: 'tacacs-plus-architecture', caption: 'TACACS+: TCP 49، فصل AAA، مناسب لإدارة الأجهزة.' },
        { type: 'diagram', id: 'radius-architecture', caption: 'RADIUS: UDP 1812/1813، شائع لوصول الشبكة.' },
        { type: 'diagram', id: 'tacacs-vs-radius-comparison', caption: 'مقارنة مباشرة بين TACACS+ وRADIUS.' },
        { type: 'diagram', id: 'local-vs-centralized-authentication', caption: 'مصادقة محلية مقابل مركزية مع اعتبار fallback.' },
        { type: 'table', headers: ['Feature', 'TACACS+', 'RADIUS'], rows: tacacsRadiusRows },
        { type: 'callout', tone: 'danger', title: 'دقة مهمة', text: 'لا تقل إن RADIUS التقليدي يشفر الحزمة كاملة؛ تقليدياً يحمي حقل كلمة المرور أكثر من بقية الحزمة. أيضاً TACACS+ ليس حصرياً على أجهزة Cisco، رغم أنه شائع في بيئات Cisco.' },
        { type: 'list', items: [
          'TACACS+ يدعم command-level authorization بشكل قوي لإدارة الأجهزة.',
          'RADIUS شائع في 802.1X وVPN وnetwork access scenarios.',
          'الانتشارات الحديثة لـ RADIUS قد تضيف حماية إضافية مثل IPsec/TLS حسب التصميم، لكن هذا يعتمد على التنفيذ.',
        ]},
      ],
    },
    {
      id: 'exam',
      title: 'Cisco IOS Management Configuration and Verification',
      short: 'إعدادات والتحقق',
      blocks: [
        { type: 'paragraph', text: 'الأمثلة التالية تعليمية وتمثيلية. الصيغة الدقيقة قد تختلف حسب منصة Cisco IOS/IOS XE والإصدار. لا تفترض أن كل أمر متاح على كل جهاز.' },
        { type: 'code', label: 'Local username and password - educational example', language: 'text', code: `configure terminal

username admin privilege 15 secret StrongPassword123

enable secret EnablePassword123
service password-encryption

end` },
        { type: 'list', items: [
          '`username ... privilege 15 secret ...` ينشئ حساباً محلياً بصلاحية عالية وكلمة مرور مشفرة بشكل أقوى في التكوين.',
          '`enable secret` يحمي وضع privileged EXEC.',
          '`secret` أفضل من `password` لأنه يستخدم hashing أقوى من التشفير البسيط القديم.',
          '`service password-encryption` يموّه كلمات المرور النصية المدعومة في التكوين، لكنه **ليس** حماية قوية حديثة.',
        ]},
        { type: 'code', label: 'Configure SSH - educational example', language: 'text', code: `configure terminal

hostname SW1
ip domain-name example.local

username admin privilege 15 secret StrongPassword123

crypto key generate rsa modulus 2048

ip ssh version 2

line vty 0 15
 login local
 transport input ssh

end` },
        { type: 'code', label: 'Configure console access - educational example', language: 'text', code: `line console 0
 login local
 exec-timeout 5 0
 logging synchronous` },
        { type: 'code', label: 'Configure VTY access - educational example', language: 'text', code: `line vty 0 15
 login local
 transport input ssh
 exec-timeout 10 0` },
        { type: 'code', label: 'Configure HTTP and HTTPS - educational example', language: 'text', code: `ip http server
ip http secure-server` },
        { type: 'paragraph', text: 'HTTP/HTTPS يعتمد على قدرات الجهاز. HTTPS مفضل لأنه يستخدم TLS. في كثير من البيئات يتم تعطيل HTTP واستخدام HTTPS فقط إذا كانت الإدارة عبر الويب مطلوبة.' },
        { type: 'code', label: 'Configure AAA - local educational example', language: 'text', code: `aaa new-model

aaa authentication login default local
aaa authorization exec default local` },
        { type: 'paragraph', text: 'لـ TACACS+/RADIUS المركزي، الصيغة الدقيقة تختلف حسب IOS/IOS XE والخادم. مثال مفاهيمي فقط: تعريف server/group، ثم ربط method list بـ TACACS+ أو RADIUS مع fallback محلي مناسب. لا تفترض أمراً واحداً يعمل كما هو على كل منصة.' },
        { type: 'table', headers: ['Command', 'What it verifies', 'Use case'], rows: verificationRows },
        { type: 'paragraph', text: '**Representative educational outputs - not captured from real Cisco hardware**' },
        { type: 'code', label: 'show ip ssh / show ssh / show users - educational', language: 'text', code: `SW1# show ip ssh
SSH Enabled - version 2.0
Authentication timeout: 120 secs; Authentication retries: 3

SW1# show ssh
Connection Version Mode  Encryption  Hmac         State          Username
0          2.0     IN    aes256-ctr  hmac-sha2-256 Session started admin

SW1# show users
    Line       User       Host(s)              Idle       Location
*  1 vty 0     admin      idle                 00:00:00   10.10.10.50
   con 0                 idle                 00:02:15` },
        { type: 'code', label: 'show aaa servers / show tacacs / show radius statistics - educational', language: 'text', code: `SW1# show aaa servers
RADIUS: id 1, priority 1, host 192.0.2.10, auth-port 1812, acct-port 1813
State: current UP, duration 3600s

SW1# show tacacs
Tacacs+ Server - 192.0.2.20/49  open=2  closes=1  aborts=0  errors=0

SW1# show radius statistics
Auth: access-requests 5  access-accepts 4  access-rejects 1
Acct: accounting-requests 3  accounting-responses 3` },
        { type: 'callout', tone: 'danger', title: 'مخرجات تعليمية', text: 'المخرجات أعلاه تمثيلية وليست لقطات من أجهزة Cisco حقيقية. الحقول والأوامر المتاحة تختلف حسب IOS/IOS XE والمنصة.' },
      ],
    },
    {
      id: 'summary',
      title: 'Security, Troubleshooting, Practical Labs, and CCNA Exam Review',
      short: 'الأمان واللابات والمراجعة',
      blocks: [
        { type: 'paragraph', text: '**Common mistakes**' },
        { type: 'table', headers: ['المشكلة', 'التصحيح'], rows: troubleRows },
        { type: 'paragraph', text: '**Troubleshooting workflow**' },
        { type: 'steps', items: workflowSteps },
        { type: 'paragraph', text: '**Lab 1 - Secure a Cisco Switch with SSH (Packet Tracer-style / conceptual)**' },
        { type: 'steps', items: [
          { title: 'Topology', text: 'Cisco Switch واحد، Admin PC، اتصال Ethernet عبر شبكة إدارة. التمرين مفاهيمي/Packet Tracer-style ولم يُنفذ على أجهزة حقيقية.' },
          { title: 'Task 1-3', text: 'اضبط hostname وdomain name وأنشئ حساب مسؤول محلي.' },
          { title: 'Task 4-5', text: 'ولّد RSA keys وفعّل SSH version 2.' },
          { title: 'Task 6-7', text: 'اضبط VTY lines بـ `login local` و`transport input ssh`.' },
          { title: 'Task 8-9', text: 'تحقق بـ `show ip ssh` و`show ssh` واختبر الوصول مفاهيمياً.' },
          { title: 'Expected result', text: 'SSH يعمل، وTelnet غير مسموح على VTY lines المُهيأة.' },
        ]},
        { type: 'paragraph', text: '**Lab 2 - AAA Fundamentals (conceptual)**' },
        { type: 'steps', items: [
          { title: 'Scenario', text: 'Network administrator، Cisco switch، وcentral AAA server.' },
          { title: 'Tasks', text: 'اشرح Authentication وAuthorization وAccounting، وقارن local vs centralized authentication.' },
          { title: 'TACACS+/RADIUS', text: 'اشرح command authorization في TACACS+ وقارن مع RADIUS.' },
          { title: 'Failure case', text: 'حدد ماذا يحدث إذا تعطل AAA server ولم تكن هناك fallback policy مناسبة.' },
        ]},
        { type: 'paragraph', text: '**Lab 3 - Management Access Security (optional, conceptual)**' },
        { type: 'steps', items: [
          { title: 'Compare', text: 'Console، Telnet، SSH، HTTP، HTTPS.' },
          { title: 'Choose', text: 'Initial setup = Console؛ Secure remote CLI = SSH؛ Browser-based management = HTTPS؛ Emergency when IP unavailable = Console/OOB.' },
        ]},
        { type: 'callout', tone: 'warning', title: 'الأمانة التعليمية', text: 'اللابات conceptual أو Packet Tracer-style ولم تُنفذ. Packet Tracer قد لا يدعم كل ميزات AAA server أو كل أوامر الإدارة لكل منصة.' },
        { type: 'list', items: [
          'In-band يستخدم شبكة الإنتاج؛ Out-of-band يستخدم مساراً منفصلاً لكنه ما زال يحتاج بنية تحتية عاملة.',
          'Console هو الأفضل للإعداد الأولي والاسترداد؛ إعداداته الشائعة 9600 8N1.',
          'Telnet TCP 23 غير مشفر؛ SSH TCP 22 مشفر وهو الموصى به.',
          'HTTP TCP 80 غير مشفر؛ HTTPS TCP 443 يستخدم TLS وهو المفضل.',
          'AAA: Authentication = من أنت، Authorization = ماذا تستطيع، Accounting = ماذا فعلت.',
          'TACACS+ TCP 49 يفصل AAA وغالباً لإدارة الأجهزة؛ RADIUS UDP 1812/1813 شائع لوصول الشبكة ولا يشفر الحزمة كاملة تقليدياً.',
          '`service password-encryption` ليس حماية قوية؛ `secret` أفضل من password بسيط.',
        ]},
        { type: 'paragraph', text: '**اختبار CCNA**' },
        { type: 'paragraph', text: '5 أسئلة، 4 خيارات لكل سؤال، ومزيج من single-choice وmultiple-select. قبل الإرسال لا تظهر الإجابة؛ بعد الإرسال يظهر الشرح وتتقفل الخيارات ويختفي زر التحقق.' },
        { type: 'quiz', questions: [
          {
            id: 'q1',
            prompt: 'Which statement best describes in-band management?',
            options: [
              'It uses the production network for device management traffic and depends on production network connectivity.',
              'It always uses a dedicated console server and never needs IP connectivity.',
              'It is available even if the device has no power.',
              'It encrypts all management traffic by default.',
            ],
            correctIndex: 0,
            requireSubmit: true,
            explanation: 'الصح هو **(A)**. In-band management يمر عبر شبكة الإنتاج ويعتمد على اتصالها. OOB هو الذي يستخدم مساراً منفصلاً، ولا يوجد تشفير افتراضي لمجرد كون الإدارة in-band.',
          },
          {
            id: 'q2',
            prompt: 'Why is SSH preferred over Telnet for remote CLI management?',
            options: [
              'SSH encrypts the management session, while Telnet sends data in plaintext.',
              'Telnet uses TCP port 22 and SSH uses TCP port 23.',
              'SSH cannot use VTY lines.',
              'Telnet provides stronger integrity protection than SSH.',
            ],
            correctIndex: 0,
            requireSubmit: true,
            explanation: 'الصح هو **(A)**. SSH يستخدم TCP 22 ويوفر جلسة مشفرة، بينما Telnet يستخدم TCP 23 ويرسل البيانات بدون تشفير.',
          },
          {
            id: 'q3',
            prompt: 'Which statement about HTTP and HTTPS device management is correct?',
            options: [
              'HTTPS uses TLS on TCP port 443 and is preferred over HTTP on TCP port 80.',
              'HTTP is encrypted by default on Cisco devices.',
              'HTTPS uses UDP port 443.',
              'Every Cisco IOS device has the same web GUI features.',
            ],
            correctIndex: 0,
            requireSubmit: true,
            explanation: 'الصح هو **(A)**. HTTPS يستخدم TCP 443 مع TLS، وHTTP يستخدم TCP 80 بدون تشفير. قدرات web GUI تعتمد على المنصة.',
          },
          {
            id: 'q4',
            kind: 'multiple',
            prompt: 'Which statements about AAA are correct? (Choose more than one.)',
            options: [
              'Authentication verifies identity.',
              'Authorization determines what actions are permitted.',
              'Accounting records user activity and sessions.',
              'Accounting replaces the need for authentication.',
            ],
            correctIndices: [0, 1, 2],
            requireSubmit: true,
            explanation: 'الصح هو **(A) و(B) و(C)**. Authentication = من أنت، Authorization = ماذا يُسمح لك، Accounting = ماذا فعلت. Accounting لا يستبدل المصادقة.',
          },
          {
            id: 'q5',
            kind: 'multiple',
            prompt: 'Which statements correctly compare TACACS+ and RADIUS? (Choose more than one.)',
            options: [
              'TACACS+ uses TCP port 49 and separates AAA functions.',
              'RADIUS commonly uses UDP ports 1812 and 1813.',
              'Traditional RADIUS protects the password field rather than encrypting the entire packet.',
              'RADIUS encrypts the entire packet body in the same way TACACS+ does by default.',
            ],
            correctIndices: [0, 1, 2],
            requireSubmit: true,
            explanation: 'الصح هو **(A) و(B) و(C)**. TACACS+ يستخدم TCP 49 ويفصل AAA. RADIUS يستخدم UDP 1812/1813 وتقليدياً يحمي كلمة المرور أكثر من تشفير الحزمة كاملة؛ لذلك D غير صحيحة.',
          },
        ]},
      ],
    },
  ],
}