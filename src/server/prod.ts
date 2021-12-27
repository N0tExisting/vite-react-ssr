import '$util/env';
import createServer from '.';

const PORT =
	process.env.PORT || (import.meta.env.PORT as number | string) || 3000;

createServer()
	.then((server) => {
		server.app.listen(PORT, (err, addr) => {
			if (err) {
				console.error(err);
				process.exit(1);
				return;
			} else {
				console.log(`Server listening on ${addr}`);
			}
		});
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
