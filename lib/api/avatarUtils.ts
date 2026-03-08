/**
 * Safely handles avatar paths for next/image.
 * If the URL is absolute and matches the current origin, it converts it to a relative path
 * to avoid Next.js Image Optimization "url parameter is not allowed" errors.
 */
export const getAvatarPath = (avatarStr?: string | null): string => {
  if (!avatarStr) return "/avatars/A1.jpeg";

  // If it's just an index (for backward compatibility or draft state)
  const index = parseInt(avatarStr);
  if (!isNaN(index) && index >= 0 && index < 10 && !avatarStr.includes("/")) {
    return `/avatars/A${index + 1}.jpeg`;
  }

  // If we are on the client side, try to make local URLs relative
  if (typeof window !== "undefined") {
    try {
      const url = new URL(avatarStr);
      if (url.origin === window.location.origin) {
        return url.pathname;
      }
    } catch (e) {
      // Not a valid absolute URL, probably already relative
      return avatarStr;
    }
  }

  return avatarStr;
};
