import { motion } from 'framer-motion'
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { RichText } from '../ui/RichText'
import { LinkLine } from './ArchitectureDiagrams'
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
    const timer = window.setInterval(() => setStage((current) => (current + 1) % length), 2500)
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
      <button type="button" onClick={playback.toggle} className={`${base} border-accent-400/30 bg-accent-500/10 font-bold text-accent-300 hover:bg-accent-500/20`}>
        {playback.playing ? <Pause size={13} /> : <Play size={13} />}
        {playback.playing ? 'إيقاف' : 'شغّل'}
      </button>
      <button type="button" onClick={playback.previous} className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}><SkipBack size={13} /> السابق</button>
      <button type="button" onClick={playback.next} className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}><SkipForward size={13} /> التالي</button>
      <button type="button" onClick={playback.reset} className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}><RotateCcw size={13} /> إعادة</button>
    </div>
  )
}

function StepShell({ title, playback, legend, children }: { title: string; playback: StepPlayback; legend: string; children: ReactNode }) {
  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-sky-400/12 bg-navy-950/70">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-400/10 px-4 py-3">
        <span className="font-display text-[0.78rem] font-bold text-slate-300" dir="ltr">{title}</span>
        <StepControls playback={playback} />
      </div>
      <div className="diagram-grid overflow-x-auto px-2 py-4" dir="ltr">{children}</div>
      <div className="border-t border-sky-400/10 bg-sky-400/[0.03] px-4 py-3 text-[0.85rem] leading-[1.9] text-slate-300" dir="rtl">
        <span className="ml-2 rounded bg-accent-500/15 px-1.5 py-0.5 font-display text-[0.7rem] font-bold text-accent-300" dir="ltr">{playback.stage + 1}</span>
        <RichText>{legend}</RichText>
      </div>
    </div>
  )
}

interface Choice {
  id: string
  label: string
}

function ChoiceButtons({ items, selected, onSelect }: { items: Choice[]; selected: string; onSelect: (id: string) => void }) {
  const base = 'rounded-lg border px-2.5 py-1.5 text-[0.74rem] transition'
  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item.id)}
          className={`${base} ${selected === item.id ? 'border-accent-400/50 bg-accent-500/15 font-bold text-accent-200' : 'border-sky-400/15 text-slate-300 hover:border-accent-400/40'}`}
          dir="ltr"
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

function ChoiceShell({ title, controls, legend, children }: { title: string; controls: ReactNode; legend: string; children: ReactNode }) {
  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-sky-400/12 bg-navy-950/70">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-400/10 px-4 py-3">
        <span className="font-display text-[0.78rem] font-bold text-slate-300" dir="ltr">{title}</span>
        <div dir="rtl">{controls}</div>
      </div>
      <div className="diagram-grid overflow-x-auto px-2 py-4" dir="ltr">{children}</div>
      <motion.div key={legend} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="border-t border-sky-400/10 bg-sky-400/[0.03] px-4 py-3 text-[0.85rem] leading-[1.9] text-slate-300" dir="rtl">
        <RichText>{legend}</RichText>
      </motion.div>
    </div>
  )
}

function Box({ x, y, w, h, title, sub, color, active = false }: { x: number; y: number; w: number; h: number; title: string; sub: string; color: string; active?: boolean }) {
  return (
    <g opacity={active ? 1 : 0.4}>
      <rect x={x} y={y} width={w} height={h} rx="11" fill="#0b1224" stroke={color} strokeWidth={active ? 2.2 : 1.2} />
      <SvgText x={x + w / 2} y={y + 25} color={color} size={10} bold>{title}</SvgText>
      <SvgText x={x + w / 2} y={y + 45} color="#cbd5e1" size={8.3}>{sub}</SvgText>
    </g>
  )
}

function Badge({ x, y, text, color = '#38bdf8', active = true, w = 500 }: { x: number; y: number; text: string; color?: string; active?: boolean; w?: number }) {
  return (
    <g opacity={active ? 1 : 0.38}>
      <rect x={x} y={y} width={w} height={24} rx="7" fill="#0a1730" stroke={color} strokeWidth={active ? 1.8 : 1} />
      <SvgText x={x + w / 2} y={y + 16} color={color} size={8} bold>{text}</SvgText>
    </g>
  )
}

function FlowDot({ x1, y1, x2, y2, color, active }: { x1: number; y1: number; x2: number; y2: number; color: string; active: boolean }) {
  return (
    <motion.circle
      r={7}
      fill={color}
      initial={false}
      animate={active ? { cx: [x1, x2], cy: [y1, y2], opacity: [0.25, 1, 0.25] } : { cx: x1, cy: y1, opacity: 0.22 }}
      transition={{ duration: 1.9, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
    />
  )
}

function ClickNode({ x, y, w, h, title, sub, color, selected, onClick }: {
  x: number
  y: number
  w: number
  h: number
  title: string
  sub: string
  color: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <motion.g
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick()
        }
      }}
      className="cursor-pointer"
      animate={{ opacity: selected ? 1 : 0.56 }}
      transition={{ duration: 0.25 }}
    >
      <rect x={x} y={y} width={w} height={h} rx="9" fill="#0b1224" stroke={selected ? '#f59e0b' : color} strokeWidth={selected ? 2.5 : 1.2} />
      {selected && <rect x={x - 3} y={y - 3} width={w + 6} height={h + 6} rx="11" fill="none" stroke="#f59e0b" strokeOpacity="0.35" strokeWidth="1.5" />}
      <SvgText x={x + w / 2} y={y + 25} color={selected ? '#fbbf24' : color} size={8.8} bold>{title}</SvgText>
      <SvgText x={x + w / 2} y={y + h - 11} color="#cbd5e1" size={7.2}>{sub}</SvgText>
    </motion.g>
  )
}

interface InfoItem {
  id: string
  label: string
  sub: string
  detail: string
  color: string
}

function SelectorBoard({ items, selected, onSelect, focusTitle, columns = 3 }: {
  items: InfoItem[]
  selected: string
  onSelect: (id: string) => void
  focusTitle: string
  columns?: number
}) {
  const item = items.find((entry) => entry.id === selected) ?? items[0]
  const gapX = columns === 4 ? 222 : columns === 2 ? 430 : 300
  const width = columns === 4 ? 195 : columns === 2 ? 390 : 275
  const startX = columns === 4 ? 18 : columns === 2 ? 60 : 45
  return (
    <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label={`${focusTitle} interactive selector`}>
      <Badge x={190} y={16} text={focusTitle} color="#a78bfa" active w={540} />
      {items.map((entry, index) => {
        const col = index % columns
        const row = Math.floor(index / columns)
        return (
          <ClickNode
            key={entry.id}
            x={startX + col * gapX}
            y={100 + row * 82}
            w={width}
            h={66}
            title={entry.label}
            sub={entry.sub}
            color={entry.color}
            selected={entry.id === selected}
            onClick={() => onSelect(entry.id)}
          />
        )
      })}
      <Badge x={55} y={350} text={`SELECTED: ${item.label} - ${item.sub}`} color={item.color} active w={810} />
    </svg>
  )
}

function StageBoard({ stages, stage, ariaLabel }: { stages: string[]; stage: number; ariaLabel: string }) {
  const columns = Math.min(4, stages.length)
  const gapX = columns === 4 ? 220 : 420
  const width = columns === 4 ? 195 : 300
  const startX = columns === 4 ? 20 : 110
  return (
    <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label={ariaLabel}>
      {stages.map((label, index) => {
        const col = index % columns
        const row = Math.floor(index / columns)
        const x = startX + col * gapX
        const y = 92 + row * 85
        const done = index < stage
        const active = index === stage
        return (
          <motion.g key={label} animate={{ opacity: active ? 1 : done ? 0.78 : 0.4 }} transition={{ duration: 0.3 }}>
            <rect x={x} y={y} width={width} height={62} rx="9" fill="#0b1224" stroke={active ? '#f59e0b' : done ? '#34d399' : '#475569'} strokeWidth={active ? 2.4 : 1.2} />
            <SvgText x={x + width / 2} y={y + 25} color={active ? '#fbbf24' : done ? '#6ee7b7' : '#cbd5e1'} size={8.2} bold>{label}</SvgText>
            <SvgText x={x + width / 2} y={y + 46} color="#94a3b8" size={7.2}>{active ? 'current stage' : done ? 'completed' : 'upcoming'}</SvgText>
          </motion.g>
        )
      })}
      <Badge x={185} y={350} text="Educational simulation - placeholders only, no real credentials" color="#fb7185" active w={550} />
    </svg>
  )
}

const overviewStages = [
  'الجهاز زي أي نظام كمبيوتر: لازم نتحكم في مين يقدر يدخله ومين يقدر يغيّر إعداداته.',
  'الوصول العادي يبدأ بـ User EXEC mode ورمز >، وهذا محدود للمشاهدة والاختبارات البسيطة.',
  'الوصول المتميز Privileged EXEC mode ورمز # يسمح بـ show كاملة ودخول global configuration mode.',
  'Console port هو أقرب طريق للجهاز؛ حمايته مهمة لأن أي شخص يوصل كابل console يواجه خط الدخول الأول.',
  'لو حد دخل بصلاحية كاملة ممكن يعمل changing للـ running-config، يعطّل interfaces، أو يغيّر كلمات المرور.',
  'عشان كده بنفصل مستويات الوصول: line login، enable secret، ولocal users بصلاحيات محددة.',
]

export function DeviceAccessOverviewDiagram() {
  const playback = useStepPlayback(overviewStages.length)
  const s = playback.stage
  return (
    <StepShell title="DEVICE ACCESS CONTROL OVERVIEW" playback={playback} legend={overviewStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Device access control overview protecting console privileged access and configuration">
        <Box x={35} y={145} w={190} h={90} title="Console / VTY" sub="entry points" color="#38bdf8" active />
        <Box x={285} y={145} w={190} h={90} title="Authentication" sub="login or login local" color="#a78bfa" active={s >= 1} />
        <Box x={535} y={145} w={180} h={90} title="User EXEC >" sub="limited checks" color="#22d3ee" active={s >= 2} />
        <Box x={775} y={145} w={120} h={90} title="Privileged #" sub="full control" color="#fb7185" active={s >= 3} />
        <LinkLine x1={225} y1={190} x2={285} y2={190} color="#38bdf8" active />
        <LinkLine x1={475} y1={190} x2={535} y2={190} color="#a78bfa" active={s >= 1} />
        <LinkLine x1={715} y1={190} x2={775} y2={190} color="#fb7185" active={s >= 3} />
        <FlowDot x1={225} y1={190} x2={775} y2={190} color="#f59e0b" active={s >= 4} />
        {s >= 5 && <Badge x={180} y={315} text="Separate levels reduce accidental and unauthorized changes" color="#34d399" active w={560} />}
      </svg>
    </StepShell>
  )
}

const iosLevelItems: InfoItem[] = [
  { id: 'user', label: 'User EXEC', sub: 'prompt >', detail: 'مستوى دخول محدود؛ تقدر تعمل اختبارات بسيطة زي ping وتشوف بعض أوامر show. مفيش تغيير إعدادات.', color: '#22d3ee' },
  { id: 'privileged', label: 'Privileged EXEC', sub: 'prompt #', detail: 'مستوى متميز؛ تقدر تشوف كل أوامر show وتدخل configure terminal. لازم تحميه بـ enable secret.', color: '#fb7185' },
  { id: 'global', label: 'Global config', sub: 'prompt (config)#', detail: 'هنا بتغيّر إعدادات الجهاز نفسه. الدخول لازم يكون لمسؤولين مصرحين فقط.', color: '#a78bfa' },
  { id: 'line', label: 'Line config', sub: 'prompt (config-line)#', detail: 'إعدادات خاصة بـ console أو VTY، زي password و login و login local.', color: '#34d399' },
]

export function IosAccessLevelsDiagram() {
  const [selected, setSelected] = useState('user')
  const item = iosLevelItems.find((entry) => entry.id === selected) ?? iosLevelItems[0]
  const controls = <ChoiceButtons items={iosLevelItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="CISCO IOS ACCESS LEVELS" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={iosLevelItems} selected={selected} onSelect={setSelected} focusTitle="CISCO IOS ACCESS LEVELS" columns={2} />
    </ChoiceShell>
  )
}

const promptItems: InfoItem[] = [
  { id: 'gt', label: 'Router>', sub: 'User EXEC', detail: 'الرمز > يعني إنك في User EXEC. الصلاحيات محدودة، ومش هتقدر تدخل configure terminal من هنا.', color: '#22d3ee' },
  { id: 'hash', label: 'Router#', sub: 'Privileged EXEC', detail: 'الرمز # يعني إنك في Privileged EXEC. هنا تقدر تشوفrunning-config وتدخل configure terminal.', color: '#fb7185' },
  { id: 'enable', label: 'enable', sub: 'enter #', detail: 'أمر enable بينقلك من > إلى # بعد إدخال الـ enable password أو الـ enable secret المطلوب.', color: '#f59e0b' },
  { id: 'disable', label: 'disable', sub: 'back to >', detail: 'أمر disable بيرجّعك من # إلى >. ترتيب الأوامر بيظهر بوضوح في الـ prompt.', color: '#34d399' },
]

export function UserVsPrivilegedDiagram() {
  const [selected, setSelected] = useState('gt')
  const item = promptItems.find((entry) => entry.id === selected) ?? promptItems[0]
  const controls = <ChoiceButtons items={promptItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="USER EXEC vs PRIVILEGED EXEC" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={promptItems} selected={selected} onSelect={setSelected} focusTitle="USER EXEC PROMPT GREATER-THAN" columns={2} />
    </ChoiceShell>
  )
}

const consoleFlowStages = [
  'المستخدم يوصل كابل console في المنفذ ويبدأ جلسة Terminal على الجهاز.',
  'الجهاز يفتح line console 0 ويعرض طلب الدخول.',
  'لو فيه password على اللاين وأمر login، الجهاز يسأل عن الـ password.',
  'بعد إدخال صحيح بيدخل User EXEC ويرمز >، ومن هنا يقدر يكتب enable.',
  'لو الإدخال غلط بيفضل خارج، ومفيش وصول للـ configuration.',
]

export function ConsoleAuthFlowDiagram() {
  const playback = useStepPlayback(consoleFlowStages.length)
  const s = playback.stage
  return (
    <StepShell title="CONSOLE AUTHENTICATION FLOW" playback={playback} legend={consoleFlowStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Console authentication flow from console connection to user EXEC prompt">
        <Box x={45} y={145} w={190} h={90} title="Console cable" sub="physical session" color="#38bdf8" active />
        <Box x={300} y={145} w={210} h={90} title="line console 0" sub="line configuration" color="#a78bfa" active={s >= 1} />
        <Box x={575} y={145} w={210} h={90} title={s >= 4 ? 'Access denied' : 'Router>'} sub={s >= 4 ? 'wrong credentials' : 'User EXEC'} color={s >= 4 ? '#fb7185' : '#34d399'} active={s >= 3} />
        <LinkLine x1={235} y1={190} x2={300} y2={190} color="#38bdf8" active />
        <LinkLine x1={510} y1={190} x2={575} y2={190} color="#f59e0b" active={s >= 2} />
        <Badge x={205} y={312} text="password + login on the line controls this first gate" color="#fb7185" active w={510} />
      </svg>
    </StepShell>
  )
}

const consoleCommandItems: InfoItem[] = [
  { id: 'line', label: 'line console 0', sub: 'enter line mode', detail: 'بيفتح إعدادات خط الـ console رقم 0، وهو الخط اللي بيستخدمه الكابل المادي.', color: '#38bdf8' },
  { id: 'password', label: 'password <...>', sub: 'set line password', detail: 'بيحط كلمة مرور على اللاين. لازم تتذكر إن كلمة المرور دي بتاعت اللاين مش كلمة enable.', color: '#f59e0b' },
  { id: 'login', label: 'login', sub: 'use line password', detail: 'بيفعّل التحقق باستخدام الـ password المتخزنة على اللاين نفسه. من غيره الـ password مش هيُطلب.', color: '#34d399' },
  { id: 'exit', label: 'exit', sub: 'leave line mode', detail: 'بيرجّعك من config-line إلى global config. بعدين لازم تحفظ الإعدادات.', color: '#a78bfa' },
]

export function ConsoleLinePasswordDiagram() {
  const [selected, setSelected] = useState('login')
  const item = consoleCommandItems.find((entry) => entry.id === selected) ?? consoleCommandItems[0]
  const controls = <ChoiceButtons items={consoleCommandItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="CONSOLE LINE COMMAND EXPLAINER" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={consoleCommandItems} selected={selected} onSelect={setSelected} focusTitle="CONSOLE LINE COMMAND EXPLAINER" />
    </ChoiceShell>
  )
}

const localFlowStages = [
  'المستخدم بيكتب username وpassword في طلب الدخول.',
  'الجهاز يفتح الـ local user database المخزنة في running-config.',
  'بيقارن الاسم وكلمة المرور بالسجل المحلي الموجود على الجهاز.',
  'لو مطابق، بيسمح بالدخول ويطبق الـ privilege level المربوط باليوزر.',
  'لو اسم المستخدم أو الباسورد غلط، الدخول بيرفض ومفيش prompt متميز.',
]

export function LocalUserAuthFlowDiagram() {
  const playback = useStepPlayback(localFlowStages.length)
  const s = playback.stage
  return (
    <StepShell title="LOCAL USER AUTHENTICATION FLOW" playback={playback} legend={localFlowStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Local user authentication flow using the device username database">
        <Box x={40} y={145} w={200} h={90} title="Username + password" sub="login prompt" color="#38bdf8" active />
        <Box x={310} y={145} w={210} h={90} title="Local database" sub="username ... secret" color="#a78bfa" active={s >= 1} />
        <Box x={590} y={145} w={260} h={90} title={s >= 4 ? 'Access denied' : 'Granted'} sub={s >= 4 ? 'check credentials' : 'apply privilege level'} color={s >= 4 ? '#fb7185' : '#34d399'} active={s >= 3} />
        <LinkLine x1={240} y1={190} x2={310} y2={190} color="#38bdf8" active />
        <LinkLine x1={520} y1={190} x2={590} y2={190} color="#f59e0b" active={s >= 2} />
        <FlowDot x1={240} y1={190} x2={590} y2={190} color="#f59e0b" active={s >= 3} />
        <Badge x={205} y={312} text="login local means: authenticate against locally configured usernames" color="#34d399" active w={510} />
      </svg>
    </StepShell>
  )
}

const loginItems: InfoItem[] = [
  { id: 'login', label: 'login', sub: 'line password', detail: 'بيقول للجهاز: اسأل عن الـ password الموضوع على اللاين نفسه. مصدر التحقق هو `password <...>` داخل اللاين.', color: '#38bdf8' },
  { id: 'login-local', label: 'login local', sub: 'local users', detail: 'بيقول للجهاز: اسأل عن username وpassword وقارنهم بـ `username ... secret` المخزنة محلياً على الجهاز.', color: '#34d399' },
  { id: 'no-login', label: 'no login', sub: 'no prompt', detail: 'من غير login أو login local، اللاين غالباً مش هيطلب تحقق؛ ده خطر لأنه يسمح بدخول غير محمي.', color: '#fb7185' },
  { id: 'both', label: 'not interchangeable', sub: 'choose one', detail: 'الاثنان طريقتان مختلفتان لنفس اللاين. مش لازم تستخدمهم مع بعض؛ اختر الطريقة اللي تخطط لها وافهم مصدرCreds.', color: '#f59e0b' },
]

export function LoginVsLoginLocalDiagram() {
  const [selected, setSelected] = useState('login-local')
  const item = loginItems.find((entry) => entry.id === selected) ?? loginItems[0]
  const controls = <ChoiceButtons items={loginItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="LOGIN vs LOGIN LOCAL" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={loginItems} selected={selected} onSelect={setSelected} focusTitle="LOGIN vs LOGIN LOCAL" columns={2} />
    </ChoiceShell>
  )
}

const enablePasswordStages = [
  'المستخدم في User EXEC > يكتب enable.',
  'الجهاز يسأل عن الـ enable password.',
  'بعد إدخال صحيح بيتحول إلى Privileged EXEC #.',
  'من هنا يقدر يدخل global configuration mode ويغيّر الإعدادات.',
]

export function EnablePasswordFlowDiagram() {
  const playback = useStepPlayback(enablePasswordStages.length)
  const s = playback.stage
  return (
    <StepShell title="ENABLE PASSWORD FLOW" playback={playback} legend={enablePasswordStages[s]}>
      <StageBoard stages={['Router>', 'enable', 'Password?', 'Router#']} stage={s} ariaLabel="Enable password authentication flow into privileged EXEC mode" />
    </StepShell>
  )
}

const enableSecretStages = [
  'المستخدم يكتب enable من User EXEC.',
  'الجهاز يسأل عن الـ enable secret.',
  'الجهاز يحسب hash لقيمة الإدخال ويقارنها بالـ hash المخزن.',
  'المطابقة تفتح Privileged EXEC #، والـ secret نفسه ما بيظهرش في running-config.',
  ' enable secret هو الخيار المفضل لأنه أقوى من enable password التقليدي.',
]

export function EnableSecretFlowDiagram() {
  const playback = useStepPlayback(enableSecretStages.length)
  const s = playback.stage
  return (
    <StepShell title="ENABLE SECRET FLOW" playback={playback} legend={enableSecretStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Enable secret authentication flow using stronger hashing">
        <Box x={40} y={145} w={190} h={90} title="enable" sub="from Router>" color="#38bdf8" active />
        <Box x={295} y={145} w={190} h={90} title="Secret input" sub="never displayed" color="#a78bfa" active={s >= 1} />
        <Box x={550} y={145} w={160} h={90} title="Hash check" sub="compare stored" color="#f59e0b" active={s >= 2} />
        <Box x={775} y={145} w={120} h={90} title="Router#" sub="privileged" color="#34d399" active={s >= 3} />
        <LinkLine x1={230} y1={190} x2={295} y2={190} color="#38bdf8" active />
        <LinkLine x1={485} y1={190} x2={550} y2={190} color="#a78bfa" active={s >= 1} />
        <LinkLine x1={710} y1={190} x2={775} y2={190} color="#34d399" active={s >= 3} />
        <Badge x={205} y={312} text="enable secret is preferred over enable password" color="#34d399" active w={510} />
      </svg>
    </StepShell>
  )
}

const enableCompareItems: InfoItem[] = [
  { id: 'strength', label: 'Strength', sub: 'hash vs weak', detail: 'enable secret بيستخدم آلية hash أقوى، بينما enable password تقليدياً أضعف ويمكن عرضه بصيغة قابلة للفك.', color: '#34d399' },
  { id: 'preference', label: 'Preferred', sub: 'enable secret', detail: 'Cisco بتنصح باستخدام enable secret لحماية Privileged EXEC. لو الاثنان متضبطين، enable secret هو اللي هيُستخدم غالباً.', color: '#22d3ee' },
  { id: 'display', label: 'Config display', sub: 'different output', detail: 'الـ hash أو التشفير الظاهر في running-config بيختلف حسب إصدار IOS والمنصة ونوع الـ hash المدعوم.', color: '#a78bfa' },
  { id: 'legacy', label: 'Legacy use', sub: 'avoid when possible', detail: 'enable password موجود في أجهزة قديمة ولأسباب توافقية، بس ما ينصحش نعتمد عليه كخيار أساسي في تصميم حديث.', color: '#fb7185' },
]

export function EnablePasswordVsSecretDiagram() {
  const [selected, setSelected] = useState('preference')
  const item = enableCompareItems.find((entry) => entry.id === selected) ?? enableCompareItems[0]
  const controls = <ChoiceButtons items={enableCompareItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="ENABLE PASSWORD vs ENABLE SECRET" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={enableCompareItems} selected={selected} onSelect={setSelected} focusTitle="ENABLE PASSWORD vs ENABLE SECRET" columns={2} />
    </ChoiceShell>
  )
}

const usernameItems: InfoItem[] = [
  { id: 'username', label: 'username', sub: 'command keyword', detail: 'بيضيف أو يعدّل حساب محلي في قاعدة بيانات الجهاز.', color: '#38bdf8' },
  { id: 'admin', label: 'admin', sub: 'username value', detail: 'اسم الحساب. يفضّل اسم واضح ومرتبط بدور وظيفي، مع عدم مشاركة الحسابات.', color: '#22d3ee' },
  { id: 'privilege', label: 'privilege 15', sub: 'full access', detail: 'مستوى الصلاحية الأعلى في IOS. يعطي وصولاً إدارياً كاملاً؛ يستخدم للمسؤولين المصرحين فقط وليس تطبيقاً لـ Least Privilege.', color: '#fb7185' },
  { id: 'secret', label: 'secret', sub: 'hashed password', detail: 'بيخزّن كلمة المرور بصيغة hash على الجهاز بدل تخزينها كنص عادي في الإعداد.', color: '#34d399' },
]

export function LocalUsernameDatabaseDiagram() {
  const [selected, setSelected] = useState('secret')
  const item = usernameItems.find((entry) => entry.id === selected) ?? usernameItems[0]
  const controls = <ChoiceButtons items={usernameItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="LOCAL USERNAME DATABASE" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={usernameItems} selected={selected} onSelect={setSelected} focusTitle="LOCAL USERNAME DATABASE" />
    </ChoiceShell>
  )
}

const storageItems: InfoItem[] = [
  { id: 'plain', label: 'Plain text', sub: 'readable in config', detail: 'ظاهر كنص مقروء في running-config. لازم نتجنبه مع كلمات المرور الحقيقية.', color: '#fb7185' },
  { id: 'type7', label: 'Type 7', sub: 'weak obfuscation', detail: 'ناتج `service password-encryption` لكلمات مرور مؤهلة. قابل للعكس وضعيف؛ بيمنع بس النظر العابر للإعداد.', color: '#f59e0b' },
  { id: 'hash', label: 'Secret hash', sub: 'enable secret / username secret', detail: 'بيستخدم آلية hash أقوى. النص الأصلي مش متخزين، والتحقق بيحصل بمقارنة الـ hash.', color: '#34d399' },
  { id: 'version', label: 'IOS dependent', sub: 'type defaults vary', detail: 'الأنواع المتاحة والافتراضية بتختلف حسب إصدار Cisco IOS والمنصة. راجع `show running-config` على جهازك.', color: '#a78bfa' },
]

export function PasswordStorageComparisonDiagram() {
  const [selected, setSelected] = useState('type7')
  const item = storageItems.find((entry) => entry.id === selected) ?? storageItems[0]
  const controls = <ChoiceButtons items={storageItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="PASSWORD STORAGE COMPARISON" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={storageItems} selected={selected} onSelect={setSelected} focusTitle="PASSWORD STORAGE COMPARISON" />
    </ChoiceShell>
  )
}

const type7Stages = [
  'بعض أوامر IOS بتخزّن كلمات مرور مؤهلة كنص عادي في running-config.',
  'أمر `service password-encryption` بيحوّل النص ده إلى صيغة Type 7.',
  'الهدف الأساسي: منع القارئ العابر من قراءة الباسورد مباشرة في الإعداد.',
  'Type 7 مش تشفير قوي؛ de-obfuscation ممكن لأن الخوارزمية قابلة للعكس.',
  'عشان كده استخدم `enable secret` و`username ... secret` واعتبر Type 7 مجرد طبقة عرض.',
]

export function Type7ObfuscationDiagram() {
  const playback = useStepPlayback(type7Stages.length)
  const s = playback.stage
  return (
    <StepShell title="TYPE 7 OBFUSCATION" playback={playback} legend={type7Stages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Type 7 password obfuscation visualization showing reversible output">
        <Box x={40} y={145} w={210} h={90} title="Plain text" sub="visible in config" color="#fb7185" active />
        <Box x={330} y={145} w={250} h={90} title="service password-encryption" sub="obfuscation command" color="#f59e0b" active={s >= 1} />
        <Box x={660} y={145} w={210} h={90} title="Type 7 value" sub="weak and reversible" color="#a78bfa" active={s >= 2} />
        <LinkLine x1={250} y1={190} x2={330} y2={190} color="#fb7185" active />
        <LinkLine x1={580} y1={190} x2={660} y2={190} color="#f59e0b" active={s >= 1} />
        <FlowDot x1={250} y1={190} x2={660} y2={190} color="#f59e0b" active={s >= 3} />
        <Badge x={165} y={310} text="NOT strong encryption - prevents casual viewing only" color="#fb7185" active w={590} />
      </svg>
    </StepShell>
  )
}

const hashStages = [
  'المستخدم بيكتب كلمة المرور أو الـ secret وقت تسجيل الدخول.',
  'IOS بيمرّر الإدخال خلال دالة hash مدعومة على المنصة والإصدار.',
  'الناتج بيخزّن في running-config كقيمة hash مش كنص أصلي.',
  'وقت التحقق، الجهاز يعمل hash للإدخال الجديد ويقارنه بالقيمة المخزنة.',
  'المطابقة تعني قبول، من غير ما الجهاز يعرض كلمة المرور الأصلية.',
]

export function PasswordHashingConceptDiagram() {
  const playback = useStepPlayback(hashStages.length)
  const s = playback.stage
  return (
    <StepShell title="PASSWORD HASHING CONCEPT" playback={playback} legend={hashStages[s]}>
      <StageBoard stages={['Input', 'Hash function', 'Stored hash', 'Compare', 'Accept / deny']} stage={s} ariaLabel="Password hashing concept comparing a candidate secret with a stored hash" />
    </StepShell>
  )
}

const configScopeItems: InfoItem[] = [
  { id: 'running', label: 'running-config', sub: 'active in RAM', detail: 'الإعداد الحالي الشغّال على الجهاز. أي تغيير بيفعّل فوراً هنا، بس بيفضي لو الجهاز عمل reload من غير حفظ.', color: '#38bdf8' },
  { id: 'startup', label: 'startup-config', sub: 'stored in NVRAM', detail: 'النسخة المحفوظة اللي بتتحمل عند بدء التشغيل. لازم تنسخ running-config إليها عشان التغيير يفضل.', color: '#34d399' },
  { id: 'copy', label: 'copy running-config startup-config', sub: 'save command', detail: 'الأمر اللي بيحفظ الإعداد الحالي في NVRAM. ده محاكاة تعليمية مش تنفيذ فعلي على جهاز.', color: '#f59e0b' },
]

export function RunningVsStartupDiagram() {
  const [selected, setSelected] = useState('running')
  const item = configScopeItems.find((entry) => entry.id === selected) ?? configScopeItems[0]
  const controls = <ChoiceButtons items={configScopeItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="RUNNING CONFIG vs STARTUP CONFIG" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={configScopeItems} selected={selected} onSelect={setSelected} focusTitle="RUNNING CONFIG vs STARTUP CONFIG" columns={3} />
    </ChoiceShell>
  )
}

const accessPathItems: InfoItem[] = [
  { id: 'console', label: 'Console', sub: 'physical cable', detail: 'خط مباشر للم Switching/router عبر منفذ console. أول حماية ليه هي `line console 0` مع login أو login local.', color: '#38bdf8' },
  { id: 'vty', label: 'VTY', sub: 'remote lines', detail: 'خطوط للوصول عن بُعد زي SSH. يقدروا يستخدموا `login local` كمان، والتفاصيل الكاملة للـ SSH في Topic 4.8.', color: '#a78bfa' },
  { id: 'same', label: 'Same idea', sub: 'different path', detail: 'فكرة التحقق واحدة: نتأكد من هوية المستخدم وبعدين نحدد الصلاحية. الفرق الأساسي هو طريق الوصول نفسه.', color: '#34d399' },
]

export function ConsoleVtyAccessDiagram() {
  const [selected, setSelected] = useState('console')
  const item = accessPathItems.find((entry) => entry.id === selected) ?? accessPathItems[0]
  const controls = <ChoiceButtons items={accessPathItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="CONSOLE vs VTY ACCESS" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={accessPathItems} selected={selected} onSelect={setSelected} focusTitle="CONSOLE vs VTY ACCESS" columns={3} />
    </ChoiceShell>
  )
}

const completeStages = [
  'نقطة دخول: Console أو VTY. كل واحدة ليها خط إعداد خاص.',
  'طريقة التحقق: `login` باستخدام line password أو `login local` باستخدام قاعدة المستخدمين.',
  'بعد نجاح الدخول يظهر User EXEC >، وهو مستوى محدود.',
  'أمر `enable` بيطلب enable secret وينقل إلى Privileged EXEC #.',
  'من هنا تدخل global config وتطبق السياسات والأوامر المطلوبة.',
  'التحقق النهائي: show running-config وshow line وshow users، ثم حفظ الإعداد.',
]

export function CompleteDeviceAuthDiagram() {
  const playback = useStepPlayback(completeStages.length)
  const s = playback.stage
  return (
    <StepShell title="COMPLETE DEVICE AUTHENTICATION ARCHITECTURE" playback={playback} legend={completeStages[s]}>
      <StageBoard stages={['Entry', 'Login method', 'User EXEC', 'Enable secret', 'Config', 'Verify + save']} stage={s} ariaLabel="Complete device authentication architecture for console and VTY access" />
    </StepShell>
  )
}

const troubleItems: InfoItem[] = [
  { id: 'no-prompt', label: 'No login prompt', sub: 'console opens directly', detail: 'غالباً نسيت `login` أو `login local` تحت اللاين. راجع `show running-config` وصلح بإضافة طريقة التحقق المطلوبة.', color: '#fb7185' },
  { id: 'line-pass', label: 'Line password fails', sub: 'typed password rejected', detail: 'راجع الـ password المضبوط على اللاين وتأكد إنك بتستخدم `login` مش `login local`. ما تشاركش الباسورد في الشرح.', color: '#f59e0b' },
  { id: 'no-user', label: 'login local fails', sub: 'username not accepted', detail: `غالباً مفيش \`username ... secret\` مطابق على الجهاز. راجع قاعدة المستخدمين وأضف الحساب المصرح به قبل تفعيل \`login local\`.`, color: '#a78bfa' },
  { id: 'enable-mix', label: 'enable confusion', sub: 'password vs secret', detail: 'لو متوقع Enable secret بس الجهاز بيطلب حاجة تانية، راجع الفرق بين `enable password` و`enable secret` واستخدم `enable secret`.', color: '#38bdf8' },
  { id: 'not-saved', label: 'Lost after reload', sub: 'changes disappeared', detail: 'التغيير كان في running-config بس. اعمل `copy running-config startup-config` بعد التأكد من صحة الإعداد.', color: '#34d399' },
  { id: 'locked', label: 'Locked out', sub: 'cannot access device', detail: 'قفّل التغييرات المتاحة واتبع إجراءات المؤسسة المعتمدة مع مسؤول مخول. ما تحاولش recovery عشوائي يفقد الإعداد.', color: '#fb7185' },
]

export function AuthTroubleshootingDiagram() {
  const [selected, setSelected] = useState('no-prompt')
  const item = troubleItems.find((entry) => entry.id === selected) ?? troubleItems[0]
  const controls = <ChoiceButtons items={troubleItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="AUTHENTICATION TROUBLESHOOTING DECISION TREE" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={troubleItems} selected={selected} onSelect={setSelected} focusTitle="AUTHENTICATION TROUBLESHOOTING DECISION TREE" columns={3} />
    </ChoiceShell>
  )
}

const configSequenceStages = [
  '1 — `enable secret <STRONG_ENABLE_SECRET>` لحماية Privileged EXEC.',
  '2 — `username admin privilege 15 secret <STRONG_ADMIN_PASSWORD>` لحساب مسؤول محلي.',
  '3 — `line console 0` ثم `login local` لتفعيل مصادقة المستخدمين المحليين.',
  '4 — أو بديل: `password <CONSOLE_PASSWORD>` ثم `login` على نفس اللاين.',
  '5 — `service password-encryption` لإخفاء كلمات مرور مؤهلة عن النظر العابر فقط.',
  '6 — `end` ثم `copy running-config startup-config` لحفظ الإعداد النهائي.',
]

export function SecureConfigSequenceDiagram() {
  const playback = useStepPlayback(configSequenceStages.length)
  const s = playback.stage
  return (
    <StepShell title="SECURE DEVICE ACCESS CONFIGURATION SEQUENCE" playback={playback} legend={configSequenceStages[s]}>
      <StageBoard stages={['enable secret', 'username secret', 'line console', 'login local / login', 'obfuscation', 'save config']} stage={s} ariaLabel="Secure device access configuration sequence from secret to saving configuration" />
    </StepShell>
  )
}

const verifyItems: InfoItem[] = [
  { id: 'running', label: 'show running-config', sub: 'active config', detail: 'اعرض الإعداد الحالي ودور على enable secret، username، وخط console أو VTY. القيم الحساسة قد تظهر كـ hash أو Type 7 حسب الإصدار.', color: '#38bdf8' },
  { id: 'startup', label: 'show startup-config', sub: 'saved config', detail: 'قارن النسخة المحفوظة بالحالية. لو فيه فرق، معناها إن تغييراتك لسه مش محفوظة.', color: '#34d399' },
  { id: 'line', label: 'show line', sub: 'line status', detail: 'بيعرض حالة الخطوط زي console وVTY وبيساعد تتأكد إن اللاين موجود ومفعّل.', color: '#a78bfa' },
  { id: 'privilege', label: 'show privilege', sub: 'current level', detail: 'بيقولك مستوى الصلاحية الحالي. غالباً 1 في User EXEC و15 في Privileged EXEC.', color: '#f59e0b' },
  { id: 'users', label: 'show users', sub: 'active sessions', detail: 'بيعرض الجلسات النشطة على الجهاز وبيساعدك تراجع مين متصل حالياً.', color: '#22d3ee' },
  { id: 'modes', label: 'enable / disable', sub: 'prompt change', detail: '`enable` ينقلك من > إلى # بعد التحقق، و`disable` يرجّعك إلى >. الرمز بنفسه دليل على المستوى.', color: '#fb7185' },
]

export function VerificationCommandExplorerDiagram() {
  const [selected, setSelected] = useState('running')
  const item = verifyItems.find((entry) => entry.id === selected) ?? verifyItems[0]
  const controls = <ChoiceButtons items={verifyItems.map((entry) => ({ id: entry.id, label: entry.label }))} selected={selected} onSelect={setSelected} />
  return (
    <ChoiceShell title="VERIFICATION COMMAND EXPLORER" controls={controls} legend={`**${item.label}** — ${item.detail}`}>
      <SelectorBoard items={verifyItems} selected={selected} onSelect={setSelected} focusTitle="VERIFICATION COMMAND EXPLORER" columns={3} />
    </ChoiceShell>
  )
}
