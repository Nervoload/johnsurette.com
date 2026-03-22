import React, { useEffect, useMemo, useState } from "react";
import { useTouchSwipe } from "../../hooks/useTouchSwipe";
import { useGithubActivity } from "./useGithubActivity";
import { removeRuntimeContextEntry, upsertRuntimeContextEntry } from "../../devtools/codexContext/runtimeRegistry";

export interface SocialPostGithubConfig {
  username: string;
  profileUrl: string;
}

export interface SocialPost {
  id: string;
  platform: string;
  handle: string;
  publishedLabel: string;
  title: string;
  excerpt: string;
  href: string;
  accentClassName: string;
  github?: SocialPostGithubConfig;
}

export interface SocialPostCarouselProps {
  posts: SocialPost[];
  autoAdvanceMs?: number;
}

const relativeFormatter =
  typeof Intl !== "undefined" && typeof Intl.RelativeTimeFormat !== "undefined"
    ? new Intl.RelativeTimeFormat("en", { numeric: "auto" })
    : null;

const formatRelativeTime = (isoDate: string): string => {
  const target = Date.parse(isoDate);
  if (Number.isNaN(target)) return "recently";

  const diffMs = target - Date.now();
  const abs = Math.abs(diffMs);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;

  if (!relativeFormatter) {
    if (abs < minute) return "just now";
    if (abs < hour) return `${Math.round(abs / minute)}m ago`;
    if (abs < day) return `${Math.round(abs / hour)}h ago`;
    if (abs < week) return `${Math.round(abs / day)}d ago`;
    return `${Math.round(abs / week)}w ago`;
  }

  if (abs < minute) return relativeFormatter.format(0, "second");
  if (abs < hour) return relativeFormatter.format(Math.round(diffMs / minute), "minute");
  if (abs < day) return relativeFormatter.format(Math.round(diffMs / hour), "hour");
  if (abs < week) return relativeFormatter.format(Math.round(diffMs / day), "day");
  return relativeFormatter.format(Math.round(diffMs / week), "week");
};

const firstLine = (value: string) => value.split("\n")[0].trim() || "Commit";

const buildContributionGridSources = (username: string) => {
  const to = new Date();
  const from = new Date();
  from.setFullYear(to.getFullYear() - 1);
  const toValue = to.toISOString().slice(0, 10);
  const fromValue = from.toISOString().slice(0, 10);

  return [
    `https://github.com/users/${encodeURIComponent(username)}/contributions?from=${fromValue}&to=${toValue}`,
    `https://ghchart.rshah.org/${encodeURIComponent(username)}`,
    `https://ghchart.rshah.org/0f172a/${encodeURIComponent(username)}`,
  ];
};

interface DefaultPostCardProps {
  post: SocialPost;
}

const DefaultPostCard: React.FC<DefaultPostCardProps> = ({ post }) => {
  return (
    <article className="h-full py-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="theme-text-muted inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em]">
          <span className={`h-2 w-2 rounded-full ${post.accentClassName}`} aria-hidden />
          {post.platform}
        </span>
        <span className="theme-text-subtle text-xs uppercase tracking-[0.12em]">{post.publishedLabel}</span>
      </div>

      <h3 className="theme-text-primary mt-4 text-2xl font-semibold tracking-tight">{post.title}</h3>
      <p className="theme-text-muted mt-3 text-sm">{post.excerpt}</p>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="theme-text-subtle text-xs font-medium uppercase tracking-[0.14em]">{post.handle}</p>
        <a
          href={post.href}
          target="_blank"
          rel="noreferrer"
          className="theme-link inline-flex text-xs font-medium uppercase tracking-[0.14em] underline underline-offset-4 transition"
        >
          Open Profile
        </a>
      </div>
    </article>
  );
};

interface GithubPostCardProps {
  post: SocialPost;
}

const GithubPostCard: React.FC<GithubPostCardProps> = ({ post }) => {
  const github = post.github as SocialPostGithubConfig;

  const { status, commits, rateLimited, lastUpdated } = useGithubActivity(github.username);
  const gridSources = useMemo(() => buildContributionGridSources(github.username), [github.username]);
  const [gridSourceIndex, setGridSourceIndex] = useState(0);
  const [gridLoadFailed, setGridLoadFailed] = useState(false);
  const contributionGridUrl = gridSources[Math.min(gridSourceIndex, gridSources.length - 1)];
  const updatedLabel = lastUpdated ? formatRelativeTime(new Date(lastUpdated).toISOString()) : null;
  const commitMessage =
    status === "error"
      ? "Recent public commits unavailable right now."
      : "No recent public pushes in GitHub's public event window.";

  useEffect(() => {
    setGridSourceIndex(0);
    setGridLoadFailed(false);
  }, [github.username]);

  return (
    <article className="h-full py-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="theme-text-muted inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em]">
          <span className={`h-2 w-2 rounded-full ${post.accentClassName}`} aria-hidden />
          {post.platform}
        </span>
        <span className="theme-text-subtle text-xs uppercase tracking-[0.12em]">{post.publishedLabel}</span>
      </div>

      <h3 className="theme-text-primary mt-4 text-2xl font-semibold tracking-tight">{post.title}</h3>
      <p className="theme-text-muted mt-3 text-sm">{post.excerpt}</p>

      <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
        <a
          href={github.profileUrl}
          target="_blank"
          rel="noreferrer"
          className="theme-surface-subtle theme-border-subtle block rounded-2xl border p-4 transition hover:opacity-90"
        >
          <p className="theme-text-subtle text-[11px] uppercase tracking-[0.16em]">Yearly Commit Grid</p>
          {gridLoadFailed ? (
            <div className="theme-media-frame mt-3 flex h-[220px] w-full items-center justify-center rounded-xl border p-4 text-center">
              <p className="theme-text-subtle text-xs uppercase tracking-[0.12em]">
                Contribution grid unavailable right now.
              </p>
            </div>
          ) : (
            <img
              src={contributionGridUrl}
              alt={`${github.username} GitHub contribution activity for the last year`}
              loading="lazy"
              referrerPolicy="no-referrer"
              onLoad={() => setGridLoadFailed(false)}
              onError={() => {
                setGridSourceIndex((current) => {
                  if (current >= gridSources.length - 1) {
                    setGridLoadFailed(true);
                    return current;
                  }
                  return current + 1;
                });
              }}
              className="theme-media-frame mt-3 block h-[220px] w-full rounded-xl border p-2 object-contain object-left-top"
            />
          )}
        </a>

        <div className="theme-surface-subtle theme-border-subtle rounded-2xl border p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="theme-text-subtle text-[11px] uppercase tracking-[0.16em]">Latest Commits</p>
            {rateLimited ? <span className="theme-text-subtle text-[10px] uppercase tracking-[0.12em]">Rate limited</span> : null}
          </div>

          {status === "loading" && commits.length === 0 ? (
            <ul className="mt-3 space-y-2" aria-hidden="true">
              {Array.from({ length: 4 }).map((_, index) => (
                <li key={`commit-skeleton-${index}`} className="theme-media-frame rounded-lg border p-2.5">
                  <div className="theme-skeleton-strong h-3 w-4/5 animate-pulse rounded" />
                  <div className="theme-skeleton-soft mt-2 h-2.5 w-2/5 animate-pulse rounded" />
                </li>
              ))}
            </ul>
          ) : commits.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {commits.map((commit) => (
                <li key={commit.sha}>
                  <a
                    href={commit.commitUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="theme-media-frame block rounded-lg border p-2.5 transition hover:opacity-90"
                  >
                    <p className="theme-text-primary truncate text-xs font-medium">{firstLine(commit.message)}</p>
                    <p className="theme-text-subtle mt-1 truncate text-[11px] uppercase tracking-[0.09em]">
                      {commit.repoName}
                      <span className="theme-text-subtle mx-1">/</span>
                      {formatRelativeTime(commit.pushedAt)}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          ) : <p className="theme-text-subtle mt-3 text-xs leading-relaxed">{commitMessage}</p>}

          <div className="theme-border-subtle mt-4 border-t pt-3">
            <a
              href={github.profileUrl}
              target="_blank"
              rel="noreferrer"
              className="theme-link inline-flex text-xs font-medium uppercase tracking-[0.14em] underline underline-offset-4 transition"
            >
              View github.com/{github.username}
            </a>
            {updatedLabel ? (
              <p className="theme-text-subtle mt-1 text-[10px] uppercase tracking-[0.12em]">Updated {updatedLabel}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="theme-text-subtle text-xs font-medium uppercase tracking-[0.14em]">{post.handle}</p>
        <a
          href={github.profileUrl}
          target="_blank"
          rel="noreferrer"
          className="theme-link inline-flex text-xs font-medium uppercase tracking-[0.14em] underline underline-offset-4 transition"
        >
          Open GitHub
        </a>
      </div>
    </article>
  );
};

const SocialPostCarousel: React.FC<SocialPostCarouselProps> = ({ posts, autoAdvanceMs = 7000 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const hasPosts = posts.length > 0;
  const activePost = hasPosts ? posts[Math.min(activeIndex, posts.length - 1)] : null;

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
    { threshold: 36 }
  );

  useEffect(() => {
    if (!hasPosts || isPaused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % posts.length);
    }, autoAdvanceMs);

    return () => window.clearInterval(timer);
  }, [autoAdvanceMs, hasPosts, isPaused, posts.length]);

  const activeCardLabel = useMemo(() => {
    if (!hasPosts) return "No cards";
    return `${activeIndex + 1} of ${posts.length}`;
  }, [activeIndex, hasPosts, posts.length]);

  useEffect(() => {
    if (!import.meta.env.DEV) {
      return;
    }

    upsertRuntimeContextEntry({
      pagePath: "/contact",
      id: "contact:social-carousel",
      componentName: "SocialPostCarousel",
      componentPath: ["ContactPage", "SocialPostCarousel"],
      filePath: "/src/components/Contact/SocialPostCarousel.tsx",
      role: "social-carousel",
      metadata: {
        activeIndex,
        activePostId: activePost?.id ?? null,
        activePostTitle: activePost?.title ?? null,
        activePostPlatform: activePost?.platform ?? null,
        postCount: posts.length,
        isPaused,
        cardVariant: activePost?.github ? "github" : "default",
      },
    });

    return () => {
      removeRuntimeContextEntry("/contact", "contact:social-carousel");
    };
  }, [activeIndex, activePost, isPaused, posts.length]);

  if (!hasPosts) {
    return <div className="theme-border-subtle theme-text-muted border-t py-8">No profiles or activity cards yet.</div>;
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
      <div className="mb-4 flex items-center justify-end">
        <p className="theme-text-subtle text-[11px] uppercase tracking-[0.12em]">{activeCardLabel}</p>
      </div>

      <div className="overflow-hidden">
        <ul
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          aria-live="polite"
        >
          {posts.map((post) => (
            <li key={post.id} className="w-full shrink-0 px-1">
              {post.github ? <GithubPostCard post={post} /> : <DefaultPostCard post={post} />}
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
              aria-label={`Jump to ${post.platform} card ${index + 1}`}
              onClick={() => goTo(index)}
              className="flex h-8 w-8 items-center justify-center"
            >
              <span
                className={`block h-2.5 w-2.5 rounded-full transition ${
                  index === activeIndex ? "theme-carousel-dot-active" : "theme-carousel-dot-idle"
                }`}
              />
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={previous}
            aria-label="Previous card"
            className="theme-pill-button rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] transition active:scale-95"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next card"
            className="theme-pill-button rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] transition active:scale-95"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialPostCarousel;
