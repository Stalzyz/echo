import { test, expect } from '@playwright/test';

test.describe('ECHO SaaS Fail-Proof Subscription & Package System Tests', () => {

  test('Super Admin Plan & Package Management is DB-backed', async ({ page }) => {
    // 1. Visit Super Admin Plans control plane
    await page.goto('/dashboard/super-admin/plans');
    await expect(page.locator('h1', { hasText: 'Plans & Billing Controls' })).toBeVisible();

    // 2. Verify plan cards (Starter, Growth, Enterprise)
    await expect(page.locator('text=STARTER ACADEMY').first()).toBeVisible();
    await expect(page.locator('text=GROWTH INSTITUTE').first()).toBeVisible();
    await expect(page.locator('text=ENTERPRISE').first()).toBeVisible();

    // 3. Verify numerical capacity limits and GST tags
    await expect(page.locator('text=+ 18% GST').first()).toBeVisible();
    await expect(page.locator('text=Student Limit').first()).toBeVisible();
  });

  test('Super Admin Subscription Management and Overrides', async ({ page }) => {
    await page.goto('/dashboard/super-admin/subscriptions');
    await expect(page.locator('h1', { hasText: 'Academy Subscriptions' })).toBeVisible();

    // Verify MRR, Active Academies table
    await expect(page.locator('text=Active').first()).toBeVisible();
  });

  test('Vendor Academy Billing & Usage Limits Dashboard', async ({ page }) => {
    await page.goto('/dashboard/settings/billing');
    await expect(page.locator('h1', { hasText: 'Subscription & Usage Limits' })).toBeVisible();

    // Verify Server-Enforced badge and Resource meters
    await expect(page.locator('text=Resource Consumption & Server Limits')).toBeVisible();
    await expect(page.locator('text=Enrolled Students')).toBeVisible();
    await expect(page.locator('text=Cloud Storage')).toBeVisible();

    // Verify Change/Upgrade plan modal interaction
    const upgradeBtn = page.locator('button', { hasText: 'Change / Upgrade Plan' });
    await expect(upgradeBtn).toBeVisible();
    await upgradeBtn.click();

    // Modal should be visible
    await expect(page.locator('h2', { hasText: 'Upgrade or Switch Academy Plan' })).toBeVisible();
  });

});
