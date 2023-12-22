import { moment } from "obsidian";
import PtaPlugin from "src/main";
import { BalanceView, IBalanceView } from "src/ui/BalanceView";
import { ITransactionView, TransactionView } from "src/ui/TransactionView";
import { Controller, ControllerAnalyzer } from "./controller";

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

	/**
	 * Finds and returns a filter object from the filters array that matches the given key.
	 *
	 * @param {string} key - The key to search for in the filters array.
	 * @return {object} - The filter object that matches the given key, or undefined if no match is found.
	 */
	getFilter(key: string) {
		return this.filters.find((f) => f.key === key);
	}

	/**
	 * Retrieves the filters that match the specified key.
	 *
	 * @param {string} key - The key to match against the filters.
	 * @return {Array<Filter>} An array of filters that match the key.
	 */
	getFilters(key: string): Array<Filter> {
		return this.filters.filter((f) => f.key === key);
	}

	/**
	 * Generates the date range based on the provided filter.
	 *
	 * @param {Filter} filter - The filter object to determine the date range.
	 * @return {[Date, Date]} The start and end dates of the generated range.
	 */
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

	execute(el: HTMLElement, plugin: PtaPlugin) {}
}

export class BalanceQuery extends Query {
	execute(el: HTMLElement, plugin: PtaPlugin) {
		const accountName = this.getFilter("account");
		const date = this.getFilter("date");
		const structure = this.getFilter("structure");
		const hides = this.getFilters("hide");

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

		const kwargs: IBalanceView = {
			el,
			data: account,
			currency: plugin.settings.currency,
		};

		if (hides.length) {
			hides.forEach((hide) => {
				if (hide.value === "creationDate") {
					kwargs.hideCreationDate = true;
				}
				if (hide.value === "path") {
					kwargs.hidePath = true;
				}
			});
		}

		BalanceView(kwargs);
	}
}

export class TransactionQuery extends Query {
	execute(el: HTMLElement, plugin: PtaPlugin) {
		const accountName = this.getFilter("account");
		const date = this.getFilter("date");
		const structure = this.getFilter("structure");
		const limit = this.getFilter("limit");
		const orders = this.getFilters("order");
		const hides = this.getFilters("hide");

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

		const kwargs: ITransactionView = {
			el,
			data: transactions,
			structure: structure?.value,
			currency: plugin.settings.currency,
		};

		if (hides.length) {
			hides.forEach((hide) => {
				if (hide.value === "total") {
					kwargs.hideTotal = true;
				}
			});
		}

		TransactionView(kwargs);
	}
}
