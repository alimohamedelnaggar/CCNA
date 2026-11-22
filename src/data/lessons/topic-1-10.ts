import type { Lesson } from '../types'

const parameterRows: string[][] = [
  ['IPv4 Address', 'عنوان الجهاز على شبكة IPv4', '`192.168.1.100`', 'لازم يكون فريد جوّه الـ subnet ويوافق الشبكة'],
  ['IPv6 Address', 'عنوان IPv6؛ 128 bit', '`2001:db8:1::100`', 'GUA أو LLA أو ULA حسب الدور والـ scope'],
  ['Subnet Mask', 'بتفصل Network part عن Host part في IPv4', '`255.255.255.0`', 'غلط فيها = تصنيف غلط للم destinations'],
  ['Prefix Length', 'عدد الـ network bits في CIDR', '`/24`', 'نفس معنى `255.255.255.0`'],
  ['Default Gateway', 'الراوتر اللي بيخرج بال packet للشبكات التانية', '`192.168.1.1`', 'لازم يكون جوّه نفس الـ subnet'],
  ['DNS Server', 'بيترجم الأسماء لـ IP addresses', '`8.8.8.8`', 'غير الـ gateway؛ بيشتغل قبل الاتصال'],
  ['DHCP Server', 'اللي بيوزّع IP والمعلومات التانية', '`192.168.1.1`', 'بيظهر في `ipconfig /all` لما DHCP Enabled = Yes'],
  ['MAC Address', 'عنوان الطبقة 2 بتاع الواجهة', '`00-1A-2B-3C-4D-5E`', 'محلي للـ link؛ ARP بيحوله IP ↔ MAC'],
  ['Network Interface', 'المنفذ أو adapter اللي عليه الإعدادات', '`eth0`, `en0`, `Ethernet`', 'لازم يكون UP وله إعدادات صحيحة'],
  ['DHCP Enabled', 'بيقول إذا كان العنوان تلقائي ولا يدوي', '`Yes` / `No`', '`No` غالباً يعني static'],
  ['Configuration Source', 'منين جاء العنوان؟', 'DHCP / Manual', 'مهم لمعرفة مين نلوم لما يحصل خطأ'],
]

const missingParameterRows: string[][] = [
  ['مفيش IP أو APIPA', 'مفيش عنوان صالح', 'مفيش اتصال عادي؛ غالباً DHCP أو link مشكلة', '`ipconfig` / `ip addr` / `ifconfig`'],
  ['ماسك غلط', '`/24` بدل `/25` مثلاً', 'Decisions غلطة لـ local وremote', 'قارن الـ address والـ mask مع المطلوب'],
  ['مفيش default gateway', 'الـ gateway فاضي', 'الـ LAN شغال، والإنترنت لا', '`ipconfig` / `ip route` / `route -n get default`'],
  ['Gateway من subnet تانية', '`192.168.2.1` مع client `192.168.1.100/24`', 'الـ client ما يقدرش يوصل للـ gateway نفسه', 'افحص الـ mask والـ network'],
  ['DNS غلط', '`8.8.8.8` مكتوب غلط أو مش متاح', '`ping 8.8.8.8` شغال بس الأسماء مش بتتحل', '`nslookup` / `resolvectl status` / `scutil --dns`'],
]

const windowsOutputFields: string[][] = [
  ['Host Name', 'اسم الجهاز', '`PC1`', 'مفيد لتأكيد إنك فاحص الجهاز الصح'],
  ['Physical Address', 'MAC Address بتاع الـ adapter', '`00-1A-2B-3C-4D-5E`', 'بيستخدم في ARP جوّه الـ LAN'],
  ['DHCP Enabled', 'بيقول إذا كان DHCP شغال', '`Yes`', '`No` يعني غالباً static'],
  ['IPv4 Address', 'عنوان IPv4 الحالي', '`192.168.1.100`', 'العنوان اللي بيتستخدم فعلياً'],
  ['Subnet Mask', 'قناع الشبكة', '`255.255.255.0`', 'بيحدد إيه اللي جوّه الـ /24'],
  ['Lease Obtained', 'وقت استلام الـ lease', '`21 November 2026 09:10`', 'بيقول بداية مدة الإيجار'],
  ['Lease Expires', 'وقت انتهاء الـ lease', '`22 November 2026 09:10`', 'قبل كده الـ client بيحاول يجدّد'],
  ['Default Gateway', 'الراوتر للشبكات البعيدة', '`192.168.1.1`', 'بدونه مفيش إنترنت'],
  ['DHCP Server', 'مين قدّم الإعدادات', '`192.168.1.1`', 'مهم لما تبحث في مشكلة DHCP'],
  ['DNS Servers', 'خوادم تحليل الأسماء', '`8.8.8.8`', 'مفصولة عن الـ gateway'],
  ['IPv6 Address', 'عناوين IPv6 على الواجهة', '`fe80::...`', 'بيظهر أيضاً في `ipconfig /all`'],
]

const windowsDhcpRows: string[][] = [
  ['`ipconfig /release`', 'يتخلّى عن الـ IPv4 lease الحالي', 'لما تريد تجربة إعادة الحصول على عنوان', 'العنوان يختفي أو يبقى `0.0.0.0` في DHCP IPv4', 'Adapter مش DHCP أو مفيش اتصال'],
  ['`ipconfig /renew`', 'يطلب lease جديد من DHCP', 'بعد تغيير شبكة أو وجود APIPA', 'يرجع عنوان صالح وgateway وDNS', 'مفيش DHCP server أو scope ممتلئ'],
  ['`ipconfig /flushdns`', 'يمسح DNS resolver cache', 'بعد تغيير DNS أو وجود سجل قديم', '`Successfully flushed the DNS Resolver Cache`', 'مش بيغيّر IP أو DHCP state'],
  ['`ipconfig /displaydns`', 'يعرض DNS cache', 'لما تشك في جواب قديم', '	list من الأسماء وعناوين IP', 'قد يكون فاضي لو مفيش استعلامات'],
]

const windowsExtraRows: string[][] = [
  ['`getmac`', 'يعرض MAC Addresses', 'لازم تفرق بين MAC والـ IP'],
  ['`arp -a`', 'يعرض ARP cache: IP ↔ MAC', 'فحص جار على نفس الـ LAN'],
  ['`route print`', 'يعرض جدول التوجيه including default route', 'إيه المسار لـ remote network؟'],
  ['`nslookup example.com`', 'بيختبر DNS resolution', 'بيفرق بين DNS failure وconnectivity failure'],
  ['`ping`', 'بيختبر وصول ICMP', 'ابدأ loopback ثم gateway ثم remote IP'],
  ['`tracert`', 'بيتتبع مسار الحزم', 'فين بالظبط بيقف المسار؟'],
]

const powerShellRows: string[][] = [
  ['`Get-NetIPConfiguration`', 'صورة سريعة لكل adapter: IP وgateway وDNS', 'أقرب حاجة لـ `ipconfig` في PowerShell'],
  ['`Get-NetIPAddress`', 'كل عناوين IP على الواجهات', 'بيوري DHCP أو manual حسب الإصدار'],
  ['`Get-NetAdapter`', 'حالة الواجهات واسمها', 'بيفرق بين Disabled وDisconnected وUP'],
  ['`Get-DnsClientServerAddress`', 'عناوين DNS المضبوطة لكل adapter', 'بيفحص DNS من غير فتح `ipconfig /all`'],
]

const linuxCommandsRows: string[][] = [
  ['`ip addr`', 'عناوين IPv4/IPv6 والـ MAC وحالة الواجهة', 'أول فحص شامل للـ addressing'],
  ['`ip route`', 'جدول توجيه IPv4 والـ default gateway', 'دوّر على `default via ...`'],
  ['`ip link`', 'الواجهات وحالتها فقط', 'فحص UP/DOWN والـ MAC'],
  ['`ip neigh`', 'Neighbor cache: IP ↔ MAC', 'نظير `arp -a`'],
  ['`ip -6 addr`', 'عناوين IPv6 بس', 'فحص GUA وLLA'],
  ['`ip -6 route`', 'جدول توجيه IPv6', 'فحص default route في IPv6'],
  ['`hostname -I`', 'عناوين IPv4/IPv6 المخصّصة', 'فحص سريع من غير تفاصيل'],
  ['`resolvectl status`', 'DNS configuration مع systemd-resolved', 'بيقول DNS بتاع كل واجهة'],
  ['`nmcli device status`', 'حالة الأجهزة مع NetworkManager', 'Availability depends on service'],
  ['`nmcli connection show`', 'الـ connections المحفوظة', 'بيقول إذا كان connection تلقائي ولا يدوي'],
  ['`nmcli device show`', 'تفاصيل DHCP والـ IP لجهاز', 'بيوري DHCP state وlease info متاحة'],
]

const macCommandsRows: string[][] = [
  ['`ifconfig`', 'واجهات وعناوين وMAC وحالة', 'شكل قديم وقريب من `ip addr`'],
  ['`ipconfig getifaddr en0`', 'يرجّع IPv4 لواجهة', 'لازم تتأكد من اسم الواجهة'],
  ['`ipconfig getpacket en0`', 'يعرض DHCP packet details', 'بيوري DHCP server وlease'],
  ['`networksetup -listallnetworkservices`', 'يسرد خدمات الشبكة', 'بيقول أسماء زي `Wi-Fi` أو `Ethernet`'],
  ['`networksetup -getinfo Wi-Fi`', 'IP وmask وrouter وDNS', 'اسم الخدمة لازم يتطابق'],
  ['`networksetup -getdnsservers Wi-Fi`', 'يعرض DNS servers', 'فحص سريع للـ DNS'],
  ['`scutil --dns`', 'يعرض DNS configuration الداخلية', 'بيفرق بين resolver وserver'],
  ['`route -n get default`', 'يعرض default gateway', 'نظير `ip route`'],
  ['`arp -a`', 'يعرض ARP cache', 'نظير `ip neigh`'],
  ['`ping`', 'اختبار ICMP', 'من loopback للـ gateway للـ remote IP'],
  ['`traceroute`', 'تتبع المسار', 'نظير `tracert` في Windows'],
  ['`nslookup`', 'اختبار DNS', 'نفس الفكرة في كل الأنظمة'],
]

const gatewayScenarioRows: string[][] = [
  ['Gateway صحيح', '`192.168.1.1` جوّه `192.168.1.0/24`', 'ARP للـ gateway ينجح والـ packet يخرج للإنترنت'],
  ['Gateway ناقص', 'Default gateway فاضي', 'الـ LAN شغال؛ أي عنوان بعيد يفشل'],
  ['Gateway في subnet تانية', '`192.168.2.1` مع client `/24`', 'الـ client يعتبره بعيد وARP مش هيوصل له'],
  ['Gateway unreachable', 'الـ IP مكتوب بس الراوتر down أو VLAN غلط', 'ARP للـ gateway يفشل؛ مفيش remote traffic'],
]

const workflowRows: string[][] = [
  ['1', 'Interface status', 'الـ adapter شغال ومفيش cable/Wi-Fi problem', 'ما بيثبتش إن فيه IP صحيح'],
  ['2', 'Assigned IP', 'فيه عنوان IPv4 صالح', 'ما بيثبتش إن العنوان صح للشبكة'],
  ['3', 'Mask / prefix', 'تصنيف الـ network صحيح', 'ما بيثبتش إن الـ gateway موجود'],
  ['4', 'Default gateway', 'فيه next hop للشبكات البعيدة', 'ما بيثبتش إن الراوتر يوصل للإنترنت'],
  ['5', 'DNS server', 'فيه عنوان DNS مكتوب', 'ما بيثبتش إن DNS شغال'],
  ['6', '`ping 127.0.0.1`', 'TCP/IP stack شغال', 'ما بيثبتش إن الكابل أو الشبكة شغالة'],
  ['7', '`ping` own IP', 'العنوان اتخصّص للواجهة', 'ما بيثبتش إنك توصل لغيرك'],
  ['8', '`ping` same subnet', 'الـ LAN والـ ARP شغالين', 'ما بيثبتش إن الـ gateway شغال'],
  ['9', '`ping` gateway', 'الـ L3 path للراوتر شغال', 'ما بيثبتش إن الإنترنت شغال'],
  ['10', '`ping` remote IP', 'الـ routing والـ WAN شغالين', 'ما بيثبتش إن الأسماء بتتحل'],
  ['11', '`nslookup` hostname', 'DNS resolution شغال', 'ما بيثبتش إن التطبيق نفسه شغال'],
  ['12', '`tracert` / `traceroute`', 'بيحدد فين المسار بيقف', 'مش بيصلح المشكلة؛ بيوضّح مكانها'],
]

const troubleRows: string[][] = [
  ['A', 'No IP address', '`0.0.0.0` أو مفيش IPv4', 'DHCP معطّل أو مفيش server', 'افحص adapter و`ipconfig /renew`', 'عنوان صالح يظهر'],
  ['B', 'APIPA', '`169.254.12.34`', 'مفيش DHCP reply', 'افحص link و DHCP server وscope', 'Lease حقيقي يظهر'],
  ['C', 'Wrong gateway', 'local شغال وremote فاشل', 'Gateway غلط أو بره الـ subnet', 'صحّح gateway وافحص `ip route`', 'remote IP يشتغل'],
  ['D', 'DNS failure', '`ping 8.8.8.8` شغال واسم فاشل', 'DNS غلط أو unreachable', '`nslookup` و `ipconfig /all`', 'الاسم يتحل لـ IP'],
  ['E', 'Wrong mask', '`/24` بدل `/25` مثلاً', 'Client يصنّف عنوان بعيد كـ local', 'صحّح الـ mask/prefix', 'ARP والطريق يصحّوا'],
  ['F', 'Interface disabled', 'Adapter `Disabled` أو `DOWN`', 'User عطّله أو driver/MS denied', 'فعّله أو افحص `Get-NetAdapter` / `ip link`', 'Interface يبقى UP'],
]

const interfaceDiffRows: string[][] = [
  ['Disabled', 'الـ adapter مطفي من إعدادات النظام', 'Windows: Disabled في Network Connections', 'مفيش link ومفيش IP'],
  ['Disconnected', 'الكابل مقطوع أو الـ Wi-Fi مش متصل', 'Windows: Network cable unplugged', 'مفيش link resolved'],
  ['No valid IP config', 'الواجهة UP بس العنوان غلط أو APIPA أو فاضي', 'مفيش gateway/DHCP صحيح', 'Link شغال؛ الـ Layer 3 فيه مشكلة'],
]

const commandMapRows: string[][] = [
  ['Inspect IP addresses', '`ipconfig /all`', '`ip addr` / `hostname -I`', '`ifconfig` / `ipconfig getifaddr`'],
  ['Inspect interfaces', '`Get-NetAdapter` / `ipconfig /all`', '`ip link` / `nmcli device status`', '`ifconfig` / `networksetup -listallnetworkservices`'],
  ['Default gateway', '`ipconfig /all` / `route print`', '`ip route`', '`route -n get default`'],
  ['DNS servers', '`ipconfig /all` / `nslookup`', '`resolvectl status` / `nslookup`', '`networksetup -getdnsservers` / `scutil --dns`'],
  ['ARP / neighbor cache', '`arp -a`', '`ip neigh`', '`arp -a`'],
  ['Connectivity test', '`ping`', '`ping`', '`ping`'],
  ['DNS test', '`nslookup example.com`', '`nslookup example.com`', '`nslookup example.com`'],
  ['Route to remote', '`tracert 8.8.8.8`', '`traceroute 8.8.8.8`', '`traceroute 8.8.8.8`'],
]

export const topic110Lesson: Lesson = {
  topicId: '1.10',
  title: 'Verify IP Parameters on Client Operating Systems',
  description:
    'في الدرس ده هنتعلّم نتحقق من إعدادات IP على أجهزة العميل: Windows و Linux و macOS. هنقرأ ipconfig وipconfig /all وip addr وip route وifconfig وnetworksetup، ونفهم الـ output الحقيقي لكل أمر. كمان هنشرح Default Gateway وDNS وDHCP وAPIPA خطوة بخطوة، مع 12 خطوة لتشخيص الاتصال ولابين عمليين وأسئلة امتحان.',
  estimatedTime: '~120 دقيقة',
  steps: [
    {
      id: 'what',
      title: 'إيه إعدادات IP على العميل وليه بنفحصها؟',
      short: 'مفهوم الدرس',
      blocks: [
        {
          type: 'paragraph',
          text: 'قبل ما أي client يوصل بالإنترنت أو بشبكة الشركة، لازم تكون إعداداته مظبوطة. ك administrators بنفحص الإعدادات دي عشان نعرف هل المشكلة في الجهاز ولا في الراوتر ولا في DNS. الدرس ده عن client-side verification، مش عن أوامر Cisco IOS؛ هنتعلم نقرأ أوامر Windows و Linux و macOS بس.',
        },
        {
          type: 'table',
          headers: ['Parameter', '�إيه دوره؟', 'مثال', 'ليه مهم؟'],
          rows: parameterRows,
        },
        { type: 'diagram', id: 'client-config-overview', caption: 'Client → Gateway → DNS → Remote server: كل parameter له دور.' },
        {
          type: 'code',
          label: 'Example configuration',
          language: 'text',
          code: `IPv4 Address:       192.168.1.100
Subnet Mask:        255.255.255.0
Default Gateway:    192.168.1.1
DNS Server:         8.8.8.8
DHCP Server:        192.168.1.1
MAC Address:        00-1A-2B-3C-4D-5E`,
        },
        {
          type: 'steps',
          items: [
            { title: '1 — IP + Mask', text: '`192.168.1.100` مع `255.255.255.0` يعني الـ client جوّه `192.168.1.0/24`. أي عنوان في نفس المدى يبقى local.' },
            { title: '2 — Gateway', text: 'أي destination بره الـ /24 زي `8.8.8.8` لازم يروح لـ `192.168.1.1`. الـ gateway لازم يكون جوّه نفس الـ subnet.' },
            { title: '3 — DNS', text: 'الإنسان بيكتب `example.com`، والـ DNS `8.8.8.8` بيحوّله لـ IP. ده غير الـ gateway تماماً.' },
            { title: '4 — DHCP + MAC', text: 'الـ DHCP Server قدّم الإعدادات، والـ MAC Address بيستخدم جوّه الـ LAN عشان يوصل الـ frame للـ adapter الصح.' },
            { title: '5 — Interface', text: 'كلده مش هينفع لو الواجهة DOWN أو مفيش connection. عشان كده بنفحص الـ interface أولاً.' },
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'مثال عملي',
          text: 'لو الـ gateway اتكتب `192.168.2.1` بدل `192.168.1.1`، الـ client هيحاول يوصل لعنوان بره الـ /24، فالـ ARP للـ gateway مش هينجح. النتيجة: الـ ping للجيران شغال لكن الإنترنت فاشل.',
        },
        {
          type: 'table',
          headers: ['Parameter ناقص أو غلط', 'إيه اللي هيحصل؟', 'أثره', 'الفحص'],
          rows: missingParameterRows,
        },
      ],
    },
    {
      id: 'how',
      title: 'إيه اللي بيحصل جوّه العميل؟',
      short: 'كيف يعمل',
      blocks: [
        {
          type: 'paragraph',
          text: 'الـ client بياخد القرار في كل packet: هل الـ destination جوّه شبكتي ولا بعيد؟ الـ Subnet Mask أو الـ Prefix Length بيحددوا الإجابة. لو local بيعمل ARP ويرسل مباشرة؛ لو remote بيبعت للـ default gateway.',
        },
        { type: 'diagram', id: 'default-gateway-path', caption: 'من القرار الـ on-link لحد إرسال الـ packet للـ gateway.' },
        {
          type: 'table',
          headers: ['حالة الـ Gateway', 'المثال', 'النتيجة'],
          rows: gatewayScenarioRows,
        },
        { type: 'diagram', id: 'dns-resolution-flow', caption: 'DNS بيحوّل الاسم لـ IP قبل ما الاتصال يبدأ.' },
        {
          type: 'callout',
          tone: 'info',
          title: 'Gateway vs DNS',
          text: 'الـ Default Gateway بيخرج بالـ packet من الشبكة المحلية للشبكات التانية. الـ DNS Server بيترجم الاسم لـ IP. لو `ping 8.8.8.8` شغال و`ping example.com` فاشل، فالمشكلة في DNS مش في الـ gateway.',
        },
        { type: 'diagram', id: 'dhcp-lease', caption: 'DORA و fields الـ lease اللي لازم تتحقق منها.' },
        {
          type: 'steps',
          items: [
            { title: 'D — Discover', text: 'الـ client ينادي: فيه DHCP server؟' },
            { title: 'O — Offer', text: 'الـ server يعرض IP وmask وgateway وDNS.' },
            { title: 'R — Request', text: 'الـ client يطلب استخدام العرض ده.' },
            { title: 'A — ACK', text: 'الـ server يأكّد، والـ client يسجّل Lease Obtained وLease Expires.' },
          ],
        },
        { type: 'diagram', id: 'apipa-troubleshooting', caption: 'لما DHCP ما يردش: APIPA 169.254.12.34.' },
        {
          type: 'callout',
          tone: 'danger',
          title: 'APIPA مش lease',
          text: '`169.254.0.0/16` هو عنوان link-local بيختاره Windows لو مفيش DHCP. بيسمح باتصال محدود جداً على نفس الـ link، ومفيش gateway طبيعي.ده معناه روح دور على DHCP أو Layer 2، مش إن الشبكة تمام.',
        },
      ],
    },
    {
      id: 'packet',
      title: 'قراءة الـ output على مستوى العميل',
      short: 'Packet و config',
      blocks: [
        {
          type: 'paragraph',
          text: 'هنا بندرس command outputs نفسها. الـ outputs دي representative/simulated لأغراض التعلم؛ ما نفترضش إنها اتنفذت على أجهزة حقيقية. المهم إنك تعرف تقرأ كل سطر وتربطه بالـ parameter اللي اتكلمنا عنه.',
        },
        { type: 'diagram', id: 'windows-ipconfig-compare', caption: 'مقارنة `ipconfig` و`ipconfig /all` field by field.' },
        {
          type: 'code',
          label: 'Windows — representative ipconfig',
          language: 'powershell',
          code: `C:\\Users\\Student>ipconfig

Windows IP Configuration

Ethernet adapter Ethernet:

   Connection-specific DNS Suffix  . :
   IPv4 Address. . . . . . . . . . . : 192.168.1.100
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1`,
        },
        {
          type: 'code',
          label: 'Windows — representative ipconfig /all',
          language: 'powershell',
          code: `C:\\Users\\Student>ipconfig /all

Windows IP Configuration

   Host Name . . . . . . . . . . . . : PC1
   Primary Dns Suffix  . . . . . . . :

Ethernet adapter Ethernet:

   Physical Address. . . . . . . . . : 00-1A-2B-3C-4D-5E
   DHCP Enabled. . . . . . . . . . . : Yes
   Autoconfiguration Enabled . . . . : Yes
   IPv4 Address. . . . . . . . . . . : 192.168.1.100(Preferred)
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Lease Obtained. . . . . . . . . . : 21 November 2026 09:10:15
   Lease Expires . . . . . . . . . . : 22 November 2026 09:10:14
   Default Gateway . . . . . . . . . : 192.168.1.1
   DHCP Server . . . . . . . . . . . : 192.168.1.1
   DNS Servers . . . . . . . . . . . : 8.8.8.8
   IPv6 Address. . . . . . . . . . . : 2001:db8:1::100(Preferred)
   Link-local IPv6 Address . . . . . : fe80::21a:2bff:fe3c:4d5e%5(Preferred)`,
        },
        {
          type: 'table',
          headers: ['Field', 'الترجمة', 'المثال', 'إيه اللي بيقوله؟'],
          rows: windowsOutputFields,
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'إيه الناقص من ipconfig العادي؟',
          text: 'الـ `ipconfig` السريع بيوري IPv4 و Mask و Gateway بس. مفيش Host Name ولا MAC ولا DHCP state ولا Lease times ولا DNS servers. عشان كده في الشغل بنستخدم `ipconfig /all` لما نحتاج دليل كامل.',
        },
        { type: 'diagram', id: 'linux-ip-addr', caption: 'Linux `ip addr` line by line.' },
        {
          type: 'code',
          label: 'Linux — representative ip addr',
          language: 'bash',
          code: `$ ip addr
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
    inet6 ::1/128 scope host
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500
    link/ether 00:1a:2b:3c:4d:5e brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.100/24 brd 192.168.1.255 scope global eth0
    inet6 fe80::21a:2bff:fe3c:4d5e/64 scope link
    inet6 2001:db8:1::100/64 scope global`,
        },
        {
          type: 'steps',
          items: [
            { title: '1: lo', text: 'Loopback interface. العنوان `127.0.0.1/8` للاختبار الداخلي؛ مش واجهة شبكة خارجية.' },
            { title: '2: eth0', text: 'اسم الواجهة. `<UP>` يعني إنها شغالة. الاسم بيختلف بين التوزيعات.' },
            { title: 'link/ether', text: 'الـ MAC Address بصيغة hex مفصولة بنقطتين.' },
            { title: 'inet', text: 'IPv4 address مع prefix length. `192.168.1.100/24` = mask `255.255.255.0`.' },
            { title: 'inet6', text: '`fe80::` link-local و`2001:db8::` global. `scope` بيوضّح المدى.' },
          ],
        },
        { type: 'diagram', id: 'linux-ip-route', caption: 'Linux `ip route` والـ default gateway.' },
        {
          type: 'code',
          label: 'Linux — representative ip route',
          language: 'bash',
          code: `$ ip route
default via 192.168.1.1 dev eth0 proto dhcp metric 100
192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.100 metric 100
169.254.0.0/16 dev eth0 scope link metric 1000`,
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'Default route في Linux',
          text: 'دوّر على السطر اللي بيبدأ بـ `default`. `via 192.168.1.1` هو الـ gateway، و`dev eth0` هي الواجهة اللي هتخرج منها الحزمة. لو مفيش سطر `default`، الـ client مش هيعرف يوصل لشبكة بعيدة.',
        },
        { type: 'diagram', id: 'macos-config-overview', caption: 'macOS: ifconfig و ipconfig و networksetup.' },
        {
          type: 'code',
          label: 'macOS — representative outputs',
          language: 'bash',
          code: `$ ifconfig en0
en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
    ether 00:1a:2b:3c:4d:5e
    inet 192.168.1.100 netmask 0xffffff00 broadcast 192.168.1.255
    inet6 fe80::21a:2bff:fe3c:4d5e%en0 prefixlen 64 scopeid 0x5
    status: active

$ ipconfig getifaddr en0
192.168.1.100

$ networksetup -getinfo Wi-Fi
DHCP Configuration
IP address: 192.168.1.100
Subnet mask: 255.255.255.0
Router: 192.168.1.1
DNS Servers: 8.8.8.8`,
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'macOS naming',
          text: '`en0` غالباً Wi-Fi أو Ethernet حسب طراز Mac والإعداد. كمان اسم خدمة الشبكة زي `Wi-Fi` مش مضمون. استخدم `networksetup -listallnetworkservices` أو `ifconfig` عشان تتأكد قبل ما تفترض.',
        },
      ],
    },
    {
      id: 'config',
      title: 'أوامر Client OS بالتفصيل',
      short: 'أوامر الأنظمة',
      blocks: [
        {
          type: 'paragraph',
          text: 'الفكرة واحدة في كل نظام: اعرف العنوان والماسك والـ gateway والـ DNS والمصدر. بس اسم الأمر وشكل الـ output بيختلفوا. هنا بنقسّم الأوامر لكل نظام على حدة.',
        },
        { type: 'table', headers: ['الأمر', 'إيه بيعمل؟', 'متى تستخدمه؟', 'النتيجة المتوقعة', 'أخطاء شائعة'], rows: windowsDhcpRows },
        {
          type: 'callout',
          tone: 'info',
          title: 'لازم تفتح Command Prompt كـ Administrator؟',
          text: 'غالباً أوامر الفحص زي `ipconfig` و`ipconfig /all` و`nslookup` و`ping` و`tracert` شغالة من غير admin. أوامر التغيير زي release/renew و flushing DNS ممكن تحتاج صلاحيات أعلى حسب إعدادات الجهاز.',
        },
        {
          type: 'table',
          headers: ['الأمر', 'الوظيفة', 'فائدة في التشخيص'],
          rows: windowsExtraRows,
        },
        {
          type: 'code',
          label: 'Windows — representative verification',
          language: 'powershell',
          code: `C:\\Users\\Student>getmac

Physical Address    Transport Name
===================  ==========================================================
00-1A-2B-3C-4D-5E    \\Device\\Tcpip_{...}

C:\\Users\\Student>arp -a

Interface: 192.168.1.100 --- 0x5
  Internet Address      Physical Address      Type
  192.168.1.1           00-11-22-33-44-55     dynamic

C:\\Users\\Student>nslookup example.com
Server:  dns.google
Address:  8.8.8.8

Non-authoritative answer:
Name:    example.com
Address:  93.184.216.34

C:\\Users\\Student>ping 192.168.1.1
Pinging 192.168.1.1 with 32 bytes of data:
Reply from 192.168.1.1: bytes=32 time=2ms TTL=64

C:\\Users\\Student>tracert 8.8.8.8
Tracing route to 8.8.8.8 over a maximum of 30 hops
  1     2 ms     1 ms     1 ms  192.168.1.1
  2    12 ms    11 ms    12 ms  10.0.0.1`,
        },
        {
          type: 'paragraph',
          text: 'PowerShell أوامرها cmdlets، يعني `Get-...` بدل أوامر الـ Command Prompt. في GCB هتقابل Command Prompt غالباً، بس لازم تعرف إن PowerShell بيعطي نفس المعلومات بشكل منظّم.',
        },
        { type: 'table', headers: ['PowerShell cmdlet', 'بتوري إيه؟', 'ملاحظة'], rows: powerShellRows },
        {
          type: 'code',
          label: 'PowerShell examples',
          language: 'powershell',
          code: `PS> Get-NetIPConfiguration
PS> Get-NetIPAddress
PS> Get-NetAdapter
PS> Get-DnsClientServerAddress`,
        },
        {
          type: 'paragraph',
          text: 'في Linux، `ip` commands هي الحديثة.Command availability وoutput بيختلفوا حسب التوزيعة و service إدارة الشبكة. متفترضش إن كل جهاز فيه NetworkManager أو systemd-resolved.',
        },
        { type: 'table', headers: ['الأمر', 'إيه بيعمل؟', 'الاستخدام'], rows: linuxCommandsRows },
        {
          type: 'code',
          label: 'Linux — representative checks',
          language: 'bash',
          code: `$ ip link
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> ...

$ ip neigh
192.168.1.1 dev eth0 lladdr 00:11:22:33:44:55 REACHABLE

$ ip -6 addr
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP>
    inet6 fe80::21a:2bff:fe3c:4d5e/64 scope link
    inet6 2001:db8:1::100/64 scope global

$ ip -6 route
2001:db8:1::/64 dev eth0 proto kernel metric 256
fe80::/64 dev eth0 proto kernel metric 256
default via fe80::1 dev eth0 metric 1024

$ hostname -I
192.168.1.100 2001:db8:1::100

$ resolvectl status
Global
  DNS Servers: 8.8.8.8
Link 2 (eth0)
  Current Scopes: DNS
  DNS Servers: 8.8.8.8

$ nmcli device status
DEVICE  TYPE      STATE      CONNECTION
eth0    ethernet  connected  Wired connection 1

$ nmcli connection show
NAME                UUID                                  TYPE      DEVICE
Wired connection 1  ...                                   ethernet  eth0

$ nmcli device show eth0
IP4.ADDRESS[1]: 192.168.1.100/24
IP4.GATEWAY: 192.168.1.1
IP4.DNS[1]: 8.8.8.8`,
        },
        {
          type: 'callout',
          tone: 'tip',
          title: '/etc/resolv.conf',
          text: 'في بعض التوزيعات `cat /etc/resolv.conf` بيوري DNS servers. بس في أنظمة حديثة كتير الملف ده symlink بتديره خدمة زي systemd-resolved أو NetworkManager، فما تعدّلش فيه يدوي من غير ما تعرف مين بيديره. استخدم `resolvectl status` لما يكون متاح.',
        },
        {
          type: 'paragraph',
          text: 'في macOS، `ifconfig` بيوري معلومات الواجهة، و`ipconfig` (أمر خاص بـ macOS مش Windows) بيرجّع IPv4 أو DHCP details. `networksetup` بيقرأ إعدادات خدمة الشبكة، و`scutil --dns` بيوري DNS configuration.',
        },
        { type: 'table', headers: ['الأمر', 'إيه بيعمل؟', 'ملاحظة'], rows: macCommandsRows },
        {
          type: 'code',
          label: 'macOS — representative DNS and route',
          language: 'bash',
          code: `$ networksetup -listallnetworkservices
An asterisk (*) denotes that a network service is disabled.
Wi-Fi
Ethernet

$ networksetup -getdnsservers Wi-Fi
8.8.8.8

$ scutil --dns
DNS configuration
resolver #1
  nameserver[0] : 8.8.8.8
  if_index : 5 (en0)

$ route -n get default
  route to: default
destination: default
   gateway: 192.168.1.1
 interface: en0

$ arp -a
? (192.168.1.1) at 0:11:22:33:44:55 on en0 [ethernet]`,
        },
      ],
    },
    {
      id: 'verify',
      title: 'خطوات تحقق عملية ونتائج متوقعة',
      short: 'التحقق',
      blocks: [
        {
          type: 'paragraph',
          text: 'الترتيب ده بيخليك ما تضيعش وقت. ابدأ بالحاجات الأساسية، وبعدين اختبر الاتصال درجة درجة. كل اختبار بيثبت حاجة وما بيثبتش حاجات تانية.',
        },
        { type: 'diagram', id: 'connectivity-workflow', caption: '12 خطوة من Interface status لـ traceroute.' },
        { type: 'table', headers: ['#', 'الاختبار', 'إيه بيتأكد؟', 'إيه مش بيتأكد؟'], rows: workflowRows },
        {
          type: 'steps',
          items: [
            { title: '1 — Interface UP', text: 'Windows: `Get-NetAdapter` أو إعدادات Network Connections. Linux: `ip link`. macOS: `ifconfig`. DOWN أو Disabled يوقف كل حاجة.' },
            { title: '2 — IP present', text: 'دوّر على IPv4 مش `0.0.0.0` أو APIPA. `ipconfig /all` بيقول كمانDHCP Enabled والـ lease.' },
            { title: '3 — Mask / prefix', text: 'قارن `/24` مع `255.255.255.0`. غلط الـ mask بيغيّر قرار local/remote.' },
            { title: '4 — Gateway', text: 'لازم يكون جوّه نفس الـ subnet. Windows: `ipconfig /all` · Linux: `ip route` · macOS: `route -n get default`.' },
            { title: '5 — DNS', text: 'تأكد من عنوان DNS ومصدره (DHCP أو manual) قبل ما تلوم الاسم.' },
            { title: '6 — loopback', text: '`ping 127.0.0.1` بيختبر TCP/IP stack بس، مش الشبكة.' },
            { title: '7 — own IP', text: '`ping 192.168.1.100` بيأكد إن العنوان اتطبّق على الواجهة.' },
            { title: '8 — same subnet', text: 'Ping لجهاز جوّه `/24` بيختبر ARP والـ LAN.' },
            { title: '9 — gateway', text: 'Ping لـ `192.168.1.1` بيأكد إن الـ L3 path للراوتر شغال.' },
            { title: '10 — remote IP', text: '`ping 8.8.8.8` بيأكد الـ routing والـ WAN من غير DNS.' },
            { title: '11 — DNS', text: '`nslookup example.com` بيأكد تحليل الاسم. لو فشل والـ remote IP شغال، المشكلة DNS.' },
            { title: '12 — path', text: '`tracert` / `traceroute` بيوضّح فين بالظبط بيقف المسار.' },
          ],
        },
        { type: 'diagram', id: 'os-command-compare', caption: 'نفس المهمة، أمر مختلف في كل نظام.' },
        {
          type: 'callout',
          tone: 'tip',
          title: 'قاعدة ذهبية',
          text: 'لو `ping 8.8.8.8` شغال بس `ping example.com` فاشل، روح للـ DNS. لو الـ gateway نفسه مش بيستجيب، متسألش عن DNS خالص. دايماً أصلح أقل طبقة فيها مشكلة الأول.',
        },
      ],
    },
    {
      id: 'mistakes',
      title: 'أخطاء شائعة وتشخيص منظّم',
      short: 'التشخيص',
      blocks: [
        {
          type: 'callout',
          tone: 'info',
          title: 'Decision flow',
          text: '`1)` Interface UP؟ · `2)` IP صالح؟ · `3)` Mask/prefix صح؟ · `4)` Gateway جوّه الـ subnet؟ · `5)` DNS مكتوب؟ · `6)` loopback · `7)` own IP · `8)` same subnet · `9)` gateway · `10)` remote IP · `11)` nslookup · `12)` tracert. قف عند أول failure.',
        },
        { type: 'table', headers: ['Scenario', 'المشكلة', 'العرَض', 'السبب المحتمل', 'التحقق', 'النتيجة'], rows: troubleRows },
        {
          type: 'table',
          headers: ['الحالة', 'المعنى', 'كيف تظهر؟', 'النتيجة'],
          rows: interfaceDiffRows,
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'Scenario A — No IP',
          text: '`ipconfig` بيوري `0.0.0.0` أو مفيش IPv4. افحص إذا كان DHCP Enabled، ثم جرّب `ipconfig /renew`. لو لسه مفيش عنوان، دور على DHCP server والـ scope والـ VLAN.',
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Scenario B — APIPA',
          text: '`169.254.12.34` مع mask `255.255.0.0` وغالباً gateway فاضي. الأسباب: كابل/واي فاي، DHCP down، scope ممتلئ، أو relaymissing. ده مش DHCP lease طبيعي.',
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'Scenario C — Wrong gateway',
          text: 'العميل يقدر يوصل لجيران `192.168.1.x` بس مش لـ `8.8.8.8`. في Windows دوّر على Default Gateway في `ipconfig /all`؛ في Linux `ip route`؛ في macOS `route -n get default`. لو `192.168.2.1` مع `/24`، الجateway غلط.',
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Scenario D — DNS failure',
          text: '`ping 8.8.8.8` شغال و`nslookup example.com` فاشل. افحص DNS Server في `ipconfig /all` أو `resolvectl status` أو `scutil --dns`، وجرّب `ipconfig /flushdns` لو فيه cache قديم. متعملش renew للـ IP عشان DNS بس.',
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Scenario E — Wrong mask',
          text: 'العميل `192.168.1.100` بس الماسك غلط، فمثلاً يعتبر `192.168.1.200` remote أو يعتبر عنوان بعيد local. النتيجة ARP للـ gateway في غير مكانه أو محاولة وصول مباشر لعنوان مش على الـ link. صحّح الـ mask/prefix.',
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Scenario F — Interface disabled',
          text: 'Windows: `Get-NetAdapter` يوري Status `Disabled` أو disconnected. Linux: `ip link` يوري `DOWN` أو `NO-CARRIER`. macOS: `ifconfig` يوري status inactive.Disabled = مطفي من النظام؛ Disconnected = مفيش link؛ No valid IP = الواجهة شغالة بس إعدادات Layer 3 غلط.',
        },
      ],
    },
    {
      id: 'lab',
      title: 'لابان عمليان',
      short: 'لاب',
      blocks: [
        {
          type: 'paragraph',
          text: 'الأوامر والـ outputs هنا تعليمية/محاكاة؛ ما نفترضش إنها نُفذت على أجهزة حقيقية. الهدف إنك تتدرب على ترتيب الفحص وتفسير النتائج.',
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Lab 1 — Windows IP Configuration Investigation',
          text: 'البيئة: Windows client متصل بشبكة محلية وفي DHCP-enabled router. الهدف: تجمع كل إعدادات IP وتختبر الاتصال خطوة بخطوة.',
        },
        {
          type: 'steps',
          items: [
            { title: '1', text: 'افتح Command Prompt (Win + R → cmd).' },
            { title: '2', text: 'اكتب `ipconfig` وسجّل IPv4 Address و Subnet Mask و Default Gateway.' },
            { title: '3', text: 'اكتب `ipconfig /all` وسجّل Host Name و Physical Address و DHCP Enabled و Lease times و DHCP Server و DNS Servers و IPv6.' },
            { title: '4', text: 'قارن الـ MAC من `getmac` بالـ Physical Address في `ipconfig /all`.' },
            { title: '5', text: 'شغّل `arp -a` ودوّر على MAC بتاع الـ gateway.' },
            { title: '6', text: 'اعمل `ping 192.168.1.1` للـ gateway.' },
            { title: '7', text: 'اعمل `ping 8.8.8.8` لاختبار remote IP من غير DNS.' },
            { title: '8', text: 'اعمل `nslookup example.com` لاختبار DNS.' },
            { title: '9', text: 'اعمل `tracert 8.8.8.8` وشوف أول hop.' },
            { title: '10', text: 'لو فيه مشكلة DNS، جرّب `ipconfig /flushdns` ثم `nslookup` تاني. لو فيه مشكلة DHCP، جرّب `ipconfig /renew`.' },
            { title: '11', text: 'اكتب تقرير قصير: إيه المصدر (DHCP ولا static)، وإيه اللي بيشتغل وإيه اللي فاشل.' },
            { title: '12', text: 'راجع النتائج مع الجدول والـ output أدناه.' },
          ],
        },
        {
          type: 'code',
          label: 'Lab 1 — representative consolidated output',
          language: 'powershell',
          code: `C:\\>ipconfig /all
   Host Name . . . . . . . . . : PC1
   Physical Address . . . . . : 00-1A-2B-3C-4D-5E
   DHCP Enabled . . . . . . . : Yes
   IPv4 Address . . . . . . . : 192.168.1.100(Preferred)
   Subnet Mask . . . . . . . . : 255.255.255.0
   Lease Obtained. . . . . . . : 21 November 2026 09:10:15
   Lease Expires . . . . . . . : 22 November 2026 09:10:14
   Default Gateway . . . . . . : 192.168.1.1
   DHCP Server . . . . . . . . : 192.168.1.1
   DNS Servers . . . . . . . . : 8.8.8.8

C:\\>ping 192.168.1.1
Reply from 192.168.1.1: bytes=32 time=2ms TTL=64

C:\\>nslookup example.com
Server:  dns.google
Address:  8.8.8.8
Name:    example.com
Address:  93.184.216.34`,
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Expected observations — Lab 1',
          text: 'الـ IPv4 يبدأ بـ 192.168.1 والـ mask `/24` والـ gateway داخل نفس الشبكة. الـ DHCP Server ظاهر والـ lease times منطقية. pingGateway و nslookupexample.com ناجحين. لو ظهر 169.254.x.x، ارجع لخطوة DHCP.',
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Lab 2 — Cross-Platform Troubleshooting',
          text: 'قارن كيف تفحص نفس المعلومات على Windows و Linux و macOS. استخدم الجدول، ثم شخّص الـ faulty configuration في السؤال.',
        },
        { type: 'table', headers: ['المهمة', 'Windows', 'Linux', 'macOS'], rows: commandMapRows },
        {
          type: 'steps',
          items: [
            { title: '1', text: 'Inspect IP addresses: `ipconfig /all` / `ip addr` / `ifconfig`.' },
            { title: '2', text: 'Inspect interfaces: `Get-NetAdapter` / `ip link` / `ifconfig`.' },
            { title: '3', text: 'Identify default gateway: `ipconfig /all` / `ip route` / `route -n get default`.' },
            { title: '4', text: 'Identify DNS: `ipconfig /all` / `resolvectl status` / `scutil --dns`.' },
            { title: '5', text: 'ARP / neighbor: `arp -a` / `ip neigh` / `arp -a`.' },
            { title: '6', text: 'Connectivity: `ping` loopback → own IP → gateway → remote IP.' },
            { title: '7', text: 'DNS: `nslookup example.com`.' },
            { title: '8', text: 'Route to remote: `tracert` أو `traceroute`.' },
          ],
        },
        {
          type: 'code',
          label: 'Lab 2 — simulated faulty output',
          language: 'powershell',
          code: `C:\\>ipconfig
Windows IP Configuration

Ethernet adapter Ethernet:
   IPv4 Address. . . . . . . . . . . : 169.254.12.34
   Subnet Mask . . . . . . . . . . . : 255.255.0.0
   Default Gateway . . . . . . . . . :

C:\\>ping 8.8.8.8
Pinging 8.8.8.8 with 32 bytes of data:
Destination host unreachable.`,
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'المطلوب منك',
          text: 'شخّص المشكلة، اذكر أمرين تؤكد بيهم تشخيصك، واكتب خطوات الإصلاح. الإجابة: الـ client عنده APIPA `169.254.12.34` يعني مفيش DHCP reply. affirm تأكد بـ `ipconfig /all` (DHCP Enabled والـ lease فاضي) و `ipconfig /renew`. افحص الكابل/Wi-Fi والـ DHCP server والـ scope والـ VLAN، وبعد renew لازم يظهر عنوان `192.168.1.x` وجateway `192.168.1.1`.',
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Complete solution — Lab 2',
          text: '1) الواجهة فيها APIPA، مش lease طبيعي · 2) مفيش default gateway فمفيش remote traffic · 3) نفّذ 12-step workflow وابدأ من link و DHCP · 4) بعد الإصلاح: `ipconfig /all` يوري DHCP Server `192.168.1.1` وLease Obtained/Expires · 5) `ping 192.168.1.1` ثم `ping 8.8.8.8` ثم `nslookup example.com` لازم يشتغلوا.',
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
          text: 'كل سؤال أربع إجابات وزر **تحقق من الإجابة**. مفيش feedback قبل Submission، والزر مقفول لحد ما تختار إجابة. بعد Submission الأزرار بتتقفل.',
        },
        {
          type: 'quiz',
          questions: [
            {
              id: 'q1',
              prompt: 'أي معلومة بتظهر في `ipconfig /all` ومش بتظهر في `ipconfig` العادي على Windows؟',
              options: [
                'IPv4 Address و Subnet Mask بس',
                'Default Gateway بس',
                'MAC Address و DHCP Enabled و DNS Servers و Lease times',
                'مفيش فرق بين الأمرين',
              ],
              correctIndex: 2,
              requireSubmit: true,
              explanation:
                'الصح هو **(C)**. `ipconfig /all` بيضيف Host Name و Physical Address (MAC) و DHCP Enabled و Lease Obtained / Expires و DHCP Server و DNS Servers و IPv6. `(A)` و`(B)` موجودين في الأمرين الأساسيين، و`(D)` غلط.',
            },
            {
              id: 'q2',
              prompt: 'في Linux، إيه السطر اللي بيقول إن الـ Default Gateway هو `192.168.1.1` في `ip route`؟',
              options: [
                '`192.168.1.0/24 dev eth0 proto kernel scope link`',
                '`default via 192.168.1.1 dev eth0`',
                '`169.254.0.0/16 dev eth0 scope link metric 1000`',
                '`inet 192.168.1.100/24 brd 192.168.1.255`',
              ],
              correctIndex: 1,
              requireSubmit: true,
              explanation:
                'الصح هو **(B)**. أي سطر بيبدأ بـ `default` هو default route، و`via` بيحدد الـ gateway. `(A)` connected route، `(C)` APIPA route، و`(D)` سطر من `ip addr` مش `ip route`.',
            },
            {
              id: 'q3',
              prompt: 'Client `192.168.1.100/24` يقدر يوصل لجيرانه بس مش للإنترنت. إيه الاحتمال الأقوى؟',
              options: [
                'DNS Server غلط',
                'Default Gateway ناقص أو غلط',
                'Subnet Mask طويل جداً',
                'MAC Address مكرر',
              ],
              correctIndex: 1,
              requireSubmit: true,
              explanation:
                'الصح هو **(B)**. الوصول المحلي شغال يعني الـ LAN والـ ARP تمام، بس غياب أو خطأ الـ gateway بيمنع الوصول للشبكات البعيدة. DNS بيظهر فقط لو الـ remote IP شغال والأسماء فاشلة.',
            },
            {
              id: 'q4',
              prompt: '`ping 8.8.8.8` ناجح بس `ping example.com` فاشل. إيه ترتيب الفحص الصح؟',
              options: [
                'بدّل الـ default gateway ثم جرّب تاني',
                'افحص DNS Server و`nslookup example.com` وجرّب flush DNS cache',
                'اعمل `ipconfig /release` و`/renew` فوراً',
                'بدّل الـ Subnet Mask لـ `/16`',
              ],
              correctIndex: 1,
              requireSubmit: true,
              explanation:
                'الصح هو **(B)**. وصول الـ IP بيأكد إن الـ gateway والـ routing شغالين، فالمشكلة في name resolution. افحص DNS address و`nslookup`، وجرّب `ipconfig /flushdns` لو فيه cache قديم. `/renew` بيخص DHCP مش DNS.',
            },
            {
              id: 'q5',
              prompt: 'شفت `169.254.12.34` في `ipconfig`. إيه الاستنتاج الصح؟',
              options: [
                'ده DHCP lease طبيعي من الراوتر',
                'ده APIPA: غالباً مفيش DHCP reply ولازم تبحث في DHCP أو Layer 2',
                'ده عنوان loopback',
                'ده Default Gateway',
              ],
              correctIndex: 1,
              requireSubmit: true,
              explanation:
                'الصح هو **(B)**. نطاق `169.254.0.0/16` هو APIPA اللي بيختاره Windows لما DHCP ما يردش. مش lease طبيعي وغالباً مفيش gateway. افحص الواجهة و DHCP server و scope و VLAN قبل أي حاجة تانية.',
            },
          ],
        },
      ],
    },
    {
      id: 'summary',
      title: 'خلاصة ونقاط مهمة قبل الامتحان',
      short: 'الخلاصة',
      blocks: [
        {
          type: 'paragraph',
          text: 'المعلومات واحدة في كل نظام، بس الأمر بيختلف. احفظ الجداول دي كمرجع سريع قبل الامتحان والشغل.',
        },
        {
          type: 'table',
          headers: ['النظام', 'الأوامر المهمة'],
          rows: [
            [
              'Windows',
              '`ipconfig` · `ipconfig /all` · `ipconfig /release` · `ipconfig /renew` · `ipconfig /flushdns` · `getmac` · `arp -a` · `route print` · `nslookup` · `ping` · `tracert`',
            ],
            [
              'Linux',
              '`ip addr` · `ip route` · `ip link` · `ip neigh` · `ip -6 addr` · `ip -6 route` · `hostname -I` · `resolvectl status` · `nmcli device status` · `nmcli connection show` · `nmcli device show`',
            ],
            [
              'macOS',
              '`ifconfig` · `ipconfig getifaddr` · `ipconfig getpacket` · `networksetup` · `scutil --dns` · `route -n get default` · `arp -a` · `ping` · `traceroute` · `nslookup`',
            ],
          ],
        },
        {
          type: 'list',
          items: [
            'IP Address = عنوان الجهاز · Subnet Mask / Prefix = بيحددوا الشبكة · Gateway = للشبكات البعيدة · DNS = لتحليل الأسماء.',
            'DHCP Server و Lease Obtained / Expires بيقولوا إذا كان العنوان تلقائي ومين قدّمه.',
            'APIPA `169.254.0.0/16` مش DHCP lease؛ بيظهر لما DHCP ما يردش.',
            'MAC Address للـ Layer 2 · ARP/neighbor cache بيحفظ IP ↔ MAC.',
            'الـ interface لازم يكون UP قبل أي فحص IP؛ Disabled مش زي Disconnected مش زي No valid IP.',
            'ترتيب التشخيص: interface → IP → mask → gateway → DNS → loopback → own IP → same subnet → gateway → remote IP → DNS test → tracert.',
            '`ipconfig /flushdns` بيطهّر DNS cache بس ومش بيجدد IP.',
            'Linux/macOS availability وoutput بيختلفوا حسب التوزيعة والخدمة؛ متفترضش NetworkManager أو systemd-resolved في كل جهاز.',
            'macOS: `en0` و `Wi-Fi` أمثلة مش قواعد؛ لازم تتحقق من الأسماء.',
          ],
        },
        {
          type: 'table',
          headers: ['فخ في الامتحان', 'الإجابة الصح'],
          rows: [
            ['`ipconfig /flushdns` بيجدد الـ IP', 'لا، بيطهّر DNS resolver cache بس'],
            ['`ipconfig /release` شغال على كل إعدادات IPv6', 'غالباً مرتبط بـ DHCP-managed IPv4 Adapter'],
            ['الـ DNS Server هو اللي بيوجّه للإنترنت', 'الـ Default Gateway هو اللي بيوجّه؛ DNS بيترجم الأسماء بس'],
            ['`ping 8.8.8.8` ناجح يعني DNS تمام', 'لا، لازم `nslookup example.com` عشان تتأكد'],
            ['`169.254.x.x` DHCP lease', 'لا، APIPA fallback'],
            ['Gateway جوّه subnet تانية تمام', 'لازم يكون جوّه نفس الـ subnet عشان الـ ARP يوصل له'],
            ['`ip route` في Linux بيوري DNS', 'لا، بيوري routes؛ DNS في `resolvectl status` أو `nmcli device show`'],
            ['`ipconfig` في macOS زي Windows', 'لا، macOS `ipconfig getifaddr en0` و `getpacket en0`'],
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'آخر نصيحة',
          text: 'في السيناريوهات العملية والامتحان، ابدأ من الأسفل: الواجهة شغالة؟ عنوان صالح؟ ماسك صح؟ gateway جوّه الـ subnet؟ وبعدين DNS. لو قفزت للـ DNS قبل ما تفحص الـ gateway، هتضيع الوقت.',
        },
      ],
    },
  ],
}
