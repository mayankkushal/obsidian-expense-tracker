import { moment } from "obsidian";
import { Account } from "./account";
import { Controller, ControllerAnalyzer } from "./controller";

class Query {
	controller: Controller;
	analyzer: ControllerAnalyzer;

	setController(controller: Controller) {
		this.controller = controller;
		this.analyzer = new ControllerAnalyzer(controller);
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

	execute() {}
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
	filters: Filter[];

	constructor(filters: Filter[]) {
		super();
		this.filters = filters;
	}

	getFilter(key: string) {
		return this.filters.find((f) => f.key === key);
	}

	execute(): Account | Account[] | undefined {
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

		console.log(account);

		return account;
	}
}
