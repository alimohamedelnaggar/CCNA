import type { Lesson } from '../types'

const enterpriseRows: string[][] = [
  ['Employees', 'Company-Staff', '10', 'Employee access'],
  ['Guests', 'Company-Guest', '20', 'Guest access'],
  ['IT', 'Company-IT', '30', 'IT department'],
]

const wlanParamRows: string[][] = [
  ['WLAN ID', 'معرّف رقمي/منطقي للـ WLAN على الـ WLC', 'يساعد على تمييز WLAN داخل الـ controller'],
  ['WLAN Profile Name', 'اسم داخلي لملف WLAN في الـ WLC', 'قد يختلف عن SSID المعروض للمستخدم'],
  ['SSID', 'اسم الشبكة اللاسلكية الذي يراه العميل', 'هو ما يختاره المستخدم من قائمة Wi-Fi'],
  ['Enabled/Disabled State', 'هل WLAN فعّال ويبث/يخدم العملاء', 'WLAN معطل لن يخدم العملاء كما هو متوقع'],
  ['Interface/VLAN Mapping', 'ربط WLAN بشبكة سلكية منطقية', 'يحدد أين تدخل حركة العميل بعد الارتباط'],
  ['Security Settings', 'طريقة الحماية والمصادقة والتشفير', 'PSK خاطئ أو وضع غير متوافق يمنع الاتصال'],
  ['Authentication Method', 'PSK أو 802.1X/Enterprise وغيرها حسب المنصة', 'يجب أن يطابق إعداد العميل'],
  ['Client Access', 'سياسات الوصول/الحالة العامة', 'يتأثر أيضاً بسياسات RF والـ AP groups حسب المنصة'],
]

const configRows: string[][] = [
  ['WLAN ID', '10'],
  ['Profile Name', 'Company-Staff'],
  ['SSID', 'Company-Staff'],
  ['VLAN', '10'],
  ['Security', 'WPA2-Personal'],
  ['Authentication', 'PSK'],
  ['Encryption', 'AES/CCMP'],
  ['WLAN State', 'Enabled'],
]

const guiWalkRows: string[][] = [
  ['1. Log in to WLC', 'صفحة إدارة WLC عبر HTTPS', 'بيانات مسؤول صحيحة', 'بدون وصول GUI لا يمكن تهيئة WLAN', 'فشل login أو وصول لمنفذ/عنوان خاطئ'],
  ['2. Open WLAN section', 'قسم WLANs/Wireless في GUI', 'الوصول لقائمة WLAN profiles', 'هنا تُدار SSIDs', 'الخلط بين AireOS و9800 menus'],
  ['3. Create new WLAN', 'إجراء Create/Add WLAN', 'WLAN ID + Profile Name', 'ينشئ كائن WLAN', 'اختيار ID/Profile غير واضح'],
  ['4. Enter SSID', 'حقل SSID', 'Company-Staff', 'اسم الشبكة الذي يراه العميل', 'كتابة SSID مختلفة عن المقصودة'],
  ['5. Enable WLAN', 'حالة WLAN', 'Enabled', 'بدونه لن يخدم العملاء', 'نسيان التفعيل'],
  ['6. Map to interface/VLAN', 'Interface/VLAN mapping', 'VLAN 10 / interface مناسب', 'يوصل العميل للشبكة السلكية الصحيحة', 'VLAN خاطئ أو غير موجود على الشبكة السلكية'],
  ['7. Configure security', 'Security tab/settings', 'WPA2-Personal, PSK, AES/CCMP', 'يحمي الاتصال اللاسلكي', 'اختيار وضع أمني غير متوافق'],
  ['8. Apply/save', 'Apply/Save/Deploy حسب المنصة', 'حفظ التغييرات', 'بدونه قد لا تُطبّق أو لا تستمر', 'نسيان Apply أو افتراض سلوك حفظ موحد'],
  ['9. Verify', 'WLAN/AP/client/DHCP status', 'SSID ظاهر والعميل يحصل على IP', 'يؤكد نجاح الإعداد end-to-end', 'الاعتماد على "متصل" فقط دون فحص IP'],
]

const troubleRows: string[][] = [
  ['Confusing WLAN Profile Name with SSID', 'تحقق من حقل Profile Name وحقل SSID بشكل منفصل في GUI.'],
  ['Forgetting to enable the WLAN', 'تأكد أن حالة WLAN Enabled وأن السياسة/AP association تسمح بالبث/الخدمة.'],
  ['Incorrect WLAN-to-VLAN mapping', 'راجع mapping في WLC وتأكد أن VLAN موجود ومسموح على trunk ومزوّد بـ DHCP.'],
  ['Configuring unsupported security mode', 'طابق إعداد العميل مع WPA2-Personal/AES-CCMP المدعوم في المنصة.'],
  ['Incorrect PSK', 'أعد إدخال PSK وتحقق من حساسية الأحرف وتوافق العميل.'],
  ['Mismatched client security settings', 'تأكد أن العميل يستخدم WPA2-Personal وليس Enterprise أو إعداد قديم غير متوافق.'],
  ['AP not joined to WLC', 'تحقق من AP join/status وCAPWAP connectivity قبل لوم WLAN.'],
  ['Missing VLAN on switch trunk', 'راجع allowed VLANs ووجود VLAN على access/distribution switches.'],
  ['DHCP failure', 'تحقق من DHCP scope, relay/helper, VLAN interface, وlogs.'],
  ['Incorrect gateway', 'تحقق من default gateway في DHCP scope وSVI على الشبكة السلكية.'],
  ['Assuming authentication guarantees Internet', 'افصل بين auth، association، DHCP، gateway، DNS، routing.'],
  ['Forgetting to apply or save changes', 'طبق التغييرات وتحقق من سلوك الحفظ حسب AireOS/9800.'],
]

const workflowRows = [
  { title: '1', text: 'تحقق من إمكانية الوصول إلى WLC GUI عبر HTTPS وعنوان الإدارة الصحيح.' },
  { title: '2', text: 'تحقق من وجود WLAN profile المطلوب.' },
  { title: '3', text: 'تحقق من أن WLAN مفعّل (Enabled).' },
  { title: '4', text: 'تحقق من SSID الصحيح وعدم الخلط مع Profile Name.' },
  { title: '5', text: 'تحقق من Interface/VLAN mapping الصحيح.' },
  { title: '6', text: 'تحقق من إعدادات الأمان: WPA2-Personal, PSK, AES/CCMP حسب المنصة.' },
  { title: '7', text: 'تحقق من انضمام AP إلى WLC وقدرته على بث/خدمة SSID.' },
  { title: '8', text: 'تحقق من ظهور SSID للعميل ومحاولة association/authentication.' },
  { title: '9', text: 'تحقق من نجاح المصادقة وحالة العميل على WLC.' },
  { title: '10', text: 'تحقق من حصول العميل على IP من DHCP.' },
  { title: '11', text: 'تحقق من gateway وDNS.' },
  { title: '12', text: 'اختبر الاتصال end-to-end داخل VLAN وخارجها حسب السياسة.' },
]

const verifyRows: string[][] = [
  ['WLAN status', 'هل WLAN Enabled/Disabled؟', 'GUI WLAN list/status أو أوامر summary حسب المنصة'],
  ['WLAN ID / SSID', 'هل المعرف والاسم صحيحان؟', 'GUI WLAN details أو `show wlan summary` / `show wireless wlan summary`'],
  ['Interface/VLAN mapping', 'هل WLAN مربوط بالـ VLAN/interface الصحيح؟', 'GUI WLAN interface mapping أو تفاصيل WLAN'],
  ['Security policy', 'هل WPA2-PSK/AES مضبوط؟', 'GUI Security settings؛ تحقق من تطابق العميل'],
  ['Associated APs', 'هل AP منضم ويخدم WLAN؟', 'GUI AP status أو `show ap summary`'],
  ['Associated clients', 'هل العميل مرتبط ومصادق؟', 'GUI client list أو `show wireless client summary`'],
  ['Client IP', 'هل حصل العميل على IP من DHCP؟', 'GUI client details / OS client IP'],
  ['Auth status', 'هل فشل بسبب PSK/security؟', 'GUI client/auth logs أو platform-specific debug بعناية'],
]

export const topic29Lesson: Lesson = {
  topicId: '2.9',
  title: 'Interpret the wireless LAN GUI configuration for client connectivity, such as WLAN creation, security settings, QoS profiles, and advanced settings',
  description:
    'Topic 2.9 يغطي إعداد WLAN من واجهة WLC GUI: إنشاء WLAN/SSID، ربطه بـ VLAN/interface، إعداد WPA2-PSK، تطبيق/حفظ/تحقق، وتدفق اتصال العميل وDHCP واستكشاف الأخطاء. الشرح يميّز بين AireOS وCatalyst 9800 IOS XE حيث يختلف السلوك أو المسميات. جميع أمثلة GUI/CLI تعليمية ومحاكاة مفاهيمية؛ لا توجد لقطات من جهاز حقيقي ولا بيانات اعتماد افتراضية. Topic 3.1 لم يُفتح.',
  estimatedTime: '~120 دقيقة',
  steps: [
    {
      id: 'what',
      title: 'WLAN Configuration Fundamentals',
      short: 'أساسيات إعداد WLAN',
      blocks: [
        { type: 'paragraph', text: '**WLAN** هي شبكة لاسلكية منطقية تُهيأ على الـ Wireless LAN Controller وتُبث عبر Access Points. **SSID** هو اسم الشبكة اللاسلكية الذي يراه العميل. العلاقة: WLAN profile/config يحدد كيف تعمل الشبكة، وSSID هو الاسم الذي يُعلن للعملاء. قد يتطابق الاسم الداخلي مع SSID، لكنهما ليسا نفس المفهوم دائماً.' },
        { type: 'diagram', id: 'enterprise-wlan-architecture', caption: 'معمارية WLAN مؤسسة: المسؤول يهيئ WLC، الـ AP يبث SSID، والعميل يرتبط ويمر عبر VLAN المعين.' },
        { type: 'list', items: [
          '**Wireless client**: جهاز المستخدم مثل laptop/phone يتصل بالـ SSID.',
          '**Access Point (AP)**: يبث SSID ويوفر الوصول الراديوي؛ في lightweight architecture يعمل مع WLC.',
          '**Wireless LAN Controller (WLC)**: يهيئ WLANs والسياسات ويربطها بالشبكة السلكية حسب التصميم.',
          '**WLAN-to-VLAN mapping**: يربط WLAN بشبكة VLAN محددة لعزل الحركة وتوجيهها.',
          '**WLAN Security**: يحدد المصادقة والتشفير مثل WPA2-Personal/PSK.',
          '**Client Association**: ارتباط العميل بـ AP/SSID بعد نجاح المصادقة حسب الإعداد.',
        ]},
        { type: 'paragraph', text: 'تدفق الإعداد المفاهيمي: **WLC → WLAN Configuration → SSID → VLAN/Interface Mapping → Security → AP Broadcasting → Client Connection**. يمكن تكوين عدة WLANs على نفس الـ controller، وكل WLAN يمكن ربطه بـ interface/VLAN مناسب حسب البنية.' },
        { type: 'callout', tone: 'info', title: 'منصة WLC', text: 'واجهات Cisco WLC تختلف بين **AireOS** و**Catalyst 9800 IOS XE**. هذا الدرس يشرح المفاهيم والخطوات المفاهيمية، ولا يفترض أن أسماء القوائم أو الشاشات متطابقة.' },
      ],
    },
    {
      id: 'how',
      title: 'Accessing the Cisco WLC GUI',
      short: 'الوصول إلى WLC GUI',
      blocks: [
        { type: 'paragraph', text: 'للوصول إلى WLC GUI، يربط المسؤول محطة الإدارة بشبكة الإدارة، يتأكد من عنوان **WLC management IP**، ثم يفتح المتصفح إلى HTTPS لذلك العنوان. بعد تسجيل الدخول ببيانات مسؤول، يمكن إنشاء WLANs وتعديل الإعدادات. هذا يختلف عن IP الخاص بالـ AP أو IP الذي يحصل عليه العميل اللاسلكي لاحقاً.' },
        { type: 'diagram', id: 'wlc-gui-configuration-workflow', caption: 'سير عمل GUI مفاهيمي: login، إنشاء WLAN، mapping/security، apply/save، verify.' },
        { type: 'table', headers: ['العنوان/الهوية', 'الغرض', 'ملاحظة'], rows: [
          ['WLC management IP', 'إدارة الـ controller عبر GUI/SSH', 'يستخدمه المسؤول للوصول الإداري'],
          ['AP management/connectivity', 'انضمام AP وإدارته', 'قد يكون في VLAN إدارة AP وقد يختلف عن client VLAN'],
          ['Wireless client IP', 'عنوان العميل بعد association وDHCP', 'يأتي من VLAN المربوط بـ WLAN، ليس من management IP للـ WLC'],
        ]},
        { type: 'steps', items: [
          { title: '1. Connect admin workstation', text: 'صل محطة الإدارة بشبكة يمكنها الوصول إلى WLC management interface.' },
          { title: '2. Identify management IP', text: 'استخدم عنوان إدارة WLC المعروف من التوثيق أو الإعداد الأولي. لا تفترض عنواناً افتراضياً.' },
          { title: '3. Open HTTPS', text: 'افتح المتصفح إلى واجهة HTTPS للإدارة. HTTPS مفضل لأن الإدارة عبر HTTP غير مشفرة.' },
          { title: '4. Authenticate', text: 'سجل الدخول بحساب مسؤول صالح. لا تفترض بيانات اعتماد افتراضية عالمية.' },
          { title: '5. Verify readiness', text: 'تأكد أن WLC وAPs والشبكة السلكية وDHCP جاهزة قبل إنشاء WLAN للإنتاج.' },
        ]},
        { type: 'callout', tone: 'warning', title: 'لا توجد افتراضات عامة', text: 'لا تفترض بيانات اعتماد افتراضية، ولا نفس شاشات الإعداد الأولي، ولا نفس أسماء القوائم بين AireOS وCatalyst 9800. استخدم هذا كمسار مفاهيمي.' },
      ],
    },
    {
      id: 'packet',
      title: 'Understanding WLAN and SSID Configuration',
      short: 'WLAN وSSID',
      blocks: [
        { type: 'paragraph', text: 'عند إنشاء WLAN، أنت لا تكتب SSID فقط. أنت تضبط كائن WLAN له معرف وحالة وربط VLAN وسياسة أمان. فهم الحقول يمنع أخطاء مثل تفعيل WLAN بدون mapping صحيح أو الخلط بين الاسم الداخلي وSSID.' },
        { type: 'diagram', id: 'wlan-profile-vs-ssid', caption: 'WLAN Profile Name هو تعريف داخلي في WLC؛ SSID هو الاسم الذي يراه المستخدم.' },
        { type: 'table', headers: ['Parameter', 'Meaning', 'Why it matters'], rows: wlanParamRows },
        { type: 'paragraph', text: 'مثال مؤسسة واقعي:' },
        { type: 'table', headers: ['WLAN', 'SSID', 'VLAN', 'Purpose'], rows: enterpriseRows },
        { type: 'diagram', id: 'wlan-to-vlan-mapping', caption: 'ربط WLAN بـ VLAN يحدد أين تدخل حركة العميل بعد الارتباط.' },
        { type: 'diagram', id: 'multiple-wlans-vlans', caption: 'عدة SSIDs يمكن أن تربط بعدة VLANs لعزل Staff/Guest/IT.' },
        { type: 'callout', tone: 'warning', title: 'VLAN mapping ليس كافياً وحده', text: 'ربط WLAN بـ VLAN في WLC لا ينشئ VLAN على كل السويتشات تلقائياً. يجب أن تدعم البنية السلكية VLANs، trunk allowed VLANs، DHCP، وgateway.' },
      ],
    },
    {
      id: 'config',
      title: 'Creating a New WLAN',
      short: 'إنشاء WLAN',
      blocks: [
        { type: 'paragraph', text: 'إنشاء WLAN في GUI يتبع منطقاً ثابتاً حتى لو اختلفت أسماء القوائم بين AireOS وCatalyst 9800. في AireOS الكلاسيكي سترى غالباً مفاهيم مثل WLANs وInterfaces؛ في Catalyst 9800 سترى نموذج IOS XE/GUI أحدث وقد تختلف المسميات مثل WLAN Profile/Policy Profile/Tagging حسب التصميم. لذلك نركز على **ماذا** تفعل و**لماذا**.' },
        { type: 'diagram', id: 'wlc-gui-configuration-workflow', caption: 'سير عمل إنشاء WLAN: create, SSID, enable, map, secure, apply, verify.' },
        { type: 'steps', items: [
          { title: '1. Log in to the WLC', text: 'افتح HTTPS إلى management IP وسجل الدخول. الخطأ الشائع: محاولة إدارة WLC من شبكة غير مسموح لها أو استخدام HTTP غير آمن حيث HTTPS مطلوب.' },
          { title: '2. Navigate to WLAN configuration', text: 'اذهب لقسم WLANs/Wireless. في AireOS غالباً WLANs menu؛ في 9800 قد يكون Configuration > Tags & Profiles > WLANs أو ما يعادله. لا تعتمد على اسم قائمة واحد.' },
          { title: '3. Create a new WLAN', text: 'اختر Add/Create. النتيجة: كائن WLAN جديد غير مكتمل حتى تضبط الحقول الضرورية.' },
          { title: '4. Select WLAN ID', text: 'حدد معرفاً واضحاً مثل 10. يساعد في التنظيم والاستكشاف. تجنب إعادة استخدام ID بشكل مربك.' },
          { title: '5. Enter Profile Name', text: 'أدخل Profile Name مثل Company-Staff. هذا اسم داخلي للـ controller وقد يظهر في الإدارة.' },
          { title: '6. Enter SSID', text: 'أدخل SSID الذي سيراه العملاء. تأكد من الإملاء والحالة المناسبة لأن العميل سيبحث عنه بهذا الاسم.' },
          { title: '7. Enable the WLAN', text: 'فعّل WLAN. إذا بقي Disabled فلن يحصل العملاء على الخدمة المتوقعة.' },
          { title: '8. Select interface/VLAN mapping', text: 'اربط WLAN بـ VLAN 10 أو interface المناسب. بدون mapping صحيح قد يحصل العميل على IP خاطئ أو لا يحصل على IP.' },
          { title: '9. Apply or save', text: 'طبق واحفظ حسب المنصة. في AireOS يوجد غالباً Apply/Save Configuration؛ في IOS XE/9800 قد يكون Save/Deploy حسب وضع الإدارة. تحقق دائماً من النتيجة.' },
        ]},
        { type: 'table', headers: ['Step', 'Conceptual location', 'Example value', 'Why needed', 'Common mistake'], rows: guiWalkRows },
        { type: 'callout', tone: 'danger', title: 'تمثيل تعليمي', text: 'هذه خطوات مفاهيمية تعليمية وليست لقطات شاشة أو إجراء تم تنفيذه على WLC حقيقي. أسماء القوائم تختلف بين AireOS وCatalyst 9800 IOS XE.' },
      ],
    },
    {
      id: 'verify',
      title: 'Mapping WLANs to VLANs and Interfaces',
      short: 'ربط WLAN بـ VLAN',
      blocks: [
        { type: 'paragraph', text: 'WLAN يحتاج إلى نقطة دخول للشبكة السلكية. ربط WLAN بـ VLAN أو interface منطقي يحدد أين ستُوضع حركة العميل بعد association. هذا يسمح بفصل Staff وGuest وIT على نفس البنية اللاسلكية.' },
        { type: 'diagram', id: 'multiple-wlans-vlans', caption: 'Company-Staff→VLAN 10, Company-Guest→VLAN 20, Company-IT→VLAN 30.' },
        { type: 'table', headers: ['SSID', 'VLAN', 'Typical wired need'], rows: [
          ['Company-Staff', '10', 'VLAN 10 موجود، DHCP/Gateway صحيح، trunk يسمح بـ 10'],
          ['Company-Guest', '20', 'عزل guest، DHCP/Gateway مناسب، trunk يسمح بـ 20'],
          ['Company-IT', '30', 'سياسات IT، VLAN 30 على السويتشات، trunk يسمح بـ 30'],
        ]},
        { type: 'list', items: [
          'ربط WLAN بـ VLAN في WLC **لا ينشئ** VLAN تلقائياً على access/distribution switches.',
          'يجب أن تدعم access switches وtrunk links وallowed VLAN lists هذه VLANs.',
          'DHCP services وdefault gateway يجب أن يكونا صحيحين لكل VLAN.',
          'تفاصيل trunk configuration تعود إلى Topic 2.2؛ هنا نركز على أثرها على WLAN.',
          'في Catalyst 9800 قد يظهر الربط ضمن Policy Profile/Tagging model؛ في AireOS غالباً interface mapping مباشر أكثر. المفهوم واحد: حركة العميل تنتهي في VLAN/segment صحيح.',
        ]},
        { type: 'callout', tone: 'warning', title: 'نجاح لاسلكي لا يعني نجاح سلكي', text: 'قد ينجح العميل في الاتصال بالـ SSID لكنه يفشل في الحصول على IP أو الوصول للشبكة إذا كان VLAN mapping أو trunk أو DHCP خاطئاً.' },
      ],
    },
    {
      id: 'mistakes',
      title: 'Configuring WLAN Security',
      short: 'أمان WLAN',
      blocks: [
        { type: 'paragraph', text: 'أمان WLAN ضروري لأن الوسط اللاسلكي مشترك. يجب التمييز بين **Authentication** (إثبات الهوية/الدخول)، **Encryption** (حماية البيانات)، و**Authorization** (ما الذي يُسمح به بعد الدخول). شبكات مفتوحة مناسبة فقط لسيناريوهات محددة جداً؛ معظم شبكات المؤسسات تحتاج أماناً.' },
        { type: 'diagram', id: 'wpa2-psk-security-architecture', caption: 'WPA2-Personal يستخدم PSK مشتركاً وAES-CCMP لحماية البيانات.' },
        { type: 'table', headers: ['المفهوم', 'المعنى', 'مثال'], rows: [
          ['Open WLAN', 'بدون مصادقة PSK/802.1X تقليدية', 'Guest portal scenario - ليس افتراضياً آمناً'],
          ['WPA2-Personal / PSK', 'مصادقة بعبارة مرور مشتركة', 'شبكة صغيرة/منزلية أو بعض بيئات بسيطة'],
          ['WPA2-Enterprise', 'مصادقة فردية غالباً عبر 802.1X/RADIUS', 'مؤسسات تحتاج هوية لكل مستخدم'],
          ['AES-CCMP', 'آلية تشفير/حماية قوية مستخدمة مع WPA2', 'حماية إطارات البيانات'],
        ]},
        { type: 'list', items: [
          '**WPA2-PSK** يستخدم passphrase مشتركاً. كل من يعرف المفتاح يمكنه محاولة الاتصال.',
          '**WPA2-Enterprise** يستخدم هوية فردية عادة مع RADIUS/802.1X، وهو أفضل للبيئات الكبيرة.',
          'لا تخلط بين WPA2-PSK وWPA2-Enterprise: الأول shared credential، الثاني individual authentication.',
          'المنصات الحديثة قد توفر WPA3 وخيارات أخرى، لكن هدف CCNA هنا يركز على WPA2-PSK.',
        ]},
        { type: 'callout', tone: 'info', title: 'Authentication vs Encryption', text: 'Authentication تتحقق من حق العميل بالدخول؛ Encryption تحمي البيانات بعد إنشاء المفاتيح. Authorization تحدد الصلاحيات/السياسات وقد تكون عبر WLAN policy أو AAA حسب التصميم.' },
      ],
    },
    {
      id: 'lab',
      title: 'Configuring WPA2-PSK Authentication',
      short: 'إعداد WPA2-PSK',
      blocks: [
        { type: 'paragraph', text: 'WPA2-Personal (WPA2-PSK) هو هدف CCNA مهم. الفكرة: تختار WLAN، تدخل إعدادات Security، تختار WPA2-Personal/PSK، تضبط passphrase، تختار AES/CCMP حيث يظهر، ثم تطبق وتتحقق. العميل يجب أن يطابق نفس وضع الأمان ويدخل نفس PSK.' },
        { type: 'diagram', id: 'wpa2-authentication-flow', caption: 'تدفق WPA2-PSK: اختيار SSID، إدخال PSK، مصادقة/تأسيس مفاتيح، association، ثم DHCP.' },
        { type: 'diagram', id: 'wireless-client-ssid-discovery', caption: 'العميل يكتشف SSID قبل محاولة الاتصال.' },
        { type: 'table', headers: ['Parameter', 'Example'], rows: configRows },
        { type: 'steps', items: [
          { title: '1. Select WLAN', text: 'افتح WLAN Company-Staff (ID 10) في GUI.' },
          { title: '2. Open Security settings', text: 'انتقل لقسم Security/Layer 2 security حسب منصة AireOS أو 9800.' },
          { title: '3. Choose WPA2 policy', text: 'اختر WPA2/WPA2-Personal. المسميات تختلف حسب GUI، لكن الهدف WPA2-Personal.' },
          { title: '4. Select PSK authentication', text: 'اختر PSK/Pre-Shared Key. لا تختر 802.1X/Enterprise لهذا السيناريو.' },
          { title: '5. Configure PSK', text: 'أدخل passphrase قوية. مثال تعليمي: `Example-Staff-PSK-2026!` (لا تستخدمه في شبكة حقيقية).' },
          { title: '6. Select AES/CCMP', text: 'اختر AES أو CCMP حيث تعرضه المنصة. تجنب أوضاع قديمة غير مطلوبة.' },
          { title: '7. Apply/save', text: 'طبق الإعدادات واحفظها حسب سلوك المنصة.' },
        ]},
        { type: 'list', items: [
          'PSK خاطئ يؤدي إلى فشل authentication.',
          'إعداد أمان غير متوافق على العميل يؤدي إلى فشل الاتصال أو عدم ظهور الشبكة بشكل مناسب.',
          'WPA2-PSK shared credential: مناسب للبساطة، لكنه أقل ملاءمة لبيئات كبيرة تحتاج هوية فردية ومساءلة مركزية.',
          'المنصات الحديثة قد تعرض WPA3/transition modes؛ اذكرها فقط كسياق، وابقِ التكوين على هدف CCNA: WPA2-PSK.',
        ]},
        { type: 'callout', tone: 'warning', title: 'لا تخلط PSK مع Enterprise', text: 'WPA2-PSK = passphrase مشتركة. WPA2-Enterprise = عادة 802.1X/EAP مع RADIUS وهوية فردية.' },
      ],
    },
    {
      id: 'exam',
      title: 'Applying, Testing, and Verifying WLAN Configuration',
      short: 'التطبيق والتحقق',
      blocks: [
        { type: 'paragraph', text: 'بعد إعداد WLAN، يجب تطبيق/حفظ الإعدادات ثم التحقق من كل طبقة: WLC config، AP broadcasting، client association، DHCP، ثم الاتصال end-to-end. سلوك الحفظ يختلف: بعض واجهات AireOS التقليدية تفرق بين Apply وSave Configuration؛ في Catalyst 9800/IOS XE قد ترى Save/Apply/Deploy بحسب نمط الإدارة. لا تفترض زرًا واحدًا بنفس الاسم.' },
        { type: 'diagram', id: 'wireless-client-association', caption: 'بعد اكتشاف SSID، العميل يمر بمرحلة المصادقة والارتباط.' },
        { type: 'diagram', id: 'dhcp-after-association', caption: 'نجاح association لا يكفي؛ العميل يحتاج DHCP للحصول على IP.' },
        { type: 'diagram', id: 'wireless-client-traffic-through-wlc', caption: 'حركة العميل تمر من AP إلى البنية السلكية عبر VLAN المعين.' },
        { type: 'diagram', id: 'complete-wlan-config-verification-workflow', caption: 'سير عمل كامل: create, secure/map, apply, associate, DHCP/test.' },
        { type: 'table', headers: ['What to verify', 'Question', 'Where/how (conceptual)'], rows: verifyRows },
        { type: 'paragraph', text: '**Representative platform-specific CLI examples (educational, not universal):**' },
        { type: 'code', label: 'AireOS / platform-specific examples - educational', language: 'text', code: `# AireOS-style examples (platform dependent)
show wlan summary
show wlan 10
show client summary
show ap summary` },
        { type: 'code', label: 'Catalyst 9800 IOS XE examples - educational', language: 'text', code: `# Catalyst 9800 IOS XE-style examples (platform dependent)
show wireless wlan summary
show wlan id 10
show wireless client summary
show ap summary` },
        { type: 'paragraph', text: '**Representative educational output - simulated, not from a real controller:**' },
        { type: 'code', label: 'show wireless wlan summary - simulated example', language: 'text', code: `WLAN  Profile Name     SSID            Status  Interface
10    Company-Staff    Company-Staff   UP      vlan10

# simulated educational output - not captured from real hardware` },
        { type: 'callout', tone: 'danger', title: 'أوامر CLI حسب المنصة', text: 'أوامر AireOS تختلف عن Catalyst 9800 IOS XE. لا تقدم هذه الأوامر كأوامر تعمل على كل WLC. استخدم GUI أو CLI المناسب لمنصة الجهاز الفعلية.' },
        { type: 'list', items: [
          'التحقق من WLAN enabled لا يكفي؛ تحقق أيضاً من SSID broadcast/service وAP join.',
          'نجاح wireless authentication لا يضمن IP connectivity.',
          'إذا نجحت المصادقة لكن لا يوجد IP: افحص DHCP scope، VLAN mapping، trunk allowed VLANs، helper/relay، وgateway.',
          'إذا فشل الاتصال بالإنترنت بعد الحصول على IP: افحص gateway، DNS، routing، وACL/policy.',
        ]},
      ],
    },
    {
      id: 'summary',
      title: 'Troubleshooting, Practical Labs, and CCNA Exam Review',
      short: 'استكشاف الأخطاء واللابات',
      blocks: [
        { type: 'diagram', id: 'common-wlan-configuration-failures', caption: 'أعطال WLAN الشائعة: WLAN معطل، PSK/security خاطئ، VLAN mapping، DHCP/trunk، routing بعد النجاح.' },
        { type: 'paragraph', text: '**Common mistakes**' },
        { type: 'table', headers: ['المشكلة', 'التصحيح'], rows: troubleRows },
        { type: 'paragraph', text: '**Troubleshooting workflow**' },
        { type: 'steps', items: workflowRows },
        { type: 'paragraph', text: '**Lab 1 - Create a WPA2-PSK WLAN (Packet Tracer-style / conceptual)**' },
        { type: 'steps', items: [
          { title: 'Topology', text: 'WLC واحد، Lightweight AP واحد، Access Switch واحد، Wireless Client واحد، شبكة بها DHCP. التمرين مفاهيمي/Packet Tracer-style ولم يُنفذ على أجهزة حقيقية.' },
          { title: 'Config', text: 'WLAN ID 10, Profile Company-Staff, SSID Company-Staff, VLAN 10, Security WPA2-PSK, AES/CCMP, Enabled.' },
          { title: 'Tasks 1-7', text: 'ادخل WLC GUI مفاهيمياً، أنشئ WLAN، اضبط SSID، اربط VLAN 10، فعّل WPA2-PSK، اضبط PSK تعليمي قوي، فعّل WLAN.' },
          { title: 'Tasks 8-11', text: 'تحقق من بث AP، اربط العميل، تحقق من DHCP IP، واختبر الاتصال.' },
          { title: 'Expected result', text: 'العميل يرى Company-Staff، ينجح في WPA2-PSK، يحصل على IP من VLAN 10، ويصل للشبكة المسموح بها.' },
        ]},
        { type: 'paragraph', text: '**Lab 2 - Configure Multiple WLANs (conceptual)**' },
        { type: 'steps', items: [
          { title: 'Create', text: 'أنشئ Staff/Company-Staff/VLAN10، Guest/Company-Guest/VLAN20، IT/Company-IT/VLAN30.' },
          { title: 'Map and secure', text: 'اربط كل WLAN بـ VLAN المناسب وفعّل إعداد أمان مناسب (WPA2-PSK للتمرين المفاهيمي حيث يلزم).' },
          { title: 'Verify', text: 'تحقق من ظهور SSIDs، اتصال العملاء بالشبكة الصحيحة، والحصول على عناوين IP من VLANs المناسبة.' },
          { title: 'Wired dependency', text: 'حدد VLANs المطلوبة على trunk allowed VLAN list بين AP/switch/WLC path حسب التصميم.' },
        ]},
        { type: 'paragraph', text: '**Lab 3 - WLAN Troubleshooting (conceptual)**' },
        { type: 'steps', items: [
          { title: 'Symptoms', text: 'PSK خاطئ، WLAN معطل، VLAN mapping خاطئ، VLAN مفقود على trunk، AP غير منضم، DHCP غير متاح، فشل auth، security mode خاطئ.' },
          { title: 'Method', text: 'لكل مشكلة: حدد العرض، اعزل السبب، توقع السلوك، طبق تصحيحاً مفاهيمياً، ثم تحقق.' },
          { title: 'Key lesson', text: 'افصل بين RF/SSID، authentication، association، VLAN، DHCP، gateway/DNS/routing.' },
        ]},
        { type: 'callout', tone: 'warning', title: 'قيود المختبر', text: 'اللابات conceptual/Packet Tracer-style ولم تُنفذ على WLC حقيقي. Packet Tracer قد لا يدعم كل ميزات WLC GUI أو كل نماذج/إصدارات controllers.' },
        { type: 'list', items: [
          'SSID هو اسم الشبكة؛ WLAN profile هو تعريف WLAN في WLC وقد يتضمن SSID وVLAN والأمان.',
          'WLAN-to-VLAN mapping يحدد شريحة الشبكة السلكية للعميل، لكنه لا ينشئ VLANs على السويتشات.',
          'WPA2-PSK يستخدم passphrase مشتركة وAES-CCMP؛ يختلف عن WPA2-Enterprise.',
          'نجاح authentication لا يعني نجاح DHCP أو الوصول للإنترنت.',
          'AireOS وCatalyst 9800 يختلفان في GUI/بعض الأوامر وسلوك apply/save؛ لا تعمم واجهة واحدة.',
        ]},
        { type: 'paragraph', text: '**اختبار CCNA**' },
        { type: 'paragraph', text: '5 أسئلة، 4 خيارات لكل سؤال، ومزيج من single-choice وmultiple-select. قبل الإرسال لا تظهر الإجابة؛ بعد الإرسال يظهر الشرح وتتقفل الخيارات ويختفي زر التحقق.' },
        { type: 'quiz', questions: [
          {
            id: 'q1',
            prompt: 'Which statement best describes the relationship between a WLAN and an SSID?',
            options: [
              'An SSID is the wireless network name clients see, while the WLAN configuration defines how that wireless network operates on the controller.',
              'An SSID and a WLAN ID are always the same value and cannot differ.',
              'A WLAN is only needed after the client gets an IP address from DHCP.',
              'The SSID replaces the need for VLAN mapping on the wired network.',
            ],
            correctIndex: 0,
            requireSubmit: true,
            explanation: 'الصح هو **(A)**. SSID هو الاسم الذي يراه العميل، بينما WLAN profile/config في WLC يحدد الحالة، SSID، VLAN/interface mapping، والأمان. قد يتشابه Profile Name مع SSID لكنه ليس شرطاً أن يكونا نفس الشيء.',
          },
          {
            id: 'q2',
            prompt: 'A wireless client successfully authenticates to Company-Staff but does not receive an IP address. Which issue is MOST likely?',
            options: [
              'A DHCP or VLAN-related issue in the mapped wired network',
              'The SSID name was visible to the client',
              'The client used AES-CCMP encryption',
              'The WLC GUI was accessed over HTTPS',
            ],
            correctIndex: 0,
            requireSubmit: true,
            explanation: 'الصح هو **(A)**. نجاح المصادقة لا يضمن حصول العميل على IP. إذا كان WLAN مربوطاً بـ VLAN خاطئ، أو VLAN غير موجود على trunk، أو DHCP scope/helper/gateway غير صحيح، فقد يفشل DHCP بعد association.',
          },
          {
            id: 'q3',
            prompt: 'Which statement about WPA2-PSK is correct?',
            options: [
              'It uses a shared passphrase and is different from WPA2-Enterprise, which typically uses individual 802.1X authentication.',
              'It provides individual user authentication through RADIUS by default.',
              'It removes the need for encryption on the WLAN.',
              'It is identical to an open WLAN as long as the SSID is hidden.',
            ],
            correctIndex: 0,
            requireSubmit: true,
            explanation: 'الصح هو **(A)**. WPA2-Personal/PSK يعتمد على passphrase مشترك. WPA2-Enterprise يستخدم عادة 802.1X/RADIUS لهويات فردية. إخفاء SSID لا يجعل الشبكة مفتوحة آمنة ولا يساوي WPA2-PSK.',
          },
          {
            id: 'q4',
            kind: 'multiple',
            prompt: 'Which items must be correct for a client to connect to a WPA2-PSK WLAN and obtain network access? (Choose more than one.)',
            options: [
              'The WLAN is enabled and the client uses the correct SSID/security settings.',
              'The WLAN-to-VLAN mapping and wired VLAN/DHCP infrastructure are correct.',
              'The client enters the correct PSK.',
              'The WLC management IP must be assigned as the client default gateway.',
            ],
            correctIndices: [0, 1, 2],
            requireSubmit: true,
            explanation: 'الصح هو **(A) و(B) و(C)**. يجب أن يكون WLAN مفعلاً والإعدادات متوافقة، وPSK صحيحاً، والبنية السلكية/VLAN/DHCP صحيحة. عنوان إدارة WLC ليس default gateway لعملاء البيانات.',
          },
          {
            id: 'q5',
            kind: 'multiple',
            prompt: 'Which statements about WLAN troubleshooting are correct? (Choose more than one.)',
            options: [
              'A wrong PSK or mismatched security mode can cause client authentication failure.',
              'A missing VLAN on a switch trunk can prevent clients from reaching DHCP even after wireless association.',
              'Successful wireless association always guarantees Internet connectivity.',
              'AireOS and Catalyst 9800 IOS XE may differ in GUI layout and verification commands.',
            ],
            correctIndices: [0, 1, 3],
            requireSubmit: true,
            explanation: 'الصح هو **(A) و(B) و(D)**. أخطاء PSK/security تمنع المصادقة، وغياب VLAN على trunk يمكن أن يكسر DHCP/الاتصال بعد association. لكن association الناجح لا يضمن الإنترنت. كما أن AireOS و9800 يختلفان في الواجهة والأوامر.',
          },
        ]},
      ],
    },
  ],
}