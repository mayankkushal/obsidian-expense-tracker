import { moment } from "obsidian";
import PtaPlugin from "src/main";
import { BalanceView, IBalanceView } from "src/ui/BalanceView";
import { ITransactionView, TransactionView } from "src/ui/TransactionView";
import { Controller, ControllerAnalyzer } from "./controller";

export class Filter {
	key: string;
	operator: string;
	value: string;

	constructor(key: string, operator: string = "", value: string = "") {
		this.key = key;
		this.operator = operator;
		this.value = value;
	}
}

export class Exclude extends Filter {}

class Query {
	controller: Controller;
	analyzer: ControllerAnalyzer;
	filters: Filter[];
	excludes: Exclude[];

	constructor(filters: Filter[] = [], excludes: Exclude[] = []) {
		this.filters = filters;
		this.excludes = excludes;
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

	getExclude(key: string) {
		return this.excludes.find((f) => f.key === key);
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
				startDate = moment().startOf(
					filter.value as moment.unitOfTime.StartOf
				);
				endDate = moment().endOf(
					filter.value as moment.unitOfTime.StartOf
				);
				break;
			case "last":
				startDate = moment()
					.subtract(
						1,
						filter.value as moment.unitOfTime.DurationConstructor
					)
					.startOf(filter.value as moment.unitOfTime.StartOf);
				endDate = moment()
					.subtract(
						1,
						filter.value as moment.unitOfTime.DurationConstructor
					)
					.endOf(filter.value as moment.unitOfTime.StartOf);
				break;
			case "range":
				let [startDateStr, endDateStr] = filter.value.split(",");
				// convert str to date, expected format is YYYY-MM-DD
				startDate = moment(startDateStr, "YYYY-MM-DD");
				endDate = moment(endDateStr, "YYYY-MM-DD");
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

		let filters: { [key: string]: any } = {};

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
	buildFilters() {
		const accountName = this.getFilter("account");
		const date = this.getFilter("date");

		let filters: any = {};

		filters["accountName"] = accountName?.value;

		if (date) {
			const [startDate, endDate] = this.getDateRange(date);
			filters = { ...filters, startDate, endDate };
		}

		return filters;
	}

	buildExcludes() {
		const account = this.getExclude("account");
		const date = this.getExclude("date");
		const description = this.getExclude("description");

		let excludes: { [key: string]: any } = { account, description };

		if (date) {
			const [startDate, endDate] = this.getDateRange(date);
			excludes = { ...excludes, startDate, endDate };
		}

		return excludes;
	}

	execute(el: HTMLElement, plugin: PtaPlugin) {
		const structure = this.getFilter("structure");

		const limit = this.getFilter("limit");
		const orders = this.getFilters("order");
		const hides = this.getFilters("hide");

		const filters = this.buildFilters();
		const excludes = this.buildExcludes();

		let transactions = this.analyzer.filter(filters);

		transactions = this.analyzer.exclude({ transactions, ...excludes });

		if (orders.length) {
			transactions = this.analyzer.orderByFields(transactions, orders);
		}

		if (limit) {
			transactions = this.analyzer.filterByLimit(
				transactions,
				limit.operator,
				parseInt(limit.value)
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
