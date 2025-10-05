import { onLogout } from "../auth/logout";

/**
 * Functions you attach to logout events that calls ui/auth/logout function
 */
export function setLogoutListener() {
  const logoutDesktop = document.getElementById("logoutButton");
  const logoutMobile = document.getElementById("logoutButtonMobile");

  if (logoutDesktop) {
    logoutDesktop.addEventListener("click", onLogout);
  } else {
    console.error("Desktop Logout button not found");
  }

  if (logoutMobile) {
    logoutMobile.addEventListener("click", onLogout);
  } else {
    console.error("Mobile Logout button not found");
  }
}