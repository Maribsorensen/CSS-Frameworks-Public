/**
 * This function should pass data to the register function in api/auth and handle the response
 */

import { register } from "../../api/auth/register";
import { showToast } from "../global/alert";

export async function onRegister(event) {
  event.preventDefault();

  const form = event.target;
  const fieldset = form.querySelector("fieldset");
  const button = form.querySelector("button");
  const originalButtonText = button.textContent;

  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  fieldset.disabled = true;
  button.disabled = true;
  button.textContent = "Registering...";

  try {
    const response = await register(data);

    showToast("Registration successful! Redirecting to login.", "success");

    setTimeout(() => {
      window.location.href = "/auth/login/";
    }, 1500);
  } catch (error) {
    showToast(error.message || "An error has occurred during registration.", "error");
  } finally {
    fieldset.disabled = false;
    button.disabled = false;
    button.textContent = originalButtonText;
  }
}