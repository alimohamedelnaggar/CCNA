import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { RichText } from '../ui/RichText'
import { LinkLine, Node, Packet } from './ArchitectureDiagrams'
import { SvgText } from './FiberDiagrams'

interface StepPlayback {
  stage: number
  playing: boolean
  toggle: () => void
  next: () => void
  previous: () => void
  reset: () => void
}

function useStepPlayback(length: number): StepPlayback {
  const [stage, setStage] = useState(0)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => setStage((current) => (current + 1) % length), 2300)
    return () => window.clearInterval(timer)
  }, [playing, length])

  return {
    stage,
    playing,
    toggle: () => setPlaying((value) => !value),
    next: () => setStage((current) => (current + 1) % length),
    previous: () => setStage((current) => (current - 1 + length) % length),
    reset: () => {
      setPlaying(false)
      setStage(0)
    },
  }
}

function StepControls({ playback }: { playback: StepPlayback }) {
  const base = 'flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[0.75rem] transition'
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={playback.toggle}
        className={`${base} border-accent-400/30 bg-accent-500/10 font-bold text-accent-300 hover:bg-accent-500/20`}
      >
        {playback.playing ? <Pause size={13} /> : <Play size={13} />}
        {playback.playing ? 'إيقاف' : 'شغّل'}
      </button>
      <button type="button" onClick={playback.previous} className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}>
        <SkipBack size={13} /> السابق
      </button>
      <button type="button" onClick={playback.next} className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}>
        <SkipForward size={13} /> التالي
      </button>
      <button type="button" onClick={playback.reset} className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}>
        <RotateCcw size={13} /> إعادة
      </button>
    </div>
  )
}

function StepShell({
  title,
  playback,
  legend,
  children,
}: {
  title: string
  playback: StepPlayback
  legend: string
  children: ReactNode
}) {
  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-sky-400/12 bg-navy-950/70">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-400/10 px-4 py-3">
        <span className="font-display text-[0.78rem] font-bold text-slate-300" dir="ltr">
          {title}
        </span>
        <StepControls playback={playback} />
      </div>
      <div className="diagram-grid overflow-x-auto px-2 py-4" dir="ltr">
        {children}
      </div>
      <div className="border-t border-sky-400/10 bg-sky-400/[0.03] px-4 py-3 text-[0.85rem] leading-[1.9] text-slate-300" dir="rtl">
        <span className="ml-2 rounded bg-accent-500/15 px-1.5 py-0.5 font-display text-[0.7rem] font-bold text-accent-300" dir="ltr">
          {playback.stage + 1}
        </span>
        <RichText>{legend}</RichText>
      </div>
    </div>
  )
}

function Panel({
  x,
  y,
  w,
  h,
  title,
  lines,
  color = '#38bdf8',
  active = false,
  size = 9,
}: {
  x: number
  y: number
  w: number
  h: number
  title: string
  lines: string[]
  color?: string
  active?: boolean
  size?: number
}) {
  return (
    <g opacity={active ? 1 : 0.45}>
      <rect x={x} y={y} width={w} height={h} rx="12" fill="#0b1224" stroke={color} strokeWidth={active ? 2.2 : 1.1} />
      <SvgText x={x + w / 2} y={y + 21} color={color} size={10} bold>
        {title}
      </SvgText>
      {lines.map((line, index) => (
        <SvgText key={index} x={x + w / 2} y={y + 40 + index * 15} color="#cbd5e1" size={size}>
          {line}
        </SvgText>
      ))}
    </g>
  )
}

function Note({ x, y, text, color = '#64748b', size = 9.5 }: { x: number; y: number; text: string; color?: string; size?: number }) {
  return (
    <SvgText x={x} y={y} color={color} size={size}>
      {text}
    </SvgText>
  )
}

function Layer({
  x,
  y,
  w,
  h,
  title,
  sub,
  color,
  active = false,
}: {
  x: number
  y: number
  w: number
  h: number
  title: string
  sub: string
  color: string
  active?: boolean
}) {
  return (
    <g opacity={active ? 1 : 0.45}>
      <rect x={x} y={y} width={w} height={h} rx="10" fill="#0b1224" stroke={color} strokeWidth={active ? 2.4 : 1.2} />
      <SvgText x={x + w / 2} y={y + 24} color={color} size={11} bold>
        {title}
      </SvgText>
      <SvgText x={x + w / 2} y={y + 43} color="#cbd5e1" size={9}>
        {sub}
      </SvgText>
    </g>
  )
}

const overviewStages = [
  'الخادم الفيزيائي Physical Server هو جهاز حقيقي فيه CPU وRAM وdisk وNIC. في الطريقة القديمة بيشغّل OS واحد وتطبيق واحد أو عدد محدود.',
  'غالباً الخادم الفيزيائي بيستخدم جزء صغير من قوته الفعلية. مثلاً CPU عنده 32 core والتطبيق بيستخدم 2 بس معظم الوقت.',
  'الـ Virtualization بيحط طبقة بين الهاردوير والأنظمة، فتقدر تشغّل أكتر من Virtual Server على نفس الجهاز.',
  'كل VM ليها موارد virtual زي vCPU وvRAM وvirtual disk وvNIC، ومع ذلك معزولة عن باقي الـ VMs.',
  'النتيجة: utilization أعلى وتوفير تكلفة ومرونة أكبر؛ بس لازم إدارة دقيقة للموارد وتخطيط للـ capacity.',
]

export function PhysicalVsVirtualServerDiagram() {
  const playback = useStepPlayback(overviewStages.length)
  const s = playback.stage
  return (
    <StepShell title="PHYSICAL SERVER vs VIRTUAL SERVER" playback={playback} legend={overviewStages[s]}>
      <svg viewBox="0 0 920 410" className="h-auto w-full min-w-[880px]" role="img" aria-label="Physical server compared with virtualized server hosting multiple virtual machines">
        <Note x={460} y={24} text="SAME PHYSICAL HARDWARE - DIFFERENT UTILIZATION" color="#94a3b8" size={10.5} />
        <g opacity={s <= 1 ? 1 : 0.4}>
          <Layer x={45} y={65} w={360} h={230} title="TRADITIONAL PHYSICAL SERVER" sub="one OS / low utilization" color="#64748b" active={s <= 1} />
          <rect x={80} y={125} width={290} height={28} rx="7" fill="#1e293b" stroke="#38bdf8" strokeWidth={s === 1 ? 2.2 : 1} />
          <SvgText x={225} y={144} color="#38bdf8" size={10} bold>APP + OS</SvgText>
          <rect x={80} y={172} width={290} height={70} rx="8" fill="#0b1224" stroke="#334155" />
          <SvgText x={225} y={200} color="#94a3b8" size={9}>CPU 32 cores - RAM 128 GB</SvgText>
          <SvgText x={225} y={220} color="#94a3b8" size={9}>Only a small part is used</SvgText>
          {s === 1 && <Packet point={{ x: 225, y: 139 }} color="#f59e0b" label="~10% used" />}
        </g>
        <g opacity={s >= 2 ? 1 : 0.4}>
          <Layer x={515} y={65} w={360} h={230} title="VIRTUALIZED SERVER" sub="many isolated VMs" color="#34d399" active={s >= 2} />
          <Layer x={540} y={120} w={95} h={48} title="VM1" sub="Web" color="#38bdf8" active={s >= 2} />
          <Layer x={645} y={120} w={95} h={48} title="VM2" sub="DB" color="#a78bfa" active={s >= 2} />
          <Layer x={750} y={120} w={95} h={48} title="VM3" sub="App" color="#f59e0b" active={s >= 2} />
          <Layer x={540} y={190} w={305} h={52} title="HYPERVISOR" sub="shares CPU / RAM / disk / NIC" color="#34d399" active={s >= 2} />
          <Layer x={540} y={255} w={305} h={30} title="PHYSICAL HARDWARE" sub="" color="#64748b" active={s >= 2} />
        </g>
        <Panel
          x={45}
          y={315}
          w={830}
          h={72}
          title={s === 4 ? 'BENEFITS AND LIMITS' : 'KEY IDEA'}
          lines={
            s === 4
              ? ['Benefits: higher utilization, scaling, flexibility. Limits: capacity planning, resource contention, and isolation management.']
              : ['Virtualization inserts a layer that lets several isolated virtual servers run on one physical machine.']
          }
          color={s === 4 ? '#f59e0b' : '#34d399'}
          active
        />
      </svg>
    </StepShell>
  )
}

const hostStages = [
  'على نفس الـ physical host ممكن نشغّل عدة VMs. كل VM بتشوف تقريباً hardware خاص بيها رغم إنها بتتقاسم الجهاز.',
  'الـ hypervisor بيوزّع الـ CPU time والـ RAM والـ storage I/O والـ network bandwidth على الـ VMs حسب الإعداد.',
  'العزل Isolation معناه إن مشكلة في VM مش لازم توقف باقي الـ VMs؛ كل واحدة ليها guest OS وملفاتها الخاصة.',
  'لو احتجنا VM جديدة، بننشئها من قالب أو image في دقائق بدل ما نشتري server جديد.',
  'لازم نراقب الموارد. لو كل الـ VMs طلبت CPU أو RAM في نفس الوقت، هيحصل contention والأداء هيقل.',
]

export function MultipleVmsOnHostDiagram() {
  const playback = useStepPlayback(hostStages.length)
  const s = playback.stage
  const vms = [
    { name: 'VM-WEB', ip: '10.0.0.11', color: '#38bdf8' },
    { name: 'VM-DB', ip: '10.0.0.12', color: '#a78bfa' },
    { name: 'VM-APP', ip: '10.0.0.13', color: '#f59e0b' },
  ]
  return (
    <StepShell title="MULTIPLE VMs ON ONE PHYSICAL HOST" playback={playback} legend={hostStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Three virtual machines sharing one physical host through a hypervisor">
        <Note x={460} y={24} text="ONE HOST - THREE ISOLATED WORKLOADS" color="#94a3b8" size={10.5} />
        <Layer x={55} y={60} w={810} h={44} title="PHYSICAL HOST SERVER" sub="CPU | RAM | Storage | NIC" color="#64748b" active />
        {vms.map((vm, index) => {
          const x = 80 + index * 270
          const active = s >= 2 || s === 0
          return (
            <g key={vm.name} opacity={active ? 1 : 0.4}>
              <rect x={x} y={135} width={230} height={130} rx="12" fill="#0b1224" stroke={vm.color} strokeWidth={active ? 2.4 : 1.2} />
              <SvgText x={x + 115} y={165} color={vm.color} size={12} bold>{vm.name}</SvgText>
              <SvgText x={x + 115} y={190} color="#cbd5e1" size={9}>Guest OS + app</SvgText>
              <SvgText x={x + 115} y={211} color="#cbd5e1" size={9}>{`vCPU / vRAM / vNIC`}</SvgText>
              <SvgText x={x + 115} y={234} color={vm.color} size={9} bold>{vm.ip}</SvgText>
              <LinkLine x1={x + 115} y1={265} x2={x + 115} y2={295} color={vm.color} active={s >= 1} />
            </g>
          )
        })}
        <Layer x={55} y={295} w={810} h={45} title="HYPERVISOR - RESOURCE SCHEDULER" sub="allocates and isolates CPU, memory, storage, network" color="#34d399" active={s >= 1} />
        {s === 3 && <Packet point={{ x: 820, y: 200 }} color="#34d399" label="new VM" />}
        {s === 4 && <Packet point={{ x: 460, y: 317 }} color="#fb7185" label="contention" />}
        <Panel
          x={55}
          y={360}
          w={810}
          h={44}
          title="CAPACITY MATTERS"
          lines={['Virtual machines are flexible, but the physical host still has finite CPU, RAM, disk IOPS, and bandwidth.']}
          color="#f59e0b"
          active
        />
      </svg>
    </StepShell>
  )
}

const hypervisorStages = [
  'الـ Hypervisor هو طبقة برمجية بين الهاردوير الفيزيائي والـ virtual machines. بيخلّي أكتر من OS يشتغلوا على نفس الجهاز.',
  'للـ CPU: بيوزّع time slices على الـ vCPUs ويدير أي VM بتاخد execution في أي لحظة.',
  'للـ memory: بيفصل بين ذاكرة كل VM وبيراقب الـ allocation والـ overcommit بحذر.',
  'للـ storage: بيقدّم virtual disks كملفات على physical storage وينظّم الـ I/O.',
  'للـ network: بيوفّر virtual switches وvNICs توصل الـ VMs ببعض وبالشبكة الفيزيائية.',
]

export function HypervisorArchitectureDiagram() {
  const playback = useStepPlayback(hypervisorStages.length)
  const s = playback.stage
  const resources = [
    { title: 'CPU', sub: 'vCPU scheduling', color: '#38bdf8' },
    { title: 'MEMORY', sub: 'vRAM isolation', color: '#a78bfa' },
    { title: 'STORAGE', sub: 'virtual disks', color: '#f59e0b' },
    { title: 'NETWORK', sub: 'vNIC / vSwitch', color: '#34d399' },
  ]
  const activeIndex = s === 0 ? -1 : s - 1
  return (
    <StepShell title="HYPERVISOR ARCHITECTURE" playback={playback} legend={hypervisorStages[s]}>
      <svg viewBox="0 0 920 410" className="h-auto w-full min-w-[880px]" role="img" aria-label="Hypervisor managing CPU memory storage and network resources for virtual machines">
        <Note x={460} y={24} text="THE VIRTUALIZATION LAYER BETWEEN HARDWARE AND VMs" color="#94a3b8" size={10.5} />
        <Layer x={55} y={60} w={240} h={58} title="VM1" sub="guest OS + app" color="#38bdf8" active={s === 0} />
        <Layer x={340} y={60} w={240} h={58} title="VM2" sub="guest OS + app" color="#a78bfa" active={s === 0} />
        <Layer x={625} y={60} w={240} h={58} title="VM3" sub="guest OS + app" color="#34d399" active={s === 0} />
        <Layer x={55} y={155} w={810} h={72} title="HYPERVISOR" sub="resource scheduling, isolation, and virtual hardware" color="#34d399" active={s >= 0} />
        {resources.map((r, index) => {
          const x = 70 + index * 200
          const active = activeIndex === index || (s === 0 && index >= 0)
          return (
            <g key={r.title} opacity={active ? 1 : 0.4}>
              <rect x={x} y={255} width={175} height={62} rx="10" fill="#0b1224" stroke={r.color} strokeWidth={active ? 2.4 : 1.2} />
              <SvgText x={x + 87} y={280} color={r.color} size={11} bold>{r.title}</SvgText>
              <SvgText x={x + 87} y={300} color="#cbd5e1" size={8.5}>{r.sub}</SvgText>
              <LinkLine x1={x + 87} y1={227} x2={x + 87} y2={255} color={r.color} active={active} />
            </g>
          )
        })}
        <Layer x={55} y={345} w={810} h={44} title="PHYSICAL HARDWARE" sub="CPU | RAM | disks | physical NICs" color="#64748b" active />
      </svg>
    </StepShell>
  )
}

const type1Stages = [
  'Type 1 أو Bare-Metal hypervisor بيتثبّت مباشرة على الهاردوير الفيزيائي. مفيش host OS تقليدي تحته.',
  'الطبقة اللي تحت الـ VMs هي الـ hypervisor نفسه، فالـ overhead أقل والأداء غالباً أقرب للـ native.',
  'بيستخدم في الـ datacenter والخوادم الإنتاجية وال clusters، وغالباً بيديره مسؤولين عبر management console.',
  'أمثلة: VMware ESXi وMicrosoft Hyper-V لما يتنصب كـ bare-metal وXen. المنتج مش دايماً لازم يبقى نفس النموذج في كل إعداد.',
  'لازم نتذكر: تصنيف Hypervisor بيعتمد على طريقة النشر deployment، مش على اسم المنتج فقط.',
]

export function Type1HypervisorDiagram() {
  const playback = useStepPlayback(type1Stages.length)
  const s = playback.stage
  return (
    <StepShell title="TYPE 1 - BARE-METAL HYPERVISOR" playback={playback} legend={type1Stages[s]}>
      <svg viewBox="0 0 900 400" className="h-auto w-full min-w-[860px]" role="img" aria-label="Type 1 bare metal hypervisor architecture">
        <Note x={450} y={24} text="HYPERVISOR RUNS DIRECTLY ON HARDWARE" color="#94a3b8" size={10.5} />
        <Layer x={55} y={60} w={230} h={54} title="VM-A" sub="production app" color="#38bdf8" active={s <= 2} />
        <Layer x={335} y={60} w={230} h={54} title="VM-B" sub="database" color="#a78bfa" active={s <= 2} />
        <Layer x={615} y={60} w={230} h={54} title="VM-C" sub="services" color="#34d399" active={s <= 2} />
        <Layer x={55} y={160} w={790} h={78} title="TYPE 1 HYPERVISOR" sub="ESXi | Hyper-V bare-metal | Xen" color="#34d399" active={s >= 0} />
        <Layer x={55} y={280} w={790} h={54} title="PHYSICAL SERVER HARDWARE" sub="no traditional host OS underneath" color="#64748b" active={s >= 0} />
        <Panel
          x={55}
          y={350}
          w={790}
          h={42}
          title="DEPLOYMENT MODEL"
          lines={['Common in enterprise production; lower overhead than a hosted hypervisor.']}
          color="#34d399"
          active
        />
      </svg>
    </StepShell>
  )
}

const type2Stages = [
  'Type 2 أو Hosted hypervisor بيشتغل كتطبيق فوق Host OS زي Windows أو Linux أو macOS.',
  'الـ hypervisor بيطلب الموارد من الـ host OS، والـ host OS هو اللي بيتعامل مع الهاردوير الفيزيائي.',
  'غالباً بيوجد في اللابتوبس وال lab والاختبار وتجربة أنظمة مختلفة على نفس الجهاز.',
  'أمثلة: Oracle VirtualBox وVMware Workstation. الأداء غالباً أقل من Type 1 بسبب طبقة الـ host OS الإضافية.',
  'الخلاصة: Type 1 وType 2 وصف لطريقة النشر؛ منتج واحد ممكن يظهر بأشكال مختلفة حسب الإصدار والاستخدام.',
]

export function Type2HypervisorDiagram() {
  const playback = useStepPlayback(type2Stages.length)
  const s = playback.stage
  return (
    <StepShell title="TYPE 2 - HOSTED HYPERVISOR" playback={playback} legend={type2Stages[s]}>
      <svg viewBox="0 0 900 400" className="h-auto w-full min-w-[860px]" role="img" aria-label="Type 2 hosted hypervisor architecture">
        <Note x={450} y={24} text="HYPERVISOR IS AN APPLICATION ON A HOST OS" color="#94a3b8" size={10.5} />
        <Layer x={70} y={55} w={215} h={50} title="VM1" sub="lab guest OS" color="#38bdf8" active={s <= 2} />
        <Layer x={340} y={55} w={215} h={50} title="VM2" sub="test guest OS" color="#a78bfa" active={s <= 2} />
        <Layer x={610} y={55} w={215} h={50} title="VM3" sub="demo guest OS" color="#34d399" active={s <= 2} />
        <Layer x={70} y={140} w={755} h={58} title="TYPE 2 HYPERVISOR APP" sub="VirtualBox | VMware Workstation" color="#f59e0b" active={s >= 0} />
        <Layer x={70} y={225} w={755} h={52} title="HOST OPERATING SYSTEM" sub="Windows / Linux / macOS" color="#a78bfa" active={s >= 1} />
        <Layer x={70} y={302} w={755} h={42} title="PHYSICAL HARDWARE" sub="host OS controls hardware access" color="#64748b" active={s >= 1} />
        <Panel
          x={70}
          y={360}
          w={755}
          h={34}
          title="TYPICAL USE"
          lines={['Desktop labs, training, testing, and running a second OS on a workstation.']}
          color="#f59e0b"
          active
        />
      </svg>
    </StepShell>
  )
}

const vmComponentStages = [
  'الـ Virtual Machine هي „كمبيوتر داخل كمبيوتر“: ليها virtual hardware وguest OS بتشتغل زي ما تكون على جهاز حقيقي.',
  'vCPU هو وقت CPU افتراضي بيقدّمه الـ hypervisor.مش بالضرورة core فيزيائي مخصص للـ VM.',
  'vRAM هي ذاكرة مخصصة للـ VM، وvirtual disk هو ملف أو مجموعة ملفات بتظهر كـ disk داخل الـ guest.',
  'vNIC هي بطاقة شبكة افتراضية بتوصل الـ VM بـ virtual switch وبعدين بالشبكة الفيزيائية.',
  'Snapshot بيحفظ حالة VM في وقت معين للتجربة والرجوع؛ مش بديل عن backup وهو مش نسخة من كل البيانات دايماً.',
]

export function VmComponentsDiagram() {
  const playback = useStepPlayback(vmComponentStages.length)
  const s = playback.stage
  const parts = [
    { title: 'vCPU', sub: 'scheduled CPU time', color: '#38bdf8' },
    { title: 'vRAM', sub: 'isolated memory', color: '#a78bfa' },
    { title: 'vDISK', sub: 'file-backed storage', color: '#f59e0b' },
    { title: 'vNIC', sub: 'virtual network card', color: '#34d399' },
  ]
  const activeIndex = s === 0 ? -1 : s - 1
  return (
    <StepShell title="VM COMPONENTS AND VIRTUAL HARDWARE" playback={playback} legend={vmComponentStages[s]}>
      <svg viewBox="0 0 920 410" className="h-auto w-full min-w-[880px]" role="img" aria-label="Virtual machine components vCPU vRAM virtual disk and vNIC">
        <Note x={460} y={24} text="GUEST OS SEES VIRTUAL HARDWARE" color="#94a3b8" size={10.5} />
        <Layer x={55} y={60} w={810} h={62} title="GUEST OPERATING SYSTEM + APPLICATIONS" sub="runs inside the virtual machine" color="#38bdf8" active={s === 0} />
        {parts.map((part, index) => {
          const x = 70 + index * 200
          const active = activeIndex === index || s === 0
          return (
            <g key={part.title} opacity={active ? 1 : 0.4}>
              <rect x={x} y={155} width={175} height={80} rx="10" fill="#0b1224" stroke={part.color} strokeWidth={active ? 2.4 : 1.2} />
              <SvgText x={x + 87} y={185} color={part.color} size={12} bold>{part.title}</SvgText>
              <SvgText x={x + 87} y={208} color="#cbd5e1" size={8.5}>{part.sub}</SvgText>
              <LinkLine x1={x + 87} y1={122} x2={x + 87} y2={155} color={part.color} active={active} />
            </g>
          )
        })}
        <Layer x={55} y={265} w={810} h={52} title="HYPERVISOR" sub="maps virtual hardware to physical resources" color="#34d399" active />
        {s === 4 && <Packet point={{ x: 780, y: 91 }} color="#f59e0b" label="snapshot" />}
        <Panel
          x={55}
          y={340}
          w={810}
          h={55}
          title="ISOLATION"
          lines={['Each VM has its own guest OS, files, and virtual adapters; a crash in one VM does not automatically stop the others.']}
          color="#a78bfa"
          active
        />
      </svg>
    </StepShell>
  )
}

const containerStages = [
  'الـ Containerization معناها تشغيل التطبيق واعتمادياته في بيئة معزولة على نفس الـ host، من غير ما كل container يحمل OS كامل.',
  'الـ Container Image هو قالب للقراءة فقط فيه الكود والـ runtime والمكتبات. الـ running container هو نسخة قابلة للتشغيل من الـ image.',
  'الـ Container Runtime زي Docker Engine مسؤول عن تشغيل الـ containers وإدارة imagess.',
  'كل الـ containers على نفس الـ host بتتشارك في Host OS Kernel، بس كل واحد ليها مساحة عملية وملفات وشبكة معزولة.',
  'النتيجة lightweight وسريعة جداً في التشغيل؛ لازم نتذكر إن العزل هنا على مستوى نظام التشغيل مش hardware كامل.',
]

export function ContainerArchitectureDiagram() {
  const playback = useStepPlayback(containerStages.length)
  const s = playback.stage
  return (
    <StepShell title="CONTAINER ARCHITECTURE" playback={playback} legend={containerStages[s]}>
      <svg viewBox="0 0 920 410" className="h-auto w-full min-w-[860px]" role="img" aria-label="Container architecture with shared host OS kernel and container runtime">
        <Note x={460} y={24} text="SHARED KERNEL - ISOLATED APPLICATION ENVIRONMENTS" color="#94a3b8" size={10.5} />
        <Layer x={70} y={60} w={255} h={56} title="IMAGE (READ-ONLY)" sub="code + runtime + libs" color="#a78bfa" active={s === 0 || s === 1} />
        <Layer x={375} y={60} w={180} h={56} title="RUNTIME" sub="Docker Engine" color="#f59e0b" active={s === 2} />
        <Layer x={600} y={60} w={250} h={56} title="REGISTRY / IMAGE STORE" sub="where images are kept" color="#64748b" active={s === 1} />
        <LinkLine x1={325} y1={88} x2={375} y2={88} color="#a78bfa" active={s === 1 || s === 2} />
        <g opacity={s >= 3 || s === 0 ? 1 : 0.4}>
          <Layer x={70} y={150} w={235} h={72} title="CONTAINER A" sub="app + libs" color="#38bdf8" active={s >= 3} />
          <Layer x={335} y={150} w={235} h={72} title="CONTAINER B" sub="app + libs" color="#34d399" active={s >= 3} />
          <Layer x={600} y={150} w={235} h={72} title="CONTAINER C" sub="app + libs" color="#fb7185" active={s >= 3} />
        </g>
        <Layer x={70} y={255} w={765} h={52} title="SHARED HOST OS KERNEL" sub="one kernel for all containers on this host" color="#a78bfa" active={s >= 3} />
        <Layer x={70} y={330} w={765} h={42} title="PHYSICAL OR VIRTUAL HOST" sub="no separate guest OS inside each container" color="#64748b" active />
      </svg>
    </StepShell>
  )
}

const vmContainerStages = [
  'الـ VM بيعمل virtualize للـ hardware: كل VM ليها guest OS كامل فوق hypervisor. الـ container بيشارك kernel الـ host ويعزل بيئة التطبيق فقط.',
  'من ناحية الـ OS: الـ VM محتاجة OS كامل لكل نسخة. الـ container محتاج host OS واحد و runtime.',
  'العزل في الـ VM أقوى لأنه على مستوى hardware virtual؛ العزل في الـ container أخف وأسرع لكنه مرتبط بنفس الـ kernel.',
  'الـ VM بتستهلك موارد أكتر وstartup أبطأ. الـ container أخف وأسرع وغالباً أسهل في النقل والتكرار.',
  'القاعدة: استخدم VM لما تحتاج OS مختلف أو عزل قوي؛ استخدم container لما التطبيق يحتاج نشر سريع وخفيف.',
]

export function VmVsContainerDiagram() {
  const playback = useStepPlayback(vmContainerStages.length)
  const s = playback.stage
  return (
    <StepShell title="VM vs CONTAINER" playback={playback} legend={vmContainerStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Virtual machines compared with containers">
        <Note x={460} y={24} text="VM VIRTUALIZES HARDWARE - CONTAINER SHARES THE KERNEL" color="#94a3b8" size={10} />
        <g opacity={s <= 2 ? 1 : 0.4}>
          <Panel x={45} y={60} w={390} h={235} title="VIRTUAL MACHINE" lines={['Guest OS inside every VM', 'Virtual hardware via hypervisor', 'Stronger isolation', 'Heavier and slower startup']} color="#38bdf8" active={s <= 2} size={9} />
          <Layer x={80} y={170} w={150} h={44} title="VM1 OS + APP" sub="" color="#38bdf8" active={s <= 2} />
          <Layer x={260} y={170} w={150} h={44} title="VM2 OS + APP" sub="" color="#38bdf8" active={s <= 2} />
          <Layer x={80} y={230} w={330} h={42} title="HYPERVISOR" sub="" color="#34d399" active={s <= 2} />
        </g>
        <g opacity={s >= 2 ? 1 : 0.4}>
          <Panel x={485} y={60} w={390} h={235} title="CONTAINER" lines={['One host OS kernel', 'Runtime isolates app environments', 'Lightweight and fast startup', 'Portable application packaging']} color="#a78bfa" active={s >= 2} size={9} />
          <Layer x={520} y={170} w={145} h={44} title="APP A" sub="libs" color="#38bdf8" active={s >= 2} />
          <Layer x={700} y={170} w={145} h={44} title="APP B" sub="libs" color="#34d399" active={s >= 2} />
          <Layer x={520} y={230} w={325} h={42} title="SHARED HOST KERNEL" sub="" color="#a78bfa" active={s >= 2} />
        </g>
        <Panel
          x={45}
          y={315}
          w={830}
          h={68}
          title={s === 4 ? 'CHOOSE CORRECTLY' : 'MAIN DIFFERENCE'}
          lines={
            s === 4
              ? ['Need another OS or strong isolation? Use a VM. Need fast, lightweight app deployment? Use a container.']
              : ['VMs virtualize hardware. Containers share the host OS kernel and isolate application environments.']
          }
          color={s === 4 ? '#34d399' : '#f59e0b'}
          active
        />
      </svg>
    </StepShell>
  )
}

const vrfTableStages = [
  'VRF يعني Virtual Routing and Forwarding. بيعمل routing table مستقل جوّه نفس الراوتر.',
  'من غير VRF كل الـ interfaces والـ routes في جدول واحد: global routing table.',
  'مع VRF، كل VRF ليها table وforwarding context منفصل. الـ HR table مش هتشوف routes بتاعة Finance.',
  'ده بيسمح باستخدام نفس الـ IP subnet في أكتر من VRF من غير تعارض، لأن كل table separate.',
  'مهم: VRF مش مجرد VLAN. الـ VLAN بيفصل Layer 2؛ VRF بيفصل Layer 3 routing وforwarding.',
]

export function VrfRoutingTableSeparationDiagram() {
  const playback = useStepPlayback(vrfTableStages.length)
  const s = playback.stage
  const tables = [
    { title: 'GLOBAL', routes: ['0.0.0.0/0 via ISP'], color: '#64748b' },
    { title: 'HR', routes: ['192.168.10.0/24 -> Gi0/1'], color: '#38bdf8' },
    { title: 'FINANCE', routes: ['192.168.10.0/24 -> Gi0/2'], color: '#a78bfa' },
  ]
  return (
    <StepShell title="VRF ROUTING TABLE SEPARATION" playback={playback} legend={vrfTableStages[s]}>
      <svg viewBox="0 0 920 410" className="h-auto w-full min-w-[880px]" role="img" aria-label="VRF routing table separation on one router">
        <Note x={460} y={24} text="ONE ROUTER - MULTIPLE INDEPENDENT LAYER 3 TABLES" color="#94a3b8" size={10} />
        <Layer x={55} y={60} w={810} h={54} title="PHYSICAL ROUTER" sub="single device, separate forwarding contexts" color="#64748b" active />
        {tables.map((table, index) => {
          const x = 70 + index * 275
          const active = s >= 2 || (s === 1 && index === 0)
          return (
            <g key={table.title} opacity={active ? 1 : 0.4}>
              <rect x={x} y={150} width={245} height={125} rx="12" fill="#0b1224" stroke={table.color} strokeWidth={active ? 2.4 : 1.2} />
              <SvgText x={x + 122} y={180} color={table.color} size={12} bold>{`${table.title} TABLE`}</SvgText>
              {table.routes.map((route, i) => (
                <SvgText key={i} x={x + 122} y={210 + i * 22} color="#cbd5e1" size={9}>{route}</SvgText>
              ))}
              <LinkLine x1={x + 122} y1={114} x2={x + 122} y2={150} color={table.color} active={active} />
            </g>
          )
        })}
        {s === 3 && <Packet point={{ x: 460, y: 290 }} color="#34d399" label="same subnet OK" />}
        <Panel
          x={55}
          y={305}
          w={810}
          h={80}
          title={s === 4 ? 'NOT A VLAN' : 'LAYER 3 ISOLATION'}
          lines={
            s === 4
              ? ['VLAN separates Layer 2 broadcasts. VRF separates Layer 3 routing information and forwarding.']
              : ['Routes in one VRF are not installed into another VRF unless you deliberately leak or redistribute them.']
          }
          color={s === 4 ? '#f59e0b' : '#34d399'}
          active
        />
      </svg>
    </StepShell>
  )
}

const overlapStages = [
  'خيار VRF مهم في الشبكات اللي فيها أقسام بتستخدم نفس نطاق العناوين. مثال: HR وFinance كلهم بيستخدموا 192.168.10.0/24.',
  'من غير VRF، الراوتر مش هيقدر يضيف نفس الـ connected route مرتين في نفس الجدول.',
  'مع VRF-Lite، بنحط Gi0/1 في VRF HR وGi0/2 في VRF Finance.',
  'كل interface ياخد 192.168.10.1/24 جوّه VRF بتاعه، والـ subnets تتسجل في جداول منفصلة.',
  'النتيجة: كل قسم يوصل لشبكته هو بس، ومفيش مزج بين routes أو forwarding contexts.',
]

export function VrfOverlappingNetworksDiagram() {
  const playback = useStepPlayback(overlapStages.length)
  const s = playback.stage
  return (
    <StepShell title="OVERLAPPING IPs IN DIFFERENT VRFs" playback={playback} legend={overlapStages[s]}>
      <svg viewBox="0 0 920 410" className="h-auto w-full min-w-[860px]" role="img" aria-label="Two departments with overlapping IP subnets isolated by VRF">
        <Note x={460} y={24} text="SAME SUBNET - DIFFERENT VRF - NO CONFLICT" color="#94a3b8" size={10} />
        <Layer x={55} y={60} w={220} h={62} title="HR LAN" sub="192.168.10.0/24" color="#38bdf8" active={s >= 0} />
        <Layer x={645} y={60} w={220} h={62} title="FINANCE LAN" sub="192.168.10.0/24" color="#a78bfa" active={s >= 0} />
        <Layer x={350} y={60} w={220} h={62} title="ROUTER R1" sub="VRF-Lite" color="#34d399" active={s >= 0} />
        <LinkLine x1={275} y1={91} x2={350} y2={91} color="#38bdf8" active={s >= 2} />
        <LinkLine x1={570} y1={91} x2={645} y2={91} color="#a78bfa" active={s >= 2} />
        <Layer x={70} y={165} w={370} h={100} title="VRF HR - Gi0/1" sub="ip address 192.168.10.1 255.255.255.0" color="#38bdf8" active={s >= 2} />
        <Layer x={480} y={165} w={370} h={100} title="VRF FINANCE - Gi0/2" sub="ip address 192.168.10.1 255.255.255.0" color="#a78bfa" active={s >= 2} />
        <Panel
          x={55}
          y={300}
          w={810}
          h={86}
          title={s === 4 ? 'RESULT' : 'WHY IT WORKS'}
          lines={
            s === 4
              ? ['Each department reaches only its own VRF routes. There is no accidental route mixing.']
              : ['A connected route belongs to the VRF of its interface. Two separate tables can hold the same prefix.']
          }
          color="#34d399"
          active
        />
      </svg>
    </StepShell>
  )
}

const forwardingStages = [
  'لما packet يوصل لـ interface جوّه VRF، الراوتر بيستخدم جدول التوجيه بتاع الـ VRF ده مش الـ global table.',
  'مثال: packet جاي على Gi0/1 في VRF HR وعنوانه 192.168.20.0/24.',
  'الراوتر يعمل lookup في `show ip route vrf HR` ويقارن بـ HR routes only.',
  'لو فيه route، الـ packet يتعمله forwarding من interface تاني جوّه نفس الـ VRF.',
  'لو مفيش route في VRF HR، الراوتر هيقع default هناك. مش هيروح يسأل جدول VRF تاني أو الـ global تلقائياً.',
]

export function VrfPacketForwardingDiagram() {
  const playback = useStepPlayback(forwardingStages.length)
  const s = playback.stage
  return (
    <StepShell title="PACKET FORWARDING THROUGH A VRF" playback={playback} legend={forwardingStages[s]}>
      <svg viewBox="0 0 920 410" className="h-auto w-full min-w-[860px]" role="img" aria-label="Packet forwarding through a VRF routing table">
        <Note x={460} y={24} text="LOOKUP HAPPENS INSIDE THE VRF CONTEXT" color="#94a3b8" size={10.5} />
        <Node x={55} y={135} w={155} h={66} label="HOST A" sub="HR LAN" color="#38bdf8" tooltip="Host in HR VRF" active />
        <Layer x={280} y={105} w={340} h={130} title="ROUTER R1 - VRF HR" sub="separate routing and forwarding context" color="#34d399" active />
        <Node x={700} y={135} w={165} h={66} label="HOST B" sub="remote HR subnet" color="#34d399" tooltip="Destination host" active={s >= 3} />
        <LinkLine x1={210} y1={168} x2={280} y2={168} color="#38bdf8" active={s <= 2} />
        <LinkLine x1={620} y1={168} x2={700} y2={168} color="#34d399" active={s >= 3} />
        {s <= 2 && <Packet point={{ x: 245, y: 168 }} color="#38bdf8" label="packet" />}
        {s >= 3 && <Packet point={{ x: 660, y: 168 }} color="#34d399" label="forwarded" />}
        <Layer x={280} y={265} w={340} h={50} title="VRF HR TABLE" sub="show ip route vrf HR" color="#38bdf8" active={s >= 2} />
        {s === 4 && <Packet point={{ x: 450, y: 290 }} color="#fb7185" label="no route -> drop/default" />}
        <Panel
          x={55}
          y={340}
          w={810}
          h={52}
          title="CCNA POINT"
          lines={['VRF separates routing information and forwarding. It is not just another VLAN.']}
          color="#f59e0b"
          active
        />
      </svg>
    </StepShell>
  )
}
