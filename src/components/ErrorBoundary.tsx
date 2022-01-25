import { VFC, Component, PropsWithChildren, ReactNode } from 'react';

export type onErrorHandler = (
	error: unknown,
	errorInfo: unknown,
	reset: () => void,
) => void;

export type onErrorFallback = (
	error: unknown,
	errorInfo: unknown,
	reset: () => void,
) => ReactNode;

export type DefaultFallbackProps = {
	err: unknown;
	info: unknown;
	reset: () => void;
};

export const DefaultFallback: VFC<DefaultFallbackProps> = (props) => {
	return (
		<section>
			<h1>Something went wrong!</h1>
			<button type="reset" onClick={props.reset}>
				Reset
			</button>
			{props.info && (
				<div>
					<h2>Info:</h2>
					<pre>
						<code>{JSON.stringify(props.info, undefined, '\t')}</code>
					</pre>
				</div>
			)}
			{props.err && (
				<div>
					<h2>Error:</h2>
					<pre>
						<code>{JSON.stringify(props.err, undefined, '\t')}</code>
					</pre>
				</div>
			)}
		</section>
	);
};

// prettier-ignore
export type ErrorBoundaryProps = (
	{
		onError: onErrorHandler;
		fallback?: ReactNode;
	}
	|
	{
		fallback?: onErrorFallback;
	}
);

// prettier-ignore
type ErrorBoundaryState = (
	{
		hasError: true;
		errorInfo?: unknown;
		error: unknown;
	}
	|
	{
		hasError: false;
	}
);

export default class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: PropsWithChildren<ErrorBoundaryProps>) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: never) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true, error };
	}

	reset() {
		this.setState({ hasError: false, errorInfo: undefined, error: undefined });
	}

	override componentDidCatch(error: unknown, errorInfo: unknown) {
		// You can also log the error to an error reporting service
		this.setState({ hasError: true, errorInfo, error });
		if (this.state.hasError) {
			// @ts-expect-error `this.props.onError` can be a function
			if (typeof this.props.onError === 'function') {
				// @ts-expect-error we just checked that `this.props.onError` is a function
				this.props.onError(this.state.error, this.state.errorInfo, this.reset);
			} else {
				console.error('Error Rendering Components:\n', errorInfo, error);
			}
		}
	}

	override render() {
		if (this.state.hasError) {
			// @ts-expect-error `this.props.onError`can be a function
			if (typeof this.props.onError === 'function') {
				return (
					this.props.fallback || (
						<DefaultFallback
							reset={this.reset}
							info={this.state.errorInfo}
							err={this.state.error}
						/>
					)
				);
			} else {
				return this.props.fallback ? (
					// @ts-expect-error
					this.props.fallback(
						this.state.error,
						this.state.errorInfo,
						this.reset,
					)
				) : (
					<DefaultFallback
						reset={this.reset}
						info={this.state.errorInfo}
						err={this.state.error}
					/>
				);
			}
		} else {
			return this.props.children;
		}
	}
}
