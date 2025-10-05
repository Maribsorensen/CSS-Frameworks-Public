/**
 * This function should pass data to the login function in api/auth and handle the response
 */

import { login } from "../../api/auth/login";

export async function onLogin(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);
  try {
    const response = await login(data);
    console.log("Login successful:", response);
    localStorage.setItem("token", response.data.accessToken);
    localStorage.setItem("username", response.data.name);

    alert("Login successful! Redirecting yo home page.");
    window.location.href = "/";
  } catch (error) {
    console.error("Login failed:", error.message);
    alert(error.message || "An error occurred during login.");
  }
}

