"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const locale = useLocale();
  const nav = useTranslations("Navigation");
  const brand = useTranslations("Brand");

  const homePath = locale === "en" ? "/en" : "/";

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-[#0B2748] text-white shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6">
        {/* BRAND */}
        <a
          href={homePath}
          onClick={closeMenu}
          className="min-w-0 leading-tight"
        >
          <div className="truncate text-base font-bold tracking-wide sm:text-lg">
            {brand("name")}
          </div>

          <div className="mt-1 hidden text-[10px] tracking-[0.15em] text-white/60 sm:block">
            {brand("role")}
          </div>
        </a>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-8 lg:flex">
          <a
            href={`${homePath}#top`}
            className="text-sm font-semibold text-[#D6AD60] transition hover:text-white"
          >
            {nav("home")}
          </a>

          <a
            href={`${homePath}#hakkinda`}
            className="text-sm font-semibold text-white/80 transition hover:text-white"
          >
            {nav("about")}
          </a>

          <a
            href={`${homePath}#hizmetler`}
            className="text-sm font-semibold text-white/80 transition hover:text-white"
          >
            {nav("services")}
          </a>

          <a
            href={`${homePath}#deneyim`}
            className="text-sm font-semibold text-white/80 transition hover:text-white"
          >
            {nav("experience")}
          </a>

          <a
            href={`${homePath}#iletisim`}
            className="text-sm font-semibold text-white/80 transition hover:text-white"
          >
            {nav("contact")}
          </a>
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex shrink-0 items-center gap-4">
          {/* LANGUAGE */}
          <div className="flex items-center gap-2 text-xs font-semibold sm:text-sm">
            <a
              href="/"
              onClick={closeMenu}
              className={
                locale === "tr"
                  ? "text-[#D6AD60]"
                  : "text-white/65 transition hover:text-white"
              }
            >
              TR
            </a>

            <span className="text-white/25">|</span>

            <a
              href="/en"
              onClick={closeMenu}
              className={
                locale === "en"
                  ? "text-[#D6AD60]"
                  : "text-white/65 transition hover:text-white"
              }
            >
              EN
            </a>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
            className="flex h-10 w-10 items-center justify-center border border-white/20 transition hover:border-[#D6AD60] lg:hidden"
          >
            {menuOpen ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION */}
      {menuOpen && (
        <>
          {/* OVERLAY */}
          <button
            type="button"
            aria-label="Menüyü kapat"
            onClick={closeMenu}
            className="fixed inset-x-0 bottom-0 top-20 z-40 bg-black/30 lg:hidden"
          />

          {/* MOBILE MENU */}
          <div className="absolute left-0 top-20 z-50 w-full border-t border-white/10 bg-[#0B2748] shadow-2xl lg:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col px-5 py-3 sm:px-6">
              <a
                href={`${homePath}#top`}
                onClick={closeMenu}
                className="border-b border-white/10 py-4 text-sm font-bold text-[#D6AD60]"
              >
                {nav("home")}
              </a>

              <a
                href={`${homePath}#hakkinda`}
                onClick={closeMenu}
                className="border-b border-white/10 py-4 text-sm font-semibold text-white/80 transition hover:text-white"
              >
                {nav("about")}
              </a>

              <a
                href={`${homePath}#hizmetler`}
                onClick={closeMenu}
                className="border-b border-white/10 py-4 text-sm font-semibold text-white/80 transition hover:text-white"
              >
                {nav("services")}
              </a>

              <a
                href={`${homePath}#deneyim`}
                onClick={closeMenu}
                className="border-b border-white/10 py-4 text-sm font-semibold text-white/80 transition hover:text-white"
              >
                {nav("experience")}
              </a>

              <a
                href={`${homePath}#iletisim`}
                onClick={closeMenu}
                className="py-4 text-sm font-semibold text-white/80 transition hover:text-white"
              >
                {nav("contact")}
              </a>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}