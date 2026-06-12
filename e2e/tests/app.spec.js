const { test, expect } = require("@playwright/test");

test.describe("Basic app flow", () => {
  test("shows login / root page", async ({ page }) => {
    await page.goto("http://localhost:3000");

    // Wait for root app to render
    await expect(page.locator("text=📚")).toBeVisible({ timeout: 5000 });
  });
});
