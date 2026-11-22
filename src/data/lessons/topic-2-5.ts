import type { Lesson } from '../types'

const loopProblemRows: string[][] = [
  ['Broadcast Storm', 'Broadcast frame يدور في الحلقة ويُغمر مراراً', 'استهلاك bandwidth وCPU وضعف كبير في الأداء'],
  ['MAC Address Instability', 'نفس Source MAC يُرى من منافذ مختلفة', 'جدول MAC يتغير باستمرار ويؤدي لتوجيه خاطئ'],
  ['Duplicate Frames', 'الإطار يصل لنفس الوجهة أكثر من مرة', 'تكرار حركة المستخدم وارتباك في التطبيقات'],
  ['No Loop Prevention', 'إطارات Ethernet لا تحمل TTL يوقفها', 'الإطارات تستمر في الدوران إلى أن يُمنع المسار منطقياً'],
]

const bpduFieldRows: string[][] = [
  ['Root Bridge ID', 'معرّف الـ bridge الذي يعتبره المرسل root', 'أهم حقل لتحديد الطوبولوجيا', 'مثال تعليمي: 24576 + VLAN 10 + 00:00:00:00:00:03'],
  ['Root Path Cost', 'التكلفة المتراكمة من المرسل إلى الـ root', 'كلما قلّت كان المسار أفضل', 'مثال تعليمي: 4 على رابط مباشر ثم 8 بعد عضو إضافي'],
  ['Sender Bridge ID', 'معرّف السويتش الذي أرسل الـ BPDU', 'يستخدم كـ tie-breaker', 'مثال تعليمي: 32768 + VLAN 10 + 00:00:00:00:00:02'],
  ['Sender Port ID', 'معرّف المنفذ الذي أرسل الـ BPDU', 'يستخدم كـ tie-breaker نهائي غالباً', 'مثال تعليمي: 128.1'],
  ['Port ID', 'معرّف منفذ محلي أو مُعلن', 'يميّز المنافذ داخل نفس السويتش', 'صيغة العرض تعتمد على المنصة والإصدار'],
]

const electionRows: string[][] = [
  ['SW1', '32768', '00:00:00:00:00:01', 'Priority أعلى من SW3'],
  ['SW2', '32768', '00:00:00:00:00:02', 'Priority أعلى من SW3'],
  ['SW3', '24576', '00:00:00:00:00:03', 'أقل priority، لذلك يفوز بالـ root'],
]

const roleRows: string[][] = [
  ['Root Port', 'على سويتش غير root', 'أفضل مسار نحو الـ Root Bridge', 'واحد لكل instance لكل سويتش غير root؛ الـ root نفسه ليس لديه root port'],
  ['Designated Port', 'على كل segment', 'يرسل أفضل BPDU على ذلك الـ segment', 'واحد لكل segment لكل spanning-tree instance'],
  ['Alternate Port', 'على سويتش غير root', 'مسار بديل نحو الـ root', 'غالباً discarding في Rapid PVST+ ويمكن أن يتحول لـ forwarding'],
  ['Root Bridge Port', 'على الـ root', 'يعلن BPDU للأسفل', 'غالباً designated وليس root port'],
]

const tieBreakRows: string[][] = [
  ['1', 'Lowest Root Bridge ID', 'أفضل root مُعلن في الـ BPDU'],
  ['2', 'Lowest advertised Root Path Cost', 'أقل تكلفة وصول إلى الـ root'],
  ['3', 'Lowest Sender Bridge ID', 'يُستخدم عند تساوي التكلفة'],
  ['4', 'Lowest Sender Port ID', 'يُستخدم عند تساوي المرسل'],
  ['5', 'Lowest local Port ID', 'يُستخدم عند الحاجة كحل أخير'],
]

const classicVsRapidRows: string[][] = [
  ['Blocking', 'Discarding', 'لا forwarding ولا تعلم MAC في الحالتين'],
  ['Listening', 'Discarding', 'مرحلة بناء الطوبولوجيا مدمجة في Rapid'],
  ['Learning', 'Learning', 'تعلّم MAC بدون حركة مستخدم'],
  ['Forwarding', 'Forwarding', 'إرسال واستقبال إطارات المستخدم'],
  ['Disabled', 'Discarding أو منفذ غير متاح', 'السلوك يعتمد على السبب والمنصة'],
]

const costRows: string[][] = [
  ['10 Mbps', '100', 'مثال حسب طريقة التكلفة القديمة'],
  ['100 Mbps', '19', 'مثال شائع في جداول 802.1D القديمة'],
  ['1 Gbps', '4', 'يظهر كثيراً في أمثلة CCNA'],
  ['10 Gbps', '2', 'مثال تعليمي فقط حسب method معين'],
]

const rapidComparisonRows: string[][] = [
  ['STP', 'IEEE 802.1D', 'Classic STP', 'خمس حالات وتقارب أبطأ', 'instance واحد غالباً في التنفيذ الأساسي'],
  ['RSTP', 'IEEE 802.1w', 'Rapid STP', 'ثلاث حالات وتقارب أسرع', 'مبادئ قابلة للتطبيق عبر بائعين'],
  ['Rapid PVST+', 'Cisco implementation of RSTP', 'Per-VLAN Rapid STP', 'ثلاث حالات لكل VLAN', 'instance مستقل لكل VLAN'],
]

const verificationRows: string[][] = [
  ['`show spanning-tree`', 'ملخص spanning tree لكل VLANs وport roles وstates', 'أول فحص شامل للحالة'],
  ['`show spanning-tree vlan 10`', 'تفاصيل instance الخاص بـ VLAN 10', 'عندما تريد تحليل VLAN واحد'],
  ['`show spanning-tree root`', 'Root ID وRoot Port والتكلفة لكل VLAN', 'لتحقق بسرعة من الـ root لكل VLAN'],
  ['`show spanning-tree interface GigabitEthernet0/1`', 'دور وحالة وتكلفة منفذ معين', 'عندما تريد فحص منفذ بعينه'],
  ['`show spanning-tree summary`', 'الوضع العام وعدد المنافذ وحالات PortFast/BPDU Guard حيث مدعوم', 'للمراجعة السريعة على مستوى الجهاز'],
  ['`show spanning-tree blockedports`', 'المنافذ المحظورة لكل VLAN', 'لتأكيد أي مسار احتياطي غير forwarding'],
  ['`show running-config`', 'أوامر الأولوية وPortFast وBPDU Guard الفعلية', 'لمقارنة النية بالتنفيذ'],
]

const lab1Rows: string[][] = [
  ['SW1', 'Gi0/1 - Gi0/3', 'SW2 وSW3', 'Triangle topology, VLAN 10'],
  ['SW2', 'Gi0/1 - Gi0/3', 'SW1 وSW3', 'Triangle topology, VLAN 10'],
  ['SW3', 'Gi0/1 - Gi0/3', 'SW1 وSW2', 'Triangle topology, VLAN 10'],
]

const lab2Rows: string[][] = [
  ['VLAN 10', 'Root Bridge A', 'Active path A', 'One logical tree'],
  ['VLAN 20', 'Root Bridge B', 'Active path B', 'Different logical tree possible'],
]

const commonMistakeRows: string[][] = [
  ['افتراض أن أعلى priority يفوز', 'الـ root هو صاحب أقل Bridge ID؛ الأولوية الأقل أفضل'],
  ['الخلط بين Bridge ID وMAC وحده', 'Bridge ID يتضمن priority وextended system ID وMAC'],
  ['نسيان Extended System ID', 'في PVST+ يؤثر VLAN ID على الـ effective Bridge ID'],
  ['الخلط بين Root Port وDesignated Port', 'Root Port نحو الـ root؛ Designated Port يعلن BPDU على segment'],
  ['الخلط بين Port Role وPort State', 'الدور وظيفة، والحالة مثل Discarding أو Forwarding سلوك'],
  ['افتراض أن كل رابط احتياطي يجب أن يكون forwarding', 'الرابط قد يكون discarding منطقياً لمنع الحلقة'],
  ['سوء فهم Root Path Cost', 'التكلفة متراكمة على المسار والأقل أفضل'],
  ['PortFast على رابط switch-to-switch', 'قد يخلق حلقة مؤقتة؛ استخدمه فقط على edge ports'],
  ['BPDU Guard على منفذ يجب أن يستقبل BPDUs', 'قد يؤدي إلى err-disable لمسار حقيقي'],
  ['خلط حالات 802.1D مع Rapid STP', 'Classic خمس حالات؛ Rapid ثلاث حالات'],
  ['افتراض أن كل VLANs تشترك في نفس الـ root', 'في Rapid PVST+ لكل VLAN root ومنافذ خاصة به'],
]

export const topic25Lesson: Lesson = {
  topicId: '2.5',
  title: 'Interpret Basic Operations of Rapid PVST+ Spanning Tree Protocol',
  description:
    'في Topic 2.5 ننتقل من الروابط الزائدة إلى منع الحلقات في Layer 2. هنشرح لماذا نحتاج STP وكيف تعمل BPDUs واختيار الـ Root Bridge والأدوار والحالات، ثم Rapid PVST+ وPortFast وBPDU Guard مع لابات وأوامر تحقق واختبار CCNA. لن يتم فتح Topic 2.6.',
  estimatedTime: '~130 دقيقة',
  steps: [
    {
      id: 'what',
      title: 'Why Spanning Tree Protocol Exists',
      short: 'لماذا STP',
      blocks: [
        {
          type: 'paragraph',
          text: 'الروابط الزائدة مهمة في شبكات Layer 2 لأنها توفر مساراً بديلاً عند فشل كابل أو منفذ. لكن في Layer 2، لو كل المسارات الزائدة كانت forwarding في نفس الوقت، تتكون حلقة. **STP (Spanning Tree Protocol)** يبني طوبولوجيا منطقية خالية من الحلقات عبر حظر منافذ مختارة، مع الإبقاء على الرابط الفيزيائي موجوداً.',
        },
        {
          type: 'diagram',
          id: 'l2-loop-without-stp',
          caption: 'ثلاثة سويتشات في مثلث؛ بدون STP كل المسارات forwarding وتحدث حلقة Layer 2.',
        },
        {
          type: 'list',
          items: [
            '**Redundant links** تزيد التوفر، لكنها تخلق مسارات متعددة بين نفس الجهازين.',
            '**Layer 2 Loop** تحدث عندما يستطيع إطار أن يدور عبر مسارات متعددة دون توقف.',
            'إطارات Ethernet لا تحمل TTL، لذلك لا تختفي تلقائياً بعد مرورها بعدة سويتشات.',
            '**STP logically blocks** منافذ مختارة؛ لا يفصل الكابل فيزيائياً.',
            'إذا تغيّرت الطوبولوجيا، يمكن تنشيط مسار بديل كان محظوراً.',
          ],
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'الفكرة الأساسية',
          text: 'STP لا يلغي التكرار الفيزيائي؛ يمنع استخدام كل المسارات في نفس اللحظة. هذا يسمح لك بالحفاظ على كابلات احتياطية دون حلقات دائمة.',
        },
      ],
    },
    {
      id: 'how',
      title: 'Layer 2 Loops and Their Problems',
      short: 'مشاكل الحلقات',
      blocks: [
        {
          type: 'paragraph',
          text: 'في طوبولوجيا المثلث، لو SW1 وSW2 وSW3 كلهم يرسلون ويستقبلون على كل روابطهم، فإن broadcast أو unknown unicast سيعبر كل مسار ويعود من جديد. النتيجة ثلاث مشاكل كلاسيكية: **Broadcast Storm** و**MAC Address Instability** و**Duplicate Frames**. لهذا تحتاج شبكات Layer 2 إلى آلية منع حلقات.',
        },
        {
          type: 'diagram',
          id: 'broadcast-storm',
          caption: 'Broadcast frame ينتقل بين السويتشات في الحلقة ويُغمر بشكل متكرر.',
        },
        {
          type: 'diagram',
          id: 'mac-table-instability',
          caption: 'نفس Source MAC يُتعلّم من منافذ مختلفة، فيتغير جدول MAC باستمرار.',
        },
        { type: 'table', headers: ['المشكلة', 'الآلية', 'النتيجة'], rows: loopProblemRows },
        {
          type: 'steps',
          items: [
            { title: '1', text: 'PC يرسل broadcast frame داخل VLAN.' },
            { title: '2', text: 'SW1 يغمر الإطار على جميع منافذ نفس VLAN بخلاف منفذ الوصول.' },
            { title: '3', text: 'SW2 وSW3 يستلمون الإطار ويعيدون غمره على روابط أخرى.' },
            { title: '4', text: 'الإطار يعود إلى SW1 من منفذ آخر، فيُغمر مرة أخرى.' },
            { title: '5', text: 'تتكرر الدورة ويحدث استهلاك bandwidth وCPU وتكرار في الإطارات وتذبذب في جدول MAC.' },
          ],
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'لماذا لا يكفي TTL؟',
          text: 'إطار Ethernet العادي لا يحمل TTL كما تحمل حزم IP. لذلك لا توجد آلية مدمجة توقف الإطار بعد عدد معين من القفزات؛ يجب على STP أن يمنع الحلقة منطقياً.',
        },
      ],
    },
    {
      id: 'packet',
      title: 'How STP Works and BPDU Fundamentals',
      short: 'STP وBPDU',
      blocks: [
        {
          type: 'paragraph',
          text: '**STP** معرّف في **IEEE 802.1D**. السويتشات تتبادل **Bridge Protocol Data Units (BPDUs)** لحساب طوبولوجيا خالية من الحلقات. من خلال هذه المعلومات تختار **Root Bridge** وتحدد **Root Port** و**Designated Port** و**Alternate Port** وتحسب **Root Path Cost**. لا يوجد منفذ مسموح له بإرسال حركة مستخدم إلا إذا كانت النتيجة النهائية آمنة.',
        },
        {
          type: 'diagram',
          id: 'three-switch-stp-triangle',
          caption: 'STP يحول المثلث الفيزيائي إلى شجرة منطقية بمسار احتياطي محظور.',
        },
        {
          type: 'diagram',
          id: 'bpdu-exchange',
          caption: 'BPDUs تحمل معلومات الـ root والتكلفة والمرسل بين السويتشات.',
        },
        { type: 'table', headers: ['الحقل', 'الوظيفة', 'الاستخدام', 'مثال تعليمي'], rows: bpduFieldRows },
        {
          type: 'steps',
          items: [
            { title: '1', text: 'كل سويتش يبدأ برؤية نفسه كـ root ويرسل configuration BPDUs.' },
            { title: '2', text: 'السويتشات تقارن Root Bridge ID وتختار الأفضل.' },
            { title: '3', text: 'تُحسب التكلفة المتراكمة إلى الـ root عند كل منفذ.' },
            { title: '4', text: 'تُقارن معلومات المرسل عند التعادل لاختيار أفضل مسار.' },
            { title: '5', text: 'تُعيّن الأدوار والحالات، ويصبح المسار الأقل جودة احتياطياً.' },
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'ليست كل الحقول متطابقة',
          text: 'أسماء الحقول وتنسيق الـ BPDU وطريقة العرض تختلف بين 802.1D و802.1w وتنفيذات البائعين. ركّز على المعنى: root ID وتكلفة المعلومات والمرسل.',
        },
      ],
    },
    {
      id: 'config',
      title: 'Root Bridge Election and Bridge ID',
      short: 'Root Bridge',
      blocks: [
        {
          type: 'paragraph',
          text: '**Bridge ID** يتكوّن من **Bridge Priority** و**Extended System ID** و**MAC Address**. في تنفيذات PVST+ يحمل Extended System ID رقم VLAN، لذلك يؤثر على الـ effective Bridge ID. **أقل Bridge ID يفوز**؛ تُقارن الأولوية أولاً، وإذا تساوت يُستخدم أقل MAC كtie-breaker.',
        },
        {
          type: 'diagram',
          id: 'bridge-id-structure',
          caption: 'مكوّنات Bridge ID: الأولوية وExtended System ID وعنوان MAC.',
        },
        {
          type: 'diagram',
          id: 'root-bridge-election',
          caption: 'مثال تعليمي: SW3 بأولوية 24576 يفوز رغم أن MAC الخاص به أعلى رقمياً.',
        },
        { type: 'table', headers: ['Switch', 'Priority', 'MAC Address', 'النتيجة'], rows: electionRows },
        {
          type: 'list',
          items: [
            'SW1 وSW2 كلاهما بـ priority 32768.',
            'SW3 بـ priority 24576، وهي أقل من 32768، لذلك SW3 هو الـ Root Bridge.',
            'لو تساوت الأولويات، لكان أقل MAC هو الفاصل؛ مثلاً SW1 سيفوز على SW2 وSW3 في هذا المثال.',
            'Extended System ID يغيّر القيمة الفعلية المقارَنة في PVST+.',
            'قيم الأولوية المسموح بها والخطوات (increments) تعتمد على المنصة وإصدار IOS.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'قاعدة قرار',
          text: 'Root Bridge ليس بالضرورة السويتش الأقرب فيزيائياً ولا صاحب أعلى أولوية. هو صاحب أقل Bridge ID داخل ذلك spanning-tree instance.',
        },
      ],
    },
    {
      id: 'verify',
      title: 'STP Port Roles',
      short: 'Port Roles',
      blocks: [
        {
          type: 'paragraph',
          text: 'بعد اختيار الـ Root Bridge، يحدد STP وظيفة كل منفذ. **Root Port** هو أفضل مسار من سويتش غير root نحو الـ root. **Designated Port** هو المنفذ الذي يعلن أفضل BPDU على segment. **Alternate Port** يوفر مساراً بديلاً ويكون غالباً discarding في Rapid PVST+. الـ Root Bridge نفسه لا يحتوي root port.',
        },
        {
          type: 'diagram',
          id: 'root-port-selection',
          caption: 'اختيار Root Port بناءً على أقل Root Path Cost مع أمثلة تكلفة.',
        },
        {
          type: 'diagram',
          id: 'designated-port-selection',
          caption: 'لكل segment designated port واحد يعلن أفضل BPDU.',
        },
        {
          type: 'diagram',
          id: 'alternate-port-redundant-path',
          caption: 'Alternate Port يبقى discarding ويمكن أن يصبح forwarding عند فشل المسار الأساسي.',
        },
        { type: 'table', headers: ['الدور', 'مكانه', 'الوظيفة', 'قاعدة مهمة'], rows: roleRows },
        { type: 'table', headers: ['الترتيب', 'Tie-breaker', 'الشرح'], rows: tieBreakRows },
        {
          type: 'callout',
          tone: 'info',
          title: 'Root Port مقابل Designated Port',
          text: 'يمكن أن يكون الطرفان على نفس الرابط: أحدهما Root Port لأنه يتجه نحو الـ root، والآخر Designated Port لأنه يعلن BPDU على ذلك الـ segment. لا خلط بين الدور والحالة.',
        },
      ],
    },
    {
      id: 'mistakes',
      title: 'STP Port States and Path Cost',
      short: 'States وCost',
      blocks: [
        {
          type: 'paragraph',
          text: 'الـ **Port Role** يصف وظيفة المنفذ، أما **Port State** فيصف ما يفعله المنفذ بالحركة. في **802.1D الكلاسيكي** خمس حالات: Blocking وListening وLearning وForwarding وDisabled. في **Rapid STP** ثلاث حالات فقط: Discarding وLearning وForwarding. الـ Discarding يجمع سلوك Blocking وListening وDisabled غير Forwarding.',
        },
        {
          type: 'diagram',
          id: 'classic-stp-port-states',
          caption: 'الحالات الخمس في STP الكلاسيكي حسب 802.1D.',
        },
        {
          type: 'diagram',
          id: 'rapid-stp-port-states',
          caption: 'الحالات الثلاث في Rapid STP: Discarding وLearning وForwarding.',
        },
        { type: 'table', headers: ['Classic 802.1D', 'Rapid STP', 'العلاقة'], rows: classicVsRapidRows },
        {
          type: 'paragraph',
          text: '**Root Path Cost** هو مجموع التكاليف على المسار من السويتش إلى الـ Root Bridge. كلما قلّت التكلفة الإجمالية كان المسار أفضل. تعتمد القيم الافتراضية على **STP cost method** وسرعة الرابط والمنصة؛ لذلك لا تتعامل مع جدول واحد كقاعدة عالمية.',
        },
        { type: 'table', headers: ['سرعة الرابط', 'تكلفة تمثيلية', 'ملاحظة'], rows: costRows },
        {
          type: 'callout',
          tone: 'danger',
          title: 'لا تخلط النموذجين',
          text: 'لا تصف Rapid PVST+ بأنه يستخدم Blocking وListening وDisabled كحالات منفصلة. هذا نموذج 802.1D القديم. Rapid يستخدم Discarding وLearning وForwarding فقط.',
        },
      ],
    },
    {
      id: 'lab',
      title: 'Rapid PVST+ Fundamentals and Improvements',
      short: 'Rapid PVST+',
      blocks: [
        {
          type: 'paragraph',
          text: '**STP** يعني 802.1D الكلاسيكي، و**RSTP** يعني 802.1w، و**Rapid PVST+** هو تنفيذ Cisco لـ RSTP يعمل **per VLAN**: لكل VLAN spanning-tree instance مستقل، وبالتالي root bridge وأدوار وحالات خاصة به. هذا يسمح بتصميم طوبولوجيا مختلفة لكل VLAN، وهو شيء مختلف عن MST الذي يجمع عدة VLANs في instance واحد.',
        },
        {
          type: 'diagram',
          id: 'rapid-pvst-per-vlan-topology',
          caption: 'VLAN 10 وVLAN 20 يمكن أن يكون لهما root bridge ومسار محظور مختلفان.',
        },
        {
          type: 'diagram',
          id: 'root-port-failure-activation',
          caption: 'فشل Root Port يحفّز Alternate Port ليعتمد مساراً بديلاً.',
        },
        {
          type: 'diagram',
          id: 'portfast-bpduguard',
          caption: 'PortFast على منفذ طرفي وBPDU Guard يحميه من سويتش غير متوقع.',
        },
        { type: 'table', headers: ['المصطلح', 'المعيار/النوع', 'الاسم الشائع', 'الفرق الرئيسي', 'الـ instance'], rows: rapidComparisonRows },
        {
          type: 'list',
          items: [
            '**Per-VLAN Root Bridge**: لكل VLAN root خاص به في Rapid PVST+.',
            '**Per-VLAN Port Roles وStates**: نفس المنفذ قد يكون Root Port لـ VLAN وDesignated لـ VLAN آخر.',
            '**Rapid convergence**: آلية Proposal/Agreement والـ Edge Ports تقلل زمن الانتقال إلى Forwarding في الطوبولوجيات المناسبة.',
            '**Edge Ports**: منافذ متصلة بأجهزة طرفية تُعامل بسرعة عبر PortFast حيث يدعم الجهاز ذلك.',
          ],
        },
        {
          type: 'code',
          label: 'Representative PortFast and BPDU Guard configuration - edge port only',
          language: 'text',
          code: `configure terminal
interface GigabitEthernet0/1
 spanning-tree portfast
 spanning-tree bpduguard enable
end`,
        },
        {
          type: 'paragraph',
          text: '**PortFast** يسمح لمنفذ edge بالانتقال بسرعة إلى Forwarding، لكنه **لا يلغي STP**. لا تُفعّله على رابط switch-to-switch عادي. **BPDU Guard** يحمي منفذ PortFast: إذا وصل BPDU إلى المنفذ، يوضع غالباً في **err-disabled** لمنع سويتش غير متوقع من تغيير الطوبولوجيا.',
        },
        {
          type: 'code',
          label: 'Representative global defaults where supported',
          language: 'text',
          code: `configure terminal
 spanning-tree portfast default
 spanning-tree portfast bpduguard default
end`,
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Platform differences',
          text: 'دعم الأوامر العامة وطريقة عرض حالة PortFast وBPDU Guard يختلفان بين المنصات والإصدارات. تحقق من `show spanning-tree summary` و`show running-config` في بيئة التدريب.',
        },
      ],
    },
    {
      id: 'exam',
      title: 'Cisco IOS Configuration and Verification',
      short: 'أوامر IOS والتحقق',
      blocks: [
        {
          type: 'paragraph',
          text: 'الأوامر والمخرجات هنا **أمثلة تعليمية تمثيلية (representative)** وليست لقطات من أجهزة Cisco حقيقية. توفر الأمر وصيغة الإخراج يعتمدان على المنصة وإصدار IOS. استبدل أسماء المنافذ والـ VLANs بما يناسب جهازك.',
        },
        {
          type: 'code',
          label: 'Representative root bridge configuration',
          language: 'text',
          code: `configure terminal
 spanning-tree vlan 10 root primary
end

configure terminal
 spanning-tree vlan 10 priority 4096
end`,
        },
        {
          type: 'paragraph',
          text: '`spanning-tree vlan 10 root primary` يضبط الأولوية لجعل السويتش root مفضّلاً لـ VLAN 10، حسب الطوبولوجيا الحالية. `spanning-tree vlan 10 priority 4096` يحدد قيمة صريحة؛ يجب أن تكون القيمة والخطوة (increment) مدعومتين على المنصة. أولوية أقل تعني أفضلية أكبر.',
        },
        {
          type: 'code',
          label: 'Representative edge port configuration - not for switch-to-switch links',
          language: 'text',
          code: `configure terminal
interface GigabitEthernet0/1
 switchport mode access
 spanning-tree portfast
 spanning-tree bpduguard enable
end`,
        },
        {
          type: 'code',
          label: 'Required verification commands',
          language: 'text',
          code: `show spanning-tree
show spanning-tree vlan 10
show spanning-tree root
show spanning-tree interface GigabitEthernet0/1
show spanning-tree summary
show spanning-tree blockedports
show running-config`,
        },
        { type: 'table', headers: ['الأمر', 'ما الذي يوضحه؟', 'متى تستخدمه؟'], rows: verificationRows },
        {
          type: 'code',
          label: 'Representative educational outputs - not captured from real hardware',
          language: 'text',
          code: `SW2# show spanning-tree vlan 10

VLAN0010
  Spanning tree enabled protocol rstp
  Root ID    Priority    24586  (priority 24576 sys-id-ext 10)
             Address     0000.0000.0003
             Cost        4
             Port        1 (GigabitEthernet0/1)
             Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec

  Bridge ID  Priority    32778  (priority 32768 sys-id-ext 10)
             Address     0000.0000.0002
             Hello Time  2 sec  Max Age 20 sec  Forward Delay 15 sec

Interface           Role Sts Cost      Prio.Nbr Type
------------------- ---- --- --------- -------- --------------------------------
Gi0/1               Root FWD 4         128.1    P2p
Gi0/2               Desg FWD 4         128.2    P2p
Gi0/3               Altn BLK 19        128.3    P2p

SW3# show spanning-tree root

 VLAN   Root ID          Root Port      Cost   Hello MaxAge FwdDelay
 ----   ---------------  -------------  ----   ----- ------- --------
 10     24586 0000.0000.0003  Gi0/1        4      2     20      15
 20     32788 0000.0000.0002  Gi0/2        4      2     20      15

SW1# show spanning-tree interface GigabitEthernet0/1
Port 1 (GigabitEthernet0/1) of VLAN0010 is designated forwarding
   Port path cost 4, Port priority 128, Port Identifier 128.1
   Designated root has priority 24586, address 0000.0000.0003
   Designated bridge has priority 32778, address 0000.0000.0001
   Timers: message age 0, forward delay 0, hold 0
   Link type is point-to-point by default
   PortFast                        : enabled
   BPDU Guard                     : enabled (platform-dependent display)
   BPDU: sent 120, received 0

SW1# show spanning-tree summary
Switch is in rapid-pvst mode
Root bridge for: none
PortFast Default                   : disabled
PortFast BPDU Guard Default        : disabled
Spanning tree is configured on all VLANs

SW1# show spanning-tree blockedports

Name                 Blocked Interfaces List
-------------------- ------------------------
VLAN0010             Gi0/3
VLAN0020             Gi0/2

SW1# show running-config interface GigabitEthernet0/1
interface GigabitEthernet0/1
 switchport mode access
 spanning-tree portfast
 spanning-tree bpduguard enable
end`,
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'تنبيه تعليمي صريح',
          text: 'كل المخرجات أعلاه representative educational examples وليست التقاطاً من hardware حقيقي. قد تظهر `Altn BLK` في IOS رغم أن Rapid STP يسمي الحالة Discarding؛ العرض يعتمد على المنصة والإصدار. تحقق دائماً من جهازك ووثائق المنصة.',
        },
      ],
    },
    {
      id: 'summary',
      title: 'Troubleshooting, Practical Labs, and CCNA Exam Review',
      short: 'اللابات والمراجعة',
      blocks: [
        {
          type: 'paragraph',
          text: '**Lab 1 - STP Root Bridge Election (Packet Tracer-style / conceptual)**',
        },
        { type: 'table', headers: ['Device', 'Ports', 'Connected To', 'Scope'], rows: lab1Rows },
        {
          type: 'steps',
          items: [
            { title: 'Topology', text: 'ثلاثة سويتشات Cisco في مثلث، VLAN واحد. تمرين Packet Tracer-style ولم يُنفّذ فعلياً.' },
            { title: 'Task 1', text: 'افحص الـ root الحالي بـ `show spanning-tree`.' },
            { title: 'Task 2', text: 'اعرض Bridge IDs وقارن الأولويات وعناوين MAC.' },
            { title: 'Task 3', text: 'حدد Root Port على كل سويتش غير root.' },
            { title: 'Task 4', text: 'حدد Designated Port على كل segment.' },
            { title: 'Task 5', text: 'حدد Alternate Port والمسار الذي لا يرسل حركة مستخدم.' },
            { title: 'Task 6', text: 'افحص port states بـ `show spanning-tree vlan 10` و`show spanning-tree blockedports`.' },
            { title: 'Task 7', text: 'غيّر الأولوية بـ `spanning-tree vlan 10 priority 4096` على السويتش المطلوب.' },
            { title: 'Task 8', text: 'أعد الفحص وتأكد من تغيّر الـ Root Bridge حسب أقل Bridge ID.' },
            { title: 'Task 9', text: 'اشرح لماذا مسار احتياطي واحد لم يعد forwarding بعد التغيير.' },
            { title: 'Honesty note', text: 'لم يتم تنفيذ اللاب فعلياً؛ النتائج متوقعة تعليمياً.' },
          ],
        },
        {
          type: 'paragraph',
          text: '**Lab 2 - Rapid PVST+ and Link Failure (Packet Tracer-style / conceptual)**',
        },
        { type: 'table', headers: ['VLAN', 'Root Bridge', 'Active Path', 'Logical View'], rows: lab2Rows },
        {
          type: 'steps',
          items: [
            { title: 'Topology', text: 'ثلاثة سويتشات وVLAN 10 وVLAN 20 مع مسارات فيزيائية زائدة. تمرين تعليمي ولم يُشغّل.' },
            { title: 'Task 1', text: 'فعّل Rapid PVST+ حيث يدعم الجهاز ذلك وتحقق من `show spanning-tree summary`.' },
            { title: 'Task 2', text: 'افحص `show spanning-tree vlan 10` وحدد الـ root والأدوار والحالات.' },
            { title: 'Task 3', text: 'افحص `show spanning-tree vlan 20` وقارن النتيجة بـ VLAN 10.' },
            { title: 'Task 4', text: 'حدد Root Port وDesignated Port وAlternate Port لكل VLAN.' },
            { title: 'Task 5', text: 'حاكِ فشل رابط Root Port وتوقع انتقال Alternate إلى Forwarding.' },
            { title: 'Task 6', text: 'أعد الوصل ولاحظ عودة الطوبولوجيا المستقرة.' },
            { title: 'Task 7', text: 'اشرح الفرق بين تقارب Rapid STP و802.1D الكلاسيكي دون ادعاء أرقام ثابتة.' },
            { title: 'Honesty note', text: 'ليست كل صور Packet Tracer أو كل المنصات تدعم كل ميزات Rapid PVST+ أو كل الأوامر؛ تحقق من الدعم المحلي.' },
          ],
        },
        {
          type: 'paragraph',
          text: '**Lab 3 - PortFast and BPDU Guard (conceptual)**',
        },
        {
          type: 'steps',
          items: [
            { title: 'Topology', text: 'سويتش وصول وPC على منفذ edge، مع سويتش ثانٍ يُدخل كجهاز غير متوقع. لم يُنفّذ فعلياً.' },
            { title: 'Task 1', text: 'طبّق `spanning-tree portfast` على منفذ الـ PC فقط.' },
            { title: 'Task 2', text: 'أضف `spanning-tree bpduguard enable` على نفس المنفذ.' },
            { title: 'Task 3', text: 'اشرح سلوك edge port الطبيعي وانتقاله السريع إلى Forwarding.' },
            { title: 'Task 4', text: 'اشرح ماذا يحدث عند وصول BPDU: إغلاق المنفذ غالباً في err-disabled.' },
            { title: 'Task 5', text: 'افحص الحالة في بيئة تدريب بـ `show spanning-tree summary` أو `show running-config` حيث مدعوم.' },
            { title: 'Task 6', text: 'اشرح لماذا لا تُفعّل PortFast على منفذ يربط سويتشاً بسويتش.' },
            { title: 'Honesty note', text: 'هذا لاب مفاهيمي؛ لم تُطبّق الأوامر على أجهزة حقيقية.' },
          ],
        },
        {
          type: 'paragraph',
          text: '**الأخطاء الشائعة**',
        },
        { type: 'table', headers: ['الخطأ', 'التصحيح'], rows: commonMistakeRows },
        {
          type: 'paragraph',
          text: '**Troubleshooting Workflow**',
        },
        {
          type: 'steps',
          items: [
            { title: '1', text: '**Root Bridge**: حدد الـ root للـ VLAN المتأثر بـ `show spanning-tree vlan <id>`.' },
            { title: '2', text: '**Bridge IDs and priorities**: قارن الأولويات وExtended System ID وعناوين MAC.' },
            { title: '3', text: '**Root Path Cost**: راجع التكلفة المتراكمة على كل مسار نحو الـ root.' },
            { title: '4', text: '**Roles**: حدد Root Port وDesignated Port وAlternate Port لكل VLAN.' },
            { title: '5', text: '**States**: تحقق من Forwarding وDiscarding/Learning و`show spanning-tree blockedports`.' },
            { title: '6', text: '**Rapid PVST+ configuration**: تأكد من الوضع والـ instances بـ `show spanning-tree summary`.' },
            { title: '7', text: '**PortFast وBPDU Guard**: تأكد أنهما على edge ports فقط وليس على روابط السويتشات.' },
            { title: '8', text: '**Recent topology changes**: ابحث عن رابط سقط أو سويتش جديد أو BPDU غير متوقع.' },
            { title: '9', text: '**Physical status**: تحقق أخيراً من حالة الكابل والمنفذ و`show interfaces`.' },
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'الأمانة التعليمية',
          text: 'اللابات Packet Tracer-style أو conceptual ولم تُنفّذ فعلياً. مخرجات الأوامر representative وليست لقطات من hardware، ودعم الميزات يعتمد على المنصة والإصدار.',
        },
        {
          type: 'list',
          items: [
            'STP يمنع حلقات Layer 2 عبر حظر منطقي لمسارات مختارة مع الحفاظ على التكرار الفيزيائي.',
            'الحلقات تسبب broadcast storms وتذبذب جدول MAC وتكرار الإطارات.',
            'BPDUs تحمل Root Bridge ID وRoot Path Cost ومعلومات المرسل لبناء شجرة خالية من الحلقات.',
            'Bridge ID = Priority + Extended System ID + MAC؛ أقل قيمة تفوز بالroot.',
            'غير root يختار root port واحداً لكل instance؛ لكل segment designated port واحد.',
            'Alternate Port مسار بديل غالباً discarding في Rapid PVST+.',
            'Classic 802.1D حالاته خمس؛ Rapid STP حالاته ثلاث: Discarding وLearning وForwarding.',
            'Root Path Cost متراكم والأقل أفضل؛ الافتراضات تعتمد على cost method والسرعة والمنصة.',
            'Rapid PVST+ هو RSTP per-VLAN من Cisco؛ ليس MST.',
            'PortFast للمنافذ الطرفية؛ BPDU Guard يحميها بالـ err-disabled عند وصول BPDU.',
            'التحقق: `show spanning-tree` و`show spanning-tree vlan 10` و`show spanning-tree root` و`show spanning-tree interface GigabitEthernet0/1` و`show spanning-tree summary` و`show spanning-tree blockedports` و`show running-config`.',
          ],
        },
        {
          type: 'paragraph',
          text: '**اختبار CCNA**',
        },
        {
          type: 'paragraph',
          text: 'الاختبار التالي 5 أسئلة، كل سؤال 4 خيارات، وفيه single-choice وmultiple-select. قبل Submission لا تظهر الإجابة الصحيحة؛ بعد Submission يظهر الشرح وتتقفل كل الخيارات ويختفي زر التحقق.',
        },
        {
          type: 'quiz',
          questions: [
            {
              id: 'q1',
              prompt: 'ما الغرض الأساسي من STP في شبكة Layer 2؟',
              options: [
                'منع حلقات Layer 2 عبر حظر منطقي لمسارات مختارة مع إبقاء مسار بديل متاحاً.',
                'زيادة عدد عناوين MAC المتاحة على كل سويتش.',
                'استبدال VLANs بـ routing بين كل السويتشات.',
                'إرسال كل الإطارات على كل الروابط في نفس الوقت لزيادة السرعة.',
              ],
              correctIndex: 0,
              requireSubmit: true,
              explanation:
                'الصح هو **(A)**. STP يبني طوبولوجيا خالية من الحلقات بتعيين بعض المنافذ كمسارات احتياطية غير forwarding، لكنه لا يفصل الرابط فيزيائياً؛ يمكن تنشيط المسار البديل بعد تغيير الطوبولوجيا.',
            },
            {
              id: 'q2',
              prompt: 'أي سويتش يصبح Root Bridge في هذا المثال؟ SW1: priority 32768 / MAC ...01، SW2: 32768 / ...02، SW3: 24576 / ...03',
              options: [
                'SW3، لأن أولويته 24576 هي الأقل.',
                'SW1، لأن MAC الخاص به هو الأقل.',
                'SW2، لأنه في المنتصف.',
                'كل السويتشات بالتساوي لأن الأولوية لا تؤثر.',
              ],
              correctIndex: 0,
              requireSubmit: true,
              explanation:
                'الصح هو **(A)**. تُقارن أولوية الـ Bridge ID أولاً؛ 24576 أقل من 32768، لذلك SW3 هو الـ root. أقل MAC يُستخدم فقط عندما تتساوى الأولويات.',
            },
            {
              id: 'q3',
              kind: 'multiple',
              prompt: 'أي عبارات عن STP Port Roles صحيحة؟ (اختر أكثر من إجابة)',
              options: [
                'Root Port يوجد على سويتش غير root ويوفر أفضل مسار نحو الـ Root Bridge.',
                'لكل network segment designated port واحد لكل spanning-tree instance.',
                'Alternate Port يوفر مساراً بديلاً وقد يكون discarding في Rapid PVST+.',
                'الـ Root Bridge نفسه يختار root port واحداً لكل VLAN.',
              ],
              correctIndices: [0, 1, 2],
              requireSubmit: true,
              explanation:
                'الصح هو **(A) و(B) و(C)**. الـ Root Bridge ليس لديه root port؛ منافذه المتصلة غالباً designated. Alternate Port هو مسار احتياطي يمكن تنشيطه عند فشل المسار الأساسي.',
            },
            {
              id: 'q4',
              kind: 'multiple',
              prompt: 'أي عبارات عن حالات المنافذ صحيحة؟ (اختر أكثر من إجابة)',
              options: [
                'Classic STP في 802.1D يستخدم Blocking وListening وLearning وForwarding وDisabled.',
                'Rapid STP يستخدم Blocking وListening وLearning وForwarding وDisabled أيضاً.',
                'Rapid STP يستخدم Discarding وLearning وForwarding فقط.',
                'في Rapid STP يجمع Discarding سلوك Blocking وListening وDisabled غير Forwarding.',
              ],
              correctIndices: [0, 2, 3],
              requireSubmit: true,
              explanation:
                'الصح هو **(A) و(C) و(D)**. النموذج الخماسي هو 802.1D الكلاسيكي. Rapid STP يختزل الحالات غير Forwarding في Discarding، مع بقاء Learning وForwarding كحالتين منفصلتين.',
            },
            {
              id: 'q5',
              kind: 'multiple',
              prompt: 'أي عبارات عن Rapid PVST+ وPortFast وBPDU Guard صحيحة؟ (اختر أكثر من إجابة)',
              options: [
                'Rapid PVST+ يشغّل spanning-tree instance مستقل لكل VLAN.',
                'PortFast مناسب لمنفذ access متصل بجهاز طرفي ويسرّع انتقاله إلى Forwarding.',
                'BPDU Guard يضع المنفذ غالباً في err-disabled إذا وصل BPDU إلى منفذ محمي.',
                'PortFast يلغي الحاجة إلى STP على كل منافذ السويتش.',
              ],
              correctIndices: [0, 1, 2],
              requireSubmit: true,
              explanation:
                'الصح هو **(A) و(B) و(C)**. Rapid PVST+ per-VLAN، وPortFast للـ edge ports فقط، وBPDU Guard يحميها من BPDU غير متوقع. PortFast لا يلغي STP ولا يُستخدم على روابط switch-to-switch عادية.',
            },
          ],
        },
      ],
    },
  ],
}
