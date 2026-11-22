import type { Lesson } from '../types'

const learnedFieldsRows: string[][] = [
  ['Device ID / System Name', 'CDP Device ID أو LLDP System Name', 'تعرّف الجهاز المجاور بالاسم', 'الاسم الذي يعلنه الجهاز؛ ليس بالضرورة اسم DNS'],
  ['Capabilities', 'Router / Switch / Phone / Others', 'توضح وظيفة الجهاز', 'قد تظهر كرموز أو نص حسب المنصة'],
  ['Local Interface', 'المنفذ على جهازك', 'تقول من أي منفذ وصل الجار', 'مهمة لتتبع الكابلات والمنافذ'],
  ['Remote Port ID', 'المنفذ على الجهاز المجاور', 'تقول في أي منفذ بعيد وصلت', 'تظهر في `show cdp neighbors` و`show lldp neighbors`'],
  ['Platform / Device Type', 'مثال ISR4331 أو WS-C2960', 'تساعد في تحديد نوع الجهاز', 'النص مختلف حسب البائع والإصدار'],
  ['Software Version', 'إصدار IOS أو نظام الجهاز', 'مفيد للتوافق والترقية', 'ليس مضموناً في كل الإعلانات'],
  ['Management IP Address', 'مثال 10.0.0.1', 'يساعد في الوصول للجهاز المجاور', 'يظهر فقط لو متاح ومُعلن من الجهاز'],
  ['VLAN information', 'Native VLAN أو Port VLAN حسب الدعم', 'يساعد في فهم تخطيط VLAN', 'يعتمد على البروتوكول والمنصة وما يتم الإعلان عنه'],
]

const cdpFieldRows: string[][] = [
  ['Device ID', 'هوية الجهاز الذي أرسل الإعلان', 'غالباً hostname الجهاز'],
  ['Local Interface / Port ID', 'منفذك المحلي ومنفذ الجهاز البعيد', 'يحددان طرفي الرابط'],
  ['Capabilities', 'وظيفة الجهاز مثل router أو switch', 'قد تظهر كرموز مثل R وS'],
  ['Platform', 'نوع الجهاز أو الموديل', 'مفيد للمعرفة والتوثيق'],
  ['Software Version', 'إصدار البرنامج', 'قد يختلف التوافر حسب المنصة'],
  ['IP Address', 'عنوان إداري مُعلن', 'يظهر عند توفره والإعلان عنه'],
  ['Native VLAN', 'VLAN المرتبط بالمنفذ حيث ينطبق ذلك', 'حقل يعتمد على المنصة ونوع المنفذ'],
]

const lldpTlvRows: string[][] = [
  ['Chassis ID', 'يعرّف الهيكل أو الجهاز المرسل', 'غالباً MAC address أو معرّف آخر'],
  ['Port ID', 'يعرّف المنفذ المرسل', 'قد يكون اسم منفذ أو MAC'],
  ['Time To Live (TTL)', 'مدة صلاحية المعلومات عند المستقبل', 'لا يساوي بالضرورة فترة الإعلان'],
  ['Port Description', 'وصف نصي للمنفذ', 'مفيد لتتبع المنافذ'],
  ['System Name', 'اسم النظام', 'غالباً hostname الجهاز'],
  ['System Description', 'وصف النظام', 'قد يشمل نوع الجهاز والإصدار'],
  ['System Capabilities', 'الوظائف المدعومة', 'مثل switch أو router أو phone'],
  ['Management Address', 'عنوان إداري', 'يظهر فقط عند الإعلان عنه'],
]

const lldpMulticastRows: string[][] = [
  ['`01:80:C2:00:00:0E`', 'Nearest Bridge', 'الوجهة الشائعة في بيئات Ethernet العادية، وهي التركيز في هذا الدرس'],
  ['`01:80:C2:00:00:03`', 'Nearest non-TPMR Bridge', 'تستخدم في سيناريوهات bridges المتقدمة المرتبطة بـ TPMR'],
  ['`01:80:C2:00:00:00`', 'Nearest Customer Bridge', 'تستخدم في سيناريوهات 802.1Q customer bridges'],
]

const comparisonRows: string[][] = [
  ['Standard', 'Cisco proprietary', 'IEEE 802.1AB'],
  ['Vendor support', 'Primarily Cisco devices; commonly supported on Cisco equipment', 'Multi-vendor'],
  ['Layer', 'Layer 2', 'Layer 2'],
  ['Neighbor discovery', 'Directly connected neighbors', 'Directly connected neighbors'],
  ['Information format', 'CDP fields', 'LLDP TLVs'],
  ['Configuration', 'Cisco IOS CDP commands', 'Cisco IOS LLDP commands'],
  ['Destination multicast focus', '`01:00:0C:CC:CC:CC`', '`01:80:C2:00:00:0E` for nearest bridge'],
  ['Typical use', 'Cisco-heavy networks', 'Mixed-vendor networks'],
]

const cdpShowRows: string[][] = [
  ['`show cdp`', 'حالة CDP العامة وسبب تشغيله أو إيقافه', 'أول فحص قبل أي شيء آخر'],
  ['`show cdp neighbors`', 'ملخص الجيران والمنفذ المحلي والمنفذ البعيد', 'أسرع طريقة لرؤية من متصل بك'],
  ['`show cdp neighbors detail`', 'تفاصيل مثل Platform وVersion وIP عند توفرها', 'عندما تحتاج هوية أو عنواناً إدارياً'],
  ['`show cdp interface`', 'حالة CDP على المنافذ', 'للتحقق من منفذ معين'],
  ['`show cdp traffic`', 'عدادات الإطارات المرسلة والمستلمة', 'لمعرفة هل الإعلانات تتحرك فعلاً'],
]

const cdpConfigRows: string[][] = [
  ['`configure terminal`', 'يدخل global configuration mode', 'التغييرات في running configuration'],
  ['`cdp run`', 'يشغّل CDP بشكل عام على الجهاز', 'لا يكفي وحده لو المنفذ معطل محلياً'],
  ['`no cdp run`', 'يوقف CDP بشكل عام', 'يمنع الإعلانات والجيران على كل المنافذ المدعومة'],
  ['`interface GigabitEthernet0/1`', 'يدخل interface configuration mode', 'استبدل المنفذ حسب طوبولوجيا جهازك'],
  ['`cdp enable`', 'يشغّل CDP على هذا المنفذ', 'يتطلب تشغيل CDP عاماً أولاً'],
  ['`no cdp enable`', 'يوقف CDP على هذا المنفذ', 'لا يعني بالضرورة إيقاف CDP على بقية المنافذ'],
]

const lldpShowRows: string[][] = [
  ['`show lldp`', 'حالة LLDP العامة', 'تحقق أولي من تشغيل البروتوكول'],
  ['`show lldp neighbors`', 'ملخص الجيران والمنافذ وTTL', 'أسرع فحص للجيران المباشرين'],
  ['`show lldp neighbors detail`', 'TLVs مثل System Name وCapabilities وManagement Address', 'لتفاصيل هوية الجار'],
  ['`show lldp interface`', 'حالة transmit وreceive على المنافذ', 'مفيد عند شك في إعدادات المنفذ'],
  ['`show lldp traffic`', 'عدادات الإطارات', 'لتحقق من نشاط الإرسال والاستقبال'],
]

const lldpConfigRows: string[][] = [
  ['`configure terminal`', 'يدخل global configuration mode', 'التغييرات في running configuration'],
  ['`lldp run`', 'يشغّل LLDP بشكل عام', 'تشغيله لا يلغي إعدادات المنفذ'],
  ['`no lldp run`', 'يوقف LLDP بشكل عام', 'تختفي معلومات الجيران تدريجياً بعد انتهاء TTL'],
  ['`interface GigabitEthernet0/1`', 'يدخل interface configuration mode', 'طبّق الإعداد على المنفذ الصحيح'],
  ['`lldp transmit`', 'يرسل معلومات هذا الجهاز', 'مسؤول عن الإعلان الصادر'],
  ['`lldp receive`', 'يعالج معلومات الجار', 'مسؤول عن تعبئة جدول الجيران'],
  ['`no lldp transmit`', 'يوقف إرسال LLDP من المنفذ', 'الجهاز الآخر لن يراك عبر LLDP من هذا الطرف'],
  ['`no lldp receive`', 'يوقف استقبال LLDP على المنفذ', 'لن تسجّل الجار في جدولك'],
]

const lab1Rows: string[][] = [
  ['SW1', 'Gi0/1', 'R1 Gi0/0', 'Router, optional in the lab'],
  ['SW1', 'Gi0/24', 'SW2 Gi0/24', 'Direct switch-to-switch link'],
  ['SW2', 'Gi0/24', 'SW1 Gi0/24', 'Direct switch-to-switch link'],
]

const lab2Rows: string[][] = [
  ['SW1', 'Gi0/1', 'R1 Gi0/0', 'Cisco router or LLDP-compatible device'],
  ['R1', 'Gi0/0', 'SW1 Gi0/1', 'LLDP transmit and receive enabled'],
]

export const topic23Lesson: Lesson = {
  topicId: '2.3',
  title: 'Configure and Verify Layer 2 Discovery Protocols (CDP and LLDP)',
  description:
    'في Topic 2.3 ننتقل من بناء الـ VLANs والـ trunks إلى معرفة مين متصل بنا فعلياً على Layer 2. هنشرح CDP وLLDP، وكيف بيتبادلوا معلومات الجيران، وإزاي نقرأ جداول الجيران ونتحقق منها على Cisco IOS. هنضيف لابات Packet Tracer-style ومراجعة CCNA و5 أسئلة، من غير أي تعديل على Topic 2.4.',
  estimatedTime: '~110 دقيقة',
  steps: [
    {
      id: 'what',
      title: 'What Network Discovery Protocols Are and Why We Need Them',
      short: 'المقدمة',
      blocks: [
        {
          type: 'paragraph',
          text: '**Network Discovery Protocol** هو بروتوكول Layer 2 يسمح للجهاز بأن يعرف أي أجهزة متصلة به مباشرة على نفس الـ link، ويجمع معلومات مثل اسم الجهاز والمنفذ والقدرات. أشهر مثالين في CCNA هما **CDP** و**LLDP**. الفكرة ليست إرسال بيانات المستخدم عبرها، بل بناء صورة محلية عن الجيران مباشرةً.',
        },
        {
          type: 'diagram',
          id: 'directly-connected-devices',
          caption: 'جهازان متصلان مباشرة على Layer 2؛ كل جهاز يسجّل الآخر كجار محلي.',
        },
        {
          type: 'table',
          headers: ['المعلومة', 'المصدر الشائع', 'ما الذي تخبرك به؟', 'ملاحظة مهمة'],
          rows: learnedFieldsRows,
        },
        {
          type: 'list',
          items: [
            '**Neighbor Discovery**: تعرف هوية الجهاز الموجود في الطرف الآخر من الكابل.',
            '**Directly Connected Devices**: الاكتشاف يتم بين أجهزة متجاورة على Layer 2.',
            '**Network Topology Discovery**: بجمع جيران كل جهاز يمكن رسم خريطة للروابط المباشرة.',
            '**Device Identification**: الاسم والنوع والمنفذ يساعدون في التوثيق وتتبع الأصول.',
            '**Troubleshooting benefits**: تقدر تكتشف منفذ غلط، جهاز غير متوقع، أو اختفاء جار بعد تغيير كابل.',
          ],
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'حدود الاكتشاف',
          text: 'بروتوكولات الاكتشاف تعرّف **directly connected Layer 2 neighbors** غالباً. هي لا تكتشف كل جهاز عبر شبكة routing كاملة، وليست بديلاً عن جداول الـ routing أو أنظمة الجرد.',
        },
      ],
    },
    {
      id: 'how',
      title: 'Cisco Discovery Protocol (CDP) Fundamentals',
      short: 'CDP',
      blocks: [
        {
          type: 'paragraph',
          text: '**CDP (Cisco Discovery Protocol)** بروتوكول **Cisco proprietary** يعمل على **Layer 2**. الأجهزة التي تدعمه ترسل إعلانات إلى الجيران المتصلين مباشرة، باستخدام عنوان multicast MAC الوجهة `01:00:0C:CC:CC:CC`. الإعلان لا يُوجَّه كحزمة IP، لذلك لا يتم توجيهه مثل حركة IP العادية، ويمكن أن يعمل على منافذ مدعومة حتى لو لم يكن للمنفذ عنوان IP.',
        },
        {
          type: 'diagram',
          id: 'cdp-advertisement-flow',
          caption: 'Device A يرسل إعلان CDP؛ Device B يستلمه ويسجّل الجار في جدوله المحلي.',
        },
        {
          type: 'table',
          headers: ['حقل CDP شائع', 'الوظيفة', 'ملاحظة'],
          rows: cdpFieldRows,
        },
        {
          type: 'list',
          items: [
            'CDP يرسل معلومات مثل **Device ID** و**Local Interface** و**Port ID** و**Capabilities**.',
            'قد يرسل أيضاً **Platform** و**Software Version** و**IP Address** و**Native VLAN** حيث ينطبق ذلك.',
            'الإعلان يصل إلى الجيران المباشرين على نفس الـ link؛ لا يعبر راوتراً كأنه حزمة IP.',
            'وجود أو عدم وجود عنوان IP على المنفذ لا يمنع CDP من العمل على منفذ مدعوم، لأنه يعمل تحت IP.',
            'CDP Cisco proprietary، لكن الصياغة الأدق إنه مدعوم عادةً على أجهزة Cisco وليس بالضرورة على كل بائع أو كل منصة.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'ليست كل الحقول موجودة دائماً',
          text: 'المحتوى الظاهر في `show cdp neighbors detail` يعتمد على المنصة وإصدار IOS ونوع المنفذ وما يعلنه الجار. لا تفترض أن عنوان IP أو Native VLAN أو إصدار البرنامج سيظهر في كل مثال.',
        },
      ],
    },
    {
      id: 'packet',
      title: 'How CDP Works',
      short: 'CDP Flow',
      blocks: [
        {
          type: 'paragraph',
          text: 'دورة CDP بسيطة: إعلان يُرسل، يُستقبل، يُعالج، ويُخزّن في جدول جيران محلي. الجدول ليس دائماً؛ يعتمد على وصول إعلانات جديدة قبل انتهاء الـ holdtime.',
        },
        {
          type: 'steps',
          items: [
            { title: '1', text: '**Device A** يجهّز CDP advertisement يحمل معلوماته.' },
            { title: '2', text: 'يُرسل الإعلان من **supported interface** على Device A.' },
            { title: '3', text: '**Device B** المتصل مباشرة يستلم الإطار على منفذه.' },
            { title: '4', text: 'Device B يعالج حقول الإعلان مثل Device ID وPort ID وCapabilities.' },
            { title: '5', text: 'Device B يسجّل Device A في **CDP neighbor table**.' },
            { title: '6', text: 'الإدخال يبقى حتى يُحدَّث بإعلان جديد أو تنتهي مدة الـ **holdtime**.' },
          ],
        },
        {
          type: 'diagram',
          id: 'cdp-neighbor-table',
          caption: 'جدول الجيران يوضح Device ID والمنفذ المحلي والمنفذ البعيد والقدرات والمنصة.',
        },
        {
          type: 'diagram',
          id: 'cdp-timing',
          caption: 'الإعلان الدوري يحدّث الجار؛ توقف الإعلانات يؤدي إلى انتهاء الـ holdtime.',
        },
        {
          type: 'paragraph',
          text: '**Advertisement interval** هو المدة بين إعلان وآخر، أما **holdtime** فهو المدة التي يحتفظ فيها المستقبل بالمعلومة بدون تحديث. من القيم الشائعة في أمثلة Cisco: إعلان كل **60 ثانية** وholdtime **180 ثانية**، لكن هذه القيم قابلة للضبط وممكن تختلف حسب المنصة والإصدار. لو توقفت الإعلانات، يعدّ الـ holdtime تنازلياً ثم يُحذف الجار من الجدول.',
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'كيف يساعد CDP في رسم الشبكة؟',
          text: 'ابدأ من سويتش، اقرأ جيرانه، ثم كرّر الفحص من كل جهاز. كل إدخال بمنفذ محلي ومنفذ بعيد يضيف link واحداً إلى خريطة الطوبولوجيا.',
        },
      ],
    },
    {
      id: 'config',
      title: 'Link Layer Discovery Protocol (LLDP) Fundamentals',
      short: 'LLDP',
      blocks: [
        {
          type: 'paragraph',
          text: '**LLDP** اختصار لـ **Link Layer Discovery Protocol** وهو معيار **IEEE 802.1AB**. بروتوكول **vendor-neutral** يعمل على Layer 2 ويسمح لأجهزة من بائعين مختلفين بالتعريف عن بعضها باستخدام **TLVs**. لأنه معيار مفتوح، فهو الخيار الطبيعي عندما يكون الجار switch أو router أو phone من بائع آخر.',
        },
        {
          type: 'diagram',
          id: 'lldp-advertisement-flow',
          caption: 'إعلان LLDP يحمل TLVs إلى جار مباشر على Layer 2.',
        },
        {
          type: 'diagram',
          id: 'lldp-tlv-structure',
          caption: 'الإعلان يتكون من حقول Type Length Value تحمل هوية الجهاز والمنفذ والقدرات.',
        },
        {
          type: 'table',
          headers: ['TLV', 'الوظيفة', 'مثال أو ملاحظة'],
          rows: lldpTlvRows,
        },
        {
          type: 'table',
          headers: ['Multicast MAC', 'الوجهة', 'الاستخدام'],
          rows: lldpMulticastRows,
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'التركيز في CCNA',
          text: 'في بيئات Ethernet المعتادة ركّز على **nearest bridge** وعنوانه `01:80:C2:00:00:0E`. العنوانان الآخران موجودان للسيناريوهات المتقدمة المتعلقة بـ TPMR وCustomer bridges.',
        },
      ],
    },
    {
      id: 'verify',
      title: 'How LLDP Works',
      short: 'LLDP Flow',
      blocks: [
        {
          type: 'paragraph',
          text: 'منطق LLDP مشابه لمنطق CDP من ناحية الجيران المباشرين، لكن المعلومات تُحمل داخل TLVs قياسية ويتم تتبعها بـ TTL بدلاً من holdtime الخاص بـ CDP.',
        },
        {
          type: 'steps',
          items: [
            { title: '1', text: '**Device A** يبني LLDP advertisement من TLVs.' },
            { title: '2', text: 'الإطار يُرسل من interface متوافق مع LLDP.' },
            { title: '3', text: '**Device B** يستلم إطار LLDP.' },
            { title: '4', text: 'Device B يقرأ الـ TLVs مثل Chassis ID وPort ID وSystem Name.' },
            { title: '5', text: 'يُخزّن المعلومات في **LLDP neighbor table** ويُحدّثها مع كل إعلان.' },
            { title: '6', text: 'لو توقفت الإعلانات، ينتهي الـ TTL ويُحذف الجار.' },
          ],
        },
        {
          type: 'diagram',
          id: 'lldp-neighbor-table',
          caption: 'جدول LLDP يعرض ما وصل من TLVs مثل Chassis ID وSystem Name وManagement Address وTTL.',
        },
        {
          type: 'diagram',
          id: 'lldp-ttl-timeline',
          caption: 'فترة الإعلان تختلف عن TTL؛ TTL هو مدة بقاء المعلومة عند المستقبل.',
        },
        {
          type: 'paragraph',
          text: 'مثال تعليمي: إعلان LLDP كل **30 ثانية** وTTL حوالي **120 ثانية**. هذه أرقام توضيحية فقط، والقيم الفعلية تعتمد على المنصة والإعداد. الفرق الجوهري: **advertisement interval** يصف متى يرسل المرسل، بينما **TTL** يصف إلى متى يحتفظ المستقبل بالمعلومة.',
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'لا تخلط TTL بـ Interval',
          text: 'إذا سُئلت في الامتحان عن سبب اختفاء إدخال LLDP بعد توقف الإعلانات، فالإجابة هي انتهاء TTL عند المستقبل، وليس أن المرسل غيّر فترة الإعلان بالضرورة.',
        },
      ],
    },
    {
      id: 'mistakes',
      title: 'CDP vs LLDP Comparison',
      short: 'CDP / LLDP',
      blocks: [
        {
          type: 'table',
          headers: ['Feature', 'CDP', 'LLDP'],
          rows: comparisonRows,
        },
        {
          type: 'diagram',
          id: 'cdp-vs-lldp',
          caption: 'مقارنة مباشرة بين CDP وLLDP من حيث المعيار والبائعين وشكل المعلومات.',
        },
        {
          type: 'list',
          items: [
            '**CDP مفيد** في شبكات Cisco-heavy حيث كل الأجهزة تدعم CDP وتريد تفاصيل مألوفة من Cisco IOS.',
            '**LLDP أفضل** عندما يكون الجار من بائع آخر، أو عندما تريد معياراً مشتركاً بين أجهزة متعددة.',
            '**البيئة متعددة البائعين** تستفيد من LLDP لأنه يغطي الفجوة التي قد لا يغطيها CDP مع الأجهزة غير Cisco.',
            '**تشغيل الاثنين معاً** مدعوم في شبكات كثيرة؛ كل بروتوكول يحتفظ بجدول جيران منفصل، ويمكن استخدام CDP لأجهزة Cisco وLLDP للباقي.',
            'لا تفترض أن CDP موجود على كل جهاز في كل شبكة؛ صفه بأنه Cisco proprietary ومدعوم عادةً على أجهزة Cisco.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'قاعدة قرار سريعة',
          text: 'Cisco إلى Cisco → CDP مفيد. Cisco إلى غير Cisco → LLDP هو الخيار المتوقع لو الطرفان يدعمانه. ويجوز تشغيل الاثنين معاً على نفس المنفذ على المنصات التي تدعم ذلك.',
        },
      ],
    },
    {
      id: 'lab',
      title: 'Cisco IOS Configuration and Verification',
      short: 'أوامر IOS',
      blocks: [
        {
          type: 'paragraph',
          text: 'الأوامر والمخرجات في هذه الخطوة أمثلة تعليمية على Cisco IOS. **توفر الأمر وشكل الإخراج يعتمد على المنصة وإصدار IOS**؛ بعض الأجهزة يدعم مجموعة فرعية من الأوامر فقط. لم يتم تنفيذ هذه الأوامر على أجهزة فعلية كجزء من هذا الدرس.',
        },
        {
          type: 'code',
          label: 'CDP verification commands',
          language: 'text',
          code: `show cdp
show cdp neighbors
show cdp neighbors detail
show cdp interface
show cdp traffic`,
        },
        { type: 'table', headers: ['الأمر', 'ما الذي يوضحه؟', 'متى تستخدمه؟'], rows: cdpShowRows },
        {
          type: 'code',
          label: 'Enabling and disabling CDP globally and per interface',
          language: 'text',
          code: `configure terminal
 cdp run
 end

configure terminal
 no cdp run
 end

configure terminal
 interface GigabitEthernet0/1
  cdp enable
 end

configure terminal
 interface GigabitEthernet0/1
  no cdp enable
 end`,
        },
        { type: 'table', headers: ['الأمر', 'الوظيفة', 'تنبيه'], rows: cdpConfigRows },
        {
          type: 'paragraph',
          text: '`cdp run` يتحكم في CDP على مستوى الجهاز، بينما `cdp enable` و`no cdp enable` يتحكمان في منفذ واحد. لو CDP متوقف globally، فإن تفعيله على منفذ واحد لا يكفي؛ لازم تشغيله عاماً أولاً على المنصات التي تستخدم هذا النموذج.',
        },
        {
          type: 'code',
          label: 'LLDP verification commands',
          language: 'text',
          code: `show lldp
show lldp neighbors
show lldp neighbors detail
show lldp interface
show lldp traffic`,
        },
        { type: 'table', headers: ['الأمر', 'ما الذي يوضحه؟', 'متى تستخدمه؟'], rows: lldpShowRows },
        {
          type: 'code',
          label: 'Enabling LLDP and controlling transmit/receive per interface',
          language: 'text',
          code: `configure terminal
 lldp run
 end

configure terminal
 no lldp run
 end

configure terminal
 interface GigabitEthernet0/1
  lldp transmit
  lldp receive
 end

configure terminal
 interface GigabitEthernet0/1
  no lldp transmit
 end

configure terminal
 interface GigabitEthernet0/1
  no lldp receive
 end`,
        },
        { type: 'table', headers: ['الأمر', 'الوظيفة', 'تنبيه'], rows: lldpConfigRows },
        {
          type: 'paragraph',
          text: '**LLDP transmit** يرسل معلومات هذا الجهاز إلى الجار. **LLDP receive** يعالج ما يرسله الجار ويملأ جدول الجيران. على المنصات التي تدعم الفصل بينهما يمكن ضبط كل اتجاه بشكل مستقل، لذلك قد ترى الجار بينما لا يراك، أو العكس.',
        },
        {
          type: 'code',
          label: 'Educational example outputs - not captured from real hardware',
          language: 'text',
          code: `SW1# show cdp neighbors
Capability Codes: R - Router, S - Switch

Device ID   Local Intrfce   Holdtme   Capability   Platform     Port ID
R1          Gi0/1           154       R            ISR4331      Gi0/0
SW2         Gi0/24          172       S            WS-C2960     Gi0/24

SW1# show cdp neighbors detail
-------------------------
Device ID: R1
Entry address(es):
  IP address: 10.0.0.1
Platform: Cisco ISR4331, Capabilities: Router
Interface: GigabitEthernet0/1, Port ID (outgoing port): GigabitEthernet0/0
Holdtime: 154
Version: educational example, not a real hardware capture
Native VLAN: 99 (where advertised)

SW1# show lldp neighbors
Local Intf   Neighbor Device ID   Neighbor Port ID   TTL
Gi0/1        R1                   Gi0/0              118
Gi0/24       SW2                  Gi0/24             121

SW1# show lldp neighbors detail
------------------------------------------------
Chassis ID: 00:11:22:33:44:55
Port ID: Gi0/0
Port Description: educational uplink
System Name: R1
System Description: Cisco IOS educational example
System Capabilities: Router
Management Address: 10.0.0.1 (when advertised)
Time To Live: 118`,
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'تنبيه تعليمي صريح',
          text: 'كل العينات أعلاه educational examples وليست captured من جهاز حقيقي. لا تعتبر رقم منفذ أو إصدار أو حقل ظاهر قاعدة ثابتة؛ تحقق دائماً من المنصة والإصدار ومن الإخراج الفعلي في بيئة التدريب.',
        },
      ],
    },
    {
      id: 'exam',
      title: 'Practical Network Discovery Labs and Troubleshooting',
      short: 'لابات + أخطاء',
      blocks: [
        {
          type: 'paragraph',
          text: '**Lab 1 - Discover Neighbors Using CDP (Packet Tracer-style / conceptual)**',
        },
        { type: 'table', headers: ['Device', 'Local Port', 'Connected To', 'Role'], rows: lab1Rows },
        {
          type: 'steps',
          items: [
            { title: 'Topology', text: 'سويتشان Cisco بينهما link مباشر، مع router اختياري متصل بأحد السويتشين. لم يتم تنفيذ اللاب فعلياً؛ هذا تمرين Packet Tracer-style تعليمي.' },
            { title: 'Task 1', text: 'تحقق من الحالة العامة بـ `show cdp`.' },
            { title: 'Task 2', text: 'افحص الجيران بـ `show cdp neighbors` وحدد local interface وremote port.' },
            { title: 'Task 3', text: 'اعرض التفاصيل بـ `show cdp neighbors detail` ولاحظ Platform وVersion وIP عند توفرها.' },
            { title: 'Task 4', text: 'سجّل Device ID لكل جار وقارنه بالطوبولوجيا المتوقعة.' },
            { title: 'Task 5', text: 'من SW1، نفّذ `configure terminal` ثم `interface GigabitEthernet0/24` ثم `no cdp enable`.' },
            { title: 'Task 6', text: 'راقب `show cdp neighbors` على SW2؛ يجب أن يختفي جار SW1 من هذا الرابط بعد انتهاء الـ holdtime إذا توقفت الإعلانات.' },
            { title: 'Task 7', text: 'أعد `cdp enable` على المنفذ وتحقق من عودة الجار.' },
            { title: 'Honesty note', text: 'اللاب تعليمي ولم يُشغّل داخل Packet Tracer أو على أجهزة فعلية؛ النتائج متوقعة وليست مخرجات مُنفَّذة.' },
          ],
        },
        {
          type: 'paragraph',
          text: '**Lab 2 - Discover Neighbors Using LLDP (Packet Tracer-style / conceptual)**',
        },
        { type: 'table', headers: ['Device', 'Local Port', 'Connected To', 'Role'], rows: lab2Rows },
        {
          type: 'steps',
          items: [
            { title: 'Topology', text: 'Cisco switch وCisco router أو جهاز متوافق مع LLDP، بينهما link مباشر. تمرين Packet Tracer-style ولم يُنفّذ فعلياً.' },
            { title: 'Task 1', text: 'شغّل LLDP عاماً بـ `configure terminal` ثم `lldp run`.' },
            { title: 'Task 2', text: 'تأكد من `lldp transmit` و`lldp receive` على المنفذ المتصل حيث يدعم الجهاز ذلك.' },
            { title: 'Task 3', text: 'افحص `show lldp neighbors` وحدد Chassis ID أو System Name وPort ID وTTL.' },
            { title: 'Task 4', text: 'استخدم `show lldp neighbors detail` لقراءة TLVs مثل System Description وCapabilities وManagement Address عند وجودها.' },
            { title: 'Task 5', text: 'عطّل الإرسال من أحد الطرفين بـ `no lldp transmit` وتوقع أن يختفي هذا الجهاز من جدول الطرف الآخر بعد انتهاء TTL.' },
            { title: 'Task 6', text: 'لاحظ أن استقبالك أنت قد يظل يعمل؛ transmit وreceive اتجاهان منفصلان على المنصات التي تدعم ذلك.' },
            { title: 'Task 7', text: 'أعد `lldp transmit` وتحقق من عودة الجار في `show lldp neighbors`.' },
            { title: 'Honesty note', text: 'لم يتم تشغيل اللاب فعلياً؛ كل الملاحظات متوقعة من سلوك LLDP الموصوف تعليمياً.' },
          ],
        },
        {
          type: 'paragraph',
          text: '**Lab 3 - Multi-Vendor Discovery (Conceptual)**',
        },
        {
          type: 'steps',
          items: [
            { title: 'Topology', text: 'Cisco switch متصل بـ switch غير Cisco يدعم LLDP. تمرين مفاهيمي فقط ولم يُنفّذ على أجهزة فعلية.' },
            { title: 'Task 1', text: 'اشرح ليه CDP قد لا يكون متاحاً على الجهاز غير Cisco: لأنه Cisco proprietary ومش معيار متعدد البائعين.' },
            { title: 'Task 2', text: 'فعّل LLDP على الأجهزة المتوافقة من الطرفين، وتحقق من transmit وreceive حيث يتوفران.' },
            { title: 'Task 3', text: 'قارن `show lldp neighbors` على Cisco بجدول الجيران على الجهاز الآخر إن وُجد.' },
            { title: 'Task 4', text: 'قارن المعلومات التي تعلمتها عبر CDP مع LLDP: كلاهما يحدد الجار والمنفذ، لكن LLDP يستخدم TLVs قياسية ويعمل عبر البائعين.' },
            { title: 'Honesty note', text: 'هذا لاب مفاهيمي؛ لم يتم تشغيله في Packet Tracer، وقد تختلف أوامر الجهاز غير Cisco تماماً.' },
          ],
        },
        {
          type: 'diagram',
          id: 'multi-vendor-discovery',
          caption: 'CDP يعمل بين الأجهزة الداعمة له، بينما LLDP يسد الفجوة مع الأجهزة غير Cisco.',
        },
        {
          type: 'diagram',
          id: 'topology-discovery',
          caption: 'تجميع جيران CDP وLLDP يساعد في بناء خريطة روابط مباشرة، ضمن حدود Layer 2.',
        },
        {
          type: 'paragraph',
          text: '**الأخطاء الشائعة**',
        },
        {
          type: 'list',
          items: [
            'CDP متوقف globally: الحل `show cdp` ثم `cdp run` حيث مدعوم.',
            'CDP متوقف على interface واحد: الحل `cdp enable` تحت المنفذ الصحيح بعد التأكد من الحالة العامة.',
            'LLDP متوقف globally: الحل `show lldp` ثم `lldp run`.',
            'LLDP transmit متوقف: الجهاز لا يرسل معلوماته، لذا لن يراه الجار عبر LLDP؛ الحل `lldp transmit`.',
            'LLDP receive متوقف: الجهاز لا يعالج إعلانات الجار، لذا لن يظهر الجار في جدولك؛ الحل `lldp receive`.',
            'الجهاز المجاور لا يدعم البروتوكول: استخدم LLDP في البيئة متعددة البائعين وتحقق من دعم الطرفين.',
            'المنفذ down أو shutdown: لا إعلانات ولا جيران؛ تحقق من حالة interface أولاً.',
            'إدخال الجار انتهى: تحقق من holdtime في CDP أو TTL في LLDP ومن وصول إعلانات جديدة.',
            'الخلط بين advertisement interval وholdtime/TTL: الأول متى يُرسل، والثاني إلى متى يُحتفظ بالمعلومة.',
            'الافتراض أن الاكتشاف يعبر routers: بروتوكولات الاكتشاف تعمل للجيران المباشرين على Layer 2 غالباً.',
            'الخلط بين CDP وLLDP: CDP Cisco proprietary بـ CDP fields؛ LLDP IEEE 802.1AB بـ TLVs.',
          ],
        },
        {
          type: 'paragraph',
          text: '**Troubleshooting Workflow**',
        },
        {
          type: 'steps',
          items: [
            { title: '1', text: '**Physical interface status**: تحقق من أن المنفذ up وline protocol up، ومن عدم وجود shutdown أو مشكلة كابل.' },
            { title: '2', text: '**Global protocol status**: افحص `show cdp` أو `show lldp` وتأكد من تشغيل البروتوكول على الجهاز.' },
            { title: '3', text: '**Interface-level settings**: راجع `show cdp interface` أو `show lldp interface` للمنفذ المعني.' },
            { title: '4', text: '**Transmit and receive**: للـ LLDP تحديداً تأكد من `lldp transmit` و`lldp receive` على الطرف الصحيح.' },
            { title: '5', text: '**Neighbor tables**: افحص `show cdp neighbors` و`show lldp neighbors` وقارن النتيجة بالطوبولوجيا المتوقعة.' },
            { title: '6', text: '**Detailed neighbor information**: استخدم `show cdp neighbors detail` أو `show lldp neighbors detail` للتحقق من الاسم والمنفذ والقدرات.' },
            { title: '7', text: '**Protocol compatibility**: أكد أن الطرف الآخر يدعم نفس البروتوكول وأنه مُفعّل؛ في البيئة المختلطة جرّب LLDP.' },
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'لا تفترض تنفيذ اللابات',
          text: 'اللابات في هذا الدرس Packet Tracer-style أو conceptual. لم يتم تشغيلها أو التقاط مخرجاتها من أجهزة حقيقية، وقد لا تدعم كل صور Packet Tracer أو كل المنصات كل أمر مذكور.',
        },
      ],
    },
    {
      id: 'summary',
      title: 'CCNA Exam Review and Summary',
      short: 'المراجعة + الاختبار',
      blocks: [
        {
          type: 'list',
          items: [
            'Discovery protocols يعرّفون **directly connected Layer 2 neighbors**، وليس كل الأجهزة عبر شبكة routing.',
            'CDP Cisco proprietary وLayer 2، وجهته multicast MAC `01:00:0C:CC:CC:CC`، ولا يُ routed مثل IP.',
            'CDP يعمل على منافذ مدعومة مع أو بدون IP، ويسجل الجيران في neighbor table حتى ينتهي الـ holdtime.',
            'قيم CDP الشائعة educational defaults: advertisement 60s وholdtime 180s، لكنها قابلة للضبط ومختلفة حسب المنصة.',
            'LLDP معيار IEEE 802.1AB، vendor-neutral، يستخدم TLVs مثل Chassis ID وPort ID وTTL وSystem Name وCapabilities.',
            'Multicast MACs للـ LLDP: nearest bridge `01:80:C2:00:00:0E`، nearest non-TPMR bridge `01:80:C2:00:00:03`، nearest customer bridge `01:80:C2:00:00:00`.',
            'LLDP advertisement interval وTTL ليسا نفس الشيء؛ TTL هو مدة بقاء المعلومة عند المستقبل.',
            'التحقق: `show cdp` و`show cdp neighbors` و`show cdp neighbors detail` و`show cdp interface` و`show cdp traffic`.',
            'التحقق: `show lldp` و`show lldp neighbors` و`show lldp neighbors detail` و`show lldp interface` و`show lldp traffic`.',
            'التفعيل العام: `cdp run` أو `lldp run`؛ وإيقافه بـ `no cdp run` أو `no lldp run`.',
            'على المنفذ: `cdp enable` / `no cdp enable`، و`lldp transmit` / `lldp receive` مع صيغ `no` حيث مدعوم.',
            'LLDP هو الخيار متعدد البائعين؛ يجوز تشغيل CDP وLLDP معاً على منصات تدعم ذلك، وكل واحد جدوله منفصل.',
            'توفر الأوامر والمخرجات platform/version dependent، وكل أمثلة هذا الدرس تعليمية وليست التقاطاً من hardware حقيقي.',
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
              prompt: 'أي عبارة عن CDP صحيحة؟',
              options: [
                'بروتوكول Cisco proprietary يعمل على Layer 2 ويرسل إعلانات إلى الجيران المتصلين مباشرة، ويمكن أن يعمل على منافذ مدعومة بدون عنوان IP.',
                'بروتوكول معياري IEEE 802.1AB يتم توجيهه عبر شبكة IP للوصول إلى أجهزة بعيدة.',
                'بروتوكول يعمل فقط إذا كان لكل منفذ عنوان IP إداري.',
                'بروتوكول يستخدم TLVs قياسية ليحل محل LLDP في البيئات متعددة البائعين.',
              ],
              correctIndex: 0,
              requireSubmit: true,
              explanation:
                'الصح هو **(A)**. CDP Cisco proprietary وLayer 2، يرسل إلى جيران مباشرين باستخدام multicast MAC `01:00:0C:CC:CC:CC`، ولا يحتاج عنوان IP على المنفذ ليعمل على منفذ مدعوم.',
            },
            {
              id: 'q2',
              kind: 'multiple',
              prompt: 'أي عبارات عن LLDP صحيحة؟ (اختر أكثر من إجابة)',
              options: [
                'معرّف كمعيار IEEE 802.1AB.',
                'vendor-neutral ويعمل بين أجهزة من بائعين مختلفين عند توافق الطرفين.',
                'يحمل المعلومات في حقول TLV مثل Chassis ID وPort ID وTTL.',
                'يتطلب أن تكون جميع الأجهزة من Cisco ليعمل.',
              ],
              correctIndices: [0, 1, 2],
              requireSubmit: true,
              explanation:
                'الصح هو **(A) و(B) و(C)**. LLDP معيار IEEE 802.1AB متعدد البائعين ويستخدم TLVs. لا يشترط أن تكون الأجهزة من Cisco، بل يكفي دعم LLDP وتفعيله على الطرفين.',
            },
            {
              id: 'q3',
              prompt: 'سويتش Cisco متصل بـ switch من بائع آخر. أي بروتوكول اكتشاف هو الأنسب لاكتشاف الجار عبر البائعين؟',
              options: [
                'CDP فقط، لأنه Cisco proprietary.',
                'LLDP، بشرط أن يدعمه الطرفان ويكون مُفعّلاً.',
                'ARP، لأنه يعمل على Layer 2 بين كل البائعين.',
                'STP، لأنه يرسل BPDU إلى كل المنافذ.',
              ],
              correctIndex: 1,
              requireSubmit: true,
              explanation:
                'الصح هو **(B)**. LLDP هو معيار vendor-neutral، لذلك يُستخدم في البيئات متعددة البائعين عندما يدعمه الطرفان. CDP قد لا يكون متاحاً على الجهاز غير Cisco.',
            },
            {
              id: 'q4',
              kind: 'multiple',
              prompt: 'أي معلومات يمكن تعلمها من جار مباشر عبر CDP أو LLDP؟ (اختر أكثر من إجابة)',
              options: [
                'Device ID أو System Name وCapabilities.',
                'Local Interface والمنفذ البعيد Remote Port ID.',
                'Platform وSoftware Version وManagement IP عند الإعلان عنها.',
                'جدول التوجيه الكامل لكل الشبكات خلف الجار.',
              ],
              correctIndices: [0, 1, 2],
              requireSubmit: true,
              explanation:
                'الصح هو **(A) و(B) و(C)**. بروتوكولات الاكتشاف تعرّف الجهاز والمنافذ والقدرات والمعلومات المُعلنة مثل الإصدار أو IP. لا تعطي جدول توجيه كاملاً للشبكة بأكملها.',
            },
            {
              id: 'q5',
              kind: 'multiple',
              prompt: 'أي أوامر Cisco IOS تخص configuration أو verification لبروتوكولات الاكتشاف؟ (اختر أكثر من إجابة)',
              options: [
                '`show cdp neighbors` و`show cdp neighbors detail`.',
                '`show lldp neighbors` و`show lldp neighbors detail`.',
                '`cdp run` أو `lldp run` في global configuration، و`cdp enable` أو `lldp transmit` على المنفذ حيث مدعوم.',
                '`show ip route` لعرض جيران CDP وLLDP.',
              ],
              correctIndices: [0, 1, 2],
              requireSubmit: true,
              explanation:
                'الصح هو **(A) و(B) و(C)**. هذه أوامر CDP وLLDP المعروفة على Cisco IOS حسب المنصة والإصدار. `show ip route` يعرض مسارات Layer 3 وليس جيران الاكتشاف.',
            },
          ],
        },
      ],
    },
  ],
}
