import { AbstractInputSuggest } from "obsidian";
import { Controller } from "src/models/controller";
import { Button } from "./Button";
import { CheckboxContainer } from "./Checkbox";
import { Tab } from "./Tab";

export class AccountSuggest extends AbstractInputSuggest<string> {
	textInputEl: HTMLInputElement;
	controller: Controller;

	constructor(
		app: any,
		textInputEl: HTMLInputElement,
		controller: Controller
	) {
		super(app, textInputEl);
		this.textInputEl = textInputEl;
		this.controller = controller;
	}

	getSuggestions(inputStr: string): string[] {
		return [...this.controller.accounts].filter((account) =>
			account.toLowerCase().contains(inputStr.toLowerCase())
		);
	}

	renderSuggestion(account: string, el: HTMLElement) {
		el.setText(account);
	}

	selectSuggestion(account: string) {
		this.textInputEl.value = account;
		this.textInputEl.trigger("input");
		this.close();
	}
}

export class DescriptionSuggest extends AbstractInputSuggest<string> {
	textInputEl: HTMLInputElement;
	controller: Controller;

	constructor(
		app: any,
		textInputEl: HTMLInputElement,
		controller: Controller
	) {
		super(app, textInputEl);
		this.textInputEl = textInputEl;
		this.controller = controller;
	}

	getSuggestions(inputStr: string): string[] {
		return Object.keys(this.controller.recurringMap).filter((account) =>
			account.toLowerCase().contains(inputStr.toLowerCase())
		);
	}

	renderSuggestion(account: string, el: HTMLElement) {
		el.setText(account);
	}

	selectSuggestion(account: string) {
		this.textInputEl.value = account;
		this.textInputEl.trigger("input");
		this.close();
	}
}

export function createTransactionForm(
	el: HTMLElement,
	onSubmit: Function,
	app: any,
	controller: Controller
): void {
	const container = document.createElement("div");
	container.className = "max-w-md mx-auto bg-transparent";

	// Tabs
	const tabsContainer = document.createElement("div");
	tabsContainer.className = "flex";
	container.appendChild(tabsContainer);

	const generalTab = Tab({ text: "General", defaultActive: true });
	tabsContainer.appendChild(generalTab);

	const advancedTab = Tab({ text: "Advanced" });
	tabsContainer.appendChild(advancedTab);

	const formsContainer = document.createElement("div");
	container.appendChild(formsContainer);

	const generalForm = createGeneralForm(app, controller, onSubmit);

	formsContainer.appendChild(generalForm);

	// Advanced Form (initially hidden)
	const advancedForm = createAdvanceForm(
		formsContainer,
		app,
		controller,
		onSubmit
	);

	// Toggle between tabs
	generalTab.addEventListener("click", () => {
		generalTab.classList.add("active");
		advancedTab.classList.remove("active");
		generalForm.classList.remove("hidden");
		advancedForm.classList.add("hidden");
	});

	advancedTab.addEventListener("click", () => {
		advancedTab.classList.add("active");
		generalTab.classList.remove("active");
		advancedForm.classList.remove("hidden");
		generalForm.classList.add("hidden");
	});

	el.appendChild(container);
}

function createGeneralForm(
	app: any,
	controller: Controller,
	onSubmit: Function
) {
	const generalForm = document.createElement("form");
	generalForm.className = "form-general max-w-md mx-auto p-4 bg-transparent";

	// Date field
	const dateLabel = document.createElement("label");
	dateLabel.className = "block text-sm font-medium";
	dateLabel.textContent = "Date";
	const dateInput = document.createElement("input");
	dateInput.type = "date";
	dateInput.className = "mt-1 p-2 block w-full rounded-md border-gray-300";
	dateInput.value = new Date().toISOString().split("T")[0]; // Default to today
	dateLabel.appendChild(dateInput);
	generalForm.appendChild(dateLabel);

	// Description Field
	const descriptionLabel = document.createElement("label");
	descriptionLabel.className = "block text-sm font-medium";
	descriptionLabel.textContent = "Description";
	const descriptionInput = document.createElement("input");
	descriptionInput.type = "text";
	descriptionInput.className =
		"mt-1 p-2 block w-full rounded-md border-gray-300";
	descriptionLabel.appendChild(descriptionInput);
	generalForm.appendChild(descriptionLabel);

	// Recurring checkbox
	const recurringLabel = document.createElement("label");
	recurringLabel.className = "block font-medium";
	recurringLabel.textContent = "Recurring";

	const recurringCheckbox = document.createElement("input");
	recurringCheckbox.type = "checkbox";
	recurringCheckbox.className = "mr-2";

	generalForm.appendChild(
		CheckboxContainer(recurringLabel, recurringCheckbox)
	);

	// Recurring inputs (hidden by default)
	const recurringInputs = document.createElement("div");
	recurringInputs.className =
		"recurring-inputs hidden grid grid-cols-3 gap-4";

	// Interval input
	const intervalLabel = document.createElement("label");
	intervalLabel.className = "block text-sm font-medium";
	intervalLabel.textContent = "Interval";
	const intervalInput = document.createElement("input");
	intervalInput.type = "number";

	intervalInput.className =
		"intervalInput mt-1 p-2 block w-full rounded-md border-gray-300";
	intervalLabel.appendChild(intervalInput);
	recurringInputs.appendChild(intervalLabel);

	// Frequency dropdown
	const frequencyLabel = document.createElement("label");
	frequencyLabel.className = "block text-sm font-medium";
	frequencyLabel.textContent = "Frequency";
	const frequencyInput = document.createElement("select");
	frequencyInput.className =
		"frequencyInput mt-1 px-2 block w-full rounded-md border-gray-300";

	// Add frequency options (you can customize this based on your needs)
	["day", "week", "month", "year"].forEach((option) => {
		const optionElement = document.createElement("option");
		optionElement.value = option.toLowerCase();
		optionElement.textContent = option;
		frequencyInput.appendChild(optionElement);
	});

	frequencyLabel.appendChild(frequencyInput);
	recurringInputs.appendChild(frequencyLabel);

	// End date input
	const endLabel = document.createElement("label");
	endLabel.className = "block text-sm font-medium";
	endLabel.textContent = "End Date";
	const endInput = document.createElement("input");
	endInput.type = "date";
	endInput.className =
		"endInput mt-1 p-2 block w-full rounded-md border-gray-300";
	endLabel.appendChild(endInput);
	recurringInputs.appendChild(endLabel);

	generalForm.appendChild(recurringInputs);

	// Event listener for recurring checkbox
	recurringCheckbox.addEventListener("change", () => {
		recurringInputs.classList.toggle("hidden", !recurringCheckbox.checked);
	});

	// Transactions fields
	const transactionsLabel = document.createElement("label");
	transactionsLabel.className = "block mt-4 font-medium";
	transactionsLabel.textContent = "Accounts";
	generalForm.appendChild(transactionsLabel);

	// Divider
	const divider = document.createElement("hr");
	divider.className = "my-2";
	generalForm.appendChild(divider);

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

		new AccountSuggest(app, accountInput, controller);

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

	generalForm.appendChild(transactionsContainer);

	// Button Container
	const buttonContainer = document.createElement("div");
	buttonContainer.className = "flex justify-between content-center mt-2";

	// Plus button to add more rows
	const plusButton = Button({
		htmlType: "button",
		content: "+ Account",
	});
	plusButton.addEventListener("click", addRow);
	buttonContainer.appendChild(plusButton);

	// Submit button
	const submitButton = Button({
		htmlType: "submit",
		content: "Submit",
		type: "primary",
	});
	buttonContainer.appendChild(submitButton);

	generalForm.appendChild(buttonContainer);

	// Event listener for form submission
	generalForm.addEventListener("submit", (event) => {
		event.preventDefault(); // Prevent the default form submission behavior

		// Extract values from the form elements
		const date = dateInput.value;
		const description = descriptionInput?.value || '""';
		const isRecurring = recurringCheckbox.checked;
		const interval = isRecurring ? parseInt(intervalInput.value) : null;
		const frequency = isRecurring ? frequencyInput.value : null;
		const endDate = isRecurring ? endInput.value : null;

		const transactionsData = [];
		const accountInputs = generalForm.querySelectorAll(".accountInput");
		const amountInputs = generalForm.querySelectorAll(".amountInput");

		if (isRecurring && !frequency) {
			alert("Please select a frequency for the recurring transaction.");
			return; // Prevent form submission if frequency is not selected
		}

		for (let i = 0; i < accountInputs.length; i++) {
			const account = (accountInputs[i] as HTMLInputElement).value;
			const amount = parseFloat(
				(amountInputs[i] as HTMLInputElement).value
			);

			transactionsData.push({ account, amount });
		}

		onSubmit({
			date,
			description,
			isRecurring,
			interval,
			frequency,
			endDate,
			accounts: transactionsData,
		});

		// Reset the form or perform additional actions as needed
		generalForm.reset();
	});
	return generalForm;
}

function createAdvanceForm(
	formsContainer: HTMLDivElement,
	app: any,
	controller: Controller,
	onSubmit: Function
) {
	const advancedForm = document.createElement("form");
	advancedForm.className =
		"form-advanced max-w-md mx-auto p-4 bg-transparent hidden";

	// Date field
	const dateLabel = document.createElement("label");
	dateLabel.className = "block text-sm font-medium";
	dateLabel.textContent = "Date";
	const dateInput = document.createElement("input");
	dateInput.type = "date";
	dateInput.className = "mt-1 p-2 block w-full rounded-md border-gray-300";
	dateInput.value = new Date().toISOString().split("T")[0]; // Default to today
	dateLabel.appendChild(dateInput);
	advancedForm.appendChild(dateLabel);

	// Description Field
	const descriptionLabel = document.createElement("label");
	descriptionLabel.className = "block text-sm font-medium";
	descriptionLabel.textContent = "Description";
	const descriptionInput = document.createElement("input");
	descriptionInput.type = "text";
	descriptionInput.className =
		"mt-1 p-2 block w-full rounded-md border-gray-300";
	descriptionLabel.appendChild(descriptionInput);
	advancedForm.appendChild(descriptionLabel);

	new DescriptionSuggest(app, descriptionInput, controller);

	// Boolean container
	const booleanContainer = document.createElement("div");
	booleanContainer.className = "flex space-x-4 mt-2";

	// isCreated and isEnded checkboxes
	const isCreatedLabel = document.createElement("label");
	isCreatedLabel.className = "block text-sm font-medium";
	isCreatedLabel.textContent = "Is Created";
	const isCreatedCheckbox = document.createElement("input");
	isCreatedCheckbox.type = "checkbox";
	isCreatedCheckbox.className = "mt-1";
	booleanContainer.appendChild(
		CheckboxContainer(isCreatedLabel, isCreatedCheckbox)
	);

	const isEndedLabel = document.createElement("label");
	isEndedLabel.className = "block text-sm font-medium";
	isEndedLabel.textContent = "Is Ended";
	const isEndedCheckbox = document.createElement("input");
	isEndedCheckbox.type = "checkbox";
	isEndedCheckbox.className = "mt-1";
	booleanContainer.appendChild(
		CheckboxContainer(isEndedLabel, isEndedCheckbox)
	);

	advancedForm.appendChild(booleanContainer);

	// Button Container
	const buttonContainer = document.createElement("div");
	buttonContainer.className = "flex justify-end";
	// Submit button
	const submitButton = Button({
		htmlType: "submit",
		content: "Submit",
		type: "primary",
	});

	buttonContainer.appendChild(submitButton);

	advancedForm.appendChild(buttonContainer);

	// Event listener for form submission
	advancedForm.addEventListener("submit", (event) => {
		event.preventDefault(); // Prevent the default form submission behavior

		// Extract values from the form elements
		const date = dateInput.value;
		const description = descriptionInput?.value || '""';
		const isCreated = isCreatedCheckbox.checked;
		const isEnded = isEndedCheckbox.checked;

		onSubmit(null, { date, description, isCreated, isEnded });

		// Reset the form or perform additional actions as needed
		advancedForm.reset();
	});

	formsContainer.appendChild(advancedForm);
	return advancedForm;
}
