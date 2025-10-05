/**
 * This function should pass data to the register function in api/auth and handle the response
 */

import { register } from "../../api/auth/register";

export async function onRegister(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);
  try {
    const response = await register(data);
    console.log("Registration successful:", response);

    alert("Registration successful! Redirecting to login.");
    window.location.href = "/auth/login/";
  } catch (error) {
    console.error("Registration failed:", error.message);
    alert(error.message || "An error has occurred during reg.");
  }
}
