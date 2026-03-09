import React, { useEffect, useState } from "react";
import { contactPageContent, pageVisuals, siteMeta } from "../content";
import DotFieldGlobeBackground from "../components/visuals/DotFieldGlobeBackground";
import SocialPostCarousel from "../components/Contact/SocialPostCarousel";
import PageScaffold from "../components/layout/PageScaffold";
import { ResolvedThemeMode } from "../components/theme/themeMode";

export interface ContactPageProps {
  themeMode: ResolvedThemeMode;
}

const ContactPage: React.FC<ContactPageProps> = ({ themeMode }) => {
  const emailAddress = siteMeta.ownerEmail;
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    if (copyStatus === "idle") return;
    const timer = window.setTimeout(() => setCopyStatus("idle"), 2200);
    return () => window.clearTimeout(timer);
  }, [copyStatus]);

  const handleCopyEmail = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(emailAddress);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = emailAddress;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        const copied = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (!copied) throw new Error("Copy failed");
      }
      setCopyStatus("success");
    } catch {
      setCopyStatus("error");
    }
  };

  return (
    <PageScaffold
      backgroundClassName={pageVisuals.contact.backgroundClassName}
      footerBackgroundColor={pageVisuals.contact.footerBackgroundColor}
      footerRunwayVh={pageVisuals.contact.footerRunwayVh}
    >
      {() => (
        <section className="theme-text-primary relative min-h-[100dvh] w-full overflow-hidden px-4 pb-24 pt-24 xs:px-6">
          <div className="pointer-events-none absolute inset-0">
            <DotFieldGlobeBackground
              pointCount={pageVisuals.contact.dotFieldPointCount ?? 240}
              className="opacity-90"
              themeMode={themeMode}
            />
            <div className="theme-contact-overlay absolute inset-0" />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-6xl">
            <header className="max-w-3xl">
              <p className="theme-text-subtle text-xs uppercase tracking-[0.26em]">{contactPageContent.eyebrow}</p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight xs:text-4xl sm:text-6xl">{contactPageContent.title}</h1>
              <p className="theme-text-muted mt-5 max-w-2xl text-[15px] leading-relaxed">{contactPageContent.summary}</p>
            </header>

            <div className="theme-border-subtle mt-12 grid gap-10 border-t pt-10 md:grid-cols-[1.25fr_1fr]">
              <article>
                <p className="theme-text-subtle text-xs uppercase tracking-[0.24em]">{contactPageContent.contactLabel}</p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <a
                    href={`mailto:${emailAddress}`}
                    className="theme-link inline-flex text-xl font-semibold tracking-tight underline underline-offset-8 transition xs:text-2xl"
                  >
                    {emailAddress}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    aria-label="Copy email address"
                    className="theme-border-subtle theme-text-muted inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] transition hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
                  >
                    {contactPageContent.copyButtonLabel}
                  </button>
                </div>
                <p aria-live="polite" className="theme-text-subtle mt-2 min-h-[1.2rem] text-xs uppercase tracking-[0.12em]">
                  {copyStatus === "success"
                    ? contactPageContent.copySuccessLabel
                    : copyStatus === "error"
                      ? contactPageContent.copyErrorLabel
                      : ""}
                </p>
                <p className="theme-text-muted mt-4 max-w-lg text-sm leading-relaxed">{contactPageContent.contactDescription}</p>
                <div className="theme-text-muted mt-7 flex flex-wrap gap-5 text-[12px] uppercase tracking-[0.16em]">
                  {siteMeta.socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="theme-link underline underline-offset-4"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </article>

              <article className="theme-border-subtle md:border-l md:pl-10">
                <p className="theme-text-subtle text-xs uppercase tracking-[0.24em]">{contactPageContent.availabilityEyebrow}</p>
                <p className="theme-text-primary mt-4 text-3xl font-semibold tracking-tight">{contactPageContent.availabilityTitle}</p>
                <p className="theme-text-muted mt-4 text-sm leading-relaxed">{contactPageContent.availabilitySummary}</p>
                <div className="theme-text-subtle mt-8 space-y-2 text-[13px] uppercase tracking-[0.15em]">
                  <p>Response Window: {contactPageContent.responseWindowLabel}</p>
                  <p>Timezone: {contactPageContent.timezoneLabel}</p>
                  <p>Preferred Contact: {contactPageContent.preferredContactLabel}</p>
                </div>
              </article>
            </div>

            <div className="theme-border-subtle mt-20 border-t pt-10">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="theme-text-subtle text-xs uppercase tracking-[0.24em]">{contactPageContent.socialFeedEyebrow}</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight">{contactPageContent.socialFeedTitle}</h2>
                </div>
                <p className="theme-text-muted max-w-sm text-sm">{contactPageContent.socialFeedSummary}</p>
              </div>

              <SocialPostCarousel posts={contactPageContent.socialPosts} />
            </div>
          </div>
        </section>
      )}
    </PageScaffold>
  );
};

export default ContactPage;
