import * as ReactDOMServer from 'react-dom/server';
import type { StaticRouterContext } from 'react-router';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider, FilledContext } from 'react-helmet-async';
import { App } from './App';

export function render(url: string) {
	const context = {};
	const helmetContext = {} as unknown as FilledContext;
	const body = ReactDOMServer.renderToString(
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
			helmet.title.toString(),
			helmet.base.toString(),
			helmet.meta.toString(),
			helmet.style.toString(),
			helmet.link.toString(),
			helmet.script.toString(),
			helmet.noscript.toString(),
		].join(''),
		titleAttr: helmet.titleAttributes.toString(),
		bodyAttr: helmet.bodyAttributes.toString(),
		htmlAttr: helmet.htmlAttributes.toString(),
	};
}
