import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { SiteFooter } from './components/layout/SiteFooter'
import { SiteHeader } from './components/layout/SiteHeader'
import { ProgressProvider } from './hooks/useProgress'
import { HomePage } from './pages/HomePage'

const CoursePage = lazy(() => import('./pages/CoursePage').then((module) => ({ default: module.CoursePage })))
const LessonPage = lazy(() => import('./pages/LessonPage').then((module) => ({ default: module.LessonPage })))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <ProgressProvider>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <div className="flex-1">
          <Suspense
            fallback={
              <div className="flex min-h-[50vh] items-center justify-center text-[0.85rem] text-slate-500">
                بيتحمّل المحتوى...
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/course" element={<CoursePage />} />
              <Route path="/lesson/:topicId" element={<LessonPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
        <SiteFooter />
      </div>
    </ProgressProvider>
  )
}
