import type { Lesson } from '../types'

export const topic11Lesson: Lesson = {
  topicId: '1.1',
  title: 'دور ووظيفة مكوّنات الشبكة',
  description:
    'في الدرس ده هتعرف كل جهاز في الشبكة بيعمل إيه بالظبط، وليه محتاجينه، وإزاي يتكلموا مع بعض على مستوى الـ frame والـ packet. هتربط بين المفاهيم والإعداد على Cisco IOS وهتطبّق كل ده في لاب Packet Tracer.',
  estimatedTime: '~45 دقيقة',
  steps: [
    {
      id: 'what',
      title: 'إيه اللي إحنا بندرسه وليه وجوده مهم؟',
      short: 'مفهوم الدرس',
      blocks: [
        {
          type: 'paragraph',
          text: 'الشبكة ببساطة هي مجموعة أجهزة متوصّلة ببعض علشان تتبادل بيانات وموارد. بس لو كل الأجهزة اتوصّلت ببعض عشوائياً مفيش حد هيقدر يوجّه البيانات لمكانها. هنا بتيجي فكرة `network components`: كل جهاز ليه دور واضح، ولو عرفت دوره هتعرف تتوقع سلوك الشبكة كلها واحدة واحدة.',
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'مكان الدرس في الـ blueprint',
          text: 'الموضوع ده هو Objective رقم `1.1` في دومين `Network Fundamentals` وبيسأل عليه في الامتحان بصيغة "مين بيعمل إيه؟" وبصيغة "أي جهاز هياخد القرار ده؟". الـ sub-objectives من `1.1.a` لـ `1.1.h` بيغطّوا ثمانية مكوّنات لازم تعرفهم بالاسم والوظيفة.',
        },
        {
          type: 'paragraph',
          text: 'خلي بالك: السؤال في CCNA مش بيطلب منك تحفظ تعريف غيبى فقط، لكن إنك تفرّق بين جهاز بيقرّر بـ `MAC address` وآخر بيقرّر بـ `IP address`، وجهاز بيفحص الـ payload وجهاز بيوزّع الكهرباء. اختار العنصر من القائمة دي عشان تشوف دور كل جهاز بالتفصيل.',
        },
        {
          type: 'diagram',
          id: 'device-map',
          caption: 'اضغط على أي مكوّن عشان تشوف وظيفته، الطبقة اللي بيشتغل عليها، ومثال عملي.',
        },
        {
          type: 'paragraph',
          text: 'ليه محتاجين كل المكوّنات دي؟ لأن الشبكة الحقيقية ليها أربع حاجات أساسية: **الاتصال** بين الأجهزة، **المشاركة** في الملفات والطابعات والإنترنت، **التوسّع** لما تزيد الأجهزة، و**الاستمرارية** لما جهاز يفشل. كل مكوّن بيغطّي جزء من الصورة دي، ومفيش جهاز بيقوم بدور كل التانيين بكفاءة.',
        },
        {
          type: 'list',
          items: [
            '`Routers`: يربطوا بين شبكتين مختلفتين ويقرّروا أحسن path للـ packet.',
            '`Layer 2 switches`: يربطوا الأجهزة داخل نفس الـ LAN ويوجّهوا الـ frames بالـ MAC address.',
            '`Layer 3 switches`: سوّيتش + راوتر في جهاز واحد، بيعمل routing بين الـ VLANs بسرعة هاردوير.',
            '`Next-generation firewalls` و `IPS`: يفحصوا الترافيك ويسمحوا أو يمنعوا حسب السياسات.',
            '`Access points`: يوفّروا وصول لاسلكي للشبكة السلكية.',
            '`Controllers` زي `Cisco DNA Center` و `WLC`: إدارة مركزية للشبكة ونقاط الوصول.',
            '`Endpoints` و `Servers`: الأجهزة اللي بتنتج وتستهلك البيانات (الكمبيوترات، الطابعات، السيرفرات).',
            '`PoE`: يغذّي الأجهزة زي الـ IP phones والـ APs بالكهرباء من نفس كابل الشبكة.',
          ],
        },
      ],
    },
    {
      id: 'how',
      title: 'إزاي بيشتغلوا مع بعض + تشبيه من الحياة الواقعية',
      short: 'الآلية والتشبيه',
      blocks: [
        {
          type: 'paragraph',
          text: 'تخيّل مدينة كبيرة: كل بيت فيه ساكن (endpoint)، الشوارع الصغيرة داخل الحارة هي الـ `switch`، ومكتب البريد الرئيسي اللي بيقرر تكون الرسالة لمحافظة تانية هو الـ `router`، والبوابة اللي بتفحص جواز السفر قبل ما تخرج الرسالة من المدينة هي الـ `firewall`. لو عايز تبعت بيانات لصاحبك في نفس الحارة هتمشي في الشارع مباشرة، أمّا لو في محافظة تانية هتروح مكتب البريد أولاً.',
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'القاعدة اللي بيفهم بيها CCNA',
          text: 'نفس الـ LAN = الـ switch يكفي. شبكات مختلفة / VLANs مختلفة = محتاج `router` أو `Layer 3 switch`. وكل ما زادت المسافة زادت أهمية الـ `WAN` والـ `firewall`.',
        },
        {
          type: 'steps',
          items: [
            {
              title: 'الـ PC بيجهّز الطلب',
              text: 'تطبيق زي المتصفح بيطلب صفحة ويب. الـ `TCP` بيقسّم البيانات لـ segments وبيضيف source port و destination port (زي `80` أو `443`)، وبعدين الـ `IP` بيضيف source و destination IP.',
            },
            {
              title: 'الـ switch بيستلم الـ frame',
              text: 'الـ switch بيقرأ الـ destination MAC من الـ Ethernet frame، بيدور عليه في الـ `MAC address table`، وبيبعت الـ frame للميناء الصحيح بدل ما يبعته لكل المنافذ. لو ملقاهوش بيعمل `flooding` لكل المنافذ في نفس الـ VLAN.',
            },
            {
              title: 'الراوتر بيدخل على الخط',
              text: 'لما الـ destination IP يكون في شبكة تانية، الـ PC بيبعت الـ frame لعنوان الـ `default gateway`. الراوتر بيشيل الـ Ethernet frame، بيقرأ الـ IP packet، بيقلّل الـ `TTL`، وبيختار الـ next hop من جدول التوجيه.',
            },
            {
              title: 'الـ firewall و الـ IPS بيفحصوا',
              text: 'قبل ما الترافيك يخرج، الـ `NGFW` بيطبّق policy: يسمح، يرفض، أو يبلّغ عن تهديد. الـ `IPS` بيقارن التوقيعات والسلوك بـ signatures معروفة.',
            },
            {
              title: 'السيرفر بيردّ',
              text: 'السيرفر بيستقبل الطلب، بيرجّع البيانات بنفس الترتيب تقريباً: response → packet → frame → bits، والرد بيرجع بنفس المسار العكسي.',
            },
          ],
        },
        {
          type: 'table',
          headers: ['التشبيه', 'المكوّن في الشبكة', 'القرار اللي بيتاخد'],
          rows: [
            ['الساكن في البيت', '`Endpoint`', 'أرسل طلب أو استقبل رد'],
            ['شارع الحارة', '`Layer 2 switch`', 'لمين أوجّه الـ frame داخل نفس الشبكة؟'],
            ['مكتب البريد', '`Router`', 'أي network أرسل لها الـ packet؟'],
            ['موظف الأمن', '`Firewall / IPS`', 'مسموح يمرّ ولا لا؟'],
            ['الاسلكي', '`Access point`', 'أي عميل يتوصّل وأي قناة؟'],
            ['مدير المكتب', '`Controller`', 'أي إعداد يتطبّق على كل الأجهزة؟'],
          ],
        },
        {
          type: 'paragraph',
          text: 'كل جهاز بيشوف جزء مختلف من البيانات: الـ switch بيشوف الـ `Layer 2` والـ MAC، والراوتر بيشوف الـ `Layer 3` والـ IP، والـ firewall ممكن يشوف حتى الـ `Layer 7` (زي عنوان URL). عشان كده مفيش جهاز "أفضل" من التاني، لكن في جهاز **مناسب للوظيفة** المطلوبة.',
        },
      ],
    },
    {
      id: 'packet',
      title: 'الشرح على مستوى الـ packet والـ frame',
      short: 'من البيانات للبتّات',
      blocks: [
        {
          type: 'paragraph',
          text: 'هنتتبع طلب بسيط: PC بعت ping لـ `198.51.100.80`. في كل طبقة بنضيف header (ودي اسمها `encapsulation`)، وفي الطرف التاني بنشيل الـ headers بالترتيب العكسي (دي `de-encapsulation`). أكتر حاجة بيفرق فيها الامتحان: **عنوان IP Source و Destination بيفضلوا ثابتين من أول الطريق لآخره** (ما لم يحصل NAT)، أمّا عناوين `MAC` بتتغيّر في كل قفزة `hop`.',
        },
        {
          type: 'diagram',
          id: 'packet-flow',
          caption: 'اضغط "شغّل" عشان تشوف الـ packet بيتمشّي من الـ PC للسيرفر ويرجع تاني.',
        },
        {
          type: 'diagram',
          id: 'encapsulation',
          caption: 'كل طبقة بضيف header على اللي فوقها؛ الرسالة نفسها بتفضل موجودة جوه.',
        },
        {
          type: 'table',
          headers: ['الطبقة', 'وحدة البيانات', 'العنوان المستخدم', 'الجهاز اللي بيقرّر'],
          rows: [
            ['Application / Transport', '`Data / Segment`', '`Port number` (TCP أو UDP)', 'Endpoint / Server / Firewall'],
            ['Network (Layer 3)', '`Packet`', '`Source IP` + `Destination IP`', '`Router` / `Layer 3 switch`'],
            ['Data Link (Layer 2)', '`Frame`', '`Source MAC` + `Destination MAC`', '`Switch` / `AP` / NIC'],
            ['Physical (Layer 1)', '`Bits`', 'Electrical / optical signals', 'Cable / port / transceiver'],
          ],
        },
        {
          type: 'paragraph',
          text: 'الراوتر لما يستلم الـ frame بيشيل الـ Ethernet header ويشوف الـ IP packet. بيقلّل `TTL` بواحدة؛ لو وصل لـ `0` بيرمي الـ packet ويرسل `ICMP Time Exceeded`. بعدين بيحتاج عنوان MAC للـ next hop، فبيستخدم `ARP` جوه الـ LAN: بيسأل "مين عنده الـ IP ده؟" والجهاز صاحبه بيردّ بـ MAC بتاعه. الراوتر بعدين بيبني frame جديد بـ source MAC بتاع منفذه هو و destination MAC بتاع الـ next hop.',
        },
        {
          type: 'diagram',
          id: 'frame-detail',
          caption: 'جوه الـ Ethernet frame تلاقي الـ IP packet، وجوه الـ IP packet تلاقي الـ TCP segment.',
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'فخ امتحاني كلاسيكي',
          text: 'لو السؤال بيقول "الـ MAC address اتغيّر بين الراوترات" فدي إجابة صح. أمّا لو بيقول "الـ destination IP اتغيّر" فدى غلط إلا لو في `NAT` في المسار. الـ TTL هو اللي بيتنقص في كل طبقة `Layer 3`، مش الـ MAC.',
        },
      ],
    },
    {
      id: 'config',
      title: 'إعداد Cisco IOS (عملي)',
      short: 'أوامر الإعداد',
      blocks: [
        {
          type: 'paragraph',
          text: 'الموضوع `1.1` مفهومي، بس الامتحان بيجيب أسئلة `simulation` بتطلب منك تفرّق بين إعداد راوتر وإعداد سوّيتش. هنا هنشوف إعداد بسيط بيوضّح دور كل جهاز. ابدأ من `enable` ثم `configure terminal`، واتذكّر إن أي منفذ لازم ياخد `no shutdown` عشان يبقى `up`.',
        },
        {
          type: 'code',
          label: 'R1 — إعداد منفذ Layer 3 وربطه بالشبكة',
          language: 'ios',
          code: `R1> enable
R1# configure terminal
R1(config)# hostname R1
R1(config)# interface GigabitEthernet0/0
R1(config-if)# description LINK-TO-SW1
R1(config-if)# ip address 192.0.2.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# exit
R1(config)# ip route 203.0.113.0 255.255.255.0 192.0.2.2
R1(config)# end
R1# copy running-config startup-config`,
        },
        {
          type: 'code',
          label: 'SW1 — إعداد منفذ Layer 2 ومنفذ إدارة',
          language: 'ios',
          code: `SW1> enable
SW1# configure terminal
SW1(config)# hostname SW1
SW1(config)# vlan 10
SW1(config-vlan)# name Users
SW1(config-vlan)# exit
SW1(config)# interface GigabitEthernet0/1
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 10
SW1(config-if)# spanning-tree portfast
SW1(config-if)# no shutdown
SW1(config-if)# exit
SW1(config)# interface Vlan10
SW1(config-if)# ip address 192.0.2.2 255.255.255.0
SW1(config-if)# no shutdown
SW1(config-if)# end
SW1# copy running-config startup-config`,
        },
        {
          type: 'code',
          label: 'SW1 — منفذ متصل بـ access point و IP phone (PoE)',
          language: 'ios',
          code: `SW1# configure terminal
SW1(config)# interface GigabitEthernet0/5
SW1(config-if)# description ACCESS-POINT
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 10
SW1(config-if)# power inline auto
SW1(config-if)# spanning-tree portfast
SW1(config-if)# end
SW1# show power inline GigabitEthernet0/5`,
        },
        {
          type: 'table',
          headers: ['الجهاز', 'الإعداد اللي بيتعمل غالباً', 'ملاحظة للامتحان'],
          rows: [
            ['`Router`', '`ip address` + `no shutdown` + routes', 'منفذه L3 وبيقلّل الـ TTL'],
            ['`Layer 2 switch`', '`vlan` + `switchport access` + `switchport mode trunk`', 'مبيقرأش IP للقرار، بيقرأ MAC'],
            ['`Layer 3 switch`', '`ip routing` + `interface Vlan` ', 'بيجمع بين switching و routing'],
            ['`NGFW / IPS`', 'Security policies و NAT غالباً من GUI/CLI خاص', 'معرفش أوامر IOS تقليدية في السيناريو'],
            ['`AP / WLC`', '`SSID`، قناة، أمان من الـ GUI', 'الـ WLC بيدير APs مركزياً'],
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'فرق مهم',
          text: 'الـ `Layer 3 switch` محتاج الأمر `ip routing` عشان يفعّل التوجيه بين الـ VLANs. من غيره هيبقى سوّيتش بس ومش هيتوجّه بين الشبكات.',
        },
      ],
    },
    {
      id: 'verify',
      title: 'أوامر التحقق (Verification)',
      short: 'أوامر show',
      blocks: [
        {
          type: 'paragraph',
          text: 'في CCNA، الإعداد نصّه مش كفاية؛ لازم تعرف تتأكد إنه شتغل صح. كل أوامر `show` بتتشغيل في `user EXEC` أو `privileged EXEC` وبتقرأ الـ running state من غير ما تغيّر حاجة. الأمرين `show running-config` و `show ip interface brief` من أكتر حاجات بتتيجي في أسئلة الـ troubleshooting.',
        },
        {
          type: 'code',
          label: 'تحقق سريع من الراوتر',
          language: 'ios',
          code: `R1# show ip interface brief
Interface        IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0 192.0.2.1     YES manual up                    up
GigabitEthernet0/1 unassigned    YES unset  administratively down down

R1# show ip route
C    192.0.2.0/24 is directly connected, GigabitEthernet0/0
S    203.0.113.0/24 [1/0] via 192.0.2.2

R1# show version
Cisco IOS Software, ...

R1# show cdp neighbors detail`,
        },
        {
          type: 'code',
          label: 'تحقق من السوّيتش و الـ MAC table و الـ PoE',
          language: 'ios',
          code: `SW1# show mac address-table
Mac Address Table
-------------------------------------------
Vlan  Mac Address       Type        Ports
----  -----------       --------    -----
  10  00d0.bbc2.1111    DYNAMIC     Gi0/1
  10  00d0.bbc2.2222    DYNAMIC     Gi0/5

SW1# show interfaces status
SW1# show vlan brief
SW1# show lldp neighbors
SW1# show power inline
SW1# show inventory`,
        },
        {
          type: 'table',
          headers: ['الأمر', 'بتتحقق منه إيه؟'],
          rows: [
            ['`show ip interface brief`', 'حالة المنافذ و IP ومين administratively down'],
            ['`show ip route`', 'جدول التوجيه والـ next hop والـ gateway of last resort'],
            ['`show mac address-table`', 'أي MAC اتعلّم في أي منفذ وأي VLAN'],
            ['`show vlan brief`', 'الـ VLANs والمنافذ التابعة لها'],
            ['`show interfaces status`', 'الـ speed والـ duplex وحالة الـ port'],
            ['`show cdp neighbors` / `show lldp neighbors`', 'الأجهزة المجاورة والمنفذ المتصل بيها'],
            ['`show power inline`', 'مين بياخد PoE وميزانية الطاقة'],
            ['`show version` / `show inventory`', 'الجهاز، الإصدار، والهاردوير'],
          ],
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'ترتيب تفكير ثابت',
          text: 'شوف الـ physical status أولاً بـ `show ip interface brief`، بعدين تحقّق من الـ Layer 2 بـ `show mac address-table`، وبعدين الـ Layer 3 بـ `show ip route`. لو مشيت بالترتيب ده هتلاقي الخطأ في دقائق بدل ما تضيع وقت في حاجات مش مرتبطة بالمشكلة.',
        },
      ],
    },
    {
      id: 'mistakes',
      title: 'أخطاء شائعة وحلّها',
      short: 'Troubleshooting',
      blocks: [
        {
          type: 'paragraph',
          text: 'أكتر أخطاء CCNA بتيجي من خلط الأدوار: تحاول تفتح منفذ سوّيتش بـ `ip address`، أو تنسى `no shutdown`، أو تظن إن الـ AP بيوجّه بين الشبكات. الجدول ده بيلخّص الأخطاء اللي بتظهر في الامتحان وفي اللاب.',
        },
        {
          type: 'table',
          headers: ['العرَض', 'السبب المحتمل', 'الحل'],
          rows: [
            ['المنفذ `administratively down`', 'نسيت `no shutdown`', 'ادخل على الـ interface واكتب `no shutdown`'],
            ['PC مش بيوصل لأي حاجة', 'مفيش `default gateway` أو الـ IP غلط', 'راجع `ipconfig` وأكد إن الـ gateway هو راوتر الـ VLAN'],
            ['الـ ping شغال داخل الـ VLAN بس مش خارجه', 'مفيش routing بين الـ VLANs', 'استخدم راوتر أو `ip routing` على L3 switch'],
            ['الـ switch مش بيشوف أي MAC', 'كابل مقطوع أو الـ port في VLAN تانية', 'بدّل الكابل وافحص `show vlan brief`'],
            ['الـ duplex mismatch و errors كتير', 'طرف بـ `auto` والتاني بـ `full` ثابت', 'وحّد الـ speed والـ duplex على الطرفين'],
            ['الـ IP phone مش شغال', 'المنفذ مش PoE أو مفيش طاقة كافية', 'افحص `show power inline` واستخدم منفذ PoE'],
            ['الـ Wi-Fi ظاهر بس مفيش إنترنت', 'الـ AP متصل بمنفذ غلط أو الـ trunk مفعّل غلط', 'راجع الـ access/trunk على منفذ الـ AP'],
          ],
        },
        {
          type: 'steps',
          items: [
            {
              title: '1 — تأكد من الطبقة 1',
              text: 'كابل موصول؟ الـ LED شغال؟ حالة المنفذ `up/up` في `show ip interface brief`؟ لو `down/down` ابحث في الكابل أو الـ transceiver.',
            },
            {
              title: '2 — تأكد من الطبقة 2',
              text: 'المنفذ في الـ VLAN الصح؟ الـ MAC اتعلّم في `show mac address-table`؟ لو الـ port في `err-disable` شوف الـ log.',
            },
            {
              title: '3 — تأكد من الطبقة 3',
              text: 'الـ IP والماسك صح؟ الـ default gateway موجود؟ الراوتر عنده route للشبكة البعيدة في `show ip route`؟',
            },
            {
              title: '4 — جرّب خطوة بخطوة',
              text: 'اعمل ping للـ `127.0.0.1` وبعدين للـ gateway وبعدين لعنوان بعيد. أول حاجة تفشل بتقولك فين المشكلة بالظبط.',
            },
          ],
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'غلط بيعيد نفسه',
          text: 'ما تخلطش بين `show ip interface brief` و `show interfaces`. الأمر الأول بيعطيك ملخّص سريع، والتاني بيعطيك تفاصيل زي الـ errors والـ duplex. في الامتحان اقرأ السؤال: لو عايز "حالة المنفذ بسرعة" فالأمر الأول هو المطلوب.',
        },
      ],
    },
    {
      id: 'lab',
      title: 'لاب عملي بـ Packet Tracer',
      short: 'Hands-on Lab',
      blocks: [
        {
          type: 'paragraph',
          text: 'الهدف: تبني شبكة صغيرة فيها PC و السوّيتش والراوتر وسيرفر، وتثبت إن كل مكوّن بيقوم بدوره. استخدم `Packet Tracer` وضع `Routers, Switches, Endpoints`. لو مفيش Packet Tracer، نفس الخطوات تنطبق على Cisco Modeling Labs أو أي محاكي IOS.',
        },
        {
          type: 'diagram',
          id: 'lab-topology',
          caption: 'التوبولوجيا المطلوبة: PC → SW1 → R1 → Server (منطقة WAN).',
        },
        {
          type: 'table',
          headers: ['الجهاز', 'الواجهة', 'IP / Mask', 'الدور'],
          rows: [
            ['PC0', 'NIC', '`192.0.2.10 /24`, GW `192.0.2.1`', '`Endpoint`'],
            ['SW1', '`Vlan10` (SVI)', '`192.0.2.2 /24`', '`Layer 2 switch`'],
            ['R1', '`G0/0`', '`192.0.2.1 /24`', '`Router` / default gateway'],
            ['R1', '`G0/1`', '`198.51.100.1 /24`', 'WAN link'],
            ['Server0', 'NIC', '`198.51.100.80 /24`, GW `198.51.100.1`', '`Server`'],
          ],
        },
        {
          type: 'code',
          label: 'الخطوة 1 — إعداد R1',
          language: 'ios',
          code: `enable
configure terminal
hostname R1
interface g0/0
 ip address 192.0.2.1 255.255.255.0
 no shutdown
 exit
interface g0/1
 ip address 198.51.100.1 255.255.255.0
 no shutdown
 end
show ip interface brief`,
        },
        {
          type: 'code',
          label: 'الخطوة 2 — إعداد SW1',
          language: 'ios',
          code: `enable
configure terminal
hostname SW1
vlan 10
 name Users
 exit
interface range g0/1-2
 switchport mode access
 switchport access vlan 10
 spanning-tree portfast
 no shutdown
 end
show vlan brief
show mac address-table`,
        },
        {
          type: 'steps',
          items: [
            {
              title: 'الخطوة 3 — إعداد الـ PC والسيرفر',
              text: 'من `Desktop → IP Configuration` اكتب الـ IP والماسك والـ default gateway كما في الجدول. الراوتر هو اللي هيبقى الـ gateway مش السوّيتش.',
            },
            {
              title: 'الخطوة 4 — تحقّق من الـ Layer 2',
              text: 'بعد أول ping من PC0، اكتب على SW1: `show mac address-table` مفروض تشوف MAC بتاع PC0 في الـ port المتصل بيه.',
            },
            {
              title: 'الخطوة 5 — تحقّق من الـ Layer 3',
              text: 'من PC0 اعمل `ping 198.51.100.80`. لو نجح، اكتب على R1: `show ip route` هتلاقي شبكتين `C` مباشرتين. جرّب كمان `tracert` من الـ PC عشان تشوف الـ hop.',
            },
            {
              title: 'تحدّي إضافي',
              text: 'اعمل `shutdown` على `G0/1` في R1 وجرّب الـ ping تاني. شوف إزاي حالة الـ interface بتتغيّر في `show ip interface brief`، وبعدين رجّعها بـ `no shutdown`.',
            },
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'ملاحظة عملية',
          text: 'الـ switches في Packet Tracer بياخدوا أحياناً ثواني عشان يتعلّموا الـ MAC. استنى شوية أو اعمل ping تاني قبل ما تظن إن فيه مشكلة.',
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
          text: 'جرّب تجاوب بنفسك قبل ما تضغط على إجابة. كل سؤال فيه شرح للإجابة الصح وليه الباقي غلط — اقرأ الشرح حتى لو إجابتك كانت صح.',
        },
        {
          type: 'quiz',
          questions: [
            {
              id: 'q1',
              prompt: 'جهاز بيستقبل frame على منفذ وبيدور على عنوان الـ destination MAC في جدول خاص عشان يقرر من أي منفذ يطلّعه. إيه الجهاز ده؟',
              options: ['Router', 'Layer 2 switch', 'Next-generation firewall', 'Access point'],
              correctIndex: 1,
              explanation:
                'الـ Layer 2 switch بيتخذ قراره بناءً على الـ MAC address table. الراوتر بيتخذ قراره بناءً على الـ IP packet، والـ firewall بيطبّق security policies، والـ AP بيربط العملاء اللاسلكيين بالشبكة السلكية.',
            },
            {
              id: 'q2',
              prompt: 'أي مكوّن بيقلّل قيمة الـ TTL في الـ IP packet وبيختار الـ next hop من جدول التوجيه؟',
              options: ['Layer 2 switch', 'Hub', 'Router', 'Endpoint NIC'],
              correctIndex: 2,
              explanation:
                'الراوتر بيشيل الـ Layer 2 frame، بيقلّل TTL بواحدة، وبيقرأ جدول التوجيه عشان يحدد الـ next hop. السوّيتش والـ hub ما بيعدّلوش الـ TTL لأنهم مش أجهزة Layer 3.',
            },
            {
              id: 'q3',
              prompt: 'في شركة عندها IP phones متوصّلة بسوّيتش، ومفيش مصادر كهرباء قريبة من التليفونات. إيه المكوّن اللي بيحل المشكلة دي حسب الـ blueprint؟',
              options: ['Hub', 'PoE', 'IPS', 'VRF'],
              correctIndex: 1,
              explanation:
                'PoE (Power over Ethernet) بيسمح للسوّيتش يغذّي الـ IP phone أو الـ AP بالكهرباء من نفس كابل الـ Ethernet. تحقّق منه بـ `show power inline`.',
            },
            {
              id: 'q4',
              prompt: 'إيه المكوّن المسؤول عن إدارة وإعداد نقاط الوصول (APs) من مكان مركزي؟',
              options: ['WLC / Controller', 'Layer 2 switch', 'IPS', 'Server'],
              correctIndex: 0,
              explanation:
                'الـ Wireless LAN Controller (WLC) بيدير الـ APs مركزياً: SSID، قنوات، أمان، و firmware. الـ Cisco DNA Center كمان بيعمل إدارة مركزية أوسع للشبكة.',
            },
            {
              id: 'q5',
              prompt: 'على R1، أمر `show ip interface brief` بيظهر: GigabitEthernet0/0 | 192.0.2.1 | administratively down | down. إيه أول حاجة لازم تعملها؟',
              options: [
                'اكتب `no shutdown` على GigabitEthernet0/0',
                'غيّر الـ IP address',
                'امسح الـ ARP cache',
                'اعمل `copy running-config startup-config`',
              ],
              correctIndex: 0,
              explanation:
                'كلمة `administratively down` معناها إن المنفذ متوقف إدارياً ومحتاج `no shutdown`. ما فيش داعي تغيّر الـ IP لأنه ظاهر ومصحّح في الإخراج.',
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
          type: 'list',
          items: [
            'الشبكة = أجهزة ليه أدوار واضحة: **endpoint** بيطلب، **switch** بيوجّه داخل الـ LAN، **router** بيوجّه بين الشبكات.',
            'الـ `Layer 2 switch` بيستخدم الـ `MAC address`؛ الـ `router` بيستخدم الـ `IP address`؛ الـ `firewall/IPS` بيفحص الترافيك حسب السياسات.',
            'الـ `AP` بيوصل العملاء اللاسلكيين، والـ `WLC` بيديرهم مركزياً، و`Cisco DNA Center` بيدير الشبكة كلها.',
            'الـ `PoE` بيغذّي الـ APs والـ IP phones من كابل الشبكة.',
            'في الـ encapsulation: `Data → Segment → Packet → Frame → Bits`، وفي الـ de-encapsulation العكس.',
            'Source/Destination IP بيفضلوا ثابتين؛ الـ MAC بيتغيّر كل `hop`؛ الـ TTL بيتنقص كل `hop`.',
            'الـ ARP بيترجم الـ IP للـ MAC على نفس الـ LAN قبل ما الراوتر يبني frame جديد.',
            'أوامر التحقق الذهبية: `show ip interface brief`، `show mac address-table`، `show ip route`، `show power inline`.',
          ],
        },
        {
          type: 'table',
          headers: ['المكوّن', 'الطبقة', 'السؤال اللي بيجيب عليه'],
          rows: [
            ['`Switch`', 'Layer 2', 'أي منفذ؟ (MAC)'],
            ['`Router / L3 Switch`', 'Layer 3', 'أي شبكة؟ (IP)'],
            ['`Firewall / IPS`', 'Layer 3–7', 'مسموح يمرّ؟'],
            ['`AP / WLC`', 'Layer 1–2', 'مين يتوصّل بالـ Wi-Fi؟'],
            ['`Controller`', 'Management', 'إزاي أدير كل الأجهزة من مكان واحد؟'],
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'قبل ما تروح للموضوع 1.2',
          text: 'اسأل نفسك: لو عندك 200 جهاز، هتوصّلهم إزاي؟ الإجابة عن طريق الـ topology architectures اللي هنتكلم عنها في الموضوع اللي جاي: two-tier، three-tier، و spine-leaf.',
        },
      ],
    },
  ],
}
