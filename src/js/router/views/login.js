import { onLogin } from "../../ui/auth/login";
import { toggleHamburgerMenu } from "../../ui/global/hamburger";
import { updateNav } from "../../ui/global/updateNav";

const form = document.forms.login;

form.addEventListener("submit", onLogin);

toggleHamburgerMenu();
updateNav();