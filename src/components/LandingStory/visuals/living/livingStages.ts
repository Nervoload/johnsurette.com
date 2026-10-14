import { RefObject, lazy, useEffect, useState } from "react";
import { useInView } from "framer-motion";

// Each scene is its own chunk. The landing never waits on them: the code is fetched once the
// browser is idle, and a section renders its scene only when the slot is within two viewports.
export const loadForwardPassStage = () => import("./forwardPass/ForwardPassStage");
export const loadBrainScalesStage = () => import("./brainScales/BrainScalesStage");

export const ForwardPassStage = lazy(loadForwardPassStage);
export const BrainScalesStage = lazy(loadBrainScalesStage);

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

export const useDeferredLivingStage = (
  slotRef: RefObject<HTMLElement>,
  scrollRootRef: RefObject<HTMLElement> | undefined,
  load: () => Promise<unknown>,
): boolean => {
  const near = useInView(slotRef, {
    root: scrollRootRef as RefObject<Element> | undefined,
    margin: "200% 0px 200% 0px",
    amount: "some",
  });
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (near) setShow(true);
  }, [near]);

  useEffect(() => {
    let cancelled = false;
    const warm = () => {
      if (!cancelled) load().catch(() => undefined);
    };
    const idle = window as IdleWindow;
    if (idle.requestIdleCallback) {
      const handle = idle.requestIdleCallback(warm, { timeout: 8000 });
      return () => {
        cancelled = true;
        idle.cancelIdleCallback?.(handle);
      };
    }
    const timer = window.setTimeout(warm, 3000);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [load]);

  return show;
};
