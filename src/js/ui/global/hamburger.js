export function toggleHamburgerMenu() {
  const hamburgerButton = document.querySelector("#hamburger-button");
  const hamburgerMenu = document.querySelector("#hamburger-menu");

  hamburgerButton.addEventListener("click", () => {
    hamburgerMenu.classList.toggle("hidden");
  });
};