import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('debe mostrar el título de bienvenida y el botón de inicio', async ({ page }) => {
    // Navegar a la raíz
    await page.goto('/');

    // El título real es MoodFlix
    const title = page.locator('h1');
    await expect(title).toContainText('MoodFlix');

    // El párrafo arriba del título tiene el texto que intentábamos buscar antes
    const eyebrow = page.locator('.landing-hero__eyebrow');
    await expect(eyebrow).toContainText('Tu estado de ánimo');

    // El botón real dice "Encuentra tu película"
    const startBtn = page.getByRole('link', { name: 'Encuentra tu película' });
    await expect(startBtn).toBeVisible();
  });
});
