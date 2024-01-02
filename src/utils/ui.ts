export const formatAccountName = (
	el: HTMLElement,
	accountName: string
): void => {
	const accountParts = accountName.split(":");

	// Clear existing content from the element
	el.innerHTML = "";

	// Add spans to the element with the formatted account name
	accountParts.forEach((part, index) => {
		const span = document.createElement("span");
		if (index === accountParts.length - 1) {
			span.classList.add("font-bold");
		} else {
			span.style.color = "var(--text-muted)";
			span.classList.add("text-xs", "text-muted");
		}
		span.textContent = part;
		el.appendChild(span);

		// Add a colon after each part, except the last one
		if (index < accountParts.length - 1) {
			const colonSpan = document.createElement("span");
			colonSpan.textContent = ":";
			el.appendChild(colonSpan);
		}
	});
};
