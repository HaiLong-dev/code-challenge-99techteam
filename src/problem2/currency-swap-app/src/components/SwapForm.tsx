import { useState, useMemo, useCallback } from 'react'
import { ArrowDownUp, Loader2 } from 'lucide-react'
import { useTokens, calculateToAmount } from '@/hooks/useTokens'
import { Token } from '@/types/token'
import { TokenSelector } from './TokenSelector'
import { InputField } from './InputField'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'

export const SwapForm = () => {
	const { data: tokens = [], isLoading, isError } = useTokens()

	const [fromToken, setFromToken] = useState<Token | undefined>()
	const [toToken, setToToken] = useState<Token | undefined>()
	const [fromAmount, setFromAmount] = useState('')
	const [isSwapping, setIsSwapping] = useState(false)

	// Calculate the "to" amount based on exchange rate
	const toAmount = useMemo(() => {
		const amount = parseFloat(fromAmount)
		if (isNaN(amount) || amount <= 0) return ''

		const result = calculateToAmount(amount, fromToken, toToken)
		if (result === null) return ''

		// Format to reasonable decimal places
		return result.toFixed(6).replace(/\.?0+$/, '')
	}, [fromAmount, fromToken, toToken])

	// Exchange rate display
	const exchangeRate = useMemo(() => {
		if (!fromToken || !toToken) return null
		const rate = fromToken.price / toToken.price
		return `1 ${fromToken.currency} = ${rate.toFixed(6).replace(/\.?0+$/, '')} ${toToken.currency}`
	}, [fromToken, toToken, fromAmount])

	// Validation
	const validationError = useMemo(() => {
		if (!fromAmount) return null
		const amount = parseFloat(fromAmount)
		if (isNaN(amount)) return 'Please enter a valid number'
		if (amount <= 0) return 'Amount must be greater than 0'
		return null
	}, [fromAmount])

	const canSubmit = useMemo(() => {
		return fromToken && toToken && fromAmount && !validationError && parseFloat(fromAmount) > 0
	}, [fromToken, toToken, fromAmount, validationError])

	// Swap the tokens
	const handleSwapTokens = useCallback(() => {
		const tempToken = fromToken
		const tempAmount = toAmount

		setFromToken(toToken)
		setToToken(tempToken)

		// Set the previous "to" amount as the new "from" amount
		if (tempAmount) {
			setFromAmount(tempAmount)
		}
	}, [fromToken, toToken, toAmount])

	const handleSwap = async () => {
		if (!canSubmit) return

		setIsSwapping(true)

		await new Promise((resolve) => setTimeout(resolve, 1500))

		toast({
			title: 'Swap Successful!',
			description: `Swapped ${fromAmount} ${fromToken?.currency} for ${toAmount} ${toToken?.currency}`,
		})

		// Reset form
		setFromAmount('')
		setIsSwapping(false)
	}

	if (isLoading) {
		return (
			<div className="flex justify-center">
				<Loader2 className="h-8 w-8 animate-spin" />
			</div>
		)
	}

	if (isError) {
		return (
			<div className="flex justify-center">
				<p className="text-destructive">Failed to load tokens. Please try again.</p>
			</div>
		)
	}

	return (
		<Card className="w-full max-w-md mx-auto shadow-lg">
			<CardHeader className="pb-4">
				<CardTitle className="text-xl font-semibold text-center">Swap Tokens</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* From Section */}
				<>
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium text-muted-foreground">From</span>
						<TokenSelector tokens={tokens} selectedToken={fromToken} onSelect={setFromToken} />
					</div>

					<div className="rounded-md shadow-sm bg-muted px-2">
						<InputField value={fromAmount} onChange={setFromAmount} error={validationError || undefined} />
					</div>
				</>

				{/* Swap Button */}
				<div className="flex justify-center">
					<Button
						type="button"
						variant="outline"
						size="icon"
						className="rounded-full h-10 w-10 bg-background border-2 shadow-sm hover:bg-accent"
						onClick={handleSwapTokens}
						disabled={!fromToken && !toToken}
					>
						<ArrowDownUp className="h-4 w-4" />
					</Button>
				</div>

				{/* To Section */}
				<div className="flex items-center justify-between">
					<span className="text-sm font-medium text-muted-foreground">To</span>
					<TokenSelector tokens={tokens} selectedToken={toToken} onSelect={setToToken} />
				</div>

				<div className="rounded-md shadow-sm bg-muted px-2">
					<InputField value={toAmount} readOnly />
				</div>

				{/* Exchange Rate */}
				{exchangeRate && <div className="text-center text-sm text-muted-foreground py-2">{exchangeRate}</div>}

				{/* Submit Button */}
				<Button
					type="button"
					className="w-full h-12 text-base font-semibold"
					disabled={!canSubmit || isSwapping}
					onClick={handleSwap}
				>
					{isSwapping ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Swapping...
						</>
					) : (
						'Swap'
					)}
				</Button>
			</CardContent>
		</Card>
	)
}
