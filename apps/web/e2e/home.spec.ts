import { expect, test } from '@playwright/test';
test('landing page exposes both room entry paths', async ({ page }) => { await page.goto('/'); await expect(page.getByRole('heading', { name: /Фильм начинается/ })).toBeVisible(); await expect(page.getByRole('button', { name: /Создать комнату/ })).toBeVisible(); await expect(page.getByPlaceholder('Код или ссылка')).toBeVisible(); });
