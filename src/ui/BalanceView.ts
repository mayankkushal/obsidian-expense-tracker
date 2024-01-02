import { Account } from "src/models/account";
import { formatCurrency } from "src/utils/common";

export interface IBalanceView {
	el: HTMLElement;
	data?: Account | Account[];
	currency: string;
	hideCreationDate?: boolean;
	hidePath?: boolean;
}

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

export function BalanceView({
	el,
	data,
	currency,
	hideCreationDate = false,
	hidePath = false,
}: IBalanceView): void {
	if (data === undefined) {
		el.innerText = "No Data";
		return;
	}

	if (Array.isArray(data)) {
		flatAccountView(data, el, currency, hideCreationDate, hidePath);
	} else {
		nestedAccountView(data, el, currency);
	}
}

function flatAccountView(
	data: Account[],
	el: HTMLElement,
	currency: string,
	hideCreationDate: boolean,
	hidePath: boolean
): void {
	const table = document.createElement("table");
	table.className = "min-w-full divide-y divide-gray-200";

	// Create table header
	const thead = document.createElement("thead");
	const headerRow = document.createElement("tr");
	["Account", "Balance", "Creation Date", "Path"].forEach((headerText) => {
		if (headerText === "Creation Date" && hideCreationDate) {
			return;
		}

		if (headerText === "Path" && hidePath) {
			return;
		}

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
		balanceCell.textContent = formatCurrency(bank.balance, currency);
		row.appendChild(balanceCell);

		// Creation Date
		if (!hideCreationDate) {
			const creationDateCell = document.createElement("td");
			creationDateCell.className = "px-6 py-4 whitespace-nowrap";
			creationDateCell.textContent = bank.creationDate.toISOString();
			row.appendChild(creationDateCell);
		}

		// Path
		if (!hidePath) {
			const pathCell = document.createElement("td");
			pathCell.className = "px-6 py-4 whitespace-nowrap";
			pathCell.textContent = bank.path;
			row.appendChild(pathCell);
		}

		tbody.appendChild(row);
	});
	table.appendChild(tbody);

	el.appendChild(table);
}

const nestedAccountView = (
	data: Account,
	el: HTMLElement,
	currency: string
) => {
	const container = document.createElement("div");
	container.className = `border-l-2 ${getRandomBorderColor()} border-dotted p-1 mb-3`;

	// Create the outer div
	const outerDiv = document.createElement("div");

	// Create the span for the name with styling
	const nameSpan = document.createElement("span");
	nameSpan.classList.add("text-lg", "font-bold");
	nameSpan.style.color = "var(--text-success)";
	nameSpan.textContent = data.name;

	// Create the separator text
	const separatorText = document.createTextNode(" - ");

	// Create the span for the balance with styling
	const balanceSpan = document.createElement("span");
	balanceSpan.classList.add("text-base");
	balanceSpan.style.color = "var(--text-accent)";
	balanceSpan.textContent = formatCurrency(data.balance, currency);

	// Append the created elements to the outer div
	outerDiv.appendChild(nameSpan);
	outerDiv.appendChild(separatorText);
	outerDiv.appendChild(balanceSpan);

	// Append the outer div to the container
	container.appendChild(outerDiv);

	el.appendChild(container);

	if (data.children.length > 0) {
		const childrenContainer = document.createElement("div");
		childrenContainer.className = "ml-2";
		container.appendChild(childrenContainer);

		for (const child of data.children) {
			BalanceView({ el: childrenContainer, data: child, currency });
		}
	}
};
