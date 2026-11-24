import type { Lesson } from '../types'

const physicalComponentRows: string[][] = [
  ['Wireless Client', 'يتصل بـ AP عبر 802.11 RF', 'لا يوجد كابل Ethernet من العميل إلى السويتش', 'لابتوب، هاتف، IoT'],
  ['Access Point (AP)', 'ينهي رابط الراديو ويتصل بـ access switch عبر Ethernet', 'قد يستقبل PoE من السويتش', 'LWAP أو autonomous AP'],
  ['Access Switch', 'يوفر منافذ access/trunk وVLANs وPoE', 'ينقل حركة الـ AP والـ WLC داخل access layer', 'Cisco Catalyst access switch'],
  ['Distribution Switch', 'يجمع uplinks من access switches', 'يوفر routing أو VLAN boundaries حسب التصميم', 'Distribution / core switch'],
  ['WLC', 'نقطة تحكم وإدارة CAPWAP', 'يتصل بشبكة Ethernet للوصول إلى APs والإدارة', 'AireOS أو Catalyst 9800'],
  ['Ethernet Cabling', 'الرابط الفيزيائي بين الأجهزة', 'قد يحمل بيانات فقط أو بيانات وقدرة PoE', 'Cat5e/Cat6 أو fiber uplink'],
  ['Network Uplinks', 'يربط access layer بـ distribution/core', 'يحمل عدة VLANs غالباً عبر trunk', 'Gi0/24، TenGig uplink'],
]

const layerDistinctionRows: string[][] = [
  ['Physical connectivity', 'كابلات ومنافذ وحالة link', 'AP Gi0 متصل بـ SW Gi0/1', '`show interfaces status`'],
  ['Logical WLAN configuration', 'SSID، VLAN mapping، security profile', 'WLAN CORP → VLAN 10', 'WLC GUI / running config'],
  ['Wireless client association', 'ارتباط RF بين العميل والـ AP', 'Client يتصل بـ SSID CORP', 'WLC client summary'],
]

const poeStandardRows: string[][] = [
  ['IEEE 802.3af', 'PoE', '15.4 W', 'أجهزة قديمة وبعض الـ APs الخفيفة'],
  ['IEEE 802.3at', 'PoE+', '30 W', 'كثير من APs الحديثة'],
  ['IEEE 802.3bt Type 3', '4PPoE', '60 W', 'APs ذات قدرة أعلى'],
  ['IEEE 802.3bt Type 4', '4PPoE', '90 W', 'أعلى سقف شائع في الجدول'],
]

const poeDesignRows: string[][] = [
  ['Power Sourcing Equipment (PSE)', 'الجهاز الذي يوفر القدرة على كابل Ethernet', 'PoE switch أو PoE injector'],
  ['Powered Device (PD)', 'الجهاز الذي يستقبل القدرة', 'Access Point عادةً'],
  ['PoE power budget', 'إجمالي القدرة المتاحة في السويتش', 'مثال 370 W لسويتش كامل'],
  ['Per-port allocation', 'القدرة المحجوزة لكل منفذ', 'تُحدد بالـ class والتفاوض'],
  ['Cable loss', 'فقد القدرة داخل الكابل', 'PD يحصل أقل من PSE output'],
  ['Power negotiation', 'اتفاق PSE وPD على مستوى القدرة', 'يعتمد على المنصة والمعيار'],
]

const wlcInterfaceRows: string[][] = [
  ['Physical Port', 'منفذ Ethernet فعلي على WLC', 'موجود على كل controller але بعدد مختلف', 'لا يُفترض نفس التخطيط لكل طراز'],
  ['Management Interface', 'واجهة Layer 3 للإدارة مثل GUI/SSH/SNMP', 'مفهوم شائع في AireOS', 'Catalyst 9800 يستخدم VLAN/SVI model'],
  ['Dynamic Interface', 'ربط WLAN أو VLAN بحركة العملاء', 'legacy AireOS غالباً', 'ليس اسماً عاماً لكل المنصات'],
  ['Service Port', 'منفذ أو واجهة إدارة مخصصة على بعض وحدات التحكم', 'يوجد في بعض تصاميم AireOS', 'ليس إلزامياً في كل طراز'],
  ['Virtual Interface', 'واجهة منطقية تعتمد على المنصة', 'تستخدم في بعض تصاميم الإدارة', 'تحقق من دليل المنصة'],
  ['AP Manager Interface', 'واجهة legacy AireOS لإدارة الـ APs', 'ليست مفهوماً عاماً في Catalyst 9800', 'لا تفترض وجودها في كل controller'],
]

const accessTrunkRows: string[][] = [
  ['Access port', 'VLAN واحدة', 'إطارات untagged على الرابط', 'AP بواحدة WLAN أو إدارة بسيطة', '`switchport mode access`'],
  ['Trunk port', 'VLANs متعددة', '802.1Q tags، وnative VLAN قد تكون untagged', 'عدة WLANs/VLANs على uplink واحد', '`switchport mode trunk`'],
]

const lagRows: string[][] = [
  ['Physical WLC ports', 'منافذ Ethernet منفصلة', 'ETH1، ETH2، ETH3...', 'كل كابل member link'],
  ['Logical LAG interface', 'واجهة منطقية واحدة داخل WLC', 'يمثل الحزمة كلها', 'المدعوم يعتمد على الطراز والإصدار'],
  ['Switch Port-Channel', 'حزمة EtherChannel في IOS', 'Port-channel1 / Po1', 'يفهمه السويتش كواجهة واحدة'],
  ['Compatibility', 'إعدادات متطابقة على الطرفين', 'speed، duplex، VLAN/trunk، mode', 'LACP/PAgP/static حسب الدعم'],
  ['Resilience', ' member link failure لا يكسر اللاج', 'يبقى اللاج up بقدر ما يسمح التصميم', 'لا يساوي redundant WLC'],
  ['Load distribution', 'توزيع الحركة على الأعضاء', 'يعتمد على خوارزمية WLC والسويتش', 'ليس بالضرورة متوازناً لكل تدفق'],
]

const redundancyRows: string[][] = [
  ['Redundant Ethernet links', 'كابلات ومنافذ بديلة', 'حماية من فشل link واحد', 'ليست بالضرورة LAG'],
  ['EtherChannel / LAG', 'روابط متعددة كمنطقية واحدة', 'زيادة سعة وتحمل فشل عضو', 'لا تحمي من فشل الجهاز'],
  ['Redundant WLC', 'جهاز controller ثانٍ', 'حماية من فشل الـ WLC', 'يحتاج تصميم HA مدعوم'],
  ['High Availability', 'فكرة failover بين أجهزة/وظائف', 'يعتمد على المنصة والترخيص', 'ليس مرادفاً لكابل إضافي'],
]

const verificationRows: string[][] = [
  ['`show interfaces status`', 'حالة المنافذ، VLAN، speed/duplex، والاسم', 'أول فحص لحالة منفذ AP أو uplink'],
  ['`show interfaces GigabitEthernet0/1`', 'تفاصيل الطبقة 1/2، الأخطاء، وعدادات الحركة', 'ابحث عن err-disable، CRC، collisions، down/down'],
  ['`show interfaces GigabitEthernet0/1 switchport`', 'وضع access/trunk، access VLAN، native VLAN، allowed VLAN', 'تأكيد إعداد منفذ الـ AP'],
  ['`show power inline`', 'حالة PoE، القدرة المسحوبة، والمخصصة لكل منفذ', 'تحقق من PSE و PD والـ budget'],
  ['`show power inline GigabitEthernet0/1`', 'تفاصيل PoE لمنفذ واحد', 'تحقق من class و allocated power'],
  ['`show vlan brief`', 'قاعدة بيانات VLAN وعضوية المنافذ', 'تأكد أن VLAN موجود والمنفذ فيه'],
  ['`show interfaces trunk`', 'حالة trunk، encapsulation، native VLAN، allowed/active VLANs', 'تحقق من trunk الخاص بالـ AP أو uplink'],
  ['`show etherchannel summary`', 'مجموعة Port-Channel، البروتوكول، وحالة الأعضاء', 'ابحث عن P و SU وعلامات الفشل'],
  ['`show interfaces port-channel 1`', 'حالة وإحصاءات الواجهة المنطقية Po1', 'تأكد أن اللاج/البوندل up'],
]

const troubleRows: string[][] = [
  ['AP في VLAN غلط', '`show interfaces ... switchport`، `show vlan brief`، DHCP scope'],
  ['Access/trunk mode غلط', 'قارن التصميم بـ `show interfaces ... switchport`'],
  ['VLAN مفقود من allowed list', '`show interfaces trunk` على طرفي الرابط'],
  ['Native VLAN mismatch', 'قارن native VLAN على الطرفين'],
  ['PoE budget غير كافٍ', '`show power inline` وإجمالي سعة السويتش'],
  ['PoE standard غير مدعوم', 'قارن متطلبات AP بقدرة switch/injector'],
  ['AP physical link down', 'كابل، منفذ، speed/duplex، أخطاء، err-disable'],
  ['WLC uplink configuration wrong', 'تحقق VLAN/trunk على WLC والسويتش المتصل'],
  ['CAPWAP connectivity blocked', 'IP path وUDP 5246/5247 بعد تأكيد الطبقة الفيزيائية'],
  ['WLC interface mapping wrong', 'راجع نموذج AireOS أو Catalyst 9800 ولا تعمم الأسماء'],
  ['LAG configuration mismatch', '`show etherchannel summary` وتطابق mode/settings على الطرفين'],
  ['Members not bundled', 'ابحث عن غياب علامة `P` أو وجود `s`/`I`'],
  ['LAG confused with WLC redundancy', 'LAG يحمي من فشل عضو، وليس من فشل الـ WLC'],
  ['Same interface model assumed for all WLCs', 'راجع platform وsoftware قبل تفسير أسماء الواجهات'],
]

const workflowSteps = [
  { title: '1', text: 'افحص الكابلات والمنافذ الفيزيائية وحالة الـ link.' },
  { title: '2', text: 'تحقق من حالة واجهة AP والسويتش بـ `show interfaces status` و`show interfaces GigabitEthernet0/1`.' },
  { title: '3', text: 'تحقق من PoE المتاح والتخصيص بـ `show power inline`.' },
  { title: '4', text: 'تأكد من VLAN assignment على منفذ AP.' },
  { title: '5', text: 'حدد هل المنفذ access أم trunk حسب التصميم.' },
  { title: '6', text: 'في trunk، راجع allowed VLANs وnative VLAN على الطرفين.' },
  { title: '7', text: 'تحقق من عنوان IP الخاص بالـ AP واتصاله بشبكة WLC.' },
  { title: '8', text: 'تحقق من وصول الـ AP إلى الـ WLC IP.' },
  { title: '9', text: 'افحص CAPWAP حيث ينطبق: UDP 5246 control وUDP 5247 data.' },
  { title: '10', text: 'راجع واجهة WLC وحالة اللاج/البوندل إذا كانت مستخدمة.' },
]

const mistakeRows: string[][] = [
  ['الخلط بين كابل AP وارتباط العميل', 'العميل لاسلكي والـ AP متصل بكابل Ethernet منفصل'],
  ['اعتبار كل AP يحتاج trunk', 'الـ trunk يعتمد على عدد VLANs وتصميم WLAN'],
  ['نسيان إضافة VLAN إلى allowed list', 'VLAN موجود في قاعدة البيانات لا يعني أنه مسموح على trunk'],
  ['تجاهل PoE budget', 'قد لا يقلع AP أو يعمل بقدرة محدودة'],
  ['افتراض أن PSE output = PD power', 'فقد الكابل يقلل القدرة المتاحة عند الـ AP'],
  ['تعميم أسماء واجهات AireOS', 'Catalyst 9800 IOS XE يستخدم نموذجاً مختلفاً'],
  ['اعتبار LAG هو redundancy', 'LAG يجمع روابط؛ الـ WLC redundancy يعني جهازاً آخر'],
  ['افتراض أن كل WLC يدعم نفس عدد اللاج', 'الدعم والحدود تعتمد على الطراز والإصدار'],
  ['نسيان توافق إعداداتmember', 'كل أعضاء Port-Channel يجب أن تتطابق في الإعدادات المؤثرة'],
  ['القفز إلى CAPWAP قبل الطبقة الفيزيائية', 'ابدأ من الكابل والمنفذ والـ VLAN ثم IP ثم CAPWAP'],
]

export const topic27Lesson: Lesson = {
  topicId: '2.7',
  title: 'Describe physical infrastructure connections of WLAN components (AP, WLC, access/trunk ports, and LAG)',
  description:
    'Topic 2.7 يركّز على الجانب الفيزيائي والوصلات: APs وWLCs وسويتشات الوصول والتوزيع، PoE وميزانية القدرة، منافذ access مقابل trunk، مسار CAPWAP الفيزيائي، LAG على WLC، والتصميم الفيزيائي الاحتياطي. أوامر التحقق كلها أمثلة تعليمية من جهة السويتش، واللابات conceptual أو Packet Tracer-style ولم تُنفّذ. Topic 2.8 لم يُفتح.',
  estimatedTime: '~130 دقيقة',
  steps: [
    {
      id: 'what',
      title: 'WLAN Physical Infrastructure Fundamentals',
      short: 'أساسيات البنية الفيزيائية',
      blocks: [
        {
          type: 'paragraph',
          text: '**WLAN physical infrastructure** هي الأجهزة والكابلات والمنافذ التي تبني شبكة لاسلكية مؤسسية: **APs** و**WLCs** وaccess switches وdistribution/core switches وEthernet cabling وPoE وwireless clients وuplinks. الـ client يتصل بالـ AP عبر RF، لكن الـ AP نفسه يتصل بالشبكة السلكية عبر Ethernet. هذان رابطان مختلفان تماماً.',
        },
        {
          type: 'diagram',
          id: 'enterprise-wlan-physical-topology',
          caption: 'طوبولوجيا مؤسسية: عدة APs، access switches، distribution switch، WLC، وعملاء لاسلكيون.',
        },
        { type: 'table', headers: ['المكوّن', 'الدور', 'نقطة مهمة', 'مثال'], rows: physicalComponentRows },
        {
          type: 'table',
          headers: ['الطبقة', 'ما الذي تصفه؟', 'مثال', 'أداة تحقق'],
          rows: layerDistinctionRows,
        },
        {
          type: 'list',
          items: [
            '**Physical connectivity**: كابل Ethernet بين AP ومنفذ السويتش، وحالة الـ link.',
            '**Logical WLAN configuration**: SSID، security profile، وتعيين VLAN داخل الـ WLC والسويتش.',
            '**Wireless client association**: ارتباط 802.11 بين العميل والـ AP، وليس كابل الـ AP.',
            'الـ access switch يربط الـ APs، والـ distribution switch يجميع uplinks ويوصلها بالـ WLC وcore.',
          ],
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'قاعدة ذهنية',
          text: 'اسأل دائماً: هل نتكلم عن كابل، أو VLAN، أو SSID/ارتباط عميل؟ الخلط بينها هو أكثر خطأ شيوعاً في أسئلة physical infrastructure.',
        },
      ],
    },
    {
      id: 'how',
      title: 'Physical Access Point Connections',
      short: 'وصلة AP الفيزيائية',
      blocks: [
        {
          type: 'paragraph',
          text: 'غالباً يتصل الـ AP بـ **access switch** عبر منفذ Ethernet نحاسي واحد على الأقل. على الـ AP تجد واجهة مثل `Gi0` أو `Eth0` حسب الطراز، وعلى السويتش منفذ مثل `GigabitEthernet0/1`. هذا الرابط يحمل حركة الإدارة وحركة العملاء، وقد يحمل قدرة PoE إذا كان الطرفان يدعمان ذلك.',
        },
        {
          type: 'diagram',
          id: 'ap-to-access-switch-connection',
          caption: 'واجهة Ethernet على AP متصلة بمنفذ access switch؛ السويتش يوفر IP connectivity وربما PoE.',
        },
        {
          type: 'list',
          items: [
            '**Ethernet interfaces on the AP**: منفذ فيزيائي يحمل بيانات الـ uplink والإدارة.',
            '**Copper cabling**: كابل Cat5e/Cat6 شائع لمسافات access layer القصيرة.',
            '**Uplink connectivity**: يربط AP بالسويتش ثم بشبكة WLC/core.',
            '**AP management connectivity**: يحتاج IP address وVLAN صحيحين للوصول إلى الـ WLC.',
            '**AP power**: إما PoE من السويتش/الحاقن أو مصدر طاقة محلي حسب الطراز.',
            '**Discovery**: الـ AP يكتشف الـ WLC conceptually بعد حصوله على IP connectivity.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'ليس كل المنافذ متطابقة',
          text: 'بعض APs لها عدة Ethernet interfaces، وبعضها منفذ واحد فقط. اسم المنفذ وقدرته يعتمد على طراز الـ AP، وليس قاعدة عامة لكل الأجهزة.',
        },
      ],
    },
    {
      id: 'packet',
      title: 'AP-to-Switch Connectivity and PoE',
      short: 'PoE والقدرة',
      blocks: [
        {
          type: 'paragraph',
          text: '**Power over Ethernet (PoE)** يسمح بإرسال قدرة كهربائية على نفس كابل Ethernet الذي يحمل البيانات. الجهاز الذي يوفر القدرة هو **Power Sourcing Equipment (PSE)** مثل PoE switch أو PoE injector، والجهاز الذي يستقبلها هو **Powered Device (PD)** مثل الـ AP. APs تستخدم PoE لأنها غالباً تُركّب في السقف أو أماكن يصعب فيها توفير مقبس كهربائي.',
        },
        {
          type: 'diagram',
          id: 'poe-power-delivery',
          caption: 'PSE يوفر قدرة على كابل Ethernet، والـ PD يستقبلها؛ البيانات والقدرة يسيران على نفس الكابل.',
        },
        {
          type: 'diagram',
          id: 'poe-injector-vs-poe-switch',
          caption: 'PoE switch مقابل PoE injector: كلاهما يوفر قدرة، لكن السويتش يتعامل مع البيانات أيضاً.',
        },
        {
          type: 'diagram',
          id: 'poe-power-budget',
          caption: 'ميزانية PoE، تخصيص المنفذ، استهلاك الـ AP، وفقد القدرة على الكابل.',
        },
        { type: 'table', headers: ['Standard', 'Common name', 'Maximum PSE output power', 'Typical use'], rows: poeStandardRows },
        { type: 'table', headers: ['المفهوم', 'الشرح', 'مثال'], rows: poeDesignRows },
        {
          type: 'callout',
          tone: 'danger',
          title: 'PSE output ليس PD available',
          text: 'الأرقام في الجدول هي أقصى خرج من PSE. بسبب power loss على الكابل، القدرة المتاحة عند الـ AP أقل. كذلك تعتمد القدرة الفعلية على تنفيذ الجهاز، طول الكابل، وجودة التوصيل، وسياسة تخصيص السويتش.',
        },
        {
          type: 'list',
          items: [
            'بعض APs الحديثة تحتاج **PoE+** أو **802.3bt** خصوصاً مع radios متعددة أو USB أو ميزات إضافية.',
            'إذا لم يستطع السويتش توفير القدرة المطلوبة، قد لا يقلع الـ AP، أو يعمل بعدد radios أقل، أو يعيد التشغيل.',
            '**PoE power budget** هو إجمالي قدرة السويتش؛ **per-port allocation** هو نصيب كل منفذ؛ مجموع الأحمال يجب أن يبقى داخل الميزانية.',
          ],
        },
        {
          type: 'paragraph',
          text: '**CAPWAP Physical Path (مراجعة سريعة من Topic 2.6)**',
        },
        {
          type: 'diagram',
          id: 'ap-to-wlc-capwap-physical-path',
          caption: 'المسار الفيزيائي AP → access switch → distribution → WLC، مع نفق CAPWAP منطقي فوق IP.',
        },
        {
          type: 'paragraph',
          text: 'CAPWAP control يستخدم **UDP 5246** مع DTLS حيثما كان مدعوماً، وCAPWAP data يستخدم **UDP 5247**. هذه قنوات منطقية تسري فوق IP network؛ ليست كابلات إضافية. لا نعيد هنا شرح CAPWAP كاملاً، بل نربطه بالطبقة الفيزيائية التي بنيناها.',
        },
      ],
    },
    {
      id: 'config',
      title: 'WLC Physical Connections',
      short: 'وصلات WLC الفيزيائية',
      blocks: [
        {
          type: 'paragraph',
          text: 'الـ **WLC** جهاز شبكي له منافذ Ethernet فيزيائية تتصل بالبنية السلكية. من خلال هذه المنافذ يصل إلى الـ APs عبر IP، ويصل إلى أنظمة الإدارة، وقد يمرر حركة عملاء في central switching. بعض وحدات التحكم لها منفذ management منفصل، وبعضها يستخدم uplinks بيانات مع VLANs/logical interfaces. لا تعتبر تخطيط منفذ جهاز واحد قاعدة لكل الأجيال.',
        },
        {
          type: 'diagram',
          id: 'wlc-physical-connectivity',
          caption: 'منافذ WLC تتصل بـ distribution وإدارة وAPs وcore؛ التخطيط يختلف حسب المنصة.',
        },
        {
          type: 'list',
          items: [
            '**Ethernet interfaces**: منافذ فيزيائية للـ uplinks أو management حسب الطراز.',
            '**Uplink connections**: تربط WLC بـ distribution/core switch.',
            '**Management connectivity**: GUI وSSH وSNMP وsyslog عبر الشبكة الصحيحة.',
            '**AP connectivity**: الـ APs تصل إلى عنوان IP الخاص بالـ WLC عبر الشبكة.',
            '**Client traffic forwarding**: في central switching تمر حركة العميل عبر WLC إلى LAN.',
            '**Redundant physical connections**: مدعومة على منصات معينة، وليست افتراضاً عالمياً.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'تحذير منصة',
          text: 'عدد المنافذ وأسماؤها ووظائفها تختلف بين AireOS وCatalyst 9800 IOS XE وبين الأجيال المختلفة. ارجع دائماً إلى دليل الجهاز قبل تصميم الكابلات أو تفسير `show` output.',
        },
      ],
    },
    {
      id: 'verify',
      title: 'WLC Interfaces and Network Connectivity',
      short: 'واجهات WLC',
      blocks: [
        {
          type: 'paragraph',
          text: 'افرق بين **physical interface** و**logical interface**.Physical port هو موصل Ethernet فعلي ترى الكابل فيه. أما logical interface فهو Layer 3/VLAN mapping يستخدمه الـ WLC للإدارة أو حركة العملاء أو اتصال الـ APs. الأسماء تختلف بين legacy AireOS وCatalyst 9800 IOS XE، ولا تجد كل الأنواع على كل جهاز.',
        },
        {
          type: 'diagram',
          id: 'wlc-physical-vs-logical-interfaces',
          caption: 'منافذ فيزيائية تقابل واجهات منطقية؛ أسماء AireOS ليست عالمية على Catalyst 9800.',
        },
        { type: 'table', headers: ['Interface concept', 'Description', 'Platform note', 'Caveat'], rows: wlcInterfaceRows },
        {
          type: 'list',
          items: [
            '**AireOS legacy**: مصطلحات مثل Management Interface وDynamic Interface وService Port وAP Manager Interface شائعة في الأجيال القديمة.',
            '**Catalyst 9800 IOS XE**: يعتمد نموذجاً مختلفاً مثل VLAN/SVI وwireless management interface.',
            '**Virtual Interface**: موجود في بعض التصاميم كواجهة منطقية للإدارة أو خدمة محددة، وليس اسماً ثابتاً لكل المنصات.',
            'الـ WLC يستخدم هذه الواجهات للتحدث مع APs وأنظمة الإدارة والعملاء والبنية السلكية، لكن التفاصيل تعتمد على المنصة.',
          ],
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'لا تعمّم',
          text: 'لا تقل إن كل WLC فيه Management وDynamic وService Port وAP Manager بنفس المعنى. هذه لغة AireOS القديمة غالباً، وليست وصفاً عالمياً لكل وحدات التحكم.',
        },
      ],
    },
    {
      id: 'mistakes',
      title: 'Access Ports vs Trunk Ports for WLAN Components',
      short: 'Access مقابل Trunk',
      blocks: [
        {
          type: 'paragraph',
          text: 'منفذ الـ AP في السويتش يمكن أن يكون **access port** أو **trunk port**. Access port يحمل VLAN واحدة ويرسل الإطارات **untagged**. Trunk port يحمل عدة VLANs باستخدام **IEEE 802.1Q tags**، وله **native VLAN** و**allowed VLAN list**. الاختيار يعتمد على تصميم WLAN وعدد VLANs وقدرة الـ AP والـ WLC.',
        },
        {
          type: 'diagram',
          id: 'ap-access-port',
          caption: 'AP متصل بمنفذ access في VLAN 10؛ الإطارات untagged على هذا الرابط.',
        },
        {
          type: 'diagram',
          id: 'ap-trunk-port',
          caption: 'AP متصل بترنك يحمل VLAN 10 و20 و99 مع 802.1Q tags.',
        },
        {
          type: 'diagram',
          id: 'multiple-wlans-vlans-ap-uplink',
          caption: 'عدة WLANs mapping إلى VLANs مختلفة فوق uplink فيزيائي واحد.',
        },
        { type: 'table', headers: ['Port type', 'VLANs carried', 'Tagging', 'Typical AP scenario', 'IOS example'], rows: accessTrunkRows },
        {
          type: 'list',
          items: [
            'Access port مناسب حين يكون لإدارة الـ AP وحركة العملاء VLAN واحدة.',
            'Trunk مفيد حين توجد WLANs متعددة مثل CORP وGUEST mapping إلى VLANs مختلفة.',
            '**Native VLAN** على 802.1Q trunk تُعامل غالباً كـ untagged؛ يجب أن تتطابق على الطرفين.',
            '**Allowed VLAN list** تحدد أي VLANs مسموح بمرورها على الترنك.',
            'لا تقل إن كل AP يجب أن يتصل بترنك؛ هذا يعتمد على التصميم.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'تحقق من الطرفين',
          text: 'إعداد access/trunk على سويتش واحد لا يكفي. تأكد أن الـ AP أو الـ WLC يتوقع نفس تصميم VLAN والتagging.',
        },
      ],
    },
    {
      id: 'lab',
      title: 'Link Aggregation (LAG) on Wireless LAN Controllers',
      short: 'LAG على WLC',
      blocks: [
        {
          type: 'paragraph',
          text: '**Link Aggregation (LAG)** تجمع عدة روابط Ethernet فيزيائية في واجهة منطقية واحدة. على السويتش نسميها غالباً **EtherChannel** أو **Port-Channel**، وعلى الـ WLC قد تُسمى logical LAG interface. الهدف زيادة السعة الإجمالية وتوفير resilience عند فشل member link، مع توزيع الحركة حسب تنفيذ المنصة.',
        },
        {
          type: 'diagram',
          id: 'wlc-lag-architecture',
          caption: 'منافذ WLC متعددة تشكّل LAG منطقياً يقابل Port-Channel على السويتش.',
        },
        {
          type: 'diagram',
          id: 'switch-port-channel-to-wlc',
          caption: 'منافذ السويتش Gi0/1-Gi0/4 مجمّعة في Port-channel1 متصل بـ LAG على WLC.',
        },
        { type: 'table', headers: ['Concept', 'Meaning', 'Example', 'Key point'], rows: lagRows },
        {
          type: 'list',
          items: [
            '**Physical WLC ports** هي الكابلات والمنافذ الفردية.',
            '**Logical aggregated interface** هي الواجهة التي تراها الطبقات الأعلى.',
            '**EtherChannel على السويتش** و**LAG على WLC** يجب أن يستخدما إعدادات متوافقة على الطرفين.',
            'LAG support وعدد الأعضاء وسلوك load distribution تعتمد على طراز WLC وبرنامجه.',
            'LAG ليس بديلاً عن redundant WLC devices.',
          ],
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'ثلاثة مفاهيم منفصلة',
          text: 'Redundant Ethernet links ≠ EtherChannel/LAG ≠ redundant WLC. الأول كابلات بديلة، والثاني تجميع روابط، والثالث جهاز controller آخر.',
        },
      ],
    },
    {
      id: 'exam',
      title: 'Physical Topology Design, Verification, and Troubleshooting',
      short: 'التحقق والتشخيص',
      blocks: [
        {
          type: 'paragraph',
          text: 'أوامر التحقق أدناه كلها أمثلة Cisco IOS من جهة السويتش. التحقق يبدأ من المنفذ والكابل والـ VLAN والـ PoE، ثم ينتقل إلى IP وCAPWAP وحالة اللاج. أوامر PoE وWLC الفعلية تعتمد على منصة السويتش أو وحدة التحكم.',
        },
        {
          type: 'code',
          label: 'Switch-side verification commands',
          language: 'text',
          code: `show interfaces status
show interfaces GigabitEthernet0/1
show interfaces GigabitEthernet0/1 switchport
show power inline
show power inline GigabitEthernet0/1
show vlan brief
show interfaces trunk
show etherchannel summary
show interfaces port-channel 1`,
        },
        { type: 'table', headers: ['Command', 'What it verifies', 'When to use'], rows: verificationRows },
        {
          type: 'paragraph',
          text: '**Representative educational outputs - not captured from real hardware**',
        },
        {
          type: 'code',
          label: 'Switch and PoE examples - educational only',
          language: 'text',
          code: `SW-ACCESS# show interfaces status
Port      Name        Status       Vlan    Duplex  Speed   Type
Gi0/1     AP-1        connected    10      a-full  a-1000  10/100/1000BaseTX
Gi0/24    TO-DIST     connected    trunk   a-full  a-1000  10/100/1000BaseTX

SW-ACCESS# show interfaces GigabitEthernet0/1 switchport
Name: Gi0/1
Switchport: Enabled
Administrative Mode: static access
Operational Mode: static access
Access Mode VLAN: 10 (WLAN-CORP)
Voice VLAN: none
Trunking Native Mode VLAN: 1 (default)

SW-ACCESS# show power inline
Interface   Admin   Oper    Power(W)  Device             Class
Gi0/1       auto    on      25.4      Ieee PD            4
Gi0/2       auto    deny    0.0       Ieee PD            n/a
Total PoE Power Budget: 370.0 W
Available: 92.4 W

SW-ACCESS# show power inline GigabitEthernet0/1
Interface: Gi0/1
Power Source: PSE
Power Status: Delivering Power
Allocated Power: 30.0 W
Device Class: 4`,
        },
        {
          type: 'code',
          label: 'VLAN, trunk, and EtherChannel examples - educational only',
          language: 'text',
          code: `SW-ACCESS# show vlan brief
VLAN  Name              Status    Ports
10    WLAN-CORP         active    Gi0/1
20    WLAN-GUEST        active
99    WLAN-MGMT         active

SW-ACCESS# show interfaces trunk
Port    Mode    Encapsulation  Status   Native vlan
Gi0/24  on      802.1q         trunking 99
Port    Vlans allowed on trunk
Gi0/24  10,20,99
Port    Vlans allowed and active in management domain
Gi0/24  10,20,99

SW-DIST# show etherchannel summary
Group  Port-channel  Protocol   Ports
1      Po1(SU)       LACP       Gi0/1(P) Gi0/2(P) Gi0/3(P) Gi0/4(P)

SW-DIST# show interfaces port-channel 1
Port-channel1 is up, line protocol is up
Hardware: EtherChannel
Encapsulation ARPA
Last input 00:00:01, output 00:00:02`,
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'تنبيه تعليمي صريح',
          text: 'المخرجات أعلاه representative educational examples وليست لقطات من أجهزة Cisco حقيقية. الأسماء والحقول والقدرة المتاحة تختلف حسب السويتش والـ WLC والإصدار.',
        },
        {
          type: 'diagram',
          id: 'physical-link-failure-redundancy',
          caption: 'فشل رابط مفرد مقابل روابط احتياطية، LAG member failure، و redundant WLC.',
        },
        { type: 'table', headers: ['Failure domain', 'Protection', 'Not the same as'], rows: redundancyRows },
        {
          type: 'paragraph',
          text: '**Common mistakes**',
        },
        { type: 'table', headers: ['الخطأ', 'التصحيح'], rows: mistakeRows },
        {
          type: 'paragraph',
          text: '**Structured troubleshooting workflow**',
        },
        { type: 'steps', items: workflowSteps },
        {
          type: 'paragraph',
          text: '**Common troubleshooting situations**',
        },
        { type: 'table', headers: ['المشكلة', 'الفحوصات'], rows: troubleRows },
        {
          type: 'callout',
          tone: 'warning',
          title: 'ابدأ من الأسفل',
          text: 'لا تقفز إلى CAPWAP أو واجهة WLC قبل تأكيد الكابل والمنفذ والـ PoE والـ VLAN. كثير من مشاكل WLAN هي مشاكل physical layer في النهاية.',
        },
      ],
    },
    {
      id: 'summary',
      title: 'Practical Labs, CCNA Exam Review, and Summary',
      short: 'اللابات والمراجعة',
      blocks: [
        {
          type: 'paragraph',
          text: '**Lab 1 - Connect an AP to a Switch (Packet Tracer-style / conceptual)**',
        },
        {
          type: 'steps',
          items: [
            { title: 'Topology', text: 'AP واحد، Cisco access switch، WLC، وعميل لاسلكي. تمرين تعليمي ولم يُنفّذ على أجهزة فعلية.' },
            { title: 'Task 1', text: 'حدد الوصلة الفيزيائية: AP Ethernet interface إلى switch port Gi0/1.' },
            { title: 'Task 2', text: 'اجعل منفذ AP access port في VLAN 10 في التمرين المفاهيمي.' },
            { title: 'Task 3', text: 'تحقق من حالة الواجهة بـ `show interfaces status` و`show interfaces GigabitEthernet0/1`.' },
            { title: 'Task 4', text: 'تحقق من VLAN assignment بـ `show interfaces GigabitEthernet0/1 switchport` و`show vlan brief`.' },
            { title: 'Task 5', text: 'اشرح كيف يوفر السويتش PoE للـ AP إذا كان مدعوماً، وافحص `show power inline`.' },
            { title: 'Task 6', text: 'تتبّع IP connectivity من الـ AP إلى الـ WLC ثم اشرح مسار CAPWAP مفاهيمياً.' },
            { title: 'Honesty note', text: 'Packet Tracer قد لا يدعم كل طرازات AP/WLC أو كل تفاصيل PoE وCAPWAP؛ اعتبر اللاب conceptual.' },
          ],
        },
        {
          type: 'paragraph',
          text: '**Lab 2 - AP Connected Through a Trunk (conceptual / Packet Tracer-style)**',
        },
        {
          type: 'steps',
          items: [
            { title: 'Topology', text: 'AP وCisco switch مع WLAN CORP على VLAN 10 وWLAN GUEST على VLAN 20.' },
            { title: 'Task 1', text: 'أنشئ VLAN 10 وVLAN 20 في تصميمك.' },
            { title: 'Task 2', text: 'اجعل منفذ الـ AP trunk وحدد allowed VLANs كالتالي: 10,20.' },
            { title: 'Task 3', text: 'تحقق من الترنك بـ `show interfaces trunk` و`show interfaces GigabitEthernet0/1 switchport`.' },
            { title: 'Task 4', text: 'اشرح كيف تحمل 802.1Q tags حركة VLAN 10 وVLAN 20 على uplink واحد.' },
            { title: 'Task 5', text: 'قارن هذا التصميم بتصميم access port بسيط من Lab 1.' },
            { title: 'Honesty note', text: 'لا تفترض أن كل APs تدعم كل WLAN-to-VLAN trunking؛ تحقق من المنصة والإعدادات الخاصة بالجهاز.' },
          ],
        },
        {
          type: 'paragraph',
          text: '**Lab 3 - WLC LAG (conceptual)**',
        },
        {
          type: 'steps',
          items: [
            { title: 'Topology', text: 'WLC يدعم عدة منافذ Ethernet وswitch بـ Port-Channel متوافق.' },
            { title: 'Task 1', text: 'حدد physical WLC links واسمح لها بالانضمام إلى logical LAG.' },
            { title: 'Task 2', text: 'اربط نفس الروابط بمنفذ Port-Channel على السويتش.' },
            { title: 'Task 3', text: 'اشرح لماذا يجب أن تتطابق إعدادات السرعة والـ VLAN/trunk وmode على الطرفين.' },
            { title: 'Task 4', text: 'تحقق conceptually بـ `show etherchannel summary` و`show interfaces port-channel 1`.' },
            { title: 'Task 5', text: 'قم بمحاكاة فشل member link واشرح أثره على اللاج المنطقي.' },
            { title: 'Honesty note', text: 'LAG support وعدد الأعضاء وطريقة التحقق تختلف حسب WLC model وsoftware؛ لم يُشغّل اللاب على جهاز حقيقي.' },
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'الأمانة التعليمية',
          text: 'اللابات conceptual أو Packet Tracer-style ولم تُنفّذ على Cisco hardware أو WLC حقيقي. لا تدّعي أن المحاكاة تدعم كل ميزات PoE أو AP أو LAG.',
        },
        {
          type: 'list',
          items: [
            'العميل يتصل بـ AP عبر RF؛ الـ AP يتصل بالسويتش عبر Ethernet.',
            'PoE PSE يوفر القدرة، والـ AP هو PD؛ PSE output أكبر من القدرة المتاحة عند PD بسبب cable loss.',
            '802.3af = 15.4 W و802.3at = 30 W و802.3bt Type 3 = 60 W وType 4 = 90 W كحد أقصى PSE output.',
            'Access port يحمل VLAN واحدة وuntagged frames؛ trunk يحمل عدة VLANs بـ 802.1Q.',
            'Native VLAN وallowed VLAN list يجب مراجعتهما على طرفي الترنك.',
            'CAPWAP control = UDP 5246 وdata = UDP 5247؛ النفق منطقي فوق IP، وليس كابلًا.',
            'واجهات AireOS مثل AP Manager وDynamic Interface ليست عالمية؛ Catalyst 9800 IOS XE نموذج مختلف.',
            'LAG يجمع عدة physical ports في واجهة منطقية؛ السويتش يستخدم Port-Channel.',
            'LAG ≠ redundant WLC ≠ redundant links.',
            'التحقق يبدأ من physical layer ثم VLAN/PoE ثم IP ثم WLC/CAPWAP/LAG.',
          ],
        },
        {
          type: 'paragraph',
          text: '**اختبار CCNA**',
        },
        {
          type: 'paragraph',
          text: '5 أسئلة، 4 خيارات لكل سؤال، ومزيج من single-choice وmultiple-select. قبل الإرسال لا تظهر الإجابة؛ بعد الإرسال يظهر الشرح وتتقفل الخيارات ويختفي زر التحقق.',
        },
        {
          type: 'quiz',
          questions: [
            {
              id: 'q1',
              prompt: 'Which statement best describes a typical lightweight AP physical connection?',
              options: [
                'It connects to an access switch over Ethernet; the switch may provide PoE and IP connectivity toward the WLC.',
                'It must connect directly to the WLC with a console cable.',
                'It uses only a fiber uplink and never a copper Ethernet cable.',
                'The wireless client association replaces the AP Ethernet uplink.',
              ],
              correctIndex: 0,
              requireSubmit: true,
              explanation:
                'الصح هو **(A)**. الـ AP يتصل بـ access switch عبر Ethernet؛ السويتش يوفر Layer 2 connectivity وقد يوفر PoE. ارتباط العميل RF مختلف تماماً عن كابل الـ AP.',
            },
            {
              id: 'q2',
              kind: 'multiple',
              prompt: 'Which statements about PoE standards and power budget are correct? (Choose more than one.)',
              options: [
                'IEEE 802.3af PoE has a maximum PSE output of 15.4 W.',
                'IEEE 802.3at PoE+ has a maximum PSE output of 30 W.',
                'Cable loss means the powered device receives less power than the PSE output.',
                'Every WLC interface requires 90 W from 802.3bt Type 4.',
              ],
              correctIndices: [0, 1, 2],
              requireSubmit: true,
              explanation:
                'الصح هو **(A) و(B) و(C)**. 802.3af = 15.4 W و802.3at = 30 W، والقدرة عند الجهاز المستقبل أقل بسبب فقد الكابل. 802.3bt Type 4 = 90 W لكنها ليست متطلباً عاماً لكل واجهة WLC.',
            },
            {
              id: 'q3',
              prompt: 'Why would an AP-facing switchport be configured as an 802.1Q trunk?',
              options: [
                'To carry multiple WLAN VLANs over one Ethernet uplink using VLAN tags.',
                'Because every AP must always be a trunk port.',
                'To convert 802.11 frames into IP packets.',
                'To eliminate the need for an AP management VLAN.',
              ],
              correctIndex: 0,
              requireSubmit: true,
              explanation:
                'الصح هو **(A)**. الترنك يسمح بحمل عدة VLANs مثل CORP وGUEST فوق uplink واحد باستخدام tags. ليس كل AP يحتاج ترنك، والترنك لا يحوّل 802.11 إلى IP ولا يلغي إدارة الـ AP.',
            },
            {
              id: 'q4',
              kind: 'multiple',
              prompt: 'Which statements about WLC physical and logical interfaces are correct? (Choose more than one.)',
              options: [
                'A physical port is an actual Ethernet connector on the controller.',
                'A management interface is a logical Layer 3 interface used for administration.',
                'AP Manager Interface and Dynamic Interface are legacy AireOS concepts that are not universal.',
                'Every controller platform uses the same interface names and roles.',
              ],
              correctIndices: [0, 1, 2],
              requireSubmit: true,
              explanation:
                'الصح هو **(A) و(B) و(C)**. المنفذ الفيزيائي موصل حقيقي، وواجهة الإدارة منطقية Layer 3. AP Manager وDynamic Interface مرتبطان بـ AireOS القديمة وليسا عالميين؛ Catalyst 9800 IOS XE يستخدم نموذجاً مختلفاً.',
            },
            {
              id: 'q5',
              kind: 'multiple',
              prompt: 'Which statements about WLC LAG and redundancy are correct? (Choose more than one.)',
              options: [
                'LAG bundles multiple physical WLC links into one logical interface.',
                'The switch side commonly represents the bundle as a Port-Channel.',
                'LAG is not a substitute for a redundant WLC device.',
                'All WLC models support the same number of LAG member links.',
              ],
              correctIndices: [0, 1, 2],
              requireSubmit: true,
              explanation:
                'الصح هو **(A) و(B) و(C)**. LAG يجمع physical links في واجهة منطقية، والسويتش يستخدم Port-Channel. تحمي اللاج من فشل عضو لكنها لا تحمي من فشل الـ WLC نفسه. عدد الأعضاء والدعم يعتمد على الطراز والإصدار.',
            },
          ],
        },
      ],
    },
  ],
}
