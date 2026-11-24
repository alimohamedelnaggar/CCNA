import type { Lesson } from '../types'

const coreTermRows: string[][] = [
  ['Asset', 'Anything of value that needs protection', 'Router, server, credentials, database'],
  ['Threat', 'A possible source or cause of harm', 'Malicious employee, external attacker, flood'],
  ['Vulnerability', 'A weakness in an asset, design or process', 'Weak password, unpatched OS, open port'],
  ['Risk', 'Likelihood of harm combined with its impact', 'A critical server exposed with default credentials'],
  ['Exploit', 'The means used to take advantage of a weakness', 'Discussed conceptually only in this lesson'],
  ['Attack', 'An action that attempts to cause harm', 'Unauthorized access attempt or service disruption'],
  ['Impact', 'The resulting effect on the organization', 'Data loss, outage, financial or reputational damage'],
]

const threatCategoryRows: string[][] = [
  ['Internal', 'Inside the organization', 'Malicious employee, misuse of privileges, accidental exposure'],
  ['External', 'Outside the organization', 'External attackers, cybercriminals, automated attempts'],
  ['Human', 'People and behavior', 'Social engineering, phishing, credential theft, insider threats'],
  ['Technical', 'Systems and software', 'Malware, DoS, network exploitation, unauthorized access'],
  ['Physical', 'Real-world access', 'Device theft, unauthorized physical access, hardware or environmental damage'],
  ['Accidental', 'No malicious intent', 'Wrong recipient, accidental deletion, configuration mistake'],
  ['Intentional', 'Deliberate action', 'Deliberate theft, modification or disruption'],
  ['Natural / Environmental', 'Events outside human control', 'Power loss, fire, flood, extreme conditions'],
]

const vulnerabilityRows: string[][] = [
  ['Weak passwords', 'Authentication control', 'Use strong passwords and MFA where available'],
  ['Outdated software', 'Operating system or application', 'Patch management and supported versions'],
  ['Unpatched OS', 'System software', 'Regular updates and vulnerability review'],
  ['Misconfigured firewall', 'Network control', 'Review rules and deny unnecessary traffic'],
  ['Open unnecessary ports', 'Network exposure', 'Disable unused services and filter ports'],
  ['Default credentials', 'Device or application access', 'Change defaults before deployment'],
  ['Unsecured wireless', 'Wireless network', 'Use modern security settings and controlled access'],
  ['Excessive privileges', 'Accounts and roles', 'Least privilege and periodic review'],
  ['Unencrypted communication', 'Data in transit', 'Use approved secure protocols'],
  ['Physical weakness', 'Facilities and devices', 'Access control, locks and inventory'],
]

const malwareRows: string[][] = [
  ['Virus', 'Infects files or programs; usually needs a host', 'File damage or modification'],
  ['Worm', 'Self-propagates across devices', 'Network congestion and spread'],
  ['Trojan', 'Disguises as legitimate software', 'Unauthorized access or hidden activity'],
  ['Ransomware', 'Encrypts or blocks data', 'Data unavailability'],
  ['Spyware', 'Secretly collects information', 'Privacy compromise'],
  ['Adware', 'Displays unwanted advertisements', 'User disruption'],
  ['Rootkit', 'Hides malicious components', 'Persistent compromise'],
]

const attackRows: string[][] = [
  ['DoS', 'Limited sources overwhelm a service', 'Service / Availability', 'Filtering, rate limiting, capacity'],
  ['DDoS', 'Distributed sources overwhelm a service', 'Service / Availability', 'Resilience, filtering, provider support'],
  ['MitM', 'Unauthorized party sits in the communication path', 'Traffic / Confidentiality, Integrity', 'Encryption, identity checks'],
  ['Phishing', 'Deceptive message seeks credentials or data', 'Users / Confidentiality', 'Awareness, MFA, reporting'],
  ['Spoofing', 'Identity or address is imitated', 'Trust / Confidentiality, Integrity', 'Validation, authentication, filtering'],
  ['Eavesdropping', 'Traffic is observed without permission', 'Traffic / Confidentiality', 'Encryption, secure protocols'],
  ['Password attack', 'Credentials are guessed or reused', 'Accounts / Confidentiality', 'MFA, lockout, strong passwords'],
  ['Unauthorized access', 'Access occurs without permission', 'Assets / all CIA goals', 'ACLs, least privilege, monitoring'],
  ['Social engineering', 'People are manipulated into unsafe actions', 'Users / Confidentiality', 'Training and clear procedures'],
]

const ciaRows: string[][] = [
  ['Confidentiality', 'Prevent unauthorized disclosure', 'Encryption, authentication, authorization, ACLs'],
  ['Integrity', 'Prevent unauthorized modification', 'Hashing, digital signatures, audit logs, change control'],
  ['Availability', 'Keep services accessible when needed', 'Redundancy, backups, failover, DoS protection'],
]

const preventionDetectionRows: string[][] = [
  ['Threat prevention', 'Reduce the chance that harm occurs', 'Firewalls, ACLs, patching, training, least privilege'],
  ['Threat detection', 'Notice suspicious activity quickly', 'Logs, Syslog, monitoring, IDS, alert review'],
  ['Incident response', 'Contain, recover and learn', 'Response plan, isolation, clean restore, lessons learned'],
]

const accessControlRows: string[][] = [
  ['Strong authentication', 'Verify user or device identity'],
  ['Authorization', 'Allow only approved actions'],
  ['Least privilege', 'Give only the permissions required for the task'],
  ['Role-based access', 'Assign permissions by job role instead of per-person ad hoc rights'],
  ['Restrict administrative access', 'Limit and review privileged accounts'],
]

const protectionRows: string[][] = [
  ['Network protection', 'Firewalls, ACLs, segmentation, secure management, disable unused services'],
  ['Endpoint protection', 'Antivirus, EDR conceptually, updates, patch management, application security'],
  ['Data protection', 'Encryption, secure backups, integrity checks, access restrictions'],
  ['Security monitoring', 'Logs, Syslog, network monitoring, IDS and IPS conceptually'],
  ['Human security', 'Awareness, phishing training, password practices, incident reporting, policies'],
]

const threatMitigationRows: string[][] = [
  ['Phishing', 'User awareness + MFA + reporting'],
  ['Malware', 'Endpoint protection + patching + clean backups'],
  ['Unauthorized Access', 'Authentication + ACLs + least privilege'],
  ['DoS / DDoS', 'Filtering + rate limiting + resilience'],
  ['Data Theft', 'Encryption + access control + monitoring'],
  ['Data Tampering', 'Integrity checks + digital signatures + audit logs'],
  ['Device Theft', 'Physical security + encryption + inventory'],
]

const summaryRows: string[][] = [
  ['Fundamentals', 'Asset, Threat, Vulnerability, Risk, Exploit, Attack, Impact'],
  ['Threats', 'Internal, external, human, technical, physical, accidental, intentional'],
  ['Malware', 'Virus, worm, Trojan, ransomware, spyware, adware, rootkit'],
  ['Attacks', 'DoS, DDoS, MitM, phishing, spoofing, eavesdropping, password attacks'],
  ['CIA Triad', 'Confidentiality, Integrity, Availability'],
  ['Mitigation', 'Authentication, encryption, firewalls, ACLs, patching, backups, monitoring, awareness, defense in depth'],
]

export const topic51Lesson: Lesson = {
  topicId: '5.1',
  title: 'Define key security concepts (threats, vulnerabilities, exploits, and mitigation techniques)',
  description:
    'Topic 5.1 يغطي أساسيات أمن الشبكات: الأصول والتهديدات والضعف والمخاطر والـ Exploits والـ Malware والهجمات الشائعة ومبادئ CIA Triad وطرق التخفيف. كل الأمثلة تعليمية ودفاعية ولا تشرح تنفيذ هجمات أو نشر برمجيات ضارة.',
  estimatedTime: '~150 دقيقة',
  steps: [
    {
      id: 'what',
      title: 'Network Security Fundamentals',
      short: 'أساسيات الأمان',
      blocks: [
        { type: 'paragraph', text: '**Network Security** هي حماية أصول الشبكة وبياناتها وخدماتها من الوصول غير المصرح والتلاعب والانقطاع. أهميتها أن أي خلل في جهاز أو بيانات أو قناة اتصال قد يؤثر على العمل كله.' },
        { type: 'diagram', id: 'security-overview', caption: 'نظرة عامة على مكان الضوابط بين الشبكات غير الموثوقة والأصول المحمية.' },
        { type: 'paragraph', text: '**Data Security** تركز على حماية البيانات نفسها أينما وُجدت، بينما **Network Security** تركز على الأجهزة والمسارات والقواعد التي تحكم الوصول إلى الشبكة. كلتاهما تكملان بعضهما.' },
        { type: 'paragraph', text: 'أمثلة على **Assets** التي تحتاج حماية:' },
        { type: 'list', items: [
          'Network Devices مثل Routers وSwitches.',
          'Servers وBusiness Applications.',
          'Endpoints مثل PCs والهواتف والأجهزة الطرفية.',
          'User Credentials وملفات Configuration.',
          'Sensitive Information وNetwork Traffic.',
        ]},
        { type: 'diagram', id: 'security-assets-explorer', caption: 'Interactive Security Assets Explorer — اختر أصلاً لترى أهميته.' },
        { type: 'table', headers: ['Term', 'Meaning', 'Example'], rows: coreTermRows },
        { type: 'callout', tone: 'info', title: 'مثال عملي', text: 'شركة لديها Internet → Firewall → Router → Switch → Users / Server / Wireless. الأصول هي الأجهزة والخادم والبيانات؛ التهديدات قد تكون خارجية أو داخلية؛ الضعف مثل كلمة مرور ضعيفة أو خدمة غير محدثة؛ والنتيجة المحتملة فقدان سرية أو سلامة أو توفر.' },
        { type: 'callout', tone: 'warning', title: 'لا يوجد نظام آمن 100%', text: 'الهدف تقليل الاحتمال والأثر باستمرار، لا الادعاء بمنع كل حادث. لذلك نستخدم طبقات حماية ومراقبة وتخطيط استجابة.' },
      ],
    },
    {
      id: 'how',
      title: 'Security Threats',
      short: 'التهديدات',
      blocks: [
        { type: 'paragraph', text: '**Threat** هو احتمال أو مصدر خطر يمكن أن يستغل ضعفاً ويؤثر على Asset. التهديد قد يكون مقصوداً أو عرضياً أو ناتجاً عن ظروف بيئية.' },
        { type: 'diagram', id: 'threat-categories', caption: 'Threat Explorer: اختر فئة لتري الأسلوب والمثال والتأثير والتخفيف المقترح.' },
        { type: 'diagram', id: 'internal-external-threats', caption: 'الفرق بين تهديد ينشأ داخل حدود الثقة وتهديد يأتي من خارجها.' },
        { type: 'table', headers: ['Category', 'Origin', 'Examples'], rows: threatCategoryRows },
        { type: 'paragraph', text: 'أمثلة إضافية: **Malicious Employee** و**Unauthorized Internal Access** و**Accidental Data Exposure** و**Misuse of Privileges** من الداخل؛ و**External Attackers** و**Cybercriminals** و**Automated Attacks** من الخارج.' },
        { type: 'diagram', id: 'threat-vulnerability-risk', caption: 'افصل بين Threat وVulnerability وRisk وExploit.' },
        { type: 'list', items: [
          '**Intentional Threat**: فعل مقصود لإحداث ضرر.',
          '**Accidental Threat**: خطأ غير مقصود ينتج ضرراً.',
          '**Natural Threat**: ظروف طبيعية مثل الفيضان.',
          '**Environmental Threat**: انقطاع كهرباء أو حريق أو ظروف تشغيل غير مناسبة.',
        ]},
        { type: 'callout', tone: 'tip', title: 'الفكرة الأساسية', text: 'التهديد وحده لا يعني وقوع ضرر؛ الضرر يحدث عندما يلتقي تهديد بضعف قابل للاستغلال في أصل ذي قيمة.' },
      ],
    },
    {
      id: 'packet',
      title: 'Vulnerabilities and Exploits',
      short: 'الضعف والاستغلال',
      blocks: [
        { type: 'paragraph', text: '**Vulnerability** ضعف حقيقي في أصل أو إعداد أو عملية يزيد احتمال تحول تهديد إلى ضرر. أمثلة: كلمات مرور ضعيفة، برمجيات غير محدثة، منافذ غير ضرورية، صلاحيات زائدة، أو اتصال غير مشفر.' },
        { type: 'paragraph', text: 'الفرق المهم: **Threat** هو مصدر الخطر، **Vulnerability** هي نقطة الضعف، **Risk** هو احتمال الضرر وأثره، و**Exploit** هو الوسيلة التي تستغل الضعف. أما **Attack** فهو الفعل نفسه.' },
        { type: 'table', headers: ['Vulnerability example', 'Affected area', 'Defensive direction'], rows: vulnerabilityRows },
        { type: 'code', label: 'Educational scenario - conceptual flow', language: 'text', code: `Outdated Software\n       |\n       v\nVulnerability Exists\n       |\n       v\nAttacker Uses Exploit\n       |\n       v\nUnauthorized Access\n       |\n       v\nSecurity Impact` },
        { type: 'diagram', id: 'vulnerability-exploit-lifecycle', caption: 'Vulnerability-to-Exploit Lifecycle مع خطوة تخفيف في النهاية.' },
        { type: 'paragraph', text: '**Exploit Code** ليس هو الضعف نفسه؛ الضعف موجود في النظام، والـ Exploit هو طريقة أو كود يستخدم هذا الضعف. في هذا الدرس يُذكر ذلك تعريفياً فقط دون أي خطوات عملية.' },
        { type: 'callout', tone: 'info', title: 'Zero-Day بصورة مبسطة', text: 'Zero-Day Vulnerability هي ضعف غير معروف أو لم تُصدر له إصلاحات بعد وقت اكتشافه. لذلك تهم التحديثات السريعة والمراقبة وتقليل سطح التعرّض.' },
        { type: 'diagram', id: 'exploit-impact', caption: 'اختر نتيجة محتملة لاستغلال ضعف وأثرها على CIA.' },
        { type: 'callout', tone: 'danger', title: 'حدود المثال', text: 'لا يوجد في هذا الدرس كود استغلال أو تعليمات لاختبار أنظمة حقيقية. الهدف فهم السلسلة مفاهيمياً وربطها بالتخفيف.' },
      ],
    },
    {
      id: 'config',
      title: 'Malware',
      short: 'البرمجيات الضارة',
      blocks: [
        { type: 'paragraph', text: '**Malware** اختصار Malicious Software: برنامج مصمم لإحداث ضرر أو تنفيذ نشاط غير مصرح به. لا ننشئ ولا نشرح هنا أي برنامج ضار؛ ندرس التصنيف والسلوك وطرق الوقاية فقط.' },
        { type: 'diagram', id: 'malware-explorer', caption: 'Malware Explorer: اختر النوع واقرأ السلوك والأثر والتخفيف.' },
        { type: 'table', headers: ['Malware', 'Main Behavior', 'Typical Impact'], rows: malwareRows },
        { type: 'diagram', id: 'virus-worm-trojan', caption: 'الفرق بين Virus وWorm وTrojan — أكثر الأنواع التباساً.' },
        { type: 'list', items: [
          '**Virus** يحتاج غالباً إلى ملف أو برنامج مضيف وينتشر عند تشغيل الملف المصاب.',
          '**Worm** ينتشر ذاتياً عبر الشبكة وقد يسبب congestion.',
          '**Trojan** يتنكر في صورة برنامج شرعي ليخدع المستخدم بتشغيله.',
        ]},
        { type: 'diagram', id: 'ransomware-lifecycle', caption: 'Ransomware Lifecycle كسلسلة مفاهيمية مع الاستجابة والتعافي.' },
        { type: 'paragraph', text: '**Rootkit** يحاول إخفاء المكونات الضارة، و**Spyware** يجمع معلومات دون موافقة مناسبة، و**Adware** يعرض إعلانات غير مرغوب فيها. قد تتداخل الأنواع في حادث واحد.' },
        { type: 'callout', tone: 'warning', title: 'الدفاع أولاً', text: 'التحديثات ومكافحة البرمجيات الضارة والنسخ الاحتياطي النظيف وتقليل الصلاحيات كلها تقلل الاحتمال والأثر، دون الحاجة إلى أي محاولة تنفيذية ضارة.' },
      ],
    },
    {
      id: 'verify',
      title: 'Common Network Attacks and Their Impact',
      short: 'الهجمات الشائعة',
      blocks: [
        { type: 'paragraph', text: 'ترتبط الهجمات بالتهديدات والضعف والـ Malware. الهدف هنا فهم الخطر مفاهيمياً وربطه بـ CIA Triad وطرق الدفاع، وليس تعليم تنفيذ أي هجوم.' },
        { type: 'diagram', id: 'dos-vs-ddos', caption: 'DoS مقابل DDoS من حيث عدد المصادر والتأثير الدفاعي.' },
        { type: 'paragraph', text: '**DoS** يأتي من مصدر أو عدد محدود من المصادر، بينما **DDoS** يأتي من مصادر متعددة موزعة. كلاهما يهدد أساساً **Availability**.' },
        { type: 'diagram', id: 'man-in-the-middle', caption: 'Client -------- Attacker -------- Server — تمثيل مفاهيمي فقط.' },
        { type: 'table', headers: ['Attack', 'Concept', 'Main target / CIA', 'Possible defense'], rows: attackRows },
        { type: 'list', items: [
          '**Phishing** و**Social Engineering** يستهدفان المستخدمين وغالباً Confidentiality.',
          '**Spoofing** و**Eavesdropping** يرتبطان بالهوية والسرية.',
          '**Password Attacks** تستهدف الحسابات؛ MFA وكلمات المرور القوية تقلل الخطر.',
        ]},
        { type: 'callout', tone: 'danger', title: 'ملاحظة أخلاقية', text: 'كل الرسوم والأمثلة هنا تعليمية ودفاعية. لا تُعرض خطوات لتنفيذ DoS أو MitM أو أي هجوم حقيقي.' },
      ],
    },
    {
      id: 'mistakes',
      title: 'CIA Triad',
      short: 'مثلث CIA',
      blocks: [
        { type: 'paragraph', text: '**CIA Triad** ثلاثة أهداف أمنية أساسية: Confidentiality وIntegrity وAvailability. بعض الحوادث يؤثر على أكثر من هدف في نفس الوقت.' },
        { type: 'diagram', id: 'cia-triad-diagram', caption: 'اضغط على Confidentiality أو Integrity أو Availability لعرض التعريف والضوابط.' },
        { type: 'table', headers: ['Principle', 'Main Goal', 'Example controls'], rows: ciaRows },
        { type: 'diagram', id: 'confidentiality-controls', caption: 'Confidentiality Controls — منع الإفشاء غير المصرح.' },
        { type: 'paragraph', text: 'مثال: منع مستخدم غير مصرح من قراءة ملفات الشركة، واستخدام Encryption لحماية البيانات أثناء النقل.' },
        { type: 'diagram', id: 'integrity-controls', caption: 'Integrity Controls — اكتشاف التعديل غير المصرح.' },
        { type: 'paragraph', text: 'مثال: التأكد أن Configuration File لم يتغير، أو اكتشاف تلاعب في البيانات باستخدام Hashing أو Digital Signatures تعريفياً.' },
        { type: 'diagram', id: 'availability-controls', caption: 'Availability Controls — إبقاء الخدمات متاحة.' },
        { type: 'paragraph', text: 'مثال: Backup Router وRedundant Links والاستعادة بعد حادث Ransomware وحماية الخدمة من DoS.' },
        { type: 'callout', tone: 'info', title: 'أمثلة سريعة', text: 'Data Theft → Confidentiality. Data Tampering → Integrity. DDoS → Availability. Ransomware → Availability أساساً وقد تؤثر على Confidentiality أيضاً.' },
      ],
    },
    {
      id: 'lab',
      title: 'Security Mitigation Techniques',
      short: 'التخفيف',
      blocks: [
        { type: 'paragraph', text: '**Mitigation** يعني تقليل احتمال الضرر أو أثره. لا يقتصر الأمر على منع الحادث؛ بل يشمل الاكتشاف والاستجابة والتحسين المستمر.' },
        { type: 'table', headers: ['Approach', 'Purpose', 'Examples'], rows: preventionDetectionRows },
        { type: 'paragraph', text: '**Access Control**: Strong Authentication وAuthorization وLeast Privilege وRole-Based Access وتقييد الوصول الإداري.' },
        { type: 'table', headers: ['Control', 'Purpose'], rows: accessControlRows },
        { type: 'paragraph', text: 'حماية إضافية: Firewalls وACLs وNetwork Segmentation وSecure Management Protocols وتعطيل الخدمات والمنافذ غير المستخدمة.' },
        { type: 'table', headers: ['Area', 'Defensive direction'], rows: protectionRows },
        { type: 'diagram', id: 'defense-in-depth', caption: 'Defense in Depth — طبقات متعددة بدل الاعتماد على Firewall واحد.' },
        { type: 'diagram', id: 'threat-mitigation-mapping', caption: 'اختر تهديداً وحدد الضوابط الدفاعية الأنسب.' },
        { type: 'table', headers: ['Threat', 'Possible Mitigation'], rows: threatMitigationRows },
        { type: 'diagram', id: 'security-incident-lifecycle', caption: 'دورة حياة الحادث الأمني من Identify إلى Lessons Learned.' },
        { type: 'callout', tone: 'tip', title: 'قاعدة عملية', text: 'طبّق أكثر من طبقة، واجعل الصلاحيات بقدر الحاجة، وراجع السجلات، واحتفظ بنسخ احتياطية نظيفة، ودرّب المستخدمين على الإبلاغ.' },
      ],
    },
    {
      id: 'exam',
      title: 'Hands-on Labs (Simulation)',
      short: 'Labs',
      blocks: [
        { type: 'paragraph', text: '**Labs (Interactive Simulation / Conceptual — ليست تنفيذ هجمات أو Malware حقيقي)**' },

        { type: 'paragraph', text: '**Lab 1 — Identify Threats and Vulnerabilities**' },
        { type: 'code', label: 'Lab 1 scenario - educational', language: 'text', code: `             Internet\n                |\n             Firewall\n                |\n             Router\n                |\n             Switch\n          /    |     \\\n         /     |      \\\n      Users  Server   Wireless` },
        { type: 'steps', items: [
          { title: 'Objectives', text: 'تحديد الأصول والتهديدات والضعف، وتقدير الأثر واقتراح التخفيف وترتيب الأولويات.' },
          { title: 'Scenario', text: 'شركة لديها Internet وFirewall وRouter وSwitch وUsers وServer وWireless.' },
          { title: 'Initial State', text: 'Security Assessment يظهر: Weak Passwords، Outdated Software، Unsecured Wireless Network، Unnecessary Open Services، Excessive User Privileges، Missing Security Updates.' },
          { title: 'Task 1 — Identify Assets', text: 'استخدم Assets Explorer وارصد الأجهزة والخادم والمستخدمين والبيانات.' },
          { title: 'Task 2 — Identify Threats', text: 'استخدم Threat Explorer لربط تهديدات داخلية وخارجية وبشرية وتقنية وفق السياق التعليمي.' },
          { title: 'Task 3 — Identify Vulnerabilities', text: 'اربط كل ضعف بالأصل المتأثر وبالفئة المناسبة.' },
          { title: 'Task 4 — Estimate Impact', text: 'حدد أي مبدأ CIA يتأثر غالباً بكل ضعف.' },
          { title: 'Task 5 — Suggest Mitigation', text: 'استخدم Threat-to-Mitigation Mapping لاختيار الضوابط.' },
          { title: 'Task 6 — Prioritize', text: 'رتّب المخاطر حسب الاحتمال والأثر، وابدأ بنقاط الضعف ذات الأثر الأعلى.' },
          { title: 'Hints', text: 'اسأل: من يملك الصلاحية؟ ما الذي يمكن الوصول إليه؟ هل يوجد بديل أو نسخة احتياطية؟' },
          { title: 'Verification', text: 'كل ضعف يجب أن يكون مرتبطاً بأصل وتهديد وضابط دفاعي واحد على الأقل.' },
          { title: 'Expected Results', text: 'خريطة مرتبة Assets → Threats → Vulnerabilities → Impact → Mitigation.' },
          { title: 'Explanation', text: 'الضعف لا يتحول إلى حادث إلا عند التقائه بتهديد؛ ترتيب الأولويات يقلل المخاطر بشكل عملي.' },
          { title: 'Discussion Challenge', text: 'أي أخطر: كلمة مرور ضعيفة لمستخدم عادي أم صلاحيات إدارية زائدة؟ ولماذا؟' },
        ]},
        { type: 'diagram', id: 'threat-mitigation-mapping', caption: 'أداة Lab 1 لربط التهديد بالتخفيف.' },

        { type: 'paragraph', text: '**Lab 2 — Malware and Attack Classification**' },
        { type: 'steps', items: [
          { title: 'Objectives', text: 'تصنيف السيناريوهات إلى Malware أو Attack وتحديد الأصل والتأثير والدفاع.' },
          { title: 'Scenario', text: 'مجموعة مواقف تعليمية: ملف يعدّل ملفات أخرى، برنامج ينتشر وحده، برنامج مزيف يسرق بيانات دخول، تشفير ملفات الشركة، مراقبة نشاط المستخدم، اعتراض اتصال، ومصادر متعددة تغمر خادماً.' },
          { title: 'Initial State', text: 'لا يوجد تصنيف بعد؛ الطالب يختار النوع من Malware Explorer ثم يراجع النتيجة.' },
          { title: 'Task 1 — Classify', text: 'اختر Virus أو Worm أو Trojan أو Ransomware أو Spyware أو MitM أو DDoS حسب السلوك.' },
          { title: 'Task 2 — Explain Behavior', text: 'اذكر السلوك الجوهري الذي ميّز اختيارك.' },
          { title: 'Task 3 — Affected Asset', text: 'حدد الجهاز أو البيانات أو الخدمة أو المستخدم المتأثر.' },
          { title: 'Task 4 — CIA Impact', text: 'حدد المبدأ الأساسي والمبدأ الإضافي باستخدام CIA Impact Analyzer.' },
          { title: 'Task 5 — Defensive Measures', text: 'اختر التخفيف المناسب من Threat-to-Mitigation Mapping.' },
          { title: 'Hints', text: 'اسأل: هل يحتاج ملفاً مضيفاً؟ هل ينتشر وحده؟ هل يتنكر؟ هل يمنع الوصول؟' },
          { title: 'Verification', text: 'راجع أن كل سيناريو له تصنيف واحد صحيح وأثر CIA منطقي.' },
          { title: 'Expected Results', text: 'تصنيف صحيح لسبعة سيناريوهات مع دفاع مناسب لكل منها.' },
          { title: 'Explanation', text: 'الفرق بين Virus وWorm وTrojan يعتمد على طريقة الانتشار والخداع، لا على الاسم فقط.' },
          { title: 'Discussion Challenge', text: 'لماذا قد يؤثر Ransomware على Availability وConfidentiality معاً؟' },
        ]},
        { type: 'diagram', id: 'malware-explorer', caption: 'أداة Lab 2 لتصنيف البرمجيات الضارة.' },

        { type: 'paragraph', text: '**Lab 3 — CIA Triad and Mitigation Challenge**' },
        { type: 'steps', items: [
          { title: 'Objectives', text: 'تحليل سيناريوهات وتحديد مبدأ CIA الأساسي والإضافي والضوابط المناسبة.' },
          { title: 'Scenario', text: 'مواقف: مستخدم غير مصرح يقرأ ملفات سرية، مهاجم يعدّل Configuration Files، DDoS يجعل الموقع غير متاح، موظف يحذف بيانات مهمة، Ransomware يشفر مستندات العمل.' },
          { title: 'Initial State', text: 'المواقف غير مصنفة؛ الطالب يستخدم CIA Impact Analyzer.' },
          { title: 'Task 1 — Main Principle', text: 'اختر Confidentiality أو Integrity أو Availability لكل موقف.' },
          { title: 'Task 2 — Additional Principle', text: 'حدد إن كان هناك أثر إضافي محتمل.' },
          { title: 'Task 3 — Security Controls', text: 'اختر من Authentication وAuthorization وEncryption وHashing وBackups وRedundancy وMonitoring وAwareness.' },
          { title: 'Task 4 — Explain', text: 'اشرح كيف يقلل كل ضابط من الأثر أو احتمال الحدوث.' },
          { title: 'Task 5 — Verify', text: 'راجع الاقتراح مع Defense-in-Depth وتأكد من وجود أكثر من طبقة.' },
          { title: 'Hints', text: 'اسأل: هل المشكلة قراءة؟ تعديل؟ توقف خدمة؟' },
          { title: 'Verification', text: 'كل موقف له مبدأ أساسي وضابط دفاعي واحد على الأقل.' },
          { title: 'Expected Results', text: 'تحليل CIA كامل وخطة تخفيف متعددة الطبقات لكل سيناريو.' },
          { title: 'Explanation', text: 'التصنيف الصحيح يساعد في اختيار الضابط؛ الضوابط المتعددة تحمي أكثر من ضابط واحد.' },
          { title: 'Discussion Challenge', text: 'لماذا لا تكفي طبقة واحدة مثل Firewall لحماية البيانات نفسها؟' },
        ]},
        { type: 'diagram', id: 'cia-impact-analyzer', caption: 'أداة Lab 3 لتحليل أثر الحادث على CIA.' },
        { type: 'callout', tone: 'warning', title: 'Simulation boundary', text: 'المعامل الثلاثة تحليل تعليمي تفاعلي؛ لم يُنفَّذ أي هجوم أو برنامج ضار، ولا تُعرض نتائج أجهزة حقيقية.' },
      ],
    },
    {
      id: 'summary',
      title: 'Summary & CCNA Exam Quiz',
      short: 'ملخص واختبار',
      blocks: [
        { type: 'paragraph', text: '**Security Fundamentals:** Asset هو ما نحميه، Threat مصدر الخطر، Vulnerability نقطة الضعف، Risk احتمال وأثر الضرر، Exploit وسيلة استغلال الضعف، Attack الفعل، Impact النتيجة.' },
        { type: 'paragraph', text: '**Threats:** internal وexternal وhuman وtechnical وphysical وaccidental وintentional وnatural/environmental.' },
        { type: 'paragraph', text: '**Malware:** virus وworm وTrojan وransomware وspyware وadware وrootkit.' },
        { type: 'paragraph', text: '**Common attacks:** DoS وDDoS وMitM وphishing وspoofing وeavesdropping وpassword attacks وunauthorized access وsocial engineering.' },
        { type: 'paragraph', text: '**CIA Triad:** Confidentiality تمنع الإفشاء، Integrity تمنع التعديل غير المصرح، Availability تُبقي الخدمات متاحة. التأثير قد يشمل أكثر من عنصر.' },
        { type: 'paragraph', text: '**Mitigation:** authentication وauthorization وencryption وfirewalls وACLs وpatching وantivirus وbackups وmonitoring وsecurity awareness وdefense in depth.' },
        { type: 'table', headers: ['Area', 'Key points'], rows: summaryRows },
        { type: 'paragraph', text: '**اختبار CCNA:** 5 أسئلة، 4 خيارات لكل سؤال، مزيج single-choice وmultiple-select، تعتمد على سيناريوهات. لا تظهر الإجابة قبل Submit.' },
        { type: 'quiz', questions: [
          {
            id: 'q1',
            prompt: 'A company runs an old internet-facing application. Security engineers confirm a known weakness exists in that application. Which security term best describes the weakness itself?',
            options: ['Threat', 'Vulnerability', 'Exploit', 'Risk'],
            correctIndex: 1,
            requireSubmit: true,
            explanation: 'الصح هو **(B)**. الضعف الموجود في التطبيق هو Vulnerability. التهديد هو مصدر الخطر، والـ Exploit هو وسيلة استخدام الضعف، والـ Risk يجمع الاحتمال والأثر.',
          },
          {
            id: 'q2',
            kind: 'multiple',
            prompt: 'An employee cannot open company documents. A message demands payment to restore access. Which statements are correct? (Choose more than one.)',
            options: [
              'This scenario is consistent with ransomware affecting availability.',
              'Clean, tested backups can support recovery.',
              'Payment always guarantees that access will be restored safely.',
              'Endpoint protection and patching can reduce the likelihood of such an incident.',
            ],
            correctIndices: [0, 1, 3],
            requireSubmit: true,
            explanation: 'الصح هو **(A) و(B) و(D)**. دفع الفدية لا يضمن استعادة آمنة، لذلك الخيار (C) خاطئ. النسخ الاحتياطي النظيف والوقاية مهمان.',
          },
          {
            id: 'q3',
            prompt: 'A user downloads what appears to be a legitimate utility. After running it, the program quietly records activity and sends information out. Which malware category best fits the disguise used in this scenario?',
            options: ['Virus', 'Worm', 'Trojan Horse', 'Ransomware'],
            correctIndex: 2,
            requireSubmit: true,
            explanation: 'الصح هو **(C)**. Trojan Horse يتنكر في صورة برنامج شرعي ليخدع المستخدم بتشغيله؛ قد تتداخل وظائف أخرى مثل التجسس معه.',
          },
          {
            id: 'q4',
            kind: 'multiple',
            prompt: 'A public website becomes unreachable because many distributed sources generate traffic at the same time. Confidential records remain unchanged. Which statements are correct? (Choose more than one.)',
            options: [
              'The scenario matches a distributed denial-of-service condition.',
              'Availability is the primary CIA principle affected.',
              'Encryption alone reliably prevents this type of traffic flood.',
              'Filtering, rate limiting and resilience can help protect the service.',
            ],
            correctIndices: [0, 1, 3],
            requireSubmit: true,
            explanation: 'الصح هو **(A) و(B) و(D)**. التشفير يحمي السرية لكنه لا يمنع وحده إغراق الخدمة، لذا الخيار (C) خاطئ.',
          },
          {
            id: 'q5',
            kind: 'multiple',
            prompt: 'An account with excessive privileges is used to read confidential files. Audit logs show that some records were also changed. Which statements are correct? (Choose more than one.)',
            options: [
              'Confidentiality is affected by unauthorized reading of confidential files.',
              'Integrity is affected because records were changed without approval.',
              'Least privilege and access control are useful mitigations.',
              'Availability is always the primary principle in this scenario.',
            ],
            correctIndices: [0, 1, 2],
            requireSubmit: true,
            explanation: 'الصح هو **(A) و(B) و(C)**. التوفر ليس هنا الأثر الأساسي؛ حادث واحد قد يؤثر على أكثر من مبدأ في CIA Triad.',
          },
        ]},
      ],
    },
  ],
}
