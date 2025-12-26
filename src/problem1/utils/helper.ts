export const isInt = (n: number): void => {
	if (!Number.isInteger(n)) {
		throw new Error('Input n must be an integer!')
	}
}
