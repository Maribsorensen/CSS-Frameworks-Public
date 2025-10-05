import { API_KEY, API_SOCIAL_PROFILES } from "../constants";

/**
 * Fetches the profile information of a specific user by username.
 *
 * @async
 * @function
 * @param {string} username - The username of the profile to fetch.
 * @returns {Promise<Object>} The user's profile data.
 * @throws {Error} Throws an error if the request fails or the response is not ok.
 */
export async function readProfile(username) {
  const url = new URL(`${API_SOCIAL_PROFILES}/${username}`);

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
      throw new Error(error.message || "Failed to fetch user profile");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}


export async function readProfiles(limit, page) { }




