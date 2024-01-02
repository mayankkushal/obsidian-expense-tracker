import { Transaction } from "src/models/transaction";
import { formatCurrency, formatDisplayDate } from "src/utils/common";
import { formatAccountName } from "src/utils/ui";

export interface ITransactionView {
	el: HTMLElement;
	data: Transaction[];
	structure?: string;
	currency?: string;
	hideTotal?: boolean;
}

export const TransactionView = ({
	el,
	data,
	structure = "flat",
	currency = "",
	hideTotal = false,
}: ITransactionView) => {
	switch (structure) {
		case "flat":
			createTransactionTable(el, data, currency, hideTotal);
			break;
		case "nested":
			createNestedTransactionList(el, data, currency);
			break;
	}
};

export function createTransactionTable(
	el: HTMLElement,
	data: Transaction[],
	currency: string,
	hideTotal?: boolean
): void {
	const table = document.createElement("table");
	table.className = "min-w-full divide-y divide-gray-200";

	// Create table header
	const thead = document.createElement("thead");
	const headerRow = document.createElement("tr");
	["Date", "Description", "To Account", "From Account", "Total"].forEach(
		(headerText) => {
			const th = document.createElement("th");
			th.className =
				"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";
			th.textContent = headerText;
			headerRow.appendChild(th);
		}
	);
	thead.appendChild(headerRow);
	table.appendChild(thead);

	// Create table body
	const tbody = document.createElement("tbody");

	let tableTotal = 0;

	data.forEach((transaction) => {
		const row = document.createElement("tr");

		const dateCell = document.createElement("td");
		dateCell.className = "px-6 py-4 whitespace-nowrap";
		dateCell.textContent = formatDisplayDate(transaction.date);
		row.appendChild(dateCell);

		const descriptionCell = document.createElement("td");
		descriptionCell.className = "px-6 py-4 whitespace-nowrap";
		descriptionCell.textContent = transaction.description || "";
		row.appendChild(descriptionCell);

		const toAccountCell = document.createElement("td");
		toAccountCell.className = "px-6 py-4 whitespace-nowrap";

		const fromAccountCell = document.createElement("td");
		fromAccountCell.className = "px-6 py-4 whitespace-nowrap";

		const totalCell = document.createElement("td");
		totalCell.className = "px-6 py-4 whitespace-nowrap";

		const positiveEntries = transaction.entries.filter(
			(entry) => entry.amount! > 0
		);
		const negativeEntries = transaction.entries.filter(
			(entry) => entry.amount! < 0
		);

		// Determine if there are multiple accounts for "To Account"
		if (!positiveEntries.length) {
			toAccountCell.textContent = "";
		} else if (positiveEntries.length > 1) {
			toAccountCell.textContent = "Multiple accounts";
		} else {
			formatAccountName(toAccountCell, positiveEntries[0]?.accountName);
		}

		// Determine if there are multiple accounts for "From Account"
		if (!negativeEntries.length) {
			fromAccountCell.textContent = "";
		} else if (negativeEntries.length > 1) {
			fromAccountCell.textContent = "Multiple accounts";
		} else {
			formatAccountName(fromAccountCell, negativeEntries[0]?.accountName);
		}

		// Display the total amount
		totalCell.textContent =
			formatCurrency(transaction.toTotal, currency) ||
			"Multiple accounts";

		row.appendChild(toAccountCell);
		row.appendChild(fromAccountCell);
		row.appendChild(totalCell);

		tbody.appendChild(row);

		tableTotal += transaction.toTotal;
	});

	if (!hideTotal) {
		addTableTotal(tableTotal, currency, tbody);
	}

	table.appendChild(tbody);
	el.appendChild(table);
}

function addTableTotal(
	tableTotal: number,
	currency: string,
	tbody: HTMLTableSectionElement
) {
	const totalRow = document.createElement("tr");
	for (let i = 0; i < 3; i++) {
		const emptyCell = document.createElement("td");
		emptyCell.className = "px-6 py-4 whitespace-nowrap";
		emptyCell.textContent = "";
		totalRow.appendChild(emptyCell);
	}
	const totalTextCell = document.createElement("td");
	totalTextCell.textContent = "Total";
	totalRow.appendChild(totalTextCell);
	const totalCell = document.createElement("td");
	totalCell.textContent = formatCurrency(tableTotal, currency);
	totalRow.appendChild(totalCell);
	tbody.appendChild(totalRow);
}

export function createNestedTransactionList(
	el: HTMLElement,
	data: Transaction[],
	currency: string
): void {
	const ul = document.createElement("ul");
	ul.className = "list-none p-0";

	data.forEach((transaction) => {
		const li = document.createElement("li");
		li.className = "mb-4";

		const header = document.createElement("div");
		header.className = "flex justify-between items-center p-2";

		const dateDescription = document.createElement("div");
		const formattedDate = formatDisplayDate(transaction.date);
		dateDescription.textContent = `${formattedDate} - ${transaction.description}`;
		header.appendChild(dateDescription);

		const total = document.createElement("div");

		// Create the "Total:" text
		const totalText = document.createElement("span");
		totalText.textContent = "Total: ";

		// Create the formatted currency span
		const formattedCurrency = document.createElement("span");
		formattedCurrency.classList.add("font-bold");
		formattedCurrency.textContent =
			formatCurrency(transaction.toTotal, currency) || "";

		// Append the created elements to the total element
		total.appendChild(totalText);
		total.appendChild(formattedCurrency);
		header.appendChild(total);

		li.appendChild(header);

		const entriesList = document.createElement("ul");
		entriesList.className = "list-none p-0 ml-4";

		transaction.entries.forEach((entry) => {
			const entryLi = document.createElement("li");

			const amountColor =
				entry.amount! > 0
					? "text-green-400"
					: entry.amount! < 0
					? "text-red-400"
					: "inherit";

			// Create DOM elements for the account name, amount, and currency
			const accountNameSpan = document.createElement("span");
			formatAccountName(accountNameSpan, entry.accountName);

			const amountSpan = document.createElement("span");
			amountSpan.classList.add("font-bold", amountColor);
			amountSpan.textContent = formatCurrency(
				entry.amount ?? 0,
				currency
			);

			// Append the created elements to the entryLi element
			entryLi.appendChild(accountNameSpan);
			entryLi.appendChild(document.createTextNode(": ")); // Add space between account name and amount
			entryLi.appendChild(amountSpan);
			entriesList.appendChild(entryLi);
		});

		li.appendChild(entriesList);
		ul.appendChild(li);
	});

	el.appendChild(ul);
}
