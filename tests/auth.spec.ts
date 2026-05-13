import { test, expect } from '@playwright/test';

test.describe('Flujo de Autenticación', () => {
  
  test('debe mostrar mensaje de error con credenciales inválidas', async ({ page }) => {
    // 1. Vamos a la página de login (corregido: /login)
    await page.goto('/login');

    // 2. Mockeamos la respuesta de error del backend
    await page.route('**/api/auth/login', async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Email o contraseña inválidos' }),
      });
    });

    // 3. Llenamos el formulario
    await page.getByPlaceholder('Email').fill('error@test.com');
    await page.getByPlaceholder('Contraseña').fill('wrongpassword');
    
    // 4. Click en el botón de iniciar sesión
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // 5. Verificamos que aparezca el error en la UI
    const errorMessage = page.locator('.error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Email o contraseña inválidos');
  });

  test('debe redirigir al cuestionario tras un login exitoso', async ({ page }) => {
    await page.goto('/login');

    // Mockeamos respuesta exitosa y cookie de sesión
    await page.route('**/api/auth/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Sesión iniciada',
          user: { id: '123', name: 'Usuario Test', email: 'test@test.com', role: 'USER' }
        }),
      });
    });

    // Simulamos también la llamada al perfil que ocurre al cargar el home
    await page.route('**/api/user/profile', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ name: 'Usuario Test', email: 'test@test.com' }),
        });
      });

    await page.getByPlaceholder('Email').fill('test@test.com');
    await page.getByPlaceholder('Contraseña').fill('password123');
    await page.getByRole('button', { name: 'Iniciar sesión' }).click();

    // Verificamos redirección al cuestionario (/questionnaire)
    await expect(page).toHaveURL('http://localhost:4200/questionnaire');
  });
});
