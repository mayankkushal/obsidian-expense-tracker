import { AccountHierarchy } from "./account";
import { Exclude, Filter } from "./query";
import { RecEvent, RecurringTransaction } from "./recurring";
import { Transaction } from "./transaction";

export class Controller {
	transactions: Transaction[];
	recurringTransactions: RecurringTransaction[] = [];
	accountHierarchy: AccountHierarchy;
	accounts = new Set<string>();
	recurringMap: { [key: string]: RecurringTransaction } = {};

	constructor() {
		this.transactions = [];
		this.accountHierarchy = new AccountHierarchy();
	}

	addTransaction(transaction: Transaction) {
		this.transactions.push(transaction);
		transaction.entries.forEach((entry) => {
			this.accounts.add(entry.accountName);
		});
	}

	addRecurringTransaction(transaction: RecurringTransaction) {
		this.recurringTransactions.push(transaction);
		transaction.entries.forEach((entry) => {
			this.accounts.add(entry.accountName);
		});
		this.recurringMap[transaction.description] = transaction;
	}

	addRecEvent(transactionCreated: RecEvent) {
		const transaction = this.recurringMap[transactionCreated.id];
		if (transaction) {
			transaction.addRecEvent(transactionCreated);
		}
	}

	getTransactions(): Transaction[] {
		return this.transactions;
	}

	getRecurringTransactions(): RecurringTransaction[] {
		return this.recurringTransactions;
	}

	checkRecurringTransactions(
		onTrue: (transaction: RecurringTransaction, date: Date) => void
	) {
		const currentDate = new Date();
		this.recurringTransactions
			.filter((transaction) => !transaction.isEnded)
			.forEach((transaction) => {
				const valid = transaction.shouldCreateTransaction(currentDate);
				if (valid && valid.shouldCreate) {
					onTrue(transaction, valid.nextOccurrenceDate);
				}
			});
	}
}

export class ControllerAnalyzer {
	controller: Controller;

	constructor(controller: Controller) {
		this.controller = controller;
	}

	filter({
		accountName,
		startDate,
		endDate,
		minAmount,
		maxAmount,
	}: {
		accountName?: string;
		startDate?: Date;
		endDate?: Date;
		minAmount?: number;
		maxAmount?: number;
	}) {
		let filteredTransactions = this.controller.getTransactions();

		if (accountName) {
			filteredTransactions = this.filterByAccount(
				accountName,
				filteredTransactions
			);
		}

		if (startDate && endDate) {
			filteredTransactions = this.filterByDateRange(
				startDate,
				endDate,
				filteredTransactions
			);
		}

		if (minAmount && maxAmount) {
			filteredTransactions = this.filterByAmount(
				minAmount,
				maxAmount,
				filteredTransactions
			);
		}

		return filteredTransactions;
	}

	exclude({
		transactions,
		account,
		description,
		startDate,
		endDate,
	}: {
		transactions?: Transaction[];
		account?: string;
		description?: Exclude;
		startDate?: Date;
		endDate?: Date;
	}) {
		if (!transactions) {
			transactions = this.controller.getTransactions();
		}

		if (account) {
			transactions = this.excludeByAccount(account, transactions);
		}

		if (description) {
			transactions = this.excludeByDescription(description, transactions);
		}

		if (startDate && endDate) {
			transactions = this.excludeByDateRange(
				startDate,
				endDate,
				transactions
			);
		}

		return transactions;
	}

	isAll(accountName: string) {
		return accountName === "*" || accountName === "all";
	}

	getAccount(
		accountName: string,
		transactions?: Transaction[],
		dimension?: string
	) {
		const workingTransactions =
			transactions || this.controller.getTransactions();
		const hierarchy = new AccountHierarchy();

		workingTransactions.forEach((transaction) => {
			transaction.entries.forEach((entry) => {
				hierarchy.addAccount(
					entry.accountName,
					entry.amount || 0,
					transaction.date
				);
			});
		});

		if (this.isAll(accountName) && dimension === "flat") {
			return Object.values(hierarchy.accountIndex).filter(
				(account) => account.root
			);
		}

		const accountRegex = new RegExp(accountName);
		let finalAccount = undefined;

		finalAccount = Object.values(hierarchy.accountIndex).find((account) =>
			accountRegex.test(account.path)
		);

		if (dimension === "flat") {
			return finalAccount?.children;
		}

		return finalAccount;
	}

	filterByAccount(
		accountName: string,
		transactions?: Transaction[]
	): Transaction[] {
		const workingTransactions =
			transactions || this.controller.getTransactions() || [];

		if (this.isAll(accountName)) {
			return workingTransactions;
		}

		let finalTransactions = new Set<Transaction>();
		const accountRegex = new RegExp(accountName);

		workingTransactions.forEach((transaction) => {
			transaction.entries.forEach((entry) => {
				if (accountRegex.test(entry.accountName)) {
					finalTransactions.add(transaction);
				}
			});
		});
		return Array.from(finalTransactions);
	}

	excludeByAccount(
		accountName: string,
		transactions?: Transaction[]
	): Transaction[] {
		const workingTransactions =
			transactions || this.controller.getTransactions() || [];
		const accountRegex = new RegExp(accountName);

		return workingTransactions.filter((transaction) => {
			const hasMatchingAccount = transaction.entries.some((entry) =>
				accountRegex.test(entry.accountName)
			);
			return !hasMatchingAccount;
		});
	}

	excludeByDescription(
		description: Exclude,
		transactions?: Transaction[]
	): Transaction[] {
		const workingTransactions =
			transactions || this.controller.getTransactions() || [];
		const accountRegex = new RegExp(description.value);

		return workingTransactions.filter(
			(transaction) => !accountRegex.test(transaction.description || "")
		);
	}

	filterByDateRange(
		startDate: Date,
		endDate: Date,
		transactions?: Transaction[]
	): Transaction[] {
		const workingTransactions =
			transactions || this.controller.getTransactions() || [];

		return workingTransactions.filter(
			(transaction) =>
				transaction.date >= startDate && transaction.date <= endDate
		);
	}

	excludeByDateRange(
		startDate: Date,
		endDate: Date,
		transactions?: Transaction[]
	): Transaction[] {
		const workingTransactions =
			transactions || this.controller.getTransactions() || [];

		return workingTransactions.filter(
			(transaction) =>
				transaction.date <= startDate || transaction.date >= endDate
		);
	}

	filterByAmount(
		minAmount: number,
		maxAmount: number,
		transactions?: Transaction[]
	): Transaction[] {
		const workingTransactions =
			transactions || this.controller.getTransactions() || [];
		return workingTransactions.filter((transaction) =>
			transaction.entries.some(
				(entry) =>
					entry.amount !== undefined &&
					entry.amount >= minAmount &&
					entry.amount <= maxAmount
			)
		);
	}

	filterByLimit(
		transactions: Transaction[],
		operator: "first" | "last",
		limit: number
	): Transaction[] {
		if (limit <= 0) {
			return [];
		}

		if (operator === "first") {
			return transactions.slice(0, limit);
		} else if (operator === "last") {
			return transactions.slice(-limit);
		}

		return transactions;
	}

	orderByFields(
		transactions: Transaction[],
		sortingCriteria: Filter[]
	): Transaction[] {
		return [...transactions].sort((a, b) => {
			for (const criteria of sortingCriteria) {
				const valueA = this.getSortValue(a, criteria.value);
				const valueB = this.getSortValue(b, criteria.value);

				if (valueA < valueB) {
					return criteria.operator === "asc" ? -1 : 1;
				} else if (valueA > valueB) {
					return criteria.operator === "asc" ? 1 : -1;
				}
			}

			return 0; // If all criteria are equal, maintain the original order
		});
	}

	private getSortValue(transaction: Transaction, field: string): any {
		switch (field) {
			case "date":
				return transaction.date.getTime();
			case "amount":
				return transaction.toTotal;
			default:
				return null;
		}
	}
}
