# CCNA Roadmap

منصة تعلّم تفاعلية لكورس CCNA 200-301 باستخدام React + TypeScript + Vite + Tailwind CSS v4 + Framer Motion + Lucide React. مفيش backend ولا تسجيل دخول — التقدّم محفوظ في `LocalStorage`.

## التشغيل

```bash
npm install
npm run dev
npm run build
```

## الهيكل

- `src/data/curriculum.ts` — الـ blueprint الرسمي CCNA 200-301 v1.1 كامل: ست دومينات، 53 موضوع، وكل الـ sub-objectives بترتيب Cisco.
- `src/data/types.ts` — أنواع الدروس والخطوات والـ blocks والرسوم والأسئلة.
- `src/data/lessons/topic-1-1.ts` — الدرس الأول مكتوب بالكامل بتسع خطوات.
- `src/data/lessons/index.ts` — سجل الدروس الجاهزة. أي موضوع مش مسجّل هنا بيظهر بحالة "قريباً" ب objectives رسمية بس، من غير حشو أو محتوى عام.
- `src/components/diagrams/` — الرسوم التفاعلية: خريطة الأجهزة، حركة الـ packet، الـ encapsulation، تفاصيل الـ frame، وتوبولوجيا اللاب.
- `src/components/ui/` — مكوّنات قابلة لإعادة الاستخدام: كتل الدرس، جدول، تنبيهات، كود، أسئلة، خطوات تفاعلية.
- `src/hooks/useProgress.tsx` — تتبّع الإنجاز وآخر درس عبر `LocalStorage`.

## إضافة درس جديد

1. اعمل ملف في `src/data/lessons/` باستخدام نوع `Lesson` من `src/data/types.ts`.
2. اكتب التسع خطوات بالترتيب الثابت: `what`, `how`, `packet`, `config`, `verify`, `mistakes`, `lab`, `exam`, `summary`.
3. سجّل الدرس في `src/data/lessons/index.ts`.

النص بيدعم `technical terms` بين backticks (تظهر بستايل `tech`) و**عبارات بارزة** بين نجمتين. الأوامر والـ IPs في الكتل بتبقى `LTR` جوه صفحة عربية `RTL`.

## المصادر

- [Cisco CCNA 200-301 v1.1 exam topics (PDF)](https://learningcontent.cisco.com/documents/marketing/exam-topics/200-301-CCNA-v1.1.pdf)
- أوزان الدومينات: Network Fundamentals 20% · Network Access 20% · IP Connectivity 25% · IP Services 10% · Security Fundamentals 15% · Automation and Programmability 10%.
