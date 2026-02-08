import React from "react";
import PageScaffold from "../components/layout/PageScaffold";

const ContactPage: React.FC = () => {
  return (
    <PageScaffold backgroundClassName="bg-slate-50" footerBackgroundColor="#ffffff">
      {() => (
        <section className="mx-auto min-h-[160vh] w-full max-w-6xl px-6 pb-20 pt-24 text-slate-900">
          <header className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Contact</p>
            <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Connect Foundation</h1>
            <p className="mt-4 text-slate-600">
              This page now provides the structure for direct contact and a future social activity dashboard.
            </p>
          </header>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold">Direct Contact</h2>
              <ul className="mt-4 space-y-2 text-slate-600">
                <li>Email: contact@example.com</li>
                <li>GitHub: github.com/johnsurette</li>
                <li>LinkedIn: linkedin.com/in/johnsurette</li>
              </ul>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold">Social Feed Placeholder</h2>
              <p className="mt-4 text-slate-600">
                Foundation slot for latest post cards from selected platforms. This can remain static until backend aggregation is added.
              </p>
            </article>
          </div>
        </section>
      )}
    </PageScaffold>
  );
};

export default ContactPage;
