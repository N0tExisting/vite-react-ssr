// @ts-check
// file deepcode ignore Utf8Literal: The web uses utf-8
const fs = require('fs');
const path = require('path');
const express = require('express');

const IS_TEST =
	process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD;
const PORT = process.env.PORT || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

process.env.MY_CUSTOM_SECRET = 'API_KEY_qwertyuiop';

async function createServer(root = process.cwd(), isProd = IS_PROD) {
	const resolve = (/** @type {string} */ p) => path.resolve(__dirname, p);

	const indexProd = isProd
		? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
		: '';

	/** @type {import('./src/entry-server')} */
	const entryProd = isProd ? require('./dist/server/entry-server.js') : null;

	const app = express().disable('x-powered-by');

	const vite = isProd
		? null
		: await require('vite').createServer({
				root,
				logLevel: IS_TEST ? 'error' : 'info',
				server: {
					middlewareMode: 'ssr',
				},
		  });
	if (!isProd) {
		// use vite's connect instance as middleware
		app.use(vite.middlewares);
	} else {
		app.use(require('compression')());
		app.use(
			require('serve-static')(resolve('dist/client'), {
				index: false,
			}),
		);
	}

	// deepcode ignore NoRateLimitingForExpensiveWebOperation: Only Reading in dev anyway
	app.use('*', async (req, res) => {
		try {
			const url = req.originalUrl;

			const template = isProd
				? indexProd
				: await vite.transformIndexHtml(
						fs.readFileSync(resolve('index.html'), 'utf-8'),
						url,
				  );

			/** @type {typeof entryProd.render} */
			const render = isProd
				? entryProd.render
				: (await vite.ssrLoadModule('/src/entry-server.tsx')).render;

			const result = render(url);

			if (result.ctx.url) {
				// Somewhere a `<Redirect>` was rendered
				return res.redirect(301, result.ctx.url);
			}

			const html = template
				.replace(`<!--%app.body%-->`, result.body)
				.replace(`<!--%app.head%-->`, result.head);

			// deepcode ignore XSS: Needed to render page, user needs to take care of XSS, deepcode ignore ServerLeak: Doesn't happen here
			res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
		} catch (e) {
			res.status(500);
			vite && vite.ssrFixStacktrace(e);
			console.error('Error Handling request:', {
				request: req,
				response: res,
				error: e,
			});
			if (!isProd)
				// deepcode ignore ServerLeak: Only Happens in Dev, deepcode ignore XSS: Only used in dev
				res.end(JSON.stringify(e));
			else {
				// TODO: Add 5xx error page
				res.end('Internal Server Error');
			}
		}
	});

	return { app, vite };
}

if (!IS_TEST) {
	createServer()
		.then(({ app }) =>
			app.listen(PORT, () => {
				console.log(`App listening on 'http://localhost:${PORT}'`);
			}),
		)
		.catch((e) => {
			console.error('Error Starting Server:', e);
			throw e;
		});
}

// for test use
exports.createServer = createServer;
