import { Link } from 'react-router-dom'

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-sky-400/10 bg-navy-950/60">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-4 py-8 text-[0.8rem] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>منصّة تعلّم CCNA 200-301 — مرتّبة حسب الـ blueprint الرسمي إصدار v1.1.</p>
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/" className="transition hover:text-accent-300">
            الرئيسية
          </Link>
          <Link to="/course" className="transition hover:text-accent-300">
            خريطة الكورس
          </Link>
          <span dir="ltr">Cisco CCNA 200-301 v1.1</span>
        </div>
      </div>
    </footer>
  )
}
