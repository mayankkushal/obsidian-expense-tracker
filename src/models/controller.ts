import { AccountHierarchy } from "./account";
import { Transaction } from "./transaction";

export class Controller {
	transactions: Transaction[];
	accountHierarchy: AccountHierarchy;

	constructor() {
		this.transactions = [];
		this.accountHierarchy = new AccountHierarchy();
	}

	addTransaction(transaction: Transaction) {
		this.transactions.push(transaction);
	}

	getTransactions(): Transaction[] {
		return this.transactions;
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
			filteredTransactions = this.filterByAccount(accountName);
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

		let finalTransactions: Transaction[] = [];
		const accountRegex = new RegExp(accountName);

		workingTransactions.forEach((transaction) => {
			transaction.entries.forEach((entry) => {
				if (accountRegex.test(entry.accountName)) {
					finalTransactions.push(transaction);
				}
			});
		});
		return finalTransactions;
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
}
