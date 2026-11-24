import type { Lesson } from '../types'

const aaaRows: string[][] = [
  ['Identification', 'Claim an identity', 'Username entered at a login prompt'],
  ['Authentication', 'Prove the claimed identity', 'Password, OTP, security key, fingerprint'],
  ['Authorization', 'Decide what is allowed after identity is proven', 'Roles, permissions, privilege levels'],
]

const strengthRows: string[][] = [
  ['Password length', 'More characters increase the search space', 'Long values are harder to guess, if not predictable'],
  ['Complexity', 'Mixed character types can help', 'Not a guarantee; symbols alone do not make a weak word strong'],
  ['Entropy', 'How unpredictable the value really is', 'Dictionary words have low entropy even when fairly long'],
  ['Passphrase', 'Long phrase made of memorable words', 'Easy to remember, hard to guess, when unique per account'],
]

const attackRows: string[][] = [
  ['Dictionary attack', 'Tries common words and expected patterns', 'Use unpredictable, long, unique values'],
  ['Brute-force attack', 'Tries many combinations systematically', 'Length and entropy make this impractically slow'],
  ['Credential stuffing', 'Reuses leaked usernames and passwords elsewhere', 'Unique password per service plus MFA'],
  ['Rate limiting / lockout', 'Slows repeated guessing attempts', 'Aggressive lockout can be abused to deny service'],
]

const managerVsTraditionalRows: string[][] = [
  ['Where values are kept', 'Encrypted vault protected by a master password', 'Memorized, written down, or reused values'],
  ['Uniqueness', 'Generates a different value for every service', 'Often the same value reused on many services'],
  ['Predictability', 'Random generation, high entropy', 'Often based on names, words, dates or sequences'],
  ['Exposure risk', 'Protects many accounts if the vault and master password are strong', 'One leaked account can unlock many others'],
  ['Important caveat', 'An unprotected vault is a single point of failure', 'Weak or shared values are easy to guess or steal'],
]

const factorRows: string[][] = [
  ['Something you know', 'Password, PIN', 'Information the user remembers', 'Can be guessed, phished or forgotten'],
  ['Something you have', 'Hardware key, authenticator app, smart card', 'An item or device the user possesses', 'Can be lost or stolen'],
  ['Something you are', 'Fingerprint, face, iris, voice', 'A biometric characteristic of the user', 'Cannot be reissued like a password'],
]

const sfaRows: string[][] = [
  ['SFA', 'One factor category', 'Password only', 'Single point of failure'],
  ['2FA', 'Two different factor categories', 'Password + OTP app code', 'A special case of MFA'],
  ['MFA', 'Two or more different factor categories', 'PIN + smart card + fingerprint', 'Stronger layered authentication'],
  ['Two passwords', 'Still only one category', 'Password followed by a second password', 'Not MFA — both are "something you know"'],
]

const mfaMethodRows: string[][] = [
  ['SMS OTP', 'Easy for users, no extra app', 'SIM swapping and interception risk', 'Avoid for sensitive administrative accounts'],
  ['Email OTP', 'Simple to deliver', 'Compromised mailbox exposes the code', 'Only as an extra layer'],
  ['Authenticator app TOTP', 'Time-based code, no mobile network needed', 'Device loss needs a recovery plan', 'Good general-purpose choice'],
  ['Push notification', 'Fast and convenient', 'Push fatigue and fake approval prompts', 'Use with device and session controls'],
  ['Hardware security key', 'Phishing-resistant, origin-bound signature', 'Cost and device management', 'Preferred for privileged accounts'],
  ['Smart card', 'Combines certificate with PIN', 'Card distribution and readers', 'Common in enterprise environments'],
]

const certComponentRows: string[][] = [
  ['Subject', 'Who the certificate identifies', 'Hostname or organization name'],
  ['Issuer', 'Which CA signed the certificate', 'Used to build the chain of trust'],
  ['Public key', 'Shared key used to verify signatures or encrypt to the owner', 'The private key is never inside the certificate'],
  ['Private key', 'Secret key kept only by the certificate owner', 'Must never be shared or embedded in the certificate'],
  ['Validity period', 'Not before and not after dates', 'Expired certificates are rejected'],
  ['Digital signature', 'CA signature over the certificate data', 'Detects modification of the data'],
  ['Serial number', 'Unique identifier for the certificate', 'Used with revocation information'],
]

const certValidationRows: string[][] = [
  ['Issuer and chain', 'Follow the signing CAs to a trusted root', 'Untrusted or incomplete chain means no trust'],
  ['Validity dates', 'Check current time is inside the validity window', 'Expired or not-yet-valid certificates are rejected'],
  ['Hostname', 'Compare requested name with the certificate', 'Mismatch means the certificate is for another service'],
  ['Revocation', 'Check CRL or OCSP where available', 'A revoked certificate is no longer trusted'],
  ['Key ownership', 'Trust the public key only after validation succeeds', 'The server keeps the matching private key secret'],
]

const biometricMethodRows: string[][] = [
  ['Fingerprint recognition', 'Finger patterns', 'Common on laptops and phones', 'Sensor dirt or injury can cause failed reads'],
  ['Facial recognition', 'Face geometry', 'Fast and convenient', 'Lighting, masks and spoofing attempts matter'],
  ['Iris recognition', 'Iris patterns', 'Highly distinctive', 'More specialized hardware and privacy concerns'],
  ['Voice recognition', 'Voice characteristics', 'Useful in some call flows', 'Noise and recording attacks reduce reliability'],
  ['Behavioral biometrics', 'Typing rhythm, mouse movement as context', 'Adds continuous risk signals', 'Best used as additional context, not sole proof'],
]

const biometricTradeoffRows: string[][] = [
  ['FAR', 'False Acceptance Rate', 'Wrong person accepted', 'Lower it and FRR usually rises'],
  ['FRR', 'False Rejection Rate', 'Right person rejected', 'Lower it and FAR usually rises'],
  ['Liveness detection', 'Checks that the sample comes from a live person', 'Reduces photo or mask spoofing', 'Not perfect — still combine with another factor'],
]

const biometricLimitRows: string[][] = [
  ['Privacy', 'Biometric data is sensitive personal data', 'Collect and store only under approved policy'],
  ['Spoofing', 'Photos, masks or replicas can attempt to fool sensors', 'Liveness detection helps but is not foolproof'],
  ['Environment', 'Light, dirt, noise or injury affects readings', 'Plan alternative authentication methods'],
  ['Not replaceable', 'A fingerprint cannot be reset like a password', 'Protect stored templates carefully'],
  ['Best practice', 'Combine with another factor category', 'Biometrics work best inside MFA'],
]

const summaryFactorRows: string[][] = [
  ['Something you know', 'Password, PIN'],
  ['Something you have', 'Security key, authenticator app, smart card'],
  ['Something you are', 'Fingerprint, face, iris, voice'],
]

const summaryMfaRows: string[][] = [
  ['SMS / Email OTP', 'Convenient', 'Interception, SIM swap, mailbox compromise'],
  ['TOTP app', 'Good balance', 'Needs device recovery plan'],
  ['Push approval', 'Very convenient', 'Push fatigue'],
  ['Hardware key', 'Phishing-resistant', 'Cost and management'],
  ['Smart card', 'Certificate + PIN', 'Infrastructure needed'],
]

const summaryCertRows: string[][] = [
  ['Subject / Issuer', 'Owner and signing CA'],
  ['Public / Private key', 'Shared verification key vs secret key'],
  ['Validity / Signature', 'Dates and CA signature integrity'],
  ['Chain / Revocation', 'Trust path and cancellation status'],
]

const summaryBiometricRows: string[][] = [
  ['Fingerprint / Face / Iris / Voice', 'Convenient "something you are" factor'],
  ['FAR / FRR', 'Wrongly accept vs wrongly reject — adjustable trade-off'],
  ['Limitations', 'Privacy, spoofing, sensors, cannot be reset'],
  ['Best use', 'Combine with a second factor category'],
]

export const topic54Lesson: Lesson = {
  topicId: '5.4',
  title: 'Describe security password policy elements, such as management, complexity, and password alternatives (multifactor authentication, certificates, and biometrics)',
  description:
    'Topic 5.4 يشرح سياسات كلمات المرور: القوة والتعقيد، الإدارة الآمنة، MFA والـ factor categories، digital certificates وPKI، والـ biometrics. الشرح بالعربية المصرية البسيطة مع المصطلحات التقنية بالإنجليزي. كل الأمثلة أنماط وهمية ومفيش كلمات مرور حقيقية.',
  estimatedTime: '~130 دقيقة',
  steps: [
    {
      id: 'what',
      title: 'Why Password Security Matters',
      short: 'ليه أمان كلمات المرور مهم؟',
      blocks: [
        { type: 'paragraph', text: '**Passwords** لسه مستخدمة في كل مكان لأنها سهلة الإنشاء ومعروفة لكل النظم، بس لوحدها مش كفاية. البيانات بتتسرب، والباسورد يتخمّن، والمستخدم يعيد استخدامه في خدمات كتير، فحساب واحد ضعيف ممكن يفتح حسابات تانية.' },
        { type: 'diagram', id: 'ps-overview', caption: 'من السياسة إلى MFA والشهادات والـ biometrics — شوف طبقات الحماية.' },
        { type: 'paragraph', text: 'قبل ما نفهم الحماية، لازم نفرّق بين ثلاث حاجات: **Identification** يعني المستخدم يقول «أنا مين»، و**Authentication** يعني يثبت إنه فعلاً هو، و**Authorization** يعني بعد كده النظام يقرر إيه اللي مسموح له يعمله.' },
        { type: 'diagram', id: 'ps-aaa-concepts', caption: 'Identification وAuthentication وAuthorization — اختر وشوف الفرق.' },
        { type: 'diagram', id: 'ps-access-scenarios', caption: 'أمثلة عملية: workstation، نظام إدارة، وVPN عن بعد.' },
        { type: 'table', headers: ['Concept', 'Question it answers', 'Example'], rows: aaaRows },
        { type: 'list', items: [
          'موظف بيفتح workstation: بيكتب username وpassword، وبعدين النظام بيسمح له بالملفات المصرح لها.',
          'مسؤول شبكة بيدخل management system: الحساب ده حساس لأنه يقدر يغيّر إعدادات أجهزة كتير، فمحتاج عامل تحقق إضافي.',
          'مستخدم بعيد عن المكتب بيتصل بـ VPN: الباسورد لوحده مش كفاية لأن الاتصال بيمر على شبكات مش موثوقة.',
          'التحقق ممكن يعتمد على عامل واحد أو أكتر من فئة مختلفة — وده اللي بنسميه MFA.',
        ]},
        { type: 'callout', tone: 'tip', title: 'نقطة امتحان', text: 'Authentication قبل Authorization. لازم تثبت الهوية الأول، وبعدين تحصل الصلاحيات.' },
      ],
    },
    {
      id: 'how',
      title: 'Password Complexity',
      short: 'إيه اللي بيخلي الباسورد قوي؟',
      blocks: [
        { type: 'paragraph', text: 'الباسورد القوي مش مجرد «Symbols كتير». المهم: **Length**، وعدم التوقع، وإنه يختلف لكل حساب. الخصائص دي بنسميها مجتمعة **Password Complexity**، والدرجة اللي بيكون عليها غير متوقع بتتسمى **Entropy**.' },
        { type: 'diagram', id: 'ps-password-patterns', caption: 'أنماط وهمية: قارن الضعيف بالأقوى.' },
        { type: 'diagram', id: 'ps-length-entropy', caption: 'الطول والcomplexity والـ entropy والـ passphrase.' },
        { type: 'table', headers: ['Idea', 'Meaning', 'Exam takeaway'], rows: strengthRows },
        { type: 'list', items: [
          'تجنّب كلمات القاموس، وأسماء الأشخاص، وتواريخ الميلاد، والتسلسلات زي 123.',
          'ما تستخدمش نفس القيمة في أكتر من خدمة؛ إعادة الاستخدام هي اللي بتمكّن Credential stuffing.',
          'الـ **Passphrase** الطويل والفريد أسهل في التذكر وأصعب في التخمين من كلمة قصيرة فيها رموز.',
          'إضافة رمز أو اتنين لكلمة متوقعة ما بتعملهاش قوية.',
        ]},
        { type: 'diagram', id: 'ps-attack-comparison', caption: 'Dictionary وBrute-force وCredential stuffing — قارن الهجمات.' },
        { type: 'table', headers: ['Attack', 'How it works', 'Main defense'], rows: attackRows },
        { type: 'diagram', id: 'ps-credential-stuffing-flow', caption: 'إزاي تسريب موقع بيؤثر على حسابات تانية.' },
        { type: 'diagram', id: 'ps-rate-limiting', caption: 'Rate limiting وAccount lockout، ومخاطر القفل العدواني.' },
        { type: 'callout', tone: 'warning', title: 'توازن مهم', text: 'تحديد المحاولات و Lockout بيبطّئ التخمين، بس لو السياسة عدوانية جداً المهاجم يقدر يتعمّد يفشل الدخول عشان يقفل حساب مستخدم شرعي — يعني DoS. استخدم حدود معقولة مع تنبيهات وMFA.' },
      ],
    },
    {
      id: 'packet',
      title: 'Password Management',
      short: 'إدارة كلمات المرور بشكل آمن',
      blocks: [
        { type: 'paragraph', text: '**Password reuse** هو إن المستخدم يستخدم نفس القيمة في خدمات متعددة. لو أي خدمة اتسربت، المهاجم يجرب نفس البيانات على الباقي. الحل العملي هو **Password manager** (مدير باسورد) يولّد قيمة فريدة لكل خدمة ويحفظها في **Encrypted vault**.' },
        { type: 'diagram', id: 'ps-management-flow', caption: 'رحلة الإدارة الآمنة من السياسة لحد التخزين في الخادم.' },
        { type: 'diagram', id: 'ps-manager-architecture', caption: 'مكوّنات مدير كلمات المرور والمخاطر.' },
        { type: 'table', headers: ['Aspect', 'Password manager', 'Traditional handling'], rows: managerVsTraditionalRows },
        { type: 'list', items: [
          'الـ vault بيحميه **Master password** قوي جداً؛ لو الباسورد ده ضعيف، كل الحسابات جوه الـ vault في خطر.',
          'ما تشاركش كلمات المرور، وما تكتبهاش داخل source code أو ملفات إعداد عادية.',
          'إعادة التعيين لازم تتحقق من هوية صاحب الحساب عبر قناة موثوقة.',
          'تغيير الباسورد بيحصل عند الشك في تسريب أو طبقاً لسياسة المؤسسة — مش لمجرد تقويم متكرر من غير سبب.',
        ]},
        { type: 'diagram', id: 'ps-secure-handling', caption: 'مشاركة، تخزين، إعادة تعيين، وتجزئة على الخادم.' },
        { type: 'diagram', id: 'ps-hashing-vs-encryption', caption: 'Hash مع salt مقابل التشفير القابل للعكس.' },
        { type: 'callout', tone: 'danger', title: 'Hash مش encryption', text: 'الخادم المفروض يخزّن **hash** مع **salt** فريد لكل حساب، مش الباسورد كنص عادي. الـ hash مش عملية قابلة للعكس بمفتاح زي بعض خوارزميات التشفير. ده مستوى مفاهيمي للامتحان، مش درس متقدم في التشفير.' },
      ],
    },
    {
      id: 'config',
      title: 'Multifactor Authentication (MFA)',
      short: 'المصادقة متعددة العوامل',
      blocks: [
        { type: 'paragraph', text: '**Authentication factors** ثلاث فئات: **Something you know** زي الباسورد أو PIN، و**Something you have** زي security key أو تطبيق المصادقة أو smart card، و**Something you are** زي البصمة أو الوجه. MFA يعني استخدام عاملين أو أكتر من **فئات مختلفة**.' },
        { type: 'diagram', id: 'ps-auth-factors', caption: 'الفئات الثلاثة للأ Factors مع أمثلة.' },
        { type: 'table', headers: ['Factor category', 'Examples', 'What it is', 'Main risk'], rows: factorRows },
        { type: 'diagram', id: 'ps-sfa-2fa-mfa', caption: 'SFA و2FA وMFA — ليه باسوردين مش MFA؟' },
        { type: 'table', headers: ['Mode', 'Factors used', 'Example', 'Meaning'], rows: sfaRows },
        { type: 'callout', tone: 'warning', title: 'قاعدة امتحانية', text: 'خطوتان تحقق مش معناهم MFA لو الاتنين من نفس الفئة. باسورد + باسورد تاني = SFA مرتين، مش عاملين مستقلين.' },
        { type: 'diagram', id: 'ps-mfa-flow', caption: 'خطوات MFA من أول عامل لحد القرار النهائي.' },
        { type: 'paragraph', text: 'الـ flow بسيط: المستخدم بيكتب username وباسورد، النظام يتحقق من العامل الأول، يطلب عامل تاني، المستخدم يقدّم OTP أو يلمس security key، النظام يتحقق منه، وبعدين يسمح أو يرفض الدخول.' },
        { type: 'diagram', id: 'ps-mfa-methods', caption: 'قارن SMS وEmail وTOTP وPush والمفتاح المادي والبطاقة الذكية.' },
        { type: 'table', headers: ['Method', 'Strength', 'Weakness', 'CCNA guidance'], rows: mfaMethodRows },
        { type: 'diagram', id: 'ps-hardware-key-flow', caption: 'Hardware security key وإزاي بيقاوم التصيد.' },
        { type: 'diagram', id: 'ps-phishing-recovery', caption: 'Phishing resistance وSIM swapping وPush fatigue والاستعادة.' },
        { type: 'list', items: [
          'SMS OTP فيه خطر **SIM swapping** واعتراض الرسائل؛ مش نفس قوة المفتاح المادي.',
          '**Phishing-resistant authentication** يعني إن التحقق مرتبط بالموقع الحقيقي، فصفحة تصيدية ما تقدرش تعيد استخدام التوقيع.',
          '**Push fatigue** يعني إن المستخدم يوافق على إشعار مزيف وهو تعبان أو مش منتبه.',
          '**Recovery codes** مهمة عند فقدان الجهاز، بس إجراءات استعادة الحساب لازم تتحقق من الهوية بقوة.',
          'مش كل طرق MFA متساوية في الأمان — الاختيار بيتبع حساسية الحساب.',
        ]},
      ],
    },
    {
      id: 'verify',
      title: 'Digital Certificates and PKI',
      short: 'الشهادات الرقمية وPKI',
      blocks: [
        { type: 'paragraph', text: '**Digital certificate** مستند رقمي بيربط هوية (subject) بـ **public key**، وموقّع من جهة موثوقة اسمها **Certificate Authority (CA)**. المنظومة كلها بتتسمى **Public Key Infrastructure (PKI)**. بتستخدم في TLS عشان العميل يتأكد إنه بيتكلم مع السيرفر الصح.' },
        { type: 'diagram', id: 'ps-pki-architecture', caption: 'مكوّنات PKI: CA والمفتاحين والشهادة وtrust store.' },
        { type: 'table', headers: ['Component', 'Purpose', 'Important detail'], rows: certComponentRows },
        { type: 'callout', tone: 'danger', title: 'المفتاح الخاص مش جوه الشهادة', text: 'الشهادة بتحمل الـ **public key** بس. الـ **private key** يفضل سري عند صاحب الشهادة. لو حد حصل على المفتاح الخاص، الشهادة ما تبقاش دليل على ملكية سليمة.' },
        { type: 'diagram', id: 'ps-ca-hierarchy', caption: 'Root CA يوقّع Intermediate، والـ Intermediate يوقّع شهادة السيرفر.' },
        { type: 'diagram', id: 'ps-certificate-structure', caption: 'محتويات الشهادة — اختر عنصر وشوف وظيفته.' },
        { type: 'diagram', id: 'ps-cert-validation-flow', caption: 'خطوات التحقق من الشهادة في TLS بمستوى CCNA.' },
        { type: 'table', headers: ['Check', 'What to do', 'Failure meaning'], rows: certValidationRows },
        { type: 'diagram', id: 'ps-encryption-vs-signature', caption: 'الفرق بين Encryption وDigital signature والتحقق.' },
        { type: 'paragraph', text: 'العميل بيفحص الـ issuer والسلسلة لحد **trusted root** موجود في **trust store**، ويتأكد من التواريخ واسم المضيف، ويفحص **revocation** زي CRL أو OCSP لو متاح. لو حاجة اتغلطت، الاتصال الآمن ما يكملش. تفاصيل TLS handshake أبعد من نطاق CCNA هنا.' },
      ],
    },
    {
      id: 'mistakes',
      title: 'Biometrics',
      short: 'المصادقة البيومترية',
      blocks: [
        { type: 'paragraph', text: '**Biometrics** يعني التحقق من خاصية جسدية أو سلوكية للمستخدم. الرحلة: **Enrollment** بيحوّل العينة إلى **template**، وقت الدخول بيحصل capture ومطابقة، والنتيجة Accept أو Reject. الـ **liveness detection** بيحاول يمنع الصور والنسخ المقلدة.' },
        { type: 'diagram', id: 'ps-biometric-flow', caption: 'من التسجيل لحد قرار القبول أو الرفض.' },
        { type: 'table', headers: ['Method', 'What it reads', 'Use case', 'Limitation'], rows: biometricMethodRows },
        { type: 'diagram', id: 'ps-biometric-far-frr', caption: 'FAR وFRR والـ threshold — التوازن بين الخطأين.' },
        { type: 'table', headers: ['Concept', 'Meaning', 'Effect', 'Note'], rows: biometricTradeoffRows },
        { type: 'diagram', id: 'ps-biometric-limits', caption: 'الخصوصية والسبوفنج والبيئة وعدم إمكانية تغيير البصمة.' },
        { type: 'list', items: [
          '**FAR** (False Acceptance Rate): النظام يقبل شخص غلط. **FRR** (False Rejection Rate): النظام يرفض الشخص الصح.',
          'تعديل الـ threshold بيقلّل واحد ويزيّد التاني؛ مفيش إعداد مثالي لكل الحالات.',
          'البيانات البيومترية خاصة، والـ template لازم يتخزّن ويحمي حسب سياسة المؤسسة.',
          'البصمة ما تتغيرش زي الباسورد، فتسريبها أثره طويل.',
          'الـ biometrics أفضل ما يكون مع عامل تاني، مش كبديل عن كل الحماية.',
        ]},
        { type: 'table', headers: ['Issue', 'Why it matters', 'Good practice'], rows: biometricLimitRows },
      ],
    },
    {
      id: 'lab',
      title: 'Practical Security Scenarios and Labs',
      short: 'لابرات عملية تفاعلية',
      blocks: [
        { type: 'paragraph', text: '**Labs (Interactive Simulation / Conceptual)**. كل الأنماط هنا وهمية وغالباً placeholders، ومفيش أي كلمة مرور حقيقية أو طلب لإدخال بيانات خاصة. اضغط على الخيارات في كل رسم وجرّب الحالات المختلفة.' },

        { type: 'paragraph', text: '**Lab 1 — Password Strength Assessment**' },
        { type: 'code', label: 'Fictional patterns only - no real credentials', language: 'text', code: '<NAME>123\n<CITY>!2024\n<SHORT>!9\n<LONG_UNIQUE_PHRASE>' },
        { type: 'steps', items: [
          { title: 'Learning objectives', text: 'تحدد الأنماط الضعيفة، وتشرح ليه ضعيفة، وتقارن الطول بالتوقع، وتختار بديل أقوى، وتكتشف خطر إعادة الاستخدام.' },
          { title: 'Scenario', text: 'مراجعة أمنية لأنماط كلمات مرور وهمية لموظفين في شركة. كل النماذج placeholders مش قيم حقيقية.' },
          { title: 'Task 1 — Classify patterns', text: 'افتح رسم Lab 1 واختر Weak أو Strong لكل نموذج. اقرأ التغذية الراجعة بعد كل اختيار.' },
          { title: 'Task 2 — Explain weakness', text: 'اكتب في ملاحظاتك ليه الاسم + 123 والكلمة + السنة ضعيفين، وليه الرموز لوحدها ما تكفيش.' },
          { title: 'Task 3 — Compare alternatives', text: 'قارن `<SHORT>!9` بـ `<LONG_UNIQUE_PHRASE>` من ناحية الطول والتوقع.' },
          { title: 'Task 4 — Reuse risk', text: 'في الحالة الأخيرة، اختر Reuse risk واذكر إن تسريب خدمة واحدة بيؤثر على حسابات تانية.' },
          { title: 'Hint', text: 'اسأل دايماً: هل المحتوى متوقع؟ وهل نفس القيمة مستخدمة في مكان تاني؟' },
          { title: 'Solution / explanation', text: 'الأنماط المعتمدة على معلومات شخصية أو قواميس أو تسلسلات ضعيفة. العبارة الطويلة الفريدة أقوى. إعادة الاستخدام بتمكّن Credential stuffing.' },
          { title: 'Completion criteria', text: 'صنّفت كل الحالات صح، وقدرت تعلّل الاختيار بمصطلحات Length وEntropy وUniqueness.' },
        ]},
        { type: 'diagram', id: 'ps-lab-password-strength', caption: 'Lab 1 — اختر Weak أو Strong لكل حالة واقرأ السبب.' },

        { type: 'paragraph', text: '**Lab 2 — Choose the Right MFA Method**' },
        { type: 'steps', items: [
          { title: 'Learning objectives', text: 'تختار طريقة MFA مناسبة لكل سيناريو، وتشرح المقايضة الأمنية، وتتعامل مع فقدان الجهاز وأخطاء الموافقة.' },
          { title: 'Scenario', text: 'أربع حالات: موظف بعيد عن المكتب، مسؤول شبكة، فقدان جهاز مصادقة، وإشعار موافقة مش متوقع.' },
          { title: 'Task 1 — Remote employee', text: 'اختر Authenticator app TOTP وعلّل ليه أقوى من SMS في السياق ده.' },
          { title: 'Task 2 — Administrator', text: 'اختر Hardware security key واربط الإجابة بمقاومة التصيد.' },
          { title: 'Task 3 — Lost device', text: 'اختر Recovery codes مع تحقق قوي من الهوية.' },
          { title: 'Task 4 — Approval prompt', text: 'حدد خطر Push fatigue، وراجع الفرق بينه وبين التوقيع المرتبط بالموقع.' },
          { title: 'Hint', text: 'الحسابات الإدارية محتاجة أعلى مستوى؛ والمستخدم العادي محتاج توازن بين الأمان والراحة.' },
          { title: 'Solution / explanation', text: 'TOTP توازن جيد، والمفتاح المادي أنسب للصلاحيات العالية، والاستعادة لازم تتأكد من الهوية، والموافقة بالدفع ممكن التعرض للخداع.' },
          { title: 'Completion criteria', text: 'اخترت أربع إجابات وحسنت تبرير كل واحدة بمصطلح من المصطلحات المذكورة في الدرس.' },
        ]},
        { type: 'diagram', id: 'ps-lab-mfa-choice', caption: 'Lab 2 — تنقّل بين الحالات واختر أنسب طريقة.' },

        { type: 'paragraph', text: '**Lab 3 — Digital Certificate Validation**' },
        { type: 'steps', items: [
          { title: 'Learning objectives', text: 'تقرر Trust أو Reject في ست حالات، وتشرح سبب القرار باستخدام chain وdates وhostname وrevocation.' },
          { title: 'Scenario', text: 'عميل بيتصل بخادم، وممكن تظهر أخطاء مختلفة في الشهادة.' },
          { title: 'Task 1 — Valid case', text: 'اختر Trust لما يكون المُصدِر موثوق والتواريخ والاسم تمام.' },
          { title: 'Task 2 — Problem cases', text: 'راجعExpired وUntrusted issuer وHostname mismatch وMissing intermediate وRevoked، واختر Reject لكل حالة.' },
          { title: 'Task 3 — Explain', text: 'لكل حالة اكتب إيه الفحص اللي فشل بالظبط.' },
          { title: 'Task 4 — Key ownership', text: 'أكد إن الشهادة فيها المفتاح العام بس، والمفتاح الخاص عند السيرفر.' },
          { title: 'Hint', text: 'الشهادة لازم تعدّي كل الفحوصات، أي فحص يفشل يكفي للرفض.' },
          { title: 'Solution / explanation', text: 'الثقة ما بتتحققش إلا بسلسلة كاملة لجذر موثوق، وتواريخ سليمة، واسم مطابق، وحالة غير ملغاة.' },
          { title: 'Completion criteria', text: 'قررت صح في كل الحالات الستة وعلّلت كل قرار باسم الفحص المناسب.' },
        ]},
        { type: 'diagram', id: 'ps-lab-cert-validation', caption: 'Lab 3 — راجع كل حالة واختر Trust أو Reject.' },
        { type: 'callout', tone: 'warning', title: 'Simulation boundary', text: 'اللابرات دي تعليمية وتفاعلية داخل الصفحة، مش اختبار فعلي على شهادات حقيقية أو أجهزة. مفيش أي بيانات سرية مطلوبة.' },
      ],
    },
    {
      id: 'exam',
      title: 'CCNA Exam Quiz',
      short: 'اختبار CCNA',
      blocks: [
        { type: 'paragraph', text: '**اختبار CCNA:** 5 أسئلة، 4 خيارات لكل سؤال، مزيج من single وmultiple. مفيش إجابة قبل ما تضغط Submit.' },
        { type: 'quiz', questions: [
          {
            id: 'q1',
            prompt: 'A security review finds four fictional password patterns: <NAME>123, <CITY>!2024, <SHORT>!9, and a long unique passphrase stored in a password manager. Which option is the strongest practice?',
            options: [
              'Use <NAME>123 because it is easy to remember.',
              'Use <SHORT>!9 because symbols make any password strong.',
              'Use a long unique passphrase generated and stored by a password manager.',
              'Use <CITY>!2024 and change it every week.',
            ],
            correctIndex: 2,
            requireSubmit: true,
            explanation: 'الصح هو **(C)**: الطول والتفرد وعدم التوقع أهم من إضافة Symbols، والمدير بيولّد قيمة مختلفة لكل حساب. (A) غلط لأن الاسم وتسلسل الأرقام متوقعان. (B) غلط لأن القصر يضعف الباسورد حتى مع Symbols. (D) غلط لأن كلمة القاموس والسنة متوقعة، والتغيير الأسبوعي لوحده مش بديل عن القوة والتفرد.',
          },
          {
            id: 'q2',
            kind: 'multiple',
            prompt: 'Which statements about secure password management are correct? (Choose more than one.)',
            options: [
              'Reusing one strong password across services creates credential stuffing risk.',
              'A password manager can generate unique values and store them in an encrypted vault.',
              'Servers should store a salted hash rather than plaintext passwords.',
              'Frequent rotation alone is the main control, so password changes need no policy.',
            ],
            correctIndices: [0, 1, 2],
            requireSubmit: true,
            explanation: 'الصح هو **(A) و(B) و(C)**. (D) غلط لأن التغيير لازم يكون مرتبط بتسريب أو تعرض أو سياسة المؤسسة، مش مجرد تقويم متكرر. كمان الـ vault نفسه لازم يتحمي بـ master password قوي.',
          },
          {
            id: 'q3',
            kind: 'multiple',
            prompt: 'Which authentication setups correctly use multiple factor categories? (Choose more than one.)',
            options: [
              'A password followed by a second different password.',
              'A PIN plus a hardware security key.',
              'A smart card plus a PIN.',
              'A username and a password.',
            ],
            correctIndices: [1, 2],
            requireSubmit: true,
            explanation: 'الصح هو **(B) و(C)**: PIN «something you know» مع مفتاح أو بطاقة «something you have». (A) غلط لأن الباسوردين نفس الفئة. (D) غلط لأن username مش عامل تحقق، والباسورد عامل واحد فقط.',
          },
          {
            id: 'q4',
            prompt: 'A user connects to a management portal. The server presents a certificate, but the hostname does not match the name in the certificate. What should the client do?',
            options: [
              'Trust it, because a valid CA signature removes all other checks.',
              'Reject it, because hostname validation is part of certificate validation.',
              'Trust it, because the certificate contains the server private key.',
              'Ignore certificate checks and continue with encryption only.',
            ],
            correctIndex: 1,
            requireSubmit: true,
            explanation: 'الصح هو **(B)**: فحص الاسم جزء من التحقق، وأي فحص يفشل يمنع الثقة. (A) غلط لأن التوقيع لوحده مش كفاية. (C) غلط لأن الشهادة ما تحتويش المفتاح الخاص. (D) غلط لأن التشفير من غير تحقق هوية ما بيحميش من انتحال السيرفر.',
          },
          {
            id: 'q5',
            kind: 'multiple',
            prompt: 'Which statements about biometrics are correct? (Choose more than one.)',
            options: [
              'Lowering FAR can increase FRR, so the threshold is a trade-off.',
              'Biometric templates and enrollment data need privacy protection.',
              'Liveness detection makes biometric authentication completely foolproof.',
              'Biometrics are strongest when combined with another factor category.',
            ],
            correctIndices: [0, 1, 3],
            requireSubmit: true,
            explanation: 'الصح هو **(A) و(B) و(D)**. (C) غلط لأن الـ liveness detection بيقلّل السبوفنج بس مش بيمنعه تماماً، والبيومترات ليها FAR وFRR ومخاطر خصوصية، وما تتغيرش زي الباسورد.',
          },
        ]},
      ],
    },
    {
      id: 'summary',
      title: 'Summary and Key Takeaways',
      short: 'ملخص ونقاط للمراجعة',
      blocks: [
        { type: 'paragraph', text: 'Password Security يعني سياسة واضحة للقوة، وإدارة آمنة، وبدائل أقوى من الباسورد لوحده: MFA وشهادات رقمية وbiometrics. كل حل ليه حدود، والقوة في الجمع بين طبقات مناسبة.' },
        { type: 'paragraph', text: '**Authentication factors:**' },
        { type: 'table', headers: ['Category', 'Examples'], rows: summaryFactorRows },
        { type: 'paragraph', text: '**MFA method comparison:**' },
        { type: 'table', headers: ['Method', 'Advantage', 'Main limitation'], rows: summaryMfaRows },
        { type: 'paragraph', text: '**Password manager vs traditional handling:**' },
        { type: 'table', headers: ['Aspect', 'Password manager', 'Traditional handling'], rows: managerVsTraditionalRows },
        { type: 'paragraph', text: '**Digital certificate components:**' },
        { type: 'table', headers: ['Component', 'Meaning'], rows: summaryCertRows },
        { type: 'paragraph', text: '**Biometric authentication:**' },
        { type: 'table', headers: ['Topic', 'Key point'], rows: summaryBiometricRows },
        { type: 'list', items: [
          'قوة الباسورد: طول + عدم توقع + تفرد، مش Symbols بس.',
          'الإدارة الآمنة: vault مشفّر، master password قوي، وتخزين hash مع salt على الخادم.',
          'MFA لازم يستخدم فئات مختلفة؛ باسوردين مش عاملين مستقلين.',
          'الشهادة بتحمل public key، والمفتاح الخاص سري؛ التحقق يشمل السلسلة والتواريخ والاسم والإلغاء.',
          'الـ biometrics ليها FAR وFRR وقيود خصوصية، ويفضل تتجمع مع عامل تاني.',
        ]},
        { type: 'diagram', id: 'ps-layered-auth', caption: 'الصورة الكاملة: باسورد وإدارة وMFA وشهادة وbiometric في طبقة واحدة.' },
        { type: 'callout', tone: 'tip', title: 'CCNA revision checklist', text: '١) عرّف Identification وAuthentication وAuthorization. ٢) اشرح Length وEntropy والـ passphrase. ٣) اذكر Reuse وsalted hash والـ vault. ٤) فرّق SFA و2FA وMFA. ٥) قارن SMS وTOTP والمفتاح المادي. ٦) اشرح chain of trust والفحوصات. ٧) اذكر FAR وFRR وlimitations الـ biometrics.' },
      ],
    },
  ],
}
