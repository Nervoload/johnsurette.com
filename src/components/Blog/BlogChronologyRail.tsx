import React, { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { BlogPostEntry } from "../../content";

interface BlogChronologyRailProps {
  posts: BlogPostEntry[];
  activePostId: string | null;
  focusedPostIds?: string[];
  expandedPostId?: string | null;
  mode: "horizontal" | "vertical";
  onSelectPost: (postId: string) => void;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

const ChevronIcon: React.FC<{ collapsed: boolean }> = ({ collapsed }) => {
  const rotate = collapsed ? 180 : 0;

  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="h-3.5 w-3.5 shrink-0 self-center"
      fill="none"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <path
        d="M6 3.5L10.5 8L6 12.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const BlogChronologyRail: React.FC<BlogChronologyRailProps> = ({
  posts,
  activePostId,
  focusedPostIds = [],
  expandedPostId = null,
  mode,
  onSelectPost,
  collapsed,
  defaultCollapsed = true,
  onCollapsedChange,
}) => {
  const isVertical = mode === "vertical";
  const contentId = useId();
  const isControlled = collapsed !== undefined;
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const isCollapsed = isControlled ? collapsed : internalCollapsed;
  const expandedRailHeight = "min(34rem, calc(100vh - 9rem))";
  const collapsedRailHeight = "4.5rem";

  useEffect(() => {
    if (isControlled) return;
    setInternalCollapsed(defaultCollapsed);
  }, [defaultCollapsed, isControlled]);

  useEffect(() => {
    if (isCollapsed) return;

    const viewport = viewportRef.current;
    const activeNode = activePostId ? itemRefs.current[activePostId] : null;
    if (!viewport || !activeNode) return;

    const syncActiveItem = () => {
      const itemTop = activeNode.offsetTop;
      const itemLeft = activeNode.offsetLeft;
      const itemWidth = activeNode.offsetWidth;
      const itemHeight = activeNode.offsetHeight;

      if (isVertical) {
        const targetTop = Math.max(0, itemTop - viewport.clientHeight * 0.38 + itemHeight * 0.5);
        const maxScrollTop = Math.max(0, viewport.scrollHeight - viewport.clientHeight);
        const nextScrollTop = Math.min(maxScrollTop, targetTop);

        if (Math.abs(viewport.scrollTop - nextScrollTop) > 2) {
          viewport.scrollTo({ top: nextScrollTop, behavior: "auto" });
        }
        return;
      }

      const targetLeft = Math.max(0, itemLeft - viewport.clientWidth * 0.36 + itemWidth * 0.5);
      const maxScrollLeft = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      const nextScrollLeft = Math.min(maxScrollLeft, targetLeft);

      if (Math.abs(viewport.scrollLeft - nextScrollLeft) > 2) {
        viewport.scrollTo({ left: nextScrollLeft, behavior: "auto" });
      }
    };

    const frame = window.requestAnimationFrame(syncActiveItem);
    return () => window.cancelAnimationFrame(frame);
  }, [activePostId, isCollapsed, isVertical]);

  const setCollapsed = (next: boolean) => {
    if (!isControlled) {
      setInternalCollapsed(next);
    }
    onCollapsedChange?.(next);
  };

  const toggleCollapsed = () => setCollapsed(!isCollapsed);

  const itemBaseClass =
    "blog-chronology-item group flex w-full items-start gap-3 px-3 py-3 text-left transition duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70";
  const itemFocusedClass =
    "is-focused ml-[-0.35rem] translate-x-[0.08rem] px-4 py-4 text-[1.02rem] font-semibold shadow-[0_14px_32px_-26px_rgba(15,23,42,0.32)]";
  const itemExpandedClass =
    "is-expanded ml-[-0.56rem] translate-x-[0.16rem] px-4 py-4 text-[1.08rem] font-semibold shadow-[0_18px_50px_-34px_rgba(15,23,42,0.45)]";
  const itemIdleClass = "text-[0.92rem] font-medium";
  const metaClass = "text-[0.68rem] uppercase tracking-[0.18em]";
  const titleBaseClass = "blog-chronology-title block leading-tight transition duration-300";
  const titleFocusedClass = "text-[1.03rem] tracking-[-0.01em]";
  const titleExpandedClass = "text-[1.08rem] tracking-[-0.012em]";
  const titleIdleClass = "text-[0.96rem]";
  const listClass = isVertical ? "flex flex-col gap-2" : "flex gap-2 overflow-x-auto pb-1";
  const railShellClass = isCollapsed
    ? "blog-chronology-rail flex w-full flex-col items-stretch gap-2 overflow-hidden rounded-[1.75rem] p-2"
    : "blog-chronology-rail flex min-h-0 w-full flex-col items-stretch overflow-hidden rounded-[1.75rem] p-3";
  const buttonShellClass = isCollapsed
    ? "blog-chronology-toggle flex w-full items-center justify-between gap-3 rounded-[0.9rem] px-3 py-2.5 text-left text-[0.8rem] font-semibold uppercase leading-none tracking-[0.2em] transition"
    : "blog-chronology-toggle flex w-full items-center justify-between gap-3 rounded-[0.9rem] px-1 py-1 text-left text-[0.75rem] font-semibold uppercase leading-none tracking-[0.2em] transition";
  const shellStyle = {
    background: "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, var(--theme-blog-rail-bg) 16%, var(--theme-blog-rail-bg) 100%)",
    color: "var(--theme-text-primary)",
    boxShadow: "var(--theme-surface-shadow)",
    backdropFilter: "blur(22px) saturate(135%)",
    border: "0",
    height: isVertical ? (isCollapsed ? collapsedRailHeight : expandedRailHeight) : undefined,
    transition: isVertical ? "height 240ms cubic-bezier(0.22, 1, 0.36, 1)" : undefined,
    willChange: isVertical ? "height" : undefined,
  } as React.CSSProperties;
  const buttonStyle = {
    background: "transparent",
    color: "var(--theme-text-primary)",
    border: "0",
    boxShadow: "none",
  } as React.CSSProperties;
  const itemStyle = {
    background: "transparent",
    color: "var(--theme-text-primary)",
    border: "0",
    boxShadow: "none",
  } as React.CSSProperties;
  const focusedItemStyle = {
    background: "transparent",
    color: "var(--theme-text-primary)",
    border: "0",
    boxShadow: "none",
  } as React.CSSProperties;
  const expandedItemStyle = {
    background: "transparent",
    color: "var(--theme-text-primary)",
    border: "0",
    boxShadow: "none",
  } as React.CSSProperties;
  const metaStyle = { color: "var(--theme-text-subtle)" } as React.CSSProperties;
  const titleIdleStyle = { color: "var(--theme-text-primary)" } as React.CSSProperties;
  const titleFocusedStyle = { color: "var(--theme-text-primary)" } as React.CSSProperties;
  const titleExpandedStyle = { color: "var(--theme-text-primary)" } as React.CSSProperties;

  return (
    <nav aria-label="Research blog chronology" className={railShellClass} style={shellStyle}>
      <button
        type="button"
        aria-expanded={!isCollapsed}
        aria-controls={contentId}
        onClick={toggleCollapsed}
        className={buttonShellClass}
        style={buttonStyle}
      >
        <span className="inline-flex items-center gap-2 leading-none">
          <span className="text-[0.78rem] leading-none tracking-[0.18em]">All Articles</span>
        </span>
        <ChevronIcon collapsed={isCollapsed} />
      </button>

      <motion.div
        id={contentId}
        ref={viewportRef}
        initial={false}
        animate={
          isCollapsed
            ? {
                opacity: 0,
                y: -6,
                pointerEvents: "none",
              }
            : {
                opacity: 1,
                y: 0,
                pointerEvents: "auto",
              }
        }
        transition={{
          opacity: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
          y: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
        }}
        className={`${isVertical ? (isCollapsed ? "min-h-0 overflow-hidden pr-1" : "min-h-0 flex-1 overflow-hidden pr-1") : "overflow-hidden"} blog-chronology-scroll-viewport`}
        style={
          isVertical
            ? { overflowY: isCollapsed ? "hidden" : "auto", overscrollBehavior: "contain" }
            : { overflow: "hidden" }
        }
      >
        <div className={listClass}>
          {posts.map((post, index) => {
            const isActive = post.id === activePostId;
            const isFocused = focusedPostIds.includes(post.id);
            const isExpanded = post.id === expandedPostId;
            const itemClass = isExpanded ? itemExpandedClass : isFocused ? itemFocusedClass : itemIdleClass;
            const titleClass = isExpanded ? titleExpandedClass : isFocused ? titleFocusedClass : titleIdleClass;
            const itemRenderStyle = isExpanded ? expandedItemStyle : isFocused ? focusedItemStyle : itemStyle;
            const titleRenderStyle = isExpanded ? titleExpandedStyle : isFocused ? titleFocusedStyle : titleIdleStyle;

            return (
              <motion.button
                key={post.id}
                type="button"
                layout
                ref={(node) => {
                  itemRefs.current[post.id] = node;
                }}
                onClick={() => onSelectPost(post.id)}
                className={`${itemBaseClass} ${isVertical ? "w-full" : "min-w-[15rem] shrink-0"} ${itemClass}`}
                style={itemRenderStyle}
                aria-current={isActive ? "true" : undefined}
                transition={{ type: "spring", stiffness: 280, damping: 30 }}
              >
                <span
                  className="blog-chronology-index mt-[0.12rem] shrink-0 text-[0.72rem] font-semibold uppercase tracking-[0.18em]"
                  style={isExpanded || isFocused ? titleFocusedStyle : metaStyle}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`${titleBaseClass} ${titleClass}`} style={titleRenderStyle}>
                    {post.title}
                  </span>
                  <span className={`mt-1 block ${metaClass}`} style={metaStyle}>
                    {post.dateLabel}
                    <span aria-hidden="true"> / </span>
                    {post.tag}
                  </span>
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </nav>
  );
};

export default BlogChronologyRail;
