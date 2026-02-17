import { useEffect, useState } from "react";

const CACHE_TTL_MS = 15 * 60 * 1000;
const FETCH_TIMEOUT_MS = 6000;
const MAX_COMMITS = 4;

interface GithubPushCommit {
  sha?: string;
  message?: string;
}

interface GithubEventPayload {
  commits?: GithubPushCommit[];
}

interface GithubEventRepo {
  name?: string;
}

interface GithubPublicEvent {
  type?: string;
  created_at?: string;
  repo?: GithubEventRepo;
  payload?: GithubEventPayload;
}

interface GithubSearchCommitAuthor {
  date?: string;
}

interface GithubSearchCommitPayload {
  message?: string;
  author?: GithubSearchCommitAuthor;
}

interface GithubSearchCommitRepository {
  full_name?: string;
}

interface GithubSearchCommitItem {
  sha?: string;
  html_url?: string;
  commit?: GithubSearchCommitPayload;
  repository?: GithubSearchCommitRepository;
}

interface GithubSearchCommitsResponse {
  items?: GithubSearchCommitItem[];
}

interface CachedGithubActivity {
  fetchedAt: number;
  commits: GithubCommitEntry[];
  rateLimited: boolean;
}

export interface GithubCommitEntry {
  sha: string;
  message: string;
  repoName: string;
  commitUrl: string;
  pushedAt: string;
}

export interface GithubActivityResult {
  status: "loading" | "ready" | "error";
  commits: GithubCommitEntry[];
  rateLimited: boolean;
  lastUpdated: number | null;
}

const buildCacheKey = (username: string) => `contact:github:${username.toLowerCase()}:v2`;

const parseTimestamp = (value: string) => {
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const parseCommitEntries = (events: GithubPublicEvent[]): GithubCommitEntry[] => {
  const seenShas = new Set<string>();
  const parsed: GithubCommitEntry[] = [];

  for (const event of events) {
    if (event.type !== "PushEvent") continue;
    const repoName = event.repo?.name;
    const pushedAt = event.created_at;
    const commits = event.payload?.commits ?? [];
    if (!repoName || !pushedAt || commits.length === 0) continue;

    for (const commit of commits) {
      const sha = (commit.sha ?? "").trim();
      if (!sha || seenShas.has(sha)) continue;
      seenShas.add(sha);

      const message = (commit.message ?? "").trim() || "Commit";
      parsed.push({
        sha,
        message,
        repoName,
        commitUrl: `https://github.com/${repoName}/commit/${sha}`,
        pushedAt,
      });
    }
  }

  parsed.sort((a, b) => parseTimestamp(b.pushedAt) - parseTimestamp(a.pushedAt));
  return parsed.slice(0, MAX_COMMITS);
};

const parseSearchCommitEntries = (payload: GithubSearchCommitsResponse): GithubCommitEntry[] => {
  const items = Array.isArray(payload.items) ? payload.items : [];
  const parsed: GithubCommitEntry[] = [];
  const seenShas = new Set<string>();

  for (const item of items) {
    const sha = (item.sha ?? "").trim();
    const repoName = (item.repository?.full_name ?? "").trim();
    const message = (item.commit?.message ?? "").trim();
    const pushedAt = (item.commit?.author?.date ?? "").trim();
    const commitUrl = (item.html_url ?? "").trim();
    if (!sha || !repoName || !pushedAt || !commitUrl || seenShas.has(sha)) continue;

    seenShas.add(sha);
    parsed.push({
      sha,
      message: message || "Commit",
      repoName,
      commitUrl,
      pushedAt,
    });
  }

  parsed.sort((a, b) => parseTimestamp(b.pushedAt) - parseTimestamp(a.pushedAt));
  return parsed.slice(0, MAX_COMMITS);
};

const readCachedActivity = (username: string): CachedGithubActivity | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(buildCacheKey(username));
    if (!raw) return null;
    const cached = JSON.parse(raw) as CachedGithubActivity;
    if (!cached || !Array.isArray(cached.commits) || typeof cached.fetchedAt !== "number") {
      return null;
    }
    return {
      fetchedAt: cached.fetchedAt,
      commits: cached.commits.slice(0, MAX_COMMITS),
      rateLimited: Boolean(cached.rateLimited),
    };
  } catch {
    return null;
  }
};

const writeCachedActivity = (username: string, payload: CachedGithubActivity) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(buildCacheKey(username), JSON.stringify(payload));
  } catch {
    // Ignore storage failures; runtime data still works.
  }
};

export const useGithubActivity = (username?: string): GithubActivityResult => {
  const [result, setResult] = useState<GithubActivityResult>({
    status: "loading",
    commits: [],
    rateLimited: false,
    lastUpdated: null,
  });

  useEffect(() => {
    if (!username) {
      setResult({
        status: "error",
        commits: [],
        rateLimited: false,
        lastUpdated: null,
      });
      return;
    }

    let cancelled = false;
    const cached = readCachedActivity(username);
    const now = Date.now();

    if (cached && now - cached.fetchedAt < CACHE_TTL_MS) {
      setResult({
        status: "ready",
        commits: cached.commits,
        rateLimited: cached.rateLimited,
        lastUpdated: cached.fetchedAt,
      });
      return;
    }

    setResult({
      status: "loading",
      commits: cached?.commits ?? [],
      rateLimited: cached?.rateLimited ?? false,
      lastUpdated: cached?.fetchedAt ?? null,
    });

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const fetchActivity = async () => {
      let rateLimited = false;
      let commits: GithubCommitEntry[] = [];
      try {
        try {
          const eventsResponse = await fetch(`https://api.github.com/users/${username}/events/public?per_page=100`, {
            signal: controller.signal,
            headers: {
              Accept: "application/vnd.github+json",
            },
          });

          if (!eventsResponse.ok) {
            const remaining = eventsResponse.headers.get("x-ratelimit-remaining");
            rateLimited = eventsResponse.status === 403 || eventsResponse.status === 429 || remaining === "0";
            throw new Error(`GitHub events API error: ${eventsResponse.status}`);
          }

          const eventsData = (await eventsResponse.json()) as GithubPublicEvent[];
          commits = parseCommitEntries(Array.isArray(eventsData) ? eventsData : []);
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") {
            throw error;
          }
        }

        if (!rateLimited && commits.length === 0) {
          try {
            const searchResponse = await fetch(
              `https://api.github.com/search/commits?q=author:${encodeURIComponent(username)}&sort=author-date&order=desc&per_page=4`,
              {
                signal: controller.signal,
                headers: {
                  Accept: "application/vnd.github+json",
                },
              }
            );

            if (!searchResponse.ok) {
              const remaining = searchResponse.headers.get("x-ratelimit-remaining");
              rateLimited = searchResponse.status === 403 || searchResponse.status === 429 || remaining === "0";
            } else {
              const searchData = (await searchResponse.json()) as GithubSearchCommitsResponse;
              commits = parseSearchCommitEntries(searchData);
            }
          } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") {
              throw error;
            }
          }
        }

        const fetchedAt = Date.now();

        writeCachedActivity(username, {
          fetchedAt,
          commits,
          rateLimited,
        });

        if (cancelled) return;
        setResult({
          status: "ready",
          commits,
          rateLimited,
          lastUpdated: fetchedAt,
        });
      } catch {
        if (cancelled) return;
        const fallbackCommits = cached?.commits ?? [];
        const fallbackLastUpdated = cached?.fetchedAt ?? null;
        setResult({
          status: fallbackCommits.length > 0 ? "ready" : "error",
          commits: fallbackCommits,
          rateLimited: rateLimited || Boolean(cached?.rateLimited),
          lastUpdated: fallbackLastUpdated,
        });
      } finally {
        window.clearTimeout(timeoutId);
      }
    };

    fetchActivity();

    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [username]);

  return result;
};
