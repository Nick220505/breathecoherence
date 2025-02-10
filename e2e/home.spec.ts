import { expect, test } from "@playwright/test";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page before each test
    await page.goto("/");
  });

  test("should display logo and hero section", async ({ page }) => {
    // Check if main hero logo is visible (using more specific selector)
    const logo = page
      .getByRole("main")
      .getByRole("img", { name: "Breathe Coherence" });
    await expect(logo).toBeVisible();

    // Verify hero section content
    const heroTitle = page.getByRole("heading", { level: 1 });
    await expect(heroTitle).toBeVisible();

    // Check CTA button in hero section
    const storeCTA = page
      .getByRole("link", { name: /shop|explore|discover/i })
      .first();
    await expect(storeCTA).toBeVisible();
  });

  test("should display features section with three cards", async ({ page }) => {
    // Check features section title
    const featuresSection = page.getByRole("heading", { level: 2 }).first();
    await expect(featuresSection).toBeVisible();

    // Verify all three feature cards are present (using the correct class from your implementation)
    const featureCards = page.locator(".bg-white\\/5.dark\\:bg-white\\/5");
    await expect(featureCards).toHaveCount(3);

    // Scroll to the features section to trigger animations
    await featuresSection.scrollIntoViewIfNeeded();

    // Wait a bit for animations to complete
    await page.waitForTimeout(1000);

    // Check if each card has an emoji icon, title, and description
    const cards = await featureCards.all();
    for (const card of cards) {
      // Wait for the emoji container to be visible (with animation)
      await expect(
        card.locator(".mb-6.text-5xl.flex.justify-center"),
      ).toBeVisible();
      await expect(card.locator(".text-xl.font-semibold")).toBeVisible(); // Title
      await expect(
        card.locator(".text-gray-600, .text-gray-300"),
      ).toBeVisible(); // Description
    }
  });

  test("should have working navigation buttons in CTA section", async ({
    page,
  }) => {
    // Scroll to bottom CTA section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Check primary CTA button
    const shopButton = page.getByRole("link", { name: /shop/i }).last();
    await expect(shopButton).toBeVisible();

    // Check secondary sign-in button
    const signInButton = page.getByRole("link", { name: /sign[ -]?in/i });
    await expect(signInButton).toBeVisible();

    // Verify the buttons have correct href attributes (accounting for locale)
    await expect(shopButton).toHaveAttribute("href", "/en/store");
    await expect(signInButton).toHaveAttribute("href", "/en/login");
  });

  test("should be responsive", async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    // Check for a specific container instead of all containers
    const heroContainer = page
      .locator(".container")
      .filter({ hasText: /Sacred Geometry & Healing/i });
    await expect(heroContainer).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(heroContainer).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(heroContainer).toBeVisible();
  });
});
