import { useState, useMemo } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'
import { Token } from '@/types/token'
import { TokenIcon } from './TokenIcon'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface TokenSelectorProps {
	tokens: Token[]
	selectedToken: Token | undefined
	onSelect: (token: Token) => void
	placeholder?: string
}

export const TokenSelector = ({
	tokens,
	selectedToken,
	onSelect,
	placeholder = 'Select token',
}: TokenSelectorProps) => {
	const [open, setOpen] = useState(false)
	const [search, setSearch] = useState('')

	const filteredTokens = useMemo(() => {
		return tokens.filter((token) => {
			if (search) {
				return token.currency.toLowerCase().includes(search.toLowerCase())
			}
			return true
		})
	}, [tokens, search])

	const handleSelect = (token: Token) => {
		onSelect(token)
		setOpen(false)
		setSearch('')
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					type="button"
					className={cn(
						'flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm',
						'hover:bg-accent'
					)}
				>
					{selectedToken ? (
						<>
							<div className="flex items-center gap-2">
								<TokenIcon iconUrl={selectedToken.iconUrl} />
								<span>{selectedToken.currency}</span>
							</div>
							<ChevronDown className="h-4 w-4 opacity-50" />
						</>
					) : (
						<>
							<span className="text-muted-foreground">{placeholder}</span>
							<ChevronDown className="h-4 w-4 opacity-50" />
						</>
					)}
				</button>
			</PopoverTrigger>
			<PopoverContent className="p-0" align="start">
				<div className="border-b border-border p-2">
					<div className="relative">
						<Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search tokens..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="pl-8 h-9"
						/>
					</div>
				</div>
				<div className="max-h-[280px] overflow-y-auto p-1">
					{filteredTokens.length === 0 ? (
						<div className="py-6 text-center text-sm text-muted-foreground">No tokens found</div>
					) : (
						filteredTokens.map((token: Token) => (
							<button
								key={token.currency}
								onClick={() => handleSelect(token)}
								className={cn(
									'flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent',
									selectedToken?.currency === token.currency && 'bg-accent'
								)}
							>
								<TokenIcon iconUrl={token.iconUrl} />
								<span className="flex-1 text-left font-medium">{token.currency}</span>
								{selectedToken?.currency === token.currency && (
									<Check className="h-4 w-4 text-primary" />
								)}
							</button>
						))
					)}
				</div>
			</PopoverContent>
		</Popover>
	)
}
