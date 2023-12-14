export const isNumeric = (value: string): boolean => {
	return !isNaN(parseFloat(value)) && isFinite(Number(value));
};

export const formatDate = (date: Date): string => {
	return new Date(date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};
