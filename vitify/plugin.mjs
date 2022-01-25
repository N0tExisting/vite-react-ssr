// @ts-check
import * as path from 'path';
import * as fs from 'fs';
const __dirname = path.dirname(new URL(import.meta.url).pathname);

/**
 * @returns {import('vite').Plugin}
 */
const viteVitify = () => {
	return {
		name: 'vitify',
		//apply: 'serve',
		resolveId(id) {
			if (id === '#vitify/vite') {
				return '\x00' + id;
			} else return null;
		},
		load(id) {
			if (id === '\x00#vitify/vite') {
				return `
export let vite = undefined;
export const setVite = (v) => (vite = v);`;
			} else return null;
		},
	};
};
export default viteVitify;
