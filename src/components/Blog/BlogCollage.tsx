import React, { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { BlogPageContent, BlogPostEntry } from "../../content";
import { getBlogPostPath } from "../../content";
import { useIsTouch } from "../../hooks/usePointerDevice";
import { WipeOptions } from "../Transitions/TransitionWipe";
import BlogChronologyRail from "./BlogChronologyRail";
import BlogPostCard from "./BlogPostCard";
import { resolveActiveBlogPostId, resolveBlogCardDetailLevel } from "./blogCardState";

const BLOG_ROUTE_COLOR = "#da08ff";
const RESET_BUMP_AFTER_MS = 140;

interface BlogCollageProps {
  posts: BlogPostEntry[];
  pageContent: BlogPageContent;
  scrollRef: RefObject<HTMLDivElement>;
  onNavigate: (path: string, opts?: WipeOptions) => void;
}

interface CardMotionState {
  x: number;
  y: number;
  rotate: number;
}

const zeroMotion: CardMotionState = { x: 0, y: 0, rotate: 0 };

const BlogCollage: React.FC<BlogCollageProps> = ({ posts, pageContent, scrollRef, onNavigate }) => {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const isTouch = useIsTouch();
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const measureFrameRef = useRef<number | null>(null);
  const settleTimerRef = useRef<number | null>(null);
  const activeViewportIdRef = useRef<string | null>(posts[0]?.id ?? null);
  const lastScrollTopRef = useRef(0);
  const lastScrollTimeRef = useRef(0);
  const initialPostId = posts[0]?.id ?? null;
  const [activeViewportId, setActiveViewportId] = useState<string | null>(initialPostId);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [railCollapsed, setRailCollapsed] = useState(true);
  const [cardMotionById, setCardMotionById] = useState<Record<string, CardMotionState>>({});

  useEffect(() => {
    activeViewportIdRef.current = activeViewportId;
  }, [activeViewportId]);

  useEffect(() => {
    setActiveViewportId((current) => current ?? initialPostId);
    activeViewportIdRef.current = activeViewportIdRef.current ?? initialPostId;
  }, [initialPostId]);

  const runMeasurement = useCallback(() => {
    if (measureFrameRef.current !== null) {
      window.cancelAnimationFrame(measureFrameRef.current);
    }

    measureFrameRef.current = window.requestAnimationFrame(() => {
      measureFrameRef.current = null;
      const container = scrollRef.current;
      if (!container || posts.length === 0) return;

      const containerRect = container.getBoundingClientRect();
      const viewportCenterY = containerRect.top + containerRect.height * 0.5;
      const viewportCenterX = containerRect.left + containerRect.width * (window.innerWidth >= 1024 ? 0.42 : 0.5);

      let nearestPostId = posts[0]?.id ?? null;
      let nearestDistance = Number.POSITIVE_INFINITY;

      posts.forEach((post) => {
        const node = cardRefs.current[post.id];
        if (!node) return;

        const rect = node.getBoundingClientRect();
        const visibleHeight = Math.max(0, Math.min(rect.bottom, containerRect.bottom) - Math.max(rect.top, containerRect.top));
        const visibleWidth = Math.max(0, Math.min(rect.right, containerRect.right) - Math.max(rect.left, containerRect.left));
        if (visibleHeight < 56 || visibleWidth < 88) {
          return;
        }

        const centerX = rect.left + rect.width * 0.5;
        const centerY = rect.top + rect.height * 0.5;
        const dx = (centerX - viewportCenterX) * 0.88;
        const dy = centerY - viewportCenterY;
        let distance = Math.hypot(dx, dy);

        if (post.id === initialPostId && rect.top < containerRect.top + 24) {
          distance *= 1.08;
        }

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestPostId = post.id;
        }
      });

      const currentActiveId = activeViewportIdRef.current;
      const currentNode = currentActiveId ? cardRefs.current[currentActiveId] : null;

      if (!currentActiveId || !currentNode || currentActiveId === nearestPostId) {
        setActiveViewportId((current) => (current === nearestPostId ? current : nearestPostId));
        return;
      }

      const currentRect = currentNode.getBoundingClientRect();
      const currentCenterX = currentRect.left + currentRect.width * 0.5;
      const currentCenterY = currentRect.top + currentRect.height * 0.5;
      const currentDx = (currentCenterX - viewportCenterX) * 0.88;
      const currentDy = currentCenterY - viewportCenterY;
      const currentDistance = Math.hypot(currentDx, currentDy);
      const shouldSwitch =
        currentDistance > containerRect.height * 0.46 ||
        nearestDistance < currentDistance * 0.82 ||
        Math.abs(currentDistance - nearestDistance) > 84;

      if (shouldSwitch) {
        setActiveViewportId((current) => (current === nearestPostId ? current : nearestPostId));
      }
    });
  }, [initialPostId, posts, scrollRef]);

  const updateCardMotion = useCallback(() => {
    if (prefersReducedMotion) return;

    const container = scrollRef.current;
    if (!container) return;

    const now = performance.now();
    const scrollTop = container.scrollTop;
    const deltaScroll = scrollTop - lastScrollTopRef.current;
    const deltaTime = Math.max(16, now - lastScrollTimeRef.current || 16);
    const velocity = deltaScroll / deltaTime;
    const impulse = Math.max(-18, Math.min(18, velocity * 88));
    const containerRect = container.getBoundingClientRect();
    const centerX = containerRect.left + containerRect.width * 0.5;

    lastScrollTopRef.current = scrollTop;
    lastScrollTimeRef.current = now;

    if (Math.abs(impulse) < 0.35) {
      return;
    }

    const nextMotion: Record<string, CardMotionState> = {};

    posts.forEach((post) => {
      if (post.id === initialPostId) return;

      const node = cardRefs.current[post.id];
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const isVisible = rect.bottom > containerRect.top - 40 && rect.top < containerRect.bottom + 40;
      if (!isVisible) return;

      const xFactor = Math.max(-1, Math.min(1, (rect.left + rect.width * 0.5 - centerX) / Math.max(1, containerRect.width * 0.42)));
      nextMotion[post.id] = {
        x: Math.max(-12, Math.min(12, xFactor * Math.abs(impulse) * 0.58)),
        y: Math.max(-18, Math.min(18, -impulse * (0.72 + Math.abs(xFactor) * 0.1))),
        rotate: Math.max(-3.2, Math.min(3.2, xFactor * impulse * 0.22)),
      };
    });

    setCardMotionById(nextMotion);

    if (settleTimerRef.current !== null) {
      window.clearTimeout(settleTimerRef.current);
    }

    settleTimerRef.current = window.setTimeout(() => {
      setCardMotionById({});
      settleTimerRef.current = null;
    }, RESET_BUMP_AFTER_MS);
  }, [initialPostId, posts, prefersReducedMotion, scrollRef]);

  useEffect(() => {
    runMeasurement();
  }, [runMeasurement, railCollapsed]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    lastScrollTopRef.current = container.scrollTop;
    lastScrollTimeRef.current = performance.now();

    const handleScroll = () => {
      runMeasurement();
      updateCardMotion();
    };
    const handleResize = () => runMeasurement();

    container.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    runMeasurement();

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (measureFrameRef.current !== null) {
        window.cancelAnimationFrame(measureFrameRef.current);
      }
      if (settleTimerRef.current !== null) {
        window.clearTimeout(settleTimerRef.current);
      }
    };
  }, [runMeasurement, scrollRef, updateCardMotion]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpandedId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const effectiveExpandedId = expandedId;
  const sidebarExpandedId = expandedId ?? initialPostId;
  const sidebarFocusedIds = hoveredId ? [hoveredId] : activeViewportId ? [activeViewportId] : initialPostId ? [initialPostId] : [];

  const activePostId = useMemo(
    () =>
      resolveActiveBlogPostId({
        activeViewportId,
        hoveredId,
        expandedId: effectiveExpandedId,
        fallbackId: initialPostId,
      }),
    [activeViewportId, effectiveExpandedId, hoveredId, initialPostId],
  );

  const setCardRef = useCallback(
    (postId: string) => (node: HTMLDivElement | null) => {
      cardRefs.current[postId] = node;
    },
    [],
  );

  const handleToggleExpand = useCallback((postId: string) => {
    if (postId === initialPostId) return;
    setExpandedId((current) => (current === postId ? null : postId));
  }, [initialPostId]);

  const handleHoverStart = useCallback(
    (postId: string) => {
      if (isTouch || postId === initialPostId) return;
      setHoveredId(postId);
    },
    [initialPostId, isTouch],
  );

  const handleHoverEnd = useCallback(
    (postId: string) => {
      if (isTouch || postId === initialPostId) return;
      setHoveredId((current) => (current === postId ? null : current));
    },
    [initialPostId, isTouch],
  );

  const handleFocusStart = useCallback((postId: string) => {
    if (postId === initialPostId) return;
    setHoveredId(postId);
  }, [initialPostId]);

  const handleFocusEnd = useCallback((postId: string) => {
    if (postId === initialPostId) return;
    setHoveredId((current) => (current === postId ? null : current));
  }, [initialPostId]);

  const scrollToPost = useCallback(
    (postId: string) => {
      const container = scrollRef.current;
      const node = cardRefs.current[postId];
      if (!container || !node) return;

      const containerRect = container.getBoundingClientRect();
      const nodeRect = node.getBoundingClientRect();
      const targetTop = nodeRect.top - containerRect.top + container.scrollTop - container.clientHeight * 0.14;

      container.scrollTo({
        top: Math.max(0, targetTop),
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    },
    [prefersReducedMotion, scrollRef],
  );

  const handleSelectPost = useCallback(
    (postId: string) => {
      scrollToPost(postId);
      setExpandedId(postId === initialPostId ? null : postId);
      setHoveredId(null);
      setRailCollapsed(false);
    },
    [initialPostId, scrollToPost],
  );

  const handleOpenArticle = useCallback(
    (slug: string) => {
      onNavigate(getBlogPostPath(slug), {
        color: BLOG_ROUTE_COLOR,
        direction: "down",
        intensity: "lite",
        duration: 640,
      });
    },
    [onNavigate],
  );

  if (posts.length === 0) {
    return (
      <section className="theme-text-primary relative mx-auto w-full max-w-5xl px-6 pb-24 pt-28">
        <header className="max-w-3xl">
          <p className="theme-text-subtle text-xs uppercase tracking-[0.24em]">{pageContent.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">{pageContent.title}</h1>
          <p className="theme-text-muted mt-5 text-[15px] leading-relaxed">{pageContent.summary}</p>
        </header>
        <div className="blog-empty-state mt-12 rounded-[2rem] border px-6 py-10">
          <p className="text-sm uppercase tracking-[0.18em]">Archive Pending</p>
          <p className="theme-text-muted mt-4 max-w-2xl text-base leading-relaxed">{pageContent.emptyLabel}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="theme-text-primary relative isolate w-full px-4 pb-24 pt-24 xs:px-6 sm:px-10 lg:px-12">
      <div className="blog-collage-halo pointer-events-none absolute inset-x-0 top-0 h-[40rem]" />

      <div className="relative mx-auto w-full max-w-[96rem]">
        <header className="max-w-4xl">
          <p className="theme-text-subtle text-xs uppercase tracking-[0.28em]">{pageContent.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">{pageContent.title}</h1>
          <p className="theme-text-muted mt-5 max-w-3xl text-[15px] leading-relaxed sm:text-lg">{pageContent.summary}</p>
        </header>

        <div className="mt-8 relative">
          <div className="lg:hidden">
          <BlogChronologyRail
            posts={posts}
            activePostId={activePostId}
            focusedPostIds={sidebarFocusedIds}
            expandedPostId={sidebarExpandedId}
            mode="horizontal"
            onSelectPost={handleSelectPost}
            collapsed={railCollapsed}
            onCollapsedChange={setRailCollapsed}
          />
          </div>

          <div className="blog-collage-grid mt-6 lg:mt-0">
            {posts.map((post, index) => {
              const isHero = index === 0;
              const detailLevel = isHero
                ? "expanded"
                : resolveBlogCardDetailLevel({
                    postId: post.id,
                    expandedId: effectiveExpandedId,
                  });
              const isExpandedTile = !isHero && effectiveExpandedId === post.id;
              const motionState = isHero ? zeroMotion : cardMotionById[post.id] ?? zeroMotion;
              const isHovered = !isHero && hoveredId === post.id;

              return (
                <motion.div
                  key={post.id}
                  ref={setCardRef(post.id)}
                  layout
                  animate={{
                    x: motionState.x,
                    y: motionState.y,
                    rotateZ: motionState.rotate,
                  }}
                  className={`blog-grid-cell ${isHero ? "is-hero" : ""} ${isExpandedTile ? "is-expanded" : ""} ${
                    isHovered ? "is-hovered" : ""
                  }`}
                  transition={{
                    layout: { type: "spring", stiffness: 210, damping: 28, mass: 0.92 },
                    x: { type: "spring", stiffness: 240, damping: 18, mass: 0.72 },
                    y: { type: "spring", stiffness: 240, damping: 18, mass: 0.76 },
                    rotateZ: { type: "spring", stiffness: 200, damping: 18, mass: 0.68 },
                  }}
                >
                  <BlogPostCard
                    post={post}
                    detailLevel={detailLevel}
                    layoutIndex={index}
                    isHero={isHero}
                    isHovered={isHovered}
                    motionVector={motionState}
                    onHoverStart={handleHoverStart}
                    onHoverEnd={handleHoverEnd}
                    onFocusStart={handleFocusStart}
                    onFocusEnd={handleFocusEnd}
                    onToggleExpand={handleToggleExpand}
                    onOpenArticle={handleOpenArticle}
                  />
                </motion.div>
              );
            })}
          </div>

          <div className="hidden lg:block fixed right-4 top-36 z-40 w-[min(24rem,calc(100vw-2rem))]">
          <BlogChronologyRail
            posts={posts}
            activePostId={activePostId}
            focusedPostIds={sidebarFocusedIds}
            expandedPostId={sidebarExpandedId}
            mode="vertical"
            onSelectPost={handleSelectPost}
            collapsed={railCollapsed}
            onCollapsedChange={setRailCollapsed}
          />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogCollage;
