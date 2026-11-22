import type { Lesson } from '../types'

const rfcRows: string[][] = [
  ['A', '`10.0.0.0 – 10.255.255.255`', '`10.0.0.0/8`', '`255.0.0.0`', 'أول octet = 10 والـ 24 bit اللي بعده hosts'],
  ['B', '`172.16.0.0 – 172.31.255.255`', '`172.16.0.0/12`', '`255.240.0.0`', 'أول octet = 172 والتاني من 16 لـ 31 بس'],
  ['C', '`192.168.0.0 – 192.168.255.255`', '`192.168.0.0/16`', '`255.255.0.0`', 'أول octet = 192 والتاني = 168'],
]

const rfcBoundaryRows: string[][] = [
  ['`10.1.1.1`', 'Private', 'داخل `10.0.0.0/8`'],
  ['`172.20.1.1`', 'Private', 'الـ second octet = 20، وده داخل 16–31'],
  ['`172.15.1.1`', 'Public', 'أقل من 16، فمش داخل `172.16.0.0/12`'],
  ['`172.32.1.1`', 'Public', 'أكبر من 31، فخارج النطاق الخاص'],
  ['`192.168.1.1`', 'Private', 'داخل `192.168.0.0/16`'],
  ['`192.169.1.1`', 'Public', 'التاني 169 مش 168'],
  ['`8.8.8.8`', 'Public', 'عنوان عام مش من نطاقات RFC 1918'],
]

const specialRows: string[][] = [
  ['`127.0.0.0/8`', 'Loopback', 'اختبار الـ TCP/IP stack جوه الجهاز؛ `127.0.0.1` = localhost', 'مفيش packet بيخرج للشبكة'],
  ['`169.254.0.0/16`', 'APIPA / Link-local', 'عنوان تلقائي لما DHCP يفشل', 'للرابط المحلي فقط، من غير default gateway'],
  ['`0.0.0.0`', 'Unspecified / Any', 'مفيش عنوان بعد / أي عنوان حسب السياق', 'مصدر DHCP Discover قبل ما الجهاز ياخد IP'],
  ['`255.255.255.255`', 'Limited broadcast', 'بث داخل الـ local broadcast domain', 'الراوتر مش بيعّديه افتراضياً'],
  ['`224.0.0.0/4`', 'Multicast', 'إرسال لمجموعة عناوين مرة واحدة', 'Class D، من 224 لـ 239 في أول octet'],
  ['`192.0.2.0/24`', 'Documentation', 'أمثلة TEST-NET-1', 'مش عنوان عام حقيقي'],
  ['`198.51.100.0/24`', 'Documentation', 'أمثلة TEST-NET-2', 'استخدمته في أمثلة السيرفر هنا'],
  ['`203.0.113.0/24`', 'Documentation', 'أمثلة TEST-NET-3', 'استخدمته كعنوان عام للراوتر في اللاب'],
]

const natTermRows: string[][] = [
  ['Inside Local', 'العنوان الخاص الحقيقي للجهاز الداخلي قبل الترجمة', '`192.168.1.10`'],
  ['Inside Global', 'العنوان العام اللي بيظهر للعالم بدل الجهاز الداخلي', '`203.0.113.10`'],
  ['Outside Local', 'عنوان الجهاز الخارجي زي ما بيشوفه الداخل', '`198.51.100.20` في مثالنا'],
  ['Outside Global', 'العنوان العام الحقيقي للجهاز الخارجي', '`198.51.100.20`'],
  ['Inside interface', 'الواجهة المتصلة بالـ LAN وتوجد عليها حركة داخلية', '`ip nat inside` على G0/0'],
  ['Outside interface', 'الواجهة المتصلة بالـ ISP/الإنترنت', '`ip nat outside` على G0/1'],
]

const natCompareRows: string[][] = [
  ['Static NAT', 'واحد لواحد ثابت', 'لا', 'خادم داخلي محتاج عنوان عام ثابت', '`ip nat inside source static ...`'],
  ['Dynamic NAT', 'واحد لواحد من pool', 'لا', 'عدد مستخدمين أقل من عدد العناوين العامة', '`ip nat inside source list ... pool ...`'],
  ['PAT / Overload', 'كتير لواحد', 'نعم — source port', 'البيت والشركة، أغلب الاستخدام', '`... interface ... overload`'],
]

const verifyRows: string[][] = [
  ['`show ip interface brief`', 'G0/0 و G0/1 `up/up` وعليهم العناوين الصح', '`administratively down` = محتاج `no shutdown`; `down/down` = كابل/طرف تاني'],
  ['`show ip route`', ' connected للـ LAN + `S*` default route للـ ISP', 'مفيش default route = مفيش وصول للإنترنت'],
  ['`show ip nat translations`', 'entry فيه inside local و inside global بعد ما_CLIENT يولّد traffic', 'فاضي = ACL أو inside/outside أو route أو traffic ناقص'],
  ['`show ip nat statistics`', '`Hits` بتزيد و`misses` منطقية', '`Hits = 0` = الـ traffic مش بيطابق الـ NAT rule'],
  ['`show access-lists`', 'الـ ACL line بيوضّح number of matches', 'أصفار = الـ wildcard غلط أو المصدر مش من الشبكة'],
  ['`show running-config`', 'أوامر `ip nat inside/outside` و`ip nat ...` موجودة', 'أي أمر ناقص معناه إن الإعداد اتحفظ غلط أو اتمسح'],
  ['`show ip dhcp binding`', 'client و IP والماسك والـ lease', 'فاضي = العميل ما طلبش أو الـ pool فاضي أو غلط'],
  ['`show ip dhcp pool`', 'عدد الـ addresses المستخدمة والمتاحة', 'pool exhausted = كل العناوين اتخصّصت'],
  ['`show ip dhcp server statistics`', 'Discover/Offer/Request/ACK counters متحركة', 'Discover وارد من غير Offer = مشكلة pool أو excluded addresses'],
  ['`ping`', 'رد من gateway ثم من ISP ثم من السيرفر', 'نجاح LAN وفشل الإنترنت = NAT/default route/DNS'],
  ['`traceroute`', 'بيوري R1 وبعدين ISP وبعدين السيرفر', 'توقف عند R1 = مشكلة outside/NAT/route'],
]

const troubleshootRows: string[][] = [
  ['1 — جهاز خاص مش بيدخل الإنترنت', 'ping الـ gateway شغال والسيرفر فاشل', 'default route أو NAT أو DNS', '`show ip route` + `show ip nat translations`', 'أضف `ip route 0.0.0.0 0.0.0.0 <ISP>` وافحص NAT', 'الاتصال بالإنترنت يشتغل'],
  ['2 — مفيش NAT translation', '`show ip nat translations` فاضي', 'مفيش traffic، أو ACL مش مطابق، أو internal interfaces غلط', '`show access-lists` + `show running-config`', 'صحّح الـ ACL والـ inside/outside وولّد ping', 'entry جديد يظهر'],
  ['3 — inside/outside غلط', 'الترجمة تتعمل للاتجاه الغلط أو خالص', '`ip nat inside`/`ip nat outside` على منافذ عكس', '`show running-config | include ip nat`', 'حط `ip nat inside` على G0/0 و`ip nat outside` على G0/1', ' الـ hits تزيد'],
  ['4 — ACL مش بيطابق الشبكة', '`Hits = 0` رغم الـ ping', 'wildcard غلط زي `0.0.0.255` مع شبكة تانية', '`show access-lists`', '`access-list 1 permit 192.168.1.0 0.0.0.255`', 'الـ ACL match يزيد'],
  ['5 — Dynamic NAT pool خلص', 'أول جهازين شغالين والتالت فاشل', 'عدد العناوين العامة أقل منعدد الأجهزة', '`show ip nat translations` + pool ranges', 'وسّع الـ pool أو استخدم PAT overload', 'كل الأجهزة تقدر تتصل'],
  ['6 — PAT مش بيترجم البورت', 'عنوان عام واحد بس مفيش تمييز sessions', 'نسيت كلمة `overload`', '`show running-config | include ip nat`', 'أضف `overload` في أمر `ip nat inside source list ... interface ...`', ' أكتر من entry بنفس العنوان وبورت مختلف'],
  ['7 — DHCP client أخذ APIPA', '`169.254.x.x` في ipconfig', 'DHCP server مش متاح أو الواجهة/الـ pool غلط', '`show ip dhcp pool` + `show ip dhcp server statistics`', 'صلّح الـ pool والـ exclusion و`no shutdown`', 'العميل ياخد `192.168.1.x`'],
  ['8 — DHCP scope خلص', 'العميل لسه بيطلب ومفيش binding', 'كل العناوين اتخصّصت أو الـ exclusion كبير', '`show ip dhcp pool` + `show ip dhcp binding`', 'قلّل الـ excluded أو وسّع الـ network', ' عنوان جديد يتخصّص'],
  ['9 — default gateway غلط من DHCP', 'LAN شغال والإنترنت فاشل', '`default-router` في الـ pool غلط', '`ipconfig /all` + pool config', '`default-router 192.168.1.1`', ' ping للـ ISP ينجح'],
  ['10 — DHCP relay ناقص', 'Clients في subnet تانية مفيش DHCP', 'الـ broadcast مش بيعدّي الراوتر', '`show running-config | include helper`', '`ip helper-address <server-ip>` على الـ inside interface', 'DORA يكمل عبر الـ relay'],
]

const lab1Rows: string[][] = [
  ['`R1 G0/0`', '`192.168.1.1`', '`255.255.255.0`', '—', 'DHCP server + gateway'],
  ['`PC1`', 'DHCP', 'من الـ pool', '`192.168.1.1`', 'يستقبل عنوان تلقائي'],
  ['`PC2`', 'DHCP', 'من الـ pool', '`192.168.1.1`', 'يستقبل عنوان تلقائي'],
]

const lab2Rows: string[][] = [
  ['`PC1`', 'NIC', '`192.168.1.10`', '`255.255.255.0`', '`192.168.1.1`', 'Inside client'],
  ['`PC2`', 'NIC', '`192.168.1.11`', '`255.255.255.0`', '`192.168.1.1`', 'Inside client'],
  ['`R1 G0/0`', 'inside', '`192.168.1.1`', '`255.255.255.0`', '—', 'Default gateway + `ip nat inside`'],
  ['`R1 G0/1`', 'outside', '`203.0.113.10`', '`255.255.255.252`', '—', 'Public WAN + `ip nat outside`'],
  ['`R-ISP G0/1`', 'to R1', '`203.0.113.9`', '`255.255.255.252`', '—', 'ISP next hop'],
  ['`R-ISP G0/0`', 'server LAN', '`198.51.100.1`', '`255.255.255.0`', '—', 'Gateway للسيرفر'],
  ['`SERVER`', 'NIC', '`198.51.100.20`', '`255.255.255.0`', '`198.51.100.1`', 'Public test server'],
]

export const topic17Lesson: Lesson = {
  topicId: '1.7',
  title: 'عنونة IPv4 الخاصة',
  description:
    'في الدرس ده هنتعلّم إزاي العناوين الخاصة بتاعات RFC 1918 بتسمح لشبكات كتير تستخدم نفس المدى، وإزاي NAT و PAT بيسمحوا لهم يطلعوا على الإنترنت. هنغطّي كمان العناوين الخاصة زي loopback و APIPA، و DHCP بـ DORA والـ relay، مع إعداد Cisco IOS وتحقق ولابين وخمسة أسئلة CCNA.',
  estimatedTime: '~90 دقيقة',
  steps: [
    {
      id: 'what',
      title: 'إيه اللي إحنا بندرسه وليه وجوده مهم؟',
      short: 'مفهوم الدرس',
      blocks: [
        {
          type: 'paragraph',
          text: 'تخيّل إن كل موبايل وكمبيوتر وتلفزيون في البيت محتاج عنوان `Public IPv4` خاص بيه. عدد العناوين العامة محدود، فمستحيل كل جهاز في العالم ياخد عنوان فريد. الحل اللي CCNA بتدرّسه هو إن الأجهزة جوه البيت تستخدم عناوين **خاصة** تتكرر في كل بيت، والراوتر عنده عنوان **عام** واحد بيشاركه كل الأجهزة.',
        },
        {
          type: 'table',
          headers: ['المفهوم', 'معناه', 'مثال'],
          rows: [
            ['`Public IPv4 Address`', 'عنوان فريد عالمياً وقابل للتوجيه على الإنترنت العام', '`203.0.113.10` في أمثلتنا (عنوان توثيق)'],
            ['`Private IPv4 Address`', 'عنوان صالح جوه شبكة داخلية فقط، وممكن يتكرر في شبكات تانية', '`192.168.1.10`'],
            ['`RFC 1918`', 'المستند اللي حجز ثلاث نطاقات للعناوين الخاصة', '`10/8` و `172.16/12` و `192.168/16`'],
            ['`NAT / PAT`', 'ترجمة العناوين الخاصة لعناوين عامة عند الخروج للإنترنت', '`192.168.1.10` → `203.0.113.10`'],
          ],
        },
        { type: 'diagram', id: 'private-public-compare', caption: 'عناوين الأجهزة داخل البيت خاصة، والـ ISP بيخصّص عنوان عام واحد للراوتر.' },
        {
          type: 'paragraph',
          text: 'مثال البيت: الراوتر استلم `Public IP` من الـ ISP على واجهة `WAN`. الـ laptop `192.168.1.10`، والموبايل `192.168.1.11`، والتلفزيون الذكي `192.168.1.12`. التلاتة بيشوفوا بعض جوه الـ LAN، وكلهم بيخرجوا من نفس العنوان العام. جوه بيت تاني ممكن تلاقي نفس العناوين بالظبط — وده تمام لأنهم مش بيظهروا للإنترنت بصورتهم الخاصة.',
        },
        {
          type: 'steps',
          items: [
            { title: 'ليه العناوين الخاصة موجودة؟', text: 'عشان تحافظ على عناوين IPv4 العامة وتسمح لأي منظمة أو بيت يبني LAN من غير ما يطلب block من ISP.' },
            { title: 'ليه مش متوجّهة على الإنترنت؟', text: 'لأنها مش فريدة عالمياً. لو راوتر في الإنترنت شاف مصدر `192.168.1.10` مش هيعرف أنهي بيت بالظبط، فالـ ISP غالباً بيرفض أو بيتجاهل الـ packet.' },
            { title: 'مين بيخصّص العام؟', text: 'الـ `ISP` (Internet Service Provider) يخصّصه للعميل. والـ ISP نفسه بياخد من `RIR` (Regional Internet Registry). والـ `RIRs` بياخدوا التوزيع من `IANA` اللي يدير الـ global address pool.' },
            { title: 'هل جهازين في شبكتين مختلفين ممكن نفس IP؟', text: 'أيوة، بشرط إنهم مايتكلّموش مباشرة عبر الإنترنت بالعنوان الخاص. أول ما يطلعوا لازم PAT يغيّر المصدر لعنوان عام.' },
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'تشبيه بسيط',
          text: 'الـ `Public IP` زي عنوان الشارع العام للعمارة، والـ `Private IP` زي رقم الشقة جوه العمارة. كل عمارة ممكن يكون فيها شقة رقم 10، بس العنوان العام للعمارة لازم يكون فريد عشان البريد يوصل.',
        },
      ],
    },
    {
      id: 'how',
      title: 'إزاي بيشتغل العنونة الخاصة و NAT',
      short: 'الآلية',
      blocks: [
        {
          type: 'paragraph',
          text: 'خلينا نرتب الصورة: أولاً نعرف النطاقات الخاصة، وبعدين العناوين اللي لها معنى خاص، وبعدين نشوف إزاي الراوتر بيترجم بين الخاص والعام. الـ `classic Class A/B/C` بيساعد في الفهم، بس اللي بيحدد الخاص فعلياً هو نطاق `RFC 1918` مش اسم الـ class لوحده.',
        },
        {
          type: 'table',
          headers: ['Class', 'Private Range', 'CIDR', 'Subnet Mask', 'القاعدة'],
          rows: rfcRows,
        },
        { type: 'diagram', id: 'private-rfc1918', caption: 'الثلاث نطاقات الخاصة والحدود المهمة — خصوصاً 172.16–31 و 192.168.' },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Class A/B/C مش معناه كل العناوين خاصة',
          text: 'الـ `Class B` بيغطي أول octet من 128 لـ 191، بس الجزء **الخاص** منه بس هو `172.16 – 172.31`. كده `172.20.1.1` private، أمّا `172.15.1.1` و`172.32.1.1` public رغم إن الاتنين يبدوا Class B. كمان `192.169.1.1` مش private لأن التاني لازم يكون 168 بالظبط.',
        },
        {
          type: 'table',
          headers: ['العنوان', 'تصنيفه', 'السبب'],
          rows: rfcBoundaryRows,
        },
        { type: 'diagram', id: 'private-special-ranges', caption: 'لوحة تجميعية للعناوين الخاصة: loopback و APIPA و broadcast و multicast والتوثيق.' },
        {
          type: 'table',
          headers: ['النطاق', 'الاسم', 'الغرض', 'ملاحظة امتحانية'],
          rows: specialRows,
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'APIPA مش DHCP',
          text: 'لو الـ DHCP اشتغل، الجهاز هياخد عنوان من الـ pool زي `192.168.1.25` مع gateway وماسك و DNS. لو الـ DHCP فشل، الجهاز هيختار `169.254.x.x` بنفسه. APIPA معناه إن الـ client عارف يتكلم مع جيرانه بس **مفيش default gateway**، فمفيش إنترنت طبيعي.',
        },
        {
          type: 'paragraph',
          text: 'دلوقتي ندخل في NAT. الـ `NAT — Network Address Translation` بيبدّل عنوان IP في الـ header وهو بيعدّي الراوتر. أبسط استخدام إنه يخلي مصدر الـ packet الخاص يظهر كعنوان عام. الراوتر بيسمّي الواجهة نحو الـ LAN `inside` والواجهة نحو الـ ISP `outside`، وبيربط كل واحدة بأمر:`ip nat inside` أو `ip nat outside`.',
        },
        { type: 'diagram', id: 'private-lan-internet', caption: 'الـ packet يبدأ بعنوان خاص، ويطلع بعنوان عام بعد NAT، والرد يرجع بنفس الترجمة.' },
        {
          type: 'table',
          headers: ['المصطلح', 'المعنى', 'في مثالنا'],
          rows: natTermRows,
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Outside Local و Outside Global',
          text: 'في أغلب شبكات CCMA الـ outside host مش بيتترجم، فـ `Outside Local` و `Outside Global` بيكونوا نفس العنوان `198.51.100.20`. الفرق بينهم مهم بس لو فيه Destination NAT أو تحويل للجهاز الخارجي كمان.',
        },
        {
          type: 'steps',
          items: [
            { title: 'Static NAT — واحد لواحد', text: 'عنوان خاص واحد مرتبط دايماً بعنوان عام واحد. يظهر في جدول الترجمة حتى من غير traffic. مناسب لسيرفر داخلي محتاج عنوان ثابت.' },
            { title: 'Dynamic NAT — pool', text: 'الراوتر يختار عنوان عام من مجموعة متاحة وقت ظهور الـ traffic. الـ mapping مؤقت، وكل عنوان عام بيخدم جهاز واحد في نفس الوقت. لو الـ pool خلص، مفيش ترجمة جديدة.' },
            { title: 'PAT — NAT Overload', text: 'كتير من الأجهزة الخاصة يشاركوا عنوان عام واحد. الراوتر يفرّق بين الـ sessions بـ `source port`، وده اللي بيسمّوه `Port Address Translation`.' },
          ],
        },
        { type: 'diagram', id: 'private-static-nat', caption: 'Static NAT: عنوان داخلي واحد ↔ عنوان عام واحد بشكل دائم.' },
        { type: 'diagram', id: 'private-dynamic-nat', caption: 'Dynamic NAT: تخصيص مؤقت من pool، ومعاه خطر نفاد العناوين.' },
        { type: 'diagram', id: 'private-pat', caption: 'PAT: عنوان عام واحد وأكتر من client، والـ source port هو اللي بيفرّق بينهم.' },
        {
          type: 'table',
          headers: ['النوع', 'الطبيعة', 'بيستخدم بوروت؟', 'متى نستخدمه؟', 'أمر IOS مختصر'],
          rows: natCompareRows,
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'الفارق اللي بيجي منه سؤال امتحان',
          text: '`Dynamic NAT` معناها „عنوان عام لكل جهاز في نفس اللحظة“. `PAT` معناها „عنوان عام واحد لاكتر من جهاز، والتمييز بالبورت“. لو شفت كلمة `overload` في الأمر يبقى PAT.',
        },
      ],
    },
    {
      id: 'packet',
      title: 'تحليل الـ packet والـ DHCP خطوة بخطوة',
      short: 'على مستوى الـ packet',
      blocks: [
        {
          type: 'paragraph',
          text: 'خلينا نمشي مثال دقيق: PC1 الخاص `192.168.1.10:51500` عايز يفتح HTTPS على `198.51.100.20:443`. الراوتر R1 عنده عنوان عام `203.0.113.10` على الـ outside interface. الـ source port 51500 هيتم استخدامه كـ translated port لو كان متاح؛ لو مش متاح PAT يختار بورت تاني ويحدّث الجدول.',
        },
        { type: 'diagram', id: 'private-nat-packet', caption: 'من الـ inside interface لحد تعديل الـ IP والتCP headers والرد الراجع.' },
        {
          type: 'table',
          headers: ['المرحلة', 'Source IP', 'Source Port', 'Destination IP', 'Destination Port'],
          rows: [
            ['قبل NAT', '`192.168.1.10`', '`51500`', '`198.51.100.20`', '`443`'],
            ['بعد PAT', '`203.0.113.10`', '`51500` أو متاح غيره', '`198.51.100.20`', '`443`'],
            ['الرد', '`198.51.100.20`', '`443`', '`203.0.113.10`', '`51500` أو البورت المترجم'],
            ['بعد فك الترجمة', '`198.51.100.20`', '`443`', '`192.168.1.10`', '`51500`'],
          ],
        },
        {
          type: 'steps',
          items: [
            { title: '1 — تحديد الـ inside interface', text: 'الـ packet دخل من الواجهة اللي عليها `ip nat inside`، فالراوتر يعرف إن المصدر `inside local` والمطلوب ترجمته.' },
            { title: '2 — ترجمة المصدر', text: 'الراوتر يفحص الـ NAT rule ويحوّل `192.168.1.10` لـ `203.0.113.10`. في PAT بيضيف أو يحافظ على translated source port.' },
            { title: '3 — تخزين الـ entry', text: 'بيحفظ في `show ip nat translations`: inside local، inside global، outside local/global والـ ports حسب نوع الـ NAT.' },
            { title: '4 — مطابقة الرد', text: 'لما الرد يوصل لـ `203.0.113.10:51500`، الراوتر يبحث في الجدول ويطلع الـ inside local الأصلي.' },
            { title: '5 — استعادة العنوان', text: 'بيكتب `192.168.1.10:51500` كـ destination ويرسل الـ packet جوه الـ LAN.' },
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Checksums مهمة في الامتحان العملي',
          text: 'NAT غيّر `Source IP` في الـ IP header وغيّر الـ source port في الـ TCP/UDP header. عشان كده لازم يتحدّث `IPv4 header checksum` و`TCP/UDP checksum` (لأن الـ pseudo-header فيه عناوين IP). الراوتر بيعمل ده أوتوماتيك، بس لو كتبت أداة أو حاكيت packet لازم تحسبه تاني.',
        },
        {
          type: 'paragraph',
          text: 'دلوقتي ننتقل لـ DHCP. المشكلة اللي DHCP بيحلّها: تخيّل تكتب `ip address` و`mask` و`gateway` و`DNS` يدوياً لـ 200 جهاز. `DHCP — Dynamic Host Configuration Protocol` بيخصّص الإعدادات أوتوماتيك من `scope / pool`. المكوّنات الأساسية: `DHCP Server`، `DHCP Client`، `Pool / Scope`، `Lease duration`، والخيارات زي `default gateway` و`DNS server`.',
        },
        { type: 'diagram', id: 'private-dora', caption: 'DORA بالترتيب: Discover ثم Offer ثم Request ثم Acknowledgment.' },
        {
          type: 'steps',
          items: [
            { title: '1 — DHCP Discover', text: 'العميل مفيش IP، فبيبعت من `0.0.0.0:68` لـ `255.255.255.255:67` كـ broadcast. الهدف: „فيه DHCP server؟“.' },
            { title: '2 — DHCP Offer', text: 'السيرفر يرد بعرض فيه IP مقترح، mask، default router، DNS ومدة الـ lease. المصدر `67`، وقد يبعت broadcast أو unicast حسب التنفيذ.' },
            { title: '3 — DHCP Request', text: 'العميل لسه مصدره `0.0.0.0`؛ بيبعت broadcast ويقول „أنا عايز العنوان اللي عرضته يا سيرفر X“. كده بيرفض عروض سيرفرات تانية.' },
            { title: '4 — DHCP ACK', text: 'السيرفر يأكّد بـ `DHCP Acknowledgment`، ويدخل الـ binding في جدول الـ lease. بعدها العميل يبدأ يستخدم العنوان.' },
          ],
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'ترتيب DORA مش قابل للتبديل',
          text: 'الترتيب دايماً `Discover → Offer → Request → ACK`. لو شفت سؤال بيقدّم Request قبل Offer يبقى غلط. كمان الـ Discover والـ Request مصدرهم `0.0.0.0` لأن العميل لسه مفيش عنوان.' },
        {
          type: 'paragraph',
          text: 'الـ lease مش دايم. عند حوالي نص مدة الـ lease (`T1`) العميل بيبعت `DHCPREQUEST` غالباً unicast للسيرفر عشان يجدّد. لو السيرفر رد برفض، العميل يوقف استخدام العنوان ويرجع للـ DORA. ولو السيرفر اختفى تماماً، الـ client بيحاول لحد ما الـ lease يخلص وبعدين ممكن يظهر `169.254.x.x` APIPA.',
        },
        { type: 'diagram', id: 'private-dhcp-relay', caption: 'الـ `ip helper-address` بينقل طلب DHCP عبر subnet تانية.' },
        {
          type: 'paragraph',
          text: 'ليه محتاجين relay؟ لأن الـ DHCP Discover broadcast والراوتر مش بيمرّر broadcast بين الـ subnets افتراضياً. لما السيرفر بعيد، نحط على الواجهة القريبة من العميل الأمر `ip helper-address <server-ip>`. الراوتر هيبعت الـ request كـ unicast ويضيف `giaddr` (gateway IP address) عشان السيرفر يعرف من أنهي subnet جاي ويختار الـ pool الصح. الرد يرجع للـ relay وبعدين للعميل.',
        },
      ],
    },
    {
      id: 'config',
      title: 'إعداد Cisco IOS لـ NAT و DHCP',
      short: 'أوامر الإعداد',
      blocks: [
        {
          type: 'callout',
          tone: 'info',
          title: 'التوبولوجيا الموحّدة',
          text: '`R1` بين الـ LAN والـ ISP: `G0/0` جوه على `192.168.1.1/24` و`G0/1` بره على `203.0.113.10/30`. الـ ISP عنده `203.0.113.9/30` ناحية R1 و`198.51.100.1/24` ناحية السيرفر `198.51.100.20`. العناوين `203.0.113.x` و`198.51.100.x` هنا للتوثيق والتدريب بس.',
        },
        { type: 'diagram', id: 'private-lab-topology', caption: 'التوبولوجيا الكاملة: R1 و SW1 و PC1/PC2 والـ ISP والسيرفر.' },
        {
          type: 'table',
          headers: ['الجهاز / الواجهة', 'IP Address', 'Mask', 'الدور'],
          rows: [
            ['`R1 G0/0`', '`192.168.1.1`', '`255.255.255.0`', 'Inside interface + gateway'],
            ['`R1 G0/1`', '`203.0.113.10`', '`255.255.255.252`', 'Outside interface + PAT address'],
            ['`R-ISP G0/1`', '`203.0.113.9`', '`255.255.255.252`', 'Next hop من R1'],
            ['`R-ISP G0/0`', '`198.51.100.1`', '`255.255.255.0`', 'Gateway للسيرفر'],
            ['`SERVER`', '`198.51.100.20`', '`255.255.255.0`', 'هدف الـ ping/HTTPS'],
          ],
        },
        {
          type: 'code',
          label: 'A — R1 interfaces + default route',
          language: 'ios',
          code: `enable
configure terminal
hostname R1
!
interface gigabitEthernet 0/0
 description INSIDE_LAN
 ip address 192.168.1.1 255.255.255.0
 ip nat inside
 no shutdown
!
interface gigabitEthernet 0/1
 description OUTSIDE_TO_ISP
 ip address 203.0.113.10 255.255.255.252
 ip nat outside
 no shutdown
!
ip route 0.0.0.0 0.0.0.0 203.0.113.9
end
copy running-config startup-config`,
        },
        {
          type: 'table',
          headers: ['الأمر', 'بيعمل إيه؟'],
          rows: [
            ['`description INSIDE_LAN`', 'وصف نصي للواجهة، بيفيد في التشخيص ومش بيغيّر السلوك.'],
            ['`ip address 192.168.1.1 255.255.255.0`', 'يخلي R1 هو الـ default gateway للـ inside LAN.'],
            ['`ip nat inside`', 'يقول للراوتر إن الـ packet الجاي من هنا يعتبر inside local.'],
            ['`ip address 203.0.113.10 255.255.255.252`', 'يخلي G0/1 هي الـ public WAN interface.'],
            ['`ip nat outside`', 'يقول للراوتر إن الترجمة بتحصل لما الـ packet يخرج من هنا.'],
            ['`ip route 0.0.0.0 0.0.0.0 203.0.113.9`', 'default route للإنترنت عن طريق الـ ISP.'],
          ],
        },
        {
          type: 'paragraph',
          text: 'مهم: `inside` و`outside` مش معناهما „خاص” و„عام” بس؛ دول اتجاهات بالنسبة للراوتر. لازم تسمّي الواجهة الصح، وإلا الترجمة مش هتحصل في الاتجاه المطلوب.',
        },
        {
          type: 'code',
          label: 'B — Static NAT (واحد لواحد) — مثال مستقل',
          language: 'ios',
          code: `! بعد إعداد الواجهات من الجزء A
enable
configure terminal
ip nat inside source static 192.168.1.10 203.0.113.11
end
!
! على R-ISP لازم يبقى فيه route للعنوان العام الإضافي
enable
configure terminal
ip route 203.0.113.0 255.255.255.0 203.0.113.10
end`,
        },
        {
          type: 'table',
          headers: ['الأمر', 'الشرح'],
          rows: [
            ['`ip nat inside source static 192.168.1.10 203.0.113.11`', 'يربط Inside Local بـ Inside Global بشكل دائم. استخدمنا `.11` مش عنوان الواجهة `.10` عشان مايتعارضش مع R1 نفسه.'],
            ['`ip route 203.0.113.0/24 → 203.0.113.10`', 'بيقول للـ ISP يوجّه أي رد للنطاق العام الإضافي لـ R1.'],
            ['`show ip nat translations`', 'هتلاقي الـ static entry موجودة حتى من غير traffic.'],
            ['`no ip nat inside source static ...`', 'شيل الإعداد قبل ما تجرّب Dynamic أو PAT في نفس اللاب.'],
          ],
        },
        {
          type: 'code',
          label: 'C — Dynamic NAT (pool) — مثال مستقل',
          language: 'ios',
          code: `enable
configure terminal
access-list 1 permit 192.168.1.0 0.0.0.255
ip nat pool CCNA-POOL 203.0.113.11 203.0.113.13 netmask 255.255.255.248
ip nat inside source list 1 pool CCNA-POOL
end
copy running-config startup-config`,
        },
        {
          type: 'table',
          headers: ['الأمر', 'الشرح'],
          rows: [
            ['`access-list 1 permit 192.168.1.0 0.0.0.255`', 'يحدّد مين يتترجم: كل عناوين `192.168.1.0/24`. الـ wildcard هو عكس الماسك.'],
            ['`ip nat pool CCNA-POOL ... netmask ...`', 'يعرّف مدى العناوين العامة المتاحة للـ dynamic allocation.'],
            ['`ip nat inside source list 1 pool CCNA-POOL`', 'يربط الـ ACL بالـ pool. أول جهاز ياخد عنوان، والتاني ياخد اللي بعده.'],
            ['`show ip nat statistics`', 'Important: لو الـ pool خلص، الترجمة الجديدة مش هتتعمل.'],
          ],
        },
        {
          type: 'code',
          label: 'D — PAT / NAT Overload — المثال الأقرب للبيت والشركة',
          language: 'ios',
          code: `enable
configure terminal
access-list 1 permit 192.168.1.0 0.0.0.255
ip nat inside source list 1 interface gigabitEthernet 0/1 overload
end
copy running-config startup-config`,
        },
        {
          type: 'table',
          headers: ['الأمر', 'الشرح'],
          rows: [
            ['`access-list 1 permit 192.168.1.0 0.0.0.255`', 'نفس فكرة الـ dynamic NAT: بيختار الأجهزة اللي هتتترجم.'],
            ['`interface gigabitEthernet 0/1`', 'يستخدم عنوان الـ WAN نفسه `203.0.113.10` كـ inside global.'],
            ['`overload`', 'الكلمة الأهم: تسمح لاكتر من inside host يشاركوا نفس العنوان مع بورت مختلف لكل session.'],
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'ما تخلطش الأوامر',
          text: 'الـ Static والـ Dynamic والـ PAT أمثلة منفصلة. في لاب واحد ابدأ بـ `no` للإعداد القديم قبل ما تحط إعداد جديد، وبعدين راجع بـ `show running-config | include ip nat`.',
        },
        {
          type: 'code',
          label: 'E — R1 كـ DHCP Server',
          language: 'ios',
          code: `enable
configure terminal
ip dhcp excluded-address 192.168.1.1 192.168.1.10
ip dhcp excluded-address 192.168.1.254
!
ip dhcp pool LAN-USERS
 network 192.168.1.0 255.255.255.0
 default-router 192.168.1.1
 dns-server 8.8.8.8 1.1.1.1
 domain-name ccna.local
 lease 7
end
copy running-config startup-config`,
        },
        {
          type: 'table',
          headers: ['الأمر', 'الشرح'],
          rows: [
            ['`ip dhcp excluded-address 192.168.1.1 192.168.1.10`', 'يمنع تخصيص العنوان دي لأنها محجوزة للـ gateway والأجهزة الثابتة زي PC1 في مثال NAT.'],
            ['`ip dhcp pool LAN-USERS`', 'ينشئ اسم للـ scope.'],
            ['`network 192.168.1.0 255.255.255.0`', 'يحدد المدى اللي هيخصّص منه.'],
            ['`default-router 192.168.1.1`', 'دي.option 3 اللي بيوصل للعميل؛ لو غلط، الـ LAN يشتغل والإنترنت لا.'],
            ['`dns-server ...`', 'بيقدّم أسماء DNS للعميل. لو غلط، الـ ping بالـ IP يشتغل وموقع الويب لا.'],
            ['`domain-name ccna.local`', 'Suffix يُضاف للأسماء القصيرة (اختياري ومفيد).'],
            ['`lease 7`', 'مدة الإيجار 7 أيام. بعد نصها يحصل renewal.'],
          ],
        },
        {
          type: 'paragraph',
          text: 'لو السيرفر مش على نفس الـ subnet، استخدم `ip helper-address` على الواجهة القريبة من العميل. المثال تحته يفترض عملاء في `192.168.10.0/24` وسيرفر DHCP خارجي على `192.168.20.10`:',
        },
        {
          type: 'code',
          label: 'F — DHCP Relay على R1',
          language: 'ios',
          code: `enable
configure terminal
interface gigabitEthernet 0/0
 description CLIENT_LAN_10
 ip address 192.168.10.1 255.255.255.0
 ip helper-address 192.168.20.10
 no shutdown
!
interface gigabitEthernet 0/1
 description TO_DHCP_SERVER_20
 ip address 192.168.20.1 255.255.255.0
 no shutdown
end`,
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'قاعدة مهمة للـ relay',
          text: 'الـ helper بيتحط على الواجهة اللي بيجي منها الـ broadcast من العميل، مش على واجهة السيرفر. ولو عندك DHCP pool محلي على R1 لنفس الـ subnet، متعملش relay لنفس الشبكة في نفس الوقت — اختار طريقة واحدة عشان ما يحصلش تعارض.',
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
          text: 'التحقق معناه إنك تثبت أربع حاجات: الواجهة شغالة، المسار موجود، الـ NAT بيترجم، والـ DHCP بيخصّص. بعدين تختبر فعلياً بـ `ping` و`traceroute`. ركّز على المعنى مش على شكل المخرجات لأنه بيختلف بين IOS وPacket Tracer.',
        },
        {
          type: 'code',
          label: 'R1 — مخرجات تمثيلية بعد PAT و DHCP',
          language: 'ios',
          code: `R1# show ip interface brief
Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0     192.168.1.1     YES manual up                    up
GigabitEthernet0/1     203.0.113.10    YES manual up                    up

R1# show ip route | include 0.0.0.0
S*    0.0.0.0/0 [1/0] via 203.0.113.9

R1# show ip nat translations
Pro  Inside global         Inside local          Outside local        Outside global
tcp  203.0.113.10:51500   192.168.1.10:51500   198.51.100.20:443   198.51.100.20:443
tcp  203.0.113.10:52000   192.168.1.11:52000   198.51.100.20:443   198.51.100.20:443

R1# show ip nat statistics
Total translations: 2
Outside interfaces: GigabitEthernet0/1
Inside interfaces: GigabitEthernet0/0
Hits: 18  Misses: 2

R1# show ip dhcp binding
Bindings from all pools not associated with VRF:
IP address          Client-ID/              Lease expiration        Type
192.168.1.11        01aa.bbcc.ddee          Nov 27 2026 10:15 AM    Automatic

R1# show ip dhcp pool LAN-USERS
Pool LAN-USERS :
 Utilization mark (high/low)    : 100 / 0
 Subnet size (first/next)       : 0 / 0
 Total addresses                : 243
 Leased addresses               : 1
 Current index                  : 192.168.1.11`,
        },
        {
          type: 'table',
          headers: ['الأمر', 'Correct result', 'Incorrect / معناه'],
          rows: verifyRows,
        },
        {
          type: 'steps',
          items: [
            { title: '1 — ابدأ من القرب', text: 'من PC اعمل `ping 192.168.1.1`. لو فشل، المشكلة في DHCP/IP/Mask/السوّيتش مش NAT.' },
            { title: '2 — اختبر الراوتر نفسه', text: 'من R1 اعمل `ping 203.0.113.9` ثم `ping 198.51.100.20`. لو الـ ISP نجح والسيرفر لا، راجع route/ACL على ISP.' },
            { title: '3 — ولّد traffic من العميل', text: 'الـ NAT translation مش بيظهر من غير traffic. اعمل ping أو افتح HTTP من PC وبعدين ارجع لـ `show ip nat translations`.' },
            { title: '4 — قارن الـ counters', text: 'زيادة `Hits` معناها إن الراوتر بيستخدم الـ rule. ثباتها مع فشل الـ ping معناه ACL أو interfaces غلط.' },
          ],
        },
        {
          type: 'code',
          label: 'من PC1 و R1 — اختبارات Process',
          language: 'powershell',
          code: `C:\\> ipconfig
IPv4 Address . . . . . . . . . . . : 192.168.1.10
Subnet Mask . . . . . . . . . . . : 255.255.255.0
Default Gateway . . . . . . . . . : 192.168.1.1

C:\\> ping 198.51.100.20
Reply from 198.51.100.20: bytes=32 time=2ms TTL=126
Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)

R1# traceroute 198.51.100.20
  1  203.0.113.9  1 msec 1 msec 1 msec
  2  198.51.100.20  2 msec 2 msec 2 msec`,
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'DNS vs connectivity',
          text: 'لو `ping 198.51.100.20` نجح بس فتح `www.example.com` فشل، فالمسار والـ NAT تمام والـ DNS هو المشكلة. راجع `ipconfig /all` وخيار `dns-server` في الـ DHCP pool.',
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
          text: '`1)` ipconfig/address صحيح؟ · `2)` ping gateway؟ · `3)` الواجهة up/up؟ · `4)` default route موجود؟ · `5)` ACL بيطابق المصدر؟ · `6)` translation موجود بعد traffic؟ · `7)` الرد وصل للـ outside؟ · `8)` DHCP binding موجود؟ · `9)` غيّر حاجة واحدة بس وأعد الاختبار.',
        },
        {
          type: 'table',
          headers: ['# / المشكلة', 'الأعراض', 'السبب المحتمل', 'التحقق', 'الحل', 'النتيجة'],
          rows: troubleshootRows,
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'مثال 1 — APIPA بدل DHCP',
          text: `PC1 ظهر بـ \`169.254.12.40\` و\`ipconfig\` فيه \`Default Gateway . . . :\` فاضي. على R1 \`show ip dhcp pool\` بيقول \`Leased addresses = 0\`. السبب إن \`no shutdown\` ناقص على G0/0 أو إن الـ pool network مكتوب \`192.168.2.0\` بدل \`192.168.1.0\`.`,
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'مثال 2 —Dynamic NAT pool خلص',
          text: 'أول جهازين فاتحين والثالث فاشل. `show ip nat translations` فيه entry للعنوانين `.11` و `.12` بس، و`show ip nat statistics` بيوضّح إن الـ pool استنفد. الحل إنك توسّع النطاق أو تستخدم `overload` مع PAT.',
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'مثال 3 — NAT موجود بس مفيش رجوع',
          text: 'الـ translation اتعمل والـ ping للـ ISP شغال، بس السيرفر ما بيردش. غالباً الراوتر بتاع الـ ISP مفيش route للنطاق العام اللي استخدمته في Static/Dynamic NAT. راجع `show ip route` على ISP وضيف `ip route 203.0.113.0 255.255.255.0 <R1>`.',
        },
      ],
    },
    {
      id: 'lab',
      title: 'لابان عمليان: DHCP/APIPA و NAT/PAT',
      short: 'لاب Packet Tracer',
      blocks: [
        {
          type: 'paragraph',
          text: 'هعمل لابين متكاملين على نفس أسلوب Packet Tracer. الأول يركّز على DHCP والـ APIPA، والتاني يركّز على PAT والترجمة والرد. نفّذهم بالترتيب عشان تفرّق بين مشكلة التخصيص ومشكلة الترجمة.',
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Lab 1 — DHCP Server و APIPA',
          text: 'التوبولوجيا: `1 Router` + `1 Switch` + `2 PCs`. R1 هو الـ DHCP server والـ gateway لـ `192.168.1.0/24`. الهدف إن PC1 و PC2 ياخدوا IP أوتوماتيك، وبعدين نعطّل DHCP ونشوف APIPA.',
        },
        { type: 'table', headers: ['الجهاز', 'IP Address', 'Mask', 'Gateway', 'الدور'], rows: lab1Rows },
        {
          type: 'code',
          label: 'Lab 1 — R1 DHCP config',
          language: 'ios',
          code: `enable
configure terminal
hostname R1
!
interface gigabitEthernet 0/0
 ip address 192.168.1.1 255.255.255.0
 no shutdown
!
ip dhcp excluded-address 192.168.1.1 192.168.1.9
ip dhcp excluded-address 192.168.1.254
!
ip dhcp pool HOME-LAN
 network 192.168.1.0 255.255.255.0
 default-router 192.168.1.1
 dns-server 8.8.8.8
 domain-name ccna.local
 lease 1
end
copy running-config startup-config`,
        },
        {
          type: 'steps',
          items: [
            { title: 'المهمة 1', text: 'اربط PC1 و PC2 بـ SW1، واربط G0/0 بـ SW1. تأكد إن الـ links لونها أخضر.' },
            { title: 'المهمة 2', text: 'على كل PC: Desktop → IP Configuration → DHCP. افتح Command Prompt واكتب `ipconfig`.' },
            { title: 'المهمة 3', text: 'من R1 اكتب `show ip dhcp binding`. المفروض تشوف IP لكل PC مع Lease expiration.' },
            { title: 'المهمة 4', text: 'من PC1 اعمل `ping 192.168.1.1` و`ping <IP-of-PC2>`. الاتنين لازم ينجحوا.' },
            { title: 'المهمة 5 — Fault', text: 'شغّل `no service dhcp` على R1 أو احذف الـ pool على Main R1، وبعدين اعمل `ipconfig /renew` على PC1. لاحظ ظهور `169.254.x.x` بعد فشل الـ lease.' },
            { title: 'المهمة 6', text: 'اطلب `ping 192.168.1.1` وهو على APIPA. في Packet Tracer قد يفشل لأن العنوان مش في نفس الشبكة؛ اشرح إن APIPA بيعمل link-local بس ومفيش gateway.' },
            { title: 'المهمة 7 — Restore', text: 'رجّع `service dhcp` أو أعد الـ pool، واعمل `ipconfig /renew`. راجع `show ip dhcp server statistics` و`show ip dhcp binding` تاني.' },
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'النتيجة المتوقعة للـ Lab 1',
          text: 'بعد الإصلاح: PC1 و PC2 ياخدوا `192.168.1.x` من الـ pool، والـ gateway `192.168.1.1` قابل للـ ping. عند كسر DHCP يظهر `169.254.x.x`، وده طبيعي — معناه إن الـ client يائس من الـ server مش إن الكابل مقطوع.',
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Lab 2 — NAT و PAT',
          text: 'ضيف `R-ISP` و`SERVER`. R1 بقى edge router: G0/0 inside و G0/1 outside. PC1 و PC2 هيشاركوا نفس العنوان العام `203.0.113.10` عبر PAT. استخدم عناوين TEST-NET عشان ما تستخدمش عناوين إنترنت حقيقية.',
        },
        { type: 'diagram', id: 'private-lab-topology', caption: 'التوبولوجيا الكاملة للـ Lab 2 مع R-ISP والسيرفر العام.' },
        { type: 'table', headers: ['الجهاز', 'الواجهة', 'IP Address', 'Mask', 'Gateway', 'ملاحظة'], rows: lab2Rows },
        {
          type: 'code',
          label: 'Lab 2 — R1 complete PAT config',
          language: 'ios',
          code: `enable
configure terminal
hostname R1
!
interface gigabitEthernet 0/0
 ip address 192.168.1.1 255.255.255.0
 ip nat inside
 no shutdown
!
interface gigabitEthernet 0/1
 ip address 203.0.113.10 255.255.255.252
 ip nat outside
 no shutdown
!
access-list 1 permit 192.168.1.0 0.0.0.255
ip nat inside source list 1 interface gigabitEthernet 0/1 overload
ip route 0.0.0.0 0.0.0.0 203.0.113.9
end
copy running-config startup-config`,
        },
        {
          type: 'code',
          label: 'Lab 2 — R-ISP + Server',
          language: 'ios',
          code: `! R-ISP
enable
configure terminal
hostname R-ISP
!
interface gigabitEthernet 0/1
 ip address 203.0.113.9 255.255.255.252
 no shutdown
!
interface gigabitEthernet 0/0
 ip address 198.51.100.1 255.255.255.0
 no shutdown
end
!
! SERVER (Desktop → IP Configuration)
IP 198.51.100.20 / 255.255.255.0
Gateway 198.51.100.1`,
        },
        {
          type: 'steps',
          items: [
            { title: 'المهمة 1', text: 'طبّق جدول العناوين على PC1 و PC2 والسيرفر. اضبط PC1 = `.10` و PC2 = `.11` يدوياً فيLab 2.' },
            { title: 'المهمة 2', text: 'على R1 طبّق إعداد الواجهات والـ default route من الكود اللي فوق. تأكد إن `show ip interface brief` كله up/up.' },
            { title: 'المهمة 3', text: 'طبّق PAT. راجع `show running-config | include ip nat` ولازم تلاقي `ip nat inside` و `ip nat outside` وكلمة `overload`.' },
            { title: 'المهمة 4', text: 'من PC1 اعمل `ping 198.51.100.20`، وبعدين من PC2 اعمل نفس الـ ping. الاثنان لازم ينجحوا رغم إن المصدر العام واحد.' },
            { title: 'المهمة 5', text: 'على R1 اكتب `show ip nat translations`. المفروض تشوف سطرين بنفس `Inside global 203.0.113.10` وبـ ports مختلفة.' },
            { title: 'المهمة 6', text: 'على السيرفر اعمل ping لـ `203.0.113.10` — ده بيختبر الـ return traffic. الراوتر يطابق الـ entry ويرجّعه للـ PC الصح.' },
            { title: 'المهمة 7 — Fault', text: 'ادخل على `interface gigabitEthernet 0/0` واكتب `no ip nat inside`. اعمل ping تاني من PC1. الـ translation مش هيتعمل. راجع `show ip nat statistics`، وبعدين رجّع `ip nat inside`.' },
            { title: 'المهمة 8 — Fault تاني', text: 'غيّر الـ ACL لـ `permit 192.168.2.0 0.0.0.255` وشوف `Hits` ما بتزيدش. ارجّعها لـ `192.168.1.0 0.0.0.255`.' },
          ],
        },
        {
          type: 'code',
          label: 'نتائج متوقعة — Lab 2',
          language: 'ios',
          code: `R1# show ip nat translations
Pro  Inside global         Inside local          Outside local        Outside global
icmp 203.0.113.10:1       192.168.1.10:1       198.51.100.20:1     198.51.100.20:1
icmp 203.0.113.10:2       192.168.1.11:2       198.51.100.20:2     198.51.100.20:2

PC1> ping 198.51.100.20
Reply from 198.51.100.20: bytes=32 time=1ms TTL=126
Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)`,
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'حدود المحاكاة',
          text: 'Packet Tracer بيحاكي الـ NAT والـ DHCP بشكل تعليمي؛ أرقام الـ ports في المخرجات ممكن تختلف من تشغيل لتاني. اللي لازم يتطابق هو الفكرة: نفس العنوان العام + بورت مختلف لكل session، ووجود الـ entry قبل الرد.',
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
          text: 'كل سؤال فيه أربع إجابات وزر **تحقق من الإجابة**.Feedback والشرح مخفيين لحد ما تضغط الزر، وبعدSubmission الأزرار بتتقفل. اقرأ الشرح كويس — ده أهم من حفظ رقم الإجابة.',
        },
        {
          type: 'quiz',
          questions: [
            {
              id: 'q1',
              prompt: 'إيه نطاقات RFC 1918 الخاصة بـ IPv4؟',
              options: [
                '`10.0.0.0/8` و `172.16.0.0/12` و `192.168.0.0/16`',
                '`127.0.0.0/8` و `169.254.0.0/16` و `224.0.0.0/4`',
                '`172.0.0.0/8` و `192.0.0.0/8` و `198.51.100.0/24`',
                '`10.0.0.0/16` و `172.16.0.0/16` و `192.168.0.0/24` فقط',
              ],
              correctIndex: 0,
              requireSubmit: true,
              explanation:
                'الصح هو **(A)**. الـ RFC 1918 حجز ثلاثة نطاقات: `10.0.0.0/8`، `172.16.0.0/12`، و `192.168.0.0/16`. **(B)** دي عناوين خاصة بأغراض تانية مش RFC 1918. **(C)** فيها نطاقات عامة/توثيق. **(D)** الـ prefixes غلط — المهم `/8` و `/12` و `/16`.',
            },
            {
              id: 'q2',
              prompt: 'أي مجموعة فيها عناوين **خاصة** فقط؟',
              options: [
                '`172.15.1.1` · `172.32.1.1` · `192.169.1.1`',
                '`10.1.1.1` · `172.20.1.1` · `192.168.1.1`',
                '`8.8.8.8` · `203.0.113.10` · `192.168.1.1`',
                '`127.0.0.1` · `169.254.1.1` · `172.20.1.1`',
              ],
              correctIndex: 1,
              requireSubmit: true,
              explanation:
                'الصح هو **(B)**: `10.1.1.1` داخل `/8`، و`172.20.1.1` داخل second octet 16–31، و`192.168.1.1` داخل `/16`. **(A)** كله public. **(C)** فيه اتنين عامين/توثيق. **(D)** فيه loopback و APIPA — دول special addresses مش RFC 1918 private ranges.',
            },
            {
              id: 'q3',
              prompt: 'جهاز ظهر بعنوان `169.254.22.10` بعد ما DHCP فشل. إيه الصح عن ده؟',
              options: [
                'عنوان عام خصصه الـ ISP للجهاز',
                'عنوان loopback بيختبر الـ TCP/IP stack',
                'APIPA link-local: ممكن يتكلم مع جيران في نفس الرابط، ومفيش default gateway ولا إنترنت طبيعي',
                'عنوان من DHCP pool بس الـ lease خلص',
              ],
              correctIndex: 2,
              requireSubmit: true,
              explanation:
                'الصح هو **(C)**: نطاق `169.254.0.0/16` هو APIPA. الجهاز بيختاره تلقائياً لما ميلاقيش DHCP، ويشتغل link-local فقط من غير gateway. **(A)** غلط لأنه مش عام. **(B)** وصف `127.0.0.1`. **(D)** غلط لأن DHCP لو اشتغل كان هيخصّص من pool زي `192.168.1.x`.',
            },
            {
              id: 'q4',
              prompt: 'PC1 `192.168.1.10:51500` و PC2 `192.168.1.11:52000` بيخرجوا من نفس الراوتر بـ `203.0.113.10`. إيه اللي بيسمّح بالكده؟',
              options: [
                'Static NAT لأنه بيعمل واحد لواحد',
                'PAT / NAT Overload لأن الـ source port بيفرّق بين الـ sessions',
                'DHCP relay لأنه بيمرّر broadcast',
                'APIPA لأنه بيخصّص عناوين تلقائياً',
              ],
              correctIndex: 1,
              requireSubmit: true,
              explanation:
                'الصح هو **(B)**: PAT بيستخدم عنوان عام واحد لاكتر من client وبيميّز كل session بـ source port، وده اسمه `overload`. **(A)** Static NAT واحد لواحد. **(C)** DHCP relay وظيفته تمرير طلبات DHCP. **(D)** APIPA بديل فاشل لـ DHCP.',
            },
            {
              id: 'q5',
              prompt: 'رتب رسائل DHCP الابتدائية بالترتيب الصح.',
              options: [
                'Offer → Discover → ACK → Request',
                'Discover → Request → Offer → ACK',
                'Discover → Offer → Request → Acknowledgment',
                'Request → Discover → Offer → Acknowledgment',
              ],
              correctIndex: 2,
              requireSubmit: true,
              explanation:
                'الصح هو **(C)**: الترتيب `Discover` (client broadcast من 0.0.0.0) ثم `Offer` (server يعرض الإعدادات) ثم `Request` (client يختار العرض) ثم `Acknowledgment` (تأكيد وتسجيل الـ lease). أي ترتيب تاني غلط في الامتحان.',
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
            ['Public vs Private', 'العام فريد عالمياً وبيخصّصه ISP؛ الخاص يتكرر في كل LAN ومش متوجّه على الإنترنت'],
            ['IANA → RIR → ISP', 'التوزيع عالمياً، بعدين إقليمياً، وبعدين للعميل'],
            ['RFC 1918', '`10/8` · `172.16/12` · `192.168/16`'],
            ['172 boundary', '`172.16 – 172.31` private؛ `172.15` و `172.32` public'],
            ['192 boundary', '`192.168.x.x` private؛ `192.169.x.x` public'],
            ['Loopback', '`127.0.0.0/8`، و`127.0.0.1` = localhost لاختبار الـ stack'],
            ['APIPA', '`169.254/16` عند فشل DHCP — link-local من غير gateway'],
            ['Limited broadcast', '`255.255.255.255` جوه الـ local domain'],
            ['Unspecified', '`0.0.0.0` = no address / any address حسب السياق'],
            ['Multicast', '`224.0.0.0/4` لمجموعة عناوين'],
            ['Network / Directed broadcast', 'أول وآخر عنوان في الـ subnet'],
            ['NAT', 'ترجمة عنوان خاص لعام؛ Inside interface و Outside interface'],
            ['Inside Local / Global', 'خاص قبل الترجمة / عام بعد الترجمة'],
            ['Static NAT', 'واحد لواحد دائم — مناسب لسيرفر'],
            ['Dynamic NAT', 'pool، واحد لواحد مؤقت، ممكن ينفد'],
            ['PAT / Overload', 'كتير لواحد، والـ port بيفرّق بين sessions'],
            ['DHCP', 'بيخصّص IP + mask + gateway + DNS + lease'],
            ['DORA', 'Discover → Offer → Request → ACK'],
            ['DHCP Relay', '`ip helper-address` على الواجهة القريبة من العميل عشان DHCP يعدّي subnet'],
          ],
        },
        {
          type: 'table',
          headers: ['الأمر', 'الاستخدام'],
          rows: [
            ['`ip nat inside` / `ip nat outside`', 'تحديد اتجاه الترجمة على الواجهات'],
            ['`ip nat inside source static ...`', 'Static NAT واحد لواحد'],
            ['`ip nat pool ...` + `ip nat inside source list ... pool ...`', 'Dynamic NAT من مجموعة عناوين'],
            ['`ip nat inside source list ... interface ... overload`', 'PAT / NAT Overload'],
            ['`ip dhcp excluded-address ...`', 'حجز عناوين للـ gateway والبنية التحتية'],
            ['`ip dhcp pool ...` / `network ...` / `default-router ...`', 'إعداد DHCP server على الراوتر'],
            ['`ip helper-address ...`', 'DHCP relay عبر subnet'],
            ['`show ip nat translations` / `show ip nat statistics`', 'فحص الترجمات والـ hits'],
            ['`show ip dhcp binding` / `show ip dhcp pool` / `show ip dhcp server statistics`', 'فحص التخصيص والـ lease'],
            ['`show ip interface brief` / `show ip route` / `show access-lists`', 'فحص الواجهات والمسارات والـ ACL'],
            ['`ping` / `traceroute`', 'اختبار الاتصال وتتبع المسار'],
          ],
        },
        {
          type: 'table',
          headers: ['فخ امتحاني', 'الإجابة الصح'],
          rows: [
            ['"كل Class B خاص"', 'لا — بس `172.16–31` خاص'],
            ['"`172.32.1.1` private"', 'لا — خارج `172.16/12`'],
            ['"`192.169.1.1` private"', 'لا — التاني لازم 168'],
            ['"APIPA عنوان من DHCP"', 'لا — بيظهر لما DHCP يفشل'],
            ['"APIPA فيه إنترنت"', 'لا — من غير default gateway'],
            ['"`0.0.0.0` عنوان مضيف عادي"', 'لا — unspecified / any'],
            ['"Static NAT بيستخدم بورت"', 'لا — واحد لواحد بدون port translation'],
            ['"Dynamic NAT و PAT نفس الحاجة"', 'لا — PAT بيشارك عنوان واحد بالبورت'],
            ['"مفيش NAT translation يعني الراوتر بايظ"', 'لا — ممكن مفيش traffic أو ACL غلط أو inside/outside مقلوب'],
            ['"DORA يبدأ بـ Offer"', 'لا — يبدأ بـ Discover'],
            ['"DHCP Discover مصدره عنوان DHCP server"', 'لا — مصدره `0.0.0.0` لأن العميل مفيش IP'],
            ['"ip helper-address يتحط على واجهة السيرفر"', 'لا — يتحط على واجهة العميل'],
            ['"NAT مش بيغيّر checksum"', 'لا — لازم تحديث IP والتCP/UDP checksum'],
            ['"ping بالاسم يفشل يعني NAT فاشل"', 'لا — ممكن DNS غلط والـ ping بالـ IP شغال'],
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'جملة تلخّص الدرس',
          text: 'العنوان الخاص بيوفّر لكل شبكة مدى تتكرر بحرية، و RFC 1918 بيحدّدione المداات التلاتة. NAT/PAT بيخلي العنوان ده يطلع للإنترنت، و DHCP بيخصّصه تلقائياً. لو حصل فشل، اسأل: هل المشكلة في التخصيص (DHCP/APIPA) ولا في الترجمة (NAT/ACL/inside-outside) ولا في المسار (default route)',
        },
      ],
    },
  ],
}
