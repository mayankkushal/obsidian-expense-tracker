export const formatAccountName = (accountName: string) => {
	const accountParts = accountName.split(":");
	// Create HTML with highlighted part
	return accountParts
		.map((part, index) =>
			index === accountParts.length - 1
				? `<span class="font-bold">${part}</span>`
				: `<span style="color: var(--text-muted)" class="text-xs text-muted">${part}</span>`
		)
		.join(":");
};
