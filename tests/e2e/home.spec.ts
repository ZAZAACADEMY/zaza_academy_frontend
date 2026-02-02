import { test, expect } from "@playwright/test";

test("home hero renders in English", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", /en/i);

  const heroHeading = page.getByRole("heading", {
    name: /Empowering Young Minds with Smart Financial Skills/i,
  });
  await expect(heroHeading).toBeVisible();

  // Primary CTA and secondary CTA in hero
  await expect(
    page.getByRole("button", { name: /Enroll Your Child/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /How Kids Learn/i }),
  ).toBeVisible();

  // Navbar CTA present (first occurrence inside navigation)
  const navGetStarted = page
    .getByRole("navigation")
    .getByRole("button", { name: /Get Started/i })
    .first();
  await expect(navGetStarted).toBeVisible();
});

test("language switcher toggles to French and back", async ({ page }) => {
  await page.goto("/");

  // Use text on the toggle buttons to stay stable across locales
  const switcher = page.getByRole("group", { name: /Language switcher/i });
  await switcher.getByRole("button", { name: /Switch to French/i }).click();
  await expect(page).toHaveURL(/.*\/fr/);
  await expect(page.locator("html")).toHaveAttribute("lang", /fr/i);
  await expect(
    page.getByRole("heading", {
      name: /Développer l’intelligence financière dès le/i,
    }),
  ).toBeVisible();

  const switcherFr = page.getByRole("group", {
    name: /Sélecteur de langue|Language switcher/i,
  });
  await switcherFr
    .getByRole("button", { name: /Switch to English|Passer en anglais/i })
    .click();
  await expect(page).toHaveURL(/.*\/en/);
  await expect(page.locator("html")).toHaveAttribute("lang", /en/i);
  await expect(
    page.getByRole("heading", {
      name: /Empowering Young Minds with Smart Financial Skills/i,
    }),
  ).toBeVisible();
});
