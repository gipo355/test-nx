// export const autoPrefix = '/_app';

import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

const frontend: FastifyPluginAsync = async function viewsRouter(
  fastify: FastifyInstance
) {
  fastify.route({
    url: '/',
    method: 'GET',
    schema: { description: 'Home page', tags: ['ui'] },
    async handler(_, res) {
      console.log(_.session.user, 'session user');
      console.log(_.session.role, 'session role');
      console.log(_.session.email, 'session email');
      console.log(_.session.strategy, 'session strategy');

      void res.type('text/html');
      return res.send(`
                <a href="/login">Login</a>
                <a href="/dashboard">Dashboard</a>
            `);
    },
  });
  fastify.route({
    url: '/login',
    method: 'GET',
    schema: {
      description: 'Login page',
      tags: ['ui'],
    },
    async onRequest(req, res) {
      // console.log(req.cookies, 'cookies login');

      if (
        req.cookies.access_token !== undefined ||
        req.cookies.refresh_token !== undefined
      ) {
        await res.redirect('/dashboard');
        // return res.sendFile('dashboard.html');
      }
    },
    async handler(_, res) {
      // TODO: verify if access token is valid, in case redirect to dashboard

      // automatically sends from public
      // static assets decorated with res.sendFile()
      // suggested to use a cdn instead or a framework like nextjs
      // return res.sendFile('login/index.html');
      // return 'hello world';
      // console.log(html);
      // return html;
      void res.type('text/html');
      return res.send(`
                <a href="/auth/github">Login with Github</a>
                <a href="/auth/google">Login with Google</a>
            `);
      // return res.sendFile('login.html');
    },
  });

  fastify.route({
    url: '/dashboard',
    method: 'GET',
    schema: {
      description: 'dashboard page',
      tags: ['ui'],
    },
    onRequest: fastify.auth(
      [
        fastify.authenticate,
        // fastify.csrfProtection,
        // fastify.restrictTo(['ADMIN', 'USER']),
      ],
      { relation: 'and' }
    ),
    async handler(req, res) {
      const { prisma, httpErrors } = fastify;

      const { accessTokenPayload } = req;

      if (!accessTokenPayload) {
        req.clearAuthTokens();
        throw httpErrors.unauthorized('There was an error. Please login again');
      }
      const { id } = accessTokenPayload;

      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (user === null || user === undefined) {
        req.clearAuthTokens();
        throw this.httpErrors.unauthorized('Please login again');
      }

      void res.type('text/html');
      return res.send(`
                <h1>Dashboard</h1>
                <p>logged in as ${user.email}</p>
                ${user.role === 'ADMIN' ? '<p>admin</p>' : ''}
                <a href="/auth/logout">Logout</a>
                <a href="/auth/logout-all">Logout Everywhere</a>
                `);
    },
  });

  fastify.route({
    url: '/protected',
    method: 'GET',
    schema: {
      description: 'protected',
      tags: ['ui'],
    },
    onRequest: fastify.auth(
      [
        fastify.authenticate,
        // fastify.csrfProtection,
        // fastify.restrictTo(['ADMIN', 'USER']),
      ],
      { relation: 'and' }
    ),
    async handler(req, res) {
      const { httpErrors } = fastify;

      const { accessTokenPayload } = req;

      if (!accessTokenPayload) {
        req.clearAuthTokens();
        throw httpErrors.unauthorized('There was an error. Please login again');
      }
      const { id, role, email } = accessTokenPayload;

      void res.type('text/html');
      return res.send(`
                <h1>Protected route</h1>
                <p>logged in as ${email}</p>
                ${role === 'ADMIN' ? '<p>admin</p>' : ''}
                <p>id: ${id}</p>
                <p>role: ${role}</p>
                <a href="/auth/logout">Logout</a>
                <a href="/auth/logout-all">Logout Everywhere</a>
                `);
    },
  });

  /**
   * ## Only if using fastify/view in globalMiddlewares.ts
   * needs rendering plugin
   * can use ejs to render views
   */
  // fastify.route({
  //     url: '/hello',
  //     method: 'GET',
  //     schema: { tags: ['ui'] },
  //     async handler(_, res) {
  //         await res.view('/pages/index.ejs', { text: 'text' });
  //     },
  // });
};

export default frontend;
