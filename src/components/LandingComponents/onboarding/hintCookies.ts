const LANDING_ONBOARDING_COOKIE = "landing_onboarding_seen";
const LANDING_ONBOARDING_MAX_AGE_SECONDS = 15552000; // 180 days

const readCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  const encodedName = `${encodeURIComponent(name)}=`;
  const chunks = document.cookie.split(";");

  for (let index = 0; index < chunks.length; index++) {
    const chunk = chunks[index].trim();
    if (!chunk.startsWith(encodedName)) continue;
    return decodeURIComponent(chunk.slice(encodedName.length));
  }

  return null;
};

export const hasLandingOnboardingSeenCookie = (): boolean => {
  return readCookie(LANDING_ONBOARDING_COOKIE) === "1";
};

export const markLandingOnboardingSeenCookie = (): void => {
  if (typeof document === "undefined") return;

  document.cookie = `${encodeURIComponent(LANDING_ONBOARDING_COOKIE)}=1; Path=/; SameSite=Lax; Max-Age=${LANDING_ONBOARDING_MAX_AGE_SECONDS}`;
};

