import React, { useMemo } from 'react'

interface WalletBalance {
	currency: string
	amount: number
	blockchain: string // Added missing property
}

interface FormattedWalletBalance extends WalletBalance {
	formatted: string
}

interface BoxProps {}

// Defined the name of props appropriate with the component
interface WalletPageProps extends BoxProps {
  children: React.ReactNode
}

// Move priority mapping outside to prevent re-declaration on every render
// Easy to access + read + maintain
const PRIORITY_MAP: Record<string, number> = {
	Osmosis: 100,
	Ethereum: 50,
	Arbitrum: 30,
	Zilliqa: 20,
	Neo: 20,
}

const getPriority = (blockchain: string): number => PRIORITY_MAP[blockchain] ?? -99

const WalletPage: React.FC<WalletPageProps> = (props: WalletPageProps) => {
	const { children, ...rest } = props
	const balances = useWalletBalances()
	const prices = usePrices()

	// Optimized sorting and filtering
	const sortedBalances = useMemo(() => {
		return balances
			.filter((balance: WalletBalance) => {
				const priority = getPriority(balance.blockchain)
				return priority > -99 && balance.amount > 0 // Fixed logic: keep positive balances
			})
			.sort((lhs, rhs) => getPriority(rhs.blockchain) - getPriority(lhs.blockchain))
	}, [balances]) // prices dependency not properly here because the function is not used any prices const

  // Remove this because redundant data transformation
  // const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
  //   return {
  //     ...balance,
  //     formatted: balance.amount.toFixed()
  //   }
  // })

// useMemo to prevent UI re-calculation unless balances or prices change
	const rows = useMemo(() => {
// Mismatch type of WalletBalance not FormattedWalletBalance
  return sortedBalances.map((balance: WalletBalance) => {
    const usdValue = (prices[balance.currency] || 0) * balance.amount;

    // Calculate Formatting Amount here instead of define formattedBalances because a new array reference is created on every single render
    const formattedAmount = balance.amount.toFixed();

    return (
      <WalletRow 
        className={classes.row}
		// Using index is anti-pattern, it can cause potential bug -> use composite key instead
        key={`${balance.blockchain}-${balance.currency}`}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={formattedAmount}
      />
    );
  });
}, [sortedBalances, prices]);

	return <div {...rest}>{rows}</div>
}
