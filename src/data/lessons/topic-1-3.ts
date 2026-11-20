import type { Lesson } from '../types'

export const topic13Lesson: Lesson = {
  topicId: '1.3',
  title: 'مقارنة الواجهات وأنواع الكابلات',
  description:
    'في الدرس ده هتعرف إزاي الأجهزة تتوصل فعلياً: single-mode fiber و multimode fiber و copper، وإيه الفرق بين Ethernet shared media و point-to-point. هشوف الإشارة بتمشي إزاي على المستوى الفيزيائي، وأوامر Cisco IOS لضبط الواجهات والتحقق منها، ولاب Packet Tracer، وأسئلة امتحان.',
  estimatedTime: '~60 دقيقة',
  steps: [
    {
      id: 'what',
      title: 'إيه اللي إحنا بندرسه وليه وجوده مهم؟',
      short: 'مفهوم الدرس',
      blocks: [
        {
          type: 'paragraph',
          text: 'في الموضوع 1.2 اخترنا **فين** نحط الأجهزة. دلوقتي السؤال هو: **إزاي نوصّلهم؟** الإجابة هي `Physical Network Connectivity`: الوسيط والمنفذ والكابل والـ transceiver اللي بينقلوا الـ bits من جهاز لجهاز. لو الـ Layer 1 غلط، أي إعداد فوقه هيبقى مفيش له معنى.',
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'مكان الدرس في الـ blueprint',
          text: 'الموضوع ده هو Objective `1.3` في دومين `Network Fundamentals`. الأهداف الرسمية: `1.3.a Single-mode fiber, multimode fiber, copper` و `1.3.b Connections (Ethernet shared media and point-to-point)`. الامتحان بيجيب على صورة مقارنات، سيناريوهات اختيار وسيط، وتشخيص واجهة أو كابل.',
        },
        {
          type: 'table',
          headers: ['المصطلح', 'معناه', 'مثال'],
          rows: [
            ['`Physical Network Connectivity`', 'الوسيط المادي والمنافذ والروابط اللي بتوصل الأجهزة فعلياً', 'كابل Cat6 من PC لسوّيتش'],
            ['`Network Interface`', 'منفذ الجهاز اللي بيحوّل الـ bits لإشارة ويتحكم في الـ Layer 1', 'NIC, GigabitEthernet0/1'],
            ['`Network Cabling`', 'الأسلاك أو الألياف والـ connectors اللي بينقلوا الإشارة', 'UTP, STP, fiber patch cord'],
            ['`Transceiver`', 'الجزء اللي بيحوّل إشارة كهربائية لـ ضوء والعكس في الـ fiber', 'SFP, SFP+, 10GBASE-LR'],
          ],
        },
        {
          type: 'paragraph',
          text: 'الأجهزة محتاجة **physical connection** لأن الـ bits ما بيطيروش؛ لازم يتحوّلوا لإشارة كهربائية أو ضوئية تعدّي في وسيط وتوصل للطرف التاني. الوسيط بيقرّر أقصى سرعة، وأقصى مسافة، ومدى تأثره بالتداخل، وتكلفة التركيب والصيانة.',
        },
        {
          type: 'table',
          headers: ['المفهوم', 'السؤال اللي بيجيب عليه', 'مثال عملي'],
          rows: [
            ['`Speed`', 'الواجهة شغالة على إيه معدل دلوقتي؟', '`1000Mb/s` في `show interfaces`'],
            ['`Bandwidth`', 'إيه السعة القصوى اللي الـ link أو الوسيط يقدر يتحملها؟', '`BW 1000000 Kbit/sec` في مخرجات Cisco'],
            ['`Throughput`', 'إيه الكمية اللي وصلت فعلياً في الزمن ده؟', 'نتيجة اختبار iperf أو عدّادات الـ interface'],
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Bandwidth مش دايماً اللي بتشوفه',
          text: 'في مخرجات Cisco زي `BW 1000000 Kbit/sec`، الـ BW قيمة ثابتة بتستخدمها بروتوكولات الـ routing كـ metric — مش قياس لحظي للسرعة. الـ **speed** الحقيقية بتظهر من حالة الـ interface والـ auto-negotiation، والـ **throughput** بتعتمد على الازدحام والأخطاء والـ host نفسه.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Distance limitations**: كل وسيط ليه حد مسافة. الـ copper Ethernet الشائع حوالي 100 m channel، والـ fiber بيعتمد على نوع الـ transceiver والـ wavelength.',
            '**Attenuation**: الإشارة بتضعف كل ما زادت المسافة بسبب المقاومة في النحاس أو الامتصاص والتشتت في الألياف.',
            '**Electromagnetic Interference (EMI)**: محركات، كابلات كهرباء، وإضاءة فلورسنت ممكن تضيف noise للنحاس. الألياف مش بتتأثر بالـ EMI لأنها بتنقل ضوء مش كهرباء.',
            '**Crosstalk**: إشارة من زوج نحاسي مجاور تتسرب لزوج تاني — الـ twisting والـ category بيقلّلوا ده.',
            '**Compatibility**: الكابل والconnector والـ transceiver لازم يكونوا متوافقين مع سرعة الواجهة ومع الطرف التاني.',
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'تشبيه من الحياة الواقعية',
          text: 'تخيّل الـ bits زي رسايل مكتوبة. الـ **copper** زي سلك تليفون بيوصل صوت كهربائي — سهل ورخيص لكن الجيران الصخب ( EMI ) ممكن يسمّعوك معاهم. الـ **fiber** زي شعاع ليزر في أنبوب زجاجي — بعيد وسريع ومفيش صخب بيأثر عليه. الـ **hub** زي غرفة فيها ناس بيصرخوا كلهم في نفس الوقت، أما الـ **switch** زي مكتب بريد بيعرف عنوان كل واحد وبيوصّل الرسالة لصاحبها بس.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Single-Mode Fiber (SMF)**: ليف رفيع ينقل mode واحد — للمسافات الطويلة والـ backbone.',
            '**Multi-Mode Fiber (MMF)**: ليف أوسع ينقل عدة modes — للمباني ومراكز البيانات.',
            '**Copper Cables**: أزواج نحاسية ملفوفة بـ RJ-45 — للأجهزة المحلية ولمسافات قصيرة.',
            '**Ethernet Shared Media**: وسيط واحد يتقاسمه أكتر من جهاز — hub و half-duplex و CSMA/CD ( legacy ).',
            '**Point-to-Point Connections**: رابط مخصص بين طرفين — full-duplex ومفيش منافسة من أجهزة تانية.',
          ],
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'قاعدة مهمة قبل أي إعداد',
          text: 'لو الكابل غلط، أو المسافة زايدة، أو الـ transceiver مش متوافق، أو الـ connector متسخ، هتلاقي `down/down` أو CRC و errors متزايدة — حتى لو الـ IP والماسك والـ VLAN صح. في الـ Layer 1 لا تنتقل للطبقة اللي فوقها لحد ما الـ link يبقى `up/up`.',
        },
      ],
    },
    {
      id: 'how',
      title: 'إزاي بيشتغلوا + أنواع الوصلات بالتفصيل',
      short: 'الآلية والتشبيه',
      blocks: [
        {
          type: 'paragraph',
          text: 'هندرس كل وسيط كـ \"مادة + شكل إشارة + حدود عملية\". اضغط `شغّل` أو `الخطوة التالية` في كل رسم عشان تشوف الإشارة بتمشي والجزء المسؤول مضيء.',
        },

        { type: 'diagram', id: 'media-smf', caption: 'SMF: core رفيع، cladding، jacket، ومصدر ليزر يبعت mode واحد للمسافات الطويلة.' },
        {
          type: 'list',
          items: [
            '**Fiber Optic Technology**: بدل كهرباء، الـ transmitter بيحوّل الـ bits لـ light pulses، والـ fiber بيوصلها، والـ receiver يحوّلها تاني لإشارة كهربائية.',
            '**Core**: المنطقة الرفيعة اللي بيمشي فيها الضوء. في SMF حوالي `8–10 µm`.',
            '**Cladding**: طبقة حول الـ core ليها معامل انكسار أقل، وبتعمل total internal reflection عشان الضوء ما يخرجش. القطر القياسي `125 µm`.',
            '**Protective Jacket**: طبقة خارجية بتحمي الليف من الخدش والرطوبة والشدّ.',
            '**Single propagation mode**: مسار ضوئي واحد فقط، فمفيش تقريباً modal dispersion.',
            '**Laser source**: غالباً عند `1310 nm` أو `1550 nm` — يقدر يوصل كيلومترات قبل ما يحتاج regeneration.',
            '**Applications**: backbone بين المباني، WAN links، data center interconnect، وروابط between floors لمسافات طويلة داخل Campus.',
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'ليه SMF بيوصل أبعد؟',
          text: 'الـ core الرفيع بيسمح بـ mode واحد بس، فالضوء ما بيتفرّعش لمسارات مختلفة الطول. قلة التشتت + ليزر قوي + طول موجة مناسب = مسافة أطول وتشتت أقل. الخلاصة: SMF = single mode + laser + long reach.',
        },

        { type: 'diagram', id: 'media-mmf', caption: 'MMF: core أوسع وعدة مسارات ضوئية — الفرق في الطول بيعمل modal dispersion.' },
        {
          type: 'list',
          items: [
            '**Multiple modes**: الضوء بيمشي بأكتر من زاوية ومسار جوه الـ core.',
            '**Larger core**: `50 µm` أو `62.5 µm`، والـ cladding لسه `125 µm`.',
            '**LED or VCSEL**: مصدر أرخص من ليزر الـ SMF، وغالباً بيشتغل عند `850 nm`.',
            '**Modal dispersion**: بعض المسارات أقصر من غيرها، فالـ pulse بيوصل موسّع والـ receiver ممكن يصعب يفرّق بين bit وbit.',
            '**Shorter distance** مقارنة بـ SMF بسبب التشتت ده.',
            '**Applications**: horizontal cabling داخل المبنى، ربط floor distribution بالـ data center، و short-reach links في الـ data center زي 10GBASE-SR و 40/100GBASE-SR4 على OM3/OM4.',
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'ليه MMF منتشرة جوه المباني والـ data centers؟',
          text: 'لأن المسافة قصيرة أصلاً، والـ VCSEL transceiver أرخص، والـ core الأكبر بيسمح بتحمل أسهل في التركيب. في الـ data center معظم الترافيك East-West ولمسافات محدودة، فـ MMF بتدي سعة عالية بتكلفة أقل من SMF.',
        },

        { type: 'diagram', id: 'media-fiber-compare', caption: 'مقارنة بصرية بين SMF و MMF — المسافة والسرعة الفعلية مش بتتحدد من الاسم لوحده.' },
        {
          type: 'table',
          headers: ['Feature', 'Single-Mode Fiber (SMF)', 'Multi-Mode Fiber (MMF)'],
          rows: [
            ['Core Diameter', 'حوالي 8–10 µm', '50 µm أو 62.5 µm'],
            ['Light Source', 'Laser (1310 / 1550 nm غالباً)', 'LED أو VCSEL (850 nm غالباً)'],
            ['Transmission Mode', 'Mode واحد — مسار واحد', 'Multiple modes — مسارات متعددة'],
            ['Distance', 'أطول بكثير — من كيلومترات إلى عشرات الكيلومترات حسب المعيار', 'أقصر — مئات الأمتار في معايير SR الشائعة'],
            ['Bandwidth Characteristics', 'تشتت أقل، سعة أعلى على المسافات الطويلة', 'Modal dispersion بيحدّد السعة والمسافة'],
            ['Cost Considerations', 'الألياف نفسها أقل تكلفة غالباً، لكن الـ optics أغلى', 'الـ transceiver أرخص، والتركيب أسهل، لكن الليف أغلى'],
            ['Common Applications', 'Campus backbone · WAN · data center interconnect', 'Building backbone · data center short reach · floor links'],
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'ما تحفظش رقم مسافة لوحده',
          text: 'المسافة والسرعة الفعلية بتعتمدوا على **نوع الـ fiber** (OM1/OM2/OM3/OM4/OS2)، والـ **transceiver**، والـ **wavelength**، ومعيار **Ethernet** (زي 1GBASE-SX مقابل 10GBASE-LR). لو السؤال محددش المعيار، اختار الإجابة الأعم: SMF للأبعد و MMF للأقرب.',
        },

        { type: 'diagram', id: 'media-utp-twist', caption: 'UTP: أزواج ملفوفة من غير درع معدني — الـ twisting بيقلّل EMI و crosstalk.' },
        {
          type: 'list',
          items: [
            '**Twisted-Pair Cable**: أزواج من أسلاك نحاسية كل اتنين ملفوفين مع بعض. كل pair بينقل إشارة بقطبية معاكسة ( differential signaling ).',
            '**RJ-45 Connector**: الموصل الشائع لـ Ethernet over copper — بيركّب على الـ 8 أسلاك في 4 أزواج.',
            '**Electrical Signals**: الـ NIC بيغيّر الـ voltage ليمثّل 0 و 1، والطرف التاني يقرأ التغيير ده.',
            '**Crosstalk**: إشارة pair بتتسرب لpair تاني. الـ twisting بيلغي جزء كبير منه.',
            '**EMI**: مصادر خارجية بتضيف noise. الـ UTP أثر فيه أكتر من STP ومن fiber.',
          ],
        },
        {
          type: 'table',
          headers: ['Category', 'Bandwidth / Skeleton', 'Common Use', 'ملاحظة'],
          rows: [
            ['`Cat5e`', '100 MHz', '1GBASE-T حتى 100 m', 'أرخص شائع، كافي لكثير من المكاتب'],
            ['`Cat6`', '250 MHz', '1GBASE-T حتى 100 m · 10GBASE-T لمسافة أقصر (حوالي 55 m غالباً)', 'أفضل من Cat5e في crosstalk'],
            ['`Cat6a`', '500 MHz', '10GBASE-T حتى 100 m', 'أسمك وأغلى، بيقلّل alien crosstalk'],
          ],
        },
        {
          type: 'paragraph',
          text: 'الـ **100-meter channel limit** في structured cabling يعني غالباً `90 m permanent link` داخل الحائط + حتى `10 m patch cords` في طرفين. زيادة المسافة بتزيد attenuation وتأخير الإشارة، فالـ auto-negotiation ممكن يرجّع السرعة أو الـ link كله يفشل.',
        },

        { type: 'diagram', id: 'media-utp-stp', caption: 'UTP مقابل STP: درع معدني وإ grounding — حماية أكبر لكن تركيب أدق.' },
        {
          type: 'table',
          headers: ['', 'UTP', 'STP'],
          rows: [
            ['Shielding', 'مفيش درع معدني إضافي', 'foil أو braid حول كل pair أو حول الكابل'],
            ['EMI Resistance', 'أقل', 'أعلى لو الـ grounding صح'],
            ['Cost & Flexibility', 'أرخص وأنعم وأسهل تركيب', 'أغلى وأصلب وأحتاج موصل متوافق'],
            ['Grounding', 'مش محتاج', 'لازم يتأرضي صح وإلا هيجمع noise'],
          ],
        },

        { type: 'diagram', id: 'media-copper-fiber', caption: 'Copper ينقل كهرباء ويتأثر بالـ EMI؛ fiber ينقل ضوء ويوصل لمسافات أطول.' },
        {
          type: 'callout',
          tone: 'info',
          title: 'خلاصة اختيار الوسيط',
          text: 'اختار **copper** لو المسافة قصيرة والميزانية محدودة والأجهزة قريبة. اختار **fiber** لو المسافة طويلة، أو فيه EMI عالي، أو محتاج bandwidth أعلى ومسار مستقبلي أطول. الـ transceiver والـ port لازم يتوافقوا مع بعض.',
        },

        { type: 'diagram', id: 'media-hub', caption: 'Hub: كل الأجهزة في collision domain واحدة والإشارة تتعاد لكل المنافذ.' },
        {
          type: 'list',
          items: [
            '**Shared Media** يعني أكتر من جهاز بيستخدموا نفس وسيط الاتصال؛ الإشارة اللي واحد بيرسلها توصل لكل الأجهزة.',
            '**Hub** جهاز Layer 1 بي Repeat الإشارة لكل المنافذ من غير ما يفهم MAC addresses.',
            '**Collision Domain** هي المنطقة اللي لو اتن جهازين بعتوا فيها في نفس اللحظة تحصل collision.',
            '**Half-Duplex** يعني الجهاز يقدر يرسل **أو** يستقبل، مش الاتنين في نفس اللحظة.',
            '**CSMA/CD**: Carrier Sense Multiple Access with Collision Detection — يسمع، يبعت، يكتشف التداخل، يبعت jam، يعمل backoff، ويعيد المحاولة.',
            '**Backoff** بيختار زمن عشوائي عشان جهازين ما يعيدوش في نفس اللحظة تاني.',
          ],
        },
        {
          type: 'table',
          headers: ['المقارنة', 'Hub / Shared Media', 'Switch / Dedicated Connection'],
          rows: [
            ['Layer', 'Layer 1 — يعيد إشارة كهربائية', 'Layer 2 — يقرأ MAC ويتعلّم Ports'],
            ['Who Receives', 'كل المنافذ', 'منفذ الـ destination MAC فقط (و flooding عند الحاجة)'],
            ['Collision Domains', 'واحدة لكل الـ hub', 'واحدة لكل port'],
            ['Duplex', 'Half-duplex غالباً', 'Full-duplex غالباً'],
            ['CSMA/CD', 'مطلوب', 'مش مستخدم في الظروف الطبيعية'],
            ['Status Today', 'legacy — مش شائع في الشبكات الحديثة', 'الأساس في كل شبكة Ethernet حديثة'],
          ],
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'نقطة امتحانية مهمة جداً',
          text: 'الـ shared Ethernet بالـ hubs والـ half-duplex **legacy**. الـ switched Ethernet الحديث بيشتغل `full-duplex`، وكل port collision domain منفصل، فـ **مفيش collisions في الظروف الطبيعية** وبالتالي مفيش استخدام لـ CSMA/CD في الـ link العادي. لو شفت سؤال فيه hub فده إشارة إن الإجابة عن CSMA/CD.',
        },

        { type: 'diagram', id: 'media-p2p', caption: 'Point-to-point: طرفين بس، full-duplex، bandwidth مخصص، والـ frame لسه ليه MAC addresses.' },
        {
          type: 'list',
          items: [
            '**Definition**: رابط مخصص بين endpointين بالظبط — مفيش جهاز تالت بيشارك الوسيط.',
            '**Full-duplex**: كل طرف يرسل ويستقبل في نفس الوقت باستخدام زوج أو ليف منفصل لكل اتجاه.',
            '**Dedicated bandwidth**: السعة كلها للطرفين، مفيش أجهزة بتتنافس عليها.',
            '**Still Ethernet**: الإطار لسه فيه `Source MAC` و `Destination MAC` حتى لو مفيش أجهزة تانية على الـ link.',
            '**Examples**: `switch-to-switch`، `router-to-router`، `switch-to-router`، وروابط `dedicated fiber` بين المباني.',
            '**الفرق عن Shared Media**: في الـ shared media كل device بيسمع الكل ويتنافس على الإرسال؛ في point-to-point مفيش تنافس ولا collisions.',
          ],
        },
      ],
    },
    {
      id: 'packet',
      title: 'الشرح على مستوى الـ signal والـ frame',
      short: 'منBits للإطار',
      blocks: [
        {
          type: 'paragraph',
          text: 'الـ architecture البيزية بتحوّل الـ bits لإشارة. في الـ fiber الرسمان `SMF` و `MMF` في الخطوة 2 بيورّوا المسار كامل: `electrical signal → optical transmitter → light pulses in core → optical receiver → signal reconstruction`. في الـ copper الرسم الجاي بيورّي نفس الفكرة بالكهرباء والـ RJ-45 والتداخل.',
        },
        { type: 'diagram', id: 'media-signal', caption: 'Copper transmission: Device A → RJ-45 → twisted pair → RJ-45 → Device B, مع attenuation و EMI.' },
        {
          type: 'steps',
          items: [
            {
              title: '1 — التوليد',
              text: 'الـ NIC في `Device A` بيحوّل الـ bits 0 و 1 لتغيّر في الـ voltage على الزوج النحاسي. ترتيب الـ voltage والـ timing بيعرّفوا السرعة (10/100/1000 Mb/s).',
            },
            {
              title: '2 — النقل',
              text: 'الإشارة بتمشي في الـ twisted pair. الـ twisting بيخلي EMI يأثر على السلكين بنفس القيمة تقريباً فيلغيه الـ receiver التفاضلي.',
            },
            {
              title: '3 — التأثير',
              text: 'المسافة الطويلة بعمل attenuation، والـ crosstalk أو EMI بيضيفوا noise. لو الـ voltage وصل بطريقة غلط، الـ bit يتقرأ غلط.',
            },
            {
              title: '4 — إعادة البناء',
              text: 'الـ NIC في `Device B` يستقبل الإشارة، يعيد ضبط الـ clock، يقرأ الـ bits، وبعدين يبني الـ frame في الـ Layer 2. لو الـ FCS فشل، الـ frame يتسقط ويزيد عدّاد الـ CRC.',
            },
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'المستويات مختلفة',
          text: 'الـ `signal` في Layer 1 مش هو الـ `frame` في Layer 2. الكابل بينقل إشارة؛ الـ NIC والـ switch هما اللي بيفهموا الـ frame والـ MAC addresses. لازم ما تخلطش بين \"الإشارة وصلت\" و\"الإطار اتبعت صح\".',
        },

        { type: 'diagram', id: 'media-csmacd', caption: 'CSMA/CD: اسمع → ابعت → اكتشف التداخل → jam → backoff → أعد الإرسال.' },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Carrier Sense**: الجهاز يسمع الـ medium قبل ما يبدأ.',
            '**Multiple Access**: أكتر من جهاز متصلين بنفس الوسيط.',
            '**Collision Detection**: لو اتن جهازين بعتوا مع بعض، الإشارتين يتداخلوا.',
            '**Jam Signal**: كل جهاز يبعت إشارة قصيرة عشان الكل يعرف إن فيه collision.',
            '**Random Backoff**: كل جهاز ينتظر زمن مختلف عشان ما يتصادموش تاني.',
            '**Retransmit**: يعيد إرسال الـ frame بعد ما الـ medium يهدى.',
          ],
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'في الشبكة الحديثة',
          text: 'في switched full-duplex Ethernet، كل منفذ فيه زوج إرسال وزوج استقبال منفصلين، فمفيش collision أصلاً. عشان كده CSMA/CD مش جزء من التشغيل الطبيعي — ده بيفرق في أسئلة الامتحان اللي بتقارن hub بـ switch.',
        },
        {
          type: 'paragraph',
          text: 'مهم كمان: سواء الـ link point-to-point أو shared، ** Ethernet frame ليه Source MAC و Destination MAC**. الفرق في الـ Layer 1 مش في محتوى الـ frame؛ في point-to-point الـ switch ببساطة بيقرأ الـ MAC ويوجّه الـ frame للمنفذ الصح من غير ما أي جهاز تاني يشارك الوسيط.',
        },
      ],
    },
    {
      id: 'config',
      title: 'إعداد Cisco IOS للواجهات الفعلية',
      short: 'أوامر الإعداد',
      blocks: [
        {
          type: 'paragraph',
          text: 'اختيار الكابل نفسه **physical design decision** ومفيش أمر IOS بيغيّر النحاس لـ fiber. بس لازم تضبط الواجهة اللي الكابل متصل بيها: الوصف، السرعة، الـ duplex، وحالة المنفذ. الهيكل هنا `SW1 ↔ SW2` برابط Ethernet مباشر.',
        },
        {
          type: 'table',
          headers: ['الجهاز', 'المنفذ', 'الوصف', 'ملاحظة'],
          rows: [
            ['`SW1`', 'GigabitEthernet0/1', 'Link-to-SW2', 'Rابط مباشر بين السوّيتشين'],
            ['`SW2`', 'GigabitEthernet0/1', 'Link-to-SW1', 'نفس الإعداد من الطرف التاني'],
          ],
        },
        {
          type: 'code',
          label: 'SW1 — إعداد الواجهة',
          language: 'ios',
          code: `SW1> enable
SW1# configure terminal
SW1(config)# interface gigabitEthernet 0/1
SW1(config-if)# description Link-to-SW2
SW1(config-if)# speed auto
SW1(config-if)# duplex auto
SW1(config-if)# no shutdown
SW1(config-if)# end
SW1# copy running-config startup-config`,
        },
        {
          type: 'code',
          label: 'SW2 — الإعداد المطابق',
          language: 'ios',
          code: `SW2> enable
SW2# configure terminal
SW2(config)# interface gigabitEthernet 0/1
SW2(config-if)# description Link-to-SW1
SW2(config-if)# speed auto
SW2(config-if)# duplex auto
SW2(config-if)# no shutdown
SW2(config-if)# end
SW2# copy running-config startup-config`,
        },
        {
          type: 'table',
          headers: ['الأمر', 'بيعمل إيه؟'],
          rows: [
            ['`enable`', 'يدخل privileged EXEC mode عشان تقدر تعمل configure وتشوف أوامر `show` الكاملة.'],
            ['`configure terminal`', 'يفتح global configuration mode.'],
            ['`interface gigabitEthernet 0/1`', 'يدخل إعداد المنفذ اللي الكابل متصل بيه.'],
            ['`description ...`', 'نص توضيحي بيظهر في `show interfaces` و `show interfaces status` — مش بيغيّر السلوك بس بيسهّل التشخيص.'],
            ['`speed auto`', 'يخلي الواجهة تتفاوض على أعلى سرعة مدعومة من الطرفين.'],
            ['`duplex auto`', 'يخلي الواجهة تتفاوض على full أو half حسب قدرة الطرفين والمعيار.'],
            ['`no shutdown`', 'يفتح المنفذ إدارياً. لو مكتوب `shutdown` هيظهر `administratively down`.'],
            ['`end`', 'يرجع privileged EXEC.'],
            ['`copy running-config startup-config`', 'يحفظ الإعداد بعد إعادة التشغيل.'],
          ],
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Auto-Negotiation',
          text: 'الـ auto-negotiation بيتبادل معلومات السرعة والـ duplex بين الطرفين عبر نبضات على الـ link. الأفضل إن الطرفين يتفقوا على `auto` معاً. لو ثبّت سرعة طرف وخليت التاني `auto`، ممكن يطلع mismatch.',
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'supported settings بتعتمد على الهاردوير',
          text: 'مش كل منفذ بيقبل كل السرعات. منفذ `GigabitEthernet` غالباً بيدعم 10/100/1000، ومنفذ `FastEthernet` لحد 100 فقط. منفذ `SFP` بيعتمد على الـ transceiver المركّب. قارن `show interfaces <port>` و `show interfaces capabilities` لو متاح على المنصة.',
        },
        {
          type: 'code',
          label: 'مثال بيعمل مشكلة — لا تفعله إلا في لاب',
          language: 'ios',
          code: `SW1(config)# interface gigabitEthernet 0/1
SW1(config-if)# speed 100
SW1(config-if)# duplex full
!
SW2(config)# interface gigabitEthernet 0/1
SW2(config-if)# speed auto
SW2(config-if)# duplex auto`,
        },
        {
          type: 'paragraph',
          text: 'في المثال ده SW1 اتثبّت على 100/full بينما SW2 فاوض حسب اللي شافه. النتيجة المحتملة هي `speed mismatch` أو `duplex mismatch`: الـ link ممكن يطلع `up` بس الـ ping يقطع ويظهر late collisions أو CRC. الحل إن الطرفين يستعملوا إعداد متوافق — والأسهل `speed auto` و `duplex auto` في الاتنين.',
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
          text: 'أوامر `show` بتقرأ الـ running state من غير تغيير حاجة. هنا بنتحقق من 4 حاجات: هل الـ link `up/up`؟ إيه السرعة والـ duplex؟ فيه أخطاء Layer 1؟ والإعداد المكتوب فعلاً إيه؟',
        },
        {
          type: 'table',
          headers: ['الأمر', 'الغرض', 'ملاحظة المنصة'],
          rows: [
            ['`show interfaces status`', 'نظرة سريعة: port · status · vlan · duplex · speed · name', 'شائع على Catalyst switches'],
            ['`show interfaces gigabitEthernet 0/1`', 'تفاصيل الـ interface: state · line protocol · speed · duplex · counters', 'متاح على معظم صور Cisco IOS'],
            ['`show ip interface brief`', 'حالة الـ interface والـ IP بشكل مختصر', 'مفيد لو فيه SVI أو منفذ Layer 3'],
            ['`show controllers ethernet-controller`', 'معلومات تحكمية/إحصاءات على مستوى الـ controller', 'بيختلف كتير بين المنصات — مش موجود بنفس الشكل على كل منصة'],
            ['`show running-config interface gigabitEthernet 0/1`', 'الإعداد الفعلي تحت المنفذ ده', 'متاح على IOS/IOS-XE'],
          ],
        },
        {
          type: 'code',
          label: 'مخرجات متوقّعة — SW1',
          language: 'ios',
          code: `SW1# show interfaces status

Port      Name            Status       Vlan       Duplex  Speed   Type
Gi0/1     Link-to-SW2     connected    trunk      a-full  a-1000  10/100/1000BaseTX

SW1# show interfaces gigabitEthernet 0/1
GigabitEthernet0/1 is up, line protocol is up (connected)
  Hardware is Gigabit Ethernet, address is 0011.2233.4455
  Description: Link-to-SW2
  MTU 1500 bytes, BW 1000000 Kbit/sec, DLY 10 usec
  Full-duplex, 1000Mb/s, media type is 10/100/1000BaseTX
  ...
     0 input errors, 0 CRC, 0 frame, 0 overrun, 0 ignored
     0 output errors, 0 collisions, 0 interface resets
     0 late collisions

SW1# show ip interface brief
Interface        IP-Address      OK? Method Status    Protocol
Vlan1            unassigned      YES unset  up        up
GigabitEthernet0/1 unassigned    YES unset  up        up

SW1# show running-config interface gigabitEthernet 0/1
interface GigabitEthernet0/1
 description Link-to-SW2
 speed auto
 duplex auto
 no shutdown
end`,
        },
        {
          type: 'table',
          headers: ['الحالة', 'معناها', 'أول حاجة تعملها'],
          rows: [
            ['`up / up`', 'Layer 1 و Layer 2 تمام — الـ link شغال', 'كمل للتحقق من الـ counters والـ IP'],
            ['`down / down`', 'مفيش signal من الطرف التاني أو كابل مقطوع أو منفذ متوقف', 'افحص الكابل والـ LEDs والـ `no shutdown` في الطرفين'],
            ['`administratively down / down`', 'المنفذ مكتوب عليه `shutdown`', 'اكتب `no shutdown` تحت الـ interface'],
            ['`up / down`', 'Layer 1 شغال بس Layer 2 مش مستقر', 'راجع الـ duplex والـ encapsulation والـ keepalive حسب المنصة'],
            ['`a-full / a-1000`', 'الـ duplex والسرعة اتتفاوضت تلقائياً', 'مفيش مشكلة — ده الطبيعي مع `auto`'],
            ['`full / 100` على link 1000 متوقع', 'ممكن يكون mismatch أو الطرف التاني محدود', 'قارن الطرفين بـ `show interfaces status`'],
          ],
        },
        {
          type: 'table',
          headers: ['العدّاد', 'بيقول إيه؟', 'السبب المتوقع'],
          rows: [
            ['`input errors`', 'مجموع الأخطاء في الـ frames الداخلة', 'كابل/منفذ/EMI/ازدحام'],
            ['`CRC`', 'الـ frame وصل بفحص FCS غلط', 'كابل تالف، EMI، connector متسخ، duplex mismatch'],
            ['`collisions`', 'تصادمات على الـ link', 'طبيعي في shared half-duplex؛ مش طبيعي في full-duplex'],
            ['`late collisions`', 'تصادم حصل بعد ما الـ frame بعت جزء كبير', 'duplex mismatch، كابل أطول من الحد المسموح، أو مشكلة فيزيائية'],
            ['`interface resets`', 'الـ interface اتعاد تهيئته', 'فقدان link متكرر أو مشكلة هاردوير'],
            ['`input queue drops / overruns`', 'الـ device لم يلحق باستقبال الـ frames', 'ازدحام أو cpu/hardware مشكلة'],
          ],
        },
        {
          type: 'code',
          label: 'أوامر مساعدة لتأكيد التشخيص',
          language: 'ios',
          code: `SW1# clear counters
SW1# show interfaces gigabitEthernet 0/1 counters errors
SW1# show interfaces gigabitEthernet 0/1 | include duplex|speed|CRC|collision
SW1# show logging | include LINK|LINEPROTO|Gi0/1`,
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'ترتيب تفكير ثابت',
          text: 'شوف `Status` الأول، وبعدين `speed/duplex`، وبعدين `CRC/collisions`، وبعدين `running-config`. شيل أي شك في Layer 1 قبل ما تفتح Layer 3. واستخدم `clear counters` عشان تعرف إذا كان الخطأ لسه بيحصل دلوقتي ولا عدّاد قديم.',
        },
      ],
    },
    {
      id: 'mistakes',
      title: 'أخطاء شائعة وتشخيص الواجهة',
      short: 'Troubleshooting',
      blocks: [
        {
          type: 'paragraph',
          text: 'أخطاء الـ Layer 1 بتبان في شكل `down/down`، أو link شغال بس CRC و packet loss. الجدول بيغطي 10 سيناريوهات واقعية بالأعراض والأسباب والأوامر وخطوات الحل.',
        },
        {
          type: 'table',
          headers: ['السيناريو', 'الأعراض', 'الأسباب المحتملة', 'أوامر التشخيص', 'خطوات الفحص', 'الحل'],
          rows: [
            [
              '1. Wrong cable type',
              'Link مش بيطلع `up` أو السرعة منخفضة',
              'كابل crossover لمنفذ من غير auto-MDIX، أو كابل تليفون/USB بدل Ethernet، أو fiber patch من نوع غلط',
              '`show interfaces status` · `show interfaces <port>`',
              'شوف لون الـ LED واسم الـ media type، وجرّب كابل معروف أنه شغال',
              'استخدم straight-through غالباً مع auto-MDIX، أو crossover لمنفذ قديم، واختار fiber patch مناسب',
            ],
            [
              '2. مسافة زايدة',
              'الـ link أحياناً بيقطع أو السرعة بترجع 100/10 بدل 1000',
              'أكتر من 100 m channel على copper، أو reach أكتر من حد الـ transceiver',
              '`show interfaces <port>` · `show logging`',
              'قِس طول الكابل وراجع الـ speed المتفاوضة ورسائل LINK/LINEPROTO',
              'استخدم موزّع/سوّيتش في النص، أو حوّل لـ fiber بـ transceiver مناسب للمسافة',
            ],
            [
              '3. Fiber / transceiver incompatibility',
              'SFP مش بيظهر أو المنفذ `down/down` رغم إن الكابل موصول',
              'SFP SR على ليف SMF، أو طول موجة مختلف بين الطرفين، أو transceiver مش مدعوم على المنصة',
              '`show interfaces <port>` · `show inventory` · `show interfaces transceiver` لو متاح',
              'قارن نوع الـ SFP و nm والطرف التاني، وراجع سجل الـ device عند إدخال الـ SFP',
              'ركّب transceiver متوافق مع نوع الليف ومعيار Ethernet والمنصة',
            ],
            [
              '4. Connector أو polarity غلط',
              'مفيش ضوء مستقبل أو الـ RX لايicht لا يضيء',
              'TX وصل في RX بنفس الطرف، أو LC/SC connector غلط، أو fiber pair مقلوب',
              '`show interfaces transceiver` · فحص فيزيائي للـ LEDs',
              'افحص طرفي الـ patch cord وبدّل الزجاجات TX/RX بين الطرفين',
              'صحّح الـ connector واعمل crossover للـ fiber pair لو احتجت —_TX من طرف لـ RX في التاني',
            ],
            [
              '5. Dirty fiber connectors',
              'Optical power منخفض و CRC عالي fraction رغم إن الـ link `up/up`',
              'غبار أو بصمة إصبع أو خدش على الـ ferrule',
              '`show interfaces <port>` · `show interfaces transceiver` لو متاح',
              'افحص الـ connector بعد فصله، وقارن الـ Rx power بالطرف التاني',
              'نظّف بـ lint-free wipe وكحول مناسب، واستبدل الـ patch cord لو فيه خدش',
            ],
            [
              '6. EMI على copper',
              'Ping بيتقطع في أوقات معينة و CRC بيزيد',
              'كابل موازي لكابل كهرباء أو قريب من محرك/ UPS',
              '`show interfaces <port>` · `show logging`',
              'لاحظ توقيت الأخطاء، وشوف مسار الكابل جنب مصادر الكهرباء',
              'استخدم STP، أو بُعد الكابل عن مصادر EMI، أو حوّل الجزء ده لـ fiber',
            ],
            [
              '7. Duplex mismatch',
              'Link `up` بس بطيء جداً، late collisions و CRC في طرف واحد',
              'طرف `full` والتاني `auto` فاختار `half`',
              '`show interfaces status` · `show interfaces <port>`',
              'قارن الـ duplex على الطرفين، وابحث عن late collisions',
              'خلّي الطرفين `duplex auto`، أو ثبّت full في الاتنين لو الهاردوير يدعم',
            ],
            [
              '8. Speed mismatch',
              'الـ link مش بيرجع أو بيرجع بسرعة أقل من المتوقع',
              'طرف متثبت 100 والتاني 1000، أو منفذ يدعم 100 بس',
              '`show interfaces status` · `show interfaces <port>`',
              'قارن السرعة في الطرفين وراجع قدرات المنفذ/الـ SFP',
              'استخدم `speed auto` في الطرفين، أو ثبّت سرعة مدعومة من الطرفين معاً',
            ],
            [
              '9. CRC errors متزايدة',
              'Frames واصلة بفحص FCS غلط وعدّاد CRC بيزيد بعد `clear counters`',
              'كابل تالف، RJ-45 مجهز غلط، EMI، أو duplex mismatch',
              '`clear counters` · `show interfaces <port>` · `show interfaces <port> counters errors`',
              'امسح العدّادات، اعمل traffic، وشوف إذا الأخطاء رجعت؛ جرّب كابل تاني',
              'استبدل الكابل أو أعد terminate الـ RJ-45 أو صحّح الـ EMI/الـ duplex',
            ],
            [
              '10. Physical interface failure',
              'المنفذ `down/down` دايماً حتى مع كابل وطرف سليمين',
              'منفذ محترق، SFP مكسور، أو port في حالة errdisable',
              '`show interfaces <port>` · `show interfaces status err-disabled` · `show logging`',
              'جرّب منفذ تاني ونفس الكابل، وراجع سجل الـ errdisable',
              'انقل الكابل لمنفذ سليم، استبدل الـ SFP، أو عالج سبب الـ errdisable قبل `shutdown / no shutdown`',
            ],
          ],
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'قاعدة ذهبية',
          text: 'الـ CRC والـ late collisions مش مشاكل بروتوكول في الغالب؛ دي **أعراض Layer 1**. قبل ما تغيّر routing أو VLAN، افحص الكابل والـ connector والـ speed/duplex والـ SFP. واستخدم `clear counters` عشان تعرف إذا الخطأ لسه نشط.',
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
          text: 'الهدف: تبني شبكة copper بسيطة فيها سويّتشين و4 PCs، وتتأكد إن الـ interface في حالة `up/up`، والـ ping شغال، والـ counters نظيفة. بعدين تحاكي مشكلة فيزيائية وتشخّصها.',
        },
        { type: 'diagram', id: 'media-lab', caption: 'SW1 وSW2 متصلين بـ Gi0/1، وكل سوّيتش عليه PC اتنين بكابلات copper.' },
        {
          type: 'callout',
          tone: 'info',
          title: 'الأجهزة المطلوبة',
          text: '`2 Cisco Switches` + `4 PCs` + كابلات `Copper Straight-Through`. معظم منافذ السوّيتشات الحديثة فيها `auto-MDIX`، فالـ straight-through بيشتغل غالباً حتى للـ switch-to-switch.',
        },
        {
          type: 'table',
          headers: ['من', 'إلى', 'المنفذ', 'نوع الكابل'],
          rows: [
            ['PC0', 'SW1', 'Fa0/1', 'Copper straight-through'],
            ['PC1', 'SW1', 'Fa0/2', 'Copper straight-through'],
            ['PC2', 'SW2', 'Fa0/1', 'Copper straight-through'],
            ['PC3', 'SW2', 'Fa0/2', 'Copper straight-through'],
            ['SW1', 'SW2', 'Gi0/1 ↔ Gi0/1', 'Copper straight-through مع auto-MDIX'],
          ],
        },
        {
          type: 'table',
          headers: ['الجهاز', 'IP Address', 'Subnet Mask', 'Default Gateway'],
          rows: [
            ['PC0', '192.168.10.10', '255.255.255.0', 'اختياري في اللاب'],
            ['PC1', '192.168.10.11', '255.255.255.0', 'اختياري في اللاب'],
            ['PC2', '192.168.10.12', '255.255.255.0', 'اختياري في اللاب'],
            ['PC3', '192.168.10.13', '255.255.255.0', 'اختياري في اللاب'],
          ],
        },
        {
          type: 'code',
          label: 'SW1 — إعداد المنافذ',
          language: 'ios',
          code: `enable
configure terminal
hostname SW1
!
interface range fastEthernet 0/1 - 2
 description PC-ACCESS
 speed auto
 duplex auto
 no shutdown
!
interface gigabitEthernet 0/1
 description LINK-TO-SW2
 speed auto
 duplex auto
 no shutdown
end
copy running-config startup-config`,
        },
        {
          type: 'code',
          label: 'SW2 — إعداد المنافذ',
          language: 'ios',
          code: `enable
configure terminal
hostname SW2
!
interface range fastEthernet 0/1 - 2
 description PC-ACCESS
 speed auto
 duplex auto
 no shutdown
!
interface gigabitEthernet 0/1
 description LINK-TO-SW1
 speed auto
 duplex auto
 no shutdown
end
copy running-config startup-config`,
        },
        {
          type: 'steps',
          items: [
            {
              title: 'المهمة 1 — assort الـ cables',
              text: 'من شريط الأدوات اختار `Copper Straight-Through` ووصل كل PC بالمنفذ الموضح في الجدول. وصل SW1 بـ SW2 على Gi0/1. لاحظ إن الـ LEDs بتاع المنافذ بترجع خضراء بعد ثوان قليلة.',
            },
            {
              title: 'المهمة 2 — إعداد switches',
              text: 'الصق أوامر SW1 و SW2 في الـ CLI. ابدأ بـ `no shutdown` وتأكد إن مفيش أوامر `shutdown` قديمة على المنافذ.',
            },
            {
              title: 'المهمة 3 — إعداد الـ PCs',
              text: 'من كل PC: `Desktop → IP Configuration`. اكتب الـ IP والماسك من الجدول. الـ gateway مش محتاج لأن كل الأجهزة في نفس الشبكة.`',
            },
            {
              title: 'المهمة 4 — تحقق من Interface Status',
              text: 'على كل سوّيتش اكتب `show interfaces status`. المفروض تشوف `connected` و`a-full` و`a-100` للـ PCs و`a-1000` للرابط بين السوّيتشين — أو حسب موديلات Packet Tracer.',
            },
            {
              title: 'المهمة 5 — اختبر الاتصال',
              text: 'من PC0 اعمل `ping 192.168.10.11` (نفس السوّيتش) وبعدين `ping 192.168.10.12` (عبر الـ inter-switch link). الاتنين لازم ينجحوا.',
            },
            {
              title: 'المهمة 6 — افحص الـ counters',
              text: 'اكتب `show interfaces gigabitEthernet 0/1` على SW1 وSW2. المفروض تلاقي `0 input errors`, `0 CRC`, و`0 collisions` في الظروف الطبيعية.',
            },
            {
              title: 'المهمة 7 — مشكلة محاكاة',
              text: 'اعمل `shutdown` على `Gi0/1` في SW2 وجرّب الـ ping من PC0 لـ PC2. الـ link هيقع والـ ping هيفشل. شوف `show interfaces gigabitEthernet 0/1` في SW1 — هيظهر `down/down`. رجّع المنفذ بـ `no shutdown` وتأكد إن الـ ping رجع.',
            },
            {
              title: 'تحدٍ إضافي',
              text: 'جرّب كمان حذف كابل الـ Gi0/1 من Packet Tracer وأعد وصله، أو غيّر طرف إلى `speed 100 / duplex full` وقارن العدّادات. سجّل الفرق بين `down/down` و`up/up` مع CRC.',
            },
          ],
        },
        {
          type: 'code',
          label: 'النتائج المتوقّعة',
          language: 'text',
          code: `SW1# show interfaces status

Port      Name            Status       Vlan    Duplex  Speed
Fa0/1     PC-ACCESS       connected    1       a-full  a-100
Fa0/2     PC-ACCESS       connected    1       a-full  a-100
Gi0/1     LINK-TO-SW2     connected    1       a-full  a-1000

PC0> ping 192.168.10.12
Reply from 192.168.10.12: bytes=32 time<1ms TTL=128
Reply from 192.168.10.12: bytes=32 time<1ms TTL=128
Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)`,
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'حدود Packet Tracer',
          text: 'Packet Tracer بيحاكي الـ link up/down والـ speed/duplex وبعض العدّادات، بس **مش** بيحاكي بدقة attenuation الحقيقي، optical power budget، modal dispersion، EMI، أو جودة الـ connector. لو محتاج تحليل فيزيائي حقيقي استخدم أدوات قياس أو محاكاة متخصصة. في اللاب ده ركّز على المنطق: وصلة + منفذ + status + counters.',
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
          text: 'الإجابة مخفية لحد ما تضغط **تحقق من الإجابة**. اقرأ الشرح كامل — بيشرح ليه الخيارات التانية غلط، وده أهم من حفظ رقم الإجابة.',
        },
        {
          type: 'quiz',
          questions: [
            {
              id: 'q1',
              prompt: 'شركة بتربط مقرين على بعد 12 km، وفيه مصادر EMI قريبة من المسار، ومحتاجة bandwidth عالي للمستقبل. إيه الخيار الأنسب؟',
              options: [
                'Cat6a copper مع 100 m channel',
                'Multi-mode fiber مع VCSEL',
                'Single-mode fiber مع laser transceiver مناسب',
                'Ethernet hub مع half-duplex',
              ],
              correctIndex: 2,
              requireSubmit: true,
              explanation:
                'الصح هو **Single-mode fiber**: الـ laser والـ core الرفيع بيسمحوا بمسافات كيلومترية وتشتت أقل، والألياف مش بتتأثر بـ EMI. **(A)** غلط لأن copper Ethernet حوالي 100 m بس. **(B)** غلط لأن MMF لمسافات قصيرة داخل المبنى/الـ data center. **(D)** غلط لأن الـ hub shared و half-duplex وlegacy أصلاً.',
            },
            {
              id: 'q2',
              prompt: 'أي عبارة عن copper cabling صحيحة؟',
              options: [
                'UTP بيحتوي درع معدني حول كل pair زي STP',
                'Cat6a بيدعم 10GBASE-T حتى 100 m مع channel مركّب صح، وبيستخدم twisted pairs',
                'الألياف بتتأثر بـ EMI أكتر من UTP',
                'RJ-45 بيستخدم غالباً لتوصيل fiber patch cords',
              ],
              correctIndex: 1,
              requireSubmit: true,
              explanation:
                'الصح هو **(B)**: Cat6a مصممة لـ 10GBASE-T حتى 100 m وتعتمد على أزواج ملفوفة. **(A)** غلط لأن الـ shielding ده STP مش UTP. **(C)** غلط لأن الـ fiber مش بتتأثر بـ EMI. **(D)** غلط لأن RJ-45 موصل copper؛ الـ fiber بيستخدم LC/SC وغيرها.',
            },
            {
              id: 'q3',
              prompt: 'في شبكة legacy فيها 4 PCs متصلين بنفس الـ hub، اتن جهازين بعتوا في نفس اللحظة. إيه اللي بيحصل؟',
              options: [
                'الـ hub بيفصل الـ collision باستخدام MAC address table',
                'تحصل collision، الاتنين يبعتوا jam signal، وبعدين يعملوا random backoff ويعيدوا الإرسال',
                'الـ link يعمل full-duplex فمفيش تأثير',
                'الـ router يعيد ترتيب الإطارات قبل ما توصل',
              ],
              correctIndex: 1,
              requireSubmit: true,
              explanation:
                'الصح هو **(B)**: دي دورة CSMA/CD في shared half-duplex Ethernet — carrier sense، إرسال، كشف التداخل، jam، backoff عشوائي، وإعادة الإرسال. **(A)** غلط لأن الـ hub Layer 1 ومفيش عنده MAC table. **(C)** غلط لأن الـ hub shared ومش full-duplex. **(D)** غلط لأن الـ router مش طرف في collision الـ Layer 1 ده.',
            },
            {
              id: 'q4',
              prompt: 'أي وصف لـ point-to-point Ethernet link؟',
              options: [
                'كل الأجهزة على نفس الوسيط بتسمع كل الإرسالات',
                'الرابط بين طرفين بس، وغالباً full-duplex، والـ bandwidth مخصص لهما',
                'لازم يعمل CSMA/CD قبل كل إطار',
                ' مفيش Source MAC أو Destination MAC في الإطار',
              ],
              correctIndex: 1,
              requireSubmit: true,
              explanation:
                'الصح هو **(B)**: point-to-point يعني endpointين، full-duplex، ومفيش منافسة على الوسيط. **(A)** و **(C)** بيصفوا shared media بالـ hub. **(D)** غلط لأن إطار Ethernet دايماً فيه Source MAC و Destination MAC حتى لو الـ link مخصص.',
            },
            {
              id: 'q5',
              prompt: 'بعد تركيب كابل جديد، `Gi0/1` ظهر `up/up` بس الـ ping بيتقطع. `show interfaces` بيظهر CRC و late collisions متزايدة. إيه أحسن خطوة تالية؟',
              options: [
                'غيّر عنوان IP على PC وابدأ من جديد',
                ' impedance تحقق من الكابل والـ RJ-45، ووازن الـ speed/duplex على الطرفين، وافحص EMI',
                'غيّر الـ default gateway وامسح الـ ARP cache',
                'زوّد MTU لأن الـ CRC سببه حجم الـ frame',
              ],
              correctIndex: 1,
              requireSubmit: true,
              explanation:
                'الصح هو **(B)**: CRC و late collisions على link `up/up` بيشيروا لمشكلة Layer 1/الـ physics زي كابل تالف، terminating غلط، duplex mismatch، أو EMI. `(A)` و `(C)` غلط لأن IP/gateway/ARP مش سبب CRC. `(D)` غلط لأن MTU مش بيصلح أخطاء FCS ولا الـ late collisions.',
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
          headers: ['Feature', 'SMF', 'MMF'],
          rows: [
            ['Core', 'Smaller (8–10 µm)', 'Larger (50 / 62.5 µm)'],
            ['Light', 'Single propagation mode', 'Multiple propagation modes'],
            ['Typical Source', 'Laser', 'LED / VCSEL'],
            ['Distance', 'Longer', 'Shorter'],
            ['Applications', 'Long-distance links', 'Building / Data Center links'],
          ],
        },
        {
          type: 'list',
          items: [
            '**Copper** يستخدم electrical signals و twisted pairs، و UTP مفيهوش درع معدني إضافي بينما STP فيه shielding. RJ-45 هو الموصل الشائع لـ Ethernet copper.',
            '**Category** بتحدد bandwidth ومسافة عملية: Cat5e لـ 1GbE، Cat6 لـ 1GbE و10GbE لمسافة أقصر، Cat6a لـ 10GbE حتى 100 m.',
            '**100 m channel** قاعدة مهمة لكابلات copper Ethernet في structured cabling — زيادتها بتعمل attenuation وممكن ترجّع السرعة.',
            '**Fiber** مش بيتأثر بـ EMI، و SMF أبعد من MMF. الـ transceiver والـ wavelength ومعيار Ethernet بيحددوا المسافة والسرعة الفعلية.',
          ],
        },
        {
          type: 'list',
          items: [
            '**Hub = Shared Medium**: يعيد الإشارة لكل المنافذ، كل الأجهزة في collision domain واحدة.',
            '**Half-Duplex**: يرسل أو يستقبل، مش الاتنين مع بعض.',
            '**CSMA/CD**: آلية قديمة للتعامل مع التصادمات في shared Ethernet — jam signal و random backoff.',
            '**Modern switched Full-Duplex Ethernet**: كل port collision domain منفصل، فمفيش collisions طبيعية ومفيش استخدام لـ CSMA/CD.',
            '**Point-to-Point**: رابط مخصص بين طرفين، bandwidth مخصص، full-duplex، والإطار لسه ليه MAC addresses.',
          ],
        },
        {
          type: 'table',
          headers: ['فخ امتحاني', 'الإجابة الصح'],
          rows: [
            ['"MMF أطول من SMF لأن الـ core أكبر"', 'لا — SMF أبعد لأن مفيش modal dispersion ومصدره laser'],
            ['"Fiber بيتأثر بـ EMI زي copper"', 'لا — الـ fiber ينقل ضوء ومش بيتأثر بالـ EMI'],
            ['"UTP فيه foil حول كل pair"', 'لا — ده STP؛ UTP من غير درع معدني'],
            ['"الـ switch بيستخدم CSMA/CD زي الـ hub"', 'لا — الـ switched full-duplex مفيش فيه collisions طبيعية'],
            ['"Point-to-point معناه مفيش MAC addresses"', 'لا — الإطار لسه فيه Source و Destination MAC'],
            ['"CRC معناه مشكلة IP"', 'لا — CRC غالباً كابل/EMI/connector/duplex mismatch'],
            ['"Late collisions طبيعية في full-duplex"', 'لا — وجودها بيشير لمشكلة فيزيائية أو duplex mismatch'],
            ['"Cat6a بيوصل 10 GbE لأي مسافة"', 'لا — حتى 100 m بس مع channel مركّب صح'],
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'قبل ما تروح للموضوع 1.4',
          text: 'دلوقتي عارف إيه الشكل الصح للكابل والواجهة. الموضوع الجاي بيجيب على **تشخيص** المشاكل: collisions، errors، duplex mismatch، و speed mismatch. راجع جدول الـ counters في خطوة التحقق قبل ما تبدأ.',
        },
      ],
    },
  ],
}
