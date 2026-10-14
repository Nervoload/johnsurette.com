import { RefObject, useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface LivingMountOptions {
  slotRef: RefObject<HTMLElement>;
  scrollRootRef?: RefObject<HTMLElement>;
  /** Unmount (free the GL context) when far away for a while. Desktop keeps the scene mounted. */
  allowUnmount: boolean;
}

/**
 * Three zones around the slot, measured against the page's scroll container:
 * - within 150% of a viewport: load the chunk and mount the canvas (it warms up offscreen);
 * - within 10%: run frames;
 * - beyond 300% for 4 s (low tier / handheld only): unmount.
 * Frames also stop while the tab is hidden.
 */
export const useLivingMount = ({ slotRef, scrollRootRef, allowUnmount }: LivingMountOptions) => {
  // framer reads root.current inside its effect, after refs are attached, so pass the ref itself.
  const root = scrollRootRef as RefObject<Element> | undefined;
  const near = useInView(slotRef, { root, margin: "150% 0px 150% 0px", amount: "some" });
  const running = useInView(slotRef, { root, margin: "10% 0px 10% 0px", amount: "some" });
  const withinRange = useInView(slotRef, { root, margin: "300% 0px 300% 0px", amount: "some" });
  const [mounted, setMounted] = useState(false);
  const unmountTimer = useRef<number | null>(null);

  useEffect(() => {
    if (near) setMounted(true);
  }, [near]);

  useEffect(() => {
    if (unmountTimer.current !== null) {
      window.clearTimeout(unmountTimer.current);
      unmountTimer.current = null;
    }
    if (!allowUnmount || withinRange) return;
    unmountTimer.current = window.setTimeout(() => setMounted(false), 4000);
    return () => {
      if (unmountTimer.current !== null) window.clearTimeout(unmountTimer.current);
    };
  }, [allowUnmount, withinRange]);

  const visible = usePageVisible();
  return { mounted, running: mounted && running && visible };
};

const usePageVisible = () => {
  const [visible, setVisible] = useState(() => typeof document === "undefined" || document.visibilityState !== "hidden");
  useEffect(() => {
    const update = () => setVisible(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  return visible;
};
