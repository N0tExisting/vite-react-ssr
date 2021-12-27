/// <reference path="./plugin.d.ts" />
import * as path from 'path';
import Fastify from 'fastify';
import compression from 'fastify-compress';
import fastifyStatic from 'fastify-static';
import fastifyFetch from 'fastify-fetch';
import cookie from 'fastify-cookie';
import middie from 'middie';
import { render } from '$/src/entry-server';
import indexHtml from '$/index.html?raw';

export const app = Fastify();

app.register(middie);
app.register(cookie);
app.register(fastifyFetch);

//* https://react-query.tanstack.com/guides/ssr#using-other-frameworks-or-custom-ssr-frameworks

const createServer = async () => {
	/*const vite = import.meta.env.DEV
		? await Vite.createServer({
				clearScreen: false,
				server: {
					middlewareMode: 'ssr',
				},
		  })
		: null;
	*/

	//const isProd = (): vite is null => import.meta.env.PROD;

	app.fetch;
	if (import.meta.env.PROD) {
		app.register(compression);
		app.register(fastifyStatic, {
			root: path.join(__dirname, '../client/'),
			cacheControl: true,
			lastModified: true,
			etag: true,
			index: false,
			extensions: [],
		});
	}

	app.get('*', async (req, rep) => {
		// TODO: Error Handling
		const template =
			app.vite != undefined
				? await app.vite.transformIndexHtml(req.url, indexHtml)
				: indexHtml;

		const res = render(req.url);

		const html = template
			.replace('<!--%app.head%-->', res.head)
			.replace('<!--%app.body%-->', res.body);

		rep.type('text/html');

		if (res.ctx.url) {
			if (res.ctx.statusCode) {
				// deepcode ignore OR: User Needs to ensure this doesn't happen
				rep.redirect(res.ctx.statusCode, res.ctx.url);
			} else {
				// deepcode ignore OR: User Needs to ensure this doesn't happen
				rep.redirect(res.ctx.url);
			}
		}
		rep.send(html);
	});

	return { app };
};

export default createServer;
