import createServer from '.';
export const viteNodeApp = createServer().then((obj) => obj.app);
