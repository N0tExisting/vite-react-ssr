import type {
	FastifyLoggerInstance,
	RawReplyDefaultExpression,
	RawRequestDefaultExpression,
	RawServerBase,
	RawServerDefault,
} from 'fastify';
import type { ViteDevServer } from 'vite';

declare module 'fastify/types/instance' {
	interface FastifyInstance {
		vite?: ViteDevServer;
	}
}
