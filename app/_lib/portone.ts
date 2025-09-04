import type PortOne from '@portone/browser-sdk/v2';

let portonePromise: Promise<typeof PortOne> | null = null;

export function loadPortone(): Promise<typeof PortOne> {
  if (portonePromise) {
    return portonePromise;
  }

  portonePromise = new Promise((resolve, reject) => {
    import('@portone/browser-sdk/v2')
      .then((module) => {
        if (module.default) {
          resolve(module.default);
        } else {
          reject(
            new Error('Failed to load Portone SDK: Default export not found.')
          );
        }
      })
      .catch((error) => {
        portonePromise = null;
        reject(error);
      });
  });

  return portonePromise;
}
