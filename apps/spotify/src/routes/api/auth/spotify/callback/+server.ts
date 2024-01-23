import { error, redirect } from '@sveltejs/kit';

// import { verifyChallenge } from 'pkce-challenge';
import { HOST, SPOTIFY_ID, SPOTIFY_SECRET } from '$env/static/private';
import {
  accessCookieOptions,
  refreshCookieOptions,
  verifyCookieOptions,
} from '$lib/config/cookieOptions';

export const GET = async ({ url, cookies, fetch }) => {
  // console.log(url.searchParams);
  // URLSearchParams {
  // 'code'
  // 'state'
  // }

  // get the response params from spotify
  const code = url.searchParams.get('code') || null;

  const state = url.searchParams.get('state') || null;

  // get the pkce cookies set in the login endpoint
  const spotifyState = cookies.get('spotify_state') || null;
  const codeVerifier = cookies.get('code_verifier') || null;

  // check
  if (!code || !state || !spotifyState || !codeVerifier) {
    return error(404, 'Missing code, state, spotify_state, or code_verifier');
  }

  if (state !== spotifyState) {
    return error(404, 'Invalid state');
  }

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(`${SPOTIFY_ID}:${SPOTIFY_SECRET}`)}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: code ?? '',
      redirect_uri: `${HOST}/api/auth/spotify/callback`,
      code_verifier: codeVerifier,
      client_id: SPOTIFY_ID,
    }),
  });

  if (!res.ok) {
    return error(404, 'Failed to get access token');
  }

  const data = await res.json();

  if (data.error) {
    return error(404, data.error_description);
  }

  //   {
  //   access_token: ''
  //   token_type: 'Bearer',
  //   expires_in: 3600,
  //   refresh_token: ''
  //   scope: ''
  // }

  // remove cookies set in login route
  cookies.delete('spotify_state', {
    path: '/',
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 10),
  });
  cookies.delete('code_verifier', verifyCookieOptions);

  cookies.set('spotify_access_token', data.access_token, accessCookieOptions);
  cookies.set(
    'spotify_refresh_token',
    data.refresh_token,
    refreshCookieOptions
  );

  //   redirect(307, '/');

  redirect(303, '/');
};
