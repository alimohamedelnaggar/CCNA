import type { Lesson } from '../types'

const rfRows: string[][] = [
  ['Radio Frequency (RF)', 'الجزء من الطيف الكهرومغناطيسي اللي بيستخدمه Wi-Fi لنقل البيانات عبر الهواء', '2.4 GHz, 5 GHz, 6 GHz', 'الموجة بتنتقل من هوائي لـ هوائي'],
  ['Frequency', 'عدد دورات الموجة في الثانية', 'Hz, MHz, GHz', 'التردد الأعلى = طول موجة أقصر'],
  ['Wavelength', 'المسافة بين قمتين متتاليتين في الموجة', 'λ = c / f', 'طول الموجة الأطول غالباً بيعطي مدى واختراق أحسن'],
  ['Amplitude', 'ارتفاع الموجة؛ مرتبط بقدرة الإشارة', 'Higher / lower', 'القدرة ملتزمة بحدود تنظيمية حسب البلد'],
  ['Phase', 'موضع النقطة داخل دورة الموجة', '0° ... 360°', 'تغيير الـ phase والـ amplitude بيحمل البتات'],
  ['Propagation', 'طريقة انتقال الموجة وتأثرها بالبيئة', 'Reflection, refraction...', 'البيئة بتغيّر القدرة والمسار'],
  ['dBm', 'وحدة قياس القدرة بالنسبة لـ 1 milliwatt', '`-67 dBm`', 'القيم سالبة؛ الأقرب للصفر أقوى'],
  ['RSSI', 'مؤشر قوة الإشارة المستقبَلة', '`-67 dBm`', 'مش مقياس مطلق للأداء'],
  ['SNR', 'الفرق بين الإشارة والضوضاء', '`28 dB`', 'الهامش الأكبر غالباً أحسن'],
  ['Noise floor', 'مستوى الضوضاء الخلفية', '`-95 dBm`', 'قيمة أكتر سالبة يعني هدوء أكتر'],
]

const bandRows: string[][] = [
  ['2.4 GHz', 'أطول', 'أحسن', 'أقل', 'قنوات أقل', 'مرتفعة جداً', 'IoT، مدى بعيد، جدران كتير'],
  ['5 GHz', 'متوسط', 'متوسط', 'أعلى', 'كتير', 'متوسطة', 'لابتوبس، ستريمنج، مكاتب'],
  ['6 GHz', 'أقصر', 'أضعف', 'عالية جداً', 'كثيرة جداً', 'أقل غالباً', 'Wi-Fi 6E/7، طيف نظيف'],
]

const widthRows: string[][] = [
  ['20 MHz', 'قناة أساسية واحدة', 'أقل', 'أعلى', '2.4 GHz والبيئات المزدحمة'],
  ['40 MHz', 'قناة أساسية + قناة إضافية', 'متوسط', 'متوسط', 'توازن بين السرعة والاستقرار'],
  ['80 MHz', '4 قنوات', 'أعلى', 'أقل', '5/6 GHz عند توفر الطيف'],
  ['160 MHz', '8 قنوات', 'عالية جداً', 'قليلة جداً', 'بيئة نظيفة جداً وأجهزة تدعمها'],
]

const interferenceRows: string[][] = [
  ['Co-channel', 'APs على نفس القناة', 'تقليل السرعة وازدحام airtime', 'خطط القنوات، قلّل الأحمال'],
  ['Adjacent-channel', 'قنوات متداخلة زي 1 و3', 'تلف وإعادة إرسال', 'استخدم قنوات غير متداخلة'],
  ['Non-Wi-Fi', 'Bluetooth، ميكروويف، هواتف، رادار', 'ضوضاء وفقدان', 'غيّر النطاق أو ابعد المصدر'],
  ['Obstacles', 'جدران، معدن، زجاج، أشخاص', 'Attenuation', 'غيّر الموقع أو أضف AP مخطط'],
]

export const topic111Lesson: Lesson = {
  topicId: '1.11',
  title: 'Wireless Principles',
  description:
    'في الدرس ده هنتعلّم مبادئ الشبكات اللاسلكية: RF وطول الموجة وdBm، مقارنة 2.4 و5 و6 GHz، القنوات وعرض القناة، التداخل وفقدان الإشارة، RSSI وSNR، وأساسيات أمان Wi-Fi. كمان فيه تشخيص عملي ولابين و5 أسئلة بصيغة CCNA.',
  estimatedTime: '~120 دقيقة',
  steps: [
    {
      id: 'what',
      title: 'ما هي الشبكات اللاسلكية ولماذا نستخدمها؟',
      short: 'مفهوم الدرس',
      blocks: [
        {
          type: 'paragraph',
          text: 'الشبكة اللاسلكية بتستخدم **Radio Frequency (RF)** بدل الكابل لنقل البيانات بين جهاز وآخر. أشهر مثال هو Wi-Fi اللي بيوصل اللابتوب والموبايل بـ **Access Point (AP)**، وبعدين الـ AP نفسه بيتصل بالشبكة السلكية.',
        },
        {
          type: 'paragraph',
          text: 'الهدف مش «إلغاء الكابل في كل مكان»؛ الهدف هو **مرونة الحركة** وتغطية أماكن يصعب فيها تمديد كابل. في CCNA لازم تفهم إن الـ RF بيئة **مشاركة**: كل الأجهزة على نفس القناة بتتقاسم الـ airtime، وعشان كده التصميم والتشخيص بيختلفوا عن الشبكة السلكية.',
        },
        {
          type: 'diagram',
          id: 'wireless-overview-signal-path',
          caption: 'الـ AP يبث SSID والعميل يتصل عبر RF. SSID اسم الشبكة مش تشفير.',
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'كلمة مهمة',
          text: '**SSID** هو اسم الشبكة اللي بيظهر للمستخدم. ده مش تشفير، وإخفاؤه مش بيخلي الشبكة آمنة. التشفير الحقيقي هو WPA2/WPA3.',
        },
        { type: 'paragraph', text: '**من أين يبدأ الـ Wi-Fi؟**' },
        {
          type: 'paragraph',
          text: 'الـ AP بيبثّ **SSID** ويستقبل العملاء. العميل بيختار نطاقاً (2.4 أو 5 أو 6 GHz حسب جهازه) وقناة، وبعد المصادقة بيقدر يرسل ويتلقى الإطارات. كل ده بيحصل على موجات كهرومغناطيسية في الهواء.',
        },
        { type: 'paragraph', text: '**أين يظهر في CCNA 200-301؟**' },
        {
          type: 'list',
          items: [
            '`1.11.a` Nonoverlapping Wi-Fi channels.',
            '`1.11.b` SSID.',
            '`1.11.c` RF.',
            '`1.11.d` Encryption.',
          ],
        },
        {
          type: 'paragraph',
          text: 'الموضوع ده **أساس مبادئ**. تفاصيل إعداد الـ WLAN والـ controller في دومين الشبكات اللاسلكية بتيجي في مرحلة لاحقة، فهنقف هنا عند المفاهيم والفحص المنطقي.',
        },
      ],
    },
    {
      id: 'how',
      title: 'أساسيات التردد الراديوي (RF Fundamentals)',
      short: 'كيف يعمل',
      blocks: [
        {
          type: 'paragraph',
          text: '**RF** اختصار لـ Radio Frequency. الموجة الراديوية ليها خصائص أساسية: التردد، طول الموجة، الـ amplitude، والـ phase. فهمها بيفسّر ليه 2.4 GHz بيوصل أبعد من 6 GHz، وليه التداخل بيحصل.',
        },
        { type: 'diagram', id: 'rf-wave-visualization', caption: 'موجة RF وخصائصها: amplitude وwavelength وphase.' },
        {
          type: 'paragraph',
          text: 'العلاقة الذهبية: `λ = c / f` يعني طول الموجة = سرعة الضوء ÷ التردد. لما التردد **يزيد**، طول الموجة **يقل**. طول الموجة الأطول بيتعامل أحسن مع العوائق والمسافة؛ والأقصر بيسمح بطيف أوسع وسرعات أعلى.',
        },
        { type: 'diagram', id: 'rf-frequency-wavelength', caption: 'تردد أعلى يعني طول موجة أقصر.' },
        { type: 'paragraph', text: '**الخصائص الأساسية**' },
        { type: 'table', headers: ['المفهوم', 'المعنى', 'المثال/الوحدة', 'الأهمية العملية'], rows: rfRows },
        { type: 'paragraph', text: '**كيف تنتقل الموجة؟**' },
        {
          type: 'list',
          items: [
            '**Propagation**: الموجة تنتقل من الهوائي في الهواء وتتأثر بالمسافة والعوائق.',
            '**Amplitude**: مرتبطة بقدرة الإشارة؛ القدرة الأعلى بتوصل أبعد لحد الحدود التنظيمية.',
            '**Phase**: موضع الموجة داخل الدورة؛ Wi-Fi بيستخدم تغيير الـ phase والـ amplitude لنقل البتات.',
            '**Attenuation**: فقدان القدرة مع المسافة والمواد.',
          ],
        },
        { type: 'paragraph', text: '**قياس القدرة: dBm**' },
        {
          type: 'paragraph',
          text: 'الـ **dBm** بيقيس القدرة بالنسبة لـ 1 milliwatt. قيمة زي `-67 dBm` تعني قدرة صغيرة جداً وصلت للعميل، وهذا طبيعي. **(0 dBm = 1 mW)**. المهم: القيمة لازم تكون **سالبة**، واللي أقرب للصفر أقوى. لازم تعرف كمان إن dBm مقياس **لوغاريتمي**، مش خطي: الفرق 3 dB يعني تقريباً ضعف أو نصف القدرة.',
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'قاعدة قراءة سريعة',
          text: '`-30 dBm` أقوى من `-70 dBm`، و`-70 dBm` أقوى من `-90 dBm`. متحفظش أرقام كحدود مقدّسة؛ بس اعرف الاتجاه.',
        },
        {
          type: 'code',
          label: 'Frequency and power relationship',
          language: 'text',
          code: `λ = c / f

c ≈ 3 × 10^8 m/s (in air)
f = 2.4 GHz  -> λ ≈ 12.5 cm
f = 5 GHz    -> λ ≈ 6 cm

0 dBm  = 1 mW
-3 dBm ≈ 0.5 mW
-67 dBm = received power example (not a threshold guarantee)`,
        },
      ],
    },
    {
      id: 'packet',
      title: 'نطاقات Wi-Fi: 2.4 GHz و5 GHz و6 GHz',
      short: 'النطاقات',
      blocks: [
        {
          type: 'paragraph',
          text: 'النطاق (band) هو نطاق تردد واسع بيحتوي على قنوات كتير. Wi-Fi الحديث بيشتغل في ثلاث نطاقات رئيسية. مفيش نطاق «أفضل مطلقاً»؛ الاختيار بيتبع الاحتياج.',
        },
        { type: 'diagram', id: 'wifi-bands-compare', caption: 'مقارنة المدى والاختراق والسرعة والقنوات بين النطاقات.' },
        { type: 'paragraph', text: '**مقارنة النطاقات**' },
        { type: 'table', headers: ['النطاق', 'المدى', 'الاختراق', 'الـ throughput المحتمل', 'القنوات', 'الازدحام', 'الاستخدام'], rows: bandRows },
        { type: 'paragraph', text: '**2.4 GHz**' },
        {
          type: 'list',
          items: [
            'طول موجة أطول = مدى أبعد واختراق أفضل للجدران.',
            'عدد قنوات أقل (مثال 1–11 أو 1–13 حسب البلد، و14 في حالات خاصة).',
            'أكثر نطاق ازدحاماً بسبب Bluetooth والميكروويف وأجهزة الجيران.',
            'مناسب لـ IoT والأجهزة البعيدة والمساحات الكبيرة اللي محتاجة تغطية.',
          ],
        },
        { type: 'paragraph', text: '**5 GHz**' },
        {
          type: 'list',
          items: [
            'قنوات أكتر وعرض قناة أوسع متاح = throughput أعلى.',
            'الجدران والمسافة بتأثر فيه أكتر من 2.4 GHz.',
            'مناسب للابتوبس والستريمنج والمكاتب متوسطة الحجم.',
            'بيدعم DFS في بعض القنوات حسب التنظيم المحلي (مشاركة مع الرادار).',
          ],
        },
        { type: 'paragraph', text: '**6 GHz**' },
        {
          type: 'list',
          items: [
            'طيف واسع جداً وقنوات نظيفة غالباً، وبيسمح بـ 80/160 MHz بسهولة.',
            'مدى أقصر واختراق أضعف؛ بيحتاج تخطيط AP أدق.',
            'بيحتاج أجهزة **Wi-Fi 6E** أو **Wi-Fi 7**، والدعم بيختلف حسب البلد.',
            'مثال عملي: مكتب مفتوح فيه لابتوبات حديثة وقريب من الـ APs.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'قاعدة تنظيمية مهمة',
          text: 'القنوات المتاحة والقدرة القصوى المسموحة **بتختلف حسب البلد**. الأمثلة في الدرس تعليمية؛ راجع دايماً الـ regulatory domain بتاع جهازك.',
        },
        { type: 'paragraph', text: '**أمثلة اختيار واقعية**' },
        {
          type: 'steps',
          items: [
            { title: 'موبايل في غرفة بعيدة خلف جدارين', text: 'ابدأ بـ 2.4 GHz للمدى والاختراق، لو السرعة كافية خلاص.' },
            { title: 'لابتوب بيعمل video call جنب الـ AP', text: 'استخدم 5 GHz أو 6 GHz لطيف أنظف وسرعة أعلى.' },
            { title: 'مستشعر IoT رخيص يدعم 2.4 فقط', text: 'أكد 2.4 GHz وخطّط قناة غير مزدحمة قدر الإمكان.' },
          ],
        },
      ],
    },
    {
      id: 'config',
      title: 'قنوات Wi-Fi وعرض القناة',
      short: 'القنوات',
      blocks: [
        {
          type: 'paragraph',
          text: 'الـ **channel** هو نطاق ترددي محدد جوّه النطاق. في 2.4 GHz مراكز القنوات بتبعد 5 MHz عن بعضها، لكن القناة نفسها عرضها 20 MHz؛ عشان كده القنوات المتجاورة بتتداخل.',
        },
        { type: 'diagram', id: 'wifi-channel-allocation', caption: 'قنوات 2.4 GHz وتداخل القنوات المتجاورة.' },
        { type: 'paragraph', text: '**قنوات غير متداخلة**' },
        {
          type: 'paragraph',
          text: 'مثال شائع في مناطق كتير: **1 و6 و11** عند عرض 20 MHz. ده مثال عملي مش قاعدة تنظيمية عالمية؛ بعض البلاد بتسمح 1–13، لازم تراجع القنوات المتاحة عندك.',
        },
        {
          type: 'paragraph',
          text: 'لو اخترنا 1 و3 مثلاً، النطاقين يتداخلوا ويحصل **adjacent-channel interference**؛ الإطارات تتلف وتحصل إعادة إرسال كتير. لو اثنين APs على القناة 6، ده **co-channel**: بيتقاسموا الـ airtime.',
        },
        { type: 'paragraph', text: '**عرض القناة (Channel Width)**' },
        { type: 'diagram', id: 'wifi-channel-width', caption: 'مقارنة 20 و40 و80 و160 MHz.' },
        { type: 'table', headers: ['العرض', 'الوصف', 'الـ throughput المحتمل', 'التعرض للتداخل', 'متى يُستخدم'], rows: widthRows },
        {
          type: 'callout',
          tone: 'tip',
          title: 'المفاضلة',
          text: 'العرض الأكبر = سرعة أعلى **في طيف نظيف**، بس قنوات غير متداخلة أقل وحساسية أكتر للتداخل. في بيئة مزدحمة، 20 أو 40 MHz غالباً أثبت من 80 أو 160 MHz.',
        },
        {
          type: 'paragraph',
          text: 'عرض القناة متاح بشكل مختلف حسب النطاق والجهاز والتنظيم. 20 MHz هو الأساس في 2.4 GHz؛ 40/80/160 MHz بيظهروا غالباً في 5 و6 GHz مع أجهزة حديثة.',
        },
        {
          type: 'list',
          items: [
            '**Channel bonding**: ضم قنوات متجاورة لتكوين قناة أوسع.',
            '**Primary channel**: القناة الأساسية اللي بيستخدمها الـ AP للإدارة والتحكم في تشغيل القناة الأوسع.',
            'القناة الأوسع بتحتاج جهاز عميل يدعمها؛ مش كل الأجهزة بتستفيد.',
          ],
        },
      ],
    },
    {
      id: 'verify',
      title: 'التداخل وفقدان الإشارة',
      short: 'التداخل',
      blocks: [
        {
          type: 'paragraph',
          text: 'الإشارة بتوصل للعميل بقدرة أقل ما بترحل. التداخل والعوائق بيخلّوا الاتصال بطيء أو غير مستقر حتى لو الـ RSSI شكله «كويس».',
        },
        { type: 'diagram', id: 'wifi-interference-types', caption: 'Co-channel مقابل adjacent-channel ومصادر تداخل تانية.' },
        { type: 'paragraph', text: '**أنواع التداخل**' },
        { type: 'table', headers: ['النوع', 'السبب', 'الأثر', 'الاتجاه العام للحل'], rows: interferenceRows },
        { type: 'paragraph', text: '**كيف تفقد الإشارة قدرتها؟**' },
        {
          type: 'list',
          items: [
            '**Reflection**: الموجة ترتد من سطح أملس (معدن/جدار). ممكن تنتج **multipath**؛ نسخ كتير توصل في أوقات مختلفة وتتداخل.',
            '**Refraction**: انحراف الموجة لما تمر بين مادتين مختلفتين زي الهواء والزجاج.',
            '**Diffraction**: انحناء الموجة حوالين حافة عائق، وبيسمح بوصول جزئي لمناطق مخفية.',
            '**Absorption**: امتصاص جزء من الطاقة وتحويله لحرارة داخل المادة (جدران، جسم إنسان، مياه).',
            '**Distance**: كل ما زادت المسافة، قلت القدرة المستقبَلة (path loss).',
          ],
        },
        { type: 'diagram', id: 'wifi-signal-attenuation', caption: 'فقدان الإشارة مع المسافة والعوائق.' },
        { type: 'diagram', id: 'wifi-propagation-effects', caption: 'Reflection وrefraction وdiffraction وabsorption.' },
        {
          type: 'callout',
          tone: 'warning',
          title: 'فقدان المواد توضيحي',
          text: 'القيم اللي بتشوفها في الرسوم توضيحية فقط. الخرسانة والمعدن والمرايا وخزانات المياه بتسبب فقدان أكتر من drywall، لكن الرقم الحقيقي بيعتمد على السماكة والتركيب والتردد.',
        },
        { type: 'paragraph', text: '**ليه الاتصال بطيء والـ RSSI عالي؟**' },
        {
          type: 'list',
          items: [
            'قناة مزدحمة: الـ AP والعملاء بيتقاسموا الـ airtime (co-channel).',
            'قناة متداخلة: إطارات بتتلف وتحصل retransmissions (adjacent).',
            'SNR ضعيف: الضوضاء قريبة من الإشارة.',
            'جهاز عميل قديم أو إعدادات منخفضة أو backhaul سلكي بطيء.',
          ],
        },
      ],
    },
    {
      id: 'mistakes',
      title: 'قوة الإشارة: RSSI وdBm وSNR',
      short: 'جودة الإشارة',
      blocks: [
        {
          type: 'paragraph',
          text: '**RSSI** بيقول لك قد إيه القدرة وصلت، لكنه مش كل الحكاية. لازم تنظر للضوضاء كمان عشان تعرف الهامش الحقيقي.',
        },
        { type: 'diagram', id: 'wifi-rssi-noise-floor', caption: 'RSSI وnoise floor على مقياس dBm.' },
        { type: 'diagram', id: 'wifi-snr-compare', caption: 'مقارنة SNR في بيئة نظيفة وبيئة مزعجة.' },
        { type: 'paragraph', text: '**العلاقات الأساسية**' },
        {
          type: 'code',
          label: 'RSSI and SNR calculation',
          language: 'text',
          code: `RSSI  = received signal strength (dBm)
Noise = noise floor (dBm)
SNR   = RSSI - Noise   (dB)

Example A:
  RSSI  = -67 dBm
  Noise = -95 dBm
  SNR   = 28 dB   -> healthy margin

Example B:
  RSSI  = -80 dBm
  Noise = -82 dBm
  SNR   = 2 dB    -> poor margin`,
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'أخطاء شائعة في القراءة',
          text: '❌ `-90 dBm` أقوى من `-40 dBm`. (غلط: الأقرب للصفر أقوى.) ❌ «RSSI عالي = سرعة عالية». (غلط: الازدحام والـ SNR والـ retransmissions مهمين.) ❌ «رقم RSSI واحد يناسب كل الأجهزة». (غلط: مفيش عتبة عالمية مضمونة.)',
        },
        { type: 'paragraph', text: '**تشخيص سريع**' },
        {
          type: 'list',
          items: [
            'RSSI منخفض جداً (أكتر سالبية): قلّل المسافة أو العوائق أو غيّر النطاق.',
            'RSSI كويس لكن SNR منخفض: فيه ضوضاء قريبة؛ ابحث عن مصدر تداخل.',
            'RSSI وSNR كويسين والسرعة بطيئة: راجع airtime والقناة والجهاز والـ backhaul.',
          ],
        },
        {
          type: 'paragraph',
          text: 'مثال توضيحي: جهاز بيshow `-55 dBm` و`-60 dBm` في غرفتين مختلفتين. الأول أقوى، بس لو التاني فيه ضوضاء أقل بكتير، التاني ممكن يكون أسرع فعلياً.',
        },
      ],
    },
    {
      id: 'lab',
      title: 'أساسيات الأمان اللاسلكي',
      short: 'الأمان',
      blocks: [
        {
          type: 'paragraph',
          text: 'الأمان اللاسلكي بيمنع أي حد قريب من الـ SSID من دخول الشبكة أو قراءة البيانات. في CCNA المطلوب **التعريف** مش إعدادات تفصيلية.',
        },
        { type: 'diagram', id: 'wifi-security-evolution', caption: 'تطور WEP وWPA وWPA2 وWPA3 وPSK مقابل Enterprise.' },
        { type: 'paragraph', text: '**تطوير التشفير**' },
        {
          type: 'list',
          items: [
            '**WEP**: قديم وضعيف جداً (RC4 وIV). ما تستخدمهوش.',
            '**WPA**: حل انتقالي استخدم TKIP. أفضل من WEP لكنه deprecated.',
            '**WPA2**: بيستخدم **AES-CCMP**، وهو لسه شائع ومقبول.',
            '**WPA3**: بيضيف **SAE** في Personal و**PMF** وخصائص أقوى في Enterprise. أحسن من WPA2.',
          ],
        },
        { type: 'paragraph', text: '**PSK مقابل Enterprise**' },
        {
          type: 'table',
          headers: ['النوع', 'طريقة المصادقة', 'مناسب لـ', 'ملاحظة'],
          rows: [
            ['PSK / Personal', 'كل العملاء يستخدموا نفس الـ passphrase', 'البيت، مكتب صغير', 'سهل؛ مشاركة الـ password خطر'],
            ['Enterprise', '802.1X + RADIUS وحساب/شهادة لكل مستخدم', 'الشركات والجامعات', 'تحكم أدق وإدارة أفضل'],
          ],
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'حدود الموضوع',
          text: 'هنا بنعرف الأنواع بس. إعداد RADIUS و802.1X وWLAN profiles بالتفصيل بتيجي في topics لاحقة؛ متدخلش في تفاصيلها هنا.',
        },
        { type: 'paragraph', text: '**خريطة ذهنية سريعة**' },
        {
          type: 'steps',
          items: [
            { title: 'SSID', text: 'اسم الشبكة — مش تشفير.' },
            { title: 'Encryption', text: 'WPA2/WPA3 — بيحمي البيانات.' },
            { title: 'Authentication', text: 'PSK (مشتركة) أو Enterprise (فردية).' },
          ],
        },
      ],
    },
    {
      id: 'exam',
      title: 'المعمل العملي والمراجعة',
      short: 'المعمل والمراجعة',
      blocks: [
        {
          type: 'paragraph',
          text: 'هنتدرب على تفكير CCNA: نلاحظ، نقيس، نغيّر حاجة واحدة، ثم نعيد القياس. اللابورات دي **conceptual**؛ أي أوامر IOS هنا عامة مش نتائج تنفيذ على أجهزة حقيقية.',
        },
        { type: 'diagram', id: 'wireless-lab-topology', caption: 'توبولوجيا معمل لاسلكي بـ APs وعملاء ومصدر تداخل.' },
        { type: 'paragraph', text: '**سير عمل التشخيص (12 خطوة)**' },
        { type: 'diagram', id: 'wireless-troubleshooting-flow', caption: '12 خطوة لتشخيص مشاكل Wi-Fi.' },
        {
          type: 'steps',
          items: [
            { title: '1 - حدد النطاق', text: 'جهاز واحد ولا كل العملاء؟ قريب من الـ AP ولا بعيد؟' },
            { title: '2 - SSID والنطاق', text: 'تأكد إن العميل على SSID الصح، وبينتمي لـ 2.4/5/6 GHz المتوقع.' },
            { title: '3 - المصادقة', text: 'هل الدخول ناجح؟ WPA2/WPA3 وكلمة المرور أو الحساب صح؟' },
            { title: '4 - عنوان IP', text: 'بعد الاتصال، هل فيه IP صحيح وdefault gateway؟ اللاسلكي لسه لازم IP.' },
            { title: '5 - RSSI', text: 'سجّل قيمة dBm في أماكن مختلفة.' },
            { title: '6 - Noise floor', text: 'اعرف مستوى الضوضاء في نفس المكان والوقت.' },
            { title: '7 - SNR', text: 'احسب الفرق وقرّر لو الهامش كافٍ.' },
            { title: '8 - القناة', text: 'حدّد رقم القناة وعرضها، وهل القنوات متداخلة مع APs تانية.' },
            { title: '9 - Co-channel', text: 'شوف هل فيه APs تانية على نفس القناة بتتقاسم الـ airtime.' },
            { title: '10 - مصادر غير Wi-Fi', text: 'ميكروويف، Bluetooth، هواتف، رادار، أو عوائق مادية.' },
            { title: '11 - غيّر حاجة واحدة', text: 'قناة، عرض، نطاق، أو موقع — مش كلهم مع بعض.' },
            { title: '12 - أعد القياس وسجّل', text: 'قارن النتيجة بالأساس اللي سجلته في الخطوة 5.' },
          ],
        },
        { type: 'paragraph', text: '**Lab 1 - اختيار النطاق (conceptual / Packet Tracer)**' },
        {
          type: 'steps',
          items: [
            { title: 'الهدف', text: 'قارن 2.4 GHz و5 GHz من حيث RSSI والسرعة والمسافة.' },
            { title: 'الخطوة 1', text: 'ابدأ بالعميل قريب من AP1 (مثلاً على 5 GHz) وسجّل RSSI والسرعة.' },
            { title: 'الخطوة 2', text: 'حرّك العميل تدريجياً بعيد وخلف جدار؛ أعد التسجيل.' },
            { title: 'الخطوة 3', text: 'كرّر التجربة على 2.4 GHz.' },
            { title: 'الخطوة 4', text: 'قارن: أي نطاق فضل أطول مدى؟ وأي نطاق أعطى throughput أعلى وهو قريب؟' },
            { title: 'الخلاصة المتوقعة', text: '2.4 GHz غالباً أبعد؛ 5 GHz أسرع لما المسافة قصيرة والطيف أنظف.' },
          ],
        },
        { type: 'paragraph', text: '**Lab 2 - القنوات والتداخل (conceptual / Packet Tracer)**' },
        {
          type: 'steps',
          items: [
            { title: 'الهدف', text: 'شوف أثر القنوات غير المتداخلة مقابل المتداخلة في منطقة تتوفر فيها 1/6/11.' },
            { title: 'الخطوة 1', text: 'اضبط AP1 على القناة 1 وAP2 على القناة 6 (20 MHz) في منطقة تسمح بذلك.' },
            { title: 'الخطوة 2', text: 'قِس الأداء وسجّل حالة الإطارات/إعادة الإرسال إن توفرت في الأداة.' },
            { title: 'الخطوة 3', text: 'غيّر AP2 للقناة 3 (متداخلة مع 1) وأعد القياس.' },
            { title: 'الخطوة 4', text: 'غيّر AP2 للقناة 1 (co-channel) وأعد القياس.' },
            { title: 'الخلاصة المتوقعة', text: '1+6 أفضل من 1+3؛ co-channel بيقلل السرعة بالتقاسم، وadjacent بيسبب تلفاً وإعادة إرسال.' },
          ],
        },
        { type: 'paragraph', text: '**أوامر تحقق IOS عامة (مش أوامر RF)**' },
        {
          type: 'code',
          label: 'General IOS verification commands',
          language: 'text',
          code: `Router# show interfaces
Router# show ip interface brief
Router# show running-config

! These verify general interface / IP / configuration state.
! They do NOT show RF details like RSSI or SNR.
! Controller / AP RF commands are platform-specific and vary by vendor/model.`,
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'مهم',
          text: 'الأوامر دي **عامة** على IOS ومش مخصصة للاسلكي. الأوامر اللي بتعرض RSSI أو قنوات الـ RF بتاعة الـ controller/AP بتختلف حسب المنصة. مفيش output هنا أدّعي إني نفذته على جهاز حقيقي.',
        },
        { type: 'paragraph', text: '**اختبار CCNA**' },
        {
          type: 'paragraph',
          text: 'كل سؤال أربع إجابات. بعد الاختيار اضغط **تحقق من الإجابة**. مفيش feedback قبل Submission، والزر مقفول لحد ما تختار. بعد Submission الأزرار بتتقفل.',
        },
        {
          type: 'quiz',
          questions: [
            {
              id: 'q1',
              prompt: 'أي مقارنة بين 2.4 GHz و5 GHz صحيحة في الظروف النموذجية؟',
              options: [
                '2.4 GHz له مدى أطول واختراق أفضل، لكنه غالباً أكثر ازدحاماً.',
                '5 GHz له مدى أطول واختراق أفضل من 2.4 GHz.',
                '2.4 GHz يدعم قنوات أوسع دايماً من 5 GHz.',
                '6 GHz له نفس مدى 2.4 GHz في كل البيئات.',
              ],
              correctIndex: 0,
              requireSubmit: true,
              explanation:
                'الصح هو **(A)**. 2.4 GHz له طول موجة أطول فيعطي مدى واختراق أفضل، لكن طيفه محدود ومزدحم. 5 GHz أسرع وأوسع لكن مداه أقصر.',
            },
            {
              id: 'q2',
              kind: 'multiple',
              prompt: 'اختر كل العبارات الصحيحة عن RSSI وSNR. (اختر أكثر من إجابة)',
              options: [
                'RSSI غالباً قيمة dBm سالبة، والأقرب للصفر أقوى.',
                'SNR = RSSI - Noise floor بالـ dBm.',
                'RSSI القوي لوحده يضمن سرعة إنترنت عالية دايماً.',
                'Noise floor الأقرب للصفر يعني ضوضاء أقل.',
              ],
              correctIndices: [0, 1],
              requireSubmit: true,
              explanation:
                'الصح هو **(A) و(B)**. RSSI سالب والأقرب للصفر أقوى، وSNR هو الفرق بينه وبين الـ noise floor. الـ noise الأكتر سالبية يعني هدوء، والـ RSSI لوحده مش ضمان للسرعة.',
            },
            {
              id: 'q3',
              prompt: 'في منطقة تسمح بالقنوات 1 و6 و11، أي إعداد 2.4 GHz (عرض 20 MHz) أفضل لتقليل التداخل بين APs؟',
              options: [
                'AP1 على 1 وAP2 على 3 لأن القنوات متجاورة.',
                'AP1 على 6 وAP2 على 6 لأن نفس القناة معناها ما فيش تداخل.',
                'AP1 على 1 وAP2 على 11 لأنهما قنوات غير متداخلة في هذا المثال.',
                'AP1 على 2 وAP2 على 7 لأن الأرقام أكبر.',
              ],
              correctIndex: 2,
              requireSubmit: true,
              explanation:
                'الصح هو **(C)**. 1 و11 (و6 كمان) مثال شائع لقنوات غير متداخلة عند 20 MHz في المناطق اللي تسمح بذلك. 1 و3 متداخلتان، ونفس القناة بتتقاسم الـ airtime.',
            },
            {
              id: 'q4',
              kind: 'multiple',
              prompt: 'أي من التالي بيسبب فقدان أو تشويه إشارة Wi-Fi؟ (اختر كل ما ينطبق)',
              options: [
                'Reflection من الأسطح المعدنية.',
                'Absorption في الجدران والأجسام.',
                'Co-channel APs على نفس القناة.',
                'استخدام WPA2 بدل WEP.',
              ],
              correctIndices: [0, 1, 2],
              requireSubmit: true,
              explanation:
                'الصح هو **(A) و(B) و(C)**. Reflection وabsorption بيأثروا على القدرة والمسار، وco-channel بيقلل الـ airtime. WPA2 تحسين أمني مش سبب لتشويه الإشارة.',
            },
            {
              id: 'q5',
              prompt: 'أي تعريف صحيح لبروتوكولات أمان Wi-Fi؟',
              options: [
                'WEP هو الأحدث والأقوى.',
                'WPA2 يستخدم AES-CCMP، وWPA3 يضيف SAE في Personal.',
                'PSK يعني مصادقة لكل مستخدم عبر RADIUS.',
                'إخفاء SSID بديل عن التشفير.',
              ],
              correctIndex: 1,
              requireSubmit: true,
              explanation:
                'الصح هو **(B)**. WPA2 بيستخدم AES-CCMP؛ WPA3 بيضيف SAE في Personal وخصائص أقوى. WEP قديم، PSK مشاركة كلمة مرور، وإخفاء SSID مش تشفير.',
            },
          ],
        },
      ],
    },
    {
      id: 'summary',
      title: 'مراجعة CCNA والملخص',
      short: 'الخلاصة',
      blocks: [
        { type: 'paragraph', text: '**أهم 10 نقاط**' },
        {
          type: 'list',
          items: [
            'RF موجات كهرومغناطيسية؛ التردد الأعلى يعني طول موجة أقصر.',
            '`λ = c / f` هي العلاقة اللي لازم تعرفها.',
            'القدرة بـ dBm؛ القيم سالبة والأقرب للصفر أقوى.',
            'RSSI = قوة الإشارة المستقبَلة؛ SNR = RSSI - Noise floor.',
            '2.4 GHz: مدى واختراق أحسن، قنوات أقل وازدحام أعلى.',
            '5 GHz: طيف أكبر وسرعة أعلى، مدى أقصر.',
            '6 GHz: طيف واسع جداً، مدى أقصر، محتاج Wi-Fi 6E/7 وتنظيم محلي.',
            'قنوات 1/6/11 مثال شائع غير متداخل عند 20 MHz — مش قاعدة عالمية.',
            '20/40/80/160 MHz: العرض الأكبر أسرع في طيف نظيف وأكثر تعرضاً للتداخل.',
            'WEP ضعيف، WPA قديم، WPA2 شائع، WPA3 حديث؛ PSK مقابل Enterprise.',
          ],
        },
        { type: 'paragraph', text: '**قبل ما تكمّل**' },
        {
          type: 'callout',
          tone: 'info',
          title: 'الموضوع الجاي',
          text: 'الموضوع `1.12` بيتكلم عن **virtualization fundamentals**. الروابط لسه بتشير للمكان المعتاد، بس الموضوع نفسه مش مطبّق لسه.',
        },
      ],
    },
  ],
}
