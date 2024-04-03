import React from 'react';
import {useContext} from './components/Context.js';
import {Game} from './components/Game.js';
import {useInput} from 'ink';

/**
 * The main component for the minesweeper game.
 */
export default function App() {
	const {state, dispatch} = useContext();

	useInput(input => {
		if (input === 'q') {
			process.exit(0);
		}

		switch (input) {
			// CONTROLS
			case ' ':
				dispatch({kind: 'open'});
				break;
			case 'f':
				dispatch({kind: 'flag'});
				break;
			case 'q':
				process.exit(0);
			case 'r':
				dispatch({kind: 'reset'});
				break;

			// CURSOR
			case 'w':
				dispatch({kind: 'move', dx: 0, dy: -1});
				break;
			case 'a':
				dispatch({kind: 'move', dx: -1, dy: 0});
				break;
			case 's':
				dispatch({kind: 'move', dx: 0, dy: 1});
				break;
			case 'd':
				dispatch({kind: 'move', dx: 1, dy: 0});
				break;
		}
	});

	return <Game state={state} />;
}
