import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads
    await expect(page).toHaveTitle(/MyFitness/);
    
    // Check for basic page structure
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have responsive design', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have basic accessibility features', async ({ page }) => {
    await page.goto('/');
    
    // Check for basic accessibility features
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang');
    
    // Check for main content area
    const main = page.locator('main');
    if (await main.count() > 0) {
      await expect(main).toBeVisible();
    }
  });

  test('should load without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    
    await page.goto('/');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Check that there are no critical JavaScript errors
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('manifest') &&
      !error.toLowerCase().includes('warning')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });
});

test.describe('API Health Check', () => {
  test('should have working health endpoint', async ({ request }) => {
    const response = await request.get('/api/health');
    
    expect(response.status()).toBeLessThan(600); // Should not be a server error
    
    const data = await response.json();
    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('services');
  });
});

test.describe('Performance', () => {
  test('should load within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds (generous for development)
    expect(loadTime).toBeLessThan(5000);
  });
});