import type { Lesson } from '../types'

const sizeRows: string[][] = [
  ['Address length', '32 bit', '128 bit'],
  ['Groups', '4 octets × 8 bit', '8 hextets × 16 bit'],
  ['Writing style', 'Dotted decimal — `192.168.1.10`', 'Hex + colon — `2001:DB8::1`'],
  ['Total addresses', '`2^32` ≈ 4.3 billion', '`2^128` ≈ 3.4 × 10^38'],
  ['Main pressure', 'Exhaustion → private addresses + NAT/PAT', 'Designed from the start for phones, IoT and cloud growth'],
]

const hextetRows: string[][] = [
  ['Full address', '8 hextets separated by `:`', '`2001:0DB8:0000:0000:0000:0000:0000:0001`'],
  ['One hextet', '16 bit = 4 hex digits', '`0DB8` = `0000110110111000`'],
  ['One hex digit', '4 bit, also called a nibble', '`D` = `1101` = decimal `13`'],
  ['Full form', 'Every hextet written with 4 digits', '`0000` not `0`'],
  ['Short form', 'Leading zeros removed + one `::`', '`2001:DB8::1`'],
]

const hexRows: string[][] = [
  ['`0`', '`0`', '`0000`'],
  ['`1`', '`1`', '`0001`'],
  ['`8`', '`8`', '`1000`'],
  ['`A`', '`10`', '`1010`'],
  ['`B`', '`11`', '`1011`'],
  ['`C`', '`12`', '`1100`'],
  ['`D`', '`13`', '`1101`'],
  ['`F`', '`15`', '`1111`'],
]

const compressionRows: string[][] = [
  ['Full 128-bit form', '`2001:0DB8:0000:0000:0000:0000:0000:0001`', '8 hextets', 'Valid, but long'],
  ['After leading zeros', '`2001:DB8:0:0:0:0:0:1`', '8 hextets', 'Valid'],
  ['After `::` compression', '`2001:DB8::1`', '3 visible + 5 hidden', 'Valid and shortest'],
  ['Wrong double `::`', '`2001::DB8::1`', 'Ambiguous', 'Invalid — you cannot know which gap gets the zeros'],
  ['Wrong digit count', '`2001:DB8:12345::1`', '5 hex digits in one hextet', 'Invalid — one hextet takes 1 to 4 hex digits'],
]

const validityRows: string[][] = [
  ['`2001:DB8::1`', 'Valid', 'One `::`, eight hextets after expansion'],
  ['`2001:0DB8:0000:0000:0000:0000:0000:0001`', 'Valid', 'Full form, each hextet has 4 hex digits'],
  ['`FE80::1`', 'Valid', 'Two visible hextets, `::` fills six zero hextets'],
  ['`::1`', 'Valid', 'Loopback — seven zero hextets then `0001`'],
  ['`2001::DB8::1`', 'Invalid', '`::` used twice'],
  ['`2001:DB8:::1`', 'Invalid', 'Three colons in a row'],
  ['`2001:DB8:GGGG::1`', 'Invalid', '`G` is not a hexadecimal digit'],
  ['`2001:DB8:1:2:3:4:5:6:7`', 'Invalid', 'Nine hextets — an IPv6 address has exactly eight'],
]

const prefixRows: string[][] = [
  ['`/48`', '48 prefix + 80 ID', 'First 3 hextets', 'Usually a site allocation'],
  ['`/56`', '56 prefix + 72 ID', 'First 3 hextets + first 8 bits of H4', 'Small site or several subnets'],
  ['`/64`', '64 prefix + 64 ID', 'First 4 hextets', 'Standard LAN subnet; SLAAC expects this'],
  ['`/127`', '127 prefix + 1 ID', 'Almost all bits are network', 'Point-to-point lab link — use carefully'],
  ['`/128`', '128 prefix + 0 ID', 'Whole address', 'One host / host route'],
]

const addressTypeRows: string[][] = [
  ['`2000::/3`', 'GUA — Global Unicast', 'First 3 bits = `001`; range `2000::` to `3FFF:...`', 'Globally routable', '`2001:DB8:1:1::10`'],
  ['`FE80::/10`', 'LLA — Link-Local', 'First 10 bits = `1111111010`; range `FE80::` to `FEBF:...`', 'One link only; routers do not forward it', '`FE80::1`'],
  ['`FF00::/8`', 'Multicast', 'First 8 bits = `11111111`', 'Group delivery', '`FF02::1`'],
  ['`::1`', 'Loopback', 'Seven zero hextets + `0001`', 'Host talks to itself', '`::1`'],
  ['`::`', 'Unspecified', 'All 128 bits are zero', 'Means "no address" in some contexts', '`::`'],
  ['`2001:DB8::/32`', 'Documentation', 'Reserved for examples and labs', 'Do not treat as real internet address', '`2001:DB8::1`'],
]

const euiRows: string[][] = [
  ['1 — Start', '`00:1A:2B:3C:4D:5E`', '48-bit MAC address'],
  ['2 — Split', '`00:1A:2B` | `3C:4D:5E`', 'OUI | vendor part'],
  ['3 — Insert', '`00:1A:2B:FF:FE:3C:4D:5E`', '`FF:FE` goes in the middle → 64 bit'],
  ['4 — Flip U/L bit', '`00` → `02` using mask `0x02`', 'Second bit from the right: `0` → `1`'],
  ['5 — Final bytes', '`02:1A:2B:FF:FE:3C:4D:5E`', '`u = 1` means universal scope'],
  ['6 — Group by two', '`021A:2BFF:FE3C:4D5E`', 'Four hextets = interface ID'],
  ['7 — Add prefix', '`2001:DB8:1:1:21A:2BFF:FE3C:4D5E`', 'Leading zero in `021A` is removed in text'],
]

const verifyRows: string[][] = [
  ['`show ipv6 interface brief`', 'G0/0 and G0/1 `up/up` with GUA and link-local', '`administratively down` = needs `no shutdown`; `down/down` = cable/peer'],
  ['`show ipv6 interface gigabitEthernet 0/0`', 'Shows GUA, `FE80::...`, MTU and ND status', 'Wrong `::/64` here explains most LAN failures'],
  ['`show ipv6 route`', 'Connected `C` routes for each `/64`', 'Missing network = wrong prefix or missing interface config'],
  ['`show ipv6 neighbors`', 'Neighbor cache with LLA → MAC mapping', 'Empty = NDP/LLA or Layer 2 problem'],
  ['`ping 2001:DB8:12:12::2`', 'R1 reaches R2 on the router link', 'Failure = wrong prefix, typo or interface down'],
  ['`ping 2001:DB8:2:2::10`', 'PC1 reaches PC2 end to end', 'Failure = route or prefix on the far LAN'],
  ['`ping FE80::2`', 'IOS asks for the outgoing interface', 'Without the interface, LLA is ambiguous'],
  ['`show running-config | section ipv6`', 'All `ipv6 ...` commands are present', 'Missing `ipv6 unicast-routing` is a common exam trap'],
]

const troubleshootRows: string[][] = [
  ['1 — Host has no IPv6 address', '`ipconfig` shows no GUA', 'IPv6 disabled on NIC, or no SLAAC/RA', 'Check host IPv6 setting + `show ipv6 interface brief`', 'Enable IPv6 or set a static GUA', 'Host gets a valid 128-bit address'],
  ['2 — Router not routing IPv6', 'Interfaces have addresses but hosts cannot leave the LAN', '`ipv6 unicast-routing` missing', '`show running-config | include unicast-routing`', 'Add `ipv6 unicast-routing`', 'RA and IPv6 routing work'],
  ['3 — LAN prefix written `/127`', 'PC cannot ping its gateway', 'Two usable host bits mistaken for LAN design', '`show ipv6 interface g0/0`', 'Change back to `::/64`', 'Gateway and hosts share the LAN'],
  ['4 — Interface administratively down', 'Status `administratively down/down`', 'Forgot `no shutdown`', '`show ipv6 interface brief`', 'Enter interface and type `no shutdown`', 'Status becomes `up/up`'],
  ['5 — GUA typo in a hextet', '`2001:DB8:1:2::1` instead of `2001:DB8:1:1::1`', 'One hex digit changed the /64', 'Compare running-config with the addressing table', 'Correct the hextet and re-test ping', 'Host is in the intended subnet'],
  ['6 — Two `::` in one address', 'IOS rejects the command', '`2001::DB8::1` is ambiguous', 'Read the error message; count hextets', 'Use one `::` only', 'Command accepted'],
  ['7 — Expansion count wrong', 'Expanded address has 7 hextets', 'Forgot `8 - visible = missing`', 'Count visible hextets in `2001:DB8::1`', 'Insert five zero hextets', 'Expansion gives eight hextets'],
  ['8 — LLA ping fails', '`ping FE80::2` gives ambiguous / no reply', 'LLA needs an outgoing interface', '`show ipv6 neighbors` + ping prompt', 'Choose the correct interface when prompted', 'LLA ping succeeds on that link'],
  ['9 — Duplicate LLA on one link', 'Neighbor entries flap; traffic intermittent', 'Two devices set to `FE80::1`', '`show ipv6 neighbors` on both devices', 'Use unique `FE80::1` and `FE80::2`', 'Stable neighbor cache'],
  ['10 — EUI-64 result unexpected', 'Interface ID not `021A:2BFF:FE3C:4D5E`', 'U/L bit not flipped, or privacy/random ID used', 'Read MAC + `show ipv6 interface`', 'Check mask `0x02`; use static GUA for a fixed lab answer', 'Expected interface ID appears'],
]

const lab1Rows: string[][] = [
  ['`R1 G0/0`', '`2001:DB8:1:1::1/64`', 'Gateway of LAN 1'],
  ['`R1 G0/1`', '`2001:DB8:12:12::1/64`', 'R1 side of router link'],
  ['`R2 G0/0`', '`2001:DB8:12:12::2/64`', 'R2 side of router link'],
  ['`R2 G0/1`', '`2001:DB8:2:2::1/64`', 'Gateway of LAN 2'],
  ['`PC1`', '`2001:DB8:1:1::10/64`, gateway `::1`', 'Host in LAN 1'],
  ['`PC2`', '`2001:DB8:2:2::10/64`, gateway `::1`', 'Host in LAN 2'],
]

const lab2Rows: string[][] = [
  ['`R1 G0/0`', '`2001:DB8:1:1::/64 eui-64` + `FE80::1 link-local`', 'LAN 1 — read the generated GUA from `show ipv6 interface brief`'],
  ['`R1 G0/1`', '`2001:DB8:12:12::1/64` → fault `/127` → restore `/64`', 'Point-to-point link'],
  ['`R2 G0/0`', '`2001:DB8:12:12::2/64`', 'Point-to-point link'],
  ['`R2 G0/1`', '`2001:DB8:2:2::/64 eui-64` + `FE80::2 link-local`', 'LAN 2 — read the generated GUA'],
  ['`PC1 / PC2`', 'Auto config or static GUA in the matching `/64`', 'End hosts'],
]

export const topic18Lesson: Lesson = {
  topicId: '1.8',
  title: 'IPv6 Addressing & Prefix',
  description:
    'في الدرس ده هنتعلّم ليه IPv6 اتصمّم بعد ما IPv4 اتستنفد، وإزاي نقرأ عنوان 128-bit ونتعامل مع الـ hextets والـ hexadecimal والضغط بـ `::`. هنفهم كمان الـ prefix والـ interface ID، والفرق بين GUA و LLA، وحساب Modified EUI-64 من MAC، مع إعداد Cisco IOS وتحقق ولابين وخمسة أسئلة CCNA.',
  estimatedTime: '~100 دقيقة',
  steps: [
    {
      id: 'what',
      title: 'إيه اللي إحنا بندرسه وليه وجوده مهم؟',
      short: 'مفهوم الدرس',
      blocks: [
        {
          type: 'paragraph',
          text: 'تخيّل إن كل موبايل وسيرفر وكاميرا في العالم محتاج عنوان فريد. IPv4 عنده `2^32` بس حوالي 4.3 مليار عنوان، وده خلص عملياً. الحل المؤقت كان private addresses و NAT/PAT، بس IPv6 اتصمّم كحل حقيقي: `128 bit` يعني مساحة عنوان أكبر بـ `2^96` مرة من IPv4.',
        },
        {
          type: 'table',
          headers: ['Feature', 'IPv4', 'IPv6'],
          rows: sizeRows,
        },
        { type: 'diagram', id: 'ipv6-v4-v6-size', caption: 'ليه IPv4 اتستنفد، وإزاي مساحة IPv6 اتصمّم للنمو;' },
        {
          type: 'steps',
          items: [
            { title: 'مش ترقية بسيطة', text: 'IPv6 مش „IPv4 بس أطول“. عنده صيغة عنوان جديدة، header مختلف، وآليات اكتشاف جيران وعناوين تلقائية خاصة بيه.' },
            { title: 'العنوان أطول بكتير', text: '`128 bit` مقسومة على تمانية hextets، وكل hextet 16 bit. يعني `8 × 16 = 128` بالظبط.' },
            { title: 'التعايش مع IPv4', text: 'في الشبكات الحقيقية بيشتغلوا غالباً dual stack: الجهاز أو الراوتر شغال IPv4 و IPv6 مع بعض. كل بروتوكول له قواعده.' },
            { title: 'الهدف في CCNA', text: 'تقدر تقرأ العنوان، تضغطه وتفرده، تفهم الـ prefix، تفرّق بين GUA و LLA، وتكتب أوامر IOS الأساسية.' },
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'التشبيه البسيط',
          text: 'لو IPv4 زي مدينة فيها شوارع وبيوت محدودة، IPv6 زي مدينة اتبنيت من الأول بعدد شوارع يكفي كل الأجيال الجاية. مش هتقف تحسب كل عنوان، بس لازم تعرف شكل العنوان وقواعد كتابته.',
        },
        { type: 'diagram', id: 'ipv6-128-structure', caption: 'نفس العنوان مكتوب كـ 8 hextets، وبعدين كـ 128 bit بالـ binary.' },
      ],
    },
    {
      id: 'how',
      title: 'إزاي نكتب ونضغط عنوان IPv6',
      short: 'الصيغة والضغط',
      blocks: [
        {
          type: 'paragraph',
          text: 'الصيغة الكاملة: ثمانية hextets مفصولة بكولون `:`. كل hextet فيه 4 أرقام hexadecimal، وكل digit بيمثّل 4 بتات. بعدين نقدر نختصر بطريقتين: نشيل الـ leading zeros من كل hextet، ونستبدل أطول سلسلة متتابعة من الأصفار بـ `::` مرة واحدة.',
        },
        { type: 'diagram', id: 'ipv6-hextets', caption: 'اضغط أي hextet عشان تشوف قيمته الـ 16-bit.' },
        {
          type: 'table',
          headers: ['Part', 'القاعدة', 'مثال'],
          rows: hextetRows,
        },
        { type: 'diagram', id: 'ipv6-hex-binary', caption: 'كل hex digit = 4 bit؛ الأوزان 8 · 4 · 2 · 1.' },
        {
          type: 'table',
          headers: ['Hex digit', 'Decimal', 'Binary'],
          rows: hexRows,
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'مهم: الـ leading zeros بس',
          text: '`0DB8` تبقى `DB8`، و`0001` تبقى `1`، و`0000` تبقى `0`. بس `2000` لازم تفضل `2000`؛ لو كتبتها `200` غيّرت القيمة من 8192 لـ 512.',
        },
        { type: 'diagram', id: 'ipv6-leading-zeros', caption: 'إزالة الأصفار من أول كل hextet بس، من غير تغيير القيمة.' },
        { type: 'diagram', id: 'ipv6-zero-compression', caption: 'خمسة hextets صفرية متتابعة اتنضغطت في `::` واحدة.' },
        { type: 'diagram', id: 'ipv6-expansion', caption: 'الفرد: نعدّ الظاهر ونحسب الناقص قبل ما نكتب الأصفار.' },
        {
          type: 'table',
          headers: ['الصيغة', 'المثال', 'العد', 'الحكم'],
          rows: compressionRows,
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'قاعدتان مش قابلتين للكسر',
          text: '`::` بتتكتب مرة واحدة في العنوان، وبتمثّل سلسلة واحدة متتابعة من hextets صفرية. كمان الصيغة الكاملة لازم فيها 8 hextets، والصيغة المختصرة لازم تتفرد لـ 8 hextets بالظبط.',
        },
        {
          type: 'table',
          headers: ['المثال', 'الحكم', 'السبب'],
          rows: validityRows,
        },
        {
          type: 'steps',
          items: [
            { title: '1 — اكتب الصيغة الكاملة', text: `ابدأ بـ 8 hextets من 4 digits: \`2001:0DB8:0000:0000:0000:0000:0000:0001\`.` },
            { title: '2 — شيل الـ leading zeros', text: 'يبقى `2001:DB8:0:0:0:0:0:1`. لسه مفيش `::`.' },
            { title: '3 — ضغط سلسلة الأصفار', text: 'الخمسة متتابعين يتكتبوا `::` فتطلع `2001:DB8::1`.' },
            { title: '4 — افحص بالعد', text: '3 ظاهر + 5 مخفي = 8. لو المجموع مش 8 يبقى فيه غلط.' },
          ],
        },
      ],
    },
    {
      id: 'packet',
      title: 'الـ prefix والأنواع اللي لازم تعرفها',
      short: 'على مستوى العنوان',
      blocks: [
        {
          type: 'paragraph',
          text: 'بعد `/` بتكتب الـ prefix length. ده مش subnet mask زي IPv4؛ ده عدد البتات من اليسار اللي بتمثّل الشبكة. الباقي من اليمين هو interface identifier. في `/64` الحد بيقع بعد رابع hextet بالظبط: أول 64 bit prefix وآخر 64 bit interface ID.',
        },
        { type: 'diagram', id: 'ipv6-prefix-boundary', caption: 'حد `/64` عند البت 64 — بعد H4 مباشرة.' },
        {
          type: 'table',
          headers: ['Prefix', 'التقسيم', 'أين الحد؟', 'الاستخدام'],
          rows: prefixRows,
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'ليه `/64` مهم في الامتحان؟',
          text: 'أغلب شبكات المستخدمين في IPv6 بتاخد `/64`. كتير من آليات التخصيص التلقائي زي SLAAC متوقعة إن الـ interface ID يبقى 64 bit. لو شفت LAN address من غير `/64`، اسأل نفسه: هل ده point-to-point ولا غلط في الإعداد؟',
        },
        { type: 'diagram', id: 'ipv6-gua-lla', caption: 'GUA قابل للتوجيه عالمياً؛ LLA للرابط المحلي فقط.' },
        {
          type: 'table',
          headers: ['النطاق', 'الاسم', 'كيف تعرفه؟', 'قابل للتوجيه؟', 'مثال'],
          rows: addressTypeRows,
        },
        {
          type: 'steps',
          items: [
            { title: 'GUA عبر الراوترات', text: 'مصدر `2001:DB8:1:1::10` ودستination `2001:DB8:2:2::10`؛ الراوترات تتوجّههم لأن العنوانين داخل نطاق `2000::/3`.' },
            { title: 'LLA جوه رابط واحد', text: '`FE80::1` و`FE80::2` على نفس الكابل يتكلّموا بس. الراوتر يستخدم LLA كـ next hop في جيران IPv6 بس ما يعبّريش الـ packet لرابط تاني.' },
            { title: 'ping لـ LLA', text: 'لما تكتب `ping FE80::2` على IOS، الراوتر هيطلب منك تحدد outgoing interface. لو ما حددتش، مش هيعرف أنهي رابط تقصده.' },
            { title: 'عناوين التوثيق', text: '`2001:DB8::/32` مخصوص للأمثلة. استخدمها في اللاب والامتحان بدل ما تكتب عنوان عام حقيقي.' },
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'GUA و LLA على نفس الواجهة',
          text: 'الواجهة الواحدة في IOS غالباً يكون عليها أكتر من IPv6 address: GUA للتوجيه و link-local للجيران. ما تمسحش الـ LLA لأنك شفت GUA مكتوب على الواجهة.',
        },
      ],
    },
    {
      id: 'config',
      title: 'إعداد Cisco IOS وحساب Modified EUI-64',
      short: 'أوامر الإعداد',
      blocks: [
        {
          type: 'paragraph',
          text: 'أول أمر في أي راوتر IPv6 هو `ipv6 unicast-routing`؛ من غيره الراوتر مش هيوجّه IPv6 ولا يبعت Router Advertisements. بعدين تدخل الواجهة وتكتب `ipv6 address <address>/<prefix>` بدل `ip address <address> <mask>`. الـ LLA بيتم توليده تلقائياً لمعظم الواجهات اللي عليها IPv6، وممكن تكتبه يدوياً بكلمة `link-local`.',
        },
        { type: 'diagram', id: 'ipv6-modified-eui64', caption: 'من MAC لـ 64-bit interface ID: إدراج `FF:FE` ثم قلب U/L bit.' },
        {
          type: 'table',
          headers: ['الخطوة', 'الناتج', 'القاعدة'],
          rows: euiRows,
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'أكثر غلط في EUI-64',
          text: 'البت اللي يتقلب هو U/L bit في أول بايت باستخدام `0x02`، مش I/G bit (`0x01`). في مثالنا `00` يبقى `02`. لو قلبت البت الغلط هتطلع `01:1A:2B:...` وده غلط.',
        },
        {
          type: 'paragraph',
          text: 'بسبب إن الـ interface ID في EUI-64 مرتبط بـ MAC، ممكن يتتبّع الجهاز. عشان كده أنظمة التشغيل الحديثة بتستخدم privacy extensions أو random interface IDs. في اللاب، لو محتاج قيمة ثابتة استخدم GUA يدوي أو اقرأ العنوان الفعلي من `show ipv6 interface brief` بدل ما تفترضه.',
        },
        {
          type: 'code',
          label: 'R1 — Static GUA + link-local',
          language: 'ios',
          code: `enable
configure terminal
hostname R1
ipv6 unicast-routing
!
interface gigabitEthernet 0/0
 description LAN_1
 ipv6 address 2001:DB8:1:1::1/64
 ipv6 address FE80::1 link-local
 no shutdown
!
interface gigabitEthernet 0/1
 description TO_R2
 ipv6 address 2001:DB8:12:12::1/64
 no shutdown
end
copy running-config startup-config`,
        },
        {
          type: 'code',
          label: 'R2 — Static GUA + link-local',
          language: 'ios',
          code: `enable
configure terminal
hostname R2
ipv6 unicast-routing
!
interface gigabitEthernet 0/0
 description TO_R1
 ipv6 address 2001:DB8:12:12::2/64
 no shutdown
!
interface gigabitEthernet 0/1
 description LAN_2
 ipv6 address 2001:DB8:2:2::1/64
 ipv6 address FE80::2 link-local
 no shutdown
end
copy running-config startup-config`,
        },
        {
          type: 'table',
          headers: ['الأمر', 'بيعمل إيه؟'],
          rows: [
            ['`ipv6 unicast-routing`', 'يفعّل توجيه IPv6 وإرسال RA على الواجهات.'],
            ['`ipv6 address 2001:DB8:1:1::1/64`', 'يضبط GUA و prefix length على الواجهة.'],
            ['`ipv6 address FE80::1 link-local`', 'يضبط LLA يدوي؛ لازم يبدأ بـ `FE80` ويكون فريداً على الرابط.'],
            ['`no shutdown`', 'يشغّل الواجهة؛ من غيرها Status هيبقى administratively down.'],
            ['`ipv6 address 2001:DB8:1:1::/64 eui-64`', 'يولّد الـ interface ID من MAC بعد تعديل U/L bit.'],
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'قاعدة حفظ سريعة',
          text: 'IPv4: `ip address IP MASK`. IPv6: `ipv6 address IP/PREFIX`. مفيش subnet mask مكتوب بنقاط في IPv6.',
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
          text: 'التحقق في IPv6 بيعتمد على أربع حاجات: الواجهة شغالة، العنوان والـ prefix صح، المسار موجود، والجيران اتعرفوا عن بعض عبر NDP. بعدين تختبر بـ ping من القريب للبعيد.',
        },
        {
          type: 'code',
          label: 'R1 — مخرجات تمثيلية',
          language: 'ios',
          code: `R1# show ipv6 interface brief
GigabitEthernet0/0   [up/up]
    FE80::1
    2001:DB8:1:1::1
GigabitEthernet0/1   [up/up]
    FE80::260:3EFF:FE45:6700
    2001:DB8:12:12::1

R1# show ipv6 route
C   2001:DB8:1:1::/64 [0/0]
     via GigabitEthernet0/0, directly connected
C   2001:DB8:12:12::/64 [0/0]
     via GigabitEthernet0/1, directly connected

R1# show ipv6 neighbors
IPv6 Address          Age  Link-layer Addr  State Interface
FE80::2                 8  0050.56C0.0001   REACH Gi0/1
2001:DB8:12:12::2      12  0050.56C0.0001   REACH Gi0/1

R1# ping 2001:DB8:12:12::2
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 2001:DB8:12:12::2, timeout is 2 seconds:
!!!!!`,
        },
        {
          type: 'table',
          headers: ['الأمر', 'النتيجة الصح', 'معنى الخطأ'],
          rows: verifyRows,
        },
        {
          type: 'steps',
          items: [
            { title: '1 — الواجهة أولاً', text: '`show ipv6 interface brief`: لو administratively down، اعمل `no shutdown`. لو down/down، راجع الكابل والطرف التاني.' },
            { title: '2 — العنوان والـ prefix', text: 'راجع أن الـ hextets مطابقة لجدول العناوين وأن `/64` مكتوب في الـ LAN.' },
            { title: '3 — المسار', text: '`show ipv6 route` لازم يوري connected routes للشبكتين. لو ناقصة، الراوتر مش هيوجه.' },
            { title: '4 — الجيران', text: '`show ipv6 neighbors` بيربط LLA بـ MAC. لو فاضي، ابحث عن مشكلة L2 أو عن LLA مكرر.' },
            { title: '5 — ping متدرّج', text: 'اعمل ping للجateway، وبعدين للراوتر التاني، وبعدين لـ PC2. أول حاجة تفشل تحديد مكان المشكلة.' },
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Ping لـ LLA على IOS',
          text: 'الإخراج هيطلب: `Output Interface:`. اكتب الواجهة الصح زي `gigabitEthernet0/1`. لو كتبت `FE80::2` من غير تحديد واجهة، الراوتر مش هيعرف أي link تقصده.',
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
          text: '`1)` العنوان 128 bit؟ · `2)` ثمانية hextets بعد الفرد؟ · `3)` `::` مرة واحدة؟ · `4)` `/64` في الـ LAN؟ · `5)` `ipv6 unicast-routing` موجود؟ · `6)` الواجهة `up/up`؟ · `7)` Connected route موجود؟ · `8)` `show ipv6 neighbors` فيه جيران؟ · `9)` غيّر حاجة واحدة بس وأعد الاختبار.',
        },
        {
          type: 'table',
          headers: ['# / المشكلة', 'الأعراض', 'السبب المحتمل', 'التحقق', 'الحل', 'النتيجة'],
          rows: troubleshootRows,
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'مثال 1 — `/127` في LAN',
          text: '`show ipv6 interface g0/0` بيوري `2001:DB8:1:1::1/127`. الـ PC عنده `::10/64` ومش قادر يعمل ping للجateway. الراوتر شايف إن الـ /127 نقطة إلى نقطة، والهست شايف إنه لازم يستخدم RA. الحل: `no ipv6 address 2001:DB8:1:1::1/127` وبعدين أعد `/64`.',
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'مثال 2 — فرد غلط',
          text: 'الطالب كتب `2001:DB8::1` وفردها لـ `2001:DB8:0:0:0:0:1` — سبعة hextets بس. العد الصح: 3 ظاهر + 5 مخفي = 8، فالصحيحة `2001:DB8:0:0:0:0:0:1`.',
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'مثال 3 — EUI-64 والـ privacy',
          text: 'المتوقع من MAC `00:1A:2B:3C:4D:5E` هو `021A:2BFF:FE3C:4D5E`. لو الجهاز ظهر بعنوان تاني تماماً، غالباً privacy extension أو random ID. في اللاب اقرأ العنوان من `show ipv6 interface brief` أو استخدم GUA يدوي.',
        },
      ],
    },
    {
      id: 'lab',
      title: 'لابان عمليان: Addressing و EUI-64 مع Fault',
      short: 'لاب Packet Tracer',
      blocks: [
        {
          type: 'paragraph',
          text: 'هعمل لابين على نفس التوبولوجيا: `R1` و `R2`، راوتر لكل LAN، و`SW1` يوصل الـ hosts. الأول يركّز على GUA ثابت ووصول PC1 لـ PC2. التاني يركّز على EUI-64 و link-local وتجربة الخطأ المتعمّد `/127`.',
        },
        { type: 'diagram', id: 'ipv6-lab-topology', caption: 'التوبولوجيا الكاملة: LAN 1 — R1 ↔ R2 — LAN 2.' },
        {
          type: 'callout',
          tone: 'info',
          title: 'Lab 1 — Static IPv6 end to end',
          text: 'استخدم `2 Routers` + `1 Switch` + `2 PCs`. حط `2001:DB8:1:1::/64` و`2001:DB8:12:12::/64` و`2001:DB8:2:2::/64`. الهدف إن PC1 يعمل ping لـ PC2 بعد تفعيل التوجيه على الراوترين.',
        },
        { type: 'table', headers: ['الجهاز / الواجهة', 'IPv6 Address', 'الدور'], rows: lab1Rows },
        {
          type: 'code',
          label: 'Lab 1 — R1 + R2 كامل',
          language: 'ios',
          code: `! ===== R1 =====
enable
configure terminal
hostname R1
ipv6 unicast-routing
!
interface gigabitEthernet 0/0
 ipv6 address 2001:DB8:1:1::1/64
 no shutdown
!
interface gigabitEthernet 0/1
 ipv6 address 2001:DB8:12:12::1/64
 no shutdown
end
copy running-config startup-config

! ===== R2 =====
enable
configure terminal
hostname R2
ipv6 unicast-routing
!
interface gigabitEthernet 0/0
 ipv6 address 2001:DB8:12:12::2/64
 no shutdown
!
interface gigabitEthernet 0/1
 ipv6 address 2001:DB8:2:2::1/64
 no shutdown
end
copy running-config startup-config`,
        },
        {
          type: 'steps',
          items: [
            { title: 'المهمة 1', text: 'اربط PC1 و R1 بـ SW1، واربط R1 بـ R2، واربط R2 بـ PC2. تأكد إن الـ links لونها أخضر.' },
            { title: 'المهمة 2', text: 'على PC1 و PC2: Desktop → IP Configuration → IPv6. حط GUA والـ gateway من الجدول.' },
            { title: 'المهمة 3', text: 'طبّق كود R1 و R2. راجع `show ipv6 interface brief` ولازم تلاقي `up/up`.' },
            { title: 'المهمة 4', text: 'من R1 اعمل `ping 2001:DB8:12:12::2`، ومن R2 اعمل `ping 2001:DB8:1:1::1`. الاتنين لازم ينجحوا.' },
            { title: 'المهمة 5', text: 'من PC1 اعمل `ping 2001:DB8:2:2::10`. لازم يوصل لـ PC2 عبر الراوترين.' },
            { title: 'المهمة 6', text: 'اكتب `show ipv6 neighbors` على R1 وR2. هتلاقي LLA مرتبط بـ MAC لكل جار على الرابط.' },
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'النتيجة المتوقعة للـ Lab 1',
          text: 'PC1 ↔ PC2 شغال، و`show ipv6 route` فيه connected routes للشبكات التلاتة. لو فشل ping من PC1، ابدأ من gateway مش من PC2.',
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Lab 2 — EUI-64 و LLA والخطأ المتعمّد',
          text: 'غيّر واجهات الـ LAN على الراوترين لتستخدم `eui-64`. حط LLA يدوي مختلف لكل راوتر. وبعد ما الكل يشتغل، غيّر R1 G0/1 من `/64` لـ `/127` وشوف أين يتكسر الاتصال، وبعدين ارجّعه.',
        },
        { type: 'table', headers: ['الجهاز / الواجهة', 'الإعداد', 'ملاحظة'], rows: lab2Rows },
        {
          type: 'code',
          label: 'Lab 2 — EUI-64 + LLA',
          language: 'ios',
          code: `! ===== R1 =====
enable
configure terminal
interface gigabitEthernet 0/0
 no ipv6 address 2001:DB8:1:1::1/64
 ipv6 address 2001:DB8:1:1::/64 eui-64
 ipv6 address FE80::1 link-local
 no shutdown
end

! ===== R2 =====
enable
configure terminal
interface gigabitEthernet 0/1
 no ipv6 address 2001:DB8:2:2::1/64
 ipv6 address 2001:DB8:2:2::/64 eui-64
 ipv6 address FE80::2 link-local
 no shutdown
end`,
        },
        {
          type: 'steps',
          items: [
            { title: 'المهمة 1', text: 'طبّق كود Lab 2 واكتب `show ipv6 interface brief` على الراوترين. العنوان اللي هيظهر هو الـ GUA المولّد من EUI-64.' },
            { title: 'المهمة 2', text: 'لو عرفت MAC للواجهة، احسب المتوقع: `00:1A:2B:3C:4D:5E` → `021A:2BFF:FE3C:4D5E`. قارن الحساب بالمخرجات.' },
            { title: 'المهمة 3', text: 'من R1 اعمل `ping FE80::2` واختار `gigabitEthernet0/1` لما يسأل عن الـ outgoing interface.' },
            { title: 'المهمة 4 — Fault', text: 'ادخل `interface gigabitEthernet 0/1` على R1 واكتب `no ipv6 address 2001:DB8:12:12::1/64` ثم `ipv6 address 2001:DB8:12:12::1/127`.' },
            { title: 'المهمة 5', text: 'من PC1 اعمل ping لـ PC2 تاني. غالباً هيفشل لأن R1 مش شايف شبكة LAN 2 على إنها متصلة مباشرة.' },
            { title: 'المهمة 6 — Restore', text: 'شيل الـ `/127` وأعد `ipv6 address 2001:DB8:12:12::1/64`. راجع `show ipv6 route` ثم أعد الـ ping.' },
            { title: 'المهمة 7', text: 'سجّل الفرق بين العنوان الثابت والعنوان الناتج من EUI-64، واكتب ليه الـ privacy extensions ممكن تخلي العنوان يتغيّر.' },
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'حدود المحاكاة',
          text: 'بعض إصدارات Packet Tracer بتولّد LLA تلقائي حتى لو ما كتبتش أمر يدوي، وبتستخدم MAC افتراضي للواجهة. اللي لازم يتطابق في اللاب هو المنطق: `FF:FE` في النص، قلب U/L bit، وLLA يبدأ بـ `FE80`.',
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
          text: 'كل سؤال فيه أربع إجابات وزر **تحقق من الإجابة**. الـ feedback والشرح مخفيين لحد ما تضغط الزر، وبعد Submission الأزرار بتتقفل. اقرأ الشرح كويس — ده أهم من حفظ رقم الإجابة.',
        },
        {
          type: 'quiz',
          questions: [
            {
              id: 'q1',
              prompt: 'ليه IPv6 اتصمّم أصلاً بعد IPv4؟',
              options: [
                'لأن IPv4 عنده 32 bit واتستنفد عملياً؛ IPv6 عنده 128 bit ومساحة أكبر بـ `2^96` مرة.',
                'لأن IPv4 مش بيشتغل مع NAT/PAT خالص.',
                'لأن IPv6 بيستخدم decimal بدل hexadecimal عشان الأسهل.',
                'لأن IPv4 مفيش فيه private addresses.',
              ],
              correctIndex: 0,
              requireSubmit: true,
              explanation:
                'الصح هو **(A)**. IPv4 = `2^32` عنوان، وIPv6 = `2^128` عنوان، والفرق `2^96`. الـ NAT/PAT والـ private addresses بس أدّوا وقت أطول لـ IPv4، ولم يلغوا مشكلة النفاد. **(B)** غلط لأن NAT/PAT بيشتغل مع IPv4 وساعد بالظبط بسبب النفاد. **(C)** غلط لأن IPv6 hex. **(D)** غلط لأن RFC 1918 موجود في IPv4.',
            },
            {
              id: 'q2',
              prompt: 'إيه أقصر صيغة للعنوان `2001:DB8:0:0:0:0:0:1`؟',
              options: [
                '`2001:DB8::1`',
                '`2001:DB8:0:0:0:0:0:1`',
                '`2001::DB8::1`',
                '`2001:DB8:0000::1`',
              ],
              correctIndex: 0,
              requireSubmit: true,
              explanation:
                'الصح هو **(A)**. شيلنا الـ leading zeros فطلع `2001:DB8:0:0:0:0:0:1`، وبعدين ضغطنا الخمسة أصفار المتتابعة في `::` مرة واحدة: `2001:DB8::1`. **(B)** صحيح كقيمة بس مش أقصر صيغة. **(C)** غلط لأن `::` اتستخدمت مرتين. **(D)** مش أقصر صيغة لأنه لسه فيه صفر واحد مكتوب بدل مايدخلوا كلهم في `::`.',
            },
            {
              id: 'q3',
              prompt: 'لو فردنا `FE80::1`، هيبقى فيه كام hextet صفر مخفي مكان الـ `::`؟',
              options: [
                '4',
                '5',
                '6',
                '7',
              ],
              correctIndex: 2,
              requireSubmit: true,
              explanation:
                'الصح هو **(C)**. الظاهر hextetين بس: `FE80` و`0001`. يعني الناقص `8 - 2 = 6`، والفرد هو `FE80:0:0:0:0:0:0:1`. **(A)** و**(B)** و**(D)** كلها غلط لأن العد لازم يوصل للمجموع 8.',
            },
            {
              id: 'q4',
              prompt: 'إيه معنى إن عنوان مكتوب بعده `/64`؟',
              options: [
                'أول 64 bit network prefix وآخر 64 bit interface identifier.',
                'أول 64 bit host وآخر 64 bit prefix.',
                'العنوان فيه 64 hextet بس.',
                'الـ subnet mask هي `255.255.255.0`.',
              ],
              correctIndex: 0,
              requireSubmit: true,
              explanation:
                'الصح هو **(A)**. الـ prefix length بيعدّ البتات من اليسار، فـ `/64` يعني أول أربعة hextets network والباقي interface ID. **(B)** معكوس. **(C)** غلط لأن العنوان 8 hextets بس. **(D)** غلط لأن IPv6 ما بيكتبش subnet mask بالنقاط.',
            },
            {
              id: 'q5',
              prompt: 'إيه الـ interface ID الناتج من Modified EUI-64 للمAC `00:1A:2B:3C:4D:5E`؟',
              options: [
                '`001A:2BFF:FE3C:4D5E`',
                '`021A:2BFF:FE3C:4D5E`',
                '`021A:FF2B:FE3C:4D5E`',
                '`001A:2BFF:FE3C:4D5F`',
              ],
              correctIndex: 1,
              requireSubmit: true,
              explanation:
                'الصح هو **(B)**. نحط `FF:FE` في النص فنطلع `00:1A:2B:FF:FE:3C:4D:5E`، وبعدين نقلب U/L bit في أول بايت بـ `0x02` فتطلع `02:1A:2B:FF:FE:3C:4D:5E`، وبتجميع البايتات: `021A:2BFF:FE3C:4D5E`. **(A)** نسي قلب البت. **(C)** حط `FF` في مكان غلط. **(D)** غيّر آخر بايت من `5E` لـ `5F`.',
            },
          ],
        },
      ],
    },
    {
      id: 'summary',
      title: 'خلاصة وتذكير سريع قبل الامتحان',
      short: 'الخلاصة',
      blocks: [
        {
          type: 'list',
          items: [
            'IPv6 جاء لأن IPv4 32-bit اتستنفد؛ IPv6 128-bit بـ 8 hextets × 16 bit.',
            'كل hex digit = 4 bit، والـ hextet = 4 hex digits = 16 bit.',
            'الاختصار: شيل الـ leading zeros من كل hextet، وبعدين استخدم `::` واحدة لأطول سلسلة صفرية.',
            'الفرد: عدّ الـ hextets الظاهرة ثم احسب `8 - الظاهر` وضع الأصفار مكان `::`.',
            '`/64` يعني أول 64 bit prefix وآخر 64 bit interface ID.',
            'GUA من `2000::/3` قابل للتوجيه عالمياً؛ LLA من `FE80::/10` للرابط المحلي فقط.',
            'Modified EUI-64: insert `FF:FE` ثم قلب U/L bit بـ `0x02`؛ والنتيجة هنا `021A:2BFF:FE3C:4D5E`.',
            'على IOS: `ipv6 unicast-routing` + `ipv6 address IP/PREFIX` + `no shutdown`.',
          ],
        },
        {
          type: 'table',
          headers: ['لو شفت...', 'فكّر في...'],
          rows: [
            ['`2001::DB8::1`', '`::` اتكررت — عنوان غير صالح'],
            ['عنوان فيه 7 hextets بعد الفرد', 'عدد الأصفار المخفية غلط'],
            ['PC مش قادر يعمل ping للجateway', '`/127` في LAN أو واجهة down'],
            ['`ping FE80::2` فشل', 'LLA محتاج outgoing interface'],
            ['EUI-64 مش متطابق', 'U/L bit أو privacy/random ID'],
            ['مفيش RA للهست', '`ipv6 unicast-routing` ناقص على الراوتر'],
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'آخر نصيحة',
          text: 'في الامتحان لا تحفظ العناوين كصور. اكتبها، قسّمها لـ 8 hextets، شيل الـ leading zeros، واستخدم العد للتحقق. لو مشيت على الخطوات دي، الضغط والفرد والـ EUI-64 كلهم بيبقوا حساب بسيط.',
        },
      ],
    },
  ],
}
