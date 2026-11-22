import type { Lesson } from '../types'

const accessTrunkRows: string[][] = [
  ['Access Port', 'Normally carries traffic for one Data VLAN', 'Commonly connects PCs, printers, IP phones, and other end devices', 'Frames are normally untagged on the end-device side'],
  ['Trunk Port', 'Carries traffic for multiple VLANs over one physical link', 'Commonly connects switch to switch, or switch to router/firewall/AP in other topics', 'Uses VLAN tagging to identify VLAN membership'],
]

const dot1qFieldRows: string[][] = [
  ['TPID', 'Tag Protocol Identifier', '16 bits (2 bytes)', 'Commonly `0x8100`; identifies the frame as IEEE 802.1Q tagged'],
  ['PCP', 'Priority Code Point', '3 bits', 'Used for Class of Service and priority handling'],
  ['DEI', 'Drop Eligible Indicator', '1 bit', 'Indicates whether the frame may be dropped under congestion'],
  ['VID', 'VLAN Identifier', '12 bits', 'Carries the VLAN number used for forwarding decisions'],
]

const trunkCommandRows: string[][] = [
  ['`configure terminal`', 'Enters global configuration mode.', 'Changes are made in the running configuration.'],
  ['`interface GigabitEthernet0/1`', 'Enters interface configuration mode for the inter-switch link.', 'Apply trunk commands to the correct physical port on both switches.'],
  ['`switchport mode trunk`', 'Sets the port to trunk mode.', 'A trunk can carry multiple VLANs with 802.1Q tags where supported.'],
  ['`switchport trunk native vlan 99`', 'Sets VLAN 99 as the native VLAN on this trunk.', 'Must match on the other end of the link.'],
  ['`no shutdown`', 'Ensures the interface is administratively up.', 'A shutdown port cannot forward frames.'],
  ['`end`', 'Returns to privileged EXEC mode.', 'Use `show interfaces trunk` to verify the result.'],
]

const allowedCommandRows: string[][] = [
  ['`switchport trunk allowed vlan 10,20,99`', 'Replaces the allowed VLAN list with exactly these VLANs.', 'Use carefully: VLANs not listed are removed from the list.'],
  ['`switchport trunk allowed vlan add 30`', 'Adds VLAN 30 to the existing allowed list.', 'Does not remove VLANs already configured.'],
  ['`switchport trunk allowed vlan remove 20`', 'Removes VLAN 20 from the existing allowed list.', 'Does not rewrite the rest of the list.'],
]

const dtpModeRows: string[][] = [
  ['access', 'Forces access mode'],
  ['trunk', 'Forces trunk mode'],
  ['dynamic auto', 'Passively waits for negotiation'],
  ['dynamic desirable', 'Actively attempts to negotiate a trunk'],
]

const verificationRows: string[][] = [
  ['`show interfaces trunk`', 'Trunk status, encapsulation, native VLAN, allowed VLANs, and VLANs active on the trunk', 'First check after trunk configuration'],
  ['`show interfaces GigabitEthernet0/1 switchport`', 'Administrative and operational switchport mode, native VLAN, and voice VLAN details', 'Confirms how the port is operating'],
  ['`show interfaces GigabitEthernet0/1`', 'Physical and logical interface status, line protocol, duplex, speed, and counters', 'Checks whether the link is up and healthy'],
  ['`show vlan brief`', 'VLAN numbers, names, status, and assigned ports', 'Confirms VLANs exist on both switches'],
  ['`show running-config interface GigabitEthernet0/1`', 'Configured commands under one interface', 'Confirms what was actually configured'],
  ['`show dtp interface GigabitEthernet0/1`', 'DTP mode and negotiation information where supported', 'Useful when DTP is in use or being troubleshooted'],
]

const labTopologyRows: string[][] = [
  ['SW1', 'Gi0/1', 'PC-A', '10'],
  ['SW1', 'Gi0/2', 'PC-C', '20'],
  ['SW1', 'Gi0/24', 'SW2 Gi0/24 trunk', '10,20,99'],
  ['SW2', 'Gi0/1', 'PC-B', '10'],
  ['SW2', 'Gi0/2', 'PC-D', '20'],
  ['SW2', 'Gi0/24', 'SW1 Gi0/24 trunk', '10,20,99'],
]

export const topic22Lesson: Lesson = {
  topicId: '2.2',
  title: 'Configure and Verify Inter-Switch Connectivity',
  description:
    'Packet 2.2 نكمّل قصة الـ VLANs عبر سويتشات متعددة. هنفهم ليه الـ trunk ضروري، وإزاي 802.1Q بيوسّم الإطارات، وإيه الفرق بين access وtrunk، وازاي نتعامل مع Native VLAN وAllowed VLAN Lists وDTP. هنراجع أوامر التحقق ولابين عملية و5 أسئلة CCNA بدون أي تعديل على Topic 2.3.',
  estimatedTime: '~120 دقيقة',
  steps: [
    {
      id: 'what',
      title: 'ليه السويتشات محتاجة inter-switch connectivity؟',
      short: 'المقدمة',
      blocks: [
        {
          type: 'paragraph',
          text: 'في Topic 2.1 نجحنا نفصل broadcast domains على سويتش واحد. بس في شبكة حقيقية غالباً فيه **أكتر من access switch**، وغالباً نفس القسم هيكون موزّع على أكتر من سويتش. لازم نوصّل السويتشات ببعض عشان المستخدمين يفضلوا في نفس الـ VLAN حتى لو كانوا على أجهزة فيزيائية مختلفة.',
        },
        {
          type: 'diagram',
          id: 'two-switches-connected',
          caption: 'سويتشان، أربعة PCs، VLAN 10 وVLAN 20، ورابط واحد بين السويتشين لازم يحمل الاتنين.',
        },
        {
          type: 'list',
          items: [
            '**نفس الـ VLAN عبر سويتشات مختلفة**: PC-A في VLAN 10 على SW1 لازم يوصل لـ PC-B في VLAN 10 على SW2.',
            '**فصل منطقي**: PC-C في VLAN 20 وPC-D في VLAN 20 لازم يتواصلوا كمان من غير ما حركة VLAN 10 تختلط بيهم.',
            '**رابط فيزيائي واحد غالباً**: بين السويتشين فيه link واحد، فمش كافي نخصصه لـ VLAN واحد فقط.',
            '**الحل الشائع**: نخلي الـ inter-switch link يعمل **Trunk Port** يحمل عدة VLANs.',
            '**الحفاظ على الـ separation**: الترنك بيوسّم كل إطار برقم الـ VLAN عشان الطرف التاني يعرف يتعامل معاه صح.',
          ],
        },
        {
          type: 'paragraph',
          text: 'لو افترضنا إن الرابط بين SW1 وSW2 access port عادي، فهيتعامل كأنه عضو في VLAN واحد بس. في الحالة دي حركة VLAN التاني مش هتمر، أو هتتبعت في VLAN غلط. عشان كده الترنك هو الأساس اللي بيخلّي **VLANs extend across multiple switches**.',
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'الفكرة الأساسية',
          text: 'الترنك مش راوتر؛ هو رابط Layer 2 بيحمل إطارات عدة VLANs ويحافظ على هوية كل VLAN. التواصل بين VLANs مختلفة لسه محتاج Layer 3 routing في topic لاحق أو بـ router/L3 switch.',
        },
      ],
    },
    {
      id: 'how',
      title: 'Access Ports مقابل Trunk Ports',
      short: 'Access وTrunk',
      blocks: [
        {
          type: 'paragraph',
          text: 'قبل أي configuration لازم تفرق بين وظيفتين مختلفتين للمنفذ: **Access Port** بيخدم جهاز نهائي، و**Trunk Port** بيحمل عدة VLANs بين أجهزة الشبكة. الفرق ظاهر في شكل الإطار على الرابط.',
        },
        { type: 'table', headers: ['المنفذ', 'عدد الـ VLANs', 'أين يُستخدم غالباً؟', 'شكل الإطار'], rows: accessTrunkRows },
        {
          type: 'diagram',
          id: 'access-vs-trunk-port',
          caption: 'على اليسار access port بإطار untagged من PC، وعلى اليمين trunk port بإطار tagged بين سويتشين.',
        },
        {
          type: 'paragraph',
          text: '**Access port**: لما PC يبعت frame، الإطار بيوصل للسويتش **untagged**. السويتش يعرف إنه تابع لـ VLAN 10 لأن المنفذ نفسه عضو في VLAN 10. لما السويتش يبعت الإطار للـ PC، غالباً يشيل أي سياق VLAN داخلي ويبعت إطار Ethernet عادي.',
        },
        {
          type: 'paragraph',
          text: '**Trunk port**: الإطار الخارج من SW1 على الترنك بياخد **802.1Q tag** فيه VID. SW2 يقرأ الـ VID ويعرف إن الإطار جوّه VLAN 10 أو VLAN 20. بكده رابط فيزيائي واحد يقدر يحمل أكتر من VLAN في نفس الوقت.',
        },
        {
          type: 'list',
          items: [
            'Access = Data VLAN واحد غالباً + أجهزة نهائية + إطارات untagged.',
            'Trunk = عدة VLANs + أجهزة شبكية + إطارات tagged.',
            'Native VLAN على الترنك حالة خاصة للإطارات untagged؛ هتشرح في الخطوة 5.',
            'Voice VLAN على منفذ access مع IP Phone مش معناه إن المنفذ trunk عادي.',
            'الـ trunk ممكن يتوصل بrouter أو firewall أو AP حسب التصميم، بس أشهر استخدام في Topic 2.2 هو switch-to-switch.',
          ],
        },
      ],
    },
    {
      id: 'packet',
      title: 'IEEE 802.1Q Encapsulation',
      short: '802.1Q',
      blocks: [
        {
          type: 'paragraph',
          text: '**IEEE 802.1Q** هو المعيار المستخدم لـ VLAN tagging على Ethernet. لما إطار يمر على trunk port، السويتش يضيف tag صغير عشان الطرف التاني يعرف أي VLAN ينتمي له الإطار. الـ tag بيُضاف على الـ trunk فقط، مش على رابط الـ end device العادي.',
        },
        {
          type: 'diagram',
          id: 'frame-8021q-tagging',
          caption: 'الإطار قبل وبعد 802.1Q tagging: الـ tag يُضاف بعد Source MAC وقبل EtherType الأصلي.',
        },
        {
          type: 'paragraph',
          text: 'الـ 802.1Q tag بيضيف **4 bytes** لطول الإطار. مكانه بعد **Source MAC Address** وقبل الـ EtherType الأصلي. لو الإطار كان untagged، السويتش يقدر يضيف الـ tag وهو بيخرّجه على الترنك؛ وسويتش الاستقبال يقرأ الـ tag ويشيله قبل ما يبعت الإطار لجهاز نهائي على access port.',
        },
        { type: 'table', headers: ['الحقل', 'الاسم', 'الحجم', 'الوظيفة'], rows: dot1qFieldRows },
        {
          type: 'diagram',
          id: 'dot1q-tag-fields',
          caption: 'تفكيك حقول الـ tag: TPID وPCP وDEI وVID.',
        },
        {
          type: 'list',
          items: [
            '**TPID** commonly `0x8100` وبيقول إن الإطار 802.1Q tagged.',
            '**PCP** طوله 3 bits وبيستخدم لـ priority وClass of Service.',
            '**DEI** طوله 1 bit وبيوضح لو الإطار قابل للإسقاط عند الازدحام.',
            '**VID** طوله 12 bits وبيحمل رقم الـ VLAN.',
            'VLAN ID 0 و4095 محجوزين، والـ usable range غالباً 1–4094 مع مراعاة دعم المنصة والرنجات المحجوزة.',
            'سويتش الاستقبال بيقرأ VID، يتخذ قرار التوجيه داخل الـ VLAN، وبعدين يشيل الـ tag قبل access port.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'نقطة امتحانية',
          text: 'الـ tag مش عنوان IP ومش MAC. هو حقل Layer 2 جوّه الإطار بيحدد VLAN membership على الـ trunk. الـ VID هو الجزء اللي بيحمل رقم الـ VLAN.',
        },
      ],
    },
    {
      id: 'config',
      title: 'كيف الترنك يحمل عدة VLANs؟',
      short: 'Frame Flow',
      blocks: [
        {
          type: 'paragraph',
          text: 'خلينا نمشي خطوة بخطوة مع VLAN 10. المصدر PC-A على SW1، والوجهة PC-B على SW2، الاتنين في VLAN 10. الهدف إن الإطار يوصل صح من غير ما يختلط مع VLAN 20.',
        },
        {
          type: 'steps',
          items: [
            { title: '1', text: '**PC-A** يبعت frame في VLAN 10 منaccess port Gi0/1 على SW1.' },
            { title: '2', text: '**SW1** يستلم الإطار untagged ويربطه بـ VLAN 10 من عضوية المنفذ.' },
            { title: '3', text: '**SW1** يوجّه الإطار عبر الـ trunk Gi0/24.' },
            { title: '4', text: 'على الـ trunk، SW1 يضيف **802.1Q tag** فيه VID 10.' },
            { title: '5', text: '**SW2** يستلم الإطار التagged على trunk port ويقرأ VID 10.' },
            { title: '6', text: '**SW2** يعرف إن الإطار جوّه VLAN 10 ويتخذ قرار forwarding داخل VLAN 10.' },
            { title: '7', text: '**SW2** يشيل الـ tag ويبعت الإطار untagged من access port Gi0/1 لـ **PC-B**.' },
          ],
        },
        {
          type: 'diagram',
          id: 'vlan10-crossing-trunk',
          caption: 'VLAN 10 يبدأ untagged على access، يتوسم VID 10 على الترنك، ثم يرجع untagged عند PC-B.',
        },
        {
          type: 'paragraph',
          text: 'نكرر نفس الفكرة مع VLAN 20: PC-C على SW1 يبعت إطار من Gi0/2، SW1 يوسّمه بـ **VID 20** على الترنك، SW2 يقرأ VID 20 ويبعت الإطار لـ PC-D على access port Gi0/2. الإطارين بيشتبهوا في نفس الرابط الفيزيائي، بس الـ VID بيخليهم منفصلين منطقياً.',
        },
        {
          type: 'diagram',
          id: 'multiple-vlans-one-trunk',
          caption: 'نفس الترنك يحمل VLAN 10 وVLAN 20، وكل إطار عليه VID مختلف يحدد وجهته.',
        },
        {
          type: 'paragraph',
          text: '**Packet flow كامل**: المصدر هو PC-A / VLAN 10 / SW1 Gi0/1، والوجهة PC-B / VLAN 10 / SW2 Gi0/1. الرابط بين السويتشين trunk، فـ Layer 2 forwarding ممكن. أما لو حاولنا نبعت من PC-A VLAN 10 إلى PC-D VLAN 20، فالإجابة: Layer 2 forwarding غير ممكن، وLayer 3 routing مطلوب.',
        },
        {
          type: 'diagram',
          id: 'end-to-end-two-switches',
          caption: 'نفس الـ VLAN عبر سويتشات يشتغل على Layer 2؛ VLANs مختلفة محتاجة routing.',
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'قاعدة الترنك',
          text: 'الـ VLAN tag موجود على الـ trunk link Mostly، ويُشال قبل الإرسال لجهاز متصل بـ access port. الترنك بيحافظ على الفصل بين VLANs، لكنه مش بيعمل route بينهم.',
        },
      ],
    },
    {
      id: 'verify',
      title: 'Native VLAN',
      short: 'Native VLAN',
      blocks: [
        {
          type: 'paragraph',
          text: '**Native VLAN** هي الـ VLAN اللي بترتبط بيها الإطارات **untagged** اللي بتوصل على trunk port. في إعداد Cisco 802.1Q شائع، حركة الـ Native VLAN بتتبعت **untagged** على الترنك، وده سبب وجودها في الأصل: التوافق مع الأجهزة أو الروابط اللي مش بتبعت tags.',
        },
        {
          type: 'list',
          items: [
            'إطار untagged وصل على trunk → السويتش يعتبره تابع للـ Native VLAN المكوّن على المنفذ.',
            'إطار تابع للـ Native VLAN بيتبعت untagged افتراضياً في أغلب إعدادات Cisco 802.1Q.',
            'لازم الـ Native VLAN يتطابق على الطرفين.',
            'مismatch بيسبب تسريب منطقي بين VLANs، ومشاكل connectivity، وتحذيرات STP على بعض المنصات.',
            'من الناحية الأمنية، يفضّل استخدام VLAN مخصص غير مستخدم للمستخدمين، وتقييد الـ allowed VLAN list.',
          ],
        },
        {
          type: 'code',
          label: 'Matching native VLAN configuration on both switches',
          language: 'text',
          code: `SW1(config)# interface GigabitEthernet0/1
SW1(config-if)# switchport trunk native vlan 99

SW2(config)# interface GigabitEthernet0/1
SW2(config-if)# switchport trunk native vlan 99`,
        },
        {
          type: 'diagram',
          id: 'native-vlan-untagged',
          caption: 'إطار untagged على الترنك بيُفسَّر كـ Native VLAN 99 على الطرفين.',
        },
        {
          type: 'paragraph',
          text: 'لو SW1 مكوّن native VLAN 99 وSW2 مكوّن native VLAN 100، إطار SW1 untagged هيوصل لـ SW2 ويتفسّر غلط إنه VLAN 100. بكده حركة من VLAN 99 "تهبط" في VLAN 100 على الطرف التاني. ده مش مجرد خطأ إعداد شكلي؛ ده خلط فعلي بين broadcast domains.',
        },
        {
          type: 'diagram',
          id: 'native-vlan-mismatch',
          caption: 'Native VLAN mismatch: إطار VLAN 99 untagged يوصل فيتفسّر كـ VLAN 100 على SW2.',
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'متخلطش Native وDefault',
          text: 'Default VLAN هو VLAN 1 على أغلب Catalyst والمنافذ تبدأ فيه غالباً. Native VLAN مفهوم خاص بـ 802.1Q trunk. ممكن يتصادفوا على نفس الرقم في بعض المنصات، بس هما مفهومان منفصلان تماماً.',
        },
      ],
    },
    {
      id: 'mistakes',
      title: 'Configuring Trunk Ports',
      short: 'Trunk Config',
      blocks: [
        {
          type: 'paragraph',
          text: 'إعداد الترنك على Cisco IOS بيتم من interface configuration mode. المثال ده يهيّئ الـ inter-switch link ويضبط native VLAN 99. لازم تعمل إعداد متوافق على الطرف التاني كمان.',
        },
        {
          type: 'code',
          label: 'Configuring an 802.1Q trunk on Cisco IOS',
          language: 'text',
          code: `configure terminal

interface GigabitEthernet0/1
 switchport mode trunk
 switchport trunk native vlan 99
 no shutdown

end`,
        },
        { type: 'table', headers: ['الأمر', 'الشرح', 'ملاحظة'], rows: trunkCommandRows },
        {
          type: 'steps',
          items: [
            { title: '1', text: 'ادخل `configure terminal`.' },
            { title: '2', text: 'ادخل على المنفذ المتصل بالسويتش التاني بـ `interface GigabitEthernet0/1`.' },
            { title: '3', text: 'اجعل المنفذ trunk بـ `switchport mode trunk`.' },
            { title: '4', text: 'طابق الـ native VLAN على الطرفين بـ `switchport trunk native vlan 99`.' },
            { title: '5', text: 'تأكد إن المنفذ مش shutdown.' },
            { title: '6', text: 'تحقق بـ `show interfaces trunk` و`show interfaces GigabitEthernet0/1 switchport`.' },
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Platform-dependent syntax',
          text: 'بعض سويتشات Cisco القديمة أو بعض المنصات بتطلب `switchport trunk encapsulation dot1q` قبل `switchport mode trunk`. كتير من Catalyst الحديثة بتدعم 802.1Q فقط ومفتاحش أمر الـ encapsulation نهائياً. مثال المنصة القديمة: `interface GigabitEthernet0/1` ثم `switchport trunk encapsulation dot1q` ثم `switchport mode trunk`. نفّذ الأمر ده فقط لو المنصة بتدعمه.',
        },
        {
          type: 'paragraph',
          text: 'لو رابط الترنك بين سويتش وسويتش، غالباً هتكرر نفس الخطوات على الطرفين. الفرق الوحيد المعتاد هو رقم المنفذ الفيزيائي؛ أما VLan IDs وnative VLAN فلازم يتطابقوا.',
        },
      ],
    },
    {
      id: 'lab',
      title: 'Allowed VLAN Lists',
      short: 'Allowed VLANs',
      blocks: [
        {
          type: 'paragraph',
          text: '**Allowed VLAN list** بتحدد أنهي VLANs مسموح لها تمر على الترنك. على أغلب Cisco switches، الترنك الافتراضي يسمح بكل الـ VLANs، بس مش كل VLAN محتاج يوصل لكل ترنك. تقليل القائمة بيقلل حركة غير ضرورية وبيوضّح التصميم وبيحسّن الأمان.',
        },
        {
          type: 'code',
          label: 'Replacing the allowed VLAN list',
          language: 'text',
          code: `interface GigabitEthernet0/1
 switchport trunk allowed vlan 10,20,99`,
        },
        {
          type: 'code',
          label: 'Adding and removing VLANs safely',
          language: 'text',
          code: `interface GigabitEthernet0/1
 switchport trunk allowed vlan add 30
 switchport trunk allowed vlan remove 20`,
        },
        { type: 'table', headers: ['الأمر', 'التأثير', 'تحذير'], rows: allowedCommandRows },
        {
          type: 'diagram',
          id: 'allowed-vlan-filtering',
          caption: 'الترنك يمرّر VLAN 10 و20 و99 فقط، ويوقف VLAN 30 لأنه مش في الـ allowed list.',
        },
        {
          type: 'list',
          items: [
            '`allowed vlan 10,20,99` **يستبدل** القائمة القديمة بالكامل.',
            '`allowed vlan add 30` يضيف VLAN للقائمة الحالية.',
            '`allowed vlan remove 20` يشيل VLAN من القائمة الحالية.',
            'لو VLAN غير موجود أصلاً على أحد السويتشين، هيفشل التواصل حتى لو الترنك up.',
            'راجع دايماً `show interfaces trunk` في عمود VLANs allowed وVLANs active.',
          ],
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'غلط شائع جداً',
          text: 'كتابة `switchport trunk allowed vlan 30` وهي متوقع تضيف VLAN 30 هتستبدل القائمة وتسمح بـ VLAN 30 فقط. استخدم `add` لو قصدك تضيف.',
        },
      ],
    },
    {
      id: 'exam',
      title: 'Dynamic Trunking Protocol (DTP)',
      short: 'DTP',
      blocks: [
        {
          type: 'paragraph',
          text: '**DTP (Dynamic Trunking Protocol)** بروتوكول **Cisco proprietary** بيسمح لمنفذين بتحليل trunk negotiation تلقائياً بدل ما المسؤول يكتب `switchport mode trunk` على الطرفين. توفره وسلوكه بيعتمدوا على المنصة وإصدار IOS، ومش كل سويتش يدعمه.',
        },
        { type: 'table', headers: ['Mode', 'Behavior'], rows: dtpModeRows },
        {
          type: 'diagram',
          id: 'dtp-negotiation',
          caption: 'Dynamic Desirable يبادر بالتفاوض وDynamic Auto يستجيب؛ النتيجة trunk.',
        },
        {
          type: 'list',
          items: [
            '**dynamic desirable + dynamic auto** → النتيجة غالباً trunk لأن desirable بيبادر.',
            '**dynamic auto + dynamic auto** → مفيش طرف بيبادر، فالنتيجة غالباً access / مفيش trunk.',
            '**trunk + access** → تعارض في الوضع؛ الترنك مش هيحمل VLANs متعددة عبر الطرف الـ access.',
            '**trunk صريح + nonegotiate** → سلوك متوقع، خصوصاً مع أجهزة غير Cisco أو منصات مش بتدعم DTP.',
            'لازم تتحقق من الحالة الفعلية بـ `show interfaces trunk` ومع DTP بـ `show dtp interface GigabitEthernet0/1` لو متاح.',
          ],
        },
        {
          type: 'diagram',
          id: 'dtp-mode-matrix',
          caption: 'مصفوفة نتائج DTP الشائعة مع تنبيه إن الدعم بيعتمد على المنصة.',
        },
        {
          type: 'code',
          label: 'Explicit trunk with DTP disabled on supported interfaces',
          language: 'text',
          code: `interface GigabitEthernet0/1
 switchport mode trunk
 switchport nonegotiate`,
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'يفضّل الصريح',
          text: '`switchport nonegotiate` بيوقف DTP negotiation على المنافذ اللي بتدعم الأمر، وبيُستخدم لما الترنك configured صراحة والpeer متوافق. في شبكات الإنتاج، الـ explicit trunk غالباً أفضل لأنه متوقع وأسهل في التحقق.',
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
          text: 'المخرجات في الخطوة دي **أمثلة تعليمية educational examples** وليست نتائج تنفيذ فعلية على=device Cisco حقيقي. شكل الـ output مختلف حسب المنصة والإصدار، بس المعاني ثابتة: هل الترنك up؟ إيه الـ encapsulation؟ إيه الـ native VLAN؟ أنهي VLANs مسموحة ونشطة؟ وهل DTP متاح أو متفاوض عليه؟',
        },
        {
          type: 'code',
          label: 'Cisco IOS verification commands',
          language: 'text',
          code: `show interfaces trunk
show interfaces GigabitEthernet0/1 switchport
show interfaces GigabitEthernet0/1
show vlan brief
show running-config interface GigabitEthernet0/1
show dtp interface GigabitEthernet0/1`,
        },
        { type: 'table', headers: ['الأمر', 'إيه اللي بيوضّحه؟', 'وقت استخدامه'], rows: verificationRows },
        {
          type: 'code',
          label: 'Educational examples - not captured results from real hardware',
          language: 'text',
          code: `SW1# show interfaces trunk

Port        Mode         Encapsulation  Status        Native vlan
Gi0/24      on           802.1q         trunking      99

Port        Vlans allowed on trunk
Gi0/24      10,20,99

Port        Vlans allowed and active in management domain
Gi0/24      10,20,99

Port        Vlans in spanning tree forwarding state and not pruned
Gi0/24      10,20,99

SW1# show interfaces GigabitEthernet0/1 switchport

Name: Gi0/1
Switchport: Enabled
Administrative Mode: trunk
Operational Mode: trunk
Administrative Trunking Encapsulation: dot1q
Operational Trunking Encapsulation: dot1q
Native VLAN: 99
Voice VLAN: none

SW1# show interfaces GigabitEthernet0/24

GigabitEthernet0/24 is up, line protocol is up (connected)
  Full-duplex, 1000Mb/s
  5 minutes input rate 12000 bits/sec, 15 packets/sec
  5 minutes output rate 12000 bits/sec, 15 packets/sec

SW1# show vlan brief

VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Gi0/3, Gi0/4
10   SALES                            active    Gi0/1, Gi0/24
20   HR                               active    Gi0/2, Gi0/24
99   NATIVE                           active    Gi0/24

SW1# show running-config interface GigabitEthernet0/24

interface GigabitEthernet0/24
 switchport trunk native vlan 99
 switchport trunk allowed vlan 10,20,99
 switchport mode trunk
end

SW1# show dtp interface GigabitEthernet0/24

DTP information for GigabitEthernet0/24:
  TOS/TAS/TNS:                              ON/ON/ON
  TOT/TAT/TNT:                              802.1Q/802.1Q/802.1Q
  Neighbor information: not available on this platform example`,
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'تنبيه تعليمي',
          text: 'كل اللي فوق educational examples مش captured من جهاز حقيقي. في `show interfaces trunk` ابحث عن Status = trunking وEncapsulation = 802.1q وNative vlan وallowed VLANs والـ VLANs النشطة. `show dtp interface` بيظهر DTP mode حيث يدعم المنصة ذلك فقط.',
        },
        {
          type: 'paragraph',
          text: '**Lab 1 - Configure an 802.1Q Trunk (Packet Tracer-style / conceptual)**',
        },
        { type: 'table', headers: ['Switch', 'Port', 'Connected To', 'VLAN'], rows: labTopologyRows },
        {
          type: 'steps',
          items: [
            { title: 'Topology', text: 'سويتشان Cisco، PC لكل VLAN على كل سويتش، ورابط واحد Gi0/24 بين السويتشين. لم يتم تنفيذ اللاب فعلياً في Packet Tracer؛ ده تمرين Packet Tracer-style تعليمي.' },
            { title: 'Task 1', text: 'اعمل `vlan 10` و`vlan 20` و`vlan 99` على SW1 وSW2.' },
            { title: 'Task 2', text: 'اجعل Gi0/1 access في VLAN 10 وGi0/2 access في VLAN 20 على السويتشين.' },
            { title: 'Task 3', text: 'اضبط Gi0/24 كترنك على الطرفين، وطابق `switchport trunk native vlan 99`.' },
            { title: 'Task 4', text: 'تحقق بـ `show interfaces trunk` و`show vlan brief`.' },
            { title: 'Task 5', text: 'تأكد إن VLAN 10 و20 ظهروا في VLANs allowed والـ active list على الترنك.' },
            { title: 'Task 6', text: 'اختبر ping بين PC-A وPC-B في VLAN 10، وبين PC-C وPC-D في VLAN 20 بعد إعداد IP صح.' },
            { title: 'Task 7', text: 'اشرح ليه PC-A في VLAN 10 وPC-D في VLAN 20 مش هيتواصلوا من غير Layer 3 routing.' },
            { title: 'Expected observation', text: 'الترنك يظهر trunking و802.1q وnative 99. الإطارات VLAN 10 و20 تعدي، وكل VLAN يفضل منفصل. ping بين VLANs مختلفة يفشل لحد ما يتضاف routing.' },
            { title: 'Honesty note', text: 'اللاب تعليمي conceptual ولم يُشغّل داخل Packet Tracer.' },
          ],
        },
        {
          type: 'paragraph',
          text: '**Lab 2 - Native VLAN and Allowed VLAN Troubleshooting (Packet Tracer-style / conceptual)**',
        },
        {
          type: 'steps',
          items: [
            { title: 'Topology', text: 'نفس طوبولوجيا Lab 1. تمرين Packet Tracer-style ولم يُنفّذ فعلياً في Packet Tracer.' },
            { title: 'Task 1', text: 'اضبط `switchport trunk native vlan 99` على طرفي الترنك.' },
            { title: 'Task 2', text: 'قيّد الترنك بـ `switchport trunk allowed vlan 10,99` على الطرفين.' },
            { title: 'Task 3', text: 'أدخل خطأ: خلي native VLAN على SW2 = 100. توقع الأعراض قبل التحقق.' },
            { title: 'Task 4', text: 'تحقق بـ `show interfaces trunk` و`show running-config interface GigabitEthernet0/24` على السويتشين.' },
            { title: 'Task 5', text: 'أدخل خطأ ثاني: احذف VLAN 20 من الـ allowed list أو تأكد إنه مش موجود أصلاً على SW2. توقع إيه اللي هيحصل لـ PC-C وPC-D.' },
            { title: 'Task 6', text: 'صحّح الـ native VLAN على الطرفين، واستخدم `switchport trunk allowed vlan add 20` لإرجاع VLAN 20.' },
            { title: 'Task 7', text: 'أعد `show interfaces trunk` وشوف الـ Native vlan والـ allowed والـ active VLANs اتصححوا.' },
            { title: 'Expected observation', text: 'مismatch الـ native بيسبب خلط untagged وتحذيرات محتملة؛ غياب VLAN 20 من الـ allowed list بيمنع حركة VLAN 20 رغم إن الترنك up.' },
            { title: 'Honesty note', text: 'اللاب تعليمي ولم يُشغّل داخل Packet Tracer.' },
          ],
        },
        {
          type: 'paragraph',
          text: '**Lab 3 - DTP Negotiation (Optional but Recommended, platform-dependent)**',
        },
        {
          type: 'steps',
          items: [
            { title: 'Platform note', text: 'DTP مش مدعوم على كل المنصات. لو الأمر مش متاح، اعتبرده عرض مفاهيمي بس وسجّل إن المنصة لا تدعم DTP.' },
            { title: 'Combination 1', text: `dynamic desirable + dynamic auto: النتيجة المتوقعة trunk لو الدعم متاح.` },
            { title: 'Combination 2', text: `dynamic auto + dynamic auto: غالباً مفيش trunk لأن مفيش طرف بيبادر.` },
            { title: 'Combination 3', text: `trunk + access: وضعان متعارضان؛ الترنك مش هيحمل عدة VLANs عبر الطرف الـ access.` },
            { title: 'Combination 4', text: `switchport mode trunk + switchport nonegotiate: ترنك صريح من غير DTP على المنافذ اللي بتدعم nonegotiate.` },
            { title: 'Verify', text: `استخدم \`show interfaces trunk\` و\`show dtp interface GigabitEthernet0/1\` حيث متاح.` },
            { title: 'Honesty note', text: 'لم يتم تنفيذ اللاب فعلياً؛ النتائج متوقعة ولم تُشغّل على أجهزة حقيقية.' },
          ],
        },
        {
          type: 'paragraph',
          text: '**الأخطاء الشائعة**',
        },
        {
          type: 'list',
          items: [
            'ضبط trunk على طرف واحد فقط. الحل: طابق إعداد الترنك على الطرفين.',
            'Native VLAN mismatch. الحل: طابق رقم الـ native VLAN على كل الأطراف وراجع `show interfaces trunk`.',
            'VLAN موجود على سويتش ومفقود من التاني. الحل: اعمل `vlan` على السويتشين وافحص `show vlan brief`.',
            'VLAN مستبعد من الـ allowed list. الحل: راجع `allowed` واستخدم `add` عند اللزوم.',
            'Incorrect trunk mode، زي access على طرف وtrunk على التاني. الحل: اضبط الوضع صراحة على الطرفين.',
            'DTP negotiation mismatch. الحل: افهم auto/desirable أو استخدم trunk صريح مع nonegotiate حيث مدعوم.',
            'الخلط بين access port وtrunk port. الحل: access للأجهزة النهائية وVLAN واحد؛ trunk لحمل عدة VLANs.',
            'الافتراض إن كل VLANs بتمر تلقائياً على كل ترنك. الحل: راجع الـ allowed list والـ active list.',
            'الخلط بين Native VLAN وVLAN 1. الحل: Native خاص بالترنك، وDefault غالباً VLAN 1؛ مفهومان منفصلان.',
            'أوامر encapsulation platform-dependent. الحل: استخدم `show running-config` ووثائق المنصة قبل إضافة `switchport trunk encapsulation dot1q`.',
          ],
        },
        {
          type: 'paragraph',
          text: '**Troubleshooting Workflow**',
        },
        {
          type: 'steps',
          items: [
            { title: '1 - Physical interface status', text: 'ابدأ بـ `show interfaces GigabitEthernet0/1` وتأكد إن المنفذ up وline protocol up ومفيش أخطاء واضحة.' },
            { title: '2 - Trunk operational state', text: 'استخدم `show interfaces trunk` وتأكد إن الـ Status trunking والـ Encapsulation 802.1q على الطرفين.' },
            { title: '3 - Native VLAN', text: 'قارن عمود Native vlan في `show interfaces trunk` على السويتشين. لازم يتطابقوا.' },
            { title: '4 - Allowed VLAN list', text: 'راجع VLANs allowed and active. لو VLAN مفقود، جرّب `switchport trunk allowed vlan add <vlan>`.' },
            { title: '5 - VLAN existence and state', text: 'استخدم `show vlan brief` على السويتشين وتأكد إن الـ VLAN موجود وactive.' },
            { title: '6 - DTP mode if applicable', text: 'لو فيه DTP، راجع `show dtp interface GigabitEthernet0/1` وتأكد إن الوضعين متوافقين. لو مش متاح، اعتبر الترنك صريح.' },
            { title: '7 - End-to-end test', text: 'اختبر ping داخل نفس الـ VLAN عبر السويتشين. لو المصدر والوجهة في VLANs مختلفة، اسأل عن Layer 3 routing.' },
          ],
        },
        {
          type: 'paragraph',
          text: '**أهم نقاط المراجعة قبل CCNA**',
        },
        {
          type: 'list',
          items: [
            'Inter-switch trunk بيحمل عدة VLANs على رابط فيزيائي واحد ويحافظ على فصلهم.',
            'Access port = VLAN واحد غالباً وإطارات untagged؛ Trunk port = عدة VLANs وإطارات tagged.',
            '802.1Q بيضيف 4 bytes؛ TPID commonly 0x8100، وPCP 3 bits، وDEI 1 bit، وVID 12 bits.',
            'VID بيحمل رقم VLAN، و0 و4095 محجوزين، والـ range الشائع 1–4094 حسب المنصة.',
            'على الـ trunk، الإطار يتوسّم بVID؛ قبل access port بيُشال الـ tag.',
            'Untagged frame واصل لترنك بيتسب للـ Native VLAN، ولازم يتطابق على الطرفين.',
            'Default VLAN غالباً VLAN 1؛ Native VLAN مفهوم 802.1Q منفصل.',
            '`switchport mode trunk` بيضبط الترنك؛ بعض المنصات محتاجة `switchport trunk encapsulation dot1q` أولاً.',
            'الـ allowed list بيحدد VLANs المسموحة؛ `allowed vlan` تستبدل القائمة، و`add`/`remove` تعدّلها.',
            'DTP Cisco proprietary، وauto/desirable بيحددوا نتائج negotiation؛ nonegotiate بيوقفه حيث مدعوم.',
            'التحقق: `show interfaces trunk` و`show interfaces GigabitEthernet0/1 switchport` و`show interfaces GigabitEthernet0/1` و`show vlan brief` و`show running-config interface GigabitEthernet0/1` و`show dtp interface GigabitEthernet0/1`.',
          ],
        },
        {
          type: 'paragraph',
          text: '**اختبار CCNA**',
        },
        {
          type: 'paragraph',
          text: 'الاختبار كالتالي: 5 أسئلة، كل سؤال 4 إجابات، وفيه single وmultiple. قبل Submission مفيش feedback؛ بعد Submission يظهر الشرح وتتقفل كل الخيارات.',
        },
        {
          type: 'quiz',
          questions: [
            {
              id: 'q1',
              prompt: 'إيه الفرق الأساسي بين Access Port وTrunk Port على سويتش Cisco؟',
              options: [
                'Access يحمل VLAN واحد غالباً ويفضل إطارات الـ end devices untagged؛ Trunk يحمل عدة VLANs ويستخدم tagging.',
                'Access بيحمل عدة VLANs وTrunk بيحمل VLAN واحد فقط.',
                'الاتنين بيحملوا نفس عدد الـ VLANs، بس الترنك أسرع.',
                'الترنك بيستخدم IP addresses والـ access بيستخدم MAC addresses فقط.',
              ],
              correctIndex: 0,
              requireSubmit: true,
              explanation:
                'الصح هو **(A)**. الـ access port بيخدم جهاز نهائي في Data VLAN واحد غالباً وإطاراته untagged. الـ trunk بيربط أجهزة شبكية ويحمل عدة VLANs باستخدام 802.1Q tags.',
            },
            {
              id: 'q2',
              kind: 'multiple',
              prompt: 'أي عبارات عن 802.1Q tagging صحيحة؟ (اختر أكثر من إجابة)',
              options: [
                'الـ tag بيضيف 4 bytes للإطار.',
                'TPID الشائع قيمته `0x8100`.',
                'VID طوله 12 bits وبيحمل رقم الـ VLAN.',
                'VLAN 4095 متاح كـ usable VLAN ID عادي.',
              ],
              correctIndices: [0, 1, 2],
              requireSubmit: true,
              explanation:
                'الصح هو **(A) و(B) و(C)**. 802.1Q بيضيف 4 bytes، TPID commonly `0x8100`، والـ VID 12 bits. VLAN 0 و4095 محجوزين، مش usable.',
            },
            {
              id: 'q3',
              prompt: 'SW1 عليه `switchport trunk native vlan 99` وSW2 عليه `switchport trunk native vlan 100`. إيه المتوقع؟',
              options: [
                'الترنك هيشتغل طبيعي لأن الـ tagging بيصحّح كل حاجة.',
                'إطارات untagged من VLAN 99 على SW1 ممكن يتفسّروا كـ VLAN 100 على SW2، مع مشاكل connectivity وتحذيرات محتملة.',
                'السويتشات هيتحولوا تلقائياً لـ access ports.',
                ' كل الـ VLANs هتتغير أرقامها لـ VLAN 1.',
              ],
              correctIndex: 1,
              requireSubmit: true,
              explanation:
                'الصح هو **(B)**. الـ native VLAN لازم يتطابق على الطرفين. لو اختلف، الإطارات untagged بتُفسَّر في VLAN غلط، وده بيسبب خلط منطقي ومشاكلTroubleshooting.',
            },
            {
              id: 'q4',
              kind: 'multiple',
              prompt: 'أي عبارات عن Allowed VLAN Lists صحيحة؟ (اختر أكثر من إجابة)',
              options: [
                'على أغلب Cisco switches، الترنك يسمح بكل الـ VLANs افتراضياً.',
                '`switchport trunk allowed vlan 10,20,99` بيستبدل القائمة الحالية.',
                '`switchport trunk allowed vlan add 30` بيضيف VLAN للقائمة من غير حذف الباقي.',
                'لو VLAN مش في الـ allowed list، هيتواصل عادي طالما الترنك up.',
              ],
              correctIndices: [0, 1, 2],
              requireSubmit: true,
              explanation:
                'الصح هو **(A) و(B) و(C)**. الـ trunk الافتراضي يسمح بكل الـ VLANs غالباً، والأمر بدون `add` بيستبدل القائمة، و`add` بيضيف VLAN. VLAN مش مسموح مش هيعدي حتى لو الترنك up.',
            },
            {
              id: 'q5',
              prompt: 'أي نتيجة متوقعة لـ DTP بين dynamic auto وdynamic desirable على منصة تدعم DTP؟',
              options: [
                'غالباً يتكوّن trunk لأن desirable يبادر بالتفاوض.',
                'غالباً يفضل access لأن الاتنينbian بيستنتظروا.',
                'السويتش هيغيّر الـ native VLAN تلقائياً.',
                'المنفذ هيبقى shutdown.',
              ],
              correctIndex: 0,
              requireSubmit: true,
              explanation:
                'الصح هو **(A)**. dynamic desirable بيبادر بمحاولة عمل trunk، وdynamic auto بيستجيب. أما auto + auto فغالباً ما بيكوّنوش trunk لأن مفيش طرف بيبادر.',
            },
          ],
        },
      ],
    },
  ],
}
