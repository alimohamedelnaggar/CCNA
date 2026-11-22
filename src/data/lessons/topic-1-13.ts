import type { Lesson } from '../types'

const macTableRows: string[][] = [
  ['00:11:22:33:44:55', '1', 'Gi0/1', 'Dynamic'],
  ['AA:BB:CC:DD:EE:FF', '1', 'Gi0/2', 'Dynamic'],
]

const ipVsMacRows: string[][] = [
  ['Layer', 'Layer 3 (network)', 'Layer 2 (data link)'],
  ['Address', 'Logical IP address', 'Physical burned-in MAC address'],
  ['Used by', 'Routers and IP routing', 'Switches for local frame delivery'],
  ['Scope', 'Can change across networks', 'Usually stays with the NIC'],
  ['In an Ethernet frame', 'Inside the payload as part of IP packet', 'Source MAC and Destination MAC in the frame header'],
]

const forwardingRows: string[][] = [
  ['Known unicast', 'Destination MAC found in table', 'Forward only through the associated interface', 'Yes'],
  ['Unknown unicast', 'Destination MAC not found', 'Flood to other eligible ports in the same VLAN', 'Yes'],
  ['Broadcast', 'Destination MAC is FF:FF:FF:FF:FF:FF', 'Flood to other eligible ports in the same VLAN', 'Yes'],
]

const verificationRows: string[][] = [
  ['`show mac address-table`', 'Displays the MAC address table with VLAN, MAC, type, and ports.', 'General verification'],
  ['`show mac address-table dynamic`', 'Displays only dynamically learned entries.', 'Useful after generating traffic'],
  ['`show mac address-table interface gigabitEthernet 0/1`', 'Displays MAC entries learned on that interface.', 'Confirms which MACs are on a port'],
  ['`show interfaces`', 'Displays interface status, speed, duplex, and error counters.', 'Checks Layer 1/Layer 2 health'],
  ['`show interfaces status`', 'Displays a compact port status summary.', 'Quick port overview'],
  ['`show running-config`', 'Displays the active configuration.', 'Confirms configured settings'],
  ['`clear mac address-table dynamic`', 'Removes dynamically learned MAC entries.', 'Forces relearning; does not remove static entries'],
]

const domainRows: string[][] = [
  ['Meaning', 'Area where simultaneous sends can collide', 'Area where a broadcast frame is delivered'],
  ['Hub', 'All ports share one domain', 'All ports share one domain'],
  ['Layer 2 switch', 'Each port is its own domain', 'Ports in the same VLAN share one domain'],
  ['Router', 'Interfaces separate domains', 'Layer 3 boundary separates domains'],
  ['Typical mode', 'Half-duplex allows collisions', 'Full-duplex does not affect broadcast scope'],
]

export const topic113Lesson: Lesson = {
  topicId: '1.13',
  title: 'Switching Concepts',
  description:
    'في الدرس الأخير من Domain 1 هنتعلّم مفاهيم الـ switching: إيه بيعمله السويتش، Ethernet frames وMAC addresses، تعلم الـ MAC من Source MAC، جدول الـ CAM، known unicast وflooding، والفرق بين collision وbroadcast domains. هنراجع أوامر IOS ولابين عمليين و5 أسئلة CCNA.',
  estimatedTime: '~120 دقيقة',
  steps: [
    {
      id: 'what',
      title: 'ما هو الـ Switching وليه محتاجينه؟',
      short: 'مفهوم السويتش',
      blocks: [
        {
          type: 'paragraph',
          text: 'الـ **Network Switch** جهاز يعمل بشكل أساسي على **Layer 2 (Data Link Layer)**. بيوصل أجهزة end devices زي PCs والطابعات والخوادم داخل Ethernet LAN، وبيقرر من عناوين **MAC** إيه اللي يرسل له الـ frame.',
        },
        {
          type: 'paragraph',
          text: 'السويتش بيقرأ الـ **Destination MAC Address** في الـ Ethernet frame، وبعدين يختار المنفذ المناسب. لو العنوان معروف، بيرسل نسخة واحدة للمنفذ الصحيح؛ لو مش معروف أو broadcast، بيعمل flooding داخل نفس الـ VLAN.',
        },
        { type: 'diagram', id: 'hub-vs-switch', caption: 'مقارنة بين hub يكرر الإشارة وسويتش يختار المنفذ.' },
        { type: 'paragraph', text: '**Hub مقابل Switch**' },
        {
          type: 'list',
          items: [
            '**Hub**: يكرر الإشارة لكل المنفذات، كل الأجهزة في نفس الـ collision domain، ومفيش تعلم أو تصفية.',
            '**Switch**: يتعلم عناوين MAC من الـ Source MAC، ويرسل بناءً على Destination MAC.',
            'السويتش بيقلل الـ collisions ويستخدم الـ bandwidth بكفاءة أكبر.',
            'السويتش مش راوتر؛ افتراضياً مش بيوصل بين شبكات IP مختلفة.',
          ],
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'Store-and-Forward Switching',
          text: 'في Store-and-Forward، السويتش يستقبل الـ frame كامل، يفحص الـ FCS للتأكد إنه سليم، وبعدين يرسله. لو الـ FCS غلط، الـ frame يتسقط. دي فكرة مفاهيمية مهمة في CCNA.',
        },
        {
          type: 'paragraph',
          text: 'باختصار: السويتش بيخلّي الـ LAN أسرع وأهدى من الـ hub لأنه بيفصل collision domains وبياخد قرار إرسال ذكي بدل التكرار الأعمى.',
        },
      ],
    },
    {
      id: 'how',
      title: 'Ethernet Frames وMAC Addresses',
      short: 'Frames وMAC',
      blocks: [
        {
          type: 'paragraph',
          text: 'الوحدة اللي السويتش بيتعامل معاها اسمها **Ethernet Frame**. جوّه الـ frame فيه Source MAC وDestination MAC، وده اللي بيسمح للسويتش يتعلم ويرسل على Layer 2.',
        },
        { type: 'diagram', id: 'ethernet-frame-structure', caption: 'حقول Ethernet frame وأهمية Source وDestination MAC وFCS.' },
        { type: 'paragraph', text: '**MAC Address**' },
        {
          type: 'list',
          items: [
            'طولها **48 bit** يعني 6 bytes، وبتكتب hexadecimal زي `00:11:22:33:44:55`.',
            'أول 3 bytes بيسمّوا OUI وبيحددوا الشركة المصنعة.',
            'آخر 3 bytes بيحددوا بطاقة الشبكة أو الجهاز.',
            '**Unicast MAC**: عنوان لجهاز واحد، وأول bit فيه 0.',
            '**Multicast MAC**: عنوان لمجموعة أجهزة، وأول bit فيه 1.',
            '**Broadcast MAC**: `FF:FF:FF:FF:FF:FF` وبيوصل لكل الأجهزة في نفس الـ broadcast domain.',
          ],
        },
        { type: 'diagram', id: 'mac-address-structure', caption: 'مكونات عنوان MAC ونوع العنوان.' },
        { type: 'paragraph', text: '**Source MAC مقابل Destination MAC**' },
        {
          type: 'list',
          items: [
            '**Source MAC**: عنوان المرسل؛ السويتش بيتعلم منه.',
            '**Destination MAC**: عنوان المستقبل؛ السويتش بيستخدمه لاتخاذ قرار الإرسال.',
            'كل frame فيه عنوانين؛ خلطهم هو أكثر غلط شيوعاً في امتحان CCNA.',
          ],
        },
        { type: 'paragraph', text: '**الفرق بين IP Address وMAC Address**' },
        { type: 'table', headers: ['الوجه', 'IP Address', 'MAC Address'], rows: ipVsMacRows },
        {
          type: 'callout',
          tone: 'warning',
          title: 'قاعدة الامتحان',
          text: 'الـ IP بيوصف „إنت مين ومنين لفين“ على Layer 3. الـ MAC بيوصف „إيه البطاقة اللي تستلم الـ frame ده“ على Layer 2. السويتش شغال بالـ MAC، مش بالـ IP.',
        },
      ],
    },
    {
      id: 'packet',
      title: 'كيف السويتش يتعلم عناوين MAC؟',
      short: 'MAC learning',
      blocks: [
        {
          type: 'paragraph',
          text: 'عملية **MAC Learning** بتحصل تلقائياً. السويتش بيشوف الـ Source MAC لأي frame بيوصل، وبيسجّل إن العنوان ده وراء المنفذ اللي جاء منه.',
        },
        { type: 'diagram', id: 'mac-learning-process', caption: 'الخطوات من وصول الإطار حتى تحديث الجدول وفحص الوجهة.' },
        { type: 'paragraph', text: '**الخطوات بالترتيب**' },
        {
          type: 'steps',
          items: [
            { title: '1 - Arrival', text: 'الإطار بيوصل علىinterface من الـ switch.' },
            { title: '2 - Read Source MAC', text: 'السويتش بيقرأ Source MAC من الـ frame.' },
            { title: '3 - Associate', text: 'بيربط الـ Source MAC بالمنفذ الداخل.' },
            { title: '4 - Update Table', text: 'بيضيف أو يحدّث الإدخال في الـ MAC address table.' },
            { title: '5 - Check Destination MAC', text: 'بيفحص عنوان الوجهة في الجدول.' },
            { title: '6 - Decide', text: 'يقرر forward أو filter أو flood حسب نوع العنوان ونتيجة البحث.' },
          ],
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'أهم قاعدة في Topic 1.13',
          text: 'السويتش بيتعلم من **Source MAC Address** فقط، مش من Destination MAC. الـ Destination MAC بيُستخدم بعد كده في قرار الإرسال.',
        },
        { type: 'paragraph', text: '**Dynamic وStatic وAging**' },
        {
          type: 'list',
          items: [
            '**Dynamic learning**: الإدخالات بتتعمل تلقائياً لما السويتش يشوف Source MAC جديد.',
            '**Static entries**: إدخال بيضيفه المسؤول يدوياً؛ مفاهيمياً بيفضل ثابتاً ومش بيمشي بالـ aging الطبيعي.',
            '**Aging**: كل إدخال dynamic له timer؛ لو مفيش حركة من العنوان، الإدخال بيتشال.',
            '**Device move**: لو جهاز نقل لمنفذ تاني، السويتش بيتعلم من Source MAC الجديد ويحدّث الـ port المرتبط بالعنوان.',
          ],
        },
        {
          type: 'paragraph',
          text: 'مثال: PC-A بعت من Gi0/1، فالسويتش سجّلMAC بتاعه على Gi0/1. بعدين PC-B ردّ من Gi0/2، فالسويتش سجّل MAC بتاع PC-B على Gi0/2. دلوقتي يقدر يبعت known unicast مباشرة بين المنفذين.',
        },
      ],
    },
    {
      id: 'config',
      title: 'جدول العناوين MAC Address Table (CAM Table)',
      short: 'CAM table',
      blocks: [
        {
          type: 'paragraph',
          text: 'الـ **MAC Address Table**، ويسمّوه كمان **CAM Table**، بيخزّن العلاقة بين عنوان MAC والـ VLAN والمنفذ. السويتش بيستخدم الجدول ده عشان يقرر فين يبعت الـ frame.',
        },
        { type: 'diagram', id: 'mac-address-table', caption: 'أعمدة جدول MAC وإدخالات dynamic وstatic.' },
        { type: 'paragraph', text: '**مثال واقعي للجدول**' },
        { type: 'table', headers: ['MAC Address', 'VLAN', 'Interface', 'Type'], rows: macTableRows },
        { type: 'paragraph', text: '**إيه اللي بيحتويه الجدول؟**' },
        {
          type: 'list',
          items: [
            '**MAC Address**: عنوان الجهاز اللي جاء منه المصدر في الإطار.',
            '**VLAN**: الـ VLAN اللي العنوان اتعلم جوّه؛ هنا كـ context بس.',
            '**Interface / Port**: المنفذ اللي السويتش شوف منه العنوان.',
            '**Type**: dynamic أو static.',
            '**Aging Timer**: الوقت المتبقي قبل ما الإدخال Dynamic يتشال.',
          ],
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'كيف يُستخدم الجدول؟',
          text: 'لو الـ Destination MAC موجود في الجدول، السويتش يرسل للمنفذ المذكور فقط. لو مش موجود، يبقى unknown unicast ويحصل flooding داخل نفس الـ VLAN.',
        },
        {
          type: 'paragraph',
          text: 'في سويتش حقيقي الجدول فيه آلاف الإدخالات. الأوامر اللي جاية في الخطوة 8 بتعرض نفس الفكرة بطريقة عملية.',
        },
      ],
    },
    {
      id: 'verify',
      title: 'إرسال الإطارات وتصفيتها',
      short: 'Forwarding',
      blocks: [
        {
          type: 'paragraph',
          text: 'السويتش عنده ثلاث حالات أساسية: **Known Unicast** و**Unknown Unicast** و**Broadcast**. الفرق بينهم هو نتيجة البحث في جدول MAC ونوع الـ Destination MAC.',
        },
        { type: 'paragraph', text: '**1 - Known Unicast**' },
        {
          type: 'paragraph',
          text: 'لو الـ Destination MAC موجود في الجدول، السويتش يرسل الإطار من المنفذ المرتبط بيه فقط. المنفذ الداخل مستبعد، وباقي المنفذات مبتاخدش نسخة.',
        },
        { type: 'diagram', id: 'known-unicast-forwarding', caption: 'إرسال known unicast لمنفذ واحد فقط مع استبعاد المنفذ الداخل.' },
        { type: 'paragraph', text: '**ملخص الحالات الثلاث**' },
        { type: 'table', headers: ['الحالة', 'كيف يتعرف عليها السويتش؟', 'الإجراء', 'المنفذ الداخل مستبعد؟'], rows: forwardingRows },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Filtering',
          text: 'Filtering معناه إن السويتش **ميرسلش** الإطار من منفذ معين. في known unicast، الإطار ما بيرجعش للمنفذ اللي جاء منه، ومش بيتبعت لباقي المنفذات.',
        },
        {
          type: 'paragraph',
          text: 'يعني بشكل طبيعي Layer 2 switching **مش** بيرسل كل إطار لكل منفذ. Flooding بيحصل بس في حالات محددة: unknown unicast وbroadcast وmulticast حسب السيناريو.',
        },
      ],
    },
    {
      id: 'mistakes',
      title: 'Unknown Unicast وBroadcast Flooding',
      short: 'Flooding',
      blocks: [
        {
          type: 'paragraph',
          text: '**Unknown Unicast** معناه إن الـ Destination MAC هو unicast حقيقي بس مش موجود في الجدول لسه. السويتش يبعت نسخ لكل المنفذات المؤهلة التانية في نفس الـ VLAN ويستبعد المنفذ الداخل.',
        },
        { type: 'diagram', id: 'unknown-unicast-flooding', caption: 'Flooding لـ unknown unicast مع استبعاد المنفذ الداخل.' },
        {
          type: 'paragraph',
          text: 'بعد ما الجهاز المستهدف يرد، السويتش يشوف Source MAC بتاعه ويتعلمه. كده الإرسال اللي بعده يبقى known unicast ومباشر.',
        },
        {
          type: 'paragraph',
          text: '**Broadcast** هو عنوان خاص: `FF:FF:FF:FF:FF:FF`. السويتش دايماً يفضّ broadcast لكل المنفذات المؤهلة التانية جوّه نفس الـ VLAN، زي ARP request.',
        },
        { type: 'diagram', id: 'broadcast-flooding', caption: 'Broadcast flooding داخل نفس broadcast domain.' },
        { type: 'paragraph', text: '**قواعد Flooding**' },
        {
          type: 'list',
          items: [
            'المنفذ اللي جاء منه الإطار مستبعد دايماً من الـ flooding.',
            'المنفذات المؤهلة هي المنفذات في نفس الـ VLAN والمسموح لها بتمرير الحركة.',
            'Unknown unicast مش broadcast؛ الأول DMAC unicast مش معروف، والتاني DMAC كله FF.',
            'كل ما قلّت الـ flooding، قلّت حركة الـ traffic الزائدة على الـ LAN.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'لا تخلط بينهم',
          text: 'Unknown unicast = „ما أعرفش فين العنوان ده“. Broadcast = „عامل copy لكل حد في الـ VLAN“. الاتنين بيعملوا flooding، بس السبب مختلف.',
        },
      ],
    },
    {
      id: 'lab',
      title: 'Collision Domains مقابل Broadcast Domains',
      short: 'Domains',
      blocks: [
        {
          type: 'paragraph',
          text: '**Collision Domain** هي المنطقة اللي لو اتنين أجهزة بعتوا فيها في وقت واحد ممكن يحصل collision. الـ hub كله domain واحد؛ أما السويتش فكل منفذ collision domain مستقل في الـ switched Ethernet الطبيعي.',
        },
        { type: 'diagram', id: 'collision-domains', caption: 'Hub domain واحد مقابل سويتش بمنفذ لكل collision domain.' },
        { type: 'paragraph', text: '**Full-Duplex مقابل Half-Duplex**' },
        {
          type: 'list',
          items: [
            '**Half-Duplex**: مسار واحد للإرسال والاستقبال؛ collisions ممكنة، وزي ما بيحصل مع hub.',
            '**Full-Duplex**: مسار منفصل للإرسال ومسار منفصل للاستقبال؛ مفيش collision على الـ link.',
            'منافذ السويتش الحديثة غالباً بتتفاوض تلقائياً على full-duplex.',
            'Duplex mismatch يسبب أخطاء؛ افحص بـ `show interfaces`.',
          ],
        },
        { type: 'diagram', id: 'full-half-duplex', caption: 'مسار مشترك في half-duplex ومسارين منفصلين في full-duplex.' },
        {
          type: 'paragraph',
          text: '**Broadcast Domain** هي المنطقة اللي لو جهاز بعت broadcast كل الأجهزة فيها تستلم copy. السويتش بيمرّر broadcast بين منافذ نفس الـ VLAN، والـ router هو اللي بيوقفه عند حد Layer 3.',
        },
        { type: 'diagram', id: 'broadcast-domains', caption: 'سويتش يمرر broadcast داخل VLAN والراوتر يوقفه عند الحد.' },
        { type: 'paragraph', text: '**جدول المقارنة**' },
        { type: 'table', headers: ['الوجه', 'Collision Domain', 'Broadcast Domain'], rows: domainRows },
        {
          type: 'callout',
          tone: 'danger',
          title: 'غلط شائع جداً',
          text: 'السويتش بيفصل **collision domains** لكل منفذ، بس **مش** بيعمل broadcast domain لكل منفذ تلقائياً. منافذ نفس الـ VLAN في نفس الـ broadcast domain. الـ VLAN والتفعيل بتاعه هتتفصل في Domain 2.',
        },
      ],
    },
    {
      id: 'exam',
      title: 'إعداد IOS وتحقق ولاب عملية',
      short: 'IOS ولاب',
      blocks: [
        {
          type: 'paragraph',
          text: 'المخرجات هنا **أمثلة تعليمية** مش نتيجة تنفيذ على جهاز Cisco حقيقي. الأمر نفسه ممكن يختلف شكله قليلاً حسب المنصة وإصدار IOS، بس الفكرة واحدة: فحص الجدول والواجهات وتتبع الـ learning.',
        },
        {
          type: 'code',
          label: 'Representative Cisco IOS verification commands',
          language: 'text',
          code: `show mac address-table
show mac address-table dynamic
show mac address-table interface gigabitEthernet 0/1
show interfaces
show interfaces status
show running-config
clear mac address-table dynamic`,
        },
        { type: 'table', headers: ['الأمر', 'الغرض', 'ملاحظة'], rows: verificationRows },
        { type: 'paragraph', text: '**مثال تعليمي لتعلم MAC**' },
        {
          type: 'steps',
          items: [
            { title: '1', text: 'PC-A بعت frame من Gi0/1 بـ Source MAC 00:11:22:33:44:55.' },
            { title: '2', text: 'السويتش تعلّم 00:11:22:33:44:55 على Gi0/1.' },
            { title: '3', text: 'PC-B ردّ من Gi0/2 بـ Source MAC AA:BB:CC:DD:EE:FF.' },
            { title: '4', text: 'السويتش تعلّم AA:BB:CC:DD:EE:FF على Gi0/2.' },
            { title: '5', text: 'دلوقتي الإرسال بين PC-A وPC-B known unicast ومباشر.' },
          ],
        },
        {
          type: 'code',
          label: 'Educational example - not captured from a real Cisco device',
          language: 'text',
          code: `Switch# show mac address-table dynamic

  VLAN    MAC Address       Type     Ports
----    -----------       --------  -----
   1    0011.2233.4455    DYNAMIC   Gi0/1
   1    aabb.ccdd.eeff    DYNAMIC   Gi0/2

Switch# show mac address-table interface gigabitEthernet 0/1

  VLAN    MAC Address       Type     Ports
----    -----------       --------  -----
   1    0011.2233.4455    DYNAMIC   Gi0/1`,
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'تنبيه تعليمي',
          text: 'الـ output بالأعلى مثال توضيحي فقط ولم يُنفّذ على جهاز حقيقي. صيغة العرض قد تختلف حسب IOS/platform/version. `clear mac address-table dynamic` بيشيل الإدخالات المتعلّمة بس، مش static.',
        },
        { type: 'paragraph', text: '**Lab 1 - MAC Address Learning (Packet Tracer-style / conceptual)**' },
        {
          type: 'steps',
          items: [
            { title: 'Topology', text: 'سويتش واحد و3 PCs: PC-A على Gi0/1، PC-B على Gi0/2، PC-C على Gi0/3.' },
            { title: 'Task 1', text: 'افحص `show mac address-table` قبل أي حركة. غالباً هتلاقي إدخالات قليلة أو فاضية حسب الحالة.' },
            { title: 'Task 2', text: 'اعمل ping أو أرسل حركة بين PC-A وPC-B.' },
            { title: 'Task 3', text: 'افحص الجدول تاني. لازم تشوف Source MAC بتاع PC-A على Gi0/1 وSource MAC بتاع PC-B على Gi0/2.' },
            { title: 'Task 4', text: 'حدّد الإدخالات اللي اتعلمت واكتب نوعها Dynamic.' },
            { title: 'Task 5', text: 'فسّر السبب: السويتش تعلّم من Source MAC لما الـ frames وصلت، مش من الـ ping نفسه كعنوان IP.' },
            { title: 'Expected', text: 'بعد أول رد، الإرسال بين PC-A وPC-B يبقى known unicast.' },
          ],
        },
        { type: 'paragraph', text: '**Lab 2 - Forwarding وFlooding (Packet Tracer-style / conceptual)**' },
        {
          type: 'steps',
          items: [
            { title: 'Topology', text: 'سويتش واحد و4 PCs على Gi0/1 إلى Gi0/4، كلهم في نفس الـ VLAN.' },
            { title: 'Known unicast', text: 'بعد تبادل حركة بين PC-A وPC-B، ابعت frame تاني. النتيجة: نسخة واحدة على Gi0/2 بس.' },
            { title: 'Unknown unicast', text: 'امسح الإدخالاتDynamic بـ `clear mac address-table dynamic`، وبعدين ابعت لـ MAC غير معروف. النتيجة: نسخ لكل المنفذات التانية في نفس الـ VLAN.' },
            { title: 'Broadcast', text: 'ابعت broadcast زي ARP request. النتيجة: نسخ لكل المنفذات التانية في نفس الـ VLAN.' },
            { title: 'Incoming port', text: 'لاحظ إن المنفذ اللي جاء منه الإطار مستبعد في كل حالات الـ flooding.' },
            { title: 'Troubleshooting Q1', text: 'لو PC-B ماستلمش الحركة، هل العنوان اتعلم صح في الجدول؟' },
            { title: 'Troubleshooting Q2', text: 'هل PC-A وPC-B في نفس الـ VLAN؟ لو لا، الـ flooding مش هيوصلهم.' },
            { title: 'Troubleshooting Q3', text: 'هل فيه duplex/speed mismatch أو إدخال static غلط في الجدول؟' },
            { title: 'Honesty note', text: 'اللابين دول Packet Tracer-style conceptual. مفيش ادعاء إنهم اتشغّلوا فعلياً في Packet Tracer.' },
          ],
        },
      ],
    },
    {
      id: 'summary',
      title: 'مراجعة CCNA والأخطاء الشائعة',
      short: 'المراجعة',
      blocks: [
        { type: 'paragraph', text: '**الأخطاء الشائعة**' },
        {
          type: 'list',
          items: [
            'تعليم الـ MAC من Destination بدل Source. التصحيح: التعلم دايماً من Source MAC.',
            'الافتراض إن السويتش دايماً يعمل flooding. التصحيح: لو الوجهة معروفة، بيرسل لمنفذ واحد.',
            'خلط Unknown Unicast مع Broadcast. التصحيح: الأول unicast مش معروف، والتاني DMAC = FF:FF:FF:FF:FF:FF.',
            'خلط Collision Domain مع Broadcast Domain. التصحيح: السويتش بيفصل collision domains لكل منفذ، مش broadcast domains.',
            'الافتراض إن كل منفذ سويتش broadcast domain منفصل. التصحيح: منافذ نفس الـ VLAN في نفس الـ domain.',
            'قراءة الجدول غلط: لازم تنظر لـ VLAN والمنفذ والنوع مش MAC بس.',
            'نسيان الـ aging: الإدخالات Dynamic ممكن تختفي ويتعلموا تاني بعد ما الجهاز يبعت.',
          ],
        },
        { type: 'paragraph', text: '**Troubleshooting Workflow**' },
        {
          type: 'steps',
          items: [
            { title: '1 - Confirm physical/link', text: 'افحص `show interfaces status` و`show interfaces` للـ speed وduplex والأخطاء.' },
            { title: '2 - Check the table', text: 'استخدم `show mac address-table` وشوف MAC بتاع الجهاز على المنفذ المتوقع.' },
            { title: '3 - Scope by port', text: 'استخدم `show mac address-table interface gigabitEthernet 0/1` لتأكيد إيه السويتش متعلم على المنفذ.' },
            { title: '4 - Generate traffic', text: 'لو مفيش إدخال، اعمل حركة من الجهاز عشان Source MAC يظهر.' },
            { title: '5 - Decide the case', text: 'هل الوجهة known unicast ولا unknown unicast ولا broadcast؟' },
            { title: '6 - Check VLAN context', text: 'تأكد إن الأجهزة في نفس الـ VLAN؛ تفاصيل الـ VLAN في Domain 2.' },
            { title: '7 - Relearn carefully', text: '`clear mac address-table dynamic` مفيد للاختبار، بس بيعمل relearning مؤقت.' },
          ],
        },
        { type: 'paragraph', text: '**أهم 8 نقاط قبل الامتحان**' },
        {
          type: 'list',
          items: [
            'السويتش Layer 2 ويتخذ القرار من Destination MAC.',
            'التعلم بيحصل من Source MAC.',
            'الإطار فيه Source MAC وDestination MAC جوّه Ethernet frame.',
            'الجدول بيحتوي MAC وVLAN وInterface وType وAging.',
            'Known unicast يروح لمنفذ واحد فقط.',
            'Unknown unicast وbroadcast يتعملهم flooding داخل نفس الـ VLAN.',
            'المنفذ الداخل مستبعد من الـ flooding.',
            'السويتش بيفصل collision domains، والـ router أو VLAN boundaries بيفصلوا broadcast domains.',
          ],
        },
        { type: 'paragraph', text: '**اختبار CCNA**' },
        {
          type: 'paragraph',
          text: 'كل سؤال أربع إجابات. بعد الاختيار اضغط **تحقق من الإجابة**. قبل Submission مفيش feedback، وبعد Submission الأزرار بتتقفل ويظهر الشرح.',
        },
        {
          type: 'quiz',
          questions: [
            {
              id: 'q1',
              prompt: 'من أي جزء في Ethernet frame يتعلم السويتش عنوان MAC؟',
              options: [
                'من Destination MAC فقط.',
                'من Source MAC.',
                'من عنوان IP داخل الـ payload.',
                'من حقل FCS.',
              ],
              correctIndex: 1,
              requireSubmit: true,
              explanation:
                'الصح هو **(B)**. السويتش بيقرأ Source MAC لأي إطار بيوصل ويربطه بالمنفذ الداخل. الـ Destination MAC بيُستخدم بعدين لاتخاذ قرار الإرسال.',
            },
            {
              id: 'q2',
              kind: 'multiple',
              prompt: 'أي عبارات عن Known Unicast صحيحة؟ (اختر أكثر من إجابة)',
              options: [
                'الـ Destination MAC موجود في جدول العناوين.',
                'السويتش يرسل الإطار من المنفذ المرتبط بالعنوان فقط.',
                'المنفذ اللي جاء منه الإطار مستبعد.',
                'السويتش يرسل نسخة لكل منفذ في الـ VLAN.',
              ],
              correctIndices: [0, 1, 2],
              requireSubmit: true,
              explanation:
                'الصح هو **(A) و(B) و(C)**. في known unicast السويتش يعرف مكان Destination MAC، فيرسل نسخة واحدة للمنفذ الصحيح ومش يرجعها للمنفذ الداخل، ومش بيعمل flooding.',
            },
            {
              id: 'q3',
              prompt: 'إيه الـ Destination MAC اللي بيستخدم في Ethernet broadcast؟',
              options: [
                '00:00:00:00:00:00',
                '01:00:5E:00:00:01',
                'FF:FF:FF:FF:FF:FF',
                '127.0.0.1',
              ],
              correctIndex: 2,
              requireSubmit: true,
              explanation:
                'الصح هو **(C)**. عنوان الـ Ethernet broadcast هو `FF:FF:FF:FF:FF:FF`. السويتش يفضّه لكل المنفذات المؤهلة التانية في نفس الـ VLAN.',
            },
            {
              id: 'q4',
              kind: 'multiple',
              prompt: 'أي عبارات عن collision وbroadcast domains صحيحة؟ (اختر أكثر من إجابة)',
              options: [
                'كل منفذ سويتش في الغالب collision domain مستقل.',
                'منافذ نفس الـ VLAN في نفس الـ broadcast domain.',
                'الراوتر يفصل broadcast domains.',
                'كل منفذ سويتش broadcast domain منفصل تلقائياً.',
              ],
              correctIndices: [0, 1, 2],
              requireSubmit: true,
              explanation:
                'الصح هو **(A) و(B) و(C)**. السويتش يفصل collision domains لكل منفذ، لكن منافذ نفس الـ VLAN بتفضل في broadcast domain واحد. الـ router هو حد Layer 3 اللي يوقف الـ broadcast.',
            },
            {
              id: 'q5',
              prompt: 'إطار وصل لسويتش والـ Destination MAC مش موجود في الجدول. إيه هو الإجراء الصحيح؟',
              options: [
                'يعمل flooding لكل المنفذات المؤهلة التانية في نفس الـ VLAN ويستبعد المنفذ الداخل.',
                'يسقط الإطار فوراً لأنه مش معروف.',
                'يرسله لكل المنفذات بما فيها المنفذ الداخل.',
                'يحوّله لعنوان IP broadcast.',
              ],
              correctIndex: 0,
              requireSubmit: true,
              explanation:
                'الصح هو **(A)**. ده اسمه unknown unicast: السويتش مش عارف مكان العنوان، فبيرسل نسخ لكل المنفذات المؤهلة في نفس الـ VLAN، باستثناء المنفذ اللي جاء منه الإطار.',
            },
          ],
        },
      ],
    },
  ],
}
