import { onLogout } from "../auth/logout";

/**
 * Functions you attach to logout events that calls ui/auth/logout function
 */
export function setLogoutListener() {
  const logout = document.getElementById("logoutButton");
  if (logout) {
    logout.addEventListener("click", onLogout);
  } else {
    console.error("Logout button not found");
  }

}