import ReactDOMServer from "react-dom/server";
import type { StaticRouterContext } from "react-router";
import { StaticRouter } from "react-router-dom";
import { App } from "./App";

export function render(url: string, context?: StaticRouterContext) {
  return ReactDOMServer.renderToString(
    <StaticRouter location={url} context={context}>
      <App />
    </StaticRouter>
  );
}
