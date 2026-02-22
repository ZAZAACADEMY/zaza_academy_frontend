import createMiddleware from "next-intl/middleware";
import { routing } from "./navigation";

// This middleware only handles internationalization now.
// Authentication is managed on the client-side.
export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(fr|en)/:path*"],
};
