/_ eslint-disable unicorn/no-null _/ export const googleToken = { access_token:
'string', expires_in: 3599, refresh_token: 'string', scope:
'https://www.googleapis.com/auth/userinfo.email
https://www.googleapis.com/auth/userinfo.profile openid', token_type: 'Bearer',
id_token: 'string', expires_at: '2023-10-17T18:02:09.194Z', }; // google token

export const googlePayload = { sub: '104469103604315263184', name: 'Gipo',
given_name: 'Gipo', picture:
'https://lh3.googleusercontent.com/a/ACg8ocI3EJUs0D6OOEY9Dl9moquRIsmUepwVE8VmEi6eSRSz\u003Ds96-c',
email: 'gipo18649ah@gmail.com', email_verified: true, locale: 'en', };

export const githubQueryParameters = { code: '65b41916c341d593040d', state:
'8kG4u4jXH9BALb8_Am64xQ', };

export const githubToken = { access_token: 'key', token_type: 'bearer', scope:
'user:email', };

export const githubPayloadFromUserEmailsEndpoint = [ { email: 'my email',
primary: true, verified: true, visibility: 'private', }, { email: 'secondary
email', primary: false, verified: true, visibility: null, }, { email: 'tertiary
email', primary: false, verified: false, visibility: null, }, ];

export const githubPayloadFromUserEndpoint = { login: 'gipo355', id: 91_525_512,
node_id: 'U_kgDOBXSRiA', avatar_url:
'https://avatars.githubusercontent.com/u/91525512?v=4', gravatar_id: '', url:
'https://api.github.com/users/gipo355', html_url: 'https://github.com/gipo355',
followers_url: 'https://api.github.com/users/gipo355/followers', following_url:
'https://api.github.com/users/gipo355/following{/other_user}', gists_url:
'https://api.github.com/users/gipo355/gists{/gist_id}', starred_url:
'https://api.github.com/users/gipo355/starred{/owner}{/repo}',
subscriptions_url: 'https://api.github.com/users/gipo355/subscriptions',
organizations_url: 'https://api.github.com/users/gipo355/orgs', repos_url:
'https://api.github.com/users/gipo355/repos', events_url:
'https://api.github.com/users/gipo355/events{/privacy}', received_events_url:
'https://api.github.com/users/gipo355/received_events', type: 'User',
site_admin: false, name: null, company: null, blog: '', location: null, email:
null, hireable: null, bio: null, twitter_username: null, public_repos: 23,
public_gists: 3, followers: 1, following: 3, created_at: '2021-09-28T07:28:01Z',
updated_at: '2023-10-14T16:44:32Z', };
