import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import pages from 'vite-plugin-pages';

const isSSR = process.env['BUILD_ENV'] === 'SSR';

export default defineConfig({
	plugins: [
		react(),
		pages({
			pagesDir: 'src/pages',
			extensions: ['.tsx', '.jsx'],
			react: true,
			importMode: (_) => 'async',
			syncIndex: false,
		}),
	],
	esbuild: {
		jsxInject: "import { createElement as $$H } from 'react';",
		jsxFactory: '$$H',
	},
	build: {
		minify: !isSSR,
		assetsDir: 'static',
		assetsInlineLimit: 512,
		sourcemap: isSSR ? true : 'hidden',
		ssrManifest: true,
		manifest: true,
		ssr: isSSR,
	},
});
