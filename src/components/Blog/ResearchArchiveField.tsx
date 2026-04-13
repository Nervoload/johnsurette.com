import React, { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { BlogPostEntry } from "../../content";
import { ResolvedThemeMode } from "../theme/themeMode";
import { useIsTouch } from "../../hooks/usePointerDevice";
import BlogChronologyRail from "./BlogChronologyRail";
import ResearchArchiveCard from "./ResearchArchiveCard";

interface ResearchArchiveFieldProps {
  posts: BlogPostEntry[];
  featuredPost: BlogPostEntry;
  heroDominant: boolean;
  scrollRef: RefObject<HTMLDivElement>;
  themeMode: ResolvedThemeMode;
  onOpenArticle: (post: BlogPostEntry) => void;
}

const ResearchArchiveField: React.FC<ResearchArchiveFieldProps> = ({
  posts,
  featuredPost,
  heroDominant,
  scrollRef,
  themeMode,
  onOpenArticle,
}) => {
  const isTouch = useIsTouch();
  const prefersReducedMotion = Boolean(useReducedMotion());
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const ratiosRef = useRef<Map<string, number>>(new Map());
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [railCollapsed, setRailCollapsed] = useState(false);

  const visiblePosts = useMemo(
    () => posts.filter((post) => post.id !== featuredPost.id),
    [featuredPost.id, posts],
  );
  const railPosts = useMemo(() => posts, [posts]);

  useEffect(() => {
    if (heroDominant) {
      setRailCollapsed(true);
      setHoveredId(null);
      return;
    }

    setRailCollapsed(false);
  }, [heroDominant]);

  useEffect(() => {
    if (!visiblePosts.some((post) => post.id === expandedId)) {
      setExpandedId(null);
    }
    if (!visiblePosts.some((post) => post.id === activePostId)) {
      setActivePostId(visiblePosts[0]?.id ?? null);
    }
  }, [activePostId, expandedId, visiblePosts]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root || visiblePosts.length === 0) return;

    ratiosRef.current = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).dataset.postId;
          if (!id) return;
          ratiosRef.current.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        let nextId = visiblePosts[0]?.id ?? null;
        let nextRatio = 0;

        visiblePosts.forEach((post) => {
          const ratio = ratiosRef.current.get(post.id) ?? 0;
          if (ratio > nextRatio) {
            nextRatio = ratio;
            nextId = post.id;
          }
        });

        setActivePostId((current) => (current === nextId ? current : nextId));
      },
      {
        root,
        threshold: [0.16, 0.28, 0.45, 0.68, 0.88],
        rootMargin: "-12% 0px -18% 0px",
      },
    );

    visiblePosts.forEach((post) => {
      const node = cardRefs.current[post.id];
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [scrollRef, visiblePosts]);

  const setCardRef = useCallback(
    (postId: string) => (node: HTMLDivElement | null) => {
      cardRefs.current[postId] = node;
    },
    [],
  );

  const scrollToPost = useCallback(
    (postId: string) => {
      const container = scrollRef.current;
      if (!container) return;

      if (postId === featuredPost.id) {
        container.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
        return;
      }

      const node = cardRefs.current[postId];
      if (!node) return;

      const containerRect = container.getBoundingClientRect();
      const nodeRect = node.getBoundingClientRect();
      const targetTop = nodeRect.top - containerRect.top + container.scrollTop - container.clientHeight * 0.12;

      container.scrollTo({ top: Math.max(0, targetTop), behavior: prefersReducedMotion ? "auto" : "smooth" });
    },
    [featuredPost.id, prefersReducedMotion, scrollRef],
  );

  const activeRailId = heroDominant ? featuredPost.id : expandedId ?? activePostId ?? featuredPost.id;
  const focusedRailIds = hoveredId
    ? [hoveredId]
    : heroDominant
      ? [featuredPost.id]
      : activePostId
        ? [activePostId]
        : [];

  const handleSelectPost = (postId: string) => {
    scrollToPost(postId);
    if (postId === featuredPost.id) {
      setExpandedId(null);
      setHoveredId(null);
      return;
    }

    setExpandedId(postId);
  };

  return (
    <section className="research-archive-section">
      <div className="research-archive-intro">
        <p className="research-archive-eyebrow">Archive Field</p>
        <p className="research-archive-summary">
          Scroll the full chronology, expand a note in place, or open the full article to continue the staged reading experience.
        </p>
      </div>

      <div className="research-archive-mobile-rail lg:hidden">
        <BlogChronologyRail
          posts={railPosts}
          activePostId={activeRailId}
          focusedPostIds={focusedRailIds}
          expandedPostId={expandedId}
          mode="horizontal"
          onSelectPost={handleSelectPost}
          collapsed={heroDominant || railCollapsed}
          onCollapsedChange={setRailCollapsed}
        />
      </div>

      <div className="research-archive-layout">
        <div className="research-archive-main">
          <div className="research-archive-grid">
            {visiblePosts.map((post) => {
              const hovered = !isTouch && hoveredId === post.id;
              const expanded = expandedId === post.id;

              return (
                <motion.div
                  key={post.id}
                  ref={setCardRef(post.id)}
                  data-post-id={post.id}
                  layout
                  className={`research-archive-cell ${expanded ? "is-expanded" : ""}`}
                  transition={{ type: "spring", stiffness: 260, damping: 32, mass: 0.78 }}
                >
                  <ResearchArchiveCard
                    post={post}
                    themeMode={themeMode}
                    expanded={expanded}
                    hovered={hovered}
                    onHoverStart={(postId) => {
                      if (isTouch) return;
                      setHoveredId(postId);
                    }}
                    onHoverEnd={(postId) => {
                      if (isTouch) return;
                      setHoveredId((current) => (current === postId ? null : current));
                    }}
                    onFocusStart={setHoveredId}
                    onFocusEnd={(postId) => {
                      setHoveredId((current) => (current === postId ? null : current));
                    }}
                    onToggleExpand={(postId) => {
                      setExpandedId((current) => (current === postId ? null : postId));
                    }}
                    onOpenArticle={onOpenArticle}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.aside
          className="research-archive-rail hidden lg:block"
          animate={{
            width: heroDominant ? 0 : railCollapsed ? 68 : 320,
            opacity: heroDominant ? 0 : 1,
          }}
          transition={{ type: "spring", stiffness: 210, damping: 30, mass: 0.9 }}
        >
          <div className="research-archive-rail-shell">
            <BlogChronologyRail
              posts={railPosts}
              activePostId={activeRailId}
              focusedPostIds={focusedRailIds}
              expandedPostId={expandedId}
              mode="vertical"
              onSelectPost={handleSelectPost}
              collapsed={heroDominant || railCollapsed}
              onCollapsedChange={setRailCollapsed}
            />
          </div>
        </motion.aside>
      </div>
    </section>
  );
};

export default ResearchArchiveField;
