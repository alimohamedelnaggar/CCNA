import type { Lesson } from '../types'

const documentRows: string[][] = [
  ['Security Policy', 'High-level statement of intent and direction', 'Management approves; the organization follows'],
  ['Security Procedure', 'Step-by-step actions to carry out a policy', 'Incident reporting steps, access request steps'],
  ['Security Standard', 'Mandatory specific requirement or configuration baseline', 'Minimum password length, approved encryption settings'],
  ['Security Guideline', 'Recommended advice that is not mandatory', 'Suggested naming or handling practice'],
]

const programElementRows: string[][] = [
  ['Security Policies', 'Define expectations and responsibilities'],
  ['Security Awareness', 'Build general understanding of risks and safe behavior'],
  ['Security Training', 'Build role-specific practical skills'],
  ['Physical Security', 'Protect facilities, devices and the environment'],
  ['Logical Access Control', 'Control access to systems and data'],
  ['Monitoring and Compliance', 'Verify that controls work and policies are followed'],
  ['Incident Reporting', 'Give staff a clear path to report suspicious activity'],
]

const awarenessRiskRows: string[][] = [
  ['Phishing', 'Deceptive messages seek credentials or actions', 'Verify sender, avoid unexpected links, report'],
  ['Social Engineering', 'Trust or urgency is used to obtain information', 'Verify identity through a known channel'],
  ['Weak password behavior', 'Sharing or reusing passwords', 'Unique passwords and approved password manager'],
  ['Unsafe device usage', 'Unlocked devices, unknown USB drives, unapproved software', 'Lock screen, avoid unknown media, follow approval process'],
  ['Data mishandling', 'Wrong recipient or unapproved channel', 'Confirm recipient and follow data classification rules'],
]

const trainingMetricRows: string[][] = [
  ['Training Completion Rate', 'Shows coverage of required training'],
  ['Phishing Simulation Failure Rate', 'Shows behavioral gap that needs more practice'],
  ['Incident Reporting Rate', 'Early reporting often indicates better awareness'],
  ['Policy Compliance', 'Shows whether required practices are followed'],
  ['Time to Report', 'Shorter reporting time gives the team more chance to respond'],
]

const physicalThreatRows: string[][] = [
  ['Device theft', 'Portable or unsecured equipment is taken', 'Locks, inventory, locked racks'],
  ['Unauthorized room access', 'Someone enters a server room without approval', 'Badge systems, guards, mantraps'],
  ['Equipment tampering', 'Device settings or cables are changed', 'Locked racks, cameras, access logs'],
  ['Cable disconnection', 'Network or power cable is removed', 'Secure racks and controlled access'],
  ['Hardware damage', 'Equipment is physically broken', 'Physical controls and visitor escort'],
  ['Environmental hazards', 'Fire, water, heat or humidity damage', 'Fire suppression, water detection, temperature control'],
  ['Power failure', 'Service stops when electricity is lost', 'UPS and backup power'],
]

const physicalControlTypeRows: string[][] = [
  ['Preventive', 'Stop unauthorized access before it happens', 'Door locks, access cards, biometrics, locked racks'],
  ['Detective', 'Record or reveal activity for review', 'CCTV, security guards, access logs'],
  ['Environmental', 'Protect availability from environmental events', 'Fire suppression, UPS, temperature and water monitoring'],
]

const accessFundamentalRows: string[][] = [
  ['Authentication', 'Who are you?', 'Username and password, smart card, biometrics, MFA'],
  ['Authorization', 'What are you allowed to do?', 'Permissions, roles, ACLs'],
  ['Accounting', 'What did you do?', 'Logs and activity records'],
]

const modelRows: string[][] = [
  ['DAC', 'Owner of the resource decides who has access', 'Flexible, but depends on owner decisions'],
  ['MAC', 'Central policy and security labels decide access', 'Strict and centrally controlled'],
  ['RBAC', 'Access is based on the user role', 'Practical for organizations with defined job roles'],
  ['Least Privilege', 'Only the minimum required permissions are granted', 'Limits damage from mistakes or compromised accounts'],
]

const roleMatrixRows: string[][] = [
  ['Employee', 'Yes', 'No', 'No', 'Limited'],
  ['IT Support', 'Yes', 'Limited', 'Limited', 'No'],
  ['Network Admin', 'Yes', 'Yes', 'Yes', 'No'],
  ['Security Admin', 'Yes', 'Controlled', 'Controlled', 'Authorized'],
  ['Visitor', 'Restricted', 'No', 'No', 'No'],
]

const policyRows: string[][] = [
  ['Acceptable Use Policy', 'Defines permitted use of company devices and services'],
  ['Password Policy', 'Defines password creation, storage and change requirements'],
  ['Data Handling Policy', 'Defines storage, classification, sharing and transfer of information'],
  ['Physical Access Policy', 'Defines who may enter sensitive areas and how access is recorded'],
  ['Remote Access Policy', 'Defines conditions for connecting from outside the organization'],
  ['Incident Reporting Policy', 'Defines what to report, to whom and through which approved channel'],
]

const effectivenessRows: string[][] = [
  ['Training completion', 'Are required courses completed?'],
  ['Policy compliance', 'Are required behaviors followed?'],
  ['Physical access logs', 'Are entries to sensitive areas recorded and reviewed?'],
  ['Reported incidents', 'Are staff reporting suspicious activity early?'],
  ['Audit findings', 'Are gaps identified and closed?'],
  ['Corrective actions', 'Do improvements actually happen?'],
]

const summaryRows: string[][] = [
  ['Security Program', 'People, Process, Technology, policies and procedures'],
  ['Awareness', 'Phishing, social engineering, password safety, device use, data handling'],
  ['Training', 'Employees, IT staff, privileged users, specialized exercises, metrics'],
  ['Physical Security', 'Locks, cards, biometrics, CCTV, guards, mantraps, racks, UPS'],
  ['Access Control', 'Authentication, Authorization, Accounting, DAC, MAC, RBAC, least privilege'],
  ['Policies', 'AUP, password, data handling, physical access, remote access, incident reporting'],
]

export const topic52Lesson: Lesson = {
  topicId: '5.2',
  title: 'Describe security program elements (user awareness, training, and physical access control)',
  description:
    'Topic 5.2 يشرح عناصر البرنامج الأمني: الوعي والتدريب والأمان المادي والتحكم في الوصول والسياسات والإبلاغ عن الحوادث. الأمثلة تعليمية ودفاعية، ولا تسبق تفاصيل إعداد كلمات المرور على الأجهزة أو AAA وTACACS+ وRADIUS.',
  estimatedTime: '~150 دقيقة',
  steps: [
    {
      id: 'what',
      title: 'Security Program Fundamentals',
      short: 'أساسيات البرنامج الأمني',
      blocks: [
        { type: 'paragraph', text: '**Security Program** إطار متكامل يجمع السياسات والإجراءات والأشخاص والتقنيات لحماية أصول المؤسسة.' },
        { type: 'diagram', id: 'security-program-overview', caption: 'كيف تتحول سياسات الإدارة إلى ضوابط تحمي الأصول وتُقاس نتائجها.' },
        { type: 'callout', tone: 'warning', title: 'Technology وحدها لا تكفي', text: 'Firewall قوي أو Encryption جيد لا يعالج موظفاً لا يعرف Phishing، ولا سياسة غير واضحة، ولا غرفة خوادم غير مؤمنة.' },
        { type: 'diagram', id: 'people-process-technology', caption: 'People + Process + Technology — اختر عنصراً لترى دوره.' },
        { type: 'table', headers: ['Document', 'Purpose', 'Role'], rows: documentRows },
        { type: 'table', headers: ['Element', 'Purpose'], rows: programElementRows },
        { type: 'list', items: [
          '**Management** يضع السياسات ويعتمد المسؤوليات والموارد.',
          '**IT and Security Teams** ينفذان الضوابط ويراقبانها ويتعاملان مع الحوادث.',
          '**Employees** يلتزمون بالسياسات ويطبقون السلوك الآمن ويبلغون عن الشكوك.',
        ]},
        { type: 'callout', tone: 'info', title: 'العلاقة بين العناصر', text: 'People يحتاجون Process واضحاً وTechnology مناسبة. غياب أي عنصر يضعف البرنامج كله.' },
      ],
    },
    {
      id: 'how',
      title: 'User Security Awareness',
      short: 'الوعي الأمني للمستخدمين',
      blocks: [
        { type: 'paragraph', text: '**Security Awareness** يعني أن يفهم الموظف المخاطر الشائعة والسلوك الآمن المتوقع منه. قد يسبب الموظفون حوادث دون قصد عبر رسالة خادعة أو مشاركة معلومات أو ترك جهاز غير مقفل.' },
        { type: 'paragraph', text: 'الفرق باختصار: **Awareness** يبني الفهم العام، أما **Training** فيبني مهارات عملية حسب كل دور.' },
        { type: 'diagram', id: 'user-awareness-lifecycle', caption: 'دورة الوعي من فهم الخطر إلى الإبلاغ والقياس.' },
        { type: 'diagram', id: 'phishing-email-indicators', caption: 'Phishing Awareness Simulator — صنّف رسائل وهمية واختر الاستجابة الآمنة.' },
        { type: 'table', headers: ['Behavioral risk', 'Typical situation', 'Safe habit'], rows: awarenessRiskRows },
        { type: 'diagram', id: 'social-engineering-examples', caption: 'Social Engineering Examples — اختر الأسلوب وافهم طريقة الدفاع.' },
        { type: 'list', items: [
          '**Phishing**: افحص المرسل، واحذر الروابط والمرفقات غير المتوقعة، ولا تُدخل Credentials في صفحة غير موثوقة.',
          '**Social Engineering**: تحقق من هوية من يتصل بك عبر قناة معتمدة، ولا تستسلم للاستعجال.',
          '**Password Behavior**: لا تشارك كلمات المرور ولا تعِد استخدامها، واستخدم Password Manager معتمداً.',
          '**Device Usage**: أغلق الجهاز عند الابتعاد، وتجنب USB Drives مجهولة، ولا ثبّت software غير معتمد.',
          '**Data Handling**: تأكد من المستلم، واستخدم قنوات معتمدة، والتزم بتصنيف البيانات.',
        ]},
        { type: 'callout', tone: 'danger', title: 'أمثلة وهمية فقط', text: 'كل رسائل البريد في هذا الدرس وهمية تعليمية؛ لا توجد روابط ضارة أو بيانات دخول حقيقية.' },
      ],
    },
    {
      id: 'packet',
      title: 'Security Training',
      short: 'التدريب الأمني',
      blocks: [
        { type: 'paragraph', text: '**Security Training** تدريب عملي مستمر يبني مهارات مناسبة لكل وظيفة. يتغير التدريب لأن التهديدات والأدوار والسياسات تتغير، ولذلك لا يكفي تدريب مرة واحدة عند التعيين.' },
        { type: 'diagram', id: 'security-training-framework', caption: 'إطار التدريب من الموظفين العامين إلى التدريب المتخصص والقياس.' },
        { type: 'diagram', id: 'training-by-role', caption: 'Training Planner — اختر الدور واعرض التدريب المناسب.' },
        { type: 'table', headers: ['Metric', 'What it shows'], rows: trainingMetricRows },
        { type: 'callout', tone: 'tip', title: 'قياس الفعالية', text: 'لا يكفي عدّ من حضر التدريب؛ قياس السلوك مثل Phishing Simulation Failure Rate وسرعة الإبلاغ يعطي صورة أفضل.' },
      ],
    },
    {
      id: 'config',
      title: 'Physical Security',
      short: 'الأمان المادي',
      blocks: [
        { type: 'paragraph', text: '**Physical Security** حماية الأشخاص والأجهزة والغرف والبنية التحتية من الوصول أو التلف غير المصرح. بدونها قد يتجاوز شخص أقوى ضوابط الشبكة بمجرد الوصول المادي إلى جهاز أو كابل.' },
        { type: 'diagram', id: 'physical-security-layers', caption: 'طبقات الأمان المادي: Preventive وDetective وEnvironmental.' },
        { type: 'diagram', id: 'data-center-security', caption: 'Data Center Physical Security Explorer — اختر ضابطاً لترى غرضه وأثره.' },
        { type: 'table', headers: ['Physical threat', 'Possible situation', 'Relevant controls'], rows: physicalThreatRows },
        { type: 'table', headers: ['Control type', 'Purpose', 'Examples'], rows: physicalControlTypeRows },
        { type: 'list', items: [
          'Door Locks وAccess Cards وBiometrics وMantraps وLocked Racks تمنع الوصول غير المصرح.',
          'CCTV وSecurity Guards وAccess Logs تساعد على الاكتشاف والمراجعة.',
          'Fire Suppression وUPS وTemperature وWater Leak Detection تحمي التوفر.',
        ]},
        { type: 'diagram', id: 'access-card-authentication', caption: 'Access Card Authentication — من بطاقة الدخول إلى سجل الدخول.' },
        { type: 'callout', tone: 'warning', title: 'الوصول المادي جزء من Network Security', text: 'فصل كابل أو تغيير جهاز أو سرعة قرص صلب كلها أحداث مادية تؤثر مباشرة على الشبكة والبيانات.' },
      ],
    },
    {
      id: 'verify',
      title: 'Access Control Fundamentals',
      short: 'أساسيات التحكم في الوصول',
      blocks: [
        { type: 'paragraph', text: '**Access Control** يحدد من يستطيع الوصول إلى ماذا، وتحت أي شروط. ليس كل المستخدمين محتاجين لنفس الصلاحيات؛ منح صلاحيات زائدة يزيد أثر الخطأ أو اختراق الحساب.' },
        { type: 'diagram', id: 'physical-vs-logical-access', caption: 'الفرق بين التحكم في الوصول المادي والمنطقي.' },
        { type: 'paragraph', text: '**Physical Access Control** يتحكم في المباني والغرف والـ Racks. **Logical Access Control** يتحكم في الحسابات والملفات والشبكة.' },
        { type: 'diagram', id: 'authentication-vs-authorization', caption: 'Authentication وAuthorization وAccounting — ثلاثة أسئلة أساسية.' },
        { type: 'table', headers: ['Concept', 'Question it answers', 'Examples'], rows: accessFundamentalRows },
        { type: 'callout', tone: 'info', title: 'حدود الدرس', text: 'نتناول هنا المبادئ العامة فقط. تفاصيل AAA وTACACS+ وRADIUS ستأتي في Topic لاحق، وإعداد كلمات المرور على الأجهزة في Topic 5.3.' },
        { type: 'paragraph', text: 'Access Control يحمي Confidentiality بمنع القراءة غير المصرح، وIntegrity بمنع التعديل غير المسموح، وAvailability بمنع تعطيل الخدمات أو حذف البيانات.' },
      ],
    },
    {
      id: 'mistakes',
      title: 'Access Control in a Real Organization',
      short: 'التحكم في الوصول عملياً',
      blocks: [
        { type: 'paragraph', text: 'في المؤسسة تُمنح الصلاحيات حسب الدور، ثم تُراجع وتُسحب عند زوال الحاجة. الجدول التالي مثال تعليمي؛ الصلاحيات الحقيقية تعتمد على سياسات المؤسسة.' },
        { type: 'table', headers: ['Role', 'Office Access', 'Server Room', 'Network Devices', 'Employee Records'], rows: roleMatrixRows },
        { type: 'diagram', id: 'access-control-models', caption: 'DAC مقابل MAC مقابل RBAC — اختر النموذج.' },
        { type: 'table', headers: ['Model', 'Decision basis', 'Practical note'], rows: modelRows },
        { type: 'diagram', id: 'least-privilege', caption: 'Least Privilege — امنح الحد الأدنى من الصلاحيات.' },
        { type: 'diagram', id: 'rbac-access-matrix', caption: 'Interactive Role-Based Access Matrix — اختر دوراً وشاهد صلاحياته.' },
        { type: 'callout', tone: 'warning', title: 'سيناريو طابعة', text: 'إذا كان مستخدم يحتاج تغيير إعدادات Printer فقط، فمنح Administrator Privileges على كل الشبكة مخالف لـ Least Privilege. الصحيح منح صلاحية محدودة على الطابعة أو مجموعة أجهزة محددة.' },
        { type: 'list', items: [
          '**Role Assignment**: تحديد دور للمستخدم.',
          '**Permission Assignment**: ربط الدور بالحد الأدنى من الصلاحيات.',
          '**Access Approval**: موافقة مختص قبل منح الوصول الحساس.',
          '**Access Review**: مراجعة دورية للصلاحيات.',
          '**Revoking Access**: سحب الوصول عند تغيير الوظيفة أو المغادرة.',
          '**Temporary Access**: تصريح مؤقت بمدة محدودة ومراقبة.',
          '**Visitor Access**: تسجيل ومرافقة وصلاحية محدودة جداً.',
        ]},
        { type: 'diagram', id: 'visitor-access-control', caption: 'Visitor Access Control — تسجيل، مرافقة، ثم إلغاء التصريح.' },
      ],
    },
    {
      id: 'lab',
      title: 'Security Policies and Incident Reporting',
      short: 'السياسات والإبلاغ',
      blocks: [
        { type: 'paragraph', text: 'السياسات تترجم أهداف الأمان إلى قواعد يومية واضحة. والإبلاغ عن الحوادث يجب أن يكون سهلاً ومعروفاً لكل موظف.' },
        { type: 'diagram', id: 'security-policy-framework', caption: 'Security Policy Framework — اختر سياسة واعرض غرضها.' },
        { type: 'table', headers: ['Policy', 'Purpose'], rows: policyRows },
        { type: 'diagram', id: 'incident-reporting-workflow', caption: 'Incident Reporting Workflow من الاكتشاف إلى الدروس المستفادة.' },
        { type: 'callout', tone: 'info', title: 'دور الموظف العادي', text: 'لا يُفترض بالموظف تنفيذ Incident Response متقدم بنفسه. دوره الأساسي: عدم التفاعل أكثر، حفظ المعلومات، والإبلاغ عبر القناة المعتمدة.' },
        { type: 'diagram', id: 'security-program-metrics', caption: 'Security Program Metrics — كيف نعرف أن البرنامج يعمل؟' },
        { type: 'table', headers: ['Evidence', 'Question'], rows: effectivenessRows },
        { type: 'diagram', id: 'complete-security-program', caption: 'حلقة البرنامج الأمني الكاملة.' },
      ],
    },
    {
      id: 'exam',
      title: 'Hands-on Labs (Simulation)',
      short: 'Labs',
      blocks: [
        { type: 'paragraph', text: '**Labs (Interactive Simulation / Conceptual — رسائل وهمية وسيناريوهات تعليمية فقط)**' },

        { type: 'paragraph', text: '**Lab 1 — Phishing Awareness Challenge**' },
        { type: 'steps', items: [
          { title: 'Objectives', text: 'فحص ست رسائل وهمية وتصنيفها واختيار الاستجابة الآمنة مع شرح السبب.' },
          { title: 'Scenario', text: 'ست رسائل: إعلان داخلي حقيقي، طلب تحقق كلمة مرور مزيف، مرفق مشبوه، طلب من تنفيذي مزيف، طلب تحويل مالي عاجل، وإشعار صيانة IT حقيقي.' },
          { title: 'Initial State', text: 'الرسائل غير مصنفة، ولا توجد روابط حقيقية أو بيانات دخول.' },
          { title: 'Task 1 — Inspect Sender', text: 'افحص عنوان المرسل وابحث عن نطاق مشابه أو عام غير متوقع.' },
          { title: 'Task 2 — Inspect Content', text: 'ابحث عن استعجال أو طلب Credentials أو مرفق غير متوقع.' },
          { title: 'Task 3 — Identify Indicators', text: 'اربط كل رسالة بمؤشر واحد على الأقل باستخدام Phishing Simulator.' },
          { title: 'Task 4 — Classify', text: 'اختر Legitimate أو Suspicious أو Phishing.' },
          { title: 'Task 5 — Safe Action', text: 'للرسائل غير الموثوقة: لا تنقر ولا ترد، وأبلغ عبر القناة المعتمدة.' },
          { title: 'Task 6 — Explain', text: 'اكتب جملة تشرح لماذا اخترت التصنيف.' },
          { title: 'Hints', text: 'اسأل: هل أعرف المرسل؟ هل يطلب بيانات دخول؟ هل هناك ضغط وقت؟' },
          { title: 'Expected Results', text: 'ستة تصنيفات صحيحة وست استجابات آمنة.' },
          { title: 'Explanation', text: 'الفحص الهادئ والتحقق المستقل يقلل الاعتماد على رد الفعل السريع.' },
          { title: 'Assessment Score', text: 'درجة مئوية من عدد الرسائل المصنفة صحيحاً: كل رسالة ≈ 16.7%.' },
        ]},
        { type: 'diagram', id: 'phishing-email-indicators', caption: 'أداة Lab 1 — محاكي رسائل Phishing.' },

        { type: 'paragraph', text: '**Lab 2 — Data Center Physical Security Assessment**' },
        { type: 'steps', items: [
          { title: 'Objectives', text: 'تحديد نقاط الضعف المادية واختيار الضوابط وترتيب المعالجة.' },
          { title: 'Scenario', text: 'Server Room فيها باب غير مقفل، لا CCTV، Rack غير مؤمن، زوار بلا قيود، لا UPS، ولا مراقبة بيئية.' },
          { title: 'Initial State', text: 'Before Assessment يسجل ست مشكلات مادية واضحة.' },
          { title: 'Task 1 — Identify Vulnerabilities', text: 'ارصد كل مشكلة من مشكلات الحالة الأولية.' },
          { title: 'Task 2 — Identify Threats', text: 'اربط كل ضعف بتهديد مادي أو بيئي مناسب.' },
          { title: 'Task 3 — Select Controls', text: 'اختر Door Lock أو Access Card أو CCTV أو Locked Rack أو UPS أو Environmental Monitoring.' },
          { title: 'Task 4 — Prioritize', text: 'ابدأ بالأثر الأعلى على Availability والوصول غير المصرح.' },
          { title: 'Task 5 — Reassess', text: 'بعد الضوابط راجع After State وتأكد أن كل ضعف له ضابط.' },
          { title: 'Hints', text: 'اسأل: من يستطيع الدخول؟ ماذا يُسجَّل؟ ماذا يحدث عند انقطاع الكهرباء؟' },
          { title: 'Expected Results', text: 'Before/After Assessment يوضح تحسناً في كل فئة.' },
          { title: 'Explanation', text: 'الضوابط Preventive تمنع، وDetective تسجل، وEnvironmental تحافظ على التوفر.' },
          { title: 'Assessment Score', text: 'ست مشكلات × ضابط مناسب = 100%، خصم نقطة لكل ربط غير صحيح.' },
        ]},
        { type: 'diagram', id: 'data-center-security', caption: 'أداة Lab 2 — Physical Security Explorer.' },

        { type: 'paragraph', text: '**Lab 3 — Role-Based Access Control Challenge**' },
        { type: 'steps', items: [
          { title: 'Objectives', text: 'تعيين أدوار وصلاحيات دنيا واختبار قرارات الوصول.' },
          { title: 'Scenario', text: 'مؤسسة فيها Employee وIT Support وNetwork Admin وSecurity Admin وVisitor، وموارد مثل Office وServer Room وNetwork Devices وEmployee Records.' },
          { title: 'Initial State', text: 'المصفوفة تعرض صلاحيات مثال تعليمي.' },
          { title: 'Task 1 — Identify Roles', text: 'حدد الأدوار الخمسة في RBAC Matrix.' },
          { title: 'Task 2 — Minimum Permissions', text: 'لكل دور اختر أقل صلاحية تكفي لعمله.' },
          { title: 'Task 3 — Excessive Permissions', text: 'حدد مثالاً لصلاحية زائدة مثل منح Visitor دخول Server Room.' },
          { title: 'Task 4 — Authorized Access', text: 'اختبر أن Network Admin يستطيع الوصول إلى Network Devices.' },
          { title: 'Task 5 — Unauthorized Access', text: 'اختبر أن Employee لا يستطيع الوصول إلى Employee Records بشكل كامل.' },
          { title: 'Task 6 — Temporary and Visitor Access', text: 'راجع قواعد الزائر والصلاحية المؤقتة وإلغاءها.' },
          { title: 'Hints', text: 'اسأل: ما المهمة المطلوبة؟ ما أقل صلاحية تنجزها؟ متى تُسحب؟' },
          { title: 'Expected Results', text: 'قرارات وصول متوافقة مع Least Privilege وRBAC.' },
          { title: 'Explanation', text: 'الصلاحيات المحدودة تقلل أثر الخطأ وتجعل المراجعة أسهل.' },
          { title: 'Assessment Score', text: 'خمسة أدوار × قرار وصول صحيح = 100%.' },
        ]},
        { type: 'diagram', id: 'rbac-access-matrix', caption: 'أداة Lab 3 — مصفوفة الوصول حسب الدور.' },
        { type: 'callout', tone: 'warning', title: 'Simulation boundary', text: 'لا تُنفَّذ أي تغييرات صلاحيات حقيقية؛ كل الاختبارات داخل أمثلة تعليمية.' },
      ],
    },
    {
      id: 'summary',
      title: 'Summary & CCNA Exam Quiz',
      short: 'ملخص واختبار',
      blocks: [
        { type: 'paragraph', text: '**Security Program:** People وProcess وTechnology مع Policies وProcedures وStandards وGuidelines.' },
        { type: 'paragraph', text: '**User Awareness:** Phishing وSocial Engineering وPassword Safety وDevice Usage وData Handling.' },
        { type: 'paragraph', text: '**Training:** General Employees وIT Staff وPrivileged Users وSpecialized Exercises مع قياس الفعالية.' },
        { type: 'paragraph', text: '**Physical Security:** Locks وAccess Cards وBiometrics وCCTV وGuards وMantraps وLocked Racks وUPS وEnvironmental Controls.' },
        { type: 'paragraph', text: '**Access Control:** Authentication وAuthorization وAccounting وDAC وMAC وRBAC وLeast Privilege.' },
        { type: 'paragraph', text: '**Policies:** Acceptable Use وPassword وData Handling وPhysical Access وRemote Access وIncident Reporting.' },
        { type: 'table', headers: ['Area', 'Key points'], rows: summaryRows },
        { type: 'paragraph', text: '**اختبار CCNA:** 5 أسئلة، 4 خيارات لكل سؤال، مزيج single-choice وmultiple-select، وكلها تعتمد على سيناريوهات. لا تظهر الإجابة قبل Submit.' },
        { type: 'quiz', questions: [
          {
            id: 'q1',
            prompt: 'A person carrying a box follows an employee through an unlocked side door into a restricted area without presenting a badge. Which security concept best describes this situation?',
            options: ['Phishing', 'Tailgating', 'Ransomware', 'DDoS'],
            correctIndex: 1,
            requireSubmit: true,
            explanation: 'الصح هو **(B)**. Tailgating يعني دخول شخص غير مصرح خلف شخص مفوض، وهو مثال على Social Engineering المادي.',
          },
          {
            id: 'q2',
            kind: 'multiple',
            prompt: 'A user only needs to change settings on one printer. An administrator is considering granting full network administrator rights. Which statements are correct? (Choose more than one.)',
            options: [
              'Granting full administrator rights violates least privilege.',
              'A limited permission on the printer is a better choice.',
              'RBAC requires every user to receive administrator rights.',
              'Temporary access should be removed when it is no longer needed.',
            ],
            correctIndices: [0, 1, 3],
            requireSubmit: true,
            explanation: 'الصح هو **(A) و(B) و(D)**. RBAC يمنح صلاحيات حسب الدور وليس بالضرورة صلاحيات إدارية، لذلك الخيار (C) خاطئ.',
          },
          {
            id: 'q3',
            prompt: 'After a successful login, a system allows a user to read payroll records but denies access to server logs. Which access control function is being demonstrated?',
            options: ['Identification', 'Authentication', 'Authorization', 'Accounting'],
            correctIndex: 2,
            requireSubmit: true,
            explanation: 'الصح هو **(C)**. Authentication تحقق من الهوية، أما Authorization فتحدد الموارد والعمليات المسموحة بعد ذلك.',
          },
          {
            id: 'q4',
            kind: 'multiple',
            prompt: 'An employee receives an email claiming to be from IT Support and asking them to confirm a password through a link. Which actions are appropriate? (Choose more than one.)',
            options: [
              'Verify the request through a known internal channel.',
              'Report the message using the approved reporting process.',
              'Avoid clicking the link or replying with credentials.',
              'Forward the message to all colleagues so everyone can click it.',
            ],
            correctIndices: [0, 1, 2],
            requireSubmit: true,
            explanation: 'الصح هو **(A) و(B) و(C)**. إعادة توجيه الرسالة للجميع ينشر الخطر بدل السيطرة عليه، لذا الخيار (D) خاطئ.',
          },
          {
            id: 'q5',
            kind: 'multiple',
            prompt: 'A company improves its server room with badge readers, locked racks, CCTV and an UPS. Which statements about these controls are correct? (Choose more than one.)',
            options: [
              'Badge readers are a physical access control.',
              'CCTV is mainly a detective control.',
              'UPS helps protect availability during power loss.',
              'CCTV alone prevents every unauthorized physical access attempt.',
            ],
            correctIndices: [0, 1, 2],
            requireSubmit: true,
            explanation: 'الصح هو **(A) و(B) و(C)**. CCTV يساعد على المراقبة والمراجعة لكنه لا يمنع كل محاولة وحده، لذلك الخيار (D) خاطئ.',
          },
        ]},
      ],
    },
  ],
}
