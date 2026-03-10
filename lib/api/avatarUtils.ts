/**
 * Safely handles avatar paths for next/image.
 * Always returns a relative path so Next.js Image Optimization works regardless
 * of which origin the URL was originally stored from.
 */
export const getAvatarPath = (avatarStr?: string | null): string => {
  if (!avatarStr) return "/avatars/A1.jpeg";

  // If it's just an index (for backward compatibility or draft state)
  const index = parseInt(avatarStr);
  if (!isNaN(index) && index >= 0 && index < 10 && !avatarStr.includes("/")) {
    return `/avatars/A${index + 1}.jpeg`;
  }

  // If it's an absolute URL (any origin), extract just the pathname
  try {
    const url = new URL(avatarStr);
    return url.pathname;
  } catch {
    // Not a valid absolute URL — already a relative path
    return avatarStr;
  }
};
