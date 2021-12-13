// @ts-check
// file deepcode ignore Utf8Literal: The web uses utf-8
const _DotEnvResult = require('dotenv-flow').config();
const fs = require('fs');
const path = require('path');
const express = require('express');

const IS_TEST =
	process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD;
const PORT = process.env.PORT || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

const resolve = (/** @type {string} */ p) => path.resolve(__dirname, p);

async function createServer(root = process.cwd(), isProd = IS_PROD) {
	const indexProd = isProd
		? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
		: '';

	/** @type {import('./src/entry-server')} */
	const entryProd = isProd ? require('./dist/server/entry-server.js') : null;

	const app = express().disable('x-powered-by');

	app.get('/index.html', (_, r) => r.redirect('/', 302));

	const vite = isProd
		? null
		: await require('vite').createServer({
				root,
				logLevel: IS_TEST ? 'error' : 'info',
				server: {
					middlewareMode: 'ssr',
				},
		  });

	// TODO: Add an API handler.
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
						url,
						fs.readFileSync(resolve('index.html'), 'utf-8'),
				  );
			//console.log('Html Template:\n', template);

			/** @type {typeof entryProd.render} */
			const render = isProd
				? entryProd.render
				: (await vite.ssrLoadModule('/src/entry-server.tsx')).render;

			const result = render(url);

			if (result.ctx.url) {
				// Somewhere a `<Redirect>` was rendered
				console.log(`Redirecting to ${result.ctx.url}`);
				// deepcode ignore OR: The consumer needs to ensure no Open Redirects can happen.
				return res.redirect(result.ctx.url, 301);
			}

			const html = template
				.replace(`<!--%app.body%-->`, result.body)
				.replace(`<!--%app.head%-->`, result.head);

			//console.log('Html Response:\n', html);

			// deepcode ignore XSS: Needed to render page, user needs to take care of XSS, deepcode ignore ServerLeak: Doesn't happen here
			res.status(200).contentType('text/html').end(html);
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

exports.createServer = createServer;
exports.resolve = resolve;
