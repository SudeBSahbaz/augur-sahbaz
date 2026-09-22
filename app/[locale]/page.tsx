import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  setRequestLocale(locale);

  const nav = await getTranslations("Navigation");
  const brand = await getTranslations("Brand");
  const hero = await getTranslations("Hero");
  const services = await getTranslations("Services");
  const about = await getTranslations("About");
  const experience = await getTranslations("Experience");
  const contact = await getTranslations("Contact");

  const scopeItems = [
    experience("scope1"),
    experience("scope2"),
    experience("scope3"),
    experience("scope4"),
    experience("scope5"),
    experience("scope6"),
    experience("scope7"),
    experience("scope8"),
  ];

  return (
    <main id="top" className="min-h-screen bg-white">
      <Header />

      {/* ==================================================
          HERO
      ================================================== */}
      <section className="relative overflow-hidden bg-[#F7F7F5]">
        <div className="mx-auto grid max-w-[1500px] lg:min-h-[calc(100vh-80px)] lg:grid-cols-[58%_42%]">
          <div className="relative z-20 flex items-center px-5 py-14 sm:px-6 sm:py-16 lg:py-16 lg:pr-12">
            <div className="w-full">
              <p className="mb-4 text-xs font-bold tracking-[0.18em] text-[#B28A42] sm:text-sm sm:tracking-[0.2em]">
                {hero("eyebrow")}
              </p>

              <h1 className="max-w-[800px] text-[40px] font-bold leading-[1.04] tracking-tight text-[#0B2748] sm:text-5xl md:text-6xl xl:text-[64px]">
                {hero("title1")}
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>

                {hero("title2")}
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>

                {hero("title3")}
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                {hero("description")}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                <a
                  href="#hizmetler"
                  className="flex min-h-14 items-center justify-center bg-[#0B2748] px-6 py-4 text-center text-sm font-bold text-white transition hover:bg-[#15375F] sm:inline-flex sm:px-7"
                >
                  {hero("servicesButton")}
                </a>

                <a
                  href="#iletisim"
                  className="flex min-h-14 items-center justify-center border border-[#0B2748] px-6 py-4 text-center text-sm font-bold text-[#0B2748] transition hover:bg-[#0B2748] hover:text-white sm:inline-flex sm:px-7"
                >
                  {hero("contactButton")}
                </a>
              </div>
            </div>
          </div>

          <div className="relative min-h-[430px] sm:min-h-[520px] lg:min-h-full">
            <Image
              src="/images/hero-gummy-clean.png"
              alt={hero("imageAlt")}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover object-center lg:object-right"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-[#F7F7F5]/30 via-transparent to-transparent lg:hidden" />

            <div className="absolute inset-0 hidden bg-gradient-to-r from-[#F7F7F5] via-[#F7F7F5]/20 to-transparent lg:block lg:-left-20" />

            <div className="absolute bottom-5 left-5 right-5 border border-white/20 bg-[#071F3B]/90 px-5 py-4 text-white backdrop-blur-sm sm:bottom-8 sm:left-auto sm:right-8 sm:max-w-md sm:px-6 sm:py-5 lg:bottom-8">
              <p className="text-[10px] font-bold tracking-[0.16em] text-[#D6AD60] sm:text-[11px]">
                {hero("internationalExperience")}
              </p>

              <p className="mt-2 text-xs font-semibold tracking-wide sm:text-sm">
                {hero("regions")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SERVICES
      ================================================== */}
      <section
        id="hizmetler"
        className="scroll-mt-20 bg-white px-5 py-14 sm:px-6 sm:py-16 lg:py-16"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-9 max-w-3xl lg:mb-10">
            <p className="mb-3 text-xs font-bold tracking-[0.18em] text-[#B28A42] sm:text-sm sm:tracking-[0.2em]">
              {services("eyebrow")}
            </p>

            <h2 className="text-3xl font-bold leading-[1.12] tracking-tight text-[#0B2748] sm:text-4xl lg:text-[44px]">
              {services("title1")}
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              {services("title2")}
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              {services("description")}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <article className="group border border-slate-200 bg-[#FAFAF8] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#D6AD60] hover:shadow-lg lg:p-7">
              <div className="mb-5 flex h-12 w-12 items-center justify-center border border-[#0B2748]/20 text-[#0B2748]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-6 w-6"
                >
                  <path d="M3 21h18" />
                  <path d="M5 21V10l5 3V9l5 3V5h4v16" />
                  <path d="M8 17h1" />
                  <path d="M12 17h1" />
                  <path d="M16 17h1" />
                </svg>
              </div>

              <h3 className="text-lg font-bold leading-6 text-[#0B2748]">
                {services("card1Title")}
              </h3>

              <p className="mt-3 text-[15px] leading-6 text-slate-600">
                {services("card1Text")}
              </p>

              <div className="mt-6 h-[2px] w-10 bg-[#D6AD60] transition-all group-hover:w-20" />
            </article>

            <article className="group border border-slate-200 bg-[#FAFAF8] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#D6AD60] hover:shadow-lg lg:p-7">
              <div className="mb-5 flex h-12 w-12 items-center justify-center border border-[#0B2748]/20 text-[#0B2748]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-6 w-6"
                >
                  <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>

              <h3 className="text-lg font-bold leading-6 text-[#0B2748]">
                {services("card2Title")}
              </h3>

              <p className="mt-3 text-[15px] leading-6 text-slate-600">
                {services("card2Text")}
              </p>

              <div className="mt-6 h-[2px] w-10 bg-[#D6AD60] transition-all group-hover:w-20" />
            </article>

            <article className="group border border-slate-200 bg-[#FAFAF8] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#D6AD60] hover:shadow-lg lg:p-7">
              <div className="mb-5 flex h-12 w-12 items-center justify-center border border-[#0B2748]/20 text-[#0B2748]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-6 w-6"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v3" />
                  <path d="M12 19v3" />
                  <path d="M4.93 4.93l2.12 2.12" />
                  <path d="M16.95 16.95l2.12 2.12" />
                  <path d="M2 12h3" />
                  <path d="M19 12h3" />
                </svg>
              </div>

              <h3 className="text-lg font-bold leading-6 text-[#0B2748]">
                {services("card3Title")}
              </h3>

              <p className="mt-3 text-[15px] leading-6 text-slate-600">
                {services("card3Text")}
              </p>

              <div className="mt-6 h-[2px] w-10 bg-[#D6AD60] transition-all group-hover:w-20" />
            </article>

            <article className="group border border-slate-200 bg-[#FAFAF8] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#D6AD60] hover:shadow-lg lg:p-7">
              <div className="mb-5 flex h-12 w-12 items-center justify-center border border-[#0B2748]/20 text-[#0B2748]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-6 w-6"
                >
                  <path d="M4 19V9" />
                  <path d="M10 19V5" />
                  <path d="M16 19v-7" />
                  <path d="M22 19H2" />
                  <path d="m4 7 6-4 6 5 5-4" />
                </svg>
              </div>

              <h3 className="text-lg font-bold leading-6 text-[#0B2748]">
                {services("card4Title")}
              </h3>

              <p className="mt-3 text-[15px] leading-6 text-slate-600">
                {services("card4Text")}
              </p>

              <div className="mt-6 h-[2px] w-10 bg-[#D6AD60] transition-all group-hover:w-20" />
            </article>
          </div>
        </div>
      </section>

      {/* ==================================================
          ABOUT
      ================================================== */}
      <section
        id="hakkinda"
        className="scroll-mt-20 bg-[#0B2748] px-5 py-12 text-white sm:px-6 lg:min-h-[calc(100vh-80px)] lg:py-10"
      >
        <div className="mx-auto grid max-w-7xl gap-8 lg:min-h-[calc(100vh-160px)] lg:grid-cols-[38%_62%] lg:items-center">
          {/* PHOTO */}
<div className="flex items-center justify-center lg:justify-start">
  <div className="relative w-full max-w-[430px] overflow-hidden border border-white/10 bg-white">
    <Image
      src="/images/ugursahbaz.png"
      alt="A. Uğur Şahbaz"
      width={1104}
      height={1376}
      priority
      sizes="(max-width: 1024px) 100vw, 430px"
      className="block h-auto w-full"
    />
  </div>
</div>

          {/* CONTENT */}
          <div>
            <p className="mb-3 text-xs font-bold tracking-[0.18em] text-[#D6AD60] sm:text-sm">
              {about("eyebrow")}
            </p>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {about("name")}
            </h2>

            <p className="mt-3 text-base font-semibold leading-6 text-[#D6AD60] sm:text-lg">
              {about("role")}
            </p>

            <div className="mt-5 max-w-3xl space-y-3 text-[15px] leading-6 text-white/75 sm:text-base sm:leading-7">
              <p>{about("paragraph1")}</p>
              <p>{about("paragraph2")}</p>
            </div>

            {/* VALUES */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="border-t border-white/20 pt-4">
                <p className="text-xs font-bold tracking-[0.12em] text-[#D6AD60]">
                  {about("focusLabel")}
                </p>

                <p className="mt-2 text-white/80">
                  {about("focusValue")}
                </p>
              </div>

              <div className="border-t border-white/20 pt-4">
                <p className="text-xs font-bold tracking-[0.12em] text-[#D6AD60]">
                  {about("approachLabel")}
                </p>

                <p className="mt-2 text-white/80">
                  {about("approachValue")}
                </p>
              </div>

              <div className="border-t border-white/20 pt-4">
                <p className="text-xs font-bold tracking-[0.12em] text-[#D6AD60]">
                  {about("resultLabel")}
                </p>

                <p className="mt-2 text-white/80">
                  {about("resultValue")}
                </p>
              </div>
            </div>

            {/* CONTACT LINKS */}
            <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
              <a
                href="mailto:ugursahbaz05@yahoo.com"
                className="flex min-h-11 items-center justify-center border border-white/25 px-6 py-2.5 text-sm font-bold transition hover:border-[#D6AD60] hover:text-[#D6AD60]"
              >
                {about("emailButton")}
              </a>

              <a
                href="tel:+905324522088"
                className="flex min-h-11 items-center justify-center border border-white/25 px-6 py-2.5 text-sm font-bold transition hover:border-[#D6AD60] hover:text-[#D6AD60]"
              >
                {about("phoneButton")}
              </a>

              <a
                href="https://www.linkedin.com/in/augursahbaz/"
                target="_blank"
                rel="noreferrer"
                className="flex min-h-11 items-center justify-center border border-white/25 px-6 py-2.5 text-sm font-bold transition hover:border-[#D6AD60] hover:text-[#D6AD60]"
              >
                {about("linkedinButton")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          EXPERIENCE
      ================================================== */}
      <section
        id="deneyim"
        className="scroll-mt-20 bg-[#F7F7F5] px-5 py-14 sm:px-6 sm:py-16 lg:py-16"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-9 max-w-3xl">
            <p className="mb-3 text-xs font-bold tracking-[0.18em] text-[#B28A42] sm:text-sm">
              {experience("eyebrow")}
            </p>

            <h2 className="text-3xl font-bold leading-tight tracking-tight text-[#0B2748] sm:text-4xl lg:text-[44px]">
              {experience("title1")}
              <br />
              {experience("title2")}
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              {experience("description")}
            </p>
          </div>

          <div className="grid gap-7 lg:grid-cols-[45%_55%]">
            <div className="space-y-3">
              {[
                ["01", "region1Title", "region1Text"],
                ["02", "region2Title", "region2Text"],
                ["03", "region3Title", "region3Text"],
              ].map(([number, titleKey, textKey]) => (
                <div
                  key={number}
                  className="border border-slate-200 bg-white p-5 sm:p-6"
                >
                  <p className="text-xs font-bold tracking-[0.2em] text-[#B28A42]">
                    {number}
                  </p>

                  <h3 className="mt-3 text-xl font-bold text-[#0B2748]">
                    {experience(titleKey)}
                  </h3>

                  <p className="mt-2 text-[15px] leading-6 text-slate-600">
                    {experience(textKey)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border border-slate-200 bg-white p-6 sm:p-8">
              <p className="text-xs font-bold tracking-[0.18em] text-[#B28A42] sm:text-sm">
                {experience("scopeEyebrow")}
              </p>

              <h3 className="mt-3 max-w-xl text-2xl font-bold leading-tight text-[#0B2748] sm:text-3xl">
                {experience("scopeTitle")}
              </h3>

              <div className="mt-7 grid gap-2 sm:grid-cols-2">
                {scopeItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 border-b border-slate-200 py-3"
                  >
                    <span className="h-2 w-2 shrink-0 bg-[#D6AD60]" />
                    <span className="font-semibold text-[#0B2748]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-7 border-l-2 border-[#D6AD60] pl-5">
                <p className="text-lg font-semibold leading-7 text-[#0B2748]">
                  “{experience("quote")}”
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          CONTACT
      ================================================== */}
      <section
        id="iletisim"
        className="scroll-mt-20 bg-white px-5 py-14 sm:px-6 sm:py-16 lg:py-16"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-9 lg:grid-cols-[42%_58%] lg:gap-12">
            <div>
              <p className="mb-3 text-xs font-bold tracking-[0.18em] text-[#B28A42] sm:text-sm">
                {contact("eyebrow")}
              </p>

              <h2 className="text-3xl font-bold leading-[1.12] tracking-tight text-[#0B2748] sm:text-4xl lg:text-[44px]">
                {contact("title")}
              </h2>

              <p className="mt-4 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
                {contact("description")}
              </p>

              <div className="mt-8 space-y-6">
                <div>
                  <p className="text-xs font-bold tracking-[0.18em] text-[#B28A42]">
                    {contact("phoneLabel")}
                  </p>

                  <a
                    href="tel:+905324522088"
                    className="mt-2 block text-lg font-semibold text-[#0B2748] transition hover:text-[#B28A42]"
                  >
                    +90 532 452 20 88
                  </a>
                </div>

                <div>
                  <p className="text-xs font-bold tracking-[0.18em] text-[#B28A42]">
                    {contact("emailLabel")}
                  </p>

                  <a
                    href="mailto:ugursahbaz05@yahoo.com"
                    className="mt-2 block break-all text-lg font-semibold text-[#0B2748] transition hover:text-[#B28A42]"
                  >
                    ugursahbaz05@yahoo.com
                  </a>
                </div>

                <div>
                  <p className="text-xs font-bold tracking-[0.18em] text-[#B28A42]">
                    {contact("linkedinLabel")}
                  </p>

                  <a
                    href="https://www.linkedin.com/in/augursahbaz/"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-lg font-semibold text-[#0B2748] transition hover:text-[#B28A42]"
                  >
                    @augursahbaz →
                  </a>
                </div>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      <Footer locale={locale} />
    </main>
  );
}