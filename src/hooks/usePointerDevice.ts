import { useEffect, useState } from "react";

export type PointerDevice = "coarse" | "fine";

/**
 * Reactively detects whether the primary pointer is coarse (touch)
 * or fine (mouse / trackpad / pen).
 *
 * Re-evaluates when the media query changes (e.g. detachable keyboard on
 * a tablet), so desktop users always keep mouse behaviour and mobile
 * users get touch-optimised treatment.
 */
export function usePointerDevice(): PointerDevice {
  const [device, setDevice] = useState<PointerDevice>(() => {
    if (typeof window === "undefined") return "fine";
    return window.matchMedia("(pointer: coarse)").matches ? "coarse" : "fine";
  });

  useEffect(() => {
    const mql = window.matchMedia("(pointer: coarse)");

    const onChange = (e: MediaQueryListEvent) => {
      setDevice(e.matches ? "coarse" : "fine");
    };

    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return device;
}

/**
 * Returns true when the current primary pointer is coarse (touch).
 * Convenience wrapper around usePointerDevice().
 */
export function useIsTouch(): boolean {
  return usePointerDevice() === "coarse";
}
