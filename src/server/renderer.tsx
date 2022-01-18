import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import type { StaticRouterContext } from 'react-router';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider, type FilledContext } from 'react-helmet-async';
import { App } from '$src/App';

export async function render(url: string) {
	const context = {} as unknown as StaticRouterContext;
	const helmetContext = {} as unknown as FilledContext;
	// TODO: Figure out link tags to send as headers!
	const body = renderToString(
		<StrictMode>
			<HelmetProvider context={helmetContext}>
				<StaticRouter location={url} context={context}>
					<App />
				</StaticRouter>
			</HelmetProvider>
		</StrictMode>,
	);
	const helmet = helmetContext.helmet;
	return {
		body,
		ctx: context,
		head: [
			helmet.title?.toString(),
			helmet.base?.toString(),
			helmet.meta?.toString(),
			helmet.style?.toString(),
			helmet.link?.toString(),
			helmet.script?.toString(),
			helmet.noscript?.toString(),
		].join(''),
		helmet,
	};
}
