import net from 'node:net';

export async function isPortReachable({
  port,
  host = 'localhost',
  timeout = 1000,
}: {
  port: number;
  host?: string;
  timeout?: number;
}) {
  if (typeof host !== 'string') {
    throw new TypeError('Specify a `host`');
  }

  const promise = new Promise((resolve, reject) => {
    const socket = new net.Socket();

    const onError = () => {
      socket.destroy();
      reject();
    };

    socket.setTimeout(timeout);
    socket.once('error', onError);
    socket.once('timeout', onError);

    socket.connect(port, host, () => {
      socket.end();
      resolve('ok');
    });
  });

  try {
    await promise;
    return true;
  } catch {
    return false;
  }
}
