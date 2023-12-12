import { Account } from "src/models/account";

function getRandomBorderColor(): string {
	const colors = [
		"border-l-red-500",
		"border-l-yellow-500",
		"border-l-green-500",
		"border-l-blue-500",
		"border-l-indigo-500",
		"border-l-purple-500",
		"border-l-pink-500",
	];

	const randomIndex = Math.floor(Math.random() * colors.length);
	return colors[randomIndex];
}

export function BalanceView(el: HTMLElement, data: Account | Account[]): void {
	if (Array.isArray(data)) {
		flatAccountView(data, el);
	} else {
		nestedAccountView(data, el);
	}
}

function flatAccountView(data: Account[], el: HTMLElement): void {
	const table = document.createElement("table");
	table.className = "min-w-full divide-y divide-gray-200";

	// Create table header
	const thead = document.createElement("thead");
	const headerRow = document.createElement("tr");
	["Account", "Balance", "Creation Date", "Path"].forEach((headerText) => {
		const th = document.createElement("th");
		th.className =
			"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";
		th.textContent = headerText;
		headerRow.appendChild(th);
	});
	thead.appendChild(headerRow);
	table.appendChild(thead);

	// Create table body
	const tbody = document.createElement("tbody");
	data.forEach((bank) => {
		const row = document.createElement("tr");

		const nameCell = document.createElement("td");
		nameCell.className = "px-6 py-4 whitespace-nowrap";
		nameCell.textContent = bank.name;
		row.appendChild(nameCell);

		const balanceCell = document.createElement("td");
		balanceCell.className = "px-6 py-4 whitespace-nowrap";
		balanceCell.textContent = bank.balance.toString();
		row.appendChild(balanceCell);

		const creationDateCell = document.createElement("td");
		creationDateCell.className = "px-6 py-4 whitespace-nowrap";
		creationDateCell.textContent = bank.creationDate.toISOString();
		row.appendChild(creationDateCell);

		const pathCell = document.createElement("td");
		pathCell.className = "px-6 py-4 whitespace-nowrap";
		pathCell.textContent = bank.path;
		row.appendChild(pathCell);

		tbody.appendChild(row);
	});
	table.appendChild(tbody);

	el.appendChild(table);
}

const nestedAccountView = (data: Account, el: HTMLElement) => {
	const container = document.createElement("div");
	container.className = `border-l-2 ${getRandomBorderColor()} border-dotted p-1 mb-3`;

	container.innerHTML = `
		<div><span class="text-lg font-bold" style="color: var(--text-success);">${data.name}</span> - <span class="text-base" style="color: var(--text-accent)"> ${data.balance}</span></div>
		`;

	el.appendChild(container);

	if (data.children.length > 0) {
		const childrenContainer = document.createElement("div");
		childrenContainer.className = "ml-2";
		container.appendChild(childrenContainer);

		for (const child of data.children) {
			BalanceView(childrenContainer, child);
		}
	}
};
