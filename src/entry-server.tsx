import { renderToString } from 'react-dom/server';
import type { StaticRouterContext } from 'react-router';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider, type FilledContext } from 'react-helmet-async';
import { App } from './App';

export function render(url: string) {
	const context = {};
	const helmetContext = {} as unknown as FilledContext;
	// TODO: Figure out link tags to send as headers!
	const body = renderToString(
		<HelmetProvider context={helmetContext}>
			<StaticRouter location={url} context={context}>
				<App />
			</StaticRouter>
		</HelmetProvider>,
	);
	const helmet = helmetContext.helmet;
	return {
		body,
		ctx: context as StaticRouterContext,
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

export { default as routes } from 'virtual:generated-pages-react';
export const handlers = import.meta.globEager('./routes/**/*.ts');
export const pages = import.meta.globEager('./routes/**/*.tsx');
