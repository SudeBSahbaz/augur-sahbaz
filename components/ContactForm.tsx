"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const t = useTranslations("ContactForm");

  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/mrpgzgyr", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Form submission failed.");
      }

      setStatus("success");
      setMessage(t("success"));

      form.reset();
    } catch (error) {
      console.error("Formspree error:", error);

      setStatus("error");
      setMessage(t("error"));
    }
  }

  return (
    <div className="border border-slate-200 bg-[#FAFAF8] p-6 sm:p-8">
      <div className="mb-6">
        <p className="text-xs font-bold tracking-[0.18em] text-[#B28A42] sm:text-sm">
          {t("eyebrow")}
        </p>

        <h3 className="mt-2 text-2xl font-bold text-[#0B2748]">
          {t("title")}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NAME */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-bold text-[#0B2748]"
          >
            {t("nameLabel")}
          </label>

          <input
            id="name"
            name="name"
            type="text"
            required
            disabled={status === "loading"}
            placeholder={t("namePlaceholder")}
            className="w-full border border-slate-300 bg-white px-4 py-3.5 text-[#0B2748] outline-none transition placeholder:text-slate-400 focus:border-[#B28A42] disabled:cursor-not-allowed disabled:bg-slate-100"
          />
        </div>

        {/* EMAIL */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-bold text-[#0B2748]"
          >
            {t("emailLabel")}
          </label>

          <input
            id="email"
            name="email"
            type="email"
            required
            disabled={status === "loading"}
            placeholder={t("emailPlaceholder")}
            className="w-full border border-slate-300 bg-white px-4 py-3.5 text-[#0B2748] outline-none transition placeholder:text-slate-400 focus:border-[#B28A42] disabled:cursor-not-allowed disabled:bg-slate-100"
          />
        </div>

        {/* COMPANY */}
        <div>
          <label
            htmlFor="company"
            className="mb-2 block text-sm font-bold text-[#0B2748]"
          >
            {t("companyLabel")}
          </label>

          <input
            id="company"
            name="company"
            type="text"
            disabled={status === "loading"}
            placeholder={t("companyPlaceholder")}
            className="w-full border border-slate-300 bg-white px-4 py-3.5 text-[#0B2748] outline-none transition placeholder:text-slate-400 focus:border-[#B28A42] disabled:cursor-not-allowed disabled:bg-slate-100"
          />
        </div>

        {/* MESSAGE */}
        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-bold text-[#0B2748]"
          >
            {t("messageLabel")}
          </label>

          <textarea
            id="message"
            name="message"
            required
            rows={4}
            disabled={status === "loading"}
            placeholder={t("messagePlaceholder")}
            className="w-full resize-none border border-slate-300 bg-white px-4 py-3.5 text-[#0B2748] outline-none transition placeholder:text-slate-400 focus:border-[#B28A42] disabled:cursor-not-allowed disabled:bg-slate-100"
          />
        </div>

        {/* SUBJECT FOR FORMSPREE */}
        <input
          type="hidden"
          name="_subject"
          value="Yeni Web Sitesi Mesajı - A. Uğur Şahbaz"
        />

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-[#0B2748] px-8 py-3.5 text-sm font-bold text-white transition hover:bg-[#15375F] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? t("sending") : t("submit")}
        </button>

        {message && (
          <div
            className={`border px-4 py-3 text-sm leading-6 ${
              status === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}