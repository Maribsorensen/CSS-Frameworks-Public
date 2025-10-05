/**
 * Passes data to the createPost function in api/post and handles the response
 */

import { createPost } from "../../api/post/create";
import { showToast } from "../global/alert";

export async function onCreatePost(event) {
  event.preventDefault();

  const form = event.target;
  const fieldset = form.querySelector("fieldset");
  const button = form.querySelector("button");
  const originalButtonText = button.textContent;

  fieldset.disabled = true;
  button.disabled = true;
  button.textContent = "Creating...";

  const title = form.title.value;
  const body = form.body.value;
  const tags = form.tags.value.split(",").map((tag) => tag.trim());
  const mediaUrl = form.mediaUrl.value;
  const mediaAlt = form.mediaAlt.value;

  const postData = {
    title,
    body,
    tags,
    media: {
      url: mediaUrl,
      alt: mediaAlt,
    },
  };

  try {
    const result = await createPost(postData);

    showToast("Post created successfully! Redirecting to your profile.", "success");
    setTimeout(() => {
      window.location.href = "/profile/";
    }, 1500);
  } catch (error) {
    console.error("Error creating post:", error);
    showToast(error.message || "An error occurred while creating the post.", "error");
  } finally {
    fieldset.disabled = false;
    button.disabled = false;
    button.textContent = originalButtonText;
  }
}