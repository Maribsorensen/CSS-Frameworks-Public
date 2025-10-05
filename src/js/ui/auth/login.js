/**
 * This function should pass data to the login function in api/auth and handle the response
 */

import { login } from "../../api/auth/login";
import { showToast } from "../global/alert";

export async function onLogin(event) {
  event.preventDefault();

  const form = event.target;
  const fieldset = form.querySelector("fieldset");
  const button = form.querySelector("button");
  const originalButtonText = button.textContent;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  fieldset.disabled = true;
  button.disabled = true;
  button.textContent = "Logging in...";

  try {
    const response = await login(data);

    localStorage.setItem("token", response.data.accessToken);
    localStorage.setItem("username", response.data.name);

    showToast("Login successful! Redirecting to home page.", "success");

    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  } catch (error) {
    showToast(error.message || "An error occurred during login.", "error");
  } finally {

    fieldset.disabled = false;
    button.disabled = false;
    button.textContent = originalButtonText;
  }
}