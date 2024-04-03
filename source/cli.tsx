#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';
import {ContextProvider} from './components/Context.js';

const cli = meow(
	`
	Usage
	  $ minesweeper

	Options
		--difficulty Number of mines

	Examples
	  $ minesweeper --difficulty=10
`,
	{
		importMeta: import.meta,
		flags: {
			difficulty: {
				type: 'number',
				default: 5,
			},
			height: {
				type: 'number',
				default: 5,
			},
			width: {
				type: 'number',
				default: 6,
			},
		},
	},
);

render(
	<ContextProvider
		nOfMines={cli.flags.difficulty}
		width={cli.flags.width}
		height={cli.flags.height}
	>
		<App />
	</ContextProvider>,
);
