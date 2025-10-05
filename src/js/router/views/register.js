import { onRegister } from "../../ui/auth/register";
import { toggleHamburgerMenu } from "../../ui/global/hamburger";
import { updateNav } from "../../ui/global/updateNav";

const form = document.forms.register;

form.addEventListener("submit", onRegister);

toggleHamburgerMenu();
updateNav();