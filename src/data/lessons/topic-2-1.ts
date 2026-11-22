import type { Lesson } from '../types'

const vlanTypeRows: string[][] = [
  ['Data VLAN', 'Carries normal user-generated traffic such as web, email, file sharing, and printing.', 'PCs, laptops, printers', '`switchport access vlan`'],
  ['Voice VLAN', 'Dedicated VLAN for IP phone voice traffic so voice can be separated from user data.', 'IP phones', '`switchport voice vlan`'],
  ['Management VLAN', 'Used to manage network devices such as switches and wireless APs. Introduced here only.', 'Switch or AP management access', 'Device-specific management configuration'],
  ['Default VLAN', 'VLAN 1 on typical Cisco Catalyst switches; ports start here unless an administrator changes them.', 'Unconfigured switch ports', 'Exists by default'],
  ['Native VLAN', 'Introduced only as the untagged VLAN associated with an 802.1Q trunk link.', 'Trunk links between switches', 'Detailed trunk configuration is Topic 2.2'],
]

const createCommandRows: string[][] = [
  ['`enable`', 'Moves from user EXEC to privileged EXEC mode.', 'Configuration commands require privileged access.'],
  ['`configure terminal`', 'Enters global configuration mode.', 'Changes apply to the running configuration of the switch.'],
  ['`vlan 10`', 'Creates VLAN 10 if it does not exist and enters VLAN configuration mode.', 'A VLAN must exist before access ports can be placed in it.'],
  ['`name SALES`', 'Assigns the human-readable name SALES to the current VLAN.', 'Names improve clarity; they do not change how forwarding works.'],
  ['`end`', 'Returns to privileged EXEC mode.', 'Can be used from most configuration modes.'],
]

const assignCommandRows: string[][] = [
  ['`interface GigabitEthernet0/1`', 'Enters interface configuration mode for Gi0/1.', 'All following commands apply only to this physical port.'],
  ['`switchport mode access`', 'Sets the port as a static Layer 2 access port.', 'An access port normally belongs to one data VLAN.'],
  ['`switchport access vlan 10`', 'Places the access port in VLAN 10.', 'This is different from creating VLAN 10 globally.'],
  ['`no shutdown`', 'Ensures the interface is administratively up.', 'A shutdown port cannot forward frames even with correct VLAN settings.'],
  ['`interface range GigabitEthernet0/1 - 4`', 'Enters configuration mode for several interfaces at once.', 'Useful when many ports need the same VLAN assignment.'],
]

const voiceCommandRows: string[][] = [
  ['`vlan 10` / `name DATA`', 'Creates and names the Data VLAN.', 'Carries PC-generated user traffic.'],
  ['`vlan 20` / `name VOICE`', 'Creates and names the Voice VLAN.', 'Carries IP phone voice traffic.'],
  ['`switchport mode access`', 'Keeps the switch port in access mode.', 'A voice VLAN configuration does not make this a normal trunk port.'],
  ['`switchport access vlan 10`', 'Assigns the Data VLAN for the PC behind the phone.', 'This command controls data traffic, not voice traffic.'],
  ['`switchport voice vlan 20`', 'Specifies the Voice VLAN for compatible IP phones.', 'Voice VLAN operation depends on the phone and network configuration.'],
  ['`spanning-tree portfast`', 'Allows an end-device port to move to forwarding quickly.', 'Use only on ports connected to end devices, not switch-to-switch links.'],
]

const verificationRows: string[][] = [
  ['`show vlan brief`', 'Displays VLAN numbers, names, status, and assigned ports.', 'First check after creating VLANs or assigning ports'],
  ['`show vlan id 10`', 'Displays detailed information for one VLAN.', 'Confirms that VLAN 10 exists and which ports are members'],
  ['`show interfaces status`', 'Shows compact port status, VLAN, duplex, and speed.', 'Checks whether the expected ports are connected and in the expected VLAN'],
  ['`show interfaces GigabitEthernet0/1 switchport`', 'Shows switchport mode, access VLAN, voice VLAN, and operational state.', 'Confirms access mode and VLAN membership on a specific port'],
  ['`show running-config interface GigabitEthernet0/1`', 'Shows the configured commands under one interface.', 'Confirms what was actually configured on that port'],
  ['`show mac address-table vlan 10`', 'Shows MAC addresses learned in VLAN 10 and their ports.', 'Confirms that endpoint MACs are being learned in the correct VLAN'],
]

const lab1Rows: string[][] = [
  ['PC-A', 'Gi0/1', '10'],
  ['PC-B', 'Gi0/2', '10'],
  ['PC-C', 'Gi0/3', '20'],
  ['PC-D', 'Gi0/4', '20'],
]

export const topic21Lesson: Lesson = {
  topicId: '2.1',
  title: 'Configure and Verify VLANs',
  description:
    'في أول topic في Domain 2 هنتعلّم إيه الـ VLAN وليه بنستخدمه، وإزاي الـ VLAN بيقسّم الـ Layer 2 broadcast domain على نفس السويتش. هنفرق بين Data وVoice وManagement وDefault وNative VLAN، ونهيّئ access ports وVoice VLANs، ونفهم الاتصال بين الـ VLANs عن طريق Layer 3. هنراجع أوامر التحقق ولابين و5 أسئلة CCNA.',
  estimatedTime: '~120 دقيقة',
  steps: [
    {
      id: 'what',
      title: 'ما هي الـ VLANs وليه محتاجينها؟',
      short: 'المقدمة',
      blocks: [
        {
          type: 'paragraph',
          text: 'الـ **VLAN (Virtual Local Area Network)** هو تقسيم منطقي لشبكة Layer 2 على سويتش فيزيائي واحد. بدل ما كل الأجهزة المتصلة بالسويتش تكون في نفس الشبكة، بنقدر نجمع أجهزة معينة في VLAN ونفصلها عن الباقي حتى لو كانت متصلة بنفس الجهاز.',
        },
        {
          type: 'diagram',
          id: 'physical-vs-vlan-segmentation',
          caption: 'نفس السويتش الفيزيائي: LAN مسطّح مقابل تقسيم منطقي إلى VLANs منفصلة.',
        },
        {
          type: 'paragraph',
          text: 'الـ VLAN موجود عشان الشبكات الحقيقية فيها أقسام مختلفة ومتطلبات مختلفة. في شركة واحدة ممكن تلاقي **HR** و**Finance** و**Sales** و**IT** متصلين بنفس طبقة الـ access، بس مش مفروض كل حركة تظل لكل القسم التاني.',
        },
        {
          type: 'list',
          items: [
            '**تقليل حركة broadcast**: كل VLAN بيفصل الـ broadcast domain، فبroadcast من قسم مش بيوصل لقسم تاني.',
            '**تنظيم أوضح**: بنسمّي VLAN 10 SALES وVLAN 20 HR وVLAN 30 FINANCE مثلًا، فبقى معنى المنفذ واضح.',
            '**عزل منطقي**: أجهزة الأقسام المختلفة مش هتقدر تتكلم مباشرة على Layer 2.',
            '**أساس للأمان**: الـ VLAN بيساعد على الفصل، بس السياسات والتحكم في الوصول التفصيلي بيجي في topics تانية.',
            '**مرونة**: تغيير عضوية جهاز ممكن يتعمل من إعداد المنفذ بدل تغيير الكابلات الفيزيائية.',
          ],
        },
        {
          type: 'diagram',
          id: 'department-vlan-segmentation',
          caption: 'أقسام HR وFinance وSales وIT تتقاسم السويتش وفي نفس الوقت كل قسم في broadcast domain منفصل.',
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'الفكرة الأساسية',
          text: 'الـ VLAN مش سويتش جديد؛ هو **Layer 2 broadcast domain منطقي**. أجهزة نفس الـ VLAN ممكن تتواصل على Layer 2 لما باقي الشروط تكون مكتملة. أجهزة VLANs مختلفة محتاجة **Layer 3 routing**، والسويتش العادي مش بيعمل route بين الـ VLANs تلقائياً.',
        },
      ],
    },
    {
      id: 'how',
      title: 'أساسيات VLAN وكيف تشتغل',
      short: 'الأساسيات',
      blocks: [
        {
          type: 'paragraph',
          text: 'كل VLAN له ** VLAN ID** مميز. في الـ normal range بنستخدم أرقام زي 10 و20 و30، ودي هي الأرقام اللي هتظهر في أوامر التحقق وفي إعداد المنافذ. الـ ID بيحدد أي broadcast domain ينتمي له الإطار.',
        },
        {
          type: 'list',
          items: [
            '**VLAN membership**: المنفذ بيتبع VLAN واحد غالباً في حالة الـ access port.',
            '**VLAN ID**: رقم LOGICAL للـ VLAN، مش عنوان IP ومش رقم منفذ.',
            '**Same VLAN**: الإطار يفضل جوّه نفس الـ VLAN ويتوصل للأعضاء المؤهليين.',
            '**Different VLANs**: مفيش forwarding مباشر على Layer 2؛ لازم راوتر أو Layer 3 switch.',
            '**Untagged frames**: أجهزة الـ end devices زي PCs غالباً بتبعت إطارات بدون VLAN tag؛ السويتش يعرف الـ VLAN من عضوية المنفذ.',
          ],
        },
        {
          type: 'diagram',
          id: 'multiple-vlans-one-switch',
          caption: 'سويتش فيزيائي واحد يحمل عدة VLANs، وكل منفذ access ينتمي إلى VLAN واحد.',
        },
        {
          type: 'paragraph',
          text: 'العلاقة المباشرة هي: **كل VLAN = broadcast domain واحد منفصل**. لما PC يبعت broadcast زي ARP request، السويتش يمرّره للمنافذ المؤهلة في نفس الـ VLAN فقط. لو PC تاني في VLAN تاني، الإطار مش هيوصله لأنه خارج الـ broadcast domain.',
        },
        {
          type: 'diagram',
          id: 'vlans-broadcast-domains',
          caption: 'Broadcast يفضل داخل VLAN واحد ولا يعبر إلى VLAN آخر عن طريق Layer 2 switching.',
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'قاعدة CCNA مهمة',
          text: 'السويتش يتعلم MAC ويتخذ قرار إرسال داخل كل VLAN، لكنه **لا يوجّه** الحزمة بين VLAN وآخر تلقائياً. لو المصدر في VLAN 10 والوجهة في VLAN 20، محتاج جهاز Layer 3 يعمل routing.',
        },
      ],
    },
    {
      id: 'packet',
      title: 'أنواع الـ VLANs',
      short: 'الأنواع',
      blocks: [
        {
          type: 'paragraph',
          text: 'مش كل VLAN له نفس الوظيفة. في CCNA لازم تفرق بين أنواع الـ VLANs اللي بنشوفها في configured networks وفي أسئلة الامتحان.',
        },
        { type: 'table', headers: ['النوع', 'الوظيفة', 'أمثلة', 'إعداد مرتبط'], rows: vlanTypeRows },
        {
          type: 'paragraph',
          text: '**Data VLAN** هي اللي بتحمل حركة المستخدمين العادية: فتح websites، إرسال email، مشاركة ملفات، وطباعة. لما نقول PC-A في VLAN 10، غالباً بنقصد Data VLAN 10.',
        },
        {
          type: 'paragraph',
          text: '**Voice VLAN** مخصّصة لحركة IP phones. الفكرة إن صوت المستخدم يحتاج معالجة وتفضيل مختلف عن حركة بيانات عادية، فبنفصل الصوت عن الـ PC data حتى لو الاتنين خارجين من نفس المنفذ الفيزيائي.',
        },
        {
          type: 'paragraph',
          text: '**Management VLAN** بتُستخدم لإدارة أجهزة الشبكة نفسها، زي الوصول إلى switch management IP. هنا بنعرف الفكرة بس من غير الدخول في تفاصيل إعداد management plane.',
        },
        {
          type: 'paragraph',
          text: '**Default VLAN** على أغلب Catalyst هو VLAN 1. المنافذ default بتكون أعضاء فيه لحد ما المسؤول ينقلها لـ VLANs مخططة. **Native VLAN** مفهوم مرتبط بـ 802.1Q trunk links؛ هنذكره هنا كتعريف فقط والتفصيل في Topic 2.2.',
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'ما تخلطش بين Default وNative',
          text: 'Default VLAN = VLAN 1 اللي المنافذ تبدأ فيه غالباً. Native VLAN = مفهوم خاص بالـ 802.1Q trunk. مش معنى إن المنفذ access بتاعه Native VLAN، ومش لازم نهيّئ أي trunk هنا.',
        },
      ],
    },
    {
      id: 'config',
      title: 'Access Ports وData VLAN',
      short: 'Access',
      blocks: [
        {
          type: 'paragraph',
          text: 'الـ **Access Port** هو منفذ سويتش مُهيّأ لجهاز نهائي واحد غالباً، زي PC أو printer. في الحالة الطبيعية بيحمل **Data VLAN واحد فقط**، والإطار القادم من الجهاز بيكون **untagged**؛ السويتش بيحدّد الـ VLAN من إعداد عضوية المنفذ.',
        },
        {
          type: 'diagram',
          id: 'data-vlan-access-port',
          caption: 'PC-A على Gi0/1 وPC-B على Gi0/2، الاتنين في VLAN 10 ونفس الـ Layer 2 broadcast domain.',
        },
        {
          type: 'paragraph',
          text: 'في المثال ده: **PC-A** متصل بـ **Gi0/1** و**PC-B** متصل بـ **Gi0/2**، والمنفذين مخصّصين لـ **VLAN 10**. لما PC-A يبعت إطار untagged، السويتش يعرف إنه جوّه VLAN 10 لأنه جاء من Gi0/1. وبما إن PC-B كمان في VLAN 10، التوجيه المباشر على Layer 2 ممكن.',
        },
        {
          type: 'list',
          items: [
            'Access port = عضو في Data VLAN واحد في الأحوال الطبيعية.',
            'إطارات الـ end devices على access port بتكون untagged.',
            'السويتش يضيف سياق الـ VLAN داخلياً لاتخاذ قرار الإرسال.',
            'منفذ access ممكن كمان يكون له Voice VLAN configuration مع IP phone متوافق.',
            'Access port مش trunk port؛ الـ trunk بيحمل VLANs متعددة بين أجهزة الشبكة باستخدام tags.',
          ],
        },
        {
          type: 'paragraph',
          text: 'الفرق الأعلى مستوى بين access وtrunk: الـ access بيربط جهاز نهائي بـ VLAN واحد، أما الـ trunk فبيحمل عدة VLANs على نفس الرابط بين سويتشات أو بين سويتش وrouter. الـ trunk و802.1Q والتفاصيل الخاصة بالـ Native VLAN هي Topic 2.2.',
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'استثناء مهم',
          text: 'منفذ access ممكن يدعم Data VLAN وVoice VLAN في نفس الوقت مع IP phone. ده مش معناه إنه trunk عادي؛ دي حالة خاصة بنشرحها في الخطوة 7.',
        },
      ],
    },
    {
      id: 'verify',
      title: 'إنشاء VLANs على Cisco IOS',
      short: 'الإنشاء',
      blocks: [
        {
          type: 'paragraph',
          text: 'لإنشاء VLAN على سويتش Cisco بنروح global configuration mode ونكتب رقم الـ VLAN. لو الـ VLAN مش موجود، الأمر بيضيفه؛ وبعدين نقدر نسمّيه باسم واضح يعبّر عن القسم أو الوظيفة.',
        },
        {
          type: 'code',
          label: 'Creating VLANs on Cisco IOS',
          language: 'text',
          code: `enable
configure terminal

vlan 10
 name SALES

vlan 20
 name HR

vlan 30
 name FINANCE

end`,
        },
        { type: 'table', headers: ['الأمر', 'التأثير', 'ملاحظة'], rows: createCommandRows },
        {
          type: 'diagram',
          id: 'vlan-creation-process',
          caption: 'من privileged EXEC إلى إنشاء VLAN 10 و20 و30 وتسميتها ثم العودة بـ end.',
        },
        {
          type: 'paragraph',
          text: 'دائماً ابدأ بخطة أسماء مفهومة: `SALES` و`HR` و`FINANCE` أو `DATA` و`VOICE`. الاسم مش مطلوب لكي يعمل الـ forwarding، بس بيخلي `show vlan brief` واضح جداً وقت التحقق واستكشاف الأخطاء.',
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'خطوتان مش خطوة واحدة',
          text: 'أمر `vlan 10` بيخلق الـ VLAN في قاعدة بيانات السويتش بس. لحد ما تسند منفذ بـ `switchport access vlan 10`، المنفذ مش هيبقى عضو في VLAN 10.',
        },
      ],
    },
    {
      id: 'mistakes',
      title: 'إسناد منافذ السويتش إلى VLANs',
      short: 'الإسناد',
      blocks: [
        {
          type: 'paragraph',
          text: 'بعد ما الـ VLAN اتخلق، لازم نحدد أي منافذ هتكون أعضاء فيه. بنعمل ده من **interface configuration mode**. أمر الإسناد بيختلف عن أمر الإنشاء: الأول بيضيف الـ VLAN للقاعدة، والتاني بيضع المنفذ جوّه الـ VLAN.',
        },
        {
          type: 'code',
          label: 'Assigning a single access port to VLAN 10',
          language: 'text',
          code: `configure terminal

interface GigabitEthernet0/1
 switchport mode access
 switchport access vlan 10
 no shutdown

end`,
        },
        {
          type: 'code',
          label: 'Using interface range for multiple ports',
          language: 'text',
          code: `interface range GigabitEthernet0/1 - 4
 switchport mode access
 switchport access vlan 10`,
        },
        { type: 'table', headers: ['الأمر', 'التأثير', 'ملاحظة'], rows: assignCommandRows },
        {
          type: 'diagram',
          id: 'port-vlan-assignment',
          caption: 'إعداد Gi0/1 كـ static access وعضو في VLAN 10، مع مثال interface range.',
        },
        {
          type: 'steps',
          items: [
            { title: '1', text: 'تأكد إن الـ VLAN موجود بـ `show vlan brief`.' },
            { title: '2', text: 'ادخل على المنفذ بـ `interface GigabitEthernet0/1`.' },
            { title: '3', text: 'اجعل المنفذ access بـ `switchport mode access`.' },
            { title: '4', text: 'أسنده للـ VLAN بـ `switchport access vlan 10`.' },
            { title: '5', text: 'تأكد إنه مش shutdown بـ `no shutdown`.' },
            { title: '6', text: 'تحقق من النتيجة بـ `show vlan brief` و`show interfaces status`.' },
          ],
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'غلط شائع',
          text: 'لو كتبت `switchport access vlan 10` من غير ما VLAN 10 يكون متخلق، المنفذ مش هيشتغل بالشكل المتوقع. الـ VLAN لازم يتخلق أولاً، وبعدين يُسند له المنفذ.',
        },
      ],
    },
    {
      id: 'lab',
      title: 'Voice VLANs وIP Phones',
      short: 'Voice',
      blocks: [
        {
          type: 'paragraph',
          text: 'الـ IP Phone غالباً فيه **integrated switch** صغير. فيمكن توصل الـ PC خلف الفون، والفون بدوره متصل بمنفذ واحد على السويتش. لازم نفصل حركة الصوت عن حركة الـ PC حتى لو الاتنين خارجين من نفس الكابل.',
        },
        {
          type: 'code',
          label: 'Physical topology',
          language: 'text',
          code: `PC
 |
 |
IP Phone
 |
 |
Switch`,
        },
        {
          type: 'diagram',
          id: 'ip-phone-data-voice-vlan',
          caption: 'PC خلف IP Phone متصل بـ Gi0/5: بيانات PC في Data VLAN 10 وصوت الفون في Voice VLAN 20.',
        },
        {
          type: 'list',
          items: [
            '**PC data traffic** ينتمي إلى Data VLAN 10.',
            '**IP phone voice traffic** ينتمي إلى Voice VLAN 20.',
            'الـ IP Phone بيتعامل مع فصل الصوت عن البيانات قبل ما الإطار يوصل للسويتش.',
            'منفذ السويتش مُهيّأ ليدعم الـ VLANs الاتنين: access/data وvoice.',
            'ده مش trunk عادي؛ `switchport voice vlan 20` إعداد خاص بالفون المتوافق.',
          ],
        },
        {
          type: 'diagram',
          id: 'voice-vlan-traffic-separation',
          caption: 'نفس المنفذ الفيزيائي يحمل حركة بيانات في VLAN 10 وصوت في VLAN 20.',
        },
        {
          type: 'code',
          label: 'Configuring data and voice VLANs on one switch port',
          language: 'text',
          code: `vlan 10
 name DATA

vlan 20
 name VOICE

interface GigabitEthernet0/5
 switchport mode access
 switchport access vlan 10
 switchport voice vlan 20
 spanning-tree portfast`,
        },
        { type: 'table', headers: ['الأمر', 'التأثير', 'ملاحظة'], rows: voiceCommandRows },
        {
          type: 'callout',
          tone: 'danger',
          title: 'التمييز المطلوب في الامتحان',
          text: '`switchport access vlan 10` بيحدد **Data VLAN**. أما `switchport voice vlan 20` فبيحدد **Voice VLAN**. لا توصف المنفذ بأنه trunk عادي لمجرد إنه شغال مع Voice VLAN. الـ CDP أو LLDP-MED ممكن ينقلوا معلومات الـ voice VLAN لفون متوافق، بس ده مجرد ذكر للآلية مش درس مستقل.',
        },
      ],
    },
    {
      id: 'exam',
      title: 'Default VLAN والاتصال بين VLANs',
      short: 'Inter-VLAN',
      blocks: [
        {
          type: 'paragraph',
          text: 'على أغلب سويتشات Cisco Catalyst، كل المنافذ تبدأ في **VLAN 1** unless يتغير إعدادها. يعني لو سويتش جديد ومفيش VLAN plan، كل PCs المتصلين بيكونوا في نفس الـ broadcast domain الافتراضي.',
        },
        {
          type: 'diagram',
          id: 'vlan1-default-assignment',
          caption: 'المنافذ تبدأ في VLAN 1، ثم بننقل المستخدمين إلى VLANs مخططة زي 10 و20 و30.',
        },
        {
          type: 'paragraph',
          text: 'وجود VLAN 1 مش معناه إنه أحسن اختيار لكل شبكة. ترك كل الأجهزة فيه بيلغي فوائد الفصل، وبيخلي حركة broadcast ومحاولات الوصول في نفس المجال. الشبكات المخططة بتستخدم VLANs بأسماء واضحة للمستخدمين والخوادم والضيوف، وتقلل الاعتماد على VLAN 1.',
        },
        {
          type: 'paragraph',
          text: 'لو PC-A في VLAN 10 على Gi0/1 وPC-B في VLAN 20 على Gi0/2، السويتش **مش هيوصل** الإطار مباشرة بينهم. الـ frame محتاج يوصل لجهاز Layer 3 يعمل routing بين الـ VLANs. المصدر والوجهة والمنفذ واضحين في الرسم، والنتيجة: Layer 2 forwarding غير ممكن، وLayer 3 routing مطلوب.',
        },
        {
          type: 'diagram',
          id: 'intervlan-router',
          caption: 'Router-on-a-Stick كفكرة: الراوتر هو الـ gateway ويعمل Layer 3 routing بين VLAN 10 وVLAN 20.',
        },
        {
          type: 'paragraph',
          text: 'في مفهوم **Router-on-a-Stick**، راوتر واحد يقدر يكون الـ gateway لعدة VLANs. الـ PC يبعت لعنوان الـ default gateway بتاع VLAN 10، والراوتر يعمل routing ويخرج الحزمة في VLAN 20. إعداد subinterfaces والـ trunk details مؤجلة ل topic لاحق.',
        },
        {
          type: 'diagram',
          id: 'intervlan-layer3-switch',
          caption: 'Layer 3 switch يستخدم SVIs كـ gateways للـ VLANs ويقوم بالتوجيه داخل نفس الجهاز.',
        },
        {
          type: 'paragraph',
          text: 'الطريقة التانية هي **Layer 3 Switch** مع **SVIs**: virtual Layer 3 interfaces لكل VLAN. SVI VLAN 10 وSVI VLAN 20 يخدموا كـ default gateways، ومحرك التوجيه داخل السويتش يقرر نقل الحزمة بينهم. إعداد SVI بالتفصيل مش جزء من Topic 2.1.',
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'خلاصة مهمة',
          text: 'إنشاء الـ VLANs وإسناد المنافذ بيخلّي كل VLAN broadcast domain منفصل، بس **مش بيخلّيهم يتكلموا مع بعض**. الاتصال بين VLANs محتاج Layer 3 routing: راوتر أو Layer 3 switch.',
        },
      ],
    },
    {
      id: 'summary',
      title: 'التحقق، استكشاف الأخطاء، اللابات، ومراجعة CCNA',
      short: 'المراجعة',
      blocks: [
        {
          type: 'paragraph',
          text: 'المخرجات في هذه الخطوة **أمثلة تعليمية** وليست نتائج تنفيذ على جهاز Cisco حقيقي. شكل الـ output ممكن يختلف حسب المنصة وإصدار IOS، بس المعنى اللي بنقرأه ثابت: هل الـ VLAN موجود؟ هل المنفذ عضو فيه؟ هل المنفذ up؟ وهل اتعلمت عناوين MAC في الـ VLAN الصح؟',
        },
        {
          type: 'code',
          label: 'Cisco IOS verification commands',
          language: 'text',
          code: `show vlan brief
show vlan id 10
show interfaces status
show interfaces GigabitEthernet0/1 switchport
show running-config interface GigabitEthernet0/1
show mac address-table vlan 10`,
        },
        { type: 'table', headers: ['الأمر', 'إيه اللي بيوضّحه؟', 'وقت استخدامه'], rows: verificationRows },
        {
          type: 'code',
          label: 'Educational example - not captured from a real Cisco device',
          language: 'text',
          code: `Switch# show vlan brief

VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Gi0/5, Gi0/6, Gi0/7, Gi0/8
10   SALES                            active    Gi0/1, Gi0/2
20   HR                               active    Gi0/3
30   FINANCE                          active    Gi0/4

Switch# show vlan id 10

VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
10   SALES                            active    Gi0/1, Gi0/2

Switch# show interfaces status

Port      Name      Status       Vlan    Duplex  Speed   Type
Gi0/1     --        connected    10      a-full  a-1000  10/100/1000BaseTX
Gi0/2     --        connected    10      a-full  a-1000  10/100/1000BaseTX
Gi0/3     --        connected    20      a-full  a-1000  10/100/1000BaseTX
Gi0/4     --        disabled     20      auto    auto    10/100/1000BaseTX
Gi0/5     --        connected    1       a-full  a-1000  10/100/1000BaseTX

Switch# show interfaces GigabitEthernet0/1 switchport

Name: Gi0/1
Switchport: Enabled
Administrative Mode: static access
Operational Mode: static access
Access Mode VLAN: 10 (SALES)
Voice VLAN: none

Switch# show running-config interface GigabitEthernet0/1

interface GigabitEthernet0/1
 switchport access vlan 10
 switchport mode access
 no shutdown
end

Switch# show mac address-table vlan 10

   VLAN   MAC Address     Type      Ports
----   -----------     --------  -----
   10   0011.2233.4455  DYNAMIC   Gi0/1
   10   aabb.ccdd.eeff  DYNAMIC   Gi0/2`,
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'تنبيه تعليمي',
          text: 'كل الـ output بالأعلى educational example وليس captured من جهاز حقيقي. استخدم `show vlan brief` و`show vlan id 10` للتأكد من وجود الـ VLAN واسمه، و`show interfaces status` لحالة المنفذ، و`show interfaces GigabitEthernet0/1 switchport` لوضع الـ switchport والـ access VLAN، و`show running-config interface GigabitEthernet0/1` للإعداد المكتوب، و`show mac address-table vlan 10` لتعلم MAC داخل VLAN 10.',
        },
        {
          type: 'code',
          label: 'Educational voice VLAN verification example - not captured from a real Cisco device',
          language: 'text',
          code: `Switch# show running-config interface GigabitEthernet0/5

interface GigabitEthernet0/5
 switchport access vlan 10
 switchport mode access
 switchport voice vlan 20
 spanning-tree portfast
end

Switch# show interfaces GigabitEthernet0/5 switchport

Name: Gi0/5
Switchport: Enabled
Administrative Mode: static access
Operational Mode: static access
Access Mode VLAN: 10 (DATA)
Voice VLAN: 20 (VOICE)`,
        },
        {
          type: 'paragraph',
          text: '**Lab 1 - Create and Assign VLANs (Packet Tracer-style / conceptual)**',
        },
        { type: 'table', headers: ['Device', 'Switch Port', 'VLAN'], rows: lab1Rows },
        {
          type: 'steps',
          items: [
            { title: 'Topology', text: 'سويتش واحد و4 PCs. لم يتم تنفيذ اللاب فعلياً في Packet Tracer؛ ده تمرين Packet Tracer-style تعليمي.' },
            { title: 'Task 1', text: 'اعمل `vlan 10` باسم SALES و`vlan 20` باسم HR.' },
            { title: 'Task 2', text: 'اجعل Gi0/1 وGi0/2 access ports في VLAN 10، وGi0/3 وGi0/4 access ports في VLAN 20.' },
            { title: 'Task 3', text: 'تحقق بـ `show vlan brief` و`show interfaces status`.' },
            { title: 'Task 4', text: 'اشرح أي PCs في نفس الـ broadcast domain: PC-A مع PC-B، وPC-C مع PC-D.' },
            { title: 'Task 5', text: 'اشرح ليه PC-A وPC-C مش هيتكلموا من غير Layer 3 routing.' },
            { title: 'Expected observation', text: 'VLAN 10 يظهر عليه Gi0/1 وGi0/2، وVLAN 20 يظهر عليه Gi0/3 وGi0/4. ping جوّه نفس الـ VLAN ممكن يشتغل بعد إعداد IP صح؛ ping بين VLANs هيفشل لحد ما يتضاف routing.' },
            { title: 'Troubleshooting Q1', text: 'هل الـ VLAN موجود أصلاً في `show vlan brief`؟' },
            { title: 'Troubleshooting Q2', text: 'هل المنفذ في access mode ومسند للـ VLAN الصحيح؟' },
            { title: 'Troubleshooting Q3', text: 'هل المنفذ up أم disabled أو shutdown؟' },
          ],
        },
        {
          type: 'paragraph',
          text: '**Lab 2 - Configure a Voice VLAN (Packet Tracer-style / conceptual)**',
        },
        {
          type: 'steps',
          items: [
            { title: 'Topology', text: 'سويتش واحد، IP Phone، وPC متصل خلف الفون على Gi0/5. تمرين Packet Tracer-style ولم يُنفّذ فعلياً في Packet Tracer.' },
            { title: 'Task 1', text: 'اعمل `vlan 10` باسم DATA للبيانات.' },
            { title: 'Task 2', text: 'اعمل `vlan 20` باسم VOICE للصوت.' },
            { title: 'Task 3', text: 'على Gi0/5 اكتب `switchport mode access`.' },
            { title: 'Task 4', text: 'استخدم `switchport access vlan 10` للـ PC.' },
            { title: 'Task 5', text: 'استخدم `switchport voice vlan 20` للـ IP Phone.' },
            { title: 'Task 6', text: 'تحقق بـ `show vlan brief` و`show running-config interface GigabitEthernet0/5` و`show interfaces GigabitEthernet0/5 switchport`.' },
            { title: 'Task 7', text: 'اشرح إزاي الصوت والبيانات اتفرقوا رغم إنهم خارجين من منفذ فيزيائي واحد.' },
            { title: 'Expected observation', text: 'المنفذ يظهر Data VLAN 10 وVoice VLAN 20. حركة الـ PC في VLAN 10 وحركة الفون في VLAN 20، والمنفذ مش trunk عادي.' },
            { title: 'Troubleshooting Q1', text: 'هل الفون متوافق مع آلية إعلان الـ voice VLAN مثل CDP أو LLDP-MED؟' },
            { title: 'Troubleshooting Q2', text: 'هل الـ Voice VLAN موجود في قاعدة بيانات السويتش؟' },
            { title: 'Troubleshooting Q3', text: 'هل حطّيت الـ PC في access VLAN والفون في voice vlan بشكل صحيح؟' },
            { title: 'Honesty note', text: 'اللاب تعليمي conceptual ولم يُشغّل داخل Packet Tracer.' },
          ],
        },
        {
          type: 'paragraph',
          text: '**الأخطاء الشائعة**',
        },
        {
          type: 'list',
          items: [
            'خلق VLAN ونسي إسناد أي منفذ له. الحل: `switchport access vlan` على المنافذ المطلوبة.',
            'إسناد منفذ للـ VLAN الغلط. الحل: راجع `show vlan brief` و`show interfaces status`.',
            'نسيان `switchport mode access`. الحل: اضبط الوضع صراحة قبل الإسناد.',
            'الخلط بين access port وtrunk port. الحل: access لجهاز نهائي وVLAN واحد، وtrunk لحمل عدة VLANs بين أجهزة الشبكة.',
            'الافتراض إن VLANs مختلفة هتتواصل تلقائياً. الحل: محتاج Layer 3 routing.',
            'الخلط بين Data VLAN وVoice VLAN. الحل: `switchport access vlan` للبيانات و`switchport voice vlan` للصوت.',
            'سوء فهم VLAN 1. الحل: اعرف إنه default غالباً، بس خطّط VLANs واضحة بدل ترك كل حاجة فيه.',
            'إعداد Voice VLAN مع فون غير متوافق. الحل: تأكد من دعم الفون وآلية الإعلان المناسبة.',
            'VLAN mismatch بين جهازين. الحل: طابق أرقام الـ VLAN على الطرفين، خصوصاً في الروابط التي تحمل أكثر من VLAN.',
            'منفذ shutdown أو inactive. الحل: افحص `show interfaces status` واستخدم `no shutdown` عند اللزوم.',
          ],
        },
        {
          type: 'paragraph',
          text: '**Troubleshooting Workflow**',
        },
        {
          type: 'steps',
          items: [
            { title: '1 - Interface status', text: 'ابدأ بـ `show interfaces status` وتأكد إن المنفذ connected/up ومش disabled.' },
            { title: '2 - VLAN existence', text: 'استخدم `show vlan brief` أو `show vlan id 10` وتأكد إن الـ VLAN موجود واسمه صحيح.' },
            { title: '3 - Port assignment', text: 'راجع `show interfaces GigabitEthernet0/1 switchport` و`show running-config interface GigabitEthernet0/1` للتأكد من access mode ورقم الـ VLAN.' },
            { title: '4 - Voice VLAN', text: 'لو فيه IP Phone، تأكد من `switchport voice vlan 20` ومن توافق الفون مع CDP أو LLDP-MED.' },
            { title: '5 - MAC learning', text: 'استخدم `show mac address-table vlan 10` وشوف MAC بتاع الجهاز متعلم على المنفذ المتوقع.' },
            { title: '6 - Layer 3 need', text: 'لو المصدر والوجهة في VLANs مختلفة، اسأل: هل فيه router أو Layer 3 switch SVI يعمل routing؟ لو لا، دي هي المشكلة.' },
          ],
        },
        {
          type: 'paragraph',
          text: '**أهم نقاط المراجعة قبل CCNA**',
        },
        {
          type: 'list',
          items: [
            'VLAN = LOGICAL Layer 2 broadcast domain على سويتش فيزيائي واحد.',
            'كل VLAN broadcast domain منفصل؛ نفس الـ VLAN يتواصل على Layer 2 عندما تكون باقي الشروط مكتملة.',
            'VLANs مختلفة محتاجة Layer 3 routing؛ السويتش مش بيعمل route بينهم تلقائياً.',
            'Access port بيحمل Data VLAN واحد غالباً وإطارات الـ end devices بتكون untagged.',
            '`switchport mode access` بيحدد الوضع و`switchport access vlan 10` بيحدد العضوية.',
            '`vlan 10` بيخلق الـ VLAN globally؛ إسناد المنفذ خطوة منفصلة.',
            '`switchport access vlan 10` للـ PC data و`switchport voice vlan 20` للفون؛ المنفذ مش trunk عادي.',
            'VLAN 1 هو default على أغلب Catalyst؛ Native VLAN مفهوم 802.1Q trunk ويتفصل في Topic 2.2.',
            'Routed connection بين VLANs ممكن تكون Router-on-a-Stick أو Layer 3 switch SVIs.',
            'التحقق العملي: `show vlan brief` و`show vlan id 10` و`show interfaces status` و`show interfaces GigabitEthernet0/1 switchport` و`show running-config interface GigabitEthernet0/1` و`show mac address-table vlan 10`.',
          ],
        },
        {
          type: 'paragraph',
          text: '**اختبار CCNA**',
        },
        {
          type: 'paragraph',
          text: 'كل سؤال أربع إجابات. قبل Submission مفيش feedback، وبعد Submission الأزرار بتتقفل ويظهر الشرح. بعض الأسئلة single وبعضها multiple.',
        },
        {
          type: 'quiz',
          questions: [
            {
              id: 'q1',
              prompt: 'إيه المقصود بـ VLAN في شبكة Layer 2؟',
              options: [
                'Broadcast domain منطقي داخل سويتش فيزيائي واحد.',
                'سويتش فيزيائي جديد لكل قسم.',
                'بروتوكول routing بين الشبكات.',
                'نوع من كابلات Ethernet.',
              ],
              correctIndex: 0,
              requireSubmit: true,
              explanation:
                'الصح هو **(A)**. الـ VLAN تقسيم منطقي على Layer 2 بيخلّي كل مجموعة broadcast domain منفصل على نفس السويتش الفيزيائي.',
            },
            {
              id: 'q2',
              kind: 'multiple',
              prompt: 'أي عبارات عن الـ VLANs والـ broadcast domains صحيحة؟ (اختر أكثر من إجابة)',
              options: [
                'كل VLAN يمثل Layer 2 broadcast domain منفصل.',
                'أجهزة نفس الـ VLAN ممكن تتواصل على Layer 2 لما باقي الشروط تكون مكتملة.',
                'الأجهزة في VLANs مختلفة محتاجة Layer 3 routing.',
                'السويتش العادي يعمل routing تلقائي بين كل الـ VLANs.',
              ],
              correctIndices: [0, 1, 2],
              requireSubmit: true,
              explanation:
                'الصح هو **(A) و(B) و(C)**. الـ VLAN يفصل الـ broadcast domain، والتواصل داخل نفس الـ VLAN ممكن على Layer 2، أما بين VLANs فمحتاج Layer 3. السويتش العادي مش راوتر.',
            },
            {
              id: 'q3',
              prompt: 'أي إعداد يجعل Gi0/1 access port عضو في VLAN 10 بشكل صحيح؟',
              options: [
                '`interface GigabitEthernet0/1` ثم `switchport mode access` ثم `switchport access vlan 10`.',
                '`interface GigabitEthernet0/1` ثم `switchport mode trunk` ثم `switchport access vlan 10`.',
                '`vlan 10` فقط من global configuration mode.',
                '`switchport voice vlan 10` فقط.',
              ],
              correctIndex: 0,
              requireSubmit: true,
              explanation:
                'الصح هو **(A)**. لازم تدخل الـ interface، تضبط الوضع access، وبعدين تسند المنفذ لـ VLAN 10. إنشاء الـ VLAN خطوة منفصلة، و`switchport voice vlan` مش بديل عن الـ data access VLAN.',
            },
            {
              id: 'q4',
              kind: 'multiple',
              prompt: 'أي عبارات عن Voice VLAN صحيحة؟ (اختر أكثر من إجابة)',
              options: [
                '`switchport access vlan 10` يحدد Data VLAN للـ PC.',
                '`switchport voice vlan 20` يحدد Voice VLAN للفون.',
                'IP Phone المتوافق يفصل بين حركة الصوت وبيانات PC من خلال integrated switch مدمج.',
                'أي منفذ عليه Voice VLAN يبقى trunk عادي تلقائياً.',
              ],
              correctIndices: [0, 1, 2],
              requireSubmit: true,
              explanation:
                'الصح هو **(A) و(B) و(C)**. الـ access VLAN للبيانات والـ voice VLAN للصوت، والفون المتوافق بيفصل بينهم. وجود Voice VLAN مش معناه إن المنفذ trunk عادي.',
            },
            {
              id: 'q5',
              prompt: 'PC-A في VLAN 10 وPC-B في VLAN 20 على نفس السويتش. إيه المطلوب عشان يتواصلوا؟',
              options: [
                'زيادة سرعة المنفذين فقط.',
                'Layer 3 routing عن طريق router أو Layer 3 switch SVI.',
                'تغيير الـ MAC address بتاع PC-B.',
                'تعطيل الـ VLANs والرجوع لـ VLAN 1.',
              ],
              correctIndex: 1,
              requireSubmit: true,
              explanation:
                'الصح هو **(B)**. السويتش مش هيمرّر الإطار بين VLANs مختلفة على Layer 2. محتاجين default gateway وLayer 3 routing، إما براوتر أو بـ SVI على Layer 3 switch.',
            },
          ],
        },
      ],
    },
  ],
}
