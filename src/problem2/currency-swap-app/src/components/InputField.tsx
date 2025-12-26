import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface InputFieldProps {
	value: string
	onChange?: (value: string) => void
	readOnly?: boolean
	error?: string
	placeholder?: string
}

export const InputField = ({ value, onChange, readOnly = false, error, placeholder = '0.00' }: InputFieldProps) => {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value
		// Allow empty, numbers, and decimals
		if (newValue === '' || /^\d*\.?\d*$/.test(newValue)) {
			onChange?.(newValue)
		}
	}

	return (
		<div className="flex flex-col gap-1">
			<Input
				type="text"
				value={value}
				onChange={handleChange}
				readOnly={readOnly}
				placeholder={placeholder}
				className={cn(
					'h-14 text-2xl font-semibold border-0 bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0',
					error && 'text-destructive'
				)}
			/>
			{error && <span className="text-sm text-destructive">{error}</span>}
		</div>
	)
}
