export const isNumeric = (value: string): boolean => {
	return !isNaN(parseFloat(value)) && isFinite(Number(value));
};

export const formatDisplayDate = (date: Date): string => {
	return new Date(date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

// Method to format number to currency
export const formatCurrency = (value: number, currency: string): string => {
	const formatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
	});
	return formatter.format(value);
};

export const formatDate = (date: Date): string => {
	// convert date to yyyy-mm-dd format
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	return `${year}-${month}-${day}`;
};
