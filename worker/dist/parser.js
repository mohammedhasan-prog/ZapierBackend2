"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseZapData = parseZapData;
function parseZapData(text, data) {
    return text.replace(/\{([^}]+)\}/g, (_match, path) => {
        try {
            return path.split('.').reduce((obj, key) => {
                if (obj && typeof obj === 'object' && key in obj) {
                    return obj[key];
                }
                throw new Error(`Key '${key}' not found in path '${path}'`);
            }, data);
        }
        catch (err) {
            console.warn(`Failed to resolve '{${path}}':`, err);
            return '';
        }
    });
}
// Example usage:
