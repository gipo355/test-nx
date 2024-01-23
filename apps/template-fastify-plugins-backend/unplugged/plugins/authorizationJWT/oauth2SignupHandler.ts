import type { FastifyInstance, RouteHandlerMethod } from 'fastify';

export const oauth2SignupHandler = (strategy: TStrategy) => {
  const oauth2Handler: RouteHandlerMethod = async function googleHandler(
    this: FastifyInstance,
    request,
    reply
  ) {
    const {
      emails,
      statusCodes,
      redisAuthConnection,
      googleOAuth2,
      prisma,
      config,
      createSetJwtCookieToken,
      githubOAuth2,
    } = this;

    const { token } =
      strategy === 'GITHUB'
        ? await githubOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)
        : await googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

    const { email, firstName, providerUid } =
      await this.getOauth2EmailFromToken(this, token.access_token, strategy);

    const user = await prisma.user.upsert({
      where: {
        email,
      },
      create: {
        email,
        firstName,
        emailVerified: new Date(),
      },
      update: {},
    });

    /**
     * ## Testing session
     */
    // request.session.user = user.id;

    const { token: accessToken } = createSetJwtCookieToken(this, reply, {
      type: 'access_token',
      payload: {
        id: user.id,
        // strategy,
        role: user.role,
        email,
      },
    });

    const { jti, token: refreshToken } = createSetJwtCookieToken(this, reply, {
      type: 'refresh_token',
      payload: {
        id: user.id,
        strategy,
      },
    });

    await prisma.account.upsert({
      where: {
        userId_strategy: {
          userId: user.id,
          strategy,
        },
      },
      create: {
        userId: user.id,
        strategy,
        providerUid: providerUid.toString(),
      },
      update: {},
    });

    /**
     * ## Whitelist refresh token
     */
    // TODO: remove all magic numbers for cookie, redis, csrf expiration
    await redisAuthConnection.set(
      `${user.id}:${jti}`,
      1,
      'EX',
      config.REFRESH_TOKEN_EXPIRATION / 1000
    );

    /**
     * ## Send welcome email
     */
    await emails.queues.queue1.add('welcome', {
      type: 'welcome',
      options: {
        firstName: user.firstName ?? user.email,
        url: 'http://localhost:3000',
        to: user.email,
      },
    });

    // TODO: redirect to dashboard won't pass the cookies?
    // return reply.redirect('/dashboard');

    const csrfToken = reply.generateCsrf();

    // request.session.user = user.id;

    // for sveltekit we need to send the body
    return reply.code(statusCodes.ok).send({
      accessToken,
      refreshToken,
      csrfToken,
    });
  };

  return oauth2Handler;
};
