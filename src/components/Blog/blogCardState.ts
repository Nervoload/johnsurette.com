export type BlogCardDetailLevel = "lowest" | "expanded";

export interface ResolveBlogCardDetailLevelInput {
  postId: string;
  expandedId: string | null;
}

export const resolveBlogCardDetailLevel = ({
  postId,
  expandedId,
}: ResolveBlogCardDetailLevelInput): BlogCardDetailLevel => {
  if (expandedId === postId) {
    return "expanded";
  }

  return "lowest";
};

export const resolveActiveBlogPostId = ({
  activeViewportId,
  hoveredId,
  expandedId,
  fallbackId,
}: {
  activeViewportId: string | null;
  hoveredId: string | null;
  expandedId: string | null;
  fallbackId: string | null;
}): string | null => expandedId ?? hoveredId ?? activeViewportId ?? fallbackId;
