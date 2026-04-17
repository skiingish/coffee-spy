import { expect, test } from '@playwright/test';

test.describe('visual regression checks', () => {
  test('home route fallback state without secrets', async ({ page }) => {
    await page.goto('/');

    const fallback = page.getByText('Error loading map data');
    await expect(fallback).toBeVisible({ timeout: 12_000 });
    await expect(fallback).toHaveScreenshot('home-fallback.png');
  });

  test('not-found route visual state without secrets', async ({ page }) => {
    await page.goto('/this-route-should-not-exist');

    const notFound = page.getByRole('heading', { name: '404' });
    await expect(notFound).toBeVisible({ timeout: 12_000 });
    await expect(notFound).toHaveScreenshot('not-found-heading.png');
  });
});
