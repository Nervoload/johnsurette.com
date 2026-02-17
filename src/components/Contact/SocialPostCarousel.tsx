import React, { useEffect, useMemo, useState } from "react";
import { useTouchSwipe } from "../../hooks/useTouchSwipe";
import { useGithubActivity } from "./useGithubActivity";

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

      <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
        <a
          href={github.profileUrl}
          target="_blank"
          rel="noreferrer"
          className="block rounded-2xl border border-slate-300/75 bg-white/55 p-4 transition hover:border-slate-500"
        >
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Yearly Commit Grid</p>
          {gridLoadFailed ? (
            <div className="mt-3 flex h-[220px] w-full items-center justify-center rounded-xl border border-slate-200/80 bg-white p-4 text-center">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">
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
              className="mt-3 block h-[220px] w-full rounded-xl border border-slate-200/80 bg-white p-2 object-contain object-left-top"
            />
          )}
        </a>

        <div className="rounded-2xl border border-slate-300/75 bg-white/55 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Latest Commits</p>
            {rateLimited ? <span className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Rate limited</span> : null}
          </div>

          {status === "loading" && commits.length === 0 ? (
            <ul className="mt-3 space-y-2" aria-hidden="true">
              {Array.from({ length: 4 }).map((_, index) => (
                <li key={`commit-skeleton-${index}`} className="rounded-lg border border-slate-200/80 p-2.5">
                  <div className="h-3 w-4/5 animate-pulse rounded bg-slate-200/85" />
                  <div className="mt-2 h-2.5 w-2/5 animate-pulse rounded bg-slate-100" />
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
                    className="block rounded-lg border border-slate-200/80 p-2.5 transition hover:border-slate-400"
                  >
                    <p className="truncate text-xs font-medium text-slate-800">{firstLine(commit.message)}</p>
                    <p className="mt-1 truncate text-[11px] uppercase tracking-[0.09em] text-slate-500">
                      {commit.repoName}
                      <span className="mx-1 text-slate-300">/</span>
                      {formatRelativeTime(commit.pushedAt)}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          ) : <p className="mt-3 text-xs leading-relaxed text-slate-500">{commitMessage}</p>}

          <div className="mt-4 border-t border-slate-200/80 pt-3">
            <a
              href={github.profileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex text-xs font-medium uppercase tracking-[0.14em] text-slate-700 underline decoration-slate-300 underline-offset-4 transition hover:decoration-slate-700"
            >
              View github.com/{github.username}
            </a>
            {updatedLabel ? (
              <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-400">Updated {updatedLabel}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{post.handle}</p>
        <a
          href={github.profileUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex text-xs font-medium uppercase tracking-[0.14em] text-slate-700 underline decoration-slate-300 underline-offset-4 transition hover:decoration-slate-700"
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

  const activePostLabel = useMemo(() => {
    if (!hasPosts) return "No posts";
    return `${activeIndex + 1} of ${posts.length}`;
  }, [activeIndex, hasPosts, posts.length]);

  if (!hasPosts) {
    return <div className="border-t border-slate-300/60 py-8 text-slate-600">No social posts yet.</div>;
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
        <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">{activePostLabel}</p>
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
