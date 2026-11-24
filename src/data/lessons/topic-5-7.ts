import type { Lesson } from '../types'

/* ---------- Step 1: threat landscape ---------- */
const threatMitigationRows: string[][] = [
  ['MAC Address Flooding', 'مهاجم بيبعت إطارات بعناوين MAC مصدرية كتير فالـ MAC table تتزحزح أو تمتلئ والسويتش يفيض إطارات', 'Port Security بيقيد عدد الـ secure MACs على الـ access port — مفيد لكن مش حل كامل لوحده'],
  ['DHCP Starvation', 'طلبات DHCP كتير تستهلك الـ pool فالعملاء الشرعيين ما يلاقوش IP', 'DHCP Snooping مع تحديد VLAN، وتقييد معدل الرسائل حيث مدعوم، والحد من عدد الأجهزة على المنفذ'],
  ['Rogue DHCP Server', 'سيرفر مزيف بيدي gateway أو DNS غلط فيحوّل أو يعطّل الترافيك', 'DHCP Snooping: الـ Offer والـ ACK مسموحين بس من المنافذ الـ trusted'],
  ['ARP Spoofing', 'ARP reply مزيف يربط IP بـ MAC تابع للمهاجم', 'DAI بيفحص ARP مقابل DHCP Snooping bindings على المنافذ الـ untrusted'],
  ['ARP Poisoning', 'الـ ARP cache يتسمّم فالحزم تروح لجهاز غلط', 'DAI + binding database صحيحة ومحدّثة'],
  ['Unauthorized device', 'أي جهاز يتوصّل بـ access port يقدر يبدأ يتواصل جوه الـ LAN', 'Port Security، sticky MAC، maximum مناسب، وسياسة واضحة لكل منفذ'],
]

const l2VsL3Rows: string[][] = [
  ['Layer', 'Layer 2 — الإطارات وعناوين MAC ومنافذ السويتش', 'Layer 3 — حزم الـ IP وقرارات التوجيه'],
  ['What it looks at', 'Source MAC، حالة المنفذ، رسائل DHCP وARP', 'Source/Destination IP، البروتوكول، منافذ TCP/UDP'],
  ['Typical controls', 'Port Security، DHCP Snooping، DAI', 'ACL، سياسات التوجيه، Firewall'],
  ['Scope', 'جوه الـ VLAN أو broadcast domain الواحد غالباً', 'بين الشبكات وعبر الراوتر أو Layer 3 switch'],
  ['Can it answer this lesson problem?', 'نعم: منع rogue DHCP وتزيف ARP وتقييد الأجهزة على المنفذ', 'ACL بالـ IP غالباً ما يوقفش rogue DHCP أو ARP مزيف داخل نفس الـ VLAN'],
]

/* ---------- Step 2: Port Security ---------- */
const portSecTermRows: string[][] = [
  ['Secure MAC address', 'عنوان MAC مقبول حسب سياسة المنفذ', 'MAC-A الخاص بـ PC1 على Gi0/1'],
  ['Maximum', 'أعلى عدد من الـ secure MACs مسموح على المنفذ', 'switchport port-security maximum 2'],
  ['Static secure MAC', 'عنوان بيكتبه المسؤول يدوياً في الـ config', 'switchport port-security mac-address 00aa'],
  ['Dynamic secure MAC', 'بيتعلم من الإطارات ويفضل في الـ running config للجلسة الحالية', 'لا يبقى بعد reload'],
  ['Sticky secure MAC', 'بيتعلم ديناميكياً ويتكتب في الـ running config كأنه سطر ثابت', 'switchport port-security mac-address sticky'],
  ['Violation mode', 'الإجراء لما حد أو عنوان مخالف يظهر', 'protect / restrict / shutdown'],
  ['Access port', 'المنفذ المعتاد لتفعيل Port Security', 'switchport mode access'],
]

const learningRows: string[][] = [
  ['Which frames are learned', 'أي إطار واصل له source MAC', 'إطار مقبول حسب سياسة المنفذ والـ maximum'],
  ['Where it is stored', 'MAC address table للسويتش', 'secure MAC table مرتبط بالمنفذ، وقد يظهر في running config حسب النوع'],
  ['Limit', 'سعة جدول الـ MAC table', 'maximum محدد لكل منفذ'],
  ['When limit is exceeded', 'الجدول يمتلئ والسويتش يفيض الإطارات', 'الـ violation mode المهيأ يتطبّق'],
  ['Main purpose', 'اتخاذ قرار الـ forwarding', 'التحكم في مين يتصل بالمنفذ ومنع بعض سيناريوهات MAC flooding'],
]

/* ---------- Step 3: sticky MAC ---------- */
const macTypeRows: string[][] = [
  ['How it is learned', 'يدوي من المسؤول', 'تلقائي من إطار واصل', 'تلقائي من إطار واصل'],
  ['In running config', 'نعم، سطر صريح', 'لا يظهر كسطر ثابت', 'نعم، كسطر شبيه بالـ static'],
  ['After reload', 'يبقى لو الـ config متحفظة', 'لا يبقى', 'يبقى بس لو حفظت الـ running config في startup config'],
  ['Typical use', 'جهاز ثابت ومعروف', 'جلسة مؤقتة أو أجهزة بتتغير كتير', 'أجهزة مستخدمين مع سياسة واضحة وحفظ config'],
  ['Key idea', 'أنت اللي كتبته', 'السويتش اتعلمه للجلسة', 'السويتش اتعلمه وخطّه في الـ config'],
]

const stickyConfigLines: string[][] = [
  ['interface GigabitEthernet0/1', 'دخول على المنفذ اللي هيبقى عليه المستخدم'],
  ['switchport mode access', 'تأكيد إن المنفذ access، وهو المكان المعتاد لتفعيل Port Security'],
  ['switchport port-security', 'تفعيل الميزة على المنفذ ده'],
  ['switchport port-security maximum 2', 'السماح بـ secure MAC واحدين كحد أقصى على المنفذ'],
  ['switchport port-security mac-address sticky', 'تعليم الـ secure MACs من الإطارات وكتابتها في الـ running config'],
]

/* ---------- Step 4: violation modes ---------- */
const violationRows: string[][] = [
  ['Traffic behavior', 'إطار مخالف يتدّى', 'إطار مخالف يتدّى', 'أول violation يحط المنفذ في error-disabled فيتوقف كل الترافيك'],
  ['Port status', 'يفضل up', 'يفضل up', 'err-disabled'],
  ['Violation counter', 'سلوك العدّاد أقل وضوحاً أو محدود مقارنة بـ Restrict', 'بيزداد عند كل violation', 'بيزداد، وحالة المنفذ بتتغير كمان'],
  ['Notifications', 'أقل تنبيهاً؛ حسب المنصة', 'ممكن syslog أو SNMP حسب الإعداد والمنصة', 'تنبيه محتمل + حدث تغيير حالة المنفذ'],
  ['Operational impact', 'هادئ لكن الرؤية ضعيفة', 'توازن شائع بين منع الترافيك والقدرة على التشخيص', 'أقوى رد فعل لكنه يوقف جهاز شرعي كمان لحد المراجعة'],
  ['Typical choice', 'لما الهدف بس منع الإطار', 'لما محتاج عدّاد وتنبيهات', 'لما تفضّل إيقاف المنفذ على السماح بأي لبس'],
]

const recoveryRows: string[][] = [
  ['Protect', 'المنفذ شغال؛ راجع الـ source MAC والسياسة', 'لا يوجد err-disable عادةً، لكن لازم تعرف مين بيبعت الإطارات المخالفة'],
  ['Restrict', 'المنفذ شغال؛ راجع العدّاد والتنبيهات', 'استخدم العدّاد كدليل؛ لا تفترض إن الإطار وصل'],
  ['Shutdown', 'افحص السبب قبل أي استعادة، وبعدين راجع السياسة', 'shutdown / no shutdown أو آلية استعادة مدروسة؛ ما تفعّلش auto-recovery من غير فهم المخاطر'],
]

/* ---------- Step 5: DHCP snooping ---------- */
const dhcpTrustRows: string[][] = [
  ['Where it is used', 'منفذ متصل بسيرفر DHCP شرعي أو بنية DHCP موثوقة', 'منافذ العملاء والجهازات النهائية غالباً'],
  ['Default state', 'لازم يتعرّف صراحةً في كتير من التطبيقات', 'هو الافتراضي في كتير من Cisco implementations'],
  ['DHCP Offer / ACK', 'مسموحين', 'مرفوضين'],
  ['DHCP Discover / Request', 'مش متوقع من هنا في التصميم المعتاد', 'مسموحين ويتم تمريرهم ناحية السيرفر'],
  ['If configured wrongly', 'سيرفر مزيف يقدر يوزّع إعدادات غلط', 'السيرفر الشرعي تترفض عروضه فيتعطل DHCP'],
  ['Rule', 'الـ trust بيتبع الطوبولوجيا الحقيقية، مش قاعدة «كل uplinks trusted»', 'سيب منافذ العملاء untrusted وافحص الاستثناءات فقط'],
]

const bindingRows: string[][] = [
  ['Field', 'Example', 'Why it matters'],
  ['IP address', '192.168.10.11', 'الـ IP اللي اتأجر للعميل'],
  ['MAC address', '00aa.bbcc.dd11', 'هوية الجهاز المرتبط بالعنوان'],
  ['VLAN', '10', 'الـ binding مرتبط بـ VLAN محددة'],
  ['Port', 'GigabitEthernet0/1', 'مين اتوصّل فين — DAI بيقارن المنفذ كمان'],
  ['Lease time', 'remaining lease', 'الـ binding مرتبط بمدة الإيجار'],
]

const snoopVerifyRows: string[][] = [
  ['show ip dhcp snooping', 'حالة التفعيل العالمية والـ VLANs والمنافذ trusted', 'هل Snooping شغال أصلاً وعلى VLAN صح؟'],
  ['show ip dhcp snooping binding', 'جدول الـ IP-to-MAC-to-port', 'هل فيه bindings للعملاء؟ وهل DAI هيلاقي بيانات يتحقق بيها؟'],
  ['show ip dhcp snooping statistics', 'عدّادات الرسائل المرفوضة حيث مدعومة', 'هل فيه Offers مرفوضة من منفذ غلط؟'],
  ['show running-config interface Gi0/24', 'أوامر المنفذ', 'هل ip dhcp snooping trust موجودة على المنفذ الشرعي؟'],
]

/* ---------- Step 6: DAI ---------- */
const daiConceptRows: string[][] = [
  ['ARP job', 'تحويل IPv4 address إلى MAC address للتسليم المحلي', 'بيعمل ARP Request وينتظر ARP Reply'],
  ['Security weakness', 'الـ ARP Reply مش موقّع أو موثّق بقوة', 'أي جهاز يقدر يدّعي إنه صاحب عنوان IP'],
  ['Spoofing', 'رسالة ARP ببيانات مزيفة', 'مهاجم بيقول إن الـ MAC بتاعه هو الـ MAC للـ gateway'],
  ['Poisoning', 'نتيجة التزيف على الـ ARP cache', 'الأجهزة تحفظ معلومة غلط فترسل الحزم للمهاجم'],
  ['DAI answer', 'فحص ARP مقابل مصدر موثوق', 'يفحص sender IP وsender MAC على منافذ untrusted'],
]

const daiVerifyRows: string[][] = [
  ['show ip arp inspection', 'حالة DAI والـ VLANs المفعّلة والإحصائيات حيث مدعومة', 'هل DAI شغال على VLAN 10؟'],
  ['show ip arp inspection interfaces', 'حالة كل منفذ من ناحية DAI', 'مين trusted ومين untrusted؟'],
  ['show ip arp inspection statistics', 'عدد الـ ARP packets المسموحة والمرفوضة', 'هل فيه ARP مترفوض؟'],
  ['show ip dhcp snooping binding', 'بيانات التحقق نفسها', 'هل الـ binding موجود أصلاً؟'],
]

/* ---------- Step 7: complete config and troubleshooting ---------- */
const topologyRows: string[][] = [
  ['S1 Gi0/1', 'PC1 — 192.168.10.11 / MAC 00aa.bbcc.dd11', 'Access VLAN 10 — مستخدم شرعي'],
  ['S1 Gi0/2', 'PC2 — 192.168.10.12 / MAC 00aa.bbcc.dd22', 'Access VLAN 10 — مستخدم شرعي'],
  ['S1 Gi0/3', 'Attacker — 192.168.10.66 / MAC 00aa.bbcc.dd66', 'Access VLAN 10 — جهاز غير مصرّح به'],
  ['S1 Gi0/24', 'DHCP server / trusted uplink — 192.168.10.5', 'Trusted DHCP and ARP infrastructure'],
  ['S1 VLAN 10', '192.168.10.0/24', 'شبكة العملاء في السيناريو'],
]

const workflowRows: string[][] = [
  ['1', 'حدّد access ports وinfrastructure ports', 'رسم الطوبولوجيا على ورقة قبل أي أمر'],
  ['2', 'فعّل Port Security على منافذ العملاء', 'switchport mode access ثم switchport port-security'],
  ['3', 'حدّد الـ maximum', 'مثلاً 2 لكل عميل حسب السياسة'],
  ['4', 'فعّل sticky learning حيث يناسب', 'switchport port-security mac-address sticky'],
  ['5', 'اختر violation mode', 'protect أو restrict أو shutdown مع فهم الأثر'],
  ['6', 'فعّل DHCP Snooping globalاً', 'ip dhcp snooping'],
  ['7', 'فعّله على VLAN الصحيحة', 'ip dhcp snooping vlan 10'],
  ['8', 'عرّف منفذ DHCP الشرعي trusted', 'ip dhcp snooping trust على Gi0/24 فقط بعد التأكد'],
  ['9', 'سيب منافذ العملاء untrusted', 'الافتراضي غالباً؛ ما تضيفش trust لكل المنافذ'],
  ['10', 'فعّل DAI على نفس الـ VLAN', 'ip arp inspection vlan 10'],
  ['11', 'راجع trust الخاص بـ DAI', 'ip arp inspection trust على البنية الموثوقة فقط حسب التصميم'],
  ['12', 'تحقق واختبر', 'أوامر show + اختبار DORA وARP داخل اللاب التعليمي'],
]

const troubleRows: string[][] = [
  ['Port enters error-disabled', 'المنفذ down والترافيك متوقف كلهم', 'Port Security violation مع shutdown', 'show interfaces status + show port-security interface Gi0/1', 'افحص الـ secure MAC والسبب، راجع السياسة، وبعدين استعيد المنفذ بشكل مقصود', 'المنفذ يرجع up بعد إزالة السبب'],
  ['Unexpected MAC violates Port Security', 'عدّاد violation بيزيد أو إطار متدّى', 'جهاز جديد أو MAC مختلف على نفس المنفذ', 'show port-security address + show port-security interface', 'قارن الـ MAC بالأجهزة المعروفة؛ حدّث السياسة أو افصل الجهاز', 'المصدر المخالف يتوقف أو يُضاف بقرار مدروس'],
  ['Sticky MAC lost after reload', 'العميل بيعمل violation بعد إعادة تشغيل', 'الـ running config ما اتحفظش؛ الـ sticky اتعلم بس ما اتحفظش', 'show running-config + show port-security address', 'احفظ بـ copy running-config startup-config بعد ما تتأكد من الأجهزة', 'الـ sticky MACs ترجع بعد reload'],
  ['Legitimate DHCP Offer dropped', 'العميل ما خدش IP', 'منفذ السيرفر الشرعي لسه untrusted', 'show ip dhcp snooping + show ip dhcp snooping statistics', 'ضيف ip dhcp snooping trust على منفذ السيرفر الشرعي فقط', 'الـ DORA يكمل والعميل يخد IP'],
  ['Snooping enabled globally only', 'مفيش bindings رغم نجاح DHCP', 'VLAN 10 مش داخل نطاق Snooping', 'show ip dhcp snooping', 'أضف ip dhcp snooping vlan 10', 'bindings جديدة تظهر بعد DORA'],
  ['Trusted / untrusted wrong', 'سيرفر مزيف شغال أو سيرفرشرعي متوقف', 'تصنيف المنافذ معكوس أو شامل زيادة', 'show ip dhcp snooping + show ip arp inspection interfaces', 'راجع الطوبولوجيا وصحّح المنفذ المخالف فقط', 'الرسائل Correct source تمر والباقي يتدّى'],
  ['Binding database empty or incomplete', 'DAI بيرفض ARP شرعي', 'مفيش DORA ناجح أو VLAN غلط', 'show ip dhcp snooping binding', 'صلح نطاق VLAN والـ trust، وخلّي العميل يجدد DHCP', 'Binding يظهر وDAI يبدأ يتحقق'],
  ['DAI drops legitimate ARP', 'العميل ما يقدرش يوصل رغم IP صح', 'IP/MAC لا يطابق الـ binding', 'show ip dhcp snooping binding + show ip arp inspection statistics', 'راجع عنوان العميل والمنفذ؛ صحّح الإعداد أو أضف استثناء مدروس', 'ARP الشرعي يعدي'],
  ['Static IP device fails DAI', 'الجهاز الثابت معزول', 'مفيش DHCP binding له', 'show ip dhcp snooping binding + show ip arp inspection statistics', 'استخدم ARP ACL أو خطة DAI مناسبة حسب التصميم', 'الجهاز الثابت يعمل بعد استثناء موثّق'],
  ['DAI enabled for wrong VLAN', 'ARP بيفضي من غير فحص', 'ip arp inspection vlan 20 والعميل على VLAN 10', 'show ip arp inspection', 'فعّل DAI على VLAN 10', 'ARP على VLAN 10 يخضع للفحص'],
  ['Port Security maximum too low', 'جهاز ثاني على نفس المنفذ بيعمل violation', 'maximum = 1 والسياسة محتاجة 2', 'show port-security interface Gi0/1', 'عدّل الـ maximum بعد مراجعة عدد الأجهزة المسموحة', 'الجهازان الشرعيان يعملوا بلا violation'],
  ['Wrong assumption about uplinks', 'سيرفر مزيف وراء uplink نجح في DHCP', 'كل uplinks اعتُبروا trusted من غير تحليل', 'show ip dhcp snooping + topology check', 'راجع مسار DHCP الحقيقي وطبّق الثقة على المنفذ الصحيح فقط', 'الـ Offer المزيف يتدّى حتى لو جاي من uplink'],
]

/* ---------- Step 8: quiz ---------- */

/* ---------- Step 9: summary tables ---------- */
const summaryFeatureRows: string[][] = [
  ['Main job', 'تقييد الـ MAC addresses على access port', 'منع rogue DHCP وبناء binding database', 'التحقق من ARP مقابل bindings'],
  ['Protocol / frame', 'Ethernet frames — source MAC', 'DHCP messages — DORA', 'ARP packets'],
  ['Trust concept', 'مفيش trust؛ فيه سياسة maximum وsecure MACs', 'trusted يسمح بـ Offer/ACK؛ untrusted يرفضها', 'trusted often bypasses inspection؛ untrusted is validated'],
  ['Key config', 'switchport port-security + maximum + sticky', 'ip dhcp snooping + vlan + trust', 'ip arp inspection vlan + trust'],
  ['Dependency', 'مستقل عن DHCP', 'بيبني البيانات اللي DAI يستخدمها', 'بيعتمد على Snooping bindings للأجهزة DHCP'],
  ['Static IP devices', 'مفيش علاقة مباشرة', 'مفيش binding لجهاز ثابت', 'محتاج ARP ACL أو استثناء مدروس'],
]

const summaryMacRows: string[][] = [
  ['Learned how', 'يدوي', 'من الإطارات', 'من الإطارات'],
  ['Running config', 'سطر صريح', 'مش سطر ثابت', 'سطر شبيه بالـ static'],
  ['Survives reload', 'نعم لو الـ config محفوظة', 'لا', 'نعم بس بعد حفظ الـ config'],
  ['Best for', 'جهاز ثابت معروف', 'حالة مؤقتة', 'أجهزة مستخدمين مع حفظ config'],
]

const summaryModeRows: string[][] = [
  ['Violating frame', 'dropped', 'dropped', 'لا يوصل لأن المنفذ err-disabled'],
  ['Port state', 'up', 'up', 'err-disabled'],
  ['Counter', 'محدود الوضوح', 'يزداد', 'يزداد + تغيير حالة'],
  ['Notification', 'أقل', 'ممكن', 'ممكن + حدث المنفذ'],
  ['Impact', 'منع هادئ', 'منع مع تشخيص', 'إيقاف كامل لحد المراجعة'],
]

const summaryDhcpTrustRows: string[][] = [
  ['Typical device', 'DHCP server شرعي / بنية موثوقة', 'عملاء وصول نهائي'],
  ['Default', 'يُضبط صراحةً غالباً', 'الافتراضي غالباً'],
  ['Offer / ACK', 'مسموح', 'مرفوض'],
  ['Discover / Request', 'مش متوقع هنا', 'مسموح'],
  ['If wrong', 'rogue DHCP يوزّع إعدادات غلط', 'السيرفر الشرعي يترفض'],
]

const summaryDaiRows: string[][] = [
  ['Layer / protocol', 'DHCP DORA — يبني bindings', 'ARP — يفحص كل packet'],
  ['Decision basis', 'Port trust + نوع الرسالة', 'IP/MAC/port مقابل binding'],
  ['Needs the other?', 'لا، لكنه بيجهّز البيانات لـ DAI', 'نعم للعملاء DHCP؛ الأجهزة الثابتة محتاجة ARP ACL'],
  ['Main verification', 'show ip dhcp snooping binding', 'show ip arp inspection + statistics'],
]

export const topic57Lesson: Lesson = {
  topicId: '5.7',
  title: 'Configure and verify Layer 2 security features (DHCP snooping, dynamic ARP inspection, and port security)',
  description:
    'Topic 5.7 يشرح أمان الطبقة 2: Port Security والـ sticky MAC وقواعد الـ violation وDHCP Snooping والمنافذ trusted وuntrusted وبناء الـ binding database وDynamic ARP Inspection. الشرح بالعربية المصرية البسيطة والمصطلحات التقنية بالإنجليزي. كل الأمثلة والطوبولوجيات تعليمية وهمية، وما اتعملش أي تنفيذ على أجهزة Cisco حقيقية.',
  estimatedTime: '~180 دقيقة',
  steps: [
    {
      id: 'what',
      title: 'Layer 2 Security Fundamentals',
      short: 'ليه أمان الطبقة 2 مهم؟',
      blocks: [
        { type: 'paragraph', text: '**Layer 2 security** معناة حماية الـ switch والشبكة المحلية من هجمات بتحصل جوه الـ LAN نفسه. السويتش بيتعلّم عناوين **source MAC** من الإطارات، وبيمرّر الرسائل زي DHCP وARP بين الأجهزة. أي جهاز يتوصّل بـ **access port** يقدر يبعت إطارات ورسائل، فالخطر هنا مش من الإنترنت بس، لكن من جوه الشبكة كمان.' },
        { type: 'diagram', id: 'l2-overview', caption: 'شغّل الخطوات وشوف إزاي الـ switch والـ access port والـ Layer 2 controls بيربطوا ببعض.' },
        { type: 'paragraph', text: 'الفرق الأساسي بين Layer 2 وLayer 3 security: الـ Layer 2 بيشوف الإطار وعنوان MAC وحالة المنفذ ورسائل DHCP وARP. الـ Layer 3 بيشوف حزمة الـ IP والمصدر والوجهة والبروتوكول والمنفذ. عشان كده الـ ACL على الراوتر غالباً ما يوقفش سيرفر DHCP مزيف أو ARP مزيف داخل نفس الـ VLAN.' },
        { type: 'table', headers: ['Aspect', 'Layer 2 security', 'Layer 3 security'], rows: l2VsL3Rows },
        { type: 'diagram', id: 'l2-threat-map', caption: 'اختار تهديد وشوف إيه اللي بيحصل وإيه أداة الـ mitigation المناسبة.' },
        { type: 'paragraph', text: 'التهديدات الأساسية اللي لازم تعرفها: **MAC Address Flooding**، **DHCP Starvation**، **Rogue DHCP Server**، **ARP Spoofing**، **ARP Poisoning**، ووصول جهاز غير مصرّح به. كل تهديد له أداة مناسبة، ومفيش أداة واحدة بتحل كل حاجة.' },
        { type: 'table', headers: ['Threat', 'What happens', 'Main mitigation'], rows: threatMitigationRows },
        { type: 'diagram', id: 'l2-mac-flood', caption: 'تدفق هجوم الـ MAC flooding من إطار واصل لحد فيضان الإطارات.' },
        { type: 'callout', tone: 'warning', title: 'Defense in depth', text: 'الـ Port Security وDHCP Snooping وDAI أدوات **defense in depth**. كل واحدة بتحل جزء مختلف، ومفيش واحدة منهم حماية كاملة ضد كل هجوم. كمان لازم توافق التهيئة مع الطوبولوجيا الحقيقية.' },
      ],
    },
    {
      id: 'how',
      title: 'Port Security Fundamentals',
      short: 'إيه الـ Port Security؟',
      blocks: [
        { type: 'paragraph', text: '**Port Security** ميزة على الـ switch بتقيّد عناوين **MAC** المسموحة على **access port**. الفكرة بسيطة: المنفذ ده مخصص لجهاز أو عدد محدد من الأجهزة، فأي source MAC خارج السياسة يتعامل معاه حسب الـ **violation mode**.' },
        { type: 'diagram', id: 'l2-portsec-flow', caption: 'من وصول إطار لفحص سياسة المنفذ لقرار forward أو violation.' },
        { type: 'table', headers: ['Term', 'Meaning', 'Example'], rows: portSecTermRows },
        { type: 'paragraph', text: 'السويتش بيتعلم الـ source MAC من الإطار. مع Port Security، التعليم بيخضع لسياسة المنفذ: هل العنوان مقبول؟ وهل عدد الـ secure MACs لسه أقل من الـ **maximum**؟ لو لا، الـ violation mode بيقرر الإجراء.' },
        { type: 'list', ordered: true, items: [
          'endpoint بيبعت إطار عبر access port.',
          'السويتش بيقرأ الـ **source MAC** من الإطار.',
          'بيراجع سياسة Port Security على المنفذ: secure MACs وmaximum.',
          'لو العنوان مسموح وعدد الـ secure MAC أقل من الـ maximum، الإطار يتعالج عادي.',
          'لو زاد العدد أو العنوان مش مسموح، الـ violation mode المهيأ بيتطبّق.',
        ]},
        { type: 'diagram', id: 'l2-learning-compare', caption: 'قارن الـ normal MAC learning بالـ secure MAC learning واختار كل حالة.' },
        { type: 'table', headers: ['Aspect', 'Normal MAC learning', 'Secure MAC learning'], rows: learningRows },
        { type: 'paragraph', text: 'Port Security بيساعد في تقليل وصول الأجهزة غير المصرّح بها وببعض سيناريوهات **MAC flooding** على منفذ معين. بس هو **مش دفاع كامل**: ما بيمنعش rogue DHCP، ولا ARP spoofing، ولا كل أنواع الهجوم. عشان كده بنكمّله بـ DHCP Snooping وDAI.' },
        { type: 'callout', tone: 'tip', title: 'مكان التفعيل', text: 'الـ Port Security بيُفعّل غالباً على **access ports**، مش على trunks. ابدأ دايماً بـ `switchport mode access` عشان توضّح دور المنفذ قبل ما تفعّل الميزة.' },
      ],
    },
    {
      id: 'packet',
      title: 'Sticky MAC Addresses',
      short: 'الـ sticky MAC وحفظ الـ config',
      blocks: [
        { type: 'paragraph', text: 'الـ **Sticky MAC** بيحل مشكلة عملية: إزاي نخلي السويتش يتعلّم عناوين الأجهزة تلقائياً، وفي نفس الوقت نكتبها في الـ **running configuration** عشان نراجعها ونثبّتها. بيُفعّل على access port بعد تفعيل Port Security.' },
        { type: 'diagram', id: 'l2-mac-types', caption: 'اختار static أو dynamic أو sticky وشوف الفرق في التعليم والحفظ.' },
        { type: 'table', headers: ['Aspect', 'Static secure MAC', 'Dynamic secure MAC', 'Sticky secure MAC'], rows: macTypeRows },
        { type: 'code', label: 'Sticky MAC configuration example', language: 'cisco', code: 'interface GigabitEthernet0/1\n switchport mode access\n switchport port-security\n switchport port-security maximum 2\n switchport port-security mac-address sticky' },
        { type: 'table', headers: ['Command', 'Meaning'], rows: stickyConfigLines },
        { type: 'paragraph', text: 'بعد ما PC1 وPC2 يبعتوا إطارات، الـ running configuration هيبقى فيها سطور شبيهة بالـ static (عناوين توضيحية وهمية):' },
        { type: 'code', label: 'Conceptual running-config result (fictional MACs)', language: 'cisco', code: 'interface GigabitEthernet0/1\n switchport mode access\n switchport port-security\n switchport port-security maximum 2\n switchport port-security mac-address sticky\n switchport port-security mac-address sticky 00aa.bbcc.dd11\n switchport port-security mac-address sticky 00aa.bbcc.dd22' },
        { type: 'diagram', id: 'l2-sticky-persistence', caption: 'شغّل الخطوات: تعليم → running config → خطر الـ reload → حفظ الـ config.' },
        { type: 'callout', tone: 'danger', title: 'القاعدة الذهبية للـ sticky', text: 'الـ sticky MAC **مش تلقائياً دائم**. بيتكتب في الـ running config، فلو ما عملتش `copy running-config startup-config` قبل الـ reload، الـ learned sticky MACs بتضيع. احفظ الـ config وبعدين راجع `show running-config` و`show port-security address`.' },
        { type: 'paragraph', text: 'الفرق عن **Static secure MAC**: الـ static بيكتبه المسؤول يدوياً من الأول. الـ sticky بيبدأ ديناميكي ويتحوّل لسطر في الـ config. الاتنين بيظهروا في running config، بس طريقة وصولهم مختلفة.' },
      ],
    },
    {
      id: 'config',
      title: 'Port Security Violation Modes',
      short: 'Protect ولا Restrict ولا Shutdown؟',
      blocks: [
        { type: 'paragraph', text: 'الـ **violation mode** بيحدد إيه اللي يحصل لما يظهر source MAC خارج السياسة أو عدد الـ secure MACs يتجاوز الـ **maximum**. زيادة الـ maximum عن عدد الأجهزة الشرعية غالباً سبب مباشر للـ violation.' },
        { type: 'diagram', id: 'l2-maximum', caption: 'اختار حالة: جهاز أول، جهاز تاني، أو جهاز تالت مع maximum 2.' },
        { type: 'diagram', id: 'l2-violation-flow', caption: 'تدفق القرار من اكتشاف violation لاختيار الإجراء.' },
        { type: 'table', headers: ['Aspect', 'Protect', 'Restrict', 'Shutdown'], rows: violationRows },
        { type: 'diagram', id: 'l2-protect-mode', caption: 'جرّب عنوان مسموح وآخر مخالف في Protect.' },
        { type: 'code', label: 'Protect mode', language: 'cisco', code: 'interface GigabitEthernet0/1\n switchport port-security violation protect' },
        { type: 'paragraph', text: '**Protect**: إطار المخالف يتدّى والمنفذ يفضل شغال. في كتير من التطبيقات الـ notification والعدّاد مش بنفس وضوح Restrict، فالرؤية التشغيلية أضعف.' },
        { type: 'diagram', id: 'l2-restrict-mode', caption: 'Restrict: إطار مخالف، عدّاد، وتنبيه محتمل.' },
        { type: 'code', label: 'Restrict mode', language: 'cisco', code: 'interface GigabitEthernet0/1\n switchport port-security violation restrict' },
        { type: 'paragraph', text: '**Restrict**: إطار المخالف يتدّى، الـ violation counter بيزيد، وبيقدر يبعت **syslog** أو **SNMP trap** حسب الإعداد والمنصة. غالباً توازن عملي بين المنع والتشخيص.' },
        { type: 'diagram', id: 'l2-shutdown-mode', caption: 'Shutdown: violation يحوّل المنفذ لـ error-disabled.' },
        { type: 'code', label: 'Shutdown mode', language: 'cisco', code: 'interface GigabitEthernet0/1\n switchport port-security violation shutdown' },
        { type: 'paragraph', text: '**Shutdown**: أول violation بيحط المنفذ في **error-disabled**، فيتوقف كل الترافيك على المنفذ، مش إطار المخالف بس. ده الافتراضي في كتير من تطبيقات **Catalyst** لأنه بيفضّل إيقاف المنفذ على السماح بأي اتصال غير موثوق. الأثر أقوى ولازم فيه تدخل.' },
        { type: 'diagram', id: 'l2-mode-compare', caption: 'قارن الثلاثة من ناحية الترافيك وحالة المنفذ والعداد والتنبيه.' },
        { type: 'table', headers: ['Mode', 'Before recovery', 'Important consideration'], rows: recoveryRows },
        { type: 'callout', tone: 'warning', title: 'استعادة آمنة', text: 'ما تفعّلش **auto-recovery** من غير ما تفهم المخاطر. لو أعدت المنفذ تلقائياً من غير ما تعرف مين المخالف، ممكن ترجّع نفس المشكلة وتفتح الباب لجهاز مش مسموح. راجع السبب، صحّح السياسة، وبعدين قرر `shutdown` / `no shutdown` أو آلية استعادة مدروسة. التفاصيل بتختلف حسب المنصة والإصدار.' },
        { type: 'code', label: 'Verification commands for Port Security', language: 'cisco', code: 'show port-security\nshow port-security interface GigabitEthernet0/1\nshow port-security address\nshow interfaces status' },
      ],
    },
    {
      id: 'verify',
      title: 'DHCP Snooping',
      short: 'منع rogue DHCP وبناء bindings',
      blocks: [
        { type: 'paragraph', text: 'قبل DHCP Snooping، لازم تعرف الـ **DORA**: **Discover** من العميل، **Offer** من السيرفر، **Request** من العميل، و**ACK** من السيرفر. العميل بياخد IP وgateway وDNS من الـ Offer/ACK، فلو جاي من سيرفر مزيف، إعدادات الشبكة كلها تتبوظ.' },
        { type: 'diagram', id: 'l2-dhcp-dora', caption: 'شغّل DORA خطوة بخطوة وشوف مكان الـ Discover والـ Offer والـ Request والـ ACK.' },
        { type: 'paragraph', text: '**DHCP Snooping** ميزة على الـ switch بتميّز بين المنافذ الـ **trusted** والـ **untrusted**. الرسائل اللي بتيجي من السيرفر زي **Offer** و**ACK** مسموحة بس من المنفذ trusted. أي Offer من منفذ untrusted يتدّى، فسيرفر DHCP مزيف على access port ما يقدرش يوزّع إعدادات غلط.' },
        { type: 'diagram', id: 'l2-rogue-dhcp', caption: 'قارن Offer من سيرفر شرعي وOffer من مهاجم على منفذ untrusted.' },
        { type: 'table', headers: ['Aspect', 'Trusted port', 'Untrusted port'], rows: dhcpTrustRows },
        { type: 'diagram', id: 'l2-dhcp-trust', caption: 'اختار منفذ عميل أو سيرفر أو uplink وشوف قرار الـ trust.' },
        { type: 'paragraph', text: 'الـ **untrusted** هو الافتراضي في كتير من Cisco implementations، فمنافذ العملاء غالباً ما محتاجة أي أمر. الـ **trusted** لازم يتعرّف صراحةً على المنفذ المتصل بالسيرفر الشرعي أو بالبنية الموثوقة. **ما تعلّمش كل الـ uplinks trusted تلقائياً**؛ لو uplink بيوصل في النهاية لسيرفر مزيف، الثقة الغلط هتفتح الثغرة.' },
        { type: 'code', label: 'Enable DHCP Snooping and trust the authorized server port', language: 'cisco', code: 'ip dhcp snooping\nip dhcp snooping vlan 10\n!\ninterface GigabitEthernet0/24\n ip dhcp snooping trust' },
        { type: 'list', items: [
          '`ip dhcp snooping`: تفعيل الميزة globalاً على السويتش.',
          '`ip dhcp snooping vlan 10`: تفعيل الفحص على VLAN 10 فقط؛ من غير ده مفيش bindings.',
          '`interface GigabitEthernet0/24` + `ip dhcp snooping trust`: تعريف منفذ السيرفر الشرعي كـ trusted.',
          'منفذ العميل يفضل untrusted بالافتراضي؛ ده المطلوب في التصميم المعتاد.',
        ]},
        { type: 'code', label: 'Client-facing port stays untrusted (default example)', language: 'cisco', code: 'interface GigabitEthernet0/1\n switchport mode access\n switchport access vlan 10\n no ip dhcp snooping trust' },
        { type: 'diagram', id: 'l2-dhcp-filter', caption: 'اختار نوع الرسالة والمنفذ وشوف هل DHCP Snooping هيسمح بيها ولا لا.' },
        { type: 'paragraph', text: 'بعد **ACK** ناجح على منفذ untrusted، السويتش بيسجّل **binding** في الـ **DHCP Snooping binding database**. الـ binding بيحتوي IP والمـ MAC والـ VLAN والمنفذ ومدة الـ lease. دي بالظبط البيانات اللي **DAI** بيستخدمها بعد كده.' },
        { type: 'diagram', id: 'l2-binding-db', caption: 'افحص الـ binding entries وشوف إزاي الـ IP والمـ MAC والمنفذ مرتبطين ببعض.' },
        { type: 'table', headers: ['Field', 'Example', 'Why it matters'], rows: bindingRows },
        { type: 'table', headers: ['Command', 'What it shows', 'Troubleshooting use'], rows: snoopVerifyRows },
        { type: 'callout', tone: 'info', title: 'اختلاف المنصات', text: 'توفر الأوامر وشكل الإخراج بيختلفوا حسب موديل **Catalyst** وإصدار **IOS**. لو أمر مش متاح على جهازك، راجع توثيق المنصة، وما تفترضش إن كل الإصدارات بتطلع نفس النص.' },
      ],
    },
    {
      id: 'mistakes',
      title: 'Dynamic ARP Inspection (DAI)',
      short: 'DAI والـ ARP bindings',
      blocks: [
        { type: 'paragraph', text: '**ARP** وظيفته إن جهاز على IPv4 subnet يعرف الـ **MAC address** لجهاز تاني عشان يسلّم الإطار محلياً. بيبعت **ARP Request** وصاحب العنوان يرد بـ **ARP Reply**، فبيتحفظ الـ result في الـ ARP cache. المشكلة إن الـ ARP مصمم للعمل أصلاً، ومفيش عليه توقيع قوي يمنع التزيف.' },
        { type: 'diagram', id: 'l2-arp-flow', caption: 'شغّل ARP Request وReply من الجهاز اللي محتاج MAC لحد حفظ الـ cache.' },
        { type: 'table', headers: ['Concept', 'Meaning', 'Result'], rows: daiConceptRows },
        { type: 'diagram', id: 'l2-arp-spoof', caption: 'تدفق ARP spoofing: reply مزيف → cache مسمّم → تحويل الترافيك.' },
        { type: 'paragraph', text: '**DAI** يفحص كل **ARP packet** على منفذ **untrusted**: بيقرأ **sender IP** و**sender MAC**، وبيراجع الـ **DHCP Snooping binding database**. لو الـ IP والمـ MAC والمنفذ متطابقين مع binding، الـ ARP يعدي. لو مفيش تطابق، الـ ARP يتدّى. المنافذ الـ **trusted** غالباً ما تتعرضش لنفس الفحص حسب التصميم.' },
        { type: 'diagram', id: 'l2-dai-operation', caption: 'شغّل خطوات DAI: ARP واصل → قراءة المرسل → مراجعة bindings → قرار.' },
        { type: 'diagram', id: 'l2-dai-validation', caption: 'اختار ARP شرعي أو مزيف أو جهاز ثابت أو VLAN غلط وشوف قرار DAI.' },
        { type: 'paragraph', text: 'القاعدة اللي لازم تحفظها: **DHCP Snooping بيبني IP-to-MAC-to-port bindings موثوقة، وDAI بيستخدمها يتحقق من ARP.** من غير Snooping على الـ VLAN المطلوبة، DAI مش هيلاقي بيانات يفحص بيها.' },
        { type: 'diagram', id: 'l2-dai-trust', caption: 'اختار عميل أو uplink أو جهاز ثابت وشوف تصنيف الـ DAI trust.' },
        { type: 'code', label: 'Enable DAI and trust the infrastructure port', language: 'cisco', code: 'ip dhcp snooping\nip dhcp snooping vlan 10\nip arp inspection vlan 10\n!\ninterface GigabitEthernet0/24\n ip dhcp snooping trust\n ip arp inspection trust' },
        { type: 'list', items: [
          '`ip arp inspection vlan 10`: تفعيل DAI على VLAN 10 — لازم تكون هي نفس VLAN بتاعة DHCP Snooping.',
          '`ip arp inspection trust` على Gi0/24: المنفذ المتصل بالبنية الموثوقة، حيث يناسب التصميم.',
          'منافذ العملاء تفضل **untrusted** عشان DAI يفحص ARP القادم منها.',
          'جهاز بـ **static IP** ما بيعملش DORA، فمفيش binding؛ غالباً محتاج **ARP ACL** أو استثناء مدروس حسب التصميم.',
        ]},
        { type: 'table', headers: ['Command', 'What it shows', 'Troubleshooting use'], rows: daiVerifyRows },
        { type: 'callout', tone: 'danger', title: 'فخ الامتحان', text: 'DHCP Snooping مش DAI. Snooping بيوقف **DHCP Offer** مزيف؛ DAI بيوقف **ARP** مزيف. Snooping هو اللي بيبني الـ bindings، وDAI هو اللي بيستخدمهم. وتذكّر: trusted مش معناة «كل المنافذ»، ومفيش استثناء تلقائي للأجهزة الثابتة.' },
        { type: 'callout', tone: 'info', title: 'دعم المنصة', text: 'بعض أوامر الدعم والإحصائيات بتختلف بين موديلات **Catalyst** وإصدارات **IOS**. المفاهيم ثابتة، بس شكل الإخراج وتوفر `statistics` أو ARP ACLs ممكن يختلف.' },
      ],
    },
    {
      id: 'lab',
      title: 'Complete Configuration, Troubleshooting, and Three Labs',
      short: 'تهيئة كاملة + 3 لابرات',
      blocks: [
        { type: 'paragraph', text: '**الطوبولوجيا الموحّدة للأمثلة:** سويتش access واحد S1، عميلان شرعيان، جهاز مهاجم واحد، وسيرفر DHCP شرعي أو uplink موثوق على Gi0/24. كل العناوين والمـ MACs هنا **وهمية تعليمية**.' },
        { type: 'table', headers: ['Port / device', 'Addressing', 'Role'], rows: topologyRows },
        { type: 'diagram', id: 'l2-architecture', caption: 'شغّل الخطوات وشوف Port Security ثم DHCP Snooping ثم DAI في تصميم واحد.' },
        { type: 'paragraph', text: '**Workflow التهيئة الآمنة:** ابدأ بتصنيف المنافذ، وبعدين طبّق الميزات بالترتيب اللي بيسمح لـ DAI إنه يلاقي بياناته.' },
        { type: 'table', headers: ['Step', 'Action', 'Practical note'], rows: workflowRows },
        { type: 'code', label: 'Complete coherent configuration example', language: 'cisco', code: 'ip dhcp snooping\nip dhcp snooping vlan 10\nip arp inspection vlan 10\n!\ninterface GigabitEthernet0/1\n switchport mode access\n switchport access vlan 10\n switchport port-security\n switchport port-security maximum 2\n switchport port-security mac-address sticky\n switchport port-security violation restrict\n!\ninterface GigabitEthernet0/2\n switchport mode access\n switchport access vlan 10\n switchport port-security\n switchport port-security maximum 2\n switchport port-security mac-address sticky\n switchport port-security violation restrict\n!\ninterface GigabitEthernet0/24\n ip dhcp snooping trust\n ip arp inspection trust' },
        { type: 'list', items: [
          'Gi0/1 وGi0/2 منافذ عملاء: Port Security مع maximum 2 وsticky وrestrict، والـ DHCP Snooping وDAI عليهما untrusted بالافتراضي.',
          'Gi0/24 منفذ السيرفر الشرعي: trusted لـ DHCP Snooping ولـ DAI بعد التأكد من الطوبولوجيا.',
          'الجهاز على Gi0/3 لسه untrusted، فـ DHCP Offer المزيف منه يتدّى وARP المزيف منه يتفحص.',
          'احفظ الـ config بعد ما الـ sticky MACs تتعلم، وإلا هتضيع بعد reload.',
        ]},
        { type: 'diagram', id: 'l2-troubleshooting', caption: 'اختار عرض من أعراض المشكلة وشوف السبب المحتمل والتحقق.' },
        { type: 'table', headers: ['Problem', 'Symptoms', 'Likely cause', 'Verification', 'Safe correction', 'Expected outcome'], rows: troubleRows },
        { type: 'diagram', id: 'l2-verify-commands', caption: 'اختار أمر تحقق وشوف إيه اللي بيؤكده بالظبط.' },
        { type: 'callout', tone: 'warning', title: 'ما تعمّموش الثقة', text: 'الاعتماد على «كل uplinks trusted» غلط. الثقة لـ DHCP Snooping ولـ DAI بيتبعوا مسار السيرفر الشرعي والبنية الموثوقة. راجع الطوبولوجيا أولاً، وبعدين طبّق trust على المنفذ المطلوب فقط.' },

        { type: 'paragraph', text: '## Lab 1 — Configure Port Security' },
        { type: 'paragraph', text: '**Objectives:** تفعيل Port Security على access port، تحديد maximum، تفعيل sticky learning، اختيار violation mode، ومحاكاة جهاز غير مصرّح به.' },
        { type: 'paragraph', text: '**Starting topology:** S1 مع PC1 على Gi0/1، PC2 على Gi0/2، وUnauthorized PC على Gi0/3. كلهم VLAN 10.' },
        { type: 'table', headers: ['Device / port', 'Addressing', 'Note'], rows: [
          ['PC1 — Gi0/1', '192.168.10.11 / MAC 00aa.bbcc.dd11', 'authorized'],
          ['PC2 — Gi0/2', '192.168.10.12 / MAC 00aa.bbcc.dd22', 'authorized'],
          ['Attacker — Gi0/3', '192.168.10.66 / MAC 00aa.bbcc.dd66', 'unauthorized'],
        ]},
        { type: 'steps', items: [
          { title: 'Task 1 — access port', text: 'ادخل على Gi0/1 واكتب `switchport mode access`.' },
          { title: 'Task 2 — enable and limit', text: 'اكتب `switchport port-security` و`switchport port-security maximum 2`.' },
          { title: 'Task 3 — sticky', text: 'اكتب `switchport port-security mac-address sticky`، وبعدين خلّي PC1 وPC2 يبعتوا إطارات.' },
          { title: 'Task 4 — pick a mode', text: 'جرّب `violation protect` ثم `restrict` ثم `shutdown` من أدوات اللاب، وقارن النتيجة.' },
          { title: 'Task 5 — simulate', text: 'وصّل الجهاز غير المصرّح به وشوف إيه اللي هيحصل لكل mode.' },
          { title: 'Hint', text: 'الـ maximum 2 يعني إن أول جهازين يتعلموا، والتالت هو اللي بيعمل violation.' },
          { title: 'Solution (educational)', text: 'في Restrict: الإطار يتدّى والعدّاد بيزيد والمنفذ يفضل up. في Shutdown: المنفذ بيدخل error-disabled.' },
          { title: 'Completion criteria', text: 'تقدر تشرح الفرق بينProtect وRestrict وShutdown، وتقول إيه اللي هيحصل للجهاز التالت.' },
        ]},
        { type: 'code', label: 'Lab 1 solution commands', language: 'cisco', code: 'interface GigabitEthernet0/1\n switchport mode access\n switchport port-security\n switchport port-security maximum 2\n switchport port-security mac-address sticky\n switchport port-security violation restrict' },
        { type: 'diagram', id: 'l2-lab-port-security', caption: 'Lab 1 — بدّل الـ violation mode وتنقّل بين الخطوات الخمس وشوف التغذية الراجعة.' },

        { type: 'paragraph', text: '## Lab 2 — Prevent Rogue DHCP Servers' },
        { type: 'paragraph', text: '**Objectives:** تفعيل DHCP Snooping، اختيار VLAN 10، تعريف منفذ السيرفر الشرعي trusted، إيقاف Offer المزيف، وقراءة الـ binding table.' },
        { type: 'paragraph', text: '**Starting topology:** S1، DHCP server شرعي على Gi0/24 (`192.168.10.5`)، عملاء على Gi0/1 وGi0/2، وRogue DHCP على Gi0/3 بمنفذ untrusted.' },
        { type: 'table', headers: ['Device / port', 'Addressing', 'Trust expectation'], rows: [
          ['DHCP server — Gi0/24', '192.168.10.5', 'trusted'],
          ['PC1 — Gi0/1', '192.168.10.11', 'untrusted'],
          ['PC2 — Gi0/2', '192.168.10.12', 'untrusted'],
          ['Rogue DHCP — Gi0/3', '192.168.10.66', 'untrusted'],
        ]},
        { type: 'steps', items: [
          { title: 'Task 1 — global', text: 'اكتب `ip dhcp snooping` أولاً.' },
          { title: 'Task 2 — VLAN', text: 'اكتب `ip dhcp snooping vlan 10`.' },
          { title: 'Task 3 — trust', text: 'تحت Gi0/24 اكتب `ip dhcp snooping trust` بس للسيرفر الشرعي.' },
          { title: 'Task 4 — simulate legitimate', text: 'اختار Offer من Gi0/24 في اللاب وشوف إنه مسموح.' },
          { title: 'Task 5 — simulate rogue', text: 'اختار Offer من Gi0/3 وشوف إنه اتدّى.' },
          { title: 'Hint', text: 'العميل ما يبعتش Offer؛ الـ Offer والـ ACK بيجوا من السيرفر.' },
          { title: 'Solution (educational)', text: 'Offer من trusted يمرّ، ومن untrusted يتدّى. بعد ACK ناجح يتسجل binding للعميل.' },
          { title: 'Completion criteria', text: 'تقدر تشرح ليه منافذ العملاء تفضل untrusted، وتقول إيه اللي هيحصل لو السيرفر الشرعي اتعلم untrusted بالغلط.' },
        ]},
        { type: 'code', label: 'Lab 2 solution commands', language: 'cisco', code: 'ip dhcp snooping\nip dhcp snooping vlan 10\n!\ninterface GigabitEthernet0/24\n ip dhcp snooping trust' },
        { type: 'diagram', id: 'l2-lab-dhcp', caption: 'Lab 2 — تنقّل بين الخطوات واختار قرار كل Offer.' },

        { type: 'paragraph', text: '## Lab 3 — Detect ARP Spoofing with DAI' },
        { type: 'paragraph', text: '**Objectives:** تفعيل DHCP Snooping أولاً، تفعيل DAI على VLAN 10، فحص ARP شرعي وARP مزيف، وفهم حالة جهاز بـ IP ثابت.' },
        { type: 'paragraph', text: '**Starting topology:** نفس سويتش S1، PC1 (`192.168.10.11 / 00aa.bbcc.dd11`) وPC2 (`192.168.10.12 / 00aa.bbcc.dd22`) عليهما bindings من DHCP، ومهاجم على Gi0/3 يحاول يبعت ARP بادّعاء إنه `192.168.10.1`. فيه كمان جهاز بـ IP ثابت بدون binding.' },
        { type: 'table', headers: ['Device / port', 'Addressing', 'DAI input'], rows: [
          ['PC1 — Gi0/1', '192.168.10.11 / MAC 00aa.bbcc.dd11', 'binding exists'],
          ['PC2 — Gi0/2', '192.168.10.12 / MAC 00aa.bbcc.dd22', 'binding exists'],
          ['Attacker — Gi0/3', 'claims 192.168.10.1 / forged MAC', 'no matching binding'],
          ['Static host — Gi0/4', '192.168.10.50 / MAC 00aa.bbcc.dd44', 'no DHCP binding'],
        ]},
        { type: 'steps', items: [
          { title: 'Task 1 — prerequisite', text: 'فعّل DHCP Snooping على VLAN 10 وتأكد إن `show ip dhcp snooping binding` فيه entries.' },
          { title: 'Task 2 — enable DAI', text: 'اكتب `ip arp inspection vlan 10` — نفس الـ VLAN.' },
          { title: 'Task 3 — trust', text: 'راجع Gi0/24؛ المنفذ الموثوق بس هو اللي ياخد `ip arp inspection trust` حسب التصميم.' },
          { title: 'Task 4 — valid ARP', text: 'اختار ARP من PC1 وشوف إنه مسموح لأن الـ binding مطابق.' },
          { title: 'Task 5 — forged ARP', text: 'اختار ARP المهاجم وشوف إنه اتدّى لعدم وجود binding يطابق.' },
          { title: 'Task 6 — static host', text: 'اختار ARP الجهاز الثابت؛ DAI ما يقدرش يتحقق من غير binding.' },
          { title: 'Hint', text: 'اسأل دايماً: هل فيه binding يطابق sender IP والمـ MAC والمنفذ؟' },
          { title: 'Solution (educational)', text: 'ARP المزيف يتدّى. الجهاز الثابت محتاج ARP ACL أو استثناء مدروس حسب المنصة والتصميم.' },
          { title: 'Completion criteria', text: 'تقدر تشرح علاقة DHCP Snooping بـ DAI، وتقول ليه جهاز IP ثابت بيفشل ordinarily.' },
        ]},
        { type: 'code', label: 'Lab 3 solution commands', language: 'cisco', code: 'ip dhcp snooping\nip dhcp snooping vlan 10\nip arp inspection vlan 10\n!\ninterface GigabitEthernet0/24\n ip dhcp snooping trust\n ip arp inspection trust' },
        { type: 'diagram', id: 'l2-lab-dai', caption: 'Lab 3 — اختبر خمس خطوات: Snooping، DAI، ARP شرعي، ARP مزيف، وجهاز ثابت.' },
        { type: 'callout', tone: 'info', title: 'حدود المحاكاة', text: 'اللابرات دي **محاكاة تعليمية جوه الصفحة**. ما اتعملش أي تنفيذ على أجهزة Cisco حقيقية أو Packet Tracer، وكل العناوين والأحداث وهمية.' },
      ],
    },
    {
      id: 'exam',
      title: 'CCNA Exam Quiz',
      short: 'اختبار CCNA',
      blocks: [
        { type: 'paragraph', text: '**اختبار CCNA:** 5 أسئلة، 4 خيارات لكل سؤال، مزيج من single وmultiple. مفيش feedback قبل الضغط على Submit، والإجابات بتتقفل بعد الإرسال.' },
        { type: 'quiz', questions: [
          {
            id: 'q1',
            prompt: 'An access port has port-security maximum 2, sticky learning, and three different devices connect over time. Which statement is true?',
            options: [
              'The first two secure MACs can be learned as sticky entries; the third triggers the configured violation mode.',
              'All three MACs become sticky automatically because sticky learning has no limit.',
              'Sticky MACs are always permanent even if the running configuration is not saved.',
              'The switch floods frames for the third device instead of applying a violation mode.',
            ],
            correctIndex: 0,
            requireSubmit: true,
            explanation: 'الصح هو **(A)**: الـ maximum بيسمح بـ secure MACs اتنين بس، والالتالت بيعمل violation. (B) غلط لأن الـ maximum قيد حقيقي. (C) غلط لأن الـ sticky لازم يتحفظ في startup config عشان يبقى بعد reload. (D) غلط لأن Port Security بيطبّق violation mode مش مجرد فيضان.',
          },
          {
            id: 'q2',
            kind: 'multiple',
            prompt: 'Which statements about port-security violation modes are correct? (Choose more than one.)',
            options: [
              'Protect drops the violating frame while the port remains up.',
              'Restrict drops the frame, increments a violation counter, and can generate notifications depending on configuration and platform.',
              'Shutdown commonly places the port into an error-disabled state on many Catalyst implementations.',
              'Restrict and shutdown are identical because both immediately disable the port.',
            ],
            correctIndices: [0, 1, 2],
            requireSubmit: true,
            explanation: 'الصح هو **(A) و(B) و(C)**: Protect بيسقط الإطار، Restrict بيزود العدّاد وينبه حسب الإعداد، وShutdown بيحط المنفذ في error-disabled. (D) غلط لأن Restrict يفضل المنفذ up.',
          },
          {
            id: 'q3',
            kind: 'multiple',
            prompt: 'Which statements about DHCP Snooping trust and its binding database are correct? (Choose more than one.)',
            options: [
              'Client-facing access ports are normally left untrusted, which is the default in many implementations.',
              'DHCP Offer and ACK frames from an untrusted port are dropped.',
              'A binding records IP address, MAC address, VLAN, port, and lease information after a successful DHCP exchange.',
              'Every uplink should be configured as trusted so that DHCP never fails.',
            ],
            correctIndices: [0, 1, 2],
            requireSubmit: true,
            explanation: 'الصح هو **(A) و(B) و(C)**: منافذ العملاء غالباً untrusted، والـ Offer/ACK من untrusted يتدّى، والـ binding بيحتوي IP وMAC وVLAN ومنفذ وليز. (D) غلط لأن الثقة لازم تتبع الطوبولوجيا، وتعميمها على كل uplinks يفتح ثغرة.',
          },
          {
            id: 'q4',
            prompt: 'DHCP Snooping is enabled globally on S1, but clients in VLAN 10 still have no bindings and DAI drops their legitimate ARP traffic. What is the most likely cause?',
            options: [
              'DAI must be enabled before DHCP Snooping can create any binding.',
              'DHCP Snooping was not enabled for VLAN 10, so no bindings were built there.',
              'Port Security must be disabled on all client ports before DAI can work.',
              'All client ports should be marked trusted so that DAI stops inspecting them.',
            ],
            correctIndex: 1,
            requireSubmit: true,
            explanation: 'الصح هو **(B)**: التفعيل global لوحده مش كفاية؛ لازم `ip dhcp snooping vlan 10` عشان تتكون bindings. (A) غلط لأن Snooping بيسبق DAI. (C) غلط لأن Port Security وDAI مش متعارضين. (D) غلط لأن تعليم كل المنافذ trusted بيوقّف الحماية على العملاء.',
          },
          {
            id: 'q5',
            prompt: 'An attacker on Gi0/3 sends an ARP reply claiming that 192.168.10.1 maps to the attacker MAC. DHCP Snooping bindings exist for legitimate clients, and Gi0/3 is untrusted for DAI. What happens?',
            options: [
              'DAI compares the sender IP and MAC with the binding database and drops the ARP because no valid binding matches.',
              'DAI forwards the ARP because DHCP Snooping already validated the IP address.',
              'Port Security shutdown mode blocks the ARP by limiting the number of ARP packets.',
              'The switch creates a new binding automatically for the claimed gateway address.',
            ],
            correctIndex: 0,
            requireSubmit: true,
            explanation: 'الصح هو **(A)**: DAI بيقارن sender IP/MAC والمنفذ بالـ bindings، والادّعاء المزيف مفيش binding يطابقه فيتدّى. (B) غلط لأن Snooping ما بيتحققش من ARP. (C) غلط لأن Port Security بيقيد MAC على المنفذ مش ARP. (D) غلط لأن الـ bindings بتتكون من DHCP مش من ARP.',
          },
        ]},
      ],
    },
    {
      id: 'summary',
      title: 'Summary and CCNA Revision Checklist',
      short: 'ملخص وقائمة مراجعة',
      blocks: [
        { type: 'paragraph', text: 'أمان الطبقة 2 في CCNA بيقوم على ثلاث أدوات مترابطة: **Port Security** بيقيد الـ MACs على الـ access port، **DHCP Snooping** بيمنع الـ rogue DHCP ويبني binding database، و**DAI** بيستخدم الـ bindings عشان يتحقق من ARP. كلهم defense in depth، مش حل شامل لوحدهم.' },
        { type: 'diagram', id: 'l2-summary', caption: 'خريطة مراجعة سريعة لتهديدات وأدوات حماية الطبقة 2.' },
        { type: 'paragraph', text: '**1. Port Security vs DHCP Snooping vs DAI:**' },
        { type: 'table', headers: ['Aspect', 'Port Security', 'DHCP Snooping', 'DAI'], rows: summaryFeatureRows },
        { type: 'paragraph', text: '**2. Static vs Dynamic vs Sticky Secure MAC:**' },
        { type: 'table', headers: ['Aspect', 'Static', 'Dynamic', 'Sticky'], rows: summaryMacRows },
        { type: 'paragraph', text: '**3. Protect vs Restrict vs Shutdown:**' },
        { type: 'table', headers: ['Aspect', 'Protect', 'Restrict', 'Shutdown'], rows: summaryModeRows },
        { type: 'paragraph', text: '**4. DHCP Snooping trusted vs untrusted ports:**' },
        { type: 'table', headers: ['Aspect', 'Trusted', 'Untrusted'], rows: summaryDhcpTrustRows },
        { type: 'paragraph', text: '**5. DHCP Snooping vs Dynamic ARP Inspection:**' },
        { type: 'table', headers: ['Aspect', 'DHCP Snooping', 'DAI'], rows: summaryDaiRows },
        { type: 'paragraph', text: '**أوامر التحقق الأساسية:** `show port-security`، `show port-security interface GigabitEthernet0/1`، `show port-security address`، `show interfaces status`، `show ip dhcp snooping`، `show ip dhcp snooping binding`، `show ip dhcp snooping statistics`، `show ip arp inspection`، `show ip arp inspection interfaces`، `show ip arp inspection statistics`. توفر الأوامر والإخراج بيختلف حسب المنصة والإصدار.' },
        { type: 'steps', items: [
          { title: 'Threats', text: 'MAC flooding، DHCP starvation، rogue DHCP، ARP spoofing، ARP poisoning، وأجهزة غير مصرّح بها.' },
          { title: 'Port Security', text: 'تقييد secure MACs على access port؛ maximum + violation mode؛ مش دفاع كامل لوحده.' },
          { title: 'Secure MAC types', text: 'static يدوي، dynamic للجلسة، sticky بيتكتب في running config.' },
          { title: 'Sticky persistence', text: 'الـ sticky مش دائم تلقائياً؛ لازم `copy running-config startup-config`.' },
          { title: 'Violation modes', text: 'Protect بيسقط الإطار، Restrict بيسقط + عدّاد + تنبيه محتمل، Shutdown بيحط المنفذ error-disabled.' },
          { title: 'DHCP Snooping', text: 'فعّل globalاً وعلى الـ VLAN؛ Offer وACK مسموحين من trusted بس.' },
          { title: 'Trust', text: 'client ports untrusted غالباً؛ السيرفر الشرعي والبنية الموثوقة بس trusted؛ ما تعمّموش الثقة على كل uplinks.' },
          { title: 'Binding database', text: 'IP + MAC + VLAN + port + lease؛ دي البيانات اللي DAI يستخدمها.' },
          { title: 'DAI', text: 'يفحص sender IP/MAC على منافذ untrusted مقابل bindings； الأجهزة الثابتة محتاجة ARP ACL أو استثناء.' },
          { title: 'Verification', text: 'راجع أوامر port-security وdhcp snooping وarp inspection، واختبر الترافيك قبل وبعد التطبيق.' },
        ]},
        { type: 'callout', tone: 'tip', title: 'فكرة أخيرة قبل الامتحان', text: 'لو جاك سؤال Layer 2 security: اسأل «إيه البروتوكول أو الإطار اللي بنتحكم فيه؟»، «مين trusted ومين untrusted؟»، و«هل فيه binding يطابق؟». الخلط بين DHCP Snooping وDAI هو أكثر غلط شيوعاً.' },
      ],
    },
  ],
}
