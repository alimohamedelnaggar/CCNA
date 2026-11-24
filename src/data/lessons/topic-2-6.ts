import type { Lesson } from '../types'

const wlanComponentRows: string[][] = [
  ['Wireless Client', 'يتصل بـ SSID ويرسل/يستقبل إطارات 802.11', 'حركة التطبيق تبدأ وتنتهي عند العميل', 'لابتوب، هاتف، جهاز IoT'],
  ['Access Point (AP)', 'ينهي رابط الراديو ويحوّل 802.11 إلى Ethernet', 'يرسل إطارات العميل إلى الشبكة السلكية', 'AP مركزي أو lightweight'],
  ['Access Switch', 'يوفر اتصال Layer 2 وPoE للـ APs', 'ينقل حركة APs والـ WLC داخل الـ VLANs', 'access/trunk ports حسب التصميم'],
  ['WLC', 'يدير الـ APs والسياسات ويراقب العملاء', 'قد يمرر حركة العميل في central switching', 'ليس مطلوباً في autonomous architecture'],
  ['Core Network', 'يوفر routing وservices ووصولاً للإنترنت', 'وجهة حركة العملاء بعد الممرات السلكية', 'DHCP، DNS، default gateway'],
]

const apCompareRows: string[][] = [
  ['Configuration location', 'على كل AP بشكل مستقل', 'على الـ WLC ويُرسل إلى الـ AP'],
  ['WLC requirement', 'غير مطلوب للتشغيل الطبيعي', 'مطلوب للإدارة والتشغيل المعتاد'],
  ['Management style', 'موزّع، فردي', 'مركزي'],
  ['Scaling', 'يصعب مع كثرة الـ APs', 'أنسب للشبكات الكبيرة'],
  ['Consistency', 'يعتمد على التكوين اليدوي', 'سياسة واحدة تُطبق على عدة APs'],
  ['Typical use', 'مكتب صغير أو APs قليلة', 'الحرم الجامعي والمؤسسات'],
]

const architectureRows: string[][] = [
  ['Autonomous', 'Autonomous AP', 'محلي على كل AP', 'من AP إلى الشبكة السلكية', 'مواقع صغيرة أو APs قليلة', 'لا يوجد WLC إلزامي'],
  ['Centralized', 'Lightweight AP', 'WLC مركزي', 'CAPWAP إلى WLC ثم LAN غالباً', 'حرم جامعي ومؤسسات', 'depends on central WLC capacity'],
  ['Cloud-based', 'Cloud-managed AP', 'منصة إدارة سحابية', 'محلي أو حسب نموذج البائع', 'فروع متعددة بإدارة سحابية', 'لا تفترض مرور بيانات العملاء بالسحابة دائماً'],
  ['Embedded WLC', 'AP مدعوم بوظيفة WLC', 'داخل الجهاز المدعوم', 'حسب المنصة والتكوين', 'مواقع صغيرة/medium', 'platform and release dependent'],
]

const planeRows: string[][] = [
  ['Data Plane', 'أين تسري حزمة العميل؟', 'إطار 802.11 → AP → CAPWAP data → WLC → LAN في central switching، أو خروج محلي في local switching'],
  ['Control Plane', 'من يقرر التكوين والسياسة؟', 'AP discovery/join، CAPWAP control، WLAN policy، RRM، حالة AP والعميل'],
  ['Management Plane', 'كيف يدير المهندس النظام؟', 'GUI/CLI على WLC، مراقبة، تقارير، ترقية firmware، نسخ configuration'],
]

const capwapRows: string[][] = [
  ['CAPWAP Control', 'UDP 5246', 'AP discovery/join وتنزيل التكوين ورسائل التحكم', 'DTLS protects the control channel where supported'],
  ['CAPWAP Data', 'UDP 5247', 'نقل إطارات عملاء Wi-Fi بين AP وWLC', 'Data-channel encryption depends on platform/configuration'],
  ['Split-MAC', 'concept', 'AP handles real-time 802.11; WLC handles control/management', 'المصطلح مفاهيمي في CCNA'],
  ['Central switching', 'path', 'Client data goes AP → WLC → wired LAN', 'يعتمد على AP mode والتكوين'],
  ['Local switching', 'path', 'Client data exits at the AP toward local LAN', 'FlexConnect example; depends on deployment'],
]

const modeRows: string[][] = [
  ['Local', 'نعم', 'عبر WLC غالباً', 'خدمة عملاء طبيعية في نشر مركزي', 'الأشيع في المكاتب'],
  ['FlexConnect', 'نعم', 'محلي أو مركزي', 'فروع بعيدة وتبديل محلي', 'قد تستمر بعض الخدمات عند فقدان WLC'],
  ['Monitor', 'لا', 'غير مطبق', 'مراقبة RF وأمان', 'لا يبث SSID خدمة عادةً'],
  ['Sniffer', 'لا', 'capture', 'التقاط حزمة على قناة محددة', 'لتحليل الشبكة'],
  ['Rogue Detector', 'لا', 'غير مطبق', 'كشف APs غير المصرح بها', 'يربط معلومات سلكية ولاسلكية'],
  ['Bridge', 'لا عادةً', 'رابط لاسلكي', 'ربط شبكتين سلكيتين', 'point-to-point أو point-to-multipoint حسب المنصة'],
  ['SE-Connect', 'لا', 'غير مطبق', ' Spectrum analysis', 'على منصات Cisco مدعومة فقط'],
]

const verificationRows: string[][] = [
  ['`show ap summary`', 'قائمة APs وحالتها العامة وعناوينها', 'موجود بعدة منصات لكن الإخراج يختلف'],
  ['`show ap config general <AP-NAME>`', 'تفاصيل AP وتكوينه العام', 'صيغة شائعة في AireOS على سبيل المثال'],
  ['`show ap name <AP-NAME> config general`', 'تفاصيل AP بصيغة IOS XE', 'صيغة Catalyst 9800 على سبيل المثال'],
  ['`show wireless stats ap join summary`', 'إحصاءات اكتشاف AP والانضمام', 'الدعم والسماحية يعتمدان على المنصة'],
]

const troubleRows: string[][] = [
  ['AP لا يكتشف WLC', 'DHCP option 43، DNS، broadcast، static discovery، VLAN/IP connectivity'],
  ['AP لا ينضم إلى WLC', 'join state، توافق AP/WLC، firmware، license، Certificate/Time'],
  ['CAPWAP محجوب', 'ACL/firewall على UDP 5246 وUDP 5247 بين AP والـ WLC'],
  ['UDP 5246/5247 problems', 'تحقق من المسار والمنافذ وإحصاءات join وstate'],
  ['Incorrect AP mode', 'راجع AP mode وتأكد أنه مناسب لخدمة العملاء أو المراقبة أو الجسر'],
  ['AP/WLC compatibility', 'قوائم التوافق وإصدار البرنامج وحدود الترقية'],
  ['Firmware mismatch', 'صورة البرنامج المطلوبة وتوزيعها من الـ WLC'],
  ['VLAN أو DHCP', 'AP IP address، DHCP scope، VLAN trunk/access، option 43'],
  ['Time أو certificates', 'NTP/clock وسلامة شهادات DTLS عند استخدام secure control'],
]

const lab3Rows: string[][] = [
  ['Normal client access in an office', 'Local', 'يبث SSID ويخدم العملاء عبر WLC مركزي'],
  ['Remote branch with local breakout', 'FlexConnect', 'يدعم local switching وبعض الخدمات المحلية'],
  ['RF monitoring and security observation', 'Monitor', 'يراقب البيئة ولا يخدم العملاء عادةً'],
  ['Capture 802.11 frames on one channel', 'Sniffer', 'يرسل الإطارات إلى نظام تحليل'],
  ['Find unauthorized APs', 'Rogue Detector', 'يربط بيانات سلكية ولاسلكية لتحديد الـ rogue'],
  ['Connect two buildings wirelessly', 'Bridge', 'يربط LANs عبر رابط لاسلكي'],
  ['Spectrum analysis on supported hardware', 'SE-Connect', 'تحليل طيف على منصة مدعومة'],
]

const commonMistakeRows: string[][] = [
  ['افتراض أن كل AP يحتاج WLC', 'Autonomous AP يعمل بدون WLC إلزامي للتشغيل الطبيعي'],
  ['افتراض أن LWAP يحفظ كل سياساته محلياً', 'الـ WLC هو مصدر التكوين والسياسة في النموذج المركزي'],
  ['خلط data plane مع control plane', 'Control يدير التكوين والجوان؛ data يحمل حركة العميل'],
  ['القول إن CAPWAP control وdata يستخدمان نفس المنفذ', 'Control على UDP 5246 وdata على UDP 5247'],
  ['افتراض أن DTLS يحمي كل البيانات دائماً', 'Control محمي بـ DTLS حيث مدعوم؛ data encryption يعتمد على المنصة والتكوين'],
  ['افتراض أن cloud management يعني أن بيانات العملاء تمر بالسحابة', 'مسار البيانات يعتمد على البائع والنموذج'],
  ['استخدام Monitor أو Sniffer لخدمة العملاء', 'هذه أوضاع مراقبة/troubleshooting وليست لخدمة المستخدمين'],
  ['افتراض أن كل APs تدعم كل الأوضاع', 'الدعم يعتمد على طراز AP والـ WLC والإصدار'],
  ['نسيان UDP 5246/5247 في جدران الحماية', 'حجبها يمنع التحكم أو نقل بيانات CAPWAP'],
  ['اعتبار FlexConnect local switching بلا شروط', 'يعتمد على التكوين والـ VLANs والمنصة وحالة الاتصال بالـ WLC'],
]

export const topic26Lesson: Lesson = {
  topicId: '2.6',
  title: 'Describe Cisco Wireless Architectures and AP modes',
  description:
    'في Topic 2.6 ننتقل من مبادئ RF إلى معماريات WLAN: autonomous وlightweight APs، دور الـ WLC، النماذج المركزية والسحابية وembedded WLC، بروتوكول CAPWAP ومنافذ 5246/5247، وأوضاع AP مثل Local وFlexConnect وMonitor وSniffer وRogue Detector وBridge وSE-Connect. اللابات conceptual ولم تُنفّذ على أجهزة فعلية، ولن يتم فتح Topic 2.7.',
  estimatedTime: '~125 دقيقة',
  steps: [
    {
      id: 'what',
      title: 'Wireless Network Architecture Fundamentals',
      short: 'أساسيات المعمارية',
      blocks: [
        {
          type: 'paragraph',
          text: '**Wireless LAN (WLAN)** هي شبكة محلية تستخدم RF بدلاً من الكابل بين العملاء و**Access Point (AP)**. الـ AP نفسه يتصل عادةً بشبكة سلكية عبر access switch، وقد يُدار بواسطة **Wireless LAN Controller (WLC)** في المعماريات المركزية. في CCNA المهم أن تفهم من يدير ومن ينقل حركة العميل، مش فقط أسماء الأجهزة.',
        },
        {
          type: 'diagram',
          id: 'basic-wlan-architecture',
          caption: 'طوبولوجيا مؤسسية: عملاء، عدة APs، مفاتيح وصول، WLC، وشبكة core.',
        },
        {
          type: 'paragraph',
          text: 'عندما يتصل عميل لاسلكي: يختار SSID ويتصادق مع الـ AP عبر 802.11، ثم تصبح حركته إطاراً على الشبكة السلكية. الـ AP ينهي رابط الراديو، والمفتاح ينقل الإطار، والـ WLC قد يمرر الحركة أو يدير فقط حسب النموذج.',
        },
        { type: 'table', headers: ['المكوّن', 'مسؤولية التحكم', 'مسؤولية البيانات', 'مثال'], rows: wlanComponentRows },
        {
          type: 'list',
          items: [
            '**Wireless client**: يبدأ الاتصال ويستخدم SSID والمصادقة.',
            '**AP**: ينهي 802.11 ويربط عالم الراديو بالشبكة السلكية.',
            '**Access switch**: يوفر Layer 2 connectivity وPoE للـ APs المدعومة.',
            '**WLC**: يدير الـ APs والسياسات مركزياً عند وجوده.',
            '**Core network**: يوفر routing وخدمات مثل DHCP وDNS والوصول للإنترنت.',
          ],
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'علاقة مهمة',
          text: 'AP لا يعني دائلاً "جهازاً غبياً"، وWLC لا يعني دائماً أن كل حزمة تمر عليه. فكرة التحكم مقابل البيانات هي المفتاح لفهم المعماريات اللاحقة.',
        },
      ],
    },
    {
      id: 'how',
      title: 'Autonomous Access Points',
      short: 'Autonomous AP',
      blocks: [
        {
          type: 'paragraph',
          text: '**Autonomous AP** هو نقطة وصول مستقلة تحمل configuration كاملة محلياً: SSID، أمان Wi-Fi، قناة الراديو، ومعظم إعدادات التشغيل. لا يحتاج إلى WLC ليعمل بشكل طبيعي. يمكن إدارة كل AP عبر واجهته الخاصة، ويُربط بالمفتاح مثل أي جهاز سلكي آخر.',
        },
        {
          type: 'diagram',
          id: 'autonomous-ap-architecture',
          caption: 'كل autonomous AP يُعدّ بشكل منفصل؛ لا يوجد WLC مطلوب للتشغيل.',
        },
        {
          type: 'list',
          items: [
            '**Standalone operation**: الـ AP يعمل ويخدم العملاء دون تحكم مركزي.',
            '**Independent configuration**: كل AP له إعداداته وعنوان إدارته الخاص.',
            '**Local management**: الإدارة تتم على الجهاز نفسه غالباً.',
            '**Typical use**: مكتب صغير أو متجر أو عدد قليل من الـ APs.',
          ],
        },
        {
          type: 'paragraph',
          text: '**المزايا**: بساطة في المواقع الصغيرة، لا حاجة لشراء WLC، واستقلالية كل AP. **العيوب**: تكرار التكوين، صعوبة الحفاظ على سياسة متسقة، غياب الرؤية المركزية، ومشقة التوسع.',
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'ليست قاعدة مطلقة',
          text: 'عدم وجود WLC لا يعني أنه لا توجد أي أداة إدارة خارجية على الإطلاق؛ المعنى المقصود في CCNA هو أن التشغيل الطبيعي للـ AP لا يتطلب WLC.',
        },
      ],
    },
    {
      id: 'packet',
      title: 'Lightweight Access Points (LWAP)',
      short: 'Lightweight AP',
      blocks: [
        {
          type: 'paragraph',
          text: '**Lightweight AP (LWAP)** يعتمد على **WLC** في التكوين والإدارة والمراقبة. عند التشغيل يكتشف الـ AP واجهة WLC، ثم ينضم إليها ويحصل على WLAN configuration وsecurity policy وربما صورة برنامج. الـ AP ما زال يتعامل مع RF ووظائف 802.11 الحساسة للزمن، بينما الـ WLC يتولى التحكم والإدارة.',
        },
        {
          type: 'diagram',
          id: 'lightweight-ap-wlc-architecture',
          caption: 'LWAP يكتشف WLC وينضم إليه، ثم يستلم التكوين والسياسات مركزياً.',
        },
        { type: 'table', headers: ['وجه المقارنة', 'Autonomous AP', 'Lightweight AP'], rows: apCompareRows },
        {
          type: 'steps',
          items: [
            { title: '1', text: 'الـ AP يحصل على IP connectivity عبر DHCP/VLAN.' },
            { title: '2', text: 'يكتشف WLC عبر DHCP option 43 أو DNS أو broadcast أو عنوان ثابت.' },
            { title: '3', text: 'يرسل join request ويتحقق الـ WLC من التوافق والحالة.' },
            { title: '4', text: 'يستلم configuration وسياسة WLAN وربما firmware.' },
            { title: '5', text: 'يصبح AP في حالة joined ويخضع للمراقبة المركزية.' },
          ],
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Split-MAC',
          text: 'تقسيم المهام مفاهيمي: الـ AP يتعامل مع real-time 802.11، والـ WLC يتعامل مع إدارة التكوين والسياسات. لا تحفظ هذا كقائمة أوامر، بل كفكرة تصميم.',
        },
      ],
    },
    {
      id: 'config',
      title: 'Wireless LAN Controllers (WLC)',
      short: 'دور WLC',
      blocks: [
        {
          type: 'paragraph',
          text: '**WLC** هو الجهاز الذي يوفّر إدارة مركزية لـ APs والـ WLANs. من خلاله تُعرَّف SSIDs وسياسات الأمان وVLAN assignment، ويُراقب APs والعملاء، وتُوزَّع التهيئة وتحديثات البرنامج. مفهوم **Radio Resource Management (RRM)** يعني أن الـ WLC يساعد في تنسيق القنوات والقدرة وتجنب المشاكل اللاسلكية عند دعم المنصة لذلك.',
        },
        {
          type: 'table',
          headers: ['Plane', 'السؤال الذي يجيب عليه', 'مثال CCNA'],
          rows: planeRows,
        },
        {
          type: 'list',
          items: [
            '**Centralized AP management**: حالة الـ AP، الانضمام، التكوين، والمراقبة.',
            '**WLAN configuration**: SSID، VLAN، security policy، QoS حسب المنصة.',
            '**Security policy management**: إدارة سياسات الأمان وتطبيقها على WLANs وAPs المدعومة.',
            '**Client monitoring**: من يتصل وأين وحالة الجلسة.',
            '**Firmware/configuration management**: توزيع الصور والإعدادات على APs مدعومة.',
            '**RRM**: مفهوم تنسيق RF؛ الخوارزميات الدقيقة تعتمد على البائع والإصدار.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Data مقابل Control',
          text: 'في central switching يمرر الـ WLC حركة العملاء أيضاً. في local switching قد تخرج الحركة من الـ AP مباشرةً مع بقاء الـ WLC مسؤولاً عن التحكم والإدارة. لذلك لا تقل إن "كل حزمة تمر بالـ WLC" كقاعدة عالمية.',
        },
      ],
    },
    {
      id: 'verify',
      title: 'Cisco Wireless Deployment Architectures',
      short: 'معماريات النشر',
      blocks: [
        {
          type: 'paragraph',
          text: 'توجد عدة طرق لنشر WLAN في Cisco وغيرها: autonomous موزّع، centralized حول WLC، cloud-managed، وembedded WLC داخل جهاز مدعوم. كل نموذج يحل مشكلة مختلفة؛ لا توجد معمارية صحيحة لكل المنتجات.',
        },
        {
          type: 'diagram',
          id: 'centralized-wireless-deployment',
          caption: 'النشر المركزي: عدة LWAPs، CAPWAP، وسياسة موحدة على WLC.',
        },
        {
          type: 'diagram',
          id: 'cloud-based-wireless-management',
          caption: 'الإدارة عبر السحابة؛ مسار بيانات العميل يعتمد على البائع والنموذج.',
        },
        {
          type: 'diagram',
          id: 'embedded-wireless-controller-architecture',
          caption: 'وظيفة WLC مدمجة في AP مدعوم عدد من المواقع الصغيرة والمتوسطة.',
        },
        { type: 'table', headers: ['Architecture', 'AP type', 'Management', 'Client data path', 'Typical use', 'Caveat'], rows: architectureRows },
        {
          type: 'list',
          items: [
            '**Autonomous architecture**: إعدادات موزّعة ولا يوجد WLC إلزامي.',
            '**Centralized architecture**: LWAPs وWLC مركزي واتصال CAPWAP.',
            '**Cloud-based architecture**: منصة إدارة سحابية؛ لا تفترض أن بيانات العملاء تمر عبر السحابة دائماً.',
            '**Embedded WLC**: واجهة تحكم مدمجة في أجهزة مدعومة ومناسبة لنطاق محدد.',
          ],
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'قيد منتجي مهم',
          text: 'ليست كل منتجات Cisco تدعم كل معمارية أو كل أوضاع AP. راجع طراز الجهاز وترخيصه وإصدار البرنامج ودليل التصميم قبل أن تفترض توفر ميزة.',
        },
      ],
    },
    {
      id: 'mistakes',
      title: 'CAPWAP Protocol',
      short: 'CAPWAP',
      blocks: [
        {
          type: 'paragraph',
          text: '**CAPWAP** اختصار لـ **Control And Provisioning of Wireless Access Points**. هو البروتوكول المستخدم بين LWAP وWLC لاكتشاف الـ AP وAP joining وتنزيل التكوين وتبادل رسائل التحكم، كما يحمل إطارات عملاء Wi-Fi في مسار البيانات عند استخدام CAPWAP data.',
        },
        {
          type: 'diagram',
          id: 'capwap-ap-discovery',
          caption: 'اكتشاف WLC عبر DHCP option 43 أو DNS أو broadcast أو عنوان ثابت.',
        },
        {
          type: 'diagram',
          id: 'capwap-join-process',
          caption: 'مراحل join: discovery، تأمين التحكم، join request، تنزيل التكوين، ثم joined.',
        },
        {
          type: 'diagram',
          id: 'capwap-control-vs-data',
          caption: 'CAPWAP control على UDP 5246 وCAPWAP data على UDP 5247 مع مسارات switching مختلفة.',
        },
        { type: 'table', headers: [' العنصر', 'المنفذ/المفهوم', 'الوظيفة', 'ملاحظة'], rows: capwapRows },
        {
          type: 'code',
          label: 'CAPWAP ports - remember the split',
          language: 'text',
          code: `CAPWAP control : UDP 5246   (DTLS protection where supported)
CAPWAP data    : UDP 5247   (encryption behavior depends on platform/configuration)`,
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'لا تبالغ في التفاصيل',
          text: 'CCNA يطلب فهماً عالي المستوى: من يتحكم، أين تذهب حركة العميل، وما الفرق بين control وdata. لا تحتاج إلى تحليل حقول CAPWAP المتقدمة هنا.',
        },
      ],
    },
    {
      id: 'lab',
      title: 'Access Point Modes',
      short: 'أوضاع AP',
      blocks: [
        {
          type: 'paragraph',
          text: 'وضع الـ AP يحدد وظيفته: خدمة العملاء، نقل محلي، مراقبة، التقاط حزم، كشف rogue، ربط شبكات، أو تحليل طيف. الأوضاع المتاحة تعتمد على طراز AP ومنصة الـ WLC وإصدار البرنامج ونوع النشر.',
        },
        {
          type: 'diagram',
          id: 'local-mode-ap',
          caption: 'Local mode: وضع خدمة العملاء المعتاد في النشر المركزي.',
        },
        {
          type: 'diagram',
          id: 'flexconnect-local-vs-central-switching',
          caption: 'FlexConnect: مقارنة local switching وcentral switching لحركة العميل.',
        },
        {
          type: 'diagram',
          id: 'monitor-vs-sniffer-mode',
          caption: 'Monitor مقابل Sniffer: مراقبة RF مقابل التقاط الإطارات للتحليل.',
        },
        {
          type: 'diagram',
          id: 'rogue-detector-mode',
          caption: 'Rogue Detector يربط معلومات الشبكة السلكية واللاسلكية لكشف APs غير المصرح بها.',
        },
        {
          type: 'diagram',
          id: 'wireless-bridge-mode',
          caption: 'Bridge mode يربط شبكتين سلكيتين عبر رابط لاسلكي.',
        },
        {
          type: 'diagram',
          id: 'ap-modes-comparison',
          caption: 'مقارنة سريعة بين Local وFlexConnect وMonitor وSniffer وRogue Detector وBridge وSE-Connect.',
        },
        { type: 'table', headers: ['Mode', 'يخدم عملاء؟', 'مسار البيانات', 'الغرض', 'قيد مهم'], rows: modeRows },
        {
          type: 'list',
          items: [
            '**Local Mode**: خدمة عملاء طبيعية ووظائف مراقبة مساندة في النشر المركزي.',
            '**FlexConnect Mode**: مفيد للفروع ويدعم local switching وبعض الخدمات المحلية عند فقدان WLC حسب التهيئة.',
            '**Monitor Mode**: يراقب البيئة ولا يخدم العملاء عادةً.',
            '**Sniffer Mode**: يلتقط الإطارات على قناة ويرسلها إلى نظام تحليل.',
            '**Rogue Detector Mode**: يساعد في كشف APs غير المصرح بها عبر ربط معلومات سلكية ولاسلكية.',
            '**Bridge Mode**: يربط شبكات عبر وصلة لاسلكية point-to-point أو point-to-multipoint حسب المنصة.',
            '**SE-Connect Mode**: وضع تحليل طيف مخصص على منصات Cisco مدعومة.',
          ],
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'الدعم ليس عالمياً',
          text: 'لا تفترض أن كل AP يدعم كل وضع. تحقق من طراز AP وبرنامج الـ WLC والترخيص وطريقة النشر قبل اختيار الوضع في تصميم حقيقي.',
        },
      ],
    },
    {
      id: 'exam',
      title: 'Cisco Wireless Architecture Verification and Troubleshooting',
      short: 'التحقق والتشخيص',
      blocks: [
        {
          type: 'paragraph',
          text: 'تختلف أوامر التحقق بين **AireOS** و**Catalyst 9800 IOS XE**. الأوامر أدناه أمثلة تعليمية؛ بناء الجملة واسم الحقل ومكان العرض قد يختلفان حسب المنصة والإصدار. لا تتعامل مع أي أمر كأنه صالح لكل وحدات التحكم.',
        },
        {
          type: 'code',
          label: 'Verification commands where supported',
          language: 'text',
          code: `show ap summary
show ap config general <AP-NAME>
show ap name <AP-NAME> config general
show wireless stats ap join summary`,
        },
        { type: 'table', headers: ['الأمر', 'ما الذي يوضحه؟', 'ملاحظة منصة'], rows: verificationRows },
        {
          type: 'paragraph',
          text: '**Representative educational outputs - not captured from real hardware**',
        },
        {
          type: 'code',
          label: 'AireOS-style and IOS XE-style examples - educational only',
          language: 'text',
          code: `WLC-AIREOS-STYLE# show ap summary
AP Name        Slots  AP Model      Ethernet MAC       Location   IP Address
AP-1           2      AIR-AP-xxxx   00:11:22:33:44:11  Floor1     10.10.20.11
AP-2           2      AIR-AP-xxxx   00:11:22:33:44:12  Floor2     10.10.20.12

WLC-AIREOS-STYLE# show ap config general AP-1
AP Name ......................................... AP-1
AP MAC Address ................................... 00:11:22:33:44:11
AP IP Address .................................... 10.10.20.11
CAPWAP State ..................................... Joined
AP Mode .......................................... Local
Country Code ..................................... US

WLC-IOSXE-STYLE# show ap name AP-1 config general
AP Name                       : AP-1
AP MAC Address                : 00:11:22:33:44:11
AP IP Address                 : 10.10.20.11
CAPWAP State                  : Joined
AP Mode                       : Local

WLC-IOSXE-STYLE# show wireless stats ap join summary
Total APs ........................................ 2
Joined APs ....................................... 2
Pending Join ..................................... 0
Discovery Requests ............................... 18
Join Failures .................................... 1`,
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'تنبيه تعليمي صريح',
          text: 'المخرجات أعلاه representative educational examples وليست لقطات من أجهزة Cisco حقيقية. تحقق من وثائق المنصة والإصدار قبل نسخ أي أمر أو تفسير أي حقل.',
        },
        {
          type: 'paragraph',
          text: '**حالات تشخيص شائعة**',
        },
        { type: 'table', headers: ['المشكلة', 'أهم الفحوصات'], rows: troubleRows },
        {
          type: 'paragraph',
          text: '**Troubleshooting Workflow**',
        },
        {
          type: 'steps',
          items: [
            { title: '1', text: 'تأكد من الطوبولوجيا الفيزيائية: كابل، منفذ، PoE، وحالة الـ link.' },
            { title: '2', text: 'تحقق من عنوان IP للـ AP وDHCP والـ VLAN الصحيح.' },
            { title: '3', text: 'حدد طريقة discovery المتوقعة: DHCP option 43 أو DNS أو broadcast أو static.' },
            { title: '4', text: 'تحقق من وصول UDP 5246 وUDP 5247 عبر ACL/firewalls ومسار الشبكة.' },
            { title: '5', text: 'افحص join state وتوافق AP/WLC وإصدار firmware والترخيص.' },
            { title: '6', text: 'راجع AP mode؛ قد يكون الوضع غير مناسب لخدمة العملاء أو للربط.' },
            { title: '7', text: 'راجع WLAN/SSID profile وسياسة الأمان وتعيين الـ VLAN.' },
            { title: '8', text: 'تحقق من الوقت/source NTP وشهادات DTLS عند استخدام secure control.' },
            { title: '9', text: 'أخيراً افحص عميل Wi-Fi نفسه: SSID، مصادقة، RF وإشارات Topic 1.11.' },
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'ترتيب التفكير',
          text: 'ابدأ من الأساسيات: هل الـ AP حصل على IP؟ هل يصل إلى WLC؟ هل يستطيع الانضمام؟ بعد ذلك فقط ابحث في WLAN policy أو client issues.',
        },
      ],
    },
    {
      id: 'summary',
      title: 'Practical Labs, CCNA Exam Review, and Summary',
      short: 'اللابات والمراجعة',
      blocks: [
        {
          type: 'paragraph',
          text: '**Lab 1 - Autonomous vs Lightweight AP (Packet Tracer-style / conceptual)**',
        },
        {
          type: 'steps',
          items: [
            { title: 'Topology', text: 'APs وClients وSwitch في سيناريوهين منفصلين: autonomous وlightweight مع WLC. تمرين تعليمي ولم يُنفّذ على أجهزة فعلية.' },
            { title: 'Task 1', text: 'افحص معمارية autonomous AP وحدد مكان حفظ التكوين.' },
            { title: 'Task 2', text: 'حدد من يدير SSID والأمان والقناة في هذا النموذج.' },
            { title: 'Task 3', text: 'انتقل إلى معمارية lightweight وحدد دور الـ WLC.' },
            { title: 'Task 4', text: 'قارن centralized وdistributed management من نقطتي الاتساق والتوسع.' },
            { title: 'Task 5', text: 'اشرح أي معمارية أنسب لمؤسسة كبيرة ولماذا.' },
            { title: 'Honesty note', text: 'ليست كل صور Packet Tracer تدعم كل ميزات AP أو WLC؛ اعتبر هذا تحليلاً مفاهيمياً.' },
          ],
        },
        {
          type: 'paragraph',
          text: '**Lab 2 - CAPWAP Communication (conceptual)**',
        },
        {
          type: 'table',
          headers: ['Component', 'Quantity', 'Role'],
          rows: [
            ['WLC', '1', 'controller and policy point'],
            ['Lightweight AP', '2', 'CAPWAP endpoints'],
            ['Access switch', '1', 'IP connectivity for APs and WLC'],
            ['Wireless clients', '2+', 'traffic sources'],
          ],
        },
        {
          type: 'steps',
          items: [
            { title: 'Task 1', text: 'اشرح كيف يكتشف AP عنوان WLC (مثال DHCP option 43 أو DNS).' },
            { title: 'Task 2', text: 'اشرح خطوات join وكيف يحصل AP على التكوين.' },
            { title: 'Task 3', text: 'حدد CAPWAP control على UDP 5246 واشرح حماية DTLS where supported.' },
            { title: 'Task 4', text: 'حدد CAPWAP data على UDP 5247 واشرح أن حماية بيانات القناة تعتمد على المنصة.' },
            { title: 'Task 5', text: 'تتبّع حركة عميل من AP إلى WLC ثم إلى الشبكة السلكية في central switching.' },
            { title: 'Task 6', text: 'أعد تتبّع الحركة في FlexConnect local switching وقارن المسار.' },
            { title: 'Honesty note', text: 'لم يُشغّل اللاب على WLC حقيقي؛ CAPWAP وكل الأوضاع ليست مدعومة بالكامل في كل بيئة محاكاة.' },
          ],
        },
        {
          type: 'paragraph',
          text: '**Lab 3 - AP Modes Selection (conceptual)**',
        },
        { type: 'table', headers: ['Scenario', 'Best mode', 'Reason'], rows: lab3Rows },
        {
          type: 'steps',
          items: [
            { title: 'Task 1', text: 'لكل سيناريو اختر الوضع المناسب وبرر الاختيار.' },
            { title: 'Task 2', text: 'حدد هل الوضع يخدم عملاًء أم للمراقبة فقط.' },
            { title: 'Task 3', text: 'حدد أين تخرج حركة العميل في كل حالة عند وجودها.' },
            { title: 'Task 4', text: 'اذكر قيداً واحداً مرتبطاً بالمنصة أو الإصدار.' },
            { title: 'Honesty note', text: 'هذا لاب اختيار تصميمي conceptual ولم يُنفّذ على أجهزة Cisco فعلية.' },
          ],
        },
        {
          type: 'paragraph',
          text: '**الأخطاء الشائعة**',
        },
        { type: 'table', headers: ['الخطأ', 'التصحيح'], rows: commonMistakeRows },
        {
          type: 'callout',
          tone: 'warning',
          title: 'الأمانة التعليمية',
          text: 'اللابات conceptual ولم تُنفّذ على معدات فعلية. المخرجات تعليمية، ودعم الأوامر والأوضاع والمعماريات يعتمد على المنتج والإصدار.',
        },
        {
          type: 'list',
          items: [
            'Autonomous AP يعمل بشكل مستقل ولا يحتاج WLC للتشغيل الطبيعي.',
            'Lightweight AP يعتمد على WLC للتكوين والسياسات والمراقبة.',
            'WLC يدير التحكم والإدارة؛ قد يمرر أيضاً بيانات العملاء حسب switching mode.',
            'النماذج: autonomous، centralized، cloud-based، embedded WLC.',
            'CAPWAP control = UDP 5246 مع DTLS where supported؛ CAPWAP data = UDP 5247.',
            'Data encryption يعتمد على المنصة والتكوين؛ لا تعمم قاعدة واحدة.',
            'Local وFlexConnect يخدمان العملاء؛ Monitor وSniffer وRogue Detector للمراقبة والتحليل.',
            'Bridge يربط شبكات؛ SE-Connect لتحليل الطيف على منصات مدعومة.',
            'التحقق: `show ap summary` و`show ap config general <AP-NAME>` و`show ap name <AP-NAME> config general` و`show wireless stats ap join summary` where supported.',
            'التشخيص يبدأ من IP/DHCP/VLAN ثم discovery/join ثم UDP 5246/5247 ثم التوافق والوقت/الشهادات.',
          ],
        },
        {
          type: 'paragraph',
          text: '**اختبار CCNA**',
        },
        {
          type: 'paragraph',
          text: '5 أسئلة، 4 خيارات لكل سؤال، ومزيج من single-choice وmultiple-select. قبل الإرسال لا تظهر الإجابة؛ بعد الإرسال يظهر الشرح وتتقفل الخيارات ويختفي زر التحقق.',
        },
        {
          type: 'quiz',
          questions: [
            {
              id: 'q1',
              prompt: 'Which statement about an autonomous AP is correct?',
              options: [
                'It can be configured and managed locally and does not require a WLC for normal operation.',
                'It must join a WLC before wireless clients can associate.',
                'It always receives its WLAN policy over CAPWAP from a central controller.',
                'It can only operate in Monitor mode.',
              ],
              correctIndex: 0,
              requireSubmit: true,
              explanation:
                'الصح هو **(A)**. الـ Autonomous AP يحمل configuration محلياً ويعمل دون WLC إلزامي للتشغيل الطبيعي. نموذج الـ lightweight هو الذي يعتمد على WLC للتكوين والسياسة.',
            },
            {
              id: 'q2',
              kind: 'multiple',
              prompt: 'Which responsibilities are typically associated with a WLC in a centralized WLAN? (Choose more than one.)',
              options: [
                'Centralized WLAN and security policy management.',
                'AP monitoring and firmware/configuration distribution.',
                'Radio Resource Management at a conceptual level.',
                'Replacing every wired access switch with a wireless bridge.',
              ],
              correctIndices: [0, 1, 2],
              requireSubmit: true,
              explanation:
                'الصح هو **(A) و(B) و(C)**. الـ WLC يدير السياسات والـ APs والتحديثات وRRM مفاهيمياً. لا يقوم باستبدال كل مفاتيح الوصول بجسور لاسلكية.',
            },
            {
              id: 'q3',
              prompt: 'Which statement about CAPWAP ports is correct?',
              options: [
                'Control uses UDP 5246 and can be protected with DTLS; data uses UDP 5247.',
                'Control uses TCP 5246 and data uses TCP 5247.',
                'Both control and data always use UDP 5246 with no encryption.',
                'CAPWAP replaces the 802.11 association between a client and an AP.',
              ],
              correctIndex: 0,
              requireSubmit: true,
              explanation:
                'الصح هو **(A)**. CAPWAP control على UDP 5246 ويمكن حمايته بـ DTLS حيث مدعوم. CAPWAP data على UDP 5247، وسلوك تشفير قناة البيانات يعتمد على المنصة والتكوين. CAPWAP لا يحل محل ارتباط 802.11 بين العميل والـ AP.',
            },
            {
              id: 'q4',
              kind: 'multiple',
              prompt: 'Which AP modes are primarily monitoring or analysis modes and do not normally serve wireless clients? (Choose more than one.)',
              options: [
                'Monitor mode',
                'Sniffer mode',
                'Rogue Detector mode',
                'Local mode',
              ],
              correctIndices: [0, 1, 2],
              requireSubmit: true,
              explanation:
                'الصح هو **(A) و(B) و(C)**. Monitor وSniffer وRogue Detector أوضاع مراقبة أو تحليل ولا تخدم العملاء عادةً. Local mode هو وضع خدمة العملاء المعتاد. SE-Connect أيضاً للتحليل لكنه غير مدرج هنا ضمن الخيارات.',
            },
            {
              id: 'q5',
              kind: 'multiple',
              prompt: 'Which statements about FlexConnect local switching are correct? (Choose more than one.)',
              options: [
                'Client traffic can be switched locally at the AP instead of passing through the WLC.',
                'It is often used for remote branches.',
                'Certain local services may continue during WLC connectivity loss, depending on configuration and platform.',
                'It requires every client frame to be centrally switched through the WLC.',
              ],
              correctIndices: [0, 1, 2],
              requireSubmit: true,
              explanation:
                'الصح هو **(A) و(B) و(C)**. FlexConnect يدعم local switching للفروع، وقد تستمر بعض الخدمات المحلية عند فقدان WLC حسب التهيئة والمنصة. الخيار (D) يعاكس فكرة local switching.',
            },
          ],
        },
      ],
    },
  ],
}
