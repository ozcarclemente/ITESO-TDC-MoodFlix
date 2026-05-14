import { test, expect } from '@playwright/test';

test.describe('Navegación Segura', () => {
  test('debe redirigir al login si un usuario no autenticado intenta acceder a /profile', async ({ page }) => {
    // Intentamos ir directo a perfil
    await page.goto('/profile');

    // Debe mandarnos a login porque no hay sesión
    await expect(page).toHaveURL('http://localhost:4200/login');
  });

  test('debe redirigir al login si un usuario no autenticado intenta acceder a /questionnaire', async ({ page }) => {
    await page.goto('/questionnaire');
    await expect(page).toHaveURL('http://localhost:4200/login');
  });
});
