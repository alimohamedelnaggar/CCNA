import { motion } from 'framer-motion'

const fields = [
  { label: 'Dst MAC', value: '00:1B:44:11:3A:B7', color: '#38bdf8' },
  { label: 'Src MAC', value: '00:1B:44:11:3A:01', color: '#38bdf8' },
  { label: 'Src IP', value: '192.0.2.10', color: '#a78bfa' },
  { label: 'Dst IP', value: '198.51.100.80', color: '#a78bfa' },
  { label: 'TTL', value: '64', color: '#a78bfa' },
  { label: 'Src Port', value: '49152', color: '#34d399' },
  { label: 'Dst Port', value: '80', color: '#34d399' },
]

export function FrameDetail() {
  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-sky-400/12 bg-navy-950/70 p-4 sm:p-5" dir="ltr">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4 }}
        className="rounded-xl border border-sky-400/40 bg-sky-500/[0.06] p-3"
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-[0.75rem] font-bold text-accent-300">ETHERNET FRAME</span>
          <span className="font-mono text-[0.68rem] text-slate-500">Layer 2 · switched by MAC</span>
        </div>

        <div className="rounded-xl border border-violet-400/40 bg-violet-500/[0.06] p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[0.75rem] font-bold text-violet-300">IP PACKET</span>
            <span className="font-mono text-[0.68rem] text-slate-500">Layer 3 · routed by IP</span>
          </div>

          <div className="rounded-xl border border-emerald-400/40 bg-emerald-500/[0.06] p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-[0.75rem] font-bold text-emerald-300">TCP SEGMENT</span>
              <span className="font-mono text-[0.68rem] text-slate-500">Layer 4 · ports</span>
            </div>
            <div className="rounded-lg border border-fuchsia-400/30 bg-fuchsia-500/[0.07] px-3 py-4 text-center font-mono text-[0.78rem] text-fuchsia-200">
              DATA (HTTP GET /index.html)
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {fields.map((field) => (
          <div key={field.label} className="rounded-lg border border-sky-400/10 bg-navy-900/70 px-3 py-2">
            <div className="font-mono text-[0.66rem] uppercase tracking-wider text-slate-500">{field.label}</div>
            <div className="mt-0.5 font-mono text-[0.8rem]" style={{ color: field.color }}>
              {field.value}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 border-t border-sky-400/10 pt-3 font-mono text-[0.72rem] leading-relaxed text-slate-400">
        Source/Destination IP stay end-to-end · Source/Destination MAC change at every hop · TTL decreases by 1 per router
      </p>
    </div>
  )
}
