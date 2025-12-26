import { useQuery } from '@tanstack/react-query'
import { Token, TokenPrice } from '@/types/token'

const PRICES_API_URL = 'https://interview.switcheo.com/prices.json'
const ICON_BASE_URL = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens'

const fetchTokenPrices = async (): Promise<Token[]> => {
	const response = await fetch(PRICES_API_URL)
	if (!response.ok) {
		throw new Error('Failed to fetch token prices')
	}

	const tokenPrices: TokenPrice[] = await response.json()

	// Group by currency and get the latest price (highest date)
	const latestPrices = new Map<string, TokenPrice>()

	tokenPrices.forEach((tokenPrice: TokenPrice) => {
		if (!tokenPrice.price) return

		const existing = latestPrices.get(tokenPrice.currency)
		if (!existing || new Date(tokenPrice.date) > new Date(existing.date)) {
			latestPrices.set(tokenPrice.currency, tokenPrice)
		}
	})

	// Convert to Token array with icon URLs
	const tokens: Token[] = Array.from(latestPrices.values())
		.filter((p) => p.price > 0)
		.map((p) => ({
			currency: p.currency,
			price: p.price,
			iconUrl: `${ICON_BASE_URL}/${p.currency}.svg`,
		}))
		.sort((a, b) => a.currency.localeCompare(b.currency))

	return tokens
}

export const useTokens = () => {
	return useQuery({
		queryKey: ['tokens'],
		queryFn: fetchTokenPrices,
		staleTime: 60 * 1000, // 1 minute
		refetchInterval: 60 * 1000, // Refetch every minute
	})
}

export const calculateExchangeRate = (fromToken: Token | undefined, toToken: Token | undefined): number | null => {
	if (!fromToken || !toToken) return null
	return toToken.price / fromToken.price
}

export const calculateToAmount = (
	fromAmount: number,
	fromToken: Token | undefined,
	toToken: Token | undefined
): number | null => {
	if (!fromToken || !toToken || fromAmount <= 0) return null
	const rate = calculateExchangeRate(toToken, fromToken)
	if (rate === null) return null
	return fromAmount * rate
}
