import { useEffect, useState } from "react";

const HANDHELD_USER_AGENT_RE =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i;

interface NavigatorUADataLike {
  mobile?: boolean;
}

const detectHandheldDevice = (): boolean => {
  if (typeof navigator === "undefined") {
    return false;
  }

  const nav = navigator as Navigator & { userAgentData?: NavigatorUADataLike };
  if (typeof nav.userAgentData?.mobile === "boolean") {
    return nav.userAgentData.mobile;
  }

  const platform = nav.platform ?? "";
  const userAgent = nav.userAgent ?? "";
  const maxTouchPoints = nav.maxTouchPoints ?? 0;

  // iPadOS can report itself as MacIntel while still behaving like a tablet.
  const iPadDesktopMode = platform === "MacIntel" && maxTouchPoints > 1;

  return iPadDesktopMode || HANDHELD_USER_AGENT_RE.test(userAgent);
};

/**
 * Detects handheld-class devices more strictly than touch input alone.
 * This avoids penalizing touch-capable laptops that still have desktop-class
 * performance and viewport sizes.
 */
export const useHandheldDevice = (): boolean => {
  const [handheldDevice, setHandheldDevice] = useState<boolean>(() => detectHandheldDevice());

  useEffect(() => {
    setHandheldDevice(detectHandheldDevice());
  }, []);

  return handheldDevice;
};
