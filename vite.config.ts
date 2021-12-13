import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import pages from 'vite-plugin-pages';

const isSSR = process.env['BUILD_ENV'] === 'SSR';

export default defineConfig({
	cacheDir: 'node_modules/.cache/vite',
	plugins: [
		react(),
		/*pages({
			pagesDir: 'src/routes/api',
			extensions: ['.ts', '.js'],
			importMode: 'sync',
			// TODO: Custom API Routing
		}),*/
		pages({
			pagesDir: 'src/routes',
			extensions: ['.tsx', '.jsx'],
			react: true,
			importMode: (path) => {
				console.log(`Path: '${path}'`);
				if (path.endsWith('src/routes/[...].tsx')) {
					return 'sync';
				}
				return 'async';
			},
			syncIndex: false,
		}),
	],
	esbuild: {
		//jsxInject: "import { createElement as $$H, Fragment as $$F } from 'react';",
		//jsxFactory: '$$H',
		//jsxFragment: '$$F',
	},
	build: {
		minify: true,
		assetsDir: 'static',
		assetsInlineLimit: 512,
		sourcemap: isSSR ? true : 'hidden',
		ssrManifest: true,
		manifest: true,
		ssr: isSSR,
	},
});
