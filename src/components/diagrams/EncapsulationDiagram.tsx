import { motion } from 'framer-motion'
import { useState } from 'react'

const layers = [
  {
    name: 'Ethernet Frame',
    pdu: 'Frame',
    color: '#0ea5e9',
    detail: 'بيضيف Source MAC و Destination MAC و Type. السوّيتش بيقرأ العنوانين دول وبيقرر من أي منفذ يطلّع الـ frame.',
  },
  {
    name: 'IP Packet',
    pdu: 'Packet',
    color: '#818cf8',
    detail: 'بيضيف Source IP و Destination IP و TTL. الراوتر بيقرأ العنوانين دول وبيقلّل الـ TTL في كل قفزة.',
  },
  {
    name: 'TCP Segment',
    pdu: 'Segment',
    color: '#34d399',
    detail: 'بيضيف Source Port و Destination Port و sequence numbers عشان يضمن وصول البيانات بترتيبها.',
  },
  {
    name: 'Application Data',
    pdu: 'Data',
    color: '#f0abfc',
    detail: 'البيانات الأصلية اللي انتجها التطبيق — مثلاً طلب HTTP أو رسالة DNS.',
  },
]

export function EncapsulationDiagram() {
  const [active, setActive] = useState(0)
  const current = layers[active]

  return (
    <div className="my-6 rounded-2xl border border-sky-400/12 bg-navy-950/70 p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between" dir="ltr">
        <span className="font-mono text-[0.72rem] text-slate-500">ENCAPSULATION ↓ / DE-ENCAPSULATION ↑</span>
        <span className="rounded-md bg-sky-400/[0.08] px-2 py-1 font-mono text-[0.72rem] text-accent-300">OSI Model</span>
      </div>

      <div className="space-y-2" dir="ltr">
        {layers.map((layer, index) => (
          <motion.button
            key={layer.name}
            type="button"
            onClick={() => setActive(index)}
            animate={{ opacity: active === index ? 1 : 0.62 }}
            whileHover={{ opacity: 1, x: 4 }}
            className="block w-full rounded-xl border px-4 py-3 text-left transition"
            style={{
              borderColor: active === index ? layer.color : 'rgba(96,165,250,0.13)',
              background: active === index ? `${layer.color}18` : 'rgba(9,20,44,0.7)',
              marginInlineStart: index * 22,
              width: `calc(100% - ${index * 22}px)`,
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[0.82rem] font-bold" style={{ color: layer.color }}>
                {layer.name}
              </span>
              <span className="rounded bg-navy-950/80 px-2 py-0.5 font-mono text-[0.68rem] text-slate-400">
                L{4 - index} · {layer.pdu}
              </span>
            </div>
            {index < layers.length - 1 && (
              <div className="mt-2 h-1 rounded-full" style={{ background: `linear-gradient(90deg, ${layer.color}88, transparent)` }} />
            )}
          </motion.button>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-sky-400/10 bg-sky-400/[0.04] px-4 py-3" dir="rtl">
        <strong className="font-mono text-[0.8rem]" style={{ color: current.color }}>
          {current.name}
        </strong>
        <p className="mt-1 text-[0.88rem] leading-[1.9] text-slate-300">{current.detail}</p>
      </div>
    </div>
  )
}
