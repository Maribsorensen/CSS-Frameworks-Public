import { API_KEY, API_SOCIAL_POSTS } from "../../api/constants";
import { getPostIdFromURL } from "../../api/post/update";
import { toggleHamburgerMenu } from "../../ui/global/hamburger";
import { updateNav } from "../../ui/global/updateNav";
import { onUpdatePost } from "../../ui/post/update";
import { authGuard } from "../../utilities/authGuard";

/**
 * Fetches the post data and fills the form for editing.
 *
 * @param {string|number} postId - The ID of the post to fetch and edit.
 */
async function populateEditForm(postId) {
  const url = new URL(`${API_SOCIAL_POSTS}/${postId}`);
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch post");
    }

    const postResponse = await response.json();
    const post = postResponse.data;

    const form = document.forms["editPost"];
    form.title.value = post.title || "";
    form.body.value = post.body || "";
    form.tags.value = post.tags ? post.tags.join(", ") : "";
    form.mediaUrl.value = post.media?.url || "";
    form.mediaAlt.value = post.media?.alt || "";

    form.setAttribute("data-post-id", post.id);
  } catch (error) {
    console.error("Error populating the edit form:", error);
    alert("Failed to load post data for editing.");
  }
}

const postId = getPostIdFromURL();
if (postId) {
  populateEditForm(postId);
}
authGuard();

const form = document.forms['editPost'];
form.addEventListener('submit', onUpdatePost);

toggleHamburgerMenu();
updateNav();