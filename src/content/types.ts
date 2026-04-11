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

export interface ProjectMetric {
  label: string;
  value: string;
  detail: string;
}

export interface ProjectHeroContent {
  eyebrow: string;
  thesis: string;
  summary: string;
  artifactLabel: string;
  surfaceLabel: string;
  media: string;
}

export interface ProjectChapter {
  id: string;
  eyebrow: string;
  title: string;
  body: string[];
  aside?: string;
}

export interface ProjectGalleryAsset {
  id: string;
  src: string;
  alt: string;
}

export interface ProjectCaption {
  assetId: string;
  title: string;
  body: string;
}

export interface ProjectOutcome {
  label: string;
  value: string;
  detail: string;
}

export interface ProjectCredit {
  label: string;
  value: string;
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
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  details: string;
  role: string;
  year: string;
  tags: string[];
  accent: string;
  palette: CardPalette;
  media: string[];
  links: ProjectLink[];
  front: ProjectCardFrontSpec;
  hero: ProjectHeroContent;
  metrics: ProjectMetric[];
  chapters: ProjectChapter[];
  gallery: ProjectGalleryAsset[];
  captions: ProjectCaption[];
  outcomes: ProjectOutcome[];
  credits: ProjectCredit[];
  nextProject?: string;
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

export interface LandingStoryPoster {
  src: string;
  alt: string;
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
  poster: LandingStoryPoster;
}

export interface LandingBiologySectionContent {
  overlayTitle: string;
  overlayBody: string;
  body: string;
  cta: LandingSectionLink;
  poster: LandingStoryPoster;
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

export type LandingAspirationOverlayBeatId =
  | "root"
  | "between-root-and-majors"
  | "stage-two-experiences"
  | "graduation";

export interface LandingAspirationOverlayBeat {
  id: LandingAspirationOverlayBeatId;
  text: string;
}

export interface LandingAspirationSectionContent {
  title: string;
  body: string;
  footerTitle: string;
  footerBody: string;
  overlayBeats: LandingAspirationOverlayBeat[];
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

export interface BlogPostCoverImage {
  src: string;
  alt: string;
}

export interface BlogArticleSection {
  id: string;
  eyebrow?: string;
  title: string;
  paragraphs: string[];
}

export type BlogVisualMaterial = "glass" | "mist" | "satin";
export type BlogVisualGrain = "none" | "soft" | "paper";
export type BlogArticleTheme = "essay" | "lab" | "field-notes";
export type BlogSceneId = "signalGrid" | "orbitalField" | "neuralBloom";

export interface BlogVisualPalette {
  background: string;
  surface: string;
  accent: string;
  highlight: string;
  text: string;
}

export interface BlogAccentLight {
  color: string;
  x: number;
  y: number;
  blur: number;
  opacity: number;
}

export interface BlogVisualIdentity {
  palette: BlogVisualPalette;
  material: BlogVisualMaterial;
  grain: BlogVisualGrain;
  accentLight: BlogAccentLight;
  articleTheme: BlogArticleTheme;
  sceneId?: BlogSceneId;
}

export interface BlogPostEntry {
  id: string;
  slug: string;
  title: string;
  tag: string;
  summary: string;
  hook: string;
  coverImage: BlogPostCoverImage;
  intro: string[];
  articleSections: BlogArticleSection[];
  dateLabel: string;
  publishedAt: string;
  status: BlogPostStatus;
  featured?: boolean;
  visualIdentity: BlogVisualIdentity;
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
