///	<reference path="$server/plugin.d.ts" />
import type { ViteDevServer } from 'vite';

declare module '#vitify/vite' {
	export let vite: ViteDevServer | undefined;
}
