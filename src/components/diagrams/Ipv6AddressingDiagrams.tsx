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
    const timer = window.setInterval(() => setStage((current) => (current + 1) % length), 2200)
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
      <button
        type="button"
        onClick={playback.previous}
        className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}
      >
        <SkipBack size={13} /> السابق
      </button>
      <button
        type="button"
        onClick={playback.next}
        className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}
      >
        <SkipForward size={13} /> التالي
      </button>
      <button
        type="button"
        onClick={playback.reset}
        className={`${base} border-sky-400/15 text-slate-300 hover:border-accent-400/40`}
      >
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
}: {
  x: number
  y: number
  w: number
  h: number
  title: string
  lines: string[]
  color?: string
  active?: boolean
}) {
  return (
    <g opacity={active ? 1 : 0.5}>
      <rect x={x} y={y} width={w} height={h} rx="12" fill="#0b1224" stroke={color} strokeWidth={active ? 2.2 : 1.1} />
      <SvgText x={x + w / 2} y={y + 21} color={color} size={10} bold>
        {title}
      </SvgText>
      {lines.map((line, index) => (
        <SvgText key={index} x={x + w / 2} y={y + 40 + index * 15} color="#cbd5e1" size={9.5}>
          {line}
        </SvgText>
      ))}
    </g>
  )
}

function SectionLabel({ x, y, text, color = '#64748b' }: { x: number; y: number; text: string; color?: string }) {
  return (
    <SvgText x={x} y={y} color={color} size={10} bold>
      {text}
    </SvgText>
  )
}

const exampleHextets = ['2001', '0DB8', '0000', '0000', '0000', '0000', '0000', '0001']
const exampleBinary = [
  '0010000000000001',
  '0000110110111000',
  '0000000000000000',
  '0000000000000000',
  '0000000000000000',
  '0000000000000000',
  '0000000000000000',
  '0000000000000001',
]

const sizeStages = [
  '`IPv4` بيتكوّن من 32 bit: أربعة octets، وكل octet 8 بتات. الكتابة النهائية decimal مفصولة بنقاط.',
  '`IPv6` بيتكوّن من 128 bit: تمانية hextets، وكل hextet 16 bit. الكتابة hexadecimal مفصولة بكولون.',
  'الفرق مش „زيادة صغيرة“: الفرق في عدد العناوين هو `2^128 / 2^32 = 2^96` مرة.',
  'IPv4 اتستنفد عملياً، فـ NAT/PAT والـ private addressing لسه بتأخّر المشكلة. IPv6 اتصمّم كنظام عنونة جديد، مش امتداد لـ IPv4.',
  'في الفترة الحالية بيحصل coexistence: dual stack و transition mechanisms. بس كل بروتوكول ليه عنوانه وقواعده المستقلة.',
]

export function Ipv4VsIpv6SizeDiagram() {
  const playback = useStepPlayback(sizeStages.length)
  const stage = playback.stage

  return (
    <StepShell title="IPv4 32 BITS vs IPv6 128 BITS / WHY IPv6 EXISTS" playback={playback} legend={sizeStages[stage]}>
      <svg viewBox="0 0 900 360" className="h-auto w-full min-w-[780px]" role="img" aria-label="Comparison of IPv4 32-bit and IPv6 128-bit address sizes">
        <title>IPv4 32-bit exhaustion compared with the much larger IPv6 128-bit address space</title>

        <Panel x={45} y={45} w={340} h={92} title="IPv4 · 32 BITS" lines={['4 octets × 8 bits', 'Dotted decimal: 192.168.1.10', 'About 4.3 billion addresses']} color="#38bdf8" active={stage === 0} />
        <Panel x={515} y={45} w={340} h={92} title="IPv6 · 128 BITS" lines={['8 hextets × 16 bits', 'Hexadecimal: 2001:DB8::1', '2^128 possible addresses']} color="#a78bfa" active={stage === 1} />

        {stage >= 2 && (
          <Panel
            x={45}
            y={165}
            w={810}
            h={76}
            title="ADDRESS SPACE RATIO"
            lines={['IPv6 / IPv4 = 2^128 / 2^32 = 2^96 times more addresses', 'That scale supports phones, IoT, cloud and future growth']}
            color="#34d399"
            active
          />
        )}

        {stage === 3 && (
          <Panel
            x={45}
            y={252}
            w={810}
            h={80}
            title="WHY IPV4 RAN OUT · AND WHY IPV6 IS NOT A PATCH"
            lines={['IPv4 exhaustion pushed private addressing + NAT/PAT, but those are workarounds.', 'IPv6 has a new 128-bit address format and its own header and rules.']}
            color="#fb7185"
            active
          />
        )}

        {stage === 4 && (
          <g>
            <Node x={45} y={255} w={180} h={68} label="HOST" sub="IPv4 + IPv6" color="#38bdf8" tooltip="Dual-stack device running both protocols" active />
            <Node x={315} y={255} w={180} h={68} label="R1" sub="dual stack" color="#fbbf24" tooltip="Router forwarding both IPv4 and IPv6" active />
            <Node x={585} y={255} w={270} h={68} label="COEXISTENCE" sub="tunnel / translation" color="#34d399" tooltip="High-level transition mechanisms during coexistence" active />
            <LinkLine x1={225} y1={289} x2={315} y2={289} active />
            <LinkLine x1={495} y1={289} x2={585} y2={289} active color="#34d399" />
          </g>
        )}
      </svg>
    </StepShell>
  )
}

const structureStages = [
  'العنوان `2001:0DB8:0000:0000:0000:0000:0000:0001` مكوّن من تمانية hextets. كل hextet بينهم كولون `:`.',
  'كل hextet = 16 bit. يعني `8 × 16 = 128 bit` بالظبط.',
  'كل رقم hexadecimal بيمثّل 4 بتات، فالـ hextet الواحد فيه 4 أرقام hex = 16 bit.',
  'الصورة اللي تحت بتوري نفس العنوان مكتوب كـ 128 bit بعد تحويل كل hextet لـ binary.',
]

export function Ipv6StructureDiagram() {
  const playback = useStepPlayback(structureStages.length)
  const stage = playback.stage
  const nibbleDemo = [
    { hex: '2', bin: '0010' },
    { hex: '0', bin: '0000' },
    { hex: '0', bin: '0000' },
    { hex: '1', bin: '0001' },
  ]

  return (
    <StepShell title="IPv6 ADDRESS / 128 BITS = 8 HEXTETS × 16 BITS" playback={playback} legend={structureStages[stage]}>
      <svg viewBox="0 0 920 360" className="h-auto w-full min-w-[840px]" role="img" aria-label="IPv6 128-bit address split into eight 16-bit hextets">
        <title>IPv6 128-bit structure with eight hexadecimal hextets</title>

        <SvgText x={460} y={30} color="#7dd3fc" size={13} bold>EXAMPLE: 2001:0DB8:0000:0000:0000:0000:0000:0001</SvgText>
        <SvgText x={460} y={50} color="#94a3b8" size={10}>8 HEXTETS × 16 BITS = 128 BITS · EACH HEX DIGIT = 4 BITS</SvgText>

        {exampleHextets.map((value, index) => {
          const x = 24 + index * 110
          const active = stage === 0 || stage === 1 || stage === 2
          return (
            <g key={index} opacity={active ? 1 : 0.55}>
              <rect x={x} y={72} width={98} height={52} rx="9" fill={stage === 0 ? '#38bdf8' : '#0b1224'} fillOpacity={stage === 0 ? 0.16 : 0.9} stroke="#38bdf8" strokeWidth={stage === 0 ? 2 : 1} />
              <SvgText x={x + 49} y={92} color="#64748b" size={8}>{`H${index + 1}`}</SvgText>
              <SvgText x={x + 49} y={113} color="#7dd3fc" size={14} bold>{value}</SvgText>
              {index < 7 && <SvgText x={x + 104} y={105} color="#64748b" size={17} bold>:</SvgText>}
            </g>
          )
        })}

        {stage >= 1 && (
          <g>
            <SectionLabel x={35} y={148} text="16-BIT BINARY OF EACH HEXTET" color="#a78bfa" />
            {exampleBinary.map((binary, index) => (
              <SvgText key={index} x={73 + index * 110} y={170} color="#c4b5fd" size={7.6}>
                {binary}
              </SvgText>
            ))}
          </g>
        )}

        {stage === 2 && (
          <Panel
            x={40}
            y={195}
            w={840}
            h={66}
            title="FULL 128-BIT VIEW"
            lines={['0010000000000001 0000110110111000 0000000000000000 0000000000000000', '0000000000000000 0000000000000000 0000000000000000 0000000000000001']}
            color="#34d399"
            active
          />
        )}

        {stage === 3 && (
          <g>
            <SectionLabel x={40} y={205} text="FIRST HEXTET 2001 = FOUR HEX DIGITS × FOUR BITS" color="#34d399" />
            {nibbleDemo.map((item, index) => (
              <g key={item.hex}>
                <rect x={50 + index * 205} y={220} width={180} height={78} rx="10" fill="#0b1224" stroke="#34d399" />
                <SvgText x={140 + index * 205} y={248} color="#f8fafc" size={16} bold>{item.hex}</SvgText>
                <SvgText x={140 + index * 205} y={278} color="#6ee7b7" size={14} bold>{item.bin}</SvgText>
              </g>
            ))}
          </g>
        )}
      </svg>
    </StepShell>
  )
}

const hextetStages = [
  'اضغط على أي hextet في الشريط اللي فوق عشان تفحص قيمته والـ 16 bit بتاعته.',
  'الكولون `:` بيفصل بين التمانية hextets. العدد لازم يكون 8 في الصيغة الكاملة.',
  'كل hextet ممكن يتكتب من 1 لـ 4 hexadecimal digits بعد إزالة الـ leading zeros.',
  'القيمة اللي اخترتها اتحوّلت لـ 16 bit. لو البتات كلها صفر، الـ hextet بيكون `0000`.',
]

export function Ipv6HextetsDiagram() {
  const playback = useStepPlayback(hextetStages.length)
  const stage = playback.stage
  const [selected, setSelected] = useState(1)
  const value = exampleHextets[selected]
  const binary = parseInt(value, 16).toString(2).padStart(16, '0')
  const grouped = binary.match(/.{1,4}/g)?.join(' ') ?? ''

  return (
    <StepShell title="INSPECT ONE HEXTET / 2001:0DB8:0000:...:0001" playback={playback} legend={hextetStages[stage]}>
      <svg viewBox="0 0 920 350" className="h-auto w-full min-w-[840px]" role="img" aria-label="Selectable IPv6 hextets showing 16-bit binary values">
        <title>Interactive inspection of each 16-bit IPv6 hextet</title>

        <SectionLabel x={30} y={30} text="CLICK A HEXTET TO INSPECT IT" color="#38bdf8" />
        {exampleHextets.map((item, index) => (
          <g key={index} onClick={() => setSelected(index)} style={{ cursor: 'pointer' }}>
            <title>{`Hextet ${index + 1}: ${item}`}</title>
            <rect
              x={25 + index * 110}
              y={48}
              width={98}
              height={56}
              rx="10"
              fill={selected === index ? '#38bdf8' : '#0b1224'}
              fillOpacity={selected === index ? 0.2 : 0.95}
              stroke={selected === index ? '#38bdf8' : '#1e3a5f'}
              strokeWidth={selected === index ? 2.4 : 1}
            />
            <SvgText x={74 + index * 110} y={70} color={selected === index ? '#e0f2fe' : '#64748b'} size={8}>
              {`H${index + 1}`}
            </SvgText>
            <SvgText x={74 + index * 110} y={92} color={selected === index ? '#7dd3fc' : '#94a3b8'} size={13} bold>
              {item}
            </SvgText>
          </g>
        ))}

        <Panel
          x={35}
          y={135}
          w={420}
          h={92}
          title={`SELECTED H${selected + 1} = ${value}`}
          lines={['Hex digits: 0–9 and A–F', `Binary 16 bits: ${grouped}`]}
          color="#a78bfa"
          active
        />

        <SectionLabel x={35} y={255} text="16 BIT POSITIONS" color="#64748b" />
        {binary.split('').map((bit, index) => (
          <g key={index}>
            <rect x={35 + index * 26} y={270} width={22} height={38} rx="5" fill={bit === '1' ? '#38bdf8' : '#0b1224'} fillOpacity={bit === '1' ? 0.75 : 1} stroke={bit === '1' ? '#38bdf8' : '#1e3a5f'} />
            <SvgText x={46 + index * 26} y={295} color={bit === '1' ? '#f8fafc' : '#64748b'} size={11} bold>
              {bit}
            </SvgText>
          </g>
        ))}

        {stage >= 2 && (
          <Panel
            x={505}
            y={135}
            w={380}
            h={92}
            title="WHY 4 HEX DIGITS?"
            lines={['Each hex digit maps to exactly 4 bits.', '4 digits × 4 bits = 16 bits per hextet.']}
            color="#34d399"
            active
          />
        )}

        {stage === 3 && (
          <Panel
            x={505}
            y={250}
            w={380}
            h={76}
            title="FULL ADDRESS CHECK"
            lines={['8 hextets × 16 bits = 128 bits.', 'Every hextet is one group between two colons.']}
            color="#fbbf24"
            active
          />
        )}
      </svg>
    </StepShell>
  )
}

const hexDigits = [
  { hex: '0', dec: '0', bin: '0000' },
  { hex: '1', dec: '1', bin: '0001' },
  { hex: '2', dec: '2', bin: '0010' },
  { hex: '3', dec: '3', bin: '0011' },
  { hex: '4', dec: '4', bin: '0100' },
  { hex: '5', dec: '5', bin: '0101' },
  { hex: '6', dec: '6', bin: '0110' },
  { hex: '7', dec: '7', bin: '0111' },
  { hex: '8', dec: '8', bin: '1000' },
  { hex: '9', dec: '9', bin: '1001' },
  { hex: 'A', dec: '10', bin: '1010' },
  { hex: 'B', dec: '11', bin: '1011' },
  { hex: 'C', dec: '12', bin: '1100' },
  { hex: 'D', dec: '13', bin: '1101' },
  { hex: 'E', dec: '14', bin: '1110' },
  { hex: 'F', dec: '15', bin: '1111' },
]

const hexStages = [
  'الـ hexadecimal بيستخدم 16 رمز: `0–9` و `A–F`. يعني كل رقم واحد ممكن يمثّل قيم من 0 لـ 15.',
  'كل hex digit بيمثّل 4 بتات بالظبط. الأوزان من اليسار: `8 · 4 · 2 · 1`.',
  'مثال `D = 13`: البتات `1101` يعني `8 + 4 + 0 + 1 = 13`.',
  'اضغط على digit من `0DB8` أو `2001` عشان تشوف التحويل خطوة بخطوة.',
]

export function Ipv6HexBinaryDiagram() {
  const playback = useStepPlayback(hexStages.length)
  const stage = playback.stage
  const [selected, setSelected] = useState('D')
  const current = hexDigits.find((item) => item.hex === selected) ?? hexDigits[0]
  const weights = [8, 4, 2, 1]

  return (
    <StepShell title="HEXADECIMAL ↔ BINARY / ONE DIGIT = FOUR BITS" playback={playback} legend={hexStages[stage]}>
      <svg viewBox="0 0 900 350" className="h-auto w-full min-w-[820px]" role="img" aria-label="Hexadecimal to binary conversion with four-bit weights">
        <title>Hexadecimal digits mapped to four binary bits</title>

        <SectionLabel x={35} y={28} text="HEX ALPHABET · 16 SYMBOLS" color="#38bdf8" />
        {hexDigits.map((item, index) => (
          <g key={item.hex} opacity={stage === 0 ? 1 : 0.55}>
            <rect x={25 + index * 54} y={42} width={44} height={42} rx="7" fill={item.hex === selected ? '#38bdf8' : '#0b1224'} fillOpacity={item.hex === selected ? 0.2 : 1} stroke={item.hex === selected ? '#38bdf8' : '#1e3a5f'} />
            <SvgText x={47 + index * 54} y={69} color={item.hex === selected ? '#e0f2fe' : '#94a3b8'} size={12} bold>
              {item.hex}
            </SvgText>
          </g>
        ))}

        <SectionLabel x={35} y={120} text="CLICK A DIGIT INSIDE 0DB8 / 2001" color="#a78bfa" />
        {['0', 'D', 'B', '8', '2', '0', '0', '1'].map((digit, index) => (
          <g key={`${digit}-${index}`} onClick={() => setSelected(digit)} style={{ cursor: 'pointer' }}>
            <rect x={35 + index * 100} y={135} width={82} height={48} rx="9" fill={selected === digit && (index < 4 ? true : digit === 'D') ? '#a78bfa' : '#0b1224'} fillOpacity={selected === digit ? 0.2 : 0.95} stroke={selected === digit ? '#a78bfa' : '#1e3a5f'} />
            <SvgText x={76 + index * 100} y={165} color={selected === digit ? '#ede9fe' : '#cbd5e1'} size={14} bold>
              {digit}
            </SvgText>
          </g>
        ))}

        <SectionLabel x={35} y={215} text={`SELECTED ${current.hex} = ${current.dec} DECIMAL = ${current.bin} BINARY`} color="#34d399" />
        {current.bin.split('').map((bit, index) => (
          <g key={index}>
            <rect x={35 + index * 90} y={230} width={74} height={56} rx="9" fill={bit === '1' ? '#34d399' : '#0b1224'} fillOpacity={bit === '1' ? 0.2 : 1} stroke={bit === '1' ? '#34d399' : '#1e3a5f'} strokeWidth={bit === '1' ? 2 : 1} />
            <SvgText x={72 + index * 90} y={252} color={bit === '1' ? '#d1fae5' : '#64748b'} size={13} bold>
              {bit}
            </SvgText>
            <SvgText x={72 + index * 90} y={272} color="#94a3b8" size={10}>
              {`weight ${weights[index]}`}
            </SvgText>
          </g>
        ))}

        <Panel
          x={35}
          y={304}
          w={830}
          h={36}
          title="RULE"
          lines={['A–F mean 10–15; each hex digit always becomes exactly four bits.']}
          color="#fbbf24"
          active={stage >= 1}
        />
      </svg>
    </StepShell>
  )
}

const leadingStages = [
  'القاعدة الأولى: الـ leading zeros جوه أي hextet ممكن تتشال. مثال `0DB8` تبقى `DB8`.',
  'كل hextet يتعامل لوحده: `0000` تبقى `0`، و`0001`تبقى `1`، و`2001` تفضل `2001`.',
  'النتيجة بعد إزالة الـ leading zeros: `2001:DB8:0:0:0:0:0:1`. لسه مفيش `::` في الخطوة دي.',
  'فخ مهم: متشيلش صفر من نص أو آخر hextet. `2000` معناها 8192، أمّا `200` معناها 512 — مش نفس القيمة.',
]

export function Ipv6LeadingZerosDiagram() {
  const playback = useStepPlayback(leadingStages.length)
  const stage = playback.stage
  const shortened = ['2001', 'DB8', '0', '0', '0', '0', '0', '1']

  return (
    <StepShell title="RULE 1 / REMOVE ONLY LEADING ZEROS" playback={playback} legend={leadingStages[stage]}>
      <svg viewBox="0 0 920 340" className="h-auto w-full min-w-[840px]" role="img" aria-label="Removing leading zeros from each IPv6 hextet">
        <title>Leading zero removal in IPv6 hextets</title>

        <SectionLabel x={40} y={30} text="FULL FORM" color="#38bdf8" />
        <SectionLabel x={500} y={30} text="LEADING ZEROS REMOVED" color="#34d399" />
        {exampleHextets.map((value, index) => (
          <g key={index} opacity={stage === 0 || stage === 1 ? 1 : 0.65}>
            <rect x={35 + (index % 4) * 205} y={48 + Math.floor(index / 4) * 66} width={175} height={50} rx="9" fill="#0b1224" stroke="#38bdf8" />
            <SvgText x={122 + (index % 4) * 205} y={79 + Math.floor(index / 4) * 66} color="#7dd3fc" size={13} bold>
              {value}
            </SvgText>
          </g>
        ))}

        {stage >= 1 && (
          <g>
            {shortened.map((value, index) => (
              <g key={`short-${index}`}>
                <rect x={495 + (index % 4) * 100} y={48 + Math.floor(index / 4) * 66} width={88} height={50} rx="9" fill="#0b1224" stroke="#34d399" />
                <SvgText x={539 + (index % 4) * 100} y={79 + Math.floor(index / 4) * 66} color="#6ee7b7" size={13} bold>
                  {value}
                </SvgText>
              </g>
            ))}
          </g>
        )}

        {stage === 2 && (
          <Panel x={45} y={195} w={830} h={62} title="RESULT AFTER RULE 1 ONLY" lines={['2001:DB8:0:0:0:0:0:1', 'Still eight hextets; no compression has happened yet.']} color="#34d399" active />
        )}

        {stage === 3 && (
          <g>
            <Panel x={45} y={195} w={390} h={100} title="VALID LEADING-ZERO REMOVAL" lines={['0DB8 → DB8', '0001 → 1 · 0000 → 0']} color="#34d399" active />
            <Panel x={485} y={195} w={390} h={100} title="INVALID VALUE CHANGE" lines={['2000 must stay 2000', '2000 → 200 changes 0x2000 to 0x0200']} color="#fb7185" active />
          </g>
        )}
      </svg>
    </StepShell>
  )
}

const compressionStages = [
  'بعد إزالة الـ leading zeros عندنا `2001:DB8:0:0:0:0:0:1` — تمانية hextets، منهم خمسة متتابعين صفر.',
  'القاعدة التانية: أقرب سلسلة واحدة من الـ hextets الصفرية تتكتب `::` مرة واحدة.',
  'هنا الـ `::` بيضيف مكان خمسة hextets ناقصين بين `DB8` و`1`.',
  'النتيجة الأقصر: `2001:DB8::1`. لازم تعرف تحسب إن في خمسة أصفار مخفية.',
  'ممنوع تستخدم `::` أكتر من مرة في نفس العنوان، زي `2001::DB8::1` — مش هيبقى معروف أنهي سلسلة تقول.',
]

export function Ipv6ZeroCompressionDiagram() {
  const playback = useStepPlayback(compressionStages.length)
  const stage = playback.stage
  const values = ['2001', 'DB8', '0', '0', '0', '0', '0', '1']
  const zeroRun = [2, 3, 4, 5, 6]

  return (
    <StepShell title="RULE 2 / COMPRESS ONE CONSECUTIVE ZERO RUN WITH ::" playback={playback} legend={compressionStages[stage]}>
      <svg viewBox="0 0 920 360" className="h-auto w-full min-w-[840px]" role="img" aria-label="Compressing five consecutive zero hextets into a double colon">
        <title>IPv6 zero compression with a single double colon</title>

        <SectionLabel x={35} y={30} text="EIGHT HEXTETS AFTER REMOVING LEADING ZEROS" color="#38bdf8" />
        {values.map((value, index) => {
          const highlighted = stage >= 1 && zeroRun.includes(index)
          return (
            <g key={index} opacity={highlighted ? 1 : 0.8}>
              <rect
                x={30 + index * 110}
                y={48}
                width={96}
                height={54}
                rx="9"
                fill={highlighted ? '#fbbf24' : '#0b1224'}
                fillOpacity={highlighted ? 0.2 : 1}
                stroke={highlighted ? '#fbbf24' : '#1e3a5f'}
                strokeWidth={highlighted ? 2.2 : 1}
              />
              <SvgText x={78 + index * 110} y={81} color={highlighted ? '#fde68a' : '#cbd5e1'} size={13} bold>
                {value}
              </SvgText>
              {index < 7 && <SvgText x={129 + index * 110} y={81} color="#475569" size={13}>:</SvgText>}
            </g>
          )
        })}

        {stage === 1 && (
          <Panel x={40} y={135} w={840} h={64} title="LONGEST CONSECUTIVE RUN = FIVE ZERO HEXTETS" lines={['H3 · H4 · H5 · H6 · H7 are all 0000', 'Only one run may be replaced by ::']} color="#fbbf24" active />
        )}

        {stage >= 2 && (
          <g>
            <rect x={40} y={145} width={215} height={76} rx="11" fill="#0b1224" stroke="#38bdf8" strokeWidth="2" />
            <SvgText x={147} y={175} color="#7dd3fc" size={15} bold>2001:DB8</SvgText>
            <SvgText x={147} y={202} color="#94a3b8" size={10}>VISIBLE HEXTETS</SvgText>

            <rect x={285} y={145} width={350} height={76} rx="11" fill="#fbbf24" fillOpacity="0.16" stroke="#fbbf24" strokeWidth="2.4" />
            <SvgText x={460} y={178} color="#fde68a" size={22} bold>::</SvgText>
            <SvgText x={460} y={204} color="#fde68a" size={10}>REPLACES 5 ZERO HEXTETS</SvgText>

            <rect x={665} y={145} width={215} height={76} rx="11" fill="#0b1224" stroke="#34d399" strokeWidth="2" />
            <SvgText x={772} y={175} color="#6ee7b7" size={15} bold>1</SvgText>
            <SvgText x={772} y={202} color="#94a3b8" size={10}>VISIBLE HEXTET</SvgText>
          </g>
        )}

        {stage === 3 && (
          <Panel x={40} y={250} w={840} h={70} title="FINAL SHORTEST FORM" lines={['2001:DB8::1', 'Count check: 3 visible + 5 hidden = 8 hextets = 128 bits.']} color="#34d399" active />
        )}

        {stage === 4 && (
          <Panel x={40} y={250} w={840} h={70} title="INVALID — DOUBLE COLON USED TWICE" lines={['2001::DB8::1 → ambiguous: which run gets which zeros?', 'Use :: only once in one IPv6 address.']} color="#fb7185" active />
        )}
      </svg>
    </StepShell>
  )
}

const expansionStages = [
  'العنوان المختصر `2001:DB8::1`. عشان نفردها، أول حاجة نعدّ الـ hextets الظاهرة.',
  'الظاهر 3 hextets: `2001` و `DB8` و `1`. يعني الناقص `8 - 3 = 5`.',
  `مكان الـ :: بنحط خمسة hextets صفر: 2001:DB8:0:0:0:0:0:1.`,
  'لو حببنا نرجّع الـ leading zeros للصيغة الكاملة: `2001:0DB8:0000:0000:0000:0000:0000:0001`.',
  'مثال تاني: `FE80::1` فيه hextetين ظاهرين، فالناقص 6 → `FE80:0:0:0:0:0:0:1`.',
]

export function Ipv6ExpansionDiagram() {
  const playback = useStepPlayback(expansionStages.length)
  const stage = playback.stage
  const expanded = ['2001', 'DB8', '0', '0', '0', '0', '0', '1']

  return (
    <StepShell title="EXPANDING A COMPRESSED IPv6 ADDRESS / COUNT THE MISSING HEXTETS" playback={playback} legend={expansionStages[stage]}>
      <svg viewBox="0 0 920 360" className="h-auto w-full min-w-[840px]" role="img" aria-label="Expanding a compressed IPv6 address by counting missing hextets">
        <title>IPv6 expansion from double-colon notation back to eight hextets</title>

        <Panel x={40} y={42} w={300} h={78} title="COMPRESSED" lines={['2001:DB8::1', 'Visible hextets = 3']} color="#38bdf8" active={stage <= 1} />
        <Panel x={365} y={42} w={210} h={78} title="COUNT" lines={['8 − 3 = 5', 'missing hextets']} color="#fbbf24" active={stage === 1} />
        <Panel x={600} y={42} w={280} h={78} title="EXPANDED" lines={['2001:DB8:0:0:0:0:0:1', 'Total = 8 hextets']} color="#34d399" active={stage >= 2} />

        {stage >= 2 && (
          <g>
            <SectionLabel x={40} y={150} text="FILL THE DOUBLE-COLON GAP WITH FIVE ZERO HEXTETS" color="#34d399" />
            {expanded.map((value, index) => (
              <g key={index}>
                <rect x={35 + index * 110} y={168} width={98} height={52} rx="9" fill={index >= 2 && index <= 6 ? '#34d399' : '#0b1224'} fillOpacity={index >= 2 && index <= 6 ? 0.18 : 1} stroke={index >= 2 && index <= 6 ? '#34d399' : '#1e3a5f'} />
                <SvgText x={84 + index * 110} y={200} color={index >= 2 && index <= 6 ? '#d1fae5' : '#cbd5e1'} size={13} bold>
                  {value}
                </SvgText>
              </g>
            ))}
          </g>
        )}

        {stage === 3 && (
          <Panel x={40} y={248} w={840} h={72} title="FULL FORM WITH LEADING ZEROS RESTORED" lines={['2001:0DB8:0000:0000:0000:0000:0000:0001', 'Validity check: eight groups, each group 1–4 hex digits.']} color="#a78bfa" active />
        )}

        {stage === 4 && (
          <Panel x={40} y={248} w={840} h={72} title="SECOND EXAMPLE" lines={['FE80::1 → FE80:0:0:0:0:0:0:1', 'Visible = 2, missing = 8 − 2 = 6 zero hextets.']} color="#fbbf24" active />
        )}
      </svg>
    </StepShell>
  )
}

const prefixStages = [
  'الـ `Prefix Length` بيتكتب بعد العنوان بـ `/p` وبيقول: أول `p` بتات من اليسار هي شبكة/prefix، والباقي interface identifier.',
  'في `/64`: أول 64 bit prefix وآخر 64 bit interface ID. في المثال أول أربعة hextets prefix وآخر أربعة ID.',
  'الحد بينهم عند البت رقم 64 — يعني بعد نهاية الـ hextet الرابع بالظبط.',
  '`/48` و `/56` و `/64` و `/128` بتستخدم في مستويات مختلفة. `/128` معناه عنوان واحد بس (host route).',
]

export function Ipv6PrefixBoundaryDiagram() {
  const playback = useStepPlayback(prefixStages.length)
  const stage = playback.stage
  const full = ['2001', 'DB8', '1234', '5678', 'ABCD', 'EF12', '3456', '7890']
  const prefixRows = [
    { prefix: '/48', bits: '48 prefix + 80 ID', note: 'first 3 hextets · typically a site allocation' },
    { prefix: '/56', bits: '56 prefix + 72 ID', note: 'first 3 hextets + first 8 bits of H4' },
    { prefix: '/64', bits: '64 prefix + 64 ID', note: 'first 4 hextets · standard LAN subnet' },
    { prefix: '/128', bits: '128 prefix + 0 ID', note: 'single address / host route' },
  ]

  return (
    <StepShell title="PREFIX LENGTH vs INTERFACE IDENTIFIER / THE /64 BOUNDARY" playback={playback} legend={prefixStages[stage]}>
      <svg viewBox="0 0 920 380" className="h-auto w-full min-w-[840px]" role="img" aria-label="IPv6 prefix boundary and interface identifier division for /64">
        <title>IPv6 /64 prefix and interface identifier boundary</title>

        <SvgText x={460} y={28} color="#e2e8f0" size={12} bold>2001:DB8:1234:5678:ABCD:EF12:3456:7890/64</SvgText>
        <SvgText x={460} y={48} color="#94a3b8" size={10}>FIRST 64 BITS = NETWORK PREFIX · LAST 64 BITS = INTERFACE IDENTIFIER</SvgText>

        {full.map((value, index) => {
          const isPrefix = index < 4
          const x = 25 + index * 110
          return (
            <g key={index} opacity={stage >= 1 ? 1 : 0.7}>
              <rect x={x} y={70} width={100} height={58} rx="9" fill={isPrefix ? '#38bdf8' : '#a78bfa'} fillOpacity={0.18} stroke={isPrefix ? '#38bdf8' : '#a78bfa'} strokeWidth={2} />
              <SvgText x={x + 50} y={93} color={isPrefix ? '#7dd3fc' : '#c4b5fd'} size={8}>
                {isPrefix ? 'PREFIX' : 'INTERFACE ID'}
              </SvgText>
              <SvgText x={x + 50} y={116} color="#f8fafc" size={13} bold>
                {value}
              </SvgText>
              {index === 3 && (
                <SvgText x={x + 108} y={112} color="#fbbf24" size={16} bold>|</SvgText>
              )}
            </g>
          )
        })}

        {stage === 0 && (
          <Panel x={45} y={160} w={830} h={70} title="PREFIX LENGTH IS NOT AN IPv4 SUBNET MASK" lines={['IPv4 uses 255.255.255.0; IPv6 writes /64 directly.', 'It always counts the leftmost network bits.']} color="#fbbf24" active />
        )}

        {stage >= 2 && (
          <g>
            <SectionLabel x={45} y={170} text="128 BIT POSITIONS — BOUNDARY AFTER BIT 64" color="#fbbf24" />
            {Array.from({ length: 128 }).map((_, index) => {
              const isPrefix = index < 64
              return (
                <rect
                  key={index}
                  x={45 + (index % 64) * 12.4}
                  y={184 + Math.floor(index / 64) * 26}
                  width={10}
                  height={18}
                  rx="2"
                  fill={isPrefix ? '#38bdf8' : '#a78bfa'}
                  fillOpacity={index === 64 ? 1 : 0.75}
                  stroke={index === 64 ? '#fbbf24' : 'none'}
                  strokeWidth={index === 64 ? 1.5 : 0}
                />
              )
            })}
            <SvgText x={460} y={252} color="#94a3b8" size={10}>BITS 1–64 PREFIX · BITS 65–128 INTERFACE IDENTIFIER</SvgText>
          </g>
        )}

        {stage === 3 && (
          <g>
            {prefixRows.map((row, index) => (
              <g key={row.prefix}>
                <rect x={45} y={272 + index * 25} width={830} height={21} rx="5" fill="#0b1224" stroke={index === 2 ? '#34d399' : '#1e3a5f'} />
                <SvgText x={85} y={287 + index * 25} color={index === 2 ? '#6ee7b7' : '#cbd5e1'} size={9} bold>
                  {row.prefix}
                </SvgText>
                <SvgText x={215} y={287 + index * 25} color="#7dd3fc" size={9}>
                  {row.bits}
                </SvgText>
                <SvgText x={575} y={287 + index * 25} color="#94a3b8" size={9}>
                  {row.note}
                </SvgText>
              </g>
            ))}
          </g>
        )}
      </svg>
    </StepShell>
  )
}

const guaLlaStages = [
  '`Global Unicast Address (GUA)` بيستخدم النطاق `2000::/3`. أول تلات بتات `001`، والعنوان قابل للتوجيه عالمياً.',
  'مثال GUA: `2001:DB8:1:1::10`. الجهاز بيقدر يتكلّم مع شبكات تانية عبر الراوترات.',
  '`Link-Local Address (LLA)` بيستخدم `FE80::/10`. أول عشر بتات `1111111010`، والعنوان للرابط المحلي بس.',
  'الراوترات مش بيعبّروا LLA بين الروابط، بس بتستخدمه في جيران الـ IPv6 و كـ next hop. لو عايز تعمل ping لـ LLA لازم تحدد outgoing interface.',
]

export function Ipv6GuaVsLlaDiagram() {
  const playback = useStepPlayback(guaLlaStages.length)
  const stage = playback.stage

  return (
    <StepShell title="GLOBAL UNICAST 2000::/3 vs LINK-LOCAL FE80::/10" playback={playback} legend={guaLlaStages[stage]}>
      <svg viewBox="0 0 920 370" className="h-auto w-full min-w-[840px]" role="img" aria-label="Global unicast and link-local IPv6 address comparison">
        <title>Global Unicast Address versus Link-Local Address</title>

        <Panel x={40} y={42} w={395} h={105} title="GUA · 2000::/3" lines={['First 3 bits = 001 · range 2000:: – 3FFF:...', 'Globally routable beyond the local link', 'Example: 2001:DB8:1:1::10']} color="#38bdf8" active={stage <= 1} />
        <Panel x={485} y={42} w={395} h={105} title="LLA · FE80::/10" lines={['First 10 bits = 1111111010 · FE80:: – FEBF:...', 'Automatic and valid only on one link', 'Example: FE80::1']} color="#fbbf24" active={stage >= 2} />

        {stage === 1 && (
          <g>
            <Node x={50} y={190} w={180} h={70} label="PC1" sub="2001:DB8:1:1::10" color="#38bdf8" tooltip="Host with a global unicast address" active />
            <Node x={350} y={190} w={180} h={70} label="R1" sub="GUA routing" color="#fbbf24" tooltip="Router forwarding globally routable traffic" active />
            <Node x={650} y={190} w={220} h={70} label="INTERNET" sub="global routing" color="#34d399" tooltip="Remote networks reachable through routers" active />
            <LinkLine x1={230} y1={225} x2={350} y2={225} active />
            <LinkLine x1={530} y1={225} x2={650} y2={225} active color="#34d399" />
            <Packet point={{ x: 290, y: 225 }} color="#38bdf8" label="GUA" />
          </g>
        )}

        {stage >= 2 && (
          <g>
            <SectionLabel x={50} y={180} text="LINK A" color="#fbbf24" />
            <SectionLabel x={520} y={180} text="LINK B" color="#fbbf24" />
            <Node x={50} y={195} w={180} h={70} label="PC1" sub="FE80::10" color="#38bdf8" tooltip="Link-local address on link A" active={stage === 2} />
            <Node x={350} y={195} w={160} h={70} label="R1" sub="FE80::1" color="#fbbf24" tooltip="Router interface on link A" active />
            <Node x={530} y={195} w={160} h={70} label="R2" sub="FE80::2" color="#fbbf24" tooltip="Router interface on link B and adjacency with R1" active={stage >= 3} />
            <Node x={760} y={195} w={120} h={70} label="PC2" sub="FE80::20" color="#a78bfa" tooltip="Link-local address on link B" active={stage === 2} />
            <LinkLine x1={230} y1={230} x2={350} y2={230} active color="#fbbf24" />
            <LinkLine x1={510} y1={230} x2={530} y2={230} active color="#fbbf24" />
            <LinkLine x1={690} y1={230} x2={760} y2={230} active color="#fbbf24" />
          </g>
        )}

        {stage === 3 && (
          <Panel x={40} y={292} w={840} h={60} title="ROUTER RULE" lines={['Routers use LLA for IPv6 neighbor adjacencies, but never forward LLA packets to another link.', 'ping FE80::2 → choose the correct outgoing interface when prompted.']} color="#34d399" active />
        )}
      </svg>
    </StepShell>
  )
}

const euiStages = [
  'ابدأ بـ 48-bit MAC: `00:1A:2B:3C:4D:5E`. أول 24 bit (OUI) والآخر 24 bit (vendor ID).',
  'اقسم الـ MAC نصين، وبعدين حط `FF:FE` في النص: `00:1A:2B` + `FF:FE` + `3C:4D:5E`.',
  'النتيجة 8 بايتات = 64 bit interface ID قبل تعديل الـ U/L bit.',
  'الـ U/L bit هو البت التاني من اليمين في أول بايت (mask `0x02`)، مش الـ I/G bit. في `00` البت = 0، فينقلب لـ 1 والبايت يبقى `02`.',
  'بعد الفلِب: `02:1A:2B:FF:FE:3C:4D:5E`. في Modified EUI-64، u=1 يعني universal scope وu=0 يعني local scope.',
  'اجمع كل بايتين في hextet: `021A:2BFF:FE3C:4D5E`. مع بريفكس `/64` يبقى العنوان `2001:DB8:1:1:21A:2BFF:FE3C:4D5E`.',
  'لأن الـ ID مرتبط بـ MAC، ممكن يتتبّع الجهاز. عشان كده الأنظمة الحديثة بتستخدم privacy extensions أو random interface IDs.',
]

export function Ipv6ModifiedEui64Diagram() {
  const playback = useStepPlayback(euiStages.length)
  const stage = playback.stage
  const macBytes = ['00', '1A', '2B', '3C', '4D', '5E']
  const euiBytes = ['00', '1A', '2B', 'FF', 'FE', '3C', '4D', '5E']
  const finalBytes = ['02', '1A', '2B', 'FF', 'FE', '3C', '4D', '5E']
  const originalBits = '00000000'
  const flippedBits = '00000010'

  const byteCards = (items: string[], startX: number, y: number, width: number, activeStage: number) =>
    items.map((byte, index) => {
      const inserted = byte === 'FF' || byte === 'FE'
      const changed = stage >= 4 && index === 0
      const color = changed ? '#34d399' : inserted ? '#a78bfa' : '#38bdf8'
      return (
        <g key={`${byte}-${index}`} opacity={stage >= activeStage ? 1 : 0.4}>
          <rect x={startX + index * width} y={y} width={width - 8} height={46} rx="8" fill={color} fillOpacity={changed || inserted ? 0.18 : 0.08} stroke={color} strokeWidth={changed ? 2.4 : 1.2} />
          <SvgText x={startX + index * width + (width - 8) / 2} y={y + 29} color={changed ? '#d1fae5' : '#cbd5e1'} size={12} bold>
            {byte}
          </SvgText>
        </g>
      )
    })

  return (
    <StepShell title="MODIFIED EUI-64 CALCULATOR / MAC 00:1A:2B:3C:4D:5E" playback={playback} legend={euiStages[stage]}>
      <svg viewBox="0 0 920 430" className="h-auto w-full min-w-[850px]" role="img" aria-label="Step by step Modified EUI-64 calculation from a MAC address">
        <title>Modified EUI-64 calculation with FF:FE insertion and U/L bit inversion</title>

        <SectionLabel x={35} y={28} text="STEP 1 — 48-BIT MAC" color="#38bdf8" />
        {byteCards(macBytes, 35, 40, 105, 0)}
        <SvgText x={178} y={105} color="#7dd3fc" size={9}>FIRST 24 BITS · OUI</SvgText>
        <SvgText x={522} y={105} color="#a78bfa" size={9}>LAST 24 BITS · VENDOR ID</SvgText>

        {stage >= 1 && (
          <g>
            <SectionLabel x={35} y={135} text="STEP 2 — INSERT FF:FE IN THE MIDDLE" color="#a78bfa" />
            {byteCards(euiBytes, 35, 148, 105, 1)}
            <SvgText x={460} y={215} color="#c4b5fd" size={10}>8 BYTES = 64 BITS</SvgText>
          </g>
        )}

        {stage >= 3 && (
          <g>
            <SectionLabel x={35} y={245} text="STEP 3 — INVERT THE U/L BIT (MASK 0x02)" color="#34d399" />
            <rect x={35} y={258} width={390} height={75} rx="10" fill="#0b1224" stroke="#fbbf24" />
            <SvgText x={230} y={280} color="#fde68a" size={10} bold>BEFORE · FIRST BYTE 0x00</SvgText>
            {originalBits.split('').map((bit, index) => (
              <SvgText key={index} x={72 + index * 38} y={312} color={index === 6 ? '#fb7185' : '#94a3b8'} size={13} bold>
                {bit}
              </SvgText>
            ))}

            <rect x={495} y={258} width={390} height={75} rx="10" fill="#0b1224" stroke="#34d399" />
            <SvgText x={690} y={280} color="#6ee7b7" size={10} bold>AFTER · FIRST BYTE 0x02</SvgText>
            {flippedBits.split('').map((bit, index) => (
              <SvgText key={index} x={532 + index * 38} y={312} color={index === 6 ? '#34d399' : '#94a3b8'} size={13} bold>
                {bit}
              </SvgText>
            ))}
            <SvgText x={460} y={350} color="#94a3b8" size={9}>BIT POSITION 1 FROM THE RIGHT · 0 → 1 · I/G BIT IS NOT TOUCHED</SvgText>
          </g>
        )}

        {stage >= 4 && (
          <g>
            <SectionLabel x={35} y={372} text="FINAL INTERFACE ID BYTES" color="#34d399" />
            {byteCards(finalBytes, 35, 382, 105, 4)}
          </g>
        )}

        {stage >= 5 && (
          <Panel x={35} y={330} w={420} h={42} title="HEXTETS" lines={['021A:2BFF:FE3C:4D5E']} color="#34d399" active />
        )}

        {stage === 6 && (
          <Panel x={475} y={330} w={410} h={42} title="PRIVACY" lines={['Use privacy extensions or random interface IDs.']} color="#fb7185" active />
        )}
      </svg>
    </StepShell>
  )
}

const labStages = [
  'التوبولوجيا الكاملة: `R1` و `R2` و `SW1` و `PC1` و `PC2`. الرابط بين الراوترين point-to-point.',
  'LAN 1 على `2001:DB8:1:1::/64`: R1 G0/0 = `::1` و PC1 = `::10`.',
  'الرابط بين الراوترين على `2001:DB8:12:12::/64`: R1 G0/1 = `::1` و R2 G0/0 = `::2`.',
  'LAN 2 على `2001:DB8:2:2::/64`: R2 G0/1 = `::1` و PC2 = `::10`.',
  'التحقق: `show ipv6 interface brief` و `show ipv6 neighbors` و ping. الخطأ المتعمّد في اللاب 2 هو `/127` بدل `/64`.',
]

export function Ipv6LabTopologyDiagram() {
  const playback = useStepPlayback(labStages.length)
  const stage = playback.stage

  return (
    <StepShell title="PACKET TRACER LABS / R1 — R2 + TWO IPv6 LANs" playback={playback} legend={labStages[stage]}>
      <svg viewBox="0 0 920 380" className="h-auto w-full min-w-[840px]" role="img" aria-label="Complete IPv6 Packet Tracer topology with R1 R2 SW1 PC1 and PC2">
        <title>Complete IPv6 lab topology with two LANs and a router-to-router link</title>

        <SectionLabel x={45} y={25} text="LAN 1 · 2001:DB8:1:1::/64" color="#38bdf8" />
        <SectionLabel x={690} y={25} text="LAN 2 · 2001:DB8:2:2::/64" color="#34d399" />

        <Node x={40} y={60} w={165} h={64} label="R1" sub={stage === 2 ? 'G0/1 ::1/64' : 'G0/0 ::1/64'} color="#fbbf24" tooltip="Router R1 with LAN 1 and the R1-R2 link" active />
        <Node x={370} y={60} w={170} h={64} label="SW1" sub="VLAN 10 + 20" color="#60a5fa" tooltip="Access switch separating the two lab LANs" active />
        <Node x={700} y={60} w={165} h={64} label="R2" sub={stage === 3 ? 'G0/1 ::1/64' : 'G0/0 ::2/64'} color="#fbbf24" tooltip="Router R2 with the R1-R2 link and LAN 2" active />
        <Node x={40} y={250} w={165} h={64} label="PC1" sub={stage === 1 ? '2001:DB8:1:1::10' : 'IPv6 host'} color="#38bdf8" tooltip="Host in LAN 1" active={stage <= 1 || stage >= 3} />
        <Node x={700} y={250} w={165} h={64} label="PC2" sub={stage === 3 ? '2001:DB8:2:2::10' : 'IPv6 host'} color="#34d399" tooltip="Host in LAN 2" active={stage <= 1 || stage >= 3} />

        <LinkLine x1={205} y1={92} x2={370} y2={92} active color="#38bdf8" />
        <LinkLine x1={205} y1={92} x2={700} y2={92} active={stage === 0 || stage === 2} color="#fbbf24" />
        <LinkLine x1={540} y1={92} x2={700} y2={92} active color="#34d399" />
        <LinkLine x1={122} y1={124} x2={122} y2={250} active color="#38bdf8" />
        <LinkLine x1={455} y1={124} x2={782} y2={250} active color="#34d399" />

        {stage === 2 && <Packet point={{ x: 450, y: 92 }} color="#fbbf24" label="R1↔R2" />}

        <Panel
          x={40}
          y={330}
          w={840}
          h={38}
          title={stage === 4 ? 'VERIFY + FAULT INJECTION' : stage === 3 ? 'LAN 2 CHECKPOINT' : stage === 2 ? 'ROUTER LINK CHECKPOINT' : stage === 1 ? 'LAN 1 CHECKPOINT' : 'TOPOLOGY CHECKPOINT'}
          lines={[
            stage === 4
              ? 'show ipv6 interface brief · show ipv6 neighbors · ping · change R1 G0/1 to /127 and restore /64.'
              : 'ipv6 unicast-routing · no shutdown · GUA + link-local on each router interface.',
          ]}
          color={stage === 4 ? '#fbbf24' : '#34d399'}
          active
        />
      </svg>
    </StepShell>
  )
}
