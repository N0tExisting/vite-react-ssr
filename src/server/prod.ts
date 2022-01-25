import '$util/env';
import createServer from '.';

const PORT = process.env.PORT || (import.meta.env.PORT as string) || 3000;

createServer()
	.then((server) => {
		server.app.listen(PORT, (err, addr) => {
			if (err) {
				console.error(err);
				process.exit(1);
				return;
			} else {
				console.log(`Server listening on '${addr}'`);
			}
		});
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});

export * from '.';
export { render } from '$server/renderer';
export { default as routes } from 'virtual:generated-pages-react';
export const handlers = import.meta.globEager('../routes/**/*.ts');
export const pages = import.meta.globEager('../routes/**/*.tsx');
