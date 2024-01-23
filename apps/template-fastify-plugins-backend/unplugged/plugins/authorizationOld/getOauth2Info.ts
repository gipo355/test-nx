import { type Static, Type } from '@sinclair/typebox';
import type { FastifyInstance } from 'fastify';
import { Client } from 'undici';

export const getOauth2UserInfoFromAccessToken =
  // eslint-disable-next-line complexity
  async function getOauth2EmailFromToken(
    instance: FastifyInstance,
    token: string,
    strategy: TStrategy
  ) {
    // TODO: reduce complexity
    const { httpErrors } = instance;

    const provider = strategy.toLowerCase();

    const clientAddresses: Record<typeof provider, string> = {
      github: 'https://api.github.com',
      google: 'https://www.googleapis.com',
    };

    const clientAddressesPaths: Record<typeof provider, string> = {
      github: '/user',
      google: '/oauth2/v3/userinfo',
    };

    const client = new Client(clientAddresses[provider]);

    // https://www.googleapis.com/oauth2/v3/userinfo

    const response = await client.request({
      method: 'GET',
      path:
        provider === 'github'
          ? `${clientAddressesPaths[provider]}/emails`
          : clientAddressesPaths[provider],
      headers: {
        'User-Agent': 'fastify-example',
        Authorization: `Bearer ${token}`,
        ...(provider === 'github' && {
          Accept: 'application/vnd.github+json',
        }),
      },
    });

    if (response.statusCode >= 400) {
      throw httpErrors.unauthorized('Authenticate again 1');
    }

    let payload: string | undefined = '';
    response.body.setEncoding('utf8');
    for await (const chunk of response.body) {
      payload += chunk;
    }

    // console.log(payload, 'payload');

    if (!payload) {
      throw httpErrors.unauthorized('Authenticate again 2');
    }

    const user = {
      email: '',
      firstName: '',
      providerUid: '',
    };

    /**
     * ## GITHUB CASE
     */
    if (provider === 'github') {
      const GithubUserSchema = Type.Object({
        email: Type.String(),
        primary: Type.Boolean(),
        verified: Type.Boolean(),
        visibility: Type.Optional(Type.String()),
      });
      type GithubUser = Static<typeof GithubUserSchema>;

      /**
       * ## Get user email from payload
       */
      const parsedPayload: GithubUser[] = JSON.parse(payload);

      // console.log(parsedPayload, 'parsedPayload');

      if (parsedPayload.length === 0 || parsedPayload === undefined) {
        throw httpErrors.unauthorized('Authenticate again 3');
      }

      for (const ele of parsedPayload) {
        if (ele.primary) user.email = ele.email;
      }

      if (!user.email) {
        throw httpErrors.badRequest('The user does not have a primary email');
      }

      /**
       * ## Get user first name
       */
      const response2 = await client.request({
        method: 'GET',
        path: clientAddressesPaths[provider],
        headers: {
          'User-Agent': 'fastify-example',
          Authorization: `Bearer ${token}`,
          ...(provider === 'github' && {
            Accept: 'application/vnd.github+json',
          }),
        },
      });
      if (response2.statusCode >= 400) {
        throw httpErrors.unauthorized('Authenticate again 1');
      }

      let payload2: string | undefined = '';
      response.body.setEncoding('utf8');
      for await (const chunk of response2.body) {
        payload2 += chunk;
      }

      type GithubUser2 = {
        login: string;
        id: number;
      };
      const parsedPayload2: GithubUser2 = JSON.parse(payload2);

      // console.log(parsedPayload2, 'parsedPayload2');

      user.firstName = parsedPayload2.login;
      user.providerUid = `${parsedPayload2.id}`;

      return user;
    }

    /**
     * ## GOOGLE CASE
     */
    if (provider === 'google') {
      const GoogleUserSchema = Type.Object({
        email: Type.String(),
        name: Type.String(),
        email_verified: Type.Boolean(),
        sub: Type.String(),
      });
      type GoogleUser = Static<typeof GoogleUserSchema>;
      /**
       * ## Get user email from payload
       */
      const parsedPayload: GoogleUser = JSON.parse(payload);

      // console.log(parsedPayload, 'parsedPayload');

      if (parsedPayload.email === '' || parsedPayload === undefined) {
        throw httpErrors.unauthorized('ERR3533: Authenticate again');
      }

      user.email = parsedPayload.email;
      user.firstName = parsedPayload.name;
      user.providerUid = parsedPayload.sub;

      if (!parsedPayload.email_verified) {
        throw httpErrors.badRequest('Your google email is not verified');
      }

      /**
       * ## Get user first name
       */
      const response2 = await client.request({
        method: 'GET',
        path: clientAddressesPaths[provider],
        headers: {
          'User-Agent': 'fastify-example',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response2.statusCode >= 400) {
        throw httpErrors.unauthorized('ERR1535: Authenticate again');
      }

      return user;
    }

    return user;
  };
