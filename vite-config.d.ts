/// <reference path="./src/server/plugin.d.ts" />
/// <reference types="middie" />
import { type SSROptions } from 'vite';

declare module 'vite' {
	interface UserConfig {
		ssr?: SSROptions;
	}
}
