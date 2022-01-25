// @ts-check

/** @type {import('vite').ViteDevServer | undefined} */
export let vite = undefined;

/**
 * @param {import('vite').ViteDevServer} v - the new dev server
 */
export const setVite = (v) => (vite = v);
