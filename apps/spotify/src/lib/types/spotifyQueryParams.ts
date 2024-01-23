import { Type, type Static } from '@sinclair/typebox';
// import fastJson from 'fast-json-stringify';

// interface queryString {
//     response_type: 'code';
//     client_id: 'client_id';
//     scope: 'scope';
//     redirect_uri: 'redirect_uri';
//     state: 'state';
// }

export const spotifyQuerystringSchema = Type.Object({
  response_type: Type.String(),
  client_id: Type.String(),
  scope: Type.String(),
  redirect_uri: Type.String(),
  state: Type.String(),
});

export type TSpotifyQuerystring = Static<typeof spotifyQuerystringSchema>;

// export const stringifySpotifyQuerystring = fastJson(spotifyQuerystringSchema);
