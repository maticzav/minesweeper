/**
 * Represents a single space in the minesweeper game.
 */
export type Space =
	| {
			kind: 'mine';
	  }
	| {
			kind: 'empty';
			nOfNearbyMines: number;
	  };

export type Game = {
	spaces: Space[][];

	width: number;
	height: number;

	/**
	 * Number of mines in the game.
	 */
	nOfMines: number;

	/**
	 * List of empty index spaces.
	 */
	empty: Set<number>;
};

const NEARBY_SPACES: [dx: number, dy: number][] = [
	[-1, -1],
	[-1, 0],
	[-1, 1],
	[0, -1],
	[0, 1],
	[1, -1],
	[1, 0],
	[1, 1],
];

const COMPASS_SPACES: [dx: number, dy: number][] = [
	[-1, 0],
	[0, 1],
	[1, 0],
	[0, -1],
];

/**
 * Returns a new minesweeper game.
 */
export function generateGame({
	width,
	height,
	nOfMines,
}: {
	width: number;
	height: number;
	nOfMines: number;
}): Game {
	const game: Space[][] = [];
	const spaces: Set<number> = new Set();

	for (let i = 0; i < height; i++) {
		const row: Space[] = [];

		for (let j = 0; j < width; j++) {
			const index = i * width + j;
			spaces.add(index);

			row.push({kind: 'empty', nOfNearbyMines: 0});
		}

		game.push(row);
	}

	if (nOfMines > width * height) {
		throw new Error('Too many mines');
	}

	const nOfSpaces = width * height;

	// NOTE: Then we populate the game with mines.
	while (spaces.size > nOfSpaces - nOfMines) {
		const index = Math.floor(Math.random() * spaces.size);
		spaces.delete(index);

		const x = index % width;
		const y = Math.floor(index / width);

		game[y]![x] = {kind: 'mine'};
	}

	const $ = (x: number, y: number) => {
		if (x < 0 || y < 0 || x >= width || y >= height) {
			return 0;
		}

		if (game[y]![x]!.kind === 'mine') {
			return 1;
		}

		return 0;
	};

	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width; j++) {
			const space = game[i]![j]!;
			if (space.kind === 'mine') {
				continue;
			}

			for (const [dx, dy] of NEARBY_SPACES) {
				const x = j + dx;
				const y = i + dy;

				space.nOfNearbyMines += $(x, y);
			}
		}
	}

	return {spaces: game, width, height, nOfMines, empty: spaces};
}

/**
 * Guesses the state of a space in the minesweeper game.
 */
export function guess(
	game: Game,
	position: [x: number, y: number],
):
	| {
			kind: 'mine';
	  }
	| {
			kind: 'empty';
			/**
			 * A set of spaces that because open because of the guess.
			 */
			spaces: Set<number>;
	  } {
	const [x, y] = position;

	if (game.spaces[y]![x]!.kind === 'mine') {
		return {kind: 'mine'};
	}

	const spaces = new Set<number>();
	const queue: [x: number, y: number][] = [[x, y]];

	while (queue.length > 0) {
		const [x, y] = queue.shift()!;
		const space = game.spaces[y]![x]!;

		if (space.kind === 'mine') {
			// NOTE: We do not open a mine unless the user explicitly clicked on it.
			continue;
		}

		spaces.add(game.width * y + x);

		if (space.nOfNearbyMines === 0) {
			// NOTE: The space has no mines, so we open all of its neighbors.

			neighbors: for (const [dx, dy] of COMPASS_SPACES) {
				const px = x + dx;
				const py = y + dy;

				if (px < 0 || py < 0 || px >= game.width || py >= game.height) {
					continue neighbors;
				}

				if (game.spaces[py]![px]!.kind === 'mine') {
					continue neighbors;
				}

				if (spaces.has(game.width * py + px)) {
					continue neighbors;
				}

				queue.push([px, py]);
			}
		}
	}

	return {kind: 'empty', spaces};
}
