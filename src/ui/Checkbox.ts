export function CheckboxContainer(label: HTMLElement, input: HTMLElement) {
	const container = document.createElement("div");
	container.className = "flex items-center content-around";
	label.classList.add("mr-2");
	container.appendChild(label);
	container.appendChild(input);

	return container;
}
