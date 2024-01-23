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
      googleOAuth2,
      prisma,
      githubOAuth2,
      redisAuthConnection,
      config,
    } = this;

    const { token } =
      strategy === 'GITHUB'
        ? await githubOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)
        : await googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

    const { email, firstName, providerUid } =
      await this.getOauth2EmailFromToken(this, token.access_token, strategy);

    let user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    let isUserNew = false;
    if (!user) {
      isUserNew = true;
      user = await prisma.user.create({
        data: {
          email,
          firstName,
          emailVerified: new Date(),
        },
      });
    }

    /**
     * ## session
     */
    request.session.user = user.id;
    request.session.role = user.role;
    request.session.email = user.email;
    request.session.strategy = strategy;
    request.session.ip = request.ip ?? '';
    request.session.userAgent = request.headers['user-agent'] ?? '';

    /**
     * ## We need to keep track of all sessions for a user to be able
     * to invalidate them.
     * we add the session id to a set in redis, the key is the user id
     */
    await redisAuthConnection.sadd(
      `${config.SESSION_SET_PREFIX}:${user.id}`,
      `${config.SESSION_KEY_PREFIX}:${request.session.sessionId}` // make sure those are the same keys
    );

    // TODO: improve prisma
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

    // TODO: remove all magic numbers for cookie, redis, csrf expiration

    // TODO: send welcome email for new user only
    // send login email for existing user
    /**
     * ## Send welcome email
     */
    if (isUserNew) {
      await emails.queues.queue1.add('welcome', {
        type: 'welcome',
        options: {
          firstName: user.firstName ?? user.email,
          url: 'http://localhost:3000',
          to: user.email,
        },
      });
    } else {
      // find login notification
      // await emails.queues.queue1.add('welcome', {
      //     type: 'login',
      //     options: {
      //         firstName: user.firstName ?? user.email,
      //         url: 'http://localhost:3000',
      //         to: user.email,
      //         data: {ip, userAgent}
      //     },
      // });
    }

    // TODO: redirect to dashboard won't pass the cookies?
    // return reply.redirect('/dashboard');

    const csrfToken = reply.generateCsrf();

    // for sveltekit proxy we need to send the body?
    return reply.code(statusCodes.ok).send({
      session: request.session.encryptedSessionId,
      csrfToken,
    });
  };

  return oauth2Handler;
};
