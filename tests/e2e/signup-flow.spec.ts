import { test, expect } from "@playwright/test";

const fillStep1 = async (page: import("@playwright/test").Page) => {
  await page.getByLabel("First Name").fill("John");
  await page.getByLabel("Last Name").fill("Doe");
  await page.getByLabel("Email Address").fill("john.doe@example.com");

  const countryInput = page.getByLabel("Country");
  await countryInput.click();
  await countryInput.fill("France");
  const franceOption = page
    .getByRole("option", { name: "France", exact: true })
    .first();
  await franceOption.waitFor({ state: "visible" });
  await franceOption.click();

  await page.getByLabel("Password", { exact: true }).fill("Password1");
  await page.getByLabel("Confirm Password", { exact: true }).fill("Password1");

  await page.getByRole("button", { name: "Next Step" }).click({ force: true });
};

test("signup flow reaches child profile with mobile money", async ({
  page,
}) => {
  await page.goto("/en/signup");

  // Step 1: Account
  await expect(
    page.getByRole("heading", { name: "Create Account" }),
  ).toBeVisible();
  await fillStep1(page);

  // Step 2: Plan selection (defaults to Family) and continue
  await expect(
    page.getByRole("heading", { name: "Choose Plan" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Next Step" }).click({ force: true });

  // Step 3: Billing cycle
  await expect(
    page.getByRole("heading", { name: "Billing Cycle" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Next Step" }).click({ force: true });

  // Step 4: Review
  await expect(
    page.getByRole("heading", { name: "Review Order" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Confirm & Pay" })
    .click({ force: true });

  // Step 5: Switch to Mobile Money and set provider/phone
  await expect(
    page.getByRole("heading", { name: "Payment Details" }),
  ).toBeVisible();
  await page.getByText("Mobile Money", { exact: true }).click({ force: true });
  await expect(page.getByText("Network Provider")).toBeVisible();

  // Pick the first visible provider chip (defaults to MTN for Benin)
  await page
    .getByRole("button", { name: /^MTN$/ })
    .first()
    .click({ force: true });

  const phoneInput = page.getByPlaceholder(/\+\d+/).first();
  await phoneInput.fill("+22990000000");

  await page.getByRole("button", { name: "Pay Now" }).click({ force: true });

  // Step 6 -> Step 7 (auto after 3s)
  await expect(page.getByText("Processing Payment")).toBeVisible();
  await page.getByText("You're all set!").waitFor({ timeout: 30_000 });
  await page
    .getByRole("button", { name: "Setup Child Profile" })
    .click({ force: true });

  // Step 8: Child profile
  await expect(page.getByText(/3 left/)).toBeVisible();
  await page.getByPlaceholder("Name").fill("Kid One");
  await page.getByPlaceholder("Age").fill("8");
  await page
    .getByRole("button", { name: "Save Profile" })
    .click({ force: true });

  // Step 9: Summary and adding another child reduces remaining slots
  await expect(page.getByText("Kid One")).toBeVisible();
  await page
    .getByRole("button", { name: "Add Another Child" })
    .click({ force: true });
  await expect(page.getByText(/2 left/)).toBeVisible();
});
