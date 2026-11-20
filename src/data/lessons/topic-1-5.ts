import type { Lesson } from '../types'

const commonPortRows: string[][] = [
  ['HTTP', '80', 'TCP'],
  ['HTTPS (HTTP/1.1 and HTTP/2)', '443', 'TCP'],
  ['SSH', '22', 'TCP'],
  ['Telnet', '23', 'TCP'],
  ['FTP Control', '21', 'TCP'],
  ['SMTP', '25', 'TCP'],
  ['DNS', '53', 'UDP and TCP'],
  ['DHCP Server', '67', 'UDP'],
  ['DHCP Client', '68', 'UDP'],
  ['TFTP', '69', 'UDP'],
  ['SNMP', '161', 'UDP'],
  ['NTP', '123', 'UDP'],
  ['POP3', '110', 'TCP'],
  ['IMAP', '143', 'TCP'],
]

export const topic15Lesson: Lesson = {
  topicId: '1.5',
  title: 'مقارنة TCP بـ UDP',
  description:
    'في الدرس ده هنتعلّم إزاي الـ Transport Layer بيوصل البيانات من تطبيق لتطبيق، وإيه الفرق بين TCP و UDP من حيث الاتصال، الموثوقية، الترتيب، الـ overhead والمنافذ. هشوف handshake بالأرقام، flags، إعادة الإرسال، flow control، أوامر تحقق، لاب Packet Tracer، وخمسة أسئلة CCNA.',
  estimatedTime: '~75 دقيقة',
  steps: [
    {
      id: 'what',
      title: 'إيه اللي إحنا بندرسه وليه وجوده مهم؟',
      short: 'مفهوم الدرس',
      blocks: [
        {
          type: 'paragraph',
          text: 'لحد دلوقتي اتكلّمنا عن إزاي الإطار يتنقل على الكابل، وإزاي الـ IP بيوصل الـ packet لجهاز. السؤال الجديد: **بعد ما الـ packet وصل للجهاز، أي تطبيق جوه ياخده؟** هنا بيدخل الـ `Transport Layer`؛ هو المسئول عن `Process-to-Process Communication`، مش بس `Host-to-Host`.',
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'مكان الدرس في الـ blueprint',
          text: 'الموضوع ده هو Objective `1.5` في دومين `Network Fundamentals`: مقارنة `TCP` بـ `UDP`. الامتحان بيجيب سيناريوهات فيها منافذ، handshake، acknowledgment numbers، flags، أو فرق بين reliable stream و datagrams، ومطلوب منك تختار السلوك الصح.',
        },
        {
          type: 'table',
          headers: ['المصطلح', 'معناه', 'مثال بسيط'],
          rows: [
            [
              '`Transport Layer`',
              'الطبقة اللي بتوصل البيانات بين عمليات التطبيقات على أجهزة مختلفة',
              'متصفح على PC بيتكلم مع web server على سيرفر',
            ],
            [
              '`TCP` — Transmission Control Protocol',
              'بروتوكول connection-oriented بيقدّم reliable ordered byte stream',
              'HTTP، HTTPS، SSH، SMTP',
            ],
            [
              '`UDP` — User Datagram Protocol',
              'بروتوكول connectionless بيقدّم datagrams مستقلة بأقل overhead',
              'DNS queries، DHCP، NTP، voice/video',
            ],
            [
              '`Process-to-Process Communication`',
              'إن الـ packet يتوجّه لتطبيق معيّن جوه الجهاز مش للجهاز بس',
              'نفس IP عليه web service و DNS service في نفس الوقت',
            ],
            [
              '`Port Number`',
              'رقم من 0 لـ 65535 بيميّز تطبيق/خدمة جوه الجهاز',
              '`443` لـ HTTPS TCP، `53` لـ DNS غالباً UDP',
            ],
            [
              '`Multiplexing` / `Demultiplexing`',
              'إرسال أكتر من تطبيق على نفس الـ IP، ثم توجيه كل رد للتطبيق الصح',
              'متصفح + DNS client + Voice app على نفس PC',
            ],
            [
              '`Socket`',
              'عنوان Socket: `IP address : port number` — بيعرّف endpoint للتطبيق',
              '`192.168.20.10:443`',
            ],
          ],
        },
        {
          type: 'paragraph',
          text: 'لو عندك جهاز واحد وعAddr IP واحد، ده مش كفاية عشان تعرف البيانات رايحة لمين. الـ `IP address` بيوصل لـ **host**، أمّا الـ `port number` بيوصل لـ **process** جوه الـ host. عشان كده بنحتاج بروتوكولات النقل: هي اللي بتضيف المنافذ، وتقرر لو فيه handshake و ACKs ولا لا. الـ `five-tuple` — `source IP`, `source port`, `destination IP`, `destination port`, `protocol` — هو اللي بيميّز الجلسة فعلياً.',
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'تشبيه من الحياة الواقعية',
          text: 'تخيّل `TCP` زي شركة شحن بترسل كل حزمة برقم تسلسل، وتطلب إيصال استلام، ولو حزمة ضاعت تعيدها، وترتّبها قبل تسليمها للمستلم. ده مناسب لملف أو صفحة ويب لازم توصل كاملة. أمّا `UDP` زي ميكروفون إذاعة: بيبعت رسالة قصيرة دلوقتي، لو واحدة ضاعت مش هيرجع يطلبها، لأن انتظار الإعادة ممكن يخلّي الصوت متأخر. الاتنين مفيدين — كل واحد في مكانه.',
        },
        {
          type: 'list',
          items: [
            '**Web Browsing**: `HTTP` على `TCP 80` و `HTTPS` التقليدي على `TCP 443` — لازم الصفحة توصل كاملة ومرتبة.',
            '**Email**: `SMTP 25`، `POP3 110`، و `IMAP 143` على `TCP` — الرسالة لازم توصل صحيحة.',
            '**File Transfer**: `FTP Control` على `TCP 21` — أوامر التحكم لازم توصل موثوقة.',
            '**DNS**: استعلامات قياسية غالباً `UDP 53` لأنها قصيرة وسريعة؛ والـ `TCP 53` بيستخدم في حالات زي `zone transfers` وبعض الاستعلامات الكبيرة أو ظروف معينة.',
            '**Voice and Video**: غالباً `UDP` مع بروتوكولات زي `RTP`، لأن التأخير أضر من فقد حزمة صغيرة؛ التطبيق بيتعامل مع jitter/filtering.',
            '**Online Gaming**: كتير من الألعاب بتستخدم `UDP` مع منطق خاصة بالتطبيق عشان تخلي الحركة سريعة وتصحّح الحالة المهمة بنفسها.',
          ],
        },
        {
          type: 'table',
          headers: ['السؤال', 'TCP', 'UDP'],
          rows: [
            ['فيه اتصال قبل البيانات؟', 'نعم — `three-way handshake`', 'لا — مفيش handshake جوه UDP'],
            ['ضمان وصول وترتيب؟', 'نعم داخل الاتصال', 'لا ضمان مدمج'],
            ['حجم الـ header', '20 byte كحد أدنى، ويزيد مع `options`', '8 byte ثابتة'],
            ['إعادة إرسال و flow control؟', 'مدمج في TCP', 'مش مدمج؛ التطبيق لو عايز يعملها بنفسه'],
            ['أمثلة', 'HTTP، HTTPS، SSH، SMTP', 'DNS، DHCP، NTP، voice/video'],
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'قاعدة مهمة',
          text: '`UDP` مش معناه \"بروتوكول وحش\"، و`TCP` مش معناه \"أسرع دايماً\". الاختيار trade-off بين الموثوقية والترتيب وبين تقليل الـ overhead وتأخير البدء. وiazepام وراء الاختيار هو احتياج التطبيق مش تفضيل شخصي.',
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
          text: 'السبع أهداف دول هم جوهر الموضوع: خصائص `TCP`، خصائص `UDP`، الفرق بين connection-oriented و connectionless، الـ handshake، الـ flags، الموثوقية، والمنافذ. اقرأهم كصورة واحدة: الـ Transport Layer بيختار \"إزاي\" يوصل البيانات، مش \"فين\" يوجّهها فقط.',
        },
        {
          type: 'callout',
          tone: 'info',
          title: '1 — خصائص TCP',
          text: '`TCP` بروتوكول `Connection-Oriented`: لازم ينشئ connection قبل البيانات وينهيه بعدها. بيقدّم `Reliable Delivery` بالـ acknowledgments وإعادة الإرسال، و`Ordered Data Delivery` بالـ sequence numbers، و`Error Detection` بالـ checksum. كمان بيعمل `Flow Control` لحماية المستقبل و `Congestion Control` لحماية الشبكة، وبيشتغل `Full-Duplex` يعني البيانات تمشي في الاتجاهين في نفس الوقت.',
        },
        {
          type: 'list',
          items: [
            '**Connection Establishment**: `SYN` ثم `SYN-ACK` ثم `ACK` قبل أول بيانات تطبيق.',
            '**Reliable Delivery**: كل بايت لازم يتأكد عليه؛ اللي ما وصلش يتعاد إرساله.',
            '**Ordered Delivery**: الـ receiver يرتب الـ segments حسب الـ sequence numbers قبل تسليمها للتطبيق.',
            '**Acknowledgments**: الـ ACK رقمه هو \"البايت التالي المتوقع\"، مش عدد البايتات المستلمة.',
            '**Retransmission**: فقد أو duplicate ACK بيؤدي لإعادة إرسال الجزء المفقود.',
            '**Flow Control**: الـ receiver يعلن `receive window` عشان يقول للمرسل قد إيه يقدر يستقبل.',
            '**Congestion Control**: المرسل يقلّل سرعته لما الشبكة تزحم باستخدام `congestion window`.',
            '**Full-Duplex**: كل طرف يرسل ويستقبل في نفس الوقت داخل نفس الاتصال.',
            '**Byte Stream**: TCP بيتعامل مع البيانات كتدفق بايتات متصل، مش رسائل منفصلة بحدود محفوظة.',
            '**Overhead and State**: الموثوقية مش مجانية؛ فيه header أكبر، حالة اتصال، timers، و buffers.',
          ],
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'فخ مهم: TCP مش \"رسائل\"',
          text: 'لو التطبيق كتب \"مرحبا\" ثم \"باي\"، TCP مش مضمون إن الـ receiver هيقرأهم كرسالتين منفصلتين بالحدود دي. هيحصل على **byte stream** متصل، والتطبيق نفسه بيقرأ منه حسب احتياجه. عشان كده بنقول `reliable byte stream` مش `reliable messages`.',
        },
        {
          type: 'callout',
          tone: 'info',
          title: '2 — خصائص UDP',
          text: '`UDP` بروتوكول `Connectionless`: كل `datagram` مستقل ومفيش handshake أو حالة اتصال جوه UDP نفسه. بيقدّم `Best-Effort Delivery`، يعني بيحاول يوصل من غير ضمان. مفيش `built-in retransmission`، ولا ضمان وصول، ولا ضمان ترتيب. في المقابل الـ header صغير وثابت 8 byte، وبيحافظ على `message boundaries` — كل `datagram` بيوصل كوحدة مستقلة لو وصل.',
        },
        {
          type: 'list',
          items: [
            '**Datagram-Based**: كل وحدة البيانات ليها بداية ونهاية واضحة.',
            '**No Built-in Retransmission**: لو ضاعت، UDP نفسه مش هيطلبها تاني.',
            '**No Delivery Guarantee**: مفيش ACK يأكد الوصول.',
            '**No Ordering Guarantee**: التاني ممكن يوصل قبل الأول.',
            '**Low Protocol Overhead**: 8 byte بس، ومفيش connection state أو handshake.',
            '**Message Boundaries**: التطبيق يستلم datagrams كما أُرسلت.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'هل UDP أسرع دايماً؟',
          text: 'لا. UDP **بيسمح** بتأخير أقل في البداية لأن مفيش handshake ولا انتظار ACKs، وده مفيد لتطبيقات حساسة للتأخير. بس \"أقل latency\" مش مضمون في كل موقف؛ ازدحام الشبكة، معالجة التطبيق، والـ buffering ممكن يسيطروا على التأخير الفعلي.',
        },
        {
          type: 'callout',
          tone: 'info',
          title: '3 — connection-oriented مقابل connectionless',
          text: 'الفرق الأساسي مش \"فيه روح ولا لا\"، بل فين بتتخزّن الحالة ومن بيضمن إيه.',
        },
        {
          type: 'table',
          headers: ['الجانب', 'TCP — connection-oriented', 'UDP — connectionless'],
          rows: [
            ['قبل البيانات', 'Connection establishment بـ handshake', 'مفيش transport-level handshake'],
            ['Connection State', 'مطلوب في الطرفين: seq, ack, windows, timers', 'UDP نفسه مش محتاج حالة اتصال'],
            ['الإرسال', 'Byte stream داخل connection', 'Datagrams مستقلة'],
            ['Acknowledgments', 'مدمجة', 'مش مدمجة'],
            ['Retransmission', 'مدمج', 'مش مدمج'],
            ['الترتيب', 'مضمون داخل الاتصال', 'مش مضمون'],
            ['الإنهاء', 'Connection termination منظّم بـ FIN', 'مفيش إنهاء على مستوى UDP'],
            ['حالة التطبيق', 'الـ connection state جوه TCP', 'التطبيق نفسه ممكن يحتفظ بحالة جلسة لو عايز'],
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'دقة امتحانية',
          text: '`connectionless` معناه إن **UDP نفسه** مفيش حالة اتصال. مش معناه إن التطبيق مفيش عنده state؛ تطبيقات زي DNS أو gaming ممكن تبني جلسة/logic خاصة فوق UDP.',
        },
        {
          type: 'callout',
          tone: 'info',
          title: '4 — TCP Three-Way Handshake',
          text: 'الهدف إن الطرفين يتأكدوا إن التاني موجود، ويتفقوا على نقطة بداية الأرقام التسلسلية. الـ `ISN` هو `Initial Sequence Number` لكل اتجاه. جرّب المثال ده خطوة بخطوة:',
        },
        {
          type: 'steps',
          items: [
            { title: '1 — SYN', text: 'Client → Server: `SYN`, `Seq = 1000`. العميل بيعلن ISN بتاعه وبيبدأ الاتصال.' },
            { title: '2 — SYN-ACK', text: 'Server → Client: `SYN-ACK`, `Seq = 5000`, `Ack = 1001`. السيرفر بيعلن ISN بتاعه ويأكد استلام SYN العميل.' },
            { title: '3 — ACK', text: 'Client → Server: `ACK`, `Seq = 1001`, `Ack = 5001`. العميل بيأكد استلام SYN السيرفر.' },
            { title: 'النتيجة', text: 'الاتنين بيدخلوا `ESTABLISHED` وتبدأ بيانات التطبيق. الـ ACK دايماً بيقول "البايت التالي اللي متوقع"' },
          ],
        },
        {
          type: 'paragraph',
          text: 'ليه `Ack = 1001`؟ لأن الـ `SYN` بيستهلك **sequence number واحد** رغم إن مفيش بيانات تطبيق جوه. العميل بعت البايت 1000، فالسيرفر مستني البايت 1001. بنفس المنطق، `SYN` السيرفر بـ `Seq = 5000` بيخلّي العميل يرد بـ `Ack = 5001`.',
        },
        {
          type: 'callout',
          tone: 'info',
          title: '5 — TCP Flags',
          text: 'الـ flags بتتحكم في حالة الاتصال وسلوك البيانات. دول أهم اللي بيجوا في CCNA Fundamentals:',
        },
        {
          type: 'table',
          headers: ['Flag', 'المعنى', 'الغرض', 'متى بيستخدم؟', 'مثال'],
          rows: [
            ['`SYN`', 'Synchronize', 'يبدأ handshake ويعلن ISN', 'بداية الاتصال', '`SYN, Seq=1000`'],
            ['`ACK`', 'Acknowledgment', 'يأكد استلام البيانات ويحدد التالي المتوقع', 'بعد استلام SYN أو بيانات', '`Ack=1001`'],
            ['`FIN`', 'Finish', 'يطلب إنهاء منظّم للاتصال', 'لما التطبيق يخلص الإرسال', 'أول رسالة في الـ four-way close'],
            ['`RST`', 'Reset', 'يقطع الاتصال فوراً', 'خطأ أو منفذ مفيش عليه listener', 'رد على بيانات لمنفذ مغلق'],
            ['`PSH`', 'Push', 'يطلب دفع البيانات للتطبيق بدل انتظار الـ buffer', 'لما التطبيق محتاج البيانات دلوقتي', 'بيانات تفاعلية'],
            ['`URG`', 'Urgent', 'بيعلّم إن فيه بيانات عاجلة مع `Urgent Pointer`', 'حالات نادرة/خاصة', '`URG` مع مؤشر عاجل'],
          ],
        },
        {
          type: 'paragraph',
          text: 'التركيبات الشائعة: `SYN` للبداية، `SYN-ACK` للرد، `ACK` للتأكيد، `FIN-ACK` أثناء الإغلاق، و `RST` للقطع الفوري. فيه كمان ECN-related flags في TCP الحديث، بس تركيزنا هنا على اللي محتاجه CCNA Fundamentals.',
        },
        {
          type: 'callout',
          tone: 'info',
          title: '6 — TCP Reliability',
          text: 'الموثوقية مش \"مؤقت واحد ثابت\"، بل منظومة متكاملة:',
        },
        {
          type: 'list',
          items: [
            '**Sequence Numbers**: بترقّم البايتات، فالـ receiver يعرف يرتب ويكتشف الناقص.',
            '**Acknowledgment Numbers**: بتقول البايت التالي المتوقع، فالتأكيد تراكمي.',
            '**Retransmission**: لو ACK ما وصلش خلال `RTO`، المرسل يعيد الإرسال.',
            '**Adaptive RTO**: الـ `Retransmission Timeout` بيتحدّث ديناميكياً حسب قياسات `RTT`؛ مش قيمة ثابتة زي \"ثانية واحدة\".',
            '**Duplicate ACKs**: وصول أكتر من ACK بنفس الرقم بيشير إن سيغمنت ضاع، وممكن يؤدي لـ `fast retransmit` قبل انتهاء الـ RTO.',
            '**Sliding Window**: بيسمح بإرسال عدة segments قبل انتظار ACK لكل واحد، ويتزحزق مع التقدم.',
            '**Receive Window (`rwnd`)**: المستقبل يعلن المساحة المتاحة في الـ buffer — أداة `Flow Control`.',
            '**Congestion Window (`cwnd`)**: المرسل يقدّر سعة الشبكة ويقللها عند الازدحام — أداة `Congestion Control`.',
          ],
        },
        {
          type: 'table',
          headers: ['المشكلة', 'إزاي TCP بيتعامل معاها؟'],
          rows: [
            ['Lost segment', 'غياب ACK أو duplicate ACKs → إعادة إرسال Segment المفقود'],
            ['Out-of-order segment', 'الـ sequence numbers بترتّب البيانات قبل تسليمها للتطبيق'],
            ['Duplicate segment', 'الـ sequence numbers والـ cumulative ACKs بيسمحوا بتجاهل التكرار'],
            ['Corrupted segment', 'فشل الـ checksum عند المستقبل → الإطار/Segment يتسقط، فيغيب ACK ويحصل retransmit'],
            ['Receiver limitations', 'الـ `rwnd` بيقلّل الإرسال لحد ما الـ buffer يفضى'],
          ],
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'Flow Control ≠ Congestion Control',
          text: '`Flow Control` بيحمي **المستقبل** من الغرق: الـ `rwnd` بيقول \"عندي مساحة قد إيه\". أمّا `Congestion Control` بيحمي **الشبكة** من الزحمة: الـ `cwnd` بيقلّل الإرسال لما فيه loss/تأخير في المسار. لو لخّصت الاتنين في جملة واحدة في الامتحان، هتقع في فخ.',
        },
        {
          type: 'callout',
          tone: 'info',
          title: '7 — Port Numbers',
          text: 'الـ `port number` رقم من 16 bit بيتحط في الـ header عشان يحدد التطبيق. فيه `source port` بيختاره العميل غالباً من نطاق `ephemeral`، و `destination port` بيكون غالباً منفذ الخدمة اللي السيرفر بيسمع عليه.',
        },
        {
          type: 'table',
          headers: ['النطاق', 'المدى', 'الاستخدام'],
          rows: [
            ['Well-Known Ports', '0–1023', 'خدمات مشهورة زي 80، 443، 22، 53'],
            ['Registered Ports', '1024–49151', 'خدمات مسجّلة لتطبيقات معينة'],
            ['Dynamic / Private / Ephemeral Ports', '49152–65535', 'منافذ مؤقتة بيختارها العميل للجلسات الصادرة'],
          ],
        },
        {
          type: 'list',
          items: [
            '**TCP ports و UDP ports منفصلون**: رقم 53 TCP غير رقم 53 UDP؛ كل بروتوكول له namespace خاص.',
            '**Server Listening Port**: السيرفر بيسمع على منفذ معروف زي 443 أو 53.',
            '**Socket**: `IP:port` بيعرّف endpoint؛ مثال `192.168.20.10:443`.',
            '**Five-tuple**: `source IP`, `source port`, `destination IP`, `destination port`, `protocol` — بيعرّف الاتصال بشكل فريد.',
            '**تنبيه**: رقم المنفذ لوحده مش إثبات للتطبيق؛ لازم تعرف البروتوكول والخدمة الفعلية والسياق.',
          ],
        },
        {
          type: 'table',
          headers: ['Protocol', 'Port', 'Transport'],
          rows: commonPortRows,
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'حالتان لازم تستوعبهم',
          text: '**DNS**: الاستعلام القياسي غالباً `UDP 53`، بس `TCP 53` بيستخدم في `zone transfers` وبعض الحالات التانية. **HTTPS**: HTTP/1.1 و HTTP/2 بيستخدموا `TCP 443`، أمّا `HTTP/3` بيستخدم `QUIC over UDP 443`. كمان `FTP Control` هو `TCP 21` — متقولش إن FTP كله 20 فقط.',
        },
      ],
    },
    {
      id: 'packet',
      title: 'الشرح على مستوى الـ segment والـ datagram',
      short: 'الرسومات',
      blocks: [
        {
          type: 'paragraph',
          text: 'كل الرسومات دول تعليمية فيها حركة حقيقية للبيانات: اضغط `شغّل` أو `السابق` / `التالي` / `إعادة`. الأرقام في مثال الـ handshake هي نفس الأرقام اللي هتقابلها في الامتحان: `1000` و `5000`.',
        },
        { type: 'diagram', id: 'transport-tcp-udp', caption: 'TCP مقابل UDP: reliable byte stream في مقابل datagrams مستقلة، مع process-to-process communication.' },
        {
          type: 'paragraph',
          text: 'الصورة الكبيرة: الـ IP بيوصل للـ host، والـ port بيوصل للتطبيق. `TCP` بيضيف حالة وموثوقية، و`UDP` بيفضّل الخفة وحدود الرسالة. نفس التطبيق ممكن يستخدم بروتوكولين مختلفين في أوقات مختلفة — زي DNS.',
        },
        { type: 'diagram', id: 'transport-tcp-header', caption: 'TCP segment header: اختار أي field عشان تشوف وظيفته — min header 20 byte قبل الـ options.' },
        {
          type: 'paragraph',
          text: 'في الـ TCP header فيه `Source Port` و `Destination Port`، وبعدين `Sequence Number` و `Acknowledgment Number`، وبعدين `Header Length` و الـ flags و `Window Size` و `Checksum` و `Urgent Pointer` و `Options` و أخيراً الـ `Payload`. الـ `Options` ممكن تزوّد الحجم عن 20 byte — زي `MSS` و `window scale` و `timestamps`.',
        },
        { type: 'diagram', id: 'transport-udp-header', caption: 'UDP datagram header: 4 fields بس بـ 8 byte، والـ payload بيحافظ على حدود الرسالة.' },
        {
          type: 'paragraph',
          text: 'الـ UDP header أصغر بكتير: `Source Port`، `Destination Port`، `Length`، `Checksum` — 8 byte بس. الـ checksum في IPv4 اختياري من ناحية UDP وفي IPv6 إلزامي؛ لو فشل الـ checksum الـ datagram يتسقط، بس UDP مش هيعيد إرساله.',
        },
        { type: 'diagram', id: 'transport-handshake', caption: 'Three-way handshake: SYN Seq=1000، SYN-ACK Seq=5000 Ack=1001، ACK Seq=1001 Ack=5001.' },
        {
          type: 'paragraph',
          text: 'لاحظ إن الـ `Ack` دايماً بيسبق الـ `Seq` التالي المتوقع بواحد بعد الـ SYN. `SYN` بيستهلك seq number واحد، والاتنين بيدخلوا `ESTABLISHED` بعد الرسالة التالتة.',
        },
        { type: 'diagram', id: 'transport-termination', caption: 'Four-way termination: FIN، ACK، FIN، ACK مع FIN-WAIT، CLOSE-WAIT، LAST-ACK، TIME-WAIT و CLOSED.' },
        {
          type: 'paragraph',
          text: 'الإغلاق الشائع أربع رسائل: العميل بيرسل `FIN`، السيرفر يرد `ACK`، السيرفر يرسل `FIN`، والعميل يرد `ACK` ويدخل `TIME-WAIT`. الحالات:`FIN-WAIT-1`, `FIN-WAIT-2`, `CLOSE-WAIT`, `LAST-ACK`, `TIME-WAIT`, `CLOSED`. عملياً ممكن يتجمع `FIN` مع `ACK` أو يختلف الترتيب حسب التوقيت — فما تحفظش إنها دايماً أربع رسائل منفصلة.',
        },
        { type: 'diagram', id: 'transport-flags', caption: 'TCP flags: SYN، ACK، FIN، RST، PSH، URG والتركيبات الشائعة.' },
        { type: 'diagram', id: 'transport-seq-ack', caption: 'Sequence و ACK numbers: ترتيب، فقد، وصول خارج الترتيب، و duplicate ACK.' },
        {
          type: 'paragraph',
          text: 'مثال الأرقام: إرسال `Seq=1000` (100 byte) بيخلّي الـ ACK التالي `1100`، وبعدين `Seq=1100` بيخلّيه `1200`. لو `Seq=1200` ضاع ووصل `Seq=1300`، الـ receiver يرسل `duplicate ACK=1200`. لما يتعاد إرسال `1200`، الـ cumulative ACK يبقى `1400` لأن اللي بعده كان وصل بالفعل.',
        },
        { type: 'diagram', id: 'transport-retransmission', caption: 'Retransmission: RTO متكيّف و duplicate ACKs — الرسم مبسّط والتنفيذ الحقيقي أعقد.' },
        {
          type: 'callout',
          tone: 'warning',
          title: 'تعليمي مقابل تنفيذي',
          text: 'رسومات الـ reliability هنا **مبسّطة تعليمياً**. TCP الحقيقي بيستخدم خوارزميات مختلفة حسب الإصدار (`Tahoe`, `Reno`, `Cubic` وغيرها)، وقياس `RTT`، وتحديث ديناميكي للـ `RTO`. في CCNA Fundamentals المطلوب منك فهم الفكرة: seq/ack، إعادة إرسال، نوافذ، وحماية المستقبل والشبكة.',
        },
        { type: 'diagram', id: 'transport-sliding-window', caption: 'Sliding window: الـ rwnd بيحمي المستقبل، والـ cwnd بيحمي الشبكة.' },
        { type: 'diagram', id: 'transport-port-flow', caption: 'TCP و UDP ports على نفس السيرفر، والـ five-tuple اللي بيميّز الجلسة.' },
      ],
    },
    {
      id: 'config',
      title: 'إعداد Cisco IOS لفهم transport communication',
      short: 'أوامر الإعداد',
      blocks: [
        {
          type: 'callout',
          tone: 'info',
          title: 'قاعدة مهمة',
          text: '`TCP` و `UDP` بروتوكولات Transport Layer، ومفيش أمر Cisco IOS واحد بي \"فعّل TCP\" أو \"فعّل UDP\" بشكل global. اللي بيبقى تحت تحكمك هو الـ IP connectivity، خدمات التطبيقات على السيرفر، والـ ACLs اللي بتسمح أو تمنع tcp/udp.',
        },
        {
          type: 'paragraph',
          text: 'التوبولوجيا: `PC1 → SW1 → R1 → Server`. الـ switch شغال بطبقة 2 الافتراضية، والـ R1 هو الـ default gateway للشبكتين. هضبط الواجهتين، وبعدين أجرّب HTTP على TCP و DNS على UDP، وأوضّح إن `ping` مش بيستخدم منافذ TCP أو UDP.',
        },
        {
          type: 'table',
          headers: ['الجهاز', 'المنفذ / الواجهة', 'عنوان IP', 'قناع الشبكة', 'الدور'],
          rows: [
            ['`PC1`', 'NIC', '192.168.10.10', '255.255.255.0', 'Client'],
            ['`R1`', 'GigabitEthernet 0/0', '192.168.10.1', '255.255.255.0', 'Gateway للـ LAN'],
            ['`R1`', 'GigabitEthernet 0/1', '192.168.20.1', '255.255.255.0', 'Gateway للسيرفر'],
            ['`Server`', 'NIC', '192.168.20.10', '255.255.255.0', 'HTTP + DNS server'],
          ],
        },
        {
          type: 'code',
          label: 'R1 — إعداد الواجهتين',
          language: 'ios',
          code: `R1> enable
R1# configure terminal

R1(config)# interface gigabitEthernet 0/0
R1(config-if)# ip address 192.168.10.1 255.255.255.0
R1(config-if)# no shutdown

R1(config)# interface gigabitEthernet 0/1
R1(config-if)# ip address 192.168.20.1 255.255.255.0
R1(config-if)# no shutdown`,
        },
        {
          type: 'table',
          headers: ['الأمر', 'بيعمل إيه؟'],
          rows: [
            ['`enable`', 'يدخل privileged EXEC mode عشان أوامر `configure` و `show`.'],
            ['`configure terminal`', 'يفتح global configuration mode.'],
            ['`interface gigabitEthernet 0/0`', 'يدخل إعداد الواجهة المتصلة بشبكة PC1.'],
            ['`ip address 192.168.10.1 255.255.255.0`', 'يدي الواجهة عنوان IP وقناع شبكة /24.'],
            ['`no shutdown`', 'يفتح الواجهة إدارياً ويخليها `up/up` لما الكابل سليم.'],
            ['`interface gigabitEthernet 0/1`', 'يدخل إعداد الواجهة المتصلة بالسيرفر.'],
            ['`ip address 192.168.20.1 255.255.255.0`', 'يدي الواجهة عنوان الـ gateway للسيرفر.'],
          ],
        },
        {
          type: 'paragraph',
          text: 'بعد كده اضبط PC1 بـ `192.168.10.10/24` و default gateway `192.168.10.1`، والسيرفر بـ `192.168.20.10/24` و gateway `192.168.20.1`. من PC1 جرّب `ping 192.168.20.10` قبل أي اختبار تطبيق. لو الـ ping فشل، المشكلة في IP/gateway/interface مش في TCP أو UDP.',
        },
        {
          type: 'code',
          label: 'Application tests من PC1',
          language: 'powershell',
          code: `ping 192.168.20.10
http://192.168.20.10
nslookup www.ccna-lab.local 192.168.20.10`,
        },
        {
          type: 'list',
          items: [
            '**HTTP over TCP**: فتح `http://192.168.20.10` بيعمل connection إلى `TCP 80`، handshake، ثم طلب ورد.',
            '**DNS over UDP**: `nslookup` غالباً يبعت استعلام قصير إلى `UDP 53` ويستنى رد سريع.',
            '**Ping**: بيستخدم `ICMP`، يعني \"مش TCP ومش UDP\"، ومفيش source/destination port في ICMP header.',
          ],
        },
        {
          type: 'code',
          label: 'ACLs لتحديد TCP و UDP — أمثلة تمثيلية',
          language: 'ios',
          code: `access-list 101 permit tcp any host 192.168.20.10 eq 80
access-list 101 permit udp any host 192.168.20.10 eq 53`,
        },
        {
          type: 'table',
          headers: ['الجزء', 'المعنى'],
          rows: [
            ['`permit`', 'يسمح بالترافيك المطابق بدل ما يمنعه.'],
            ['`tcp` / `udp`', 'بيحدد بروتوكول الـ Transport Layer اللي الـ ACL يفحصه.'],
            ['`any`', 'أي source address.'],
            ['`host 192.168.20.10`', 'عنوان destination واحد بالظبط.'],
            ['`eq 80` / `eq 53`', 'مطابقة destination port بالضبط — `eq` يعني equal.'],
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'مش تعليمات نشر كاملة',
          text: 'السطرين دول **أمثلة على ACL entries** فقط. الـ ACL الكامل محتاج ترتيب قواعد، وغالباً `implicit deny` في الآخر، وتطبيقه على interface بـ `ip access-group 101 in` أو `out` في الاتجاه الصح. هنا هدفنا بس إنك تتعرف على شكل مطابقة `tcp` و `udp` في الامتحان.',
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
          text: 'الـ verification هنا معناه: مين بيسمع على أنه منفذ، أنه connection جوه `ESTABLISHED`، وأنه UDP socket مفتوح، وهل الـ ACL شاف ترافيك فعلاً ولا لا. صيغة المخرجات مختلفة بين Windows و Linux و IOS، فركز على المعنى.',
        },
        {
          type: 'table',
          headers: ['البيئة', 'الأمر', 'بيوضّح إيه؟'],
          rows: [
            ['Windows', '`ipconfig`', 'عنوان IP والقناع والـ gateway للعميل.'],
            ['Windows', '`netstat -ano`', 'المنافذ والـ connections مع PID.'],
            ['Windows', '`netstat -an`', 'كل المنافذ والـ connections من غير أسماء برامج.'],
            ['Linux', '`ss -tulnp`', 'Listening TCP و UDP sockets مع العملية.'],
            ['Linux', '`ss -tan`', 'TCP connections وحالتها.'],
            ['Cisco IOS', '`show access-lists`', 'قواعد ACL وعدد الـ matches.'],
            ['Cisco IOS', '`show ip interface brief`', 'حالة الواجهات وعناوين IP.'],
            ['Cisco IOS', '`show running-config`', 'الإعداد الفعلي على الراوتر.'],
          ],
        },
        {
          type: 'code',
          label: 'Windows — مخرجات تمثيلية',
          language: 'powershell',
          code: `C:\\> ipconfig
IPv4 Address . . . . . . . . . . . : 192.168.10.10
Subnet Mask . . . . . . . . . . . : 255.255.255.0
Default Gateway . . . . . . . . . : 192.168.10.1

C:\\> netstat -ano
Proto  Local Address          Foreign Address        State        PID
TCP    192.168.10.10:49152   192.168.20.10:443     ESTABLISHED  5824
TCP    127.0.0.1:50259       0.0.0.0:0              LISTENING    9120

C:\\> netstat -an
UDP    0.0.0.0:5353          *:*`,
        },
        {
          type: 'table',
          headers: ['الحقل', 'القراءة'],
          rows: [
            ['`Local Address`', 'عنوان ومنفذ الجهاز المحلي — `:49152` مثلًا source port مؤقت.'],
            ['`Foreign Address`', 'عنوان ومنفذ الطرف التاني — `:443` مثلًا منفذ الخدمة.'],
            ['`State`', 'حالة الاتصال: `LISTENING`, `ESTABLISHED`, `TIME_WAIT`, `CLOSE_WAIT`.'],
            ['`PID`', 'معرّف العملية اللي فتحت المنفذ أو الاتصال.'],
            ['`UDP` lines', 'غالباً مفيش State لأن UDP connectionless.'],
          ],
        },
        {
          type: 'code',
          label: 'Linux — مخرجات تمثيلية',
          language: 'bash',
          code: `$ ss -tulnp
Netid  State   Local Address:Port   Peer Address:Port   Process
tcp    LISTEN  0.0.0.0:443          0.0.0.0:*           users:(("nginx",pid=1200))
udp    UNCONN  0.0.0.0:53           0.0.0.0:*           users:(("named",pid=980))

$ ss -tan
State       Recv-Q  Send-Q  Local Address:Port       Peer Address:Port
ESTAB       0       0       192.168.10.10:49152     192.168.20.10:443
TIME-WAIT   0       0       192.168.10.10:49151     192.168.20.10:80`,
        },
        {
          type: 'code',
          label: 'Cisco IOS — مخرجات تمثيلية',
          language: 'ios',
          code: `R1# show access-lists
Extended IP access list 101
    10 permit tcp any host 192.168.20.10 eq 80 (24 matches)
    20 permit udp any host 192.168.20.10 eq 53 (7 matches)

R1# show ip interface brief
Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0     192.168.10.1    YES manual up                    up
GigabitEthernet0/1     192.168.20.1    YES manual up                    up

R1# show running-config | include access-list|interface|ip address`,
        },
        {
          type: 'table',
          headers: ['الحالة', 'معناها'],
          rows: [
            ['`LISTENING`', 'التطبيق مفتوح ومنتظر اتصالات واردة على المنفذ ده.'],
            ['`ESTABLISHED`', 'فيه TCP connection قايم وممكن البيانات تتبادل.'],
            ['`TIME_WAIT`', 'الاتصال قفل، والطرف بيستنى شوية عشان يتأكد إن الـ ACK وصل.'],
            ['`CLOSE_WAIT`', 'الطرف التاني بعت FIN، والتطبيق المحلي لسه ما قفلش Socket بتاعه.'],
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'المخرجات بتختلف',
          text: '`netstat` و `ss` بيختلفوا في الأعمدة والأسماء بين إصدارات Windows و Linux. كمان الـ ACL `matches` بيزيدوا بس لو الترافيك فعللاً عبر الـ ACL واتطابق مع القاعدة. لو مفيش matches، راجع الاتجاه والـ interface والتطبيق نفسه.',
        },
      ],
    },
    {
      id: 'mistakes',
      title: 'عشرة أخطاء وسيناريوهات تشخيصية',
      short: 'التشخيص',
      blocks: [
        {
          type: 'callout',
          tone: 'info',
          title: 'منهجية ثابتة',
          text: '`1)` حدّد التطبيق والمنفذ المتوقع · `2)` تأكد من IP connectivity · `3)` شوف مين بيسمع على المنفذ · `4)` افحص الـ firewall/ACL · `5)` راجع حالة TCP أو رد UDP · `6)` غيّر حاجة واحدة فقط · `7)` أعد التحقق. ما تبدأش بإعادة ضبط الشبكة كلها قبل ما تعرف إذا المشكلة في transport ولا في IP.',
        },
        {
          type: 'table',
          headers: ['السيناريو', 'الأعراض', 'أسباب محتملة', 'التحقق', 'الأوامر/الأدوات', 'الحل'],
          rows: [
            [
              '1. الخلط بين TCP و UDP',
              'متصفح شغال بس DNS أو voice مش شغال، أو العكس',
              'فهم غلط إن المنفذ الواحد معناه نفس البروتوكول',
              'راجع `TCP 443` مقابل `UDP 53`، وافحص الـ protocol في الـ capture',
              '`netstat -ano` · `ss -tulnp` · Packet Tracer Simulation',
              'افحص البروتوكول والمنفذ معاً؛ 53 TCP غير 53 UDP',
            ],
            [
              '2. افتراض إن UDP أسرع دايماً',
              'الخدمة على UDP بطيئة رغم غياب handshake',
              'ازدحام، jitter، أو معالجة تطبيق؛ مش طبيعة UDP لوحدها',
              'قارن الزمن من العميل للسيرفر تحت حمل مختلف',
              '`ping` · capture timing · application logs',
              'حسّن المسار أو الـ buffering؛ استخدم TCP لو التطبيق محتاج موثوقية',
            ],
            [
              '3. اعتبار TCP رسائل منفصلة',
              'البيانات توصل ملزوقة أو مقسّمة بشكل مش متوقع للتطبيق',
              'الاعتماد على حدود رسائل مش موجودة في byte stream',
              'راجع إن التطبيق بيقرأ من stream مش من datagrams',
              'application logs · protocol analyzer',
              'صمّم framing واضح داخل التطبيق (length prefix مثلًا) ولا تفترض حدود TCP',
            ],
            [
              '4. حساب ACK غلط',
              'طالب بيقول `Ack=1000` بعد `SYN Seq=1000`',
              'نسي إن SYN بيستهلك sequence number واحد',
              'راجع كل خطوة في handshake',
              'diagram · packet capture',
              'الصح `Ack=1001` والقاعدة: ACK = البايت التالي المتوقع',
            ],
            [
              '5. الخلط بين flow و congestion control',
              'بيقال إن `rwnd` بيحمي الشبكة أو إن `cwnd` من السيرفر',
              'خلط بين حماية المستقبل وحماية المسار',
              'اسأل: مين بيعلن الرقم ومين بيستفيد منه؟',
              'capture TCP headers · lesson diagram',
              '`rwnd` من المستقبل لحماية الـ buffer؛ `cwnd` عند المرسل لحماية الشبكة',
            ],
            [
              '6. destination port غلط',
              'اتصال مرفوض فوراً أو مفيش رد من الخدمة',
              'المستخدم كتب 8080 بدل 80 أو 443 بدل 53',
              'قارن المنفذ في العنوان بالمنفذ اللي السيرفر بيسمع عليه',
              '`netstat -ano` · `ss -tulnp` · `show access-lists`',
              'صحّح المنفذ في URL أو إعداد التطبيق،وتأكد من listening socket',
            ],
            [
              '7. Firewall أو ACL بيمنع tcp/udp',
              'الـ ping شغال بس HTTP أو DNS فاشل',
              'قاعدة تمنع tcp 80 أو udp 53، أو ACL مطبّق في الاتجاه الغلط',
              'شوف الـ matches والـ drops واتجاه التطبيق',
              '`show access-lists` · firewall logs ·Packet Tracer ACL',
              'عدّل القاعدة وطبّقها على الـ interface والاتجاه الصح',
            ],
            [
              '8. التطبيق بيسمع على منفذ غلط',
              'المنفذ مفتوح بس الخدمة مش رادة',
              'HTTP مضبوط على 8080 بينما العميل بيطلب 80',
              'دوّر على mين بيسمع فعلاً على المنفذ',
              '`netstat -ano` · `ss -tulnp` · server config',
              'غيّر إعداد الخدمة أو العميل عشان يتطابقا',
            ],
            [
              '9. TCP connection timeout',
              'الصفحة تفتح بعد انتظار طويل أو \"Connection timed out\"',
              'SYN واصل بس SYN-ACK مش راجع، route، firewall، أو سيرفر مشغول',
              'تابع handshake خطوة بخطوة وشوف فين اتوقف',
              '`show ip interface brief` · `show access-lists` · packet capture',
              'أصلح المسار أو القاعدة أو حالة السيرفر، وتأكد من listening port',
            ],
            [
              '10. UDP application مفيش رد',
              'استعلام DNS ضايع ومفيش رسالة خطأ واضحة',
              'السيرفر مش شغال، منفذ غلط، أو الرد اتسقط في المسار',
              'جرّب سيرفر DNS تاني وقارن الطلب والرد',
              '`nslookup` · `ipconfig` · `ss -tulnp` · capture',
              'شغّل خدمة DNS، صحّح `UDP 53`، وراجع الـ firewall والمسار',
            ],
          ],
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'مثال عملي 1 — PC1 مش بيفتح HTTP',
          text: 'الـ `ping 192.168.20.10` شغال، بس `http://192.168.20.10` فاشل. يعني الـ IP connectivity تمام، والمشكلة في `TCP 80`: هل السيرفر بيسمع على 80؟ هل فيه ACL بيمنع `tcp eq 80`؟ جرّب `ss -tulnp` على السيرفر و `show access-lists` على R1، وبعدين أصلح حاجة واحدة فقط.',
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'مثال عملي 2 — DNS بيقطع بس HTTP شغال',
          text: 'المتصفح بيفتح مواقع بالـ IP بس الأسماء مش بتتحل. ده غالباً `UDP 53`: تأكد من إعداد DNS client على PC1، وإن خدمة DNS شغالة على `192.168.20.10`، وإن مفيش ACL بيمنع `udp eq 53`. جرّب `nslookup www.ccna-lab.local 192.168.20.10` وقارن النتيجة.',
        },
      ],
    },
    {
      id: 'lab',
      title: 'لاب Packet Tracer: TCP و UDP في application communication',
      short: 'لاب عملي',
      blocks: [
        {
          type: 'paragraph',
          text: 'هتبني شبكة صغيرة فيها PC و سيرفر وراوتر وسويتش، وبعدين هشوف بعيني الفرق بين `HTTP over TCP` و `DNS over UDP` في Simulation Mode. الأجهزة: `1 Router` + `1 Switch` + `1 PC` + `1 Server`.',
        },
        {
          type: 'table',
          headers: ['من', 'إلى', 'المنفذ', 'ملاحظة'],
          rows: [
            ['`PC1`', '`SW1`', 'FastEthernet0/1', 'Copper straight-through'],
            ['`SW1`', '`R1`', 'GigabitEthernet0/1 ↔ GigabitEthernet0/0', 'Uplink'],
            ['`R1`', '`Server`', 'GigabitEthernet0/1', 'Copper straight-through'],
          ],
        },
        {
          type: 'table',
          headers: ['الجهاز', 'عنوان IP', 'القناع', 'الـ gateway'],
          rows: [
            ['`PC1`', '192.168.10.10', '255.255.255.0', '192.168.10.1'],
            ['`R1 G0/0`', '192.168.10.1', '255.255.255.0', '—'],
            ['`R1 G0/1`', '192.168.20.1', '255.255.255.0', '—'],
            ['`Server`', '192.168.20.10', '255.255.255.0', '192.168.20.1'],
          ],
        },
        {
          type: 'code',
          label: 'R1 — إعداد الواجهات',
          language: 'ios',
          code: `enable
configure terminal
hostname R1
!
interface gigabitEthernet 0/0
 ip address 192.168.10.1 255.255.255.0
 no shutdown
!
interface gigabitEthernet 0/1
 ip address 192.168.20.1 255.255.255.0
 no shutdown
end
copy running-config startup-config`,
        },
        {
          type: 'steps',
          items: [
            {
              title: 'إعداد الخدمة على السيرفر',
              text: 'افتح Server → Services. فعّل `HTTP` وفعّل `DNS` لو الإصدار بتاع Packet Tracer بيدعمها. في DNS أضف A record: `www.ccna-lab.local → 192.168.20.10`. اضبط IP والـ gateway من تبويب Desktop → IP Configuration.',
            },
            {
              title: 'المهمة 1 — IP connectivity',
              text: 'من PC1 اعمل `ping 192.168.10.1` ثم `ping 192.168.20.1` ثم `ping 192.168.20.10`. لازم كلهم ينجحوا قبل ما تروح للتطبيقات. لو فشل، راجع الواجهات والـ gateway.',
            },
            {
              title: 'المهمة 2 — HTTP over TCP',
              text: 'من PC1 افتح `http://192.168.20.10` من Web Browser. في Simulation Mode شوف أحداث `TCP`: SYN، SYN-ACK، ACK، ثم HTTP GET والرد. دوّن source port المؤقت و destination port `80`.',
            },
            {
              title: 'المهمة 3 — DNS over UDP',
              text: 'من PC1 اعمل `nslookup www.ccna-lab.local 192.168.20.10`. في Simulation Mode دوّن إن الطلب والرد `UDP` وإن المنفذ `53` في الـ destination. قارن غياب الـ handshake مع HTTP.',
            },
            {
              title: 'المهمة 4 — Ping كـ ICMP',
              text: 'اعمل `ping 192.168.20.10` تاني في Simulation Mode. لاحظ إن الرسائل `ICMP` ومفيش source/destination port — عشان Ping مش TCP ومش UDP.',
            },
            {
              title: 'المهمة 5 — مقارنة المنافذ',
              text: 'في تفاصيل كل PDU اكتب الـ five-tuple: source IP، source port، destination IP، destination port، protocol. قارن HTTP بـ DNS و Ping.',
            },
            {
              title: 'المهمة 6 — تحدي تشخيصي',
              text: 'طفّي HTTP service أو غيّر DNS record، ثم حاول تاني. شوف إيه PDU بيختفي، وأصلح الخدمة، وأعد التحقق. جرّب كمان ACL بسيط يمنع `udp eq 53` ولاحظ إن DNS بيقع بينما HTTP لسه شغال.',
            },
            {
              title: 'المهمة 7 — الخلاصة',
              text: 'وسجّل جدول صغير: HTTP = TCP/80 + handshake + ACKs؛ DNS = UDP/53 + request/reply؛ Ping = ICMP + مفيش ports. ده الملخص اللي المفروض تخرج بيه من اللاب.',
            },
          ],
        },
        {
          type: 'table',
          headers: ['الاختبار', 'البروتوكول', 'Source Port', 'Destination Port', 'السلوك المتوقع'],
          rows: [
            ['HTTP web page', 'TCP', 'ephemeral (مثال 49152)', '80', 'handshake ثم ACKs وبيانات مرتبة'],
            ['DNS lookup', 'UDP', 'ephemeral (مثال 49153)', '53', 'request و reply من غير handshake'],
            ['Ping', 'ICMP', 'لا يوجد port', 'لا يوجد port', 'echo request / echo reply'],
          ],
        },
        {
          type: 'code',
          label: 'نتائج متوقعة — تحقق سريع',
          language: 'ios',
          code: `R1# show ip interface brief
Interface              IP-Address      OK? Method Status    Protocol
GigabitEthernet0/0     192.168.10.1    YES manual up        up
GigabitEthernet0/1     192.168.20.1    YES manual up        up

PC1> ping 192.168.20.10
Reply from 192.168.20.10: bytes=32 time<1ms TTL=128
Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)`,
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'حدود Packet Tracer',
          text: 'Packet Tracer بيحاكي الأحداث بشكل تعليمي مبسّط: هيوريك SYN/SYN-ACK/ACK و PDU للـ UDP، بس **مش** بيعرض كل تفاصيل TCP implementation زي الـ adaptive RTO، الـ congestion algorithms، أو كل خيارات الـ options. اللي هنا هتشوفه كافي لفهم CCNA Fundamentals، مش بديل عن packet analyzer حقيقي.',
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
              prompt: 'أي عبارات عن TCP و UDP صحيحة؟ اختر أكثر من إجابة.',
              options: [
                'TCP connection-oriented وبيقدّم reliable ordered byte stream مع three-way handshake',
                'UDP connection-oriented وبيضمن delivery و retransmission مدمج',
                'UDP connectionless datagrams وبيستخدم 8-byte header ومفيش acknowledgments مدمجة',
                'TCP header دايماً 8 byte ومفيش flow control',
              ],
              kind: 'multiple',
              correctIndices: [0, 2],
              requireSubmit: true,
              explanation:
                'الصح هو **(A) و (C)**: TCP connection-oriented وموثوق ومرتب، و UDP connectionless بخفة و8-byte header. **(B)** غلط لأن UDP مفيش handshake ولا ضمان ولا retransmission مدمج. **(D)** غلط لأن TCP minimum header 20 byte وفيه flow control.',
            },
            {
              id: 'q2',
              prompt: 'Client ISN = 1000 و Server ISN = 5000. إيه قيم `Seq` و `Ack` في SYN-ACK والـ ACK الأخير في الـ three-way handshake؟',
              options: [
                'SYN-ACK `Seq=1001 Ack=5000`؛ ACK `Seq=5001 Ack=1000`',
                'SYN-ACK `Seq=5000 Ack=1001`؛ ACK `Seq=1001 Ack=5001`',
                'SYN-ACK `Seq=5000 Ack=1000`؛ ACK `Seq=1000 Ack=5000`',
                'SYN-ACK `Seq=1001 Ack=5001`؛ ACK `Seq=5001 Ack=1001`',
              ],
              correctIndex: 1,
              requireSubmit: true,
              explanation:
                'الصح هو **(B)**: السيرفر بيعلن ISN بتاعه `Seq=5000` ويأكد SYN العميل بـ `Ack=1001` لأن SYN استهلك seq واحد. العميل بعدين يبعت `Seq=1001` ويأكد SYN السيرفر بـ `Ack=5001`. **(A)** و **(C)** و **(D)** غلطوا في اتجاه الأرقام أو في إن SYN بيستهلك sequence number.',
            },
            {
              id: 'q3',
              prompt: 'وصلت بيانات لسيرفر كان مستني البايت `2000`، لكن السيغمنت ده ضاع ووصلت بعده سيغمنتات تانية. إيه العلامة اللي ممكن توصل لإعادة إرسال سريعة؟',
              options: [
                'ثلاثة duplicate ACKs بـ `Ack=2000` ممكنوا يؤديوا لـ fast retransmit',
                '`SYN` بـ `Seq=2000` عشان يفتح الاتصال من جديد',
                '`RST` بـ `Ack=2000` عشان يأكد الاستلام',
                '`FIN` بـ `Ack=2000` عشان يبدأ three-way handshake',
              ],
              correctIndex: 0,
              requireSubmit: true,
              explanation:
                'الصح هو **(A)**: الـ ACK بيقول البايت التالي المتوقع، فتكرار `Ack=2000` معناه إن اللي بعده وصل واللي قبله ضاع — وثلاثة duplicate ACKs من أشهر محفزات `fast retransmit`. **(B)** غلط لأن SYN بداية اتصال مش إصلاح فقد داخل اتصال. **(C)** غلط لأن RST بيقطع الاتصال. **(D)** غلط لأن FIN للإنهاء مش للـ handshake.',
            },
            {
              id: 'q4',
              prompt: 'Scenario: `192.168.10.10:49152` بعت request إلى `192.168.20.10:443` باستخدام `TCP`. أي وصف صحيح؟',
              options: [
                'المنفذ 49152 هو منفذ الـ web server والمنفذ 443 هو source port',
                'البروتوكول مش مهم؛ رقم المنفذ 443 لوحده بيعرّف التطبيق دايماً',
                'لازم تكون UDP لأن 443 بتستخدم في QUIC بس',
                'الـ five-tuple هو `192.168.10.10:49152 → 192.168.20.10:443 TCP`؛ 49152 ephemeral source و443 destination listening',
              ],
              correctIndex: 3,
              requireSubmit: true,
              explanation:
                'الصح هو **(D)**: الـ tuple بيجمع العنوانين والمنفذين والبروتوكول. الـ 49152 source مؤقت والـ 443 هو dest اللي السيرفر بيسمع عليه. **(A)** مقلوب. **(B)** غلط لأن رقم المنفذ لوحده مش كفاية؛ لازم تعرف البروتوكول والسياق، و HTTP/3 بيستخدم UDP 443. **(C)** غلط لأن TCP 443 هو الأساس في HTTPS التقليدي.',
            },
            {
              id: 'q5',
              prompt: 'مستقبل عنده buffer قريب من الامتلاء وأعلن `rwnd` أصغر، فالمرسل قلّل إرساله عشان ما يغرقش المستقبل. إيه ده؟',
              options: [
                'Flow control؛ الـ `rwnd` بيحمي المستقبل، أمّا `congestion control` فبيستخدم `cwnd` لحماية الشبكة',
                'Congestion control؛ الـ `rwnd` بيحمي الشبكة من كثرة الراوترات',
                'Flow control؛ الـ `cwnd` بيعلنه المستقبل عشان يحمي الـ buffer',
                'مفيش تحكم في السرعة؛ الـ RTO لوحده بيتحكم في الإرسال',
              ],
              correctIndex: 0,
              requireSubmit: true,
              explanation:
                'الصح هو **(A)**: `rwnd` بيجي من المستقبل ومهمته حماية الـ receive buffer — ده `Flow Control`. أمّا `Congestion Control` فبيتم عند المرسل عبر `cwnd` عشان يحمي مسار الشبكة. **(B)** و **(C)** قلبوا المفهومين أو نسبوا `cwnd` للمستقبل. **(D)** غلط لأن الـ RTO جزء من الموثوقية مش بديل عن التحكم في السرعة.',
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
          headers: ['TCP — احفظ كده', 'المعنى'],
          rows: [
            ['Connection-Oriented', 'Handshake قبل البيانات وإنهاء منظّم بعدها'],
            ['Reliable', 'Acknowledgments وإعادة إرسال للمفقود'],
            ['Ordered Byte Stream', 'البيانات بايتات مرتبة مش رسائل بحدود محفوظة'],
            ['Acknowledgments', 'الرقم = البايت التالي المتوقع'],
            ['Retransmissions', 'RTO متكيّف + duplicate ACKs'],
            ['Flow Control', '`rwnd` يحمي المستقبل'],
            ['Congestion Control', '`cwnd` يحمي الشبكة'],
            ['Three-Way Handshake', '`SYN` → `SYN-ACK` → `ACK`'],
          ],
        },
        {
          type: 'table',
          headers: ['UDP — احفظ كده', 'المعنى'],
          rows: [
            ['Connectionless', 'مفيش handshake جوه UDP'],
            ['Datagram-Based', 'كل datagram مستقل بحدود واضحة'],
            ['No Built-in Reliability', 'مفيش ACK ولا retransmission مدمج'],
            ['No Built-in Ordering', 'الترتيب مش مضمون'],
            ['8-Byte Header', 'Source Port، Destination Port، Length، Checksum'],
            ['Low Overhead', 'مناسب للتطبيقات الحساسة للتأخير والبث'],
          ],
        },
        {
          type: 'table',
          headers: ['Flag', 'المعنى المختصر'],
          rows: [
            ['`SYN`', 'Synchronize — يبدأ الاتصال ويعلن ISN'],
            ['`ACK`', 'Acknowledgment — يأكد ويحدد التالي المتوقع'],
            ['`FIN`', 'Finish — إنهاء منظّم'],
            ['`RST`', 'Reset — قطع فوري'],
            ['`PSH`', 'Push — دفع البيانات للتطبيق'],
            ['`URG`', 'Urgent — بيانات عاجلة مع مؤشر'],
          ],
        },
        {
          type: 'steps',
          items: [
            { title: '1 — الأرقام الأصلية', text: 'Client ISN = `1000`، Server ISN = `5000`.' },
            { title: '2 — SYN', text: 'Client → Server: `SYN Seq=1000`.' },
            { title: '3 — SYN-ACK', text: 'Server → Client: `SYN-ACK Seq=5000 Ack=1001`.' },
            { title: '4 — ACK', text: 'Client → Server: `ACK Seq=1001 Ack=5001`.' },
            { title: '5 — ليه +1؟', text: 'لأن `SYN` بيستهلك sequence number واحد، فالـ ACK بيشير للبايت التالي المتوقع.' },
          ],
        },
        {
          type: 'table',
          headers: ['Protocol', 'Port', 'Transport'],
          rows: commonPortRows,
        },
        {
          type: 'table',
          headers: ['فخ امتحاني', 'الإجابة الصح'],
          rows: [
            ['"TCP connectionless"', 'لا — TCP connection-oriented'],
            ['"UDP connection-oriented"', 'لا — UDP connectionless'],
            ['"UDP بيضمن الوصول"', 'لا — best-effort ومفيش ضمان مدمج'],
            ['"TCP بيرسل رسائل منفصلة"', 'لا — reliable byte stream'],
            ['"TCP مش بيستخدم sequence و ACK"', 'لا — دول أساس الموثوقية'],
            ['"UDP header 20 byte"', 'لا — UDP 8 byte'],
            ['"TCP minimum header 8 byte"', 'لا — 20 byte بدون options'],
            ['"DNS بيستخدم UDP بس"', 'لا — UDP غالباً و TCP في zone transfers وحالات تانية'],
            ['"Ping بيستخدم TCP أو UDP"', 'لا — Ping ICMP ومفيش ports'],
            ['"HTTP/3 بيستخدم TCP 443"', 'لا — HTTP/3 QUIC over UDP 443'],
            ['"Flow control بيحمي الشبكة"', 'لا — بيحمي المستقبل عبر rwnd'],
            ['"Congestion control بيحمي المستقبل"', 'لا — بيحمي الشبكة عبر cwnd'],
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'جملة تلخّص بيها الدرس كله',
          text: 'الـ Transport Layer بيوصل من process لprocess بالمنافذ. `TCP` يدفع ثمن الـ overhead عشان يديك byte stream موثوق ومرتب مع handshake و ACKs و آليات حماية للمستقبل والشبكة. `UDP` يخفّف الـ header والبداية عشان datagrams سريعة، والباقي على التطبيق. وافهم دايماً: رقم المنفذ لوحده مش كفاية — البروتوكول والـ five-tuple هم اللي بيحسموا.',
        },
      ],
    },
  ],
}
