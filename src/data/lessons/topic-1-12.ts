import type { Lesson } from '../types'

const benefitsRows: string[][] = [
  ['Resource utilization', 'خادم واحد يخدم عدة أحمال بدل خادم لكل تطبيق', 'توفير تكلفة وتقليل الهدر'],
  ['Isolation', 'كل VM أو container معزول عن غيره', 'مشكلة في تطبيق ما توقفش الباقي'],
  ['Scalability', 'إنشاء نسخة جديدة من قالب في دقائق', 'توسيع سريع عند الطلب'],
  ['Flexibility', 'نقل الأحمال بين hosts وتجربة أنظمة مختلفة', 'مرونة في التشغيل والاختبار'],
  ['Resource allocation', 'تحديد vCPU وvRAM وstorage وbandwidth', 'تحكم أدق في الأداء'],
  ['Limitations', 'الـ host لسه محدود، والـ oversubscription يقلل الأداء', 'لازم capacity planning ومراقبة'],
]

const typeRows: string[][] = [
  ['Architecture', 'بيتثبّت مباشرة على الهاردوير، مفيش host OS تحته', 'تطبيق فوق Host OS بيستخدمه للوصول للهاردوير'],
  ['Performance', 'overhead أقل وأداء أقرب للـ native غالباً', 'طبقة إضافية؛ الأداء غالباً أقل من Type 1'],
  ['Use cases', 'datacenters، إنتاج، clusters', 'لابتوبس، lab، تدريب، اختبار'],
  ['Examples', 'VMware ESXi، Hyper-V كـ bare-metal، Xen', 'Oracle VirtualBox، VMware Workstation'],
  ['Note', 'التصنيف بيعتمد على طريقة النشر', 'منتج واحد ممكن يظهر بأكتر من نموذج حسب الإصدار'],
]

const vmContainerRows: string[][] = [
  ['Architecture', 'Virtual hardware فوق hypervisor', 'Shared host OS kernel + runtime'],
  ['Operating system', 'Guest OS كامل جوّه كل VM', 'Host OS واحد مع كل container كبيئة معزولة'],
  ['Isolation', 'عزل على مستوى hardware virtual', 'عزل على مستوى OS process/filesystem'],
  ['Resource usage', 'أثقل؛ RAM وdisk أكتر', 'أخف وأسرع'],
  ['Startup time', 'دقائق غالباً', 'ثوانٍ غالباً'],
  ['Portability', 'قالب VM كبير؛ ينقل بين منصات متوافقة', 'image خفيف وسهل التكرار'],
  ['Common use', 'OS مختلف، تطبيقات تقليدية، عزل قوي', 'microservices، نشر سريع، بيئات متطابقة'],
]

const vrfCommandRows: string[][] = [
  ['`show vrf`', 'يعرض الـ VRFs المعرّفة وحالتها', 'تحقق عام من وجود VRF'],
  ['`show ip vrf`', 'يعرض معلومات IPv4 عن VRFs', 'التوافر والصيغة يعتمدان على IOS/platform/version'],
  ['`show ip route vrf HR`', 'يعرض جدول توجيه VRF المسمى HR', 'أهم أمر لفحص الـ isolation'],
  ['`show ip interface brief`', 'يعرض الواجهات وحالتها', 'فحص عام مش خاص بـ VRF'],
]

export const topic112Lesson: Lesson = {
  topicId: '1.12',
  title: 'Virtualization Fundamentals',
  description:
    'في الدرس ده هنتعلّم أساسيات الافتراضية في CCNA: virtualization والـ hypervisors بأنواعها والـ VMs والـ containers والفرق بينهم. كمان هندرس VRF وVRF-Lite بالأوامر والجداول المنفصلة، مع أمثلة IOS ولابين عمليين و5 أسئلة امتحان.',
  estimatedTime: '~120 دقيقة',
  steps: [
    {
      id: 'what',
      title: 'ما هي الافتراضية وليه وجودها؟',
      short: 'مفهوم الدرس',
      blocks: [
        {
          type: 'paragraph',
          text: '**Virtualization** معناها إننا نفصل بين المورد الفيزيائي والصورة اللي بيشوفها المستخدم أو التطبيق. بدل ما كل تطبيق ياخد سيرفر حقيقي، نقدر نشغّل عدة بيئات virtual على نفس الـ hardware.',
        },
        {
          type: 'paragraph',
          text: 'مثال بسيط: عندك سيرفر قوي بـ 32 core و128 GB RAM، وتطبيق واحد بيستخدم جزء صغير بس. بالافتراضية تقدر تشغّل web server وdatabase وapp server على نفس الجهاز، كل واحد في بيئة منفصلة.',
        },
        { type: 'diagram', id: 'physical-vs-virtual-server', caption: 'سيرفر فيزيائي باستخدام منخفض مقابل سيرفر مستضاف عليه عدة VMs.' },
        { type: 'paragraph', text: '**Physical مقابل Virtual Resources**' },
        {
          type: 'table',
          headers: ['Physical resource', 'Virtual representation', 'مثال'],
          rows: [
            ['CPU', 'vCPU', 'الـ hypervisor بيجدول وقت المعالجة'],
            ['RAM', 'vRAM', 'ذاكرة مخصصة لكل VM'],
            ['Storage', 'Virtual disk', 'ملف أو مجموعة ملفات على physical storage'],
            ['NIC', 'vNIC', 'بطاقة شبكة افتراضية على virtual switch'],
          ],
        },
        { type: 'paragraph', text: '**فوائد وقيود**' },
        { type: 'table', headers: ['الجانب', 'السبب', 'الأثر'], rows: benefitsRows },
        {
          type: 'callout',
          tone: 'info',
          title: 'كلمات CCNA مهمة',
          text: '**Resource sharing** معناه تقاسم العتاد، و**Isolation** معناه إن كل بيئة ما تشوفش بيئة تانية. الاتنين مع بعض هما جوهر الافتراضية.',
        },
        {
          type: 'paragraph',
          text: 'الافتراضية مش سحر: لو كل الـ VMs طلبت CPU أو RAM في نفس اللحظة، هيحصل contention. عشان كده بنخطّط الـ capacity وبنراقب الاستخدام.',
        },
      ],
    },
    {
      id: 'how',
      title: 'أساسيات افتراضية الخوادم',
      short: 'Server virtualization',
      blocks: [
        {
          type: 'paragraph',
          text: 'في **Server Virtualization** بنحوّل سيرفر فيزيائي واحد إلى عدة **Virtual Servers**. كل virtual server بيظهر له نظام تشغيل خاص وملفات خاصة وموارد مخصصة، رغم إنه بيشارك نفس الجهاز.',
        },
        { type: 'diagram', id: 'multiple-vms-on-host', caption: 'ثلاث VMs تتقاسم host فيزيائي واحد عبر hypervisor.' },
        { type: 'paragraph', text: '**كيف يعمل المشاركة؟**' },
        {
          type: 'steps',
          items: [
            { title: '1 - Physical server', text: 'الجهاز الحقيقي فيه CPU وRAM وdisks وNICs.' },
            { title: '2 - Virtualization layer', text: 'طبقة الـ hypervisor بتوزّع الموارد وتفصل بين الـ VMs.' },
            { title: '3 - Multiple VMs', text: 'كل VM ليها guest OS وتطبيقاتها ومواردها الافتراضية.' },
            { title: '4 - Allocation', text: 'بنحدد vCPU وvRAM وحجم الـ disk وbandwidth حسب احتياج كل VM.' },
            { title: '5 - Isolation', text: 'لو VM وقعت، الباقي غالباً يشتغل لأن الأنظمة منفصلة.' },
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'مثال مؤسسي',
          text: 'شركة عندها 3 تطبيقات صغيرة كانت على 3 سيرفرات. بعد الافتراضية بقت على سيرفر واحد قوي بـ 3 VMs، مع توفير مساحة واستهلاك كهرباء وسرعة أكبر في عمل نسخة اختبار.',
        },
        {
          type: 'paragraph',
          text: 'لو احتاجنا خادم جديد، بننشئ VM من template في دقائق بدل شراء وتركيب جهاز. دي هي **Scalability** و**Flexibility** اللي بيتكلم عنها CCNA.',
        },
      ],
    },
    {
      id: 'packet',
      title: 'الـ Hypervisor وإيه اللي بيعمله؟',
      short: 'Hypervisors',
      blocks: [
        {
          type: 'paragraph',
          text: 'الـ **Hypervisor** هو طبقة برمجية بين الهاردوير الفيزيائي والـ virtual machines. بيخلّي أكتر من نظام تشغيل يشتغلوا في نفس الوقت على نفس الجهاز ويدير وصولهم للموارد.',
        },
        { type: 'diagram', id: 'hypervisor-architecture', caption: 'الـ hypervisor يدير CPU والذاكرة والتخزين والشبكة.' },
        { type: 'paragraph', text: '**إيه اللي بيديره؟**' },
        {
          type: 'list',
          items: [
            '**CPU**: جدولة الـ vCPUs وتحديد أي VM تاخد وقت تنفيذ.',
            '**Memory**: فصل ذاكرة كل VM وإدارة الـ allocation والـ overcommit بحذر.',
            '**Storage**: تقديم virtual disks وتنظيم الـ I/O على التخزين الفيزيائي.',
            '**Network**: توفير vNICs وvirtual switches للربط بالشبكة.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'فرق مهم',
          text: 'الـ hypervisor مش مجرد „برنامج بيشغّل برامج“. هو اللي بيخلق الـ virtual hardware وبيفصل بين الـ VMs وبيقرر من ياخد الموارد ومتى.',
        },
        {
          type: 'paragraph',
          text: 'في CCNA المطلوب فهم دور الـ hypervisor ومقارنة Type 1 وType 2. إعدادات CLIs خاصة بمنتجات معينة مش جزء من Topic 1.12.',
        },
      ],
    },
    {
      id: 'config',
      title: 'Type 1 مقابل Type 2 Hypervisors',
      short: 'الأنواع',
      blocks: [
        {
          type: 'paragraph',
          text: 'التصنيف هنا وصف لـ **طريقة النشر deployment**، مش مجرد اسم منتج. لازم تسأل: هل الـ hypervisor بيعمل مباشرة فوق الهاردوير ولا فوق host OS؟',
        },
        { type: 'diagram', id: 'type1-hypervisor-arch', caption: 'Type 1 bare-metal: hypervisor مباشرة على الهاردوير.' },
        { type: 'diagram', id: 'type2-hypervisor-arch', caption: 'Type 2 hosted: hypervisor كتطبيق فوق host OS.' },
        { type: 'paragraph', text: '**Type 1 – Bare-Metal**' },
        {
          type: 'list',
          items: [
            'بيشتغل مباشرة على الهاردوير الفيزيائي.',
            'مفيش host OS تقليدي تحته.',
            'أداء غالباً أفضل وoverhead أقل.',
            'شائع في الخوادم والـ datacenter والبيئات الإنتاجية.',
            'أمثلة: VMware ESXi وMicrosoft Hyper-V لما يتنصب bare-metal وXen.',
          ],
        },
        { type: 'paragraph', text: '**Type 2 – Hosted**' },
        {
          type: 'list',
          items: [
            'بيشتغل كتطبيق داخل host OS.',
            'بيستخدم الـ host OS للوصول للهاردوير.',
            'مناسب لل lab والتدريب وتجربة أنظمة على لابتوب.',
            'أمثلة: Oracle VirtualBox وVMware Workstation.',
          ],
        },
        { type: 'paragraph', text: '**جدول المقارنة**' },
        { type: 'table', headers: ['الوجه', 'Type 1 - Bare-Metal', 'Type 2 - Hosted'], rows: typeRows },
        {
          type: 'callout',
          tone: 'warning',
          title: 'مفيش تعميم',
          text: 'متقولش „منتج X دايماً Type 1“ في كل الحالات. بعض المنتجات ليها أوضاع نشر مختلفة؛ الإجابة في الامتحان بتبني على الوصف المذكور في السؤال.',
        },
        { type: 'paragraph', text: '**سيناريو اختيار عملي**' },
        {
          type: 'steps',
          items: [
            { title: 'سيناريو A - مكتب صغير', text: 'مهندس عايز يجرب Linux على لابتوب Windows. Type 2 زي VirtualBox كافي وسهل.' },
            { title: 'سيناريو B - datacenter', text: 'شركة بتشغّل خدمات إنتاجية على cluster من الخوادم. Type 1 زي ESXi أو Hyper-V bare-metal أنسب.' },
            { title: 'القاعدة', text: 'اسأل عن الأداء والعزل والاستخدام الإنتاجي قبل اختيار النموذج.' },
          ],
        },
      ],
    },
    {
      id: 'verify',
      title: 'الـ Virtual Machines ومكوناتها',
      short: 'VMs',
      blocks: [
        {
          type: 'paragraph',
          text: 'الـ **Virtual Machine** بيئة حسابية كاملة داخل ملفات على host. الـ guest OS بيشوفها زي ما تكون جهاز مستقل، رغم إنها بتتقاسم الهاردوير مع غيرها.',
        },
        { type: 'diagram', id: 'vm-components', caption: 'مكونات الـ VM: vCPU وvRAM وvirtual disk وvNIC وguest OS.' },
        { type: 'paragraph', text: '**المكونات الأساسية**' },
        {
          type: 'list',
          items: [
            '**vCPU**: وقت CPU افتراضي بيجدوله الـ hypervisor؛ مش بالضرورة core فيزيائي مخصص.',
            '**vRAM**: ذاكرة معزولة للـ VM.',
            '**Virtual disk**: ملف أو ملفات بتظهر كـ disk داخل الـ guest OS.',
            '**vNIC**: بطاقة شبكة افتراضية بتوصل بـ virtual switch.',
            '**Guest OS**: نظام التشغيل جوّه الـ VM.',
            '**Snapshot**: حفظ حالة في وقت معين للتجربة والرجوع؛ مش بديل عن backup.',
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'عزل الـ VM',
          text: 'كل VM ليها guest OS وملفاتها ومواردها الافتراضية. عزل قوي معناه إن crash في VM واحدة مش لازم يوقف باقي الـ VMs على نفس الـ host.',
        },
        {
          type: 'paragraph',
          text: 'مثال: VM للـ web وVM للـ database على نفس السيرفر. لو الـ web app عمل reboot، الـ database غالباً يفضل شغال لأن الـ OS منفصل تماماً.',
        },
      ],
    },
    {
      id: 'mistakes',
      title: 'الـ Containers والـ Containerization',
      short: 'Containers',
      blocks: [
        {
          type: 'paragraph',
          text: 'الـ **Containerization** معناها إننا نحزم التطبيق واعتمادياته في بيئة معزولة وتشغّلها على host، من غير ما كل نسخة تحمل نظام تشغيل كامل.',
        },
        { type: 'diagram', id: 'container-architecture', caption: 'الـ containers تتشارك kernel الـ host ويعزلها الـ runtime.' },
        { type: 'paragraph', text: '**المفاهيم الأساسية**' },
        {
          type: 'list',
          items: [
            '**Container image**: قالب للقراءة فيه الكود والـ runtime والمكتبات.',
            '**Running container**: نسخة قابلة للتشغيل من الـ image.',
            '**Container runtime**: زي Docker Engine؛ بيشغّل الـ containers ويدير الـ images.',
            '**Shared host OS kernel**: كل الـ containers على نفس host يستخدموا نفس kernel.',
            '**Application isolation**: كل container ليها مساحة عملية وملفات وشبكة معزولة.',
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Docker example only',
          text: 'هنستخدم Docker كمثال فقط. Topic 1.12 مش دورة Docker؛ المطلوب فهم الفكرة: image → runtime → running container مع kernel مشترك.',
        },
        {
          type: 'paragraph',
          text: 'لوضع المثال: فريق بيطلع microservice جديد. بيعمل image مرة، وبعدين يشغّل نسخ متطابقة في dev وtest وproduction بسرعة.',
        },
      ],
    },
    {
      id: 'lab',
      title: 'Virtual Machines مقابل Containers',
      short: 'VM vs Container',
      blocks: [
        {
          type: 'paragraph',
          text: 'الجملة اللي لازم تتذكرها: **VMs virtualize hardware؛ containers share the host OS kernel and isolate application environments**.',
        },
        { type: 'diagram', id: 'vm-vs-container', caption: 'مقارنة معمارية بين VM وcontainer.' },
        { type: 'paragraph', text: '**جدول المقارنة الكامل**' },
        { type: 'table', headers: ['الوجه', 'Virtual Machine', 'Container'], rows: vmContainerRows },
        { type: 'paragraph', text: '**تمرين مقارنة سريع**' },
        {
          type: 'steps',
          items: [
            { title: 'حالة 1', text: 'تحتاج تشغيل Windows وLinux على نفس الجهاز. الإجابة: VMs لأن كل واحدة محتاجة OS كامل.' },
            { title: 'حالة 2', text: 'تحتاج 20 نسخة سريعة من تطبيق ويب خفيف. الإجابة: containers لأنها أخف وأسرع.' },
            { title: 'حالة 3', text: 'تحتاج عزل قوي بين تطبيقين من فرق مختلفة. الإجابة: VMs غالباً أقوى عزلاً.' },
            { title: 'حالة 4', text: 'تريد بيئة متطابقة في التطوير والاختبار. الإجابة: container image.' },
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'خلاصة الامتحان',
          text: 'لو السؤال ذكر „guest OS لكل نسخة“ أو „virtual hardware“ فكر في VM. لو ذكر „shared kernel“ أو „lightweight“ أو „image“ فكر في Container.',
        },
      ],
    },
    {
      id: 'exam',
      title: 'Virtual Routing and Forwarding (VRF)',
      short: 'VRF',
      blocks: [
        {
          type: 'paragraph',
          text: '**VRF** اختصار لـ Virtual Routing and Forwarding. بيخلّي الراوتر الواحد يحمل أكتر من routing table منفصل، كل table وforwarding context خاصين به.',
        },
        { type: 'diagram', id: 'vrf-table-separation', caption: 'راوتر واحد بجداول توجيه منفصلة: global وHR وFinance.' },
        { type: 'paragraph', text: '**ليه VRF موجود؟**' },
        {
          type: 'list',
          items: [
            'فصل حركة أقسام مختلفة على نفس الراوتر.',
            'السماح بـ overlapping IP addresses في جداول مختلفة.',
            'منع تسريب routes بين بيئات لازم تكون منفصلة.',
            'بناء مثال VRF-Lite على روابط وأوامر IOS مفهومة.',
          ],
        },
        {
          type: 'callout',
          tone: 'danger',
          title: 'VRF مش VLAN',
          text: 'الـ VLAN بيفصل Layer 2 broadcast domains. الـ VRF بيفصل **Layer 3 routing information وforwarding contexts**. متخلطش بينهم في الامتحان.',
        },
        { type: 'diagram', id: 'vrf-overlapping-networks', caption: 'قسمان يستخدمان 192.168.10.0/24 داخل VRFs منفصلة.' },
        { type: 'diagram', id: 'vrf-packet-forwarding', caption: 'الـ lookup بيحصل داخل VRF context بتاع الواجهة.' },
        { type: 'paragraph', text: '**سيناريو عملي: قسمان بنفس الـ subnet**' },
        {
          type: 'steps',
          items: [
            { title: 'المشكلة', text: 'HR وFinance كلهم بيستخدموا 192.168.10.0/24، والراوتر مش هيقدر يحط connected route مرتين في نفس الجدول.' },
            { title: 'الحل', text: 'نعمل VRF HR وVRF Finance، ونحط كل interface في VRF مختلف.' },
            { title: 'النتيجة', text: 'كل قسم يشوف routes بتاعته بس، ومفيش مزج في الـ forwarding.' },
            { title: 'التحقق', text: 'نفحص `show ip route vrf HR` و`show ip route vrf FINANCE`.' },
          ],
        },
        { type: 'paragraph', text: '**أوامر IOS تمثيلية**' },
        {
          type: 'code',
          label: 'Representative VRF-Lite configuration',
          language: 'text',
          code: `vrf definition HR
 address-family ipv4
 exit-address-family

interface GigabitEthernet0/1
 vrf forwarding HR
 ip address 192.168.10.1 255.255.255.0
 no shutdown

show vrf
show ip route vrf HR`,
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'نقطة مهمة جداً',
          text: 'لما تطبّق `vrf forwarding` على interface، هذا بيشيل الـ IP configuration الموجود عليها. عشان كده لازم تعمل `ip address` **بعد** `vrf forwarding`. الترتيب غلط = الواجهة من غير عنوان.',
        },
        {
          type: 'code',
          label: 'Representative verification commands',
          language: 'text',
          code: `show vrf
show ip vrf
show ip route vrf HR
show ip route vrf FINANCE
show ip interface brief`,
        },
        { type: 'table', headers: ['الأمر', 'الغرض', 'ملاحظة'], rows: vrfCommandRows },
        {
          type: 'callout',
          tone: 'info',
          title: 'توافر الأوامر',
          text: 'الأوامر والصيغة دي IOS-like وrepresentative. التوافر الفعلي والـ syntax بيختلفوا حسب المنصة وإصدار IOS والصورة البرمجية. المخرجات هنا تعليمية، مش نتيجة تنفيذ على جهاز حقيقي.',
        },
        {
          type: 'code',
          label: 'Educational example - not captured from a device',
          language: 'text',
          code: `R1# show ip route vrf HR

Routing Table: HR
C    192.168.10.0/24 is directly connected, GigabitEthernet0/1

R1# show ip route vrf FINANCE

Routing Table: FINANCE
C    192.168.10.0/24 is directly connected, GigabitEthernet0/2`,
        },
      ],
    },
    {
      id: 'summary',
      title: 'سيناريوهات عملية وتشخيص ومراجعة CCNA',
      short: 'المراجعة',
      blocks: [
        { type: 'paragraph', text: '**سيناريوهات واقعية مختصرة**' },
        {
          type: 'list',
          items: [
            'شركة بتجمع خوادم قديمة في 5 VMs على host واحد لتوفير التكلفة.',
            'مهندس بيستخدم Type 2 hypervisor على لابتوبه لعمل lab قبل deployment إنتاجي على Type 1.',
            'فريق microservices بيشغّل containers لأن النشر السريع والنسخ المتطابقة أهم من محاكاة OS كامل.',
            'راوتر واحد بيفصل HR عن Finance بـ VRFs رغم إن الاتنين بيستخدموا نفس الـ subnet.',
          ],
        },
        { type: 'paragraph', text: '**Lab 1 - اختيار النموذج والمنصة (conceptual / Packet Tracer-style)**' },
        {
          type: 'steps',
          items: [
            { title: 'الهدف', text: 'قرر متى تستخدم Type 2 ومتى Type 1، ومتى VM ومتى container.' },
            { title: 'الخطوة 1', text: 'لابتوب Windows عايز تجرب Linux: اختر Type 2 مثل VirtualBox.' },
            { title: 'الخطوة 2', text: 'خادم إنتاجي بيخدم 10 تطبيقات: اختر Type 1 مثل ESXi أو Hyper-V bare-metal.' },
            { title: 'الخطوة 3', text: 'تطبيق ويب خفيف محتاج 20 نسخة: containers أسرع وأخف.' },
            { title: 'الخطوة 4', text: 'نظام قديم محتاج Windows كامل: VM أنسب.' },
            { title: 'الخلاصة', text: 'القرار بيتبع المتطلبات: OS، عزل، أداء، وسرعة نشر.' },
          ],
        },
        { type: 'paragraph', text: '**Lab 2 - VRF-Lite مع subnets متطابقة (conceptual)**' },
        {
          type: 'steps',
          items: [
            { title: 'الهدف', text: 'إثبات إن جدولين VRF ممكن يحملوا نفس الـ 192.168.10.0/24 من غير مزج.' },
            { title: 'الخطوة 1', text: 'عرّف `vrf definition HR` و`vrf definition FINANCE` مع address-family ipv4.' },
            { title: 'الخطوة 2', text: 'اجعل Gi0/1 في HR وGi0/2 في FINANCE بـ `vrf forwarding`.' },
            { title: 'الخطوة 3', text: 'بعد الـ vrf forwarding، أعد ضبط `ip address 192.168.10.1 255.255.255.0` على كل واجهة.' },
            { title: 'الخطوة 4', text: 'شغّل `show vrf` ثم `show ip route vrf HR` و`show ip route vrf FINANCE`.' },
            { title: 'الخطوة 5', text: 'لاحظ connected route متطابق في جدولين منفصلين. كده الـ isolation نجح.' },
            { title: 'تنبيه', text: 'Packet Tracer مش بالضرورة يدعم كل ميزات أو أوامر VRF. الأوامر دي محتاجة منصة Cisco IOS متوافقة؛ هنا كـ conceptual simulation.' },
          ],
        },
        { type: 'paragraph', text: '**تشخيص سريع**' },
        {
          type: 'steps',
          items: [
            { title: '1 - حدد الطبقة', text: 'المشكلة في virtualization host ولا في routing داخل VRF؟' },
            { title: '2 - الموارد', text: 'راجع CPU/RAM/storage/Network على الـ host والـ VMs.' },
            { title: '3 - النوع', text: 'هل التطبيق محتاج guest OS كامل ولا يكفي container؟' },
            { title: '4 - الـ VRF', text: 'راجع `show vrf` ثم جدول التوجيه بتاع الـ VRF.' },
            { title: '5 - الترتيب', text: 'تأكد إن الـ IP اتضاف بعد `vrf forwarding`.' },
            { title: '6 - لا تفترض', text: 'متعتبرش إن VRF بيوصل بين جداول تانية تلقائياً.' },
          ],
        },
        { type: 'paragraph', text: '**أهم 8 نقاط قبل الامتحان**' },
        {
          type: 'list',
          items: [
            'Virtualization تفصل الموارد الفيزيائية عن الصورة الافتراضية.',
            'الـ hypervisor يدير CPU وmemory وstorage وnetwork بين الـ VMs.',
            'Type 1 bare-metal مباشرة على الهاردوير؛ Type 2 فوق host OS.',
            'VM فيها guest OS كامل وvirtual hardware.',
            'Container يشارك host OS kernel ويعزل بيئة التطبيق.',
            'VMs أثقل وأبطأ؛ containers أخف وأسرع.',
            'VRF يعمل routing tables منفصلة على نفس الراوتر.',
            'VRF مش VLAN؛ و`vrf forwarding` بيشيل IP الحالي لازم تعيده.',
          ],
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
              prompt: 'إيه المقصود بـ Virtualization في سياق CCNA؟',
              options: [
                'تشغيل كل تطبيق على سيرفر فيزيائي منفصل دايماً.',
                'فصل الموارد الفيزيائية إلى موارد افتراضية يمكن مشاركتها وإدارتها.',
                'تحويل الـ IP addresses إلى أسماء DNS.',
                'زيادة عدد الـ VLANs على الـ switch فقط.',
              ],
              correctIndex: 1,
              requireSubmit: true,
              explanation:
                'الصح هو **(B)**. الافتراضية بتفصل CPU وRAM وstorage وnetwork عن الصورة اللي بيشوفها التطبيق، فتقدر تشغّل أكتر من بيئة على نفس الهاردوير مع عزل وتوزيع موارد.',
            },
            {
              id: 'q2',
              kind: 'multiple',
              prompt: 'أي من التالي من فوائد Server Virtualization؟ (اختر أكثر من إجابة)',
              options: [
                'استخدام أفضل لقدرة السيرفر الفيزيائي.',
                'عزل بين VMs على نفس الـ host.',
                'إنشاء VMs جديدة بسرعة من قالب.',
                'إن كل VM تحتاج معالج فيزيائي خاص بها دايماً.',
              ],
              correctIndices: [0, 1, 2],
              requireSubmit: true,
              explanation:
                'الصح هو **(A) و(B) و(C)**. الافتراضية بتزيد الـ utilization وتوفر isolation وscalability. مش شرط إن كل VM ياخد CPU فيزيائي مخصص؛ الـ hypervisor بيجدول الموارد.',
            },
            {
              id: 'q3',
              prompt: 'إيه الفرق الأساسي بين Type 1 وType 2 hypervisor؟',
              options: [
                'Type 1 بيشتغل مباشرة على الهاردوير؛ Type 2 بيشتغل كتطبيق فوق host OS.',
                'Type 1 بيشتغل فقط على اللابتوبات؛ Type 2 في الخوادم بس.',
                'Type 2 أسرع دايماً لأنه مفيش طبقات فوقه.',
                'مفيش فرق؛ الاسمين لنفس الشيء.',
              ],
              correctIndex: 0,
              requireSubmit: true,
              explanation:
                'الصح هو **(A)**. التصنيف بيعتمد على deployment: Type 1 bare-metal مباشرة على الهاردوير، وType 2 hosted فوق host OS. متقولش إن منتج معين دايماً نفس النموذج في كل إعداد.',
            },
            {
              id: 'q4',
              kind: 'multiple',
              prompt: 'أي عبارات عن VMs وContainers صحيحة؟ (اختر أكثر من إجابة)',
              options: [
                'الـ VM بيعمل virtualize للـ hardware وبيدعم guest OS كامل.',
                'الـ container بيشارك kernel الـ host.',
                'الـ containers غالباً أخف وأسرع في التشغيل من الـ VMs.',
                'كل container لازم يكون له guest OS مستقل.',
              ],
              correctIndices: [0, 1, 2],
              requireSubmit: true,
              explanation:
                'الصح هو **(A) و(B) و(C)**. الـ VM ليها hardware افتراضي وguest OS، أما الـ container فيشارك kernel الـ host ويعزل بيئة التطبيق فقط، فبيكون أخف وأسرع.',
            },
            {
              id: 'q5',
              prompt: 'قسمان على نفس الراوتر بيستخدموا 192.168.10.0/24 ولازم يبقوا معزولين. إيه الحل الأنسب؟',
              options: [
                'تغيير الـ subnet mask لـ /8 فقط.',
                'استخدام VRFs منفصلة لكل قسم مع جداول توجيه مستقلة.',
                'إضافة كلمة مرور على الـ console port.',
                'استخدام VLAN واحد للقسمين.',
              ],
              correctIndex: 1,
              requireSubmit: true,
              explanation:
                'الصح هو **(B)**. VRF بيخلّي نفس الـ prefix يتوجد في جداول توجيه منفصلة على نفس الراوتر. افحص بـ `show ip route vrf HR` و`show ip route vrf FINANCE`. VLAN مش بديل عن VRF.',
            },
          ],
        },
      ],
    },
  ],
}
