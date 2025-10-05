import { updatePost } from "../../api/post/update";

/**
 * Passes data to the createPost function in api/post and handles the response
 * @param {Event} event - The form submission event.
 */
export async function onUpdatePost(event) {
  event.preventDefault();


  const form = event.target;

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

    alert('Post updated successfully!');
    window.location.href = `/profile/`;
  } catch (error) {
    console.error('Error updating post:', error);
    alert('Failed to update post. Please try again.');
  }
}
