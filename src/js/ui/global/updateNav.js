export function updateNav() {
  const username = localStorage.getItem("username");

  const loginLinkDesktop = document.querySelector('a[href="/auth/login/"]');
  const registerLinkDesktop = document.querySelector('a[href="/auth/register/"]');
  const loginLinkMobile = document.querySelector('#hamburger-menu a[href="/auth/login/"]');
  const registerLinkMobile = document.querySelector('#hamburger-menu a[href="/auth/register/"]');

  const logoutButton = document.getElementById("logoutButton");
  const logoutButtonMobile = document.getElementById("logoutButtonMobile");

  if (username) {
    loginLinkDesktop.style.display = "none";
    registerLinkDesktop.style.display = "none";
    loginLinkMobile.style.display = "none";
    registerLinkMobile.style.display = "none";
  } else {
    loginLinkDesktop.style.display = "block";
    registerLinkDesktop.style.display = "block";
    loginLinkMobile.style.display = "block";
    registerLinkMobile.style.display = "block";
  }

  if (username) {
    logoutButton.style.display = "block";
    logoutButtonMobile.style.display = "block";
  } else {
    logoutButton.style.display = "none";
    logoutButtonMobile.style.display = "none";
  }
};