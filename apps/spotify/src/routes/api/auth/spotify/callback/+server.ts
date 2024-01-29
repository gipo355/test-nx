// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true; // when true, this page will be prerendered (statically) on each build
// use when two users request the same page, they get the same content

// [https://kit.svelte.dev/docs/page-options]

// export const ssr = false; // means convert to spa

// export const csr = false; // means turn off hydration - doesn't ship any js - links are full page navigation

// If both `csr` and `ssr` are `false`, nothing will be rendered!
