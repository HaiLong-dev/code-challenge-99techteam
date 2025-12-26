import { isInt } from '../utils/helper'

export const sum_to_n_a = (n: number): number => {
	isInt(n)

	if (n === 0) return 0

	let sum = 0

	if (n > 0) {
		for (let i = 1; i <= n; i++) {
			sum += i
		}
	} else {
		for (let i = 1; i >= n; i--) {
			sum += i
		}
	}

	return sum
}

export const sum_to_n_b = (n: number): number => {
	isInt(n)

	let result: number

	if (n >= 0) {
		result = (n * (n + 1)) / 2
	} else {
		const abs = Math.abs(n)
		result = 1 - (abs * (abs + 1)) / 2
	}

	// normalize -0 -> 0
	return Object.is(result, -0) ? 0 : result
}

export const sum_to_n_c = (n: number): number => {
	isInt(n)

	if (n === 0) return 0
	if (n === 1) return 1
	if (n === -1) return 0

	if (n > 1) {
		return n + sum_to_n_c(n - 1)
	} else {
		return n + sum_to_n_c(n + 1)
	}
}
