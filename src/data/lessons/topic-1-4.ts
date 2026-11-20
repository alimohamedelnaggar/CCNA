import type { Lesson } from '../types'

export const topic14Lesson: Lesson = {
  topicId: '1.4',
  title: 'تحديد مشاكل الواجهة والكابل',
  description:
    'في الدرس ده هنتعلّم نقرأ حالة الواجهة والعدّادات عشان نفرّق بين مشكلة كابل، إعداد speed أو duplex، هاردوير، و congestion. هشوف collisions و CRC و late collisions إزاي بيظهروا، وأمثلة على أوامر Cisco IOS، ولاب Packet Tracer، وخمسة أسئلة بصيغة CCNA.',
  estimatedTime: '~65 دقيقة',
  steps: [
    {
      id: 'what',
      title: 'إيه اللي إحنا بندرسه وليه وجوده مهم؟',
      short: 'مفهوم الدرس',
      blocks: [
        {
          type: 'paragraph',
          text: 'في الموضوع 1.3 اخترنا الكابل والواجهة الصح. دلوقتي السؤال العملي: **لو الشبكة بطيئة أو الـ ping بيقطع، نفهم المشكلة منين؟** الإجابة هي `Network Interface Troubleshooting`: نقرأ حالة الـ interface وعدد الأخطاء عليها، ونربط بين العَرَض والسبب الفيزيائي أو الإعدادي.',
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'مكان الدرس في الـ blueprint',
          text: 'الموضوع ده هو Objective `1.4` في دومين `Network Fundamentals`: تحديد مشاكل الواجهة والكابل — `collisions`, `errors`, `mismatch duplex`, و/أو `speed`. الامتحان بيجيب سيناريوهات فيها مخرجات `show`، عدّادات متزايدة، أو وصف عرض مروري ومطلوب منك تحدد الخطوة التالية.',
        },
        {
          type: 'table',
          headers: ['المصطلح', 'معناه', 'مثال بسيط'],
          rows: [
            [
              '`Network Interface Troubleshooting`',
              'عملية منظّمة لفحص منفذ الجهاز: الحالة، الإعداد، العدّادات، والسلوك تحت التحميل',
              'نفتح `show interfaces gigabitEthernet 0/1` ونقارن CRC قبل وبعد traffic',
            ],
            [
              '`Physical Layer Problem`',
              'خلل في الإشارة أو الوسيط أو الموصل قبل ما الـ frame يتفهم',
              'كابل مقطوع، RJ-45 مجهز غلط، connector متسخ، EMI',
            ],
            [
              '`Data Link Layer Problem`',
              'خلل في الإطار نفسه أو في طريقة الوصول للوسيط أو الاتفاق على المعاملات',
              'duplex mismatch، collisions على shared media، frame errors',
            ],
            [
              '`Interface Counters`',
              'عدّادات بيحتفظ بيها الـ interface عن الأخطاء والإطارات والـ drops',
              '`input errors`, `CRC`, `runts`, `giants`, `collisions`, `output drops`',
            ],
            [
              '`Cable Troubleshooting`',
              'فحص الكابل والconnector والمسار والطرفين عشان نعزل سبب المشكلة',
              'تبديل كابل، فحص LED، قياس الكابل، تنظيف fiber',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'الواجهة بتبعت وتستقبل إشارات حقيقية، فأي حاجة تغيّر شكل الإشارة ممكن تعمل خطأ: تلف في النحاس، انحناءة حادة في الألياف، موصل مش مشدود، سرعة أو duplex مختلفين، أو ببساطة queue مليان. عشان كده بنتابع الـ **interface statistics** بدل ما نعتمد على إحساسنا إن الشبكة \"شغالة\"؛ العدّادات بتقول لنا إذا الخطأ حصل بالأمس بس ولا لسه بيحصل دلوقتي.',
        },
        {
          type: 'table',
          headers: ['نوع المشكلة', 'السؤال اللي بيجيب عليه', 'أمثلة', 'أول دليل'],
          rows: [
            [
              'Physical Connectivity Problem',
              'فيه signal يوصل من طرف لتاني؟',
              'كابل مقطوع، منفذ مقطوع، SFP غلط، polarity مقلوب',
              '`down/down` أو LED مطفي أو CRC متزايد',
            ],
            [
              'Configuration Problem',
              'هل الطرفين اتفقوا على speed و duplex؟',
              'طرف `full` والتاني `half`، سرعة متثبتة غير متوافقة',
              '`show interfaces status` و `show running-config interface ...`',
            ],
            [
              'Hardware Problem',
              'هل المنفذ أو الـ NIC أو الـ transceiver نفسه عطلان؟',
              'منفذ محترق، SFP مكسور، errdisable',
              'نفس الكابل شغال على منفذ تاني، رسائل في `show logging`',
            ],
            [
              'Transmission Error',
              'هل الإشارات وصلت مشوهة رغم وجود link؟',
              'CRC، frame errors، runts، giants، late collisions',
              'العدّادات بيزيدوا بعد ما نولّد traffic',
            ],
          ],
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Collisions**: تصادم إشارتين على وسيط مشترك في shared half-duplex Ethernet.',
            '**CRC Errors**: الإطار وصل والـ FCS بتاعه مش مطابق للمحتوى، فالـ receiver يرميه.',
            '**Duplex Mismatch**: طرف بيرسل ويستقبل معاً والتاني بيعمل carrier sense و CSMA/CD.',
            '**Speed Mismatch**: الطرفين مش قادرين ياتفقوا على سرعة تشغيل متوافقة — أو واحد متثبت على سرعة مش مدعومة في التاني.',
            '**Interface Errors**: مجموعة عدّادات بتوصف أخطاء الاستقبال والإرسال والـ drops.',
            '**Cable Troubleshooting**: خطوات عزل الكابل والconnector والـ fiber والـ transceiver والمسار.',
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'تشبيه من الحياة الواقعية',
          text: 'تخيّل الـ interface زي موظف استقبال في مكتب بريد. الـ **كابل** هو الطريق اللي بيوصل المكتب ببعضه؛ لو الطريق مقطوع مفيش رسائل هتوصل. الـ **collision** زي اتن موظفين بيصرخوا في نفس الميكروفون. الـ **CRC** زي ختم تأكيد بيقول إن الرسالة وصلت مقطوعة أو مش مفهومة. الـ **duplex mismatch** زي واحد بيتكلم في نفس الوقت والتاني لسه بيستأذن في الكلام. الـ **output drops** زي صندوق البريد اللي اتزحم فالرسائل اتشالت.',
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'القاعدة الذهبية',
          text: 'ما تنتقلش لتغيير IP أو VLAN أو routing قبل ما تتأكد إن الـ link سليم والـ speed/duplex متوافقين والعدّادات إما نظيفة أو واضح ليه بتزيد. في أغلب حالات CRC و late collisions السبب فيزيائي أو إعداد واجهة مش بروتوكول توجيه.',
        },
      ],
    },
    {
      id: 'how',
      title: 'إزاي بيشتغلوا بالتفصيل',
      short: 'الآلية',
      blocks: [
        {
          type: 'paragraph',
          text: 'الست مفاهيم دول مش منفصلين؛ كلهم بيفرقوا في **فين الإشارة اتكسرت**: قبل الـ frame (كابل/إشارة)، أثناء الوصول للوسيط (collision/duplex)، أو بعد ما الـ frame اتجمع في الـ buffer (drops/congestion). اقرأ الترتيب ده في كل سيناريو.',
        },
        {
          type: 'callout',
          tone: 'info',
          title: '1 — التصادمات (Collisions)',
          text: '`Ethernet collision` تحصل لما إشارتين يتداخلوا على نفس الوسيط في نفس الوقت. في shared media القديم، كل الأجهزة في نفس `collision domain` والـ hub بيعيد الإشارة لكل المنافذ من غير ما يفهم MAC. عشان كده كان لازم `CSMA/CD`: الجهاز يسمع الـ carrier قبل الإرسال، لو لقى الوسيط فاضي يبعت، ولو اتن جهازين بعتوا معاً يحصل collision.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Carrier Sense**: اسمع الوسيط قبل ما تبدأ.',
            '**Multiple Access**: أكتر من جهاز على نفس الوسيط.',
            '**Collision Detection**: لاحظ تداخل الإشارات أثناء الإرسال.',
            '**Jam Signal**: ابعت إشارة قصيرة عشان كل الأجهزة تعرف إن فيه collision.',
            '**Binary Exponential Backoff**: بعد كل collision تتضاعف نافذة الاختيار العشوائي، فالاحتمال إن الاتنين يعيدوا في نفس اللحظة يقل. في Ethernet الكلاسيكي بتتحسب من `0..(2^k-1)` مع حد أقصى، وبعد محاولات كثيرة بيتم إلغاء الإرسال.',
            '**Retransmit**: أعد المحاولة بعد الـ backoff.',
          ],
        },
        {
          type: 'table',
          headers: ['النوع', 'متى بيحصل؟', 'الدلالة'],
          rows: [
            [
              'collision عادية',
              'في shared half-duplex Ethernet، غالباً في أول 64 byte من الإطار',
              'متوقعة في الـ legacy hub؛ الـ CSMA/CD بيتعامل معاها',
            ],
            [
              'Late collision',
              'بعد ما الجهاز بعت جزء كبير من الإطار — غالباً بعد 64 byte',
              'مش طبيعية: duplex mismatch، كابل أطول من الحد، أو مشكلة فيزيائية/هاب',
            ],
          ],
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'مهم للامتحان',
          text: 'عدادات الـ collisions مرتبطة أساساً بـ **legacy half-duplex Ethernet**. الـ switched Ethernet الحديث شغال `full-duplex`، وكل منفذ collision domain منفصل، فـ **مفيش collisions في الظروف الطبيعية**. لو شفت collisions أو late collisions على link مفروض إنه full-duplex، اعتبرها إشارة مشكلة.',
        },
        {
          type: 'callout',
          tone: 'info',
          title: '2 — أخطاء CRC',
          text: '`Cyclic Redundancy Check (CRC)` هو حساب رياضي بيعمله الـ sender على محتوى الإطار، والنتيجة بيتحط في حقل `Frame Check Sequence (FCS)` في آخر الإطار. الـ receiver يعيد نفس الحساب على البيانات اللي وصلت، ويقارن النتيجة بالـ FCS. لو اختلفوا، الإطار مت corrupt ويتسقط فوراً ويزيد عدّاد الـ CRC.',
        },
        {
          type: 'steps',
          items: [
            {
              title: '1 — الحساب',
              text: 'الـ NIC بيحسب CRC على الـ frame content قبل الإرسال ويضيف القيمة في الـ FCS.',
            },
            {
              title: '2 — الإرسال',
              text: 'الإطار بيمشي على النحاس أو الألياف كإشارة كهربائية أو ضوئية.',
            },
            {
              title: '3 — التحقق',
              text: 'الـ receiver يعيد الحساب ويقارن. المطابقة معناها \"على الأرجح\" الإطار وصل سليم.',
            },
            {
              title: '4 — القرار',
              text: 'عدم المطابقة معناه إن الإطار اترمي. الـ CRC **بيكتشف** الخطأ بس **ما بيصحّحوش**؛ التصحيح بيحصل غالباً بإعادة الإرسال من طبقة أعلى زي TCP.',
            },
          ],
        },
        {
          type: 'table',
          headers: ['السبب', 'إزاي بيحصل؟', 'إيه اللي هتشوفه؟'],
          rows: [
            ['Damaged cable', 'انكسار أو ضغط أو ageing في النحاس/الألياف', 'CRC متزايد وغالباً ping متقطع'],
            ['Electromagnetic Interference', 'كابل جنب محرك أو UPS أو كابل كهرباء', 'أخطاء بترجع في أوقات معينة'],
            ['Faulty connector', 'RJ-45 مجهز غلط أو ferrule متسخ في fiber', 'CRC عالي على طرف واحد غالباً'],
            ['Faulty interface / NIC', 'منفذ أو SFP تالف', 'نفس العدّاد يفضل بعد تبديل الكابل'],
            ['Physical signal degradation', 'مسافة زايدة أو attenuation', 'CRC مع reduced negotiated speed أحياناً'],
          ],
        },
        {
          type: 'callout',
          tone: 'info',
          title: '3 — عدم تطابق الدوبلكس',
          text: 'في `half-duplex` الجهاز يرسل **أو** يستقبل، مش الاتنين مع بعض، وبيستخدم CSMA/CD. في `full-duplex` فيه مسارات منفصلة للإرسال والاستقبال فبيقدر يعمل الاتنين في نفس اللحظة ومفيش collision طبيعي. الـ `auto-negotiation` بيتفاوض على السرعة والـ duplex؛ المشكلة بتحصل لما طرف يتثبت `full` والتاني يتفاوض فيطلع `half`، أو العكس.',
        },
        {
          type: 'steps',
          items: [
            {
              title: 'مثال SW1 ↔ SW2',
              text: 'SW1 متثبت `speed 100` و `duplex full`، وSW2 شغال `auto`. SW2 يشوف إشارات من SW1 ويفترض إن الوسيط مش point-to-point، فيختار `half` غالباً.',
            },
            {
              title: 'إيه اللي بيحصل؟',
              text: 'SW1 بيرسل وقت ما يحب. SW2 بيسمع، ينتظر، وقد يرسل في لحظة SW1 لسه بيرسل — فيسجّل **late collisions** على جنبه.',
            },
            {
              title: 'النتيجة',
              text: 'الإطارات تضيع أو توصل مشوهة، فتظهر `CRC` و `frame errors` على SW1، ويحصل retransmission من TCP/التطبيقات. الـ throughput بيقل بشدة.',
            },
            {
              title: 'الخدعة',
              text: 'الـ link غالباً لسه `up/up` لأن الـ Layer 1 شغال. عشان كده \"الـ ping بيشتغل\" مش دليل إن الـ duplex تمام.',
            },
          ],
        },
        {
          type: 'table',
          headers: ['العَرَض', 'ليه بيحصل في duplex mismatch؟'],
          rows: [
            ['Late collisions', 'الطرف الـ half بيكتشف collision متأخر بعد ما SW1 الـ full بعت بالفعل'],
            ['CRC errors', 'إطارات متداخلة توصل مشوهة للطرف الـ full'],
            ['Frame errors', 'alignment/framing يبوظ بسبب التداخل'],
            ['Poor throughput', 'إطارات كتير تتعاد على Layer 2/Layer 4'],
            ['Upper-layer retransmissions', 'TCP يعيد الإرسال بعد loss أو timeout'],
          ],
        },
        {
          type: 'callout',
          tone: 'info',
          title: '4 — عدم تطابق السرعة',
          text: 'سرعات Ethernet الشائعة `10 Mb/s`، `100 Mb/s`، `1 Gb/s`، و`10 Gb/s`. الـ auto-negotiation بيتبادل القدرات ويختار أعلى سرعة مدعومة من الطرفين معاً. **مهم**: اختلاف القدرات مش معناه تلقائياً mismatch؛ لو طرف بيدعم 10/100/1000 والتاني 10/100، هيشتغلوا على 100 بس بدون مشكلة. الـ mismatch يظهر لما مفيش قيمة مشتركة، أو لما طرف يتثبت على سرعة التاني مش قادر يستخدمها.',
        },
        {
          type: 'table',
          headers: ['الحالة', 'النتيجة المتوقعة', 'التصرف'],
          rows: [
            ['الاتنين `auto`', 'يتفاوضوا على أعلى قيمة مشتركة', 'ده الإعداد الافضل غالباً'],
            ['قدرات مختلفة لكن فيه قاسم مشترك', 'الـ link يقوم على السرعة المشتركة', 'ما تعتبرهاش مشكلة لو الأداء متوافق مع المتوقع'],
            ['طرف متثبت 1000 والتاني 100 فقط', 'غالباً مفيش link أو link غير مستقر', 'وافق على سرعة مدعومة من الطرفين أو خلي الاتنين auto'],
            ['منفذ 10Gb/s مع transceiver 1Gb/s', 'الـ media/الـ SFP بيحدد المتاح', 'ركّب transceiver متوافق مع المنصة والمعيار'],
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'الإعداد يعتمد على الهاردوير',
          text: 'مش كل منفذ بيقبل كل السرعات أو كل أوامر `speed` و `duplex`. منافذ Gigabit و أعلى ليها متطلبات auto-negotiation خاصة حسب المعيار والمنصة. استخدم `show interfaces <port>` ووثائق الجهاز قبل تثبيت أي قيمة.',
        },
        {
          type: 'callout',
          tone: 'info',
          title: '5 — أخطاء الواجهة',
          text: 'العدّادات هي \"لوحة القياس\" بتاعة المنفذ. بعضها بيوصف تلف في الإشارة (CRC، runts، giants، frame)، وبعضها بيوصف collisions، وبعضها بيوصف ازدحام في الـ buffer (input drops، output drops، overruns). لازم تقرأهم مع بعض ومع حالة الـ link، مش تاخد عدّاد واحد لوحده.',
        },
        {
          type: 'table',
          headers: ['العدّاد', 'المعنى', 'المصدر / الأسباب الشائعة', 'لو بيزيد', 'إيه اللي تتحقّق منه'],
          rows: [
            ['`Input Errors`', 'مجموع أخطاء الإطارات الداخلة', 'جهة الاستقبال — CRC/frame/overrun/ignored أو خلل فيزيائي', 'الـ receive path فيه مشكلة نشطة', 'افصم العدّادات المكوّنة وافحص الكابل والمنفذ'],
            ['`Output Errors`', 'مجموع أخطاء الإرسال', 'جهة الإرسال — collisions، underrun، أو خلل هاردوير', 'مشكلة في خروج الإطارات', 'افحص duplex/collisions و utilization والمنفذ'],
            ['`CRC`', 'FCS validation فشل', 'كابل/EMI/connector/SFP/مطابقة إشارة', 'إطارات corrupt بتوصل دلوقتي', 'clear counters، جرّب كابل/منفذ، راجع duplex'],
            ['`Frame`', 'framing أو alignment غلط', 'إشارة مشوهة أو NIC/interface fault', 'مشكلة في حدود الإطار', 'افحص Layer 1 والمنفذ والـ speed/duplex'],
            ['`Runts`', 'إطار أصغر من الحد الأدنى', 'collision، termination غلط، attenuation', 'إطارات قصيرة مش كاملة بتوصل', 'افحص الكابل والطول والـ hub/الـ duplex'],
            ['`Giants`', 'إطار أكبر من الحد الأقصى المسموح', 'MTU/jumbo mismatch أو تلف إشارة', 'إطارات كبيرة مش متوقعة', 'راجع MTU/jumbo config على الطرفين والهاردوير'],
            ['`Input Drops`', 'إطار اتسقط في الـ input queue', 'ازدحام/سياسات/CPU على جهة الاستقبال', 'مش بالضرورة مشكلة كابل', 'افحص queue، CPU، policing/ACL'],
            ['`Output Drops`', 'إطار اتسقط قبل الإرسال', 'tx queue مليان، congestion، QoS/shaping', 'ازدحام في الخروج', 'افحص utilization والـ queue والـ QoS'],
            ['`Overruns`', 'الـ hardware buffer لم يدخل الذاكرة بالسرعة الكافية', 'burst ترافيك أو CPU مشغول أو حد هاردوير', 'الجهاز اتأخر في استقبال الإطارات', 'راقب CPU والـ burst والمنصة'],
            ['`Ignored`', 'المنفذ تجاهل إطارات بسبب حالة داخلية', 'خطأ في الـ board أو الموارد', 'خلل يخص الـ interface/المنصة', 'راجع logs و الدراسات الميدانية للمنصة'],
            ['`Collisions`', 'تصادمات على وسيط مشترك', 'hub أو half-duplex أو duplex mismatch', 'طبيعي بس في legacy half-duplex', 'قارن duplex على الطرفين'],
            ['`Late Collisions`', 'collision بعد بداية الإطار', 'duplex mismatch، طول زايدة، مشكلة فيزيائية', 'خلل واضح لازم يتحل', 'افحص الكابل والطول والـ duplex فوراً'],
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'المنصة بتفرّق',
          text: 'أسماء العدّادات ووجودها وحتى معناها التفصيلي بيختلف بين Cisco IOS/IOS-XE/NX-OS وبين أنواع الواجهات. لو عدّاد مش موجود في مخرجات جهازك، ده مش معناه إن المشكلة مش موجودة — استخدم الأمر المتاح على المنصة زي `show interfaces <port> counters errors`.',
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'أخطاء فيزيائية مقابل drops بسبب الازدحام',
          text: 'CRC و runts و giants و frame errors يعنوا إن الإشارة/الإطار وصل غلط — غالباً Layer 1. أمّا `output drops` و `input drops` فغالباً معناهم إن الـ buffer اتزحم، وده congestion أو QoS مش بالضرورة كابل. لو العدّاد بيزيد بعد `clear counters`، المشكلة نشطة؛ لو ثابت، غالباً قديم.',
        },
        {
          type: 'callout',
          tone: 'info',
          title: '6 — تشخيص الكابل',
          text: 'فحص الكابل بيمشي من الأسهل للأصعب: شوف الـ LED، استخدم `show interfaces status`، افحص الـ RJ-45 أو الـ LC/SC بالعين، جرّب كابل معروف، راجع الطول و pressure disturbances، راجع الـ SFP والـ polarity، وبعدين اختبر الهاردوير. الهدف إنك تعزل جزء واحد في كل مرة.',
        },
        {
          type: 'table',
          headers: ['المشكلة', 'أثر محتمل', 'الفحص'],
          rows: [
            ['Damaged copper cable', 'CRC/input errors أو link متقطع', 'فحص بصري + كابل بديل + cable tester'],
            ['Incorrect connection / wrong port', 'link مش بيقوم أو منفذ غلط', 'تتبع الكابل من الطرفين + `show interfaces status`'],
            ['Loose connector', 'link يقطع عند لمس الكابل', 'شدّ الـ connector ولاحظ الـ LED'],
            ['Incorrect termination', 'crosstalk و CRC', 'إعادة terminate RJ-45 بالمعايير الصح'],
            ['Length limit exceeded', 'attenuation وسرعة أقل أو أخطاء', 'قياس الطول ومقارنة بحد الوسيط — غالباً 100 m على copper'],
            ['Faulty fiber connection', 'RX LED مطفي أو link down', 'فحص TX/RX polarity ونوع الـ connector'],
            ['Dirty fiber connector', 'CRC عالي أو optical power منخفض', 'تنظيف بـ lint-free wipe وفحص الـ transceiver'],
            ['Transceiver incompatibility', 'SFP مش بيظهر أو link ثابت down', 'مقارنة نوع السFP والطول الموجي والمنصة'],
            ['EMI', 'أخطاء متقطعة قرب مصادر كهرباء', 'نقل المسار أو STP أو fiber بدلاً من copper'],
          ],
        },
        {
          type: 'table',
          headers: ['الأداة / الطريقة', 'بيفيد إيه؟'],
          rows: [
            ['Visual inspection', 'يكتشف شرخ، انحناءة حادة، connector مخلوع، غبار أو أثر حرق'],
            ['Link LEDs', 'تأكيد وجود signal ونشاط وإذا فيه flapping سريع'],
            ['Interface counters', 'يقول إذا الخطأ نشط ومين الطرف اللي بيستقبل الإطارات التالفة'],
            ['Cable tester / certifier', 'يقيس استمرارية وطول وفقدان/crosstalk — أدق من مجرد التبديل'],
            ['Known-good cable swap', 'يعزل الكابل كسبب في دقائق'],
            ['Loopback test where supported', 'يختبر مسار الإرسال/الاستقبال؛ مش متاح على كل المنصات أو الواجهات'],
            ['Replacement', 'الحل النهائي لو الكابل أو الـ SFP أو المنفذ تالف'],
          ],
        },
      ],
    },
    {
      id: 'packet',
      title: 'الشرح على مستوى الإطار والـ counters',
      short: 'الرسومات',
      blocks: [
        {
          type: 'paragraph',
          text: 'الرسومات كلها في الخطوة دي **أمثلة تعليمية محاكاة**. اضغط `شغّل` أو `الخطوة التالية` في كل رسم عشان تشوف الإشارة أو الإطار بيتحركوا. لوحة العدّادات كمان فيها أزرار لتوليد أحداث وهمية — الأرقام مش من جهاز حقيقي.',
        },
        { type: 'diagram', id: 'issue-collision', caption: 'محاكاة collision على hub: إرسال متزامن، jam signal، backoff، ثم إعادة الإرسال.' },
        {
          type: 'paragraph',
          text: 'الـ hub بيعيد الإشارة لكل المنافذ، فكل الأجهزة في نفس الـ collision domain. لو اتن جهازين بعتوا معاً، الإشارتين يتداخلوا؛ CSMA/CD بيكتشف ده ويجبرهم ينتظروا فترة عشوائية قبل ما يعيدوا. ده سلوك legacy مش سلوك switched full-duplex حديث.',
        },
        { type: 'diagram', id: 'issue-backoff', caption: 'Binary exponential backoff: النافذة العشوائية تتضاعف بعد كل collision لتقليل احتمال تكرار التصادم.' },
        {
          type: 'paragraph',
          text: 'الـ backoff مش \"نظام عدالة\"؛ هو تقليل احتمال إحصائي. بعد collision أول واحد بيختار من نافذة صغيرة، وبعد كل collision تتضاعف النافذة حتى حد أقصى. في Ethernet الكلاسيكي لو فشلت المحاولات بعد عدد محدد من التصادمات، الإرسال بيترمي.',
        },
        { type: 'diagram', id: 'issue-crc', caption: 'CRC/FCS: المرسل يحسب CRC ويضعه في FCS، والمستقبل يعيد الحساب ويقارن.' },
        {
          type: 'paragraph',
          text: 'نقطة دقيقة جداً: الـ FCS بيحتوي value الـ CRC؛ الـ receiver بيحسب CRC على البيانات المستلمة ويقارنها بالقيمة الموجودة في الـ FCS. المطابقة معناها إن الإطار مقبول \"على الأرجح\" — الـ CRC مش إثبات رياضي إن مفيش أي خطأ، لكنه قوي جداً كآلية كشف.',
        },
        { type: 'diagram', id: 'issue-corrupt-frame', caption: ' corrupt frame: bit بيتقلب بسبب EMI، الـ FCS القديم ما بيطابقش، فالإطار يتسقط ويزيد عدّاد CRC.' },
        {
          type: 'paragraph',
          text: 'لو الـ noise غيّر bit واحد، الـ receiver هيحسب CRC مختلف ويقارنه بالـ FCS اللي وصل. النتيجة `mismatch` والـ frame يتسقط. CRC **بيكتشف** بس **ما بيصلّحش**؛ الـ TCP أو بروتوكول أعلى هيطلب إعادة الإرسال.',
        },
        { type: 'diagram', id: 'issue-duplex-modes', caption: 'Half-duplex طريق واحد بالتناوب و CSMA/CD؛ full-duplex مساران منفصلان ومفيش collisions طبيعية.' },
        {
          type: 'paragraph',
          text: 'الفرق الجوهري إن half-duplex share نفس الوسيط، وfull-duplex يفصل TX عن RX. عشان كده الـ switch الحديث بيشغّل كل منفذ كـ collision domain منفصل، والـ CSMA/CD مش جزء من تشغيله الطبيعي.',
        },
        { type: 'diagram', id: 'issue-duplex-mismatch', caption: 'Duplex mismatch: SW1 full بيرسل بحرية، SW2 half بيسجّل late collisions، والـ link يفضل up/up.' },
        {
          type: 'paragraph',
          text: 'في المثال، SW1 الـ full مش \"غلط\" من وجهة نظره؛ هو بس مش بيعمل carrier sense. المشكلة إن SW2 شغال half وبيستخدم CSMA/CD. النتيجة late collisions على SW2 و CRC/frame errors على SW1، مع أداء وحش رغم إن الـ physical link سليم.',
        },
        { type: 'diagram', id: 'issue-speed-neg', caption: 'Auto-negotiation يختار أعلى سرعة مشتركة؛ القدرات المختلفة مش بالضرورة مشكلة، لكن غياب قيمة مشتركة يمنع الـ link.' },
        {
          type: 'paragraph',
          text: 'لو الطرفين متفقين على 100 بينما واحد منهم يقدر 1000 كمان، الـ link هيقوم على 100 وده مش \"speed mismatch\" بالمعنى الضروري. المismatch الحقيقي لما الطرفين ما يقدروش يشتغلوا على نفس القيمة، أو لما إعداد متثبت يتعارض مع الطرف التاني.',
        },
        { type: 'diagram', id: 'issue-interface-state', caption: 'مقارنة up/up نظيف بـ up/up فيه CRC و late collisions متزايدة — الحالة لوحدها مش كافية.' },
        {
          type: 'paragraph',
          text: 'في الفحص العملي، `up/up` مع صفر أخطاء مع ping مستقر معناها link سليم. أمّا `up/up` مع CRC متزايدة فمعناها إن الـ Layer 1 بيوصل إشارة بس الإطارات بتوصل مشوهة. هنا بنبدأ نقرأ العدّادات ونقارن الطرفين.',
        },
        { type: 'diagram', id: 'issue-counters', caption: 'لوحة عدّادات تفاعلية محاكاة — جرّب الأحداث وشوف أي عدّاد بيتغير.' },
        {
          type: 'paragraph',
          text: 'لاحظ إن \"CRC burst\" بيزود input errors و CRC و frame مع بعض، بينما \"output congestion\" بيزود output drops لوحده. كده تقدر تفهم إن العدّادات بتوصف **مسارات مختلفة**: استقبال تالف مقابل ازدحام في الإرسال. كل الأرقام هنا تعليمية محاكاة.',
        },
        { type: 'diagram', id: 'issue-cable-flow', caption: 'تدفق تشخيص الكابل: الحالة ← فحص بصري ← تبديل كابل ← speed/duplex ← مراقبة العدّادات ← هاردوير.' },
        {
          type: 'callout',
          tone: 'tip',
          title: 'خلاصة المستوى ده',
          text: 'الـ frame في Ethernet ليه FCS بيحميه من التلف، والـ interface بيسجّل نتيجة ذلك في العدّادات. الـ collisions بتاعت shared media، والـ late collisions بتاعت duplex/فيزياء، والـ drops بتاعت الـ buffers. لو عرفت \"فين\" حصل الخطأ، تعرف \"إيه\" أمر تعمله بعدين.',
        },
      ],
    },
    {
      id: 'config',
      title: 'إعداد Cisco IOS قبل وبعد التشخيص',
      short: 'أوامر الإعداد',
      blocks: [
        {
          type: 'paragraph',
          text: 'قاعدة مهمة: **اعمل observe قبل ما تعمل change**. قبل أي تعديل، شوف الحالة والعدّادات الحالية عشان تعرف إن التعديل فعلاً أصلح حاجة. الهيكل هنا `SW1 Gi0/1 ↔ SW2 Gi0/1`.',
        },
        {
          type: 'table',
          headers: ['الجهاز', 'المنفذ', 'الوصف', 'الإعداد المبدئي'],
          rows: [
            ['`SW1`', 'GigabitEthernet0/1', 'LINK-TO-SW2', '`speed auto` + `duplex auto` + `no shutdown`'],
            ['`SW2`', 'GigabitEthernet0/1', 'LINK-TO-SW1', '`speed auto` + `duplex auto` + `no shutdown`'],
          ],
        },
        {
          type: 'code',
          label: 'SW1 — الإعداد المبدئي بـ auto',
          language: 'ios',
          code: `SW1> enable
SW1# configure terminal
SW1(config)# interface gigabitEthernet 0/1
SW1(config-if)# description LINK-TO-SW2
SW1(config-if)# speed auto
SW1(config-if)# duplex auto
SW1(config-if)# no shutdown
SW1(config-if)# end
SW1# copy running-config startup-config`,
        },
        {
          type: 'code',
          label: 'SW2 — الإعداد المطابق',
          language: 'ios',
          code: `SW2> enable
SW2# configure terminal
SW2(config)# interface gigabitEthernet 0/1
SW2(config-if)# description LINK-TO-SW1
SW2(config-if)# speed auto
SW2(config-if)# duplex auto
SW2(config-if)# no shutdown
SW2(config-if)# end
SW2# copy running-config startup-config`,
        },
        {
          type: 'table',
          headers: ['الأمر', 'بيعمل إيه؟'],
          rows: [
            ['`enable`', 'يدخل privileged EXEC mode عشان تشوف كل أوامر `show` وتعمل configuration.'],
            ['`configure terminal`', 'يفتح global configuration mode.'],
            ['`interface gigabitEthernet 0/1`', 'يدخل إعداد المنفذ المراد فحصه أو إصلاحه.'],
            ['`description LINK-TO-SW2`', 'يضيف نص تعريفي بيظهر في مخرجات `show` — مش بيغيّر السلوك بس بيسرّع التشخيص.'],
            ['`speed auto`', 'يسمح للواجهة تتفاوض على سرعة مدعومة من الطرفين.'],
            ['`duplex auto`', 'يسمح للواجهة تتفاوض على half أو full حسب قدرات الطرفين والمعيار.'],
            ['`no shutdown`', 'يفتح المنفذ إدارياً. عكسه `shutdown` بيخليه `administratively down`.'],
            ['`end`', 'يرجع privileged EXEC.'],
            ['`copy running-config startup-config`', 'يحفظ التغيير بعد إعادة التشغيل.'],
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'ليه `auto` في الاتنين؟',
          text: 'لما الطرفين الاتنين يستخدموا auto، الـ auto-negotiation يوصل لحالة متسقة زي `a-full` و `a-1000`. المشكلة الشائعة إن طرف يتثبت full والتاني يفضل auto فيختار half — فتظهر late collisions وCRC. خلي الاتنين بنفس المنطق.',
        },
        {
          type: 'paragraph',
          text: 'لو احتجت تثبّت القيم في بيئة متحكم فيها، لازم تكون القيم **مدعومة ومتطابقة على الطرفين**. المثال ده مناسب لمنفذ GigE بيدعم 1000/full explicitly:',
        },
        {
          type: 'code',
          label: 'fixed settings متوافقة — لو الهاردوير يدعمها',
          language: 'ios',
          code: `SW1(config)# interface gigabitEthernet 0/1
SW1(config-if)# speed 1000
SW1(config-if)# duplex full
SW1(config-if)# no shutdown
!
SW2(config)# interface gigabitEthernet 0/1
SW2(config-if)# speed 1000
SW2(config-if)# duplex full
SW2(config-if)# no shutdown`,
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'ما تعمموش الأوامر دي على كل منفذ',
          text: 'مش كل Cisco interface بيقبل كل تركيبات `speed` و `duplex`. منافذ Gigabit و أعلى، ومنافذ SFP، ليها سلوك hardware-specific ومتطلبات auto-negotiation. على بعض المنصات `(config-if)# speed ?` هيقولك القيم المتاحة فعلاً. راجع دايمًا `show interfaces <port>` ووثائق المنصة.',
        },
        {
          type: 'table',
          headers: ['قاعدة', 'السبب'],
          rows: [
            ['ثبّت نفس السرعة على الطرفين', 'مفيش link مستقر لو مفيش قيمة مشتركة'],
            ['ثبّت نفس الـ duplex على الطرفين', 'الـ mismatch بيعمل late collisions وCRC'],
            ['فضّل `auto` إلا لو عندك سبب واضح', 'الـ negotiation بيختار أعلى قيمة مشتركة ويقلّل أخطاء البشر'],
            ['راجع القيم المتاحة قبل التثبيت', 'الـ supported settings بتعتمد على الهاردوير والـ transceiver والمعيار'],
            ['امسح العدّادات بعد الإصلاح', 'عشان تتأكد إن الخطأ ما بيزيدش من جديد'],
          ],
        },
        {
          type: 'code',
          label: 'بعد التعديل — تحقق سريع',
          language: 'ios',
          code: `SW1# clear counters
SW1# show interfaces status
SW1# show interfaces gigabitEthernet 0/1 | include duplex|speed|CRC|collision|input errors
SW1# ping 192.168.10.12`,
        },
      ],
    },
    {
      id: 'verify',
      title: 'أوامر التحقق وتفسير مخرجاتها',
      short: 'التحقق',
      blocks: [
        {
          type: 'paragraph',
          text: 'أوامر `show` ما بتغيّرش حاجة؛ دي بس قراءة للحالة. هنا بنستخدم ست أوامر أساسية، وبنقرأ منهم أربع إشارات: الحالة، السرعة/الدوبلكس، الأخطاء، والإعداد المكتوب. صيغة المخرجات بتختلف بين المنصات، فركّز على المعنى مش على ترتيب الأسطر.',
        },
        {
          type: 'table',
          headers: ['الأمر', 'الغرض', 'ملاحظة'],
          rows: [
            ['`show interfaces`', 'نظرة عامة على كل الواجهات وحالتها وعدّاداتها', 'مخرجات طويلة — استخدم `| include` لتقليلها'],
            ['`show interfaces gigabitEthernet 0/1`', 'تفاصيل منفذ واحد: state، line protocol، speed، duplex، counters', 'الأهم في التشخيص'],
            ['`show interfaces status`', 'جدول مختصر: port، status، vlan، duplex، speed، name', 'شائع على Catalyst switches'],
            ['`show ip interface brief`', 'حالة الـ interface والـ IP بشكل مختصر', 'مفيد لو فيه SVI أو L3 interface'],
            ['`show running-config interface gigabitEthernet 0/1`', 'الإعداد الفعلي تحت المنفذ', 'بيقولك إذا فيه `shutdown` أو قيمة متثبتة'],
            ['`show logging`', 'رسائل LINK/LINEPROTO و errdisable وأحداث المنفذ', 'بي help يربط الخطأ بوقت حدث فعلي'],
          ],
        },
        {
          type: 'code',
          label: '1 — واجهة سليمة',
          language: 'ios',
          code: `SW1# show interfaces gigabitEthernet 0/1
GigabitEthernet0/1 is up, line protocol is up (connected)
  Hardware is Gigabit Ethernet, address is 0011.2233.4455
  Description: LINK-TO-SW2
  MTU 1500 bytes, BW 1000000 Kbit/sec, DLY 10 usec
  Full-duplex, 1000Mb/s, media type is 10/100/1000BaseTX
  ...
     0 input errors, 0 CRC, 0 frame, 0 overrun, 0 ignored
     0 output errors, 0 collisions, 0 interface resets
     0 late collisions`,
        },
        {
          type: 'paragraph',
          text: 'القراءة: `up/up` يعني Layer 1 و Layer 2 تمام. `Full-duplex, 1000Mb/s` يعني الاتفاق تم. الصفر في كل العدّادات مع ping مستقر يعني link سليم. لو شفت `a-full` و `a-1000` في `show interfaces status`، الـ `a` معناها auto-negotiated.',
        },
        {
          type: 'code',
          label: '2 — واجهة فيها أخطاء CRC',
          language: 'ios',
          code: `SW1# show interfaces gigabitEthernet 0/1 | include input errors|CRC|frame|late
     123 input errors, 121 CRC, 2 frame, 0 overrun, 0 ignored
     0 output errors, 0 collisions, 0 interface resets
     0 late collisions
SW1# show interfaces status | include Gi0/1
Gi0/1  LINK-TO-SW2  connected  trunk  a-full  a-1000  10/100/1000BaseTX`,
        },
        {
          type: 'paragraph',
          text: 'القراءة: الـ link `up/up` والـ duplex/سرعة متفاوضة، بس فيه CRC و frame errors. ده بيشير لتلف إشارة واصل للطرف ده: كابل، connector، SFP، EMI، أو مشكلة في الطرف التاني. لو الـ late collisions صفر، فduplex mismatch أقل احتمالاً من مشكلة فيزيائية خالصة — بس لسه لازم نقارن الطرفين.',
        },
        {
          type: 'code',
          label: '3 — واجهة فيها late collisions',
          language: 'ios',
          code: `SW2# show interfaces fastEthernet 0/1
FastEthernet0/1 is up, line protocol is up (connected)
  Half-duplex, 100Mb/s, media type is 10/100BaseTX
  ...
     45 input errors, 10 CRC, 3 frame, 0 overrun, 0 ignored
     0 output errors, 812 collisions, 0 interface resets
     61 late collisions
SW2# show interfaces status | include Fa0/1
Fa0/1  LINK-TO-SW1  connected  1  a-half  a-100  10/100BaseTX`,
        },
        {
          type: 'paragraph',
          text: 'القراءة: الكounters بتاعة SW2 فيها عدد كبير من collisions و late collisions، والمنفذ `a-half`. لو SW1 طرفه `a-full` أو `full`، فده duplex mismatch كلاسيكي. الـ link لسه `up/up` بس الأداء هيكون وحش جداً. الحل: وافق الـ duplex على الطرفين — غالباً الاتنين `auto`.',
        },
        {
          type: 'code',
          label: '4 — input errors متزايدة (قبل وبعد)',
          language: 'ios',
          code: `SW1# clear counters
Clear "show interface" counters on all interfaces [confirm]

SW1# show interfaces gigabitEthernet 0/1 | include input errors|CRC|frame|runts|giants
     0 input errors, 0 CRC, 0 frame, 0 runts, 0 giants

! بعد دقيقتين من generate traffic
SW1# show interfaces gigabitEthernet 0/1 | include input errors|CRC|frame|runts|giants
     87 input errors, 84 CRC, 3 frame, 2 runts, 0 giants`,
        },
        {
          type: 'paragraph',
          text: 'القراءة هنا أهم من مجرد رقم: بعد `clear counters` العدّاد رجع صفر وبعدين زاد لـ 87. يعني المشكلة **نشطة دلوقتي**، مش عدّاد قديم من أسبوع. وجود CRC و runts معاً بيزود احتمال مشكلة فيزيائية أو إعداد duplex/طول كابل، مش مجرد congestion.',
        },
        {
          type: 'table',
          headers: ['الحقل', 'إيه اللي لازم تتأكد منه؟'],
          rows: [
            ['Interface status', '`up/up`، `down/down`، أو `administratively down`'],
            ['Line protocol', 'لو الـ interface up والـ protocol down، شكك في duplex/keepalive/طبقة أعلى'],
            ['Speed', '`a-1000` طبيعي مع auto؛ قيمة أقل من المتوقعة محتاجة فحص الكابل/المنفذ'],
            ['Duplex', '`a-full` أو `full` على الاتنين؛ `a-half` على link GigE حديث يبقى شك'],
            ['Input Errors / CRC / Frame', 'بيانات واصلة غلط — غالباً Layer 1 أو duplex'],
            ['Runts / Giants', 'أحجام إطارات مش متوقعة — collision، termination، أو MTU mismatch'],
            ['Output Drops', 'ازدحام/Queue مش كابل غالباً'],
            ['Collisions / Late Collisions', 'shared half-duplex أو duplex mismatch/مشكلة فيزيائية'],
          ],
        },
        {
          type: 'code',
          label: 'مراقبة بعد الإصلاح',
          language: 'ios',
          code: `SW1# clear counters
SW1# show interfaces gigabitEthernet 0/1 counters errors
SW1# show interfaces gigabitEthernet 0/1 | include duplex|speed|CRC|collision|input errors
SW1# show logging | include LINK|LINEPROTO|Gi0/1
SW1# ping 192.168.10.12 repeat 20`,
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'قديم مقابل نشط',
          text: 'العدّاد بيحتفظ بالقيمة من آخر clear أو من bootstrap. قبل ما تقرر إن المشكلة لسه موجودة، اعمل `clear counters`، ولّد traffic حقيقي، ثم قارن. لو العدّاد ثابت، غالباً كان حدث قديم. لو بيزيد باستمرار، المشكلة نشطة. وافحص الطرفين الاتنين لأن العدّاد غالباً بيظهر على جهة الاستقبال مش جهة الإرسال.',
        },
      ],
    },
    {
      id: 'mistakes',
      title: 'ستة سيناريوهات تشخيصية',
      short: 'التشخيص',
      blocks: [
        {
          type: 'callout',
          tone: 'info',
          title: 'منهجية ثابتة',
          text: `1) حدّد العَرَض · 2) افحص الـ status · 3) قارن speed/duplex على الطرفين · 4) اقرأ العدّادات · 5) افحص الكابل والـ LEDs · 6) اعرف إذا العدّاد بيزيد · 7) طبّق إصلاح واحد فقط في كل مرة · 8) أعد التحقق. ما تفترضش إن عدّاد واحد معناه سبب واحد دايماً — CRC مثلاً ممكن يجي من كابل أو EMI أو connector أو duplex mismatch.`,
        },
        {
          type: 'table',
          headers: ['السيناريو', 'الأعراض', 'الأسباب المحتملة', 'أوامر التحقق', 'خطوات التشخيص', 'الإجراءات التصحيحية'],
          rows: [
            [
              '1. CRC errors increasing',
              'ping متقطع، الـ link `up/up`، و`CRC` بيزيد بعد `clear counters`',
              'كابل تالف، EMI، connector متسخ/مجهز غلط، NIC أو SFP تالف',
              '`show interfaces <port>` · `show interfaces status` · `show logging` · `clear counters`',
              'سجّل القيم → امسح العدّادات → ولّد traffic → قارن الطرفين → جرّب كابل معروف → جرّب منفذ تاني',
              'استبدل الكابل، أعد terminate الـ RJ-45، نظّف fiber، بُعد الكابل عن EMI، أو استبدل المنفذ/الـ SFP',
            ],
            [
              '2. Late collisions',
              'أداء وحش، `late collisions` وغالباً `collisions` على طرف، والـ link شغال',
              'duplex mismatch، shared legacy hub، كابل أطول من الحد، فيزياء/هاردوير',
              '`show interfaces status` · `show interfaces <port>` · `show running-config interface ...`',
              'قارن duplex على الطرفين → شوف مين بيسجّل collision → راجع طول الكابل → افحص LED والكابل',
              'وحّد duplex (غالباً `auto` في الاتنين)، استبدل الكابل، قصّر المسافة، أو استبدل الهاب بالسوّيتش',
            ],
            [
              '3. Interface up but performance poor',
              'link `up/up` بس نقل ملفات بطيء وممكن ping متقطع',
              'duplex mismatch، speed أقل من المتوقع، أخطاء Layer 1، congestion/output drops',
              '`show interfaces status` · `show interfaces <port>` · `show interfaces <port> counters errors`',
              'راجع speed/duplex → افحص CRC/collisions → افحص output drops → راقب utilization → جرّب ping/iperf',
              'صحّح duplex/speed، استبدل الكابل، عالج congestion أو QoS، أو استبدل المنفذ لو فيه أخطاء هاردوير',
            ],
            [
              '4. Interface down',
              '`down/down` أو `administratively down`، LED مطفي',
              'كابل مقطوع أو مش موصول، منفذ عليه `shutdown`، transceiver مش متوافق، منفذ تالف',
              '`show interfaces status` · `show interfaces <port>` · `show logging` · `show running-config interface ...`',
              'شوف LED → جرّب كابل معروف → راجع `shutdown` → قارن SFP والطرف التاني → جرّب منفذ تاني',
              'وصل/استبدل الكابل، `no shutdown`، ركّب transceiver متوافق، أو انقل الخدمة لمنفذ سليم',
            ],
            [
              '5. Input errors increasing',
              '`input errors` بيزيد مع `CRC`/`frame` أحياناً، والـ ping يتقطع تحت الحمل',
              'تلف إشارة، مشكلة framing، EMI، منفذ/ NIC تالف، أو duplex mismatch',
              '`clear counters` · `show interfaces <port>` · `show interfaces <port> counters errors` · `show logging`',
              'افصم المكوّنات → امسح → ولّد traffic → قارن الطرفين → جرّب كابل/منفذ → راجع الـ logs',
              'صحّح السبب الفيزيائي أو الـ duplex، استبدل الكابل/المنفذ، وراجع العدّادات بعد الإصلاح',
            ],
            [
              '6. Output drops',
              'التحميل بطيء في أوقات الذروة، `output drops` بيزيد بينما CRC غالباً صفر',
              'congestion على الـ egress، queue محدودة، shaping/policing، حد هاردوير',
              '`show interfaces <port>` · `show interfaces <port> counters queue` لو متاح · `show policy-map interface` لو متاح',
              'تأكد إن CRC صفر → راجع utilization → افحص queue/QoS → قارن مع أوقات الذروة',
              'زوّد السعة أو الـ queue حيث يسمح التصميم، حسّن QoS/shaping، أو اوزّع الحمل على روابط أكثر',
            ],
          ],
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'ما تخلطش بين الأعراض',
          text: '`output drops` مع CRC صفر غالباً congestion. `CRC` مع `runts` و `frame errors` غالباً Layer 1. `late collisions` مع duplex مختلف غالباً duplex mismatch. بس لو الأعراض مختلطة، اعمل عزل خطوة بخطوة بدل ما تصل لحكم نهائي من عدّاد واحد.',
        },
      ],
    },
    {
      id: 'lab',
      title: 'لاب Packet Tracer: تشخيص واجهة وكابل',
      short: 'لاب عملي',
      blocks: [
        {
          type: 'paragraph',
          text: 'هتبني نفس فكرة لاب 1.3 بس بمنطق **troubleshooting**: تبني شبكة سليمة، تسجّل الحالة والعدّادات، بعدين تسبب مشكلة مقصودة (كابل مقطوع/منفذ shutdown) وتشخّصها وتصلّحها. الأجهزة: `2 Cisco Switches` + `4 PCs` + كابلات Ethernet.',
        },
        {
          type: 'table',
          headers: ['من', 'إلى', 'المنفذ', 'ملاحظة'],
          rows: [
            ['PC0', 'SW1', 'Fa0/1', 'Copper straight-through'],
            ['PC1', 'SW1', 'Fa0/2', 'Copper straight-through'],
            ['PC2', 'SW2', 'Fa0/1', 'Copper straight-through'],
            ['PC3', 'SW2', 'Fa0/2', 'Copper straight-through'],
            ['SW1', 'SW2', 'Gi0/1 ↔ Gi0/1', 'Inter-switch link'],
          ],
        },
        {
          type: 'table',
          headers: ['الجهاز', 'عنوان IP', 'قناع الشبكة', 'الـ gateway'],
          rows: [
            ['PC0', '192.168.10.10', '255.255.255.0', 'مش مطلوب في اللاب المحلي'],
            ['PC1', '192.168.10.11', '255.255.255.0', 'مش مطلوب في اللاب المحلي'],
            ['PC2', '192.168.10.12', '255.255.255.0', 'مش مطلوب في اللاب المحلي'],
            ['PC3', '192.168.10.13', '255.255.255.0', 'مش مطلوب في اللاب المحلي'],
          ],
        },
        {
          type: 'code',
          label: 'SW1 — الإعداد',
          language: 'ios',
          code: `enable
configure terminal
hostname SW1
!
interface range fastEthernet 0/1 - 2
 description PC-ACCESS-SW1
 speed auto
 duplex auto
 no shutdown
!
interface gigabitEthernet 0/1
 description LINK-TO-SW2
 speed auto
 duplex auto
 no shutdown
end
copy running-config startup-config`,
        },
        {
          type: 'code',
          label: 'SW2 — الإعداد',
          language: 'ios',
          code: `enable
configure terminal
hostname SW2
!
interface range fastEthernet 0/1 - 2
 description PC-ACCESS-SW2
 speed auto
 duplex auto
 no shutdown
!
interface gigabitEthernet 0/1
 description LINK-TO-SW1
 speed auto
 duplex auto
 no shutdown
end
copy running-config startup-config`,
        },
        {
          type: 'code',
          label: 'أوامر التحقق',
          language: 'ios',
          code: `show interfaces status
show interfaces gigabitEthernet 0/1
show ip interface brief
show running-config interface gigabitEthernet 0/1
show logging
clear counters
show interfaces gigabitEthernet 0/1 | include duplex|speed|CRC|collision|input errors`,
        },
        {
          type: 'steps',
          items: [
            {
              title: 'المهمة 1 — الاتصال الأساسي',
              text: 'وصل PCs والسوّيتشين بالمنافذ في الجدول. بعد ما الـ LEDs تثبت، اعمل ping من PC0 لـ PC1 (نفس السوّيتش) ومن PC0 لـ PC2 (عبر الـ inter-switch link).',
            },
            {
              title: 'المهمة 2 — الوصف',
              text: 'الصق أوامر SW1 و SW2. التأكد إن `description` ظاهر في `show interfaces status` عشان تقدر تعرف المنفذ بسرعة في التشخيص.',
            },
            {
              title: 'المهمة 3 — عدّادات الأساس',
              text: 'اعمل `clear counters` على SW1 وSW2، اعمل ping 20 مرة، وبعدين دوّن `input errors`, `CRC`, `collisions`, `late collisions`, و `output drops`. المفروض يبقوا صفر في الظروف الطبيعية.',
            },
            {
              title: 'المهمة 4 — السرعة والدوبلكس',
              text: 'شوف `show interfaces status`. دوّن القيم المتفاوضة للـ PCs والرابط بين السوّيتشين. جرّب تغيير طرف واحد إلى `speed 100` / `duplex full` وقارن النتيجة مع الطرف التاني — في Packet Tracer قد تظهر أعراض محدودة أو مش دقيقة؛ الهدف فهم المنطق.',
            },
            {
              title: 'المهمة 5 — تحدي كابل مقطوع',
              text: 'افصل كابل `Gi0/1` بين السوّيتشين أو اعمل `shutdown` على SW2 Gi0/1. جرّب ping من PC0 لـ PC2 — هيفشل. على SW1 شوف `show interfaces gigabitEthernet 0/1`؛ المفروض تشوف `down/down` ورسالة LINK في `show logging`.',
            },
            {
              title: 'المهمة 6 — الاستعادة والتحقق',
              text: 'أعد وصل الكابل أو اكتب `no shutdown`. اعمل `clear counters`، اعمل ping تاني， وتأكد إن الحالة رجعت `up/up` والعدّادات ما بيزيدوش.',
            },
            {
              title: 'اختياري متقدم — duplex mismatch',
              text: 'خلي SW1 `duplex full` وSW2 `duplex auto` أو `half`، ولّد traffic، وقارن المخرجات. دوّن أي late collisions أو CRC ظهرت وأي طرف سجّلها. رجّع الاتنين `auto` في الآخر.',
            },
          ],
        },
        {
          type: 'code',
          label: 'النتائج المتوقعة — الحالة السليمة',
          language: 'ios',
          code: `SW1# show interfaces status
Port      Name              Status       Vlan  Duplex  Speed
Fa0/1     PC-ACCESS-SW1     connected    1     a-full  a-100
Fa0/2     PC-ACCESS-SW1     connected    1     a-full  a-100
Gi0/1     LINK-TO-SW2       connected    1     a-full  a-1000

PC0> ping 192.168.10.12
Reply from 192.168.10.12: bytes=32 time<1ms TTL=128
Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)`,
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'حدود Packet Tracer — مهم جداً',
          text: 'Packet Tracer بيحاكي تقريباً الـ link up/down وبعض أوامر speed/duplex وبعض العدّادات. بس **مش** بيحاكي بدقة جهنم EMI الحقيقي، optical power budget، modal dispersion، تلف الـ connector، أو سلوك CRC والـ collisions على كل المنصات. اللي يتعمل في PT: الطوبولوجيا، الأوامر، الحالة، والمنطق. اللي محتاج جهاز حقيقي أو محاكي متخصص: قياس الإشارة، تأكيد CRC الفعلي، cable certification، واختبار الـ SFP/Optical power.',
        },
      ],
    },
    {
      id: 'exam',
      title: 'خمسة أسئلة بصيغة اختبار CCNA',
      short: 'أسئلة تدريب',
      blocks: [
        {
          type: 'paragraph',
          text: 'كل سؤال فيه زر **تحقق من الإجابة**؛ الإجابة والشرح مخفيين لحد ما تضغط. اقرأ ليه الخيارات التانية غلط — ده أهم من حفظ رقم الإجابة.',
        },
        {
          type: 'quiz',
          questions: [
            {
              id: 'q1',
              prompt: 'في شبكة legacy فيها أربع PCs متصلين بنفس الـ hub. اتن جهازين بعتوا في نفس اللحظة. إيه اللي بيحصل بعد كشف التداخل؟',
              options: [
                'الـ hub بيستخدم MAC address table عشان يفصل الإرسال',
                'الاتنين بيرسلوا jam signal، وبعدين يختاروا زمن backoff عشوائي ويعيدوا الإرسال',
                'المنفذ هيشتغل full-duplex تلقائياً عشان يتجنب التصادم',
                'الـ router هيعيد ترتيب الإطارات قبل ما توصل',
              ],
              correctIndex: 1,
              requireSubmit: true,
              explanation:
                'الصح هو **(B)**: دي دورة CSMA/CD في shared half-duplex Ethernet — carrier sense، إرسال، كشف collision، jam signal، binary exponential backoff، ثم إعادة الإرسال. **(A)** غلط لأن الـ hub جهاز Layer 1 ومفيش عنده MAC table. **(C)** غلط لأن الـ hub shared ومش full-duplex. **(D)** غلط لأن الـ router مش طرف في collision الـ Layer 1 ده.',
            },
            {
              id: 'q2',
              prompt: 'أي عبارات عن CRC و FCS صحيحة؟ اختر أكثر من إجابة.',
              options: [
                'الـ sender بيحسب CRC ويحط النتيجة في حقل FCS في آخر إطار Ethernet',
                'لو الـ receiver لقى FCS مش مطابق، هيصلّح الإطار ويكمل توجيهه',
                'الـ CRC بيكتشف أخطاء النقل بس مش بيرجّع الإطار التالف لحالته',
                'الإطار اللي يفشل validation غالباً بيتسقط ويزيد عدّاد CRC',
                'زيادة CRC على link GigE حديث طبيعية جداً ومفيش داعي للفحص',
              ],
              kind: 'multiple',
              correctIndices: [0, 2, 3],
              requireSubmit: true,
              explanation:
                'الصح هو **(A) و (C) و (D)**: الـ FCS بيحمل قيمة الـ CRC، والمستقبل يعيد الحساب ويقارن؛ لو حصل mismatch الإطار يتسقط ويزيد العدّاد، والـ CRC آلية كشف مش تصحيح. **(B)** غلط لأن CRC ما بيصلّحش الإطار. **(E)** غلط لأن CRC متزايد على link مفروض إنه سليم بيشير لمشكلة فيزيائية أو duplex وتستحق الفحص.',
            },
            {
              id: 'q3',
              prompt: 'تحليل مخرجات الأوامر: `SW1# show interfaces status` بيظهر `Gi0/1 connected a-full a-100`، و`SW2# show interfaces status` بيظهر `Gi0/1 connected a-half a-100`. على SW2 فيه `late collisions` متزايدة. إيه أفضل تشخيص؟',
              options: [
                'ده auto-negotiation طبيعي ومفيش حاجة تتعمل',
                'فيه duplex mismatch؛ لازم يبقى الطرفين على نفس إعداد الـ duplex',
                'فيه speed mismatch؛ لازم نثبّت الطرفين على 1000 Mb/s',
                'المنفذ محتاج زيادة حجم الـ output queue',
              ],
              correctIndex: 1,
              requireSubmit: true,
              explanation:
                'الصح هو **(B)**: طرف `full` وطرف `half` على نفس الـ link مع late collisions ده duplex mismatch كلاسيكي. الـ link يفضل `up/up` بس الأداء وحش. **(A)** غلط لأن الحالتين مش متوافقتين. **(C)** غلط لأن السرعة متطابقة على 100 أصلاً، والـ 1000 مش بالضرورة مدعومة. **(D)** غلط لأن late collisions مش مشكلة output queue.',
            },
            {
              id: 'q4',
              prompt: 'بعد `clear counters` وتوليد traffic لمدة دقيقتين، ظهر: `input errors 85`, `CRC 82`, `frame 3`, `runts 0`, `giants 0`, `input drops 0`, `output drops 0`, `collisions 0`, `late collisions 0`. أي استنتاجات صحيحة؟ اختر أكثر من إجابة.',
              options: [
                'الأخطاء نشطة ومتزايدة على مسار الاستقبال',
                'السبب الأساسي هو congestion في الـ output queue',
                'الأعراض بتشير لمشكلة إشارة/فيزيائية أو واجهة وليس congested egress',
                'العدّادات طبيعية تماماً على link full-duplex حديث',
                'وجود frame errors مع CRC بيزيد احتمال خلل في Layer 1 أو الـ interface',
              ],
              kind: 'multiple',
              correctIndices: [0, 2, 4],
              requireSubmit: true,
              explanation:
                'الصح هو **(A) و (C) و (E)**: زيادة CRC مع frame errors بعد clear معناها أخطاء استقبال نشطة وغالباً فيزيائية/واجهة. `(B)` غلط لأن `output drops = 0`، فمفيش دليل على egress congestion. `(D)` غلط لأن CRC متزايد مش حالة طبيعية على link سليم.',
            },
            {
              id: 'q5',
              prompt: 'Scenario: بعد تركيب كابل جديد، `Gi0/1` ظهر `up/up`، لكن الـ ping بيتقطع. CRC بيزيد على SW1 بعد `clear counters`، وLED بيرجف أحياناً. إيه أحسن خطوة تالية؟',
              options: [
                'غيّر عنوان IP على PC وامسح الـ ARP cache',
                'أعد تركيب أو استبدل الكابل، افحص الـ connector و EMI، وقارن speed/duplex على الطرفين، ثم أعد الفحص',
                'زوّد الـ MTU لأن CRC مرتبط بحجم الإطار',
                'تجاهل العدّاد لأن الـ link `up/up` يعني إن الشبكة تمام',
              ],
              correctIndex: 1,
              requireSubmit: true,
              explanation:
                'الصح هو **(B)**: CRC متزايد مع LED غير مستقر بعد تركيب كابل بيشير لمشكلة فيزيائية/اتصال أو إعداد واجهة. لازم تعزل الكابل والـ connector والـ EMI والـ duplex. **(A)** غلط لأن IP/ARP مش بيسببوا CRC. **(C)** غلط لأن MTU مش بيصحّح FCS failed. **(D)** غلط لأن `up/up` معناه بس إن Layer 1 موجود، مش إن الإطارات سليمة.',
            },
          ],
        },
      ],
    },
    {
      id: 'summary',
      title: 'الخلاصة والنقاط المهمة',
      short: 'خلاصة',
      blocks: [
        {
          type: 'table',
          headers: ['المفهوم', 'احفظ كده'],
          rows: [
            ['Collisions', 'مرتبطة بـ shared half-duplex Ethernet؛ CSMA/CD بيتعامل معاها في Legacy. switched full-duplex مفيش فيه collisions طبيعية.'],
            ['CRC', 'الـ FCS بيحمل قيمة CRC؛ المستقبل بيكتشف التلف ويرمي الإطار. CRC مش بيصلّح.'],
            ['Duplex', 'half = إرسال أو استقبال؛ full = الاتنين معاً. الـ mismatch بيعمل late collisions وCRC وأداء وحش.'],
            ['Speed', 'الـ auto-negotiation يختار قيمة مشتركة. قدرات مختلفة مش بالضرورة مشكلة؛ غياب قيمة مشتركة هو المشكلة.'],
          ],
        },
        {
          type: 'table',
          headers: ['مجموعة العدّادات', 'العدّادات', 'التفسير'],
          rows: [
            ['Physical / signal', '`CRC`, `frame`, `runts`, `giants`', 'إطارات وصلت تالفة أو بحجم غريب — كابل/ connector/ EMI/ منفذ'],
            ['Access method', '`collisions`, `late collisions`', 'shared half-duplex أو duplex mismatch — مش طبيعي على full-duplex حديث'],
            ['Receive pressure', '`input errors`, `input drops`, `overruns`, `ignored`', 'أخطاء استقبال أو ضغط على الـ input path؛ مش كلها كابل'],
            ['Transmit path', '`output errors`, `output drops`', 'أخطاء إرسال أو ازدحام في الـ egress queue'],
          ],
        },
        {
          type: 'steps',
          items: [
            { title: '1 — حدّد الأعراض', text: 'ping متقطع؟ بطء؟ link down؟ اكتب العَرَض بدقة.' },
            { title: '2 — افحص حالة الواجهة', text: '`show interfaces status` — هل فيه `up/up` ولا `down/down`؟' },
            { title: '3 — راجع السرعة والدوبلكس', text: 'قارن الطرفين؛ `a-full` و `a-1000` غالباً طبيعي.' },
            { title: '4 — اقرأ العدّادات', text: '`show interfaces <port>` — اقرأ CRC، frame، runts، giants، collisions، drops.' },
            { title: '5 — افحص الكابلات', text: 'LED، كابل، connector، SFP، polarity، EMI، الطول.' },
            { title: '6 — حدّد العدّادات المتزايدة', text: '`clear counters` ثم ولّد traffic وأعد القراءة.' },
            { title: '7 — طبّق الإصلاح', text: 'غيّر حاجة واحدة فقط في كل مرة: كابل، duplex، منفذ، أو QoS.' },
            { title: '8 — تحقّق', text: 'أعد `show interfaces` والـ ping وتأكد من ثبات الحالة والعدّادات.' },
          ],
        },
        {
          type: 'table',
          headers: ['فخ امتحاني', 'الإجابة الصح'],
          rows: [
            ['"CRC معناه مشكلة IP"', 'لا — CRC غالباً إشارة/كابل/ connector/ duplex'],
            ['"CRC بيصحّح الإطار التالف"', 'لا — بيكتشف بس والإطار يتسقط'],
            ['"Collisions طبيعية على كل link"', 'لا — طبيعية بس في shared half-duplex القديم'],
            ['"Late collisions مجرد congestion"', 'لا — غالباً duplex mismatch أو مشكلة فيزيائية'],
            ['"up/up معناه شبكة سليمة"', 'لا — لازم تفحص العدّادات والأداء'],
            ['"Laptop بيدعم 1000 والسوّيتش 100 معناها بالضرورة mismatch"', 'لا — لو فيه 100 مشترك الـ link هيقوم عليه'],
            ['"Output drops معناها كابل تالف"', 'لا — غالباً congestion في الـ egress queue'],
            ['"العدّاد القديم دليل على مشكلة دلوقتي"', 'لا — اعمل clear counters وأعد القياس'],
            ['"كل المنصات فيها نفس العدّادات بنفس الأسماء"', 'لا — التوفر والأسماء hardware/platform-dependent'],
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'جملة تلخّص بيها الدرس كله',
          text: 'ابدأ بالحالة، ثم speed/duplex، ثم العدّادات، ثم الكابل. لو العدّاد زاد بعد `clear counters` فالمشكلة نشطة. وافهم إن CRC بيكتشف، والـ CSMA/CD كان في الـ shared legacy، والـ full-duplex الحديث مفيش فيه collisions طبيعية.',
        },
      ],
    },
  ],
}
