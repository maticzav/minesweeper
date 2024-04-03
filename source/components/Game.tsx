import React, {useMemo} from 'react';
import {Box, Text} from 'ink';
import {Game} from '../lib/engine.js';
import {State} from '../lib/reducer.js';
import {ExhaustiveSwitchCheck} from '../lib/utils.js';

/**
 * Renders the game on the screen using the provided state.
 */
export function Game({state}: {state: State}) {
	switch (state.kind) {
		case 'won':
			return <Text color="green">You won!!! Press R to reset.</Text>;
		case 'lost':
			return <Text color="red">You lost... Press R to reset.</Text>;

		case 'playing':
			return (
				<Board
					game={state.game}
					flags={state.flags}
					spaces={state.spaces}
					cursor={state.cursor}
				/>
			);

		default:
			throw new ExhaustiveSwitchCheck(state);
	}
}

export function Board({
	game,
	flags,
	spaces,
	cursor,
}: {
	game: Game;
	flags: Set<number>;
	spaces: Set<number>;
	cursor: [x: number, y: number];
}) {
	const [cx, cy] = cursor;

	const Rows = useMemo(() => {
		const rows = [];

		for (let y = 0; y < game.height; y++) {
			const row = [];

			for (let x = 0; x < game.width; x++) {
				const space = game.spaces[y]![x]!;

				const i = y * game.width + x;
				const isCursor = cx === x && cy === y;

				const cellId = `cell:${x},${y}`;

				if (spaces.has(i)) {
					// NOTE: The player has already opened this space.
					if (space.kind === 'mine') {
						row.push(
							<Box key={cellId} width={3} height={3} padding={1}>
								<Text color={isCursor ? 'cyan' : 'red'}>O</Text>
							</Box>,
						);
						continue;
					}

					if (space.nOfNearbyMines === 0) {
						row.push(
							<Box key={cellId} width={3} height={3} padding={1}>
								{isCursor ? <Text color="cyan">•</Text> : null}
							</Box>,
						);
						continue;
					}

					if (space.nOfNearbyMines > 0) {
						row.push(
							<Box key={cellId} width={3} height={3} padding={1}>
								<Text color={isCursor ? 'cyan' : 'white'}>
									{space.nOfNearbyMines}
								</Text>
							</Box>,
						);
						continue;
					}
				}

				if (flags.has(i)) {
					// NOTE: The player has flagged this space.
					row.push(
						<Box key={cellId} width={3} height={3} padding={1}>
							<Text color={isCursor ? 'cyan' : 'green'}>F</Text>
						</Box>,
					);
					continue;
				}

				// NOTE: The player hasn't opened this space yet.
				row.push(
					<Box
						key={cellId}
						borderColor={isCursor ? 'cyan' : 'white'}
						width={3}
						height={3}
						padding={1}
					>
						<Text color={isCursor ? 'cyan' : 'white'}>•</Text>
					</Box>,
				);
			}

			const rowId = `row:${y}`;

			rows.push(
				<Box key={rowId} height={3} width={game.width * 3}>
					{row}
				</Box>,
			);
		}

		return rows;
	}, [game, flags, spaces, cx, cy]);

	return (
		<Box flexDirection="column" width={game.width * 3} height={game.height * 3}>
			{Rows}
		</Box>
	);
}
