export function Tab({
	text,
	defaultActive,
}: {
	text: string;
	defaultActive?: boolean;
}) {
	const tab = document.createElement("div");
	tab.className =
		"tab tab-general p-4 rounded-t-md cursor-pointer [&.active]:bg-[--interactive-accent] hover:bg-[--interactive-accent-hover]";
	if (defaultActive) {
		tab.classList.add("active");
	}
	tab.textContent = text;
	return tab;
}
