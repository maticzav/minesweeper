import React, {useReducer} from 'react';
import {generateGame} from '../lib/engine.js';
import {createUseContext} from '../lib/react.js';
import {Action, State, reduce} from '../lib/reducer.js';

type Context = {
	state: State;
	dispatch: (action: Action) => void;
};

const Context = React.createContext<Context | null>(null);

const CREATE_GAME = ({
	nOfMines,
	width,
	height,
}: {
	nOfMines: number;
	width: number;
	height: number;
}): State => {
	const game = generateGame({nOfMines, width, height});

	return {
		kind: 'playing',
		game,
		cursor: [0, 0],
		flags: new Set(),
		spaces: new Set(),
	};
};

/**
 * Utility wrapper that lets you use the context in your components.
 */
export const ContextProvider = ({
	nOfMines,
	width,
	height,
	children,
}: {
	nOfMines: number;
	width: number;
	height: number;
	children: React.ReactNode;
}) => {
	const [state, dispatch] = useReducer(
		reduce,
		{nOfMines, width, height},
		CREATE_GAME,
	);

	return (
		<Context.Provider value={{state, dispatch}}>{children}</Context.Provider>
	);
};

/**
 * Lets you access the context.
 */
export const useContext = createUseContext(Context, 'Context');
