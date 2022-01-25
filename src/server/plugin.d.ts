import type { ViteDevServer } from 'vite';

declare module 'fastify/types/instance' {
	interface FastifyInstance {
		vite?: ViteDevServer;
	}
}
