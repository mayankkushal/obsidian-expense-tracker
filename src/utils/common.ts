export const isNumeric = (value: string): boolean => {
	return !isNaN(parseFloat(value)) && isFinite(Number(value));
};
