// deno-lint-ignore require-await
export async function handler(_request: Request): Promise<Response> {
  const message = JSON.stringify({ message: 'Hello test-deno-app' });
  return new Response(message, {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
}
