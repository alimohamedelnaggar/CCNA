import type { Lesson } from '../types'

export const topic12Lesson: Lesson = {
  topicId: '1.2',
  title: 'معماريات طوبولوجيا الشبكة',
  description:
    'في الدرس ده هتفهم إزاي الشبكات تتصمّم: two-tier و three-tier و spine-leaf و WAN و SOHO و on-premises مقابل cloud. هشوف شكل كل معمارية، وإزاي الـ packet بيتحرك فيها، وإعداد Cisco IOS داخل تصميم two-tier، لاب Packet Tracer، وأسئلة امتحان.',
  estimatedTime: '~55 دقيقة',
  steps: [
    {
      id: 'what',
      title: 'إيه اللي إحنا بندرسه وليه وجوده مهم؟',
      short: 'مفهوم الدرس',
      blocks: [
        {
          type: 'paragraph',
          text: 'لو عرفت أدوار الأجهزة من الموضوع 1.1، السؤال الطبيعي دلوقتي: **وين نحطهم وإزاي نربطهم؟** الإجابة دي اسمها `network topology architecture`: طريقة منظّمة لتوزيع الأجهزة والطبقات والروابط عشان الشبكة تخدم حجمها ومتطلباتها.',
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'مكان الدرس في الـ blueprint',
          text: 'الموضوع ده هو Objective `1.2` في دومين `Network Fundamentals`. الأهداف الرسمية: `1.2.a Two-tier`، `1.2.b Three-tier`، `1.2.c Spine-leaf`، `1.2.d WAN`، `1.2.e SOHO`، و `1.2.f On-premises and cloud`. الامتحان بيجيب على شكل "عرّف المعمارية" و"حدّد المعمارية من وصف أو رسم".',
        },
        {
          type: 'table',
          headers: ['المصطلح', 'السؤال اللي بيجيب عليه', 'مثال'],
          rows: [
            ['`Network Architecture`', 'إزاي الشبكة متصمّمة من حيث الطبقات، الأدوار، والسياسات؟', 'Access / Distribution / Core'],
            ['`Network Topology`', 'الأجهزة والأسلاك والروابط مرتّبة إزاي؟', 'Star, mesh, spine-leaf'],
            ['`Physical Topology`', 'فين الكابلات والمنافذ والأجهزة فعلياً؟', 'سوّيتش في الـ rack متصل بـ PC'],
            ['`Logical Topology`', 'إزاي الترافيك بيفضل رغم شكل الأسلاك؟', 'VLAN 10 و VLAN 20 فوق نفس الـ trunk'],
          ],
        },
        {
          type: 'paragraph',
          text: 'فرق مهم: في الـ **physical topology** تشوف كابل من الـ PC للسوّيتش. في الـ **logical topology** تشوف الـ PC داخل `VLAN 10` والسيرفر داخل `VLAN 20`، ومحتاج `routing` عشان يتكلّموا — حتى لو كلهم فوق نفس السوّيتش.',
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'تشبيه من الحياة الواقعية',
          text: 'تخيّل مدينة: البيوت هي الأجهزة، شوارع الحارة هي الـ `access layer`، مكتب البريد الرئيسي هو الـ `distribution / core`، والطريق بين المحافظات هو الـ `WAN`. لو المدينة صغيرة، مكتب واحد يكفي ( collapsed core ). لو كبرت، محتاج مكاتب توزيع وطريق سريع مستقل ( three-tier ). لو كل البيوت مصنع بيبعت لبعضه طول اليوم، هتحتاج شبكة طرق متوازية ( spine-leaf ).',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '`Scalability`: أقدر أضيف مستخدمين أو فروع أو سيرفرات من غير ما التصميم ينهار.',
            '`Redundancy`: فيه مسار أو جهاز بديل لو حصل فشل.',
            '`Performance`: الـ traffic ياخد أقصر وأسرع طريق متاح.',
            '`Fault Tolerance`: الشبكة تفضل شغالة ولو جزء منها اتوقف.',
            '`Cost`: موازنة بين سعر الأجهزة والكابلات وتكلفة التوقف.',
            '`Network Management`: أقدر أفهم وأراقب وأصلّح الشبكة بسهولة.',
          ],
        },
        {
          type: 'table',
          headers: ['', 'Small office / home', 'Large enterprise'],
          rows: [
            ['عدد الأجهزة', 'قلّل (5–30 جهاز)', 'مئات أو آلاف الأجهزة'],
            ['الأجهزة', 'راوتر/سوّيتش واحد غالباً', 'access + distribution + core + firewall + WAN'],
            ['الطبقات', 'طبقة واحدة أو اثنتين', 'three-tier أو spine-leaf في الـ data center'],
            ['الإدارة', 'إعداد بسيط من الـ GUI', 'سياسات مركزية، VLANs، routing، monitoring'],
            ['المخاطرة', 'جهاز واحد فاشل = انقطاع كل شيء', 'تصميم فيه redundancy ومسارات بديلة'],
          ],
        },
        {
          type: 'paragraph',
          text: 'المعماريات اللي هنتكلم عنها ست معماريات: **`Two-Tier`** و **`Three-Tier`** و **`Spine-Leaf`** و **`WAN`** و **`SOHO`** و **`On-Premises vs Cloud`**. كل واحدة بتحل مشكلة مختلفة، ومفيش واحدة "أفضل" في كل الحالات.',
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'فخ امتحاني مبكر',
          text: 'الامتحان مش بيطلب "احفظ شكل الكابلات" بس؛ بيطلب تعرف **وظيفة الطبقة** و**مين بيعمل routing** و**فين يتحط الـ redundancy**. الاسم لوحده مش كفاية.',
        },
      ],
    },
    {
      id: 'how',
      title: 'إزاي بيشتغلوا + الست معماريات بالتفصيل',
      short: 'الآلية والتشبيه',
      blocks: [
        {
          type: 'paragraph',
          text: 'هندرس كل معمارية كـ "طبقات + روابط + قرار". اضغط `شغّل` أو `الخطوة التالية` في كل رسم عشان تشوف الـ packet بيتحرك والطبقة المسؤولة مضيئة.',
        },

        { type: 'diagram', id: 'topology-two-tier', caption: 'Two-tier: الـ Access بيوصل الأجهزة، والـ Collapsed Core بيجمع Distribution و Core في طبقة واحدة.' },
        {
          type: 'table',
          headers: ['الطبقة', 'الوظيفة', 'فين بيحصل routing؟'],
          rows: [
            ['`Access Layer`', 'منافذ للأجهزة، VLAN assignment، حماية منفذ الدخول', 'لا — غالباً Layer 2'],
            ['`Distribution + Core` (Collapsed Core)', 'routing بين VLANs، سياسات، uplink عالي السرعة، redundancy', 'نعم — على الـ L3 switch / SVIs'],
          ],
        },
        {
          type: 'list',
          items: [
            '**Collapsed Core** يعني إن وظائف `Distribution` و `Core` اتدمجت في طبقة منطقية أو جهاز واحد.',
            'الترافيك: PC → `SW-Access` → `SW-Core` → السيرفر أو العكس.',
            'الميزات: أبسط، أرخص، أسهل إدارة، كافي للشركات الصغيرة والمتوسطة.',
            'العيوب: لو الكور اتوقف وملوش نسخة احتياطية، كل شيء يتوقف؛ توسّعه محدود مقارنة بـ three-tier.',
            'الاستخدام: مكتب متوسط، مدرسة، فرع شركة، شبكة فيها 100–500 مستخدم تقريباً.',
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'الجملة اللي لازم تتذكرها',
          text: '`Two-Tier = Collapsed Core`. لو السؤال قال "طبقتين بس" فالمقصود إن الـ Core والـ Distribution متجمعين مش إن الـ Access مش موجود.',
        },

        { type: 'diagram', id: 'topology-three-tier', caption: 'Three-tier: Access → Distribution → Core. كل طبقة ليها دور منفصل.' },
        {
          type: 'table',
          headers: ['الطبقة', 'بيعمل إيه بالظبط؟', 'نقطة امتحانية'],
          rows: [
            [
              '`Access Layer`',
              'يوصّل end devices، يوفّر switch ports، يطبّق VLAN assignment، نقطة دخول الشبكة',
              'بيشتغل غالباً Layer 2 — بيقرأ MAC',
            ],
            [
              '`Distribution Layer`',
              'يجمع access switches، يعمل Layer 3 routing، يطبّق policies و ACLs، بيعمل L2/L3 boundary، يوفّر redundancy',
              'هنا غالباً الـ default gateway بتاع الـ VLANs',
            ],
            [
              '`Core Layer`',
              'backbone سريع يربط distribution blocks، تركيزه high-speed و reliable transport',
              'لازم يبقى بسيط — من غير فحص policies معقّدة',
            ],
          ],
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'PC بعت frame للـ `Access`.',
            'الـ Access وجّه جوه الـ VLAN للـ `Distribution`.',
            'الـ Distribution عمل routing وقرر الشبكة أو الـ VLAN المقصود.',
            'الـ Core مرّر الـ packet بسرعة للـ distribution block التاني.',
            'السيرفر استلم، والرد رجع بنفس الترتيب العكسي.',
          ],
        },
        {
          type: 'table',
          headers: ['الميزة', 'العيب'],
          rows: [
            ['قابلة للتوسّع جداً', 'أغلى وأكتر أجهزة وكابلات'],
            ['clear fault isolation بين الطبقات', 'تصميم وإدارة أعقد'],
            ['redundancy أسهل على مستوى كل طبقة', 'زيادة الـ hops لو التصميم مش مضبوط'],
            ['مناسبة للـ large enterprise', 'مش محتاجها لمكتب صغير'],
          ],
        },

        { type: 'diagram', id: 'topology-spine-leaf', caption: 'Spine-leaf: كل leaf متصل بكل spine — مسارات متساوية وECMP.' },
        {
          type: 'table',
          headers: ['العنصر', 'الوظيفة'],
          rows: [
            ['`Leaf switches`', 'بيتصلوا بالسيرفرات والأجهزة (servers / endpoints). كل سيرفر يدخل leaf.'],
            ['`Spine switches`', 'بيكونوا الـ backbone بين الـ leaves؛ بينقلوا الترافيك عبر الـ fabric.'],
            ['`East-West traffic`', 'ترافيك من سيرفر لسيرفر جوه نفس الـ data center — ده الغالب في التصميم الحديث.'],
            ['`North-South traffic`', 'ترافيك بين الـ data center والعالم الخارجي أو المستخدمين.'],
            ['`ECMP`', 'Equal-Cost Multi-Path: عدة مسارات بنفس الـ cost، فالـ switch يوزّع الترافيك عليهم بدل ما يستخدم واحد.'],
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'قواعد الـ fabric',
          text: '**كل Leaf بيتصل بكل Spine.** الـ Leafs مبيتصلوش ببعضهم مباشرة، والـ Spines مبيتصلوش ببعضهم مباشرة في الـ standard two-tier spine-leaf fabric. لو شفت رسم فيه leaf-to-leaf، غالباً تصميم تاني مش الـ CCNA spine-leaf.',
        },
        {
          type: 'list',
          items: [
            '**التشبيه:** الـ leaves زي محطات المترو، والـ spines زي الخطوط الرئيسية. أي محطة توصل لأي خط، فمهما زادت المحطات المسافة بين طرفين تفضل قصيرة ومتوقعة.',
            '**Scalability:** عشان تزوّد السعة، تضيف spine جديد أو leaf جديد والروابط تتوزّع تلقائياً.',
            '**Predictable latency:** من أي leaf لأي leaf تمرّ بـ spine واحد فقط في الـ hop model، فالتأخير متوقّع.',
            '**لماذا data centers؟** لأن حركة Server-to-Server كبيرة ومحتاجة مسارات متعددة ومن غير عنق زجاجة في طبقة distribution تقليدية.',
          ],
        },

        { type: 'diagram', id: 'topology-wan', caption: 'WAN: مقر القاهرة وفرع الإسكندرية وفرع أسوان على شبكة provider واحدة.' },
        {
          type: 'list',
          items: [
            '**WAN = Wide Area Network**: شبكة بتوصّل LANs متباعدة جغرافياً (مدن، دول، قارات).',
            '**LAN مقابل WAN**: الـ LAN داخل مبنى أو موقع واحد وغالباً إنت بتدير الهاردوير؛ الـ WAN بين مواقع وغالباً عبر `service provider`.',
            '**ليه موجود؟** عشان المقر والفروع يشاركوا ملفات وتطبيقات وإنترنت ومكالمات بغض النظر عن المسافة.',
            '**Private WAN**: `MPLS`، `leased lines`، أو روابط خاصة من الـ carrier — موثوقية و SLA أعلى غالباً وتكلفة أعلى.',
            '**VPN over Internet**: `IPsec VPN` مشفّرة فوق إنترنت عام — أرخص لكن جودة الـ link بتاع الإنترنت مش مضمونة زي الـ private line.',
            '**SD-WAN**: طبقة إدارة حديثة بتختار المسار الأنسب بين MPLS وإنترنت و 4G/5G حسب السياسة والتكلفة والجودة — مقدمة بسيطة هنا.',
            '**WAN مش نفسه الإنترنت**: الإنترنت شبكة عامة؛ الـ WAN مفهوم أوسع يشمل الإنترنت والروابط الخاصة معاً.',
            '**مثال مصري**: القاهرة مقر رئيسي، الإسكندرية فرع مبيعات، أسوان فرع خدمات. الثلاثة متصلين بـ WAN، مع backup VPN لو الرابط الأساسي اتقطع.',
          ],
        },

        { type: 'diagram', id: 'topology-soho', caption: 'SOHO: جهاز واحد بيجمع router + switch + AP + firewall + NAT + DHCP.' },
        {
          type: 'table',
          headers: ['المكوّن', 'الوظيفة في الـ SOHO'],
          rows: [
            ['`ISP connection`', 'بيوصّل البيت أو المكتب الصغير بالإنترنت (DSL / fiber / cable).'],
            ['`Wireless Router`', ' بوابة default gateway، يعمل `NAT` و`DHCP` و`firewall` وغالباً switching و AP في جهاز واحد.'],
            ['`Switch ports`', 'منافذ Ethernet للتليفزيون أو الطابعة أو الكمبيوتر.'],
            ['`Access Point`', 'بيبثّ SSID ويوصل اللابتوب والتليفون لاسلكياً.'],
            ['`NAT`', 'بيترجم عناوين خاصة جوه البيت لـ public IP واحد بياخده من الـ ISP.'],
            ['`DHCP`', 'بيوزّع IP address و mask و gateway و DNS على الأجهزة تلقائياً.'],
          ],
        },
        {
          type: 'list',
          items: [
            '**مثال البيت**: إنترنت من الـ ISP → wireless router → laptop، smartphone، smart TV، network printer.',
            '**الميزات**: رخيص، سريع التركيب، إعداد بسيط من الـ browser أو التطبيق، كافي لعدة أجهزة.',
            '**الحدود**: جهاز واحد هو نقطة فشل واحدة، الأداء محدود مع كثرة المستخدمين، مرونة الـ routing والسياسات محدودة مقارنة بـ enterprise.',
          ],
        },

        { type: 'diagram', id: 'topology-cloud', caption: 'On-premises مقابل Cloud، والـ hybrid بيربطهم بـ VPN أو dedicated link.' },
        {
          type: 'table',
          headers: ['وجة المقارنة', 'On-Premises', 'Cloud'],
          rows: [
            ['Infrastructure ownership', 'الشركة تشتري وتدير الهاردوير', 'الـ provider يملك الهاردوير'],
            ['Initial cost', 'CapEx عالي (شراء وتجهيز data center)', 'OpEx أقل في البداية — pay-as-you-go'],
            ['Maintenance', 'الشركة مسؤولة عن الصيانة والاستبدال', 'الـ provider مسؤول عن الهاردوير والـ facility'],
            ['Scalability', 'محتاج شراء وتركيب', 'سريعة — تزيد VMs أو storage بالضغطة'],
            ['Control', 'تحكم كامل في كل طبقة', 'تحكم حسب نموذج الخدمة'],
            ['Physical security', 'مسؤولية الشركة', 'مسؤولية الـ provider للـ facility'],
            ['Deployment speed', 'أبطأ', 'أسرع غالباً'],
          ],
        },
        {
          type: 'list',
          items: [
            '**On-Premises**: physical servers + storage + networking equipment جوه data center بتاع الشركة. إنت بتشتري الهاردوير وبتديره.',
            '**Cloud**: `Cloud Service Provider` زي AWS / Azure / Google Cloud يوفّر `virtual machines` و `virtual networks` و `cloud storage` عبر الإنترنت.',
            '**IaaS**: مستأجر VMs و storage وشبكة افتراضية — إنت تدير الـ OS والتطبيقات.',
            '**PaaS**: مستأجر منصة لتشغيل الكود — الـ provider يدير الـ runtime والـ OS غالباً.',
            '**SaaS**: تطبيق جاهز زي البريد أو الـ office suite — إنت بتستخدمه بس.',
            '**Hybrid Cloud**: جزء على الـ on-prem وجزء في الـ cloud وbetweenهم `VPN` أو رابط مخصص — مثال: قاعدة بيانات محلية ونسخة backup في الـ cloud.',
          ],
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'الأمان مش حكم تلقائي',
          text: 'ما تقولش "الـ cloud أأمن" أو "الـ on-prem أقل أمان" كقاعدة. الأمان بيعتمد على **shared responsibility**: الـ provider مسؤول عن طبقات معيّنة، وإنت مسؤول عن بياناتك وإعداداتك والوصول. المسؤولية بتختلف بين `IaaS` و `PaaS` و `SaaS`.',
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
          text: 'الـ architecture بيغيّر **المسار**، بس قواعد الـ packet ثابتة: الـ `switch` يقرأ الـ `destination MAC` ويفضل داخل نفس الـ `Layer 2` domain، والـ `router` أو `Layer 3 switch` يقرأ الـ `destination IP` ويقلّل الـ `TTL` ويختار الـ next hop.',
        },
        {
          type: 'diagram',
          id: 'topology-journey',
          caption: 'اضغط الخطوة التالية عشان تشوف مسار الـ packet في كل معمارية من الست معماريين.',
        },
        {
          type: 'table',
          headers: ['المعمارية', 'مسار الـ traffic المعتاد', 'مين بيعمل القرار؟'],
          rows: [
            ['`Two-Tier`', 'PC → Access → Collapsed Core → Destination', 'الـ L3 switch في الـ collapsed core'],
            ['`Three-Tier`', 'PC → Access → Distribution → Core → Destination', 'Distribution للـ routing والسياسات، Core للنقل السريع'],
            ['`Spine-Leaf`', 'Server A → Leaf 1 → Spine → Leaf 2 → Server B', 'الـ fabric يختار spine من المسارات المتساوية بـ ECMP'],
            ['`WAN`', 'Cairo Office → WAN Connection → Alexandria Office', 'الـ provider network والـ routing بين المواقع'],
            ['`SOHO`', 'Laptop → Wireless Router → ISP → Internet Server', 'الراوتر بـ NAT/default gateway ثم ISP'],
            ['`Cloud`', 'On-Prem / Users → VPN → Cloud virtual network → VM', 'virtual routing في الـ cloud + سياسات الـ provider'],
          ],
        },
        {
          type: 'steps',
          items: [
            {
              title: '1 — داخل نفس الـ VLAN (Layer 2)',
              text: 'الـ PC بيبني Ethernet frame بـ destination MAC بتاع السيرفر لو في نفس الشبكة. السوّيتش يدور على الـ MAC في `MAC address table` ويطلّعه من المنفذ الصح. مفيش TTL هنا لأن مفيش router.',
            },
            {
              title: '2 — بين VLANs (Layer 3)',
              text: 'لو الـ destination IP في شبكة تانية، الـ PC يبعت الـ frame لـ `default gateway` (SVI أو راوتر). الجهاز يشيل الـ Ethernet header، يقلّل `TTL`، يقرر next hop، ويبني frame جديد بـ MAC جديد لكل hop.',
            },
            {
              title: '3 — في الـ spine-leaf',
              text: 'الـ Leaf 1 يختار أحد الـ spines. لو فيه 3 spines بنفس الـ cost، الـ `ECMP` يوزّع الـ flows عليهم. كل flow يفضل مساره عشان مفيش reordering، والمسار التاني يبقى جاهز لو spine فشل.',
            },
            {
              title: '4 — في الـ WAN والـ SOHO',
              text: 'في الـ WAN الـ packet بيعدّي شبكة الـ provider؛ في الـ SOHO الراوتر بيحوّل الـ private IP لـ public بـ `NAT` قبل ما يوصل للـ ISP. الـ ISP بعدين يوجّهه للإنترنت.',
            },
            {
              title: '5 — الرد بيرجع',
              text: 'الرد بيرجع في الاتجاه العكسي حسب جداول الـ routing و NAT state. في methods الـ ECMP الرد ممكن ياخد spine مختلف لو الـ flow تابع different، والاتصال يفضل شغال.',
            },
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'ما تعمموش',
          text: 'مش كل packet لازم يعدّي على **كل** طبقة في كل معمارية. الترافيك داخل نفس الـ VLAN ممكن ما يوصلش للـ Core أصلاً. السلوك النهائي بيعتمد على الـ `VLANs` والـ `routing` والـ `destination` وإعدادات الـ policy.',
        },
      ],
    },
    {
      id: 'config',
      title: 'إعداد Cisco IOS (داخل تصميم Two-Tier)',
      short: 'أوامر الإعداد',
      blocks: [
        {
          type: 'paragraph',
          text: 'المعمارية نفسها **design concept** ومفيش أمر واحد اسمه "configure two-tier". اللي نعمله هنا إننا نطبّق إعداد حقيقي **جوه** تصميم two-tier collapsed core: VLANs على سوّيتشين، trunk بينهم، و SVIs على الـ L3 switch عشان يعمل inter-VLAN routing.',
        },
        {
          type: 'table',
          headers: ['الجهاز', 'الدور', 'الوصلات'],
          rows: [
            ['`SW-Core`', 'Collapsed Core / Distribution + L3', 'G0/1 → SW-Access'],
            ['`SW-Access`', 'Access Layer / L2', 'G0/24 → SW-Core، G0/1-2 PCs VLAN 10، G0/3-4 PCs VLAN 20'],
            ['`PC1`', 'Sales endpoint', '192.168.10.10/24, GW 192.168.10.1'],
            ['`PC2`', 'IT endpoint', '192.168.20.10/24, GW 192.168.20.1'],
          ],
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'عنوان الـ IP',
          text: '`VLAN 10 = 192.168.10.0/24` والـ gateway بتاعها `192.168.10.1`. `VLAN 20 = 192.168.20.0/24` والـ gateway بتاعها `192.168.20.1`. الـ gateways هما الـ SVIs على SW-Core.',
        },
        {
          type: 'code',
          label: 'SW-Core — Collapsed Core مع inter-VLAN routing',
          language: 'ios',
          code: `enable
configure terminal
hostname SW-Core
ip routing
!
vlan 10
 name Sales
 exit
vlan 20
 name IT
 exit
!
interface GigabitEthernet0/1
 description UPLINK-TO-SW-ACCESS
 switchport trunk encapsulation dot1q
 switchport mode trunk
 switchport trunk allowed vlan 10,20
 no shutdown
 exit
!
interface Vlan10
 description GATEWAY-SALES
 ip address 192.168.10.1 255.255.255.0
 no shutdown
 exit
!
interface Vlan20
 description GATEWAY-IT
 ip address 192.168.20.1 255.255.255.0
 no shutdown
 exit
end
copy running-config startup-config`,
        },
        {
          type: 'code',
          label: 'SW-Access — منافذ access و trunk',
          language: 'ios',
          code: `enable
configure terminal
hostname SW-Access
!
vlan 10
 name Sales
 exit
vlan 20
 name IT
 exit
!
interface range GigabitEthernet0/1 - 2
 description SALES-PCS
 switchport mode access
 switchport access vlan 10
 spanning-tree portfast
 no shutdown
 exit
!
interface range GigabitEthernet0/3 - 4
 description IT-PCS
 switchport mode access
 switchport access vlan 20
 spanning-tree portfast
 no shutdown
 exit
!
interface GigabitEthernet0/24
 description UPLINK-TO-SW-CORE
 switchport trunk encapsulation dot1q
 switchport mode trunk
 switchport trunk allowed vlan 10,20
 no shutdown
 exit
end
copy running-config startup-config`,
        },
        {
          type: 'table',
          headers: ['الأمر', 'ليه كتبناه؟'],
          rows: [
            ['`vlan 10` / `vlan 20`', 'بيعملوا الـ Layer 2 domains المنفصلة على السوّيتشين.'],
            ['`switchport mode access` + `switchport access vlan`', 'بيخلى منفذ الـ PC تابع لـ VLAN واحد فقط.'],
            ['`spanning-tree portfast`', 'بيسرّع انتقال منفذ الـ endpoint من listening/learning لـ forwarding.'],
            ['`switchport mode trunk`', 'بيسمح بمرور أكتر من VLAN على نفس الرابط بين السوّيتشين.'],
            ['`switchport trunk allowed vlan 10,20`', 'بيقلّل الـ unnecessary traffic ويمنع VLANs مش محتاجة من العبور.'],
            ['`ip routing`', ' بيفعّل التوجيه على الـ multilayer switch — من غيره مفيش inter-VLAN routing.'],
            ['`interface Vlan10` / `Vlan20`', 'بيعملوا الـ SVIs اللي هما الـ default gateway لكل VLAN.'],
            ['`no shutdown`', 'بيفتح المنفذ أو الـ SVI إدارياً.'],
            ['`copy running-config startup-config`', 'بيحفظ الإعداد بعد الـ reload.'],
          ],
        },
        {
          type: 'code',
          label: 'تحقق سريع بعد الإعداد',
          language: 'ios',
          code: `SW-Core# show vlan brief
SW-Core# show interfaces trunk
SW-Core# show ip interface brief
SW-Core# show ip route
SW-Access# show interfaces status
SW-Access# show vlan brief`,
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'ملاحظة منصّة',
          text: 'الأمر `switchport trunk encapsulation dot1q` موجود على منصّات IOS اللي بتدعم negotiation بين ISL و 802.1Q (زي بعض 3560/3750). منصّات حديثة كتير بتدعم `dot1q` بس ومش بتقبل الأمر ده — في الحالة دي ابدأ بـ `switchport mode trunk` مباشرة. كمان `ip routing` محتاج multilayer switch مش سوّيتش Layer 2 بس.',
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'حدود المثال',
          text: 'الإعداد ده بيوضّح **داخل two-tier بس**. مفيش أمر IOS واحد يطبّق "three-tier" أو "spine-leaf" أو "cloud"؛ كل معمارية ليها أجهزة وسياسات وتصميم مختلف. المهم إنك تفهم دور الطبقة اللي بتضبطها.',
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
          text: 'أوامر `show` بتقرأ الـ running state من غير تغيير حاجة. في تصميم two-tier لازم تتأكد من 3 حاجات بالترتيب: الـ VLANs والمنافذ، الـ trunk، وبعدين الـ SVIs وجدول التوجيه.',
        },
        {
          type: 'code',
          label: 'مخرجات متوقّعة — SW-Core',
          language: 'ios',
          code: `SW-Core# show vlan brief

VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active
10   Sales                            active    Gi0/1
20   IT                               active    Gi0/1

SW-Core# show interfaces trunk

Port        Mode         Encapsulation  Status        Native vlan
Gi0/1       on           802.1q         trunking      1

Port        Vlans allowed on trunk
Gi0/1       10,20

SW-Core# show ip interface brief

Interface      IP-Address      OK? Method Status    Protocol
Vlan10         192.168.10.1    YES manual up        up
Vlan20         192.168.20.1    YES manual up        up
GigabitEthernet0/1 unassigned  YES unset  up        up

SW-Core# show ip route

Codes: C - connected, S - static, L - local
C    192.168.10.0/24 is directly connected, Vlan10
C    192.168.20.0/24 is directly connected, Vlan20`,
        },
        {
          type: 'code',
          label: 'مخرجات متوقّعة — SW-Access',
          language: 'ios',
          code: `SW-Access# show vlan brief

VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active
10   Sales                            active    Gi0/1, Gi0/2, Gi0/24
20   IT                               active    Gi0/3, Gi0/4, Gi0/24

SW-Access# show interfaces status

Port      Name            Status       Vlan       Duplex  Speed
Gi0/1     SALES-PC        connected    10         a-full  a-100
Gi0/2     SALES-PC        connected    10         a-full  a-100
Gi0/3     IT-PC           connected    20         a-full  a-100
Gi0/4     IT-PC           connected    20         a-full  a-100
Gi0/24    UPLINK-TO-CORE  connected    trunk      a-full  a-1000

SW-Access# show cdp neighbors
Capability Codes: R - Router, S - Switch
Device ID   Local Intrfce   Holdtme  Capability  Platform   Port ID
SW-Core     Gig 0/24        154      S I         WS-C3560   Gig 0/1`,
        },
        {
          type: 'table',
          headers: ['الأمر', 'بتتحقق منه إيه؟', 'ملاحظة منصّة'],
          rows: [
            ['`show vlan brief`', 'الـ VLANs والمنافذ التابعة لها', 'متاح على معظم سوّيتشات Cisco IOS'],
            ['`show interfaces trunk`', 'حالة الـ trunk و الـ allowed VLANs و native VLAN', 'الاسم أو الشكل يختلف شوية بين المنصّات'],
            ['`show ip interface brief`', 'حالة الـ SVIs والمنافذ والـ IP', 'على L2 switch الـ SVIs مش هتكون gateways'],
            ['`show running-config`', 'الإعداد الفعلي المطبّق', 'شوف بند `ip routing` و الـ SVIs'],
            ['`show interfaces status`', 'connected / down، speed، duplex، VLAN', 'مفيد لاكتشاف duplex mismatch'],
            ['`show cdp neighbors`', 'الأجهزة المجاورة والمنافذ', 'CDP بروتوكول Cisco-proprietary ومحتاج يكون مفعّل'],
            ['`show lldp neighbors`', 'نفس فكرة CDP لكن معيار 802.1AB', 'محتاج LLDP مفعّل ويدعمه الطرف التاني'],
            ['`show ip route`', 'وجود connected routes للـ VLANs و next hop', 'مفيش routes بين VLANs لو `ip routing` مش مفعّل'],
          ],
        },
        {
          type: 'table',
          headers: ['الإخراج', 'معناه', 'الإجراء'],
          rows: [
            ['SVI `down/down`', 'مفيش منفذ `up` داخل الـ VLAN أو الـ VLAN مش موجودة', 'تأكد من `vlan` و access ports و `no shutdown`'],
            ['`Gi0/1` مش ظاهر في `show interfaces trunk`', 'المنفذ مش trunk', 'اكتب `switchport mode trunk` وافحص الـ allowed VLANs'],
            ['`show ip route` فيه VLAN واحدة بس', '`ip routing` أو SVI ناقص', 'فعّل `ip routing` وراجع `interface Vlan`'],
            ['`show cdp neighbors` فاضي', 'CDP متوقف أو الطرف مش Cisco', 'جرّب `show lldp neighbors` أو فعّل CDP'],
            ['PC ي ping نفسه بس مش الـ gateway', 'IP/Mask أو gateway غلط على الـ PC', 'راجع `ipconfig` على العميل'],
            ['`connected` بس duplex mismatch', 'طرف auto والتاني full ثابت', 'وحّد duplex/speed على الطرفين'],
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'ترتيب تفكير ثابت',
          text: 'Layer 1 (كابل/منفذ) → Layer 2 (VLAN/trunk/MAC) → Layer 3 (SVI/route/gateway). لو مشيت بالترتيب ده هتلاقي الخطأ في دقائق بدل ما تضيع وقت في حاجات مش مرتبطة.',
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
          text: 'الأخطاء هنا حقيقية من بيئات enterprise: بعضها غلط إعداد، وبعضها غلط **اختيار تصميم** من الأساس. الجدول بيغطّي الأعراض والسبب وطريقة الفحص والحل.',
        },
        {
          type: 'table',
          headers: ['السيناريو', 'الأعراض', 'الأسباب المحتملة', 'التشخيص', 'الحل'],
          rows: [
            [
              '1. تصميم مش بي-scaling',
              'الـ packet loss يزيد لما المستخدمين يكبروا؛ الـ uplink يتشبع',
              'اختيار تصميم two-tier لمؤسسة كبيرة أو كل الـ access متصلين بسوّيتش واحد',
              'راقب استخدام الـ uplink وعدد الأجهزة لكل distribution block',
              'ارتقي لـ three-tier أو قسّم الـ network في blocks، وضيف redundant uplinks',
            ],
            [
              '2. Single points of failure',
              'انقطاع كامل لما سوّيتش core أو WAN router يتوقف',
              'جهاز واحد بلا standby، أو link واحد بلا بديل',
              'شوف `show interfaces status` وجرّب shutdown للجهاز في لاب',
              'ضيف core/third switch ثاني، dual uplinks، و WAN backup VPN أو SD-WAN',
            ],
            [
              '3. VLAN غلط',
              'PC مش بيوصل للـ gateway رغم إن الـ LED شغال',
              'منفذ في VLAN 1 بدل 10، أو VLAN مش معمولة على السوّيتش',
              '`show vlan brief` و `show interfaces status`',
              'صحّح `switchport access vlan` واعمل `vlan` على كل السوّيتشات',
            ],
            [
              '4. Trunk غلط',
              'VLAN 10 شغالة بس VLAN 20 لا عبر السوّيتشين',
              'المنفذ access بدل trunk أو الـ allowed list ناقصة',
              '`show interfaces trunk` على الطرفين',
              '`switchport mode trunk` و `switchport trunk allowed vlan 10,20` على الطرفين',
            ],
            [
              '5. مفيش inter-VLAN routing',
              'ping داخل VLAN شغال وبين VLANs فاشل',
              '`ip routing` مش مفعّل أو SVI ناقص أو الـ PC gateway غلط',
              '`show ip route` و `show ip interface brief` و `ipconfig`',
              'فعّل `ip routing`، اعمل SVIs، واضبط الـ default gateway على الأجهزة',
            ],
            [
              '6. WAN connectivity ضعيفة',
              'فروع بتبطأ أو بتنقطع، خصوصاً في أوقات الذروة',
              'رابط إنترنت غير موثوق، غياب backup، أو SD-WAN policy غلط',
              'افحص الـ interface errors والـ latency واختبر المسار البديل',
              'استخدم MPLS/leased line مناسب أو IPsec VPN backup و SD-WAN policy واضحة',
            ],
            [
              '7. فهم غلط للـ spine-leaf',
              'محاولات وصل leaf بـ leaf أو spine بـ spine',
              'خلط بينه وبين hierarchical three-tier أو آراء تصميم تانية',
              'ارسم الـ fabric وراجع كل رابط',
              'كل leaf ↔ كل spine فقط؛ استخدم ECMP واترك الـ fabric يتوزّع',
            ],
            [
              '8. خلط Cloud و WAN',
              'الشخص بيقول "السيرفر في الـ WAN" أو "الـ cloud هو إنترنت بس"',
              'فهم الـ cloud كأنه وسيلة نقل بدل كونه مكان استضافة',
              'اسأل: مين بيملك الهاردوير وفين الـ VM شغالة؟',
              'WAN = يوصل شبكات؛ Cloud = بيستضيف موارد؛ Hybrid = الاثنان معاً',
            ],
            [
              '9. خلط physical و logical',
              'الشخص بيفترض إن جهازين فوق نفس السوّيتش لازم يتكلموا',
              'إهمال الـ VLANs والـ subnetting',
              'قارن `show vlan brief` بعنوان IP والماسك على العميل',
              'افصل الـ logical topology في رسم منفصل واربطه بالـ physical',
            ],
          ],
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'قاعدة ذهبية',
          text: 'قبل ما تغيّر إعداد، اسأل: **المشكلة في التصميم ولا في الإعداد؟** لو التصميم بيفتقد redundancy أو scalability، أي تعديل أوامر مش هيحل المشكلة.',
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
          text: 'الهدف: تبني two-tier حقيقي فيه L3 switch في الكور وسوّيتشين access و4 PCs، وتثبت إن VLAN 10 (`Sales`) و VLAN 20 (`IT`) يتكلّموا مع بعض عبر الـ collapsed core.',
        },
        { type: 'diagram', id: 'topology-lab', caption: 'SW-Core في الأعلى، SW-Access1 و SW-Access2 تحته، وكل access عليه PC اتنين.' },
        {
          type: 'callout',
          tone: 'warning',
          title: 'اختر الموديل الصح',
          text: 'استخدم multilayer switch زي `3560-24PS` أو `3650-24PS` في Packet Tracer عشان يدعم `ip routing` والـ SVIs. موديلات زي `2960` Layer 2 بس ومش هتعمل inter-VLAN routing.',
        },
        {
          type: 'table',
          headers: ['الجهاز', 'الواجهة / SVI', 'IP / Mask', 'ملاحظة'],
          rows: [
            ['`SW-Core`', 'Vlan10', '192.168.10.1 /24', 'Default gateway لـ Sales'],
            ['`SW-Core`', 'Vlan20', '192.168.20.1 /24', 'Default gateway لـ IT'],
            ['`SW-Core`', 'G0/1 و G0/2', 'no IP — trunk', 'Uplinks للـ access switches'],
            ['`SW-Access1`', 'G0/24', 'trunk', 'إلى SW-Core G0/1'],
            ['`SW-Access2`', 'G0/24', 'trunk', 'إلى SW-Core G0/2'],
            ['`PC0` / `PC1`', 'NIC', '192.168.10.10 / .11 — GW 192.168.10.1', 'Sales / VLAN 10'],
            ['`PC2` / `PC3`', 'NIC', '192.168.20.10 / .11 — GW 192.168.20.1', 'IT / VLAN 20'],
          ],
        },
        {
          type: 'table',
          headers: ['من', 'إلى', 'نوع الرابط'],
          rows: [
            ['SW-Core G0/1', 'SW-Access1 G0/24', 'Trunk — VLAN 10,20'],
            ['SW-Core G0/2', 'SW-Access2 G0/24', 'Trunk — VLAN 10,20'],
            ['SW-Access1 G0/1', 'PC0', 'Access — VLAN 10'],
            ['SW-Access1 G0/2', 'PC1', 'Access — VLAN 10'],
            ['SW-Access2 G0/1', 'PC2', 'Access — VLAN 20'],
            ['SW-Access2 G0/2', 'PC3', 'Access — VLAN 20'],
          ],
        },
        {
          type: 'code',
          label: 'المهمة 1 — SW-Core',
          language: 'ios',
          code: `enable
configure terminal
hostname SW-Core
ip routing
vlan 10
 name Sales
vlan 20
 name IT
exit
interface GigabitEthernet0/1
 switchport mode trunk
 switchport trunk allowed vlan 10,20
 no shutdown
interface GigabitEthernet0/2
 switchport mode trunk
 switchport trunk allowed vlan 10,20
 no shutdown
interface Vlan10
 ip address 192.168.10.1 255.255.255.0
 no shutdown
interface Vlan20
 ip address 192.168.20.1 255.255.255.0
 no shutdown
end
copy running-config startup-config`,
        },
        {
          type: 'code',
          label: 'المهمة 2 — SW-Access1',
          language: 'ios',
          code: `enable
configure terminal
hostname SW-Access1
vlan 10
 name Sales
vlan 20
 name IT
exit
interface range GigabitEthernet0/1 - 2
 switchport mode access
 switchport access vlan 10
 spanning-tree portfast
 no shutdown
interface GigabitEthernet0/24
 switchport mode trunk
 switchport trunk allowed vlan 10,20
 no shutdown
end`,
        },
        {
          type: 'code',
          label: 'المهمة 3 — SW-Access2',
          language: 'ios',
          code: `enable
configure terminal
hostname SW-Access2
vlan 10
 name Sales
vlan 20
 name IT
exit
interface range GigabitEthernet0/1 - 2
 switchport mode access
 switchport access vlan 20
 spanning-tree portfast
 no shutdown
interface GigabitEthernet0/24
 switchport mode trunk
 switchport trunk allowed vlan 10,20
 no shutdown
end`,
        },
        {
          type: 'steps',
          items: [
            {
              title: 'المهمة 4 — إعداد الـ PCs',
              text: 'من كل PC: `Desktop → IP Configuration`. اكتب الـ IP والماسك والـ gateway من الجدول. مفيش DHCP في اللاب — الإعداد يدوي عشان تتركّز في الـ VLANs والـ routing.',
            },
            {
              title: 'المهمة 5 — تحقّق من Layer 2',
              text: 'على SW-Core وكل access اكتب `show vlan brief` و `show interfaces trunk`. لازم تشوف VLAN 10 و20 والمنافذ الصح. كمان `show interfaces trunk` لازم يظهر Gi0/1 و Gi0/2.',
            },
            {
              title: 'المهمة 6 — تحقّق من Layer 3',
              text: 'على SW-Core اكتب `show ip interface brief` — الـ SVIs لازم `up/up`. واكتب `show ip route` — لازم تلاقي Connected للشبكتين 192.168.10.0/24 و 192.168.20.0/24.',
            },
            {
              title: 'المهمة 7 — اختبر الاتصال',
              text: 'من PC0 اعمل `ping 192.168.10.11` (نفس الـ VLAN) ثم `ping 192.168.20.10` (بين VLANs). الاتنين لازم ينجحوا. جرّب `tracert 192.168.20.10` عشان تشوف إن الـ packet مرّ على الـ SVI.',
            },
            {
              title: 'تحدٍ إضافي 1',
              text: 'اعمل `shutdown` على Gi0/1 في SW-Core وجرّب الـ ping من PC0 لـ PC2. سجّل النتيجة، وبعدين رجّع المنفذ بـ `no shutdown`.',
            },
            {
              title: 'تحدٍ إضافي 2',
              text: 'غيّر الـ allowed VLANs على trunk وامسح VLAN 20 وجرّب تاني. شوف إزاي `show interfaces trunk` بيقولك السبب قبل ما تروح تفتّش في الـ PCs.',
            },
          ],
        },
        {
          type: 'code',
          label: 'النتائج المتوقّعة',
          language: 'text',
          code: `PC> ping 192.168.20.10
Pinging 192.168.20.10 with 32 bytes of data:
Reply from 192.168.20.10: bytes=32 time<1ms TTL=127
Reply from 192.168.20.10: bytes=32 time<1ms TTL=127
Reply from 192.168.20.10: bytes=32 time<1ms TTL=127
Reply from 192.168.20.10: bytes=32 time<1ms TTL=127

Ping statistics for 192.168.20.10:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)`,
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'لو الـ ping فشل',
          text: 'ابدأ من الـ PC: gateway صح؟ بعدين `show vlan brief`، بعدين `show interfaces trunk`، وبعدين `show ip route` على SW-Core. تسع مرات من عشرة هتلاقي إما trunk ناقص أو `ip routing` مش مفعّل.',
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
          text: 'الإجابة مخفية لحد ما تضغط **تحقق من الإجابة**. في السؤال متعدد الاختيارات اختار أكتر من إجابة. اقرأ الشرح حتى لو إجابتك كانت صح — بيشرح ليه الخيارات التانية غلط.',
        },
        {
          type: 'quiz',
          questions: [
            {
              id: 'q1',
              prompt: 'شركة متوسطة عندها access switches متصلة بسوّيتش L3 واحد بيعمل routing بين الـ VLANs وبيكون الـ backbone في نفس الوقت. إيه اسم المعمارية دي؟',
              options: ['Two-tier / Collapsed Core', 'Three-tier', 'Spine-leaf', 'SOHO'],
              correctIndex: 0,
              requireSubmit: true,
              explanation:
                'الصح هو **Two-tier / Collapsed Core**: وظائف Distribution و Core متجمعة في طبقة واحدة. Three-tier غلط لأنها تفصلهم لطبقتين منفصلتين. Spine-leaf غلط لأنها fabric من leaf/spine في data center مش access و core عاديين. SOHO غلط لأنها لمكتب أو بيت صغير بجهاز واحد.',
            },
            {
              id: 'q2',
              prompt: 'في تصميم Three-tier، اختر **اثنين** من العبارات الصحيحة عن طبقة Distribution.',
              options: [
                'بتعمل Layer 3 routing بين الـ VLANs',
                'بتوفّر منافذ مباشرة لأجهزة المستخدمين النهائيين',
                'بتطبّق network policies وتعمل L2/L3 boundary',
                'الهدف الأساسي منها إنها تكون backbone سريع من غير فحص policies',
              ],
              correctIndices: [0, 2],
              kind: 'multiple',
              requireSubmit: true,
              explanation:
                'الصح: **(A) و (C)** — الـ Distribution يعمل routing وسياسات وحدود L2/L3. **(B)** غلط لأن منافذ المستخدمين وظيفة الـ Access Layer. **(D)** غلط لأن وصف "backbone سريع من غير تعقيد" ده وظيفة الـ Core Layer.',
            },
            {
              id: 'q3',
              prompt: 'Data center فيه كل سيرفر متصل بـ leaf، وكل leaf متصل بكل spine، والترافيك بين السيرفرات يتوزّع على أكتر من مسار بنفس الـ cost. إيه المعمارية؟',
              options: ['Two-tier', 'Three-tier', 'Spine-leaf', 'WAN'],
              correctIndex: 2,
              requireSubmit: true,
              explanation:
                'الصح هو **Spine-leaf**: كل leaf بيتصل بكل spine و `ECMP` بيوزّع على المسارات المتساوية. Two-tier و Three-tier غلط لأنهما hierarchical بـ access/distribution/core. WAN غلط لأنه بيوصل مواقع جغرافية مش سيرفرات جوه data center.',
            },
            {
              id: 'q4',
              prompt: 'شركة مقرها القاهرة ولها فروع في الإسكندرية وأسوان. الفروع محتاجة تفتح تطبيقات المقر كل يوم، مع رابط احتياطي فوق الإنترنت. إيه المعمارية الأنسب لوصف الربط ده؟',
              options: ['SOHO', 'WAN (مع VPN backup / SD-WAN)', 'Spine-leaf', 'Collapsed Core'],
              correctIndex: 1,
              requireSubmit: true,
              explanation:
                'الصح هو **WAN** لأنه بيوصل LANs في مدن مختلفة، والـ backup VPN أو SD-WAN بيختار المسار المناسب. SOHO غلط لأنه لموقع صغير واحد مش لشركة متعددة الفروع. Spine-leaf غلط لأنه data center internal. Collapsed Core غلط لأنه تصميم داخل موقع واحد.',
            },
            {
              id: 'q5',
              prompt: 'انظر للرسم: جزء من البنية التحتية عند الشركة وجزء مستضاف عند provider، وbetweenهم VPN/dedicated link. إيه وصف المعمارية الصح؟',
              options: ['On-premises فقط', 'Cloud فقط', 'Hybrid Cloud', 'Two-tier'],
              correctIndex: 2,
              diagram: 'hybrid-cloud',
              requireSubmit: true,
              explanation:
                'الصح هو **Hybrid Cloud**: الرسم فيه on-premises و cloud مع رابط بينهم. On-premises فقط غلط لأن فيه موارد عند الـ provider. Cloud فقط غلط لأن فيه أجهزة وبيانات محلية. Two-tier غلط لأنه تصميم طبقات داخل شبكة وليس نموذج استضافة. الأمان هنا مش تلقائي — المسؤولية مقسّمة حسب نموذج الخدمة.',
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
            '**Architecture = تصميم الطبقات والأدوار؛ Topology = شكل الروابط. Physical = فين الكابل؛ Logical = إزاي الترافيك بيفضل.**',
            '`Two-Tier = Collapsed Core`: Access + طبقة واحدة بتجمع Distribution و Core — للشركات الصغيرة والمتوسطة.',
            '`Three-Tier = Access · Distribution · Core`: access للأجهزة، distribution للـ routing والسياسات، core للنقل السريع.',
            '`Spine-Leaf`: كل leaf متصل بكل spine، مفيش leaf-to-leaf مباشر، و `ECMP` بيوزّع الترافيك — مثالي للـ data centers.',
            '`WAN`: بيوصل شبكات متباعدة جغرافياً؛ يشمل private WAN و VPN فوق الإنترنت و SD-WAN — مش نفس مفهوم الإنترنت.',
            '`SOHO`: router واحد غالباً بيجمع NAT و DHCP و firewall و switch و AP — بسيط ورخيص، لكن مع زيادة الحجم بيوصل لحدوده.',
            '`On-Premises`: الشركة مالكة الهاردوير ومسؤولة عنه. `Cloud`: الـ provider بيستضيف الموارد. `Hybrid Cloud`: دمج الاثنين.',
            '`IaaS` → VMs و network، `PaaS` → منصة تشغيل، `SaaS` → تطبيق جاهز. الأمان بيعتمد على `shared responsibility`.',
          ],
        },
        {
          type: 'table',
          headers: ['Architecture', 'Main Purpose', 'Typical Environment'],
          rows: [
            ['Two-Tier', 'Simplified hierarchical design', 'Small/Medium Enterprise'],
            ['Three-Tier', 'Scalable hierarchical design', 'Large Enterprise'],
            ['Spine-Leaf', 'High-performance connectivity', 'Data Centers'],
            ['WAN', 'Connect distant networks', 'Multi-location Organizations'],
            ['SOHO', 'Simple small network', 'Homes and Small Offices'],
            ['On-Premises', 'Locally owned infrastructure', 'Organizations with local infrastructure'],
            ['Cloud', 'Provider-hosted infrastructure', 'Organizations using cloud services'],
          ],
        },
        {
          type: 'table',
          headers: ['فخ امتحاني', 'الإجابة الصح'],
          rows: [
            ['"Two-tier معناها مفيش core"', 'لا — الـ core متدمج مع distribution (Collapsed Core)'],
            ['"الـ Core بيفحص كل policy"', 'لا — الـ Core هو backbone سريع وبسيط، والسياسات على الـ Distribution'],
            ['"الـ leafs متصلة ببعضها في spine-leaf"', 'لا — كل leaf متصل بكل spine فقط'],
            ['"الـ ECMP يعني مسار واحد أسرع"', 'لا — عدة مسارات بنفس الـ cost يتوزّع عليها الترافيك'],
            ['"الـ WAN هو الإنترنت"', 'لا — الإنترنت مثال على WAN، والـ WAN يشمل روابط خاصة كمان'],
            ['"SOHO router دايماً بيشغّل BGP"', 'لا — الـ SOHO router بيستخدم NAT و DHCP و default route غالباً'],
            ['"الـ cloud أأمن تلقائياً"', 'لا — الـ shared responsibility ونموذج الخدمة بيحدّدوا المسؤوليات'],
            ['"جهازين على نفس السوّيتش لازم يتكلموا"', 'لا — لو VLANs أو subnets مختلفة محتاج routing'],
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'قبل ما تروح للموضوع 1.3',
          text: 'دلوقتي عارف **فين** نحط الأجهزة. الموضوع الجاي بيجيب على **إنت بتوصلهم بإيه**: single-mode و multimode fiber و copper، و point-to-point مقابل shared media. راجع الـ diagram بتاع الـ WAN والـ spine-leaf قبل ما تبدأ.',
        },
      ],
    },
  ],
}
