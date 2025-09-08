import type PortOne from '@portone/browser-sdk/v2';

let portonePromise: Promise<typeof PortOne> | null = null;
let portoneInstance: typeof PortOne | null = null;
let loadStartTime: number | null = null;

export function loadPortone(): Promise<typeof PortOne> {
  // Return cached instance immediately if available
  if (portoneInstance) {
    return Promise.resolve(portoneInstance);
  }

  if (portonePromise) {
    return portonePromise;
  }

  loadStartTime = performance.now();

  portonePromise = new Promise((resolve, reject) => {
    import('@portone/browser-sdk/v2')
      .then((module) => {
        if (module.default) {
          portoneInstance = module.default;
          
          // Performance tracking
          if (loadStartTime) {
            const loadTime = performance.now() - loadStartTime;
            if (process.env.NODE_ENV === 'development') {
              console.debug(`PortOne SDK loaded in ${loadTime.toFixed(2)}ms (legacy loader)`);
            }
          }
          
          resolve(module.default);
        } else {
          reject(
            new Error('Failed to load Portone SDK: Default export not found.')
          );
        }
      })
      .catch((error) => {
        portonePromise = null;
        loadStartTime = null;
        reject(error);
      });
  });

  return portonePromise;
}

// Get cached instance without loading
export function getPortoneInstance(): typeof PortOne | null {
  return portoneInstance;
}

// Preload function for early SDK loading
export function preloadPortone(): Promise<typeof PortOne> {
  return loadPortone();
}
