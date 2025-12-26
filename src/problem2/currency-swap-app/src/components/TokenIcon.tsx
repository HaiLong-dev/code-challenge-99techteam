interface TokenIconProps {
	iconUrl: string
}

export const TokenIcon = ({ iconUrl }: TokenIconProps) => {
	return <img src={iconUrl} className={`h-5 w-5 rounded-full object-contain`} />
}
