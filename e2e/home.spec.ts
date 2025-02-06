import { expect, test } from "@playwright/test";

test.describe("Home Page", () => {
  test("should display main components and navigate to store", async ({
    page,
  }) => {
    // Start from the homepage
    await page.goto("/");

    // Check if the main hero logo is visible (using more specific selector)
    const mainLogo = page.locator(
      'main img[alt="Breathe Coherence"].w-\\[200px\\]',
    );
    await expect(mainLogo).toBeVisible();

    // Verify main heading (hero section) with translation text
    const mainHeading = page.getByRole("heading", { level: 1 });
    await expect(mainHeading).toBeVisible();
    await expect(mainHeading).toHaveClass(/bg-clip-text/);

    // Check if the features section is present (using more specific selector)
    const featuresSection = page
      .getByRole("heading", { level: 2 })
      .filter({ hasText: "Why Choose Us" });
    await expect(featuresSection).toBeVisible();

    // Verify the three feature cards are present
    const featureCards = page.locator(".bg-white\\/5.dark\\:bg-white\\/5");
    await expect(featureCards).toHaveCount(3);

    // Verify feature card content (wait for animation to complete)
    const featureIcons = page.locator(".mb-6.text-5xl.flex.justify-center");
    await expect(featureIcons).toHaveCount(3);

    // Wait for and verify each emoji icon
    const expectedEmojis = ["🔮", "🌸", "✨"];
    for (let i = 0; i < expectedEmojis.length; i++) {
      const icon = featureIcons.nth(i);
      await expect(icon).toContainText(expectedEmojis[i]);
    }

    // Test navigation to Store page
    const storeButton = page
      .locator("button", { hasText: /shop|store/i })
      .first();
    await storeButton.click();
    await expect(page).toHaveURL("/store");
  });

  test("should have proper responsive layout", async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Check if the layout is properly stacked in mobile
    const featuresGrid = page.locator(".grid.grid-cols-1");
    await expect(featuresGrid).toBeVisible();

    // Set viewport to desktop size
    await page.setViewportSize({ width: 1280, height: 720 });

    // Check if the layout changes to multi-column in desktop
    await expect(page.locator(".grid.md\\:grid-cols-3")).toBeVisible();
  });

  test("should have proper dark mode support", async ({ page }) => {
    await page.goto("/");

    // Verify dark mode classes on elements
    const logo = page.locator('main img[alt="Breathe Coherence"]');
    await expect(logo).toHaveClass(/dark:invert/);

    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toHaveClass(/dark:from-purple-400/);
  });

  test("should have proper animations and interactive elements", async ({
    page,
  }) => {
    await page.goto("/");

    // Check for Framer Motion animation containers
    const animatedContainer = page.locator("div.space-y-6.max-w-4xl");
    await expect(animatedContainer).toBeVisible();

    // Check for gradient elements (using more specific selector)
    const gradientDiv = page
      .locator("div.bg-gradient-to-r")
      .filter({ hasText: "" })
      .first();
    await expect(gradientDiv).toBeVisible();

    // Verify hover animation classes on cards
    const featureCard = page
      .locator(".bg-white\\/5.dark\\:bg-white\\/5")
      .first();
    await expect(featureCard).toHaveClass(/hover:scale-105/);
    await expect(featureCard).toHaveClass(/transition-transform/);

    // Verify button animations
    const ctaButton = page
      .locator("button", { hasText: /shop|store/i })
      .first();
    await expect(ctaButton).toHaveClass(/hover:scale-105/);
    await expect(ctaButton).toHaveClass(/transition-transform/);
  });
});
