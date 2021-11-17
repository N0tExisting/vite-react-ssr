import { Link } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { Helmet } from 'react-helmet-async';
import routes from 'virtual:generated-pages-react';

export function App() {
	return (
		<>
			<Helmet>
				<title>Vite React SSR</title>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Helmet>
			<nav>
				<ul>
					<li>
						<Link to="/">Home</Link>
						<Link to="/about">About</Link>
						<Link to="/env">Env</Link>
					</li>
				</ul>
			</nav>
			<div id="main">{renderRoutes(routes)}</div>
		</>
	);
}
