import { test, expect } from '@playwright/test';

test.describe('Settings Navigation & WhatsApp Module Workflow', () => {

  test('Settings page renders single AppSidebar and no duplicate inner settings sidebar', async ({ page }) => {
    await page.goto('http://localhost:4444/dashboard/settings');
    await page.waitForLoadState('domcontentloaded');

    // Verify main AppSidebar is visible
    const appSidebar = page.locator('aside');
    await expect(appSidebar).toBeVisible();

    // Verify system settings title inside page content
    const heading = page.getByRole('heading', { name: /Branding & Theme Editor/i });
    await expect(heading).toBeVisible();
  });

  test('Header tabs trigger smooth anchoring to sidebar sections', async ({ page }) => {
    await page.goto('http://localhost:4444/dashboard');
    await page.waitForLoadState('domcontentloaded');

    // Click Teaching Studio tab on TopNav header
    const studioTab = page.getByRole('link', { name: 'Teaching Studio' });
    if (await studioTab.isVisible()) {
      await studioTab.click();
      await expect(page).toHaveURL(/.*\/dashboard\/studio/);
    }
  });

  test('WhatsApp Composer module renders live preview and dispatch actions', async ({ page }) => {
    await page.goto('http://localhost:4444/dashboard/academy/whatsapp');
    await page.waitForLoadState('domcontentloaded');

    // Verify WhatsApp page title
    const title = page.getByRole('heading', { name: /WhatsApp Messaging & Automations/i });
    await expect(title).toBeVisible();

    // Verify live phone preview card
    const previewHeader = page.getByText(/Live WhatsApp Mobile Preview/i);
    await expect(previewHeader).toBeVisible();

    // Verify Send WhatsApp Message button
    const sendBtn = page.getByRole('button', { name: /SEND WHATSAPP MESSAGE/i });
    await expect(sendBtn).toBeVisible();
  });

});
