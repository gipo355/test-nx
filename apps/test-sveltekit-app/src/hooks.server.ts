import type { Handle } from '@sveltejs/kit';
// import { minify } from 'html-minifier-terser';

// import { building, dev } from '$app/environment';
// import { minificationOptions } from '$lib/config/minify';

export const handle = async function handle({ event, resolve }) {
  if (event.request.method === 'OPTIONS') {
    // eslint-disable-next-line unicorn/no-null
    return new Response(null, {
      headers: {
        // 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Origin': 'false',
        // 'Access-Control-Allow-Headers': '*',
      },
    });
  }

  // html minification
  // let page = '';
  const response = await resolve(event, {
    // transformPageChunk: ({ html, done }) => {
    //   page += html;
    //   if (done) {
    //     if (!dev && building) {
    //       return minify(page, minificationOptions);
    //     }
    //     // if (building) {
    //     //   minify(page, minificationOptions);
    //     // }
    //     return page;
    //   }
    // },
  });

  // add security headers from helmet

  // this one breaks form submission
  // response.headers.set('Referrer-Policy', 'no-referrer');
  // response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  // response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin'); // default
  response.headers.set('Referrer-Policy', 'strict-origin');

  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  response.headers.set('Origin-Agent-Cluster', '?1');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=15552000; includeSubDomains;'
  );
  response.headers.set('X-Dns-Prefetch-Control', 'off');
  response.headers.set('X-Download-Options', 'noopen');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  response.headers.set('X-XSS-Protection', '0');
  response.headers.delete('X-Powered-By');
  response.headers.delete('X-Sveltekit-page');
  response.headers.delete('Access-Control-Allow-Origin');

  response.headers.set('Access-Control-Allow-Origin', '');
  response.headers.set('X-Powered-By', '');

  return response;
} satisfies Handle;
