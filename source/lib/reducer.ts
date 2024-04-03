import {Game, generateGame, guess} from './engine.js';
import {limit} from './utils.js';

export type State =
	| {
			kind: 'playing';

			game: Game;

			/**
			 * The x and y position of the cursor in the game.
			 */
			cursor: [x: number, y: number];

			/**
			 * Flags placed in the game.
			 */
			flags: Set<number>;

			/**
			 * Uncovered spaces in the game.
			 */
			spaces: Set<number>;
	  }
	| {
			kind: 'won';
			game: Game;
	  }
	| {
			kind: 'lost';
			game: Game;
	  };

export type Action =
	| {
			/**
			 * Creates a new game with the same parameters.
			 */
			kind: 'reset';
	  }
	| {
			/**
			 * Moves the cursor by the given amount, respecting the edges of the board.
			 */
			kind: 'move';
			dx: number;
			dy: number;
	  }
	| {
			/**
			 * Toggles the flag at the cursor's position.
			 */
			kind: 'flag';
	  }
	| {
			/**
			 * Opens the space at the cursor's position.
			 */
			kind: 'open';
	  };

/**
 * Moves the game into the next state.
 */
export function reduce(state: State, action: Action): State {
	switch (action.kind) {
		case 'reset': {
			const game = generateGame({
				nOfMines: state.game.nOfMines,
				width: state.game.width,
				height: state.game.height,
			});

			return {
				kind: 'playing',
				game,
				cursor: [0, 0],
				flags: new Set(),
				spaces: new Set(),
			};
		}

		case 'move': {
			if (state.kind !== 'playing') {
				return state;
			}

			const [_x, _y] = state.cursor;

			const x = limit({min: 0, max: state.game.width - 1})(_x + action.dx);
			const y = limit({min: 0, max: state.game.height - 1})(_y + action.dy);

			return {...state, cursor: [x, y]};
		}

		case 'flag': {
			if (state.kind !== 'playing') {
				return state;
			}

			const [_x, _y] = state.cursor;

			const i = state.game.width * _y + _x;

			const flags = new Set(state.flags);
			if (flags.has(i)) {
				flags.delete(i);
			} else {
				flags.add(i);
			}

			return {...state, flags};
		}

		case 'open': {
			if (state.kind !== 'playing') {
				return state;
			}

			const [_x, _y] = state.cursor;

			const result = guess(state.game, [_x, _y]);
			if (result.kind === 'mine') {
				return {kind: 'lost', game: state.game};
			}

			const spaces = new Set(state.spaces);
			for (const i of result.spaces) {
				spaces.add(i);
			}

			if (
				spaces.size ===
				state.game.width * state.game.height - state.game.nOfMines
			) {
				return {kind: 'won', game: state.game};
			}

			return {...state, spaces};
		}
	}
}
