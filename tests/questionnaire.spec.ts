import { test, expect } from '@playwright/test';

test.describe('Flujo de Cuestionario', () => {

  test('debe completar el cuestionario y mostrar recomendaciones', async ({ page }) => {
    // 1. Mock de Login y Perfil para poder entrar
    await page.route('**/api/auth/login', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ user: { id: '1', name: 'Test' } }),
      });
    });

    await page.route('**/api/user/profile', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ name: 'Test', email: 'test@test.com' }),
      });
    });

    await page.route('**/api/user/favorites', async route => {
        await route.fulfill({
          status: 200,
          body: JSON.stringify([]),
        });
      });

    // 2. Mock de Recomendaciones (para la pantalla final)
    await page.route('**/api/movies/recommendations*', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { _id: 'm1', title: 'Movie 1', posterUrl: '', ratingAvg: 8.5 },
            { _id: 'm2', title: 'Movie 2', posterUrl: '', ratingAvg: 7.0 }
          ]),
        });
      });

    // 3. Login
    await page.goto('/login');
    await page.getByPlaceholder('Email').fill('test@test.com');
    await page.getByPlaceholder('Contraseña').fill('password123');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // 4. Llenar cuestionario
    await expect(page).toHaveURL('http://localhost:4200/questionnaire');
    
    // Seleccionar Humor
    await page.getByText('Feliz').click();
    
    // Seleccionar Energía
    await page.getByText('Alta').click();
    
    // Seleccionar Tiempo
    await page.locator('select').selectOption({ label: 'Alrededor de 2 horas' });

    // Enviar
    await page.getByRole('button', { name: 'Descubrir películas' }).click();

    // 5. Verificar llegada a recomendaciones
    await expect(page).toHaveURL('http://localhost:4200/recommendations');
    
    // Verificar que se cargaron las películas del mock
    await expect(page.getByText('Movie 1')).toBeVisible();
    await expect(page.getByText('Movie 2')).toBeVisible();
  });
});
