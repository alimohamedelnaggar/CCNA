import { motion } from 'framer-motion'
import { BookOpenText, Home, Network } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { totalTopics } from '../../data/curriculum'
import { useProgress } from '../../hooks/useProgress'

export function SiteHeader() {
  const { completedCount, lastTopicId } = useProgress()
  const percent = Math.round((completedCount / totalTopics) * 100)

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-[0.85rem] font-bold transition ${
      isActive ? 'bg-accent-500/12 text-accent-300' : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-100'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-sky-400/10 bg-navy-950/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-[1500px] items-center gap-3 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-accent-400/30 bg-gradient-to-br from-accent-500/25 to-electric/10 text-accent-300">
            <Network size={21} strokeWidth={1.8} />
            <motion.span
              className="absolute inset-0 rounded-xl border border-accent-300/20"
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-[0.95rem] font-bold text-slate-100" dir="ltr">
              CCNA <span className="text-accent-400">Roadmap</span>
            </span>
            <span className="block text-[0.68rem] text-slate-500">تعلّم الشبكات بوضوح</span>
          </span>
        </Link>

        <nav className="mr-auto flex items-center gap-1" dir="rtl">
          <NavLink to="/" end className={linkClass}>
            <Home size={16} />
            <span className="hidden sm:inline">الرئيسية</span>
          </NavLink>
          <NavLink to="/course" className={linkClass}>
            <BookOpenText size={16} />
            <span className="hidden sm:inline">خريطة الكورس</span>
          </NavLink>
          {lastTopicId && (
            <NavLink to={`/lesson/${lastTopicId}`} className={linkClass}>
              <Network size={16} />
              <span className="hidden md:inline">آخر درس</span>
            </NavLink>
          )}
        </nav>

        <Link
          to="/course"
          className="flex items-center gap-2 rounded-full border border-accent-400/20 bg-accent-500/[0.07] py-1.5 pl-3 pr-1.5 transition hover:border-accent-400/50"
          title={`أنجزت ${completedCount} من ${totalTopics} موضوع`}
        >
          <span className="font-display text-[0.78rem] font-bold text-accent-300" dir="ltr">
            {percent}%
          </span>
          <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-accent-500/15">
            <svg className="absolute -rotate-90" width="28" height="28" viewBox="0 0 28 28">
              <circle cx="14" cy="14" r="11" fill="none" stroke="rgba(96,165,250,0.15)" strokeWidth="3" />
              <circle
                cx="14"
                cy="14"
                r="11"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 11}
                strokeDashoffset={2 * Math.PI * 11 * (1 - percent / 100)}
                style={{ transition: 'stroke-dashoffset 600ms ease' }}
              />
            </svg>
            <span className="relative h-1.5 w-1.5 rounded-full bg-accent-300" />
          </span>
        </Link>
      </div>
    </header>
  )
}
