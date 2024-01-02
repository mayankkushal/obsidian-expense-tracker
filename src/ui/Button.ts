export function Button(props: {
	htmlType: "button" | "submit" | "reset";
	content: string;
	type?: string;
	extraClasses?: string;
}) {
	const { htmlType, content, type, extraClasses = "" } = props;
	let classes = "";

	if (type === "primary") {
		classes =
			"!bg-[--interactive-accent] hover:!bg-[--interactive-accent-hover]";
	}

	classes += extraClasses;

	const button = document.createElement("button");
	button.type = htmlType;
	button.className = `p-2 ${classes}`;
	button.textContent = content;
	return button;
}
