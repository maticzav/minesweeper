/**
 * Returns a function that constrains a number to the given range.
 */
export function limit({
	min,
	max,
}: {
	min: number;
	max: number;
}): (n: number) => number {
	return (n: number) => Math.min(max, Math.max(min, n));
}

/**
 * Makes a type check that is only valid when all cases of a switch
 * statement have been convered.
 */
export class ExhaustiveSwitchCheck extends Error {
	constructor(val: never) {
		super(`Unreachable case: ${JSON.stringify(val)}`);
	}
}
