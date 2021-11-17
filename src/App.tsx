import { Link } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import routes from "virtual:generated-pages-react";

export function App() {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/env">Env</Link>
          </li>
        </ul>
      </nav>
      <div>{renderRoutes(routes)}</div>
    </>
  );
}
