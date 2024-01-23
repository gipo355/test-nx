// import { error } from '@sveltejs/kit';

import { SPOTIFY_API_URL } from '$env/static/private';

export const load = async ({ cookies, fetch }) => {
  const accessToken = cookies.get('spotify_access_token');
  const refreshToken = cookies.get('spotify_refresh_token');

  if (accessToken) {
    const res = await fetch(`${SPOTIFY_API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log(res);

    if (res.ok) {
      const profile: SpotifyApi.CurrentUsersProfileResponse = await res.json();
      return {
        user: {
          id: profile.id,
          name: profile.display_name,
          image: profile.images?.at(0)?.url,
        },
      };
    }

    // handle token expired, use refresh token to get new access token
    if (res.status === 401 && refreshToken) {
      return {};
    }

    // cookies.delete('spotify_access_token', {
    //   path: '/',
    // });
    // cookies.delete('spotify_refresh_token', {
    //   path: '/',
    // });
    return {
      user: null,
    };
  }

  return {
    user: null,
  };
};
