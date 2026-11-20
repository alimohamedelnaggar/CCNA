import { AnimatePresence, motion } from 'framer-motion'
import { LayoutDashboard, Monitor, Network, RadioTower, Router, Server, ShieldCheck, Zap } from 'lucide-react'
import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'

interface DeviceInfo {
  id: string
  name: string
  nameAr: string
  icon: LucideIcon
  layer: string
  role: string
  example: string
  code: string
}

const devices: DeviceInfo[] = [
  {
    id: 'router',
    name: 'Router',
    nameAr: 'الراوتر',
    icon: Router,
    layer: 'Layer 3 — Network',
    role: 'بيربط شبكتين أو أكتر ببعض، بيقرأ عنوان IP، بيقلّل الـ TTL، وبيختار أحسن مسار من جدول التوجيه. هو كمان بيبقى الـ default gateway للأجهزة في الشبكة.',
    example: 'ربط مكتب القاهرة بمكتب الإسكندرية عبر WAN، أو ربط VLAN بـ VLAN.',
    code: 'show ip route',
  },
  {
    id: 'l2-switch',
    name: 'Layer 2 Switch',
    nameAr: 'سوّيتش الطبقة 2',
    icon: Network,
    layer: 'Layer 2 — Data Link',
    role: 'بيربط الأجهزة داخل نفس الـ LAN. بيتعلّم الـ MAC addresses من الـ frames الواردة، وبيوجّه كل frame للميناء الصح بدل ما يبعته للكل.',
    example: 'توصيل 24 كمبيوتر في نفس الـ VLAN في دور واحد.',
    code: 'show mac address-table',
  },
  {
    id: 'l3-switch',
    name: 'Layer 3 Switch',
    nameAr: 'سوّيتش الطبقة 3',
    icon: Network,
    layer: 'Layer 2 + Layer 3',
    role: 'بيجمع بين وظائف السوّيتش والراوتر. بيعمل routing بين الـ VLANs بسرعة هاردوير، ومحتاج الأمر ip routing عشان يشتغل كراوتر.',
    example: 'سوّيتش توزيع بيعمل inter-VLAN routing جوّه مبنى كبير.',
    code: 'ip routing',
  },
  {
    id: 'firewall',
    name: 'NGFW / IPS',
    nameAr: 'الـ firewall والـ IPS',
    icon: ShieldCheck,
    layer: 'Layer 3–7',
    role: 'بيفحص الترافيك ويطبّق security rules: مين يسمح له يمرّ ومين لا. الـ NGFW بيفهم التطبيقات (Layer 7)، والـ IPS بيكتشف التهديدات ويمنعها.',
    example: 'منع المستخدمين من الوصول لمواقع معيّنة أو حماية السيرفر من هجمات.',
    code: 'security policy',
  },
  {
    id: 'ap',
    name: 'Access Point',
    nameAr: 'نقطة الوصول',
    icon: RadioTower,
    layer: 'Layer 1–2 — Wireless',
    role: 'بيحوّل الإشارة اللاسلكية لـ Ethernet ويعكسها. بيبثّ الـ SSID وبيستقبل العملاء، لكنه مش بيعمل routing بين الشبكات.',
    example: 'توفير Wi-Fi للموظفين والزوّار في نفس المبنى.',
    code: 'SSID / channel',
  },
  {
    id: 'controller',
    name: 'Controllers',
    nameAr: 'الـ Controllers',
    icon: LayoutDashboard,
    layer: 'Management Plane',
    role: 'بيوفّر إدارة مركزية: الـ WLC بيدير كل الـ APs، والـ Cisco DNA Center بيدير الشبكة ويراقبها ويدفع الإعدادات لكل الأجهزة من مكان واحد.',
    example: 'تغيير كلمة سر Wi-Fi لكل نقاط الوصول من شاشة واحدة.',
    code: 'WLC / DNA Center',
  },
  {
    id: 'endpoint',
    name: 'Endpoints',
    nameAr: 'أجهزة الطرف',
    icon: Monitor,
    layer: 'Layer 3–7 — Host',
    role: 'هم مصدر البيانات أو وجهتها: كمبيوترات، لابتوبات، طابعات، تليفونات IP، وكاميرات. بيبدأوا الاتصال ويستقبلوا الردود.',
    example: 'لابتوب موظف بيفتح موقع أو بيرسل بيانات لطابعة.',
    code: 'ipconfig',
  },
  {
    id: 'server',
    name: 'Server',
    nameAr: 'السيرفر',
    icon: Server,
    layer: 'Layer 3–7 — Host',
    role: 'جهاز بيقدّم خدمة للتانيين: web، DNS، DHCP، file، أو mail. بيستقبل الطلبات ويرجّع البيانات حسب الخدمة.',
    example: 'سيرفر DNS بيترجم اسم الموقع لعنوان IP.',
    code: 'show hosts',
  },
  {
    id: 'poe',
    name: 'PoE',
    nameAr: 'Power over Ethernet',
    icon: Zap,
    layer: 'Layer 1 — Power',
    role: 'بيغذّي الأجهزة بالكهرباء من نفس كابل الـ Ethernet بدل ما تحتاج مصدر كهرباء جنبها. السوّيتش بيسمّى PSE والجهاز المغذّى PD.',
    example: 'تشغيل IP phone و AP في سقف الغرفة من غير مقبس كهرباء.',
    code: 'show power inline',
  },
]

export function DeviceMap() {
  const [selected, setSelected] = useState(devices[0].id)
  const active = devices.find((device) => device.id === selected) ?? devices[0]
  const ActiveIcon = active.icon

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-sky-400/12 bg-navy-900/60">
      <div className="grid gap-2 p-3 sm:grid-cols-3 lg:grid-cols-5">
        {devices.map((device) => {
          const Icon = device.icon
          const isActive = device.id === selected
          return (
            <button
              key={device.id}
              type="button"
              onClick={() => setSelected(device.id)}
              aria-pressed={isActive}
              className={`flex flex-col items-center gap-2 rounded-xl border px-2 py-3.5 text-center transition ${
                isActive
                  ? 'border-accent-400/50 bg-accent-500/10 text-accent-300 shadow-[0_0_25px_-12px_rgba(56,189,248,0.9)]'
                  : 'border-sky-400/10 bg-navy-850/60 text-slate-400 hover:border-sky-400/30 hover:text-slate-200'
              }`}
            >
              <Icon size={22} strokeWidth={1.7} />
              <span className="font-mono text-[0.72rem] leading-tight" dir="ltr">
                {device.name}
              </span>
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="border-t border-sky-400/10 bg-gradient-to-l from-accent-500/[0.07] to-transparent px-5 py-4"
        >
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent-400/30 bg-accent-500/10 text-accent-300">
              <ActiveIcon size={20} />
            </span>
            <div>
              <h4 className="font-display text-base font-bold text-slate-100" dir="ltr">
                {active.name}
              </h4>
              <p className="text-[0.78rem] text-slate-400">{active.nameAr}</p>
            </div>
            <span className="mr-auto rounded-md border border-sky-400/15 bg-navy-950/60 px-2.5 py-1 font-mono text-[0.7rem] text-accent-300" dir="ltr">
              {active.layer}
            </span>
          </div>
          <p className="text-[0.92rem] leading-[1.9] text-slate-300">{active.role}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[0.82rem]">
            <span className="text-slate-500">مثال:</span>
            <span className="text-slate-300">{active.example}</span>
            <span className="mr-auto rounded bg-navy-950/70 px-2 py-0.5 font-mono text-[0.74rem] text-mint" dir="ltr">
              {active.code}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
