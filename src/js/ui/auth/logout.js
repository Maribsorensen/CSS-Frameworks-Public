/**
 * This function should log the user out by removing appropriate user data from the browser.
 */

import { showToast } from "../global/alert";

export function onLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");

  showToast("You have logged out!", "info");

  setTimeout(() => {
    window.location.href = "/auth/login/";
  }, 1500);
}