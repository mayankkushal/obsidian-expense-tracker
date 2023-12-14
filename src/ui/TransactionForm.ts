import { PopoverSuggest } from "obsidian";

const ALL_BOOKS = [
	{
		title: "How to Take Smart Notes",
		author: "Sönke Ahrens",
	},
	{
		title: "Thinking, Fast and Slow",
		author: "Daniel Kahneman",
	},
	{
		title: "Deep Work",
		author: "Cal Newport",
	},
];

export class ExampleModal extends PopoverSuggest<any> {
	getSuggestions() {
		return this.app.vault.getMarkdownFiles();
	}

	open() {
		console.log("opne called");
		super.open();
	}

	renderSuggestion(value: any, el: HTMLElement) {
		el.appendText(value.name);
	}

	selectSuggestion(value: any, evt: MouseEvent | KeyboardEvent) {
		console.log("selectSuggestion", value);
	}
}

export function createTransactionForm(
	el: HTMLElement,
	onSubmit: Function,
	app: any
): void {
	const form = document.createElement("form");
	form.className = "max-w-md mx-auto p-4 bg-transparent shadow-md rounded-md";

	// Date field
	const dateLabel = document.createElement("label");
	dateLabel.className = "block text-sm font-medium";
	dateLabel.textContent = "Date";
	const dateInput = document.createElement("input");
	dateInput.type = "date";
	dateInput.className = "mt-1 p-2 block w-full rounded-md border-gray-300";
	dateInput.value = new Date().toISOString().split("T")[0]; // Default to today
	dateLabel.appendChild(dateInput);
	form.appendChild(dateLabel);

	// Description Field
	const descriptionLabel = document.createElement("label");
	descriptionLabel.className = "block text-sm font-medium";
	descriptionLabel.textContent = "Description";
	const descriptionInput = document.createElement("input");
	descriptionInput.type = "text";
	descriptionInput.className =
		"mt-1 p-2 block w-full rounded-md border-gray-300";
	descriptionLabel.appendChild(descriptionInput);
	form.appendChild(descriptionLabel);

	// Transactions fields
	const transactionsLabel = document.createElement("label");
	transactionsLabel.className = "block mt-4 font-medium";
	transactionsLabel.textContent = "Accounts";
	form.appendChild(transactionsLabel);

	// Divider
	const divider = document.createElement("hr");
	divider.className = "my-2";
	form.appendChild(divider);

	const transactionsContainer = document.createElement("div");
	transactionsContainer.className = "grid grid-cols-2 gap-4";

	// Function to add a new row
	function addRow() {
		const accountLabel = document.createElement("label");
		accountLabel.className = "block text-sm font-medium";
		accountLabel.textContent = "Account";
		const accountInput = document.createElement("input");
		accountInput.type = "text";
		accountInput.className =
			"accountInput mt-1 p-2 block w-full rounded-md border-gray-300";

		const modal = new ExampleModal(app);
		accountInput.addEventListener("focus", (event) => {
			modal.open();
		});

		accountLabel.appendChild(accountInput);
		const amountLabel = document.createElement("label");
		amountLabel.className = "block text-sm font-medium";
		amountLabel.textContent = "Amount";
		const amountInput = document.createElement("input");
		amountInput.type = "number";
		amountInput.className =
			"amountInput mt-1 p-2 block w-full rounded-md border-gray-300";
		amountLabel.appendChild(amountInput);

		transactionsContainer.appendChild(accountLabel);
		transactionsContainer.appendChild(amountLabel);
	}

	// Initial rows
	for (let i = 0; i < 2; i++) {
		addRow();
	}

	form.appendChild(transactionsContainer);

	// Button Container
	const buttonContainer = document.createElement("div");
	buttonContainer.className = "flex justify-between content-center";

	// Plus button to add more rows
	const plusButton = document.createElement("button");
	plusButton.type = "button";
	plusButton.className =
		"mt-2 bg-green-500 text-white p-2 rounded-md hover:bg-green-600";
	plusButton.textContent = "+ Account";
	plusButton.addEventListener("click", addRow);
	buttonContainer.appendChild(plusButton);

	// Submit button
	const submitButton = document.createElement("button");
	submitButton.type = "submit";
	submitButton.className =
		"mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600";
	submitButton.textContent = "Submit";
	buttonContainer.appendChild(submitButton);

	form.appendChild(buttonContainer);

	// Event listener for form submission
	form.addEventListener("submit", (event) => {
		event.preventDefault(); // Prevent the default form submission behavior

		// Extract values from the form elements
		const dateValue = dateInput.value;
		const descriptionValue = descriptionInput?.value || '""';

		const transactionsData = [];
		const accountInputs = form.querySelectorAll(".accountInput");
		const amountInputs = form.querySelectorAll(".amountInput");

		for (let i = 0; i < accountInputs.length; i++) {
			const account = (accountInputs[i] as HTMLInputElement).value;
			const amount = parseFloat(
				(amountInputs[i] as HTMLInputElement).value
			);

			transactionsData.push({ account, amount });
		}

		// Do something with the extracted data
		console.log("Submitted Date:", dateValue);
		console.log("Submitted Transactions Data:", transactionsData);

		onSubmit(dateValue, descriptionValue, transactionsData);

		// Reset the form or perform additional actions as needed
		form.reset();
	});

	el.appendChild(form);
}
