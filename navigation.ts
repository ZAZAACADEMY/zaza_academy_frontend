import {createNavigation} from 'next-intl/navigation';
import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'fr',
  localeDetection: false, // Géré manuellement dans le middleware
});

export const {Link, redirect, usePathname, useRouter} =
  createNavigation(routing);