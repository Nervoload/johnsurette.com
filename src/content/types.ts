import { CenterpieceId } from "../components/LandingComponents/centerpieces/centerpieceRegistry";
import {
  BackgroundEffectId,
  BackgroundInteractionMode,
  BackgroundQualityPreset,
} from "../components/LandingComponents/backgroundEffects/types";

export interface SiteLink {
  label: string;
  href: string;
}

export interface SiteMeta {
  ownerName: string;
  ownerEmail: string;
  footerTagline: string;
  socialLinks: SiteLink[];
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  color: string;
  description: string;
  navVisible?: boolean;
  routeEnabled?: boolean;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface CardPalette {
  deep: string;
  mid: string;
  bright: string;
  line: string;
}

export type ProjectCardStatus = "Active" | "In Progress" | "Paused" | "Archived";

export type ProjectCardFrontFamily = "atlas" | "signal" | "forge" | "lattice";

export type ProjectCardPopoutPreset =
  | "orbitalCore"
  | "dataSpines"
  | "nodeConstellation"
  | "ribbonArc"
  | "pillarArray";

export interface ProjectCardFrontSpec {
  dateLabel?: string;
  status?: ProjectCardStatus;
  iconSvg?: string;
  frontFamily: ProjectCardFrontFamily;
  popoutPreset: ProjectCardPopoutPreset;
  popoutIntensity?: number;
}

export interface ProjectEntry {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  details: string;
  tags: string[];
  accent: string;
  palette: CardPalette;
  media: string[];
  links: ProjectLink[];
  front: ProjectCardFrontSpec;
}

export interface ProjectsPageContent {
  eyebrow: string;
  title: string;
  summary: string;
}

export type StorySectionId =
  | "personal-introduction"
  | "computational-systems"
  | "biology-intelligence"
  | "aspiration-journey";

export type StoryTransitionKind =
  | "cell-split"
  | "ring-mesh"
  | "synapse-grid"
  | "grid-ascend";

export interface LandingStoryEntry {
  id: StorySectionId;
  eyebrow: string;
  title: string;
  summary: string;
  focusAreas: string[];
  accent: string;
  glow: string;
  deep: string;
}

export interface LandingOriginLabContent {
  eyebrow: string;
  title: string;
  summary: string;
  ctaLabel: string;
  ctaPath: string;
  isVisible?: boolean;
}

export interface LandingHeroIdentityContent {
  kicker: string;
  firstName: string;
  lastName: string;
  domainSuffix: string;
}

export interface LandingSectionLink {
  label: string;
  path: string;
}

export interface LandingPhotoPlaceholder {
  id: string;
  alt: string;
  caption: string;
  palette: [string, string, string];
}

export interface LandingPersonalIntroductionContent {
  title: string;
  subtitle: string;
  body: string[];
  photos: LandingPhotoPlaceholder[];
}

export interface LandingComputationalSectionContent {
  title: string;
  quote: string;
  body: string;
  cta: LandingSectionLink;
}

export interface LandingBiologySectionContent {
  overlayTitle: string;
  overlayBody: string;
  body: string;
  cta: LandingSectionLink;
}

export type LandingAspirationLane = "left" | "center" | "right";
export type LandingAspirationEdgeWeight = "trunk" | "branch" | "thread";

export interface LandingAspirationNode {
  id: string;
  label: string;
  stage: number;
  lane: LandingAspirationLane;
}

export interface LandingAspirationEdge {
  from: string;
  to: string;
  weight: LandingAspirationEdgeWeight;
  faded?: boolean;
}

export interface LandingAspirationSectionContent {
  title: string;
  body: string;
  footerTitle: string;
  footerBody: string;
  nodes: LandingAspirationNode[];
  edges: LandingAspirationEdge[];
}

export interface LandingConclusionContent {
  eyebrow: string;
  title: string;
  summary: string;
  highlightedProjectsLabel: string;
  highlightedPostsLabel: string;
  routePillsLabel: string;
}

export interface TimelineAction {
  label: string;
  path: string;
}

export interface TimelineDetail {
  kicker: string;
  body: string;
  studioNote: string;
  assetLabel: string;
  assetGradient: string;
}

export interface TimelineEntry {
  id: string;
  year: string;
  title: string;
  summary: string;
  foreground: string;
  midground: string;
  background: string;
  detail: TimelineDetail;
  nowActions: TimelineAction[];
}

export interface AboutPageContent {
  eyebrow: string;
  title: string;
  summary: string;
  highlights: string[];
}

export type BlogPostStatus = "draft" | "published";

export interface BlogPostEntry {
  id: string;
  slug: string;
  title: string;
  tag: string;
  summary: string;
  dateLabel: string;
  publishedAt: string;
  status: BlogPostStatus;
  featured?: boolean;
}

export interface BlogPageContent {
  eyebrow: string;
  title: string;
  summary: string;
  emptyLabel: string;
}

export interface SocialPostGithubConfig {
  username: string;
  profileUrl: string;
}

export interface SocialFeedEntry {
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

export interface ContactPageContent {
  eyebrow: string;
  title: string;
  summary: string;
  contactLabel: string;
  phoneNumber: string;
  copyButtonLabel: string;
  copySuccessLabel: string;
  copyErrorLabel: string;
  contactDescription: string;
  availabilityEyebrow: string;
  availabilityTitle: string;
  availabilitySummary: string;
  responseWindowLabel: string;
  timezoneLabel: string;
  preferredContactLabel: string;
  socialFeedEyebrow: string;
  socialFeedTitle: string;
  socialFeedSummary: string;
  socialPosts: SocialFeedEntry[];
}

export interface PageVisualConfig {
  backgroundClassName?: string;
  footerBackgroundColor?: string;
  footerRunwayVh?: number;
  backdropEffectId?: BackgroundEffectId;
  backdropQuality?: BackgroundQualityPreset;
  backdropInteractionMode?: BackgroundInteractionMode;
  backdropStyleSeed?: number;
  backdropClassName?: string;
  backdropOverlayClassName?: string;
  centerpieceId?: CenterpieceId;
  dotFieldPointCount?: number;
}

export interface PageVisuals {
  landing: PageVisualConfig;
  projects: PageVisualConfig;
  about: PageVisualConfig;
  blog: PageVisualConfig;
  contact: PageVisualConfig;
}
