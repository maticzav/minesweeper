import {Context, useContext} from 'react';

/**
 * Let's you create a hook from a React context that may be safely used in the app.
 */
export function createUseContext<ContextValue>(
	context: Context<ContextValue>,
	name: string,
): () => NonNullable<ContextValue> {
	return function useAppContext() {
		const value = useContext(context);

		if (!value) {
			throw new Error(`The context "${name}" is not available.`);
		}

		return value;
	};
}
