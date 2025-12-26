import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from './solution'

describe('sum_to_n functions', () => {
	const implementations = [
		{ name: 'sum_to_n_a (loop)', fn: sum_to_n_a },
		{ name: 'sum_to_n_b (formula)', fn: sum_to_n_b },
		{ name: 'sum_to_n_c (recursion)', fn: sum_to_n_c },
	]

	implementations.forEach(({ name, fn }) => {
		describe(name, () => {
			describe('valid integer input', () => {
				test('n > 0', () => {
					expect(fn(1)).toBe(1)
					expect(fn(5)).toBe(15)
					expect(fn(10)).toBe(55)
				})

				test('n = 0', () => {
					expect(fn(0)).toBe(0)
				})

				test('n < 0', () => {
					expect(fn(-1)).toBe(0)
					expect(fn(-3)).toBe(-5)
					expect(fn(-5)).toBe(-14)
				})
			})

			describe('invalid non-integer input', () => {
				test('throws error for positive decimal', () => {
					expect(() => fn(1.5)).toThrow()
				})

				test('throws error for negative decimal', () => {
					expect(() => fn(-2.3)).toThrow()
				})

				test('throws error for NaN', () => {
					expect(() => fn(NaN)).toThrow()
				})
			})
		})
	})
})
