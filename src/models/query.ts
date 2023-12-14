import { moment } from "obsidian";
import { BalanceView } from "src/ui/BalanceView";
import { TransactionView } from "src/ui/TransactionView";
import { Controller, ControllerAnalyzer } from "./controller";

class Query {
	controller: Controller;
	analyzer: ControllerAnalyzer;
	filters: Filter[];

	constructor(filters: Filter[]) {
		this.filters = filters;
	}

	setController(controller: Controller) {
		this.controller = controller;
		this.analyzer = new ControllerAnalyzer(controller);
	}

	getFilter(key: string) {
		return this.filters.find((f) => f.key === key);
	}

	getFilters(key: string) {
		return this.filters.filter((f) => f.key === key);
	}

	getDateRange(filter: Filter): [Date, Date] {
		const today = moment();
		let startDate: moment.Moment;
		let endDate: moment.Moment;

		switch (filter.operator) {
			case "current":
				startDate = moment().startOf(filter.value as any);
				endDate = moment().endOf(filter.value as any);
				break;
			case "last":
				startDate = moment()
					.subtract(1, filter.value as any)
					.startOf(filter.value as any);
				endDate = moment()
					.subtract(1, filter.value as any)
					.endOf(filter.value as any);
				break;
			default:
				throw new Error("Invalid operator");
		}

		return [startDate.toDate(), endDate.toDate()];
	}

	execute(el: HTMLElement) {}
}

export class Filter {
	key: string;
	operator: string;
	value: string;

	constructor(key: string, operator: string, value: string) {
		this.key = key;
		this.operator = operator;
		this.value = value;
	}
}

export class BalanceQuery extends Query {
	execute(el: HTMLElement) {
		const accountName = this.getFilter("account");
		const date = this.getFilter("date");
		const structure = this.getFilter("structure");

		if (!accountName) {
			throw new Error("Account name is required");
		}

		let filters: any = {};

		filters["accountName"] = accountName.value;

		if (date) {
			const [startDate, endDate] = this.getDateRange(date);
			filters = { ...filters, startDate, endDate };
		}

		const transactions = this.analyzer.filter(filters);

		const account = this.analyzer.getAccount(
			accountName.value,
			transactions,
			structure?.value
		);

		BalanceView(el, account);
	}
}

export class TransactionQuery extends Query {
	execute(el: HTMLElement) {
		const accountName = this.getFilter("account");
		const date = this.getFilter("date");
		const structure = this.getFilter("structure");
		const limit = this.getFilter("limit");
		const orders = this.getFilters("order");

		let filters: any = {};

		filters["accountName"] = accountName?.value;

		if (date) {
			const [startDate, endDate] = this.getDateRange(date);
			filters = { ...filters, startDate, endDate };
		}

		let transactions = this.analyzer.filter(filters);

		if (orders.length) {
			transactions = this.analyzer.orderByFields(transactions, orders);
		}

		if (limit) {
			transactions = this.analyzer.filterByLimit(
				transactions,
				limit.operator as any,
				limit.value as any
			);
		}

		console.log(transactions);

		TransactionView(el, transactions, structure?.value);
	}
}
