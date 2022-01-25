import createServer from '.';
import { createServer as createHttpServer } from 'http';
import type { FastifyInstance } from 'fastify';

const PORT = process.env.PORT || (import.meta.env.PORT as string) || 3000;

const server = createHttpServer();
server.listen(PORT);

export let app: FastifyInstance | undefined;

createServer().then((result) => {
	if (app != undefined) {
		app = result.app;
		server.addListener('request', app.routing);
	}
});

if (import.meta.hot) {
	import.meta.hot.accept((mod) => {
		if (app != undefined) server.removeListener('request', app.routing);
		server.addListener('request', mod.app.routing);
		app = mod.app;
	});
}
//export const viteNodeApp = createServer().then((obj) => obj.app);
