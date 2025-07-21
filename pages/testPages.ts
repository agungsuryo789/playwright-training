import { Page } from "@playwright/test";

export const SauceDemoSelectors = {
  usernameInput: "input[name='user-name']",
  passwordInput: "input[name='password']",
  loginButton: "input[name='login-button']",
  errorMessage: "h3[data-test='error']",
} as const;

async function goToSauceDemoLogin(page: Page): Promise<void> {
  await page.goto(process.env.URL_SAUCE_DEMO || "https://www.saucedemo.com/");
}

async function fillUsername(page: Page, username: string): Promise<void> {
  await page.fill(SauceDemoSelectors.usernameInput, username);
}

async function fillPassword(page: Page, password: string): Promise<void> {
  await page.fill(SauceDemoSelectors.passwordInput, password);
}

async function clickLoginButton(page: Page): Promise<void> {
  await page.click(SauceDemoSelectors.loginButton);
}

async function getErrorMessage(page: Page): Promise<string> {
  return await page.textContent(SauceDemoSelectors.errorMessage) || "";
}

async function isErrorMessageVisible(page: Page): Promise<boolean> {
  return await page.isVisible(SauceDemoSelectors.errorMessage);
}

async function takeScreenshot(page: Page, fileName: string): Promise<void> {
  await page.screenshot({ 
    path: `screenshots/${fileName}.png`, 
    fullPage: true 
  });
}

export async function loginToSauceDemo(
  page: Page,
  { username, password }: { username: string; password: string }
): Promise<void> {
  await goToSauceDemoLogin(page);
  await fillUsername(page, username);
  await fillPassword(page, password);
  await clickLoginButton(page);
  await page.waitForTimeout(1000);
  await takeScreenshot(page, 'login-sauce-demo');
}

export async function loginWithValidation(
  page: Page,
  { username, password }: { username: string; password: string }
): Promise<{ success: boolean; error?: string }> {
  await goToSauceDemoLogin(page);
  await fillUsername(page, username);
  await fillPassword(page, password);
  await clickLoginButton(page);
  await page.waitForTimeout(1000);

  const hasError = await isErrorMessageVisible(page);
  if (hasError) {
    const errorText = await getErrorMessage(page);
    await takeScreenshot(page, 'login-failed');
    return { success: false, error: errorText };
  }

  await takeScreenshot(page, 'login-success');
  return { success: true };
}
