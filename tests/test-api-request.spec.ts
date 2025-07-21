import { test, expect, type Page } from "@playwright/test";
import { loginToSauceDemo, loginWithValidation } from "../pages/testPages";

test.describe("Test Login Saucedemo", () => {
  test("Successful login with standard user", async ({ page }: { page: Page }) => {
    await loginToSauceDemo(page, {
      username: "standard_user",
      password: "secret_sauce",
    });

    expect(page.url()).toContain("/inventory.html");
    
  });

  test("Failed login with invalid credentials", async ({ page }: { page: Page }) => {
    const result = await loginWithValidation(page, {
      username: "invalid_user",
      password: "wrong_password",
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  test("Failed login with locked user", async ({ page }: { page: Page }) => {
    const result = await loginWithValidation(page, {
      username: "locked_out_user",
      password: "secret_sauce",
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("locked out");
  });

  test("Successful login with performance glitch user", async ({ page }: { page: Page }) => {
    await loginToSauceDemo(page, {
      username: "performance_glitch_user",
      password: "secret_sauce",
    });

    expect(page.url()).toContain("/inventory.html");
  });
});
