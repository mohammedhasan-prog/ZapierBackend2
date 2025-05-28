export function parseZapData(
  text: string,
  data: any
): string {
  return text.replace(/\{([^}]+)\}/g, (_match, path) => {
    try {
      return path.split('.').reduce((obj:any, key:any) => {
        if (obj && typeof obj === 'object' && key in obj) {
          return obj[key];
        }
        throw new Error(`Key '${key}' not found in path '${path}'`);
      }, data) as string;
    } catch (err) {
      console.warn(`Failed to resolve '{${path}}':`, err);



      return '';
    }
  });
}

// Example usage:
