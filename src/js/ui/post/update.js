import { updatePost } from "../../api/post/update";
import { showToast } from "../global/alert";

/**
 * Passes data to the createPost function in api/post and handles the response
 * @param {Event} event - The form submission event.
 */
export async function onUpdatePost(event) {
  event.preventDefault();

  const form = event.target;
  const fieldset = form.querySelector("fieldset");
  const button = form.querySelector("button");
  const originalButtonText = button.textContent;

  fieldset.disabled = true;
  button.disabled = true;
  button.textContent = "Updating...";

  const title = form.title.value;
  const body = form.body.value;
  const tags = form.tags.value.split(',').map(tag => tag.trim());
  const mediaUrl = form.mediaUrl.value;
  const mediaAlt = form.mediaAlt.value;

  const updatedPostData = {
    title,
    body,
    tags,
    media: {
      url: mediaUrl,
      alt: mediaAlt
    }
  };

  const postId = form.getAttribute('data-post-id');

  if (!postId) {
    console.error('Post ID not found.');
    return;
  }

  try {
    const updatedPost = await updatePost(postId, updatedPostData);

    showToast("Post updated successfully! Redirecting to your profile.", "success");
    setTimeout(() => {
      window.location.href = "/profile/";
    }, 1500);
  } catch (error) {
    showToast(error.message || "An error occurred while updating the post.", "error");
  } finally {
    fieldset.disabled = false;
    button.disabled = false;
    button.textContent = originalButtonText;
  }
}