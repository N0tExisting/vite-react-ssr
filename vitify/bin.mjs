// @ts-check
import { createServer as createDevServer } from 'vite';
import { ViteNodeServer } from 'vite-node/server';
import { ViteNodeRunner } from 'vite-node/client';

const main = async () => {
	// create vite server
	const vite = await createDevServer({
		optimizeDeps: {
			include: ['./src/server/dev.ts'],
		},
		server: {
			middlewareMode: 'ssr',
		},
		/*ssr: {
			noExternal: ['fastify'],
		},*/
	});

	// this is need to initialize the plugins
	await vite.pluginContainer.buildStart({});

	/** @type {import('./vite.mjs')} */ (
		await vite.ssrLoadModule('#vitify/vite')
	).setVite(vite);

	// create vite-node server
	const node = new ViteNodeServer(vite);

	// create vite-node runner
	const runner = new ViteNodeRunner({
		root: vite.config.root,
		base: vite.config.base,
		// when having the server and runner in a different context,
		// you will need to handle the communication between them
		// and pass to this function
		fetchModule(id) {
			return node.fetchModule(id);
		},
		resolveId(id, importer) {
			return node.resolveId(id, importer);
		},
	});

	// execute the file
	await runner.executeFile('./src/server/dev.ts');

	return {
		vite,
		node,
		runner,
	};
};

main();
