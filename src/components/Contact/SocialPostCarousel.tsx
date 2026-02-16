import React, { useEffect, useMemo, useState } from "react";
import { useTouchSwipe } from "../../hooks/useTouchSwipe";

export interface SocialPost {
  id: string;
  platform: string;
  handle: string;
  publishedLabel: string;
  title: string;
  excerpt: string;
  href: string;
  accentClassName: string;
}

export interface SocialPostCarouselProps {
  posts: SocialPost[];
  autoAdvanceMs?: number;
}

const SocialPostCarousel: React.FC<SocialPostCarouselProps> = ({ posts, autoAdvanceMs = 7000 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const hasPosts = posts.length > 0;

  const goTo = (index: number) => {
    if (!hasPosts) return;
    const count = posts.length;
    const next = ((index % count) + count) % count;
    setActiveIndex(next);
  };

  const next = () => goTo(activeIndex + 1);
  const previous = () => goTo(activeIndex - 1);

  // Swipe handlers — works for both touch and mouse drag
  const swipeHandlers = useTouchSwipe(
    {
      onSwipeLeft: next,
      onSwipeRight: previous,
    },
    { threshold: 36 },
  );

  useEffect(() => {
    if (!hasPosts || isPaused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % posts.length);
    }, autoAdvanceMs);

    return () => window.clearInterval(timer);
  }, [autoAdvanceMs, hasPosts, isPaused, posts.length]);

  const activePostLabel = useMemo(() => {
    if (!hasPosts) return "No posts";
    return `${activeIndex + 1} of ${posts.length}`;
  }, [activeIndex, hasPosts, posts.length]);

  if (!hasPosts) {
    return (
      <div className="border-t border-slate-300/60 py-8 text-slate-600">
        No social posts yet.
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden py-3 touch-pan-y"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      {...swipeHandlers}
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Latest Posts</p>
        <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">
          {activePostLabel}
        </p>
      </div>

      <div className="overflow-hidden">
        <ul
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          aria-live="polite"
        >
          {posts.map((post) => (
            <li key={post.id} className="w-full shrink-0 px-1">
              <article className="h-full border-t border-slate-300/60 py-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-600">
                    <span className={`h-2 w-2 rounded-full ${post.accentClassName}`} aria-hidden />
                    {post.platform}
                  </span>
                  <span className="text-xs uppercase tracking-[0.12em] text-slate-500">{post.publishedLabel}</span>
                </div>

                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">{post.title}</h3>
                <p className="mt-3 text-sm text-slate-600">{post.excerpt}</p>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{post.handle}</p>
                  <a
                    href={post.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex text-xs font-medium uppercase tracking-[0.14em] text-slate-700 underline decoration-slate-300 underline-offset-4 transition hover:decoration-slate-700"
                  >
                    Open Post
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="flex gap-1">
          {posts.map((post, index) => (
            <button
              key={post.id}
              type="button"
              aria-label={`Jump to ${post.platform} post ${index + 1}`}
              onClick={() => goTo(index)}
              className="flex h-8 w-8 items-center justify-center"
            >
              <span
                className={`block h-2.5 w-2.5 rounded-full transition ${
                  index === activeIndex ? "bg-slate-900" : "bg-slate-300"
                }`}
              />
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={previous}
            aria-label="Previous post"
            className="rounded-full border border-slate-300/80 px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-slate-700 transition active:scale-95 hover:border-slate-500"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next post"
            className="rounded-full border border-slate-300/80 px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-slate-700 transition active:scale-95 hover:border-slate-500"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialPostCarousel;
