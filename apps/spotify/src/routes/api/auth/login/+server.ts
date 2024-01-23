// import { stringifySpotifyQuerystring } from '$lib/types/spotifyQueryParams';
// import * as validate from '$lib/validators';
import { redirect } from '@sveltejs/kit';
import pkceChallenge from 'pkce-challenge';

import { HOST, SPOTIFY_ID } from '$env/static/private';
import { verifyCookieOptions } from '$lib/config/cookieOptions';

// import * as serializers from '$lib/serializers/build/stringify';

export const GET = async ({ cookies }) => {
  // define the scope of the spotify permissions
  const scope =
    'ugc-image-upload user-modify-playback-state user-read-playback-state user-read-currently-playing user-follow-modify user-follow-read user-read-recently-played user-read-playback-position user-top-read playlist-read-collaborative playlist-modify-public playlist-read-private playlist-modify-private app-remote-control streaming user-read-email user-read-private user-library-modify user-library-read';

  // generate a random string for the state
  const randomString = crypto.randomUUID();

  // generate a code verifier and challenge for PKCE spotify
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { code_challenge, code_verifier } = await pkceChallenge();

  // set the cookies for the state and code verifier, needed for the callback endpoint
  cookies.set('spotify_state', randomString, verifyCookieOptions);
  cookies.set('code_verifier', code_verifier, verifyCookieOptions);

  // prepare the query string for the spotify auth endpoint
  const queryString = {
    response_type: 'code',
    client_id: SPOTIFY_ID,
    scope,
    redirect_uri: `${HOST}/api/auth/spotify/callback`,
    state: randomString,
    code_challenge_method: 'S256',
    code_challenge,
  };

  // convert the query string to a URLSearchParams object
  const searchParameters = new URLSearchParams(queryString);
  // console.log(searchParameters.toString());
  // console.log(serializers.stringifySpotifyQuerystringSchema(queryString));
  // console.log(searchParameters);

  // send the user to the spotify auth endpoint, which will redirect to the callback endpoint
  // specified in the spotify website, add the url params
  redirect(
    307,
    `https://accounts.spotify.com/authorize?${searchParameters.toString()}`
    // '/'
  );
};
