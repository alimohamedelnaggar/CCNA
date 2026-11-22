import type { Lesson } from '../types'

const etherchannelTermsRows: string[][] = [
  ['Physical interface', 'المنفذ الفيزيائي مثل GigabitEthernet0/1', 'هو الرابط الفعلي الذي يُوصّل بالكابل', 'يسمى أيضاً member link بعد انضمامه للحزمة'],
  ['Member link', 'رابط عضو داخل EtherChannel', 'واحد من الروابط الفيزيائية المجمّعة', 'قد يصبح active أو standby أو suspended حسب الحالة'],
  ['Port-Channel interface', 'الواجهة المنطقية مثل Port-channel1 أو Po1', 'يمثّل الحزمة كلها للطبقات الأعلى', 'يُختصر غالباً إلى Po مع رقم المجموعة'],
  ['Channel-group', 'رقم المجموعة مثل `channel-group 1`', 'يربط المنافذ الفيزيائية بالـ Port-channel', 'لازم يتطابق على كل أعضاء نفس الحزمة وعلى الطرفين غالباً'],
  ['Aggregation', 'تجميع عدة روابط في link واحد', 'يسمح باستخدام عدة مسارات كأنها مسار واحد', 'لا يعني أن حزمة واحدة تُقسّم على كل الروابط'],
  ['EtherChannel', 'اسم Cisco لمجموعة port aggregation', 'الاسم المستخدم في Cisco IOS لهذه التقنية', 'LACP وPAgP و`mode on` طرق مختلفة لتكوينه'],
]

const benefitsRows: string[][] = [
  ['Increased Bandwidth', 'أربع روابط 1 Gbps تعطي حتى 4 Gbps aggregate في الحالة المثالية', 'يعتمد على عدد التدفقات ونمط الحركة والـ hash', 'ليس ضماناً أن كل flow يحصل على 4 Gbps'],
  ['Redundancy', 'فشل عضو واحد لا يكسر الحزمة طالما بقيت أعضاء صالحة كافية', 'الـ Port-channel يبقى up ويعيد تعليم الحركة على الأعضاء المتبقين', 'الحد الأدنى وعدد Standby يعتمد على المنصة'],
  ['Load Distribution', 'الهاش يختار عضواً لكل flow', 'توزيع على مستوى التدفقات لا بالضرورة packet by packet', 'حزم نفس الـ flow تبقى على عضو واحد غالباً'],
  ['Simplified STP', 'STP يرى Port-channel واحداً بدل أربعة مسارات', 'تقل الحاجة لحظر روابط متوازية', 'شرط أن تكون الحزمة مكوّنة بشكل صحيح ومتسق'],
]

const hashRows: string[][] = [
  ['Source MAC', 'يستخدم عنوان MAC المصدر في الحساب', 'خيار بسيط على منصات كثيرة', 'قد لا يوزّع جيداً إن كان المصدر واحداً'],
  ['Destination MAC', 'يستخدم عنوان MAC الوجهة', 'مفيد عندما تكون الوجهات متعددة', 'الخيار يعتمد على المنصة والإصدار'],
  ['Source + Destination MAC', 'يستخدم الطرفين معاً', 'توزيع أدق من MAC واحد', 'شائع في أمثلة Layer 2'],
  ['Source IP', 'يستخدم عنوان IP المصدر', 'مفيد لتدفقات من مضيفين مختلفين', 'متاح حيث تدعم المنصة ذلك'],
  ['Destination IP', 'يستخدم عنوان IP الوجهة', 'مفيد لتدفقات إلى وجهات متعددة', 'قد يكون غير كافٍ إن كانت الوجهة واحدة'],
  ['Source + Destination IP', 'يستخدم زوج IP معاً', 'من أكثر الخيارات شيوعاً في شبكات IP', 'تحقق منه بـ `show etherchannel load-balance`'],
  ['Layer 4 ports', 'يستخدم منفذ TCP/UDP المصدر والوجهة حيث مدعوم', 'يوزّع تدفقات متعددة بين نفس زوج IP', 'ليس متاحاً على كل المنصات أو كل الصور'],
]

const requirementRows: string[][] = [
  ['Speed', 'كل الأعضاء بنفس السرعة', '1000 Mbps مع 100 Mbps في نفس الحزمة', 'خلاف السرعة قد يمنع الانضمام أو يسبب سلوكاً غير متوقع'],
  ['Duplex', 'كل الأعضاء بنفس وضع الـ duplex', 'full مع half', 'تأكد من الحالة الفعلية لا التهيئة فقط'],
  ['Layer 2 / Layer 3', 'كل الأعضاء switchports أو كلها routed ports', 'خلط switchport مع routed interface', 'نوع الـ Port-channel يتبع نوع الأعضاء'],
  ['Access / Trunk', 'كل الأعضاء access أو كلها trunk', 'access على عضو وtrunk على آخر', 'افحص `switchport mode` على كل عضو'],
  ['Access VLAN', 'نفس VLAN على كل منافذ access', 'VLAN 10 مع VLAN 20', 'اختلاف الـ VLAN خطأ شائع في اللابات'],
  ['Native VLAN', 'نفس native VLAN على كل trunks', 'VLAN 99 مع VLAN 100', 'قد يظهر تحذير Native VLAN mismatch'],
  ['Allowed VLAN list', 'نفس قائمة VLANs المسموح بها', 'قائمة مختلفة على عضوين', 'افحص `show interfaces trunk`'],
  ['Trunk encapsulation', 'نفس الـ encapsulation حيث ينطبق', '802.1Q مع ISL على منصة تدعم الاثنين', 'كثير من المنصات الحديثة تدعم 802.1Q فقط'],
  ['Compatible mode', 'LACP مع LACP أو PAgP مع PAgP أو static مع static', 'LACP في طرف وPAgP في الآخر', 'بروتوكول تفاوض مختلف يعني عدم تكوين channel'],
]

const pagpRows: string[][] = [
  ['`auto`', 'Passively waits for PAgP negotiation', 'لا يبدأ التفاوض، يستجيب فقط', 'يحتاج طرفاً desirable ليكوّن الحزمة'],
  ['`desirable`', 'Actively attempts to negotiate PAgP', 'يرسل محاولات تفاوض PAgP', 'يعمل مع desirable أو auto'],
]

const pagpMatrixRows: string[][] = [
  ['desirable', 'desirable', 'Forms', 'كلا الطرفين يبادران بـ PAgP'],
  ['desirable', 'auto', 'Forms', 'الطرف desirable يبدأ والـ auto يستجيب'],
  ['auto', 'auto', 'Does not form', 'لا يوجد طرف يبدأ التفاوض'],
  ['on', 'on', 'Static, no negotiation', '`on` ليس PAgP على الإطلاق'],
]

const lacpRows: string[][] = [
  ['`active`', 'Actively sends LACP negotiation messages', 'يرسل LACPDU ويبدأ التفاوض', 'يعمل مع active أو passive'],
  ['`passive`', 'Responds but does not initiate LACP', 'يستجيب فقط عند وصول LACPDU', 'passive مع passive لا يكوّن الحزمة'],
]

const lacpMatrixRows: string[][] = [
  ['active', 'active', 'Forms', 'كلا الطرفين يرسلان LACPDU'],
  ['active', 'passive', 'Forms', 'الطرف active يبدأ والـ passive يستجيب'],
  ['passive', 'passive', 'Does not form', 'لا أحد يرسل أول LACPDU'],
  ['on', 'on', 'Static, no LACP negotiation', 'لا يوجد تبادل LACPDU'],
]

const lacpIdentityRows: string[][] = [
  ['System ID', 'معرّف النظام المرسل في LACP', 'يُستخدم لمقارنة الطرفين واختيار الشريك', 'يتكوّن من أولوية ومعرّف نظام حسب التنفيذ'],
  ['Port ID', 'معرّف المنفذ العضو', 'يميّز كل عضو داخل نفس النظام', 'يُستخدم في اختيار الأعضاء وترتيبهم'],
  ['Actor / Partner', 'معلومات الطرف المحلي ومعلومات الطرف البعيد', 'يتحقق كل طرف من توافق الطرف الآخر', 'تظهر في `show lacp neighbor` بشكل representative'],
  ['Active members', 'الأعضاء المختارة لحمل الحركة', 'العدد الأقصى يعتمد على المنصة والإصدار', 'لا تفترض رقماً ثابتاً لكل السويتشات'],
  ['Standby links', 'روابط احتياطية في بعض التنفيذات', 'تكون جاهزة إذا فشل عضو active', 'ليست مدعومة بنفس الشكل على كل المنصات'],
]

const verificationRows: string[][] = [
  ['`show etherchannel summary`', 'ملخص المجموعات والبروتوكول وحالة المنافذ والأعلام', 'أول أمر للتحقق السريع من وجود الحزمة وحالة الأعضاء'],
  ['`show etherchannel port-channel`', 'معلومات عن واجهة Port-channel نفسها', 'للتأكد من إنشاء الواجهة المنطقية وخصائصها'],
  ['`show etherchannel detail`', 'تفاصيل أعمق عن المجموعة والأعضاء والبروتوكول', 'عندما تريد معرفة سبب عدم انضمام عضو'],
  ['`show etherchannel load-balance`', 'خوارزمية الـ hash المفعّلة', 'لفهم كيف تُختار member links'],
  ['`show interfaces port-channel 1`', 'حالة وإحصاءات الواجهة المنطقية', 'للتأكد أن Po1 up وتمر عبرها الحركة'],
  ['`show interfaces trunk`', 'حالة الـ trunk وnative VLAN والقائمة المسموح بها', 'للمقارنة بين أعضاء Layer 2 واكتشاف عدم توافق'],
  ['`show lacp neighbor`', 'معلومات جار LACP مثل System ID وPort ID', 'للتحقق من تبادل LACPDU مع الطرف الآخر'],
  ['`show pagp neighbor`', 'معلومات جار PAgP حيث مدعوم', 'للتحقق من التفاوض في حزمة PAgP'],
]

const flagRows: string[][] = [
  ['`S`', 'Layer 2', 'الـ Port-channel يعمل كواجهة switchport تحمل VLANs'],
  ['`R`', 'Layer 3', 'الـ Port-channel واجهة routed تحمل IP'],
  ['`U`', 'In use', 'الحزمة قيد الاستخدام وتستطيع حمل الحركة'],
  ['`P`', 'Bundled in Port-Channel', 'العضو منضم بنجاح إلى الحزمة'],
  ['`I`', 'Stand-alone', 'المنفذ يعمل بمفرده ولم ينضم للحزمة'],
  ['`s`', 'Suspended', 'العضو موقوف داخل الحزمة بسبب عدم توافق أو مشكلة تفاوض'],
]

const lab1Rows: string[][] = [
  ['SW1', 'Gi0/1 - Gi0/2', 'SW2 Gi0/1 - Gi0/2', 'LACP mode active, trunk member links'],
  ['SW2', 'Gi0/1 - Gi0/2', 'SW1 Gi0/1 - Gi0/2', 'LACP mode passive, trunk member links'],
  ['Both', 'Port-channel1', 'Logical bundle', 'Layer 2 Port-channel carrying trunks'],
]

const lab2Rows: string[][] = [
  ['Problem 1', 'Different access VLANs', 'Members cannot join consistently or VLAN forwarding is wrong'],
  ['Problem 2', 'Native VLAN mismatch', 'Trunk members disagree about untagged frames'],
  ['Problem 3', 'Allowed VLAN list mismatch', 'Some members would carry different VLAN sets'],
  ['Problem 4', 'Speed mismatch', 'Members have different physical capabilities or settings'],
  ['Problem 5', 'Duplex mismatch', 'Duplex disagreement can cause errors and inconsistent members'],
  ['Problem 6', 'Different negotiation modes', 'For example active against passive is fine, but passive against passive is not'],
  ['Problem 7', 'LACP against PAgP', 'Different negotiation families cannot negotiate a single channel'],
  ['Problem 8', 'mode on against negotiation', 'Static side does not send messages; negotiated side waits'],
]

const commonMistakeRows: string[][] = [
  ['مودات تفاوض مختلفة', 'active مع passive يعمل، لكن passive مع passive لا يعمل؛ ومع PAgP لازم desirable/auto'],
  ['LACP مقابل PAgP', ' لا يمكن لبروتوكولين مختلفين أن يتفاوضا حزمة واحدة'],
  ['Static مقابل negotiated', '`on` في طرف و`active` أو `desirable` في الآخر'],
  ['Speed / duplex غير متسق', 'افحص الحالة الفعلية واعدّل كلا الطرفين'],
  ['Access VLAN مختلف', 'كل منافذ access في الحزمة لازم تكون على نفس VLAN'],
  ['Native VLAN مختلف', 'تطابق الـ native VLAN على كل أعضاء الـ trunk'],
  ['Allowed VLAN list مختلف', 'قوائم VLANs لازم تكون متطابقة على الأعضاء'],
  ['خلط Layer 2 وLayer 3', 'لا تخلط switchports مع routed ports في نفس الحزمة'],
  ['رقم channel-group غلط', 'نفس الرقم على كل الأعضاء والطرف الآخر غالباً'],
  ['أعضاء suspended أو غير bundled', 'ابحث عن علامة `s` أو `I` في `show etherchannel summary`'],
  ['افتراض أنflow واحد يحصل على كل النطاق', 'الـ hash يبقي الـ flow على عضو واحد غالباً'],
  ['نسيان فحص Port-channel نفسه', 'افحص `show interfaces port-channel 1` وليس الأعضاء فقط'],
]

export const topic24Lesson: Lesson = {
  topicId: '2.4',
  title: 'Configure and Verify EtherChannel (Layer 2 / Layer 3, LACP)',
  description:
    'في Topic 2.4 نتعلم كيف نجمع عدة روابط فيزيائية بين سويتشين في رابط منطقي واحد يسمى Port-Channel. هنشرح الفوائد والقيود، ومتطلبات التوافق، وPAgP وLACP و`mode on`، ثم نراجع أوامر Cisco IOS واللابات والاختبار. لا يتم تعديل Topics 1.1 إلى 2.3، ولا يتم فتح Topic 2.5.',
  estimatedTime: '~120 دقيقة',
  steps: [
    {
      id: 'what',
      title: 'What EtherChannel Is and Why We Need It',
      short: 'ما هو EtherChannel',
      blocks: [
        {
          type: 'paragraph',
          text: '**EtherChannel** هي تقنية **link aggregation** تجمع عدة روابط Ethernet فيزيائية بين جهازين في **رابط منطقي واحد**. في Cisco IOS يظهر هذا الرابط المنطقي كواجهة **Port-Channel** مثل `Port-channel1` أو `Po1`. كل كابل متصل بمنفذ فيزيائي يسمى **physical member** أو **member link**، ومجموعة الأعضاء هي ما نسميه EtherChannel.',
        },
        {
          type: 'diagram',
          id: 'multiple-physical-links',
          caption: 'سويتشان بينهما أربع كابلات Ethernet فيزيائية منفصلة؛ كل كابل على منفذ مختلف.',
        },
        {
          type: 'diagram',
          id: 'etherchannel-port-channel',
          caption: 'الأعضاء الفيزيائيون ينضمون إلى channel-group واحد ويظهرون كواجهة Port-channel منطقية.',
        },
        { type: 'table', headers: ['المصطلح', 'المعنى', 'الوظيفة', 'ملاحظة'], rows: etherchannelTermsRows },
        {
          type: 'list',
          items: [
            '**Link Aggregation**: فكرة عامة لتجميع عدة links في link واحد منطقي.',
            '**Logical Interface**: الـ Port-channel هو ما تراه الطبقات الأعلى، مثل STP أو Layer 3، بدل رؤية كل كابل لوحده.',
            '**Physical Member Interfaces**: المنافذ الحقيقية مثل `GigabitEthernet0/1` إلى `GigabitEthernet0/4`.',
            '**لماذا نستخدمه بين السويتشات؟** لأننا نريد أكثر من رابط دون أن نترك STP يعالج كل رابط كمسار مستقل، ولأننا نريد بديلاً إذا فشل كابل.',
            '**STP view**: الـ Port-channel المكوّن بشكل صحيح يُعامل كـ link واحد، لذلك لا يُحظر عضو من أعضائه لمجرد وجود روابط موازية.',
          ],
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'صورة ذهنية بسيطة',
          text: 'تخيّل أربعة كابلات بين SW1 وSW2. بدون EtherChannel STP قد يحظر بعضها. مع EtherChannel يصبح الأربعة «أنبوباً واحداً» منطقياً، والـ hash يقرر أي كابل يحمل كل تدفق.',
        },
      ],
    },
    {
      id: 'how',
      title: 'EtherChannel Architecture and How It Works',
      short: 'الهيكل والعمل',
      blocks: [
        {
          type: 'paragraph',
          text: 'ابدأ بأربعة منافذ فيزيائية على كل سويتش. عند إضافة `channel-group 1` إلى هذه المنافذ بوضع متوافق، ينشئ النظام واجهة **Port-channel1**. تظل الواجهات الفيزيائية موجودة كأعضاء، لكن العنوان المنطقي والـ forwarding يُنظر إليه من خلال الـ Port-channel. التهيئة مثل VLANs وtrunk mode يجب أن تكون متسقة على الأعضاء وعلى الواجهة المنطقية.',
        },
        {
          type: 'steps',
          items: [
            { title: '1', text: 'حدد المنافذ الفيزيائية التي تربط نفس الجهازين، مثل `Gi0/1` إلى `Gi0/4`.' },
            { title: '2', text: 'اجعل تهيئة هذه المنافذ متوافقة: سرعة وduplex وطبقة وVLANs وtrunk settings.' },
            { title: '3', text: 'طبّق نفس رقم الـ channel-group ووضع تفاوض متوافق على الطرفين.' },
            { title: '4', text: 'ينشأ Port-channel منطقي ويظهر كواجهة مستقلة في `show ip interface brief` أو `show etherchannel summary`.' },
            { title: '5', text: 'يُدخل الـ hash كل تدفق إلى عضو مناسب، وSTP يتعامل مع الحزمة كمسار واحد.' },
            { title: '6', text: 'عند فشل عضو، يُزال من الحزمة ويستمر الـ Port-channel طالما بقيت أعضاء صالحة كافية.' },
          ],
        },
        {
          type: 'diagram',
          id: 'bandwidth-aggregation',
          caption: 'أربع روابط 1 Gbps تساهم في سعة تجميعية تصل إلى 4 Gbps في الحالة المثالية.',
        },
        {
          type: 'diagram',
          id: 'member-link-failure',
          caption: 'فشل عضو واحد يخرجه من الحزمة بينما يستمر Port-channel بالعمل بالأعضاء المتبقية.',
        },
        {
          type: 'diagram',
          id: 'stp-one-logical-link',
          caption: 'STP يرى Port-channel واحداً بدل أربعة مسارات فيزيائية مستقلة.',
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'الحالة المنطقية ليست سحراً',
          text: 'إذا كانت الأعضاء غير متوافقة أو لم يتفاوض الطرفان بنجاح، فقد تظهر الأعضاء كـ `I` stand-alone أو `s` suspended. في هذه الحالة لا يوجد EtherChannel صحيح، وقد يعود STP لرؤية مسارات منفصلة.',
        },
      ],
    },
    {
      id: 'packet',
      title: 'EtherChannel Benefits and Load Balancing',
      short: 'الفوائد والهاش',
      blocks: [
        { type: 'table', headers: ['الفائدة', 'مثال تعليمي', 'الآلية', 'القيد'], rows: benefitsRows },
        {
          type: 'paragraph',
          text: '**Increased bandwidth**: أربع روابط 1 Gbps تعطي حتى **4 Gbps aggregate capacity** في الحالة المثالية. هذا لا يعني أن أي محادثة واحدة تحصل على 4 Gbps؛ التوزيع يتم بين تدفقات متعددة. **Redundancy**: لو فشل كابل، يستمر Port-channel بالعمل باستخدام الأعضاء الباقين. **Load distribution**: يختار الـ hash عضواً لكل تدفق. **Simplified STP topology**: STP يرى linkاً منطقياً واحداً.',
        },
        {
          type: 'diagram',
          id: 'load-balancing-hash',
          caption: 'تدفقات مختلفة قد تستخدم أعضاء مختلفة، لكن حزم التدفق الواحد تبقى على عضو واحد غالباً.',
        },
        {
          type: 'paragraph',
          text: '**Load balancing** يتم باستخدام **hash** لحقول مختارة من الحزمة. تشمل الحقول الشائعة: **source MAC** و**destination MAC** و**source and destination MAC** و**source IP** و**destination IP** و**source and destination IP**، ومنافذ **Layer 4** حيث مدعوم. اعرض الخوارزمية المفعّلة بـ `show etherchannel load-balance`. الخيارات المتاحة والخوارزمية تعتمد على المنصة وإصدار IOS.',
        },
        { type: 'table', headers: ['حقل الـ hash', 'كيف يُستخدم', 'متى يكون مفيداً', 'ملاحظة'], rows: hashRows },
        {
          type: 'callout',
          tone: 'danger',
          title: 'قاعدة مهمة للامتحان والعمل - Single flow rule',
          text: '**لا تقل إن تدفق TCP واحد يحصل تلقائياً على كل النطاق المجمّع.** غالباً يبقى التدفق الواحد على عضو واحد لتجنب إعادة ترتيب الحزم. الإنتاجية الفعلية تعتمد على عدد التدفقات ونمط الحركة والـ hash واستخدام الروابط وقدرات المنصة.',
        },
        {
          type: 'code',
          label: 'Check the active load-balancing algorithm',
          language: 'text',
          code: `SW1# show etherchannel load-balance
EtherChannel Load-Balancing Configuration:
        src-dst-ip`,
        },
      ],
    },
    {
      id: 'config',
      title: 'EtherChannel Configuration Requirements',
      short: 'متطلبات التوافق',
      blocks: [
        {
          type: 'paragraph',
          text: 'لكي ينضم منفذ إلى EtherChannel بنجاح، يجب أن يكون متوافقاً مع بقية الأعضاء. عدم التوافق قد يمنع الانضمام، أو يجعل العضو `suspended`، أو يخلق مشكلة.forwarding حتى لو ظهرت الحزمة «up». القواعد التالية هي المفاهيم المهمة في CCNA، لكن التفاصيل تختلف بين المنصات والإصدارات.',
        },
        {
          type: 'diagram',
          id: 'etherchannel-consistency',
          caption: 'قائمة تحقق من توافق السرعة والـ duplex والطبقة وVLANs وtrunk settings بين الأعضاء.',
        },
        { type: 'table', headers: ['الشرط', 'التهيئة المتوافقة', 'مثال عدم التوافق', 'النتيجة المحتملة'], rows: requirementRows },
        {
          type: 'list',
          items: [
            '**Speed and duplex**: كل الأعضاء بنفس السرعة ونفس وضع الـ duplex.',
            '**Layer 2 or Layer 3 mode**: كل الأعضاء switchports أو كلها routed ports.',
            '**Access or trunk**: كل الأعضاء access أو كلها trunk.',
            '**Access VLAN**: نفس VLAN إذا كانت المنافذ access.',
            '**Native VLAN وAllowed VLAN list**: متطابقان على كل أعضاء الـ trunk.',
            '**Trunk encapsulation**: متطابق حيث ينطبق ذلك على المنصة.',
            '**Compatible modes**: كل الأعضاء يستخدمون نفس عائلة التفاوض أو نفس الوضعثابتة.',
            '**Platform and IOS differences**: بعض المنصات يوفّر automatic consistency checks أو خيارات أقل؛ لا تعمّم قيداً خاصاً بمنصة على كل الأجهزة.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'التوافق ليس اختيارياً',
          text: 'المنفذ الذي يختلف في VLAN أو trunk settings أو السرعة قد لا ينضم إلى الحزمة. دائماً قارن `show running-config interface` و`show interfaces trunk` و`show etherchannel summary` قبل تغيير الطوبولوجيا.',
        },
      ],
    },
    {
      id: 'verify',
      title: 'Port Aggregation Protocol (PAgP)',
      short: 'PAgP',
      blocks: [
        {
          type: 'paragraph',
          text: '**PAgP (Port Aggregation Protocol)** بروتوكول **Cisco proprietary** يتفاوض لتكوين EtherChannel بين منافذ مدعومة. له وضعان: **auto** و**desirable**. الهدف من التفاوض أن يتأكد الطرفان من إمكانية تكوين حزمة واحدة قبل حمل الحركة.',
        },
        { type: 'table', headers: ['الوضع', 'السلوك', 'الترجمة', 'ملاحظة'], rows: pagpRows },
        {
          type: 'diagram',
          id: 'pagp-auto-desirable',
          caption: 'مصفوفة توافق PAgP: desirable مع desirable أو auto يكوّن الحزمة، وauto مع auto لا يكوّنها.',
        },
        { type: 'table', headers: ['Side A', 'Side B', 'Result', 'Explanation'], rows: pagpMatrixRows },
        {
          type: 'code',
          label: 'Representative PAgP configuration - desirable side',
          language: 'text',
          code: `configure terminal
interface range GigabitEthernet0/1 - 2
 channel-group 2 mode desirable
 no shutdown
end`,
        },
        {
          type: 'paragraph',
          text: 'الأمر `channel-group 2 mode desirable` يجعل المنفذين يحاولان التفاوض باستخدام PAgP مع الطرف الآخر. إذا كان الطرف الآخر `desirable` أو `auto` فمن المتوقع أن تتكوّن الحزمة على المنصات التي تدعم PAgP. إذا كان `auto` في الطرفين فلا يبدأ أي طرف التفاوض.',
        },
        {
          type: 'callout',
          tone: 'danger',
          title: '`on` ليس PAgP',
          text: 'الوضع `on` ينشئ **static EtherChannel** ولا يرسل رسائل PAgP. لذلك `on` مع `on` قد يعمل كحزمةثابتة، لكن `on` مع `desirable` أو `auto` لا يمثل تفاوض PAgP صحيحاً.',
        },
      ],
    },
    {
      id: 'mistakes',
      title: 'Link Aggregation Control Protocol (LACP)',
      short: 'LACP',
      blocks: [
        {
          type: 'paragraph',
          text: '**LACP (Link Aggregation Control Protocol)** معيار **IEEE 802.1AX**، كان يُعرف سابقاً بـ **IEEE 802.3ad**. هو بروتوكول **vendor-neutral**، لذلك يُستخدم بين أجهزة من بائعين مختلفين عندما يدعمون LACP. يتبادل الأطراف رسائل **LACPDU** للتحقق من التوافق واختيار الأعضاء.',
        },
        { type: 'table', headers: ['الوضع', 'السلوك', 'الترجمة', 'ملاحظة'], rows: lacpRows },
        {
          type: 'diagram',
          id: 'lacp-active-passive',
          caption: 'مصفوفة LACP: active مع active أو passive يكوّن الحزمة، وpassive مع passive لا يكوّنها.',
        },
        { type: 'table', headers: ['Side A', 'Side B', 'Result', 'Explanation'], rows: lacpMatrixRows },
        {
          type: 'diagram',
          id: 'lacp-negotiation',
          caption: 'تبادل LACPDU يحمل System ID وPort ID ويؤدي إلى اختيار الأعضاء النشطة.',
        },
        { type: 'table', headers: ['العنصر', 'الوظيفة', 'كيف يُستخدم', 'ملاحظة'], rows: lacpIdentityRows },
        {
          type: 'callout',
          tone: 'info',
          title: 'System ID وPort ID',
          text: '**System ID** يعرّف النظام الطرف المشارك في التفاوض، و**Port ID** يعرّف كل منفذ عضو. يستخدم LACP هذه المعلومات لمطابقة الطرف الصحيح واختيار الأعضاء. Maximum active members ووجود standby links يعتمدان على المنصة والتنفيذ؛ لا تحفظ رقماً واحداً كقاعدة عالمية.',
        },
        {
          type: 'callout',
          tone: 'danger',
          title: '`on` ليس LACP',
          text: 'الوضع `on` لا يرسل LACPDU. إذا كان طرف `active` والآخر `on`، فلا يوجد تبادل LACP صحيح. استخدم `active`/`passive` على الطرفين أو استخدم `on` على الطرفين كحزمةثابتة فقط.',
        },
      ],
    },
    {
      id: 'lab',
      title: 'Static EtherChannel Configuration',
      short: 'Static mode on',
      blocks: [
        {
          type: 'paragraph',
          text: '**Static EtherChannel** يستخدم `channel-group <number> mode on`. في هذا الوضع لا يوجد PAgP ولا LACP negotiation. يجب أن يكون الطرفان متوافقين بالتهيئة، لأن لا يوجد بروتوكول يتحقق من الطرف الآخر تلقائياً.',
        },
        {
          type: 'diagram',
          id: 'static-mode-on',
          caption: 'حزمةثابتة بلا رسائل تفاوض؛ أي عدم توافق بين الطرفين قد يسبب مشكلة forwarding أو حلقة.',
        },
        {
          type: 'code',
          label: 'Representative static EtherChannel configuration',
          language: 'text',
          code: `configure terminal
interface range GigabitEthernet0/3 - 4
 channel-group 3 mode on
 no shutdown
end`,
        },
        {
          type: 'list',
          items: [
            '**No negotiation**: لا تُرسل LACPDU ولا رسائل PAgP.',
            '**Both sides consistent**: لازم نفس الرقم ونفس نوع الحزمة ونفس إعدادات المنافذ على الطرفين.',
            '**Risk**: سوء التهيئة قد يخلق forwarding problems أو loop، لأن الحزمة قد تظهر كأنها صحيحة رغم اختلاف الطرفين.',
            '**When to use**: غالباً يُفضّل LACP عندما يكون مدعوماً لأنه يتحقق من الطرف الآخر ديناميكياً ويقلل خطر الخطأ البشري.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'LACP غالباً أفضل',
          text: 'إذا كانت المنصة والطرف الآخر يدعمان LACP، فغالباً يُفضّل `mode active` أو زوج `active/passive` متوافق على `mode on`، لأنه يتحقق من الطرف الآخر بدل افتراض التوافق.',
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
          text: 'الأوامر والمخرجات في هذه الخطوة أمثلة **تعليمية تمثيلية (representative)** على Cisco IOS. **توفر الأمر وشكل الإخراج يعتمد على المنصة وإصدار IOS**؛ لم يتم التقاط هذه المخرجات من أجهزة حقيقية. استبدل أسماء المنافذ بما يناسب جهازك.',
        },
        {
          type: 'code',
          label: 'Representative LACP configuration - SW1 mode active',
          language: 'text',
          code: `configure terminal
interface range GigabitEthernet0/1 - 2
 switchport mode trunk
 channel-group 1 mode active
 no shutdown

interface Port-channel1
 switchport mode trunk

end`,
        },
        {
          type: 'code',
          label: 'Representative LACP configuration - SW2 mode passive',
          language: 'text',
          code: `configure terminal
interface range GigabitEthernet0/1 - 2
 switchport mode trunk
 channel-group 1 mode passive
 no shutdown

interface Port-channel1
 switchport mode trunk

end`,
        },
        {
          type: 'paragraph',
          text: '**`interface range`** يطبّق الإعداد على عدة منافذ مرة واحدة. **`channel-group 1`** يحدد رقم الحزمة ويجب أن يتطابق على الطرفين غالباً. **`mode active`** يرسل LACPDU، و**`mode passive`** يستجيب فقط. **Port-channel1** هي الواجهة المنطقية الناتجة. على بعض المنصات تُنشأ تلقائياً عند أول `channel-group`، وعلى غيرها قد تحتاج إنشاءها صراحةً. تهيئة member interfaces لازم تتطابق وإلا قد تبقى suspended.',
        },
        {
          type: 'code',
          label: 'Representative PAgP and static alternatives',
          language: 'text',
          code: `configure terminal
interface range GigabitEthernet0/1 - 2
 channel-group 2 mode desirable
end

configure terminal
interface range GigabitEthernet0/3 - 4
 channel-group 3 mode on
end`,
        },
        {
          type: 'diagram',
          id: 'l2-vs-l3-etherchannel',
          caption: 'Layer 2 EtherChannel يجمّع switchports، وLayer 3 EtherChannel يجمّع routed ports.',
        },
        {
          type: 'paragraph',
          text: '**Layer 2 EtherChannel**: الأعضاء switchports والـ Port-channel يحمل VLANs وغالباً trunk. **Layer 3 EtherChannel**: الأعضاء routed interfaces والـ Port-channel يعامل كواجهة Layer 3 يمكن أن تحمل عنوان IP. هذا الدرس يكتفي بالمفهوم على مستوى CCNA ولا يتوسع في إعداد توجيه متقدم.',
        },
        {
          type: 'code',
          label: 'All required Cisco IOS verification commands',
          language: 'text',
          code: `show etherchannel summary
show etherchannel port-channel
show etherchannel detail
show etherchannel load-balance
show interfaces port-channel 1
show interfaces trunk
show lacp neighbor
show pagp neighbor`,
        },
        { type: 'table', headers: ['الأمر', 'ما الذي يوضحه؟', 'متى تستخدمه؟'], rows: verificationRows },
        {
          type: 'code',
          label: 'Representative educational outputs - not captured from real hardware',
          language: 'text',
          code: `SW1# show etherchannel summary
Flags:  D - down        P - bundled in port-channel
        I - stand-alone s - suspended
        H - Hot-standby (LACP only)
        R - Layer3      S - Layer2
        U - in use

Group  Port-channel  Protocol    Ports
------+-------------+-----------+-----------------------------------------------
1      Po1(SU)         LACP      Gi0/1(P) Gi0/2(P) Gi0/3(P) Gi0/4(P)
2      Po2(SD)         PAgP      Gi0/5(s) Gi0/6(s)
10     Po10(RU)        LACP      Gi0/10(P) Gi0/11(P)

SW1# show etherchannel port-channel
                Port-channels in the group:
                ---------------------------
Port-channel: Po1
   Age of the Port-channel   = 00:12:31d
   Protocol      = LACP
   Ports         = Gi0/1 Gi0/2 Gi0/3 Gi0/4

SW1# show etherchannel detail
Channel group number = 1
   Port-channel = Po1
   Protocol = LACP
   Member = Gi0/1  State = bundled
   Member = Gi0/2  State = bundled

SW1# show etherchannel load-balance
EtherChannel Load-Balancing Configuration:
        src-dst-ip

SW1# show interfaces port-channel 1
Port-channel1 is up, line protocol is up
  Hardware is EtherChannel, address is 0c01.2345.6789
  MTU 1500 bytes, BW 4000000 Kbit

SW1# show interfaces trunk
Port        Mode    Encapsulation  Status  Native vlan
Gi0/1       on      802.1q         trunking 99
Gi0/2       on      802.1q         trunking 99
Po1         on      802.1q         trunking 99

SW1# show lacp neighbor
Flags:  S - Device is requesting Slow LACPDUs
Gi0/1      LACP neighbor:
  Actor System ID: 0x8000,00aa.bbcc.dd01
  Partner System ID: 0x8000,00aa.bbcc.dd02
  Partner Port ID: 0x8001

SW1# show pagp neighbor
Flags:  C - PAgP packets are sent every 30s
Gi0/5      PAgP neighbor:
  Neighbor ID: 00aa.bbcc.dd02
  Neighbor Port: Gi0/5`,
        },
        { type: 'table', headers: ['العلامة', 'المعنى', 'الترجمة'], rows: flagRows },
        {
          type: 'callout',
          tone: 'danger',
          title: 'تنبيه تعليمي صريح',
          text: 'كل المخرجات أعلاه **representative educational examples** وليست لقطات من hardware حقيقي. ترتيب الأعمدة أو العلامات أو وجود `H`/`f` أو صيغة System ID يختلف حسب المنصة والإصدار. تحقق دائماً من الإخراج الفعلي في بيئة التدريب ووثائق المنصة.',
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
          text: '**Lab 1 - Configure LACP EtherChannel (Packet Tracer-style / conceptual)**',
        },
        { type: 'table', headers: ['Device', 'Local Ports', 'Connected To', 'Role'], rows: lab1Rows },
        {
          type: 'steps',
          items: [
            { title: 'Topology', text: 'سويتشان Cisco بينهما رابطان فيزيائيان، وُجمعوا في Port-channel 1. تمرين Packet Tracer-style ولم يُنفّذ فعلياً.' },
            { title: 'Task 1', text: 'هيّئ الرابطين كـ trunk متوافقين على SW1 وSW2.' },
            { title: 'Task 2', text: 'على SW1 استخدم `interface range GigabitEthernet0/1 - 2` ثم `channel-group 1 mode active`.' },
            { title: 'Task 3', text: 'على SW2 استخدم نفس المنافذ مع `channel-group 1 mode passive`.' },
            { title: 'Task 4', text: 'هيّئ `interface Port-channel1` كـ trunk على الجانبين حيث يتطلب ذلك.' },
            { title: 'Task 5', text: 'تحقق بـ `show etherchannel summary` وتوقع `Po1(SU)` مع علامة `P` لكل عضو.' },
            { title: 'Task 6', text: 'افحص `show lacp neighbor` و`show interfaces trunk` واختبر الاتصال عبر Port-channel.' },
            { title: 'Task 7', text: 'افصل أحد الكابلين conceptually وتوقع بقاء Po1 up بالعضو المتبقي؛ أعد الوصل وتحقق من عودة العضو.' },
            { title: 'Honesty note', text: 'لم يتم تشغيل اللاب داخل Packet Tracer أو على أجهزة فعلية؛ النتائج متوقعة تعليمياً.' },
          ],
        },
        {
          type: 'paragraph',
          text: '**Lab 2 - EtherChannel Troubleshooting (Packet Tracer-style / conceptual)**',
        },
        { type: 'table', headers: ['المشكلة', 'الوصف', 'ال symptom المتوقع'], rows: lab2Rows },
        {
          type: 'diagram',
          id: 'etherchannel-troubleshooting',
          caption: 'مسار تحقق منظم من المنفذ الفيزيائي إلى الحزمة المنطقية واختبار الفشل.',
        },
        {
          type: 'steps',
          items: [
            { title: 'Task 1', text: 'توقّع النتيجة لكل مشكلة قبل تغيير أي إعداد.' },
            { title: 'Task 2', text: 'افحص `show etherchannel summary` وابحث عن `s` أو `I` أو غياب `P`.' },
            { title: 'Task 3', text: 'قارن `show running-config interface` و`show interfaces trunk` بين الأعضاء.' },
            { title: 'Task 4', text: 'حدد عدم التوافق: VLAN أو native VLAN أو allowed list أو speed/duplex أو وضع التفاوض.' },
            { title: 'Task 5', text: 'صحّح الإعداد على الطرف الصحيح وكرّر الفحص حتى تظهر الأعضاء `P`.' },
            { title: 'Task 6', text: 'تحقق من `show interfaces port-channel 1` واختبر الاتصال وسلوك فشل عضو واحد.' },
            { title: 'Honesty note', text: 'هذا لاب تعليمي conceptual؛ لم تُنفّذ الأوامر على أجهزة فعلية.' },
          ],
        },
        {
          type: 'paragraph',
          text: '**Lab 3 - PAgP and Static EtherChannel (Optional, conceptual)**',
        },
        {
          type: 'steps',
          items: [
            { title: 'Topology', text: 'سويتشان Cisco بأربعة روابط؛ تجرّب مجموعات أوضاع مختلفة. تمرين مفاهيمي ولم يُشغّل فعلياً.' },
            { title: 'Task 1', text: `جرّب desirable + desirable وتوقع Formation على المنصات الداعمة لـ PAgP.` },
            { title: 'Task 2', text: `جرّب desirable + auto وتوقع Formation.` },
            { title: 'Task 3', text: `جرّب auto + auto وتوقع عدم Formation لغياب طرف يبدأ التفاوض.` },
            { title: 'Task 4', text: `جرّب on + on وتوقع حزمةثابتة بلا رسائل تفاوض.` },
            { title: 'Task 5', text: `جرّب LACP في طرف وPAgP في الآخر وتوقع عدمFormation لأن العائلتين مختلفتان.` },
            { title: 'Platform note', text: `دعم PAgP وخياراته يختلف حسب المنصة والإصدار؛ تحقق من التوفر المحلي.` },
            { title: 'Honesty note', text: `لم يتم تنفيذ هذا اللاب؛ النتائج متوقعة من القواعد التعليمية.` },
          ],
        },
        {
          type: 'paragraph',
          text: '**الأخطاء الشائعة**',
        },
        { type: 'table', headers: ['الخطأ', 'السبب والتصحيح'], rows: commonMistakeRows },
        {
          type: 'paragraph',
          text: '**Troubleshooting Workflow**',
        },
        {
          type: 'steps',
          items: [
            { title: '1', text: '**Physical interface status**: تأكد أن المنافذ up/up ولا يوجد shutdown أو كابل مقطوع.' },
            { title: '2', text: '**`show etherchannel summary`**: حدد رقم المجموعة والبروتوكول وحالة الأعضاء والعلامات.' },
            { title: '3', text: '**Negotiation protocol**: تأكد من LACP أو PAgP أو static على الطرفين.' },
            { title: '4', text: '**Mode compatibility**: active/passive أو desirable/auto أو on/on حسب العائلة.' },
            { title: '5', text: '**Member configuration**: قارن السرعة والـ duplex والطبقة وaccess VLAN وnative VLAN والقائمة المسموح بها.' },
            { title: '6', text: '**Port-channel configuration**: افحص الواجهة المنطقية نفسها و`show etherchannel port-channel`.' },
            { title: '7', text: '**Trunk settings**: للـ Layer 2 تحقق من `show interfaces trunk` على الأعضاء والـ Port-channel.' },
            { title: '8', text: '**Load balancing**: راجع `show etherchannel load-balance` وتأكد أن التوزيع متوقع.' },
            { title: '9', text: '**Connectivity and failure test**: اختبر الاتصال ثم حاكِ فشل عضو واحد وتأكد بقاء الحزمة عملية.' },
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'الأمانة التعليمية',
          text: 'اللابات الثلاثة Packet Tracer-style أو conceptual ولم تُنفّذ فعلياً. كل مخرجات الأوامر representative وليست لقطات من hardware، وتوفر الأوامر platform/IOS dependent.',
        },
        {
          type: 'list',
          items: [
            'EtherChannel يجمّع عدة روابط فيزيائية في **Port-channel** منطقي واحد، وSTP يراه linkاً واحداً.',
            'الفوائد: aggregate bandwidth وredundancy وload distribution وتبسيط طوبولوجيا STP.',
            'تدفق واحد غالباً يبقى على عضو واحد لتجنب إعادة ترتيب الحزم؛ لا يحصل تلقائياً على كل النطاق.',
            'التوافق المطلوب: speed وduplex وL2/L3 وaccess/trunk وaccess VLAN وnative VLAN وallowed list وencapsulation حيث ينطبق.',
            'PAgP Cisco proprietary بوضعي auto وdesirable؛ desirable مع desirable أو auto يكوّن الحزمة، وauto مع auto لا يكوّنها.',
            'LACP IEEE 802.1AX، سابقاً 802.3ad، vendor-neutral بوضعي active وpassive؛ passive مع passive لا يكوّن الحزمة.',
            '`mode on`ثابتة بلا تفاوض؛ LACP غالباً مفضّل عندما يكون مدعوماً.',
            'System ID وPort ID يستخدمان في تبادل LACPDU واختيار الأعضاء؛ حدود active/standby تعتمد على المنصة.',
            'Hash fields تشمل MAC وIP والطرفين ومنافذ Layer 4 حيث مدعوم؛ راجع `show etherchannel load-balance`.',
            'التحقق: `show etherchannel summary` و`show etherchannel port-channel` و`show etherchannel detail` و`show etherchannel load-balance` و`show interfaces port-channel 1` و`show interfaces trunk` و`show lacp neighbor` و`show pagp neighbor`.',
            'العلامات: `S` Layer 2 و`R` Layer 3 و`U` in use و`P` bundled و`I` stand-alone و`s` suspended؛ الشكل النهائي يعتمد على المنصة.',
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
              prompt: 'ما الفائدة الأساسية من EtherChannel بين سويتشين؟',
              options: [
                'تجميع عدة روابط فيزيائية في Port-channel منطقي واحد لزيادة السعة وتوفير redundancy وتبسيط STP.',
                'جعل كل كابل يعمل كمسار STP مستقل لزيادة عدد المنافذ المُحظورة.',
                'إعطاء تدفق TCP واحد النطاق الكامل لكل الروابط تلقائياً.',
                'استبدال VLANs وtrunks بعنوان IP واحد على كل منفذ.',
              ],
              correctIndex: 0,
              requireSubmit: true,
              explanation:
                'الصح هو **(A)**. EtherChannel يجمّع الروابط في واجهة منطقية واحدة، وSTP يراها ك.link واحد. الفوائد تشمل aggregate capacity وredundancy وتبسيط الطوبولوجيا، مع بقاء التدفق الواحد على عضو واحد غالباً.',
            },
            {
              id: 'q2',
              kind: 'multiple',
              prompt: 'أي عبارات عن LACP صحيحة؟ (اختر أكثر من إجابة)',
              options: [
                'يعتمد على معيار IEEE 802.1AX وهو vendor-neutral.',
                'وضع passive مع passive يكوّن الحزمة دائماً.',
                'active مع passive يكوّن الحزمة لأن active يبدأ بإرسال LACPDU.',
                '`mode on` يرسل LACPDU للتحقق من الطرف الآخر.',
              ],
              correctIndices: [0, 2],
              requireSubmit: true,
              explanation:
                'الصح هو **(A) و(C)**. LACP معيار 802.1AX متعدد البائعين؛ active يبدأ التفاوض وpassive يستجيب. passive مع passive لا يكوّن حزمة، و`on`ثابتة بلا LACPDU.',
            },
            {
              id: 'q3',
              prompt: 'أي مجموعة أوضاع PAgP لا تكوّن EtherChannel؟',
              options: [
                'desirable مع desirable.',
                'desirable مع auto.',
                'auto مع auto.',
                'on مع on كحزمةثابتة.',
              ],
              correctIndex: 2,
              requireSubmit: true,
              explanation:
                'الصح هو **(C)**. في PAgP يلزم طرف desirable واحد على الأقل لبدء التفاوض؛ auto مع auto لا يبدأ أي طرف. desirable مع desirable أو auto يكوّن الحزمة، وon مع on ليس PAgP بل Static EtherChannel.',
            },
            {
              id: 'q4',
              kind: 'multiple',
              prompt: 'أي عناصر يجب أن تكون متوافقة بين أعضاء EtherChannel؟ (اختر أكثر من إجابة)',
              options: [
                'السرعة ووضع الـ duplex.',
                'نوع الواجهة Layer 2 أو Layer 3 وaccess أو trunk.',
                'Access VLAN وNative VLAN وAllowed VLAN list حيث ينطبق ذلك.',
                'رقم channel-group مختلف على كل عضو لتجنب التضارب.',
              ],
              correctIndices: [0, 1, 2],
              requireSubmit: true,
              explanation:
                'الصح هو **(A) و(B) و(C)**. الأعضاء يجب أن يتشاركوا إعدادات متوافقة، بينما رقم channel-group يجب أن يكون هو نفسه لأعضاء الحزمة وليس مختلفاً.',
            },
            {
              id: 'q5',
              kind: 'multiple',
              prompt: 'أي عبارات عن load balancing والتحقق في EtherChannel صحيحة؟ (اختر أكثر من إجابة)',
              options: [
                'يمكن أن يستخدم الـ hash عناوين MAC أو IP أو منافذ Layer 4 حيث مدعوم.',
                '`show etherchannel load-balance` يعرض خوارزمية الـ hash المفعّلة.',
                'حزم التدفق الواحد تبقى على عضو واحد غالباً لتجنب إعادة ترتيب الحزم.',
                'التوزيع يتم بالتناوب packet by packet على كل الأعضاء دائماً.',
              ],
              correctIndices: [0, 1, 2],
              requireSubmit: true,
              explanation:
                'الصح هو **(A) و(B) و(C)**. الـ hash يختار عضواً لكل تدفق، و`show etherchannel load-balance` يعرض الخوارزمية. التوزيع ليس بالتناوب لكل حزمة؛ التدفق الواحد يبقى على عضو واحد غالباً.',
            },
          ],
        },
      ],
    },
  ],
}
