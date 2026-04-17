import { expect, test } from '@playwright/test';

test.describe('visual regression checks', () => {
  test('home route visual state', async ({ page }) => {
    await page.goto('/');

    const mapTitle = page.getByRole('heading', { name: 'Coffee Spy' });
    await expect(mapTitle).toBeVisible({ timeout: 12_000 });
    const panel = page.locator('div').filter({ has: mapTitle }).first();
    await expect(panel).toHaveScreenshot('home-panel.png');
  });

  test('venues route visual state', async ({ page }) => {
    await page.goto('/venues');

    const list = page.locator('ul');
    await expect(list).toBeVisible({ timeout: 12_000 });
    await expect(list).toHaveScreenshot('venues-list.png');
  });
});
