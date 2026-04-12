import React, { RefObject, useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutGroup,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import type { BlogPageContent, BlogPostEntry } from "../../content";
import { getBlogPostPath } from "../../content";
import { WipeOptions } from "../Transitions/TransitionWipe";
import ResearchArchiveField from "./ResearchArchiveField";
import ResearchArticleView from "./ResearchArticleView";
import ResearchHeroStage from "./ResearchHeroStage";
import { getResearchThemeStyle } from "./researchVisuals";

interface ResearchBlogExperienceProps {
  posts: BlogPostEntry[];
  pageContent: BlogPageContent;
  articleSlug?: string;
  scrollRef: RefObject<HTMLDivElement>;
  onNavigate: (path: string, opts?: WipeOptions) => void;
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const ResearchBlogExperienceInner: React.FC<ResearchBlogExperienceProps> = ({
  posts,
  pageContent,
  articleSlug,
  scrollRef,
  onNavigate,
}) => {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const featuredPost = posts.find((post) => post.featured) ?? posts[0] ?? null;
  const articlePost = articleSlug ? posts.find((post) => post.slug === articleSlug) ?? null : null;
  const previousArticleSlugRef = useRef<string | undefined>(articleSlug);
  const savedArchiveScrollTopRef = useRef(0);
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroRangeRef = useRef(1);
  const heroDominantRef = useRef(true);
  const fallbackProgress = useMotionValue(articlePost ? 1 : 0);
  const { scrollY } = useScroll({ container: scrollRef });
  const heroProgressBase = useTransform(scrollY, (value) => clamp(value / Math.max(heroRangeRef.current, 1)));
  const sprungHeroProgress = useSpring(heroProgressBase, { stiffness: 180, damping: 28, mass: 0.7 });
  const heroProgress = articlePost ? fallbackProgress : sprungHeroProgress;
  const [heroDominant, setHeroDominant] = useState(true);

  useEffect(() => {
    const updateHeroRange = () => {
      const section = heroSectionRef.current;
      const container = scrollRef.current;
      if (!section || !container) return;

      heroRangeRef.current = Math.max(section.offsetHeight - container.clientHeight * 0.82, container.clientHeight * 0.44);
    };

    updateHeroRange();

    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateHeroRange) : null;
    if (resizeObserver) {
      if (heroSectionRef.current) resizeObserver.observe(heroSectionRef.current);
      if (scrollRef.current) resizeObserver.observe(scrollRef.current);
    }

    window.addEventListener("resize", updateHeroRange);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateHeroRange);
    };
  }, [scrollRef]);

  useMotionValueEvent(heroProgress, "change", (latest) => {
    if (articlePost) return;
    const nextHeroDominant = latest < 0.2;

    if (heroDominantRef.current !== nextHeroDominant) {
      heroDominantRef.current = nextHeroDominant;
      setHeroDominant(nextHeroDominant);
    }
  });

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const previous = previousArticleSlugRef.current;

    if (!previous && articleSlug) {
      savedArchiveScrollTopRef.current = container.scrollTop;
      container.scrollTo({ top: 0, behavior: "auto" });
    }

    if (previous && !articleSlug) {
      requestAnimationFrame(() => {
        container.scrollTo({ top: savedArchiveScrollTopRef.current, behavior: "auto" });
      });
    }

    previousArticleSlugRef.current = articleSlug;
  }, [articleSlug, scrollRef]);

  useEffect(() => {
    fallbackProgress.set(articlePost ? 1 : 0);
  }, [articlePost, fallbackProgress]);

  const articleBackdropOpacity = useTransform(heroProgress, [0, 1], [0, 1]);

  const openArticle = (post: BlogPostEntry) => {
    onNavigate(getBlogPostPath(post.slug), {
      color: post.visualIdentity.palette.accent,
      direction: "down",
      intensity: "lite",
      duration: 420,
    });
  };

  if (!featuredPost) {
    return null;
  }

  return (
    <LayoutGroup id="research-blog-layout">
      {articlePost ? (
        <motion.div style={prefersReducedMotion ? undefined : { opacity: articleBackdropOpacity }}>
          <ResearchArticleView
            post={articlePost}
            onBack={() =>
              onNavigate("/blog", {
                color: articlePost.visualIdentity.palette.accent,
                direction: "up",
                intensity: "lite",
                duration: 420,
              })
            }
          />
        </motion.div>
      ) : articleSlug ? (
        <section className="research-empty-state" style={getResearchThemeStyle(featuredPost)}>
          <p className="research-empty-eyebrow">Article Not Found</p>
          <h1 className="research-empty-title">This research note does not exist yet.</h1>
          <p className="research-empty-copy">
            The route is valid, but there is no published article for <span>{articleSlug}</span>.
          </p>
          <button
            type="button"
            className="research-feature-cta"
            onClick={() =>
              onNavigate("/blog", {
                color: featuredPost.visualIdentity.palette.accent,
                direction: "up",
                intensity: "lite",
                duration: 420,
              })
            }
          >
            Back To Research Blog
          </button>
        </section>
      ) : (
        <>
          <ResearchHeroStage
            post={featuredPost}
            pageContent={pageContent}
            postCount={posts.length}
            progress={heroProgress}
            sectionRef={heroSectionRef}
            onOpenArticle={openArticle}
          />
          <ResearchArchiveField
            posts={posts}
            featuredPost={featuredPost}
            heroDominant={heroDominant}
            scrollRef={scrollRef}
            onOpenArticle={openArticle}
          />
        </>
      )}
    </LayoutGroup>
  );
};

const ResearchBlogExperience: React.FC<ResearchBlogExperienceProps> = (props) => {
  const [containerReady, setContainerReady] = useState(false);

  useEffect(() => {
    if (props.scrollRef?.current) {
      setContainerReady(true);
    } else {
      const interval = setInterval(() => {
        if (props.scrollRef?.current) {
          setContainerReady(true);
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [props.scrollRef]);

  if (!containerReady) {
    return <div style={{ minHeight: "100vh" }} />;
  }

  return <ResearchBlogExperienceInner {...props} />;
};

export default ResearchBlogExperience;
