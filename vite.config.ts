/// <reference path="./vite-config.d.ts" />
import type { FastifyInstance } from 'fastify';
import {
	defineConfig,
	type SSROptions,
	type ViteDevServer,
	createServer,
} from 'vite';
import react from '@vitejs/plugin-react';
import pages from 'vite-plugin-pages';
import { VitePluginNode, type RequestAdapter } from 'vite-plugin-node';
import tsconfigPaths from 'vite-tsconfig-paths';

const isSSR = process.env['BUILD_ENV'] === 'SSR';

let vite: ViteDevServer;
const ServerHandler: RequestAdapter<FastifyInstance> = async (
	app,
	req,
	res,
) => {
	app.log.trace('Handling Request', { app, req, res });
	if (!app.vite) {
		app.log.trace('Starting Vite Instance');
		vite = await createServer({
			server: {
				middlewareMode: 'ssr',
			},
		});
		app.use(vite.middlewares);
		app.decorate('vite', vite);
		app.log.trace('Added Vite Server');
	}

	await app.ready();
	app.log.trace('App Ready');
	app.routing(req, res);
};

export default defineConfig({
	cacheDir: 'node_modules/.cache/vite',
	envPrefix: ['PUBLIC_', 'VITE_'],
	plugins: [
		tsconfigPaths(),
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
		...VitePluginNode({
			// Nodejs native Request adapter
			// currently this plugin support 'express', 'nest', 'koa' and 'fastify' out of box,
			// you can also pass a function if you are using other frameworks, see Custom Adapter section
			adapter: ServerHandler as RequestAdapter<{}>,

			// tell the plugin where is your project entry
			appPath: 'src/server/dev.ts',

			// Optional, default: 'viteNodeApp'
			// the name of named export of you app from the appPath file
			exportName: 'viteNodeApp',

			/**
			 * Optional, default: 'esbuild'
			 * The TypeScript compiler you want to use
			 * by default this plugin is using vite default ts compiler which is esbuild
			 * 'swc' compiler is supported to use as well for frameworks
			 * like Nest.js (esbuild doesn't support `emitDecoratorMetadata` yet)
			 * @default 'esbuild'
			 */
			//tsCompiler: 'esbuild',
		}),
	],
	esbuild: {
		//jsxInject: "import { createElement as $$H, Fragment as $$F } from 'react';",
		//jsxFactory: '$$H',
		//jsxFragment: '$$F',
	},
	build: {
		rollupOptions: {
			input: isSSR ? { index: 'src/server/prod.ts' } : undefined,
		},
		minify: true,
		assetsDir: 'static',
		assetsInlineLimit: 512,
		sourcemap: isSSR ? true : 'hidden',
		ssrManifest: true,
		manifest: true,
		ssr: isSSR,
	},
	ssr: {
		target: 'node',
	},
});
