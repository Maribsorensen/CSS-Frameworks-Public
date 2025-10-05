/**
 * Passes data to the createPost function in api/post and handles the response
 */

import { createPost } from "../../api/post/create";

export async function onCreatePost(event) {
  event.preventDefault();

  const form = event.target;

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
    alert("Post created!");
    window.location.href = "/profile/"
  } catch (error) {
    console.error("Error creating post:", error);
  }
}