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

function wavePath(x: number, y: number, w: number, amp: number, cycles: number, points = 160) {
  return Array.from({ length: points + 1 }, (_, index) => {
    const t = index / points
    const px = x + t * w
    const py = y - Math.sin(t * cycles * Math.PI * 2) * amp
    return `${index === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`
  }).join(' ')
}

export function WirelessOverviewDiagram() {
  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-sky-400/12 bg-navy-950/70">
      <div className="border-b border-sky-400/10 px-4 py-3 font-display text-[0.78rem] font-bold text-slate-300" dir="ltr">
        WIRELESS SIGNAL PATH - SSID / RF / CLIENT
      </div>
      <div className="diagram-grid overflow-x-auto px-2 py-4" dir="ltr">
        <svg viewBox="0 0 900 300" className="h-auto w-full min-w-[860px]" role="img" aria-label="Wireless signal path from AP to client with SSID and RF">
          <Note x={450} y={28} text="SSID IS THE NETWORK NAME - RF CARRIES THE DATA" color="#94a3b8" size={11} />
          <Node x={55} y={110} w={150} h={70} label="AP" sub="SSID: CCNA-LAB" color="#38bdf8" tooltip="Access point" active />
          <Node x={345} y={110} w={170} h={70} label="RF / AIR" sub="2.4 / 5 / 6 GHz" color="#a78bfa" tooltip="Radio frequency medium" active />
          <Node x={680} y={110} w={160} h={70} label="CLIENT" sub="laptop / phone" color="#34d399" tooltip="Wireless client" active />
          <LinkLine x1={205} y1={145} x2={345} y2={145} color="#38bdf8" active />
          <LinkLine x1={515} y1={145} x2={680} y2={145} color="#34d399" active />
          <path d={wavePath(220, 145, 450, 22, 6)} fill="none" stroke="#38bdf8" strokeWidth="2.4" opacity="0.8" />
          <Packet point={{ x: 600, y: 145 }} color="#34d399" label="frames" />
          <Panel x={100} y={215} w={700} h={56} title="KEY IDEA" lines={['Wi-Fi uses radio frequency instead of a cable. The AP bridges wireless clients to the wired LAN.']} color="#34d399" active />
        </svg>
      </div>
      <div className="border-t border-sky-400/10 bg-sky-400/[0.03] px-4 py-3 text-[0.85rem] leading-[1.9] text-slate-300" dir="rtl">
        الـ AP بيبثّ <strong>SSID</strong> والعميل بيتصل عبر موجات <strong>RF</strong>. الـ SSID اسم الشبكة، مش تشفير.
      </div>
    </div>
  )
}

const waveStages = [
  'RF يعني Radio Frequency: موجة كهرومغناطيسية بتنتقل في الهواء من هوائي الـ AP لهوائي العميل.',
  'الـ amplitude هو ارتفاع الموجة. زيادة الـ amplitude يعني قدرة أعلى، لكن أجهزة Wi-Fi ملتزمة بحدود تنظيمية للقدرة.',
  'الـ wavelength هي المسافة بين قمتين متتاليتين. العلاقة: `λ = c / f`؛ زيادة التردد تعني طول موجة أقصر.',
  'الـ phase هو موضع النقطة داخل دورة الموجة. Wi-Fi بيستخدم تغيير الـ amplitude والـ phase في طرق التعديل لنقل البتات.',
  'المستقبل بيقيس القدرة اللي وصلت ويعبّر عنها بـ dBm. القيمة بتكون سالبة وزي ما تقرب من الصفر تكون أقوى.',
]

export function RfWaveVisualizationDiagram() {
  const playback = useStepPlayback(waveStages.length)
  const s = playback.stage
  return (
    <StepShell title="RF WAVE - AMPLITUDE, WAVELENGTH, PHASE" playback={playback} legend={waveStages[s]}>
      <svg viewBox="0 0 900 400" className="h-auto w-full min-w-[860px]" role="img" aria-label="RF sine wave showing amplitude wavelength and phase">
        <Note x={450} y={24} text="AP ANTENNA -> AIR -> CLIENT ANTENNA" color="#94a3b8" size={11} />
        <Node x={40} y={150} w={130} h={62} label="AP" sub="transmitter" color="#38bdf8" tooltip="Access point" active />
        <Node x={730} y={150} w={130} h={62} label="CLIENT" sub="receiver" color="#34d399" tooltip="Wireless client" active />
        <LinkLine x1={170} y1={181} x2={730} y2={181} color="#64748b" active />

        <path d={wavePath(190, 181, 520, s === 1 ? 62 : 42, s === 2 ? 6 : 4)} fill="none" stroke="#38bdf8" strokeWidth={s === 0 ? 3 : 2} opacity={s <= 2 ? 1 : 0.55} />
        <path d={wavePath(190, 181, 520, 42, 4)} fill="none" stroke="#a78bfa" strokeWidth={s === 3 ? 3 : 1} opacity={s === 3 ? 1 : 0.25} />

        {s === 1 && (
          <g>
            <line x1={240} y1={181} x2={240} y2={119} stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" />
            <SvgText x={252} y={150} color="#f59e0b" size={10} anchor="start" bold>AMPLITUDE</SvgText>
          </g>
        )}
        {s === 2 && (
          <g>
            <line x1={320} y1={139} x2={470} y2={139} stroke="#34d399" strokeWidth="2" />
            <SvgText x={395} y={130} color="#34d399" size={10} bold>WAVELENGTH λ</SvgText>
            <Note x={450} y={350} text="Higher frequency = shorter wavelength = usually more attenuation" color="#94a3b8" />
          </g>
        )}
        {s === 3 && (
          <g>
            <circle cx={190} cy={181} r={5} fill="#a78bfa" />
            <circle cx={315} cy={181} r={5} fill="#a78bfa" />
            <circle cx={440} cy={181} r={5} fill="#a78bfa" />
            <Note x={450} y={350} text="Different phase points can represent different symbols" color="#94a3b8" />
          </g>
        )}
        {s === 4 && <Packet point={{ x: 480, y: 181 }} color="#38bdf8" label="dBm" />}

        <Panel
          x={55}
          y={280}
          w={790}
          h={68}
          title={s === 0 ? 'RF BASICS' : s === 1 ? 'AMPLITUDE' : s === 2 ? 'WAVELENGTH' : s === 3 ? 'PHASE' : 'RECEIVED POWER'}
          lines={
            s === 0
              ? ['Radio frequency is part of the electromagnetic spectrum used by Wi-Fi.']
              : s === 1
                ? ['Amplitude = wave height. Higher amplitude means higher power, within regulatory limits.']
                : s === 2
                  ? ['λ = c / f. Lower frequency gives longer wavelength and usually better penetration.']
                  : s === 3
                    ? ['Phase = position inside one cycle. Wi-Fi modulation changes amplitude and phase to carry bits.']
                    : ['The receiver reports received power in dBm. Negative dBm values are normal.']
          }
          color={s === 1 ? '#f59e0b' : s === 2 ? '#34d399' : s === 3 ? '#a78bfa' : '#38bdf8'}
          active
        />
      </svg>
    </StepShell>
  )
}

const freqStages = [
  'التردد Frequency هو عدد الدورات في الثانية ووحدته Hz. طول الموجة Wavelength هو المسافة بين قمتين.',
  'في الهواء أو الفراغ السرعة ثابتة تقريباً، فالعلاقة `λ = c / f`. لو التردد زاد، طول الموجة بيقل.',
  'الموجة ذات التردد الأقل ليها طول موجة أطول؛ غالباً بتنتقل لمسافة أبعد وبتخترق عوائق أحسن.',
  'الموجة ذات التردد الأعلى ليها طول موجة أقصر؛ بتسمح بعرض قناة أكبر لكنها بتتأثر بالجدران والمسافة أكتر.',
  'في Wi-Fi بنقارن 2.4 GHz و5 GHz و6 GHz بنفس الفكرة: تردد أعلى يعني طول موجة أقصر ومساحة طيف أكبر.',
]

export function FrequencyWavelengthDiagram() {
  const playback = useStepPlayback(freqStages.length)
  const s = playback.stage
  return (
    <StepShell title="FREQUENCY vs WAVELENGTH" playback={playback} legend={freqStages[s]}>
      <svg viewBox="0 0 900 400" className="h-auto w-full min-w-[860px]" role="img" aria-label="Lower frequency longer wavelength compared with higher frequency shorter wavelength">
        <Note x={450} y={24} text="SAME SPEED - DIFFERENT FREQUENCY - DIFFERENT WAVELENGTH" color="#94a3b8" size={10.5} />
        <SvgText x={55} y={65} color="#38bdf8" size={11} anchor="start" bold>LOWER FREQUENCY</SvgText>
        <path d={wavePath(55, 130, 780, 45, 3)} fill="none" stroke="#38bdf8" strokeWidth={s <= 2 ? 3 : 1} opacity={s === 3 ? 0.35 : 1} />
        <line x1={120} y1={85} x2={380} y2={85} stroke="#38bdf8" strokeWidth="2" />
        <SvgText x={250} y={76} color="#38bdf8" size={10} bold>LONG λ</SvgText>
        <Note x={820} y={134} text="2.4 GHz" color="#38bdf8" />

        <SvgText x={55} y={215} color="#a78bfa" size={11} anchor="start" bold>HIGHER FREQUENCY</SvgText>
        <path d={wavePath(55, 270, 780, 45, 8)} fill="none" stroke="#a78bfa" strokeWidth={s >= 2 ? 3 : 1} opacity={s === 1 ? 0.35 : 1} />
        <line x1={120} y1={225} x2={235} y2={225} stroke="#a78bfa" strokeWidth="2" />
        <SvgText x={177} y={216} color="#a78bfa" size={10} bold>SHORT λ</SvgText>
        <Note x={820} y={274} text="5 / 6 GHz" color="#a78bfa" />

        <Panel
          x={55}
          y={315}
          w={790}
          h={62}
          title={s === 0 ? 'TWO MEASUREMENTS' : s === 1 ? 'THE FORMULA' : s === 2 ? 'LOWER f' : s === 3 ? 'HIGHER f' : 'WHY IT MATTERS'}
          lines={
            s === 0
              ? ['Frequency = cycles per second. Wavelength = distance between wave peaks.']
              : s === 1
                ? ['λ = c / f. In air, c is approximately the speed of light.']
                : s === 2
                  ? ['Longer wavelength generally means better range and better penetration.']
                  : s === 3
                    ? ['Shorter wavelength supports more spectrum but suffers more attenuation.']
                    : ['This is the physical reason 2.4 GHz travels farther than 5 or 6 GHz.']
          }
          color={s >= 3 ? '#a78bfa' : '#38bdf8'}
          active
        />
      </svg>
    </StepShell>
  )
}

type Band = { name: string; color: string; range: string; penetration: string; throughput: string; channels: string; use: string }

const bands: Band[] = [
  { name: '2.4 GHz', color: '#38bdf8', range: 'Longer', penetration: 'Better', throughput: 'Lower', channels: 'Fewer', use: 'IoT, long reach, crowded areas' },
  { name: '5 GHz', color: '#a78bfa', range: 'Medium', penetration: 'Moderate', throughput: 'Higher', channels: 'Many', use: 'Laptops, streaming, offices' },
  { name: '6 GHz', color: '#34d399', range: 'Shorter', penetration: 'Lower', throughput: 'Very high', channels: 'Very many', use: 'Wi-Fi 6E/7, clean spectrum' },
]

const bandStages = [
  'Wi-Fi بيشتغل في نطاقات تردد مختلفة. كل نطاق له مميزات وعيوب؛ مفيش نطاق „أحسن“ في كل الحالات.',
  '`2.4 GHz`: طول موجة أطول, مدى واختراق أحسن, لكن قنوات أقل وازدحام أعلى من Bluetooth والميكروويف والجيران.',
  '`5 GHz`: قنوات أكتر وقدرة أعلى على عرض القناة, لكن الجدران والمسافة بتأثر فيه أكتر.',
  '`6 GHz`: طيف واسع جداً وقنوات نظيفة غالباً, لكن المدى أقصر وبيحتاج أجهزة Wi-Fi 6E أو Wi-Fi 7 وتنظيم محلي يسمح به.',
  'القنوات المتاحة والقدرة المسموحة بتختلف حسب البلد. متعتمدش على قائمة قنوات كقاعدة عالمية.',
]

export function WirelessBandsCompareDiagram() {
  const playback = useStepPlayback(bandStages.length)
  const s = playback.stage
  return (
    <StepShell title="2.4 GHz vs 5 GHz vs 6 GHz" playback={playback} legend={bandStages[s]}>
      <svg viewBox="0 0 920 420" className="h-auto w-full min-w-[880px]" role="img" aria-label="Comparison of 2.4 GHz 5 GHz and 6 GHz wireless bands">
        <Note x={460} y={24} text="RANGE - PENETRATION - THROUGHPUT - CHANNEL AVAILABILITY" color="#94a3b8" size={10.5} />
        {bands.map((band, index) => {
          const x = 35 + index * 295
          const active = s === 0 || s === index + 1
          return (
            <g key={band.name} opacity={active ? 1 : 0.35}>
              <rect x={x} y={55} width={270} height={255} rx="14" fill="#0b1224" stroke={band.color} strokeWidth={active ? 2.5 : 1.2} />
              <SvgText x={x + 135} y={88} color={band.color} size={14} bold>{band.name}</SvgText>
              <SvgText x={x + 135} y={118} color="#e2e8f0" size={10} bold>{`Range: ${band.range}`}</SvgText>
              <SvgText x={x + 135} y={143} color="#cbd5e1" size={9}>{`Penetration: ${band.penetration}`}</SvgText>
              <SvgText x={x + 135} y={168} color="#cbd5e1" size={9}>{`Throughput: ${band.throughput}`}</SvgText>
              <SvgText x={x + 135} y={193} color="#cbd5e1" size={9}>{`Channels: ${band.channels}`}</SvgText>
              <SvgText x={x + 135} y={225} color="#cbd5e1" size={8.5}>{`Use: ${band.use.split(',')[0]}`}</SvgText>
              <SvgText x={x + 135} y={242} color="#cbd5e1" size={8.5}>{band.use.split(',').slice(1).join(',')}</SvgText>
              <rect x={x + 35} y={270} width={200} height={10} rx="5" fill="#1e293b" />
              <rect x={x + 35} y={270} width={index === 0 ? 200 : index === 1 ? 140 : 90} height={10} rx="5" fill={band.color} opacity="0.75" />
              <Note x={x + 135} y={296} text={index === 0 ? 'BEST RANGE' : index === 1 ? 'BALANCED' : 'MOST SPECTRUM'} color={band.color} size={9} />
            </g>
          )
        })}
        <Panel
          x={35}
          y={330}
          w={850}
          h={66}
          title="REAL-WORLD CHOICE"
          lines={
            s === 4
              ? ['Availability and rules vary by country; always check the local regulatory domain.']
              : ['Use 2.4 GHz for reach, 5 GHz for capacity, and 6 GHz for clean wide channels where supported.']
          }
          color="#f59e0b"
          active
        />
      </svg>
    </StepShell>
  )
}

const allocationStages = [
  'الـ Wi-Fi channel هو نطاق ترددي محدد داخل النطاق. في 2.4 GHz القنوات مرتبة على بُعد 5 MHz من بعضها.',
  'لو عرض القناة 20 MHz والمراكز بينها 5 MHz، فالقنوات المتجاورة بتتداخل. ده اسمه channel overlap.',
  'مثال شائع في مناطق كتير: القنوات `1` و`6` و`11` لا تتداخل عند عرض 20 MHz. ده مثال مش قاعدة تنظيمية عالمية.',
  'لو استخدمنا `1` و`3` مثلاً، النطاقات متداخلة والـ APs يسببوا adjacent-channel interference.',
  'في 5 GHz و6 GHz القنوات أكتر وخطة التردد مختلفة. لازم تراجع القنوات المسموحة في البلد وفي الجهاز.',
]

export function WifiChannelAllocationDiagram() {
  const playback = useStepPlayback(allocationStages.length)
  const s = playback.stage
  const channels = Array.from({ length: 11 }, (_, i) => i + 1)
  const highlight = s === 2 ? [1, 6, 11] : s === 3 ? [1, 3] : []
  return (
    <StepShell title="2.4 GHz CHANNEL ALLOCATION" playback={playback} legend={allocationStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="2.4 GHz channel allocation and overlap example">
        <Note x={460} y={24} text="CENTERS 5 MHz APART - 20 MHz CHANNEL EXAMPLE" color="#94a3b8" size={10.5} />
        <line x1={60} y1={180} x2={860} y2={180} stroke="#334155" strokeWidth="2" />
        {channels.map((ch, index) => {
          const x = 60 + index * 74
          const active = highlight.includes(ch)
          const color = active ? (s === 3 ? '#fb7185' : '#34d399') : '#38bdf8'
          return (
            <g key={ch} opacity={active ? 1 : 0.55}>
              <rect x={x} y={150} width={66} height={60} rx="8" fill="#0b1224" stroke={color} strokeWidth={active ? 2.4 : 1} />
              <SvgText x={x + 33} y={185} color={color} size={12} bold>{String(ch)}</SvgText>
              <line x1={x + 33} y1={210} x2={x + 33} y2={222} stroke={color} strokeWidth="2" />
            </g>
          )
        })}
        {s >= 1 && (
          <g>
            <rect x={60} y={248} width={180} height={16} rx="6" fill="#38bdf8" opacity="0.4" />
            <rect x={134} y={272} width={180} height={16} rx="6" fill="#a78bfa" opacity="0.4" />
            <Note x={430} y={260} text="20 MHz blocks overlap when centers are only 5 MHz apart" color="#94a3b8" size={10} />
          </g>
        )}
        <Panel
          x={60}
          y={305}
          w={800}
          h={68}
          title={s === 2 ? 'COMMON EXAMPLE' : s === 3 ? 'OVERLAP PROBLEM' : 'CHANNEL PLAN'}
          lines={
            s === 2
              ? ['1 / 6 / 11 are commonly used as non-overlapping 20 MHz channels where available.']
              : s === 3
                ? ['1 and 3 overlap; frames collide, corrupt, and must be retransmitted.']
                : ['A channel is a frequency range, not just a number in the AP settings.']
          }
          color={s === 3 ? '#fb7185' : '#34d399'}
          active
        />
      </svg>
    </StepShell>
  )
}

const widthStages = [
  'Channel width يعني قد إيه طيف بنستخدمه في القناة الواحدة. العرض الأكبر يسمح ببتات أكتر في نفس الوقت.',
  '`20 MHz` هو الأساس في 2.4 GHz وخيار شائع في المناطق المزدحمة لأنه بيقلل التداخل.',
  '`40 / 80 / 160 MHz` بيتم تجهيزها كـ channel bonding: قناة أساسية + قنوات إضافية.',
  'العرض الأكبر يعني potential throughput أعلى، بس قنوات غير متداخلة أقل وnoise floor أعلى شوية و حساسية للتداخل.',
  'القاعدة العملية: في بيئة كثيفة، 20 أو 40 MHz غالباً أثبت من 80 أو 160 MHz. مش قاعدة مطلقة؛ اختبر وقيّس.',
]

export function ChannelWidthCompareDiagram() {
  const playback = useStepPlayback(widthStages.length)
  const s = playback.stage
  const widths = [
    { label: '20 MHz', w: 150, color: '#38bdf8', note: 'base / dense areas' },
    { label: '40 MHz', w: 280, color: '#a78bfa', note: '2 x 20' },
    { label: '80 MHz', w: 470, color: '#f59e0b', note: '4 x 20' },
    { label: '160 MHz', w: 700, color: '#34d399', note: '8 x 20' },
  ]
  const activeIndex = s === 0 ? -1 : s - 1
  return (
    <StepShell title="CHANNEL WIDTH - 20 / 40 / 80 / 160 MHz" playback={playback} legend={widthStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Comparison of 20 40 80 and 160 MHz Wi-Fi channel widths">
        <Note x={460} y={24} text="WIDER CHANNEL = MORE SPECTRUM = HIGHER POTENTIAL THROUGHPUT" color="#94a3b8" size={10.5} />
        {widths.map((item, index) => {
          const y = 60 + index * 65
          const active = activeIndex === index || s === 0
          return (
            <g key={item.label} opacity={active ? 1 : 0.35}>
              <SvgText x={55} y={y + 20} color={item.color} size={11} anchor="start" bold>{item.label}</SvgText>
              <rect x={180} y={y} width={item.w} height={28} rx="8" fill={item.color} opacity={active ? 0.35 : 0.12} stroke={item.color} strokeWidth={active ? 2 : 1} />
              <SvgText x={180 + item.w / 2} y={y + 19} color={item.color} size={9} bold>{item.note}</SvgText>
            </g>
          )
        })}
        <Panel
          x={55}
          y={320}
          w={810}
          h={58}
          title="TRADE-OFF"
          lines={['Wider = faster in clean spectrum, but fewer non-overlapping channels and more interference exposure.']}
          color="#f59e0b"
          active
        />
        <Note x={460} y={394} text="availability depends on band, client support, and local regulations" color="#94a3b8" />
      </svg>
    </StepShell>
  )
}

const interferenceStages = [
  'Co-channel interference: أكتر من AP على نفس القناة. الـ Wi-Fi بيستخدم CSMA/CA فبيتحكم في الوصول، بس الـ airtime يتقسم والسرعة تقل.',
  'Adjacent-channel interference: قنوات متداخلة زي 1 و3. هنا الإشارات بتفسد بعضها والـ retransmissions بتزيد.',
  'Co-channel غالباً „بطء وازدحام“؛ adjacent غالباً „تلف وإعادة إرسال“. الاتنين بيقللوا الأداء.',
  'Non-Wi-Fi interference زي Bluetooth والميكروويف والهواتف اللاسلكية والرادار بيأثر على نفس الترددات.',
  'الحل يبدأ بتخطيط القنوات، تقليل عرض القناة لو لازم، تحريك الـ AP، واختيار النطاق المناسب.',
]

export function CochannelAdjacentInterferenceDiagram() {
  const playback = useStepPlayback(interferenceStages.length)
  const s = playback.stage
  return (
    <StepShell title="CO-CHANNEL vs ADJACENT-CHANNEL INTERFERENCE" playback={playback} legend={interferenceStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Co-channel and adjacent-channel interference comparison">
        <Note x={460} y={24} text="SAME CHANNEL SHARES AIRTIME - OVERLAPPING CHANNELS CORRUPT FRAMES" color="#94a3b8" size={10} />
        <g opacity={s <= 2 ? 1 : 0.4}>
          <Panel x={45} y={60} w={390} h={180} title="CO-CHANNEL" lines={['AP1 channel 6', 'AP2 channel 6', 'Both wait and take turns', 'Result: lower throughput']} color="#38bdf8" active={s <= 2} />
          <Node x={85} y={130} w={90} h={46} label="AP1" sub="ch 6" color="#38bdf8" tooltip="AP one" active={s <= 2} />
          <Node x={300} y={130} w={90} h={46} label="AP2" sub="ch 6" color="#38bdf8" tooltip="AP two" active={s <= 2} />
          <LinkLine x1={175} y1={153} x2={300} y2={153} color="#38bdf8" active={s <= 2} dashed />
        </g>
        <g opacity={s === 1 || s === 2 ? 1 : 0.4}>
          <Panel x={485} y={60} w={390} h={180} title="ADJACENT-CHANNEL" lines={['AP3 channel 1', 'AP4 channel 3', '20 MHz signals overlap', 'Result: corruption + retries']} color="#fb7185" active={s === 1 || s === 2} />
          <Node x={525} y={130} w={90} h={46} label="AP3" sub="ch 1" color="#34d399" tooltip="AP three" active={s === 1 || s === 2} />
          <Node x={740} y={130} w={90} h={46} label="AP4" sub="ch 3" color="#fb7185" tooltip="AP four" active={s === 1 || s === 2} />
          <LinkLine x1={615} y1={153} x2={740} y2={153} color="#fb7185" active={s === 1 || s === 2} />
        </g>
        <Panel
          x={45}
          y={270}
          w={830}
          h={90}
          title={s === 3 ? 'NON-WI-FI SOURCES' : s === 4 ? 'PRACTICAL FIX' : 'KEY DIFFERENCE'}
          lines={
            s === 3
              ? ['Bluetooth, microwave ovens, cordless phones, sensors, and radar can occupy the same frequencies.']
              : s === 4
                ? ['Plan channels, reduce width if needed, move APs, and prefer cleaner bands where possible.']
                : ['Co-channel = shared airtime. Adjacent = damaged frames and retransmissions.']
          }
          color={s === 3 ? '#f59e0b' : s === 4 ? '#34d399' : '#a78bfa'}
          active
        />
      </svg>
    </StepShell>
  )
}

const attenuationStages = [
  'الإشارة بتفقد قدرتها كل ما زادت المسافة بين الـ AP والعميل. ده اسمه attenuation أو path loss.',
  'المواد الخفيفة زي drywall بتقلل الإشارة شوية. الخشب والزجاج والجدران الداخلية ليها تأثير متوسط.',
  'الخرسانة والطوب والمعدن والمرايا والخزانات المياه بتسبب فقدان أكبر. القيم هنا توضيحية مش وعود ثابتة.',
  'كل حاجز بيضيف loss؛ التراكم ده بيخلّي الـ RSSI يقل والـ SNR يتأثر.',
  'الحل: قرّب الـ AP، غيّر مكانه، قلّل العوائق، أو استخدم نطاقاً ومنطقة تغطية مناسبة.',
]

export function SignalAttenuationWallsDiagram() {
  const playback = useStepPlayback(attenuationStages.length)
  const s = playback.stage
  const walls = [
    { x: 330, label: 'DRYWALL', loss: 'small loss' },
    { x: 500, label: 'BRICK', loss: 'medium loss' },
    { x: 670, label: 'METAL', loss: 'high loss' },
  ]
  return (
    <StepShell title="SIGNAL ATTENUATION THROUGH OBSTACLES" playback={playback} legend={attenuationStages[s]}>
      <svg viewBox="0 0 900 400" className="h-auto w-full min-w-[860px]" role="img" aria-label="Wireless signal attenuation through walls and distance">
        <Note x={450} y={24} text="ILLUSTRATIVE LOSS VALUES ONLY - REAL LOSS DEPENDS ON MATERIALS AND INSTALLATION" color="#94a3b8" size={9.5} />
        <Node x={45} y={155} w={120} h={60} label="AP" sub="tx power" color="#38bdf8" tooltip="Access point" active />
        <Node x={755} y={155} w={110} h={60} label="CLIENT" sub="rx power" color="#34d399" tooltip="Client" active />
        {walls.map((wall, index) => (
          <g key={wall.label} opacity={s >= 1 ? 1 : 0.35}>
            <rect x={wall.x} y={110} width={40} height={150} rx="6" fill="#0b1224" stroke={index === 2 ? '#fb7185' : index === 1 ? '#f59e0b' : '#64748b'} strokeWidth={s === index + 1 ? 2.5 : 1.2} />
            <SvgText x={wall.x + 20} y={285} color={index === 2 ? '#fb7185' : index === 1 ? '#f59e0b' : '#94a3b8'} size={9} bold>{wall.label}</SvgText>
            <Note x={wall.x + 20} y={302} text={wall.loss} color="#94a3b8" size={8.5} />
          </g>
        ))}
        <LinkLine x1={165} y1={185} x2={755} y2={185} color="#38bdf8" active={s === 0} />
        <LinkLine x1={165} y1={185} x2={330} y2={185} color="#38bdf8" active={s >= 1} />
        <LinkLine x1={370} y1={185} x2={500} y2={185} color="#f59e0b" active={s >= 2} />
        <LinkLine x1={540} y1={185} x2={755} y2={185} color={s >= 3 ? '#fb7185' : '#64748b'} active={s >= 3} />
        {(s === 1 || s === 4) && <Packet point={{ x: 245, y: 185 }} color="#38bdf8" label="strong" />}
        {s >= 3 && <Packet point={{ x: 610, y: 185 }} color="#fb7185" label="weak" />}
        <Panel
          x={55}
          y={325}
          w={790}
          h={55}
          title={s === 4 ? 'FIX THE PATH' : 'CUMULATIVE LOSS'}
          lines={[s === 4 ? 'Move the AP, reduce barriers, or add a properly planned AP rather than only raising power.' : 'Distance and each material reduce received power. Less power means lower RSSI and smaller SNR margin.']}
          color={s >= 3 ? '#fb7185' : '#38bdf8'}
          active
        />
      </svg>
    </StepShell>
  )
}

const propagationStages = [
  'الإشارة ما بتمشيش دايماً في خط واحد مباشر. البيئة حوالين الـ AP بتغيّر المسار والقدرة اللي توصل.',
  'Reflection: الموجة ترتد من سطح أملس زي جدار أو معدن. ممكن ينتج multipath: نسخ كتير توصل في أوقات مختلفة.',
  'Refraction: الموجة تنحرف لما تمر بين مادتين مختلفتين بكثافة مختلفة، زي الهواء والزجاج.',
  'Diffraction: الموجة تنحني حوالين حافة أو عائق. ده بيسمح بوصول محدود لمناطق مخفية خلف العائق.',
  'Absorption: جزء من طاقة الموجة يتحول لحرارة داخل المادة. الجدران والجسم البشري والمياه من أمثلة الامتصاص.',
]

export function WavePropagationEffectsDiagram() {
  const playback = useStepPlayback(propagationStages.length)
  const s = playback.stage
  return (
    <StepShell title="REFLECTION, REFRACTION, DIFFRACTION, ABSORPTION" playback={playback} legend={propagationStages[s]}>
      <svg viewBox="0 0 920 410" className="h-auto w-full min-w-[880px]" role="img" aria-label="Radio wave propagation effects reflection refraction diffraction and absorption">
        <Note x={460} y={24} text="THE ENVIRONMENT SHAPES THE RF SIGNAL" color="#94a3b8" size={11} />
        <Panel x={40} y={60} w={190} h={105} title="REFLECTION" lines={['Bounces from smooth', 'surfaces / metal', 'Can cause multipath']} color="#38bdf8" active={s === 1 || s === 0} size={8.5} />
        <Panel x={255} y={60} w={190} h={105} title="REFRACTION" lines={['Bends when passing', 'between materials', 'e.g. air to glass']} color="#a78bfa" active={s === 2 || s === 0} size={8.5} />
        <Panel x={470} y={60} w={190} h={105} title="DIFFRACTION" lines={['Bends around edges', 'Limited coverage behind', 'an obstacle']} color="#f59e0b" active={s === 3 || s === 0} size={8.5} />
        <Panel x={685} y={60} w={190} h={105} title="ABSORPTION" lines={['Energy lost as heat', 'Walls, people, water', 'Lowers RSSI']} color="#fb7185" active={s === 4 || s === 0} size={8.5} />
        <g opacity={s === 1 || s === 0 ? 1 : 0.3}>
          <Node x={75} y={220} w={100} h={48} label="TX" sub="signal" color="#38bdf8" tooltip="Transmitter" active />
          <rect x={250} y={205} width={18} height={90} rx="4" fill="#64748b" />
          <LinkLine x1={175} y1={244} x2={250} y2={244} color="#38bdf8" active />
          <LinkLine x1={268} y1={244} x2={380} y2={190} color="#38bdf8" active />
          <Note x={310} y={325} text="reflected path" color="#38bdf8" size={9} />
        </g>
        <g opacity={s === 2 || s === 0 ? 1 : 0.3}>
          <Node x={300} y={220} w={90} h={48} label="TX" sub="signal" color="#a78bfa" tooltip="Transmitter" active />
          <rect x={465} y={205} width={18} height={90} rx="4" fill="#a78bfa" opacity="0.5" />
          <LinkLine x1={390} y1={244} x2={465} y2={244} color="#a78bfa" active />
          <LinkLine x1={483} y1={244} x2={560} y2={270} color="#a78bfa" active />
        </g>
        <g opacity={s === 3 || s === 0 ? 1 : 0.3}>
          <Node x={545} y={220} w={90} h={48} label="TX" sub="signal" color="#f59e0b" tooltip="Transmitter" active />
          <rect x={700} y={205} width={18} height={90} rx="4" fill="#f59e0b" opacity="0.5" />
          <LinkLine x1={635} y1={244} x2={700} y2={244} color="#f59e0b" active />
          <path d="M 718 244 Q 745 250 780 282" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
        </g>
        <Panel
          x={40}
          y={350}
          w={835}
          h={42}
          title="EXAM LINK"
          lines={['Reflection / refraction / diffraction / absorption can all reduce or change the signal that reaches the client.']}
          color="#34d399"
          active
        />
      </svg>
    </StepShell>
  )
}

const rssiStages = [
  'RSSI بتقول „قد إيه القدرة وصلت للعميل؟“ وتقاس بـ dBm. القيم بتكون سالبة زي `-67 dBm`.',
  'القيم الأقرب للصفر أقوى: `-30 dBm` أقوى من `-70 dBm`، و`-70 dBm` أقوى من `-90 dBm`.',
  'الـ noise floor هو مستوى الضوضاء الخلفية في نفس البيئة. قيمة أكتر سالبة يعني هدوء أكتر.',
  'الفرق بين الـ signal والـ noise هو SNR. لو الـ noise قريب من الـ signal، الاتصال هيبقى مش مستقر.',
  'مفيش رقم RSSI واحد يضمن أداء في كل مكان. الـ hardware والبيئة وعدد المستخدمين كلهم بيأثروا.',
]

export function RssiNoiseFloorDiagram() {
  const playback = useStepPlayback(rssiStages.length)
  const s = playback.stage
  const marks = [
    { y: 70, label: '-30', strong: true },
    { y: 120, label: '-50', strong: true },
    { y: 170, label: '-70', strong: false },
    { y: 220, label: '-90', strong: false },
  ]
  return (
    <StepShell title="RSSI AND NOISE FLOOR IN dBm" playback={playback} legend={rssiStages[s]}>
      <svg viewBox="0 0 900 400" className="h-auto w-full min-w-[860px]" role="img" aria-label="RSSI received signal strength and noise floor shown on a dBm scale">
        <Note x={450} y={24} text="NEGATIVE dBm - CLOSER TO ZERO IS STRONGER" color="#94a3b8" size={11} />
        <line x1={130} y1={60} x2={130} y2={250} stroke="#334155" strokeWidth="2" />
        {marks.map((m) => (
          <g key={m.label}>
            <line x1={125} y1={m.y} x2={135} y2={m.y} stroke="#64748b" strokeWidth="2" />
            <SvgText x={112} y={m.y + 4} color={m.strong ? '#34d399' : '#94a3b8'} size={9}>{m.label}</SvgText>
          </g>
        ))}
        <rect x={160} y={s === 2 ? 205 : 118} width={380} height={22} rx="7" fill="#38bdf8" opacity="0.25" stroke="#38bdf8" strokeWidth={s === 1 || s === 3 ? 2.5 : 1} />
        <SvgText x={350} y={s === 2 ? 200 : 112} color="#38bdf8" size={10} bold>{`RSSI ${s === 2 ? '-80 dBm' : '-55 dBm'}`}</SvgText>
        <line x1={160} y1={245} x2={700} y2={245} stroke="#fb7185" strokeWidth={s >= 2 ? 2.5 : 1} strokeDasharray="6 6" />
        <SvgText x={720} y={249} color="#fb7185" size={9} anchor="start">{`NOISE FLOOR ${s === 2 ? '-82' : '-95'} dBm`}</SvgText>
        {s === 3 && <Packet point={{ x: 560, y: 180 }} color="#a78bfa" label="SNR gap" />}
        <Panel
          x={55}
          y={295}
          w={790}
          h={80}
          title={s === 0 ? 'WHAT RSSI MEANS' : s === 1 ? 'READING THE SIGN' : s === 2 ? 'NOISE MATTERS' : s === 3 ? 'SNR' : 'NO UNIVERSAL GUARANTEE'}
          lines={
            s === 0
              ? ['RSSI is the received signal strength indication, reported in dBm by most Wi-Fi clients.']
              : s === 1
                ? ['-30 is very strong, -70 is often workable, -90 is weak. These are examples, not guarantees.']
                : s === 2
                  ? ['Noise floor is background RF energy. A noisy environment reduces the useful margin.']
                  : s === 3
                    ? ['SNR = signal power - noise power. Larger positive margin is generally better.']
                    : ['Device hardware, airtime usage, retries, and interference also decide the real user experience.']
          }
          color={s >= 2 ? '#a78bfa' : '#38bdf8'}
          active
        />
      </svg>
    </StepShell>
  )
}

const snrStages = [
  'SNR يعني Signal-to-Noise Ratio: نسبة إشارة إلى ضوضاء، وبتقاس بـ dB.',
  'الحساب بسيط: `SNR = RSSI - Noise Floor` لما الاتنين بـ dBm.',
  'مثال A: RSSI `-67 dBm` والـ noise `-95 dBm`؛ الفرق `28 dB`. ده غالباً هامش مريح.',
  'مثال B: RSSI `-80 dBm` والـ noise `-82 dBm`؛ الفرق `2 dB` بس. الإشارة „موجودة“ بس الضوضاء قريبة جداً.',
  'حتى مع SNR كويس، الـ airtime والـ retransmissions والـ backhaul ممكن يخلّوا الاتصال بطيئاً.',
]

export function SnrCompareDiagram() {
  const playback = useStepPlayback(snrStages.length)
  const s = playback.stage
  return (
    <StepShell title="SNR COMPARISON" playback={playback} legend={snrStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Two SNR scenarios comparing signal and noise floor">
        <Note x={460} y={24} text="SNR = SIGNAL dBm - NOISE dBm" color="#94a3b8" size={11} />
        <g opacity={s <= 2 ? 1 : 0.4}>
          <Panel x={45} y={60} w={390} h={210} title="SCENARIO A - CLEAN" lines={['RSSI: -67 dBm', 'Noise: -95 dBm', 'SNR: 28 dB', 'Likely stable link']} color="#34d399" active={s <= 2} />
          <rect x={100} y={155} width={250} height={14} rx="6" fill="#34d399" opacity="0.5" />
          <line x1={100} y1={220} x2={350} y2={220} stroke="#fb7185" strokeWidth="2" strokeDasharray="5 5" />
          <SvgText x={225} y={248} color="#34d399" size={9} bold>bigger gap = better margin</SvgText>
        </g>
        <g opacity={s >= 3 ? 1 : 0.4}>
          <Panel x={485} y={60} w={390} h={210} title="SCENARIO B - NOISY" lines={['RSSI: -80 dBm', 'Noise: -82 dBm', 'SNR: 2 dB', 'Unstable / slow link']} color="#fb7185" active={s >= 3} />
          <rect x={540} y={190} width={250} height={14} rx="6" fill="#fb7185" opacity="0.5" />
          <line x1={540} y1={220} x2={790} y2={220} stroke="#fb7185" strokeWidth="2" strokeDasharray="5 5" />
          <SvgText x={665} y={248} color="#fb7185" size={9} bold>small gap = poor margin</SvgText>
        </g>
        <Panel
          x={45}
          y={295}
          w={830}
          h={75}
          title="IMPORTANT NUANCE"
          lines={[s === 4 ? 'Strong signal and good SNR still do not prove low channel utilization or fast backhaul.' : 'A strong RSSI alone is not enough. Always look at the noise floor and the SNR gap.']}
          color="#a78bfa"
          active
        />
      </svg>
    </StepShell>
  )
}

const securityStages = [
  'تطور أمن Wi-Fi بدأ بـ WEP الضعيف، وبعدين WPA وWPA2 وWPA3. كل جيل عالج مشاكل اللي قبله.',
  'WEP: قديم جداً، بيستخدم RC4 وضعف في الـ IV. مفيش سبب تستخدمه في شبكة حقيقية.',
  'WPA: كان حلاً انتقالياً بـ TKIP. أفضل من WEP لكنه deprecated كمان.',
  'WPA2: بيستخدم AES-CCMP وهو لسه شائع. WPA3 بيضيف SAE في Personal وخصائص أقوى في Enterprise.',
  'PSK يعني كل العملاء يشاركوا نفس الـ passphrase. Enterprise يعني 802.1X + RADIUS وحساب أو شهادة لكل مستخدم.',
]

export function WirelessSecurityEvolutionDiagram() {
  const playback = useStepPlayback(securityStages.length)
  const s = playback.stage
  const gens = [
    { label: 'WEP', sub: 'RC4 / weak', color: '#fb7185', note: 'deprecated' },
    { label: 'WPA', sub: 'TKIP', color: '#f59e0b', note: 'transitional' },
    { label: 'WPA2', sub: 'AES-CCMP', color: '#38bdf8', note: 'common' },
    { label: 'WPA3', sub: 'SAE / PMF', color: '#34d399', note: 'modern' },
  ]
  return (
    <StepShell title="WIRELESS SECURITY EVOLUTION" playback={playback} legend={securityStages[s]}>
      <svg viewBox="0 0 920 400" className="h-auto w-full min-w-[880px]" role="img" aria-label="Evolution of Wi-Fi security from WEP to WPA3 with PSK and Enterprise">
        <Note x={460} y={24} text="WEP -> WPA -> WPA2 -> WPA3" color="#94a3b8" size={11} />
        {gens.map((g, index) => {
          const x = 45 + index * 220
          const active = s === 0 || s === index + 1
          return (
            <g key={g.label} opacity={active ? 1 : 0.35}>
              <rect x={x} y={60} width={190} height={120} rx="12" fill="#0b1224" stroke={g.color} strokeWidth={active ? 2.5 : 1.2} />
              <SvgText x={x + 95} y={98} color={g.color} size={14} bold>{g.label}</SvgText>
              <SvgText x={x + 95} y={126} color="#cbd5e1" size={9}>{g.sub}</SvgText>
              <SvgText x={x + 95} y={150} color="#cbd5e1" size={9}>{g.note}</SvgText>
              {index < gens.length - 1 && <Note x={x + 205} y={125} text="→" color="#64748b" size={18} />}
            </g>
          )
        })}
        <Panel x={45} y={210} w={390} h={110} title="PSK / PERSONAL" lines={['Shared passphrase on AP and clients', 'Simple for home or small office', 'One passphrase shared by everyone']} color="#f59e0b" active={s === 5 || s === 0} />
        <Panel x={485} y={210} w={390} h={110} title="ENTERPRISE / 802.1X" lines={['RADIUS server + individual credentials', 'Certificates often used', 'Better control per user / device']} color="#34d399" active={s === 5 || s === 0} />
        <Note x={460} y={360} text="SSID is a network name, not encryption. Hidden SSID is not security." color="#94a3b8" size={10} />
      </svg>
    </StepShell>
  )
}

const labTopologyStages = [
  'التوبولوجيا: AP1 وAP2 متصلين بـ switch، وعميل لاب توب وعميل موبايل، مع مصدر تداخل وحاجز.',
  'في Lab 1 بنقارن نطاق `2.4 GHz` بنطاق `5 GHz` من حيث القوة والسرعة والمسافة.',
  'في Lab 2 بنغيّر القناة: مثال `1` و`11` مقابل قنوات متداخلة في منطقة تتوفر فيها 1 و6 و11.',
  'بنحرّك العميل أو بنضيف حاجز عشان نشوف أثر الـ attenuation على RSSI وSNR.',
  'بنغيّر حاجة واحدة بس في كل مرة، وبنسجّل النتيجة. كده نعرف السبب الحقيقي مش التخمين.',
]

export function WirelessLabTopologyDiagram() {
  const playback = useStepPlayback(labTopologyStages.length)
  const s = playback.stage
  return (
    <StepShell title="PRACTICAL WIRELESS LAB TOPOLOGY" playback={playback} legend={labTopologyStages[s]}>
      <svg viewBox="0 0 900 400" className="h-auto w-full min-w-[860px]" role="img" aria-label="Practical wireless lab with two access points switch clients and interference source">
        <Note x={450} y={24} text="AP1 + AP2 + SWITCH + CLIENTS + INTERFERENCE SOURCE" color="#94a3b8" size={10.5} />
        <Node x={70} y={235} w={150} h={64} label="AP1" sub="2.4 / 5 GHz" color="#38bdf8" tooltip="Access point one" active={s <= 2} />
        <Node x={70} y={95} w={150} h={64} label="AP2" sub="5 / 6 GHz" color="#a78bfa" tooltip="Access point two" active={s <= 2} />
        <Node x={350} y={165} w={150} h={64} label="SW1" sub="wired LAN" color="#64748b" tooltip="Switch" active />
        <Node x={650} y={95} w={150} h={64} label="LAPTOP" sub="Wi-Fi client" color="#34d399" tooltip="Laptop client" active={s === 1} />
        <Node x={650} y={235} w={150} h={64} label="PHONE" sub="Wi-Fi client" color="#f59e0b" tooltip="Phone client" active={s === 1 || s === 3} />
        <Node x={425} y={310} w={150} h={56} label="NOISE" sub="microwave / BT" color="#fb7185" tooltip="Interference source" active={s === 3} />
        <LinkLine x1={220} y1={267} x2={350} y2={197} color="#38bdf8" active={s <= 2} />
        <LinkLine x1={220} y1={127} x2={350} y2={197} color="#a78bfa" active={s <= 2} />
        <LinkLine x1={500} y1={197} x2={650} y2={127} color="#34d399" active={s === 1 || s === 3} />
        <LinkLine x1={500} y1={197} x2={650} y2={267} color="#f59e0b" active={s === 1 || s === 3} />
        <LinkLine x1={500} y1={229} x2={500} y2={310} color="#fb7185" active={s === 3} dashed />
        {(s === 1 || s === 3) && <Packet point={{ x: 575, y: 160 }} color="#34d399" label="RSSI" />}
        <Panel
          x={40}
          y={355}
          w={820}
          h={34}
          title="RULE"
          lines={['Change one variable at a time, then compare RSSI, SNR, channel, and observed speed.']}
          color="#34d399"
          active
        />
      </svg>
    </StepShell>
  )
}

const wirelessFlowStages = [
  'التشخيص المنظّم بيبدأ بتحديد نطاق المشكلة: جهاز واحد ولا كل الأجهزة؟ قريب من الـ AP ولا بعيد؟',
  '1-3: تأكد من SSID الصح والنطاق وطريقة المصادقة، وبعدين من عنوان IP والاتصال الأساسي.',
  '4-7: قيس RSSI وSNR، حدّد القناة والنطاق، وافحص هل فيه co-channel أو adjacent-channel interference.',
  '8-10: جرّب non-Wi-Fi sources والعوائق، وجرّب جهاز تاني أو نطاق تاني قبل ما تغيّر إعداد.',
  '11-12: غيّر حاجة واحدة فقط وأعد القياس، وسجّل النتيجة. لو احتجت أوامر، ابدأ بـ IOS general commands.',
  'الأوامر العامة زي `show interfaces` و`show ip interface brief` و`show running-config` مش أوامر RF متخصصة؛ أوامر الـ controller بها vary حسب المنصة.',
]

export function WirelessTroubleshootingFlowDiagram() {
  const playback = useStepPlayback(wirelessFlowStages.length)
  const s = playback.stage
  const tests = [
    '1 Define scope', '2 Confirm SSID', '3 Check IP link', '4 Measure RSSI',
    '5 Measure SNR', '6 Identify band', '7 Identify channel', '8 Check channel use',
    '9 Find non-Wi-Fi', '10 Check obstacles', '11 Change one thing', '12 Record result',
  ]
  const group = (i: number) => (i < 4 ? 0 : i < 8 ? 1 : 2)
  const color = (g: number) => (g === 0 ? '#38bdf8' : g === 1 ? '#a78bfa' : '#34d399')
  const activeGroup = s <= 1 ? 0 : s === 2 ? 1 : s <= 4 ? 2 : 3
  return (
    <StepShell title="WIRELESS TROUBLESHOOTING WORKFLOW" playback={playback} legend={wirelessFlowStages[s]}>
      <svg viewBox="0 0 920 410" className="h-auto w-full min-w-[880px]" role="img" aria-label="Twelve step wireless troubleshooting workflow">
        <Note x={460} y={24} text="SCOPE -> ASSOCIATION -> RF QUALITY -> INTERFERENCE -> CONTROLLED CHANGE" color="#94a3b8" size={10} />
        {tests.map((test, index) => {
          const col = index % 4
          const row = Math.floor(index / 4)
          const x = 35 + col * 220
          const y = 60 + row * 82
          const g = group(index)
          const active = s === 0 || g === activeGroup
          return (
            <g key={test} opacity={active ? 1 : 0.35}>
              <rect x={x} y={y} width={195} height={58} rx="10" fill="#0b1224" stroke={color(g)} strokeWidth={active ? 2.4 : 1.1} />
              <SvgText x={x + 97} y={y + 25} color={color(g)} size={10} bold>{test.split(' ')[0]}</SvgText>
              <SvgText x={x + 97} y={y + 43} color="#cbd5e1" size={8.5}>{test.slice(test.indexOf(' ') + 1)}</SvgText>
            </g>
          )
        })}
        <Panel
          x={35}
          y={310}
          w={850}
          h={72}
          title={s === 5 ? 'IOS vs CONTROLLER COMMANDS' : 'STOP AT THE FIRST FAILURE'}
          lines={
            s === 5
              ? ['General IOS: show interfaces / show ip interface brief / show running-config. Controller/AP RF commands vary by platform.']
              : ['Do not change channels and security at the same time. Fix the lowest confirmed problem first.']
          }
          color="#f59e0b"
          active
        />
      </svg>
    </StepShell>
  )
}
