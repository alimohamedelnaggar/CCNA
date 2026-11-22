import type { Lesson } from '../types'

const deliveryRows: string[][] = [
  ['Unicast', 'One-to-one', 'واجهة واحدة بالظبط', '`PC1 → 2001:DB8:19:1::10`', 'أغلب الاتصالات العادية'],
  ['Multicast', 'One-to-many', 'كل الواجهات اللي انضمت للمجموعة', '`FF02::1`', 'All nodes / routing protocols'],
  ['Anycast', 'One-to-nearest', 'واحدة بس من عدة واجهات بنفس العنوان', '`2001:DB8:19:53::53`', 'DNS موزّع وخدمات عالمية'],
  ['Broadcast IPv4', 'One-to-all', 'كل الأجهزة على الـ link', '`255.255.255.255`', 'مش موجود في IPv6'],
]

const unicastRows: string[][] = [
  ['GUA', '`2000::/3`', 'عالمي وقابل للتوجيه على الإنترنت', '`2001:DB8:19:1::10`'],
  ['LLA', '`FE80::/10`', 'للرابط المحلي فقط؛ الراوتر ما يعبّريش', '`FE80::1`'],
  ['ULA', '`FC00::/7`', 'داخل المنظمة؛ مش للتوجيه العام', '`FD00:1234:5678::1`'],
  ['Loopback', '`::1/128`', 'الجهاز يتكلّم مع نفسه', '`::1`'],
  ['Unspecified', '`::/128`', 'معناه „مفيش عنوان“ في إجراءات معيّنة', '`::`'],
]

const guaLlaUlaRows: string[][] = [
  ['GUA', '`2000::/3`', '`001`', '`2000::` → `3FFF:...`', 'Globally routable', 'WAN + LAN hosts'],
  ['LLA', '`FE80::/10`', '`1111111010`', '`FE80::` → `FEBF:...`', 'One link only', 'NDP + next hop'],
  ['ULA', '`FC00::/7`', '`1111110`', '`FC00::` → `FDFF:...`', 'Organization only', 'Internal servers'],
]

const ulaRows: string[][] = [
  ['Range', '`FC00::/7`', 'مساحة كبيرة للاستخدام المحلي'],
  ['Locally assigned', '`FD00::/8`', 'الجزء اللي بنشوفه غالباً في الشبكات'],
  ['Global ID', '40 bit عشوائي', 'بيقلّل احتمال تكرار البريفكس بين المؤسسات'],
  ['Subnet ID', '16 bit', 'بيقسّم المؤسسة لـ subnets جوّه الـ ULA prefix'],
  ['Interface ID', '64 bit', 'زي باقي عناوين IPv6'],
  ['Internet', 'Not routed', 'لازم يتفلتر على حدود الشبكة زي IPv4 private'],
]

const multicastFieldRows: string[][] = [
  ['Prefix', '8 bit', '`11111111`', '`FF`', 'بيقول إن العنوان multicast'],
  ['Flags', '4 bit', '`0000` well-known / `0001` transient', '`0` في `FF02::1`', 'دائم أو مؤقت'],
  ['Scope', '4 bit', 'حدد مدى الانتشار', '`2` في `FF02::1`', 'link-local scope'],
  ['Group ID', '112 bit', 'معرّف المجموعة', '`1` في `FF02::1`', 'All nodes'],
]

const multicastScopeRows: string[][] = [
  ['`1`', 'Interface-local', 'جوه نفس الـ interface', '`FF01::1`'],
  ['`2`', 'Link-local', 'نفس الـ link / L2 domain', '`FF02::1`, `FF02::2`'],
  ['`3`', 'Realm-local', 'داخل routing realm أو VPN', 'مفهوم عام'],
  ['`4`', 'Admin-local', 'حدّدها الإدارة يدوياً', 'مفهوم عام'],
  ['`5`', 'Site-local', 'موقع واحد', '`FF05::...`'],
  ['`8`', 'Organization-local', 'منظمة كاملة', '`FF08::...`'],
  ['`E`', 'Global', 'نطاق عالمي', '`FF0E::...`'],
]

const importantGroupRows: string[][] = [
  ['`FF02::1`', 'All Nodes', 'كل واجهة IPv6 على الـ link', 'General', 'ping all nodes على الـ link'],
  ['`FF02::2`', 'All Routers', 'الراوترات بس', 'General', 'اكتشاف الراوترات'],
  ['`FF02::5`', 'All OSPF Routers', 'كل راوتر شغال OSPFv3', 'Protocol-specific', 'OSPFv3 hello/update'],
  ['`FF02::6`', 'OSPF DR/BDR', 'الـ DR والـ BDR بس', 'Protocol-specific', 'تقليل adjacency في OSPF'],
  ['`FF02::9`', 'RIPng Routers', 'راوترات RIPng', 'Protocol-specific', 'RIPng updates'],
  ['`FF02::A`', 'EIGRP Routers', 'راوترات EIGRP', 'Protocol-specific', 'EIGRP hello'],
  ['`FF02::1:FFxx:xxxx`', 'Solicited-Node', 'واجهات آخر 24 bit مطابق', 'NDP', 'Neighbor Solicitation'],
]

const solicitedRows: string[][] = [
  ['1', 'Unicast address', '`2001:DB8:1234:5678:021A:2BFF:FE3C:4D5E`'],
  ['2', 'Last 24 bits', '`3C:4D:5E`'],
  ['3', 'Fixed prefix /104', '`FF02::1:FF00:0/104`'],
  ['4', 'Copy last 24 bits', '`FF02::1:FF3C:4D5E`'],
  ['5', 'Why collisions happen', 'أي عنوانين بنفس آخر 24 bit يطلعوا نفس المجموعة'],
]

const ndpMessageRows: string[][] = [
  ['RS', '133', 'Router Solicitation', 'Host → routers', 'اسأل الراوترات يعلّموا RA'],
  ['RA', '134', 'Router Advertisement', 'Router → hosts', 'Prefix / default gateway / MTU'],
  ['NS', '135', 'Neighbor Solicitation', 'Host → solicited-node group', 'اسأل عن MAC Address لجار'],
  ['NA', '136', 'Neighbor Advertisement', 'Target → requester', 'الرد بالـ MAC Address'],
  ['Redirect', '137', 'Redirect', 'Router → host', 'قول للهست يستخدم next hop أحسن'],
]

const ndpPacketRows: string[][] = [
  ['1 — On-link check', 'PC1 يقارن الـ destination بـ prefix بتاعه', 'لو نفس الـ /64 يكمل محلياً'],
  ['2 — Need L2 address', 'محتاج MAC لـ PC2', 'مفيش ARP في IPv6'],
  ['3 — NS', '`SRC FE80::1`', '`DST FF02::1:FF3C:4D5E` · Type 135'],
  ['4 — NA', '`SRC FE80::2`', '`DST FE80::1` · Type 136 · PC2 MAC'],
  ['5 — Cache', 'PC1 يحفظ IPv6 → MAC', '`show ipv6 neighbors` على المضيف/الراوتر'],
]

const verifyRows: string[][] = [
  ['`show ipv6 interface brief`', 'Status + GUA + LLA', '`administratively down` = missing `no shutdown`'],
  ['`show ipv6 interface`', 'Full IPv6 details + joined groups', 'Scope أو prefix غلط يظهر هنا'],
  ['`show ipv6 neighbors`', 'LLA → MAC neighbor cache', 'فاضي يعني NDP/L2 فيه مشكلة'],
  ['`show ipv6 route`', 'Connected / static IPv6 routes', 'مفيش route = مفيش توجيه'],
  ['`show ipv6 traffic`', 'ICMPv6 counters', 'يفرق بين NS/NA و ICMP errors'],
  ['`show ipv6 mld groups`', 'Multicast memberships على الواجهة', 'الإصدار مختلف حسب IOS / device'],
  ['`show running-config`', 'كل أوامر IPv6', 'فحص نهائي للـ GUA والـ LLA'],
  ['`ping ipv6-address`', 'اختبار unicast', 'ابدأ بالـ gateway ثم الهدف'],
  ['`traceroute ipv6-address`', 'تتبع المسار', 'يوضح فين بيقف المسار'],
]

const troubleshootRows: string[][] = [
  ['1 — Wrong address category', 'Host ما يوصلش للإنترنت رغم إن عنده IPv6', 'استخدم ULA أو LLA بدل GUA', '`show ipv6 interface brief`', 'استخدم GUA من `2000::/3`', 'Connectivity يشتغل'],
  ['2 — LLA routed beyond link', '`ping FE80::2` من شبكة تانية يفشل', 'LLA link-local scope', 'افحص العنوان والـ next-hop', 'استخدم GUA أو حدد outgoing interface', 'الـ ping يشتغل على نفس الـ link'],
  ['3 — Wrong multicast scope', 'إرسال `FF05::...` ما وصلش للـ LAN', 'Scope أوسع/أضيق من المطلوب', 'افحص الـ scope nibble', 'استخدم `FF02` للـ LAN', 'الـ group يستلم على الـ link'],
  ['4 — Missing multicast membership', 'Multicast traffic مش بيوصل للـ host', 'المضيف ما انضمش للمجموعة عبر MLD', '`show ipv6 mld groups`', 'شغّل التطبيق أو فعّل MLD snooping', 'الـ group بيظهر في القائمة'],
  ['5 — Wrong Solicited-Node calc', 'NS مش بيوصل للـ target', 'Last 24 bit غلط', 'قارن آخر 6 hex digits', 'ابنِي `FF02::1:FF` + last 24 bits', 'NS يوصل والـ NA يرجع'],
  ['6 — Neighbor Discovery failure', 'Neighbor cache فاضي بعد ping', 'ICMPv6 محجوب أو L2 مشكلة', '`show ipv6 neighbors` + `show ipv6 traffic`', 'اسمح ICMPv6 وافحص الـ switch/VLAN', 'Entry يظهر بعد traffic'],
  ['7 — Stale Neighbor Cache entry', 'ping متقطع بعد تغيير MAC', 'Cache قديم', '`show ipv6 neighbors`', 'انتظر الـ timeout أو امسح الـ entry', 'Cache يتحدّث ويتثبت الاتصال'],
  ['8 — Wrong LLA next-hop', 'Routes موجودة بس مفيش data', 'Next-hop LLA غلط أو مكرر', '`show ipv6 route` + `show ipv6 neighbors`', 'صحّح الـ LLA على الواجهة', 'Next-hop يتحل لـ MAC صح'],
  ['9 — ICMPv6 blocked by ACL', 'NS/NA مش بيتبادلوا', 'ACL منع ICMPv6 أو multicast', '`show running-config` + counters', 'اسمح ICMPv6 والـ multicast groups', 'NDP يكمل والـ cache يتحدّث صح'],
  ['10 — Interface administratively down', 'Status `administratively down`', 'نسيت `no shutdown`', '`show ipv6 interface brief`', 'دخل الواجهة واكتب `no shutdown`', 'Status يبقى `up/up`'],
]

const lab1Rows: string[][] = [
  ['`R1 G0/0`', '`2001:DB8:19:1::1/64`', 'Default gateway'],
  ['`R1 G0/0` LLA', '`FE80::1`', 'Link-local على LAN'],
  ['`PC1`', '`2001:DB8:19:1::10/64`', 'Gateway `FE80::1`'],
  ['`PC2`', '`2001:DB8:19:1::20/64`', 'Gateway `FE80::1`'],
  ['`PC3`', '`2001:DB8:19:1::30/64`', 'Gateway `FE80::1`'],
]

const lab2Rows: string[][] = [
  ['`R1 G0/0`', '`2001:DB8:19:1::1/64` · `FE80::1`', 'LAN 1'],
  ['`R1 G0/1`', '`2001:DB8:19:12::1/64` · `FE80::12`', 'Router link'],
  ['`R2 G0/0`', '`2001:DB8:19:12::2/64` · `FE80::21`', 'Router link'],
  ['`R2 G0/1`', '`2001:DB8:19:2::1/64` · `FE80::2`', 'LAN 2'],
  ['`PC1`', '`2001:DB8:19:1::10/64`', 'Gateway `FE80::1`'],
  ['`PC2`', '`2001:DB8:19:2::20/64`', 'Gateway `FE80::2`'],
]

export const topic19Lesson: Lesson = {
  topicId: '1.9',
  title: 'IPv6 Address Types',
  description:
    'في الدرس ده هنتعلّم أنواع عناوين IPv6: Unicast و Multicast و Anycast، والفرق بين GUA و LLA و ULA و Loopback و Unspecified. هنفهم Multicast scope والمجموعات المهمة زي `FF02::1` و`FF02::2`، ونحسب Solicited-Node Multicast خطوة بخطوة، ونتابع NDP ورسائل RS و RA و NS و NA و Redirect، مع إعداد Cisco IOS ولابين وتدريب اختبار.',
  estimatedTime: '~110 دقيقة',
  steps: [
    {
      id: 'what',
      title: 'إيه أنواع عناوين IPv6 وليه بنفرّق بينهم؟',
      short: 'مفهوم الدرس',
      blocks: [
        {
          type: 'paragraph',
          text: 'زي ما اتكلمنا في 1.8، عنوان IPv6 128 bit ومكتوب بـ hexadecimal. الدرس ده مش هيعيد شكل العنوان والضغط؛ هندرس „إيه نوع العنوان ومين هيستلم الـ packet؟“. في IPv6 ثلاث طرق تسليم أساسية: Unicast و Multicast و Anycast.',
        },
        { type: 'diagram', id: 'ipv6-type-delivery', caption: 'نفس المرسل، ثلاث طرق تسليم: واحد، مجموعة، أو الأقرب.' },
        {
          type: 'table',
          headers: ['النوع', 'الاسم', 'مين يستلم؟', 'مثال', 'الاستخدام'],
          rows: deliveryRows,
        },
        {
          type: 'steps',
          items: [
            { title: 'Unicast — واحد', text: 'عنوان واحد بيعرّف واجهة واحدة. الـ packet يروح لها بس. ده الشكل المعتاد لـ web browsing و ping و SSH.' },
            { title: 'Multicast — مجموعة', text: 'عنوان واحد بيعرّف مجموعة واجهات. كل واجهة انضمت للمجموعة تستلم نسخة. نطاقه `FF00::/8`.' },
            { title: 'Anycast — الأقرب', text: 'نفس العنوان متخصّص لأكتر من واجهة في أماكن مختلفة. الـ routing يختار أقرب نسخة؛ العميل ما بيقررش بنفسه.' },
            { title: 'مفيش Broadcast', text: 'IPv6 ألغى الـ broadcast. اللي بحل محله multicast groups زي All Nodes و Solicited-Node، وآلية NDP.' },
          ],
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'فكرة جوهرية',
          text: 'السؤال في الامتحان غالباً مش „إزاي نكتب العنوان؟“ بل „ده unicast ولا multicast ولا anycast، ومين هيستلم؟“. فكّر في الـ delivery أولاً قبل ما تفكّر في الـ bits.',
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'إيه اللي بيعوّض الـ Broadcast؟',
          text: 'مفيش حاجة واحدة بس. IPv6 بيستخدم `FF02::1` لكل العقد، و`FF02::2` لكل الراوترات، وSolicited-Node Multicast لأسئلة الجيران، وكل ده جوّه NDP.',
        },
      ],
    },
    {
      id: 'how',
      title: 'أنواع الـ Unicast: GUA و LLA و ULA و أكتر',
      short: 'تصنيف Unicast',
      blocks: [
        {
          type: 'paragraph',
          text: 'الـ Unicast مش نوع واحد. جوّه منه خمس فئات لازم تعرفها: GUA و LLA و ULA و Loopback و Unspecified. كل فئة ليها نطاق معروف وscope مختلف.',
        },
        { type: 'diagram', id: 'ipv6-unicast-categories', caption: 'خمس فئات unicast مهمة في CCNA.' },
        {
          type: 'table',
          headers: ['الفئة', 'النطاق', 'الـ scope والاستخدام', 'مثال'],
          rows: unicastRows,
        },
        { type: 'diagram', id: 'ipv6-gua-lla-ula', caption: 'مقارنة سريعة بين GUA و LLA و ULA من أول bits.' },
        {
          type: 'table',
          headers: ['الفئة', 'النطاق', 'أول bits', 'المدى', 'قابل للتوجيه؟', 'مثال استخدام'],
          rows: guaLlaUlaRows,
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'GUA — Global Unicast Address',
          text: 'النطاق `2000::/3` يعني أول تلات bits `001`. العنوان globally unique وقابل للتوجيه على الإنترنت. يتكوّن من Network Prefix و Interface Identifier؛ في الـ LAN غالباً `/64` + IID. أمثلة: `2001:DB8:19:1::10` للتوثيق و`2606:4700::1111` لخدمة عامة.',
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'LLA — Link-Local Address',
          text: 'النطاق `FE80::/10`. كل واجهة IPv6 تقريباً ليها LLA حتى لو مفيش GUA، وبيتولّد تلقائياً (Modified EUI-64 أو random حسب النظام). الراوترات ما تعبّريش packets ليها source أو destination LLA لرابط تاني. بتستخدمها NDP والـ routing protocols كـ next-hop.',
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Routing protocols و LLA',
          text: 'في OSPFv3 و EIGRP for IPv6 و RIPng، الـ neighbor relationships غالباً بتبنى على Link-Local addresses. لو الـ LLA مكرر أو غلط، الـ adjacency ما تقومش حتى لو الـ GUA مظبوط.',
        },
        { type: 'table', headers: ['العنصر', 'القيمة', 'الفكرة'], rows: ulaRows },
        {
          type: 'callout',
          tone: 'info',
          title: 'ULA مقابل IPv4 private',
          text: 'ULA زي RFC 1918 في إنه للاستخدام الداخلي وما يتوجّهش على الإنترنت. بس IPv6 مساحته أكبر، وله Global ID عشوائي + Subnet ID، والجزء الشائع `FD00::/8`. لسه لازم تفلتره على حدود الشبكة زي ما بتعمل مع private IPv4.',
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Loopback و Unspecified',
          text: '`::1/128` هو loopback: الجهاز بيختبر stack بتاعه من غير ما packet يخرج للشبكة، وده نظير `127.0.0.1` في IPv4. أما `::/128` فمعناه „unspecified“؛ مش عنوان بتكتبه على واجهة، وبيظهر كمصدر في إجراءات زي Duplicate Address Detection. متخلطش بينه وبين `::1` أو default route `::/0`.',
        },
      ],
    },
    {
      id: 'packet',
      title: 'Multicast و Solicited-Node على مستوى العنوان',
      short: 'Multicast',
      blocks: [
        {
          type: 'paragraph',
          text: 'الـ Multicast في IPv6 بيبدأ بـ `FF00::/8`. بدل ما نبعت لكل الأجهزة زي broadcast، بنبعت للمجموعة اللي انضمت ليها بس. المضيف بيعلن انضمامه للمجموعة عبر MLD، والراوترات بتفهم من ده مين محتاج الـ traffic.',
        },
        { type: 'diagram', id: 'ipv6-multicast-structure', caption: 'تركيب FF | Flags | Scope | Group ID.' },
        {
          type: 'table',
          headers: ['الحقل', 'الحجم', 'القيم', 'مثال في `FF02::1`', 'المعنى'],
          rows: multicastFieldRows,
        },
        { type: 'diagram', id: 'ipv6-multicast-scope', caption: 'الـ scope nibble بيحدد مدى الانتشار المقصود.' },
        {
          type: 'table',
          headers: ['Scope nibble', 'الاسم', 'المدى', 'مثال'],
          rows: multicastScopeRows,
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Scope مش ضمان فيزيائي',
          text: 'الـ scope بيقول „المقصود إن الـ packet يوصل لمين“، بس التنفيذ الفعلي بيعتمد على إعدادات الـ MLD snooping والـ multicast routing والـ ACLs. القيمة `0` محجوزة. في CCNA اعتبر `FF02` يعني link-local scope، وبعدين اسأل: هل الراوتر مسموح يوجّهه؟',
        },
        { type: 'diagram', id: 'ipv6-multicast-groups', caption: 'أشهر المجموعات: All Nodes و All Routers و مجموعات البروتوكولات.' },
        {
          type: 'table',
          headers: ['العنوان', 'الاسم', 'مين بيسمعه؟', 'النوع', 'مثال عملي'],
          rows: importantGroupRows,
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'عام أو خاص ببروتوكول؟',
          text: '`FF02::1` و`FF02::2` عامين: كل العقد أو كل الراوترات. أما `FF02::5` و`FF02::6` و`FF02::9` و`FF02::A` فمرتبطين ببروتوكول معيّن: OSPFv3 وRIPng وEIGRP. Solicited-Node مرتبط بـ NDP.',
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'ليه Multicast أفضل من Broadcast؟',
          text: 'في broadcast كل جهاز على الـ LAN بيستلم الـ frame ويفحصه. في multicast، الجهاز بيسمع بس للمجموعات اللي انضم ليها. يعني traffic أقل ومعالجة أقل على الأجهزة اللي مش مهتمة.',
        },
      ],
    },
    {
      id: 'config',
      title: 'Solicited-Node و Anycast و NDP بالتفصيل',
      short: 'حساب و NDP',
      blocks: [
        {
          type: 'paragraph',
          text: 'الـ Solicited-Node Multicast من أهم أفكار CCNA في IPv6. بيختصر سؤال „مين عنده العنوان ده؟“ بدل ما نبعت broadcast للكل. الـ prefix الثابت `FF02::1:FF00:0/104` + آخر 24 bit من العنوان = عنوان المجموعة.',
        },
        { type: 'diagram', id: 'ipv6-solicited-node', caption: 'احسب Solicited-Node من آخر 24 bit خطوة بخطوة.' },
        {
          type: 'table',
          headers: ['الخطوة', 'المطلوب', 'الناتج'],
          rows: solicitedRows,
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'قاعدة الحساب',
          text: 'آخر 24 bit = آخر 6 hex digits. في المثال `021A:2BFF:FE3C:4D5E` آخر 6 digits هي `3C4D5E`، يعني `3C:4D:5E`. النتيجة `FF02::1:FF3C:4D5E`. متاخدش الـ `FE` اللي قبل `3C`؛ دي بتاعة الـ 32 bit اللي قبل آخر 24.',
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'ليه أكتر من عنوان يطلع نفس المجموعة؟',
          text: 'لأننا بنستخدم آخر 24 bit بس. لو عنوانين مختلفين اتشاركوا في آخر 6 hex digits، هيسمعوا نفس الـ Solicited-Node group. ده طبيعي، والجهاز بيفحص الـ Target Address جوّه الـ NS عشان يعرف إذا كان هو المقصود ولا لا.',
        },
        {
          type: 'paragraph',
          text: 'الـ NDP (Neighbor Discovery Protocol) بيشتغل فوق ICMPv6. بيستخدم multicast و link-local addresses عشان يعمل اللي كان ARP وRouter Discovery وRedirect بيعملوه في IPv4. الرسائل الخمسة المهمة:',
        },
        {
          type: 'table',
          headers: ['الاختصار', 'Type', 'الاسم', 'الاتجاه', 'الوظيفة'],
          rows: ndpMessageRows,
        },
        { type: 'diagram', id: 'ipv6-ndp-ns-na', caption: 'من NS إلى NA: إزاي PC1 يعرف MAC بتاع PC2.' },
        {
          type: 'table',
          headers: ['الخطوة', 'إيه بيحصل؟', 'العناوين المهمة'],
          rows: ndpPacketRows,
        },
        { type: 'diagram', id: 'ipv6-arp-vs-ndp', caption: 'ARP بيرسل broadcast؛ NDP بيرسل لـ Solicited-Node Multicast.' },
        {
          type: 'callout',
          tone: 'warning',
          title: 'مفيش ARP في IPv6',
          text: 'IPv6 ما بيستخدمش ARP خالص. الـ Neighbor Cache هو اللي بيحفظ IPv6 → MAC، وبيتغذّى من NS/NA. لو الـ cache فاضي أو فيه entry غلط، الـ ping هيفشل حتى لو الـ routes مظبوطة.',
        },
        {
          type: 'paragraph',
          text: 'الـ SLAAC والـ RA تفاصيلها في موضوع لاحق؛ هنا بس نعرف إن RA Type 134 بيعلّم الهست بالـ prefix والـ default gateway، وRS Type 133 هو السؤال اللي بيطلب الـ RA. متدخلش في تفاصيل العنونة التلقائية دلوقتي.',
        },
        { type: 'diagram', id: 'ipv6-anycast-routing', caption: 'Anycast: نفس العنوان على أكتر من سيرفر والـ routing يختار الأقرب.' },
        {
          type: 'steps',
          items: [
            { title: 'Anycast إيه؟', text: 'نفس العنوان (غالباً من unicast space) متوزّع على أكتر من interface في مواقع مختلفة.' },
            { title: 'مين يختار؟', text: 'الـ routing يختار أقرب نسخة حسب الـ metric وطوبولوجيا الشبكة، مش الـ client.' },
            { title: 'ليه مفيد؟', text: 'DNS موزّع وخدمات عالمية: كل عميل يروح لأقرب نسخة، ولو نسخة سقطت الـ routing يتقارب للتانية.' },
            { title: 'الفرق من Multicast', text: 'Multicast يوصل لكل أعضاء المجموعة؛ anycast يوصل لواجهة واحدة بس „الأقرب“.' },
            { title: 'الفرق من Unicast', text: 'Unicast عنوان لواجهة واحدة؛ anycast عنوان واحد لعدة واجهات بس واحد يستلم في كل لحظة.' },
            { title: 'Exam trap', text: 'مفيش prefix خاص بالـ anycast. الـ anycast بيستخدم عناوين unicast عادية والـ routing بيعمل الاختيار.' },
          ],
        },
      ],
    },
    {
      id: 'verify',
      title: 'إعداد Cisco IOS وأوامر التحقق',
      short: 'Config و verify',
      blocks: [
        {
          type: 'paragraph',
          text: 'من 1.8 أنت عارف إن `ipv6 unicast-routing` يفعّل التوجيه وإن `ipv6 address IP/PREFIX` بتكتب على الواجهة. هنا بنركّز على أنواع العناوين: GUA للتوجيه، LLA للجيران والـ next-hop، وMulticast memberships للتحقق.',
        },
        { type: 'diagram', id: 'ipv6-types-lab-topology', caption: 'توبولوجيا R1 و R2 و SW1 و PCs المستخدمة في اللابين.' },
        {
          type: 'code',
          label: 'R1 — GUA + LLA',
          language: 'ios',
          code: `enable
configure terminal
hostname R1
ipv6 unicast-routing
!
interface gigabitEthernet 0/0
 description LAN_1
 ipv6 address 2001:DB8:19:1::1/64
 ipv6 address FE80::1 link-local
 no shutdown
!
interface gigabitEthernet 0/1
 description TO_R2
 ipv6 address 2001:DB8:19:12::1/64
 ipv6 address FE80::12 link-local
 no shutdown
end
copy running-config startup-config`,
        },
        {
          type: 'code',
          label: 'R2 — GUA + LLA',
          language: 'ios',
          code: `enable
configure terminal
hostname R2
ipv6 unicast-routing
!
interface gigabitEthernet 0/0
 description TO_R1
 ipv6 address 2001:DB8:19:12::2/64
 ipv6 address FE80::21 link-local
 no shutdown
!
interface gigabitEthernet 0/1
 description LAN_2
 ipv6 address 2001:DB8:19:2::1/64
 ipv6 address FE80::2 link-local
 no shutdown
end
copy running-config startup-config`,
        },
        {
          type: 'code',
          label: 'Representative output',
          language: 'ios',
          code: `R1# show ipv6 interface brief
GigabitEthernet0/0   [up/up]
    FE80::1
    2001:DB8:19:1::1
GigabitEthernet0/1   [up/up]
    FE80::12
    2001:DB8:19:12::1

R1# show ipv6 neighbors
IPv6 Address          Age  Link-layer Addr  State Interface
FE80::2                 6  0050.56C0.0002   REACH Gi0/1
2001:DB8:19:12::2      11  0050.56C0.0002   REACH Gi0/1

R1# show ipv6 mld groups
GigabitEthernet0/0
  Group: FF02::1
  Group: FF02::1:FF00:1
  Group: FF02::2
  Group: FF02::5
  Group: FF02::6

R1# show ipv6 route
C   2001:DB8:19:1::/64 [0/0]
     via GigabitEthernet0/0, directly connected
C   2001:DB8:19:12::/64 [0/0]
     via GigabitEthernet0/1, directly connected`,
        },
        {
          type: 'table',
          headers: ['الأمر', 'بتدوّر على إيه؟', 'معنى المشكلة'],
          rows: verifyRows,
        },
        {
          type: 'steps',
          items: [
            { title: '1 — الواجهة', text: '`show ipv6 interface brief`: GUA و LLA موجودين والحالة `up/up`. لو administratively down اعمل `no shutdown`.' },
            { title: '2 — التصنيف', text: 'افحص أول hextet: `2001` GUA · `FE80` LLA · `FD00` ULA · `FF02` multicast. ده أسرع فحص في الامتحان.' },
            { title: '3 — الجيران', text: '`show ipv6 neighbors` لازم يوري LLA مرتبط بـ MAC. لو فاضي، راجع ICMPv6 والـ VLAN والـ multicast.' },
            { title: '4 — المجموعات', text: '`show ipv6 mld groups` يوري انضمام الراوتر لـ `FF02::1` و`FF02::2` ومجموعات البروتوكولات.' },
            { title: '5 — المسار والاختبار', text: '`show ipv6 route` ثم `ping` و`traceroute`. لو المسار موجود والـ cache فيه entry، المشكلة غالباً ACL أو الطرف التاني.' },
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'اختلاف الإصدارات',
          text: ' Output و أمر `show ipv6 mld groups` بالظبط بيختلفوا بين IOS versions و Packet Tracer device models. بعض الأجهزة بيوري المجموعات تحت `show ipv6 interface` بدل أمر مستقل. المهم إنك تعرف تقرأ FF02 والـ scope والـ neighbor cache.',
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
          title: 'Decision flow ثابت',
          text: '`1)` النوع صح؟ GUA/LLA/ULA/multicast · `2)` الـ scope يناسب المكان؟ · `3)` الواجهة `up/up`؟ · `4)` LLA فريد على الـ link؟ · `5)` Solicited-Node محسوب صح؟ · `6)` `show ipv6 neighbors` فيه entry؟ · `7)` ICMPv6 مش محجوب؟ · `8)` route موجود؟ · `9)` غيّر حاجة واحدة بس وأعد الاختبار.',
        },
        {
          type: 'table',
          headers: ['# / المشكلة', 'الأعراض', 'السبب المحتمل', 'التحقق', 'الحل', 'النتيجة'],
          rows: troubleshootRows,
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'مثال 1 — LLA كـ next-hop بعيد',
          text: 'الـ R1 عنده route ناحية `FE80::2` لكن الـ next-hop ده على رابط تاني. الراوتر ما هيعبّريش LLA، فالـ ping يفشل. الحل: استخدم GUA للـ next-hop، أو حدد outgoing interface في الأمر لو الجهاز يدعم ذلك.',
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'مثال 2 — Solicited-Node غلط',
          text: 'المضيف بعت NS لـ `FF02::1:FF2B:FF3C` بدل `FF02::1:FF3C:4D5E`. السبب إنه قرأ آخر hextetين كاملين بدل آخر 24 bit. التصحيح: خد آخر 6 hex digits بس من العنوان.',
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'مثال 3 — cache قديم',
          text: 'بعد ما NIC بتاع PC2 اتغيّر، PC1 لسه بيبعت للـ MAC القديم. `show ipv6 neighbors` بيوري State قديم. اعمل clear أو استنى الـ timeout، وبعدين NS/NA بيعملوا update.',
        },
      ],
    },
    {
      id: 'lab',
      title: 'لابان: Unicast/Multicast و Neighbor Discovery',
      short: 'لاب Packet Tracer',
      blocks: [
        {
          type: 'paragraph',
          text: 'هعمل لابين على نفس الفكرة: الأول يركّز على GUA وLLA و Multicast groups ومفيش broadcast. والتاني يركّز على NDP و NS/NA والـ Solicited-Node Multicast مع خطأ متعمّد واستعادة.',
        },
        { type: 'diagram', id: 'ipv6-types-lab-topology', caption: 'التوبولوجيا الكاملة للابين.' },
        {
          type: 'callout',
          tone: 'info',
          title: 'Lab 1 — IPv6 Unicast and Multicast',
          text: 'استخدم `1 Router` + `1 Switch` + `3 PCs`. الراوتر R1 gateway، والـ PCs على نفس الـ /64. الهدف: ping بين الـ PCs، وفحص LLA و MLD groups والـ neighbor cache، وتفسير إن مفيش broadcast.',
        },
        { type: 'table', headers: ['الجهاز / الواجهة', 'IPv6 Address', 'الدور'], rows: lab1Rows },
        {
          type: 'code',
          label: 'Lab 1 — R1',
          language: 'ios',
          code: `enable
configure terminal
hostname R1
ipv6 unicast-routing
!
interface gigabitEthernet 0/0
 ipv6 address 2001:DB8:19:1::1/64
 ipv6 address FE80::1 link-local
 no shutdown
end`,
        },
        {
          type: 'steps',
          items: [
            { title: 'المهمة 1', text: 'اربط PC1 و PC2 و PC3 بـ SW1، واربط SW1 بـ R1 G0/0. لازم الـ links تبقى خضراء.' },
            { title: 'المهمة 2', text: 'على كل PC: Desktop → IP Configuration → IPv6. حط العناوين من الجدول والـ gateway `FE80::1`.' },
            { title: 'المهمة 3', text: 'طبّق كود R1. على R1 اكتب `show ipv6 interface brief` ولازم تشوف GUA و LLA و `up/up`.' },
            { title: 'المهمة 4', text: 'من PC1 اعمل ping لـ PC2 و PC3. الاتنين لازم ينجحوا لأنهم على نفس الـ /64.' },
            { title: 'المهمة 5', text: 'على R1 اكتب `show ipv6 neighbors`. هتلاقي LLA للـ PCs مرتبط بـ MAC.' },
            { title: 'المهمة 6', text: 'افحص `show ipv6 mld groups` أو `show ipv6 interface`. دوّر على `FF02::1` All Nodes و`FF02::2` All Routers.' },
            { title: 'المهمة 7', text: 'اكتب إجابة قصيرة: ليه الـ NS مش broadcast؟ لأنه بيتبعت لـ Solicited-Node Multicast الخاص بالهدف.' },
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'النتيجة المتوقعة Lab 1',
          text: 'PC1 ↔ PC2 ↔ PC3 شغالين، والـ neighbor cache فيه entries، و`FF02::1` و`FF02::2` ظاهرين في فحص المجموعات. مفيش أي broadcast في IPv6.',
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Lab 2 — Neighbor Discovery',
          text: 'استخدم R1 و R2 وSW1 و PC1 و PC2. R1 في LAN 1 و R2 في LAN 2 والرابط بينهم `2001:DB8:19:12::/64`. الهدف: تشوف NS/NA بنفسك وتحسب Solicited-Node للـ PC2.',
        },
        { type: 'table', headers: ['الجهاز / الواجهة', 'الإعداد', 'ملاحظة'], rows: lab2Rows },
        {
          type: 'steps',
          items: [
            { title: 'المهمة 1', text: 'اربط R1 بـ R2، وكل راوتر بـ SW الخاص به أو بـ PC مباشرة حسب Device Pool. حط العناوين من الجدول.' },
            { title: 'المهمة 2', text: 'طبّق كود R1 و R2 من خطوة Verification. تأكد إن `ipv6 unicast-routing` موجود على الاتنين.' },
            { title: 'المهمة 3', text: 'من PC1 اعمل ping لـ PC2. أول ping غالباً فيه delay بسيط لأن NDP بيشتغل قبل ما الـ cache يمتلي.' },
            { title: 'المهمة 4', text: 'على R1 اكتب `show ipv6 neighbors`. دوّر على LLA بتاع R2 والـ GUA بتاعه على الرابط.' },
            { title: 'المهمة 5', text: 'احسب Solicited-Node لـ PC2: لو آخر 24 bit `3C:4D:5E` يبقى `FF02::1:FF3C:4D5E`. قارن بـ packet details في Packet Tracer لو متاح.' },
            { title: 'المهمة 6', text: 'اشرح بصوت عالي: PC1 بعت NS Type 135 للمجموعة، وPC2 رد NA Type 136 بالـ MAC.' },
            { title: 'المهمة 7 — Fault', text: 'غيّر gateway على PC1 لـ `FE80::99`. اعمل ping تاني هيفشل لأن الـ LLA مش فريد/مش موجود على الـ link.' },
            { title: 'المهمة 8 — Restore', text: 'ارجّع gateway لـ `FE80::1`، امسح الـ neighbor cache أو اعمل ping تاني، ولازم يشتغل.' },
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'حدود المحاكاة',
          text: 'بعض إصدارات Packet Tracer ما بتوريش كل ICMPv6 message details أو `show ipv6 mld groups`. اللي لازم يتحقق منه هو المنطق: NS لـ Solicited-Node، NA بالـ MAC، و neighbor cache بيتحدّث بعد traffic.',
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
          text: 'كل سؤال أربع إجابات وزر **تحقق من الإجابة**. مفيش feedback قبل Submission، وبعد ما تضغط الزر الأزرار بتتقفل. اقرأ الشرح كويس.',
        },
        {
          type: 'quiz',
          questions: [
            {
              id: 'q1',
              prompt: 'إيه الفرق الصح بين Unicast و Multicast و Anycast؟',
              options: [
                'Unicast لكل الأجهزة، Multicast للأقرب، Anycast لمجموعة.',
                'Unicast لواجهة واحدة، Multicast لكل أعضاء المجموعة، Anycast لأقرب واجهة بنفس العنوان.',
                'الثلاثة بيرسلوا broadcast لنفس الـ LAN.',
                'Anycast لكل أعضاء المجموعة و Multicast للأقرب.',
              ],
              correctIndex: 1,
              requireSubmit: true,
              explanation:
                'الصح هو **(B)**. Unicast = وجهة واحدة، Multicast = كل أعضاء المجموعة، Anycast = واحدة بس „الأقرب“ من عدة واجهات بنفس العنوان. **(A)** و**(D)** معكوسين. **(C)** غلط لأن IPv6 مفيش broadcast.',
            },
            {
              id: 'q2',
              prompt: 'رتب النطاقات: GUA ثم LLA ثم ULA؟',
              options: [
                '`2000::/3` ثم `FE80::/10` ثم `FC00::/7`',
                '`FE80::/10` ثم `2000::/3` ثم `FC00::/7`',
                '`FC00::/7` ثم `2000::/3` ثم `FE80::/10`',
                '`FF00::/8` ثم `FE80::/10` ثم `2000::/3`',
              ],
              correctIndex: 0,
              requireSubmit: true,
              explanation:
                'الصح هو **(A)**. GUA من `2000::/3`، LLA من `FE80::/10`، وULA من `FC00::/7`. **(D)** غلط لأن `FF00::/8` multicast مش unicast.',
            },
            {
              id: 'q3',
              prompt: 'إيه العنوان الخاص بـ all routers على نفس الـ link؟',
              options: [
                '`FF02::1`',
                '`FF02::2`',
                '`FF02::5`',
                '`FF02::9`',
              ],
              correctIndex: 1,
              requireSubmit: true,
              explanation:
                'الصح هو **(B)**. `FF02::2` = All Routers على الـ link. `FF02::1` = All Nodes. `FF02::5` = OSPFv3 routers و`FF02::9` = RIPng routers، وده يفرّق بين general group و protocol-specific group.',
            },
            {
              id: 'q4',
              prompt: 'لو آخر 24 bit من عنوان IPv6 هما `3C:4D:5E`، إيه الـ Solicited-Node Multicast؟',
              options: [
                '`FF02::1`',
                '`FF02::1:FF00:0`',
                '`FF02::1:FF3C:4D5E`',
                '`FF02::2`',
              ],
              correctIndex: 2,
              requireSubmit: true,
              explanation:
                'الصح هو **(C)**. الـ prefix الثابت `FF02::1:FF00:0/104` + آخر 24 bit `3C:4D:5E` = `FF02::1:FF3C:4D5E`. `(B)` هو الـ prefix قبل ما نحط آخر 24 bit.',
            },
            {
              id: 'q5',
              prompt: 'PC1 محتاج MAC لـ PC2. إيه أول رسالة بيرسلها في NDP؟',
              options: [
                'ARP broadcast Type 135',
                'Neighbor Solicitation Type 135 لـ Solicited-Node Multicast',
                'Router Advertisement Type 134',
                'Neighbor Advertisement Type 136',
              ],
              correctIndex: 1,
              requireSubmit: true,
              explanation:
                'الصح هو **(B)**. PC1 يبعت NS Type 135 لعنوان Solicited-Node Multicast بتاع PC2. PC2 يرد بـ NA Type 136 بالـ MAC. **(A)** غلط لأن مفيش ARP في IPv6. **(C)** RA للـ router discovery، و**(D)** هو الرد مش السؤال.',
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
          type: 'list',
          items: [
            'Unicast = وجهة واحدة · Multicast = كل أعضاء المجموعة · Anycast = أقرب واجهة من عدة واجهات بنفس العنوان.',
            'مفيش Broadcast في IPv6؛ الـ multicast و NDP بيعوّضوه.',
            'GUA `2000::/3` عالمي وقابل للتوجيه · LLA `FE80::/10` للرابط · ULA `FC00::/7` للمنظمة.',
            '`FD00::/8` هو الجزء الشائع من ULA، وله Global ID + Subnet ID + Interface ID.',
            '`::1/128` loopback · `::/128` unspecified · `::/0` default route — متخلطش بينهم.',
            'Multicast `FF00::/8`: FF + Flags + Scope + Group ID. أشهر scope في CCNA هو `2` = link-local.',
            '`FF02::1` All Nodes · `FF02::2` All Routers · `FF02::5` OSPF · `FF02::6` OSPF DR/BDR · `FF02::9` RIPng · `FF02::A` EIGRP.',
            'Solicited-Node = `FF02::1:FF00:0/104` + آخر 24 bit. المثال: `3C:4D:5E` → `FF02::1:FF3C:4D5E`.',
            'NDP فوق ICMPv6: RS 133 · RA 134 · NS 135 · NA 136 · Redirect 137.',
            'الـ Neighbor Cache بيحفظ IPv6 → MAC. NS بيسأل و NA بيرد، ومفيش ARP في IPv6.',
            'أوامر الفحص: `show ipv6 interface brief` · `show ipv6 interface` · `show ipv6 neighbors` · `show ipv6 route` · `show ipv6 traffic` · `show ipv6 mld groups` · `show running-config` · `ping` · `traceroute`.',
          ],
        },
        {
          type: 'table',
          headers: ['لو شفت...', 'فكّر في...'],
          rows: [
            ['`FE80::...` كـ destination بعيد', 'LLA مش قابل للتوجيه خارج الرابط'],
            ['`FD00::...` و مفيش إنترنت', 'ULA مش global — طبيعي'],
            ['`FF02::1`', 'كل العقد على الـ link'],
            ['`FF02::2`', 'كل الراوترات على الـ link'],
            ['`FF02::1:FF3C:4D5E`', 'Solicited-Node لآخر 24 bit `3C4D5E`'],
            ['NS بدل ARP', 'ICMPv6 Type 135'],
            ['NA', 'ICMPv6 Type 136 بالـ MAC'],
            ['Neighbor cache فاضي', 'NDP / multicast / ACL مشكلة'],
            ['Anycast', 'نفس العنوان على أكتر من واجهة والـ routing يختار'],
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'آخر نصيحة',
          text: 'في الامتحان، ابدأ بتصنيف العنوان من أول hextet، وبعدين اسأل: مين المفروض يستلم؟ لو السؤال عن جار على نفس الـ link، فكّر في LLA + NS/NA + Solicited-Node قبل أي حاجة تانية.',
        },
      ],
    },
  ],
}
