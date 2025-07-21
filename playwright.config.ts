import { defineConfig, devices } from '@playwright/test';

// Get environment variables with defaults
const baseURL = process.env.BASE_URL || process.env.STAGING_BASE_URL || 'http://localhost:3000';
const testEnv = process.env.TEST_ENV || 'staging';
const maxWorkers = process.env.CI ? 1 : (process.env.MAX_WORKERS ? parseInt(process.env.MAX_WORKERS) : undefined);
const retries = process.env.CI ? 2 : (process.env.RETRY_COUNT ? parseInt(process.env.RETRY_COUNT) : 0);

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: retries,
  /* Opt out of parallel tests on CI. */
  workers: maxWorkers,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? [
    ['html'],
    ['github'],
    ['json', { outputFile: 'test-results/test-results.json' }],
    ['junit', { outputFile: 'test-results/test-results.xml' }]
  ] : 'html',
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: baseURL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Record video for failed tests */
    video: 'retain-on-failure',
    
    /* Take screenshots */
    screenshot: 'only-on-failure',
    
    /* Global test timeout */
    actionTimeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000'),
    
    /* Ignore HTTPS errors */
    ignoreHTTPSErrors: true,
    
    /* Extra HTTP headers */
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'X-Test-Environment': testEnv
    }
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
  
  /* Output directory for test artifacts */
  outputDir: 'test-results/',
  
  /* Test match patterns */
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  
  /* Ignore certain test files */
  testIgnore: ['**/node_modules/**', '**/dist/**'],
  
  /* Test timeout */
  timeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000'),
  
  /* Expect timeout */
  expect: {
    timeout: parseInt(process.env.DEFAULT_TIMEOUT || '5000')
  }
});
